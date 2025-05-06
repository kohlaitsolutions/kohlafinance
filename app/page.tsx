"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { confirmEmail } from "@/app/actions"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [status, setStatus] = useState("Initializing...")
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function autoAuthenticate() {
      try {
        setStatus("Checking session...")
        // Check if user is already authenticated
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session) {
          // User is already authenticated, redirect to dashboard
          setStatus("Already authenticated, redirecting...")
          router.push("/dashboard")
          return
        }

        // Auto sign-in with default credentials
        setStatus("Attempting to sign in...")
        const { data, error } = await supabase.auth.signInWithPassword({
          email: "suubiphillip21@gmail.com",
          password: "tinkler0703",
        })

        if (error) {
          console.error("Auto-authentication error:", error)

          if (error.message.includes("Email not confirmed")) {
            setStatus("Email not confirmed, attempting to confirm...")

            // Try to sign up again to get the user ID
            const { data: signUpData } = await supabase.auth.signUp({
              email: "suubiphillip21@gmail.com",
              password: "tinkler0703",
              options: {
                data: {
                  first_name: "Demo",
                  last_name: "User",
                },
              },
            })

            if (signUpData?.user) {
              // Use server action to confirm email
              setStatus("Confirming email...")
              await confirmEmail(signUpData.user.id)

              // Try signing in again after confirmation
              setStatus("Signing in after confirmation...")
              const { error: signInError } = await supabase.auth.signInWithPassword({
                email: "suubiphillip21@gmail.com",
                password: "tinkler0703",
              })

              if (signInError) {
                console.error("Sign-in after confirmation error:", signInError)
                setStatus("Authentication failed. Please try again.")
                return
              }
            }
          } else if (error.message.includes("Invalid login credentials")) {
            // If credentials are invalid, try to sign up
            setStatus("Creating new account...")
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
              email: "suubiphillip21@gmail.com",
              password: "tinkler0703",
              options: {
                data: {
                  first_name: "Demo",
                  last_name: "User",
                },
              },
            })

            if (signUpError) {
              console.error("Auto-signup error:", signUpError)
              setStatus("Account creation failed. Please try again.")
              return
            }

            if (signUpData?.user) {
              // Confirm email for the new user
              setStatus("Confirming email for new account...")
              await confirmEmail(signUpData.user.id)

              // Sign in with the new account
              setStatus("Signing in with new account...")
              const { error: newSignInError } = await supabase.auth.signInWithPassword({
                email: "suubiphillip21@gmail.com",
                password: "tinkler0703",
              })

              if (newSignInError) {
                console.error("Sign-in with new account error:", newSignInError)
                setStatus("Authentication failed. Please try again.")
                return
              }
            }
          } else {
            setStatus("Authentication failed: " + error.message)
            return
          }
        }

        // Redirect to dashboard
        setStatus("Authentication successful, redirecting...")
        router.push("/dashboard")
      } catch (error) {
        console.error("Authentication error:", error)
        setStatus("An unexpected error occurred.")
      } finally {
        setIsLoading(false)
      }
    }

    autoAuthenticate()
  }, [router, supabase])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 parallax-bg">
      {isLoading ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg text-muted-foreground">{status}</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          <motion.div
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            transition={{
              duration: 1,
              ease: "easeOut",
              repeat: Number.POSITIVE_INFINITY,
              repeatType: "reverse",
              repeatDelay: 0.5,
            }}
            className="mb-8 text-6xl font-bold text-primary animate-float"
          >
            Kohlawise
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl text-muted-foreground"
          >
            Your modern financial companion
          </motion.p>
        </motion.div>
      )}
    </div>
  )
}
