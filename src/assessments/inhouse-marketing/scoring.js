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
        // Weights for overall score calculation
        overall: {
          humanReadiness: 0.4,      // Champions, leadership
          technicalReadiness: 0.3,   // Resources, technical readiness
          activityAutomation: 0.3    // Potential in their activities
        },
        // Weights within human readiness dimension
        humanReadiness: {
          champions: 0.6,
          leadership: 0.4
        },
        // Weights within technical readiness dimension
        technicalReadiness: {
          resources: 0.5,
          readiness: 0.5
        }
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
        } else if (questionId.includes('current_ai_usage') || questionId.includes('data_quality')) {
          categories.readiness.push(score)
        }
      });
      
      // Calculate category averages
      return {
        champions: categories.champions.length > 0 ? categories.champions.reduce((sum, score) => sum + score, 0) / categories.champions.length * 25 : 50,
        resources: categories.resources.length > 0 ? categories.resources.reduce((sum, score) => sum + score, 0) / categories.resources.length * 25 : 50,
        leadership: categories.leadership.length > 0 ? categories.leadership.reduce((sum, score) => sum + score, 0) / categories.leadership.length * 25 : 50,
        readiness: categories.readiness.length > 0 ? categories.readiness.reduce((sum, score) => sum + score, 0) / categories.readiness.length * 25 : 50
      };
    }
  
    /**
     * Calculate overall readiness score
     */
    calculateOverallScore(dimensionScores, activityScores) {
      // Calculate average activity score
      const activityValues = Object.values(activityScores);
      const avgActivityScore = activityValues.length > 0
        ? activityValues.reduce((sum, activity) => sum + activity.currentCapability, 0) / activityValues.length
        : 50;
      
      dimensionScores.activityAutomation = avgActivityScore;
      
      // Weighted combination
      const overallScore = 
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
      // Get benchmarks for company size
      const benchmarks = this.sizeModifiers[companySize].benchmarks;
      
      let level, description, nextSteps;
      
      if (score >= benchmarks.high) {
        level = 'high';
        description = 'Transformation Ready';
        nextSteps = 'Your team is ready to accelerate AI adoption';
      } else if (score >= benchmarks.average) {
        level = 'medium';
        description = 'Building Capability';
        nextSteps = 'Good foundation with room for growth';
      } else if (score >= benchmarks.low) {
        level = 'low';
        description = 'Early Stage';
        nextSteps = 'Starting the journey with quick wins';
      } else {
        level = 'critical';
        description = 'Urgent Action Needed';
        nextSteps = 'Significant gap to close quickly';
      }
      
      // Calculate percentile based on score and company size benchmarks
      const calculatePercentile = (score, companySize) => {
        const benchmarks = this.sizeModifiers[companySize].benchmarks;
        
        if (score < benchmarks.low) {
          // Below low benchmark - map from 0 to low benchmark as 0-25th percentile
          return Math.round((score / benchmarks.low) * 25);
        } else if (score < benchmarks.average) {
          // Between low and average - map to 25-50th percentile
          return Math.round(25 + ((score - benchmarks.low) / (benchmarks.average - benchmarks.low)) * 25);
        } else if (score < benchmarks.high) {
          // Between average and high - map to 50-75th percentile
          return Math.round(50 + ((score - benchmarks.average) / (benchmarks.high - benchmarks.average)) * 25);
        } else {
          // Above high benchmark - map to 75-100th percentile
          const remaining = 100 - benchmarks.high;
          const overshoot = score - benchmarks.high;
          return Math.min(100, Math.round(75 + (overshoot / remaining) * 25));
        }
      };
      
      return {
        score: Math.round(score),
        level,
        description,
        nextSteps,
        percentile: calculatePercentile(score, companySize)
      };
    }
  
    /**
     * Get market position
     */
    getMarketPosition(score, companySize) {
      // Get benchmarks for company size
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
      // Time and cost values based on company size
      const sizeData = this.sizeModifiers[companySize];
      const timeValue = sizeData.timeValue;
      
      // Calculate weighted average time savings
      let totalTimeSavings = 0;
      let totalWeight = 0;
      
      // Calculate savings for each activity
      Object.entries(activityScores).forEach(([activity, scores]) => {
        // Get AI automation potential for this activity
        const weight = this.activityImpact[activity].timesSavings;
        const impactPct = scores.timeSavings;
        
        totalTimeSavings += impactPct * weight;
        totalWeight += weight;
      });
      
      // Calculate average time savings as percentage
      const avgTimeSavingsPct = totalWeight > 0 ? totalTimeSavings / totalWeight : 30;
      
      // Convert to hours per week based on company size
      let hoursPerWeek;
      if (companySize === 'solo') {
        hoursPerWeek = Math.round(40 * (avgTimeSavingsPct / 100));
      } else if (companySize === 'small') {
        hoursPerWeek = Math.round(100 * (avgTimeSavingsPct / 100)); // Assumes ~3 people
      } else {
        hoursPerWeek = Math.round(240 * (avgTimeSavingsPct / 100)); // Assumes ~8 people
      }
      
      // Calculate annual cost savings
      const annualHours = hoursPerWeek * 48; // 48 working weeks per year
      const annualSavings = annualHours * timeValue;
      
      // Calculate time to ROI
      const calculateTimeToROI = (budgetRange, monthlySavings) => {
        // Parse budget range
        const [minBudget, maxBudget] = budgetRange.split('-').map(b => parseInt(b, 10));
        const avgBudget = (minBudget + maxBudget) / 2;
        
        // Calculate months to recover investment
        return Math.ceil(avgBudget / monthlySavings);
      };
      
      return {
        percentTime: Math.round(avgTimeSavingsPct),
        hours: hoursPerWeek,
        annualHours: annualHours,
        annualSavings: annualSavings,
        roi: calculateTimeToROI(sizeData.budgetRange, annualSavings / 12)
      };
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
            impact: `Save ${score.timeSavings}% of time spent`
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
      return priorities
        .sort((a, b) => {
          const urgencyOrder = { critical: 0, high: 1, medium: 2, low: 3 };
          return urgencyOrder[a.urgency] - urgencyOrder[b.urgency];
        })
        .slice(0, 5);
    }
  
    /**
     * Generate specific insights
     */
    generateInsights(categoryScores, activityScores, answers) {
      const insights = [];
      
      // Get top strengths and weaknesses
      const categories = [
        { name: 'champions', score: categoryScores.champions },
        { name: 'resources', score: categoryScores.resources },
        { name: 'leadership', score: categoryScores.leadership },
        { name: 'readiness', score: categoryScores.readiness }
      ];
      
      const sortedStrengths = [...categories].sort((a, b) => b.score - a.score);
      const sortedWeaknesses = [...categories].sort((a, b) => a.score - b.score);
      
      // Helper methods for insights
      const getStrengthInsight = (category, score) => {
        const insights = {
          champions: 'Your team has strong AI champions who can accelerate adoption',
          resources: 'You have allocated good resources for AI adoption',
          leadership: 'Your leadership has strong commitment to AI transformation',
          readiness: 'Your technical foundation is solid for AI implementation'
        };
        return insights[category] || `Your ${category} score is a strength at ${Math.round(score)}/100`;
      };
      
      const getWeaknessInsight = (category, score) => {
        const insights = {
          champions: 'You need to identify and empower AI champions in your team',
          resources: 'Insufficient resources allocated for AI adoption',
          leadership: 'Leadership commitment to AI adoption needs improvement',
          readiness: 'Your technical foundation for AI needs significant improvement'
        };
        return insights[category] || `Your ${category} score needs improvement at ${Math.round(score)}/100`;
      };
      
      // Top strength insight
      insights.push({
        type: 'strength',
        category: sortedStrengths[0].name,
        text: getStrengthInsight(sortedStrengths[0].name, sortedStrengths[0].score)
      });
      
      // Top weakness insight
      insights.push({
        type: 'weakness',
        category: sortedWeaknesses[0].name,
        text: getWeaknessInsight(sortedWeaknesses[0].name, sortedWeaknesses[0].score)
      });
      
      // Activity-specific insights
      if (activityScores) {
        const activities = Object.entries(activityScores)
          .map(([id, data]) => ({ id, ...data }))
          .sort((a, b) => b.opportunityGap - a.opportunityGap);
          
        // Add insight for activity with highest opportunity gap
        if (activities.length > 0) {
          const topActivity = activities[0];
          insights.push({
            type: 'opportunity',
            category: 'activity',
            activity: topActivity.id,
            text: `Your ${this.formatActivityName(topActivity.id)} activities have ${topActivity.opportunityGap}% improvement potential with AI adoption`
          });
        }
      }
      
      // Readiness level insight
      if (categoryScores.readiness < 30) {
        insights.push({
          type: 'critical',
          category: 'readiness',
          text: 'Your team has critical gaps in basic AI capabilities that should be addressed immediately'
        });
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
      const avgBudget = budgetRange === '0-100' ? 50 :
                        budgetRange === '100-500' ? 300 : 
                        budgetRange === '500-2000' ? 1000 : 500;
      
      const months = avgBudget / monthlySavings;
      
      if (months < 1) return 'Immediate ROI';
      if (months < 3) return `${Math.ceil(months)} months`;
      if (months < 6) return '3-6 months';
      return '6+ months';
    }
    
    /**
     * Calculate dimension scores from categories
     */
    calculateDimensionScores(categoryScores) {
      // Human readiness dimension
      const humanReadiness = (
        categoryScores.champions * this.dimensionWeights.humanReadiness.champions +
        categoryScores.leadership * this.dimensionWeights.humanReadiness.leadership
      ) / (
        this.dimensionWeights.humanReadiness.champions +
        this.dimensionWeights.humanReadiness.leadership
      );
      
      // Technical readiness dimension
      const technicalReadiness = (
        categoryScores.resources * this.dimensionWeights.technicalReadiness.resources +
        categoryScores.readiness * this.dimensionWeights.technicalReadiness.readiness
      ) / (
        this.dimensionWeights.technicalReadiness.resources +
        this.dimensionWeights.technicalReadiness.readiness
      );
      
      // Calculate overall score from dimensions
      const overallScore = (
        humanReadiness * this.dimensionWeights.overall.humanReadiness +
        technicalReadiness * this.dimensionWeights.overall.technicalReadiness +
        50 * this.dimensionWeights.overall.activityAutomation 
      ) / (
        this.dimensionWeights.overall.humanReadiness +
        this.dimensionWeights.overall.technicalReadiness +
        this.dimensionWeights.overall.activityAutomation
      );
      
      return {
        humanReadiness: Math.round(humanReadiness),
        technicalReadiness: Math.round(technicalReadiness),
        activityAutomation: 50, // Placeholder, calculated separately
        overallScore: Math.round(overallScore)
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
        const activityReadiness = answers[`${activity}_capability`]?.score || 
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
      
      // Return the activity scores
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
  
  // Export for use in assessment system
  export default InhouseMarketingScoring;
