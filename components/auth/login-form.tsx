"use client"

import { useState, type FormEvent, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, AlertCircle, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { validateEmail } from "@/lib/form-validation"
import { SocialLoginButtons } from "./social-login-buttons"

interface LoginFormProps {
  redirectTo?: string
}

export function LoginForm({ redirectTo = "/dashboard" }: LoginFormProps) {
  // Form state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Validation state
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // UI state
  const [isLoading, setIsLoading] = useState(false)

  const router = useRouter()
  const { toast } = useToast()

  // Check for stored credentials on component mount
  useEffect(() => {
    const checkStoredCredentials = () => {
      const storedEmail = localStorage.getItem("kohlawise_email")
      const storedRememberMe = localStorage.getItem("kohlawise_remember_me") === "true"

      if (storedEmail && storedRememberMe) {
        setEmail(storedEmail)
        setRememberMe(true)
      }
    }

    checkStoredCredentials()
  }, [])

  // Validate email on blur
  const handleEmailBlur = () => {
    const { isValid, error } = validateEmail(email)
    setEmailError(isValid ? null : error)
  }

  // Validate password on blur
  const handlePasswordBlur = () => {
    if (!password) {
      setPasswordError("Password is required")
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
    } else {
      setPasswordError(null)
    }
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Reset errors
    setEmailError(null)
    setPasswordError(null)
    setFormError(null)

    // Validate form
    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error)
      return
    }

    if (!password) {
      setPasswordError("Password is required")
      return
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }

    setIsLoading(true)

    try {
      // Store credentials if remember me is checked
      if (rememberMe) {
        localStorage.setItem("kohlawise_email", email)
        localStorage.setItem("kohlawise_remember_me", "true")
      } else {
        localStorage.removeItem("kohlawise_email")
        localStorage.removeItem("kohlawise_remember_me")
      }

      // For demo purposes, simulate successful login
      await new Promise((resolve) => setTimeout(resolve, 1000))

      toast({
        title: "Welcome back!",
        description: "You've been logged in successfully.",
      })

      // Store user session
      localStorage.setItem(
        "kohlawise_user",
        JSON.stringify({
          id: "demo-user",
          email: email,
          firstName: "Demo",
          lastName: "User",
          loginTime: new Date().toISOString(),
        }),
      )

      // Redirect to dashboard or specified redirect URL
      const finalRedirectUrl = redirectTo || "/dashboard"
      router.push(finalRedirectUrl)
      router.refresh()
    } catch (error: any) {
      console.error("Login error:", error)
      setFormError("An unexpected error occurred. Please try again.")

      toast({
        variant: "destructive",
        title: "Login failed",
        description: "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Function to use demo login
  const handleDemoLogin = async () => {
    setIsLoading(true)

    try {
      // Store demo user data for persistence
      localStorage.setItem("kohlawise_demo_user", "true")
      localStorage.setItem(
        "kohlawise_user",
        JSON.stringify({
          id: "demo-user",
          email: "demo@kohlawise.com",
          firstName: "Demo",
          lastName: "User",
          loginTime: new Date().toISOString(),
        }),
      )

      toast({
        title: "Demo mode activated",
        description: "You're now using Kohlawise in demo mode.",
      })

      // Simulate login delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to dashboard
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Demo login error:", error)
      toast({
        variant: "destructive",
        title: "Demo login failed",
        description: "An error occurred during demo login.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle social login errors
  const handleSocialLoginError = (error: string) => {
    toast({
      variant: "destructive",
      title: "Login failed",
      description: error,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="flex items-center justify-between">
            Email
            {emailError && (
              <span className="text-xs font-normal text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {emailError}
              </span>
            )}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className={cn("pl-10", emailError && "border-destructive")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={handleEmailBlur}
              required
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex items-center justify-between">
            Password
            {passwordError && (
              <span className="text-xs font-normal text-destructive flex items-center">
                <AlertCircle className="h-3 w-3 mr-1" /> {passwordError}
              </span>
            )}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className={cn("pl-10", passwordError && "border-destructive")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={handlePasswordBlur}
              required
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="remember"
              className="h-4 w-4 rounded border-gray-300"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={isLoading}
            />
            <Label htmlFor="remember" className="text-sm font-medium leading-none">
              Remember me
            </Label>
          </div>

          <Link href="/reset-password" className="text-sm text-primary hover:underline">
            Forgot password?
          </Link>
        </div>

        {formError && (
          <div className="rounded-md bg-destructive/15 p-3">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-destructive mr-2" />
              <p className="text-sm font-medium text-destructive">{formError}</p>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing in...
            </>
          ) : (
            "Sign in"
          )}
        </Button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <SocialLoginButtons onError={handleSocialLoginError} />

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or</span>
          </div>
        </div>

        <Button type="button" variant="outline" className="w-full" onClick={handleDemoLogin} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Demo...
            </>
          ) : (
            "Continue as Demo User"
          )}
        </Button>
      </form>
    </motion.div>
  )
}

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
