"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, RotateCcw, ArrowRight, Code, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface Node {
  value: number
  next: Node | null
  highlight?: "active" | "new" | "removed" | "search"
}

export function LinkedListVisualizer() {
  const [head, setHead] = useState<Node | null>(null)
  const [inputValue, setInputValue] = useState("")
  const [inputPosition, setInputPosition] = useState("")
  const [operation, setOperation] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState("insert")
  const [showCode, setShowCode] = useState(false)

  // Initialize linked list
  const initializeList = () => {
    const newHead: Node = {
      value: 10,
      next: {
        value: 20,
        next: {
          value: 30,
          next: {
            value: 40,
            next: null,
          },
        },
      },
    }
    setHead(newHead)
    setMessage(null)
  }

  // Reset linked list
  const resetList = () => {
    initializeList()
  }

  // Insert at beginning
  const insertAtBeginning = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      setMessage("Please enter a valid number")
      return
    }

    setOperation("insert-beginning")

    const newNode: Node = {
      value,
      next: head,
      highlight: "new",
    }

    setHead(newNode)
    setInputValue("")
    setMessage(`Inserted ${value} at the beginning`)

    // Clear highlight after animation
    setTimeout(() => {
      setHead((prev) => {
        if (!prev) return null
        return {
          ...prev,
          highlight: undefined,
        }
      })
    }, 2000)
  }

  // Insert at end
  const insertAtEnd = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      setMessage("Please enter a valid number")
      return
    }

    setOperation("insert-end")

    const newNode: Node = {
      value,
      next: null,
      highlight: "new",
    }

    if (!head) {
      setHead(newNode)
    } else {
      // Create a deep copy of the list to avoid mutation
      const newHead = JSON.parse(JSON.stringify(head))
      let current = newHead

      // Traverse to the end
      while (current.next) {
        current = current.next
      }

      current.next = newNode
      setHead(newHead)
    }

    setInputValue("")
    setMessage(`Inserted ${value} at the end`)

    // Clear highlight after animation
    setTimeout(() => {
      setHead((prev) => {
        if (!prev) return null

        const newHead = JSON.parse(JSON.stringify(prev))
        let current = newHead

        while (current.next) {
          current = current.next
        }

        current.highlight = undefined
        return newHead
      })
    }, 2000)
  }

  // Insert at position
  const insertAtPosition = () => {
    const value = Number.parseInt(inputValue)
    const position = Number.parseInt(inputPosition)

    if (isNaN(value) || isNaN(position) || position < 0) {
      setMessage("Please enter valid numbers")
      return
    }

    setOperation("insert-position")

    const newNode: Node = {
      value,
      next: null,
      highlight: "new",
    }

    if (position === 0 || !head) {
      newNode.next = head
      setHead(newNode)
      setInputValue("")
      setInputPosition("")
      setMessage(`Inserted ${value} at position ${position}`)

      setTimeout(() => {
        setHead((prev) => {
          if (!prev) return null
          return {
            ...prev,
            highlight: undefined,
          }
        })
      }, 2000)

      return
    }

    // Create a deep copy of the list
    const newHead = JSON.parse(JSON.stringify(head))
    let current = newHead
    let index = 0

    // Traverse to the position
    while (current.next && index < position - 1) {
      current = current.next
      index++
    }

    // Insert the new node
    newNode.next = current.next
    current.next = newNode

    setHead(newHead)
    setInputValue("")
    setInputPosition("")
    setMessage(`Inserted ${value} at position ${index + 1}`)

    // Clear highlight after animation
    setTimeout(() => {
      setHead((prev) => {
        if (!prev) return null

        const newHead = JSON.parse(JSON.stringify(prev))
        let current = newHead
        let index = 0

        while (current.next && index < position - 1) {
          current = current.next
          index++
        }

        if (current.next) {
          current.next.highlight = undefined
        }

        return newHead
      })
    }, 2000)
  }

  // Delete from beginning
  const deleteFromBeginning = () => {
    if (!head) {
      setMessage("List is empty")
      return
    }

    setOperation("delete-beginning")

    // Highlight the node to be deleted
    setHead((prev) => {
      if (!prev) return null
      return {
        ...prev,
        highlight: "removed",
      }
    })

    // Delete after animation
    setTimeout(() => {
      setHead(head?.next || null)
      setMessage("Deleted node from the beginning")
    }, 1000)
  }

  // Delete from end
  const deleteFromEnd = () => {
    if (!head) {
      setMessage("List is empty")
      return
    }

    setOperation("delete-end")

    if (!head.next) {
      // Highlight the node to be deleted
      setHead((prev) => {
        if (!prev) return null
        return {
          ...prev,
          highlight: "removed",
        }
      })

      // Delete after animation
      setTimeout(() => {
        setHead(null)
        setMessage("Deleted the only node")
      }, 1000)

      return
    }

    // Create a deep copy of the list
    const newHead = JSON.parse(JSON.stringify(head))
    let current = newHead

    // Traverse to the second last node
    while (current.next && current.next.next) {
      current = current.next
    }

    // Highlight the node to be deleted
    if (current.next) {
      current.next.highlight = "removed"
    }

    setHead(newHead)

    // Delete after animation
    setTimeout(() => {
      const newHead = JSON.parse(JSON.stringify(head))
      let current = newHead

      while (current.next && current.next.next) {
        current = current.next
      }

      current.next = null
      setHead(newHead)
      setMessage("Deleted node from the end")
    }, 1000)
  }

  // Search for a value
  const searchValue = () => {
    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      setMessage("Please enter a valid number")
      return
    }

    setOperation("search")

    if (!head) {
      setMessage("List is empty")
      return
    }

    // Create a deep copy of the list
    const newHead = JSON.parse(JSON.stringify(head))
    const current = newHead
    const index = 0
    let found = false

    // Reset all highlights
    const resetHighlights = (node: Node | null) => {
      if (!node) return
      node.highlight = undefined
      if (node.next) resetHighlights(node.next)
    }

    resetHighlights(newHead)

    // Search for the value
    const searchStep = (node: Node | null, i: number) => {
      if (!node) {
        if (!found) {
          setMessage(`Value ${value} not found`)
        }
        return
      }

      setTimeout(() => {
        const updatedHead = JSON.parse(JSON.stringify(newHead))
        let temp = updatedHead

        // Navigate to the current node
        for (let j = 0; j < i; j++) {
          if (temp.next) temp = temp.next
        }

        temp.highlight = "search"
        setHead(updatedHead)

        if (node.value === value) {
          found = true
          setMessage(`Found ${value} at position ${i}`)
        } else {
          searchStep(node.next, i + 1)
        }
      }, i * 500)
    }

    searchStep(newHead, 0)
    setInputValue("")
  }

  // Get linked list code
  const getLinkedListCode = () => {
    switch (currentTab) {
      case "insert":
        return `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Insert at beginning - O(1)
function insertAtBeginning(head, value) {
  const newNode = new Node(value);
  newNode.next = head;
  return newNode; // New head
}

// Insert at end - O(n)
function insertAtEnd(head, value) {
  const newNode = new Node(value);
  
  if (!head) {
    return newNode;
  }
  
  let current = head;
  while (current.next) {
    current = current.next;
  }
  
  current.next = newNode;
  return head;
}

// Insert at position - O(n)
function insertAtPosition(head, value, position) {
  if (position === 0) {
    return insertAtBeginning(head, value);
  }
  
  const newNode = new Node(value);
  let current = head;
  let index = 0;
  
  while (current && index < position - 1) {
    current = current.next;
    index++;
  }
  
  if (!current) return head; // Position out of bounds
  
  newNode.next = current.next;
  current.next = newNode;
  return head;
}`
      case "delete":
        return `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Delete from beginning - O(1)
function deleteFromBeginning(head) {
  if (!head) return null;
  return head.next;
}

// Delete from end - O(n)
function deleteFromEnd(head) {
  if (!head || !head.next) return null;
  
  let current = head;
  
  // Find the second last node
  while (current.next && current.next.next) {
    current = current.next;
  }
  
  current.next = null;
  return head;
}

// Delete at position - O(n)
function deleteAtPosition(head, position) {
  if (!head) return null;
  
  if (position === 0) {
    return head.next;
  }
  
  let current = head;
  let index = 0;
  
  while (current && index < position - 1) {
    current = current.next;
    index++;
  }
  
  if (!current || !current.next) return head; // Position out of bounds
  
  current.next = current.next.next;
  return head;
}`
      case "search":
        return `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

// Search for a value - O(n)
function search(head, value) {
  let current = head;
  let position = 0;
  
  while (current) {
    if (current.value === value) {
      return position; // Found at this position
    }
    current = current.next;
    position++;
  }
  
  return -1; // Not found
}

// Get node at position - O(n)
function getNodeAtPosition(head, position) {
  if (!head) return null;
  
  let current = head;
  let index = 0;
  
  while (current && index < position) {
    current = current.next;
    index++;
  }
  
  return current; // Returns null if position is out of bounds
}`
      default:
        return ""
    }
  }

  // Render linked list
  const renderLinkedList = () => {
    if (!head) {
      return (
        <div className="flex items-center justify-center h-32 border rounded-md bg-muted/50">
          <p className="text-muted-foreground">Linked list is empty</p>
        </div>
      )
    }

    const nodes: Node[] = []
    let current: Node | null = head

    while (current) {
      nodes.push(current)
      current = current.next
    }

    return (
      <div className="flex items-center justify-start overflow-x-auto p-4 border rounded-md bg-muted/50 min-h-[128px]">
        {nodes.map((node, index) => (
          <div key={index} className="flex items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              className={`
                flex flex-col items-center justify-center w-16 h-16 rounded-full border-2 
                ${
                  node.highlight === "active"
                    ? "border-blue-500 bg-blue-100 dark:bg-blue-900"
                    : node.highlight === "new"
                      ? "border-green-500 bg-green-100 dark:bg-green-900"
                      : node.highlight === "removed"
                        ? "border-red-500 bg-red-100 dark:bg-red-900"
                        : node.highlight === "search"
                          ? "border-yellow-500 bg-yellow-100 dark:bg-yellow-900"
                          : "border-datastructure-linkedlist bg-background"
                }
                transition-all duration-300 hover:shadow-ds-linkedlist
              `}
            >
              <span className="font-mono">{node.value}</span>
            </motion.div>
            {node.next && (
              <div className="mx-2">
                <ArrowRight className="h-5 w-5 text-datastructure-linkedlist" />
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // Initialize on first render
  if (!head) {
    initializeList()
  }

  return (
    <div className="grid gap-6">
      {/* Visualization Section - Now at the top */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="ds-card ds-card-linkedlist overflow-hidden">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle>Linked List Visualization</CardTitle>
              <div className="flex space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowCode(!showCode)}
                        className="hover:bg-datastructure-linkedlist/20"
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
            <CardDescription>Visual representation of the linked list</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {renderLinkedList()}
            <div className="mt-4 flex justify-end">
              {message && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Badge
                    variant="outline"
                    className="bg-datastructure-linkedlist/10 border-datastructure-linkedlist/20"
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
          <Card className="ds-card ds-card-linkedlist h-full">
            <CardHeader>
              <CardTitle>Linked List Operations</CardTitle>
              <CardDescription>Perform operations on the linked list</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs
                value={currentTab}
                onValueChange={(value) => {
                  setCurrentTab(value)
                  setMessage(null)
                }}
              >
                <TabsList className="grid grid-cols-3 w-full">
                  <TabsTrigger value="insert" className="relative overflow-hidden group">
                    <span className="relative z-10">Insert</span>
                    <span className="absolute inset-0 bg-datastructure-linkedlist opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                  </TabsTrigger>
                  <TabsTrigger value="delete" className="relative overflow-hidden group">
                    <span className="relative z-10">Delete</span>
                    <span className="absolute inset-0 bg-datastructure-linkedlist opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                  </TabsTrigger>
                  <TabsTrigger value="search" className="relative overflow-hidden group">
                    <span className="relative z-10">Search</span>
                    <span className="absolute inset-0 bg-datastructure-linkedlist opacity-0 group-hover:opacity-20 group-data-[state=active]:opacity-20 transition-opacity" />
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="insert" className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter a value"
                      type="number"
                      className="transition-all focus:ring-2 focus:ring-datastructure-linkedlist"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={insertAtBeginning}
                            className="bg-datastructure-linkedlist hover:bg-datastructure-linkedlist/80 transition-all duration-300 hover:shadow-ds-linkedlist"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            At Beginning
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert a new node at the beginning of the list</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter a value"
                      type="number"
                      className="transition-all focus:ring-2 focus:ring-datastructure-linkedlist"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={insertAtEnd}
                            className="bg-datastructure-linkedlist hover:bg-datastructure-linkedlist/80 transition-all duration-300 hover:shadow-ds-linkedlist"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            At End
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert a new node at the end of the list</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter a value"
                      type="number"
                      className="flex-1 transition-all focus:ring-2 focus:ring-datastructure-linkedlist"
                    />
                    <Input
                      value={inputPosition}
                      onChange={(e) => setInputPosition(e.target.value)}
                      placeholder="Position"
                      type="number"
                      className="w-24 transition-all focus:ring-2 focus:ring-datastructure-linkedlist"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={insertAtPosition}
                            className="bg-datastructure-linkedlist hover:bg-datastructure-linkedlist/80 transition-all duration-300 hover:shadow-ds-linkedlist"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            At Position
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Insert a new node at the specified position</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TabsContent>

                <TabsContent value="delete" className="space-y-4 mt-4">
                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={deleteFromBeginning}
                            className="bg-datastructure-linkedlist hover:bg-datastructure-linkedlist/80 transition-all duration-300 hover:shadow-ds-linkedlist"
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            From Beginning
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete the first node from the list</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <div className="flex items-center space-x-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={deleteFromEnd}
                            className="bg-datastructure-linkedlist hover:bg-datastructure-linkedlist/80 transition-all duration-300 hover:shadow-ds-linkedlist"
                          >
                            <Minus className="h-4 w-4 mr-2" />
                            From End
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Delete the last node from the list</p>
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
                      className="transition-all focus:ring-2 focus:ring-datastructure-linkedlist"
                    />
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            onClick={searchValue}
                            className="bg-datastructure-linkedlist hover:bg-datastructure-linkedlist/80 transition-all duration-300 hover:shadow-ds-linkedlist"
                          >
                            Search
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Search for a value in the linked list</p>
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
                        onClick={resetList}
                        className="hover:border-datastructure-linkedlist hover:text-datastructure-linkedlist"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset List
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Reset the linked list to its initial state</p>
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
          <Card className="ds-card ds-card-linkedlist h-full">
            <CardHeader>
              <CardTitle>Implementation Details</CardTitle>
              <CardDescription>Code implementation and complexity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Complexity Analysis</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col p-3 border rounded-md hover:shadow-ds-linkedlist transition-all duration-300">
                      <span className="text-sm text-muted-foreground">Time Complexity</span>
                      <span className="font-mono font-bold">
                        {currentTab === "insert" || currentTab === "delete"
                          ? operation === "insert-beginning" || operation === "delete-beginning"
                            ? "O(1)"
                            : "O(n)"
                          : "O(n)"}
                      </span>
                    </div>
                    <div className="flex flex-col p-3 border rounded-md hover:shadow-ds-linkedlist transition-all duration-300">
                      <span className="text-sm text-muted-foreground">Space Complexity</span>
                      <span className="font-mono font-bold">O(1)</span>
                    </div>
                  </div>
                </div>

                <div>
                  <Accordion type="single" collapsible defaultValue="item-1">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="hover:text-datastructure-linkedlist">
                        <div className="flex items-center">
                          <Info className="h-4 w-4 mr-2" />
                          Linked List Description
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        {currentTab === "insert" && (
                          <p className="text-sm text-muted-foreground">
                            Insertion in a linked list can be done at the beginning (O(1)), at the end (O(n)), or at a
                            specific position (O(n)). When inserting at the beginning, we simply create a new node and
                            point it to the current head. For other positions, we need to traverse the list to find the
                            insertion point.
                          </p>
                        )}
                        {currentTab === "delete" && (
                          <p className="text-sm text-muted-foreground">
                            Deletion in a linked list can be done from the beginning (O(1)), from the end (O(n)), or
                            from a specific position (O(n)). When deleting from the beginning, we simply update the head
                            pointer. For other positions, we need to traverse the list to find the node to delete.
                          </p>
                        )}
                        {currentTab === "search" && (
                          <p className="text-sm text-muted-foreground">
                            Searching in a linked list requires traversing the list from the head until we find the
                            target value or reach the end. This operation has a time complexity of O(n) in the worst
                            case, where n is the number of nodes in the list.
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
          <Card className="ds-card ds-card-linkedlist">
            <CardHeader>
              <CardTitle>Code Implementation</CardTitle>
              <CardDescription>
                JavaScript implementation of{" "}
                {currentTab === "insert"
                  ? "Linked List Insertion"
                  : currentTab === "delete"
                    ? "Linked List Deletion"
                    : "Linked List Search"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={getLinkedListCode()} language="javascript" />
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  )
}
