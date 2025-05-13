import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = getSupabaseServerClient()

    // Sign out the user
    await supabase.auth.signOut()

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    })
  } catch (error: any) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
