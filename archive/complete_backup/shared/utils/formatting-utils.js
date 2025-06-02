/**
 * Assessment Framework - Formatting Utilities
 * 
 * Provides utility functions for formatting data for display
 */

/**
 * Format a number with commas for thousands separators
 * @param {Number} num - The number to format
 * @return {String} - The formatted number
 */
function formatNumber(num) {
    if (typeof num === 'undefined' || num === null) return '0';
    
    return num.toLocaleString('en-US');
}

/**
 * Format a currency value for display
 * @param {Number} value - The value to format
 * @param {String} currencySymbol - The currency symbol to use (default: $)
 * @return {String} - The formatted currency string
 */
function formatCurrency(value, currencySymbol = '$') {
    if (value === undefined || value === null) {
        return `${currencySymbol}0`;
    }
    
    // Convert to number if it's a string
    const amount = typeof value === 'string' ? parseFloat(value) : value;
    
    // Format with currency symbol and commas
    return `${currencySymbol}${amount.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })}`;
}

/**
 * Format a percentage value for display
 * @param {Number} value - The value to format (0-100)
 * @param {Boolean} includeSymbol - Whether to include the % symbol (default: true)
 * @return {String} - The formatted percentage string
 */
function formatPercentage(value, includeSymbol = true) {
    if (value === undefined || value === null) {
        return includeSymbol ? '0%' : '0';
    }
    
    // Convert to number if it's a string
    const percent = typeof value === 'string' ? parseFloat(value) : value;
    
    // Format with or without % symbol
    const formattedValue = percent.toFixed(1).replace(/\.0$/, ''); // Remove trailing .0
    return includeSymbol ? `${formattedValue}%` : formattedValue;
}

/**
 * Format a dimension name for display
 * @param {String} dimension - The dimension ID
 * @param {Object} dimensions - Dimensions configuration data
 * @return {String} - The formatted dimension name
 */
function formatDimensionName(dimension, dimensions) {
    if (!dimension) return '';
    
    // Check if dimension is in config
    if (dimensions) {
        for (let i = 0; i < dimensions.length; i++) {
            if (dimensions[i].id === dimension) {
                return dimensions[i].name;
            }
        }
    }
    
    // Default formatting
    return dimension.charAt(0).toUpperCase() + dimension.slice(1).replace(/_/g, ' ');
}

/**
 * Generate a unique ID
 * @param {String} prefix - Optional prefix for the ID
 * @return {String} - The unique ID
 */
function generateUniqueId(prefix = '') {
    return prefix + Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
}

/**
 * Format a date for display
 * @param {Date|String|Number} date - The date to format
 * @param {String} format - The format to use (default: simple)
 * @return {String} - The formatted date
 */
function formatDate(date, format = 'simple') {
    const dateObj = date instanceof Date ? date : new Date(date);
    
    if (isNaN(dateObj.getTime())) {
        return 'Invalid Date';
    }
    
    switch (format) {
        case 'full':
            return dateObj.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        case 'short':
            return dateObj.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        case 'time':
            return dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });
        case 'datetime':
            return `${dateObj.toLocaleDateString()} ${dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })}`;
        case 'simple':
        default:
            return dateObj.toLocaleDateString();
    }
}

// Export using ES6 module syntax
export {
    formatNumber,
    formatCurrency,
    formatPercentage,
    formatDimensionName,
    generateUniqueId,
    formatDate
};

console.log('[FormattingUtils] Formatting utility functions exported as ES6 modules');
