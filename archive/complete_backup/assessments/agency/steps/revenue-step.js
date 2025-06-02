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
        const revenue = state.revenue || 0;
        const revenueFormatted = revenue ? formatCurrency(revenue) : '$0';
        
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
                    <div class="current-revenue-display">
                        <span id="revenue-display">${revenueFormatted}</span>
                    </div>
                    
                    <div class="revenue-slider-container">
                        <div class="slider-labels">
                            <span class="min-label">$0</span>
                            <span class="mid-label">$5M</span>
                            <span class="max-label">$10M+</span>
                        </div>
                        
                        <input 
                            type="range" 
                            id="revenue-slider" 
                            class="revenue-slider" 
                            min="0" 
                            max="10000000" 
                            step="100000" 
                            value="${revenue}"
                        >
                        
                        <div class="revenue-marker" id="revenue-marker">
                            <div class="marker-dot"></div>
                        </div>
                    </div>
                    
                    <div class="revenue-presets">
                        <button class="revenue-preset-btn" data-revenue="100000">$100K</button>
                        <button class="revenue-preset-btn" data-revenue="500000">$500K</button>
                        <button class="revenue-preset-btn" data-revenue="1000000">$1M</button>
                        <button class="revenue-preset-btn" data-revenue="5000000">$5M</button>
                        <button class="revenue-preset-btn" data-revenue="10000000">$10M</button>
                        <button class="revenue-preset-btn" data-revenue="25000000">$25M+</button>
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
        // Revenue slider
        const revenueSlider = container.querySelector('#revenue-slider');
        if (revenueSlider) {
            const inputListener = this.handleSliderInput.bind(this);
            const changeListener = this.handleSliderChange.bind(this);
            
            revenueSlider.addEventListener('input', inputListener);
            revenueSlider.addEventListener('change', changeListener);
            
            this.cleanupListeners.push(
                () => revenueSlider.removeEventListener('input', inputListener),
                () => revenueSlider.removeEventListener('change', changeListener)
            );
            
            // Initialize marker position
            this.updateSliderMarker(revenueSlider.value, revenueSlider.min, revenueSlider.max);
        }
        
        // Revenue preset buttons
        const presetButtons = container.querySelectorAll('.revenue-preset-btn');
        if (presetButtons.length > 0) {
            presetButtons.forEach(button => {
                const clickListener = this.handlePresetClick.bind(this);
                
                button.addEventListener('click', clickListener);
                
                this.cleanupListeners.push(
                    () => button.removeEventListener('click', clickListener)
                );
            });
        }
        
        // Navigation button handlers
        const nextButton = container.querySelector('.btn-next');
        if (nextButton) {
            const nextClickListener = this.handleNext.bind(this);
            
            nextButton.addEventListener('click', nextClickListener);
            
            this.cleanupListeners.push(
                () => nextButton.removeEventListener('click', nextClickListener)
            );
        }
        
        const prevButton = container.querySelector('.btn-prev');
        if (prevButton) {
            const prevClickListener = this.handlePrev.bind(this);
            
            prevButton.addEventListener('click', prevClickListener);
            
            this.cleanupListeners.push(
                () => prevButton.removeEventListener('click', prevClickListener)
            );
        }
        
        // Add CSS for the slider
        this.addSliderStyles(container);
    }
    
    /**
     * Clean up event listeners when leaving this step
     */
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
    
    /**
     * Handle slider input (live updates while dragging)
     * @param {Event} event - Input event
     */
    handleSliderInput(event) {
        const slider = event.target;
        const value = Number(slider.value);
        
        // Update display value
        const displayElement = document.getElementById('revenue-display');
        if (displayElement) {
            displayElement.textContent = formatCurrency(value);
        }
        
        // Update marker position
        this.updateSliderMarker(value, slider.min, slider.max);
        
        // Hide error message if visible
        const errorElement = document.getElementById('revenue-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
    }
    
    /**
     * Handle slider change (when user releases slider)
     * @param {Event} event - Change event
     */
    handleSliderChange(event) {
        const slider = event.target;
        const value = Number(slider.value);
        
        // Update state
        this.assessment.state.revenue = value;
        this.assessment.stateManager.updateState('revenue', value);
    }
    
    /**
     * Handle preset button click
     * @param {Event} event - Click event
     */
    handlePresetClick(event) {
        const button = event.currentTarget;
        const value = Number(button.dataset.revenue);
        
        // Update slider value
        const slider = document.getElementById('revenue-slider');
        if (slider) {
            slider.value = value;
            
            // Trigger input and change events
            const inputEvent = new Event('input', { bubbles: true });
            const changeEvent = new Event('change', { bubbles: true });
            
            slider.dispatchEvent(inputEvent);
            slider.dispatchEvent(changeEvent);
        }
    }
    
    /**
     * Update the slider marker position based on the current value
     * @param {Number} value - Current slider value
     * @param {Number} min - Minimum slider value
     * @param {Number} max - Maximum slider value
     */
    updateSliderMarker(value, min, max) {
        const marker = document.getElementById('revenue-marker');
        if (marker) {
            // Calculate percentage position
            const percentage = ((value - min) / (max - min)) * 100;
            marker.style.left = `${percentage}%`;
        }
    }
    
    /**
     * Add custom CSS styles for the slider
     * @param {Element} container - The container element
     */
    addSliderStyles(container) {
        // Create a style element
        const style = document.createElement('style');
        style.textContent = `
            .revenue-step .current-revenue-display {
                font-size: 28px;
                font-weight: bold;
                color: #ffff66;
                text-align: center;
                margin-bottom: 20px;
            }
            
            .revenue-step .revenue-slider-container {
                position: relative;
                margin: 30px 0;
            }
            
            .revenue-step .slider-labels {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                color: #aaa;
                font-size: 14px;
            }
            
            .revenue-step .revenue-slider {
                width: 100%;
                height: 4px;
                background-color: #333;
                -webkit-appearance: none;
                appearance: none;
                outline: none;
                border-radius: 2px;
            }
            
            .revenue-step .revenue-slider::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ffff66;
                cursor: pointer;
                border: none;
            }
            
            .revenue-step .revenue-slider::-moz-range-thumb {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background: #ffff66;
                cursor: pointer;
                border: none;
            }
            
            .revenue-step .revenue-marker {
                position: absolute;
                top: -10px;
                transform: translateX(-50%);
            }
            
            .revenue-step .marker-dot {
                width: 8px;
                height: 8px;
                background-color: #ffff66;
                border-radius: 50%;
            }
            
            .revenue-step .revenue-presets {
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                gap: 10px;
                margin-top: 20px;
            }
            
            .revenue-step .revenue-preset-btn {
                background-color: #222;
                color: #fff;
                border: 1px solid #444;
                border-radius: 4px;
                padding: 8px 12px;
                cursor: pointer;
                transition: background-color 0.3s, border-color 0.3s;
            }
            
            .revenue-step .revenue-preset-btn:hover {
                background-color: #333;
                border-color: #ffff66;
            }
        `;
        
        // Add the style to the container
        container.appendChild(style);
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
