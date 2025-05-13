import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerClient } from "@supabase/ssr"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Create a Supabase client
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: "",
            ...options,
          })
          res.cookies.set({
            name,
            value: "",
            ...options,
          })
        },
      },
    },
  )

  // Get the session
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check auth condition
  const authPaths = [
    "/dashboard",
    "/account",
    "/settings",
    "/payments",
    "/invest",
    "/analytics",
    "/insights",
    "/transactions",
  ]
  const isAuthPath = authPaths.some((path) => req.nextUrl.pathname.startsWith(path))

  // If accessing protected route without session, redirect to login
  if (isAuthPath && !session) {
    const redirectUrl = new URL("/login", req.url)
    redirectUrl.searchParams.set("redirect", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing login/register with session, redirect to dashboard
  if ((req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/register") && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url))
  }

  // Check if MFA is required
  if (session?.user?.factors && session.user.factors.length > 0 && req.nextUrl.pathname !== "/mfa") {
    return NextResponse.redirect(new URL("/mfa", req.url))
  }

  return res
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
}
