import { formatCurrency } from '../utils/pricing';

interface PriceSummaryBarProps {
  seatCount: number;
  total: number;
  buttonLabel: string;
  onContinue: () => void;
  disabled?: boolean;
}

export function PriceSummaryBar({
  seatCount,
  total,
  buttonLabel,
  onContinue,
  disabled,
}: PriceSummaryBarProps) {
  return (
    <div className="sticky bottom-0 border-t border-border bg-background px-4 py-3">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-xs text-text-secondary">
            {seatCount} seat{seatCount !== 1 ? 's' : ''} selected
          </p>
          <p className="text-lg font-semibold text-text-primary">{formatCurrency(total)}</p>
        </div>
      </div>
      <button
        type="button"
        disabled={disabled || seatCount === 0}
        onClick={onContinue}
        className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white disabled:opacity-50"
      >
        {buttonLabel}
      </button>
    </div>
  );
}
