"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowUpRight, Bitcoin, DollarSign, LineChart, Loader2, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CryptoPortfolio } from "@/components/invest/crypto-portfolio"
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
  const router = useRouter()
  const activeTab = searchParams.get("tab") || "portfolio"

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

  const handleTabChange = (value: string) => {
    router.push(`/invest?tab=${value}`, { scroll: false })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Invest & Earn</h1>
        <p className="text-muted-foreground">Grow your wealth with smart investments</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-blue-600 opacity-90" />
            <CardHeader className="pb-2 relative text-white">
              <CardTitle className="text-lg">Stocks</CardTitle>
              <CardDescription className="text-white/80">Trade company shares</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 relative text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <LineChart className="mr-2 h-5 w-5" />
                  <span className="text-2xl font-bold">+8.2%</span>
                </div>
                <span className="text-sm text-white/80">YTD Return</span>
              </div>
            </CardContent>
            <CardFooter className="relative">
              <Button variant="secondary" className="w-full" onClick={() => handleTabChange("stocks")}>
                View Stocks
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-pink-600 opacity-90" />
            <CardHeader className="pb-2 relative text-white">
              <CardTitle className="text-lg">Cryptocurrencies</CardTitle>
              <CardDescription className="text-white/80">Digital assets</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 relative text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Bitcoin className="mr-2 h-5 w-5" />
                  <span className="text-2xl font-bold">
                    {cryptoData.length > 0
                      ? `${cryptoData[0].percent_change_24h.startsWith("-") ? "" : "+"}${cryptoData[0].percent_change_24h}%`
                      : "--"}
                  </span>
                </div>
                <span className="text-sm text-white/80">BTC 24h Change</span>
              </div>
            </CardContent>
            <CardFooter className="relative">
              <Button variant="secondary" className="w-full" onClick={() => handleTabChange("crypto")}>
                View Crypto
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="border-0 shadow-md overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500 to-orange-600 opacity-90" />
            <CardHeader className="pb-2 relative text-white">
              <CardTitle className="text-lg">ETFs</CardTitle>
              <CardDescription className="text-white/80">Exchange-traded funds</CardDescription>
            </CardHeader>
            <CardContent className="pb-2 relative text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  <span className="text-2xl font-bold">+6.7%</span>
                </div>
                <span className="text-sm text-white/80">YTD Return</span>
              </div>
            </CardContent>
            <CardFooter className="relative">
              <Button variant="secondary" className="w-full" onClick={() => handleTabChange("etfs")}>
                View ETFs
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="stocks">Stocks</TabsTrigger>
          <TabsTrigger value="crypto">Crypto</TabsTrigger>
          <TabsTrigger value="etfs">ETFs</TabsTrigger>
        </TabsList>

        <TabsContent value="portfolio" className="mt-6">
          <CryptoPortfolio />
        </TabsContent>

        <TabsContent value="stocks" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Stocks</CardTitle>
                <CardDescription>Popular stocks to invest in</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
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
                        <span className={stock.change >= 0 ? "text-blue-500" : "text-red-500"}>
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
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="crypto" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cryptocurrencies</CardTitle>
                <CardDescription>Digital assets to invest in</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={refreshCryptoData} disabled={isRefreshing}>
                {isRefreshing ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                <span className="ml-2">Refresh</span>
              </Button>
            </CardHeader>
            <CardContent>
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
                              Number.parseFloat(crypto.percent_change_24h) >= 0 ? "text-blue-500" : "text-red-500"
                            }
                          >
                            {crypto.percent_change_24h.startsWith("-") ? "" : "+"}
                            {crypto.percent_change_24h}%
                          </span>
                        </div>
                        <div className="col-span-2 text-right text-sm">{formatMarketCap(crypto.market_cap_usd)}</div>
                        <div className="col-span-2 text-right flex justify-end gap-2">
                          <Button size="sm" variant="outline" asChild>
                            <Link href={`/invest/crypto/${crypto.id}`}>Details</Link>
                          </Button>
                          <Button size="sm">Buy</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="etfs" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>ETFs</CardTitle>
              <CardDescription>Exchange-traded funds to invest in</CardDescription>
            </CardHeader>
            <CardContent>
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
                        <span className={etf.change >= 0 ? "text-blue-500" : "text-red-500"}>
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
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
