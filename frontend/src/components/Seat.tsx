import type { Seat as SeatType } from '../types';

interface SeatProps {
  seat: SeatType;
  selected: boolean;
  onToggle: (seatId: string) => void;
}

export function Seat({ seat, selected, onToggle }: SeatProps) {
  const isBooked = seat.status === 'booked';
  const isSelected = selected && !isBooked;

  let className =
    'h-[22px] w-[22px] rounded-[4px] border transition disabled:cursor-not-allowed ';

  if (isBooked) {
    className += 'border-seat-occupied bg-seat-occupied';
  } else if (isSelected) {
    className += 'border-primary bg-primary';
  } else {
    className += 'border-border-input bg-seat-available hover:border-primary';
  }

  return (
    <button
      type="button"
      disabled={isBooked}
      aria-label={`Seat ${seat.seatId}`}
      onClick={() => onToggle(seat.seatId)}
      className={className}
    />
  );
}
