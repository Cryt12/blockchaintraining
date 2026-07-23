import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Compass className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-3xl font-bold text-slate-800 dark:text-slate-100">404</h1>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
        We couldn't find the page you're looking for.
      </p>
      <Link to="/" className="btn-primary mt-6">Back to dashboard</Link>
    </div>
  );
}
