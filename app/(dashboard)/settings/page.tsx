"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateUserSettings } from "@/app/actions"

export default function SettingsPage() {
  const [settings] = useState({
    theme: "system",
    notification_preferences: {
      email: true,
      push: true,
      sms: false,
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your application preferences</p>
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card>
          <CardHeader>
            <CardTitle>Appearance</CardTitle>
            <CardDescription>Customize how the application looks</CardDescription>
          </CardHeader>
          <form action={updateUserSettings}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select name="theme" defaultValue={settings?.theme || "system"}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">
                      <div className="flex items-center gap-2">
                        <Sun className="h-4 w-4" />
                        <span>Light</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="dark">
                      <div className="flex items-center gap-2">
                        <Moon className="h-4 w-4" />
                        <span>Dark</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="system">
                      <span>System</span>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-4">
                <Label>Notification Preferences</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="emailNotifications"
                      name="emailNotifications"
                      defaultChecked={settings?.notification_preferences?.email}
                    />
                    <Label htmlFor="emailNotifications">Email notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="pushNotifications"
                      name="pushNotifications"
                      defaultChecked={settings?.notification_preferences?.push}
                    />
                    <Label htmlFor="pushNotifications">Push notifications</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="smsNotifications"
                      name="smsNotifications"
                      defaultChecked={settings?.notification_preferences?.sms}
                    />
                    <Label htmlFor="smsNotifications">SMS notifications</Label>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button type="submit">Save Preferences</Button>
            </CardFooter>
          </form>
        </Card>
      </motion.div>
    </div>
  )
}
