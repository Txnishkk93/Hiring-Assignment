import type { Theatre } from '../types';
import { formatCurrency } from '../utils/pricing';

interface TheatreListItemProps {
  theatre: Theatre;
  selected?: boolean;
  onClick?: () => void;
}

export function TheatreListItem({ theatre, selected, onClick }: TheatreListItemProps) {
  const { standard, premium, recliner } = theatre.pricePerCategory;
  const min = Math.min(standard, premium, recliner);
  const max = Math.max(standard, premium, recliner);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
        selected ? 'border-primary bg-primary/5' : 'border-border bg-background'
      }`}
    >
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-surface text-lg font-bold text-primary">
        {theatre.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-text-primary">{theatre.name}</p>
        <p className="truncate text-xs text-text-secondary">{theatre.location}</p>
      </div>
      <p className="shrink-0 text-xs font-medium text-text-secondary">
        {formatCurrency(min)} - {formatCurrency(max)}
      </p>
    </button>
  );
}
