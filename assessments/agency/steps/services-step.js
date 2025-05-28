/**
 * Assessment Framework - Services Step
 * 
 * Implements the services selection step with integrated revenue allocation
 * for the agency assessment.
 */

import { StepBase } from '../../../core/step-base.js';
import { addEvent } from '../../../shared/utils/event-manager.js';

/**
 * ServicesStep class
 * Allows users to select their agency services and allocate revenue
 */
export class ServicesStep extends StepBase {
    /**
     * Constructor for services step
     * @param {AgencyAssessment} assessment - The parent assessment
     */
    constructor(assessment) {
        super(assessment);
        
        // Define validation rules
        this.validationRules = {
            selectedServices: [
                { type: 'required', message: 'Please select at least one service' }
            ]
        };
        
        this.cleanupListeners = [];
    }
    
    /**
     * Render the services step
     * @return {String} - HTML content for the step
     */
    render() {
        return `
            <div class="assessment-step services-step">
                <h2>Select Your Services & Allocate Revenue</h2>
                <div class="services-instruction">
                    <div class="instruction-bar" style="background-color: #ffff66; padding: 8px 12px; margin-bottom: 20px;">
                        <p style="margin: 0; color: #000;">Drag sliders to allocate your agency revenue percentage across services</p>
                    </div>
                </div>
                
                <div class="revenue-input-section" style="margin-bottom: 25px; padding: 20px; background-color: #2a2a2a; border-radius: 8px;">
                    <h3 style="margin-top: 0; margin-bottom: 15px; color: #fff;">Annual Agency Revenue</h3>
                    <p style="margin-bottom: 15px; color: #ddd;">Please enter your agency's annual revenue to help us calculate your valuation metrics.</p>
                    
                    <div style="display: flex; align-items: center;">
                        <div style="position: relative; flex: 1;">
                            <span style="position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #999;">$</span>
                            <input type="text" id="revenue-input" 
                                   style="width: 100%; padding: 10px 10px 10px 30px; font-size: 18px; border: 1px solid #444; 
                                          border-radius: 4px; background-color: #333; color: #fff;" 
                                   placeholder="Enter annual revenue" />
                        </div>
                        
                        <div style="margin-left: 10px;">
                            <select id="revenue-format" style="padding: 10px; font-size: 18px; background-color: #333; color: #fff; border: 1px solid #444; border-radius: 4px;">
                                <option value="1">Exact</option>
                                <option value="1000">Thousands</option>
                                <option value="1000000" selected>Millions</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style="margin-top: 10px;">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                            <span style="color: #aaa; font-size: 14px;">$100K</span>
                            <span style="color: #aaa; font-size: 14px;">$100M+</span>
                        </div>
                        <input type="range" id="revenue-slider" min="0.1" max="100" step="0.1" value="1.5"
                               style="width: 100%; accent-color: #ffff66;" />
                        <div style="text-align: center; margin-top: 5px;">
                            <span id="revenue-display" style="font-weight: bold; color: #ffff66; font-size: 16px;">$1,500,000</span>
                        </div>
                    </div>
                </div>
                
                <div id="services-selector-container" class="services-selector-container">
                    <!-- Dynamic services content will be inserted here -->
                </div>
                
                <div id="services-error" class="error-message" style="display: none; color: #d9534f; margin: 15px 0; padding: 10px; border: 1px solid #d9534f; border-radius: 4px; background-color: #f9f2f2;">
                    Please select at least one service
                </div>
                
                <div class="revenue-total-indicator" style="margin: 20px 0; padding: 15px; background-color: #f8f9fa; border-radius: 8px; text-align: center;">
                    <div style="font-weight: bold; margin-bottom: 8px;">Total Revenue Allocated: <span id="total-revenue-display">0</span>%</div>
                    <div style="font-size: 14px; color: #666;">Please allocate 100% of your revenue across services</div>
                </div>
                
                ${this.renderNavigation()}
            </div>
        `;
    }
    
    /**
     * After render hook to set up the services selector
     * @param {Element} container - The rendered container element
     */
    afterRender(container) {
        console.log('[ServicesStep] afterRender called');
        
        // Setup revenue selector
        this.setupRevenueSelector(container);
        
        const selectorContainer = container.querySelector('#services-selector-container');
        
        if (!selectorContainer) {
            console.error('[ServicesStep] Services selector container not found');
            return;
        }
        
        // Get the services from the agency assessment config
        let services = [];
        
        // Try all possible locations where services might be defined
        if (Array.isArray(this.assessment.config.services)) {
            console.log('[ServicesStep] Found services array in config.services');
            services = this.assessment.config.services;
        } else if (this.assessment.config.questions && Array.isArray(this.assessment.config.questions.services)) {
            console.log('[ServicesStep] Found services array in config.questions.services');
            services = this.assessment.config.questions.services;
        } else if (this.assessment.config.questions && this.assessment.config.questions.questions && 
                   Array.isArray(this.assessment.config.questions.questions.services)) {
            console.log('[ServicesStep] Found services array in config.questions.questions.services');
            services = this.assessment.config.questions.questions.services;
        }
        
        // If we still don't have an array, try to extract from an object
        if (services.length === 0) {
            console.log('[ServicesStep] No services array found, checking for objects');
            
            // Try to get services from various possible locations
            let servicesObj = this.assessment.config.services || 
                              (this.assessment.config.questions && this.assessment.config.questions.services) || 
                              (this.assessment.config.questions && this.assessment.config.questions.questions && 
                               this.assessment.config.questions.questions.services);
            
            if (typeof servicesObj === 'object' && servicesObj !== null && !Array.isArray(servicesObj)) {
                console.log('[ServicesStep] Converting services object to array');
                services = Object.values(servicesObj);
            }
        }
        
        // Final validation to ensure we have services
        if (services.length === 0) {
            console.error('[ServicesStep] No services found in the configuration. Debugging config:', this.assessment.config);
            selectorContainer.innerHTML = '<div class="error-message">No services available. Please check the configuration.</div>';
            return;
        }
        
        console.log(`[ServicesStep] Found ${services.length} services to render:`, services);
        
        // Get previously selected services and revenue allocation from state
        let selectedServices = this.assessment.state.selectedServices || [];
        const serviceRevenue = this.assessment.state.serviceRevenue || {};
        
        // Initialize HTML container
        selectorContainer.innerHTML = '';
        
        // Create service selection and slider for each service
        console.log('[ServicesStep] Starting to create service cards');
        
        services.forEach((service, index) => {
            // Make sure service has an id
            if (!service.id) {
                console.warn('[ServicesStep] Service without ID:', service);
                return; // Skip this service
            }
            
            console.log(`[ServicesStep] Creating card for service ${index+1}/${services.length}: ${service.name} (ID: ${service.id})`);
            const isSelected = selectedServices.includes(service.id);
            const value = serviceRevenue[service.id] || 0;
            
            // Create service card
            const serviceCard = document.createElement('div');
            serviceCard.className = 'service-card';
            serviceCard.className += value > 0 ? ' service-selected' : '';
            serviceCard.dataset.serviceId = service.id;
            serviceCard.style.backgroundColor = '#1a1a1a';
            serviceCard.style.borderRadius = '6px';
            serviceCard.style.padding = '15px';
            serviceCard.style.marginBottom = '15px';
            
            // Create service label
            const serviceLabel = document.createElement('div');
            serviceLabel.className = 'service-label';
            serviceLabel.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span style="font-weight: bold; font-size: 18px; color: #fff;">${service.name}</span>
                    <span class="revenue-percentage" style="font-weight: bold; color: ${value > 0 ? '#ffff66' : '#666'};">${value}%</span>
                </div>
            `;
            
            // Create slider controls
            const sliderControls = document.createElement('div');
            sliderControls.className = 'slider-controls';
            sliderControls.style.display = 'flex';
            sliderControls.style.alignItems = 'center';
            
            // Minus button
            const minusBtn = document.createElement('button');
            minusBtn.textContent = '-';
            minusBtn.className = 'slider-btn minus';
            minusBtn.style.backgroundColor = '#ffff66';
            minusBtn.style.color = '#000';
            minusBtn.style.width = '30px';
            minusBtn.style.height = '30px';
            minusBtn.style.borderRadius = '4px';
            minusBtn.style.border = 'none';
            minusBtn.style.fontWeight = 'bold';
            minusBtn.style.cursor = 'pointer';
            
            // Slider input
            const slider = document.createElement('input');
            slider.type = 'range';
            slider.min = '0';
            slider.max = '100';
            slider.value = value;
            slider.className = 'revenue-slider';
            slider.style.flex = '1';
            slider.style.margin = '0 10px';
            slider.dataset.serviceId = service.id;
            
            // Plus button
            const plusBtn = document.createElement('button');
            plusBtn.textContent = '+';
            plusBtn.className = 'slider-btn plus';
            plusBtn.style.backgroundColor = '#ffff66';
            plusBtn.style.color = '#000';
            plusBtn.style.width = '30px';
            plusBtn.style.height = '30px';
            plusBtn.style.borderRadius = '4px';
            plusBtn.style.border = 'none';
            plusBtn.style.fontWeight = 'bold';
            plusBtn.style.cursor = 'pointer';
            
            sliderControls.appendChild(minusBtn);
            sliderControls.appendChild(slider);
            sliderControls.appendChild(plusBtn);
            
            // Add all elements to the service card
            serviceCard.appendChild(serviceLabel);
            serviceCard.appendChild(sliderControls);
            
            // Add card to container
            selectorContainer.appendChild(serviceCard);
            
            // No checkbox event listeners needed anymore
            
            // Slider event listeners
            slider.addEventListener('input', () => {
                // Save revenue value in state (no percentage display to user)
                const value = parseInt(slider.value, 10);
                const serviceRevenue = this.assessment.state.serviceRevenue || {};
                serviceRevenue[service.id] = value;
                this.assessment.state.serviceRevenue = serviceRevenue;
                
                // Update the percentage display
                const percentageDisplay = serviceCard.querySelector('.revenue-percentage');
                if (percentageDisplay) {
                    percentageDisplay.textContent = `${value}%`;
                    percentageDisplay.style.color = value > 0 ? '#ffff66' : '#666';
                }
                
                // Update card styling
                if (value > 0) {
                    serviceCard.classList.add('service-selected');
                } else {
                    serviceCard.classList.remove('service-selected');
                }
                
                // Update total revenue display
                this.updateTotalRevenueDisplay(serviceRevenue);
            });
            
            // Plus button increases slider value by 5%
            plusBtn.addEventListener('click', () => {
                const currentValue = parseInt(slider.value, 10);
                const newValue = Math.min(currentValue + 5, 100);
                slider.value = newValue;
                
                // Trigger input event to update state and UI
                const inputEvent = new Event('input', { bubbles: true });
                slider.dispatchEvent(inputEvent);
            });
            
            // Minus button decreases slider value by 5%
            minusBtn.addEventListener('click', () => {
                const currentValue = parseInt(slider.value, 10);
                const newValue = Math.max(currentValue - 5, 0);
                slider.value = newValue;
                
                // Trigger input event to update state and UI
                const inputEvent = new Event('input', { bubbles: true });
                slider.dispatchEvent(inputEvent);
            });
        });
        
        // Update total revenue display
        this.updateTotalRevenueDisplay(serviceRevenue);
        
        // Add event listeners for nav buttons
        const nextButton = container.querySelector('#next-button');
        if (nextButton) {
            const cleanup = addEvent(nextButton, 'click', this.handleNext.bind(this));
            this.cleanupListeners.push(cleanup);
        }
        
        const prevButton = container.querySelector('#prev-button');
        if (prevButton) {
            const cleanup = addEvent(prevButton, 'click', this.handlePrev.bind(this));
            this.cleanupListeners.push(cleanup);
        }
    }

    /**
     * Set up the revenue selector input and sliders
     * @param {Element} container - The container element
     */
    setupRevenueSelector(container) {
        console.log('[ServicesStep] Setting up revenue selector');
        
        const revenueInput = container.querySelector('#revenue-input');
        const revenueFormat = container.querySelector('#revenue-format');
        const revenueSlider = container.querySelector('#revenue-slider');
        const revenueDisplay = container.querySelector('#revenue-display');
        
        if (!revenueInput || !revenueFormat || !revenueSlider || !revenueDisplay) {
            console.error('[ServicesStep] Revenue selector elements not found');
            return;
        }
        
        // Get revenue value from state, or use default
        const stateRevenue = this.assessment.state.revenue || 1500000;
        
        // Set initial values
        const initialRevenue = stateRevenue || 1500000;
        const initialValue = initialRevenue / 1000000; // Convert to millions for slider
        
        revenueSlider.value = initialValue;
        revenueInput.value = initialValue;
        revenueDisplay.textContent = this.formatRevenueDisplay(initialRevenue);
        
        // Update state with initial value
        this.assessment.state.revenue = initialRevenue;
        
        // Format revenue for display
        revenueInput.addEventListener('input', () => {
            const inputValue = parseFloat(revenueInput.value) || 0;
            const multiplier = parseInt(revenueFormat.value, 10);
            const newRevenue = inputValue * multiplier;
            
            // Update slider
            revenueSlider.value = newRevenue / 1000000; // Convert to millions for slider
            
            // Update display
            revenueDisplay.textContent = this.formatRevenueDisplay(newRevenue);
            
            // Update state
            this.assessment.state.revenue = newRevenue;
            console.log(`[ServicesStep] Revenue updated from input: $${newRevenue}`);
        });
        
        // Handle format change
        revenueFormat.addEventListener('change', () => {
            const inputValue = parseFloat(revenueInput.value) || 0;
            const multiplier = parseInt(revenueFormat.value, 10);
            const newRevenue = inputValue * multiplier;
            
            // Update display
            revenueDisplay.textContent = this.formatRevenueDisplay(newRevenue);
            
            // Update state
            this.assessment.state.revenue = newRevenue;
            console.log(`[ServicesStep] Revenue format changed: $${newRevenue}`);
        });
        
        // Handle slider change
        revenueSlider.addEventListener('input', () => {
            const sliderValue = parseFloat(revenueSlider.value) || 0;
            const newRevenue = sliderValue * 1000000; // Convert to dollars
            
            // Update input based on format
            const multiplier = parseInt(revenueFormat.value, 10);
            revenueInput.value = (newRevenue / multiplier).toFixed(1);
            
            // Update display
            revenueDisplay.textContent = this.formatRevenueDisplay(newRevenue);
            
            // Update state
            this.assessment.state.revenue = newRevenue;
            console.log(`[ServicesStep] Revenue updated from slider: $${newRevenue}`);
        });
    }
    
    /**
     * Format revenue value for display
     * @param {Number} value - Revenue value in dollars
     * @return {String} - Formatted revenue string
     */
    formatRevenueDisplay(value) {
        if (value >= 1000000) {
            return `$${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `$${(value / 1000).toFixed(1)}K`;
        } else {
            return `$${value}`;
        }
    }
    
    /**
     * Render navigation buttons
     * @return {String} - HTML for navigation buttons
     */
    renderNavigation() {
        return `
            <div class="step-navigation">
                <button id="prev-button" class="btn btn-secondary">Previous</button>
                <button id="next-button" class="btn btn-primary">Next</button>
            </div>
        `;
    }
    
    /**
     * Set up event listeners for this step
     * @param {Element} container - The step container element
     */
    setupEventListeners(container) {
        // Navigation button handlers
        const nextButton = container.querySelector('.btn-next');
        if (nextButton) {
            const nextClickListener = this.handleNext.bind(this);
            nextButton.addEventListener('click', nextClickListener);
            this.cleanupListeners.push(() => nextButton.removeEventListener('click', nextClickListener));
        }
        
        const prevButton = container.querySelector('.btn-prev');
        if (prevButton) {
            const prevClickListener = this.handlePrev.bind(this);
            prevButton.addEventListener('click', prevClickListener);
            this.cleanupListeners.push(() => prevButton.removeEventListener('click', prevClickListener));
        }
    }
    
    /**
     * Clean up event listeners when leaving the step
     */
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => {
            if (typeof cleanup === 'function') {
                cleanup();
            }
        });
        this.cleanupListeners = [];
    }
    
    /**
     * Update the total revenue display
     * @param {Object} serviceRevenue - Object containing service revenue allocations
     */
    updateTotalRevenueDisplay(serviceRevenue) {
        const totalDisplay = document.getElementById('total-revenue-display');
        if (!totalDisplay) return;
        
        // Calculate total revenue percentage
        const totalRevenue = Object.values(serviceRevenue).reduce((sum, value) => sum + value, 0);
        
        // Update display
        totalDisplay.textContent = totalRevenue;
        
        // Update color based on total
        if (totalRevenue === 100) {
            totalDisplay.style.color = '#4caf50'; // Green for exactly 100%
        } else if (totalRevenue > 100) {
            totalDisplay.style.color = '#f44336'; // Red for over 100%
        } else {
            totalDisplay.style.color = '#ffff66'; // Yellow for under 100%
        }
    }
    
    /**
     * Validate the step
     * @return {Boolean} - Whether the step is valid
     */
    validate() {
        console.log('[ServicesStep] Validating step');
        
        // Get the service revenue allocations
        const serviceRevenue = this.assessment.state.serviceRevenue || {};
        
        // Extract selected services (any with non-zero revenue)
        const selectedServices = [];
        let totalRevenue = 0;
        
        Object.entries(serviceRevenue).forEach(([serviceId, value]) => {
            console.log(`[ServicesStep] Service ${serviceId} has revenue allocation ${value}%`);
            
            serviceRevenue[serviceId] = value;
            totalRevenue += value;
            
            // Add to selected services if it has a non-zero value
            if (value > 0) {
                selectedServices.push(serviceId);
                console.log(`[ServicesStep] Added ${serviceId} to selected services (non-zero value)`);
            }
        });
        
        // Save the revenue data to assessment state
        this.assessment.state.serviceRevenue = serviceRevenue;
        this.assessment.state.selectedServices = selectedServices;
        this.assessment.state.totalRevenue = totalRevenue;
        
        console.log('[ServicesStep] Services with non-zero allocations:', selectedServices);
        console.log('[ServicesStep] Service revenue allocations:', serviceRevenue);
        console.log('[ServicesStep] Total revenue:', totalRevenue);
        
        // Check if at least one service is selected
        if (selectedServices.length === 0) {
            console.log('[ServicesStep] Validation failed: No services have allocations');
            const errorElement = document.getElementById('services-error');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            return false;
        }
        
        // Make sure we're explicitly setting the selected services based on non-zero allocations
        console.log('[ServicesStep] Updating assessment state with selected services:', selectedServices);
        
        // Force immediate updates to state
        this.assessment.stateManager.updateState('selectedServices', selectedServices);
        this.assessment.stateManager.updateState('serviceRevenue', serviceRevenue);
        this.assessment.stateManager.updateState('totalRevenue', totalRevenue);
        
        // Log current state for debugging
        console.log('[ServicesStep] Current assessment state:', this.assessment.state);
        
        // Always save state before proceeding
        this.assessment.stateManager.saveState();
        return true;
    }
    
    /**
     * Handle next button click
     * @param {Event} event - Click event
     */
    handleNext(event) {
        console.log('[ServicesStep] Next button clicked');
        
        // Check if we have a revenue allocation
        const serviceRevenue = this.assessment.state.serviceRevenue || {};
        const totalRevenue = Object.values(serviceRevenue).reduce((sum, value) => sum + value, 0);
        
        console.log(`[ServicesStep] Total revenue allocated: ${totalRevenue}`);
        
        // Ensure the revenue allocation adds up to 100% before proceeding
        if (totalRevenue < 100) {
            // Show a warning message about revenue allocation
            const errorElement = document.getElementById('services-error');
            if (errorElement) {
                errorElement.textContent = `Please allocate 100% of your revenue. Currently allocated: ${totalRevenue}%`;
                errorElement.style.display = 'block';
            }
            return false;
        }
        
        if (this.validate()) {
            // Force immediate state update before navigation
            this.assessment.stateManager.saveState();
            console.log('[ServicesStep] Navigation validated, proceeding to next step');
            this.onNext();
            this.assessment.nextStep();
        }
    }
    
    /**
     * Handle previous button click
     * @param {Event} event - Click event
     */
    handlePrev(event) {
        event.preventDefault();
        this.onPrevious();
        this.assessment.previousStep();
    }
    
    /**
     * Actions to perform when moving to the next step
     */
    onNext() {
        // Clean up event listeners
        this.cleanupEventListeners();
    }
    
    /**
     * Actions to perform when moving to the previous step
     */
    onPrevious() {
        // Clean up event listeners
        this.cleanupEventListeners();
    }
}

// Export default
export default ServicesStep;
