"use client";

import React, { Suspense, useRef, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, OrbitControls, Float, Stars } from "@react-three/drei";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { FaRocket, FaBook, FaWallet, FaBars, FaTimes, FaShieldAlt, FaChartPie, FaBolt } from "react-icons/fa";
import { HiSparkles, HiTrendingUp } from "react-icons/hi";

// --- THEME CONSTANTS ---
const COLORS = {
  primary: "#8B5CF6",
  deep: "#7C3AED",
  accent: "#A78BFA",
  dark: "#0A0A0B",
  glass: "rgba(18, 18, 20, 0.6)",
  glassBorder: "rgba(196, 181, 253, 0.15)",
  success: "#10B981",
  textMain: "#FFFFFF",
  textMuted: "#9CA3AF"
};

// --- 3D COMPONENTS ---

// 1. The Living Core (Liquid Sphere)
const LiquidCore = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Subtle breathing animation
    if(meshRef.current) {
      meshRef.current.distort = 0.4 + Math.sin(t * 0.5) * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
      <Sphere ref={meshRef} args={[1, 256, 256]} scale={2.4}>
        <MeshDistortMaterial
          color={COLORS.dark}
          emissive={COLORS.primary}
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.9} // High metalness for luxury look
          distort={0.4}
          speed={1.5}
          envMapIntensity={1}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </Sphere>
    </Float>
  );
};

// 2. Background Particles (The "Net")
const DataNet = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  return (
    <group ref={groupRef} rotation={[0, 0, Math.PI / 6]}>
      <Stars 
        radius={50} 
        depth={50} 
        count={3000} 
        factor={4} 
        saturation={0} 
        fade 
        speed={1} 
      />
    </group>
  );
};

// --- UI COMPONENTS ---

// 1. Navbar Component (Integrated for full Hero UX)
const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = ["Ecosystem", "Features", "Governance", "Docs"];

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "py-4 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5" : "py-6 bg-transparent"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#8B5CF6] to-[#0A0A0B] flex items-center justify-center border border-white/10 group-hover:border-[#A78BFA]/50 transition-colors">
            <FaBolt className="text-white text-lg" />
          </div>
          <span className="text-xl font-bold text-white tracking-wide">PORTLY<span className="text-[#A78BFA]">.AI</span></span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8 bg-white/5 px-8 py-3 rounded-full border border-white/5 backdrop-blur-sm">
          {navLinks.map((link) => (
            <a key={link} href={`#${link.toLowerCase()}`} className="text-sm font-medium text-[#9CA3AF] hover:text-white transition-colors relative group">
              {link}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#A78BFA] transition-all group-hover:w-full" />
            </a>
          ))}
        </div>

        {/* Action & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <button className="hidden md:flex px-5 py-2.5 rounded-lg bg-[#1E1E24] hover:bg-[#2A2A35] border border-white/10 text-white text-sm font-medium transition-all hover:scale-105 active:scale-95">
            Connect Wallet
          </button>
          <button 
            className="md:hidden text-white text-xl"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>
    </motion.nav>
  );
};

// 2. Floating Holographic Widget (Left)
const ScannerWidget = ({ delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay }}
      className="absolute left-[5%] lg:left-[12%] top-[30%] hidden xl:flex flex-col w-64 p-4 rounded-2xl
                 bg-[#121214]/80 backdrop-blur-xl border border-[#C4B5FD]/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]
                 z-10 group hover:border-[#8B5CF6]/30 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#1E1E24] text-[#A78BFA]"><FaShieldAlt /></div>
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Risk Scanner</span>
        </div>
        <div className="flex gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-[10px] text-[#10B981] font-mono">LIVE</span>
        </div>
      </div>
      
      {/* Fake Scanning Animation */}
      <div className="relative h-24 bg-[#0A0A0B] rounded-lg border border-white/5 overflow-hidden mb-3">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-70 animate-[scan_2s_ease-in-out_infinite]" />
        <div className="p-3 grid grid-cols-2 gap-2">
           <div className="h-2 bg-white/10 rounded w-full mb-1" />
           <div className="h-2 bg-white/5 rounded w-2/3" />
           <div className="h-2 bg-white/5 rounded w-1/2" />
           <div className="h-2 bg-white/10 rounded w-full" />
        </div>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <div className="text-[10px] text-gray-500 mb-1">Portfolio Audit</div>
          <div className="text-lg font-bold text-white">98/100</div>
        </div>
        <div className="px-2 py-1 rounded bg-[#10B981]/10 text-[#10B981] text-xs font-medium border border-[#10B981]/20">
          Safe
        </div>
      </div>
      
      {/* Decorative Glow */}
      <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-b from-[#8B5CF6]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};

// 3. Floating Holographic Widget (Right)
const AssetWidget = ({ delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 1, delay }}
      className="absolute right-[5%] lg:right-[12%] bottom-[25%] hidden xl:flex flex-col w-72 p-5 rounded-2xl
                 bg-[#121214]/80 backdrop-blur-xl border border-[#C4B5FD]/10 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)]
                 z-10 group hover:-translate-y-1 transition-transform duration-300"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-[#1E1E24] text-[#F59E0B]"><FaChartPie /></div>
          <span className="text-xs font-semibold text-gray-300 uppercase tracking-wider">Asset Allocation</span>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16 rounded-full border-4 border-[#1E1E24] flex items-center justify-center">
             <svg className="absolute w-full h-full -rotate-90" viewBox="0 0 36 36">
                {/* Donut Chart Segment */}
                <path className="text-[#1E1E24]" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
                <path className="text-[#8B5CF6]" strokeDasharray="70, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="4" />
             </svg>
             <span className="text-[10px] font-bold text-white">70%</span>
        </div>
        <div>
          <div className="text-xl font-bold text-white">$42,890.50</div>
          <div className="flex items-center gap-1 text-[#10B981] text-xs">
            <HiTrendingUp /> +12.5% (24h)
          </div>
        </div>
      </div>

      <div className="w-full h-1 bg-[#1E1E24] rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "70%" }}
          transition={{ duration: 1.5, delay: delay + 0.5 }}
          className="h-full bg-gradient-to-r from-[#8B5CF6] to-[#A78BFA]" 
        />
      </div>
    </motion.div>
  );
};

// 4. Luxury 3D Buttons
const LuxuryButton = ({ text, icon: Icon, primary = false, href = "#" }) => {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.02, translateY: -2 }}
      whileTap={{ scale: 0.98, translateY: 1 }}
      className={`relative group px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-3 overflow-hidden transition-all duration-300 isolate
        ${primary 
          ? "text-white shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]" 
          : "text-white bg-[#1E1E24]/50 border border-white/10 hover:bg-[#1E1E24]"
        }
      `}
    >
      {primary && (
        <>
          <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] z-[-1]" />
          {/* Top highlight for 3D depth */}
          <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40" />
          {/* Bottom shadow */}
          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/20" />
          
          {/* Inner Glow Hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />
        </>
      )}
      
      <Icon className={`text-xl ${primary ? 'text-white' : 'text-[#A78BFA]'} transition-colors`} />
      <span>{text}</span>
    </motion.a>
  );
};

// --- MAIN HERO LAYOUT ---

export default function Hero() {
  return (
    <main className="relative w-full min-h-screen bg-[#0A0A0B] overflow-hidden selection:bg-[#8B5CF6] selection:text-white">
      
      <Navbar />

      {/* 1. The Immersive 3D Background */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 6], fov: 45 }} gl={{ antialias: true, alpha: true }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.4} />
            <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#C4B5FD" />
            <pointLight position={[-10, -10, -10]} intensity={1} color="#7C3AED" />
            
            <LiquidCore />
            <DataNet />
            
            {/* Environment for shiny reflections */}
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI/1.8} minPolarAngle={Math.PI/2.2} />
          </Suspense>
        </Canvas>
        
        {/* Cinematic Fog Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-[#0A0A0B] to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-[#0A0A0B]/20 to-[#0A0A0B] pointer-events-none" />
      </div>

      {/* 2. Floating UX Elements */}
      <ScannerWidget delay={1.2} />
      <AssetWidget delay={1.4} />

      {/* 3. Main Content Area */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pt-20 text-center">
        
        {/* Animated Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-[#1E1E24]/80 border border-[#8B5CF6]/30 backdrop-blur-md shadow-lg shadow-[#8B5CF6]/10"
        >
          <HiSparkles className="text-[#A78BFA]" />
          <span className="text-xs font-bold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-white to-[#C4B5FD] uppercase">
            AI-Powered Wealth Intelligence
          </span>
        </motion.div>

        {/* Hero Heading */}
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="max-w-5xl text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight mb-8 leading-[1.1]"
        >
          Transform Data into <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-[#A78BFA] via-[#8B5CF6] to-[#7C3AED] filter drop-shadow-lg">
            Actionable Wealth.
          </span>
        </motion.h1>

        {/* Hero Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-2xl text-lg md:text-xl text-[#9CA3AF] mb-10 leading-relaxed font-light"
        >
          Portly connects your wallets across chains to provide instant risk analysis, 
          diversification scores, and predictive market insights—all in one cinematic interface.
        </motion.p>

        {/* CTA Group */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-5"
        >
          <LuxuryButton text="Launch Dashboard" icon={FaRocket} primary={true} />
          <LuxuryButton text="Read Documentation" icon={FaBook} />
        </motion.div>

        {/* Social Proof / Trusted By (Bottom Footer of Hero) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-0 right-0 flex justify-center gap-8 opacity-50 grayscale mix-blend-screen"
        >
           {/* Placeholders for partner logos (Text for now to keep it single file) */}
           <span className="font-bold text-white/40 tracking-widest text-sm">ETHEREUM</span>
           <span className="font-bold text-white/40 tracking-widest text-sm">POLYGON</span>
           <span className="font-bold text-white/40 tracking-widest text-sm">BINANCE</span>
           <span className="font-bold text-white/40 tracking-widest text-sm">CHAINLINK</span>
        </motion.div>
      </div>
      
      {/* Global CSS for custom animations (Scanning line) */}
      <style jsx global>{`
        @keyframes scan {
          0%, 100% { top: 0%; opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </main>
  );
}