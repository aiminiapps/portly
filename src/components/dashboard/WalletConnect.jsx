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
            <p className="text-white/40 text-sm leading-relaxed mb-6">
              Your intelligent portfolio manager. Multi-chain analysis powered by Alchemy & Moralis.
            </p>

            <motion.button
                onClick={onConnect}
                disabled={isConnecting}
                whileHover={{ scale: 1.02, translateY: -1 }}
                whileTap={{ scale: 0.98, translateY: 1 }}
                className="relative group w-full px-8 py-4 cursor-pointer rounded-2xl font-semibold text-lg flex items-center justify-center gap-3 overflow-hidden transition-all duration-300 isolate text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-[#8B5CF6] to-[#6D28D9] z-[-1]" />
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-white/40" />
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/30" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/20 to-transparent transition-opacity duration-500 transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%]" />

                {isConnecting ? (
                  <div className="flex items-center gap-3 cursor-progress">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>
                      {lastSession ? 'Resuming Session...' : 'Authenticating...'}
                    </span>
                  </div>
                ) : (
                  <>
                    <span>
                      {lastSession ? 'Resume Dashboard' : 'Connect Wallet'}
                    </span>
                    <FiArrowRight className="w-4 h-4 opacity-70 group-hover:translate-x-1 transition-transform" />
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
          <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-3 gap-4">
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