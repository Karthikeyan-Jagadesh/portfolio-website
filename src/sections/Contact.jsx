import React, { useState } from 'react'
import emailjs from 'emailjs-com'
import MagneticButton from '../components/MagneticButton.jsx'
import ShaderBackground from '../components/ShaderBackground.jsx'

export default function Contact() {
  const [status, setStatus] = useState('idle')
  const [copied, setCopied] = useState(false)

  async function submit(event) {
    event.preventDefault()
    setStatus('sending')
    const form = event.currentTarget
    try {
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID
      if (!serviceId || serviceId === 'your_service_id') {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      } else {
        await emailjs.sendForm(
          serviceId,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          form,
          import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
        )
      }
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  function copyEmail() {
    navigator.clipboard?.writeText('karthikeyan.jagadesh@example.com')
    setCopied(true)
    setTimeout(() => setCopied(false), 1400)
  }

  return (
    <ShaderBackground className={`scene contact-scene contact-section ${status}`}>
      <div className="contact-copy">
        <span className="ghost-talk">LET'S</span>
        <h2>TALK.</h2>
        <p>Available for internships, collaborations, and projects that matter.</p>
        <div className="contact-links">
          <a href="https://github.com/Karthikeyan-Jagadesh" target="_blank" rel="noreferrer">GITHUB -> <span>github.com/Karthikeyan-Jagadesh</span></a>
          <a href="https://linkedin.com/in/karthikeyan-jagadesh" target="_blank" rel="noreferrer">LINKEDIN -> <span>linkedin.com/in/karthikeyan-jagadesh</span></a>
          <button type="button" onClick={copyEmail}>EMAIL -> <span>{copied ? 'COPIED' : 'karthikeyan.jagadesh@example.com [ COPY ]'}</span></button>
        </div>
      </div>
      <form className="contact-form magnetic" onSubmit={submit}>
        <span className="film-label">SEND A MESSAGE</span>
        {status === 'success' ? (
          <strong className="received">MESSAGE RECEIVED</strong>
        ) : (
          <>
            <label>NAME<input name="name" required /></label>
            <label>EMAIL<input name="email" type="email" required /></label>
            <label>MESSAGE<textarea name="message" rows="5" required /></label>
            <MagneticButton className="send-button" type="submit" disabled={status === 'sending'}>
              {status === 'sending' ? 'SENDING...' : status === 'error' ? 'FAILED - TRY AGAIN' : 'SEND MESSAGE'}
            </MagneticButton>
          </>
        )}
      </form>
    </ShaderBackground>
  )
}
