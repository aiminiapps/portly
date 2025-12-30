'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { FiArrowRight, FiCommand, FiShield, FiZap } from 'react-icons/fi';
import { SiEthereum, SiBinance, SiPolygon } from 'react-icons/si';

export default function WalletConnect({ onConnect, isConnecting }) {
  const [lastSession, setLastSession] = useState(null);
  const [hasAutoTriggered, setHasAutoTriggered] = useState(false);

  useEffect(() => {
    // Check local storage for previous connection
    const saved = localStorage.getItem('portly_wallet_address');
    if (saved) {
      setLastSession(saved);
      // Auto-connect logic: If we have a saved session and haven't tried yet
      if (!hasAutoTriggered && !isConnecting) {
        setHasAutoTriggered(true);
        // Slight delay to ensure hydration/render is stable before triggering
        setTimeout(() => {
          onConnect();
        }, 500);
      }
    }
  }, [onConnect, isConnecting, hasAutoTriggered]);

  return (
    <div className="w-full max-w-md mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} // "Luxury" ease curve
        className="relative"
      >
        {/* Main Card Container */}
        <div className="bg-[#121214]/80 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 md:p-10 overflow-hidden">
          
          {/* Subtle Gradient Background Blob (Static, no pulsing) */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center">
            
            {/* Logo Mark */}
            <div className="mb-4">
              <Image src='/logo.png' alt='logo' width={170} height={50}/>
            </div>
            <p className="text-white/40 text-sm leading-relaxed max-w-[260px] mb-10">
              Your intelligent portfolio manager. Multi-chain analysis powered by Alchemy & Moralis.
            </p>

            {/* Primary Action */}
            <motion.button
              onClick={onConnect}
              disabled={isConnecting}
              whileHover={{ scale: 1.02, backgroundColor: 'rgba(255,255,255,0.1)' }}
              whileTap={{ scale: 0.98 }}
              className="group w-full relative overflow-hidden rounded-xl bg-white text-black font-medium py-4 px-6 flex items-center justify-center gap-3 transition-colors"
            >
              {isConnecting ? (
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  <span className="text-sm">
                    {lastSession ? 'Resuming Session...' : 'Authenticating...'}
                  </span>
                </div>
              ) : (
                <>
                  <span className="text-sm">
                    {lastSession ? 'Resume Dashboard' : 'Connect Wallet'}
                  </span>
                  <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </motion.button>

            {/* Resume Session Indicator */}
            {lastSession && !isConnecting && (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="mt-4 flex items-center gap-2 text-[10px] text-white/30 uppercase tracking-wider"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <span>Detected {lastSession.slice(0, 6)}...{lastSession.slice(-4)}</span>
              </motion.div>
            )}
          </div>

          {/* Footer / Chains */}
          <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
            {[
              { label: 'Ethereum', icon: SiEthereum },
              { label: 'Polygon', icon: SiPolygon },
              { label: 'Binance', icon: SiBinance },
            ].map((chain, i) => (
              <div key={i} className="flex flex-col items-center gap-2 opacity-30 hover:opacity-100 transition-opacity duration-300">
                <chain.icon className="w-5 h-5" />
                <span className="text-[10px] font-medium tracking-wide">{chain.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Badge (Outside Card) */}
        <div className="mt-6 flex justify-center gap-6">
          <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
            <FiShield className="w-3.5 h-3.5" />
            <span>Non-Custodial</span>
          </div>
          <div className="flex items-center gap-2 text-[#9CA3AF] text-xs">
            <FiZap className="w-3.5 h-3.5" />
            <span>AI Optimized</span>
          </div>
        </div>

      </motion.div>
    </div>
  );
}