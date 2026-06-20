import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { useAppSelector } from '../store/hooks';

export default function PaymentFailure() {
  const navigate = useNavigate();
  const message = useAppSelector((s) => s.booking.paymentMessage);

  return (
    <AppShell>
      <ScreenHeader title="Payment Failed" rightAction={{ label: 'Close', onClick: () => navigate('/') }} />

      <div className="flex flex-col items-center px-4 py-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-error-bg text-error">
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <path d="M15 9l-6 6M9 9l6 6" />
          </svg>
        </div>

        <h2 className="text-lg font-semibold text-text-primary">Payment Failed</h2>
        <p className="mt-2 text-sm text-text-secondary">
          {message ?? 'Your card was declined. Try a different card or use a card not ending in 0000.'}
        </p>

        <button
          type="button"
          onClick={() => navigate('/booking/checkout')}
          className="mt-8 w-full rounded-lg bg-primary py-3 text-base font-semibold text-white"
        >
          Retry Payment
        </button>
      </div>
    </AppShell>
  );
}
