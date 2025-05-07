// Types for Coinlore API responses
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

export interface CryptoApiResponse {
  data: CryptoTicker[]
  info: {
    coins_num: number
    time: number
  }
}

// Fetch cryptocurrency data from Coinlore API
export async function fetchCryptocurrencies(start = 0, limit = 20): Promise<CryptoTicker[]> {
  try {
    const response = await fetch(`https://api.coinlore.net/api/tickers/?start=${start}&limit=${limit}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch cryptocurrency data: ${response.status}`)
    }

    const data: CryptoApiResponse = await response.json()
    return data.data
  } catch (error) {
    console.error("Error fetching cryptocurrency data:", error)
    return []
  }
}

// Fetch a single cryptocurrency by ID
export async function fetchCryptocurrencyById(id: string): Promise<CryptoTicker | null> {
  try {
    const response = await fetch(`https://api.coinlore.net/api/ticker/?id=${id}`)

    if (!response.ok) {
      throw new Error(`Failed to fetch cryptocurrency data: ${response.status}`)
    }

    const data = await response.json()
    return data[0] || null
  } catch (error) {
    console.error(`Error fetching cryptocurrency with ID ${id}:`, error)
    return null
  }
}

// Format cryptocurrency price with appropriate precision
export function formatCryptoPrice(price: string): string {
  const numPrice = Number.parseFloat(price)

  if (numPrice < 0.01) {
    return numPrice.toFixed(6)
  } else if (numPrice < 1) {
    return numPrice.toFixed(4)
  } else if (numPrice < 1000) {
    return numPrice.toFixed(2)
  } else {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numPrice)
  }
}

// Format market cap with appropriate abbreviation
export function formatMarketCap(marketCap: string): string {
  const numMarketCap = Number.parseFloat(marketCap)

  if (numMarketCap >= 1_000_000_000) {
    return `$${(numMarketCap / 1_000_000_000).toFixed(2)}B`
  } else if (numMarketCap >= 1_000_000) {
    return `$${(numMarketCap / 1_000_000).toFixed(2)}M`
  } else if (numMarketCap >= 1_000) {
    return `$${(numMarketCap / 1_000).toFixed(2)}K`
  } else {
    return `$${numMarketCap.toFixed(2)}`
  }
}
