/**
 * Assessment Configuration Loader
 * 
 * This module handles loading and merging modular configuration files for the assessment framework.
 * It provides a unified interface for accessing configuration data regardless of its source.
 */

class ConfigLoader {
  /**
   * Initialize the configuration loader
   */
  constructor() {
    // Main configuration storage
    this.config = null;
    
    // Recommendations configuration storage
    this.recommendations = null;
    
    // Track loading status
    this.isLoaded = false;
    this.loadErrors = [];
  }
  
  /**
   * Load assessment configuration from global variables
   * @returns {boolean} - Loading success status
   */
  loadFromGlobals() {
    try {
      console.log('[ConfigLoader] Loading configuration from global variables');
      
      // Check for main assessment config
      if (typeof ComprehensiveAgencyAssessmentConfig !== 'undefined') {
        this.config = ComprehensiveAgencyAssessmentConfig;
        console.log('[ConfigLoader] Main config loaded successfully');
      } else {
        this.loadErrors.push('Main assessment configuration not found');
        console.error('[ConfigLoader] Main assessment configuration not found');
        return false;
      }
      
      // Check for recommendations config
      if (typeof ServiceRecommendations !== 'undefined') {
        this.recommendations = ServiceRecommendations;
        console.log('[ConfigLoader] Recommendations config loaded successfully');
      } else {
        this.loadErrors.push('Service recommendations configuration not found');
        console.warn('[ConfigLoader] Service recommendations configuration not found');
        // Continue without recommendations
      }
      
      // Validate and prepare the config
      this._prepareConfig();
      
      this.isLoaded = true;
      return true;
    } catch (error) {
      this.loadErrors.push(`Error loading configuration: ${error.message}`);
      console.error('[ConfigLoader] Error loading configuration:', error);
      return false;
    }
  }
  
  /**
   * Prepare the configuration by ensuring all required properties exist
   * @private
   */
  _prepareConfig() {
    // Ensure we have a recommendations config section
    if (!this.config.recommendationsConfig) {
      console.warn('[ConfigLoader] No recommendationsConfig found, creating default');
      this.config.recommendationsConfig = {
        enabled: true,
        useServiceSpecific: true,
        useGeneralRecommendations: true,
        scoringThresholds: {
          low: { min: 0, max: 40 },
          mid: { min: 40, max: 70 },
          high: { min: 70, max: 100 }
        }
      };
    }
    
    // Ensure service has recommendationsAvailable property
    if (this.config.services) {
      this.config.services.forEach(service => {
        if (service.recommendationsAvailable === undefined) {
          console.log(`[ConfigLoader] Adding recommendationsAvailable for service ${service.id}`);
          // Check if we have recommendations for this service
          service.recommendationsAvailable = !!(this.recommendations && 
                                              this.recommendations.services && 
                                              this.recommendations.services[service.id]);
        }
      });
    }
  }
  
  /**
   * Get the complete merged configuration
   * @returns {Object} - Complete configuration object
   */
  getConfig() {
    if (!this.isLoaded) {
      this.loadFromGlobals();
    }
    
    // Create a copy of the config to avoid modification
    const configCopy = JSON.parse(JSON.stringify(this.config));
    
    // Add recommendations if available
    if (this.recommendations) {
      configCopy.serviceRecommendations = this.recommendations;
    }
    
    return configCopy;
  }
  
  /**
   * Get service-specific recommendations for a service
   * @param {string} serviceId - Service identifier
   * @param {string} scoreCategory - Score category (lowScore, midScore, highScore)
   * @returns {Object|null} - Service recommendations or null if not found
   */
  getServiceRecommendations(serviceId, scoreCategory = 'midScore') {
    if (!this.isLoaded) {
      this.loadFromGlobals();
    }
    
    if (!this.recommendations || !this.recommendations.services) {
      return null;
    }
    
    const serviceRecs = this.recommendations.services[serviceId];
    if (!serviceRecs) {
      return null;
    }
    
    return serviceRecs[scoreCategory] || null;
  }
  
  /**
   * Check if the configuration has been successfully loaded
   * @returns {boolean} - Loading status
   */
  isConfigLoaded() {
    return this.isLoaded;
  }
  
  /**
   * Get any errors that occurred during loading
   * @returns {Array} - Array of error messages
   */
  getLoadErrors() {
    return this.loadErrors;
  }
}

// Create global instance
window.assessmentConfigLoader = new ConfigLoader();
