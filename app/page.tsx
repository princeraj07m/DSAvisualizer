import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Github } from "lucide-react"

export default function Home() {
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
              <Link href="https://github.com" className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <span>GitHub</span>
              </Link>
            </Button>
            <ModeToggle />
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-16 lg:py-20 bg-gradient-to-b from-background to-muted">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Visualize Data Structures & Algorithms
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Interactive visualizations to help you understand core DSA concepts with step-by-step animations.
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg">
                  <Link href="/visualizer">Start Exploring</Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/learn">Learn DSA</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16 lg:py-20">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <rect width="18" height="18" x="3" y="3" rx="2" />
                    <path d="M7 7h10" />
                    <path d="M7 12h10" />
                    <path d="M7 17h10" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Data Structures</h3>
                  <p className="text-muted-foreground">
                    Visualize arrays, linked lists, stacks, queues, trees, and graphs with interactive animations.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="m3 8 4-4 4 4" />
                    <path d="M7 4v16" />
                    <path d="m21 16-4 4-4-4" />
                    <path d="M17 20V4" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Algorithms</h3>
                  <p className="text-muted-foreground">
                    Step through sorting, searching, and graph algorithms with detailed visualizations.
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="rounded-full bg-primary/10 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-6 w-6 text-primary"
                  >
                    <path d="M2 12h10" />
                    <path d="M9 4v16" />
                    <path d="m3 9 3 3-3 3" />
                    <path d="M14 8h8" />
                    <path d="M18 4v16" />
                    <path d="m22 9-3 3 3 3" />
                  </svg>
                </div>
                <div className="space-y-2">
                  <h3 className="text-xl font-bold">Interactive Learning</h3>
                  <p className="text-muted-foreground">
                    Control the speed, input your own data, and see code execution in real-time.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="py-12 md:py-16 lg:py-20 bg-muted">
          <div className="container px-4 md:px-6">
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
              <div className="flex flex-col justify-center space-y-4">
                <div className="space-y-2">
                  <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Featured Visualizations</h2>
                  <p className="text-muted-foreground">
                    Explore our most popular data structure and algorithm visualizations.
                  </p>
                </div>
                <ul className="grid gap-2">
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Sorting Algorithms (Bubble, Quick, Merge)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Binary Search Trees</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Graph Traversal (BFS, DFS)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5 text-primary"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Stack & Queue Operations</span>
                  </li>
                </ul>
                <div>
                  <Button asChild>
                    <Link href="/visualizer">View All Visualizations</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-center">
                <div className="relative h-[300px] w-full overflow-hidden rounded-lg border bg-background p-2">
                  <div className="flex h-full flex-col items-center justify-center space-y-2 rounded-md border border-dashed p-4">
                    <div className="flex h-full w-full flex-col items-center justify-center space-y-2">
                      <div className="h-20 w-full rounded-md bg-primary/20"></div>
                      <div className="grid w-full grid-cols-5 gap-2">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className="h-16 rounded-md bg-primary/20"
                            style={{ height: `${(i + 1) * 20}px` }}
                          ></div>
                        ))}
                      </div>
                      <div className="flex w-full justify-center space-x-2">
                        <div className="h-8 w-8 rounded-md bg-primary/20"></div>
                        <div className="h-8 w-8 rounded-md bg-primary/20"></div>
                        <div className="h-8 w-8 rounded-md bg-primary/20"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
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
