export class ScoringEngine {
    constructor(customScoring, assessmentType = 'agency-vulnerability') {
        this.customScoring = customScoring;
        this.assessmentType = assessmentType;
        this.weights = customScoring?.weights || this.defaultWeights;
        this.specificScoringEngine = null;
        
        // Initialize the specific scoring engine
        this.initializeSpecificEngine();
    }
    
    /**
     * Dynamically load and instantiate the assessment-specific scoring engine
     */
    async initializeSpecificEngine() {
        try {
            // Dynamically import the appropriate scoring engine based on assessment type
            const scoringModule = await import(`../../assessments/${this.assessmentType}/scoring.js`);
            const ScoringClass = scoringModule.default;
            
            if (ScoringClass) {
                this.specificScoringEngine = new ScoringClass(this.customScoring);
                console.log(`Loaded specific scoring engine for ${this.assessmentType}`);
            } else {
                console.warn(`Scoring module found for ${this.assessmentType} but no default export`);
            }
        } catch (error) {
            console.error(`Failed to load scoring engine for ${this.assessmentType}:`, error);
            // Continue with base implementation if specific engine can't be loaded
        }
    }

    async calculate(responses, context) {
        // Ensure specific scoring engine is initialized
        if (!this.specificScoringEngine) {
            await this.initializeSpecificEngine();
        }
        
        // If we have a specific scoring engine, use it
        if (this.specificScoringEngine && this.specificScoringEngine.calculateScores) {
            try {
                // Use the assessment-specific calculation method
                const specificScores = this.specificScoringEngine.calculateScores(responses, context);
                
                // Format the result to match our expected structure
                // Handle different return formats from different scoring engines
                
                // For overall score - check different possible property names
                const overall = specificScores.overallScore || specificScores.overall || 
                               (specificScores.scores?.overall) || 0;
                
                // For dimensions - could be dimensions property or direct properties in specificScores
                let dimensions;
                if (specificScores.dimensions) {
                    dimensions = specificScores.dimensions;
                } else if (specificScores.dimensionScores) {
                    dimensions = specificScores.dimensionScores;
                } else {
                    // Create dimensions from known properties for different scoring engines
                    dimensions = {};
                    
                    // For agency scoring
                    if (specificScores.transformationScore !== undefined) {
                        dimensions.transformation = specificScores.transformationScore;
                        dimensions.valuation = specificScores.valuationScore;
                    }
                    
                    // For inhouse marketing scoring
                    if (specificScores.humanReadiness !== undefined) {
                        dimensions.humanReadiness = specificScores.humanReadiness;
                        dimensions.technicalReadiness = specificScores.technicalReadiness;
                        dimensions.activityAutomation = specificScores.activityAutomation;
                    }
                }
                
                // Get insights if available or generate them
                const insights = specificScores.insights || this.generateInsights(specificScores, context);
                
                // Additional data passed through intact
                const additionalData = {};
                
                // Copy relevant data from the specific scoring engine's result
                if (specificScores.categoryScores) additionalData.categoryScores = specificScores.categoryScores;
                if (specificScores.activityScores) additionalData.activityScores = specificScores.activityScores;
                if (specificScores.serviceScores) additionalData.serviceScores = specificScores.serviceScores;
                if (specificScores.valuationMetrics) additionalData.valuationMetrics = specificScores.valuationMetrics;
                if (specificScores.vulnerabilityMetrics) additionalData.vulnerabilityMetrics = specificScores.vulnerabilityMetrics;
                
                return {
                    overall: overall,
                    dimensions: dimensions,
                    insights: insights,
                    ...additionalData
                };
            } catch (error) {
                console.error('Error using specific scoring engine:', error);
                // Fall back to base implementation
            }
        }
        
        // Base scoring logic used by all assessments (fallback)
        console.log('Using base scoring implementation');
        let scores = this.calculateDimensionScores(responses);

        // Apply custom scoring if provided
        if (this.customScoring?.calculate) {
            scores = this.customScoring.calculate(scores, responses, context);
        }

        // Apply context-based adjustments
        scores = this.applyContextAdjustments(scores, context);

        return {
            overall: this.calculateOverallScore(scores),
            dimensions: scores,
            insights: this.generateInsights(scores, context)
        };
    }

    calculateDimensionScores(responses) {
        // Implementation for base dimension calculation
        return {};
    }

    calculateOverallScore(dimensionScores) {
        // Implementation for overall score calculation
        return 0;
    }

    applyContextAdjustments(scores, context) {
        // Apply size, industry, or other contextual adjustments
        return scores;
    }

    generateInsights(scores, context) {
        // Generate insights based on scores
        return [];
    }
    
    /**
     * Generate a complete assessment report with detailed insights and recommendations
     * Delegates to assessment-specific report generation if available
     */
    async generateReport(scores, context) {
        // Ensure specific scoring engine is initialized
        if (!this.specificScoringEngine) {
            await this.initializeSpecificEngine();
        }
        
        // If specific scoring engine has report generation capabilities, use them
        if (this.specificScoringEngine) {
            try {
                // Check for various report generation methods that might exist in specific engines
                if (typeof this.specificScoringEngine.generateReport === 'function') {
                    return this.specificScoringEngine.generateReport(scores, context);
                }
                
                // Calculate additional data needed for report generation if it's not already in scores
                let serviceScores = scores.serviceScores;
                let activityScores = scores.activityScores;
                
                // For Agency Transformation Scoring
                if (this.assessmentType === 'agency-vulnerability') {
                    // Calculate service scores if not already available
                    if (!serviceScores && typeof this.specificScoringEngine.calculateServiceScores === 'function') {
                        serviceScores = this.specificScoringEngine.calculateServiceScores(
                            scores.dimensions,
                            context.selectedServices || []
                        );
                    }
                    
                    // Calculate risk factors if needed
                    let riskFactors = scores.riskFactors;
                    if (!riskFactors && typeof this.specificScoringEngine.calculateDetailedRiskFactors === 'function') {
                        riskFactors = this.specificScoringEngine.calculateDetailedRiskFactors(
                            context.answers || {},
                            serviceScores || {},
                            context
                        );
                    }
                    
                    // Generate priorities if the method exists
                    if (typeof this.specificScoringEngine.identifyTransformationPriorities === 'function') {
                        const priorities = this.specificScoringEngine.identifyTransformationPriorities(
                            scores.dimensions, 
                            serviceScores || {},
                            riskFactors || {},
                            context.agencySize || context.companySize
                        );
                        
                        // Build a report structure with the priorities
                        return this.generateBaseReport(scores, context, priorities);
                    }
                }
                
                // For In-house Marketing Scoring
                if (this.assessmentType === 'inhouse-marketing') {
                    // Calculate activity scores if not already available
                    if (!activityScores && typeof this.specificScoringEngine.calculateActivityScores === 'function') {
                        activityScores = this.specificScoringEngine.calculateActivityScores(
                            context.answers || {},
                            context.selectedActivities || []
                        );
                    }
                    
                    // Generate priorities if the method exists
                    if (typeof this.specificScoringEngine.identifyPriorities === 'function') {
                        const priorities = this.specificScoringEngine.identifyPriorities(
                            scores.categoryScores || {},
                            activityScores || {},
                            context.selectedActivities || [],
                            context.companySize || context.teamSize
                        );
                        
                        // Build a report structure with the priorities
                        return this.generateBaseReport(scores, context, priorities);
                    }
                }
            } catch (error) {
                console.error('Error generating report with specific scoring engine:', error);
                // Fall back to base report generation
            }
        }
        
        // Fallback to basic report generation
        return this.generateBaseReport(scores, context);
    }
    
    /**
     * Generate a basic report structure as fallback
     */
    generateBaseReport(scores, context, priorities = []) {
        const title = this.assessmentType === 'inhouse-marketing' ? 
            'Marketing AI Maturity Assessment' : 
            'Agency AI Vulnerability Assessment';
            
        return {
            title: title,
            summary: this.generateSummary(scores),
            executive: {
                headline: 'Your Assessment Results',
                subheadline: 'Detailed analysis and recommendations below',
                overallScore: scores.overall || 0
            },
            readiness: {
                title: `${this.assessmentType === 'inhouse-marketing' ? 'Marketing' : 'Agency'} AI Readiness Assessment`,
                subtitle: 'How your organization compares across key dimensions',
                dimensions: this.generateDimensionCards(scores)
            },
            recommendations: priorities || [],
            nextSteps: {
                booking: {
                    headline: 'Ready to move forward?',
                    subheadline: 'Schedule a consultation to get personalized insights'
                }
            }
        };
    }
    
    /**
     * Generate a summary based on the overall score
     */
    generateSummary(scores) {
        const overallScore = scores.overall || scores.overallScore || 0;
        
        if (overallScore < 30) {
            return `Your ${this.assessmentType === 'inhouse-marketing' ? 'marketing team' : 'agency'} is in the early stages of AI readiness. There are significant opportunities to improve.`;
        } else if (overallScore < 60) {
            return `Your ${this.assessmentType === 'inhouse-marketing' ? 'marketing team' : 'agency'} has established some AI foundations but needs further development in key areas.`;
        } else if (overallScore < 80) {
            return `Your ${this.assessmentType === 'inhouse-marketing' ? 'marketing team' : 'agency'} demonstrates good AI maturity with specific opportunities for optimization.`;
        } else {
            return `Your ${this.assessmentType === 'inhouse-marketing' ? 'marketing team' : 'agency'} shows high AI maturity across multiple dimensions. Focus on refinement and innovation.`;
        }
    }
    
    /**
     * Generate dimension cards for the readiness section
     */
    generateDimensionCards(scores) {
        const dimensionCards = [];
        const dimensionData = scores.dimensions || {};
        
        // Generate card for each dimension
        Object.entries(dimensionData).forEach(([dimension, data]) => {
            const score = typeof data === 'object' ? (data.score || 0) : (data || 0);
            
            dimensionCards.push({
                name: this.formatDimension(dimension),
                score: score,
                description: `Your ${this.formatDimension(dimension).toLowerCase()} score indicates ${score < 40 ? 'areas for improvement' : score < 70 ? 'moderate capability' : 'strong capability'}.`
            });
        });
        
        // Sort by score (descending)
        dimensionCards.sort((a, b) => b.score - a.score);
        
        return dimensionCards;
    }
    
    /**
     * Format dimension names for display
     */
    formatDimension(dimension) {
        // Format dimension names for display
        const dimensionLabels = {
            'technology': 'Technology',
            'process': 'Process',
            'people': 'People',
            'strategy': 'Strategy',
            'content': 'Content',
            'analytics': 'Analytics',
            'humanReadiness': 'Human Readiness',
            'technicalReadiness': 'Technical Readiness',
            'activityAutomation': 'Activity Automation',
            'transformation': 'Transformation',
            'resources': 'Resources',
            'leadership': 'Leadership',
            'change': 'Change Readiness'
        };
        
        return dimensionLabels[dimension] || 
               (dimension.charAt(0).toUpperCase() + dimension.slice(1).replace(/([A-Z])/g, ' $1'));
    }
}

export default ScoringEngine;
