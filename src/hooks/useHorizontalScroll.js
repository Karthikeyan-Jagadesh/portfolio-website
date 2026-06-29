import { useCallback, useEffect, useRef, useState } from 'react'
import { lerp } from '../utils/lerp.js'
import { nearestSection } from './useSectionSnap.js'

export function useHorizontalScroll(total, onSectionChange) {
  const trackRef = useRef(null)
  const currentX = useRef(0)
  const targetX = useRef(0)
  const frame = useRef(null)
  const snapTimer = useRef(null)
  const [active, setActive] = useState(0)
  const [seamFlash, setSeamFlash] = useState(false)

  const isMobile = () => window.matchMedia('(max-width: 768px)').matches
  const maxX = () => -(window.innerWidth * (total - 1))

  const setSection = useCallback((index) => {
    const bounded = Math.max(0, Math.min(total - 1, index))
    targetX.current = -(window.innerWidth * bounded)
    setActive((previous) => {
      if (previous !== bounded) {
        setSeamFlash(true)
        setTimeout(() => setSeamFlash(false), 220)
        onSectionChange?.(bounded)
      }
      return bounded
    })
  }, [onSectionChange, total])

  const jumpTo = useCallback((index) => setSection(index), [setSection])
  const backToStart = useCallback(() => {
    targetX.current = 0
    setSection(0)
  }, [setSection])

  useEffect(() => {
    onSectionChange?.(0)
  }, [onSectionChange])

  useEffect(() => {
    const animate = () => {
      if (!isMobile() && trackRef.current) {
        currentX.current = lerp(currentX.current, targetX.current, 0.08)
        trackRef.current.style.transform = `translate3d(${currentX.current}px, 0, 0)`
        const next = nearestSection(targetX.current, window.innerWidth, total)
        setActive((previous) => {
          if (previous !== next) {
            onSectionChange?.(next)
            setSeamFlash(true)
            setTimeout(() => setSeamFlash(false), 220)
          }
          return next
        })
      }
      frame.current = requestAnimationFrame(animate)
    }
    frame.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame.current)
  }, [onSectionChange, total])

  useEffect(() => {
    const snap = () => {
      clearTimeout(snapTimer.current)
      snapTimer.current = setTimeout(() => setSection(nearestSection(targetX.current, window.innerWidth, total)), 300)
    }

    const wheel = (event) => {
      if (isMobile()) return
      event.preventDefault()
      targetX.current = Math.max(maxX(), Math.min(0, targetX.current - event.deltaY - event.deltaX))
      snap()
    }

    const key = (event) => {
      if (event.key === 'ArrowRight') setSection(active + 1)
      if (event.key === 'ArrowLeft') setSection(active - 1)
      if (/^[1-5]$/.test(event.key)) setSection(Number(event.key) - 1)
    }

    window.addEventListener('wheel', wheel, { passive: false })
    window.addEventListener('keydown', key)
    return () => {
      window.removeEventListener('wheel', wheel)
      window.removeEventListener('keydown', key)
      clearTimeout(snapTimer.current)
    }
  }, [active, setSection, total])

  return { trackRef, active, seamFlash, progress: active / (total - 1), jumpTo, backToStart }
}
