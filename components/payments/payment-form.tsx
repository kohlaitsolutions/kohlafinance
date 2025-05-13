"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, CreditCard, Loader2 } from "lucide-react"
import { CardElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { getStripe } from "@/lib/stripe"
import { useAuth } from "@/lib/auth/auth-context"

// Styles for the card element
const cardStyle = {
  style: {
    base: {
      color: "var(--foreground)",
      fontFamily: "var(--font-sans)",
      fontSize: "16px",
      "::placeholder": {
        color: "var(--muted-foreground)",
      },
    },
    invalid: {
      color: "var(--destructive)",
      iconColor: "var(--destructive)",
    },
  },
}

function PaymentFormContent() {
  const [amount, setAmount] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [succeeded, setSucceeded] = useState(false)
  const [clientSecret, setClientSecret] = useState("")

  const stripe = useStripe()
  const elements = useElements()
  const router = useRouter()
  const { toast } = useToast()
  const { user } = useAuth()

  // Create payment intent when amount changes
  useEffect(() => {
    const createPaymentIntent = async () => {
      if (!amount || Number.parseFloat(amount) <= 0) return

      try {
        const response = await fetch("/api/payments/create-intent", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number.parseFloat(amount),
            description: description || "Payment",
          }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || "Failed to create payment intent")
        }

        const data = await response.json()
        setClientSecret(data.clientSecret)
      } catch (error: any) {
        console.error("Error creating payment intent:", error)
        setError(error.message || "An error occurred while setting up the payment")
      }
    }

    if (amount) {
      createPaymentIntent()
    }
  }, [amount, description])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements || !clientSecret) {
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const cardElement = elements.getElement(CardElement)

      if (!cardElement) {
        throw new Error("Card element not found")
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user ? `${user.firstName} ${user.lastName}` : undefined,
            email: user?.email,
          },
        },
      })

      if (error) {
        throw error
      }

      if (paymentIntent.status === "succeeded") {
        setSucceeded(true)
        toast({
          title: "Payment successful!",
          description: `Your payment of $${amount} was processed successfully.`,
        })

        // Record the transaction in the database
        await fetch("/api/payments/record-transaction", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: Number.parseFloat(amount),
            description,
            paymentIntentId: paymentIntent.id,
          }),
        })

        // Redirect to transactions page after a delay
        setTimeout(() => {
          router.push("/transactions")
          router.refresh()
        }, 2000)
      }
    } catch (error: any) {
      console.error("Payment error:", error)
      setError(error.message || "An error occurred while processing your payment")

      toast({
        variant: "destructive",
        title: "Payment failed",
        description: error.message || "An error occurred while processing your payment",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (succeeded) {
    return (
      <div className="rounded-lg border border-border bg-card p-6 shadow-sm">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="rounded-full bg-green-100 p-3 dark:bg-green-900/20">
            <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-semibold">Payment Successful!</h3>
            <p className="text-muted-foreground">
              Your payment of <span className="font-medium text-foreground">${amount}</span> has been processed
              successfully.
            </p>
          </div>
          <Button onClick={() => router.push("/transactions")} className="mt-4">
            View Transactions
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="amount">Amount ($)</Label>
        <div className="relative">
          <div className="absolute left-3 top-3 text-muted-foreground">$</div>
          <Input
            id="amount"
            type="number"
            step="0.01"
            min="0.50"
            placeholder="0.00"
            className="pl-8"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Input
          id="description"
          placeholder="What's this payment for?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="card-element">Card Details</Label>
        <div className="rounded-md border border-input bg-background px-3 py-4">
          <CardElement id="card-element" options={cardStyle} />
        </div>
      </div>

      {error && (
        <div className="rounded-md bg-destructive/15 p-3">
          <div className="flex items-center">
            <AlertCircle className="h-4 w-4 text-destructive mr-2" />
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full"
        disabled={isLoading || !stripe || !elements || !clientSecret || Number.parseFloat(amount) <= 0}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <CreditCard className="mr-2 h-4 w-4" /> Pay ${amount || "0.00"}
          </>
        )}
      </Button>
    </form>
  )
}

export function PaymentForm() {
  const [stripePromise, setStripePromise] = useState(() => getStripe())

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Make a Payment</h1>
          <p className="text-sm text-muted-foreground">Enter your payment details to complete your transaction.</p>
        </div>

        <Elements stripe={stripePromise}>
          <PaymentFormContent />
        </Elements>
      </div>
    </motion.div>
  )
}
