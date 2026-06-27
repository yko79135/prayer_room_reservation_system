# Kippeum Church Prayer Room Reservation App

React + Vite + Supabase reservation app for 기쁨교회 옥상 기도실.

## Features

- 30-minute reservation slots
- 24-hour reservation system
- Book from now up to one month ahead
- Select and reserve multiple slots at once
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
