// src/components/ui/CustomCursor.tsx
'use client'

import { useEffect, useRef } from 'react'

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number | null>(null)

  useEffect(() => {
    const dot = dotRef.current
    const ring = ringRef.current

    if (!dot || !ring) return

    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let ringX = mouseX
    let ringY = mouseY

    const onMove = (event: MouseEvent) => {
      mouseX = event.clientX
      mouseY = event.clientY

      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`
      dot.style.opacity = '1'
      ring.style.opacity = '0.6'
    }

    const onMouseLeave = () => {
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }

    const onMouseEnter = () => {
      dot.style.opacity = '1'
      ring.style.opacity = '0.6'
    }

    const tick = () => {
      ringX += (mouseX - ringX) * 0.12
      ringY += (mouseY - ringY) * 0.12

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`

      frameRef.current = requestAnimationFrame(tick)
    }

    const onHoverEnter = () => {
      ring.style.width = '50px'
      ring.style.height = '50px'
      ring.style.opacity = '1'
    }

    const onHoverLeave = () => {
      ring.style.width = '30px'
      ring.style.height = '30px'
      ring.style.opacity = '0.6'
    }

    const interactiveElements = document.querySelectorAll('a, button')

    interactiveElements.forEach((element) => {
      element.addEventListener('mouseenter', onHoverEnter)
      element.addEventListener('mouseleave', onHoverLeave)
    })

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onMouseLeave)
    document.addEventListener('mouseenter', onMouseEnter)

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onMouseLeave)
      document.removeEventListener('mouseenter', onMouseEnter)

      interactiveElements.forEach((element) => {
        element.removeEventListener('mouseenter', onHoverEnter)
        element.removeEventListener('mouseleave', onHoverLeave)
      })

      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  return (
    <>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}