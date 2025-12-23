'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion';
import Link from 'next/link';
import { 
  FiArrowRight, FiBookOpen, FiCpu, FiShield, 
  FiZap, FiActivity, FiTrendingUp, FiLayers 
} from 'react-icons/fi';

// --- COMPONENTS ---

// 1. Magnetic Button Component
const MagneticButton = ({ children, className, onClick }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    x.set(middleX * 0.15);
    y.set(middleY * 0.15);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={reset}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      {children}
    </motion.button>
  );
};

// 2. Background Mesh (The "Forta" Vibe)
const AmbientBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none bg-[#030305]">
    {/* Noise Texture */}
    <div className="absolute inset-0 z-[1] opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay"></div>
    
    {/* Deep Glows */}
    <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-[#7C3AED]/10 rounded-full blur-[150px] animate-pulse-slow" />
    <div className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-[#8B5CF6]/10 rounded-full blur-[150px] animate-pulse-slow delay-1000" />
    
    {/* Tech Grid */}
    <div 
      className="absolute inset-0 z-[0]" 
      style={{ 
        backgroundImage: 'radial-gradient(rgba(139, 92, 246, 0.15) 1px, transparent 1px)', 
        backgroundSize: '40px 40px',
        maskImage: 'radial-gradient(ellipse 60% 60% at 50% 50%, black, transparent)'
      }} 
    />
  </div>
);

// 3. The 3D Holographic Dashboard
const HolographicDashboard = () => {
  const cardRef = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  const handleMouseMove = (e) => {
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct * 200);
    y.set(yPct * 200);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
      animate={{ opacity: 1, scale: 1, rotateX: 0 }}
      transition={{ duration: 1, ease: "easeOut" }}
      className="relative w-full max-w-[500px] aspect-[4/5] perspective-1000"
    >
      {/* Floating Elements Container */}
      <div className="absolute inset-0 bg-[#121214]/80 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl flex flex-col overflow-hidden transform-style-3d">
        
        {/* Glow Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none z-10"></div>

        {/* Dashboard Header */}
        <div className="h-16 border-b border-white/5 flex items-center justify-between px-6 bg-white/[0.02]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/20 shadow-[0_0_10px_rgba(239,68,68,0.2)]"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/20 shadow-[0_0_10px_rgba(234,179,8,0.2)]"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/20 shadow-[0_0_10px_rgba(34,197,94,0.2)]"></div>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-mono text-emerald-500">SYSTEM ONLINE</span>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="p-6 space-y-6 relative flex-1">
          
          {/* Chart Graphic */}
          <div className="h-32 w-full rounded-2xl bg-gradient-to-b from-[#8B5CF6]/10 to-transparent border border-white/5 relative overflow-hidden group">
             {/* Animated Grid Lines */}
             <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(139,92,246,0.1) 1px, transparent 1px)', backgroundSize: '100% 20%' }}></div>
             
             {/* Simulated Graph Line */}
             <svg className="absolute bottom-0 left-0 w-full h-[80%] overflow-visible" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path d="M0,100 C20,80 40,90 60,40 S80,20 100,10 V100 H0 Z" fill="url(#purpleGradient)" opacity="0.3" />
               <path d="M0,100 C20,80 40,90 60,40 S80,20 100,10" fill="none" stroke="#8B5CF6" strokeWidth="2" vectorEffect="non-scaling-stroke" />
               <defs>
                 <linearGradient id="purpleGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#8B5CF6" />
                   <stop offset="100%" stopColor="transparent" />
                 </linearGradient>
               </defs>
             </svg>
          </div>

          {/* List Items */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + (i * 0.2) }}
                className="h-12 w-full rounded-xl bg-white/5 border border-white/5 flex items-center px-4 gap-4"
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${i === 1 ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]' : 'bg-white/5 text-white/20'}`}>
                  {i === 1 ? <FiActivity /> : <FiLayers />}
                </div>
                <div className="flex-1 h-1.5 bg-white/10 rounded-full w-1/2 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: i === 1 ? '70%' : '40%' }}
                    transition={{ duration: 1.5, delay: 1 }}
                    className={`h-full ${i === 1 ? 'bg-[#8B5CF6]' : 'bg-white/20'}`} 
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Elements (Parallax Layers) */}
      <motion.div 
        style={{ translateZ: 60 }}
        className="absolute -right-8 top-20 w-44 p-4 rounded-2xl bg-[#1E1E24]/90 backdrop-blur-xl border border-white/10 shadow-2xl z-20"
      >
        <div className="flex items-center gap-3 mb-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400"><FiTrendingUp size={14} /></div>
          <span className="text-xs font-bold text-white uppercase tracking-wider">Growth</span>
        </div>
        <div className="text-2xl font-bold text-white">+24.5%</div>
      </motion.div>

      <motion.div 
        style={{ translateZ: 40 }}
        className="absolute -left-8 bottom-32 w-40 p-4 rounded-2xl bg-[#1E1E24]/90 backdrop-blur-xl border border-white/10 shadow-2xl z-20"
      >
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-white/60 uppercase">Risk Score</span>
          <FiShield className="text-[#8B5CF6]" />
        </div>
        <div className="text-xl font-black text-white">8.5<span className="text-xs font-normal text-white/40">/10</span></div>
      </motion.div>

    </motion.div>
  );
};

// --- MAIN HERO COMPONENT ---
export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden">
      
      <AmbientBackground />

      <div className="relative z-10 max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center py-20">
        
        {/* --- LEFT COLUMN: Typography & CTA --- */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          
          {/* Animated Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-lg shadow-[#8B5CF6]/5 group cursor-default hover:border-[#8B5CF6]/30 transition-colors">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#8B5CF6] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#8B5CF6]"></span>
              </span>
              <span className="text-xs font-semibold text-gray-300 tracking-widest uppercase group-hover:text-white transition-colors">
                AI Portfolio Engine v2.0
              </span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Wealth Intelligence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#C4B5FD] to-white">
              Reimagined.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/50 max-w-xl leading-relaxed font-light"
          >
            Stop guessing. Start knowing. Portly uses advanced AI to track, analyze, and optimize your crypto portfolio in real-time. Experience the future of asset management.
          </motion.p>

          {/* Magnetic CTA Buttons */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-5 pt-4 w-full sm:w-auto"
          >
            <Link href="/ai" className="w-full sm:w-auto">
              <MagneticButton className="group relative w-full sm:w-auto px-8 py-4 bg-[#0A0A0B] rounded-xl flex items-center justify-center gap-3 text-white font-bold text-lg overflow-hidden border border-white/10">
                <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] opacity-20 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative z-10 flex items-center gap-2">
                  <FiCpu className="text-[#8B5CF6] group-hover:text-white transition-colors" />
                  <span>Launch Agent</span>
                  <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </div>
              </MagneticButton>
            </Link>

            <a href="https://docs.portly.ai" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto">
              <MagneticButton className="w-full sm:w-auto px-8 py-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 backdrop-blur-md flex items-center justify-center gap-3 text-white font-medium text-lg transition-all">
                <FiBookOpen className="text-white/60 group-hover:text-white transition-colors" />
                <span>Documentation</span>
              </MagneticButton>
            </a>
          </motion.div>

          {/* Trust Footer */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-8 flex items-center gap-6 text-white/30 text-xs font-medium uppercase tracking-widest"
          >
            <span>Secured By</span>
            <div className="h-1 w-1 bg-white/20 rounded-full"></div>
            <span className="flex items-center gap-2 hover:text-white/60 transition-colors"><FiZap /> Alchemy</span>
            <span className="flex items-center gap-2 hover:text-white/60 transition-colors"><FiShield /> Moralis</span>
          </motion.div>
        </div>

        {/* --- RIGHT COLUMN: 3D DASHBOARD --- */}
        <div className="flex justify-center lg:justify-end">
          <HolographicDashboard />
        </div>

      </div>
    </section>
  );
}