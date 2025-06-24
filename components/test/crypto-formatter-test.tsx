"use client"

import { formatCryptoPrice, formatMarketCap } from "@/lib/services/crypto-service"

export function CryptoFormatterTest() {
  const testData = [
    { price: "0.000123", marketCap: "1234567890" },
    { price: "0.45", marketCap: "987654321" },
    { price: "1.23", marketCap: "123456789" },
    { price: "1234.56", marketCap: "12345678" },
    { price: "67890.12", marketCap: "1234567" },
  ]

  return (
    <div className="p-4 border rounded-lg bg-muted/50">
      <h3 className="font-semibold mb-4">Crypto Formatter Test</h3>
      <div className="space-y-2">
        {testData.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span>Price: {item.price}</span>
            <span>→ ${formatCryptoPrice(item.price)}</span>
            <span>Market Cap: {item.marketCap}</span>
            <span>→ {formatMarketCap(item.marketCap)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
