'use client';

import { motion } from 'motion/react';
import ReactECharts from 'echarts-for-react';
import { FiPieChart } from 'react-icons/fi';

export default function AssetAllocationNested({ assetAllocation }) {
  if (!assetAllocation || assetAllocation.length === 0) {
    return null;
  }

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(30, 31, 38, 0.95)',
      borderColor: '#242437',
      textStyle: {
        color: '#E5E7EB'
      },
      formatter: '{b}: {c}% ({d}%)'
    },
    legend: {
      show: false
    },
    series: [
      {
        name: 'Allocation',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '50%'],
        roseType: 'area',
        itemStyle: {
          borderRadius: 8,
          borderColor: '#0F0F14',
          borderWidth: 3
        },
        label: {
          show: true,
          position: 'outside',
          color: '#E5E7EB',
          fontSize: 12,
          fontWeight: 'bold',
          formatter: '{b}\n{d}%'
        },
        labelLine: {
          show: true,
          lineStyle: {
            color: '#242437'
          }
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowColor: 'rgba(139, 92, 246, 0.5)'
          }
        },
        data: assetAllocation.map(item => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: item.color
          }
        }))
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 space-y-4"
    >
      <div className="flex items-center gap-2">
        <FiPieChart className="w-5 h-5 text-[#8B5CF6]" />
        <h3 className="text-lg font-semibold text-[#F9FAFB]">Asset Allocation</h3>
      </div>

      <ReactECharts
        option={option}
        style={{ height: '350px' }}
        opts={{ renderer: 'svg' }}
      />
    </motion.div>
  );
}
