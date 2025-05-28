/**
 * Assessment Framework - Agency Type Step
 * 
 * Implements the agency type selection step for the agency assessment
 */

import { StepBase } from '../../../core/step-base.js';
import { addEvent } from '../../../shared/utils/event-manager.js';

/**
 * AgencyTypeStep class
 * Allows users to select their agency type
 */
export class AgencyTypeStep extends StepBase {
    /**
     * Constructor for agency type step
     * @param {AgencyAssessment} assessment - The parent assessment
     */
    constructor(assessment) {
        super(assessment);
        
        // Define validation rules
        this.validationRules = {
            selectedAgencyType: [
                { type: 'required', message: 'Please select your agency type' }
            ]
        };
        
        this.cleanupListeners = [];
    }
    
    /**
     * Render the agency type step
     * @return {String} - HTML content for the step
     */
    render() {
        const { config, state } = this.assessment;
        const agencyTypes = config.agencyTypes || [];
        
        // Build HTML for agency type options
        let agencyTypeOptions = '';
        
        agencyTypes.forEach((type) => {
            const isSelected = state.selectedAgencyType === type.id;
            const selectedClass = isSelected ? 'selected' : '';
            
            agencyTypeOptions += `
                <div class="agency-type-option ${selectedClass}" data-agency-type-id="${type.id}">
                    <div class="agency-type-header">
                        <div class="agency-type-name">${type.name}</div>
                    </div>
                    <div class="agency-type-description">${type.description || ''}</div>
                </div>
            `;
        });
        
        // Build complete step HTML
        return `
            <div class="assessment-step agency-type-step">
                <h2>What type of agency are you?</h2>
                <p class="step-description">
                    Select the agency type that best matches your business to get tailored assessment questions and recommendations.
                </p>
                
                <div class="agency-type-selection">
                    ${agencyTypeOptions}
                </div>
                
                <div id="agency-type-error" class="error-message" style="display: none;">
                    Please select your agency type to continue
                </div>
                
                ${this.renderNavigation()}
            </div>
        `;
    }
    
    /**
     * Render navigation buttons
     * @return {String} - HTML for navigation buttons
     */
    renderNavigation() {
        const isFirstStep = this.assessment.state.currentStep === this.assessment.config.steps[0];
        
        return `
            <div class="assessment-navigation">
                ${!isFirstStep ? '<button class="btn btn-secondary btn-prev">Previous</button>' : ''}
                <button class="btn btn-primary btn-next">Next</button>
            </div>
        `;
    }
    
    /**
     * Set up event listeners for this step
     * @param {Element} container - The step container element
     */
    setupEventListeners(container) {
        // Click handler for agency type options
        const agencyTypeOptions = container.querySelectorAll('.agency-type-option');
        agencyTypeOptions.forEach(option => {
            const cleanup = addEvent(option, 'click', this.handleAgencyTypeSelection.bind(this));
            this.cleanupListeners.push(cleanup);
        });
        
        // Navigation button handlers
        const nextButton = container.querySelector('.btn-next');
        if (nextButton) {
            const cleanup = addEvent(nextButton, 'click', this.handleNext.bind(this));
            this.cleanupListeners.push(cleanup);
        }
        
        const prevButton = container.querySelector('.btn-prev');
        if (prevButton) {
            const cleanup = addEvent(prevButton, 'click', this.handlePrev.bind(this));
            this.cleanupListeners.push(cleanup);
        }
    }
    
    /**
     * Clean up event listeners when leaving this step
     */
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
    
    /**
     * Handle agency type selection
     * @param {Event} event - Click event
     */
    handleAgencyTypeSelection(event) {
        const option = event.currentTarget;
        const agencyTypeId = option.dataset.agencyTypeId;
        
        // Update selected agency type in state
        this.assessment.state.selectedAgencyType = agencyTypeId;
        
        // Update UI to reflect selection
        const allOptions = document.querySelectorAll('.agency-type-option');
        allOptions.forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        // Hide error message if visible
        const errorElement = document.getElementById('agency-type-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        // Pre-select default services based on agency type if configured
        if (this.assessment.config.defaultServices && 
            this.assessment.config.defaultServices[agencyTypeId]) {
            this.assessment.state.selectedServices = 
                [...this.assessment.config.defaultServices[agencyTypeId]];
            console.log('[AgencyTypeStep] Pre-selected services:', this.assessment.state.selectedServices);
        }
        
        // Save state
        this.assessment.stateManager.saveState();
    }
    
    /**
     * Handle next button click
     * @param {Event} event - Click event
     */
    handleNext(event) {
        if (this.validate()) {
            // Trigger onNext callback
            this.onNext();
            
            // Navigate to next step
            this.assessment.nextStep();
        }
    }
    
    /**
     * Handle previous button click
     * @param {Event} event - Click event
     */
    handlePrev(event) {
        // Trigger onPrevious callback
        this.onPrevious();
        
        // Navigate to previous step
        this.assessment.previousStep();
    }
    
    /**
     * Validate the step
     * @return {Boolean} - True if the step is valid
     */
    validate() {
        // Check if agency type is selected
        if (!this.assessment.state.selectedAgencyType) {
            // Show error message
            const errorElement = document.getElementById('agency-type-error');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            return false;
        }
        
        return true;
    }
    
    /**
     * Actions to perform when moving to the next step
     * @return {Boolean} - True if the navigation should proceed
     */
    onNext() {
        // Clean up event listeners
        this.cleanupEventListeners();
        return true;
    }
    
    /**
     * Actions to perform when moving to the previous step
     * @return {Boolean} - True if the navigation should proceed
     */
    onPrevious() {
        // Clean up event listeners
        this.cleanupEventListeners();
        return true;
    }
}
