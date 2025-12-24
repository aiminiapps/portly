"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { 
  FaWallet, 
  FaFingerprint,
  FaCheckCircle 
} from "react-icons/fa";
import { RiBrainLine, RiDonutChartFill } from "react-icons/ri";
import { BsLightningChargeFill, BsStars } from "react-icons/bs";

// --- DESIGN TOKENS (Portly.AI System) ---
const THEME = {
  primary: "#8B5CF6",    // Primary Violet
  deep: "#7C3AED",       // Deep Violet
  accent: "#A78BFA",     // Electric Lavender
  highlight: "#C4B5FD",  // Soft Lilac
  bg: "#0A0A0B",         // Deepest Void
  glass: "#121214",      // Glass Surface
  elevated: "#1E1E24",   // Elevated Surface
  success: "#10B981",    // Emerald
  warning: "#F59E0B",    // Amber
};

// --------------------------------------------------------
// 1. UI CARD COMPONENTS (The "Cool Cards")
// --------------------------------------------------------

// CARD 1: WALLET CONNECT SIMULATION
const WalletCard = () => {
  return (
    <div className="relative w-full h-64 rounded-2xl bg-[#121214] border border-[#C4B5FD]/10 overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
      {/* Background Gradient */}
      <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-[#8B5CF6]/10 to-transparent pointer-events-none" />
      
      {/* Simulation UI */}
      <div className="w-full max-w-[280px] bg-[#1E1E24] rounded-xl border border-white/5 p-4 relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F59E0B]/20 flex items-center justify-center text-[#F59E0B]">
               <FaWallet size={14} />
            </div>
            <div className="flex flex-col">
               <span className="text-xs text-gray-400">MetaMask</span>
               <span className="text-[10px] text-gray-500">BSC Network</span>
            </div>
          </div>
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
        </div>
        
        {/* Loading Bar Animation */}
        <div className="space-y-2">
           <div className="flex justify-between text-[10px] text-gray-400">
              <span>Status</span>
              <span className="text-[#A78BFA]">Syncing...</span>
           </div>
           <div className="h-1.5 w-full bg-black/50 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]"
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 2 }}
              />
           </div>
        </div>
      </div>

      {/* Connection Beam */}
      <div className="absolute inset-0 border border-[#8B5CF6]/20 rounded-2xl pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent shadow-[0_0_10px_#8B5CF6]" />
      </div>
    </div>
  );
};

// CARD 2: AI DASHBOARD SIMULATION
const AnalysisCard = () => {
  return (
    <div className="relative w-full h-64 rounded-2xl bg-[#121214] border border-[#C4B5FD]/10 overflow-hidden p-6 shadow-2xl group">
      {/* Header UI */}
      <div className="flex items-center justify-between mb-6">
         <div className="flex items-center gap-2">
             <RiBrainLine className="text-[#A78BFA]" />
             <span className="text-xs font-bold text-white tracking-wider">AI_SENTINEL</span>
         </div>
         <div className="px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] text-[10px] border border-[#10B981]/20">
            ACTIVE
         </div>
      </div>

      {/* Chart Simulation */}
      <div className="flex items-end justify-between h-24 gap-2 mb-4">
         {[40, 70, 50, 90, 60, 80, 45].map((height, i) => (
            <motion.div 
               key={i}
               className="w-full bg-[#1E1E24] rounded-t-sm relative overflow-hidden"
               initial={{ height: "10%" }}
               whileInView={{ height: `${height}%` }}
               transition={{ duration: 0.8, delay: i * 0.1 }}
            >
               <div className="absolute bottom-0 left-0 w-full h-full bg-gradient-to-t from-[#8B5CF6]/40 to-transparent" />
               <div className="absolute top-0 left-0 w-full h-1 bg-[#A78BFA]/50" />
            </motion.div>
         ))}
      </div>

      {/* Data Row */}
      <div className="flex gap-3">
         <div className="flex-1 bg-[#0A0A0B] rounded p-2 border border-white/5">
            <div className="text-[10px] text-gray-500 mb-1">Risk Score</div>
            <div className="text-xs text-white font-mono">12.4%</div>
         </div>
         <div className="flex-1 bg-[#0A0A0B] rounded p-2 border border-white/5">
            <div className="text-[10px] text-gray-500 mb-1">Potential</div>
            <div className="text-xs text-[#10B981] font-mono">+24.8%</div>
         </div>
      </div>
    </div>
  );
};

// CARD 3: REWARD NOTIFICATION
const RewardCard = () => {
  return (
    <div className="relative w-full h-64 rounded-2xl bg-[#121214] border border-[#C4B5FD]/10 overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#8B5CF6]/10 via-transparent to-transparent" />

      {/* Notification Toast */}
      <motion.div 
         initial={{ y: 20, opacity: 0 }}
         whileInView={{ y: 0, opacity: 1 }}
         transition={{ duration: 0.6 }}
         className="w-full bg-[#0A0A0B] border border-[#F59E0B]/20 rounded-xl p-4 relative z-10 shadow-lg"
      >
         <div className="flex items-start gap-3">
            <div className="mt-1 w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FBBF24] flex items-center justify-center text-black shadow-[0_0_15px_#F59E0B]">
               <BsStars size={14} />
            </div>
            <div>
               <h4 className="text-sm font-bold text-white">Task Completed!</h4>
               <p className="text-xs text-gray-400 mt-1">
                  You earned <span className="text-[#F59E0B] font-bold">500 $PTLY</span>
               </p>
            </div>
         </div>
         
         {/* Progress Bar */}
         <div className="mt-3 w-full h-1 bg-[#1E1E24] rounded-full overflow-hidden">
             <motion.div 
                className="h-full bg-[#F59E0B]" 
                initial={{ width: "0%" }}
                whileInView={{ width: "100%" }}
                transition={{ duration: 0.9, delay: 0.4 }}
             />
         </div>
         <div className="text-[10px] text-right text-gray-500 mt-1">0.9s transfer time</div>
      </motion.div>

      {/* Floating Coins Effect (CSS Dots) */}
      {[...Array(5)].map((_, i) => (
         <motion.div
            key={i}
            className="absolute w-1 h-1 bg-[#F59E0B] rounded-full"
            initial={{ opacity: 0, y: 0 }}
            whileInView={{ opacity: [0, 1, 0], y: -60, x: (i - 2) * 20 }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
            style={{ bottom: "30%", left: "50%" }}
         />
      ))}
    </div>
  );
};


// --------------------------------------------------------
// 2. TIMELINE & LAYOUT
// --------------------------------------------------------

const TimelineStep = ({ 
  index, 
  title, 
  description, 
  CardComponent, 
  icon: Icon, 
  align 
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-20%" });

  return (
    <div ref={ref} className="w-full grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-0 md:gap-12 items-center mb-24 last:mb-0 relative">
      
      {/* MOBILE TIMELINE LINE (Left side) */}
      <div className="absolute left-4 top-0 bottom-0 w-px bg-white/10 md:hidden z-0" />

      {/* LEFT COLUMN */}
      <div className={`
         relative z-10 pl-12 md:pl-0 mb-8 md:mb-0
         ${align === 'right' ? 'md:text-right md:order-1' : 'md:text-left md:order-3'}
      `}>
         {/* Render Text if align is Right (Desktop) or Card if align is Left */}
         <div className={`md:block ${align === 'right' ? 'block' : 'hidden'}`}>
             <ContentBlock index={index} title={title} description={description} align="right" isInView={isInView} />
         </div>
         <div className={`md:block ${align === 'left' ? 'block' : 'hidden'}`}>
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
             >
                <CardComponent />
             </motion.div>
         </div>
      </div>

      {/* MIDDLE COLUMN (Timeline Node) */}
      <div className="hidden md:flex flex-col items-center justify-center relative h-full order-2">
         {/* Vertical Line */}
         <div className="absolute top-0 bottom-0 w-px bg-white/10 z-0">
            <motion.div 
               className="w-full bg-gradient-to-b from-[#8B5CF6] to-[#A78BFA]"
               initial={{ height: "0%" }}
               whileInView={{ height: "100%" }}
               transition={{ duration: 1, delay: 0.2 }}
               style={{ transformOrigin: "top" }}
            />
         </div>
         {/* Icon Node */}
         <motion.div 
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 0 }}
            className="relative z-10 w-12 h-12 rounded-full bg-[#0A0A0B] border border-[#8B5CF6]/50 flex items-center justify-center shadow-[0_0_20px_-5px_rgba(139,92,246,0.6)]"
         >
            <Icon className="text-[#A78BFA]" size={20} />
         </motion.div>
      </div>

      {/* MOBILE ICON NODE */}
      <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-[#0A0A0B] border border-[#8B5CF6]/30 flex items-center justify-center md:hidden z-20 translate-x-[0px]">
         <span className="text-xs font-bold text-[#A78BFA]">{index + 1}</span>
      </div>

      {/* RIGHT COLUMN */}
      <div className={`
         relative z-10 pl-12 md:pl-0
         ${align === 'right' ? 'md:order-3' : 'md:order-1'}
      `}>
          {/* Render Card if align is Right (Desktop) or Text if align is Left */}
          <div className={`md:block ${align === 'right' ? 'hidden' : 'block'}`}>
             <ContentBlock index={index} title={title} description={description} align="left" isInView={isInView} />
         </div>
         <div className={`md:block ${align === 'left' ? 'hidden' : 'block'}`}>
             <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6 }}
             >
                <CardComponent />
             </motion.div>
         </div>
      </div>

    </div>
  );
};

const ContentBlock = ({ index, title, description, align, isInView }) => (
  <motion.div 
    initial={{ opacity: 0, x: align === 'left' ? -30 : 30 }}
    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: align === 'left' ? -30 : 30 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className={`flex flex-col ${align === 'left' ? 'md:items-start md:text-left' : 'md:items-end md:text-right'}`}
  >
     <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E1E24] border border-[#C4B5FD]/20 w-fit">
        <span className="text-xs font-mono font-semibold text-[#A78BFA]">PHASE 0{index + 1}</span>
     </div>
     <h3 className="text-2xl md:text-3xl font-bold text-white mb-4 tracking-tight">
        {title}
     </h3>
     <p className="text-[#E5E7EB] text-base md:text-lg leading-relaxed max-w-md">
        {description}
     </p>
  </motion.div>
);


// --------------------------------------------------------
// 3. MAIN WORKFLOW SECTION
// --------------------------------------------------------

export default function WorkflowSection() {
  const steps = [
    {
      title: "Connect Wallet",
      description: "Securely link your MetaMask wallet via the BSC network. Our protocol uses non-custodial login, ensuring your keys remain on your device while instantly syncing your on-chain identity.",
      CardComponent: WalletCard,
      icon: FaFingerprint,
      align: "left"
    },
    {
      title: "AI-Powered Analysis",
      description: "Upon connection, the Portly AI engine activates. It scans your assets, visualizes risk factors, and generates real-time market opportunities in a clean, glassmorphic dashboard.",
      CardComponent: AnalysisCard,
      icon: RiDonutChartFill,
      align: "right"
    },
    {
      title: "Instant Rewards",
      description: "Navigate to the Rewards tab and engage with the ecosystem. Complete simple tasks like social interactions, and receive $PTLY tokens in your wallet within 0.9 seconds.",
      CardComponent: RewardCard,
      icon: BsLightningChargeFill,
      align: "left"
    }
  ];

  return (
    <section className="relative w-full py-24 bg-[#0A0A0B] overflow-hidden">
      
      {/* BACKGROUND ELEMENTS (The Void) */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/20 to-transparent" />
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-[#7C3AED]/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[500px] h-[500px] bg-[#A78BFA]/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-24 md:mb-32">
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E1E24] border border-[#8B5CF6]/20 text-[#A78BFA] text-xs font-semibold tracking-wider mb-6"
           >
             <FaCheckCircle size={12} /> PROTOCOL WORKFLOW
           </motion.div>
           
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight"
           >
             Three Steps to <br />
             <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#8B5CF6] via-[#A78BFA] to-[#C4B5FD]">
               Digital Wealth
             </span>
           </motion.h2>
           
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="text-[#9CA3AF] max-w-xl mx-auto text-lg leading-relaxed font-light"
           >
             A simplified, high-performance workflow designed for speed. 
             No complex onboarding, just connect and capitalize.
           </motion.p>
        </div>

        {/* TIMELINE CONTAINER */}
        <div className="relative">
          {steps.map((step, index) => (
            <TimelineStep 
              key={index}
              index={index}
              {...step}
            />
          ))}
        </div>

      </div>
    </section>
  );
}