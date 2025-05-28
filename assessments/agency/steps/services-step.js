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
                
                <div id="services-selector-container" class="services-selector-container">
                    <!-- Dynamic services content will be inserted here -->
                </div>
                
                <div id="services-error" class="error-message" style="display: none;">
                    Please select at least one service
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
            
            // Service name/label section
            const serviceLabel = document.createElement('div');
            serviceLabel.className = 'service-label';
            serviceLabel.style.display = 'flex';
            serviceLabel.style.alignItems = 'center';
            serviceLabel.style.marginBottom = '10px';
            
            // Service name
            const serviceName = document.createElement('span');
            serviceName.textContent = service.name;
            serviceName.style.fontWeight = 'bold';
            
            serviceLabel.appendChild(serviceName);
            
            // Slider controls section
            const sliderControls = document.createElement('div');
            sliderControls.className = 'slider-controls';
            sliderControls.style.display = 'flex';
            sliderControls.style.alignItems = 'center';
            sliderControls.style.justifyContent = 'space-between';
            sliderControls.style.width = '100%';
            
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
                
                // Update the selectedServices array based on non-zero allocation
                let selectedServices = this.assessment.state.selectedServices || [];
                
                if (value > 0) {
                    // Add to selectedServices if not already present
                    if (!selectedServices.includes(service.id)) {
                        selectedServices.push(service.id);
                        console.log(`[ServicesStep] Added ${service.id} to selectedServices:`, selectedServices);
                    }
                } else {
                    // Remove from selectedServices if present
                    const index = selectedServices.indexOf(service.id);
                    if (index !== -1) {
                        selectedServices.splice(index, 1);
                        console.log(`[ServicesStep] Removed ${service.id} from selectedServices:`, selectedServices);
                    }
                }
                
                // Update the service card class
                if (value > 0) {
                    serviceCard.classList.add('service-selected');
                } else {
                    serviceCard.classList.remove('service-selected');
                }
                
                // Update the state
                this.assessment.state.selectedServices = selectedServices;
                this.assessment.stateManager.updateState('selectedServices', selectedServices);
                this.assessment.stateManager.updateState('serviceRevenue', serviceRevenue);
            });
            
            // Button event listeners
            minusBtn.addEventListener('click', () => {
                const newValue = Math.max(0, parseInt(slider.value, 10) - 5);
                slider.value = newValue;
                
                // Update revenue state
                const serviceRevenue = this.assessment.state.serviceRevenue || {};
                serviceRevenue[service.id] = newValue;
                this.assessment.state.serviceRevenue = serviceRevenue;
                
                // Update selectedServices array based on non-zero allocation
                let selectedServices = this.assessment.state.selectedServices || [];
                
                if (newValue > 0) {
                    // Add to selectedServices if not already present
                    if (!selectedServices.includes(service.id)) {
                        selectedServices.push(service.id);
                        console.log(`[ServicesStep] Added ${service.id} to selectedServices:`, selectedServices);
                    }
                } else {
                    // Remove from selectedServices if present
                    const index = selectedServices.indexOf(service.id);
                    if (index !== -1) {
                        selectedServices.splice(index, 1);
                        console.log(`[ServicesStep] Removed ${service.id} from selectedServices:`, selectedServices);
                    }
                }
                
                // Update the service card class
                if (newValue > 0) {
                    serviceCard.classList.add('service-selected');
                } else {
                    serviceCard.classList.remove('service-selected');
                }
                
                // Update the state
                this.assessment.state.selectedServices = selectedServices;
                this.assessment.stateManager.updateState('selectedServices', selectedServices);
                this.assessment.stateManager.updateState('serviceRevenue', serviceRevenue);
            });
            
            plusBtn.addEventListener('click', () => {
                const newValue = Math.min(100, parseInt(slider.value, 10) + 5);
                slider.value = newValue;
                
                // Update revenue state
                const serviceRevenue = this.assessment.state.serviceRevenue || {};
                serviceRevenue[service.id] = newValue;
                this.assessment.state.serviceRevenue = serviceRevenue;
                
                // Update selectedServices array based on non-zero allocation
                let selectedServices = this.assessment.state.selectedServices || [];
                
                if (newValue > 0) {
                    // Add to selectedServices if not already present
                    if (!selectedServices.includes(service.id)) {
                        selectedServices.push(service.id);
                        console.log(`[ServicesStep] Added ${service.id} to selectedServices:`, selectedServices);
                    }
                }
                
                // Update the service card class
                if (newValue > 0) {
                    serviceCard.classList.add('service-selected');
                }
                
                // Update the state
                this.assessment.state.selectedServices = selectedServices;
                this.assessment.stateManager.updateState('selectedServices', selectedServices);
                this.assessment.stateManager.updateState('serviceRevenue', serviceRevenue);
            });
        });
        
        // Set up event listeners for navigation
        this.setupEventListeners(container);
    }
    
    /**
     * Render navigation buttons
     * @return {String} - HTML for navigation buttons
     */
    renderNavigation() {
        return `
            <div class="assessment-navigation">
                <button class="btn btn-secondary btn-prev">Previous</button>
                <button class="btn btn-primary btn-next" style="float: right;">Next</button>
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
     * Validate the step
     * @return {Boolean} - Whether the step is valid
     */
    validate() {
        console.log('[ServicesStep] Validating services step');
        
        // Get all revenue sliders
        const sliders = document.querySelectorAll('.revenue-slider');
        console.log(`[ServicesStep] Found ${sliders.length} sliders to validate`);
        
        // Get current values for all services
        const serviceRevenue = {};
        const selectedServices = [];
        let totalRevenue = 0;
        
        // Loop through sliders and build service revenue object
        sliders.forEach(slider => {
            const serviceId = slider.dataset.serviceId;
            const value = parseInt(slider.value, 10);
            
            console.log(`[ServicesStep] Service ${serviceId} has value: ${value}`);
            
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
        event.preventDefault();
        
        // Validate the step
        if (this.validate()) {
            // Navigate to the next step
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
