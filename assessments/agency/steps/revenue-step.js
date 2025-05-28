/**
 * Assessment Framework - Revenue Step
 * 
 * Implements the revenue input step for the agency assessment
 */

import { StepBase } from '../../../core/step-base.js';
import { addEvent } from '../../../shared/utils/event-manager.js';
import { formatCurrency } from '../../../shared/utils/formatting-utils.js';

/**
 * RevenueStep class
 * Allows users to enter their agency's annual revenue
 */
export class RevenueStep extends StepBase {
    /**
     * Constructor for revenue step
     * @param {AgencyAssessment} assessment - The parent assessment
     */
    constructor(assessment) {
        super(assessment);
        
        // Define validation rules
        this.validationRules = {
            revenue: [
                { type: 'required', message: 'Please enter your annual revenue' },
                { type: 'range', min: 1, max: 1000000000, message: 'Please enter a valid revenue amount' }
            ]
        };
        
        this.cleanupListeners = [];
    }
    
    /**
     * Render the revenue step
     * @return {String} - HTML content for the step
     */
    render() {
        const { state } = this.assessment;
        const revenue = state.revenue || '';
        const revenueFormatted = revenue ? formatCurrency(revenue) : '';
        
        // Get agency type name for personalized message
        const agencyTypeName = this.assessment.getAgencyTypeName();
        const agencyTypeText = agencyTypeName ? ` as a ${agencyTypeName}` : '';
        
        return `
            <div class="assessment-step revenue-step">
                <h2>Annual Agency Revenue</h2>
                <p class="step-description">
                    To provide meaningful financial impact analysis${agencyTypeText}, please enter your agency's 
                    approximate annual revenue. This information is confidential and only used for calculations.
                </p>
                
                <div class="revenue-input-container">
                    <div class="input-group">
                        <label for="revenue-input">Annual Revenue</label>
                        <div class="currency-input-wrapper">
                            <span class="currency-symbol">$</span>
                            <input 
                                type="number" 
                                id="revenue-input" 
                                class="revenue-input" 
                                placeholder="Enter annual revenue" 
                                value="${revenue}"
                                min="1"
                                step="10000"
                            >
                        </div>
                        <div class="formatted-revenue" id="formatted-revenue">${revenueFormatted}</div>
                    </div>
                    
                    <div class="revenue-ranges">
                        <div class="revenue-range-option" data-revenue="100000">$100K</div>
                        <div class="revenue-range-option" data-revenue="500000">$500K</div>
                        <div class="revenue-range-option" data-revenue="1000000">$1M</div>
                        <div class="revenue-range-option" data-revenue="5000000">$5M</div>
                        <div class="revenue-range-option" data-revenue="10000000">$10M</div>
                        <div class="revenue-range-option" data-revenue="25000000">$25M+</div>
                    </div>
                </div>
                
                <div id="revenue-error" class="error-message" style="display: none;">
                    Please enter your annual revenue to continue
                </div>
                
                <div class="revenue-notes">
                    <p><strong>Note:</strong> Your revenue information helps calculate potential financial impact 
                    of AI disruption and provides context for valuation analysis.</p>
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
                <button class="btn btn-primary btn-next">Next</button>
            </div>
        `;
    }
    
    /**
     * Set up event listeners for this step
     * @param {Element} container - The step container element
     */
    setupEventListeners(container) {
        // Revenue input handler
        const revenueInput = container.querySelector('#revenue-input');
        if (revenueInput) {
            const inputCleanup = addEvent(revenueInput, 'input', this.handleRevenueInput.bind(this));
            const blurCleanup = addEvent(revenueInput, 'blur', this.handleRevenueBlur.bind(this));
            this.cleanupListeners.push(inputCleanup, blurCleanup);
        }
        
        // Revenue range option handlers
        const rangeOptions = container.querySelectorAll('.revenue-range-option');
        rangeOptions.forEach(option => {
            const cleanup = addEvent(option, 'click', this.handleRangeOptionClick.bind(this));
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
     * Handle revenue input
     * @param {Event} event - Input event
     */
    handleRevenueInput(event) {
        const input = event.target;
        const value = input.value.trim();
        
        if (value === '') {
            this.assessment.state.revenue = 0;
            document.getElementById('formatted-revenue').textContent = '';
        } else {
            const revenueValue = Number(value);
            this.assessment.state.revenue = revenueValue;
            document.getElementById('formatted-revenue').textContent = formatCurrency(revenueValue);
        }
        
        // Hide error message if visible
        const errorElement = document.getElementById('revenue-error');
        if (errorElement && value !== '') {
            errorElement.style.display = 'none';
        }
    }
    
    /**
     * Handle revenue input blur
     * @param {Event} event - Blur event
     */
    handleRevenueBlur(event) {
        // Save state when the input loses focus
        this.assessment.stateManager.saveState();
    }
    
    /**
     * Handle revenue range option click
     * @param {Event} event - Click event
     */
    handleRangeOptionClick(event) {
        const option = event.currentTarget;
        const revenueValue = Number(option.dataset.revenue);
        
        // Update input value
        const revenueInput = document.getElementById('revenue-input');
        if (revenueInput) {
            revenueInput.value = revenueValue;
        }
        
        // Update state
        this.assessment.state.revenue = revenueValue;
        
        // Update formatted display
        document.getElementById('formatted-revenue').textContent = formatCurrency(revenueValue);
        
        // Hide error message if visible
        const errorElement = document.getElementById('revenue-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        // Highlight selected option
        const allOptions = document.querySelectorAll('.revenue-range-option');
        allOptions.forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
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
        const { revenue } = this.assessment.state;
        
        // Check if revenue is entered and valid
        if (!revenue || revenue <= 0) {
            // Show error message
            const errorElement = document.getElementById('revenue-error');
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
