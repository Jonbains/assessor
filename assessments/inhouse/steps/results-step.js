/**
 * In-House Marketing Assessment - Results Step
 * 
 * Displays comprehensive assessment results by leveraging the InhouseMarketingDashboard component.
 * This step implements the modular architecture pattern by:
 * 1. Delegating visualization to the dashboard component
 * 2. Adding download functionality through the export utilities
 * 3. Maintaining a clean separation of concerns
 */

// StepBase will be accessed as a browser global

class ResultsStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        this.cleanupListeners = [];
    }
    
    onEnter() {
        super.onEnter();
        
        // If we don't have results yet, calculate them
        if (!this.assessment.state.results) {
            this.calculateResults();
        }
        
        console.log('[ResultsStep] Entering results step with assessment state:', this.assessment.state);
    }
    
    calculateResults() {
        // Use the assessment's scoring engine to calculate results
        const results = this.assessment.calculateResults();
        this.assessment.state.results = results;
        console.log('[ResultsStep] Calculated assessment results:', results);
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
        
        try {
            // Get the full dashboard content from the dashboard component
            // This uses the proper InhouseMarketingDashboard to generate the sophisticated report
            console.log('[ResultsStep] Rendering dashboard with results:', results);
            const dashboardContent = this.assessment.dashboard.render(results);
            
            // Wrap the dashboard in our container and add action buttons at the bottom
            return `
                <div class="step-container results-container">
                    ${dashboardContent}
                    
                    <div class="results-actions" style="margin-top: 30px; text-align: center;">
                        <button id="download-results" class="btn btn-secondary">Download Results (PDF)</button>
                        <button id="download-json" class="btn btn-secondary">Download Report Data (JSON)</button>
                        <button id="restart-assessment" class="btn btn-primary">Start New Assessment</button>
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('[ResultsStep] Error rendering dashboard:', error);
            
            // Show a simple error message
            return `
                <div class="step-container error-container">
                    <h2>Error Rendering Dashboard</h2>
                    <p>We encountered an error while rendering your results: ${error.message}</p>
                    <p>Please try refreshing the page or contact support if the issue persists.</p>
                    <button id="restart-assessment" class="btn btn-primary">Restart Assessment</button>
                </div>
            `;
        }
    }
    
    setupEventListeners(container) {
        // Clear previous listeners
        this.cleanupEventListeners();
        
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
    
    cleanupEventListeners() {
        // Remove all registered event listeners
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
    
    handleDownload() {
        // Delegate PDF generation to the dashboard
        console.log('[ResultsStep] Handling PDF download request');
        try {
            // We can delegate PDF generation to the dashboard in the future
            // For now, we'll just alert that this feature is coming soon
            alert('PDF download will be available in a future update!');
        } catch (error) {
            console.error('[ResultsStep] Error generating PDF:', error);
            alert('An error occurred while generating your PDF. Please try again later.');
        }
    }
    
    handleJsonDownload() {
        console.log('[ResultsStep] Handling JSON download request');
        try {
            // Use export utils to handle the JSON download
            // This delegates the export functionality to a dedicated utility module
            const exportData = window.ExportUtils.prepareAssessmentData(this.assessment.state);
            window.ExportUtils.downloadAsJson(exportData, 'assessment-results.json');
        } catch (error) {
            console.error('[ResultsStep] Error generating JSON export:', error);
            alert('An error occurred while generating your export. Please try again later.');
        }
    }
    
    handleRestart() {
        console.log('[ResultsStep] Handling assessment restart');
        if (confirm('Are you sure you want to start a new assessment? Your current results will be lost.')) {
            window.location.reload();
        }
    }
}

// Register the class as a global for browser access
window.ResultsStep = ResultsStep;
