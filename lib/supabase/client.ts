import { createBrowserClient } from "@supabase/ssr"

let supabaseClient: ReturnType<typeof createBrowserClient> | undefined

export function getSupabaseBrowserClient() {
  if (typeof window === "undefined") {
    throw new Error("Supabase client can only be used in the browser")
  }

  if (!supabaseClient) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error("Missing Supabase environment variables")
    }

    supabaseClient = createBrowserClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true,
        flowType: "pkce",
      },
      global: {
        headers: {
          "X-Client-Info": "kohlawise-web",
        },
      },
    })
  }
  return supabaseClient
}

// Create a safe client getter that handles SSR
export function createSafeSupabaseClient() {
  try {
    return getSupabaseBrowserClient()
  } catch (error) {
    console.error("Failed to create Supabase client:", error)
    return null
  }
}
