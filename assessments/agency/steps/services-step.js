/**
 * Assessment Framework - Services Step
 * 
 * Implements the services selection step with integrated revenue allocation
 * for the agency assessment
 */

import { StepBase } from '../../../core/step-base.js';
import { addEvent } from '../../../shared/utils/event-manager.js';
import { formatPercentage } from '../../../shared/utils/formatting-utils.js';

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
        this.changedServiceId = null;
    }
    
    /**
     * Render the services step
     * @return {String} - HTML content for the step
     */
    render() {
        const { config, state } = this.assessment;
        const services = config.services || [];
        
        // Build HTML for service options with revenue sliders
        let servicesOptions = '';
        
        services.forEach((service) => {
            const isSelected = state.selectedServices.includes(service.id);
            const selectedClass = isSelected ? 'selected' : '';
            const checkedAttr = isSelected ? 'checked' : '';
            
            // Get revenue percentage for this service (default to 0)
            const revenuePercent = state.serviceRevenue[service.id] || 0;
            
            // Determine the risk level class
            const riskLevelClass = this.getRiskLevelClass(service.riskLevel);
            
            servicesOptions += `
                <div class="service-option ${selectedClass}" data-service-id="${service.id}">
                    <div class="service-header">
                        <input type="checkbox" id="service-${service.id}" 
                            class="service-checkbox" 
                            data-service-id="${service.id}" ${checkedAttr}>
                        <label for="service-${service.id}" class="service-name">${service.name}</label>
                        <span class="risk-level ${riskLevelClass}">${service.riskLevel || ''}</span>
                    </div>
                    <div class="service-details">
                        <div class="service-description">
                            <div class="disruption-timeline">
                                <span class="label">Disruption Timeline:</span> 
                                <span class="value">${service.disruptionTimeline || 'Unknown'}</span>
                            </div>
                        </div>
                        <div class="revenue-allocation" style="${!isSelected ? 'display: none;' : ''}">
                            <div class="slider-container">
                                <input type="range" 
                                    class="revenue-slider" 
                                    data-service-id="${service.id}" 
                                    min="0" max="100" value="${revenuePercent}">
                                <div class="revenue-percentage" data-service-id="${service.id}">${formatPercentage(revenuePercent)}</div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
        });
        
        // Build complete step HTML
        return `
            <div class="assessment-step services-step">
                <h2>Select Your Agency's Services</h2>
                <p class="step-description">
                    Select all services that your agency offers to clients and allocate the approximate percentage of revenue each service contributes to your business.
                </p>
                
                <div class="services-selection">
                    ${servicesOptions}
                </div>
                
                <div class="revenue-allocation-summary">
                    <div class="total-revenue">
                        <span class="label">Total:</span>
                        <span id="total-revenue-percentage" class="value">${formatPercentage(this.calculateTotalRevenue())}</span>
                    </div>
                    <div id="total-revenue-error" class="error-message" style="display: none;">
                        Please ensure total allocation equals 100%
                    </div>
                </div>
                
                <div id="services-error" class="error-message" style="display: none;">
                    Please select at least one service to continue
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
        // Click handler for service checkboxes
        const serviceCheckboxes = container.querySelectorAll('.service-checkbox');
        serviceCheckboxes.forEach(checkbox => {
            const cleanup = addEvent(checkbox, 'change', this.handleServiceSelection.bind(this));
            this.cleanupListeners.push(cleanup);
        });
        
        // Change handler for revenue sliders
        const revenueSliders = container.querySelectorAll('.revenue-slider');
        revenueSliders.forEach(slider => {
            const cleanup = addEvent(slider, 'input', this.handleRevenueChange.bind(this));
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
     * Handle service selection
     * @param {Event} event - Change event
     */
    handleServiceSelection(event) {
        const checkbox = event.target;
        const serviceId = checkbox.dataset.serviceId;
        const isSelected = checkbox.checked;
        
        // Update selected services in state
        if (isSelected) {
            if (!this.assessment.state.selectedServices.includes(serviceId)) {
                this.assessment.state.selectedServices.push(serviceId);
            }
            
            // Show revenue allocation slider
            const revenueAllocation = document.querySelector(`.revenue-allocation[data-service-id="${serviceId}"]`);
            if (revenueAllocation) {
                revenueAllocation.style.display = 'block';
            }
            
            // Update service option UI
            const serviceOption = checkbox.closest('.service-option');
            if (serviceOption) {
                serviceOption.classList.add('selected');
            }
            
            // Initialize revenue for this service if not already set
            if (!this.assessment.state.serviceRevenue[serviceId]) {
                this.assessment.state.serviceRevenue[serviceId] = 0;
            }
            
            // Redistribute revenue
            this.redistributeRevenue();
        } else {
            // Remove from selected services
            this.assessment.state.selectedServices = this.assessment.state.selectedServices.filter(
                id => id !== serviceId
            );
            
            // Hide revenue allocation slider
            const revenueAllocation = document.querySelector(`.revenue-allocation[data-service-id="${serviceId}"]`);
            if (revenueAllocation) {
                revenueAllocation.style.display = 'none';
            }
            
            // Update service option UI
            const serviceOption = checkbox.closest('.service-option');
            if (serviceOption) {
                serviceOption.classList.remove('selected');
            }
            
            // Set revenue for this service to 0
            this.assessment.state.serviceRevenue[serviceId] = 0;
            
            // Redistribute revenue
            this.redistributeRevenue();
        }
        
        // Hide error message if visible
        const errorElement = document.getElementById('services-error');
        if (errorElement && this.assessment.state.selectedServices.length > 0) {
            errorElement.style.display = 'none';
        }
        
        // Save state
        this.assessment.stateManager.saveState();
    }
    
    /**
     * Handle revenue slider change
     * @param {Event} event - Input event
     */
    handleRevenueChange(event) {
        const slider = event.target;
        const serviceId = slider.dataset.serviceId;
        const newValue = parseInt(slider.value, 10);
        
        // Store which service was changed for balancing algorithm
        this.changedServiceId = serviceId;
        
        // Update revenue percentage display
        const percentageElement = document.querySelector(`.revenue-percentage[data-service-id="${serviceId}"]`);
        if (percentageElement) {
            percentageElement.textContent = formatPercentage(newValue);
        }
        
        // Update state
        this.assessment.state.serviceRevenue[serviceId] = newValue;
        
        // Balance other sliders to ensure total is 100%
        this.balanceSliders(serviceId, newValue);
        
        // Update total revenue display
        this.showTotalRevenue();
        
        // Save state
        this.assessment.stateManager.saveState();
    }
    
    /**
     * Redistribute revenue percentages across selected services
     */
    redistributeRevenue() {
        const { selectedServices, serviceRevenue } = this.assessment.state;
        
        // Skip if no services are selected
        if (selectedServices.length === 0) {
            return;
        }
        
        // Calculate equal distribution
        const equalShare = Math.floor(100 / selectedServices.length);
        let remaining = 100 - (equalShare * selectedServices.length);
        
        // Assign equal share to each selected service
        selectedServices.forEach(serviceId => {
            serviceRevenue[serviceId] = equalShare;
            
            // Add remaining points to first services
            if (remaining > 0) {
                serviceRevenue[serviceId]++;
                remaining--;
            }
            
            // Update slider values in UI
            const slider = document.querySelector(`.revenue-slider[data-service-id="${serviceId}"]`);
            if (slider) {
                slider.value = serviceRevenue[serviceId];
            }
            
            // Update percentage display
            const percentageElement = document.querySelector(`.revenue-percentage[data-service-id="${serviceId}"]`);
            if (percentageElement) {
                percentageElement.textContent = formatPercentage(serviceRevenue[serviceId]);
            }
        });
        
        // Set unselected services to 0
        Object.keys(serviceRevenue).forEach(serviceId => {
            if (!selectedServices.includes(serviceId)) {
                serviceRevenue[serviceId] = 0;
            }
        });
        
        // Update total revenue display
        this.showTotalRevenue();
    }
    
    /**
     * Balance sliders to ensure total is 100%
     * @param {String} changedServiceId - ID of the service that was changed
     * @param {Number} newValue - New value for the changed service
     */
    balanceSliders(changedServiceId, newValue) {
        const { selectedServices, serviceRevenue } = this.assessment.state;
        
        // Skip if only one service is selected
        if (selectedServices.length <= 1) {
            return;
        }
        
        // Calculate current total
        let currentTotal = this.calculateTotalRevenue();
        
        // If the total is already 100%, no need to balance
        if (currentTotal === 100) {
            return;
        }
        
        // Calculate how much to adjust (positive if we need to decrease, negative if we need to increase)
        const adjustment = currentTotal - 100;
        
        // Get other services to adjust
        const otherServices = selectedServices.filter(id => id !== changedServiceId);
        
        // If adjustment is positive, we need to decrease other sliders
        if (adjustment > 0) {
            // Sort by value descending to adjust largest values first
            otherServices.sort((a, b) => serviceRevenue[b] - serviceRevenue[a]);
            
            let remainingAdjustment = adjustment;
            
            // Adjust each service
            for (const serviceId of otherServices) {
                if (remainingAdjustment <= 0) break;
                
                const currentValue = serviceRevenue[serviceId];
                const maxDecrease = Math.min(currentValue, remainingAdjustment);
                
                // Decrease this service's value
                serviceRevenue[serviceId] = currentValue - maxDecrease;
                remainingAdjustment -= maxDecrease;
                
                // Update UI
                this.updateServiceSlider(serviceId);
            }
            
            // If we couldn't balance exactly, adjust the changed service
            if (remainingAdjustment > 0) {
                serviceRevenue[changedServiceId] = newValue - remainingAdjustment;
                this.updateServiceSlider(changedServiceId);
            }
        } 
        // If adjustment is negative, we need to increase other sliders
        else if (adjustment < 0) {
            // Sort by value ascending to adjust smallest values first
            otherServices.sort((a, b) => serviceRevenue[a] - serviceRevenue[b]);
            
            let remainingAdjustment = -adjustment;
            
            // Adjust each service
            for (const serviceId of otherServices) {
                if (remainingAdjustment <= 0) break;
                
                const currentValue = serviceRevenue[serviceId];
                const maxIncrease = Math.min(100 - currentValue, remainingAdjustment);
                
                // Increase this service's value
                serviceRevenue[serviceId] = currentValue + maxIncrease;
                remainingAdjustment -= maxIncrease;
                
                // Update UI
                this.updateServiceSlider(serviceId);
            }
            
            // If we couldn't balance exactly, adjust the changed service
            if (remainingAdjustment > 0) {
                serviceRevenue[changedServiceId] = newValue + remainingAdjustment;
                this.updateServiceSlider(changedServiceId);
            }
        }
    }
    
    /**
     * Update a service slider in the UI
     * @param {String} serviceId - Service ID to update
     */
    updateServiceSlider(serviceId) {
        const value = this.assessment.state.serviceRevenue[serviceId];
        
        // Update slider
        const slider = document.querySelector(`.revenue-slider[data-service-id="${serviceId}"]`);
        if (slider) {
            slider.value = value;
        }
        
        // Update percentage display
        const percentageElement = document.querySelector(`.revenue-percentage[data-service-id="${serviceId}"]`);
        if (percentageElement) {
            percentageElement.textContent = formatPercentage(value);
        }
    }
    
    /**
     * Calculate total revenue percentage
     * @return {Number} - Total revenue percentage
     */
    calculateTotalRevenue() {
        const { selectedServices, serviceRevenue } = this.assessment.state;
        let total = 0;
        
        selectedServices.forEach(serviceId => {
            total += serviceRevenue[serviceId] || 0;
        });
        
        return total;
    }
    
    /**
     * Update the total revenue display
     */
    showTotalRevenue() {
        const totalElement = document.getElementById('total-revenue-percentage');
        const total = this.calculateTotalRevenue();
        
        if (totalElement) {
            totalElement.textContent = formatPercentage(total);
            
            // Highlight in red if not 100%
            if (total !== 100) {
                totalElement.classList.add('error');
                
                // Show the error message
                const errorElement = document.getElementById('total-revenue-error');
                if (errorElement) {
                    errorElement.style.display = 'block';
                }
            } else {
                totalElement.classList.remove('error');
                
                // Hide the error message
                const errorElement = document.getElementById('total-revenue-error');
                if (errorElement) {
                    errorElement.style.display = 'none';
                }
            }
        }
    }
    
    /**
     * Determine CSS class based on risk level
     * @param {String} riskLevel - Risk level descriptor
     * @return {String} - CSS class name
     */
    getRiskLevelClass(riskLevel) {
        if (!riskLevel) return '';
        
        const lowerRisk = riskLevel.toLowerCase();
        
        if (lowerRisk.includes('critical') || lowerRisk.includes('very high')) {
            return 'risk-critical';
        } else if (lowerRisk.includes('high')) {
            return 'risk-high';
        } else if (lowerRisk.includes('moderate')) {
            return 'risk-moderate';
        } else if (lowerRisk.includes('low')) {
            return 'risk-low';
        }
        
        return '';
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
        const { selectedServices } = this.assessment.state;
        let isValid = true;
        
        // Check if at least one service is selected
        if (selectedServices.length === 0) {
            // Show error message
            const errorElement = document.getElementById('services-error');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            isValid = false;
        }
        
        // Check if total revenue equals 100%
        if (this.calculateTotalRevenue() !== 100) {
            // Show error message
            const errorElement = document.getElementById('total-revenue-error');
            if (errorElement) {
                errorElement.style.display = 'block';
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
