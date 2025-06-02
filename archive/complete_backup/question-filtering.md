# Question Filtering Mechanism

## Overview

The assessment framework includes a sophisticated question filtering system that ensures users only see questions relevant to their selected services. This section explains the detailed mechanism behind this functionality.

## Implementation Details

### 1. Question Metadata Structure

Each question in the configuration includes metadata about which services it applies to:

```javascript
// Example question configuration
const questions = [
    {
        id: 'q1',
        text: 'How mature is your AI strategy?',
        type: 'scale',
        dimension: 'ai_readiness',
        // This question applies to all assessments (no service requirement)
        requiredServices: []
    },
    {
        id: 'q2',
        text: 'How do you currently use AI in your creative processes?',
        type: 'multiple-choice',
        dimension: 'operational',
        options: ['Not at all', 'Basic tools only', 'Integrated workflow', 'Advanced implementation'],
        // This question only appears for users who selected the creative service
        requiredServices: ['creative']
    },
    {
        id: 'q3',
        text: 'How do you measure ROI on content production?',
        type: 'text',
        dimension: 'financial',
        // This question appears for users who selected either content or social services
        requiredServices: ['content', 'social']
    }
];
```

### 2. Filtering Process

The filtering process occurs in the `QuestionsStep.onEnter()` method when the user navigates to the questions step:

```javascript
// QuestionsStep.onEnter() - Called when the step is entered
onEnter() {
    // Reset the current question index
    this.assessment.state.currentQuestionIndex = 0;
    
    // Get all questions from the configuration
    const allQuestions = this.assessment.config.questions || [];
    
    // Get selected services from state
    const selectedServices = this.assessment.state.selectedServices || [];
    
    // Filter questions based on selected services
    const filteredQuestions = allQuestions.filter(question => {
        // If question has no services requirement, always include it
        if (!question.requiredServices || question.requiredServices.length === 0) {
            return true;
        }
        
        // Include questions where at least one required service is selected
        return question.requiredServices.some(service => 
            selectedServices.includes(service)
        );
    });
    
    // Store filtered questions in state for later use
    this.assessment.state.filteredQuestions = filteredQuestions.map(q => q.id);
    
    // Log the filtering results for debugging
    console.log(`[QuestionsStep] Filtered ${allQuestions.length} questions to ${filteredQuestions.length} based on selected services:`, selectedServices);
    
    // Render the first question
    this.renderCurrentQuestion();
}
```

### 3. Using Filtered Questions

Once questions are filtered, the filtered list is used throughout the assessment:

```javascript
// When rendering the current question
renderCurrentQuestion() {
    const { currentQuestionIndex, filteredQuestions } = this.assessment.state;
    
    // Get the current question ID from the filtered list
    const currentQuestionId = filteredQuestions[currentQuestionIndex];
    
    // Find the full question object from the configuration
    const currentQuestion = this.assessment.config.questions.find(
        q => q.id === currentQuestionId
    );
    
    // Render the question...
}

// When navigating between questions
nextQuestion() {
    if (this.assessment.state.currentQuestionIndex < this.assessment.state.filteredQuestions.length - 1) {
        this.assessment.state.currentQuestionIndex++;
        this.renderCurrentQuestion();
    } else {
        // Last question reached, proceed to next step
        this.assessment.navigationController.nextStep();
    }
}

// In score calculation
calculateDimensionScores(state, scores) {
    const { answers, filteredQuestions } = state;
    
    // Only process questions that were shown to the user
    filteredQuestions.forEach(questionId => {
        const question = this.getQuestionById(questionId);
        const answer = answers[questionId];
        
        // Score calculation logic...
    });
}
```

## Service-Dependent Question Sets

Different services trigger different question sets:

| Service     | Question Categories                     | Example Questions                                |
|-------------|----------------------------------------|--------------------------------------------------|
| Creative    | AI in design, creative workflows       | How do you use AI in creative production?        |
| Content     | Content strategy, ROI measurement      | How do you measure content performance?          |
| Social      | Social automation, engagement metrics  | What tools do you use for social scheduling?     |
| Paid Media  | Campaign optimization, budget planning | How do you allocate your paid media budget?      |
| Web/Dev     | Development process, hosting solutions | What cloud services do you currently leverage?   |

## Benefits of Question Filtering

1. **Personalized Experience**: Users only see questions relevant to their business
2. **Reduced Assessment Time**: Fewer questions lead to higher completion rates
3. **More Accurate Results**: Targeted questions produce more meaningful responses
4. **Scalable Assessment**: New services can be added without creating multiple assessments

## Edge Cases and Handling

- **No Services Selected**: If no services are selected, only service-agnostic questions appear
- **Multiple Services**: Questions may apply to multiple services and are shown if any are selected
- **Dynamic Updating**: If services are changed mid-assessment, questions are re-filtered when returning to the questions step
