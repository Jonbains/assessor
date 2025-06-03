import React, { useState } from 'react';
import styles from './Visualizations.module.css';

export const CompetitivePositionMatrix = ({ 
  score, 
  percentile, 
  marketPosition,
  timeAdvantage,
  revenueAtRisk,
  industry = 'agencies'
}) => {
  const [showDetails, setShowDetails] = useState(false);
  
  // Position on the matrix based on score
  const xPos = (score / 100) * 90 + 5; // 5-95% range
  const yPos = 100 - ((percentile / 100) * 90 + 5); // Invert for top = better
  
  return (
    <div className={styles.matrixContainer}>
      <div className={styles.matrixHeader}>
        <h3>Market Position Analysis</h3>
        <span className={styles.industryTag}>{industry}</span>
      </div>
      
      <div className={styles.matrixGrid}>
        <svg viewBox="0 0 100 100" className={styles.matrixSvg}>
          {/* Grid lines */}
          <defs>
            <pattern id="grid" width="25" height="25" patternUnits="userSpaceOnUse">
              <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#grid)" />
          
          {/* Quadrant labels */}
          <text x="25" y="25" className={styles.quadrantLabel}>At Risk</text>
          <text x="75" y="25" className={styles.quadrantLabel}>Leaders</text>
          <text x="25" y="75" className={styles.quadrantLabel}>Laggards</text>
          <text x="75" y="75" className={styles.quadrantLabel}>Fast Followers</text>
          
          {/* Your position */}
          <circle
            cx={xPos}
            cy={yPos}
            r="5"
            className={styles.positionDot}
            onClick={() => setShowDetails(!showDetails)}
          />
          
          {/* Hover details */}
          {showDetails && (
            <g>
              <rect x={xPos - 30} y={yPos - 40} width="60" height="35" 
                    fill="rgba(20,20,20,0.9)" stroke="#ffff66" strokeWidth="1" rx="4"/>
              <text x={xPos} y={yPos - 25} textAnchor="middle" className={styles.detailText}>
                Top {percentile}%
              </text>
              <text x={xPos} y={yPos - 10} textAnchor="middle" className={styles.detailText}>
                Score: {score}
              </text>
            </g>
          )}
        </svg>
        
        {/* Axis labels */}
        <div className={styles.xAxisLabel}>AI Readiness →</div>
        <div className={styles.yAxisLabel}>Market Performance →</div>
      </div>
      
      <div className={styles.matrixMetrics}>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Position</span>
          <span className={styles.metricValue}>{marketPosition}</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Time Advantage</span>
          <span className={styles.metricValue}>{timeAdvantage}</span>
        </div>
        <div className={styles.metricBox}>
          <span className={styles.metricLabel}>Revenue at Risk</span>
          <span className={`${styles.metricValue} ${styles.risk}`}>
            {typeof revenueAtRisk === 'number' ? `${revenueAtRisk}%` : revenueAtRisk}
          </span>
        </div>
      </div>
    </div>
  );
};
