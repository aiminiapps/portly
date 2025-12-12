'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LinePath, AreaClosed, Bar } from '@visx/shape';
import { scaleTime, scaleLinear } from '@visx/scale';
import { GridRows } from '@visx/grid';
import { AxisBottom, AxisLeft } from '@visx/axis';
import { curveMonotoneX } from '@visx/curve';
import { LinearGradient } from '@visx/gradient';
import { localPoint } from '@visx/event';
import { useTooltip, TooltipWithBounds, defaultStyles } from '@visx/tooltip';
import { bisector } from 'd3-array';

const tooltipStyles = {
  ...defaultStyles,
  backgroundColor: '#1E1F26',
  border: '1px solid #242437',
  color: '#E5E7EB',
  borderRadius: '8px',
  padding: '8px 12px',
  fontSize: '12px',
};

export default function PerformanceChart({ historicalData, timeRange = '7D' }) {
  const [selectedRange, setSelectedRange] = useState(timeRange);
  const [hoveredData, setHoveredData] = useState(null);

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipTop = 0,
    tooltipLeft = 0,
  } = useTooltip();

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

  // Chart dimensions
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 60 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  // Accessors
  const getDate = (d) => new Date(d.date);
  const getValue = (d) => d.value;
  const bisectDate = bisector((d) => new Date(d.date)).left;

  // Scales
  const xScale = scaleTime({
    domain: [Math.min(...data.map(getDate)), Math.max(...data.map(getDate))],
    range: [0, innerWidth],
  });

  const yScale = scaleLinear({
    domain: [
      Math.min(...data.map(getValue)) * 0.95,
      Math.max(...data.map(getValue)) * 1.05,
    ],
    range: [innerHeight, 0],
    nice: true,
  });

  // Calculate overall change
  const firstValue = data[0]?.value || 0;
  const lastValue = data[data.length - 1]?.value || 0;
  const totalChange = lastValue - firstValue;
  const totalChangePercent = ((totalChange / firstValue) * 100).toFixed(2);
  const isPositive = totalChange >= 0;

  const handleTooltip = (event) => {
    const { x } = localPoint(event) || { x: 0 };
    const x0 = xScale.invert(x - margin.left);
    const index = bisectDate(data, x0, 1);
    const d0 = data[index - 1];
    const d1 = data[index];
    let d = d0;
    
    if (d1 && getDate(d1)) {
      d = x0.valueOf() - getDate(d0).valueOf() > getDate(d1).valueOf() - x0.valueOf() ? d1 : d0;
    }
    
    showTooltip({
      tooltipData: d,
      tooltipLeft: x,
      tooltipTop: yScale(getValue(d)) + margin.top,
    });
    setHoveredData(d);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 space-y-4"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-[#F9FAFB] mb-1">
            Portfolio Performance
          </h3>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${isPositive ? 'text-[#4ADE80]' : 'text-[#F87171]'}`}>
              {isPositive ? '+' : ''}{totalChangePercent}%
            </span>
            <span className="text-sm text-[#9CA3AF]">
              ${Math.abs(totalChange).toFixed(2)}
            </span>
          </div>
        </div>

        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-[#1E1F26] rounded-lg p-1">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setSelectedRange(range)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                selectedRange === range
                  ? 'bg-gradient-to-r from-[#7C3AED] to-[#8B5CF6] text-white'
                  : 'text-[#9CA3AF] hover:text-[#E5E7EB]'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`}>
          <defs>
            <LinearGradient
              id="area-gradient"
              from={isPositive ? '#4ADE80' : '#F87171'}
              to={isPositive ? '#4ADE80' : '#F87171'}
              fromOpacity={0.4}
              toOpacity={0}
            />
            <LinearGradient
              id="line-gradient"
              from={isPositive ? '#4ADE80' : '#F87171'}
              to={isPositive ? '#16A34A' : '#DC2626'}
            />
            
            {/* Glow effect */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          <g transform={`translate(${margin.left},${margin.top})`}>
            {/* Grid */}
            <GridRows
              scale={yScale}
              width={innerWidth}
              stroke="#242437"
              strokeOpacity={0.3}
              strokeDasharray="2,2"
            />

            {/* Area */}
            <AreaClosed
              data={data}
              x={(d) => xScale(getDate(d))}
              y={(d) => yScale(getValue(d))}
              yScale={yScale}
              fill="url(#area-gradient)"
              curve={curveMonotoneX}
            />

            {/* Line */}
            <LinePath
              data={data}
              x={(d) => xScale(getDate(d))}
              y={(d) => yScale(getValue(d))}
              stroke="url(#line-gradient)"
              strokeWidth={3}
              curve={curveMonotoneX}
              filter="url(#glow)"
            />

            {/* Axes */}
            <AxisBottom
              top={innerHeight}
              scale={xScale}
              stroke="#242437"
              tickStroke="#242437"
              tickLabelProps={() => ({
                fill: '#9CA3AF',
                fontSize: 11,
                textAnchor: 'middle',
              })}
            />

            <AxisLeft
              scale={yScale}
              stroke="#242437"
              tickStroke="#242437"
              tickFormat={(value) => `$${value.toLocaleString()}`}
              tickLabelProps={() => ({
                fill: '#9CA3AF',
                fontSize: 11,
                textAnchor: 'end',
                dx: -4,
              })}
            />

            {/* Tooltip trigger bar */}
            <Bar
              x={0}
              y={0}
              width={innerWidth}
              height={innerHeight}
              fill="transparent"
              onMouseMove={handleTooltip}
              onMouseLeave={() => {
                hideTooltip();
                setHoveredData(null);
              }}
            />

            {/* Hover line and dot */}
            {hoveredData && (
              <g>
                <line
                  x1={xScale(getDate(hoveredData))}
                  x2={xScale(getDate(hoveredData))}
                  y1={0}
                  y2={innerHeight}
                  stroke="#8B5CF6"
                  strokeWidth={1}
                  strokeDasharray="4,4"
                  opacity={0.5}
                />
                <circle
                  cx={xScale(getDate(hoveredData))}
                  cy={yScale(getValue(hoveredData))}
                  r={6}
                  fill={isPositive ? '#4ADE80' : '#F87171'}
                  stroke="#0F0F14"
                  strokeWidth={2}
                />
              </g>
            )}
          </g>
        </svg>

        {/* Tooltip */}
        {tooltipData && (
          <TooltipWithBounds
            key={Math.random()}
            top={tooltipTop}
            left={tooltipLeft}
            style={tooltipStyles}
          >
            <div className="space-y-1">
              <div className="text-xs text-[#9CA3AF]">
                {new Date(tooltipData.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
              <div className="text-sm font-semibold text-[#F9FAFB]">
                ${getValue(tooltipData).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </div>
            </div>
          </TooltipWithBounds>
        )}
      </div>
    </motion.div>
  );
}
