/**
 * Questions Renderer Component for Agency Assessment
 * 
 * Renders assessment questions and captures user answers.
 * Supports different question types and dimensions.
 */

class QuestionsRenderer {
  /**
   * Create a questions renderer component
   * @param {Object} options - Component options
   * @param {HTMLElement} options.container - Container element
   * @param {Object} options.eventBus - Event bus for communication
   * @param {Object} options.engine - Assessment engine
   * @param {Object} options.state - Current assessment state
   * @param {Object} options.config - Assessment configuration
   */
  constructor(options) {
    this.container = options.container;
    this.eventBus = options.eventBus;
    this.engine = options.engine;
    this.state = options.state || {};
    this.config = options.config || {};
    
    // Ensure we have answers and question index
    this.state.answers = this.state.answers || {};
    this.state.currentQuestionIndex = this.state.currentQuestionIndex || 0;
    
    // Bind methods
    this.handleOptionSelection = this.handleOptionSelection.bind(this);
    this.nextQuestion = this.nextQuestion.bind(this);
    this.previousQuestion = this.previousQuestion.bind(this);
  }
  
  /**
   * Handle option selection
   * @param {Event} event - Click event
   */
  handleOptionSelection(event) {
    const questionId = parseInt(event.currentTarget.getAttribute('data-question-id'));
    const optionIndex = parseInt(event.currentTarget.getAttribute('data-option-index'));
    const optionScore = parseInt(event.currentTarget.getAttribute('data-score'));
    
    if (isNaN(questionId) || isNaN(optionIndex) || isNaN(optionScore)) {
      console.error('[QuestionsRenderer] Invalid question or option data');
      return;
    }
    
    // Get current question
    const question = this.state.filteredQuestions[this.state.currentQuestionIndex];
    
    if (!question || question.id !== questionId) {
      console.error('[QuestionsRenderer] Question ID mismatch');
      return;
    }
    
    // Update answers in state
    const answers = { ...this.state.answers };
    answers[questionId] = {
      questionId,
      optionIndex,
      score: optionScore,
      dimension: question.dimension
    };
    
    // Update UI to show selected option
    this.container.querySelectorAll('.question-option').forEach(option => {
      option.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');
    
    // Update state
    this.eventBus.emit('data:update', { answers });
    
    console.log(`[QuestionsRenderer] Selected option ${optionIndex} (score: ${optionScore}) for question ${questionId}`);
    
    // Auto-advance to next question after a brief delay
    setTimeout(() => {
      if (this.state.currentQuestionIndex < this.state.filteredQuestions.length - 1) {
        this.nextQuestion();
      }
    }, 500);
  }
  
  /**
   * Move to the next question
   */
  nextQuestion() {
    if (this.state.currentQuestionIndex < this.state.filteredQuestions.length - 1) {
      const newIndex = this.state.currentQuestionIndex + 1;
      
      // Update state
      this.eventBus.emit('data:update', {
        currentQuestionIndex: newIndex
      });
      
      // Update UI
      this.renderCurrentQuestion();
      
      // Update progress bar
      this.updateProgressBar();
    }
  }
  
  /**
   * Move to the previous question
   */
  previousQuestion() {
    if (this.state.currentQuestionIndex > 0) {
      const newIndex = this.state.currentQuestionIndex - 1;
      
      // Update state
      this.eventBus.emit('data:update', {
        currentQuestionIndex: newIndex
      });
      
      // Update UI
      this.renderCurrentQuestion();
      
      // Update progress bar
      this.updateProgressBar();
    }
  }
  
  /**
   * Update the progress bar
   */
  updateProgressBar() {
    const progressBar = this.container.querySelector('.questions-progress-bar-fill');
    const progressText = this.container.querySelector('.questions-progress-text');
    
    if (progressBar && progressText) {
      const totalQuestions = this.state.filteredQuestions.length;
      const currentQuestion = this.state.currentQuestionIndex + 1;
      const progressPercent = Math.round((currentQuestion / totalQuestions) * 100);
      
      progressBar.style.width = `${progressPercent}%`;
      progressText.textContent = `Question ${currentQuestion} of ${totalQuestions}`;
    }
  }
  
  /**
   * Render the current question
   */
  renderCurrentQuestion() {
    // Get current question
    const question = this.state.filteredQuestions[this.state.currentQuestionIndex];
    
    if (!question) {
      console.error('[QuestionsRenderer] No question found at index', this.state.currentQuestionIndex);
      return;
    }
    
    // Get question container
    const questionContainer = this.container.querySelector('.question-container');
    
    if (!questionContainer) {
      console.error('[QuestionsRenderer] Question container not found');
      return;
    }
    
    // Clear question container
    questionContainer.innerHTML = '';
    
    // Create question title if exists
    if (question.title) {
      const sectionTitle = document.createElement('h3');
      sectionTitle.className = 'question-section-title';
      sectionTitle.textContent = question.title;
      sectionTitle.style.marginBottom = '15px';
      sectionTitle.style.fontSize = '20px';
      sectionTitle.style.color = '#333';
      questionContainer.appendChild(sectionTitle);
    }
    
    // Create question text
    const questionText = document.createElement('div');
    questionText.className = 'question-text';
    questionText.textContent = question.question;
    questionText.style.fontSize = '18px';
    questionText.style.marginBottom = '20px';
    questionText.style.fontWeight = 'bold';
    questionContainer.appendChild(questionText);
    
    // Create options container
    const optionsContainer = document.createElement('div');
    optionsContainer.className = 'options-container';
    optionsContainer.style.display = 'flex';
    optionsContainer.style.flexDirection = 'column';
    optionsContainer.style.gap = '10px';
    
    // Create options
    question.options.forEach((option, index) => {
      const optionElement = document.createElement('div');
      optionElement.className = 'question-option';
      optionElement.setAttribute('data-question-id', question.id);
      optionElement.setAttribute('data-option-index', index);
      optionElement.setAttribute('data-score', option.score);
      
      // Check if this option is already selected
      if (this.state.answers[question.id] && this.state.answers[question.id].optionIndex === index) {
        optionElement.classList.add('selected');
      }
      
      // Style the option
      optionElement.style.padding = '15px';
      optionElement.style.border = '1px solid #ddd';
      optionElement.style.borderRadius = '8px';
      optionElement.style.cursor = 'pointer';
      optionElement.style.transition = 'all 0.2s ease';
      optionElement.style.backgroundColor = optionElement.classList.contains('selected') ? '#e7f3ff' : '#f9f9f9';
      optionElement.style.borderColor = optionElement.classList.contains('selected') ? '#007bff' : '#ddd';
      
      // Hover effect
      optionElement.addEventListener('mouseover', () => {
        if (!optionElement.classList.contains('selected')) {
          optionElement.style.backgroundColor = '#f0f0f0';
          optionElement.style.borderColor = '#ccc';
        }
      });
      
      optionElement.addEventListener('mouseout', () => {
        if (!optionElement.classList.contains('selected')) {
          optionElement.style.backgroundColor = '#f9f9f9';
          optionElement.style.borderColor = '#ddd';
        }
      });
      
      // Add option text
      const optionText = document.createElement('div');
      optionText.className = 'option-text';
      optionText.textContent = option.text;
      optionElement.appendChild(optionText);
      
      // Add event listener
      optionElement.addEventListener('click', this.handleOptionSelection);
      
      // Add to container
      optionsContainer.appendChild(optionElement);
    });
    
    questionContainer.appendChild(optionsContainer);
    
    // Update dimension indicator if available
    const dimensionIndicator = this.container.querySelector('.question-dimension');
    if (dimensionIndicator && question.dimension) {
      let dimensionName = question.dimension;
      
      // Format dimension name
      if (dimensionName === 'operational') {
        dimensionName = 'Operational Maturity';
      } else if (dimensionName === 'financial') {
        dimensionName = 'Financial Resilience';
      } else if (dimensionName === 'ai') {
        dimensionName = 'AI Readiness';
      } else if (dimensionName === 'strategic') {
        dimensionName = 'Strategic Positioning';
      } else {
        dimensionName = dimensionName.charAt(0).toUpperCase() + dimensionName.slice(1).replace(/_/g, ' ');
      }
      
      dimensionIndicator.textContent = `Dimension: ${dimensionName}`;
    }
  }
  
  /**
   * Calculate the total number of answered questions
   * @returns {number} - Number of answered questions
   */
  getAnsweredCount() {
    return Object.keys(this.state.answers).length;
  }
  
  /**
   * Validate the component
   * @returns {boolean} - Whether the component is valid
   */
  validate() {
    // Check if all questions have been answered
    return this.getAnsweredCount() === this.state.filteredQuestions.length;
  }
  
  /**
   * Render the component
   */
  render() {
    // Clear container
    this.container.innerHTML = '';
    
    // Create title
    const title = document.createElement('h2');
    title.className = 'assessment-step-title';
    title.textContent = 'Assessment Questions';
    this.container.appendChild(title);
    
    // Create description
    const description = document.createElement('p');
    description.className = 'assessment-step-description';
    description.textContent = 'Answer these questions about your agency to receive a personalized assessment:';
    this.container.appendChild(description);
    
    // Create progress bar container
    const progressContainer = document.createElement('div');
    progressContainer.className = 'questions-progress-container';
    progressContainer.style.marginBottom = '30px';
    progressContainer.style.marginTop = '20px';
    
    // Create progress text
    const progressText = document.createElement('div');
    progressText.className = 'questions-progress-text';
    progressText.textContent = `Question ${this.state.currentQuestionIndex + 1} of ${this.state.filteredQuestions.length}`;
    progressText.style.marginBottom = '10px';
    progressText.style.fontWeight = 'bold';
    progressContainer.appendChild(progressText);
    
    // Create progress bar
    const progressBarOuter = document.createElement('div');
    progressBarOuter.className = 'questions-progress-bar-outer';
    progressBarOuter.style.height = '8px';
    progressBarOuter.style.backgroundColor = '#eee';
    progressBarOuter.style.borderRadius = '4px';
    progressBarOuter.style.overflow = 'hidden';
    
    const progressBarFill = document.createElement('div');
    progressBarFill.className = 'questions-progress-bar-fill';
    progressBarFill.style.height = '100%';
    progressBarFill.style.backgroundColor = '#007bff';
    progressBarFill.style.width = `${Math.round(((this.state.currentQuestionIndex + 1) / this.state.filteredQuestions.length) * 100)}%`;
    progressBarFill.style.transition = 'width 0.3s ease';
    
    progressBarOuter.appendChild(progressBarFill);
    progressContainer.appendChild(progressBarOuter);
    
    this.container.appendChild(progressContainer);
    
    // Create question container
    const questionContainer = document.createElement('div');
    questionContainer.className = 'question-container';
    questionContainer.style.backgroundColor = '#fff';
    questionContainer.style.borderRadius = '8px';
    questionContainer.style.padding = '20px';
    questionContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    this.container.appendChild(questionContainer);
    
    // Create dimension indicator
    const dimensionIndicator = document.createElement('div');
    dimensionIndicator.className = 'question-dimension';
    dimensionIndicator.style.marginTop = '15px';
    dimensionIndicator.style.fontSize = '14px';
    dimensionIndicator.style.color = '#666';
    dimensionIndicator.style.fontStyle = 'italic';
    this.container.appendChild(dimensionIndicator);
    
    // Create navigation container
    const navContainer = document.createElement('div');
    navContainer.className = 'questions-navigation';
    navContainer.style.display = 'flex';
    navContainer.style.justifyContent = 'space-between';
    navContainer.style.marginTop = '20px';
    
    // Create previous button
    const prevButton = document.createElement('button');
    prevButton.className = 'prev-question-button';
    prevButton.textContent = 'Previous';
    prevButton.style.padding = '10px 20px';
    prevButton.style.backgroundColor = '#f0f0f0';
    prevButton.style.border = '1px solid #ddd';
    prevButton.style.borderRadius = '4px';
    prevButton.style.cursor = 'pointer';
    
    // Disable previous button if on first question
    if (this.state.currentQuestionIndex === 0) {
      prevButton.disabled = true;
      prevButton.style.opacity = '0.5';
      prevButton.style.cursor = 'not-allowed';
    }
    
    prevButton.addEventListener('click', this.previousQuestion);
    navContainer.appendChild(prevButton);
    
    // Create answered count
    const answeredCount = document.createElement('div');
    answeredCount.className = 'answered-count';
    answeredCount.textContent = `${this.getAnsweredCount()} of ${this.state.filteredQuestions.length} questions answered`;
    answeredCount.style.alignSelf = 'center';
    answeredCount.style.fontSize = '14px';
    answeredCount.style.color = '#666';
    navContainer.appendChild(answeredCount);
    
    // Create next button
    const nextButton = document.createElement('button');
    nextButton.className = 'next-question-button';
    nextButton.textContent = 'Next';
    nextButton.style.padding = '10px 20px';
    nextButton.style.backgroundColor = '#007bff';
    nextButton.style.color = '#fff';
    nextButton.style.border = 'none';
    nextButton.style.borderRadius = '4px';
    nextButton.style.cursor = 'pointer';
    
    // Disable next button if on last question
    if (this.state.currentQuestionIndex === this.state.filteredQuestions.length - 1) {
      nextButton.disabled = true;
      nextButton.style.opacity = '0.5';
      nextButton.style.cursor = 'not-allowed';
    }
    
    nextButton.addEventListener('click', this.nextQuestion);
    navContainer.appendChild(nextButton);
    
    this.container.appendChild(navContainer);
    
    // Render current question
    this.renderCurrentQuestion();
  }
}

// Register component in the global namespace
(function() {
  // Initialize namespace
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
  window.AssessmentFramework.Components.agency = window.AssessmentFramework.Components.agency || {};
  
  // Register component
  window.AssessmentFramework.Components.agency.QuestionsRenderer = QuestionsRenderer;
  
  console.log('[QuestionsRenderer] Component registered successfully');
})();
