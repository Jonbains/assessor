/**
 * Event Bus - Core Module
 * 
 * Provides a simple event bus for inter-component communication within the assessment framework.
 * Components can subscribe to events and publish events to communicate without direct coupling.
 */

class EventBus {
  /**
   * Create an event bus instance
   */
  constructor() {
    // Event registry
    this.events = {};
    this.debugMode = false;
  }
  
  /**
   * Enable debug mode to log all events
   * @param {boolean} enable - Whether to enable debug mode
   */
  setDebugMode(enable) {
    this.debugMode = !!enable;
    
    if (this.debugMode) {
      console.log('[EventBus] Debug mode enabled');
    }
  }
  
  /**
   * Subscribe to an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   * @returns {Function} - Unsubscribe function
   */
  on(event, callback) {
    // Initialize event array if it doesn't exist
    if (!this.events[event]) {
      this.events[event] = [];
    }
    
    // Add callback to event array
    this.events[event].push(callback);
    
    if (this.debugMode) {
      console.log(`[EventBus] Subscribed to event: ${event}`);
    }
    
    // Return unsubscribe function
    return () => this.off(event, callback);
  }
  
  /**
   * Unsubscribe from an event
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  off(event, callback) {
    // Check if event exists
    if (!this.events[event]) {
      return;
    }
    
    // Remove callback from event array
    this.events[event] = this.events[event].filter(cb => cb !== callback);
    
    if (this.debugMode) {
      console.log(`[EventBus] Unsubscribed from event: ${event}`);
    }
    
    // Clean up empty event arrays
    if (this.events[event].length === 0) {
      delete this.events[event];
    }
  }
  
  /**
   * Emit an event
   * @param {string} event - Event name
   * @param {*} data - Event data
   */
  emit(event, data) {
    // Check if event exists
    if (!this.events[event]) {
      if (this.debugMode) {
        console.log(`[EventBus] Event emitted but no subscribers: ${event}`, data);
      }
      return;
    }
    
    if (this.debugMode) {
      console.log(`[EventBus] Emitting event: ${event}`, data);
    }
    
    // Call all callbacks for this event
    this.events[event].forEach(callback => {
      try {
        callback(data);
      } catch (error) {
        console.error(`[EventBus] Error in event handler for ${event}:`, error);
      }
    });
  }
  
  /**
   * Subscribe to an event once
   * @param {string} event - Event name
   * @param {Function} callback - Callback function
   */
  once(event, callback) {
    // Create wrapper that will unsubscribe after first call
    const wrapper = (data) => {
      // Unsubscribe
      this.off(event, wrapper);
      // Call original callback
      callback(data);
    };
    
    // Subscribe with wrapper
    return this.on(event, wrapper);
  }
  
  /**
   * Clear all event subscriptions
   */
  clear() {
    this.events = {};
    
    if (this.debugMode) {
      console.log('[EventBus] All event subscriptions cleared');
    }
  }
  
  /**
   * Get list of events with subscribers
   * @returns {Array} - List of event names
   */
  getEventNames() {
    return Object.keys(this.events);
  }
  
  /**
   * Get number of subscribers for an event
   * @param {string} event - Event name
   * @returns {number} - Number of subscribers
   */
  getSubscriberCount(event) {
    return this.events[event] ? this.events[event].length : 0;
  }
}

// Register in global namespace
window.AssessmentFramework = window.AssessmentFramework || {};
window.AssessmentFramework.Core = window.AssessmentFramework.Core || {};
window.AssessmentFramework.Core.EventBus = EventBus;
