"use client"

import { useEffect, useRef } from "react"

interface CursorGlowProps {
  className?: string
  size?: number
  colors?: string[]
  style?: React.CSSProperties
}

export function CursorGlow({ 
  className = "fixed pointer-events-none z-50 rounded-full opacity-20 blur-3xl",
  size = 384, // 96 * 4 = 384px (w-96)
  colors = ["#ff00ff", "#00ffff"],
  style = {}
}: CursorGlowProps) {
  const cursorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let rafId: number

    const handleMouseMove = (e: MouseEvent) => {
      if (!cursorRef.current) return

      // Use requestAnimationFrame for smooth performance
      rafId = requestAnimationFrame(() => {
        if (cursorRef.current) {
          const x = e.clientX - size / 2
          const y = e.clientY - size / 2
          // Use translate3d for GPU acceleration
          cursorRef.current.style.transform = `translate3d(${x}px, ${y}px, 0)`
        }
      })
    }

    window.addEventListener("mousemove", handleMouseMove, { passive: true })

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(rafId)
    }
  }, [size])

  const gradientColors = colors.length >= 2 
    ? `${colors[0]} 0%, ${colors[1]} 50%, transparent 70%`
    : `${colors[0] || '#ff00ff'} 0%, #00ffff 50%, transparent 70%`

  return (
    <div
      ref={cursorRef}
      className={className}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        background: `radial-gradient(circle, ${gradientColors})`,
        top: 0,
        left: 0,
        willChange: "transform", // Hint to browser to optimize for movement
        ...style
      }}
    />
  )
}
