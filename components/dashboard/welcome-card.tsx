"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, TrendingUp, Clock } from "lucide-react"
import { useEffect, useState } from "react"

interface WelcomeCardProps {
  userName?: string
}

export function WelcomeCard({ userName = "Demo User" }: WelcomeCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000) // Update every minute

    return () => clearInterval(timer)
  }, [])

  const hour = currentTime.getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"
  const timeIcon = hour < 12 ? "🌅" : hour < 18 ? "☀️" : "🌙"

  // Calculate some demo stats
  const portfolioGrowth = 12.5
  const pendingTransactions = 3
  const lastLoginDays = Math.floor(Math.random() * 7) + 1

  return (
    <Card className="bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 text-white border-0 overflow-hidden relative">
      <div className="absolute inset-0 bg-black/10" />
      <CardContent className="p-6 relative z-10">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 animate-pulse" />
              <Badge variant="secondary" className="bg-white/20 text-white border-0 backdrop-blur-sm">
                <Clock className="h-3 w-3 mr-1" />
                {timeIcon} {greeting}
              </Badge>
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-1">
                {greeting}, {userName}!
              </h2>
              <p className="text-blue-100">Ready to manage your finances today?</p>
            </div>
          </div>
          <div className="flex items-center justify-center w-14 h-14 bg-white/20 rounded-full backdrop-blur-sm">
            <TrendingUp className="h-7 w-7" />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2 text-blue-100">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span>Portfolio up {portfolioGrowth}% this month</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <div className="w-2 h-2 bg-yellow-400 rounded-full" />
            <span>{pendingTransactions} pending transactions</span>
          </div>
          <div className="flex items-center gap-2 text-blue-100">
            <div className="w-2 h-2 bg-blue-400 rounded-full" />
            <span>Last login {lastLoginDays} days ago</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
