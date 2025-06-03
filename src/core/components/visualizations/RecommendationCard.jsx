import React, { useState } from 'react';
import styles from './Visualizations.module.css';

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
  
  // Priority class for styling
  const priorityClass = {
    high: styles.highPriority,
    medium: styles.mediumPriority,
    low: styles.lowPriority
  }[priority.toLowerCase()] || styles.mediumPriority;
  
  return (
    <div className={`${styles.recContainer} ${priorityClass}`}>
      <h4 className={styles.recTitle}>{title}</h4>
      
      <p className={styles.recDescription}>{description}</p>
      
      <div className={styles.recTags}>
        {impact && (
          <span className={`${styles.recTag} ${styles.impact}`}>
            Impact: {impact}
          </span>
        )}
        
        {effort && (
          <span className={`${styles.recTag} ${styles.effort}`}>
            Effort: {effort}
          </span>
        )}
        
        {timeframe && (
          <span className={`${styles.recTag} ${styles.timeframe}`}>
            Timeframe: {timeframe}
          </span>
        )}
        
        {category && (
          <span className={`${styles.recTag} ${styles.category}`}>
            {category}
          </span>
        )}
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
