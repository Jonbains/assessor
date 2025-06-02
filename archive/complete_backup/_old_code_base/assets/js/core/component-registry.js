/**
 * Component Registry - Core Module
 * 
 * This module manages the registration, initialization, and loading of components
 * in the assessment framework. It specifically addresses circular dependency issues
 * and initialization sequencing that caused previous browser crashes.
 */

class ComponentRegistry {
  constructor() {
    this.components = {};
    this.instances = {};
    this.initializationQueue = [];
    this.initialized = false;
  }
  
  // PHASE 1: Just register, don't initialize
  register(name, component) {
    this.components[name] = component;
    console.log(`Registered component: ${name}`);
    return true;
  }
  
  // PHASE 2: Now initialize everything
  completeInitialization() {
    console.log('ComponentRegistry: Completing initialization');
    this.initialized = true;
    
    // Process any pending initializations
    while (this.initializationQueue.length > 0) {
      const { name, args } = this.initializationQueue.shift();
      this._initializeComponent(name, args);
    }
    
    return true;
  }
  
  // Handle component requests
  get(name, ...args) {
    if (!this.components[name]) {
      console.error(`Component not found: ${name}`);
      return null;
    }
    
    // If not initialized yet, queue it
    if (!this.initialized) {
      console.log(`Queuing initialization of: ${name}`);
      this.initializationQueue.push({ name, args });
      return null;
    }
    
    // Initialize if needed
    if (!this.instances[name]) {
      this._initializeComponent(name, args);
    }
    
    return this.instances[name];
  }
  
  // Private method for initialization
  _initializeComponent(name, args) {
    if (!this.components[name]) return null;
    
    try {
      console.log(`Initializing component: ${name}`);
      this.instances[name] = new this.components[name](...args);
      return this.instances[name];
    } catch (err) {
      console.error(`Failed to initialize ${name}:`, err);
      return null;
    }
  }
}

// Global reference for debugging
window.AssessmentComponentRegistry = ComponentRegistry;