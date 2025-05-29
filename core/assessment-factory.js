/**
 * Assessment Framework - Assessment Factory
 * 
 * Factory for creating and managing different assessment types.
 * Allows the framework to dynamically instantiate the appropriate
 * assessment based on configuration.
 */

class AssessmentFactory {
    constructor() {
        this.assessmentTypes = {};
    }
    
    /**
     * Register an assessment type with the factory
     * @param {string} type - Unique identifier for the assessment type
     * @param {class} assessmentClass - Assessment class to instantiate
     */
    registerType(type, assessmentClass) {
        if (this.assessmentTypes[type]) {
            console.warn(`Assessment type '${type}' already registered. Overwriting.`);
        }
        
        this.assessmentTypes[type] = assessmentClass;
        console.log(`Registered assessment type: ${type}`);
    }
    
    /**
     * Create an assessment instance
     * @param {string} type - Assessment type to create
     * @param {Object} config - Configuration for the assessment
     * @param {Element} container - DOM container for rendering
     * @return {Object} - Assessment instance
     */
    createAssessment(type, config, container) {
        const AssessmentClass = this.assessmentTypes[type];
        
        if (!AssessmentClass) {
            throw new Error(`Unknown assessment type: ${type}`);
        }
        
        return new AssessmentClass(config, container);
    }
    
    /**
     * Get all registered assessment types
     * @return {Object} - Map of assessment types
     */
    getRegisteredTypes() {
        return { ...this.assessmentTypes };
    }
    
    /**
     * Get a list of available assessment types
     * @return {Array} - Array of type identifiers
     */
    getAvailableTypes() {
        return Object.keys(this.assessmentTypes);
    }
}

// Create a global instance of the factory
window.assessmentFactory = new AssessmentFactory();
