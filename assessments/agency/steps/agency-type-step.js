/**
 * Assessment Framework - Agency Type Step
 * 
 * Implements the agency type selection step for the agency assessment
 * Integrates with the AgencyTypeSelector.js from the lastworking directory
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
        this.agencyTypeSelector = null; // Will hold the AgencyTypeSelector instance
    }
    
    /**
     * Render the agency type step
     * @return {String} - HTML content for the step
     */
    render() {
        // Create a placeholder container for the AgencyTypeSelector component
        return `
            <div class="assessment-step agency-type-step">
                <div id="agency-type-container"></div>
                <div id="agency-type-error" class="error-message" style="display: none;">
                    Please select your agency type to continue
                </div>
                
                ${this.renderNavigation()}
            </div>
        `;
    }
    
    /**
     * Initialize the AgencyTypeSelector component after rendering
     * @param {Element} container - The rendered container element
     */
    afterRender(container) {
        // Get the agency type container
        const agencyTypeContainer = container.querySelector('#agency-type-container');
        
        if (!agencyTypeContainer) {
            console.error('Agency type container not found');
            return;
        }
        
        // Check if the AgencyTypeSelector component is available
        if (typeof AgencyTypeSelector === 'undefined') {
            console.error('AgencyTypeSelector component not found');
            this.renderFallbackUI(agencyTypeContainer);
            return;
        }
        
        try {
            // Create an instance of the AgencyTypeSelector
            this.agencyTypeSelector = new AgencyTypeSelector({
                container: agencyTypeContainer,
                eventBus: {
                    emit: (event, data) => {
                        console.log('Event received from AgencyTypeSelector:', event, data);
                        if (event === 'data:update') {
                            if (data.selectedType) {
                                // Update the assessment state directly
                                this.assessment.state.selectedAgencyType = data.selectedType;
                                
                                // Use the state manager to persist the change
                                this.assessment.stateManager.updateState('selectedAgencyType', data.selectedType);
                                
                                console.log('Updated assessment state with agency type:', data.selectedType);
                                
                                // Update the error message visibility
                                const errorElement = container.querySelector('#agency-type-error');
                                if (errorElement) {
                                    errorElement.style.display = 'none';
                                }
                            }
                            
                            if (data.selectedServices) {
                                // Update selected services if provided
                                this.assessment.state.selectedServices = data.selectedServices;
                                this.assessment.stateManager.updateState('selectedServices', data.selectedServices);
                            }
                        }
                    }
                },
                engine: {
                    navigateNext: () => {
                        if (this.validate()) {
                            this.assessment.navigationController.nextStep();
                        } else {
                            // Show error message if validation fails
                            const errorElement = container.querySelector('#agency-type-error');
                            if (errorElement) {
                                errorElement.style.display = 'block';
                            }
                        }
                    },
                    navigatePrevious: () => this.assessment.navigationController.previousStep()
                },
                state: {
                    selectedType: this.assessment.state.selectedAgencyType || ''
                },
                config: {
                    agencyTypes: this.assessment.config.agencyTypes,
                    defaultServices: this.assessment.config.defaultServices
                }
            });
            
            // Render the component
            this.agencyTypeSelector.render();
            
            // Override the Next button to use our validation
            const nextButton = container.querySelector('.btn-next');
            if (nextButton) {
                nextButton.addEventListener('click', () => {
                    if (this.validate()) {
                        this.assessment.navigationController.nextStep();
                    } else {
                        // Show error message
                        const errorElement = container.querySelector('#agency-type-error');
                        if (errorElement) {
                            errorElement.style.display = 'block';
                        }
                    }
                });
            }
            
            console.log('AgencyTypeSelector component initialized successfully');
            console.log('Current assessment state:', this.assessment.state);
        } catch (error) {
            console.error('Error initializing AgencyTypeSelector:', error);
            this.renderFallbackUI(agencyTypeContainer);
        }
    }
    
    /**
     * Render a fallback UI if the original component can't be initialized
     * @param {Element} container - The container element
     */
    renderFallbackUI(container) {
        const { config, state } = this.assessment;
        const agencyTypes = config.agencyTypes || [];
        
        let html = `
            <h2>Select Your Agency Type</h2>
            <p class="step-description">
                Choose the option that best describes your agency's primary focus:
            </p>
            
            <div class="agency-type-selection">
        `;
        
        agencyTypes.forEach((type) => {
            const isSelected = state.selectedAgencyType === type.id;
            const checkedAttr = isSelected ? 'checked' : '';
            
            html += `
                <div class="agency-type-option">
                    <label class="radio-container">
                        <input type="radio" name="agencyType" value="${type.id}" ${checkedAttr}>
                        <span class="radio-label">
                            <span class="agency-type-name">${type.name}</span>
                            <span class="agency-type-description">${type.description || ''}</span>
                        </span>
                    </label>
                </div>
            `;
        });
        
        html += '</div>';
        container.innerHTML = html;
        
        // Set up event listeners
        const radioInputs = container.querySelectorAll('input[type="radio"][name="agencyType"]');
        radioInputs.forEach(input => {
            const cleanup = addEvent(input, 'change', this.handleAgencyTypeSelection.bind(this));
            this.cleanupListeners.push(cleanup);
        });
    }
    
    /**
     * Render the navigation buttons
     * @return {String} - HTML content for the navigation
     */
    renderNavigation() {
        const isFirstStep = this.assessment.state.currentStep === this.assessment.config.steps[0];
        
        return `
            <div class="assessment-navigation">
                ${!isFirstStep ? '<button class="btn btn-secondary btn-prev">Previous</button>' : ''}
                <button class="btn btn-primary btn-next">NEXT</button>
            </div>
        `;
    }
    
    /**
     * Set up event listeners for this step
     * @param {Element} container - The step container element
     */
    setupEventListeners(container) {
        // Change handler for radio inputs
        const radioInputs = container.querySelectorAll('input[type="radio"][name="agencyType"]');
        radioInputs.forEach(input => {
            const cleanup = addEvent(input, 'change', this.handleAgencyTypeSelection.bind(this));
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
     * @param {Event} event - Change event from radio input
     */
    handleAgencyTypeSelection(event) {
        const radioInput = event.currentTarget;
        const agencyTypeId = radioInput.value;
        
        // Update selected agency type in state
        this.assessment.state.selectedAgencyType = agencyTypeId;
        
        // Hide error message if visible
        const errorElement = document.getElementById('agency-type-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        console.log(`Selected agency type: ${agencyTypeId}`);
        
        // Store the selection in state with automatic persistence
        this.assessment.stateManager.updateState('selectedAgencyType', agencyTypeId);
        
        // Ensure the navigation button is enabled
        const nextButton = document.querySelector('.btn-next');
        if (nextButton) {
            nextButton.removeAttribute('disabled');
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
        console.log('[AgencyTypeStep] Next button clicked');
        
        if (this.validate()) {
            console.log('[AgencyTypeStep] Validation passed, calling onNext');
            // Trigger onNext callback
            this.onNext();
            
            console.log('[AgencyTypeStep] Navigating to next step');
            // Get current step and show which step we expect to go to next
            const currentStepIndex = this.assessment.config.steps.indexOf(this.assessment.state.currentStep);
            const nextStepId = this.assessment.config.steps[currentStepIndex + 1];
            console.log(`[AgencyTypeStep] Expected next step: ${nextStepId}`);
            
            // Navigate to next step
            this.assessment.nextStep();
        } else {
            console.log('[AgencyTypeStep] Validation failed, not proceeding');
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
        console.log('[AgencyTypeStep] Validating step');
        
        // Check if agency type is selected
        if (!this.assessment.state.selectedAgencyType) {
            console.log('[AgencyTypeStep] Validation failed: No agency type selected');
            const errorElement = document.getElementById('agency-type-error');
            if (errorElement) {
                errorElement.style.display = 'block';
                errorElement.textContent = 'Please select an agency type to continue.';
            }
            return false;
        }
        
        console.log('[AgencyTypeStep] Validation passed');
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
