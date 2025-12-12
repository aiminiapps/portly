'use client';

import { LinePath } from '@visx/shape';
import { scaleLinear } from '@visx/scale';
import { curveMonotoneX } from '@visx/curve';

export default function MiniSparkline({ data, color = '#8B5CF6' }) {
  if (!data || data.length === 0) {
    return <div className="w-full h-full flex items-center justify-center text-[#9CA3AF] text-xs">No data</div>;
  }

  const width = 200;
  const height = 60;
  const margin = { top: 5, right: 5, bottom: 5, left: 5 };

  const xScale = scaleLinear({
    domain: [0, data.length - 1],
    range: [margin.left, width - margin.right]
  });

  const yScale = scaleLinear({
    domain: [Math.min(...data), Math.max(...data)],
    range: [height - margin.bottom, margin.top]
  });

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`}>
      <defs>
        <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area under line */}
      <path
        d={`
          M ${xScale(0)},${yScale(data[0])}
          ${data.map((d, i) => `L ${xScale(i)},${yScale(d)}`).join(' ')}
          L ${xScale(data.length - 1)},${height - margin.bottom}
          L ${xScale(0)},${height - margin.bottom}
          Z
        `}
        fill={`url(#gradient-${color})`}
      />

      {/* Line */}
      <LinePath
        data={data}
        x={(d, i) => xScale(i)}
        y={(d) => yScale(d)}
        stroke={color}
        strokeWidth={2}
        curve={curveMonotoneX}
      />
    </svg>
  );
}
