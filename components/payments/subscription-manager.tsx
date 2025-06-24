"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CreditCard, Calendar, DollarSign, Settings, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { formatAmount } from "@/lib/stripe/utils"

interface Subscription {
  id: string
  status: string
  current_period_start: number
  current_period_end: number
  plan: {
    amount: number
    currency: string
    interval: string
    nickname: string
  }
}

export function SubscriptionManager() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchSubscriptions()
  }, [])

  const fetchSubscriptions = async () => {
    try {
      // Fetch user subscriptions
      const response = await fetch("/api/subscriptions")
      const data = await response.json()

      if (data.success) {
        setSubscriptions(data.subscriptions)
      }
    } catch (error) {
      console.error("Error fetching subscriptions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const cancelSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetch(`/api/subscriptions/${subscriptionId}/cancel`, {
        method: "POST",
      })

      if (response.ok) {
        fetchSubscriptions() // Refresh subscriptions
      }
    } catch (error) {
      console.error("Error canceling subscription:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "canceled":
        return "bg-red-100 text-red-800"
      case "past_due":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Subscription Management</h2>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Billing Settings
        </Button>
      </div>

      {subscriptions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <CreditCard className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Active Subscriptions</h3>
            <p className="text-muted-foreground mb-4">You don't have any active subscriptions at the moment.</p>
            <Button>Browse Plans</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {subscriptions.map((subscription) => (
            <motion.div key={subscription.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <CreditCard className="mr-2 h-5 w-5" />
                      {subscription.plan.nickname || "Premium Plan"}
                    </CardTitle>
                    <Badge className={getStatusColor(subscription.status)}>{subscription.status}</Badge>
                  </div>
                  <CardDescription>
                    {formatAmount(subscription.plan.amount / 100, subscription.plan.currency)} per{" "}
                    {subscription.plan.interval}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <Calendar className="mr-1 h-4 w-4" />
                      Current Period
                    </span>
                    <span>
                      {new Date(subscription.current_period_start * 1000).toLocaleDateString()} -{" "}
                      {new Date(subscription.current_period_end * 1000).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="flex items-center text-muted-foreground">
                      <DollarSign className="mr-1 h-4 w-4" />
                      Next Payment
                    </span>
                    <span>{new Date(subscription.current_period_end * 1000).toLocaleDateString()}</span>
                  </div>

                  {subscription.status === "past_due" && (
                    <Alert>
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>Your payment is past due. Please update your payment method.</AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2 pt-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      Update Payment
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="destructive" size="sm" className="flex-1">
                          Cancel
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Cancel Subscription</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to cancel this subscription? You'll lose access to premium features at
                            the end of your current billing period.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex gap-3 pt-4">
                          <Button variant="outline" className="flex-1">
                            Keep Subscription
                          </Button>
                          <Button
                            variant="destructive"
                            className="flex-1"
                            onClick={() => cancelSubscription(subscription.id)}
                          >
                            Cancel Subscription
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
