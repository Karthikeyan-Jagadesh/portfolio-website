import React, { useState, useEffect, useRef } from 'react'

const defaultProjects = [
  {
    id: "01",
    title: "MovieSphere",
    subtitle: "React 19 movie discovery app",
    description: "A high-performance cinematic discovery interface built with a bold Neo-Brutalist design. Fetches and displays popular, top-rated, and custom genres from the TMDB API, featuring wishlists, search filtering, and custom color theme switches.",
    tags: ["React 19", "Vite", "TMDB API"],
    image: "/movisphere.png",
    github: "https://github.com/Karthikeyan-Jagadesh/Modern-Movie-Application",
    live: "https://movisphere.vercel.app"
  },
  {
    id: "02",
    title: "RouteWake",
    subtitle: "GPS-based location alarm",
    description: "A location-aware transit assistant designed to prevent missing transit stops. Tracks real-time GPS locations and rings an alarm as you approach pre-set destination coordinates. Stores past trips and alarm history in a secure database.",
    tags: ["Java", "Spring Boot", "Leaflet.js", "Oracle DB"],
    image: "/routewake.png",
    github: "https://github.com/Karthikeyan-Jagadesh/Location-Alarm-Tracker",
    live: null
  },
  {
    id: "03",
    title: "To-Do Management",
    subtitle: "Full-stack calendar manager",
    description: "A secure task-management web application featuring a drag-and-drop calendar interface. Built with role-based dashboard access, session authentication using JSON Web Tokens (JWT), password hashing, and Oracle database integration.",
    tags: ["Node.js", "Express.js", "Oracle DB", "JWT", "HTML", "CSS"],
    image: "/todo-calendar.png",
    github: "https://github.com/Karthikeyan-Jagadesh/To_do-Management-System",
    live: null
  },
  {
    id: "04",
    title: "Pet Adoption Center",
    subtitle: "Multi-page frontend website",
    description: "A multi-page frontend website for browsing and adopting pets. Features interactive category filtering, dynamic pet details, an application form with validation, and success stories — styled using a minimal gold-and-black design system.",
    tags: ["HTML5", "CSS3", "JavaScript"],
    image: "/pet-adoption.png",
    github: "https://github.com/Karthikeyan-Jagadesh/Pet-Adoption-Center",
    live: null
  }
]

export default function ProjectShowcase({ projects = defaultProjects }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [openPanel, setOpenPanel] = useState(null)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hoveringActive, setHoveringActive] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isTouch, setIsTouch] = useState(false)

  const canvasRef = useRef(null)
  const lastClickedIndex = useRef(null)
  const activeCardRef = useRef(null)

  // 1. RESPONSIVENESS AND DEVICE DETECTION
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
      setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 2. AMBIENT radial particles canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId
    let particles = []
    const particleCount = 40

    const randomRange = (min, max) => Math.random() * (max - min) + min

    const initParticles = (w, h) => {
      particles = []
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: 0,
          y: 0,
          angle: randomRange(0, Math.PI * 2),
          speed: randomRange(0.3, 0.9),
          radius: randomRange(1, 2.5),
          opacity: randomRange(0.15, 0.55),
          maxDist: randomRange(120, Math.min(w, h) * 0.45)
        })
      }
    }

    const resize = () => {
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      initParticles(rect.width, rect.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const cx = w / 2
      const cy = h / 2

      ctx.clearRect(0, 0, w, h)

      particles.forEach((p) => {
        // Move outwards
        p.x += Math.cos(p.angle) * p.speed
        p.y += Math.sin(p.angle) * p.speed

        const dist = Math.sqrt(p.x * p.x + p.y * p.y)

        // Reset if reached max distance
        if (dist >= p.maxDist) {
          p.x = 0
          p.y = 0
          p.angle = randomRange(0, Math.PI * 2)
          p.speed = randomRange(0.3, 0.9)
          p.radius = randomRange(1, 2.5)
          p.opacity = randomRange(0.15, 0.55)
          p.maxDist = randomRange(120, Math.min(w, h) * 0.45)
        }

        // Calculate opacity fade near max distance
        const currentOpacity = p.opacity * (1 - dist / p.maxDist)

        ctx.beginPath()
        ctx.arc(cx + p.x, cy + p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(201, 168, 76, ${currentOpacity})`
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // 3. KEYBOARD LISTENERS & CLOSE ON CAROUSEL CHANGE
  useEffect(() => {
    // Reset tilt and close open panels when project changes
    setTilt({ x: 0, y: 0 })
    setOpenPanel(null)
    lastClickedIndex.current = activeIndex
  }, [activeIndex])

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Escape closes open details panel
      if (e.key === 'Escape') {
        setOpenPanel(null)
        return
      }

      // Ignore arrows if detail panel is open
      if (openPanel !== null) return

      if (e.key === 'ArrowLeft') {
        setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
      } else if (e.key === 'ArrowRight') {
        setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [openPanel, projects.length])

  // 4. MOUSE TILT CALCULATIONS FOR ACTIVE CARD
  const handleMouseMove = (e, idx) => {
    if (idx !== activeIndex || openPanel !== null || isTouch) return
    
    const card = e.currentTarget
    const rect = card.getBoundingClientRect()
    const halfW = rect.width / 2
    const halfH = rect.height / 2
    const offsetX = e.clientX - rect.left - halfW
    const offsetY = e.clientY - rect.top - halfH

    const tiltY = (offsetX / halfW) * 10
    const tiltX = -(offsetY / halfH) * 8

    setTilt({ x: tiltX, y: tiltY })
    setHoveringActive(true)
  }

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 })
    setHoveringActive(false)
  }

  // 5. CLICK HANDLERS
  const handleCardClick = (idx) => {
    if (activeIndex === idx) {
      // If clicked index is already active, slide up the details panel
      setOpenPanel(openPanel === idx ? null : idx)
    } else {
      setActiveIndex(idx)
    }
  }

  const translateZ = isMobile ? 260 : 380
  const angleStep = 360 / projects.length

  return (
    <section
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#0D0D0D',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
        padding: '60px 20px',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Gold Radial Background Particles */}
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
          opacity: 0.4
        }}
      />

      {/* 2. Headline Content */}
      <div
        style={{
          zIndex: 1,
          textAlign: 'center',
          marginBottom: isMobile ? '20px' : '40px',
          userSelect: 'none'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            color: '#C9A84C',
            fontSize: '0.78rem',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}
        >
          MISSION ARCHIVE
        </span>
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: isMobile ? '2rem' : '2.8rem',
            color: '#FFFFFF',
            fontWeight: 'normal',
            margin: 0
          }}
        >
          Project Orbit
        </h2>
      </div>

      {/* 3. 3D perspective viewport wrapper */}
      <div
        style={{
          zIndex: 1,
          perspective: '1200px',
          width: isMobile ? '90vw' : '760px',
          height: isMobile ? '450px' : '520px',
          position: 'relative',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Rotator Container */}
        <div
          style={{
            width: '100%',
            height: '100%',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.72s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: `rotateY(${-activeIndex * angleStep}deg)`,
            position: 'relative'
          }}
        >
          {projects.map((proj, idx) => {
            const isActive = activeIndex === idx
            const isPanelOpen = openPanel === idx
            const baseAngle = idx * angleStep

            // Calculate card transitions
            const cardTransition = hoveringActive && isActive
              ? 'transform 0.1s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s ease'
              : 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94), filter 0.4s ease'

            // Apply local mouse tilt if hovering and active
            const tiltTransform = isActive
              ? `rotateY(${baseAngle + tilt.y}deg) rotateX(${tilt.x}deg) translateZ(${translateZ}px) scale(1.06)`
              : `rotateY(${baseAngle}deg) translateZ(${translateZ}px) scale(0.88)`

            return (
              <div
                key={proj.id}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  transformStyle: 'preserve-3d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  pointerEvents: isActive ? 'auto' : 'none'
                }}
              >
                {/* Individual Card */}
                <article
                  ref={isActive ? activeCardRef : null}
                  onClick={() => handleCardClick(idx)}
                  onMouseMove={(e) => handleMouseMove(e, idx)}
                  onMouseLeave={handleMouseLeave}
                  style={{
                    width: isMobile ? '88vw' : '340px',
                    height: isMobile ? '400px' : '460px',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, #1a1a1a, #111)',
                    border: '1px solid rgba(201, 168, 76, 0.12)',
                    cursor: 'pointer',
                    position: 'relative',
                    pointerEvents: 'auto',
                    transform: tiltTransform,
                    transformStyle: 'preserve-3d',
                    filter: isActive ? 'brightness(1) blur(0px)' : 'brightness(0.35) blur(1.5px)',
                    boxShadow: isActive
                      ? '0 0 0 1.5px rgba(201, 168, 76, 0.5), 0 0 40px rgba(201, 168, 76, 0.18), 0 20px 60px rgba(0,0,0,0.7)'
                      : 'none',
                    transition: cardTransition,
                    userSelect: 'none'
                  }}
                >
                  {/* Image Scrim (Top 52%) */}
                  <div
                    style={{
                      height: '52%',
                      width: '100%',
                      position: 'relative',
                      overflow: 'hidden',
                      background: 'linear-gradient(135deg, #1a1a1a 0%, #2d2a1a 100%)'
                    }}
                  >
                    {proj.image ? (
                      <img
                        src={proj.image}
                        alt={proj.title}
                        onError={(e) => {
                          e.target.style.display = 'none'
                        }}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                    ) : null}

                    {/* Gradient Overlay bottom of image */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        width: '100%',
                        height: '40px',
                        background: 'linear-gradient(to top, #111, transparent)'
                      }}
                    />

                    {/* Expand Detail Trigger Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation() // Prevent rotating/toggling trigger conflict
                        setOpenPanel(isPanelOpen ? null : idx)
                      }}
                      style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        width: '28px',
                        height: '28px',
                        background: 'rgba(0,0,0,0.4)',
                        border: '1px solid rgba(201,168,76,0.3)',
                        borderRadius: '50%',
                        color: '#C9A84C',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        lineHeight: 1,
                        outline: 'none',
                        zIndex: 2,
                        transition: 'background 0.25s, border-color 0.25s'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(201,168,76,0.2)'
                        e.target.style.borderColor = '#C9A84C'
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(0,0,0,0.4)'
                        e.target.style.borderColor = 'rgba(201,168,76,0.3)'
                      }}
                    >
                      ↗
                    </button>
                  </div>

                  {/* Card Body (Bottom 48%) */}
                  <div
                    style={{
                      height: '48%',
                      width: '100%',
                      padding: '20px 22px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      position: 'relative'
                    }}
                  >
                    {/* Project Number */}
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        color: '#C9A84C',
                        letterSpacing: '1px'
                      }}
                    >
                      {proj.id}
                    </span>

                    {/* Project Title */}
                    <h3
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.15rem',
                        color: '#C9A84C',
                        fontWeight: '600',
                        margin: 0
                      }}
                    >
                      {proj.title}
                    </h3>

                    {/* Tagline / Subtitle */}
                    <span
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontSize: '0.8rem',
                        lineHeight: '1.3'
                      }}
                    >
                      {proj.subtitle}
                    </span>

                    {/* Tags */}
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginTop: 'auto'
                      }}
                    >
                      {proj.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            border: '1px solid rgba(201, 168, 76, 0.3)',
                            color: 'rgba(201, 168, 76, 0.8)',
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-mono)',
                            borderRadius: '99px',
                            padding: '3px 10px',
                            textTransform: 'uppercase'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* SLIDING GLASS DETAIL PANEL */}
                  <div
                    onClick={(e) => e.stopPropagation()} // Stop closing details when clicking inside
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      height: '65%',
                      background: 'rgba(10, 10, 10, 0.76)',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      borderTop: '1px solid rgba(201, 168, 76, 0.18)',
                      borderRadius: '0 0 20px 20px',
                      padding: '20px 22px',
                      boxSizing: 'border-box',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      transform: isPanelOpen ? 'translateY(0)' : 'translateY(100%)',
                      pointerEvents: isPanelOpen ? 'auto' : 'none',
                      transition: 'transform 0.42s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      zIndex: 3
                    }}
                  >
                    {/* Panel Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontSize: '1.05rem',
                          color: '#FFFFFF',
                          fontWeight: '600',
                          margin: 0
                        }}
                      >
                        {proj.title}
                      </h4>
                      <button
                        onClick={() => setOpenPanel(null)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#C9A84C',
                          fontSize: '1rem',
                          cursor: 'pointer',
                          lineHeight: 1,
                          outline: 'none',
                          padding: '4px'
                        }}
                      >
                        ✕
                      </button>
                    </div>

                    {/* Description Paragraph */}
                    <p
                      style={{
                        fontFamily: 'var(--font-ui)',
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '0.82rem',
                        lineHeight: '1.55',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}
                    >
                      {proj.description}
                    </p>

                    {/* Tags inside panel */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {proj.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          style={{
                            border: '1px solid rgba(201, 168, 76, 0.3)',
                            color: 'rgba(201, 168, 76, 0.8)',
                            fontSize: '0.68rem',
                            fontFamily: 'var(--font-mono)',
                            borderRadius: '99px',
                            padding: '3px 10px',
                            textTransform: 'uppercase'
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Action buttons inside panel */}
                    <div style={{ display: 'flex', gap: '10px', marginTop: 'auto' }}>
                      <a
                        href={proj.github}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          flex: 1,
                          textAlign: 'center',
                          textDecoration: 'none',
                          border: '1px solid #C9A84C',
                          background: 'transparent',
                          color: '#C9A84C',
                          fontSize: '0.78rem',
                          fontFamily: 'var(--font-ui)',
                          fontWeight: '600',
                          padding: '8px 0',
                          borderRadius: '4px',
                          transition: 'background 0.25s, color 0.25s'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#C9A84C'
                          e.target.style.color = '#0D0D0D'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'transparent'
                          e.target.style.color = '#C9A84C'
                        }}
                      >
                        GitHub ↗
                      </a>

                      {proj.live ? (
                        <a
                          href={proj.live}
                          target="_blank"
                          rel="noreferrer"
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            textDecoration: 'none',
                            background: '#C9A84C',
                            color: '#000000',
                            border: '1px solid #C9A84C',
                            fontSize: '0.78rem',
                            fontFamily: 'var(--font-ui)',
                            fontWeight: '600',
                            padding: '8px 0',
                            borderRadius: '4px',
                            transition: 'background 0.25s, border-color 0.25s'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.background = 'transparent'
                            e.target.style.color = '#C9A84C'
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.background = '#C9A84C'
                            e.target.style.color = '#000000'
                          }}
                        >
                          Live ↗
                        </a>
                      ) : (
                        <span
                          style={{
                            flex: 1,
                            textAlign: 'center',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'rgba(255, 255, 255, 0.3)',
                            fontSize: '0.78rem',
                            fontFamily: 'var(--font-ui)',
                            fontWeight: '600',
                            padding: '8px 0',
                            borderRadius: '4px',
                            cursor: 'default'
                          }}
                        >
                          Offline
                        </span>
                      )}
                    </div>
                  </div>
                </article>
              </div>
            )
          })}
        </div>
      </div>

      {/* 4. NAVIGATION CONTROLS */}
      <div
        style={{
          zIndex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '16px',
          marginTop: isMobile ? '20px' : '40px',
          userSelect: 'none'
        }}
      >
        {/* Buttons Row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          {/* Previous Arrow */}
          <button
            onClick={() => {
              setActiveIndex((prev) => (prev === 0 ? projects.length - 1 : prev - 1))
            }}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: '#C9A84C',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              outline: 'none',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(201, 168, 76, 0.12)'
              e.target.style.boxShadow = '0 0 15px rgba(201, 168, 76, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)'
              e.target.style.boxShadow = 'none'
            }}
          >
            ‹
          </button>

          {/* Dot Indicators */}
          <div style={{ display: 'flex', gap: '10px' }}>
            {projects.map((_, idx) => {
              const active = activeIndex === idx
              return (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    padding: 0,
                    border: 'none',
                    background: active ? '#C9A84C' : 'rgba(255, 255, 255, 0.18)',
                    transform: active ? 'scale(1.25)' : 'scale(1)',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'all 0.25s'
                  }}
                />
              )
            })}
          </div>

          {/* Next Arrow */}
          <button
            onClick={() => {
              setActiveIndex((prev) => (prev === projects.length - 1 ? 0 : prev + 1))
            }}
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(201, 168, 76, 0.2)',
              color: '#C9A84C',
              fontSize: '1.2rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: 1,
              outline: 'none',
              transition: 'background 0.2s, box-shadow 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(201, 168, 76, 0.12)'
              e.target.style.boxShadow = '0 0 15px rgba(201, 168, 76, 0.2)'
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)'
              e.target.style.boxShadow = 'none'
            }}
          >
            ›
          </button>
        </div>
      </div>
    </section>
  )
}
