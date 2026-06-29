import React from 'react'
import MagneticButton from '../components/MagneticButton.jsx'
import { useGitHubStats } from '../hooks/useGitHubStats.js'

export default function Entry({ onJump }) {
  const stats = useGitHubStats()

  return (
    <section className="scene entry-scene">
      <div className="intro-reveal" />
      <div className="layer layer-back ghost-name">KARTHIKEYAN</div>
      <div className="layer layer-front entry-left">
        <span className="film-label">KARTHIK.DEV</span>
        <h1><span>KARTHIKEYAN</span><em>JAGADESH</em></h1>
        <div className="gold-rule" />
        <p>Full Stack Developer</p>
        <div className="entry-actions">
          <MagneticButton onClick={() => onJump(2)}>EXPLORE WORK</MagneticButton>
          <MagneticButton className="secondary" onClick={() => onJump(1)}>OPEN DOSSIER</MagneticButton>
        </div>
      </div>
      <div className="layer layer-mid entry-right">
        <div className="gold-poly" />
        <span className="stat-pill pill-a">{stats.publicRepos} REPOS</span>
        <span className="stat-pill pill-b">5+ LANGUAGES</span>
        <span className="stat-pill pill-c">2 YEARS BUILDING</span>
      </div>
    </section>
  )
}
