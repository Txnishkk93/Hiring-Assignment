import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { Booking, Movie, Showtime, Theatre } from '../types';

interface BookingFlowState {
  selectedMovie: Movie | null;
  selectedTheatre: Theatre | null;
  selectedDate: string | null;
  selectedShowtime: Showtime | null;
  selectedSeats: string[];
  subtotal: number;
  bookingFee: number;
  total: number;
  currentBooking: Booking | null;
  paymentMessage: string | null;
}

const initialState: BookingFlowState = {
  selectedMovie: null,
  selectedTheatre: null,
  selectedDate: null,
  selectedShowtime: null,
  selectedSeats: [],
  subtotal: 0,
  bookingFee: 0,
  total: 0,
  currentBooking: null,
  paymentMessage: null,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    setSelectedMovie(state, action: PayloadAction<Movie | null>) {
      state.selectedMovie = action.payload;
    },
    setSelectedTheatre(state, action: PayloadAction<Theatre | null>) {
      state.selectedTheatre = action.payload;
    },
    setSelectedDate(state, action: PayloadAction<string | null>) {
      state.selectedDate = action.payload;
    },
    setSelectedShowtime(state, action: PayloadAction<Showtime | null>) {
      state.selectedShowtime = action.payload;
    },
    toggleSeat(state, action: PayloadAction<string>) {
      const seatId = action.payload;
      const idx = state.selectedSeats.indexOf(seatId);
      if (idx >= 0) {
        state.selectedSeats.splice(idx, 1);
      } else {
        state.selectedSeats.push(seatId);
      }
    },
    setSelectedSeats(state, action: PayloadAction<string[]>) {
      state.selectedSeats = action.payload;
    },
    setPricing(state, action: PayloadAction<{ subtotal: number; bookingFee: number; total: number }>) {
      state.subtotal = action.payload.subtotal;
      state.bookingFee = action.payload.bookingFee;
      state.total = action.payload.total;
    },
    setCurrentBooking(state, action: PayloadAction<Booking | null>) {
      state.currentBooking = action.payload;
    },
    setPaymentMessage(state, action: PayloadAction<string | null>) {
      state.paymentMessage = action.payload;
    },
    resetBookingFlow(state) {
      Object.assign(state, initialState);
    },
  },
});

export const {
  setSelectedMovie,
  setSelectedTheatre,
  setSelectedDate,
  setSelectedShowtime,
  toggleSeat,
  setSelectedSeats,
  setPricing,
  setCurrentBooking,
  setPaymentMessage,
  resetBookingFlow,
} = bookingSlice.actions;

export default bookingSlice.reducer;
