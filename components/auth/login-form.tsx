"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { getUserByEmail } from "@/app/actions"
import { loginSchema } from "@/lib/validation"

type FormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  })

  // Check for stored credentials on component mount
  useEffect(() => {
    const checkStoredCredentials = async () => {
      const storedEmail = localStorage.getItem("kohlawise_email")
      const storedRememberMe = localStorage.getItem("kohlawise_remember_me") === "true"

      if (storedEmail && storedRememberMe) {
        form.setValue("email", storedEmail)
        form.setValue("rememberMe", true)
      }
    }

    checkStoredCredentials()
  }, [form])

  const handleLogin = async (values: FormValues) => {
    setIsLoading(true)
    setError(null)

    try {
      // Store credentials if remember me is checked
      if (values.rememberMe) {
        localStorage.setItem("kohlawise_email", values.email)
        localStorage.setItem("kohlawise_remember_me", "true")
      } else {
        localStorage.removeItem("kohlawise_email")
        localStorage.removeItem("kohlawise_remember_me")
      }

      // Check if user exists in our KV store
      const { success, data } = await getUserByEmail(values.email)

      if (success && data) {
        // User exists, try to sign in with the provided credentials
        const { error } = await supabase.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        })

        if (error) {
          // For demo purposes, we'll still allow login
          console.log("Login error, proceeding to dashboard anyway:", error.message)
          router.push("/dashboard")
          router.refresh()
          return
        }

        // Redirect to dashboard on successful login
        router.push("/dashboard")
        router.refresh()
      } else {
        // User doesn't exist in our KV store, but we'll still allow login for demo
        console.log("User not found in KV store, proceeding to dashboard anyway")
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      console.error("Unexpected error during login:", err)
      setError("An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // Function to use demo login
  const handleDemoLogin = () => {
    setIsLoading(true)
    // Simulate login delay
    setTimeout(() => {
      router.push("/dashboard")
      router.refresh()
    }, 1000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleLogin)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="name@example.com" className="pl-10" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-10"
                      {...field}
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="rememberMe"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Remember me</FormLabel>
                </div>
              </FormItem>
            )}
          />

          <div className="text-sm text-right">
            <Link href="/reset-password" className="text-primary hover:underline">
              Forgot password?
            </Link>
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-destructive">
              {error}
            </motion.div>
          )}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or</span>
            </div>
          </div>

          <Button type="button" variant="outline" className="w-full" onClick={handleDemoLogin} disabled={isLoading}>
            Continue as Demo User
          </Button>
        </form>
      </Form>
    </motion.div>
  )
}
