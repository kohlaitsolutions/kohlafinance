"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ArrowUpRight, TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts"

type SpendingInsightsProps = {
  transactions: any[]
}

export function SpendingInsights({ transactions }: SpendingInsightsProps) {
  const [timeframe, setTimeframe] = useState<"week" | "month" | "year">("month")

  // Process data for spending by category
  const categoryData = processSpendingByCategory(transactions)

  // Process data for monthly spending
  const timeframeData = processTimeframeSpending(transactions, timeframe)

  // Calculate total spending
  const totalSpending = transactions
    .filter((t) => t.transaction_type === "payment")
    .reduce((sum, t) => sum + Number(t.amount), 0)

  // Calculate average transaction
  const avgTransaction = totalSpending / transactions.filter((t) => t.transaction_type === "payment").length || 0

  // Find largest transaction
  const largestTransaction = transactions
    .filter((t) => t.transaction_type === "payment")
    .reduce((max, t) => Math.max(max, Number(t.amount)), 0)

  // Find most frequent merchant
  const merchantCounts = {}
  transactions
    .filter((t) => t.transaction_type === "payment" && t.recipient_name)
    .forEach((t) => {
      merchantCounts[t.recipient_name] = (merchantCounts[t.recipient_name] || 0) + 1
    })

  const mostFrequentMerchant = Object.entries(merchantCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "None"

  // Calculate spending trend (comparing current month to previous)
  const currentMonthSpending = transactions
    .filter((t) => {
      const date = new Date(t.created_at)
      const now = new Date()
      return (
        t.transaction_type === "payment" &&
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      )
    })
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const previousMonthSpending = transactions
    .filter((t) => {
      const date = new Date(t.created_at)
      const now = new Date()
      let prevMonth = now.getMonth() - 1
      let prevYear = now.getFullYear()
      if (prevMonth < 0) {
        prevMonth = 11
        prevYear--
      }
      return t.transaction_type === "payment" && date.getMonth() === prevMonth && date.getFullYear() === prevYear
    })
    .reduce((sum, t) => sum + Number(t.amount), 0)

  const spendingTrend =
    previousMonthSpending === 0 ? 0 : ((currentMonthSpending - previousMonthSpending) / previousMonthSpending) * 100

  // Define colors for each category
  const categoryColors = {
    entertainment: "#FF5E93", // Pink
    groceries: "#4ADE80", // Green
    utilities: "#60A5FA", // Blue
    dining: "#F97316", // Orange
    transfer: "#8B5CF6", // Purple
    income: "#10B981", // Teal
    Other: "#94A3B8", // Gray
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-primary" />
            Spending Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="insight-card">
              <div className="flex justify-between items-start">
                <div className="insight-title">Total Spending</div>
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div className="insight-value">{formatCurrency(totalSpending)}</div>
              <div className="insight-description">All time spending</div>
            </div>

            <div className="insight-card">
              <div className="flex justify-between items-start">
                <div className="insight-title">Average Transaction</div>
                <Calendar className="h-5 w-5 text-accent" />
              </div>
              <div className="insight-value">{formatCurrency(avgTransaction)}</div>
              <div className="insight-description">Per transaction</div>
            </div>

            <div className="insight-card">
              <div className="flex justify-between items-start">
                <div className="insight-title">Largest Payment</div>
                <ArrowUpRight className="h-5 w-5 text-negative" />
              </div>
              <div className="insight-value">{formatCurrency(largestTransaction)}</div>
              <div className="insight-description">Single transaction</div>
            </div>

            <div className="insight-card">
              <div className="flex justify-between items-start">
                <div className="insight-title">Monthly Trend</div>
                {spendingTrend > 0 ? (
                  <TrendingUp className="h-5 w-5 text-negative" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-positive" />
                )}
              </div>
              <div className="insight-value">
                {spendingTrend > 0 ? "+" : ""}
                {spendingTrend.toFixed(1)}%
              </div>
              <div className="insight-description">{spendingTrend > 0 ? "Increased" : "Decreased"} from last month</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">Spending by Category</TabsTrigger>
          <TabsTrigger value="timeline">Spending Timeline</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Spending by Category</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="amount"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value: number) => formatCurrency(value)}
                      labelFormatter={(index) => categoryData[index as number].category}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Spending Timeline</CardTitle>
                <div className="flex space-x-1 rounded-md bg-muted p-1">
                  <button
                    onClick={() => setTimeframe("week")}
                    className={`rounded-sm px-3 py-1 text-xs ${
                      timeframe === "week" ? "bg-primary text-white" : "text-muted-foreground"
                    }`}
                  >
                    Week
                  </button>
                  <button
                    onClick={() => setTimeframe("month")}
                    className={`rounded-sm px-3 py-1 text-xs ${
                      timeframe === "month" ? "bg-primary text-white" : "text-muted-foreground"
                    }`}
                  >
                    Month
                  </button>
                  <button
                    onClick={() => setTimeframe("year")}
                    className={`rounded-sm px-3 py-1 text-xs ${
                      timeframe === "year" ? "bg-primary text-white" : "text-muted-foreground"
                    }`}
                  >
                    Year
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={timeframeData}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                    <XAxis dataKey="period" tick={{ fill: "hsl(var(--foreground))" }} />
                    <YAxis tickFormatter={(value) => `$${value}`} tick={{ fill: "hsl(var(--foreground))" }} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Bar dataKey="amount" name="Spending" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
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
    entertainment: "#FF5E93", // Pink
    groceries: "#4ADE80", // Green
    utilities: "#60A5FA", // Blue
    dining: "#F97316", // Orange
    transfer: "#8B5CF6", // Purple
    income: "#10B981", // Teal
    Other: "#94A3B8", // Gray
  }

  return Object.keys(categories).map((category) => ({
    category,
    amount: categories[category],
    color: categoryColors[category] || "#999999",
  }))
}

function processTimeframeSpending(transactions, timeframe) {
  const periods = {}
  const now = new Date()

  // Filter payment transactions
  const paymentTransactions = transactions.filter((t) => t.transaction_type === "payment")

  if (timeframe === "week") {
    // Last 7 days
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now)
      date.setDate(date.getDate() - i)
      const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
      periods[dayName] = 0
    }

    paymentTransactions.forEach((transaction) => {
      const date = new Date(transaction.created_at)
      // Only include transactions from the last 7 days
      if (now.getTime() - date.getTime() <= 7 * 24 * 60 * 60 * 1000) {
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" })
        if (periods[dayName] !== undefined) {
          periods[dayName] += Number(transaction.amount)
        }
      }
    })
  } else if (timeframe === "month") {
    // Last 30 days grouped by week
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date(now)
      weekStart.setDate(weekStart.getDate() - (i * 7 + 6))
      const weekEnd = new Date(now)
      weekEnd.setDate(weekEnd.getDate() - i * 7)
      const periodName = `Week ${4 - i}`
      periods[periodName] = 0
    }

    paymentTransactions.forEach((transaction) => {
      const date = new Date(transaction.created_at)
      // Only include transactions from the last 30 days
      if (now.getTime() - date.getTime() <= 30 * 24 * 60 * 60 * 1000) {
        const weekNumber = Math.floor((now.getTime() - date.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1
        if (weekNumber <= 4) {
          const periodName = `Week ${weekNumber}`
          periods[periodName] += Number(transaction.amount)
        }
      }
    })
  } else if (timeframe === "year") {
    // Last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now)
      date.setMonth(date.getMonth() - i)
      const monthName = date.toLocaleDateString("en-US", { month: "short" })
      periods[monthName] = 0
    }

    paymentTransactions.forEach((transaction) => {
      const date = new Date(transaction.created_at)
      // Only include transactions from the last 12 months
      if (now.getTime() - date.getTime() <= 365 * 24 * 60 * 60 * 1000) {
        const monthName = date.toLocaleDateString("en-US", { month: "short" })
        if (periods[monthName] !== undefined) {
          periods[monthName] += Number(transaction.amount)
        }
      }
    })
  }

  return Object.keys(periods).map((period) => ({
    period,
    amount: periods[period],
  }))
}
