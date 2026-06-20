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

      <div className="flex gap-4 px-4 py-4">
        <img src={selectedMovie.posterUrl} alt={selectedMovie.title} className="h-28 w-20 rounded-lg object-cover" />
        <div className="text-sm">
          <p className="font-semibold text-text-primary">{selectedMovie.title}</p>
          <p className="text-text-secondary">{selectedTheatre.name}</p>
          <p className="text-text-secondary">
            {formatDate(selectedShowtime.date)} · {formatTime(selectedShowtime.time)}
          </p>
          <p className="text-text-secondary">Seats: {selectedSeats.join(', ')}</p>
        </div>
      </div>

      <div className="mx-4 rounded-lg border border-border p-4 text-sm">
        <div className="flex justify-between py-1">
          <span className="text-text-secondary">{selectedSeats.length}x Tickets</span>
          <span>{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex justify-between py-1">
          <span className="text-text-secondary">Booking Fee</span>
          <span>{formatCurrency(bookingFee)}</span>
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold">
          <span>Total</span>
          <span className="text-primary">{formatCurrency(total)}</span>
        </div>
      </div>

      {error && <p className="px-4 pt-3 text-sm text-error">{error}</p>}

      <div className="sticky bottom-0 mt-auto border-t border-border bg-background px-4 py-3">
        <button
          type="button"
          disabled={loading}
          onClick={handleProceed}
          className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Creating booking...' : 'Proceed to Payment'}
        </button>
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
