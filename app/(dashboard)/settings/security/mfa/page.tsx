"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MfaSetup } from "@/components/auth/mfa-setup"
import { useAuth } from "@/lib/auth/auth-context"

export default function MfaSetupPage() {
  const { isAuthenticated, isLoading, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, router])

  // If user already has MFA enabled, redirect to settings
  useEffect(() => {
    if (user?.hasMfa) {
      router.push("/settings/security")
    }
  }, [user, router])

  return (
    <div className="container mx-auto py-6">
      <div className="mx-auto max-w-md">
        <MfaSetup />
      </div>
    </div>
  )
}
