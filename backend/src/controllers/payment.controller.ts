import { Response } from 'express';
import { randomUUID } from 'crypto';
import { z } from 'zod';
import { AuthRequest } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';
import { Booking } from '../models/Booking.model';
import { Payment } from '../models/Payment.model';
import { Showtime } from '../models/Showtime.model';

const paymentSchema = z.object({
  bookingId: z.string().min(1, 'bookingId is required'),
  cardNumber: z.string().regex(/^\d{16}$/, 'Card number must be 16 digits'),
  expiryMonth: z.coerce.number().int().min(1).max(12),
  expiryYear: z.coerce.number().int(),
  cvv: z.string().regex(/^\d{3}$/, 'CVV must be 3 digits'),
  cardHolderName: z.string().min(1, 'Card holder name is required'),
});

function validateExpiry(month: number, year: number): string | null {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  if (year < currentYear || (year === currentYear && month < currentMonth)) {
    return 'Card has expired';
  }
  return null;
}

function formatZodErrors(error: z.ZodError): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    errors[issue.path.join('.') || 'body'] = issue.message;
  }
  return errors;
}

export async function processPayment(req: AuthRequest, res: Response) {
  const parsed = paymentSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new AppError(400, 'Validation failed', formatZodErrors(parsed.error));
  }

  const { bookingId, cardNumber, expiryMonth, expiryYear, cvv: _cvv, cardHolderName: _cardHolderName } = parsed.data;

  const expiryError = validateExpiry(expiryMonth, expiryYear);
  if (expiryError) {
    throw new AppError(400, 'Validation failed', { expiry: expiryError });
  }

  const booking = await Booking.findOne({ _id: bookingId, userId: req.user!._id });
  if (!booking) {
    throw new AppError(404, 'Booking not found');
  }

  if (booking.status !== 'pending') {
    throw new AppError(400, `Booking cannot be paid (status: ${booking.status})`);
  }

  // Simulate gateway latency so the frontend can show a loading state.
  await new Promise((r) => setTimeout(r, 1000));

  const cardLast4 = cardNumber.slice(-4);
  const transactionRef = `TXN-${randomUUID()}`;

  // Deterministic rule: cards ending in 0000 always fail (useful for demo videos).
  const paymentSucceeded = !cardNumber.endsWith('0000');

  if (paymentSucceeded) {
    // Atomic update: all requested seats must still be available.
    const updatedShowtime = await Showtime.findOneAndUpdate(
      {
        _id: booking.showtimeId,
        seats: {
          $not: {
            $elemMatch: {
              seatId: { $in: booking.seatIds },
              status: { $ne: 'available' },
            },
          },
        },
      },
      { $set: { 'seats.$[seat].status': 'booked' } },
      {
        arrayFilters: [{ 'seat.seatId': { $in: booking.seatIds } }],
        new: true,
      }
    );

    if (!updatedShowtime) {
      booking.status = 'failed';
      await booking.save();

      const payment = await Payment.create({
        bookingId: booking._id,
        amount: booking.totalAmount,
        cardLast4,
        status: 'failed',
        transactionRef,
      });

      return res.status(409).json({
        success: false,
        message: 'Seats were taken before payment could complete',
        booking,
        payment,
      });
    }

    const qrCode = randomUUID();
    booking.status = 'confirmed';
    booking.qrCode = qrCode;
    await booking.save();

    const payment = await Payment.create({
      bookingId: booking._id,
      amount: booking.totalAmount,
      cardLast4,
      status: 'success',
      transactionRef,
    });

    return res.json({ success: true, booking, payment });
  }

  // Failure path: seats were never marked booked, so nothing to roll back.
  booking.status = 'failed';
  await booking.save();

  const payment = await Payment.create({
    bookingId: booking._id,
    amount: booking.totalAmount,
    cardLast4,
    status: 'failed',
    transactionRef,
  });

  res.json({ success: false, booking, payment });
}
