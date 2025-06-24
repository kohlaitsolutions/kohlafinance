import { AccountCard } from "@/components/dashboard/account-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { SpendingInsights } from "@/components/analytics/spending-insights"

export default function DashboardPage() {
  // Demo data for all users
  const userName = "Demo User"

  const accounts = [
    {
      id: "demo-1",
      account_name: "Checking Account",
      account_type: "checking",
      account_number: "1234567890",
      balance: 5280.42,
      currency: "USD",
      is_primary: true,
    },
    {
      id: "demo-2",
      account_name: "Savings Account",
      account_type: "savings",
      account_number: "0987654321",
      balance: 12750.89,
      currency: "USD",
      is_primary: false,
    },
  ]

  const transactions = [
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
    {
      id: "demo-tx-4",
      account_id: "demo-1",
      transaction_type: "payment",
      amount: 85.0,
      description: "Electric Bill",
      recipient_name: "Power Company",
      recipient_account: "1122334455",
      status: "completed",
      category: "utilities",
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: "demo-tx-5",
      account_id: "demo-1",
      transaction_type: "payment",
      amount: 35.75,
      description: "Restaurant",
      recipient_name: "Local Bistro",
      recipient_account: "6677889900",
      status: "completed",
      category: "dining",
      created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {userName}</h1>
          <p className="text-muted-foreground">Here's an overview of your finances</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            accountName={account.account_name}
            accountNumber={account.account_number}
            balance={account.balance}
            currency={account.currency}
            type={account.account_type === "checking" ? "primary" : "secondary"}
          />
        ))}
      </div>

      <QuickActions />

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
          <TransactionList transactions={transactions} />
        </div>
        <div>
          <h2 className="mb-4 text-xl font-semibold">Spending Summary</h2>
          <SpendingInsights transactions={transactions} />
        </div>
      </div>
    </div>
  )
}
