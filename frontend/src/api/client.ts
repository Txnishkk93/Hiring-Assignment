import axios, { AxiosError } from 'axios';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export const apiClient = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
});

let authToken: string | null = null;
let onUnauthorized: (() => void) | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

export function setUnauthorizedHandler(handler: () => void) {
  onUnauthorized = handler;
}

apiClient.interceptors.request.use((config) => {
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: Record<string, string> }>) => {
    if (error.response?.status === 401) {
      onUnauthorized?.();
    }
    return Promise.reject(error);
  }
);

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string>;
}

export function unwrapData<T>(response: { data: ApiSuccess<T> }): T {
  return response.data.data;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    return data?.message ?? error.message;
  }
  if (error instanceof Error) return error.message;
  return 'Something went wrong';
}

export function getFieldErrors(error: unknown): Record<string, string> | undefined {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ApiError | undefined;
    return data?.errors;
  }
  return undefined;
}
