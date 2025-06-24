"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { CheckCircle2, Loader2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

export default function VerifyPage() {
  const [verificationStatus, setVerificationStatus] = useState<"loading" | "success" | "error">("loading")
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const supabase = getSupabaseBrowserClient()

        // Get the token from the URL
        const token = searchParams.get("token_hash")
        const type = searchParams.get("type")

        if (!token || type !== "email") {
          setVerificationStatus("error")
          setErrorMessage("Invalid verification link")
          return
        }

        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: token,
          type: "email",
        })

        if (error) {
          throw error
        }

        setVerificationStatus("success")

        // Redirect to dashboard after 3 seconds
        setTimeout(() => {
          router.push("/dashboard")
          router.refresh()
        }, 3000)
      } catch (error: any) {
        console.error("Verification error:", error)
        setVerificationStatus("error")
        setErrorMessage(error.message || "Failed to verify email")
      }
    }

    verifyEmail()
  }, [router, searchParams])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Email Verification</CardTitle>
          <CardDescription className="text-center">
            {verificationStatus === "loading" && "Verifying your email address..."}
            {verificationStatus === "success" && "Your email has been verified!"}
            {verificationStatus === "error" && "Verification failed"}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          {verificationStatus === "loading" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-primary/10 p-3">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
              <p className="text-center text-muted-foreground">Please wait while we verify your email address...</p>
            </div>
          )}

          {verificationStatus === "success" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
                <CheckCircle2 className="h-8 w-8 text-green-600 dark:text-green-500" />
              </div>
              <div className="text-center">
                <p className="font-medium">Your email has been verified successfully!</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  You will be redirected to the dashboard in a few seconds.
                </p>
              </div>
            </div>
          )}

          {verificationStatus === "error" && (
            <div className="flex flex-col items-center space-y-4">
              <div className="rounded-full bg-red-100 p-3 dark:bg-red-900/20">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-500" />
              </div>
              <div className="text-center">
                <p className="font-medium">Verification failed</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {errorMessage || "There was an error verifying your email address."}
                </p>
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          {verificationStatus === "error" && (
            <Button asChild>
              <Link href="/login">Return to Login</Link>
            </Button>
          )}
          {verificationStatus === "success" && (
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
