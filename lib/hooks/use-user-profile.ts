"use client"

import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useSupabaseAuth } from "./use-supabase-auth"

export interface UserProfile {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  avatar_url: string | null
  has_mfa: boolean
  created_at: string
  updated_at: string
}

export interface UseUserProfileReturn {
  profile: UserProfile | null
  loading: boolean
  error: string | null
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>
  refreshProfile: () => Promise<void>
}

export function useUserProfile(): UseUserProfileReturn {
  const { user, loading: authLoading } = useSupabaseAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const supabase = getSupabaseBrowserClient()

  const fetchProfile = async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const { data, error: fetchError } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (fetchError) {
        setError(fetchError.message)
        return
      }

      setProfile(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch profile")
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user || !profile) {
      return { success: false, error: "No user logged in" }
    }

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) {
        return { success: false, error: updateError.message }
      }

      // Update local state
      setProfile((prev) => (prev ? { ...prev, ...updates } : null))
      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update profile",
      }
    }
  }

  const refreshProfile = async () => {
    await fetchProfile()
  }

  useEffect(() => {
    if (!authLoading) {
      fetchProfile()
    }
  }, [user, authLoading])

  return {
    profile,
    loading: loading || authLoading,
    error,
    updateProfile,
    refreshProfile,
  }
}
