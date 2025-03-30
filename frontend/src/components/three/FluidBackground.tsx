import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const FluidBackground: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 5;
    
    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    containerRef.current.appendChild(renderer.domElement);
    
    // Create gradient background using mesh and texture
    const backgroundGeometry = new THREE.PlaneGeometry(20, 20);
    
    // Create canvas for gradient
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 1024;
    canvas.height = 1024;
    
    if (context) {
      // Create gradient texture
      const backgroundTexture = new THREE.CanvasTexture(canvas);
      const backgroundMaterial = new THREE.MeshBasicMaterial({
        map: backgroundTexture,
        transparent: true,
      });
      
      const backgroundMesh = new THREE.Mesh(backgroundGeometry, backgroundMaterial);
      scene.add(backgroundMesh);
      
      // Create particles
      const particlesGeometry = new THREE.BufferGeometry();
      const particleCount = 150;
      
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);
      const sizes = new Float32Array(particleCount);
      
      // Color palette
      const colorPalette = [
        new THREE.Color('#00f5d4'),  // Teal
        new THREE.Color('#0077b6'),  // Blue
        new THREE.Color('#00b4d8'),  // Light blue
        new THREE.Color('#90e0ef'),  // Very light blue
      ];
      
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 15;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 5;
        
        // Random color from palette
        const color = colorPalette[Math.floor(Math.random() * colorPalette.length)];
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
        
        sizes[i] = Math.random() * 0.5 + 0.1;
      }
      
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      particlesGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
      
      const particleTexture = new THREE.TextureLoader().load(
        'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAF92lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNi4wLWMwMDIgNzkuMTY0MzYwLCAyMDIwLzAyLzEzLTAxOjA3OjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoTWFjaW50b3NoKSIgeG1wOkNyZWF0ZURhdGU9IjIwMjMtMDctMDFUMTI6MjA6NDcrMDg6MDAiIHhtcDpNb2RpZnlEYXRlPSIyMDIzLTA3LTAxVDEyOjIxOjM5KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTA3LTAxVDEyOjIxOjM5KzA4OjAwIiBkYzpmb3JtYXQ9ImltYWdlL3BuZyIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMyIgcGhvdG9zaG9wOklDQ1Byb2ZpbGU9InNSR0IgSUVDNjE5NjYtMi4xIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjQzMDIxZmVhLTg1ZTEtNGM5Yi1iOTcyLTJkZDkzN2MyOGZkYSIgeG1wTU06RG9jdW1lbnRJRD0iYWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOmE1MjQ5NGY3LWQxNmQtNDc0Zi1hYjAwLWU5ZjY2YTNhNDk2ZiIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjAwYWVlMzVlLTA2MmQtNGNmZC1hNmU5LWM4OGZkMDIyY2QwMCI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MDBhZWUzNWUtMDYyZC00Y2ZkLWE2ZTktYzg4ZmQwMjJjZDAyIiBzdEV2dDp3aGVuPSIyMDIzLTA3LTAxVDEyOjIwOjQ3KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoTWFjaW50b3NoKSIvPiA8cmRmOmxpIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6NDMwMjFmZWEtODVlMS00YzliLWI5NzItMmRkOTM3YzI4ZmRhIiBzdEV2dDp3aGVuPSIyMDIzLTA3LTAxVDEyOjIxOjM5KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoTWFjaW50b3NoKSIgc3RFdnQ6Y2hhbmdlZD0iLyIvPiA8L3JkZjpTZXE+IDwveG1wTU06SGlzdG9yeT4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz61F3RdAAAH90lEQVRYhX2XS2xc1RnHf9/33Llz5+Z6PGM7fuYRAoGENqFRIQQJZNGKooqigqqIsmFFQaAKwYYVXbCgUkG7qNoNFGiDVJBQ1SI5RFXVJlGABFI7jxJSW0lsx3bGM+O538c5X/fO2B47zZEczfXMnPN//+/7P//vE9Za1qxEAo9Svkwxk8YPA/phj+5Ch+nS9D3v/uCDSZmc/MnU9Kxsb29JpdIcjDPxpVLCr1Z3Jy3r3k8mxTfO7d+PjeNA3qxifzIMc2a2PKNgVBBkIIi7iYwSI6OEKEiM9Qli6AQBrTAi0uYLJ+zD21/Y+c5ZoHzNgLUYiKKATrPNcnkRP2U5jyQCQaDI5HKIKHa2FygV8qhQs1jr43kelUqNRr2FJMDJk7WWOI7Rykdr76I9YcJOvHZi39Q3AdqnTp1az5lSCi/jURwvsaPvsxv4eQ2oTy5AZyFDXLnCxrKkXJmhNL2DTKHA3Ow5lpdLJImLRSnF8vIyl2fPsbHcppTbTmn+PPMD+NLNiX/2OZF/9RNuW4F3Vg6KAK21RGQPsHvlfTpdpFxp0ukPULKG8TnGpvC8Ar7fZmF+gdZgQKI1KRHicpnZwhizsytxYDBaYwYDSpUa/U5ArLKgLZQr3xt8c9P3nw9HqN9/6Kli3PzL1Vwpg8pEkTqotL7qSrBuA0ulyqDTIkksOu3Rbc+xWDlHY6lCnKTAKCSSNaSL43heyt1a0m+3qNbm6Pd6RHGCVhZPqxun94UHgU/HRkYw/fbbk5Kcf7vgSz63Ot2IQgglEJ9huUas5zFYnqdRP8/y0jzD0Kfdn6e8eIZ+XwMpPGXR2pLEEbEJERRN32eh3qDbj+knhm43plLxmG8kD1z827XcO8DOH8jHq0QTCSYCpZXbENyVKEkzPzdPZfE8SilQFqMjKvWLdLuLRPEYWgW4nSVGa9JpjzgJ6fcaLC7Os9xoEIYJ1g5BtEaXF69tz9pzHXDB1YLHUEnsdHZkYbAxQW+pRr+7BCJovNEEOk6oVubodxeJDYRhhBKFp8DzNEYHdJsLLJcrdDtdJAGjFK0wZv58smcX/DZwygE+BBb++sGmRi8+cC8KJR5aGYxVJMYSakMYxtjQYA1YI26XYRgTBDFJYgmj2LXJirAaxwkhIYSJ0zURCaIjdmxO+fD6rStF+PLqHB/dX5ucmHjoqe3SLGy/Gct0EjIMYoIwAQlQyYYV3+0IRUIQJQw1OMNXx2WEoaIbWEqzZbNzd/HQ/W8uX3KAd4CxH2/pvvb9hycpje3GWKhoDVgSYwgtGGPRyQbAyGlNkoCx4lpoCYNrOxMSSzew/PyDOa781QPPLfz95I988D3g8M5t+c/u+Foj8DwnMbdIGBu0GQkxAiMojBFMYr7U0Sj+vR/JaGTXiAhhuHqfYA8fennyTG3iJQ8YB35z4pdbXj+wtc1kaTPG2FETEUxkUYmgJcHKGpXKSnYWYqwLN4yRUTxEyGrL4cP1e/bse+UZYPbUqVMMw/CZ8uE/fDw7l9B0olC6hhIDMQQWwkiIkhX48Zq8G6OJAEMXITPXVz02PO6+dXXd6q9gEKZeHyul3ju8f+LZb+1p8dLJJhPjObYWsoxnPXxPkfYUGV+R8RXptCLnK6YmM9y2Oc/WjVm2bcyxZSrHxiLs2D3Glt2ZF/ceiU6vA7yS7Hd80vvbYHHj4/emCs/dt7dGYXyKMMrQH0KvZ+jHEBqJ8oA2aKOITZrIeESJRxj7DMMcvV6OXpNVyqfJZ9pHpyfV4RH3Gt9vxIEFCzYKzO/gufG03TRlx8uqp/d8o3PnpvEhU9M5jt42wZbJDDdvKbKlmGU8r7ltS4Ed04V1z2y5KcfGfPnprcX68xPj6nfzA/u3CfFPx8fHYx3H8Xpb0FqL53lURJo57eV/tXP4dM76Z0XVK+PpeLYvpvGXdT6vUFHEkGHlIKP//GiWuXrIpmKezcUCtbbmYi3in+Ub98dBvOd7+zZ84Ps+5XIZpRRLS0vEcUwQBAzDcP0s2LJly7ozcM+ePcxELzG9L8Xjh25i08Ys3X5EJ4gptj1UqURxT5HlKwuUa8tMbJugNJah345ptAxa+9x7eJr3PrneAVYcXHvkXkd5WkJODQ4qDo8XGIaWZjOieqXL2GiS9RoD6qUrnN9UJowMlXofjMfB2zdz/lJ9fXzXmOOqguK0Vhw9bCjuUMTdkDCERsOw3OyTK+bJFnMMuhGVuQ5zF+uUa0M+nrlIrVHH89Js3FKgN+iTJCnO/jO+ftyueuC9z9NCLJ/4XoGbDyQoT4gCeE/bvhZlsrVWhzhIWLg4QKXTFMcyNIKEXL5Arp1mcaFE46MBnYsPcvlCmmj+ELvVl3Mjvr4QdJYaWn/0RsT1+7IYDU1frRbHEPBdM9JYG+NpxfSuLGM3w/ypOnYwRjLIONdY4Hxj6NLp6xXLrnmePTdPYfv3DL0uV5a6vq1Wh15aI9mLgkYMBmitSTDkvDQzZ+eozdaYP93nynwHXxfQytLt9OgFAxBBG8NiucKW7aNmrHJ+XQDx0ceeP2SDv4jUOH/Brl+i33aDqBBGD8kpjrz8o4QllqbJk56YJr0nzXA4IAw0vU6fdhBgPQilRzH/IOe2nuJbL+qXVhvWOlv69UPh0z8/0n3o3vGTj+1P6HUCwsiARdDX2O2oHiOORomJDWEQEkXRqJ4IaU+T8j22Tt/Mka88hf0MwS9XPa/p67CvOxs8+8Av6ifv2dnD6oAwgDAEY0kSgzURcezcCdBaMS7CeC7LWG47Rx8+AuSANnBu5f0aceTxp58YXu7uefCd6r4fbssQJ8KwO0QpRZJYgsjQH4T0ByGWFmNjk0wf3s3YeGFl1X8Bu7LULxngv4dRR7FN/I0DAAAAAElFTkSuQmCC'
      );
      
      const particlesMaterial = new THREE.PointsMaterial({
        size: 0.5,
        map: particleTexture,
        transparent: true,
        vertexColors: true,
        alphaTest: 0.01,
        depthWrite: false,
        blending: THREE.AdditiveBlending
      });
      
      const particlesPoints = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesPoints);
      
      // Animation loop
      const clock = new THREE.Clock();
      
      const animate = () => {
        const elapsedTime = clock.getElapsedTime();
        
        // Update background gradient
        if (context) {
          const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
          
          // Animate gradient colors
          const time = elapsedTime * 0.15;
          const t = (Math.sin(time) + 1) / 2; // 0 to 1 oscillation
          
          // Color stops for gradient
          gradient.addColorStop(0, `rgb(15, 23, 42)`); // Dark blue
          gradient.addColorStop(t, `rgb(22, 78, 99)`); // Teal/blue
          gradient.addColorStop(1 - t, `rgb(19, 78, 74)`); // Dark teal
          gradient.addColorStop(1, `rgb(15, 23, 42)`); // Dark blue
          
          context.fillStyle = gradient;
          context.fillRect(0, 0, canvas.width, canvas.height);
          
          // Update texture
          backgroundTexture.needsUpdate = true;
        }
        
        // Animate particles
        const positionAttribute = particlesGeometry.getAttribute('position') as THREE.BufferAttribute;
        const positionsArray = positionAttribute.array as Float32Array;
        
        for (let i = 0; i < particleCount; i++) {
          const i3 = i * 3;
          
          // Move particles up slowly
          positionsArray[i3 + 1] += 0.01;
          
          // Reset particles when they move too far up
          if (positionsArray[i3 + 1] > 10) {
            positionsArray[i3 + 1] = -10;
            positionsArray[i3] = (Math.random() - 0.5) * 15;
          }
          
          // Add some wave motion
          positionsArray[i3] += Math.sin(elapsedTime * 0.2 + i * 0.1) * 0.01;
        }
        
        positionAttribute.needsUpdate = true;
        
        // Rotate particles slightly
        particlesPoints.rotation.y = elapsedTime * 0.02;
        particlesPoints.rotation.z = elapsedTime * 0.01;
        
        // Render
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      
      animate();
    }
    
    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      
      // Dispose resources
      scene.children.forEach(child => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          if (child.material instanceof THREE.Material) {
            child.material.dispose();
          } else if (Array.isArray(child.material)) {
            child.material.forEach(material => material.dispose());
          }
        } else if (child instanceof THREE.Points) {
          child.geometry.dispose();
          child.material.dispose();
        }
      });
      
      renderer.dispose();
    };
  }, []);
  
  return (
    <div 
      ref={containerRef} 
      className="fixed top-0 left-0 w-full h-full -z-10"
      style={{ backgroundColor: '#0f172a' }} // Fallback color
    />
  );
};

export default FluidBackground;