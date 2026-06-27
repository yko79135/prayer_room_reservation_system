import { createClient } from "@supabase/supabase-js";

export const SUPABASE_URL = "https://nbwltocexvufetywrecx.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_9RA4GOB6JgKTmKI9jXfgZQ_vVjxger3";
export const TABLE_NAME = "prayer_room_reservations";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
