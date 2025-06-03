// ============================================
// 1. CompetitivePositionMatrix.jsx
// ============================================
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

// ============================================
// 2. ServiceVulnerabilityRadar.jsx
// ============================================
export const ServiceVulnerabilityRadar = ({ services, showReadiness = true }) => {
  const [hoveredService, setHoveredService] = useState(null);
  
  // Calculate points for radar chart
  const angleStep = (Math.PI * 2) / services.length;
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
  
  // Create vulnerability polygon
  const vulnerabilityPoints = services
    .map((service, i) => {
      const point = getPoint(service.vulnerability || 50, i);
      return `${point.x},${point.y}`;
    })
    .join(' ');
    
  // Create readiness polygon
  const readinessPoints = services
    .map((service, i) => {
      const point = getPoint(service.score || 30, i);
      return `${point.x},${point.y}`;
    })
    .join(' ');
  
  return (
    <div className={styles.radarContainer}>
      <h3>Service Vulnerability Analysis</h3>
      
      <svg viewBox="0 0 300 300" className={styles.radarSvg}>
        {/* Background circles */}
        {[20, 40, 60, 80, 100].map(value => (
          <circle
            key={value}
            cx={center.x}
            cy={center.y}
            r={(value / 100) * radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Axis lines */}
        {services.map((_, i) => {
          const endPoint = getPoint(100, i);
          return (
            <line
              key={i}
              x1={center.x}
              y1={center.y}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Vulnerability area */}
        <polygon
          points={vulnerabilityPoints}
          fill="rgba(255, 68, 68, 0.3)"
          stroke="rgba(255, 68, 68, 0.8)"
          strokeWidth="2"
        />
        
        {/* Readiness area */}
        {showReadiness && (
          <polygon
            points={readinessPoints}
            fill="rgba(102, 255, 102, 0.3)"
            stroke="rgba(102, 255, 102, 0.8)"
            strokeWidth="2"
          />
        )}
        
        {/* Service labels */}
        {services.map((service, i) => {
          const labelPoint = getPoint(130, i);
          return (
            <g key={i}>
              <text
                x={labelPoint.x}
                y={labelPoint.y}
                textAnchor="middle"
                className={styles.serviceLabel}
                onMouseEnter={() => setHoveredService(i)}
                onMouseLeave={() => setHoveredService(null)}
              >
                {service.name.split(' ')[0]}
              </text>
              
              {hoveredService === i && (
                <g>
                  <rect
                    x={labelPoint.x - 60}
                    y={labelPoint.y + 10}
                    width="120"
                    height="50"
                    fill="rgba(20,20,20,0.95)"
                    stroke="#ffff66"
                    strokeWidth="1"
                    rx="4"
                  />
                  <text x={labelPoint.x} y={labelPoint.y + 30} textAnchor="middle" className={styles.tooltipText}>
                    Vulnerability: {service.vulnerability}%
                  </text>
                  <text x={labelPoint.x} y={labelPoint.y + 45} textAnchor="middle" className={styles.tooltipText}>
                    Readiness: {service.score}%
                  </text>
                </g>
              )}
            </g>
          );
        })}
      </svg>
      
      <div className={styles.radarLegend}>
        <div className={styles.legendItem}>
          <span className={styles.legendDot} style={{background: 'rgba(255, 68, 68, 0.8)'}}></span>
          <span>AI Disruption Risk</span>
        </div>
        {showReadiness && (
          <div className={styles.legendItem}>
            <span className={styles.legendDot} style={{background: 'rgba(102, 255, 102, 0.8)'}}></span>
            <span>Your Readiness</span>
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// 3. ValuationWaterfall.jsx
// ============================================
export const ValuationWaterfall = ({ 
  currentMultiple = 2.5,
  steps = [],
  potentialMultiple = 4.5,
  currency = '£'
}) => {
  const [activeStep, setActiveStep] = useState(null);
  
  // Calculate cumulative values
  let cumulative = currentMultiple;
  const processedSteps = steps.map(step => {
    const start = cumulative;
    cumulative += step.impact;
    return { ...step, start, end: cumulative };
  });
  
  const maxValue = Math.max(potentialMultiple, cumulative) * 1.2;
  const barWidth = 80;
  const spacing = 20;
  const chartWidth = (steps.length + 2) * (barWidth + spacing);
  
  return (
    <div className={styles.waterfallContainer}>
      <h3>Valuation Enhancement Path</h3>
      
      <div className={styles.waterfallChart}>
        <svg viewBox={`0 0 ${chartWidth} 400`} preserveAspectRatio="xMidYMid meet">
          {/* Current bar */}
          <g transform={`translate(${spacing}, 0)`}>
            <rect
              x="0"
              y={400 - (currentMultiple / maxValue) * 350}
              width={barWidth}
              height={(currentMultiple / maxValue) * 350}
              fill="#ffff66"
              className={styles.waterfallBar}
            />
            <text
              x={barWidth / 2}
              y={400 - (currentMultiple / maxValue) * 350 - 10}
              textAnchor="middle"
              className={styles.barValue}
            >
              {currentMultiple}x
            </text>
            <text
              x={barWidth / 2}
              y={395}
              textAnchor="middle"
              className={styles.barLabel}
            >
              Current
            </text>
          </g>
          
          {/* Step bars */}
          {processedSteps.map((step, i) => {
            const x = (i + 1) * (barWidth + spacing) + spacing;
            const barHeight = Math.abs(step.impact / maxValue) * 350;
            const y = step.impact > 0 
              ? 400 - (step.end / maxValue) * 350
              : 400 - (step.start / maxValue) * 350;
              
            return (
              <g key={i} transform={`translate(${x}, 0)`}>
                {/* Connector line */}
                <line
                  x1={-spacing}
                  y1={400 - (step.start / maxValue) * 350}
                  x2={0}
                  y2={400 - (step.start / maxValue) * 350}
                  stroke="rgba(255,255,255,0.3)"
                  strokeWidth="2"
                  strokeDasharray="4,2"
                />
                
                {/* Bar */}
                <rect
                  x="0"
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={step.impact > 0 ? '#66ff66' : '#ff6666'}
                  className={styles.waterfallBar}
                  onMouseEnter={() => setActiveStep(i)}
                  onMouseLeave={() => setActiveStep(null)}
                />
                
                {/* Value */}
                <text
                  x={barWidth / 2}
                  y={y - 10}
                  textAnchor="middle"
                  className={styles.barValue}
                >
                  {step.impact > 0 ? '+' : ''}{step.impact}x
                </text>
                
                {/* Label */}
                <text
                  x={barWidth / 2}
                  y={395}
                  textAnchor="middle"
                  className={styles.barLabel}
                >
                  {step.label}
                </text>
                
                {/* Tooltip */}
                {activeStep === i && (
                  <g>
                    <rect
                      x={-40}
                      y={y - 80}
                      width={160}
                      height={60}
                      fill="rgba(20,20,20,0.95)"
                      stroke="#ffff66"
                      rx="4"
                    />
                    <text x={barWidth / 2} y={y - 60} textAnchor="middle" className={styles.tooltipText}>
                      {step.action}
                    </text>
                    <text x={barWidth / 2} y={y - 40} textAnchor="middle" className={styles.tooltipText}>
                      Impact: {step.impact > 0 ? '+' : ''}{step.impact}x
                    </text>
                  </g>
                )}
              </g>
            );
          })}
          
          {/* Potential bar */}
          <g transform={`translate(${(steps.length + 1) * (barWidth + spacing) + spacing}, 0)`}>
            <rect
              x="0"
              y={400 - (potentialMultiple / maxValue) * 350}
              width={barWidth}
              height={(potentialMultiple / maxValue) * 350}
              fill="#66ffff"
              className={styles.waterfallBar}
            />
            <text
              x={barWidth / 2}
              y={400 - (potentialMultiple / maxValue) * 350 - 10}
              textAnchor="middle"
              className={styles.barValue}
            >
              {potentialMultiple}x
            </text>
            <text
              x={barWidth / 2}
              y={395}
              textAnchor="middle"
              className={styles.barLabel}
            >
              Potential
            </text>
          </g>
        </svg>
      </div>
      
      <div className={styles.waterfallSummary}>
        <div className={styles.summaryItem}>
          <span>Total Uplift Potential:</span>
          <strong>+{(potentialMultiple - currentMultiple).toFixed(1)}x</strong>
        </div>
        <div className={styles.summaryItem}>
          <span>Value Creation:</span>
          <strong>{Math.round((potentialMultiple / currentMultiple - 1) * 100)}%</strong>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 4. EfficiencyCalculator.jsx
// ============================================
export const EfficiencyCalculator = ({
  hoursSaved,
  costSavings,
  headcountEquivalent,
  revenueOpportunity,
  breakdown = []
}) => {
  const [selectedMetric, setSelectedMetric] = useState('hours');
  
  const metrics = {
    hours: {
      value: hoursSaved,
      label: 'Hours Saved Weekly',
      detail: `${headcountEquivalent} FTE equivalent`,
      icon: '⏱️'
    },
    cost: {
      value: costSavings,
      label: 'Annual Cost Savings',
      detail: 'Direct labor cost reduction',
      icon: '💰'
    },
    revenue: {
      value: revenueOpportunity,
      label: 'Revenue Opportunity',
      detail: 'From capacity creation',
      icon: '📈'
    }
  };
  
  return (
    <div className={styles.calculatorContainer}>
      <h3>Efficiency Impact Analysis</h3>
      
      <div className={styles.metricSelector}>
        {Object.entries(metrics).map(([key, metric]) => (
          <button
            key={key}
            className={`${styles.metricButton} ${selectedMetric === key ? styles.active : ''}`}
            onClick={() => setSelectedMetric(key)}
          >
            <span className={styles.metricIcon}>{metric.icon}</span>
            <span className={styles.metricLabel}>{metric.label}</span>
          </button>
        ))}
      </div>
      
      <div className={styles.metricDisplay}>
        <div className={styles.bigNumber}>
          {metrics[selectedMetric].value}
        </div>
        <div className={styles.metricDetail}>
          {metrics[selectedMetric].detail}
        </div>
      </div>
      
      {breakdown.length > 0 && (
        <div className={styles.breakdownSection}>
          <h4>Breakdown by Service</h4>
          <div className={styles.breakdownBars}>
            {breakdown.map((item, i) => (
              <div key={i} className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>{item.service}</div>
                <div className={styles.breakdownBar}>
                  <div 
                    className={styles.breakdownFill}
                    style={{width: `${(item.value / hoursSaved) * 100}%`}}
                  >
                    <span className={styles.breakdownValue}>{item.value}h</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className={styles.calculatorCta}>
        <p>What could you do with {headcountEquivalent} extra people?</p>
        <button className={styles.ctaButton}>Calculate Your ROI</button>
      </div>
    </div>
  );
};

// ============================================
// 5. PriorityMatrix.jsx
// ============================================
export const PriorityMatrix = ({ items, onItemClick }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Group items by quadrant
  const quadrants = {
    quickWins: items.filter(i => i.impact >= 7 && i.effort <= 3),
    strategic: items.filter(i => i.impact >= 7 && i.effort > 3),
    fillIns: items.filter(i => i.impact < 7 && i.effort <= 3),
    questionable: items.filter(i => i.impact < 7 && i.effort > 3)
  };
  
  const getPosition = (item) => ({
    x: (item.effort / 10) * 90 + 5,
    y: 100 - ((item.impact / 10) * 90 + 5)
  });
  
  return (
    <div className={styles.matrixContainer}>
      <h3>Transformation Priorities</h3>
      
      <div className={styles.priorityMatrix}>
        <svg viewBox="0 0 100 100" className={styles.matrixSvg}>
          {/* Quadrant backgrounds */}
          <rect x="0" y="0" width="50" height="50" fill="rgba(102,255,102,0.1)" />
          <rect x="50" y="0" width="50" height="50" fill="rgba(255,255,102,0.1)" />
          <rect x="0" y="50" width="50" height="50" fill="rgba(102,102,255,0.1)" />
          <rect x="50" y="50" width="50" height="50" fill="rgba(255,102,102,0.1)" />
          
          {/* Grid lines */}
          <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
          
          {/* Quadrant labels */}
          <text x="25" y="25" textAnchor="middle" className={styles.quadrantLabel}>Quick Wins</text>
          <text x="75" y="25" textAnchor="middle" className={styles.quadrantLabel}>Strategic</text>
          <text x="25" y="75" textAnchor="middle" className={styles.quadrantLabel}>Fill-ins</text>
          <text x="75" y="75" textAnchor="middle" className={styles.quadrantLabel}>Consider Later</text>
          
          {/* Plot items */}
          {items.map((item, i) => {
            const pos = getPosition(item);
            return (
              <g key={i}>
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r="4"
                  fill={item.category === 'financial' ? '#ffff66' : 
                        item.category === 'operational' ? '#66ff66' : 
                        '#6666ff'}
                  className={styles.priorityDot}
                  onMouseEnter={() => setHoveredItem(i)}
                  onMouseLeave={() => setHoveredItem(null)}
                  onClick={() => onItemClick && onItemClick(item)}
                />
                
                {hoveredItem === i && (
                  <g>
                    <rect
                      x={pos.x - 60}
                      y={pos.y - 50}
                      width="120"
                      height="40"
                      fill="rgba(20,20,20,0.95)"
                      stroke="#ffff66"
                      rx="4"
                    />
                    <text x={pos.x} y={pos.y - 35} textAnchor="middle" className={styles.tooltipText}>
                      {item.title}
                    </text>
                    <text x={pos.x} y={pos.y - 20} textAnchor="middle" className={styles.tooltipText}>
                      Impact: {item.impact}/10
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
        
        {/* Axis labels */}
        <div className={styles.xAxisLabel}>Effort →</div>
        <div className={styles.yAxisLabel}>← Impact</div>
      </div>
      
      {/* Quick wins list */}
      <div className={styles.quickWinsList}>
        <h4>🎯 Start with these Quick Wins:</h4>
        {quadrants.quickWins.slice(0, 3).map((item, i) => (
          <div key={i} className={styles.quickWinItem} onClick={() => onItemClick && onItemClick(item)}>
            <span className={styles.quickWinNumber}>{i + 1}</span>
            <span className={styles.quickWinTitle}>{item.title}</span>
            <span className={styles.quickWinTime}>{item.timeframe || '1 week'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 6. TransformationVelocity.jsx
// ============================================
export const TransformationVelocity = ({
  yourSpeed = 20,
  marketSpeed = 80,
  gapChange = 3,
  timeToIrrelevance = 18
}) => {
  const [showProjection, setShowProjection] = useState(false);
  
  const speedRatio = yourSpeed / marketSpeed;
  const status = speedRatio > 0.8 ? 'keeping-pace' : 
                 speedRatio > 0.5 ? 'falling-behind' : 
                 'critical-gap';
  
  return (
    <div className={styles.velocityContainer}>
      <h3>Transformation Velocity</h3>
      
      <div className={styles.velocityMeters}>
        <div className={styles.velocityMeter}>
          <div className={styles.meterLabel}>Market Speed</div>
          <div className={styles.meterBar}>
            <div 
              className={styles.meterFill} 
              style={{width: `${marketSpeed}%`, background: '#ff6666'}}
            >
              <span className={styles.meterValue}>{marketSpeed} mph</span>
            </div>
          </div>
        </div>
        
        <div className={styles.velocityMeter}>
          <div className={styles.meterLabel}>Your Speed</div>
          <div className={styles.meterBar}>
            <div 
              className={`${styles.meterFill} ${styles[status]}`} 
              style={{width: `${yourSpeed}%`}}
            >
              <span className={styles.meterValue}>{yourSpeed} mph</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.velocityGap}>
        <div className={styles.gapMetric}>
          <span className={styles.gapLabel}>Gap widening by:</span>
          <span className={styles.gapValue}>{gapChange}% monthly</span>
        </div>
        <div className={styles.gapMetric}>
          <span className={styles.gapLabel}>Time to irrelevance:</span>
          <span className={styles.gapValue}>{timeToIrrelevance} months</span>
        </div>
      </div>
      
      <button 
        className={styles.projectionButton}
        onClick={() => setShowProjection(!showProjection)}
      >
        {showProjection ? 'Hide' : 'Show'} 12-Month Projection
      </button>
      
      {showProjection && (
        <div className={styles.projectionChart}>
          {/* Simple line chart showing divergence */}
          <svg viewBox="0 0 300 150" className={styles.projectionSvg}>
            <line x1="0" y1="75" x2="300" y2="20" stroke="#ff6666" strokeWidth="2" />
            <line x1="0" y1="75" x2="300" y2="130" stroke="#66ff66" strokeWidth="2" />
            <text x="250" y="15" className={styles.projectionLabel}>Market</text>
            <text x="250" y="145" className={styles.projectionLabel}>You</text>
          </svg>
        </div>
      )}
    </div>
  );
};

// ============================================
// 7. RiskEvolutionTimeline.jsx
// ============================================
export const RiskEvolutionTimeline = ({ risks = [] }) => {
  const timeframes = ['Today', '6 months', '12 months', '18 months'];
  
  return (
    <div className={styles.timelineContainer}>
      <h3>Risk Evolution Without Action</h3>
      
      <div className={styles.timeline}>
        {timeframes.map((timeframe, i) => (
          <div key={i} className={styles.timelineStep}>
            <div className={styles.timelineMarker}>
              <div className={`${styles.timelineDot} ${styles[`risk${i}`]}`}></div>
              <div className={styles.timelineLabel}>{timeframe}</div>
            </div>
            
            <div className={styles.timelineContent}>
              {risks.filter(r => r.timeframe === i).map((risk, j) => (
                <div key={j} className={`${styles.riskCard} ${styles[risk.severity]}`}>
                  <div className={styles.riskTitle}>{risk.title}</div>
                  <div className={styles.riskImpact}>{risk.impact}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.timelineSummary}>
        <div className={styles.summaryItem}>
          <span className={styles.riskIndicator} style={{background: '#ff6666'}}></span>
          <span>Critical risks: {risks.filter(r => r.severity === 'critical').length}</span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.riskIndicator} style={{background: '#ffaa66'}}></span>
          <span>High risks: {risks.filter(r => r.severity === 'high').length}</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// 8. CapabilitySpiderChart.jsx
// ============================================
export const CapabilitySpiderChart = ({ 
  dimensions,
  showBenchmark = true,
  benchmarkData = null 
}) => {
  const center = { x: 200, y: 200 };
  const radius = 150;
  const angleStep = (Math.PI * 2) / dimensions.length;
  
  const getPoint = (value, index) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (value / 100) * radius;
    return {
      x: center.x + r * Math.cos(angle),
      y: center.y + r * Math.sin(angle)
    };
  };
  
  // Your scores polygon
  const yourPoints = dimensions
    .map((dim, i) => {
      const point = getPoint(dim.score, i);
      return `${point.x},${point.y}`;
    })
    .join(' ');
    
  // Benchmark polygon
  const benchmarkPoints = dimensions
    .map((dim, i) => {
      const value = benchmarkData ? benchmarkData[i] : 60;
      const point = getPoint(value, i);
      return `${point.x},${point.y}`;
    })
    .join(' ');
  
  return (
    <div className={styles.spiderContainer}>
      <h3>Capability Assessment</h3>
      
      <svg viewBox="0 0 400 400" className={styles.spiderSvg}>
        {/* Grid circles */}
        {[20, 40, 60, 80, 100].map(value => (
          <circle
            key={value}
            cx={center.x}
            cy={center.y}
            r={(value / 100) * radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="1"
          />
        ))}
        
        {/* Axes */}
        {dimensions.map((_, i) => {
          const endPoint = getPoint(100, i);
          return (
            <line
              key={i}
              x1={center.x}
              y1={center.y}
              x2={endPoint.x}
              y2={endPoint.y}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="1"
            />
          );
        })}
        
        {/* Benchmark area */}
        {showBenchmark && (
          <polygon
            points={benchmarkPoints}
            fill="none"
            stroke="rgba(255,255,255,0.3)"
            strokeWidth="2"
            strokeDasharray="4,2"
          />
        )}
        
        {/* Your scores area */}
        <polygon
          points={yourPoints}
          fill="rgba(255,255,102,0.2)"
          stroke="rgba(255,255,102,0.8)"
          strokeWidth="2"
        />
        
        {/* Dimension labels */}
        {dimensions.map((dim, i) => {
          const labelPoint = getPoint(120, i);
          return (
            <text
              key={i}
              x={labelPoint.x}
              y={labelPoint.y}
              textAnchor="middle"
              className={styles.dimensionLabel}
            >
              {dim.name}
            </text>
          );
        })}
        
        {/* Score dots */}
        {dimensions.map((dim, i) => {
          const point = getPoint(dim.score, i);
          return (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="5"
              fill="#ffff66"
              className={styles.scoreDot}
            />
          );
        })}
      </svg>
      
      <div className={styles.spiderLegend}>
        <div className={styles.legendItem}>
          <span className={styles.legendLine} style={{borderColor: '#ffff66'}}></span>
          <span>Your Scores</span>
        </div>
        {showBenchmark && (
          <div className={styles.legendItem}>
            <span className={styles.legendLine} style={{borderStyle: 'dashed'}}></span>
            <span>Industry Average</span>
          </div>
        )}
      </div>
      
      {/* Dimension details */}
      <div className={styles.dimensionDetails}>
        {dimensions.sort((a, b) => a.score - b.score).slice(0, 3).map((dim, i) => (
          <div key={i} className={styles.weakDimension}>
            <span className={styles.dimName}>{dim.name}:</span>
            <span className={styles.dimScore}>{dim.score}%</span>
            <span className={styles.dimAction}>→ {dim.action || 'Needs improvement'}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// 9. RecommendationCard.jsx (Enhanced)
// ============================================
export const RecommendationCard = ({
  title,
  description,
  impact,
  effort,
  timeframe,
  category,
  metrics,
  onSelect,
  priority = 'medium'
}) => {
  const [expanded, setExpanded] = useState(false);
  
  const priorityColors = {
    critical: '#ff6666',
    high: '#ffaa66',
    medium: '#ffff66',
    low: '#66ff66'
  };
  
  return (
    <div className={`${styles.recommendationCard} ${styles[priority]}`}>
      <div className={styles.cardHeader}>
        <h4 className={styles.cardTitle}>{title}</h4>
        <span 
          className={styles.priorityBadge}
          style={{borderColor: priorityColors[priority]}}
        >
          {priority}
        </span>
      </div>
      
      <p className={styles.cardDescription}>{description}</p>
      
      <div className={styles.cardMetrics}>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Impact</span>
          <span className={styles.metricValue}>{impact}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Effort</span>
          <span className={styles.metricValue}>{effort}</span>
        </div>
        <div className={styles.metric}>
          <span className={styles.metricLabel}>Time</span>
          <span className={styles.metricValue}>{timeframe}</span>
        </div>
      </div>
      
      {metrics && (
        <button 
          className={styles.expandButton}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Hide' : 'Show'} Details
        </button>
      )}
      
      {expanded && metrics && (
        <div className={styles.expandedMetrics}>
          {Object.entries(metrics).map(([key, value]) => (
            <div key={key} className={styles.detailMetric}>
              <span className={styles.detailLabel}>{key}:</span>
              <span className={styles.detailValue}>{value}</span>
            </div>
          ))}
        </div>
      )}
      
      {onSelect && (
        <button 
          className={styles.selectButton}
          onClick={() => onSelect({ title, category })}
        >
          Add to Roadmap
        </button>
      )}
    </div>
  );
};

// ============================================
// 10. ROIProjection.jsx
// ============================================
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

// Export all components
export default {
  CompetitivePositionMatrix,
  ServiceVulnerabilityRadar,
  ValuationWaterfall,
  EfficiencyCalculator,
  PriorityMatrix,
  TransformationVelocity,
  RiskEvolutionTimeline,
  CapabilitySpiderChart,
  RecommendationCard,
  ROIProjection
};