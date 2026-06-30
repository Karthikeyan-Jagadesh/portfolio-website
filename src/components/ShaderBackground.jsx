import React, { useRef, useEffect } from 'react'

export default function ShaderBackground({ children, className }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let lines = []
    const lineCount = 18

    // Handle high-DPI scaling
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      initLines(rect.width, rect.height)
    }

    // Helper to generate a line configuration
    const createLine = (w, h, initRandomY = false) => {
      const opacity = Math.random() * 0.3 + 0.15 // 0.15 to 0.45
      return {
        // Distribute spacing across the height + diagonal buffer
        yOffset: initRandomY 
          ? Math.random() * (h + w * 0.6 + 400) - 200 
          : -200,
        opacity: opacity,
        thickness: Math.random() * 1.0 + 0.5, // 0.5px to 1.5px
        amplitude: Math.random() * 25 + 10, // 10px to 35px
        frequency: Math.random() * 0.004 + 0.0015, // Wave wavelength
        speed: Math.random() * 0.3 + 0.15, // Slow vertical/horizontal movement
        phase: Math.random() * Math.PI * 2,
        phaseSpeed: Math.random() * 0.004 + 0.002, // Breathing speed
        slope: 0.55 + Math.random() * 0.1, // Near 30 degree angle
        hasGlow: opacity > 0.32 // Only brighter lines have subtle glow
      }
    }

    const initLines = (w, h) => {
      lines = []
      for (let i = 0; i < lineCount; i++) {
        lines.push(createLine(w, h, true))
      }
    }

    // Initial resize to set size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    initLines(rect.width, rect.height)
    resize()

    window.addEventListener('resize', resize)

    // Main animation loop
    const animate = () => {
      const w = canvas.width / (window.devicePixelRatio || 1)
      const h = canvas.height / (window.devicePixelRatio || 1)

      // Draw background
      ctx.fillStyle = '#0D0D0D'
      ctx.fillRect(0, 0, w, h)

      // Update and draw lines
      lines.forEach((line) => {
        // Move line downwards/rightwards along its slope
        line.yOffset += line.speed
        line.phase += line.phaseSpeed

        // Wrap lines around when they go off screen
        const maxScroll = h + w * line.slope + 200
        if (line.yOffset > maxScroll) {
          Object.assign(line, createLine(w, h, false))
        }

        ctx.beginPath()
        ctx.lineWidth = line.thickness
        ctx.strokeStyle = `rgba(201, 168, 76, ${line.opacity})`

        if (line.hasGlow) {
          ctx.shadowBlur = 10
          ctx.shadowColor = '#C9A84C'
        } else {
          ctx.shadowBlur = 0
        }

        // Draw undulated diagonal curve
        let first = true
        for (let x = -50; x < w + 50; x += 8) {
          // Diagonal line: y = slope * x + yOffset
          const baseY = x * line.slope + line.yOffset
          // Gentle sine-wave undulation
          const undulation = Math.sin(x * line.frequency + line.phase) * line.amplitude
          const y = baseY + undulation

          // Only draw points if they are reasonably in the screen area
          if (first) {
            ctx.moveTo(x, y)
            first = false
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      })

      // Reset shadow configuration for safety
      ctx.shadowBlur = 0

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <section className={className} style={{ position: 'relative', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          backgroundColor: '#0D0D0D'
        }}
      />
      {children}
    </section>
  )
}
