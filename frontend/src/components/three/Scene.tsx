// src/components/three/Scene.tsx
import React from 'react'
import dynamic from 'next/dynamic'

// Import AnimatedBackground with dynamic loading
const AnimatedBackground = dynamic(() => import('./AnimatedBackground'), { 
  ssr: false,
  loading: () => (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        backgroundColor: '#09313B',
        backgroundImage: 'linear-gradient(180deg, #09313B 0%, #04919B 50%, #02CDB0 100%)',
      }}
    />
  )
})

const Scene = () => {
  return <AnimatedBackground />
}

export default Scene