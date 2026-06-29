import React from 'react'
import MagneticButton from '../components/MagneticButton.jsx'

export default function EndFrame({ onBackToStart }) {
  return (
    <section className="scene end-scene">
      <div className="credits">
        <h2>KARTHIKEYAN JAGADESH</h2>
        <div className="gold-rule" />
        <p>ENGINEERED WITH PURPOSE / 2026</p>
        <div className="social-icons">
          <a href="https://github.com/Karthikeyan-Jagadesh" target="_blank" rel="noreferrer" aria-label="GitHub">
            <svg viewBox="0 0 24 24"><path d="M12 2C6.5 2 2 6.6 2 12.2c0 4.5 2.9 8.3 6.8 9.7.5.1.7-.2.7-.5v-1.8c-2.8.6-3.4-1.2-3.4-1.2-.5-1.2-1.1-1.5-1.1-1.5-.9-.6.1-.6.1-.6 1 .1 1.6 1.1 1.6 1.1.9 1.6 2.4 1.1 2.9.9.1-.7.4-1.1.7-1.4-2.2-.3-4.6-1.1-4.6-5 0-1.1.4-2 1.1-2.8-.1-.3-.5-1.3.1-2.8 0 0 .9-.3 2.9 1.1.9-.2 1.8-.4 2.7-.4s1.8.1 2.7.4c2-1.4 2.9-1.1 2.9-1.1.6 1.5.2 2.5.1 2.8.7.8 1.1 1.7 1.1 2.8 0 3.9-2.4 4.8-4.6 5 .4.3.7 1 .7 2v2.9c0 .3.2.6.7.5 4-1.4 6.8-5.2 6.8-9.7C22 6.6 17.5 2 12 2Z" /></svg>
          </a>
          <a href="https://linkedin.com/in/karthikeyan-jagadesh" target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <svg viewBox="0 0 24 24"><path d="M5 8h3.4v11H5V8Zm1.7-5A2 2 0 1 1 6.6 7 2 2 0 0 1 6.7 3Zm4 5H14v1.5h.1c.5-.9 1.6-1.8 3.3-1.8 3.5 0 4.1 2.3 4.1 5.3v6h-3.4v-5.4c0-1.3 0-2.9-1.8-2.9s-2.1 1.4-2.1 2.8V19h-3.4V8Z" /></svg>
          </a>
        </div>
        <MagneticButton onClick={onBackToStart}>BACK TO START</MagneticButton>
      </div>
    </section>
  )
}
