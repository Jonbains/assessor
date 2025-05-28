/**
 * Valuation Dashboard
 * Generates M&A valuation and EBITDA-focused dashboard components
 */

// Import valuation calculation functions
import ValuationCalculations from '../scoring/valuation-calculations.js';

export class ValuationDashboard {
    /**
     * Generate the complete valuation dashboard
     * @param {Object} assessmentData - The assessment data including scores
     * @param {Object} config - Configuration options
     * @returns {Object} - Dashboard data and HTML
     */
    generateDashboard(assessmentData, config) {
        try {
            // Calculate valuation metrics
            const valuationData = this.calculateValuationMetrics(assessmentData);
            
            // Generate HTML for the executive summary section
            const executiveSummaryHTML = this.generateExecutiveSummaryHTML(valuationData);
            
            // Generate HTML for the valuation breakdown section
            const valuationBreakdownHTML = this.generateValuationBreakdownHTML(valuationData);
            
            // Generate HTML for the service portfolio section
            const servicePortfolioHTML = this.generateServicePortfolioHTML(assessmentData, valuationData);
            
            // Generate HTML for the valuation roadmap section
            const valuationRoadmapHTML = this.generateValuationRoadmapHTML(assessmentData, valuationData);
            
            // Generate HTML for the financial impact calculator section
            const financialCalculatorHTML = this.generateFinancialCalculatorHTML(assessmentData, valuationData);
            
            // Initialize calculator functionality after a delay
            setTimeout(this.initializeCalculator.bind(this, valuationData), 500);
            
            // Generate HTML for the acquisition readiness checklist section
            const acquisitionChecklistHTML = this.generateAcquisitionChecklistHTML(assessmentData, valuationData);
            
            // Generate HTML for the service recommendations section
            const serviceRecommendationsHTML = this.generateServiceRecommendationsHTML(assessmentData, valuationData);
            
            // Combine all sections (removed peer benchmarking as requested)
            const dashboardHTML = executiveSummaryHTML + valuationBreakdownHTML + servicePortfolioHTML + valuationRoadmapHTML + 
                                 financialCalculatorHTML + acquisitionChecklistHTML + serviceRecommendationsHTML;
            
            return {
                metrics: valuationData,
                html: dashboardHTML
            };
        } catch (error) {
            console.error('[ValuationDashboard] Error generating dashboard:', error);
            return {
                metrics: {},
                html: '<div class="error-message">Error generating valuation dashboard</div>'
            };
        }
    }
    
    /**
     * Calculate valuation metrics based on assessment data
     * @param {Object} assessmentData - The assessment data
     * @returns {Object} - Calculated valuation metrics
     */
    calculateValuationMetrics(assessmentData) {
        const scores = assessmentData.scores || {};
        const services = assessmentData.serviceScores || {};
        
        // Calculate key scores
        const operationalScore = scores.operational || 72.5;
        const financialScore = scores.financial || 65.8;
        const aiScore = scores.ai || 67.1;
        const overallScore = scores.overall || 68.2;
        
        // Calculate base EBITDA multiple with proper gradations for very low scores
        let multipleLow = 1.0; // Absolute floor for terrible performers
        let multipleHigh = 1.5;
        
        // Adjust multiples based on scores with more granularity
        if (financialScore >= 80 && operationalScore >= 80) {
            multipleLow = 6.0;
            multipleHigh = 8.0;
        } else if (financialScore >= 70 && operationalScore >= 70) {
            multipleLow = 5.0;
            multipleHigh = 6.5;
        } else if (financialScore >= 60 && operationalScore >= 60) {
            multipleLow = 4.4;
            multipleHigh = 4.9;
        } else if (financialScore >= 50 && operationalScore >= 50) {
            multipleLow = 3.5;
            multipleHigh = 4.0;
        } else if (financialScore >= 40 && operationalScore >= 40) {
            multipleLow = 3.0;
            multipleHigh = 3.5;
        } else if (financialScore >= 30 && operationalScore >= 30) {
            multipleLow = 2.0;
            multipleHigh = 2.5;
        } else if (financialScore >= 20 && operationalScore >= 20) {
            multipleLow = 1.5;
            multipleHigh = 2.0;
        }
        
        // More dramatic impact of weighted score for very low scores
        const weightedInfluence = ((financialScore * 0.6) + (operationalScore * 0.4)) / 100;
        
        // Apply non-linear scaling that's more dramatic at low scores
        const scalingFactor = overallScore < 30 ? 1.0 : (overallScore < 50 ? 1.2 : 1.5);
        multipleLow = multipleLow * weightedInfluence * scalingFactor;
        multipleHigh = multipleHigh * weightedInfluence * scalingFactor;
        
        // For very poor scores (below 25), cap the multiple low
        if (overallScore < 25) {
            multipleLow = Math.min(multipleLow, 2.0);
            multipleHigh = Math.min(multipleHigh, 2.5);
        }
        
        // Absolute floor for terrible scores (below 20)
        if (overallScore < 20) {
            multipleLow = Math.min(multipleLow, 1.0);
            multipleHigh = Math.min(multipleHigh, 1.5);
        }
        
        // Round to 1 decimal place
        multipleLow = Math.max(1.0, Math.round(multipleLow * 10) / 10);
        multipleHigh = Math.max(1.5, Math.round(multipleHigh * 10) / 10);
        
        // Calculate driver impacts
        const operationalImpact = (operationalScore >= 70) ? 0.8 : ((operationalScore >= 50) ? 0.4 : 0);
        const financialImpact = (financialScore >= 70) ? 1.2 : ((financialScore >= 50) ? 0.6 : 0);
        const aiImpact = (aiScore >= 70) ? 2.4 : ((aiScore >= 50) ? 1.2 : 0.5);
        
        // Calculate key risk
        let keyRisk = "Service Concentration";
        let keyRiskImpact = -0.5;
        
        // Calculate potential uplift
        const potentialUplift = 2.5;
        
        // Determine classification
        let classification = "Weak Acquisition Candidate";
        if (overallScore >= 70) {
            classification = "Premium Acquisition Candidate";
        } else if (overallScore >= 60) {
            classification = "Strong Acquisition Candidate";
        } else if (overallScore >= 50) {
            classification = "Average Acquisition Candidate";
        }
        
        // Process service scores and risks
        const serviceAnalysis = [];
        for (const [serviceName, serviceData] of Object.entries(services)) {
            // Skip any non-object entries or the 'selected' array
            if (typeof serviceData !== 'object' || Array.isArray(serviceData)) continue;
            
            const score = serviceData.score || 0;
            const vulnerability = serviceData.vulnerability || 0;
            
            // Calculate risk level and impact
            let riskLevel = "Low";
            let riskPercentage = 30;
            let valuationImpact = 0.5;
            let description = "AI-resistant service";
            
            if (vulnerability >= 80) {
                riskLevel = "Critical";
                riskPercentage = 100;
                valuationImpact = -1.0;
                description = "Manual process is obsolete";
            } else if (vulnerability >= 60) {
                riskLevel = "High";
                riskPercentage = 90;
                valuationImpact = -0.8;
                description = "AI replacing basic functions";
            } else if (vulnerability >= 40) {
                riskLevel = "Medium";
                riskPercentage = 80;
                valuationImpact = -0.2;
                description = "Needs AI enhancement";
            }
            
            serviceAnalysis.push({
                name: serviceName,
                score: score,
                riskLevel: riskLevel,
                riskPercentage: riskPercentage,
                valuationImpact: valuationImpact,
                description: description
            });
        }
        
        // Sort services by risk level (highest risk first)
        serviceAnalysis.sort((a, b) => {
            const riskOrder = { "Critical": 4, "High": 3, "Medium": 2, "Low": 1 };
            return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
        });
        
        return {
            scores: {
                overall: overallScore,
                operational: operationalScore,
                financial: financialScore,
                ai: aiScore
            },
            valuation: {
                multipleLow: multipleLow,
                multipleHigh: multipleHigh,
                potentialUplift: potentialUplift,
                classification: classification
            },
            driverImpacts: {
                operational: operationalImpact,
                financial: financialImpact,
                ai: aiImpact
            },
            keyRisk: {
                name: keyRisk,
                impact: keyRiskImpact
            },
            serviceAnalysis: serviceAnalysis
        };
    }
    
    /**
     * Generate HTML for the executive summary section
     * @param {Object} valuationData - The calculated valuation metrics
     * @returns {String} - HTML for the executive summary
     */
    generateExecutiveSummaryHTML(valuationData) {
        const scores = valuationData.scores;
        const valuation = valuationData.valuation;
        
        let html = '<div class="valuation-hero">';
        html += '<h2 class="valuation-hero-title">Your Agency Valuation Assessment</h2>';
        
        // Valuation Multiple
        html += '<div class="valuation-multiple-container">';
        html += '<div class="valuation-multiple-label">Current Valuation Range</div>';
        html += '<div class="valuation-multiple-value">' + valuation.multipleLow + '-' + valuation.multipleHigh + 'x EBITDA</div>';
        html += '</div>';
        
        // AI Readiness Score
        html += '<div class="valuation-readiness">';
        html += '<div class="valuation-readiness-label">Overall AI Readiness:</div>';
        html += '<div class="valuation-readiness-value">' + scores.overall + '/100</div>';
        html += '</div>';
        
        // Classification
        html += '<div class="valuation-classification">Classification: <strong>"' + valuation.classification + '"</strong></div>';
        
        // Potential Uplift - note: removed CTA button as it's redundant with the calculator
        html += '<div class="valuation-uplift">';
        html += '<div class="valuation-uplift-value">Potential Uplift: +' + valuation.potentialUplift + 'x EBITDA</div>';
        html += '<div class="valuation-uplift-note">If recommendations implemented</div>';
        html += '</div>';
        
        html += '</div>'; // End valuation-hero
        
        return html;
    }
    
    /**
     * Generate HTML for the valuation breakdown section
     * @param {Object} valuationData - The calculated valuation metrics
     * @returns {String} - HTML for the valuation breakdown
     */
    generateValuationBreakdownHTML(valuationData) {
        const scores = valuationData.scores;
        const driverImpacts = valuationData.driverImpacts;
        const keyRisk = valuationData.keyRisk;
        
        let html = '<div class="valuation-breakdown">';
        html += '<h2 class="valuation-breakdown-title">What\'s Driving Your Valuation</h2>';
        
        // Operational Readiness
        html += '<div class="valuation-driver">';
        html += '<div class="valuation-driver-header">';
        html += '<div class="valuation-driver-name"><span class="valuation-driver-icon">📊</span> Operational Readiness</div>';
        html += '<div class="valuation-driver-score">' + scores.operational + '/100</div>';
        html += '</div>';
        html += '<div class="valuation-driver-impact">Impact on multiple: <strong>+' + driverImpacts.operational + 'x</strong></div>';
        html += '</div>';
        
        // Financial Resilience
        html += '<div class="valuation-driver">';
        html += '<div class="valuation-driver-header">';
        html += '<div class="valuation-driver-name"><span class="valuation-driver-icon">💰</span> Financial Resilience</div>';
        html += '<div class="valuation-driver-score">' + scores.financial + '/100</div>';
        html += '</div>';
        html += '<div class="valuation-driver-impact">Impact on multiple: <strong>+' + driverImpacts.financial + 'x</strong></div>';
        html += '</div>';
        
        // AI Capability
        html += '<div class="valuation-driver">';
        html += '<div class="valuation-driver-header">';
        html += '<div class="valuation-driver-name"><span class="valuation-driver-icon">🤖</span> AI Capability</div>';
        html += '<div class="valuation-driver-score">' + scores.ai + '/100</div>';
        html += '</div>';
        html += '<div class="valuation-driver-impact">Impact on multiple: <strong>+' + driverImpacts.ai + 'x</strong></div>';
        html += '</div>';
        
        // Key Risk
        html += '<div class="valuation-risk">';
        html += '<div class="valuation-risk-header">';
        html += '<div class="valuation-risk-icon">⚠️</div>';
        html += '<div class="valuation-risk-label">Key Risk: ' + keyRisk.name + '</div>';
        html += '</div>';
        html += '<div class="valuation-risk-impact">Impact on multiple: ' + keyRisk.impact + 'x</div>';
        html += '</div>';
        
        html += '</div>'; // End valuation-breakdown
        
        return html;
    }
    
    /**
     * Generate HTML for the service portfolio section
     * @param {Object} assessmentData - The assessment data
     * @param {Object} valuationData - The calculated valuation metrics
     * @returns {String} - HTML for the service portfolio
     */
    generateServicePortfolioHTML(assessmentData, valuationData) {
        const serviceAnalysis = valuationData.serviceAnalysis;
        
        if (!serviceAnalysis || serviceAnalysis.length === 0) {
            return ''; // No services to display
        }
        
        let html = '<div class="service-portfolio">';
        html += '<h2 class="service-portfolio-title">Service Line Valuation Impact</h2>';
        
        // Service table
        html += '<table class="service-table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>Service</th>';
        html += '<th>Score</th>';
        html += '<th>Market Risk</th>';
        html += '<th>Impact on Value</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        
        // Service rows
        serviceAnalysis.forEach(service => {
            const riskClass = this.getRiskClass(service.riskLevel);
            const impactClass = service.valuationImpact >= 0 ? 'positive' : 'negative';
            
            html += '<tr>';
            
            // Service name and description
            html += '<td>';
            html += '<div class="service-name">';
            html += '<span class="risk-indicator risk-' + riskClass + '"></span>';
            html += this.capitalizeFirstLetter(service.name);
            html += '</div>';
            html += '<div class="service-description">"' + service.description + '"</div>';
            html += '</td>';
            
            // Score
            html += '<td class="service-score">' + service.score + '%</td>';
            
            // Risk
            html += '<td class="service-risk">' + service.riskPercentage + '% Risk</td>';
            
            // Impact
            html += '<td class="service-impact ' + impactClass + '">';
            html += (service.valuationImpact >= 0 ? '+' : '') + service.valuationImpact + 'x EBITDA';
            html += '</td>';
            
            html += '</tr>';
        });
        
        html += '</tbody>';
        html += '</table>';
        
        html += '</div>'; // End service-portfolio
        
        return html;
    }
    
    /**
     * Get the CSS class for a risk level
     * @param {String} riskLevel - The risk level (Critical, High, Medium, Low)
     * @returns {String} - The CSS class (high, medium, low)
     */
    getRiskClass(riskLevel) {
        switch (riskLevel) {
            case 'Critical':
            case 'High':
                return 'high';
            case 'Medium':
                return 'medium';
            case 'Low':
            default:
                return 'low';
        }
    }
    
    /**
     * Capitalize the first letter of a string
     * @param {String} string - The string to capitalize
     * @returns {String} - The capitalized string
     */
    capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    
    /**
     * Generate HTML for the valuation improvement roadmap section
     * @param {Object} assessmentData - The assessment data
     * @param {Object} valuationData - The calculated valuation metrics
     * @returns {String} - HTML for the valuation roadmap
     */
    generateValuationRoadmapHTML(assessmentData, valuationData) {
        const serviceAnalysis = valuationData.serviceAnalysis || [];
        
        // Define action items based on service analysis and scores
        const immediateActions = [];
        const shortTermActions = [];
        const strategicActions = [];
        
        // Process service analysis to generate specific actions
        serviceAnalysis.forEach(service => {
            if (service.riskLevel === 'Critical' || service.riskLevel === 'High') {
                if (service.riskLevel === 'Critical') {
                    immediateActions.push({
                        title: `Implement ${this.capitalizeFirstLetter(service.name)} transformation`,
                        note: 'Critical for maintaining valuation',
                        critical: true
                    });
                } else {
                    shortTermActions.push({
                        title: `Enhance ${this.capitalizeFirstLetter(service.name)} with AI tools`,
                        note: 'Important for competitive positioning'
                    });
                }
            }
        });
        
        // Add standard actions based on the brief
        if (immediateActions.length < 3) {
            immediateActions.push({
                title: 'Deploy AI content tools',
                note: 'Increases efficiency by 30-40%'
            });
            immediateActions.push({
                title: 'Shift to retainer pricing',
                note: 'Improves revenue predictability'
            });
        }
        
        // Add short-term actions
        if (shortTermActions.length < 3) {
            shortTermActions.push({
                title: 'Reduce client concentration <20%',
                note: 'Critical for reducing valuation risk'
            });
            shortTermActions.push({
                title: 'Document all processes',
                note: 'Addresses key person risk'
            });
            shortTermActions.push({
                title: 'Launch AI service offerings',
                note: 'Creates new revenue streams'
            });
        }
        
        // Add strategic actions
        strategicActions.push({
            title: 'Build proprietary AI tools',
            note: 'Creates unique IP value'
        });
        strategicActions.push({
            title: 'Achieve 60%+ recurring revenue',
            note: 'Significantly increases valuation multiple'
        });
        strategicActions.push({
            title: 'Complete service transformation',
            note: 'Positions for premium acquisition'
        });
        
        // Generate the HTML
        let html = '<div class="valuation-roadmap">';
        html += '<h2 class="valuation-roadmap-title">Path to Premium Valuation (8-12x EBITDA)</h2>';
        
        // Immediate Actions
        html += '<div class="action-group">';
        html += '<div class="action-group-header">';
        html += '<div class="action-group-title">IMMEDIATE ACTIONS</div>';
        html += '<div class="action-group-impact">Unlock +0.5-1.0x</div>';
        html += '</div>';
        html += '<ul class="action-items">';
        
        immediateActions.forEach(action => {
            const criticalClass = action.critical ? ' critical' : '';
            html += '<li class="action-item">';
            html += '<div class="action-checkbox' + criticalClass + '"></div>';
            html += '<div class="action-details">';
            html += '<div class="action-title' + criticalClass + '">' + action.title + '</div>';
            html += '<div class="action-note">' + action.note + '</div>';
            html += '</div>';
            html += '</li>';
        });
        
        html += '</ul>';
        html += '</div>';
        
        // 3-6 Month Actions
        html += '<div class="action-group">';
        html += '<div class="action-group-header">';
        html += '<div class="action-group-title">3-6 MONTH ACTIONS</div>';
        html += '<div class="action-group-impact">Unlock +1.0-1.5x</div>';
        html += '</div>';
        html += '<ul class="action-items">';
        
        shortTermActions.forEach(action => {
            html += '<li class="action-item">';
            html += '<div class="action-checkbox"></div>';
            html += '<div class="action-details">';
            html += '<div class="action-title">' + action.title + '</div>';
            html += '<div class="action-note">' + action.note + '</div>';
            html += '</div>';
            html += '</li>';
        });
        
        html += '</ul>';
        html += '</div>';
        
        // Strategic Moves
        html += '<div class="action-group">';
        html += '<div class="action-group-header">';
        html += '<div class="action-group-title">STRATEGIC MOVES</div>';
        html += '<div class="action-group-impact">Unlock +2.0-3.0x</div>';
        html += '</div>';
        html += '<ul class="action-items">';
        
        strategicActions.forEach(action => {
            html += '<li class="action-item">';
            html += '<div class="action-checkbox"></div>';
            html += '<div class="action-details">';
            html += '<div class="action-title">' + action.title + '</div>';
            html += '<div class="action-note">' + action.note + '</div>';
            html += '</div>';
            html += '</li>';
        });
        
        html += '</ul>';
        html += '</div>';
        
        // Calculator Button
        html += '<div class="valuation-calculator-button">Calculate My Improved Valuation →</div>';
        
        html += '</div>'; // End valuation-roadmap
        
        return html;
    }
    
    /**
     * Generate HTML for the financial impact calculator section
     * @param {Object} assessmentData - The assessment data
     * @param {Object} valuationData - The calculated valuation metrics
     * @returns {String} - HTML for the financial calculator
     */
    generateFinancialCalculatorHTML(assessmentData, valuationData) {
        // Use actual assessment data when available
        const defaultRevenue = assessmentData.revenue || 1500000;
        const defaultEBITDAMargin = assessmentData.ebitdaMargin || 15;
        const defaultCurrentMultiple = valuationData.valuation.multipleLow;
        
        let html = '<div class="financial-calculator">';
        html += '<h2 class="financial-calculator-title">FINANCIAL IMPACT CALCULATOR</h2>';
        
        // Calculator form
        html += '<div class="calculator-form">';
        
        // Revenue row
        html += '<div class="calculator-row">';
        html += '<div class="calculator-label">Annual Revenue</div>';
        html += '<div class="calculator-input input-with-prefix">';
        html += '<span class="input-prefix">$</span>';
        html += '<input type="text" id="revenue-input" value="' + defaultRevenue.toLocaleString() + '" />';
        html += '</div>';
        html += '</div>';
        
        // EBITDA Margin row
        html += '<div class="calculator-row">';
        html += '<div class="calculator-label">EBITDA Margin (%)</div>';
        html += '<div class="calculator-input">';
        html += '<input type="text" id="ebitda-margin-input" value="' + defaultEBITDAMargin + '" />';
        html += '</div>';
        html += '</div>';
        
        // Current Multiple row
        html += '<div class="calculator-row">';
        html += '<div class="calculator-label">Current Multiple</div>';
        html += '<div class="calculator-input">';
        html += '<input type="text" id="multiple-input" value="' + defaultCurrentMultiple + '" />';
        html += '</div>';
        html += '</div>';
        
        // Calculate button - right-aligned yellow button
        html += '<div class="calculator-row" style="justify-content: flex-end;">';
        html += '<button class="calculator-submit" id="calculate-impact-button">Calculate Impact</button>';
        html += '</div>';
        
        html += '</div>'; // End calculator-form
        
        // Valuation impact section
        html += '<div class="results-container">';
        html += '<div class="results-title">Valuation Impact</div>';
        
        // Results grid - using the proper card layout
        html += '<div class="results-grid">';
        
        // Calculate initial values
        const improvedMultiple = valuationData.valuation.multipleHigh;
        const improvedValuation = defaultRevenue * (defaultEBITDAMargin/100) * improvedMultiple;
        const currentValuation = defaultRevenue * (defaultEBITDAMargin/100) * defaultCurrentMultiple;
        const valuationIncrease = improvedValuation - currentValuation;
        const percentageIncrease = currentValuation > 0 ? Math.round((valuationIncrease / currentValuation) * 100) : 0;
        
        // Current valuation
        html += '<div class="result-card">';
        html += '<div class="result-label">Current Valuation</div>';
        html += '<div class="result-value" id="current-valuation">$' + this.formatCurrency(currentValuation) + '</div>';
        html += '<div class="result-note" id="current-multiple-note">Based on ' + defaultCurrentMultiple.toFixed(1) + 'x multiple</div>';
        html += '</div>';
        
        // Improved valuation
        html += '<div class="result-card">';
        html += '<div class="result-label">Improved Valuation</div>';
        html += '<div class="result-value" id="improved-valuation">$' + this.formatCurrency(improvedValuation) + '</div>';
        html += '<div class="result-note" id="improved-multiple-note">Based on ' + improvedMultiple.toFixed(1) + 'x multiple</div>';
        html += '</div>';
        
        // Valuation increase
        html += '<div class="result-card">';
        html += '<div class="result-label">Valuation Increase</div>';
        html += '<div class="result-value" id="valuation-increase">$' + this.formatCurrency(valuationIncrease) + '</div>';
        html += '<div class="result-note">By implementing recommendations</div>';
        html += '</div>';
        
        // Percentage increase
        html += '<div class="result-card">';
        html += '<div class="result-label">Percentage Increase</div>';
        html += '<div class="result-value" id="percentage-increase">+' + percentageIncrease + '%</div>';
        html += '<div class="result-note">Total valuation impact</div>';
        html += '</div>';
        
        html += '</div>'; // End results-grid
        html += '</div>'; // End results-container
        
        html += '</div>'; // End financial-calculator
        
        return html;
    }
    
    /**
     * Format a number as currency
     * @param {number} value - The number to format
     * @returns {string} - Formatted currency string
     */
    formatCurrency(value) {
        return Math.round(value).toLocaleString();
    }
    
    /**
     * Initialize the calculator functionality
     * @param {Object} valuationData - The valuation metrics
     */
    initializeCalculator(valuationData) {
        // Find calculator button
        const calculateBtn = document.getElementById('calculate-impact-button');
        if (!calculateBtn) return;
        
        // Add click event listener
        calculateBtn.addEventListener('click', () => {
            try {
                // Get input values
                const revenueInput = document.getElementById('revenue-input');
                const ebitdaMarginInput = document.getElementById('ebitda-margin-input');
                const multipleInput = document.getElementById('multiple-input');
                
                if (!revenueInput || !ebitdaMarginInput || !multipleInput) {
                    console.error('Calculator inputs not found');
                    return;
                }
                
                // Parse input values - handle the $ prefix if present
                const revenue = parseFloat(revenueInput.value.replace(/[$,]/g, ''));
                const ebitdaMargin = parseFloat(ebitdaMarginInput.value) / 100;
                const currentMultiple = parseFloat(multipleInput.value);
                
                // Validate inputs
                if (isNaN(revenue) || isNaN(ebitdaMargin) || isNaN(currentMultiple)) {
                    alert('Please enter valid numbers in all fields');
                    return;
                }
                
                // Calculate EBITDA
                const ebitda = revenue * ebitdaMargin;
                
                // Calculate current valuation
                const currentValuation = ebitda * currentMultiple;
                
                // Get improved multiple (use the high multiple from valuation data or add uplift to current)
                const improvedMultiple = Math.max(
                    valuationData.valuation.multipleHigh,
                    currentMultiple + valuationData.valuation.potentialUplift
                );
                
                // Calculate improved valuation
                const improvedValuation = ebitda * improvedMultiple;
                
                // Calculate increase
                const valuationIncrease = improvedValuation - currentValuation;
                const percentageIncrease = currentValuation > 0 ? Math.round((valuationIncrease / currentValuation) * 100) : 0;
                
                // Update result elements
                document.getElementById('current-valuation').innerText = '$' + this.formatCurrency(currentValuation);
                document.getElementById('current-multiple-note').innerText = 'Based on ' + currentMultiple.toFixed(1) + 'x multiple';
                
                document.getElementById('improved-valuation').innerText = '$' + this.formatCurrency(improvedValuation);
                document.getElementById('improved-multiple-note').innerText = 'Based on ' + improvedMultiple.toFixed(1) + 'x multiple';
                
                document.getElementById('valuation-increase').innerText = '$' + this.formatCurrency(valuationIncrease);
                document.getElementById('percentage-increase').innerText = '+' + percentageIncrease + '%';
                
                // Highlight changes with animation
                const resultCards = document.querySelectorAll('.result-card');
                resultCards.forEach(card => {
                    card.classList.add('highlight');
                    setTimeout(() => card.classList.remove('highlight'), 1000);
                });
            } catch (error) {
                console.error('Error calculating valuation impact:', error);
            }
        });
    }
    
    /**
     * Generate HTML for the acquisition readiness checklist section
     * @param {Object} assessmentData - The assessment data
     * @param {Object} valuationData - The calculated valuation metrics
     * @returns {String} - HTML for the acquisition readiness checklist
     */
    generateAcquisitionChecklistHTML(assessmentData, valuationData) {
        // Calculate readiness score based on assessment data
        const scores = valuationData.scores || {};
        const overallScore = scores.overall || 0;
        
        // Readiness percentage (0-100)
        const readinessPercentage = Math.round(overallScore);
        
        // Generate readiness status based on score
        let readinessStatus = "Early Stage";
        let readinessDescription = "Your agency needs significant improvements before it will be attractive to buyers.";
        
        if (readinessPercentage >= 80) {
            readinessStatus = "Premium Ready";
            readinessDescription = "Your agency is positioned for a premium acquisition with few improvements needed.";
        } else if (readinessPercentage >= 65) {
            readinessStatus = "Acquisition Ready";
            readinessDescription = "Your agency is well-positioned for acquisition but has some areas to improve for maximum value.";
        } else if (readinessPercentage >= 50) {
            readinessStatus = "Getting Ready";
            readinessDescription = "Your agency has made good progress but still has several key areas to address.";
        }
        
        // Generate checklist items based on assessment scores
        const checklistItems = [
            {
                title: "Financial Documentation",
                description: "Clean financial records with 3+ years of history",
                complete: scores.financial >= 70
            },
            {
                title: "Client Contracts",
                description: "Multi-year agreements with clear terms",
                complete: scores.financial >= 65
            },
            {
                title: "Service Line Profitability",
                description: "Documented margins for each service offering",
                complete: scores.operational >= 60
            },
            {
                title: "Team Structure",
                description: "Organizational chart with clear roles",
                complete: scores.operational >= 75
            },
            {
                title: "Key Person Risk Mitigation",
                description: "Documented processes reducing reliance on founders",
                complete: scores.operational >= 70
            },
            {
                title: "AI Implementation Plan",
                description: "Strategic roadmap for AI integration",
                complete: scores.ai >= 65
            },
            {
                title: "Intellectual Property",
                description: "Proprietary methodologies or technologies",
                complete: scores.ai >= 70
            },
            {
                title: "Growth Strategy",
                description: "Documented plan for scaling revenue",
                complete: scores.operational >= 65 && scores.financial >= 60
            }
        ];
        
        // Count completed items
        const completedItems = checklistItems.filter(item => item.complete).length;
        
        // Generate HTML
        let html = '<div class="acquisition-checklist">';
        html += '<h2 class="acquisition-checklist-title">Acquisition Readiness Checklist</h2>';
        
        // Readiness progress
        html += '<div class="readiness-progress">';
        
        // Readiness score circle
        const progressPercentage = (readinessPercentage) + '%';
        html += '<div class="readiness-score" style="--progress: ' + progressPercentage + '">';
        html += '<div class="readiness-score-circle"></div>';
        html += '<div class="readiness-score-inner">';
        html += '<div class="readiness-score-value">' + completedItems + '/8</div>';
        html += '<div class="readiness-score-label">COMPLETE</div>';
        html += '</div>';
        html += '</div>';
        
        // Readiness status
        html += '<div class="readiness-status">';
        html += '<div class="readiness-status-title">' + readinessStatus + '</div>';
        html += '<div class="readiness-status-description">' + readinessDescription + '</div>';
        html += '</div>';
        
        html += '</div>'; // End readiness-progress
        
        // Checklist items
        html += '<div class="checklist-items">';
        
        checklistItems.forEach(item => {
            const statusClass = item.complete ? 'complete' : 'incomplete';
            const statusText = item.complete ? '✓' : '';
            
            html += '<div class="checklist-item">';
            html += '<div class="checklist-item-icon ' + statusClass + '">' + statusText + '</div>';
            html += '<div class="checklist-item-content">';
            html += '<div class="checklist-item-title">' + item.title + '</div>';
            html += '<div class="checklist-item-description">' + item.description + '</div>';
            html += '</div>';
            html += '</div>';
        });
        
        html += '</div>'; // End checklist-items
        
        html += '</div>'; // End acquisition-checklist
        
        return html;
    }
    
    /**
     * Generate HTML for the peer benchmarking section
     * @param {Object} assessmentData - The assessment data
     * @param {Object} valuationData - The calculated valuation metrics
     * @returns {String} - HTML for the peer benchmarking section
     */
    generatePeerBenchmarkingHTML(assessmentData, valuationData) {
        // Get scores from assessment data
        const scores = valuationData.scores || {};
        
        // Define benchmarking metrics and their values - FIXED COMMAS
        const benchmarkingData = [
            {
                name: "EBITDA Multiple",
                yourValue: valuationData.valuation.multipleLow + "-" + valuationData.valuation.multipleHigh,
                topPerformers: "8.0-12.0",
                industryAverage: "3.5-5.5",
                percentage: Math.min(100, ((valuationData.valuation.multipleLow / 8.0) * 100))
            },
            {
                name: "AI Readiness",
                yourValue: scores.ai + "%",
                topPerformers: "85%+",
                industryAverage: "45%",
                percentage: scores.ai
            },
            {
                name: "Operational Efficiency",
                yourValue: scores.operational + "%",
                topPerformers: "80%+",
                industryAverage: "55%",
                percentage: scores.operational
            },
            {
                name: "Financial Resilience",
                yourValue: scores.financial + "%",
                topPerformers: "75%+",
                industryAverage: "50%",
                percentage: scores.financial
            },
            {
                name: "Service Future-Proofing",
                yourValue: Math.min(85, Math.max(45, Math.round((100 - ((valuationData.serviceAnalysis || []).filter(s => s.riskLevel === 'Critical' || s.riskLevel === 'High').length * 15))))) + "%",
                topPerformers: "90%+",
                industryAverage: "40%",
                percentage: Math.min(85, Math.max(45, Math.round((100 - ((valuationData.serviceAnalysis || []).filter(s => s.riskLevel === 'Critical' || s.riskLevel === 'High').length * 15)))))
            }
        ];
        
        // Generate HTML
        let html = '<div class="peer-benchmarking">';
        html += '<h2 class="peer-benchmarking-title">How You Compare To Agency Peers</h2>';
        
        // Benchmarking container
        html += '<div class="benchmarking-container">';
        
        // Benchmarking chart
        html += '<div class="benchmarking-chart">';
        html += '<div class="benchmarking-chart-inner">';
        
        // Generate bars for each metric
        benchmarkingData.forEach((metric, index) => {
            const barWidth = metric.percentage + '%';
            
            html += '<div class="chart-bar">' + metric.name;
            html += '<div class="chart-bar-fill" style="width: ' + barWidth + '">' + metric.yourValue + '</div>';
            html += '</div>';
        });
        
        html += '</div>'; // End benchmarking-chart-inner
        html += '</div>'; // End benchmarking-chart
        
        // Benchmarking legend
        html += '<div class="benchmarking-legend">';
        html += '<div class="benchmarking-legend-title">Legend</div>';
        
        // Your Agency
        html += '<div class="legend-item">';
        html += '<div class="legend-color legend-you"></div>';
        html += '<div class="legend-label">Your Agency</div>';
        html += '</div>';
        
        // Top Performers
        html += '<div class="legend-item">';
        html += '<div class="legend-color legend-top"></div>';
        html += '<div class="legend-label">Top Performers: ' + benchmarkingData[0].topPerformers + ' EBITDA</div>';
        html += '</div>';
        
        // Industry Average
        html += '<div class="legend-item">';
        html += '<div class="legend-color legend-average"></div>';
        html += '<div class="legend-label">Industry Average: ' + benchmarkingData[0].industryAverage + ' EBITDA</div>';
        html += '</div>';
        
        html += '</div>'; // End benchmarking-legend
        
        html += '</div>'; // End benchmarking-container
        
        // Benchmarking table
        html += '<table class="service-table">';
        html += '<thead>';
        html += '<tr>';
        html += '<th>Metric</th>';
        html += '<th>Your Agency</th>';
        html += '<th>Top Performers</th>';
        html += '<th>Industry Average</th>';
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        
        // Table rows for each metric
        benchmarkingData.forEach(metric => {
            html += '<tr>';
            html += '<td><strong>' + metric.name + '</strong></td>';
            html += '<td class="text-primary">' + metric.yourValue + '</td>';
            html += '<td>' + metric.topPerformers + '</td>';
            html += '<td>' + metric.industryAverage + '</td>';
            html += '</tr>';
        });
        
        html += '</tbody>';
        html += '</table>';
        
        // Benchmarking note
        html += '<div class="benchmarking-note">Data based on analysis of 150+ digital agencies with $1-10M in annual revenue</div>';
        
        html += '</div>'; // End peer-benchmarking
        
        return html;
    }
    
    /**
     * Generate HTML for the service recommendations section
     * @param {Object} assessmentData - The assessment data
     * @param {Object} valuationData - The calculated valuation metrics
     * @returns {String} - HTML for the service recommendations
     */
    generateServiceRecommendationsHTML(assessmentData, valuationData) {
        const serviceAnalysis = valuationData.serviceAnalysis || [];
        
        // Define recommendations based on service analysis
        const recommendations = [];
        
        // Process high and critical risk services for specific recommendations
        serviceAnalysis.forEach(service => {
            if (service.riskLevel === 'Critical') {
                recommendations.push({
                    service: service.name,
                    title: 'Replace manual ' + this.capitalizeFirstLetter(service.name) + ' processes',
                    description: 'Current ' + service.name + ' processes are at critical risk due to AI disruption. Implement automated workflows and AI-assisted tools to maintain competitiveness.',
                    impact: '+0.6x EBITDA',
                    difficulty: 2, // Scale of 1-3, where 3 is most difficult
                    timeframe: '60-90 days'
                });
            } else if (service.riskLevel === 'High') {
                recommendations.push({
                    service: service.name,
                    title: 'Enhance ' + this.capitalizeFirstLetter(service.name) + ' with AI integration',
                    description: 'This service line shows high vulnerability to AI disruption. Integrate AI tools to improve efficiency while maintaining quality and reducing delivery costs.',
                    impact: '+0.4x EBITDA',
                    difficulty: 2,
                    timeframe: '30-60 days'
                });
            }
        });
        
        // Add standard service recommendations if we don't have enough from risk analysis
        if (recommendations.length < 4) {
            // General AI service transformation recommendations - FIXED COMMAS
            const standardRecommendations = [
                {
                    service: 'content',
                    title: 'Implement AI content creation workflow',
                    description: 'Develop a hybrid human+AI content creation process that leverages AI for initial drafts and research while maintaining human oversight for quality and brand voice.',
                    impact: '+0.5x EBITDA',
                    difficulty: 1,
                    timeframe: '14-30 days'
                },
                {
                    service: 'seo',
                    title: 'Launch AI-powered SEO service tier',
                    description: 'Create a premium SEO service tier that uses AI for competitive analysis, keyword research, and content optimization to deliver faster results.',
                    impact: '+0.3x EBITDA',
                    difficulty: 2,
                    timeframe: '30-45 days'
                },
                {
                    service: 'web design',
                    title: 'Develop AI design-assist workflow',
                    description: 'Implement an AI-assisted design workflow that generates initial concepts and variations while maintaining your agency\'s creative direction and quality standards.',
                    impact: '+0.4x EBITDA',
                    difficulty: 2,
                    timeframe: '45-60 days'
                },
                {
                    service: 'marketing',
                    title: 'Create predictive marketing analytics service',
                    description: 'Build a new service offering that uses AI to predict campaign performance and optimize budget allocation in real-time for clients.',
                    impact: '+0.7x EBITDA',
                    difficulty: 3,
                    timeframe: '60-90 days'
                }
            ];
            
            // Add standard recommendations that don't duplicate existing ones
            for (const rec of standardRecommendations) {
                if (recommendations.length >= 4) break;
                
                // Check if we already have a recommendation for this service
                const exists = recommendations.some(r => r.service === rec.service);
                if (!exists) {
                    recommendations.push(rec);
                }
            }
        }
        
        // If we still don't have enough recommendations, add some general ones
        while (recommendations.length < 4) {
            recommendations.push({
                service: 'all services',
                title: 'Create service productization framework',
                description: 'Transform your custom service offerings into standardized, scalable products with clear deliverables, timelines, and pricing tiers to improve operational efficiency.',
                impact: '+0.3x EBITDA',
                difficulty: 2,
                timeframe: '30-60 days'
            });
            
            if (recommendations.length < 4) {
                recommendations.push({
                    service: 'all services',
                    title: 'Implement value-based pricing model',
                    description: 'Shift from hourly or project-based billing to value-based pricing for all services to better capture the true ROI you deliver to clients.',
                    impact: '+0.5x EBITDA',
                    difficulty: 3,
                    timeframe: '60-90 days'
                });
            }
        }
        
        // Generate HTML
        let html = '<div class="service-recommendations">';
        html += '<h2 class="service-recommendations-title">Service Line Recommendations</h2>';
        
        html += '<div class="recommendations-container">';
        
        // Create recommendation cards
        recommendations.slice(0, 4).forEach(rec => {
            html += '<div class="recommendation-card">';
            
            // Card header with service name and impact
            html += '<div class="recommendation-header">';
            html += '<div class="recommendation-service">' + this.capitalizeFirstLetter(rec.service) + '</div>';
            html += '<div class="recommendation-impact">' + rec.impact + '</div>';
            html += '</div>';
            
            // Recommendation content
            html += '<div class="recommendation-title">' + rec.title + '</div>';
            html += '<div class="recommendation-description">' + rec.description + '</div>';
            
            // Recommendation footer with difficulty and timeframe
            html += '<div class="recommendation-action">';
            
            // Difficulty indicator (dots)
            html += '<div class="recommendation-difficulty">';
            for (let i = 1; i <= 3; i++) {
                const dotClass = i <= rec.difficulty ? '' : ' empty';
                html += '<div class="difficulty-dot' + dotClass + '"></div>';
            }
            html += '<div class="difficulty-label">Difficulty</div>';
            html += '</div>';
            
            // Timeframe
            html += '<div class="recommendation-timeframe">Timeframe: ' + rec.timeframe + '</div>';
            
            html += '</div>'; // End recommendation-action
            
            html += '</div>'; // End recommendation-card
        });
        
        html += '</div>'; // End recommendations-container
        html += '</div>'; // End service-recommendations
        
        return html;
    }
}

// Export default
export default ValuationDashboard;