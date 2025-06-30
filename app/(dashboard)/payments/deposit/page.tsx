"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowDown, Check, CreditCard, Landmark, Loader2, Wallet } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { formatCurrency } from "@/lib/utils"
import { addMoneySchema } from "@/lib/validation"

type FormValues = z.infer<typeof addMoneySchema>

// Demo accounts for all users
const DEMO_ACCOUNTS = [
  {
    id: "demo-1",
    user_id: "demo",
    account_number: "1234567890",
    account_name: "Default Checking",
    balance: 5280.42,
    account_type: "checking",
    currency: "USD",
    is_primary: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2",
    user_id: "demo",
    account_number: "0987654321",
    account_name: "Default Savings",
    balance: 12750.89,
    account_type: "savings",
    currency: "USD",
    is_primary: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export default function AddMoneyPage() {
  const [accounts] = useState(DEMO_ACCOUNTS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(addMoneySchema),
    defaultValues: {
      source: "bank",
      description: "",
    },
  })

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would call an API to process the deposit
      // For now, we'll just simulate success
      setIsSuccess(true)

      // Redirect after showing success state
      setTimeout(() => {
        router.push("/dashboard")
        router.refresh()
      }, 1500)
    } catch (error) {
      console.error(error)
      form.setError("root", {
        type: "manual",
        message: error instanceof Error ? error.message : "An error occurred during the deposit",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Add Money</h1>
        <p className="text-muted-foreground">Deposit funds to your account</p>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Add Money</CardTitle>
            <CardDescription>Deposit funds to your account</CardDescription>
          </CardHeader>
          <CardContent>
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-6 text-center"
              >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/20">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                <h3 className="mb-1 text-xl font-semibold">Deposit Initiated</h3>
                <p className="text-muted-foreground">Your deposit has been initiated successfully</p>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="toAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>To Account</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select account" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {accounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.account_name} ({formatCurrency(account.balance, account.currency)})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                      <FormItem className="space-y-3">
                        <FormLabel>Deposit Method</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="bank" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <Landmark className="mr-2 h-4 w-4" />
                                Bank Transfer
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="card" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Credit/Debit Card
                              </FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="wallet" />
                              </FormControl>
                              <FormLabel className="font-normal flex items-center">
                                <Wallet className="mr-2 h-4 w-4" />
                                Digital Wallet
                              </FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Salary, bonus, etc." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {form.formState.errors.root && (
                    <div className="text-sm text-destructive">{form.formState.errors.root.message}</div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Add Money
                        <ArrowDown className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
