create type item_condition as enum ('good', 'serviceable', 'damaged', 'defective', 'missing_parts');

create table receipt_items (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references return_receipts(id) on delete cascade,
  item_id uuid not null references expendable_items(id) on delete restrict,
  quantity numeric(12, 2) not null check (quantity > 0),
  condition item_condition not null,
  remarks text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_receipt_items_receipt on receipt_items (receipt_id);
create index idx_receipt_items_item on receipt_items (item_id);

create trigger trg_receipt_items_updated_at
  before update on receipt_items
  for each row execute function set_updated_at();
