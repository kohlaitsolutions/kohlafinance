import { NextResponse } from "next/server"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const supabase = getSupabaseServerClient()

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Redirect to the dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  // If no code is present, redirect to the login page
  return NextResponse.redirect(new URL("/login", request.url))
}
