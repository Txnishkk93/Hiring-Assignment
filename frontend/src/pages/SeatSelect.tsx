import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { SeatGrid } from '../components/SeatGrid';
import { PriceSummaryBar } from '../components/PriceSummaryBar';
import { LoadingState, ErrorState } from '../components/StatusViews';
import { useGetShowtimeQuery } from '../store/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setPricing, setSelectedShowtime, setSelectedTheatre, toggleSeat } from '../store/bookingSlice';
import { calculateSubtotal, MAX_SEATS } from '../utils/pricing';
import type { Theatre } from '../types';

const BOOKING_FEE = 30;

export default function SeatSelect() {
  const { showtimeId } = useParams<{ showtimeId: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedSeats = useAppSelector((s) => s.booking.selectedSeats);
  const selectedTheatre = useAppSelector((s) => s.booking.selectedTheatre);
  const total = useAppSelector((s) => s.booking.total);

  const { data: showtime, isLoading, isError, refetch } = useGetShowtimeQuery(showtimeId!);

  useEffect(() => {
    if (!showtime) return;
    dispatch(setSelectedShowtime(showtime));
    if (typeof showtime.theatreId === 'object') {
      dispatch(setSelectedTheatre(showtime.theatreId as Theatre));
    }
  }, [showtime, dispatch]);

  useEffect(() => {
    if (!showtime?.seats || !selectedTheatre) return;
    const subtotal = calculateSubtotal(selectedSeats, showtime.seats, selectedTheatre.pricePerCategory);
    dispatch(setPricing({ subtotal, bookingFee: BOOKING_FEE, total: subtotal + BOOKING_FEE }));
  }, [selectedSeats, showtime, selectedTheatre, dispatch]);

  const handleToggleSeat = (seatId: string) => {
    if (selectedSeats.includes(seatId)) {
      dispatch(toggleSeat(seatId));
      return;
    }
    if (selectedSeats.length >= MAX_SEATS) {
      alert(`Maximum ${MAX_SEATS} seats per booking`);
      return;
    }
    dispatch(toggleSeat(seatId));
  };

  if (isLoading) {
    return (
      <AppShell>
        <ScreenHeader title="Select Seats" rightAction={{ label: 'Cancel', onClick: () => navigate('/') }} />
        <LoadingState />
      </AppShell>
    );
  }

  if (isError || !showtime?.seats) {
    return (
      <AppShell>
        <ErrorState message="Failed to load seats" onRetry={refetch} />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScreenHeader title="Select Seats" rightAction={{ label: 'Cancel', onClick: () => navigate('/') }} />

      <div className="pb-4 pt-2">
        <SeatGrid seats={showtime.seats} selectedSeats={selectedSeats} onToggleSeat={handleToggleSeat} />
      </div>

      <PriceSummaryBar
        seatCount={selectedSeats.length}
        total={total}
        buttonLabel="View Booking Summary"
        disabled={selectedSeats.length === 0}
        onContinue={() => navigate('/booking/summary')}
      />
    </AppShell>
  );
}
