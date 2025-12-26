"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";

import { 
  RiRocket2Line, 
  RiBook3Line, 
  RiMenu3Line, 
  RiCloseLine, 
  RiShieldCheckLine, 
  RiPieChart2Line, 
  RiArrowRightUpLine,
  RiArrowRightLine,
  RiPulseLine,
  RiGlobalLine
} from "react-icons/ri";
import Image from "next/image";
import Link from "next/link";

// --- OPTIMIZATION: Better Loading Placeholder ---
// This CSS placeholder mimics the 3D pillar so the user sees content INSTANTLY
const LightPillarPlaceholder = () => (
  <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
     {/* Static CSS imitation of the pillar */}
     <div className="w-[100px] h-screen bg-gradient-to-b from-[#5227FF]/20 via-[#FF9FFC]/10 to-transparent blur-[60px]" />
     <div className="absolute top-0 w-full h-[500px] bg-gradient-radial from-[#5227FF]/10 to-transparent opacity-50" />
  </div>
);

// Lazy Load with visual placeholder
const LightPillar = dynamic(() => import("./ui/light-piller"), { 
  ssr: false,
  loading: () => <LightPillarPlaceholder />
});

// --- ANIMATION VARIANTS (Cinematic Blur) ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15, // Delay between words
      delayChildren: 0.2
    }
  }
};

const wordVariants = {
  hidden: { 
    y: 20, 
    opacity: 0, 
    filter: "blur(12px)", // Start blurry
    scale: 0.95
  },
  visible: { 
    y: 0, 
    opacity: 1, 
    filter: "blur(0px)", // End sharp
    scale: 1,
    transition: { 
      duration: 0.8, 
      ease: [0.2, 0.65, 0.3, 0.9] // "Luxurious" easing curve
    }
  }
};

// --- UI COMPONENTS ---

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/", external: false },
    { name: "Agent", href: "/ai", external: false },
    { name: "Tasks", href: "/ai#tasks", external: false },
    { name: "Bscscan", href: "https://bscscan.com", external: true },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileMenuOpen ? "py-4 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5 shadow-lg" : "py-6 bg-transparent"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer z-50 relative group">
            <Link href='/'>
               <Image src='/logo.png' alt='logo' width={150} height={60} priority />
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-8 bg-white/10 px-8 py-3 rounded-full border border-white/5 backdrop-blur-lg shadow-inner hover:border-white/10 transition-colors">
          {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                className="text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A78BFA] transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4 z-50 relative">
           <Link href='/ai'>
           <button className="hidden md:flex px-6 py-2.5 rounded-lg bg-[#1E1E24] hover:bg-[#2A2A35] border border-white/10 text-white text-sm font-semibold transition-all hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_-5px_rgba(139,92,246,0.3)]">
              Connect Wallet
            </button>
           </Link>
            <button 
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/5 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <RiCloseLine className="w-6 h-6" /> : <RiMenu3Line className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-[#0A0A0B]/95 backdrop-blur-3xl flex flex-col items-center justify-center md:hidden"
          >
            <div className="flex flex-col items-center gap-6 w-full px-8">
            {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1, type: "spring", stiffness: 100 }}
                  className="text-3xl font-bold text-white/70 hover:text-white hover:tracking-wide transition-all cursor-pointer"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </motion.a>
              ))}
              <div className="w-full max-w-xs h-[1px] bg-white/10 my-4" />
             <Link href='/ai'>
             <button className="w-full px-8 max-w-xs py-4 rounded-xl bg-gradient-to-r from-[#8B5CF6] to-[#7C3AED] text-white font-bold text-lg shadow-lg">
                Connect Wallet
              </button>
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const ScannerWidget = ({ delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      className="absolute left-[5%] lg:left-[8%] top-[30%] hidden xl:flex flex-col w-64 p-5 rounded-2xl
                 bg-[#121214]/70 backdrop-blur-xl border border-white/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)]
                 z-10 group hover:border-[#8B5CF6]/40 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#1E1E24] text-[#A78BFA] shadow-inner"><RiShieldCheckLine className="w-4 h-4" /></div>
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">AI Audit</span>
        </div>
        <div className="flex gap-1 items-center bg-[#10B981]/10 px-2 py-0.5 rounded-full border border-[#10B981]/20">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[10px] text-[#10B981] font-mono font-bold">LIVE</span>
        </div>
      </div>
      <div className="relative h-20 bg-[#0A0A0B]/80 rounded-lg border border-white/5 overflow-hidden mb-3 shadow-inner">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-70 animate-[scan_2s_ease-in-out_infinite] shadow-[0_0_10px_#8B5CF6]" />
        <div className="p-3 grid grid-cols-2 gap-2 opacity-50">
           <div className="h-1.5 bg-white/10 rounded-full w-full mb-1" />
           <div className="h-1.5 bg-white/5 rounded-full w-2/3" />
           <div className="h-1.5 bg-white/5 rounded-full w-1/2" />
           <div className="h-1.5 bg-white/10 rounded-full w-full" />
        </div>
      </div>
      <div className="flex justify-between items-end">
        <div>
          <div className="text-[10px] text-gray-500 mb-1 font-medium">Safety Score</div>
          <div className="text-xl font-bold text-white tracking-tight">9.8<span className="text-sm text-gray-500 font-normal">/10</span></div>
        </div>
        <RiPulseLine className="text-[#10B981] w-5 h-5 opacity-80" />
      </div>
    </motion.div>
  );
};

const AssetWidget = ({ delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50, filter: "blur(10px)" }}
      animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
      transition={{ duration: 1.2, delay, ease: "easeOut" }}
      className="absolute right-[5%] lg:right-[8%] bottom-[20%] hidden xl:flex flex-col w-72 p-5 rounded-2xl
                 bg-[#121214]/70 backdrop-blur-xl border border-white/5 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.8)]
                 z-10 group hover:-translate-y-2 transition-transform duration-500 ease-out"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#1E1E24] text-[#F59E0B] shadow-inner"><RiPieChart2Line className="w-4 h-4" /></div>
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Portfolio</span>
        </div>
        <RiGlobalLine className="text-gray-500 w-4 h-4 opacity-50" />
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-14 h-14 rounded-full border-4 border-[#1E1E24] flex items-center justify-center shadow-lg">
             <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path className="text-[#1E1E24]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className="text-[#8B5CF6]" strokeDasharray="70, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
             </svg>
             <span className="text-[10px] font-bold text-white">70%</span>
        </div>
        <div>
          <div className="text-xl font-bold text-white tracking-tight">$42,890</div>
          <div className="flex items-center gap-1 text-[#10B981] text-xs font-medium">
            <RiArrowRightUpLine className="w-3 h-3" /> +12.5%
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const LuxuryButton = ({ text, icon: Icon, primary = false, href = "#" }) => {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.98, translateY: 1 }}
      className={`relative group px-8 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 overflow-hidden transition-all duration-300 isolate
        ${primary 
          ? "text-white shadow-[0_10px_40px_-10px_rgba(139,92,246,0.6)]" 
          : "text-white bg-[#1E1E24]/60 border border-white/10 hover:bg-[#1E1E24] hover:border-white/30"
        }
      `}
    >
      {primary && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] z-[-1]" />
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40" />
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/30" />
          
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
        </>
      )}
      <Icon className={`text-xl w-5 h-5 ${primary ? 'text-white' : 'text-[#A78BFA]'} transition-colors`} />
      <span>{text}</span>
      {primary && <RiArrowRightLine className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />}
    </motion.a>
  );
};

// --- MAIN HERO LAYOUT ---

export default function Hero() {
  return (
    <main className="relative w-full min-h-screen bg-[#0A0A0B] overflow-hidden selection:bg-[#8B5CF6] selection:text-white">
      
      {/* BACKGROUND LAYER 1: Noise & Darkness */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-black/30" />
        <div 
           className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
        />
      </div>

      <Navbar />

      {/* BACKGROUND LAYER 2: 3D Visuals */}
      <div className="absolute inset-0 z-0">
        <LightPillar
            topColor="#5227FF"
            bottomColor="#FF9FFC"
            intensity={1.0}
            rotationSpeed={0.3}
            glowAmount={0.005}
            pillarWidth={3.0}
            pillarHeight={0.4}
            noiseIntensity={0.5}
            pillarRotation={0}
            interactive={false}
            mixBlendMode="normal"
        />
        {/* Gradients to blend 3D into Background */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0A0A0B]/30 to-[#0A0A0B] pointer-events-none" />
      </div>

      <ScannerWidget delay={1.0} />
      <AssetWidget delay={1.2} />

      {/* FOREGROUND: Hero Content */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-20 text-center">

        {/* Staggered Text Animation Container */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          <div className="overflow-hidden mb-2">
            <motion.h1 className="max-w-4xl text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.05]">
              {/* Split words for individual animation */}
              <motion.span variants={wordVariants} className="inline-block mr-4">Master</motion.span>
              <motion.span variants={wordVariants} className="inline-block mr-4">Your</motion.span>
              <br className="hidden md:block" />
              <motion.span 
                variants={wordVariants} 
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#6D28D9] bg-[length:200%_auto] animate-gradient-flow filter drop-shadow-lg pb-2"
              >
                Digital Wealth.
              </motion.span>
            </motion.h1>
          </div>

          <motion.p 
            variants={wordVariants}
            className="max-w-xl mx-auto text-lg md:text-xl text-[#9CA3AF] leading-relaxed font-light"
          >
            The all-in-one command center for crypto. 
            Real-time insights, automated risk analysis, and effortless portfolio tracking.
          </motion.p>
        </motion.div>

        {/* CTA Buttons */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="flex flex-col sm:flex-row items-center gap-5"
        >
          <LuxuryButton text="Launch App" icon={RiRocket2Line} primary={true} href="/ai" />
          <LuxuryButton text="Documentation" icon={RiBook3Line} />
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0B] to-transparent pointer-events-none" />
      </div>
      
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
        @keyframes gradient-flow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-flow {
          animation: gradient-flow 6s ease infinite;
        }
      `}</style>
    </main>
  );
}