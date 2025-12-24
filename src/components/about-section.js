"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { 
  BrainCircuit, 
  Wallet, 
  Trophy, 
  ShieldAlert, 
  Layers, 
  ArrowUpRight,
  Cpu,
  Zap
} from "lucide-react";

// --- UTILS: MOUSE SPOTLIGHT EFFECT ---
const SpotlightCard = ({ children, className = "", delay = 0 }) => {
  const divRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isInView = useInView(divRef, { once: true, margin: "-50px" });

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div
      ref={divRef}
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{ duration: 0.6, delay }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsFocused(true)}
      onMouseLeave={() => setIsFocused(false)}
      className={`relative overflow-hidden rounded-3xl bg-[#121214]/40 border border-[#C4B5FD]/10 backdrop-blur-md group ${className}`}
    >
      {/* Spotlight Gradient */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
        }}
      />
      {/* Border Highlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(167, 139, 250, 0.3), transparent 40%)`,
        }}
        aria-hidden="true"
      />
      
      <div className="relative h-full">{children}</div>
    </motion.div>
  );
};

export default function AboutSection() {
  return (
    <section className="relative w-full py-24 px-4 bg-[#0A0A0B] overflow-hidden" id="features">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#7C3AED] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#8B5CF6] opacity-[0.03] blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-[#1E1E24] border border-[#C4B5FD]/20"
          >
            <span className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse" />
            <span className="text-xs font-semibold tracking-widest text-[#A78BFA] uppercase">
              The Portly Ecosystem
            </span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            More Than Just <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6]">
              Portfolio Tracking.
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#9CA3AF] text-lg leading-relaxed"
          >
            Portly combines institutional-grade analytics with gamified rewards. 
            Connect any wallet, visualize complex data, and earn while you trade.
          </motion.p>
        </div>

        {/* BENTO GRID LAYOUT */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
          
          {/* Card 1: AI Engine (Large, spans 2 cols on desktop) */}
          <SpotlightCard className="md:col-span-2 p-8 flex flex-col justify-between overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
              <BrainCircuit size={180} className="text-[#8B5CF6] -rotate-12 translate-x-10 -translate-y-10" />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center mb-6 border border-[#8B5CF6]/20">
                <Cpu className="text-[#A78BFA]" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Sentient AI Engine</h3>
              <p className="text-[#9CA3AF] max-w-md">
                Our proprietary AI doesn't just display data; it interprets it. Get instant risk analysis, diversification scores, and predictive market insights through a conversational interface.
              </p>
            </div>

            {/* Visual Element inside Card */}
            <div className="mt-8 flex gap-3">
              <div className="px-4 py-2 rounded-lg bg-[#1E1E24] border border-[#C4B5FD]/10 text-xs text-[#A78BFA] flex items-center gap-2">
                <Zap size={12} className="text-[#F59E0B]" /> High Volatility Detected
              </div>
              <div className="px-4 py-2 rounded-lg bg-[#1E1E24] border border-[#C4B5FD]/10 text-xs text-[#10B981] flex items-center gap-2">
                <ShieldAlert size={12} /> Audit Score: 98/100
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Multi-Chain (Tall) */}
          <SpotlightCard className="md:col-span-1 row-span-2 p-8 flex flex-col relative" delay={0.2}>
             <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center mb-6 border border-[#8B5CF6]/20">
                <Layers className="text-[#A78BFA]" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Multi-Chain Unification</h3>
              <p className="text-[#9CA3AF] mb-8 text-sm">
                Stop switching networks. View your Ethereum, BSC, Polygon, and Solana assets in one 3D command center.
              </p>
              
              {/* Visual Chain List */}
              <div className="flex-1 space-y-3">
                {['Ethereum', 'Polygon', 'Binance Smart Chain', 'Solana'].map((chain, i) => (
                  <div key={chain} className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0B]/50 border border-white/5 hover:border-[#8B5CF6]/30 transition-colors cursor-default group/item">
                    <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors">{chain}</span>
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#10B981]' : 'bg-[#8B5CF6]'} shadow-[0_0_8px_currentColor]`} />
                  </div>
                ))}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#121214] to-transparent pointer-events-none" />
          </SpotlightCard>

          {/* Card 3: Gamification (Square) */}
          <SpotlightCard className="p-8 flex flex-col justify-between" delay={0.3}>
             <div>
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center mb-6 border border-[#F59E0B]/20">
                  <Trophy className="text-[#F59E0B]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Earn While You Track</h3>
                <p className="text-[#9CA3AF] text-sm">
                  Complete missions in the Task Center to earn native $PTLY tokens.
                </p>
             </div>
             <div className="mt-4 flex items-center gap-2 text-white font-mono text-sm">
                <span className="text-[#F59E0B] font-bold">+500 PTLY</span> Awarded
             </div>
          </SpotlightCard>

          {/* Card 4: Real-time Sync (Square) */}
          <SpotlightCard className="p-8 flex flex-col justify-between" delay={0.4}>
             <div>
                <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-6 border border-[#10B981]/20">
                  <Wallet className="text-[#10B981]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Real-Time Sync</h3>
                <p className="text-[#9CA3AF] text-sm">
                  WebSockets ensure your balance updates the second a block is confirmed.
                </p>
             </div>
             <div className="mt-4 flex items-center gap-2 text-[#10B981] text-xs font-bold uppercase tracking-wider">
               <div className="w-2 h-2 bg-[#10B981] rounded-full animate-ping" />
               Live Connection
             </div>
          </SpotlightCard>

        </div>
        
        {/* Bottom CTA Text */}
        <div className="mt-12 text-center">
            <a href="#features" className="inline-flex items-center gap-2 text-[#A78BFA] hover:text-white transition-colors text-sm font-semibold group">
                Explore all features <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
        </div>

      </div>
    </section>
  );
}