export interface User {
  id: string;
  name: string;
  email: string;
  createdAt?: string;
}

export interface CastMember {
  name: string;
  role: string;
}

export interface Movie {
  _id: string;
  title: string;
  description: string;
  posterUrl: string;
  bannerUrl: string;
  genres: string[];
  formats: ('2D' | '3D')[];
  cast: CastMember[];
  durationMinutes: number;
  language: string;
  status: 'now_showing' | 'coming_soon';
}

export interface PricePerCategory {
  standard: number;
  premium: number;
  recliner: number;
}

export interface Theatre {
  _id: string;
  name: string;
  location: string;
  pricePerCategory: PricePerCategory;
}

export type SeatCategory = 'standard' | 'premium' | 'recliner';
export type SeatStatus = 'available' | 'booked';

export interface Seat {
  seatId: string;
  row: string;
  col: number;
  category: SeatCategory;
  status: SeatStatus;
}

export interface Showtime {
  _id: string;
  movieId: string | Movie;
  theatreId: string | Theatre;
  format: '2D' | '3D';
  date: string;
  time: string;
  seats?: Seat[];
}

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'failed';

export interface Booking {
  _id: string;
  userId: string;
  showtimeId: string | Showtime;
  seatIds: string[];
  subtotal: number;
  bookingFee: number;
  totalAmount: number;
  status: BookingStatus;
  qrCode?: string;
  createdAt: string;
}

export interface Payment {
  _id: string;
  bookingId: string;
  amount: number;
  cardLast4: string;
  status: 'success' | 'failed';
  transactionRef: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface PaymentResult {
  success: boolean;
  booking: Booking;
  payment: Payment;
  message?: string;
}
