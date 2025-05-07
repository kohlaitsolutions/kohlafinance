"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card"
import { LoginForm } from "@/components/auth/login-form"
import { RegisterForm } from "@/components/auth/register-form"

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState("login")

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <Link href="/" className="inline-block">
          <h1 className="text-4xl font-bold text-primary">Kohlawise</h1>
        </Link>
        <p className="mt-2 text-muted-foreground">Your modern financial companion</p>
      </motion.div>

      <Card className="w-full max-w-md glassmorphism">
        <CardHeader>
          <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="register">Sign Up</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <TabsContent value="login" className="mt-0">
            <CardDescription className="mb-4 text-center">Sign in to your account</CardDescription>
            <LoginForm />
          </TabsContent>
          <TabsContent value="register" className="mt-0">
            <CardDescription className="mb-4 text-center">Create a new account</CardDescription>
            <RegisterForm />
          </TabsContent>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="text-center text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline underline-offset-4 hover:text-primary">
              Privacy Policy
            </Link>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
