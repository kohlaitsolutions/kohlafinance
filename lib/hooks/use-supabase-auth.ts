"use client"

import { useEffect, useState } from "react"
import type { User, Session, AuthError } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: AuthError | null
}

export function useSupabaseAuth(): AuthState {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  })

  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          setAuthState((prev) => ({ ...prev, error, loading: false }))
          return
        }

        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null,
        })
      } catch (error) {
        setAuthState((prev) => ({
          ...prev,
          error: error as AuthError,
          loading: false,
        }))
      }
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setAuthState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      })
    })

    getInitialSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return authState
}
