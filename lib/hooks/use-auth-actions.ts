"use client"

import { useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export interface AuthActionResult {
  success: boolean
  error?: string
  requiresVerification?: boolean
  requiresMfa?: boolean
}

export interface UseAuthActionsReturn {
  loading: boolean
  signIn: (email: string, password: string) => Promise<AuthActionResult>
  signUp: (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }) => Promise<AuthActionResult>
  signOut: () => Promise<AuthActionResult>
  resetPassword: (email: string) => Promise<AuthActionResult>
  updatePassword: (password: string) => Promise<AuthActionResult>
  resendVerification: (email: string) => Promise<AuthActionResult>
}

export function useAuthActions(): UseAuthActionsReturn {
  const [loading, setLoading] = useState(false)
  const supabase = getSupabaseBrowserClient()
  const router = useRouter()

  const signIn = async (email: string, password: string): Promise<AuthActionResult> => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Check if email verification is required
      if (!data.user?.email_confirmed_at) {
        return {
          success: false,
          error: "Please verify your email before signing in",
          requiresVerification: true,
        }
      }

      // Check if MFA is required
      if (data.session === null && data.user?.factors && data.user.factors.length > 0) {
        return {
          success: true,
          requiresMfa: true,
        }
      }

      // Successful login
      router.push("/dashboard")
      router.refresh()

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      }
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<AuthActionResult> => {
    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          has_mfa: false,
        })

        if (profileError) {
          console.error("Error creating user profile:", profileError)
        }
      }

      return {
        success: true,
        requiresVerification: !data.session,
      }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async (): Promise<AuthActionResult> => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.signOut()

      if (error) {
        return { success: false, error: error.message }
      }

      router.push("/login")
      router.refresh()

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (email: string): Promise<AuthActionResult> => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password/confirm`,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      }
    } finally {
      setLoading(false)
    }
  }

  const updatePassword = async (password: string): Promise<AuthActionResult> => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      }
    } finally {
      setLoading(false)
    }
  }

  const resendVerification = async (email: string): Promise<AuthActionResult> => {
    try {
      setLoading(true)

      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (err) {
      return {
        success: false,
        error: err instanceof Error ? err.message : "An unexpected error occurred",
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    updatePassword,
    resendVerification,
  }
}
