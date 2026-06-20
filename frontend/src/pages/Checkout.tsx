import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { ScreenHeader } from '../components/ScreenHeader';
import { CardForm } from '../components/CardForm';
import type { CardFormValues } from '../components/CardForm';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { processPayment } from '../api/payments.api';
import { getErrorMessage } from '../api/client';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { setCurrentBooking, setPaymentMessage } from '../store/bookingSlice';
import { api } from '../store/api';
import { formatCurrency } from '../utils/pricing';

function CheckoutContent() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const currentBooking = useAppSelector((s) => s.booking.currentBooking);
  const subtotal = useAppSelector((s) => s.booking.subtotal);
  const bookingFee = useAppSelector((s) => s.booking.bookingFee);
  const total = useAppSelector((s) => s.booking.total);
  const selectedSeats = useAppSelector((s) => s.booking.selectedSeats);

  const handlePayment = async (values: CardFormValues) => {
    if (!currentBooking) return;
    setLoading(true);
    setError('');
    try {
      const cardNumber = values.cardNumber.replace(/\s/g, '');
      const result = await processPayment({
        bookingId: currentBooking._id,
        cardNumber,
        expiryMonth: values.expiryMonth,
        expiryYear: values.expiryYear,
        cvv: values.cvv,
        cardHolderName: values.cardHolderName,
      });

      dispatch(setCurrentBooking(result.booking));
      dispatch(api.util.invalidateTags(['Bookings', 'Showtime']));

      if (result.success) {
        navigate('/booking/success');
      } else {
        dispatch(setPaymentMessage(result.message ?? 'Payment failed'));
        navigate('/booking/failure');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  if (!currentBooking) {
    return (
      <AppShell>
        <ScreenHeader title="Checkout" rightAction={{ label: 'Cancel', onClick: () => navigate('/') }} />
        <p className="p-4 text-sm text-text-secondary">No pending booking.</p>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <ScreenHeader title="Checkout" rightAction={{ label: 'Cancel', onClick: () => navigate('/') }} />

      <div className="md:grid md:grid-cols-5 md:gap-8 md:p-8 flex flex-col flex-1">
        {/* Left column: Card Payment Form (takes 3 cols) */}
        <div className="px-4 py-4 md:px-0 md:py-0 md:col-span-3">
          <p className="mb-3 text-sm md:text-base font-semibold text-text-primary">Credit/Debit Card</p>
          {error && <p className="mb-3 text-sm text-error">{error}</p>}
          <CardForm onSubmit={handlePayment} loading={loading} />
        </div>

        {/* Right column: Order Summary details (takes 2 cols) */}
        <div className="mx-4 mt-4 md:mx-0 md:mt-0 md:col-span-2 rounded-lg border border-border p-4 bg-surface text-sm md:text-base h-fit">
          <p className="mb-3 font-semibold text-text-primary border-b border-border pb-2">Order Summary</p>
          <div className="flex justify-between py-1.5">
            <span className="text-text-secondary">{selectedSeats.length} Tickets</span>
            <span className="font-medium">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between py-1.5">
            <span className="text-text-secondary">Booking Fee</span>
            <span className="font-medium">{formatCurrency(bookingFee)}</span>
          </div>
          <div className="mt-2 flex justify-between border-t border-border pt-2 font-semibold text-base md:text-lg">
            <span>Total</span>
            <span className="text-primary">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

export default function Checkout() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
