import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatCurrency, formatDate } from "@/lib/utils"

export default async function TransactionsPage() {
  const supabase = getSupabaseServerClient()

  // Try to get the session, but don't redirect if it fails
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Use demo data if no session is available
  let transactions = []

  if (session?.user?.id) {
    try {
      // Get user accounts
      const { data: accounts, error: accountsError } = await supabase
        .from("accounts")
        .select("*")
        .eq("user_id", session.user.id)

      if (!accountsError && accounts && accounts.length > 0) {
        // Get all transactions
        const { data: userTransactions, error: transactionsError } = await supabase
          .from("transactions")
          .select("*")
          .in(
            "account_id",
            accounts.map((account) => account.id),
          )
          .order("created_at", { ascending: false })

        if (!transactionsError && userTransactions) {
          transactions = userTransactions
        }
      }
    } catch (err) {
      console.error("Error fetching transactions:", err)
      // Continue with demo data
    }
  }

  // If no real transactions, use demo data
  if (transactions.length === 0) {
    transactions = [
      {
        id: "demo-tx-1",
        account_id: "demo-1",
        transaction_type: "payment",
        amount: 125.5,
        description: "Monthly Subscription",
        recipient_name: "Netflix",
        recipient_account: "9876543210",
        status: "completed",
        category: "entertainment",
        created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-tx-2",
        account_id: "demo-1",
        transaction_type: "payment",
        amount: 45.99,
        description: "Grocery Shopping",
        recipient_name: "Whole Foods",
        recipient_account: "5432109876",
        status: "completed",
        category: "groceries",
        created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-tx-3",
        account_id: "demo-1",
        transaction_type: "deposit",
        amount: 2500.0,
        description: "Salary Deposit",
        recipient_name: null,
        recipient_account: null,
        status: "completed",
        category: "income",
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  }

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
              {transactions.map((transaction) => (
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
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
