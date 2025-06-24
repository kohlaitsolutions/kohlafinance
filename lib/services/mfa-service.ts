"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export interface MfaResult {
  success: boolean
  error?: string
  qrCode?: string
  backupCodes?: string[]
  factorId?: string
}

export class MfaService {
  private static async getSupabase() {
    return getSupabaseServerClient()
  }

  static async enrollTotp(userId: string): Promise<MfaResult> {
    try {
      const supabase = await this.getSupabase()

      // Check if user already has MFA enabled
      const { data: existingFactors } = await supabase.auth.mfa.listFactors()

      if (existingFactors?.totp && existingFactors.totp.length > 0) {
        return {
          success: false,
          error: "MFA is already enabled for this account",
        }
      }

      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: "totp",
        friendlyName: "Kohlawise Authenticator",
      })

      if (error) {
        return { success: false, error: error.message }
      }

      // Generate backup codes
      const backupCodes = this.generateBackupCodes()

      // Store backup codes securely
      await supabase.from("user_backup_codes").insert({
        user_id: userId,
        codes: backupCodes,
        created_at: new Date().toISOString(),
      })

      // Update user profile
      await supabase
        .from("users")
        .update({
          has_mfa: true,
          security_level: "enhanced",
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId)

      // Log MFA enrollment
      await this.logSecurityEvent(userId, "MFA_ENROLLED", {
        factor_type: "totp",
      })

      return {
        success: true,
        qrCode: data.totp.qr_code,
        backupCodes,
        factorId: data.id,
      }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "MFA enrollment failed",
      }
    }
  }

  static async verifyTotp(factorId: string, code: string): Promise<MfaResult> {
    try {
      const supabase = await this.getSupabase()

      const { data, error } = await supabase.auth.mfa.verify({
        factorId,
        challengeId: factorId,
        code,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await this.logSecurityEvent(user.id, "MFA_VERIFIED", {
          factor_type: "totp",
        })
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "MFA verification failed",
      }
    }
  }

  static async challengeTotp(factorId: string): Promise<MfaResult> {
    try {
      const supabase = await this.getSupabase()

      const { data, error } = await supabase.auth.mfa.challenge({
        factorId,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      return { success: true, factorId: data.id }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "MFA challenge failed",
      }
    }
  }

  static async unenrollMfa(factorId: string): Promise<MfaResult> {
    try {
      const supabase = await this.getSupabase()

      const { error } = await supabase.auth.mfa.unenroll({
        factorId,
      })

      if (error) {
        return { success: false, error: error.message }
      }

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        // Update user profile
        await supabase
          .from("users")
          .update({
            has_mfa: false,
            security_level: "basic",
            updated_at: new Date().toISOString(),
          })
          .eq("id", user.id)

        // Remove backup codes
        await supabase.from("user_backup_codes").delete().eq("user_id", user.id)

        await this.logSecurityEvent(user.id, "MFA_UNENROLLED", {
          factor_id: factorId,
        })
      }

      return { success: true }
    } catch (error: any) {
      return {
        success: false,
        error: error.message || "MFA unenrollment failed",
      }
    }
  }

  private static generateBackupCodes(): string[] {
    const codes: string[] = []
    for (let i = 0; i < 10; i++) {
      const code = Math.random().toString(36).substring(2, 10).toUpperCase()
      codes.push(code)
    }
    return codes
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
