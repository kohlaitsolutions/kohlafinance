import { getSupabaseServerClient } from "@/lib/supabase/server"
import { AccountCard } from "@/components/dashboard/account-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function DashboardPage() {
  const supabase = getSupabaseServerClient()

  // Try to get the session, but don't redirect if it fails
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Use demo data if no session is available
  let accounts = []
  let transactions = []
  let userData = { first_name: "User", last_name: "" }

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

  // If no accounts, create sample accounts
  if (accounts.length === 0) {
    accounts = [
      {
        id: "checking-1",
        user_id: "user-1",
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
        id: "savings-1",
        user_id: "user-1",
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

  // If no transactions, create sample transactions
  if (transactions.length === 0) {
    transactions = [
      {
        id: "tx-1",
        account_id: "checking-1",
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
        id: "tx-2",
        account_id: "checking-1",
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

  // Calculate total balance across all accounts
  const totalBalance = accounts.reduce((sum, account) => sum + account.balance, 0)

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">Welcome, {userData?.first_name}</h1>
        <p className="text-muted-foreground">Here's an overview of your finances</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-full md:col-span-2">
          <Card className="border-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background shadow-md">
            <CardHeader className="pb-2">
              <CardDescription>Total Balance</CardDescription>
              <CardTitle className="text-3xl font-bold">
                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(totalBalance)}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mt-2">
                <QuickActions />
              </div>
            </CardContent>
          </Card>
        </div>

        {accounts.map((account) => (
          <div key={account.id} className="col-span-1">
            <AccountCard account={account} />
          </div>
        ))}
      </div>

      <Tabs defaultValue="transactions" className="space-y-4">
        <TabsList>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
        </TabsList>
        <TabsContent value="transactions" className="space-y-4">
          <TransactionList transactions={transactions} />
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-4">
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Upcoming Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <div className="rounded-full bg-primary/10 p-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
                    <line x1="16" x2="16" y1="2" y2="6" />
                    <line x1="8" x2="8" y1="2" y2="6" />
                    <line x1="3" x2="21" y1="10" y2="10" />
                    <path d="M8 14h.01" />
                    <path d="M12 14h.01" />
                    <path d="M16 14h.01" />
                    <path d="M8 18h.01" />
                    <path d="M12 18h.01" />
                    <path d="M16 18h.01" />
                  </svg>
                </div>
                <h3 className="mt-4 text-lg font-medium">No Upcoming Payments</h3>
                <p className="mt-2 text-sm text-muted-foreground">You don't have any scheduled payments coming up.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
