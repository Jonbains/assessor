/**
 * Assessment Framework - Agency Assessment
 * 
 * Implements the agency-specific assessment with M&A valuation focus
 * Extends the base assessment class with agency-specific functionality
 */

import { AssessmentBase } from '../../core/assessment-base.js';
import { NavigationController } from '../../core/navigation-controller.js';
import { StateManager } from '../../core/state-manager.js';

// Import agency steps
import { AgencyTypeStep } from './steps/agency-type-step.js';
import { ServicesStep } from './steps/services-step.js';
import { RevenueStep } from './steps/revenue-step.js';
import { QuestionsStep } from './steps/questions-step.js';
import { EmailStep } from './steps/email-step.js';
import { ResultsStep } from './steps/results-step.js';

// Import scoring and reporting components
import { AgencyScoringEngine } from './scoring/scoring-engine.js';
import { ValuationDashboard } from './reporting/valuation-dashboard.js';

/**
 * AgencyAssessment class 
 * Agency-specific implementation of the assessment framework
 */
export class AgencyAssessment extends AssessmentBase {
    /**
     * Constructor for agency assessment
     * @param {Object} config - Assessment configuration
     * @param {Element} container - DOM container to render the assessment
     */
    constructor(config, container) {
        super(config, container);
        this.type = 'agency';
        this.scoringEngine = new AgencyScoringEngine(config);
        this.valuationDashboard = new ValuationDashboard(config);
        
        // Create step instances
        this.steps = {
            'agency-type': new AgencyTypeStep(this),
            'services': new ServicesStep(this),
            'revenue': new RevenueStep(this),
            'questions': new QuestionsStep(this),
            'email': new EmailStep(this),
            'results': new ResultsStep(this)
        };
    }
    
    /**
     * Initialize the assessment state
     * @return {Object} - Initial state object
     */
    initializeState() {
        return {
            currentStep: this.config.steps[0],
            answers: {},
            selectedAgencyType: null,
            selectedServices: [],
            serviceRevenue: {}, // revenue allocation per service
            revenue: 0,
            email: '',
            name: '',
            currentQuestionIndex: 0,
            filteredQuestions: [],
            results: null
        };
    }
    
    /**
     * Get assessment data for calculations
     * @return {Object} - Assessment data
     */
    getAssessmentData() {
        return {
            answers: this.state.answers,
            selectedAgencyType: this.state.selectedAgencyType,
            selectedServices: this.state.selectedServices,
            serviceRevenue: this.state.serviceRevenue,
            revenue: this.state.revenue,
            email: this.state.email,
            name: this.state.name
        };
    }
    
    /**
     * Calculate assessment results
     * @return {Object} - Results object
     */
    calculateResults() {
        try {
            console.log('[AgencyAssessment] Calculating results...');
            
            // Get filtered questions if not already populated
            if (this.state.filteredQuestions.length === 0) {
                this.state.filteredQuestions = this.getQuestionsForSelectedServices();
            }
            
            // Use the agency scoring engine
            const results = this.scoringEngine.calculateResults(
                this.state.answers,
                this.state.filteredQuestions,
                this.getAssessmentData()
            );
            
            // Calculate financial impact if revenue is provided
            if (this.state.revenue > 0) {
                results.financialImpact = this.calculateFinancialImpact(
                    results.overallScore,
                    results.dimensionScores
                );
            }
            
            console.log('[AgencyAssessment] Results calculated:', results);
            return results;
        } catch (error) {
            console.error('[AgencyAssessment] Error calculating results:', error);
            
            // Return fallback results
            return this.getFallbackResults();
        }
    }
    
    /**
     * Calculate financial impact based on assessment scores
     * @param {Number} overallScore - Overall assessment score
     * @param {Object} dimensionScores - Scores for each dimension
     * @return {Object} - Financial impact data
     */
    calculateFinancialImpact(overallScore, dimensionScores) {
        const revenue = this.state.revenue;
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
    
    /**
     * Get fallback results when calculation fails
     * @return {Object} - Basic results object
     */
    getFallbackResults() {
        return {
            overallScore: 50,
            dimensionScores: {
                operational: 50,
                financial: 50,
                ai: 50,
                strategic: 50
            },
            serviceScores: {},
            financialImpact: {
                ebitImpact: 0,
                ebitAmount: 0,
                ebitChange: 0,
                valuationMultiple: 8,
                valuationImpact: 0
            }
        };
    }
    
    /**
     * Get questions for selected services
     * @return {Array} - Filtered questions
     */
    getQuestionsForSelectedServices() {
        const questions = [];
        
        // Add core questions
        if (this.config.questions && this.config.questions.core) {
            questions.push(...this.config.questions.core);
        }
        
        // Add service-specific questions
        if (this.config.questions && this.config.questions.serviceSpecific) {
            this.state.selectedServices.forEach(serviceId => {
                const serviceQuestions = this.config.questions.serviceSpecific[serviceId];
                
                if (Array.isArray(serviceQuestions)) {
                    questions.push(...serviceQuestions);
                }
            });
        }
        
        return questions;
    }
    
    /**
     * Get questions for a specific step
     * @param {String} step - Step identifier
     * @return {Array} - Questions for the step
     */
    getQuestionsForStep(step) {
        if (step === 'questions') {
            return this.getQuestionsForSelectedServices();
        }
        
        return [];
    }
    
    /**
     * Render the current step
     */
    renderCurrentStep() {
        console.log(`[AgencyAssessment] Rendering step: ${this.state.currentStep}`);
        
        // Get the current step component
        const step = this.steps[this.state.currentStep];
        
        if (!step) {
            console.error(`[AgencyAssessment] Unknown step: ${this.state.currentStep}`);
            return;
        }
        
        // Get the step content
        const stepContent = step.render();
        
        // Create a progress bar if configured
        let progressBar = '';
        if (this.config.steps && this.config.steps.length > 0) {
            const ProgressBar = require('../../shared/components/progress-bar').ProgressBar;
            
            const progressSteps = this.config.steps.map(stepId => {
                return {
                    id: stepId,
                    label: this.getStepLabel(stepId)
                };
            });
            
            const progress = new ProgressBar({
                steps: progressSteps,
                currentStepId: this.state.currentStep
            });
            
            progressBar = progress.render();
        }
        
        // Create the complete HTML
        const html = `
            ${progressBar}
            <div class="assessment-step-content">${stepContent}</div>
        `;
        
        // Update the container
        this.container.innerHTML = html;
        
        // Set up event listeners for this step
        step.setupEventListeners(this.container);
    }
    
    /**
     * Get label for a step
     * @param {String} stepId - Step identifier
     * @return {String} - User-friendly label for the step
     */
    getStepLabel(stepId) {
        const labels = {
            'agency-type': 'Agency Type',
            'services': 'Services',
            'revenue': 'Revenue',
            'questions': 'Assessment',
            'email': 'Your Info',
            'results': 'Results'
        };
        
        return labels[stepId] || stepId;
    }
    
    /**
     * Set up event listeners for the assessment
     */
    setupEventListeners() {
        // Global event listeners will be set up here if needed
        // Most event handling is done at the step level
    }
    
    /**
     * Get the display name of the selected agency type
     * @return {String} - Agency type display name
     */
    getAgencyTypeName() {
        if (!this.state.selectedAgencyType || !this.config.agencyTypes) {
            return '';
        }
        
        for (const agencyType of this.config.agencyTypes) {
            if (agencyType.id === this.state.selectedAgencyType) {
                return agencyType.name;
            }
        }
        
        return '';
    }
    
    /**
     * Format a dimension name for display
     * @param {String} dimension - Dimension identifier
     * @return {String} - Formatted dimension name
     */
    formatDimensionName(dimension) {
        if (!dimension) return '';
        
        // Check if dimension is in config
        if (this.config.scoring && this.config.scoring.dimensions) {
            for (const dim of this.config.scoring.dimensions) {
                if (dim.id === dimension) {
                    return dim.name;
                }
            }
        }
        
        // Default formatting
        return dimension.charAt(0).toUpperCase() + dimension.slice(1).replace(/_/g, ' ');
    }
    
    /**
     * Download assessment results
     */
    downloadResults() {
        if (!this.state.results) {
            console.error('[AgencyAssessment] No results to download');
            return;
        }
        
        // Create a downloadable JSON file
        const dataStr = JSON.stringify(this.state.results, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        
        const agencyType = this.getAgencyTypeName() || 'agency';
        const fileName = `${agencyType.toLowerCase()}-assessment-results.json`;
        
        const downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', dataUri);
        downloadLink.setAttribute('download', fileName);
        downloadLink.style.display = 'none';
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }
}
