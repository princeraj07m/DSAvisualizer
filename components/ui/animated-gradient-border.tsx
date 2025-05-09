import type React from "react"
interface AnimatedGradientBorderProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedGradientBorder({ children, className = "" }: AnimatedGradientBorderProps) {
  return <div className={`animated-border ${className}`}>{children}</div>
}
