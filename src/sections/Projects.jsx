import React from 'react'
import ProjectShowcase from '../components/ProjectShowcase.jsx'
import { projects } from '../data/projects.js'

export default function Projects() {
  const mappedProjects = projects.map((item) => ({
    id: item.number,
    title: item.title,
    subtitle: item.category,
    description: item.description,
    tech: item.tags,
    image: item.image,
    github: item.githubUrl,
    live: item.liveUrl,
    status: item.status
  }))

  return (
    <section className="scene projects-scene" style={{ display: 'block' }}>
      <div className="layer layer-back section-number drift">03</div>
      <ProjectShowcase projects={mappedProjects} />
    </section>
  )
}
