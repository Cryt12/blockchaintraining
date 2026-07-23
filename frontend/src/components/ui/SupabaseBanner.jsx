import { AlertTriangle } from 'lucide-react';
import { isSupabaseConfigured } from '@/lib/supabase';

// Surfaced until VITE_SUPABASE_URL / key are filled in. While it shows, the app
// runs on demo data so the UI is fully explorable before the backend is connected.
export default function SupabaseBanner() {
  if (isSupabaseConfigured) return null;

  return (
    <div className="mb-5 flex items-start gap-3 rounded-lg border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p>
        <span className="font-semibold">Demo mode.</span> Supabase isn't configured yet — pages show
        sample data. Add <code className="rounded bg-black/5 px-1 dark:bg-white/10">VITE_SUPABASE_URL</code>{' '}
        and <code className="rounded bg-black/5 px-1 dark:bg-white/10">VITE_SUPABASE_PUBLISHABLE_KEY</code>{' '}
        to <code className="rounded bg-black/5 px-1 dark:bg-white/10">.env</code> to connect live data.
      </p>
    </div>
  );
}
