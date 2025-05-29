/**
 * Assessment Framework - Event Manager
 * 
 * Provides utilities for event handling and management
 */

class EventManager {
    /**
     * Constructor for the event manager
     */
    constructor() {
        this.events = {};
    }
    
    /**
     * Subscribe to an event
     * @param {String} eventName - Name of the event to subscribe to
     * @param {Function} callback - Function to call when event is triggered
     * @return {String} - Subscription ID that can be used to unsubscribe
     */
    subscribe(eventName, callback) {
        if (!this.events[eventName]) {
            this.events[eventName] = [];
        }
        
        const subscriptionId = `${eventName}_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        this.events[eventName].push({
            id: subscriptionId,
            callback: callback
        });
        
        return subscriptionId;
    }
    
    /**
     * Unsubscribe from an event
     * @param {String} subscriptionId - ID returned from subscribe method
     * @return {Boolean} - True if unsubscribe was successful
     */
    unsubscribe(subscriptionId) {
        const [eventName] = subscriptionId.split('_');
        
        if (!this.events[eventName]) {
            return false;
        }
        
        const initialLength = this.events[eventName].length;
        this.events[eventName] = this.events[eventName].filter(
            subscriber => subscriber.id !== subscriptionId
        );
        
        return this.events[eventName].length < initialLength;
    }
    
    /**
     * Publish an event with data
     * @param {String} eventName - Name of the event to publish
     * @param {any} data - Data to pass to subscribers
     */
    publish(eventName, data) {
        if (!this.events[eventName]) {
            return;
        }
        
        this.events[eventName].forEach(subscriber => {
            try {
                subscriber.callback(data);
            } catch (error) {
                console.error(`[EventManager] Error in event handler for ${eventName}:`, error);
            }
        });
    }
    
    /**
     * Remove all subscriptions for an event
     * @param {String} eventName - Name of the event to clear
     */
    clearEvent(eventName) {
        delete this.events[eventName];
    }
    
    /**
     * Remove all event subscriptions
     */
    clearAllEvents() {
        this.events = {};
    }
}

// Create a singleton instance for global event management
const eventManager = new EventManager();

/**
 * Helper function to add event listener with automatic cleanup
 * @param {Element} element - DOM element to attach listener to
 * @param {String} event - Event name (e.g., 'click')
 * @param {Function} handler - Event handler function
 * @param {Object} options - Event listener options
 * @return {Function} - Function to remove the event listener
 */
function addEvent(element, event, handler, options = {}) {
    if (!element) {
        console.error('[EventManager] Cannot add event to null element');
        return () => {};
    }
    
    element.addEventListener(event, handler, options);
    
    return () => {
        element.removeEventListener(event, handler, options);
    };
}

/**
 * Helper function to add multiple events at once with automatic cleanup
 * @param {Element} element - DOM element to attach listeners to
 * @param {Object} events - Object with event names as keys and handlers as values
 * @param {Object} options - Event listener options
 * @return {Function} - Function to remove all event listeners
 */
function addEvents(element, events, options = {}) {
    if (!element) {
        console.error('[EventManager] Cannot add events to null element');
        return () => {};
    }
    
    const removeHandlers = [];
    
    Object.entries(events).forEach(([event, handler]) => {
        element.addEventListener(event, handler, options);
        removeHandlers.push(() => {
            element.removeEventListener(event, handler, options);
        });
    });
    
    return () => {
        removeHandlers.forEach(remove => remove());
    };
}

// Make event utilities available as browser globals
window.eventManager = eventManager;
window.addEvent = addEvent;
window.addEvents = addEvents;
