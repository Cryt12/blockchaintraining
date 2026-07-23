-- Optional starter data. Safe to re-run: skips rows that already exist.
-- No user accounts are seeded here — create the first administrator through
-- the application's registration/setup flow so its password is hashed properly.

insert into categories (category_name, description) values
  ('Office Supplies', 'Consumable items used in day-to-day office work'),
  ('ICT Equipment', 'Computer peripherals, cables, and small IT hardware'),
  ('Cleaning Materials', 'Janitorial and sanitation supplies'),
  ('Medical Supplies', 'First aid and basic medical consumables')
on conflict (category_name) do nothing;
