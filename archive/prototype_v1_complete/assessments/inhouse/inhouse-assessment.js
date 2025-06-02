/**
 * Assessment Framework - Inhouse Marketing Assessment
 * 
 * Implementation of the In-House Marketing AI Readiness Assessment
 * Extends the base assessment framework with specialized components for
 * evaluating internal marketing teams' AI readiness
 */

// Import required dependencies
import { AssessmentBase } from '../../core/assessment-base.js';
import { NavigationController } from '../../core/navigation-controller.js';
import { StateManager } from '../../core/state-manager.js';
import { ProgressBar } from '../../shared/components/progress-bar.js';

// Import step components
import { SetupStep } from './steps/setup-step.js';
import { QuestionsStep } from './steps/questions-step.js';
import { ContactStep } from './steps/contact-step.js';
import { ResultsStep } from './steps/results-step.js';

// Import inhouse assessment engines
import { InhouseMarketingScoring } from './scoring/inhouse-scoring-engine.js';

// We'll try to use module imports but fallback to globals if modules fail to load
let InhouseRecommendationsEngine, InhouseMarketingDashboard;
try {
    // Dynamic imports for components that might be problematic
    import('./recommendations/inhouse-recommendations-engine.js')
        .then(module => { InhouseRecommendationsEngine = module.InhouseRecommendationsEngine; })
        .catch(err => { console.warn('Falling back to global for InhouseRecommendationsEngine:', err); });
    
    import('./reporting/inhouse-marketing-dashboard.js')
        .then(module => { InhouseMarketingDashboard = module.InhouseMarketingDashboard; })
        .catch(err => { console.warn('Falling back to global for InhouseMarketingDashboard:', err); });
} catch (e) {
    console.warn('Error with dynamic imports, will use globals as fallback');
}

// Import configuration
import { InHouseMarketingQuestionsConfig } from './config/inhouse_questions.js';

/**
 * InhouseAssessment class
 * @extends AssessmentBase
 */
class InhouseAssessment extends AssessmentBase {
    /**
     * Constructor for inhouse assessment
     * @param {Object} config - Assessment configuration
     * @param {Element} container - DOM container to render the assessment
     */
    constructor(config, container) {
        // Use imported config and merge with any passed config
        const enhancedConfig = {
            ...InHouseMarketingQuestionsConfig,
            ...(config || {})
        };
        
        // Set the proper step sequence to match the actual step class names
        enhancedConfig.steps = [
            'setup',     // This handles industry-selection, activity-selection, and company-info
            'questions', // This handles core-questions, industry-questions, and activity-questions
            'contact',
            'results'
        ];
        
        super(enhancedConfig, container);
        this.type = 'inhouse-marketing';
        
        // Initialize engines and components
        this.scoringEngine = new InhouseMarketingScoring(enhancedConfig); // Use proper scoring engine from scoring directory
        
        // Handle the case where dynamic imports might not be loaded yet
        // For recommendationsEngine
        if (InhouseRecommendationsEngine) {
            this.recommendationsEngine = new InhouseRecommendationsEngine(enhancedConfig);
        } else if (window.InhouseRecommendationsEngine) {
            console.log('Using global InhouseRecommendationsEngine');
            this.recommendationsEngine = new window.InhouseRecommendationsEngine(enhancedConfig);
        } else {
            console.error('InhouseRecommendationsEngine not available!');
            this.recommendationsEngine = {
                generateRecommendations: () => ({ recommendations: [] })
            };
        }
        
        // For dashboard
        if (InhouseMarketingDashboard) {
            this.dashboard = new InhouseMarketingDashboard(enhancedConfig);
        } else if (window.InhouseMarketingDashboard) {
            console.log('Using global InhouseMarketingDashboard');
            this.dashboard = new window.InhouseMarketingDashboard(enhancedConfig);
        } else {
            console.error('InhouseMarketingDashboard not available!');
            this.dashboard = {
                render: () => '<div>Dashboard not available</div>'
            };
        }
        
        // Register steps with the implemented classes - use the new step names
        this.steps = {
            'setup': new SetupStep(this),     // Setup step (combines industry, activity, company)
            'questions': new QuestionsStep(this), // Questions step (handles core, industry, activity)
            'contact': new ContactStep(this),   // Contact information
            'results': new ResultsStep(this)    // Results visualization
        };
        
        // Initialize the questions step with the correct type
        if (this.steps['questions']) {
            this.steps['questions'].currentQuestionType = 'core';
        }
        
        // Configure section mappings for the questions step
        this.stepSectionMap = {
            'setup': null,  // Setup step handles its own sections internally
            'questions': 'core', // Default to core questions, but will be updated during navigation
            'contact': null,
            'results': null
        };
        
        // Track which section of questions we're on
        this.questionSections = ['core', 'industry', 'activity'];
        this.currentQuestionSectionIndex = 0;
        
        // Initialize state manager and navigation
        this.stateManager = new StateManager(this);
        this.navigationController = new NavigationController(this);
        
        console.log('[InhouseAssessment] Initialized');
    }
    
    /**
     * Initialize the assessment state
     * @return {Object} - Initial state object
     */
    initializeState() {
        return {
            currentStep: 'setup', // Use 'setup' as the initial step which is one of our registered steps
            answers: {},
            selectedIndustry: null,
            selectedActivities: [],
            companySize: null,
            companyName: '',
            email: '',
            name: '',
            currentQuestionIndex: 0,
            currentQuestionType: 'core', // 'core', 'industry', or 'activity'
            questionProgress: {
                core: { answered: 0, total: this.getQuestionsCount('core') },
                industry: { answered: 0, total: 0 },
                activity: { answered: 0, total: 0 },
                overall: { answered: 0, total: 0, percentage: 0 }
            },
            filteredQuestions: [],
            results: null
        };
    }
    
    /**
     * Calculate assessment results
     * @return {Object} - Assessment results
     */
    calculateResults() {
        if (!this.state.selectedIndustry || !this.state.selectedActivities.length) {
            console.error('[InhouseAssessment] Missing required data for calculation');
            return null;
        }
        
        // Calculate scores using the scoring engine
        const scores = this.scoringEngine.calculateScores({
            answers: this.state.answers,
            selectedIndustry: this.state.selectedIndustry,
            selectedActivities: this.state.selectedActivities,
            companyName: this.state.companyName,
            companySize: this.state.companySize
        });
        
        // Generate recommendations
        let results = {
            ...scores,
            selectedIndustry: this.state.selectedIndustry,
            selectedActivities: this.state.selectedActivities,
            companyName: this.state.companyName,
            companySize: this.state.companySize
        };
        
        // Add recommendations
        results.recommendations = this.recommendationsEngine.generateRecommendations(results);
        
        return results;
    }
    
    /**
     * Get questions for a specific step
     * @param {string} stepId - Step identifier
     * @return {Array} - Questions for the specified step
     */
    getQuestionsForStep(stepId) {
        // Only questions step uses questions
        if (stepId !== 'questions') {
            return [];
        }
        
        // Return filtered questions based on the question type
        const questionType = this.state.currentQuestionType;
        return this.getQuestionsByType(questionType);
    }
    
    /**
     * Render the current step
     */
    renderCurrentStep() {
        let currentStepId = this.state.currentStep;
        console.log(`[InhouseAssessment] Rendering step: ${currentStepId}`);
        
        try {
            // Check if the current step is valid
            if (!currentStepId) {
                console.error('[InhouseAssessment] Current step is undefined');
                this.state.currentStep = this.config.steps[0]; // Default to first step
                currentStepId = this.state.currentStep;
                console.log('[InhouseAssessment] Defaulted to first step:', currentStepId);
            }
            
            // Map section-based navigation (core-questions, industry-questions) to the questions step
            if (currentStepId.includes('-questions')) {
                const questionType = currentStepId.split('-')[0];
                console.log(`[InhouseAssessment] Mapping ${currentStepId} to questions step with type ${questionType}`);
                
                // Set the question type in state
                this.state.currentQuestionType = questionType;
                
                // Map to standard step
                currentStepId = 'questions';
                console.log(`[InhouseAssessment] Using mapped step ID: ${currentStepId}`);
            }
            
            // Special handling for questions step
            if (currentStepId === 'questions') {
                console.log('[InhouseAssessment] Preparing to render questions step');
                
                // Get the current question section
                const currentSection = this.questionSections[this.currentQuestionSectionIndex];
                console.log(`[InhouseAssessment] Current question section: ${currentSection}`);
                
                // Update the step section map
                this.stepSectionMap['questions'] = currentSection;
                
                // Make sure the questions step is initialized
                if (this.steps['questions']) {
                    // Update the step's question type
                    this.steps['questions'].currentQuestionType = currentSection;
                    console.log(`[InhouseAssessment] Set question type to: ${currentSection}`);
                } else {
                    console.error('[InhouseAssessment] Questions step not initialized');
                }
                
                // Reset question index when changing sections
                if (this.state.currentQuestionType !== currentSection) {
                    this.state.currentQuestionIndex = 0;
                }
                
                // Update state
                this.state.currentQuestionType = currentSection;
                
                // Ensure answers object exists
                if (!this.state.answers) {
                    console.log('[InhouseAssessment] Initializing answers object');
                    this.state.answers = {};
                }
            }
            
            // Render the current step
            if (this.steps[currentStepId]) {
                const stepInstance = this.steps[currentStepId];
                console.log('[InhouseAssessment] Step instance found:', currentStepId);
                
                // Call onEnter lifecycle method if exists
                if (typeof stepInstance.onEnter === 'function') {
                    console.log('[InhouseAssessment] Calling onEnter method for step:', currentStepId);
                    stepInstance.onEnter();
                }
                
                // Generate the HTML content
                console.log('[InhouseAssessment] Rendering HTML content for step:', currentStepId);
                const stepContent = stepInstance.render();
                
                // Update the container
                this.container.innerHTML = stepContent;
                
                // Call afterRender if it exists (ES6 module pattern)  
                if (typeof stepInstance.afterRender === 'function') {
                    console.log('[InhouseAssessment] Calling afterRender for step:', currentStepId);
                    stepInstance.afterRender(this.container);
                }
                // For backward compatibility, also call setupEventListeners if it exists
                else if (typeof stepInstance.setupEventListeners === 'function') {
                    console.log('[InhouseAssessment] Setting up event listeners for step:', currentStepId);
                    stepInstance.setupEventListeners(this.container);
                }
                
                console.log('[InhouseAssessment] Step rendered successfully:', currentStepId);
            } else {
                console.error(`[InhouseAssessment] Unknown step: ${currentStepId}`);
                this.container.innerHTML = `<div class="error">Unknown step: ${currentStepId}</div>`;
                
                // Try to recover by resetting to the first step
                console.log('[InhouseAssessment] Attempting to recover by resetting to first step');
                this.state.currentStep = this.config.steps[0];
            }
        } catch (error) {
            console.error('[InhouseAssessment] Error rendering current step:', error);
            this.container.innerHTML = `
                <div class="error-container">
                    <h2>Error Rendering Step</h2>
                    <p>There was a problem rendering the current step. Please try refreshing the page.</p>
                    <p>Error details: ${error.message}</p>
                </div>
            `;
        }
    }
    
    /**
     * Get questions count by type
     * @param {string} type - Question type ('core', 'industry', or 'activity')
     * @return {number} - Number of questions
     */
    getQuestionsCount(type) {
        return this.getQuestionsByType(type).length;
    }
    
    /**
     * Get questions by type
     * @param {string} type - Question type ('core', 'industry', or 'activity')
     * @return {Array} - Array of questions
     */
    getQuestionsByType(type) {
        if (!this.config) {
            console.error('[InhouseAssessment] No configuration available');
            return [];
        }
        
        let questions = [];
        
        switch(type) {
            case 'core':
                // Get core questions from all dimensions
                if (this.config.coreQuestions) {
                    Object.values(this.config.coreQuestions).forEach(dimensionQuestions => {
                        questions = questions.concat(dimensionQuestions);
                    });
                }
                break;
                
            case 'industry':
                // Get industry-specific questions
                const industry = this.state.selectedIndustry;
                if (industry && this.config.industryQuestions && this.config.industryQuestions[industry]) {
                    questions = this.config.industryQuestions[industry];
                }
                break;
                
            case 'activity':
                // Get activity-specific questions for selected activities
                const activities = this.state.selectedActivities || [];
                activities.forEach(activity => {
                    if (this.config.activityQuestions && this.config.activityQuestions[activity]) {
                        questions = questions.concat(this.config.activityQuestions[activity]);
                    }
                });
                break;
                
            default:
                console.warn(`[InhouseAssessment] Unknown question type: ${type}`);
                break;
        }
        
        return questions;
    }
    
    /**
     * Get progress for a specific question type
     * @param {string} type - Question type ('core', 'industry', or 'activity')
     * @return {Object} - Progress information
     */
    getTypeProgress(type) {
        const questions = this.getQuestionsByType(type);
        const answers = this.state.answers || {};
        
        // Count answered questions of this type
        const answered = questions.filter(q => answers[q.id] !== undefined).length;
        const total = questions.length;
        const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
        
        return {
            answered,
            total,
            percentage
        };
    }
    
    /**
     * Get overall assessment progress
     * @return {Object} - Overall progress information
     */
    getOverallProgress() {
        const coreCount = this.getQuestionsCount('core');
        const industryCount = this.getQuestionsCount('industry');
        const activityCount = this.getQuestionsCount('activity');
        
        const totalQuestions = coreCount + industryCount + activityCount;
        const answeredQuestions = Object.keys(this.state.answers).length;
        
        return {
            answered: answeredQuestions,
            total: totalQuestions,
            percentage: Math.round((answeredQuestions / totalQuestions) * 100) || 0,
            byType: {
                core: this.getTypeProgress('core'),
                industry: this.getTypeProgress('industry'),
                activity: this.getTypeProgress('activity')
            }
        };
    }
    
    /**
     * Get the agency type name - added for compatibility with the email step
     * @return {String|null} - The type of business (e.g., 'In-House Marketing Team')
     */
    getAgencyTypeName() {
        // For the inhouse assessment, we return a generic business type
        return 'In-House Marketing Team';
    }
    
    /**
     * Go to the next step in the assessment
     * This custom implementation handles section-based navigation within the questions step
     */
    nextStep() {
        const currentStepId = this.state.currentStep;
        
        // Special handling for the questions step to navigate through sections
        if (currentStepId === 'questions') {
            // Check if we have more question sections to go through
            if (this.currentQuestionSectionIndex < this.questionSections.length - 1) {
                // Move to the next question section but stay on the questions step
                this.currentQuestionSectionIndex++;
                console.log(`[InhouseAssessment] Moving to next question section: ${this.questionSections[this.currentQuestionSectionIndex]}`);
                
                // Re-render the current step with the new section
                this.renderCurrentStep();
                return;
            }
        }
        
        // For all other steps or when we've finished all question sections
        // Call the parent class implementation
        super.nextStep();
    }
    
    /**
     * Go to the previous step in the assessment
     * This custom implementation handles section-based navigation within the questions step
     */
    previousStep() {
        const currentStepId = this.state.currentStep;
        
        // Special handling for the questions step to navigate through sections
        if (currentStepId === 'questions' && this.currentQuestionSectionIndex > 0) {
            // Move to the previous question section but stay on the questions step
            this.currentQuestionSectionIndex--;
            console.log(`[InhouseAssessment] Moving to previous question section: ${this.questionSections[this.currentQuestionSectionIndex]}`);
            
            // Re-render the current step with the new section
            this.renderCurrentStep();
            return;
        }
        
        // For all other steps or when we're at the first question section
        // Call the parent class implementation
        super.previousStep();
    }
    
    /**
     * Set up global event listeners for the assessment
     * Called by the base class during initialization
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
}

// Export the class using ES6 module syntax
export { InhouseAssessment };

// No global registration needed - using ES6 modules properly
