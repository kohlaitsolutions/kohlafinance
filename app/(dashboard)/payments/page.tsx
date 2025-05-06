import { getSupabaseServerClient } from "@/lib/supabase/server"
import { PaymentForm } from "@/components/payments/payment-form"

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Send money to other accounts</p>
      </div>

      <div className="flex justify-center">
        <PaymentForm accounts={accounts} />
      </div>
    </div>
  )
}
