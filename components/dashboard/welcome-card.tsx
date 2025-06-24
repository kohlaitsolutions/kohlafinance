"use client"

import { Card, CardContent } from "@/components/ui/card"

export interface WelcomeCardProps {
  userName?: string
}

export function WelcomeCard({ userName = "Guest" }: WelcomeCardProps) {
  return (
    <Card className="bg-muted/50">
      <CardContent className="p-6">
        <h2 className="text-2xl font-semibold">{`Welcome${userName ? `, ${userName}` : ""}!`}</h2>
        <p className="text-muted-foreground mt-2">Here’s a quick overview of your financial activity.</p>
      </CardContent>
    </Card>
  )
}
