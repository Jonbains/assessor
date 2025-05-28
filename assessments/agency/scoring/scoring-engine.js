/**
 * Assessment Framework - Agency Scoring Engine
 * 
 * Implements the agency-specific scoring algorithms for calculating assessment results
 * Extends the base scoring engine with agency-specific scoring logic
 */

import { ScoringBase } from '../../../core/scoring-base.js';

/**
 * AgencyScoringEngine class
 * Agency-specific scoring implementation with M&A valuation focus
 */
export class AgencyScoringEngine extends ScoringBase {
    /**
     * Constructor for agency scoring engine
     * @param {Object} config - Scoring configuration
     */
    constructor(config) {
        super(config);
        this.type = 'agency';
        
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
        
        // Group questions by dimension
        const questionsByDimension = this.groupQuestionsByDimension(questions);
        
        // Calculate scores for each dimension
        const dimensionScores = {};
        Object.keys(questionsByDimension).forEach(dimension => {
            dimensionScores[dimension] = this.calculateDimensionScore(
                answers, 
                questionsByDimension[dimension]
            );
        });
        
        // Calculate overall score
        const overallScore = this.calculateOverallScore(dimensionScores);
        
        // Calculate service-specific scores
        const serviceScores = this.calculateServiceScores(
            answers, 
            questions, 
            assessmentData.selectedServices || []
        );
        
        // Build and return the results object
        return {
            overallScore,
            dimensionScores,
            serviceScores,
            timestamp: new Date().getTime(),
            agencyType: assessmentData.selectedAgencyType,
            assessmentType: this.type
        };
    }
    
    /**
     * Calculate the overall score based on dimension scores
     * @param {Object} dimensionScores - Object containing scores for each dimension
     * @return {Number} - The overall score (0-100)
     */
    calculateOverallScore(dimensionScores) {
        let weightSum = 0;
        let weightedScoreSum = 0;
        
        // Calculate weighted sum of dimension scores
        Object.keys(dimensionScores).forEach(dimension => {
            const weight = this.agencyWeights[dimension] || 1;
            weightSum += weight;
            weightedScoreSum += dimensionScores[dimension] * weight;
        });
        
        // Calculate weighted average
        const overallScore = weightSum > 0 ? weightedScoreSum / weightSum : 0;
        
        // Round to the nearest integer
        return Math.round(overallScore);
    }
    
    /**
     * Calculate a score for a specific dimension
     * @param {Object} answers - User's answers
     * @param {Array} questions - Questions for this dimension
     * @return {Number} - The dimension score (0-100)
     */
    calculateDimensionScore(answers, questions) {
        if (!questions || questions.length === 0) {
            return 0;
        }
        
        let totalWeight = 0;
        let weightedScoreSum = 0;
        
        // Calculate weighted sum of question scores
        questions.forEach(question => {
            if (answers.hasOwnProperty(question.id)) {
                const weight = this.getQuestionWeight(question);
                const answerScore = answers[question.id];
                
                totalWeight += weight;
                weightedScoreSum += answerScore * weight;
            }
        });
        
        // Calculate weighted average
        const dimensionScore = totalWeight > 0 ? (weightedScoreSum / totalWeight) * 20 : 0;
        
        // Round to the nearest integer and ensure value is between 0-100
        return Math.min(100, Math.max(0, Math.round(dimensionScore)));
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
        
        // Calculate score for each service
        selectedServices.forEach(serviceId => {
            const serviceQuestions = questionsByService[serviceId];
            
            // Include related core questions
            const coreQuestions = questions.filter(q => 
                !q.serviceId && !q.service && (!q.tags || !q.tags.some(tag => selectedServices.includes(tag)))
            );
            
            // Calculate score
            const serviceScore = this.calculateServiceScore(
                answers, 
                [...serviceQuestions, ...coreQuestions],
                serviceId
            );
            
            serviceScores[serviceId] = serviceScore;
        });
        
        return serviceScores;
    }
    
    /**
     * Calculate score for a specific service
     * @param {Object} answers - User's answers
     * @param {Array} questions - Questions for this service
     * @param {String} serviceId - Service identifier
     * @return {Number} - Service score (0-100)
     */
    calculateServiceScore(answers, questions, serviceId) {
        // Weight service-specific questions higher
        const dimensionScores = {};
        const serviceSpecificQuestions = questions.filter(q => 
            q.serviceId === serviceId || q.service === serviceId ||
            (q.tags && q.tags.includes(serviceId))
        );
        
        // Group questions by dimension
        const questionsByDimension = this.groupQuestionsByDimension(questions);
        
        // Calculate scores for each dimension
        Object.keys(questionsByDimension).forEach(dimension => {
            dimensionScores[dimension] = this.calculateDimensionScore(
                answers, 
                questionsByDimension[dimension]
            );
        });
        
        // For AI dimension, weight AI-related questions higher for service scores
        if (dimensionScores.ai && serviceSpecificQuestions.length > 0) {
            const aiServiceQuestions = serviceSpecificQuestions.filter(q => q.dimension === 'ai');
            if (aiServiceQuestions.length > 0) {
                const aiServiceScore = this.calculateDimensionScore(answers, aiServiceQuestions);
                dimensionScores.ai = (dimensionScores.ai + aiServiceScore * 2) / 3;
            }
        }
        
        // Calculate weighted average
        return this.calculateOverallScore(dimensionScores);
    }
    
    /**
     * Calculate valuation impact based on assessment scores
     * @param {Number} overallScore - Overall assessment score
     * @param {Object} dimensionScores - Scores for each dimension
     * @param {Number} revenue - Agency annual revenue
     * @return {Object} - Valuation impact data
     */
    calculateValuationImpact(overallScore, dimensionScores, revenue) {
        let ebitImpact = 0;
        
        // Calculate EBIT impact based on overall score
        if (overallScore < 40) {
            ebitImpact = -15; // High negative impact for low scores
        } else if (overallScore < 60) {
            ebitImpact = -8; // Moderate negative impact for medium-low scores
        } else if (overallScore < 80) {
            ebitImpact = 5; // Positive impact for medium-high scores
        } else {
            ebitImpact = 15; // High positive impact for high scores
        }
        
        // Adjust for AI dimension - weight it more heavily
        if (dimensionScores.ai) {
            if (dimensionScores.ai < 30) {
                ebitImpact -= 5;
            } else if (dimensionScores.ai > 70) {
                ebitImpact += 5;
            }
        }
        
        // Calculate valuation impact
        const valuationMultiple = 8; // Average agency multiple
        const ebitAmount = revenue * 0.15; // Assume 15% EBIT
        const ebitChange = ebitAmount * (ebitImpact / 100);
        const valuationImpact = ebitChange * valuationMultiple;
        
        return {
            ebitImpact,
            ebitAmount,
            ebitChange,
            valuationMultiple,
            valuationImpact
        };
    }
}
