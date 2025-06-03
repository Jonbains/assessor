import React from 'react';
import styles from './Visualizations.module.css';

export const EfficiencyCalculator = ({
  hoursSaved,
  costSavings,
  headcountEquivalent,
  revenueOpportunity,
  breakdown = []
}) => {
  return (
    <div className={styles.efficiencyContainer}>
      <h3>Efficiency & Revenue Impact</h3>
      
      <div className={styles.efficiencyGrid}>
        <div className={styles.efficiencyMetric}>
          <div className={styles.efficiencyValue}>{hoursSaved.toLocaleString()}</div>
          <div className={styles.efficiencyLabel}>Hours Saved Annually</div>
        </div>
        
        <div className={styles.efficiencyMetric}>
          <div className={styles.efficiencyValue}>£{costSavings.toLocaleString()}</div>
          <div className={styles.efficiencyLabel}>Cost Savings</div>
        </div>
        
        <div className={styles.efficiencyMetric}>
          <div className={styles.efficiencyValue}>{headcountEquivalent.toFixed(1)}</div>
          <div className={styles.efficiencyLabel}>Full-Time Equivalent</div>
        </div>
        
        <div className={styles.efficiencyMetric}>
          <div className={styles.efficiencyValue}>£{revenueOpportunity.toLocaleString()}</div>
          <div className={styles.efficiencyLabel}>Revenue Opportunity</div>
        </div>
      </div>
      
      {breakdown.length > 0 && (
        <>
          <h4>Breakdown by Department/Function</h4>
          <table className={styles.breakdownTable}>
            <thead>
              <tr>
                <th>Department</th>
                <th>Hours Saved</th>
                <th>Cost Savings</th>
                <th>FTE</th>
              </tr>
            </thead>
            <tbody>
              {breakdown.map((item, i) => (
                <tr key={i}>
                  <td>{item.department}</td>
                  <td>{item.hours.toLocaleString()}</td>
                  <td>£{item.savings.toLocaleString()}</td>
                  <td>{item.fte.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};
