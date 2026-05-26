// src/components/ui/CustomCursor.tsx
'use client'
import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    let mouseX = 0, mouseY = 0
    let ringX  = 0, ringY  = 0

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
      dot.style.left = mouseX + 'px'
      dot.style.top  = mouseY + 'px'
    }

    const tick = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12
      ring.style.left = ringX + 'px'
      ring.style.top  = ringY + 'px'
      requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove)
    tick()

    // Scale on hover
    const onEnter = () => {
      ring.style.width  = '50px'
      ring.style.height = '50px'
      ring.style.opacity = '1'
    }
    const onLeave = () => {
      ring.style.width  = '30px'
      ring.style.height = '30px'
      ring.style.opacity = '0.6'
    }

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnter)
      el.addEventListener('mouseleave', onLeave)
    })

    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
