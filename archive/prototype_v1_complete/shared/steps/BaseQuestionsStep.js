/**
 * Assessment Framework - Base Questions Step
 * 
 * This base component provides a foundation for question handling across different assessment types.
 * It combines:
 * - The inhouse assessment's flexible question type handling and progression
 * - The agency assessment's modern visual design and user experience
 * - Shared functionality for navigation, validation, and state management
 */

// Import required dependencies
import { StepBase } from '../../core/step-base.js';
import { addEvent } from '../utils/event-manager.js';

export class BaseQuestionsStep extends StepBase {
    /**
     * Constructor for the base questions step
     * @param {Object} assessment - The parent assessment
     */
    constructor(assessment) {
        super(assessment);
        
        // Track event listeners for cleanup
        this.cleanupListeners = [];
        
        // Support for different question types (from inhouse)
        this.questionTypes = ['core', 'industry', 'activity'];
        this.currentQuestionType = 'core';
        
        // Common validation rules
        this.validationRules = {
            currentQuestion: [
                { type: 'required', message: 'Please answer this question to continue' }
            ]
        };
        
        // Question state tracking
        this.currentIndex = 0;
        this.questions = [];
        this.totalQuestions = 0;
        this.dimensions = {};
    }
    
    /**
     * Actions to perform when entering this step
     */
    onEnter() {
        console.log('[BaseQuestionsStep] onEnter called');
        
        // Determine question type from step ID (from inhouse)
        this.determineQuestionType();
        
        // Initialize questions if needed
        if (!this.questions || this.questions.length === 0) {
            this.initializeQuestions();
        }
        
        // Set current index from assessment state
        this.currentIndex = this.assessment.state.currentQuestionIndex || 0;
        
        // Cap the index to valid range
        if (this.currentIndex >= this.totalQuestions) {
            this.currentIndex = this.totalQuestions - 1;
        }
        if (this.currentIndex < 0) {
            this.currentIndex = 0;
        }
        
        // Update assessment state
        this.assessment.state.currentQuestionIndex = this.currentIndex;
        this.assessment.state.currentQuestionType = this.currentQuestionType;
    }
    
    /**
     * Determine the current question type based on step ID
     * Approach from inhouse assessment
     */
    determineQuestionType() {
        const currentStepId = this.assessment.state.currentStep;
        if (currentStepId && currentStepId.includes('-questions')) {
            const questionType = currentStepId.split('-')[0];
            if (this.questionTypes.includes(questionType)) {
                console.log(`[BaseQuestionsStep] Setting question type to '${questionType}' based on step ID`);
                this.assessment.state.currentQuestionType = questionType;
                this.currentQuestionType = questionType;
            }
        }
    }
    
    /**
     * Initialize questions based on current type
     * To be implemented by derived classes
     */
    initializeQuestions() {
        // Base implementation
        this.questions = [];
        this.totalQuestions = 0;
        
        console.log('[BaseQuestionsStep] initializeQuestions - Base implementation called');
        console.warn('[BaseQuestionsStep] Derived classes should override initializeQuestions');
    }
    
    /**
     * Backward compatibility method that calls initializeQuestions
     * This ensures compatibility with code that might be expecting the old method name
     */
    initializeQuestionSet() {
        console.log('[BaseQuestionsStep] initializeQuestionSet called - using initializeQuestions instead');
        return this.initializeQuestions();
    }
    
    /**
     * Render the question step
     * @return {String} - HTML content for the step
     */
    render() {
        const currentQuestion = this.questions[this.currentIndex];
        
        if (!currentQuestion) {
            return `
                <div class="assessment-step questions-step">
                    <h2>Questions</h2>
                    <p class="error-message">No questions available for this section.</p>
                    ${this.renderNavigation(false, true)}
                </div>
            `;
        }
        
        return `
            <div class="assessment-step questions-step">
                ${this.renderProgressBar()}
                ${this.renderQuestionCard(currentQuestion)}
                ${this.renderNavigation(this.currentIndex > 0, this.currentIndex < this.totalQuestions - 1)}
            </div>
        `;
    }
    
    /**
     * Render progress bar showing all question types
     * Combines the tracking approach from inhouse with agency styling
     * @return {String} - HTML for progress bar
     */
    renderProgressBar() {
        const currentType = this.currentQuestionType;
        const currentIndex = this.currentIndex;
        const totalQuestions = this.totalQuestions;
        
        // Calculate overall progress across all question types
        const typeCompletionCount = {};
        const typeTotalCount = {};
        
        // Initialize tracking for each question type
        this.questionTypes.forEach(type => {
            typeCompletionCount[type] = 0;
            typeTotalCount[type] = this.getQuestionCountForType(type);
        });
        
        // Mark current question type progress
        typeCompletionCount[currentType] = Math.min(currentIndex + 1, this.totalQuestions);
        
        // Calculate overall completion percentage
        let completedCount = 0;
        let totalCount = 0;
        
        Object.keys(typeTotalCount).forEach(type => {
            completedCount += typeCompletionCount[type];
            totalCount += typeTotalCount[type];
        });
        
        const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
        
        // Create the progress indicators for each question type
        const typeIndicators = this.questionTypes.map(type => {
            const isActive = type === currentType;
            const typeName = this.getQuestionTypeName(type);
            const typeCount = typeTotalCount[type];
            const typeCompleted = typeCompletionCount[type];
            
            return `
                <div class="question-type ${isActive ? 'active' : ''}">
                    <div class="type-label">${typeName}</div>
                    <div class="type-count">${typeCompleted}/${typeCount}</div>
                </div>
            `;
        }).join('');
        
        // Determine question dimension and create a badge if applicable
        const dimensionBadge = currentType && currentIndex < totalQuestions ? 
            this.getDimensionBadge(this.questions[currentIndex]) : '';
        
        return `
            <div class="question-progress">
                <div class="question-types">
                    ${typeIndicators}
                </div>
                <div class="progress-container">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progressPercentage}%"></div>
                    </div>
                </div>
                <div class="question-counter">
                    Question ${currentIndex + 1} of ${totalQuestions}
                    ${dimensionBadge}
                </div>
            </div>
        `;
    }
    
    /**
     * Get dimension badge HTML for a question
     * Follows agency design pattern
     * @param {Object} question - The question object
     * @return {String} - HTML for dimension badge
     */
    getDimensionBadge(question) {
        if (!question || !question.dimension) return '';
        
        const dimensionMap = {
            'financial': 'Financial Health',
            'operational': 'Operational',
            'ai': 'AI Readiness',
            'business': 'Business',
            'people': 'People Skills',
            'process': 'Process',
            'technical': 'Technical',
            'market': 'Market Position'
        };
        
        const dimensionLabel = dimensionMap[question.dimension] || question.dimension;
        const dimensionClass = `dimension-${question.dimension}`;
        
        return `<span class="dimension-badge ${dimensionClass}">${dimensionLabel}</span>`;
    }
    
    /**
     * Render a question card with answers
     * Follows agency design aesthetic
     * @param {Object} question - The question to render
     * @return {String} - HTML for question card
     */
    renderQuestionCard(question) {
        if (!question) return '';
        
        const answers = this.assessment.state.answers || {};
        const currentAnswer = answers[question.id];
        
        // Render answer options based on question type
        let answerOptionsHtml = '';
        
        if (question.type === 'scale' || question.type === 'likert') {
            // Numeric scale (1-5 or 1-6)
            const optionCount = question.options?.length || 5;
            answerOptionsHtml = this.renderScaleOptions(question, currentAnswer, optionCount);
        } else if (question.type === 'multiple-choice' || !question.type) {
            // Default to multiple choice
            answerOptionsHtml = this.renderMultipleChoiceOptions(question, currentAnswer);
        }
        
        return `
            <div class="question-card">
                <h2 class="question-text">${question.text}</h2>
                ${question.description ? `<p class="question-description">${question.description}</p>` : ''}
                <div class="answer-options">
                    ${answerOptionsHtml}
                </div>
            </div>
        `;
    }
    
    /**
     * Render scale-type answer options (Likert scales)
     * @param {Object} question - The question object
     * @param {String|Number} currentAnswer - Current selected answer
     * @param {Number} optionCount - Number of options in scale
     * @return {String} - HTML for scale options
     */
    renderScaleOptions(question, currentAnswer, optionCount) {
        let optionsHtml = '';
        
        for (let i = 1; i <= optionCount; i++) {
            const isSelected = currentAnswer == i; // Intentional loose equality
            const option = question.options && question.options[i-1] ? 
                question.options[i-1] : { value: i, label: i.toString() };
            
            optionsHtml += `
                <div class="scale-option ${isSelected ? 'selected' : ''}" data-value="${option.value}">
                    <div class="option-number">${i}</div>
                    <div class="option-label">${option.label || ''}</div>
                </div>
            `;
        }
        
        return `
            <div class="scale-options" data-question-id="${question.id}">
                ${optionsHtml}
            </div>
        `;
    }
    
    /**
     * Render multiple-choice answer options
     * @param {Object} question - The question object
     * @param {String|Number} currentAnswer - Current selected answer
     * @return {String} - HTML for multiple choice options
     */
    renderMultipleChoiceOptions(question, currentAnswer) {
        if (!question.options || !question.options.length) {
            return '<p class="error-message">No options available for this question.</p>';
        }
        
        return question.options.map(option => {
            const isSelected = currentAnswer == option.value; // Intentional loose equality
            
            return `
                <div class="choice-option ${isSelected ? 'selected' : ''}" data-value="${option.value}">
                    <div class="option-number">${option.value}</div>
                    <div class="option-text">${option.text}</div>
                </div>
            `;
        }).join('');
    }
    
    /**
     * Render navigation buttons
     * @param {Boolean} showPrev - Whether to show previous button
     * @param {Boolean} showNext - Whether to show next button
     * @return {String} - HTML for navigation buttons
     */
    renderNavigation(showPrev = true, showNext = true) {
        return `
            <div class="assessment-navigation">
                <button class="btn btn-secondary prev-btn" ${!showPrev ? 'disabled' : ''}>
                    <i class="arrow-left"></i> Previous
                </button>
                <button class="btn btn-primary next-btn" ${!showNext ? 'disabled' : ''}>
                    Next <i class="arrow-right"></i>
                </button>
            </div>
        `;
    }
    
    /**
     * Set up event listeners for this step
     * @param {Element} container - DOM container for this step
     */
    setupEventListeners(container) {
        if (!container) return;
        
        // Set up option selection
        this.setupAnswerOptionListeners(container);
        
        // Set up navigation
        this.setupNavigationListeners(container);
    }
    
    /**
     * Set up listeners for answer options
     * @param {Element} container - DOM container for this step
     */
    setupAnswerOptionListeners(container) {
        // Handle scale options
        const scaleOptions = container.querySelectorAll('.scale-options .scale-option');
        scaleOptions.forEach(option => {
            const clickHandler = () => {
                const value = option.getAttribute('data-value');
                const questionId = option.parentElement.getAttribute('data-question-id');
                this.selectAnswer(questionId, value, option);
            };
            
            option.addEventListener('click', clickHandler);
            this.cleanupListeners.push(() => {
                option.removeEventListener('click', clickHandler);
            });
        });
        
        // Handle multiple choice options
        const choiceOptions = container.querySelectorAll('.choice-option');
        choiceOptions.forEach(option => {
            const clickHandler = () => {
                const value = option.getAttribute('data-value');
                const questionId = this.questions[this.currentIndex].id;
                this.selectAnswer(questionId, value, option);
            };
            
            option.addEventListener('click', clickHandler);
            this.cleanupListeners.push(() => {
                option.removeEventListener('click', clickHandler);
            });
        });
    }
    
    /**
     * Set up listeners for navigation buttons
     * @param {Element} container - DOM container for this step
     */
    setupNavigationListeners(container) {
        // Previous button
        const prevButton = container.querySelector('.prev-btn');
        if (prevButton) {
            const prevClickHandler = () => this.goToPreviousQuestion();
            prevButton.addEventListener('click', prevClickHandler);
            this.cleanupListeners.push(() => {
                prevButton.removeEventListener('click', prevClickHandler);
            });
        }
        
        // Next button
        const nextButton = container.querySelector('.next-btn');
        if (nextButton) {
            const nextClickHandler = () => this.goToNextQuestion();
            nextButton.addEventListener('click', nextClickHandler);
            this.cleanupListeners.push(() => {
                nextButton.removeEventListener('click', nextClickHandler);
            });
        }
    }
    
    /**
     * Select an answer for a question
     * @param {String} questionId - ID of the question
     * @param {String|Number} value - Answer value
     * @param {Element} selectedElement - The selected DOM element
     */
    selectAnswer(questionId, value, selectedElement) {
        // Initialize answers object if needed
        if (!this.assessment.state.answers) {
            this.assessment.state.answers = {};
        }
        
        // Save answer
        this.assessment.state.answers[questionId] = value;
        
        // Update UI
        if (selectedElement) {
            // Remove selection from siblings
            const parent = selectedElement.parentElement;
            if (parent) {
                const siblings = parent.querySelectorAll('.scale-option, .choice-option');
                siblings.forEach(sibling => {
                    sibling.classList.remove('selected');
                });
            }
            
            // Mark selected option
            selectedElement.classList.add('selected');
        }
        
        // Save state
        this.assessment.stateManager.saveState();
        
        console.log(`[BaseQuestionsStep] Selected answer for question ${questionId}: ${value}`);
    }
    
    /**
     * Navigate to the previous question
     */
    goToPreviousQuestion() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateQuestionState();
            this.assessment.renderCurrentStep();
        } else {
            // At the first question of the current type
            this.handleFirstQuestionNavigation();
        }
    }
    
    /**
     * Navigate to the next question
     */
    goToNextQuestion() {
        // Check if question is answered
        const currentQuestion = this.questions[this.currentIndex];
        if (currentQuestion && !this.isQuestionAnswered(currentQuestion.id)) {
            this.showRequiredError();
            return;
        }
        
        if (this.currentIndex < this.totalQuestions - 1) {
            this.currentIndex++;
            this.updateQuestionState();
            this.assessment.renderCurrentStep();
        } else {
            // At the last question of the current type
            this.handleLastQuestionNavigation();
        }
    }
    
    /**
     * Handle navigation when at the first question
     * To be implemented by derived classes
     */
    handleFirstQuestionNavigation() {
        console.log('[BaseQuestionsStep] At first question - override in derived class for custom navigation');
        // Default behavior: go to previous step
        this.assessment.navigationController.previousStep();
    }
    
    /**
     * Handle navigation when at the last question
     * To be implemented by derived classes
     */
    handleLastQuestionNavigation() {
        console.log('[BaseQuestionsStep] At last question - override in derived class for custom navigation');
        // Default behavior: go to next step
        this.assessment.navigationController.nextStep();
    }
    
    /**
     * Update the current question state in the assessment
     */
    updateQuestionState() {
        this.assessment.state.currentQuestionIndex = this.currentIndex;
        this.assessment.stateManager.saveState();
    }
    
    /**
     * Check if a question has been answered
     * @param {String} questionId - ID of the question to check
     * @return {Boolean} - True if the question has been answered
     */
    isQuestionAnswered(questionId) {
        const answers = this.assessment.state.answers || {};
        return answers[questionId] !== undefined && answers[questionId] !== null && answers[questionId] !== '';
    }
    
    /**
     * Show required field error
     */
    showRequiredError() {
        // Flash the answer options to indicate they're required
        const container = document.querySelector('.assessment-step');
        if (container) {
            const answerOptions = container.querySelector('.answer-options');
            if (answerOptions) {
                answerOptions.classList.add('error-highlight');
                setTimeout(() => {
                    answerOptions.classList.remove('error-highlight');
                }, 1000);
            }
        }
    }
    
    /**
     * Get the number of questions for a given type
     * To be implemented by derived classes
     * @param {String} type - Question type
     * @return {Number} - Number of questions for the type
     */
    getQuestionCountForType(type) {
        return 0; // Base implementation
    }
    
    /**
     * Get user-friendly name for question type
     * @param {String} type - Question type
     * @return {String} - Display name for the type
     */
    getQuestionTypeName(type) {
        const typeNames = {
            'core': 'Core',
            'industry': 'Industry',
            'activity': 'Activities'
        };
        return typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
    }
    
    /**
     * Clean up event listeners when leaving the step
     */
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
    
    /**
     * Validate the step
     * @return {Boolean} - True if the step is valid
     */
    validate() {
        // For questions step, consider valid if current question is answered
        const currentQuestion = this.questions[this.currentIndex];
        if (!currentQuestion) return true;
        
        return this.isQuestionAnswered(currentQuestion.id);
    }
}

console.log('[BaseQuestionsStep] Class exported as ES6 module');
