import React, { useEffect, useRef, useState } from 'react'
import { lerp } from '../utils/lerp.js'

export default function MagneticCursor() {
  const dot = useRef(null)
  const ring = useRef(null)
  const mouse = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })
  const [hover, setHover] = useState('')
  const [clicked, setClicked] = useState(false)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    if (coarse) return undefined

    const move = (event) => {
      mouse.current = { x: event.clientX, y: event.clientY }
      const target = event.target
      if (target.closest?.('button, a, .magnetic, input, textarea')) setHover('interactive')
      else if (target.closest?.('p, h1, h2, h3, span')) setHover('text')
      else setHover('')
    }
    const down = () => {
      setClicked(true)
      setTimeout(() => setClicked(false), 180)
    }
    const animate = () => {
      ringPos.current.x = lerp(ringPos.current.x, mouse.current.x, 0.15)
      ringPos.current.y = lerp(ringPos.current.y, mouse.current.y, 0.15)
      if (dot.current) dot.current.style.transform = `translate3d(${mouse.current.x}px, ${mouse.current.y}px, 0)`
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.current.x}px, ${ringPos.current.y}px, 0)`
      requestAnimationFrame(animate)
    }
    window.addEventListener('mousemove', move)
    window.addEventListener('mousedown', down)
    animate()
    return () => {
      window.removeEventListener('mousemove', move)
      window.removeEventListener('mousedown', down)
    }
  }, [])

  return (
    <div className={`cursor-layer ${hover} ${clicked ? 'clicked' : ''}`} aria-hidden="true">
      <span ref={dot} className="cursor-dot" />
      <span ref={ring} className="cursor-ring" />
    </div>
  )
}
