import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';

export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
        <ShieldAlert className="h-7 w-7" />
      </span>
      <h1 className="mt-4 text-2xl font-bold text-slate-800 dark:text-slate-100">Access denied</h1>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Your role doesn't have permission to view this page. Contact an administrator if you believe
        this is a mistake.
      </p>
      <Link to="/" className="btn-primary mt-6">Back to dashboard</Link>
    </div>
  );
}
