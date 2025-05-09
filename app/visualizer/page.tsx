"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ThemeToggleAdvanced } from "@/components/ui/theme-toggle-advanced"
import { Github, Sparkles, BookOpen, Home, Info } from "lucide-react"
import { ArrayVisualizer } from "@/components/visualizers/array-visualizer"
import { LinkedListVisualizer } from "@/components/visualizers/linked-list-visualizer"
import { StackQueueVisualizer } from "@/components/visualizers/stack-queue-visualizer"
import { TreeVisualizer } from "@/components/visualizers/tree-visualizer"
import { GraphVisualizer } from "@/components/visualizers/graph-visualizer"
import { HeapVisualizer } from "@/components/visualizers/heap-visualizer"
import { HashTableVisualizer } from "@/components/visualizers/hash-table-visualizer"
import { Confetti } from "@/components/ui/confetti"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function VisualizerPage() {
  const [activeTab, setActiveTab] = useState("arrays")
  const [showConfetti, setShowConfetti] = useState(false)

  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setShowConfetti(true)
    setTimeout(() => setShowConfetti(false), 3000)
  }

  return (
    <div className="flex min-h-screen flex-col">
      {showConfetti && <Confetti />}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-xl flex items-center gap-2">
              <motion.span
                className="text-primary"
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  repeatType: "reverse",
                  ease: "easeInOut",
                }}
              >
                DSA
              </motion.span>
              <span className="gradient-heading">Visualizer</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center space-x-1">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                      <Link href="/" className="flex items-center gap-1">
                        <Home className="h-4 w-4" />
                        <span className="hidden lg:inline">Home</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Go to Home</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                      <Link href="/learn" className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span className="hidden lg:inline">Learn</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Learn DSA Concepts</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                      <Link href="/about" className="flex items-center gap-1">
                        <Info className="h-4 w-4" />
                        <span className="hidden lg:inline">About</span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>About this Project</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <Button variant="outline" size="sm" asChild className="button-glow">
              <Link href="https://github.com" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <span className="hidden md:inline">GitHub</span>
              </Link>
            </Button>
            <ThemeToggleAdvanced />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <motion.h1
              className="text-3xl font-bold tracking-tight gradient-heading"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Data Structures & Algorithms Visualizer
            </motion.h1>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Explore and understand DSA concepts through interactive visualizations
            </motion.p>
          </div>

          <Card className="border-primary/20 bg-primary/5 p-4 mb-6">
            <CardContent className="p-0 text-sm">
              <p>
                Select a data structure below to visualize its operations. The visualization will appear at the top,
                with controls in the middle and code implementation at the bottom.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="arrays" value={activeTab} onValueChange={handleTabChange} className="w-full">
            <div className="relative">
              <motion.div
                className="absolute -top-10 -right-10 text-yellow-500 dark:text-yellow-400 animate-pulse"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Sparkles className="h-8 w-8" />
              </motion.div>
              <TabsList className="grid grid-cols-4 md:grid-cols-7 w-full max-w-4xl mx-auto">
                <TabsTrigger value="arrays" className="relative overflow-hidden group">
                  <span className="relative z-10">Arrays</span>
                  <span className="absolute inset-0 bg-datastructure-array opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                </TabsTrigger>
                <TabsTrigger value="linked-lists" className="relative overflow-hidden group">
                  <span className="relative z-10">Linked Lists</span>
                  <span className="absolute inset-0 bg-datastructure-linkedlist opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                </TabsTrigger>
                <TabsTrigger value="stack-queue" className="relative overflow-hidden group">
                  <span className="relative z-10">Stack & Queue</span>
                  <span className="absolute inset-0 bg-datastructure-stack opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                </TabsTrigger>
                <TabsTrigger value="trees" className="relative overflow-hidden group">
                  <span className="relative z-10">Trees</span>
                  <span className="absolute inset-0 bg-datastructure-tree opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                </TabsTrigger>
                <TabsTrigger value="graphs" className="relative overflow-hidden group">
                  <span className="relative z-10">Graphs</span>
                  <span className="absolute inset-0 bg-datastructure-graph opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                </TabsTrigger>
                <TabsTrigger value="heaps" className="relative overflow-hidden group">
                  <span className="relative z-10">Heaps</span>
                  <span className="absolute inset-0 bg-datastructure-heap opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                </TabsTrigger>
                <TabsTrigger value="hash-tables" className="relative overflow-hidden group">
                  <span className="relative z-10">Hash Tables</span>
                  <span className="absolute inset-0 bg-datastructure-hash opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                </TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="arrays" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <ArrayVisualizer />
              </motion.div>
            </TabsContent>
            <TabsContent value="linked-lists" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <LinkedListVisualizer />
              </motion.div>
            </TabsContent>
            <TabsContent value="stack-queue" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <StackQueueVisualizer />
              </motion.div>
            </TabsContent>
            <TabsContent value="trees" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <TreeVisualizer />
              </motion.div>
            </TabsContent>
            <TabsContent value="graphs" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <GraphVisualizer />
              </motion.div>
            </TabsContent>
            <TabsContent value="heaps" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <HeapVisualizer />
              </motion.div>
            </TabsContent>
            <TabsContent value="hash-tables" className="mt-6">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <HashTableVisualizer />
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 DSA Visualizer. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/about"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-primary transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-primary transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              className="text-sm text-muted-foreground underline-offset-4 hover:underline hover:text-primary transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
