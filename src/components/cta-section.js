'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FaXTwitter } from 'react-icons/fa6';
import { IoWalletOutline } from 'react-icons/io5';
import { RiArrowRightLine } from 'react-icons/ri';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PortlyCTA = () => {
  const mountRef = useRef(null);

// --- Three.js Background Logic ---
useEffect(() => {
    if (!mountRef.current) return;
  
    // Scene Setup
    const scene = new THREE.Scene();
    // Portly 'Deepest Void'
    scene.background = new THREE.Color('#050505'); 
    scene.fog = new THREE.FogExp2('#050505', 0.002);
  
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 50;
    camera.position.y = 5; // Slightly lower camera for grandeur
  
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);
  
    // --- Advanced Particle System ---
    const particleCount = 2500; // Increased count slightly for density
    const geometry = new THREE.BufferGeometry();
    
    const positions = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);
    const randomness = new Float32Array(particleCount * 3); // For individual drift direction
  
    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      
      // Spread them out more horizontally for a "landscape" feel
      positions[i3] = (Math.random() - 0.5) * 180;
      positions[i3 + 1] = (Math.random() - 0.5) * 60;
      positions[i3 + 2] = (Math.random() - 0.5) * 120;
  
      scales[i] = Math.random();
      
      // Random factors for the shader animation
      randomness[i3] = Math.random();
      randomness[i3 + 1] = Math.random();
      randomness[i3 + 2] = Math.random();
    }
  
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geometry.setAttribute('aRandomness', new THREE.BufferAttribute(randomness, 3));
  
    // --- Premium Shader ---
    const material = new THREE.ShaderMaterial({
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: false,
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#8B5CF6') }, // Your Color Preserved
        uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) }
      },
      vertexShader: `
        uniform float uTime;
        uniform float uPixelRatio;
        
        attribute float aScale;
        attribute vec3 aRandomness;
        
        varying float vAlpha;
  
        void main() {
          vec4 modelPosition = modelMatrix * vec4(position, 1.0);
          
          // Creative Logic: Add organic floating movement
          // We use sine waves offset by the randomness attribute to make each particle move uniquely
          float time = uTime * 0.5; // Slow down time for elegance
          
          // Gentle "breathing" motion on Y axis
          modelPosition.y += sin(time + modelPosition.x * 0.05) * 2.0 * aRandomness.y;
          
          // Subtle drift on X/Z
          modelPosition.x += cos(time * 0.3 + aRandomness.z * 10.0) * 0.5;
          
          vec4 viewPosition = viewMatrix * modelPosition;
          vec4 projectedPosition = projectionMatrix * viewPosition;
  
          gl_Position = projectedPosition;
  
          // Dynamic Size: Particles pulse in size based on time
          float sizePulse = 1.0 + sin(uTime * 2.0 + aRandomness.x * 100.0) * 0.3;
          
          gl_PointSize = 150.0 * aScale * sizePulse * uPixelRatio;
          gl_PointSize *= (1.0 / -viewPosition.z); // Scale by distance (perspective)
  
          // Pass alpha to fragment
          // Particles further away fade out slightly more
          vAlpha = smoothstep(50.0, 0.0, -viewPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vAlpha;
  
        void main() {
          // Create a soft glowing circle (no hard edges)
          float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
          float strength = 0.05 / distanceToCenter - 0.1; // Glow formula
  
          gl_FragColor = vec4(uColor, strength * vAlpha);
        }
      `,
      transparent: true
    });
  
    const particles = new THREE.Points(geometry, material);
    scene.add(particles);
  
    // --- Interaction: Mouse Parallax ---
    let mouseX = 0;
    let mouseY = 0;
  
    const handleMouseMove = (event) => {
      mouseX = event.clientX / window.innerWidth - 0.5;
      mouseY = event.clientY / window.innerHeight - 0.5;
    };
  
    window.addEventListener('mousemove', handleMouseMove);
  
    // --- Animation Loop ---
    const clock = new THREE.Clock();
    let animationId;
  
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
  
      // Update Shader Time
      material.uniforms.uTime.value = elapsedTime;
  
      // Smooth Camera/Scene Rotation based on Mouse (Parallax)
      // This creates the "3D depth" feeling when you move your mouse
      const targetRotationX = mouseY * 0.1;
      const targetRotationY = mouseX * 0.1;
      
      // Linear interpolation for smoothness (Lag effect)
      scene.rotation.x += (targetRotationX - scene.rotation.x) * 0.05;
      scene.rotation.y += (targetRotationY - scene.rotation.y) * 0.05;
      
      // Continuous gentle rotation override
      scene.rotation.y += 0.001; 
  
      renderer.render(scene, camera);
    };
  
    animate();
  
    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      material.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    };
  
    window.addEventListener('resize', handleResize);
  
    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <section className="relative w-full py-24 overflow-hidden bg-[#050505]">
      {/* Three.js Background Layer */}
      <div ref={mountRef} className="absolute inset-0 z-0 pointer-events-none opacity-60" />

      {/* Main Content Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">    
        {/* Glassmorphic Card */}
        <div className="relative w-full rounded-3xl overflow-hidden border border-[#27272a] bg-[#121214]/60 backdrop-blur-xl shadow-2xl shadow-[#8B5CF6]/10">
              
        <div
          className="absolute inset-0 z-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(to right, #e2e8f0 1px, transparent 1px),
              linear-gradient(to bottom, #e2e8f0 1px, transparent 1px)
            `,
            backgroundSize: "20px 30px",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
            maskImage:
              "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          }}
        />

          {/* Inner Content Padding */}
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center md:px-10 md:py-20 relative">
            {/* Headline */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6"
            >
             Smarter Tracking, <br className="hidden md:block" />
              <span className="text-[#8B5CF6]">
              Real Rewards
              </span>
            </motion.h2>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl text-sm sm:text-lg text-balance text-[#9CA3AF] mb-10 leading-relaxed"
            >
            Visualize your entire portfolio in one place and earn PTLY tokens just for completing missions. No complex setup just connect and grow.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
             <Link href="/ai">
                <motion.button
                  whileHover={{ scale: 1.02, translateY: -2 }}
                  whileTap={{ scale: 0.98, translateY: 1 }}
                  className="relative group mx-auto px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 overflow-hidden isolate text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.6)] transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] z-[-1]" />
                  <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40" />
                  <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/30" />
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
                
                  <IoWalletOutline className="text-xl relative z-10" />
                  <span className="relative z-10">Connect Wallet</span>
                  <RiArrowRightLine className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform relative z-10" />
                </motion.button>
            </Link>
  <motion.a
    href="https://twitter.com"
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.02, translateY: -2 }}
    whileTap={{ scale: 0.98, translateY: 1 }}
    className="relative mx-auto group px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 overflow-hidden isolate text-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] transition-all duration-300"
  >
    <div className="absolute inset-0 bg-gradient-to-b from-[#27272a] to-[#09090b] z-[-1] border border-white/5" />
    <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/20" />
    <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/50" />
    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
    <FaXTwitter className="text-[#A78BFA] group-hover:text-white transition-colors text-xl relative z-10" />
    <span className="relative z-10 text-gray-200 group-hover:text-white transition-colors">Follow on X</span>
  </motion.a>
            </motion.div>

            {/* Social Proof / Trust Line */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center gap-2 text-sm text-[#9CA3AF]"
            >
              <span>Trusted by 1,400+ Active Portfolios</span>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};


export default PortlyCTA;