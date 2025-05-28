/**
 * Assessment Framework - Storage Utilities
 * 
 * Provides utility functions for working with local storage and session storage
 */

/**
 * Save data to localStorage with optional expiry
 * @param {String} key - The key to store the data under
 * @param {any} value - The data to store
 * @param {Number} expiryMs - Milliseconds until expiry (optional)
 */
export function saveToLocalStorage(key, value, expiryMs = null) {
    try {
        const item = {
            value: value
        };
        
        if (expiryMs !== null) {
            item.expiry = new Date().getTime() + expiryMs;
        }
        
        localStorage.setItem(key, JSON.stringify(item));
        return true;
    } catch (error) {
        console.error('[Storage] Error saving to localStorage:', error);
        return false;
    }
}

/**
 * Load data from localStorage
 * @param {String} key - The key to retrieve data from
 * @param {any} defaultValue - Default value to return if key not found
 * @return {any} - The stored data or defaultValue if not found or expired
 */
export function loadFromLocalStorage(key, defaultValue = null) {
    try {
        const itemStr = localStorage.getItem(key);
        
        // Return default if no item found
        if (!itemStr) {
            return defaultValue;
        }
        
        const item = JSON.parse(itemStr);
        
        // Check for expiry
        if (item.expiry && new Date().getTime() > item.expiry) {
            localStorage.removeItem(key);
            return defaultValue;
        }
        
        return item.value;
    } catch (error) {
        console.error('[Storage] Error loading from localStorage:', error);
        return defaultValue;
    }
}

/**
 * Remove data from localStorage
 * @param {String} key - The key to remove
 */
export function removeFromLocalStorage(key) {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('[Storage] Error removing from localStorage:', error);
        return false;
    }
}

/**
 * Check if a key exists in localStorage and is not expired
 * @param {String} key - The key to check
 * @return {Boolean} - True if the key exists and is not expired
 */
export function existsInLocalStorage(key) {
    try {
        const itemStr = localStorage.getItem(key);
        
        if (!itemStr) {
            return false;
        }
        
        const item = JSON.parse(itemStr);
        
        // Check for expiry
        if (item.expiry && new Date().getTime() > item.expiry) {
            localStorage.removeItem(key);
            return false;
        }
        
        return true;
    } catch (error) {
        return false;
    }
}

/**
 * Save data to sessionStorage
 * @param {String} key - The key to store the data under
 * @param {any} value - The data to store
 */
export function saveToSessionStorage(key, value) {
    try {
        sessionStorage.setItem(key, JSON.stringify(value));
        return true;
    } catch (error) {
        console.error('[Storage] Error saving to sessionStorage:', error);
        return false;
    }
}

/**
 * Load data from sessionStorage
 * @param {String} key - The key to retrieve data from
 * @param {any} defaultValue - Default value to return if key not found
 * @return {any} - The stored data or defaultValue if not found
 */
export function loadFromSessionStorage(key, defaultValue = null) {
    try {
        const itemStr = sessionStorage.getItem(key);
        
        if (!itemStr) {
            return defaultValue;
        }
        
        return JSON.parse(itemStr);
    } catch (error) {
        console.error('[Storage] Error loading from sessionStorage:', error);
        return defaultValue;
    }
}

/**
 * Remove data from sessionStorage
 * @param {String} key - The key to remove
 */
export function removeFromSessionStorage(key) {
    try {
        sessionStorage.removeItem(key);
        return true;
    } catch (error) {
        console.error('[Storage] Error removing from sessionStorage:', error);
        return false;
    }
}
