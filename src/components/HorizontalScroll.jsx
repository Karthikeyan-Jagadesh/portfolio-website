import React, { useEffect } from 'react'
import { useHorizontalScroll } from '../hooks/useHorizontalScroll.js'

export default function HorizontalScroll({ sections, onSectionChange, onReady }) {
  const scroll = useHorizontalScroll(sections.length, onSectionChange)

  useEffect(() => {
    onReady?.({ jumpTo: scroll.jumpTo, backToStart: scroll.backToStart })
  }, [onReady, scroll.backToStart, scroll.jumpTo])

  return (
    <main className="horizontal-shell">
      <div className={`seam-flash ${scroll.seamFlash ? 'show' : ''}`} />
      <div ref={scroll.trackRef} className="horizontal-track" style={{ '--section-count': sections.length }}>
        {sections.map(({ id, component: Section }, index) => (
          <Section key={id} index={index} isActive={scroll.active === index} onJump={scroll.jumpTo} onBackToStart={scroll.backToStart} />
        ))}
      </div>
      <div className="progress-bar" style={{ transform: `scaleX(${scroll.progress})` }} />
    </main>
  )
}
