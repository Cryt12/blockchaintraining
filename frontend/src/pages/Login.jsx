import { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { ShieldCheck, LogIn, Loader2 } from 'lucide-react';
import { useAuth, DEMO_ACCOUNTS } from '@/contexts/AuthContext';
import { toastError, toastSuccess } from '@/lib/toast';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm({
    defaultValues: { email: '', password: '' },
  });

  const from = location.state?.from?.pathname || '/';

  if (isAuthenticated) return <Navigate to={from} replace />;

  const onSubmit = async ({ email, password }) => {
    setSubmitting(true);
    try {
      const user = await login(email, password);
      toastSuccess(`Welcome, ${user.name}`);
      navigate(from, { replace: true });
    } catch (err) {
      toastError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (account) => {
    setValue('email', account.email);
    setValue('password', account.password);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas p-4 dark:bg-slate-950">
      <div className="w-full max-w-md">
        <div className="mb-6 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-white">
            <ShieldCheck className="h-7 w-7" />
          </span>
          <h1 className="mt-3 text-2xl font-bold text-slate-800 dark:text-slate-100">RREPS</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Receipt of Returned Expendable Property System
          </p>
        </div>

        <div className="card p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                className="input"
                placeholder="you@agency.gov"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <p className="mt-1 text-xs text-danger">{errors.email.message}</p>}
            </div>

            <div>
              <label className="label" htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                className="input"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
              {errors.password && <p className="mt-1 text-xs text-danger">{errors.password.message}</p>}
            </div>

            <button type="submit" disabled={submitting} className="btn-primary w-full">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Sign in
            </button>
          </form>

          <div className="mt-6 border-t border-slate-100 pt-4 dark:border-slate-800">
            <p className="mb-2 text-xs font-medium text-slate-400">
              Demo accounts (click to fill) — password <code>demo1234</code>
            </p>
            <div className="grid grid-cols-2 gap-2">
              {DEMO_ACCOUNTS.map((a) => (
                <button
                  key={a.email}
                  type="button"
                  onClick={() => fillDemo(a)}
                  className="rounded-lg border border-slate-200 px-2.5 py-1.5 text-left text-xs text-slate-600 hover:border-primary hover:text-primary dark:border-slate-700 dark:text-slate-300"
                >
                  {a.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-4 text-center text-xs text-slate-400">
          Operational data in Supabase · Integrity anchored on Ethereum Sepolia
        </p>
      </div>
    </div>
  );
}
