"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  fetchCryptocurrencyById,
  formatCryptoPrice,
  formatMarketCap,
  type CryptoTicker,
} from "@/lib/services/crypto-service"

export default function CryptoDetailPage({ params }: { params: { id: string } }) {
  const [crypto, setCrypto] = useState<CryptoTicker | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const loadCryptoData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchCryptocurrencyById(params.id)
        setCrypto(data)
      } catch (error) {
        console.error(`Failed to load cryptocurrency with ID ${params.id}:`, error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCryptoData()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!crypto) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cryptocurrencies
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <h3 className="mt-4 text-lg font-medium">Cryptocurrency Not Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              The cryptocurrency you are looking for could not be found.
            </p>
            <Button className="mt-4" onClick={() => router.push("/invest?tab=crypto")}>
              View All Cryptocurrencies
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={() => router.back()} className="flex items-center">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Cryptocurrencies
      </Button>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {crypto.name} ({crypto.symbol})
                  </CardTitle>
                  <CardDescription>Rank #{crypto.rank}</CardDescription>
                </div>
                <Button variant="outline" size="icon" asChild>
                  <a href={`https://coinlore.com/coin/${crypto.nameid}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price (USD)</span>
                  <span className="text-2xl font-bold">${formatCryptoPrice(crypto.price_usd)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Price (BTC)</span>
                  <span>{crypto.price_btc} BTC</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Market Cap</span>
                  <span>{formatMarketCap(crypto.market_cap_usd)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">24h Volume</span>
                  <span>${new Intl.NumberFormat("en-US").format(crypto.volume24)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Circulating Supply</span>
                  <span>
                    {new Intl.NumberFormat("en-US").format(Number.parseFloat(crypto.csupply))} {crypto.symbol}
                  </span>
                </div>
                {crypto.tsupply && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Supply</span>
                    <span>
                      {new Intl.NumberFormat("en-US").format(Number.parseFloat(crypto.tsupply))} {crypto.symbol}
                    </span>
                  </div>
                )}
                {crypto.msupply && crypto.msupply !== "0" && (
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Max Supply</span>
                    <span>
                      {new Intl.NumberFormat("en-US").format(Number.parseFloat(crypto.msupply))} {crypto.symbol}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Price Changes</CardTitle>
              <CardDescription>Performance over different time periods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">1 Hour</span>
                  <span
                    className={Number.parseFloat(crypto.percent_change_1h) >= 0 ? "text-green-500" : "text-red-500"}
                  >
                    {crypto.percent_change_1h.startsWith("-") ? "" : "+"}
                    {crypto.percent_change_1h}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">24 Hours</span>
                  <span
                    className={Number.parseFloat(crypto.percent_change_24h) >= 0 ? "text-green-500" : "text-red-500"}
                  >
                    {crypto.percent_change_24h.startsWith("-") ? "" : "+"}
                    {crypto.percent_change_24h}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">7 Days</span>
                  <span
                    className={Number.parseFloat(crypto.percent_change_7d) >= 0 ? "text-green-500" : "text-red-500"}
                  >
                    {crypto.percent_change_7d.startsWith("-") ? "" : "+"}
                    {crypto.percent_change_7d}%
                  </span>
                </div>
              </div>

              <div className="mt-8">
                <Button className="w-full">Invest Now</Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Historical Price Chart</CardTitle>
          <CardDescription>Price movement over time</CardDescription>
        </CardHeader>
        <CardContent className="h-80 flex items-center justify-center">
          <div className="text-center text-muted-foreground">
            <p>Historical chart data is not available through the Coinlore API.</p>
            <p>For detailed charts, please visit an external cryptocurrency tracking website.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
