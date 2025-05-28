/**
 * Enhanced Weighted Scoring System for Agency Assessment
 * Adapted from the original implementation for WordPress integration
 */

class EnhancedWeightedScoring {
  /**
   * Create an enhanced scoring system instance
   * @param {Object} config - Assessment configuration with weighted questions
   * @param {string} assessmentType - Type of assessment ('agency', 'inhouse', etc.)
   */
  constructor(config, assessmentType = 'agency') {
    this.config = config;
    this.assessmentType = assessmentType;
    
    // Enhanced scoring modules with weighted calculations
    this.scoringModules = {
      // Default weighted scoring module
      default: {
        calculateDimensionScore: this.weightedCalculateDimensionScore.bind(this),
        calculateServiceScores: this.weightedCalculateServiceScores.bind(this),
        calculateOverallScore: this.weightedCalculateOverallScore.bind(this),
        determineScoreCategory: this.enhancedDetermineScoreCategory.bind(this)
      },
      
      // Agency-specific weighted scoring
      agency: {
        calculateDimensionScore: this.weightedCalculateDimensionScore.bind(this),
        calculateServiceScores: this.agencyWeightedCalculateServiceScores.bind(this),
        calculateOverallScore: this.agencyWeightedCalculateOverallScore.bind(this),
        determineScoreCategory: this.enhancedDetermineScoreCategory.bind(this)
      }
    };
  }
  
  /**
   * Calculate assessment results
   * @param {Object} assessmentData - Assessment data from framework
   * @param {string} agencyType - Selected agency type ID
   * @returns {Object} - Calculated results
   */
  calculateResults(assessmentData, agencyType) {
    const selectedServices = assessmentData.selectedServices || [];
    const answers = assessmentData.answers || {};
    const selectedAgencyType = agencyType;
    
    try {
      console.log('[EnhancedWeightedScoring] Calculating weighted results for type:', this.assessmentType);
      
      // Use appropriate scoring module
      const scoringModule = this.scoringModules[this.assessmentType] || this.scoringModules.default;
      
      // Use data from assessmentData parameter
      const revenue = assessmentData.revenue || 0;
      // Store selected agency type for recommendation generation
      this.selectedAgencyType = selectedAgencyType;
      
      // Get questions by dimension with proper structure handling
      const { operationalQuestions, financialQuestions, aiQuestions, strategicQuestions } = this.extractQuestionsByDimension();
      
      // Calculate individual dimension scores first
      const operationalScore = scoringModule.calculateDimensionScore(answers, operationalQuestions, 'operational');
      const financialScore = scoringModule.calculateDimensionScore(answers, financialQuestions, 'financial');
      const aiScore = scoringModule.calculateDimensionScore(answers, aiQuestions, 'ai');
      
      // Calculate strategic score - either from strategic questions or derived from other dimensions
      let strategicScore;
      if (strategicQuestions && strategicQuestions.length > 0) {
        strategicScore = scoringModule.calculateDimensionScore(answers, strategicQuestions, 'strategic');
      } else {
        // When no strategic questions exist, calculate from weighted combination of other dimensions
        strategicScore = Math.round((operationalScore * 0.3) + (financialScore * 0.3) + (aiScore * 0.4));
      }
      
      // Combine all scores into dimensionScores object
      const dimensionScores = {
        operational: operationalScore,
        financial: financialScore,
        ai: aiScore,
        strategic: strategicScore
      };
      
      console.log('[EnhancedWeightedScoring] Weighted dimension scores:', dimensionScores);
      
      // Calculate service-specific scores with enhanced weighting
      const serviceScoresResult = scoringModule.calculateServiceScores(
        answers,
        selectedServices,
        this.config.questions && this.config.questions.serviceSpecific ? this.config.questions.serviceSpecific : {},
        this.config.disruption || []
      );
      
      // Calculate revenue-weighted service vulnerability (simplified)
      const serviceVulnerabilityScore = this.calculateRevenueWeightedVulnerability(
        serviceScoresResult,
        revenue
      );
      
      // Calculate service adaptability score (simplified)
      const serviceAdaptabilityScore = this.calculateServiceAdaptabilityScore(
        serviceScoresResult,
        revenue
      );
      
      // Calculate adjusted AI score using enhanced formula
      const adjustedAiScore = this.calculateAdjustedAiScore(
        dimensionScores.ai,
        serviceVulnerabilityScore,
        serviceAdaptabilityScore
      );
      
      // Calculate overall score using weighted methodology
      const overallScore = scoringModule.calculateOverallScore(
        dimensionScores,
        serviceScoresResult,
        serviceVulnerabilityScore,
        adjustedAiScore
      );
      
      // Determine score category
      const scoreCategory = scoringModule.determineScoreCategory(overallScore, dimensionScores);
      
      // Generate recommendations based on scores
      const recommendations = this.generateRecommendations(
        overallScore,
        dimensionScores,
        serviceScoresResult,
        serviceVulnerabilityScore,
        selectedServices,
        selectedAgencyType
      );
      
      // Generate key insights
      const insights = this.generateKeyInsights(
        dimensionScores,
        serviceScoresResult,
        serviceVulnerabilityScore,
        adjustedAiScore,
        selectedServices
      );
      
      // Generate action plan
      const actionPlan = this.generateActionPlan(overallScore, scoreCategory);
      
      // Prepare final results
      return {
        scores: {
          overall: Math.round(overallScore),
          operational: Math.round(dimensionScores.operational),
          financial: Math.round(dimensionScores.financial),
          ai: Math.round(dimensionScores.ai),
          strategic: Math.round(dimensionScores.strategic || 0),
          serviceVulnerability: Math.round(serviceVulnerabilityScore),
          serviceAdaptability: Math.round(serviceAdaptabilityScore),
          adjustedAi: Math.round(adjustedAiScore)
        },
        serviceScores: serviceScoresResult,
        vulnerabilityLevel: scoreCategory,
        recommendations: recommendations,
        insights: insights,
        actionPlan: actionPlan,
        selectedAgencyType: selectedAgencyType,
        selectedServices: selectedServices
      };
    } catch (error) {
      console.error('[EnhancedWeightedScoring] Error calculating results:', error);
      return this.getFallbackResults(state);
    }
  }
  
  /**
   * Extract questions by dimension, handling different config structures
   * @returns {Object} - Questions organized by dimension
   */
  extractQuestionsByDimension() {
    const operationalQuestions = [];
    const financialQuestions = [];
    const aiQuestions = [];
    const strategicQuestions = [];
    
    // Process core questions
    if (this.config.questions && this.config.questions.core) {
      this.config.questions.core.forEach(question => {
        if (question.dimension === 'operational') {
          operationalQuestions.push(question);
        } else if (question.dimension === 'financial') {
          financialQuestions.push(question);
        } else if (question.dimension === 'ai') {
          aiQuestions.push(question);
        } else if (question.dimension === 'strategic') {
          strategicQuestions.push(question);
        }
      });
    }
    
    return { operationalQuestions, financialQuestions, aiQuestions, strategicQuestions };
  }
  
  /**
   * Calculate dimension score using weighted methodology
   * @param {Object} answers - User's answers
   * @param {Array} questions - Questions for this dimension
   * @param {string} dimension - Dimension name
   * @returns {number} - Weighted dimension score (0-100)
   */
  weightedCalculateDimensionScore(answers, questions, dimension) {
    if (!questions || questions.length === 0) {
      return 0;
    }
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        const weight = question.weight || 1;
        const score = answer; // Assuming answer is already a score (0-5)
        
        // Convert to percentage (0-100)
        const normalizedScore = (score / 5) * 100;
        
        totalWeightedScore += normalizedScore * weight;
        totalWeight += weight;
      }
    });
    
    // Return weighted average
    return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
  }
  
  /**
   * Calculate service scores with enhanced weighting and disruption analysis
   * @param {Object} answers - User's answers
   * @param {Array} selectedServices - Services selected by user
   * @param {Object} serviceQuestions - Service-specific questions
   * @param {Array} disruptionData - Service disruption data
   * @returns {Object} - Enhanced service scores
   */
  weightedCalculateServiceScores(answers, selectedServices, serviceQuestions, disruptionData) {
    const serviceScores = {};
    
    if (!selectedServices || !serviceQuestions) {
      return serviceScores;
    }
    
    selectedServices.forEach(serviceId => {
      // Skip if no questions for this service
      if (!serviceQuestions[serviceId]) {
        serviceScores[serviceId] = {
          score: 50, // Default score
          vulnerability: 50,
          opportunity: 50,
          adaptability: 50
        };
        return;
      }
      
      // Calculate service score
      let totalScore = 0;
      let answeredQuestions = 0;
      
      serviceQuestions[serviceId].forEach(question => {
        const answer = answers[question.id];
        if (answer !== undefined) {
          totalScore += answer; // Assuming answer is already a score (0-5)
          answeredQuestions++;
        }
      });
      
      // Calculate average score and convert to percentage
      const avgScore = answeredQuestions > 0 ? (totalScore / answeredQuestions) * 20 : 50;
      
      // Get disruption data for this service
      const disruption = disruptionData ? disruptionData.find(d => d.serviceId === serviceId) : null;
      
      // Calculate vulnerability and opportunity scores
      const vulnerability = disruption ? disruption.vulnerability || 50 : 50;
      const opportunity = disruption ? disruption.opportunity || 50 : 50;
      
      // Calculate adaptability (inverse of vulnerability adjusted by service score)
      const adaptability = 100 - ((vulnerability * 0.7) + ((100 - avgScore) * 0.3));
      
      serviceScores[serviceId] = {
        score: Math.round(avgScore),
        vulnerability: Math.round(vulnerability),
        opportunity: Math.round(opportunity),
        adaptability: Math.round(adaptability)
      };
    });
    
    return serviceScores;
  }
  
  /**
   * Agency-specific weighted service score calculation
   * @param {Object} answers - User's answers
   * @param {Array} selectedServices - Services selected by user
   * @param {Object} serviceQuestions - Service-specific questions
   * @param {Array} disruptionData - Service disruption data
   * @returns {Object} - Agency-specific service scores
   */
  agencyWeightedCalculateServiceScores(answers, selectedServices, serviceQuestions, disruptionData) {
    // Use base implementation for now
    return this.weightedCalculateServiceScores(answers, selectedServices, serviceQuestions, disruptionData);
  }
  
  /**
   * Calculate revenue-weighted service vulnerability
   * @param {Object} serviceScores - Service scores object
   * @param {Object} serviceRevenue - Revenue allocation by service
   * @returns {number} - Weighted vulnerability score (0-100)
   */
  calculateRevenueWeightedVulnerability(serviceScores, serviceRevenue) {
    let totalVulnerability = 0;
    let totalRevenue = 0;
    
    // If no service scores or no revenue data, return default
    if (!serviceScores || Object.keys(serviceScores).length === 0) {
      return 50; // Default score
    }
    
    // Default weight if no revenue data
    const defaultRevenue = serviceRevenue ? 0 : 1 / Object.keys(serviceScores).length;
    
    // Track high-risk services (vulnerability > 70) for emphasis
    const highRiskServices = [];
    
    Object.keys(serviceScores).forEach(serviceId => {
      const service = serviceScores[serviceId];
      const revenue = serviceRevenue ? (serviceRevenue[serviceId] || 0) : defaultRevenue;
      
      if (service && typeof service.vulnerability !== 'undefined') {
        // Apply progressive weighting to emphasize high-vulnerability services
        const emphasis = service.vulnerability > 70 ? 1.2 : 1.0;
        totalVulnerability += (service.vulnerability * revenue * emphasis);
        totalRevenue += (revenue * emphasis);
        
        // Track high-risk services
        if (service.vulnerability > 70 && revenue > 0.1) {
          highRiskServices.push({
            id: serviceId,
            vulnerability: service.vulnerability,
            revenue: revenue
          });
        }
      }
    });
    
    // Calculate the base score
    let vulnerabilityScore = totalRevenue > 0 ? totalVulnerability / totalRevenue : 50;
    
    // Add penalty for concentration risk (if >40% revenue in high-risk services)
    if (highRiskServices.length > 0) {
      const highRiskRevenue = highRiskServices.reduce((sum, service) => sum + service.revenue, 0);
      if (highRiskRevenue > 0.4) {
        // Apply concentration risk penalty
        vulnerabilityScore += (highRiskRevenue - 0.4) * 20;
      }
    }
    
    // Ensure score is within bounds
    return Math.max(0, Math.min(100, Math.round(vulnerabilityScore)));
  }
  
  /**
   * Calculate service adaptability score
   * @param {Object} serviceScores - Service scores object  
   * @param {Object} serviceRevenue - Revenue allocation by service
   * @returns {number} - Weighted adaptability score (0-100)
   */
  calculateServiceAdaptabilityScore(serviceScores, serviceRevenue) {
    let totalAdaptability = 0;
    let totalRevenue = 0;
    
    // If no service scores or no revenue data, return default
    if (!serviceScores || Object.keys(serviceScores).length === 0) {
      return 50; // Default score
    }
    
    // Default weight if no revenue data
    const defaultRevenue = serviceRevenue ? 0 : 1 / Object.keys(serviceScores).length;
    
    // Track highly adaptable services (adaptability > 70) for emphasis
    const highAdaptabilityServices = [];
    
    Object.keys(serviceScores).forEach(serviceId => {
      const service = serviceScores[serviceId];
      const revenue = serviceRevenue ? (serviceRevenue[serviceId] || 0) : defaultRevenue;
      
      if (service && typeof service.adaptability !== 'undefined') {
        // Apply progressive weighting to emphasize high-adaptability services
        const emphasis = service.adaptability > 70 ? 1.3 : 1.0;
        totalAdaptability += (service.adaptability * revenue * emphasis);
        totalRevenue += (revenue * emphasis);
        
        // Track high-adaptability services
        if (service.adaptability > 70 && revenue > 0.15) {
          highAdaptabilityServices.push({
            id: serviceId,
            adaptability: service.adaptability,
            revenue: revenue
          });
        }
      }
    });
    
    // Calculate the base score
    let adaptabilityScore = totalRevenue > 0 ? totalAdaptability / totalRevenue : 50;
    
    // Add bonus for strategic diversification into AI-resistant services
    if (highAdaptabilityServices.length > 0) {
      const highAdaptabilityRevenue = highAdaptabilityServices.reduce((sum, service) => sum + service.revenue, 0);
      if (highAdaptabilityRevenue > 0.3) {
        // Apply diversification bonus (up to +10 points)
        adaptabilityScore += Math.min(10, (highAdaptabilityRevenue - 0.3) * 25);
      }
    }
    
    // Ensure score is within bounds
    return Math.max(0, Math.min(100, Math.round(adaptabilityScore)));
  }
  
  /**
   * Calculate adjusted AI score using enhanced formula
   * @param {number} aiScore - Base AI dimension score
   * @param {number} serviceVulnerability - Service vulnerability score
   * @param {number} serviceAdaptability - Service adaptability score
   * @returns {number} - Adjusted AI score (0-100)
   */
  calculateAdjustedAiScore(aiScore, serviceVulnerability, serviceAdaptability) {
    // Base adjustment from AI readiness score
    const baseAdjustment = aiScore * 0.6;
    
    // Adaptability adjustment - rewards agencies that have more AI-resistant services
    const adaptabilityAdjustment = serviceAdaptability * 0.25;
    
    // Vulnerability adjustment - penalizes agencies with high vulnerability scores
    // Note: We invert vulnerability since higher vulnerability means lower score
    const vulnerabilityAdjustment = ((100 - serviceVulnerability) * 0.15);
    
    // Apply adaptive weighting based on vulnerability level
    // If vulnerability is very high (>75), increase its impact on overall score
    let finalScore;
    if (serviceVulnerability > 75) {
      // Increase vulnerability impact when it's very high
      finalScore = (baseAdjustment * 0.5) + (adaptabilityAdjustment * 0.2) + (vulnerabilityAdjustment * 0.3);
    } else {
      // Normal weighting for moderate vulnerability
      finalScore = baseAdjustment + adaptabilityAdjustment + vulnerabilityAdjustment;
    }
    
    // Ensure score is within bounds
    return Math.max(0, Math.min(100, Math.round(finalScore)));
  }
  
  /**
   * Calculate overall score using weighted methodology
   * @param {Object} dimensionScores - Scores for each dimension
   * @param {Object} serviceScores - Service-specific scores
   * @param {number} serviceVulnerability - Service vulnerability score
   * @param {number} adjustedAiScore - Adjusted AI score
   * @returns {number} - Overall weighted score (0-100)
   */
  weightedCalculateOverallScore(dimensionScores, serviceScores, serviceVulnerability, adjustedAiScore) {
    // Dimension weights - adjusted to give more weight to financial and AI readiness
    const weights = {
      operational: 0.20,
      financial: 0.30,
      ai: 0.40,
      strategic: 0.10
    };
    
    // Calculate weighted dimension score
    const weightedDimensionScore = 
      (dimensionScores.operational * weights.operational) +
      (dimensionScores.financial * weights.financial) +
      (adjustedAiScore * weights.ai) +
      ((dimensionScores.strategic || 0) * weights.strategic);
    
    // Get vulnerability penalty based on concentration risk
    // Higher penalty for high vulnerability services with high revenue allocation
    let vulnerabilityImpact = 0.2;
    if (serviceVulnerability > 75) {
      vulnerabilityImpact = 0.3; // Increased penalty for very high vulnerability
    } else if (serviceVulnerability < 40) {
      vulnerabilityImpact = 0.1; // Reduced penalty for low vulnerability
    }
    
    // Calculate vulnerability adjustment - convert high vulnerability to a penalty
    const vulnerabilityAdjustment = (100 - serviceVulnerability) * vulnerabilityImpact;
    
    // Calculate final score with vulnerability adjustment
    let finalScore = (weightedDimensionScore * (1 - vulnerabilityImpact)) + vulnerabilityAdjustment;
    
    // Revenue concentration bonus/penalty (based on spread of revenue across services)
    // This rewards diversification and penalizes over-concentration in one service
    if (serviceScores && Object.keys(serviceScores).length > 0) {
      // Calculate revenue concentration metric from serviceScores
      const serviceIds = Object.keys(serviceScores);
      const revenueDistribution = [];
      
      // Extract revenue values for selected services
      serviceIds.forEach(id => {
        if (serviceScores[id].revenue && serviceScores[id].revenue > 0) {
          revenueDistribution.push(serviceScores[id].revenue);
        }
      });
      
      // If we have revenue data, calculate concentration
      if (revenueDistribution.length > 0) {
        // Sort descending
        revenueDistribution.sort((a, b) => b - a);
        
        // If more than 50% in one service, apply concentration penalty
        if (revenueDistribution[0] > 0.5) {
          finalScore -= (revenueDistribution[0] - 0.5) * 10;
        }
        
        // If well-distributed (no service > 30%), apply diversification bonus
        if (revenueDistribution[0] < 0.3 && revenueDistribution.length >= 3) {
          finalScore += 5;
        }
      }
    }
    
    // Ensure score is within range
    finalScore = Math.max(0, Math.min(100, Math.round(finalScore)));
    
    return finalScore;
  }
  
  /**
   * Agency-specific weighted overall score calculation
   * @param {Object} dimensionScores - Scores for each dimension
   * @param {Object} serviceScores - Service-specific scores
   * @param {number} serviceVulnerability - Service vulnerability score
   * @param {number} adjustedAiScore - Adjusted AI score
   * @returns {number} - Agency-specific overall score (0-100)
   */
  agencyWeightedCalculateOverallScore(dimensionScores, serviceScores, serviceVulnerability, adjustedAiScore) {
    // Agency-specific weights
    const weights = {
      operational: 0.2,
      financial: 0.3,
      ai: 0.4,
      strategic: 0.1
    };
    
    // Calculate weighted dimension score
    const weightedDimensionScore = 
      (dimensionScores.operational * weights.operational) +
      (dimensionScores.financial * weights.financial) +
      (adjustedAiScore * weights.ai) +
      ((dimensionScores.strategic || 0) * weights.strategic);
    
    // Adjust by service vulnerability (agency-specific adjustment)
    const vulnerabilityAdjustment = (100 - serviceVulnerability) * 0.25;
    
    // Calculate final score
    let finalScore = (weightedDimensionScore * 0.75) + vulnerabilityAdjustment;
    
    // Ensure score is within range
    finalScore = Math.max(0, Math.min(100, finalScore));
    
    return finalScore;
  }
  
  /**
   * Enhanced score category determination
   * @param {number} overallScore - Overall assessment score
   * @param {Object} dimensionScores - Individual dimension scores
   * @returns {string} - Enhanced score category
   */
  enhancedDetermineScoreCategory(overallScore, dimensionScores) {
    // Simple categorization based on overall score
    if (overallScore < 40) {
      return 'High Vulnerability';
    } else if (overallScore < 70) {
      return 'Moderate Vulnerability';
    } else {
      return 'Low Vulnerability';
    }
  }
  
  /**
   * Generate recommendations based on scores
   * @param {number} overallScore - Overall score
   * @param {Object} dimensionScores - Dimension scores
   * @param {Object} serviceScores - Service scores
   * @param {number} serviceVulnerability - Service vulnerability score
   * @param {Array} selectedServices - Selected services
   * @returns {Array} - Array of recommendations
   */
  generateRecommendations(overallScore, dimensionScores, serviceScores, serviceVulnerability, selectedServices) {
    const recommendations = [];
    
    // Determine selectedAgencyType
    let selectedAgencyType = null;
    if (arguments.length > 5 && arguments[5]) {
      selectedAgencyType = arguments[5];
    }
    
    console.log('[EnhancedWeightedScoring] Generating recommendations for agency type:', selectedAgencyType);
    
    // Check if we should use the new modular recommendations
    if (this.config.recommendationsConfig && this.config.recommendationsConfig.enabled) {
      console.log('[EnhancedWeightedScoring] Using modular recommendations configuration');
      
      // Check if ServiceRecommendations is available (loaded from external file)
      if (typeof ServiceRecommendations !== 'undefined') {
        console.log('[EnhancedWeightedScoring] ServiceRecommendations loaded successfully');
        
        // Determine score category for recommendations
        let scoreCategory = 'lowScore';
        if (overallScore >= 70) {
          scoreCategory = 'highScore';
        } else if (overallScore >= 40) {
          scoreCategory = 'midScore';
        }
        
        // Add service-specific recommendations for each selected service
        if (this.config.recommendationsConfig.useServiceSpecific && selectedServices) {
          selectedServices.forEach(serviceId => {
            // Check if we have recommendations for this service
            if (ServiceRecommendations.services && ServiceRecommendations.services[serviceId]) {
              const serviceRecs = ServiceRecommendations.services[serviceId];
              const scoreRecs = serviceRecs[scoreCategory];
              
              // If we have recommendations for this score level
              if (scoreRecs) {
                // Add immediate recommendations
                if (scoreRecs.immediate && scoreRecs.immediate.length > 0) {
                  scoreRecs.immediate.forEach(rec => {
                    // Check for agency-type specific variations
                    let description = rec.description;
                    if (selectedAgencyType && rec.agencyTypeVariations && rec.agencyTypeVariations[selectedAgencyType]) {
                      description += ` (${rec.agencyTypeVariations[selectedAgencyType]})`;
                    }
                    
                    recommendations.push({
                      title: rec.title,
                      text: description,
                      service: serviceId,
                      priority: 'immediate',
                      complexity: rec.complexity || 'medium'
                    });
                  });
                }
                
                // Add some short-term and strategic recommendations
                if (scoreRecs.shortTerm && scoreRecs.shortTerm.length > 0) {
                  const shortTermRec = scoreRecs.shortTerm[0]; // Just add the first one
                  recommendations.push({
                    title: shortTermRec.title,
                    text: shortTermRec.description,
                    service: serviceId,
                    priority: 'short-term',
                    complexity: shortTermRec.complexity || 'medium'
                  });
                }
                
                if (scoreRecs.strategic && scoreRecs.strategic.length > 0) {
                  const strategicRec = scoreRecs.strategic[0]; // Just add the first one
                  recommendations.push({
                    title: strategicRec.title,
                    text: strategicRec.description,
                    service: serviceId,
                    priority: 'strategic',
                    complexity: strategicRec.complexity || 'high'
                  });
                }
              }
            }
          });
        }
        
        // If we have enough recommendations, return them
        if (recommendations.length >= 3) {
          return recommendations;
        }
      } else {
        console.warn('[EnhancedWeightedScoring] ServiceRecommendations not loaded, using fallback recommendations');
      }
    }
    
    // Fallback to original recommendation logic if modular recommendations aren't available or insufficient
    console.log('[EnhancedWeightedScoring] Using fallback recommendation generation');
    
    // Get agency type-specific recommendations if available
    if (this.config.recommendations && this.config.recommendations.agencyTypes) {
      // Try to find by both type and value fields (to handle multiple naming conventions)
      const agencyTypeRecs = this.config.recommendations.agencyTypes.find(rec => {
        // Try matching by various fields - we need to be flexible here
        if (selectedAgencyType) {
          return rec.type === selectedAgencyType || 
                 rec.id === selectedAgencyType || 
                 rec.value === selectedAgencyType;
        }
        // If no specific agency type is provided, use the first one
        return true;
      });
      
      console.log('[EnhancedWeightedScoring] Found agency recommendations:', agencyTypeRecs);
      
      if (agencyTypeRecs && agencyTypeRecs.recommendations) {
        // Add agency type-specific recommendations
        agencyTypeRecs.recommendations.forEach((rec, index) => {
          recommendations.push({
            title: `Industry Recommendation ${index + 1}`,
            text: rec
          });
        });
      }
    }
    
    // Add dimension-specific recommendations
    const dimensionRecommendations = {
      operational: {
        low: 'Develop better documentation and operational processes',
        mid: 'Standardize operational workflows and improve knowledge sharing',
        high: 'Optimize operational efficiency with AI-powered automation'
      },
      financial: {
        low: 'Build financial reserves and more predictable revenue streams',
        mid: 'Diversify revenue sources and implement better financial controls',
        high: 'Maximize profitability through AI-enabled value-based pricing'
      },
      ai: {
        low: 'Implement comprehensive AI training for team members',
        mid: 'Develop specialized AI capabilities in core service areas',
        high: 'Pioneer innovative AI applications in your industry'
      },
      strategic: {
        low: 'Create a long-term AI adoption roadmap for your agency',
        mid: 'Reposition service offerings to capitalize on AI advantages',
        high: 'Establish thought leadership in AI transformation'
      }
    };
    
    // Add recommendations based on dimension scores
    Object.keys(dimensionScores).forEach(dimension => {
      if (dimension !== 'overall' && dimension !== 'serviceVulnerability' && dimension !== 'serviceAdaptability' && dimension !== 'adjustedAi') {
        const score = dimensionScores[dimension];
        const dimRecs = dimensionRecommendations[dimension];
        
        if (dimRecs) {
          let recText = '';
          let recTitle = dimension.charAt(0).toUpperCase() + dimension.slice(1) + ' Excellence';
          
          if (score < 40) {
            recText = dimRecs.low;
          } else if (score < 70) {
            recText = dimRecs.mid;
          } else {
            recText = dimRecs.high;
          }
          
          recommendations.push({
            title: recTitle,
            text: recText
          });
        }
      }
    });
    
    // Service-specific recommendations
    if (selectedServices && selectedServices.length > 0) {
      const highRiskServices = [];
      
      // Find services with high vulnerability
      Object.keys(serviceScores).forEach(serviceId => {
        if (serviceScores[serviceId].vulnerability > 70) {
          highRiskServices.push(serviceId);
        }
      });
      
      if (highRiskServices.length > 0) {
        recommendations.push({
          title: 'Service Risk Mitigation',
          text: `Prioritize AI transformation for your highest-risk services: ${highRiskServices.join(', ')}`
        });
      }
    }
    
    // If we have very few recommendations, add some standard ones based on overall score
    if (recommendations.length < 3) {
      if (overallScore < 40) {
        recommendations.push({
          title: 'Develop AI Strategy',
          text: 'Create a comprehensive AI strategy to address high vulnerability.'
        });
        recommendations.push({
          title: 'Service Portfolio Analysis',
          text: 'Analyze your service portfolio to identify highest-risk offerings.'
        });
      } else if (overallScore < 70) {
        recommendations.push({
          title: 'Enhance AI Capabilities',
          text: 'Invest in developing stronger AI capabilities across the organization.'
        });
        recommendations.push({
          title: 'Operational Improvement',
          text: 'Improve operational processes to better support AI integration.'
        });
      } else {
        recommendations.push({
          title: 'AI Leadership',
          text: 'Position your agency as an AI leader in your industry.'
        });
        recommendations.push({
          title: 'Service Innovation',
          text: 'Continue innovating your service offerings with advanced AI integration.'
        });
      }
    }
    
    return recommendations;
  }
  
  /**
   * Generate action plan based on score category
   * @param {number} overallScore - Overall assessment score
   * @param {string} scoreCategory - Score category
   * @returns {Array} - Action plan items
   */
  generateActionPlan(overallScore, scoreCategory) {
    const actionPlan = [];
    
    if (scoreCategory === 'High Vulnerability') {
      actionPlan.push({
        title: 'Conduct AI Vulnerability Assessment',
        description: 'Perform detailed analysis of service offerings to identify high-risk areas for AI disruption.',
        impact: 'Critical strategic planning foundation'
      });
      actionPlan.push({
        title: 'Transition to Retainer Model', 
        description: 'Develop and implement retainer offerings to improve revenue predictability.',
        impact: 'Potential valuation increase: 1.0-2.0x EBITDA'
      });
      actionPlan.push({
        title: 'Implement Basic AI Tools',
        description: 'Begin using fundamental AI tools in day-to-day operations with structured training.',
        impact: 'Efficiency improvement and competitive positioning'
      });
    } else if (scoreCategory === 'Moderate Vulnerability') {
      actionPlan.push({
        title: 'Standardize AI Workflows',
        description: 'Create standardized processes for AI implementation across all client work and internal operations.',
        impact: 'Potential efficiency improvement: 20-30%'
      });
      actionPlan.push({
        title: 'Reduce Client Concentration',
        description: 'Diversify your client base to ensure no single client represents more than 20% of revenue.',
        impact: 'Risk reduction and valuation stability'
      });
      actionPlan.push({
        title: 'Develop Knowledge Management System',
        description: 'Implement a comprehensive documentation system to reduce key person dependencies.',
        impact: 'Enhanced operational resilience and smoother due diligence'
      });
    } else {
      actionPlan.push({
        title: 'Develop AI-Enhanced Service Portfolio',
        description: 'Package and formalize your AI-enhanced services with clear value propositions and case studies.',
        impact: 'Potential valuation increase: 0.5-1.0x EBITDA'
      });
      actionPlan.push({
        title: 'Implement Value-Based Pricing',
        description: 'Transition remaining time-based services to value-based pricing models to capitalize on AI efficiencies.',
        impact: 'Potential margin improvement: 10-15%'
      });
      actionPlan.push({
        title: 'Document AI ROI Metrics',
        description: 'Create formal documentation of efficiency gains and value creation from AI implementation.',
        impact: 'Enhanced acquirer due diligence positioning'
      });
    }
    
    return actionPlan;
  }
  
  /**
   * Generate key insights based on scoring analysis
   * @param {Object} dimensionScores - Dimension scores
   * @param {Object} serviceScores - Service scores
   * @param {number} serviceVulnerability - Service vulnerability
   * @param {number} adjustedAiScore - Adjusted AI score
   * @param {Array} selectedServices - Selected services
   * @returns {Array} - Array of key insights
   */
  generateKeyInsights(dimensionScores, serviceScores, serviceVulnerability, adjustedAiScore, selectedServices) {
    const insights = [];
    
    // AI readiness insights
    if (dimensionScores.ai >= 80) {
      insights.push("Strong AI adoption positions you as an industry leader");
    } else if (dimensionScores.ai < 40) {
      insights.push("Critical AI skills gap requires immediate attention");
    }
    
    // Service vulnerability insights
    if (serviceVulnerability > 75) {
      insights.push("High service vulnerability to AI disruption - diversification recommended");
    } else if (serviceVulnerability < 40) {
      insights.push("Strong service resilience provides competitive advantage");
    }
    
    // Financial health insights
    if (dimensionScores.financial >= 75) {
      insights.push("Strong financial foundation supports AI investment");
    } else if (dimensionScores.financial < 45) {
      insights.push("Financial constraints may limit AI transformation capacity");
    }
    
    // Operational maturity insights
    if (dimensionScores.operational >= 75) {
      insights.push("Operational excellence enables smooth AI integration");
    } else if (dimensionScores.operational < 45) {
      insights.push("Operational improvements needed before AI transformation");
    }
    
    return insights;
  }
  
  /**
   * Get fallback results when calculation fails
   * @param {Object} state - Assessment state
   * @returns {Object} - Fallback results
   */
  getFallbackResults(state) {
    return {
      scores: {
        overall: 50,
        operational: 50,
        financial: 50,
        ai: 50,
        strategic: 50,
        serviceVulnerability: 50,
        serviceAdaptability: 50,
        adjustedAi: 50
      },
      serviceScores: {},
      vulnerabilityLevel: "Assessment Error - Please Retry",
      recommendations: [{
        title: "Assessment Error",
        text: "There was an error processing your assessment. Please try again."
      }],
      insights: ["Assessment calculation error - please try again"],
      actionPlan: [],
      selectedServices: state.selectedServices || [],
      selectedAgencyType: state.selectedAgencyType || null
    };
  }
}

// Make available to the WordPress plugin
window.EnhancedWeightedScoring = EnhancedWeightedScoring;
