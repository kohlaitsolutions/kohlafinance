import { NextResponse } from "next/server"
import { AuthService } from "@/lib/services/auth-service"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    // Rate limiting check (in production, use Redis or similar)
    const headersList = headers()
    const ip = headersList.get("x-forwarded-for") || "unknown"

    const result = await AuthService.signIn(email, password)

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 401 })
    }

    if (result.requiresMfa) {
      return NextResponse.json({
        success: true,
        requiresMfa: true,
        message: "MFA verification required",
      })
    }

    if (result.requiresVerification) {
      return NextResponse.json({
        success: true,
        requiresVerification: true,
        message: "Email verification required",
      })
    }

    return NextResponse.json({
      success: true,
      user: {
        id: result.user?.id,
        email: result.user?.email,
      },
      message: "Login successful",
    })
  } catch (error: any) {
    console.error("Enhanced login error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
