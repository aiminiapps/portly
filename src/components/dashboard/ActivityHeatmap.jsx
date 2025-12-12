'use client';

import { motion } from 'framer-motion';
import ReactECharts from 'echarts-for-react';
import { FiCalendar, FiActivity } from 'react-icons/fi';

export default function ActivityHeatmap({ activityData }) {
  // Generate activity data for the last 12 months if not provided
  const generateActivityData = () => {
    if (activityData && activityData.length > 0) {
      return activityData;
    }

    const data = [];
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 12);

    for (let i = 0; i < 365; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      
      // Generate random activity (0-100 transactions)
      const activity = Math.floor(Math.random() * 100);
      
      data.push([
        date.toISOString().split('T')[0],
        activity
      ]);
    }

    return data;
  };

  const data = generateActivityData();

  // Calculate statistics
  const totalActivity = data.reduce((sum, item) => sum + item[1], 0);
  const avgActivity = (totalActivity / data.length).toFixed(1);
  const maxActivity = Math.max(...data.map(item => item[1]));
  const activeDays = data.filter(item => item[1] > 0).length;

  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      position: 'top',
      backgroundColor: 'rgba(30, 31, 38, 0.95)',
      borderColor: '#242437',
      borderWidth: 1,
      textStyle: {
        color: '#E5E7EB',
        fontSize: 12
      },
      formatter: (params) => {
        const date = new Date(params.value[0]);
        const formattedDate = date.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric'
        });
        return `
          <div style="padding: 4px;">
            <div style="color: #9CA3AF; font-size: 11px; margin-bottom: 4px;">
              ${formattedDate}
            </div>
            <div style="font-size: 14px; font-weight: bold; color: #F9FAFB;">
              ${params.value[1]} Transactions
            </div>
          </div>
        `;
      }
    },
    visualMap: {
      min: 0,
      max: maxActivity,
      calculable: true,
      orient: 'horizontal',
      left: 'center',
      bottom: '0%',
      textStyle: {
        color: '#9CA3AF',
        fontSize: 11
      },
      inRange: {
        color: ['#16171D', '#7C3AED', '#8B5CF6', '#A78BFA']
      }
    },
    calendar: {
      top: '80',
      left: '40',
      right: '40',
      cellSize: ['auto', 14],
      range: [
        new Date(new Date().setMonth(new Date().getMonth() - 12)).toISOString().split('T')[0],
        new Date().toISOString().split('T')[0]
      ],
      itemStyle: {
        borderWidth: 2,
        borderColor: '#0F0F14',
        borderRadius: 4
      },
      yearLabel: {
        show: true,
        color: '#E5E7EB',
        fontSize: 14,
        fontWeight: 'bold'
      },
      monthLabel: {
        show: true,
        color: '#9CA3AF',
        fontSize: 11
      },
      dayLabel: {
        show: true,
        color: '#9CA3AF',
        fontSize: 10,
        firstDay: 0,
        nameMap: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: '#242437',
          width: 1,
          type: 'solid'
        }
      }
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowColor: 'rgba(139, 92, 246, 0.5)',
            borderColor: '#8B5CF6',
            borderWidth: 2
          }
        }
      }
    ]
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <FiCalendar className="w-5 h-5 text-[#8B5CF6]" />
          <h3 className="text-lg font-semibold text-[#F9FAFB]">Transaction Activity</h3>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-xs text-[#9CA3AF]">Active Days</p>
            <p className="text-lg font-bold text-[#F9FAFB]">{activeDays}</p>
          </div>
          <div className="w-px h-10 bg-[#242437]"></div>
          <div className="text-right">
            <p className="text-xs text-[#9CA3AF]">Avg/Day</p>
            <p className="text-lg font-bold text-[#8B5CF6]">{avgActivity}</p>
          </div>
          <div className="w-px h-10 bg-[#242437]"></div>
          <div className="text-right">
            <p className="text-xs text-[#9CA3AF]">Total</p>
            <p className="text-lg font-bold text-[#4ADE80]">{totalActivity.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Activity Legend */}
      <div className="flex items-center gap-3 text-xs text-[#9CA3AF]">
        <FiActivity className="w-4 h-4" />
        <span>Less</span>
        <div className="flex gap-1">
          {[0, 1, 2, 3, 4].map((level) => (
            <div
              key={level}
              className="w-4 h-4 rounded"
              style={{
                backgroundColor: ['#16171D', '#7C3AED', '#8B5CF6', '#A78BFA', '#C4B5FD'][level]
              }}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Calendar Heatmap */}
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-[#242437] scrollbar-track-transparent">
        <ReactECharts
          option={option}
          style={{ height: '220px', minWidth: '800px' }}
          opts={{ renderer: 'svg' }}
        />
      </div>

      {/* Activity Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-[#242437]">
        <div className="p-4 rounded-xl bg-[#1E1F26]/50 border border-[#242437]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#8B5CF6]"></div>
            <span className="text-xs text-[#9CA3AF]">Most Active Day</span>
          </div>
          <p className="text-lg font-bold text-[#F9FAFB]">
            {maxActivity} Transactions
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#1E1F26]/50 border border-[#242437]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#4ADE80]"></div>
            <span className="text-xs text-[#9CA3AF]">Consistency</span>
          </div>
          <p className="text-lg font-bold text-[#F9FAFB]">
            {((activeDays / 365) * 100).toFixed(1)}%
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#1E1F26]/50 border border-[#242437]">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-full bg-[#3B82F6]"></div>
            <span className="text-xs text-[#9CA3AF]">Current Streak</span>
          </div>
          <p className="text-lg font-bold text-[#F9FAFB]">
            {calculateCurrentStreak(data)} Days
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// Helper function to calculate current streak
function calculateCurrentStreak(data) {
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  
  // Sort data by date descending
  const sortedData = [...data].sort((a, b) => new Date(b[0]) - new Date(a[0]));
  
  for (const [date, value] of sortedData) {
    if (value > 0) {
      streak++;
    } else if (date < today) {
      break;
    }
  }
  
  return streak;
}
