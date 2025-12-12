'use client';

import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { LuRadar } from "react-icons/lu";

export default function RadarAnalysis({ portfolioMetrics }) {
  // Default metrics if not provided
  const metrics = portfolioMetrics || {
    diversification: 75,
    liquidity: 68,
    growth: 82,
    stability: 59,
    volume: 71,
    marketCap: 85
  };

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(30, 31, 38, 0.95)',
      borderColor: '#242437',
      borderWidth: 1,
      textStyle: {
        color: '#E5E7EB',
        fontSize: 12
      }
    },
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
      name: {
        textStyle: {
          color: '#E5E7EB',
          fontSize: 12,
          fontWeight: 'bold'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#242437',
          width: 2
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(139, 92, 246, 0.05)', 'rgba(139, 92, 246, 0.1)'],
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 10
        }
      },
      axisLine: {
        lineStyle: {
          color: '#242437',
          width: 2
        }
      }
    },
    series: [
      {
        name: 'Portfolio Metrics',
        type: 'radar',
        symbol: 'circle',
        symbolSize: 8,
        emphasis: {
          lineStyle: {
            width: 4
          },
          areaStyle: {
            color: 'rgba(139, 92, 246, 0.6)'
          }
        },
        lineStyle: {
          width: 3,
          color: '#8B5CF6',
          shadowColor: 'rgba(139, 92, 246, 0.5)',
          shadowBlur: 10
        },
        areaStyle: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              { offset: 0, color: 'rgba(139, 92, 246, 0.6)' },
              { offset: 1, color: 'rgba(139, 92, 246, 0.1)' }
            ]
          }
        },
        data: [
          {
            value: [
              metrics.diversification,
              metrics.liquidity,
              metrics.growth,
              metrics.stability,
              metrics.volume,
              metrics.marketCap
            ],
            name: 'Portfolio Score',
            itemStyle: {
              color: '#8B5CF6'
            }
          }
        ]
      }
    ]
  };

  const averageScore = Object.values(metrics).reduce((sum, val) => sum + val, 0) / Object.keys(metrics).length;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <LuRadar className="w-5 h-5 text-[#8B5CF6]" />
          <h3 className="text-lg font-semibold text-[#F9FAFB]">Portfolio Analysis</h3>
        </div>
        <div className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/10">
          <span className="text-sm font-bold text-[#8B5CF6]">{averageScore.toFixed(0)}/100</span>
        </div>
      </div>

      {/* Radar Chart */}
      <ReactECharts
        option={option}
        style={{ height: '350px' }}
        opts={{ renderer: 'svg' }}
      />

      {/* Metrics Grid */}
      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-[#242437]">
        {Object.entries(metrics).map(([key, value], index) => {
          const getColor = (val) => {
            if (val >= 80) return '#4ADE80';
            if (val >= 60) return '#8B5CF6';
            return '#F87171';
          };

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="text-center"
            >
              <p className="text-xs text-[#9CA3AF] mb-1 capitalize">
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </p>
              <div className="flex items-center justify-center gap-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: getColor(value) }}
                />
                <span className="text-sm font-bold text-[#F9FAFB]">{value}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
