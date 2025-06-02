/**
 * Areas Selector Component for Inhouse Assessment
 * 
 * Allows users to select functional areas they're responsible for.
 * Similar to the Services Selector but tailored for inhouse teams.
 */

class AreasSelector {
  /**
   * Create an areas selector component
   * @param {Object} options - Component options
   */
  constructor(options) {
    this.container = options.container;
    this.eventBus = options.eventBus;
    this.engine = options.engine;
    this.state = options.state || {};
    this.config = options.config || {};
    
    // Bind methods
    this.handleAreaSelection = this.handleAreaSelection.bind(this);
  }
  
  /**
   * Handle area selection
   * @param {Event} event - Change event
   */
  handleAreaSelection(event) {
    const checkbox = event.target;
    const areaId = checkbox.value;
    
    // Get current selected areas
    let selectedServices = [...(this.state.selectedServices || [])];
    
    if (checkbox.checked) {
      // Add area if not already in array
      if (!selectedServices.includes(areaId)) {
        selectedServices.push(areaId);
      }
    } else {
      // Remove area from array
      selectedServices = selectedServices.filter(id => id !== areaId);
    }
    
    // Update state
    this.eventBus.emit('data:update', {
      selectedServices: selectedServices
    });
    
    console.log(`[AreasSelector] Selected areas: ${selectedServices.join(', ')}`);
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
    title.textContent = 'Select Your Functional Areas';
    this.container.appendChild(title);
    
    // Create description
    const description = document.createElement('p');
    description.className = 'assessment-step-description';
    description.textContent = 'Select the functional areas your team is responsible for:';
    this.container.appendChild(description);
    
    // Check if areas are available in config
    if (!this.config.areas || this.config.areas.length === 0) {
      const errorMessage = document.createElement('p');
      errorMessage.className = 'error-message';
      errorMessage.textContent = 'No functional areas available in configuration.';
      errorMessage.style.color = 'red';
      this.container.appendChild(errorMessage);
      return;
    }
    
    // Create areas container
    const areasContainer = document.createElement('div');
    areasContainer.className = 'areas-container';
    
    // Create areas section
    const areasSection = document.createElement('div');
    areasSection.className = 'areas-section';
    
    // Group areas by category if available
    const areasByCategory = {};
    
    this.config.areas.forEach(area => {
      const category = area.category || 'Other Areas';
      if (!areasByCategory[category]) {
        areasByCategory[category] = [];
      }
      areasByCategory[category].push(area);
    });
    
    // Create sections for each category
    Object.keys(areasByCategory).forEach(category => {
      // Create category header
      const categoryHeader = document.createElement('h3');
      categoryHeader.className = 'area-category-header';
      categoryHeader.textContent = category;
      areasSection.appendChild(categoryHeader);
      
      // Create grid for areas in this category
      const areasGrid = document.createElement('div');
      areasGrid.className = 'areas-grid';
      areasGrid.style.display = 'grid';
      areasGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
      areasGrid.style.gap = '15px';
      areasGrid.style.marginBottom = '20px';
      
      // Add areas in this category
      areasByCategory[category].forEach(area => {
        const areaCard = document.createElement('div');
        areaCard.className = 'area-card';
        areaCard.style.padding = '15px';
        areaCard.style.border = '1px solid #ddd';
        areaCard.style.borderRadius = '8px';
        areaCard.style.backgroundColor = '#f9f9f9';
        
        // Create checkbox for selection
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `area-${area.id}`;
        checkbox.value = area.id;
        checkbox.className = 'area-checkbox';
        
        // Check if area is already selected
        if (this.state.selectedServices && this.state.selectedServices.includes(area.id)) {
          checkbox.checked = true;
        }
        
        // Add event listener
        checkbox.addEventListener('change', this.handleAreaSelection);
        
        // Create label
        const label = document.createElement('label');
        label.htmlFor = `area-${area.id}`;
        label.className = 'area-label';
        label.style.display = 'flex';
        label.style.alignItems = 'center';
        label.style.fontWeight = 'bold';
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(area.name));
        
        areaCard.appendChild(label);
        
        // Add AI impact if available
        if (area.aiImpact) {
          const aiImpact = document.createElement('div');
          aiImpact.className = 'area-ai-impact';
          aiImpact.textContent = `AI Impact: ${area.aiImpact}`;
          aiImpact.style.marginTop = '10px';
          aiImpact.style.fontSize = '14px';
          aiImpact.style.color = '#666';
          areaCard.appendChild(aiImpact);
        }
        
        // Add transformation timeline if available
        if (area.transformationTimeline) {
          const timeline = document.createElement('div');
          timeline.className = 'area-timeline';
          timeline.textContent = `Timeline: ${area.transformationTimeline}`;
          timeline.style.marginTop = '5px';
          timeline.style.fontSize = '14px';
          timeline.style.color = '#666';
          areaCard.appendChild(timeline);
        }
        
        areasGrid.appendChild(areaCard);
      });
      
      areasSection.appendChild(areasGrid);
    });
    
    areasContainer.appendChild(areasSection);
    
    // Add selection note
    const selectionNote = document.createElement('div');
    selectionNote.className = 'selection-note';
    selectionNote.innerHTML = `
      <p><strong>Note:</strong> Select all areas that your team is responsible for. 
      This will help us provide more targeted recommendations for AI implementation 
      in your specific functional areas.</p>
    `;
    selectionNote.style.marginTop = '20px';
    selectionNote.style.padding = '15px';
    selectionNote.style.backgroundColor = '#f0f7ff';
    selectionNote.style.borderRadius = '6px';
    selectionNote.style.borderLeft = '4px solid #007bff';
    
    areasContainer.appendChild(selectionNote);
    
    this.container.appendChild(areasContainer);
  }
}

// Register component in the global namespace
(function() {
  // Initialize namespace
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
  window.AssessmentFramework.Components.inhouse = window.AssessmentFramework.Components.inhouse || {};
  
  // Register component
  window.AssessmentFramework.Components.inhouse.AreasSelector = AreasSelector;
  
  console.log('[AreasSelector] Component registered successfully');
})();
