/**
 * Assessment Framework - Email Step
 * 
 * Implements the email collection step for the agency assessment
 */

// Dependencies will be accessed as browser globals
// StepBase, addEvent and validateEmail should be available as browser globals

/**
 * EmailStep class
 * Collects the user's email address for results delivery
 */
class EmailStep extends StepBase {
    /**
     * Constructor for email step
     * @param {AgencyAssessment} assessment - The parent assessment
     */
    constructor(assessment) {
        super(assessment);
        
        // Define validation rules
        this.validationRules = {
            email: [
                { type: 'required', message: 'Please enter your email address' },
                { type: 'email', message: 'Please enter a valid email address' }
            ]
        };
        
        this.cleanupListeners = [];
    }
    
    /**
     * Render the email step
     * @return {String} - HTML content for the step
     */
    render() {
        const { state } = this.assessment;
        const email = state.email || '';
        const name = state.name || '';
        
        // Get agency type for personalized message
        const agencyTypeName = this.assessment.getAgencyTypeName();
        const agencyTypeText = agencyTypeName ? ` for ${agencyTypeName}s` : '';
        
        return `
            <div class="assessment-step email-step">
                <h2>Get Your Assessment Results</h2>
                <p class="step-description">
                    Enter your details to receive your custom AI vulnerability assessment and valuation impact report${agencyTypeText}.
                    We'll also email you a copy of your results.
                </p>
                
                <div class="email-form">
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
                    
                    <div class="form-group privacy-agreement">
                        <input 
                            type="checkbox" 
                            id="privacy-checkbox" 
                            class="privacy-checkbox" 
                            ${state.privacyAgreed ? 'checked' : ''}
                        >
                        <label for="privacy-checkbox">
                            I agree to receive my assessment results and related insights by email
                        </label>
                        <div id="privacy-error" class="error-message" style="display: none;">
                            Please accept the privacy agreement to continue
                        </div>
                    </div>
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
        return `
            <div class="assessment-navigation">
                <button class="btn btn-secondary btn-prev">Previous</button>
                <button class="btn btn-primary btn-next">View Results</button>
            </div>
        `;
    }
    
    /**
     * Set up event listeners for this step
     * @param {Element} container - The step container element
     */
    setupEventListeners(container) {
        // Email input handler
        const emailInput = container.querySelector('#email-input');
        if (emailInput) {
            const inputCleanup = addEvent(emailInput, 'input', this.handleEmailInput.bind(this));
            const blurCleanup = addEvent(emailInput, 'blur', this.validateEmailField.bind(this));
            this.cleanupListeners.push(inputCleanup, blurCleanup);
        }
        
        // Name input handler
        const nameInput = container.querySelector('#name-input');
        if (nameInput) {
            const cleanup = addEvent(nameInput, 'input', this.handleNameInput.bind(this));
            this.cleanupListeners.push(cleanup);
        }
        
        // Privacy checkbox handler
        const privacyCheckbox = container.querySelector('#privacy-checkbox');
        if (privacyCheckbox) {
            const cleanup = addEvent(privacyCheckbox, 'change', this.handlePrivacyChange.bind(this));
            this.cleanupListeners.push(cleanup);
        }
        
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
     * Handle email input
     * @param {Event} event - Input event
     */
    handleEmailInput(event) {
        const input = event.target;
        const value = input.value.trim();
        
        // Update state
        this.assessment.state.email = value;
        
        // Hide error message when typing
        const errorElement = document.getElementById('email-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    /**
     * Validate email field
     */
    validateEmailField() {
        const email = this.assessment.state.email;
        const errorElement = document.getElementById('email-error');
        
        if (!email || !validateEmail(email)) {
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            return false;
        } else {
            if (errorElement) {
                errorElement.style.display = 'none';
            }
            return true;
        }
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
        console.log('[EmailStep] View Results button clicked');
        event.preventDefault(); // Prevent default form submission
        
        if (this.validate()) {
            console.log('[EmailStep] Form validated successfully');
            
            // Calculate assessment results before proceeding to results step
            if (!this.assessment.state.results) {
                console.log('[EmailStep] Calculating assessment results');
                this.assessment.state.results = this.assessment.calculateResults();
                
                // Save the results and other data
                console.log('[EmailStep] Saving assessment results to state');
                this.assessment.stateManager.saveState();
            }
            
            // Trigger onNext callback
            console.log('[EmailStep] Triggering onNext callback');
            this.onNext();
            
            // Force navigation to the results step
            console.log('[EmailStep] Navigating to results step');
            this.assessment.state.currentStep = 'results';
            this.assessment.renderCurrentStep();
        } else {
            console.log('[EmailStep] Form validation failed');
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
        
        return isValid;
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

// Make the class available as a browser global
window.EmailStep = EmailStep;
