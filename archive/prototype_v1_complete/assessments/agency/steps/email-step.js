/**
 * Assessment Framework - Agency Email Step
 * 
 * Implements the email collection step for the agency assessment
 * Extends the shared BaseEmailStep for consistent functionality across assessments
 */

// Import dependencies
import { BaseEmailStep } from '../../../shared/steps/BaseEmailStep.js';

/**
 * EmailStep class
 * Agency-specific implementation of the email collection step
 */
export class EmailStep extends BaseEmailStep {
    /**
     * Constructor for agency email step
     * @param {AgencyAssessment} assessment - The parent assessment
     */
    constructor(assessment) {
        super(assessment);
        // Agency-specific setup happens in the parent constructor
    }
    
    /**
     * Get the description for the step - agency specific
     * @return {String} - Step description
     */
    getStepDescription() {
        // Get agency type for personalized message
        const agencyTypeName = this.assessment.getAgencyTypeName();
        const agencyTypeText = agencyTypeName ? ` for ${agencyTypeName}s` : '';
        
        return `Enter your details to receive your custom AI vulnerability assessment and valuation impact report${agencyTypeText}. We'll also email you a copy of your results.`;
    }
    
    /**
     * Render navigation buttons with agency-specific text
     * @return {String} - HTML for navigation buttons
     */
    renderNavigation() {
        return `
            <div class="assessment-navigation">
                <button type="button" class="btn btn-secondary prev-button">
                    <i class="fa fa-arrow-left"></i> Back
                </button>
                <button type="button" class="btn btn-primary next-button">
                    View Results <i class="fa fa-arrow-right"></i>
                </button>
            </div>
        `;
    }
    
    /**
     * Set up additional event listeners specific to agency assessment
     * @param {Element} container - The step container element
     */
    setupAdditionalListeners(container) {
        // Agency-specific event listeners could be added here if needed
        console.log('[AgencyEmailStep] Setting up agency-specific listeners');
    }
    
    /**
     * Prepare data for the next step
     * Agency-specific implementation to calculate results
     */
    prepareForNextStep() {
        // Calculate assessment results before proceeding to results step
        if (!this.assessment.state.results) {
            console.log('[AgencyEmailStep] Calculating assessment results');
            this.assessment.state.results = this.assessment.calculateResults();
            
            // Save the results and other data
            console.log('[AgencyEmailStep] Saving assessment results to state');
            this.assessment.stateManager.saveState();
        }
    }
    
    /**
     * Navigate to the next step
     * Agency-specific implementation to go directly to results
     */
    navigateToNextStep() {
        console.log('[AgencyEmailStep] Navigating to results step');
        this.assessment.state.currentStep = 'results';
        this.assessment.renderCurrentStep();
    }
    
    /**
     * Navigate to the previous step
     * Agency-specific implementation
     */
    navigateToPreviousStep() {
        console.log('[AgencyEmailStep] Navigating to previous step (questions)');
        this.assessment.state.currentStep = 'questions';
        this.assessment.renderCurrentStep();
    }
}

// Make the class available as a browser global for backward compatibility
window.EmailStep = EmailStep;
