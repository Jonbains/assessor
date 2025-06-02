/**
 * Assessment Framework - Agency Type Step
 * 
 * Implements the agency type selection step for the agency assessment
 * Integrates with the AgencyTypeSelector.js from the lastworking directory
 */

import { StepBase } from '../../../core/step-base.js';
import { addEvent } from '../../../shared/utils/event-manager.js';
import { AgencyTypeSelector } from '../../../scripts/AgencyTypeSelector.js';

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
                <h2>Select Your Agency Type</h2>
                <p class="step-description">Choose the option that best describes your agency's primary focus:</p>
                
                <div id="agency-type-error" class="error-message" style="display: none;"></div>
                <div id="agency-type-container" class="agency-type-container">
                    <!-- AgencyTypeSelector will be initialized here -->
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
        console.log('[AgencyTypeStep] afterRender called');
        
        // Get the agency type container
        const agencyTypeContainer = container.querySelector('#agency-type-container');
        
        if (!agencyTypeContainer) {
            console.error('Agency type container not found');
            return;
        }
        
        // AgencyTypeSelector should be imported directly via ES6 imports now
        // No need to check if it's available globally
        
        try {
            // Create an instance of the AgencyTypeSelector
            this.agencyTypeSelector = new AgencyTypeSelector({
                container: agencyTypeContainer,
                eventBus: {
                    emit: (event, data) => {
                        console.log('Event received from AgencyTypeSelector:', event, data);
                        if (event === 'data:update') {
                            if (data.selectedType) {
                                // Update selected agency type in state
                                this.assessment.state.selectedAgencyType = data.selectedType;
                                this.assessment.stateManager.updateState('selectedAgencyType', data.selectedType);
                                
                                // Hide error message if visible
                                const errorElement = document.getElementById('agency-type-error');
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
            
            // Set up event listeners for navigation buttons
            console.log('[AgencyTypeStep] Setting up event listeners');
            this.setupEventListeners(container);
            
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
            <h3>Select Your Agency Type</h3>
            <div class="agency-type-options">
        `;
        
        agencyTypes.forEach(type => {
            const checkedAttr = state.selectedAgencyType === type.id ? 'checked' : '';
            
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
        
        // Add event listeners to radio inputs
        const radioInputs = container.querySelectorAll('input[type="radio"]');
        radioInputs.forEach(input => {
            const cleanup = addEvent(input, 'change', this.handleAgencyTypeSelection.bind(this));
            this.cleanupListeners.push(cleanup);
        });
    }
    
    /**
     * Render navigation buttons
     * @return {String} - HTML for navigation buttons
     */
    renderNavigation() {
        return `
            <div class="assessment-navigation">
                <button class="btn btn-primary btn-next">Next</button>
            </div>
        `;
    }
    
    /**
     * Set up event listeners for this step
     * @param {Element} container - The step container element
     */
    setupEventListeners(container) {
        // Change handler for radio inputs
        const radioInputs = container.querySelectorAll('input[type="radio"]');
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
        console.log('[AgencyTypeStep] Looking for default services for agency type:', agencyTypeId);
        console.log('[AgencyTypeStep] Config structure:', this.assessment.config);
        
        // Try different paths to find defaultServices
        let defaultServices = null;
        
        // Path 1: Direct in config
        if (this.assessment.config.defaultServices && 
            this.assessment.config.defaultServices[agencyTypeId]) {
            defaultServices = this.assessment.config.defaultServices[agencyTypeId];
            console.log('[AgencyTypeStep] Found default services in config.defaultServices');
        }
        // Path 2: In questions object
        else if (this.assessment.config.questions && 
                 this.assessment.config.questions.defaultServices && 
                 this.assessment.config.questions.defaultServices[agencyTypeId]) {
            defaultServices = this.assessment.config.questions.defaultServices[agencyTypeId];
            console.log('[AgencyTypeStep] Found default services in config.questions.defaultServices');
        }
        
        // Set selected services if found
        if (defaultServices) {
            this.assessment.state.selectedServices = defaultServices;
            console.log('[AgencyTypeStep] Pre-selected services:', this.assessment.state.selectedServices);
            
            // Also initialize service revenue with equal distribution
            const serviceRevenue = {};
            const equalShare = Math.floor(100 / defaultServices.length);
            const remainder = 100 - (equalShare * defaultServices.length);
            
            defaultServices.forEach((serviceId, index) => {
                // Add remainder to first service to ensure total of 100%
                serviceRevenue[serviceId] = equalShare + (index === 0 ? remainder : 0);
            });
            
            this.assessment.state.serviceRevenue = serviceRevenue;
            this.assessment.state.totalRevenue = 100;
            console.log('[AgencyTypeStep] Pre-allocated revenue:', serviceRevenue);
        } else {
            console.log('[AgencyTypeStep] No default services found for agency type:', agencyTypeId);
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
