/**
 * Assessment Framework - State Manager
 * 
 * Manages the state for an assessment including persistence and updates
 */

export class StateManager {
    /**
     * Constructor for the state manager
     * @param {Object} assessment - Reference to the parent assessment
     */
    constructor(assessment) {
        this.assessment = assessment;
        this.localStorageKey = `assessment_${this.getAssessmentType()}_state`;
    }
    
    /**
     * Get the assessment type from the configuration
     * @return {String} - The assessment type
     */
    getAssessmentType() {
        return this.assessment.config.type || 'generic';
    }
    
    /**
     * Save the current assessment state to localStorage
     */
    saveState() {
        try {
            const stateToSave = { 
                ...this.assessment.state,
                // Add timestamp for expiry management
                savedAt: new Date().getTime()
            };
            
            localStorage.setItem(this.localStorageKey, JSON.stringify(stateToSave));
            console.log('[StateManager] State saved successfully');
        } catch (error) {
            console.error('[StateManager] Error saving state to localStorage:', error);
        }
    }
    
    /**
     * Load the assessment state from localStorage
     * @param {Number} maxAgeMs - Maximum age of the state in milliseconds
     * @return {Boolean} - True if the state was loaded successfully
     */
    loadState(maxAgeMs = 7 * 24 * 60 * 60 * 1000) { // Default to 7 days
        try {
            const savedState = localStorage.getItem(this.localStorageKey);
            if (!savedState) {
                return false;
            }
            
            const parsedState = JSON.parse(savedState);
            
            // Check if state is too old
            if (maxAgeMs > 0 && parsedState.savedAt) {
                const currentTime = new Date().getTime();
                if (currentTime - parsedState.savedAt > maxAgeMs) {
                    console.log('[StateManager] Saved state is too old, not loading');
                    this.clearState();
                    return false;
                }
            }
            
            // Update the assessment state
            this.assessment.state = {
                ...this.assessment.state, // Keep default properties
                ...parsedState // Override with saved values
            };
            
            console.log('[StateManager] State loaded successfully');
            return true;
        } catch (error) {
            console.error('[StateManager] Error loading state from localStorage:', error);
            return false;
        }
    }
    
    /**
     * Clear the saved state from localStorage
     */
    clearState() {
        try {
            localStorage.removeItem(this.localStorageKey);
            console.log('[StateManager] State cleared from localStorage');
        } catch (error) {
            console.error('[StateManager] Error clearing state from localStorage:', error);
        }
    }
    
    /**
     * Update a specific property in the state
     * @param {String} key - The property key to update
     * @param {any} value - The new value
     * @param {Boolean} save - Whether to save state to localStorage after update
     */
    updateState(key, value, save = true) {
        this.assessment.state[key] = value;
        
        if (save) {
            this.saveState();
        }
    }
    
    /**
     * Bulk update multiple properties in the state
     * @param {Object} updates - Object with key-value pairs to update
     * @param {Boolean} save - Whether to save state to localStorage after update
     */
    updateStateMultiple(updates, save = true) {
        Object.assign(this.assessment.state, updates);
        
        if (save) {
            this.saveState();
        }
    }
}
