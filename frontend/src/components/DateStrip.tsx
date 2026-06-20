import { formatDate } from '../utils/pricing';

interface DateStripProps {
  dates: string[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
}

export function DateStrip({ dates, selectedDate, onSelect }: DateStripProps) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
      {dates.map((date) => {
        const d = new Date(`${date}T00:00:00`);
        const isSelected = selectedDate === date;
        return (
          <button
            key={date}
            type="button"
            onClick={() => onSelect(date)}
            className={`flex min-w-[56px] flex-col items-center rounded-lg border px-3 py-2 ${
              isSelected
                ? 'border-primary bg-primary text-white'
                : 'border-border bg-background text-text-secondary'
            }`}
          >
            <span className="text-[11px] uppercase">
              {d.toLocaleDateString('en-IN', { weekday: 'short' })}
            </span>
            <span className="text-sm font-semibold">{d.getDate()}</span>
          </button>
        );
      })}
    </div>
  );
}

export { formatDate };
