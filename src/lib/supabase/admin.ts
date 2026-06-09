import { createClient } from "@supabase/supabase-js";

/**
 * PRIVILEGED Supabase client using the service_role key.
 *
 * This BYPASSES Row Level Security and must ONLY ever be imported in
 * server-side code (API route handlers, server actions) — never in a
 * Client Component. We use it for trusted AI operations that need to read
 * across many candidates (matching) or write system rows (extracted
 * profiles, match results).
 */
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
