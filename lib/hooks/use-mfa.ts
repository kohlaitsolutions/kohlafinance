"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useSupabaseAuth } from "./use-supabase-auth"

export interface MfaFactor {
  id: string
  type: string
  status: string
  created_at: string
}

export interface UseMfaReturn {
  loading: boolean
  factors: MfaFactor[]
  enrollMfa: () => Promise<{ success: boolean; qrCode?: string; secret?: string; error?: string }>
  verifyMfa: (code: string, factorId?: string) => Promise<{ success: boolean; error?: string }>
  unenrollMfa: (factorId: string) => Promise<{ success: boolean; error?: string }>
  challengeMfa: (factorId: string) => Promise<{ success: boolean; challengeId?: string; error?: string }>
  refreshFactors: () => Promise<void>
}

export function useMfa(): UseMfaReturn {
  const { user } = useSupabaseAuth()
  const [loading, setLoading] = useState(false)
  const [factors, setFactors] = useState<MfaFactor[]>([])

  const supabase = getSupabaseBrowserClient()

  const refreshFactors = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase.auth.mfa.listFactors()

      if (error) {
        console.error("Error fetching MFA factors:", error)
        return
      }

      setFactors(data.totp || [])
    } catch (err) {
      console.error("Error refreshing MFA factors:", err)
    }
  }

  const enrollMfa = async () => {
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    try {
      setLoading(true)

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Kohlawise App",
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Update user profile to indicate MFA is enabled
      await supabase.from("users").update({ has_mfa: true }).eq("id", user.id)

      await refreshFactors()

      return {
        success: true,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to enroll MFA",
      }
    } finally {
      setLoading(false)
    }
  }

  const verifyMfa = async (code: string, factorId?: string) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.mfa.verify({
        factorId: factorId || factors[0]?.id,
        code,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to verify MFA",
      }
    } finally {
      setLoading(false)
    }
  }

  const unenrollMfa = async (factorId: string) => {
    if (!user) {
      return { success: false, error: "User not authenticated" }
    }

    try {
      setLoading(true)

      const { error } = await supabase.auth.mfa.unenroll({
        factorId,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Update user profile to indicate MFA is disabled
      await supabase.from("users").update({ has_mfa: false }).eq("id", user.id)

      await refreshFactors()

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to unenroll MFA",
      }
    } finally {
      setLoading(false)
    }
  }

  const challengeMfa = async (factorId: string) => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.mfa.challenge({
        factorId,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return {
        success: true,
        challengeId: data.id,
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to create MFA challenge",
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    factors,
    enrollMfa,
    verifyMfa,
    unenrollMfa,
    challengeMfa,
    refreshFactors,
  }
}
