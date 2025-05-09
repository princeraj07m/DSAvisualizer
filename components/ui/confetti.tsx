"use client"

import { useEffect, useState } from "react"
import ReactConfetti from "react-confetti"

interface ConfettiProps {
  duration?: number
}

export function Confetti({ duration = 3000 }: ConfettiProps) {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    // Set initial dimensions
    handleResize()

    // Add event listener
    window.addEventListener("resize", handleResize)

    // Set timeout to hide confetti
    const timeout = setTimeout(() => {
      setShowConfetti(false)
    }, duration)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      clearTimeout(timeout)
    }
  }, [duration])

  if (!showConfetti) return null

  return (
    <ReactConfetti
      width={dimensions.width}
      height={dimensions.height}
      recycle={false}
      numberOfPieces={200}
      gravity={0.2}
    />
  )
}
