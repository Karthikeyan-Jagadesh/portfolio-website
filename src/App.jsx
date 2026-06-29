import React, { useState } from 'react'
import AurumBackground from './components/AurumBackground.jsx'
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

  return (
    <div className="aurum-app">
      <AurumBackground activeSection={activeSection} />
      <MagneticCursor />
      <Navbar activeSection={activeSection} total={sections.length} onJump={(index) => navigator?.jumpTo(index)} />
      <HorizontalScroll sections={sections} onSectionChange={setActiveSection} onReady={setNavigator} />
    </div>
  )
}
