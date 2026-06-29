import React from 'react'

export default function AurumBackground({ activeSection }) {
  return (
    <div className={`aurum-background section-${activeSection}`} aria-hidden="true">
      <div className="grid-lines" />
      <div className="gold-blob blob-one" />
      <div className="gold-blob blob-two" />
      <div className="gold-blob blob-three" />
      <div className="grain" />
    </div>
  )
}
