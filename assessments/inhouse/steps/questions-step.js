/**
 * In-House Marketing Assessment - Questions Step
 * 
 * Consolidated step that handles all question types:
 * - Core questions (people, process, strategy)
 * - Industry-specific questions
 * - Activity-specific questions
 */

// StepBase will be accessed as a browser global

class QuestionsStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        this.cleanupListeners = [];
        this.questionTypes = ['core', 'industry', 'activity'];
        this.currentQuestionType = 'core';
    }
    
    onEnter() {
        console.log('[QuestionsStep] onEnter called for step:', this.assessment.state.currentStep);
        
        // Extract step type from the current step ID if needed
        // This handles 'core-questions', 'industry-questions', etc.
        const currentStepId = this.assessment.state.currentStep;
        if (currentStepId && currentStepId.includes('-questions')) {
            const questionType = currentStepId.split('-')[0];
            if (this.questionTypes.includes(questionType)) {
                console.log(`[QuestionsStep] Setting question type to '${questionType}' based on step ID`);
                this.assessment.state.currentQuestionType = questionType;
                this.currentQuestionType = questionType;
            }
        }
        
        // Always initialize the current question index if it's undefined or zero
        if (!this.assessment.state.currentQuestionIndex) {
            console.log('[QuestionsStep] Initializing currentQuestionIndex to 0');
            this.assessment.state.currentQuestionIndex = 0;
        }
        
        // Make sure we have a question type
        if (!this.assessment.state.currentQuestionType) {
            console.log('[QuestionsStep] Initializing currentQuestionType to "core"');
            this.assessment.state.currentQuestionType = 'core';
            this.currentQuestionType = 'core';
        } else {
            this.currentQuestionType = this.assessment.state.currentQuestionType;
        }
        
        console.log('[QuestionsStep] Current question type:', this.currentQuestionType);
        console.log('[QuestionsStep] Current question index:', this.assessment.state.currentQuestionIndex);
        
        // Filter questions based on selections
        this.filterQuestions();
    }
    
    filterQuestions() {
        console.log('[QuestionsStep] Filtering questions based on selections');
        
        try {
            // Get all available questions
            const allQuestions = {
                core: this.assessment.getQuestionsByType('core') || [],
                industry: this.assessment.getQuestionsByType('industry') || [],
                activity: this.assessment.getQuestionsByType('activity') || []
            };
            
            // Log what we found for debugging
            console.log('[QuestionsStep] Found questions:', {
                'core': allQuestions.core.length,
                'industry': allQuestions.industry.length,
                'activity': allQuestions.activity.length
            });
            
            // If no core questions are found, the config might be missing
            if (allQuestions.core.length === 0) {
                console.warn('[QuestionsStep] No core questions found. Check configuration!');
                
                // Try to add at least one question to avoid getting stuck
                allQuestions.core = [{
                    id: 'fallback_question',
                    question: 'How would you rate your team\'s current AI knowledge?',
                    dimension: 'people_skills',
                    type: 'core',
                    options: [
                        { text: 'Very low - No knowledge', score: 1 },
                        { text: 'Low - Basic awareness', score: 2 },
                        { text: 'Medium - Some understanding', score: 3 },
                        { text: 'High - Good knowledge', score: 4 },
                        { text: 'Very high - Expert knowledge', score: 5 }
                    ]
                }];
            }
            
            // Filter questions based on selected industry and activities
            // Currently we're showing all questions for demo purposes
            this.assessment.state.filteredQuestions = {
                core: allQuestions.core.map(q => q.id),
                industry: allQuestions.industry.map(q => q.id),
                activity: allQuestions.activity.map(q => q.id)
            };
            
            console.log('[QuestionsStep] Filtered question IDs:', this.assessment.state.filteredQuestions);
            
            // Check if we need to fix step ID based on current question type
            if (this.assessment.state.currentQuestionType) {
                const expectedStepId = `${this.assessment.state.currentQuestionType}-questions`;
                if (this.assessment.state.currentStep !== expectedStepId) {
                    console.log(`[QuestionsStep] Correcting step ID from ${this.assessment.state.currentStep} to ${expectedStepId}`);
                    this.assessment.state.currentStep = expectedStepId;
                }
            }
            
            this.assessment.state.questionsById = {};
            
            // Combine all questions into a single map by ID
            ['core', 'industry', 'activity'].forEach(type => {
                (allQuestions[type] || []).forEach(q => {
                    this.assessment.state.questionsById[q.id] = q;
                });
            });
        } catch (error) {
            console.error('[QuestionsStep] Error filtering questions:', error);
        }
    }
    
    countQuestionsByType(type, answers, filteredQuestions) {
        const questionIds = filteredQuestions[type] || [];
        const answeredCount = questionIds.filter(id => answers.includes(id)).length;
        
        return {
            total: questionIds.length,
            answered: answeredCount
        };
    }
    
    updateProgressInfo() {
        // Initialize progress state if needed
        if (!this.assessment.state.questionProgress) {
            this.assessment.state.questionProgress = {
                core: { total: 0, answered: 0 },
                industry: { total: 0, answered: 0 },
                activity: { total: 0, answered: 0 },
                overall: { total: 0, answered: 0, percentage: 0 }
            };
        }
        
        const progress = this.assessment.state.questionProgress;
        const answersObj = this.assessment.state.answers || {};
        const answers = Object.keys(answersObj);
        const filteredQuestions = this.assessment.state.filteredQuestions || {};
        
        // Count questions by type
        const coreCounts = this.countQuestionsByType('core', answers, filteredQuestions);
        const industryCounts = this.countQuestionsByType('industry', answers, filteredQuestions);
        const activityCounts = this.countQuestionsByType('activity', answers, filteredQuestions);
        
        // Update progress
        progress.core = coreCounts;
        progress.industry = industryCounts;
        progress.activity = activityCounts;
        
        // Calculate overall progress
        const totalAnswered = coreCounts.answered + industryCounts.answered + activityCounts.answered;
        const totalQuestions = coreCounts.total + industryCounts.total + activityCounts.total;
        const percentage = totalQuestions > 0 ? Math.round((totalAnswered / totalQuestions) * 100) : 0;
        
        progress.overall = {
            answered: totalAnswered,
            total: totalQuestions,
            percentage: percentage
        };
    }
    
    getTypeProgressInfo(type) {
        if (!this.assessment.state.questionProgress) {
            this.updateProgressInfo();
        }
        
        const progress = this.assessment.state.questionProgress;
        return progress[type] || { total: 0, answered: 0 };
    }
    
    getCurrentQuestion() {
        console.log('[QuestionsStep] Getting current question...');
        
        try {
            const currentType = this.assessment.state.currentQuestionType;
            const currentIndex = this.assessment.state.currentQuestionIndex;
            
            console.log('[QuestionsStep] Current type: ' + currentType + ', Current index: ' + currentIndex);
            
            if (!currentType || currentIndex === undefined) {
                console.warn('[QuestionsStep] Missing currentType or currentIndex');
                return null;
            }
            
            if (!this.assessment.state.filteredQuestions) {
                console.warn('[QuestionsStep] Filtered questions not found, initializing...');
                this.filterQuestions();
            }
            
            // Get the filtered question IDs for the current type
            const filteredIds = this.assessment.state.filteredQuestions[currentType] || [];
            console.log('[QuestionsStep] Found ' + filteredIds.length + ' filtered questions for type: ' + currentType);
            
            if (filteredIds.length === 0 || currentIndex >= filteredIds.length) {
                console.warn('[QuestionsStep] No questions available for type: ' + currentType);
                return null;
            }
            
            const questionId = filteredIds[currentIndex];
            console.log('[QuestionsStep] Getting question with ID: ' + questionId);
            
            // Get the full question object
            const question = this.assessment.state.questionsById[questionId];
            
            if (!question) {
                console.warn('[QuestionsStep] Question not found with ID: ' + questionId);
                return null;
            }
            
            console.log('[QuestionsStep] Successfully found current question:', question.question);
            return question;
        } catch (error) {
            console.error('[QuestionsStep] Error getting current question:', error);
            return null;
        }
    }
    
    getAnsweredCount() {
        return Object.keys(this.assessment.state.answers || {}).length;
    }
    
    getTotalQuestions() {
        if (!this.assessment.state.filteredQuestions) {
            return 0;
        }
        
        const { core = [], industry = [], activity = [] } = this.assessment.state.filteredQuestions;
        return core.length + industry.length + activity.length;
    }
    
    getQuestionTypeName(type, question) {
        if (!question || !question.dimension) {
            return type.charAt(0).toUpperCase() + type.slice(1);
        }
        
        // Format the dimension name nicely
        const dimension = question.dimension.split('_').map(part => 
            part.charAt(0).toUpperCase() + part.slice(1)
        ).join(' ');
        
        return dimension;
    }
    
    render() {
        console.log('[QuestionsStep] Rendering questions step');
        
        try {
            // Make sure filtered questions are populated
            if (!this.assessment.state.filteredQuestions) {
                console.log('[QuestionsStep] Filtered questions not found, initializing...');
                this.filterQuestions();
            }
            
            // Get current question
            const currentQuestion = this.getCurrentQuestion();
            console.log('[QuestionsStep] Current question:', currentQuestion ? 'found' : 'not found');
            
            if (!currentQuestion) {
                console.log('[QuestionsStep] No current question found, trying to advance question type');
                // If no more questions in this type, try to advance to next type
                if (this.advanceToNextQuestionType()) {
                    console.log('[QuestionsStep] Advanced to next question type, re-rendering');
                    return this.render(); // Re-render with new type
                }
                
                console.log('[QuestionsStep] No more questions available, showing completion screen');
                // If no more questions at all, show completion screen
                return this.renderCompletionScreen();
            }
            
            // Update progress info
            this.updateProgressInfo();
            
            // Initialize progress state if it doesn't exist
            if (!this.assessment.state.questionProgress) {
                console.warn('[QuestionsStep] Question progress not initialized, creating default values');
                this.assessment.state.questionProgress = {
                    core: { total: 0, answered: 0 },
                    industry: { total: 0, answered: 0 },
                    activity: { total: 0, answered: 0 },
                    overall: { total: 0, answered: 0, percentage: 0 }
                };
                this.updateProgressInfo();
            }
            
            const progress = this.assessment.state.questionProgress;
            const currentType = this.assessment.state.currentQuestionType;
            const currentTypeProgress = progress[currentType] || { total: 0, answered: 0 };
            const overallProgress = progress.overall || { total: 0, answered: 0, percentage: 0 };
            
            // Get the current answer if any
            const answer = this.assessment.state.answers[currentQuestion.id];
            
            // Calculate dimension color for progress indicator
            let dimensionColor = '#3498db'; // Default blue
            if (currentQuestion.dimension) {
                switch (currentQuestion.dimension.split('_')[0]) {
                    case 'people': dimensionColor = '#e74c3c'; break;  // Red
                    case 'process': dimensionColor = '#2ecc71'; break; // Green
                    case 'strategy': dimensionColor = '#9b59b6'; break; // Purple
                }
            }
            
            let html = `
                <div class="step-container questions-container">
                    <!-- Progress Section -->
                    <div class="questions-progress-container">
                        <div class="questions-progress-header">
                            <div class="questions-dimension" style="background-color: ${dimensionColor}">
                                ${this.getQuestionTypeName(currentType, currentQuestion)}
                            </div>
                            <div class="questions-progress-text">
                                Question ${currentTypeProgress.answered + 1} of ${currentTypeProgress.total}
                            </div>
                        </div>
                        
                        <div class="questions-progress-bar">
                            <div class="questions-progress-bar-outer">
                                <div class="questions-progress-bar-fill" style="width: ${overallProgress.percentage}%; background-color: ${dimensionColor};"></div>
                            </div>
                            <div class="questions-progress-stats">
                                <div class="questions-progress-stat">
                                    <span class="stat-label">Core</span>
                                    <span class="stat-value">${progress.core.answered}/${progress.core.total}</span>
                                </div>
                                <div class="questions-progress-stat">
                                    <span class="stat-label">Industry</span>
                                    <span class="stat-value">${progress.industry.answered}/${progress.industry.total}</span>
                                </div>
                                <div class="questions-progress-stat">
                                    <span class="stat-label">Activities</span>
                                    <span class="stat-value">${progress.activity.answered}/${progress.activity.total}</span>
                                </div>
                                <div class="questions-progress-stat total">
                                    <span class="stat-label">Total</span>
                                    <span class="stat-value">${overallProgress.answered}/${overallProgress.total}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Question Box -->
                    <div class="question-box">
                        <h2 class="question-text">${currentQuestion.question}</h2>
                        
                        <div class="options-container">
            `;
            
            // Render options
            if (currentQuestion.options && Array.isArray(currentQuestion.options)) {
                currentQuestion.options.forEach((option, idx) => {
                    const optionText = typeof option === 'object' ? option.text : option;
                    const optionValue = typeof option === 'object' ? option.score : idx;
                    const isSelected = answer === optionValue;
                    
                    html += `
                        <div class="question-option ${isSelected ? 'selected' : ''}" data-value="${optionValue}">
                            <div class="option-number">${idx + 1}</div>
                            <div class="option-text">${optionText}</div>
                            ${isSelected ? '<div class="option-selected-indicator"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg></div>' : ''}
                        </div>
                    `;
                });
            }
            
            html += `
                        </div>
                    </div>
                    
                    <div class="question-navigation">
                        <div class="navigation-info">
                            <span class="answered-count">${this.getAnsweredCount()}/${this.getTotalQuestions()} questions answered</span>
                        </div>
                        <div class="navigation-buttons">
                            <button id="question-back" class="btn btn-secondary">Back</button>
                            <button id="question-next" class="btn btn-primary" ${answer === undefined ? 'disabled' : ''}>Next</button>
                        </div>
                    </div>
                </div>
            `;
            
            return html;
        } catch (error) {
            console.error('[QuestionsStep] Error rendering question step:', error);
            return `
                <div class="step-container error-container">
                    <h2>An error occurred</h2>
                    <p>There was a problem loading the questions. Please try refreshing the page.</p>
                    <pre>${error.message}</pre>
                </div>
            `;
        }
    }
    
    renderCompletionScreen() {
        const progress = this.assessment.state.questionProgress;
        const overallProgress = progress.overall;
        
        return `
            <div class="step-container completion-container">
                <div class="completion-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                </div>
                
                <h2>Assessment Complete!</h2>
                <p>You've answered ${overallProgress.answered} questions across all categories.</p>
                
                <div class="completion-stats">
                    <div class="stat-item">
                        <span class="stat-label">Core Questions</span>
                        <span class="stat-value">${progress.core.answered}/${progress.core.total}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Industry Questions</span>
                        <span class="stat-value">${progress.industry.answered}/${progress.industry.total}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">Activity Questions</span>
                        <span class="stat-value">${progress.activity.answered}/${progress.activity.total}</span>
                    </div>
                </div>
                
                <div class="completion-actions">
                    <button id="completion-edit" class="btn btn-secondary">Edit Answers</button>
                    <button id="completion-continue" class="btn btn-primary">Continue to Results</button>
                </div>
            </div>
        `;
    }
    
    setupEventListeners(container) {
        // Clean up any previous event listeners
        this.cleanupEventListeners();
        
        // Check if we're showing the completion screen
        if (container.querySelector('.completion-container')) {
            this.setupCompletionListeners(container);
            return;
        }
        
        // Option selection
        const options = container.querySelectorAll('.question-option');
        const nextButton = container.querySelector('#question-next');
        const backButton = container.querySelector('#question-back');
        
        // Add click listeners to options
        options.forEach(option => {
            const listener = this.handleOptionSelection.bind(this);
            option.addEventListener('click', listener);
            this.cleanupListeners.push(() => option.removeEventListener('click', listener));
        });
        
        // Add click listener to next button
        if (nextButton) {
            const nextListener = this.handleNext.bind(this);
            nextButton.addEventListener('click', nextListener);
            this.cleanupListeners.push(() => nextButton.removeEventListener('click', nextListener));
        }
        
        // Add click listener to back button
        if (backButton) {
            const backListener = this.handleBack.bind(this);
            backButton.addEventListener('click', backListener);
            this.cleanupListeners.push(() => backButton.removeEventListener('click', backListener));
        }
    }
    
    setupCompletionListeners(container) {
        const continueButton = container.querySelector('#completion-continue');
        const editButton = container.querySelector('#completion-edit');
        
        if (continueButton) {
            const continueListener = () => {
                this.assessment.navigationController.nextStep();
            };
            continueButton.addEventListener('click', continueListener);
            this.cleanupListeners.push(() => continueButton.removeEventListener('click', continueListener));
        }
        
        if (editButton) {
            const editListener = () => {
                // Reset to the first question of the first type
                this.assessment.state.currentQuestionType = this.questionTypes[0];
                this.assessment.state.currentQuestionIndex = 0;
                this.assessment.renderCurrentStep();
            };
            editButton.addEventListener('click', editListener);
            this.cleanupListeners.push(() => editButton.removeEventListener('click', editListener));
        }
    }
    
    handleOptionSelection(event) {
        const value = parseInt(event.currentTarget.dataset.value);
        const currentQuestion = this.getCurrentQuestion();
        
        if (!currentQuestion) return;
        
        // Update answers in state
        this.assessment.state.answers[currentQuestion.id] = value;
        
        // Update UI
        document.querySelectorAll('.question-option').forEach(el => {
            el.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        
        // Add the checkmark indicator to the selected option
        const existingIndicators = document.querySelectorAll('.option-selected-indicator');
        existingIndicators.forEach(el => el.remove());
        
        const indicator = document.createElement('div');
        indicator.className = 'option-selected-indicator';
        indicator.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16"><path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/></svg>';
        event.currentTarget.appendChild(indicator);
        
        // Enable next button
        const nextButton = document.getElementById('question-next');
        if (nextButton) {
            nextButton.disabled = false;
        }
        
        // Update progress info
        this.updateProgressInfo();
        
        // Save state
        this.assessment.stateManager.saveState();
        
        // Auto-advance to next question after a brief delay
        setTimeout(() => {
            // Count total and answered questions
            const totalAnswered = this.getAnsweredCount();
            const totalQuestions = this.getTotalQuestions();
            
            console.log(`[QuestionsStep] Total answered: ${totalAnswered}, Total questions: ${totalQuestions}`);
            
            // Get current type and question indices
            const currentType = this.assessment.state.currentQuestionType;
            const currentIndex = this.assessment.state.currentQuestionIndex;
            const filteredIds = this.assessment.state.filteredQuestions?.[currentType] || [];
            
            console.log(`[QuestionsStep] Current type: ${currentType}, Current index: ${currentIndex}, Total in type: ${filteredIds.length}`);
            
            // Check if we're at the last question of the current type
            if (currentIndex < filteredIds.length - 1) {
                // Not the last question, go to next question in this type
                console.log('[QuestionsStep] Moving to next question in current type');
                this.handleNext();
            } else {
                // Last question of this type, check if there are more types
                console.log('[QuestionsStep] At last question of current type, checking for more types');
                const currentTypeIndex = this.questionTypes.indexOf(currentType);
                let hasMoreQuestions = false;
                let nextTypeWithQuestions = null;
                
                // Check if there are more types with questions
                for (let i = currentTypeIndex + 1; i < this.questionTypes.length; i++) {
                    const nextType = this.questionTypes[i];
                    if ((this.assessment.state.filteredQuestions[nextType] || []).length > 0) {
                        hasMoreQuestions = true;
                        nextTypeWithQuestions = nextType;
                        break;
                    }
                }
                
                if (hasMoreQuestions) {
                    // Go to next question type
                    console.log(`[QuestionsStep] Moving to next question type: ${nextTypeWithQuestions}`);
                    
                    // Directly set the type and index
                    this.assessment.state.currentQuestionType = nextTypeWithQuestions;
                    this.assessment.state.currentQuestionIndex = 0;
                    this.assessment.state.currentStep = `${nextTypeWithQuestions}-questions`;
                    
                    // Save state with new type info
                    this.assessment.stateManager.saveState();
                    
                    // Re-render with the new question type
                    setTimeout(() => {
                        this.assessment.renderCurrentStep();
                    }, 100);
                } else {
                    // No more questions in any type, proceed to next step
                    console.log('[QuestionsStep] All questions completed, moving to next step');
                    
                    // Save final answers state
                    this.assessment.stateManager.saveState();
                    
                    setTimeout(() => {
                        // Use direct step transition to avoid any issues
                        try {
                            // Try to determine the next step - either 'contact' or 'results'
                            let nextStep = 'contact';
                            
                            // Check if navigationController has steps defined
                            if (this.assessment.navigationController && 
                                this.assessment.navigationController.steps && 
                                Array.isArray(this.assessment.navigationController.steps)) {
                                
                                // Try to find contact or results in the steps array
                                if (this.assessment.navigationController.steps.includes('contact')) {
                                    nextStep = 'contact';
                                } else if (this.assessment.navigationController.steps.includes('results')) {
                                    nextStep = 'results';
                                }
                                
                                console.log(`[QuestionsStep] Found next step from steps array: ${nextStep}`);
                            } else {
                                console.log(`[QuestionsStep] Using default next step: ${nextStep}`);
                            }
                            
                            console.log(`[QuestionsStep] Moving directly to step: ${nextStep}`);
                            this.assessment.state.currentStep = nextStep;
                            
                            // Determine how to render the next step
                            if (this.assessment.navigationController.renderStep && 
                                typeof this.assessment.navigationController.renderStep === 'function') {
                                this.assessment.navigationController.renderStep(nextStep);
                            } else {
                                console.log('[QuestionsStep] Falling back to renderCurrentStep');
                                this.assessment.renderCurrentStep();
                            }
                        } catch (error) {
                            console.error('[QuestionsStep] Error during navigation:', error);
                            console.log('[QuestionsStep] Falling back to nextStep() method');
                            this.assessment.navigationController.nextStep();
                        }
                    }, 250);
                }
            }
        }, 750); // Slightly longer delay to allow user to see their selection
    }
    
    handleNext() {
        const currentQuestion = this.getCurrentQuestion();
        
        if (!currentQuestion) {
            console.log('[QuestionsStep] No current question found, proceeding to next step');
            this.assessment.navigationController.nextStep();
            return;
        }
        
        // Save state after each answer
        this.assessment.stateManager.saveState();
        
        // Get the current filtered questions for this type
        const currentFilteredQuestions = this.assessment.state.filteredQuestions[this.assessment.state.currentQuestionType] || [];
        
        // Increment question index
        this.assessment.state.currentQuestionIndex++;
        
        console.log(`[QuestionsStep] Moving to next question. New index: ${this.assessment.state.currentQuestionIndex}, total questions for this type: ${currentFilteredQuestions.length}`);
        
        // If we've reached the end of questions for this type,
        // try to advance to the next type
        if (this.assessment.state.currentQuestionIndex >= currentFilteredQuestions.length) {
            
            console.log('[QuestionsStep] Reached end of questions for type: ' + this.assessment.state.currentQuestionType);
            
            if (!this.advanceToNextQuestionType()) {
                // No more questions in any type, proceed to next step
                console.log('[QuestionsStep] No more question types, proceeding to next step');
                
                // Get the next step after questions - using try/catch for safety
                try {
                    // Try to determine the next step - either 'contact' or 'results'
                    let nextStep = 'contact';
                    
                    // Check if navigationController has steps defined
                    if (this.assessment.navigationController && 
                        this.assessment.navigationController.steps && 
                        Array.isArray(this.assessment.navigationController.steps)) {
                        
                        // Try to find contact or results in the steps array
                        if (this.assessment.navigationController.steps.includes('contact')) {
                            nextStep = 'contact';
                        } else if (this.assessment.navigationController.steps.includes('results')) {
                            nextStep = 'results';
                        }
                        
                        console.log(`[QuestionsStep] Found next step from steps array: ${nextStep}`);
                    } else {
                        console.log(`[QuestionsStep] Using default next step: ${nextStep}`);
                    }
                    
                    // Make sure we're saving state before proceeding
                    this.assessment.stateManager.saveState();
                    
                    // Use a longer delay to ensure state is saved
                    setTimeout(() => {
                        console.log(`[QuestionsStep] Navigating to step: ${nextStep}`);
                        this.assessment.state.currentStep = nextStep;
                        
                        // Determine how to render the next step
                        if (this.assessment.navigationController.renderStep && 
                            typeof this.assessment.navigationController.renderStep === 'function') {
                            this.assessment.navigationController.renderStep(nextStep);
                        } else {
                            console.log('[QuestionsStep] Falling back to renderCurrentStep');
                            this.assessment.renderCurrentStep();
                        }
                    }, 250);
                    return;
                } catch (error) {
                    console.error('[QuestionsStep] Error determining next step:', error);
                    console.log('[QuestionsStep] Falling back to nextStep() method');
                    this.assessment.navigationController.nextStep();
                    return;
                }
            } else {
                console.log('[QuestionsStep] Advanced to next question type: ' + this.assessment.state.currentQuestionType);
            }
        }
        
        // Re-render to show next question
        this.assessment.renderCurrentStep();
    }
    
    handleBack() {
        // Decrement question index
        if (this.assessment.state.currentQuestionIndex > 0) {
            this.assessment.state.currentQuestionIndex--;
            this.assessment.renderCurrentStep();
        } else {
            // If at the first question of a type, try to go back to previous type
            if (this.goBackToPreviousQuestionType()) {
                this.assessment.renderCurrentStep();
            } else {
                // If at the very first question, go back to previous step
                this.assessment.navigationController.previousStep();
            }
        }
    }
    
    handleTypeSelection(event) {
        const typeSelector = event.currentTarget;
        const newType = typeSelector.dataset.type;
        
        if (!newType || newType === this.assessment.state.currentQuestionType) return;
        
        // Switch to the selected question type
        this.assessment.state.currentQuestionType = newType;
        this.assessment.state.currentQuestionIndex = 0; // Start at the beginning of this type
        
        // Re-render
        this.assessment.renderCurrentStep();
    }
    
    advanceToNextQuestionType() {
        const currentTypeIndex = this.questionTypes.indexOf(this.assessment.state.currentQuestionType);
        console.log(`[QuestionsStep] Looking for next question type after ${this.assessment.state.currentQuestionType} (index ${currentTypeIndex})`);
        
        // Try each subsequent type
        for (let i = currentTypeIndex + 1; i < this.questionTypes.length; i++) {
            const nextType = this.questionTypes[i];
            console.log(`[QuestionsStep] Checking question type: ${nextType}`);
            if ((this.assessment.state.filteredQuestions[nextType] || []).length > 0) {
                // Found a type with questions, switch to it
                console.log(`[QuestionsStep] Found next type with questions: ${nextType}`);
                this.assessment.state.currentQuestionType = nextType;
                this.assessment.state.currentQuestionIndex = 0;
                
                // Update the step ID to match the question type
                const newStepId = `${nextType}-questions`;
                console.log(`[QuestionsStep] Updating step ID to: ${newStepId}`);
                this.assessment.state.currentStep = newStepId;
                
                return true;
            }
        }
        
        // No more question types with questions
        console.log('[QuestionsStep] No more question types with questions found');
        return false;
    }
    
    goBackToPreviousQuestionType() {
        const currentTypeIndex = this.questionTypes.indexOf(this.assessment.state.currentQuestionType);
        
        // Try each previous type
        for (let i = currentTypeIndex - 1; i >= 0; i--) {
            const prevType = this.questionTypes[i];
            const prevTypeQuestions = this.assessment.state.filteredQuestions[prevType] || [];
            
            if (prevTypeQuestions.length > 0) {
                // Found a previous type with questions, switch to it
                this.assessment.state.currentQuestionType = prevType;
                this.assessment.state.currentQuestionIndex = prevTypeQuestions.length - 1; // Go to last question
                return true;
            }
        }
        
        // No previous question types with questions
        return false;
    }
    
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
    
    validate() {
        const currentQuestion = this.getCurrentQuestion();
        if (!currentQuestion) return true; // No question to validate
        
        return this.assessment.state.answers[currentQuestion.id] !== undefined;
    }
}

// Make the class available as a browser global
window.QuestionsStep = QuestionsStep;
