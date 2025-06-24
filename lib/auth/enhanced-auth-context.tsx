"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { useRedirectService } from "@/lib/services/redirect-service"

type User = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  phone?: string | null
  hasMfa?: boolean
  emailVerified?: boolean
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
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function EnhancedAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [mfaSession, setMfaSession] = useState<any>(null)

  const router = useRouter()
  const { toast } = useToast()
  const redirectService = useRedirectService()
  const supabase = getSupabaseBrowserClient()

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      try {
        setIsLoading(true)

        // Check for existing session
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession()

        if (error) {
          console.error("Session error:", error)
          setUser(null)
          setIsAuthenticated(false)
          return
        }

        if (session?.user) {
          await loadUserProfile(session.user)
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
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id)

      if (event === "SIGNED_IN" && session?.user) {
        await loadUserProfile(session.user)

        // Handle successful authentication redirect
        if (event === "SIGNED_IN") {
          await redirectService.handleAuthSuccess(session.user)
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null)
        setIsAuthenticated(false)
        setMfaSession(null)
      } else if (event === "TOKEN_REFRESHED" && session?.user) {
        await loadUserProfile(session.user)
      }
    })

    initAuth()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, redirectService])

  // Load user profile from database
  const loadUserProfile = async (authUser: any) => {
    try {
      const { data: userData, error } = await supabase
        .from("users")
        .select("first_name, last_name, phone, has_mfa")
        .eq("id", authUser.id)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error loading user profile:", error)
      }

      const fullUser: User = {
        id: authUser.id,
        email: authUser.email!,
        firstName: userData?.first_name || null,
        lastName: userData?.last_name || null,
        phone: userData?.phone || null,
        hasMfa: userData?.has_mfa || false,
        emailVerified: !!authUser.email_confirmed_at,
      }

      setUser(fullUser)
      setIsAuthenticated(true)
    } catch (error) {
      console.error("Error loading user profile:", error)
      setUser(null)
      setIsAuthenticated(false)
    }
  }

  // Login function with enhanced redirection
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Check if email verification is required
      if (!data.user?.email_confirmed_at) {
        redirectService.storeRedirectUrl("/dashboard")
        router.push("/auth/verify")
        return { success: false, error: "Please verify your email before signing in" }
      }

      // Check if MFA is required
      if (!data.session && data.user?.factors && data.user.factors.length > 0) {
        setMfaSession(data.user)
        return { success: true, requiresMfa: true }
      }

      // Successful login - the auth state change will handle redirection
      await loadUserProfile(data.user)

      return { success: true }
    } catch (error: any) {
      console.error("Login error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  // Register function with enhanced redirection
  const register = async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      setIsLoading(true)

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

      // Handle registration success
      const requiresVerification = !data.session
      await redirectService.handleRegistrationSuccess(data.user, requiresVerification)

      return { success: true }
    } catch (error: any) {
      console.error("Registration error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  // Logout function
  const logout = async () => {
    try {
      setIsLoading(true)

      const { error } = await supabase.auth.signOut()

      if (error) {
        console.error("Logout error:", error)
        toast({
          variant: "destructive",
          title: "Logout failed",
          description: "An error occurred while logging out. Please try again.",
        })
        return
      }

      // Clear all auth-related data
      setUser(null)
      setIsAuthenticated(false)
      setMfaSession(null)

      // Clear storage
      localStorage.removeItem("kohlawise_demo_user")
      sessionStorage.clear()

      toast({
        title: "Logged out successfully",
        description: "You have been securely logged out.",
      })

      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Verify MFA code
  const verifyMfa = async (code: string) => {
    try {
      if (!mfaSession) {
        return { success: false, error: "MFA session expired. Please log in again." }
      }

      const { data, error } = await supabase.auth.verifyOtp({
        factorId: mfaSession.factors[0].id,
        code,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Load user profile and handle redirect
      await loadUserProfile(data.user)
      setMfaSession(null)

      // The auth state change will handle redirection
      return { success: true }
    } catch (error: any) {
      console.error("MFA verification error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser()
    if (authUser) {
      await loadUserProfile(authUser)
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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useEnhancedAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useEnhancedAuth must be used within an EnhancedAuthProvider")
  }
  return context
}
