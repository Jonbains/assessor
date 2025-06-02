/**
 * Department Selector Component for Inhouse Assessment
 * 
 * Allows users to select their department type in the inhouse assessment flow.
 */

class DepartmentSelector {
  /**
   * Create a department selector component
   * @param {Object} options - Component options
   */
  constructor(options) {
    this.container = options.container;
    this.eventBus = options.eventBus;
    this.engine = options.engine;
    this.state = options.state || {};
    this.config = options.config || {};
    
    // Bind methods
    this.handleDepartmentSelection = this.handleDepartmentSelection.bind(this);
  }
  
  /**
   * Handle department selection
   * @param {Event} event - Click event
   */
  handleDepartmentSelection(event) {
    const typeId = event.currentTarget.getAttribute('data-department-id');
    
    if (!typeId) {
      console.error('[DepartmentSelector] No department ID found');
      return;
    }
    
    console.log(`[DepartmentSelector] Selected department: ${typeId}`);
    
    // Update selected type in UI
    this.container.querySelectorAll('.department-card').forEach(el => {
      el.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Update state
    this.eventBus.emit('data:update', {
      selectedType: typeId
    });
    
    // Pre-select areas based on department type
    if (this.config.defaultAreas && this.config.defaultAreas[typeId]) {
      this.eventBus.emit('data:update', {
        selectedServices: [...this.config.defaultAreas[typeId]]
      });
      
      console.log(`[DepartmentSelector] Pre-selected areas: ${this.config.defaultAreas[typeId].join(', ')}`);
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
    title.textContent = 'Select Your Department';
    this.container.appendChild(title);
    
    // Create description
    const description = document.createElement('p');
    description.className = 'assessment-step-description';
    description.textContent = 'Choose the option that best describes your department or team:';
    this.container.appendChild(description);
    
    // Create department types container
    const typesContainer = document.createElement('div');
    typesContainer.className = 'department-types-container';
    
    // Check if department types are available in config
    if (!this.config.departments || this.config.departments.length === 0) {
      const errorMessage = document.createElement('p');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'No department types available in configuration.';
      errorMessage.style.color = 'red';
      this.container.appendChild(errorMessage);
      return;
    }
    
    // Create cards for each department type
    this.config.departments.forEach(department => {
      const card = document.createElement('div');
      card.className = 'department-card';
      card.setAttribute('data-department-id', department.id);
      
      // Check if this type is already selected
      if (this.state.selectedType === department.id) {
        card.classList.add('selected');
      }
      
      // Add department type name
      const name = document.createElement('h3');
      name.className = 'department-name';
      name.textContent = department.name;
      card.appendChild(name);
      
      // Add department type description
      const desc = document.createElement('p');
      desc.className = 'department-description';
      desc.textContent = department.description;
      card.appendChild(desc);
      
      // Add event listener
      card.addEventListener('click', this.handleDepartmentSelection);
      
      // Add to container
      typesContainer.appendChild(card);
    });
    
    this.container.appendChild(typesContainer);
    
    // Add helper text
    const helperText = document.createElement('p');
    helperText.className = 'helper-text';
    helperText.textContent = 'This will help us tailor the assessment to your department type.';
    this.container.appendChild(helperText);
  }
}

// Register component in the global namespace
(function() {
  // Initialize namespace
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
  window.AssessmentFramework.Components.inhouse = window.AssessmentFramework.Components.inhouse || {};
  
  // Register component
  window.AssessmentFramework.Components.inhouse.DepartmentSelector = DepartmentSelector;
  
  console.log('[DepartmentSelector] Component registered successfully');
})();
