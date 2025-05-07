"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { CreditCard, Plus, Send } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function QuickActions() {
  const actions = [
    {
      title: "Send Money",
      description: "Transfer to another account",
      icon: Send,
      href: "/payments/send",
    },
    {
      title: "Add Money",
      description: "Deposit to your account",
      icon: Plus,
      href: "/payments/deposit",
    },
    {
      title: "Pay Bills",
      description: "Pay your monthly bills",
      icon: CreditCard,
      href: "/payments/bills",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Link href={action.href} className="block h-full">
              <Card className="h-full transition-colors hover:bg-muted/50 card-hover">
                <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                  <action.icon className="mb-4 h-8 w-8 text-primary" />
                  <div className="text-lg font-medium">{action.title}</div>
                  <div className="text-sm text-muted-foreground">{action.description}</div>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  )
}
