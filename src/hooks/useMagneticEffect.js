import { useEffect, useRef } from 'react'

export function useMagneticEffect(strength = 0.2, range = 80) {
  const ref = useRef(null)

  useEffect(() => {
    const node = ref.current
    if (!node || window.matchMedia('(pointer: coarse)').matches) return undefined

    const move = (event) => {
      const rect = node.getBoundingClientRect()
      const x = event.clientX - (rect.left + rect.width / 2)
      const y = event.clientY - (rect.top + rect.height / 2)
      const distance = Math.hypot(x, y)
      if (distance < range) node.style.transform = `translate(${x * strength}px, ${y * strength}px)`
      else node.style.transform = 'translate(0, 0)'
    }

    const reset = () => {
      node.style.transform = 'translate(0, 0)'
    }

    window.addEventListener('mousemove', move)
    node.addEventListener('mouseleave', reset)
    return () => {
      window.removeEventListener('mousemove', move)
      node.removeEventListener('mouseleave', reset)
    }
  }, [range, strength])

  return ref
}
