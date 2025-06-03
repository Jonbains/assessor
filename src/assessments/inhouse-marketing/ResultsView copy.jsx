import React from 'react';
import styles from '../../core/styles/components.module.css';

// Helper functions for the report view

// Download assessment results as JSON
const downloadJSON = (data, filename) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const href = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(href);
};

// Helper function to safely render potentially non-string values
const safeRender = (value) => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'number') return value.toString();
  if (typeof value === 'boolean') return value.toString();
  if (Array.isArray(value)) return ''; // Don't render arrays directly
  if (typeof value === 'object') return ''; // Don't render objects directly
  return '';
};

// Generate circular progress charts
const CircularProgress = ({ value, size = 120, strokeWidth = 8, color, label }) => {
  const radius = (size / 2) - (strokeWidth / 2);
  const circumference = 2 * Math.PI * radius;
  const progress = value / 100 * circumference;
  
  return (
    <div className={styles.circularProgressContainer} style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle 
          cx={size/2} 
          cy={size/2} 
          r={radius} 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth={strokeWidth} 
          fill="none"
        />
        <circle 
          cx={size/2} 
          cy={size/2} 
          r={radius} 
          stroke={color} 
          strokeWidth={strokeWidth} 
          fill="none"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
      </svg>
      <div className={styles.circularProgressValue}>{safeRender(value)}</div>
      {label && typeof label === 'string' ? <div className={styles.circularProgressLabel}>{label}</div> : null}
    </div>
  );
};

// In-house Marketing Assessment Results View
const InhouseResultsView = ({ results }) => {
  console.log('InhouseResultsView received results:', results);
  
  // Check if results is undefined or missing
  if (!results) {
    console.error('InhouseResultsView: results prop is undefined or null');
    return <div className={styles.errorMessage}>No results data available. Please try again.</div>;
  }
  
  // Log all the keys in the results object
  console.log('InhouseResultsView results keys:', Object.keys(results));
  
  const { executiveSummary, marketPosition, quickWins, strategicRoadmap, expectedOutcomes, nextSteps, maturityLevels } = results;
  
  // Check if required properties exist
  console.log('Executive Summary data:', executiveSummary);
  console.log('Market Position data:', marketPosition);
  console.log('Quick Wins data:', quickWins);
  console.log('Strategic Roadmap data:', strategicRoadmap);
  console.log('Expected Outcomes data:', expectedOutcomes);
  console.log('Next Steps data:', nextSteps);
  console.log('Maturity Levels data:', maturityLevels);
  
  // Log what data we actually have
  console.log('Detailed data check:', {
    executiveSummary: executiveSummary || 'missing',
    marketPosition: marketPosition || 'missing',
    quickWins: quickWins || 'missing',
    strategicRoadmap: strategicRoadmap || 'missing',
    expectedOutcomes: expectedOutcomes || 'missing',
    nextSteps: nextSteps || 'missing',
    maturityLevels: maturityLevels || 'missing'
  });
  
  // Log all response data for debugging
  console.log('User responses:', results.responses || 'missing');
  console.log('Raw data:', results._rawData || 'missing');
  
  // Validate that the results have the minimum required data
  const validateResults = () => {
    console.log("Validating results:", results);
    
    if (!results) {
      console.error("No results data provided");
      return false;
    }
    
    // Check if we have at least some data to display
    const requiredSections = [
      'executiveSummary',
      'marketPosition',
      'quickWins',
      'strategicRoadmap',
      'expectedOutcomes',
      'nextSteps',
      'maturityLevels'
    ];
    
    // Count how many sections are available
    let availableSections = 0;
    for (const section of requiredSections) {
      if (results[section]) {
        console.log(`Section available: ${section}`);
        availableSections++;
      } else {
        console.warn(`Missing section: ${section}`);
      }
    }
    
    // Only show error if we have no valid sections to display
    if (availableSections === 0) {
      console.error("No valid sections available to display");
      return false;
    }
    
    return true;
  };
  
  // Check if results have at least some valid sections
  const resultsValid = validateResults();
  
  // Early return with error message if no valid sections
  if (!resultsValid) {
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.errorTitle}>Results Data Error</h2>
        <p className={styles.errorMessage}>
          We couldn't find any valid assessment data to display. Please try again or contact support.
        </p>
        <a href="/" className={styles.errorButton}>
          Return to Home
        </a>
      </div>
    );
  }
  
  // Calculate overall effectiveness based on headline
  const getOverallScore = () => {
    if (!executiveSummary || !executiveSummary.headline) return 50;
    const headline = executiveSummary.headline.toLowerCase();
    if (headline.includes('urgent action') || headline.includes('at risk')) return 35;
    if (headline.includes('early stage') || headline.includes('adapting')) return 55;
    if (headline.includes('building capability') || headline.includes('keeping pace')) return 75;
    if (headline.includes('transformation ready') || headline.includes('leading')) return 90;
    return 65; // Default middle score
  };
  
  const overallScore = getOverallScore();
  
  // Get color for maturity charts and indicators
  const getMaturityColor = (score) => {
    if (score < 30) return '#dc3545'; // Red - poor
    if (score < 50) return '#fd7e14'; // Orange - needs work
    if (score < 70) return '#ffc107'; // Yellow - average
    if (score < 85) return '#20c997'; // Teal - good
    return '#28a745'; // Green - excellent
  };
  
  // Helper function to get maturity badge background color
  const getMaturityBadgeClass = (score) => {
    // Return appropriate background color based on score
    if (score <= 25) return { backgroundColor: '#ff4d4d' };
    if (score <= 50) return { backgroundColor: '#ffaa33' };
    if (score <= 75) return { backgroundColor: '#33bbff' };
    return { backgroundColor: '#44cc44' };
  };
  
  // Get maturity level label from score
  const getMaturityLabel = (score) => {
    if (score < 30) return 'Foundational';
    if (score < 50) return 'Developing';
    if (score < 70) return 'Established';
    if (score < 85) return 'Advanced';
    return 'Leading';
  };
  
  // Helper function to get CSS class based on impact level
  const getImpactClass = (impact) => {
    if (!impact) return styles.impactDefault;
    const impactLower = impact.toLowerCase();
    if (impactLower === 'high') return styles.impactHigh;
    if (impactLower === 'medium') return styles.impactMedium;
    return styles.impactLow;
  };
  
  // Helper function to get CSS class based on effort level
  const getEffortClass = (effort) => {
    if (!effort) return styles.effortDefault;
    const effortLower = effort.toLowerCase();
    if (effortLower === 'low') return styles.effortLow;
    if (effortLower === 'medium') return styles.effortMedium;
    return styles.effortHigh;
  };
  
  return (
    <div className={styles.resultsContainer}>
      {/* Executive Summary Section */}
      {executiveSummary && (
        <div className={styles.reportSection}>
          <h2>Executive Summary</h2>
          <div className={styles.resultsHeader}>
            <div className={styles.scoreSection}>
              <div className={styles.scoreCircle}>
                <svg width="200" height="200">
                  <circle cx="100" cy="100" r="90" stroke="rgba(255,255,255,0.1)" strokeWidth="12" fill="none"/>
                  <circle 
                    cx="100" 
                    cy="100" 
                    r="90" 
                    stroke={getMaturityColor(overallScore)} 
                    strokeWidth="12" 
                    fill="none"
                    strokeDasharray={`${overallScore * 5.65} 565`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className={styles.scoreValue}>{safeRender(overallScore)}</div>
                <div className={styles.scoreLabel}>Marketing Maturity</div>
              </div>
            </div>
            
            <div className={styles.headlineSection}>
              <h1>{safeRender(executiveSummary.headline)}</h1>
              {executiveSummary.summary && (
                <p className={styles.subheadline}>{safeRender(executiveSummary.summary)}</p>
              )}
              
              <div className={styles.keyMetrics}>
                <div className={styles.metricCard}>
                  <div className={styles.metricValue}>{safeRender(getMaturityLabel(overallScore))}</div>
                  <div className={styles.metricLabel}>Maturity Level</div>
                </div>
                
                {results.context && results.context.companySize && (
                  <div className={styles.metricCard}>
                    <div className={styles.metricValue}>{safeRender(results.context.companySize)}</div>
                    <div className={styles.metricLabel}>Company Size</div>
                  </div>
                )}
                
                {results.context && results.context.sector && (
                  <div className={styles.metricCard}>
                    <div className={styles.metricValue}>{safeRender(results.context.sector)}</div>
                    <div className={styles.metricLabel}>Industry Sector</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Position Section */}
      {marketPosition && (
        <div className={styles.reportSection}>
          <h2>Current Market Position</h2>
          {marketPosition.description && (
            <p className={styles.sectionIntro}>{safeRender(marketPosition.description)}</p>
          )}
          
          {marketPosition.headline && (
            <h3 className={styles.sectionSubheading}>{safeRender(marketPosition.headline)}</h3>
          )}
          
          <div className={styles.comparisonGrid}>
            <div className={styles.comparisonCard}>
              <h3>Strengths</h3>
              <ul>
                {executiveSummary && executiveSummary.strengths && Array.isArray(executiveSummary.strengths) ? 
                  executiveSummary.strengths.map((strength, idx) => (
                    <li key={idx}>{safeRender(strength)}</li>
                  )) : 
                  <li>No strengths data available</li>
                }
              </ul>
            </div>
            
            <div className={styles.comparisonCard}>
              <h3>Challenges</h3>
              <ul>
                {executiveSummary && executiveSummary.weaknesses && Array.isArray(executiveSummary.weaknesses) ? 
                  executiveSummary.weaknesses.map((weakness, idx) => (
                    <li key={idx}>{safeRender(weakness)}</li>
                  )) : 
                  <li>No challenges data available</li>
                }
              </ul>
            </div>
          </div>
          
          {marketPosition.competitiveAnalysis && (
            <div className={styles.infoBox}>
              <h3>Competitive Analysis</h3>
              <div className={styles.comparisonGrid}>
                <div className={styles.comparisonCard}>
                  <h4>Areas You're Ahead</h4>
                  <ul>
                    {marketPosition.competitiveAnalysis.ahead && Array.isArray(marketPosition.competitiveAnalysis.ahead) ? 
                      marketPosition.competitiveAnalysis.ahead.map((item, idx) => (
                        <li key={idx}>{safeRender(item)}</li>
                      )) : 
                      <li>No data available</li>
                    }
                  </ul>
                </div>
                
                <div className={styles.comparisonCard}>
                  <h4>Areas to Improve</h4>
                  <ul>
                    {marketPosition.competitiveAnalysis.behind && Array.isArray(marketPosition.competitiveAnalysis.behind) ? 
                      marketPosition.competitiveAnalysis.behind.map((item, idx) => (
                        <li key={idx}>{safeRender(item)}</li>
                      )) : 
                      <li>No data available</li>
                    }
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Quick Wins Section */}
      {quickWins && quickWins.length > 0 && (
        <div className={styles.reportSection}>
          <h2>Quick Wins</h2>
          <p className={styles.sectionIntro}>These are immediate opportunities to improve your marketing effectiveness</p>
          <div className={styles.actionGrid}>
            {quickWins.map((win, idx) => (
              <div key={idx} className={styles.actionCard}>
                <h3>{safeRender(win.title)}</h3>
                <p>{safeRender(win.description)}</p>
                <div className={styles.cardMeta}>
                  <span className={`${styles.metaTag} ${getImpactClass(win.impact)}`}>
                    Impact: {safeRender(win.impact)}
                  </span>
                  <span className={`${styles.metaTag} ${getEffortClass(win.effort)}`}>
                    Effort: {safeRender(win.effort)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Strategic Roadmap Section */}
      {strategicRoadmap && Array.isArray(strategicRoadmap) && strategicRoadmap.length > 0 && (
        <div className={styles.reportSection}>
          <h2>Strategic Roadmap</h2>
          <div className={styles.roadmapGrid}>
            {strategicRoadmap.map((strategy, idx) => (
              <div key={idx} className={styles.roadmapCard}>
                <h3>{safeRender(strategy.title || strategy.phase)}</h3>
                <p>{safeRender(strategy.description || strategy.objective)}</p>
                <div className={styles.roadmapTimeframe}>
                  Timeframe: {safeRender(strategy.timeframe)}
                </div>
                {strategy.activities && Array.isArray(strategy.activities) && strategy.activities.length > 0 && (
                  <div className={styles.implementationSteps}>
                    <h4>Key Activities:</h4>
                    <ol className={styles.stepsList}>
                      {strategy.activities.map((activity, activityIdx) => (
                        <li key={activityIdx}>{safeRender(activity)}</li>
                      ))}
                    </ol>
                  </div>
                )}
                {strategy.outcomes && Array.isArray(strategy.outcomes) && strategy.outcomes.length > 0 && (
                  <div className={styles.implementationSteps}>
                    <h4>Expected Outcomes:</h4>
                    <ul>
                      {strategy.outcomes.map((outcome, outcomeIdx) => (
                        <li key={outcomeIdx}>{safeRender(outcome)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {strategy.investment && (
                  <div className={styles.roadmapTag}>
                    Investment: {safeRender(strategy.investment)}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {strategicRoadmap.investmentGuide && (
            <div className={styles.infoBox}>
              <h3>Investment Guide</h3>
              <p>{safeRender(strategicRoadmap.investmentGuide)}</p>
            </div>
          )}
        </div>
      )}

      {/* Expected Outcomes Section */}
      {expectedOutcomes && expectedOutcomes.length > 0 && (
        <div className={styles.reportSection}>
          <h2>Expected Outcomes</h2>
          <div className={styles.impactGrid}>
            {expectedOutcomes.map((outcome, idx) => (
              <div key={idx} className={styles.impactCard}>
                <h3>{safeRender(outcome.title)}</h3>
                <p>{safeRender(outcome.description)}</p>
                {outcome.metrics && Array.isArray(outcome.metrics) && outcome.metrics.length > 0 && (
                  <div className={styles.keyMetricsList}>
                    <h4>Key Metrics:</h4>
                    <ul>
                      {outcome.metrics.map((metric, metricIdx) => (
                        <li key={metricIdx}>{safeRender(metric)}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {outcome.timeframe && (
                  <div className={styles.timeframe}>
                    Expected in: {safeRender(outcome.timeframe)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Next Steps Section */}
      {nextSteps && (
        <div className={styles.reportSection}>
          <h2>Next Steps</h2>
          {nextSteps.description && (
            <p className={styles.sectionIntro}>{safeRender(nextSteps.description)}</p>
          )}
          
          <div className={styles.actionCards}>
            {nextSteps.primaryCTA && (
              <div className={styles.actionCard}>
                {nextSteps.primaryCTA.title && (
                  <h3>{safeRender(nextSteps.primaryCTA.title)}</h3>
                )}
                {nextSteps.primaryCTA.description && (
                  <p>{safeRender(nextSteps.primaryCTA.description)}</p>
                )}
                {nextSteps.primaryCTA.link && nextSteps.primaryCTA.buttonText && (
                  <a href={nextSteps.primaryCTA.link} className={styles.ctaButton}>
                    {safeRender(nextSteps.primaryCTA.buttonText)}
                  </a>
                )}
              </div>
            )}
            
            {nextSteps.alternatives && Array.isArray(nextSteps.alternatives) && nextSteps.alternatives.length > 0 && (
              <div className={styles.actionCard}>
                <h3>Other Options</h3>
                <ul className={styles.linksList}>
                  {nextSteps.alternatives.map((alt, idx) => (
                    <li key={idx}>
                      <a href={alt.link || '#'} className={styles.inlineLink}>
                        {safeRender(alt.text) || `Option ${idx + 1}`}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Maturity Levels Section */}
      {maturityLevels && Array.isArray(maturityLevels) && maturityLevels.length > 0 && (
        <div className={styles.reportSection}>
          <h2>Maturity Levels</h2>
          <p className={styles.sectionIntro}>
            Your marketing capabilities across key dimensions, scored on a scale of 0-100
          </p>
          <div className={styles.scoreCardsGrid}>
            {maturityLevels.map((level, idx) => (
              <div key={idx} className={styles.scoreCard}>
                <CircularProgress 
                  value={level.score} 
                  color={getMaturityColor(level.score)}
                  label={level.area}
                />
                <div className={styles.maturityBadge} style={getMaturityBadgeClass(level.score)}>
                  {safeRender(level.level)}
                </div>
                <p className={styles.scoreDescription}>{safeRender(level.description)}</p>
              </div>
            ))}
          </div>
          
          <div className={styles.scoreLegend}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#ff4d4d' }}></div>
              <div className={styles.legendText}>Beginner (0-25)</div>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#ffaa33' }}></div>
              <div className={styles.legendText}>Developing (26-50)</div>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#33bbff' }}></div>
              <div className={styles.legendText}>Established (51-75)</div>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ background: '#44cc44' }}></div>
              <div className={styles.legendText}>Advanced (76-100)</div>
            </div>
          </div>
        </div>
      )}
      
      {/* Action Buttons */}
      <div className={styles.reportSection}>
        <div className={styles.buttonContainer}>
          <button 
            className={styles.primaryButton}
            onClick={() => downloadJSON(results || {}, 'inhouse-marketing-assessment-results.json')}
          >
            Download Full Report (JSON)
          </button>
          
          <a 
            href="/" 
            className={styles.secondaryButton}
          >
            Start New Assessment
          </a>
          
          <button 
            className={styles.secondaryButton}
            onClick={() => window.print()}
          >
            Print Report
          </button>
        </div>
        
        <div className={styles.reportFooter}>
          <p>This report was generated based on your assessment responses. For expert guidance on implementing these recommendations, contact our marketing specialists.</p>
        </div>
      </div>
    </div>
  );
};

export default InhouseResultsView;
