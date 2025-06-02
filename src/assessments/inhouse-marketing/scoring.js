/**
 * In-House Marketing Scoring Engine
 * 
 * Calculates readiness scores for in-house marketing teams
 * considering their unique constraints and opportunities
 */

export class InhouseMarketingScoring {
    constructor(config = {}) {
      this.config = config;
      
      // Dimension weights for overall score
      this.dimensionWeights = {
        humanReadiness: 0.4,      // Champions, leadership, resources
        technicalReadiness: 0.3,   // Current capabilities
        activityAutomation: 0.3    // Potential in their activities
      };
      
      // Category weights within dimensions
      this.categoryWeights = {
        champions: 0.35,
        resources: 0.30,
        leadership: 0.35,
        readiness: 1.0  // Single category for technical
      };
      
      // Company size modifiers
      this.sizeModifiers = {
        solo: {
          scoreBoost: 1.1,        // Solo marketers get boost for any progress
          timeValue: 50,          // £/hour value
          focusAreas: ["efficiency", "quick_wins"],
          budgetRange: "0-100",
          benchmarks: {
            low: 25,
            average: 40,
            high: 65
          }
        },
        small: {
          scoreBoost: 1.0,        // No modifier
          timeValue: 150,         // Team of 3 at £50/hour
          focusAreas: ["collaboration", "scalability"],
          budgetRange: "100-500",
          benchmarks: {
            low: 35,
            average: 50,
            high: 75
          }
        },
        medium: {
          scoreBoost: 0.9,        // Need higher capability for same score
          timeValue: 400,         // Team of 8 at £50/hour
          focusAreas: ["transformation", "competitive_advantage"],
          budgetRange: "500-2000",
          benchmarks: {
            low: 45,
            average: 60,
            high: 85
          }
        }
      };
      
      // Activity impact scores (how much AI can help)
      this.activityImpact = {
        content_marketing: {
          automationPotential: 85,
          timesSavings: 70,
          difficultyToImplement: 20,
          quickWinPotential: 95
        },
        social_media: {
          automationPotential: 75,
          timesSavings: 60,
          difficultyToImplement: 30,
          quickWinPotential: 85
        },
        email_marketing: {
          automationPotential: 70,
          timesSavings: 50,
          difficultyToImplement: 25,
          quickWinPotential: 80
        },
        seo_sem: {
          automationPotential: 65,
          timesSavings: 40,
          difficultyToImplement: 45,
          quickWinPotential: 70
        },
        analytics_data: {
          automationPotential: 90,
          timesSavings: 85,
          difficultyToImplement: 35,
          quickWinPotential: 90
        },
        paid_advertising: {
          automationPotential: 70,
          timesSavings: 50,
          difficultyToImplement: 40,
          quickWinPotential: 75
        },
        creative_design: {
          automationPotential: 60,
          timesSavings: 40,
          difficultyToImplement: 50,
          quickWinPotential: 65
        },
        marketing_automation: {
          automationPotential: 80,
          timesSavings: 60,
          difficultyToImplement: 55,
          quickWinPotential: 70
        }
      }
    }
  
    /**
     * Main scoring method
     * @param {Object} answers - All question answers
     * @param {Object} metadata - Company size, selected activities, etc.
     * @returns {Object} Complete scoring results
     */
    calculateScores(answers, metadata) {
      const { companySize = 'small', selectedActivities = [], sector } = metadata;
      
      // Calculate category scores
      const categoryScores = this.calculateCategoryScores(answers);
      
      // Calculate dimension scores
      const dimensionScores = this.calculateDimensionScores(categoryScores);
      
      // Calculate activity-specific scores
      const activityScores = this.calculateActivityScores(answers, selectedActivities);
      
      // Calculate overall readiness
      const overallScore = this.calculateOverallScore(dimensionScores, activityScores);
      
      // Apply size modifiers
      const adjustedScore = this.applySizeModifiers(overallScore, companySize);
      
      // Calculate specific insights
      const insights = this.generateInsights(categoryScores, activityScores, answers);
      
      // Determine readiness level and recommendations
      const readinessLevel = this.getReadinessLevel(adjustedScore, companySize);
      const marketPosition = this.getMarketPosition(adjustedScore, companySize);
      
      // Calculate time and cost savings potential
      const savingsPotential = this.calculateSavingsPotential(
        activityScores, 
        selectedActivities, 
        companySize
      );
      
      // Identify transformation priorities
      const priorities = this.identifyPriorities(
        categoryScores, 
        activityScores, 
        selectedActivities,
        companySize
      );
      
      return {
        overall: Math.round(adjustedScore),
        dimensions: {
          humanReadiness: Math.round(dimensionScores.humanReadiness),
          technicalReadiness: Math.round(dimensionScores.technicalReadiness),
          activityAutomation: Math.round(dimensionScores.activityAutomation)
        },
        categoryScores: {
          champions: Math.round(categoryScores.champions),
          resources: Math.round(categoryScores.resources),
          leadership: Math.round(categoryScores.leadership),
          readiness: Math.round(categoryScores.readiness)
        },
        activityScores: activityScores,
        readinessLevel: readinessLevel,
        marketPosition: marketPosition,
        savingsPotential: savingsPotential,
        priorities: priorities,
        insights: insights,
        companySize: companySize,
        selectedActivities: selectedActivities,
        sector: sector,
        timestamp: new Date().toISOString()
      }
    }
  
    /**
     * Calculate category scores from raw answers
     */
    calculateCategoryScores(answers) {
      const categories = {
        champions: [],
        resources: [],
        leadership: [],
        readiness: []
      };
      
      // Process each answer
      Object.entries(answers).forEach(([questionId, answer]) => {
        // Extract score value
        const score = typeof answer === 'object' ? (answer.score || answer.value || 0) : answer;
        
        // Categorize based on question ID
        if (questionId.includes('champion') || questionId.includes('knowledge') || 
            questionId.includes('experimentation') || questionId.includes('tool_discovery') || 
            questionId.includes('change_adoption')) {
          categories.champions.push(score)
        } else if (questionId.includes('time_availability') || questionId.includes('budget') || 
                   questionId.includes('current_pain') || questionId.includes('tech_complexity') || 
                   questionId.includes('capacity')) {
          categories.resources.push(score)
        } else if (questionId.includes('leadership') || questionId.includes('decision') || 
                   questionId.includes('success_metrics') || questionId.includes('transformation_ownership') || 
                   questionId.includes('risk_tolerance')) {
          categories.leadership.push(score)
        } else if (questionId.includes('current_ai_usage') || questionId.includes
          }
        }
      });
      
      return activityScores;
    }
  
    /**
     * Calculate overall readiness score
     */
    calculateOverallScore(dimensionScores, activityScores) {
      // Calculate average activity score
      const activityValues = Object.values(activityScores);
      const avgActivityScore = activityValues.length > 0;
        ? activityValues.reduce((sum, activity) => sum + activity.currentCapability, 0) / activityValues.length;
        : 50;
      
      dimensionScores.activityAutomation = avgActivityScore;
      
      // Weighted combination
      const overallScore = ;
        dimensionScores.humanReadiness * this.dimensionWeights.humanReadiness +
        dimensionScores.technicalReadiness * this.dimensionWeights.technicalReadiness +
        avgActivityScore * this.dimensionWeights.activityAutomation;
      
      return overallScore;
    }
  
    /**
     * Apply company size modifiers
     */
    applySizeModifiers(score, companySize) {
      const modifier = this.sizeModifiers[companySize];
      if (!modifier) return score;
      
      // Apply boost/penalty based on company size
      let adjustedScore = score * modifier.scoreBoost;
      
      // Additional adjustments based on size-specific factors
      if (companySize === 'solo' && score > 30) {
        // Solo marketers get extra credit for any progress
        adjustedScore += 5
      } else if (companySize === 'medium' && score < 50) {
        // Medium teams need more capability for same readiness
        adjustedScore -= 5
      }
      
      // Keep within 0-100 bounds
      return Math.max(0, Math.min(100, adjustedScore));
    }
  
    /**
     * Get question weights for category
     */
    getQuestionWeights(category, answers) {
      // Return weights based on question importance
      // This could be expanded to use question metadata
      const weights = {
        champions: [1.5, 1.2, 1.3, 1.0, 1.1], // Champion identification most important
        resources: [1.3, 1.2, 1.1, 1.0, 1.2],  // Time availability most important
        leadership: [1.5, 1.0, 1.2, 1.3, 1.1], // Leadership attitude most important
        readiness: [1.2, 1.1, 1.1, 1.2, 1.0]   // Current AI usage most important
      };
      
      return weights[category];
    }
  
    /**
     * Get readiness level based on score and company size
     */
    getReadinessLevel(score, companySize) {
      const benchmarks = this.sizeModifiers[companySize].benchmarks;
      
      if (score >= benchmarks.high) {
        return {
          level: 'high',
          label: 'Transformation Ready',
          description: 'Your team is ready to accelerate AI adoption',
          color: '#00ff88'
        }
      } else if (score >= benchmarks.average) {
        return {
          level: 'medium',
          label: 'Building Capability',
          description: 'Good foundation with room for growth',
          color: '#ffff66'
        }
      } else if (score >= benchmarks.low) {
        return {
          level: 'low',
          label: 'Early Stage',
          description: 'Starting the journey with quick wins',
          color: '#ff8800'
        }
      } else {
        return {
          level: 'critical',
          label: 'Urgent Action Needed',
          description: 'Significant gap to close quickly',
          color: '#ff4444'
        }
      }
    }
  
    /**
     * Get market position
     */
    getMarketPosition(score, companySize) {
      const benchmarks = this.sizeModifiers[companySize].benchmarks;
      
      let percentile;
      if (score >= benchmarks.high) {
        percentile = 75 + (score - benchmarks.high) / (100 - benchmarks.high) * 25
      } else if (score >= benchmarks.average) {
        percentile = 50 + (score - benchmarks.average) / (benchmarks.high - benchmarks.average) * 25
      } else if (score >= benchmarks.low) {
        percentile = 25 + (score - benchmarks.low) / (benchmarks.average - benchmarks.low) * 25
      } else {
        percentile = score / benchmarks.low * 25
      }
      
      return {
        percentile: Math.round(percentile),
        comparison: `You're ahead of ${Math.round(percentile)}% of similar ${companySize} marketing teams`,
        trend: percentile > 50 ? 'leading' : 'lagging',
        implication: this.getMarketImplication(percentile)
      }
    }
  
    /**
     * Calculate savings potential
     */
    calculateSavingsPotential(activityScores, selectedActivities, companySize) {
      const sizeData = this.sizeModifiers[companySize];
      const hoursPerWeek = companySize === 'solo' ? 50 : companySize === 'small' ? 120 : 320;
      
      let totalTimeSavings = 0;
      let totalHoursSaved = 0;
      
      selectedActivities.forEach(activity => {
        const score = activityScores[activity];
        if (score) {
          const potentialSavings = score.timesSavingsPotential / 100;
          const currentEfficiency = score.currentCapability / 100;
          const additionalSavings = potentialSavings - (currentEfficiency * potentialSavings);
          
          // Estimate hours spent on this activity (rough approximation)
          const activityHours = hoursPerWeek * 0.15; // Assume 15% time per activity;
          const hoursSaved = activityHours * additionalSavings;
          
          totalHoursSaved += hoursSaved;
          totalTimeSavings += additionalSavings
        }
      });
      
      const avgTimeSavings = selectedActivities.length > 0 ;
        ? totalTimeSavings / selectedActivities.length 
        : 0;
      
      return {
        weeklyHoursSaved: Math.round(totalHoursSaved),
        monthlyHoursSaved: Math.round(totalHoursSaved * 4),
        percentageTimeSaved: Math.round(avgTimeSavings * 100),
        monetaryValue: Math.round(totalHoursSaved * 4 * sizeData.timeValue),
        timeToROI: this.calculateTimeToROI(sizeData.budgetRange, totalHoursSaved * 4 * sizeData.timeValue)
      }
    }
  
    /**
     * Identify transformation priorities
     */
    identifyPriorities(categoryScores, activityScores, selectedActivities, companySize) {
      const priorities = [];
      
      // Human readiness priorities
      if (categoryScores.champions < 40) {
        priorities.push({
          type: 'human',
          area: 'champions',
          urgency: 'high',
          action: 'Identify and empower AI champions in your team',
          impact: 'Accelerates adoption by 3x'
        })
      }
      
      if (categoryScores.leadership < 40) {
        priorities.push({
          type: 'human',
          area: 'leadership',
          urgency: 'high',
          action: 'Get leadership hands-on with AI tools',
          impact: 'Unlocks resources and removes barriers'
        })
      }
      
      // Activity priorities
      Object.entries(activityScores).forEach(([activity, score]) => {
        if (score.priority === 'high' && score.opportunityGap > 50) {
          priorities.push({
            type: 'activity',
            area: activity,
            urgency: 'high',
            action: `Transform ${this.formatActivityName(activity)} with AI`,
            impact: `Save ${score.timesSavingsPotential}% of time spent`
          })
        }
      });
      
      // Technical priorities
      if (categoryScores.readiness < 30) {
        priorities.push({
          type: 'technical',
          area: 'foundation',
          urgency: 'critical',
          action: 'Start with basic AI tool experimentation',
          impact: 'Build foundation for all other improvements'
        })
      }
      
      // Size-specific priorities
      const sizeData = this.sizeModifiers[companySize];
      sizeData.focusAreas.forEach(focus => {
        if (focus === 'efficiency' && priorities.filter(p => p.type === 'activity').length === 0) {
          priorities.push({
            type: 'strategic',
            area: focus,
            urgency: 'medium',
            action: 'Focus on time-saving quick wins',
            impact: 'Immediate productivity gains'
          })
        }
      });
      
      // Sort by urgency and limit to top 5
      return priorities;
        .sort((a, b) => {
          const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        })
        .slice(0, 5)
    }
  
    /**
     * Generate specific insights
     */
    generateInsights(categoryScores, activityScores, answers) {
      const insights = [];
      
      // Champion insights
      if (categoryScores.champions > 70) {
        insights.push({
          type: 'strength',
          message: 'Your team shows exceptional openness to AI - a critical success factor',
          category: 'human'
        })
      } else if (categoryScores.champions < 30) {
        insights.push({
          type: 'gap',
          message: 'Limited AI enthusiasm could slow adoption - identify champions urgently',
          category: 'human'
        })
      }
      
      // Resource insights
      if (categoryScores.resources < 40 && categoryScores.champions > 60) {
        insights.push({
          type: 'opportunity',
          message: 'Team is ready but lacks resources - perfect case for AI efficiency gains',
          category: 'strategic'
        })
      }
      
      // Activity insights
      const highOpportunityActivities = Object.entries(activityScores);
        .filter(([_, score]) => score.opportunityGap > 60)
        .map(([activity]) => activity);
      
      if (highOpportunityActivities.length > 0) {
        insights.push({
          type: 'opportunity',
          message: `Major untapped potential in ${this.formatActivityName(highOpportunityActivities[0])}`,
          category: 'activity'
        })
      }
      
      // Time pressure insight
      const timePressure = answers.time_availability?.score || answers.time_availability;
      if (timePressure <= 2) {
        insights.push({
          type: 'critical',
          message: 'Severe time constraints make AI automation essential, not optional',
          category: 'business'
        })
      }
      
      return insights;
    }
  
    // Helper methods
    getActivityReadinessLevel(score) {
      if (score >= 70) return 'high';
      if (score >= 40) return 'medium';
      return 'low';
    }
    ;
    calculateActivityPriority(currentCapability, impact) {
      const gap = impact.automationPotential - currentCapability;
      const ease = 100 - impact.difficultyToImplement;
      const value = impact.timesSavings;
      
      const priorityScore = (gap * 0.4) + (ease * 0.3) + (value * 0.3);
      
      if (priorityScore > 70) return 'high';
      if (priorityScore > 40) return 'medium';
      return 'low';
    }
    ;
    formatActivityName(activity) {
      const names = {
        content_marketing: 'Content Marketing',
        social_media: 'Social Media',
        email_marketing: 'Email Marketing',
        seo_sem: 'SEO & SEM',
        analytics_data: 'Analytics & Reporting',
        paid_advertising: 'Paid Advertising',
        creative_design: 'Creative & Design',
        marketing_automation: 'Marketing Automation'
      };
      return names[activity] || activity;
    }
    ;
    getMarketImplication(percentile) {
      if (percentile >= 75) return 'Position of strength - extend your lead';
      if (percentile >= 50) return 'Above average - opportunity to leap ahead';
      if (percentile >= 25) return 'Below average - urgent improvement needed';
      return 'Critical gap - immediate action required';
    }
    ;
    calculateTimeToROI(budgetRange, monthlySavings) {
      const avgBudget = budgetRange === '0-100' ? 50 :;
                        budgetRange === '100-500' ? 300 : 
                        budgetRange === '500-2000' ? 1000 : 500;
      
      const months = avgBudget / monthlySavings;
      
      if (months < 1) return 'Immediate ROI';
      if (months < 3) return `${Math.ceil(months)} months`;
      if (months < 6) return '3-6 months';
      return '6+ months';
    }
    
    /**
     * Calculate dimension scores from category scores
     */
    calculateDimensionScores(categoryScores) {
      // Human readiness dimension (champions, resources, leadership)
      const humanReadiness = (
        (categoryScores.champions * this.categoryWeights.champions) +
        (categoryScores.resources * this.categoryWeights.resources) +
        (categoryScores.leadership * this.categoryWeights.leadership)
      ) / (this.categoryWeights.champions + this.categoryWeights.resources + this.categoryWeights.leadership);
      
      // Technical readiness dimension (single category)
      const technicalReadiness = categoryScores.readiness * this.categoryWeights.readiness;
      
      // Calculate overall score
      const overallScore = (
        (humanReadiness * this.dimensionWeights.humanReadiness) +
        (technicalReadiness * this.dimensionWeights.technicalReadiness) +
        (50 * this.dimensionWeights.activityAutomation) // Placeholder value
      );
      
      return {
        humanReadiness: Math.round(humanReadiness),
        technicalReadiness: Math.round(technicalReadiness),
        activityAutomation: 50, // Placeholder, calculated separately
        overallScore: Math.round(overallScore) // Add this for consistency
      }
    }
    
    /**
     * Calculate activity-specific scores
     */
    calculateActivityScores(answers, selectedActivities) {
      const activityScores = {};
      
      // Default base scores from technical capabilities
      const baseReadiness = answers.technical_readiness?.score || answers.technical_readiness || 3;
      const toolAvailability = answers.tool_availability?.score || answers.tool_availability || 3;
      const dataQuality = answers.data_quality?.score || answers.data_quality || 3;
      
      // Process each selected activity
      selectedActivities.forEach(activity => {
        // Get impact potential for this activity
        const impact = this.activityImpact[activity] || {
          automationPotential: 50,
          timesSavings: 40,
          difficultyToImplement: 50,
          quickWinPotential: 50
        };
        
        // Calculate current capability
        const activityReadiness = answers[`${activity}_capability`]?.score || ;
                                answers[`${activity}_capability`] || 
                                baseReadiness;
        
        // Scale score to 0-100
        const currentScore = (activityReadiness / 5) * 100;
        
        // Calculate gap between current capability and potential
        const opportunityGap = impact.automationPotential - currentScore;
        
        // Calculate ROI potential based on time savings and implementation difficulty
        const roiPotential = impact.timesSavings * (100 - impact.difficultyToImplement) / 100;
        
        // Calculate priority level
        const priority = this.calculateActivityPriority(currentScore, impact);
        
        // Store all scores for this activity
        activityScores[activity] = {
          currentScore: Math.round(currentScore),
          currentCapability: Math.round(currentScore), // Add this for consistency
          automationPotential: impact.automationPotential,
          opportunityGap: Math.round(opportunityGap),
          timeSavings: impact.timesSavings,
          implementationEffort: impact.difficultyToImplement,
          quickWinPotential: impact.quickWinPotential,
          roiPotential: Math.round(roiPotential),
          priority: priority,
          readinessLevel: this.getActivityReadinessLevel(currentScore)
        }
      });
      
      return activityScores;
    }
    
    /**
     * Calculate overall score from dimension scores and activity scores
     */
    calculateOverallScore(dimensionScores, activityScores) {
      // The dimensionScores object already contains an overall score based on dimensions
      let overallScore = dimensionScores.overallScore;
      
      // If we have activity scores, factor them into the overall calculation
      if (activityScores && Object.keys(activityScores).length > 0) {
        // Calculate average activity score
        const activityValues = Object.values(activityScores);
        const avgActivityScore = activityValues.reduce((sum, activity) => {
          return sum + activity.currentCapability; // Note: using currentCapability not currentScore
        }, 0) / activityValues.length;
        
        // Blend the activity score with the dimension-based score
        // We give slightly more weight to the dimension scores as they're more comprehensive
        overallScore = Math.round((overallScore * 0.6) + (avgActivityScore * 0.4));
      }
      
      return overallScore;
    }
  }
  
  // Export for use in assessment system;
  export default InhouseMarketingScoring;
