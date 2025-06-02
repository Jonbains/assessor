/**
 * Agency Transformation Scoring Engine
 * 
 * Calculates both transformation readiness and valuation metrics
 * from the same set of positively-framed questions
 */

export class AgencyTransformationScoring {
  constructor(config = {}) {
    this.config = config;
    
    // Dimension weights for overall score
    this.transformationWeights = {
      transformation: 0.25,
      resources: 0.20,
      leadership: 0.20,
      change: 0.35
    };
    
    // Valuation dimension mapping
    this.valuationWeights = {
      financial: 0.35,
      operational: 0.30,
      strategic: 0.20,
      ai: 0.15
    };
    
    // Service vulnerability baseline scores
    this.serviceVulnerability = {
      content_creation: 85,
      seo_sem: 80,
      digital_marketing: 75,
      creative_design: 65,
      pr_comms: 60,
      video_production: 55,
      strategy_consulting: 35
    };
  }

  /**
   * Main scoring method
   * @param {Object} answers - All question answers
   * @param {Object} metadata - Agency size, type, selected services, etc.
   * @returns {Object} Complete scoring results
   */
  calculateScores(answers, metadata) {
    const { selectedServices = [], agencySize, revenue, agencyType } = metadata;
    
    // Calculate core dimension scores
    const dimensionScores = this.calculateDimensionScores(answers);
    
    // Map to valuation dimensions
    const valuationDimensions = this.calculateValuationDimensions(answers, dimensionScores);
    
    // Calculate service-specific scores
    const serviceScores = this.calculateServiceScores(answers, selectedServices);
    
    // Calculate aggregate metrics
    const serviceVulnerability = this.calculateOverallServiceVulnerability(serviceScores, selectedServices);
    const serviceAdaptability = this.calculateServiceAdaptability(serviceScores);
    
    // Calculate transformation readiness score
    const transformationScore = this.calculateTransformationScore(dimensionScores);
    
    // Calculate valuation score
    const valuationScore = this.calculateValuationScore(valuationDimensions, serviceVulnerability);
    
    // Calculate overall score (balanced view)
    const overallScore = (transformationScore * 0.6) + (valuationScore * 0.4);
    
    // Determine categories
    const readinessCategory = this.getReadinessCategory(transformationScore);
    const valuationCategory = this.getValuationCategory(valuationScore);
    
    // Extract key insights
    const keyInsights = this.extractKeyInsights(dimensionScores, valuationDimensions, serviceScores, answers);
    
    // Calculate specific risk factors for valuation
    const riskFactors = this.calculateRiskFactors(answers, serviceScores);
    
    return {
      overall: Math.round(overallScore),
      transformation: Math.round(transformationScore),
      valuation: Math.round(valuationScore),
      
      dimensions: {
        transformation: Math.round(dimensionScores.transformation),
        resources: Math.round(dimensionScores.resources),
        leadership: Math.round(dimensionScores.leadership),
        change: Math.round(dimensionScores.change)
      },
      
      valuationDimensions: {
        financial: Math.round(valuationDimensions.financial),
        operational: Math.round(valuationDimensions.operational),
        strategic: Math.round(valuationDimensions.strategic),
        ai: Math.round(valuationDimensions.ai)
      },
      
      serviceScores: serviceScores,
      serviceVulnerability: Math.round(serviceVulnerability),
      serviceAdaptability: Math.round(serviceAdaptability),
      
      categories: {
        readiness: readinessCategory,
        valuation: valuationCategory
      },
      
      riskFactors: riskFactors,
      keyInsights: keyInsights,
      
      metadata: {
        agencySize,
        revenue,
        agencyType,
        selectedServices,
        questionCount: Object.keys(answers).length,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Calculate dimension scores from answers
   */
  calculateDimensionScores(answers) {
    const dimensions = {
      transformation: [],
      resources: [],
      leadership: [],
      change: []
    };
    
    // Group answers by dimension
    Object.entries(answers).forEach(([questionId, answer]) => {
      // Extract dimension from question ID prefix
      let dimension;
      if (questionId.startsWith('tc_')) dimension = 'transformation';
      else if (questionId.startsWith('rc_')) dimension = 'resources';
      else if (questionId.startsWith('lc_')) dimension = 'leadership';
      else if (questionId.startsWith('cr_')) dimension = 'change';
      
      if (dimension && dimensions[dimension]) {
        // Handle both simple scores and answer objects
        const score = typeof answer === 'object' ? (answer.score || 0) : answer;
        dimensions[dimension].push(score);
      }
    });
    
    // Calculate average for each dimension
    const dimensionScores = {};
    Object.entries(dimensions).forEach(([dimension, scores]) => {
      if (scores.length > 0) {
        const sum = scores.reduce((a, b) => a + b, 0);
        // Convert 1-5 scale to 0-100
        dimensionScores[dimension] = (sum / scores.length - 1) * 25;
      } else {
        dimensionScores[dimension] = 50; // Default if no questions answered
      }
    });
    
    return dimensionScores;
  }

  /**
   * Map transformation questions to valuation dimensions
   */
  calculateValuationDimensions(answers, dimensionScores) {
    const valuationDimensions = {
      financial: 0,
      operational: 0,
      strategic: 0,
      ai: 0
    };
    
    // Financial health indicators
    const financialQuestions = ['rc_1', 'rc_4', 'lc_4', 'cr_6'];
    const financialScores = financialQuestions
      .map(q => answers[q]?.score || answers[q] || 0)
      .filter(s => s > 0);
    
    if (financialScores.length > 0) {
      valuationDimensions.financial = ((financialScores.reduce((a, b) => a + b, 0) / financialScores.length) - 1) * 25;
    }
    
    // Operational excellence indicators
    const operationalQuestions = ['tc_2', 'tc_4', 'rc_2', 'lc_2', 'cr_1', 'cr_4'];
    const operationalScores = operationalQuestions
      .map(q => answers[q]?.score || answers[q] || 0)
      .filter(s => s > 0);
    
    if (operationalScores.length > 0) {
      valuationDimensions.operational = ((operationalScores.reduce((a, b) => a + b, 0) / operationalScores.length) - 1) * 25;
    }
    
    // Strategic position indicators
    const strategicQuestions = ['tc_5', 'lc_1', 'lc_3', 'lc_5', 'cr_3'];
    const strategicScores = strategicQuestions
      .map(q => answers[q]?.score || answers[q] || 0)
      .filter(s => s > 0);
    
    if (strategicScores.length > 0) {
      valuationDimensions.strategic = ((strategicScores.reduce((a, b) => a + b, 0) / strategicScores.length) - 1) * 25;
    }
    
    // AI capability is transformation score + specific AI questions
    valuationDimensions.ai = (dimensionScores.transformation * 0.7) + 
                            ((answers.cr_2?.score || answers.cr_2 || 3) - 1) * 25 * 0.3;
    
    return valuationDimensions;
  }

  /**
   * Calculate service-specific scores
   */
  calculateServiceScores(answers, selectedServices) {
    const serviceScores = {};
    
    selectedServices.forEach(service => {
      const serviceQuestions = Object.entries(answers)
        .filter(([questionId]) => questionId.startsWith(service.substring(0, 4)))
        .map(([_, answer]) => typeof answer === 'object' ? answer.score : answer);
      
      if (serviceQuestions.length > 0) {
        const avgScore = serviceQuestions.reduce((a, b) => a + b, 0) / serviceQuestions.length;
        const normalizedScore = ((avgScore - 1) / 4) * 100;
        
        // Get AI opportunity score specifically
        const aiOpportunityQuestion = answers[`${service.substring(0, 7)}_5`];
        const aiOpportunity = aiOpportunityQuestion ? 
          ((aiOpportunityQuestion.score || aiOpportunityQuestion || 3) - 1) * 25 : 50;
        
        serviceScores[service] = {
          score: Math.round(normalizedScore),
          vulnerability: this.serviceVulnerability[service] || 50,
          adaptability: Math.round(100 - this.serviceVulnerability[service] + (normalizedScore * 0.3)),
          aiOpportunity: Math.round(aiOpportunity),
          readiness: normalizedScore > 60 ? 'high' : normalizedScore > 40 ? 'medium' : 'low'
        };
      }
    });
    
    return serviceScores;
  }

  /**
   * Calculate overall service vulnerability (weighted by importance)
   */
  calculateOverallServiceVulnerability(serviceScores, selectedServices) {
    if (selectedServices.length === 0) return 50;
    
    let totalVulnerability = 0;
    let totalWeight = 0;
    
    selectedServices.forEach(service => {
      const score = serviceScores[service];
      if (score) {
        // Services with lower readiness scores are weighted more heavily
        const weight = score.readiness === 'low' ? 1.5 : score.readiness === 'medium' ? 1.0 : 0.7;
        totalVulnerability += score.vulnerability * weight;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? totalVulnerability / totalWeight : 50;
  }

  /**
   * Calculate service adaptability score
   */
  calculateServiceAdaptability(serviceScores) {
    const adaptabilityScores = Object.values(serviceScores)
      .map(s => s.adaptability)
      .filter(s => s !== undefined);
    
    if (adaptabilityScores.length === 0) return 50;
    
    return adaptabilityScores.reduce((a, b) => a + b, 0) / adaptabilityScores.length;
  }

  /**
   * Calculate transformation readiness score
   */
  calculateTransformationScore(dimensionScores) {
    let weightedSum = 0;
    let totalWeight = 0;
    
    Object.entries(this.transformationWeights).forEach(([dimension, weight]) => {
      if (dimensionScores[dimension] !== undefined) {
        weightedSum += dimensionScores[dimension] * weight;
        totalWeight += weight;
      }
    });
    
    return totalWeight > 0 ? weightedSum / totalWeight : 50;
  }

  /**
   * Calculate valuation score
   */
  calculateValuationScore(valuationDimensions, serviceVulnerability) {
    let weightedSum = 0;
    let totalWeight = 0;
    
    Object.entries(this.valuationWeights).forEach(([dimension, weight]) => {
      if (valuationDimensions[dimension] !== undefined) {
        weightedSum += valuationDimensions[dimension] * weight;
        totalWeight += weight;
      }
    });
    
    const baseScore = totalWeight > 0 ? weightedSum / totalWeight : 50;
    
    // Adjust for service vulnerability (high vulnerability reduces valuation)
    const vulnerabilityAdjustment = (100 - serviceVulnerability) * 0.2;
    
    return baseScore * 0.8 + vulnerabilityAdjustment;
  }

  /**
   * Determine readiness category
   */
  getReadinessCategory(score) {
    if (score >= 75) return { level: 'high', label: 'Transformation Leader', color: '#00AA00' };
    if (score >= 60) return { level: 'good', label: 'Well Positioned', color: '#88CC00' };
    if (score >= 40) return { level: 'moderate', label: 'Getting Ready', color: '#FFAA00' };
    if (score >= 25) return { level: 'low', label: 'Early Stage', color: '#FF8800' };
    return { level: 'critical', label: 'Urgent Action Needed', color: '#FF4444' };
  }

  /**
   * Determine valuation category
   */
  getValuationCategory(score) {
    if (score >= 75) return { 
      level: 'premium', 
      label: 'Premium Valuation', 
      multiple: '6-8x EBITDA',
      color: '#00AA00' 
    };
    if (score >= 60) return { 
      level: 'strong', 
      label: 'Strong Valuation', 
      multiple: '5-6x EBITDA',
      color: '#88CC00' 
    };
    if (score >= 40) return { 
      level: 'average', 
      label: 'Market Valuation', 
      multiple: '3.5-5x EBITDA',
      color: '#FFAA00' 
    };
    if (score >= 25) return { 
      level: 'below', 
      label: 'Below Market', 
      multiple: '2.5-3.5x EBITDA',
      color: '#FF8800' 
    };
    return { 
      level: 'distressed', 
      label: 'Distressed', 
      multiple: '1-2.5x EBITDA',
      color: '#FF4444' 
    };
  }

  /**
   * Calculate specific risk factors
   */
  calculateRiskFactors(answers, serviceScores) {
    const risks = [];
    
    // Client concentration risk
    const clientConcentration = answers.cr_6?.score || answers.cr_6 || 3;
    if (clientConcentration <= 2) {
      risks.push({
        factor: 'Client Concentration',
        severity: 'high',
        impact: '-1.0x multiple',
        description: 'Major client represents >30% of revenue'
      });
    }
    
    // Revenue predictability risk
    const revenuePredictability = answers.rc_4?.score || answers.rc_4 || 3;
    if (revenuePredictability <= 2) {
      risks.push({
        factor: 'Revenue Volatility',
        severity: 'high',
        impact: '-0.5x multiple',
        description: 'Unpredictable project-based revenue'
      });
    }
    
    // Key person dependency
    const keyPerson = answers.cr_4?.score || answers.cr_4 || 3;
    if (keyPerson <= 2) {
      risks.push({
        factor: 'Key Person Risk',
        severity: 'medium',
        impact: '-0.5x multiple',
        description: 'Critical knowledge not documented'
      });
    }
    
    // Service vulnerability
    const highVulnerabilityServices = Object.entries(serviceScores)
      .filter(([_, score]) => score.vulnerability > 75)
      .map(([service]) => service);
    
    if (highVulnerabilityServices.length > 0) {
      risks.push({
        factor: 'Service Disruption',
        severity: 'high',
        impact: '-0.5-1.0x multiple',
        description: `High AI vulnerability in ${highVulnerabilityServices.join(', ')}`
      });
    }
    
    // AI readiness gap
    const aiReadiness = answers.cr_2?.score || answers.cr_2 || 3;
    if (aiReadiness <= 2) {
      risks.push({
        factor: 'Technology Gap',
        severity: 'medium',
        impact: '-0.5x multiple',
        description: 'Limited AI adoption vs competitors'
      });
    }
    
    return risks;
  }

  /**
   * Extract key insights from scores
   */
  extractKeyInsights(dimensionScores, valuationDimensions, serviceScores, answers) {
    const insights = [];
    
    // Transformation insights
    if (dimensionScores.transformation > 70) {
      insights.push({
        type: 'strength',
        message: 'Strong AI foundation positions you ahead of 80% of agencies'
      });
    } else if (dimensionScores.transformation < 40) {
      insights.push({
        type: 'risk',
        message: 'Limited AI adoption creates immediate competitive risk'
      });
    }
    
    // Resource insights
    if (dimensionScores.resources > 60) {
      insights.push({
        type: 'strength',
        message: 'Available resources enable rapid transformation'
      });
    } else if (dimensionScores.resources < 30) {
      insights.push({
        type: 'constraint',
        message: 'Resource constraints require phased approach'
      });
    }
    
    // Leadership insights
    if (dimensionScores.leadership > 70) {
      insights.push({
        type: 'strength',
        message: 'Leadership alignment accelerates AI adoption'
      });
    } else if (dimensionScores.leadership < 40) {
      insights.push({
        type: 'risk',
        message: 'Leadership buy-in critical for transformation success'
      });
    }
    
    // Service insights
    const serviceReadiness = Object.values(serviceScores)
      .filter(s => s.readiness === 'high').length;
    
    if (serviceReadiness > 0) {
      insights.push({
        type: 'opportunity',
        message: `${serviceReadiness} service(s) ready for immediate AI enhancement`
      });
    }
    
    // Valuation insights
    if (valuationDimensions.financial > 70 && valuationDimensions.operational > 70) {
      insights.push({
        type: 'strength',
        message: 'Strong fundamentals support premium valuation with AI transformation'
      });
    }
    
    // Quick win identification
    const quickWinServices = Object.entries(serviceScores)
      .filter(([_, score]) => score.aiOpportunity > 75)
      .map(([service]) => service);
    
    if (quickWinServices.length > 0) {
      insights.push({
        type: 'opportunity',
        message: `Quick wins available in ${quickWinServices[0]} - start here`
      });
    }
    
    return insights;
  }

  /**
   * Calculate EBITDA multiple estimate
   */
  calculateEBITDAMultiple(valuationScore, riskFactors) {
    // Base multiple from valuation score
    let multiple = 1.0 + (valuationScore / 100) * 7; // 1-8x range
    
    // Apply risk factor adjustments
    riskFactors.forEach(risk => {
      const impact = parseFloat(risk.impact.match(/-?[\d.]+/)?.[0] || 0);
      multiple += impact;
    });
    
    // Ensure reasonable bounds
    return Math.max(1.0, Math.min(10.0, multiple));
  }
}

// Export for use in assessment system
export default AgencyTransformationScoring;