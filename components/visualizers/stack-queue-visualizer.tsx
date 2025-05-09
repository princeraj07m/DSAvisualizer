"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, RotateCcw, ArrowDown, ArrowUp, Code, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function StackQueueVisualizer() {
  const [stack, setStack] = useState<number[]>([40, 30, 20, 10])
  const [queue, setQueue] = useState<number[]>([10, 20, 30, 40])
  const [inputValue, setInputValue] = useState("")
  const [operation, setOperation] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState("stack")
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null)
  const [showCode, setShowCode] = useState(false)

  // Reset data structures
  const resetStructures = () => {
    setStack([40, 30, 20, 10])
    setQueue([10, 20, 30, 40])
    setMessage(null)
    setHighlightIndex(null)
  }

  // Stack operations
  const pushToStack = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      setMessage("Please enter a valid number")
      return
    }

    setOperation("push")
    setStack((prev) => [value, ...prev])
    setInputValue("")
    setMessage(`Pushed ${value} to stack`)
    setHighlightIndex(0)

    // Clear highlight after animation
    setTimeout(() => {
      setHighlightIndex(null)
    }, 2000)
  }

  const popFromStack = () => {
    if (stack.length === 0) {
      setMessage("Stack is empty")
      return
    }

    setOperation("pop")
    setHighlightIndex(0)

    // Pop after animation
    setTimeout(() => {
      const value = stack[0]
      setStack((prev) => prev.slice(1))
      setMessage(`Popped ${value} from stack`)
      setHighlightIndex(null)
    }, 1000)
  }

  // Queue operations
  const enqueue = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      setMessage("Please enter a valid number")
      return
    }

    setOperation("enqueue")
    setQueue((prev) => [...prev, value])
    setInputValue("")
    setMessage(`Enqueued ${value}`)
    setHighlightIndex(queue.length)

    // Clear highlight after animation
    setTimeout(() => {
      setHighlightIndex(null)
    }, 2000)
  }

  const dequeue = () => {
    if (queue.length === 0) {
      setMessage("Queue is empty")
      return
    }

    setOperation("dequeue")
    setHighlightIndex(0)

    // Dequeue after animation
    setTimeout(() => {
      const value = queue[0]
      setQueue((prev) => prev.slice(1))
      setMessage(`Dequeued ${value}`)
      setHighlightIndex(null)
    }, 1000)
  }

  // Get code implementation
  const getCodeImplementation = () => {
    if (currentTab === "stack") {
      return `class Stack {
  constructor() {
    this.items = [];
  }
  
  // Push element to the top of stack - O(1)
  push(element) {
    this.items.push(element);
  }
  
  // Remove and return the top element - O(1)
  pop() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.pop();
  }
  
  // Return the top element without removing - O(1)
  peek() {
    if (this.isEmpty()) {
      return "Stack is empty";
    }
    return this.items[this.items.length - 1];
  }
  
  // Check if stack is empty - O(1)
  isEmpty() {
    return this.items.length === 0;
  }
  
  // Return the size of stack - O(1)
  size() {
    return this.items.length;
  }
  
  // Clear the stack - O(1)
  clear() {
    this.items = [];
  }
}`
    } else {
      return `class Queue {
  constructor() {
    this.items = [];
  }
  
  // Add element to the end of queue - O(1)
  enqueue(element) {
    this.items.push(element);
  }
  
  // Remove and return the front element - O(n)
  dequeue() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.shift();
  }
  
  // Return the front element without removing - O(1)
  front() {
    if (this.isEmpty()) {
      return "Queue is empty";
    }
    return this.items[0];
  }
  
  // Check if queue is empty - O(1)
  isEmpty() {
    return this.items.length === 0;
  }
  
  // Return the size of queue - O(1)
  size() {
    return this.items.length;
  }
  
  // Clear the queue - O(1)
  clear() {
    this.items = [];
  }
}`
    }
  }

  // Render stack
  const renderStack = () => {
    if (stack.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">Stack is empty</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-end h-64 border rounded-md bg-muted/50 p-4">
        {stack.map((value, index) => (
          <motion.div
            key={index}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            className={`
              w-full max-w-xs p-3 mb-2 border rounded-md text-center
              ${
                index === highlightIndex
                  ? operation === "push"
                    ? "bg-green-100 dark:bg-green-900 border-green-500"
                    : operation === "pop"
                      ? "bg-red-100 dark:bg-red-900 border-red-500"
                      : "bg-background border-border"
                  : "bg-background border-border"
              }
              transition-all duration-300 hover:shadow-ds-stack
            `}
          >
            <span className="font-mono">{value}</span>
          </motion.div>
        ))}
        <div className="mt-2 flex items-center">
          <ArrowUp className="h-5 w-5 text-datastructure-stack" />
          <span className="ml-1 text-sm text-muted-foreground">Top of Stack</span>
        </div>
      </div>
    )
  }

  // Render queue
  const renderQueue = () => {
    if (queue.length === 0) {
      return (
        <div className="flex items-center justify-center h-64 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">Queue is empty</p>
        </div>
      )
    }

    return (
      <div className="flex flex-col items-center justify-center h-64 border rounded-md bg-muted/50 p-4">
        <div className="flex items-center mb-2">
          <span className="mr-1 text-sm text-muted-foreground">Front</span>
          <ArrowDown className="h-5 w-5 text-datastructure-queue" />
        </div>
        <div className="flex overflow-x-auto w-full justify-center">
          {queue.map((value, index) => (
            <motion.div
              key={index}
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`
                min-w-16 p-3 mx-1 border rounded-md text-center
                ${
                  index === highlightIndex
                    ? operation === "enqueue"
                      ? "bg-green-100 dark:bg-green-900 border-green-500"
                      : operation === "dequeue"
                        ? "bg-red-100 dark:bg-red-900 border-red-500"
                        : "bg-background border-border"
                    : "bg-background border-border"
                }
                transition-all duration-300 hover:shadow-ds-queue
              `}
            >
              <span className="font-mono">{value}</span>
            </motion.div>
          ))}
        </div>
        <div className="flex items-center mt-2">
          <span className="mr-1 text-sm text-muted-foreground">Rear</span>
          <ArrowDown className="h-5 w-5 text-datastructure-queue" />
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6">
      {/* Visualization Section - Now at the top */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className={`ds-card ${currentTab === "stack" ? "ds-card-stack" : "ds-card-queue"} overflow-hidden`}>
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle>{currentTab === "stack" ? "Stack" : "Queue"} Visualization</CardTitle>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowCode(!showCode)}
                        className={`hover:bg-${currentTab === "stack" ? "datastructure-stack" : "datastructure-queue"}/20`}
                      >
                        <Code className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{showCode ? "Hide" : "Show"} Code Implementation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <CardDescription>
              Visual representation of the{" "}
              {currentTab === "stack" ? "LIFO (Last In, First Out)" : "FIFO (First In, First Out)"} data structure
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {currentTab === "stack" ? renderStack() : renderQueue()}
            <div className="mt-4 flex justify-end">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge
                    variant="outline"
                    className={`bg-${currentTab === "stack" ? "datastructure-stack" : "datastructure-queue"}/10 border-${currentTab === "stack" ? "datastructure-stack" : "datastructure-queue"}/20`}
                  >
                    {message}
                  </Badge>
                </motion.div>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Controls Section - In the middle */}
      <div className="grid gap-4 md:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className={`ds-card ${currentTab === "stack" ? "ds-card-stack" : "ds-card-queue"} h-full`}>
            <CardHeader>
              <CardTitle>Operations</CardTitle>
              <CardDescription>Perform operations on the {currentTab}</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={currentTab}
                onValueChange={(value) => {
                  setCurrentTab(value)
                  setMessage(null)
                  setHighlightIndex(null)
                }}
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="stack" className="relative overflow-hidden group">
                    <span className="relative z-10">Stack</span>
                    <span className="absolute inset-0 bg-datastructure-stack opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                  </TabsTrigger>
                  <TabsTrigger value="queue" className="relative overflow-hidden group">
                    <span className="relative z-10">Queue</span>
                    <span className="absolute inset-0 bg-datastructure-queue opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="stack" className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter a value"
                      type="number"
                      className="transition-all focus:ring-2 focus:ring-datastructure-stack"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={pushToStack}
                            className="bg-datastructure-stack hover:bg-datastructure-stack/80 transition-all duration-300 hover:shadow-ds-stack"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Push
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add an element to the top of the stack</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={popFromStack}
                            className="bg-datastructure-stack hover:bg-datastructure-stack/80 transition-all duration-300 hover:shadow-ds-stack"
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            Pop
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove the top element from the stack</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TabsContent>

                <TabsContent value="queue" className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter a value"
                      type="number"
                      className="transition-all focus:ring-2 focus:ring-datastructure-queue"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={enqueue}
                            className="bg-datastructure-queue hover:bg-datastructure-queue/80 transition-all duration-300 hover:shadow-ds-queue"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Enqueue
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Add an element to the end of the queue</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={dequeue}
                            className="bg-datastructure-queue hover:bg-datastructure-queue/80 transition-all duration-300 hover:shadow-ds-queue"
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            Dequeue
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Remove the front element from the queue</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        onClick={resetStructures}
                        className={`hover:border-${currentTab === "stack" ? "datastructure-stack" : "datastructure-queue"} hover:text-${currentTab === "stack" ? "datastructure-stack" : "datastructure-queue"}`}
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset the {currentTab} to its initial state</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className={`ds-card ${currentTab === "stack" ? "ds-card-stack" : "ds-card-queue"} h-full`}>
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
              <CardDescription>Code implementation and complexity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Complexity Analysis</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div
                      className={`flex flex-col p-3 border rounded-md hover:shadow-ds-${currentTab === "stack" ? "stack" : "queue"} transition-all duration-300`}
                    >
                      <span className="text-sm text-muted-foreground">Time Complexity</span>
                      <span className="font-mono font-bold">
                        {currentTab === "stack" ? "O(1)" : operation === "enqueue" ? "O(1)" : "O(n)"}
                      </span>
                    </div>
                    <div
                      className={`flex flex-col p-3 border rounded-md hover:shadow-ds-${currentTab === "stack" ? "stack" : "queue"} transition-all duration-300`}
                    >
                      <span className="text-sm text-muted-foreground">Space Complexity</span>
                      <span className="font-mono font-bold">O(n)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                      <AccordionTrigger
                        className={`hover:text-${currentTab === "stack" ? "datastructure-stack" : "datastructure-queue"}`}
                      >
                        <div className="flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          {currentTab === "stack" ? "Stack" : "Queue"} Description
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {currentTab === "stack" ? (
                          <p className="text-sm text-muted-foreground">
                            A stack is a linear data structure that follows the Last In, First Out (LIFO) principle. The
                            last element added to the stack is the first one to be removed. Think of it like a stack of
                            plates - you can only take the top plate off. Common operations include push (add to top),
                            pop (remove from top), and peek (view top without removing).
                          </p>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            A queue is a linear data structure that follows the First In, First Out (FIFO) principle.
                            The first element added to the queue is the first one to be removed. Think of it like a line
                            of people - the first person in line is the first to be served. Common operations include
                            enqueue (add to rear), dequeue (remove from front), and peek (view front without removing).
                          </p>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Code Implementation Section - At the bottom */}
      {showCode && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className={`ds-card ${currentTab === "stack" ? "ds-card-stack" : "ds-card-queue"}`}>
            <CardHeader>
              <CardTitle>Code Implementation</CardTitle>
              <CardDescription>
                JavaScript implementation of {currentTab === "stack" ? "Stack" : "Queue"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={getCodeImplementation()} language="javascript" />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
