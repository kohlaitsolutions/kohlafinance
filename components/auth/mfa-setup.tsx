"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth/auth-context"
import { useToast } from "@/components/ui/use-toast"

export function MfaSetup() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [verificationCode, setVerificationCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { setupMfa, verifyMfa } = useAuth()
  const { toast } = useToast()

  const handleSetup = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { success, setupUrl, error } = await setupMfa()
      if (success && setupUrl) {
        setQrCode(setupUrl)
      } else if (error) {
        setError(error)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsVerifying(true)
    setError(null)

    try {
      const { success, error } = await verifyMfa(verificationCode)
      if (success) {
        toast({
          title: "MFA Enabled",
          description: "Two-factor authentication has been successfully enabled for your account.",
        })
      } else if (error) {
        setError(error)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsVerifying(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Set Up Two-Factor Authentication</h1>
          <p className="text-sm text-muted-foreground">
            Enhance your account security by enabling two-factor authentication.
          </p>
        </div>

        {!qrCode ? (
          <div className="space-y-4">
            <div className="rounded-md bg-primary/10 p-4">
              <div className="flex items-start">
                <div className="flex-1 space-y-2">
                  <p className="font-medium">Why use two-factor authentication?</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1">
                    <li>Adds an extra layer of security to your account</li>
                    <li>Protects against unauthorized access even if your password is compromised</li>
                    <li>Verifies your identity with something you know and something you have</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button onClick={handleSetup} className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Setting up...
                </>
              ) : (
                "Set Up Two-Factor Authentication"
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-center">
                <div className="rounded-lg border p-2 bg-white">
                  <Image src={qrCode || "/placeholder.svg"} alt="QR Code" width={200} height={200} />
                </div>
              </div>
              <div className="space-y-2 text-center">
                <p className="text-sm font-medium">Scan this QR code with your authenticator app</p>
                <p className="text-xs text-muted-foreground">
                  We recommend using Google Authenticator, Authy, or Microsoft Authenticator.
                </p>
              </div>
            </div>

            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="verificationCode">Verification Code</Label>
                <Input
                  id="verificationCode"
                  placeholder="123456"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  maxLength={6}
                  className="text-center text-lg tracking-widest"
                  required
                />
              </div>

              {error && (
                <div className="rounded-md bg-destructive/15 p-3">
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-destructive mr-2" />
                    <p className="text-sm font-medium text-destructive">{error}</p>
                  </div>
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isVerifying || verificationCode.length !== 6}>
                {isVerifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                  </>
                ) : (
                  "Verify and Enable"
                )}
              </Button>
            </form>
          </div>
        )}
      </div>
    </motion.div>
  )
}
