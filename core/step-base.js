/**
 * Assessment Framework - Base Step Class
 * 
 * This serves as the foundation for all step components in the modular structure
 */

export class StepBase {
    /**
     * Constructor for the base step
     * @param {Object} assessment - Reference to the parent assessment
     */
    constructor(assessment) {
        this.assessment = assessment;
        this.validationRules = {};
    }
    
    /**
     * Render the step content
     * @return {String} - HTML content for the step
     */
    render() { 
        throw new Error('Must implement render'); 
    }
    
    /**
     * Validate the step
     * @return {Boolean} - True if the step is valid
     */
    validate() { 
        throw new Error('Must implement validate'); 
    }
    
    /**
     * Actions to perform when moving to the next step
     * @return {Boolean} - True if the navigation should proceed
     */
    onNext() { 
        return true; 
    }
    
    /**
     * Actions to perform when moving to the previous step
     * @return {Boolean} - True if the navigation should proceed
     */
    onPrevious() { 
        return true; 
    }
    
    /**
     * Set up event listeners specific to this step
     * @param {Element} container - The container element for this step
     */
    setupEventListeners(container) {
        // Optional method to be implemented by step classes
    }
    
    /**
     * Clean up event listeners when leaving this step
     */
    cleanupEventListeners() {
        // Optional method to be implemented by step classes
    }
}
