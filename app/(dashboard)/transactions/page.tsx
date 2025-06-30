"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowDownLeft, ArrowUpRight, MoreVertical } from "lucide-react"
import { formatCurrency, formatDate } from "@/lib/utils"

/**
 * Demo transactions shown to every visitor.
 * Remove or replace with real data once a backend is available.
 */
const DEMO_TRANSACTIONS = [
  {
    id: "demo-tx-1",
    transaction_type: "payment",
    amount: 125.5,
    description: "Monthly Subscription",
    recipient_name: "Netflix",
    category: "entertainment",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-tx-2",
    transaction_type: "payment",
    amount: 45.99,
    description: "Grocery Shopping",
    recipient_name: "Whole Foods",
    category: "groceries",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-tx-3",
    transaction_type: "deposit",
    amount: 2500,
    description: "Salary Deposit",
    recipient_name: null,
    category: "income",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-tx-4",
    transaction_type: "payment",
    amount: 89.99,
    description: "Phone Bill",
    recipient_name: "Verizon",
    category: "utilities",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "demo-tx-5",
    transaction_type: "payment",
    amount: 35.75,
    description: "Dinner",
    recipient_name: "Olive Garden",
    category: "dining",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

/** Tailwind background classes for each spending category */
function getCategoryColor(category: string | null | undefined) {
  switch (category?.toLowerCase()) {
    case "entertainment":
      return "bg-purple-100"
    case "groceries":
      return "bg-blue-100"
    case "utilities":
      return "bg-yellow-100"
    case "dining":
      return "bg-orange-100"
    case "income":
      return "bg-primary/10"
    default:
      return "bg-gray-100"
  }
}

export default function TransactionsPage() {
  const transactions = DEMO_TRANSACTIONS

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">View your recent transaction history</p>
      </header>

      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ul className="space-y-1">
            {transactions.map((tx) => (
              <li
                key={tx.id}
                className="flex items-center justify-between border-b p-4 last:border-0 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${getCategoryColor(
                      tx.category,
                    )}`}
                  >
                    {tx.transaction_type === "deposit" ? (
                      <ArrowDownLeft className="h-5 w-5 text-primary" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                    )}
                  </div>

                  <div>
                    <div className="font-medium">
                      {tx.description ||
                        (tx.transaction_type === "deposit" ? "Deposit" : tx.recipient_name || "Payment")}
                    </div>
                    <div className="text-sm text-muted-foreground">{formatDate(tx.created_at)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span
                    className={
                      tx.transaction_type === "deposit" ? "text-primary font-medium" : "text-red-500 font-medium"
                    }
                  >
                    {tx.transaction_type === "deposit" ? "+" : "-"}
                    {formatCurrency(tx.amount)}
                  </span>
                  <Button variant="ghost" size="icon" aria-label="More actions">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
