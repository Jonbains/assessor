/**
 * Agency Type Selector Component
 * 
 * Allows users to select their agency type in the assessment flow.
 * Extracted from the original assessment framework for modularity.
 */

class AgencyTypeSelector {
  /**
   * Create an agency type selector component
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
    
    // Bind methods
    this.handleAgencyTypeSelection = this.handleAgencyTypeSelection.bind(this);
  }
  
  /**
   * Handle agency type selection
   * @param {Event} event - Click event
   */
  handleAgencyTypeSelection(event) {
    const typeId = event.currentTarget.getAttribute('data-type-id');
    
    if (!typeId) {
      console.error('[AgencyTypeSelector] No agency type ID found');
      return;
    }
    
    console.log(`[AgencyTypeSelector] Selected agency type: ${typeId}`);
    
    // Update selected type in UI
    this.container.querySelectorAll('.agency-type-card').forEach(el => {
      el.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Update state
    this.eventBus.emit('data:update', {
      selectedType: typeId
    });
    
    // Pre-select services based on agency type
    if (this.config.defaultServices && this.config.defaultServices[typeId]) {
      this.eventBus.emit('data:update', {
        selectedServices: [...this.config.defaultServices[typeId]]
      });
      
      console.log(`[AgencyTypeSelector] Pre-selected services: ${this.config.defaultServices[typeId].join(', ')}`);
    }
  }
  
  /**
   * Validate the component
   * @returns {boolean} - Whether the component is valid
   */
  validate() {
    return !!this.state.selectedType;
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
    title.textContent = 'Select Your Agency Type';
    this.container.appendChild(title);
    
    // Create description
    const description = document.createElement('p');
    description.className = 'assessment-step-description';
    description.textContent = 'Choose the option that best describes your agency:';
    this.container.appendChild(description);
    
    // Create agency types container
    const typesContainer = document.createElement('div');
    typesContainer.className = 'agency-types-container';
    typesContainer.style.display = 'flex';
    typesContainer.style.flexWrap = 'wrap';
    typesContainer.style.justifyContent = 'center';
    typesContainer.style.gap = '20px';
    typesContainer.style.marginTop = '30px';
    
    // Check if agency types are available in config
    if (!this.config.agencyTypes || this.config.agencyTypes.length === 0) {
      const errorMessage = document.createElement('p');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'No agency types available in configuration.';
      errorMessage.style.color = 'red';
      this.container.appendChild(errorMessage);
      return;
    }
    
    // Create cards for each agency type
    this.config.agencyTypes.forEach(agencyType => {
      const card = document.createElement('div');
      card.className = 'agency-type-card';
      card.setAttribute('data-type-id', agencyType.id);
      
      // Check if this type is already selected
      if (this.state.selectedType === agencyType.id) {
        card.classList.add('selected');
      }
      
      // Style the card
      card.style.width = '220px';
      card.style.padding = '20px';
      card.style.border = '1px solid #ddd';
      card.style.borderRadius = '8px';
      card.style.cursor = 'pointer';
      card.style.transition = 'all 0.3s ease';
      card.style.backgroundColor = '#f9f9f9';
      card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
      card.style.textAlign = 'center';
      
      // Hover effect
      card.addEventListener('mouseover', () => {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      });
      
      card.addEventListener('mouseout', () => {
        if (!card.classList.contains('selected')) {
          card.style.transform = 'translateY(0)';
          card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }
      });
      
      // Selected style
      if (card.classList.contains('selected')) {
        card.style.transform = 'translateY(-5px)';
        card.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        card.style.borderColor = '#007bff';
        card.style.backgroundColor = '#f0f7ff';
      }
      
      // Add agency type name
      const name = document.createElement('h3');
      name.className = 'agency-type-name';
      name.textContent = agencyType.name;
      name.style.margin = '10px 0';
      name.style.fontSize = '18px';
      card.appendChild(name);
      
      // Add agency type description
      const desc = document.createElement('p');
      desc.className = 'agency-type-description';
      desc.textContent = agencyType.description;
      desc.style.fontSize = '14px';
      desc.style.color = '#666';
      desc.style.marginBottom = '0';
      card.appendChild(desc);
      
      // Add event listener
      card.addEventListener('click', this.handleAgencyTypeSelection);
      
      // Add to container
      typesContainer.appendChild(card);
    });
    
    this.container.appendChild(typesContainer);
    
    // Add helper text
    const helperText = document.createElement('p');
    helperText.className = 'helper-text';
    helperText.textContent = 'This will help us tailor the assessment to your agency type.';
    helperText.style.textAlign = 'center';
    helperText.style.marginTop = '20px';
    helperText.style.fontSize = '14px';
    helperText.style.color = '#666';
    this.container.appendChild(helperText);
  }
}

// Register component in the global namespace
(function() {
  // Initialize namespace
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
  window.AssessmentFramework.Components.agency = window.AssessmentFramework.Components.agency || {};
  
  // Register component
  window.AssessmentFramework.Components.agency.AgencyTypeSelector = AgencyTypeSelector;
  
  console.log('[AgencyTypeSelector] Component registered successfully');
})();
