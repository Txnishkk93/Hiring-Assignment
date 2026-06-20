import type { PricePerCategory, Seat, SeatCategory } from '../types';

export function getSeatPrice(category: SeatCategory, pricing: PricePerCategory): number {
  return pricing[category];
}

export function calculateSubtotal(
  seatIds: string[],
  seats: Seat[],
  pricing: PricePerCategory
): number {
  const seatMap = new Map(seats.map((s) => [s.seatId, s]));
  return seatIds.reduce((sum, id) => {
    const seat = seatMap.get(id);
    return seat ? sum + getSeatPrice(seat.category, pricing) : sum;
  }, 0);
}

export function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function formatDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' });
}

export function formatTime(time: string): string {
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  return `${hour12}:${String(m).padStart(2, '0')} ${period}`;
}

export function getDateStrip(days = 7): string[] {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < days; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    dates.push(d.toISOString().split('T')[0]);
  }
  return dates;
}

export const MAX_SEATS = Number(import.meta.env.VITE_MAX_SEATS_PER_BOOKING) || 10;

export const DEMO_EMAIL = 'demo@movieapp.test';
export const DEMO_PASSWORD = 'Demo@1234';
