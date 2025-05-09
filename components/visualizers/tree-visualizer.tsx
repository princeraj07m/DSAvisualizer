"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, RotateCcw, Search, Code, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  x?: number
  y?: number
  highlight?: "active" | "new" | "removed" | "search"
}

export function TreeVisualizer() {
  const [root, setRoot] = useState<TreeNode | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [operation, setOperation] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState("insert")
  const [traversalResult, setTraversalResult] = useState<number[]>([])
  const [traversalType, setTraversalType] = useState("inorder")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [showCode, setShowCode] = useState(false)

  // Initialize tree
  const initializeTree = () => {
    const newRoot: TreeNode = {
      value: 50,
      left: {
        value: 30,
        left: {
          value: 20,
          left: null,
          right: null,
        },
        right: {
          value: 40,
          left: null,
          right: null,
        },
      },
      right: {
        value: 70,
        left: {
          value: 60,
          left: null,
          right: null,
        },
        right: {
          value: 80,
          left: null,
          right: null,
        },
      },
    }
    setRoot(newRoot)
    setMessage(null)
    setTraversalResult([])
  }

  // Reset tree
  const resetTree = () => {
    initializeTree()
  }

  // Insert a node
  const insertNode = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      setMessage("Please enter a valid number")
      return
    }

    setOperation("insert")

    if (!root) {
      const newNode: TreeNode = {
        value,
        left: null,
        right: null,
        highlight: "new",
      }
      setRoot(newNode)
      setInputValue("")
      setMessage(`Inserted ${value}`)

      // Clear highlight after animation
      setTimeout(() => {
        setRoot((prev) => {
          if (!prev) return null
          return {
            ...prev,
            highlight: undefined,
          }
        })
      }, 2000)

      return
    }

    // Create a deep copy of the tree
    const newRoot = JSON.parse(JSON.stringify(root))

    // Insert function
    const insert = (node: TreeNode, val: number): void => {
      if (val === node.value) {
        setMessage(`Value ${val} already exists`)
        return
      }

      if (val < node.value) {
        if (node.left === null) {
          node.left = {
            value: val,
            left: null,
            right: null,
            highlight: "new",
          }
        } else {
          insert(node.left, val)
        }
      } else {
        if (node.right === null) {
          node.right = {
            value: val,
            left: null,
            right: null,
            highlight: "new",
          }
        } else {
          insert(node.right, val)
        }
      }
    }

    insert(newRoot, value)
    setRoot(newRoot)
    setInputValue("")
    setMessage(`Inserted ${value}`)

    // Clear highlight after animation
    setTimeout(() => {
      setRoot((prev) => {
        if (!prev) return null

        const clearHighlights = (node: TreeNode): TreeNode => {
          const newNode = { ...node }
          newNode.highlight = undefined

          if (newNode.left) {
            newNode.left = clearHighlights(newNode.left)
          }

          if (newNode.right) {
            newNode.right = clearHighlights(newNode.right)
          }

          return newNode
        }

        return clearHighlights(prev)
      })
    }, 2000)
  }

  // Search for a node
  const searchNode = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      setMessage("Please enter a valid number")
      return
    }

    setOperation("search")

    if (!root) {
      setMessage("Tree is empty")
      return
    }

    // Create a deep copy of the tree
    const newRoot = JSON.parse(JSON.stringify(root))

    // Clear all highlights
    const clearHighlights = (node: TreeNode): void => {
      node.highlight = undefined

      if (node.left) {
        clearHighlights(node.left)
      }

      if (node.right) {
        clearHighlights(node.right)
      }
    }

    clearHighlights(newRoot)

    // Search function
    const search = (node: TreeNode, val: number, path: TreeNode[] = []): boolean => {
      path.push(node)

      if (val === node.value) {
        return true
      }

      if (val < node.value && node.left) {
        return search(node.left, val, path)
      }

      if (val > node.value && node.right) {
        return search(node.right, val, path)
      }

      return false
    }

    const path: TreeNode[] = []
    const found = search(newRoot, value, path)

    // Animate search path
    const animatePath = (index: number) => {
      if (index >= path.length) {
        if (found) {
          setMessage(`Found ${value}`)
          path[path.length - 1].highlight = "search"
        } else {
          setMessage(`Value ${value} not found`)
        }
        setRoot(newRoot)
        return
      }

      path[index].highlight = "active"
      setRoot({ ...newRoot })

      setTimeout(() => {
        path[index].highlight = undefined
        animatePath(index + 1)
      }, 500)
    }

    animatePath(0)
    setInputValue("")
  }

  // Perform tree traversal
  const traverseTree = (type: string) => {
    if (!root) {
      setMessage("Tree is empty")
      return
    }

    setTraversalType(type)
    const result: number[] = []

    // Traversal functions
    const inorderTraversal = (node: TreeNode): void => {
      if (node.left) inorderTraversal(node.left)
      result.push(node.value)
      if (node.right) inorderTraversal(node.right)
    }

    const preorderTraversal = (node: TreeNode): void => {
      result.push(node.value)
      if (node.left) preorderTraversal(node.left)
      if (node.right) preorderTraversal(node.right)
    }

    const postorderTraversal = (node: TreeNode): void => {
      if (node.left) postorderTraversal(node.left)
      if (node.right) postorderTraversal(node.right)
      result.push(node.value)
    }

    // Perform selected traversal
    if (type === "inorder") {
      inorderTraversal(root)
      setMessage("Inorder Traversal (Left-Root-Right)")
    } else if (type === "preorder") {
      preorderTraversal(root)
      setMessage("Preorder Traversal (Root-Left-Right)")
    } else if (type === "postorder") {
      postorderTraversal(root)
      setMessage("Postorder Traversal (Left-Right-Root)")
    }

    setTraversalResult(result)
  }

  // Draw tree on canvas
  useEffect(() => {
    if (!root || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate node positions
    const calculatePositions = (node: TreeNode, depth = 0, leftBound = 0, rightBound: number = canvas.width): void => {
      const x = (leftBound + rightBound) / 2
      const y = 50 + depth * 80

      node.x = x
      node.y = y

      if (node.left) {
        calculatePositions(node.left, depth + 1, leftBound, x)
      }

      if (node.right) {
        calculatePositions(node.right, depth + 1, x, rightBound)
      }
    }

    calculatePositions(root)

    // Draw edges
    const drawEdges = (node: TreeNode): void => {
      if (!ctx) return

      if (node.left && node.left.x !== undefined && node.left.y !== undefined) {
        ctx.beginPath()
        ctx.moveTo(node.x!, node.y!)
        ctx.lineTo(node.left.x, node.left.y)
        ctx.strokeStyle = "#888"
        ctx.lineWidth = 1.5
        ctx.stroke()

        drawEdges(node.left)
      }

      if (node.right && node.right.x !== undefined && node.right.y !== undefined) {
        ctx.beginPath()
        ctx.moveTo(node.x!, node.y!)
        ctx.lineTo(node.right.x, node.right.y)
        ctx.strokeStyle = "#888"
        ctx.lineWidth = 1.5
        ctx.stroke()

        drawEdges(node.right)
      }
    }

    // Draw nodes
    const drawNodes = (node: TreeNode): void => {
      if (!ctx || node.x === undefined || node.y === undefined) return

      // Draw circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2)

      // Set fill color based on highlight
      if (node.highlight === "active") {
        ctx.fillStyle = "#3b82f6"
      } else if (node.highlight === "new") {
        ctx.fillStyle = "#22c55e"
      } else if (node.highlight === "removed") {
        ctx.fillStyle = "#ef4444"
      } else if (node.highlight === "search") {
        ctx.fillStyle = "#f59e0b"
      } else {
        ctx.fillStyle = "#f1f5f9"
      }

      ctx.fill()
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw value
      ctx.fillStyle = "#1e293b"
      ctx.font = "14px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.value.toString(), node.x, node.y)

      // Draw children
      if (node.left) {
        drawNodes(node.left)
      }

      if (node.right) {
        drawNodes(node.right)
      }
    }

    // Draw the tree
    drawEdges(root)
    drawNodes(root)
  }, [root])

  // Get tree code
  const getTreeCode = () => {
    switch (currentTab) {
      case "insert":
        return `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Insert a node in BST - O(log n) average, O(n) worst
function insert(root, value) {
  // If tree is empty, create a new node
  if (root === null) {
    return new TreeNode(value);
  }
  
  // Otherwise, recur down the tree
  if (value < root.value) {
    root.left = insert(root.left, value);
  } else if (value > root.value) {
    root.right = insert(root.right, value);
  }
  
  // Return the unchanged node pointer
  return root;
}`
      case "search":
        return `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Search for a node in BST - O(log n) average, O(n) worst
function search(root, value) {
  // Base cases: root is null or value is present
  if (root === null || root.value === value) {
    return root;
  }
  
  // Value is greater than root's value
  if (value > root.value) {
    return search(root.right, value);
  }
  
  // Value is less than root's value
  return search(root.left, value);
}`
      case "traversal":
        return `class TreeNode {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

// Inorder traversal (Left-Root-Right) - O(n)
function inorderTraversal(root, result = []) {
  if (root !== null) {
    inorderTraversal(root.left, result);
    result.push(root.value);
    inorderTraversal(root.right, result);
  }
  return result;
}

// Preorder traversal (Root-Left-Right) - O(n)
function preorderTraversal(root, result = []) {
  if (root !== null) {
    result.push(root.value);
    preorderTraversal(root.left, result);
    preorderTraversal(root.right, result);
  }
  return result;
}

// Postorder traversal (Left-Right-Root) - O(n)
function postorderTraversal(root, result = []) {
  if (root !== null) {
    postorderTraversal(root.left, result);
    postorderTraversal(root.right, result);
    result.push(root.value);
  }
  return result;
}`
      default:
        return ""
    }
  }

  // Initialize on first render
  if (!root) {
    initializeTree()
  }

  return (
    <div className="grid gap-6">
      {/* Visualization Section - Now at the top */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="ds-card ds-card-tree overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle>Binary Search Tree Visualization</CardTitle>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowCode(!showCode)}
                        className="hover:bg-datastructure-tree/20"
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
            <CardDescription>Visual representation of the binary search tree</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-[400px] border rounded-md bg-muted/50 transition-all duration-300 hover:shadow-ds-tree"
            />
            <div className="mt-4 flex justify-between items-center">
              <div className="flex space-x-2">
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-3b82f6"></div>
                  <span className="text-xs">Active</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-22c55e"></div>
                  <span className="text-xs">New</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-3 h-3 rounded-full bg-f59e0b"></div>
                  <span className="text-xs">Found</span>
                </div>
              </div>
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge variant="outline" className="bg-datastructure-tree/10 border-datastructure-tree/20">
                    {message}
                  </Badge>
                </motion.div>
              )}
            </div>
            {traversalResult.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-3 border rounded-md bg-muted"
              >
                <h4 className="text-sm font-medium mb-2">
                  {traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal Result:
                </h4>
                <div className="flex flex-wrap gap-2">
                  {traversalResult.map((value, index) => (
                    <Badge
                      key={index}
                      variant="outline"
                      className="bg-datastructure-tree/10 border-datastructure-tree/20"
                    >
                      {value}
                    </Badge>
                  ))}
                </div>
              </motion.div>
            )}
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
          <Card className="ds-card ds-card-tree h-full">
            <CardHeader>
              <CardTitle>Tree Operations</CardTitle>
              <CardDescription>Perform operations on the binary search tree</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={currentTab}
                onValueChange={(value) => {
                  setCurrentTab(value)
                  setMessage(null)
                  setTraversalResult([])
                }}
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="insert" className="relative overflow-hidden group">
                    <span className="relative z-10">Insert</span>
                    <span className="absolute inset-0 bg-datastructure-tree opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                  </TabsTrigger>
                  <TabsTrigger value="search" className="relative overflow-hidden group">
                    <span className="relative z-10">Search</span>
                    <span className="absolute inset-0 bg-datastructure-tree opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                  </TabsTrigger>
                  <TabsTrigger value="traversal" className="relative overflow-hidden group">
                    <span className="relative z-10">Traversal</span>
                    <span className="absolute inset-0 bg-datastructure-tree opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="insert" className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter a value"
                      type="number"
                      className="transition-all focus:ring-2 focus:ring-datastructure-tree"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={insertNode}
                            className="bg-datastructure-tree hover:bg-datastructure-tree/80 transition-all duration-300 hover:shadow-ds-tree"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Insert
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert a new node in the binary search tree</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TabsContent>

                <TabsContent value="search" className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter a value to search"
                      type="number"
                      className="transition-all focus:ring-2 focus:ring-datastructure-tree"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={searchNode}
                            className="bg-datastructure-tree hover:bg-datastructure-tree/80 transition-all duration-300 hover:shadow-ds-tree"
                          >
                            <Search className="h-4 w-4 mr-2" />
                            Search
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Search for a value in the binary search tree</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TabsContent>

                <TabsContent value="traversal" className="space-y-4 mt-4">
                  <div className="flex flex-wrap gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => traverseTree("inorder")}
                            className="bg-datastructure-tree hover:bg-datastructure-tree/80 transition-all duration-300 hover:shadow-ds-tree"
                          >
                            Inorder
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Traverse the tree in Left-Root-Right order</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => traverseTree("preorder")}
                            className="bg-datastructure-tree hover:bg-datastructure-tree/80 transition-all duration-300 hover:shadow-ds-tree"
                          >
                            Preorder
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Traverse the tree in Root-Left-Right order</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={() => traverseTree("postorder")}
                            className="bg-datastructure-tree hover:bg-datastructure-tree/80 transition-all duration-300 hover:shadow-ds-tree"
                          >
                            Postorder
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Traverse the tree in Left-Right-Root order</p>
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
                        onClick={resetTree}
                        className="hover:border-datastructure-tree hover:text-datastructure-tree"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset Tree
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset the tree to its initial state</p>
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
          <Card className="ds-card ds-card-tree h-full">
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
              <CardDescription>Code implementation and complexity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Complexity Analysis</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col p-3 border rounded-md hover:shadow-ds-tree transition-all duration-300">
                      <span className="text-sm text-muted-foreground">Time Complexity</span>
                      <span className="font-mono font-bold">
                        {currentTab === "traversal" ? "O(n)" : "O(log n) avg, O(n) worst"}
                      </span>
                    </div>
                    <div className="flex flex-col p-3 border rounded-md hover:shadow-ds-tree transition-all duration-300">
                      <span className="text-sm text-muted-foreground">Space Complexity</span>
                      <span className="font-mono font-bold">
                        {currentTab === "traversal" ? "O(n)" : "O(log n) avg, O(n) worst"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="hover:text-datastructure-tree">
                        <div className="flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          Binary Search Tree Description
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {currentTab === "insert" && (
                          <p className="text-sm text-muted-foreground">
                            Insertion in a Binary Search Tree (BST) follows the BST property: all nodes in the left
                            subtree have values less than the node's value, and all nodes in the right subtree have
                            values greater than the node's value. To insert a new node, we traverse the tree and place
                            the node in the appropriate position.
                          </p>
                        )}
                        {currentTab === "search" && (
                          <p className="text-sm text-muted-foreground">
                            Searching in a Binary Search Tree (BST) is efficient due to its ordered structure. We start
                            at the root and compare the target value with the current node. If equal, we found it. If
                            less, we search the left subtree. If greater, we search the right subtree.
                          </p>
                        )}
                        {currentTab === "traversal" && (
                          <p className="text-sm text-muted-foreground">
                            Tree traversal is the process of visiting each node in a tree exactly once. There are three
                            common traversal methods: Inorder (Left-Root-Right), Preorder (Root-Left-Right), and
                            Postorder (Left-Right-Root). Each traversal method has different applications and produces a
                            different ordering of the nodes.
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
          <Card className="ds-card ds-card-tree">
            <CardHeader>
              <CardTitle>Code Implementation</CardTitle>
              <CardDescription>
                JavaScript implementation of{" "}
                {currentTab === "insert"
                  ? "Binary Search Tree Insertion"
                  : currentTab === "search"
                    ? "Binary Search Tree Search"
                    : "Binary Search Tree Traversal"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={getTreeCode()} language="javascript" />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
