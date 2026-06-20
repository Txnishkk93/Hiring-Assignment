import mongoose, { Document, Schema, Types } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'failed';

export interface IBooking extends Document {
  userId: Types.ObjectId;
  showtimeId: Types.ObjectId;
  seatIds: string[];
  subtotal: number;
  bookingFee: number;
  totalAmount: number;
  status: BookingStatus;
  qrCode?: string;
  createdAt: Date;
}

const bookingSchema = new Schema<IBooking>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    showtimeId: { type: Schema.Types.ObjectId, ref: 'Showtime', required: true },
    seatIds: [{ type: String }],
    subtotal: { type: Number, required: true },
    bookingFee: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'failed'],
      default: 'pending',
    },
    qrCode: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

bookingSchema.index({ userId: 1 });

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
