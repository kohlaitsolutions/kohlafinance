import { getSupabaseServerClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency, formatDate } from "@/lib/utils"
import { ArrowDownLeft, ArrowUpRight, MoreVertical } from "lucide-react"
import { Button } from "@/components/ui/button"

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
      {
        id: "demo-tx-4",
        account_id: "demo-1",
        transaction_type: "payment",
        amount: 89.99,
        description: "Phone Bill",
        recipient_name: "Verizon",
        recipient_account: "1122334455",
        status: "completed",
        category: "utilities",
        created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "demo-tx-5",
        account_id: "demo-1",
        transaction_type: "payment",
        amount: 35.75,
        description: "Dinner",
        recipient_name: "Olive Garden",
        recipient_account: "5566778899",
        status: "completed",
        category: "dining",
        created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ]
  }

  // Function to get category color
  const getCategoryColor = (category: string | null) => {
    if (!category) return "bg-gray-100"

    switch (category.toLowerCase()) {
      case "entertainment":
        return "bg-purple-100"
      case "groceries":
        return "bg-blue-100"
      case "utilities":
        return "bg-yellow-100"
      case "dining":
        return "bg-orange-100"
      case "income":
        return "bg-primary/10"
      default:
        return "bg-gray-100"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">View all your transaction history</p>
      </div>

      <Card className="border-0 shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transaction History</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Filter
            </Button>
            <Button variant="outline" size="sm">
              Export
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-1">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between border-b p-4 last:border-0 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${getCategoryColor(transaction.category)}`}
                  >
                    {transaction.transaction_type === "deposit" ? (
                      <ArrowDownLeft className="h-5 w-5 text-primary" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">
                      {transaction.description ||
                        (transaction.transaction_type === "deposit"
                          ? "Deposit"
                          : transaction.recipient_name || "Payment")}
                    </div>
                    <div className="text-sm text-muted-foreground">{formatDate(transaction.created_at)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div
                    className={
                      transaction.transaction_type === "deposit"
                        ? "text-primary font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {transaction.transaction_type === "deposit" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </div>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {transactions.length === 0 && (
              <div className="p-4 text-center text-sm text-muted-foreground">No transactions found</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
