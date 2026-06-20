import { QRCodeSVG } from 'qrcode.react';
import type { Booking, Movie, Showtime, Theatre } from '../types';
import { formatCurrency, formatDate, formatTime } from '../utils/pricing';

interface TicketCardProps {
  booking: Booking;
  onCancel?: () => void;
  showCancel?: boolean;
}

function resolveShowtime(booking: Booking): Showtime | null {
  return typeof booking.showtimeId === 'object' ? booking.showtimeId : null;
}

function resolveMovie(showtime: Showtime | null): Movie | null {
  if (!showtime) return null;
  return typeof showtime.movieId === 'object' ? showtime.movieId : null;
}

function resolveTheatre(showtime: Showtime | null): Theatre | null {
  if (!showtime) return null;
  return typeof showtime.theatreId === 'object' ? showtime.theatreId : null;
}

export function TicketCard({ booking, onCancel, showCancel }: TicketCardProps) {
  const showtime = resolveShowtime(booking);
  const movie = resolveMovie(showtime);
  const theatre = resolveTheatre(showtime);
  const qrValue = booking.qrCode ?? booking._id;

  return (
    <div className="rounded-xl border border-border bg-background p-4">
      <div className="flex gap-3">
        {movie && (
          <img src={movie.posterUrl} alt={movie.title} className="h-24 w-16 rounded-lg object-cover" />
        )}
        <div className="min-w-0 flex-1">
          <p className="font-semibold text-text-primary">{movie?.title ?? 'Movie'}</p>
          <p className="text-xs text-text-secondary">{theatre?.name}</p>
          {showtime && (
            <p className="text-xs text-text-secondary">
              {formatDate(showtime.date)} · {formatTime(showtime.time)}
            </p>
          )}
          <p className="mt-1 text-xs text-text-secondary">
            Seats: {booking.seatIds.join(', ')}
          </p>
          <p className="text-sm font-semibold text-primary">{formatCurrency(booking.totalAmount)}</p>
        </div>
        {booking.status === 'confirmed' && (
          <QRCodeSVG value={qrValue} size={72} className="shrink-0" />
        )}
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${
            booking.status === 'confirmed'
              ? 'bg-success-bg text-success'
              : booking.status === 'cancelled'
                ? 'bg-surface text-text-muted'
                : 'bg-surface text-text-secondary'
          }`}
        >
          {booking.status.replace('_', ' ')}
        </span>
        {showCancel && booking.status === 'confirmed' && onCancel && (
          <button type="button" onClick={onCancel} className="text-sm font-medium text-error">
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
