'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import useSWR from 'swr';
import { 
  FiTrendingUp, FiShield, FiActivity, FiLayers, 
  FiPieChart, FiBarChart2, FiDollarSign, FiZap,
  FiAlertCircle, FiSettings, FiLogOut, FiMenu, FiX
} from 'react-icons/fi';
import { connectWallet, disconnectWallet, watchAccount, getBalance } from '@/lib/metamask';
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import AssetCards from '@/components/dashboard/AssetCards';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import RiskAnalysis from '@/components/dashboard/RiskAnalysis';
import AIInsightPanel from '@/components/dashboard/AIInsightPanel';
import WalletConnect from '@/components/dashboard/WalletConnect';
import PortfolioHealth from '@/components/dashboard/PortfolioHealth';
import RadarAnalysis from '@/components/dashboard/RadarAnalysis';
import ActivityHeatmap from '@/components/dashboard/ActivityHeatmap';
import AssetAllocationNested from '@/components/dashboard/AssetAllocationNested';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AIDashboard() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');

  // Fetch portfolio data with SWR
  const { data: portfolioData, error, isLoading, mutate } = useSWR(
    walletAddress ? `/api/data?wallet=${walletAddress}` : null,
    fetcher,
    {
      refreshInterval: 30000,
      revalidateOnFocus: true,
      revalidateOnReconnect: true
    }
  );

  // Check for existing wallet connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { initializeMetaMask } = await import('@/lib/metamask');
        const provider = initializeMetaMask();
        
        if (provider) {
          const accounts = await provider.request({ method: 'eth_accounts' });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
            setIsConnected(true);
            const balance = await getBalance(accounts[0]);
            setWalletBalance(balance);
          }
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };
    checkConnection();
  }, []);

  // Watch for account changes
  useEffect(() => {
    if (!isConnected) return;

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
  }, [isConnected, mutate]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { address, chainId } = await connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
      const balance = await getBalance(address);
      setWalletBalance(balance);
      mutate();
    } catch (error) {
      console.error('Connection error:', error);
      alert('Failed to connect wallet. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    await disconnectWallet();
    setWalletAddress(null);
    setIsConnected(false);
    setWalletBalance(0);
  };

  if (!isConnected) {
    return (
      <div className="min-h-screen w-full bg-[#0F0F14] flex items-center justify-center p-4">
        <WalletConnect onConnect={handleConnect} isConnecting={isConnecting} />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-[#0F0F14] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 border-4 border-[#8B5CF6]/20 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-transparent border-t-[#8B5CF6] rounded-full animate-spin"></div>
          </div>
          <div>
            <p className="text-[#E5E7EB] text-lg font-semibold">Analyzing Portfolio</p>
            <p className="text-[#9CA3AF] text-sm mt-1">Fetching your blockchain data...</p>
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
    <div className="min-h-screen w-full bg-[#0F0F14] text-[#E5E7EB]">
      {/* Premium Header */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-2xl bg-[#0F0F14]/90 border-b border-[#242437]">
        <div className="w-full px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Left Side */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden p-2 hover:bg-[#1E1F26] rounded-lg transition-colors"
              >
                {isSidebarOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
              </button>
              
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#8B5CF6]/30">
                  <FiZap className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold bg-gradient-to-r from-[#F9FAFB] to-[#A78BFA] bg-clip-text text-transparent">
                    PORTLY.AI
                  </h1>
                  <p className="text-xs text-[#9CA3AF]">AI-Powered Portfolio</p>
                </div>
              </div>
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
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

              {/* Settings */}
              <button className="p-2.5 rounded-xl bg-[#1E1F26] border border-[#242437] hover:border-[#8B5CF6] transition-all">
                <FiSettings className="w-5 h-5" />
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
          className={`fixed left-0 top-20 bottom-0 w-64 bg-[#0F0F14] border-r border-[#242437] transition-transform duration-300 z-40 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } lg:translate-x-0`}
        >
          <nav className="p-4 space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedView(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  selectedView === item.id
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                    : 'text-[#9CA3AF] hover:bg-[#1E1F26] hover:text-[#E5E7EB]'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
          <div className="w-full px-6 py-6 space-y-6">
            {/* Portfolio Overview Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <PortfolioOverview data={portfolioData} walletBalance={walletBalance} />
            </motion.div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              {/* Left Column - Main Charts (2/3 width) */}
              <div className="xl:col-span-2 space-y-6">
                {/* Performance Chart */}
                <PerformanceChart 
                  historicalData={portfolioData?.historicalData || []}
                />

                {/* Asset Cards Grid */}
                <AssetCards assets={portfolioData?.assets || []} />

                {/* Nested Pie & Radar Side by Side */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <AssetAllocationNested 
                    assetAllocation={portfolioData?.assetAllocation || []}
                  />
                  <RadarAnalysis 
                    portfolioMetrics={portfolioData?.portfolioMetrics || {}}
                  />
                </div>

                {/* Activity Heatmap */}
                <ActivityHeatmap 
                  activityData={portfolioData?.activityData || []}
                />

                {/* Risk Analysis */}
                <RiskAnalysis 
                  riskScore={portfolioData?.riskScore}
                  riskProfile={portfolioData?.riskProfile}
                  assetAllocation={portfolioData?.assetAllocation}
                />
              </div>

              {/* Right Column - AI & Health (1/3 width) */}
              <div className="xl:col-span-1 space-y-6">
                {/* Portfolio Health Gauges */}
                <PortfolioHealth 
                  healthMetrics={portfolioData?.healthMetrics || {}}
                />

                {/* AI Insight Panel */}
                <AIInsightPanel 
                  portfolioData={portfolioData}
                  walletAddress={walletAddress}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
