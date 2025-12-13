'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  FiTrendingUp, FiShield, FiActivity, FiLayers, 
  FiPieChart, FiBarChart2, FiZap, FiCpu,
  FiLogOut, FiMenu, FiX
} from 'react-icons/fi';
import { 
  connectWallet, 
  disconnectWallet, 
  watchAccount, 
  getBalance,
  getAccounts 
} from '@/lib/metamask';

import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import AssetCards from '@/components/dashboard/AssetCards';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import RiskAnalysis from '@/components/dashboard/RiskAnalysis';
import WalletConnect from '@/components/dashboard/WalletConnect';
import PortfolioHealth from '@/components/dashboard/PortfolioHealth';
import RadarAnalysis from '@/components/dashboard/RadarAnalysis';
import ActivityHeatmap from '@/components/dashboard/ActivityHeatmap';
import AssetAllocationNested from '@/components/dashboard/AssetAllocationNested';
import AIAgentModal from '@/components/dashboard/AIAgentModal';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AIDashboard() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionError, setConnectionError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');
  const [isClient, setIsClient] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: portfolioData, error, isLoading, mutate } = useSWR(
    walletAddress ? `/api/data?wallet=${walletAddress}` : null,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
    }
  );

  useEffect(() => {
    if (!isClient) return;

    const checkExistingConnection = async () => {
      try {
        const accounts = await getAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          const balance = await getBalance(accounts[0]);
          setWalletBalance(balance);
        }
      } catch (error) {
        console.error('Error checking existing connection:', error);
      }
    };

    const timeout = setTimeout(checkExistingConnection, 100);
    return () => clearTimeout(timeout);
  }, [isClient]);

  useEffect(() => {
    if (!isConnected || !isClient) return;

    const unwatch = watchAccount(async (newAddress) => {
      if (newAddress) {
        setWalletAddress(newAddress);
        const balance = await getBalance(newAddress);
        setWalletBalance(balance);
        mutate();
      } else {
        handleDisconnect();
      }
    });

    return () => {
      if (unwatch) unwatch();
    };
  }, [isConnected, isClient, mutate]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setConnectionError(null);

    try {
      const { address } = await connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
      const balance = await getBalance(address);
      setWalletBalance(balance);
      mutate();
    } catch (error) {
      console.error('Connection error:', error);
      setConnectionError(error.message || 'Failed to connect wallet');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setWalletAddress(null);
    setIsConnected(false);
    setWalletBalance(0);
    setConnectionError(null);
  };

  if (!isClient) {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#8B5CF6] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#E5E7EB]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isConnected) {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0F] flex items-center justify-center p-4">
        <WalletConnect 
          onConnect={handleConnect} 
          isConnecting={isConnecting}
          error={connectionError}
        />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0A0A0F] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-[#8B5CF6]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#8B5CF6] rounded-full animate-spin"></div>
          </div>
          <div>
            <p className="text-[#E5E7EB] text-lg font-semibold">Analyzing Portfolio</p>
            <p className="text-[#9CA3AF] text-sm mt-1">Fetching blockchain data...</p>
          </div>
        </div>
      </div>
    );
  }

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: FiPieChart },
    { id: 'analytics', label: 'Analytics', icon: FiBarChart2 },
    { id: 'risk', label: 'Risk Analysis', icon: FiShield },
    { id: 'activity', label: 'Activity', icon: FiActivity },
  ];

  return (
    <div className="min-h-screen w-full bg-[#0A0A0F] text-[#E5E7EB]">
      {/* AI Agent Modal */}
      <AIAgentModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        portfolioData={portfolioData}
        walletAddress={walletAddress}
      />

      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-40 backdrop-blur-2xl bg-[#0A0A0F]/90 border-b border-[#242437]/50">
        <div className="w-full px-4 md:px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-4 md:gap-6">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2.5 hover:bg-[#1E1F26] rounded-xl transition-colors"
              >
                {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30 pulse-glow">
                  <FiZap className="w-7 h-7 text-white" />
                </div>
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#F9FAFB] to-[#A78BFA] bg-clip-text text-transparent">
                    PORTLY.AI
                  </h1>
                  <p className="text-xs text-[#9CA3AF]">AI-Powered Portfolio</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-2 md:gap-4">
              {/* Wallet Info */}
              <div className="hidden md:flex items-center gap-3 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#1E1F26] to-[#16171D] border border-[#242437]">
                <div className="flex flex-col items-end">
                  <span className="text-xs text-[#9CA3AF]">Balance</span>
                  <span className="text-sm font-bold text-[#F9FAFB]">
                    {walletBalance.toFixed(4)} ETH
                  </span>
                </div>
                <div className="w-px h-8 bg-[#242437]"></div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#4ADE80] animate-pulse"></div>
                  <span className="text-sm font-medium text-[#E5E7EB]">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
                </div>
              </div>

              {/* AI Agent Button */}
              <button
                onClick={() => setIsAIModalOpen(true)}
                className="btn-3d p-3 relative group"
              >
                <FiCpu className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#4ADE80] rounded-full animate-pulse"></div>
              </button>

              {/* Disconnect */}
              <button
                onClick={handleDisconnect}
                className="p-2.5 rounded-xl bg-[#1E1F26] border border-[#242437] hover:border-[#F87171] hover:text-[#F87171] transition-all"
              >
                <FiLogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="flex pt-20">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-20 bottom-0 w-64 bg-[#0A0A0F] border-r border-[#242437]/50 transition-transform duration-300 z-30 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setSelectedView(item.id)}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all ${
                  selectedView === item.id
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                    : 'text-[#9CA3AF] hover:bg-[#1E1F26] hover:text-[#E5E7EB]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-semibold">{item.label}</span>
              </motion.button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="w-full px-4 md:px-6 py-6 space-y-6">
            {/* Portfolio Overview */}
            <PortfolioOverview data={portfolioData} walletBalance={walletBalance} />

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column */}
              <div className="xl:col-span-2 space-y-6">
                <PerformanceChart historicalData={portfolioData?.historicalData || []} />
                <AssetCards assets={portfolioData?.assets || []} />
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AssetAllocationNested assetAllocation={portfolioData?.assetAllocation || []} />
                  <RadarAnalysis portfolioMetrics={portfolioData?.portfolioMetrics || {}} />
                </div>

                <ActivityHeatmap activityData={portfolioData?.activityData || []} />
                <RiskAnalysis 
                  riskScore={portfolioData?.riskScore}
                  riskProfile={portfolioData?.riskProfile}
                  assetAllocation={portfolioData?.assetAllocation}
                />
              </div>

              {/* Right Column */}
              <div className="xl:col-span-1 space-y-6">
                <PortfolioHealth healthMetrics={portfolioData?.healthMetrics || {}} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
