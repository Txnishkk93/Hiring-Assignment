import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { BottomNav } from '../components/BottomNav';
import { ScreenHeader } from '../components/ScreenHeader';
import { TicketCard } from '../components/TicketCard';
import { LoadingState, ErrorState } from '../components/StatusViews';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { cancelBooking } from '../api/bookings.api';
import { useGetBookingsQuery, api } from '../store/api';
import { useAppDispatch } from '../store/hooks';

function MyBookingsContent() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [tab, setTab] = useState<'active' | 'past'>('active');
  const { data: bookings, isLoading, isError, refetch } = useGetBookingsQuery();

  const filtered = (bookings ?? []).filter((b) =>
    tab === 'active' ? b.status === 'confirmed' || b.status === 'pending' : b.status === 'cancelled' || b.status === 'failed'
  );

  const handleCancel = async (id: string) => {
    if (!confirm('Cancel this booking?')) return;
    await cancelBooking(id);
    dispatch(api.util.invalidateTags(['Bookings', 'Showtime']));
    refetch();
  };

  return (
    <AppShell showBottomNav bottomNav={<BottomNav />}>
      <ScreenHeader title="My Bookings" rightAction={{ label: 'Close', onClick: () => navigate('/') }} />

      <div className="flex gap-6 border-b border-border px-4">
        <button
          type="button"
          onClick={() => setTab('active')}
          className={`pb-2 text-sm font-semibold ${
            tab === 'active' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'
          }`}
        >
          My Bookings
        </button>
        <button
          type="button"
          onClick={() => setTab('past')}
          className={`pb-2 text-sm font-semibold ${
            tab === 'past' ? 'border-b-2 border-primary text-primary' : 'text-text-secondary'
          }`}
        >
          Past Bookings
        </button>
      </div>

      {isLoading && <LoadingState />}
      {isError && <ErrorState message="Failed to load bookings" onRetry={refetch} />}

      <div className="space-y-4 p-4">
        {!isLoading && filtered.length === 0 && (
          <p className="py-8 text-center text-sm text-text-secondary">No bookings yet</p>
        )}
        {filtered.map((booking) => (
          <TicketCard
            key={booking._id}
            booking={booking}
            showCancel={tab === 'active'}
            onCancel={() => handleCancel(booking._id)}
          />
        ))}
      </div>
    </AppShell>
  );
}

export default function MyBookings() {
  return (
    <ProtectedRoute>
      <MyBookingsContent />
    </ProtectedRoute>
  );
}
