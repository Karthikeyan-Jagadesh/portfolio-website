import React from 'react'
import MagneticButton from '../components/MagneticButton.jsx'
import { useGitHubStats } from '../hooks/useGitHubStats.js'

export default function Entry({ onJump }) {
  const stats = useGitHubStats()

  return (
    <section className="scene entry-scene">
      <div className="layer layer-front entry-left">
        <span className="film-label">[ SUBJECT PROFILE ]</span>
        <h1>
          <span>KARTHIKEYAN</span>
          <em>JAGADESH</em>
        </h1>
        <div className="hand-drawn-rule">
          <svg viewBox="0 0 100 10" preserveAspectRatio="none">
            <path d="M0,5 Q25,2 50,6 T100,4 M5,8 Q40,6 75,9 T95,7" />
          </svg>
        </div>
        <p>Full Stack Software Engineer / competitive programmer / system builder</p>
        <div className="entry-actions">
          <MagneticButton onClick={() => onJump(2)}>EXPLORE WORK</MagneticButton>
          <MagneticButton className="secondary" onClick={() => onJump(1)}>OPEN DOSSIER</MagneticButton>
        </div>
      </div>
      <div className="layer layer-mid entry-right">
        <div className="sketchy-doodle-frame">
          <div className="tape-effect tape-tl" />
          <div className="tape-effect tape-tr" />
          <div className="stat-handwritten">
            <span>{stats.publicRepos}</span> PUBLIC REPOS
          </div>
          <div className="stat-handwritten">
            <span>5+</span> LANGUAGES
          </div>
          <div className="stat-handwritten">
            <span>2+</span> YEARS BUILDING
          </div>
        </div>
      </div>
    </section>
  )
}
