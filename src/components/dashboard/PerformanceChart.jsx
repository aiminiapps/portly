'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import ReactECharts from 'echarts-for-react';
import { FiTrendingUp, FiTrendingDown, FiZap, FiCalendar, FiActivity } from 'react-icons/fi';

export default function PerformanceChart({ historicalData }) {
  const [selectedRange, setSelectedRange] = useState('7D');
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [localData, setLocalData] = useState([]);
  const [hoveredPrice, setHoveredPrice] = useState(null);
  const [hoveredDate, setHoveredDate] = useState(null);

  // 1. Get Data from Props OR Local Hold (LocalStorage)
  useEffect(() => {
    if (historicalData && historicalData.length > 0) {
      setLocalData(historicalData);
    } else {
      const stored = localStorage.getItem('portly_historical_data');
      if (stored) {
        try {
          setLocalData(JSON.parse(stored));
        } catch (e) {
          console.error("Failed to parse local history", e);
        }
      }
    }
  }, [historicalData]);

  // 2. Filter Logic
  const filteredData = useMemo(() => {
    if (!localData.length) return [];
    
    const now = new Date();
    const cutoff = new Date();
    
    switch (selectedRange) {
      case '24H': cutoff.setHours(now.getHours() - 24); break;
      case '7D': cutoff.setDate(now.getDate() - 7); break;
      case '30D': cutoff.setDate(now.getDate() - 30); break;
      case '90D': cutoff.setDate(now.getDate() - 90); break;
      case '1Y': cutoff.setFullYear(now.getFullYear() - 1); break;
      default: cutoff.setDate(now.getDate() - 7);
    }
    
    return localData.filter(d => new Date(d.date) >= cutoff);
  }, [localData, selectedRange]);

  // 3. Stats Calculation
  const currentPrice = filteredData.length > 0 ? filteredData[filteredData.length - 1].value : 0;
  const startPrice = filteredData.length > 0 ? filteredData[0].value : 0;
  const priceChange = currentPrice - startPrice;
  const percentChange = startPrice > 0 ? (priceChange / startPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  // Display Values (Interactive)
  const displayPrice = hoveredPrice !== null ? hoveredPrice : currentPrice;
  const displayDate = hoveredDate !== null ? hoveredDate : 'Current Value';

  // 4. Chart Configuration (Premium Style)
  const getOption = useCallback(() => ({
    backgroundColor: 'transparent',
    grid: { left: 0, right: 0, top: 20, bottom: 0, containLabel: false },
    tooltip: {
      trigger: 'axis',
      showContent: false, // We handle display manually for a cleaner look
      axisPointer: {
        type: 'line',
        lineStyle: {
          color: '#8B5CF6',
          width: 1,
          type: 'dashed'
        }
      }
    },
    xAxis: {
      type: 'category',
      data: filteredData.map(d => d.date),
      show: false,
      boundaryGap: false
    },
    yAxis: {
      type: 'value',
      show: false,
      min: 'dataMin', // Focus the chart on the movement
      max: 'dataMax'
    },
    series: [{
      data: filteredData.map(d => d.value),
      type: 'line',
      smooth: 0.3,
      showSymbol: false,
      symbolSize: 8,
      showAllSymbol: true,
      itemStyle: {
        color: '#8B5CF6',
        borderColor: '#fff',
        borderWidth: 2
      },
      lineStyle: {
        width: 3,
        color: '#8B5CF6',
        shadowColor: 'rgba(139, 92, 246, 0.5)',
        shadowBlur: 15
      },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(139, 92, 246, 0.4)' },
            { offset: 1, color: 'rgba(139, 92, 246, 0)' }
          ]
        }
      }
    }]
  }), [filteredData]);

  // Chart Event Handlers
  const onChartHover = (params) => {
    if (params.componentType === 'series' || params.length > 0) {
      const dataPoint = params[0] || params; // Handle different echarts event structures
      if (dataPoint) {
        setHoveredPrice(dataPoint.value);
        const dateObj = new Date(dataPoint.axisValue);
        setHoveredDate(dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit' }));
      }
    }
  };

  const onChartLeave = () => {
    setHoveredPrice(null);
    setHoveredDate(null);
  };

  if (!localData.length) {
    return (
      <div className="rounded-3xl border border-white/5 bg-[#121214]/60 p-8 text-center backdrop-blur-xl">
        <div className="w-12 h-12 mx-auto bg-white/5 rounded-full flex items-center justify-center mb-3">
          <FiActivity className="text-white/20" />
        </div>
        <p className="text-white/40 text-sm">No historical data found</p>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl border border-white/5 bg-[#121214]/60 backdrop-blur-xl p-6 md:p-8 overflow-hidden group">
      {/* Background Gradient Blob */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#8B5CF6]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#8B5CF6]/20 transition-colors duration-700"></div>

      {/* HEADER SECTION */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-start justify-between gap-6 mb-8">
        
        {/* Price & Change Display */}
        <div className="space-y-1">
          <motion.p 
            key={displayDate}
            initial={{ opacity: 0.5 }} animate={{ opacity: 1 }}
            className="text-xs font-medium text-white/40 uppercase tracking-wider flex items-center gap-2"
          >
            <FiCalendar className="w-3 h-3" />
            {displayDate}
          </motion.p>
          
          <div className="flex items-baseline gap-4">
            <h2 className="text-4xl md:text-5xl font-medium text-white tracking-tight">
              ${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </h2>
          </div>

          <div className={`flex items-center gap-2 mt-2 ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            <div className={`px-2 py-0.5 rounded text-xs font-bold bg-white/5 border border-white/5 flex items-center gap-1`}>
              {isPositive ? <FiTrendingUp /> : <FiTrendingDown />}
              <span>{Math.abs(percentChange).toFixed(2)}%</span>
            </div>
            <span className="text-sm text-white/40">
              {isPositive ? '+' : ''}${Math.abs(priceChange).toFixed(2)} ({selectedRange})
            </span>
          </div>
        </div>

        {/* Controls: Range & AI */}
        <div className="flex flex-col items-end gap-3">
          {/* Range Selector Pills */}
          <div className="flex p-1 rounded-xl bg-white/5 border border-white/5">
            {['24H', '7D', '30D', '1Y'].map((range) => (
              <button
                key={range}
                onClick={() => setSelectedRange(range)}
                className={`relative px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                  selectedRange === range ? 'text-white' : 'text-white/40 hover:text-white/70'
                }`}
              >
                {selectedRange === range && (
                  <motion.div
                    layoutId="activeRange"
                    className="absolute inset-0 bg-[#8B5CF6] rounded-lg shadow-lg shadow-[#8B5CF6]/20"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10">{range}</span>
              </button>
            ))}
          </div>

          {/* AI Toggle Button */}
          <button
            onClick={() => setShowAIInsights(!showAIInsights)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300 ${
              showAIInsights 
                ? 'bg-[#8B5CF6]/20 border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            <FiZap className={`w-4 h-4 ${showAIInsights ? 'fill-current' : ''}`} />
            <span className="text-xs font-medium">AI Analysis</span>
          </button>
        </div>
      </div>

      {/* CHART SECTION */}
      <div className="relative h-[300px] w-full -ml-2">
        <ReactECharts
          option={getOption()}
          style={{ height: '100%', width: '100%' }}
          onEvents={{
            updateAxisPointer: (evt) => {
               // ECharts axis pointer update event
               if(evt.dataIndex !== undefined) {
                  const val = filteredData[evt.dataIndex];
                  if(val) {
                    setHoveredPrice(val.value);
                    setHoveredDate(new Date(val.date).toLocaleDateString());
                  }
               }
            },
            mouseout: onChartLeave
          }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* AI INSIGHTS DRAWER */}
      <AnimatePresence>
        {showAIInsights && (
          <motion.div
            initial={{ height: 0, opacity: 0, marginTop: 0 }}
            animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
            exit={{ height: 0, opacity: 0, marginTop: 0 }}
            className="overflow-hidden border-t border-white/10"
          >
            <div className="pt-4 flex gap-4">
              <div className="w-1 h-auto bg-gradient-to-b from-[#8B5CF6] to-transparent rounded-full opacity-50"></div>
              <div className="flex-1 space-y-2">
                <h4 className="text-sm font-medium text-[#8B5CF6]">Portfolio Intelligence</h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-xs text-white/40 mb-1">Trend Analysis</p>
                    <p className="text-sm text-white/80">
                      Strong {isPositive ? 'accumulation' : 'correction'} phase detected. 
                      Volatility is {Math.abs(percentChange) > 5 ? 'high' : 'stable'} compared to market avg.
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-white/5 border border-white/5">
                    <p className="text-xs text-white/40 mb-1">Recommendation</p>
                    <p className="text-sm text-white/80">
                      {isPositive 
                        ? 'Consider trailing stop-loss at 5% to secure recent gains.' 
                        : 'Current support levels suggest a potential DCA opportunity.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}