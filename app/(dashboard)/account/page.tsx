"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateUserProfile } from "@/app/actions"

export default function AccountPage() {
  const [userData] = useState({
    first_name: "Demo",
    last_name: "User",
    email: "demo@kohlawise.com",
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal information</CardDescription>
          </CardHeader>
          <form action={updateUserProfile}>
            <CardContent className="space-y-4">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="flex h-24 w-24 items-center justify-center rounded-full bg-primary/10">
                    <User className="h-12 w-12 text-primary" />
                  </div>
                  <Button size="sm" className="absolute bottom-0 right-0 rounded-full">
                    Change
                  </Button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" name="firstName" defaultValue={userData?.first_name || ""} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" name="lastName" defaultValue={userData?.last_name || ""} />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={userData?.email || ""} />
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Changes</Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
