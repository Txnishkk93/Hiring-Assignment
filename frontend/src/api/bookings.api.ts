import { apiClient, unwrapData } from './client';
import type { Booking } from '../types';

export async function createBooking(showtimeId: string, seatIds: string[]): Promise<Booking> {
  const res = await apiClient.post('/api/bookings', { showtimeId, seatIds });
  return unwrapData<Booking>(res);
}

export async function getBookings(): Promise<Booking[]> {
  const res = await apiClient.get('/api/bookings');
  return unwrapData<Booking[]>(res);
}

export async function getBooking(id: string): Promise<Booking> {
  const res = await apiClient.get(`/api/bookings/${id}`);
  return unwrapData<Booking>(res);
}

export async function cancelBooking(id: string): Promise<Booking> {
  const res = await apiClient.post(`/api/bookings/${id}/cancel`);
  return unwrapData<Booking>(res);
}
