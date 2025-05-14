"use client"

import { useState, type FormEvent } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail, User, AlertCircle, Loader2, CheckCircle2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { validateEmail, validateName, validatePassword } from "@/lib/form-validation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { PasswordStrengthMeter, calculatePasswordStrength } from "./password-strength-meter"
import { SocialLoginButtons } from "./social-login-buttons"

export function RegisterForm() {
  // Form state
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // Validation state
  const [firstNameError, setFirstNameError] = useState<string | null>(null)
  const [lastNameError, setLastNameError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  // UI state
  const [isLoading, setIsLoading] = useState(false)
  const [isVerificationSent, setIsVerificationSent] = useState(false)

  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  // Validate first name on blur
  const handleFirstNameBlur = () => {
    const { isValid, error } = validateName(firstName, "First name")
    setFirstNameError(isValid ? null : error)
  }

  // Validate last name on blur
  const handleLastNameBlur = () => {
    const { isValid, error } = validateName(lastName, "Last name")
    setLastNameError(isValid ? null : error)
  }

  // Validate email on blur
  const handleEmailBlur = () => {
    const { isValid, error } = validateEmail(email)
    setEmailError(isValid ? null : error)
  }

  // Validate password on blur
  const handlePasswordBlur = () => {
    const { isValid, errors } = validatePassword(password)
    setPasswordError(isValid ? null : errors[0])
  }

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    // Reset errors
    setFirstNameError(null)
    setLastNameError(null)
    setEmailError(null)
    setPasswordError(null)
    setFormError(null)

    // Validate form
    const firstNameValidation = validateName(firstName, "First name")
    if (!firstNameValidation.isValid) {
      setFirstNameError(firstNameValidation.error)
      return
    }

    const lastNameValidation = validateName(lastName, "Last name")
    if (!lastNameValidation.isValid) {
      setLastNameError(lastNameValidation.error)
      return
    }

    const emailValidation = validateEmail(email)
    if (!emailValidation.isValid) {
      setEmailError(emailValidation.error)
      return
    }

    const passwordValidation = validatePassword(password)
    if (!passwordValidation.isValid) {
      setPasswordError(passwordValidation.errors[0])
      return
    }

    setIsLoading(true)

    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      })

      if (error) {
        throw error
      }

      // Check if email confirmation is required
      if (data?.user?.identities?.length === 0) {
        setIsVerificationSent(true)
        toast({
          title: "Account already exists",
          description: "Please check your email for a verification link.",
        })
        return
      }

      // Store email for login convenience
      localStorage.setItem("kohlawise_email", email)

      setIsVerificationSent(true)
      toast({
        title: "Registration successful!",
        description: "Please check your email for a verification link.",
      })

      // For demo purposes, redirect to dashboard
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 3000)
    } catch (error: any) {
      console.error("Registration error:", error)
      setFormError(error.message || "An unexpected error occurred. Please try again.")

      toast({
        variant: "destructive",
        title: "Registration failed",
        description: error.message || "An unexpected error occurred. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Handle social login errors
  const handleSocialLoginError = (error: string) => {
    toast({
      variant: "destructive",
      title: "Registration failed",
      description: error,
    })
  }

  // If verification email is sent, show success message
  if (isVerificationSent) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="rounded-full bg-primary/10 p-3">
              <CheckCircle2 className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Verification Email Sent</h3>
              <p className="text-muted-foreground">
                We've sent a verification link to <span className="font-medium text-foreground">{email}</span>. Please
                check your email and click the link to verify your account.
              </p>
            </div>
            <div className="text-sm text-muted-foreground">
              <p>Didn't receive an email? Check your spam folder or</p>
              <Button variant="link" className="p-0 h-auto" onClick={handleSubmit} disabled={isLoading}>
                click here to resend
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="flex items-center justify-between">
              First Name
              {firstNameError && (
                <span className="text-xs font-normal text-destructive flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {firstNameError}
                </span>
              )}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="firstName"
                placeholder="John"
                className={cn("pl-10", firstNameError && "border-destructive")}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                onBlur={handleFirstNameBlur}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName" className="flex items-center justify-between">
              Last Name
              {lastNameError && (
                <span className="text-xs font-normal text-destructive flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" /> {lastNameError}
                </span>
              )}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="lastName"
                placeholder="Doe"
                className={cn("pl-10", lastNameError && "border-destructive")}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                onBlur={handleLastNameBlur}
                required
              />
            </div>
          </div>
        </div>

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
              minLength={8}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>

          {/* Password Strength Meter */}
          <PasswordStrengthMeter password={password} className="mt-2" />
        </div>

        {formError && (
          <div className="rounded-md bg-destructive/15 p-3">
            <div className="flex items-center">
              <AlertCircle className="h-4 w-4 text-destructive mr-2" />
              <p className="text-sm font-medium text-destructive">{formError}</p>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" disabled={isLoading || calculatePasswordStrength(password) < 3}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating account...
            </>
          ) : (
            "Create account"
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
      </form>
    </motion.div>
  )
}

// Helper function to conditionally join class names
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(" ")
}
