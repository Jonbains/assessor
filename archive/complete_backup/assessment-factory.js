/**
 * Assessment Framework - Assessment Factory
 * 
 * Factory class for creating assessment instances based on type
 */

// Import assessment types
import { AgencyAssessment } from './assessments/agency/agency-assessment.js';
import { InhouseAssessment } from './assessments/inhouse/inhouse-assessment.js';
// Consultant assessment will be added in the future

export class AssessmentFactory {
    /**
     * Registry of available assessment types
     */
    static assessmentTypes = {
        'agency': AgencyAssessment,
        'inhouse': InhouseAssessment,
        // 'consultant': ConsultantAssessment - future assessment type
    };
    
    /**
     * Create an assessment instance of the specified type
     * @param {String} type - Assessment type identifier
     * @param {Object} config - Assessment configuration
     * @param {Element} container - DOM container to render the assessment
     * @return {Object} - The created assessment instance
     */
    static createAssessment(type, config, container) {
        // Validate assessment type
        if (!this.assessmentTypes[type]) {
            console.error(`[AssessmentFactory] Unknown assessment type: ${type}`);
            throw new Error(`Unknown assessment type: ${type}`);
        }
        
        // Create the assessment instance
        const AssessmentClass = this.assessmentTypes[type];
        return new AssessmentClass(config, container);
    }
    
    /**
     * Register a new assessment type
     * @param {String} type - Assessment type identifier
     * @param {Class} assessmentClass - Assessment class constructor
     */
    static registerAssessmentType(type, assessmentClass) {
        this.assessmentTypes[type] = assessmentClass;
    }
    
    /**
     * Get available assessment types
     * @return {Array} - Array of available assessment type identifiers
     */
    static getAvailableTypes() {
        return Object.keys(this.assessmentTypes);
    }
    
    /**
     * Check if an assessment type is registered
     * @param {String} type - Assessment type to check
     * @return {Boolean} - True if the assessment type is registered
     */
    static hasAssessmentType(type) {
        return this.assessmentTypes.hasOwnProperty(type);
    }
}
