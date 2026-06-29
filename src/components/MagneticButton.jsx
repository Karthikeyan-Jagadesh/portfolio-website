import React from 'react'
import { useMagneticEffect } from '../hooks/useMagneticEffect.js'

export default function MagneticButton({ as: Component = 'button', className = '', children, ...props }) {
  const ref = useMagneticEffect()
  return (
    <Component ref={ref} className={`magnetic magnetic-button ${className}`} {...props}>
      {children}
    </Component>
  )
}
