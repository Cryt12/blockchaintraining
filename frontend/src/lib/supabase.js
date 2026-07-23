import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// The app must still boot for local UI development before Supabase is wired up
// (the project URL is filled in last). `isSupabaseConfigured` lets pages fall back
// to demo data and show a "not connected" banner instead of crashing on an empty URL.
export const isSupabaseConfigured = Boolean(url && key);

export const supabase = isSupabaseConfigured
  ? createClient(url, key, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;
