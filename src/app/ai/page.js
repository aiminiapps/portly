'use client';

import { useState, useEffect } from 'react';
import useSWR from 'swr';
import { motion, AnimatePresence } from 'framer-motion';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import AssetCards from '@/components/dashboard/AssetCards';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import RiskAnalysis from '@/components/dashboard/RiskAnalysis';
import AIInsightPanel from '@/components/dashboard/AIInsightPanel';
import TaskCenter from '@/components/dashboard/TaskCenter';
import WalletConnect from '@/components/dashboard/WalletConnect';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AIDashboard() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Fetch wallet data with SWR for real-time updates
  const { data: portfolioData, error, isLoading, mutate } = useSWR(
    walletAddress ? `/api/data?wallet=${walletAddress}` : null,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  );

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ 
            method: 'eth_accounts' 
          });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
          }
        } catch (error) {
          console.error('Error checking wallet connection:', error);
        }
      }
    };
    checkConnection();
  }, []);

  const handleWalletConnect = (address) => {
    setWalletAddress(address);
    setIsConnected(true);
    mutate(); // Trigger data fetch
  };

  const handleWalletDisconnect = () => {
    setWalletAddress(null);
    setIsConnected(false);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center p-4">
        <WalletConnect onConnect={handleWalletConnect} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#E5E7EB] text-lg">Analyzing your portfolio...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0F0F14] flex items-center justify-center p-4">
        <div className="glass-card p-8 text-center max-w-md">
          <p className="text-[#F87171] text-lg mb-4">Failed to load portfolio data</p>
          <button 
            onClick={() => mutate()}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0F14] text-[#E5E7EB]">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0F0F14]/80 border-b border-[#242437]">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center">
              <span className="text-xl font-bold text-white">P</span>
            </div>
            <h1 className="text-xl font-bold text-[#F9FAFB]">PORTLY.AI</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1E1F26] border border-[#242437]">
              <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></div>
              <span className="text-sm text-[#9CA3AF]">
                {walletAddress?.slice(0, 6)}...{walletAddress?.slice(-4)}
              </span>
            </div>
            <button
              onClick={handleWalletDisconnect}
              className="text-[#9CA3AF] hover:text-[#F87171] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Dashboard Layout */}
      <div className="container mx-auto px-4 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 lg:grid-cols-12 gap-6"
        >
          {/* Left Column - Main Dashboard */}
          <div className="lg:col-span-8 space-y-6">
            {/* Portfolio Overview */}
            <PortfolioOverview data={portfolioData} />

            {/* Asset Cards Grid */}
            <AssetCards assets={portfolioData?.assets || []} />

            {/* Performance Chart */}
            <PerformanceChart 
              historicalData={portfolioData?.historicalData || []}
              timeRange="7D"
            />

            {/* Risk Analysis */}
            <RiskAnalysis 
              riskScore={portfolioData?.riskScore}
              riskProfile={portfolioData?.riskProfile}
              assetAllocation={portfolioData?.assetAllocation}
            />
          </div>

          {/* Right Column - AI Panel & Tasks */}
          <div className="lg:col-span-4 space-y-6">
            {/* AI Insight Panel */}
            <AIInsightPanel 
              portfolioData={portfolioData}
              walletAddress={walletAddress}
            />

            {/* Task Center */}
            <TaskCenter 
              walletAddress={walletAddress}
              completedTasks={portfolioData?.completedTasks || []}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
