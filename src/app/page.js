'use client';

import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { FiArrowRight, FiPlayCircle, FiCpu, FiShield, FiZap, FiCommand } from 'react-icons/fi';

// --- NAVBAR COMPONENT ---
const Navbar = () => (
  <motion.nav 
    initial={{ y: -20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.8, ease: "easeOut" }}
    className="fixed top-0 w-full z-50 px-6 py-4"
  >
    <div className="max-w-7xl mx-auto flex items-center justify-between p-4 rounded-2xl bg-[#0A0A0B]/80 backdrop-blur-xl border border-white/5 shadow-2xl">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)]">
          <FiCommand className="text-white w-5 h-5" />
        </div>
        <span className="font-bold text-xl text-white tracking-tight">PORTLY<span className="text-[#8B5CF6]">.AI</span></span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/60">
        {['Features', 'Security', 'Roadmap', 'Pricing'].map((item) => (
          <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-white transition-colors relative group">
            {item}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#8B5CF6] transition-all group-hover:w-full"></span>
          </a>
        ))}
      </div>

      <button className="px-6 py-2.5 rounded-xl bg-white text-black font-bold text-sm hover:bg-[#E5E7EB] transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
        Launch App
      </button>
    </div>
  </motion.nav>
);

// --- FLOATING BADGE ---
const Badge = ({ icon: Icon, text, delay, x, y }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, x: 0, y: 0 }}
    animate={{ opacity: 1, scale: 1, x, y }}
    transition={{ delay, duration: 0.8, type: "spring" }}
    className="absolute hidden lg:flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E1E24]/90 backdrop-blur-md border border-white/10 shadow-2xl z-20"
  >
    <div className="p-1.5 rounded-full bg-[#8B5CF6]/20 text-[#8B5CF6]">
      <Icon size={14} />
    </div>
    <span className="text-xs font-bold text-white">{text}</span>
  </motion.div>
);

export default function HeroSection() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  // Mouse Parallax Effect
  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const moveX = clientX - window.innerWidth / 2;
    const moveY = clientY - window.innerHeight / 2;
    const offsetFactor = 15;
    setMousePosition({ x: moveX / offsetFactor, y: moveY / offsetFactor });
  };

  return (
    <div 
      className="relative min-h-screen bg-[#0A0A0B] text-white overflow-hidden selection:bg-[#8B5CF6] selection:text-white"
      onMouseMove={handleMouseMove}
    >
      <Navbar />

      {/* --- BACKGROUND AMBIENCE --- */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-[#7C3AED]/20 rounded-full blur-[120px] mix-blend-screen animate-pulse-slow"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] bg-[#8B5CF6]/10 rounded-full blur-[120px] mix-blend-screen"></div>
        <div className="absolute top-[20%] left-[50%] w-[30vw] h-[30vw] bg-blue-500/10 rounded-full blur-[100px] mix-blend-screen"></div>
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 lg:pt-48 pb-20 flex flex-col lg:flex-row items-center gap-16 lg:gap-8">
        
        {/* LEFT COLUMN: TEXT */}
        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6 backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-medium text-white/80 uppercase tracking-wide">AI Engine Online v2.0</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
          >
            Wealth Intelligence <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#C4B5FD] to-white">
              Reimagined.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/50 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed"
          >
            Stop guessing. Start knowing. Portly uses advanced AI to track, analyze, and optimize your crypto portfolio in real-time. No complex charts, just clear answers.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] text-white rounded-xl font-bold text-lg shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 group">
              Start for Free
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="w-full sm:w-auto px-8 py-4 bg-[#1E1E24] hover:bg-[#272730] text-white border border-white/10 rounded-xl font-bold text-lg transition-all flex items-center justify-center gap-2 group">
              <FiPlayCircle className="text-[#8B5CF6] group-hover:scale-110 transition-transform" />
              Watch Demo
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-12 flex items-center justify-center lg:justify-start gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500"
          >
            {['Binance', 'Coinbase', 'Metamask', 'Ledger'].map((brand, i) => (
              <span key={i} className="text-sm font-bold text-white uppercase tracking-widest">{brand}</span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: 3D DASHBOARD VISUAL */}
        <div className="flex-1 relative w-full max-w-[600px] aspect-square flex items-center justify-center">
          
          {/* Floating Badges */}
          <Badge icon={FiZap} text="+24.5% Growth" delay={1.2} x={-220} y={-100} />
          <Badge icon={FiShield} text="Risk: Low" delay={1.4} x={240} y={40} />
          <Badge icon={FiCpu} text="AI Scanning..." delay={1.6} x={-200} y={120} />

          {/* Main Dashboard Card (Tilt Effect) */}
          <motion.div
            style={{ 
              x: mousePosition.x, 
              y: mousePosition.y,
              rotateX: mousePosition.y * 0.05,
              rotateY: mousePosition.x * 0.05,
            }}
            initial={{ opacity: 0, scale: 0.8, rotateX: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
            className="relative w-full h-full rounded-[2.5rem] border border-white/10 bg-[#121214]/80 backdrop-blur-2xl shadow-2xl overflow-hidden group perspective-1000"
          >
            {/* Dashboard Mockup Content */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none"></div>
            
            {/* Header Mock */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
              </div>
              <div className="h-2 w-24 bg-white/10 rounded-full"></div>
            </div>

            {/* Body Mock */}
            <div className="p-8 space-y-6">
              <div className="flex items-end justify-between">
                <div>
                  <div className="h-3 w-32 bg-white/10 rounded-full mb-3"></div>
                  <div className="h-12 w-48 bg-gradient-to-r from-white to-white/40 rounded-lg"></div>
                </div>
                <div className="h-10 w-10 rounded-full bg-[#8B5CF6] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/40 animate-bounce">
                  <FiArrowRight className="text-white -rotate-45" />
                </div>
              </div>

              {/* Chart Area */}
              <div className="h-40 w-full rounded-2xl bg-gradient-to-b from-[#8B5CF6]/10 to-transparent border border-[#8B5CF6]/10 relative overflow-hidden">
                 <div className="absolute bottom-0 left-0 w-full h-[60%] bg-[#8B5CF6]/20 blur-xl"></div>
                 <svg className="absolute bottom-0 left-0 w-full h-full" preserveAspectRatio="none">
                    <path d="M0,100 C100,80 200,120 300,60 C400,0 500,80 600,40 L600,160 L0,160 Z" fill="url(#grad)" />
                    <defs>
                      <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="rgba(139, 92, 246, 0.4)" />
                        <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
                      </linearGradient>
                    </defs>
                 </svg>
              </div>

              {/* List Items */}
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-white/10"></div>
                      <div className="h-2 w-20 bg-white/10 rounded-full"></div>
                    </div>
                    <div className="h-2 w-12 bg-emerald-500/50 rounded-full"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Glass Glint Effect */}
            <div className="absolute -top-[100%] -left-[100%] w-[300%] h-[300%] bg-gradient-to-br from-transparent via-white/10 to-transparent rotate-45 group-hover:translate-x-[50%] group-hover:translate-y-[50%] transition-transform duration-1000"></div>
          </motion.div>
        </div>

      </div>

      {/* --- SCROLL MOUSE ICON --- */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 2, duration: 2, repeat: Infinity }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/20 flex justify-center p-1">
          <div className="w-1 h-2 bg-white/50 rounded-full"></div>
        </div>
      </motion.div>

    </div>
  );
}