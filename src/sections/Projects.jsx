import React, { useState } from 'react'
import ProjectCard from '../components/ProjectCard.jsx'
import { projects } from '../data/projects.js'

export default function Projects() {
  const [active, setActive] = useState(0)
  const project = projects[active]

  return (
    <section className="scene projects-scene">
      <div className="layer layer-back section-number drift">03</div>
      <aside className="project-list">
        <span className="film-label">MISSION ARCHIVE</span>
        {projects.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={active === index ? 'active' : ''}
            onMouseEnter={() => setActive(index)}
            onClick={() => setActive(index)}
          >
            <span>{item.number}</span>
            <strong>{item.title}</strong>
            {active === index && <small>{item.tags.join(' / ')}</small>}
          </button>
        ))}
      </aside>
      <div className="project-stage">
        <ProjectCard project={project} />
      </div>
    </section>
  )
}
