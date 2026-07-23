-- entity_type/entity_id are a loose polymorphic reference (e.g. 'return_receipts', <uuid>)
-- rather than a hard FK, since a single audit trail spans many different entity tables.

create table activity_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references users(id) on delete set null,
  action text not null,
  entity_type text,
  entity_id uuid,
  description text,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index idx_activity_logs_user on activity_logs (user_id);
create index idx_activity_logs_action on activity_logs (action);
create index idx_activity_logs_entity on activity_logs (entity_type, entity_id);
create index idx_activity_logs_created_at on activity_logs (created_at desc);
