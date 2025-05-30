/**
 * Assessment Framework - Inhouse Marketing Assessment
 * 
 * Implementation of the In-House Marketing AI Readiness Assessment
 * Extends the base assessment framework with specialized components for
 * evaluating internal marketing teams' AI readiness
 */

// All dependencies will be accessed as browser globals

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
        // Merge external config with loaded configurations
        const enhancedConfig = {
            ...InHouseMarketingQuestionsConfig,
            recommendationsConfig: InHouseMarketingRecommendationsConfig,
            ...config
        };
        
        // Set the proper step sequence to match what the navigation controller expects
        enhancedConfig.steps = [
            'industry-selection',
            'activity-selection',
            'company-info',
            'core-questions',
            'industry-questions',
            'activity-questions',
            'contact',
            'results'
        ];
        
        super(enhancedConfig, container);
        this.type = 'inhouse-marketing';
        
        // Initialize engines and components
        this.scoringEngine = new InhouseMarketingScoring(enhancedConfig); // Use proper scoring engine from scoring directory
        this.recommendationsEngine = new InhouseRecommendationsEngine(enhancedConfig);
        this.dashboard = new InhouseMarketingDashboard(enhancedConfig);
        
        // Register steps with the implemented classes
        this.steps = {
            'setup': new SetupStep(this),              // Setup step (combined industry, activity, company)
            'industry-selection': new SetupStep(this),  // Alias for setup step with industry section
            'activity-selection': new SetupStep(this),  // Alias for setup step with activity section
            'company-info': new SetupStep(this),       // Alias for setup step with company section
            'core-questions': new QuestionsStep(this), // Core questions section
            'industry-questions': new QuestionsStep(this), // Industry-specific questions
            'activity-questions': new QuestionsStep(this), // Activity-specific questions
            'contact': new ContactStep(this),          // Contact information
            'results': new ResultsStep(this)           // Results visualization
        };
        
        // Configure step mappings so our setup step can handle multiple logical steps
        this.stepSectionMap = {
            'industry-selection': 'industry',
            'activity-selection': 'activity',
            'company-info': 'company',        // Map company-info step to company section
            'core-questions': 'core',
            'industry-questions': 'industry',
            'activity-questions': 'activity'
        };
        
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
        const currentStepId = this.state.currentStep;
        console.log(`[InhouseAssessment] Rendering step: ${currentStepId}`);
        
        try {
            // Check if the current step is valid
            if (!currentStepId) {
                console.error('[InhouseAssessment] Current step is undefined');
                this.state.currentStep = this.config.steps[0]; // Default to first step
                console.log('[InhouseAssessment] Defaulted to first step:', this.state.currentStep);
            }
            
            // For the setup step, we need to also specify which section to show
            if (currentStepId in this.stepSectionMap) {
                const section = this.stepSectionMap[currentStepId];
                if (section) {
                    console.log('[InhouseAssessment] Setting setup section to:', section);
                    this.steps[currentStepId].currentSection = section;
                }
            }
            
            // Special handling for question steps
            if (currentStepId && currentStepId.includes('questions')) {
                console.log('[InhouseAssessment] Preparing to render a question step');
                
                // Ensure question state is initialized
                if (!this.state.currentQuestionType) {
                    // Try to extract question type from step name
                    const questionType = currentStepId.split('-')[0];
                    if (['core', 'industry', 'activity'].includes(questionType)) {
                        console.log(`[InhouseAssessment] Setting question type to ${questionType} based on step name`);
                        this.state.currentQuestionType = questionType;
                    } else {
                        console.log('[InhouseAssessment] Setting default question type to core');
                        this.state.currentQuestionType = 'core';
                    }
                    this.state.currentQuestionIndex = 0;
                }
                
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
                
                // Setup event listeners for the step
                if (typeof stepInstance.setupEventListeners === 'function') {
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

// Make the class available as a browser global
window.InhouseAssessment = InhouseAssessment;

// Log that the class has been registered
console.log('[InhouseAssessment] Class registered as global');
