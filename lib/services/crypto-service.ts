export interface CryptoTicker {
  id: string
  symbol: string
  name: string
  nameid: string
  rank: number
  price_usd: string
  percent_change_24h: string
  percent_change_1h: string
  percent_change_7d: string
  price_btc: string
  market_cap_usd: string
  volume24: number
  volume24a: number
  csupply: string
  tsupply: string
  msupply: string
}

export interface CryptoGlobal {
  coins_count: number
  active_markets: number
  total_mcap: number
  total_volume: number
  btc_d: string
  eth_d: string
  mcap_change: string
  volume_change: string
  avg_change_percent: string
  volume_ath: number
  mcap_ath: number
}

const COINLORE_BASE_URL = "https://api.coinlore.net/api"

// Cache for API responses
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

function getCachedData<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }
  cache.delete(key)
  return null
}

function setCachedData<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}

export async function fetchCryptocurrencies(start = 0, limit = 100): Promise<CryptoTicker[]> {
  const cacheKey = `tickers_${start}_${limit}`
  const cached = getCachedData<CryptoTicker[]>(cacheKey)

  if (cached) {
    return cached
  }

  try {
    const response = await fetch(`${COINLORE_BASE_URL}/tickers/?start=${start}&limit=${limit}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("Invalid API response format")
    }

    const cryptocurrencies = data.data as CryptoTicker[]
    setCachedData(cacheKey, cryptocurrencies)

    return cryptocurrencies
  } catch (error) {
    console.error("Error fetching cryptocurrencies:", error)

    // Return mock data as fallback
    return generateMockCryptoData(limit)
  }
}

export async function fetchCryptocurrencyById(id: string): Promise<CryptoTicker | null> {
  const cacheKey = `ticker_${id}`
  const cached = getCachedData<CryptoTicker>(cacheKey)

  if (cached) {
    return cached
  }

  try {
    const response = await fetch(`${COINLORE_BASE_URL}/ticker/?id=${id}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("Cryptocurrency not found")
    }

    const cryptocurrency = data[0] as CryptoTicker
    setCachedData(cacheKey, cryptocurrency)

    return cryptocurrency
  } catch (error) {
    console.error(`Error fetching cryptocurrency ${id}:`, error)

    // Return mock data as fallback
    const mockData = generateMockCryptoData(1)
    return mockData.length > 0 ? { ...mockData[0], id } : null
  }
}

export async function fetchGlobalStats(): Promise<CryptoGlobal | null> {
  const cacheKey = "global_stats"
  const cached = getCachedData<CryptoGlobal>(cacheKey)

  if (cached) {
    return cached
  }

  try {
    const response = await fetch(`${COINLORE_BASE_URL}/global/`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error("Invalid global stats response")
    }

    const globalStats = data[0] as CryptoGlobal
    setCachedData(cacheKey, globalStats)

    return globalStats
  } catch (error) {
    console.error("Error fetching global stats:", error)
    return null
  }
}

// Utility functions for formatting
export function formatCryptoPrice(price: string): string {
  const numPrice = Number.parseFloat(price)

  if (numPrice >= 1) {
    return numPrice.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  } else if (numPrice >= 0.01) {
    return numPrice.toFixed(4)
  } else {
    return numPrice.toFixed(8)
  }
}

export function formatMarketCap(marketCap: string): string {
  const numMarketCap = Number.parseFloat(marketCap)

  if (numMarketCap >= 1e12) {
    return `$${(numMarketCap / 1e12).toFixed(2)}T`
  } else if (numMarketCap >= 1e9) {
    return `$${(numMarketCap / 1e9).toFixed(2)}B`
  } else if (numMarketCap >= 1e6) {
    return `$${(numMarketCap / 1e6).toFixed(2)}M`
  } else {
    return `$${numMarketCap.toLocaleString()}`
  }
}

export function formatVolume(volume: number): string {
  if (volume >= 1e9) {
    return `$${(volume / 1e9).toFixed(2)}B`
  } else if (volume >= 1e6) {
    return `$${(volume / 1e6).toFixed(2)}M`
  } else {
    return `$${volume.toLocaleString()}`
  }
}

// Mock data generator for fallback
function generateMockCryptoData(limit: number): CryptoTicker[] {
  const mockCryptos = [
    {
      id: "90",
      symbol: "BTC",
      name: "Bitcoin",
      nameid: "bitcoin",
      rank: 1,
      price_usd: "45000.00",
      percent_change_24h: "2.5",
      percent_change_1h: "0.5",
      percent_change_7d: "5.2",
      price_btc: "1.0",
      market_cap_usd: "850000000000",
      volume24: 25000000000,
      volume24a: 24000000000,
      csupply: "19500000",
      tsupply: "19500000",
      msupply: "21000000",
    },
    {
      id: "80",
      symbol: "ETH",
      name: "Ethereum",
      nameid: "ethereum",
      rank: 2,
      price_usd: "2800.00",
      percent_change_24h: "-1.2",
      percent_change_1h: "-0.3",
      percent_change_7d: "3.8",
      price_btc: "0.062",
      market_cap_usd: "340000000000",
      volume24: 12000000000,
      volume24a: 11500000000,
      csupply: "120000000",
      tsupply: "120000000",
      msupply: "0",
    },
    {
      id: "518",
      symbol: "USDT",
      name: "Tether",
      nameid: "tether",
      rank: 3,
      price_usd: "1.00",
      percent_change_24h: "0.1",
      percent_change_1h: "0.0",
      percent_change_7d: "0.2",
      price_btc: "0.000022",
      market_cap_usd: "85000000000",
      volume24: 45000000000,
      volume24a: 44000000000,
      csupply: "85000000000",
      tsupply: "85000000000",
      msupply: "0",
    },
  ]

  return mockCryptos.slice(0, Math.min(limit, mockCryptos.length))
}

// Safe ethereum provider setup
export function ensureEthereumProvider(): void {
  if (typeof window === "undefined") return

  try {
    // Only set if ethereum doesn't exist or is configurable
    const descriptor = Object.getOwnPropertyDescriptor(window, "ethereum")

    if (!descriptor || descriptor.configurable !== false) {
      // Safe to define or redefine
      Object.defineProperty(window, "ethereum", {
        value: window.ethereum || {
          isMetaMask: false,
          request: async () => {
            throw new Error("No Ethereum provider available")
          },
        },
        writable: true,
        configurable: true,
      })
    }
  } catch (error) {
    // Silently handle any errors - provider setup is not critical
    console.debug("Ethereum provider setup skipped:", error.message)
  }
}
