/**
 * 🚧  Supabase has been removed from Kohlawise.
 * This stub satisfies existing imports during the transition period.
 */
let warned = false
export function getSupabaseServerClient() {
  if (process.env.NODE_ENV !== "production" && !warned) {
    // eslint-disable-next-line no-console
    console.warn("[kohlawise] Supabase server client requested but Supabase is disabled.")
    warned = true
  }
  return null
}
