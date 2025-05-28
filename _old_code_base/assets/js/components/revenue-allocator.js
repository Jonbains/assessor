/**
 * Revenue Allocator Component
 * 
 * Allows users to allocate revenue percentages across services.
 */

class RevenueAllocator {
  /**
   * @param {HTMLElement} container - Container element
   * @param {Array} services - Array of services
   * @param {Object} engine - Assessment engine
   */
  constructor(container, services, engine) {
    this.container = container;
    this.services = services;
    this.engine = engine;
    
    // Initialize revenue data structure
    this.serviceRevenue = {};
    
    // Keep track of raw slider values (0-100)
    this.rawValues = {};
    
    // Try to load saved values from storage
    try {
      const savedRawValues = localStorage.getItem('serviceRawValues');
      if (savedRawValues) {
        this.rawValues = JSON.parse(savedRawValues);
        console.log('[RevenueAllocator] Loaded raw values from localStorage');
      }
    } catch (e) {
      console.warn('[RevenueAllocator] Could not load raw values from localStorage:', e);
    }
    
    // Initialize any missing values
    let needsInitialization = false;
    this.services.forEach(service => {
      if (typeof this.rawValues[service] === 'undefined') {
        // Set default values that distribute evenly across services
        this.rawValues[service] = Math.floor(100 / this.services.length);
        needsInitialization = true;
      }
    });
    
    // Immediately calculate and store the normalized percentages
    this.calculatePercentages();
    
    // Render the component
    this.render();
    
    // Force an update to the engine after rendering
    if (needsInitialization) {
      this.forceEngineUpdate();
    }
  }
  
  /**
   * Calculate percentages from raw values
   */
  calculatePercentages() {
    console.log('[DEBUG-REVENUE] RevenueAllocator.calculatePercentages called');
    console.log('[DEBUG-REVENUE] Raw slider values:', JSON.stringify(this.rawValues));
    
    // Log the service names for comparison
    console.log('[DEBUG-REVENUE] Service names in allocator:', this.services);
    
    // Sum up all raw values
    const totalRawValue = Object.values(this.rawValues).reduce((sum, val) => sum + val, 0);
    
    if (totalRawValue > 0) {
      // Create a separate object for percentages
      const percentages = {};
      
      // Calculate normalized percentages for each service
      this.services.forEach(service => {
        // Round to the nearest integer percentage
        percentages[service] = Math.round((this.rawValues[service] / totalRawValue) * 100);
      });
      
      // Make sure percentages add up to exactly 100%
      let totalPercent = Object.values(percentages).reduce((sum, val) => sum + val, 0);
      
      // Adjust for rounding errors to ensure total is exactly 100%
      if (totalPercent !== 100 && this.services.length > 0) {
        // Add or subtract the difference from the first service
        percentages[this.services[0]] += (100 - totalPercent);
      }
      
      // Store the percentages
      this.serviceRevenue = percentages;
      
      // Create a clean new object to avoid reference issues
      const serviceRevenueForEngine = {};
      Object.keys(percentages).forEach(key => {
        serviceRevenueForEngine[key] = percentages[key];
      });
      
      console.log('[RevenueAllocator] Final percentages:', JSON.stringify(serviceRevenueForEngine));
      
      return serviceRevenueForEngine;
    }
    
    return {};
  }
  
  /**
   * Get standardized service key for consistency
   * @param {string} serviceInput - The service name which might have different formats
   * @returns {string} - Standardized service key 
   */
  getStandardServiceKey(serviceInput) {
    if (!serviceInput) return '';
    
    // Convert to lowercase for consistent matching
    const serviceLower = serviceInput.toLowerCase();
    
    // Service key mapping - matches the one in RiskTable
    const serviceKeyMap = {
      'digital marketing': 'digital',
      'digital': 'digital',
      'media services': 'media', 
      'media': 'media',
      'creative services': 'creative',
      'creative': 'creative',
      'content development': 'content',
      'content': 'content',
      'pr & communications': 'pr',
      'pr': 'pr',
      'strategy & consulting': 'strategy',
      'strategy': 'strategy',
      'data & analytics': 'data',
      'data': 'data',
      'technical development': 'tech',
      'tech': 'tech',
      'commerce/ecommerce': 'commerce',
      'commerce': 'commerce'
    };
    
    return serviceKeyMap[serviceLower] || serviceLower;
  }
  
  /**
   * Force an update to the engine
   */
  forceEngineUpdate() {
    if (!this.engine) {
      console.warn('[RevenueAllocator] No engine instance to update');
      return;
    }
    
    try {
      // Calculate percentages
      const revenuePercentages = this.calculatePercentages();
      
      // Save to storage
      this.saveToStorage(revenuePercentages);
      
      // Create standardized version for engine
      const standardizedRevenue = {};
      
      // Convert keys to standard format
      Object.keys(revenuePercentages).forEach(serviceKey => {
        const standardKey = this.getStandardServiceKey(serviceKey);
        standardizedRevenue[standardKey] = revenuePercentages[serviceKey];
      });
      
      // Update engine state
      this.engine.setServiceRevenue(standardizedRevenue);
      
      console.log('[RevenueAllocator] Updated engine with service revenue:', standardizedRevenue);
    } catch (e) {
      console.error('[RevenueAllocator] Error updating engine:', e);
    }
  }
  
  /**
   * Save current values to localStorage
   * @param {Object} standardizedRevenue - Optional standardized revenue object
   */
  saveToStorage(standardizedRevenue) {
    try {
      // Save raw values to handle recreating the UI
      localStorage.setItem('serviceRawValues', JSON.stringify(this.rawValues));
      
      // Also save standardized percentages if provided
      if (standardizedRevenue) {
        localStorage.setItem('serviceRevenue', JSON.stringify(standardizedRevenue));
      }
      
      console.log('[RevenueAllocator] Saved to localStorage');
    } catch (e) {
      console.warn('[RevenueAllocator] Could not save to localStorage:', e);
    }
  }
  
  /**
   * Handle increase button click
   * @param {Event} event - Click event
   */
  increaseValue(event) {
    const service = event.target.getAttribute('data-service');
    this.rawValues[service] = Math.min(100, (this.rawValues[service] || 0) + 5);
    
    this.updateSlider(service);
    this.calculatePercentages();
    this.updateAllDisplays();
    this.forceEngineUpdate();
  }
  
  /**
   * Handle decrease button click
   * @param {Event} event - Click event
   */
  decreaseValue(event) {
    const service = event.target.getAttribute('data-service');
    this.rawValues[service] = Math.max(0, (this.rawValues[service] || 0) - 5);
    
    this.updateSlider(service);
    this.calculatePercentages();
    this.updateAllDisplays();
    this.forceEngineUpdate();
  }
  
  /**
   * Update slider value for a service
   * @param {string} service - Service ID
   */
  updateSlider(service) {
    const slider = this.container.querySelector(`.revenue-slider[data-service="${service}"]`);
    if (slider) {
      slider.value = this.rawValues[service];
    }
  }
  
  /**
   * Update percentage display
   * @param {string} service - Service ID
   */
  updatePercentageDisplay(service) {
    const display = this.container.querySelector(`.revenue-percentage[data-service="${service}"]`);
    if (display) {
      display.textContent = `${this.serviceRevenue[service] || 0}%`;
    }
  }
  
  /**
   * Update all percentage displays
   */
  updateAllDisplays() {
    this.services.forEach(service => {
      this.updatePercentageDisplay(service);
    });
  }
  
  /**
   * Render the component
   */
  render() {
    // Clear container
    this.container.innerHTML = '';
    
    // Create section container
    const sectionContainer = document.createElement('div');
    sectionContainer.className = 'revenue-allocator-section';
    sectionContainer.style.marginTop = '20px';
    sectionContainer.style.marginBottom = '20px';
    
    // Add section title
    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'assessment-section-title';
    sectionTitle.textContent = 'Revenue Allocation';
    sectionTitle.style.marginBottom = '15px';
    sectionContainer.appendChild(sectionTitle);
    
    // Add instruction text
    const instructionText = document.createElement('p');
    instructionText.className = 'revenue-allocator-instruction';
    instructionText.textContent = 'Allocate your agency revenue across service lines to get a more accurate risk assessment.';
    instructionText.style.marginBottom = '20px';
    sectionContainer.appendChild(instructionText);
    
    // Create grid container for sliders
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'revenue-slider-container';
    sliderContainer.style.display = 'grid';
    sliderContainer.style.gridTemplateColumns = 'minmax(150px, 1fr) auto 1fr auto auto';
    sliderContainer.style.gridGap = '20px 10px';
    sliderContainer.style.alignItems = 'center';
    
    // Render each service slider in grid layout
    this.services.forEach(service => {
      // Service label in first column
      const label = document.createElement('div');
      label.className = 'revenue-service-label';
      label.setAttribute('data-service', service);
      label.textContent = service;
      label.style.fontWeight = '500';
      label.style.gridColumn = '1';
      sliderContainer.appendChild(label);
      
      // Minus button in second column
      const minusButton = document.createElement('button');
      minusButton.className = 'slider-button';
      minusButton.textContent = '-';
      minusButton.setAttribute('data-service', service);
      minusButton.addEventListener('click', this.decreaseValue.bind(this));
      minusButton.style.width = '30px';
      minusButton.style.height = '30px';
      minusButton.style.borderRadius = '4px';
      minusButton.style.border = '1px solid #ccc';
      minusButton.style.background = '#f8f8f8';
      minusButton.style.cursor = 'pointer';
      minusButton.style.gridColumn = '2';
      sliderContainer.appendChild(minusButton);
      
      // Slider in third column
      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = 0;
      slider.max = 100;
      slider.value = this.rawValues[service] || 0;
      slider.className = 'revenue-slider';
      slider.setAttribute('data-service', service);
      slider.style.width = '100%';
      slider.style.gridColumn = '3';
      slider.style.height = '10px';
      
      // Handle slider input (live updates while dragging)
      slider.addEventListener('input', (event) => {
        const value = parseInt(event.target.value);
        this.rawValues[service] = value;
        
        // Calculate new percentages and update all displays
        this.calculatePercentages();
        this.updateAllDisplays();
      });
      
      // Handle slider change (final value when released)
      slider.addEventListener('change', (event) => {
        const value = parseInt(event.target.value);
        this.rawValues[service] = value;
        
        // Recalculate percentages and save to storage
        this.calculatePercentages();
        this.updateAllDisplays();
        
        // Force engine update
        this.forceEngineUpdate();
      });
      
      sliderContainer.appendChild(slider);
      
      // Plus button in fourth column
      const plusButton = document.createElement('button');
      plusButton.className = 'slider-button';
      plusButton.textContent = '+';
      plusButton.setAttribute('data-service', service);
      plusButton.addEventListener('click', this.increaseValue.bind(this));
      plusButton.style.width = '30px';
      plusButton.style.height = '30px';
      plusButton.style.borderRadius = '4px';
      plusButton.style.border = '1px solid #ccc';
      plusButton.style.background = '#f8f8f8';
      plusButton.style.cursor = 'pointer';
      plusButton.style.gridColumn = '4';
      sliderContainer.appendChild(plusButton);
      
      // Percentage display in fifth column
      const percentageDisplay = document.createElement('div');
      percentageDisplay.className = 'revenue-percentage';
      percentageDisplay.setAttribute('data-service', service);
      percentageDisplay.textContent = `${this.serviceRevenue[service] || 0}%`;
      percentageDisplay.style.fontWeight = 'bold';
      percentageDisplay.style.gridColumn = '5';
      percentageDisplay.style.minWidth = '40px';
      sliderContainer.appendChild(percentageDisplay);
    });
    
    sectionContainer.appendChild(sliderContainer);
    
    // Add a helper text for the user
    const helperText = document.createElement('p');
    helperText.className = 'revenue-allocator-helper';
    helperText.innerHTML = '<strong>Note:</strong> These percentages will be used to calculate your agency\'s risk profile in the assessment results.';
    sectionContainer.appendChild(helperText);
    
    this.container.appendChild(sectionContainer);
  }
}

// Register component in the global namespace
(function() {
  // Initialize namespace
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
  
  // Register component
  window.AssessmentFramework.Components.RevenueAllocator = RevenueAllocator;
  
  console.log('[RevenueAllocator] Component registered successfully');
})();
