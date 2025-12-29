"use client";

import React, { useRef, useState, useMemo, Suspense } from "react";
import { motion, useInView } from "framer-motion";
import { Canvas, useFrame } from "@react-three/fiber";
import { 
  Points, 
  PointMaterial, 
  Float, 
  Sphere, 
  MeshDistortMaterial, 
  Cylinder,
  OrbitControls,
  Environment,
  Sparkles
} from "@react-three/drei";
import { PiEngineBold, PiTrophy } from "react-icons/pi";
import { IoLayersOutline } from "react-icons/io5";
import * as THREE from "three";
import { Edges, Text, useTexture, Billboard } from '@react-three/drei';
import * as random from "maath/random/dist/maath-random.esm";

import { 
  FaArrowRight, 
  FaEthereum
} from "react-icons/fa";
import { SiSolana, SiPolygon } from "react-icons/si";
import { MdSpeed, MdAutoGraph } from "react-icons/md";

const NeuralBrain = (props) => {
  const ref = useRef();
  const shellRef = useRef();
  
  // 1. Denser, larger particle cloud for "Big Data" feel
  const [sphere] = useState(() => random.inSphere(new Float32Array(8000), { radius: 1.8 }));

  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();

    // Rotate the particle cloud slowly
    if (ref.current) {
      ref.current.rotation.x -= delta / 20;
      ref.current.rotation.y -= delta / 25;
    }

    // Rotate the Cyber Shell in opposite direction
    if (shellRef.current) {
      shellRef.current.rotation.x += delta / 10;
      shellRef.current.rotation.y += delta / 10;
    }
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]} {...props}>
      
      {/* --- LAYER 1: The Neural Cloud --- */}
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial
          transparent
          color="#A78BFA"
          size={0.015} // Fine dust
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Points>

      {/* --- LAYER 2: The Sentient Core (Liquid Metal) --- */}
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <Sphere args={[0.7, 128, 128]}> {/* High poly for smooth distortion */}
            <MeshDistortMaterial 
                color="#2e1065"      // Deep, dark violet base
                emissive="#7C3AED"   // Glowing purple inner
                emissiveIntensity={0.8}
                speed={2}            // Slow, organic movement
                distort={0.4}        // Liquid bubble effect
                roughness={0.1}      // Wet look
                metalness={1.0}      // Chrome finish
                clearcoat={1.0}      // Varnish layer
                clearcoatRoughness={0.1}
            />
        </Sphere>
      </Float>

      {/* --- LAYER 3: Cybernetic Wireframe Shell --- */}
      <mesh ref={shellRef} scale={[1.1, 1.1, 1.1]}>
        <icosahedronGeometry args={[1, 2]} />
        <meshStandardMaterial 
            color="#8B5CF6" 
            wireframe 
            transparent 
            opacity={0.1} 
            side={THREE.DoubleSide}
        />
      </mesh>

      {/* --- LAYER 4: Orbiting Synapses (Data Nodes) --- */}
      <OrbitingSynapse radius={1.4} speed={1} color="#38bdf8" offset={0} /> {/* Blue Node */}
      <OrbitingSynapse radius={1.6} speed={-0.8} color="#f472b6" offset={2} /> {/* Pink Node */}

    </group>
  );
};

// Helper: Small glowing orbs orbiting the brain
const OrbitingSynapse = ({ radius, speed, color, offset }) => {
    const ref = useRef();
    
    useFrame(({ clock }) => {
        const t = clock.getElapsedTime() * speed + offset;
        // Orbital Math
        ref.current.position.x = Math.sin(t) * radius;
        ref.current.position.z = Math.cos(t) * radius;
        ref.current.position.y = Math.sin(t * 0.5) * (radius * 0.5); // Wobbly orbit
    });

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshBasicMaterial color={color} />
            {/* Glow Halo */}
            <pointLight color={color} distance={1} intensity={2} />
        </mesh>
    );
};

// ------------------------------------------------------------------
// 3D SCENE 2: FLOATING CONNECTED NODES (Multi-Chain Reactor)
// ------------------------------------------------------------------
const CHAINS = [
    { name: 'BNB', color: '#F0B90B', url: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png' },
    { name: 'ETH', color: '#627EEA', url: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png' },
    { name: 'SOL', color: '#14F195', url: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/solana/info/logo.png' },
    { name: 'MATIC', color: '#8247E5', url: 'https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png' },
  ];
  
  // --- 1. BINARY DATA (Inside the Glass Core) ---
  const BinaryData = ({ count = 20 }) => {
    const data = useMemo(() => new Array(count).fill(0).map(() => ({
        pos: [(Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8, (Math.random()-0.5)*0.8],
        val: Math.random() > 0.5 ? '1' : '0',
        color: Math.random() > 0.5 ? '#A78BFA' : '#ffffff',
        speed: 0.2 + Math.random() * 0.5
    })), [count]);
  
    return (
      <group>
        {data.map((bit, i) => (
          <Float key={i} speed={bit.speed} rotationIntensity={0.5} floatIntensity={0.5}>
              <Text position={bit.pos} fontSize={0.1} color={bit.color} anchorX="center" anchorY="middle">
                  {bit.val}
              </Text>
          </Float>
        ))}
      </group>
    );
  };
  
  // --- 2. THE GLASS CORE (Square Container) ---
  const CentralGlassCore = () => {
      return (
          <group>
              {/* Glass Box */}
              <mesh>
                  <boxGeometry args={[1.1, 1.1, 1.1]} />
                  <meshPhysicalMaterial 
                      color="#ffffff"
                      transmission={0.6}
                      roughness={0.2}
                      metalness={0}
                      ior={1.5}
                      thickness={1.5}
                      clearcoat={1}
                      attenuationColor="#A78BFA"
                      attenuationDistance={1}
                  />
              </mesh>
              {/* Wireframe Edge */}
              <mesh>
                  <boxGeometry args={[1.12, 1.12, 1.12]} />
                  <meshBasicMaterial color="#7C3AED" wireframe opacity={0.2} transparent />
              </mesh>
              {/* Binary Fill */}
              <BinaryData count={30} />
          </group>
      );
  };
  
  // --- 3. MOVING PARTICLES (Renamed from DataPulse/OrbitingSynapse) ---
  
  const ChainNode = ({ data, index, total }) => {
      const texture = useTexture(data.url);
      const angle = (index / total) * Math.PI * 2;
      const radius = 1.6; // Reduced radius to fit in view
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
  
      return (
          <group position={[x, 0, z]}>
              {/* Icon */}
              <Billboard follow={true}>
                  <mesh>
                      <circleGeometry args={[0.25, 32]} />
                      <meshBasicMaterial map={texture} transparent />
                  </mesh>
                  <mesh position={[0, 0, -0.02]}>
                      <circleGeometry args={[0.28, 32]} />
                      <meshBasicMaterial color={data.color} transparent opacity={0.5} />
                  </mesh>
              </Billboard>
  
              {/* Label */}
              <Billboard position={[0, -0.35, 0]}>
                  <Text fontSize={0.15} color="white" outlineWidth={0.01} outlineColor="black">
                      {data.name}
                  </Text>
              </Billboard>
  
              {/* Pipe to Center */}
              <mesh position={[-x/2, 0, -z/2]} rotation={[0, -angle, Math.PI / 2]}>
                  <cylinderGeometry args={[0.02, 0.02, radius, 8]} />
                  <meshStandardMaterial color="#8B5CF6" emissive="#4C1D95" transparent opacity={0.3} />
              </mesh>
          </group>
      );
  };
  
  // --- 5. MAIN COMPONENT (Export this) ---
  const MultiChainNexus = () => {
      const group = useRef();
      
      useFrame((state) => {
          const t = state.clock.getElapsedTime();
          if (group.current) {
              group.current.rotation.y = t * 0.1; // Gentle rotation
          }
      });
  
      return (
          <group ref={group} rotation={[0.2, 0, 0]}> {/* Slight tilt to see depth */}
              <CentralGlassCore />
              {CHAINS.map((chain, i) => (
                  <ChainNode key={chain.name} data={chain} index={i} total={CHAINS.length} />
              ))}
              <pointLight distance={3} intensity={2} color="#8B5CF6" />
          </group>
      );
  };

// ------------------------------------------------------------------
// 3D SCENE 3: SPINNING GOLD TOKEN (Gamification)
// ------------------------------------------------------------------
const SpinningToken = () => {
    const mesh = useRef();
    
    useFrame((state, delta) => {
        if (mesh.current) {
            // Complex Gyroscopic Spin
            // Constant rotation on Y (Spinning)
            mesh.current.rotation.y += delta * 1.5;
            
            // Gentle wobbling on X and Z to catch the light (Shiny effect)
            mesh.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 1) * 0.2;
            mesh.current.rotation.z = Math.cos(state.clock.getElapsedTime() * 0.8) * 0.1;
        }
    });

    const goldenMaterial = new THREE.MeshPhysicalMaterial({
        color: "#FBBF24", // Richer Gold
        metalness: 1,
        roughness: 0.1,
        clearcoat: 1,     // Polish layer
        clearcoatRoughness: 0.1,
        reflectivity: 1,
        emissive: "#B45309",
        emissiveIntensity: 0.2
    });

    return (
        <group>
            {/* Float wrapper gives it that weightless crypto feel */}
            <Float speed={4} rotationIntensity={1} floatIntensity={1}>
                <group ref={mesh} rotation={[Math.PI / 2, 0, 0]}>
                    
                    {/* 1. The Coin Edge (Rim) */}
                    <Cylinder args={[1.2, 1.2, 0.15, 64]}>
                        <primitive object={goldenMaterial} />
                    </Cylinder>

                    {/* 2. The Face (Recessed slightly) */}
                    <Cylinder args={[1.05, 1.05, 0.16, 64]}>
                         <meshStandardMaterial 
                            color="#F59E0B" 
                            metalness={0.8} 
                            roughness={0.2} 
                        />
                    </Cylinder>

                    {/* 3. The Text (Front Side) */}
                    <group position={[0, 0.09, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                        <Text
                            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                            fontSize={0.5}
                            letterSpacing={-0.05}
                            color="#FFFFFF" // White gold look for contrast
                            anchorX="center"
                            anchorY="middle"
                            fontWeight="bold"
                        >
                            $POTL
                            <meshStandardMaterial color="#FFFBEB" emissive="#F59E0B" emissiveIntensity={0.5} />
                        </Text>
                        
                        {/* Decorative Arc/Ring on face */}
                        <mesh position={[0, 0, -0.01]}>
                            <ringGeometry args={[0.95, 1.0, 64]} />
                            <meshStandardMaterial color="#B45309" />
                        </mesh>
                    </group>

                    {/* 4. The Text (Back Side - Rotated 180) */}
                    <group position={[0, -0.09, 0]} rotation={[Math.PI / 2, 0, Math.PI]}>
                        <Text
                            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
                            fontSize={0.5}
                            letterSpacing={-0.05}
                            color="#FFFFFF"
                            anchorX="center"
                            anchorY="middle"
                            fontWeight="bold"
                        >
                            $POTL
                            <meshStandardMaterial color="#FFFBEB" emissive="#F59E0B" emissiveIntensity={0.5} />
                        </Text>
                    </group>
                    
                </group>
            </Float>

            {/* Magical Gold Dust */}
            <Sparkles count={50} scale={5} size={3} speed={0.4} opacity={0.6} color="#FCD34D" />
            
            {/* Bloom Glow (Simulated with Point Light) */}
            <pointLight distance={3} intensity={2} color="#F59E0B" />
        </group>
    );
};

// ------------------------------------------------------------------
// 3D SCENE 4: DATA EQUALIZER (Real-Time Sync)
// ------------------------------------------------------------------
const BarWithData = ({ index }) => {
    const meshRef = useRef();
    const textRef = useRef();
    
    // Random offset so bars don't move in unison
    const offset = index * 0.8;

    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        
        // 1. Slowed down speed (t * 0.5)
        const wave = Math.sin(t * 0.5 + offset);
        
        // Calculate Height (Range approx 0.5 to 2.5)
        const targetScale = 0.8 + Math.abs(wave) * 1.8; 
        
        if (meshRef.current) {
            // Smoothly animate height
            meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, targetScale, 0.1);
            meshRef.current.position.y = meshRef.current.scale.y / 2;
            
            // Adjust glow intensity based on height
            meshRef.current.material.emissiveIntensity = 0.5 + Math.abs(wave);
        }

        // 2. Update Number based on height
        if (textRef.current && meshRef.current) {
            // Position text just above the bar
            textRef.current.position.y = meshRef.current.scale.y + 0.3;
            
            // Map height to a number (e.g., 0.8 -> 30, 2.5 -> 99)
            const val = Math.floor(meshRef.current.scale.y * 38);
            
            // Only trigger update if number changes (Performance)
            if (textRef.current.text !== str(val)) {
                textRef.current.text = val + '%';
            }
        }
    });

    // Helper to safely convert to string
    const str = (n) => '' + n + '%';

    return (
        <group position={[index * 0.5, 0, 0]}>
            <mesh ref={meshRef}>
                <boxGeometry args={[0.3, 1, 0.3]} />
                <meshPhysicalMaterial 
                    color="#2e1065"      
                    emissive="#8B5CF6"   
                    metalness={0.9}      
                    roughness={0.1}      
                    clearcoat={1.0}
                />
                <Edges threshold={15} color="white" scale={1.05} opacity={0.3} transparent />
            </mesh>

            {/* 3. Floating Data Number */}
            <Text
                ref={textRef}
                position={[0, 1.5, 0]} // Initial position
                fontSize={0.25}
                color="white"
                anchorX="center"
                anchorY="middle"
                font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
            >
                0%
            </Text>
        </group>
    );
};

const DataEqualizer = () => {
    const floorRef = useRef();

    useFrame((state) => {
        // Scroll Floor Grid slowly
        if(floorRef.current) {
            floorRef.current.position.z = (state.clock.getElapsedTime() * 0.2) % 1;
        }
    });

    return (
        <group position={[-1.2, -1.5, 0]}>
            <pointLight position={[2, 2, 2]} intensity={2} color="#8B5CF6" distance={5} />

            {/* Render 6 Independent Bars */}
            {[...Array(6)].map((_, i) => (
                <BarWithData key={i} index={i} />
            ))}
            
            <gridHelper 
                ref={floorRef}
                args={[12, 24, 0x8B5CF6, 0x27272a]} 
                position={[1.25, 0, 0]} 
            />
            
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[1.25, -0.01, 0]}>
                <planeGeometry args={[12, 12]} />
                <meshBasicMaterial color="#000000" opacity={0.8} transparent />
            </mesh>
        </group>
    );
};

// ------------------------------------------------------------------
// COMPONENT: BENTO CARD WRAPPER
// ------------------------------------------------------------------
const BentoCard = ({ children, className = "", title, subtitle, icon: Icon, delay = 0, overlayContent }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, margin: "-50px" });

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
            transition={{ duration: 0.6, delay, ease: "easeOut" }}
            className={`group relative overflow-hidden rounded-3xl bg-[#09090b] border border-white/5 shadow-xl ${className}`}
        >
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-[radial-gradient(circle_at_center,_#8B5CF608,_transparent_70%)] pointer-events-none" />

            
            {/* Animated Border Glow */}
            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(800px_circle_at_var(--mouse-x)_var(--mouse-y),rgba(139,92,246,0.15),transparent_40%)]" />

            {/* Main Content */}
            <div className="relative z-20 flex flex-col h-full p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center gap-4 mb-4">
                    <div className="w-10 h-10 rounded-lg bg-[#27272A] border border-white/10 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#8B5CF6]/20 group-hover:border-[#8B5CF6]/50 transition-all duration-300">
                        <Icon size={22} className="text-[#A78BFA] group-hover:text-white" />
                    </div>
                    <h3 className="text-xl fontmain font-semibold text-white tracking-tight group-hover:text-[#A78BFA] transition-colors">{title}</h3>
                </div>

                {/* Subtitle */}
                <p className="text-[#A1A1AA] text-sm  mb-6">
                    {subtitle}
                </p>

                {/* 3D Visual Container */}
                <div className="flex-1 relative w-full min-h-[200px] rounded-2xl overflow-hidden border border-white/5 bg-black/40 shadow-inner">
                    {children}
                    
                    {/* Vignette Overlay for Depth */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />
                    
                    {/* UI Overlay (React/SVG) */}
                    {overlayContent}
                </div>
            </div>
        </motion.div>
    );
};


// ------------------------------------------------------------------
// MAIN COMPONENT: ABOUT SECTION
// ------------------------------------------------------------------
export default function AboutSection() {
  return (
    <section className="relative w-full py-24 px-4 bg-[#050505] overflow-hidden" id="about">
      
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[20%] w-[800px] h-[800px] bg-[#7C3AED]/5 blur-[120px] rounded-full mix-blend-screen" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center sm:mb-20 mb-10 max-w-3xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl fontmain font-bold text-white mb-6 tracking-tight leading-[1.1]"
          >
            Intelligence Meets <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A78BFA] via-[#8B5CF6] to-[#7C3AED]">
                Infinite Scale.
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-[#A1A1AA] text-sm sm:text-lg text-balance leading-relaxed"
          >
            Portly isn't just a tracker. It's a sentient layer on top of the blockchain, 
            processing millions of signals to guide your wealth creation.
          </motion.p>
        </div>

        {/* --- 3D BENTO GRID --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto">
          
          {/* 1. SENTIENT AI (Large: Col Span 2) */}
          <BentoCard 
            className="md:col-span-2 min-h-[350px]"
            title="Sentient AI Engine"
            subtitle="Deep learning models analyze market sentiment and on-chain volume in real-time."
            icon={PiEngineBold}
            delay={0.1}
            overlayContent={
               <div className="absolute top-4 right-4 bg-[#0A0A0B]/80 border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-3 backdrop-blur-md z-10">
                   <div className="flex gap-1">
                      <div className="w-1 h-3 bg-[#A78BFA] rounded-full animate-[pulse_1s_ease-in-out_infinite]" />
                      <div className="w-1 h-3 bg-[#A78BFA] rounded-full animate-[pulse_1s_ease-in-out_0.2s_infinite]" />
                      <div className="w-1 h-3 bg-[#A78BFA] rounded-full animate-[pulse_1s_ease-in-out_0.4s_infinite]" />
                   </div>
                   <span className="text-[10px] font-mono text-[#A78BFA] tracking-wider">ANALYZING</span>
               </div>
            }
          >
             <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <NeuralBrain />
                </Suspense>
             </Canvas>
          </BentoCard>

          {/* 2. REAL-TIME SYNC (Tall: Row Span 2) */}
          <BentoCard 
            className="md:col-span-1 md:row-span-2 bg-[#0E0E10] min-h-[500px]"
            title="Zero-Latency Sync"
            subtitle="WebSocket pipes ensure your portfolio updates the millisecond a block is finalized."
            icon={MdSpeed}
            delay={0.2}
            overlayContent={
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0A0A0B] to-transparent">
                   <div className="flex flex-col gap-2">
                      {[1, 2, 3].map((i) => (
                          <motion.div 
                            key={i} 
                            initial={{ x: 50, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: i * 0.5, repeat: Infinity, repeatDelay: 3, duration: 0.5 }}
                            className="flex items-center justify-between p-2 rounded bg-[#1E1E24]/80 border border-white/5 backdrop-blur-sm"
                          >
                              <div className="flex items-center gap-2">
                                  <MdAutoGraph className="text-[#10B981] w-3 h-3" />
                                  <span className="text-[10px] text-gray-400 font-mono">TX_HASH_8x9{i}</span>
                              </div>
                              <span className="text-[9px] font-bold text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">CONFIRMED</span>
                          </motion.div>
                      ))}
                   </div>
                </div>
            }
          >
             <Canvas camera={{ position: [1, 2, 4], fov: 40 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} intensity={2} color="#10B981" />
                    <DataEqualizer />
                </Suspense>
             </Canvas>
          </BentoCard>

          {/* 3. MULTI-CHAIN (Square) */}
          <BentoCard 
            className="md:col-span-1 min-h-[300px]"
            title="Unified Liquidity"
            subtitle="A single glass pane for Ethereum, Solana, and Polygon."
            icon={IoLayersOutline}
            delay={0.3}
            overlayContent={
                <div className="absolute bottom-4 w-full flex justify-center gap-6 text-white/30">
                    <FaEthereum size={24} className="hover:text-[#627EEA] transition-colors" />
                    <SiSolana size={22} className="hover:text-[#14F195] transition-colors" />
                    <SiPolygon size={22} className="hover:text-[#8247E5] transition-colors" />
                </div>
            }
          >
             <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                    {/* <Environment preset="city" /> */}
                    <MultiChainNexus/>
                    <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={2} enablePan={false} />
                </Suspense>
             </Canvas>
          </BentoCard>

          {/* 4. GAMIFICATION (Square) */}
          <BentoCard 
            className="md:col-span-1 min-h-[300px]"
            title="P2E Rewards"
            subtitle="Complete missions to earn $POTL tokens."
            icon={PiTrophy}
            delay={0.4}
            overlayContent={
                <div className="absolute top-4 left-4">
                     <div className="bg-[#F59E0B]/10 border border-[#F59E0B]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
                        <PiTrophy className="text-[#F59E0B] w-3 h-3" />
                        <span className="text-[10px] font-bold text-[#F59E0B]">+500 POTL</span>
                     </div>
                </div>
            }
          >
             <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
                <Suspense fallback={null}>
                    <ambientLight intensity={0.5} />
                    <spotLight position={[5, 5, 5]} intensity={3} color="#F59E0B" />
                    <Environment preset="sunset" />
                    <SpinningToken />
                </Suspense>
             </Canvas>
          </BentoCard>

        </div>

        {/* Footer CTA */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-20 flex justify-center"
        >
           <button className="group relative px-8 py-4 bg-[#1E1E24] text-white rounded-full font-bold text-sm flex items-center gap-3 overflow-hidden border border-white/5 hover:border-[#8B5CF6]/50 transition-all shadow-lg hover:shadow-[#8B5CF6]/20">
              <span className="relative z-10">Explore the Documentation</span>
              <FaArrowRight className="relative z-10 group-hover:translate-x-1 transition-transform text-[#8B5CF6]" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#8B5CF6]/20 via-[#7C3AED]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
           </button>
        </motion.div>

      </div>
    </section>
  );
}