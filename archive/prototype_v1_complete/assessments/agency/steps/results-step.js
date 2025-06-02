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
                        <button class="btn btn-primary" id="download-data-btn">Download Database</button>
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
            scoreMessage = 'Your agency has significant vulnerabilities that need addressing.';
        } else {
            scoreCategory = 'critical';
            scoreMessage = 'Your agency faces critical AI disruption risks requiring immediate action.';
        }
        
        // Format the score for display
        const formattedScore = Math.round(overallScore);
        
        // Generate the HTML for the score card
        return `
            <div class="summary-score ${scoreCategory}">
                <div class="score-value">${formattedScore}</div>
                <div class="score-label">AI Readiness Score</div>
                <div class="score-message">${scoreMessage}</div>
            </div>
        `;
    }
    
    /**
     * Generate HTML for the complete dashboard
     * @param {Object} results - Assessment results data
     * @return {String} - HTML for the complete dashboard
     */
    generateDashboardHTML(results) {
        // Get valuation dashboard data
        const dashboardData = this.valuationDashboard.generateDashboard(
            results, 
            {
                theme: 'dark',
                showAllSections: true
            }
        );
        
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
        
        // Download database button
        const downloadDataBtn = container.querySelector('#download-data-btn');
        if (downloadDataBtn) {
            const cleanup = addEvent(downloadDataBtn, 'click', this.handleDownloadData.bind(this));
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
     */
    handleDownloadReport() {
        console.log('[ResultsStep] Generating PDF report');
        
        const results = this.assessment.state.results;
        if (!results) {
            console.error('[ResultsStep] No results to generate PDF report');
            alert('No assessment results available to generate a report.');
            return;
        }
        
        // Use the export manager if available, otherwise show a message
        if (this.assessment.exportManager) {
            this.assessment.exportManager.exportToPDF(results);
        } else {
            console.error('[ResultsStep] Export manager not available');
            alert('PDF export functionality is not available.');
        }
    }
    
    /**
     * Handle download database button click
     */
    handleDownloadData() {
        console.log('[ResultsStep] Downloading assessment data');
        
        // Create a downloadable JSON file of the entire assessment state
        const dataStr = JSON.stringify(this.assessment.state, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const agencyType = this.assessment.getAgencyTypeName() || 'agency';
        const fileName = `${agencyType.toLowerCase()}-assessment-data.json`;
        
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', dataUri);
        downloadLink.setAttribute('download', fileName);
        downloadLink.style.display = 'none';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
    
    /**
     * Handle restart assessment button click
     */
    handleRestartAssessment() {
        // Ask for confirmation
        if (confirm('Are you sure you want to start a new assessment? Your current data will be cleared.')) {
            this.assessment.reset();
            this.assessment.startStep('intro');
        }
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
