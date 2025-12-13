'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import * as echarts from 'echarts';
import ReactMarkdown from 'react-markdown';
import { FiTarget, FiZap, FiCpu } from 'react-icons/fi';

export default function PortfolioHealth({ healthMetrics, assets }) {
  const [metrics, setMetrics] = useState({ diversification: 0, liquidity: 0, performance: 0 });
  const [overallGrade, setOverallGrade] = useState('C');
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // ---------------------------------------------------------
  // 1. ROBUST SCORE CALCULATION ENGINE
  // ---------------------------------------------------------
  useEffect(() => {
    // Helper: Calculate scores from raw assets array
    const calculateFromAssets = (assetList) => {
      if (!assetList || assetList.length === 0) return { diversification: 10, liquidity: 10, performance: 50 };

      // A. Diversification: 1 asset = 20pts, 5+ assets = 100pts
      const divScore = Math.min(100, Math.max(20, assetList.length * 20));

      // B. Liquidity: Check for stablecoins or high-cap tokens
      const stableSymbols = ['USDT', 'USDC', 'DAI', 'FDUSD', 'USDE', 'PYUSD'];
      const highCapSymbols = ['ETH', 'BTC', 'BNB', 'SOL', 'XRP', 'ADA'];
      
      const hasStable = assetList.some(a => stableSymbols.some(s => a.symbol && a.symbol.toUpperCase().includes(s)));
      const hasHighCap = assetList.some(a => highCapSymbols.some(s => a.symbol && a.symbol.toUpperCase().includes(s)));
      
      let liqScore = 30; // Base score
      if (hasStable) liqScore += 50; // Huge boost for stables
      if (hasHighCap) liqScore += 20; // Boost for liquid blue-chips

      // C. Performance: Map 24h change to 0-100 (0% change = 50 score)
      const avgChange = assetList.reduce((sum, a) => sum + (parseFloat(a.change24h) || 0), 0) / assetList.length;
      // Map: -10% change -> 0 score, +10% change -> 100 score
      let perfScore = 50 + (avgChange * 5); 
      perfScore = Math.min(100, Math.max(10, Math.round(perfScore)));

      return { diversification: divScore, liquidity: liqScore, performance: perfScore };
    };

    // LOGIC FLOW:
    // 1. Try Props (If non-zero)
    if (healthMetrics && (healthMetrics.diversification > 0 || healthMetrics.performance > 0)) {
      setMetrics(healthMetrics);
      updateGrade(healthMetrics);
    } 
    // 2. Try Assets Prop
    else if (assets && assets.length > 0) {
      const calculated = calculateFromAssets(assets);
      setMetrics(calculated);
      updateGrade(calculated);
    }
    // 3. Try LocalStorage (Last Resort)
    else {
      // Try to find cached assets if props failed
      try {
        const cachedData = localStorage.getItem('portly_data_cache'); // Or wherever you store full api response
        if (cachedData) {
            const parsed = JSON.parse(cachedData);
            const cachedAssets = parsed.assets || [];
            if (cachedAssets.length > 0) {
                const calculated = calculateFromAssets(cachedAssets);
                setMetrics(calculated);
                updateGrade(calculated);
                return;
            }
        }
      } catch (e) { console.error("Local data parse error", e); }

      // 4. Default "Empty" State (prevents 0/0/0 gauge ugliness)
      const defaults = { diversification: 5, liquidity: 5, performance: 50 };
      setMetrics(defaults);
      updateGrade(defaults);
    }
  }, [healthMetrics, assets]);

  const updateGrade = (scores) => {
    const avg = (scores.diversification + scores.liquidity + scores.performance) / 3;
    if (avg >= 85) setOverallGrade('A+');
    else if (avg >= 75) setOverallGrade('A');
    else if (avg >= 60) setOverallGrade('B');
    else if (avg >= 40) setOverallGrade('C');
    else setOverallGrade('D');
  };

  // ---------------------------------------------------------
  // 2. AI & VISUALS
  // ---------------------------------------------------------
  const analyzeHealth = async () => {
    if (showAnalysis) { setShowAnalysis(false); return; }
    setIsAnalyzing(true);
    
    // Simulate AI delay for UX if real API is skipped/fails
    try {
       const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Analyze portfolio (Grade: ${overallGrade}): Div ${metrics.diversification}, Liq ${metrics.liquidity}, Perf ${metrics.performance}. Give 3 short markdown tips.`
          }]
        })
      });
      if (response.ok) {
        const data = await response.json();
        setAiAnalysis(data.reply);
        setShowAnalysis(true);
      } else {
         throw new Error("API Failed");
      }
    } catch (e) {
      // Fallback response if API fails/saves credits
      setAiAnalysis(`**Optimization Tips:**\n\n* **Diversify:** Add more assets to boost stability.\n* **Liquidity:** Consider holding 20% in stablecoins.\n* **Growth:** Rebalance into higher performing sectors.`);
      setShowAnalysis(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getGaugeOption = (value, colorStart, colorEnd) => ({
    series: [{
      type: 'gauge',
      startAngle: 90,
      endAngle: -270,
      min: 0,
      max: 100,
      radius: '90%',
      pointer: { show: false },
      progress: {
        show: true,
        overlap: false,
        roundCap: true,
        clip: false,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
            { offset: 0, color: colorStart },
            { offset: 1, color: colorEnd }
          ]),
        //   shadowColor: colorStart,
        //   shadowBlur: 15
        }
      },
      axisLine: { lineStyle: { width: 8, color: [[1, 'rgba(255,255,255,0.05)']] } },
      splitLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      detail: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
        offsetCenter: ['0%', '0%'],
        formatter: '{value}'
      },
      data: [{ value: Math.round(value) }]
    }]
  });

  const healthItems = [
    { title: 'Diversification', value: metrics.diversification, colorStart: '#C084FC', colorEnd: '#A855F7' },
    { title: 'Liquidity', value: metrics.liquidity, colorStart: '#34D399', colorEnd: '#10B981' },
    { title: 'Performance', value: metrics.performance, colorStart: '#60A5FA', colorEnd: '#3B82F6' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative flex flex-col h-fit max-h-[585px] scroll-hidden overflow-y-scroll rounded-3xl border border-white/5 bg-[#121214]/80 backdrop-blur-2xl p-6 overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-[#8B5CF6]/10 blur-[80px] rounded-full pointer-events-none"></div>

      <div className="flex items-start justify-between mb-8 z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FiTarget className="w-4 h-4 text-[#8B5CF6]" />
            <h3 className="text-xs font-bold text-white/60 uppercase tracking-widest">Health Score</h3>
          </div>
          <h2 className="text-lg font-medium text-white">Portfolio Status</h2>
        </div>
        <div className="flex flex-col items-end">
          <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-white/50">{overallGrade}</div>
          <span className="text-[10px] text-white/40 uppercase tracking-wider">Overall Grade</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8 relative z-10">
        {healthItems.map((item, index) => (
          <div key={index} className="flex flex-col items-center gap-3">
            <div className="w-20 h-20 relative">
               <ReactECharts
                  option={getGaugeOption(item.value, item.colorStart, item.colorEnd)}
                  style={{ height: '100%', width: '100%' }}
                  opts={{ renderer: 'svg' }}
                />
            </div>
            <span className="text-[10px] font-medium text-white/50 tracking-wide">{item.title}</span>
          </div>
        ))}
      </div>

      <div className="mt-auto relative z-10">
        <button
          onClick={analyzeHealth}
          disabled={isAnalyzing}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl border transition-all duration-300 ${
            showAnalysis 
              ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[0_0_25px_rgba(139,92,246,0.3)]'
              : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isAnalyzing ? <FiCpu className="w-4 h-4 animate-spin" /> : <FiZap className={`w-4 h-4 ${showAnalysis ? 'fill-white' : ''}`} />}
          <span className="text-xs font-bold uppercase tracking-wide">
            {isAnalyzing ? 'Running Diagnosis...' : showAnalysis ? 'Close Report' : 'AI Diagnosis'}
          </span>
        </button>

        <AnimatePresence>
          {showAnalysis && aiAnalysis && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 16 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="p-5 rounded-xl bg-[#1E1E24] border border-white/5 shadow-2xl">
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      ul: ({node, ...props}) => <ul className="space-y-3 m-0 p-0 list-none" {...props} />,
                      li: ({node, ...props}) => (
                        <li className="flex gap-3 text-xs text-white/80 leading-relaxed">
                          <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#8B5CF6] flex-shrink-0 shadow-[0_0_10px_#8B5CF6]" />
                          <span>{props.children}</span>
                        </li>
                      ),
                      strong: ({node, ...props}) => <strong className="text-[#8B5CF6] font-semibold" {...props} />,
                      p: ({node, ...props}) => <span {...props} />
                    }}
                  >
                    {aiAnalysis}
                  </ReactMarkdown>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}