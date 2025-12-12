'use client';

import { motion } from 'framer-motion';
import { FiZap, FiShield, FiTrendingUp, FiCheckCircle } from 'react-icons/fi';
import { SiEthereum } from 'react-icons/si';
import { LuWalletMinimal } from "react-icons/lu";
export default function WalletConnect({ onConnect, isConnecting }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl"
    >
      {/* Main Card */}
      <div className="glass-card p-8 md:p-12 space-y-8 relative overflow-hidden">
        {/* Animated Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/10 via-transparent to-[#8B5CF6]/10 animate-pulse"></div>
        
        <div className="relative z-10">
          {/* Logo & Title */}
          <div className="text-center space-y-4 mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="w-24 h-24 mx-auto rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] flex items-center justify-center shadow-2xl shadow-[#8B5CF6]/40"
            >
              <FiZap className="w-12 h-12 text-white" />
            </motion.div>
            
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-[#F9FAFB] via-[#A78BFA] to-[#8B5CF6] bg-clip-text text-transparent">
                Welcome to PORTLY.AI
              </h2>
              <p className="text-[#9CA3AF] mt-2 text-lg">
                Next-Generation AI Portfolio Management
              </p>
            </div>
          </div>

          {/* Connect Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onConnect}
            disabled={isConnecting}
            className="w-full btn-primary py-6 flex items-center justify-center gap-4 text-lg relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10 flex items-center gap-4">
              {isConnecting ? (
                <>
                  <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Connecting...</span>
                </>
              ) : (
                <>
                  <LuWalletMinimal className="w-7 h-7" />
                  <span>Connect MetaMask Wallet</span>
                </>
              )}
            </div>
          </motion.button>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            {[
              {
                icon: FiTrendingUp,
                title: 'AI Analytics',
                description: 'Real-time portfolio insights',
                color: '#8B5CF6'
              },
              {
                icon: FiShield,
                title: 'Secure',
                description: 'Your keys, your crypto',
                color: '#4ADE80'
              },
              {
                icon: FiCheckCircle,
                title: 'Free to Use',
                description: 'No hidden fees',
                color: '#3B82F6'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-4 rounded-xl bg-[#1E1F26]/50 border border-[#242437] hover:border-[#8B5CF6]/50 transition-all"
              >
                <feature.icon className="w-8 h-8 mb-3" style={{ color: feature.color }} />
                <h3 className="text-sm font-semibold text-[#F9FAFB] mb-1">
                  {feature.title}
                </h3>
                <p className="text-xs text-[#9CA3AF]">{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Powered By */}
          <div className="flex items-center justify-center gap-2 mt-8 text-sm text-[#9CA3AF]">
            <span>Powered by</span>
            <SiEthereum className="w-4 h-4" />
            <span className="font-semibold text-[#E5E7EB]">Ethereum</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
