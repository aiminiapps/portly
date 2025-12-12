'use client';

import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { FiActivity, FiTrendingUp, FiShield } from 'react-icons/fi';

export default function PortfolioHealth({ healthMetrics }) {
  const diversificationScore = healthMetrics?.diversification || 0;
  const liquidityScore = healthMetrics?.liquidity || 0;
  const performanceScore = healthMetrics?.performance || 0;

  const getGaugeOption = (value, title, color) => ({
    series: [
      {
        type: 'gauge',
        startAngle: 200,
        endAngle: -20,
        min: 0,
        max: 100,
        splitNumber: 10,
        itemStyle: {
          color: color,
          shadowColor: color,
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0
        },
        progress: {
          show: true,
          roundCap: true,
          width: 12
        },
        pointer: {
          show: false
        },
        axisLine: {
          roundCap: true,
          lineStyle: {
            width: 12,
            color: [[1, 'rgba(139, 92, 246, 0.1)']]
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false
        },
        axisLabel: {
          show: false
        },
        title: {
          show: false
        },
        detail: {
          width: '100%',
          fontSize: 28,
          fontWeight: 'bold',
          fontFamily: 'inherit',
          color: '#F9FAFB',
          formatter: '{value}',
          offsetCenter: [0, '0%']
        },
        data: [
          {
            value: value,
            name: title
          }
        ]
      }
    ]
  });

  const healthItems = [
    {
      title: 'Diversification',
      value: diversificationScore,
      icon: FiActivity,
      color: '#8B5CF6',
      description: 'Asset spread quality'
    },
    {
      title: 'Liquidity',
      value: liquidityScore,
      icon: FiTrendingUp,
      color: '#4ADE80',
      description: 'Cash flow health'
    },
    {
      title: 'Performance',
      value: performanceScore,
      icon: FiShield,
      color: '#3B82F6',
      description: 'ROI efficiency'
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="glass-card p-6 space-y-6"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[#F9FAFB]">Portfolio Health</h3>
        <div className="px-3 py-1.5 rounded-lg bg-[#8B5CF6]/10">
          <span className="text-xs font-medium text-[#8B5CF6]">Real-Time</span>
        </div>
      </div>

      <div className="space-y-6">
        {healthItems.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <item.icon className="w-5 h-5" style={{ color: item.color }} />
                <div>
                  <p className="text-sm font-semibold text-[#F9FAFB]">{item.title}</p>
                  <p className="text-xs text-[#9CA3AF]">{item.description}</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-[#F9FAFB]">{item.value}</span>
            </div>

            <ReactECharts
              option={getGaugeOption(item.value, item.title, item.color)}
              style={{ height: '150px' }}
              opts={{ renderer: 'svg' }}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
