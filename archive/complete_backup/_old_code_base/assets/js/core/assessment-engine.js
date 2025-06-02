/**
 * Assessment Engine - Core Module
 * 
 * This is the central component of the modular assessment framework.
 * It handles the assessment flow, state management, and component coordination.
 */

class AssessmentEngine {
  /**
   * Create an assessment engine instance
   * @param {Object} options - Engine configuration options
   * @param {HTMLElement} options.container - Container element for the assessment
   * @param {Object} options.eventBus - Event bus for component communication
   * @param {Object} options.pluginSystem - Plugin system for component loading
   */
  constructor(options) {
    this.container = options.container;
    this.eventBus = options.eventBus;
    this.pluginSystem = options.pluginSystem;
    this.configLoader = options.configLoader;
    
    // Use the new component registry (with two-phase initialization)
    this.componentRegistry = options.componentRegistry || 
      (window.AssessmentComponentRegistry ? new window.AssessmentComponentRegistry() : null);
    
    if (!this.componentRegistry) {
      console.error('[AssessmentEngine] ComponentRegistry not available');
    } else {
      console.log('[AssessmentEngine] Using ComponentRegistry for component loading');
    }
    
    // Engine state
    this.state = {
      assessmentType: null,      // 'agency' or 'inhouse'
      currentStep: 'type-selector', // First step is always the assessment type selection
      steps: ['type-selector'],  // Will be populated based on assessment type
      answers: {},
      selectedType: null,        // Agency type or department type based on assessment
      selectedServices: [],      // Services or areas based on assessment
      revenue: 0,
      userData: {
        email: '',
        name: ''
      },
      currentQuestionIndex: 0,
      filteredQuestions: [],
      results: null
    };
    
    // Active components registry
    this.activeComponents = {};
    
    // Register all available components FIRST (Phase 1)
    this._registerComponents();
    
    // THEN complete the initialization (Phase 2)
    if (this.componentRegistry) {
      this.componentRegistry.completeInitialization();
    }
    
    // Initialize event listeners
    this._setupEventListeners();
  }
  
  /**
   * Initialize the assessment engine
   * @param {Object} initialState - Optional initial state
   */
  async initialize(initialState = {}) {
    // Merge initial state if provided
    if (initialState) {
      this.state = { ...this.state, ...initialState };
    }
    
    console.log('[AssessmentEngine] Initializing with assessment type:', this.state.assessmentType);
    
    // If assessment type is already selected, load its configuration
    if (this.state.assessmentType) {
      await this._loadAssessmentConfiguration(this.state.assessmentType);
    }
    
    // Render the current step
    this.renderCurrentStep();
    
    // Notify that engine is ready
    this.eventBus.emit('engine:initialized', this.state);
  }
  
  /**
   * Load assessment configuration based on selected type
   * @param {string} assessmentType - Type of assessment ('agency' or 'inhouse')
   * @private
   */
  async _loadAssessmentConfiguration(assessmentType) {
    try {
      // Load assessment configuration using the config loader
      const config = await this.configLoader.loadConfig(assessmentType);
      
      // Store configuration
      this.config = config;
      
      // Update steps based on config
      if (config.steps && Array.isArray(config.steps)) {
        // Ensure type-selector is always first, then add config steps
        this.state.steps = ['type-selector', ...config.steps];
      }
      
      console.log('[AssessmentEngine] Loaded configuration for:', assessmentType);
      console.log('[AssessmentEngine] Assessment steps:', this.state.steps);
      
      // Initialize scoring system based on assessment type
      this._initializeScoringSystem(assessmentType);
      
      return config;
    } catch (error) {
      console.error('[AssessmentEngine] Error loading configuration:', error);
      throw error;
    }
  }
  
  /**
   * Initialize the scoring system for the selected assessment type
   * @param {string} assessmentType - Type of assessment
   * @private
   */
  _initializeScoringSystem(assessmentType) {
    // Dynamically load scoring system if available
    if (window.EnhancedWeightedScoring) {
      this.scoringSystem = new window.EnhancedWeightedScoring(this.config, assessmentType);
      console.log('[AssessmentEngine] Scoring system initialized for:', assessmentType);
    } else {
      console.warn('[AssessmentEngine] EnhancedWeightedScoring not available');
    }
  }
  
  /**
   * Set up event listeners for engine events
   * @private
   */
  _setupEventListeners() {
    // Listen for assessment type selection
    this.eventBus.on('assessment:typeSelected', (type) => {
      this.setAssessmentType(type);
    });
    
    // Listen for navigation events
    this.eventBus.on('navigation:next', () => this.nextStep());
    this.eventBus.on('navigation:prev', () => this.previousStep());
    this.eventBus.on('navigation:reset', () => this.resetAssessment());
    
    // Listen for data update events
    this.eventBus.on('data:update', (data) => {
      this.updateState(data);
    });
    
    // Listen for step completion events
    this.eventBus.on('step:complete', (stepData) => {
      this.completeStep(stepData);
    });
  }
  
  /**
   * Set the assessment type and load its configuration
   * @param {string} type - Assessment type ('agency' or 'inhouse')
   */
  async setAssessmentType(type) {
    if (type !== 'agency' && type !== 'inhouse') {
      console.error('[AssessmentEngine] Invalid assessment type:', type);
      return;
    }
    
    console.log('[AssessmentEngine] Setting assessment type:', type);
    
    // Update state
    this.state.assessmentType = type;
    
    // Load configuration for this assessment type
    await this._loadAssessmentConfiguration(type);
    
    // Move to first step after type selection
    if (this.state.steps.length > 1) {
      this.state.currentStep = this.state.steps[1];
      this.renderCurrentStep();
    }
    
    // Notify that assessment type is set
    this.eventBus.emit('assessment:typeSet', type);
  }
  
  /**
   * Update engine state with new data
   * @param {Object} data - Data to update
   */
  updateState(data) {
    // Deep merge data into state
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'object' && data[key] !== null && typeof this.state[key] === 'object' && this.state[key] !== null) {
        this.state[key] = { ...this.state[key], ...data[key] };
      } else {
        this.state[key] = data[key];
      }
    });
    
    // Notify about state change
    this.eventBus.emit('state:updated', this.state);
  }
  
  /**
   * Complete the current step with provided data
   * @param {Object} stepData - Data collected from the step
   */
  completeStep(stepData) {
    // Update state with step data
    if (stepData) {
      this.updateState(stepData);
    }
    
    // Mark step as completed
    this.eventBus.emit('step:completed', this.state.currentStep);
  }
  
  /**
   * Render the current assessment step
   */
  renderCurrentStep() {
    // Clear container
    this.container.innerHTML = '';
    
    // Get the component name based on current step and assessment type
    let componentName;
    
    if (this.state.currentStep === 'type-selector') {
      componentName = 'TypeSelector';
    } else {
      // For other steps, use assessment type specific components
      componentName = this._getComponentNameForStep(this.state.currentStep);
    }
    
    console.log('[AssessmentEngine] Rendering component:', componentName);
    
    // Load and instantiate component
    this._loadAndRenderComponent(componentName);
    
    // Notify that step is rendering
    this.eventBus.emit('step:rendering', this.state.currentStep);
  }
  
  /**
   * Get the component name for the current step based on assessment type
   * @param {string} step - Current step
   * @returns {string} Component name
   * @private
   */
  _getComponentNameForStep(step) {
    const assessmentType = this.state.assessmentType || 'common';
    const stepMappings = {
      // Common components
      'common': {
        'email': 'EmailCollector',
        'results': 'ResultsDisplay'
      },
      // Agency assessment specific components
      'agency': {
        'agency-type': 'AgencyTypeSelector',
        'services': 'ServicesSelector',
        'questions': 'QuestionsRenderer',
        'revenue': 'RevenueAllocator'
      },
      // Inhouse assessment specific components
      'inhouse': {
        'department': 'DepartmentSelector',
        'areas': 'AreasSelector',
        'questions': 'QuestionsRenderer',
        'budget': 'BudgetAllocator'
      }
    };
    
    // Check if there's a common component for this step
    if (stepMappings.common[step]) {
      return `common/${stepMappings.common[step]}`;
    }
    
    // Check if there's an assessment specific component
    if (assessmentType && stepMappings[assessmentType] && stepMappings[assessmentType][step]) {
      return `${assessmentType}/${stepMappings[assessmentType][step]}`;
    }
    
    // Services selectors
    if (window.AssessmentFramework.ServicesSelector) {
      this.componentRegistry.register('agency:services', window.AssessmentFramework.ServicesSelector);
    }
    
    if (window.AssessmentFramework.AreasSelector) {
      this.componentRegistry.register('inhouse:areas', window.AssessmentFramework.AreasSelector);
    }
    
    // Results renderers
    if (window.AssessmentFramework.ResultsRenderer) {
      this.componentRegistry.register('agency:results', window.AssessmentFramework.ResultsRenderer);
      this.componentRegistry.register('inhouse:results', window.AssessmentFramework.ResultsRenderer);
    }
    
    // Email collector
    if (window.AssessmentFramework.EmailCollector) {
      this.componentRegistry.register('common:email', window.AssessmentFramework.EmailCollector);
    }
  }
  
  /**
   * Register all available components with the registry
   * This is Phase 1 of the two-phase initialization process
   * @private
   */
  _registerComponents() {
    if (!this.componentRegistry) return;
    
    console.log('[AssessmentEngine] Registering components with registry');
    
    // Register all agency components first
    if (window.AssessmentFramework) {
      // Type selectors
      if (window.AssessmentFramework.AgencyTypeSelector) {
        this.componentRegistry.register('agency:type-selector', window.AssessmentFramework.AgencyTypeSelector);
      }
      
      if (window.AssessmentFramework.InhouseTypeSelector) {
        this.componentRegistry.register('inhouse:type-selector', window.AssessmentFramework.InhouseTypeSelector);
      }
      
      // Questions renderers
      if (window.AssessmentFramework.QuestionsRenderer) {
        this.componentRegistry.register('agency:questions', window.AssessmentFramework.QuestionsRenderer);
        this.componentRegistry.register('inhouse:questions', window.AssessmentFramework.QuestionsRenderer);
      }
      
      // Services selectors
      if (window.AssessmentFramework.ServicesSelector) {
        this.componentRegistry.register('agency:services', window.AssessmentFramework.ServicesSelector);
      }
      
      if (window.AssessmentFramework.AreasSelector) {
        this.componentRegistry.register('inhouse:areas', window.AssessmentFramework.AreasSelector);
      }
      
      // Results renderers
      if (window.AssessmentFramework.ResultsRenderer) {
        this.componentRegistry.register('agency:results', window.AssessmentFramework.ResultsRenderer);
        this.componentRegistry.register('inhouse:results', window.AssessmentFramework.ResultsRenderer);
      }
      
      // Email collector
      if (window.AssessmentFramework.EmailCollector) {
        this.componentRegistry.register('common:email', window.AssessmentFramework.EmailCollector);
      }
    }
    
    // Register scoring systems
    if (window.EnhancedWeightedScoring) {
      this.componentRegistry.register('scoring:agency', window.EnhancedWeightedScoring);
      this.componentRegistry.register('scoring:inhouse', window.EnhancedWeightedScoring);
    }
    
    // Register valuation dashboard if available
    if (window.ValuationDashboard) {
      this.componentRegistry.register('dashboard:valuation', window.ValuationDashboard);
    }
  }

  /**
   * Load and render a component
   * @param {string} componentName - Name of the component to load
   * @private
   */
  _loadAndRenderComponent(componentName) {
    const assessmentType = this.state.assessmentType || 'agency';
    
    // First, try to use the component registry (new approach)
    if (this.componentRegistry) {
      // Create registry key based on assessment type and component name
      const registryKey = `${assessmentType}:${componentName}`;
      
      console.log(`[AssessmentEngine] Loading component from registry: ${registryKey}`);
      
      // Try to get component from registry
      const componentInstance = this.componentRegistry.get(registryKey, {
        container: this.container,
        eventBus: this.eventBus,
        engine: this,
        state: this.state
      });
      
      if (componentInstance) {
        console.log(`[AssessmentEngine] Successfully loaded component from registry: ${registryKey}`);
        
        // Store active component
        this.activeComponents[componentName] = componentInstance;
        
        // Render component
        componentInstance.render();
        
        return componentInstance;
      }
      
      // For some components like email, try common namespace
      if (componentName === 'email') {
        const commonKey = `common:${componentName}`;
        const commonComponent = this.componentRegistry.get(commonKey, {
          container: this.container,
          eventBus: this.eventBus,
          engine: this,
          state: this.state
        });
        
        if (commonComponent) {
          console.log(`[AssessmentEngine] Loaded common component: ${commonKey}`);
          this.activeComponents[componentName] = commonComponent;
          commonComponent.render();
          return commonComponent;
        }
      }
    }
    
    // Fallback to plugin system if registry failed
    try {
      console.log(`[AssessmentEngine] Fallback: Loading component via plugin system: ${componentName}`);
      
      // Try to get component from plugin system
      const Component = this.pluginSystem.getComponent(assessmentType, componentName);
      
      if (Component) {
        console.log(`[AssessmentEngine] Found component via plugin system: ${componentName}`);
        
        // Create component instance
        const componentInstance = new Component({
          container: this.container,
          eventBus: this.eventBus,
          engine: this,
          state: this.state
        });
        
        // Store active component
        this.activeComponents[componentName] = componentInstance;
        
        // Render component
        componentInstance.render();
        
        return componentInstance;
      }
    } catch (error) {
      console.warn(`[AssessmentEngine] Error loading component via plugin system: ${error.message}`);
    }
    
    // Last resort: try specialized or generic component from global namespace
    const specializedComponentName = assessmentType.charAt(0).toUpperCase() + 
      assessmentType.slice(1) + componentName.charAt(0).toUpperCase() + 
      componentName.slice(1);
    
    if (window.AssessmentFramework && 
        window.AssessmentFramework[specializedComponentName]) {
      console.log(`[AssessmentEngine] Last resort: Using specialized component: ${specializedComponentName}`);
      
      const SpecializedComponent = window.AssessmentFramework[specializedComponentName];
      const componentInstance = new SpecializedComponent({
        container: this.container,
        eventBus: this.eventBus,
        engine: this,
        state: this.state
      });
      
      // Store active component
      this.activeComponents[componentName] = componentInstance;
      
      // Render component
      componentInstance.render();
      
      return componentInstance;
    }
    
    // Try generic component
    if (window.AssessmentFramework && 
        window.AssessmentFramework[componentName]) {
      console.log(`[AssessmentEngine] Last resort: Using generic component: ${componentName}`);
      
      const GenericComponent = window.AssessmentFramework[componentName];
      const componentInstance = new GenericComponent({
        container: this.container,
        eventBus: this.eventBus,
        engine: this,
        state: this.state
      });
      
      // Store active component
      this.activeComponents[componentName] = componentInstance;
      
      // Render component
      componentInstance.render();
      
      return componentInstance;
    }
    
    console.error(`[AssessmentEngine] No component found for: ${componentName}`);
    return null;
  }
  
  /**
   * Navigate to the next step
   */
  nextStep() {
    const currentStepIndex = this.state.steps.indexOf(this.state.currentStep);
    
    // Validate current step first
    if (!this.validateCurrentStep()) {
      console.log('[AssessmentEngine] Current step validation failed');
      return false;
    }
    
    // Check if there is a next step
    if (currentStepIndex < this.state.steps.length - 1) {
      // Move to next step
      this.state.currentStep = this.state.steps[currentStepIndex + 1];
      
      // Special handling for questions step
      if (this.state.currentStep === 'questions' && this.state.filteredQuestions.length === 0) {
        // Get questions for selected services/areas
        this._prepareQuestionsForCurrentAssessment();
      }
      
      // Special handling for results step
      if (this.state.currentStep === 'results' && !this.state.results) {
        // Calculate results
        this._calculateResults();
      }
      
      // Render the new step
      this.renderCurrentStep();
      
      // Notify about step change
      this.eventBus.emit('step:changed', this.state.currentStep);
      
      return true;
    } else {
      console.log('[AssessmentEngine] Already at last step');
      return false;
    }
  }
  
  /**
   * Navigate to the previous step
   */
  previousStep() {
    const currentStepIndex = this.state.steps.indexOf(this.state.currentStep);
    
    // Check if there is a previous step
    if (currentStepIndex > 0) {
      // Move to previous step
      this.state.currentStep = this.state.steps[currentStepIndex - 1];
      
      // Render the new step
      this.renderCurrentStep();
      
      // Notify about step change
      this.eventBus.emit('step:changed', this.state.currentStep);
      
      return true;
    } else {
      console.log('[AssessmentEngine] Already at first step');
      return false;
    }
  }
  
  /**
   * Validate the current step
   * @returns {boolean} - Whether the step is valid
   */
  validateCurrentStep() {
    // Get active component for the current step
    const currentComponent = this.activeComponents[this.state.currentStep];
    
    // If component has a validate method, use it
    if (currentComponent && typeof currentComponent.validate === 'function') {
      return currentComponent.validate();
    }
    
    // Default validation based on step
    switch (this.state.currentStep) {
      case 'type-selector':
        return !!this.state.assessmentType;
        
      case 'agency-type':
      case 'department':
        return !!this.state.selectedType;
        
      case 'services':
      case 'areas':
        return this.state.selectedServices && this.state.selectedServices.length > 0;
        
      case 'questions':
        // All questions must be answered
        if (!this.state.filteredQuestions || this.state.filteredQuestions.length === 0) {
          return false;
        }
        
        // Check if all questions have answers
        return this.state.filteredQuestions.every(q => 
          this.state.answers && this.state.answers[q.id] !== undefined
        );
        
      case 'email':
        return this._validateEmail(this.state.userData.email);
        
      default:
        return true;
    }
  }
  
  /**
   * Reset the assessment
   */
  resetAssessment() {
    // Reset state to initial values
    this.state = {
      assessmentType: null,
      currentStep: 'type-selector',
      steps: ['type-selector'],
      answers: {},
      selectedType: null,
      selectedServices: [],
      revenue: 0,
      userData: {
        email: '',
        name: ''
      },
      currentQuestionIndex: 0,
      filteredQuestions: [],
      results: null
    };
    
    // Clear active components
    this.activeComponents = {};
    
    // Render first step
    this.renderCurrentStep();
    
    // Notify about reset
    this.eventBus.emit('assessment:reset');
  }
  
  /**
   * Prepare questions for the current assessment type
   * @private
   */
  _prepareQuestionsForCurrentAssessment() {
    if (!this.config || !this.config.questions) {
      console.error('[AssessmentEngine] No questions available in config');
      this.state.filteredQuestions = [];
      return;
    }
    
    // Get questions based on assessment type and selected services/areas
    if (this.state.assessmentType === 'agency') {
      this.state.filteredQuestions = this._getQuestionsForSelectedServices();
    } else if (this.state.assessmentType === 'inhouse') {
      this.state.filteredQuestions = this._getQuestionsForSelectedAreas();
    } else {
      this.state.filteredQuestions = [];
    }
    
    console.log(`[AssessmentEngine] Prepared ${this.state.filteredQuestions.length} questions for assessment`);
  }
  
  /**
   * Get questions for selected services (agency assessment)
   * @returns {Array} - Filtered questions
   * @private
   */
  _getQuestionsForSelectedServices() {
    // Start with core questions
    let questions = [...(this.config.questions.core || [])];
    
    // Add service-specific questions for selected services
    if (this.state.selectedServices && this.state.selectedServices.length > 0 && 
        this.config.questions.serviceSpecific) {
      
      this.state.selectedServices.forEach(serviceId => {
        if (this.config.questions.serviceSpecific[serviceId]) {
          questions = questions.concat(this.config.questions.serviceSpecific[serviceId]);
        }
      });
    }
    
    // Agency type specific questions
    if (this.state.selectedType && this.config.questions.agencyTypeSpecific && 
        this.config.questions.agencyTypeSpecific[this.state.selectedType]) {
      
      questions = questions.concat(this.config.questions.agencyTypeSpecific[this.state.selectedType]);
    }
    
    // Deduplicate questions by ID
    const uniqueQuestions = [];
    const questionIds = new Set();
    
    questions.forEach(question => {
      if (!questionIds.has(question.id)) {
        questionIds.add(question.id);
        uniqueQuestions.push(question);
      }
    });
    
    return uniqueQuestions;
  }
  
  /**
   * Get questions for selected areas (inhouse assessment)
   * @returns {Array} - Filtered questions
   * @private
   */
  _getQuestionsForSelectedAreas() {
    // Start with core questions
    let questions = [...(this.config.questions.core || [])];
    
    // Add area-specific questions for selected areas
    if (this.state.selectedServices && this.state.selectedServices.length > 0 && 
        this.config.questions.areaSpecific) {
      
      this.state.selectedServices.forEach(areaId => {
        if (this.config.questions.areaSpecific[areaId]) {
          questions = questions.concat(this.config.questions.areaSpecific[areaId]);
        }
      });
    }
    
    // Department specific questions
    if (this.state.selectedType && this.config.questions.departmentSpecific && 
        this.config.questions.departmentSpecific[this.state.selectedType]) {
      
      questions = questions.concat(this.config.questions.departmentSpecific[this.state.selectedType]);
    }
    
    // Deduplicate questions by ID
    const uniqueQuestions = [];
    const questionIds = new Set();
    
    questions.forEach(question => {
      if (!questionIds.has(question.id)) {
        questionIds.add(question.id);
        uniqueQuestions.push(question);
      }
    });
    
    return uniqueQuestions;
  }
  
  /**
   * Calculate assessment results
   * @private
   */
  _calculateResults() {
    if (!this.scoringSystem) {
      console.error('[AssessmentEngine] No scoring system available');
      this._setFallbackResults();
      return;
    }
    
    try {
      // Prepare assessment data for scoring
      const assessmentData = {
        answers: this.state.answers,
        selectedServices: this.state.selectedServices,
        revenue: this.state.revenue
      };
      
      // Calculate results using appropriate scoring system
      const results = this.scoringSystem.calculateResults(
        assessmentData, 
        this.state.selectedType
      );
      
      // Store results in state
      this.state.results = results;
      
      console.log('[AssessmentEngine] Calculated results:', results);
      
      // Notify about results calculation
      this.eventBus.emit('results:calculated', results);
    } catch (error) {
      console.error('[AssessmentEngine] Error calculating results:', error);
      this._setFallbackResults();
    }
  }
  
  /**
   * Set fallback results when calculation fails
   * @private
   */
  _setFallbackResults() {
    // Create basic fallback results
    this.state.results = {
      scores: {
        overall: 50,
        operational: 50,
        financial: 50,
        ai: 50,
        strategic: 50
      },
      category: 'Calculation Error',
      recommendations: [
        { title: 'Error Calculating Results', text: 'There was a problem calculating your assessment results. Please try again or contact support.' }
      ]
    };
    
    // Notify about fallback results
    this.eventBus.emit('results:fallback', this.state.results);
  }
  
  /**
   * Validate email format
   * @param {string} email - Email to validate
   * @returns {boolean} - Whether the email is valid
   * @private
   */
  _validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  /**
   * Format number with commas
   * @param {number} num - Number to format
   * @returns {string} - Formatted number
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  /**
   * Format currency value
   * @param {number} value - Currency value
   * @returns {string} - Formatted currency
   */
  formatCurrency(value) {
    if (value === undefined || value === null) {
      return '$0';
    }
    
    // Convert to number if it's a string
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    
    // Format with $ and commas
    return '$' + amount.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
}

// Register in global namespace
window.AssessmentFramework = window.AssessmentFramework || {};
window.AssessmentFramework.Core = window.AssessmentFramework.Core || {};
window.AssessmentFramework.Core.AssessmentEngine = AssessmentEngine;
