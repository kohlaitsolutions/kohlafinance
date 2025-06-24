"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { generateAccountNumber } from "@/lib/utils"

export interface UserCreationResult {
  success: boolean
  error?: string
  user?: any
  account?: any
}

export interface CreateUserData {
  email: string
  firstName: string
  lastName: string
  phone?: string
  role?: "user" | "admin" | "manager"
  initialDeposit?: number
  accountType?: "checking" | "savings" | "business"
}

export class UserManagementService {
  private static async getSupabase() {
    return getSupabaseServerClient()
  }

  static async createUser(userData: CreateUserData, createdBy: string): Promise<UserCreationResult> {
    try {
      const supabase = await this.getSupabase()

      // Validate permissions
      const { data: creator } = await supabase.from("users").select("role, account_status").eq("id", createdBy).single()

      if (!creator || !["admin", "manager"].includes(creator.role)) {
        return {
          success: false,
          error: "Insufficient permissions to create users",
        }
      }

      // Check if user already exists
      const { data: existingUser } = await supabase.from("users").select("id").eq("email", userData.email).single()

      if (existingUser) {
        return {
          success: false,
          error: "User with this email already exists",
        }
      }

      // Generate temporary password
      const tempPassword = this.generateTemporaryPassword()

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email: userData.email,
        password: tempPassword,
        email_confirm: true,
        user_metadata: {
          first_name: userData.firstName,
          last_name: userData.lastName,
          created_by: createdBy,
        },
      })

      if (authError) {
        return { success: false, error: authError.message }
      }

      // Create user profile
      const { data: userProfile, error: profileError } = await supabase
        .from("users")
        .insert({
          id: authData.user.id,
          email: userData.email,
          first_name: userData.firstName,
          last_name: userData.lastName,
          phone: userData.phone,
          role: userData.role || "user",
          account_status: "active",
          security_level: "basic",
          has_mfa: false,
          created_by: createdBy,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single()

      if (profileError) {
        // Cleanup auth user if profile creation fails
        await supabase.auth.admin.deleteUser(authData.user.id)
        return { success: false, error: profileError.message }
      }

      // Create default account if specified
      let accountData = null
      if (userData.accountType && userData.initialDeposit !== undefined) {
        const accountNumber = generateAccountNumber()

        const { data: account, error: accountError } = await supabase
          .from("accounts")
          .insert({
            user_id: authData.user.id,
            account_name: `${userData.firstName}'s ${userData.accountType} Account`,
            account_type: userData.accountType,
            account_number: accountNumber,
            balance: userData.initialDeposit,
            currency: "USD",
            is_primary: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single()

        if (accountError) {
          console.error("Failed to create account:", accountError)
        } else {
          accountData = account
        }
      }

      // Send welcome email with temporary password
      await this.sendWelcomeEmail(userData.email, userData.firstName, tempPassword)

      // Log user creation
      await this.logSecurityEvent(createdBy, "USER_CREATED", {
        created_user_id: authData.user.id,
        user_email: userData.email,
        user_role: userData.role || "user",
      })

      return {
        success: true,
        user: userProfile,
        account: accountData,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "User creation failed",
      }
    }
  }

  static async updateUserStatus(
    userId: string,
    status: "active" | "suspended" | "pending_verification",
    updatedBy: string,
  ): Promise<UserCreationResult> {
    try {
      const supabase = await this.getSupabase()

      // Validate permissions
      const { data: updater } = await supabase.from("users").select("role").eq("id", updatedBy).single()

      if (!updater || !["admin", "manager"].includes(updater.role)) {
        return {
          success: false,
          error: "Insufficient permissions to update user status",
        }
      }

      const { data, error } = await supabase
        .from("users")
        .update({
          account_status: status,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)
        .select()
        .single()

      if (error) {
        return { success: false, error: error.message }
      }

      // Log status change
      await this.logSecurityEvent(updatedBy, "USER_STATUS_CHANGED", {
        target_user_id: userId,
        new_status: status,
      })

      return { success: true, user: data }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "Status update failed",
      }
    }
  }

  static async deleteUser(userId: string, deletedBy: string): Promise<UserCreationResult> {
    try {
      const supabase = await this.getSupabase()

      // Validate permissions
      const { data: deleter } = await supabase.from("users").select("role").eq("id", deletedBy).single()

      if (!deleter || deleter.role !== "admin") {
        return {
          success: false,
          error: "Only administrators can delete users",
        }
      }

      // Soft delete user (mark as deleted instead of actual deletion for compliance)
      const { error } = await supabase
        .from("users")
        .update({
          account_status: "deleted",
          deleted_at: new Date().toISOString(),
          deleted_by: deletedBy,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      if (error) {
        return { success: false, error: error.message }
      }

      // Disable auth user
      await supabase.auth.admin.updateUserById(userId, {
        ban_duration: "876000h", // 100 years
      })

      // Log deletion
      await this.logSecurityEvent(deletedBy, "USER_DELETED", {
        deleted_user_id: userId,
      })

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "User deletion failed",
      }
    }
  }

  private static generateTemporaryPassword(): string {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let password = ""
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return password
  }

  private static async sendWelcomeEmail(email: string, firstName: string, tempPassword: string) {
    // In a real implementation, you'd integrate with an email service
    console.log(`Welcome email sent to ${email} with temporary password: ${tempPassword}`)
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
}
