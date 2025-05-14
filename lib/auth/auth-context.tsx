"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type User = {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: { firstName: string; lastName: string; email: string; password: string }) => Promise<{
    success: boolean
    error?: string
  }>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    // Check for user in localStorage (for demo/development)
    const storedUser = localStorage.getItem("kohlawise_user")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setIsLoading(true)

      if (session?.user) {
        // Get user profile data
        const { data: userData } = await supabase
          .from("users")
          .select("first_name, last_name")
          .eq("id", session.user.id)
          .single()

        const fullUser = {
          id: session.user.id,
          email: session.user.email!,
          firstName: userData?.first_name || null,
          lastName: userData?.last_name || null,
        }

        setUser(fullUser)
        localStorage.setItem("kohlawise_user", JSON.stringify(fullUser))
      } else {
        setUser(null)
        localStorage.removeItem("kohlawise_user")
      }

      setIsLoading(false)
    })

    // Initial session check
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setIsLoading(false)
      }
    }

    checkSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase, router])

  const login = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || "Login failed" }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  const register = async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const data = await response.json()

      if (!response.ok) {
        return { success: false, error: data.error || "Registration failed" }
      }

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message || "An unexpected error occurred" }
    }
  }

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    router.push("/login")
    router.refresh()
  }

  return <AuthContext.Provider value={{ user, isLoading, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
