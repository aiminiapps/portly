'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FiArrowRight, FiBook, FiCpu, FiShield, FiZap, 
  FiActivity, FiLayers, FiGlobe 
} from 'react-icons/fi';
import { SiEthereum, SiBitcoin } from 'react-icons/si';

// --- BUTTON COMPONENTS ---

const LaunchButton = () => (
  <motion.a
    href="/ai"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative group px-8 py-4 bg-gradient-to-r from-[#8B5CF6] via-[#7C3AED] to-[#6D28D9] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] transition-all duration-500"
  >
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out"></div>
    <div className="relative flex items-center gap-3">
      <span className="font-bold text-white text-lg tracking-wide">Launch Agent</span>
      <div className="bg-white/20 p-1.5 rounded-lg group-hover:bg-white/30 transition-colors">
        <FiArrowRight className="text-white w-4 h-4 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  </motion.a>
);

const DocsButton = () => (
  <motion.a
    href="https://docs.gitbook.com" // Replace with actual link
    target="_blank"
    rel="noopener noreferrer"
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="relative group px-8 py-4 bg-[#121214]/80 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/30 transition-all duration-300"
  >
    <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    <div className="relative flex items-center gap-3">
      <FiBook className="text-[#8B5CF6] w-5 h-5 group-hover:scale-110 transition-transform" />
      <span className="font-bold text-white/80 text-lg group-hover:text-white transition-colors">Documentation</span>
    </div>
  </motion.a>
);

// --- VISUALIZATION COMPONENT (Right Side) ---

const OrbitingSatellite = ({ icon: Icon, color, delay, radius, speed, size = "md" }) => (
  <motion.div
    className="absolute top-1/2 left-1/2"
    animate={{ rotate: 360 }}
    transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: -delay }}
    style={{ width: radius * 2, height: radius * 2, x: '-50%', y: '-50%' }}
  >
    <motion.div
      className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 
        ${size === 'lg' ? 'w-16 h-16' : 'w-12 h-12'}
        rounded-2xl border border-white/10 bg-[#0A0A0B]/80 backdrop-blur-md 
        flex items-center justify-center shadow-2xl z-20`}
      style={{ boxShadow: `0 0 20px ${color}40` }}
      // Counter-rotate to keep icon upright
      animate={{ rotate: -360 }}
      transition={{ duration: speed, repeat: Infinity, ease: "linear", delay: -delay }}
    >
      <Icon className={`w-1/2 h-1/2 ${size === 'lg' ? 'text-white' : 'text-white/80'}`} style={{ color: size === 'lg' ? color : undefined }} />
      {/* Glow dot */}
      <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-white animate-pulse"></div>
    </motion.div>
  </motion.div>
);

const NeuralCore = () => {
  return (
    <div className="relative w-full aspect-square max-w-[600px] flex items-center justify-center">
      
      {/* 1. The Central Brain (AI Agent) */}
      <div className="relative z-30">
        <motion.div
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-32 h-32 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#4C1D95] flex items-center justify-center shadow-[0_0_60px_rgba(124,58,237,0.5)] border border-white/20 relative"
        >
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 rounded-full"></div>
          <FiCpu className="w-14 h-14 text-white drop-shadow-lg" />
          
          {/* Orbital Rings around Core */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-10px] rounded-full border border-dashed border-white/30"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-[-20px] rounded-full border border-dotted border-white/20"
          />
        </motion.div>
      </div>

      {/* 2. Connection Lines (SVG) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-30">
        <circle cx="50%" cy="50%" r="140" fill="none" stroke="#8B5CF6" strokeWidth="1" strokeDasharray="4 4" />
        <circle cx="50%" cy="50%" r="220" fill="none" stroke="#4ADE80" strokeWidth="1" strokeDasharray="4 4" />
      </svg>

      {/* 3. Orbiting Satellites (Data Points) */}
      
      {/* Inner Orbit (Assets) */}
      <OrbitingSatellite icon={SiEthereum} color="#627EEA" radius={140} speed={25} delay={0} />
      <OrbitingSatellite icon={SiBitcoin} color="#F7931A" radius={140} speed={25} delay={8} />
      <OrbitingSatellite icon={FiShield} color="#10B981" radius={140} speed={25} delay={16} />

      {/* Outer Orbit (Features) */}
      <OrbitingSatellite icon={FiActivity} color="#F59E0B" radius={220} speed={40} delay={5} size="lg" />
      <OrbitingSatellite icon={FiLayers} color="#3B82F6" radius={220} speed={40} delay={18} size="lg" />
      <OrbitingSatellite icon={FiGlobe} color="#EC4899" radius={220} speed={40} delay={30} size="lg" />

      {/* 4. Ambient Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#8B5CF6]/10 rounded-full blur-[100px] pointer-events-none z-0"></div>
    </div>
  );
};

// --- MAIN HERO COMPONENT ---

export default function HeroSection() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-white overflow-hidden flex items-center justify-center selection:bg-[#8B5CF6] selection:text-white">
      
      {/* Background FX */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#7C3AED]/10 rounded-full blur-[150px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-[#8B5CF6]/5 rounded-full blur-[150px]"></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        
        {/* LEFT: Content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-lg"
          >
            <FiZap className="text-[#8B5CF6] w-4 h-4" />
            <span className="text-sm font-bold text-white/90 tracking-wide">AI Portfolio Manager v2.0</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl lg:text-8xl font-black tracking-tighter leading-[1.1]"
          >
            Wealth <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#C4B5FD] to-[#8B5CF6]">
              Autopilot.
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-white/50 max-w-xl leading-relaxed"
          >
            Experience the next evolution of crypto management. Real-time analytics, risk forecasting, and automated optimization—powered by advanced neural networks.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <LaunchButton />
            <DocsButton />
          </motion.div>

          {/* Social Proof Mini */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-8 flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 transition-all duration-500"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/40">Trusted By</span>
            {['Alchemy', 'Moralis', 'Ethers.js'].map((tech, i) => (
              <span key={i} className="text-sm font-bold text-white/60">{tech}</span>
            ))}
          </motion.div>
        </div>

        {/* RIGHT: Neural Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex items-center justify-center lg:justify-end"
        >
          <NeuralCore />
        </motion.div>

      </div>
    </div>
  );
}