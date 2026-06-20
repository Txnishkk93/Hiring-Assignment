import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import ShowtimeSelectTheatre from './pages/ShowtimeSelectTheatre';
import ShowtimeSelect from './pages/ShowtimeSelect';
import SeatSelect from './pages/SeatSelect';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BookingSummary from './pages/BookingSummary';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailure from './pages/PaymentFailure';
import MyBookings from './pages/MyBookings';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/movies/:id" element={<MovieDetails />} />
        <Route path="/movies/:id/theatres" element={<ShowtimeSelectTheatre />} />
        <Route path="/movies/:id/schedule" element={<ShowtimeSelect />} />
        <Route path="/showtimes/:showtimeId/seats" element={<SeatSelect />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/booking/summary" element={<BookingSummary />} />
        <Route path="/booking/checkout" element={<Checkout />} />
        <Route path="/booking/success" element={<PaymentSuccess />} />
        <Route path="/booking/failure" element={<PaymentFailure />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
