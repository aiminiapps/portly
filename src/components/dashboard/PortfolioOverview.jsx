'use client';

import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

export default function PortfolioOverview({ data }) {
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 md:p-8 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-[#9CA3AF] mb-1">Total Portfolio Value</p>
          <h2 className="text-4xl md:text-5xl font-bold text-[#F9FAFB]">
            ${animatedValue.toLocaleString('en-US', { 
              minimumFractionDigits: 2, 
              maximumFractionDigits: 2 
            })}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-lg ${
            isPositive ? 'bg-[#4ADE80]/10' : 'bg-[#F87171]/10'
          }`}>
            <div className="flex items-center gap-1">
              <svg 
                className={`w-4 h-4 ${isPositive ? 'text-[#4ADE80] rotate-0' : 'text-[#F87171] rotate-180'}`}
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              <span className={`text-sm font-semibold ${
                isPositive ? 'text-[#4ADE80]' : 'text-[#F87171]'
              }`}>
                {Math.abs(changePercent).toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 24h Change */}
      <div className="flex items-center gap-2">
        <span className={`text-lg font-medium ${
          isPositive ? 'text-[#4ADE80]' : 'text-[#F87171]'
        }`}>
          {isPositive ? '+' : ''}{change24h.toFixed(2)} USD
        </span>
        <span className="text-sm text-[#9CA3AF]">Last 24 hours</span>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#242437]">
        <div>
          <p className="text-xs text-[#9CA3AF] mb-1">Assets</p>
          <p className="text-lg font-semibold text-[#E5E7EB]">
            {data?.assets?.length || 0}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#9CA3AF] mb-1">Best Performer</p>
          <p className="text-lg font-semibold text-[#4ADE80]">
            {data?.bestPerformer?.symbol || 'N/A'}
          </p>
        </div>
        <div>
          <p className="text-xs text-[#9CA3AF] mb-1">Risk Score</p>
          <p className="text-lg font-semibold text-[#8B5CF6]">
            {data?.riskScore?.toFixed(1) || 'N/A'}/10
          </p>
        </div>
      </div>
    </motion.div>
  );
}
