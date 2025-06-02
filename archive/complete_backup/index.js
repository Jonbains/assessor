/**
 * Assessment Framework - Main Entry Point
 * 
 * This is the main entry point for the modular assessment framework
 * It initializes assessments based on configuration and container elements
 */

import { AssessmentFactory } from './assessment-factory.js';

/**
 * Initialize assessments when the DOM is ready
 */
function initializeAssessments() {
    // Find all assessment containers
    const agencyContainers = document.querySelectorAll('.agency-assessment-wrapper');
    const inhouseContainers = document.querySelectorAll('.inhouse-assessment-wrapper');
    
    // Initialize agency assessments
    if (agencyContainers.length > 0 && typeof AgencyAssessmentConfig !== 'undefined') {
        const agencyConfig = JSON.parse(AgencyAssessmentConfig.config);
        
        agencyContainers.forEach(container => {
            try {
                const assessment = AssessmentFactory.createAssessment('agency', agencyConfig, container);
                assessment.init();
                console.log('[Assessment Framework] Agency assessment initialized');
            } catch (error) {
                console.error('[Assessment Framework] Error initializing agency assessment:', error);
            }
        });
    }
    
    // Initialize in-house assessments
    if (inhouseContainers.length > 0 && typeof InhouseAssessmentConfig !== 'undefined') {
        const inhouseConfig = JSON.parse(InhouseAssessmentConfig.config);
        
        inhouseContainers.forEach(container => {
            try {
                const assessment = AssessmentFactory.createAssessment('inhouse', inhouseConfig, container);
                assessment.init();
                console.log('[Assessment Framework] In-house assessment initialized');
            } catch (error) {
                console.error('[Assessment Framework] Error initializing in-house assessment:', error);
            }
        });
    }
}

/**
 * Load assessment configuration from the server
 * @param {String} type - Assessment type ('agency', 'inhouse', etc.)
 * @param {Function} callback - Callback function to execute with config
 */
function loadAssessmentConfig(type, callback) {
    fetch(`/assessment-config/${type}.json`)
        .then(response => response.json())
        .then(config => callback(config))
        .catch(error => {
            console.error(`[Assessment Framework] Error loading ${type} config:`, error);
        });
}

/**
 * Initialize an assessment with the given configuration
 * @param {String} type - Assessment type
 * @param {Object} config - Assessment configuration
 * @param {Element} container - DOM container element
 */
function initializeAssessment(type, config, container) {
    try {
        const assessment = AssessmentFactory.createAssessment(type, config, container);
        assessment.init();
        return assessment;
    } catch (error) {
        console.error(`[Assessment Framework] Error initializing ${type} assessment:`, error);
        return null;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAssessments);
} else {
    initializeAssessments();
}

// Export public API
export default {
    init: initializeAssessments,
    loadConfig: loadAssessmentConfig,
    createAssessment: initializeAssessment,
    factory: AssessmentFactory
};
