"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { updateUserSettings } from "@/app/actions"

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<any>(null)
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()

  useEffect(() => {
    async function loadSettings() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (!session) {
          router.push("/login")
          return
        }

        const { data } = await supabase.from("user_settings").select("*").eq("user_id", session.user.id).single()

        setSettings(
          data || {
            theme: "system",
            notification_preferences: {
              email: true,
              push: true,
              sms: false,
            },
          },
        )
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [router, supabase])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

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
