"use client"

import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight, ShoppingBag } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

type TransactionListProps = {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  // Function to get icon based on transaction category
  const getCategoryIcon = (category: string | null) => {
    if (!category) return ShoppingBag

    // You can expand this with more category-specific icons
    switch (category.toLowerCase()) {
      case "entertainment":
        return ShoppingBag
      default:
        return ShoppingBag
    }
  }

  // Function to get background color based on transaction category
  const getCategoryColor = (category: string | null) => {
    if (!category) return "bg-gray-100 dark:bg-gray-800"

    switch (category?.toLowerCase()) {
      case "entertainment":
        return "bg-purple-100 dark:bg-purple-900/30"
      case "groceries":
        return "bg-green-100 dark:bg-green-900/30"
      case "utilities":
        return "bg-blue-100 dark:bg-blue-900/30"
      case "dining":
        return "bg-amber-100 dark:bg-amber-900/30"
      case "income":
        return "bg-emerald-100 dark:bg-emerald-900/30"
      default:
        return "bg-gray-100 dark:bg-gray-800"
    }
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {transactions.map((transaction, index) => {
            const CategoryIcon = getCategoryIcon(transaction.category)
            const categoryColor = getCategoryColor(transaction.category)

            return (
              <motion.div
                key={transaction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.05 }}
                className="flex items-center justify-between border-b p-4 last:border-0"
              >
                <div className="flex items-center gap-4">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full ${categoryColor}`}>
                    {transaction.transaction_type === "deposit" ? (
                      <ArrowDownLeft className="h-5 w-5 text-green-500" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {transaction.description ||
                        (transaction.transaction_type === "deposit"
                          ? "Deposit"
                          : transaction.recipient_name || "Payment")}
                    </div>
                    <div className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</div>
                  </div>
                </div>
                <div className={transaction.transaction_type === "deposit" ? "text-green-500" : "text-red-500"}>
                  {transaction.transaction_type === "deposit" ? "+" : "-"}
                  {formatCurrency(transaction.amount)}
                </div>
              </motion.div>
            )
          })}

          {transactions.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">No recent transactions</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
