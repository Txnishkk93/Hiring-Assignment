import { useState } from 'react';
import { AppShell } from '../components/AppShell';
import { BottomNav } from '../components/BottomNav';
import { MovieCard } from '../components/MovieCard';
import { TheatreListItem } from '../components/TheatreListItem';
import { LoadingState, ErrorState } from '../components/StatusViews';
import { useGetMoviesQuery, useGetTheatresQuery } from '../store/api';

export default function Home() {
  const [tab, setTab] = useState<'now_showing' | 'coming_soon'>('now_showing');
  const moviesQuery = useGetMoviesQuery(tab);
  const theatresQuery = useGetTheatresQuery();

  const heroMovie = moviesQuery.data?.[0];

  return (
    <AppShell showBottomNav bottomNav={<BottomNav />}>
      <div className="px-4 pt-4">
        <div className="mb-4 flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M20 20l-3-3" />
          </svg>
          <span className="text-sm text-text-muted">Search movies, theatres...</span>
        </div>

        {heroMovie && (
          <div className="relative mb-6 overflow-hidden rounded-xl">
            <img src={heroMovie.bannerUrl} alt={heroMovie.title} className="h-44 w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <h2 className="text-lg font-semibold text-white">{heroMovie.title}</h2>
              <p className="text-xs text-white/80">{heroMovie.genres.join(' · ')}</p>
            </div>
          </div>
        )}

        <div className="mb-4 flex gap-6 border-b border-border">
          {(['now_showing', 'coming_soon'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`pb-2 text-sm font-semibold capitalize ${
                tab === key
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-text-secondary'
              }`}
            >
              {key === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
            </button>
          ))}
        </div>

        {moviesQuery.isLoading && <LoadingState />}
        {moviesQuery.isError && (
          <ErrorState message="Failed to load movies" onRetry={moviesQuery.refetch} />
        )}
        {moviesQuery.data && (
          <div className="mb-8 flex gap-3 overflow-x-auto pb-2">
            {moviesQuery.data.map((movie) => (
              <MovieCard key={movie._id} movie={movie} />
            ))}
          </div>
        )}

        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-base font-semibold text-text-primary">Movie Theatres</h3>
        </div>

        {theatresQuery.isLoading && <LoadingState message="Loading theatres..." />}
        {theatresQuery.isError && (
          <ErrorState message="Failed to load theatres" onRetry={theatresQuery.refetch} />
        )}
        {theatresQuery.data && (
          <div className="space-y-3 pb-4">
            {theatresQuery.data.map((theatre) => (
              <TheatreListItem key={theatre._id} theatre={theatre} />
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
