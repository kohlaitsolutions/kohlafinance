"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { MfaVerification } from "@/components/auth/mfa-verification"
import { useAuth } from "@/lib/auth/auth-context"

export default function MfaPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 p-4">
      <div className="w-full max-w-md space-y-6">
        <MfaVerification />
      </div>
    </div>
  )
}
