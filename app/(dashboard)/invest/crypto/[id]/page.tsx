"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, ExternalLink, TrendingDown, TrendingUp } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { CryptoChart } from "@/components/invest/crypto-chart"
import { CryptoNews } from "@/components/invest/crypto-news"
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
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Cryptocurrencies
        </Button>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-1/2" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
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

  const priceChange24h = Number.parseFloat(crypto.percent_change_24h)
  const isPriceUp = priceChange24h >= 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <Button variant="ghost" asChild className="self-start">
          <Link href="/invest?tab=crypto" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Cryptocurrencies
          </Link>
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Add to Portfolio
          </Button>
          <Button size="sm">Buy {crypto.symbol}</Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="border-0 shadow-md">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-2xl">
                      {crypto.name} ({crypto.symbol})
                    </CardTitle>
                    <span className="text-xs bg-muted px-2 py-1 rounded-full">Rank #{crypto.rank}</span>
                  </div>
                  <CardDescription>
                    <div className="flex items-center mt-1">
                      <span className="text-3xl font-bold">${formatCryptoPrice(crypto.price_usd)}</span>
                      <span className={`ml-2 flex items-center ${isPriceUp ? "text-blue-500" : "text-red-500"}`}>
                        {isPriceUp ? (
                          <TrendingUp className="h-4 w-4 mr-1" />
                        ) : (
                          <TrendingDown className="h-4 w-4 mr-1" />
                        )}
                        {isPriceUp ? "+" : ""}
                        {crypto.percent_change_24h}%
                      </span>
                    </div>
                  </CardDescription>
                </div>
                <Button variant="outline" size="icon" asChild>
                  <a href={`https://coinlore.com/coin/${crypto.nameid}`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Market Cap</div>
                  <div className="font-medium">{formatMarketCap(crypto.market_cap_usd)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">24h Volume</div>
                  <div className="font-medium">${new Intl.NumberFormat("en-US").format(crypto.volume24)}</div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">Circulating Supply</div>
                  <div className="font-medium">
                    {new Intl.NumberFormat("en-US").format(Number.parseFloat(crypto.csupply))} {crypto.symbol}
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">BTC Price</div>
                  <div className="font-medium">{crypto.price_btc} BTC</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Price Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">1 Hour</div>
                  <div className={Number.parseFloat(crypto.percent_change_1h) >= 0 ? "text-blue-500" : "text-red-500"}>
                    {crypto.percent_change_1h.startsWith("-") ? "" : "+"}
                    {crypto.percent_change_1h}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">24 Hours</div>
                  <div className={Number.parseFloat(crypto.percent_change_24h) >= 0 ? "text-blue-500" : "text-red-500"}>
                    {crypto.percent_change_24h.startsWith("-") ? "" : "+"}
                    {crypto.percent_change_24h}%
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="text-sm text-muted-foreground">7 Days</div>
                  <div className={Number.parseFloat(crypto.percent_change_7d) >= 0 ? "text-blue-500" : "text-red-500"}>
                    {crypto.percent_change_7d.startsWith("-") ? "" : "+"}
                    {crypto.percent_change_7d}%
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <div className="w-full space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">All Time Low</span>
                  <span className="text-muted-foreground">All Time High</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{
                      width: `${Math.min(100, Math.max(0, (Number.parseFloat(crypto.price_usd) / 100000) * 100))}%`,
                    }}
                  />
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-medium">$0</span>
                  <span className="font-medium">$100,000</span>
                </div>
              </div>
            </CardFooter>
          </Card>
        </motion.div>
      </div>

      <Tabs defaultValue="chart" className="w-full">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="chart">Price Chart</TabsTrigger>
          <TabsTrigger value="news">News</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
        </TabsList>

        <TabsContent value="chart" className="mt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Price History</CardTitle>
              <CardDescription>Historical price data for {crypto.name}</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px]">
              <CryptoChart cryptoId={crypto.id} symbol={crypto.symbol} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="news" className="mt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Latest News</CardTitle>
              <CardDescription>Recent news about {crypto.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <CryptoNews cryptoSymbol={crypto.symbol} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about" className="mt-4">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>About {crypto.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none dark:prose-invert">
                <p>
                  {crypto.name} ({crypto.symbol}) is a cryptocurrency ranked #{crypto.rank} by market capitalization. It
                  has a current supply of {new Intl.NumberFormat("en-US").format(Number.parseFloat(crypto.csupply))}{" "}
                  {crypto.symbol}.
                </p>

                {crypto.msupply && crypto.msupply !== "0" && (
                  <p>
                    The maximum supply is capped at{" "}
                    {new Intl.NumberFormat("en-US").format(Number.parseFloat(crypto.msupply))} {crypto.symbol}.
                  </p>
                )}

                <p>
                  For more detailed information about {crypto.name}, please visit the official website or check
                  cryptocurrency information platforms.
                </p>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" asChild>
                <a
                  href={`https://coinlore.com/coin/${crypto.nameid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                >
                  Learn more
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
