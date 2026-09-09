# Kippeum Church Prayer Room Reservation App

React + Vite + Supabase reservation app for 기쁨교회 옥상 “잠근동산” 기도실.

## Features

- One-hour reservation slots from 7:00 AM through 10:00 PM
- One reservation hour per person each week
- Book from now up to one month ahead
- Select and reserve one available hour
- No phone number required
- User can delete with cancellation password
- Admin can delete with admin password
- Supabase backend
- Church-style hero background using the uploaded Kippeum Church photo

## Run locally

```bash
npm install
npm run dev
```

## Supabase

The Supabase URL and publishable key are already included in `src/main.jsx`.

If your existing table still has the old `phone` column, run:

```sql
supabase_update.sql
```

in Supabase SQL Editor.

### Deletion audit log

Reservations are hard-deleted, so without this there is no record of what a
deleted reservation held. Run `supabase_deletion_audit.sql` once in the SQL
Editor to add a `deleted_reservations` table and a `before delete` trigger that
copies every deleted row, whoever deleted it and however it was deleted.

The table has RLS on and no policies, so the publishable key cannot read it —
query it from the SQL Editor:

```sql
select deleted_at, deleted_by, date, time, name, reserved_at
from deleted_reservations
order by deleted_at desc
limit 50;
```

`deleted_by` is `admin` for deletions made in admin mode, `member` for someone
cancelling with their own cancellation password, and `unknown` for anything
that did not come through the app (a SQL Editor or dashboard delete).

## Design notes for Codex

Keep the wide hero image ratio. Do not stretch the church photo vertically.
The hero uses:

```css
.hero {
  min-height: clamp(360px, 45vw, 560px);
  background-size: cover;
  background-position: center center;
}
```

Mobile uses a taller hero but keeps the same image as a background crop.
