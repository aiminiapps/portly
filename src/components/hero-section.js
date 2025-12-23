'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { 
  FiArrowRight, FiPlay, FiCpu, FiShield, FiZap, 
  FiActivity, FiArrowDown, FiCommand 
} from 'react-icons/fi';
import { SiEthereum, SiBinance, SiPolygon } from 'react-icons/si';

// --- CONFIGURATION ---
const NODES = [
  { id: 1, label: 'Ethereum', sub: 'Risk: Low', x: '15%', y: '25%', delay: 0 },
  { id: 2, label: 'Arbitrum', sub: 'Yield: 12%', x: '85%', y: '30%', delay: 1.5 },
  { id: 3, label: 'Optimism', sub: 'Trend: Up', x: '10%', y: '65%', delay: 0.5 },
  { id: 4, label: 'Solana', sub: 'Vol: High', x: '90%', y: '70%', delay: 2 },
];

// --- ANIMATION VARIANTS ---
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
};

const beamVariant = {
  hidden: { pathLength: 0, opacity: 0 },
  visible: { 
    pathLength: 1, 
    opacity: 0.4,
    transition: { duration: 1.5, ease: "easeInOut" }
  }
};

// --- COMPONENTS ---

const GlowingNode = ({ x, y, label, sub, delay }) => (
  <motion.div 
    className="absolute z-20 flex flex-col items-center"
    style={{ left: x, top: y }}
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay: 0.5 + delay, duration: 0.5 }}
  >
    <motion.div 
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay }}
      className="relative group cursor-default"
    >
      <div className="absolute -inset-4 bg-[#8B5CF6]/20 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="relative flex items-center gap-3 bg-[#0A0A0B]/80 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full shadow-2xl">
        <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></div>
        <div className="text-left">
          <p className="text-xs font-bold text-white leading-none">{label}</p>
          <p className="text-[9px] text-white/50 leading-none mt-1 font-mono">{sub}</p>
        </div>
      </div>
      
      {/* Decorative dot on connector */}
      <div className="absolute top-1/2 -translate-y-1/2 -z-10 w-2 h-2 bg-white rounded-full opacity-20"></div>
    </motion.div>
  </motion.div>
);

const ConnectionBeams = () => {
  // SVG Lines connecting center (50% 50%) to nodes
  // Coordinates must match NODES x/y approximately
  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <defs>
        <linearGradient id="beamGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0" />
          <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
        </linearGradient>
      </defs>
      
      {/* Paths to nodes */}
      <motion.path d="M 50% 50% C 30% 50%, 30% 25%, 15% 25%" fill="none" stroke="url(#beamGrad)" strokeWidth="1" variants={beamVariant} initial="hidden" animate="visible" />
      <motion.path d="M 50% 50% C 70% 50%, 70% 30%, 85% 30%" fill="none" stroke="url(#beamGrad)" strokeWidth="1" variants={beamVariant} initial="hidden" animate="visible" />
      <motion.path d="M 50% 50% C 30% 50%, 30% 65%, 10% 65%" fill="none" stroke="url(#beamGrad)" strokeWidth="1" variants={beamVariant} initial="hidden" animate="visible" />
      <motion.path d="M 50% 50% C 70% 50%, 70% 70%, 90% 70%" fill="none" stroke="url(#beamGrad)" strokeWidth="1" variants={beamVariant} initial="hidden" animate="visible" />

      {/* Moving Particles on paths */}
      {[1, 2, 3, 4].map((i) => (
        <motion.circle key={i} r="2" fill="#fff">
          <animateMotion 
            dur={`${4 + i}s`} 
            repeatCount="indefinite" 
            path={
              i===1 ? "M 50% 50% C 30% 50%, 30% 25%, 15% 25%" :
              i===2 ? "M 50% 50% C 70% 50%, 70% 30%, 85% 30%" :
              i===3 ? "M 50% 50% C 30% 50%, 30% 65%, 10% 65%" :
              "M 50% 50% C 70% 50%, 70% 70%, 90% 70%"
            } 
          />
        </motion.circle>
      ))}
    </svg>
  );
};

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#050505] text-white selection:bg-[#8B5CF6] selection:text-white">
      
      {/* --- LAYER 1: ATMOSPHERE --- */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] bg-radial-gradient from-[#8B5CF6]/10 to-transparent blur-[120px]" />
        {/* Grain */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04]"></div>
        {/* Vignette */}
        <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#050505]/50 to-[#050505]" />
      </div>

      {/* --- LAYER 2: CONNECTING BEAMS --- */}
      <ConnectionBeams />

      {/* --- LAYER 3: FLOATING NODES --- */}
      {NODES.map((node) => (
        <GlowingNode key={node.id} {...node} />
      ))}

      {/* --- LAYER 4: MAIN CONTENT --- */}
      <div className="relative z-30 max-w-5xl mx-auto px-6 flex flex-col items-center text-center space-y-10">
        
        {/* Top Play Button */}
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-12 h-12 rounded-full bg-white/5 border border-white/10 backdrop-blur-md flex items-center justify-center group hover:scale-110 transition-transform"
        >
          <FiPlay className="w-4 h-4 text-white fill-white ml-1 opacity-60 group-hover:opacity-100" />
        </motion.button>

        {/* Badge */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible" className="relative">
          <div className="absolute -inset-1 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full blur opacity-20"></div>
          <button className="relative px-5 py-1.5 rounded-full bg-[#0A0A0B] border border-white/10 flex items-center gap-2 hover:border-white/20 transition-colors group">
            <FiZap className="w-3 h-3 text-[#8B5CF6] group-hover:animate-pulse" />
            <span className="text-xs font-medium text-white/80">Unlock Your Assets' Potential</span>
            <FiArrowRight className="w-3 h-3 text-white/40 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>

        {/* Headline */}
        <motion.div variants={fadeUp} initial="hidden" animate="visible">
          <h1 className="text-6xl md:text-8xl font-medium tracking-tight leading-[0.95] mb-6">
            One-Click For <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/40">
              Asset Defense
            </span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto font-light leading-relaxed">
            Dive into the art of assets, where innovative blockchain technology meets intelligent financial expertise.
          </p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          variants={fadeUp} 
          initial="hidden" 
          animate="visible"
          className="flex items-center gap-4 pt-4"
        >
          {/* Primary Button */}
          <a href="/ai" className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] rounded-full blur opacity-40 group-hover:opacity-70 transition duration-300"></div>
            <button className="relative px-8 py-3.5 bg-[#121214] rounded-full flex items-center gap-2 text-sm font-bold text-white hover:bg-[#1A1A1E] transition-colors">
              Launch Agent <FiArrowRight className="group-hover:-rotate-45 transition-transform duration-300" />
            </button>
          </a>

          {/* Secondary Button */}
          <a href="https://docs.portly.ai" target="_blank" rel="noreferrer">
            <button className="px-8 py-3.5 rounded-full bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Discover More
            </button>
          </a>
        </motion.div>

      </div>

      {/* --- LAYER 5: BOTTOM UI --- */}
      
      {/* Scroll Indicator */}
      <motion.div 
        initial={{ opacity: 0, x: -20 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 left-10 hidden md:flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/5 backdrop-blur-md"
      >
        <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center">
          <FiArrowDown className="text-black w-3 h-3" />
        </div>
        <span className="text-xs text-white/50 font-mono">01 / Scroll down</span>
      </motion.div>

      {/* Trust Bar (Faded Logos) */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6"
      >
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
           {/* Replaced with text/icons for stability, can swap for SVGs */}
           <div className="flex items-center gap-2 font-bold text-lg"><FiShield /> Vercel</div>
           <div className="flex items-center gap-2 font-bold text-lg"><FiCpu /> Loom</div>
           <div className="flex items-center gap-2 font-bold text-lg"><FiZap /> CashApp</div>
           <div className="flex items-center gap-2 font-bold text-lg"><FiActivity /> Loops</div>
           <div className="flex items-center gap-2 font-bold text-lg"><FiCommand /> Raycast</div>
        </div>
      </motion.div>

      {/* Right Side Status (DeFi Horizons) */}
      <motion.div 
        initial={{ opacity: 0, x: 20 }} 
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-10 right-10 hidden md:block text-right"
      >
        <p className="text-xs text-[#E5B96E] font-medium mb-2">DeFi Horizons</p>
        <div className="flex gap-1.5 justify-end">
          <div className="w-8 h-1 bg-white rounded-full"></div>
          <div className="w-8 h-1 bg-white/20 rounded-full"></div>
          <div className="w-8 h-1 bg-white/20 rounded-full"></div>
        </div>
      </motion.div>

    </section>
  );
}