create type blockchain_status as enum ('pending', 'confirmed', 'failed');

create table blockchain_logs (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references return_receipts(id) on delete cascade,
  receipt_number text not null,
  sha256_hash text not null,
  transaction_hash text unique,
  wallet_address text,
  block_number bigint,
  gas_used numeric(20, 0),
  network text not null default 'sepolia',
  status blockchain_status not null default 'pending',
  explorer_url text,
  error_message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_blockchain_logs_receipt on blockchain_logs (receipt_id);
create index idx_blockchain_logs_tx_hash on blockchain_logs (transaction_hash);
create index idx_blockchain_logs_status on blockchain_logs (status);

create trigger trg_blockchain_logs_updated_at
  before update on blockchain_logs
  for each row execute function set_updated_at();
