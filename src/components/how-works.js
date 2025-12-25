"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { 
  FaWallet, 
  FaFingerprint, 
  FaCheck,
  FaArrowRight
} from "react-icons/fa6"; // Updated to fa6 for sharper icons
import { RiBrainLine, RiStockLine } from "react-icons/ri";
import { BsLightningCharge, BsLayers } from "react-icons/bs";

// --- SHARED UTILS ---

// A subtle noise texture overlay for a premium "matte" finish
const NoiseOverlay = () => (
  <div 
    className="absolute inset-0 opacity-[0.03] pointer-events-none z-0 mix-blend-overlay"
    style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
  />
);

// --- 1. ENHANCED SIMULATION CARDS ---

// CARD 1: WALLET CONNECT (Hardware Wallet / Biometric Aesthetic)
const WalletCard = () => {
  return (
    <div className="relative w-full h-80 rounded-[32px] bg-[#080808] border border-white/5 overflow-hidden flex flex-col items-center justify-center shadow-2xl group hover:border-white/10 transition-all duration-700">
      <NoiseOverlay />
      
      {/* Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-white/5 blur-[80px] rounded-full pointer-events-none" />

      {/* The "Physical" Card */}
      <motion.div 
        className="relative z-10 w-[280px] h-[170px] bg-gradient-to-br from-[#1A1A1A] to-[#0A0A0A] rounded-2xl border border-white/10 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col justify-between p-5"
        whileHover={{ rotateX: 5, rotateY: 5, scale: 1.02 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
         {/* Card Texture */}
         <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.02)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%] animate-[shimmer_3s_infinite_linear]" />

         {/* Header */}
         <div className="flex justify-between items-start">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
                  <FaWallet className="text-white/60 text-xs" />
               </div>
               <div className="flex flex-col">
                  <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Protocol</span>
                  <span className="text-xs text-white font-medium">Metamask</span>
               </div>
            </div>
            {/* Simulated EMV Chip */}
            <div className="w-10 h-8 rounded bg-gradient-to-br from-[#D4AF37] to-[#8A6E24] opacity-80 border border-[#FCD34D]/20 relative overflow-hidden">
                <div className="absolute inset-0 border border-black/20 rounded-[2px]" />
                <div className="absolute top-1/2 left-0 right-0 h-px bg-black/20" />
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-black/20" />
            </div>
         </div>

         {/* Footer / Biometric Scan */}
         <div className="flex items-center justify-between mt-auto">
            <div className="flex flex-col gap-1">
               <span className="text-[9px] text-white/30 font-mono tracking-widest">ID: 0x...8F2A</span>
               <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                  <span className="text-[10px] text-emerald-500/80 font-medium tracking-wide">CONNECTED</span>
               </div>
            </div>
            <div className="relative w-10 h-10 flex items-center justify-center">
               <FaFingerprint className="text-white/20 text-2xl relative z-10" />
               <motion.div 
                 className="absolute inset-0 border border-white/30 rounded-full"
                 initial={{ scale: 0.8, opacity: 0 }}
                 animate={{ scale: 1.2, opacity: 0 }}
                 transition={{ duration: 2, repeat: Infinity }}
               />
            </div>
         </div>
      </motion.div>

      {/* Background Abstract Lines */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
         <div className="absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
         <div className="absolute bottom-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-50" />
      </div>
    </div>
  );
};

// CARD 2: AI DASHBOARD (Terminal / Financial Instrument Look)
const AnalysisCard = () => {
  return (
    <div className="relative w-full h-80 rounded-[32px] bg-[#080808] border border-white/5 overflow-hidden flex flex-col shadow-2xl group hover:border-white/10 transition-all duration-700">
      <NoiseOverlay />
      
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/5 bg-white/[0.02]">
         <div className="flex items-center gap-2">
            <RiBrainLine className="text-white/40" />
            <span className="text-xs font-mono text-white/60 tracking-wider">AI_ENGINE v2.4</span>
         </div>
         <div className="flex gap-1.5">
            <div className="w-2 h-2 rounded-full bg-white/10" />
            <div className="w-2 h-2 rounded-full bg-white/10" />
         </div>
      </div>

      {/* Main Content */}
      <div className="p-6 flex-1 flex flex-col justify-between relative">
         {/* Grid Background */}
         <div className="absolute inset-0 opacity-[0.07]" 
            style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '30px 30px' }} 
         />

         {/* Stats Row */}
         <div className="flex gap-8 relative z-10">
            <div>
               <div className="text-[10px] text-white/40 font-mono mb-1">RISK INDEX</div>
               <div className="text-xl font-light text-white font-mono">12.4<span className="text-emerald-500 text-xs ml-1">▼</span></div>
            </div>
            <div>
               <div className="text-[10px] text-white/40 font-mono mb-1">PROJECTED</div>
               <div className="text-xl font-light text-white font-mono">+42%<span className="text-emerald-500 text-xs ml-1">▲</span></div>
            </div>
         </div>

         {/* Chart Visualization */}
         <div className="flex items-end gap-1 h-24 relative z-10 mt-4 mask-image-gradient-b">
            {[40, 65, 50, 80, 55, 90, 70, 95, 85, 60].map((h, i) => (
               <motion.div 
                  key={i}
                  className="flex-1 bg-white"
                  style={{ opacity: 0.1 + (i * 0.05) }} // Gradient opacity
                  initial={{ height: "10%" }}
                  whileInView={{ height: `${h}%` }}
                  transition={{ duration: 1, delay: i * 0.05, ease: "circOut" }}
               />
            ))}
            {/* Scanning Line */}
            <motion.div 
               className="absolute top-0 bottom-0 w-px bg-white/40 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
               animate={{ left: ["0%", "100%"] }}
               transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            />
         </div>
      </div>
    </div>
  );
};

// CARD 3: REWARDS (Notification Center / Glassmorphism)
const RewardCard = () => {
  return (
    <div className="relative w-full h-80 rounded-[32px] bg-[#080808] border border-white/5 overflow-hidden flex flex-col items-center justify-center shadow-2xl group hover:border-white/10 transition-all duration-700">
      <NoiseOverlay />
      {/* Background Radial Gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_100%,_#ffffff08,_transparent_50%)]" />

      {/* Main Glass Panel */}
      <motion.div 
         className="relative w-64 bg-white/[0.03] backdrop-blur-md rounded-2xl border border-white/10 p-4"
         initial={{ y: 20, opacity: 0 }}
         whileInView={{ y: 0, opacity: 1 }}
         transition={{ duration: 0.8 }}
      >
         {/* Top Notification */}
         <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
            <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
               <BsLayers className="text-sm" />
            </div>
            <div>
               <div className="text-xs text-white font-medium">Task Completed</div>
               <div className="text-[10px] text-white/40">Just now • Social Engagement</div>
            </div>
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
         </div>

         {/* Incoming Asset */}
         <div className="flex items-center justify-between">
            <div className="flex flex-col">
               <span className="text-[10px] text-white/40 font-mono uppercase">Incoming Asset</span>
               <span className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                  +500 PTLY
               </span>
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#D4AF37] to-[#FCD34D] flex items-center justify-center text-black shadow-lg shadow-[#D4AF37]/20">
               <BsLightningCharge className="text-xs" />
            </div>
         </div>
      </motion.div>

      {/* Floating Success Indicator */}
      <motion.div 
         className="absolute bottom-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 backdrop-blur-sm"
         initial={{ opacity: 0, y: 10 }}
         whileInView={{ opacity: 1, y: 0 }}
         transition={{ delay: 0.4, duration: 0.5 }}
      >
         <FaCheck className="text-[10px] text-[#10B981]" />
         <span className="text-[10px] font-mono text-[#10B981] font-medium tracking-wide">TX VERIFIED 0.9s</span>
      </motion.div>
    </div>
  );
};

// --- 2. TIMELINE COMPONENTS ---

const TimelineStep = ({ index, title, description, CardComponent, stepNum, align }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });

  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center mb-32 last:mb-0">
       
       {/* CENTER NODE (Desktop) */}
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-20">
          <motion.div 
             initial={{ scale: 0, opacity: 0 }}
             animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
             transition={{ type: "spring", stiffness: 150, damping: 20 }}
             className="w-3 h-3 rounded-full bg-white border border-black ring-4 ring-black shadow-[0_0_15px_rgba(255,255,255,0.3)]"
          />
       </div>

       {/* TEXT CONTENT */}
       <div className={`relative z-10 order-2 ${align === 'right' ? 'md:order-1 md:text-right' : 'md:order-2 md:text-left'}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="flex flex-col gap-4"
          >
             <div className={`flex ${align === 'right' ? 'md:justify-end' : 'md:justify-start'} items-center gap-3`}>
                <span className="font-mono text-xs text-white/30 tracking-widest uppercase">Step 0{index + 1}</span>
                <div className="h-px w-12 bg-white/10" />
             </div>
             
             <h3 className="text-3xl md:text-4xl font-medium text-white tracking-tight leading-[1.1]">
                {title}
             </h3>
             <p className={`text-white/50 text-base md:text-lg leading-relaxed font-light ${align === 'right' ? 'md:pl-12' : 'md:pr-12'}`}>
                {description}
             </p>
          </motion.div>
       </div>

       {/* CARD PREVIEW */}
       <div className={`relative z-10 order-1 ${align === 'right' ? 'md:order-2' : 'md:order-1'}`}>
          <motion.div
             initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
             animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : { opacity: 0, y: 40, filter: "blur(10px)" }}
             transition={{ duration: 0.8, ease: "circOut" }}
             className="w-full pl-4 md:pl-0"
          >
             <CardComponent />
          </motion.div>
       </div>

    </div>
  );
};


// --- 3. MAIN SECTION CONTAINER ---

export default function HowItWorksSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const steps = [
    {
       title: "Connect Identity",
       description: "Secure, non-custodial login. Link your wallet to verify on-chain history instantly without compromising keys or privacy.",
       CardComponent: WalletCard,
       align: "right"
    },
    {
       title: "Intelligent Analysis",
       description: "Our engine processes thousands of market signals in real-time, providing institutional-grade risk assessment and opportunity spotting.",
       CardComponent: AnalysisCard,
       align: "left"
    },
    {
       title: "Yield & Rewards",
       description: "Automated distribution. Complete ecosystem tasks and receive verified token transfers directly to your wallet in under a second.",
       CardComponent: RewardCard,
       align: "right"
    }
  ];

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-[#050505] overflow-hidden">
       
       {/* Global Background Elements */}
       <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
       
       <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Section Header */}
          <div className="text-center mb-32 max-w-2xl mx-auto">
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
             >
                <div className="inline-flex items-center justify-center px-3 py-1 rounded-full border border-white/10 bg-white/[0.03] backdrop-blur-sm mb-6">
                   <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/60">Process Flow</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-medium text-white mb-6 tracking-tight">
                   Precision in <br /> every step.
                </h2>
             </motion.div>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative">
             {/* Vertical Line (Desktop) */}
             <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 hidden md:block">
                <motion.div 
                   className="w-full bg-gradient-to-b from-transparent via-white/20 to-transparent"
                   style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
                />
             </div>

             {/* Steps */}
             <div>
                {steps.map((step, i) => (
                   <TimelineStep key={i} index={i} {...step} />
                ))}
             </div>
          </div>

       </div>
    </section>
  );
}