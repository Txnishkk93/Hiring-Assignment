import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { login } from '../api/auth.api';
import { getErrorMessage } from '../api/client';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/authSlice';
import { DEMO_EMAIL, DEMO_PASSWORD } from '../utils/pricing';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { token, user } = await login(email, password);
      dispatch(setCredentials({ token, user }));
      navigate(redirectTo);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = () => {
    setEmail(DEMO_EMAIL);
    setPassword(DEMO_PASSWORD);
  };

  return (
    <AppShell>
      <div className="flex flex-col items-center px-4 pt-10 max-w-md mx-auto w-full">
        <div className="mb-8 flex flex-col items-center">
          <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-xl text-white">
            🎬
          </div>
          <p className="text-sm font-semibold text-text-primary">Creative Upaay Hiring Assignment</p>
        </div>

        <div className="mb-6 flex w-full gap-6 border-b border-border">
          <span className="border-b-2 border-primary pb-2 text-sm font-semibold text-primary">Login</span>
          <Link to={`/signup?redirectTo=${encodeURIComponent(redirectTo)}`} className="pb-2 text-sm text-text-secondary">
            Sign Up
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Email ID</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-border-input px-3 py-2.5 text-sm outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-text-primary">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-border-input px-3 py-2.5 text-sm outline-none focus:border-primary"
              required
            />
          </div>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="rounded-lg bg-surface p-3 text-xs text-text-secondary">
            <p className="font-medium text-text-primary">Demo account</p>
            <p>{DEMO_EMAIL} / {DEMO_PASSWORD}</p>
            <button type="button" onClick={fillDemo} className="mt-2 text-primary font-medium">
              Use demo account
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
