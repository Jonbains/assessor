/**
 * In-House Marketing Assessment - Enhanced Dashboard
 * 
 * Generates a compelling, business-focused report that drives conversions
 * for Obsolete's AI consulting services.
 */

class InhouseMarketingDashboard {
    constructor(config) {
        this.config = config;
        
        // Business metric calculations based on industry and score
        this.industryMetrics = {
            b2b_saas: {
                avgTeamSize: 12,
                avgSalary: 65000,
                productivityMultiplier: 1.2,
                aiAdoptionCost: 0.15 // 15% of annual marketing budget
            },
            manufacturing: {
                avgTeamSize: 8,
                avgSalary: 55000,
                productivityMultiplier: 1.0,
                aiAdoptionCost: 0.12
            },
            healthcare: {
                avgTeamSize: 10,
                avgSalary: 60000,
                productivityMultiplier: 0.9,
                aiAdoptionCost: 0.18
            },
            financial_services: {
                avgTeamSize: 15,
                avgSalary: 70000,
                productivityMultiplier: 1.1,
                aiAdoptionCost: 0.20
            },
            ecommerce_retail: {
                avgTeamSize: 14,
                avgSalary: 58000,
                productivityMultiplier: 1.3,
                aiAdoptionCost: 0.14
            }
        };
    }
    
    /**
     * Render the enhanced dashboard with assessment results
     * @param {Object} results - Assessment results
     * @return {string} - HTML for dashboard
     */
    render(results) {
        try {
            console.log('[InhouseMarketingDashboard] Rendering enhanced dashboard', results);
            
            if (!results || !results.scores) {
                return this.renderError();
            }
            
            // Calculate all the business metrics
            const businessMetrics = this.calculateBusinessMetrics(results);
            const competitivePosition = this.getCompetitivePosition(results);
            const roadmap = this.generateRoadmap(results);
            const roiProjection = this.calculateROI(results, businessMetrics);
            
            return `
                <div class="inhouse-dashboard-enhanced">
                    ${this.renderStyles()}
                    ${this.renderHeroSection(results)}
                    ${this.renderExecutiveSummary(results, businessMetrics)}
                    ${this.renderCompetitivePosition(results, competitivePosition)}
                    ${this.renderDimensionAnalysis(results)}
                    ${this.renderActivityHeatmap(results)}
                    ${this.renderStrategicRoadmap(roadmap)}
                    ${this.renderROIProjection(roiProjection)}
                    ${this.renderCallToAction()}
                    ${this.renderFooter()}
                </div>
            `;
        } catch (error) {
            console.error('[InhouseMarketingDashboard] Error rendering dashboard:', error);
            return this.renderError();
        }
    }
    
    /**
     * Calculate business metrics based on assessment results
     */
    calculateBusinessMetrics(results) {
        const industry = results.industry || results.selectedIndustry || 'b2b_saas';
        const metrics = this.industryMetrics[industry] || this.industryMetrics.b2b_saas;
        const overallScore = results.scores?.overall || 0;
        
        // Calculate potential productivity gain based on score gap
        const maxScore = 100;
        const scoreGap = maxScore - overallScore;
        const productivityGain = Math.min(45, scoreGap * 0.6); // Max 45% gain
        
        // Calculate potential cost savings
        const teamCost = metrics.avgTeamSize * metrics.avgSalary;
        const potentialSavings = teamCost * (productivityGain / 100) * metrics.productivityMultiplier;
        
        // Calculate implementation timeline based on current readiness
        let implementationMonths;
        if (overallScore >= 70) implementationMonths = "3-6";
        else if (overallScore >= 50) implementationMonths = "6-9";
        else if (overallScore >= 30) implementationMonths = "9-12";
        else implementationMonths = "12-18";
        
        // Calculate expected ROI
        const investmentRequired = teamCost * metrics.aiAdoptionCost;
        const annualBenefit = potentialSavings + (teamCost * 0.15); // Additional value creation
        const roi = (annualBenefit / investmentRequired).toFixed(1);
        
        return {
            efficiencyPotential: Math.round(productivityGain + overallScore * 0.3),
            projectedSavings: this.formatCurrency(potentialSavings),
            implementationTime: implementationMonths + " months",
            expectedROI: roi + "x",
            productivityGain: Math.round(productivityGain)
        };
    }
    
    /**
     * Get competitive position data
     */
    getCompetitivePosition(results) {
        const comparison = results.industryComparison || {};
        const score = Math.round(results.scores?.overall || 0);
        
        return {
            yourScore: score,
            industryAverage: comparison.industryAverage || 60,
            topQuartile: comparison.topQuartile || 80,
            percentile: comparison.percentile || this.calculatePercentile(score)
        };
    }
    
    /**
     * Generate strategic roadmap based on recommendations
     */
    generateRoadmap(results) {
        const recommendations = results.recommendations?.prioritizedRecommendations || [];
        const overallScore = results.scores?.overall || 0;
        
        // Group recommendations by timeline
        const immediate = recommendations.filter(r => r.priority === 'high').slice(0, 4);
        const shortTerm = recommendations.filter(r => r.priority === 'medium').slice(0, 4);
        const longTerm = recommendations.filter(r => r.priority === 'low').slice(0, 4);
        
        return {
            phase1: {
                title: "Foundation & Quick Wins",
                timeline: "0-3 months",
                items: immediate.length > 0 ? immediate : this.getDefaultPhase1Items(overallScore)
            },
            phase2: {
                title: "Scale & Optimize",
                timeline: "3-6 months",
                items: shortTerm.length > 0 ? shortTerm : this.getDefaultPhase2Items(overallScore)
            },
            phase3: {
                title: "Transform & Lead",
                timeline: "6-9 months",
                items: longTerm.length > 0 ? longTerm : this.getDefaultPhase3Items(overallScore)
            }
        };
    }
    
    /**
     * Calculate ROI projection
     */
    calculateROI(results, businessMetrics) {
        const industry = results.industry || 'b2b_saas';
        const metrics = this.industryMetrics[industry] || this.industryMetrics.b2b_saas;
        
        // Base calculations on team size and potential improvements
        const teamCost = metrics.avgTeamSize * metrics.avgSalary;
        const productivityIncrease = businessMetrics.productivityGain + "%";
        const firstYearSavings = this.formatCurrency(teamCost * (businessMetrics.productivityGain / 100) * 0.7);
        
        // Content output multiplier based on content marketing score
        const contentScore = results.activityScores?.content_marketing?.score || 50;
        const contentMultiplier = 1 + (contentScore / 100) + 0.5;
        
        // Campaign performance based on analytics and automation scores
        const analyticsScore = results.activityScores?.analytics_data?.score || 50;
        const automationScore = results.activityScores?.marketing_automation?.score || 50;
        const campaignLift = Math.round((analyticsScore + automationScore) / 4 + 20);
        
        return {
            productivityIncrease,
            firstYearSavings,
            contentOutput: contentMultiplier.toFixed(1) + "x",
            campaignPerformance: campaignLift + "%"
        };
    }
    
    /**
     * Render inline styles
     */
    renderStyles() {
        return `
            <style>
                .inhouse-dashboard-enhanced {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    color: #141414;
                    line-height: 1.6;
                    background: #fff;
                }
                
                .inhouse-dashboard-enhanced * {
                    box-sizing: border-box;
                }
                
                /* Hero Section */
                .dashboard-hero {
                    background: #141414;
                    color: #fff;
                    padding: 80px 40px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                }
                
                .dashboard-hero::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -20%;
                    width: 600px;
                    height: 600px;
                    background: #ffff66;
                    opacity: 0.1;
                    border-radius: 50%;
                }
                
                .hero-content {
                    position: relative;
                    z-index: 1;
                }
                
                .report-title {
                    font-size: 3rem;
                    font-weight: 300;
                    margin: 0 0 1rem 0;
                    letter-spacing: -1px;
                }
                
                .company-name {
                    font-size: 1.5rem;
                    color: #ffff66;
                    margin-bottom: 2rem;
                }
                
                .overall-score-display {
                    display: inline-block;
                    margin: 2rem 0;
                }
                
                .score-circle-large {
                    width: 200px;
                    height: 200px;
                    border: 8px solid #ffff66;
                    border-radius: 50%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto;
                }
                
                .score-value-large {
                    font-size: 4rem;
                    font-weight: 700;
                    color: #ffff66;
                    line-height: 1;
                }
                
                .score-label {
                    font-size: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    opacity: 0.8;
                    margin-top: 0.5rem;
                }
                
                .readiness-badge {
                    background: #ffff66;
                    color: #141414;
                    padding: 8px 24px;
                    border-radius: 30px;
                    font-weight: 600;
                    display: inline-block;
                    margin-top: 1rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 0.9rem;
                }
                
                /* Executive Summary */
                .executive-summary {
                    background: #f5f5f5;
                    padding: 60px 40px;
                }
                
                .section-title {
                    font-size: 2.5rem;
                    font-weight: 300;
                    margin: 0 0 2rem 0;
                    color: #141414;
                }
                
                .summary-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-bottom: 2rem;
                }
                
                .summary-card {
                    background: #fff;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    text-align: center;
                }
                
                .summary-metric {
                    font-size: 2.5rem;
                    font-weight: 700;
                    color: #141414;
                    margin-bottom: 0.5rem;
                }
                
                .summary-label {
                    color: #666;
                    font-size: 0.9rem;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }
                
                .key-insight {
                    background: #ffff66;
                    color: #141414;
                    padding: 2rem;
                    border-radius: 8px;
                    margin-top: 2rem;
                    font-size: 1.1rem;
                    line-height: 1.8;
                }
                
                /* Competitive Position */
                .competitive-position {
                    padding: 60px 40px;
                    background: #fff;
                }
                
                .position-chart {
                    display: flex;
                    justify-content: space-around;
                    align-items: flex-end;
                    height: 300px;
                    margin: 3rem 0;
                    position: relative;
                }
                
                .position-marker {
                    flex: 1;
                    max-width: 150px;
                    text-align: center;
                    position: relative;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                }
                
                .marker-bar {
                    background: #e0e0e0;
                    width: 100%;
                    border-radius: 4px 4px 0 0;
                    position: relative;
                    transition: all 0.3s ease;
                }
                
                .marker-bar.your-score {
                    background: #ffff66;
                }
                
                .marker-bar.industry-avg {
                    background: #666;
                }
                
                .marker-bar.top-quartile {
                    background: #44ff44;
                }
                
                .marker-value {
                    position: absolute;
                    top: -35px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-weight: 700;
                    font-size: 1.5rem;
                }
                
                .marker-label {
                    margin-top: 1rem;
                    font-size: 0.9rem;
                    color: #666;
                }
                
                .position-insight {
                    text-align: center;
                    color: #666;
                    margin-top: 2rem;
                    font-size: 1.1rem;
                }
                
                /* Dimension Analysis */
                .dimension-analysis {
                    padding: 60px 40px;
                    background: #f5f5f5;
                }
                
                .dimension-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                    gap: 2rem;
                    margin-top: 2rem;
                }
                
                .dimension-card {
                    background: #fff;
                    padding: 2rem;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                }
                
                .dimension-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 1.5rem;
                }
                
                .dimension-name {
                    font-size: 1.3rem;
                    font-weight: 600;
                }
                
                .dimension-score {
                    font-size: 2rem;
                    font-weight: 700;
                    color: #141414;
                }
                
                .score-bar {
                    height: 8px;
                    background: #e0e0e0;
                    border-radius: 4px;
                    overflow: hidden;
                    margin-bottom: 1rem;
                }
                
                .score-fill {
                    height: 100%;
                    background: #ffff66;
                    transition: width 0.5s ease;
                }
                
                .dimension-insight {
                    color: #666;
                    font-size: 0.95rem;
                    line-height: 1.6;
                }
                
                /* Activity Heatmap */
                .activity-heatmap {
                    padding: 60px 40px;
                    background: #fff;
                }
                
                .heatmap-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
                    gap: 1rem;
                    margin-top: 2rem;
                }
                
                .heatmap-cell {
                    padding: 1.5rem;
                    border-radius: 8px;
                    text-align: center;
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .heatmap-cell:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                }
                
                .heatmap-cell.minimal { background: #ffcccc; }
                .heatmap-cell.basic { background: #ffe0cc; }
                .heatmap-cell.moderate { background: #ffffcc; }
                .heatmap-cell.proficient { background: #e0ffcc; }
                .heatmap-cell.advanced { background: #ccffcc; }
                
                .activity-name {
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                    font-size: 0.95rem;
                }
                
                .activity-score-value {
                    font-size: 1.8rem;
                    font-weight: 700;
                    color: #141414;
                }
                
                .ai-impact {
                    font-size: 0.8rem;
                    color: #666;
                    margin-top: 0.5rem;
                }
                
                /* Roadmap */
                .roadmap-section {
                    padding: 60px 40px;
                    background: #f5f5f5;
                }
                
                .roadmap-timeline {
                    position: relative;
                    padding: 2rem 0;
                }
                
                .timeline-line {
                    position: absolute;
                    left: 50%;
                    top: 0;
                    bottom: 0;
                    width: 2px;
                    background: #ffff66;
                    transform: translateX(-50%);
                }
                
                .timeline-item {
                    display: flex;
                    align-items: center;
                    margin: 3rem 0;
                    position: relative;
                }
                
                .timeline-item:nth-child(even) {
                    flex-direction: row-reverse;
                }
                
                .timeline-content {
                    flex: 1;
                    padding: 2rem;
                    background: #fff;
                    border-radius: 8px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                    margin: 0 2rem;
                }
                
                .timeline-dot {
                    width: 20px;
                    height: 20px;
                    background: #ffff66;
                    border-radius: 50%;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    border: 4px solid #fff;
                    z-index: 1;
                }
                
                .timeline-phase {
                    font-size: 0.9rem;
                    color: #666;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 0.5rem;
                }
                
                .timeline-title {
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }
                
                .timeline-items {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }
                
                .timeline-items li {
                    padding: 0.5rem 0;
                    padding-left: 1.5rem;
                    position: relative;
                }
                
                .timeline-items li::before {
                    content: '→';
                    position: absolute;
                    left: 0;
                    color: #ffff66;
                    font-weight: 700;
                }
                
                /* ROI Projection */
                .roi-projection {
                    padding: 60px 40px;
                    background: #141414;
                    color: #fff;
                }
                
                .roi-projection .section-title {
                    color: #fff;
                }
                
                .roi-chart {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    margin-top: 2rem;
                }
                
                .roi-metric {
                    text-align: center;
                    padding: 2rem;
                    border: 2px solid #ffff66;
                    border-radius: 8px;
                }
                
                .roi-value {
                    font-size: 3rem;
                    font-weight: 700;
                    color: #ffff66;
                    margin-bottom: 0.5rem;
                }
                
                .roi-label {
                    font-size: 1.1rem;
                    opacity: 0.9;
                }
                
                /* CTA Section */
                .cta-section {
                    padding: 80px 40px;
                    background: #ffff66;
                    text-align: center;
                    color: #141414;
                }
                
                .cta-title {
                    font-size: 2.5rem;
                    font-weight: 300;
                    margin-bottom: 1.5rem;
                }
                
                .cta-subtitle {
                    font-size: 1.3rem;
                    margin-bottom: 3rem;
                    opacity: 0.9;
                }
                
                .cta-buttons {
                    display: flex;
                    gap: 1.5rem;
                    justify-content: center;
                    flex-wrap: wrap;
                }
                
                .cta-button {
                    padding: 1rem 2.5rem;
                    font-size: 1.1rem;
                    font-weight: 600;
                    text-decoration: none;
                    border-radius: 4px;
                    transition: all 0.3s ease;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    display: inline-block;
                }
                
                .cta-button.primary {
                    background: #141414;
                    color: #fff;
                }
                
                .cta-button.primary:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                }
                
                .cta-button.secondary {
                    background: transparent;
                    color: #141414;
                    border: 2px solid #141414;
                }
                
                .cta-button.secondary:hover {
                    background: #141414;
                    color: #ffff66;
                }
                
                /* Footer */
                .report-footer {
                    background: #141414;
                    color: #fff;
                    padding: 2rem;
                    text-align: center;
                }
                
                .footer-logo {
                    font-size: 1.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                }
                
                .footer-tagline {
                    opacity: 0.7;
                    margin-bottom: 1rem;
                }
                
                .footer-contact {
                    opacity: 0.9;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .report-title { font-size: 2rem; }
                    .section-title { font-size: 1.8rem; }
                    .timeline-item, .timeline-item:nth-child(even) { 
                        flex-direction: column; 
                    }
                    .timeline-line { left: 20px; }
                    .timeline-dot { left: 20px; }
                    .timeline-content { margin: 1rem 0 1rem 40px; }
                    .summary-grid, .roi-chart { 
                        grid-template-columns: 1fr; 
                    }
                    .position-chart {
                        flex-direction: column;
                        height: auto;
                        gap: 2rem;
                    }
                    .position-marker {
                        max-width: 100%;
                        height: 60px;
                    }
                    .marker-bar {
                        height: 100%;
                        width: 100%;
                    }
                }
            </style>
        `;
    }
    
    /**
     * Render hero section
     */
    renderHeroSection(results) {
        const overallScore = Math.round(results.scores?.overall || 0);
        const readinessCategory = this.getReadinessCategory(overallScore);
        const companyName = results.companyName || results.metadata?.companyName || 'Your Organisation';
        
        return `
            <section class="dashboard-hero">
                <div class="hero-content">
                    <h1 class="report-title">AI Marketing Readiness Report</h1>
                    <div class="company-name">${companyName}</div>
                    <div class="overall-score-display">
                        <div class="score-circle-large">
                            <span class="score-value-large">${overallScore}</span>
                            <span class="score-label">Overall Score</span>
                        </div>
                    </div>
                    <div class="readiness-badge">${readinessCategory.label}</div>
                </div>
            </section>
        `;
    }
    
    /**
     * Render executive summary section
     */
    renderExecutiveSummary(results, businessMetrics) {
        const overallScore = Math.round(results.scores?.overall || 0);
        const industry = this.getIndustryName(results.industry || results.selectedIndustry);
        
        // Generate key insight based on scores
        const insight = this.generateKeyInsight(results);
        
        return `
            <section class="executive-summary">
                <h2 class="section-title">Executive Summary</h2>
                <div class="summary-grid">
                    <div class="summary-card">
                        <div class="summary-metric">${businessMetrics.efficiencyPotential}%</div>
                        <div class="summary-label">Efficiency Potential</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-metric">${businessMetrics.projectedSavings}</div>
                        <div class="summary-label">Projected Annual Savings</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-metric">${businessMetrics.implementationTime}</div>
                        <div class="summary-label">Time to Full Implementation</div>
                    </div>
                    <div class="summary-card">
                        <div class="summary-metric">${businessMetrics.expectedROI}</div>
                        <div class="summary-label">Expected ROI</div>
                    </div>
                </div>
                <div class="key-insight">
                    <strong>Key Insight:</strong> ${insight}
                </div>
            </section>
        `;
    }
    
    /**
     * Render competitive position section
     */
    renderCompetitivePosition(results, position) {
        const industry = this.getIndustryName(results.industry || results.selectedIndustry);
        
        return `
            <section class="competitive-position">
                <h2 class="section-title">Your Competitive Position</h2>
                <div class="position-chart">
                    <div class="position-marker">
                        <div class="marker-bar your-score" style="height: ${position.yourScore}%;">
                            <div class="marker-value">${position.yourScore}</div>
                        </div>
                        <div class="marker-label">Your Score</div>
                    </div>
                    <div class="position-marker">
                        <div class="marker-bar industry-avg" style="height: ${position.industryAverage}%;">
                            <div class="marker-value">${position.industryAverage}</div>
                        </div>
                        <div class="marker-label">Industry Average</div>
                    </div>
                    <div class="position-marker">
                        <div class="marker-bar top-quartile" style="height: ${position.topQuartile}%;">
                            <div class="marker-value">${position.topQuartile}</div>
                        </div>
                        <div class="marker-label">Top Quartile</div>
                    </div>
                </div>
                <p class="position-insight">
                    You're outperforming <strong>${position.percentile}%</strong> of ${industry} organisations in AI readiness. 
                    ${this.getCompetitiveInsight(position)}
                </p>
            </section>
        `;
    }
    
    /**
     * Render dimension analysis section
     */
    renderDimensionAnalysis(results) {
        const dimensions = results.scores?.dimensions || {};
        
        return `
            <section class="dimension-analysis">
                <h2 class="section-title">Capability Analysis</h2>
                <div class="dimension-grid">
                    ${this.renderDimensionCard('People & Skills', dimensions.people_skills || 0, 
                        this.getDimensionInsight('people_skills', dimensions.people_skills || 0))}
                    ${this.renderDimensionCard('Process & Infrastructure', dimensions.process_infrastructure || 0,
                        this.getDimensionInsight('process_infrastructure', dimensions.process_infrastructure || 0))}
                    ${this.renderDimensionCard('Strategy & Leadership', dimensions.strategy_leadership || 0,
                        this.getDimensionInsight('strategy_leadership', dimensions.strategy_leadership || 0))}
                </div>
            </section>
        `;
    }
    
    /**
     * Render a single dimension card
     */
    renderDimensionCard(name, score, insight) {
        const roundedScore = Math.round(score);
        
        return `
            <div class="dimension-card">
                <div class="dimension-header">
                    <h3 class="dimension-name">${name}</h3>
                    <span class="dimension-score">${roundedScore}</span>
                </div>
                <div class="score-bar">
                    <div class="score-fill" style="width: ${roundedScore}%;"></div>
                </div>
                <p class="dimension-insight">${insight}</p>
            </div>
        `;
    }
    
    /**
     * Render activity heatmap section
     */
    renderActivityHeatmap(results) {
        const activities = results.activities || results.activityScores || {};
        const selectedActivities = results.selectedActivities || Object.keys(activities);
        
        if (selectedActivities.length === 0) {
            return '';
        }
        
        let heatmapCells = '';
        selectedActivities.forEach(activityId => {
            const activityData = activities[activityId] || { score: 0, readiness: 'minimal' };
            const score = Math.round(activityData.score || 0);
            const readiness = activityData.readiness || this.getActivityReadiness(score);
            const aiImpact = activityData.aiImpact || this.getActivityAIImpact(activityId);
            
            heatmapCells += `
                <div class="heatmap-cell ${readiness}">
                    <div class="activity-name">${this.getActivityName(activityId)}</div>
                    <div class="activity-score-value">${score}</div>
                    <div class="ai-impact">AI Impact: ${aiImpact}</div>
                </div>
            `;
        });
        
        return `
            <section class="activity-heatmap">
                <h2 class="section-title">Marketing Activity AI Readiness</h2>
                <div class="heatmap-grid">
                    ${heatmapCells}
                </div>
            </section>
        `;
    }
    
    /**
     * Render strategic roadmap section
     */
    renderStrategicRoadmap(roadmap) {
        return `
            <section class="roadmap-section">
                <h2 class="section-title">Your AI Transformation Roadmap</h2>
                <div class="roadmap-timeline">
                    <div class="timeline-line"></div>
                    
                    <div class="timeline-item">
                        <div class="timeline-content">
                            <div class="timeline-phase">Phase 1 (${roadmap.phase1.timeline})</div>
                            <h3 class="timeline-title">${roadmap.phase1.title}</h3>
                            <ul class="timeline-items">
                                ${roadmap.phase1.items.map(item => 
                                    `<li>${item.title || item.description || item}</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <div class="timeline-dot"></div>
                    </div>
                    
                    <div class="timeline-item">
                        <div class="timeline-content">
                            <div class="timeline-phase">Phase 2 (${roadmap.phase2.timeline})</div>
                            <h3 class="timeline-title">${roadmap.phase2.title}</h3>
                            <ul class="timeline-items">
                                ${roadmap.phase2.items.map(item => 
                                    `<li>${item.title || item.description || item}</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <div class="timeline-dot"></div>
                    </div>
                    
                    <div class="timeline-item">
                        <div class="timeline-content">
                            <div class="timeline-phase">Phase 3 (${roadmap.phase3.timeline})</div>
                            <h3 class="timeline-title">${roadmap.phase3.title}</h3>
                            <ul class="timeline-items">
                                ${roadmap.phase3.items.map(item => 
                                    `<li>${item.title || item.description || item}</li>`
                                ).join('')}
                            </ul>
                        </div>
                        <div class="timeline-dot"></div>
                    </div>
                </div>
            </section>
        `;
    }
    
    /**
     * Render ROI projection section
     */
    renderROIProjection(roi) {
        return `
            <section class="roi-projection">
                <h2 class="section-title">Expected Return on Investment</h2>
                <div class="roi-chart">
                    <div class="roi-metric">
                        <div class="roi-value">${roi.productivityIncrease}</div>
                        <div class="roi-label">Productivity Increase</div>
                    </div>
                    <div class="roi-metric">
                        <div class="roi-value">${roi.firstYearSavings}</div>
                        <div class="roi-label">Year 1 Cost Savings</div>
                    </div>
                    <div class="roi-metric">
                        <div class="roi-value">${roi.contentOutput}</div>
                        <div class="roi-label">Content Output</div>
                    </div>
                    <div class="roi-metric">
                        <div class="roi-value">${roi.campaignPerformance}</div>
                        <div class="roi-label">Campaign Performance Lift</div>
                    </div>
                </div>
            </section>
        `;
    }
    
    /**
     * Render call to action section
     */
    renderCallToAction() {
        return `
            <section class="cta-section">
                <h2 class="cta-title">Ready to Lead Your Industry in AI Marketing?</h2>
                <p class="cta-subtitle">Let Obsolete guide your transformation with our proven methodology and expertise</p>
                <div class="cta-buttons">
                    <a href="https://obsolete.com/contact" class="cta-button primary">Schedule Strategy Session</a>
                    <a href="#" class="cta-button secondary" onclick="window.print(); return false;">Download Full Report</a>
                </div>
            </section>
        `;
    }
    
    /**
     * Render footer
     */
    renderFooter() {
        return `
            <footer class="report-footer">
                <div class="footer-logo">Obsolete</div>
                <div class="footer-tagline">Work the Future</div>
                <div class="footer-contact">hello@obsolete.com</div>
            </footer>
        `;
    }
    
    /**
     * Generate key insight based on results
     */
    generateKeyInsight(results) {
        const overallScore = Math.round(results.scores?.overall || 0);
        const dimensions = results.scores?.dimensions || {};
        const activities = results.activityScores || {};
        
        // Find strongest and weakest dimensions
        const dimensionScores = Object.entries(dimensions).map(([key, value]) => ({
            dimension: key,
            score: value
        }));
        dimensionScores.sort((a, b) => b.score - a.score);
        
        const strongest = dimensionScores[0];
        const weakest = dimensionScores[dimensionScores.length - 1];
        
        // Find high-impact activities with low scores (opportunities)
        const opportunities = [];
        Object.entries(activities).forEach(([activity, data]) => {
            if (data.aiImpact === 'Very High' && data.score < 60) {
                opportunities.push(activity);
            }
        });
        
        // Generate personalized insight
        let insight = `Your marketing team shows ${this.getScoreDescriptor(overallScore)} potential for AI adoption`;
        
        if (opportunities.length > 0) {
            const oppNames = opportunities.slice(0, 2).map(o => this.getActivityName(o).toLowerCase());
            insight += `, particularly in ${oppNames.join(' and ')}`;
        }
        
        insight += `. With your current foundation, you're positioned to achieve ${
            overallScore < 50 ? '30-40%' : overallScore < 70 ? '25-35%' : '20-30%'
        } productivity gains within ${
            overallScore < 50 ? '9' : overallScore < 70 ? '6' : '3'
        } months through strategic AI implementation.`;
        
        if (weakest && weakest.score < 50) {
            insight += ` Your main opportunity lies in ${this.getDimensionFocus(weakest.dimension)}.`;
        }
        
        return insight;
    }
    
    /**
     * Generate competitive insight
     */
    getCompetitiveInsight(position) {
        const gap = position.topQuartile - position.yourScore;
        
        if (gap <= 10) {
            return "You're close to achieving top-quartile status. With focused improvements, you could reach this level within 3-6 months.";
        } else if (gap <= 25) {
            return "With targeted improvements, you could reach the top quartile within 6-9 months.";
        } else {
            return "There's significant opportunity to improve your competitive position through comprehensive AI adoption.";
        }
    }
    
    /**
     * Get dimension insight based on score
     */
    getDimensionInsight(dimension, score) {
        const insights = {
            people_skills: {
                low: "Your team needs structured AI training. Investing in upskilling could unlock significant productivity gains.",
                medium: "Your team shows good AI awareness but needs advanced training. Focus on specialized AI skills for key roles.",
                high: "Your team has strong AI capabilities. Consider becoming internal champions and training other departments."
            },
            process_infrastructure: {
                low: "Your infrastructure needs upgrading for AI readiness. Quick wins available through basic automation and data integration.",
                medium: "Strong data foundation with room for automation. Your martech stack is AI-ready but underutilized.",
                high: "Excellent infrastructure for AI. Focus on advanced automation and predictive analytics capabilities."
            },
            strategy_leadership: {
                low: "Leadership needs clearer AI vision. Developing a comprehensive AI strategy is critical for success.",
                medium: "Leadership is engaged but needs strategic clarity. A detailed AI roadmap could accelerate adoption.",
                high: "Strong strategic foundation. Consider becoming an AI-first marketing organisation."
            }
        };
        
        const level = score < 50 ? 'low' : score < 70 ? 'medium' : 'high';
        return insights[dimension]?.[level] || "Continue developing capabilities in this area.";
    }
    
    // Helper methods
    
    getReadinessCategory(score) {
        if (score >= 85) return { label: 'AI Leader', className: 'leader' };
        if (score >= 70) return { label: 'Advanced', className: 'advanced' };
        if (score >= 55) return { label: 'Advancing', className: 'advancing' };
        if (score >= 40) return { label: 'Developing', className: 'developing' };
        return { label: 'Beginning', className: 'beginning' };
    }
    
    getScoreDescriptor(score) {
        if (score >= 80) return 'exceptional';
        if (score >= 65) return 'strong';
        if (score >= 50) return 'good';
        if (score >= 35) return 'moderate';
        return 'emerging';
    }
    
    getDimensionFocus(dimension) {
        const focusMap = {
            people_skills: 'skills development and AI training',
            process_infrastructure: 'process automation and infrastructure optimization',
            strategy_leadership: 'strategic planning and leadership alignment'
        };
        return focusMap[dimension] || 'capability development';
    }
    
    getActivityName(activityId) {
        const activity = this.config?.activities?.find(a => a.id === activityId);
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
    
    getActivityReadiness(score) {
        if (score >= 85) return 'advanced';
        if (score >= 70) return 'proficient';
        if (score >= 50) return 'moderate';
        if (score >= 30) return 'basic';
        return 'minimal';
    }
    
    getActivityAIImpact(activityId) {
        const impactMap = {
            content_marketing: 'Very High',
            analytics_data: 'Very High',
            creative_design: 'Very High',
            social_media: 'High',
            seo_sem: 'High',
            email_marketing: 'High',
            paid_advertising: 'High',
            marketing_automation: 'High',
            pr_communications: 'Moderate',
            events_webinars: 'Moderate'
        };
        
        return impactMap[activityId] || 'Moderate';
    }
    
    getIndustryName(industryId) {
        const industry = this.config?.industries?.find(i => i.id === industryId);
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
    
    formatCurrency(amount) {
        if (amount >= 1000000) {
            return '£' + (amount / 1000000).toFixed(1) + 'M';
        } else if (amount >= 1000) {
            return '£' + Math.round(amount / 1000) + 'K';
        }
        return '£' + Math.round(amount);
    }
    
    calculatePercentile(score) {
        // Simple percentile calculation
        if (score >= 85) return 95;
        if (score >= 75) return 85;
        if (score >= 65) return 70;
        if (score >= 55) return 55;
        if (score >= 45) return 40;
        if (score >= 35) return 25;
        return 15;
    }
    
    // Default roadmap items for different phases
    getDefaultPhase1Items(score) {
        if (score < 50) {
            return [
                { title: "AI tool training for marketing team (30% productivity gain)" },
                { title: "Implement basic AI writing assistants" },
                { title: "Deploy AI-powered analytics tools" },
                { title: "Establish AI governance framework" }
            ];
        } else if (score < 70) {
            return [
                { title: "Advanced AI tool deployment across teams" },
                { title: "Integrate AI with existing martech stack" },
                { title: "Launch AI-powered content optimization" },
                { title: "Implement predictive analytics" }
            ];
        } else {
            return [
                { title: "Deploy advanced AI capabilities" },
                { title: "Launch AI center of excellence" },
                { title: "Implement real-time personalization" },
                { title: "Advanced automation deployment" }
            ];
        }
    }
    
    getDefaultPhase2Items(score) {
        if (score < 50) {
            return [
                { title: "Launch AI-driven email personalization" },
                { title: "Implement marketing automation with AI" },
                { title: "Deploy AI creative tools" },
                { title: "Expand AI training program" }
            ];
        } else if (score < 70) {
            return [
                { title: "Advanced personalization across channels" },
                { title: "AI-powered campaign optimization" },
                { title: "Predictive customer journey mapping" },
                { title: "Scale AI across all marketing functions" }
            ];
        } else {
            return [
                { title: "Launch hyper-personalization initiatives" },
                { title: "Implement AI-driven strategic planning" },
                { title: "Deploy advanced predictive models" },
                { title: "Lead industry AI initiatives" }
            ];
        }
    }
    
    getDefaultPhase3Items(score) {
        if (score < 50) {
            return [
                { title: "Full marketing automation with AI orchestration" },
                { title: "Advanced predictive analytics deployment" },
                { title: "AI-powered strategic planning" },
                { title: "Achieve industry benchmark status" }
            ];
        } else if (score < 70) {
            return [
                { title: "Become AI-first marketing organisation" },
                { title: "Launch innovative AI use cases" },
                { title: "Share best practices with industry" },
                { title: "Achieve top-quartile performance" }
            ];
        } else {
            return [
                { title: "Lead industry in AI innovation" },
                { title: "Develop proprietary AI capabilities" },
                { title: "Mentor other organisations" },
                { title: "Set new industry benchmarks" }
            ];
        }
    }
    
    renderError() {
        return `
            <div class="dashboard-error">
                <h2>Error Loading Report</h2>
                <p>We encountered an error while generating your assessment report. Please try again or contact support.</p>
            </div>
        `;
    }
}

// Make the class available as a browser global
window.InhouseMarketingDashboard = InhouseMarketingDashboard;