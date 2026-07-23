create type item_status as enum ('active', 'depleted', 'archived');

create table expendable_items (
  id uuid primary key default gen_random_uuid(),
  property_number text not null unique,
  item_code text not null,
  description text not null,
  category_id uuid not null references categories(id) on delete restrict,
  unit text not null,
  quantity numeric(12, 2) not null default 0 check (quantity >= 0),
  remaining_quantity numeric(12, 2) not null default 0 check (remaining_quantity >= 0),
  remarks text,
  status item_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint chk_remaining_not_exceed_quantity check (remaining_quantity <= quantity)
);

create index idx_expendable_items_category on expendable_items (category_id);
create index idx_expendable_items_property_number on expendable_items (property_number);
create index idx_expendable_items_status on expendable_items (status) where deleted_at is null;

create trigger trg_expendable_items_updated_at
  before update on expendable_items
  for each row execute function set_updated_at();
