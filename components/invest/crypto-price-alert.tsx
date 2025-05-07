"use client"

import { useState } from "react"
import { Bell, Plus, Trash2 } from "lucide-react"
import { motion } from "framer-motion"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { toast } from "@/components/ui/use-toast"
import type { CryptoTicker } from "@/lib/services/crypto-service"

type PriceAlert = {
  id: string
  cryptoId: string
  cryptoSymbol: string
  cryptoName: string
  targetPrice: number
  condition: "above" | "below"
  isActive: boolean
}

type CryptoPriceAlertProps = {
  cryptoList: CryptoTicker[]
}

export function CryptoPriceAlert({ cryptoList }: CryptoPriceAlertProps) {
  const [alerts, setAlerts] = useState<PriceAlert[]>([
    {
      id: "1",
      cryptoId: "90",
      cryptoSymbol: "BTC",
      cryptoName: "Bitcoin",
      targetPrice: 50000,
      condition: "above",
      isActive: true,
    },
    {
      id: "2",
      cryptoId: "80",
      cryptoSymbol: "ETH",
      cryptoName: "Ethereum",
      targetPrice: 3000,
      condition: "below",
      isActive: true,
    },
  ])

  const [newAlert, setNewAlert] = useState({
    cryptoId: "",
    targetPrice: "",
    condition: "above" as "above" | "below",
  })

  const handleAddAlert = () => {
    if (!newAlert.cryptoId || !newAlert.targetPrice) {
      toast({
        title: "Missing information",
        description: "Please select a cryptocurrency and enter a target price.",
        variant: "destructive",
      })
      return
    }

    const selectedCrypto = cryptoList.find((crypto) => crypto.id === newAlert.cryptoId)
    if (!selectedCrypto) return

    const alert: PriceAlert = {
      id: Date.now().toString(),
      cryptoId: newAlert.cryptoId,
      cryptoSymbol: selectedCrypto.symbol,
      cryptoName: selectedCrypto.name,
      targetPrice: Number.parseFloat(newAlert.targetPrice),
      condition: newAlert.condition,
      isActive: true,
    }

    setAlerts([...alerts, alert])
    setNewAlert({
      cryptoId: "",
      targetPrice: "",
      condition: "above",
    })

    toast({
      title: "Price alert created",
      description: `You'll be notified when ${selectedCrypto.name} goes ${newAlert.condition} $${newAlert.targetPrice}.`,
    })
  }

  const toggleAlertStatus = (id: string) => {
    setAlerts(alerts.map((alert) => (alert.id === id ? { ...alert, isActive: !alert.isActive } : alert)))
  }

  const deleteAlert = (id: string) => {
    setAlerts(alerts.filter((alert) => alert.id !== id))
    toast({
      title: "Price alert deleted",
      description: "The price alert has been removed.",
    })
  }

  return (
    <Card className="border-0 shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="mr-2 h-5 w-5" />
          Price Alerts
        </CardTitle>
        <CardDescription>Get notified when cryptocurrencies hit your target price</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <Select value={newAlert.cryptoId} onValueChange={(value) => setNewAlert({ ...newAlert, cryptoId: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select cryptocurrency" />
              </SelectTrigger>
              <SelectContent>
                {cryptoList.map((crypto) => (
                  <SelectItem key={crypto.id} value={crypto.id}>
                    {crypto.name} ({crypto.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select
              value={newAlert.condition}
              onValueChange={(value) => setNewAlert({ ...newAlert, condition: value as "above" | "below" })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Condition" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="above">Goes above</SelectItem>
                <SelectItem value="below">Goes below</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
              <Input
                type="number"
                placeholder="Target price"
                className="pl-7"
                value={newAlert.targetPrice}
                onChange={(e) => setNewAlert({ ...newAlert, targetPrice: e.target.value })}
              />
            </div>
          </div>
          <Button onClick={handleAddAlert}>
            <Plus className="mr-2 h-4 w-4" />
            Add Alert
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {alerts.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">No price alerts set</div>
          ) : (
            alerts.map((alert) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center">
                  <div className="mr-4">
                    <Switch checked={alert.isActive} onCheckedChange={() => toggleAlertStatus(alert.id)} />
                  </div>
                  <div>
                    <div className="font-medium">
                      {alert.cryptoName} ({alert.cryptoSymbol})
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Alert when price goes {alert.condition} ${alert.targetPrice.toLocaleString()}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={() => deleteAlert(alert.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
