/**
 * Assessment Framework Initialization
 * 
 * Bootstraps the modular assessment framework and initializes all core components.
 * This serves as the entry point for the new modular architecture.
 * Handles script dependencies and ensures proper loading sequence.
 */

(function($) {
  'use strict';
  
  // Track initialization state
  const state = {
    initialized: false,
    loading: false,
    containers: [],
    errors: []
  };
  
  // Initialize when DOM is ready
  $(document).ready(function() {
    console.log('[AssessmentFramework] Initializing modular assessment framework...');
    
    // Find all assessment containers (supporting both agency and inhouse assessments)
    $('.agency-assessment-wrapper, .assessment-framework-container').each(function() {
      // Store container reference for initialization after scripts are loaded
      state.containers.push(this);
    });
    
    // If containers found, load scripts and initialize
    if (state.containers.length > 0) {
      loadCoreDependencies();
    } else {
      console.warn('[AssessmentFramework] No assessment containers found');
    }
  });
  
  /**
   * Load core dependencies in the correct order
   */
  function loadCoreDependencies() {
    if (state.loading) return;
    state.loading = true;
    
    console.log('[AssessmentFramework] Loading core dependencies...');
    
    // Required dependencies in load order
    const dependencies = [
      { name: 'EventBus', path: 'assets/js/core/event-bus.js' },
      { name: 'ComponentRegistry', path: 'assets/js/core/component-registry.js' },
      { name: 'PluginSystem', path: 'assets/js/core/plugin-system.js' },
      { name: 'ConfigLoader', path: 'assets/js/core/config-loader.js' },
      { name: 'AssessmentEngine', path: 'assets/js/core/assessment-engine.js' },
      { name: 'AssessmentTypes', path: 'assets/js/config/assessment-types.js' }
    ];
    
    // Common components to preload - these must be loaded before the assessment is initialized
    const commonComponents = [
      { path: 'assets/js/components/common/TypeSelector.js' },
      { path: 'assets/js/components/common/EmailCollector.js' }
    ];
    
    // Load all dependencies sequentially
    loadScriptsSequentially(dependencies)
      .then(() => {
        console.log('[AssessmentFramework] Core dependencies loaded successfully');
        // Add verification of dependency loading
        const coreModulesLoaded = checkCoreDependencies();
        if (!coreModulesLoaded) {
          throw new Error('Core modules failed to load correctly');
        }
        
        return loadScriptsSequentially(commonComponents);
      })
      .then(() => {
        console.log('[AssessmentFramework] Common components loaded successfully');
        
        // Verify TypeSelector component is available
        if (window.AssessmentFramework?.Components?.common?.TypeSelector) {
          console.log('[AssessmentFramework] TypeSelector component verified');
        } else {
          console.error('[AssessmentFramework] TypeSelector component not found after loading');
          // Force-register TypeSelector if it's in the global scope but not in the component registry
          if (window.TypeSelector && window.AssessmentFramework.componentRegistry) {
            console.log('[AssessmentFramework] Manually registering TypeSelector component');
            window.AssessmentFramework.componentRegistry.register('TypeSelector', window.TypeSelector, 'common');
          }
        }
        
        state.initialized = true;
        
        // Initialize containers
        state.containers.forEach(container => {
          initializeAssessmentFramework(container);
        });
      })
      .catch(error => {
        console.error('[AssessmentFramework] Failed to load dependencies:', error);
        state.errors.push(error);
        state.containers.forEach(container => {
          showInitializationError(container, error);
        });
      });
  }
  
  /**
   * Load scripts sequentially
   * @param {Array} scripts - Array of script objects with name and path
   * @returns {Promise} - Promise that resolves when all scripts are loaded
   */
  function loadScriptsSequentially(scripts) {
    return scripts.reduce((promise, script) => {
      return promise.then(() => loadScript(script.path));
    }, Promise.resolve());
  }
  
  /**
   * Load a script and return a promise
   * @param {string} src - Script source URL
   * @returns {Promise} - Promise that resolves when script is loaded
   */
  function loadScript(src) {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src="${src}"]`);
      if (existingScript) {
        console.log(`[AssessmentFramework] Script already loaded: ${src}`);
        resolve();
        return;
      }
      
      // Add timestamp to bypass cache during development
      const timestamp = new Date().getTime();
      const scriptSrc = src.includes('?') ? `${src}&_=${timestamp}` : `${src}?_=${timestamp}`;
      
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = false; // Important: load in order
      
      // Add timeout to detect loading issues
      const timeout = setTimeout(() => {
        console.warn(`[AssessmentFramework] Script loading timeout: ${src}`);
      }, 5000);
      
      script.onload = () => {
        clearTimeout(timeout);
        console.log(`[AssessmentFramework] Loaded script: ${src}`);
        
        // Verify component registration for component scripts
        if (src.includes('/components/')) {
          const componentName = src.split('/').pop().replace('.js', '');
          console.log(`[AssessmentFramework] Checking if component '${componentName}' was registered...`);
          
          // Give time for component to register itself
          setTimeout(() => {
            // Check if the component is registered in the proper namespace
            const namespace = src.includes('/common/') ? 'common' : 
                            src.includes('/agency/') ? 'agency' : 
                            src.includes('/inhouse/') ? 'inhouse' : null;
                            
            if (namespace && window.AssessmentFramework && 
                window.AssessmentFramework.Components && 
                window.AssessmentFramework.Components[namespace] && 
                window.AssessmentFramework.Components[namespace][componentName]) {
              console.log(`[AssessmentFramework] Component '${componentName}' verified in namespace '${namespace}'`);
            } else {
              console.warn(`[AssessmentFramework] Component '${componentName}' registration not detected in namespace '${namespace}'`);
            }
            
            resolve();
          }, 100);
        } else {
          resolve();
        }
      };
      
      script.onerror = (error) => {
        clearTimeout(timeout);
        console.error(`[AssessmentFramework] Error loading script: ${src}`, error);
        reject(new Error(`Failed to load script: ${src}`));
      };
      
      document.head.appendChild(script);
    });
  }
  
  /**
   * Initialize the assessment framework in a container
   * @param {HTMLElement} container - Container element
   */
  function initializeAssessmentFramework(container) {
    try {
      // Check if core dependencies are available
      if (!checkCoreDependencies()) {
        throw new Error('Required core modules not found. Dependencies may not have loaded correctly.');
      }
      
      // Create event bus
      const eventBus = new window.AssessmentFramework.Core.EventBus();
      eventBus.setDebugMode(true);
      
      // Create config loader
      const configLoader = new window.AssessmentFramework.Core.ConfigLoader({
        eventBus: eventBus,
        paths: {
          assessmentTypes: 'assets/js/config/assessment-types.js',
          agency: 'assets/js/config/agency-assessment-config.js',
          inhouse: 'assets/js/config/inhouse-assessment-config.js'
        }
      });
      
      // Create plugin system
      const pluginSystem = new window.AssessmentFramework.Core.PluginSystem({
        paths: {
          base: 'assets/js/components',
          common: 'assets/js/components/common',
          agency: 'assets/js/components/agency',
          inhouse: 'assets/js/components/inhouse'
        }
      });
      
      // Set up event handlers for component loading
      setupComponentLoadingEvents(eventBus, pluginSystem);
      
      // Create assessment engine
      const engine = new window.AssessmentFramework.Core.AssessmentEngine({
        container: container,
        eventBus: eventBus,
        pluginSystem: pluginSystem,
        configLoader: configLoader
      });
      
      // Initialize engine
      engine.initialize().then(() => {
        console.log('[AssessmentFramework] Engine initialized successfully');
        
        // Mark container as initialized
        $(container).addClass('assessment-initialized');
        
        // Set up backward compatibility layer
        setupBackwardCompatibility(engine);
      }).catch(error => {
        console.error('[AssessmentFramework] Error initializing engine:', error);
        showInitializationError(container, error);
      });
      
      // Store engine reference on container for potential external access
      $(container).data('assessmentEngine', engine);
      
    } catch (error) {
      console.error('[AssessmentFramework] Critical initialization error:', error);
      showInitializationError(container, error);
    }
  }
  
  /**
   * Check if all core dependencies are available
   * @returns {boolean} - Whether all dependencies are available
   */
  function checkCoreDependencies() {
    const requiredModules = [
      'AssessmentFramework.Core.EventBus',
      'AssessmentFramework.Core.PluginSystem',
      'AssessmentFramework.Core.ConfigLoader',
      'AssessmentFramework.Core.AssessmentEngine'
    ];
    
    return requiredModules.every(modulePath => {
      const parts = modulePath.split('.');
      let obj = window;
      
      for (const part of parts) {
        if (!obj[part]) {
          console.error(`[AssessmentFramework] Missing dependency: ${modulePath}`);
          return false;
        }
        obj = obj[part];
      }
      
      return true;
    });
  }
  
  /**
   * Set up event handlers for component loading
   * @param {Object} eventBus - Event bus instance
   * @param {Object} pluginSystem - Plugin system instance
   */
  function setupComponentLoadingEvents(eventBus, pluginSystem) {
    // Listen for assessment type selection to load type-specific components
    eventBus.on('assessment:typeSet', (type) => {
      console.log(`[AssessmentFramework] Loading ${type}-specific components...`);
      
      // Determine components to load based on type
      const components = [];
      
      if (type === 'agency') {
        components.push(
          { path: 'assets/js/components/agency/AgencyTypeSelector.js' },
          { path: 'assets/js/components/agency/ServicesSelector.js' },
          { path: 'assets/js/components/agency/QuestionsRenderer.js' },
          { path: 'assets/js/components/agency/ResultsRenderer.js' }
        );
      } else if (type === 'inhouse') {
        components.push(
          { path: 'assets/js/components/inhouse/DepartmentSelector.js' },
          { path: 'assets/js/components/inhouse/AreasSelector.js' },
          { path: 'assets/js/components/inhouse/QuestionsRenderer.js' },
          { path: 'assets/js/components/inhouse/ResultsRenderer.js' }
        );
      }
      
      // Load the components
      if (components.length > 0) {
        loadScriptsSequentially(components)
          .then(() => {
            console.log(`[AssessmentFramework] ${type} components loaded successfully`);
            eventBus.emit('components:loaded', type);
          })
          .catch(error => {
            console.error(`[AssessmentFramework] Error loading ${type} components:`, error);
            eventBus.emit('components:error', { type, error });
          });
      }
    });
  }
  
  /**
   * Set up backward compatibility with existing code
   * @param {Object} engine - Assessment engine instance
   */
  function setupBackwardCompatibility(engine) {
    // If the old AgencyAssessment global exists, provide compatibility
    if (window.AgencyAssessment) {
      console.log('[AssessmentFramework] Setting up backward compatibility layer');
      
      // Create a proxy to redirect old API calls to the new engine
      window.AgencyAssessment.prototype.compatibilityEngine = engine;
      
      // Store original methods for fallback
      const originalMethods = {};
      const methodsToBridge = [
        'nextStep', 
        'previousStep', 
        'resetAssessment',
        'calculateResults',
        'renderCurrentStep',
        'validateCurrentStep',
        'downloadResults',
        'getQuestionsForSelectedServices'
      ];
      
      // Set up method proxies for each method to bridge
      methodsToBridge.forEach(method => {
        if (typeof window.AgencyAssessment.prototype[method] === 'function') {
          originalMethods[method] = window.AgencyAssessment.prototype[method];
          
          window.AgencyAssessment.prototype[method] = function(...args) {
            if (this.compatibilityEngine && typeof this.compatibilityEngine[method] === 'function') {
              return this.compatibilityEngine[method](...args);
            } else {
              return originalMethods[method].apply(this, args);
            }
          };
        }
      });
      
      // Handle state updates from old to new
      const originalSetState = window.AgencyAssessment.prototype.setState;
      if (originalSetState) {
        window.AgencyAssessment.prototype.setState = function(newState) {
          // Update old state
          if (originalSetState) {
            originalSetState.call(this, newState);
          }
          
          // Update new engine state if available
          if (this.compatibilityEngine) {
            this.compatibilityEngine.updateState(newState);
          }
        };
      }
    }
  }
  
  /**
   * Show initialization error in the container
   * @param {HTMLElement} container - Container element
   * @param {Error} error - Error object
   */
  function showInitializationError(container, error) {
    const errorMessage = document.createElement('div');
    errorMessage.className = 'assessment-initialization-error';
    errorMessage.innerHTML = `
      <h3>Assessment Framework Error</h3>
      <p>There was an error initializing the assessment framework:</p>
      <pre>${error.message}</pre>
      <p>Please refresh the page or contact support if the problem persists.</p>
      <button class="retry-button">Retry Initialization</button>
    `;
    
    // Style the error message
    errorMessage.style.padding = '20px';
    errorMessage.style.backgroundColor = '#ffebee';
    errorMessage.style.color = '#c62828';
    errorMessage.style.border = '1px solid #ef9a9a';
    errorMessage.style.borderRadius = '4px';
    errorMessage.style.margin = '20px 0';
    
    // Clear container and show error
    container.innerHTML = '';
    container.appendChild(errorMessage);
    
    // Add retry button handler
    const retryButton = errorMessage.querySelector('.retry-button');
    if (retryButton) {
      retryButton.addEventListener('click', function() {
        // Clear error and try again
        container.innerHTML = '<div class="loading-message">Retrying initialization...</div>';
        setTimeout(() => {
          initializeAssessmentFramework(container);
        }, 500);
      });
    }
  }
  
  // Expose public API
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.initialize = function(container) {
    if (container) {
      initializeAssessmentFramework(container);
    } else {
      // Initialize all containers
      $('.agency-assessment-wrapper, .assessment-framework-container').each(function() {
        initializeAssessmentFramework(this);
      });
    }
  };
  
  // Expose version info
  window.AssessmentFramework.version = '2.0.0';
  window.AssessmentFramework.buildDate = new Date().toISOString().split('T')[0];
  
})(jQuery);
