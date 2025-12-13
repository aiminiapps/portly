'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { FiTrendingUp, FiTrendingDown, FiZap, FiInfo } from 'react-icons/fi';

export default function PerformanceChart({ historicalData }) {
  const [selectedRange, setSelectedRange] = useState('7D');
  const [showAIInsights, setShowAIInsights] = useState(false);

  const timeRanges = ['24H', '7D', '30D', '90D', '1Y', 'ALL'];

  const getFilteredData = () => {
    if (!historicalData || historicalData.length === 0) return [];
    
    const now = new Date();
    let cutoffDate = new Date();
    
    switch (selectedRange) {
      case '24H':
        cutoffDate.setHours(now.getHours() - 24);
        break;
      case '7D':
        cutoffDate.setDate(now.getDate() - 7);
        break;
      case '30D':
        cutoffDate.setDate(now.getDate() - 30);
        break;
      case '90D':
        cutoffDate.setDate(now.getDate() - 90);
        break;
      case '1Y':
        cutoffDate.setFullYear(now.getFullYear() - 1);
        break;
      case 'ALL':
        return historicalData;
      default:
        cutoffDate.setDate(now.getDate() - 7);
    }
    
    return historicalData.filter(d => new Date(d.date) >= cutoffDate);
  };

  const data = getFilteredData();

  if (!data || data.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-[#9CA3AF]">No performance data available</p>
      </div>
    );
  }

  const dates = data.map(d => d.date);
  const values = data.map(d => d.value);

  const firstValue = values[0] || 0;
  const lastValue = values[values.length - 1] || 0;
  const totalChange = lastValue - firstValue;
  const totalChangePercent = ((totalChange / firstValue) * 100).toFixed(2);
  const isPositive = totalChange >= 0;

  const option = {
    backgroundColor: 'transparent',
    grid: {
      left: '3%',
      right: '3%',
      top: '15%',
      bottom: '15%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 31, 38, 0.98)',
      borderColor: '#8B5CF6',
      borderWidth: 2,
      textStyle: {
        color: '#E5E7EB',
        fontSize: 13
      },
      axisPointer: {
        type: 'cross',
        lineStyle: {
          color: '#8B5CF6',
          type: 'dashed'
        }
      },
      formatter: (params) => {
        const param = params[0];
        const date = new Date(param.axisValue);
        return `
          <div style="padding: 8px;">
            <div style="color: #9CA3AF; font-size: 11px; margin-bottom: 6px;">
              ${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </div>
            <div style="font-size: 16px; font-weight: bold; color: #F9FAFB;">
              $${param.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
            </div>
          </div>
        `;
      }
    },
    xAxis: {
      type: 'category',
      data: dates,
      boundaryGap: false,
      axisLine: {
        lineStyle: {
          color: '#242437',
          width: 2
        }
      },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: 500,
        formatter: (value) => {
          const date = new Date(value);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }
      },
      axisTick: {
        show: false
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#242437',
          type: 'dashed',
          opacity: 0.3
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 12,
        fontWeight: 500,
        formatter: (value) => `$${(value / 1000).toFixed(0)}k`
      },
      splitLine: {
        lineStyle: {
          color: '#242437',
          type: 'dashed',
          width: 2
        }
      }
    },
    series: [
      {
        data: values,
        type: 'line',
        smooth: true,
        showSymbol: false,
        lineStyle: {
          width: 4,
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: isPositive ? '#4ADE80' : '#F87171' },
              { offset: 0.5, color: isPositive ? '#16A34A' : '#DC2626' },
              { offset: 1, color: isPositive ? '#4ADE80' : '#F87171' }
            ]
          },
          shadowColor: isPositive ? 'rgba(74, 222, 128, 0.5)' : 'rgba(248, 113, 113, 0.5)',
          shadowBlur: 20,
          shadowOffsetY: 10
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: isPositive ? 'rgba(74, 222, 128, 0.5)' : 'rgba(248, 113, 113, 0.5)' },
              { offset: 0.7, color: isPositive ? 'rgba(74, 222, 128, 0.1)' : 'rgba(248, 113, 113, 0.1)' },
              { offset: 1, color: 'rgba(0, 0, 0, 0)' }
            ]
          }
        },
        emphasis: {
          focus: 'series',
          itemStyle: {
            color: isPositive ? '#4ADE80' : '#F87171',
            borderColor: '#0F0F14',
            borderWidth: 3,
            shadowBlur: 20,
            shadowColor: isPositive ? 'rgba(74, 222, 128, 0.8)' : 'rgba(248, 113, 113, 0.8)'
          }
        }
      }
    ]
  };

  const getAIInsights = () => {
    const trend = isPositive ? 'upward' : 'downward';
    const strength = Math.abs(totalChangePercent) > 5 ? 'strong' : Math.abs(totalChangePercent) > 2 ? 'moderate' : 'mild';
    
    return {
      trend: `**${strength.toUpperCase()} ${trend.toUpperCase()} TREND**`,
      analysis: [
        `Your portfolio has ${isPositive ? 'gained' : 'lost'} **${Math.abs(totalChangePercent)}%** in the selected ${selectedRange} period`,
        `${isPositive ? '✅' : '⚠️'} ${isPositive ? 'Strong performance - Consider taking partial profits' : 'Monitor closely - Good accumulation opportunity'}`,
        `Average daily movement: **${(Math.abs(totalChange) / data.length).toFixed(2)} USD**`
      ],
      recommendation: isPositive 
        ? '💡 **Recommendation**: Set stop-loss at 5% below current value to protect gains'
        : '💡 **Recommendation**: DCA (Dollar Cost Average) to lower entry point'
    };
  };

  const insights = getAIInsights();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8 space-y-6 relative overflow-hidden"
    >
      {/* Animated Background Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#8B5CF6]/5 via-transparent to-[#7C3AED]/5 opacity-50"></div>

      {/* Header */}
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center pulse-glow">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-[#F9FAFB]">Portfolio Performance</h3>
              <div className="flex items-center gap-3 mt-1">
                {isPositive ? (
                  <FiTrendingUp className="w-5 h-5 text-[#4ADE80]" />
                ) : (
                  <FiTrendingDown className="w-5 h-5 text-[#F87171]" />
                )}
                <span className={`text-3xl font-bold ${isPositive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                  {isPositive ? '+' : ''}{totalChangePercent}%
                </span>
                <span className="text-sm text-[#9CA3AF]">
                  ${Math.abs(totalChange).toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Time Range Selector */}
          <div className="flex items-center gap-2 bg-[#1E1F26] rounded-xl p-1.5 border border-[#242437]">
            {timeRanges.map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`px-4 py-2.5 rounded-lg text-xs font-bold transition-all ${
                  selectedRange === range
                    ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-lg shadow-[#8B5CF6]/30'
                    : 'text-[#9CA3AF] hover:text-[#E5E7EB] hover:bg-[#16171D]'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        {/* AI Insights Button */}
        <button
          onClick={() => setShowAIInsights(!showAIInsights)}
          className="ai-insight-btn flex items-center gap-2 mb-4"
        >
          <FiZap className="w-4 h-4" />
          <span>AI Insights</span>
          <motion.div
            animate={{ rotate: showAIInsights ? 180 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiInfo className="w-4 h-4" />
          </motion.div>
        </button>

        {/* AI Insights Panel */}
        <AnimatePresence>
          {showAIInsights && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="p-6 rounded-xl bg-gradient-to-br from-[#8B5CF6]/20 to-[#7C3AED]/10 border border-[#8B5CF6]/30 backdrop-blur-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <FiZap className="w-5 h-5 text-[#8B5CF6]" />
                    <h4 className="text-lg font-bold text-[#F9FAFB]">{insights.trend}</h4>
                  </div>
                  
                  <div className="space-y-2">
                    {insights.analysis.map((point, index) => (
                      <p key={index} className="text-sm text-[#E5E7EB] leading-relaxed">
                        {point}
                      </p>
                    ))}
                  </div>

                  <div className="pt-4 border-t border-[#8B5CF6]/20">
                    <p className="text-sm font-semibold text-[#8B5CF6]">{insights.recommendation}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Chart */}
      <div className="relative z-10">
        <ReactECharts
          option={option}
          style={{ height: '450px', width: '100%' }}
          opts={{ renderer: 'svg' }}
          className="rounded-lg"
        />
      </div>
    </motion.div>
  );
}
