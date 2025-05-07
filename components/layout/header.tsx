"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  CreditCard,
  Home,
  LogIn,
  LogOut,
  Moon,
  Search,
  Settings,
  Sun,
  TrendingUp,
  User,
  Wallet,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { useTheme } from "next-themes"
import type { Notification } from "@/lib/types"

type HeaderProps = {
  notifications: Notification[]
  isAuthenticated?: boolean
}

type SearchResult = {
  title: string
  description: string
  icon: React.ElementType
  href: string
}

export function Header({ notifications, isAuthenticated = false }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const router = useRouter()
  const supabase = getSupabaseBrowserClient()
  const { theme, setTheme } = useTheme()

  const unreadNotifications = notifications.filter((notification) => !notification.is_read)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  // Search functionality
  useEffect(() => {
    if (searchQuery.length > 1) {
      // Define search results based on the query
      const allResults: SearchResult[] = [
        {
          title: "Dashboard",
          description: "View your financial overview",
          icon: Home,
          href: "/dashboard",
        },
        {
          title: "Transactions",
          description: "View your transaction history",
          icon: Wallet,
          href: "/transactions",
        },
        {
          title: "Send Money",
          description: "Transfer funds to another account",
          icon: Wallet,
          href: "/payments/send",
        },
        {
          title: "Add Money",
          description: "Deposit funds to your account",
          icon: Wallet,
          href: "/payments/deposit",
        },
        {
          title: "Pay Bills",
          description: "Pay your monthly bills",
          icon: CreditCard,
          href: "/payments/bills",
        },
        {
          title: "Investments",
          description: "Manage your investment portfolio",
          icon: TrendingUp,
          href: "/invest",
        },
        {
          title: "Account Settings",
          description: "Manage your profile information",
          icon: User,
          href: "/account",
        },
        {
          title: "App Settings",
          description: "Customize application preferences",
          icon: Settings,
          href: "/settings",
        },
      ]

      // Filter results based on search query
      const filteredResults = allResults.filter(
        (result) =>
          result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          result.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )

      setSearchResults(filteredResults)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background px-4 shadow-sm md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold text-primary">Kohlawise</span>
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-end gap-4 md:justify-between">
        <div className="relative md:w-full md:max-w-sm">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-full pl-8 md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setIsSearchOpen(true)}
            />
            {searchQuery && (
              <Button variant="ghost" size="icon" className="absolute right-0 top-0" onClick={() => setSearchQuery("")}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          <AnimatePresence>
            {isSearchOpen && searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-md border bg-background shadow-md"
              >
                <div className="max-h-[300px] overflow-y-auto p-2">
                  {searchResults.map((result, index) => (
                    <Link
                      key={index}
                      href={result.href}
                      className="flex items-center gap-3 rounded-md px-3 py-2 hover:bg-muted"
                      onClick={() => {
                        setIsSearchOpen(false)
                        setSearchQuery("")
                      }}
                    >
                      <result.icon className="h-4 w-4 text-primary" />
                      <div>
                        <div className="font-medium">{result.title}</div>
                        <div className="text-xs text-muted-foreground">{result.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-4 w-4" />
                {unreadNotifications.length > 0 && (
                  <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-destructive" />
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <DropdownMenuItem key={notification.id} className="flex flex-col items-start">
                    <div className="font-medium">{notification.title}</div>
                    <div className="text-sm text-muted-foreground">{notification.message}</div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="p-4 text-center text-sm text-muted-foreground">No new notifications</div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* User menu with sign in/out options */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <User className="h-4 w-4" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated ? (
                <>
                  <DropdownMenuLabel>Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/account">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/settings">Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem asChild>
                    <Link href="/login">
                      <LogIn className="mr-2 h-4 w-4" />
                      Sign in
                    </Link>
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
