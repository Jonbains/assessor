/**
 * Services Selector Component
 * 
 * Allows users to select services and allocate revenue percentages.
 * Combines the services selection and revenue allocation into a single step.
 */

class ServicesSelector {
  /**
   * Create a services selector component
   * @param {Object} options - Component options
   * @param {HTMLElement} options.container - Container element
   * @param {Object} options.eventBus - Event bus for communication
   * @param {Object} options.engine - Assessment engine
   * @param {Object} options.state - Current assessment state
   * @param {Object} options.config - Assessment configuration
   */
  constructor(options) {
    this.container = options.container;
    this.eventBus = options.eventBus;
    this.engine = options.engine;
    this.state = options.state || {};
    this.config = options.config || {};
    
    // Initialize revenue data structure
    this.serviceRevenue = {};
    
    // Keep track of raw slider values (0-100)
    this.rawValues = {};
    
    // Try to load saved values from storage
    try {
      const savedRawValues = localStorage.getItem('serviceRawValues');
      if (savedRawValues) {
        this.rawValues = JSON.parse(savedRawValues);
        console.log('[ServicesSelector] Loaded raw values from localStorage');
      }
    } catch (e) {
      console.warn('[ServicesSelector] Could not load raw values from localStorage:', e);
    }
    
    // Bind methods
    this.handleServiceSelection = this.handleServiceSelection.bind(this);
    this.redistributeRevenue = this.redistributeRevenue.bind(this);
    this.increaseValue = this.increaseValue.bind(this);
    this.decreaseValue = this.decreaseValue.bind(this);
    this.updateSlider = this.updateSlider.bind(this);
    this.balanceSliders = this.balanceSliders.bind(this);
  }
  
  /**
   * Handle service selection
   * @param {Event} event - Change event
   */
  handleServiceSelection(event) {
    const checkbox = event.target;
    const serviceId = checkbox.value;
    
    // Get current selected services
    let selectedServices = [...(this.state.selectedServices || [])];
    
    if (checkbox.checked) {
      // Add service if not already in array
      if (!selectedServices.includes(serviceId)) {
        selectedServices.push(serviceId);
      }
      
      // Initialize revenue slider for this service
      if (typeof this.rawValues[serviceId] === 'undefined') {
        this.rawValues[serviceId] = Math.floor(100 / selectedServices.length);
      }
      
      // Show the revenue slider for this service
      const sliderContainer = this.container.querySelector(`.revenue-slider-container[data-service="${serviceId}"]`);
      if (sliderContainer) {
        sliderContainer.style.display = 'grid';
      }
    } else {
      // Remove service from array
      selectedServices = selectedServices.filter(id => id !== serviceId);
      
      // Hide the revenue slider for this service
      const sliderContainer = this.container.querySelector(`.revenue-slider-container[data-service="${serviceId}"]`);
      if (sliderContainer) {
        sliderContainer.style.display = 'none';
      }
    }
    
    // Update state
    this.eventBus.emit('data:update', {
      selectedServices: selectedServices
    });
    
    // Recalculate revenue distribution
    this.redistributeRevenue();
    
    console.log(`[ServicesSelector] Selected services: ${selectedServices.join(', ')}`);
  }
  
  /**
   * Redistribute revenue percentages across selected services
   */
  redistributeRevenue() {
    const selectedServices = this.state.selectedServices || [];
    
    if (selectedServices.length === 0) {
      return;
    }
    
    // Get all currently selected services
    const nonZeroServices = selectedServices.filter(service => 
      typeof this.rawValues[service] !== 'undefined' && this.rawValues[service] > 0
    );
    
    if (nonZeroServices.length === 0) {
      // Distribute evenly if no services have values
      const equalValue = Math.floor(100 / selectedServices.length);
      selectedServices.forEach(service => {
        this.rawValues[service] = equalValue;
      });
    } else {
      // Check if any selected services don't have values
      selectedServices.forEach(service => {
        if (typeof this.rawValues[service] === 'undefined' || this.rawValues[service] === 0) {
          // Give a minimal value to new services
          this.rawValues[service] = 10;
          
          // Reduce from others proportionally
          this.balanceSliders(service, 10);
        }
      });
    }
    
    // Normalize values
    this.normalizeRevenueValues();
    
    // Update all sliders
    this.updateAllSliders();
    
    // Update revenue in state
    this.saveRevenueToState();
  }
  
  /**
   * Balance sliders to ensure total is 100%
   * @param {string} changedServiceId - ID of the service that changed
   * @param {number} newValue - New value for the changed service
   */
  balanceSliders(changedServiceId, newValue) {
    const selectedServices = this.state.selectedServices || [];
    
    if (selectedServices.length <= 1) {
      return;
    }
    
    // Get the old value
    const oldValue = this.rawValues[changedServiceId] || 0;
    
    // Calculate the difference
    const difference = newValue - oldValue;
    
    if (difference === 0) {
      return;
    }
    
    // If increasing, decrease others proportionally
    if (difference > 0) {
      // Get other services that have values greater than 0
      const otherServices = selectedServices.filter(service => 
        service !== changedServiceId && this.rawValues[service] > 0
      );
      
      if (otherServices.length === 0) {
        return;
      }
      
      // Calculate total value of other services
      const totalOtherValues = otherServices.reduce((sum, service) => 
        sum + (this.rawValues[service] || 0), 0
      );
      
      // Distribute the difference proportionally
      otherServices.forEach(service => {
        const proportion = this.rawValues[service] / totalOtherValues;
        this.rawValues[service] -= Math.round(difference * proportion);
        
        // Ensure no negative values
        if (this.rawValues[service] < 0) {
          this.rawValues[service] = 0;
        }
      });
    }
    // If decreasing, increase others proportionally
    else {
      // Get other services
      const otherServices = selectedServices.filter(service => service !== changedServiceId);
      
      if (otherServices.length === 0) {
        return;
      }
      
      // Calculate total value of other services
      const totalOtherValues = otherServices.reduce((sum, service) => 
        sum + (this.rawValues[service] || 0), 0
      );
      
      // Distribute the difference proportionally
      otherServices.forEach(service => {
        const proportion = totalOtherValues === 0 ? 
          1 / otherServices.length : 
          (this.rawValues[service] || 0) / totalOtherValues;
        
        this.rawValues[service] -= Math.round(difference * proportion);
      });
    }
    
    // Update the changed service
    this.rawValues[changedServiceId] = newValue;
  }
  
  /**
   * Normalize revenue values to sum to 100%
   */
  normalizeRevenueValues() {
    const selectedServices = this.state.selectedServices || [];
    
    if (selectedServices.length === 0) {
      return;
    }
    
    // Calculate total raw value
    const totalRawValue = selectedServices.reduce((sum, service) => 
      sum + (this.rawValues[service] || 0), 0
    );
    
    if (totalRawValue === 0) {
      // If all values are 0, distribute evenly
      const equalValue = Math.floor(100 / selectedServices.length);
      selectedServices.forEach(service => {
        this.rawValues[service] = equalValue;
      });
      return;
    }
    
    // Normalize to percentages
    selectedServices.forEach(service => {
      this.serviceRevenue[service] = Math.round((this.rawValues[service] / totalRawValue) * 100);
    });
    
    // Ensure percentages sum to 100%
    let totalPercent = selectedServices.reduce((sum, service) => 
      sum + (this.serviceRevenue[service] || 0), 0
    );
    
    // Adjust for rounding errors
    if (totalPercent !== 100 && selectedServices.length > 0) {
      // Add or subtract the difference from the first service
      this.serviceRevenue[selectedServices[0]] += (100 - totalPercent);
    }
    
    // Save to localStorage
    try {
      localStorage.setItem('serviceRawValues', JSON.stringify(this.rawValues));
    } catch (e) {
      console.warn('[ServicesSelector] Could not save to localStorage:', e);
    }
  }
  
  /**
   * Save revenue data to state
   */
  saveRevenueToState() {
    // Create a clean copy to avoid reference issues
    const serviceRevenueForState = {};
    Object.keys(this.serviceRevenue).forEach(key => {
      serviceRevenueForState[key] = this.serviceRevenue[key];
    });
    
    // Update state
    this.eventBus.emit('data:update', {
      serviceRevenue: serviceRevenueForState
    });
    
    console.log('[ServicesSelector] Updated revenue in state:', serviceRevenueForState);
  }
  
  /**
   * Handle increase button click
   * @param {Event} event - Click event
   */
  increaseValue(event) {
    const service = event.target.getAttribute('data-service');
    if (!service) return;
    
    // Increase value by 5%
    const currentValue = this.rawValues[service] || 0;
    const newValue = Math.min(currentValue + 5, 100);
    
    // Balance sliders
    this.balanceSliders(service, newValue);
    
    // Normalize values
    this.normalizeRevenueValues();
    
    // Update all sliders
    this.updateAllSliders();
    
    // Update revenue in state
    this.saveRevenueToState();
  }
  
  /**
   * Handle decrease button click
   * @param {Event} event - Click event
   */
  decreaseValue(event) {
    const service = event.target.getAttribute('data-service');
    if (!service) return;
    
    // Decrease value by 5%
    const currentValue = this.rawValues[service] || 0;
    const newValue = Math.max(currentValue - 5, 0);
    
    // Balance sliders
    this.balanceSliders(service, newValue);
    
    // Normalize values
    this.normalizeRevenueValues();
    
    // Update all sliders
    this.updateAllSliders();
    
    // Update revenue in state
    this.saveRevenueToState();
  }
  
  /**
   * Update slider value for a service
   * @param {string} service - Service ID
   */
  updateSlider(service) {
    const slider = this.container.querySelector(`.revenue-slider[data-service="${service}"]`);
    const percentageDisplay = this.container.querySelector(`.revenue-percentage[data-service="${service}"]`);
    
    if (slider) {
      slider.value = this.rawValues[service] || 0;
    }
    
    if (percentageDisplay) {
      percentageDisplay.textContent = `${this.serviceRevenue[service] || 0}%`;
    }
  }
  
  /**
   * Update all sliders
   */
  updateAllSliders() {
    const selectedServices = this.state.selectedServices || [];
    selectedServices.forEach(service => {
      this.updateSlider(service);
    });
  }
  
  /**
   * Validate the component
   * @returns {boolean} - Whether the component is valid
   */
  validate() {
    return this.state.selectedServices && this.state.selectedServices.length > 0;
  }
  
  /**
   * Render the component
   */
  render() {
    // Clear container
    this.container.innerHTML = '';
    
    // Create title
    const title = document.createElement('h2');
    title.className = 'assessment-step-title';
    title.textContent = 'Select Services & Allocate Revenue';
    this.container.appendChild(title);
    
    // Create description
    const description = document.createElement('p');
    description.className = 'assessment-step-description';
    description.textContent = 'Select the services your agency offers and allocate revenue percentages:';
    this.container.appendChild(description);
    
    // Check if services are available in config
    if (!this.config.services || this.config.services.length === 0) {
      const errorMessage = document.createElement('p');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'No services available in configuration.';
      errorMessage.style.color = 'red';
      this.container.appendChild(errorMessage);
      return;
    }
    
    // Create services container
    const servicesContainer = document.createElement('div');
    servicesContainer.className = 'services-container';
    servicesContainer.style.marginTop = '20px';
    
    // Create services section
    const servicesSection = document.createElement('div');
    servicesSection.className = 'services-section';
    
    // Group services by category if available
    const servicesByCategory = {};
    
    this.config.services.forEach(service => {
      const category = service.category || 'Other Services';
      if (!servicesByCategory[category]) {
        servicesByCategory[category] = [];
      }
      servicesByCategory[category].push(service);
    });
    
    // Create sections for each category
    Object.keys(servicesByCategory).forEach(category => {
      // Create category header
      const categoryHeader = document.createElement('h3');
      categoryHeader.className = 'service-category-header';
      categoryHeader.textContent = category;
      categoryHeader.style.marginTop = '20px';
      categoryHeader.style.marginBottom = '10px';
      categoryHeader.style.fontSize = '18px';
      categoryHeader.style.color = '#333';
      servicesSection.appendChild(categoryHeader);
      
      // Create grid for services in this category
      const servicesGrid = document.createElement('div');
      servicesGrid.className = 'services-grid';
      servicesGrid.style.display = 'grid';
      servicesGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
      servicesGrid.style.gap = '15px';
      
      // Add services in this category
      servicesByCategory[category].forEach(service => {
        const serviceCard = document.createElement('div');
        serviceCard.className = 'service-card';
        serviceCard.style.padding = '15px';
        serviceCard.style.border = '1px solid #ddd';
        serviceCard.style.borderRadius = '8px';
        serviceCard.style.backgroundColor = '#f9f9f9';
        
        // Create checkbox for selection
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `service-${service.id}`;
        checkbox.value = service.id;
        checkbox.className = 'service-checkbox';
        checkbox.style.marginRight = '10px';
        
        // Check if service is already selected
        if (this.state.selectedServices && this.state.selectedServices.includes(service.id)) {
          checkbox.checked = true;
        }
        
        // Add event listener
        checkbox.addEventListener('change', this.handleServiceSelection);
        
        // Create label
        const label = document.createElement('label');
        label.htmlFor = `service-${service.id}`;
        label.className = 'service-label';
        label.style.fontWeight = 'bold';
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(service.name));
        
        serviceCard.appendChild(label);
        
        // Add risk level if available
        if (service.riskLevel) {
          const riskLevel = document.createElement('div');
          riskLevel.className = 'service-risk-level';
          riskLevel.textContent = `Risk Level: ${service.riskLevel}`;
          riskLevel.style.marginTop = '10px';
          riskLevel.style.fontSize = '14px';
          riskLevel.style.color = '#666';
          serviceCard.appendChild(riskLevel);
        }
        
        servicesGrid.appendChild(serviceCard);
      });
      
      servicesSection.appendChild(servicesGrid);
    });
    
    servicesContainer.appendChild(servicesSection);
    
    // Create revenue allocation section
    const revenueSection = document.createElement('div');
    revenueSection.className = 'revenue-section';
    revenueSection.style.marginTop = '30px';
    
    // Create revenue section header
    const revenueHeader = document.createElement('h3');
    revenueHeader.className = 'revenue-section-header';
    revenueHeader.textContent = 'Revenue Allocation';
    revenueHeader.style.marginBottom = '15px';
    revenueHeader.style.fontSize = '18px';
    revenueSection.appendChild(revenueHeader);
    
    // Create revenue description
    const revenueDescription = document.createElement('p');
    revenueDescription.className = 'revenue-description';
    revenueDescription.textContent = 'Allocate the percentage of revenue for each selected service:';
    revenueDescription.style.marginBottom = '20px';
    revenueDescription.style.fontSize = '14px';
    revenueSection.appendChild(revenueDescription);
    
    // Create revenue slider container
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'revenue-sliders-container';
    sliderContainer.style.display = 'flex';
    sliderContainer.style.flexDirection = 'column';
    sliderContainer.style.gap = '15px';
    
    // Create sliders for each service
    this.config.services.forEach(service => {
      const sliderRow = document.createElement('div');
      sliderRow.className = 'revenue-slider-container';
      sliderRow.setAttribute('data-service', service.id);
      sliderRow.style.display = 'grid';
      sliderRow.style.gridTemplateColumns = '150px 30px 1fr 30px 50px';
      sliderRow.style.alignItems = 'center';
      sliderRow.style.gap = '10px';
      
      // Hide initially if not selected
      if (!this.state.selectedServices || !this.state.selectedServices.includes(service.id)) {
        sliderRow.style.display = 'none';
      }
      
      // Service name in first column
      const label = document.createElement('label');
      label.textContent = service.name;
      label.style.fontWeight = 'bold';
      label.style.gridColumn = '1';
      sliderRow.appendChild(label);
      
      // Minus button in second column
      const minusButton = document.createElement('button');
      minusButton.className = 'slider-button';
      minusButton.textContent = '-';
      minusButton.setAttribute('data-service', service.id);
      minusButton.addEventListener('click', this.decreaseValue);
      minusButton.style.width = '30px';
      minusButton.style.height = '30px';
      minusButton.style.borderRadius = '4px';
      minusButton.style.border = '1px solid #ccc';
      minusButton.style.background = '#f8f8f8';
      minusButton.style.cursor = 'pointer';
      minusButton.style.gridColumn = '2';
      sliderRow.appendChild(minusButton);
      
      // Slider in third column
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = 0;
      slider.max = 100;
      slider.value = this.rawValues[service.id] || 0;
      slider.className = 'revenue-slider';
      slider.setAttribute('data-service', service.id);
      slider.style.width = '100%';
      slider.style.gridColumn = '3';
      slider.style.height = '10px';
      
      // Handle slider input (live updates while dragging)
      slider.addEventListener('input', (event) => {
        const value = parseInt(event.target.value);
        this.rawValues[service.id] = value;
        
        // Calculate new percentages and update displays
        this.normalizeRevenueValues();
        this.updateAllSliders();
      });
      
      // Handle slider change (final value when released)
      slider.addEventListener('change', (event) => {
        const value = parseInt(event.target.value);
        this.rawValues[service.id] = value;
        
        // Balance other sliders
        this.balanceSliders(service.id, value);
        
        // Recalculate percentages and update displays
        this.normalizeRevenueValues();
        this.updateAllSliders();
        
        // Update state
        this.saveRevenueToState();
      });
      
      sliderRow.appendChild(slider);
      
      // Plus button in fourth column
      const plusButton = document.createElement('button');
      plusButton.className = 'slider-button';
      plusButton.textContent = '+';
      plusButton.setAttribute('data-service', service.id);
      plusButton.addEventListener('click', this.increaseValue);
      plusButton.style.width = '30px';
      plusButton.style.height = '30px';
      plusButton.style.borderRadius = '4px';
      plusButton.style.border = '1px solid #ccc';
      plusButton.style.background = '#f8f8f8';
      plusButton.style.cursor = 'pointer';
      plusButton.style.gridColumn = '4';
      sliderRow.appendChild(plusButton);
      
      // Percentage display in fifth column
      const percentageDisplay = document.createElement('div');
      percentageDisplay.className = 'revenue-percentage';
      percentageDisplay.setAttribute('data-service', service.id);
      percentageDisplay.textContent = `${this.serviceRevenue[service.id] || 0}%`;
      percentageDisplay.style.fontWeight = 'bold';
      percentageDisplay.style.gridColumn = '5';
      percentageDisplay.style.minWidth = '40px';
      sliderRow.appendChild(percentageDisplay);
      
      sliderContainer.appendChild(sliderRow);
    });
    
    revenueSection.appendChild(sliderContainer);
    
    // Add a helper text for the user
    const helperText = document.createElement('p');
    helperText.className = 'revenue-allocator-helper';
    helperText.innerHTML = '<strong>Note:</strong> These percentages will be used to calculate your agency\'s risk profile in the assessment results.';
    helperText.style.marginTop = '20px';
    helperText.style.fontSize = '14px';
    helperText.style.color = '#666';
    revenueSection.appendChild(helperText);
    
    servicesContainer.appendChild(revenueSection);
    
    this.container.appendChild(servicesContainer);
    
    // Initialize revenue values if needed
    this.redistributeRevenue();
    this.updateAllSliders();
  }
}

// Register component in the global namespace
(function() {
  // Initialize namespace
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
  window.AssessmentFramework.Components.agency = window.AssessmentFramework.Components.agency || {};
  
  // Register component
  window.AssessmentFramework.Components.agency.ServicesSelector = ServicesSelector;
  
  console.log('[ServicesSelector] Component registered successfully');
})();
