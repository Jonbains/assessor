import React, { useState, useEffect } from 'react';
import styles from '../styles/components.module.css';
import { AssessmentEngine } from '../engine/AssessmentEngine';
import ResultsAdapterFactory from '../engine/ResultsAdapterFactory';

const ResultsDashboard = ({ 
  assessmentType, 
  calculateResults, 
  onRestart,
  ResultsView,
  getResponse, 
  getContext
}) => {
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('summary');

  useEffect(() => {
    console.log('ResultsDashboard mounted with assessmentType:', assessmentType);
    console.log('Custom ResultsView provided:', !!ResultsView);
    generateResults();
  }, []);

  // Transform the scoring engine output to match the expected ResultsView format using the adapter pattern
  const adaptResultsFormat = (rawResults) => {
    console.log('Adapting results format for view:', assessmentType);
    console.log('Raw results structure:', Object.keys(rawResults || {}));
    
    if (!rawResults) {
      console.error('adaptResultsFormat received null/undefined rawResults');
      return null;
    }
    
    // Use the adapter factory to get the appropriate adapter and transform the results
    return ResultsAdapterFactory.adaptResults(assessmentType, rawResults, getResponse);
  };

  const generateResults = async () => {
    try {
      setIsLoading(true);
      console.log('Starting results calculation for assessment type:', assessmentType);
      
      // Calculate scores and generate recommendations
      console.log('Calling calculateResults...');
      const calculatedResults = await calculateResults();
      console.log('Raw calculation results:', calculatedResults ? 'Results received' : 'No results');
      
      if (!calculatedResults) {
        throw new Error('Calculation returned no results');
      }
      
      // Transform the results format to match what ResultsView expects using the adapter pattern
      console.log(`Using ${assessmentType} adapter to format results`);
      const adaptedResults = adaptResultsFormat(calculatedResults);
      console.log('Adapted results for view:', adaptedResults ? 'Successfully adapted' : 'Adaptation failed');
      
      if (!adaptedResults) {
        throw new Error('Failed to adapt results format');
      }
      
      setResults(adaptedResults);
      setIsLoading(false);
      console.log('Results dashboard data set successfully');
    } catch (err) {
      console.error('Error generating results:', err);
      console.error('Error stack:', err.stack);
      setError(`Failed to generate results: ${err.message}. Check console for details.`);
      setIsLoading(false);
    }
  };

  const handleBookConsultation = () => {
    console.log('Book consultation clicked');
    // Implement booking functionality or redirect to booking page
    const bookingUrl = results?.call_to_action?.booking_url || 'https://calendly.com/your-booking-link';
    window.open(bookingUrl, '_blank');
  };

  const handleDownloadReport = () => {
    console.log('Download report clicked');
    // Implementation for downloading PDF report would go here
    alert('Report download functionality will be implemented in the next phase.');
  };

  // Function to download complete assessment data as JSON
  const handleDownloadRawData = () => {
    try {
      console.log('Downloading raw JSON data');
      
      // Get full assessment data including responses
      const fullData = getFullAssessmentData();
      
      // Create a JSON blob and generate download link
      const jsonData = JSON.stringify(fullData, null, 2);
      const blob = new Blob([jsonData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create temporary link element and trigger download
      const link = document.createElement('a');
      link.href = url;
      link.download = `assessment-${assessmentType}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('Download initiated');
    } catch (err) {
      console.error('Error downloading data:', err);
      alert(`Failed to download data: ${err.message}`);
    }
  };

  // Helper function to get all data from the assessment engine
  const getFullAssessmentData = () => {
    try {
      // Combine results with full response data
      const assessmentData = {
        assessmentType,
        timestamp: new Date().toISOString(),
        results,
        metadata: getContext ? getContext() : {},
        // Include any additional data needed for complete export
      };
      
      console.log('Prepared full assessment data for export:', assessmentData);
      return assessmentData;
    } catch (err) {
      console.error('Error preparing assessment data:', err);
      return {
        error: err.message,
        results: results || {}
      };
    }
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingAnimation}>
          <div className={styles.spinner} />
          <h2>Analyzing your responses...</h2>
          <p>This may take a moment as we process your assessment data.</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <h2>Error Generating Results</h2>
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
    console.log('ResultsDashboard: Using custom ResultsView component:', ResultsView.name || 'Anonymous Component');
    
    return (
      <div className={styles.resultsContainer}>
        <ResultsView 
          results={results} 
          onRestart={onRestart}
          onBookConsultation={handleBookConsultation}
          onDownloadReport={handleDownloadReport}
          onDownloadRawData={handleDownloadRawData}
        />
        
        <div className={styles.ctaSection}>
          <div className={styles.ctaButtons}>
            <button onClick={handleDownloadRawData} className={styles.secondaryCTA} style={{backgroundColor: '#444'}}>
              Download Raw JSON Data
            </button>
            {onRestart && (
              <button onClick={onRestart} className={styles.secondaryCTA}>
                Start Over
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default results view
  // Extract scores, report, and recommendations, ensuring we handle any missing properties
  const { scores = {}, report = {}, insights = [] } = results || {};
  const recommendations = report?.recommendations || insights || [];

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
                fill="none"
                stroke="#e6e6e6"
                strokeWidth="12"
              />
              <circle
                cx="100"
                cy="100"
                r="90"
                fill="none"
                stroke="#4CAF50"
                strokeWidth="12"
                strokeDasharray={`${((scores.overall || 0) / 100) * 565.48} 565.48`}
                strokeDashoffset="0"
                transform="rotate(-90 100 100)"
              />
            </svg>
            <div className={styles.scoreContent}>
              <span className={styles.scoreNumber}>{scores.overall || 0}</span>
              <span className={styles.scoreLabel}>Overall Score</span>
            </div>
          </div>
        </div>
        
        <div className={styles.headlineSection}>
          <h1>{report?.executive?.headline || 'Your Assessment Results'}</h1>
          <p className={styles.subheadline}>
            {report?.executive?.subheadline || 'Based on your responses, here are your key metrics and recommendations.'}
          </p>
          
          <div className={styles.keyMetrics}>
            {report?.executive?.keyMetrics?.map((metric, i) => (
              <div key={i} className={styles.metricItem}>
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
          Executive Summary
        </button>
        <button
          className={`${styles.navButton} ${activeSection === 'recommendations' ? styles.active : ''}`}
          onClick={() => setActiveSection('recommendations')}
        >
          Recommendations
        </button>
        <button
          className={`${styles.navButton} ${activeSection === 'details' ? styles.active : ''}`}
          onClick={() => setActiveSection('details')}
        >
          Detailed Analysis
        </button>
        {report?.roadmap?.phases && (
          <button
            className={`${styles.navButton} ${activeSection === 'roadmap' ? styles.active : ''}`}
            onClick={() => setActiveSection('roadmap')}
          >
            Implementation Roadmap
          </button>
        )}
        {report?.valuation && (
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
            <h2>Executive Summary</h2>
            <p className={styles.executiveSummary}>
              {report?.executive?.summary || 'Your assessment provides a comprehensive view of your current capabilities and opportunities for improvement.'}
            </p>
            
            {report?.executive?.context && (
              <div className={styles.contextSection}>
                <h3>Assessment Context</h3>
                <p>{report.executive.context}</p>
              </div>
            )}
            
            {scores.dimensions && (
              <div className={styles.dimensionScores}>
                <h3>Dimension Scores</h3>
                <div className={styles.dimensionsGrid}>
                  {Object.entries(scores.dimensions).map(([key, value]) => (
                    <div key={key} className={styles.dimensionItem}>
                      <div className={styles.dimensionName}>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</div>
                      <div className={styles.dimensionScore}>
                        <div className={styles.progressBar}>
                          <div 
                            className={styles.progressFill} 
                            style={{width: `${value}%`, backgroundColor: value < 40 ? '#ff6b6b' : value < 70 ? '#feca57' : '#1dd1a1'}}
                          ></div>
                        </div>
                        <div className={styles.scoreValue}>{value}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {report?.executive?.strengths && (
              <div className={styles.strengthsWeaknesses}>
                <div className={styles.strengths}>
                  <h3>Key Strengths</h3>
                  <ul>
                    {report.executive.strengths.map((strength, i) => (
                      <li key={i}>{strength}</li>
                    ))}
                  </ul>
                </div>
                
                {report?.executive?.weaknesses && (
                  <div className={styles.weaknesses}>
                    <h3>Improvement Areas</h3>
                    <ul>
                      {report.executive.weaknesses.map((weakness, i) => (
                        <li key={i}>{weakness}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeSection === 'recommendations' && (
          <div className={styles.recommendationsSection}>
            <h2>Recommendations</h2>
            <p>Based on your assessment, here are our recommended actions:</p>
            
            <div className={styles.recommendationsList}>
              {recommendations.map((rec, i) => (
                <div key={i} className={styles.recommendationCard}>
                  <h3>{rec.title || `Recommendation ${i+1}`}</h3>
                  <p className={styles.recommendationDescription}>{rec.description}</p>
                  {rec.impact && (
                    <div className={styles.recommendationImpact}>
                      <span className={styles.impactLabel}>Impact:</span> 
                      <span className={styles.impactValue}>{rec.impact}</span>
                    </div>
                  )}
                  {rec.effort && (
                    <div className={styles.recommendationEffort}>
                      <span className={styles.effortLabel}>Effort:</span>
                      <span className={styles.effortValue}>{rec.effort}</span>
                    </div>
                  )}
                  {rec.steps && (
                    <div className={styles.implementationSteps}>
                      <h4>Implementation Steps:</h4>
                      <ol>
                        {rec.steps.map((step, j) => (
                          <li key={j}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSection === 'details' && (
          <div className={styles.detailsSection}>
            <h2>Detailed Analysis</h2>
            
            {scores.categories && (
              <div className={styles.categoryAnalysis}>
                <h3>Category Analysis</h3>
                {Object.entries(scores.categories).map(([category, data]) => (
                  <div key={category} className={styles.categoryCard}>
                    <h4>{category.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</h4>
                    <div className={styles.categoryScore}>
                      <div className={styles.progressBar}>
                        <div 
                          className={styles.progressFill} 
                          style={{width: `${data.score}%`, backgroundColor: data.score < 40 ? '#ff6b6b' : data.score < 70 ? '#feca57' : '#1dd1a1'}}
                        ></div>
                      </div>
                      <div className={styles.scoreValue}>{data.score}</div>
                    </div>
                    {data.insights && (
                      <div className={styles.categoryInsights}>
                        <p>{data.insights}</p>
                      </div>
                    )}
                    {data.items && (
                      <div className={styles.categoryItems}>
                        {Object.entries(data.items).map(([item, itemScore]) => (
                          <div key={item} className={styles.categoryItem}>
                            <div className={styles.itemName}>{item.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                            <div className={styles.itemScore}>
                              <div className={styles.progressBar}>
                                <div 
                                  className={styles.progressFill} 
                                  style={{width: `${itemScore}%`, backgroundColor: itemScore < 40 ? '#ff6b6b' : itemScore < 70 ? '#feca57' : '#1dd1a1'}}
                                ></div>
                              </div>
                              <div className={styles.scoreValue}>{itemScore}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
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

        {activeSection === 'valuation' && scores.categories && (
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
            <button onClick={handleDownloadRawData} className={styles.secondaryCTA} style={{marginTop: '10px', backgroundColor: '#444'}}>
              Download Raw JSON Data
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
