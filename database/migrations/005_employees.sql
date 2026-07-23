create type employee_status as enum ('active', 'inactive');

create table employees (
  id uuid primary key default gen_random_uuid(),
  employee_number text not null unique,
  full_name text not null,
  office_id uuid not null references offices(id) on delete restrict,
  position text,
  status employee_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index idx_employees_office on employees (office_id);
create index idx_employees_employee_number on employees (employee_number);
create index idx_employees_status on employees (status) where deleted_at is null;

create trigger trg_employees_updated_at
  before update on employees
  for each row execute function set_updated_at();
