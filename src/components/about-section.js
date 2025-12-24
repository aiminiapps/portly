"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { 
  RiBrainLine, 
  RiWallet3Line, 
  RiTrophyLine, 
  RiShieldCheckLine, 
  RiStackLine, 
  RiArrowRightUpLine,
  RiCpuLine,
  RiFlashlightFill
} from "react-icons/ri";

// --- SVG ANIMATION COMPONENTS ---

// 1. AI Engine Workflow: Data converging into a central processing unit
const AiWorkflowBg = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400">
    <defs>
      <radialGradient id="aiPulse" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
      </radialGradient>
      <filter id="glow">
        <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
        <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
      </filter>
    </defs>
    
    {/* Central Brain Pulse */}
    <circle cx="400" cy="200" r="40" fill="url(#aiPulse)">
      <animate attributeName="r" values="30;50;30" dur="4s" repeatCount="indefinite" />
      <animate attributeName="opacity" values="0.5;0.8;0.5" dur="4s" repeatCount="indefinite" />
    </circle>
    
    {/* Converging Data Lines connecting to center */}
    <g fill="none" stroke="#A78BFA" strokeWidth="1" filter="url(#glow)" opacity="0.4">
      <path d="M0,50 Q200,50 400,200" />
      <path d="M0,350 Q200,350 400,200" />
      <path d="M800,50 Q600,50 400,200" />
      <path d="M800,350 Q600,350 400,200" />
    </g>

    {/* Moving Data Packets along the lines */}
    <g fill="#C4B5FD">
      <circle r="3">
        <animateMotion dur="6s" repeatCount="indefinite" path="M0,50 Q200,50 400,200" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
      </circle>
       <circle r="3">
        <animateMotion dur="7s" begin="1s" repeatCount="indefinite" path="M0,350 Q200,350 400,200" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
      </circle>
       <circle r="3">
        <animateMotion dur="5s" begin="0.5s" repeatCount="indefinite" path="M800,50 Q600,50 400,200" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
      </circle>
       <circle r="3">
        <animateMotion dur="6.5s" begin="2s" repeatCount="indefinite" path="M800,350 Q600,350 400,200" keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
      </circle>
    </g>
  </svg>
);

// 2. Multi-Chain Workflow: Explicit inputs merging into one stream
const MultiChainBg = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" preserveAspectRatio="none">
    <defs>
       <linearGradient id="chainMerge" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#A78BFA" stopOpacity="0"/>
        <stop offset="50%" stopColor="#8B5CF6" stopOpacity="0.8"/>
        <stop offset="100%" stopColor="#22D3EE" stopOpacity="1"/>
      </linearGradient>
    </defs>

    {/* Vertical Chain Lines Input */}
    <g fill="none" strokeDasharray="4,4" strokeOpacity="0.3">
      {/* Chain 1 (ETH - Blueish) */}
      <line x1="100" y1="0" x2="100" y2="450" stroke="#60A5FA" strokeWidth="2" />
      {/* Chain 2 (BSC - Yellowish) */}
      <line x1="200" y1="0" x2="200" y2="450" stroke="#FBBF24" strokeWidth="2" />
       {/* Chain 3 (Poly - Purple) */}
      <line x1="300" y1="0" x2="300" y2="450" stroke="#A78BFA" strokeWidth="2" />
    </g>

    {/* Merging Horizontal Line Output */}
    <path d="M50,500 L350,500" stroke="url(#chainMerge)" strokeWidth="4" fill="none" filter="url(#glow)" />

    {/* Falling Data Packets */}
    <g>
       <rect width="4" height="15" fill="#60A5FA" x="98">
         <animate attributeName="y" from="-20" to="480" dur="3s" repeatCount="indefinite" calcMode="linear"/>
         <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.9;1" dur="3s" repeatCount="indefinite"/>
       </rect>
       <rect width="4" height="15" fill="#FBBF24" x="198">
         <animate attributeName="y" from="-20" to="480" dur="4s" begin="1s" repeatCount="indefinite" calcMode="linear"/>
         <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.9;1" dur="4s" repeatCount="indefinite"/>
       </rect>
       <rect width="4" height="15" fill="#A78BFA" x="298">
         <animate attributeName="y" from="-20" to="480" dur="2.5s" begin="0.5s" repeatCount="indefinite" calcMode="linear"/>
         <animate attributeName="opacity" values="1;1;0" keyTimes="0;0.9;1" dur="2.5s" repeatCount="indefinite"/>
       </rect>
    </g>

    {/* Flowing Output Packet */}
    <rect width="30" height="4" fill="#22D3EE" y="498">
        <animate attributeName="x" from="50" to="350" dur="2s" repeatCount="indefinite" calcMode="linear" />
        <animate attributeName="opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
    </rect>
  </svg>
);

// 3. Gamification Workflow: A path towards rewards
const GamificationBg = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      {/* The Reward Path */}
      <path id="rewardPath" d="M-20,350 C100,300 150,100 350,50" fill="none" stroke="#F59E0B" strokeWidth="2" strokeDasharray="8,6" strokeOpacity="0.3" />
      
      {/* Checkpoints along the path */}
      <circle cx="120" cy="260" r="5" fill="#F59E0B" opacity="0.5" />
      <circle cx="230" cy="120" r="5" fill="#F59E0B" opacity="0.5" />

      {/* Moving Player/Token */}
      <circle r="8" fill="#FCD34D" filter="url(#glow)">
         <animateMotion dur="5s" repeatCount="indefinite" path="M-20,350 C100,300 150,100 350,50" calcMode="linear" keyPoints="0;1" keyTimes="0;1" >
         </animateMotion>
         {/* Pulse effect on the moving token */}
         <animate attributeName="r" values="6;10;6" dur="1s" repeatCount="indefinite" />
      </circle>
    </svg>
);

// 4. Real-Time Sync Workflow: Fast, opposing data streams
const RealTimeSyncBg = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400">
      {/* Connection Hubs */}
      <circle cx="50" cy="200" r="30" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.5">
        <animate attributeName="r" values="30;35;30" dur="2s" repeatCount="indefinite"/>
        <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite"/>
      </circle>
      <circle cx="350" cy="200" r="30" fill="none" stroke="#10B981" strokeWidth="2" opacity="0.5">
         <animate attributeName="r" values="30;35;30" dur="2s" repeatCount="indefinite" begin="1s"/>
         <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" begin="1s"/>
      </circle>

      {/* High Speed Data Lines */}
      <line x1="80" y1="190" x2="320" y2="190" stroke="#10B981" strokeWidth="1" strokeOpacity="0.3" />
      <line x1="80" y1="210" x2="320" y2="210" stroke="#10B981" strokeWidth="1" strokeOpacity="0.3" />

      {/* Rapid Data Packets moving Left to Right */}
      <rect x="80" y="188" width="20" height="4" fill="#34D399" filter="url(#glow)">
        <animate attributeName="x" values="80;320" dur="1s" repeatCount="indefinite" calcMode="linear" />
         <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="1s" repeatCount="indefinite" />
      </rect>
       <rect x="80" y="188" width="20" height="4" fill="#34D399" filter="url(#glow)">
        <animate attributeName="x" values="80;320" dur="0.8s" begin="0.3s" repeatCount="indefinite" calcMode="linear" />
         <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="0.8s" repeatCount="indefinite" />
      </rect>
      
      {/* Rapid Data Packets moving Right to Left */}
       <rect x="320" y="208" width="20" height="4" fill="#34D399" filter="url(#glow)">
        <animate attributeName="x" values="320;80" dur="1.2s" repeatCount="indefinite" calcMode="linear" />
        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="1.2s" repeatCount="indefinite" />
      </rect>
    </svg>
);


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
      // Added 'relative overflow-hidden' to ensure SVGs stay contained
      className={`relative overflow-hidden rounded-3xl bg-[#121214]/40 border border-[#C4B5FD]/10 backdrop-blur-md group ${className}`}
    >
      {/* Spotlight Gradient */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-20"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(139, 92, 246, 0.15), transparent 40%)`,
        }}
      />
      {/* Border Highlight */}
      <div
        className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-20"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, rgba(167, 139, 250, 0.3), transparent 40%)`,
        }}
        aria-hidden="true"
      />
      
      {/* Content z-index raised to sit above SVGs */}
      <div className="relative h-full z-10">{children}</div>
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
        
        {/* Section Header - Unchanged */}
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
          
          {/* Card 1: AI Engine - Added AiWorkflowBg */}
          <SpotlightCard className="md:col-span-2 p-8 flex flex-col justify-between overflow-hidden group">
            {/* The new live SVG workflow background */}
            <AiWorkflowBg />

            <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity duration-500 z-0">
              <RiBrainLine size={180} className="text-[#8B5CF6] -rotate-12 translate-x-10 -translate-y-10" />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center mb-6 border border-[#8B5CF6]/20">
                <RiCpuLine className="text-[#A78BFA]" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">Sentient AI Engine</h3>
              <p className="text-[#9CA3AF] max-w-md">
                Our proprietary AI doesn't just display data; it interprets it. Get instant risk analysis, diversification scores, and predictive market insights through a conversational interface.
              </p>
            </div>

            <div className="mt-8 flex gap-3 relative z-10">
              <div className="px-4 py-2 rounded-lg bg-[#1E1E24]/80 border border-[#C4B5FD]/10 text-xs text-[#A78BFA] flex items-center gap-2 backdrop-blur-sm">
                <RiFlashlightFill size={12} className="text-[#F59E0B]" /> High Volatility Detected
              </div>
              <div className="px-4 py-2 rounded-lg bg-[#1E1E24]/80 border border-[#C4B5FD]/10 text-xs text-[#10B981] flex items-center gap-2 backdrop-blur-sm">
                <RiShieldCheckLine size={12} /> Audit Score: 98/100
              </div>
            </div>
          </SpotlightCard>

          {/* Card 2: Multi-Chain - Added MultiChainBg */}
          <SpotlightCard className="md:col-span-1 row-span-2 p-8 flex flex-col relative" delay={0.2}>
             {/* The new live SVG workflow background */}
             <MultiChainBg />

             <div className="w-12 h-12 rounded-xl bg-[#8B5CF6]/10 flex items-center justify-center mb-6 border border-[#8B5CF6]/20 relative z-10">
                <RiStackLine className="text-[#A78BFA]" size={24} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 relative z-10">Multi-Chain Unification</h3>
              <p className="text-[#9CA3AF] mb-8 text-sm relative z-10">
                Stop switching networks. View your Ethereum, BSC, Polygon, and Solana assets in one 3D command center.
              </p>
              
              <div className="flex-1 space-y-3 relative z-10">
                {['Ethereum', 'Polygon', 'Binance Smart Chain', 'Solana'].map((chain, i) => (
                  <div key={chain} className="flex items-center justify-between p-3 rounded-lg bg-[#0A0A0B]/50 border border-white/5 hover:border-[#8B5CF6]/30 transition-colors cursor-default group/item backdrop-blur-sm">
                    <span className="text-sm text-gray-300 group-hover/item:text-white transition-colors">{chain}</span>
                    <div className={`w-2 h-2 rounded-full ${i === 0 ? 'bg-[#10B981]' : 'bg-[#8B5CF6]'} shadow-[0_0_8px_currentColor]`} />
                  </div>
                ))}
              </div>
              
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#121214] to-transparent pointer-events-none z-10" />
          </SpotlightCard>

          {/* Card 3: Gamification - Added GamificationBg */}
          <SpotlightCard className="p-8 flex flex-col justify-between" delay={0.3}>
             {/* The new live SVG workflow background */}
             <GamificationBg />
             <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-[#F59E0B]/10 flex items-center justify-center mb-6 border border-[#F59E0B]/20">
                  <RiTrophyLine className="text-[#F59E0B]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Earn While You Track</h3>
                <p className="text-[#9CA3AF] text-sm">
                  Complete missions in the Task Center to earn native $PTLY tokens.
                </p>
             </div>
             <div className="mt-4 flex items-center gap-2 text-white font-mono text-sm relative z-10">
                <span className="text-[#F59E0B] font-bold">+500 PTLY</span> Awarded
             </div>
          </SpotlightCard>

          {/* Card 4: Real-time Sync - Added RealTimeSyncBg */}
          <SpotlightCard className="p-8 flex flex-col justify-between" delay={0.4}>
             {/* The new live SVG workflow background */}
             <RealTimeSyncBg />
             <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-[#10B981]/10 flex items-center justify-center mb-6 border border-[#10B981]/20">
                  <RiWallet3Line className="text-[#10B981]" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Real-Time Sync</h3>
                <p className="text-[#9CA3AF] text-sm">
                  WebSockets ensure your balance updates the second a block is confirmed.
                </p>
             </div>
             <div className="mt-4 flex items-center gap-2 text-[#10B981] text-xs font-bold uppercase tracking-wider relative z-10">
               <div className="w-2 h-2 bg-[#10B981] rounded-full animate-ping" />
               Live Connection
             </div>
          </SpotlightCard>

        </div>
        
        {/* Bottom CTA Text - Unchanged */}
        <div className="mt-12 text-center relative z-10">
            <a href="#features" className="inline-flex items-center gap-2 text-[#A78BFA] hover:text-white transition-colors text-sm font-semibold group">
                Explore all features 
                <RiArrowRightUpLine className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </a>
        </div>

      </div>
    </section>
  );
}