/**
 * Assessment Framework - Results Step
 * 
 * Implements the results display step for the agency assessment
 * Shows the valuation dashboard and recommendations
 */

import { StepBase } from '../../../core/step-base.js';
import { addEvent } from '../../../shared/utils/event-manager.js';
import { ValuationDashboard } from '../reporting/valuation-dashboard.js';
import { ServiceRecommendations } from '../recommendations/service-recommendations.js';

/**
 * ResultsStep class
 * Displays the assessment results, valuation metrics, and recommendations
 */
export class ResultsStep extends StepBase {
    /**
     * Constructor for results step
     * @param {AgencyAssessment} assessment - The parent assessment
     */
    constructor(assessment) {
        super(assessment);
        this.valuationDashboard = new ValuationDashboard();
        this.serviceRecommendations = ServiceRecommendations; // ServiceRecommendations is an object, not a class
        this.cleanupListeners = [];
    }
    
    /**
     * Render the results step
     * @return {String} - HTML content for the step
     */
    render() {
        const { state } = this.assessment;
        const results = state.results || {};
        
        // Get agency type for personalized message
        const agencyTypeName = this.assessment.getAgencyTypeName();
        const agencyTypeText = agencyTypeName ? ` for ${agencyTypeName}s` : '';
        
        // Get user name
        const userName = state.name ? state.name : 'your agency';
        
        // Generate dashboard components
        const dashboardHTML = this.generateDashboardHTML(results);
        
        return `
            <div class="assessment-step results-step">
                <h2>Your AI Vulnerability Assessment Results</h2>
                
                <div class="results-intro">
                    <p class="results-description">
                        Based on your responses, we've analyzed the AI vulnerability and valuation impact${agencyTypeText} for ${userName}.
                        Below you'll find your scores, valuation metrics, and recommended actions.
                    </p>
                    
                    ${this.generateSummaryScoreHTML(results)}
                </div>
                
                <div class="results-dashboard">
                    ${dashboardHTML}
                </div>
                
                <div class="results-actions">
                    <h3>Next Steps</h3>
                    <div class="action-buttons">
                        <button class="btn btn-primary" id="download-report-btn">Download PDF Report</button>
                        <button class="btn btn-secondary" id="restart-assessment-btn">Start New Assessment</button>
                    </div>
                </div>
            </div>
        `;
    }
    
    /**
     * Generate HTML for the summary score section
     * @param {Object} results - Assessment results data
     * @return {String} - HTML for the summary score
     */
    generateSummaryScoreHTML(results) {
        // Get the overall score from the proper location in the results object
        // This can come directly from results.overallScore or from mapped scores
        const overallScore = results.overallScore || results.scores?.overall || 0;
        
        console.log('[ResultsStep] Displaying summary score:', overallScore);
        
        // Determine score category and message
        let scoreCategory, scoreMessage;
        
        if (overallScore >= 80) {
            scoreCategory = 'excellent';
            scoreMessage = 'Your agency is well-positioned to adapt to AI disruption.';
        } else if (overallScore >= 60) {
            scoreCategory = 'good';
            scoreMessage = 'Your agency has a solid foundation but has areas to improve.';
        } else if (overallScore >= 40) {
            scoreCategory = 'fair';
            scoreMessage = 'Your agency has significant vulnerabilities that should be addressed.';
        } else {
            scoreCategory = 'critical';
            scoreMessage = 'Your agency faces critical AI disruption risks that require immediate attention.';
        }
        
        return `
            <div class="summary-score">
                <div class="score-display ${scoreCategory}">
                    <span class="score-value">${Math.round(overallScore)}</span>
                    <span class="score-label">Overall Score</span>
                </div>
                <div class="score-message">
                    <p><strong>${scoreMessage}</strong></p>
                </div>
            </div>
        `;
    }
    
    /**
     * Generate HTML for the complete dashboard
     * @param {Object} results - Assessment results data
     * @return {String} - HTML for the complete dashboard
     */
    generateDashboardHTML(results) {
        console.log('[ResultsStep] Generating dashboard with results structure:', results);
        
        // Map the scoring engine result format to the format expected by the ValuationDashboard
        // The scoring engine returns: overallScore, dimensionScores, serviceScores, etc.
        // But the dashboard expects a slightly different structure
        const assessmentData = {
            // Map dimension scores to the format expected by the dashboard
            scores: {
                overall: results.overallScore || 0,
                operational: results.dimensionScores?.operational || 0,
                financial: results.dimensionScores?.financial || 0,
                ai: results.dimensionScores?.ai || 0,
                strategic: results.dimensionScores?.strategic || 0
            },
            // Service scores directly from the results
            serviceScores: results.serviceScores || {},
            // All dimension scores for additional metrics
            dimensionScores: results.dimensionScores || {},
            // Pass additional metrics that might be needed
            serviceVulnerability: results.dimensionScores?.serviceVulnerability || 0,
            serviceAdaptability: results.dimensionScores?.serviceAdaptability || 0,
            adjustedAiScore: results.dimensionScores?.adjustedAi || 0,
            vulnerabilityLevel: results.vulnerabilityLevel || '',
            insights: results.insights || [],
            
            // Additional assessment data
            revenue: this.assessment.state.revenue,
            selectedServices: this.assessment.state.selectedServices || [],
            serviceRevenue: this.assessment.state.serviceRevenue || {}
        };
        
        console.log('[ResultsStep] Mapped assessment data for dashboard:', assessmentData);
        
        // Generate dashboard with the properly mapped data
        const dashboardData = this.valuationDashboard.generateDashboard(assessmentData);
        
        // Use the complete dashboard HTML that already contains all formatted sections
        return `
            <div class="dashboard-container">
                ${dashboardData.html}
            </div>
        `;
    }
    
    /**
     * Set up event listeners for this step
     * @param {Element} container - The step container element
     */
    setupEventListeners(container) {
        // Download report button
        const downloadReportBtn = container.querySelector('#download-report-btn');
        if (downloadReportBtn) {
            const cleanup = addEvent(downloadReportBtn, 'click', this.handleDownloadReport.bind(this));
            this.cleanupListeners.push(cleanup);
        }
        
        // Restart assessment button
        const restartAssessmentBtn = container.querySelector('#restart-assessment-btn');
        if (restartAssessmentBtn) {
            const cleanup = addEvent(restartAssessmentBtn, 'click', this.handleRestartAssessment.bind(this));
            this.cleanupListeners.push(cleanup);
        }
        
        // Add event listeners for any interactive dashboard elements
        this.setupDashboardEventListeners(container);
    }
    
    /**
     * Set up event listeners specific to dashboard elements
     * @param {Element} container - The step container element
     */
    setupDashboardEventListeners(container) {
        // Initialize the financial calculator if present
        this.valuationDashboard.initializeCalculator(container);
        
        // Add any additional dashboard-specific event listeners here
    }
    
    /**
     * Clean up event listeners when leaving this step
     */
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
    
    /**
     * Handle download report button click
     * @param {Event} event - Click event
     */
    handleDownloadReport(event) {
        // Generate and download PDF report
        const results = this.assessment.state.results;
        if (!results) return;
        
        // Call export manager to generate PDF
        this.assessment.exportManager.exportToPDF(results);
    }
    
    /**
     * Handle restart assessment button click
     * @param {Event} event - Click event
     */
    handleRestartAssessment(event) {
        // Reset assessment state and navigate to first step
        this.assessment.resetAssessment();
    }
    
    /**
     * Actions to perform when entering this step
     */
    onEnter() {
        // Track that results were viewed
        if (this.assessment.analyticsTracker) {
            this.assessment.analyticsTracker.trackEvent('results_viewed', {
                agencyType: this.assessment.getAgencyTypeName(),
                score: this.assessment.state.results?.scores?.overall
            });
        }
        
        return true;
    }
    
    /**
     * Actions to perform when leaving this step
     */
    onExit() {
        // Clean up any event listeners
        this.cleanupEventListeners();
        return true;
    }
}

// Export default
export default ResultsStep;
