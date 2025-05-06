"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatCurrency } from "@/lib/utils"
import { motion } from "framer-motion"

type TopMerchantsProps = {
  data: {
    merchant: string
    amount: number
    transactions: number
  }[]
}

export function TopMerchants({ data }: TopMerchantsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.3 }}
    >
      <Card>
        <CardHeader>
          <CardTitle>Top Merchants</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.map((item, index) => (
              <div key={item.merchant} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <div className="font-medium">{item.merchant}</div>
                    <div className="text-sm text-muted-foreground">{item.transactions} transactions</div>
                  </div>
                </div>
                <div className="font-medium">{formatCurrency(item.amount)}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
