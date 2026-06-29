import React from 'react'
import MagneticButton from './MagneticButton.jsx'

export default function ProjectCard({ project }) {
  return (
    <article className="project-detail" style={{ '--accent': project.accent }}>
      <div className="project-visual" style={project.image ? { backgroundImage: `url(${project.image})` } : {}}>
        {project.image ? (
          <>
            <span>{project.category}</span>
            <strong>{project.number}</strong>
          </>
        ) : (
          <>
            <span className="project-name-label">{project.title}</span>
            <span className="image-placeholder-tag">IMAGE PLACEHOLDER</span>
          </>
        )}
      </div>
      <div className="project-overlay">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="tag-row">
          {project.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <div className="project-links">
          <MagneticButton as="a" href={project.githubUrl} target="_blank" rel="noreferrer">VIEW CODE</MagneticButton>
          {project.liveUrl ? (
            <MagneticButton as="a" href={project.liveUrl} target="_blank" rel="noreferrer">LIVE DEMO</MagneticButton>
          ) : (
            <span>{project.status}</span>
          )}
        </div>
      </div>
    </article>
  )
}
