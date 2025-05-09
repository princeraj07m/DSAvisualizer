import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ModeToggle } from "@/components/mode-toggle"
import { Github } from "lucide-react"

export const metadata: Metadata = {
  title: "Learn DSA",
  description: "Learn data structures and algorithms with interactive visualizations",
}

export default function LearnPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="font-bold text-xl flex items-center gap-2">
              <span className="text-primary">DSA</span> Visualizer
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" asChild>
              <Link href="https://github.com/princeraj07m" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1 container py-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Learn Data Structures & Algorithms</h1>
            <p className="text-muted-foreground">Comprehensive guides and tutorials to master DSA concepts</p>
          </div>

          <Tabs defaultValue="data-structures" className="w-full">
            <TabsList className="grid grid-cols-2 w-full max-w-md">
              <TabsTrigger value="data-structures">Data Structures</TabsTrigger>
              <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
            </TabsList>
            <TabsContent value="data-structures" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Arrays</CardTitle>
                    <CardDescription>The most basic data structure</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn about array operations, time complexity, and common techniques like two pointers and sliding
                      window.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/visualizer?tab=arrays">Explore Arrays</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Linked Lists</CardTitle>
                    <CardDescription>Linear collection of elements</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Understand singly and doubly linked lists, operations, and common patterns like fast and slow
                      pointers.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/visualizer?tab=linked-lists">Explore Linked Lists</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Stacks & Queues</CardTitle>
                    <CardDescription>LIFO and FIFO data structures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn about stack and queue implementations, operations, and applications like expression
                      evaluation.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/visualizer?tab=stack-queue">Explore Stacks & Queues</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Trees</CardTitle>
                    <CardDescription>Hierarchical data structures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Understand binary trees, binary search trees, traversals, and balanced trees like AVL and
                      Red-Black trees.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/visualizer?tab=trees">Explore Trees</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Graphs</CardTitle>
                    <CardDescription>Networks of connected nodes</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn about graph representations, traversals, and algorithms like Dijkstra's and Kruskal's.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/visualizer?tab=graphs">Explore Graphs</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Hash Tables</CardTitle>
                    <CardDescription>Key-value data structures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Understand hash functions, collision resolution, and applications like caching and indexing.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/learn/hash-tables">Explore Hash Tables</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
            <TabsContent value="algorithms" className="mt-6">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Sorting Algorithms</CardTitle>
                    <CardDescription>Arranging elements in order</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn about bubble sort, merge sort, quick sort, and other sorting algorithms with their time and
                      space complexity.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/visualizer?tab=arrays">Explore Sorting</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Searching Algorithms</CardTitle>
                    <CardDescription>Finding elements efficiently</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Understand linear search, binary search, and other searching techniques for different data
                      structures.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/learn/searching">Explore Searching</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Graph Algorithms</CardTitle>
                    <CardDescription>Solving graph problems</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn about BFS, DFS, shortest path algorithms, minimum spanning trees, and topological sorting.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/visualizer?tab=graphs">Explore Graph Algorithms</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Dynamic Programming</CardTitle>
                    <CardDescription>Breaking problems into subproblems</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Understand memoization, tabulation, and common DP patterns for solving complex optimization
                      problems.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/learn/dynamic-programming">Explore DP</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Greedy Algorithms</CardTitle>
                    <CardDescription>Making locally optimal choices</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Learn about greedy approach, when to use it, and common problems like activity selection and
                      Huffman coding.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/learn/greedy-algorithms">Explore Greedy</Link>
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Divide and Conquer</CardTitle>
                    <CardDescription>Breaking problems into smaller parts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Understand the divide and conquer paradigm and algorithms like merge sort, quick sort, and binary
                      search.
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild>
                      <Link href="/learn/divide-conquer">Explore Divide & Conquer</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <h2 className="text-2xl font-bold tracking-tight mb-4">Big-O Notation Cheat Sheet</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Notation</th>
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Description</th>
                    <th className="py-2 px-4 text-left">Example</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">O(1)</td>
                    <td className="py-2 px-4">Constant</td>
                    <td className="py-2 px-4">Operation takes the same time regardless of input size</td>
                    <td className="py-2 px-4">Array access, hash table lookup</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">O(log n)</td>
                    <td className="py-2 px-4">Logarithmic</td>
                    <td className="py-2 px-4">Time increases logarithmically with input size</td>
                    <td className="py-2 px-4">Binary search, balanced BST operations</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">O(n)</td>
                    <td className="py-2 px-4">Linear</td>
                    <td className="py-2 px-4">Time increases linearly with input size</td>
                    <td className="py-2 px-4">Linear search, array traversal</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">O(n log n)</td>
                    <td className="py-2 px-4">Linearithmic</td>
                    <td className="py-2 px-4">Slightly worse than linear</td>
                    <td className="py-2 px-4">Merge sort, heap sort</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">O(n²)</td>
                    <td className="py-2 px-4">Quadratic</td>
                    <td className="py-2 px-4">Time increases quadratically with input size</td>
                    <td className="py-2 px-4">Bubble sort, insertion sort</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4 font-mono">O(2ⁿ)</td>
                    <td className="py-2 px-4">Exponential</td>
                    <td className="py-2 px-4">Time doubles with each additional input element</td>
                    <td className="py-2 px-4">Recursive Fibonacci, generating subsets</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            © 2025 DSA Visualizer. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/about" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              About
            </Link>
            <Link href="/contact" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Contact
            </Link>
            <Link href="/privacy" className="text-sm text-muted-foreground underline-offset-4 hover:underline">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
