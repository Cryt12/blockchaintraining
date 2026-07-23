-- RREPS: extensions and shared helper functions
-- Run this file first; every later migration depends on it.

create extension if not exists "pgcrypto";

-- Shared trigger: keeps updated_at current on every UPDATE.
-- Attached to each table below instead of relying on application code,
-- so it stays correct even for updates issued outside Laravel (e.g. Supabase SQL editor).
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;
