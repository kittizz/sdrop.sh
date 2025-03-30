// @ts-nocheck
import React, { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { MathUtils } from 'three'
import * as THREE from 'three'

// โค้ดที่เหลือของคุณยังคงเหมือนเดิม...

const WaveSphere = () => {
  const meshRef = useRef<THREE.Mesh>(null!)
  const materialRef = useRef<THREE.ShaderMaterial>(null!)

  // สร้าง Shader เพื่อสร้างเอฟเฟกต์คลื่นแบบนีออน
  const shaderData = useMemo(
    () => ({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color('#00f5d4') }, // สีเทอร์ควอยซ์แบบนีออน
        color2: { value: new THREE.Color('#0077b6') }  // สีน้ำเงินเข้ม
      },
      vertexShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          // สร้างเอฟเฟกต์คลื่นเคลื่อนไหว
          float wave = sin(position.x * 5.0 + time) * cos(position.y * 5.0 + time) * 0.1;
          vec3 newPosition = position + normal * wave;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        varying vec3 vPosition;
        uniform float time;
        uniform vec3 color1;
        uniform vec3 color2;
        
        void main() {
          // สร้างเอฟเฟกต์เรืองแสงและไล่สี
          float intensity = 1.0 - dot(normalize(vPosition), vec3(0.0, 0.0, 1.0));
          intensity = pow(intensity, 2.0);
          
          // เพิ่มลักษณะคลื่นเคลื่อนไหว
          float wave = sin(vUv.x * 20.0 + time) * sin(vUv.y * 20.0 + time) * 0.5;
          intensity += wave * 0.1;
          
          // ผสมสีระหว่างสองสี
          vec3 color = mix(color1, color2, intensity);
          
          gl_FragColor = vec4(color, intensity * 0.8); // ใส่ค่า alpha เพื่อให้มีความโปร่งใส
        }
      `
    }),
    []
  )

  // อัพเดต Uniform ทุกเฟรม
  useFrame((state: RootState) => {
    const time = state.clock.getElapsedTime()
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = time * 0.5
    }
    
    // หมุนวัตถุช้าๆ
    if (meshRef.current) {
      meshRef.current.rotation.x = MathUtils.lerp(meshRef.current.rotation.x, Math.sin(time / 4) * 0.5, 0.05)
      meshRef.current.rotation.y = MathUtils.lerp(meshRef.current.rotation.y, Math.sin(time / 3) * 0.5, 0.05)
    }
  })

  return (
    <mesh ref={meshRef} scale={2.5}>
      <sphereGeometry args={[1, 64, 64]} />
      <shaderMaterial 
        ref={materialRef} 
        uniforms={shaderData.uniforms} 
        vertexShader={shaderData.vertexShader} 
        fragmentShader={shaderData.fragmentShader} 
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default WaveSphere