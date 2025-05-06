import { redirect } from "next/navigation"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { SpendingByCategory } from "@/components/analytics/spending-by-category"
import { MonthlySpending } from "@/components/analytics/monthly-spending"
import { SpendingTrends } from "@/components/analytics/spending-trends"
import { TopMerchants } from "@/components/analytics/top-merchants"

export default async function AnalyticsPage() {
  const supabase = getSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Get user accounts
  const { data: accounts } = await supabase.from("accounts").select("*").eq("user_id", session.user.id)

  // Get all transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .in("account_id", accounts?.map((account) => account.id) || [])
    .order("created_at", { ascending: false })

  // Process data for spending by category
  const categoryData = processSpendingByCategory(transactions || [])

  // Process data for monthly spending
  const monthlyData = processMonthlySpending(transactions || [])

  // Process data for spending trends
  const trendsData = processSpendingTrends(transactions || [])

  // Process data for top merchants
  const merchantsData = processTopMerchants(transactions || [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Spending Analytics</h1>
        <p className="text-muted-foreground">Visualize your financial activity</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SpendingByCategory data={categoryData} />
        <MonthlySpending data={monthlyData} />
        <SpendingTrends data={trendsData} />
        <TopMerchants data={merchantsData} />
      </div>
    </div>
  )
}

// Helper functions to process transaction data for charts
function processSpendingByCategory(transactions) {
  const categories = {}

  // Only include payment transactions
  const paymentTransactions = transactions.filter((t) => t.transaction_type === "payment")

  paymentTransactions.forEach((transaction) => {
    const category = transaction.category || "Other"
    if (!categories[category]) {
      categories[category] = 0
    }
    categories[category] += Number(transaction.amount)
  })

  // Define colors for each category
  const categoryColors = {
    entertainment: "#8884d8",
    groceries: "#82ca9d",
    utilities: "#ffc658",
    dining: "#ff8042",
    transfer: "#0088fe",
    income: "#00C49F",
    Other: "#FFBB28",
  }

  return Object.keys(categories).map((category) => ({
    category,
    amount: categories[category],
    color: categoryColors[category] || "#999999",
  }))
}

function processMonthlySpending(transactions) {
  const months = {}

  transactions.forEach((transaction) => {
    const date = new Date(transaction.created_at)
    const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`

    if (!months[monthYear]) {
      months[monthYear] = { income: 0, expenses: 0 }
    }

    if (transaction.transaction_type === "deposit") {
      months[monthYear].income += Number(transaction.amount)
    } else {
      months[monthYear].expenses += Number(transaction.amount)
    }
  })

  return Object.keys(months).map((month) => ({
    month,
    income: months[month].income,
    expenses: months[month].expenses,
  }))
}

function processSpendingTrends(transactions) {
  const dailySpending = {}

  // Only include payment transactions
  const paymentTransactions = transactions.filter((t) => t.transaction_type === "payment")

  paymentTransactions.forEach((transaction) => {
    const date = new Date(transaction.created_at).toISOString().split("T")[0]

    if (!dailySpending[date]) {
      dailySpending[date] = 0
    }

    dailySpending[date] += Number(transaction.amount)
  })

  return Object.keys(dailySpending)
    .sort()
    .map((date) => ({
      date: new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      amount: dailySpending[date],
    }))
}

function processTopMerchants(transactions) {
  const merchants = {}

  // Only include payment transactions with recipient names
  const paymentTransactions = transactions.filter((t) => t.transaction_type === "payment" && t.recipient_name)

  paymentTransactions.forEach((transaction) => {
    const merchant = transaction.recipient_name

    if (!merchants[merchant]) {
      merchants[merchant] = { amount: 0, transactions: 0 }
    }

    merchants[merchant].amount += Number(transaction.amount)
    merchants[merchant].transactions += 1
  })

  return Object.keys(merchants)
    .map((merchant) => ({
      merchant,
      amount: merchants[merchant].amount,
      transactions: merchants[merchant].transactions,
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
}
