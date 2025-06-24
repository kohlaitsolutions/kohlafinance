"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Check, Download, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatAmount } from "@/lib/stripe/utils"

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [paymentDetails, setPaymentDetails] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const paymentIntentId = searchParams.get("payment_intent")
  const paymentIntentClientSecret = searchParams.get("payment_intent_client_secret")

  useEffect(() => {
    if (paymentIntentId) {
      // Fetch payment details
      fetchPaymentDetails(paymentIntentId)
    } else {
      setIsLoading(false)
    }
  }, [paymentIntentId])

  const fetchPaymentDetails = async (id: string) => {
    try {
      const response = await fetch(`/api/payments/retrieve?payment_intent_id=${id}`)
      const data = await response.json()

      if (data.success) {
        setPaymentDetails(data.paymentIntent)
      }
    } catch (error) {
      console.error("Error fetching payment details:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const downloadReceipt = () => {
    // Generate and download receipt
    const receiptData = {
      transactionId: paymentDetails?.id,
      amount: paymentDetails?.amount / 100,
      currency: paymentDetails?.currency,
      date: new Date().toISOString(),
      description: paymentDetails?.description || "Kohlawise Payment",
    }

    const dataStr = JSON.stringify(receiptData, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = `kohlawise-receipt-${receiptData.transactionId}.json`

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Processing your payment...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto max-w-2xl py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100"
            >
              <Check className="h-8 w-8 text-green-600" />
            </motion.div>
            <CardTitle className="text-2xl text-green-900">Payment Successful!</CardTitle>
            <CardDescription>Your payment has been processed successfully</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {paymentDetails && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="font-semibold text-lg">
                    {formatAmount(paymentDetails.amount / 100, paymentDetails.currency)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Transaction ID:</span>
                  <code className="text-sm bg-muted px-2 py-1 rounded">{paymentDetails.id}</code>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Status:</span>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    {paymentDetails.status}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Date:</span>
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
                {paymentDetails.description && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Description:</span>
                    <span>{paymentDetails.description}</span>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button onClick={downloadReceipt} variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Receipt
              </Button>
              <Button onClick={() => router.push("/dashboard")} className="flex-1">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">What's Next?</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-600" />
                Your account has been upgraded to premium
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-600" />
                All premium features are now available
              </li>
              <li className="flex items-center">
                <Check className="mr-2 h-4 w-4 text-green-600" />
                You'll receive a confirmation email shortly
              </li>
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
