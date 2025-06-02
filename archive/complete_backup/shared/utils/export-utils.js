/**
 * Assessment Framework - Export Utilities
 * 
 * Provides utility functions for exporting assessment data in various formats
 * 
 * Note: All functions are exposed as globals on the window object for browser use
 * This follows the pattern used throughout the assessment framework
 */

// Create a namespace for export utilities
const ExportUtils = {};

/**
 * Export assessment data as JSON
 * @param {Object} assessmentData - The assessment data to export
 * @param {String} filename - Optional filename (without extension)
 * @return {void} - Triggers a download in the browser
 */
ExportUtils.downloadAsJson = function(assessmentData, filename = 'assessment-report') {
    if (!assessmentData) {
        console.error('[ExportUtils] No data provided for JSON export');
        return;
    }
    
    try {
        // Convert to JSON string with pretty formatting
        const jsonData = JSON.stringify(assessmentData, null, 2);
        
        // Create a Blob with the JSON data
        const blob = new Blob([jsonData], { type: 'application/json' });
        
        // Create a download link and trigger it
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        
        // Generate filename with sanitized company name if available
        if (assessmentData.companyName) {
            const sanitizedName = assessmentData.companyName.replace(/\s+/g, '-').toLowerCase();
            filename = `${sanitizedName}-assessment-report`;
        }
        
        downloadLink.download = `${filename}.json`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
        
        console.log('[ExportUtils] JSON export successful');
        return true;
    } catch (error) {
        console.error('[ExportUtils] Error exporting as JSON:', error);
        return false;
    }
}

/**
 * Prepare assessment data for export
 * @param {Object} assessment - The assessment state
 * @return {Object} - Formatted assessment data ready for export
 */
ExportUtils.prepareAssessmentData = function(assessmentState) {
    if (!assessmentState) {
        console.error('[ExportUtils] Invalid assessment state for export');
        return null;
    }
    
    const results = assessmentState.results || {};
    
    return {
        assessmentType: assessmentState.type || 'inhouse-marketing',
        date: new Date().toISOString(),
        companyName: assessmentState.companyName || 'Unknown',
        companySize: assessmentState.companySize || 'Unknown',
        industry: assessmentState.selectedIndustry || 'Unknown',
        overallScore: results.scores?.overall || 0,
        dimensionScores: results.dimensionScores || {},
        activityScores: results.activityScores || {},
        recommendations: results.recommendations || [],
        answers: assessmentState.answers || {}
    };
};

// Export the utilities using ES6 module syntax
export { ExportUtils };

// Log that the export utilities are exported as ES6 module
console.log('[ExportUtils] Export utilities exported as ES6 module');
