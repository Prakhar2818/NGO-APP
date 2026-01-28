import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { env } from "./env.js";

export const supabase: SupabaseClient = createClient(
  env.supabasePublicUrl,
  env.supabaseServiceKey,
);
