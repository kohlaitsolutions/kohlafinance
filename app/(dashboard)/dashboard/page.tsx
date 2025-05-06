import { redirect } from "next/navigation"

import { AccountCard } from "@/components/dashboard/account-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Get user accounts
  const { data: accounts } = await supabase
    .from("accounts")
    .select("*")
    .eq("user_id", session.user.id)
    .order("is_primary", { ascending: false })

  // Get recent transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .in("account_id", accounts?.map((account) => account.id) || [])
    .order("created_at", { ascending: false })
    .limit(5)

  // Get user data
  const { data: userData } = await supabase.from("users").select("*").eq("id", session.user.id).single()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {userData?.first_name || "User"}</h1>
        <p className="text-muted-foreground">Here's an overview of your finances</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts?.map((account) => (
          <AccountCard key={account.id} account={account} />
        ))}
      </div>

      <QuickActions />

      <TransactionList transactions={transactions || []} />
    </div>
  )
}
