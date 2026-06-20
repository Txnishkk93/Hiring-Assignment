import { Response } from 'express';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { Booking } from '../models/Booking.model';
import { Showtime, ISeat, SeatCategory } from '../models/Showtime.model';
import { Theatre, IPricePerCategory } from '../models/Theatre.model';

const createBookingSchema = z.object({
  showtimeId: z.string().min(1, 'showtimeId is required'),
  seatIds: z.array(z.string()).min(1, 'At least one seat is required'),
});

function getSeatPrice(category: SeatCategory, pricing: IPricePerCategory): number {
  return pricing[category];
}

function findUnavailableSeats(seats: ISeat[], seatIds: string[]): string[] {
  const seatMap = new Map(seats.map((s) => [s.seatId, s]));
  return seatIds.filter((id) => {
    const seat = seatMap.get(id);
    return !seat || seat.status !== 'available';
  });
}

export async function createBooking(req: AuthRequest, res: Response) {
  const parsed = createBookingSchema.safeParse(req.body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      errors[issue.path.join('.') || 'body'] = issue.message;
    }
    throw new AppError(400, 'Validation failed', errors);
  }

  const { showtimeId, seatIds } = parsed.data;
  const showtime = await Showtime.findById(showtimeId);
  if (!showtime) {
    throw new AppError(404, 'Showtime not found');
  }

  const theatre = await Theatre.findById(showtime.theatreId);
  if (!theatre) {
    throw new AppError(404, 'Theatre not found');
  }

  const unavailable = findUnavailableSeats(showtime.seats, seatIds);
  if (unavailable.length > 0) {
    return res.status(409).json({
      success: false,
      message: 'Some seats are no longer available',
      errors: { seatIds: unavailable.join(', ') },
    });
  }

  // Server-side pricing — never trust a client-sent total.
  const seatMap = new Map(showtime.seats.map((s) => [s.seatId, s]));
  const subtotal = seatIds.reduce((sum, id) => {
    const seat = seatMap.get(id)!;
    return sum + getSeatPrice(seat.category, theatre.pricePerCategory);
  }, 0);

  const bookingFee = Number(process.env.BOOKING_FEE);
  const totalAmount = subtotal + bookingFee;

  const booking = await Booking.create({
    userId: req.user!._id,
    showtimeId,
    seatIds,
    subtotal,
    bookingFee,
    totalAmount,
    status: 'pending',
  });

  res.status(201).json({ success: true, data: booking });
}

export async function listBookings(req: AuthRequest, res: Response) {
  const bookings = await Booking.find({ userId: req.user!._id })
    .populate({
      path: 'showtimeId',
      populate: [
        { path: 'movieId', select: 'title posterUrl' },
        { path: 'theatreId', select: 'name location' },
      ],
    })
    .sort({ createdAt: -1 });

  res.json({ success: true, data: bookings });
}

export async function getBooking(req: AuthRequest, res: Response) {
  const booking = await Booking.findOne({
    _id: req.params.id,
    userId: req.user!._id,
  }).populate({
    path: 'showtimeId',
    populate: [
      { path: 'movieId', select: 'title posterUrl durationMinutes' },
      { path: 'theatreId', select: 'name location' },
    ],
  });

  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }

  res.json({ success: true, data: booking });
}

export async function cancelBooking(req: AuthRequest, res: Response) {
  const booking = await Booking.findOne({
    _id: req.params.id,
    userId: req.user!._id,
  });

  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }

  if (booking.status === 'cancelled') {
    throw new AppError(400, 'Booking is already cancelled');
  }

  const wasConfirmed = booking.status === 'confirmed';
  booking.status = 'cancelled';
  await booking.save();

  // Only confirmed bookings had seats marked booked — release them back.
  // In a larger system, wrap booking + seat updates in a Mongo transaction for atomicity.
  if (wasConfirmed && booking.seatIds.length > 0) {
    await Showtime.updateOne(
      { _id: booking.showtimeId },
      { $set: { 'seats.$[seat].status': 'available' } },
      { arrayFilters: [{ 'seat.seatId': { $in: booking.seatIds } }] }
    );
  }

  res.json({ success: true, data: booking });
}
