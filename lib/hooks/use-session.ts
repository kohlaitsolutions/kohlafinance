"use client"

import { useEffect, useState } from "react"
import type { Session } from "@supabase/supabase-js"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export interface UseSessionReturn {
  session: Session | null
  loading: boolean
  isExpired: boolean
  timeUntilExpiry: number | null
  refreshSession: () => Promise<{ success: boolean; error?: string }>
}

export function useSession(): UseSessionReturn {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [timeUntilExpiry, setTimeUntilExpiry] = useState<number | null>(null)

  const supabase = getSupabaseBrowserClient()

  const isExpired = session ? new Date(session.expires_at! * 1000) < new Date() : false

  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession()

      if (error) {
        return { success: false, error: error.message }
      }

      setSession(data.session)
      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to refresh session",
      }
    }
  }

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setLoading(false)
    }

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setLoading(false)
    })

    getInitialSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Update time until expiry
  useEffect(() => {
    if (!session?.expires_at) {
      setTimeUntilExpiry(null)
      return
    }

    const updateTimer = () => {
      const expiryTime = new Date(session.expires_at! * 1000)
      const now = new Date()
      const timeLeft = expiryTime.getTime() - now.getTime()
      setTimeUntilExpiry(Math.max(0, timeLeft))
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [session])

  return {
    session,
    loading,
    isExpired,
    timeUntilExpiry,
    refreshSession,
  }
}
