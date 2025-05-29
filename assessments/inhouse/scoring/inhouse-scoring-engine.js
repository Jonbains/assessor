/**
 * In-House Marketing Assessment - Scoring Engine
 * 
 * Adapts the InHouseMarketingScoring class to the assessment framework.
 * Leverages the existing inhouse_scoring.js configuration file.
 */

// ScoringEngineBase will be available as a global variable

class InhouseMarketingScoring extends ScoringEngineBase {
    constructor(config) {
        super(config);
        
        // Ensure we have the necessary configurations
        this.config = config;
        
        // Initialize from configuration in inhouse_scoring.js
        this.dimensionWeights = {
            people_skills: 0.35,
            process_infrastructure: 0.35, 
            strategy_leadership: 0.30
        };
        
        // Industry-specific weight adjustments
        this.industryWeightAdjustments = {
            b2b_saas: {
                people_skills: 0.30,
                process_infrastructure: 0.40,
                strategy_leadership: 0.30
            },
            manufacturing: {
                people_skills: 0.40,
                process_infrastructure: 0.30,
                strategy_leadership: 0.30
            },
            healthcare: {
                people_skills: 0.30,
                process_infrastructure: 0.40,
                strategy_leadership: 0.30
            },
            financial_services: {
                people_skills: 0.30,
                process_infrastructure: 0.40,
                strategy_leadership: 0.30
            },
            ecommerce_retail: {
                people_skills: 0.35,
                process_infrastructure: 0.35,
                strategy_leadership: 0.30
            }
        };
        
        // Activity impact weights
        this.activityImpactWeights = {
            content_marketing: 0.15,
            analytics_data: 0.15,
            seo_sem: 0.12,
            paid_advertising: 0.12,
            social_media: 0.10,
            email_marketing: 0.10,
            creative_design: 0.10,
            marketing_automation: 0.08,
            pr_communications: 0.05,
            events_webinars: 0.03
        };
        
        // Industry benchmarks
        this.industryBenchmarks = {
            b2b_saas: { average: 75, topQuartile: 90 },
            manufacturing: { average: 50, topQuartile: 70 },
            healthcare: { average: 55, topQuartile: 72 },
            financial_services: { average: 65, topQuartile: 85 },
            ecommerce_retail: { average: 70, topQuartile: 88 }
        };
    }
    
    /**
     * Calculate scores based on assessment state
     * @param {Object} state - Assessment state
     * @return {Object} - Calculated scores
     */
    calculateScores(state) {
        try {
            console.log('[InhouseMarketingScoring] Calculating scores');
            
            const industry = state.selectedIndustry || 'b2b_saas';
            const activities = state.selectedActivities || [];
            const answers = state.answers || {};
            const companySize = state.companySize || 'mid_market';
            
            // Validate required data
            if (!industry || activities.length === 0) {
                console.error('[InhouseMarketingScoring] Missing required data for calculation');
                return null;
            }
            
            // Log the inputs for debugging
            console.log(`[InhouseMarketingScoring] Inputs - Industry: ${industry}, Activities: ${activities.join(', ')}, Company Size: ${companySize}`);
            console.log(`[InhouseMarketingScoring] Total Answers: ${Object.keys(answers).length}`);
            
            // Calculate dimension scores
            const dimensionScores = this.calculateDimensionScores(answers);
            console.log('[InhouseMarketingScoring] Dimension Scores:', dimensionScores);
            
            // Calculate activity scores
            const activityScores = this.calculateActivityScores(answers, activities);
            console.log('[InhouseMarketingScoring] Activity Scores:', activityScores);
            
            // Calculate industry-adjusted overall score
            const overallScore = this.calculateOverallScore(dimensionScores, activityScores, industry);
            console.log(`[InhouseMarketingScoring] Overall Score: ${overallScore}`);
            
            // Calculate readiness metrics
            const readinessMetrics = this.calculateReadinessMetrics(dimensionScores, activityScores, industry);
            
            // Determine readiness category
            const readinessCategory = this.determineReadinessCategory(overallScore, industry);
            
            // Calculate industry comparison
            const industryComparison = this.calculateIndustryComparison(overallScore, industry);
            
            // Compile the final results
            const results = {
                overall: Math.round(overallScore),
                people_skills: Math.round(dimensionScores.people_skills),
                process_infrastructure: Math.round(dimensionScores.process_infrastructure),
                strategy_leadership: Math.round(dimensionScores.strategy_leadership),
                activityScores: activityScores,
                readinessCategory: readinessCategory,
                industryComparison: industryComparison,
                readinessMetrics: readinessMetrics,
                selectedActivities: activities,
                companySize: companySize,
                industry: industry,
                scores: {
                    overall: Math.round(overallScore),
                    dimensions: {
                        people_skills: Math.round(dimensionScores.people_skills),
                        process_infrastructure: Math.round(dimensionScores.process_infrastructure),
                        strategy_leadership: Math.round(dimensionScores.strategy_leadership)
                    },
                    activities: activityScores,
                    readinessCategory: readinessCategory,
                    industryComparison: industryComparison,
                    readinessMetrics: readinessMetrics
                },
                metadata: {
                    industry,
                    companySize,
                    answerCount: Object.keys(answers).length,
                    calculationTime: new Date().toISOString()
                }
            };
            
            console.log('[InhouseMarketingScoring] Calculation completed successfully');
            return results;
        } catch (error) {
            console.error('[InhouseMarketingScoring] Error calculating scores:', error);
            return {
                overall: 0,
                dimensions: {
                    people_skills: 0,
                    process_infrastructure: 0,
                    strategy_leadership: 0
                },
                activityScores: {},
                metadata: {
                    industry: '',
                    companySize: '',
                    answerCount: 0,
                    calculationTime: new Date().toISOString()
                }
            };
        }
    }
    
    /**
     * Calculate dimension scores from answers
     * @param {Object} answers - Assessment answers
     * @return {Object} - Dimension scores
     */
    calculateDimensionScores(answers) {
        // Initialize with 0 scores for each dimension
        const scores = {
            people_skills: 0,
            process_infrastructure: 0,
            strategy_leadership: 0
        };
        
        // Count the number of answered questions in each dimension
        const answerCounts = {
            people_skills: 0,
            process_infrastructure: 0,
            strategy_leadership: 0
        };
        
        // Track question weights (some questions may be weighted differently)
        const dimensionWeights = {
            people_skills: 0,
            process_infrastructure: 0,
            strategy_leadership: 0
        };
        
        // Calculate raw scores for each dimension
        for (const questionId in answers) {
            const question = this.findQuestionById(questionId);
            
            if (!question || !question.dimension) continue;
            
            const dimension = question.dimension;
            const answer = answers[questionId];
            const weight = question.weight || 1; // Default weight is 1 if not specified
            
            if (dimension in scores) {
                scores[dimension] += parseInt(answer, 10) * weight;
                dimensionWeights[dimension] += weight;
                answerCounts[dimension]++;
            }
        }
        
        // Log dimension answer counts for debugging
        console.log('[InhouseMarketingScoring] Dimension answer counts:', answerCounts);
        
        // Convert raw scores to percentages (0-100)
        for (const dimension in scores) {
            if (dimensionWeights[dimension] > 0) {
                // Normalize to 0-100 scale (answers are 1-5)
                scores[dimension] = (scores[dimension] / (dimensionWeights[dimension] * 5)) * 100;
            }
        }
        
        return scores;
    }
    
    /**
     * Calculate activity scores from answers
     * @param {Object} answers - Assessment answers
     * @param {Array} selectedActivities - Selected activities
     * @return {Object} - Activity scores
     */
    calculateActivityScores(answers, selectedActivities) {
        const activityScores = {};
        
        selectedActivities.forEach(activityId => {
            // Track total score and weights for this activity
            let totalWeightedScore = 0;
            let totalWeight = 0;
            
            // Find questions for this activity
            for (const [questionId, answerValue] of Object.entries(answers)) {
                const question = this.findQuestionById(questionId);
                
                if (question && question.activity === activityId) {
                    const weight = question.weight || 1;
                    const score = (answerValue / 5) * 100; // Convert 0-5 to 0-100 scale
                    
                    totalWeightedScore += score * weight;
                    totalWeight += weight;
                }
            }
            
            // Calculate final score
            const score = totalWeight > 0 ? totalWeightedScore / totalWeight : 50;
            const readiness = this.determineActivityReadiness(score);
            
            activityScores[activityId] = {
                score,
                readiness,
                aiImpact: this.getActivityAIImpact(activityId)
            };
        });
        
        return activityScores;
    }
    
    /**
     * Calculate overall score with industry-specific adjustments
     * @param {Object} dimensionScores - Dimension scores
     * @param {Object} activityScores - Activity scores
     * @param {string} industry - Selected industry
     * @return {number} - Overall score
     */
    calculateOverallScore(dimensionScores, activityScores, industry) {
        // Get industry-adjusted weights
        const weights = this.industryWeightAdjustments[industry] || this.dimensionWeights;
        
        // Calculate dimension-weighted score
        let overallScore = 0;
        for (const [dimension, score] of Object.entries(dimensionScores)) {
            overallScore += score * weights[dimension];
        }
        
        // Apply activity impact adjustments
        const activityAdjustment = this.calculateActivityAdjustment(activityScores);
        
        // Final score is base score adjusted by activity impact
        return overallScore * (1 + activityAdjustment);
    }
    
    /**
     * Calculate readiness metrics
     * @param {Object} dimensionScores - Dimension scores
     * @param {Object} activityScores - Activity scores
     * @param {string} industry - Selected industry
     * @return {Object} - Readiness metrics
     */
    calculateReadinessMetrics(dimensionScores, activityScores, industry) {
        // This is a simplified version of the full calculation
        const overallReadiness = (
            dimensionScores.people_skills * 0.4 +
            dimensionScores.process_infrastructure * 0.4 +
            dimensionScores.strategy_leadership * 0.2
        );
        
        const efficiencyPotential = (
            dimensionScores.process_infrastructure * 0.6 +
            dimensionScores.people_skills * 0.4
        ) * this.getIndustryEfficiencyFactor(industry);
        
        const innovationCapability = (
            dimensionScores.strategy_leadership * 0.5 +
            dimensionScores.people_skills * 0.3 +
            dimensionScores.process_infrastructure * 0.2
        ) * this.getIndustryInnovationFactor(industry);
        
        return {
            overallReadiness: Math.round(overallReadiness),
            efficiencyPotential: Math.round(efficiencyPotential),
            innovationCapability: Math.round(innovationCapability)
        };
    }
    
    /**
     * Calculate activity adjustment for overall score
     * @param {Object} activityScores - Activity scores
     * @return {number} - Activity adjustment factor
     */
    calculateActivityAdjustment(activityScores) {
        let adjustment = 0;
        let totalWeight = 0;
        
        // Apply impact weights to each activity score
        for (const [activityId, data] of Object.entries(activityScores)) {
            const impactWeight = this.activityImpactWeights[activityId] || 0.05;
            adjustment += (data.score / 100) * impactWeight;
            totalWeight += impactWeight;
        }
        
        // Normalize by total weight (if activities were selected)
        return totalWeight > 0 ? (adjustment / totalWeight) * 0.2 : 0; // Max 20% adjustment
    }
    
    /**
     * Determine activity readiness level
     * @param {number} score - Activity score
     * @return {string} - Readiness level
     */
    determineActivityReadiness(score) {
        if (score >= 85) return 'advanced';
        if (score >= 70) return 'proficient';
        if (score >= 50) return 'moderate';
        if (score >= 30) return 'basic';
        return 'minimal';
    }
    
    /**
     * Get AI impact level for an activity
     * @param {string} activityId - Activity ID
     * @return {string} - Impact level
     */
    getActivityAIImpact(activityId) {
        const impactMap = {
            content_marketing: 'Very High',
            analytics_data: 'Very High',
            creative_design: 'Very High',
            social_media: 'High',
            seo_sem: 'High',
            email_marketing: 'High',
            paid_advertising: 'High',
            marketing_automation: 'High',
            pr_communications: 'Moderate',
            events_webinars: 'Moderate'
        };
        
        return impactMap[activityId] || 'Moderate';
    }
    
    /**
     * Get industry efficiency factor
     * @param {string} industry - Industry ID
     * @return {number} - Efficiency factor
     */
    getIndustryEfficiencyFactor(industry) {
        const factorMap = {
            b2b_saas: 1.2,
            ecommerce_retail: 1.15,
            financial_services: 1.1,
            healthcare: 0.9,
            manufacturing: 1.0
        };
        
        return factorMap[industry] || 1.0;
    }
    
    /**
     * Get industry innovation factor
     * @param {string} industry - Industry ID
     * @return {number} - Innovation factor
     */
    getIndustryInnovationFactor(industry) {
        const factorMap = {
            b2b_saas: 1.3,
            ecommerce_retail: 1.2,
            financial_services: 1.0,
            healthcare: 0.85,
            manufacturing: 0.9
        };
        
        return factorMap[industry] || 1.0;
    }
    
    /**
     * Determine readiness category based on score and industry
     * @param {number} overallScore - Overall assessment score
     * @param {string} industry - Selected industry
     * @return {string} - Readiness category
     */
    determineReadinessCategory(overallScore, industry) {
        if (overallScore >= 85) return 'ai_leader';
        if (overallScore >= 70) return 'advanced';
        if (overallScore >= 55) return 'advancing';
        if (overallScore >= 40) return 'developing';
        return 'beginning';
    }
    
    /**
     * Calculate industry comparison data
     * @param {number} overallScore - Overall assessment score
     * @param {string} industry - Selected industry
     * @return {Object} - Industry comparison data
     */
    calculateIndustryComparison(overallScore, industry) {
        const benchmark = this.industryBenchmarks[industry] || { average: 60, topQuartile: 80 };
        
        // Calculate percentile (simplified)
        const percentile = this.calculatePercentile(overallScore, benchmark);
        
        return {
            industryAverage: benchmark.average,
            topQuartile: benchmark.topQuartile,
            percentile: percentile,
            relativeTo: industry
        };
    }
    
    /**
     * Calculate percentile rank (simplified)
     * @param {number} score - Score to calculate percentile for
     * @param {Object} benchmark - Industry benchmark data
     * @return {number} - Percentile rank
     */
    calculatePercentile(score, benchmark) {
        // Simple percentile calculation based on normal distribution assumption
        const avg = benchmark.average;
        const stdDev = (benchmark.topQuartile - avg) / 0.67; // Approximate standard deviation
        
        if (score <= avg) {
            // Below average: 0-50th percentile
            return Math.round((score / avg) * 50);
        } else {
            // Above average: 50-100th percentile
            const maxScore = avg + (stdDev * 2); // ~95th percentile
            const aboveAvgScore = score - avg;
            const aboveAvgPercentile = Math.min(aboveAvgScore / (maxScore - avg) * 50, 50);
            return Math.round(50 + aboveAvgPercentile);
        }
    }
    
    /**
     * Find a question by its ID
     * @param {string} questionId - Question ID to find
     * @return {Object|null} - Question object or null if not found
     */
    findQuestionById(questionId) {
        // Check in core questions
        for (const dimension in this.config.coreQuestions) {
            const questions = this.config.coreQuestions[dimension];
            for (const question of questions) {
                if (question.id === questionId) {
                    return question;
                }
            }
        }
        
        // Check in industry questions
        for (const industry in this.config.industryQuestions) {
            const questions = this.config.industryQuestions[industry];
            for (const question of questions) {
                if (question.id === questionId) {
                    return question;
                }
            }
        }
        
        // Check in activity questions
        for (const activity in this.config.activityQuestions) {
            const questions = this.config.activityQuestions[activity];
            for (const question of questions) {
                if (question.id === questionId) {
                    return question;
                }
            }
        }
        
        return null;
    }
}

// Make the class available as a browser global
window.InhouseMarketingScoring = InhouseMarketingScoring;
