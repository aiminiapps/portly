'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Line, Stars, Icosahedron, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

// 1. The Central Pulsating AI Core
function AICore() {
  const ref = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      ref.current.rotation.x = t * 0.2;
      ref.current.rotation.y = t * 0.3;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      {/* Liquid Metal Core */}
      <Icosahedron args={[1.2, 2]} ref={ref}>
        <MeshDistortMaterial
          color="#8B5CF6"
          attach="material"
          distort={0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#4c1d95"
          emissiveIntensity={0.5}
        />
      </Icosahedron>
      {/* Tech Wireframe Cage */}
      <Icosahedron args={[1.3, 1]}>
        <meshBasicMaterial color="#C4B5FD" wireframe={true} transparent opacity={0.1} />
      </Icosahedron>
    </Float>
  );
}

// 2. Orbiting Data Nodes
function AssetNetwork({ count = 12 }) {
  const group = useRef();
  
  const nodes = useMemo(() => {
    return new Array(count).fill().map(() => {
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = 2.5 + Math.random() * 1.5;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      return { pos: [x, y, z], size: Math.random() * 0.1 + 0.05 };
    });
  }, [count]);

  useFrame(() => {
    if (group.current) {
      group.current.rotation.y += 0.002;
      group.current.rotation.z += 0.001;
    }
  });

  return (
    <group ref={group}>
      {nodes.map((node, i) => (
        <group key={i}>
          <mesh position={node.pos}>
            <sphereGeometry args={[node.size, 16, 16]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? "#10B981" : "#8B5CF6"} 
              emissive={i % 2 === 0 ? "#059669" : "#7C3AED"} 
              emissiveIntensity={1} 
              roughness={0.1} 
              metalness={0.8} 
            />
          </mesh>
          <Line
            points={[[0, 0, 0], node.pos]}
            color={i % 2 === 0 ? "#10B981" : "#8B5CF6"}
            opacity={0.15}
            transparent
            lineWidth={1}
          />
        </group>
      ))}
    </group>
  );
}

// 3. Main Scene Export
export default function HeroScene() {
  return (
    <Canvas camera={{ position: [0, 0, 6], fov: 50 }} gl={{ antialias: true }}>
      <color attach="background" args={['transparent']} />
      <fog attach="fog" args={['#0A0A0B', 5, 15]} />
      
      {/* Lighting */}
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1.5} color="#8B5CF6" />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#10B981" />
      
      {/* Objects */}
      <AICore />
      <AssetNetwork />
      <Stars radius={50} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />
    </Canvas>
  );
}