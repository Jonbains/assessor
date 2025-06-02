/**
 * In-House Marketing Assessment - Contact Step
 * 
 * Collects user contact information before showing results
 * Extends the shared BaseEmailStep with in-house specific customizations
 */

// Import BaseEmailStep from shared components
import { BaseEmailStep } from '../../../shared/steps/BaseEmailStep.js';

export class ContactStep extends BaseEmailStep {
    /**
     * Constructor for inhouse contact step
     * @param {InhouseAssessment} assessment - The parent assessment
     */
    constructor(assessment) {
        super(assessment);
        
        // Add any inhouse-specific properties
        this.showResultsPreview = true;
    }
    
    /**
     * Actions to perform when entering this step
     */
    onEnter() {
        // If we don't have results yet, calculate them for the preview
        if (!this.assessment.state.results) {
            console.log('[InhouseContactStep] Pre-calculating results for preview');
            const results = this.assessment.calculateResults();
            this.assessment.state.results = results;
        }
        
        // Call parent onEnter to set up form fields and state
        super.onEnter();
    }
    
    /**
     * Get the title for the step - inhouse specific
     * @return {String} - Step title
     */
    getStepTitle() {
        return "Get Your Personalized AI Readiness Report";
    }
    
    /**
     * Get the description for the step - inhouse specific
     * @return {String} - Step description
     */
    getStepDescription() {
        return "Receive detailed recommendations tailored to your industry and marketing activities.";
    }
    
    /**
     * Render additional fields specific to inhouse assessment
     * @return {String} - HTML for additional fields
     */
    renderAdditionalFields() {
        // Add results preview for inhouse assessment
        if (this.showResultsPreview) {
            return `
                <div class="results-preview-container">
                    <h3>Your Results Preview</h3>
                    ${this.renderResultsPreview()}
                </div>
            `;
        }
        return '';
    }
    
    /**
     * Prepare data for the next step
     * Inhouse-specific implementation to calculate results
     */
    prepareForNextStep() {
        // Calculate assessment results before proceeding to results step
        if (!this.assessment.state.results) {
            console.log('[InhouseContactStep] Calculating assessment results');
            this.assessment.state.results = this.assessment.calculateResults();
            
            // Save the results and other data
            console.log('[InhouseContactStep] Saving assessment results to state');
            this.assessment.stateManager.saveState();
        }
    }
    
    /**
     * Navigate to the next step
     * Inhouse-specific implementation to go directly to results
     */
    navigateToNextStep() {
        console.log('[InhouseContactStep] Navigating to results step');
        this.assessment.state.currentStep = 'results';
        this.assessment.renderCurrentStep();
    }
    
    /**
     * Navigate to the previous step
     * Inhouse-specific implementation
     */
    navigateToPreviousStep() {
        console.log('[InhouseContactStep] Navigating to previous step (questions)');
        // Go back to the appropriate question step based on assessment state
        const lastQuestionsType = this.assessment.state.currentQuestionType || 'core';
        this.assessment.state.currentStep = `${lastQuestionsType}-questions`;
        this.assessment.renderCurrentStep();
    }
    
    /**
     * Render a preview of the assessment results
     * This will be included via innerHTML in the parent EmailStep template
     */
    renderResultsPreview() {
        // Show a teaser of the results to encourage form completion
        const results = this.assessment.state.results;
        
        if (!results) {
            return `<p>Complete the form to generate your assessment results.</p>`;
        }
        
        const overallScore = results.scores?.overall || 0;
        const selectedIndustry = this.assessment.state.selectedIndustry;
        const industry = this.assessment.config.industries.find(i => i.id === selectedIndustry);
        const industryAvg = industry?.avgReadiness || 60;
        
        return `
            <div class="results-preview">
                <div class="score-preview">
                    <div class="score-circle">
                        <span class="score-value">${Math.round(overallScore)}</span>
                        <span class="score-label">Your Score</span>
                    </div>
                    <div class="industry-comparison">
                        <span class="industry-score">${industryAvg}</span>
                        <span class="industry-label">Industry Avg</span>
                    </div>
                </div>
                <p class="preview-message">Complete the form to see your full results including strengths, areas for improvement, and personalized recommendations.</p>
            </div>
        `;
    }
}

// No global registration needed - using ES6 exports only
console.log('[ContactStep] Class exported as ES6 module');
