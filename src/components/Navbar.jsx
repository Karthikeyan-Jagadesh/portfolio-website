import React from 'react'

export default function Navbar({ activeSection, total, onJump }) {
  return (
    <header className="navbar">
      <button className="nav-brand" type="button" onClick={() => onJump(0)}>KARTHIK.DEV</button>
      <nav className="section-dots" aria-label="Portfolio sections">
        {Array.from({ length: total }).map((_, index) => (
          <button
            key={index}
            type="button"
            className={activeSection === index ? 'active' : ''}
            aria-label={`Go to section ${index + 1}`}
            onClick={() => onJump(index)}
          />
        ))}
      </nav>
      <div className="section-counter" aria-live="polite">
        <span key={activeSection}>{String(activeSection + 1).padStart(2, '0')}</span> / {String(total).padStart(2, '0')}
      </div>
    </header>
  )
}
