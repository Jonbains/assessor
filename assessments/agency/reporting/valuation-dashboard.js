/**
 * Valuation Dashboard
 * Generates M&A valuation and EBITDA-focused dashboard components
 */

// Import valuation calculation functions and recommendation engine
import ValuationCalculations from '../scoring/valuation-calculations.js';
import { ServiceRecommendations } from '../recommendations/service-recommendations.js';
import AgencyRecommendationsEngine from '../recommendations/recommendations-engine.js';

// Helper functions to replace missing imports
const formatMoney = (amount) => {
    if (!amount) return '$0';
    return '$' + amount.toLocaleString('en-US');
};

const formatPercentage = (value) => {
    if (value === undefined || value === null) return '0%';
    return Math.round(value) + '%';
};

const addEvent = (element, eventType, handler) => {
    if (!element) return () => {};
    element.addEventListener(eventType, handler);
    return () => element.removeEventListener(eventType, handler);
};

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
            
            // Path to Premium section temporarily removed
            const valuationRoadmapHTML = '';
            
            // Generate HTML for the financial impact calculator section
            const financialCalculatorHTML = this.generateFinancialCalculatorHTML(assessmentData, valuationData);
            
            // Initialize calculator functionality after a delay
            setTimeout(this.initializeCalculator.bind(this, valuationData), 500);
            
            // Generate HTML for the acquisition readiness checklist section
            const acquisitionChecklistHTML = this.generateAcquisitionChecklistHTML(assessmentData, valuationData);
            
            // Generate HTML for the service recommendations section
            const serviceRecommendationsHTML = this.generateServiceRecommendationsHTML(assessmentData, valuationData);
            
            // Combine all sections (removed path to premium as requested)
            const dashboardHTML = executiveSummaryHTML + valuationBreakdownHTML + servicePortfolioHTML + 
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
        console.log('[ValuationDashboard] Calculating metrics with assessment data:', assessmentData);
        
        const scores = assessmentData.scores || {};
        const services = assessmentData.serviceScores || {};
        const selectedServices = assessmentData.selectedServices || [];
        const revenue = assessmentData.revenue || 0;
        const agencyType = assessmentData.agencyType || '';
        
        // Use actual scores without any hardcoded fallbacks
        const operationalScore = scores.operational !== undefined ? scores.operational : 0;
        const financialScore = scores.financial !== undefined ? scores.financial : 0;
        const aiScore = scores.ai !== undefined ? scores.ai : 0;
        const overallScore = scores.overall !== undefined ? scores.overall : 0;
        const serviceVulnerability = assessmentData.serviceVulnerability || 0;
        const serviceAdaptability = assessmentData.serviceAdaptability || 0;
        
        console.log('[ValuationDashboard] Using actual scores:', {
            operational: operationalScore,
            financial: financialScore,
            ai: aiScore,
            overall: overallScore,
            serviceVulnerability,
            serviceAdaptability
        });
        
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
        html += '<div class="valuation-risk-icon">⚠️</div>';
        html += '<div class="valuation-risk-label">Key Risk: ' + keyRisk.name + '</div>';
        html += '</div>';
        html += '<div class="valuation-risk-impact">Impact on multiple: ' + keyRisk.impact + 'x</div>';
        html += '</div>';
        
        html += '</div>'; // End valuation-breakdown
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
        console.log('[ValuationDashboard] Generating service recommendations');  
        console.log('[ValuationDashboard] Assessment data:', assessmentData);
        
        // Get scores and services
        const scores = valuationData.scores || {};
        const overallScore = scores.overall || 0;
        const selectedServices = assessmentData.selectedServices || [];
        const agencyType = assessmentData.agencyType || '';
        
        console.log('[ValuationDashboard] Using scores:', scores);
        console.log('[ValuationDashboard] Agency type:', agencyType);
        console.log('[ValuationDashboard] Selected services:', selectedServices);
        
        // Get service-specific recommendations based on score category
        const recommendations = [];
        
        // Determine score category based on actual overall score
        const scoreCategory = overallScore >= 70 ? 'highScore' : 
                             overallScore >= 40 ? 'midScore' : 'lowScore';
                             
        console.log(`[ValuationDashboard] Using score category: ${scoreCategory} based on score ${overallScore}`);
        
        try {
            // Direct access to score category recommendations
            if (ServiceRecommendations && ServiceRecommendations[scoreCategory]) {
                console.log('[ValuationDashboard] Found score category for recommendations:', scoreCategory);
                const categoryRecommendations = ServiceRecommendations[scoreCategory];
                
                if (categoryRecommendations) {
                    // Add immediate recommendations
                    const immediateRecs = categoryRecommendations.immediate || [];
                    immediateRecs.forEach(rec => {
                        recommendations.push({
                            service: 'all',
                            title: rec.title,
                            description: rec.description,
                            impact: rec.expectedROI || '+0.5x EBITDA',
                            difficulty: rec.complexity === 'high' ? 3 : (rec.complexity === 'medium' ? 2 : 1),
                            timeframe: '14-30 days'
                        });
                    });
                    
                    // Add short-term recommendations
                    const shortTermRecs = categoryRecommendations.shortTerm || [];
                    shortTermRecs.forEach(rec => {
                        recommendations.push({
                            service: 'all',
                            title: rec.title,
                            description: rec.description,
                            impact: rec.expectedROI || '+0.2x EBITDA',
                            difficulty: rec.complexity === 'high' ? 3 : (rec.complexity === 'medium' ? 2 : 1),
                            timeframe: '30-60 days'
                        });
                    });
                    
                    // Add strategic recommendations
                    const strategicRecs = categoryRecommendations.strategic || [];
                    strategicRecs.forEach(rec => {
                        recommendations.push({
                            service: 'all',
                            title: rec.title,
                            description: rec.description,
                            impact: rec.expectedROI || '+1.0x EBITDA',
                            difficulty: rec.complexity === 'high' ? 3 : (rec.complexity === 'medium' ? 2 : 1),
                            timeframe: '90+ days'
                        });
                    });
                    console.log(`[ValuationDashboard] Added ${recommendations.length} recommendations from score category`);
                }
            }
        } catch (error) {
            console.error('[ValuationDashboard] Error getting recommendations:', error);
        }
        
        console.log('[ValuationDashboard] Recommendations based on agency type and score:', recommendations);
        
        // If we don't have enough recommendations, add service-specific ones
        console.log('[ValuationDashboard] Current recommendations:', recommendations.length);
        console.log('[ValuationDashboard] Selected services:', selectedServices);
        
        if (recommendations.length < 8 && selectedServices.length > 0) {
            // Add service-specific recommendations based on selected services
            for (const service of selectedServices) {
                if (recommendations.length >= 8) break;
                
                const serviceId = typeof service === 'object' ? service.id : service;
                console.log('[ValuationDashboard] Adding recommendations for service:', serviceId);
                
                // Check if this service exists in ServiceRecommendations
                if (ServiceRecommendations?.services?.[serviceId]) {
                    const serviceInfo = ServiceRecommendations.services[serviceId];
                    const serviceName = serviceInfo.serviceName || serviceId.toUpperCase();
                    console.log('[ValuationDashboard] Found service:', serviceName);
                    
                    const serviceRecs = serviceInfo[scoreCategory] || null;
                    
                    if (serviceRecs) {
                        // Prioritize immediate recommendations first
                        const immediateRecs = serviceRecs.immediate || [];
                        if (immediateRecs.length > 0 && recommendations.length < 8) {
                            recommendations.push({
                                service: serviceName,
                                title: immediateRecs[0].title,
                                description: immediateRecs[0].description,
                                impact: immediateRecs[0].expectedROI || '+0.3x EBITDA',
                                difficulty: immediateRecs[0].complexity === 'high' ? 3 : 2,
                                timeframe: '14-30 days'
                            });
                            console.log(`[ValuationDashboard] Added ${serviceId} recommendation: ${immediateRecs[0].title}`);
                        }
                        
                        // Add short-term recommendations if we still need more
                        const shortTermRecs = serviceRecs.shortTerm || [];
                        if (shortTermRecs.length > 0 && recommendations.length < 8) {
                            recommendations.push({
                                service: serviceName,
                                title: shortTermRecs[0].title,
                                description: shortTermRecs[0].description,
                                impact: shortTermRecs[0].expectedROI || '+0.2x EBITDA',
                                difficulty: shortTermRecs[0].complexity === 'high' ? 3 : 2,
                                timeframe: '30-60 days'
                            });
                            console.log(`[ValuationDashboard] Added ${serviceId} recommendation: ${shortTermRecs[0].title}`);
                        }
                    }
                }
            }
        }
        
        // If we still don't have enough recommendations, add fallbacks
        if (recommendations.length < 8) {
            // Fallback recommendations based on score category
            const fallbacks = [
                {
                    service: 'all services',
                    title: 'Deploy AI content tools',
                    description: 'Implement AI-assisted content creation tools to increase efficiency by 30-40% while maintaining quality.',
                    impact: '+0.3x EBITDA',
                    difficulty: 1,
                    timeframe: '14-30 days'
                },
                {
                    service: 'all services',
                    title: 'Shift to retainer pricing',
                    description: 'Convert project-based clients to monthly retainers to improve revenue predictability and cash flow.',
                    impact: '+0.4x EBITDA',
                    difficulty: 2,
                    timeframe: '30-60 days'
                },
                {
                    service: 'all services',
                    title: 'Document processes',
                    description: 'Create comprehensive documentation for all key processes to reduce key person dependencies.',
                    impact: '+0.2x EBITDA',
                    difficulty: 1,
                    timeframe: '30-45 days'
                },
                {
                    service: 'all services',
                    title: 'Launch AI service offerings',
                    description: 'Develop AI-enhanced service packages that create new revenue streams with higher margins.',
                    impact: '+0.6x EBITDA',
                    difficulty: 3,
                    timeframe: '60-90 days'
                }
            ];
            
            // Add fallbacks until we have 4 recommendations
            for (const fallback of fallbacks) {
                if (recommendations.length >= 4) break;
                recommendations.push(fallback);
            }
        }
        
        // Generate HTML
        let html = '<div class="service-recommendations">';
        html += '<h2 class="service-recommendations-title">Service Line Recommendations</h2>';
        
        html += '<div class="recommendations-container">';
        
        // Ensure we have at least 8 recommendations by creating service-specific generic recommendations if needed
        if (recommendations.length < 8 && selectedServices.length > 0) {
            // Get a list of service names from the selected services
            const serviceNames = [];
            selectedServices.forEach(service => {
                const serviceId = typeof service === 'object' ? service.id : service;
                let serviceName = serviceId.toUpperCase();
                
                // Try to get the actual service name if available
                if (ServiceRecommendations?.services?.[serviceId]?.serviceName) {
                    serviceName = ServiceRecommendations.services[serviceId].serviceName;
                }
                
                serviceNames.push({
                    id: serviceId,
                    name: serviceName
                });
            });
            
            console.log('[ValuationDashboard] Available services for generic recommendations:', serviceNames);
            
            // Create service-specific generic recommendations
            const genericRecommendationsMap = {
                'creative': [
                    { title: 'Implement AI-Assisted Design Tools', description: 'Adopt AI design tools to enhance creative output while maintaining brand consistency.' },
                    { title: 'Create AI Content Guidelines', description: 'Develop standards for blending human and AI creative work to maintain quality.' }
                ],
                'media': [
                    { title: 'Enhance Media Buying Efficiency', description: 'Use AI algorithms to optimize programmatic buying and reduce media waste.' },
                    { title: 'Implement Cross-Platform Attribution', description: 'Deploy advanced attribution models to better track performance across channels.' }
                ],
                'data': [
                    { title: 'Build Predictive Analytics Models', description: 'Develop custom data models to forecast client performance and optimize strategies.' },
                    { title: 'Implement Automated Reporting', description: 'Create automated, real-time dashboards to improve client transparency and insights.' }
                ],
                'web': [
                    { title: 'Deploy AI-powered CRO Tools', description: 'Implement conversion rate optimization tools using machine learning algorithms.' },
                    { title: 'Automate Quality Assurance', description: 'Use AI testing tools to identify and fix website issues before they impact users.' }
                ],
                'social': [
                    { title: 'Implement Content Optimization AI', description: 'Use AI to analyze and optimize social content performance across platforms.' },
                    { title: 'Create Automated Community Management', description: 'Deploy AI assistants for timely and consistent community engagement.' }
                ],
                'content': [
                    { title: 'Deploy AI Content Generation Tools', description: 'Implement AI writing assistants to speed up content creation while maintaining quality.' },
                    { title: 'Create Content Performance Prediction', description: 'Use AI to forecast content performance before publication to maximize ROI.' }
                ],
                'seo': [
                    { title: 'Implement AI-Driven SEO Strategies', description: 'Use machine learning to identify high-opportunity keywords and content gaps.' },
                    { title: 'Automate Technical SEO Audits', description: 'Deploy AI tools to continuously monitor and fix technical SEO issues.' }
                ],
                'marketing': [
                    { title: 'Create AI-Powered Customer Journeys', description: 'Implement AI to personalize customer journeys at scale across touchpoints.' },
                    { title: 'Develop Predictive Lead Scoring', description: 'Use machine learning to identify and prioritize high-value prospects.' }
                ],
            };
            
            // Fill in remaining slots with service-specific recommendations
            let currentService = 0;
            while (recommendations.length < 8) {
                if (serviceNames.length === 0) break;
                
                // Get the next service in rotation
                const serviceInfo = serviceNames[currentService % serviceNames.length];
                const serviceId = serviceInfo.id;
                const serviceName = serviceInfo.name;
                
                // Find generic recommendations for this service
                const genericRecs = genericRecommendationsMap[serviceId] || [
                    { title: `Optimize ${serviceName} Processes`, description: `Implement AI tools to improve efficiency and quality in ${serviceName}.` },
                    { title: `Enhance ${serviceName} Analytics`, description: `Deploy advanced analytics to better measure and improve ${serviceName} performance.` }
                ];
                
                // Get the next generic recommendation for this service
                const recIndex = Math.floor(recommendations.length / serviceNames.length) % genericRecs.length;
                const rec = genericRecs[recIndex] || { 
                    title: `Improve ${serviceName} Performance`, 
                    description: `Strategic improvements to enhance ${serviceName} operations and competitiveness.` 
                };
                
                recommendations.push({
                    service: serviceName,
                    title: rec.title,
                    description: rec.description,
                    impact: '+0.2x EBITDA',
                    difficulty: 2,
                    timeframe: '30-60 days'
                });
                
                currentService++;
            }
        }
        
        // If we still need generic recommendations with no services selected
        while (recommendations.length < 8) {
            const genericRecs = [
                { title: 'Deploy AI Content Tools', description: 'Implement AI-assisted content creation tools to increase efficiency by 30-40% while maintaining quality.' },
                { title: 'Shift to Retainer Pricing', description: 'Convert project-based clients to monthly retainers to improve revenue predictability and cash flow.' },
                { title: 'Document Key Processes', description: 'Create comprehensive documentation for all key processes to reduce key person dependencies.' },
                { title: 'Launch AI Service Offerings', description: 'Develop AI-enhanced service packages that create new revenue streams with higher margins.' }
            ];
            
            const recIndex = recommendations.length % genericRecs.length;
            const rec = genericRecs[recIndex];
            
            recommendations.push({
                service: 'ALL SERVICES',
                title: rec.title,
                description: rec.description,
                impact: '+0.2x EBITDA',
                difficulty: 2,
                timeframe: '30-60 days'
            });
        }
        
        // Display all 8 recommendations
        recommendations.slice(0, 8).forEach(rec => {
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