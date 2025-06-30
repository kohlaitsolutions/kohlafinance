"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, CreditCard } from "lucide-react"
import { formatCurrency } from "@/lib/utils"

type AccountCardProps = {
  accountName: string
  accountNumber: string
  balance: number
  currency?: string
  type?: "primary" | "secondary" | "tertiary"
  onClick?: () => void
}

export function AccountCard({
  accountName,
  accountNumber,
  balance,
  currency = "USD",
  type = "primary",
  onClick,
}: AccountCardProps) {
  const [showBalance, setShowBalance] = useState(true)

  const gradientClass =
    type === "primary" ? "bg-gradient-card" : type === "secondary" ? "bg-gradient-card-green" : "bg-gradient-card-blue"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`account-card ${gradientClass} card-hover cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{accountName}</h3>
          <div className="account-card-number mt-1">
            {accountNumber ? `•••• ${accountNumber.slice(-4)}` : "Account # unavailable"}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowBalance(!showBalance)
          }}
          className="p-1 rounded-full hover:bg-white/10"
        >
          {showBalance ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <div className="mt-6">
        <div className="text-sm opacity-80">Available Balance</div>
        <div className="account-card-balance">{showBalance ? formatCurrency(balance, currency) : "••••••"}</div>
      </div>
      <div className="absolute bottom-4 right-4 opacity-20">
        <CreditCard size={48} />
      </div>
    </motion.div>
  )
}
