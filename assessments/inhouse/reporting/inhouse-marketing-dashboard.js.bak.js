/**
 * In-House Marketing Assessment - Dashboard
 * 
 * Provides visualization components for displaying assessment results
 * including dimension scores, industry comparisons, and recommendations.
 */

class InhouseMarketingDashboard {
    constructor(config) {
        this.config = config;
    }
    
    /**
     * Render the dashboard with assessment results
     * @param {Object} results - Assessment results
     * @return {string} - HTML for dashboard
     */
    render(results) {
        try {
            console.log('[InhouseMarketingDashboard] Rendering dashboard');
            
            if (!results) {
                return this.renderError();
            }
            
            return `
                <div class="inhouse-dashboard">
                    ${this.renderHeader(results)}
                    ${this.renderSummary(results)}
                    ${this.renderDetailedScores(results)}
                    ${this.renderRecommendations(results)}
                </div>
            `;
        } catch (error) {
            console.error('[InhouseMarketingDashboard] Error rendering dashboard:', error);
            return this.renderError();
        }
    }
    
    /**
     * Render dashboard header with title and overall score
     * @param {Object} results - Assessment results
     * @return {string} - HTML for header
     */
    renderHeader(results) {
        const scores = results.scores || {};
        const overallScore = Math.round(scores.overall || 0);
        const readinessCategory = this.getReadinessCategory(overallScore);
        
        return `
            <div class="dashboard-header">
                <div class="dashboard-title">
                    <h1>In-House Marketing AI Readiness</h1>
                    <p class="organization-name">${results.companyName || 'Your Organization'}</p>
                </div>
                <div class="overall-score-container">
                    <div class="score-circle ${readinessCategory.className}">
                        <span class="score-value">${overallScore}</span>
                        <span class="score-label">Overall</span>
                    </div>
                    <div class="readiness-category ${readinessCategory.className}">
                        ${readinessCategory.label}
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render summary section with key metrics
     * @param {Object} results - Assessment results
     * @return {string} - HTML for summary
     */
    renderSummary(results) {
        const scores = results.scores || {};
        const dimensions = scores.dimensions || {};
        const industryComparison = results.industryComparison || {};
        const selectedIndustry = this.getIndustryName(results.selectedIndustry);
        
        return `
            <div class="dashboard-summary">
                <div class="summary-section">
                    <h2>Dimension Scores</h2>
                    <div class="dimension-bars">
                        ${this.renderDimensionBar('People & Skills', dimensions.people_skills)}
                        ${this.renderDimensionBar('Process & Infrastructure', dimensions.process_infrastructure)}
                        ${this.renderDimensionBar('Strategy & Leadership', dimensions.strategy_leadership)}
                    </div>
                </div>
                
                <div class="summary-section">
                    <h2>Industry Comparison</h2>
                    <div class="industry-comparison">
                        <div class="comparison-chart">
                            <div class="chart-bar">
                                <div class="bar-label">Your Score</div>
                                <div class="bar-container">
                                    <div class="bar-fill your-score" style="height: ${scores.overall}%"></div>
                                </div>
                                <div class="bar-value">${Math.round(scores.overall || 0)}</div>
                            </div>
                            <div class="chart-bar">
                                <div class="bar-label">Industry Avg</div>
                                <div class="bar-container">
                                    <div class="bar-fill industry-avg" style="height: ${industryComparison.industryAverage || 0}%"></div>
                                </div>
                                <div class="bar-value">${industryComparison.industryAverage || 0}</div>
                            </div>
                            <div class="chart-bar">
                                <div class="bar-label">Top Quartile</div>
                                <div class="bar-container">
                                    <div class="bar-fill top-quartile" style="height: ${industryComparison.topQuartile || 0}%"></div>
                                </div>
                                <div class="bar-value">${industryComparison.topQuartile || 0}</div>
                            </div>
                        </div>
                        <p class="comparison-text">
                            Your team ranks in the <strong>${industryComparison.percentile}th percentile</strong> 
                            compared to other ${selectedIndustry} organizations.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render detailed scores section with activities
     * @param {Object} results - Assessment results
     * @return {string} - HTML for detailed scores
     */
    renderDetailedScores(results) {
        const activityScores = results.activities || {};
        const selectedActivities = results.selectedActivities || [];
        
        if (selectedActivities.length === 0) {
            return '';
        }
        
        let activitiesHtml = '';
        selectedActivities.forEach(activityId => {
            const activityData = activityScores[activityId] || { score: 0, readiness: 'minimal' };
            const activityName = this.getActivityName(activityId);
            const readinessClass = this.getReadinessClass(activityData.readiness);
            
            activitiesHtml += `
                <div class="activity-score-item">
                    <div class="activity-name">${activityName}</div>
                    <div class="activity-score-bar">
                        <div class="bar-container">
                            <div class="bar-fill ${readinessClass}" style="width: ${activityData.score}%"></div>
                        </div>
                    </div>
                    <div class="activity-score-value">${Math.round(activityData.score)}</div>
                    <div class="activity-readiness ${readinessClass}">${this.formatReadiness(activityData.readiness)}</div>
                </div>
            `;
        });
        
        return `
            <div class="detailed-scores">
                <h2>Marketing Activities AI Readiness</h2>
                <div class="activity-scores">
                    ${activitiesHtml}
                </div>
                <div class="readiness-legend">
                    <div class="legend-item minimal">Minimal</div>
                    <div class="legend-item basic">Basic</div>
                    <div class="legend-item moderate">Moderate</div>
                    <div class="legend-item proficient">Proficient</div>
                    <div class="legend-item advanced">Advanced</div>
                </div>
            </div>
        `;
    }
    
    /**
     * Render recommendations section
     * @param {Object} results - Assessment results
     * @return {string} - HTML for recommendations
     */
    renderRecommendations(results) {
        const recommendations = results.recommendations || {};
        const prioritizedRecs = recommendations.prioritizedRecommendations || [];
        
        if (prioritizedRecs.length === 0) {
            return `
                <div class="recommendations-section">
                    <h2>Recommendations</h2>
                    <p class="no-recommendations">No recommendations available at this time.</p>
                </div>
            `;
        }
        
        // Get top recommendations (max 6)
        const topRecs = prioritizedRecs.slice(0, 6);
        
        let recsHtml = '';
        topRecs.forEach(rec => {
            const priorityClass = `priority-${rec.priority}`;
            const sourceLabel = rec.sourceName || rec.source;
            
            recsHtml += `
                <div class="recommendation-card ${priorityClass}">
                    <div class="recommendation-header">
                        <span class="recommendation-priority">${this.formatPriority(rec.priority)}</span>
                        <span class="recommendation-source">${sourceLabel}</span>
                    </div>
                    <h3 class="recommendation-title">${rec.title}</h3>
                    <p class="recommendation-description">${rec.description}</p>
                </div>
            `;
        });
        
        return `
            <div class="recommendations-section">
                <h2>Top Recommendations</h2>
                <div class="recommendations-grid">
                    ${recsHtml}
                </div>
                <div class="view-all-container">
                    <button class="view-all-button">View All Recommendations</button>
                </div>
            </div>
        `;
    }
    
    /**
     * Render error message
     * @return {string} - HTML for error message
     */
    renderError() {
        return `
            <div class="dashboard-error">
                <h2>Error Loading Dashboard</h2>
                <p>We encountered an error while loading your assessment results. Please try again.</p>
            </div>
        `;
    }
    
    /**
     * Render a dimension score bar
     * @param {string} label - Dimension label
     * @param {number} score - Dimension score
     * @return {string} - HTML for dimension bar
     */
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
    
    /**
     * Get readiness category information
     * @param {number} score - Overall score
     * @return {Object} - Category information
     */
    getReadinessCategory(score) {
        if (score >= 85) {
            return {
                label: 'AI Leader',
                className: 'leader',
                description: 'Your marketing team is at the forefront of AI adoption'
            };
        } else if (score >= 70) {
            return {
                label: 'Advanced',
                className: 'advanced',
                description: 'Your marketing team has strong AI capabilities'
            };
        } else if (score >= 55) {
            return {
                label: 'Advancing',
                className: 'advancing',
                description: 'Your marketing team is making good progress in AI adoption'
            };
        } else if (score >= 40) {
            return {
                label: 'Developing',
                className: 'developing',
                description: 'Your marketing team is in the early stages of AI adoption'
            };
        } else {
            return {
                label: 'Beginning',
                className: 'beginning',
                description: 'Your marketing team is just starting its AI journey'
            };
        }
    }
    
    /**
     * Get CSS class for score category
     * @param {number} score - Score value
     * @return {string} - CSS class
     */
    getScoreCategoryClass(score) {
        if (score >= 85) return 'leader';
        if (score >= 70) return 'advanced';
        if (score >= 55) return 'advancing';
        if (score >= 40) return 'developing';
        return 'beginning';
    }
    
    /**
     * Get CSS class for readiness level
     * @param {string} readiness - Readiness level
     * @return {string} - CSS class
     */
    getReadinessClass(readiness) {
        const classMap = {
            minimal: 'minimal',
            basic: 'basic',
            moderate: 'moderate',
            proficient: 'proficient',
            advanced: 'advanced'
        };
        
        return classMap[readiness] || 'minimal';
    }
    
    /**
     * Format readiness level for display
     * @param {string} readiness - Readiness level
     * @return {string} - Formatted readiness
     */
    formatReadiness(readiness) {
        const nameMap = {
            minimal: 'Minimal',
            basic: 'Basic',
            moderate: 'Moderate',
            proficient: 'Proficient',
            advanced: 'Advanced'
        };
        
        return nameMap[readiness] || readiness;
    }
    
    /**
     * Format priority for display
     * @param {string} priority - Priority level
     * @return {string} - Formatted priority
     */
    formatPriority(priority) {
        const nameMap = {
            high: 'High Priority',
            medium: 'Medium Priority',
            low: 'Long-Term'
        };
        
        return nameMap[priority] || priority;
    }
    
    /**
     * Get activity name from ID
     * @param {string} activityId - Activity ID
     * @return {string} - Activity name
     */
    getActivityName(activityId) {
        const activity = this.config.activities?.find(a => a.id === activityId);
        if (activity) return activity.name;
        
        const nameMap = {
            content_marketing: 'Content Marketing',
            social_media: 'Social Media',
            seo_sem: 'SEO/SEM',
            email_marketing: 'Email Marketing',
            analytics_data: 'Analytics & Data',
            paid_advertising: 'Paid Advertising',
            creative_design: 'Creative & Design',
            marketing_automation: 'Marketing Automation',
            pr_communications: 'PR & Communications',
            events_webinars: 'Events & Webinars'
        };
        
        return nameMap[activityId] || activityId;
    }
    
    /**
     * Get industry name from ID
     * @param {string} industryId - Industry ID
     * @return {string} - Industry name
     */
    getIndustryName(industryId) {
        const industry = this.config.industries?.find(i => i.id === industryId);
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
}

// Make the class available as a browser global
window.InhouseMarketingDashboard = InhouseMarketingDashboard;
