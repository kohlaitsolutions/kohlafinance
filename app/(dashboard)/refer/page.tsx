"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Check, Copy, Gift, Share2, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function ReferPage() {
  const [copied, setCopied] = useState(false)
  const referralCode = "KOHLA-" + Math.random().toString(36).substring(2, 8).toUpperCase()
  const referralLink = `${process.env.NEXT_PUBLIC_SITE_URL || "https://kohlawise.com"}/signup?ref=${referralCode}`

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const referralHistory = [
    { name: "John Doe", date: "2023-05-15", status: "Registered" },
    { name: "Jane Smith", date: "2023-06-02", status: "Active" },
    { name: "Robert Johnson", date: "2023-06-10", status: "Pending" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Refer & Earn</h1>
        <p className="text-muted-foreground">Invite friends and earn rewards</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Invite Friends</CardTitle>
              <CardDescription>Share your referral link</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">3</span>
                <span className="ml-2 text-sm text-muted-foreground">Invites sent</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Rewards Earned</CardTitle>
              <CardDescription>Total rewards from referrals</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <Gift className="mr-2 h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">$25</span>
                <span className="ml-2 text-sm text-muted-foreground">Total rewards</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <Card className="card-hover">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Pending Invites</CardTitle>
              <CardDescription>Friends who haven't joined yet</CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="flex items-center">
                <Share2 className="mr-2 h-5 w-5 text-primary" />
                <span className="text-2xl font-bold">1</span>
                <span className="ml-2 text-sm text-muted-foreground">Pending invites</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Referral Link</CardTitle>
          <CardDescription>Share this link with friends to earn rewards</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Input value={referralLink} readOnly className="flex-1" />
            <Button variant="outline" size="icon" onClick={copyToClipboard}>
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            You'll earn $10 for each friend who signs up and makes their first transaction.
          </p>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:space-y-0">
          <Button>
            <Share2 className="mr-2 h-4 w-4" />
            Share via Email
          </Button>
          <div className="flex space-x-2">
            <Button variant="outline">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Facebook
            </Button>
            <Button variant="outline">
              <svg className="mr-2 h-4 w-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
              </svg>
              Twitter
            </Button>
          </div>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Referral History</CardTitle>
          <CardDescription>Track your referral status</CardDescription>
        </CardHeader>
        <CardContent>
          {referralHistory.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referralHistory.map((referral, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{referral.name}</TableCell>
                    <TableCell>{new Date(referral.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          referral.status === "Active"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : referral.status === "Pending"
                              ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                              : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {referral.status}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <Users className="h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No referrals yet</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Share your referral link with friends to start earning rewards.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
