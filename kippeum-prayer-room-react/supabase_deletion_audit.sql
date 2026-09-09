-- Deletion audit log for prayer_room_reservations.
-- Run this once in the Supabase SQL Editor.
--
-- Reservations are hard-deleted, so once a row is gone nothing records what it
-- held. This keeps a copy of every deleted row, whoever deleted it and however
-- it was deleted (app, SQL editor, dashboard).

create table if not exists deleted_reservations (
  id bigint generated always as identity primary key,
  reservation_id uuid not null,
  reservation_key text not null,
  date date not null,
  time text not null,
  name text not null,
  note text,
  cancel_code text,
  reserved_at timestamptz,
  deleted_at timestamptz not null default now(),
  deleted_by text not null default 'unknown',
  user_agent text
);

create index if not exists deleted_reservations_deleted_at_idx
  on deleted_reservations (deleted_at desc);

create index if not exists deleted_reservations_date_time_idx
  on deleted_reservations (date, time);

-- RLS on with no policies: the publishable (anon) key can neither read nor
-- write this table through the API. The trigger below is security definer, so
-- it still records deletions. Read the log from the SQL Editor.
alter table deleted_reservations enable row level security;

create or replace function log_reservation_deletion()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  headers json;
begin
  -- request.headers is only set for requests arriving through PostgREST, and
  -- deletions run from the SQL Editor have none. Never let that abort the
  -- delete: an unattributed audit row beats a lost one.
  begin
    headers := nullif(current_setting('request.headers', true), '')::json;
  exception when others then
    headers := null;
  end;

  insert into deleted_reservations (
    reservation_id, reservation_key, date, time, name, note, cancel_code,
    reserved_at, deleted_by, user_agent
  ) values (
    old.id, old.reservation_key, old.date, old.time, old.name, old.note,
    old.cancel_code, old.created_at,
    coalesce(nullif(headers ->> 'x-actor', ''), 'unknown'),
    headers ->> 'user-agent'
  );

  return old;
end;
$$;

drop trigger if exists log_reservation_deletion on prayer_room_reservations;

create trigger log_reservation_deletion
before delete on prayer_room_reservations
for each row execute function log_reservation_deletion();

-- Recent deletions, newest first:
--
--   select deleted_at, deleted_by, date, time, name, reserved_at
--   from deleted_reservations
--   order by deleted_at desc
--   limit 50;
