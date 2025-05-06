import type React from "react"

import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = getSupabaseServerClient()

  // Get a default user ID for demo purposes
  const demoUserId = "00000000-0000-0000-0000-000000000000" // This is a placeholder UUID

  // Try to get the session, but don't redirect if it fails
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Use the session user ID if available, otherwise use the demo ID
  const userId = session?.user?.id || demoUserId

  // Get notifications with proper error handling
  let notifications = []
  try {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    if (!error && data) {
      notifications = data
    }
  } catch (err) {
    console.error("Error fetching notifications:", err)
    // Continue with empty notifications
  }

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1">
        <Sidebar />
        <div className="flex flex-1 flex-col">
          <Header notifications={notifications} />
          <main className="flex-1 p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
