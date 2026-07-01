import React, { useState, useEffect } from 'react'
import SketchBackground from './components/SketchBackground.jsx'
import HorizontalScroll from './components/HorizontalScroll.jsx'
import MagneticCursor from './components/MagneticCursor.jsx'
import Navbar from './components/Navbar.jsx'
import About from './sections/About.jsx'
import Contact from './sections/Contact.jsx'
import EndFrame from './sections/EndFrame.jsx'
import Entry from './sections/Entry.jsx'
import Projects from './sections/Projects.jsx'

const sections = [
  { id: 'entry', label: 'Entry', component: Entry },
  { id: 'about', label: 'About', component: About },
  { id: 'projects', label: 'Projects', component: Projects },
  { id: 'contact', label: 'Contact', component: Contact },
  { id: 'end', label: 'End', component: EndFrame },
]

export default function App() {
  const [activeSection, setActiveSection] = useState(0)
  const [navigator, setNavigator] = useState(null)
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('sketch-portfolio-theme')
    return saved || 'light'
  })

  useEffect(() => {
    localStorage.setItem('sketch-portfolio-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }

  return (
    <div className={`aurum-app theme-${theme}`}>
      <SketchBackground activeSection={activeSection} theme={theme} />
      <MagneticCursor />
      <Navbar activeSection={activeSection} total={sections.length} onJump={(index) => navigator?.jumpTo(index)} />
      <HorizontalScroll sections={sections} onSectionChange={setActiveSection} onReady={setNavigator} />

      <div className="theme-switch-container">
        <button className="theme-toggle-btn" type="button" onClick={toggleTheme}>
          {theme === 'light' ? (
            <>
              ✏️ <span>Notebook Style</span>
            </>
          ) : (
            <>
              🖍️ <span>Chalkboard Style</span>
            </>
          )}
        </button>
      </div>
    </div>
  )
}
