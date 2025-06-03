import React, { useState } from 'react';
import styles from './Visualizations.module.css';

export const CapabilitySpiderChart = ({ 
  dimensions,
  showBenchmark = true,
  benchmarkData = null 
}) => {
  const [hoveredDimension, setHoveredDimension] = useState(null);
  
  // Calculate points for spider chart
  const angleStep = (Math.PI * 2) / dimensions.length;
  const center = { x: 150, y: 150 };
  const radius = 120;
  
  const getPoint = (value, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle)
    };
  };
  
  // Create polygon points
  const dimensionPoints = dimensions.map((dim, i) => 
    getPoint(dim.value, i)
  ).map(p => `${p.x},${p.y}`).join(' ');
  
  // If showing benchmark, create a second polygon
  let benchmarkPoints = '';
  if (showBenchmark && benchmarkData) {
    benchmarkPoints = dimensions.map((dim, i) => {
      const benchmark = benchmarkData[dim.name] || benchmarkData[i] || 50;
      return getPoint(benchmark, i);
    }).map(p => `${p.x},${p.y}`).join(' ');
  }
  
  return (
    <div className={styles.spiderContainer}>
      <h3>Capability Assessment</h3>
      
      <svg viewBox="0 0 300 300" className={styles.spiderSvg}>
        {/* Background circles */}
        {[1, 2, 3, 4].map(level => (
          <circle 
            key={level} 
            cx={center.x} 
            cy={center.y} 
            r={radius * level / 4} 
            className={styles.spiderCircle} 
          />
        ))}
        
        {/* Axes for each dimension */}
        {dimensions.map((dimension, i) => {
          const angle = i * angleStep - Math.PI / 2;
          const endPoint = {
            x: center.x + radius * Math.cos(angle),
            y: center.y + radius * Math.sin(angle)
          };
          
          return (
            <g key={i}>
              <line 
                x1={center.x} 
                y1={center.y} 
                x2={endPoint.x} 
                y2={endPoint.y} 
                className={styles.spiderAxis} 
              />
              <text 
                x={center.x + (radius + 15) * Math.cos(angle)}
                y={center.y + (radius + 15) * Math.sin(angle)}
                className={styles.spiderLabel}
                textAnchor="middle"
                dominantBaseline="middle"
                onMouseEnter={() => setHoveredDimension(dimension)}
                onMouseLeave={() => setHoveredDimension(null)}
              >
                {dimension.name}
              </text>
            </g>
          );
        })}
        
        {/* Value labels on the first axis */}
        {[25, 50, 75, 100].map((value, i) => (
          <text
            key={i}
            x={center.x}
            y={center.y - (radius * value / 100)}
            className={styles.spiderLabel}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
          >
            {value}
          </text>
        ))}
        
        {/* Benchmark polygon if available */}
        {showBenchmark && benchmarkData && (
          <polygon 
            points={benchmarkPoints} 
            className={styles.spiderBenchmark}
          />
        )}
        
        {/* Current capabilities polygon */}
        <polygon 
          points={dimensionPoints} 
          className={styles.spiderPolygon}
        />
        
        {/* Points for each dimension */}
        {dimensions.map((dimension, i) => {
          const point = getPoint(dimension.value, i);
          
          return (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="#66ff66"
              onMouseEnter={() => setHoveredDimension(dimension)}
              onMouseLeave={() => setHoveredDimension(null)}
            />
          );
        })}
        
        {/* Tooltip for hovered dimension */}
        {hoveredDimension && (
          <g>
            <rect
              x={center.x - 60}
              y={center.y - 40}
              width="120"
              height="50"
              fill="rgba(0,0,0,0.8)"
              rx="4"
            />
            <text
              x={center.x}
              y={center.y - 25}
              fill="white"
              textAnchor="middle"
              fontSize="12"
            >
              {hoveredDimension.name}
            </text>
            <text
              x={center.x}
              y={center.y - 5}
              fill="#66ff66"
              textAnchor="middle"
              fontSize="14"
              fontWeight="bold"
            >
              Score: {hoveredDimension.value}
            </text>
          </g>
        )}
      </svg>
      
      <div className={styles.spiderLegend}>
        <div className={styles.legendItem}>
          <div className={styles.legendColor} style={{ backgroundColor: '#66ff66' }}></div>
          <span>Your Capabilities</span>
        </div>
        {showBenchmark && benchmarkData && (
          <div className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: '#6666ff' }}></div>
            <span>Industry Benchmark</span>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper method for other components
CapabilitySpiderChart.getPoint = getPoint;
