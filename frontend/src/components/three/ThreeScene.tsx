// @ts-nocheck
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import WaveSphere from './WaveSphere'
import Particles from './Particles'

const ThreeScene = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-10 bg-gray-950">
      <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
        <ambientLight intensity={0.2} />
        <WaveSphere />
        <Particles count={300} />
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  )
}

export default ThreeScene