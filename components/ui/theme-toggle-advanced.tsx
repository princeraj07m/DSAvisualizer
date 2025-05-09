"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Monitor } from "lucide-react"
import { motion } from "framer-motion"

export function ThemeToggleAdvanced() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex items-center justify-center space-x-2 bg-secondary/50 backdrop-blur-sm rounded-full p-1">
      <Button
        variant="ghost"
        size="icon"
        className={`relative rounded-full ${
          theme === "light" ? "text-yellow-500 bg-secondary" : "text-muted-foreground"
        }`}
        onClick={() => setTheme("light")}
      >
        {theme === "light" && (
          <motion.div
            layoutId="theme-indicator"
            className="absolute inset-0 rounded-full bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        <Sun className="h-4 w-4 z-10" />
        <span className="sr-only">Light Mode</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`relative rounded-full ${theme === "dark" ? "text-blue-400 bg-secondary" : "text-muted-foreground"}`}
        onClick={() => setTheme("dark")}
      >
        {theme === "dark" && (
          <motion.div
            layoutId="theme-indicator"
            className="absolute inset-0 rounded-full bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        <Moon className="h-4 w-4 z-10" />
        <span className="sr-only">Dark Mode</span>
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`relative rounded-full ${
          theme === "system" ? "text-green-500 bg-secondary" : "text-muted-foreground"
        }`}
        onClick={() => setTheme("system")}
      >
        {theme === "system" && (
          <motion.div
            layoutId="theme-indicator"
            className="absolute inset-0 rounded-full bg-background"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
        )}
        <Monitor className="h-4 w-4 z-10" />
        <span className="sr-only">System Mode</span>
      </Button>
    </div>
  )
}
