import React, { useRef, useEffect } from 'react'

export default function ShaderBackground({
  children,
  className,
  baseColor = '#0A0A0F',
  colors = ['#7C5CFF', '#4FD1FF', '#FF6FD8']
}) {
  const wrapperRef = useRef(null)
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let blobs = []
    let grainPattern = null

    // Mouse tracking state
    let mouseXTarget = 0
    let mouseYTarget = 0
    let mouseX = 0
    let mouseY = 0
    let isHovering = false

    // Precompute a tiled noise canvas for grain texture
    const initGrain = () => {
      const noiseCanvas = document.createElement('canvas')
      noiseCanvas.width = 128
      noiseCanvas.height = 128
      const nCtx = noiseCanvas.getContext('2d')
      if (!nCtx) return

      const nData = nCtx.createImageData(128, 128)
      for (let i = 0; i < nData.data.length; i += 4) {
        const val = Math.floor(Math.random() * 255)
        nData.data[i] = val       // R
        nData.data[i + 1] = val   // G
        nData.data[i + 2] = val   // B
        nData.data[i + 3] = 11    // A (Subtle grain opacity, ~0.04)
      }
      nCtx.putImageData(nData, 0, 0)
      grainPattern = ctx.createPattern(noiseCanvas, 'repeat')
    }

    // Initialize/recalculate blobs based on dimensions
    const initBlobs = (w, h) => {
      const minDim = Math.min(w, h)

      // Reset mouse targets to center if resize occurs
      if (!isHovering) {
        mouseXTarget = w / 2
        mouseYTarget = h / 2
        mouseX = w / 2
        mouseY = h / 2
      }

      // Configure 3 static/moving blobs using input color palette
      blobs = [
        {
          color: colors[0] || '#7C5CFF',
          baseRadius: minDim * 0.48,
          // Lissajous parameters
          speedX: 0.0004,
          speedY: 0.0003,
          phaseX: 0,
          phaseY: Math.PI / 4,
          pulseSpeed: 0.001,
          pulsePhase: 0,
          opacity: 0.18
        },
        {
          color: colors[1] || '#4FD1FF',
          baseRadius: minDim * 0.52,
          speedX: 0.0002,
          speedY: 0.0005,
          phaseX: Math.PI / 2,
          phaseY: 0,
          pulseSpeed: 0.0007,
          pulsePhase: Math.PI / 3,
          opacity: 0.15
        },
        {
          color: colors[2] || '#FF6FD8',
          baseRadius: minDim * 0.44,
          speedX: 0.00035,
          speedY: 0.00025,
          phaseX: Math.PI,
          phaseY: Math.PI / 3,
          pulseSpeed: 0.0012,
          pulsePhase: Math.PI * 1.5,
          opacity: 0.16
        }
      ]
    }

    // Handle high-DPI scaling using parent bounding rect
    const resize = () => {
      const rect = wrapper.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      // Apply scale matrix transformation
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      initBlobs(rect.width, rect.height)
      initGrain()
    }

    // Set initial size
    resize()

    window.addEventListener('resize', resize)

    // Mouse Listeners attached to wrapper
    const handleMouseMove = (e) => {
      const rect = wrapper.getBoundingClientRect()
      mouseXTarget = e.clientX - rect.left
      mouseYTarget = e.clientY - rect.top
    }
    const handleMouseEnter = () => {
      isHovering = true
    }
    const handleMouseLeave = () => {
      isHovering = false
    }

    wrapper.addEventListener('mousemove', handleMouseMove)
    wrapper.addEventListener('mouseenter', handleMouseEnter)
    wrapper.addEventListener('mouseleave', handleMouseLeave)

    // Animation Loop
    const animate = (timestamp) => {
      const rect = wrapper.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      // 1. Base Solid Color Fill
      ctx.fillStyle = baseColor
      ctx.fillRect(0, 0, w, h)

      // Smoothly interpolate spotlight cursor coords (lerp ~0.05)
      const targetX = isHovering ? mouseXTarget : w / 2
      const targetY = isHovering ? mouseYTarget : h * 0.4
      mouseX += (targetX - mouseX) * 0.05
      mouseY += (targetY - mouseY) * 0.05

      // 2. Render Blobs with additive color mixing
      ctx.globalCompositeOperation = 'lighter'

      blobs.forEach((blob) => {
        // Lissajous curve displacement
        const x = w / 2 + Math.sin(timestamp * blob.speedX + blob.phaseX) * (w * 0.28)
        const y = h / 2 + Math.cos(timestamp * blob.speedY + blob.phaseY) * (h * 0.28)

        // Radial scale breath
        const pulse = 0.9 + 0.1 * Math.sin(timestamp * blob.pulseSpeed + blob.pulsePhase)
        const radius = blob.baseRadius * pulse

        // Draw radial light blob
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius)
        grad.addColorStop(0, blob.color)
        grad.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.fillStyle = grad
        ctx.globalAlpha = blob.opacity
        ctx.beginPath()
        ctx.arc(x, y, radius, 0, Math.PI * 2)
        ctx.fill()
      })

      // 3. Render Spotlight Blob (trails cursor)
      const spotRadius = Math.min(w, h) * 0.35
      const spotGrad = ctx.createRadialGradient(
        mouseX, mouseY, 0,
        mouseX, mouseY, spotRadius
      )
      // Use cyan or magenta spotlight, default is soft violet/cyan blend
      const spotColor = colors[1] || '#4FD1FF'
      spotGrad.addColorStop(0, spotColor)
      spotGrad.addColorStop(1, 'rgba(0,0,0,0)')

      ctx.fillStyle = spotGrad
      // Breathe spotlight opacity slightly, dimmer when cursor is stationary
      ctx.globalAlpha = isHovering ? 0.24 : 0.08
      ctx.beginPath()
      ctx.arc(mouseX, mouseY, spotRadius, 0, Math.PI * 2)
      ctx.fill()

      // Reset composite mode and global alpha
      ctx.globalCompositeOperation = 'source-over'
      ctx.globalAlpha = 1.0

      // 4. Draw structural accent curves (ambient depth sweeps)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)'
      ctx.lineWidth = 1.0
      
      // Sweep 1
      ctx.beginPath()
      let sweepY1 = Math.sin(timestamp * 0.0003) * 40
      ctx.moveTo(-50, h * 0.2 + sweepY1)
      ctx.bezierCurveTo(w * 0.3, h * 0.1, w * 0.6, h * 0.8, w + 50, h * 0.6 + sweepY1)
      ctx.stroke()

      // Sweep 2
      ctx.beginPath()
      let sweepY2 = Math.cos(timestamp * 0.0002) * 50
      ctx.moveTo(-50, h * 0.7 + sweepY2)
      ctx.bezierCurveTo(w * 0.4, h * 0.9, w * 0.7, h * 0.2, w + 50, h * 0.3 + sweepY2)
      ctx.stroke()

      // 5. Vignette Pass
      const vigRadius = Math.max(w, h) * 0.8
      const vignetteGrad = ctx.createRadialGradient(
        w / 2, h / 2, Math.min(w, h) * 0.25,
        w / 2, h / 2, vigRadius
      )
      vignetteGrad.addColorStop(0, 'rgba(0, 0, 0, 0)')
      vignetteGrad.addColorStop(1, 'rgba(0, 0, 0, 0.45)')
      ctx.fillStyle = vignetteGrad
      ctx.fillRect(0, 0, w, h)

      // 6. Draw Film Grain Texture Overlay
      if (grainPattern) {
        ctx.fillStyle = grainPattern
        ctx.fillRect(0, 0, w, h)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animationFrameId = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      wrapper.removeEventListener('mousemove', handleMouseMove)
      wrapper.removeEventListener('mouseenter', handleMouseEnter)
      wrapper.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [baseColor, colors])

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: 'relative', overflow: 'hidden' }}
    >
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
          backgroundColor: baseColor
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
