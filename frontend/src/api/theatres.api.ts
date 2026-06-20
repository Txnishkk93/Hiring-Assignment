import { apiClient, unwrapData } from './client';
import type { Theatre } from '../types';

export async function getTheatres(): Promise<Theatre[]> {
  const res = await apiClient.get('/api/theatres');
  return unwrapData<Theatre[]>(res);
}
