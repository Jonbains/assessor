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
        insights[0].description || "Teams that systematically adopt AI tools save 15+ hours per week per marketer" :
        "Teams that systematically adopt AI tools save 15+ hours per week per marketer";
      
      // Create comprehensive results object
      return {
        executiveSummary: {
          headline: `Your ${companySize === 'solo' ? 'Marketing Operation' : 'Marketing Team'} is ${readinessLevel.label}`,
          marketContext: `You're ahead of ${marketPosition.percentile}% of similar ${companySize} marketing teams in AI readiness`,
          criticalInsight: criticalInsight,
          bottomLine: `With a readiness score of ${overallScore}, your team has ${overallScore < 40 ? 'significant' : overallScore < 70 ? 'moderate' : 'excellent'} potential to leverage AI tools for increased productivity and impact`
        },
        marketPosition: {
          quartile: overallScore < 25 ? "Bottom Quartile" : overallScore < 50 ? "Third Quartile" : overallScore < 75 ? "Second Quartile" : "Top Quartile",
          message: readinessLevel.label,
          implication: `You're ${marketPosition.trend === 'lagging' ? 'likely to face increasing pressure to deliver more with the same resources' : 'positioned to increase output while reducing workload'}`,
          competitorActions: `Teams with similar profiles are ${marketPosition.trend === 'lagging' ? 'increasingly using AI to automate routine tasks' : 'expanding their service offerings while reducing costs'}`,
          timeToAct: readinessLevel.level === 'critical' ? "Urgent - start this week" : readinessLevel.level === 'low' ? "Important - begin this month" : "Strategic - implement over quarter"
        },
        quickWins: topActivities.map((activity, index) => {
          // Generate appropriate actions based on activity type
          const actions = {
            content_marketing: {
              title: "AI-Powered Content Creation",
              why: "Content creation is the easiest area to achieve immediate time savings",
              how: "Use Claude or ChatGPT to draft content, then edit for brand voice",
              specificAction: "Select one upcoming content piece and create it with AI assistance",
              expectedResult: "40-60% time reduction",
              marketContext: "78% of marketing teams start their AI journey with content",
              investment: "Free tools available"
            },
            social_media: {
              title: "Automate Social Media Content",
              why: "Repurposing content is time-intensive but necessary",
              how: "Use AI to transform blog posts into multiple social posts",
              specificAction: "Take your latest article and create 10 social posts with AI",
              expectedResult: "10x output in same time period",
              marketContext: "Teams using AI for social see 3x higher posting frequency",
              investment: "Free to $20/month"
            },
            analytics_data: {
              title: "Streamline Reporting & Insights",
              why: "Reporting is time-consuming but critical for proving value",
              how: "Automate data collection and insights generation",
              specificAction: "Set up an automated dashboard pulling from your marketing platforms",
              expectedResult: "2-4 hours saved weekly",
              marketContext: "Automated reporting correlates with 2x higher perceived value",
              investment: "$50-100/month"
            },
            email_marketing: {
              title: "AI-Enhanced Email Campaigns",
              why: "Email optimization requires constant testing and iteration",
              how: "Use AI for subject line generation and content personalization",
              specificAction: "Generate 10 subject line variants with AI for your next campaign",
              expectedResult: "20-40% open rate improvement",
              marketContext: "AI-optimized emails see 30% higher engagement rates",
              investment: "Free to $30/month"
            },
            creative_design: {
              title: "Automate Design Tasks",
              why: "Design bottlenecks often slow down marketing delivery",
              how: "Use AI design tools for initial concepts and variations",
              specificAction: "Test AI-generated images for your next social campaign",
              expectedResult: "3-5x more design options in half the time",
              marketContext: "Teams using AI for design report 60% faster production",
              investment: "$10-50/month"
            },
            paid_advertising: {
              title: "AI-Optimized Ad Copy",
              why: "Ad creative testing is time-intensive but essential",
              how: "Use AI to generate multiple ad variations based on top performers",
              specificAction: "Create 20 headline variations for your current campaign",
              expectedResult: "30% lower cost-per-acquisition",
              marketContext: "AI ad optimization improves ROAS by average of 27%",
              investment: "Mostly free tools to start"
            },
            seo_sem: {
              title: "AI-Powered SEO Enhancement",
              why: "SEO optimization requires constant content updates",
              how: "Use AI for keyword research and content optimization",
              specificAction: "Optimize your top 5 performing pages with AI recommendations",
              expectedResult: "20-30% organic traffic increase",
              marketContext: "AI-optimized content ranks 40% faster on average",
              investment: "$20-75/month"
            },
            marketing_automation: {
              title: "Enhanced Marketing Automation",
              why: "Workflow optimization can reclaim significant time",
              how: "Use AI to improve your automation triggers and personalization",
              specificAction: "Implement AI-driven segmentation in your next campaign",
              expectedResult: "2x conversion rate improvement",
              marketContext: "Advanced automation correlates with 3x higher ROI",
              investment: "Uses existing automation platform"
            }
          };
          
          // Return the appropriate action or a generic one if not found
          return actions[activity.id] || {
            title: `Optimize ${activity.name}`,
            why: `${activity.name} has high potential for AI enhancement`,
            how: "Implement AI tools specific to this marketing function",
            specificAction: `Identify the most time-consuming ${activity.name} task and test AI assistance`,
            expectedResult: `${Math.round(activity.timeSavings)}% time savings`,
            marketContext: `Teams are rapidly adopting AI for ${activity.name}`,
            investment: "Variable based on tools selected"
          };
        }),
        strategicRoadmap: {
          overview: `Your ${Math.round(overallScore / 10) * 10}-Day AI Implementation Plan`,
          phase1: {
            name: "Phase 1: Experimentation & Quick Wins",
            focus: `Focus on ${sizeContext.focus}`,
            actions: [
              ...(categoryScores.champions < 50 ? ["Identify your team's AI champion"] : []),
              `Test AI with ${topActivities[0]?.name || 'your highest priority marketing activity'}`,
              "Document time savings and quality impact",
              "Create simple templates for common AI prompts"
            ],
            expectedOutcome: `Proof of concept showing ${Math.round(savingsPotential.hours / 2)}-${savingsPotential.hours} hours saved weekly`
          },
          phase2: {
            name: "Phase 2: Process Development",
            focus: "Create scalable workflows and team training",
            actions: [
              ...(topActivities.slice(0, 2).map(a => `Develop AI workflow for ${a.name}`)),
              ...(categoryScores.resources < 50 ? ["Train team on basic AI prompting techniques"] : []),
              "Implement measurement system for tracking time savings"
            ],
            expectedOutcome: "Team-wide adoption with documented processes"
          },
          phase3: {
            name: "Phase 3: Integration & Expansion",
            focus: "Scale successful pilots across all activities",
            actions: [
              `Integrate AI tools with your existing ${marketPosition.trend === 'leading' ? 'tech stack' : 'workflow'}`,
              ...(topActivities.length > 2 ? [`Expand AI to ${topActivities[2].name}`] : []),
              "Develop optimization feedback loops",
              "Document ROI and share success stories"
            ],
            expectedOutcome: `${savingsPotential.hours}+ hours saved per team member weekly`
          },
          investmentGuide: `Initial investment: Free trials → ${companySize === 'solo' ? '$20-50' : companySize === 'small' ? '$50-100' : '$100-200'}/month per marketer`
        },
        expectedOutcomes: [
          // Dynamically generate outcomes based on selected activities
          ...topActivities.map(activity => {
            const outcomes = {
              content_marketing: {
                area: "Content Production",
                keyMetric: "Content pieces per marketer",
                baseline: "2-3 per week",
                target: "8-10 per week",
                timeframe: "90 days"
              },
              social_media: {
                area: "Social Media Engagement",
                keyMetric: "Posts and engagement rate",
                baseline: "3-5 posts weekly, 1-2% engagement",
                target: "10-15 posts weekly, 2-4% engagement",
                timeframe: "60 days"
              },
              analytics_data: {
                area: "Reporting Efficiency",
                keyMetric: "Hours spent on reporting",
                baseline: "5-8 hours weekly",
                target: "1-2 hours weekly",
                timeframe: "30 days"
              },
              email_marketing: {
                area: "Email Performance",
                keyMetric: "Open and click-through rates",
                baseline: "Industry average",
                target: "25-40% above industry average",
                timeframe: "45 days"
              },
              creative_design: {
                area: "Design Production",
                keyMetric: "Design assets per week",
                baseline: "5-10 assets",
                target: "20-30 assets",
                timeframe: "60 days"
              },
              paid_advertising: {
                area: "Ad Performance",
                keyMetric: "Cost per acquisition",
                baseline: "Current CPA",
                target: "25-30% reduction in CPA",
                timeframe: "45 days"
              },
              seo_sem: {
                area: "Organic Traffic",
                keyMetric: "Search visibility and traffic",
                baseline: "Current monthly visitors",
                target: "30-50% increase",
                timeframe: "90 days"
              },
              marketing_automation: {
                area: "Lead Nurturing",
                keyMetric: "Conversion rate",
                baseline: "Current pipeline conversion",
                target: "2x higher conversion rate",
                timeframe: "60 days"
              }
            };
            
            return outcomes[activity.id] || {
              area: activity.name,
              keyMetric: "Productivity and output",
              baseline: "Current level",
              target: `${Math.round(activity.timeSavings)}% time savings`,
              timeframe: "60-90 days"
            };
          }),
          // Always include team satisfaction
          {
            area: "Team Satisfaction",
            keyMetric: "Percentage of time on strategic work",
            baseline: "20-30%",
            target: "50-60%",
            timeframe: "90 days"
          }
        ],
        nextSteps: {
          primaryCTA: {
            title: readinessLevel.level === 'critical' || readinessLevel.level === 'low' ? 
              "Book Your Free AI Strategy Session" : 
              "Schedule Your AI Implementation Workshop",
            description: readinessLevel.level === 'critical' || readinessLevel.level === 'low' ? 
              "45-minute consultation to review your results and create your custom AI adoption roadmap" :
              "90-minute workshop to fast-track your AI implementation with expert guidance",
            link: "#book-consultation",
            buttonText: readinessLevel.level === 'critical' || readinessLevel.level === 'low' ? 
              "Book My Strategy Session" :
              "Schedule Implementation Workshop"
          },
          alternatives: [
            {
              text: "Download Full Report",
              link: "#download",
              description: "Get a PDF of your complete assessment results"
            },
            {
              text: companySize === 'solo' ? "Join Solo Marketer Community" : "Join Upcoming Webinar",
              link: "#webinar",
              description: companySize === 'solo' ? "Connect with other solo marketers adopting AI" : "Attend our 'AI for Marketing Teams' workshop"
            },
            {
              text: "Access AI Templates",
              link: "#templates",
              description: "Get our library of proven AI prompts for marketing"
            }
          ]
        },
        _rawData: rawResults
      };
    }
    
    // For inhouse-marketing assessment type
    if (assessmentType === 'inhouse-marketing') {
      // Extract key data points from raw results
      const overallScore = rawResults.overall || 0;
      const dimensionScores = rawResults.dimensions || {};
      const categoryScores = rawResults.categoryScores || {};
      const activityScores = rawResults.activityScores || {};
      const insights = rawResults.insights || [];
      const priorities = rawResults.priorities || [];
      const readinessLevel = rawResults.readinessLevel || {};
      const marketPosition = rawResults.marketPosition || {};
      const savingsPotential = rawResults.savingsPotential || {};
      const companySize = rawResults.companySize || 'small';
      const selectedActivities = rawResults.selectedActivities || [];
      const sector = rawResults.sector || 'other';
      
      // Get all response data using getResponse to ensure we have the complete context
      const allResponses = {};
      try {
        // Get all saved question responses
        const questionTypes = ['qualifying', 'service_selection', 'dynamic_questions'];
        questionTypes.forEach(type => {
          const savedData = getResponse(type);
          if (savedData) {
            Object.assign(allResponses, savedData);
          }
        });
        console.log('Retrieved all responses for context:', allResponses);
      } catch (error) {
        console.error('Error retrieving responses:', error);
      }
      
      // Create a comprehensive results object similar to agency-vulnerability format
      return {
        // Assessment metadata
        assessmentType: 'inhouse-marketing',
        timestamp: rawResults.timestamp || new Date().toISOString(),
        
        // Individual question responses
        responses: allResponses,
        
        // Context data
        context: {
          companySize: companySize,
          sector: sector,
          selectedActivities: selectedActivities
        },
        
        // Results data
        results: {
          overall: overallScore,
          dimensions: dimensionScores,
          categoryScores: categoryScores,
          activityScores: activityScores,
          insights: insights,
          priorities: priorities,
          readinessLevel: readinessLevel,
          marketPosition: marketPosition,
          savingsPotential: savingsPotential,
        },
        
        // Engine data for completeness
        engineData: {
          allResponses: allResponses,
          context: {
            companySize: companySize,
            sector: sector,
            selectedActivities: selectedActivities
          },
          progressData: {
            current: 5,
            total: 6,
            percentage: 80,
            stageName: 'results'
          },
          completionStatus: true
        },
        
  const handleBookConsultation = () => {
    console.log('Book consultation clicked');
    // Implement booking functionality or redirect to booking page
    const bookingUrl = results?.call_to_action?.booking_url || 'https://calendly.com/your-booking-link';
    window.open(bookingUrl, '_blank');
  };

  const handleBookConsultationWithTracking = () => {
    // Track conversion
    if (window.gtag) {
      window.gtag('event', 'consultation_click', {
        assessment_type: assessmentType,
        score: results?.scores?.overall || 0,
        category: results?.scores?.categories?.technology?.score > 50 ? 'high' : 'low',
      });
    }

    // Navigate to booking page with context
    const bookingUrl = `https://obsolete.com/quickmap?assessment=${assessmentType}&score=${results?.scores?.overall || 0}`;
    window.open(bookingUrl, '_blank');
  };

  const handleDownloadReport = async () => {
    // Track download
    if (window.gtag) {
      window.gtag('event', 'report_download', {
        assessment_type: assessmentType,
        score: results?.scores?.overall || 0
      });
    }
    
    // Generate and download PDF
    // This would typically call a cloud function or API
    alert('Report download functionality would be implemented here');
  };
  
  // Function to download complete assessment data as JSON
  const handleDownloadRawData = async () => {
    try {
      console.log('Preparing comprehensive assessment data download...');
      
      // Retrieve comprehensive data from localStorage first
      const savedProgress = localStorage.getItem('assessment_progress');
      let savedData = savedProgress ? JSON.parse(savedProgress) : {};
      
      // Create a complete dataset including all available data
      const comprehensiveData = {
        // Assessment metadata
        assessmentType,
        timestamp: new Date().toISOString(),
        
        // Individual question responses
        responses: savedData.responses || {},
        
        // Context data (sector, services, etc.)
        context: savedData.context || {},
        
        // Results data if available
        results: results || {},
        
        // Get full state using AssessmentEngine
        engineData: await getFullAssessmentData()
      };
      
      console.log('Comprehensive data prepared:', comprehensiveData);
      
      // Create a blob with the data
      const dataToDownload = JSON.stringify(comprehensiveData, null, 2);
      const blob = new Blob([dataToDownload], { type: 'application/json' });
      
      // Create a URL for the blob
      const url = URL.createObjectURL(blob);
      
      // Create a temporary anchor element to trigger download
      const a = document.createElement('a');
      a.href = url;
      a.download = `complete-assessment-data-${assessmentType}-${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);
      
      console.log('Downloaded complete assessment data');
    } catch (error) {
      console.error('Error downloading comprehensive data:', error);
      alert('Failed to download assessment data: ' + error.message);
    }
  };
  
  // Helper function to get all data from the assessment engine
  const getFullAssessmentData = async () => {
    try {
      // Create a temporary engine instance to access its methods
      const engine = new AssessmentEngine(assessmentType);
      await engine.initialize();
      
      // Load any saved progress
      await engine.loadProgress();
      
      return {
        allResponses: engine.getAllResponses(),
        context: engine.getContext(),
        progressData: engine.getProgress(),
        completionStatus: engine.isComplete()
      };
    } catch (error) {
      console.error('Error retrieving full assessment data:', error);
      return { error: error.message };
    }
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
    console.log('ResultsDashboard: Using custom ResultsView component:', ResultsView.name || 'Anonymous Component');
    console.log('ResultsDashboard: Passing results to ResultsView:', JSON.stringify(results, null, 2));
    
    // Verify all required sections exist in adapted results before rendering
    if (assessmentType === 'agency-vulnerability') {
      const { executive, readiness, opportunities, roadmap, impact, nextSteps } = results || {};
      console.log('Verifying agency-vulnerability required sections:', {
        hasExecutive: !!executive,
        hasReadiness: !!readiness,
        hasOpportunities: !!opportunities,
        hasRoadmap: !!roadmap,
        hasImpact: !!impact,
        hasNextSteps: !!nextSteps
      });
      
      // Additional validation of nested structures
      if (executive) {
        console.log('Executive section validation:', {
          hasHeadline: !!executive.headline,
          hasSubheadline: !!executive.subheadline,
          hasKeyMetrics: !!executive.keyMetrics,
          readinessScoreValue: executive.keyMetrics?.readinessScore?.value
        });
      }
    }
    
    return <ResultsView results={results} onBookConsultation={handleBookConsultation} />;
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
        {scores.categories && (
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