-- Existing table update for this React version.
-- Run this in Supabase SQL Editor if you previously created the first table with phone column.

alter table prayer_room_reservations
drop column if exists phone;

alter table prayer_room_reservations
add column if not exists cancel_code text;

update prayer_room_reservations
set cancel_code = '0000'
where cancel_code is null;

alter table prayer_room_reservations
alter column cancel_code set not null;
