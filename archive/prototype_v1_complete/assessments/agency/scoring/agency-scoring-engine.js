/**
 * Agency Assessment - Scoring Engine
 *
 * This provides a stub for the scoring engine that was referenced in the HTML.
 * Replace this with actual implementation when available.
 */

// Define the scoring engine class
class AgencyScoringEngine {
  /**
   * Constructor for the scoring engine
   * @param {Object} config - Assessment configuration
   */
  constructor(config) {
    this.config = config;
    this.dimensionWeights = {
      financial: 0.4,
      business: 0.3,
      service: 0.2,
      market: 0.1
    };
  }
  
  /**
   * Calculate assessment scores
   * @param {Object} assessmentData - Assessment data including answers
   * @return {Object} - Calculated scores and insights
   */
  calculateScores(assessmentData) {
    console.log('[AgencyScoringEngine] Calculating scores');
    
    // Get answers from assessment data
    const answers = assessmentData.answers || {};
    const agencyType = assessmentData.selectedAgencyType;
    const services = assessmentData.selectedServices || [];
    const revenue = assessmentData.revenue || 0;
    
    // Calculate dimension scores
    const dimensionScores = this.calculateDimensionScores(answers);
    
    // Calculate overall score
    const overallScore = this.calculateOverallScore(dimensionScores);
    
    // Calculate valuation metrics
    const valuationMetrics = this.calculateValuationMetrics(overallScore, dimensionScores, agencyType, revenue);
    
    return {
      overall: overallScore,
      dimensions: dimensionScores,
      valuation: valuationMetrics,
      agencyType: agencyType,
      services: services,
      strengths: this.identifyStrengths(dimensionScores),
      weaknesses: this.identifyWeaknesses(dimensionScores)
    };
  }
  
  /**
   * Calculate dimension scores based on answers
   * @param {Object} answers - Assessment answers
   * @return {Object} - Scores for each dimension
   */
  calculateDimensionScores(answers) {
    // Initialize dimension scores
    const dimensionScores = {
      financial: 0,
      business: 0,
      service: 0,
      market: 0
    };
    
    // Count questions per dimension
    const questionCounts = {
      financial: 0,
      business: 0,
      service: 0,
      market: 0
    };
    
    // Process each answer
    Object.entries(answers).forEach(([questionId, answer]) => {
      // Find the question in the config
      const question = this.findQuestionById(questionId);
      
      if (question && question.dimension) {
        const dimension = question.dimension;
        const score = parseInt(answer, 10);
        
        // Add to dimension score
        if (dimensionScores[dimension] !== undefined) {
          dimensionScores[dimension] += score;
          questionCounts[dimension]++;
        }
      }
    });
    
    // Normalize dimension scores to 0-100 scale
    Object.keys(dimensionScores).forEach(dimension => {
      if (questionCounts[dimension] > 0) {
        // Max possible score is 5 points per question
        const maxPossible = questionCounts[dimension] * 5;
        dimensionScores[dimension] = Math.round((dimensionScores[dimension] / maxPossible) * 100);
      } else {
        dimensionScores[dimension] = 0;
      }
    });
    
    return dimensionScores;
  }
  
  /**
   * Calculate overall score based on dimension scores
   * @param {Object} dimensionScores - Scores for each dimension
   * @return {number} - Overall score (0-100)
   */
  calculateOverallScore(dimensionScores) {
    let weightedSum = 0;
    let totalWeight = 0;
    
    // Calculate weighted sum
    Object.entries(dimensionScores).forEach(([dimension, score]) => {
      const weight = this.dimensionWeights[dimension] || 0;
      weightedSum += score * weight;
      totalWeight += weight;
    });
    
    // Normalize to 0-100 scale
    return Math.round(totalWeight > 0 ? weightedSum / totalWeight : 0);
  }
  
  /**
   * Calculate valuation metrics
   * @param {number} overallScore - Overall assessment score
   * @param {Object} dimensionScores - Scores for each dimension
   * @param {string} agencyType - Selected agency type
   * @param {number} revenue - Agency revenue
   * @return {Object} - Valuation metrics
   */
  calculateValuationMetrics(overallScore, dimensionScores, agencyType, revenue) {
    // Default valuation multiple
    let baseMultiple = 6;
    
    // Adjust based on agency type
    const agencyMultiples = {
      digital: 8,
      creative: 7,
      integrated: 7.5,
      specialty: 8.5
    };
    
    if (agencyMultiples[agencyType]) {
      baseMultiple = agencyMultiples[agencyType];
    }
    
    // Adjust based on overall score
    let scoreAdjustment = 1.0;
    if (overallScore >= 80) {
      scoreAdjustment = 1.2;
    } else if (overallScore >= 60) {
      scoreAdjustment = 1.1;
    } else if (overallScore <= 40) {
      scoreAdjustment = 0.9;
    } else if (overallScore <= 20) {
      scoreAdjustment = 0.8;
    }
    
    // Calculate final multiple
    const finalMultiple = baseMultiple * scoreAdjustment;
    
    // Assume 15% EBITDA margin if no financial data
    const ebitdaMargin = 0.15;
    const ebitda = revenue * ebitdaMargin;
    
    // Calculate valuation
    const valuation = ebitda * finalMultiple;
    
    return {
      baseMultiple: baseMultiple,
      adjustedMultiple: finalMultiple,
      estimatedEBITDA: ebitda,
      estimatedValuation: valuation,
      improvementPotential: this.calculateImprovementPotential(overallScore, valuation)
    };
  }
  
  /**
   * Calculate improvement potential
   * @param {number} overallScore - Overall assessment score
   * @param {number} currentValuation - Current estimated valuation
   * @return {Object} - Improvement potential metrics
   */
  calculateImprovementPotential(overallScore, currentValuation) {
    // Calculate potential score improvement
    const maxScore = 100;
    const scorePotential = maxScore - overallScore;
    
    // Assume each 10 points of score improvement increases valuation by 5%
    const valuationImprovement = currentValuation * (scorePotential / 10) * 0.05;
    
    return {
      scorePotential: scorePotential,
      valuationImprovement: valuationImprovement,
      improvedValuation: currentValuation + valuationImprovement
    };
  }
  
  /**
   * Identify strengths based on dimension scores
   * @param {Object} dimensionScores - Scores for each dimension
   * @return {Array} - List of strengths
   */
  identifyStrengths(dimensionScores) {
    const strengths = [];
    
    // Find dimensions with scores >= 70
    Object.entries(dimensionScores).forEach(([dimension, score]) => {
      if (score >= 70) {
        strengths.push({
          dimension: dimension,
          score: score,
          label: this.getDimensionLabel(dimension)
        });
      }
    });
    
    // Sort by score (highest first)
    return strengths.sort((a, b) => b.score - a.score);
  }
  
  /**
   * Identify weaknesses based on dimension scores
   * @param {Object} dimensionScores - Scores for each dimension
   * @return {Array} - List of weaknesses
   */
  identifyWeaknesses(dimensionScores) {
    const weaknesses = [];
    
    // Find dimensions with scores <= 50
    Object.entries(dimensionScores).forEach(([dimension, score]) => {
      if (score <= 50) {
        weaknesses.push({
          dimension: dimension,
          score: score,
          label: this.getDimensionLabel(dimension)
        });
      }
    });
    
    // Sort by score (lowest first)
    return weaknesses.sort((a, b) => a.score - b.score);
  }
  
  /**
   * Get user-friendly label for dimension
   * @param {string} dimension - Dimension ID
   * @return {string} - Formatted dimension label
   */
  getDimensionLabel(dimension) {
    const labels = {
      financial: "Financial Health",
      business: "Business Operations",
      service: "Service Delivery",
      market: "Market Position"
    };
    
    return labels[dimension] || dimension;
  }
  
  /**
   * Find a question by its ID
   * @param {string} questionId - Question ID to find
   * @return {Object|null} - Question object or null if not found
   */
  findQuestionById(questionId) {
    // Simple stub implementation
    return {
      id: questionId,
      dimension: "financial" // Default dimension for stub
    };
  }
}

// Export as ES6 module
export { AgencyScoringEngine };

// Also maintain browser global for backward compatibility during transition
window.AgencyScoringEngine = AgencyScoringEngine;
