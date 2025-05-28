/**
 * Assessment Framework - Base Assessment Class
 * 
 * This serves as the foundation for all assessment types in the modular structure
 */

// Import required controllers
import { NavigationController } from './navigation-controller.js';
import { StateManager } from './state-manager.js';

export class AssessmentBase {
    /**
     * Constructor for the base assessment
     * @param {Object} config - Assessment configuration
     * @param {Element} container - DOM container to render the assessment
     */
    constructor(config, container) {
        this.config = config;
        this.container = container;
        this.state = this.initializeState();
        this.navigationController = new NavigationController(this);
        this.stateManager = new StateManager(this);
    }
    
    /**
     * Initialize the assessment state
     * To be implemented by specific assessment types
     */
    initializeState() { 
        throw new Error('Must implement initializeState'); 
    }
    
    /**
     * Calculate assessment results
     * To be implemented by specific assessment types
     */
    calculateResults() { 
        throw new Error('Must implement calculateResults'); 
    }
    
    /**
     * Get questions for a specific step
     * @param {String} step - The step identifier
     * @return {Array} - Array of question objects
     */
    getQuestionsForStep(step) { 
        throw new Error('Must implement getQuestionsForStep'); 
    }
    
    /**
     * Render the current assessment step
     */
    renderCurrentStep() {
        // To be implemented in specific assessments
        throw new Error('Must implement renderCurrentStep');
    }
    
    /**
     * Set up event listeners for the assessment
     */
    setupEventListeners() {
        // To be implemented in specific assessments
        throw new Error('Must implement setupEventListeners');
    }
    
    /**
     * Navigate to the previous step
     */
    previousStep() {
        return this.navigationController.previousStep();
    }
    
    /**
     * Navigate to the next step
     */
    nextStep() {
        return this.navigationController.nextStep();
    }
    
    /**
     * Validate the current step
     * @return {Boolean} - True if the current step is valid
     */
    validateCurrentStep() {
        // Default implementation to be overridden
        return true;
    }
    
    /**
     * Reset the assessment to its initial state
     */
    resetAssessment() {
        this.state = this.initializeState();
        this.renderCurrentStep();
    }
    
    /**
     * Initialize the assessment
     */
    init() {
        this.renderCurrentStep();
        this.setupEventListeners();
    }
}

// Import statements will be added at the top when navigation controller and state manager are created
