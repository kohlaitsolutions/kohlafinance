"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Send, X, ChevronDown, Sparkles } from "lucide-react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

const formSchema = z.object({
  message: z.string().min(1, "Please enter a message"),
})

type Message = {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export function FinancialAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI financial assistant. How can I help you with your finances today?",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "",
    },
  })

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    const userMessage: Message = {
      role: "user",
      content: values.message,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    form.reset()
    setIsLoading(true)

    // Simulate AI response with a delay
    setTimeout(() => {
      const responses = [
        "Based on your spending patterns, I recommend setting aside 20% of your income for savings.",
        "Looking at your recent transactions, you might want to reduce spending on dining out to meet your savings goals.",
        "Your investment portfolio is well-balanced, but you might consider increasing your exposure to index funds.",
        "I notice you have some recurring subscriptions that you rarely use. Consider canceling them to save money.",
        "Based on your income and expenses, you could increase your retirement contributions by 3% without impacting your lifestyle.",
      ]

      const assistantMessage: Message = {
        role: "assistant",
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="mb-2"
            >
              <Card className="w-80 md:w-96 shadow-lg">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg flex items-center">
                      <Sparkles className="h-4 w-4 mr-2 text-primary" />
                      Financial Assistant
                    </CardTitle>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="h-80 overflow-y-auto">
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={cn("flex flex-col", message.role === "user" ? "items-end" : "items-start")}
                      >
                        <div
                          className={cn(
                            "max-w-[80%] rounded-lg px-3 py-2 text-sm",
                            message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                          )}
                        >
                          {message.content}
                        </div>
                        <span className="text-xs text-muted-foreground mt-1">
                          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex items-start">
                        <div className="bg-muted max-w-[80%] rounded-lg px-3 py-2 text-sm">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"
                              style={{ animationDelay: "0.4s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="flex w-full items-center space-x-2">
                      <FormField
                        control={form.control}
                        name="message"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormControl>
                              <Input placeholder="Ask a financial question..." {...field} disabled={isLoading} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button type="submit" size="icon" disabled={isLoading}>
                        <Send className="h-4 w-4" />
                      </Button>
                    </form>
                  </Form>
                </CardFooter>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="rounded-full h-12 w-12 shadow-lg"
          variant={isOpen ? "secondary" : "default"}
        >
          {isOpen ? <ChevronDown className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </Button>
      </div>
    </>
  )
}
