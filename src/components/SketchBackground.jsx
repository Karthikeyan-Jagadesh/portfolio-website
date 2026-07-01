import React, { useEffect, useRef } from 'react'

export default function SketchBackground({ activeSection, theme }) {
  const canvasRef = useRef(null)
  const pointsRef = useRef([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect()
      canvas.width = rect.width * (window.devicePixelRatio || 1)
      canvas.height = rect.height * (window.devicePixelRatio || 1)
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1)
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      pointsRef.current.push({
        x,
        y,
        age: 0,
        maxAge: 45,
        size: Math.random() * 2.8 + 1.2,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
      })
    }

    window.addEventListener('mousemove', handleMouseMove)

    const draw = () => {
      const rect = canvas.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)

      const points = pointsRef.current
      if (points.length > 0) {
        // Draw sketchy connecting path
        ctx.beginPath()
        ctx.strokeStyle = theme === 'light' ? 'rgba(38, 41, 48, 0.18)' : 'rgba(247, 249, 247, 0.15)'
        ctx.lineWidth = 1.8
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'

        ctx.moveTo(points[0].x, points[0].y)
        for (let i = 1; i < points.length; i++) {
          const wobbleX = (Math.random() - 0.5) * 0.8
          const wobbleY = (Math.random() - 0.5) * 0.8
          ctx.lineTo(points[i].x + wobbleX, points[i].y + wobbleY)
        }
        ctx.stroke()

        // Draw individual graphite/chalk crumbs
        for (let i = 0; i < points.length; i++) {
          const p = points[i]
          p.age += 1
          p.x += p.vx
          p.y += p.vy
          const opacity = 1 - p.age / p.maxAge

          ctx.fillStyle = theme === 'light' 
            ? `rgba(38, 41, 48, ${opacity * 0.35})` 
            : `rgba(247, 249, 247, ${opacity * 0.3})`

          ctx.beginPath()
          if (theme === 'dark') {
            // Chalk crumbs are rounded
            ctx.arc(p.x, p.y, p.size * (1 - p.age / p.maxAge * 0.5), 0, Math.PI * 2)
          } else {
            // Charcoal pencil flecks are square
            ctx.rect(p.x, p.y, p.size, p.size)
          }
          ctx.fill()
        }

        // Keep points that are not too old
        pointsRef.current = points.filter((p) => p.age < p.maxAge)
      }

      animationId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [theme])

  return (
    <div className="sketch-background" aria-hidden="true">
      {theme === 'light' ? (
        <div className="notebook-lines" />
      ) : (
        <>
          <div className="chalkboard-dust" />
          <div className="chalkboard-grid" />
        </>
      )}
      <canvas ref={canvasRef} className="mouse-trail-canvas" />
    </div>
  )
}
