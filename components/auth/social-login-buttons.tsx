"use client"

import { useState } from "react"
import { Github, Loader2 } from "lucide-react"
import { FcGoogle } from "react-icons/fc"
import { Button } from "@/components/ui/button"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

interface SocialLoginButtonsProps {
  onSuccess?: () => void
  onError?: (error: string) => void
}

export function SocialLoginButtons({ onSuccess, onError }: SocialLoginButtonsProps) {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [isGithubLoading, setIsGithubLoading] = useState(false)
  const supabase = getSupabaseBrowserClient()

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("Google login error:", error)
      onError?.(error.message || "Failed to sign in with Google")
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const handleGithubLogin = async () => {
    try {
      setIsGithubLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "github",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw error
      }
    } catch (error: any) {
      console.error("GitHub login error:", error)
      onError?.(error.message || "Failed to sign in with GitHub")
    } finally {
      setIsGithubLoading(false)
    }
  }

  return (
    <div className="flex flex-col space-y-3">
      <Button
        type="button"
        variant="outline"
        onClick={handleGoogleLogin}
        disabled={isGoogleLoading || isGithubLoading}
        className="flex items-center justify-center gap-2"
      >
        {isGoogleLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <FcGoogle className="h-5 w-5" />}
        Continue with Google
      </Button>
      <Button
        type="button"
        variant="outline"
        onClick={handleGithubLogin}
        disabled={isGoogleLoading || isGithubLoading}
        className="flex items-center justify-center gap-2"
      >
        {isGithubLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Github className="h-5 w-5" />}
        Continue with GitHub
      </Button>
    </div>
  )
}
