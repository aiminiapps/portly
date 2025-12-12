'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { FiTrendingUp, FiTrendingDown, FiDollarSign, FiLayers, FiAward } from 'react-icons/fi';

export default function PortfolioOverview({ data, walletBalance }) {
  const [animatedValue, setAnimatedValue] = useState(0);
  
  const totalValue = data?.totalValue || 0;
  const change24h = data?.change24h || 0;
  const changePercent = data?.changePercent || 0;
  const isPositive = change24h >= 0;

  // Animate total value
  useEffect(() => {
    let start = 0;
    const end = totalValue;
    const duration = 1500;
    const increment = end / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setAnimatedValue(end);
        clearInterval(timer);
      } else {
        setAnimatedValue(start);
      }
    }, 16);

    return () => clearInterval(timer);
  }, [totalValue]);

  const statsCards = [
    {
      label: 'Total Assets',
      value: data?.assets?.length || 0,
      icon: FiLayers,
      color: '#8B5CF6',
      bgColor: 'bg-[#8B5CF6]/10'
    },
    {
      label: 'Best Performer',
      value: data?.bestPerformer?.symbol || 'N/A',
      subValue: data?.bestPerformer?.change ? `+${data.bestPerformer.change.toFixed(2)}%` : '',
      icon: FiAward,
      color: '#4ADE80',
      bgColor: 'bg-[#4ADE80]/10'
    },
    {
      label: 'ETH Balance',
      value: `${walletBalance.toFixed(4)}`,
      subValue: 'ETH',
      icon: FiDollarSign,
      color: '#3B82F6',
      bgColor: 'bg-[#3B82F6]/10'
    },
    {
      label: 'Risk Score',
      value: data?.riskScore?.toFixed(1) || 'N/A',
      subValue: '/ 10',
      icon: FiTrendingUp,
      color: '#F59E0B',
      bgColor: 'bg-[#F59E0B]/10'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Value Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card p-8 relative overflow-hidden"
      >
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7C3AED]/5 via-transparent to-[#8B5CF6]/5"></div>
        
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#9CA3AF] mb-2">Total Portfolio Value</p>
              <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-[#F9FAFB] via-[#A78BFA] to-[#8B5CF6] bg-clip-text text-transparent">
                ${animatedValue.toLocaleString('en-US', { 
                  minimumFractionDigits: 2, 
                  maximumFractionDigits: 2 
                })}
              </h2>
            </div>

            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl ${
                isPositive ? 'bg-[#4ADE80]/10 border border-[#4ADE80]/20' : 'bg-[#F87171]/10 border border-[#F87171]/20'
              }`}
            >
              {isPositive ? (
                <FiTrendingUp className="w-6 h-6 text-[#4ADE80]" />
              ) : (
                <FiTrendingDown className="w-6 h-6 text-[#F87171]" />
              )}
              <div>
                <p className={`text-2xl font-bold ${isPositive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
                  {isPositive ? '+' : ''}{Math.abs(changePercent).toFixed(2)}%
                </p>
                <p className="text-xs text-[#9CA3AF]">24h change</p>
              </div>
            </motion.div>
          </div>

          {/* Change Amount */}
          <div className="flex items-baseline gap-3">
            <span className={`text-xl font-semibold ${isPositive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
              {isPositive ? '+' : ''}{change24h.toFixed(2)} USD
            </span>
            <span className="text-sm text-[#9CA3AF]">Last 24 hours</span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="glass-card p-6 hover:border-[#8B5CF6] transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-xl ${stat.bgColor} group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
            </div>
            
            <div>
              <p className="text-xs text-[#9CA3AF] mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-1">
                <p className="text-2xl font-bold text-[#F9FAFB]">{stat.value}</p>
                {stat.subValue && (
                  <span className="text-sm text-[#9CA3AF]">{stat.subValue}</span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
