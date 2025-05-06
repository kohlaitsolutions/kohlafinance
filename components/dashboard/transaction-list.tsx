"use client"

import { motion } from "framer-motion"
import { ArrowDownLeft, ArrowUpRight } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Transaction } from "@/lib/types"
import { formatCurrency, formatDate } from "@/lib/utils"

type TransactionListProps = {
  transactions: Transaction[]
}

export function TransactionList({ transactions }: TransactionListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {transactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className="flex items-center justify-between border-b p-4 last:border-0"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
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
          ))}

          {transactions.length === 0 && (
            <div className="p-4 text-center text-sm text-muted-foreground">No recent transactions</div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
