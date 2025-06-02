/**
 * Assessment Framework - Base Scoring Engine
 * 
 * Provides core scoring functionality that can be extended by specific assessment types
 */

/**
 * Base class for all scoring engines in the assessment framework
 */
export class ScoringEngineBase {
    /**
     * Constructor for the scoring engine
     * @param {Object} config - Scoring configuration
     */
    constructor(config) {
        this.config = config;
        this.weights = this.config.weights || {};
    }
    
    /**
     * Calculate the overall score based on dimension scores
     * @param {Object} dimensionScores - Object containing scores for each dimension
     * @return {Number} - The overall score
     */
    calculateOverallScore(dimensionScores) { 
        throw new Error('Must implement calculateOverallScore');
    }
    
    /**
     * Calculate a score for a specific dimension
     * @param {Object} answers - User's answers
     * @param {Array} questions - Questions for this dimension
     * @return {Number} - The dimension score
     */
    calculateDimensionScore(answers, questions) { 
        throw new Error('Must implement calculateDimensionScore');
    }
    
    /**
     * Calculate scores for all dimensions
     * @param {Object} answers - User's answers to all questions
     * @param {Array} questions - All questions grouped by dimension
     * @return {Object} - Scores for each dimension
     */
    calculateDimensionScores(answers, questions) {
        const dimensionScores = {};
        
        // Group questions by dimension
        const questionsByDimension = this.groupQuestionsByDimension(questions);
        
        // Calculate score for each dimension
        Object.keys(questionsByDimension).forEach(dimension => {
            dimensionScores[dimension] = this.calculateDimensionScore(
                answers, 
                questionsByDimension[dimension]
            );
        });
        
        return dimensionScores;
    }
    
    /**
     * Group questions by dimension
     * @param {Array} questions - All questions
     * @return {Object} - Questions grouped by dimension
     */
    groupQuestionsByDimension(questions) {
        const questionsByDimension = {};
        
        questions.forEach(question => {
            const dimension = question.dimension;
            
            if (!questionsByDimension[dimension]) {
                questionsByDimension[dimension] = [];
            }
            
            questionsByDimension[dimension].push(question);
        });
        
        return questionsByDimension;
    }
    
    /**
     * Get the weight for a specific dimension
     * @param {String} dimension - The dimension ID
     * @return {Number} - The weight for this dimension
     */
    getDimensionWeight(dimension) {
        if (this.weights.dimensions && this.weights.dimensions[dimension] !== undefined) {
            return this.weights.dimensions[dimension];
        }
        
        // Default weight if not specified
        return 1;
    }
    
    /**
     * Get the weight for a specific question
     * @param {Object} question - The question object
     * @return {Number} - The weight for this question
     */
    getQuestionWeight(question) {
        // Return question-specific weight if available
        if (question.weight !== undefined) {
            return question.weight;
        }
        
        // Default weight if not specified
        return 1;
    }
}

// No global registration - using ES6 modules
