'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { FaXTwitter } from 'react-icons/fa6';
import { IoWalletOutline } from 'react-icons/io5';
import { BsStars, BsShieldCheck } from 'react-icons/bs';
import { RiTokenSwapLine } from 'react-icons/ri';
import Link from 'next/link';
import { motion } from 'framer-motion';

const PortlyCTA = () => {
  const mountRef = useRef(null);

  // --- Three.js Background Logic ---
  useEffect(() => {
    if (!mountRef.current) return;

    // Scene Setup
    const scene = new THREE.Scene();
    // Using Portly 'Deepest Void' #0A0A0B as fog/base
    scene.background = new THREE.Color('#0A0A0B'); 
    scene.fog = new THREE.FogExp2('#0A0A0B', 0.002);

    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 50;
    camera.position.y = 10;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mountRef.current.appendChild(renderer.domElement);

    // Particle System (The Blinking Dots)
    const particleCount = 2000;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    const speeds = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      // Create a grid-like distribution with some randomness
      const x = (Math.random() - 0.5) * 150;
      const z = (Math.random() - 0.5) * 100;
      const y = (Math.random() - 0.5) * 40;
      
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      sizes[i] = Math.random();
      speeds[i] = Math.random();
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));
    geometry.setAttribute('aSpeed', new THREE.BufferAttribute(speeds, 1));

    // Custom Shader for the "Blink" effect
    // Uses Portly Primary Violet: #8B5CF6
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#8B5CF6') },
      },
      vertexShader: `
        attribute float aSize;
        attribute float aSpeed;
        varying float vOpacity;
        uniform float uTime;
        void main() {
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          
          // Blink logic based on time and random speed
          float blink = sin(uTime * aSpeed * 2.0 + position.x);
          vOpacity = smoothstep(0.0, 1.0, blink);
          
          gl_PointSize = aSize * 4.0 * (30.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        uniform vec3 uColor;
        varying float vOpacity;
        void main() {
          // Circular particle
          float r = distance(gl_PointCoord, vec2(0.5));
          if (r > 0.5) discard;
          
          // Glow effect
          float glow = 1.0 - (r * 2.0);
          glow = pow(glow, 1.5);

          gl_FragColor = vec4(uColor, vOpacity * glow);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation Loop
    const clock = new THREE.Clock();
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      material.uniforms.uTime.value = elapsedTime;
      
      // Gentle rotation
      particles.rotation.y = elapsedTime * 0.05;

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
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
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
    <section className="relative w-full py-24 overflow-hidden bg-[#0A0A0B]">
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
          <div className="flex flex-col items-center justify-center px-6 py-20 text-center md:px-12 md:py-24 relative">

            {/* --- Central Content --- */}

            {/* Top Tagline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-[#7C3AED]/30 bg-[#7C3AED]/10"
            >
              <BsStars className="text-[#A78BFA] animate-pulse" />
              <span className="text-sm font-medium text-[#E5E7EB]">Start with Portly today!</span>
              <BsStars className="text-[#A78BFA] animate-pulse" />
            </motion.div>

            {/* Headline */}
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6"
            >
              Transform Data into <br className="hidden md:block" />
              <span className="bg-gradient-to-r from-[#FFFFFF] via-[#A78BFA] to-[#8B5CF6] bg-clip-text text-transparent">
                Wealth Intelligence
              </span>
            </motion.h2>

            {/* Subtext */}
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="max-w-2xl text-lg text-[#9CA3AF] mb-10 leading-relaxed"
            >
              Connect your wallet to visualize assets across chains, get instant AI risk analysis, 
              and earn native PTLY tokens by completing missions. No setup, no stress.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
            >
              {/* Primary Button: Connect Wallet */}
              <Link href="/ai" className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-full bg-[#8B5CF6] px-8 font-medium text-white transition-all duration-300 hover:bg-[#7C3AED] hover:shadow-[0_0_20px_rgba(139,92,246,0.5)]">
                <span className="mr-2 text-xl"><IoWalletOutline /></span>
                <span>Connect Wallet</span>
                <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              </Link>

              {/* Secondary Button: Follow on X */}
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="inline-flex h-12 items-center justify-center rounded-full border border-[#27272a] bg-[#1E1E24] px-8 font-medium text-[#E5E7EB] transition-all duration-300 hover:border-[#8B5CF6] hover:text-white hover:bg-[#27272a]">
                <span className="mr-2 text-lg"><FaXTwitter /></span>
                <span>Follow on X</span>
              </a>
            </motion.div>

            {/* Social Proof / Trust Line */}
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
              className="mt-8 flex items-center gap-2 text-sm text-[#9CA3AF]"
            >
              <div className="flex -space-x-2">
                {[1,2,3].map(i => (
                  <div key={i} className="w-6 h-6 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#A78BFA] border-2 border-[#121214]" />
                ))}
              </div>
              <span>Trusted by 1,400+ Active Portfolios</span>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
};


export default PortlyCTA;