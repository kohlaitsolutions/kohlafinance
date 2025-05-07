"use client"

import { useState, useEffect } from "react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Loader2 } from "lucide-react"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for the chart since Coinlore API doesn't provide historical data
const generateMockPriceData = (symbol: string, days: number, startPrice: number, volatility: number) => {
  const data = []
  let currentPrice = startPrice
  const now = new Date()

  for (let i = days; i >= 0; i--) {
    const date = new Date(now)
    date.setDate(date.getDate() - i)

    // Generate a random price movement with the given volatility
    const change = (Math.random() - 0.5) * volatility * currentPrice
    currentPrice = Math.max(0.01, currentPrice + change)

    data.push({
      date: date.toISOString().split("T")[0],
      [symbol]: currentPrice,
    })
  }

  return data
}

type CryptoChartProps = {
  cryptoId: string
  symbol: string
}

export function CryptoChart({ cryptoId, symbol }: CryptoChartProps) {
  const [timeframe, setTimeframe] = useState("30d")
  const [chartData, setChartData] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    // In a real app, you would fetch historical data from an API
    // For this demo, we'll generate mock data
    setTimeout(() => {
      const days = timeframe === "7d" ? 7 : timeframe === "30d" ? 30 : 90
      const startPrice = Number.parseFloat((Math.random() * 10000).toFixed(2))
      const volatility = timeframe === "7d" ? 0.03 : timeframe === "30d" ? 0.05 : 0.08

      const data = generateMockPriceData(symbol, days, startPrice, volatility)
      setChartData(data)
      setIsLoading(false)
    }, 1000)
  }, [timeframe, symbol])

  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${(value / 1000).toFixed(1)}k`
    }
    return `$${value.toFixed(1)}`
  }

  const formatTooltip = (value: number) => {
    return [`$${value.toFixed(2)}`, symbol]
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="h-full">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm font-medium">Price Chart</div>
        <Select value={timeframe} onValueChange={setTimeframe}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select timeframe" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 Days</SelectItem>
            <SelectItem value="30d">30 Days</SelectItem>
            <SelectItem value="90d">90 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="h-[320px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#888" strokeOpacity={0.2} />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickFormatter={(date) => {
                const d = new Date(date)
                return `${d.getDate()}/${d.getMonth() + 1}`
              }}
            />
            <YAxis tickFormatter={formatYAxis} tick={{ fontSize: 12 }} domain={["auto", "auto"]} />
            <Tooltip formatter={formatTooltip} labelFormatter={(date) => new Date(date).toLocaleDateString()} />
            <Legend />
            <Line type="monotone" dataKey={symbol} stroke="#ff1a75" strokeWidth={2} dot={false} activeDot={{ r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
