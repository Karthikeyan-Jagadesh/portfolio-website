import React, { useState, useEffect, useRef } from 'react'

const projects = [
  {
    id: "01",
    title: "Pet Adoption Center",
    status: "ARCHIVED",
    description: "A multi-page frontend website for browsing and adopting pets. Features filterable pet listings, an adoption form with validation, a step-by-step adoption guide, success stories, and a contact page — all built with a shared minimal design system and responsive layout.",
    tech: ["HTML5", "CSS3", "JavaScript"],
    image: "/covers/pet.png",
    github: "https://github.com/Karthikeyan-Jagadesh/Pet-Adoption-Center",
    live: null
  },
  {
    id: "02",
    title: "To-Do Management System",
    status: "ARCHIVED",
    description: "A full-stack task management application with create, update, delete, and status-tracking functionality. Built with a Java backend and a clean, minimal frontend interface for managing daily tasks efficiently.",
    tech: ["Java", "Spring Boot", "JDBC", "Oracle DB", "JavaScript"],
    image: "/covers/todo.png",
    github: "https://github.com/Karthikeyan-Jagadesh/To_do-Management-System",
    live: null
  },
  {
    id: "03",
    title: "RouteWake",
    status: "ARCHIVED",
    description: "A GPS-based location alarm tracker. Set a destination pin on an interactive Leaflet map and get alerted automatically when you're within a defined radius — built for commuters who fall asleep on transit.",
    tech: ["Java", "Spring Boot", "Leaflet.js", "Oracle DB", "JDBC", "Haversine Formula"],
    image: "/covers/routewake.png",
    github: "https://github.com/Karthikeyan-Jagadesh/Location-Alarm-Tracker",
    live: null
  },
  {
    id: "04",
    title: "MovieSphere",
    status: "ACTIVE",
    description: "A React 19 movie discovery app powered by the TMDB API. Features dynamic search, trending lists, full movie detail pages with cast and ratings, and a Neo-Brutalist design language built for speed and clarity.",
    tech: ["React 19", "Vite", "TMDB API", "CSS3"],
    image: "/covers/moviesphere.png",
    github: "https://github.com/Karthikeyan-Jagadesh/Modern-Movie-Application",
    live: "https://movie-sphere-eta.vercel.app/"
  }
]

// Map requested image cover paths to existing working public paths
const resolveImage = (path) => {
  if (path === '/covers/pet.png') return '/pet-adoption.png'
  if (path === '/covers/todo.png') return '/todo-calendar.png'
  if (path === '/covers/routewake.png') return '/routewake.png'
  if (path === '/covers/moviesphere.png') return '/movisphere.png'
  return path
}

export default function ProjectShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [exitingIndex, setExitingIndex] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [panelReady, setPanelReady] = useState(false)
  const [triggerEntry, setTriggerEntry] = useState(false)
  const [typedText, setTypedText] = useState('')
  const [flash, setFlash] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const bgCanvasRef = useRef(null)

  // 1. Responsiveness check
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 2. Redacted text background animation
  useEffect(() => {
    const canvas = bgCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId
    let bars = []
    const barCount = 20

    const initBars = (w, h) => {
      bars = []
      for (let i = 0; i < barCount; i++) {
        bars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          width: Math.random() * 90 + 35,
          height: 10,
          speed: Math.random() * 0.35 + 0.12
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
      initBars(rect.width, rect.height)
    }

    resize()
    window.addEventListener('resize', resize)

    const animate = () => {
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = 'rgba(201, 168, 76, 0.024)'

      bars.forEach((bar) => {
        bar.y += bar.speed
        if (bar.y > h) {
          bar.y = -bar.height
          bar.x = Math.random() * w
          bar.width = Math.random() * 90 + 35
          bar.speed = Math.random() * 0.35 + 0.12
        }
        ctx.fillRect(bar.x, bar.y, bar.width, bar.height)
      })

      animId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // 3. Typewriter effect
  useEffect(() => {
    if (!panelReady) {
      setTypedText('')
      return
    }

    const fullText = projects[activeIndex]?.description || ''
    let charIdx = 0
    setTypedText('')

    const interval = setInterval(() => {
      charIdx++
      setTypedText(fullText.substring(0, charIdx))
      if (charIdx >= fullText.length) {
        clearInterval(interval)
      }
    }, 15)

    return () => clearInterval(interval)
  }, [activeIndex, panelReady])

  // 4. Keyboard Arrow Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isAnimating) return
      if (e.key === 'ArrowLeft') {
        handleSwitch(activeIndex === 0 ? projects.length - 1 : activeIndex - 1)
      } else if (e.key === 'ArrowRight') {
        handleSwitch(activeIndex === projects.length - 1 ? 0 : activeIndex + 1)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, isAnimating])

  // 5. Index Switch handler with simultaneous entrance and exit
  const handleSwitch = (newIndex) => {
    if (isAnimating || newIndex === activeIndex) return
    setIsAnimating(true)
    setExitingIndex(activeIndex)
    setActiveIndex(newIndex)
    setTriggerEntry(false)
    setPanelReady(false)

    // Flash bottom nav indicator
    setFlash(true)
    setTimeout(() => setFlash(false), 200)

    // Trigger entering slide in next frame
    setTimeout(() => {
      setTriggerEntry(true)
    }, 45)

    // Clear exiting status after transitions complete (600ms)
    setTimeout(() => {
      setIsAnimating(false)
      setExitingIndex(null)
      setPanelReady(true)
    }, 620)
  }

  const renderDossierCard = (idx, isExiting) => {
    const proj = projects[idx]
    if (!proj) return null

    // Determine animation transform string
    let transformStyle = ''
    let opacityStyle = 0
    let pointerEvents = isExiting ? 'none' : 'auto'

    if (isExiting) {
      // Exit transform: current slides translateX(60%) opacity(0)
      transformStyle = 'translateX(60%) scale(1) rotateY(0deg)'
      opacityStyle = 0
    } else {
      // Entrance transform: translateX(-120%) rotateY(-25deg) scale(0.85) opacity(0) -> default active
      if (triggerEntry) {
        transformStyle = 'translateX(0) scale(1) rotateY(0deg)'
        opacityStyle = 1
      } else {
        transformStyle = 'translateX(-120%) rotateY(-25deg) scale(0.85)'
        opacityStyle = 0
      }
    }

    const isTyping = typedText.length < proj.description.length

    return (
      <div
        key={`${proj.id}-${isExiting ? 'exiting' : 'entering'}`}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          transform: transformStyle,
          opacity: opacityStyle,
          transition: 'transform 600ms cubic-bezier(0.34, 1.2, 0.64, 1), opacity 600ms cubic-bezier(0.34, 1.2, 0.64, 1)',
          pointerEvents,
          zIndex: isExiting ? 1 : 2
        }}
      >
        {/* Left column (45%) — Screenshot Reticle */}
        <div
          style={{
            width: isMobile ? '100%' : '45%',
            height: isMobile ? '200px' : '100%',
            position: 'relative',
            background: '#141414',
            overflow: 'hidden',
            borderRight: isMobile ? 'none' : '1px solid rgba(201, 168, 76, 0.15)',
            borderBottom: isMobile ? '1px solid rgba(201, 168, 76, 0.15)' : 'none',
            flexShrink: 0
          }}
        >
          {/* Image cover */}
          <img
            src={resolveImage(proj.image)}
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

          {/* Scanline CRT overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'repeating-linear-gradient(transparent, transparent 2px, rgba(0,0,0,0.15) 3px)',
              pointerEvents: 'none',
              zIndex: 2
            }}
          />

          {/* SVG reticle corners */}
          <div style={{ position: 'absolute', top: 12, left: 12, width: 12, height: 12, borderTop: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C', zIndex: 3 }} />
          <div style={{ position: 'absolute', top: 12, right: 12, width: 12, height: 12, borderTop: '2px solid #C9A84C', borderRight: '2px solid #C9A84C', zIndex: 3 }} />
          <div style={{ position: 'absolute', bottom: 12, left: 12, width: 12, height: 12, borderBottom: '2px solid #C9A84C', borderLeft: '2px solid #C9A84C', zIndex: 3 }} />
          <div style={{ position: 'absolute', bottom: 12, right: 12, width: 12, height: 12, borderBottom: '2px solid #C9A84C', borderRight: '2px solid #C9A84C', zIndex: 3 }} />

          {/* Pulser network status dot */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              right: '16px',
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              background: proj.live ? '#4ade80' : '#4b5563',
              boxShadow: proj.live ? '0 0 8px #4ade80' : 'none',
              zIndex: 3,
              transition: 'all 0.3s ease'
            }}
          />
        </div>

        {/* Right column (55%) — Content Dossier */}
        <div
          style={{
            width: isMobile ? '100%' : '55%',
            height: isMobile ? 'calc(100% - 200px)' : '100%',
            padding: isMobile ? '16px' : '28px',
            boxSizing: 'border-box',
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            overflowY: 'auto'
          }}
        >
          {/* Top Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(201,168,76,0.2)',
              paddingBottom: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: '#C9A84C',
              letterSpacing: '1px'
            }}
          >
            <span>MISSION DOSSIER</span>
            <span>// {proj.id}</span>
          </div>

          {/* Title and Badge */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: isMobile ? '1.3rem' : '1.6rem',
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  margin: 0,
                  position: 'relative'
                }}
              >
                {proj.title}
                {/* Underline width animates on entry */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-4px',
                    left: 0,
                    height: '2px',
                    background: '#C9A84C',
                    width: triggerEntry && !isExiting ? '100%' : '0%',
                    transition: 'width 400ms ease-out 200ms'
                  }}
                />
              </h3>

              {/* Status stamp badge */}
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '9px',
                  fontWeight: '600',
                  padding: '3px 8px',
                  borderRadius: '3px',
                  letterSpacing: '1px',
                  border: proj.status === 'ACTIVE' ? '1px solid #4ade80' : '1px solid #4b5563',
                  color: proj.status === 'ACTIVE' ? '#4ade80' : '#9ca3af',
                  background: proj.status === 'ACTIVE' ? 'rgba(74, 222, 128, 0.05)' : 'rgba(156, 163, 175, 0.05)'
                }}
              >
                {proj.status}
              </span>
            </div>
          </div>

          {/* Typewriter description */}
          <div style={{ flexGrow: 1, minHeight: isMobile ? 'auto' : '85px' }}>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.85rem',
                lineHeight: '1.55',
                color: 'rgba(255, 255, 255, 0.75)',
                margin: 0,
                textAlign: 'justify',
                wordBreak: 'break-word'
              }}
            >
              {!isExiting ? typedText : proj.description}
              {!isExiting && isTyping && (
                <span
                  style={{
                    display: 'inline-block',
                    marginLeft: '2px',
                    width: '6px',
                    height: '12px',
                    background: '#C9A84C',
                    animation: 'showcaseBlink 1s step-end infinite'
                  }}
                />
              )}
            </p>
          </div>

          {/* Staggered progress weapon tech bars */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              opacity: panelReady && !isExiting ? 1 : 0,
              transform: panelReady && !isExiting ? 'translateY(0)' : 'translateY(10px)',
              transition: 'opacity 0.4s ease, transform 0.4s ease'
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: '#C9A84C',
                letterSpacing: '2px'
              }}
            >
              // TOOLS & WEAPONS
            </span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {proj.tech.map((tool, tIdx) => (
                <div key={tool} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.7rem',
                      color: 'rgba(255, 255, 255, 0.65)'
                    }}
                  >
                    {tool}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      height: '2px',
                      background: 'rgba(255,255,255,0.06)',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        height: '100%',
                        background: 'rgba(201, 168, 76, 0.6)',
                        width: panelReady && !isExiting ? '100%' : '0%',
                        transition: 'width 500ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                        transitionDelay: `${tIdx * 100}ms`
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Access points (Links) */}
          <div
            style={{
              display: 'flex',
              gap: '12px',
              marginTop: 'auto',
              paddingTop: '8px',
              opacity: panelReady && !isExiting ? 1 : 0,
              transition: 'opacity 0.4s ease'
            }}
          >
            {/* Repo Link */}
            <a
              href={proj.github}
              target="_blank"
              rel="noreferrer"
              style={{
                flex: 1,
                border: '1px solid #C9A84C',
                background: 'transparent',
                color: '#C9A84C',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: '600',
                padding: '8px 0',
                borderRadius: '3px',
                textAlign: 'center',
                textDecoration: 'none',
                transition: 'all 0.25s'
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
              [ REPO ↗ ]
            </a>

            {/* Deploy Link */}
            {proj.live ? (
              <a
                href={proj.live}
                target="_blank"
                rel="noreferrer"
                style={{
                  flex: 1,
                  border: '1px solid #4ade80',
                  background: 'rgba(74, 222, 128, 0.05)',
                  color: '#4ade80',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '8px 0',
                  borderRadius: '3px',
                  textAlign: 'center',
                  textDecoration: 'none',
                  transition: 'all 0.25s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = '#4ade80'
                  e.target.style.color = '#0D0D0D'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(74, 222, 128, 0.05)'
                  e.target.style.color = '#4ade80'
                }}
              >
                [ DEPLOY ↗ ]
              </a>
            ) : (
              <span
                style={{
                  flex: 1,
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.02)',
                  color: 'rgba(255,255,255,0.3)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  padding: '8px 0',
                  borderRadius: '3px',
                  textAlign: 'center',
                  cursor: 'not-allowed',
                  opacity: 0.4
                }}
              >
                [ OFFLINE ]
              </span>
            )}
          </div>
        </div>
      </div>
    )
  }

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
        padding: isMobile ? '20px 10px' : '40px 20px',
        boxSizing: 'border-box'
      }}
    >
      {/* 1. Global blinking cursor styles and animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes showcaseBlink {
            from, to { opacity: 1; }
            50% { opacity: 0; }
          }
        `
      }} />

      {/* 2. Redacted bars background canvas */}
      <canvas
        ref={bgCanvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          pointerEvents: 'none',
          opacity: 0.6
        }}
      />

      {/* 3. Main Vault Door Dossier Grid */}
      <div
        style={{
          zIndex: 1,
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isMobile ? '12px' : '0',
          width: '100%',
          maxWidth: '860px',
          height: isMobile ? 'auto' : '520px',
          boxSizing: 'border-box'
        }}
      >
        {/* Left Rail — Manila Folders Tabs */}
        <div
          style={{
            width: isMobile ? '100%' : '80px',
            height: isMobile ? 'auto' : '100%',
            background: '#0a0a0a',
            borderRight: isMobile ? 'none' : '1px solid rgba(201,168,76,0.15)',
            borderBottom: isMobile ? '1px solid rgba(201,168,76,0.15)' : 'none',
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: isMobile ? '8px' : '12px',
            padding: isMobile ? '10px 4px' : '16px 0',
            boxSizing: 'border-box',
            flexShrink: 0,
            overflowX: isMobile ? 'auto' : 'visible'
          }}
        >
          {projects.map((proj, idx) => {
            const isActive = activeIndex === idx
            return (
              <button
                key={proj.id}
                disabled={isAnimating}
                onClick={() => handleSwitch(idx)}
                style={{
                  width: isMobile ? '80px' : '48px',
                  height: isMobile ? '40px' : '140px',
                  writingMode: isMobile ? 'horizontal-tb' : 'vertical-rl',
                  transform: isMobile ? 'none' : 'rotate(180deg)',
                  background: isActive ? 'rgba(201, 168, 76, 0.08)' : '#111',
                  border: '1px solid rgba(201, 168, 76, 0.12)',
                  borderLeft: !isMobile && isActive ? '3px solid #C9A84C' : '1px solid rgba(201, 168, 76, 0.12)',
                  borderBottom: isMobile && isActive ? '3px solid #C9A84C' : '1px solid rgba(201, 168, 76, 0.12)',
                  borderRadius: '4px 4px 0 0',
                  color: isActive ? '#C9A84C' : 'rgba(255, 255, 255, 0.4)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  fontWeight: '600',
                  cursor: isAnimating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  transition: 'all 0.25s ease',
                  outline: 'none',
                  position: 'relative',
                  opacity: isActive ? 1 : 0.4
                }}
                onMouseEnter={(e) => {
                  if (isActive || isAnimating) return
                  e.currentTarget.style.opacity = '0.75'
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'rotate(180deg) translateX(-4px)'
                  } else {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (isActive || isAnimating) return
                  e.currentTarget.style.opacity = '0.4'
                  if (!isMobile) {
                    e.currentTarget.style.transform = 'rotate(180deg)'
                  } else {
                    e.currentTarget.style.transform = 'none'
                  }
                }}
              >
                {/* Badge Number */}
                <span style={{ fontSize: '9px', color: '#C9A84C' }}>{proj.id}</span>
                {/* Tab Title */}
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {isMobile && proj.title.length > 8 ? `${proj.title.substring(0, 7)}.` : proj.title}
                </span>
              </button>
            )
          })}
        </div>

        {/* Dossier Card Container Viewport */}
        <div
          style={{
            flexGrow: 1,
            width: isMobile ? '92vw' : '780px',
            height: isMobile ? '500px' : '520px',
            background: '#0f0f0f',
            border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: '4px',
            boxShadow: '0 0 80px rgba(0,0,0,0.8), 0 0 30px rgba(201,168,76,0.05)',
            position: 'relative',
            overflow: 'hidden',
            perspective: '1000px'
          }}
        >
          {/* Exiting Card */}
          {exitingIndex !== null && renderDossierCard(exitingIndex, true)}

          {/* Active Card */}
          {renderDossierCard(activeIndex, false)}
        </div>
      </div>

      {/* 4. Bottom Controls */}
      <div
        style={{
          zIndex: 1,
          marginTop: '32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '24px',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          color: '#C9A84C',
          letterSpacing: '3px',
          userSelect: 'none'
        }}
      >
        <button
          disabled={isAnimating}
          onClick={() => handleSwitch(activeIndex === 0 ? projects.length - 1 : activeIndex - 1)}
          style={{
            background: 'none',
            border: 'none',
            color: isAnimating ? 'rgba(201, 168, 76, 0.3)' : '#C9A84C',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            letterSpacing: 'inherit',
            outline: 'none',
            transition: 'color 0.2s'
          }}
        >
          ◀ PREV MISSION
        </button>

        <span
          style={{
            color: flash ? '#FFFFFF' : '#C9A84C',
            transition: 'color 100ms ease'
          }}
        >
          [{projects[activeIndex]?.id}/{String(projects.length).padStart(2, '0')}]
        </span>

        <button
          disabled={isAnimating}
          onClick={() => handleSwitch(activeIndex === projects.length - 1 ? 0 : activeIndex + 1)}
          style={{
            background: 'none',
            border: 'none',
            color: isAnimating ? 'rgba(201, 168, 76, 0.3)' : '#C9A84C',
            cursor: isAnimating ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
            fontSize: 'inherit',
            letterSpacing: 'inherit',
            outline: 'none',
            transition: 'color 0.2s'
          }}
        >
          NEXT MISSION ▶
        </button>
      </div>
    </section>
  )
}
