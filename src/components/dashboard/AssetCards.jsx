'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import ReactMarkdown from 'react-markdown';
import { 
  FiArrowUpRight, FiArrowDownRight, FiZap, FiAlertCircle, 
  FiActivity, FiRefreshCw, FiDollarSign, FiClock 
} from 'react-icons/fi';
import { 
  SiBitcoin, SiEthereum, SiBnbchain, SiPolygon, SiSolana, 
  SiTether, SiXrp, SiCardano, SiDogecoin, SiChainlink 
} from 'react-icons/si';

// --- COIN MAPPING SYSTEM ---
const COIN_MAP = {
  'BTC': { id: 'bitcoin', icon: SiBitcoin, color: '#F7931A' },
  'ETH': { id: 'ethereum', icon: SiEthereum, color: '#627EEA' },
  'BNB': { id: 'binancecoin', icon: SiBnbchain, color: '#F3BA2F' },
  'MATIC': { id: 'matic-network', icon: SiPolygon, color: '#8247E5' },
  'SOL': { id: 'solana', icon: SiSolana, color: '#14F195' },
  'USDT': { id: 'tether', icon: SiTether, color: '#26A17B' },
  'XRP': { id: 'ripple', icon: SiXrp, color: '#23292F' },
  'ADA': { id: 'cardano', icon: SiCardano, color: '#0033AD' },
  'DOGE': { id: 'dogecoin', icon: SiDogecoin, color: '#C2A633' },
  'LINK': { id: 'chainlink', icon: SiChainlink, color: '#2A5ADA' },
};

export default function AssetCards({ assets = [] }) {
  const [livePrices, setLivePrices] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showAIInsights, setShowAIInsights] = useState({});
  const [loadingInsights, setLoadingInsights] = useState({});
  const [aiInsights, setAiInsights] = useState({});

  // 1. LIVE MARKET DATA ENGINE (Real-Time Precision)
  useEffect(() => {
    if (!assets || assets.length === 0) {
      setIsLoading(false);
      return;
    }

    const fetchLivePrices = async () => {
      try {
        // Construct query IDs dynamically based on held assets
        const queryIds = assets
          .map(a => COIN_MAP[a.symbol?.toUpperCase()]?.id || a.name?.toLowerCase().replace(/\s+/g, '-'))
          .filter(id => id)
          .join(',');

        if (!queryIds) return;

        const response = await fetch(
          `https://api.coingecko.com/api/v3/simple/price?ids=${queryIds}&vs_currencies=usd&include_24hr_change=true`
        );
        
        if (!response.ok) throw new Error('Market data fetch failed');
        
        const data = await response.json();
        setLivePrices(data);
      } catch (error) {
        console.error("Live Price Error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLivePrices();
    const interval = setInterval(fetchLivePrices, 60000); // 60s Refresh
    return () => clearInterval(interval);
  }, [assets]);

  // 2. AI INSIGHT HANDLER
  const fetchAIInsights = async (asset, realData) => {
    setLoadingInsights(prev => ({ ...prev, [asset.symbol]: true }));
    try {
      const prompt = `Analyze ${asset.name} (${asset.symbol}):
      - Current Price: $${realData.currentPrice.toFixed(2)}
      - Holdings Value: $${realData.totalValue.toFixed(2)}
      - 24h Change: ${realData.change24h.toFixed(2)}%
      
      Provide 3 ultra-concise, actionable bullet points (Buy/Sell/Hold signals) in Markdown.`;

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: "user", content: prompt }]
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(prev => ({ ...prev, [asset.symbol]: data.reply }));
      }
    } catch (error) {
      console.error('AI Error:', error);
    } finally {
      setLoadingInsights(prev => ({ ...prev, [asset.symbol]: false }));
    }
  };

  const toggleAIInsights = async (asset, realData) => {
    const isShown = showAIInsights[asset.symbol];
    setShowAIInsights(prev => ({ ...prev, [asset.symbol]: !isShown }));
    if (!isShown && !aiInsights[asset.symbol]) await fetchAIInsights(asset, realData);
  };

  // 3. SPARKLINE CHART CONFIG
  const getSparklineOption = (isPositive) => ({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false, boundaryGap: false },
    yAxis: { type: 'value', show: false, min: 'dataMin', max: 'dataMax' },
    series: [{
      type: 'line',
      // Simulated trend curve since simple/price doesn't give history (saves API calls)
      data: Array.from({length: 10}, () => Math.random() * 100), 
      smooth: 0.4,
      symbol: 'none',
      lineStyle: { width: 2, color: isPositive ? '#10B981' : '#EF4444' },
      areaStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: isPositive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)' },
          { offset: 1, color: 'rgba(0,0,0,0)' }
        ])
      }
    }]
  });

  if (!assets || assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 rounded-[2rem] border border-white/5 bg-[#121214]/60 text-center backdrop-blur-xl">
        <FiActivity className="w-10 h-10 text-white/20 mb-4" />
        <p className="text-white/40">No assets detected in connected wallet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <h3 className="text-lg font-bold text-white tracking-wide">Your Assets</h3>
          {isLoading && <FiRefreshCw className="w-4 h-4 text-[#8B5CF6] animate-spin" />}
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-bold text-white/60 uppercase tracking-wider">Live Prices</span>
        </div>
      </div>

      {/* Asset Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {assets.map((asset, index) => {
          // --- REAL-TIME DATA MERGE ---
          const coinId = COIN_MAP[asset.symbol?.toUpperCase()]?.id || asset.name?.toLowerCase().replace(/\s+/g, '-');
          const liveData = livePrices[coinId];
          
          // Priority: Live Data > Prop Data > Fallback
          const currentPrice = liveData?.usd || (asset.value / parseFloat(asset.balance)) || 0;
          const change24h = liveData?.usd_24h_change || asset.change24h || 0;
          const totalValue = parseFloat(asset.balance) * currentPrice;
          const isPositive = change24h >= 0;
          
          const CoinIcon = COIN_MAP[asset.symbol?.toUpperCase()]?.icon;

          return (
            <motion.div
              key={asset.symbol + index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="group relative flex flex-col p-5 overflow-hidden rounded-[1.5rem] border border-white/5 bg-[#121214]/80 backdrop-blur-xl transition-all hover:border-[#8B5CF6]/30 hover:shadow-2xl hover:shadow-[#8B5CF6]/10"
            >
              {/* Top Row: Icon & Name */}
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                    {CoinIcon ? (
                      <CoinIcon className="w-5 h-5" style={{ color: COIN_MAP[asset.symbol?.toUpperCase()]?.color }} />
                    ) : (
                      <span className="font-bold text-white/40 text-xs">{asset.symbol?.substring(0,2)}</span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm tracking-tight">{asset.name}</h4>
                    <span className="text-[10px] text-white/40 font-mono tracking-wider">{asset.symbol}</span>
                  </div>
                </div>

                <div className={`flex items-center gap-1 px-2 py-1 rounded-lg border backdrop-blur-md ${
                  isPositive 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {isPositive ? <FiArrowUpRight className="w-3 h-3" /> : <FiArrowDownRight className="w-3 h-3" />}
                  <span className="text-[10px] font-bold">{Math.abs(change24h).toFixed(2)}%</span>
                </div>
              </div>

              {/* Middle Row: Value */}
              <div className="mb-4 relative z-10">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-white tracking-tight">
                    ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] text-white/40 font-mono">
                    {parseFloat(asset.balance).toFixed(4)} {asset.symbol}
                  </span>
                  <span className="text-[11px] text-white/20">•</span>
                  <span className="text-[11px] text-white/40 font-mono">
                    ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Bottom Row: AI Actions */}
              <div className="mt-auto pt-4 border-t border-white/5 relative z-10">
                <button 
                  onClick={() => toggleAIInsights(asset, { currentPrice, totalValue, change24h })}
                  disabled={loadingInsights[asset.symbol]}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all ${
                    showAIInsights[asset.symbol]
                      ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/20'
                      : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {loadingInsights[asset.symbol] ? (
                    <FiRefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <FiZap className={`w-3.5 h-3.5 ${showAIInsights[asset.symbol] ? 'fill-white' : ''}`} />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wide">
                    {loadingInsights[asset.symbol] ? 'Analyzing...' : showAIInsights[asset.symbol] ? 'Close Insights' : 'AI Analysis'}
                  </span>
                </button>
              </div>

              {/* AI Insight Overlay */}
              <AnimatePresence>
                {showAIInsights[asset.symbol] && aiInsights[asset.symbol] && (
                  <motion.div
                    initial={{ height: 0, opacity: 0, marginTop: 0 }}
                    animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
                    exit={{ height: 0, opacity: 0, marginTop: 0 }}
                    className="overflow-hidden relative z-10"
                  >
                    <div className="p-3 rounded-xl bg-[#1E1E24] border border-[#8B5CF6]/30 shadow-inner">
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown components={{
                          ul: ({node, ...props}) => <ul className="space-y-1 m-0 p-0 list-none" {...props} />,
                          li: ({node, ...props}) => <li className="flex gap-2 text-[10px] text-white/80 leading-relaxed" {...props}><span className="mt-1 w-1 h-1 rounded-full bg-[#8B5CF6] flex-shrink-0"/><span>{props.children}</span></li>,
                          strong: ({node, ...props}) => <strong className="text-[#8B5CF6] font-bold" {...props} />,
                          p: ({node, ...props}) => <span {...props} />
                        }}>
                          {aiInsights[asset.symbol]}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </motion.div>
          );
        })}

        {/* --- LIMITATIONS CARD --- */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center justify-center p-6 rounded-[1.5rem] border border-dashed border-white/10 bg-transparent text-center space-y-3 min-h-[200px]"
        >
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center">
            <FiAlertCircle className="w-5 h-5 text-white/20" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white/60 uppercase tracking-widest">System Note</h4>
            <p className="text-[10px] text-white/30 mt-1 max-w-[200px] mx-auto leading-relaxed">
              Meme coins and low-cap tokens may not appear if they are not listed on CoinGecko.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}