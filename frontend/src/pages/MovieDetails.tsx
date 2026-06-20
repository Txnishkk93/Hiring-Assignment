import { useNavigate, useParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { LoadingState, ErrorState } from '../components/StatusViews';
import { useGetMovieQuery } from '../store/api';
import { useAppDispatch } from '../store/hooks';
import { setSelectedMovie } from '../store/bookingSlice';

export default function MovieDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: movie, isLoading, isError, refetch } = useGetMovieQuery(id!);

  if (isLoading) {
    return (
      <AppShell>
        <LoadingState />
      </AppShell>
    );
  }

  if (isError || !movie) {
    return (
      <AppShell>
        <ErrorState message="Failed to load movie" onRetry={refetch} />
      </AppShell>
    );
  }

  const handleGetTickets = () => {
    dispatch(setSelectedMovie(movie));
    navigate(`/movies/${movie._id}/theatres`);
  };

  return (
    <AppShell>
      <div className="relative">
        <img src={movie.bannerUrl} alt={movie.title} className="h-56 w-full object-cover" />
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-black/40 text-white"
        >
          ←
        </button>
      </div>

      <div className="px-4 py-4">
        <h1 className="text-xl font-semibold text-text-primary">{movie.title}</h1>
        <p className="mt-1 text-sm text-text-secondary">
          {movie.language} · {movie.durationMinutes} min
        </p>

        <p className="mt-4 text-sm leading-relaxed text-text-secondary">{movie.description}</p>

        <div className="mt-4 flex gap-2">
          {movie.formats.map((format) => (
            <span
              key={format}
              className="rounded-md border border-border bg-surface px-3 py-1 text-xs font-medium text-text-primary"
            >
              {format}
            </span>
          ))}
        </div>

        <h2 className="mt-6 mb-3 text-base font-semibold text-text-primary">Cast</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {movie.cast.map((member) => (
            <div key={member.name} className="flex w-16 shrink-0 flex-col items-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface text-lg font-semibold text-primary">
                {member.name.charAt(0)}
              </div>
              <p className="mt-1 truncate text-[11px] text-text-primary">{member.name}</p>
              <p className="truncate text-[10px] text-text-muted">{member.role}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-background px-4 py-3">
        <button
          type="button"
          onClick={handleGetTickets}
          className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white"
        >
          Get Tickets
        </button>
      </div>
    </AppShell>
  );
}
