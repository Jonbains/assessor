/**
 * Assessment Framework - Agency Assessment
 * 
 * Implements the agency-specific assessment with M&A valuation focus
 * Extends the base assessment class with agency-specific functionality
 */

// Import dependencies
import { ValuationDashboard } from './reporting/valuation-dashboard.js';
import { AgencyScoringEngine } from './scoring/agency-scoring-engine.js';
import { AssessmentBase } from '../../core/assessment-base.js';
import { ProgressBar } from '../../shared/components/progress-bar.js';

// Import configurations
import { AgencyQuestionsConfig } from './config/questions-config.js';
import { ValuationConfig } from './config/valuation-config.js';
import { RecommendationsConfig } from './config/recommendations-config.js';

// Import step components
import { AgencyTypeStep } from './steps/agency-type-step.js';
import { ServicesStep } from './steps/services-step.js';
import { QuestionsStep } from './steps/questions-step.js';
import { EmailStep } from './steps/email-step.js';
import { ResultsStep } from './steps/results-step.js';

/**
 * AgencyAssessment class 
 * Agency-specific implementation of the assessment framework
 */
class AgencyAssessment extends AssessmentBase {
    /**
     * Constructor for agency assessment
     * @param {Object} config - Assessment configuration
     * @param {Element} container - DOM container to render the assessment
     */
    constructor(config, container) {
        // Use provided config or fall back to imported config
        const effectiveConfig = config || AgencyQuestionsConfig;
        
        super(effectiveConfig, container);
        this.type = 'agency';
        this.scoringEngine = new AgencyScoringEngine(effectiveConfig);
        this.valuationDashboard = new ValuationDashboard(effectiveConfig);
        
        console.log('[AgencyAssessment] Initializing with config steps:', effectiveConfig.steps);
        
        // Create step instances
        this.steps = {
            'agency-type': new AgencyTypeStep(this),
            'services': new ServicesStep(this),
            'questions': new QuestionsStep(this),
            'email': new EmailStep(this),
            'results': new ResultsStep(this)
        };
        
        console.log('[AgencyAssessment] Registered steps:', Object.keys(this.steps));
        
        // Ensure the steps array and steps object are aligned
        this.ensureStepsMatch();
    }
    
    /**
     * Ensure that the steps in the config match the registered step instances
     * This helps debug step navigation issues
     */
    ensureStepsMatch() {
        console.log('[AgencyAssessment] Ensuring steps match');
        const configSteps = this.config.steps || [];
        const registeredSteps = Object.keys(this.steps);
        
        // Check if all config steps have registered instances
        for (const stepId of configSteps) {
            if (!registeredSteps.includes(stepId)) {
                console.error(`[AgencyAssessment] Config step '${stepId}' has no registered instance`);
            }
        }
        
        // Check if any steps are missing from the config
        for (const stepId of registeredSteps) {
            if (!configSteps.includes(stepId)) {
                console.warn(`[AgencyAssessment] Registered step '${stepId}' is not in the config steps array`);
            }
        }
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
        
        console.log('[AgencyAssessment] Getting questions for selected services');
        console.log('[AgencyAssessment] Selected services:', this.state.selectedServices);
        
        if (!this.state.selectedServices || this.state.selectedServices.length === 0) {
            console.warn('[AgencyAssessment] No services selected, cannot load service-specific questions');
            return questions;
        }
        
        // Make sure we have a valid questions configuration
        if (!this.config.questions) {
            console.error('[AgencyAssessment] No questions configuration found');
            return questions;
        }
        
        // Get the questions config - might be nested
        let questionsConfig = this.config.questions;
        
        // If questions config is nested inside itself (from the import structure)
        if (questionsConfig.questions) {
            questionsConfig = questionsConfig.questions;
        }
        
        // Add core questions
        if (questionsConfig.core) {
            console.log('[AgencyAssessment] Adding core questions:', questionsConfig.core.length);
            questions.push(...questionsConfig.core);
        }
        
        // Add service-specific questions
        if (questionsConfig.serviceSpecific) {
            console.log('[AgencyAssessment] Available service-specific questions for services:', 
                Object.keys(questionsConfig.serviceSpecific));
            
            // For each selected service, add its questions
            this.state.selectedServices.forEach(serviceId => {
                console.log(`[AgencyAssessment] Looking for questions for service: ${serviceId}`);
                const serviceQuestions = questionsConfig.serviceSpecific[serviceId];
                
                if (Array.isArray(serviceQuestions)) {
                    console.log(`[AgencyAssessment] Found ${serviceQuestions.length} questions for ${serviceId}`);
                    questions.push(...serviceQuestions);
                } else {
                    console.warn(`[AgencyAssessment] No questions found for service: ${serviceId}`);
                }
            });
        }
        
        console.log(`[AgencyAssessment] Total questions collected: ${questions.length}`);
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
        console.log('[AgencyAssessment] Available steps:', Object.keys(this.steps));
        console.log('[AgencyAssessment] Config steps:', this.config.steps);
        
        // Get the current step component
        const step = this.steps[this.state.currentStep];
        
        if (!step) {
            console.error(`[AgencyAssessment] Unknown step: ${this.state.currentStep}`);
            return;
        }
        
        console.log(`[AgencyAssessment] Step ${this.state.currentStep} found:`, step);
        
        // Get the step content
        const stepContent = step.render();
        
        // Create a progress bar if configured
        let progressBar = '';
        if (this.config.steps && this.config.steps.length > 0) {
            
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
        
        // Update container with step content
        this.container.innerHTML = `
            <div class="assessment-container">
                ${progressBar}
                <div class="assessment-content">
                    ${stepContent}
                </div>
            </div>
        `;
        
        // Apply styling classes for proper theme rendering
        document.body.classList.add('assessment-active');
        this.container.classList.add('assessment-container');
        
        // Fix the styling for the progress bar to prevent the yellow box
        const progressElement = this.container.querySelector('.progress-track');
        if (progressElement) {
            progressElement.style.backgroundColor = '#333';
            progressElement.style.border = 'none';
        }
        
        // Ensure the progress bar background color is correct
        const progressFill = this.container.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.backgroundColor = '#ffff66';
        }
        
        // Set up event listeners for the step
        step.setupEventListeners(this.container);
        
        // Call afterRender if it exists (for integration with original components)
        if (typeof step.afterRender === 'function') {
            step.afterRender(this.container);
        }
        
        // Apply additional styling after component initialization
        setTimeout(() => {
            // Add dark theme styling to specific components
            const contentArea = this.container.querySelector('.assessment-content');
            if (contentArea) {
                contentArea.style.backgroundColor = '#111';
                contentArea.style.color = '#fff';
                contentArea.style.padding = '20px';
                contentArea.style.borderRadius = '4px';
            }
            
            // Style buttons with yellow/dark theme
            const buttons = this.container.querySelectorAll('.btn, .btn-next');
            buttons.forEach(btn => {
                btn.style.backgroundColor = '#ffff66';
                btn.style.color = '#111';
                btn.style.border = 'none';
                btn.style.padding = '10px 24px';
                btn.style.borderRadius = '4px';
                btn.style.cursor = 'pointer';
                btn.style.fontWeight = 'bold';
            });
        }, 100);
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
        // Global event listeners for the assessment
        // Each step will set up its own event listeners when rendered
        
        // Example: Global navigation buttons
        const backBtn = document.getElementById('back-to-selection');
        if (backBtn) {
            backBtn.addEventListener('click', (e) => {
                e.preventDefault();
                if (confirm('Are you sure you want to exit this assessment?')) {
                    // Navigate back to selection screen
                    window.location.reload();
                }
            });
        }
        
        // Handle browser back button
        window.addEventListener('popstate', (e) => {
            e.preventDefault();
            // Go to previous step if possible
            this.previousStep();
        });
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

// Export the class using ES6 module syntax
export { AgencyAssessment };

// No global registration needed - using ES6 modules properly
