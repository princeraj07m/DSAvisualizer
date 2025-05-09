"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Minus, RotateCcw, Search, Hash } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { AnimatedGradientBorder } from "@/components/ui/animated-gradient-border"
import { motion } from "framer-motion"
import { Slider } from "@/components/ui/slider"

interface HashEntry {
  key: string
  value: string
  highlight?: "active" | "new" | "removed" | "collision" | "search"
}

export function HashTableVisualizer() {
  const [hashTable, setHashTable] = useState<(HashEntry | null)[]>([])
  const [inputKey, setInputKey] = useState("")
  const [inputValue, setInputValue] = useState("")
  const [operation, setOperation] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState("insert")
  const [tableSize, setTableSize] = useState(10)
  const [collisionStrategy, setCollisionStrategy] = useState<"linear" | "quadratic" | "chaining">("linear")
  const [hashFunction, setHashFunction] = useState<"simple" | "djb2" | "fnv">("simple")
  const [animationSpeed, setAnimationSpeed] = useState([50])

  // Initialize hash table
  const initializeHashTable = (size = 10) => {
    const newTable = Array(size).fill(null)
    setHashTable(newTable)
    setMessage(null)
  }

  // Reset hash table
  const resetHashTable = () => {
    initializeHashTable(tableSize)
  }

  // Hash functions
  const hashKey = (key: string): number => {
    if (hashFunction === "simple") {
      // Simple hash function - sum of char codes modulo table size
      return key.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % tableSize
    } else if (hashFunction === "djb2") {
      // DJB2 hash function
      let hash = 5381
      for (let i = 0; i < key.length; i++) {
        hash = (hash << 5) + hash + key.charCodeAt(i) // hash * 33 + c
      }
      return Math.abs(hash) % tableSize
    } else {
      // FNV-1a hash function
      const FNV_PRIME = 16777619
      const FNV_OFFSET_BASIS = 2166136261
      let hash = FNV_OFFSET_BASIS
      for (let i = 0; i < key.length; i++) {
        hash ^= key.charCodeAt(i)
        hash *= FNV_PRIME
      }
      return Math.abs(hash) % tableSize
    }
  }

  // Insert a key-value pair
  const insertEntry = async () => {
    if (!inputKey || !inputValue) {
      setMessage("Please enter both key and value")
      return
    }

    setOperation("insert")

    // Calculate hash
    const hash = hashKey(inputKey)

    // Create a copy of the hash table
    const newTable = [...hashTable]

    // Handle insertion based on collision strategy
    if (collisionStrategy === "linear") {
      // Linear probing
      let index = hash
      let probeCount = 0

      // Highlight the initial hash position
      newTable[index] = { ...newTable[index], highlight: "collision" }
      setHashTable([...newTable])

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed[0] * 9))

      while (probeCount < tableSize) {
        if (newTable[index] === null || newTable[index]?.key === inputKey) {
          // Found an empty slot or the same key (update)
          newTable[index] = { key: inputKey, value: inputValue, highlight: "new" }
          setHashTable([...newTable])
          setMessage(`Inserted ${inputKey}:${inputValue} at index ${index}`)
          break
        }

        // Mark as collision
        newTable[index] = { ...newTable[index], highlight: "collision" }
        setHashTable([...newTable])

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 500 - animationSpeed[0] * 4))

        // Move to next slot (linear probing)
        index = (index + 1) % tableSize
        probeCount++

        if (probeCount >= tableSize) {
          setMessage("Hash table is full")
          break
        }
      }
    } else if (collisionStrategy === "quadratic") {
      // Quadratic probing
      let index = hash
      let i = 0

      // Highlight the initial hash position
      newTable[index] = { ...newTable[index], highlight: "collision" }
      setHashTable([...newTable])

      // Wait for animation
      await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed[0] * 9))

      while (i < tableSize) {
        if (newTable[index] === null || newTable[index]?.key === inputKey) {
          // Found an empty slot or the same key (update)
          newTable[index] = { key: inputKey, value: inputValue, highlight: "new" }
          setHashTable([...newTable])
          setMessage(`Inserted ${inputKey}:${inputValue} at index ${index}`)
          break
        }

        // Mark as collision
        newTable[index] = { ...newTable[index], highlight: "collision" }
        setHashTable([...newTable])

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 500 - animationSpeed[0] * 4))

        // Move to next slot (quadratic probing)
        i++
        index = (hash + i * i) % tableSize

        if (i >= tableSize) {
          setMessage("Hash table is full")
          break
        }
      }
    } else {
      // Chaining (simplified for visualization)
      // In a real implementation, each slot would be a linked list
      // Here we'll just concatenate values with a separator
      if (newTable[hash] === null) {
        newTable[hash] = { key: inputKey, value: inputValue, highlight: "new" }
      } else {
        // Mark as collision
        newTable[hash] = {
          ...newTable[hash],
          highlight: "collision",
        }
        setHashTable([...newTable])

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed[0] * 9))

        // Add to chain
        newTable[hash] = {
          key: newTable[hash]?.key + " → " + inputKey,
          value: newTable[hash]?.value + " → " + inputValue,
          highlight: "new",
        }
      }

      setHashTable([...newTable])
      setMessage(`Inserted ${inputKey}:${inputValue} at index ${hash}`)
    }

    setInputKey("")
    setInputValue("")

    // Clear highlights after animation
    setTimeout(() => {
      setHashTable((prev) => prev.map((entry) => (entry ? { ...entry, highlight: undefined } : null)))
    }, 2000)
  }

  // Remove a key-value pair
  const removeEntry = async () => {
    if (!inputKey) {
      setMessage("Please enter a key to remove")
      return
    }

    setOperation("remove")

    // Calculate hash
    const hash = hashKey(inputKey)

    // Create a copy of the hash table
    const newTable = [...hashTable]

    // Handle removal based on collision strategy
    if (collisionStrategy === "linear") {
      // Linear probing
      let index = hash
      let probeCount = 0

      while (probeCount < tableSize) {
        if (newTable[index] === null) {
          // Key not found
          setMessage(`Key ${inputKey} not found`)
          break
        }

        if (newTable[index]?.key === inputKey) {
          // Found the key
          newTable[index] = { ...newTable[index], highlight: "removed" }
          setHashTable([...newTable])

          // Wait for animation
          await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed[0] * 9))

          // Remove the entry
          newTable[index] = null
          setHashTable([...newTable])
          setMessage(`Removed key ${inputKey}`)
          break
        }

        // Mark as searched
        newTable[index] = { ...newTable[index], highlight: "search" }
        setHashTable([...newTable])

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 500 - animationSpeed[0] * 4))

        // Move to next slot (linear probing)
        index = (index + 1) % tableSize
        probeCount++

        if (probeCount >= tableSize) {
          setMessage(`Key ${inputKey} not found`)
          break
        }
      }
    } else if (collisionStrategy === "quadratic") {
      // Quadratic probing
      let index = hash
      let i = 0

      while (i < tableSize) {
        if (newTable[index] === null) {
          // Key not found
          setMessage(`Key ${inputKey} not found`)
          break
        }

        if (newTable[index]?.key === inputKey) {
          // Found the key
          newTable[index] = { ...newTable[index], highlight: "removed" }
          setHashTable([...newTable])

          // Wait for animation
          await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed[0] * 9))

          // Remove the entry
          newTable[index] = null
          setHashTable([...newTable])
          setMessage(`Removed key ${inputKey}`)
          break
        }

        // Mark as searched
        newTable[index] = { ...newTable[index], highlight: "search" }
        setHashTable([...newTable])

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 500 - animationSpeed[0] * 4))

        // Move to next slot (quadratic probing)
        i++
        index = (hash + i * i) % tableSize

        if (i >= tableSize) {
          setMessage(`Key ${inputKey} not found`)
          break
        }
      }
    } else {
      // Chaining
      if (newTable[hash] === null) {
        setMessage(`Key ${inputKey} not found`)
      } else {
        // Check if key is in the chain
        const keys = newTable[hash]?.key.split(" → ") || []
        const values = newTable[hash]?.value.split(" → ") || []

        const keyIndex = keys.indexOf(inputKey)

        if (keyIndex === -1) {
          // Key not found
          newTable[hash] = { ...newTable[hash], highlight: "search" }
          setHashTable([...newTable])

          // Wait for animation
          await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed[0] * 9))

          setMessage(`Key ${inputKey} not found`)
        } else {
          // Found the key
          newTable[hash] = { ...newTable[hash], highlight: "removed" }
          setHashTable([...newTable])

          // Wait for animation
          await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed[0] * 9))

          // Remove the key from the chain
          keys.splice(keyIndex, 1)
          values.splice(keyIndex, 1)

          if (keys.length === 0) {
            // Chain is empty
            newTable[hash] = null
          } else {
            // Update chain
            newTable[hash] = {
              key: keys.join(" → "),
              value: values.join(" → "),
              highlight: undefined,
            }
          }

          setHashTable([...newTable])
          setMessage(`Removed key ${inputKey}`)
        }
      }
    }

    setInputKey("")

    // Clear highlights after animation
    setTimeout(() => {
      setHashTable((prev) => prev.map((entry) => (entry ? { ...entry, highlight: undefined } : null)))
    }, 2000)
  }

  // Search for a key
  const searchEntry = async () => {
    if (!inputKey) {
      setMessage("Please enter a key to search")
      return
    }

    setOperation("search")

    // Calculate hash
    const hash = hashKey(inputKey)

    // Create a copy of the hash table
    const newTable = [...hashTable]

    // Handle search based on collision strategy
    if (collisionStrategy === "linear") {
      // Linear probing
      let index = hash
      let probeCount = 0

      while (probeCount < tableSize) {
        if (newTable[index] === null) {
          // Key not found
          setMessage(`Key ${inputKey} not found`)
          break
        }

        // Mark as searched
        newTable[index] = { ...newTable[index], highlight: "search" }

        setHashTable([...newTable])

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 500 - animationSpeed[0] * 4))

        if (newTable[index]?.key === inputKey) {
          // Found the key
          newTable[index] = { ...newTable[index], highlight: "active" }
          setHashTable([...newTable])
          setMessage(`Found key ${inputKey} with value ${newTable[index]?.value} at index ${index}`)
          break
        }

        // Move to next slot (linear probing)
        index = (index + 1) % tableSize
        probeCount++

        if (probeCount >= tableSize) {
          setMessage(`Key ${inputKey} not found`)
          break
        }
      }
    } else if (collisionStrategy === "quadratic") {
      // Quadratic probing
      let index = hash
      let i = 0

      while (i < tableSize) {
        if (newTable[index] === null) {
          // Key not found
          setMessage(`Key ${inputKey} not found`)
          break
        }

        // Mark as searched
        newTable[index] = { ...newTable[index], highlight: "search" }
        setHashTable([...newTable])

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 500 - animationSpeed[0] * 4))

        if (newTable[index]?.key === inputKey) {
          // Found the key
          newTable[index] = { ...newTable[index], highlight: "active" }
          setHashTable([...newTable])
          setMessage(`Found key ${inputKey} with value ${newTable[index]?.value} at index ${index}`)
          break
        }

        // Move to next slot (quadratic probing)
        i++
        index = (hash + i * i) % tableSize

        if (i >= tableSize) {
          setMessage(`Key ${inputKey} not found`)
          break
        }
      }
    } else {
      // Chaining
      if (newTable[hash] === null) {
        setMessage(`Key ${inputKey} not found`)
      } else {
        // Mark as searched
        newTable[hash] = { ...newTable[hash], highlight: "search" }
        setHashTable([...newTable])

        // Wait for animation
        await new Promise((resolve) => setTimeout(resolve, 1000 - animationSpeed[0] * 9))

        // Check if key is in the chain
        const keys = newTable[hash]?.key.split(" → ") || []
        const values = newTable[hash]?.value.split(" → ") || []

        const keyIndex = keys.indexOf(inputKey)

        if (keyIndex === -1) {
          // Key not found
          setMessage(`Key ${inputKey} not found`)
        } else {
          // Found the key
          newTable[hash] = { ...newTable[hash], highlight: "active" }
          setHashTable([...newTable])
          setMessage(`Found key ${inputKey} with value ${values[keyIndex]} at index ${hash}`)
        }
      }
    }

    setInputKey("")

    // Clear highlights after animation
    setTimeout(() => {
      setHashTable((prev) => prev.map((entry) => (entry ? { ...entry, highlight: undefined } : null)))
    }, 2000)
  }

  // Change table size
  const changeTableSize = (size: number) => {
    setTableSize(size)
    initializeHashTable(size)
    setMessage(`Hash table size changed to ${size}`)
  }

  // Get hash table code
  const getHashTableCode = () => {
    if (collisionStrategy === "linear") {
      return `class HashTable {
  constructor(size = 10) {
    this.size = size;
    this.table = new Array(size).fill(null);
  }
  
  // Hash function
  hash(key) {
    // Simple hash function for strings
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % this.size;
  }
  
  // Insert a key-value pair - O(1) average, O(n) worst
  set(key, value) {
    const index = this.hash(key);
    
    // Linear probing for collision resolution
    let currentIndex = index;
    let i = 0;
    
    while (i < this.size) {
      // Found an empty slot or the same key (update)
      if (this.table[currentIndex] === null || 
          this.table[currentIndex].key === key) {
        this.table[currentIndex] = { key, value };
        return true;
      }
      
      // Move to next slot (linear probing)
      currentIndex = (currentIndex + 1) % this.size;
      i++;
    }
    
    // Hash table is full
    return false;
  }
  
  // Get a value by key - O(1) average, O(n) worst
  get(key) {
    const index = this.hash(key);
    
    // Linear probing to find the key
    let currentIndex = index;
    let i = 0;
    
    while (this.table[currentIndex] !== null && i < this.size) {
      if (this.table[currentIndex].key === key) {
        return this.table[currentIndex].value;
      }
      
      // Move to next slot (linear probing)
      currentIndex = (currentIndex + 1) % this.size;
      i++;
    }
    
    // Key not found
    return undefined;
  }
  
  // Remove a key-value pair - O(1) average, O(n) worst
  remove(key) {
    const index = this.hash(key);
    
    // Linear probing to find the key
    let currentIndex = index;
    let i = 0;
    
    while (this.table[currentIndex] !== null && i < this.size) {
      if (this.table[currentIndex].key === key) {
        // Found the key, remove it
        this.table[currentIndex] = null;
        
        // Rehash all elements in the same cluster
        this.rehash(currentIndex);
        return true;
      }
      
      // Move to next slot (linear probing)
      currentIndex = (currentIndex + 1) % this.size;
      i++;
    }
    
    // Key not found
    return false;
  }
  
  // Rehash elements after removal
  rehash(startIndex) {
    let currentIndex = (startIndex + 1) % this.size;
    
    while (this.table[currentIndex] !== null) {
      const entry = this.table[currentIndex];
      this.table[currentIndex] = null;
      this.set(entry.key, entry.value);
      
      currentIndex = (currentIndex + 1) % this.size;
    }
  }
}`
    } else if (collisionStrategy === "quadratic") {
      return `class HashTable {
  constructor(size = 10) {
    this.size = size;
    this.table = new Array(size).fill(null);
  }
  
  // Hash function
  hash(key) {
    // Simple hash function for strings
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % this.size;
  }
  
  // Insert a key-value pair - O(1) average, O(n) worst
  set(key, value) {
    const index = this.hash(key);
    
    // Quadratic probing for collision resolution
    let i = 0;
    let currentIndex = index;
    
    while (i < this.size) {
      // Found an empty slot or the same key (update)
      if (this.table[currentIndex] === null || 
          this.table[currentIndex].key === key) {
        this.table[currentIndex] = { key, value };
        return true;
      }
      
      // Move to next slot (quadratic probing)
      i++;
      currentIndex = (index + i * i) % this.size;
    }
    
    // Hash table is full
    return false;
  }
  
  // Get a value by key - O(1) average, O(n) worst
  get(key) {
    const index = this.hash(key);
    
    // Quadratic probing to find the key
    let i = 0;
    let currentIndex = index;
    
    while (this.table[currentIndex] !== null && i < this.size) {
      if (this.table[currentIndex].key === key) {
        return this.table[currentIndex].value;
      }
      
      // Move to next slot (quadratic probing)
      i++;
      currentIndex = (index + i * i) % this.size;
    }
    
    // Key not found
    return undefined;
  }
  
  // Remove a key-value pair - O(1) average, O(n) worst
  remove(key) {
    const index = this.hash(key);
    
    // Quadratic probing to find the key
    let i = 0;
    let currentIndex = index;
    
    while (this.table[currentIndex] !== null && i < this.size) {
      if (this.table[currentIndex].key === key) {
        // Found the key, remove it
        this.table[currentIndex] = null;
        return true;
      }
      
      // Move to next slot (quadratic probing)
      i++;
      currentIndex = (index + i * i) % this.size;
    }
    
    // Key not found
    return false;
  }
}`
    } else {
      return `class HashTable {
  constructor(size = 10) {
    this.size = size;
    this.table = new Array(size).fill(null).map(() => []);
  }
  
  // Hash function
  hash(key) {
    // Simple hash function for strings
    let hash = 0;
    for (let i = 0; i < key.length; i++) {
      hash += key.charCodeAt(i);
    }
    return hash % this.size;
  }
  
  // Insert a key-value pair - O(1) average
  set(key, value) {
    const index = this.hash(key);
    
    // Check if key already exists
    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i].key === key) {
        // Update existing key
        this.table[index][i].value = value;
        return;
      }
    }
    
    // Add new key-value pair to chain
    this.table[index].push({ key, value });
  }
  
  // Get a value by key - O(1) average
  get(key) {
    const index = this.hash(key);
    
    // Search for key in the chain
    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i].key === key) {
        return this.table[index][i].value;
      }
    }
    
    // Key not found
    return undefined;
  }
  
  // Remove a key-value pair - O(1) average
  remove(key) {
    const index = this.hash(key);
    
    // Search for key in the chain
    for (let i = 0; i < this.table[index].length; i++) {
      if (this.table[index][i].key === key) {
        // Remove the entry
        this.table[index].splice(i, 1);
        return true;
      }
    }
    
    // Key not found
    return false;
  }
}`
    }
  }

  // Initialize on first render
  useEffect(() => {
    if (hashTable.length === 0) {
      initializeHashTable(tableSize)
    }
  }, [hashTable.length, tableSize])

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <AnimatedGradientBorder className="rounded-lg">
          <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Hash Table Operations</span>
                <div className="flex items-center space-x-2">
                  <Badge
                    variant="outline"
                    className="bg-datastructure-hash/20 cursor-pointer transition-all hover:scale-105"
                    onClick={() =>
                      setCollisionStrategy(
                        collisionStrategy === "linear"
                          ? "quadratic"
                          : collisionStrategy === "quadratic"
                            ? "chaining"
                            : "linear",
                      )
                    }
                  >
                    {collisionStrategy === "linear"
                      ? "Linear Probing"
                      : collisionStrategy === "quadratic"
                        ? "Quadratic Probing"
                        : "Chaining"}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-datastructure-hash/20 cursor-pointer transition-all hover:scale-105"
                    onClick={() =>
                      setHashFunction(hashFunction === "simple" ? "djb2" : hashFunction === "djb2" ? "fnv" : "simple")
                    }
                  >
                    {hashFunction === "simple" ? "Simple Hash" : hashFunction === "djb2" ? "DJB2 Hash" : "FNV Hash"}
                  </Badge>
                </div>
              </CardTitle>
              <CardDescription>Visualize hash table data structure operations</CardDescription>
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
                  <TabsTrigger value="insert">Insert</TabsTrigger>
                  <TabsTrigger value="remove">Remove</TabsTrigger>
                  <TabsTrigger value="search">Search</TabsTrigger>
                </TabsList>

                <TabsContent value="insert" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      value={inputKey}
                      onChange={(e) => setInputKey(e.target.value)}
                      placeholder="Enter key"
                      className="transition-all focus:ring-2 focus:ring-datastructure-hash"
                    />
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Enter value"
                      className="transition-all focus:ring-2 focus:ring-datastructure-hash"
                    />
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={insertEntry}
                          className="bg-datastructure-hash hover:bg-datastructure-hash/80 transition-all duration-300 hover:shadow-ds-hash"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Insert
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Insert a key-value pair into the hash table</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsContent>

                <TabsContent value="remove" className="space-y-4 mt-4">
                  <Input
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Enter key to remove"
                    className="transition-all focus:ring-2 focus:ring-datastructure-hash"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={removeEntry}
                          className="bg-datastructure-hash hover:bg-datastructure-hash/80 transition-all duration-300 hover:shadow-ds-hash"
                        >
                          <Minus className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Remove a key-value pair from the hash table</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsContent>

                <TabsContent value="search" className="space-y-4 mt-4">
                  <Input
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                    placeholder="Enter key to search"
                    className="transition-all focus:ring-2 focus:ring-datastructure-hash"
                  />
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          onClick={searchEntry}
                          className="bg-datastructure-hash hover:bg-datastructure-hash/80 transition-all duration-300 hover:shadow-ds-hash"
                        >
                          <Search className="h-4 w-4 mr-2" />
                          Search
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Search for a key in the hash table</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TabsContent>
              </Tabs>

              <div className="mt-4 space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Table Size: {tableSize}</label>
                  <div className="flex items-center space-x-2">
                    {[5, 10, 15, 20].map((size) => (
                      <Button
                        key={size}
                        variant={tableSize === size ? "default" : "outline"}
                        size="sm"
                        onClick={() => changeTableSize(size)}
                        className={
                          tableSize === size
                            ? "bg-datastructure-hash hover:bg-datastructure-hash/80"
                            : "hover:border-datastructure-hash hover:text-datastructure-hash"
                        }
                      >
                        {size}
                      </Button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Animation Speed</label>
                  <Slider
                    value={animationSpeed}
                    onValueChange={setAnimationSpeed}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                </div>

                <Button
                  variant="outline"
                  onClick={resetHashTable}
                  className="transition-all duration-300 hover:border-datastructure-hash hover:text-datastructure-hash"
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset Hash Table
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
                  <Badge variant="outline" className="bg-datastructure-hash/10 border-datastructure-hash/20">
                    {message}
                  </Badge>
                </motion.div>
              )}
            </CardFooter>
          </Card>
        </AnimatedGradientBorder>

        <Card className="ds-card ds-card-hash">
          <CardHeader>
            <CardTitle>Implementation Details</CardTitle>
            <CardDescription>Code implementation and complexity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Complexity Analysis</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col p-3 border rounded-md hover:shadow-ds-hash transition-all duration-300">
                    <span className="text-sm text-muted-foreground">Time Complexity</span>
                    <span className="font-mono font-bold">
                      O(1) average, {collisionStrategy === "chaining" ? "O(n) worst" : "O(n) worst"}
                    </span>
                  </div>
                  <div className="flex flex-col p-3 border rounded-md hover:shadow-ds-hash transition-all duration-300">
                    <span className="text-sm text-muted-foreground">Space Complexity</span>
                    <span className="font-mono font-bold">O(n)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Code Implementation</h3>
                <CodeBlock code={getHashTableCode()} language="javascript" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="ds-card ds-card-hash overflow-hidden">
        <CardHeader>
          <CardTitle>Visualization</CardTitle>
          <CardDescription>Visual representation of the hash table</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-2">
            {hashTable.map((entry, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <div
                  className={`
                    flex items-center p-3 border rounded-md transition-all duration-300
                    ${
                      entry?.highlight === "active"
                        ? "bg-blue-100 dark:bg-blue-900 border-blue-500"
                        : entry?.highlight === "new"
                          ? "bg-green-100 dark:bg-green-900 border-green-500"
                          : entry?.highlight === "removed"
                            ? "bg-red-100 dark:bg-red-900 border-red-500"
                            : entry?.highlight === "collision"
                              ? "bg-yellow-100 dark:bg-yellow-900 border-yellow-500"
                              : entry?.highlight === "search"
                                ? "bg-purple-100 dark:bg-purple-900 border-purple-500"
                                : "bg-muted/50"
                    }
                    ${entry ? "hover:shadow-ds-hash" : ""}
                  `}
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-datastructure-hash/20 mr-3">
                    <Hash className="h-4 w-4 text-datastructure-hash" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm">Index: {index}</span>
                      <span className="text-xs text-muted-foreground">
                        Hash: {hashKey(entry?.key || "").toString()}
                      </span>
                    </div>
                    {entry ? (
                      <div className="mt-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium">Key: {entry.key}</span>
                          <span>Value: {entry.value}</span>
                        </div>
                      </div>
                    ) : (
                      <div className="text-sm text-muted-foreground italic">Empty</div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
