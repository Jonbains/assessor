/**
 * In-House Marketing Assessment - Recommendations Engine
 * 
 * Generates personalized recommendations based on assessment results.
 * Recommendations are organized by:
 * - Priority (high, medium, low)
 * - Dimension (people, process, strategy)
 * - Activity (specific marketing activities)
 * - Industry-specific insights
 */

class InhouseRecommendationsEngine {
    constructor(config) {
        this.config = config;
        
        // Get recommendations configuration
        this.recommendationsConfig = config.recommendationsConfig || {};
        
        // Access static recommendations data
        this.dimensionRecommendations = this.recommendationsConfig.coreRecommendations || {
            people_skills: {
                low: [],
                medium: [],
                high: []
            },
            process_infrastructure: {
                low: [],
                medium: [],
                high: []
            },
            strategy_leadership: {
                low: [],
                medium: [],
                high: []
            }
        };
        
        this.activityRecommendations = this.recommendationsConfig.activityRecommendations || {};
        this.industryRecommendations = this.recommendationsConfig.industryRecommendations || {};
        
        // Access tool database for ROI calculations
        this.toolDatabase = this.recommendationsConfig.toolDatabase || {};
        
        // Access implementation timelines for planning
        this.implementationTimelines = this.recommendationsConfig.implementationTimelines || {};
        
        console.log('[InhouseRecommendationsEngine] Initialized with config');
    }
    
    /**
     * Generate recommendations based on assessment results
     * @param {Object} results - Assessment results from scoring engine
     * @return {Object} - Organized recommendations
     */
    generateRecommendations(results) {
        if (!results) {
            console.error('[InhouseRecommendationsEngine] No results provided');
            return {};
        }
        
        console.log('[InhouseRecommendationsEngine] Generating recommendations from results:', results);
        
        try {
            // Extract scores from results - handle both direct dimensions and nested scores structure
            // This addresses the data structure mismatch issue mentioned in the memory
            const dimensionScores = {
                people_skills: results.people_skills || (results.scores?.dimensions?.people_skills) || 0,
                process_infrastructure: results.process_infrastructure || (results.scores?.dimensions?.process_infrastructure) || 0,
                strategy_leadership: results.strategy_leadership || (results.scores?.dimensions?.strategy_leadership) || 0
            };
            
            const activityScores = results.activityScores || {};
            const overallScore = results.overall || results.scores?.overall || 0;
            const industry = results.industry || '';
            const companySize = results.companySize || 'mid_market';
            const selectedActivities = results.selectedActivities || [];
            
            console.log(`[InhouseRecommendationsEngine] Using scores - Overall: ${overallScore}, Dimensions:`, dimensionScores);
            
            // Generate different types of recommendations
            const dimensionRecs = this.generateDimensionRecommendations(dimensionScores);
            const activityRecs = this.generateActivityRecommendations(activityScores);
            const industryRecs = this.generateIndustryRecommendations(overallScore, industry);
            
            // Combine all recommendations
            let allRecommendations = [
                ...dimensionRecs,
                ...activityRecs,
                ...industryRecs
            ];
            
            // Enhance recommendations with additional metadata
            allRecommendations = allRecommendations.map(rec => {
                // Add timeline and expected ROI information
                const timeline = this.determineTimeline(rec.priority, overallScore);
                const expectedROI = this.estimateROI(rec, industry, companySize);
                
                // Add source context if not present
                const source = rec.source || 'dimension';
                const sourceName = rec.sourceName || (rec.dimension ? this.formatDimension(rec.dimension) : '');
                
                return {
                    ...rec,
                    timeline,
                    expectedROI,
                    source,
                    sourceName,
                    implementationComplexity: this.determineComplexity(rec, overallScore),
                    relevanceScore: this.calculateRelevanceScore(rec, overallScore, dimensionScores)
                };
            });
            
            // Prioritize recommendations
            const prioritizedRecommendations = this.prioritizeRecommendations(allRecommendations);
            
            console.log(`[InhouseRecommendationsEngine] Generated ${prioritizedRecommendations.length} recommendations`);
            
            // Return organized recommendations
            return {
                prioritizedRecommendations,
                byDimension: {
                    people_skills: dimensionRecs.filter(rec => rec.dimension === 'people_skills'),
                    process_infrastructure: dimensionRecs.filter(rec => rec.dimension === 'process_infrastructure'),
                    strategy_leadership: dimensionRecs.filter(rec => rec.dimension === 'strategy_leadership')
                },
                byActivity: Object.keys(activityScores).reduce((acc, activityId) => {
                    acc[activityId] = activityRecs.filter(rec => rec.activityId === activityId);
                    return acc;
                }, {}),
                byIndustry: industryRecs,
                count: prioritizedRecommendations.length,
                metadata: {
                    overallScore,
                    industry,
                    companySize,
                    selectedActivities,
                    generatedAt: new Date().toISOString()
                }
            };
        } catch (error) {
            console.error('[InhouseRecommendationsEngine] Error generating recommendations:', error);
            return {
                prioritizedRecommendations: [],
                byDimension: {
                    people_skills: [],
                    process_infrastructure: [],
                    strategy_leadership: []
                },
                byActivity: {},
                byIndustry: [],
                count: 0,
                metadata: {
                    generatedAt: new Date().toISOString()
                }
            };
        }
    }
    
    /**
     * Generate recommendations based on dimension scores
     * @param {Object} dimensionScores - Scores for each dimension
     * @return {Array} - Recommendations for dimensions
     */
    generateDimensionRecommendations(dimensionScores) {
        const recommendations = [];
        
        // Generate recommendations based on dimension scores
        for (const dimension in dimensionScores) {
            const score = dimensionScores[dimension];
            const dimensionRecs = this.dimensionRecommendations[dimension] || {};
            
            // Select recommendations based on score ranges
            if (score < 50 && dimensionRecs.low) {
                dimensionRecs.low.forEach(rec => {
                    recommendations.push({
                        ...rec,
                        source: 'dimension',
                        sourceName: this.formatDimension(dimension)
                    });
                });
            }
            
            if (score >= 30 && score < 70 && dimensionRecs.medium) {
                dimensionRecs.medium.forEach(rec => {
                    recommendations.push({
                        ...rec,
                        source: 'dimension',
                        sourceName: this.formatDimension(dimension)
                    });
                });
            }
            
            if (score >= 60 && dimensionRecs.high) {
                dimensionRecs.high.forEach(rec => {
                    recommendations.push({
                        ...rec,
                        source: 'dimension',
                        sourceName: this.formatDimension(dimension)
                    });
                });
            }
        }
        
        return recommendations;
    }
    
    /**
     * Generate recommendations based on activity scores
     * @param {Object} activityScores - Scores for each activity
     * @return {Array} - Recommendations for activities
     */
    generateActivityRecommendations(activityScores) {
        const recommendations = [];
        
        // Generate recommendations for each activity based on score
        Object.entries(activityScores).forEach(([activityId, score]) => {
            // Skip if no recommendations for this activity
            if (!this.activityRecommendations[activityId]) {
                return;
            }
            
            // Determine recommendation level based on score
            let level = 'high';
            if (score >= 70) {
                level = 'low';
            } else if (score >= 50) {
                level = 'medium';
            }
            
            // Get recommendations for this activity and level
            const activityRecs = this.activityRecommendations[activityId][level] || [];
            
            // Add recommendations to results with enhanced details
            activityRecs.forEach(rec => {
                // Calculate impact level based on score gap
                const scoreGap = 100 - score;
                const impactLevel = scoreGap > 50 ? 'High' : (scoreGap > 30 ? 'Medium' : 'Low');
                
                // Calculate cost-benefit ratio (1-10 scale, lower is better)
                const costBenefitRatio = Math.max(1, Math.min(10, Math.round(10 - (scoreGap / 10))));
                
                // Determine typical timeline for implementation
                const implementationTime = level === 'high' ? '0-30 days' : 
                                         (level === 'medium' ? '30-90 days' : '90+ days');
                
                // Provide more specific expected outcomes
                const outcomes = this.getExpectedOutcomes(activityId, level, score);
                
                recommendations.push({
                    ...rec,
                    activity: activityId,
                    activityName: this.getActivityName(activityId),
                    source: 'activity',
                    priority: level,
                    impactLevel,
                    costBenefitRatio,
                    implementationTime,
                    outcomes
                });
            });
        });
        
        return recommendations;
    }
    
    /**
     * Get expected outcomes for an activity-based recommendation
     * @param {string} activityId - The activity ID
     * @param {string} level - Recommendation level (high, medium, low)
     * @param {number} score - Current activity score
     * @return {Object} - Expected outcomes
     */
    getExpectedOutcomes(activityId, level, score) {
        // Base outcomes that vary by activity
        const baseOutcomes = {
            content_marketing: {
                productivityGain: '30-50%',
                qualityImprovement: 'Medium to High',
                costReduction: '15-25%'
            },
            social_media: {
                productivityGain: '25-40%',
                qualityImprovement: 'Medium',
                costReduction: '10-20%'
            },
            seo_sem: {
                productivityGain: '20-35%',
                qualityImprovement: 'Medium',
                costReduction: '15-25%'
            },
            email_marketing: {
                productivityGain: '30-45%',
                qualityImprovement: 'Medium to High',
                costReduction: '15-30%'
            },
            analytics_data: {
                productivityGain: '40-60%',
                qualityImprovement: 'High',
                costReduction: '20-35%'
            },
            paid_advertising: {
                productivityGain: '25-40%',
                qualityImprovement: 'Medium',
                costReduction: '15-25%'
            },
            creative_design: {
                productivityGain: '20-35%',
                qualityImprovement: 'Medium',
                costReduction: '10-20%'
            },
            marketing_automation: {
                productivityGain: '30-50%',
                qualityImprovement: 'High',
                costReduction: '20-30%'
            },
            pr_communications: {
                productivityGain: '15-30%',
                qualityImprovement: 'Low to Medium',
                costReduction: '10-15%'
            },
            events_webinars: {
                productivityGain: '15-25%',
                qualityImprovement: 'Low to Medium',
                costReduction: '5-15%'
            }
        };
        
        // Get base outcome for this activity or use default
        const outcome = baseOutcomes[activityId] || {
            productivityGain: '20-35%',
            qualityImprovement: 'Medium',
            costReduction: '10-20%'
        };
        
        // Adjust based on current score and recommendation level
        const scoreAdjustment = (100 - score) / 100;
        const levelMultiplier = level === 'high' ? 1.2 : (level === 'medium' ? 1.0 : 0.8);
        
        // Calculate adjusted productivity gain
        const baseGain = outcome.productivityGain.split('-').map(v => parseInt(v.replace('%', '')));
        const adjustedMin = Math.round(baseGain[0] * scoreAdjustment * levelMultiplier);
        const adjustedMax = Math.round(baseGain[1] * scoreAdjustment * levelMultiplier);
        const adjustedGain = `${adjustedMin}-${adjustedMax}%`;
        
        // Calculate ROI timeframe based on level and score
        let roiTimeframe;
        if (level === 'high' && score < 50) {
            roiTimeframe = '30-60 days';
        } else if (level === 'high' || (level === 'medium' && score < 50)) {
            roiTimeframe = '60-90 days';
        } else if (level === 'medium' || (level === 'low' && score < 50)) {
            roiTimeframe = '90-180 days';
        } else {
            roiTimeframe = '180+ days';
        }
        
        return {
            productivityGain: adjustedGain,
            qualityImprovement: outcome.qualityImprovement,
            costReduction: outcome.costReduction,
            roiTimeframe: roiTimeframe
        };
    }
    
    /**
     * Generate industry-specific recommendations
     * @param {number} overallScore - Overall assessment score
     * @param {string} industry - Selected industry
     * @return {Array} - Industry-specific recommendations
     */
    generateIndustryRecommendations(overallScore, industry) {
        const recommendations = [];
        
        if (!industry) return recommendations;
        
        // Determine score category for industry recommendations
        let scoreCategory;
        if (overallScore < 40) scoreCategory = 'lowScore';
        else if (overallScore < 60) scoreCategory = 'mediumScore';
        else if (overallScore < 80) scoreCategory = 'highScore';
        else scoreCategory = 'topScore';
        
        // Check if we have industry recommendations in the config
        if (this.recommendationsConfig.industryRecommendations && 
            this.recommendationsConfig.industryRecommendations[industry]) {
            
            const industryRecs = this.recommendationsConfig.industryRecommendations[industry];
            
            // Get recommendations for current score category
            const categoryRecs = industryRecs[scoreCategory] || {};
            
            // Add immediate recommendations
            if (categoryRecs.immediate) {
                categoryRecs.immediate.forEach(rec => {
                    recommendations.push({
                        ...rec,
                        source: 'industry',
                        sourceName: this.getIndustryName(industry)
                    });
                });
            }
            
            // Add short-term recommendations if low score
            if (scoreCategory === 'lowScore' && categoryRecs.shortTerm) {
                categoryRecs.shortTerm.forEach(rec => {
                    recommendations.push({
                        ...rec,
                        source: 'industry',
                        sourceName: this.getIndustryName(industry)
                    });
                });
            }
        } else {
            // Fallback to local industry recommendations
            const industryRecs = this.industryRecommendations[industry];
            if (!industryRecs) return recommendations;
            
            // Add recommendations if overall score is below threshold
            industryRecs.forEach(rec => {
                if (overallScore <= rec.scoreThreshold) {
                    recommendations.push({
                        ...rec,
                        source: 'industry',
                        sourceName: this.getIndustryName(industry)
                    });
                }
            });
        }
        
        return recommendations;
    }
    
    /**
     * Prioritize recommendations by importance
     * @param {Array} recommendations - All recommendations
     * @return {Array} - Prioritized recommendations
     */
    prioritizeRecommendations(recommendations) {
        // First sort by priority
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        
        // Clone and sort recommendations
        return [...recommendations].sort((a, b) => {
            // First by priority
            const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
            if (priorityDiff !== 0) return priorityDiff;
            
            // Then by relevance score (if available)
            if (a.relevanceScore && b.relevanceScore) {
                return b.relevanceScore - a.relevanceScore;
            }
            
            // Then by score threshold (higher threshold first)
            return (b.scoreThreshold || 0) - (a.scoreThreshold || 0);
        });
    }
    
    /**
     * Determine implementation timeline based on priority and score
     * @param {string} priority - Recommendation priority
     * @param {number} overallScore - Overall assessment score
     * @return {string} - Implementation timeline
     */
    determineTimeline(priority, overallScore) {
        // Base timeline on priority
        if (priority === 'high') {
            return overallScore < 40 ? 'Immediate (0-30 days)' : 'Short-term (1-3 months)';
        } else if (priority === 'medium') {
            return overallScore < 60 ? 'Short-term (1-3 months)' : 'Medium-term (3-6 months)';
        } else {
            return overallScore < 70 ? 'Medium-term (3-6 months)' : 'Long-term (6-12 months)';
        }
    }
    
    /**
     * Estimate ROI based on recommendation and company profile
     * @param {Object} recommendation - Recommendation object
     * @param {string} industry - Industry ID
     * @param {string} companySize - Company size category
     * @return {string} - Estimated ROI
     */
    estimateROI(recommendation, industry, companySize) {
        // Base ROI ranges by priority
        const baseROI = {
            high: '20-30%',
            medium: '15-25%',
            low: '10-15%'
        };
        
        // Adjust based on industry
        const industryMultipliers = {
            b2b_saas: 1.2,
            ecommerce_retail: 1.3,
            financial_services: 1.1,
            healthcare: 0.9,
            manufacturing: 0.8
        };
        
        // Adjust based on company size
        const sizeMultipliers = {
            enterprise: 0.8,  // More complexity, harder to achieve high ROI
            mid_market: 1.0,  // Baseline
            small_business: 1.2  // More agility, easier to achieve high ROI
        };
        
        // Get multipliers
        const industryMultiplier = industryMultipliers[industry] || 1.0;
        const sizeMultiplier = sizeMultipliers[companySize] || 1.0;
        
        // If recommendation has specific ROI, use that
        if (recommendation.roi) {
            return recommendation.roi;
        }
        
        // Otherwise calculate based on priority and adjustments
        const range = baseROI[recommendation.priority] || baseROI.medium;
        
        // Simple output with general range
        return range;
    }
    
    /**
     * Determine implementation complexity
     * @param {Object} recommendation - Recommendation object
     * @param {number} overallScore - Overall assessment score
     * @return {string} - Complexity level
     */
    determineComplexity(recommendation, overallScore) {
        // Base complexity on priority and source
        if (recommendation.source === 'activity') {
            return 'Medium';
        } else if (recommendation.priority === 'high') {
            return overallScore < 50 ? 'Low' : 'Medium';
        } else if (recommendation.priority === 'medium') {
            return 'Medium';
        } else {
            return overallScore < 70 ? 'Medium' : 'High';
        }
    }
    
    /**
     * Calculate relevance score for recommendation
     * @param {Object} recommendation - Recommendation object
     * @param {number} overallScore - Overall assessment score
     * @param {Object} dimensionScores - Dimension scores
     * @return {number} - Relevance score (0-100)
     */
    calculateRelevanceScore(recommendation, overallScore, dimensionScores) {
        // Base score on priority
        let score = {
            high: 80,
            medium: 60,
            low: 40
        }[recommendation.priority] || 50;
        
        // Adjust based on dimension score if applicable
        if (recommendation.dimension && dimensionScores[recommendation.dimension]) {
            const dimensionScore = dimensionScores[recommendation.dimension];
            
            // More relevant if dimension score is low
            if (dimensionScore < 40) score += 15;
            else if (dimensionScore < 60) score += 10;
            else if (dimensionScore < 80) score += 5;
            else score -= 10; // Less relevant if dimension score is already high
        }
        
        // Cap at 100
        return Math.min(100, Math.max(0, score));
    }
    
    /**
     * Format dimension name for display
     * @param {string} dimension - Dimension ID
     * @return {string} - Formatted dimension name
     */
    formatDimension(dimension) {
        // Convert snake_case to Title Case
        return dimension.split('_').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }
    
    /**
     * Get activity name from ID
     * @param {string} activityId - Activity ID
     * @return {string} - Activity name
     */
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
    
    /**
     * Get industry name from ID
     * @param {string} industryId - Industry ID
     * @return {string} - Industry name
     */
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
}

// Export as ES6 module only - no global registration needed
export { InhouseRecommendationsEngine };
