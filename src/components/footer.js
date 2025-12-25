'use client'
import React, { useRef, Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text3D, Center, Environment, Float, Sparkles, useFont } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'framer-motion';
import { FaXTwitter } from "react-icons/fa6";
import { LiaTelegramPlane } from "react-icons/lia";
import { SiBnbchain } from "react-icons/si";

// --- 1. Optimized 3D Text Component ---
const Ptly3DHeading = () => {
  // Using a stable font URL. 
  // TIP: For production, download this JSON and import it locally to avoid network errors.
  const fontUrl = 'https://threejs.org/examples/fonts/helvetiker_bold.typeface.json';

  const materialRef = useRef(null);

  // Optimized animation: Only update material if necessary
  useFrame(({ clock }) => {
    if (materialRef.current) {
       // Gentle pulse
       materialRef.current.emissiveIntensity = Math.sin(clock.elapsedTime * 0.5) * 0.2 + 0.6;
    }
  });

  // Memoize geometry settings to prevent re-calculations
  const textOptions = useMemo(() => ({
    size: 3,
    height: 0.5, // Reduced depth slightly for performance
    curveSegments: 4, // OPTIMIZED: Reduced from 12 (huge performance gain)
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.05,
    bevelOffset: 0,
    bevelSegments: 2 // OPTIMIZED: Reduced from 5
  }), []);

  return (
    <>
      {/* Optimized Lighting: Removed heavy SpotLight, used Directional */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8B5CF6" />

      {/* FIX: Float must wrap Center. 
          Old way: Center > Float (Causes NaN errors as Center tries to measure moving object)
          New way: Float > Center (Centers the text geometry, then floats the whole group) 
      */}
      <Float 
        speed={2} 
        rotationIntensity={0.5} 
        floatIntensity={0.5} 
        floatingRange={[-0.2, 0.2]}
      >
        <Center top>
          <Text3D font={fontUrl} {...textOptions}>
            $PTLY
            <meshPhysicalMaterial
              ref={materialRef}
              color={'#ffffff'}
              emissive={'#5b21b6'}
              emissiveIntensity={0.5}
              roughness={0.2}
              metalness={0.8}
              clearcoat={0.5}
              clearcoatRoughness={0.1}
            />
          </Text3D>
        </Center>
      </Float>
      
      {/* Reduced particle count for performance */}
      <Sparkles count={60} scale={12} size={3} speed={0.4} opacity={0.4} color="#A78BFA" />

      <Environment preset="city" />
    </>
  );
};


// --- 2. Helper Components ---

const SocialLink = ({ href, icon: Icon, label }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-gray-400 transition-colors duration-300 group"
      whileHover={{ scale: 1.05, x: 2 }}
      whileTap={{ scale: 0.95 }}
    >
        <span className="p-2 rounded-full bg-white/5 group-hover:bg-purple-500/20 text-gray-300 group-hover:text-white transition-all duration-300 border border-white/10 group-hover:border-purple-500/50">
            <Icon className="text-xl" />
        </span>
      <span className="hidden sm:inline font-medium text-sm tracking-wide group-hover:text-white transition-colors">{label}</span>
    </motion.a>
  );
};

const NavLink = ({ href, label }) => {
    return (
      <motion.a
        href={href}
        className="text-gray-400 text-sm font-medium tracking-wider relative py-1 hover:text-white transition-colors"
      >
        {label}
        <motion.span 
            className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-purple-500 to-cyan-500 origin-left"
            initial={{ scaleX: 0 }}
            whileHover={{ scaleX: 1 }}
            transition={{ duration: 0.3 }}
        />
      </motion.a>
    );
};


// --- 3. Main Footer Component ---

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#050509] overflow-hidden flex flex-col justify-end pt-20">
      
      {/* Static Background Elements (Cheaper than doing it in Three.js) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-900/20 rounded-full blur-[100px] mix-blend-screen"></div>
          <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#050509] to-transparent z-10"></div>


      {/* --- Optimized Canvas Section --- */}
      <div className="w-full h-[350px] md:h-[450px] relative z-20">
        <Suspense fallback={null}>
            {/* dpr={[1, 2]} clamps resolution on high-res screens to prevent lag */}
            <Canvas 
              dpr={[1, 2]} 
              camera={{ position: [0, 0, 8], fov: 45 }} 
              gl={{ antialias: true, toneMapping: THREE.ReinhardToneMapping, toneMappingExposure: 1.5 }}
            >
              <color attach="background" args={['transparent']} />
              <Ptly3DHeading />
            </Canvas>
        </Suspense>
      </div>


      {/* --- Footer Content --- */}
      <div className="relative z-30 w-full border-t border-white/5 bg-black/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-8 md:py-10 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            
            {/* Branding */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <span className="text-white font-bold text-xl">P</span>
              </div>
              <div>
                <h3 className="text-white font-bold text-xl tracking-widest uppercase">PORTLY</h3>
                <p className="text-gray-500 text-sm mt-1">The next generation crypto ecosystem.</p>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-12 w-full md:w-auto justify-center md:justify-end">
                <nav className="flex flex-wrap justify-center gap-6">
                    <NavLink href="#" label="Agent Dashboard" />
                    <NavLink href="#" label="Rewards" />
                </nav>

                <div className="hidden lg:block w-px h-6 bg-white/10"></div>

                <div className="flex flex-wrap justify-center gap-4">
                    <SocialLink href="https://twitter.com" icon={FaXTwitter} label="X (Twitter)" />
                    <SocialLink href="https://telegram.org" icon={LiaTelegramPlane} label="Telegram" />
                    <SocialLink href="https://bscscan.com" icon={SiBnbchain} label="BscScan" />
                </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-600 gap-4">
               <p>© 2024 PORTLY Project. All rights reserved.</p>
               <div className="flex gap-4">
                  <a href="#" className="hover:text-gray-400 transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-gray-400 transition-colors">Terms of Service</a>
               </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;