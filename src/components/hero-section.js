'use client';

import dynamic from 'next/dynamic';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { FiArrowRight, FiBookOpen, FiCpu, FiZap, FiShield } from 'react-icons/fi';

// 1. Dynamic Import (Crucial for Next.js + Three.js)
const HeroScene = dynamic(() => import('./HeroScene'), { 
  ssr: false,
  loading: () => <div className="w-full h-full flex items-center justify-center opacity-20"><div className="w-8 h-8 border-2 border-t-purple-500 rounded-full animate-spin"></div></div>
});

// 2. Variants
const textVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, y: 0, 
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } 
  }
};

// 3. Neural Background (Pure SVG/CSS - Safe for main thread)
const NeuralBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
    {/* Ambient Glows */}
    <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-[#7C3AED]/10 rounded-full blur-[180px] mix-blend-screen" />
    <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-[#8B5CF6]/5 rounded-full blur-[180px] mix-blend-screen" />
    
    {/* SVG Pattern */}
    <svg className="absolute inset-0 w-full h-full opacity-[0.15]" xmlns="http://www.w3.org/2000/svg">
      <pattern id="neural-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
        <circle cx="50" cy="50" r="1" fill="#8B5CF6" className="animate-pulse"/>
        <path d="M50 50L150 50" stroke="#8B5CF6" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5"/>
        <path d="M50 50L50 150" stroke="#8B5CF6" strokeWidth="0.5" strokeDasharray="2 4" opacity="0.5"/>
      </pattern>
      <rect x="0" y="0" width="100%" height="100%" fill="url(#neural-pattern)" />
    </svg>
    
    {/* Noise Overlay */}
    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.04] mix-blend-overlay"></div>
  </div>
);

export default function HeroSection() {
  return (
    <section className="relative min-h-screen w-full flex items-center bg-[#0A0A0B] text-white overflow-hidden selection:bg-[#8B5CF6] selection:text-white">
      
      {/* Layer 1: Background */}
      <NeuralBackground />

      <div className="relative z-10 max-w-[90rem] w-full mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-20 lg:py-0">
        
        {/* --- LEFT COLUMN: Content --- */}
        <motion.div 
          initial="hidden"
          animate="visible"
          transition={{ staggerChildren: 0.2, delayChildren: 0.3 }}
          className="flex flex-col items-center lg:items-start text-center lg:text-left space-y-8 order-2 lg:order-1"
        >
          {/* Badge */}
          <motion.div variants={textVariants}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 backdrop-blur-md mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-[#C4B5FD] tracking-widest uppercase">AI Portfolio Engine v2.0</span>
            </div>
          </motion.div>

          {/* Headline */}
          <motion.h1 variants={textVariants} className="text-5xl lg:text-7xl font-black tracking-tighter leading-[1.1]">
            Master Your <br className="hidden lg:block"/> Crypto Universe <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#C4B5FD] to-white">
              With Precision AI.
            </span>
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={textVariants} className="text-lg text-white/60 max-w-xl leading-relaxed font-medium">
            Navigating DeFi requires more than human intuition. Portly delivers real-time tracking, intelligent risk analysis, and institutional-grade security insights.
          </motion.p>

          {/* Buttons */}
          <motion.div variants={textVariants} className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto pt-4">
            <Link href="/ai" className="w-full sm:w-auto group perspective-500">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="relative w-full sm:w-auto px-8 py-4 bg-[#8B5CF6] hover:bg-[#7C3AED] rounded-xl flex items-center justify-center gap-3 text-white font-bold text-lg transition-all shadow-[0_10px_30px_-10px_rgba(139,92,246,0.5)]"
              >
                <FiCpu className="text-white/90 group-hover:animate-pulse" />
                <span>Launch Agent</span>
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>

            <a href="https://docs.portly.ai" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto group">
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.08)' }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto px-8 py-4 rounded-xl border-2 border-white/10 bg-transparent backdrop-blur-md flex items-center justify-center gap-3 text-white font-medium text-lg transition-all"
              >
                <FiBookOpen className="text-white/60 group-hover:text-white transition-colors" />
                <span>Documentation</span>
              </motion.button>
            </a>
          </motion.div>

          {/* Trust */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="pt-8 flex items-center gap-6 text-white/30 text-xs font-medium uppercase tracking-widest"
          >
            <span>Powered By</span>
            <div className="h-1 w-1 bg-white/20 rounded-full"></div>
            <span className="flex items-center gap-2 hover:text-white/60 transition-colors"><FiZap /> Alchemy</span>
            <span className="flex items-center gap-2 hover:text-white/60 transition-colors"><FiShield /> Moralis</span>
          </motion.div>
        </motion.div>

        {/* --- RIGHT COLUMN: 3D AI Core --- */}
        <motion.div 
           initial={{ opacity: 0, scale: 0.9 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 1.5, ease: "easeOut" }}
           className="order-1 lg:order-2 w-full h-[500px] lg:h-[700px] relative flex justify-center items-center"
        >
          {/* Lazy Loaded 3D Scene */}
          <HeroScene />
          
          {/* Back Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-[#8B5CF6] rounded-full blur-[150px] opacity-20 -z-10 mix-blend-screen pointer-events-none"></div>
        </motion.div>

      </div>
    </section>
  );
}