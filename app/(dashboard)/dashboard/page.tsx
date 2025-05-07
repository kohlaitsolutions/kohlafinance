import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AccountCard } from "@/components/dashboard/account-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { TransactionList } from "@/components/dashboard/transaction-list"

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient()

  // Try to get the session, but don't redirect if it fails
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Use demo data if no session is available
  let accounts = []
  let transactions = []
  let userData = { first_name: "Default", last_name: "User" }

  if (session?.user?.id) {
    // If we have a session, try to get real data
    try {
      const { data: userAccounts, error: accountsError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("is_primary", { ascending: false })

      if (!accountsError && userAccounts) {
        accounts = userAccounts

        if (accounts.length > 0) {
          const { data: userTransactions, error: transactionsError } = await supabase
            .from("transactions")
            .select("*")
            .in(
              "account_id",
              accounts.map((account) => account.id),
            )
            .order("created_at", { ascending: false })
            .limit(5)

          if (!transactionsError && userTransactions) {
            transactions = userTransactions
          }
        }
      }

      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (!userError && user) {
        userData = user
      }
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      // Continue with demo data
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {userData?.first_name || "User"}</h1>
        <p className="text-muted-foreground">Here's an overview of your finances</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.length > 0 ? (
          accounts.map((account) => <AccountCard key={account.id} account={account} />)
        ) : (
          // Demo accounts if no real accounts exist
          <>
            <AccountCard
              account={{
                id: "demo-1",
                user_id: "demo",
                account_number: "1234567890",
                account_name: "Demo Checking",
                balance: 5280.42,
                account_type: "checking",
                currency: "USD",
                is_primary: true,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }}
            />
            <AccountCard
              account={{
                id: "demo-2",
                user_id: "demo",
                account_number: "0987654321",
                account_name: "Demo Savings",
                balance: 12750.89,
                account_type: "savings",
                currency: "USD",
                is_primary: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
              }}
            />
          </>
        )}
      </div>

      <QuickActions />

      <TransactionList
        transactions={
          transactions.length > 0
            ? transactions
            : [
                {
                  id: "demo-tx-1",
                  account_id: "demo-1",
                  transaction_type: "payment",
                  amount: 125.5,
                  description: "Monthly Subscription",
                  recipient_name: "Netflix",
                  recipient_account: "9876543210",
                  status: "completed",
                  category: "entertainment",
                  created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
                },
                {
                  id: "demo-tx-2",
                  account_id: "demo-1",
                  transaction_type: "deposit",
                  amount: 2500.0,
                  description: "Salary Deposit",
                  recipient_name: null,
                  recipient_account: null,
                  status: "completed",
                  category: "income",
                  created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
                },
              ]
        }
      />
    </div>
  )
}
