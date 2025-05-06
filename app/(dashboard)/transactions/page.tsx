import { redirect } from "next/navigation"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { formatCurrency, formatDate } from "@/lib/utils"

export default async function TransactionsPage() {
  const supabase = getSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session) {
    redirect("/login")
  }

  // Get user accounts
  const { data: accounts } = await supabase.from("accounts").select("*").eq("user_id", session.user.id)

  // Get all transactions
  const { data: transactions } = await supabase
    .from("transactions")
    .select("*")
    .in("account_id", accounts?.map((account) => account.id) || [])
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">View all your transaction history</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Recipient</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions?.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.created_at)}</TableCell>
                  <TableCell>
                    {transaction.description || (transaction.transaction_type === "deposit" ? "Deposit" : "Payment")}
                  </TableCell>
                  <TableCell>{transaction.recipient_name || "-"}</TableCell>
                  <TableCell className="capitalize">{transaction.transaction_type}</TableCell>
                  <TableCell
                    className={
                      transaction.transaction_type === "deposit"
                        ? "text-right text-green-500"
                        : "text-right text-red-500"
                    }
                  >
                    {transaction.transaction_type === "deposit" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                </TableRow>
              ))}

              {!transactions?.length && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No transactions found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
