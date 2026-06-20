import { apiClient, unwrapData } from './client';
import type { Movie } from '../types';

export async function getMovies(status?: 'now_showing' | 'coming_soon'): Promise<Movie[]> {
  const res = await apiClient.get('/api/movies', { params: status ? { status } : {} });
  return unwrapData<Movie[]>(res);
}

export async function getMovie(id: string): Promise<Movie> {
  const res = await apiClient.get(`/api/movies/${id}`);
  return unwrapData<Movie>(res);
}
