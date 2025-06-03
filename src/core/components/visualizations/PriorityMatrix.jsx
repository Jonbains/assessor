import React, { useState } from 'react';
import styles from './Visualizations.module.css';

export const PriorityMatrix = ({ items, onItemClick }) => {
  const [hoveredItem, setHoveredItem] = useState(null);
  
  // Get position for item based on impact and effort
  const getPosition = (item) => {
    // Impact (0-100) maps to Y-axis (90-10)
    // Effort (0-100) maps to X-axis (10-90)
    return {
      x: 10 + (item.effort / 100) * 80,
      y: 90 - (item.impact / 100) * 80
    };
  };
  
  // Get color based on category
  const getCategoryColor = (category) => {
    const colors = {
      'strategy': '#ff6666',
      'operations': '#66ff66',
      'technology': '#6666ff',
      'marketing': '#ffff66',
      'sales': '#ff66ff',
      'finance': '#66ffff',
      'default': '#ffffff'
    };
    
    return colors[category?.toLowerCase()] || colors.default;
  };
  
  return (
    <div className={styles.priorityContainer}>
      <h3>Priority Matrix</h3>
      
      <svg viewBox="0 0 100 100" className={styles.prioritySvg}>
        {/* Grid lines */}
        <defs>
          <pattern id="priorityGrid" width="25" height="25" patternUnits="userSpaceOnUse">
            <path d="M 25 0 L 0 0 0 25" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#priorityGrid)" />
        
        {/* Quadrant labels */}
        <text x="25" y="25" className={styles.priorityQuadrantLabel}>Quick Wins</text>
        <text x="75" y="25" className={styles.priorityQuadrantLabel}>Strategic</text>
        <text x="25" y="75" className={styles.priorityQuadrantLabel}>Low Priority</text>
        <text x="75" y="75" className={styles.priorityQuadrantLabel}>Time Consuming</text>
        
        {/* Dividing lines */}
        <line x1="50" y1="0" x2="50" y2="100" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
        
        {/* Items */}
        {items.map((item, i) => {
          const pos = getPosition(item);
          const color = getCategoryColor(item.category);
          
          return (
            <g key={i}>
              <circle
                cx={pos.x}
                cy={pos.y}
                r="6"
                fill={color}
                opacity="0.8"
                className={styles.priorityItem}
                onClick={() => onItemClick && onItemClick(item)}
                onMouseEnter={() => setHoveredItem(item)}
                onMouseLeave={() => setHoveredItem(null)}
              />
              
              {/* Show title for hovered item */}
              {hoveredItem === item && (
                <g>
                  <rect
                    x={pos.x - 45}
                    y={pos.y - 25}
                    width="90"
                    height="20"
                    fill="rgba(0,0,0,0.8)"
                    rx="3"
                  />
                  <text
                    x={pos.x}
                    y={pos.y - 12}
                    className={styles.priorityItemLabel}
                    textAnchor="middle"
                  >
                    {item.title}
                  </text>
                </g>
              )}
            </g>
          );
        })}
        
        {/* Axis labels */}
        <text x="5" y="50" className={styles.priorityQuadrantLabel} textAnchor="start" dominantBaseline="middle">
          Low Effort
        </text>
        <text x="95" y="50" className={styles.priorityQuadrantLabel} textAnchor="end" dominantBaseline="middle">
          High Effort
        </text>
        <text x="50" y="5" className={styles.priorityQuadrantLabel} textAnchor="middle">
          High Impact
        </text>
        <text x="50" y="95" className={styles.priorityQuadrantLabel} textAnchor="middle">
          Low Impact
        </text>
      </svg>
      
      <div className={styles.priorityLegend}>
        {['Strategy', 'Operations', 'Technology', 'Marketing', 'Sales', 'Finance'].map(category => (
          <div key={category} className={styles.legendItem}>
            <div 
              className={styles.legendColor} 
              style={{ backgroundColor: getCategoryColor(category.toLowerCase()) }}
            ></div>
            <span>{category}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Helper method for positioning
PriorityMatrix.getPosition = getPosition;
