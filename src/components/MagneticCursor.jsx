import React, { useEffect, useRef, useState } from 'react'
import { lerp } from '../utils/lerp.js'

export default function MagneticCursor() {
  const cursorRef = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const cursorPos = useRef({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse) return undefined

    const move = (event) => {
      mouse.current = { x: event.clientX, y: event.clientY }
      const target = event.target
      if (target.closest?.('button, a, .magnetic, input, textarea, [role="button"]')) {
        setHovering(true)
      } else {
        setHovering(false)
      }
    }

    const animate = () => {
      cursorPos.current.x = lerp(cursorPos.current.x, mouse.current.x, 0.22)
      cursorPos.current.y = lerp(cursorPos.current.y, mouse.current.y, 0.22)
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0) translate(-50%, -50%)`
      }
      requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', move)
    const animId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', move)
      cancelAnimationFrame(animId)
    }
  }, [])

  return (
    <div
      ref={cursorRef}
      className={`handdrawn-cursor ${hovering ? 'hovering' : ''}`}
      aria-hidden="true"
      style={{ position: 'fixed', top: 0, left: 0 }}
    >
      <div className="cursor-doodle" />
    </div>
  )
}
