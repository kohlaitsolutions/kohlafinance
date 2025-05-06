"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { DollarSign, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Account } from "@/lib/types"
import { formatCurrency } from "@/lib/utils"

type AccountCardProps = {
  account: Account
}

export function AccountCard({ account }: AccountCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
      <Card className="overflow-hidden card-hover">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 opacity-50" />
        <CardHeader className="relative">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">{account.account_name}</CardTitle>
            <Button variant="ghost" size="icon" onClick={() => setShowBalance(!showBalance)}>
              {showBalance ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="sr-only">{showBalance ? "Hide balance" : "Show balance"}</span>
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">{account.account_type}</div>
        </CardHeader>
        <CardContent className="relative space-y-4">
          <div className="flex items-end gap-2">
            <DollarSign className="h-5 w-5 text-primary" />
            <div className="text-2xl font-bold">
              {showBalance ? formatCurrency(account.balance, account.currency) : "••••••"}
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">Account Number</div>
            <div className="font-medium">•••• {account.account_number.slice(-4)}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
