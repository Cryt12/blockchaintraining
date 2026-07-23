create table categories (
  id uuid primary key default gen_random_uuid(),
  category_name text not null unique,
  description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_categories_name on categories (category_name);

create trigger trg_categories_updated_at
  before update on categories
  for each row execute function set_updated_at();
