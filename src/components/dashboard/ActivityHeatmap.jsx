'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import ReactMarkdown from 'react-markdown';
import { FiCalendar, FiActivity, FiZap, FiCpu, FiClock, FiTarget } from 'react-icons/fi';

export default function ActivityHeatmap({ activityData }) {
  const [data, setData] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // 1. Data Logic: Props -> LocalStorage -> Mock
  useEffect(() => {
    if (activityData && activityData.length > 0) {
      setData(activityData);
    } else {
      // Try LocalStorage
      const cached = localStorage.getItem('portly_data_cache');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (parsed.activityData && parsed.activityData.length > 0) {
            setData(parsed.activityData);
            return;
          }
        } catch (e) { console.error(e); }
      }

      // Fallback: Generate visually pleasing mock data for demo
      const mockData = [];
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 12);
      for (let i = 0; i < 365; i++) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        // Weighted random for realistic "clusters" of activity
        const base = Math.random();
        const activity = base > 0.7 ? Math.floor(Math.random() * 50) : 0;
        mockData.push([
          date.toISOString().split('T')[0],
          activity
        ]);
      }
      setData(mockData);
    }
  }, [activityData]);

  // 2. Statistics Calculation
  const stats = useMemo(() => {
    if (!data.length) return { total: 0, avg: 0, max: 0, active: 0, streak: 0 };
    
    const total = data.reduce((sum, item) => sum + item[1], 0);
    const activeDays = data.filter(item => item[1] > 0).length;
    
    return {
      total,
      avg: (total / data.length).toFixed(1),
      max: Math.max(...data.map(item => item[1])),
      active: activeDays,
      consistency: ((activeDays / 365) * 100).toFixed(1),
      streak: calculateCurrentStreak(data)
    };
  }, [data]);

  // 3. AI Handler
  const analyzeHabits = async () => {
    if (showAnalysis) { setShowAnalysis(false); return; }
    setIsAnalyzing(true);
    
    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{
            role: "user",
            content: `Analyze my transaction activity:
            - Active Days: ${stats.active}/365
            - Consistency: ${stats.consistency}%
            - Current Streak: ${stats.streak} days
            - Total Tx: ${stats.total}
            
            Give 3 short, markdown bullet points on my trading habits.`
          }]
        })
      });

      if (response.ok) {
        const resData = await response.json();
        setAiAnalysis(resData.reply);
        setShowAnalysis(true);
      } else {
        throw new Error("API Error");
      }
    } catch (e) {
      setAiAnalysis(`**Habit Analysis:**\n* **Consistency:** ${stats.consistency > 20 ? 'High engagement levels.' : 'Sporadic activity detected.'}\n* **Momentum:** Current streak indicates ${stats.streak > 3 ? 'strong' : 'building'} momentum.\n* **Volume:** Averaging ${stats.avg} tx/day suggests ${stats.avg > 1 ? 'active trading' : 'holding strategy'}.`);
      setShowAnalysis(true);
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 4. ECharts Option
  const option = useMemo(() => ({
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(18, 18, 20, 0.9)',
      borderColor: 'rgba(255, 255, 255, 0.1)',
      borderWidth: 1,
      padding: [10, 15],
      textStyle: { color: '#E5E7EB', fontSize: 12 },
      formatter: (params) => {
        const date = new Date(params.value[0]).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        return `<div class="font-medium text-white">${params.value[1]} Transactions</div><div class="text-[10px] text-gray-400 mt-1">${date}</div>`;
      }
    },
    visualMap: {
      min: 0,
      max: stats.max || 10,
      calculable: false,
      orient: 'horizontal',
      left: 'center',
      bottom: 0,
      itemWidth: 12,
      itemHeight: 12,
      textStyle: { color: '#6B7280', fontSize: 10 },
      inRange: { color: ['#1E1E24', '#4C1D95', '#7C3AED', '#A78BFA'] } // Dark to Purple Gradient
    },
    calendar: {
      top: 60,
      left: 30,
      right: 30,
      cellSize: ['auto', 13],
      range: [
        new Date(new Date().setMonth(new Date().getMonth() - 11)).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      ],
      itemStyle: {
        borderWidth: 2,
        borderColor: 'rgba(0,0,0,0)', // Transparent borders for gap effect
        color: '#1E1E24'
      },
      yearLabel: { show: false },
      monthLabel: {
        nameMap: 'en',
        color: '#6B7280',
        fontSize: 10
      },
      dayLabel: {
        firstDay: 1,
        nameMap: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
        color: '#4B5563',
        fontSize: 9
      },
      splitLine: { show: false }
    },
    series: [{
      type: 'heatmap',
      coordinateSystem: 'calendar',
      data: data,
      itemStyle: { borderRadius: 3 }
    }]
  }), [data, stats]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-white/5 bg-[#121214]/60 backdrop-blur-xl p-6 relative overflow-hidden"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-white/5 border border-white/5 text-[#8B5CF6]">
            <FiCalendar className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white">On-Chain Activity</h3>
            <p className="text-[10px] text-white/40">Transaction frequency heatmap</p>
          </div>
        </div>

        {/* Quick Stats Row */}
        <div className="flex items-center gap-6 px-4 py-2 rounded-xl bg-white/5 border border-white/5">
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase">Streak</p>
            <div className="flex items-center justify-end gap-1 text-[#8B5CF6]">
              <FiZap className="w-3 h-3" />
              <span className="text-sm font-bold">{stats.streak}d</span>
            </div>
          </div>
          <div className="w-px h-6 bg-white/10"></div>
          <div className="text-right">
            <p className="text-[10px] text-white/40 uppercase">Active</p>
            <span className="text-sm font-bold text-white">{stats.active} Days</span>
          </div>
        </div>
      </div>

      {/* Heatmap Chart */}
      <div className="relative min-h-[200px] w-full overflow-x-auto scrollbar-none">
        <div className="min-w-[800px]">
          <ReactECharts
            option={option}
            style={{ height: '200px', width: '100%' }}
            opts={{ renderer: 'svg' }}
          />
        </div>
      </div>

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-4">
        {[
          { label: 'Most Active', value: `${stats.max} Tx`, icon: FiActivity },
          { label: 'Consistency', value: `${stats.consistency}%`, icon: FiTarget },
          { label: 'Total Volume', value: stats.total.toLocaleString(), icon: FiClock }
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
            <div className="p-2 rounded-lg bg-[#1E1E24] text-white/40">
              <stat.icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] text-white/40 uppercase tracking-wider">{stat.label}</p>
              <p className="text-sm font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* AI Analysis Footer */}
      <div className="mt-4 pt-4 border-t border-white/5">
        <button
          onClick={analyzeHabits}
          disabled={isAnalyzing}
          className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border transition-all duration-300 ${
            showAnalysis 
              ? 'bg-[#8B5CF6] border-[#8B5CF6] text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]'
              : 'bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white'
          }`}
        >
          {isAnalyzing ? <FiCpu className="w-4 h-4 animate-spin" /> : <FiZap className={`w-4 h-4 ${showAnalysis ? 'fill-white' : ''}`} />}
          <span className="text-xs font-medium uppercase tracking-wide">
            {isAnalyzing ? 'Analyzing Pattern...' : showAnalysis ? 'Close Insights' : 'AI Habit Analysis'}
          </span>
        </button>

        <AnimatePresence>
          {showAnalysis && aiAnalysis && (
            <motion.div
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 12 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden"
            >
              <div className="p-4 rounded-xl bg-[#1E1E24] border border-white/5">
                <div className="prose prose-invert prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      ul: ({node, ...props}) => <ul className="space-y-2 m-0 p-0 list-none" {...props} />,
                      li: ({node, ...props}) => (
                        <li className="flex gap-2 text-xs text-white/80 leading-relaxed">
                          <span className="mt-1.5 w-1 h-1 rounded-full bg-[#8B5CF6] flex-shrink-0" />
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

// Helper: Calculate Streak based on dates
function calculateCurrentStreak(data) {
  if (!data || data.length === 0) return 0;
  
  // Sort by date descending
  const sorted = [...data].sort((a, b) => new Date(b[0]) - new Date(a[0]));
  const today = new Date().toISOString().split('T')[0];
  
  let streak = 0;
  let hasStarted = false;

  // Check if activity started today or yesterday (allow 1 day gap for active streak)
  for (const [date, count] of sorted) {
    if (!hasStarted) {
      if (date === today && count > 0) hasStarted = true;
      else if (date < today && count > 0) hasStarted = true; // Started yesterday?
      else if (new Date(today) - new Date(date) > 86400000 * 2) return 0; // Gap > 2 days
    }

    if (hasStarted) {
      if (count > 0) streak++;
      else break;
    }
  }
  return streak;
}