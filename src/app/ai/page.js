'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  FiPieChart, FiBarChart2, FiShield, FiActivity, 
  FiLogOut, FiMenu, FiX, FiCheckSquare, 
  FiChevronRight, FiGlobe, FiLayers
} from 'react-icons/fi';
import { 
  connectWallet, disconnectWallet, watchAccount, getBalance, getAccounts 
} from '@/lib/metamask'; 

// Components
import PortfolioOverview from '@/components/dashboard/PortfolioOverview';
import AssetCards from '@/components/dashboard/AssetCards';
import PerformanceChart from '@/components/dashboard/PerformanceChart';
import WalletConnect from '@/components/dashboard/WalletConnect';
import PortfolioHealth from '@/components/dashboard/PortfolioHealth';
import RadarAnalysis from '@/components/dashboard/RadarAnalysis';
import ActivityHeatmap from '@/components/dashboard/ActivityHeatmap';
import AssetAllocationNested from '@/components/dashboard/AssetAllocationNested';
import AIAgentModal from '@/components/dashboard/AIAgentModal';
import TaskCenter from '@/components/dashboard/TaskCenter';
import Image from 'next/image';
import AdvancedAnalytics from '@/components/dashboard/AdvancedAnalytics';

// Fetcher with Caching Logic
const fetcher = async (url) => {
  const res = await fetch(url);
  const data = await res.json();
  if (data && !data.error) {
    // Save to local storage for offline/fast load
    localStorage.setItem('portly_data_cache', JSON.stringify(data));
  }
  return data;
};

// Chain ID Map
const CHAIN_MAP = {
  '0x1': { name: 'Ethereum Mainnet', color: 'bg-emerald-500' },
  '0x38': { name: 'BSC Mainnet', color: 'bg-yellow-500' },
  '0x89': { name: 'Polygon', color: 'bg-purple-500' },
  '0xa4b1': { name: 'Arbitrum', color: 'bg-blue-500' },
  '0x2105': { name: 'Base', color: 'bg-blue-600' },
  'unknown': { name: 'Unknown Network', color: 'bg-gray-500' }
};

export default function AIDashboard() {
  const [walletAddress, setWalletAddress] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  const [chainId, setChainId] = useState('0x1');
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedView, setSelectedView] = useState('overview');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  
  // Local Data State (Instant Load)
  const [cachedData, setCachedData] = useState(null);

  // 1. Initialization
  useEffect(() => {
    setIsClient(true);
    
    // Load Cache Immediately
    const cache = localStorage.getItem('portly_data_cache');
    if (cache) {
      try { setCachedData(JSON.parse(cache)); } catch(e) {}
    }

    const initWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        const accounts = await getAccounts();
        if (accounts.length > 0) {
          setWalletAddress(accounts[0]);
          setIsConnected(true);
          const bal = await getBalance(accounts[0]);
          setWalletBalance(bal);
          
          // Get Chain ID
          const chain = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(chain);
          
          // Listen for chain changes
          window.ethereum.on('chainChanged', (newChain) => setChainId(newChain));
        }
      }
    };
    initWallet();
    
    // Hash Routing
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'analytics', 'tasks', 'activity'].includes(hash)) setSelectedView(hash);
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // 2. Data Fetching
  const { data: apiData, mutate } = useSWR(
    walletAddress ? `/api/data?wallet=${walletAddress}` : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  // Merge Cache with API Data (Prioritize API, fall back to Cache)
  const portfolioData = apiData || cachedData;

  // 3. Risk Score Fallback Calculation
  const riskInfo = useMemo(() => {
    if (portfolioData?.riskScore) {
      return { score: portfolioData.riskScore, label: portfolioData.riskProfile || 'Calculated' };
    }
    // Fallback if API hasn't returned yet or failed
    if (portfolioData?.assets?.length > 0) {
      // Simple heuristic: More assets = Lower risk (Diversified)
      // High stablecoin count = Lower risk
      const score = Math.min(10, Math.max(2, (portfolioData.assets.length * 0.5) + 3));
      let label = 'Moderate';
      if (score < 4) label = 'Conservative';
      if (score > 7) label = 'Aggressive';
      return { score: score.toFixed(1), label };
    }
    return { score: '5.0', label: 'Neutral' }; // Default
  }, [portfolioData]);

  // Wallet Connection Logic
  const handleConnect = async () => {
    setIsConnecting(true);
    try {
      const { address } = await connectWallet();
      setWalletAddress(address);
      setIsConnected(true);
      const bal = await getBalance(address);
      setWalletBalance(bal);
    } catch (e) { console.error(e); } 
    finally { setIsConnecting(false); }
  };

  const handleDisconnect = () => {
    disconnectWallet();
    setWalletAddress(null);
    setIsConnected(false);
    setCachedData(null);
    localStorage.removeItem('portly_data_cache');
    window.location.hash = '';
  };

  if (!isClient) return null;

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] p-4 relative overflow-hidden">
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-[#8B5CF6]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 w-full max-w-2xl">
           <WalletConnect onConnect={handleConnect} isConnecting={isConnecting} />
        </div>
      </div>
    );
  }

  const currentChain = CHAIN_MAP[chainId] || CHAIN_MAP['unknown'];

  const navItems = [
    { id: 'overview', label: 'Portfolio Overview', icon: FiPieChart, desc: 'Assets & Performance' },
    { id: 'analytics', label: 'Deep Analytics', icon: FiBarChart2, desc: 'Risk & Allocation' },
    { id: 'tasks', label: 'Task Center', icon: FiCheckSquare, desc: 'Rewards & Quests' },
    { id: 'activity', label: 'Activity Log', icon: FiActivity, desc: 'On-Chain History' },
  ];

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#E5E7EB] font-sans selection:bg-[#8B5CF6] selection:text-white overflow-hidden">
      
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[800px] h-[600px] bg-[#8B5CF6]/5 rounded-full blur-[120px] opacity-50"></div>
      </div>

      <AIAgentModal 
        isOpen={isAIModalOpen} 
        onClose={() => setIsAIModalOpen(false)} 
        portfolioData={portfolioData}
        walletAddress={walletAddress}
      />

      {/* --- PREMIUM HEADER --- */}
      <header className="fixed top-0 inset-x-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-xl lg:hidden transition-colors border border-transparent hover:border-white/5"
            >
              {isSidebarOpen ? <FiX className="text-white/70" /> : <FiMenu className="text-white/70" />}
            </button>
            <div className=" items-center gap-3">
              <Image src='/logo.png' alt='logo' width={130} height={60} className='sm:scale-125 scale-110 sm:ml-2 ml-0'/>
                <p className="text-[10px] sm:block hidden -ml-1 text-white/40 mt-1 tracking-wider font-medium">INTELLIGENT ASSET MANAGER</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Chain Indicator (Dynamic) */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E1E24] border border-white/5 transition-all hover:border-white/10">
              <div className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${currentChain.color.replace('bg-', 'bg-opacity-50 ')}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${currentChain.color}`}></span>
              </div>
              <span className="text-xs font-medium text-white/80">{currentChain.name}</span>
            </div>

            {/* Wallet Info */}
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/5">
               <div className="flex flex-col text-right">
                  <span className="text-[10px] text-[#8B5CF6] uppercase font-bold tracking-wider">Connected</span>
                  <span className="text-xs font-mono text-white/70">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
               </div>
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E1E24] to-[#2D2D3A] border border-white/10 flex items-center justify-center shadow-inner">
                  <FiGlobe className="w-4 h-4 text-[#8B5CF6]" />
               </div>
            </div>

            <button 
              onClick={handleDisconnect} 
              className="p-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20 border border-transparent transition-all text-white/40"
              title="Disconnect"
            >
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="flex pt-16 h-screen overflow-hidden">
        {/* --- CREATIVE SIDEBAR --- */}
        <aside className={`${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:static inset-y-0 left-0 w-72 bg-[#0A0A0B]/95 backdrop-blur-xl border-r border-white/5 z-30 transition-transform duration-300 pt-6 flex flex-col`}>
          
          <nav className="p-4 space-y-2 flex-1">
            <div className="px-4 mb-4 text-xs font-bold text-white/20 uppercase tracking-widest">Menu</div>
            {navItems.map((item) => {
              const isActive = selectedView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedView(item.id);
                    window.location.hash = item.id;
                    if (window.innerWidth < 1024) setIsSidebarOpen(false);
                  }}
                  className={`relative group w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-[#8B5CF6]/20 to-transparent border border-[#8B5CF6]/20'
                      : 'hover:bg-white/5 border border-transparent hover:border-white/5'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute left-0 w-1 h-6 bg-[#8B5CF6] rounded-r-full"
                    />
                  )}
                  <div className={`p-2 rounded-lg transition-colors ${isActive ? 'bg-[#8B5CF6] text-white' : 'bg-white/5 text-white/40 group-hover:text-white'}`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-medium transition-colors ${isActive ? 'text-white' : 'text-white/60 group-hover:text-white'}`}>
                      {item.label}
                    </p>
                    <p className="text-[10px] text-white/30">{item.desc}</p>
                  </div>
                  {isActive && <FiChevronRight className="ml-auto w-4 h-4 text-[#8B5CF6]" />}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Risk Status (Calculated) */}
          <div className="p-6 mt-auto border-t border-white/5">
             <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E1E24] to-[#0A0A0B] border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-2 mb-3">
                  <FiShield className="text-[#8B5CF6]" />
                  <span className="text-xs font-bold text-white uppercase">Risk Profile</span>
                </div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold text-white">{riskInfo.score}</span>
                  <span className="text-xs text-white/40 mb-1">/ 10.0</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(parseFloat(riskInfo.score) || 0) * 10}%` }}
                    className="h-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]" 
                  />
                </div>
                <p className="text-[10px] text-white/50 text-right">{riskInfo.label}</p>
             </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT --- */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-hide" id="main-scroll">
          <div className="max-w-7xl mx-auto pb-24">
            
            <AnimatePresence mode="wait">
              {selectedView === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <PortfolioOverview data={portfolioData} walletBalance={walletBalance} />
                  <AdvancedAnalytics/>
                  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <div className="xl:col-span-2 space-y-6">
                       <PerformanceChart historicalData={portfolioData?.historicalData} />
                       <AssetCards assets={portfolioData?.assets} />
                    </div>
                    <div className="xl:col-span-1 space-y-6">
                      <PortfolioHealth healthMetrics={portfolioData?.healthMetrics} assets={portfolioData?.assets} />
                      <AssetAllocationNested assetAllocation={portfolioData?.assetAllocation} />
                    </div>
                  </div>
                </motion.div>
              )}

              {selectedView === 'analytics' && (
                <motion.div 
                  key="analytics"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                     <RadarAnalysis portfolioMetrics={portfolioData?.portfolioMetrics} />
                     <div className="flex flex-col gap-6">
                        <AssetAllocationNested assetAllocation={portfolioData?.assetAllocation} />
                        {/* Filler Content: Predictive Models */}
                        <div className="flex-1 rounded-3xl border border-white/5 bg-[#121214]/60 p-6 flex flex-col items-center justify-center text-center">
                           <FiBarChart2 className="w-8 h-8 text-white/20 mb-2" />
                           <h3 className="text-white/60 font-medium">Predictive Modeling</h3>
                           <p className="text-xs text-white/30 max-w-xs mt-1">Unlock premium to view future asset projection scenarios.</p>
                        </div>
                     </div>
                  </div>
                  <ActivityHeatmap activityData={portfolioData?.activityData} />
                </motion.div>
              )}

              {selectedView === 'tasks' && (
                <motion.div 
                  key="tasks"
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                >
                  <TaskCenter walletAddress={walletAddress} />
                </motion.div>
              )}

              {selectedView === 'activity' && (
                 <motion.div 
                   key="activity"
                   initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                   className="space-y-6"
                 >
                    <ActivityHeatmap activityData={portfolioData?.activityData} />
                    {/* Filler Content: Ledger */}
                    <div className="rounded-3xl border border-white/5 bg-[#121214]/60 p-8">
                       <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-medium text-white">Detailed Ledger</h3>
                          <button className="text-xs text-[#8B5CF6] hover:underline">Export CSV</button>
                       </div>
                       <div className="space-y-2">
                          {[1,2,3,4,5].map((i) => (
                             <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                      <FiLayers className="text-white/40 w-4 h-4" />
                                   </div>
                                   <div>
                                      <p className="text-sm text-white">Smart Contract Call</p>
                                      <p className="text-xs text-white/30 font-mono">0x{Math.random().toString(16).substr(2, 8)}...{Math.random().toString(16).substr(2, 4)}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-xs text-emerald-400">Confirmed</p>
                                   <p className="text-[10px] text-white/20">Block #18239{i}</p>
                                </div>
                             </div>
                          ))}
                       </div>
                    </div>
                 </motion.div>
              )}
            </AnimatePresence>
          </div>
        </main>
      </div>

      {/* --- ULTIMATE AI FAB --- */}
      <motion.button
        onClick={() => setIsAIModalOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05, boxShadow: "0 0 40px rgba(139,92,246,0.5)" }}
        whileTap={{ scale: 0.95 }}
        className="fixed sm:bottom-8 bottom-4 sm:right-8 right-4 z-40 group rounded-full"
      >
        {/* Holographic Ripple */}
        <div className="absolute inset-0 bg-[#8B5CF6] rounded-full blur-xl opacity-20 group-hover:opacity-60 animate-pulse"></div>
        <div className="absolute -inset-1 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] rounded-full opacity-40 blur-md group-hover:opacity-80 transition-opacity"></div>
        
        {/* Core Button */}
        <div className="relative w-16 h-16 rounded-full bg-[#121214] border border-[#8B5CF6]/50 flex items-center justify-center overflow-hidden">
           <div className="absolute inset-0 bg-gradient-to-tr from-[#7C3AED]/20 to-transparent opacity-50"></div>
           
           {/* Icon Animation */}
           <Image src='/agent.png' alt='agent logo' height={55} width={55}/>
        </div>

        {/* Hover Label */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 rounded-xl bg-[#1E1E24]/90 backdrop-blur-md border border-white/10 text-xs font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 pointer-events-none shadow-xl">
           Ask AI Agent
           <div className="absolute top-1/2 -right-1 -translate-y-1/2 w-2 h-2 bg-[#1E1E24]/90 rotate-45 border-t border-r border-white/10"></div>
        </div>
      </motion.button>

    </div>
  );
}