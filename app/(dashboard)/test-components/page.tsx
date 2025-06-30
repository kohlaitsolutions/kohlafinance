"use client"

import { useState } from "react"
import { WelcomeCard } from "@/components/dashboard/welcome-card"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TestComponentsPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userName, setUserName] = useState("Demo User")

  const simulateLoading = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
    }, 3000)
  }

  const testNames = ["Demo User", "John Doe", "Sarah Johnson", "Alex Chen"]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Component Testing</h1>
          <p className="text-muted-foreground">Test WelcomeCard and DashboardSkeleton components</p>
        </div>
      </div>

      {/* Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Test Controls</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button onClick={simulateLoading} disabled={isLoading}>
              {isLoading ? "Loading..." : "Test Loading State"}
            </Button>
            {testNames.map((name) => (
              <Button
                key={name}
                variant="outline"
                onClick={() => setUserName(name)}
                className={userName === name ? "bg-primary text-primary-foreground" : ""}
              >
                {name}
              </Button>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Current user: <strong>{userName}</strong> | Loading state:{" "}
            <strong>{isLoading ? "Active" : "Inactive"}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Component Display */}
      {isLoading ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Dashboard Skeleton (Loading State)</h2>
          <DashboardSkeleton />
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Welcome Card</h2>
            <WelcomeCard userName={userName} />
          </div>

          {/* Additional Welcome Card Variations */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-lg font-medium mb-2">Morning Greeting</h3>
              <WelcomeCard userName="Morning User" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">No User Name</h3>
              <WelcomeCard />
            </div>
          </div>
        </div>
      )}

      {/* Component Information */}
      <Card>
        <CardHeader>
          <CardTitle>Component Features</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold text-green-600">✅ WelcomeCard Features:</h4>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Time-based greetings (Good morning/afternoon/evening)</li>
              <li>Personalized user name display</li>
              <li>Beautiful gradient background</li>
              <li>Portfolio performance indicators</li>
              <li>Responsive design with icons</li>
              <li>Fallback to "Demo User" when no name provided</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-blue-600">✅ DashboardSkeleton Features:</h4>
            <ul className="list-disc list-inside text-sm space-y-1 mt-2">
              <li>Realistic loading placeholders</li>
              <li>Matches actual dashboard layout</li>
              <li>Smooth skeleton animations</li>
              <li>Responsive grid layouts</li>
              <li>Professional loading experience</li>
              <li>Multiple skeleton variations</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
