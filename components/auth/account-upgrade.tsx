"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Shield, Zap, Check, ArrowRight } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { StripePaymentForm } from "@/components/payments/stripe-payment-form"

const upgradeSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
})

type UpgradeFormValues = z.infer<typeof upgradeSchema>

interface AccountUpgradeProps {
  onUpgrade?: (userData: UpgradeFormValues) => void
}

export function AccountUpgrade({ onUpgrade }: AccountUpgradeProps) {
  const [step, setStep] = useState<"info" | "payment" | "success">("info")
  const [userData, setUserData] = useState<UpgradeFormValues | null>(null)
  const [isOpen, setIsOpen] = useState(false)

  const form = useForm<UpgradeFormValues>({
    resolver: zodResolver(upgradeSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  })

  const handleInfoSubmit = (values: UpgradeFormValues) => {
    setUserData(values)
    setStep("payment")
  }

  const handlePaymentSuccess = (paymentIntent: any) => {
    if (userData) {
      onUpgrade?.(userData)
      setStep("success")

      // Close dialog after success
      setTimeout(() => {
        setIsOpen(false)
        setStep("info")
      }, 3000)
    }
  }

  const handlePaymentError = (error: string) => {
    console.error("Payment error:", error)
  }

  const features = [
    {
      icon: CreditCard,
      title: "Real Banking Features",
      description: "Access to real account management and transactions",
    },
    {
      icon: Shield,
      title: "Enhanced Security",
      description: "Bank-level security with 2FA and encryption",
    },
    {
      icon: Zap,
      title: "Premium Support",
      description: "24/7 customer support and priority assistance",
    },
  ]

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="relative overflow-hidden">
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary/10"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
          />
          <span className="relative z-10 flex items-center">
            Upgrade to Real Account
            <ArrowRight className="ml-2 h-4 w-4" />
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upgrade to Real Account</DialogTitle>
          <DialogDescription>
            Switch from demo mode to a real banking experience with live transactions
          </DialogDescription>
        </DialogHeader>

        {step === "info" && (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {features.map((feature, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <feature.icon className="mx-auto mb-2 h-8 w-8 text-primary" />
                    <h3 className="font-semibold">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Account Setup Fee
                  <Badge variant="secondary">One-time</Badge>
                </CardTitle>
                <CardDescription>Secure your real account with a one-time setup fee</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">$9.99</div>
                <p className="text-sm text-muted-foreground">
                  Includes account verification, security setup, and premium features
                </p>
              </CardContent>
            </Card>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleInfoSubmit)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="john@example.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="+1 (555) 123-4567" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full" size="lg">
                  Continue to Payment
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
            </Form>
          </div>
        )}

        {step === "payment" && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold">Complete Your Payment</h3>
              <p className="text-muted-foreground">Secure payment processing powered by Stripe</p>
            </div>

            <StripePaymentForm
              amount={9.99}
              currency="usd"
              description="Kohlawise Account Upgrade"
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />

            <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
              <Shield className="h-4 w-4" />
              <span>Secured by Stripe • PCI DSS Compliant</span>
            </div>
          </div>
        )}

        {step === "success" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center py-8 text-center"
          >
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-green-900">Account Upgraded!</h3>
            <p className="text-green-700 mb-4">
              Welcome to your real Kohlawise account. You now have access to all premium features.
            </p>
            <div className="text-sm text-muted-foreground">Redirecting to your dashboard...</div>
          </motion.div>
        )}
      </DialogContent>
    </Dialog>
  )
}
