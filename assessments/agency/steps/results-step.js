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
        const scores = results.scores || {};
        const overallScore = scores.overall || 0;
        
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
        // Get assessment data for the dashboard
        const assessmentData = {
            scores: results.scores || {},
            serviceScores: results.serviceScores || {},
            dimensionScores: results.dimensionScores || {},
            revenue: this.assessment.state.revenue,
            selectedServices: this.assessment.state.selectedServices || [],
            serviceRevenue: this.assessment.state.serviceRevenue || {}
        };
        
        // Generate dashboard sections using ValuationDashboard
        const dashboardData = this.valuationDashboard.generateDashboard(assessmentData);
        
        // Generate recommendations using ServiceRecommendations
        const recommendationsHTML = this.serviceRecommendations.generateRecommendationsHTML(
            assessmentData.selectedServices,
            assessmentData.scores,
            assessmentData.serviceScores
        );
        
        return `
            <div class="dashboard-container">
                <div class="dashboard-section">
                    <h3>Executive Summary</h3>
                    ${dashboardData.executiveSummaryHTML}
                </div>
                
                <div class="dashboard-section">
                    <h3>Valuation Impact</h3>
                    ${dashboardData.valuationBreakdownHTML}
                </div>
                
                <div class="dashboard-section">
                    <h3>Service Portfolio Analysis</h3>
                    ${dashboardData.servicePortfolioHTML}
                </div>
                
                <div class="dashboard-section">
                    <h3>Recommendations</h3>
                    ${recommendationsHTML}
                </div>
                
                <div class="dashboard-section">
                    <h3>Valuation Improvement Roadmap</h3>
                    ${dashboardData.valuationRoadmapHTML}
                </div>
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
