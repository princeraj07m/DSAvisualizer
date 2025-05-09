"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw, ChevronRight, Info, Code } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function ArrayVisualizer() {
  const [array, setArray] = useState<number[]>([])
  const [inputArray, setInputArray] = useState("64, 34, 25, 12, 22, 11, 90")
  const [isPlaying, setIsPlaying] = useState(false)
  const [speed, setSpeed] = useState([50])
  const [currentStep, setCurrentStep] = useState(0)
  const [totalSteps, setTotalSteps] = useState(0)
  const [sortingSteps, setSortingSteps] = useState<{ array: number[]; comparing: number[]; swapping: number[] }[]>([])
  const [currentAlgorithm, setCurrentAlgorithm] = useState("bubble")
  const animationRef = useRef<number | null>(null)
  const lastStepTimeRef = useRef<number>(0)
  const [showCode, setShowCode] = useState(false)

  // Initialize array
  useEffect(() => {
    resetArray()
  }, [])

  // Handle animation
  useEffect(() => {
    if (isPlaying && currentStep < sortingSteps.length) {
      const animate = (timestamp: number) => {
        if (!lastStepTimeRef.current) {
          lastStepTimeRef.current = timestamp
        }

        const elapsed = timestamp - lastStepTimeRef.current
        const stepDuration = 1000 - speed[0] * 9 // Convert speed to ms (0-100 to 1000-100ms)

        if (elapsed > stepDuration) {
          setCurrentStep((prev) => {
            const next = prev + 1
            if (next >= sortingSteps.length) {
              setIsPlaying(false)
              return prev
            }
            return next
          })
          lastStepTimeRef.current = timestamp
        }

        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current)
        }
      }
    }
  }, [isPlaying, currentStep, sortingSteps.length, speed])

  // Reset array to initial state
  const resetArray = () => {
    const newArray = inputArray
      .split(",")
      .map((num) => Number.parseInt(num.trim()))
      .filter((num) => !isNaN(num))
    setArray(newArray)
    setIsPlaying(false)
    setCurrentStep(0)
    setSortingSteps([{ array: [...newArray], comparing: [], swapping: [] }])
  }

  // Generate steps for bubble sort
  const generateBubbleSortSteps = (arr: number[]) => {
    const steps: { array: number[]; comparing: number[]; swapping: number[] }[] = []
    const tempArray = [...arr]

    steps.push({ array: [...tempArray], comparing: [], swapping: [] })

    for (let i = 0; i < tempArray.length; i++) {
      for (let j = 0; j < tempArray.length - i - 1; j++) {
        // Comparing step
        steps.push({ array: [...tempArray], comparing: [j, j + 1], swapping: [] })

        if (tempArray[j] > tempArray[j + 1]) {
          // Swapping step
          steps.push({ array: [...tempArray], comparing: [], swapping: [j, j + 1] })

          // Perform swap
          const temp = tempArray[j]
          tempArray[j] = tempArray[j + 1]
          tempArray[j + 1] = temp

          // After swap
          steps.push({ array: [...tempArray], comparing: [], swapping: [] })
        }
      }
    }

    return steps
  }

  // Generate steps for quick sort
  const generateQuickSortSteps = (arr: number[]) => {
    const steps: { array: number[]; comparing: number[]; swapping: number[] }[] = []
    const tempArray = [...arr]

    steps.push({ array: [...tempArray], comparing: [], swapping: [] })

    const quickSort = (arr: number[], low: number, high: number) => {
      if (low < high) {
        const pivotIndex = partition(arr, low, high)
        quickSort(arr, low, pivotIndex - 1)
        quickSort(arr, pivotIndex + 1, high)
      }
    }

    const partition = (arr: number[], low: number, high: number) => {
      const pivot = arr[high]
      steps.push({ array: [...arr], comparing: [high], swapping: [] })

      let i = low - 1

      for (let j = low; j < high; j++) {
        steps.push({ array: [...arr], comparing: [j, high], swapping: [] })

        if (arr[j] <= pivot) {
          i++
          steps.push({ array: [...arr], comparing: [], swapping: [i, j] })

          const temp = arr[i]
          arr[i] = arr[j]
          arr[j] = temp

          steps.push({ array: [...arr], comparing: [], swapping: [] })
        }
      }

      steps.push({ array: [...arr], comparing: [], swapping: [i + 1, high] })

      const temp = arr[i + 1]
      arr[i + 1] = arr[high]
      arr[high] = temp

      steps.push({ array: [...arr], comparing: [], swapping: [] })

      return i + 1
    }

    quickSort(tempArray, 0, tempArray.length - 1)

    return steps
  }

  // Generate steps for merge sort
  const generateMergeSortSteps = (arr: number[]) => {
    const steps: { array: number[]; comparing: number[]; swapping: number[] }[] = []
    const tempArray = [...arr]

    steps.push({ array: [...tempArray], comparing: [], swapping: [] })

    const merge = (arr: number[], left: number, mid: number, right: number) => {
      const n1 = mid - left + 1
      const n2 = right - mid

      const L = new Array(n1)
      const R = new Array(n2)

      for (let i = 0; i < n1; i++) {
        L[i] = arr[left + i]
      }

      for (let j = 0; j < n2; j++) {
        R[j] = arr[mid + 1 + j]
      }

      let i = 0,
        j = 0,
        k = left

      while (i < n1 && j < n2) {
        steps.push({ array: [...arr], comparing: [left + i, mid + 1 + j], swapping: [] })

        if (L[i] <= R[j]) {
          steps.push({ array: [...arr], comparing: [], swapping: [k] })
          arr[k] = L[i]
          i++
        } else {
          steps.push({ array: [...arr], comparing: [], swapping: [k] })
          arr[k] = R[j]
          j++
        }

        steps.push({ array: [...arr], comparing: [], swapping: [] })
        k++
      }

      while (i < n1) {
        steps.push({ array: [...arr], comparing: [], swapping: [k] })
        arr[k] = L[i]
        steps.push({ array: [...arr], comparing: [], swapping: [] })
        i++
        k++
      }

      while (j < n2) {
        steps.push({ array: [...arr], comparing: [], swapping: [k] })
        arr[k] = R[j]
        steps.push({ array: [...arr], comparing: [], swapping: [] })
        j++
        k++
      }
    }

    const mergeSort = (arr: number[], left: number, right: number) => {
      if (left < right) {
        const mid = Math.floor((left + right) / 2)

        mergeSort(arr, left, mid)
        mergeSort(arr, mid + 1, right)

        merge(arr, left, mid, right)
      }
    }

    mergeSort(tempArray, 0, tempArray.length - 1)

    return steps
  }

  // Start sorting
  const startSorting = () => {
    let steps: { array: number[]; comparing: number[]; swapping: number[] }[] = []

    if (currentAlgorithm === "bubble") {
      steps = generateBubbleSortSteps([...array])
    } else if (currentAlgorithm === "quick") {
      steps = generateQuickSortSteps([...array])
    } else if (currentAlgorithm === "merge") {
      steps = generateMergeSortSteps([...array])
    }

    setSortingSteps(steps)
    setTotalSteps(steps.length)
    setCurrentStep(0)
    setIsPlaying(true)
  }

  // Toggle play/pause
  const togglePlay = () => {
    if (currentStep >= sortingSteps.length - 1) {
      setCurrentStep(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
    lastStepTimeRef.current = 0
  }

  // Step forward
  const stepForward = () => {
    if (currentStep < sortingSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Get current array state
  const currentArrayState = sortingSteps[currentStep] || { array: [], comparing: [], swapping: [] }

  // Get color for array element
  const getElementColor = (index: number) => {
    if (currentArrayState.comparing.includes(index)) {
      return "bg-yellow-500 dark:bg-yellow-600"
    }
    if (currentArrayState.swapping.includes(index)) {
      return "bg-green-500 dark:bg-green-600"
    }
    return "bg-algorithm-bubble dark:bg-algorithm-bubble/80"
  }

  // Get algorithm complexity
  const getAlgorithmComplexity = () => {
    switch (currentAlgorithm) {
      case "bubble":
        return { time: "O(n²)", space: "O(1)" }
      case "quick":
        return { time: "O(n log n)", space: "O(log n)" }
      case "merge":
        return { time: "O(n log n)", space: "O(n)" }
      default:
        return { time: "Unknown", space: "Unknown" }
    }
  }

  // Get algorithm code
  const getAlgorithmCode = () => {
    switch (currentAlgorithm) {
      case "bubble":
        return `function bubbleSort(arr) {
  const n = arr.length;
  
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i - 1; j++) {
      // Compare adjacent elements
      if (arr[j] > arr[j + 1]) {
        // Swap them if they are in wrong order
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  
  return arr;
}`
      case "quick":
        return `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // Find pivot element
    const pivotIndex = partition(arr, low, high);
    
    // Recursively sort elements before and after pivot
    quickSort(arr, low, pivotIndex - 1);
    quickSort(arr, pivotIndex + 1, high);
  }
  
  return arr;
}

function partition(arr, low, high) {
  // Choose rightmost element as pivot
  const pivot = arr[high];
  let i = low - 1;
  
  for (let j = low; j < high; j++) {
    if (arr[j] <= pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  
  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}`
      case "merge":
        return `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  
  // Split array into halves
  const mid = Math.floor(arr.length / 2);
  const left = arr.slice(0, mid);
  const right = arr.slice(mid);
  
  // Recursively sort both halves
  return merge(
    mergeSort(left),
    mergeSort(right)
  );
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  
  // Compare elements from both arrays and merge them in sorted order
  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  
  // Add remaining elements
  return [...result, ...left.slice(i), ...right.slice(j)];
}`
      default:
        return ""
    }
  }

  return (
    <div className="grid gap-6">
      {/* Visualization Section - Now at the top */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="algorithm-card algorithm-card-bubble overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle>Array Sorting Visualization</CardTitle>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowCode(!showCode)}
                        className="hover:bg-algorithm-bubble/20"
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
            <CardDescription>Watch the algorithm in action</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="h-64 flex items-end justify-center space-x-1 p-4 border rounded-md bg-muted/50 transition-all duration-300 hover:shadow-algorithm-bubble">
              {currentArrayState.array.map((value, index) => (
                <motion.div
                  key={index}
                  className={`w-12 flex flex-col items-center justify-end transition-all duration-300 ${getElementColor(index)}`}
                  style={{ height: `${(value / Math.max(...currentArrayState.array)) * 100}%` }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                >
                  <span className="text-xs font-mono text-white p-1">{value}</span>
                </motion.div>
              ))}
            </div>
            <div className="mt-4 flex justify-between items-center">
              <div className="text-sm text-muted-foreground">
                Step: {currentStep} / {totalSteps > 0 ? totalSteps - 1 : 0}
              </div>
              <div className="flex space-x-2">
                {currentArrayState.comparing.length > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-yellow-100 dark:bg-yellow-900 border-yellow-200 dark:border-yellow-800"
                  >
                    Comparing: {currentArrayState.comparing.map((i) => currentArrayState.array[i]).join(", ")}
                  </Badge>
                )}
                {currentArrayState.swapping.length > 0 && (
                  <Badge
                    variant="outline"
                    className="bg-green-100 dark:bg-green-900 border-green-200 dark:border-green-800"
                  >
                    Swapping: {currentArrayState.swapping.map((i) => currentArrayState.array[i]).join(", ")}
                  </Badge>
                )}
              </div>
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
          <Card className="algorithm-card algorithm-card-bubble h-full">
            <CardHeader>
              <CardTitle>Algorithm Controls</CardTitle>
              <CardDescription>Configure and control the sorting algorithm</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-4">
                <div className="flex items-center space-x-2">
                  <Input
                    value={inputArray}
                    onChange={(e) => setInputArray(e.target.value)}
                    placeholder="Enter comma-separated numbers"
                    className="transition-all focus:ring-2 focus:ring-algorithm-bubble"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          onClick={resetArray}
                          className="hover:border-algorithm-bubble hover:text-algorithm-bubble"
                        >
                          <RotateCcw className="h-4 w-4 mr-2" />
                          Reset
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Reset the array to initial values</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">Speed:</span>
                  <Slider value={speed} onValueChange={setSpeed} max={100} step={1} className="flex-1" />
                </div>

                <Tabs value={currentAlgorithm} onValueChange={setCurrentAlgorithm}>
                  <TabsList className="grid grid-cols-3 w-full">
                    <TabsTrigger value="bubble" className="relative overflow-hidden group">
                      <span className="relative z-10">Bubble Sort</span>
                      <span className="absolute inset-0 bg-algorithm-bubble opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                    </TabsTrigger>
                    <TabsTrigger value="quick" className="relative overflow-hidden group">
                      <span className="relative z-10">Quick Sort</span>
                      <span className="absolute inset-0 bg-algorithm-quick opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                    </TabsTrigger>
                    <TabsTrigger value="merge" className="relative overflow-hidden group">
                      <span className="relative z-10">Merge Sort</span>
                      <span className="absolute inset-0 bg-algorithm-merge opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={togglePlay}
                            disabled={array.length === 0}
                            className="bg-algorithm-bubble hover:bg-algorithm-bubble/80 transition-all duration-300 hover:shadow-algorithm-bubble"
                          >
                            {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                            {isPlaying ? "Pause" : "Play"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isPlaying ? "Pause" : "Play"} the animation</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            onClick={stepForward}
                            disabled={isPlaying || currentStep >= sortingSteps.length - 1}
                            className="hover:border-algorithm-bubble hover:text-algorithm-bubble"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Step forward</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={startSorting}
                          disabled={array.length === 0 || isPlaying}
                          className="bg-algorithm-bubble hover:bg-algorithm-bubble/80 transition-all duration-300 hover:shadow-algorithm-bubble"
                        >
                          Start Sorting
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Start the sorting animation</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="algorithm-card algorithm-card-bubble h-full">
            <CardHeader>
              <CardTitle>Algorithm Details</CardTitle>
              <CardDescription>Time and space complexity analysis</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Complexity Analysis</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col p-3 border rounded-md hover:shadow-algorithm-bubble transition-all duration-300">
                      <span className="text-sm text-muted-foreground">Time Complexity</span>
                      <span className="font-mono font-bold">{getAlgorithmComplexity().time}</span>
                    </div>
                    <div className="flex flex-col p-3 border rounded-md hover:shadow-algorithm-bubble transition-all duration-300">
                      <span className="text-sm text-muted-foreground">Space Complexity</span>
                      <span className="font-mono font-bold">{getAlgorithmComplexity().space}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="hover:text-algorithm-bubble">
                        <div className="flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          Algorithm Description
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {currentAlgorithm === "bubble" && (
                          <p className="text-sm text-muted-foreground">
                            Bubble Sort repeatedly steps through the list, compares adjacent elements, and swaps them if
                            they are in the wrong order. The pass through the list is repeated until the list is sorted.
                          </p>
                        )}
                        {currentAlgorithm === "quick" && (
                          <p className="text-sm text-muted-foreground">
                            Quick Sort selects a 'pivot' element and partitions the array around the pivot, placing
                            smaller elements to the left and larger elements to the right. It then recursively sorts the
                            sub-arrays.
                          </p>
                        )}
                        {currentAlgorithm === "merge" && (
                          <p className="text-sm text-muted-foreground">
                            Merge Sort divides the array into halves, recursively sorts them, and then merges the sorted
                            halves. It's a stable, divide-and-conquer algorithm with guaranteed O(n log n) performance.
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
          <Card className="algorithm-card algorithm-card-bubble">
            <CardHeader>
              <CardTitle>Code Implementation</CardTitle>
              <CardDescription>
                JavaScript implementation of{" "}
                {currentAlgorithm === "bubble"
                  ? "Bubble Sort"
                  : currentAlgorithm === "quick"
                    ? "Quick Sort"
                    : "Merge Sort"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={getAlgorithmCode()} language="javascript" />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
