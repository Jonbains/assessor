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
        console.log('[NavigationController] nextStep called');
        console.log('[NavigationController] Current step:', this.assessment.state.currentStep);
        
        // If current step is not set, default to the first step
        if (!this.assessment.state.currentStep) {
            console.warn('[NavigationController] Current step not set, defaulting to first step');
            this.assessment.state.currentStep = this.assessment.config.steps[0];
        }
        
        // Validate the current step before proceeding
        if (!this.assessment.validateCurrentStep()) {
            console.log('[NavigationController] Current step validation failed, not proceeding');
            return false;
        }
        
        const currentStepIndex = this.assessment.config.steps.indexOf(this.assessment.state.currentStep);
        console.log('[NavigationController] Current step index:', currentStepIndex);
        console.log('[NavigationController] Available steps:', this.assessment.config.steps);
        
        // If the current step is not found in the steps array, this will be -1
        if (currentStepIndex === -1) {
            console.error(`[NavigationController] Current step "${this.assessment.state.currentStep}" not found in steps array!`);
            console.log('[NavigationController] Attempting to recover by using company-info as current step');
            
            // Try to find the company-info step as fallback
            const companyInfoIndex = this.assessment.config.steps.indexOf('company-info');
            if (companyInfoIndex >= 0) {
                // Set current step to company-info and continue from there
                this.assessment.state.currentStep = 'company-info';
                const nextStep = this.assessment.config.steps[companyInfoIndex + 1];
                console.log('[NavigationController] Recovery - next step will be:', nextStep);
                
                this.assessment.state.currentStep = nextStep;
                console.log('[NavigationController] Rendering recovered next step:', nextStep);
                this.assessment.renderCurrentStep();
                return true;
            } else {
                // If we can't find company-info, just start at the first step
                console.error('[NavigationController] Recovery failed, starting from first step');
                this.assessment.state.currentStep = this.assessment.config.steps[0];
                this.assessment.renderCurrentStep();
                return false;
            }
        }
        
        if (currentStepIndex < this.assessment.config.steps.length - 1) {
            // Get the next step
            const nextStep = this.assessment.config.steps[currentStepIndex + 1];
            console.log('[NavigationController] Next step will be:', nextStep);
            
            // Update the current step in the state
            this.assessment.state.currentStep = nextStep;
            
            // If the next step is a question step, ensure question state is initialized
            if (nextStep.includes('questions')) {
                console.log('[NavigationController] Next step is a question step, ensuring question state is initialized');
                if (!this.assessment.state.currentQuestionType) {
                    // Extract question type from step name if possible
                    const questionType = nextStep.split('-')[0];
                    if (['core', 'industry', 'activity'].includes(questionType)) {
                        console.log(`[NavigationController] Setting question type to ${questionType} based on step name`);
                        this.assessment.state.currentQuestionType = questionType;
                    } else {
                        console.log('[NavigationController] Setting default question type to core');
                        this.assessment.state.currentQuestionType = 'core';
                    }
                    this.assessment.state.currentQuestionIndex = 0;
                }
            }
            
            // Render the new current step
            console.log('[NavigationController] Rendering next step:', nextStep);
            this.assessment.renderCurrentStep();
            
            return true;
        }
        
        console.log('[NavigationController] No next step available');
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

// No global registration - using ES6 modules
