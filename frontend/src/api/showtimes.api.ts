import { apiClient, unwrapData } from './client';
import type { Showtime } from '../types';

export async function getShowtimes(movieId: string, date?: string): Promise<Showtime[]> {
  const res = await apiClient.get('/api/showtimes', {
    params: { movieId, ...(date ? { date } : {}) },
  });
  return unwrapData<Showtime[]>(res);
}

export async function getShowtime(id: string): Promise<Showtime> {
  const res = await apiClient.get(`/api/showtimes/${id}`);
  return unwrapData<Showtime>(res);
}
