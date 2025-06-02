/**
 * Agency Type Selector Component
 * 
 * Allows users to select their agency type in the assessment flow.
 * Matches the dark theme with radio button styling.
 */

export class AgencyTypeSelector {
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
   * @param {Event} event - Change event from radio input
   */
  handleAgencyTypeSelection(event) {
    const input = event.target;
    const typeId = input.value;
    
    if (!typeId) {
      console.error('[AgencyTypeSelector] No agency type ID found');
      return;
    }
    
    console.log(`[AgencyTypeSelector] Selected agency type: ${typeId}`);
    
    // Update internal state
    this.state.selectedType = typeId;
    
    // Update parent component state
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
    
    // Update UI to show selection was successful
    const container = input.closest('.agency-type-option');
    if (container) {
      // Add visual indication that this option is selected
      this.container.querySelectorAll('.agency-type-option').forEach(el => {
        el.style.borderColor = '#1a1a1a';
      });
      container.style.borderColor = '#ffff66';
      container.style.borderLeft = '4px solid #ffff66';
      
      // Ensure the radio button has focus
      input.focus();
    }
    
    console.log('Updated state with selected type:', this.state);
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
    description.textContent = 'Choose the option that best describes your agency\'s primary focus:';
    this.container.appendChild(description);
    
    // Create agency types container
    const typesContainer = document.createElement('div');
    typesContainer.className = 'agency-types-container';
    
    // Add dark theme styling to the container
    typesContainer.style.marginTop = '20px';
    typesContainer.style.marginBottom = '20px';
    typesContainer.style.display = 'flex';
    typesContainer.style.flexDirection = 'column';
    typesContainer.style.gap = '8px';
    
    // Check if agency types are available in config
    if (!this.config.agencyTypes || this.config.agencyTypes.length === 0) {
      const errorMessage = document.createElement('p');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'No agency types available in configuration.';
      errorMessage.style.color = '#ff6b6b';
      this.container.appendChild(errorMessage);
      return;
    }
    
    // Create radio options for each agency type
    this.config.agencyTypes.forEach(agencyType => {
      // Create the option container
      const optionContainer = document.createElement('div');
      optionContainer.className = 'agency-type-option';
      
      // Style the option container to match the dark theme
      optionContainer.style.padding = '12px 16px';
      optionContainer.style.backgroundColor = '#1a1a1a';
      optionContainer.style.borderRadius = '4px';
      optionContainer.style.marginBottom = '8px';
      optionContainer.style.cursor = 'pointer';
      
      // Create the radio input label container
      const label = document.createElement('label');
      label.className = 'radio-container';
      label.style.display = 'flex';
      label.style.alignItems = 'center';
      label.style.cursor = 'pointer';
      
      // Create the radio input
      const input = document.createElement('input');
      input.type = 'radio';
      input.name = 'agencyType';
      input.value = agencyType.id;
      input.style.marginRight = '12px';
      
      // Check if this type is already selected
      if (this.state.selectedType === agencyType.id) {
        input.checked = true;
      }
      
      // Style the radio button
      input.style.accentColor = '#ffff66';
      
      // Create the content container
      const content = document.createElement('div');
      content.style.flex = '1';
      
      // Add agency type name
      const name = document.createElement('div');
      name.className = 'agency-type-name';
      name.textContent = agencyType.name;
      name.style.fontWeight = 'bold';
      name.style.marginBottom = '4px';
      content.appendChild(name);
      
      // Add agency type description
      const desc = document.createElement('div');
      desc.className = 'agency-type-description';
      desc.textContent = agencyType.description;
      desc.style.fontSize = '14px';
      desc.style.color = '#aaaaaa';
      content.appendChild(desc);
      
      // Assemble the option
      label.appendChild(input);
      label.appendChild(content);
      optionContainer.appendChild(label);
      
      // Add event listener to the radio input
      input.addEventListener('change', this.handleAgencyTypeSelection);
      
      // Add click handler for the entire container to improve UX
      optionContainer.addEventListener('click', () => {
        if (!input.checked) {
          input.checked = true;
          // Trigger the change event manually
          const event = new Event('change');
          input.dispatchEvent(event);
        }
      });
      
      // Add to container
      typesContainer.appendChild(optionContainer);
    });
    
    // Add agency type options to container
    this.container.appendChild(typesContainer);
    
    // Add divider
    const divider = document.createElement('hr');
    divider.style.margin = '30px 0';
    divider.style.border = 'none';
    divider.style.height = '1px';
    divider.style.backgroundColor = '#333333';
    this.container.appendChild(divider);
    
    // Next button removed - using the one from the assessment navigation instead
  }
}

console.log('[AgencyTypeSelector] Component exported as ES6 module');
