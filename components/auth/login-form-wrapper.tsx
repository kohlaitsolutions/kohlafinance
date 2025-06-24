"use client"

import { useSearchParams } from "next/navigation"
import { LoginForm } from "./login-form"

export function LoginFormWrapper() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get("redirect") || "/dashboard"

  return <LoginForm redirectTo={redirectTo} />
}
