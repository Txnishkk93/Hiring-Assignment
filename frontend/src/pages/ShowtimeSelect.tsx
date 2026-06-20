import { useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { DateStrip } from '../components/DateStrip';
import { LoadingState, ErrorState } from '../components/StatusViews';
import { useGetMovieQuery, useGetShowtimesQuery } from '../store/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelectedDate, setSelectedShowtime } from '../store/bookingSlice';
import { formatTime, getDateStrip } from '../utils/pricing';

export default function ShowtimeSelect() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedTheatre = useAppSelector((s) => s.booking.selectedTheatre);
  const selectedDate = useAppSelector((s) => s.booking.selectedDate);
  const selectedShowtime = useAppSelector((s) => s.booking.selectedShowtime);

  const dates = useMemo(() => getDateStrip(7), []);
  const activeDate = selectedDate ?? dates[0];

  useEffect(() => {
    if (!selectedDate) dispatch(setSelectedDate(dates[0]));
  }, [selectedDate, dates, dispatch]);

  const movieQuery = useGetMovieQuery(id!);
  const showtimesQuery = useGetShowtimesQuery(
    { movieId: id!, date: activeDate },
    { skip: !id || !activeDate }
  );

  const theatreShowtimes = useMemo(() => {
    if (!showtimesQuery.data || !selectedTheatre) return [];
    return showtimesQuery.data.filter((s) => {
      const theatreId = typeof s.theatreId === 'object' ? s.theatreId._id : s.theatreId;
      return theatreId === selectedTheatre._id;
    });
  }, [showtimesQuery.data, selectedTheatre]);

  if (!selectedTheatre) {
    navigate(`/movies/${id}/theatres`, { replace: true });
    return null;
  }

  if (movieQuery.isLoading || showtimesQuery.isLoading) {
    return (
      <AppShell>
        <ScreenHeader title="Book" rightAction={{ label: 'Cancel', onClick: () => navigate('/') }} />
        <LoadingState />
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScreenHeader title="Book" rightAction={{ label: 'Cancel', onClick: () => navigate('/') }} />

      <div className="flex items-center gap-3 border-b border-border px-4 md:px-8 py-3">
        <img
          src={movieQuery.data?.posterUrl}
          alt={movieQuery.data?.title}
          className="h-14 w-10 rounded object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-text-primary">{movieQuery.data?.title}</p>
          <p className="text-xs text-text-secondary">{selectedTheatre.name}</p>
        </div>
      </div>

      <div className="py-4 md:py-6">
        <DateStrip
          dates={dates}
          selectedDate={activeDate}
          onSelect={(date) => dispatch(setSelectedDate(date))}
        />
      </div>

      {showtimesQuery.isError && <ErrorState message="Failed to load showtimes" onRetry={showtimesQuery.refetch} />}

      <div className="space-y-4 px-4 md:px-8 pb-24 md:pb-8">
        {theatreShowtimes.length === 0 && !showtimesQuery.isLoading && (
          <p className="py-8 text-center text-sm text-text-secondary">No showtimes for this date</p>
        )}
        <div>
          <p className="mb-2 text-sm font-semibold text-text-primary">{selectedTheatre.name}</p>
          <div className="flex flex-wrap gap-2">
            {theatreShowtimes.map((showtime) => (
              <button
                key={showtime._id}
                type="button"
                onClick={() => dispatch(setSelectedShowtime(showtime))}
                className={`rounded-lg border px-4 py-2 text-sm font-medium transition cursor-pointer ${
                  selectedShowtime?._id === showtime._id
                    ? 'border-primary bg-primary text-white'
                    : 'border-border bg-background text-text-primary hover:border-primary hover:bg-primary/5'
                }`}
              >
                {formatTime(showtime.time)} · {showtime.format}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 md:relative md:bottom-auto border-t md:border-0 border-border bg-background md:bg-transparent px-4 py-3 md:px-8 md:py-4">
        <button
          type="button"
          disabled={!selectedShowtime}
          onClick={() => navigate(`/showtimes/${selectedShowtime?._id}/seats`)}
          className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white disabled:opacity-50 hover:bg-primary-hover transition cursor-pointer"
        >
          Get Tickets
        </button>
      </div>
    </AppShell>
  );
}
