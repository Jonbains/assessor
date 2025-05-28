/**
 * Assessment Framework - Questions Step
 * 
 * Implements the questions step for the agency assessment
 * Displays questions filtered by selected services and collects answers
 */

import { StepBase } from '../../../core/step-base.js';
import { addEvent } from '../../../shared/utils/event-manager.js';

/**
 * QuestionsStep class
 * Presents assessment questions to the user and collects responses
 */
export class QuestionsStep extends StepBase {
    /**
     * Constructor for questions step
     * @param {AgencyAssessment} assessment - The parent assessment
     */
    constructor(assessment) {
        super(assessment);
        
        // Define validation rules
        this.validationRules = {
            currentQuestion: [
                { type: 'required', message: 'Please answer the current question' }
            ]
        };
        
        this.cleanupListeners = [];
        this.dimensions = {};
    }
    
    /**
     * Render the questions step
     * @return {String} - HTML content for the step
     */
    render() {
        const { state } = this.assessment;
        
        // If we haven't loaded questions yet, do so now
        if (!state.filteredQuestions || state.filteredQuestions.length === 0) {
            state.filteredQuestions = this.assessment.getQuestionsForSelectedServices();
            console.log(`[QuestionsStep] Loaded ${state.filteredQuestions.length} questions`);
            
            // Reset current question index
            state.currentQuestionIndex = 0;
        }
        
        // Handle case when no questions are available
        if (!state.filteredQuestions || state.filteredQuestions.length === 0) {
            return this.renderNoQuestionsMessage();
        }
        
        // Get current question
        const currentQuestion = state.filteredQuestions[state.currentQuestionIndex];
        const totalQuestions = state.filteredQuestions.length;
        const currentIndex = state.currentQuestionIndex + 1;
        
        // Get existing answer if any
        const currentAnswer = state.answers[currentQuestion.id];
        
        // Get dimension display name
        const dimensionName = this.assessment.formatDimensionName(currentQuestion.dimension);
        
        // Build the question display
        return `
            <div class="assessment-step questions-step">
                <div class="question-progress">
                    <div class="progress-text">
                        Question ${currentIndex} of ${totalQuestions}
                    </div>
                    <div class="progress-bar-container">
                        <div class="progress-bar" style="width: ${(currentIndex / totalQuestions) * 100}%;"></div>
                    </div>
                </div>
                
                <div class="question-container">
                    <div class="question-dimension">${dimensionName}</div>
                    <div class="question-text">${currentQuestion.question}</div>
                    
                    <div class="question-options">
                        ${this.renderQuestionOptions(currentQuestion, currentAnswer)}
                    </div>
                </div>
                
                <div id="question-error" class="error-message" style="display: none;">
                    Please select an answer to continue
                </div>
                
                ${this.renderNavigation(currentIndex, totalQuestions)}
            </div>
        `;
    }
    
    /**
     * Render a message when no questions are available
     * @return {String} - HTML content for the no questions message
     */
    renderNoQuestionsMessage() {
        return `
            <div class="assessment-step questions-step">
                <div class="no-questions-message">
                    <h2>No Assessment Questions Available</h2>
                    <p>There are no questions available for the selected services. 
                    Please go back and select different services or contact support for assistance.</p>
                </div>
                
                ${this.renderNavigation(0, 0)}
            </div>
        `;
    }
    
    /**
     * Render the options for a question
     * @param {Object} question - The question object
     * @param {any} selectedAnswer - The user's current answer (if any)
     * @return {String} - HTML content for the options
     */
    renderQuestionOptions(question, selectedAnswer) {
        if (!question.options || question.options.length === 0) {
            return '<div class="error-message">No options available for this question</div>';
        }
        
        let optionsHtml = '';
        
        question.options.forEach((option, index) => {
            const optionId = `question_${question.id}_option_${index}`;
            const isSelected = selectedAnswer === index || selectedAnswer === option.score;
            const selectedClass = isSelected ? 'selected' : '';
            
            optionsHtml += `
                <div class="question-option ${selectedClass}" data-question-id="${question.id}" data-option-index="${index}" data-score="${option.score}">
                    <div class="option-text">${option.text}</div>
                </div>
            `;
        });
        
        return optionsHtml;
    }
    
    /**
     * Render navigation buttons for questions
     * @param {Number} currentIndex - Current question index
     * @param {Number} totalQuestions - Total number of questions
     * @return {String} - HTML for navigation buttons
     */
    renderNavigation(currentIndex, totalQuestions) {
        const isFirstQuestion = currentIndex <= 1;
        const isLastQuestion = currentIndex >= totalQuestions;
        const nextText = isLastQuestion ? 'Complete' : 'Next';
        
        return `
            <div class="assessment-navigation">
                <button class="btn btn-secondary btn-prev" ${isFirstQuestion ? 'disabled' : ''}>Previous</button>
                <button class="btn btn-primary btn-next">${nextText}</button>
            </div>
        `;
    }
    
    /**
     * Set up event listeners for this step
     * @param {Element} container - The step container element
     */
    setupEventListeners(container) {
        // Option selection handlers
        const options = container.querySelectorAll('.question-option');
        options.forEach(option => {
            const cleanup = addEvent(option, 'click', this.handleOptionSelect.bind(this));
            this.cleanupListeners.push(cleanup);
        });
        
        // Navigation button handlers
        const nextButton = container.querySelector('.btn-next');
        if (nextButton) {
            const cleanup = addEvent(nextButton, 'click', this.handleNext.bind(this));
            this.cleanupListeners.push(cleanup);
        }
        
        const prevButton = container.querySelector('.btn-prev');
        if (prevButton) {
            const cleanup = addEvent(prevButton, 'click', this.handlePrev.bind(this));
            this.cleanupListeners.push(cleanup);
        }
    }
    
    /**
     * Clean up event listeners when leaving this step
     */
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
    
    /**
     * Handle option selection
     * @param {Event} event - Click event
     */
    handleOptionSelect(event) {
        const option = event.currentTarget;
        const questionId = option.dataset.questionId;
        const optionScore = parseInt(option.dataset.score, 10);
        
        // Update selected option UI
        const allOptions = document.querySelectorAll(`.question-option[data-question-id="${questionId}"]`);
        allOptions.forEach(opt => {
            opt.classList.remove('selected');
        });
        option.classList.add('selected');
        
        // Store answer in assessment state
        this.assessment.state.answers[questionId] = optionScore;
        
        // Hide error message if visible
        const errorElement = document.getElementById('question-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        // Auto-advance to next question if this isn't the last question
        setTimeout(() => {
            const isLastQuestion = this.assessment.state.currentQuestionIndex === 
                this.assessment.state.filteredQuestions.length - 1;
            
            if (!isLastQuestion) {
                this.moveToNextQuestion();
            }
        }, 500);
        
        // Save state
        this.assessment.stateManager.saveState();
    }
    
    /**
     * Move to the next question
     */
    moveToNextQuestion() {
        const { state } = this.assessment;
        
        if (state.currentQuestionIndex < state.filteredQuestions.length - 1) {
            state.currentQuestionIndex++;
            this.assessment.renderCurrentStep();
        }
    }
    
    /**
     * Move to the previous question
     */
    moveToPreviousQuestion() {
        const { state } = this.assessment;
        
        if (state.currentQuestionIndex > 0) {
            state.currentQuestionIndex--;
            this.assessment.renderCurrentStep();
        }
    }
    
    /**
     * Handle next button click
     * @param {Event} event - Click event
     */
    handleNext(event) {
        const { state } = this.assessment;
        
        // If this is the last question, validate all answers and proceed to next step
        if (state.currentQuestionIndex === state.filteredQuestions.length - 1) {
            if (this.validateAllAnswers()) {
                // Trigger onNext callback
                this.onNext();
                
                // Navigate to next step
                this.assessment.nextStep();
            }
        } 
        // Otherwise, validate current question and move to next question
        else {
            if (this.validateCurrentQuestion()) {
                this.moveToNextQuestion();
            }
        }
    }
    
    /**
     * Handle previous button click
     * @param {Event} event - Click event
     */
    handlePrev(event) {
        const { state } = this.assessment;
        
        // If this is the first question, go to previous step
        if (state.currentQuestionIndex === 0) {
            // Trigger onPrevious callback
            this.onPrevious();
            
            // Navigate to previous step
            this.assessment.previousStep();
        } 
        // Otherwise, move to previous question
        else {
            this.moveToPreviousQuestion();
        }
    }
    
    /**
     * Validate the current question
     * @return {Boolean} - True if the question has been answered
     */
    validateCurrentQuestion() {
        const { state } = this.assessment;
        const currentQuestion = state.filteredQuestions[state.currentQuestionIndex];
        
        // Check if question has been answered
        if (!state.answers.hasOwnProperty(currentQuestion.id)) {
            // Show error message
            const errorElement = document.getElementById('question-error');
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            return false;
        }
        
        return true;
    }
    
    /**
     * Validate all questions have been answered
     * @return {Boolean} - True if all questions have been answered
     */
    validateAllAnswers() {
        const { state } = this.assessment;
        let allAnswered = true;
        
        // First check the current question
        if (!this.validateCurrentQuestion()) {
            return false;
        }
        
        // Then check all previous questions
        state.filteredQuestions.forEach(question => {
            if (!state.answers.hasOwnProperty(question.id)) {
                allAnswered = false;
                
                // Move to the unanswered question
                state.currentQuestionIndex = state.filteredQuestions.findIndex(q => q.id === question.id);
                this.assessment.renderCurrentStep();
                
                // Show error message
                const errorElement = document.getElementById('question-error');
                if (errorElement) {
                    errorElement.style.display = 'block';
                }
            }
        });
        
        return allAnswered;
    }
    
    /**
     * Validate the step
     * @return {Boolean} - True if the step is valid
     */
    validate() {
        return this.validateAllAnswers();
    }
    
    /**
     * Actions to perform when moving to the next step
     * @return {Boolean} - True if the navigation should proceed
     */
    onNext() {
        // Clean up event listeners
        this.cleanupEventListeners();
        return true;
    }
    
    /**
     * Actions to perform when moving to the previous step
     * @return {Boolean} - True if the navigation should proceed
     */
    onPrevious() {
        // Clean up event listeners
        this.cleanupEventListeners();
        return true;
    }
}
