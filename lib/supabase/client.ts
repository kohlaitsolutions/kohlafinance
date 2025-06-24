/**
 * 🚧  Supabase has been removed from Kohlawise.
 * This tiny shim keeps legacy imports from crashing the build.
 * It always returns `null` and logs a warn once in development.
 */
let warned = false
export function getSupabaseBrowserClient() {
  if (process.env.NODE_ENV !== "production" && !warned) {
    // eslint-disable-next-line no-console
    console.warn("[kohlawise] Supabase browser client requested but Supabase is disabled.")
    warned = true
  }
  return null
}
