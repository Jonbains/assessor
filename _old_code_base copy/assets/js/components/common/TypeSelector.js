/**
 * Type Selector Component
 * 
 * Allows users to select the type of assessment they want to take.
 * This is the first step in the assessment flow.
 */

class TypeSelector {
  /**
   * Create a type selector component
   * @param {Object} options - Component options
   * @param {HTMLElement} options.container - Container element
   * @param {Object} options.eventBus - Event bus for communication
   * @param {Object} options.engine - Assessment engine
   */
  constructor(options) {
    this.container = options.container;
    this.eventBus = options.eventBus;
    this.engine = options.engine;
    this.state = options.state || {};
    
    // Initial types (will be replaced by loaded config)
    this.assessmentTypes = [
      {
        id: 'agency',
        name: 'Agency Assessment',
        description: 'Assessment for marketing and creative agencies',
        icon: 'building'
      },
      {
        id: 'inhouse',
        name: 'In-house Team Assessment',
        description: 'Assessment for in-house marketing teams',
        icon: 'users'
      }
    ];
    
    // Bind methods
    this.handleTypeSelection = this.handleTypeSelection.bind(this);
    
    // Load assessment types
    this._loadAssessmentTypes();
  }
  
  /**
   * Load assessment types from configuration
   * @private
   */
  async _loadAssessmentTypes() {
    try {
      // Try to load from config loader
      if (this.engine.configLoader) {
        const config = await this.engine.configLoader.loadAssessmentTypes();
        if (config && config.types) {
          this.assessmentTypes = config.types;
          
          // Re-render with updated types
          this.render();
        }
      }
    } catch (error) {
      console.error('[TypeSelector] Error loading assessment types:', error);
      // Continue with default types
    }
  }
  
  /**
   * Handle assessment type selection
   * @param {Event} event - Click event
   */
  handleTypeSelection(event) {
    const button = event.currentTarget;
    const typeId = button.getAttribute('data-type');
    
    if (!typeId) {
      console.error('[TypeSelector] No type ID found on button');
      return;
    }
    
    console.log(`[TypeSelector] Selected assessment type: ${typeId}`);
    
    // Update selected type in UI
    this.container.querySelectorAll('.assessment-type-option').forEach(el => {
      el.classList.remove('selected');
    });
    button.classList.add('selected');
    
    // Emit event for type selection
    this.eventBus.emit('assessment:typeSelected', typeId);
  }
  
  /**
   * Validate the component
   * @returns {boolean} - Whether the component is valid
   */
  validate() {
    // Valid if a type is selected
    const selectedType = this.container.querySelector('.assessment-type-option.selected');
    return !!selectedType;
  }
  
  /**
   * Render the component
   */
  render() {
    console.log('[TypeSelector] Rendering component...');
    
    // Clear container
    this.container.innerHTML = '';
    
    // Apply container styling
    this.container.classList.add('assessment-step');
    
    // Create title
    const title = document.createElement('h2');
    title.className = 'assessment-title';
    title.textContent = 'Select Assessment Type';
    this.container.appendChild(title);
    
    // Create description
    const description = document.createElement('p');
    description.className = 'assessment-description';
    description.textContent = 'Choose the type of assessment that best fits your organization:';
    this.container.appendChild(description);
    
    console.log('[TypeSelector] Title and description created');
    
    // Create type options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'assessment-type-options';
    optionsContainer.style.display = 'flex';
    optionsContainer.style.justifyContent = 'center';
    optionsContainer.style.flexWrap = 'wrap';
    optionsContainer.style.gap = '20px';
    optionsContainer.style.marginTop = '30px';
    
    // Create options
    this.assessmentTypes.forEach(type => {
      const option = document.createElement('div');
      option.className = 'assessment-type-option';
      option.setAttribute('data-type', type.id);
      
      // Check if this type is already selected
      if (this.state.assessmentType === type.id) {
        option.classList.add('selected');
      }
      
      // Style the option
      option.style.width = '280px';
      option.style.padding = '20px';
      option.style.border = '1px solid #ddd';
      option.style.borderRadius = '8px';
      option.style.cursor = 'pointer';
      option.style.transition = 'all 0.3s ease';
      option.style.backgroundColor = '#f9f9f9';
      option.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
      
      // Hover effect
      option.addEventListener('mouseover', () => {
        option.style.transform = 'translateY(-5px)';
        option.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
      });
      
      option.addEventListener('mouseout', () => {
        if (!option.classList.contains('selected')) {
          option.style.transform = 'translateY(0)';
          option.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
        }
      });
      
      // Selected style
      if (option.classList.contains('selected')) {
        option.style.transform = 'translateY(-5px)';
        option.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
        option.style.borderColor = '#007bff';
        option.style.backgroundColor = '#f0f7ff';
      }
      
      // Add icon if available
      if (type.icon) {
        const icon = document.createElement('div');
        icon.className = 'assessment-type-icon';
        icon.innerHTML = `<i class="fas fa-${type.icon}"></i>`;
        icon.style.fontSize = '36px';
        icon.style.marginBottom = '15px';
        icon.style.color = '#007bff';
        option.appendChild(icon);
      }
      
      // Add type name
      const name = document.createElement('h3');
      name.className = 'assessment-type-name';
      name.textContent = type.name;
      name.style.margin = '10px 0';
      name.style.fontSize = '18px';
      option.appendChild(name);
      
      // Add description
      const desc = document.createElement('p');
      desc.className = 'assessment-type-description';
      desc.textContent = type.description;
      desc.style.fontSize = '14px';
      desc.style.color = '#666';
      desc.style.marginBottom = '0';
      option.appendChild(desc);
      
      // Add event listener
      option.addEventListener('click', this.handleTypeSelection);
      
      // Add to container
      optionsContainer.appendChild(option);
    });
    
    this.container.appendChild(optionsContainer);
    
    // Create help text
    const helpText = document.createElement('p');
    helpText.className = 'assessment-help-text';
    helpText.textContent = 'You can change your selection at any time by returning to this step.';
    helpText.style.marginTop = '20px';
    helpText.style.fontSize = '14px';
    helpText.style.color = '#666';
    helpText.style.textAlign = 'center';
    this.container.appendChild(helpText);
  }
}

// Register component in the global namespace
(function() {
  // Initialize namespace
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
  window.AssessmentFramework.Components.common = window.AssessmentFramework.Components.common || {};
  
  // Register component in multiple places to ensure it's found
  // 1. In the Components.common namespace (standard location)
  window.AssessmentFramework.Components.common.TypeSelector = TypeSelector;
  
  // 2. Also register directly in Components namespace for compatibility
  window.AssessmentFramework.Components.TypeSelector = TypeSelector;
  
  // 3. Register in global namespace for backward compatibility
  window.TypeSelector = TypeSelector;
  
  // 4. Register with component registry if available
  if (window.AssessmentFramework.componentRegistry) {
    window.AssessmentFramework.componentRegistry.register('TypeSelector', TypeSelector, 'common');
  }
  
  console.log('[TypeSelector] Component registered successfully in multiple namespaces');
})();
