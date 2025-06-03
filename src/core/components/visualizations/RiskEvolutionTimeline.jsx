import React from 'react';
import styles from './Visualizations.module.css';

export const RiskEvolutionTimeline = ({ risks = [] }) => {
  // Sort risks by timeframe
  const sortedRisks = [...risks].sort((a, b) => a.month - b.month);
  
  // Calculate chart dimensions
  const chartWidth = Math.max(600, sortedRisks.length * 120);
  
  return (
    <div className={styles.timelineContainer}>
      <h3>Risk Evolution Timeline</h3>
      
      <svg viewBox={`0 0 ${chartWidth} 200`} className={styles.timelineSvg}>
        {/* Timeline base line */}
        <line
          x1="50"
          y1="100"
          x2={chartWidth - 50}
          y2="100"
          className={styles.timelineLine}
        />
        
        {/* Month markers */}
        {[0, 3, 6, 9, 12, 18, 24].map((month, i) => (
          <g key={i}>
            <line
              x1={50 + (month / 24) * (chartWidth - 100)}
              y1="95"
              x2={50 + (month / 24) * (chartWidth - 100)}
              y2="105"
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
            />
            <text
              x={50 + (month / 24) * (chartWidth - 100)}
              y="120"
              className={styles.timelineLabel}
              textAnchor="middle"
            >
              {month === 0 ? 'Now' : `M${month}`}
            </text>
          </g>
        ))}
        
        {/* Risk points */}
        {sortedRisks.map((risk, i) => {
          const x = 50 + (risk.month / 24) * (chartWidth - 100);
          const y = risk.type === 'opportunity' ? 70 : 130;
          
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r="8"
                className={`${styles.timelinePoint} ${risk.type === 'risk' ? styles.risk : ''}`}
              />
              <line
                x1={x}
                y1="100"
                x2={x}
                y2={y}
                stroke={risk.type === 'risk' ? '#ff6666' : '#66ff66'}
                strokeWidth="2"
                strokeDasharray="3,2"
              />
              <text
                x={x}
                y={risk.type === 'opportunity' ? 50 : 150}
                className={styles.timelineLabel}
                textAnchor="middle"
              >
                {risk.name}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
