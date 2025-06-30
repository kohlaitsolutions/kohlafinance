"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowUpRight, Check, Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn, formatCurrency, formatDate } from "@/lib/utils"
import { payBillSchema } from "@/lib/validation"

type FormValues = z.infer<typeof payBillSchema>

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

export default function PayBillsPage() {
  const [accounts] = useState(DEMO_ACCOUNTS)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(payBillSchema),
    defaultValues: {
      billType: "",
      billNumber: "",
      dueDate: new Date().toISOString().split("T")[0],
    },
  })

  const selectedAccountId = form.watch("fromAccount")
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId)

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would call an API to process the bill payment
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
        message: error instanceof Error ? error.message : "An error occurred during the bill payment",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Pay Bills</h1>
        <p className="text-muted-foreground">Pay your monthly bills</p>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Pay Bills</CardTitle>
            <CardDescription>Pay your monthly bills and utilities</CardDescription>
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
                <h3 className="mb-1 text-xl font-semibold">Payment Successful</h3>
                <p className="text-muted-foreground">Your bill payment has been processed successfully</p>
              </motion.div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="fromAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>From Account</FormLabel>
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
                    name="billType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select bill type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="electricity">Electricity</SelectItem>
                            <SelectItem value="water">Water</SelectItem>
                            <SelectItem value="internet">Internet</SelectItem>
                            <SelectItem value="phone">Phone</SelectItem>
                            <SelectItem value="rent">Rent</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="billNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Bill Number / Account ID</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter bill number or account ID" {...field} />
                        </FormControl>
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
                        {selectedAccount && (
                          <FormDescription>
                            Available balance: {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
                          </FormDescription>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dueDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Due Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground",
                                )}
                              >
                                {field.value ? formatDate(field.value) : <span>Pick a date</span>}
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={new Date(field.value)}
                              onSelect={(date) => field.onChange(date?.toISOString() || "")}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
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
                        Pay Bill
                        <ArrowUpRight className="ml-2 h-4 w-4" />
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
