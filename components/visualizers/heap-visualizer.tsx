"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, RotateCcw } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border"
import { motion } from "framer-motion"

interface HeapNode {
  value: number
  highlight?: "active" | "new" | "removed" | "root" | "leaf"
}

export function HeapVisualizer() {
  const [heap, setHeap] = useState<HeapNode[]>([])
  const [inputValue, setInputValue] = useState("")
  const [operation, setOperation] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState("insert")
  const [heapType, setHeapType] = useState<"min" | "max">("max")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showTooltips, setShowTooltips] = useState(true)

  // Initialize heap
  const initializeHeap = () => {
    const initialHeap: HeapNode[] = [
      { value: 100, highlight: "root" },
      { value: 80 },
      { value: 70 },
      { value: 50 },
      { value: 60 },
      { value: 30 },
      { value: 20 },
    ]
    setHeap(initialHeap)
    setMessage(null)
  }

  // Reset heap
  const resetHeap = () => {
    initializeHeap()
  }

  // Insert a node
  const insertNode = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      setMessage("Please enter a valid number")
      return
    }

    setOperation("insert")
    const newHeap = [...heap, { value, highlight: "new" }]

    // Heapify up
    heapifyUp(newHeap, newHeap.length - 1)

    setHeap(newHeap)
    setInputValue("")
    setMessage(`Inserted ${value}`)

    // Clear highlight after animation
    setTimeout(() => {
      setHeap((prev) => {
        return prev.map((node, index) => ({
          ...node,
          highlight: index === 0 ? "root" : undefined,
        }))
      })
    }, 2000)
  }

  // Extract root node
  const extractRoot = () => {
    if (heap.length === 0) {
      setMessage("Heap is empty")
      return
    }

    setOperation("extract")

    // Highlight the root to be removed
    setHeap((prev) => {
      const newHeap = [...prev]
      if (newHeap.length > 0) {
        newHeap[0] = { ...newHeap[0], highlight: "removed" }
      }
      return newHeap
    })

    // Extract after animation
    setTimeout(() => {
      const newHeap = [...heap]
      const root = newHeap[0].value

      // Replace root with last element
      if (newHeap.length > 1) {
        newHeap[0] = { ...newHeap[newHeap.length - 1], highlight: "active" }
        newHeap.pop()

        // Heapify down
        heapifyDown(newHeap, 0)
      } else {
        newHeap.pop()
      }

      setHeap(newHeap)
      setMessage(`Extracted ${root}`)

      // Clear highlight after animation
      setTimeout(() => {
        setHeap((prev) => {
          return prev.map((node, index) => ({
            ...node,
            highlight: index === 0 ? "root" : undefined,
          }))
        })
      }, 2000)
    }, 1000)
  }

  // Heapify up (for max heap)
  const heapifyUp = (heapArray: HeapNode[], index: number) => {
    if (index <= 0) return

    const parentIndex = Math.floor((index - 1) / 2)

    // For max heap
    if (heapType === "max") {
      if (heapArray[parentIndex].value < heapArray[index].value) {
        // Swap
        ;[heapArray[parentIndex], heapArray[index]] = [heapArray[index], heapArray[parentIndex]]
        heapArray[parentIndex].highlight = "active"

        // Continue heapifying up
        heapifyUp(heapArray, parentIndex)
      }
    }
    // For min heap
    else {
      if (heapArray[parentIndex].value > heapArray[index].value) {
        // Swap
        ;[heapArray[parentIndex], heapArray[index]] = [heapArray[index], heapArray[parentIndex]]
        heapArray[parentIndex].highlight = "active"

        // Continue heapifying up
        heapifyUp(heapArray, parentIndex)
      }
    }
  }

  // Heapify down (for max heap)
  const heapifyDown = (heapArray: HeapNode[], index: number) => {
    const leftChildIndex = 2 * index + 1
    const rightChildIndex = 2 * index + 2
    let largestOrSmallestIndex = index

    if (heapType === "max") {
      // For max heap
      if (
        leftChildIndex < heapArray.length &&
        heapArray[leftChildIndex].value > heapArray[largestOrSmallestIndex].value
      ) {
        largestOrSmallestIndex = leftChildIndex
      }

      if (
        rightChildIndex < heapArray.length &&
        heapArray[rightChildIndex].value > heapArray[largestOrSmallestIndex].value
      ) {
        largestOrSmallestIndex = rightChildIndex
      }
    } else {
      // For min heap
      if (
        leftChildIndex < heapArray.length &&
        heapArray[leftChildIndex].value < heapArray[largestOrSmallestIndex].value
      ) {
        largestOrSmallestIndex = leftChildIndex
      }

      if (
        rightChildIndex < heapArray.length &&
        heapArray[rightChildIndex].value < heapArray[largestOrSmallestIndex].value
      ) {
        largestOrSmallestIndex = rightChildIndex
      }
    }

    if (largestOrSmallestIndex !== index) {
      // Swap
      ;[heapArray[index], heapArray[largestOrSmallestIndex]] = [heapArray[largestOrSmallestIndex], heapArray[index]]
      heapArray[largestOrSmallestIndex].highlight = "active"

      // Continue heapifying down
      heapifyDown(heapArray, largestOrSmallestIndex)
    }
  }

  // Toggle heap type
  const toggleHeapType = () => {
    const newType = heapType === "max" ? "min" : "max"
    setHeapType(newType)

    // Rebuild the heap with the new type
    const newHeap = [...heap.map((node) => ({ value: node.value }))]

    // Build heap from scratch
    for (let i = Math.floor(newHeap.length / 2) - 1; i >= 0; i--) {
      heapifyDown(newHeap, i)
    }

    // Set root highlight
    if (newHeap.length > 0) {
      newHeap[0].highlight = "root"
    }

    setHeap(newHeap)
    setMessage(`Switched to ${newType} heap`)
  }

  // Draw heap on canvas
  useEffect(() => {
    if (!canvasRef.current || heap.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate node positions
    const nodeRadius = 25
    const levelHeight = 80
    const calculatePositions = () => {
      const positions: { x: number; y: number }[] = []

      for (let i = 0; i < heap.length; i++) {
        const level = Math.floor(Math.log2(i + 1))
        const nodesInLevel = Math.pow(2, level)
        const position = i - Math.pow(2, level) + 1

        const x = canvas.width / 2 + (position - nodesInLevel / 2 + 0.5) * (canvas.width / (nodesInLevel + 1))
        const y = (level + 1) * levelHeight

        positions.push({ x, y })
      }

      return positions
    }

    const positions = calculatePositions()

    // Draw edges
    for (let i = 0; i < heap.length; i++) {
      const leftChildIndex = 2 * i + 1
      const rightChildIndex = 2 * i + 2

      if (leftChildIndex < heap.length) {
        ctx.beginPath()
        ctx.moveTo(positions[i].x, positions[i].y)
        ctx.lineTo(positions[leftChildIndex].x, positions[leftChildIndex].y)
        ctx.strokeStyle = "#888"
        ctx.lineWidth = 2
        ctx.stroke()
      }

      if (rightChildIndex < heap.length) {
        ctx.beginPath()
        ctx.moveTo(positions[i].x, positions[i].y)
        ctx.lineTo(positions[rightChildIndex].x, positions[rightChildIndex].y)
        ctx.strokeStyle = "#888"
        ctx.lineWidth = 2
        ctx.stroke()
      }
    }

    // Draw nodes
    for (let i = 0; i < heap.length; i++) {
      const node = heap[i]
      const { x, y } = positions[i]

      // Draw circle
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2)

      // Set fill color based on highlight
      if (node.highlight === "active") {
        ctx.fillStyle = "#3b82f6"
      } else if (node.highlight === "new") {
        ctx.fillStyle = "#22c55e"
      } else if (node.highlight === "removed") {
        ctx.fillStyle = "#ef4444"
      } else if (node.highlight === "root") {
        ctx.fillStyle = "#f59e0b"
      } else {
        ctx.fillStyle = "#f1f5f9"
      }

      ctx.fill()
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw value
      ctx.fillStyle =
        node.highlight === "active" || node.highlight === "new" || node.highlight === "root" ? "#ffffff" : "#1e293b"
      ctx.font = "14px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.value.toString(), x, y)
    }
  }, [heap])

  // Get heap code
  const getHeapCode = () => {
    if (heapType === "max") {
      return `class MaxHeap {
  constructor() {
    this.heap = [];
  }
  
  // Get parent index
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
  
  // Get left child index
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }
  
  // Get right child index
  getRightChildIndex(index) {
    return 2 * index + 2;
  }
  
  // Swap elements
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = 
    [this.heap[index2], this.heap[index1]];
  }
  
  // Insert element - O(log n)
  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }
  
  // Heapify up
  heapifyUp(index) {
    if (index <= 0) return;
    
    const parentIndex = this.getParentIndex(index);
    
    // For max heap, parent should be greater than children
    if (this.heap[parentIndex] < this.heap[index]) {
      this.swap(parentIndex, index);
      this.heapifyUp(parentIndex);
    }
  }
  
  // Extract max element - O(log n)
  extractMax() {
    if (this.heap.length === 0) return null;
    
    const max = this.heap[0];
    const last = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    
    return max;
  }
  
  // Heapify down
  heapifyDown(index) {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let largestIndex = index;
    
    // Find the largest among the node and its children
    if (leftChildIndex < this.heap.length && 
        this.heap[leftChildIndex] > this.heap[largestIndex]) {
      largestIndex = leftChildIndex;
    }
    
    if (rightChildIndex < this.heap.length && 
        this.heap[rightChildIndex] > this.heap[largestIndex]) {
      largestIndex = rightChildIndex;
    }
    
    // If largest is not the current node, swap and continue heapifying
    if (largestIndex !== index) {
      this.swap(index, largestIndex);
      this.heapifyDown(largestIndex);
    }
  }
  
  // Peek at the max element without removing - O(1)
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }
  
  // Get heap size - O(1)
  size() {
    return this.heap.length;
  }
}`
    } else {
      return `class MinHeap {
  constructor() {
    this.heap = [];
  }
  
  // Get parent index
  getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }
  
  // Get left child index
  getLeftChildIndex(index) {
    return 2 * index + 1;
  }
  
  // Get right child index
  getRightChildIndex(index) {
    return 2 * index + 2;
  }
  
  // Swap elements
  swap(index1, index2) {
    [this.heap[index1], this.heap[index2]] = 
    [this.heap[index2], this.heap[index1]];
  }
  
  // Insert element - O(log n)
  insert(value) {
    this.heap.push(value);
    this.heapifyUp(this.heap.length - 1);
  }
  
  // Heapify up
  heapifyUp(index) {
    if (index <= 0) return;
    
    const parentIndex = this.getParentIndex(index);
    
    // For min heap, parent should be smaller than children
    if (this.heap[parentIndex] > this.heap[index]) {
      this.swap(parentIndex, index);
      this.heapifyUp(parentIndex);
    }
  }
  
  // Extract min element - O(log n)
  extractMin() {
    if (this.heap.length === 0) return null;
    
    const min = this.heap[0];
    const last = this.heap.pop();
    
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.heapifyDown(0);
    }
    
    return min;
  }
  
  // Heapify down
  heapifyDown(index) {
    const leftChildIndex = this.getLeftChildIndex(index);
    const rightChildIndex = this.getRightChildIndex(index);
    let smallestIndex = index;
    
    // Find the smallest among the node and its children
    if (leftChildIndex < this.heap.length && 
        this.heap[leftChildIndex] < this.heap[smallestIndex]) {
      smallestIndex = leftChildIndex;
    }
    
    if (rightChildIndex < this.heap.length && 
        this.heap[rightChildIndex] < this.heap[smallestIndex]) {
      smallestIndex = rightChildIndex;
    }
    
    // If smallest is not the current node, swap and continue heapifying
    if (smallestIndex !== index) {
      this.swap(index, smallestIndex);
      this.heapifyDown(smallestIndex);
    }
  }
  
  // Peek at the min element without removing - O(1)
  peek() {
    return this.heap.length > 0 ? this.heap[0] : null;
  }
  
  // Get heap size - O(1)
  size() {
    return this.heap.length;
  }
}`
    }
  }

  // Initialize on first render
  if (heap.length === 0) {
    initializeHeap()
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <AnimatedGradientBorder className="rounded-lg">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Heap Operations</span>
                <Badge
                  variant="outline"
                  className={`${heapType === "max" ? "bg-datastructure-heap/20" : "bg-datastructure-tree/20"} cursor-pointer transition-all hover:scale-105`}
                  onClick={toggleHeapType}
                >
                  {heapType === "max" ? "Max Heap" : "Min Heap"}
                </Badge>
              </CardTitle>
              <CardDescription>Visualize binary heap data structure operations</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={currentTab}
                onValueChange={(value) => {
                  setCurrentTab(value)
                  setMessage(null)
                }}
              >
                <TabsList className="grid grid-cols-2 w-full">
                  <TabsTrigger value="insert">Insert</TabsTrigger>
                  <TabsTrigger value="extract">Extract</TabsTrigger>
                </TabsList>

                <TabsContent value="insert" className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter a value"
                      type="number"
                      className="transition-all focus:ring-2 focus:ring-datastructure-heap"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={insertNode}
                            className="bg-datastructure-heap hover:bg-datastructure-heap/80 transition-all duration-300 hover:shadow-ds-heap"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Insert
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert a new value and heapify up</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TabsContent>

                <TabsContent value="extract" className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={extractRoot}
                            className="bg-datastructure-heap hover:bg-datastructure-heap/80 transition-all duration-300 hover:shadow-ds-heap"
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            Extract {heapType === "max" ? "Max" : "Min"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Extract the root node and heapify down</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-4">
                <Button
                  variant="outline"
                  onClick={resetHeap}
                  className="transition-all duration-300 hover:border-datastructure-heap hover:text-datastructure-heap"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Heap
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge variant="outline" className="bg-datastructure-heap/10 border-datastructure-heap/20">
                    {message}
                  </Badge>
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </AnimatedGradientBorder>

        <Card className="ds-card ds-card-heap">
          <CardHeader>
            <CardTitle>Implementation Details</CardTitle>
            <CardDescription>Code implementation and complexity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Complexity Analysis</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col p-3 border rounded-md hover:shadow-ds-heap transition-all duration-300">
                    <span className="text-sm text-muted-foreground">Time Complexity</span>
                    <span className="font-mono font-bold">
                      {currentTab === "insert" || currentTab === "extract" ? "O(log n)" : "O(1)"}
                    </span>
                  </div>
                  <div className="flex flex-col p-3 border rounded-md hover:shadow-ds-heap transition-all duration-300">
                    <span className="text-sm text-muted-foreground">Space Complexity</span>
                    <span className="font-mono font-bold">O(n)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Code Implementation</h3>
                <CodeBlock code={getHeapCode()} language="javascript" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="ds-card ds-card-heap overflow-hidden">
        <CardHeader>
          <CardTitle>Visualization</CardTitle>
          <CardDescription>Visual representation of the binary heap</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-[400px] border rounded-md bg-muted/50 transition-all duration-300 hover:shadow-ds-heap"
            />
            <div className="absolute bottom-4 left-4 flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-f59e0b"></div>
                <span className="text-xs">Root</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-3b82f6"></div>
                <span className="text-xs">Active</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-22c55e"></div>
                <span className="text-xs">New</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-3 h-3 rounded-full bg-ef4444"></div>
                <span className="text-xs">Removed</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
