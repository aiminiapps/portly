'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

export default function PerformanceChart({ historicalData }) {
  const [selectedRange, setSelectedRange] = useState('7D');

  const timeRanges = ['24H', '7D', '30D', '90D', '1Y', 'ALL'];

  // Filter data based on selected range
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
      bottom: '10%',
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(30, 31, 38, 0.95)',
      borderColor: '#242437',
      borderWidth: 1,
      textStyle: {
        color: '#E5E7EB',
        fontSize: 12
      },
      formatter: (params) => {
        const param = params[0];
        return `
          <div style="padding: 4px;">
            <div style="color: #9CA3AF; font-size: 11px; margin-bottom: 4px;">
              ${param.axisValue}
            </div>
            <div style="font-size: 14px; font-weight: bold; color: #F9FAFB;">
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
          color: '#242437'
        }
      },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        formatter: (value) => {
          const date = new Date(value);
          return `${date.getMonth() + 1}/${date.getDate()}`;
        }
      },
      axisTick: {
        show: false
      }
    },
    yAxis: {
      type: 'value',
      axisLine: {
        show: false
      },
      axisLabel: {
        color: '#9CA3AF',
        fontSize: 11,
        formatter: (value) => `$${(value / 1000).toFixed(0)}k`
      },
      splitLine: {
        lineStyle: {
          color: '#242437',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        data: values,
        type: 'line',
        smooth: true,
        symbol: 'none',
        lineStyle: {
          width: 3,
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              { offset: 0, color: isPositive ? '#4ADE80' : '#F87171' },
              { offset: 1, color: isPositive ? '#16A34A' : '#DC2626' }
            ]
          },
          shadowColor: isPositive ? 'rgba(74, 222, 128, 0.5)' : 'rgba(248, 113, 113, 0.5)',
          shadowBlur: 10,
          shadowOffsetY: 5
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: isPositive ? 'rgba(74, 222, 128, 0.4)' : 'rgba(248, 113, 113, 0.4)' },
              { offset: 1, color: 'rgba(0, 0, 0, 0)' }
            ]
          }
        }
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <div>
            <h3 className="text-lg font-semibold text-[#F9FAFB]">Portfolio Performance</h3>
            <div className="flex items-center gap-2 mt-1">
              {isPositive ? (
                <FiTrendingUp className="w-5 h-5 text-[#4ADE80]" />
              ) : (
                <FiTrendingDown className="w-5 h-5 text-[#F87171]" />
              )}
              <span className={`text-2xl font-bold ${isPositive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                {isPositive ? '+' : ''}{totalChangePercent}%
              </span>
              <span className="text-sm text-[#9CA3AF]">
                ${Math.abs(totalChange).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-[#1E1F26] rounded-xl p-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                selectedRange === range
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white shadow-lg'
                  : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <ReactECharts
        option={option}
        style={{ height: '400px', width: '100%' }}
        opts={{ renderer: 'svg' }}
      />
    </motion.div>
  );
}
