'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts'; // Ensure import for gradients
import { FiMaximize2, FiInfo } from 'react-icons/fi';
import { GiRadarSweep } from "react-icons/gi";

export default function RadarAnalysis({ portfolioMetrics }) {
  const [metrics, setMetrics] = useState({
    diversification: 50,
    liquidity: 50,
    growth: 50,
    stability: 50,
    volume: 50,
    marketCap: 50
  });

  // 1. Data Hydration Strategy
  useEffect(() => {
    if (portfolioMetrics) {
      setMetrics(portfolioMetrics);
      localStorage.setItem('portly_radar_metrics', JSON.stringify(portfolioMetrics));
    } else {
      // Fallback: Check local storage for pre-calculated metrics
      const cached = localStorage.getItem('portly_radar_metrics');
      if (cached) {
        try {
          setMetrics(JSON.parse(cached));
          return;
        } catch (e) { console.error(e); }
      }

      // Deep Fallback: Calculate from cached assets if metrics are missing
      const cachedAssetsStr = localStorage.getItem('portly_data_cache');
      if (cachedAssetsStr) {
        try {
          const data = JSON.parse(cachedAssetsStr);
          const assets = data.assets || [];
          if (assets.length > 0) {
             // Basic heuristic calculation
             const calculated = {
                diversification: Math.min(100, assets.length * 15),
                liquidity: assets.some(a => ['USDC','USDT'].includes(a.symbol)) ? 80 : 40,
                growth: 65, // Placeholder logic
                stability: 55, // Placeholder logic
                volume: 70, // Placeholder logic
                marketCap: 60 // Placeholder logic
             };
             setMetrics(calculated);
          }
        } catch (e) { console.error("Asset calc error", e); }
      }
    }
  }, [portfolioMetrics]);

  // 2. Chart Options (Premium Style)
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
      center: ['50%', '50%'],
      radius: '65%',
      splitNumber: 4,
      axisName: {
        color: 'rgba(255, 255, 255, 0.4)',
        fontSize: 10,
        fontFamily: 'inherit',
        fontWeight: 600
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
          color: ['rgba(139, 92, 246, 0.01)', 'rgba(139, 92, 246, 0.05)']
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(255, 255, 255, 0.1)'
        }
      }
    },
    series: [{
      name: 'Portfolio Analysis',
      type: 'radar',
      symbol: 'circle',
      symbolSize: 6,
      itemStyle: {
        color: '#fff',
        borderColor: '#8B5CF6',
        borderWidth: 2,
        shadowColor: '#8B5CF6',
        shadowBlur: 10
      },
      lineStyle: {
        width: 2,
        color: '#8B5CF6'
      },
      areaStyle: {
        color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
          { offset: 0, color: 'rgba(139, 92, 246, 0.6)' },
          { offset: 1, color: 'rgba(139, 92, 246, 0.1)' }
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
      {/* Glow Effect */}
      <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#8B5CF6]/20 transition-colors duration-500"></div>

      {/* Header */}
      <div className="flex items-center justify-between mb-4 z-10">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5">
            <GiRadarSweep className="w-4 h-4 text-[#8B5CF6]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">Metrics Radar</h3>
            <p className="text-[10px] text-white/40">Multi-vector analysis</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end">
           <div className="text-2xl font-bold text-white">{overallScore}</div>
           <span className="text-[10px] text-white/40 uppercase tracking-widest">Score</span>
        </div>
      </div>

      {/* Chart */}
      <div className="flex-1 relative min-h-[250px] -mx-4">
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Metrics Grid Footer */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-white/5 z-10">
        {Object.entries(metrics).map(([key, value], i) => (
          <div 
            key={key}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-white/5 transition-colors cursor-default"
          >
            <span className="text-[10px] text-white/40 uppercase tracking-wider mb-1">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </span>
            <div className="flex items-center gap-1.5">
              <div 
                className={`w-1.5 h-1.5 rounded-full ${
                  value > 70 ? 'bg-emerald-400 shadow-[0_0_5px_#34D399]' : 
                  value > 40 ? 'bg-[#8B5CF6] shadow-[0_0_5px_#8B5CF6]' : 
                  'bg-rose-400'
                }`} 
              />
              <span className="text-xs font-bold text-white">{value}</span>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}