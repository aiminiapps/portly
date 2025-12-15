'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useSWR from 'swr';
import { 
  FiPieChart, FiBarChart2, FiShield, FiActivity, 
  FiZap, FiCpu, FiLogOut, FiMenu, FiX, FiCheckSquare, 
  FiCommand, FiChevronRight, FiGlobe 
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

  // 1. Initial Client Load & Hash Routing Logic
  useEffect(() => {
    setIsClient(true);

    // Hash Router: Check URL on load
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (['overview', 'analytics', 'tasks', 'activity'].includes(hash)) {
        setSelectedView(hash);
      }
    };

    // Initial check
    handleHashChange();
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    // Check existing wallet connection
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

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update URL when view changes via UI
  const handleViewChange = (viewId) => {
    setSelectedView(viewId);
    window.location.hash = viewId;
    if (window.innerWidth < 1024) setIsSidebarOpen(false);
  };

  // 2. Data Fetching
  const { data: portfolioData, mutate } = useSWR(
    walletAddress ? `/api/data?wallet=${walletAddress}` : null,
    fetcher,
    { refreshInterval: 60000 }
  );

  // 3. Wallet Watcher
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
    window.location.hash = ''; // Clear hash on disconnect
  };

  if (!isClient) return null;

  // Not Connected State
  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0B] p-4 relative overflow-hidden">
        {/* Background Ambient Mesh */}
        <div className="absolute top-[-20%] left-[-20%] w-[50%] h-[50%] bg-[#8B5CF6]/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[50%] h-[50%] bg-[#7C3AED]/10 rounded-full blur-[120px]"></div>
        <div className="relative z-10 w-full max-w-2xl">
           <WalletConnect onConnect={handleConnect} isConnecting={isConnecting} />
        </div>
      </div>
    );
  }

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
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-[0_0_20px_rgba(139,92,246,0.4)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <FiCommand className="text-white w-5 h-5 relative z-10" />
              </div>
              <div>
                <h1 className="font-bold text-lg tracking-tight leading-none text-white">PORTLY<span className="text-[#8B5CF6]">.AI</span></h1>
                <p className="text-[10px] text-white/40 tracking-wider font-medium">INTELLIGENT ASSET MANAGER</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Chain Indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1E1E24] border border-white/5">
              <div className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </div>
              <span className="text-xs font-medium text-white/80">Ethereum Mainnet</span>
            </div>

            {/* Wallet Info */}
            <div className="hidden md:flex items-center gap-3 pl-4 border-l border-white/5">
               <div className="flex flex-col text-right">
                  <span className="text-[10px] text-[#8B5CF6] uppercase font-bold tracking-wider">Connected</span>
                  <span className="text-xs font-mono text-white/70">
                    {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                  </span>
               </div>
               <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#1E1E24] to-[#2D2D3A] border border-white/10 flex items-center justify-center">
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
                  onClick={() => handleViewChange(item.id)}
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

          {/* Sidebar Risk Status (Mini) */}
          <div className="p-6 mt-auto border-t border-white/5">
             <div className="p-4 rounded-2xl bg-gradient-to-br from-[#1E1E24] to-[#0A0A0B] border border-white/5 relative overflow-hidden group">
                <div className="absolute inset-0 bg-[#8B5CF6]/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-2 mb-3">
                  <FiShield className="text-[#8B5CF6]" />
                  <span className="text-xs font-bold text-white uppercase">Risk Profile</span>
                </div>
                <div className="flex justify-between items-end mb-2">
                  <span className="text-2xl font-bold text-white">{portfolioData?.riskScore ? portfolioData.riskScore.toFixed(1) : 'N/A'}</span>
                  <span className="text-xs text-white/40 mb-1">/ 10.0</span>
                </div>
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6]" 
                    style={{ width: `${(portfolioData?.riskScore || 0) * 10}%` }}
                  />
                </div>
             </div>
          </div>
        </aside>

        {/* --- MAIN CONTENT AREA --- */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth scrollbar-hide" id="main-scroll">
          <div className="max-w-7xl mx-auto pb-24">
            
            <AnimatePresence mode="wait">
              {/* VIEW: OVERVIEW */}
              {selectedView === 'overview' && (
                <motion.div 
                  key="overview"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <PortfolioOverview data={portfolioData} walletBalance={walletBalance} />
                  
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

              {/* VIEW: ANALYTICS (DEEP DIVE) */}
              {selectedView === 'analytics' && (
                <motion.div 
                  key="analytics"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
                     <RadarAnalysis portfolioMetrics={portfolioData?.portfolioMetrics} />
                     <div className="flex flex-col gap-6">
                        <AssetAllocationNested assetAllocation={portfolioData?.assetAllocation} />
                        {/* Filler Content for Analytics */}
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

              {/* VIEW: TASKS */}
              {selectedView === 'tasks' && (
                <motion.div 
                  key="tasks"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <TaskCenter walletAddress={walletAddress} />
                </motion.div>
              )}

              {/* VIEW: ACTIVITY */}
              {selectedView === 'activity' && (
                 <motion.div 
                   key="activity"
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   exit={{ opacity: 0, y: -10 }}
                   className="space-y-6"
                 >
                    <ActivityHeatmap activityData={portfolioData?.activityData} />
                    {/* Filler Content */}
                    <div className="rounded-3xl border border-white/5 bg-[#121214]/60 p-8">
                       <h3 className="text-lg font-medium text-white mb-4">Detailed Ledger</h3>
                       <div className="space-y-2">
                          {[1,2,3,4,5].map((i) => (
                             <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-white/[0.02] border border-white/5">
                                <div className="flex items-center gap-3">
                                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                      <FiActivity className="text-white/40 w-4 h-4" />
                                   </div>
                                   <div>
                                      <p className="text-sm text-white">Smart Contract Interaction</p>
                                      <p className="text-xs text-white/30">0x...{Math.random().toString(16).substr(2, 6)}</p>
                                   </div>
                                </div>
                                <span className="text-xs text-white/40">Verified</span>
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

      {/* --- CREATIVE AI FAB (Floating Action Button) --- */}
      <motion.button
        onClick={() => setIsAIModalOpen(true)}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-8 right-8 z-50 group"
      >
        {/* Ripple Effects */}
        <div className="absolute inset-0 bg-[#8B5CF6] rounded-full blur-xl opacity-40 group-hover:opacity-60 group-hover:blur-2xl transition-all duration-500 animate-pulse"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] rounded-full opacity-20 animate-ping"></div>
        
        {/* Main Button */}
        <div className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#1E1E24] to-[#0A0A0B] border border-[#8B5CF6]/50 flex items-center justify-center shadow-2xl shadow-[#8B5CF6]/30 overflow-hidden">
           {/* Inner Shine */}
           <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
           
           <FiCpu className="w-7 h-7 text-white relative z-10" />
           
           {/* Online Dot */}
           <span className="absolute top-3 right-4 w-2 h-2 rounded-full bg-emerald-500 border border-[#0A0A0B] z-20"></span>
        </div>

        {/* Tooltip Label */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg bg-[#1E1E24] border border-white/10 text-xs font-bold text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 pointer-events-none">
           Ask AI Agent
        </div>
      </motion.button>

    </div>
  );
}