import React from 'react';
import styles from './Visualizations.module.css';

export const ValuationWaterfall = ({ 
  currentMultiple = 2.5,
  steps = [],
  potentialMultiple = 4.5,
  currency = '£'
}) => {
  // Calculate chart dimensions
  const chartWidth = 100 + (steps.length + 1) * 80;
  const chartHeight = 300;
  const maxBarHeight = 220;
  
  // Calculate bar heights based on multiples
  const maxMultiple = Math.max(currentMultiple, potentialMultiple, 
    ...steps.map(s => currentMultiple + s.value));
  
  const getBarHeight = (value) => (value / maxMultiple) * maxBarHeight;
  
  // Starting bar height
  const startHeight = getBarHeight(currentMultiple);
  
  // Generate waterfall steps
  let runningMultiple = currentMultiple;
  const barData = [
    { 
      label: 'Current',
      value: currentMultiple,
      height: startHeight,
      type: 'end',
      y: chartHeight - startHeight - 40,
      color: '#6666ff'
    }
  ];
  
  // Add each step
  steps.forEach((step, i) => {
    const prevMultiple = runningMultiple;
    runningMultiple += step.value;
    
    barData.push({
      label: step.label,
      value: step.value,
      height: Math.abs(getBarHeight(step.value)),
      type: step.value >= 0 ? 'positive' : 'negative',
      y: step.value >= 0 
        ? chartHeight - getBarHeight(prevMultiple) - getBarHeight(step.value) - 40
        : chartHeight - getBarHeight(prevMultiple) - 40,
      color: step.value >= 0 ? '#66ff66' : '#ff6666'
    });
  });
  
  // Final bar
  barData.push({
    label: 'Potential',
    value: potentialMultiple,
    height: getBarHeight(potentialMultiple),
    type: 'end',
    y: chartHeight - getBarHeight(potentialMultiple) - 40,
    color: '#ffff66'
  });
  
  return (
    <div className={styles.waterfallContainer}>
      <h3>Valuation Multiple Potential</h3>
      
      <div className={styles.waterfallChart}>
        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} preserveAspectRatio="xMidYMid meet">
          {/* Connect lines */}
          <path
            d={`
              M 50,${chartHeight - startHeight - 40}
              ${steps.map((step, i) => {
                const x1 = 90 + i * 80;
                const x2 = 150 + i * 80;
                const y = chartHeight - getBarHeight(runningMultiple - step.value) - 40;
                return `H ${x1} V ${y} H ${x2}`;
              }).join(' ')}
              H ${chartWidth - 50}
            `}
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="1"
            strokeDasharray="4,2"
            fill="none"
          />
          
          {/* Bars */}
          {barData.map((bar, i) => (
            <g key={i}>
              <rect
                x={10 + i * 80}
                y={bar.y}
                width="80"
                height={bar.height}
                fill={bar.color}
                rx="4"
              />
              
              <text
                x={50 + i * 80}
                y={chartHeight - 20}
                className={styles.valuationLabel}
                textAnchor="middle"
              >
                {bar.label}
              </text>
              
              <text
                x={50 + i * 80}
                y={bar.y + (bar.type === 'end' ? bar.height / 2 : bar.height / 2)}
                className={styles.valueText}
                textAnchor="middle"
                dominantBaseline="middle"
              >
                {bar.type === 'end' 
                  ? bar.value.toFixed(1) + 'x'
                  : (bar.value > 0 ? '+' : '') + bar.value.toFixed(1) + 'x'}
              </text>
            </g>
          ))}
        </svg>
      </div>
      
      <div className={styles.waterfallSummary}>
        <div>
          <strong>Current Valuation:</strong> {currency}{(currentMultiple * 1000000).toLocaleString()}
        </div>
        <div>
          <strong>Potential Growth:</strong> {((potentialMultiple / currentMultiple - 1) * 100).toFixed(0)}%
        </div>
        <div>
          <strong>Target Valuation:</strong> {currency}{(potentialMultiple * 1000000).toLocaleString()}
        </div>
      </div>
    </div>
  );
};
