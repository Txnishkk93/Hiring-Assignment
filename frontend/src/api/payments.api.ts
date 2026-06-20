import { apiClient } from './client';
import type { PaymentResult } from '../types';

export interface PaymentInput {
  bookingId: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
  cardHolderName: string;
}

// Payment endpoint returns { success, booking, payment } — not wrapped in data.
export async function processPayment(input: PaymentInput): Promise<PaymentResult> {
  const res = await apiClient.post('/api/payments', input);
  return res.data as PaymentResult;
}
