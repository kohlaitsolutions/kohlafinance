import { redirect } from "next/navigation"

import { PaymentForm } from "@/components/payments/payment-form"
import { getSupabaseServerClient } from "@/lib/supabase/server"

export default async function PaymentsPage() {
  const supabase = getSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Get user accounts
  const { data: accounts } = await supabase.from("accounts").select("*").eq("user_id", session.user.id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
        <p className="text-muted-foreground">Send money to other accounts</p>
      </div>

      <div className="flex justify-center">
        <PaymentForm accounts={accounts || []} />
      </div>
    </div>
  )
}
