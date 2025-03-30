// src/components/three/AnimatedBackground.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Type for the sphere objects
type SphereObject = {
  mesh: THREE.Mesh;
  speed: number;
  rotationSpeed: THREE.Vector3;
};

const AnimatedBackground = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;
    
    // Renderer setup with better configuration
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    
    // For newer Three.js versions, use this instead:
    // renderer.outputColorSpace = THREE.SRGBColorSpace;
    // For older versions, we'll skip this line or use an alternative
    
    containerRef.current.appendChild(renderer.domElement);
    
    // Create animated gradient with more sophisticated movement
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        mousePos: { value: new THREE.Vector2(0.5, 0.5) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform vec2 resolution;
        uniform vec2 mousePos;
        varying vec2 vUv;
        
        // Noise functions for more organic patterns
        float hash(vec2 p) {
          p = 50.0 * fract(p * 0.3183099 + vec2(0.71, 0.113));
          return -1.0 + 2.0 * fract(p.x * p.y * (p.x + p.y));
        }
        
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0, 0.0)), 
                         hash(i + vec2(1.0, 0.0)), u.x),
                     mix(hash(i + vec2(0.0, 1.0)), 
                         hash(i + vec2(1.0, 1.0)), u.x), u.y);
        }
        
        // More complex fBM (fractal Brownian Motion)
        float fbm(vec2 p) {
          float f = 0.0;
          float amplitude = 0.5;
          for (int i = 0; i < 4; i++) {
            f += amplitude * noise(p);
            p *= 2.03;
            amplitude *= 0.5;
          }
          return f;
        }
        
        void main() {
          // Darker color palette
          vec3 color1 = vec3(0.02, 0.10, 0.12);    // Dark teal
          vec3 color2 = vec3(0.01, 0.25, 0.27);     // Medium dark teal
          vec3 color3 = vec3(0.00, 0.35, 0.30);     // Dark turquoise
          
          // Normalized pixel coordinates
          vec2 uv = vUv;
          
          // Add mouse interaction (subtle pull effect)
          vec2 mouseOffset = (mousePos - 0.5) * 0.1;
          uv += mouseOffset;
          
          // Create complex wave patterns using fbm
          float wave1 = fbm(uv * 2.0 + time * 0.2) * 0.05;
          float wave2 = fbm(uv * 3.0 - time * 0.3) * 0.03;
          float wave3 = fbm(uv * 5.0 + vec2(time * 0.1, time * 0.15)) * 0.02;
          
          float totalWave = (wave1 + wave2 + wave3) * 0.7;
          
          // Adjust vertical position with waves
          float y = uv.y + totalWave;
          
          // Smooth color mixing with easing
          float mixFactor = smoothstep(0.0, 1.0, y);
          vec3 color;
          
          if (y < 0.5) {
            color = mix(color1, color2, smoothstep(0.0, 0.5, y));
          } else {
            color = mix(color2, color3, smoothstep(0.5, 1.0, y));
          }
          
          // Add subtle vignette effect
          vec2 center = uv - 0.5;
          float vignette = 1.0 - dot(center, center) * 0.5;
          color *= vignette;
          
          // Add very subtle grain for texture
          float grain = fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453) * 0.02;
          color += grain;
          
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
    
    const plane = new THREE.Mesh(geometry, material);
    scene.add(plane);
    
    // Add floating particles
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 100;
    const posArray = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 2.0;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particleMaterial = new THREE.PointsMaterial({
      size: 0.02,
      transparent: true,
      opacity: 0.8,
      color: 0x88ffff,
      blending: THREE.AdditiveBlending
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    
    // Add floating organic shapes (spheres with subtle distortion)
    const sphereGeometry = new THREE.SphereGeometry(0.1, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x04919B,
      transparent: true,
      opacity: 0.15,
      wireframe: true
    });
    
    const spheres: SphereObject[] = [];
    for (let i = 0; i < 5; i++) {
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        -Math.random()
      );
      sphere.scale.setScalar(0.5 + Math.random() * 0.5);
      spheres.push({
        mesh: sphere,
        speed: 0.1 + Math.random() * 0.1,
        rotationSpeed: new THREE.Vector3(
          Math.random() * 0.01,
          Math.random() * 0.01,
          Math.random() * 0.01
        )
      });
      scene.add(sphere);
    }
    
    // Mouse movement tracking
    const handleMouseMove = (event: MouseEvent) => {
      material.uniforms.mousePos.value.set(
        event.clientX / window.innerWidth,
        1.0 - (event.clientY / window.innerHeight)
      );
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Animation
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Update shader time
      material.uniforms.time.value = elapsedTime;
      
      // Animate particles
      particles.rotation.y = elapsedTime * 0.05;
      
      // Animate spheres
      spheres.forEach((sphere, index) => {
        sphere.mesh.position.y = Math.sin(elapsedTime * sphere.speed + index) * 0.2;
        sphere.mesh.rotation.x += sphere.rotationSpeed.x;
        sphere.mesh.rotation.y += sphere.rotationSpeed.y;
      });
      
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    
    animate();
    
    // Handle resize
    const handleResize = () => {
      // For OrthographicCamera, we need to update the projection matrix differently
      const aspect = window.innerWidth / window.innerHeight;
      camera.left = -aspect;
      camera.right = aspect;
      camera.top = 1;
      camera.bottom = -1;
      camera.updateProjectionMatrix();
      
      renderer.setSize(window.innerWidth, window.innerHeight);
      material.uniforms.resolution.value.set(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      if (containerRef.current?.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div 
      ref={containerRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: -10,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #021215 0%, #03272B 50%, #023A35 100%)', // Darker fallback
      }}
    />
  );
};

export default AnimatedBackground;