"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Sun, Moon, Cloud } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type WelcomeCardProps = {
  userName: string
}

export function WelcomeCard({ userName }: WelcomeCardProps) {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [greeting, setGreeting] = useState("")
  const [weatherIcon, setWeatherIcon] = useState<React.ReactNode>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    const hour = currentTime.getHours()

    if (hour < 12) {
      setGreeting("Good morning")
      setWeatherIcon(<Sun className="h-6 w-6 text-yellow-500" />)
    } else if (hour < 17) {
      setGreeting("Good afternoon")
      setWeatherIcon(<Cloud className="h-6 w-6 text-blue-400" />)
    } else {
      setGreeting("Good evening")
      setWeatherIcon(<Moon className="h-6 w-6 text-purple-400" />)
    }
  }, [currentTime])

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white overflow-hidden">
        <CardContent className="p-6 relative">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {weatherIcon}
                <h1 className="text-2xl font-bold">
                  {greeting}, {userName}!
                </h1>
              </div>
              <p className="text-white/80 text-lg">Welcome back to your financial dashboard</p>
              <div className="flex items-center space-x-4 text-sm text-white/70">
                <span>{formatDate(currentTime)}</span>
                <span>•</span>
                <span className="font-mono">{formatTime(currentTime)}</span>
              </div>
            </div>

            <div className="hidden md:block">
              <div className="text-right space-y-1">
                <div className="text-sm text-white/70">Quick Stats</div>
                <div className="text-lg font-semibold">Total Balance</div>
                <div className="text-2xl font-bold">$18,031.31</div>
                <div className="text-sm text-green-200">+2.5% this month</div>
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
