-- canonical_json + receipt_hash capture the exact payload that was hashed and
-- sent to the blockchain, so verification can recompute and compare deterministically
-- (see Blockchain Verification module) without guessing at historical formatting.

create type receipt_status as enum (
  'draft',
  'submitted',
  'blockchain_pending',
  'blockchain_verified',
  'blockchain_failed'
);

create table return_receipts (
  id uuid primary key default gen_random_uuid(),
  receipt_number text not null unique default generate_receipt_number(),
  employee_id uuid not null references employees(id) on delete restrict,
  office_id uuid not null references offices(id) on delete restrict,
  return_date date not null default current_date,
  received_by uuid references users(id) on delete set null,
  purpose text,
  remarks text,
  status receipt_status not null default 'draft',
  canonical_json jsonb,
  receipt_hash text,
  created_by uuid references users(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_return_receipts_employee on return_receipts (employee_id);
create index idx_return_receipts_office on return_receipts (office_id);
create index idx_return_receipts_status on return_receipts (status) where deleted_at is null;
create index idx_return_receipts_receipt_number on return_receipts (receipt_number);
create index idx_return_receipts_return_date on return_receipts (return_date);

create trigger trg_return_receipts_updated_at
  before update on return_receipts
  for each row execute function set_updated_at();
