"use client";

import React, { useRef, useState, Suspense } from "react";
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Float, 
  MeshDistortMaterial, 
  Icosahedron, 
  Torus, 
  Cylinder, 
  Sparkles, 
  Environment, 
  Html 
} from "@react-three/drei";
import { 
  FaWallet, 
  FaRocket, 
  FaCheckCircle 
} from "react-icons/fa";
import { MdAutoGraph, MdSecurity } from "react-icons/md";
import { BsLightningChargeFill } from "react-icons/bs";
import * as THREE from "three";

// --- 3D COMPONENT 1: WALLET CONNECTION (The "Link") ---
const WalletScene = () => {
  const meshRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if(meshRef.current) {
        meshRef.current.rotation.y = t * 0.4;
        meshRef.current.rotation.z = Math.sin(t * 0.5) * 0.2;
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        {/* Abstract Geometric Wallet Representation */}
        <Icosahedron ref={meshRef} args={[1.2, 0]}>
          <MeshDistortMaterial 
            color="#10B981" 
            emissive="#065F46" 
            emissiveIntensity={0.5} 
            wireframe={false} 
            roughness={0.1} 
            metalness={0.8}
            distort={0.3} 
            speed={2} 
          />
        </Icosahedron>
        {/* Floating Particles/Network */}
        <Sparkles count={20} scale={3} size={2} speed={0.4} opacity={0.5} color="#34D399" />
      </Float>
    </group>
  );
};

// --- 3D COMPONENT 2: AI DASHBOARD (The "Scanner") ---
const DashboardScene = () => {
  const groupRef = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if(groupRef.current) {
        groupRef.current.rotation.x = Math.PI / 4;
        groupRef.current.rotation.z = t * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      <Float speed={4} rotationIntensity={0} floatIntensity={0.2}>
        {/* Scanning Rings */}
        <Torus args={[1.5, 0.05, 16, 100]}>
          <meshBasicMaterial color="#22D3EE" transparent opacity={0.6} />
        </Torus>
        <Torus args={[1.0, 0.05, 16, 100]} rotation={[Math.PI / 2, 0, 0]}>
           <meshBasicMaterial color="#8B5CF6" transparent opacity={0.6} />
        </Torus>
        
        {/* Central Core */}
        <mesh>
           <sphereGeometry args={[0.5, 32, 32]} />
           <meshStandardMaterial color="#ffffff" emissive="#22D3EE" emissiveIntensity={1} />
        </mesh>
      </Float>
    </group>
  );
};

// --- 3D COMPONENT 3: REWARDS (The "Token") ---
const RewardScene = () => {
  const coinRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if(coinRef.current) {
        coinRef.current.rotation.y = t * 3; // Fast spin
    }
  });

  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <group ref={coinRef} rotation={[Math.PI / 2, 0, 0]}>
            {/* The Token */}
            <Cylinder args={[1.2, 1.2, 0.2, 32]}>
                <meshStandardMaterial color="#F59E0B" metalness={0.9} roughness={0.1} />
            </Cylinder>
            <Torus args={[1.2, 0.1, 16, 32]}>
                <meshStandardMaterial color="#FBBF24" metalness={1} roughness={0.1} />
            </Torus>
        </group>
        {/* Speed Lines / Sparkles */}
        <Sparkles count={40} scale={4} size={5} speed={2} opacity={0.8} color="#FDE68A" />
      </Float>
    </group>
  );
};

// --- SVG CONNECTOR LINE COMPONENT ---
const TimelineConnector = ({ scrollYProgress }) => {
    const scaleY = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    return (
        <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 z-0 hidden md:block">
            {/* Background Line */}
            <div className="absolute inset-0 bg-white/10 w-full h-full" />
            {/* Animated Fill Line */}
            <motion.div 
                className="absolute top-0 left-0 w-full bg-gradient-to-b from-[#10B981] via-[#22D3EE] to-[#F59E0B]"
                style={{ height: "100%", scaleY, transformOrigin: "top" }}
            />
        </div>
    );
};

// --- STEP CARD COMPONENT ---
const WorkflowStep = ({ 
  index, 
  title, 
  description, 
  SceneComponent, 
  icon: Icon, 
  align = "left",
  actionText
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <div ref={ref} className={`relative z-10 flex flex-col md:flex-row items-center gap-12 mb-32 ${align === "right" ? "md:flex-row-reverse" : ""}`}>
      
      {/* 3D Visual Container */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.8 }}
        className="w-full md:w-1/2 h-[350px] relative"
      >
        <div className="absolute inset-0 bg-gradient-to-tr from-[#10B981]/10 to-transparent rounded-full blur-[80px]" />
        
        {/* Tech Borders SVG Overlay */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <motion.rect 
                x="10%" y="10%" width="80%" height="80%" rx="20"
                fill="none" stroke="white" strokeWidth="1" strokeDasharray="10 10"
                initial={{ pathLength: 0 }}
                animate={isInView ? { pathLength: 1 } : { pathLength: 0 }}
                transition={{ duration: 2 }}
            />
            <circle cx="50%" cy="50%" r="5" fill="#10B981" />
        </svg>

        {/* 3D Canvas */}
        <Canvas camera={{ position: [0, 0, 4] }}>
          <Suspense fallback={null}>
             <ambientLight intensity={0.5} />
             <spotLight position={[10, 10, 10]} intensity={1} color="white" />
             <Environment preset="city" />
             <SceneComponent />
          </Suspense>
        </Canvas>
      </motion.div>

      {/* Text Content */}
      <motion.div 
        initial={{ opacity: 0, x: align === "left" ? 50 : -50 }}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: align === "left" ? 50 : -50 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full md:w-1/2 px-6"
      >
        {/* Step Indicator */}
        <div className="flex items-center gap-4 mb-4">
             <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1E1E24] border border-white/10 text-[#10B981] font-bold shadow-[0_0_15px_-3px_rgba(16,185,129,0.4)]">
                {index + 1}
             </div>
             <div className="h-px w-20 bg-gradient-to-r from-[#10B981] to-transparent" />
        </div>

        <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center gap-3">
          <Icon className="text-[#10B981]" /> {title}
        </h3>
        
        <p className="text-gray-400 text-lg leading-relaxed mb-8">
          {description}
        </p>

        {/* Action Button */}
        <button className="group relative px-6 py-3 rounded-lg bg-white/5 border border-white/10 overflow-hidden hover:border-[#10B981]/50 transition-colors">
          <div className="absolute inset-0 bg-[#10B981]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative flex items-center gap-2 text-white font-medium">
             {actionText} <FaCheckCircle className="text-[#10B981] opacity-0 group-hover:opacity-100 transition-opacity" />
          </span>
        </button>

      </motion.div>
    </div>
  );
};

// --- MAIN COMPONENT ---
export default function WorkflowSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const steps = [
    {
      title: "Connect & Sync",
      description: "Connect your MetaMask wallet securely via the BSC network. Whether using the browser extension or the mobile app, integration is seamless and instant.",
      SceneComponent: WalletScene,
      icon: FaWallet,
      actionText: "Connect Wallet",
      align: "left"
    },
    {
      title: "AI Intelligence",
      description: "Your AI-powered dashboard activates immediately. Visualize complex data, receive instant risk analysis, and gain actionable insights in a clean, high-performance interface.",
      SceneComponent: DashboardScene,
      icon: MdAutoGraph,
      actionText: "View Dashboard",
      align: "right"
    },
    {
      title: "Instant Rewards",
      description: "Navigate to the Rewards tab. Complete simple tasks like following on X, reposting, or liking. Within 0.9s, your reward tokens are automatically credited to your wallet.",
      SceneComponent: RewardScene,
      icon: BsLightningChargeFill,
      actionText: "Start Earning",
      align: "left"
    }
  ];

  return (
    <section ref={containerRef} className="relative w-full py-24 bg-[#050505] overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#10B981]/50 to-transparent" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-[#10B981]/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[500px] h-[500px] bg-[#8B5CF6]/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Header */}
        <div className="text-center mb-32">
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6 }}
             className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10B981]/10 border border-[#10B981]/20 text-[#10B981] text-sm font-semibold mb-6"
           >
             <MdSecurity /> Secured by Blockchain
           </motion.div>
           
           <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.1 }}
             className="text-4xl md:text-6xl font-bold text-white mb-6"
           >
             How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#10B981] to-[#22D3EE]">Works</span>
           </motion.h2>
           
           <motion.p 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.6, delay: 0.2 }}
             className="text-gray-400 max-w-2xl mx-auto text-lg"
           >
             From wallet connection to instant rewards. Experience the fastest AI-powered DeFi ecosystem.
           </motion.p>
        </div>

        {/* The Connector Line */}
        <TimelineConnector scrollYProgress={scrollYProgress} />

        {/* Steps */}
        <div className="relative">
          {steps.map((step, index) => (
            <WorkflowStep 
              key={index}
              index={index}
              {...step}
            />
          ))}
        </div>

        {/* Final CTA */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="text-center mt-12 relative z-10"
        >
            <div className="inline-block p-[1px] rounded-full bg-gradient-to-r from-[#10B981] via-white to-[#8B5CF6]">
                <button className="px-10 py-4 rounded-full bg-[#050505] text-white font-bold text-lg hover:bg-white/10 transition-colors flex items-center gap-3">
                   <FaRocket className="text-[#F59E0B]" /> Launch App Now
                </button>
            </div>
        </motion.div>

      </div>
    </section>
  );
}