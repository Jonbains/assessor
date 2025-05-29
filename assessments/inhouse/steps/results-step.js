/**
 * In-House Marketing Assessment - Results Step
 * 
 * Displays comprehensive assessment results including:
 * - Overall AI readiness score
 * - Dimension scores (People & Skills, Process & Infrastructure, Strategy & Leadership)
 * - Industry comparison
 * - Activity-specific insights
 * - Recommendations and action plan
 * - ROI projections and Next Steps
 */

// StepBase will be accessed as a browser global

class ResultsStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        this.cleanupListeners = [];
        this.activeTab = 'overview'; // 'overview', 'dimensions', 'activities', 'recommendations'
    }
    
    onEnter() {
        // Make sure we have results
        if (!this.assessment.state.results) {
            const results = this.assessment.calculateResults();
            this.assessment.state.results = results;
        }
    }
    
    render() {
        const results = this.assessment.state.results;
        
        if (!results) {
            return `
                <div class="step-container error-container">
                    <h2>Error Loading Results</h2>
                    <p>We encountered an error while calculating your results. Please try again.</p>
                    <button id="restart-btn" class="btn btn-primary">Restart Assessment</button>
                </div>
            `;
        }
        
        return `
            <div class="step-container results-container">
                <div class="results-header">
                    <h1>In-House Marketing AI Readiness Assessment</h1>
                    <p class="results-subtitle">Results for ${this.assessment.state.companyName || 'Your Organization'}</p>
                </div>
                
                ${this.renderTabNavigation()}
                
                <div class="results-content">
                    ${this.renderActiveTabContent(results)}
                </div>
                
                <div class="results-actions">
                    <button id="download-results" class="btn btn-secondary">Download Results (PDF)</button>
                    <button id="download-json" class="btn btn-secondary">Download Report Data (JSON)</button>
                    <button id="restart-assessment" class="btn btn-primary">Start New Assessment</button>
                </div>
            </div>
        `;
    }
    
    renderTabNavigation() {
        return `
            <div class="results-tabs">
                <div class="tab ${this.activeTab === 'overview' ? 'active' : ''}" data-tab="overview">
                    <span class="tab-icon">📊</span>
                    <span class="tab-label">Overview</span>
                </div>
                <div class="tab ${this.activeTab === 'dimensions' ? 'active' : ''}" data-tab="dimensions">
                    <span class="tab-icon">🧩</span>
                    <span class="tab-label">Dimensions</span>
                </div>
                <div class="tab ${this.activeTab === 'activities' ? 'active' : ''}" data-tab="activities">
                    <span class="tab-icon">📋</span>
                    <span class="tab-label">Activities</span>
                </div>
                <div class="tab ${this.activeTab === 'recommendations' ? 'active' : ''}" data-tab="recommendations">
                    <span class="tab-icon">💡</span>
                    <span class="tab-label">Recommendations</span>
                </div>
            </div>
        `;
    }
    
    renderActiveTabContent(results) {
        switch (this.activeTab) {
            case 'overview':
                return this.renderOverviewTab(results);
            case 'dimensions':
                return this.renderDimensionsTab(results);
            case 'activities':
                return this.renderActivitiesTab(results);
            case 'recommendations':
                return this.renderRecommendationsTab(results);
            default:
                return this.renderOverviewTab(results);
        }
    }
    
    renderOverviewTab(results) {
        const overallScore = Math.round(results.scores?.overall || 0);
        const readinessCategory = this.getReadinessCategory(overallScore);
        const selectedIndustry = this.getSelectedIndustry();
        
        return `
            <div class="tab-content overview-tab">
                <div class="score-overview">
                    <div class="score-display ${readinessCategory.className}">
                        <div class="score-circle">
                            <span class="score-value">${overallScore}</span>
                            <span class="score-label">Overall Score</span>
                        </div>
                        <div class="readiness-category">
                            <h3>${readinessCategory.label}</h3>
                            <p>${readinessCategory.description}</p>
                        </div>
                    </div>
                    
                    <div class="dimension-scores">
                        <h3>Dimension Scores</h3>
                        ${this.renderDimensionBar('People & Skills', results.scores?.people_skills)}
                        ${this.renderDimensionBar('Process & Infrastructure', results.scores?.process_infrastructure)}
                        ${this.renderDimensionBar('Strategy & Leadership', results.scores?.strategy_leadership)}
                    </div>
                </div>
                
                <div class="industry-comparison">
                    <h3>Industry Comparison</h3>
                    ${this.renderIndustryComparison(results, selectedIndustry)}
                </div>
                
                <div class="key-insights">
                    <h3>Key Insights</h3>
                    <div class="insights-container">
                        ${this.renderKeyInsights(results)}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderDimensionsTab(results) {
        return `
            <div class="tab-content dimensions-tab">
                <h2>AI Readiness Dimensions</h2>
                <p>Detailed assessment of your organization's AI readiness across key dimensions.</p>
                
                <div class="dimension-container">
                    <div class="dimension-card people-skills">
                        <h3>People & Skills</h3>
                        <div class="dimension-score">
                            <span class="score-value">${Math.round(results.scores?.people_skills || 0)}</span>
                        </div>
                        ${this.renderDimensionDetails('people_skills', results)}
                    </div>
                    
                    <div class="dimension-card process-infrastructure">
                        <h3>Process & Infrastructure</h3>
                        <div class="dimension-score">
                            <span class="score-value">${Math.round(results.scores?.process_infrastructure || 0)}</span>
                        </div>
                        ${this.renderDimensionDetails('process_infrastructure', results)}
                    </div>
                    
                    <div class="dimension-card strategy-leadership">
                        <h3>Strategy & Leadership</h3>
                        <div class="dimension-score">
                            <span class="score-value">${Math.round(results.scores?.strategy_leadership || 0)}</span>
                        </div>
                        ${this.renderDimensionDetails('strategy_leadership', results)}
                    </div>
                </div>
            </div>
        `;
    }
    
    renderActivitiesTab(results) {
        const selectedActivities = results.selectedActivities || [];
        let activitiesHtml = '';
        
        selectedActivities.forEach(activityId => {
            const activity = this.getActivityById(activityId);
            if (activity) {
                activitiesHtml += `
                    <div class="activity-card">
                        <div class="activity-header">
                            <h3>${activity.name}</h3>
                            <span class="ai-readiness-score">${Math.round(results.activityScores?.[activityId] || 0)}</span>
                        </div>
                        <div class="activity-content">
                            <p><strong>AI Impact:</strong> ${activity.aiImpact || 'Moderate'}</p>
                            <p>${activity.description}</p>
                            ${this.renderActivityInsights(activityId, results)}
                        </div>
                    </div>
                `;
            }
        });
        
        return `
            <div class="tab-content activities-tab">
                <h2>Marketing Activities AI Readiness</h2>
                <p>Detailed assessment of your selected marketing activities and their AI potential.</p>
                <div class="activities-container">
                    ${activitiesHtml}
                </div>
            </div>
        `;
    }
    
    renderRecommendationsTab(results) {
        const recommendations = results.recommendations || {};
        const prioritizedRecommendations = recommendations.prioritizedRecommendations || [];
        
        if (prioritizedRecommendations.length === 0) {
            return `
                <div class="tab-content">
                    <div class="message-container">
                        <h2>No Recommendations Available</h2>
                        <p>We couldn't generate recommendations based on your assessment responses.</p>
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="tab-content recommendations-tab">
                <div class="recommendations-overview">
                    <h2>AI Readiness Recommendations</h2>
                    <p>Based on your assessment results, we've prioritized the following recommendations to improve your marketing team's AI readiness.</p>
                </div>
                
                <div class="recommendations-container">
                    <div class="recommendations-list">
                        <h3>Prioritized Recommendations</h3>
                        ${this.renderRecommendationsList(prioritizedRecommendations)}
                    </div>
                    
                    <div class="roi-projection">
                        <h3>ROI Projection</h3>
                        ${this.renderROIProjection(results)}
                    </div>
                </div>
                
                ${this.renderNextSteps(results)}
                
                <div class="recommendations-note">
                    <p><strong>Note:</strong> These recommendations are based on your assessment responses and industry benchmarks. Actual results may vary based on implementation quality, team adoption, and market conditions.</p>
                </div>
            </div>
        `;
    }
    
    renderRecommendationsList(recommendations) {
        if (!recommendations || !recommendations.length) {
            return `<p class="no-recommendations">No recommendations in this category.</p>`;
        }
        
        let html = '<ul class="recommendations-list">';
        recommendations.forEach(rec => {
            html += `
                <li class="recommendation-item">
                    <div class="recommendation-header">
                        <span class="recommendation-title">${rec.title || 'Recommendation'}</span>
                        ${rec.priority ? `<span class="priority ${rec.priority}">${rec.priority}</span>` : ''}
                    </div>
                    <p class="recommendation-description">${rec.description || ''}</p>
                    <div class="recommendation-meta">
                        <span class="timeline">${rec.timeline || 'Short-term'}</span>
                        <span class="complexity">${rec.complexity || 'Medium'}</span>
                    </div>
                </li>
            `;
        });
        html += '</ul>';
        return html;
    }
    
    renderROIProjection(results) {
        // Get ROI projections from recommendations config if available
        const recommendationsConfig = this.assessment.recommendationsEngine?.recommendationsConfig;
        const toolDatabase = recommendationsConfig?.toolDatabase || {};
        const implementationTimelines = recommendationsConfig?.implementationTimelines || {};
        
        const industry = this.getSelectedIndustry() || {};
        const companySize = this.assessment.state.companySize || 'mid_market';
        const overallScore = results.scores?.overall || 0;
        const selectedActivities = results.selectedActivities || [];
        
        // Size-based multipliers for ROI calculations
        const sizeMultipliers = {
            small: 0.7, // Smaller teams see less absolute savings but faster implementation
            mid_market: 1.0, // Base multiplier
            enterprise: 1.5 // Larger organizations see larger absolute savings
        };
        const multiplier = sizeMultipliers[companySize] || 1.0;
        
        // Industry-specific multipliers
        const industryMultipliers = {
            b2b_saas: 1.2, // Tech companies see higher efficiency gains
            manufacturing: 0.9, // Manufacturing sees more modest gains initially
            healthcare: 0.85, // Healthcare has compliance issues that slow ROI
            financial_services: 1.1, // Financial services see good returns
            ecommerce_retail: 1.15 // E-commerce sees strong returns
        };
        const industryMultiplier = industryMultipliers[industry.id] || 1.0;
        
        // Calculate activity-adjusted ROI metrics based on selected activities
        const activityROIFactors = {
            content_marketing: 1.4, // High AI impact
            social_media: 1.2,
            seo_sem: 1.1,
            email_marketing: 1.3,
            analytics_data: 1.5, // Highest AI impact
            paid_advertising: 1.2,
            creative_design: 0.9,
            marketing_automation: 1.3,
            pr_communications: 0.8,
            events_webinars: 0.7 // Lowest AI impact
        };
        
        // Calculate average ROI factor from selected activities
        let activityROIFactor = 1.0;
        if (selectedActivities.length > 0) {
            let sum = 0;
            selectedActivities.forEach(activity => {
                sum += activityROIFactors[activity] || 1.0;
            });
            activityROIFactor = sum / selectedActivities.length;
        }
        
        // Apply overall score as a readiness factor
        const readinessFactor = overallScore / 100; // 0-1 scale
        
        // Gather ROI metrics from tool database
        const activityROIs = [];
        const activityPaybacks = [];
        const activityTools = [];
        
        selectedActivities.forEach(activityId => {
            if (toolDatabase[activityId]) {
                activityROIs.push(toolDatabase[activityId].avgROI || '');
                activityPaybacks.push(toolDatabase[activityId].paybackPeriod || '');
                
                // Get top tool recommendation for each activity
                if (toolDatabase[activityId].tools && toolDatabase[activityId].tools.length > 0) {
                    activityTools.push({
                        activity: this.getActivityName(activityId),
                        tool: toolDatabase[activityId].tools[0].name,
                        roi: toolDatabase[activityId].tools[0].roiMetric
                    });
                }
            }
        });
        
        // Calculate adjusted efficiency gain percentages
        const minEfficiency = Math.round(15 * activityROIFactor * industryMultiplier);
        const maxEfficiency = Math.round(30 * activityROIFactor * industryMultiplier);
        const efficiencyGain = `${minEfficiency}-${maxEfficiency}%`;
        
        // Calculate team size based savings
        const teamSizes = {
            small: { hours: '200-500', savings: '$15K-35K' },
            mid_market: { hours: '500-1,200', savings: '$35K-80K' },
            enterprise: { hours: '1,200-3,000', savings: '$80K-250K' }
        };
        
        const annualHoursSaved = teamSizes[companySize]?.hours || '500-1,000';
        const baseSavings = teamSizes[companySize]?.savings || '$25K-75K';
        
        // Adjust savings by activity and industry factors
        const savingsMultiplier = activityROIFactor * industryMultiplier;
        const parsedSavings = baseSavings.match(/\$([0-9]+)K-([0-9]+)K/);
        
        let minSavings = 25;
        let maxSavings = 75;
        
        if (parsedSavings) {
            minSavings = Math.round(parseInt(parsedSavings[1]) * savingsMultiplier);
            maxSavings = Math.round(parseInt(parsedSavings[2]) * savingsMultiplier);
        }
        
        const annualSavings = `$${minSavings}K-${maxSavings}K`;
        
        // Determine implementation timeframe based on score
        let implementationTimeframe, investment, confidenceLevel;
        
        if (overallScore >= 70) {
            const transformationData = implementationTimelines?.transformation || {};
            implementationTimeframe = transformationData.description || 'Advanced AI capabilities';
            investment = transformationData.investment || '$100K-500K+';
            confidenceLevel = 'High';
        } else if (overallScore >= 50) {
            const foundationData = implementationTimelines?.foundationBuilding || {};
            implementationTimeframe = foundationData.description || 'Core infrastructure development';
            investment = transformationData.investment || '$25K-100K';
            confidenceLevel = 'Medium';
        } else {
            const quickWinsData = implementationTimelines?.quickWins || {};
            implementationTimeframe = quickWinsData.description || 'Immediate impact initiatives';
            investment = quickWinsData.investment || '$5K-20K';
            confidenceLevel = 'Moderate';
        }
        
        // Calculate potential revenue impact (more conservative for lower scores)
        const revenueImpactBase = readinessFactor > 0.7 ? '7-12%' : '3-7%';
        const revenueImpact = revenueImpactBase;
        
        // Calculate implementation timeline in months (shorter for higher scores due to better readiness)
        const implementationMonths = readinessFactor > 0.7 ? '3-6 months' : '6-12 months';
        
        // Generate list of top 3 tools for quick implementation
        const topTools = activityTools.slice(0, 3);
        let toolsHtml = '';
        
        if (topTools.length > 0) {
            toolsHtml = `
                <div class="recommended-tools">
                    <h3>Recommended AI Tools</h3>
                    <div class="tools-container">
                        ${topTools.map(tool => `
                            <div class="tool-card">
                                <div class="tool-name">${tool.tool};</div>
                                <div class="tool-activity">${tool.activity};</div>
                                <div class="tool-roi">${tool.roi};</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        
        return `
            <div class="roi-projection card">
                <h2>ROI Projections</h2>
                <p class="description">
                    Based on your assessment profile, here are the potential returns from implementing the recommended AI initiatives:
                </p>
                
                <div class="roi-metrics">
                    <div class="roi-metric">
                        <div class="metric-value">${efficiencyGain}</div>
                        <div class="metric-label">Efficiency Gain</div>
                    </div>
                    <div class="roi-metric">
                        <div class="metric-value">${annualSavings}</div>
                        <div class="metric-label">Annual Savings</div>
                    </div>
                    <div class="roi-metric">
                        <div class="metric-value">${investment}</div>
                        <div class="metric-label">Implementation Cost</div>
                    </div>
                </div>
                
                <div class="roi-metrics secondary-metrics">
                    <div class="roi-metric">
                        <div class="metric-value">${annualHoursSaved}</div>
                        <div class="metric-label">Est. Annual Hours Saved</div>
                    </div>
                    <div class="roi-metric">
                        <div class="metric-value">${revenueImpact}</div>
                        <div class="metric-label">Potential Revenue Impact</div>
                    </div>
                    <div class="roi-metric">
                        <div class="metric-value">${implementationMonths}</div>
                        <div class="metric-label">Implementation Timeline</div>
                    </div>
                </div>
                
                <div class="roi-details">
                    <div class="roi-detail-item">
                        <span class="detail-label">Implementation Approach:</span>
                        <span class="detail-value">${implementationTimeframe}</span>
                    </div>
                    <div class="roi-detail-item">
                        <span class="detail-label">Estimated Payback Period:</span>
                        <span class="detail-value">${avgPaybackPeriod || '6-9 months'}</span>
                    </div>
                    <div class="roi-detail-item">
                        <span class="detail-label">Confidence Level:</span>
                        <span class="detail-value ${confidenceLevel.toLowerCase()}">${confidenceLevel}</span>
                    </div>
                </div>
                
                ${toolsHtml}
                
                <div class="roi-explanation">
                    <h3>How to Interpret These Projections</h3>
                    <p>These ROI projections are based on your organization's industry (${this.getIndustryName(industry.id)}), 
                    company size (${this.formatCompanySize(companySize)}), and selected marketing activities. The estimates 
                    represent potential outcomes when implementing the AI tools and processes recommended in this assessment.</p>
                    
                    <p>Implementation costs include software licenses, training, and integration. Efficiency gains measure productivity 
                    improvements in your marketing processes. Revenue impact estimates potential business growth from improved 
                    marketing effectiveness.</p>
                </div>
            </div>
        `;
    }
    
    formatCompanySize(size) {
        const sizeMap = {
            small: 'Small (1-20 employees)',
            mid_market: 'Mid-Market (21-200 employees)',
            enterprise: 'Enterprise (201+ employees)'
        };
        return sizeMap[size] || size;
    }
    
    getIndustryName(industryId) {
        if (!industryId) return 'General Industry';
        
        const industry = this.assessment.config.industries?.find(i => i.id === industryId);
        if (industry) return industry.name;
        
        const nameMap = {
            b2b_saas: 'B2B SaaS',
            manufacturing: 'Manufacturing',
            healthcare: 'Healthcare',
            financial_services: 'Financial Services',
            ecommerce_retail: 'E-commerce/Retail'
        };
        
        return nameMap[industryId] || industryId;
    }
    
    renderNextSteps(results) {
        // Get top 3 prioritized recommendations
        const topRecommendations = results.recommendations?.prioritizedRecommendations?.slice(0, 3) || [];
        
        return `
            <div class="next-steps card">
                <h2>Your Next Steps</h2>
                <div class="quick-wins">
                    ${topRecommendations.map((rec, index) => `
                        <div class="recommendation-item">
                            <span class="number">${index + 1}</span>
                            <div class="content">
                                <h3>${rec.title}</h3>
                                <p>${rec.description}</p>
                                <div class="meta">
                                    <span class="timeline">${rec.timeline || 'Short-term'}</span>
                                    <span class="roi">${rec.expectedROI || 'Productivity improvement'}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="actions">
                    <button class="btn btn-primary" onclick="window.print()">Download Results</button>
                    <button class="btn btn-secondary" onclick="location.href='mailto:?subject=AI Readiness Assessment Results'">Share Results</button>
                </div>
            </div>
        `;
    }
    
    renderDimensionBar(label, score) {
        const scoreValue = Math.round(score || 0);
        const categoryClass = this.getScoreCategoryClass(scoreValue);
        
        return `
            <div class="dimension-bar">
                <div class="dimension-label">${label}</div>
                <div class="bar-container">
                    <div class="bar-fill ${categoryClass}" style="width: ${scoreValue}%"></div>
                </div>
                <div class="dimension-value">${scoreValue}</div>
            </div>
        `;
    }
    
    renderIndustryComparison(results, industry) {
        if (!industry) {
            return '<p>No industry selected for comparison</p>';
        }
        
        const score = Math.round(results.scores?.overall || 0);
        const avgScore = industry?.avgReadiness || 60;
        const topQuartile = industry?.topQuartile || 80;
        
        // Calculate percentile ranking
        let percentile = 0;
        if (score <= avgScore) {
            percentile = Math.round((score / avgScore) * 50);
        } else {
            percentile = 50 + Math.round(((score - avgScore) / (topQuartile - avgScore)) * 50);
        }
        percentile = Math.min(100, Math.max(0, percentile));
        
        // Set comparison rating text
        let comparisonRating = '';
        if (percentile >= 90) {
            comparisonRating = 'Industry Leader';
        } else if (percentile >= 75) {
            comparisonRating = 'Above Average';
        } else if (percentile >= 45) {
            comparisonRating = 'Average';
        } else if (percentile >= 25) {
            comparisonRating = 'Below Average';
        } else {
            comparisonRating = 'Trailing';
        }
        
        // Calculate dimension comparisons
        const dimensions = {
            people_skills: {
                yours: Math.round(results.scores?.dimensions?.people_skills || 0),
                avg: industry.avgDimensions?.people_skills || Math.round(avgScore * 0.9),
                top: industry.topDimensions?.people_skills || Math.round(topQuartile * 0.95)
            },
            process_infrastructure: {
                yours: Math.round(results.scores?.dimensions?.process_infrastructure || 0),
                avg: industry.avgDimensions?.process_infrastructure || Math.round(avgScore * 1.05),
                top: industry.topDimensions?.process_infrastructure || Math.round(topQuartile * 1.1)
            },
            strategy_leadership: {
                yours: Math.round(results.scores?.dimensions?.strategy_leadership || 0),
                avg: industry.avgDimensions?.strategy_leadership || Math.round(avgScore * 1.0),
                top: industry.topDimensions?.strategy_leadership || Math.round(topQuartile * 0.95)
            }
        };
        
        // Generate dimension comparison table
        let dimensionComparisonHtml = '';
        Object.entries(dimensions).forEach(([key, scores]) => {
            const formattedName = this.formatDimensionName(key);
            const diffFromAvg = scores.yours - scores.avg;
            const diffClass = diffFromAvg >= 0 ? 'positive' : 'negative';
            const diffText = diffFromAvg >= 0 ? '+' + diffFromAvg : diffFromAvg;
            
            dimensionComparisonHtml += '<tr>' +
                '<td>' + formattedName + '</td>' +
                '<td class="score-cell">' + scores.yours + '</td>' +
                '<td class="score-cell">' + scores.avg + '</td>' +
                '<td class="score-cell">' + scores.top + '</td>' +
                '<td class="diff-cell ' + diffClass + '">' + diffText + '</td>' +
                '</tr>';
        });
        
        return `
        <div class="industry-comparison-section">
            <h3>Industry Comparison</h3>
            <div class="comparison-summary">
                <div class="score-comparison">
                    <div class="your-score">
                        <span class="score-label">Your Score</span>
                        <span class="score-value">${score}</span>
                    </div>
                    <div class="avg-score">
                        <span class="score-label">Industry Average</span>
                        <span class="score-value">${avgScore}</span>
                    </div>
                    <div class="top-score">
                        <span class="score-label">Top Quartile</span>
                        <span class="score-value">${topQuartile}</span>
                    </div>
                </div>
                
                <div class="percentile-display">
                    <div class="percentile-label">Your percentile ranking: <strong>${percentile}%</strong></div>
                    <div class="comparison-rating">Status: <strong>${comparisonRating}</strong></div>
                </div>
            </div>
            
            <div class="dimension-comparison">
                <h4>Dimension Comparison</h4>
                <table class="comparison-table">
                    <thead>
                        <tr>
                            <th>Dimension</th>
                            <th>Your Score</th>
                            <th>Industry Avg</th>
                            <th>Top Quartile</th>
                            <th>Difference</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${dimensionComparisonHtml}
                    </tbody>
                </table>
            </div>
            
            <div class="actions">
                <button class="btn btn-primary" onclick="window.print()">Download Results</button>
                <button class="btn btn-secondary" onclick="location.href='mailto:?subject=AI Readiness Assessment Results'">Share Results</button>
            </div>
        </div>
    `;
}
    
renderDimensionBar(label, score) {
    const scoreValue = Math.round(score || 0);
    const categoryClass = this.getScoreCategoryClass(scoreValue);
    
    return `
        <div class="dimension-bar">
            <div class="dimension-label">${label}</div>
            <div class="bar-container">
                <div class="bar-fill ${categoryClass}" style="width: ${scoreValue}%"></div>
            </div>
            <div class="dimension-value">${scoreValue}</div>
        </div>
    `;
}
    
renderIndustryComparison(results, industry) {
    if (!industry) {
        return '<p>No industry selected for comparison</p>';
    }
    
    const score = Math.round(results.scores?.overall || 0);
    const avgScore = industry?.avgReadiness || 60;
    const topQuartile = industry?.topQuartile || 80;
    
    // Calculate percentile ranking
    let percentile = 0;
    if (score <= avgScore) {
        percentile = Math.round((score / avgScore) * 50);
    } else {
        percentile = 50 + Math.round(((score - avgScore) / (topQuartile - avgScore)) * 50);
    }
    percentile = Math.min(100, Math.max(0, percentile));
    
    // Set comparison rating text
    let comparisonRating = '';
    if (percentile >= 90) {
        comparisonRating = 'Industry Leader';
    } else if (percentile >= 75) {
        comparisonRating = 'Above Average';
    } else if (percentile >= 45) {
        comparisonRating = 'Average';
    } else if (percentile >= 25) {
        comparisonRating = 'Below Average';
    } else {
        comparisonRating = 'Trailing';
    }
    
    // Calculate dimension comparisons
    const dimensions = {
        people_skills: {
            yours: Math.round(results.scores?.dimensions?.people_skills || 0),
            avg: industry.avgDimensions?.people_skills || Math.round(avgScore * 0.9),
            top: industry.topDimensions?.people_skills || Math.round(topQuartile * 0.95)
        },
        process_infrastructure: {
            yours: Math.round(results.scores?.dimensions?.process_infrastructure || 0),
            avg: industry.avgDimensions?.process_infrastructure || Math.round(avgScore * 1.05),
            top: industry.topDimensions?.process_infrastructure || Math.round(topQuartile * 1.1)
        },
        strategy_leadership: {
            yours: Math.round(results.scores?.dimensions?.strategy_leadership || 0),
            avg: industry.avgDimensions?.strategy_leadership || Math.round(avgScore * 1.0),
            top: industry.topDimensions?.strategy_leadership || Math.round(topQuartile * 0.95)
        }
    };
    
    // Generate dimension comparison table
    let dimensionComparisonHtml = '';
    Object.entries(dimensions).forEach(([key, scores]) => {
        const formattedName = this.formatDimensionName(key);
        const diffFromAvg = scores.yours - scores.avg;
        const diffClass = diffFromAvg >= 0 ? 'positive' : 'negative';
        const diffText = diffFromAvg >= 0 ? '+' + diffFromAvg : diffFromAvg;
        
        dimensionComparisonHtml += '<tr>' +
            '<td>' + formattedName + '</td>' +
            '<td class="score-cell">' + scores.yours + '</td>' +
            '<td class="score-cell">' + scores.avg + '</td>' +
            '<td class="score-cell">' + scores.top + '</td>' +
            '<td class="diff-cell ' + diffClass + '">' + diffText + '</td>' +
            '</tr>';
    });
    
    // Get industry peers comparison
    const industryPeers = this.getIndustryPeers(industry.id, score) || [];
    let peersHtml = '';
    
    if (industryPeers.length > 0) {
        peersHtml = '<div class="industry-peers">' +
            '<h4>How You Compare to Similar Organizations</h4>' +
            '<div class="peers-container">';
            
        industryPeers.forEach(peer => {
            const peerDiff = peer.score - score;
            const peerClass = peerDiff > 0 ? 'ahead' : (peerDiff < 0 ? 'behind' : 'equal');
            const peerDiffText = peerDiff > 0 ? '+' + peerDiff : peerDiff;
            
            peersHtml += '<div class="peer-card ' + peerClass + '">' +
                '<div class="peer-name">' + peer.name + '</div>' +
                '<div class="peer-score">' + peer.score + '</div>' +
                '<div class="peer-diff">' + peerDiffText + '</div>' +
                '</div>';
        });
        
        peersHtml += '</div></div>';
    }
    
    return '<div class="industry-comparison-detail">' +
        '<div class="comparison-header">' +
            '<div class="comparison-rating ' + comparisonRating.toLowerCase().replace(' ', '-') + '">' +
                comparisonRating +
            '</div>' +
            '<div class="percentile-indicator">' +
                '<span class="percentile-value">' + percentile + '<sup>th</sup></span>' +
                '<span class="percentile-label">Percentile in ' + industry.name + '</span>' +
            '</div>' +
        '</div>' +
        
        '<div class="comparison-charts">' +
            '<div class="overall-comparison-chart">' +
                '<h4>Overall AI Readiness Comparison</h4>' +
                '<div class="chart-bars">' +
                    '<div class="chart-bar">' +
                        '<div class="bar-label">Your Score</div>' +
                        '<div class="bar-container">' +
                            '<div class="bar-fill your-score" style="height:' + score + '%;"></div>' +
                            '<div class="bar-value">' + score + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="chart-bar">' +
                        '<div class="bar-label">Industry Average</div>' +
                        '<div class="bar-container">' +
                            '<div class="bar-fill avg-score" style="height:' + avgScore + '%;"></div>' +
                            '<div class="bar-value">' + avgScore + '</div>' +
                        '</div>' +
                    '</div>' +
                    '<div class="chart-bar">' +
                        '<div class="bar-label">Top Quartile</div>' +
                        '<div class="bar-container">' +
                            '<div class="bar-fill top-score" style="height:' + topQuartile + '%;"></div>' +
                            '<div class="bar-value">' + topQuartile + '</div>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
            
            '<div class="dimension-comparison">' +
                '<h4>Dimension Comparison</h4>' +
                '<table class="dimension-table">' +
                    '<thead>' +
                        '<tr>' +
                            '<th>Dimension</th>' +
                            '<th>Your Score</th>' +
                            '<th>Industry Avg</th>' +
                            '<th>Top Quartile</th>' +
                            '<th>Difference</th>' +
                        '</tr>' +
                    '</thead>' +
                    '<tbody>' +
                        dimensionComparisonHtml +
                    '</tbody>' +
                '</table>' +
            '</div>' +
        '</div>' +
        '</div>' +
        peersHtml +
    '</div>';
}
    
formatDimensionName(dimension) {
    const nameMap = {
        people_skills: 'People & Skills',
        process_infrastructure: 'Process & Infrastructure',
        strategy_leadership: 'Strategy & Leadership'
    };
    
    return nameMap[dimension] || dimension;
}
    
    getIndustryPeers(industryId, score) {
        // This would ideally come from a database of anonymized benchmarks
        // For now, we'll generate some representative fictional peers
        const peersByIndustry = {
            b2b_saas: [
                { name: 'SaaS Growth Leader', score: 82 },
                { name: 'Enterprise Platform Co.', score: 76 },
                { name: 'Mid-Market SaaS', score: 65 },
                { name: 'Emerging SaaS Startup', score: 52 }
            ],
            manufacturing: [
                { name: 'Advanced Manufacturing Inc.', score: 68 },
                { name: 'Industrial Automation Co.', score: 58 },
                { name: 'Traditional Manufacturing', score: 42 },
                { name: 'Regional Manufacturer', score: 35 }
            ],
            healthcare: [
                { name: 'Digital Health Leader', score: 74 },
                { name: 'Health Tech Innovator', score: 65 },
                { name: 'Healthcare System', score: 52 },
                { name: 'Regional Provider', score: 38 }
            ],
            financial_services: [
                { name: 'FinTech Disruptor', score: 85 },
                { name: 'Digital Banking Leader', score: 78 },
                { name: 'Regional Bank', score: 65 },
                { name: 'Traditional Financial Co.', score: 55 }
            ],
            ecommerce_retail: [
                { name: 'Omnichannel Retail Leader', score: 80 },
                { name: 'Digital Native Brand', score: 72 },
                { name: 'Mid-Market Retailer', score: 58 },
                { name: 'Traditional Retail', score: 45 }
            ]
        };
        
        // Return peers for the selected industry, or default peers if industry not found
        return (peersByIndustry[industryId] || peersByIndustry.b2b_saas);
    }
    
    getIndustryInsights(industryId, results) {
        const score = results.scores?.overall || 0;
        const dimensions = results.scores?.dimensions || {};
        
        // Base insights
        const baseInsights = [
            `Your organization scores ${score < 50 ? 'below' : 'above'} the industry average.`,
            `Your ${this.getStrongestDimension(dimensions)} dimension is your strongest area.`,
            `Your ${this.getWeakestDimension(dimensions)} dimension has the most room for improvement.`
        ];
        
        // Industry-specific insights
        const industryInsights = {
            b2b_saas: [
                'SaaS companies with strong AI capabilities typically see 20-30% higher customer retention rates.',
                'Process automation is a key differentiator for top-performing SaaS companies.',
                'Leading SaaS companies invest 15-20% of marketing budget in AI technologies.'
            ],
            manufacturing: [
                'Manufacturing firms with advanced AI readiness report 15-25% higher operational efficiency.',
                'Predictive maintenance AI delivers 30-40% reduction in unplanned downtime for manufacturing leaders.',
                'Top quartile manufacturing companies prioritize process automation over creative AI applications.'
            ],
            healthcare: [
                'Healthcare organizations with strong AI governance see fewer regulatory compliance issues.',
                'Patient experience leaders leverage AI for personalized communications and scheduling.',
                'Data security capabilities are 3x more important in healthcare than other industries.'
            ],
            financial_services: [
                'Financial services firms with advanced AI capabilities report 2x better fraud detection.',
                'Customer service AI implementation correlates with 15-25% higher customer satisfaction.',
                'Top performing financial firms prioritize AI governance and compliance frameworks.'
            ],
            ecommerce_retail: [
                'E-commerce leaders using AI for personalization see 20-35% higher conversion rates.',
                'AI-powered inventory management reduces stockouts by 25-40% for top retailers.',
                'The gap between leaders and laggards is widening faster in retail than other industries.'
            ]
        };
        
        // Get industry-specific insights or use default
        const specificInsights = industryInsights[industryId] || industryInsights.b2b_saas;
        
        // Combine and return formatted insights
        const allInsights = [...baseInsights, ...specificInsights];
        return allInsights.map(insight => `<li>${insight}</li>`).join('');
    }
    
    getStrongestDimension(dimensions) {
        let strongest = 'people_skills';
        let highestScore = dimensions.people_skills || 0;
        
        if ((dimensions.process_infrastructure || 0) > highestScore) {
            strongest = 'process_infrastructure';
            highestScore = dimensions.process_infrastructure || 0;
        }
        
        if ((dimensions.strategy_leadership || 0) > highestScore) {
            strongest = 'strategy_leadership';
        }
        
        return this.formatDimensionName(strongest);
    }
    
    getWeakestDimension(dimensions) {
        let weakest = 'people_skills';
        let lowestScore = dimensions.people_skills || 100;
        
        if ((dimensions.process_infrastructure || 100) < lowestScore) {
            weakest = 'process_infrastructure';
            lowestScore = dimensions.process_infrastructure || 100;
        }
        
        if ((dimensions.strategy_leadership || 100) < lowestScore) {
            weakest = 'strategy_leadership';
        }
        
        return this.formatDimensionName(weakest);
    }
    
    renderKeyInsights(results) {
        // In a real implementation, this would come from the recommendations engine
        // For now, we'll provide placeholder insights
        const insights = [
            {
                dimension: 'people_skills',
                text: 'Your team shows strong prompt engineering skills but needs more formal AI training.'
            },
            {
                dimension: 'process_infrastructure',
                text: 'Your data infrastructure is below industry average, limiting AI effectiveness.'
            },
            {
                dimension: 'strategy_leadership',
                text: 'Leadership support for AI initiatives is strong, creating good potential for growth.'
            }
        ];
        
        let insightsHtml = '';
        insights.forEach(insight => {
            insightsHtml += `
                <div class="insight-item ${insight.dimension}">
                    <span class="insight-icon">💡</span>
                    <span class="insight-text">${insight.text}</span>
                </div>
            `;
        });
        
        return insightsHtml;
    }
    
    renderDimensionDetails(dimension, results) {
        // In a real implementation, this would show strengths and weaknesses in each dimension
        // For now, we'll provide placeholder content
        const strengths = [
            'Team shows enthusiasm for adopting new AI tools',
            'Good baseline understanding of AI capabilities',
            'Leadership support for AI initiatives'
        ];
        
        const weaknesses = [
            'Limited formal AI training programs',
            'Inconsistent application of AI across team members',
            'Need for more structured knowledge sharing'
        ];
        
        return `
            <div class="dimension-details">
                <div class="strengths-section">
                    <h4>Strengths</h4>
                    <ul class="strengths-list">
                        ${strengths.map(s => `<li>${s}</li>`).join('')}
                    </ul>
                </div>
                <div class="weaknesses-section">
                    <h4>Areas for Improvement</h4>
                    <ul class="weaknesses-list">
                        ${weaknesses.map(w => `<li>${w}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
    }
    
    renderActivityInsights(activityId, results) {
        // Placeholder activity insights
        return `
            <div class="activity-insights">
                <h4>Key Insights</h4>
                <ul>
                    <li>AI automation potential: <strong>High</strong></li>
                    <li>Current utilization: <strong>Moderate</strong></li>
                    <li>Opportunity for improvement: <strong>Significant</strong></li>
                </ul>
            </div>
        `;
    }
    
    getReadinessCategory(score) {
        if (score >= 85) {
            return {
                label: 'AI Leader',
                className: 'leader',
                description: 'Your marketing team is at the forefront of AI adoption, with advanced capabilities across people, process, and strategy dimensions.'
            };
        } else if (score >= 70) {
            return {
                label: 'Advanced',
                className: 'advanced',
                description: 'Your marketing team has strong AI capabilities and is effectively leveraging AI across multiple functions.'
            };
        } else if (score >= 55) {
            return {
                label: 'Advancing',
                className: 'advancing',
                description: 'Your marketing team is making good progress in AI adoption but has several areas for improvement.'
            };
        } else if (score >= 40) {
            return {
                label: 'Developing',
                className: 'developing',
                description: 'Your marketing team is in the early stages of AI adoption with significant opportunities for growth.'
            };
        } else {
            return {
                label: 'Beginning',
                className: 'beginning',
                description: 'Your marketing team is just starting its AI journey with substantial room for capability development.'
            };
        }
    }
    
    getScoreCategoryClass(score) {
        if (score >= 85) return 'leader';
        if (score >= 70) return 'advanced';
        if (score >= 55) return 'advancing';
        if (score >= 40) return 'developing';
        return 'beginning';
    }
    
    getSelectedIndustry() {
        const industryId = this.assessment.state.selectedIndustry;
        return this.assessment.config.industries.find(i => i.id === industryId);
    }
    
    getActivityById(activityId) {
        return this.assessment.config.activities.find(a => a.id === activityId);
    }
    
    setupEventListeners(container) {
        // Clear previous listeners
        this.cleanupEventListeners();
        
        // Tab navigation
        const tabs = container.querySelectorAll('.tab');
        tabs.forEach(tab => {
            const listener = this.handleTabClick.bind(this);
            tab.addEventListener('click', listener);
            this.cleanupListeners.push(() => tab.removeEventListener('click', listener));
        });
        
        // PDF Download button
        const downloadButton = container.querySelector('#download-results');
        if (downloadButton) {
            const downloadListener = this.handleDownload.bind(this);
            downloadButton.addEventListener('click', downloadListener);
            this.cleanupListeners.push(() => downloadButton.removeEventListener('click', downloadListener));
        }
        
        // JSON Download button
        const jsonDownloadButton = container.querySelector('#download-json');
        if (jsonDownloadButton) {
            const jsonDownloadListener = this.handleJsonDownload.bind(this);
            jsonDownloadButton.addEventListener('click', jsonDownloadListener);
            this.cleanupListeners.push(() => jsonDownloadButton.removeEventListener('click', jsonDownloadListener));
        }
        
        // Restart button
        const restartButton = container.querySelector('#restart-assessment');
        if (restartButton) {
            const restartListener = this.handleRestart.bind(this);
            restartButton.addEventListener('click', restartListener);
            this.cleanupListeners.push(() => restartButton.removeEventListener('click', restartListener));
        }
    }
    
    handleTabClick(event) {
        const tabId = event.currentTarget.dataset.tab;
        
        if (tabId && tabId !== this.activeTab) {
            this.activeTab = tabId;
            this.assessment.renderCurrentStep();
        }
    }
    
    handleDownload() {
        // In a real implementation, this would generate and download a PDF
        alert('PDF download functionality will be implemented in a future update.');
    }
    
    handleJsonDownload() {
        const results = this.assessment.state.results;
        if (!results) {
            alert('No results available to download.');
            return;
        }
        
        // Create a report object with assessment data
        const reportData = {
            assessmentType: 'inhouse-marketing',
            companyName: this.assessment.state.companyName || 'Unknown',
            companySize: this.assessment.state.companySize || 'Unknown',
            industry: this.getSelectedIndustry()?.name || 'Unknown',
            date: new Date().toISOString(),
            overallScore: results.scores?.overall || 0,
            dimensionScores: results.scores?.dimensions || {},
            activityScores: results.scores?.activities || {},
            recommendations: results.recommendations || [],
            answers: this.assessment.state.answers || {}
        };
        
        // Convert to JSON string with pretty formatting
        const jsonData = JSON.stringify(reportData, null, 2);
        
        // Create a Blob with the JSON data
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // Create a download link and trigger it
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = `${reportData.companyName.replace(/\s+/g, '-').toLowerCase()}-assessment-report.json`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    
    handleRestart() {
        if (confirm('Are you sure you want to start a new assessment? Your current results will be saved.')) {
            // In a real implementation, this would properly reset the assessment
            // For now, we'll just reload the page
            window.location.reload();
        }
    }
    
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
}

// Make the class available as a browser global
window.ResultsStep = ResultsStep;
