create table offices (
  id uuid primary key default gen_random_uuid(),
  office_name text not null,
  office_code text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_offices_office_code on offices (office_code);

create trigger trg_offices_updated_at
  before update on offices
  for each row execute function set_updated_at();
