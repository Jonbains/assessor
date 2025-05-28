/**
 * In-House Marketing AI Readiness Scoring System
 * Version 1.0 - Comprehensive Weighted Scoring for Internal Marketing Teams
 * 
 * This scoring system evaluates in-house marketing teams across three core dimensions:
 * - People & Skills (35%): Team AI capabilities, training, and adaptability
 * - Process & Infrastructure (35%): Systems, workflows, and operational maturity
 * - Strategy & Leadership (30%): Strategic vision, leadership support, and planning
 */

class InHouseMarketingScoring {
  constructor(config, assessmentType = 'inhouse-marketing') {
    this.config = config;
    this.assessmentType = assessmentType;
    
    // Core dimension weights based on research showing people and process equally critical
    this.dimensionWeights = {
      people_skills: 0.35,
      process_infrastructure: 0.35, 
      strategy_leadership: 0.30
    };
    
    // Industry-specific weight adjustments based on maturity and complexity
    this.industryWeightAdjustments = {
      b2b_saas: {
        people_skills: 0.30,      // Tech companies assume higher baseline skills
        process_infrastructure: 0.40, // Infrastructure critical for scalability
        strategy_leadership: 0.30
      },
      manufacturing: {
        people_skills: 0.40,      // Skills gap is primary barrier
        process_infrastructure: 0.30, // Simpler tech stack requirements
        strategy_leadership: 0.30
      },
      healthcare: {
        people_skills: 0.30,      // Compliance requirements moderate weight
        process_infrastructure: 0.40, // Regulatory compliance critical
        strategy_leadership: 0.30
      },
      financial_services: {
        people_skills: 0.30,      // Similar to healthcare
        process_infrastructure: 0.40, // Security and compliance paramount
        strategy_leadership: 0.30
      },
      ecommerce_retail: {
        people_skills: 0.35,      // Balanced requirements
        process_infrastructure: 0.35, // Real-time systems important
        strategy_leadership: 0.30
      }
    };
    
    // Activity impact weights based on AI disruption potential and ROI data
    this.activityImpactWeights = {
      content_marketing: 0.15,    // Very high AI impact, 5x productivity gains possible
      analytics_data: 0.15,       // High strategic value and AI enhancement
      seo_sem: 0.12,              // High automation potential, strong ROI
      paid_advertising: 0.12,     // Platform AI adoption critical
      social_media: 0.10,         // Moderate complexity, good automation potential
      email_marketing: 0.10,      // Established AI tools, proven ROI
      creative_design: 0.10,      // High AI impact but human oversight needed
      marketing_automation: 0.08, // Infrastructure play, foundational
      pr_communications: 0.05,    // Lower AI impact, relationship-dependent
      events_webinars: 0.03       // Lowest AI disruption potential
    };
    
    // Maturity benchmarks by industry (based on research data)
    this.industryBenchmarks = {
      b2b_saas: { average: 75, topQuartile: 90 },
      manufacturing: { average: 50, topQuartile: 70 },
      healthcare: { average: 55, topQuartile: 72 },
      financial_services: { average: 65, topQuartile: 85 },
      ecommerce_retail: { average: 70, topQuartile: 88 }
    };
  }
  
  /**
   * Calculate comprehensive assessment results
   * @param {Object} assessmentData - User's assessment responses
   * @returns {Object} - Complete scoring results with insights and recommendations
   */
  calculateResults(assessmentData) {
    try {
      console.log('[InHouseScoring] Calculating results for in-house marketing team');
      
      const industry = assessmentData.selectedIndustry || 'b2b_saas';
      const activities = assessmentData.selectedActivities || [];
      const answers = assessmentData.answers || {};
      
      // Calculate core dimension scores
      const dimensionScores = this.calculateDimensionScores(answers);
      console.log('[InHouseScoring] Dimension scores:', dimensionScores);
      
      // Calculate activity-specific scores
      const activityScores = this.calculateActivityScores(answers, activities);
      console.log('[InHouseScoring] Activity scores:', activityScores);
      
      // Calculate industry-adjusted overall score
      const overallScore = this.calculateOverallScore(dimensionScores, activityScores, industry);
      console.log('[InHouseScoring] Overall score:', overallScore);
      
      // Calculate readiness metrics
      const readinessMetrics = this.calculateReadinessMetrics(dimensionScores, activityScores, industry);
      
      // Generate insights and recommendations
      const insights = this.generateInsights(dimensionScores, activityScores, readinessMetrics, industry, activities);
      const recommendations = this.generateRecommendations(overallScore, dimensionScores, activityScores, industry, activities);
      const actionPlan = this.generateActionPlan(overallScore, readinessMetrics, industry);
      
      // Calculate ROI projections
      const roiProjections = this.calculateROIProjections(overallScore, dimensionScores, activities);
      
      // Determine readiness category
      const readinessCategory = this.determineReadinessCategory(overallScore, industry);
      
      return {
        scores: {
          overall: Math.round(overallScore),
          people_skills: Math.round(dimensionScores.people_skills),
          process_infrastructure: Math.round(dimensionScores.process_infrastructure),
          strategy_leadership: Math.round(dimensionScores.strategy_leadership),
          readiness: Math.round(readinessMetrics.overallReadiness),
          efficiency: Math.round(readinessMetrics.efficiencyPotential),
          innovation: Math.round(readinessMetrics.innovationCapability)
        },
        activityScores: activityScores,
        readinessCategory: readinessCategory,
        industryComparison: this.calculateIndustryComparison(overallScore, industry),
        insights: insights,
        recommendations: recommendations,
        actionPlan: actionPlan,
        roiProjections: roiProjections,
        selectedIndustry: industry,
        selectedActivities: activities,
        benchmarkData: this.industryBenchmarks[industry]
      };
      
    } catch (error) {
      console.error('[InHouseScoring] Error calculating results:', error);
      return this.getFallbackResults(assessmentData);
    }
  }
  
  /**
   * Calculate scores for core dimensions
   * @param {Object} answers - User's question responses
   * @returns {Object} - Dimension scores
   */
  calculateDimensionScores(answers) {
    const dimensionScores = {
      people_skills: 0,
      process_infrastructure: 0,
      strategy_leadership: 0
    };
    
    // Get questions by dimension from config
    const coreQuestions = this.config.coreQuestions || {};
    
    for (const [dimension, questions] of Object.entries(coreQuestions)) {
      if (!questions || !Array.isArray(questions)) continue;
      
      let totalWeightedScore = 0;
      let totalWeight = 0;
      
      questions.forEach(question => {
        const answer = answers[question.id];
        if (answer !== undefined) {
          const weight = question.weight || 1;
          const normalizedScore = (answer / 5) * 100; // Convert 0-5 to 0-100
          
          totalWeightedScore += normalizedScore * weight;
          totalWeight += weight;
        }
      });
      
      dimensionScores[dimension] = totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
    }
    
    return dimensionScores;
  }
  
  /**
   * Calculate scores for selected activities
   * @param {Object} answers - User's question responses
   * @param {Array} selectedActivities - Activities the team focuses on
   * @returns {Object} - Activity scores
   */
  calculateActivityScores(answers, selectedActivities) {
    const activityScores = {};
    const activityQuestions = this.config.activityQuestions || {};
    
    selectedActivities.forEach(activityId => {
      const questions = activityQuestions[activityId];
      if (!questions || !Array.isArray(questions)) {
        activityScores[activityId] = { score: 50, readiness: 'moderate' };
        return;
      }
      
      let totalWeightedScore = 0;
      let totalWeight = 0;
      
      questions.forEach(question => {
        const answer = answers[question.id];
        if (answer !== undefined) {
          const weight = question.weight || 1;
          const normalizedScore = (answer / 5) * 100;
          
          totalWeightedScore += normalizedScore * weight;
          totalWeight += weight;
        }
      });
      
      const activityScore = totalWeight > 0 ? totalWeightedScore / totalWeight : 50;
      
      activityScores[activityId] = {
        score: activityScore,
        readiness: this.determineActivityReadiness(activityScore),
        aiImpact: this.getActivityAIImpact(activityId),
        improvementPotential: this.calculateImprovementPotential(activityScore, activityId)
      };
    });
    
    return activityScores;
  }
  
  /**
   * Calculate industry-adjusted overall score
   * @param {Object} dimensionScores - Core dimension scores
   * @param {Object} activityScores - Activity-specific scores
   * @param {string} industry - Selected industry
   * @returns {number} - Overall weighted score
   */
  calculateOverallScore(dimensionScores, activityScores, industry) {
    // Get industry-specific weights
    const weights = this.industryWeightAdjustments[industry] || this.dimensionWeights;
    
    // Calculate weighted dimension score
    const weightedDimensionScore = 
      (dimensionScores.people_skills * weights.people_skills) +
      (dimensionScores.process_infrastructure * weights.process_infrastructure) +
      (dimensionScores.strategy_leadership * weights.strategy_leadership);
    
    // Calculate activity impact adjustment
    let activityImpactScore = 0;
    let totalActivityWeight = 0;
    
    Object.entries(activityScores).forEach(([activityId, scoreData]) => {
      const weight = this.activityImpactWeights[activityId] || 0.05;
      activityImpactScore += scoreData.score * weight;
      totalActivityWeight += weight;
    });
    
    // Normalize activity impact
    if (totalActivityWeight > 0) {
      activityImpactScore = activityImpactScore / totalActivityWeight;
    } else {
      activityImpactScore = 50; // Default if no activities
    }
    
    // Combine dimension score (70%) with activity impact (30%)
    const finalScore = (weightedDimensionScore * 0.7) + (activityImpactScore * 0.3);
    
    // Apply industry maturity adjustment
    const industryBenchmark = this.industryBenchmarks[industry];
    if (industryBenchmark) {
      // Adjust score relative to industry average
      const industryAdjustment = (finalScore / industryBenchmark.average) * 50 + 50;
      return Math.min(100, Math.max(0, industryAdjustment));
    }
    
    return Math.min(100, Math.max(0, finalScore));
  }
  
  /**
   * Calculate readiness metrics
   * @param {Object} dimensionScores - Core dimension scores
   * @param {Object} activityScores - Activity scores
   * @param {string} industry - Selected industry
   * @returns {Object} - Readiness metrics
   */
  calculateReadinessMetrics(dimensionScores, activityScores, industry) {
    // Overall readiness based on lowest dimension (weakest link principle)
    const minDimensionScore = Math.min(
      dimensionScores.people_skills,
      dimensionScores.process_infrastructure,
      dimensionScores.strategy_leadership
    );
    
    // Efficiency potential based on process maturity and AI-ready activities
    const highImpactActivities = Object.entries(activityScores).filter(
      ([activityId, data]) => this.activityImpactWeights[activityId] >= 0.10
    );
    
    const avgHighImpactScore = highImpactActivities.length > 0 
      ? highImpactActivities.reduce((sum, [, data]) => sum + data.score, 0) / highImpactActivities.length
      : 50;
    
    const efficiencyPotential = (dimensionScores.process_infrastructure * 0.6) + (avgHighImpactScore * 0.4);
    
    // Innovation capability based on people skills and strategy
    const innovationCapability = (dimensionScores.people_skills * 0.6) + (dimensionScores.strategy_leadership * 0.4);
    
    // Insourcing readiness based on skills and process maturity
    const insourcingReadiness = this.calculateInsourcingReadiness(dimensionScores, activityScores);
    
    return {
      overallReadiness: minDimensionScore,
      efficiencyPotential: efficiencyPotential,
      innovationCapability: innovationCapability,
      insourcingReadiness: insourcingReadiness,
      riskFactors: this.identifyRiskFactors(dimensionScores, activityScores, industry)
    };
  }
  
  /**
   * Calculate insourcing readiness for different marketing functions
   * @param {Object} dimensionScores - Core dimension scores
   * @param {Object} activityScores - Activity scores
   * @returns {Object} - Insourcing readiness by function
   */
  calculateInsourcingReadiness(dimensionScores, activityScores) {
    const functions = {
      content_creation: {
        requiredSkills: 70,
        requiredProcess: 60,
        currentReadiness: 0
      },
      social_media: {
        requiredSkills: 65,
        requiredProcess: 70,
        currentReadiness: 0
      },
      basic_design: {
        requiredSkills: 75,
        requiredProcess: 50,
        currentReadiness: 0
      },
      email_marketing: {
        requiredSkills: 60,
        requiredProcess: 80,
        currentReadiness: 0
      },
      paid_advertising: {
        requiredSkills: 80,
        requiredProcess: 75,
        currentReadiness: 0
      },
      analytics: {
        requiredSkills: 85,
        requiredProcess: 90,
        currentReadiness: 0
      }
    };
    
    // Calculate readiness for each function
    Object.keys(functions).forEach(functionKey => {
      const func = functions[functionKey];
      const skillsReadiness = dimensionScores.people_skills >= func.requiredSkills;
      const processReadiness = dimensionScores.process_infrastructure >= func.requiredProcess;
      
      // Calculate readiness percentage
      const skillsScore = Math.min(100, (dimensionScores.people_skills / func.requiredSkills) * 100);
      const processScore = Math.min(100, (dimensionScores.process_infrastructure / func.requiredProcess) * 100);
      
      func.currentReadiness = (skillsScore + processScore) / 2;
      func.ready = skillsReadiness && processReadiness;
    });
    
    return functions;
  }
  
  /**
   * Generate insights based on scoring results
   * @param {Object} dimensionScores - Core dimension scores
   * @param {Object} activityScores - Activity scores
   * @param {Object} readinessMetrics - Readiness metrics
   * @param {string} industry - Selected industry
   * @param {Array} activities - Selected activities
   * @returns {Array} - Array of insight strings
   */
  generateInsights(dimensionScores, activityScores, readinessMetrics, industry, activities) {
    const insights = [];
    
    // Dimension-specific insights
    if (dimensionScores.people_skills >= 80) {
      insights.push("Strong AI skills foundation positions your team as an early adopter");
    } else if (dimensionScores.people_skills < 40) {
      insights.push("Critical AI skills gap requires immediate training investment");
    }
    
    if (dimensionScores.process_infrastructure >= 75) {
      insights.push("Mature process infrastructure enables rapid AI scaling");
    } else if (dimensionScores.process_infrastructure < 45) {
      insights.push("Process infrastructure gaps may limit AI implementation success");
    }
    
    if (dimensionScores.strategy_leadership >= 75) {
      insights.push("Strong leadership support provides foundation for AI transformation");
    } else if (dimensionScores.strategy_leadership < 45) {
      insights.push("Limited strategic planning may slow AI adoption progress");
    }
    
    // Activity-specific insights
    const highPerformingActivities = Object.entries(activityScores)
      .filter(([, data]) => data.score >= 70)
      .map(([id]) => this.getActivityName(id));
    
    const lowPerformingActivities = Object.entries(activityScores)
      .filter(([, data]) => data.score < 40)
      .map(([id]) => this.getActivityName(id));
    
    if (highPerformingActivities.length > 0) {
      insights.push(`AI-ready activities: ${highPerformingActivities.join(', ')}`);
    }
    
    if (lowPerformingActivities.length > 0) {
      insights.push(`Priority development areas: ${lowPerformingActivities.join(', ')}`);
    }
    
    // Industry-specific insights
    const benchmark = this.industryBenchmarks[industry];
    const overallScore = this.calculateOverallScore(dimensionScores, activityScores, industry);
    
    if (overallScore > benchmark.topQuartile) {
      insights.push(`Top-quartile performance in ${this.getIndustryName(industry)} sector`);
    } else if (overallScore < benchmark.average) {
      insights.push(`Below industry average - significant improvement opportunity`);
    }
    
    // Insourcing insights
    const readyFunctions = Object.entries(readinessMetrics.insourcingReadiness)
      .filter(([, data]) => data.ready)
      .map(([func]) => func.replace('_', ' '));
    
    if (readyFunctions.length >= 3) {
      insights.push(`Ready to insource: ${readyFunctions.slice(0, 3).join(', ')}`);
    }
    
    return insights;
  }
  
  /**
   * Generate recommendations based on scores and industry
   * @param {number} overallScore - Overall assessment score
   * @param {Object} dimensionScores - Core dimension scores
   * @param {Object} activityScores - Activity scores
   * @param {string} industry - Selected industry
   * @param {Array} activities - Selected activities
   * @returns {Array} - Array of recommendation objects
   */
  generateRecommendations(overallScore, dimensionScores, activityScores, industry, activities) {
    const recommendations = [];
    
    // Determine score category
    const scoreCategory = overallScore < 40 ? 'lowScore' : overallScore < 70 ? 'midScore' : 'highScore';
    
    // People & Skills recommendations
    if (dimensionScores.people_skills < 60) {
      recommendations.push({
        category: 'People & Skills',
        priority: 'HIGH',
        title: 'Implement Comprehensive AI Training Program',
        description: 'Develop structured AI literacy and tool training for entire marketing team',
        expectedROI: 'Foundation for all AI initiatives - 2-3x productivity gains possible',
        timeline: '6-12 weeks',
        investment: '$5,000-15,000'
      });
    } else if (dimensionScores.people_skills < 80) {
      recommendations.push({
        category: 'People & Skills',
        priority: 'MEDIUM',
        title: 'Advanced AI Specialization Training',
        description: 'Develop AI champions and specialized skills in key team members',
        expectedROI: 'Enhanced capability and faster AI adoption',
        timeline: '8-16 weeks',
        investment: '$8,000-25,000'
      });
    }
    
    // Process & Infrastructure recommendations
    if (dimensionScores.process_infrastructure < 60) {
      recommendations.push({
        category: 'Process & Infrastructure',
        priority: 'HIGH',
        title: 'Establish AI-Ready Marketing Stack',
        description: 'Integrate AI tools with existing marketing technology and create unified data flows',
        expectedROI: '40-60% efficiency improvement in marketing operations',
        timeline: '8-16 weeks',
        investment: '$15,000-50,000'
      });
    }
    
    // Strategy & Leadership recommendations
    if (dimensionScores.strategy_leadership < 60) {
      recommendations.push({
        category: 'Strategy & Leadership',
        priority: 'HIGH',
        title: 'Develop AI Marketing Strategy',
        description: 'Create comprehensive AI roadmap with executive buy-in and clear milestones',
        expectedROI: 'Coordinated AI investment with measurable business impact',
        timeline: '4-8 weeks',
        investment: '$5,000-15,000'
      });
    }
    
    // Activity-specific recommendations
    const lowScoringActivities = Object.entries(activityScores)
      .filter(([, data]) => data.score < 50)
      .sort(([, a], [, b]) => b.improvementPotential - a.improvementPotential)
      .slice(0, 2);
    
    lowScoringActivities.forEach(([activityId, data]) => {
      const activityRecs = this.getActivityRecommendations(activityId, scoreCategory);
      if (activityRecs && activityRecs.length > 0) {
        recommendations.push({
          category: this.getActivityName(activityId),
          priority: 'MEDIUM',
          ...activityRecs[0]
        });
      }
    });
    
    // Industry-specific recommendations
    const industryRecs = this.getIndustryRecommendations(industry, scoreCategory);
    if (industryRecs && industryRecs.length > 0) {
      recommendations.push({
        category: `${this.getIndustryName(industry)} Focus`,
        priority: 'MEDIUM',
        ...industryRecs[0]
      });
    }
    
    return recommendations.slice(0, 6); // Limit to top 6 recommendations
  }
  
  /**
   * Generate action plan based on overall score and readiness
   * @param {number} overallScore - Overall assessment score
   * @param {Object} readinessMetrics - Readiness metrics
   * @param {string} industry - Selected industry
   * @returns {Array} - Action plan items
   */
  generateActionPlan(overallScore, readinessMetrics, industry) {
    const actionPlan = [];
    
    if (overallScore < 40) {
      // Foundation building phase
      actionPlan.push({
        phase: 'Foundation (0-3 months)',
        title: 'Establish AI Readiness Foundation',
        description: 'Focus on team training, basic tool adoption, and process documentation',
        keyActions: [
          'Complete AI literacy training for entire team',
          'Implement 2-3 basic AI tools (ChatGPT, email AI, basic analytics)',
          'Document current processes and identify automation opportunities',
          'Secure leadership buy-in and budget for AI initiatives'
        ],
        expectedOutcome: 'Team prepared for AI adoption with clear improvement roadmap'
      });
      
      actionPlan.push({
        phase: 'Development (3-9 months)',
        title: 'Build Core AI Capabilities',
        description: 'Implement integrated AI tools and optimize key marketing processes',
        keyActions: [
          'Deploy comprehensive AI marketing stack',
          'Automate 3-5 routine marketing processes',
          'Begin insourcing 1-2 marketing functions',
          'Establish AI governance and quality controls'
        ],
        expectedOutcome: '30-50% improvement in marketing efficiency'
      });
      
    } else if (overallScore < 70) {
      // Acceleration phase
      actionPlan.push({
        phase: 'Acceleration (0-6 months)',
        title: 'Scale AI Implementation',
        description: 'Optimize existing AI tools and expand to advanced capabilities',
        keyActions: [
          'Optimize current AI workflows for maximum efficiency',
          'Implement advanced AI tools (predictive analytics, personalization)',
          'Launch AI-enhanced campaign strategies',
          'Develop AI ROI measurement framework'
        ],
        expectedOutcome: '50-80% improvement in marketing effectiveness'
      });
      
    } else {
      // Innovation phase
      actionPlan.push({
        phase: 'Innovation (0-12 months)',
        title: 'AI Marketing Leadership',
        description: 'Establish competitive advantage through advanced AI capabilities',
        keyActions: [
          'Develop proprietary AI models and workflows',
          'Create AI-powered marketing innovations',
          'Establish thought leadership in AI marketing',
          'Mentor other teams in AI adoption'
        ],
        expectedOutcome: 'Market-leading AI marketing capabilities and competitive advantage'
      });
    }
    
    return actionPlan;
  }
  
  /**
   * Calculate ROI projections based on scores and activities
   * @param {number} overallScore - Overall assessment score
   * @param {Object} dimensionScores - Core dimension scores
   * @param {Array} activities - Selected activities
   * @returns {Object} - ROI projections
   */
  calculateROIProjections(overallScore, dimensionScores, activities) {
    // Base efficiency improvements by activity (based on research data)
    const activityROIMultipliers = {
      content_marketing: 3.5,     // 3-5x productivity improvement
      social_media: 2.5,          // 2-3x content output
      email_marketing: 2.0,       // 2x campaign efficiency
      analytics_data: 4.0,        // 4x faster insights
      creative_design: 3.0,       // 3x design output
      seo_sem: 2.0,               // 2x optimization speed
      paid_advertising: 1.5,      // 1.5x campaign performance
      marketing_automation: 2.5,  // 2.5x workflow efficiency
      pr_communications: 1.3,     // 1.3x process efficiency
      events_webinars: 1.2        // 1.2x planning efficiency
    };
    
    // Calculate potential efficiency gains
    let weightedEfficiencyGain = 0;
    let totalWeight = 0;
    
    activities.forEach(activityId => {
      const multiplier = activityROIMultipliers[activityId] || 1.5;
      const weight = this.activityImpactWeights[activityId] || 0.05;
      
      weightedEfficiencyGain += multiplier * weight;
      totalWeight += weight;
    });
    
    const avgEfficiencyMultiplier = totalWeight > 0 ? weightedEfficiencyGain / totalWeight : 2.0;
    
    // Adjust based on readiness score
    const readinessAdjustment = Math.min(1.0, overallScore / 100);
    const adjustedMultiplier = 1 + ((avgEfficiencyMultiplier - 1) * readinessAdjustment);
    
    // Calculate cost savings and revenue impact
    const teamSize = 5; // Assume 5-person marketing team
    const avgSalary = 75000; // Average marketing salary
    const totalLaborCost = teamSize * avgSalary;
    
    const efficiencyGainPercent = (adjustedMultiplier - 1) * 100;
    const laborSavings = totalLaborCost * (adjustedMultiplier - 1) / adjustedMultiplier;
    
    // Revenue impact (conservative estimate)
    const revenueImpact = laborSavings * 3; // 3:1 marketing ROI assumption
    
    return {
      efficiencyMultiplier: adjustedMultiplier,
      efficiencyGainPercent: Math.round(efficiencyGainPercent),
      annualLaborSavings: Math.round(laborSavings),
      annualRevenueImpact: Math.round(revenueImpact),
      paybackPeriod: '3-6 months',
      confidenceLevel: overallScore >= 70 ? 'High' : overallScore >= 50 ? 'Medium' : 'Low'
    };
  }
  
  /**
   * Determine readiness category based on score and industry
   * @param {number} overallScore - Overall assessment score
   * @param {string} industry - Selected industry
   * @returns {string} - Readiness category
   */
  determineReadinessCategory(overallScore, industry) {
    const benchmark = this.industryBenchmarks[industry];
    
    if (overallScore >= benchmark.topQuartile) {
      return 'AI Marketing Leader';
    } else if (overallScore >= benchmark.average) {
      return 'AI Ready';
    } else if (overallScore >= 40) {
      return 'Developing AI Capabilities';
    } else {
      return 'AI Foundations Needed';
    }
  }
  
  /**
   * Calculate industry comparison
   * @param {number} overallScore - Overall assessment score  
   * @param {string} industry - Selected industry
   * @returns {Object} - Industry comparison data
   */
  calculateIndustryComparison(overallScore, industry) {
    const benchmark = this.industryBenchmarks[industry];
    
    return {
      industryAverage: benchmark.average,
      topQuartile: benchmark.topQuartile,
      percentileRank: this.calculatePercentile(overallScore, benchmark),
      comparison: overallScore >= benchmark.topQuartile ? 'Top Performer' :
                 overallScore >= benchmark.average ? 'Above Average' :
                 overallScore >= 40 ? 'Below Average' : 'Significant Gap'
    };
  }
  
  // Helper methods
  
  calculatePercentile(score, benchmark) {
    if (score >= benchmark.topQuartile) return 90;
    if (score >= benchmark.average) return 65;
    if (score >= 40) return 35;
    return 15;
  }
  
  determineActivityReadiness(score) {
    if (score >= 80) return 'advanced';
    if (score >= 60) return 'intermediate';
    if (score >= 40) return 'basic';
    return 'beginner';
  }
  
  getActivityAIImpact(activityId) {
    const impactMap = {
      content_marketing: 'Very High',
      analytics_data: 'Very High',
      creative_design: 'Very High',
      seo_sem: 'High',
      paid_advertising: 'High',
      social_media: 'High',
      email_marketing: 'High',
      marketing_automation: 'High',
      pr_communications: 'Moderate',
      events_webinars: 'Moderate'
    };
    return impactMap[activityId] || 'Moderate';
  }
  
  calculateImprovementPotential(score, activityId) {
    const baseImpact = this.activityImpactWeights[activityId] || 0.05;
    const gapSize = 100 - score;
    return (gapSize / 100) * baseImpact * 100;
  }
  
  getActivityName(activityId) {
    const nameMap = {
      content_marketing: 'Content Marketing',
      social_media: 'Social Media',
      seo_sem: 'SEO/SEM',
      email_marketing: 'Email Marketing',
      analytics_data: 'Analytics & Data',
      paid_advertising: 'Paid Advertising',
      creative_design: 'Creative & Design',
      marketing_automation: 'Marketing Automation',
      pr_communications: 'PR & Communications',
      events_webinars: 'Events & Webinars'
    };
    return nameMap[activityId] || activityId;
  }
  
  getIndustryName(industryId) {
    const nameMap = {
      b2b_saas: 'B2B SaaS',
      manufacturing: 'Manufacturing',
      healthcare: 'Healthcare',
      financial_services: 'Financial Services',
      ecommerce_retail: 'E-commerce/Retail'
    };
    return nameMap[industryId] || industryId;
  }
  
  getActivityRecommendations(activityId, scoreCategory) {
    // Simplified recommendations - in practice would reference full recommendations config
    const recs = {
      content_marketing: {
        lowScore: [{ title: 'Implement AI Content Creation Tools', description: 'Start with ChatGPT/Claude for content generation' }],
        midScore: [{ title: 'Advanced Content AI Integration', description: 'Implement comprehensive content AI workflow' }],
        highScore: [{ title: 'AI Content Innovation', description: 'Develop proprietary content AI capabilities' }]
      }
    };
    
    return recs[activityId] ? recs[activityId][scoreCategory] : [];
  }
  
  getIndustryRecommendations(industry, scoreCategory) {
    // Simplified industry recommendations
    const recs = {
      b2b_saas: {
        lowScore: [{ title: 'SaaS AI Foundation', description: 'Focus on customer lifecycle AI and product-led growth optimization' }]
      }
    };
    
    return recs[industry] ? recs[industry][scoreCategory] : [];
  }
  
  identifyRiskFactors(dimensionScores, activityScores, industry) {
    const risks = [];
    
    if (dimensionScores.people_skills < 40) {
      risks.push('Skills Gap Risk: Limited AI expertise may slow implementation');
    }
    
    if (dimensionScores.process_infrastructure < 40) {
      risks.push('Infrastructure Risk: Weak processes may limit AI scaling');
    }
    
    if (dimensionScores.strategy_leadership < 40) {
      risks.push('Strategic Risk: Lack of leadership support may undermine initiatives');
    }
    
    const lowScoringActivities = Object.entries(activityScores)
      .filter(([, data]) => data.score < 30)
      .length;
    
    if (lowScoringActivities >= 3) {
      risks.push('Capability Risk: Multiple weak activity areas need attention');
    }
    
    return risks;
  }
  
  /**
   * Get fallback results when calculation fails
   * @param {Object} assessmentData - Assessment data
   * @returns {Object} - Fallback results
   */
  getFallbackResults(assessmentData) {
    return {
      scores: {
        overall: 50,
        people_skills: 50,
        process_infrastructure: 50,
        strategy_leadership: 50,
        readiness: 50,
        efficiency: 50,
        innovation: 50
      },
      activityScores: {},
      readinessCategory: 'Assessment Error',
      industryComparison: { industryAverage: 50, topQuartile: 70, percentileRank: 50, comparison: 'Unknown' },
      insights: ['Assessment calculation error - please try again'],
      recommendations: [{ title: 'Assessment Error', description: 'There was an error processing your assessment. Please try again.' }],
      actionPlan: [],
      roiProjections: { efficiencyMultiplier: 1, efficiencyGainPercent: 0, annualLaborSavings: 0, annualRevenueImpact: 0 },
      selectedIndustry: assessmentData.selectedIndustry || 'unknown',
      selectedActivities: assessmentData.selectedActivities || []
    };
  }
}

// Make available globally
window.InHouseMarketingScoring = InHouseMarketingScoring;