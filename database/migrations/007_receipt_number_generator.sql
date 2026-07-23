-- Generates sequential receipt numbers per calendar year, e.g. RRP-2026-000001.
-- Backed by a counter table (rather than a bare sequence) so the year resets to 1
-- automatically and the increment stays atomic under concurrent inserts.

create table receipt_number_counters (
  year integer primary key,
  last_number integer not null default 0
);

create or replace function generate_receipt_number()
returns text as $$
declare
  current_year integer := extract(year from now());
  next_number integer;
begin
  insert into receipt_number_counters (year, last_number)
  values (current_year, 1)
  on conflict (year) do update
    set last_number = receipt_number_counters.last_number + 1
  returning last_number into next_number;

  return 'RRP-' || current_year || '-' || lpad(next_number::text, 6, '0');
end;
$$ language plpgsql;
