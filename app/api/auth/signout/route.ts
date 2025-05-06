import { NextResponse } from "next/server"

import { getSupabaseServerClient } from "@/lib/supabase/server"

export async function GET() {
  const supabase = getSupabaseServerClient()

  await supabase.auth.signOut()

  return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"))
}
