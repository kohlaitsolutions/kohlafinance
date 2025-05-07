"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowUpRight, Bitcoin, DollarSign, LineChart, Loader2, RefreshCw, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatCurrency } from "@/lib/utils"
import {
  fetchCryptocurrencies,
  formatCryptoPrice,
  formatMarketCap,
  type CryptoTicker,
} from "@/lib/services/crypto-service"

const stocksData = [
  { name: "Apple Inc.", symbol: "AAPL", price: 182.63, change: 1.25, changePercent: 0.69 },
  { name: "Microsoft Corp.", symbol: "MSFT", price: 337.22, change: 2.54, changePercent: 0.76 },
  { name: "Amazon.com Inc.", symbol: "AMZN", price: 178.75, change: -0.89, changePercent: -0.5 },
  { name: "Alphabet Inc.", symbol: "GOOGL", price: 131.86, change: 1.12, changePercent: 0.86 },
  { name: "Tesla Inc.", symbol: "TSLA", price: 237.49, change: 5.23, changePercent: 2.25 },
]

const etfData = [
  { name: "Vanguard S&P 500 ETF", symbol: "VOO", price: 437.86, change: 2.15, changePercent: 0.49 },
  { name: "iShares Core S&P 500 ETF", symbol: "IVV", price: 442.05, change: 2.23, changePercent: 0.51 },
  { name: "SPDR S&P 500 ETF Trust", symbol: "SPY", price: 436.32, change: 2.18, changePercent: 0.5 },
  { name: "Invesco QQQ Trust", symbol: "QQQ", price: 387.94, change: 3.25, changePercent: 0.84 },
  { name: "Vanguard Total Stock Market ETF", symbol: "VTI", price: 240.12, change: 1.05, changePercent: 0.44 },
]

export default function InvestPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [cryptoData, setCryptoData] = useState<CryptoTicker[]>([])
  const [isRefreshing, setIsRefreshing] = useState(false)
  const searchParams = useSearchParams()
  const activeTab = searchParams.get("tab") || "stocks"

  useEffect(() => {
    const loadCryptoData = async () => {
      setIsLoading(true)
      try {
        const data = await fetchCryptocurrencies(0, 20)
        setCryptoData(data)
      } catch (error) {
        console.error("Failed to load cryptocurrency data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCryptoData()
  }, [])

  const refreshCryptoData = async () => {
    setIsRefreshing(true)
    try {
      const data = await fetchCryptocurrencies(0, 20)
      setCryptoData(data)
    } catch (error) {
      console.error("Failed to refresh cryptocurrency data:", error)
    } finally {
      setIsRefreshing(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invest & Earn</h1>
        <p className="text-muted-foreground">Grow your wealth with smart investments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Stocks</CardTitle>
              <CardDescription>Trade company shares</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">+8.2%</span>
                </div>
                <span className="text-sm text-muted-foreground">YTD Return</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="#stocks">
                  View Stocks
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cryptocurrencies</CardTitle>
              <CardDescription>Digital assets</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bitcoin className="mr-2 h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">
                    {cryptoData.length > 0
                      ? `${cryptoData[0].percent_change_24h.startsWith("-") ? "" : "+"}${cryptoData[0].percent_change_24h}%`
                      : "--"}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">BTC 24h Change</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="#crypto">
                  View Crypto
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">ETFs</CardTitle>
              <CardDescription>Exchange-traded funds</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5 text-primary" />
                  <span className="text-2xl font-bold">+6.7%</span>
                </div>
                <span className="text-sm text-muted-foreground">YTD Return</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" asChild>
                <a href="#etfs">
                  View ETFs
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Investment Opportunities</CardTitle>
            <CardDescription>Explore and invest in various assets</CardDescription>
          </div>
          {activeTab === "crypto" && (
            <Button variant="outline" size="sm" onClick={refreshCryptoData} disabled={isRefreshing} className="ml-auto">
              {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
              <span className="ml-2">Refresh</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <Tabs defaultValue={activeTab} value={activeTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="stocks" id="stocks">
                Stocks
              </TabsTrigger>
              <TabsTrigger value="crypto" id="crypto">
                Crypto
              </TabsTrigger>
              <TabsTrigger value="etfs" id="etfs">
                ETFs
              </TabsTrigger>
            </TabsList>
            <TabsContent value="stocks" className="mt-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-3 text-right">Change</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {stocksData.map((stock) => (
                    <div key={stock.symbol} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-5">
                        <div className="font-medium">{stock.name}</div>
                        <div className="text-sm text-muted-foreground">{stock.symbol}</div>
                      </div>
                      <div className="col-span-2 text-right font-medium">{formatCurrency(stock.price)}</div>
                      <div className="col-span-3 text-right">
                        <span className={stock.change >= 0 ? "text-green-500" : "text-red-500"}>
                          {stock.change >= 0 ? "+" : ""}
                          {stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <Button size="sm">Invest</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
            <TabsContent value="crypto" className="mt-4">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-md border">
                  <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                    <div className="col-span-4">Name</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-right">24h Change</div>
                    <div className="col-span-2 text-right">Market Cap</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {cryptoData.map((crypto) => (
                      <div key={crypto.id} className="grid grid-cols-12 items-center p-3">
                        <div className="col-span-4">
                          <div className="font-medium">{crypto.name}</div>
                          <div className="text-sm text-muted-foreground">{crypto.symbol}</div>
                        </div>
                        <div className="col-span-2 text-right font-medium">${formatCryptoPrice(crypto.price_usd)}</div>
                        <div className="col-span-2 text-right">
                          <span
                            className={
                              Number.parseFloat(crypto.percent_change_24h) >= 0 ? "text-green-500" : "text-red-500"
                            }
                          >
                            {crypto.percent_change_24h.startsWith("-") ? "" : "+"}
                            {crypto.percent_change_24h}%
                          </span>
                        </div>
                        <div className="col-span-2 text-right text-sm">{formatMarketCap(crypto.market_cap_usd)}</div>
                        <div className="col-span-2 text-right">
                          <Button size="sm">Invest</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
            <TabsContent value="etfs" className="mt-4">
              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 p-3 text-sm font-medium">
                  <div className="col-span-5">Name</div>
                  <div className="col-span-2 text-right">Price</div>
                  <div className="col-span-3 text-right">Change</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {etfData.map((etf) => (
                    <div key={etf.symbol} className="grid grid-cols-12 items-center p-3">
                      <div className="col-span-5">
                        <div className="font-medium">{etf.name}</div>
                        <div className="text-sm text-muted-foreground">{etf.symbol}</div>
                      </div>
                      <div className="col-span-2 text-right font-medium">{formatCurrency(etf.price)}</div>
                      <div className="col-span-3 text-right">
                        <span className={etf.change >= 0 ? "text-green-500" : "text-red-500"}>
                          {etf.change >= 0 ? "+" : ""}
                          {etf.change.toFixed(2)} ({etf.changePercent.toFixed(2)}%)
                        </span>
                      </div>
                      <div className="col-span-2 text-right">
                        <Button size="sm">Invest</Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Investment Portfolio</CardTitle>
          <CardDescription>Track your investment performance</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center justify-center p-6">
          <div className="text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-medium">Start Investing</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your investment portfolio will appear here once you make your first investment.
            </p>
            <Button className="mt-4">Make Your First Investment</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
