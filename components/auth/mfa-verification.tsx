"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth/auth-context"

export function MfaVerification() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { verifyMfa } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { success, error } = await verifyMfa(code)
      if (!success && error) {
        setError(error)
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
    } finally {
      setIsLoading(false)
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
          <h1 className="text-2xl font-semibold tracking-tight">Two-Factor Authentication</h1>
          <p className="text-sm text-muted-foreground">
            Enter the verification code from your authenticator app to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Verification Code</Label>
            <Input
              id="code"
              placeholder="123456"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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

          <Button type="submit" className="w-full" disabled={isLoading || code.length !== 6}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
              </>
            ) : (
              "Verify"
            )}
          </Button>
        </form>
      </div>
    </motion.div>
  )
}
