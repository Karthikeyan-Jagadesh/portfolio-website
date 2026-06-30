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

    // Mouse tracking variables
    let mouseXTarget = 0
    let mouseYTarget = 0
    let mouseX = 0
    let mouseY = 0

    const randomRange = (min, max) => Math.random() * (max - min) + min

    // Initialize lines
    const initLines = (w, h) => {
      lines = []
      for (let i = 0; i < lineCount; i++) {
        const xRatio = -0.05 + 1.10 * (i / (lineCount - 1))
        const z = Math.random() // Depth: 0 (far) to 1 (close)
        const depthScale = 0.55 + z * 0.9

        lines.push({
          xRatio,
          z,
          depthScale,
          amplitude: randomRange(18, 73),
          freq: randomRange(0.008, 0.014),
          waveSpeed: randomRange(0.0006, 0.0016),
          wavePhase: randomRange(0, Math.PI * 2),
          
          foldFreq: randomRange(0.002, 0.005),
          foldAmp: randomRange(6, 22),
          foldPhase: randomRange(0, Math.PI * 2),

          width: randomRange(0.5, 1.7) * depthScale,
          baseOpacity: randomRange(0.12, 0.67) * depthScale,
          driftSpeed: randomRange(0.0001, 0.0003),
          driftPhase: randomRange(0, Math.PI * 2),
          pulsePhase: randomRange(0, Math.PI * 2)
        })
      }
    }

    // Handle high-DPI scaling using parent bounding rect
    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      // Reset transform and apply high-DPI scaling
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      initLines(rect.width, rect.height)
    }

    // Set initial size
    resize()

    // Listeners
    window.addEventListener('resize', resize)

    const handleMouseMove = (e) => {
      // Normalize cursor coordinates from -1 to 1
      mouseXTarget = (e.clientX / window.innerWidth) * 2 - 1
      mouseYTarget = (e.clientY / window.innerHeight) * 2 - 1
    }
    window.addEventListener('mousemove', handleMouseMove)

    // Animation Loop
    const animate = (timestamp) => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      // Ease mouse coordinates (simple lerp with 0.04 factor)
      mouseX += (mouseXTarget - mouseX) * 0.04
      mouseY += (mouseYTarget - mouseY) * 0.04

      // 1. Background Fill
      ctx.fillStyle = '#0D0D0D'
      ctx.fillRect(0, 0, w, h)

      // 2. Draw Soft Candlelight Gradient under the lines
      const candleX = w / 2
      const candleY = h * 0.4
      const candleRadius = Math.min(w, h) * 0.65
      const candleGrad = ctx.createRadialGradient(
        candleX, candleY, 0,
        candleX, candleY, candleRadius
      )
      candleGrad.addColorStop(0, 'rgba(201, 168, 76, 0.055)')
      candleGrad.addColorStop(1, 'rgba(201, 168, 76, 0)')
      ctx.fillStyle = candleGrad
      ctx.fillRect(0, 0, w, h)

      // 3. Sort lines back-to-front by depth z
      const sortedLines = [...lines].sort((a, b) => a.z - b.z)

      // 4. Draw Lines
      sortedLines.forEach((line) => {
        // Calculate baseX with slow horizontal drift
        const initialX = line.xRatio * w
        const drift = Math.sin(timestamp * line.driftSpeed + line.driftPhase) * (w * 0.04)
        
        // Mouse parallax horizontal tilt (background shifts more than foreground)
        const parallaxX = mouseX * (w * 0.026) * (1 - line.z)
        const baseX = initialX + drift + parallaxX

        // Mouse parallax vertical shift
        const parallaxY = mouseY * (h * 0.02) * (1 - line.z)

        // Calculate opacity with breathing pulse
        const pulse = 0.85 + 0.15 * Math.sin(timestamp * 0.012 + line.pulsePhase)
        const alpha = line.baseOpacity * pulse

        ctx.beginPath()
        ctx.lineWidth = line.width
        ctx.strokeStyle = `rgba(201, 168, 76, ${alpha})`

        // Apply depth-based glow
        if (alpha > 0.45) {
          ctx.shadowBlur = 8 * line.depthScale
          ctx.shadowColor = `rgba(201, 168, 76, ${alpha * 0.6})`
        } else {
          ctx.shadowBlur = 0
        }

        // Draw vertical path segment by segment (~6px spacing)
        let first = true
        for (let y = -40; y <= h + 40; y += 6) {
          const wavePhase = timestamp * line.waveSpeed + line.wavePhase
          const primaryWave = Math.sin(y * line.freq + wavePhase) * line.amplitude * line.depthScale

          const foldPhase = timestamp * 0.0004 + line.foldPhase
          const secondaryWave = Math.sin(y * line.foldFreq + foldPhase) * line.foldAmp

          const x = baseX + primaryWave + secondaryWave
          const drawY = y + parallaxY

          if (first) {
            ctx.moveTo(x, drawY)
            first = false
          } else {
            ctx.lineTo(x, drawY)
          }
        }
        ctx.stroke()

        // Reset shadow configuration to prevent line bleeding
        ctx.shadowBlur = 0
      })

      // 5. Vignette Pass at the end to deepen corners
      const vigRadius = Math.max(w, h) * 0.78
      const vignetteGrad = ctx.createRadialGradient(
        w / 2, h / 2, Math.min(w, h) * 0.28,
        w / 2, h / 2, vigRadius
      )
      vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)')
      vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.55)')
      ctx.fillStyle = vignetteGrad
      ctx.fillRect(0, 0, w, h)

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
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
          display: 'block',
          backgroundColor: '#0D0D0D'
        }}
      />
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'grid',
          gridTemplateColumns: 'inherit',
          alignItems: 'inherit',
          gap: 'inherit',
          width: '100%',
          height: '100%'
        }}
      >
        {children}
      </div>
    </div>
  )
}
