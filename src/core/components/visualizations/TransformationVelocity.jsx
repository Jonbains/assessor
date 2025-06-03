import React from 'react';
import styles from './Visualizations.module.css';

export const TransformationVelocity = ({
  yourSpeed = 20,
  marketSpeed = 80,
  gapChange = 3,
  timeToIrrelevance = 18
}) => {
  // Calculate angles for speedometer (in radians)
  const minAngle = -Math.PI * 0.75; // -135 degrees
  const maxAngle = Math.PI * 0.75; // 135 degrees
  const yourAngle = minAngle + (yourSpeed / 100) * (maxAngle - minAngle);
  const marketAngle = minAngle + (marketSpeed / 100) * (maxAngle - minAngle);
  
  // Calculate needle points
  const center = { x: 150, y: 150 };
  const radius = 100;
  
  const getPointOnArc = (angle) => ({
    x: center.x + Math.cos(angle) * radius,
    y: center.y + Math.sin(angle) * radius
  });
  
  const yourPoint = getPointOnArc(yourAngle);
  const marketPoint = getPointOnArc(marketAngle);
  
  return (
    <div className={styles.velocityContainer}>
      <h3>Transformation Velocity</h3>
      
      <div className={styles.velocityChart}>
        <svg viewBox="0 0 300 200" preserveAspectRatio="xMidYMid meet">
          {/* Speedometer arc */}
          <path
            d={`
              M ${getPointOnArc(minAngle).x},${getPointOnArc(minAngle).y}
              A ${radius},${radius} 0 1,1 ${getPointOnArc(maxAngle).x},${getPointOnArc(maxAngle).y}
            `}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="4"
          />
          
          {/* Speed markers */}
          {[0, 25, 50, 75, 100].map((speed, i) => {
            const angle = minAngle + (speed / 100) * (maxAngle - minAngle);
            const point = getPointOnArc(angle);
            const textPoint = {
              x: center.x + Math.cos(angle) * (radius + 15),
              y: center.y + Math.sin(angle) * (radius + 15)
            };
            
            return (
              <g key={i}>
                <line
                  x1={center.x + Math.cos(angle) * (radius - 10)}
                  y1={center.y + Math.sin(angle) * (radius - 10)}
                  x2={point.x}
                  y2={point.y}
                  stroke="rgba(255,255,255,0.5)"
                  strokeWidth="2"
                />
                <text
                  x={textPoint.x}
                  y={textPoint.y}
                  className={styles.velocityLabel}
                  textAnchor="middle"
                  dominantBaseline="middle"
                >
                  {speed}
                </text>
              </g>
            );
          })}
          
          {/* Your speed needle */}
          <path
            d={`
              M ${center.x - 5},${center.y}
              L ${center.x + 5},${center.y}
              L ${yourPoint.x},${yourPoint.y}
              Z
            `}
            className={styles.speedometerNeedle}
            transform={`rotate(${yourAngle * (180 / Math.PI) + 90}, ${center.x}, ${center.y})`}
          />
          
          {/* Market speed marker */}
          <circle
            cx={marketPoint.x}
            cy={marketPoint.y}
            r="6"
            fill="#ff6666"
          />
        </svg>
      </div>
      
      <div className={styles.velocityMetrics}>
        <div className={styles.velocityMetric}>
          <div className={styles.velocityValue}>{yourSpeed}</div>
          <div className={styles.velocityName}>Your Speed</div>
        </div>
        
        <div className={styles.velocityMetric}>
          <div className={styles.velocityValue}>{marketSpeed}</div>
          <div className={styles.velocityName}>Market Speed</div>
        </div>
        
        <div className={styles.velocityMetric}>
          <div className={styles.velocityValue}>{gapChange > 0 ? '+' : ''}{gapChange}%</div>
          <div className={styles.velocityName}>Gap Change</div>
        </div>
        
        <div className={styles.velocityMetric}>
          <div className={styles.velocityValue}>{timeToIrrelevance}mo</div>
          <div className={styles.velocityName}>Time to Irrelevance</div>
        </div>
      </div>
    </div>
  );
};
