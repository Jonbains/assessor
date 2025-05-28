/**
 * Plugin System - Core Module
 * 
 * Manages the dynamic loading and registration of components in the assessment framework.
 * Allows for extending the framework with new component types without modifying the core.
 */

class PluginSystem {
  /**
   * Create a plugin system instance
   * @param {Object} options - Plugin system configuration
   * @param {Object} options.paths - Component paths configuration
   */
  constructor(options = {}) {
    // Component registry
    this.components = {};
    
    // Component paths
    this.paths = options.paths || {
      base: 'assets/js/components',
      common: 'assets/js/components/common',
      agency: 'assets/js/components/agency',
      inhouse: 'assets/js/components/inhouse'
    };
    
    // Loaded components cache
    this.loadedComponents = new Set();
    
    console.log('[PluginSystem] Initialized with paths:', this.paths);
  }
  
  /**
   * Register a component
   * @param {string} name - Component name
   * @param {Function|Class} component - Component constructor
   * @returns {boolean} - Whether registration was successful
   */
  registerComponent(name, component) {
    if (this.components[name]) {
      console.warn(`[PluginSystem] Component '${name}' already registered. Overwriting.`);
    }
    
    this.components[name] = component;
    this.loadedComponents.add(name);
    
    console.log(`[PluginSystem] Component registered: ${name}`);
    return true;
  }
  
  /**
   * Get a registered component
   * @param {string} name - Component name or path (e.g., 'agency/AgencyTypeSelector')
   * @returns {Function|Class|null} - Component constructor or null if not found
   */
  getComponent(name) {
    // Check if component is already registered
    if (this.components[name]) {
      return this.components[name];
    }
    
    // If name contains a path separator, try to load it
    if (name.includes('/')) {
      // Split into type and component name
      const [type, componentName] = name.split('/');
      
      // Try to load from global namespace
      const component = this._findComponentInNamespace(type, componentName);
      
      if (component) {
        // Register for future use
        this.registerComponent(name, component);
        return component;
      }
    }
    
    console.warn(`[PluginSystem] Component not found: ${name}`);
    return null;
  }
  
  /**
   * Find a component in the global namespace
   * @param {string} type - Component type (e.g., 'agency', 'common')
   * @param {string} name - Component name
   * @returns {Function|Class|null} - Component constructor or null if not found
   * @private
   */
  _findComponentInNamespace(type, name) {
    // Check in global AssessmentFramework namespace
    if (window.AssessmentFramework && 
        window.AssessmentFramework.Components) {
      
      // Check in type-specific namespace first
      if (window.AssessmentFramework.Components[type] && 
          window.AssessmentFramework.Components[type][name]) {
        return window.AssessmentFramework.Components[type][name];
      }
      
      // Check in root components namespace
      if (window.AssessmentFramework.Components[name]) {
        return window.AssessmentFramework.Components[name];
      }
    }
    
    return null;
  }
  
  /**
   * Check if a component is loaded
   * @param {string} name - Component name
   * @returns {boolean} - Whether the component is loaded
   */
  isComponentLoaded(name) {
    return this.loadedComponents.has(name);
  }
  
  /**
   * Get component path
   * @param {string} type - Component type ('common', 'agency', 'inhouse')
   * @param {string} name - Component name
   * @returns {string} - Component path
   * @private
   */
  _getComponentPath(type, name) {
    const basePath = this.paths[type] || this.paths.base;
    return `${basePath}/${name}.js`;
  }
  
  /**
   * Dynamically load a component script
   * @param {string} path - Path to component script
   * @param {string} componentName - Name of the component being loaded
   * @param {string} componentType - Type of the component (common, agency, etc.)
   * @returns {Promise} - Promise that resolves when script is loaded and component is registered
   * @private
   */
  _loadScript(path, componentName, componentType) {
    return new Promise((resolve, reject) => {
      // Check if script is already loaded
      const existingScript = document.querySelector(`script[src^="${path}"]`);
      if (existingScript) {
        console.log(`[PluginSystem] Script already loaded: ${path}`);
        // Still need to verify component registration
        this._verifyComponentRegistration(componentName, componentType)
          .then(resolve)
          .catch(reject);
        return;
      }
      
      // Add cache buster for development
      const timestamp = new Date().getTime();
      const scriptSrc = path.includes('?') ? `${path}&_=${timestamp}` : `${path}?_=${timestamp}`;
      
      const script = document.createElement('script');
      script.src = scriptSrc;
      script.async = false; // Important for dependency order
      
      // Add timeout to detect loading issues
      const timeout = setTimeout(() => {
        console.warn(`[PluginSystem] Script loading timeout: ${path}`);
      }, 5000);
      
      script.onload = () => {
        clearTimeout(timeout);
        console.log(`[PluginSystem] Script loaded: ${path}`);
        
        // Wait a bit for component to register itself in the global namespace
        setTimeout(() => {
          this._verifyComponentRegistration(componentName, componentType)
            .then(resolve)
            .catch(reject);
        }, 100);
      };
      
      script.onerror = () => {
        clearTimeout(timeout);
        console.error(`[PluginSystem] Failed to load script: ${path}`);
        reject(new Error(`Failed to load script: ${path}`));
      };
      
      document.head.appendChild(script);
    });
  }
  
  /**
   * Verify that a component is properly registered in the global namespace
   * @param {string} componentName - Name of the component
   * @param {string} componentType - Type of the component (common, agency, etc.)
   * @returns {Promise} - Promise that resolves when component is verified
   * @private
   */
  _verifyComponentRegistration(componentName, componentType) {
    return new Promise((resolve, reject) => {
      // Maximum number of retries
      const maxRetries = 3;
      let retries = 0;
      
      const checkRegistration = () => {
        console.log(`[PluginSystem] Verifying component registration: ${componentType}/${componentName} (attempt ${retries + 1})`);
        
        // Check if component is registered in the global namespace
        const isRegistered = window.AssessmentFramework && 
                            window.AssessmentFramework.Components && 
                            window.AssessmentFramework.Components[componentType] && 
                            window.AssessmentFramework.Components[componentType][componentName];
        
        if (isRegistered) {
          // Component found, register it locally
          const fullName = componentType === 'common' ? componentName : `${componentType}/${componentName}`;
          const component = window.AssessmentFramework.Components[componentType][componentName];
          
          this.registerComponent(fullName, component);
          console.log(`[PluginSystem] Component verified: ${fullName}`);
          resolve(component);
        } else if (retries < maxRetries) {
          // Try again after a delay
          retries++;
          setTimeout(checkRegistration, 200 * retries);
        } else {
          // Give up after max retries
          console.warn(`[PluginSystem] Component not registered after ${maxRetries} attempts: ${componentType}/${componentName}`);
          
          // Don't reject, just resolve with a warning - we'll fall back to global lookup
          resolve(null);
        }
      };
      
      // Start verification
      checkRegistration();
    });
  }
  
  /**
   * Load multiple components at once
   * @param {Array} components - Array of component names or objects with type and name
   * @returns {Promise} - Promise that resolves when all components are loaded
   */
  async loadComponents(components) {
    const promises = components.map(comp => {
      // Handle both string names and {type, name} objects
      const type = typeof comp === 'string' ? 'common' : comp.type;
      const name = typeof comp === 'string' ? comp : comp.name;
      
      // Create full component name
      const fullName = type === 'common' ? name : `${type}/${name}`;
      
      // Skip if already loaded
      if (this.isComponentLoaded(fullName)) {
        console.log(`[PluginSystem] Component already loaded: ${fullName}`);
        return Promise.resolve();
      }
      
      // Get component path
      const path = this._getComponentPath(type, name);
      
      console.log(`[PluginSystem] Loading component: ${fullName} from path: ${path}`);
      
      // Load script and verify component registration
      return this._loadScript(path, name, type).then(component => {
        // Mark as loaded
        this.loadedComponents.add(fullName);
        return component;
      }).catch(error => {
        console.error(`[PluginSystem] Error loading component ${fullName}:`, error);
        // Don't fail the entire batch if one component fails
        return null;
      });
    });
    
    return Promise.all(promises);
  }
  
  /**
   * Get all registered components
   * @returns {Object} - Map of component names to constructors
   */
  getAllComponents() {
    return { ...this.components };
  }
  
  /**
   * Get all loaded component names
   * @returns {Array} - Array of loaded component names
   */
  getLoadedComponentNames() {
    return Array.from(this.loadedComponents);
  }
}

// Register in global namespace
window.AssessmentFramework = window.AssessmentFramework || {};
window.AssessmentFramework.Core = window.AssessmentFramework.Core || {};
window.AssessmentFramework.Core.PluginSystem = PluginSystem;
