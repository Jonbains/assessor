import React from 'react';
import styles from '../../core/styles/components.module.css';

// In-house Marketing Assessment Results View
const InhouseResultsView = ({ results }) => {
  // Simple validation
  if (!results) {
    return <div className={styles.errorMessage}>No results data available. Please try again.</div>;
  }
  
  const { executive, readiness, opportunities, roadmap, impact, nextSteps } = results;
  
  // Validate required sections
  if (!executive || !readiness || !opportunities || !roadmap || !impact || !nextSteps) {
    return (
      <div className={styles.errorMessage}>
        <h2>Incomplete Results</h2>
        <p>Some required data is missing. Please complete the assessment again.</p>
      </div>
    );
  }
  
  return (
    <div className={styles.resultsContainer}>
      {/* Executive Summary */}
      <div className={styles.reportSection}>
        <h2>Executive Summary</h2>
        <div className={styles.resultsHeader}>
          <div className={styles.scoreSection}>
            <div className={styles.scoreCircle}>
              <svg width="200" height="200">
                <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none"/>
                <circle cx="100" cy="100" r="90" stroke="#ffff66" strokeWidth="12" fill="none"
                  strokeDasharray={`${executive.keyMetrics.transformationScore.value * 5.65} 565`}
                  strokeLinecap="round"
                />
              </svg>
              <div className={styles.scoreValue}>{executive.keyMetrics.transformationScore.value}</div>
              <div className={styles.scoreLabel}>AI Readiness</div>
            </div>
          </div>
          
          <div className={styles.headlineSection}>
            <h1>{executive.headline}</h1>
            <p className={styles.subheadline}>{executive.subheadline}</p>
            
            <div className={styles.keyMetrics}>
              {Object.entries(executive.keyMetrics).filter(([key]) => key !== 'transformationScore').map(([key, metric]) => (
                <div key={key} className={styles.metricCard}>
                  <div className={styles.metricValue}>{metric.value}</div>
                  <div className={styles.metricLabel}>{metric.label}</div>
                  <div className={styles.metricInterpretation}>{metric.interpretation}</div>
                </div>
              ))}
            </div>
            
            <div className={styles.narrative}>
              <p>{executive.narrative}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Readiness Analysis */}
      <div className={styles.reportSection}>
        <h2>Readiness Analysis</h2>
        <div className={styles.dimensionsGrid}>
          {readiness.dimensions.map((dimension, idx) => (
            <div key={idx} className={styles.dimensionCard}>
              <h3 className={styles.dimensionName}>{dimension.name}</h3>
              <div className={styles.dimensionScore}>{dimension.score}%</div>
              <p className={styles.dimensionDescription}>{dimension.description}</p>
            </div>
          ))}
        </div>
        
        <div className={styles.narrative}>
          <p>{readiness.narrative}</p>
        </div>
        
        {readiness.activityReadiness && readiness.activityReadiness.length > 0 && (
          <div className={styles.serviceReadiness}>
            <h3>Marketing Activity Analysis</h3>
            <div className={styles.serviceGrid}>
              {readiness.activityReadiness.map((activity, idx) => (
                <div key={idx} className={`${styles.serviceCard} ${
                  activity.score > 70 ? styles.highReadiness : 
                  activity.score > 40 ? styles.mediumReadiness : 
                  styles.lowReadiness
                }`}>
                  <div className={styles.serviceName}>{activity.name}</div>
                  <div className={styles.serviceScore}>{activity.score}%</div>
                  <div className={styles.serviceInterpretation}>{activity.interpretation}</div>
                  <div className={styles.aiOpportunity}>{activity.aiOpportunity}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Transformation Opportunities */}
      <div className={styles.reportSection}>
        <h2>Transformation Opportunities</h2>
        
        {/* Immediate Quick Wins */}
        <div className={styles.opportunitiesSection}>
          <h3>{opportunities.immediate.title}</h3>
          <p className={styles.opportunitiesSubtitle}>{opportunities.immediate.subtitle}</p>
          
          <div className={styles.recommendationsGrid}>
            {opportunities.immediate.items.map((item, idx) => (
              <div key={idx} className={styles.recommendationCard}>
                <h4 className={styles.recommendationTitle}>{item.title}</h4>
                <p className={styles.recommendationDescription}>{item.description}</p>
                <div className={styles.recommendationDetails}>
                  <span><strong>Effort:</strong> {item.effort}</span>
                  <span><strong>Impact:</strong> {item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Short-term Actions */}
        <div className={styles.opportunitiesSection}>
          <h3>{opportunities.shortTerm.title}</h3>
          <p className={styles.opportunitiesSubtitle}>{opportunities.shortTerm.subtitle}</p>
          
          <div className={styles.recommendationsGrid}>
            {opportunities.shortTerm.items.map((item, idx) => (
              <div key={idx} className={styles.recommendationCard}>
                <h4 className={styles.recommendationTitle}>{item.title}</h4>
                <p className={styles.recommendationDescription}>{item.description}</p>
                <div className={styles.recommendationDetails}>
                  <span><strong>Timeline:</strong> {item.timeline}</span>
                  <span><strong>Impact:</strong> {item.impact}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Strategic Actions */}
        <div className={styles.opportunitiesSection}>
          <h3>{opportunities.strategic.title}</h3>
          <p className={styles.opportunitiesSubtitle}>{opportunities.strategic.subtitle}</p>
          
          <div className={styles.recommendationsGrid}>
            {opportunities.strategic.items.map((item, idx) => (
              <div key={idx} className={styles.recommendationCard}>
                <h4 className={styles.recommendationTitle}>{item.title}</h4>
                <p className={styles.recommendationDescription}>{item.description}</p>
                <div className={styles.recommendationDetails}>
                  <span><strong>Timeline:</strong> {item.timeline}</span>
                  <span><strong>Impact:</strong> {item.impact}</span>
                  <span><strong>Complexity:</strong> {item.complexity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Transformation Roadmap */}
      <div className={styles.reportSection}>
        <h2>Your Transformation Roadmap</h2>
        <div className={styles.roadmapOverview}>
          <h3>{roadmap.overview.title}</h3>
          <p>{roadmap.overview.approach}</p>
        </div>
        
        <div className={styles.roadmapPhases}>
          {roadmap.phases.map((phase, idx) => (
            <div key={idx} className={styles.roadmapPhase}>
              <h4 className={styles.phaseTitle}>{phase.title}</h4>
              <div className={styles.phaseDuration}>{phase.duration}</div>
              <ul className={styles.phaseActions}>
                {phase.actions.map((action, i) => (
                  <li key={i}>{action}</li>
                ))}
              </ul>
              <div className={styles.phaseOutcome}>
                <strong>Expected Outcome:</strong> {phase.expectedOutcome}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Business Impact */}
      <div className={styles.reportSection}>
        <h2>{impact.title}</h2>
        <p className={styles.sectionSubtitle}>{impact.subtitle}</p>
        
        {/* Current & Future State Cards */}
        <div className={styles.cardsGrid}>
          {/* Current State Card */}
          <div className={styles.serviceCard}>
            <h3 className={styles.cardTitle}>{impact.current.title}</h3>
            <p className={styles.cardDescription}>{impact.current.description}</p>
            <div className={styles.itemsList}>
              {impact.current.items.map((item, idx) => (
                <div key={idx} className={styles.statusItem}>
                  <div className={styles.statusLabel}>{item.title}</div>
                  <div className={`${styles.statusValue} ${styles[item.color]}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Future State Card */}
          <div className={styles.serviceCard}>
            <h3 className={styles.cardTitle}>{impact.future.title}</h3>
            <p className={styles.cardDescription}>{impact.future.description}</p>
            <div className={styles.itemsList}>
              {impact.future.items.map((item, idx) => (
                <div key={idx} className={styles.statusItem}>
                  <div className={styles.statusLabel}>{item.title}</div>
                  <div className={`${styles.statusValue} ${styles[item.color]}`}>
                    {item.value}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.achievableTimeframe}>{impact.future.achievable}</div>
          </div>
        </div>
        
        {/* Expected Improvements */}
        <h3 className={styles.subsectionTitle}>Expected Improvements</h3>
        <div className={styles.cardsGrid}>
          {impact.improvements.map((improvement, idx) => (
            <div key={idx} className={styles.serviceCard}>
              <h3 className={styles.cardTitle}>{improvement.title}</h3>
              <p className={styles.cardDescription}>{improvement.description}</p>
              <div className={styles.improvementComparison}>
                <div className={styles.beforeState}>{improvement.before}</div>
                <div className={styles.stateArrow}>→</div>
                <div className={styles.afterState}>{improvement.after}</div>
              </div>
              <div className={`${styles.improvementTag} ${styles[improvement.color]}`}>
                {improvement.improvement}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next Steps */}
      <div className={styles.reportSection}>
        <h2>Your Next Steps</h2>
        
        {nextSteps.urgency && (
          <div className={`${styles.urgencyMessage} ${styles[nextSteps.urgency.level]}`}>
            {nextSteps.urgency.message}
          </div>
        )}
        
        <div className={styles.nextStepsOptions}>
          {nextSteps.options.map((option, idx) => (
            <div key={idx} className={styles.nextStepCard}>
              <h3 className={styles.nextStepTitle}>{option.title}</h3>
              <div className={styles.nextStepPrice}>{option.price}</div>
              <p className={styles.nextStepDescription}>{option.description}</p>
              <ul className={styles.nextStepValue}>
                {option.value.map((item, i) => (
                  <li key={i}>{item}</li>
                ))}
              </ul>
              <p className={styles.nextStepIdealFor}>
                <strong>Ideal for:</strong> {option.idealFor}
              </p>
            </div>
          ))}
        </div>
        
        <div className={styles.ctaSection}>
          <h3>{nextSteps.primaryCTA.headline}</h3>
          <p>{nextSteps.primaryCTA.subheadline}</p>
          <button className={styles.primaryButton}>
            {nextSteps.primaryCTA.buttonText}
          </button>
        </div>
        
        {nextSteps.testimonial && (
          <div className={styles.testimonial}>
            <p className={styles.testimonialQuote}>"{nextSteps.testimonial.quote}"</p>
            <p className={styles.testimonialAuthor}>
              — {nextSteps.testimonial.author}, {nextSteps.testimonial.role}
            </p>
            <p className={styles.testimonialResult}>{nextSteps.testimonial.result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InhouseResultsView;