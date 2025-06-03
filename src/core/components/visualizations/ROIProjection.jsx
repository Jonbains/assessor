import React from 'react';
import styles from './Visualizations.module.css';

export const ROIProjection = ({
  investment,
  returns = [], // Array of {month, value, label}
  breakEvenMonth,
  currency = '£'
}) => {
  const maxValue = Math.max(investment, ...returns.map(r => r.value)) * 1.2;
  const chartWidth = returns.length * 60 + 100;
  
  return (
    <div className={styles.roiContainer}>
      <h3>ROI Projection</h3>
      
      <div className={styles.roiChart}>
        <svg viewBox={`0 0 ${chartWidth} 300`} preserveAspectRatio="xMidYMid meet">
          {/* Investment line */}
          <line
            x1="50"
            y1={250 - (investment / maxValue) * 200}
            x2={chartWidth - 50}
            y2={250 - (investment / maxValue) * 200}
            stroke="#ff6666"
            strokeWidth="2"
            strokeDasharray="4,2"
          />
          
          {/* ROI curve */}
          <path
            d={`M 50,250 ${returns.map((r, i) => 
              `L ${50 + (i + 1) * 60},${250 - (r.value / maxValue) * 200}`
            ).join(' ')}`}
            fill="none"
            stroke="#66ff66"
            strokeWidth="3"
          />
          
          {/* Break-even point */}
          {breakEvenMonth && (
            <circle
              cx={50 + breakEvenMonth * 60}
              cy={250 - (investment / maxValue) * 200}
              r="6"
              fill="#ffff66"
              stroke="#ffff66"
              strokeWidth="2"
            />
          )}
          
          {/* Month markers */}
          {returns.map((r, i) => (
            <g key={i}>
              <circle
                cx={50 + (i + 1) * 60}
                cy={250 - (r.value / maxValue) * 200}
                r="4"
                fill="#66ff66"
              />
              <text
                x={50 + (i + 1) * 60}
                y={270}
                textAnchor="middle"
                className={styles.monthLabel}
              >
                M{i + 1}
              </text>
            </g>
          ))}
          
          {/* Y-axis labels */}
          <text x="30" y={250 - (investment / maxValue) * 200} className={styles.valueLabel}>
            {currency}{Math.round(investment / 1000)}k
          </text>
        </svg>
      </div>
      
      <div className={styles.roiSummary}>
        <div className={styles.roiMetric}>
          <span>Investment:</span>
          <strong>{currency}{investment.toLocaleString()}</strong>
        </div>
        <div className={styles.roiMetric}>
          <span>Break-even:</span>
          <strong>Month {breakEvenMonth}</strong>
        </div>
        <div className={styles.roiMetric}>
          <span>12-Month ROI:</span>
          <strong>{Math.round((returns[11]?.value / investment - 1) * 100)}%</strong>
        </div>
      </div>
    </div>
  );
};
