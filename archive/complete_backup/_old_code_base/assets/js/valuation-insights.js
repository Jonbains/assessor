/**
 * Valuation Insights Module for Obsolete Agency Assessment
 * Translates assessment results into valuation context and business impact insights
 */

var ValuationInsights = {
    
    /**
     * Calculate insights based on assessment data
     * @param {Object} data - The assessment data including revenue and scores
     * @return {Object} Valuation insights and metrics
     */
    calculateInsights: function(data) {
        console.log('[ValuationInsights] Calculating insights from data:', data);
        
        try {
            var scores = data.scores || {};
            var revenue = parseFloat(data.revenue) || 0;
            
            // Calculate base valuation impact
            var baseImpact = this.calculateValuationImpact(scores);
            
            // Calculate EBIT impact percentage
            var ebitImpact = this.calculateEbitImpact(scores);
            
            // Calculate valuation impact in dollars
            var valuationImpact = 0;
            if (revenue > 0) {
                // Assuming a 15% profit margin as default if not provided
                var assumedEbitMargin = 0.15;
                var baseEbit = revenue * assumedEbitMargin;
                var potentialEbitImprovement = baseEbit * (ebitImpact / 100);
                valuationImpact = potentialEbitImprovement * baseImpact.baseMultiple;
            }
            
            return {
                ebitImpact: Math.round(ebitImpact * 10) / 10, // Round to 1 decimal place
                valuationImpact: Math.round(valuationImpact / 1000) * 1000, // Round to nearest thousand
                baseMultiple: baseImpact.baseMultiple,
                riskProfile: baseImpact.riskProfile,
                driverScores: baseImpact.driverScores
            };
        } catch (error) {
            console.error('[ValuationInsights] Error calculating insights:', error);
            return {
                ebitImpact: 0,
                valuationImpact: 0,
                baseMultiple: 0,
                riskProfile: 'Error',
                driverScores: {}
            };
        }
    },
    
    /**
     * Calculate EBIT impact based on assessment scores
     * @param {Object} scores - The dimension scores from the assessment
     * @return {number} EBIT impact percentage
     */
    calculateEbitImpact: function(scores) {
        // Base impact on overall score
        var baseImpact = 0;
        
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
        var aiAdjustment = 0;
        if (scores.ai >= 70) {
            aiAdjustment = 5; // Strong AI capabilities add 5% to EBIT impact
        } else if (scores.ai <= 30) {
            aiAdjustment = -5; // Weak AI capabilities reduce EBIT impact by 5%
        }
        
        return baseImpact + aiAdjustment;
    },
    
    /**
     * Calculate valuation impact based on assessment scores
     * @param {Object} scores - The dimension scores from the assessment
     * @return {Object} Valuation insights and metrics
     */
    calculateValuationImpact: function(scores) {
        var valuationData = {
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
            valuationData.riskProfile = 'Moderate Risk';
        } else if (scores.overall >= 40) {
            valuationData.baseMultiple = 4.5;
            valuationData.riskProfile = 'Elevated Risk';
        } else {
            valuationData.baseMultiple = 3.5;
            valuationData.riskProfile = 'High Risk';
        }
        
        // Calculate driver scores based on weighted dimension scores
        // Financial Health (40% weight)
        valuationData.driverScores.financial = this.calculateFinancialDriverScore(scores);
        
        // Operational Excellence (30% weight)
        valuationData.driverScores.operational = this.calculateOperationalDriverScore(scores);
        
        // Technology Readiness (20% weight)
        valuationData.driverScores.technology = this.calculateTechnologyDriverScore(scores);
        
        // Strategic Positioning (10% weight)
        valuationData.driverScores.strategic = this.calculateStrategicDriverScore(scores);
        
        // Calculate weighted valuation score
        var weightedScore = (
            (valuationData.driverScores.financial * 0.4) +
            (valuationData.driverScores.operational * 0.3) +
            (valuationData.driverScores.technology * 0.2) +
            (valuationData.driverScores.strategic * 0.1)
        );
        
        // Refine EBITDA multiple range based on weighted score
        var rangeAdjustment = (weightedScore - scores.overall) / 20; // Normalize to small adjustment
        valuationData.baseMultiple += rangeAdjustment;
        
        // Generate low-high range (±10%)
        valuationData.multipleLow = Math.max(2, Math.round((valuationData.baseMultiple * 0.9) * 10) / 10);
        valuationData.multipleHigh = Math.round((valuationData.baseMultiple * 1.1) * 10) / 10;
        
        // Calculate potential improvement
        valuationData.potentialImprovement = this.calculatePotentialImprovement(scores);
        
        return valuationData;
    },
    
    /**
     * Calculate financial health driver score based on financial dimension
     * @param {Object} scores - The dimension scores from the assessment
     * @return {Number} Financial driver score (0-100)
     */
    calculateFinancialDriverScore: function(scores) {
        // In a real implementation, this would analyze specific financial questions
        // For now, we'll use the financial dimension score as a proxy
        var baseScore = scores.financial || 0;
        
        // Apply minor adjustments based on other dimensions
        var adjustment = 0;
        if (scores.operational && scores.operational > 70) adjustment += 5;
        if (scores.ai && scores.ai < 40) adjustment -= 5;
        
        return Math.min(100, Math.max(0, baseScore + adjustment));
    },
    
    /**
     * Calculate operational excellence driver score
     * @param {Object} scores - The dimension scores from the assessment
     * @return {Number} Operational driver score (0-100)
     */
    calculateOperationalDriverScore: function(scores) {
        // For now, use operational dimension score with small adjustments
        var baseScore = scores.operational || 0;
        
        // Apply adjustments based on other dimensions
        var adjustment = 0;
        if (scores.financial && scores.financial > 75) adjustment += 5;
        if (scores.strategic && scores.strategic < 50) adjustment -= 5;
        
        return Math.min(100, Math.max(0, baseScore + adjustment));
    },
    
    /**
     * Calculate technology readiness driver score
     * @param {Object} scores - The dimension scores from the assessment
     * @return {Number} Technology driver score (0-100)
     */
    calculateTechnologyDriverScore: function(scores) {
        // For now, use AI dimension score with adjustments
        var baseScore = scores.ai || 0;
        
        // Apply adjustments based on other dimensions
        var adjustment = 0;
        if (scores.operational && scores.operational > 70) adjustment += 5;
        if (scores.strategic && scores.strategic > 80) adjustment += 5;
        
        return Math.min(100, Math.max(0, baseScore + adjustment));
    },
    
    /**
     * Calculate strategic positioning driver score
     * @param {Object} scores - The dimension scores from the assessment
     * @return {Number} Strategic driver score (0-100)
     */
    calculateStrategicDriverScore: function(scores) {
        // For now, use strategic dimension score with adjustments
        var baseScore = scores.strategic || 0;
        
        // Apply adjustments based on other dimensions
        var adjustment = 0;
        if (scores.ai && scores.ai > 75) adjustment += 5;
        if (scores.financial && scores.financial < 50) adjustment -= 5;
        
        return Math.min(100, Math.max(0, baseScore + adjustment));
    },
    
    /**
     * Calculate potential EBITDA multiple improvement
     * @param {Object} scores - The dimension scores from the assessment
     * @return {Number} Potential EBITDA multiple improvement
     */
    calculatePotentialImprovement: function(scores) {
        // Identify biggest gap to improvement
        var lowestScore = 100;
        var lowestDimension = '';
        
        for (var dimension in scores) {
            if (dimension !== 'overall' && dimension !== 'serviceVulnerability' && 
                dimension !== 'serviceAdaptability' && dimension !== 'adjustedAi') {
                if (scores[dimension] < lowestScore) {
                    lowestScore = scores[dimension];
                    lowestDimension = dimension;
                }
            }
        }
        
        // Calculate improvement potential (higher for lower scores)
        var improvementPotential = Math.max(0, (80 - lowestScore) / 20);
        
        // Convert to EBITDA multiple improvement
        return Math.round(improvementPotential * 10) / 10; // 0.1 - 4.0 range
    },
    
    /**
     * Generate valuation insights HTML for display
     * @param {Object} valuationData - The valuation data calculated from scores
     * @param {Object} scores - The dimension scores from the assessment
     * @return {String} HTML content for valuation insights section
     */
    generateValuationInsightsHTML: function(valuationData, scores) {
        var html = '';
        
        // Valuation Impact Section
        html += '<div class="assessment-results-section valuation-impact-section">';
        html += '<h3 class="assessment-results-section-title">Agency Valuation Impact</h3>';
        
        // EBITDA Multiple Range Card - Simplified design
        html += '<div class="valuation-card">';
        html += '<div class="valuation-title">ESTIMATED VALUATION MULTIPLE</div>';
        html += '<div class="valuation-multiplier">' + valuationData.multipleLow + '-' + valuationData.multipleHigh + 'x</div>';
        html += '<div class="valuation-profile">Risk Profile: <span class="valuation-risk-' + valuationData.riskProfile.toLowerCase().replace(' ', '-') + '">' + valuationData.riskProfile + '</span></div>';
        html += '<div class="valuation-context">This range represents the EBITDA multiplier your agency could command based on the assessment results.</div>';
        html += '</div>';
        
        // Valuation Drivers - Simplified layout
        html += '<div class="valuation-drivers">';
        html += '<h4 class="valuation-drivers-title">What Drives Your Valuation</h4>';
        
        // Two-column layout for drivers
        html += '<div class="valuation-drivers-grid">';
        
        // Financial Health Driver (40%)
        html += this.generateDriverHTML('Financial Health', valuationData.driverScores.financial, 40, 'Recurring revenue, client concentration, growth trajectory, EBITDA margins');
        
        // Operational Excellence Driver (30%)
        html += this.generateDriverHTML('Operational Excellence', valuationData.driverScores.operational, 30, 'Process documentation, founder dependency, team stability, scalability');
        
        // Technology Readiness Driver (20%)
        html += this.generateDriverHTML('Technology Readiness', valuationData.driverScores.technology, 20, 'AI integration, digital capabilities, automation level');
        
        // Strategic Positioning Driver (10%)
        html += this.generateDriverHTML('Strategic Positioning', valuationData.driverScores.strategic, 10, 'Sector specialization, geographic advantage, competitive differentiation');
        
        html += '</div>';
        html += '</div>';
        
        // Improvement Potential - More impactful presentation
        if (valuationData.potentialImprovement > 0) {
            html += '<div class="valuation-improvement">';
            html += '<div class="valuation-improvement-content">';
            html += '<h4 class="valuation-improvement-title">Unlock Additional Value</h4>';
            html += '<div class="valuation-improvement-metric">+' + valuationData.potentialImprovement + 'x</div>';
            html += '<div class="valuation-improvement-desc">EBITDA multiple improvement by implementing the recommendations below.</div>';
            html += '</div>';
            html += '</div>';
        }
        
        html += '</div>';
        
        return html;
    },
    
    /**
     * Generate HTML for a single valuation driver
     * @param {String} name - The name of the driver
     * @param {Number} score - The score (0-100)
     * @param {Number} weight - The weight percentage
     * @param {String} description - Description of the driver
     * @return {String} HTML for the driver component
     */
    generateDriverHTML: function(name, score, weight, description) {
        var html = '<div class="valuation-driver">';
        html += '<div class="valuation-driver-header">';
        html += '<div class="valuation-driver-name">' + name + ' <span class="valuation-driver-weight">(' + weight + '%)</span></div>';
        html += '<div class="valuation-driver-score">' + score + '</div>';
        html += '</div>';
        
        // Score bar
        html += '<div class="valuation-driver-bar">';
        html += '<div class="valuation-driver-fill" style="width: ' + score + '%"></div>';
        html += '</div>';
        
        // Performance level
        var performanceLevel = '';
        if (score >= 80) performanceLevel = 'Premium';
        else if (score >= 60) performanceLevel = 'Strong';
        else if (score >= 40) performanceLevel = 'Average';
        else performanceLevel = 'Below Average';
        
        html += '<div class="valuation-driver-performance">Performance: <span class="performance-level-' + performanceLevel.toLowerCase().replace(' ', '-') + '">' + performanceLevel + '</span></div>';
        
        // Description
        html += '<div class="valuation-driver-desc">' + description + '</div>';
        html += '</div>';
        
        return html;
    },
    
    /**
     * Generate prioritized recommendations based on valuation impact
     * @param {Object} results - The assessment results
     * @return {Array} Enhanced recommendations with valuation impact
     */
    enhanceRecommendations: function(results) {
        if (!results.recommendations || !results.recommendations.length) {
            return [];
        }
        
        var enhancedRecommendations = [];
        
        // Enhance each recommendation with valuation impact
        results.recommendations.forEach(function(rec, index) {
            var enhanced = Object.assign({}, rec); // Clone original recommendation
            
            // Add valuation impact based on category
            if (rec.category === 'financial' || rec.title.toLowerCase().includes('financial') || 
                rec.title.toLowerCase().includes('revenue') || rec.title.toLowerCase().includes('client')) {
                enhanced.valuationImpact = 'High';
                enhanced.valuationDesc = 'Could add 0.5-0.8x to EBITDA multiple by improving key financial metrics';
                enhanced.priority = 1;
            } else if (rec.category === 'operational' || rec.title.toLowerCase().includes('process') ||
                      rec.title.toLowerCase().includes('team') || rec.title.toLowerCase().includes('efficiency')) {
                enhanced.valuationImpact = 'Medium-High';
                enhanced.valuationDesc = 'Could add 0.3-0.5x to EBITDA multiple through operational improvements';
                enhanced.priority = 2;
            } else if (rec.category === 'technology' || rec.category === 'ai' || 
                      rec.title.toLowerCase().includes('ai') || rec.title.toLowerCase().includes('digital')) {
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
        enhancedRecommendations.sort(function(a, b) {
            return a.priority - b.priority;
        });
        
        return enhancedRecommendations;
    }
};
