import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppSelector } from '../store/hooks';
import { formatCurrency, formatDate, formatTime } from '../utils/pricing';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const booking = useAppSelector((s) => s.booking.currentBooking);
  const selectedMovie = useAppSelector((s) => s.booking.selectedMovie);
  const selectedTheatre = useAppSelector((s) => s.booking.selectedTheatre);
  const selectedShowtime = useAppSelector((s) => s.booking.selectedShowtime);

  if (!booking) {
    return (
      <AppShell>
        <ScreenHeader title="Payment Successful" rightAction={{ label: 'Close', onClick: () => navigate('/') }} />
        <p className="p-4 text-sm text-text-secondary">No booking found.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScreenHeader title="Payment Successful" rightAction={{ label: 'Close', onClick: () => navigate('/') }} />

      <div className="flex flex-col items-center px-4 py-6">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success text-white">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <path d="M5 13l4 4L19 7" />
          </svg>
        </div>

        {selectedMovie && (
          <img src={selectedMovie.posterUrl} alt={selectedMovie.title} className="mb-4 h-32 w-24 rounded-lg object-cover" />
        )}

        <h2 className="text-lg font-semibold text-text-primary">{selectedMovie?.title}</h2>
        <p className="text-sm text-text-secondary">{selectedTheatre?.name}</p>
        {selectedShowtime && (
          <p className="text-sm text-text-secondary">
            {formatDate(selectedShowtime.date)} · {formatTime(selectedShowtime.time)}
          </p>
        )}
        <p className="mt-1 text-sm text-text-secondary">Seats: {booking.seatIds.join(', ')}</p>
        <p className="mt-1 font-semibold text-primary">{formatCurrency(booking.totalAmount)}</p>

        <div className="my-6 rounded-xl border border-border p-4">
          <QRCodeSVG value={booking.qrCode ?? booking._id} size={180} />
        </div>

        <p className="text-xs text-text-muted">Booking confirmed · {new Date(booking.createdAt).toLocaleString()}</p>

        <button
          type="button"
          onClick={() => navigate('/bookings')}
          className="mt-6 w-full rounded-lg bg-primary py-3 text-base font-semibold text-white"
        >
          View My Bookings
        </button>
      </div>
    </AppShell>
  );
}
