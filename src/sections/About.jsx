import React from 'react'
import { skills } from '../data/skills.js'
import { useGitHubStats } from '../hooks/useGitHubStats.js'

export default function About({ isActive }) {
  const stats = useGitHubStats()

  return (
    <section className={`scene about-scene ${isActive ? 'active' : ''}`}>
      <div className="layer layer-back section-number">02</div>
      <article className="identity-card magnetic">
        <span className="film-label">[SUBJECT]</span>
        <div className="portrait">
          <span style={{ lineHeight: 1 }}>KJ</span>
          <i className="bracket tl" />
          <i className="bracket tr" />
          <i className="bracket bl" />
          <i className="bracket br" />
        </div>
        <dl>
          <div><dt>NAME:</dt><dd>Karthikeyan Jagadesh</dd></div>
          <div><dt>CLASS:</dt><dd>Full Stack Developer</dd></div>
          <div><dt>BASE:</dt><dd>Coimbatore, Tamil Nadu</dd></div>
          <div><dt>STATUS:</dt><dd>Actively Building</dd></div>
        </dl>
        <strong>[IDENTITY VERIFIED]</strong>
      </article>
      <article className="bio-column">
        <span className="film-label">ABOUT</span>
        <p>
          I build software from the backend out, structured, maintainable, and designed to last. Java, Spring Boot, Node.js, React. REST APIs, auth systems, real-time tracking, data-driven apps. Currently deep in competitive programming and system design.
        </p>
        <div className="education-timeline">
          <div className="timeline-item">
            <span className="year">2009 – 2024</span>
            <span className="separator" />
            <span className="institution">The Camford International School</span>
          </div>
          <div className="timeline-item">
            <span className="year">2024 – 2027</span>
            <span className="separator" />
            <span className="institution">PSG College of Technology</span>
          </div>
        </div>
      </article>
      <article className="skills-column">
        <span className="film-label">CAPABILITIES</span>
        <p className="repo-note">{stats.publicRepos} public repositories / {stats.contributionsEstimate} contribution estimate</p>
        {skills.map((skill, index) => (
          <div className="skill-row" key={skill.name} style={{ '--delay': `${index * 90}ms`, '--level': `${skill.level}%` }}>
            <span>{skill.name}</span>
            <i>{'█'.repeat(skill.blocks)}{'░'.repeat(14 - skill.blocks)}</i>
            <strong>{skill.level}</strong>
          </div>
        ))}
      </article>
    </section>
  )
}
