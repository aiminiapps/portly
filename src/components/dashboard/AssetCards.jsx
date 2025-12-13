'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { FiTrendingUp, FiTrendingDown, FiInfo } from 'react-icons/fi';
import { SiBitcoin, SiEthereum } from 'react-icons/si';

export default function AssetCards({ assets }) {
  const [showAIInsights, setShowAIInsights] = useState({});
  const [loadingInsights, setLoadingInsights] = useState({});
  const [aiInsights, setAiInsights] = useState({});

  if (!assets || assets.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-[#9CA3AF]">No assets found in your portfolio</p>
      </div>
    );
  }

  const getSparklineOption = (data, isPositive) => ({
    grid: { left: 0, right: 0, top: 0, bottom: 0 },
    xAxis: { type: 'category', show: false, boundaryGap: false },
    yAxis: { type: 'value', show: false },
    series: [{
      type: 'line',
      data: data && data.length > 0 ? data : [0],
      smooth: true,
      symbol: 'none',
      lineStyle: {
        width: 3,
        color: isPositive ? '#4ADE80' : '#F87171',
        shadowColor: isPositive ? 'rgba(74, 222, 128, 0.5)' : 'rgba(248, 113, 113, 0.5)',
        shadowBlur: 10
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: isPositive ? 'rgba(74, 222, 128, 0.4)' : 'rgba(248, 113, 113, 0.4)' },
            { offset: 1, color: 'transparent' }
          ]
        }
      }
    }]
  });

  const fetchAIInsights = async (asset) => {
    setLoadingInsights(prev => ({ ...prev, [asset.symbol]: true }));

    try {
      const totalPortfolioValue = assets.reduce((sum, a) => sum + a.value, 0);
      const assetPercent = ((asset.value / totalPortfolioValue) * 100).toFixed(1);

      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are a crypto portfolio analyst. Provide brief, actionable insights in markdown format. Use **bold** for key points.`
            },
            {
              role: "user",
              content: `Analyze ${asset.symbol} (${asset.name}):
- Current Value: $${asset.value.toFixed(2)}
- Balance: ${parseFloat(asset.balance).toFixed(4)} ${asset.symbol}
- 24h Change: ${asset.change24h.toFixed(2)}%
- Portfolio Weight: ${assetPercent}%

Provide 3 brief bullet points about this holding.`
            }
          ]
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiInsights(prev => ({
          ...prev,
          [asset.symbol]: data.reply || 'Unable to generate insights'
        }));
      }
    } catch (error) {
      console.error('Error fetching AI insights:', error);
      setAiInsights(prev => ({
        ...prev,
        [asset.symbol]: 'Unable to fetch insights. Please try again.'
      }));
    } finally {
      setLoadingInsights(prev => ({ ...prev, [asset.symbol]: false }));
    }
  };

  const toggleAIInsights = async (asset) => {
    const isCurrentlyShown = showAIInsights[asset.symbol];
    
    setShowAIInsights(prev => ({
      ...prev,
      [asset.symbol]: !isCurrentlyShown
    }));

    // Fetch insights if not already loaded
    if (!isCurrentlyShown && !aiInsights[asset.symbol]) {
      await fetchAIInsights(asset);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[#F9FAFB]">Your Assets</h3>
        <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20">
          <FiInfo className="w-4 h-4 text-[#8B5CF6]" />
          <span className="text-sm font-medium text-[#8B5CF6]">{assets.length} Assets</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {assets.map((asset, index) => {
          const isPositive = asset.change24h >= 0;
          return (
            <motion.div
              key={asset.symbol}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-card p-6 hover:border-[#8B5CF6] transition-all cursor-pointer group relative overflow-hidden"
            >
              <div className="beam-line"></div>

              {/* Asset Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    {asset.logo ? (
                      <img src={asset.logo} alt={asset.symbol} className="w-8 h-8 rounded-full" />
                    ) : asset.symbol === 'BTC' ? (
                      <SiBitcoin className="w-7 h-7 text-white" />
                    ) : asset.symbol === 'ETH' ? (
                      <SiEthereum className="w-7 h-7 text-white" />
                    ) : (
                      <span className="text-2xl font-bold text-white">
                        {asset.symbol.charAt(0)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-[#F9FAFB]">{asset.symbol}</h4>
                    <p className="text-xs text-[#9CA3AF]">{asset.name}</p>
                  </div>
                </div>

                <div className={`px-3 py-1.5 rounded-lg ${
                  isPositive ? 'bg-[#4ADE80]/10 border border-[#4ADE80]/20' : 'bg-[#F87171]/10 border border-[#F87171]/20'
                }`}>
                  <div className="flex items-center gap-1">
                    {isPositive ? (
                      <FiTrendingUp className="w-4 h-4 text-[#4ADE80]" />
                    ) : (
                      <FiTrendingDown className="w-4 h-4 text-[#F87171]" />
                    )}
                    <span className={`text-sm font-bold ${isPositive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                      {isPositive ? '+' : ''}{asset.change24h.toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparkline Chart */}
              {asset.priceHistory && asset.priceHistory.length > 0 && (
                <div className="h-24 mb-4 rounded-lg overflow-hidden bg-[#0F0F14]/50">
                  <ReactECharts
                    option={getSparklineOption(asset.priceHistory, isPositive)}
                    style={{ height: '100%', width: '100%' }}
                    opts={{ renderer: 'svg' }}
                  />
                </div>
              )}

              {/* Values */}
              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#9CA3AF]">Balance</span>
                  <span className="text-sm font-semibold text-[#E5E7EB]">
                    {parseFloat(asset.balance).toFixed(4)} {asset.symbol}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-[#9CA3AF]">Value</span>
                  <span className="text-lg font-bold text-[#F9FAFB]">
                    ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* AI Insights Button */}
              <button
                onClick={() => toggleAIInsights(asset)}
                disabled={loadingInsights[asset.symbol]}
                className="ai-insight-btn w-full flex items-center justify-center gap-2"
              >
                {loadingInsights[asset.symbol] ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#8B5CF6] border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <FiInfo className="w-4 h-4" />
                    <span>AI Insights</span>
                  </>
                )}
              </button>

              {/* AI Insights Panel */}
              <AnimatePresence>
                {showAIInsights[asset.symbol] && aiInsights[asset.symbol] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-4 p-4 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20 overflow-hidden"
                  >
                    <p className="text-xs text-[#E5E7EB] leading-relaxed whitespace-pre-line">
                      {aiInsights[asset.symbol]}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
