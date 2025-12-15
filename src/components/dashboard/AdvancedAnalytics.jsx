'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import { 
  FiActivity, FiShield, FiTrendingUp, FiRepeat, FiGlobe, 
  FiAlertTriangle, FiCpu, FiUsers, FiLock, FiZap, FiRefreshCw 
} from 'react-icons/fi';

// --- LIVE TICKER COMPONENT ---
const Ticker = ({ items }) => {
  return (
    <div className="w-full overflow-hidden border-b border-white/5 bg-[#0A0A0B]/50 backdrop-blur-sm">
      <motion.div 
        className="flex whitespace-nowrap py-2"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
      >
        {[...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 mx-6">
            <span className="font-bold text-sm text-white">{item.symbol.toUpperCase()}</span>
            <span className="text-xs text-white/60">${item.current_price?.toLocaleString()}</span>
            <span className={`text-xs ${item.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {item.price_change_percentage_24h?.toFixed(2)}%
            </span>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function AdvancedAnalytics() {
  const [marketData, setMarketData] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [activeTab, setActiveTab] = useState('risk');
  const [botStatus, setBotStatus] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState(null);

  // 1. DATA HYDRATION (Local + API)
  useEffect(() => {
    // Load Portfolio from Cache
    const cached = localStorage.getItem('portly_data_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        setPortfolio(parsed.assets || []);
      } catch (e) {}
    }

    // Fetch Market Data (CoinGecko Free)
    const fetchMarket = async () => {
      try {
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false');
        const data = await res.json();
        setMarketData(data);
      } catch (e) { console.error("Market fetch failed", e); }
    };
    fetchMarket();
    const interval = setInterval(fetchMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  // 2. AI SIMULATION ENGINE
  const runAiAnalysis = async (type) => {
    setIsAiLoading(true);
    // Simulating a heavy AI call to /api/agent
    setTimeout(() => {
      const responses = {
        risk: "**Risk Forecast:** Volatility decreasing (-5%). Upside potential +15% based on current liquidity depth.",
        narrative: "**Narrative Detected:** AI Tokens are trending (+45%). Your exposure is low (5%). Suggest rotation from Meme coins.",
        security: "**Security Scan:** 12 active approvals detected on old contracts. Review recommended. Hardware wallet connected."
      };
      setAiInsight(responses[type] || "Analysis complete.");
      setIsAiLoading(false);
    }, 1500);
  };

  // 3. CHARTS CONFIG
  const getStressTestOption = () => ({
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    grid: { top: 10, bottom: 20, left: 0, right: 0, containLabel: true },
    xAxis: { 
      type: 'category', 
      data: ['2008 Crisis', 'COVID Crash', '2022 Bear', 'Current Risk'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { color: '#6B7280', fontSize: 10 }
    },
    yAxis: { show: false },
    series: [{
      type: 'bar',
      data: [
        { value: -45, itemStyle: { color: '#EF4444' } },
        { value: -38, itemStyle: { color: '#F87171' } },
        { value: -52, itemStyle: { color: '#B91C1C' } },
        { value: -12, itemStyle: { color: '#10B981' } } // Current estimated risk
      ],
      barWidth: 20,
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      label: { show: true, position: 'top', color: '#fff', formatter: '{c}%' }
    }]
  });

  const getGlobeOption = () => ({
    backgroundColor: 'transparent',
    tooltip: { show: false },
    graphic: {
      elements: portfolio.map((asset, i) => ({
        type: 'circle',
        shape: { r: Math.max(5, (asset.value / 1000) * 5) }, // Size based on value
        style: { fill: i % 2 === 0 ? '#8B5CF6' : '#4ADE80', shadowBlur: 10, shadowColor: i % 2 === 0 ? '#8B5CF6' : '#4ADE80' },
        left: `${(i * 15) + 10}%`,
        top: 'center',
        key: i
      }))
    }
  });

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* --- LIVE TICKER --- */}
      {marketData.length > 0 && <Ticker items={marketData} />}

      {/* --- MAIN DASHBOARD GRID --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMN 1: AUTOMATION & SECURITY */}
        <div className="space-y-6">
          
          {/* DCA Scheduler */}
          <div className="p-6 rounded-3xl border border-white/5 bg-[#121214]/60 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl"></div>
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500"><FiRepeat /></div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase">Auto DCA</h3>
                <p className="text-[10px] text-white/40">Next Buy: Tomorrow 10:00 AM</p>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 rounded-xl bg-white/5">
                <span className="text-xs text-white/60">Amount</span>
                <span className="font-bold text-white">$100 → ETH</span>
              </div>
              <div className="flex justify-between text-xs text-white/40 px-1">
                <span>Total Invested: $2,400</span>
                <span>Avg Entry: $2,245</span>
              </div>
            </div>
          </div>

          {/* AI Trading Bot */}
          <div className="p-6 rounded-3xl border border-white/5 bg-[#121214]/60 backdrop-blur-xl">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-[#8B5CF6]/10 text-[#8B5CF6]"><FiCpu /></div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase">AI Bot</h3>
                  <p className="text-[10px] text-emerald-400">Strategy: Mean Reversion</p>
                </div>
              </div>
              <button 
                onClick={() => setBotStatus(!botStatus)}
                className={`w-10 h-5 rounded-full p-1 transition-colors ${botStatus ? 'bg-[#8B5CF6]' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: botStatus ? 20 : 0 }}
                  className="w-3 h-3 bg-white rounded-full shadow-md" 
                />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-center">
              <div className="p-2 rounded-lg bg-white/5">
                <p className="text-[10px] text-white/40">Win Rate</p>
                <p className="text-sm font-bold text-white">68%</p>
              </div>
              <div className="p-2 rounded-lg bg-white/5">
                <p className="text-[10px] text-white/40">30D Profit</p>
                <p className="text-sm font-bold text-emerald-400">+$340</p>
              </div>
            </div>
          </div>

        </div>

        {/* COLUMN 2: VISUALIZATION & STRESS TEST (Wide) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 3D Portfolio Globe (Simulated) */}
          <div className="relative h-[250px] rounded-3xl border border-white/5 bg-[#0A0A0B] overflow-hidden">
            <div className="absolute top-4 left-6 z-10">
              <div className="flex items-center gap-2 mb-1">
                <FiGlobe className="text-[#8B5CF6]" />
                <h3 className="text-sm font-bold text-white uppercase">Asset Galaxy</h3>
              </div>
              <p className="text-[10px] text-white/40">Visual allocation map</p>
            </div>
            
            {/* ECharts Instance */}
            <ReactECharts 
              option={getGlobeOption()} 
              style={{ height: '100%', width: '100%' }}
              opts={{ renderer: 'svg' }}
            />
            
            {/* Floating Labels */}
            <div className="absolute bottom-4 right-6 flex gap-4">
               {portfolio.slice(0, 3).map((asset, i) => (
                 <div key={i} className="flex items-center gap-2 text-xs text-white/60">
                    <span className={`w-2 h-2 rounded-full ${i%2===0 ? 'bg-[#8B5CF6]' : 'bg-[#4ADE80]'}`}></span>
                    {asset.symbol}
                 </div>
               ))}
            </div>
          </div>

          {/* Stress Test & Narratives */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             
             {/* Stress Test Chart */}
             <div className="p-6 rounded-3xl border border-white/5 bg-[#121214]/60 backdrop-blur-xl">
                <div className="flex items-center justify-between mb-4">
                   <div className="flex items-center gap-2">
                      <FiActivity className="text-rose-400" />
                      <h3 className="text-sm font-bold text-white uppercase">Stress Test</h3>
                   </div>
                   <button onClick={() => runAiAnalysis('risk')} className="p-1.5 hover:bg-white/10 rounded-lg text-white/40"><FiRefreshCw /></button>
                </div>
                <div className="h-[120px]">
                   <ReactECharts option={getStressTestOption()} style={{ height: '100%', width: '100%' }} />
                </div>
             </div>

             {/* AI Narrative Detector */}
             <div className="p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-[#1E1E24] to-[#0A0A0B] relative">
                <div className="flex items-center gap-2 mb-4">
                   <FiZap className="text-yellow-400" />
                   <h3 className="text-sm font-bold text-white uppercase">Market Narratives</h3>
                </div>
                
                {isAiLoading ? (
                  <div className="flex items-center justify-center h-[100px] text-white/40 text-xs">
                     <FiCpu className="animate-spin mr-2" /> Analyzing Trends...
                  </div>
                ) : (
                  <div className="space-y-4">
                     <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                        <div className="flex justify-between items-center mb-1">
                           <span className="text-xs font-bold text-white">🔥 AI Tokens</span>
                           <span className="text-xs font-bold text-emerald-400">+45%</span>
                        </div>
                        <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                           <div className="h-full w-[45%] bg-emerald-500"></div>
                        </div>
                     </div>
                     <p className="text-xs text-white/60 leading-relaxed">
                        {aiInsight || "System: Rotating capital into AI narratives suggested. Meme sector cooling off (-12%)."}
                     </p>
                     <button onClick={() => runAiAnalysis('narrative')} className="w-full py-2 rounded-lg bg-white/5 text-xs font-bold text-white hover:bg-white/10 transition-colors">
                        Scan Narratives
                     </button>
                  </div>
                )}
             </div>

          </div>
        </div>

      </div>

      {/* --- FOOTER METRICS --- */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Security Score', val: '7.5/10', sub: '12 Approvals Risk', icon: FiShield, color: 'text-emerald-400' },
          { label: 'Liquidity Depth', val: '$4.2M', sub: 'DEX Available', icon: FiTrendingUp, color: 'text-blue-400' },
          { label: 'Copy Trading', val: '+8.5%', sub: 'Avg ROI', icon: FiUsers, color: 'text-[#8B5CF6]' },
          { label: 'Impermanent Loss', val: '-1.2%', sub: 'Fee Offset: +6.1%', icon: FiAlertTriangle, color: 'text-yellow-400' }
        ].map((stat, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -5 }}
            className="p-4 rounded-2xl border border-white/5 bg-[#121214]/60 backdrop-blur-xl"
          >
             <div className="flex items-start justify-between mb-2">
                <p className="text-[10px] text-white/40 uppercase tracking-widest">{stat.label}</p>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
             </div>
             <p className="text-lg font-bold text-white">{stat.val}</p>
             <p className="text-[10px] text-white/40">{stat.sub}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}