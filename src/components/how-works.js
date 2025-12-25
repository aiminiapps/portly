"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { 
  FaWallet, 
  FaFingerprint, 
  FaCheckCircle,
  FaTwitter,
  FaRetweet,
  FaHeart,
  FaArrowRight
} from "react-icons/fa";
import { RiBrainLine, RiDonutChartFill, RiExchangeDollarLine } from "react-icons/ri";
import { BsLightningChargeFill, BsStars, BsShieldCheck } from "react-icons/bs";
import { BiNetworkChart } from "react-icons/bi";

// --- 1. ENHANCED SIMULATION CARDS ---

// CARD 1: WALLET CONNECT (Holographic Scan Effect)
const WalletCard = () => {
  return (
    <div className="relative w-full h-72 rounded-3xl bg-[#0E0E10] border border-white/5 overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl group hover:border-[#8B5CF6]/40 transition-all duration-500">
      {/* Ambient Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1E1E24] to-[#0A0A0B]" />
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent opacity-50" />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-[280px] bg-[#18181B]/80 backdrop-blur-xl rounded-2xl border border-white/10 p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F59E0B]/10 flex items-center justify-center border border-[#F59E0B]/20">
                 <FaWallet className="text-[#F59E0B] text-lg" />
              </div>
              <div>
                 <div className="text-sm font-bold text-white">MetaMask</div>
                 <div className="text-[10px] text-[#9CA3AF] tracking-wide">BSC MAINNET</div>
              </div>
           </div>
           <div className="w-2 h-2 rounded-full bg-[#10B981] shadow-[0_0_10px_#10B981] animate-pulse" />
        </div>

        {/* Connection Animation */}
        <div className="relative h-12 w-full bg-[#0A0A0B] rounded-lg border border-white/5 mb-4 overflow-hidden flex items-center px-3 gap-3">
           <FaFingerprint className="text-[#8B5CF6] animate-pulse" />
           <div className="flex-1 h-1.5 bg-[#1E1E24] rounded-full overflow-hidden">
              <motion.div 
                 className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#C4B5FD]"
                 initial={{ width: "0%" }}
                 whileInView={{ width: "100%" }}
                 transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 }}
              />
           </div>
        </div>

        {/* Footer Status */}
        <div className="flex justify-between items-center text-[10px]">
           <span className="text-[#9CA3AF]">Connection Status</span>
           <span className="text-[#A78BFA] font-mono bg-[#8B5CF6]/10 px-2 py-0.5 rounded border border-[#8B5CF6]/20">
              ENCRYPTED
           </span>
        </div>
      </div>

      {/* Holographic Scan Line Overlay */}
      <motion.div 
        className="absolute inset-x-0 h-12 bg-gradient-to-b from-[#8B5CF6]/10 to-transparent pointer-events-none z-20"
        animate={{ top: ["-20%", "120%"] }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

// CARD 2: AI DASHBOARD (Scanning Grid)
const AnalysisCard = () => {
  return (
    <div className="relative w-full h-72 rounded-3xl bg-[#0E0E10] border border-white/5 overflow-hidden p-6 shadow-2xl group hover:border-[#8B5CF6]/40 transition-all duration-500 flex flex-col">
       {/* Background Grid */}
       <div className="absolute inset-0 opacity-10" 
            style={{ backgroundImage: 'linear-gradient(#8B5CF6 1px, transparent 1px), linear-gradient(90deg, #8B5CF6 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
       />
       
       {/* Header */}
       <div className="relative z-10 flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E1E24] border border-white/10">
             <RiBrainLine className="text-[#A78BFA]" />
             <span className="text-xs font-bold text-white tracking-widest">AI_AGENT</span>
          </div>
          <BiNetworkChart className="text-[#9CA3AF]" />
       </div>

       {/* Live Charts */}
       <div className="relative z-10 flex-1 flex items-end gap-1.5 mb-4 px-2">
          {[30, 50, 45, 75, 55, 90, 65, 80].map((h, i) => (
             <motion.div 
                key={i}
                className="flex-1 bg-gradient-to-t from-[#8B5CF6]/40 to-[#8B5CF6]/80 rounded-t-sm relative overflow-hidden group-hover:from-[#8B5CF6]/60 group-hover:to-[#A78BFA]"
                initial={{ height: "10%" }}
                whileInView={{ height: `${h}%` }}
                transition={{ duration: 0.8, delay: i * 0.05 }}
             >
                <div className="absolute top-0 left-0 right-0 h-px bg-white/50" />
             </motion.div>
          ))}
          
          {/* Scanning Line overlaying charts */}
          <motion.div 
             className="absolute top-0 bottom-0 w-px bg-[#10B981] shadow-[0_0_15px_#10B981]"
             animate={{ left: ["0%", "100%"] }}
             transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
       </div>

       {/* Insight Row */}
       <div className="relative z-10 flex gap-2">
          <div className="flex-1 bg-[#1E1E24]/80 p-2 rounded-lg border border-white/5 backdrop-blur-sm">
             <div className="text-[10px] text-gray-400">Risk Score</div>
             <div className="text-sm font-bold text-white flex items-center gap-1">
                <BsShieldCheck className="text-[#10B981]" /> 98/100
             </div>
          </div>
          <div className="flex-1 bg-[#1E1E24]/80 p-2 rounded-lg border border-white/5 backdrop-blur-sm">
             <div className="text-[10px] text-gray-400">Opp. Found</div>
             <div className="text-sm font-bold text-[#A78BFA]">3 Assets</div>
          </div>
       </div>
    </div>
  );
};

// CARD 3: SOCIAL REWARDS (Interaction Simulation)
const RewardCard = () => {
  return (
    <div className="relative w-full h-72 rounded-3xl bg-[#0E0E10] border border-white/5 overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl group hover:border-[#8B5CF6]/40 transition-all duration-500">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#F59E0B15,_transparent_70%)]" />

       {/* Social Task Simulation */}
       <motion.div 
          className="w-full max-w-[260px] bg-[#1E1E24] rounded-xl border border-white/5 p-4 mb-4 relative z-10"
          initial={{ y: 0 }}
          whileInView={{ y: -10 }}
          transition={{ duration: 0.5 }}
       >
          <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 rounded-full bg-[#1DA1F2]/20 flex items-center justify-center text-[#1DA1F2]">
                <FaTwitter />
             </div>
             <div className="flex-1 h-2 bg-[#2A2A30] rounded-full" />
          </div>
          <div className="flex gap-4 pl-11">
             <div className="text-gray-500 text-xs flex items-center gap-1"><FaHeart className="text-red-500" /> Liked</div>
             <div className="text-gray-500 text-xs flex items-center gap-1"><FaRetweet className="text-green-500" /> Reposted</div>
          </div>
       </motion.div>

       {/* Arrow Down */}
       <FaArrowRight className="text-[#8B5CF6] rotate-90 mb-4 animate-bounce" />

       {/* Reward Toast */}
       <motion.div 
          className="w-full max-w-[260px] bg-gradient-to-r from-[#1E1E24] to-[#0A0A0B] rounded-xl border border-[#F59E0B]/30 p-3 flex items-center gap-3 relative z-10 shadow-[0_0_20px_-5px_rgba(245,158,11,0.3)]"
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: "spring" }}
       >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#D97706] flex items-center justify-center text-white shadow-lg">
             <BsLightningChargeFill />
          </div>
          <div>
             <div className="text-xs text-[#9CA3AF]">Reward Received</div>
             <div className="text-base font-bold text-white flex items-center gap-2">
                500 PTLY <span className="text-[10px] bg-[#F59E0B]/20 text-[#F59E0B] px-1.5 py-0.5 rounded">0.9s</span>
             </div>
          </div>
       </motion.div>
    </div>
  );
};

// --- 2. TIMELINE COMPONENTS ---

const TimelineStep = ({ index, title, description, CardComponent, icon: Icon, align }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-15%" });

  return (
    <div ref={ref} className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center mb-24 md:mb-32 last:mb-0">
       
       {/* DESKTOP CENTER NODE */}
       <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:flex items-center justify-center z-20">
          <motion.div 
             initial={{ scale: 0 }}
             animate={isInView ? { scale: 1 } : { scale: 0 }}
             transition={{ type: "spring", stiffness: 200, damping: 20 }}
             className="w-12 h-12 rounded-full bg-[#0A0A0B] border border-[#8B5CF6] flex items-center justify-center shadow-[0_0_20px_-5px_#8B5CF6] relative"
          >
             <Icon className="text-[#A78BFA] text-lg" />
          </motion.div>
       </div>

       {/* CONTENT BLOCK */}
       <div className={`relative z-10 order-2 ${align === 'right' ? 'md:order-1 md:text-right' : 'md:order-2 md:text-left'}`}>
          <div className={`hidden md:flex flex-col ${align === 'right' ? 'items-end' : 'items-start'}`}>
              <ContentText index={index} title={title} description={description} isInView={isInView} />
          </div>
          {/* Mobile Text (Always First) */}
          <div className="flex md:hidden flex-col mb-8 pl-8 relative">
              {/* Mobile Line */}
              <div className="absolute left-2 top-0 bottom-0 w-px bg-gradient-to-b from-[#8B5CF6] to-transparent" />
              <div className="absolute left-0 top-0 w-5 h-5 rounded-full bg-[#0A0A0B] border border-[#8B5CF6] flex items-center justify-center z-10">
                 <span className="text-[10px] text-[#A78BFA] font-bold">{index + 1}</span>
              </div>
              
              <ContentText index={index} title={title} description={description} isInView={isInView} />
          </div>
       </div>

       {/* CARD BLOCK */}
       <div className={`relative z-10 order-1 ${align === 'right' ? 'md:order-2' : 'md:order-1'}`}>
          <motion.div
             initial={{ opacity: 0, y: 40, scale: 0.95 }}
             animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.95 }}
             transition={{ duration: 0.7, ease: "easeOut" }}
             className="w-full"
          >
             <CardComponent />
          </motion.div>
       </div>

    </div>
  );
};

const ContentText = ({ index, title, description, isInView }) => (
  <motion.div
    initial={{ opacity: 0, x: 0, y: 20 }}
    animate={isInView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: 0, y: 20 }}
    transition={{ duration: 0.6, delay: 0.2 }}
    className="sm:px-8"
  >
     <div className="inline-block px-3 py-1 rounded-full bg-[#1E1E24] border border-[#C4B5FD]/20 mb-4">
        <span className="text-xs font-bold text-[#A78BFA] tracking-wider font-mono">STEP 0{index + 1}</span>
     </div>
     <h3 className="text-2xl md:text4xl font-semibold text-white mb-4 leading-tight">
        {title}
     </h3>
     <p className="text-[#9CA3AF]/90 text-sm md:text-lg sm:text-balance  font-light">
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
       description: "Complete simple social tasks in the Rewards tab. Once verified, $PTLY tokens are airdropped to your connected wallet within 0.9 seconds faster than a block confirmation.",
       CardComponent: RewardCard,
       icon: BsStars,
       align: "right"
    }
  ];

  return (
    <section ref={containerRef} className="relative w-full py-20 bg-[#050505] overflow-hidden">
       <div className="absolute bottom-1/3 right-0 w-[500px] h-[500px] bg-[#A78BFA]/5 blur-[120px] rounded-full pointer-events-none" />
       <div className="max-w-7xl mx-auto px-6 relative z-10">
          
          {/* Header */}
          <div className="text-center mb-24 md:mb-32 max-w-3xl mx-auto">
             <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-4xl md:text-5xl lg:text-7xl font-bold text-white mb-6 tracking-tight leading-[1.1]"
             >
                Three Steps to <br />
                <span className="text-[#8B5CF6]">
                   Intelligent Wealth.
                </span>
             </motion.h2>

             <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-sm md:text-xl sm:text-balance text-[#9CA3AF] leading-relaxed font-light"
             >
                A frictionless onboarding experience designed for speed. 
                No complex KYC, no waiting periods. Just connect and capitalize.
             </motion.p>
          </div>

          {/* Timeline Wrapper */}
          <div className="relative">
             {/* Center Line (Desktop Only) */}
             <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/5 -translate-x-1/2 hidden md:block">
                <motion.div 
                   className="w-full bg-gradient-to-b from-[#8B5CF6] via-[#A78BFA] to-[#8B5CF6]"
                   style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
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