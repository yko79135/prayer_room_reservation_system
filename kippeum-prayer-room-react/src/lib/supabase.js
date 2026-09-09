import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://nbwltocexvufetywrecx.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_9RA4GOB6JgKTmKI9jXfgZQ_vVjxger3";
export const TABLE_NAME = "prayer_room_reservations";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { headers: { "x-actor": "member" } }
});

// Same credentials, but tags its requests so the deletion audit trigger can
// tell an admin deletion apart from a member cancelling their own booking.
// If the header is ever stripped the trigger still logs the row, as "unknown".
export const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  global: { headers: { "x-actor": "admin" } }
});
