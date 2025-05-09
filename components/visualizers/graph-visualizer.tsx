"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, RotateCcw, Play, Pause, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/code-block"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface GraphNode {
  id: string
  x: number
  y: number
  highlight?: "active" | "visited" | "current" | "path"
}

interface GraphEdge {
  source: string
  target: string
  highlight?: boolean
}

export function GraphVisualizer() {
  const [nodes, setNodes] = useState<GraphNode[]>([])
  const [edges, setEdges] = useState<GraphEdge[]>([])
  const [sourceNode, setSourceNode] = useState("")
  const [targetNode, setTargetNode] = useState("")
  const [startNode, setStartNode] = useState("")
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [traversalSteps, setTraversalSteps] = useState<{ nodes: GraphNode[]; edges: GraphEdge[] }[]>([])
  const [message, setMessage] = useState<string | null>(null)
  const [currentTab, setCurrentTab] = useState("create")
  const [currentAlgorithm, setCurrentAlgorithm] = useState("bfs")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)

  // Initialize graph
  const initializeGraph = () => {
    const initialNodes: GraphNode[] = [
      { id: "A", x: 100, y: 100 },
      { id: "B", x: 250, y: 50 },
      { id: "C", x: 400, y: 100 },
      { id: "D", x: 100, y: 250 },
      { id: "E", x: 250, y: 300 },
      { id: "F", x: 400, y: 250 },
    ]

    const initialEdges: GraphEdge[] = [
      { source: "A", target: "B" },
      { source: "A", target: "D" },
      { source: "B", target: "C" },
      { source: "B", target: "E" },
      { source: "C", target: "F" },
      { source: "D", target: "E" },
      { source: "E", target: "F" },
    ]

    setNodes(initialNodes)
    setEdges(initialEdges)
    setMessage(null)
    setTraversalSteps([])
    setCurrentStep(0)
    setIsPlaying(false)
  }

  // Reset graph
  const resetGraph = () => {
    initializeGraph()
  }

  // Add edge
  const addEdge = () => {
    if (!sourceNode || !targetNode) {
      setMessage("Please select both source and target nodes")
      return
    }

    if (sourceNode === targetNode) {
      setMessage("Source and target nodes must be different")
      return
    }

    // Check if edge already exists
    const edgeExists = edges.some(
      (edge) =>
        (edge.source === sourceNode && edge.target === targetNode) ||
        (edge.source === targetNode && edge.target === sourceNode),
    )

    if (edgeExists) {
      setMessage("Edge already exists")
      return
    }

    setEdges([...edges, { source: sourceNode, target: targetNode }])
    setMessage(`Added edge from ${sourceNode} to ${targetNode}`)
    setSourceNode("")
    setTargetNode("")
  }

  // Generate adjacency list
  const generateAdjacencyList = () => {
    const adjList: Record<string, string[]> = {}

    // Initialize all nodes with empty arrays
    nodes.forEach((node) => {
      adjList[node.id] = []
    })

    // Add edges
    edges.forEach((edge) => {
      adjList[edge.source].push(edge.target)
      adjList[edge.target].push(edge.source) // For undirected graph
    })

    return adjList
  }

  // BFS traversal
  const bfsTraversal = () => {
    if (!startNode) {
      setMessage("Please select a start node")
      return
    }

    const adjList = generateAdjacencyList()
    const visited: Record<string, boolean> = {}
    const queue: string[] = []
    const steps: { nodes: GraphNode[]; edges: GraphEdge[] }[] = []

    // Initialize all nodes as not visited
    nodes.forEach((node) => {
      visited[node.id] = false
    })

    // Start BFS
    queue.push(startNode)
    visited[startNode] = true

    // Create initial step
    const initialNodes = nodes.map((node) => ({
      ...node,
      highlight: node.id === startNode ? "current" : undefined,
    }))

    steps.push({ nodes: initialNodes, edges: [...edges] })

    while (queue.length > 0) {
      const currentNode = queue.shift()!

      // Process all adjacent nodes
      for (const neighbor of adjList[currentNode]) {
        if (!visited[neighbor]) {
          queue.push(neighbor)
          visited[neighbor] = true

          // Create step for this visit
          const newNodes = nodes.map((node) => ({
            ...node,
            highlight:
              node.id === neighbor
                ? "current"
                : node.id === currentNode
                  ? "active"
                  : visited[node.id]
                    ? "visited"
                    : undefined,
          }))

          const newEdges = edges.map((edge) => ({
            ...edge,
            highlight:
              (edge.source === currentNode && edge.target === neighbor) ||
              (edge.source === neighbor && edge.target === currentNode),
          }))

          steps.push({ nodes: newNodes, edges: newEdges })
        }
      }

      // Create step after processing current node
      const updatedNodes = nodes.map((node) => ({
        ...node,
        highlight: queue.includes(node.id)
          ? "current"
          : node.id === currentNode
            ? "active"
            : visited[node.id]
              ? "visited"
              : undefined,
      }))

      steps.push({ nodes: updatedNodes, edges: [...edges] })
    }

    setTraversalSteps(steps)
    setCurrentStep(0)
    setMessage(`BFS traversal from node ${startNode}`)
  }

  // DFS traversal
  const dfsTraversal = () => {
    if (!startNode) {
      setMessage("Please select a start node")
      return
    }

    const adjList = generateAdjacencyList()
    const visited: Record<string, boolean> = {}
    const steps: { nodes: GraphNode[]; edges: GraphEdge[] }[] = []

    // Initialize all nodes as not visited
    nodes.forEach((node) => {
      visited[node.id] = false
    })

    // Create initial step
    const initialNodes = nodes.map((node) => ({
      ...node,
      highlight: node.id === startNode ? "current" : undefined,
    }))

    steps.push({ nodes: initialNodes, edges: [...edges] })

    // DFS function
    const dfs = (node: string) => {
      visited[node] = true

      // Create step for visiting this node
      const newNodes = nodes.map((n) => ({
        ...n,
        highlight: n.id === node ? "current" : visited[n.id] ? "visited" : undefined,
      }))

      steps.push({ nodes: newNodes, edges: [...edges] })

      // Visit all adjacent nodes
      for (const neighbor of adjList[node]) {
        if (!visited[neighbor]) {
          // Create step for edge traversal
          const edgeNodes = nodes.map((n) => ({
            ...n,
            highlight: n.id === neighbor ? "current" : n.id === node ? "active" : visited[n.id] ? "visited" : undefined,
          }))

          const edgeHighlight = edges.map((edge) => ({
            ...edge,
            highlight:
              (edge.source === node && edge.target === neighbor) || (edge.source === neighbor && edge.target === node),
          }))

          steps.push({ nodes: edgeNodes, edges: edgeHighlight })

          dfs(neighbor)
        }
      }
    }

    dfs(startNode)

    setTraversalSteps(steps)
    setCurrentStep(0)
    setMessage(`DFS traversal from node ${startNode}`)
  }

  // Start traversal
  const startTraversal = () => {
    if (currentAlgorithm === "bfs") {
      bfsTraversal()
    } else if (currentAlgorithm === "dfs") {
      dfsTraversal()
    }

    setIsPlaying(true)
  }

  // Toggle play/pause
  const togglePlay = () => {
    if (currentStep >= traversalSteps.length - 1) {
      setCurrentStep(0)
      setIsPlaying(true)
    } else {
      setIsPlaying(!isPlaying)
    }
  }

  // Step forward
  const stepForward = () => {
    if (currentStep < traversalSteps.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Handle animation
  useEffect(() => {
    if (isPlaying && currentStep < traversalSteps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1)
      }, 1000)

      return () => clearTimeout(timer)
    } else if (currentStep >= traversalSteps.length - 1) {
      setIsPlaying(false)
    }
  }, [isPlaying, currentStep, traversalSteps.length])

  // Draw graph on canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get current state
    const currentNodes =
      traversalSteps.length > 0 && currentStep < traversalSteps.length ? traversalSteps[currentStep].nodes : nodes

    const currentEdges =
      traversalSteps.length > 0 && currentStep < traversalSteps.length ? traversalSteps[currentStep].edges : edges

    // Draw edges
    currentEdges.forEach((edge) => {
      const source = currentNodes.find((node) => node.id === edge.source)
      const target = currentNodes.find((node) => node.id === edge.target)

      if (source && target) {
        ctx.beginPath()
        ctx.moveTo(source.x, source.y)
        ctx.lineTo(target.x, target.y)

        if (edge.highlight) {
          ctx.strokeStyle = "#3b82f6"
          ctx.lineWidth = 3
        } else {
          ctx.strokeStyle = "#94a3b8"
          ctx.lineWidth = 2
        }

        ctx.stroke()
      }
    })

    // Draw nodes
    currentNodes.forEach((node) => {
      ctx.beginPath()
      ctx.arc(node.x, node.y, 20, 0, Math.PI * 2)

      // Set fill color based on highlight
      if (node.highlight === "current") {
        ctx.fillStyle = "#3b82f6"
      } else if (node.highlight === "active") {
        ctx.fillStyle = "#22c55e"
      } else if (node.highlight === "visited") {
        ctx.fillStyle = "#f59e0b"
      } else if (node.highlight === "path") {
        ctx.fillStyle = "#ec4899"
      } else {
        ctx.fillStyle = "#f1f5f9"
      }

      ctx.fill()
      ctx.strokeStyle = "#64748b"
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw node ID
      ctx.fillStyle = node.highlight === "current" || node.highlight === "active" ? "#ffffff" : "#1e293b"
      ctx.font = "16px monospace"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.id, node.x, node.y)
    })
  }, [nodes, edges, traversalSteps, currentStep])

  // Get algorithm code
  const getAlgorithmCode = () => {
    if (currentAlgorithm === "bfs") {
      return `// Breadth-First Search (BFS) - O(V + E)
function bfs(graph, startNode) {
  const visited = new Set();
  const queue = [startNode];
  const result = [];
  
  // Mark the start node as visited
  visited.add(startNode);
  
  while (queue.length > 0) {
    // Dequeue a vertex from queue
    const currentNode = queue.shift();
    result.push(currentNode);
    
    // Get all adjacent vertices of the dequeued vertex
    // If an adjacent vertex has not been visited, mark it
    // visited and enqueue it
    for (const neighbor of graph[currentNode]) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  
  return result;
}`
    } else {
      return `// Depth-First Search (DFS) - O(V + E)
function dfs(graph, startNode) {
  const visited = new Set();
  const result = [];
  
  function dfsHelper(node) {
    // Mark the current node as visited
    visited.add(node);
    result.push(node);
    
    // Recur for all the vertices adjacent to this vertex
    for (const neighbor of graph[node]) {
      if (!visited.has(neighbor)) {
        dfsHelper(neighbor);
      }
    }
  }
  
  dfsHelper(startNode);
  return result;
}`
    }
  }

  // Initialize on first render
  if (nodes.length === 0) {
    initializeGraph()
  }

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Graph Operations</CardTitle>
            <CardDescription>Visualize graph traversal algorithms</CardDescription>
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
                <TabsTrigger value="create">Create Graph</TabsTrigger>
                <TabsTrigger value="traverse">Traverse Graph</TabsTrigger>
              </TabsList>

              <TabsContent value="create" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Source Node</label>
                    <Select value={sourceNode} onValueChange={setSourceNode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select node" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            Node {node.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Target Node</label>
                    <Select value={targetNode} onValueChange={setTargetNode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select node" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            Node {node.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={addEdge}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Edge
                </Button>
              </TabsContent>

              <TabsContent value="traverse" className="space-y-4 mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Start Node</label>
                    <Select value={startNode} onValueChange={setStartNode}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select start node" />
                      </SelectTrigger>
                      <SelectContent>
                        {nodes.map((node) => (
                          <SelectItem key={node.id} value={node.id}>
                            Node {node.id}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 block">Algorithm</label>
                    <Select value={currentAlgorithm} onValueChange={setCurrentAlgorithm}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bfs">Breadth-First Search (BFS)</SelectItem>
                        <SelectItem value="dfs">Depth-First Search (DFS)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Button onClick={startTraversal} disabled={traversalSteps.length > 0 && isPlaying}>
                    Start Traversal
                  </Button>

                  {traversalSteps.length > 0 && (
                    <>
                      <Button variant="outline" onClick={togglePlay}>
                        {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                        {isPlaying ? "Pause" : "Play"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={stepForward}
                        disabled={isPlaying || currentStep >= traversalSteps.length - 1}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>

                {traversalSteps.length > 0 && (
                  <div className="text-sm text-muted-foreground">
                    Step: {currentStep + 1} / {traversalSteps.length}
                  </div>
                )}
              </TabsContent>
            </Tabs>

            <div className="mt-4">
              <Button variant="outline" onClick={resetGraph}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset Graph
              </Button>
            </div>
          </CardContent>
          <CardFooter>
            {message && (
              <Badge variant="outline" className="bg-primary/10 border-primary/20">
                {message}
              </Badge>
            )}
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Algorithm Details</CardTitle>
            <CardDescription>Code implementation and complexity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Complexity Analysis</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex flex-col p-3 border rounded-md">
                    <span className="text-sm text-muted-foreground">Time Complexity</span>
                    <span className="font-mono font-bold">O(V + E)</span>
                  </div>
                  <div className="flex flex-col p-3 border rounded-md">
                    <span className="text-sm text-muted-foreground">Space Complexity</span>
                    <span className="font-mono font-bold">O(V)</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Code Implementation</h3>
                <CodeBlock code={getAlgorithmCode()} language="javascript" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Visualization</CardTitle>
          <CardDescription>Visual representation of the graph</CardDescription>
        </CardHeader>
        <CardContent>
          <canvas ref={canvasRef} width={800} height={400} className="w-full h-[400px] border rounded-md bg-muted/50" />
        </CardContent>
      </Card>
    </div>
  )
}
