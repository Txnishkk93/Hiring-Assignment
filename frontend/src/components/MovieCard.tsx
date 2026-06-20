import { Link } from 'react-router-dom';
import type { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  compact?: boolean;
}

export function MovieCard({ movie, compact = false }: MovieCardProps) {
  return (
    <Link to={`/movies/${movie._id}`} className="block shrink-0">
      <div className={`overflow-hidden rounded-lg bg-surface ${compact ? 'w-[120px]' : 'w-[140px]'}`}>
        <img
          src={movie.posterUrl}
          alt={movie.title}
          className={`w-full object-cover ${compact ? 'h-[170px]' : 'h-[200px]'}`}
        />
        <div className="p-2 text-left">
          <p className="truncate text-sm font-semibold text-text-primary">{movie.title}</p>
          <p className="truncate text-xs text-text-secondary">{movie.genres.slice(0, 2).join(', ')}</p>
        </div>
      </div>
    </Link>
  );
}
