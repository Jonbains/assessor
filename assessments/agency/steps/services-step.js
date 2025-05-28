/**
 * Assessment Framework - Services Step
 * 
 * Implements the services selection step with integrated revenue allocation
 * for the agency assessment.
 * Integrates with the ServicesSelector component which combines both
 * service selection and revenue allocation in a single step.
 */

import { StepBase } from '../../../core/step-base.js';
import { addEvent } from '../../../shared/utils/event-manager.js';
import { formatPercentage } from '../../../shared/utils/formatting-utils.js';
// ServicesSelector is loaded as a global object via script tag in the HTML

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
            ],
            totalRevenue: [
                { 
                    type: 'custom', 
                    validator: (value) => value === 100,
                    message: 'Total revenue allocation must equal 100%'
                }
            ]
        };
        
        this.cleanupListeners = [];
        this.servicesSelector = null;
        this.revenueAllocator = null;
    }
    
    /**
     * Render the services step
     * @return {String} - HTML content for the step
     */
    render() {
        // Create a simplified template that will be populated by the original components
        return `
            <div class="assessment-step services-step">
                <!-- Container for the combined services and revenue allocation component -->
                <div id="services-selector-container" class="services-selector-container">
                    <!-- ServicesSelector will render both service selection and revenue allocation here -->
                </div>
                
                <div id="services-error" class="error-message" style="display: none;">
                    Please select at least one service
                </div>
                
                <div id="revenue-error" class="error-message" style="display: none;">
                    Total revenue allocation must equal 100%
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
        
        // We're implementing a simplified version of the services selector directly
        console.log('[ServicesStep] Implementing simplified services selector');
        
        // Get the services from the agency assessment config
        const services = this.assessment.config.services || [];
        console.log('[ServicesStep] Services:', services);
        
        // Get previously selected services and revenue allocation from state
        const selectedServices = this.assessment.state.selectedServices || [];
        const serviceRevenue = this.assessment.state.serviceRevenue || {};
        
        // Create a direct implementation of the services selector
        let html = `
            <div class="services-selection">
                <h3>Select Services</h3>
                <p>Please select the services your agency provides:</p>
                <div class="services-list">
        `;
        
        // Generate services checkboxes
        services.forEach(service => {
            const isChecked = selectedServices.includes(service.id) ? 'checked' : '';
            html += `
                <div class="service-item">
                    <label>
                        <input type="checkbox" name="service" value="${service.id}" ${isChecked}>
                        ${service.name}
                    </label>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
            
            <div class="revenue-allocation" style="margin-top: 20px;">
                <h3>Revenue Allocation</h3>
                <p>Allocate your revenue across selected services:</p>
                <div class="revenue-sliders">
        `;
        
        // Generate revenue sliders for selected services
        selectedServices.forEach(serviceId => {
            const service = services.find(s => s.id === serviceId) || { name: serviceId };
            const value = serviceRevenue[serviceId] || 0;
            
            html += `
                <div class="revenue-slider-item" data-service-id="${serviceId}">
                    <label>${service.name}</label>
                    <div class="slider-container">
                        <input type="range" min="0" max="100" value="${value}" class="revenue-slider">
                        <span class="revenue-value">${value}%</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="revenue-total">
                    <p>Total: <span id="revenue-total-value">0</span>%</p>
                </div>
            </div>
        `;
        
        // Insert into the container
        selectorContainer.innerHTML = html;
        
        // Setup event handlers
        const checkboxes = selectorContainer.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                const serviceId = e.target.value;
                const isChecked = e.target.checked;
                
                // Update selected services
                let updatedServices = [...selectedServices];
                
                if (isChecked && !updatedServices.includes(serviceId)) {
                    updatedServices.push(serviceId);
                } else if (!isChecked && updatedServices.includes(serviceId)) {
                    updatedServices = updatedServices.filter(id => id !== serviceId);
                }
                
                // Update state
                this.assessment.state.selectedServices = updatedServices;
                this.assessment.stateManager.saveState();
                
                // Refresh the component to show/hide revenue sliders
                this.afterRender(container);
            });
        });
        
        // Setup revenue sliders
        const sliders = selectorContainer.querySelectorAll('.revenue-slider');
        const totalDisplay = selectorContainer.querySelector('#revenue-total-value');
        
        const updateTotal = () => {
            let total = 0;
            const newServiceRevenue = {};
            
            sliders.forEach(slider => {
                const serviceId = slider.closest('.revenue-slider-item').dataset.serviceId;
                const value = parseInt(slider.value, 10);
                newServiceRevenue[serviceId] = value;
                total += value;
            });
            
            totalDisplay.textContent = total;
            totalDisplay.style.color = Math.abs(total - 100) <= 1 ? 'green' : 'red';
            
            // Update state
            this.assessment.state.serviceRevenue = newServiceRevenue;
            this.assessment.state.totalRevenue = total;
            this.assessment.stateManager.saveState();
        };
        
        sliders.forEach(slider => {
            slider.addEventListener('input', (e) => {
                const valueDisplay = e.target.nextElementSibling;
                valueDisplay.textContent = `${e.target.value}%`;
                updateTotal();
            });
        });
        
        // Initialize total
        updateTotal();
        
        // Set up event listeners
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
                <button class="btn btn-primary btn-next">Next</button>
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
     * Clean up event listeners when leaving this step
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
     * Handle next button click
     * @param {Event} event - Click event
     */
    handleNext(event) {
        event.preventDefault();
        
        // Get the current selected services and revenue allocations
        const selectedServices = this.assessment.state.selectedServices || [];
        const serviceRevenue = this.assessment.state.serviceRevenue || {};
        
        // Validate that at least one service is selected
        if (selectedServices.length === 0) {
            const errorElement = document.getElementById('services-error');
            if (errorElement) {
                errorElement.style.display = 'block';
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        
        // Validate that revenue allocations exist for all selected services
        const missingRevenue = selectedServices.some(serviceId => {
            return serviceRevenue[serviceId] === undefined || serviceRevenue[serviceId] === null;
        });
        
        if (missingRevenue) {
            const errorElement = document.getElementById('revenue-error');
            if (errorElement) {
                errorElement.style.display = 'block';
                errorElement.textContent = 'Please allocate revenue for all selected services.';
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        
        // Validate that revenue allocations add up to 100%
        const totalRevenue = Object.values(serviceRevenue).reduce((sum, val) => sum + Number(val), 0);
        if (Math.abs(totalRevenue - 100) > 0.1) { // Allow a small margin of error for floating point
            const errorElement = document.getElementById('revenue-error');
            if (errorElement) {
                errorElement.style.display = 'block';
                errorElement.textContent = `Total revenue must equal 100%. Current total: ${totalRevenue.toFixed(1)}%`;
                errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
        
        // Save the state and proceed to the next step
        this.assessment.state.totalRevenue = 100; // Set to exactly 100 to avoid precision issues
        this.assessment.stateManager.saveState();
        this.assessment.nextStep();
        return true;
    }
    
    /**
     * Handle previous button click
     * @param {Event} event - Click event
     */
    handlePrev(event) {
        event.preventDefault();
        this.assessment.previousStep();
    }
    
    /**
     * Validate the step
     * @return {Boolean} - True if the step is valid
     */
    validate() {
        console.log('[ServicesStep] Validating step');
        const selectedServices = this.assessment.state.selectedServices || [];
        
        console.log('[ServicesStep] Selected services:', selectedServices);
        
        // Check if at least one service is selected
        if (selectedServices.length === 0) {
            console.log('[ServicesStep] Validation failed: No services selected');
            const errorElement = document.getElementById('services-error');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            return false;
        }
        
        // Calculate total revenue
        const serviceRevenue = this.assessment.state.serviceRevenue || {};
        console.log('[ServicesStep] Service revenue:', serviceRevenue);
        
        const totalRevenue = Object.values(serviceRevenue).reduce((sum, val) => sum + Number(val), 0);
        console.log('[ServicesStep] Total revenue:', totalRevenue);
        
        // If services are selected but no revenue is allocated, auto-allocate equally
        if (totalRevenue === 0 && selectedServices.length > 0) {
            console.log('[ServicesStep] Auto-allocating revenue equally');
            const equalShare = Math.floor(100 / selectedServices.length);
            const remainder = 100 - (equalShare * selectedServices.length);
            
            selectedServices.forEach((serviceId, index) => {
                // Add the remainder to the first service to ensure total is 100%
                serviceRevenue[serviceId] = equalShare + (index === 0 ? remainder : 0);
            });
            
            // Update state
            this.assessment.state.serviceRevenue = serviceRevenue;
            this.assessment.state.totalRevenue = 100;
            this.assessment.stateManager.saveState();
            
            console.log('[ServicesStep] Auto-allocated revenue:', serviceRevenue);
            return true;
        }
        
        // Check if total revenue equals 100%
        if (Math.abs(totalRevenue - 100) > 0.1) {
            console.log('[ServicesStep] Validation failed: Total revenue not 100%');
            const errorElement = document.getElementById('revenue-error');
            if (errorElement) {
                errorElement.style.display = 'block';
                errorElement.textContent = `Total revenue must equal 100%. Current total: ${totalRevenue.toFixed(1)}%`;
            }
            return false;
        }
        
        console.log('[ServicesStep] Validation passed');
        return true;
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
