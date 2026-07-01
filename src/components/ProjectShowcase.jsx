import React, { useState } from 'react'

export default function ProjectShowcase({ projects }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const currentProject = projects[activeIndex]

  if (!projects || projects.length === 0) return null

  return (
    <div className="project-binder">
      {/* Left side tabs: Index */}
      <div className="binder-index">
        {projects.map((project, idx) => (
          <button
            key={project.id}
            type="button"
            className={`binder-tab ${idx === activeIndex ? 'active' : ''}`}
            onClick={() => setActiveIndex(idx)}
          >
            <span>{project.id}</span>
            {project.title}
          </button>
        ))}
      </div>

      {/* Right side page: Project details */}
      <div className="project-page sketch-card">
        <div className="tape-effect tape-tl" />
        <div className="tape-effect tape-tr" />
        
        {/* Status Stamp */}
        <div className={`project-status-stamp ${currentProject.status === 'ACTIVE' ? 'active-stamp' : 'archived-stamp'}`}>
          {currentProject.status}
        </div>

        {/* Project Cover Image */}
        <div className="project-page-image-container">
          <img
            src={currentProject.image}
            alt={currentProject.title}
            className="project-sketch-img"
          />
        </div>

        {/* Project Copy Details */}
        <div className="project-page-info">
          <h4>{currentProject.subtitle}</h4>
          <h3>{currentProject.title}</h3>
          
          <div className="hand-drawn-rule" style={{ height: '6px', margin: '8px 0' }}>
            <svg viewBox="0 0 100 10" preserveAspectRatio="none">
              <path d="M0,5 Q30,3 60,7 T100,5" />
            </svg>
          </div>

          <p>{currentProject.description}</p>
          
          {/* Tech badge flags */}
          <div className="project-tech-badges">
            {currentProject.tech.map((tag) => (
              <span key={tag} className="project-tech-badge">
                {tag}
              </span>
            ))}
          </div>

          {/* Sketchy actions */}
          <div className="project-page-actions">
            {currentProject.github && (
              <a
                href={currentProject.github}
                target="_blank"
                rel="noreferrer"
                className="magnetic-button"
                style={{ fontSize: '0.85rem', padding: '8px 16px' }}
              >
                Code base
              </a>
            )}
            {currentProject.live && (
              <a
                href={currentProject.live}
                target="_blank"
                rel="noreferrer"
                className="magnetic-button secondary"
                style={{ fontSize: '0.85rem', padding: '8px 16px' }}
              >
                Live demo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
