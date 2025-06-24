"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@/lib/supabase/client"
import {
  Wallet,
  Shield,
  Target,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  CreditCard,
  PieChart,
  Bell,
  Loader2,
} from "lucide-react"

interface OnboardingStep {
  id: number
  title: string
  description: string
  icon: React.ReactNode
  content: React.ReactNode
  optional?: boolean
}

interface UserOnboardingProps {
  onComplete?: () => void
}

export function UserOnboarding({ onComplete }: UserOnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [completedSteps, setCompletedSteps] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const steps: OnboardingStep[] = [
    {
      id: 0,
      title: "Welcome to Kohlawise",
      description: "Let's get you started on your financial journey",
      icon: <Sparkles className="h-6 w-6" />,
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Wallet className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Your Financial Command Center</h3>
            <p className="text-muted-foreground">
              Kohlawise helps you track expenses, manage budgets, and achieve your financial goals with intelligent
              insights and automation.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Smart expense tracking</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Budget management</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Goal setting</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <span>Financial insights</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 1,
      title: "Set Up Your Account",
      description: "Connect your accounts and cards for automatic tracking",
      icon: <CreditCard className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Connect Your Accounts</h3>
            <p className="text-muted-foreground">
              Link your bank accounts and credit cards to automatically track your transactions and spending patterns.
            </p>
          </div>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                    <Wallet className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Bank Accounts</p>
                    <p className="text-sm text-muted-foreground">Checking, Savings, etc.</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-100 rounded flex items-center justify-center">
                    <CreditCard className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Credit Cards</p>
                    <p className="text-sm text-muted-foreground">Track spending and payments</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Connect
                </Button>
              </div>
            </div>
          </div>
          <div className="text-center">
            <Badge variant="secondary">🔒 Bank-level security guaranteed</Badge>
          </div>
        </div>
      ),
      optional: true,
    },
    {
      id: 2,
      title: "Secure Your Account",
      description: "Enable security features to protect your financial data",
      icon: <Shield className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <Shield className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure Your Account</h3>
            <p className="text-muted-foreground">
              Enable additional security features to keep your financial data safe and secure.
            </p>
          </div>
          <div className="space-y-4">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-orange-100 rounded flex items-center justify-center">
                    <Bell className="h-4 w-4 text-orange-600" />
                  </div>
                  <div>
                    <p className="font-medium">Login Alerts</p>
                    <p className="text-sm text-muted-foreground">Get notified of account access</p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Enable
                </Button>
              </div>
            </div>
          </div>
        </div>
      ),
      optional: true,
    },
    {
      id: 3,
      title: "Set Your Goals",
      description: "Define your financial objectives and track progress",
      icon: <Target className="h-6 w-6" />,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
              <Target className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Set Financial Goals</h3>
            <p className="text-muted-foreground">
              Define your financial objectives and let Kohlawise help you achieve them with smart recommendations.
            </p>
          </div>
          <div className="space-y-3">
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded flex items-center justify-center">
                  <Target className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium">Emergency Fund</p>
                  <p className="text-sm text-muted-foreground">Build a safety net for unexpected expenses</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                  <PieChart className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="font-medium">Investment Portfolio</p>
                  <p className="text-sm text-muted-foreground">Grow your wealth with smart investing</p>
                </div>
              </div>
            </div>
            <div className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="font-medium">Custom Goal</p>
                  <p className="text-sm text-muted-foreground">Set a personalized financial target</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      optional: true,
    },
    {
      id: 4,
      title: "You're All Set!",
      description: "Welcome to your financial command center",
      icon: <CheckCircle className="h-6 w-6" />,
      content: (
        <div className="text-center space-y-6">
          <div className="mx-auto w-24 h-24 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-white" />
          </div>
          <div>
            <h3 className="text-xl font-semibold mb-2">Welcome to Kohlawise!</h3>
            <p className="text-muted-foreground">
              Your account is ready. Start exploring your personalized financial dashboard and take control of your
              money.
            </p>
          </div>
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
            <h4 className="font-semibold mb-2">What's Next?</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Explore your dashboard</li>
              <li>• Add your first transaction</li>
              <li>• Set up budget categories</li>
              <li>• Review spending insights</li>
            </ul>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCompletedSteps([...completedSteps, currentStep])
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSkip = () => {
    handleNext()
  }

  const handleComplete = async () => {
    setIsLoading(true)

    try {
      // Update user onboarding status
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        await supabase
          .from("users")
          .update({
            onboarding_completed: true,
            onboarding_step: steps.length,
          })
          .eq("id", user.id)
      }

      if (onComplete) {
        onComplete()
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("Error completing onboarding:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              {currentStepData.icon}
              <span className="text-sm font-medium">
                Step {currentStep + 1} of {steps.length}
              </span>
              {currentStepData.optional && (
                <Badge variant="secondary" className="text-xs">
                  Optional
                </Badge>
              )}
            </div>
            <div className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</div>
          </div>
          <Progress value={progress} className="mb-4" />
          <CardTitle className="text-2xl">{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-8">{currentStepData.content}</div>

          <div className="flex items-center justify-between">
            <Button variant="outline" onClick={handlePrevious} disabled={currentStep === 0}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            <div className="flex space-x-2">
              {!isLastStep && currentStepData.optional && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip
                </Button>
              )}

              {isLastStep ? (
                <Button onClick={handleComplete} disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      Get Started
                      <Sparkles className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
