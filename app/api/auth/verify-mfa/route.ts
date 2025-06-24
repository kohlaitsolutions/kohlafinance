import { NextResponse } from "next/server"
import { MfaService } from "@/lib/services/mfa-service"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const { email, code } = await request.json()

    if (!email || !code) {
      return NextResponse.json({ error: "Email and verification code are required" }, { status: 400 })
    }

    const supabase = getSupabaseServerClient()

    // Get user's MFA factors
    const { data: factors } = await supabase.auth.mfa.listFactors()

    if (!factors?.totp || factors.totp.length === 0) {
      return NextResponse.json({ error: "MFA not configured for this account" }, { status: 400 })
    }

    const factorId = factors.totp[0].id

    // Verify the MFA code
    const result = await MfaService.verifyTotp(factorId, code)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    return NextResponse.json({
      success: true,
      message: "MFA verification successful",
    })
  } catch (error: any) {
    console.error("MFA verification error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
