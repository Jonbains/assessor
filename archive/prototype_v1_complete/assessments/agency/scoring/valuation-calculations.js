/**
 * Valuation Calculations
 * Extracted from valuation-insights.js - Utility functions for calculating valuation metrics
 */

/**
 * Calculate EBIT impact based on assessment scores
 * @param {Object} scores - The dimension scores from the assessment
 * @return {number} EBIT impact percentage
 */
export function calculateEbitImpact(scores) {
    // Base impact on overall score
    let baseImpact = 0;
    
    if (scores.overall >= 80) {
        baseImpact = 25; // High performance can improve EBIT by 25%
    } else if (scores.overall >= 60) {
        baseImpact = 15; // Good performance can improve EBIT by 15%
    } else if (scores.overall >= 40) {
        baseImpact = 10; // Average performance can improve EBIT by 10%
    } else {
        baseImpact = 5; // Poor performance has limited EBIT improvement potential
    }
    
    // Adjust based on AI capability score
    let aiAdjustment = 0;
    if (scores.ai >= 70) {
        aiAdjustment = 5; // Strong AI capabilities add 5% to EBIT impact
    } else if (scores.ai <= 30) {
        aiAdjustment = -5; // Weak AI capabilities reduce EBIT impact by 5%
    }
    
    return baseImpact + aiAdjustment;
}

/**
 * Calculate valuation impact based on assessment scores
 * @param {Object} scores - The dimension scores from the assessment
 * @return {Object} Valuation insights and metrics
 */
export function calculateValuationImpact(scores) {
    const valuationData = {
        baseMultiple: 0,
        adjustments: [],
        riskProfile: '',
        potentialImprovement: 0,
        serviceTypeMultiple: 0,
        driverScores: {}
    };
    
    // Calculate base EBITDA multiple based on overall score
    if (scores.overall >= 80) {
        valuationData.baseMultiple = 7.5;
        valuationData.riskProfile = 'Low Risk';
    } else if (scores.overall >= 60) {
        valuationData.baseMultiple = 6.0;
        valuationData.riskProfile = 'Medium Risk';
    } else if (scores.overall >= 40) {
        valuationData.baseMultiple = 4.5;
        valuationData.riskProfile = 'Medium-High Risk';
    } else {
        valuationData.baseMultiple = 3.0;
        valuationData.riskProfile = 'High Risk';
    }
    
    // Calculate driver scores
    valuationData.driverScores = {
        financial: calculateFinancialDriverScore(scores),
        operational: calculateOperationalDriverScore(scores),
        technology: calculateTechnologyDriverScore(scores),
        strategic: calculateStrategicDriverScore(scores)
    };
    
    // Calculate potential improvement
    valuationData.potentialImprovement = calculatePotentialImprovement(scores);
    
    return valuationData;
}

/**
 * Calculate financial health driver score based on financial dimension
 * @param {Object} scores - The dimension scores from the assessment
 * @return {Number} Financial driver score (0-100)
 */
export function calculateFinancialDriverScore(scores) {
    // Financial health is primarily driven by the financial dimension score
    // but can be slightly improved by operational excellence
    const baseScore = scores.financial || 0;
    const operationalBoost = ((scores.operational || 0) - 50) * 0.1;
    
    return Math.max(0, Math.min(100, baseScore + operationalBoost));
}

/**
 * Calculate operational excellence driver score
 * @param {Object} scores - The dimension scores from the assessment
 * @return {Number} Operational driver score (0-100)
 */
export function calculateOperationalDriverScore(scores) {
    // Operational excellence is primarily driven by the operational dimension score
    // but can be improved by AI readiness
    const baseScore = scores.operational || 0;
    const aiBoost = ((scores.ai || 0) - 50) * 0.15;
    
    return Math.max(0, Math.min(100, baseScore + aiBoost));
}

/**
 * Calculate technology readiness driver score
 * @param {Object} scores - The dimension scores from the assessment
 * @return {Number} Technology driver score (0-100)
 */
export function calculateTechnologyDriverScore(scores) {
    // Technology readiness is primarily driven by the AI dimension score
    const baseScore = scores.ai || 0;
    
    return Math.max(0, Math.min(100, baseScore));
}

/**
 * Calculate strategic positioning driver score
 * @param {Object} scores - The dimension scores from the assessment
 * @return {Number} Strategic driver score (0-100)
 */
export function calculateStrategicDriverScore(scores) {
    // Strategic positioning is the average of all dimension scores
    // with a slight emphasis on the strategic dimension if available
    const strategicScore = scores.strategic || scores.overall || 0;
    const averageOtherScores = (
        (scores.financial || 0) + 
        (scores.operational || 0) + 
        (scores.ai || 0)
    ) / 3;
    
    return Math.max(0, Math.min(100, strategicScore * 0.6 + averageOtherScores * 0.4));
}

/**
 * Calculate potential EBITDA multiple improvement
 * @param {Object} scores - The dimension scores from the assessment
 * @return {Number} Potential EBITDA multiple improvement
 */
export function calculatePotentialImprovement(scores) {
    // Base improvement potential on the gap between current scores and optimal scores
    let potentialPoints = 0;
    
    // Calculate improvement potential for each dimension
    const dimensions = ['financial', 'operational', 'ai', 'strategic'];
    dimensions.forEach(dim => {
        const score = scores[dim] || 0;
        const gap = 100 - score;
        
        // Weight the dimensions differently for impact on valuation
        let weight = 0.25; // Equal weight by default
        if (dim === 'financial') weight = 0.35;
        if (dim === 'operational') weight = 0.30;
        if (dim === 'ai') weight = 0.20;
        if (dim === 'strategic') weight = 0.15;
        
        potentialPoints += gap * weight;
    });
    
    // Convert improvement points to EBITDA multiple (max 2.5x improvement)
    const maxImprovement = 2.5;
    const improvementMultiple = (potentialPoints / 100) * maxImprovement;
    
    return Math.min(maxImprovement, Math.max(0, improvementMultiple));
}

/**
 * Generate prioritized recommendations based on valuation impact
 * @param {Object} results - The assessment results
 * @return {Array} Enhanced recommendations with valuation impact
 */
export function enhanceRecommendations(results) {
    if (!results.recommendations || !results.recommendations.length) {
        return [];
    }
    
    const enhancedRecommendations = [];
    
    // Enhance each recommendation with valuation impact
    results.recommendations.forEach((rec, index) => {
        const enhanced = Object.assign({}, rec); // Clone original recommendation
        
        // Add valuation impact based on category
        if (rec.category === 'financial' || 
            rec.title.toLowerCase().includes('financial') || 
            rec.title.toLowerCase().includes('revenue') || 
            rec.title.toLowerCase().includes('client')) {
            enhanced.valuationImpact = 'High';
            enhanced.valuationDesc = 'Could add 0.5-0.8x to EBITDA multiple by improving key financial metrics';
            enhanced.priority = 1;
        } else if (rec.category === 'operational' || 
                  rec.title.toLowerCase().includes('process') ||
                  rec.title.toLowerCase().includes('team') || 
                  rec.title.toLowerCase().includes('efficiency')) {
            enhanced.valuationImpact = 'Medium-High';
            enhanced.valuationDesc = 'Could add 0.3-0.5x to EBITDA multiple through operational improvements';
            enhanced.priority = 2;
        } else if (rec.category === 'technology' || 
                  rec.category === 'ai' || 
                  rec.title.toLowerCase().includes('ai') || 
                  rec.title.toLowerCase().includes('digital')) {
            enhanced.valuationImpact = 'Medium';
            enhanced.valuationDesc = 'Could add 0.2-0.4x to EBITDA multiple by enhancing technology readiness';
            enhanced.priority = 3;
        } else {
            enhanced.valuationImpact = 'Supportive';
            enhanced.valuationDesc = 'Contributes to overall agency positioning and competitive differentiation';
            enhanced.priority = 4;
        }
        
        // Add implementation difficulty
        if (index % 3 === 0) {
            enhanced.difficulty = 'Low';
            enhanced.timeframe = 'Immediate (0-30 days)';
        } else if (index % 3 === 1) {
            enhanced.difficulty = 'Medium';
            enhanced.timeframe = 'Short-term (1-3 months)';
        } else {
            enhanced.difficulty = 'High';
            enhanced.timeframe = 'Strategic (3-6 months)';
        }
        
        enhancedRecommendations.push(enhanced);
    });
    
    // Sort by priority (valuation impact)
    enhancedRecommendations.sort((a, b) => a.priority - b.priority);
    
    return enhancedRecommendations;
}

// Format a number as currency
export function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
    }).format(value);
}

// Export all utility functions
export default {
    calculateEbitImpact,
    calculateValuationImpact,
    calculateFinancialDriverScore,
    calculateOperationalDriverScore,
    calculateTechnologyDriverScore,
    calculateStrategicDriverScore,
    calculatePotentialImprovement,
    enhanceRecommendations,
    formatCurrency
};
