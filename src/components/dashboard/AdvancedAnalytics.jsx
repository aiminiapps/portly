'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts'; // Import full for gradients
import ReactMarkdown from 'react-markdown'; // Added for AI text
import { 
  FiActivity, FiShield, FiTrendingUp, FiRepeat, FiGlobe, 
  FiAlertTriangle, FiCpu, FiUsers, FiLock, FiZap, FiRefreshCw,
  FiTarget, FiLayers
} from 'react-icons/fi';

// --- LIVE TICKER COMPONENT ---
const Ticker = ({ items }) => {
  return (
    <div className="w-full overflow-hidden border-y border-white/5 bg-[#0A0A0B]/80 backdrop-blur-md relative z-20">
      <motion.div 
        className="flex whitespace-nowrap py-2.5"
        animate={{ x: [0, -1000] }}
        transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
      >
        {[...items, ...items, ...items, ...items].map((item, i) => (
          <div key={i} className="flex items-center gap-2 mx-8 min-w-max">
            {item.image && <img src={item.image} alt={item.symbol} className="w-4 h-4 rounded-full" />}
            <span className="font-bold text-xs text-white uppercase tracking-wider">{item.symbol}</span>
            <span className="text-xs text-white/60 font-mono">${item.current_price?.toLocaleString()}</span>
            <span className={`text-xs font-bold ${item.price_change_percentage_24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
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
  const [botStatus, setBotStatus] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [activeInsight, setActiveInsight] = useState('risk'); // risk, narrative, security
  const [aiResponse, setAiResponse] = useState("");

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
        const res = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false');
        const data = await res.json();
        setMarketData(data);
      } catch (e) { console.error("Market fetch failed", e); }
    };
    fetchMarket();
    const interval = setInterval(fetchMarket, 60000);
    return () => clearInterval(interval);
  }, []);

  // 2. AI SIMULATION ENGINE (Markdown Powered)
  const runAiAnalysis = async (type) => {
    setActiveInsight(type);
    setIsAiLoading(true);
    setAiResponse(""); // Clear previous

    // Simulating intelligent agent response
    setTimeout(() => {
      const responses = {
        risk: `**Risk Forecast (7 Days):**\n* **Downside Risk:** -8% (Max Drawdown scenario detected)\n* **Upside Potential:** +15% if BTC holds $60k support\n* **Volatility:** ↓ Decreasing (Stable accumulation phase)`,
        narrative: `**Market Narrative Detected:**\n* **Trending:** 🔥 AI Tokens (+45% avg sector gain)\n* **Your Exposure:** Low (5%)\n* **Action:** Consider rotating 10% from Meme Coins to AI infrastructure tokens to capture trend beta.`,
        security: `**Security Scan Complete:**\n* **Score:** 7.5/10\n* **Critical:** 12 active token approvals found on old contracts.\n* **Action:** Revoke infinite approvals on Uniswap V2 to prevent drain risks.`
      };
      setAiResponse(responses[type] || "Analysis complete.");
      setIsAiLoading(false);
    }, 1500);
  };
  
  // Auto-run AI on first load
  useEffect(() => { runAiAnalysis('risk'); }, []);

  // 3. CHARTS CONFIGURATION

  // A. STRESS TEST (Fixed Overflow)
  const getStressTestOption = () => ({
    backgroundColor: 'transparent',
    tooltip: { 
      trigger: 'axis',
      backgroundColor: 'rgba(18, 18, 20, 0.95)',
      borderColor: '#374151',
      textStyle: { color: '#fff' }
    },
    grid: { 
      top: 30, 
      bottom: 20, // Increased bottom margin
      left: 10, 
      right: 10, 
      containLabel: true 
    },
    xAxis: { 
      type: 'category', 
      data: ['2008 Crisis', 'COVID Crash', 'Bear 2022', 'Current Risk'],
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { 
        color: '#9CA3AF', 
        fontSize: 10,
        interval: 0, // Force show all labels
        width: 60,
        overflow: 'break' // Handle long text
      }
    },
    yAxis: { show: false },
    series: [{
      type: 'bar',
      data: [
        { value: -45, itemStyle: { color: '#EF4444' } }, // Red
        { value: -38, itemStyle: { color: '#F87171' } }, // Light Red
        { value: -52, itemStyle: { color: '#7F1D1D' } }, // Dark Red
        { value: -12, itemStyle: { color: '#10B981', borderRadius: [4,4,0,0] } } // Green (Current)
      ],
      barWidth: '40%',
      itemStyle: { borderRadius: [4, 4, 0, 0] },
      label: { 
        show: true, 
        position: 'top', 
        color: '#fff', 
        fontWeight: 'bold',
        formatter: '{c}%' 
      }
    }]
  });

  // B. ASSET GALAXY (Creative Scatter)
  const getGalaxyOption = () => {
    // Generate orbit data based on portfolio
    const data = portfolio.map((asset, i) => {
      // Random position within a circle
      const r = Math.random() * 2; 
      const theta = Math.random() * 2 * Math.PI;
      // Size proportional to value (clamped)
      const size = Math.max(10, Math.min(50, (asset.value / 1000) * 20));
      return {
        name: asset.symbol,
        value: [
            Math.cos(theta) * r, 
            Math.sin(theta) * r,
            size
        ],
        itemStyle: {
            color: i % 2 === 0 ? '#8B5CF6' : '#4ADE80',
            shadowBlur: 20,
            shadowColor: i % 2 === 0 ? '#8B5CF6' : '#4ADE80'
        }
      };
    });

    // Add Central Star (Portfolio Core)
    data.push({
        name: 'CORE',
        value: [0, 0, 60],
        itemStyle: { color: '#fff', shadowBlur: 40, shadowColor: '#fff' }
    });

    return {
      backgroundColor: 'transparent',
      tooltip: {
        trigger: 'item',
        backgroundColor: 'rgba(18,18,20,0.9)',
        borderColor: '#8B5CF6',
        formatter: (params) => `<b style="color:white">${params.name}</b>`
      },
      xAxis: { show: false, min: -3, max: 3 },
      yAxis: { show: false, min: -3, max: 3 },
      series: [{
        type: 'graph',
        layout: 'force',
        data: data.map(d => ({
            name: d.name,
            symbolSize: d.value[2],
            x: null, 
            y: null,
            itemStyle: d.itemStyle,
            label: { show: d.value[2] > 20, fontSize: 10, color: '#fff' }
        })),
        force: {
            repulsion: 200,
            gravity: 0.1,
            edgeLength: 50
        },
        roam: true,
        label: { position: 'right' }
      }]
    };
  };

  return (
    <div className="flex flex-col gap-8 w-full pb-10">
      
      {/* 1. TOP SECTION: LIVE TICKER */}
      {marketData.length > 0 && <Ticker items={marketData} />}

      {/* 2. MAIN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 px-4 md:px-0">
        
        {/* LEFT COLUMN: AUTOMATION (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* A. DCA SCHEDULER CARD */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="p-6 rounded-[2rem] border border-white/5 bg-[#121214]/60 backdrop-blur-xl relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all"></div>
            
            <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
                <FiRepeat className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wide">Auto DCA</h3>
                <p className="text-[10px] text-white/40">Next Execution: 14h 30m</p>
              </div>
              <div className="ml-auto px-2 py-1 rounded bg-emerald-500/20 text-[10px] font-bold text-emerald-500">ACTIVE</div>
            </div>

            <div className="space-y-3 relative z-10">
               <div className="flex justify-between items-center p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                 <div className="flex flex-col">
                   <span className="text-[10px] text-white/40 uppercase">Amount</span>
                   <span className="text-lg font-bold text-white">$100 <span className="text-emerald-400">→ ETH</span></span>
                 </div>
                 <div className="text-right">
                    <span className="text-[10px] text-white/40 uppercase">Frequency</span>
                    <span className="block text-sm font-medium text-white">Weekly</span>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-2">
                    <p className="text-[10px] text-white/40">Total Invested</p>
                    <p className="text-sm font-bold text-white">$2,400</p>
                  </div>
                  <div className="p-2 border-l border-white/5">
                    <p className="text-[10px] text-white/40">Avg Entry</p>
                    <p className="text-sm font-bold text-emerald-400">$2,245</p>
                  </div>
               </div>
            </div>
          </motion.div>

          {/* B. AI BOT STATUS */}
          <motion.div 
             whileHover={{ y: -5 }}
             className="p-6 rounded-[2rem] border border-white/5 bg-[#121214]/60 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 text-[#8B5CF6]">
                  <FiCpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Trading Bot</h3>
                  <p className="text-[10px] text-white/40">Strategy: Mean Reversion</p>
                </div>
              </div>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => setBotStatus(!botStatus)}
                className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 ${botStatus ? 'bg-[#8B5CF6]' : 'bg-white/10'}`}
              >
                <motion.div 
                  animate={{ x: botStatus ? 24 : 0 }}
                  className="w-4 h-4 bg-white rounded-full shadow-lg" 
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white/[0.03] to-transparent border border-white/5">
               <div>
                  <p className="text-[10px] text-white/40 uppercase mb-1">30D Performance</p>
                  <p className="text-xl font-bold text-emerald-400">+$340.50</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-white/40 uppercase mb-1">Win Rate</p>
                  <div className="px-2 py-1 rounded bg-white/10 text-xs font-bold text-white">68%</div>
               </div>
            </div>
          </motion.div>

        </div>

        {/* CENTER COLUMN: VISUALIZATION (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* C. ASSET GALAXY */}
          <div className="h-[470px] rounded-[2rem] border border-white/5 bg-[#050505] relative overflow-hidden flex flex-col">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            
            <div className="absolute top-6 left-6 z-10">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 rounded-full bg-[#8B5CF6] animate-pulse"></div>
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Asset Galaxy</h3>
              </div>
              <p className="text-[10px] text-white/40">Force-directed allocation map</p>
            </div>

            <div className="flex-1">
               <ReactECharts 
                 option={getGalaxyOption()} 
                 style={{ height: '100%', width: '100%' }}
                 opts={{ renderer: 'svg' }}
               />
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI INSIGHTS & STRESS TEST (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
           
           {/* D. AI NARRATIVE SCANNER */}
           <div className="p-6 rounded-[2rem] border border-white/5 bg-gradient-to-b from-[#1E1E24] to-[#0A0A0B] flex flex-col min-h-[220px]">
              <div className="flex items-center justify-between mb-4">
                 <div className="flex items-center gap-2">
                    <FiZap className="text-yellow-400" />
                    <h3 className="text-sm font-bold text-white uppercase">AI Insights</h3>
                 </div>
                 <div className="flex gap-2">
                    {['risk', 'narrative', 'security'].map(type => (
                       <button 
                         key={type}
                         onClick={() => runAiAnalysis(type)}
                         className={`w-2 h-2 rounded-full transition-all ${activeInsight === type ? 'bg-[#8B5CF6] scale-150' : 'bg-white/20 hover:bg-white/40'}`}
                       />
                    ))}
                 </div>
              </div>

              <div className="flex-1 bg-white/[0.02] rounded-2xl p-4 border border-white/5 overflow-y-auto custom-scrollbar">
                 {isAiLoading ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/40 gap-3">
                       <FiCpu className="animate-spin w-5 h-5" />
                       <span className="text-xs">Processing chain data...</span>
                    </div>
                 ) : (
                    <div className="prose prose-invert prose-sm max-w-none">
                       <ReactMarkdown components={{
                          strong: ({node, ...props}) => <strong className="text-[#8B5CF6] font-semibold" {...props} />,
                          ul: ({node, ...props}) => <ul className="space-y-2 m-0 p-0" {...props} />,
                          li: ({node, ...props}) => <li className="text-xs text-white/70 leading-relaxed list-none flex gap-2" {...props}><span className="mt-1.5 w-1 h-1 rounded-full bg-[#8B5CF6] flex-shrink-0"/><span>{props.children}</span></li>,
                          p: ({node, ...props}) => <p className="text-xs text-white/80 leading-relaxed mb-2" {...props} />
                       }}>
                          {aiResponse}
                       </ReactMarkdown>
                    </div>
                 )}
              </div>
           </div>

           {/* E. STRESS TEST */}
           <div className="p-6 rounded-[2rem] border border-white/5 bg-[#121214]/60 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-2">
                 <FiActivity className="text-rose-400" />
                 <h3 className="text-sm font-bold text-white uppercase">Scenario Test</h3>
              </div>
              <div className="h-[140px] w-full">
                 <ReactECharts 
                    option={getStressTestOption()} 
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                 />
              </div>
           </div>

        </div>

      </div>

      {/* 3. BOTTOM: RAPID METRICS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-4 md:px-0">
         {[
            { label: 'Liquidity Depth', val: '$4.2M', sub: 'Instant Sell Cap', icon: FiLayers, color: 'text-blue-400' },
            { label: 'Social Sentiment', val: 'Bullish', sub: '78% Positive', icon: FiUsers, color: 'text-emerald-400' },
            { label: 'Wallet Security', val: '7.5/10', sub: '12 Risks Found', icon: FiLock, color: 'text-rose-400' },
            { label: 'Copy Trading', val: 'Active', sub: 'Following 3 Pros', icon: FiTarget, color: 'text-[#8B5CF6]' }
         ].map((stat, i) => (
            <motion.div 
               key={i}
               whileHover={{ y: -2 }}
               className="p-4 rounded-2xl border border-white/5 bg-[#121214]/40 hover:bg-[#121214]/60 transition-colors"
            >
               <div className="flex justify-between items-start mb-2">
                  <p className="text-[10px] text-white/40 uppercase tracking-widest">{stat.label}</p>
                  <stat.icon className={`w-3.5 h-3.5 ${stat.color}`} />
               </div>
               <p className="text-lg font-bold text-white">{stat.val}</p>
               <p className="text-[10px] text-white/30">{stat.sub}</p>
            </motion.div>
         ))}
      </div>

    </div>
  );
}