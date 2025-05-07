"use client"

import type React from "react"

import { useState } from "react"
import { ArrowUpRight, ArrowDownRight, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCryptoPrice } from "@/lib/services/crypto-service"

// Mock portfolio data
const mockPortfolio = [
  {
    id: "btc",
    name: "Bitcoin",
    symbol: "BTC",
    amount: 0.05,
    buyPrice: 45000,
    currentPrice: 48000,
    change24h: 2.5,
  },
  {
    id: "eth",
    name: "Ethereum",
    symbol: "ETH",
    amount: 1.2,
    buyPrice: 3000,
    currentPrice: 2800,
    change24h: -1.8,
  },
  {
    id: "sol",
    name: "Solana",
    symbol: "SOL",
    amount: 15,
    buyPrice: 120,
    currentPrice: 140,
    change24h: 5.2,
  },
]

export function CryptoPortfolio() {
  const [portfolio, setPortfolio] = useState(mockPortfolio)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // Calculate total portfolio value
  const totalValue = portfolio.reduce((sum, asset) => sum + asset.amount * asset.currentPrice, 0)

  // Calculate total profit/loss
  const totalProfitLoss = portfolio.reduce(
    (sum, asset) => sum + asset.amount * (asset.currentPrice - asset.buyPrice),
    0,
  )

  const totalProfitLossPercentage =
    portfolio.reduce((sum, asset) => sum + asset.amount * asset.buyPrice, 0) > 0
      ? (totalProfitLoss / portfolio.reduce((sum, asset) => sum + asset.amount * asset.buyPrice, 0)) * 100
      : 0

  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, you would add the asset to the portfolio
    setIsAddDialogOpen(false)
  }

  const handleRemoveAsset = (id: string) => {
    setPortfolio(portfolio.filter((asset) => asset.id !== id))
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Crypto Portfolio</CardTitle>
            <CardDescription>Track your cryptocurrency investments</CardDescription>
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="mr-2 h-4 w-4" />
                Add Asset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Cryptocurrency</DialogTitle>
                <DialogDescription>Add a new cryptocurrency to your portfolio.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddAsset}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="crypto">Cryptocurrency</Label>
                    <Input id="crypto" placeholder="Search cryptocurrency..." />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="amount">Amount</Label>
                      <Input id="amount" type="number" step="any" placeholder="0.00" />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="price">Buy Price ($)</Label>
                      <Input id="price" type="number" step="any" placeholder="0.00" />
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="date">Purchase Date</Label>
                    <Input id="date" type="date" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add to Portfolio</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Total Value</div>
            <div className="text-2xl font-bold">
              ${totalValue.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm text-muted-foreground">Profit/Loss</div>
            <div
              className={`text-2xl font-bold flex items-center ${totalProfitLoss >= 0 ? "text-blue-500" : "text-red-500"}`}
            >
              {totalProfitLoss >= 0 ? (
                <ArrowUpRight className="mr-1 h-5 w-5" />
              ) : (
                <ArrowDownRight className="mr-1 h-5 w-5" />
              )}
              $
              {Math.abs(totalProfitLoss).toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
              <span className="ml-1 text-sm">
                ({totalProfitLoss >= 0 ? "+" : ""}
                {totalProfitLossPercentage.toFixed(2)}%)
              </span>
            </div>
          </div>
        </div>

        {portfolio.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">Profit/Loss</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {portfolio.map((asset) => {
                const value = asset.amount * asset.currentPrice
                const profitLoss = asset.amount * (asset.currentPrice - asset.buyPrice)
                const profitLossPercentage = ((asset.currentPrice - asset.buyPrice) / asset.buyPrice) * 100

                return (
                  <TableRow key={asset.id}>
                    <TableCell>
                      <div className="font-medium">{asset.name}</div>
                      <div className="text-xs text-muted-foreground">{asset.symbol}</div>
                    </TableCell>
                    <TableCell className="text-right">{asset.amount}</TableCell>
                    <TableCell className="text-right">
                      <div>${formatCryptoPrice(asset.currentPrice.toString())}</div>
                      <div className={`text-xs ${asset.change24h >= 0 ? "text-blue-500" : "text-red-500"}`}>
                        {asset.change24h >= 0 ? "+" : ""}
                        {asset.change24h}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      $
                      {(asset.amount * asset.currentPrice).toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </TableCell>
                    <TableCell className={`text-right ${profitLoss >= 0 ? "text-blue-500" : "text-red-500"}`}>
                      {profitLoss >= 0 ? "+" : ""}$
                      {profitLoss.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      <div className="text-xs">
                        ({profitLossPercentage >= 0 ? "+" : ""}
                        {profitLossPercentage.toFixed(2)}%)
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" onClick={() => handleRemoveAsset(asset.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">You don't have any cryptocurrencies in your portfolio yet.</p>
            <Button className="mt-4" onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Asset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
