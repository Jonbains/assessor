/**
 * Assessment Framework - Agency Scoring Engine
 * 
 * Implements the agency-specific scoring algorithms for calculating assessment results
 * Extends the base scoring engine with agency-specific logic and enhanced scoring features
 */

import { ScoringBase } from '../../../core/scoring-base.js';
import { ServiceRecommendations } from '../recommendations/service-recommendations.js';

/**
 * AgencyScoringEngine class
 * Agency-specific scoring implementation with M&A valuation focus
 * Incorporates enhanced weighted scoring methodology
 */
export class AgencyScoringEngine extends ScoringBase {
  /**
   * Constructor for agency scoring engine
   * @param {Object} config - Scoring configuration
   */
  constructor(config) {
    super(config);
    this.type = 'agency';
    this.config = config;
    
    // Agency-specific scoring weights
    this.agencyWeights = {
      operational: 0.2,
      financial: 0.3,
      ai: 0.4,
      strategic: 0.1
    };
    
    // Override weights from config if provided
    if (config.scoring && config.scoring.weights) {
      Object.assign(this.agencyWeights, config.scoring.weights);
    }
  }
  
  /**
   * Calculate assessment results
   * @param {Object} answers - User's answers to questions
   * @param {Array} questions - All questions in the assessment
   * @param {Object} assessmentData - Additional assessment data
   * @return {Object} - Results object with scores and recommendations
   */
  calculateResults(answers, questions, assessmentData = {}) {
    console.log('[AgencyScoringEngine] Calculating results');
    
    const selectedServices = assessmentData.selectedServices || [];
    const selectedAgencyType = assessmentData.selectedAgencyType;
    
    try {
      // Get revenue from assessment data
      const revenue = assessmentData.revenue || 0;
      
      // Group questions by dimension
      const questionsByDimension = this.groupQuestionsByDimension(questions);
      
      const operationalQuestions = questionsByDimension['operational'] || [];
      const financialQuestions = questionsByDimension['financial'] || [];
      const aiQuestions = questionsByDimension['ai'] || [];
      const strategicQuestions = questionsByDimension['strategic'] || [];
      
      // Calculate individual dimension scores first
      const operationalScore = this.weightedCalculateDimensionScore(answers, operationalQuestions, 'operational');
      const financialScore = this.weightedCalculateDimensionScore(answers, financialQuestions, 'financial');
      const aiScore = this.weightedCalculateDimensionScore(answers, aiQuestions, 'ai');
      
      // Calculate strategic score - either from strategic questions or derived from other dimensions
      let strategicScore;
      if (strategicQuestions && strategicQuestions.length > 0) {
        strategicScore = this.weightedCalculateDimensionScore(answers, strategicQuestions, 'strategic');
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
      
      console.log('[AgencyScoringEngine] Weighted dimension scores:', dimensionScores);
      
      // Calculate service-specific scores with enhanced weighting
      const serviceScoresResult = this.calculateServiceScores(
        answers,
        questions,
        selectedServices
      );
      
      // Calculate revenue-weighted service vulnerability
      const serviceVulnerabilityScore = this.calculateServiceVulnerability(
        serviceScoresResult
      );
      
      // Calculate service adaptability score
      const serviceAdaptabilityScore = this.calculateServiceAdaptability(
        serviceScoresResult
      );
      
      // Calculate adjusted AI score using enhanced formula
      const adjustedAiScore = this.calculateAdjustedAiScore(
        dimensionScores.ai,
        serviceVulnerabilityScore,
        serviceAdaptabilityScore
      );
      
      // Calculate overall score using weighted methodology
      const overallScore = this.calculateEnhancedOverallScore(
        dimensionScores,
        serviceScoresResult,
        serviceVulnerabilityScore,
        adjustedAiScore
      );
      
      // Determine score category
      const scoreCategory = this.determineScoreCategory(overallScore, dimensionScores);
      
      // Calculate valuation impact if revenue is provided
      const valuationImpact = revenue > 0 ? 
        this.calculateValuationImpact(overallScore, dimensionScores, revenue) : null;
        
      // We'll use the recommendations engine component for recommendations instead
      // as it's been moved to its own module
      
      // Generate key insights
      const insights = this.generateKeyInsights(
        dimensionScores,
        serviceScoresResult,
        serviceVulnerabilityScore,
        adjustedAiScore,
        selectedServices
      );
      
      // Prepare final results
      console.log('[AgencyScoringEngine] Final scores before rounding:', { 
        overallScore, 
        dimensionScores, 
        serviceVulnerabilityScore, 
        serviceAdaptabilityScore, 
        adjustedAiScore 
      });
      
      const result = {
        overallScore: Math.round(overallScore),
        dimensionScores: {
          operational: Math.round(dimensionScores.operational || 0),
          financial: Math.round(dimensionScores.financial || 0),
          ai: Math.round(dimensionScores.ai || 0),
          strategic: Math.round(dimensionScores.strategic || 0),
          serviceVulnerability: Math.round(serviceVulnerabilityScore || 0),
          serviceAdaptability: Math.round(serviceAdaptabilityScore || 0),
          adjustedAi: Math.round(adjustedAiScore || 0)
        },
        serviceScores: serviceScoresResult,
        vulnerabilityLevel: scoreCategory,
        insights: insights,
        valuationImpact: valuationImpact,
        timestamp: new Date().getTime(),
        agencyType: selectedAgencyType,
        assessmentType: this.type
      };
      
      console.log('[AgencyScoringEngine] Final result object:', result);
      return result;
    } catch (error) {
      console.error('[AgencyScoringEngine] Error calculating results:', error);
      return {
        overallScore: 50,
        dimensionScores: {
          operational: 50,
          financial: 50,
          ai: 50,
          strategic: 50
        },
        serviceScores: {},
        timestamp: new Date().getTime(),
        agencyType: selectedAgencyType,
        assessmentType: this.type,
        error: error.message
      };
    }
  }
  
  /**
   * Calculate a score for a specific dimension using weighted methodology
   * @param {Object} answers - User's answers
   * @param {Array} questions - Questions for this dimension
   * @param {string} dimension - The dimension being calculated
   * @return {Number} - The dimension score (0-100)
   */
  weightedCalculateDimensionScore(answers, questions, dimension) {
    if (!questions || questions.length === 0) {
      console.log(`[AgencyScoringEngine] No questions for dimension: ${dimension}`);
      return 0;
    }
    
    console.log(`[AgencyScoringEngine] Calculating score for dimension: ${dimension} with ${questions.length} questions`);
    
    let totalWeightedScore = 0;
    let totalWeight = 0;
    let answeredQuestions = 0;
    
    questions.forEach(question => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        answeredQuestions++;
        const weight = question.weight || 1;
        
        // Extract the score properly from the answer object
        // Answer can be either a direct score value (legacy) or an object with a score property
        const score = typeof answer === 'object' && answer.score !== undefined ? 
          answer.score : 
          (typeof answer === 'number' ? answer : 0);
        
        console.log(`[AgencyScoringEngine] Question ${question.id} has answer:`, answer, 'extracted score:', score);
        
        // Convert to percentage (0-100)
        const normalizedScore = (score / 5) * 100;
        
        totalWeightedScore += normalizedScore * weight;
        totalWeight += weight;
      }
    });
    
    const dimensionScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    console.log(`[AgencyScoringEngine] ${dimension} dimension score: ${dimensionScore.toFixed(2)} (${answeredQuestions}/${questions.length} questions answered)`);
    
    // Return weighted average
    return dimensionScore;
  }
  
  /**
   * Calculate scores for each selected service
   * @param {Object} answers - User's answers
   * @param {Array} questions - All questions
   * @param {Array} selectedServices - Services selected by user
   * @return {Object} - Scores for each service
   */
  calculateServiceScores(answers, questions, selectedServices) {
    const serviceScores = {};
    
    // Skip if no services selected
    if (!selectedServices || selectedServices.length === 0) {
      return serviceScores;
    }
    
    // Get only questions related to services
    const serviceQuestions = questions.filter(q => 
      q.serviceId || q.service || (q.tags && q.tags.some(tag => selectedServices.includes(tag)))
    );
    
    // Group questions by service
    const questionsByService = {};
    selectedServices.forEach(serviceId => {
      questionsByService[serviceId] = serviceQuestions.filter(q => 
        q.serviceId === serviceId || 
        q.service === serviceId || 
        (q.tags && q.tags.includes(serviceId))
      );
    });
    
    // Calculate enhanced scores for each service
    selectedServices.forEach(serviceId => {
      serviceScores[serviceId] = this.calculateServiceScore(answers, questionsByService[serviceId] || [], serviceId);
    });
    
    return serviceScores;
  }
  
  /**
   * Calculate score for a specific service with enhanced methodology
   * @param {Object} answers - User's answers
   * @param {Array} questions - Questions for this service
   * @param {String} serviceId - Service identifier
   * @return {Object} - Service score with additional metrics
   */
  calculateServiceScore(answers, questions, serviceId) {
    // Weight service-specific questions higher
    const dimensionScores = {};
    const serviceSpecificQuestions = questions.filter(q => 
      q.serviceId === serviceId || q.service === serviceId ||
      (q.tags && q.tags.includes(serviceId))
    );
    
    // Get baseline dimension scores
    const questionsByDimension = this.groupQuestionsByDimension(questions);
    
    // Calculate scores for each dimension
    Object.keys(questionsByDimension).forEach(dimension => {
      dimensionScores[dimension] = this.weightedCalculateDimensionScore(
        answers, 
        questionsByDimension[dimension],
        dimension
      );
    });
    
    // For AI dimension, weight AI-related questions higher for service scores
    if (dimensionScores.ai && serviceSpecificQuestions.length > 0) {
      const aiServiceQuestions = serviceSpecificQuestions.filter(q => q.dimension === 'ai');
      if (aiServiceQuestions.length > 0) {
        const aiServiceScore = this.weightedCalculateDimensionScore(answers, aiServiceQuestions, 'ai');
        dimensionScores.ai = (dimensionScores.ai + aiServiceScore * 2) / 3;
      }
    }
    
    // Calculate overall service score using weighted dimension scores
    const overallScore = this.calculateOverallScore(dimensionScores);
    
    // Get service disruption metadata from config if available
    const disruptionData = this.config.disruption || [];
    const serviceDisruption = disruptionData.find(d => d.serviceId === serviceId) || {};
    
    // Default vulnerability and opportunity values if not provided in disruption data
    const vulnerability = serviceDisruption.vulnerability || 50;
    const opportunity = serviceDisruption.opportunity || 50;
    
    // Calculate adaptability (inverse of vulnerability adjusted by service score)
    const adaptability = 100 - ((vulnerability * 0.7) + ((100 - overallScore) * 0.3));
    
    return {
      score: Math.round(overallScore),
      vulnerability: Math.round(vulnerability),
      opportunity: Math.round(opportunity),
      adaptability: Math.round(adaptability),
      dimensions: dimensionScores
    };
  }
  
  /**
   * Calculate the overall score based on dimension scores
   * @param {Object} dimensionScores - Object containing scores for each dimension
   * @return {Number} - The overall score (0-100)
   */
  calculateOverallScore(dimensionScores) {
    console.log('[AgencyScoringEngine] Calculating overall score with dimension scores:', dimensionScores);
    
    // Use the agency-specific weights
    const weights = this.agencyWeights;
    console.log('[AgencyScoringEngine] Using dimension weights:', weights);
    
    let totalScore = 0;
    let totalWeight = 0;
    
    // Calculate weighted sum
    Object.keys(weights).forEach(dimension => {
      if (dimensionScores[dimension] !== undefined) {
        const dimensionScore = dimensionScores[dimension];
        const dimensionWeight = weights[dimension];
        const weightedScore = dimensionScore * dimensionWeight;
        
        console.log(`[AgencyScoringEngine] Dimension ${dimension}: score=${dimensionScore.toFixed(2)}, weight=${dimensionWeight}, weighted=${weightedScore.toFixed(2)}`);
        
        totalScore += weightedScore;
        totalWeight += dimensionWeight;
      } else {
        console.log(`[AgencyScoringEngine] Warning: Dimension ${dimension} has no score but has weight ${weights[dimension]}`);
      }
    });
    
    // Return weighted average
    const overallScore = totalWeight > 0 ? totalScore / totalWeight : 0;
    console.log(`[AgencyScoringEngine] Overall score: ${overallScore.toFixed(2)} (totalScore=${totalScore.toFixed(2)}, totalWeight=${totalWeight})`);
    
    return overallScore;
  }
  
  /**
   * Calculate service vulnerability score based on service scores
   * @param {Object} serviceScores - Service scores object
   * @returns {number} - Weighted vulnerability score (0-100)
   */
  calculateServiceVulnerability(serviceScores) {
    let totalVulnerability = 0;
    let totalRevenue = 0;
    
    // If no service scores or no revenue data, return default
    if (!serviceScores || Object.keys(serviceScores).length === 0) {
      return 50; // Default score
    }
    
    // Default weight if no revenue data
    const defaultRevenue = 1 / Object.keys(serviceScores).length;
    
    // Track high-risk services (vulnerability > 70) for emphasis
    const highRiskServices = [];
    
    Object.keys(serviceScores).forEach(serviceId => {
      const service = serviceScores[serviceId];
      const revenue = defaultRevenue;
      
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
   * @returns {number} - Weighted adaptability score (0-100)
   */
  calculateServiceAdaptability(serviceScores) {
    let totalAdaptability = 0;
    let totalRevenue = 0;
    
    // If no service scores or no revenue data, return default
    if (!serviceScores || Object.keys(serviceScores).length === 0) {
      return 50; // Default score
    }
    
    // Default weight if no revenue data
    const defaultRevenue = 1 / Object.keys(serviceScores).length;
    
    // Track highly adaptable services (adaptability > 70) for emphasis
    const highAdaptabilityServices = [];
    
    Object.keys(serviceScores).forEach(serviceId => {
      const service = serviceScores[serviceId];
      const revenue = defaultRevenue;
      
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
   * Calculate enhanced overall score using weighted methodology
   * @param {Object} dimensionScores - Scores for each dimension
   * @param {Object} serviceScores - Service-specific scores
   * @param {number} serviceVulnerability - Service vulnerability score
   * @param {number} adjustedAiScore - Adjusted AI score
   * @returns {number} - Enhanced overall score (0-100)
   */
  calculateEnhancedOverallScore(dimensionScores, serviceScores, serviceVulnerability, adjustedAiScore) {
    console.log('[AgencyScoringEngine] Calculating enhanced overall score with inputs:');
    console.log('- Dimension scores:', dimensionScores);
    console.log('- Service vulnerability:', serviceVulnerability);
    console.log('- Adjusted AI score:', adjustedAiScore);
    
    // Agency-specific weights
    const weights = {
      operational: 0.2,
      financial: 0.3,
      ai: 0.4,
      strategic: 0.1
    };
    
    // Check that dimension scores exist and log any missing values
    if (dimensionScores.operational === undefined) {
      console.warn('[AgencyScoringEngine] Missing operational score, defaulting to 0');
      dimensionScores.operational = 0;
    }
    
    if (dimensionScores.financial === undefined) {
      console.warn('[AgencyScoringEngine] Missing financial score, defaulting to 0');
      dimensionScores.financial = 0;
    }
    
    if (dimensionScores.ai === undefined) {
      console.warn('[AgencyScoringEngine] Missing AI score, defaulting to 0');
      dimensionScores.ai = 0;
    }
    
    if (dimensionScores.strategic === undefined) {
      console.warn('[AgencyScoringEngine] Missing strategic score, defaulting to 0');
      dimensionScores.strategic = 0;
    }
    
    // Calculate each weighted component separately for better debugging
    const weightedOperational = dimensionScores.operational * weights.operational;
    const weightedFinancial = dimensionScores.financial * weights.financial;
    const weightedAi = adjustedAiScore * weights.ai;
    const weightedStrategic = dimensionScores.strategic * weights.strategic;
    
    console.log(`[AgencyScoringEngine] Weighted components:`);
    console.log(`- Operational: ${dimensionScores.operational.toFixed(2)} × ${weights.operational} = ${weightedOperational.toFixed(2)}`);
    console.log(`- Financial: ${dimensionScores.financial.toFixed(2)} × ${weights.financial} = ${weightedFinancial.toFixed(2)}`);
    console.log(`- AI (adjusted): ${adjustedAiScore.toFixed(2)} × ${weights.ai} = ${weightedAi.toFixed(2)}`);
    console.log(`- Strategic: ${dimensionScores.strategic.toFixed(2)} × ${weights.strategic} = ${weightedStrategic.toFixed(2)}`);
    
    // Calculate weighted dimension score
    const weightedDimensionScore = 
      weightedOperational + 
      weightedFinancial + 
      weightedAi + 
      weightedStrategic;
    
    console.log(`[AgencyScoringEngine] Total weighted dimension score: ${weightedDimensionScore.toFixed(2)}`);
    
    // Adjust by service vulnerability (agency-specific adjustment)
    const vulnerabilityAdjustment = (100 - serviceVulnerability) * 0.25;
    console.log(`[AgencyScoringEngine] Vulnerability adjustment: (100 - ${serviceVulnerability}) × 0.25 = ${vulnerabilityAdjustment.toFixed(2)}`);
    
    // Calculate final score
    let finalScore = (weightedDimensionScore * 0.75) + vulnerabilityAdjustment;
    console.log(`[AgencyScoringEngine] Final score before range check: ${finalScore.toFixed(2)}`);
    
    // Ensure score is within range
    finalScore = Math.max(0, Math.min(100, finalScore));
    console.log(`[AgencyScoringEngine] Final enhanced overall score: ${finalScore.toFixed(2)}`);
    
    return finalScore;
  }
  
  /**
   * Determine the score category based on overall score
   * @param {number} overallScore - Overall assessment score
   * @param {Object} dimensionScores - Individual dimension scores
   * @returns {string} - Score category
   */
  determineScoreCategory(overallScore, dimensionScores) {
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
   * @param {Object} assessmentData - Assessment data
   * @returns {Object} - Fallback results
   */
  getFallbackResults(assessmentData) {
    return {
      overallScore: 50,
      dimensionScores: {
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
      insights: ["Assessment calculation error - please try again"],
      timestamp: new Date().getTime(),
      agencyType: assessmentData.selectedAgencyType,
      assessmentType: this.type,
      error: "Error calculating results"
    };
  }
}

// Export default
export default AgencyScoringEngine;
