'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { 
  FiTrendingUp, FiTrendingDown, FiLayers, FiActivity, 
  FiZap, FiCpu, FiAlertTriangle, FiRefreshCw, FiWind, FiPercent,
  FiBarChart2, FiGlobe, FiSmile, FiTarget
} from 'react-icons/fi';

// --- COINGECKO ID MAPPER (For Free API) ---
const COIN_MAP = {
  'ETH': 'ethereum', 'BTC': 'bitcoin', 'BNB': 'binancecoin',
  'MATIC': 'matic-network', 'SOL': 'solana', 'USDT': 'tether',
  'USDC': 'usd-coin', 'DAI': 'dai', 'LINK': 'chainlink', 'UNI': 'uniswap'
};

export default function PortfolioOverview({ data, walletBalance }) {
  const [realMetrics, setRealMetrics] = useState(null);
  const [activeTab, setActiveTab] = useState('health');
  const [aiData, setAiData] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // 1. LIVE PRICE FETCHING ENGINE (Fixes 0.00% Issue)
  useEffect(() => {
    const fetchLiveMarketData = async () => {
      setIsRefreshing(true);
      const assets = data?.assets || [];
      
      // Prepare IDs for CoinGecko
      const ids = assets
        .map(a => COIN_MAP[a.symbol?.toUpperCase()] || a.name?.toLowerCase())
        .filter(id => id) // Remove undefined
        .join(',');

      // Always fetch ETH/BNB for native balance if not in assets
      const nativeId = 'ethereum'; // Default to ETH for mainnet
      const queryIds = ids ? `${ids},${nativeId}` : nativeId;

      try {
        // FREE CoinGecko API Call
        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${queryIds}&vs_currencies=usd&include_24hr_change=true`
        );
        const prices = await response.json();

        // Calculate Real Net Worth
        let totalVal = 0;
        let weightedChangeSum = 0;

        // 1. Process Assets List
        assets.forEach(asset => {
          const id = COIN_MAP[asset.symbol?.toUpperCase()] || asset.name?.toLowerCase();
          const priceData = prices[id];
          if (priceData) {
            const currentVal = (parseFloat(asset.balance) || 0) * priceData.usd;
            totalVal += currentVal;
            weightedChangeSum += (priceData.usd_24h_change || 0) * currentVal;
          } else {
            // Fallback to existing data if API misses
            totalVal += (asset.value || 0);
          }
        });

        // 2. Process Native Wallet Balance (If not in assets)
        // Note: Check if assets already included native token to avoid double count
        const hasNativeInAssets = assets.some(a => a.type === 'native');
        if (!hasNativeInAssets && walletBalance > 0) {
           const nativePrice = prices[nativeId]?.usd || 0;
           const nativeChange = prices[nativeId]?.usd_24h_change || 0;
           const nativeVal = walletBalance * nativePrice;
           totalVal += nativeVal;
           weightedChangeSum += nativeChange * nativeVal;
        }

        const finalChangePercent = totalVal > 0 ? (weightedChangeSum / totalVal) : 0;
        const finalChangeValue = (totalVal * finalChangePercent) / 100;

        setRealMetrics({
          totalValue: totalVal,
          change24h: finalChangeValue,
          changePercent: finalChangePercent,
          isPositive: finalChangePercent >= 0
        });

      } catch (error) {
        console.error("Market Data Error:", error);
        // Fallback to props data
        setRealMetrics({
          totalValue: data?.totalValue || 0,
          change24h: data?.change24h || 0,
          changePercent: data?.changePercent || 0,
          isPositive: (data?.change24h || 0) >= 0
        });
      } finally {
        setIsRefreshing(false);
      }
    };

    if (data || walletBalance) fetchLiveMarketData();
    
    // Generate Random AI Data
    setAiData(generateMockAIData());
    const interval = setInterval(() => setAiData(generateMockAIData()), 15000); // Live updates feeling
    return () => clearInterval(interval);

  }, [data, walletBalance]);

  // 2. HELPER: Generate Realistic "Random" AI Data
  const generateMockAIData = () => {
    return {
      healthScore: (7.5 + Math.random() * 2).toFixed(1),
      smartMoney: Math.floor(70 + Math.random() * 25),
      whaleSync: Math.floor(60 + Math.random() * 30),
      prediction: {
        move: (Math.random() * 5).toFixed(2),
        direction: Math.random() > 0.4 ? 'up' : 'down',
        confidence: Math.floor(65 + Math.random() * 25)
      },
      gas: {
        gwei: Math.floor(15 + Math.random() * 20),
        savings: Math.floor(50 + Math.random() * 100)
      },
      sentiment: {
        score: Math.floor(40 + Math.random() * 40),
        label: Math.random() > 0.5 ? 'Bullish' : 'Neutral'
      },
      rebalance: {
        ethCurrent: 55 + Math.floor(Math.random() * 10),
        ethTarget: 45,
        impact: (5 + Math.random() * 10).toFixed(1)
      }
    };
  };

  // 3. CHART CONFIG (Heartbeat)
  const getChartOption = () => {
    const isUp = realMetrics?.isPositive;
    const color = isUp ? '#4ADE80' : '#F87171';
    const dataPoints = Array.from({ length: 40 }, (_, i) => 
      100 + (Math.random() * 20) + (i * (isUp ? 2 : -2))
    );

    return {
      grid: { top: 0, bottom: 0, left: 0, right: 0 },
      xAxis: { type: 'category', show: false, boundaryGap: false },
      yAxis: { type: 'value', show: false, min: 'dataMin', max: 'dataMax' },
      series: [{
        data: dataPoints,
        type: 'line',
        smooth: 0.5,
        showSymbol: false,
        lineStyle: { width: 3, color: color },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: isUp ? 'rgba(74, 222, 128, 0.2)' : 'rgba(248, 113, 113, 0.2)' },
            { offset: 1, color: 'rgba(0,0,0,0)' }
          ])
        }
      }]
    };
  };

  // TABS CONFIGURATION
  const tabs = [
    { id: 'health', label: 'Health', icon: FiActivity },
    { id: 'predict', label: 'Predict', icon: FiBarChart2 },
    { id: 'alerts', label: 'Alerts', icon: FiAlertTriangle },
    { id: 'defi', label: 'DeFi', icon: FiPercent },
  ];

  if (!realMetrics || !aiData) return <div className="h-96 animate-pulse bg-white/5 rounded-[2.5rem]"></div>;

  return (
    <div className="flex flex-col gap-6">
      
      {/* --- HERO SECTION: NET WORTH --- */}
      <div className="relative w-full rounded-[2.5rem] border border-white/5 bg-[#121214]/80 backdrop-blur-2xl p-8 overflow-hidden group">
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8B5CF6]/10 rounded-full blur-[100px] pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-end gap-8">
          {/* Value Display */}
          <div className="space-y-4 flex-1">
            <div className="flex items-center gap-2">
               <div className="p-1.5 rounded-lg bg-white/5 border border-white/5 text-[#8B5CF6]">
                 <FiLayers />
               </div>
               <span className="text-sm font-bold text-white/60 uppercase tracking-widest">Net Worth</span>
               {isRefreshing && <FiRefreshCw className="w-3 h-3 text-white/40 animate-spin ml-2" />}
            </div>
            
            <div className="relative">
               <h2 className="text-5xl lg:text-7xl font-semibold text-white tracking-tighter">
                 ${realMetrics.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
               </h2>
               <div className="flex items-center gap-3 mt-2">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${realMetrics.isPositive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                    {realMetrics.isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
                    <span className="text-sm font-bold">{Math.abs(realMetrics.changePercent).toFixed(2)}%</span>
                  </div>
                  <span className="text-sm text-white/40 font-mono">
                    {realMetrics.isPositive ? '+' : '-'}${Math.abs(realMetrics.change24h).toFixed(2)} (24h)
                  </span>
               </div>
            </div>
          </div>

          {/* Micro Chart */}
          <div className="w-full md:w-1/3 h-[100px] relative opacity-60 group-hover:opacity-100 transition-opacity">
            <ReactECharts
              option={getChartOption()}
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
          </div>
        </div>
      </div>

      {/* --- AI COMMAND CENTER --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT: AI Health Score (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-[2rem] bg-gradient-to-br from-[#1E1E24] to-[#0A0A0B] border border-white/5 relative overflow-hidden">
           <div className="absolute inset-0 bg-[#8B5CF6]/5 animate-pulse pointer-events-none"></div>
           
           <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                 <FiCpu className="text-[#8B5CF6]" />
                 <span className="text-sm font-bold text-white">AI Health Score</span>
              </div>
              <div className="text-2xl font-black text-white">{aiData.healthScore}<span className="text-sm text-white/40 font-normal">/10</span></div>
           </div>

           <div className="space-y-4">
              <div className="space-y-1">
                 <div className="flex justify-between text-xs text-white/60">
                    <span>Smart Money Alignment</span>
                    <span>{aiData.smartMoney}%</span>
                 </div>
                 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${aiData.smartMoney}%` }} className="h-full bg-emerald-500" />
                 </div>
              </div>
              <div className="space-y-1">
                 <div className="flex justify-between text-xs text-white/60">
                    <span>Whale Activity Sync</span>
                    <span>{aiData.whaleSync}%</span>
                 </div>
                 <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${aiData.whaleSync}%` }} className="h-full bg-[#8B5CF6]" />
                 </div>
              </div>
              <div className="pt-4 mt-2 border-t border-white/5 flex items-center justify-between">
                 <span className="text-xs text-white/40">Risk-Adjusted Returns</span>
                 <span className="text-xs font-bold text-emerald-400">Above Average</span>
              </div>
           </div>
        </div>

        {/* RIGHT: Tabbed Intelligence Modules (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
           {/* Tabs */}
           <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                     activeTab === tab.id 
                       ? 'bg-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20' 
                       : 'bg-white/5 text-white/60 hover:bg-white/10'
                   }`}
                 >
                    <tab.icon /> {tab.label}
                 </button>
              ))}
           </div>

           {/* Panels */}
           <div className="flex-1 p-6 rounded-[2rem] bg-[#121214]/60 border border-white/5 backdrop-blur-xl min-h-[220px]">
              <AnimatePresence mode="wait">
                 
                 {/* 1. PREDICTIVE PANEL */}
                 {activeTab === 'predict' && (
                    <motion.div key="predict" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                       <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
                          <FiBarChart2 className="text-[#8B5CF6]" /> 24H AI Forecast
                       </h3>
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                             <p className="text-xs text-white/40">Probability Bands</p>
                             <p className="text-lg font-bold text-white mt-1">
                                {aiData.prediction.confidence}% Chance
                             </p>
                             <p className={`text-xs ${aiData.prediction.direction === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                of {aiData.prediction.direction === 'up' ? '+' : '-'}{aiData.prediction.move}% movement
                             </p>
                          </div>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                             <p className="text-xs text-white/40">Risk Events</p>
                             <div className="mt-2 flex gap-2 flex-wrap">
                                <span className="px-2 py-1 rounded bg-yellow-500/10 text-yellow-500 text-[10px] border border-yellow-500/20">Token Unlock</span>
                                <span className="px-2 py-1 rounded bg-blue-500/10 text-blue-500 text-[10px] border border-blue-500/20">Governance</span>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 )}

                 {/* 2. ALERTS PANEL */}
                 {activeTab === 'alerts' && (
                    <motion.div key="alerts" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">
                       <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
                          <FiAlertTriangle className="text-yellow-500" /> Smart Triggers
                       </h3>
                       <div className="space-y-2">
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border-l-2 border-emerald-500">
                             <div className="p-1.5 bg-emerald-500/20 rounded-lg text-emerald-500"><FiZap /></div>
                             <div>
                                <p className="text-xs text-white">Whale bought $2M of top holding (ETH)</p>
                                <p className="text-[10px] text-white/40">2 mins ago • High Impact</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border-l-2 border-blue-500">
                             <div className="p-1.5 bg-blue-500/20 rounded-lg text-blue-500"><FiGlobe /></div>
                             <div>
                                <p className="text-xs text-white">Portfolio correlation with BTC up to 0.85</p>
                                <p className="text-[10px] text-white/40">1 hour ago • Info</p>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 )}

                 {/* 3. HEALTH / REBALANCE PANEL (Default) */}
                 {activeTab === 'health' && (
                    <motion.div key="health" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-2 gap-6">
                       <div className="space-y-4">
                          <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
                             <FiTarget className="text-[#8B5CF6]" /> Rebalancing
                          </h3>
                          <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                             <div className="flex justify-between mb-2">
                                <span className="text-xs text-white/40">Current ETH</span>
                                <span className="text-xs font-bold text-white">{aiData.rebalance.ethCurrent}%</span>
                             </div>
                             <div className="flex justify-between mb-4">
                                <span className="text-xs text-white/40">Target ETH</span>
                                <span className="text-xs font-bold text-[#8B5CF6]">{aiData.rebalance.ethTarget}%</span>
                             </div>
                             <button className="w-full py-2 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6] text-xs font-bold hover:bg-[#8B5CF6] hover:text-white transition-all">
                                Execute Rebalance
                             </button>
                          </div>
                       </div>
                       
                       <div className="space-y-4">
                          <h3 className="text-sm font-bold text-white/80 uppercase tracking-widest flex items-center gap-2">
                             <FiSmile className="text-yellow-400" /> Sentiment
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                             <div className="p-3 rounded-xl bg-white/5 text-center">
                                <p className="text-[10px] text-white/40">Social</p>
                                <p className="text-sm font-bold text-emerald-400">Bullish</p>
                             </div>
                             <div className="p-3 rounded-xl bg-white/5 text-center">
                                <p className="text-[10px] text-white/40">Fear/Greed</p>
                                <p className="text-sm font-bold text-white">65</p>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 )}

                 {/* 4. GAS & DEFI PANEL */}
                 {activeTab === 'defi' && (
                    <motion.div key="defi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-900/20 to-transparent border border-blue-500/20">
                             <div className="flex items-center gap-2 mb-2 text-blue-400">
                                <FiWind /> <span className="text-xs font-bold uppercase">Gas Optimizer</span>
                             </div>
                             <p className="text-2xl font-bold text-white">{aiData.gas.gwei} <span className="text-xs font-normal text-white/40">gwei</span></p>
                             <p className="text-[10px] text-emerald-400 mt-1">60% below avg • Trade Now</p>
                          </div>
                          <div className="p-4 rounded-xl bg-gradient-to-br from-purple-900/20 to-transparent border border-purple-500/20">
                             <div className="flex items-center gap-2 mb-2 text-purple-400">
                                <FiPercent /> <span className="text-xs font-bold uppercase">Yield Scanner</span>
                             </div>
                             <div className="space-y-1">
                                <div className="flex justify-between text-xs">
                                   <span className="text-white/60">Aave USDC</span>
                                   <span className="text-emerald-400 font-bold">4.2%</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                   <span className="text-white/60">Uniswap ETH</span>
                                   <span className="text-emerald-400 font-bold">12.5%</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    </motion.div>
                 )}

              </AnimatePresence>
           </div>
        </div>
      </div>

    </div>
  );
}