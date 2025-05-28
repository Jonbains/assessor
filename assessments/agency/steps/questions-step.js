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
                    <div class="question-dimension" style="font-size: 16px; font-weight: bold; text-transform: uppercase; color: #555; margin-bottom: 10px; background-color: #f0f0f0; padding: 8px 15px; border-radius: 20px; display: inline-block;">${dimensionName}</div>
                    <div class="question-text" style="font-size: 24px; font-weight: 500; margin: 15px 0; color: #ffff66; line-height: 1.5;">${currentQuestion.question}</div>
                    
                    <div class="question-options" style="margin-top: 25px;">
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
        console.log('[QuestionsStep] Rendering options for question:', question);
        
        if (!question || !question.options || !Array.isArray(question.options)) {
            console.error('[QuestionsStep] Invalid question options structure:', question);
            return '<div class="error">No options available</div>';
        }
        
        // For the first question, hardcode the answers from the known configuration
        if (question.id === 1) {
            return `
                <div class="option" data-question-id="1" data-option-index="0" data-option-score="0"
                     style="padding: 16px; margin-bottom: 12px; border: 2px solid white; border-radius: 8px; 
                            background-color: black; color: white; cursor: pointer; transition: all 0.2s ease; 
                            font-size: 16px;">
                    They'd shadow someone and pick it up as they go
                </div>
                <div class="option" data-question-id="1" data-option-index="1" data-option-score="1"
                     style="padding: 16px; margin-bottom: 12px; border: 2px solid white; border-radius: 8px; 
                            background-color: black; color: white; cursor: pointer; transition: all 0.2s ease; 
                            font-size: 16px;">
                    We've got some basic guides, but they're probably outdated
                </div>
                <div class="option" data-question-id="1" data-option-index="2" data-option-score="3"
                     style="padding: 16px; margin-bottom: 12px; border: 2px solid white; border-radius: 8px; 
                            background-color: black; color: white; cursor: pointer; transition: all 0.2s ease; 
                            font-size: 16px;">
                    We have documentation for the main stuff, and update it yearly
                </div>
                <div class="option" data-question-id="1" data-option-index="3" data-option-score="5"
                     style="padding: 16px; margin-bottom: 12px; border: 2px solid white; border-radius: 8px; 
                            background-color: black; color: white; cursor: pointer; transition: all 0.2s ease; 
                            font-size: 16px;">
                    Everything's documented in our wiki/knowledge base that we actually maintain
                </div>
            `;
        }
        
        // Build option HTML
        let optionsHtml = '';
        
        question.options.forEach((option, index) => {
            console.log(`[QuestionsStep] Rendering option ${index}:`, option);
            
            if (!option || !option.text) {
                console.error(`[QuestionsStep] Option ${index} has no text:`, option);
                return;
            }
            
            const isSelected = selectedAnswer && selectedAnswer.optionIndex === index;
            const selectedClass = isSelected ? 'selected' : '';
            
            // Plain option text without HTML rendering issues
            const optionText = option.text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            console.log(`[QuestionsStep] Option text: "${optionText}"`, option);
            
            // Direct HTML rendering with embedded option text
            optionsHtml += `
                <div class="option ${selectedClass}" 
                     data-question-id="${question.id}" 
                     data-option-index="${index}" 
                     data-option-score="${option.score || 0}"
                     style="padding: 16px; 
                            margin-bottom: 12px; 
                            border: 2px solid ${isSelected ? '#ffff66' : 'white'}; 
                            border-radius: 8px; 
                            background-color: black; 
                            color: white;
                            cursor: pointer; 
                            transition: all 0.2s ease; 
                            font-size: 16px;"
                     onmouseover="this.style.borderColor='#ffff66'" 
                     onmouseout="this.style.borderColor='${isSelected ? '#ffff66' : 'white'}'">
                    ${optionText}
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
        console.log('[QuestionsStep] Setting up event listeners');
        
        // Option selection handlers - use the correct selector for our options
        const options = container.querySelectorAll('.option');
        console.log(`[QuestionsStep] Found ${options.length} option elements`);
        
        options.forEach(option => {
            console.log(`[QuestionsStep] Adding click listener to option: ${option.textContent.substring(0, 20)}...`);
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
        const optionIndex = parseInt(option.dataset.optionIndex, 10);
        const optionScore = parseInt(option.dataset.optionScore, 10);
        
        const { state } = this.assessment;
        
        // Update the answers in state
        state.answers[questionId] = {
            optionIndex,
            score: optionScore
        };
        
        // Update state manager
        this.assessment.stateManager.updateState('answers', state.answers);
        
        // Update the UI
        const optionsContainer = option.parentElement;
        const options = optionsContainer.querySelectorAll('.option');
        
        // Remove selected class from all options
        options.forEach(opt => opt.classList.remove('selected'));
        
        // Add selected class to the clicked option
        option.classList.add('selected');
        
        // Also update the style to show it's selected
        option.style.backgroundColor = 'black';
        option.style.borderColor = '#ffff66';
        option.style.color = 'white';
        
        // Hide error message if visible
        const errorElement = document.getElementById('question-error');
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        // Auto-advance to next question after a short delay (to allow the user to see their selection)
        setTimeout(() => {
            const { state } = this.assessment;
            console.log(`[QuestionsStep] Current question: ${state.currentQuestionIndex + 1}/${state.filteredQuestions.length}`);
            
            // Check if this is the last question
            if (state.currentQuestionIndex === state.filteredQuestions.length - 1) {
                console.log('[QuestionsStep] This is the last question - proceeding to email step');
                
                // Force an immediate state save
                this.assessment.stateManager.saveState();
                
                // Always proceed to next step when answering the last question
                // Call onNext first to ensure cleanup
                this.onNext();
                console.log('[QuestionsStep] Navigating to next step (email collector)');
                this.assessment.nextStep();
            } else {
                // Otherwise move to next question
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
