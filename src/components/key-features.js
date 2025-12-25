"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  RiDashboardFill, 
  RiBrainLine, 
  RiExchangeDollarLine, 
  RiArrowRightLine,
  RiVipDiamondFill
} from "react-icons/ri";
import { FaCoins } from "react-icons/fa";

// --- FEATURE DATA ---
const features = [
  {
    id: "dashboard",
    title: "Institutional Grade Dashboard",
    subtitle: "REAL-TIME ANALYTICS",
    description: "Experience an industry-standard interface designed for clarity. Monitor asset performance, track yield metrics, and visualize your portfolio growth with banking-grade precision.",
    color: "#8B5CF6", // Violet
    stat: "LATENCY: 12ms",
    image: "/slider/1.png", 
    icon: RiDashboardFill
  },
  {
    id: "ai",
    title: "Context-Aware AI Intelligence",
    subtitle: "WALLET-SYNCED BOT",
    description: "Our AI Chatbot doesn't just talk; it reads. It analyzes your connected wallet status to provide personalized trading strategies, risk assessments, and portfolio rebalancing suggestions in real-time.",
    color: "#0EA5E9", // Sky Blue
    stat: "MODEL: GPT-4o",
    image: "/slider/2.png",
    icon: RiBrainLine
  },
  {
    id: "fees",
    title: "Zero Fees. Pure Profit.",
    subtitle: "GASLESS INFRASTRUCTURE",
    description: "Stop losing margins to network costs. We subsidize the gas so you can trade freely. Experience a truly frictionless financial ecosystem where 100% of your capital goes into your investment.",
    color: "#10B981", // Emerald
    stat: "COST: $0.00",
    image: "/slider/3.png",
    icon: RiExchangeDollarLine
  },
  {
    id: "earn",
    title: "Complete Tasks, Get Paid",
    subtitle: "DIRECT AIRDROPS",
    description: "Turn engagement into equity. Complete simple social and protocol tasks to earn tokens. Rewards are verified on-chain and dropped directly into your connected wallet instantly.",
    color: "#F59E0B", // Amber
    stat: "PAYOUT: INSTANT",
    image: "/slider/4.png",
    icon: FaCoins
  }
];

const AUTOPLAY_DURATION = 6000; // 6 seconds per slide

export default function LuxuryFeatureSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const progressBarRef = useRef<HTMLDivElement>(null);

  // Auto-rotate logic
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % features.length);
    }, AUTOPLAY_DURATION);

    return () => clearInterval(timer);
  }, [isAutoPlaying, currentIndex]);

  const activeFeature = features[currentIndex];

  return (
    <section className="w-full py-24 bg-[#050505] relative overflow-hidden">
      
      {/* Ambient Background Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none opacity-50" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full pointer-events-none opacity-30" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* Section Header */}
        <div className="mb-16 md:mb-24">
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             transition={{ delay: 0.1 }}
             className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight"
           >
             Precision in <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/50">Every Pixel.</span>
           </motion.h2>
        </div>

        {/* --- MAIN SLIDER CONTENT --- */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          
          {/* LEFT: IMAGE DISPLAY (Span 7 cols) */}
          <div className="lg:col-span-7 relative order-2 lg:order-1">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-[#0A0A0B] shadow-2xl">
              
              {/* Glass Reflection Overlay */}
              <div className="absolute inset-0 z-20 bg-gradient-to-tr from-white/5 to-transparent opacity-50 pointer-events-none" />
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeFeature.id}
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.7, ease: "easeOut" }}
                  className="absolute inset-0 w-full h-full"
                >
                   {/* IMAGE COMPONENT */}
                   <img 
                     src={activeFeature.image} 
                     alt={activeFeature.title}
                     className="w-full h-full object-cover opacity-90"
                   />
                   
                   {/* Dynamic Color Overlay (Subtle Tint) */}
                   <div 
                     className="absolute inset-0 mix-blend-overlay opacity-40"
                     style={{ backgroundColor: activeFeature.color }}
                   />
                </motion.div>
              </AnimatePresence>

              {/* Status Badge on Image */}
              <div className="absolute bottom-6 left-6 z-30 flex items-center gap-3">
                 <div className="h-10 px-4 bg-black/40 backdrop-blur-md border border-white/10 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: activeFeature.color }} />
                    <span className="text-[10px] text-white font-mono uppercase tracking-widest">Live Preview</span>
                 </div>
              </div>

            </div>
          </div>

          {/* RIGHT: TEXT CONTENT (Span 5 cols) */}
          <div className="lg:col-span-5 relative order-1 lg:order-2 flex flex-col justify-center h-full">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeFeature.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="flex flex-col items-start"
              >
                {/* Feature Icon & Tag */}
                <div 
                  className="inline-flex items-center gap-3 px-3 py-1.5 rounded-full mb-8 border backdrop-blur-sm"
                  style={{ 
                    borderColor: `${activeFeature.color}30`,
                    backgroundColor: `${activeFeature.color}08` 
                  }}
                >
                   <activeFeature.icon className="text-lg" style={{ color: activeFeature.color }} />
                   <span style={{ color: activeFeature.color }} className="text-[11px] font-bold tracking-widest uppercase font-mono">
                      {activeFeature.subtitle}
                   </span>
                </div>

                {/* Title */}
                <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-[1.1]">
                   {activeFeature.title}
                </h3>

                {/* Description */}
                <p className="text-[#9CA3AF] text-base md:text-lg leading-relaxed mb-8 font-light">
                   {activeFeature.description}
                </p>

                {/* Technical Specs Divider */}
                <div className="w-full h-px bg-gradient-to-r from-white/10 to-transparent mb-8" />

                {/* Footer Stats & CTA */}
                <div className="flex items-center justify-between w-full">
                   <div>
                      <div className="text-[9px] text-[#52525B] uppercase tracking-widest font-bold mb-1.5">
                         Performance Metric
                      </div>
                      <div className="font-mono text-white text-base tracking-tight">
                         {activeFeature.stat}
                      </div>
                   </div>
                   
                   <button className="group w-12 h-12 rounded-full border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all duration-300">
                      <RiArrowRightLine className="text-xl group-hover:rotate-[-45deg] transition-transform duration-300" />
                   </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

        {/* --- BOTTOM PROGRESS NAVIGATION --- */}
        <div className="mt-20 grid grid-cols-4 gap-4 border-t border-white/5 pt-8">
          {features.map((item, i) => (
             <div 
               key={item.id}
               onClick={() => {
                 setCurrentIndex(i);
                 setIsAutoPlaying(false);
               }}
               className={`cursor-pointer group relative pt-4 transition-all duration-500 ${currentIndex === i ? "opacity-100" : "opacity-30 hover:opacity-60"}`}
             >
                {/* Progress Line */}
                <div className="absolute top-0 left-0 w-full h-[1px] bg-white/20 overflow-hidden">
                   {currentIndex === i && isAutoPlaying && (
                     <motion.div 
                       className="h-full bg-[#8B5CF6]"
                       initial={{ width: "0%" }}
                       animate={{ width: "100%" }}
                       transition={{ duration: AUTOPLAY_DURATION / 1000, ease: "linear" }}
                     />
                   )}
                   {currentIndex === i && !isAutoPlaying && (
                     <div className="h-full w-full bg-[#8B5CF6]" />
                   )}
                </div>

                <div className="flex items-center gap-3">
                  <div className={`text-lg transition-colors ${currentIndex === i ? "text-white" : "text-gray-500"}`}>
                    <item.icon />
                  </div>
                  <div className="hidden md:block">
                    <div className="text-[10px] font-mono uppercase tracking-widest mb-1 text-gray-500">
                      0{i + 1}
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {item.id.charAt(0).toUpperCase() + item.id.slice(1)}
                    </div>
                  </div>
                </div>
             </div>
          ))}
        </div>

      </div>
    </section>
  );
}