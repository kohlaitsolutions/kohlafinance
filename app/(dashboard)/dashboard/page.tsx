"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"

import { AccountCard } from "@/components/dashboard/account-card"
import { QuickActions } from "@/components/dashboard/quick-actions"
import { TransactionList } from "@/components/dashboard/transaction-list"
import { WelcomeCard } from "@/components/dashboard/welcome-card"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

// Demo data for all users
const DEMO_ACCOUNTS = [
  {
    id: "demo-1",
    user_id: "demo",
    account_number: "1234567890",
    account_name: "Default Checking",
    balance: 5280.42,
    account_type: "checking",
    currency: "USD",
    is_primary: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    user_id: "demo",
    account_number: "0987654321",
    account_name: "Default Savings",
    balance: 12750.89,
    account_type: "savings",
    currency: "USD",
    is_primary: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

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
    amount: 89.99,
    description: "Phone Bill",
    recipient_name: "Verizon",
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
    description: "Dinner",
    recipient_name: "Olive Garden",
    recipient_account: "5566778899",
    status: "completed",
    category: "dining",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
  },
]

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [accounts, setAccounts] = useState<any[]>([])
  const [transactions, setTransactions] = useState<any[]>([])

  useEffect(() => {
    // Simulate loading delay for demo purposes
    const loadData = async () => {
      setIsLoading(true)

      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Set demo data
      setAccounts(DEMO_ACCOUNTS)
      setTransactions(DEMO_TRANSACTIONS)
      setIsLoading(false)
    }

    loadData()
  }, [])

  if (isLoading) {
    return <DashboardSkeleton />
  }

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <WelcomeCard userName="Demo User" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {accounts.map((account, index) => (
            <motion.div
              key={account.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
            >
              <AccountCard
                accountName={account.account_name}
                accountNumber={account.account_number}
                balance={account.balance}
                currency={account.currency}
                type={account.account_type === "checking" ? "primary" : "secondary"}
              />
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <QuickActions />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <TransactionList transactions={transactions} />
      </motion.div>
    </div>
  )
}
