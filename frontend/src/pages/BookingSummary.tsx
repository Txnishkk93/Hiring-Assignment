import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { createBooking } from '../api/bookings.api';
import { getErrorMessage } from '../api/client';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentBooking, setPricing } from '../store/bookingSlice';
import { formatCurrency, formatDate, formatTime } from '../utils/pricing';

function BookingSummaryContent() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const selectedMovie = useAppSelector((s) => s.booking.selectedMovie);
  const selectedTheatre = useAppSelector((s) => s.booking.selectedTheatre);
  const selectedShowtime = useAppSelector((s) => s.booking.selectedShowtime);
  const selectedSeats = useAppSelector((s) => s.booking.selectedSeats);
  const subtotal = useAppSelector((s) => s.booking.subtotal);
  const bookingFee = useAppSelector((s) => s.booking.bookingFee);
  const total = useAppSelector((s) => s.booking.total);

  const handleProceed = async () => {
    if (!selectedShowtime) return;
    setLoading(true);
    setError('');
    try {
      const booking = await createBooking(selectedShowtime._id, selectedSeats);
      dispatch(setCurrentBooking(booking));
      dispatch(
        setPricing({
          subtotal: booking.subtotal,
          bookingFee: booking.bookingFee,
          total: booking.totalAmount,
        })
      );
      navigate('/booking/checkout');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!selectedMovie || !selectedTheatre || !selectedShowtime || selectedSeats.length === 0) {
    return (
      <AppShell>
        <ScreenHeader title="Booking Summary" rightAction={{ label: 'Cancel', onClick: () => navigate('/') }} />
        <p className="p-4 text-sm text-text-secondary">No booking in progress.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScreenHeader title="Booking Summary" rightAction={{ label: 'Cancel', onClick: () => navigate('/') }} />

      <div className="md:grid md:grid-cols-2 md:gap-8 md:p-8 flex flex-col flex-1">
        {/* Left Side: Movie details card */}
        <div className="flex gap-4 px-4 py-4 md:px-0 md:py-0 border border-border md:border-0 rounded-lg bg-surface md:bg-transparent p-4">
          <img src={selectedMovie.posterUrl} alt={selectedMovie.title} className="h-28 w-20 md:h-44 md:w-32 rounded-lg object-cover" />
          <div className="text-sm md:text-base flex flex-col justify-center">
            <p className="font-semibold text-text-primary text-base md:text-lg">{selectedMovie.title}</p>
            <p className="text-text-secondary mt-1">{selectedTheatre.name}</p>
            <p className="text-text-secondary mt-1">
              {formatDate(selectedShowtime.date)} · {formatTime(selectedShowtime.time)}
            </p>
            <p className="text-text-secondary mt-1">Seats: <span className="font-medium text-primary">{selectedSeats.join(', ')}</span></p>
          </div>
        </div>

        {/* Right Side: Price breakdown and Action Button */}
        <div className="flex flex-col flex-1 justify-between md:border md:border-border md:rounded-xl md:p-6 md:bg-surface">
          <div className="mx-4 md:mx-0 rounded-lg border border-border md:border-0 p-4 md:p-0 text-sm md:text-base">
            <div className="flex justify-between py-1.5">
              <span className="text-text-secondary">{selectedSeats.length}x Tickets</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between py-1.5">
              <span className="text-text-secondary">Booking Fee</span>
              <span className="font-medium">{formatCurrency(bookingFee)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t border-border pt-2.5 font-semibold text-base md:text-lg">
              <span>Total</span>
              <span className="text-primary">{formatCurrency(total)}</span>
            </div>
          </div>

          {error && <p className="px-4 md:px-0 pt-3 text-sm text-error">{error}</p>}

          <div className="sticky bottom-0 mt-auto md:relative md:bottom-auto border-t border-border md:border-0 bg-background md:bg-transparent px-4 py-3 md:px-0 md:py-0 md:mt-8">
            <button
              type="button"
              disabled={loading}
              onClick={handleProceed}
              className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white disabled:opacity-60 hover:bg-primary-hover transition cursor-pointer"
            >
              {loading ? 'Creating booking...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function BookingSummary() {
  return (
    <ProtectedRoute>
      <BookingSummaryContent />
    </ProtectedRoute>
  );
}
