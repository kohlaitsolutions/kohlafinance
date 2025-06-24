"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface AuthResult {
  success: boolean
  error?: string
  requiresMfa?: boolean
  requiresVerification?: boolean
  user?: any
  session?: any
}

export class AuthService {
  private static async getSupabase() {
    return getSupabaseServerClient()
  }

  static async signIn(email: string, password: string): Promise<AuthResult> {
    try {
      const supabase = await this.getSupabase()

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Check email verification
      if (!data.user?.email_confirmed_at) {
        return {
          success: false,
          error: "Please verify your email before signing in",
          requiresVerification: true,
        }
      }

      // Check MFA requirement
      if (data.session === null && data.user?.factors && data.user.factors.length > 0) {
        return {
          success: true,
          requiresMfa: true,
          user: data.user,
        }
      }

      // Get user profile
      const { data: profile } = await supabase.from("users").select("*").eq("id", data.user.id).single()

      // Log successful login
      await this.logSecurityEvent(data.user.id, "LOGIN_SUCCESS", {
        ip: await this.getClientIP(),
        userAgent: await this.getUserAgent(),
      })

      return {
        success: true,
        user: data.user,
        session: data.session,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Authentication failed",
      }
    }
  }

  static async signUp(userData: {
    email: string
    password: string
    firstName: string
    lastName: string
  }): Promise<AuthResult> {
    try {
      const supabase = await this.getSupabase()

      // Check if user already exists
      const { data: existingUser } = await supabase.from("users").select("id").eq("email", userData.email).single()

      if (existingUser) {
        return {
          success: false,
          error: "An account with this email already exists",
        }
      }

      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.firstName,
            last_name: userData.lastName,
          },
          emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify`,
        },
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Create user profile
      if (data.user) {
        const { error: profileError } = await supabase.from("users").insert({
          id: data.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          has_mfa: false,
          account_status: "pending_verification",
          security_level: "basic",
        })

        if (profileError) {
          console.error("Error creating user profile:", profileError)
        }

        // Log registration
        await this.logSecurityEvent(data.user.id, "REGISTRATION", {
          ip: await this.getClientIP(),
          userAgent: await this.getUserAgent(),
        })
      }

      return {
        success: true,
        requiresVerification: !data.session,
        user: data.user,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Registration failed",
      }
    }
  }

  static async verifyEmail(token: string): Promise<AuthResult> {
    try {
      const supabase = await this.getSupabase()

      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Update user status
      if (data.user) {
        await supabase
          .from("users")
          .update({
            account_status: "active",
            email_verified_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("id", data.user.id)

        await this.logSecurityEvent(data.user.id, "EMAIL_VERIFIED", {
          ip: await this.getClientIP(),
        })
      }

      return { success: true, user: data.user, session: data.session }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Email verification failed",
      }
    }
  }

  static async signOut(): Promise<AuthResult> {
    try {
      const supabase = await this.getSupabase()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const { error } = await supabase.auth.signOut()

      if (error) {
        return { success: false, error: error.message }
      }

      if (user) {
        await this.logSecurityEvent(user.id, "LOGOUT", {
          ip: await this.getClientIP(),
        })
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Sign out failed",
      }
    }
  }

  private static async logSecurityEvent(userId: string, eventType: string, metadata: Record<string, any> = {}) {
    try {
      const supabase = await this.getSupabase()
      await supabase.from("security_logs").insert({
        user_id: userId,
        event_type: eventType,
        metadata,
        created_at: new Date().toISOString(),
      })
    } catch (error) {
      console.error("Failed to log security event:", error)
    }
  }

  private static async getClientIP(): Promise<string> {
    // In a real implementation, you'd extract this from headers
    return "127.0.0.1"
  }

  private static async getUserAgent(): Promise<string> {
    // In a real implementation, you'd extract this from headers
    return "Unknown"
  }
}
