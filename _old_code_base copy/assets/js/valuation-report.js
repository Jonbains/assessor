/**
 * Valuation Report Module
 * Generates the agency valuation impact report based on assessment results
 */

var ValuationReport = {
    /**
     * Generate the complete valuation report based on assessment data
     * @param {Object} assessmentData - The assessment data including scores
     * @param {Object} config - Configuration options
     * @returns {Object} - Valuation report data and HTML
     */
    generateReport: function(assessmentData, config) {
        try {
            // Calculate valuation metrics
            const valuationData = this.calculateValuationMetrics(assessmentData);
            
            // Generate HTML for the report
            const html = this.generateReportHTML(valuationData);
            
            // Generate performance drivers section
            const driversHTML = this.generatePerformanceDriversHTML(assessmentData.scores);
            
            // Generate recommendations section
            const recommendationsHTML = this.generateRecommendationsHTML(assessmentData);
            
            return {
                metrics: valuationData,
                html: html,
                driversHTML: driversHTML,
                recommendationsHTML: recommendationsHTML
            };
        } catch (error) {
            console.error('[ValuationReport] Error generating report:', error);
            return {
                metrics: {},
                html: '<div class="error-message">Error generating valuation report</div>',
                driversHTML: '',
                recommendationsHTML: ''
            };
        }
    },
    
    /**
     * Calculate valuation metrics based on assessment data
     * @param {Object} assessmentData - The assessment data
     * @returns {Object} - Calculated valuation metrics
     */
    calculateValuationMetrics: function(assessmentData) {
        const scores = assessmentData.scores || {};
        
        // Calculate driver scores
        const financialScore = scores.financial || 36;
        const operationalScore = scores.operational || 64;
        const aiScore = scores.ai || 60;
        const strategicScore = scores.strategic || 54;
        
        // Determine risk profile
        let riskProfile = 'Low Risk';
        if (financialScore < 40 || operationalScore < 40) {
            riskProfile = 'Elevated Risk';
        } else if (financialScore < 60 || operationalScore < 60) {
            riskProfile = 'Moderate Risk';
        }
        
        // Calculate EBITDA multiple range
        let multipleLow = 4;
        let multipleHigh = 4.9;
        
        // Adjust based on scores
        if (financialScore >= 70 && operationalScore >= 70) {
            multipleLow = 6;
            multipleHigh = 7.5;
        } else if (financialScore >= 60 && operationalScore >= 60) {
            multipleLow = 5;
            multipleHigh = 6.2;
        }
        
        // Calculate potential improvement
        const potentialImprovement = 2.2;
        
        return {
            driverScores: {
                financial: financialScore,
                operational: operationalScore,
                technology: aiScore,
                strategic: strategicScore
            },
            riskProfile: riskProfile,
            multipleLow: multipleLow,
            multipleHigh: multipleHigh,
            potentialImprovement: potentialImprovement
        };
    },
    
    /**
     * Generate HTML for the valuation report
     * @param {Object} valuationData - The calculated valuation metrics
     * @returns {String} - HTML for the report
     */
    generateReportHTML: function(valuationData) {
        let html = '';
        
        // Valuation Impact Section
        html += '<div class="valuation-impact-section">';
        html += '<h3 class="assessment-results-section-title">Agency Valuation Impact</h3>';
        
        // EBITDA Multiple Range Card
        html += '<div class="valuation-card">';
        html += '<div class="valuation-title">ESTIMATED VALUATION MULTIPLE</div>';
        html += '<div class="valuation-multiplier">' + valuationData.multipleLow + '-' + valuationData.multipleHigh + 'x</div>';
        html += '<div class="valuation-profile">Risk Profile: <span class="valuation-risk-' + valuationData.riskProfile.toLowerCase().replace(' ', '-') + '">' + valuationData.riskProfile + '</span></div>';
        html += '<div class="valuation-context">This range represents the EBITDA multiplier your agency could command based on the assessment results.</div>';
        html += '</div>';
        
        // Valuation Drivers
        html += '<div class="valuation-drivers">';
        html += '<h4 class="valuation-drivers-title">What Drives Your Valuation</h4>';
        
        // Grid layout for drivers
        html += '<div class="valuation-drivers-grid">';
        
        // Financial Health Driver (40%)
        html += this.generateDriverHTML('Financial Health', valuationData.driverScores.financial, 40, 'Recurring revenue, client concentration, growth trajectory, EBITDA margins');
        
        // Operational Excellence Driver (30%)
        html += this.generateDriverHTML('Operational Excellence', valuationData.driverScores.operational, 30, 'Process documentation, founder dependency, team stability, scalability');
        
        // Technology Readiness Driver (20%)
        html += this.generateDriverHTML('Technology Readiness', valuationData.driverScores.technology, 20, 'AI integration, digital capabilities, automation level');
        
        // Strategic Positioning Driver (10%)
        html += this.generateDriverHTML('Strategic Positioning', valuationData.driverScores.strategic, 10, 'Sector specialization, geographic advantage, competitive differentiation');
        
        html += '</div>'; // End valuation-drivers-grid
        html += '</div>'; // End valuation-drivers
        
        // Improvement Potential
        if (valuationData.potentialImprovement > 0) {
            html += '<div class="valuation-improvement">';
            html += '<div class="valuation-improvement-content">';
            html += '<h4 class="valuation-improvement-title">Unlock Additional Value</h4>';
            html += '<div class="valuation-improvement-metric">+' + valuationData.potentialImprovement + 'x</div>';
            html += '<div class="valuation-improvement-desc">EBITDA multiple improvement by implementing the recommendations below.</div>';
            html += '</div>';
            html += '</div>';
        }
        
        html += '</div>'; // End valuation-impact-section
        
        return html;
    },
    
    /**
     * Generate HTML for a valuation driver
     * @param {String} name - The name of the driver
     * @param {Number} score - The score (0-100)
     * @param {Number} weight - The weight percentage
     * @param {String} description - Description of the driver
     * @returns {String} - HTML for the driver
     */
    generateDriverHTML: function(name, score, weight, description) {
        let html = '<div class="valuation-driver">';
        html += '<div class="valuation-driver-header">';
        html += '<div class="valuation-driver-name">' + name + ' <span class="valuation-driver-weight">(' + weight + '%)</span></div>';
        html += '<div class="valuation-driver-score">' + score + '</div>';
        html += '</div>';
        
        // Score bar
        html += '<div class="valuation-driver-bar">';
        html += '<div class="valuation-driver-fill" style="width: ' + score + '%"></div>';
        html += '</div>';
        
        // Performance level
        let performanceLevel = '';
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
     * Generate HTML for the performance drivers section
     * @param {Object} scores - The assessment scores
     * @returns {String} - HTML for the performance drivers section
     */
    generatePerformanceDriversHTML: function(scores) {
        let html = '';
        
        // Performance Drivers Section
        html += '<div class="performance-drivers-section">';
        html += '<h3 class="performance-drivers-title">Performance Drivers</h3>';
        html += '<div class="performance-drivers-subtitle">This analysis shows your agency\'s performance across four critical dimensions that drive business value.</div>';
        
        // Legend
        html += '<div class="performance-drivers-legend">';
        html += '<div class="legend-item"><div class="legend-color legend-color-leaders"></div> Industry Leaders</div>';
        html += '<div class="legend-item"><div class="legend-color legend-color-average"></div> Industry Average</div>';
        html += '<div class="legend-item"><div class="legend-color legend-color-agency"></div> Your Agency</div>';
        html += '</div>';
        
        // Radar Chart - in real implementation, this would be replaced by an actual chart
        html += '<div class="radar-chart-container">';
        html += '<div id="performance-radar-chart" style="width: 100%; height: 300px;"></div>';
        html += '</div>';
        
        // Individual Performance Metrics
        html += '<div class="performance-metrics">';
        
        // Operational Metric
        html += this.generatePerformanceMetricHTML('O', 'Operational', scores.operational || 64, 'Measures how well your agency has systematized processes, reduced founder dependency, and created scalable operations.');
        
        // Financial Metric
        html += this.generatePerformanceMetricHTML('F', 'Financial', scores.financial || 36, 'Evaluates your revenue consistency, profit margins, client concentration, and financial management practices.');
        
        // AI Readiness Metric
        html += this.generatePerformanceMetricHTML('A', 'AI Readiness', scores.ai || 60, 'Assesses your agency\'s AI integration, staff capabilities, and technological adaptability.');
        
        // Strategic Metric
        html += this.generatePerformanceMetricHTML('S', 'Strategic', scores.strategic || 54, 'Evaluates your competitive positioning, market specialization, and strategic planning.');
        
        html += '</div>'; // End performance-metrics
        
        html += '</div>'; // End performance-drivers-section
        
        return html;
    },
    
    /**
     * Generate HTML for a performance metric
     * @param {String} icon - The letter icon
     * @param {String} title - The metric title
     * @param {Number} score - The score (0-100)
     * @param {String} description - Description of the metric
     * @returns {String} - HTML for the metric
     */
    generatePerformanceMetricHTML: function(icon, title, score, description) {
        let html = '<div class="performance-metric">';
        html += '<div class="performance-metric-header">';
        html += '<div class="performance-metric-icon">' + icon + '</div>';
        html += '<div class="performance-metric-title">' + title + '</div>';
        html += '<div class="performance-metric-score">' + score + '%</div>';
        html += '</div>';
        
        // Score bar
        html += '<div class="performance-metric-bar">';
        html += '<div class="performance-metric-fill" style="width: ' + score + '%"></div>';
        html += '</div>';
        
        // Description
        html += '<div class="performance-metric-desc">' + description + '</div>';
        html += '</div>';
        
        return html;
    },
    
    /**
     * Generate HTML for the priority recommendations section
     * @param {Object} assessmentData - The assessment data
     * @returns {String} - HTML for the recommendations section
     */
    generateRecommendationsHTML: function(assessmentData) {
        const recommendations = [
            {
                title: 'Embrace AI in creative process without sacrificing human originality',
                text: 'Contributes to overall agency positioning and competitive differentiation',
                difficulty: 'Low',
                timeframe: 'Immediate (0-30 days)'
            },
            {
                title: 'Train designers and copywriters on AI tools to speed up ideation and production',
                text: 'Contributes to overall agency positioning and competitive differentiation',
                difficulty: 'Medium',
                timeframe: 'Short-term (1-3 months)'
            },
            {
                title: 'Refocus service offerings on high-value creative consulting that AI can\'t replicate',
                text: 'Contributes to overall agency positioning and competitive differentiation',
                difficulty: 'High',
                timeframe: 'Strategic (3-6 months)'
            },
            {
                title: 'Invest in upskilling staff with comprehensive AI training programs',
                text: 'Contributes to overall agency positioning and competitive differentiation',
                difficulty: 'Low',
                timeframe: 'Immediate (0-30 days)'
            },
            {
                title: 'Adopt value-based pricing models to protect revenue as efficiency increases',
                text: 'Contributes to overall agency positioning and competitive differentiation',
                difficulty: 'Medium',
                timeframe: 'Short-term (1-3 months)'
            },
            {
                title: 'Develop proprietary AI models trained on client brand assets',
                text: 'Contributes to overall agency positioning and competitive differentiation',
                difficulty: 'High',
                timeframe: 'Strategic (3-6 months)'
            },
            {
                title: 'Position as AI-enhanced creative partner vs traditional agency',
                text: 'Contributes to overall agency positioning and competitive differentiation',
                difficulty: 'Low',
                timeframe: 'Immediate (0-30 days)'
            }
        ];
        
        let html = '';
        
        // Priority Recommendations Section
        html += '<div class="priority-recommendations-section">';
        html += '<h3 class="assessment-results-section-title">Priority Recommendations</h3>';
        html += '<div class="recommendations-subtitle">The following actions will have the most significant impact on your agency\'s valuation and AI readiness.</div>';
        
        // Recommendations Grid
        html += '<div class="recommendations-grid">';
        
        // Generate cards for each recommendation
        recommendations.forEach((rec, index) => {
            if (index < 6) { // Limit to 6 recommendations for the grid layout
                html += this.generateRecommendationCardHTML(rec, index);
            }
        });
        
        html += '</div>'; // End recommendations-grid
        
        html += '</div>'; // End priority-recommendations-section
        
        return html;
    },
    
    /**
     * Generate HTML for a recommendation card
     * @param {Object} recommendation - The recommendation data
     * @param {Number} index - The index of the recommendation
     * @returns {String} - HTML for the recommendation card
     */
    generateRecommendationCardHTML: function(recommendation, index) {
        let html = '<div class="recommendation-card">';
        html += '<div class="recommendation-tag">SUPPORTIVE</div>';
        html += '<h4 class="recommendation-title">Creative Agency Recommendation ' + (index + 1) + '</h4>';
        html += '<p class="recommendation-text">' + recommendation.title + '</p>';
        html += '<p class="recommendation-impact">' + recommendation.text + '</p>';
        
        // Metrics
        html += '<div class="recommendation-metrics">';
        html += '<div class="recommendation-metric">';
        html += '<div class="recommendation-metric-label">Difficulty:</div>';
        html += '<div class="recommendation-metric-value">' + recommendation.difficulty + '</div>';
        html += '</div>';
        
        html += '<div class="recommendation-metric">';
        html += '<div class="recommendation-metric-label">Timeframe:</div>';
        html += '<div class="recommendation-metric-value">' + recommendation.timeframe + '</div>';
        html += '</div>';
        html += '</div>'; // End recommendation-metrics
        
        html += '</div>'; // End recommendation-card
        
        return html;
    }
};
