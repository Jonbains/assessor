/**
 * Agency Recommendations Engine
 * 
 * Generates service-specific and overall recommendations based on assessment scores
 * Leverages the service-recommendations.js configuration for detailed recommendation content
 */

// ServiceRecommendations will be accessed as a browser global

class AgencyRecommendationsEngine {
  /**
   * @param {Object} config - Assessment configuration
   */
  constructor(config = {}) {
    this.config = config;
    this.recommendations = ServiceRecommendations;
  }

  /**
   * Generate recommendations based on assessment data
   * @param {Object} assessmentData - Complete assessment data including scores and services
   * @returns {Object} Categorized recommendations
   */
  generateRecommendations(assessmentData) {
    try {
      const { scores, services = [], revenue = 0 } = assessmentData;
      
      if (!scores || !services.length) {
        console.warn('[RecommendationsEngine] Missing required assessment data');
        return {
          serviceRecommendations: [],
          operationalRecommendations: [],
          financialRecommendations: []
        };
      }

      return {
        serviceRecommendations: this.generateServiceRecommendations(services, scores),
        operationalRecommendations: this.generateOperationalRecommendations(scores, revenue),
        financialRecommendations: this.generateFinancialRecommendations(scores, revenue)
      };
    } catch (error) {
      console.error('[RecommendationsEngine] Error generating recommendations:', error);
      return {
        serviceRecommendations: [],
        operationalRecommendations: [],
        financialRecommendations: [],
        error: error.message
      };
    }
  }

  /**
   * Generate service-specific recommendations
   * @param {Array} services - Selected services
   * @param {Object} scores - Assessment scores
   * @returns {Array} Service recommendations
   */
  generateServiceRecommendations(services, scores) {
    const recommendations = [];
    
    // Process each selected service
    services.forEach(service => {
      const serviceId = typeof service === 'object' ? service.id : service;
      const serviceConfig = this.recommendations.services[serviceId];
      
      if (serviceConfig) {
        // Get service score or use overall AI score as fallback
        const serviceScore = scores.services?.[serviceId]?.ai || scores.dimensions?.ai || 50;
        
        // Determine score category (low, mid, high)
        let scoreCategory = 'lowScore';
        if (serviceScore > 70) {
          scoreCategory = 'highScore';
        } else if (serviceScore > 40) {
          scoreCategory = 'midScore';
        }
        
        // Get recommendations for the score category
        const categoryRecommendations = serviceConfig[scoreCategory] || {};
        
        // Add immediate, short-term, and strategic recommendations
        ['immediate', 'shortTerm', 'strategic'].forEach(timeframe => {
          const timeframeRecs = categoryRecommendations[timeframe] || [];
          
          // Add each recommendation with metadata
          timeframeRecs.forEach(rec => {
            recommendations.push({
              service: serviceId,
              serviceName: serviceConfig.serviceName,
              timeframe,
              riskLevel: serviceConfig.riskLevel,
              disruptionTimeline: serviceConfig.disruptionTimeline,
              ...rec
            });
          });
        });
      }
    });
    
    return recommendations;
  }

  /**
   * Generate operational recommendations
   * @param {Object} scores - Assessment scores 
   * @param {number} revenue - Agency revenue
   * @returns {Array} Operational recommendations
   */
  generateOperationalRecommendations(scores, revenue) {
    // Get universal operational recommendations
    const universalRecs = this.recommendations.universal?.operational?.allAgencies || [];
    
    // Filter and prioritize based on scores
    return universalRecs.map(rec => {
      // Calculate relevance score based on assessment results
      let relevanceScore = 100;
      
      if (scores.dimensions?.operational > 70) {
        // Reduce relevance of basic recommendations for high-scoring agencies
        if (rec.complexity === 'low') {
          relevanceScore = 60;
        }
      } else if (scores.dimensions?.operational < 40) {
        // Increase relevance of simpler recommendations for low-scoring agencies
        if (rec.complexity === 'high') {
          relevanceScore = 70;
        }
      }
      
      return {
        ...rec,
        category: 'operational',
        relevanceScore
      };
    }).sort((a, b) => {
      // Sort by importance first, then relevance score
      const importanceOrder = { critical: 3, high: 2, medium: 1, low: 0 };
      const importanceDiff = importanceOrder[b.importance] - importanceOrder[a.importance];
      
      if (importanceDiff !== 0) {
        return importanceDiff;
      }
      
      return b.relevanceScore - a.relevanceScore;
    });
  }

  /**
   * Generate financial recommendations
   * @param {Object} scores - Assessment scores
   * @param {number} revenue - Agency revenue
   * @returns {Array} Financial recommendations
   */
  generateFinancialRecommendations(scores, revenue) {
    // Get universal financial recommendations
    const universalRecs = this.recommendations.universal?.financial?.allAgencies || [];
    
    // Filter and customize based on agency revenue and scores
    return universalRecs.map(rec => {
      let customizedRec = { ...rec, category: 'financial' };
      
      // Customize based on revenue size
      if (revenue < 1000000) {
        customizedRec.note = 'Consider scaled-down implementation appropriate for your revenue level';
      } else if (revenue > 10000000) {
        customizedRec.note = 'With your revenue level, consider a more comprehensive implementation';
      }
      
      return customizedRec;
    }).sort((a, b) => {
      // Sort by importance
      const importanceOrder = { critical: 3, high: 2, medium: 1, low: 0 };
      return importanceOrder[b.importance] - importanceOrder[a.importance];
    });
  }
}

// Make the class available as a browser global
window.AgencyRecommendationsEngine = AgencyRecommendationsEngine;
