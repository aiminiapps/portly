'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactECharts from 'echarts-for-react';
import ReactMarkdown from 'react-markdown';
import { FiArrowUpRight, FiArrowDownRight, FiZap, FiAlertCircle, FiActivity } from 'react-icons/fi';
import { SiBitcoin, SiEthereum, SiBnbchain, SiPolygon } from 'react-icons/si';

export default function AssetCards({ assets }) {
  const [showAIInsights, setShowAIInsights] = useState({});
  const [loadingInsights, setLoadingInsights] = useState({});
  const [aiInsights, setAiInsights] = useState({});

  if (!assets || assets.length === 0) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#121214]/40 p-12 text-center backdrop-blur-xl">
        <p className="text-[#9CA3AF]">No assets found in your portfolio</p>
      </div>
    );
  }

  // Minimalist Sparkline Configuration
  const getSparklineOption = (data, isPositive) => ({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false, boundaryGap: false },
    yAxis: { type: 'value', show: false, min: 'dataMin', max: 'dataMax' },
    series: [{
      type: 'line',
      data: data?.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0],
      smooth: true,
      symbol: 'none',
      lineStyle: {
        width: 2,
        color: isPositive ? '#4ADE80' : '#EF4444',
        opacity: 0.8
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: isPositive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(239, 68, 68, 0.1)' },
            { offset: 1, color: 'transparent' }
          ]
        }
      }
    }]
  });

  const fetchAIInsights = async (asset) => {
    setLoadingInsights(prev => ({ ...prev, [asset.symbol]: true }));
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Analyze ${asset.symbol}: Value $${asset.value?.toFixed(2)}, Change ${asset.change24h?.toFixed(2)}%. Return response in Markdown: Use **bold** for key metrics and bullet points.`
          }]
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

  const toggleAIInsights = async (asset) => {
    const isShown = showAIInsights[asset.symbol];
    setShowAIInsights(prev => ({ ...prev, [asset.symbol]: !isShown }));
    if (!isShown && !aiInsights[asset.symbol]) await fetchAIInsights(asset);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <h3 className="text-xl font-medium text-white tracking-tight">Your Assets</h3>
        <span className="text-xs text-white/40 font-mono uppercase tracking-widest bg-white/5 px-3 py-1 rounded-lg border border-white/5">
          {assets.length} Holdings
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {assets.map((asset, index) => {
          // Safety Checks & Calculations
          const change24h = asset.change24h || 0;
          const balance = parseFloat(asset.balance || 0);
          const value = asset.value || 0;
          const isPositive = change24h >= 0;
          
          // Calculate "Real Price" (Price per token) based on current holdings
          const tokenPrice = balance > 0 ? (value / balance) : 0;

          return (
            <motion.div
              key={asset.symbol + index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group relative flex flex-col justify-between p-6 rounded-3xl border border-white/5 bg-[#121214]/60 backdrop-blur-xl hover:bg-[#121214]/80 transition-all hover:border-[#8B5CF6]/30"
            >
              {/* Card Header: Icon & 24h Change */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative w-12 h-12 rounded-2xl bg-[#1E1F26] border border-white/5 flex items-center justify-center overflow-hidden shadow-inner group-hover:scale-105 transition-transform">
                     {asset.logo ? (
                      <img src={asset.logo} alt={asset.symbol} className="w-7 h-7 object-contain" />
                    ) : asset.symbol === 'BTC' ? <SiBitcoin className="w-6 h-6 text-[#F7931A]" />
                      : asset.symbol === 'ETH' ? <SiEthereum className="w-6 h-6 text-[#627EEA]" />
                      : asset.symbol === 'BNB' ? <SiBnbchain className="w-6 h-6 text-[#F3BA2F]" />
                      : asset.symbol === 'MATIC' ? <SiPolygon className="w-6 h-6 text-[#8247E5]" />
                      : <span className="font-bold text-white/50">{asset.symbol[0]}</span>
                    }
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-white text-base">{asset.name}</h4>
                    <span className="text-xs text-white/40 font-mono">{asset.symbol}</span>
                  </div>
                </div>

                <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full border ${
                  isPositive 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-red-500/10 border-red-500/20 text-red-400'
                }`}>
                  {isPositive ? <FiArrowUpRight className="w-3 h-3" /> : <FiArrowDownRight className="w-3 h-3" />}
                  <span className="text-xs font-medium">{Math.abs(change24h).toFixed(2)}%</span>
                </div>
              </div>

              {/* Data Rows: Value & Real Price */}
              <div className="space-y-4 mb-6">
                <div>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs text-white/40 uppercase tracking-wider">Total Value</span>
                    <span className="text-xs text-white/40">{balance.toFixed(4)} {asset.symbol}</span>
                  </div>
                  <h2 className="text-2xl font-medium text-white tracking-tight">
                    ${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </h2>
                </div>

                {/* Real Price Section */}
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 border border-white/5">
                   <FiActivity className="w-3.5 h-3.5 text-[#8B5CF6]" />
                   <div className="flex items-baseline gap-2">
                     <span className="text-xs text-white/50">Current Price:</span>
                     <span className="text-sm font-medium text-white">
                       ${tokenPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                     </span>
                   </div>
                </div>
              </div>

              {/* Sparkline */}
              <div className="h-10 w-full opacity-40 group-hover:opacity-100 transition-opacity mb-4 filter grayscale group-hover:grayscale-0">
                 <ReactECharts
                    option={getSparklineOption(asset.priceHistory, isPositive)}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                  />
              </div>

              {/* AI Button */}
              <div className="pt-4 border-t border-white/5">
                <button
                  onClick={() => toggleAIInsights(asset)}
                  disabled={loadingInsights[asset.symbol]}
                  className="group/btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/[0.03] hover:bg-[#8B5CF6] hover:text-white border border-white/5 hover:border-[#8B5CF6] transition-all duration-300 text-xs font-medium text-white/60"
                >
                  {loadingInsights[asset.symbol] ? (
                    <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <FiZap className={`w-3.5 h-3.5 ${showAIInsights[asset.symbol] ? 'fill-current' : ''}`} />
                  )}
                  <span>{loadingInsights[asset.symbol] ? 'Analyzing...' : showAIInsights[asset.symbol] ? 'Close Insights' : 'AI Analysis'}</span>
                </button>
              </div>

              {/* AI Insight Content with Markdown */}
              <AnimatePresence>
                {showAIInsights[asset.symbol] && aiInsights[asset.symbol] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="p-4 rounded-xl bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 relative">
                      {/* Decorative glowing dot */}
                      <div className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-[#8B5CF6] animate-pulse"></div>
                      
                      {/* Markdown Renderer */}
                      <div className="prose prose-invert prose-sm max-w-none">
                        <ReactMarkdown
                          components={{
                            p: ({node, ...props}) => <p className="text-xs text-[#E5E7EB] leading-relaxed mb-2 last:mb-0" {...props} />,
                            strong: ({node, ...props}) => <strong className="text-[#8B5CF6] font-semibold" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc pl-4 space-y-1 mb-2" {...props} />,
                            li: ({node, ...props}) => <li className="text-xs text-gray-300 pl-1 marker:text-[#8B5CF6]" {...props} />
                          }}
                        >
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

        {/* Limitations Card (Added at the end) */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col items-center justify-center p-6 rounded-3xl border border-white/5 bg-[#121214]/30 text-center space-y-3 min-h-[300px]"
        >
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-1">
            <FiAlertCircle className="w-6 h-6 text-white/20" />
          </div>
          <h4 className="text-sm font-medium text-white/80">Missing Assets?</h4>
          <p className="text-xs text-white/40 leading-relaxed max-w-[200px]">
            Note: This dashboard may not detect all meme coins, new pairs, or low-liquidity tokens due to API tracking limitations.
          </p>
          <div className="px-3 py-1 rounded-full bg-white/5 border border-white/5 text-[10px] text-white/30">
            System Limitation
          </div>
        </motion.div>
      </div>
    </div>
  );
}