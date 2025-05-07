import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  // Get the site URL from environment variable or use a default
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  // Simply pass through all requests without authentication checks
  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
