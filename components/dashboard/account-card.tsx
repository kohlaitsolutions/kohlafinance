"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Account } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

type AccountCardProps = {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  // Generate a gradient based on account type
  const getGradient = () => {
    switch (account.account_type.toLowerCase()) {
      case "checking":
        return "from-blue-500 to-indigo-600"
      case "savings":
        return "from-emerald-500 to-teal-600"
      case "investment":
        return "from-amber-500 to-orange-600"
      default:
        return "from-violet-500 to-purple-600"
    }
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden border-0 shadow-lg">
        <div className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-90`} />
        <CardContent className="relative p-5">
          <div className="mb-1 flex items-center justify-between">
            <div className="text-sm font-medium text-white/80">{account.account_type}</div>
            <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)} className="text-white/90">
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showBalance ? "Hide balance" : "Show balance"}</span>
            </Button>
          </div>

          <div className="mb-4 text-lg font-semibold text-white">{account.account_name}</div>

          <div className="flex items-end gap-2">
            <div className="text-2xl font-bold text-white">
              {showBalance ? formatCurrency(account.balance, account.currency) : "••••••"}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm">
            <div className="text-white/80">Account Number</div>
            <div className="font-medium text-white">•••• {account.account_number.slice(-4)}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
