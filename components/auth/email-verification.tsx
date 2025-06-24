"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { createClient } from "@/lib/supabase/client"
import { CheckCircle, XCircle, Loader2, Mail } from "lucide-react"

export function EmailVerification() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const router = useRouter()
  const searchParams = useSearchParams()

  const supabase = createClient()

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token")
      const type = searchParams.get("type")

      if (!token || !type) {
        setStatus("error")
        setMessage("Invalid verification link")
        return
      }

      try {
        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: type as any,
        })

        if (error) {
          setStatus("error")
          setMessage(error.message)
          return
        }

        if (data.user) {
          // Update user verification status
          await supabase.from("users").update({ email_verified: true }).eq("id", data.user.id)

          setStatus("success")
          setMessage("Email verified successfully!")

          // Redirect to dashboard after 3 seconds
          setTimeout(() => {
            router.push("/dashboard")
          }, 3000)
        }
      } catch (err: any) {
        setStatus("error")
        setMessage(err.message || "Verification failed")
      }
    }

    verifyEmail()
  }, [searchParams, supabase, router])

  const resendVerification = async () => {
    // Implementation for resending verification email
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: searchParams.get("email") || "",
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage("Verification email sent!")
      }
    } catch (err: any) {
      setMessage(err.message || "Failed to resend email")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            {status === "loading" && <Loader2 className="h-6 w-6 animate-spin text-blue-600" />}
            {status === "success" && (
              <div className="bg-green-100 rounded-full p-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            )}
            {status === "error" && (
              <div className="bg-red-100 rounded-full p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Verifying Your Email"}
            {status === "success" && "Email Verified!"}
            {status === "error" && "Verification Failed"}
          </CardTitle>
          <CardDescription>
            {status === "loading" && "Please wait while we verify your email address..."}
            {status === "success" && "Your email has been successfully verified. Redirecting to dashboard..."}
            {status === "error" && "There was a problem verifying your email address."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {message && (
            <Alert className={status === "error" ? "border-red-200" : "border-green-200"}>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          {status === "success" && (
            <div className="mt-4 space-y-4">
              <Button onClick={() => router.push("/dashboard")} className="w-full">
                Go to Dashboard
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="mt-4 space-y-4">
              <Button onClick={resendVerification} variant="outline" className="w-full">
                <Mail className="mr-2 h-4 w-4" />
                Resend Verification Email
              </Button>
              <Button onClick={() => router.push("/login")} variant="ghost" className="w-full">
                Back to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
