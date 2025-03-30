import React from 'react'
import dynamic from 'next/dynamic'

// โหลด Three.js เฉพาะฝั่ง client
const SceneClient = dynamic(() => import('./Scene.client'), { 
  ssr: false,
  loading: () => <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gray-950"></div>
})

const Background = () => {
  return <SceneClient />
}

export default Background