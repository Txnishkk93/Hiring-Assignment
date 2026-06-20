import { useState } from 'react';

export interface CardFormValues {
  cardHolderName: string;
  cardNumber: string;
  expiryMonth: number;
  expiryYear: number;
  cvv: string;
}

interface CardFormProps {
  onSubmit: (values: CardFormValues) => void;
  loading?: boolean;
}

export function CardForm({ onSubmit, loading }: CardFormProps) {
  const [cardHolderName, setCardHolderName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors: Record<string, string> = {};
    const digits = cardNumber.replace(/\s/g, '');

    if (!cardHolderName.trim()) nextErrors.cardHolderName = 'Name is required';
    if (!/^\d{16}$/.test(digits)) nextErrors.cardNumber = 'Card number must be 16 digits';
    if (!/^\d{1,2}$/.test(expiryMonth) || Number(expiryMonth) < 1 || Number(expiryMonth) > 12) {
      nextErrors.expiryMonth = 'Invalid month';
    }
    const year = Number(expiryYear);
    if (!/^\d{4}$/.test(expiryYear) || year < new Date().getFullYear()) {
      nextErrors.expiryYear = 'Invalid or expired year';
    }
    if (!/^\d{3}$/.test(cvv)) nextErrors.cvv = 'CVV must be 3 digits';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    onSubmit({
      cardHolderName: cardHolderName.trim(),
      cardNumber: digits,
      expiryMonth: Number(expiryMonth),
      expiryYear: year,
      cvv,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="mb-1 block text-sm font-medium text-text-primary">Name on card</label>
        <input
          value={cardHolderName}
          onChange={(e) => setCardHolderName(e.target.value)}
          className="w-full rounded-lg border border-border-input px-3 py-2.5 text-sm outline-none focus:border-primary"
          placeholder="John Doe"
        />
        {errors.cardHolderName && <p className="mt-1 text-xs text-error">{errors.cardHolderName}</p>}
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium text-text-primary">Card number</label>
        <input
          value={cardNumber}
          onChange={(e) => setCardNumber(e.target.value)}
          inputMode="numeric"
          maxLength={19}
          className="w-full rounded-lg border border-border-input px-3 py-2.5 text-sm outline-none focus:border-primary"
          placeholder="4111 1111 1111 1111"
        />
        {errors.cardNumber && <p className="mt-1 text-xs text-error">{errors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">MM</label>
          <input
            value={expiryMonth}
            onChange={(e) => setExpiryMonth(e.target.value)}
            inputMode="numeric"
            className="w-full rounded-lg border border-border-input px-3 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="12"
          />
          {errors.expiryMonth && <p className="mt-1 text-xs text-error">{errors.expiryMonth}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">YYYY</label>
          <input
            value={expiryYear}
            onChange={(e) => setExpiryYear(e.target.value)}
            inputMode="numeric"
            className="w-full rounded-lg border border-border-input px-3 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="2028"
          />
          {errors.expiryYear && <p className="mt-1 text-xs text-error">{errors.expiryYear}</p>}
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-text-primary">CVV</label>
          <input
            value={cvv}
            onChange={(e) => setCvv(e.target.value)}
            inputMode="numeric"
            maxLength={3}
            className="w-full rounded-lg border border-border-input px-3 py-2.5 text-sm outline-none focus:border-primary"
            placeholder="123"
          />
          {errors.cvv && <p className="mt-1 text-xs text-error">{errors.cvv}</p>}
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Processing...' : 'Complete Payment'}
      </button>
    </form>
  );
}
