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

  if (session?.user?.id) {
    try {
      // Get user accounts
      const { data: userAccounts, error: accountsError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", session.user.id)
        .order("is_primary", { ascending: false })

      if (!accountsError && userAccounts) {
        accounts = userAccounts
      }

      // Get recent transactions
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
    } catch (err) {
      console.error("Error fetching dashboard data:", err)
      // Continue with demo data
    }
  }

  // If no real accounts, use demo data
  if (accounts.length === 0) {
    accounts = [
      {
        id: "demo-1",
        user_id: "demo",
        account_number: "1234567890",
        account_name: "Checking Account",
        balance: 5280.42,
        account_type: "Checking",
        currency: "USD",
        is_primary: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: "demo-2",
        user_id: "demo",
        account_number: "0987654321",
        account_name: "Savings Account",
        balance: 12750.89,
        account_type: "Savings",
        currency: "USD",
        is_primary: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }

  // If no real transactions, use demo data
  if (transactions.length === 0) {
    transactions = [
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
        transaction_type: "payment",
        amount: 45.99,
        description: "Grocery Shopping",
        recipient_name: "Whole Foods",
        recipient_account: "5432109876",
        status: "completed",
        category: "groceries",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-tx-3",
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

  return (
    <div className="space-y-6">
      <div className="bg-primary text-white p-6 -mx-4 -mt-4 md:-mx-6 md:-mt-6">
        <h1 className="text-2xl font-bold mb-6">Kohlawise</h1>

        <div className="space-y-4">
          {accounts.map((account) => (
            <AccountCard key={account.id} account={account} />
          ))}
        </div>
      </div>

      <QuickActions />

      <TransactionList transactions={transactions} />
    </div>
  )
}
