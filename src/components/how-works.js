"use client";

import React, { useRef } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import { 
  FaWallet, 
  FaRocket, 
} from "react-icons/fa";
import { MdAutoGraph, MdSecurity } from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";
import { RiLinksFill } from "react-icons/ri";

// --- THEME CONSTANTS ---
const THEME = {
  violet: "#8B5CF6",
  deepViolet: "#7C3AED",
  lavender: "#A78BFA",
  success: "#10B981",
  bg: "#0A0A0B",
  glass: "rgba(18, 18, 20, 0.6)",
  border: "rgba(196, 181, 253, 0.1)"
};

// --- SVG ANIMATION 1: WALLET CONNECT ---
// Represents a secure handshake/connection between user and chain
const WalletAnimation = () => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full p-8 opacity-90">
      {/* Background Grid */}
      <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 L 0 0 0 20" fill="none" stroke={THEME.border} strokeWidth="1"/>
      </pattern>
      <rect width="100%" height="100%" fill="url(#grid)" opacity="0.3" />

      {/* Central Connector Node */}
      <motion.circle 
        cx="100" cy="100" r="30" 
        stroke={THEME.violet} strokeWidth="2" fill="none"
        initial={{ scale: 0.8, opacity: 0.5 }}
        animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <circle cx="100" cy="100" r="15" fill={THEME.deepViolet} opacity="0.2" />
      
      {/* Incoming Connection Lines */}
      <motion.path 
        d="M 20 100 L 70 100" 
        stroke={THEME.lavender} strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 0.5 }}
      />
      <motion.path 
        d="M 180 100 L 130 100" 
        stroke={THEME.lavender} strokeWidth="3" strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.7, repeat: Infinity, repeatDelay: 0.5 }}
      />

      {/* Lock Icon Logic */}
      <motion.path
        d="M 90 95 L 90 90 C 90 85, 110 85, 110 90 L 110 95"
        fill="none" stroke={THEME.success} strokeWidth="2"
        animate={{ y: [0, -2, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <rect x="85" y="95" width="30" height="25" rx="5" fill={THEME.glass} stroke={THEME.success} strokeWidth="2" />
    </svg>
  );
};

// --- SVG ANIMATION 2: AI SCANNER ---
// Represents scanning data and finding insights
const ScannerAnimation = () => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full p-8">
      {/* Radar Circles */}
      {[40, 65, 90].map((r, i) => (
         <motion.circle
            key={i}
            cx="100" cy="100" r={r}
            fill="none" stroke={THEME.border} strokeWidth="1"
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, delay: i * 0.3, repeat: Infinity }}
         />
      ))}
      
      {/* Scanning Beam */}
      <motion.path
        d="M 100 100 L 100 10 A 90 90 0 0 1 190 100 Z"
        fill="url(#scanGradient)"
        opacity="0.2"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
        style={{ originX: "100px", originY: "100px" }}
      />
      
      {/* Data Points popping up */}
      <motion.circle cx="140" cy="60" r="4" fill={THEME.success}
         animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
         transition={{ duration: 2, repeat: Infinity, delay: 1 }}
      />
       <motion.circle cx="60" cy="130" r="3" fill={THEME.violet}
         animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0] }}
         transition={{ duration: 2.5, repeat: Infinity, delay: 0.5 }}
      />
      
      <defs>
        <linearGradient id="scanGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={THEME.violet} stopOpacity="0" />
          <stop offset="100%" stopColor={THEME.violet} stopOpacity="0.5" />
        </linearGradient>
      </defs>

      {/* Center Core */}
      <circle cx="100" cy="100" r="5" fill={THEME.lavender} />
      <circle cx="100" cy="100" r="15" stroke={THEME.violet} strokeWidth="2" fill="none" />
    </svg>
  );
};

// --- SVG ANIMATION 3: REWARDS FLOW ---
// Represents tokens dropping into wallet
const RewardsAnimation = () => {
  return (
    <svg viewBox="0 0 200 200" className="w-full h-full p-8">
      {/* Wallet Base */}
      <path d="M 50 140 Q 50 170 150 170 Q 150 140 150 140" fill="none" stroke={THEME.border} strokeWidth="2" />
      <path d="M 60 150 L 140 150" stroke={THEME.violet} strokeWidth="2" opacity="0.5" />

      {/* Falling Tokens */}
      {[0, 1, 2].map((i) => (
        <motion.g
            key={i}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 130, opacity: [0, 1, 1, 0] }}
            transition={{ duration: 2, delay: i * 0.8, repeat: Infinity, ease: "easeIn" }}
        >
            <circle cx={100 + (i - 1) * 20} cy="20" r="12" fill="#1E1E24" stroke="#F59E0B" strokeWidth="2" />
            <text x={100 + (i - 1) * 20} y="24" fontSize="10" fill="#F59E0B" textAnchor="middle" fontWeight="bold">$</text>
        </motion.g>
      ))}

      {/* Glow Effect at bottom */}
      <motion.ellipse 
        cx="100" cy="160" rx="40" ry="5" fill={THEME.violet} opacity="0.5" blur="10"
        animate={{ opacity: [0.3, 0.6, 0.3], rx: [35, 45, 35] }}
        transition={{ duration: 1.5, repeat: Infinity }}
      />
    </svg>
  );
};

// --- LAYOUT COMPONENTS ---

const StepCard = ({ index, title, description, Animation, icon: Icon }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Determine alignment: Alternating on desktop, stacked left on mobile
  const isEven = index % 2 === 0;

  return (
    <div 
        ref={ref} 
        className={`relative z-10 flex flex-col md:flex-row items-center w-full mb-24 md:mb-32 ${!isEven ? "md:flex-row-reverse" : ""}`}
    >
        {/* Timeline Dot (Absolute Center on Desktop, Left on Mobile) */}
        <div className="absolute left-6 md:left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#0A0A0B] border-2 border-[#8B5CF6] shadow-[0_0_10px_#8B5CF6] z-20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>

        {/* VISUAL BLOCK (50%) */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
            className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? "md:pr-16" : "md:pl-16"}`}
        >
            <div className="relative aspect-video md:aspect-[4/3] rounded-2xl overflow-hidden bg-[#121214]/60 border border-[#C4B5FD]/10 backdrop-blur-md shadow-2xl group hover:border-[#8B5CF6]/30 transition-colors duration-500">
                {/* Inner Glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <Animation />
            </div>
        </motion.div>

        {/* TEXT BLOCK (50%) */}
        <motion.div 
            initial={{ opacity: 0, x: isEven ? 30 : -30 }}
            animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: isEven ? 30 : -30 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className={`w-full md:w-1/2 pl-16 md:pl-0 pt-8 md:pt-0 ${isEven ? "md:pl-16" : "md:pr-16"} text-left`}
        >
            <div className="inline-flex items-center gap-2 mb-3">
                 <Icon className="text-[#A78BFA] w-5 h-5" />
                 <span className="text-[#8B5CF6] font-mono text-xs font-bold tracking-widest uppercase">
                    Step 0{index + 1}
                 </span>
            </div>
            
            <h3 className="text-2xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {title}
            </h3>
            
            <p className="text-[#9CA3AF] text-lg leading-relaxed font-light">
                {description}
            </p>
        </motion.div>
    </div>
  );
};

export default function WorkflowSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"]
  });

  const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  const steps = [
    {
      title: "Connect Wallet",
      description: "Securely link your MetaMask via the BSC network. Our protocol uses read-only permissions to sync your public address instantly.",
      Animation: WalletAnimation,
      icon: FaWallet,
    },
    {
      title: "AI Analysis",
      description: "Your personalized dashboard activates immediately. Our neural engine scans your holdings to generate risk scores and actionable wealth intelligence.",
      Animation: ScannerAnimation,
      icon: MdAutoGraph,
    },
    {
      title: "Earn Rewards",
      description: "Complete simple engagement tasks in the Rewards tab. Tokens are airdropped to your connected wallet within 0.9s of verification.",
      Animation: RewardsAnimation,
      icon: BsLightningChargeFill,
    }
  ];

  return (
    <section ref={containerRef} className="relative w-full py-32 bg-[#0A0A0B] overflow-hidden">
      
      {/* --- BACKGROUND SURFACES --- */}
      {/* Subtle Gradient Spotlights */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
         <div className="absolute top-20 right-0 w-[600px] h-[600px] bg-[#7C3AED]/5 blur-[120px] rounded-full" />
         <div className="absolute bottom-20 left-0 w-[600px] h-[600px] bg-[#8B5CF6]/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-24 max-w-3xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1E1E24] border border-[#C4B5FD]/10 mb-6"
            >
               <MdSecurity className="text-[#10B981] w-4 h-4" />
               <span className="text-[#E5E7EB] text-xs font-medium tracking-wide">Secure Blockchain Integration</span>
            </motion.div>
            
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                From Connection to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] to-[#8B5CF6]">
                    Profit in Seconds.
                </span>
            </h2>
            <p className="text-[#9CA3AF] text-lg font-light leading-relaxed">
                We've stripped away the complexity. No sign-ups, no KYC. Just connect your wallet and let the AI do the heavy lifting.
            </p>
        </div>

        {/* --- TIMELINE CONTAINER --- */}
        <div className="relative">
            
            {/* THE VERTICAL LINE */}
            {/* Positioned at left-6 (24px) on mobile to clear text, centered on desktop */}
            <div className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-[#1E1E24] h-full z-0">
                <motion.div 
                    style={{ scaleY, transformOrigin: "top" }}
                    className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#8B5CF6] via-[#A78BFA] to-[#7C3AED]"
                />
            </div>

            {/* STEPS */}
            <div className="relative z-10">
                {steps.map((step, index) => (
                    <StepCard key={index} index={index} {...step} />
                ))}
            </div>

        </div>

        {/* BOTTOM CTA */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
        >
            <div className="inline-flex items-center gap-3 text-[#9CA3AF] text-sm">
                <RiLinksFill className="text-[#10B981]" />
                <span>Compatible with MetaMask, Trust Wallet, and WalletConnect</span>
            </div>
        </motion.div>

      </div>
    </section>
  );
}