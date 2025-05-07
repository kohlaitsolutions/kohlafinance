"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Check, Loader2 } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { formatCurrency } from "@/lib/utils"
import { makeTransaction } from "@/app/actions"
import { sendMoneySchema } from "@/lib/validation"

type FormValues = z.infer<typeof sendMoneySchema>

export default function SendMoneyPage() {
  const [accounts, setAccounts] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      description: "",
    },
  })

  useState(() => {
    async function loadAccounts() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user?.id) {
          const { data, error } = await supabase.from("accounts").select("*").eq("user_id", session.user.id)

          if (!error && data) {
            setAccounts(data)
          }
        } else {
          // Demo accounts
          setAccounts([
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
          ])
        }
      } catch (error) {
        console.error("Error loading accounts:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAccounts()
  }, [supabase])

  const selectedAccountId = form.watch("fromAccount")
  const selectedAccount = accounts.find((account) => account.id === selectedAccountId)

  async function onSubmit(values: FormValues) {
    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append("fromAccount", values.fromAccount)
      formData.append("toAccount", values.toAccount)
      formData.append("recipientName", values.recipientName)
      formData.append("amount", values.amount.toString())
      if (values.description) {
        formData.append("description", values.description)
      }

      await makeTransaction(formData)
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
        message: error instanceof Error ? error.message : "An error occurred during the transaction",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Send Money</h1>
        <p className="text-muted-foreground">Transfer money to another account</p>
      </div>

      <div className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Send Money</CardTitle>
            <CardDescription>Transfer money to another account</CardDescription>
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
                <p className="text-muted-foreground">Your payment has been processed successfully</p>
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
                    name="recipientName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="toAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Recipient Account</FormLabel>
                        <FormControl>
                          <Input placeholder="Account number" {...field} />
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Rent payment, etc." {...field} />
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
                        Send Money
                        <ArrowRight className="ml-2 h-4 w-4" />
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
