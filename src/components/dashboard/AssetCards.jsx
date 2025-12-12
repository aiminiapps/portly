'use client';

import { motion } from 'framer-motion';
import MiniSparkline from './MiniSparkline';

export default function AssetCards({ assets }) {
  if (!assets || assets.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <p className="text-[#9CA3AF]">No assets found in your portfolio</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#F9FAFB]">Your Assets</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {assets.map((asset, index) => (
          <motion.div
            key={asset.symbol}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="glass-card p-5 hover:border-[#8B5CF6] transition-all cursor-pointer group"
          >
            {/* Asset Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#8B5CF6] flex items-center justify-center">
                  {asset.logo ? (
                    <img src={asset.logo} alt={asset.symbol} className="w-6 h-6" />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {asset.symbol.charAt(0)}
                    </span>
                  )}
                </div>
                <div>
                  <p className="font-semibold text-[#F9FAFB]">{asset.symbol}</p>
                  <p className="text-xs text-[#9CA3AF]">{asset.name}</p>
                </div>
              </div>
              
              <div className={`px-2 py-1 rounded text-xs font-medium ${
                asset.change24h >= 0 
                  ? 'bg-[#4ADE80]/10 text-[#4ADE80]' 
                  : 'bg-[#F87171]/10 text-[#F87171]'
              }`}>
                {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
              </div>
            </div>

            {/* Mini Sparkline */}
            <div className="h-16 mb-4">
              <MiniSparkline 
                data={asset.priceHistory || []} 
                color={asset.change24h >= 0 ? '#4ADE80' : '#F87171'}
              />
            </div>

            {/* Asset Values */}
            <div className="space-y-2 pt-4 border-t border-[#242437]">
              <div className="flex justify-between">
                <span className="text-xs text-[#9CA3AF]">Balance</span>
                <span className="text-sm font-medium text-[#E5E7EB]">
                  {parseFloat(asset.balance).toFixed(4)} {asset.symbol}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-[#9CA3AF]">Value</span>
                <span className="text-sm font-semibold text-[#F9FAFB]">
                  ${asset.value.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
