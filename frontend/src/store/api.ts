import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from './store';
import type { Booking, Movie, Showtime, Theatre } from '../types';

const baseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:4000';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Movies', 'Movie', 'Theatres', 'Showtimes', 'Showtime', 'Bookings', 'Booking'],
  endpoints: (builder) => ({
    getMovies: builder.query<Movie[], 'now_showing' | 'coming_soon' | undefined>({
      query: (status) => ({
        url: '/api/movies',
        params: status ? { status } : undefined,
      }),
      transformResponse: (response: { success: boolean; data: Movie[] }) => response.data,
      providesTags: ['Movies'],
    }),
    getMovie: builder.query<Movie, string>({
      query: (id) => `/api/movies/${id}`,
      transformResponse: (response: { success: boolean; data: Movie }) => response.data,
      providesTags: (_r, _e, id) => [{ type: 'Movie', id }],
    }),
    getTheatres: builder.query<Theatre[], void>({
      query: () => '/api/theatres',
      transformResponse: (response: { success: boolean; data: Theatre[] }) => response.data,
      providesTags: ['Theatres'],
    }),
    getShowtimes: builder.query<Showtime[], { movieId: string; date?: string }>({
      query: ({ movieId, date }) => ({
        url: '/api/showtimes',
        params: { movieId, date },
      }),
      transformResponse: (response: { success: boolean; data: Showtime[] }) => response.data,
      providesTags: ['Showtimes'],
    }),
    getShowtime: builder.query<Showtime, string>({
      query: (id) => `/api/showtimes/${id}`,
      transformResponse: (response: { success: boolean; data: Showtime }) => response.data,
      providesTags: (_r, _e, id) => [{ type: 'Showtime', id }],
    }),
    getBookings: builder.query<Booking[], void>({
      query: () => '/api/bookings',
      transformResponse: (response: { success: boolean; data: Booking[] }) => response.data,
      providesTags: ['Bookings'],
    }),
    getBooking: builder.query<Booking, string>({
      query: (id) => `/api/bookings/${id}`,
      transformResponse: (response: { success: boolean; data: Booking }) => response.data,
      providesTags: (_r, _e, id) => [{ type: 'Booking', id }],
    }),
  }),
});

export const {
  useGetMoviesQuery,
  useGetMovieQuery,
  useGetTheatresQuery,
  useGetShowtimesQuery,
  useGetShowtimeQuery,
  useGetBookingsQuery,
  useGetBookingQuery,
} = api;
