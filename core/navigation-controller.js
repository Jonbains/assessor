/**
 * Assessment Framework - Navigation Controller
 * 
 * Handles navigation between assessment steps
 */

export class NavigationController {
    /**
     * Constructor for the navigation controller
     * @param {Object} assessment - Reference to the parent assessment
     */
    constructor(assessment) {
        this.assessment = assessment;
    }
    
    /**
     * Navigate to the previous step
     * @return {Boolean} - True if navigation was successful
     */
    previousStep() {
        const currentStepIndex = this.assessment.config.steps.indexOf(this.assessment.state.currentStep);
        
        if (currentStepIndex > 0) {
            // Get the previous step
            const previousStep = this.assessment.config.steps[currentStepIndex - 1];
            
            // Update the current step in the state
            this.assessment.state.currentStep = previousStep;
            
            // Render the new current step
            this.assessment.renderCurrentStep();
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Navigate to the next step
     * @return {Boolean} - True if navigation was successful
     */
    nextStep() {
        // Validate the current step before proceeding
        if (!this.assessment.validateCurrentStep()) {
            return false;
        }
        
        const currentStepIndex = this.assessment.config.steps.indexOf(this.assessment.state.currentStep);
        
        if (currentStepIndex < this.assessment.config.steps.length - 1) {
            // Get the next step
            const nextStep = this.assessment.config.steps[currentStepIndex + 1];
            
            // Update the current step in the state
            this.assessment.state.currentStep = nextStep;
            
            // Render the new current step
            this.assessment.renderCurrentStep();
            
            return true;
        }
        
        return false;
    }
    
    /**
     * Navigate to a specific step
     * @param {String} stepId - ID of the step to navigate to
     * @param {Boolean} validate - Whether to validate the current step before navigating
     * @return {Boolean} - True if navigation was successful
     */
    goToStep(stepId, validate = true) {
        // Check if the step exists
        if (!this.assessment.config.steps.includes(stepId)) {
            console.error(`[Navigation] Step '${stepId}' not found in config`);
            return false;
        }
        
        // Validate current step if required
        if (validate && !this.assessment.validateCurrentStep()) {
            return false;
        }
        
        // Update the current step
        this.assessment.state.currentStep = stepId;
        
        // Render the new step
        this.assessment.renderCurrentStep();
        
        return true;
    }
    
    /**
     * Get the next step ID without navigating
     * @return {String|null} - The ID of the next step or null if at the end
     */
    getNextStepId() {
        const currentStepIndex = this.assessment.config.steps.indexOf(this.assessment.state.currentStep);
        
        if (currentStepIndex < this.assessment.config.steps.length - 1) {
            return this.assessment.config.steps[currentStepIndex + 1];
        }
        
        return null;
    }
    
    /**
     * Get the previous step ID without navigating
     * @return {String|null} - The ID of the previous step or null if at the beginning
     */
    getPreviousStepId() {
        const currentStepIndex = this.assessment.config.steps.indexOf(this.assessment.state.currentStep);
        
        if (currentStepIndex > 0) {
            return this.assessment.config.steps[currentStepIndex - 1];
        }
        
        return null;
    }
    
    /**
     * Check if the current step is the first step
     * @return {Boolean} - True if current step is the first step
     */
    isFirstStep() {
        return this.assessment.state.currentStep === this.assessment.config.steps[0];
    }
    
    /**
     * Check if the current step is the last step
     * @return {Boolean} - True if current step is the last step
     */
    isLastStep() {
        const lastStepIndex = this.assessment.config.steps.length - 1;
        return this.assessment.state.currentStep === this.assessment.config.steps[lastStepIndex];
    }
}
