'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  FiPieChart, FiBarChart2, FiShield, FiActivity, 
  FiZap, FiCpu, FiLogOut, FiMenu, FiX, FiCheckSquare 
} from 'react-icons/fi';
// Assuming you have these helpers or standard wallet connect logic
import { 
  connectWallet, disconnectWallet, watchAccount, getBalance, getAccounts 
} from '@/lib/metamask';

// Components
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
import TaskCenter from '@/components/dashboard/TaskCenter';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function AIDashboard() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Initial Client Load
  useEffect(() => {
    setIsClient(true);
    // Check local storage or existing provider for session
    const checkConnection = async () => {
      const accounts = await getAccounts();
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        setIsConnected(true);
        const bal = await getBalance(accounts[0]);
        setWalletBalance(bal);
      }
    };
    if (window.ethereum) checkConnection();
  }, []);

  // Real Data Fetching via API (Moralis/Alchemy wrapper)
  const { data: portfolioData, mutate } = useSWR(
    walletAddress ? `/api/data?wallet=${walletAddress}` : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  // Wallet Event Listeners
  useEffect(() => {
    if (!isClient) return;
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
    return () => unwatch && unwatch();
  }, [isClient, mutate]);

  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { address } = await connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
      const balance = await getBalance(address);
      setWalletBalance(balance);
    } catch (e) {
      console.error(e);
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setWalletAddress(null);
    setIsConnected(false);
  };

  // Prevent Hydration Mismatch
  if (!isClient) return null;

  // Not Connected State
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0F] p-4">
        <WalletConnect onConnect={handleConnect} isConnecting={isConnecting} />
      </div>
    );
  }

  const navItems = [
    { id: 'overview', label: 'Overview', icon: FiPieChart },
    { id: 'analytics', label: 'Deep Dive', icon: FiBarChart2 },
    { id: 'tasks', label: 'Task Center', icon: FiCheckSquare },
    { id: 'activity', label: 'Activity', icon: FiActivity },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-[#E5E7EB] font-sans selection:bg-[#8B5CF6] selection:text-white">
      
      {/* AI Agent Modal */}
      <AIAgentModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        portfolioData={portfolioData}
        walletAddress={walletAddress}
      />

      {/* Top Navigation */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0A0A0F]/80 backdrop-blur-md border-b border-[#242437]">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-[#1E1F26] rounded-lg lg:hidden transition-colors"
            >
              {isSidebarOpen ? <FiX /> : <FiMenu />}
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.5)]">
                <FiZap className="text-white w-5 h-5" />
              </div>
              <span className="font-bold text-lg tracking-tight">PORTLY<span className="text-[#8B5CF6]">.AI</span></span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-[#1E1F26] border border-[#242437]">
               <div className="flex flex-col text-right">
                  <span className="text-[10px] text-[#9CA3AF] uppercase font-bold tracking-wider">Balance</span>
                  <span className="text-sm font-bold text-white">{walletBalance.toFixed(4)} ETH</span>
               </div>
            </div>
            <button onClick={handleDisconnect} className="p-2 hover:bg-[#1E1F26] rounded-lg text-[#9CA3AF] hover:text-[#F87171] transition-colors">
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16 h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-64 bg-[#0A0A0F] border-r border-[#242437] z-30 transition-transform duration-300 pt-20 lg:pt-4`}>
          <nav className="p-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setSelectedView(item.id);
                  if (window.innerWidth < 1024) setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedView === item.id
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                    : 'text-[#9CA3AF] hover:bg-[#1E1F26] hover:text-white'
                }`}
              >
                <item.icon className={`w-5 h-5 ${selectedView === item.id ? 'animate-bounce' : ''}`} />
                {item.label}
              </button>
            ))}
          </nav>

          {/* Sidebar Risk Card */}
          <div className="absolute bottom-6 left-4 right-4">
             <div className="glass-card p-4 bg-gradient-to-br from-[#1E1F26] to-[#0F0F14]">
                <div className="flex items-center gap-2 mb-2 text-[#F59E0B]">
                  <FiShield />
                  <span className="text-xs font-bold uppercase">Risk Status</span>
                </div>
                <div className="h-2 bg-[#242437] rounded-full overflow-hidden mb-2">
                  <div 
                    className="h-full bg-[#F59E0B]" 
                    style={{ width: `${(portfolioData?.riskScore || 0) * 10}%` }}
                  />
                </div>
                <p className="text-xs text-[#9CA3AF]">
                  {portfolioData?.riskProfile || 'Calculating...'}
                </p>
             </div>
          </div>
        </aside>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth" id="main-scroll">
          <div className="max-w-7xl mx-auto space-y-6 pb-20">
            
            {/* View Logic */}
            {selectedView === 'overview' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <PortfolioOverview data={portfolioData} walletBalance={walletBalance} />
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                  <div className="xl:col-span-2 space-y-6">
                     <PerformanceChart historicalData={portfolioData?.historicalData} />
                     <AssetCards assets={portfolioData?.assets} />
                  </div>
                  <div className="xl:col-span-1 space-y-6">
                    <PortfolioHealth healthMetrics={portfolioData?.healthMetrics} />
                    <AssetAllocationNested assetAllocation={portfolioData?.assetAllocation} />
                  </div>
                </div>
              </motion.div>
            )}

            {selectedView === 'analytics' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <RadarAnalysis portfolioMetrics={portfolioData?.portfolioMetrics} />
                   <AssetAllocationNested assetAllocation={portfolioData?.assetAllocation} />
                </div>
                <ActivityHeatmap activityData={portfolioData?.activityData} />
              </motion.div>
            )}

            {selectedView === 'tasks' && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <TaskCenter walletAddress={walletAddress} />
              </motion.div>
            )}

            {selectedView === 'activity' && (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  <ActivityHeatmap activityData={portfolioData?.activityData} />
               </motion.div>
            )}

          </div>
        </main>
      </div>

      {/* Floating AI Agent Button (FAB) */}
      <motion.button
        onClick={() => setIsAIModalOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale : 0.9 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.6)] border-2 border-white/20"
      >
        <FiCpu className="w-8 h-8 text-white" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-[#8B5CF6]"></span>
        </span>
      </motion.button>
    </div>
  );
}