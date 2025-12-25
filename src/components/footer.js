'use client'
import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { FaXTwitter } from "react-icons/fa6";
import { LiaTelegramPlane } from "react-icons/lia";
import { SiBnbchain } from "react-icons/si";

// --- 1. The "CSS 3D" Text Component (No WebGL) ---
const PtlyCss3D = () => {
  const containerRef = useRef(null);
  
  // Mouse Physics
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth smoothing of mouse movement
  const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
  const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

  // Map mouse position to rotation degrees
  const rotateX = useTransform(mouseY, [-0.5, 0.5], [15, -15]); // Tilt up/down
  const rotateY = useTransform(mouseX, [-0.5, 0.5], [-15, 15]); // Tilt left/right

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    
    // Calculate normalized mouse position (-0.5 to 0.5)
    const clientX = e.clientX - rect.left;
    const clientY = e.clientY - rect.top;
    
    const xPct = clientX / width - 0.5;
    const yPct = clientY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  // Create the "Stack" of layers to fake 3D volume
  // We render the text multiple times, each pushed back slightly in Z-space
  const layers = Array.from({ length: 8 }); // 8 layers of depth

  return (
    <div 
      className="relative w-full h-full flex items-center justify-center perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      ref={containerRef}
      style={{ perspective: '1000px' }} // Essential for 3D effect
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        className="relative text-[100px] md:text-[150px] font-black tracking-tighter leading-none select-none cursor-default"
      >
        {/* The Shadow/Volume Layers (Darker) */}
        {layers.map((_, i) => (
          <span
            key={i}
            className="absolute inset-0 text-[#4c1d95] opacity-90"
            style={{
              transform: `translateZ(-${i * 2}px)`, // Push back
              textShadow: '0 0 5px rgba(139, 92, 246, 0.5)', // Glow
              zIndex: -i // Render behind
            }}
            aria-hidden="true"
          >
            $PTLY
          </span>
        ))}

        {/* The Front Face (Premium Gradient) */}
        <span 
          className="relative z-10 bg-clip-text text-transparent bg-gradient-to-br from-white via-purple-100 to-purple-300"
          style={{ transform: 'translateZ(2px)' }} // Pop forward slightly
        >
          $PTLY
          {/* Shine effect on the face */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] animate-shine skew-x-12 pointer-events-none" />
        </span>
      </motion.div>
    </div>
  );
};


// --- 2. Micro-Interaction Link Components ---

const SocialLink = ({ href, icon: Icon, label }) => {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-gray-400 group relative"
      whileHover="hover"
      initial="initial"
    >
        <motion.div 
          className="p-3 rounded-xl bg-[#1E1E24] border border-white/5 group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-colors duration-300 relative overflow-hidden"
          variants={{
            initial: { y: 0 },
            hover: { y: -4, boxShadow: "0 10px 20px -5px rgba(139, 92, 246, 0.3)" }
          }}
        >
            <Icon className="text-xl text-gray-300 group-hover:text-white transition-colors" />
            {/* Subtle internal glow on hover */}
            <div className="absolute inset-0 bg-purple-500/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </motion.div>
      <span className="hidden sm:inline font-medium text-sm tracking-wide group-hover:text-white transition-colors">{label}</span>
    </motion.a>
  );
};

const NavLink = ({ href, label }) => {
    return (
      <a href={href} className="relative group px-4 py-2">
        <span className="text-gray-400 text-sm font-medium tracking-wider group-hover:text-white transition-colors relative z-10">
          {label}
        </span>
        {/* Creative interaction: Background pill slides in */}
        <span className="absolute inset-0 bg-white/5 rounded-lg scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-300 ease-out -z-0 border border-white/10" />
      </a>
    );
};


// --- 3. Main Footer Structure ---

const Footer = () => {
  return (
    <footer className="relative w-full min-h-[600px] bg-[#050509] overflow-hidden flex flex-col justify-end">
      
      {/* --- Ambient Background --- */}
      {/* 1. Gradient Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
          <div className="absolute top-[10%] right-[10%] w-[400px] h-[400px] bg-blue-900/10 rounded-full blur-[100px] mix-blend-screen"></div>
      </div>

      {/* 2. Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 mix-blend-overlay"></div>
      
      {/* 3. Bottom Fade */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[#050509] via-[#050509]/80 to-transparent z-10"></div>


      {/* --- 3D Feature Section (Replaced Canvas with CSS 3D) --- */}
      <div className="w-full h-[350px] md:h-[450px] relative z-20 flex flex-col items-center justify-center">
        <PtlyCss3D />
        
        {/* Floating Subtext */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="mt-4 text-purple-300/60 text-sm tracking-[0.3em] font-medium uppercase"
        >
          Join the Financial Revolution
        </motion.p>
      </div>


      {/* --- Footer Content Block --- */}
      <div className="relative z-30 w-full border-t border-white/5 bg-[#09090b]/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-10 lg:px-8">
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4">
            
            {/* Branding */}
            <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
              <div className="relative group cursor-pointer">
                 <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#8B5CF6] to-[#6D28D9] flex items-center justify-center shadow-lg shadow-purple-900/40 group-hover:scale-105 transition-transform duration-300">
                    <span className="text-white font-bold text-xl font-mono">P</span>
                 </div>
                 {/* Logo Glow */}
                 <div className="absolute inset-0 bg-purple-600 blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-300 -z-10" />
              </div>

              <div>
                <h3 className="text-white font-bold text-xl tracking-widest uppercase font-mono">PORTLY</h3>
                <p className="text-gray-500 text-xs mt-1 max-w-[200px] leading-relaxed">
                  Building the decentralized future on BSC.
                </p>
              </div>
            </div>

            {/* Links Area */}
            <div className="flex flex-col lg:flex-row items-center gap-8 w-full md:w-auto justify-center md:justify-end">
                
                {/* Project Links */}
                <nav className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                    <NavLink href="#" label="Dashboard" />
                    <div className="w-px h-4 bg-white/10"></div>
                    <NavLink href="#" label="Rewards" />
                </nav>

                {/* Socials */}
                <div className="flex flex-wrap justify-center gap-6">
                    <SocialLink href="https://twitter.com" icon={FaXTwitter} label="X" />
                    <SocialLink href="https://telegram.org" icon={LiaTelegramPlane} label="Telegram" />
                    <SocialLink href="https://bscscan.com" icon={SiBnbchain} label="Scan" />
                </div>
            </div>
          </div>

          {/* Copyright Line */}
          <div className="mt-10 pt-6 border-t border-white/5 flex flex-col-reverse sm:flex-row justify-between items-center text-[11px] text-gray-600 uppercase tracking-wider gap-4">
               <p>© 2024 PORTLY Project. All rights reserved.</p>
               <div className="flex gap-6">
                  <a href="#" className="hover:text-purple-400 transition-colors">Privacy</a>
                  <a href="#" className="hover:text-purple-400 transition-colors">Terms</a>
                  <a href="#" className="hover:text-purple-400 transition-colors">Docs</a>
               </div>
          </div>

        </div>
      </div>

      {/* CSS Animation Keyframes for the shine effect */}
      <style jsx>{`
        @keyframes shine {
          0% { transform: translateX(-100%) skewX(-12deg); }
          20%, 100% { transform: translateX(200%) skewX(-12deg); }
        }
        .animate-shine {
          animation: shine 6s infinite linear;
        }
        .animate-pulse-slow {
          animation: pulse 8s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;

// ummm. i dont' like the text you need to make it with three js and added a matilic graient on it that will make footer more premium and effective 