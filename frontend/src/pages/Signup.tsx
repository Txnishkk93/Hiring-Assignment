import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AppShell } from '../components/AppShell';
import { signup } from '../api/auth.api';
import { getErrorMessage } from '../api/client';
import { useAppDispatch } from '../store/hooks';
import { setCredentials } from '../store/authSlice';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? '/';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const { token, user } = await signup(name, email, password);
      dispatch(setCredentials({ token, user }));
      navigate(redirectTo);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
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
          <Link to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`} className="pb-2 text-sm text-text-secondary">
            Login
          </Link>
          <span className="border-b-2 border-primary pb-2 text-sm font-semibold text-primary">Sign Up</span>
        </div>

        <form onSubmit={handleSubmit} className="w-full space-y-4">
          {[
            { label: 'Name', value: name, setter: setName, type: 'text' },
            { label: 'Email ID', value: email, setter: setEmail, type: 'email' },
            { label: 'Password', value: password, setter: setPassword, type: 'password' },
            { label: 'Confirm Password', value: confirmPassword, setter: setConfirmPassword, type: 'password' },
          ].map((field) => (
            <div key={field.label}>
              <label className="mb-1 block text-sm font-medium text-text-primary">{field.label}</label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                className="w-full rounded-lg border border-border-input px-3 py-2.5 text-sm outline-none focus:border-primary"
                required
              />
            </div>
          ))}

          {error && <p className="text-sm text-error">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-base font-semibold text-white disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </AppShell>
  );
}
