/**
 * Agency Assessment Framework
 * 
 * Specialized implementation of the assessment framework for agency assessments.
 * This is a modular component that works with the core assessment engine.
 */

class AgencyAssessmentFramework {
  constructor(config, container) {
    this.config = config || {};
    this.container = container;
    this.state = {
      currentStep: 'agency-type',
      selectedServices: [],
      serviceRevenue: {},
      answers: {},
      emailCollected: false,
      results: null
    };
    
    // Set up event bus
    this.eventBus = new window.AssessmentFramework.Core.EventBus();
    
    // Add event logging in development mode
    this.eventBus.on('*', function(eventName, data) {
      console.log(`[AgencyAssessment Event] ${eventName}`, data);
    });
    
    // Set up plugin system
    this.pluginSystem = new window.AssessmentFramework.Core.PluginSystem();
    
    // Set up config loader
    this.configLoader = new window.AssessmentFramework.Core.ConfigLoader();
    
    // Initialize core engine
    this.engine = new window.AssessmentFramework.Core.AssessmentEngine({
      container: this.container,
      eventBus: this.eventBus,
      pluginSystem: this.pluginSystem,
      configLoader: this.configLoader
    });
    
    // Setup agency-specific event handlers
    this._setupEventHandlers();
    
    // Initialize the assessment
    this.initialize();
    
    console.log('[AgencyAssessmentFramework] Initialized');
  }
  
  /**
   * Set up event handlers specific to agency assessments
   * @private
   */
  _setupEventHandlers() {
    const self = this;
    
    // Handle step navigation
    this.eventBus.on('navigation:next', function(data) {
      const currentStepIndex = self.config.steps.indexOf(self.state.currentStep);
      if (currentStepIndex < self.config.steps.length - 1) {
        const nextStep = self.config.steps[currentStepIndex + 1];
        self.navigateToStep(nextStep);
      }
    });
    
    this.eventBus.on('navigation:previous', function(data) {
      const currentStepIndex = self.config.steps.indexOf(self.state.currentStep);
      if (currentStepIndex > 0) {
        const prevStep = self.config.steps[currentStepIndex - 1];
        self.navigateToStep(prevStep);
      }
    });
    
    // Handle data updates
    this.eventBus.on('data:update', function(data) {
      // Update state with new data
      Object.assign(self.state, data);
      
      // Emit state changed event
      self.eventBus.emit('state:changed', self.state);
    });
    
    // Handle service selection
    this.eventBus.on('services:selected', function(data) {
      self.state.selectedServices = data.services;
      self.eventBus.emit('state:changed', self.state);
    });
    
    // Handle service revenue allocation
    this.eventBus.on('services:revenue-allocated', function(data) {
      self.state.serviceRevenue = data.allocation;
      self.eventBus.emit('state:changed', self.state);
    });
    
    // Handle question answers
    this.eventBus.on('questions:answered', function(data) {
      self.state.answers = data.answers;
      self.eventBus.emit('state:changed', self.state);
    });
    
    // Handle email collection
    this.eventBus.on('email:collected', function(data) {
      self.state.emailCollected = true;
      self.state.email = data.email;
      self.eventBus.emit('state:changed', self.state);
    });
    
    // Handle assessment completion
    this.eventBus.on('assessment:complete', function() {
      // Calculate results
      self.calculateResults();
      
      // Navigate to results
      self.navigateToStep('results');
    });
  }
  
  /**
   * Initialize the assessment
   */
  initialize() {
    // Apply config
    if (this.config.initialStep) {
      this.state.currentStep = this.config.initialStep;
    }
    
    // Initialize engine with assessment type
    this.engine.initialize({
      assessmentType: 'agency',
      currentStep: this.state.currentStep
    });
    
    // Render the first step
    this.renderCurrentStep();
  }
  
  /**
   * Navigate to a specific step
   * @param {string} stepId - ID of the step to navigate to
   */
  navigateToStep(stepId) {
    // Update current step
    this.state.currentStep = stepId;
    
    // Emit navigation event
    this.eventBus.emit('navigation:step-changed', {
      previousStep: this.state.currentStep,
      currentStep: stepId
    });
    
    // Render the step
    this.renderCurrentStep();
  }
  
  /**
   * Render the current step based on state
   */
  renderCurrentStep() {
    // Clear container
    this.container.innerHTML = '';
    
    // Determine which component to use based on current step
    let component;
    
    try {
      // Make sure componentRegistry exists before trying to use it
      if (!window.AssessmentFramework || !window.AssessmentFramework.componentRegistry) {
        console.error('[AgencyAssessmentFramework] Component registry not initialized');
        // Fall back to legacy component lookup
        this._renderLegacyStep();
        return;
      }
      
      switch (this.state.currentStep) {
        case 'agency-type':
          component = window.AssessmentFramework.componentRegistry.get('agency/AgencyTypeSelector');
          break;
        case 'services':
          component = window.AssessmentFramework.componentRegistry.get('agency/ServicesSelector');
          break;
        case 'questions':
          component = window.AssessmentFramework.componentRegistry.get('agency/QuestionsRenderer');
          break;
        case 'email':
          component = window.AssessmentFramework.componentRegistry.get('common/EmailCollector');
          break;
        case 'results':
          component = window.AssessmentFramework.componentRegistry.get('agency/ResultsRenderer');
          break;
        default:
          console.error(`[AgencyAssessmentFramework] Unknown step: ${this.state.currentStep}`);
          return;
      }
      
      if (!component) {
        console.error(`[AgencyAssessmentFramework] Component not found for step: ${this.state.currentStep}`);
        // Fall back to legacy component rendering
        this._renderLegacyStep();
        return;
      }
      
      // Instantiate the component
      const instance = new component({
        container: this.container,
        eventBus: this.eventBus,
        engine: this.engine,
        state: this.state,
        config: this.config
      });
      
      // Render the component
      instance.render();
      
      // Store current component instance
      this.currentComponent = instance;
    } catch (error) {
      console.error('[AgencyAssessmentFramework] Error rendering step:', error);
      this._renderLegacyStep();
    }
    
    // Apply theme
    if (typeof obsoleteTheme !== 'undefined') {
      obsoleteTheme.forceApply();
    }
  }
  
  /**
   * Fallback method to render steps using legacy implementation
   * @private
   */
  _renderLegacyStep() {
    console.log('[AgencyAssessmentFramework] Using legacy step renderer');
    
    // Clear container
    this.container.innerHTML = '';
    
    // Generate HTML based on current step
    let html = '';
    
    switch (this.state.currentStep) {
      case 'agency-type':
        html = this._renderAgencyTypeStep();
        break;
      case 'services':
        html = this._renderServicesStep();
        break;
      case 'questions':
        html = this._renderQuestionsStep();
        break;
      case 'email':
        html = this._renderEmailStep();
        break;
      case 'results':
        html = this._renderResultsStep();
        break;
      default:
        html = '<div class="error-message">Unknown step</div>';
    }
    
    // Set the HTML
    this.container.innerHTML = html;
    
    // Set up event handlers
    this._setupLegacyEventHandlers();
  }
  
  /**
   * Set up event handlers for legacy rendering
   * @private
   */
  _setupLegacyEventHandlers() {
    const self = this;
    
    // Agency type selection
    this.container.querySelectorAll('.assessment-option').forEach(option => {
      option.addEventListener('click', function() {
        const agencyType = this.getAttribute('data-agency-type');
        
        // Update state
        self.eventBus.emit('data:update', { 
          agencyType: agencyType
        });
        
        // Navigate to next step
        self.eventBus.emit('navigation:next');
      });
    });
    
    // Service checkboxes
    this.container.querySelectorAll('.service-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', function() {
        const serviceId = this.value;
        const isChecked = this.checked;
        
        // Update selected services
        const selectedServices = [...self.state.selectedServices];
        
        if (isChecked && !selectedServices.includes(serviceId)) {
          selectedServices.push(serviceId);
        } else if (!isChecked && selectedServices.includes(serviceId)) {
          const index = selectedServices.indexOf(serviceId);
          selectedServices.splice(index, 1);
        }
        
        // Update state
        self.eventBus.emit('data:update', { 
          selectedServices: selectedServices
        });
      });
    });
    
    // Revenue sliders
    this.container.querySelectorAll('.revenue-slider').forEach(slider => {
      slider.addEventListener('input', function() {
        const serviceId = this.getAttribute('data-service');
        const value = parseInt(this.value);
        
        // Update service revenue
        const serviceRevenue = {...self.state.serviceRevenue};
        serviceRevenue[serviceId] = value;
        
        // Update display
        const valueDisplay = this.closest('.slider-controls').querySelector('.slider-value');
        if (valueDisplay) {
          valueDisplay.textContent = value + '%';
        }
        
        // Update state
        self.eventBus.emit('data:update', { 
          serviceRevenue: serviceRevenue
        });
      });
    });
    
    // Navigation buttons
    this.container.querySelectorAll('.prev-button').forEach(button => {
      button.addEventListener('click', function() {
        self.eventBus.emit('navigation:previous');
      });
    });
    
    this.container.querySelectorAll('.next-button').forEach(button => {
      button.addEventListener('click', function() {
        self.eventBus.emit('navigation:next');
      });
    });
  }
  
  /**
   * Calculate assessment results
   */
  calculateResults() {
    // Check if we already have scoring system available
    if (typeof AgencyScoringSystem !== 'undefined') {
      this.state.results = AgencyScoringSystem.calculateResults(this.state);
    } else {
      // Simple fallback scoring if specialized system not available
      const scores = { overall: 0, dimensions: {} };
      let totalAnswered = 0;
      
      // Process answers
      for (const questionId in this.state.answers) {
        const answer = this.state.answers[questionId];
        totalAnswered++;
        
        // Add to dimension score
        if (!scores.dimensions[answer.dimension]) {
          scores.dimensions[answer.dimension] = {
            score: 0,
            count: 0
          };
        }
        
        scores.dimensions[answer.dimension].score += answer.score;
        scores.dimensions[answer.dimension].count++;
      }
      
      // Calculate average scores
      for (const dimension in scores.dimensions) {
        if (scores.dimensions[dimension].count > 0) {
          scores.dimensions[dimension].average = 
            scores.dimensions[dimension].score / scores.dimensions[dimension].count;
        }
      }
      
      // Calculate overall score
      let overallScore = 0;
      let dimensionCount = 0;
      
      for (const dimension in scores.dimensions) {
        if (scores.dimensions[dimension].average) {
          overallScore += scores.dimensions[dimension].average;
          dimensionCount++;
        }
      }
      
      if (dimensionCount > 0) {
        scores.overall = overallScore / dimensionCount;
      }
      
      this.state.results = scores;
    }
    
    // Emit results calculated event
    this.eventBus.emit('results:calculated', {
      results: this.state.results
    });
  }
}

/**
 * Helper function to initialize the engine directly
 * @param {HTMLElement} container - The container element
 * @returns {Object} - The initialized engine
 */
function initEngine(container) {
  console.log('[AgencyAssessmentFramework] Initializing engine directly');
  
  // Create event bus
  const eventBus = new window.AssessmentFramework.Core.EventBus();
  
  // Add event logging
  eventBus.on('*', function(eventName, data) {
    console.log(`[Event] ${eventName}`, data);
  });
  
  // Create plugin system and config loader
  const pluginSystem = new window.AssessmentFramework.Core.PluginSystem();
  const configLoader = new window.AssessmentFramework.Core.ConfigLoader();
  
  // Create and initialize engine
  const engine = new window.AssessmentFramework.Core.AssessmentEngine({
    container: container,
    eventBus: eventBus,
    pluginSystem: pluginSystem,
    configLoader: configLoader
  });
  
  engine.initialize({
    assessmentType: 'agency',
    currentStep: 'agency-type'
  });
  
  return engine;
}

// Add initEngine to global scope to make it available for error recovery
window.initEngine = initEngine;

// Register in global namespace
window.AssessmentFramework = window.AssessmentFramework || {};
window.AssessmentFramework.AgencyAssessmentFramework = AgencyAssessmentFramework;
window.AgencyAssessment = AgencyAssessmentFramework;

console.log('[AgencyAssessmentFramework] Module loaded and registered');
