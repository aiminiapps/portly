'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

export default function WalletConnect({ onConnect }) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState(null);

  const connectMetaMask = async () => {
    setIsConnecting(true);
    setError(null);

    try {
      if (typeof window.ethereum === 'undefined') {
        throw new Error('MetaMask is not installed. Please install it to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts'
      });

      if (accounts.length > 0) {
        onConnect(accounts[0]);
      }
    } catch (err) {
      console.error('MetaMask connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const connectWalletConnect = async () => {
    setError('WalletConnect integration coming soon!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="w-full max-w-md"
    >
      <div className="glass-card p-8 space-y-6">
        {/* Logo & Title */}
        <div className="text-center space-y-3">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/20">
            <span className="text-4xl font-bold text-white">P</span>
          </div>
          <h2 className="text-2xl font-bold text-[#F9FAFB]">Welcome to PORTLY.AI</h2>
          <p className="text-[#9CA3AF]">
            Connect your wallet to unlock AI-powered portfolio insights
          </p>
        </div>

        {/* Connection Options */}
        <div className="space-y-3">
          <button
            onClick={connectMetaMask}
            disabled={isConnecting}
            className="w-full btn-primary flex items-center justify-center gap-3 py-4"
          >
            {isConnecting ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Connecting...</span>
              </>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.6 8.3l-8.2-6.1c-.9-.7-2.1-.7-3 0L3.2 8.3c-.5.4-.8 1-.8 1.6v8.2c0 1.1.9 2 2 2h15.2c1.1 0 2-.9 2-2V9.9c0-.6-.3-1.2-.8-1.6z"/>
                </svg>
                <span>Connect MetaMask</span>
              </>
            )}
          </button>

          <button
            onClick={connectWalletConnect}
            className="w-full btn-secondary flex items-center justify-center gap-3 py-4"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M6.5 9.5c3.5-3.4 9.1-3.4 12.6 0l.4.4c.2.2.2.4 0 .6l-1.4 1.4c-.1.1-.3.1-.4 0l-.6-.6c-2.4-2.4-6.4-2.4-8.8 0l-.6.6c-.1.1-.3.1-.4 0L5.9 10.5c-.2-.2-.2-.4 0-.6l.6-.4zm15.6 2.9l1.2 1.2c.2.2.2.4 0 .6l-5.4 5.3c-.2.2-.5.2-.7 0l-3.8-3.7c0-.1-.1-.1-.2 0l-3.8 3.7c-.2.2-.5.2-.7 0L3.3 14.2c-.2-.2-.2-.4 0-.6l1.2-1.2c.2-.2.5-.2.7 0l3.8 3.7c.1.1.2.1.2 0l3.8-3.7c.2-.2.5-.2.7 0l3.8 3.7c.1.1.2.1.2 0l3.8-3.7c.2-.2.5-.2.7 0z"/>
            </svg>
            <span>WalletConnect</span>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-[#F87171]/10 border border-[#F87171]/20"
          >
            <p className="text-sm text-[#F87171]">{error}</p>
          </motion.div>
        )}

        {/* Features */}
        <div className="pt-4 space-y-3 border-t border-[#242437]">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#E5E7EB]">AI-Powered Analysis</p>
              <p className="text-xs text-[#9CA3AF]">Get instant insights on your portfolio</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#8B5CF6]/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-[#8B5CF6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-[#E5E7EB]">Secure & Private</p>
              <p className="text-xs text-[#9CA3AF]">We never store your private keys</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
