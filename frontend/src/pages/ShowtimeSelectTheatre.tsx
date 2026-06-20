import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { TheatreListItem } from '../components/TheatreListItem';
import { LoadingState, ErrorState } from '../components/StatusViews';
import { useGetMovieQuery, useGetTheatresQuery } from '../store/api';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setSelectedTheatre } from '../store/bookingSlice';

export default function ShowtimeSelectTheatre() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const selectedTheatre = useAppSelector((s) => s.booking.selectedTheatre);
  const [search, setSearch] = useState('');

  const movieQuery = useGetMovieQuery(id!);
  const theatresQuery = useGetTheatresQuery();

  const filteredTheatres = useMemo(() => {
    if (!theatresQuery.data) return [];
    const q = search.toLowerCase();
    return theatresQuery.data.filter(
      (t) => t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q)
    );
  }, [theatresQuery.data, search]);

  if (movieQuery.isLoading || theatresQuery.isLoading) {
    return (
      <AppShell>
        <ScreenHeader title="Book" rightAction={{ label: 'Cancel', onClick: () => navigate('/') }} />
        <LoadingState />
      </AppShell>
    );
  }

  if (movieQuery.isError || theatresQuery.isError || !movieQuery.data) {
    return (
      <AppShell>
        <ErrorState message="Failed to load data" />
      </AppShell>
    );
  }

  const movie = movieQuery.data;

  return (
    <AppShell>
      <ScreenHeader title="Book" rightAction={{ label: 'Cancel', onClick: () => navigate('/') }} />

      <div className="flex items-center gap-3 border-b border-border px-4 py-3">
        <img src={movie.posterUrl} alt={movie.title} className="h-14 w-10 rounded object-cover" />
        <div>
          <p className="text-sm font-semibold text-text-primary">{movie.title}</p>
          <p className="text-xs text-text-secondary">{movie.language}</p>
        </div>
      </div>

      <div className="px-4 py-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Select Movie Theatre"
          className="mb-4 w-full rounded-lg border border-border-input px-3 py-2.5 text-sm outline-none focus:border-primary"
        />

        <div className="space-y-3">
          {filteredTheatres.map((theatre) => (
            <TheatreListItem
              key={theatre._id}
              theatre={theatre}
              selected={selectedTheatre?._id === theatre._id}
              onClick={() => dispatch(setSelectedTheatre(theatre))}
            />
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-background px-4 py-3">
        <button
          type="button"
          disabled={!selectedTheatre}
          onClick={() => navigate(`/movies/${id}/schedule`)}
          className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </AppShell>
  );
}
