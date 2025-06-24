"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSupabaseAuth } from "./use-supabase-auth"

export interface UseProtectedRouteOptions {
  redirectTo?: string
  requireEmailVerification?: boolean
  requiredRole?: string
}

export function useProtectedRoute(options: UseProtectedRouteOptions = {}) {
  const { user, session, loading } = useSupabaseAuth()
  const router = useRouter()

  const { redirectTo = "/login", requireEmailVerification = true, requiredRole } = options

  useEffect(() => {
    if (loading) return

    // Check if user is authenticated
    if (!user || !session) {
      router.push(redirectTo)
      return
    }

    // Check email verification
    if (requireEmailVerification && !user.email_confirmed_at) {
      router.push("/auth/verify")
      return
    }

    // Check role if required
    if (requiredRole && user.user_metadata?.role !== requiredRole) {
      router.push("/unauthorized")
      return
    }
  }, [user, session, loading, router, redirectTo, requireEmailVerification, requiredRole])

  return {
    user,
    session,
    loading,
    isAuthenticated: !!user && !!session,
  }
}
