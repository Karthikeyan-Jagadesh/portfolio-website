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
    const lineCount = 38

    // Generate random values within a range
    const randomRange = (min, max) => Math.random() * (max - min) + min

    // Initialize/rebuild lines based on current canvas width/height
    const initLines = (w, h) => {
      lines = []
      for (let i = 0; i < lineCount; i++) {
        // Distribute lines evenly from -5% to 105% of canvas width
        const xRatio = -0.05 + 1.10 * (i / (lineCount - 1))
        
        lines.push({
          xRatio, // Initial static fraction across width
          amplitude: randomRange(18, 73),
          freq: randomRange(0.008, 0.014),
          waveSpeed: randomRange(0.0006, 0.0016),
          wavePhase: randomRange(0, Math.PI * 2),
          width: randomRange(0.5, 1.7),
          baseOpacity: randomRange(0.12, 0.67),
          driftSpeed: randomRange(0.0002, 0.0006),
          driftPhase: randomRange(0, Math.PI * 2),
          pulsePhase: randomRange(0, Math.PI * 2)
        })
      }
    }

    // Handle high-DPI scaling and rebuild lines
    const resize = () => {
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
      initLines(rect.width, rect.height)
    }

    // Set initial size
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width
    canvas.height = rect.height
    initLines(rect.width, rect.height)
    resize()

    window.addEventListener('resize', resize)

    // Animation Loop
    const animate = (timestamp) => {
      const dpr = window.devicePixelRatio || 1
      const w = canvas.width / dpr
      const h = canvas.height / dpr

      // 1. Background Fill
      ctx.fillStyle = '#0D0D0D'
      ctx.fillRect(0, 0, w, h)

      // 2. Draw vertical curtain lines
      lines.forEach((line) => {
        // Calculate horizontal position with drift
        // baseX = x_base + sin(t * speed + phase) * (width * 0.04)
        const initialX = line.xRatio * w
        const drift = Math.sin(timestamp * line.driftSpeed + line.driftPhase) * (w * 0.04)
        const baseX = initialX + drift

        // Calculate opacity with breathing pulse
        // alpha = baseOpacity * (0.85 + 0.15 * sin(t * 0.012 + phase))
        const pulse = 0.85 + 0.15 * Math.sin(timestamp * 0.012 + line.pulsePhase)
        const alpha = line.baseOpacity * pulse

        ctx.beginPath()
        ctx.lineWidth = line.width
        ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`

        // Apply glow to lines with opacity > 0.45
        if (alpha > 0.45) {
          ctx.shadowBlur = 8
          ctx.shadowColor = `rgba(201, 168, 76, ${alpha * 0.6})`
        } else {
          ctx.shadowBlur = 0
        }

        // Draw vertical curve segment by segment
        let first = true
        // Step y coordinates by 8px for smooth path resolution
        for (let y = -20; y <= h + 20; y += 8) {
          // x = baseX + sin(y * freq + t * waveSpeed + wavePhase) * amplitude
          const wave = Math.sin(y * line.freq + timestamp * line.waveSpeed + line.wavePhase) * line.amplitude
          const x = baseX + wave

          if (first) {
            ctx.moveTo(x, y)
            first = false
          } else {
            ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      })

      // Reset shadow blur to prevent bleeding into other drawing operations
      ctx.shadowBlur = 0

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <div className={className} style={{ position: 'relative', overflow: 'hidden' }}>
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
      <div style={{ position: 'relative', zIndex: 1, display: 'contents' }}>
        {children}
      </div>
    </div>
  )
}
