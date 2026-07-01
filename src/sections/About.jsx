import React from 'react'
import { skills } from '../data/skills.js'
import { useGitHubStats } from '../hooks/useGitHubStats.js'

export default function About({ isActive }) {
  const stats = useGitHubStats()

  return (
    <section className={`scene about-scene ${isActive ? 'active' : ''}`}>
      <article className="polaroid-card">
        <div className="tape-effect tape-tl" />
        <div className="tape-effect tape-tr" />
        <div className="polaroid-photo">
          <span style={{ lineHeight: 1 }}>KJ</span>
        </div>
        <div className="polaroid-caption">Karthik Jagadesh</div>
      </article>

      <article className="bio-column">
        <span className="film-label">[ BIOGRAPHY ]</span>
        <p>
          I design and build software from the database level up. Focused on structure, clean abstraction, and maintainable systems. Experienced in Java, Spring Boot, Node.js, and React.
        </p>
        <div className="education-timeline">
          <div className="timeline-item">
            <span className="year">2009 – 2024</span>
            <span className="institution">The Camford International School</span>
          </div>
          <div className="timeline-item">
            <span className="year">2024 – 2027</span>
            <span className="institution">PSG College of Technology</span>
          </div>
        </div>
      </article>

      <article className="skills-column">
        <span className="film-label">[ CAPABILITIES ]</span>
        <p className="repo-note">
          {stats.publicRepos} active public repositories / {stats.contributionsEstimate} estimated updates
        </p>
        <div className="skills-list">
          {skills.map((skill) => {
            const filledBlocks = Math.round((skill.level / 100) * 10)
            const emptyBlocks = 10 - filledBlocks
            const hatchStyle = '/'.repeat(filledBlocks * 2)
            const dotStyle = '.'.repeat(emptyBlocks * 2)
            return (
              <div className="skill-row" key={skill.name}>
                <span>{skill.name}</span>
                <i>[{hatchStyle}{dotStyle}]</i>
                <strong>{skill.level}%</strong>
              </div>
            )
          })}
        </div>
      </article>
    </section>
  )
}
