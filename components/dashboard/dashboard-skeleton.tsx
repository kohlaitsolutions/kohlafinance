"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Welcome Card Skeleton */}
      <Card className="bg-gradient-to-r from-gray-200 to-gray-300 border-0">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded-full bg-white/50" />
                <Skeleton className="h-6 w-32 rounded-full bg-white/50" />
              </div>
              <Skeleton className="h-8 w-48 bg-white/50" />
              <Skeleton className="h-4 w-64 bg-white/50" />
            </div>
            <Skeleton className="h-14 w-14 rounded-full bg-white/50" />
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-4 w-40 bg-white/50" />
            <Skeleton className="h-4 w-36 bg-white/50" />
            <Skeleton className="h-4 w-32 bg-white/50" />
          </div>
        </CardContent>
      </Card>

      {/* Account Cards Skeleton */}
      <div className="grid gap-6 md:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-6 rounded" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-8 w-36" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="mt-4 flex justify-between">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-4 w-12" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions Skeleton */}
      <Card>
        <CardHeader className="pb-4">
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex flex-col items-center p-4 space-y-3 rounded-lg border border-gray-100">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-3 w-16" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout for Transactions and Insights */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Transactions Skeleton */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-16" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-3 w-12" />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Spending Summary Skeleton */}
        <Card>
          <CardHeader className="pb-4">
            <Skeleton className="h-6 w-36" />
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* Chart area */}
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="space-y-2 text-center">
                  <Skeleton className="h-4 w-32 mx-auto" />
                  <Skeleton className="h-3 w-24 mx-auto" />
                </div>
              </div>

              {/* Legend */}
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-3 w-3 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
