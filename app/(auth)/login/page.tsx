"use client"

import { Suspense } from "react"
import { Toaster } from "@/components/ui/toaster"
import { LoginPageContent } from "@/components/auth/login-page-content"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 p-4">
      <Suspense fallback={<div className="text-center">Loading...</div>}>
        <LoginPageContent />
      </Suspense>
      <Toaster />
    </div>
  )
}
