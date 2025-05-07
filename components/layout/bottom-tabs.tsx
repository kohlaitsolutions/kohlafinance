"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion } from "framer-motion"
import { CreditCard, Home, Share, TrendingUp, Wallet } from "lucide-react"

import { cn } from "@/lib/utils"

const tabs = [
  {
    name: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    name: "Transactions",
    href: "/transactions",
    icon: Wallet,
  },
  {
    name: "Payments",
    href: "/payments",
    icon: CreditCard,
  },
  {
    name: "Invest",
    href: "/invest",
    icon: TrendingUp,
  },
  {
    name: "Refer",
    href: "/refer",
    icon: Share,
  },
]

export function BottomTabs() {
  const pathname = usePathname()
  const [activeTab, setActiveTab] = useState(pathname)

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t md:hidden">
      <div className="flex justify-around">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center justify-center py-3 text-xs",
                isActive ? "text-primary" : "text-muted-foreground",
              )}
              onClick={() => setActiveTab(tab.href)}
            >
              <div className="relative">
                <tab.icon className="h-5 w-5" />
                {isActive && (
                  <motion.div
                    layoutId="bottomTabIndicator"
                    className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
              <span className="mt-1">{tab.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
