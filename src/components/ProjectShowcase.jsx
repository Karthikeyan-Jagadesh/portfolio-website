import React, { useState, useEffect, useRef } from 'react'

const projects = [
  {
    id: "01",
    title: "Pet Adoption Center",
    tech: ["HTML5", "CSS3(Vanilla)", "JavaScript"],
    screenshot: "/pet-adoption.png",
    description: "A multi-page frontend website for browsing and adopting pets. Features interactive category filtering, dynamic pet details, an application form with validation, and success stories — styled using a minimal gold-and-black design system.",
    github: "https://github.com/Karthikeyan-Jagadesh/Pet-Adoption-Center",
    live: null
  },
  {
    id: "02",
    title: "To-Do Calendar",
    tech: ["Node.js", "Express.js", "Oracle DB", "JWT", "HTML", "CSS", "JavaScript"],
    screenshot: "/todo-calendar.png",
    description: "A secure task-management web application featuring a drag-and-drop calendar interface. Built with role-based dashboard access, session authentication using JSON Web Tokens (JWT), password hashing, and Oracle database integration.",
    github: "https://github.com/Karthikeyan-Jagadesh/To_do-Management-System",
    live: null
  },
  {
    id: "03",
    title: "RouteWake",
    tech: ["Java", "Spring Boot", "Leaflet.js", "Oracle DB", "HTML", "CSS", "JavaScript"],
    screenshot: "/routewake.png",
    description: "A location-aware transit assistant designed to prevent missing transit stops. Tracks real-time GPS locations and rings an alarm as you approach pre-set destination coordinates. Stores past trips and alarm history in a secure database.",
    github: "https://github.com/Karthikeyan-Jagadesh/Location-Alarm-Tracker",
    live: null
  },
  {
    id: "04",
    title: "MovieSphere",
    tech: ["React 19", "Vite", "Vanilla CSS", "Context API", "TMDB REST API"],
    screenshot: "/movisphere.png",
    description: "A high-performance cinematic discovery interface built with a bold Neo-Brutalist design. Fetches and displays popular, top-rated, and custom genres from the TMDB API, featuring wishlists, search filtering, and custom color theme switches.",
    github: "https://github.com/Karthikeyan-Jagadesh/Modern-Movie-Application",
    live: "https://movisphere.vercel.app"
  }
]

export default function ProjectShowcase() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [animate, setAnimate] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const previewRef = useRef(null)

  // Track responsive screen size
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Replay entry animation and reset scroll on project change
  useEffect(() => {
    setAnimate(false)
    if (previewRef.current) {
      previewRef.current.scrollTop = 0
    }
    const timer = requestAnimationFrame(() => {
      setAnimate(true)
    })
    return () => cancelAnimationFrame(timer)
  }, [activeIndex])

  const activeProject = projects[activeIndex]

  // Hover state for rows
  const [hoveredIndex, setHoveredIndex] = useState(null)

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        gap: '40px',
        width: '100%',
        height: '100%',
        minHeight: isMobile ? 'auto' : '60vh',
        color: '#FFFFFF'
      }}
    >
      {/* LEFT COLUMN: LIST */}
      <div
        style={{
          flex: isMobile ? 'none' : '0 0 40%',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: '#C9A84C',
            letterSpacing: '4px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '8px'
          }}
        >
          MISSION ARCHIVE
        </span>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          {projects.map((proj, idx) => {
            const isActive = activeIndex === idx
            const isHovered = hoveredIndex === idx

            // Define dynamic row opacity and translation shift
            let opacity = 0.35
            let transformX = '0px'
            if (isActive) {
              opacity = 1
            } else if (isHovered) {
              opacity = 0.6
              transformX = '4px'
            }

            return (
              <button
                key={proj.id}
                onClick={() => setActiveIndex(idx)}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  padding: '16px 20px 16px 24px',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                  width: '100%',
                  opacity: opacity,
                  transform: `translateX(${transformX})`,
                  transition: 'opacity 0.25s ease, transform 0.25s ease',
                  userSelect: 'none'
                }}
              >
                {/* Active Sliding Left Border */}
                <div
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    width: '3px',
                    height: '100%',
                    background: '#C9A84C',
                    transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                    transformOrigin: 'top',
                    transition: 'transform 300ms ease'
                  }}
                />

                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: isActive ? '18px' : '14px',
                      color: '#C9A84C',
                      fontWeight: isActive ? 'bold' : 'normal',
                      transition: 'font-size 0.25s ease'
                    }}
                  >
                    {proj.id}
                  </span>
                  <strong
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: isActive ? '20px' : '16px',
                      color: isActive ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                      fontWeight: 'normal',
                      transition: 'font-size 0.25s ease, color 0.25s ease'
                    }}
                  >
                    {proj.title}
                  </strong>
                </div>

                {/* Expanded Tech List for Active Project */}
                {isActive && (
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: '#C9A84C',
                      marginTop: '4px',
                      marginLeft: '34px',
                      textTransform: 'uppercase',
                      letterSpacing: '1px'
                    }}
                  >
                    {proj.tech.join(' / ')}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: PREVIEW PANEL */}
      <div
        ref={previewRef}
        style={{
          flex: '1',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          overflowY: isMobile ? 'visible' : 'auto',
          maxHeight: isMobile ? 'auto' : '80vh',
          paddingRight: isMobile ? '0' : '12px'
        }}
      >
        {/* BROWSER MOCKUP */}
        <div
          style={{
            borderRadius: '8px',
            border: '1px solid rgba(255,255,255,0.1)',
            background: '#141414',
            overflow: 'hidden',
            position: 'relative',
            aspectRatio: '1.6',
            width: '100%',
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 300ms ease, transform 300ms ease'
          }}
        >
          {/* Chrome Bar */}
          <div
            style={{
              height: '30px',
              background: 'rgba(255,255,255,0.03)',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px',
              position: 'relative'
            }}
          >
            {/* Dots */}
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
            </div>

            {/* Address Bar */}
            <div
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                background: 'rgba(0,0,0,0.2)',
                borderRadius: '4px',
                width: '40%',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                color: 'rgba(255,255,255,0.3)',
                fontFamily: 'var(--font-mono)'
              }}
            >
              mission::{activeProject.title.toLowerCase().replace(/\s+/g, '-')}
            </div>
          </div>

          {/* Screenshot Image or Fallback */}
          <div
            style={{
              width: '100%',
              height: 'calc(100% - 30px)',
              background: 'linear-gradient(135deg, #1a1a1a, #2a2a1a)',
              position: 'relative'
            }}
          >
            {activeProject.screenshot ? (
              <img
                src={activeProject.screenshot}
                alt={activeProject.title}
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

            {/* Ghost Watermark */}
            <div
              style={{
                position: 'absolute',
                bottom: '-20px',
                right: '10px',
                fontSize: '180px',
                fontWeight: '900',
                color: '#C9A84C',
                opacity: 0.06,
                fontFamily: 'var(--font-display)',
                lineHeight: 1,
                pointerEvents: 'none',
                userSelect: 'none'
              }}
            >
              {activeProject.id}
            </div>
          </div>
        </div>

        {/* DETAILS PANEL */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
            opacity: animate ? 1 : 0,
            transform: animate ? 'translateY(0)' : 'translateY(10px)',
            transition: 'opacity 300ms ease 50ms, transform 300ms ease 50ms'
          }}
        >
          <h3
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '2.5rem',
              fontWeight: 'normal',
              margin: 0
            }}
          >
            {activeProject.title}
          </h3>

          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '15px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.65)',
              margin: 0
            }}
          >
            {activeProject.description}
          </p>

          {/* Tech Pills */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '8px',
              marginTop: '4px'
            }}
          >
            {activeProject.tech.map((t) => (
              <span
                key={t}
                style={{
                  border: '1px solid rgba(201, 168, 76, 0.3)',
                  color: '#C9A84C',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  padding: '4px 10px',
                  borderRadius: '100px',
                  textTransform: 'uppercase'
                }}
              >
                {t}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div
            style={{
              display: 'flex',
              gap: '16px',
              marginTop: '8px'
            }}
          >
            {/* VIEW CODE */}
            <a
              href={activeProject.github}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#0D0D0D',
                border: '1px solid #C9A84C',
                color: '#C9A84C',
                textDecoration: 'none',
                fontFamily: 'var(--font-ui)',
                fontSize: '12px',
                fontWeight: '600',
                letterSpacing: '1px',
                padding: '12px 24px',
                borderRadius: '2px',
                transition: 'background 0.25s, color 0.25s',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#C9A84C'
                e.target.style.color = '#0D0D0D'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = '#0D0D0D'
                e.target.style.color = '#C9A84C'
              }}
            >
              VIEW CODE
            </a>

            {/* LIVE / OFFLINE */}
            {activeProject.live ? (
              <a
                href={activeProject.live}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '1px solid rgba(201, 168, 76, 0.5)',
                  color: '#C9A84C',
                  textDecoration: 'none',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  padding: '12px 24px',
                  borderRadius: '2px',
                  transition: 'border 0.25s, background 0.25s, color 0.25s',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(201, 168, 76, 0.1)'
                  e.target.style.borderColor = '#C9A84C'
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent'
                  e.target.style.borderColor = 'rgba(201, 168, 76, 0.5)'
                }}
              >
                LIVE DEMO
              </a>
            ) : (
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: 'rgba(255, 255, 255, 0.3)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '12px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  padding: '12px 24px',
                  borderRadius: '2px',
                  userSelect: 'none'
                }}
              >
                OFFLINE
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
