/**
 * Config Loader - Core Module
 * 
 * Responsible for loading and managing configuration files for different assessment types.
 * Supports dynamic loading of configurations at runtime.
 */

class ConfigLoader {
  /**
   * Create a config loader instance
   * @param {Object} options - Config loader options
   * @param {Object} options.paths - Configuration file paths
   * @param {Object} options.eventBus - Event bus for notifications
   */
  constructor(options = {}) {
    // Configuration cache
    this.configCache = {};
    
    // Default config paths
    this.paths = options.paths || {
      assessmentTypes: 'assets/js/config/assessment-types.js',
      agency: 'assets/js/components/agency/config/agency-assessment-config.js',
      inhouse: 'assets/js/config/inhouse-assessment-config.js',
      agencyRecommendations: 'assets/js/components/agency/config/agency-recommendations-config.js',
      agencyScoring: 'assets/js/components/agency/scoring.js'
    };
    
    // Event bus for notifications
    this.eventBus = options.eventBus;
    
    // Track loaded configs
    this.loadedConfigs = new Set();
    
    console.log('[ConfigLoader] Initialized with paths:', this.paths);
  }
  
  /**
   * Load assessment types configuration
   * @returns {Promise<Object>} - Assessment types configuration
   */
  async loadAssessmentTypes() {
    // Check cache first
    if (this.configCache.assessmentTypes) {
      return this.configCache.assessmentTypes;
    }
    
    try {
      // Check if already available in global namespace
      if (window.AssessmentTypesConfig) {
        this.configCache.assessmentTypes = window.AssessmentTypesConfig;
        return window.AssessmentTypesConfig;
      }
      
      // Load dynamically if needed
      await this._loadScript(this.paths.assessmentTypes);
      
      // Store in cache
      if (window.AssessmentTypesConfig) {
        this.configCache.assessmentTypes = window.AssessmentTypesConfig;
        return window.AssessmentTypesConfig;
      }
      
      throw new Error('Assessment types configuration not found after loading script');
    } catch (error) {
      console.error('[ConfigLoader] Error loading assessment types:', error);
      
      // Return fallback config
      return this._getFallbackAssessmentTypes();
    }
  }
  
  /**
   * Load configuration for a specific assessment type
   * @param {string} type - Assessment type ('agency' or 'inhouse')
   * @returns {Promise<Object>} - Assessment configuration
   */
  async loadConfig(type) {
    // Validate type
    if (type !== 'agency' && type !== 'inhouse') {
      throw new Error(`Invalid assessment type: ${type}`);
    }
    
    // Check cache first
    if (this.configCache[type]) {
      return this.configCache[type];
    }
    
    try {
      // Check if already available in global namespace
      const globalConfigVar = type === 'agency' ? 
        (window.AgencyAssessmentConfig || window.ComprehensiveAgencyAssessmentConfig) : 
        window.InhouseAssessmentConfig;
      
      if (globalConfigVar) {
        this.configCache[type] = globalConfigVar;
        this.loadedConfigs.add(type);
        
        // If agency type, also load the scoring system and recommendations
        if (type === 'agency') {
          await this.loadAgencyScoring();
          await this.loadAgencyRecommendations();
        }
        
        return globalConfigVar;
      }
      
      // Load dynamically if needed
      await this._loadScript(this.paths[type]);
      
      // Recheck global namespace after loading
      const loadedConfig = type === 'agency' ? 
        (window.AgencyAssessmentConfig || window.ComprehensiveAgencyAssessmentConfig) : 
        window.InhouseAssessmentConfig;
      
      if (loadedConfig) {
        this.configCache[type] = loadedConfig;
        this.loadedConfigs.add(type);
        
        // If agency type, also load the scoring system and recommendations
        if (type === 'agency') {
          await this.loadAgencyScoring();
          await this.loadAgencyRecommendations();
        }
        
        // Notify about config loaded
        if (this.eventBus) {
          this.eventBus.emit('config:loaded', { type, config: loadedConfig });
        }
        
        return loadedConfig;
      }
      
      throw new Error(`${type} configuration not found after loading script`);
    } catch (error) {
      console.error(`[ConfigLoader] Error loading ${type} configuration:`, error);
      
      // Load fallback config
      const fallbackConfig = this._getFallbackConfig(type);
      this.configCache[type] = fallbackConfig;
      
      // Notify about fallback config
      if (this.eventBus) {
        this.eventBus.emit('config:fallback', { type, config: fallbackConfig });
      }
      
      return fallbackConfig;
    }
  }
  
  /**
   * Preload all configurations
   * @returns {Promise<Object>} - Object with all loaded configs
   */
  async preloadAllConfigs() {
    try {
      // Load assessment types first
      await this.loadAssessmentTypes();
      
      // Load all assessment configs
      const agencyConfig = await this.loadConfig('agency');
      const inhouseConfig = await this.loadConfig('inhouse');
      
      return {
        assessmentTypes: this.configCache.assessmentTypes,
        agency: agencyConfig,
        inhouse: inhouseConfig
      };
    } catch (error) {
      console.error('[ConfigLoader] Error preloading configurations:', error);
      throw error;
    }
  }
  
  /**
   * Load agency scoring system
   * @returns {Promise<Object>} - Scoring system configuration
   */
  async loadAgencyScoring() {
    // Check cache first
    if (this.configCache.agencyScoring) {
      return this.configCache.agencyScoring;
    }
    
    try {
      // Check if already available in global namespace
      if (window.EnhancedWeightedScoring) {
        this.configCache.agencyScoring = window.EnhancedWeightedScoring;
        return window.EnhancedWeightedScoring;
      }
      
      // Load dynamically if needed
      await this._loadScript(this.paths.agencyScoring);
      
      // Recheck global namespace after loading
      if (window.EnhancedWeightedScoring) {
        this.configCache.agencyScoring = window.EnhancedWeightedScoring;
        
        // Notify about config loaded
        if (this.eventBus) {
          this.eventBus.emit('config:loaded', { type: 'agencyScoring', config: window.EnhancedWeightedScoring });
        }
        
        return window.EnhancedWeightedScoring;
      }
      
      throw new Error('Agency scoring system not found after loading script');
    } catch (error) {
      console.error('[ConfigLoader] Error loading agency scoring system:', error);
      return null;
    }
  }
  
  /**
   * Load agency recommendations configuration
   * @returns {Promise<Object>} - Recommendations configuration
   */
  async loadAgencyRecommendations() {
    // Check cache first
    if (this.configCache.agencyRecommendations) {
      return this.configCache.agencyRecommendations;
    }
    
    try {
      // Check if already available in global namespace
      if (window.ServiceRecommendations) {
        this.configCache.agencyRecommendations = window.ServiceRecommendations;
        return window.ServiceRecommendations;
      }
      
      // Load dynamically if needed
      await this._loadScript(this.paths.agencyRecommendations);
      
      // Recheck global namespace after loading
      if (window.ServiceRecommendations) {
        this.configCache.agencyRecommendations = window.ServiceRecommendations;
        
        // Notify about config loaded
        if (this.eventBus) {
          this.eventBus.emit('config:loaded', { type: 'agencyRecommendations', config: window.ServiceRecommendations });
        }
        
        return window.ServiceRecommendations;
      }
      
      throw new Error('Agency recommendations configuration not found after loading script');
    } catch (error) {
      console.error('[ConfigLoader] Error loading agency recommendations configuration:', error);
      return null;
    }
  }
  
  /**
   * Load additional configuration for a specific service/area
   * @param {string} assessmentType - Assessment type ('agency' or 'inhouse')
   * @param {string} serviceType - Service or area type
   * @returns {Promise<Object>} - Service/area configuration
   */
  async loadServiceConfig(assessmentType, serviceType) {
    const configKey = `${assessmentType}_${serviceType}`;
    
    // Check cache first
    if (this.configCache[configKey]) {
      return this.configCache[configKey];
    }
    
    try {
      // Determine the path
      const path = `assets/js/config/${assessmentType}-${serviceType}-config.js`;
      
      // Load script
      await this._loadScript(path);
      
      // Check global namespace based on naming convention
      const globalVarName = this._getServiceConfigVarName(assessmentType, serviceType);
      const config = window[globalVarName];
      
      if (config) {
        this.configCache[configKey] = config;
        return config;
      }
      
      throw new Error(`Service configuration not found for ${assessmentType}/${serviceType}`);
    } catch (error) {
      console.error(`[ConfigLoader] Error loading ${assessmentType}/${serviceType} configuration:`, error);
      return null;
    }
  }
  
  /**
   * Get service config variable name based on convention
   * @param {string} assessmentType - Assessment type
   * @param {string} serviceType - Service type
   * @returns {string} - Expected global variable name
   * @private
   */
  _getServiceConfigVarName(assessmentType, serviceType) {
    // Convert to camel case
    const camelCaseService = serviceType.replace(/-([a-z])/g, g => g[1].toUpperCase());
    
    // Capitalize first letter of assessment type
    const capitalizedType = assessmentType.charAt(0).toUpperCase() + assessmentType.slice(1);
    
    // Combine using naming convention
    return `${capitalizedType}${camelCaseService.charAt(0).toUpperCase() + camelCaseService.slice(1)}Config`;
  }
  
  /**
   * Check if a configuration is loaded
   * @param {string} type - Configuration type
   * @returns {boolean} - Whether the configuration is loaded
   */
  isConfigLoaded(type) {
    return this.loadedConfigs.has(type) || !!this.configCache[type];
  }
  
  /**
   * Dynamically load a script
   * @param {string} path - Path to script
   * @returns {Promise} - Promise that resolves when script is loaded
   * @private
   */
  _loadScript(path) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = path;
      script.async = true;
      
      script.onload = () => {
        console.log(`[ConfigLoader] Script loaded: ${path}`);
        resolve();
      };
      
      script.onerror = () => {
        reject(new Error(`Failed to load script: ${path}`));
      };
      
      document.head.appendChild(script);
    });
  }
  
  /**
   * Get fallback assessment types configuration
   * @returns {Object} - Fallback configuration
   * @private
   */
  _getFallbackAssessmentTypes() {
    return {
      types: [
        {
          id: 'agency',
          name: 'Agency Assessment',
          description: 'Assessment for marketing and creative agencies',
          icon: 'building'
        },
        {
          id: 'inhouse',
          name: 'In-house Team Assessment',
          description: 'Assessment for in-house marketing teams',
          icon: 'users'
        }
      ],
      defaultType: 'agency'
    };
  }
  
  /**
   * Get fallback configuration for a specific assessment type
   * @param {string} type - Assessment type
   * @returns {Object} - Fallback configuration
   * @private
   */
  _getFallbackConfig(type) {
    if (type === 'agency') {
      return {
        id: 'agency-assessment',
        title: 'Agency AI Vulnerability Assessment',
        description: 'This assessment tool evaluates how ready your agency is for AI.',
        assessmentType: 'agency',
        steps: ['agency-type', 'services', 'questions', 'email', 'results'],
        agencyTypes: [
          { id: 'creative', name: 'Creative Agency', description: 'Focuses on design, branding, and content creation' },
          { id: 'digital', name: 'Digital Agency', description: 'Offers comprehensive digital services' }
        ],
        services: [
          { name: 'Creative Services', id: 'creative' },
          { name: 'Digital Marketing', id: 'digital' }
        ],
        questions: {
          core: [
            {
              id: 1,
              dimension: 'operational',
              question: 'How would you rate your agency\'s operational processes?',
              options: [
                { text: 'Poor', score: 1 },
                { text: 'Fair', score: 2 },
                { text: 'Good', score: 3 },
                { text: 'Very Good', score: 4 },
                { text: 'Excellent', score: 5 }
              ]
            }
          ]
        }
      };
    } else if (type === 'inhouse') {
      return {
        id: 'inhouse-assessment',
        title: 'In-house Team AI Readiness Assessment',
        description: 'This assessment tool evaluates how ready your in-house team is for AI.',
        assessmentType: 'inhouse',
        steps: ['department', 'areas', 'questions', 'email', 'results'],
        departments: [
          { id: 'marketing', name: 'Marketing Department', description: 'In-house marketing team' },
          { id: 'creative', name: 'Creative Department', description: 'In-house creative and design team' }
        ],
        areas: [
          { name: 'Content Creation', id: 'content' },
          { name: 'Campaign Management', id: 'campaigns' }
        ],
        questions: {
          core: [
            {
              id: 1,
              dimension: 'operational',
              question: 'How would you rate your team\'s operational processes?',
              options: [
                { text: 'Poor', score: 1 },
                { text: 'Fair', score: 2 },
                { text: 'Good', score: 3 },
                { text: 'Very Good', score: 4 },
                { text: 'Excellent', score: 5 }
              ]
            }
          ]
        }
      };
    }
    
    // Default fallback
    return {
      id: 'default-assessment',
      title: 'Default Assessment',
      description: 'Default assessment configuration',
      steps: ['questions', 'results'],
      questions: { core: [] }
    };
  }
}

// Register in global namespace
window.AssessmentFramework = window.AssessmentFramework || {};
window.AssessmentFramework.Core = window.AssessmentFramework.Core || {};
window.AssessmentFramework.Core.ConfigLoader = ConfigLoader;
