import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import styles from '../styles/components.module.css';

const ResultsDashboard = ({ ResultsView }) => {
  const navigate = useNavigate();
  const { type } = useParams();
  const { assessmentData, calculateResults, saveResults } = useAssessment();
  
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('summary');

  useEffect(() => {
    generateResults();
  }, []);

  const generateResults = async () => {
    try {
      setIsLoading(true);
      
      // Calculate scores and generate recommendations
      const calculatedResults = await calculateResults();
      
      // Save results to Firebase
      await saveResults(calculatedResults);
      
      setResults(calculatedResults);
      setIsLoading(false);
    } catch (err) {
      console.error('Error generating results:', err);
      setError('Failed to generate results. Please try again.');
      setIsLoading(false);
    }
  };

  const handleBookConsultation = () => {
    // Track conversion
    if (window.gtag) {
      window.gtag('event', 'consultation_click', {
        assessment_type: type,
        score: results?.scores?.overall,
        category: results?.scores?.categories?.readiness?.level
      });
    }
    
    // Navigate to booking page with context
    const bookingUrl = `https://obsolete.com/quickmap?assessment=${type}&score=${results?.scores?.overall}`;
    window.open(bookingUrl, '_blank');
  };

  const handleDownloadReport = async () => {
    // Track download
    if (window.gtag) {
      window.gtag('event', 'report_download', {
        assessment_type: type,
        score: results?.scores?.overall
      });
    }
    
    // Generate and download PDF
    // This would typically call a cloud function or API
    alert('Report download functionality would be implemented here');
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingAnimation}>
          <div className={styles.spinner} />
          <h2>Analyzing your responses...</h2>
          <p>Generating personalized recommendations</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Something went wrong</h2>
        <p>{error}</p>
        <button onClick={generateResults} className={styles.primaryButton}>
          Try Again
        </button>
      </div>
    );
  }

  if (!results) return null;

  // Use custom ResultsView if provided, otherwise use default
  if (ResultsView) {
    return <ResultsView results={results} onBookConsultation={handleBookConsultation} />;
  }

  // Default results view
  const { scores, report, recommendations } = results;

  return (
    <div className={styles.resultsContainer}>
      {/* Header with score */}
      <div className={styles.resultsHeader}>
        <div className={styles.scoreSection}>
          <div className={styles.scoreCircle}>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="rgba(255,255,255,0.1)"
                strokeWidth="12"
                fill="none"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                stroke="#ffff66"
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 90}`}
                strokeDashoffset={`${2 * Math.PI * 90 * (1 - (scores.overall || 0) / 100)}`}
                transform="rotate(-90 100 100)"
                style={{ transition: 'stroke-dashoffset 1.5s ease' }}
              />
            </svg>
            <div className={styles.scoreValue}>
              <span className={styles.scoreNumber}>{scores.overall || 0}</span>
              <span className={styles.scoreLabel}>Overall Score</span>
            </div>
          </div>
        </div>
        
        <div className={styles.headlineSection}>
          <h1>{report?.executive?.headline || 'Your Assessment Results'}</h1>
          <p className={styles.subheadline}>
            {report?.executive?.subheadline || 'Detailed analysis and recommendations below'}
          </p>
          
          <div className={styles.keyMetrics}>
            {report?.executive?.keyMetrics && Object.entries(report.executive.keyMetrics).map(([key, metric]) => (
              <div key={key} className={styles.metricCard}>
                <div className={styles.metricValue}>{metric.value}</div>
                <div className={styles.metricLabel}>{metric.label}</div>
                <div className={styles.metricInterpretation}>{metric.interpretation}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className={styles.sectionNav}>
        <button
          className={`${styles.navButton} ${activeSection === 'summary' ? styles.active : ''}`}
          onClick={() => setActiveSection('summary')}
        >
          Summary
        </button>
        <button
          className={`${styles.navButton} ${activeSection === 'readiness' ? styles.active : ''}`}
          onClick={() => setActiveSection('readiness')}
        >
          Readiness
        </button>
        <button
          className={`${styles.navButton} ${activeSection === 'opportunities' ? styles.active : ''}`}
          onClick={() => setActiveSection('opportunities')}
        >
          Opportunities
        </button>
        <button
          className={`${styles.navButton} ${activeSection === 'roadmap' ? styles.active : ''}`}
          onClick={() => setActiveSection('roadmap')}
        >
          Roadmap
        </button>
        {scores.valuationDimensions && (
          <button
            className={`${styles.navButton} ${activeSection === 'valuation' ? styles.active : ''}`}
            onClick={() => setActiveSection('valuation')}
          >
            Valuation Impact
          </button>
        )}
      </div>

      {/* Section Content */}
      <div className={styles.sectionContent}>
        {activeSection === 'summary' && (
          <div className={styles.summarySection}>
            <div className={styles.narrative}>
              <p>{report?.executive?.narrative}</p>
            </div>
            
            <div className={styles.snapshotGrid}>
              <div className={styles.snapshotCard}>
                <h3>Strengths</h3>
                <ul>
                  {report?.executive?.snapshot?.strengths?.map((strength, i) => (
                    <li key={i}>{strength}</li>
                  ))}
                </ul>
              </div>
              
              <div className={styles.snapshotCard}>
                <h3>Gaps</h3>
                <ul>
                  {report?.executive?.snapshot?.gaps?.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>
              
              {report?.executive?.snapshot?.quickestWin && (
                <div className={styles.snapshotCard}>
                  <h3>Quickest Win</h3>
                  <h4>{report.executive.snapshot.quickestWin.action}</h4>
                  <p>Impact: {report.executive.snapshot.quickestWin.impact}</p>
                  <p>Effort: {report.executive.snapshot.quickestWin.effort}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSection === 'readiness' && (
          <div className={styles.readinessSection}>
            <div className={styles.dimensionsGrid}>
              {report?.readiness?.dimensions?.map((dimension, i) => (
                <div key={i} className={styles.dimensionCard}>
                  <div className={styles.dimensionHeader}>
                    <span className={styles.dimensionIcon}>{dimension.icon}</span>
                    <h3>{dimension.name}</h3>
                  </div>
                  <div className={styles.dimensionScore}>
                    <div className={styles.scoreBar}>
                      <div 
                        className={styles.scoreBarFill} 
                        style={{ width: `${dimension.score}%` }}
                      />
                    </div>
                    <span>{dimension.score}%</span>
                  </div>
                  <p>{dimension.description}</p>
                  <ul className={styles.insights}>
                    {dimension.insights?.map((insight, j) => (
                      <li key={j}>{insight}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'opportunities' && (
          <div className={styles.opportunitiesSection}>
            {recommendations?.immediate && (
              <div className={styles.opportunityGroup}>
                <h2>{recommendations.immediate.title || "Quick Wins"}</h2>
                <p>{recommendations.immediate.subtitle}</p>
                <div className={styles.opportunitiesGrid}>
                  {recommendations.immediate.items?.map((item, i) => (
                    <div key={i} className={styles.opportunityCard}>
                      <h3>{item.title}</h3>
                      <p>{item.description || item.why}</p>
                      <div className={styles.opportunityMeta}>
                        <span className={styles.effort}>Effort: {item.effort}</span>
                        <span className={styles.impact}>Impact: {item.impact}</span>
                      </div>
                      {item.specificAction && (
                        <div className={styles.actionBox}>
                          <strong>Action:</strong> {item.specificAction}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'roadmap' && (
          <div className={styles.roadmapSection}>
            <h2>Your Transformation Journey</h2>
            <div className={styles.phases}>
              {report?.roadmap?.phases?.map((phase, i) => (
                <div key={i} className={styles.phaseCard}>
                  <h3>{phase.name}</h3>
                  <p className={styles.duration}>{phase.duration}</p>
                  <p className={styles.focus}>{phase.focus}</p>
                  <h4>Milestones:</h4>
                  <ul>
                    {phase.milestones?.map((milestone, j) => (
                      <li key={j}>{milestone}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'valuation' && scores.valuationDimensions && (
          <div className={styles.valuationSection}>
            <h2>{report?.valuation?.title}</h2>
            <p>{report?.valuation?.subtitle}</p>
            
            <div className={styles.valuationGrid}>
              <div className={styles.currentValuation}>
                <h3>Current Valuation</h3>
                <div className={styles.multiple}>{report?.valuation?.current?.multiple}</div>
                <p>{report?.valuation?.current?.category}</p>
              </div>
              
              <div className={styles.potentialValuation}>
                <h3>Potential Valuation</h3>
                <div className={styles.multiple}>{report?.valuation?.potential?.multiple}</div>
                <div className={styles.increase}>{report?.valuation?.potential?.increase}</div>
                <p>Achievable in {report?.valuation?.potential?.achievableIn}</p>
              </div>
            </div>
            
            <div className={styles.valuationDrivers}>
              <h3>Value Drivers</h3>
              {report?.valuation?.drivers?.map((driver, i) => (
                <div key={i} className={styles.driverCard}>
                  <h4>{driver.driver}</h4>
                  <p>Current Impact: {driver.currentImpact}</p>
                  <p>Potential: {driver.potentialImpact}</p>
                  <p className={styles.action}>{driver.action}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContent}>
          <h2>{report?.nextSteps?.booking?.headline || "Ready to Transform?"}</h2>
          <p>{report?.nextSteps?.booking?.subheadline || "Get your personalized roadmap"}</p>
          
          <div className={styles.ctaButtons}>
            <button onClick={handleBookConsultation} className={styles.primaryCTA}>
              {report?.nextSteps?.booking?.buttonText || "Book Your QuickMap Session"}
            </button>
            <button onClick={handleDownloadReport} className={styles.secondaryCTA}>
              Download Full Report
            </button>
          </div>
          
          {report?.nextSteps?.urgency && (
            <p className={styles.urgencyMessage}>{report.nextSteps.urgency.message}</p>
          )}
        </div>
        
        {report?.nextSteps?.testimonial && (
          <div className={styles.testimonial}>
            <blockquote>"{report.nextSteps.testimonial.quote}"</blockquote>
            <cite>
              — {report.nextSteps.testimonial.author}, {report.nextSteps.testimonial.role}
            </cite>
            <p className={styles.result}>{report.nextSteps.testimonial.result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;