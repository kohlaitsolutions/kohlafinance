// ───────────────────────────────────────────────────────────
// Crypto helpers  +  safe Ethereum provider guard (no re-define)
// ───────────────────────────────────────────────────────────

/* ---------- Types --------------------------------------------------------- */
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

/* ---------- Fetch helpers ------------------------------------------------- */
const API_BASE = "https://api.coinlore.net/api"

export async function fetchCryptocurrencies(start = 0, limit = 20): Promise<CryptoTicker[]> {
  try {
    const res = await fetch(`${API_BASE}/tickers/?start=${start}&limit=${limit}`)
    if (!res.ok) throw new Error(`Failed to fetch cryptocurrency data: ${res.status}`)
    const data: CryptoApiResponse = await res.json()
    return data.data
  } catch (err) {
    console.error("Error fetching cryptocurrency data:", err)
    return []
  }
}

export async function fetchCryptocurrencyById(id: string): Promise<CryptoTicker | null> {
  try {
    const res = await fetch(`${API_BASE}/ticker/?id=${id}`)
    if (!res.ok) throw new Error(`Failed to fetch cryptocurrency data: ${res.status}`)
    const data = await res.json()
    return data[0] ?? null
  } catch (err) {
    console.error(`Error fetching cryptocurrency with ID ${id}:`, err)
    return null
  }
}

/* ---------- Formatting helpers ------------------------------------------- */
export function formatCryptoPrice(price: string): string {
  const num = Number.parseFloat(price)
  if (num < 0.01) return num.toFixed(6)
  if (num < 1) return num.toFixed(4)
  if (num < 1000) return num.toFixed(2)
  return new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(num)
}

export function formatMarketCap(marketCap: string): string {
  const num = Number.parseFloat(marketCap)
  if (num >= 1_000_000_000) return `$${(num / 1_000_000_000).toFixed(2)}B`
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(2)}M`
  if (num >= 1_000) return `$${(num / 1_000).toFixed(2)}K`
  return `$${num.toFixed(2)}`
}

/* ---------- Ethereum guard ------------------------------------------------ */
/**
 * Safely attaches a provider to `window.ethereum` without throwing
 * “Cannot redefine property: ethereum” when a wallet has already injected one.
 */
export function ensureEthereumProvider(provider: unknown) {
  if (typeof window === "undefined") return
  if ("ethereum" in window) return (window as any).ethereum
  Object.defineProperty(window, "ethereum", {
    value: provider,
    writable: false,
    enumerable: false,
    configurable: false,
  })
  return provider
}
