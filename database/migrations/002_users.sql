-- Users & role-based access control.
-- wallet_address is optional: only custodians who submit blockchain transactions need one linked.

create type user_role as enum ('administrator', 'property_custodian', 'verifier', 'viewer');

create table users (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  role user_role not null default 'viewer',
  wallet_address text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_users_email on users (email);
create index idx_users_role on users (role) where deleted_at is null;
create index idx_users_wallet_address on users (wallet_address) where wallet_address is not null;

create trigger trg_users_updated_at
  before update on users
  for each row execute function set_updated_at();
