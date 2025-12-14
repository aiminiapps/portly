'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';

import { GiRadarSweep } from "react-icons/gi";

export default function RadarAnalysis({ portfolioMetrics }) {
  const [metrics, setMetrics] = useState({
    diversification: 0,
    liquidity: 0,
    growth: 0,
    stability: 0,
    volume: 0,
    marketCap: 0
  });

  // ---------------------------------------------------------
  // 1. SMART SCORING ALGORITHM
  // ---------------------------------------------------------
  useEffect(() => {
    const calculateMetrics = (assets, totalValue) => {
      if (!assets || assets.length === 0) return null;

      // 1. DIVERSIFICATION: Target 6+ assets for max score
      // 1 asset = 20pts, 6 assets = 100pts
      const diversification = Math.min(100, Math.max(20, assets.length * 16));

      // 2. LIQUIDITY: Check for Stables & Blue Chips
      const stables = ['USDT', 'USDC', 'DAI', 'FDUSD'];
      const blueChips = ['ETH', 'BTC', 'BNB', 'SOL'];
      const hasStable = assets.some(a => stables.some(s => a.symbol.includes(s)));
      const hasBlueChip = assets.some(a => blueChips.some(s => a.symbol.includes(s)));
      
      let liquidity = 30; // Base
      if (hasStable) liquidity += 40;
      if (hasBlueChip) liquidity += 20;
      if (assets.length > 3) liquidity += 10;

      // 3. GROWTH: Based on 24h Change
      // Avg change of +5% = 80 score, -5% = 40 score
      const avgChange = assets.reduce((acc, curr) => acc + (parseFloat(curr.change24h) || 0), 0) / assets.length;
      let growth = 50 + (avgChange * 4); 
      growth = Math.min(100, Math.max(20, growth)); // Clamp 20-100

      // 4. STABILITY: Weighted by Stablecoin/BTC %
      // If 50% of portfolio is Stable/BTC -> High Stability
      const stableValue = assets
        .filter(a => stables.includes(a.symbol) || a.symbol === 'BTC')
        .reduce((acc, curr) => acc + (curr.value || 0), 0);
      const stabilityRatio = totalValue > 0 ? (stableValue / totalValue) : 0;
      const stability = Math.min(100, Math.max(30, Math.round(stabilityRatio * 100) + 30));

      // 5. MARKET CAP: Do you hold the big giants?
      const marketCapScore = hasBlueChip ? 85 : 45;

      // 6. VOLUME: Based on Portfolio Value (Log Scale)
      // $100 = 30pts, $10,000 = 70pts, $1M = 95pts
      const volume = Math.min(100, Math.max(20, Math.round(Math.log10(totalValue + 1) * 15) + 10));

      return {
        diversification: Math.round(diversification),
        liquidity: Math.round(liquidity),
        growth: Math.round(growth),
        stability: Math.round(stability),
        volume: Math.round(volume),
        marketCap: Math.round(marketCapScore)
      };
    };

    // LOGIC FLOW: Props -> LocalStorage(Metrics) -> LocalStorage(Assets)
    if (portfolioMetrics) {
      setMetrics(portfolioMetrics);
    } else {
      // Try calculating from cached assets
      const cachedData = localStorage.getItem('portly_data_cache');
      if (cachedData) {
        try {
          const parsed = JSON.parse(cachedData);
          if (parsed.assets && parsed.assets.length > 0) {
            const computed = calculateMetrics(parsed.assets, parsed.totalValue || 0);
            if (computed) {
              setMetrics(computed);
              return;
            }
          }
        } catch (e) { console.error("Radar calc error", e); }
      }
      
      // Default baseline if absolutely no data found (prevents 0 chart)
      setMetrics({
        diversification: 30, liquidity: 40, growth: 50,
        stability: 40, volume: 30, marketCap: 40
      });
    }
  }, [portfolioMetrics]);

  // ---------------------------------------------------------
  // 2. CHART CONFIGURATION
  // ---------------------------------------------------------
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    radar: {
      indicator: [
        { name: 'Diversification', max: 100 },
        { name: 'Liquidity', max: 100 },
        { name: 'Growth', max: 100 },
        { name: 'Stability', max: 100 },
        { name: 'Volume', max: 100 },
        { name: 'Market Cap', max: 100 }
      ],
      shape: 'polygon',
      center: ['50%', '55%'],
      radius: '65%',
      splitNumber: 4,
      axisName: {
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: 10,
        fontWeight: 600,
        fontFamily: 'inherit'
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.05)',
          width: 1
        }
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: ['rgba(139, 92, 246, 0.02)', 'rgba(139, 92, 246, 0.06)']
        }
      },
      axisLine: {
        lineStyle: { color: 'rgba(255, 255, 255, 0.1)' }
      }
    },
    series: [{
      type: 'radar',
      symbol: 'none', // Cleaner look without dots on corners
      lineStyle: {
        width: 3,
        color: '#8B5CF6',
        shadowColor: 'rgba(139, 92, 246, 0.5)',
        shadowBlur: 10
      },
      areaStyle: {
        color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
          { offset: 0, color: 'rgba(139, 92, 246, 0.5)' },
          { offset: 1, color: 'rgba(139, 92, 246, 0.05)' }
        ])
      },
      data: [{
        value: [
          metrics.diversification,
          metrics.liquidity,
          metrics.growth,
          metrics.stability,
          metrics.volume,
          metrics.marketCap
        ]
      }]
    }]
  }), [metrics]);

  const overallScore = Math.round(
    Object.values(metrics).reduce((a, b) => a + b, 0) / 6
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col h-full rounded-3xl border border-white/5 bg-[#121214]/60 backdrop-blur-xl p-6 relative overflow-hidden group"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#8B5CF6]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#8B5CF6]/10 rounded-full blur-[60px] pointer-events-none"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-2 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[#8B5CF6]">
            <GiRadarSweep className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Portfolio DNA</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] text-white/40 uppercase tracking-wide">Analysis Active</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
           <div className="text-3xl font-bold text-white tracking-tight">{overallScore}</div>
           <p className="text-[10px] text-white/40 uppercase tracking-widest">Global Score</p>
        </div>
      </div>

      {/* Chart Container */}
      <div className="flex-1 relative min-h-[280px] -mx-4 -my-2">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
        
        {/* Central HUD Element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[40%] w-16 h-16 border border-white/5 rounded-full flex items-center justify-center pointer-events-none">
          <div className="w-1 h-1 bg-white/20 rounded-full"></div>
        </div>
      </div>

      {/* Interactive Metric Grid */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 z-10">
        {Object.entries(metrics).map(([key, value], i) => (
          <motion.div 
            key={key}
            whileHover={{ y: -2, backgroundColor: 'rgba(255,255,255,0.03)' }}
            className="flex flex-col items-center p-2 rounded-lg transition-all cursor-default group/item"
          >
            <span className="text-[9px] text-white/40 uppercase tracking-wider mb-1 group-hover/item:text-white/60 transition-colors">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <div className="flex items-center gap-2">
              <div className="h-1 w-8 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${value}%` }}
                  transition={{ delay: 0.5 + (i * 0.1), duration: 1 }}
                  className={`h-full ${value > 75 ? 'bg-emerald-400' : value > 50 ? 'bg-[#8B5CF6]' : 'bg-rose-400'}`}
                />
              </div>
              <span className="text-xs font-bold text-white">{value}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}