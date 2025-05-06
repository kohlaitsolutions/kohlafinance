"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Loader2 } from "lucide-react"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Simple timeout to show the loading animation briefly before redirecting
    const redirectTimer = setTimeout(() => {
      router.push("/dashboard")
    }, 1500) // 1.5 seconds delay for the animation

    return () => clearTimeout(redirectTimer)
  }, [router])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary/20 via-background to-primary/10 parallax-bg">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{
            duration: 1,
            ease: "easeOut",
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
            repeatDelay: 0.5,
          }}
          className="mb-8 text-6xl font-bold text-primary animate-float"
        >
          Kohlawise
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-xl text-muted-foreground mb-8"
        >
          Your modern financial companion
        </motion.p>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </motion.div>
    </div>
  )
}
