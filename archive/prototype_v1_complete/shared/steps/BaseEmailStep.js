/**
 * Assessment Framework - Base Email Step
 * 
 * This base component provides a foundation for email collection across different assessment types.
 * It combines shared functionality for email validation, state management, and user interface.
 */

// Import required dependencies
import { StepBase } from '../../core/step-base.js';
import { addEvent } from '../utils/event-manager.js';

export class BaseEmailStep extends StepBase {
    /**
     * Constructor for the base email step
     * @param {Object} assessment - The parent assessment
     */
    constructor(assessment) {
        super(assessment);
        
        // Track event listeners for cleanup
        this.cleanupListeners = [];
        
        // Common validation rules
        this.validationRules = {
            email: [
                { type: 'required', message: 'Please enter your email address' },
                { type: 'email', message: 'Please enter a valid email address' }
            ],
            name: [
                { type: 'optional', message: '' }
            ],
            privacy: [
                { type: 'required', message: 'Please accept the privacy agreement to continue' }
            ]
        };
    }
    
    /**
     * Render the email step
     * @return {String} - HTML content for the step
     */
    render() {
        const { state } = this.assessment;
        const email = state.email || '';
        const name = state.name || '';
        
        return `
            <div class="assessment-step email-step">
                <h2>${this.getStepTitle()}</h2>
                <p class="step-description">
                    ${this.getStepDescription()}
                </p>
                
                <div class="email-form">
                    ${this.renderNameField(name)}
                    
                    <div class="form-group">
                        <label for="email-input">Email Address*</label>
                        <input 
                            type="email" 
                            id="email-input" 
                            class="email-input" 
                            placeholder="Enter your email address" 
                            value="${email}"
                            required
                        >
                        <div id="email-error" class="error-message" style="display: none;">
                            Please enter a valid email address
                        </div>
                    </div>
                    
                    ${this.renderPrivacyAgreement(state.privacyAgreed)}
                    
                    ${this.renderAdditionalFields()}
                </div>
                
                ${this.renderNavigation()}
            </div>
        `;
    }
    
    /**
     * Get the title for the step
     * Can be overridden by derived classes
     * @return {String} - Step title
     */
    getStepTitle() {
        return "Get Your Assessment Results";
    }
    
    /**
     * Get the description for the step
     * Can be overridden by derived classes
     * @return {String} - Step description
     */
    getStepDescription() {
        return "Enter your details to receive your custom assessment results. We'll also email you a copy of your results.";
    }
    
    /**
     * Render the name input field
     * @param {String} name - Current name value
     * @return {String} - HTML for name field
     */
    renderNameField(name) {
        return `
            <div class="form-group">
                <label for="name-input">Your Name (Optional)</label>
                <input 
                    type="text" 
                    id="name-input" 
                    class="name-input" 
                    placeholder="Enter your name" 
                    value="${name}"
                >
            </div>
        `;
    }
    
    /**
     * Render the privacy agreement checkbox
     * @param {Boolean} isAgreed - Whether privacy is agreed
     * @return {String} - HTML for privacy agreement
     */
    renderPrivacyAgreement(isAgreed) {
        return `
            <div class="form-group privacy-agreement">
                <input 
                    type="checkbox" 
                    id="privacy-checkbox" 
                    class="privacy-checkbox" 
                    ${isAgreed ? 'checked' : ''}
                >
                <label for="privacy-checkbox">
                    I agree to receive my assessment results and related insights by email
                </label>
                <div id="privacy-error" class="error-message" style="display: none;">
                    Please accept the privacy agreement to continue
                </div>
            </div>
        `;
    }
    
    /**
     * Render additional fields specific to an assessment type
     * Can be overridden by derived classes
     * @return {String} - HTML for additional fields
     */
    renderAdditionalFields() {
        return ''; // Default implementation has no additional fields
    }
    
    /**
     * Render navigation buttons
     * @return {String} - HTML for navigation buttons
     */
    renderNavigation() {
        return `
            <div class="assessment-navigation">
                <button type="button" class="btn btn-secondary prev-button">
                    <i class="fa fa-arrow-left"></i> Back
                </button>
                <button type="button" class="btn btn-primary next-button">
                    Get Results <i class="fa fa-arrow-right"></i>
                </button>
            </div>
        `;
    }
    
    /**
     * Set up event listeners for this step
     * @param {Element} container - The step container element
     */
    setupEventListeners(container) {
        if (!container) return;
        
        // Email input
        const emailInput = container.querySelector('#email-input');
        if (emailInput) {
            const emailListener = addEvent(emailInput, 'input', this.handleEmailInput.bind(this));
            this.cleanupListeners.push(emailListener);
            
            // Add blur event for validation
            const emailBlurListener = addEvent(emailInput, 'blur', this.validateEmailField.bind(this));
            this.cleanupListeners.push(emailBlurListener);
        }
        
        // Name input
        const nameInput = container.querySelector('#name-input');
        if (nameInput) {
            const nameListener = addEvent(nameInput, 'input', this.handleNameInput.bind(this));
            this.cleanupListeners.push(nameListener);
        }
        
        // Privacy checkbox
        const privacyCheckbox = container.querySelector('#privacy-checkbox');
        if (privacyCheckbox) {
            const privacyListener = addEvent(privacyCheckbox, 'change', this.handlePrivacyChange.bind(this));
            this.cleanupListeners.push(privacyListener);
        }
        
        // Navigation buttons
        const nextButton = container.querySelector('.next-button');
        if (nextButton) {
            const nextListener = addEvent(nextButton, 'click', this.handleNext.bind(this));
            this.cleanupListeners.push(nextListener);
        }
        
        const prevButton = container.querySelector('.prev-button');
        if (prevButton) {
            const prevListener = addEvent(prevButton, 'click', this.handlePrev.bind(this));
            this.cleanupListeners.push(prevListener);
        }
        
        // Set up any additional listeners
        this.setupAdditionalListeners(container);
    }
    
    /**
     * Set up additional event listeners specific to an assessment type
     * Can be overridden by derived classes
     * @param {Element} container - The step container element
     */
    setupAdditionalListeners(container) {
        // Default implementation does nothing
    }
    
    /**
     * Clean up event listeners when leaving this step
     */
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
    
    /**
     * Handle email input
     * @param {Event} event - Input event
     */
    handleEmailInput(event) {
        const input = event.target;
        const value = input.value.trim();
        
        // Update state
        this.assessment.state.email = value;
        
        // Validate on input (optional immediate feedback)
        this.validateEmailField();
    }
    
    /**
     * Validate email field
     * @return {Boolean} - True if the email is valid
     */
    validateEmailField() {
        const emailInput = document.getElementById('email-input');
        const errorElement = document.getElementById('email-error');
        
        if (emailInput && errorElement) {
            const value = emailInput.value.trim();
            
            // Check if email is empty
            if (!value) {
                errorElement.textContent = 'Please enter your email address';
                errorElement.style.display = 'block';
                return false;
            }
            
            // Check if email is valid
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(value)) {
                errorElement.textContent = 'Please enter a valid email address';
                errorElement.style.display = 'block';
                return false;
            }
            
            // Email is valid
            errorElement.style.display = 'none';
            return true;
        }
        
        return false;
    }
    
    /**
     * Handle name input
     * @param {Event} event - Input event
     */
    handleNameInput(event) {
        const input = event.target;
        const value = input.value.trim();
        
        // Update state
        this.assessment.state.name = value;
    }
    
    /**
     * Handle privacy checkbox change
     * @param {Event} event - Change event
     */
    handlePrivacyChange(event) {
        const checkbox = event.target;
        
        // Update state
        this.assessment.state.privacyAgreed = checkbox.checked;
        
        // Hide error message if checked
        const errorElement = document.getElementById('privacy-error');
        if (errorElement) {
            errorElement.style.display = checkbox.checked ? 'none' : 'block';
        }
    }
    
    /**
     * Handle next button click
     * @param {Event} event - Click event
     */
    handleNext(event) {
        console.log('[BaseEmailStep] Next button clicked');
        event.preventDefault(); // Prevent default form submission
        
        if (this.validate()) {
            console.log('[BaseEmailStep] Form validated successfully');
            
            // Pre-process results if needed
            this.prepareForNextStep();
            
            // Trigger onNext callback
            this.onNext();
            
            // Handle navigation to the next step
            this.navigateToNextStep();
        } else {
            console.log('[BaseEmailStep] Form validation failed');
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
        this.navigateToPreviousStep();
    }
    
    /**
     * Prepare data for the next step
     * Can be overridden by derived classes
     */
    prepareForNextStep() {
        // Default implementation does nothing
    }
    
    /**
     * Navigate to the next step
     * Can be overridden by derived classes
     */
    navigateToNextStep() {
        // Default implementation uses assessment navigation controller
        this.assessment.nextStep();
    }
    
    /**
     * Navigate to the previous step
     * Can be overridden by derived classes
     */
    navigateToPreviousStep() {
        // Default implementation uses assessment navigation controller
        this.assessment.previousStep();
    }
    
    /**
     * Validate the step
     * @return {Boolean} - True if the step is valid
     */
    validate() {
        let isValid = true;
        
        // Validate email
        if (!this.validateEmailField()) {
            isValid = false;
        }
        
        // Validate privacy agreement
        const privacyCheckbox = document.getElementById('privacy-checkbox');
        const privacyError = document.getElementById('privacy-error');
        
        if (privacyCheckbox && !privacyCheckbox.checked) {
            if (privacyError) {
                privacyError.style.display = 'block';
            }
            isValid = false;
        }
        
        // Validate any additional fields
        if (!this.validateAdditionalFields()) {
            isValid = false;
        }
        
        return isValid;
    }
    
    /**
     * Validate additional fields specific to an assessment type
     * Can be overridden by derived classes
     * @return {Boolean} - True if additional fields are valid
     */
    validateAdditionalFields() {
        return true; // Default implementation has no additional fields
    }
    
    /**
     * Actions to perform when moving to the next step
     * @return {Boolean} - True if the navigation should proceed
     */
    onNext() {
        // Save the user's email to state
        this.assessment.stateManager.saveState();
        
        // Clean up event listeners
        this.cleanupEventListeners();
        return true;
    }
    
    /**
     * Actions to perform when moving to the previous step
     * @return {Boolean} - True if the navigation should proceed
     */
    onPrevious() {
        // Save any partial data
        this.assessment.stateManager.saveState();
        
        // Clean up event listeners
        this.cleanupEventListeners();
        return true;
    }
}

// Export using ES6 module syntax
// No global registration needed
