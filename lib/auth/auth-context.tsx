"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"

type User = {
  id: string
  email: string
  firstName: string
  lastName: string
  loginTime: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (userData: {
    firstName: string
    lastName: string
    email: string
    password: string
  }) => Promise<{ success: boolean; error?: string }>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const router = useRouter()

  // Initialize auth state
  useEffect(() => {
    const initAuth = () => {
      try {
        setIsLoading(true)

        // Check for existing user session
        const storedUser = localStorage.getItem("kohlawise_user")
        const isDemoUser = localStorage.getItem("kohlawise_demo_user")

        if (storedUser) {
          const userData = JSON.parse(storedUser)
          setUser(userData)
          setIsAuthenticated(true)
        } else if (isDemoUser) {
          const demoUser: User = {
            id: "demo-user",
            email: "demo@kohlawise.com",
            firstName: "Demo",
            lastName: "User",
            loginTime: new Date().toISOString(),
          }
          setUser(demoUser)
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

    initAuth()
  }, [])

  // Login function
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // For demo purposes, accept any email/password combination
      const userData: User = {
        id: `user-${Date.now()}`,
        email: email,
        firstName: email.split("@")[0] || "User",
        lastName: "Demo",
        loginTime: new Date().toISOString(),
      }

      setUser(userData)
      setIsAuthenticated(true)

      // Store user data
      localStorage.setItem("kohlawise_user", JSON.stringify(userData))

      // Get redirect URL from localStorage or default to dashboard
      const redirectUrl = localStorage.getItem("kohlawise_redirect_url") || "/dashboard"
      localStorage.removeItem("kohlawise_redirect_url")

      // Redirect to dashboard or intended page
      setTimeout(() => {
        router.push(redirectUrl)
        router.refresh()
      }, 100)

      return { success: true }
    } catch (error: any) {
      console.error("Login error:", error)
      return { success: false, error: error.message || "An unexpected error occurred" }
    } finally {
      setIsLoading(false)
    }
  }

  // Register function
  const register = async (userData: { firstName: string; lastName: string; email: string; password: string }) => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, create user account
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        loginTime: new Date().toISOString(),
      }

      setUser(newUser)
      setIsAuthenticated(true)

      // Store user data
      localStorage.setItem("kohlawise_user", JSON.stringify(newUser))

      // Redirect to dashboard after successful registration
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 100)

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

      // Clear all auth-related data
      setUser(null)
      setIsAuthenticated(false)

      // Clear storage
      localStorage.removeItem("kohlawise_user")
      localStorage.removeItem("kohlawise_demo_user")
      localStorage.removeItem("kohlawise_email")
      localStorage.removeItem("kohlawise_remember_me")
      localStorage.removeItem("kohlawise_redirect_url")
      sessionStorage.clear()

      router.push("/login")
      router.refresh()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh user data
  const refreshUser = async () => {
    const storedUser = localStorage.getItem("kohlawise_user")
    if (storedUser) {
      const userData = JSON.parse(storedUser)
      setUser(userData)
      setIsAuthenticated(true)
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
        refreshUser,
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
