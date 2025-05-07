import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowRight, CreditCard, Landmark, Send, Smartphone } from "lucide-react"
import Link from "next/link"

export default async function PaymentsPage() {
  const supabase = getSupabaseServerClient()

  // Try to get the session, but don't redirect if it fails
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Use demo data if no session is available
  let accounts = []

  if (session?.user?.id) {
    try {
      // Get user accounts
      const { data: userAccounts, error } = await supabase.from("accounts").select("*").eq("user_id", session.user.id)

      if (!error && userAccounts) {
        accounts = userAccounts
      }
    } catch (err) {
      console.error("Error fetching accounts:", err)
      // Continue with demo data
    }
  }

  // If no real accounts, use demo data
  if (accounts.length === 0) {
    accounts = [
      {
        id: "demo-1",
        user_id: "demo",
        account_number: "1234567890",
        account_name: "Demo Checking",
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
        account_name: "Demo Savings",
        balance: 12750.89,
        account_type: "savings",
        currency: "USD",
        is_primary: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]
  }

  // Recent recipients
  const recentRecipients = [
    { id: "1", name: "John Smith", accountNumber: "****5678", avatar: "JS" },
    { id: "2", name: "Sarah Johnson", accountNumber: "****9012", avatar: "SJ" },
    { id: "3", name: "Michael Brown", accountNumber: "****3456", avatar: "MB" },
    { id: "4", name: "Emily Davis", accountNumber: "****7890", avatar: "ED" },
  ]

  // Payment methods
  const paymentMethods = [
    { id: "1", name: "Send Money", icon: Send, href: "/payments/send", color: "bg-blue-100" },
    { id: "2", name: "Pay Bills", icon: CreditCard, href: "/payments/bills", color: "bg-purple-100" },
    { id: "3", name: "Mobile Top-up", icon: Smartphone, href: "/payments/mobile", color: "bg-green-100" },
    { id: "4", name: "Bank Transfer", icon: Landmark, href: "/payments/transfer", color: "bg-amber-100" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Send money and pay bills</p>
      </div>

      <Tabs defaultValue="methods">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="methods">Payment Methods</TabsTrigger>
          <TabsTrigger value="recipients">Recent Recipients</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="methods" className="mt-6">
          <div className="grid gap-4 md:grid-cols-4">
            {paymentMethods.map((method) => (
              <Link href={method.href} key={method.id}>
                <Card className="border-0 shadow-sm hover:shadow-md transition-shadow cursor-pointer h-full">
                  <CardContent className="flex flex-col items-center justify-center p-6">
                    <div className={`${method.color} p-4 rounded-full mb-4`}>
                      <method.icon className="h-6 w-6 text-foreground" />
                    </div>
                    <h3 className="font-medium text-center">{method.name}</h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="recipients" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Recent Recipients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {recentRecipients.map((recipient) => (
                  <div
                    key={recipient.id}
                    className="flex items-center p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium mr-3">
                      {recipient.avatar}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{recipient.name}</div>
                      <div className="text-sm text-muted-foreground">{recipient.accountNumber}</div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex justify-center">
                <Button variant="outline">View All Recipients</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="mt-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Scheduled Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-4 rounded-full bg-muted p-6">
                  <CreditCard className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="mb-2 text-lg font-medium">No scheduled payments</h3>
                <p className="mb-4 text-sm text-muted-foreground max-w-md">
                  You don't have any scheduled payments. Set up recurring payments for bills and subscriptions.
                </p>
                <Button>Schedule a Payment</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
