// src/components/three/Particles.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * Particles component for background animation
 * Creates floating particles with a glowing effect that remains fixed during scrolling
 */
const Particles = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const requestRef = useRef<number | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup - use perspective camera for particles
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup with transparent background to overlay on gradient
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    renderer.setClearColor(0x000000, 0); // Transparent background
    
    // Add renderer to DOM with fixed positioning
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;
    
    // Set canvas style for fixed positioning
    renderer.domElement.style.position = 'fixed';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    renderer.domElement.style.width = '100vw';
    renderer.domElement.style.height = '100vh';
    renderer.domElement.style.zIndex = '-5'; // Above background but below content
    renderer.domElement.style.pointerEvents = 'none';
    
    // Create particles with optimized count based on screen size
    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = Math.min(
      150, 
      Math.max(50, Math.floor(window.innerWidth * window.innerHeight / 10000))
    );
    
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);
    
    // Color palette matching the theme
    const colorPalette = [
      new THREE.Color(0x00f5d4), // Teal
      new THREE.Color(0x0077b6), // Blue
      new THREE.Color(0x90e0ef), // Light blue
    ];
    
    for (let i = 0; i < particleCount; i++) {
      // Position particles throughout the scene
      positions[i * 3] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
      
      // Assign random color from palette
      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;
      
      // Random scale for each particle
      sizes[i] = Math.random() * 0.5 + 0.5;
      
      // Random speed for more natural movement
      speeds[i] = Math.random() * 0.2 + 0.1;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    particlesGeometry.setAttribute('speed', new THREE.BufferAttribute(speeds, 1));
    
    // Create custom shader material for better looking particles
    const particlesMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        pixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        attribute float size;
        attribute float speed;
        uniform float time;
        uniform float pixelRatio;
        varying vec3 vColor;
        
        void main() {
          vColor = color;
          
          // Animated position - gentle floating motion
          vec3 pos = position;
          
          // Different movement patterns based on particle position
          float yMovement = sin(time * speed + position.x) * 0.3;
          float xMovement = cos(time * speed * 0.8 + position.y) * 0.2;
          
          // Apply movements
          pos.y += yMovement;
          pos.x += xMovement;
          
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          
          // Size calculation - bigger when closer to camera
          gl_PointSize = size * 15.0 * (1.0 / -mvPosition.z) * pixelRatio;
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create soft, circular particles
          float distance = length(gl_PointCoord - vec2(0.5));
          if (distance > 0.5) discard;
          
          // Soft edge glow effect
          float alpha = smoothstep(0.5, 0.2, distance);
          
          gl_FragColor = vec4(vColor, alpha * 0.7); // Slightly transparent
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      vertexColors: true
    });
    
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
    
    // Animation loop with optimized performance
    const clock = new THREE.Clock();
    
    const animate = () => {
      const elapsedTime = clock.getElapsedTime();
      
      // Update time uniform for shader
      particlesMaterial.uniforms.time.value = elapsedTime;
      
      // Slowly rotate particles for additional effect
      particles.rotation.y = elapsedTime * 0.02;
      particles.rotation.z = elapsedTime * 0.01;
      
      // Render scene
      renderer.render(scene, camera);
      
      // Request next frame
      requestRef.current = requestAnimationFrame(animate);
    };
    
    // Start animation
    animate();
    
    // Handle window resize
    const handleResize = () => {
      // Update camera
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      
      // Update renderer
      if (rendererRef.current) {
        rendererRef.current.setSize(window.innerWidth, window.innerHeight);
        rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      }
      
      // Update pixel ratio uniform
      particlesMaterial.uniforms.pixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    
    // Cleanup function
    return () => {
      // Stop animation
      if (requestRef.current !== null) {
        cancelAnimationFrame(requestRef.current);
      }
      
      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      
      // Clean up DOM and Three.js resources
      if (containerRef.current && rendererRef.current) {
        containerRef.current.removeChild(rendererRef.current.domElement);
      }
      
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      if (rendererRef.current) {
        rendererRef.current.dispose();
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
        overflow: 'hidden',
        zIndex: -5,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  );
};

export default Particles;