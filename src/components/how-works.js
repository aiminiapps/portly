"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import {
  FaWallet,
  FaFingerprint,
  FaRetweet,
  FaHeart,
  FaCheck
} from "react-icons/fa";
import { RiBrainLine, RiDonutChartFill, RiCpuLine } from "react-icons/ri";
import { BsLightningChargeFill, BsStars, BsShieldCheck, BsActivity } from "react-icons/bs";
import { BiNetworkChart, BiCopy } from "react-icons/bi";
import { BsTwitterX } from "react-icons/bs";

// --- 1. ENHANCED SIMULATION CARDS ---

// CARD 1: WALLET CONNECT (Secure Identity Layer)
const WalletCard = () => {
  return (
    <div className="relative w-full h-72 rounded-3xl bg-[#09090b] border border-white/5 overflow-hidden flex flex-col items-center justify-center shadow-2xl group transition-all duration-700 hover:border-[#8B5CF6]/30">
      {/* Ambient Glow - Subtle */}
      <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#8B5CF608,_transparent_70%)] pointer-events-none" />

      {/* Main Interface */}
      <div className="relative z-10 w-full max-w-[300px] flex flex-col gap-4">
        
        {/* Connection Status Badge */}
        <div className="flex justify-center mb-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#8B5CF6]/5 border border-[#8B5CF6]/10 backdrop-blur-md">
                <div className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981] animate-pulse" />
                <span className="text-[10px] font-mono text-[#A78BFA] tracking-widest uppercase">Secure Gateway</span>
            </div>
        </div>

        {/* Wallet Card Surface */}
        <div className="bg-[#121214] rounded-2xl border border-white/5 p-5 relative overflow-hidden">
            {/* Top Row */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E1E24] to-[#0E0E10] border border-white/5 flex items-center justify-center text-[#F59E0B]">
                        <FaWallet className="drop-shadow-lg" />
                    </div>
                    <div>
                        <div className="text-sm font-semibold text-white tracking-tight">MetaMask</div>
                        <div className="text-[10px] text-[#6B7280] font-mono flex items-center gap-1">
                            0x71C...9A2 <BiCopy className="hover:text-white cursor-pointer transition-colors" />
                        </div>
                    </div>
                </div>
                <div className="px-2 py-1 rounded-md bg-[#18181B] border border-white/5 text-[9px] font-mono text-[#9CA3AF]">
                    BSC
                </div>
            </div>

            {/* Biometric Scan Animation area */}
            <div className="relative h-14 bg-[#0A0A0B] rounded-lg border border-white/5 flex items-center justify-between px-4 overflow-hidden">
                <div className="flex items-center gap-3 relative z-10">
                    <FaFingerprint className="text-[#8B5CF6] text-lg" />
                    <div className="flex flex-col">
                        <span className="text-[10px] text-[#9CA3AF]">Verifying Credentials</span>
                        <span className="text-[10px] text-[#A78BFA] font-mono">2ms latency</span>
                    </div>
                </div>
                
                {/* Subtle Scan Line */}
                <motion.div 
                    className="absolute inset-y-0 w-px bg-gradient-to-b from-transparent via-[#8B5CF6] to-transparent shadow-[0_0_15px_#8B5CF6]"
                    animate={{ left: ["0%", "100%"] }}
                    transition={{ duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 0.5 }}
                />
            </div>
        </div>

        {/* Footer info */}
        <div className="flex justify-between px-2">
            <span className="text-[10px] text-[#52525B]">Protocol</span>
            <span className="text-[10px] text-[#52525B] font-mono">TLS 1.3 / E2EE</span>
        </div>

      </div>
    </div>
  );
};

// CARD 2: AI DASHBOARD (Data Density & Precision)
const AnalysisCard = () => {
  // Generate static data for the "wave" look
  const bars = [20, 40, 35, 50, 65, 45, 70, 85, 60, 75, 50, 90, 65, 40, 30];

  return (
    <div className="relative w-full h-72 rounded-3xl bg-[#09090b] border border-white/5 overflow-hidden flex flex-col p-6 shadow-2xl group hover:border-[#8B5CF6]/30 transition-all duration-700">
       {/* Fine Grid Background */}
       <div className="absolute inset-0 opacity-[0.03]" 
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} 
       />
       
       {/* Header */}
       <div className="relative z-10 flex justify-between items-start mb-6">
          <div className="flex items-center gap-2.5">
             <div className="p-1.5 rounded bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
                 <RiBrainLine className="text-[#A78BFA] text-sm" />
             </div>
             <div>
                <div className="text-xs font-bold text-white tracking-wide">AI_AGENT</div>
                <div className="text-[9px] text-gray-500 font-mono">V.2.0.4 LIVE SCAN</div>
             </div>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#10B981] bg-[#10B981]/5 px-2 py-1 rounded border border-[#10B981]/10">
            <div className="w-1 h-1 rounded-full bg-[#10B981] animate-pulse" />
            Active
          </div>
       </div>

       {/* Visualization Area */}
       <div className="flex-1 relative flex items-end gap-[3px] mb-5 border-b border-white/5 pb-1">
          {bars.map((h, i) => (
             <motion.div 
                key={i}
                className="flex-1 rounded-t-sm bg-[#27272A]" // Inactive color
                initial={{ height: "10%" }}
                whileInView={{ height: `${h}%`, backgroundColor: i > 8 ? "#8B5CF6" : "#27272A" }} // Highlight active/high zones
                transition={{ duration: 1, delay: i * 0.03 }}
             >
                {/* Highlight top edge for luxury feel */}
                <div className="w-full h-[1px] bg-white/20" />
             </motion.div>
          ))}
          
          {/* Floating Data Tag */}
          <motion.div 
            className="absolute top-4 right-4 bg-[#18181B]/90 backdrop-blur border border-white/10 p-2 rounded shadow-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
             <div className="flex items-center gap-2 mb-1">
                <BiNetworkChart className="text-[#A78BFA] text-xs" />
                <span className="text-[9px] text-white font-bold">PATTERN MATCH</span>
             </div>
             <div className="text-xs font-mono text-[#9CA3AF]">
                Bullish Div.
             </div>
          </motion.div>
       </div>

       {/* Metrics Footer */}
       <div className="relative z-10 grid grid-cols-2 gap-3">
          <div className="bg-[#18181B] p-2.5 rounded border border-white/5 flex flex-col gap-1">
             <div className="flex justify-between items-center text-[9px] text-[#71717A] uppercase tracking-wider">
                Risk Score <BsShieldCheck className="text-[#10B981]" />
             </div>
             <div className="text-sm font-mono font-medium text-white">
                98<span className="text-[#52525B]">/100</span>
             </div>
          </div>
          <div className="bg-[#18181B] p-2.5 rounded border border-white/5 flex flex-col gap-1">
             <div className="flex justify-between items-center text-[9px] text-[#71717A] uppercase tracking-wider">
                Assets <RiCpuLine className="text-[#A78BFA]" />
             </div>
             <div className="text-sm font-mono font-medium text-white">
                3 Found
             </div>
          </div>
       </div>
    </div>
  );
};

// CARD 3: SOCIAL REWARDS (Smooth Transition & Feedback)
const RewardCard = () => {
  return (
    <div className="relative w-full h-72 rounded-3xl bg-[#09090b] border border-white/5 overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl group hover:border-[#8B5CF6]/30 transition-all duration-700">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_#F59E0B08,_transparent_50%)]" />

       {/* Task Container */}
       <div className="w-full max-w-[280px] relative">
          
          {/* Animated Task Card */}
          <motion.div 
             className="w-full bg-[#18181B] rounded-xl border border-white/5 p-4 relative z-10 overflow-hidden"
             initial={{ opacity: 1, y: 0 }}
             whileInView={{ opacity: 0, y: 20 }}
             transition={{ duration: 0.8, delay: 1.5, ease: "easeInOut" }}
          >
             <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#0A0A0B] border border-white/10 flex items-center justify-center text-[#fffff]">
                        <BsTwitterX className="text-sm" />
                    </div>
                    <div className="text-xs text-white font-medium">Verify Task</div>
                </div>
                <div className="w-4 h-4 rounded-full border border-white/20 flex items-center justify-center">
                    <motion.div 
                        className="w-full h-full bg-[#10B981] rounded-full"
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        transition={{ delay: 0.5 }}
                    />
                </div>
             </div>
             <div className="space-y-2 pl-11">
                <div className="h-1.5 w-3/4 bg-[#27272A] rounded-full" />
                <div className="h-1.5 w-1/2 bg-[#27272A] rounded-full" />
             </div>
          </motion.div>

          {/* Reward Notification (Appears after Task fades) */}
          <motion.div 
             className="absolute inset-0 z-20"
             initial={{ opacity: 0, scale: 0.95, y: -10 }}
             whileInView={{ opacity: 1, scale: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 2, ease: "backOut" }}
          >
             <div className="w-full h-full bg-[#0A0A0B]/80 backdrop-blur-md rounded-xl border border-[#F59E0B]/20 p-4 flex flex-col justify-center items-center text-center shadow-[0_10px_40px_-10px_rgba(245,158,11,0.1)]">
                <div className="w-12 h-12 p-2 backdrop-blur-3xl rounded-full bg-gradient-to-b from-[#F59E0B20] to-[#F59E0B05] border border-[#F59E0B]/30 flex items-center justify-center mb-3">
                   <BsLightningChargeFill className="text-[#F59E0B] text-lg drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                </div>
                
                <h4 className="text-white font-bold text-lg mb-0.5">500 POTL</h4>
                <p className="text-[10px] text-[#9CA3AF] mb-3">Reward Airdropped</p>
                
                <div className="flex items-center backdrop-blur-2xl gap-2 px-2 py-1 bg-[#F59E0B]/20 rounded border border-[#F59E0B]/30">
                   <FaCheck className="text-[8px] text-[#F59E0B]" />
                   <span className="text-[9px] font-mono text-[#F59E0B]">CONFIRMED 0.9s</span>
                </div>
             </div>
          </motion.div>

       </div>
    </div>
  );
};

// --- 2. TIMELINE COMPONENTS (Polished Layout) ---

const TimelineStep = ({ index, title, description, CardComponent, icon: Icon, align }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-24 items-center -mb-1 sm:mb-32 last:mb-0">
       
       {/* DESKTOP CENTER NODE */}
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-20">
          <motion.div 
             initial={{ scale: 0, opacity: 0 }}
             animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
             transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
             className="w-10 h-10 rounded-full bg-[#050505] border border-[#27272A] flex items-center justify-center shadow-[0_0_0_4px_#050505] relative z-20 group"
          >
             <Icon className="text-[#9CA3AF] text-sm transition-colors duration-300 group-hover:text-[#A78BFA]" />
             
             {/* Active Glow */}
             {isInView && (
                <div className="absolute inset-0 rounded-full bg-[#8B5CF6] opacity-20 animate-ping" />
             )}
          </motion.div>
       </div>

       {/* CONTENT BLOCK */}
       <div className={`relative z-10 order-2 ${align === 'right' ? 'md:order-1 md:text-right' : 'md:order-2 md:text-left'}`}>
          <div className={`hidden md:flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
              <ContentText index={index} title={title} description={description} isInView={isInView} align={align} />
          </div>
          {/* Mobile Text (Always First) */}
          <div className="flex md:hidden flex-col mb-12 pl-6 relative border-l border-[#27272A]">
              <div className="absolute -left-[5px] top-0 w-2.5 h-2.5 rounded-full bg-[#8B5CF6] ring-4 ring-[#050505]" />
              <ContentText index={index} title={title} description={description} isInView={isInView} align="left" />
          </div>
       </div>

       {/* CARD BLOCK */}
       <div className={`relative z-10 order-1 ${align === 'right' ? 'md:order-2' : 'md:order-1'}`}>
          <motion.div
             initial={{ opacity: 0, y: 30, scale: 0.98 }}
             animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 30, scale: 0.98 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="w-full"
          >
             <CardComponent />
          </motion.div>
       </div>

    </div>
  );
};

const ContentText = ({ index, title, description, isInView, align }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
    transition={{ duration: 0.6, delay: 0.3 }}
    className="max-w-md"
  >
     <div className={`flex items-center gap-3 mb-4 ${align === 'right' ? 'md:justify-end' : 'md:justify-start'}`}>
        <span className="text-[10px] font-bold text-[#8B5CF6] tracking-widest font-mono bg-[#8B5CF6]/10 px-2 py-1 rounded border border-[#8B5CF6]/20">
            0{index + 1}
        </span>
     </div>
     <h3 className="text-2xl fontmain md:text-3xl lg:text-4xl font-semibold text-white mb-4 leading-tight tracking-tight">
        {title}
     </h3>
     <p className="text-[#A1A1AA] text-sm md:text-base leading-relaxed font-light">
        {description}
     </p>
  </motion.div>
);

// --- 3. MAIN SECTION CONTAINER ---

export default function HowItWorksSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });

  const steps = [
    {
       title: "Connect Wallet",
       description: "Instantly link your MetaMask via the BSC network. Our non custodial login ensures your keys stay on your device while syncing your on-chain identity in milliseconds.",
       CardComponent: WalletCard,
       icon: FaFingerprint,
       align: "right"
    },
    {
       title: "AI Analysis",
       description: "The Portly AI engine scans your portfolio instantly. It visualizes risk factors, diversification scores, and market opportunities in a clean, institutional grade dashboard.",
       CardComponent: AnalysisCard,
       icon: RiDonutChartFill,
       align: "left"
    },
    {
       title: "Instant Rewards",
       description: "Complete simple social tasks in the Rewards tab. Once verified, $POTL tokens are airdropped to your connected wallet within 0.9 seconds faster than a block confirmation.",
       CardComponent: RewardCard,
       icon: BsStars,
       align: "right"
    }
  ];

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-[#050505] overflow-hidden">
       {/* Background Noise/Gradient */}
       <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-[#050505] to-transparent z-10" />
       <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#050505] to-transparent z-10" />
       
       <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-32 max-w-3xl mx-auto">
             <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-4xl md:text-5xl fontmain lg:text-6xl font-semibold text-white mb-6 tracking-tight"
             >
                Three Steps to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6]">
                   Intelligent Wealth.
                </span>
             </motion.h2>

             <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-base text-[#71717A] leading-relaxed font-light max-w-2xl mx-auto"
             >
                A frictionless onboarding experience designed for speed. 
                No complex KYC, no waiting periods. Just connect and capitalize.
             </motion.p>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative">
             {/* Center Line (Desktop Only) */}
             <div className="absolute left-1/2 top-0 bottom-0 w-px bg-[#27272A] -translate-x-1/2 hidden md:block">
                <motion.div 
                   className="w-full bg-[#8B5CF6] shadow-[0_0_10px_#8B5CF6]"
                   style={{ height: useTransform(scrollYProgress, [0, 0.8], ["0%", "100%"]) }}
                />
             </div>

             {/* Steps */}
             <div className="space-y-12 md:space-y-0">
                {steps.map((step, i) => (
                   <TimelineStep key={i} index={i} {...step} />
                ))}
             </div>
          </div>

       </div>
    </section>
  );
}