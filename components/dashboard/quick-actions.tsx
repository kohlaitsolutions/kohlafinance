"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CreditCard, LineChart, Plus, Send } from "lucide-react"

export function QuickActions() {
  const actions = [
    {
      title: "Send",
      description: "Transfer money",
      icon: Send,
      href: "/payments/send",
      color: "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
    },
    {
      title: "Add",
      description: "Deposit funds",
      icon: Plus,
      href: "/payments/deposit",
      color: "bg-green-100 text-green-600 dark:bg-green-900/40 dark:text-green-400",
    },
    {
      title: "Pay",
      description: "Pay bills",
      icon: CreditCard,
      href: "/payments/bills",
      color: "bg-purple-100 text-purple-600 dark:bg-purple-900/40 dark:text-purple-400",
    },
    {
      title: "Invest",
      description: "Grow wealth",
      icon: LineChart,
      href: "/invest",
      color: "bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400",
    },
  ]

  return (
    <div className="grid grid-cols-4 gap-3 sm:gap-4">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <Link href={action.href} className="block h-full">
            <div className="flex flex-col items-center rounded-xl p-3 text-center transition-colors hover:bg-muted/50">
              <div className={`mb-2 flex h-12 w-12 items-center justify-center rounded-full ${action.color}`}>
                <action.icon className="h-5 w-5" />
              </div>
              <div className="text-sm font-medium">{action.title}</div>
              <div className="text-xs text-muted-foreground">{action.description}</div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  )
}
