/**
 * Assessment Framework - Validation Utilities
 * 
 * Provides utility functions for data validation
 */

/**
 * Validate an email address
 * @param {String} email - The email address to validate
 * @return {Boolean} - True if the email is valid
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

/**
 * Validate a required string is not empty
 * @param {String} value - The string to validate
 * @return {Boolean} - True if the string is not empty
 */
function validateRequired(value) {
    return typeof value === 'string' && value.trim().length > 0;
}

/**
 * Validate a number is within a range
 * @param {Number} value - The number to validate
 * @param {Number} min - Minimum allowed value (inclusive)
 * @param {Number} max - Maximum allowed value (inclusive)
 * @return {Boolean} - True if the number is within range
 */
function validateNumberRange(value, min, max) {
    const num = Number(value);
    return !isNaN(num) && num >= min && num <= max;
}

/**
 * Validate an array has at least one item
 * @param {Array} array - The array to validate
 * @return {Boolean} - True if the array has at least one item
 */
function validateNonEmptyArray(array) {
    return Array.isArray(array) && array.length > 0;
}

/**
 * Validate multiple fields
 * @param {Object} data - Object containing field values
 * @param {Object} rules - Object containing validation rules for each field
 * @return {Object} - Object with validation results {isValid, errors}
 */
function validateFields(data, rules) {
    const errors = {};
    let isValid = true;
    
    Object.keys(rules).forEach(field => {
        const fieldRules = rules[field];
        const value = data[field];
        
        // Apply each rule for this field
        for (const rule of fieldRules) {
            if (rule.type === 'required' && !validateRequired(value)) {
                errors[field] = rule.message || 'This field is required';
                isValid = false;
                break;
            } else if (rule.type === 'email' && !validateEmail(value)) {
                errors[field] = rule.message || 'Please enter a valid email address';
                isValid = false;
                break;
            } else if (rule.type === 'range' && !validateNumberRange(value, rule.min, rule.max)) {
                errors[field] = rule.message || `Value must be between ${rule.min} and ${rule.max}`;
                isValid = false;
                break;
            } else if (rule.type === 'custom' && typeof rule.validator === 'function') {
                if (!rule.validator(value, data)) {
                    errors[field] = rule.message || 'Invalid value';
                    isValid = false;
                    break;
                }
            }
        }
    });
    
    return {
        isValid,
        errors
    };
}

// Export using ES6 module syntax
export {
    validateEmail,
    validateRequired,
    validateNumberRange,
    validateNonEmptyArray,
    validateFields
};

console.log('[ValidationUtils] Validation utility functions exported as ES6 modules');
