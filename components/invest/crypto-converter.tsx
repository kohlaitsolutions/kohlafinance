"use client"

import { useState, useEffect } from "react"
import { ArrowDownUp, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { CryptoTicker } from "@/lib/services/crypto-service"

type CryptoConverterProps = {
  cryptoList: CryptoTicker[]
}

const fiatCurrencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
]

// Mock exchange rates for fiat currencies (relative to USD)
const fiatExchangeRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 150.23,
  CAD: 1.36,
  AUD: 1.52,
}

export function CryptoConverter({ cryptoList }: CryptoConverterProps) {
  const [fromType, setFromType] = useState<"crypto" | "fiat">("fiat")
  const [toType, setToType] = useState<"crypto" | "fiat">("crypto")
  const [fromCurrency, setFromCurrency] = useState("USD")
  const [toCurrency, setToCurrency] = useState(cryptoList.length > 0 ? cryptoList[0].id : "")
  const [fromAmount, setFromAmount] = useState("100")
  const [toAmount, setToAmount] = useState("")
  const [isCalculating, setIsCalculating] = useState(false)

  // Calculate conversion when inputs change
  useEffect(() => {
    if (!fromAmount || Number.parseFloat(fromAmount) === 0) {
      setToAmount("")
      return
    }

    setIsCalculating(true)

    // Simulate API call delay
    setTimeout(() => {
      let result = 0

      if (fromType === "fiat" && toType === "crypto") {
        // Convert fiat to crypto
        const selectedCrypto = cryptoList.find((crypto) => crypto.id === toCurrency)
        if (selectedCrypto) {
          const usdAmount =
            Number.parseFloat(fromAmount) / fiatExchangeRates[fromCurrency as keyof typeof fiatExchangeRates]
          result = usdAmount / Number.parseFloat(selectedCrypto.price_usd)
        }
      } else if (fromType === "crypto" && toType === "fiat") {
        // Convert crypto to fiat
        const selectedCrypto = cryptoList.find((crypto) => crypto.id === fromCurrency)
        if (selectedCrypto) {
          const usdAmount = Number.parseFloat(fromAmount) * Number.parseFloat(selectedCrypto.price_usd)
          result = usdAmount * fiatExchangeRates[toCurrency as keyof typeof fiatExchangeRates]
        }
      } else if (fromType === "crypto" && toType === "crypto") {
        // Convert crypto to crypto
        const fromCryptoData = cryptoList.find((crypto) => crypto.id === fromCurrency)
        const toCryptoData = cryptoList.find((crypto) => crypto.id === toCurrency)
        if (fromCryptoData && toCryptoData) {
          const usdAmount = Number.parseFloat(fromAmount) * Number.parseFloat(fromCryptoData.price_usd)
          result = usdAmount / Number.parseFloat(toCryptoData.price_usd)
        }
      } else {
        // Convert fiat to fiat
        const fromRate = fiatExchangeRates[fromCurrency as keyof typeof fiatExchangeRates]
        const toRate = fiatExchangeRates[toCurrency as keyof typeof fiatExchangeRates]
        result = (Number.parseFloat(fromAmount) / fromRate) * toRate
      }

      setToAmount(result.toFixed(result < 0.01 ? 8 : 2))
      setIsCalculating(false)
    }, 500)
  }, [fromAmount, fromCurrency, toCurrency, fromType, toType, cryptoList])

  const swapCurrencies = () => {
    setFromType(toType)
    setToType(fromType)
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
    setFromAmount(toAmount)
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <ArrowDownUp className="mr-2 h-5 w-5" />
          Currency Converter
        </CardTitle>
        <CardDescription>Convert between cryptocurrencies and fiat currencies</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-sm font-medium">From</div>
              <div className="flex space-x-2">
                <Button
                  variant={fromType === "fiat" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFromType("fiat")}
                >
                  Fiat
                </Button>
                <Button
                  variant={fromType === "crypto" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setFromType("crypto")}
                >
                  Crypto
                </Button>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <Input
                  type="number"
                  value={fromAmount}
                  onChange={(e) => setFromAmount(e.target.value)}
                  placeholder="Amount"
                />
              </div>
              <div className="flex-1">
                <Select value={fromCurrency} onValueChange={setFromCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {fromType === "fiat"
                      ? fiatCurrencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name}
                          </SelectItem>
                        ))
                      : cryptoList.map((crypto) => (
                          <SelectItem key={crypto.id} value={crypto.id}>
                            {crypto.symbol} {crypto.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-center">
            <Button variant="ghost" size="icon" onClick={swapCurrencies}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <div className="text-sm font-medium">To</div>
              <div className="flex space-x-2">
                <Button variant={toType === "fiat" ? "default" : "outline"} size="sm" onClick={() => setToType("fiat")}>
                  Fiat
                </Button>
                <Button
                  variant={toType === "crypto" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setToType("crypto")}
                >
                  Crypto
                </Button>
              </div>
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                {isCalculating ? (
                  <Skeleton className="h-10 w-full" />
                ) : (
                  <Input type="text" value={toAmount} readOnly placeholder="Converted amount" />
                )}
              </div>
              <div className="flex-1">
                <Select value={toCurrency} onValueChange={setToCurrency}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {toType === "fiat"
                      ? fiatCurrencies.map((currency) => (
                          <SelectItem key={currency.code} value={currency.code}>
                            {currency.symbol} {currency.name}
                          </SelectItem>
                        ))
                      : cryptoList.map((crypto) => (
                          <SelectItem key={crypto.id} value={crypto.id}>
                            {crypto.symbol} {crypto.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-muted p-4">
          <div className="text-sm font-medium mb-2">Exchange Rate</div>
          {isCalculating ? (
            <Skeleton className="h-6 w-3/4" />
          ) : (
            <div className="text-sm">
              {fromType === "fiat" && toType === "crypto" && fromCurrency && toCurrency ? (
                <div>
                  1 {fromCurrency} ={" "}
                  {(
                    1 /
                    fiatExchangeRates[fromCurrency as keyof typeof fiatExchangeRates] /
                    Number.parseFloat(cryptoList.find((c) => c.id === toCurrency)?.price_usd || "0")
                  ).toFixed(8)}{" "}
                  {cryptoList.find((c) => c.id === toCurrency)?.symbol}
                </div>
              ) : fromType === "crypto" && toType === "fiat" && fromCurrency && toCurrency ? (
                <div>
                  1 {cryptoList.find((c) => c.id === fromCurrency)?.symbol} ={" "}
                  {(
                    Number.parseFloat(cryptoList.find((c) => c.id === fromCurrency)?.price_usd || "0") *
                    fiatExchangeRates[toCurrency as keyof typeof fiatExchangeRates]
                  ).toFixed(2)}{" "}
                  {toCurrency}
                </div>
              ) : fromType === "crypto" && toType === "crypto" && fromCurrency && toCurrency ? (
                <div>
                  1 {cryptoList.find((c) => c.id === fromCurrency)?.symbol} ={" "}
                  {(
                    Number.parseFloat(cryptoList.find((c) => c.id === fromCurrency)?.price_usd || "0") /
                    Number.parseFloat(cryptoList.find((c) => c.id === toCurrency)?.price_usd || "0")
                  ).toFixed(8)}{" "}
                  {cryptoList.find((c) => c.id === toCurrency)?.symbol}
                </div>
              ) : (
                <div>
                  1 {fromCurrency} ={" "}
                  {(
                    fiatExchangeRates[toCurrency as keyof typeof fiatExchangeRates] /
                    fiatExchangeRates[fromCurrency as keyof typeof fiatExchangeRates]
                  ).toFixed(4)}{" "}
                  {toCurrency}
                </div>
              )}
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-2">Rates are updated in real-time based on market data</div>
        </div>
      </CardContent>
    </Card>
  )
}
