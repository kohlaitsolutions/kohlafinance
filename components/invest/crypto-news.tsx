"use client"

import { useState, useEffect } from "react"
import { ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

type NewsItem = {
  id: string
  title: string
  url: string
  source: string
  date: string
  snippet: string
}

// Mock news data since we don't have a real news API
const generateMockNews = (symbol: string): NewsItem[] => {
  const sources = ["CryptoNews", "CoinDesk", "Cointelegraph", "Bloomberg", "CNBC"]
  const news = []

  const today = new Date()

  for (let i = 0; i < 5; i++) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)

    news.push({
      id: `news-${i}`,
      title: [
        `${symbol} Price Surges Amid Market Recovery`,
        `Analysts Predict Bright Future for ${symbol}`,
        `Major Exchange Adds Support for ${symbol}`,
        `${symbol} Development Team Announces New Features`,
        `Institutional Investors Show Interest in ${symbol}`,
      ][i],
      url: "#",
      source: sources[Math.floor(Math.random() * sources.length)],
      date: date.toISOString(),
      snippet: `Latest news about ${symbol} cryptocurrency and its market performance. Read more about the recent developments and price movements.`,
    })
  }

  return news
}

type CryptoNewsProps = {
  cryptoSymbol: string
}

export function CryptoNews({ cryptoSymbol }: CryptoNewsProps) {
  const [news, setNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)

    // In a real app, you would fetch news from an API
    // For this demo, we'll generate mock news
    setTimeout(() => {
      const mockNews = generateMockNews(cryptoSymbol)
      setNews(mockNews)
      setIsLoading(false)
    }, 1000)
  }, [cryptoSymbol])

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (news.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No recent news found for {cryptoSymbol}.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {news.map((item) => (
        <div key={item.id} className="border-b pb-4 last:border-0">
          <h3 className="font-medium">{item.title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{item.snippet}</p>
          <div className="flex justify-between items-center mt-2">
            <span className="text-xs text-muted-foreground">
              {item.source} • {new Date(item.date).toLocaleDateString()}
            </span>
            <Button variant="ghost" size="sm" className="h-8 px-2" asChild>
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                Read more
                <ExternalLink className="ml-1 h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
