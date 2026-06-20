import { apiClient, unwrapData } from './client';
import type { AuthResponse, User } from '../types';

export async function signup(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await apiClient.post('/api/auth/signup', { name, email, password });
  return unwrapData<AuthResponse>(res);
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const res = await apiClient.post('/api/auth/login', { email, password });
  return unwrapData<AuthResponse>(res);
}

export async function getMe(): Promise<{ user: User }> {
  const res = await apiClient.get('/api/auth/me');
  return unwrapData<{ user: User }>(res);
}
