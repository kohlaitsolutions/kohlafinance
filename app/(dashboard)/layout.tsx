import type React from "react"
import { FinancialAssistant } from "@/components/ai/financial-assistant"
import { BottomTabs } from "@/components/layout/bottom-tabs"
import { Header } from "@/components/layout/header"
import { Sidebar } from "@/components/layout/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Demo notifications for all users
  const notifications = [
    {
      id: "demo-notif-1",
      user_id: "demo-user",
      title: "Welcome to Kohlawise!",
      message: "Your financial management journey starts here.",
      is_read: false,
      created_at: new Date().toISOString(),
    },
    {
      id: "demo-notif-2",
      user_id: "demo-user",
      title: "Transaction Alert",
      message: "Your recent payment of $125.50 was successful.",
      is_read: false,
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header notifications={notifications} isAuthenticated={true} />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>
      <BottomTabs />
      <FinancialAssistant />
    </div>
  )
}
