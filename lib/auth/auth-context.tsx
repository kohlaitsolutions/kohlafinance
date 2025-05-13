"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"

type User = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone?: string | null
  hasMfa?: boolean
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; requiresMfa?: boolean; error?: string }>
  register: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  verifyMfa: (code: string) => Promise<{ success: boolean; error?: string }>
  setupMfa: () => Promise<{ success: boolean; setupUrl?: string; error?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mfaToken, setMfaToken] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()
  const supabase = getSupabaseBrowserClient()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true)

      try {
        // Check for existing session
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user) {
          // Get user profile data
          const { data: userData } = await supabase
            .from("users")
            .select("first_name, last_name, phone, has_mfa")
            .eq("id", session.user.id)
            .single()

          const fullUser = {
            id: session.user.id,
            email: session.user.email!,
            firstName: userData?.first_name || null,
            lastName: userData?.last_name || null,
            phone: userData?.phone || null,
            hasMfa: userData?.has_mfa || false,
          }

          setUser(fullUser)
          setIsAuthenticated(true)
        } else {
          setUser(null)
          setIsAuthenticated(false)
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
        setUser(null)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
        if (session?.user) {
          // Get user profile data
          const { data: userData } = await supabase
            .from("users")
            .select("first_name, last_name, phone, has_mfa")
            .eq("id", session.user.id)
            .single()

          const fullUser = {
            id: session.user.id,
            email: session.user.email!,
            firstName: userData?.first_name || null,
            lastName: userData?.last_name || null,
            phone: userData?.phone || null,
            hasMfa: userData?.has_mfa || false,
          }

          setUser(fullUser)
          setIsAuthenticated(true)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setIsAuthenticated(false)
      }
    })

    initAuth()

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Check if MFA is required
      if (data.session === null && data.user) {
        // Store MFA token for verification
        if (data.user.factors && data.user.factors.length > 0) {
          setMfaToken(data.user.factors[0].id)
          return { success: true, requiresMfa: true }
        }
      }

      // Get user profile data
      const { data: userData } = await supabase
        .from("users")
        .select("first_name, last_name, phone, has_mfa")
        .eq("id", data.user.id)
        .single()

      // Update user state
      setUser({
        id: data.user.id,
        email: data.user.email!,
        firstName: userData?.first_name || null,
        lastName: userData?.last_name || null,
        phone: userData?.phone || null,
        hasMfa: userData?.has_mfa || false,
      })
      setIsAuthenticated(true)

      // Redirect to dashboard
      router.push("/dashboard")
      router.refresh()

      return { success: true }
    } catch (error: any) {
      console.error("Login error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  // Register function
  const register = async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Create user profile in database
      if (data.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          has_mfa: false,
        })

        if (profileError) {
          console.error("Error creating user profile:", profileError)
        }
      }

      return { success: true }
    } catch (error: any) {
      console.error("Registration error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setIsAuthenticated(false)
      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
      toast({
        variant: "destructive",
        title: "Logout failed",
        description: "An error occurred while logging out. Please try again.",
      })
    }
  }

  // Verify MFA code
  const verifyMfa = async (code: string) => {
    try {
      if (!mfaToken) {
        return { success: false, error: "MFA session expired. Please log in again." }
      }

      const { data, error } = await supabase.auth.verifyOtp({
        factorId: mfaToken,
        code,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Get user profile data
      const { data: userData } = await supabase
        .from("users")
        .select("first_name, last_name, phone, has_mfa")
        .eq("id", data.user.id)
        .single()

      // Update user state
      setUser({
        id: data.user.id,
        email: data.user.email!,
        firstName: userData?.first_name || null,
        lastName: userData?.last_name || null,
        phone: userData?.phone || null,
        hasMfa: userData?.has_mfa || false,
      })
      setIsAuthenticated(true)
      setMfaToken(null)

      // Redirect to dashboard
      router.push("/dashboard")
      router.refresh()

      return { success: true }
    } catch (error: any) {
      console.error("MFA verification error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  // Setup MFA
  const setupMfa = async () => {
    try {
      if (!user) {
        return { success: false, error: "You must be logged in to set up MFA" }
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Update user profile
      await supabase.from("users").update({ has_mfa: true }).eq("id", user.id)

      return { success: true, setupUrl: data.totp.qr_code }
    } catch (error: any) {
      console.error("MFA setup error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        verifyMfa,
        setupMfa,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
