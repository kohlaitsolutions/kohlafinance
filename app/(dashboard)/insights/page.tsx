"use client"

import { SpendingInsights } from "@/components/analytics/spending-insights"

// Demo transactions for insights
const DEMO_TRANSACTIONS = [
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
  {
    id: "demo-tx-6",
    account_id: "demo-1",
    transaction_type: "payment",
    amount: 120.0,
    description: "Phone Bill",
    recipient_name: "Mobile Carrier",
    recipient_account: "1122334455",
    status: "completed",
    category: "utilities",
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-tx-7",
    account_id: "demo-1",
    transaction_type: "payment",
    amount: 65.5,
    description: "Online Shopping",
    recipient_name: "Amazon",
    recipient_account: "9988776655",
    status: "completed",
    category: "shopping",
    created_at: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-tx-8",
    account_id: "demo-1",
    transaction_type: "payment",
    amount: 42.99,
    description: "Streaming Service",
    recipient_name: "Spotify",
    recipient_account: "5544332211",
    status: "completed",
    category: "entertainment",
    created_at: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-tx-9",
    account_id: "demo-1",
    transaction_type: "payment",
    amount: 55.0,
    description: "Gas Station",
    recipient_name: "Shell",
    recipient_account: "1122334455",
    status: "completed",
    category: "transportation",
    created_at: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-tx-10",
    account_id: "demo-1",
    transaction_type: "deposit",
    amount: 150.0,
    description: "Refund",
    recipient_name: null,
    recipient_account: null,
    status: "completed",
    category: "income",
    created_at: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function InsightsPage() {
  const transactions = DEMO_TRANSACTIONS

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Spending Insights</h1>
        <p className="text-muted-foreground">Analyze your spending patterns and financial habits</p>
      </div>

      <SpendingInsights transactions={transactions} />
    </div>
  )
}
