/**
 * Assessment Framework - Inhouse Assessment (Placeholder)
 * 
 * Placeholder for inhouse team assessment implementation
 * This will be fully implemented in a future phase
 */

import { AssessmentBase } from '../../core/assessment-base.js';

/**
 * InhouseAssessment class (Placeholder)
 * This is a placeholder for the inhouse assessment that will be implemented in the future
 */
export class InhouseAssessment extends AssessmentBase {
    /**
     * Constructor for inhouse assessment
     * @param {Object} config - Assessment configuration
     * @param {Element} container - DOM container to render the assessment
     */
    constructor(config, container) {
        super(config, container);
        this.type = 'inhouse';
        console.log('[InhouseAssessment] Placeholder initialized - not yet implemented');
    }
    
    /**
     * Initialize the assessment state
     * @return {Object} - Initial state object
     */
    initializeState() {
        return {
            currentStep: 'placeholder',
            message: 'Inhouse assessment is not yet implemented'
        };
    }
    
    /**
     * Calculate assessment results
     * Placeholder implementation
     */
    calculateResults() {
        return {
            overallScore: 0,
            message: 'Inhouse assessment is not yet implemented'
        };
    }
    
    /**
     * Get questions for a specific step
     * Placeholder implementation
     */
    getQuestionsForStep() {
        return [];
    }
    
    /**
     * Render the current step
     * Displays a placeholder message
     */
    renderCurrentStep() {
        if (this.container) {
            this.container.innerHTML = `
                <div class="placeholder-message">
                    <h2>Inhouse Assessment</h2>
                    <p>This assessment type is not yet implemented.</p>
                    <p>Please use the Agency Assessment for now.</p>
                </div>
            `;
        }
    }
}

// Export default
export default InhouseAssessment;
