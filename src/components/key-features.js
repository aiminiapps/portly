"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RiDashboardFill, 
  RiBrainLine, 
  RiRobot2Line, 
  RiExchangeDollarLine, 
  RiVipCrownFill,
  RiArrowRightLine,
  RiSecurePaymentFill
} from "react-icons/ri";
import { BsLightningChargeFill, BsStars, BsGraphUp } from "react-icons/bs";
import { FaCoins, FaWallet } from "react-icons/fa";

// --- FEATURE DATA ---
const features = [
  {
    id: "dashboard",
    title: "Institutional Grade Dashboard",
    subtitle: "REAL-TIME ANALYTICS",
    description: "Experience an industry-standard interface designed for clarity. Monitor asset performance, track yield metrics, and visualize your portfolio growth with banking-grade precision.",
    color: "#8B5CF6", // Violet
    stat: "LATENCY: 12ms",
    icon: RiDashboardFill
  },
  {
    id: "ai",
    title: "Context-Aware AI Intelligence",
    subtitle: "WALLET-SYNCED BOT",
    description: "Our AI Chatbot doesn't just talk; it reads. It analyzes your connected wallet status to provide personalized trading strategies, risk assessments, and portfolio rebalancing suggestions in real-time.",
    color: "#0EA5E9", // Sky Blue
    stat: "MODEL: GPT-4o",
    icon: RiBrainLine
  },
  {
    id: "fees",
    title: "Zero Fees. Pure Profit.",
    subtitle: "GASLESS INFRASTRUCTURE",
    description: "Stop losing margins to network costs. We subsidize the gas so you can trade freely. Experience a truly frictionless financial ecosystem where 100% of your capital goes into your investment.",
    color: "#10B981", // Emerald
    stat: "COST: $0.00",
    icon: RiExchangeDollarLine
  },
  {
    id: "earn",
    title: "Complete Tasks, Get Paid",
    subtitle: "DIRECT AIRDROPS",
    description: "Turn engagement into equity. Complete simple social and protocol tasks to earn tokens. Rewards are verified on-chain and dropped directly into your connected wallet instantly.",
    color: "#F59E0B", // Amber
    stat: "PAYOUT: INSTANT",
    icon: FaCoins
  }
];

// --- 1. VISUAL CARD COMPONENTS (The Left Side) ---

const VisualCard = ({ feature }) => {
  // We render different "mini-scenes" based on the feature ID
  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0B] flex items-center justify-center group">
      
      {/* Dynamic Background Glow */}
      <motion.div 
        className="absolute inset-0 opacity-20"
        animate={{ 
          background: `radial-gradient(circle at 50% 50%, ${feature.color}, transparent 70%)` 
        }}
        transition={{ duration: 1 }}
      />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.1]" 
           style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
      />

      {/* --- SCENE: DASHBOARD --- */}
      {feature.id === 'dashboard' && (
        <div className="relative z-10 grid grid-cols-2 gap-3 p-4 rotate-[-5deg]">
           <motion.div 
             initial={{ height: 40 }} animate={{ height: [40, 80, 50, 90] }} 
             transition={{ duration: 3, repeat: Infinity }}
             className="w-16 bg-white/10 rounded-lg backdrop-blur-md border border-white/10" 
           />
           <motion.div 
             initial={{ height: 60 }} animate={{ height: [60, 40, 90, 70] }} 
             transition={{ duration: 4, repeat: Infinity }}
             className="w-16 bg-[#8B5CF6] rounded-lg shadow-[0_0_20px_#8B5CF6]" 
           />
           <div className="col-span-2 h-20 w-full bg-[#18181B] rounded-xl border border-white/10 flex items-center justify-center">
              <BsGraphUp className="text-3xl text-white/50" />
           </div>
        </div>
      )}

      {/* --- SCENE: AI --- */}
      {feature.id === 'ai' && (
        <div className="relative z-10 flex flex-col items-center gap-4">
           <motion.div 
             animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="w-24 h-24 rounded-2xl bg-[#0EA5E9]/20 border border-[#0EA5E9] flex items-center justify-center backdrop-blur-xl relative"
           >
              <div className="absolute inset-0 bg-[#0EA5E9] blur-xl opacity-40" />
              <RiRobot2Line className="text-4xl text-[#0EA5E9] relative z-10" />
           </motion.div>
           <motion.div 
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="px-4 py-2 bg-[#1E1E24] rounded-full border border-white/10 flex items-center gap-2"
           >
              <FaWallet className="text-gray-400 text-xs" />
              <span className="text-[10px] text-white font-mono">SCANNING WALLET...</span>
           </motion.div>
        </div>
      )}

      {/* --- SCENE: FEES --- */}
      {feature.id === 'fees' && (
        <div className="relative z-10">
           <motion.div 
             className="w-32 h-32 rounded-full border-4 border-[#10B981] flex items-center justify-center relative"
             animate={{ boxShadow: ["0 0 0px #10B981", "0 0 30px #10B981", "0 0 0px #10B981"] }}
             transition={{ duration: 2, repeat: Infinity }}
           >
              <RiSecurePaymentFill className="text-5xl text-white" />
              <div className="absolute -top-2 -right-2 w-12 h-12 bg-[#10B981] rounded-full flex items-center justify-center text-black font-bold text-xs shadow-lg">
                0%
              </div>
           </motion.div>
        </div>
      )}

      {/* --- SCENE: EARN --- */}
      {feature.id === 'earn' && (
        <div className="relative z-10 flex flex-col items-center">
           <motion.div 
             animate={{ y: [-10, 10, -10] }}
             transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
             className="relative"
           >
              <FaCoins className="text-6xl text-[#F59E0B] drop-shadow-[0_0_15px_#F59E0B]" />
              <motion.div 
                initial={{ opacity: 0, y: 0 }}
                animate={{ opacity: [0, 1, 0], y: -40 }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-[#F59E0B] font-bold"
              >
                +500
              </motion.div>
           </motion.div>
           <div className="mt-8 flex items-center gap-2 px-4 py-1.5 bg-[#F59E0B]/10 border border-[#F59E0B]/20 rounded text-[#F59E0B] text-xs font-mono uppercase">
              <BsStars /> Task Complete
           </div>
        </div>
      )}

    </div>
  );
};

// --- 2. MAIN COMPONENT ---

export default function FeaturesSlider() {
  const [index, setIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-rotate logic
  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % features.length);
    }, 5000); // 5 seconds per slide
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const activeFeature = features[index];

  return (
    <section className="w-full py-24 bg-[#050505] relative overflow-hidden">
      
      {/* Decorative Blur Top Right */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Section Header */}
        <div className="mb-16">
           <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
             Built for <span className="text-[#8B5CF6]">Performance</span>
           </h2>
           <div className="h-1 w-20 bg-gradient-to-r from-[#8B5CF6] to-transparent rounded-full" />
        </div>

        {/* --- MAIN SLIDER LAYOUT --- */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          
          {/* LEFT: VISUAL (Animated via AnimatePresence) */}
          <div className="relative w-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
                transition={{ duration: 0.5 }}
              >
                <VisualCard feature={activeFeature} />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT: CONTENT */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-start"
              >
                {/* Tag */}
                <div 
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-md mb-6 border"
                  style={{ 
                    borderColor: `${activeFeature.color}30`,
                    backgroundColor: `${activeFeature.color}10` 
                  }}
                >
                   <activeFeature.icon style={{ color: activeFeature.color }} />
                   <span style={{ color: activeFeature.color }} className="text-xs font-bold tracking-widest uppercase font-mono">
                      {activeFeature.subtitle}
                   </span>
                </div>

                {/* Title */}
                <h3 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
                   {activeFeature.title}
                </h3>

                {/* Description */}
                <p className="text-[#9CA3AF] text-lg leading-relaxed mb-8 max-w-lg font-light">
                   {activeFeature.description}
                </p>

                {/* Tech Stats & CTA */}
                <div className="flex items-center gap-8 w-full border-t border-white/10 pt-8">
                   <div>
                      <div className="text-[10px] text-[#52525B] uppercase tracking-wider font-bold mb-1">
                         System Metrics
                      </div>
                      <div className="font-mono text-white text-sm">
                         {activeFeature.stat}
                      </div>
                   </div>
                   
                   <button className="group flex items-center gap-2 text-white hover:text-[#8B5CF6] transition-colors">
                      <span className="text-sm font-semibold">Explore Feature</span>
                      <RiArrowRightLine className="group-hover:translate-x-1 transition-transform" />
                   </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* --- PAGINATION CONTROLS --- */}
        <div className="mt-16 flex items-center justify-center gap-4">
          {features.map((item, i) => (
             <button
               key={item.id}
               onClick={() => setIndex(i)}
               className="group relative py-4"
             >
                {/* The Dot */}
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${index === i ? "w-12" : "w-4 bg-white/20 hover:bg-white/40"}`}
                  style={{ backgroundColor: index === i ? item.color : undefined }}
                />
                {/* Label on Hover */}
                <span className={`absolute top-full mt-2 left-1/2 -translate-x-1/2 text-[9px] text-gray-500 uppercase tracking-widest whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity`}>
                   {item.id}
                </span>
             </button>
          ))}
        </div>

      </div>
    </section>
  );
}