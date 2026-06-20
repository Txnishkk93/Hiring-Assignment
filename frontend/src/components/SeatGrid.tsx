import { useMemo } from 'react';
import type { Seat as SeatType } from '../types';
import { Seat } from './Seat';

interface SeatGridProps {
  seats: SeatType[];
  selectedSeats: string[];
  onToggleSeat: (seatId: string) => void;
}

export function SeatGrid({ seats, selectedSeats, onToggleSeat }: SeatGridProps) {
  const rows = useMemo(() => {
    const grouped = new Map<string, SeatType[]>();
    for (const seat of seats) {
      const rowSeats = grouped.get(seat.row) ?? [];
      rowSeats.push(seat);
      grouped.set(seat.row, rowSeats);
    }
    return [...grouped.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([row, rowSeats]) => ({
        row,
        seats: rowSeats.sort((a, b) => a.col - b.col),
      }));
  }, [seats]);

  return (
    <div className="px-4">
      {/* Curved screen indicator */}
      <div className="mb-6 flex flex-col items-center">
        <svg width="280" height="32" viewBox="0 0 280 32" fill="none" aria-hidden>
          <path
            d="M10 28 Q140 0 270 28"
            stroke="var(--color-screen-arc)"
            strokeWidth="2"
            fill="none"
          />
        </svg>
        <span className="mt-1 text-[11px] font-medium tracking-widest text-text-muted">SCREEN</span>
      </div>

      {/* Legend */}
      <div className="mb-4 flex justify-center gap-4 text-[11px] text-text-secondary">
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded border border-border-input bg-seat-available" />
          Available
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-seat-occupied" />
          Occupied
        </span>
        <span className="flex items-center gap-1">
          <span className="inline-block h-3 w-3 rounded bg-primary" />
          Selected
        </span>
      </div>

      <div className="space-y-1">
        {rows.map(({ row, seats: rowSeats }) => (
          <div key={row} className="flex items-center gap-1">
            <span className="w-5 shrink-0 text-center text-[11px] font-medium text-text-muted">
              {row}
            </span>
            <div
              className="grid flex-1 gap-1"
              style={{ gridTemplateColumns: `repeat(${rowSeats.length}, minmax(0, 1fr))` }}
            >
              {rowSeats.map((seat) => (
                <div key={seat.seatId} className="flex justify-center">
                  <Seat
                    seat={seat}
                    selected={selectedSeats.includes(seat.seatId)}
                    onToggle={onToggleSeat}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
