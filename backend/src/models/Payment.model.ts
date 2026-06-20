import mongoose, { Document, Schema, Types } from 'mongoose';

export type PaymentStatus = 'success' | 'failed';

export interface IPayment extends Document {
  bookingId: Types.ObjectId;
  amount: number;
  cardLast4: string;
  status: PaymentStatus;
  transactionRef: string;
  createdAt: Date;
}

const paymentSchema = new Schema<IPayment>(
  {
    bookingId: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    amount: { type: Number, required: true },
    cardLast4: { type: String, required: true },
    status: { type: String, enum: ['success', 'failed'], required: true },
    transactionRef: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const Payment = mongoose.model<IPayment>('Payment', paymentSchema);
