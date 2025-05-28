# In-House Marketing Assessment Implementation Plan

## Overview

This document outlines the implementation plan for the In-House Marketing Assessment module, leveraging the modular architecture of the assessment framework. The implementation will extend the base framework components to create a specialized assessment for in-house marketing teams.

## Current State Analysis

### What We Have:
1. **Configuration Files**:
   - `inhouse_questions.js`: Comprehensive question configuration with industries, activities, and questions
   - `inhouse_scoring.js`: Scoring system for calculating assessment results
   - `inhouse-marketing-recommendations-config.js`: Recommendation templates for in-house marketing teams

2. **Directory Structure**:
   - Empty directories for: `recommendations/`, `reporting/`, `scoring/`, and `steps/`

## Implementation Requirements

### 1. Core Components

#### Assessment Class (`inhouse-assessment.js`):
- Extend the `AssessmentBase` class
- Register steps specific to in-house assessment
- Initialize state with in-house-specific properties
- Implement result calculation methods

```javascript
// /assessments/inhouse/inhouse-assessment.js
import { AssessmentBase } from '../../core/assessment-base.js';
import { StateManager } from '../../core/state-manager.js';
import { NavigationController } from '../../core/navigation-controller.js';

// Import steps
import { IndustrySelectionStep } from './steps/industry-selection-step.js';
import { ActivitySelectionStep } from './steps/activity-selection-step.js';
import { CoreQuestionsStep } from './steps/core-questions-step.js';
import { IndustryQuestionsStep } from './steps/industry-questions-step.js';
import { ActivityQuestionsStep } from './steps/activity-questions-step.js';
import { ContactStep } from './steps/contact-step.js';
import { ResultsStep } from './steps/results-step.js';

// Import scoring and recommendations
import { InhouseMarketingScoring } from './scoring/inhouse-scoring-engine.js';
import { InhouseRecommendationsEngine } from './recommendations/inhouse-recommendations-engine.js';
import { InhouseMarketingDashboard } from './reporting/inhouse-marketing-dashboard.js';

export class InhouseAssessment extends AssessmentBase {
    constructor(config, container) {
        super(config, container);
        this.type = 'inhouse-marketing';
        
        // Initialize engines
        this.scoringEngine = new InhouseMarketingScoring(config);
        this.recommendationsEngine = new InhouseRecommendationsEngine(config);
        this.dashboard = new InhouseMarketingDashboard(config);
        
        // Register steps
        this.steps = {
            'industry-selection': new IndustrySelectionStep(this),
            'activity-selection': new ActivitySelectionStep(this),
            'core-questions': new CoreQuestionsStep(this),
            'industry-questions': new IndustryQuestionsStep(this),
            'activity-questions': new ActivityQuestionsStep(this),
            'contact': new ContactStep(this),
            'results': new ResultsStep(this)
        };
        
        // Initialize state manager and navigation
        this.stateManager = new StateManager(this);
        this.navigationController = new NavigationController(this);
    }
    
    initializeState() {
        return {
            currentStep: this.config.steps[0],
            answers: {},
            selectedIndustry: null,
            selectedActivities: [],
            companySize: null,
            companyName: '',
            email: '',
            name: '',
            currentQuestionIndex: 0,
            currentDimension: null,
            filteredQuestions: [],
            results: null
        };
    }
    
    calculateResults() {
        if (!this.state.selectedIndustry || !this.state.selectedActivities.length) {
            console.error('[InhouseAssessment] Missing required data for calculation');
            return null;
        }
        
        // Calculate scores using scoring engine
        const results = this.scoringEngine.calculateResults({
            selectedIndustry: this.state.selectedIndustry,
            selectedActivities: this.state.selectedActivities,
            answers: this.state.answers,
            companySize: this.state.companySize
        });
        
        // Generate recommendations
        results.recommendations = this.recommendationsEngine.generateRecommendations(results);
        
        return results;
    }
}
```

### 2. Step Implementation

#### Industry Selection Step

```javascript
// /assessments/inhouse/steps/industry-selection-step.js
import { StepBase } from '../../../core/step-base.js';

export class IndustrySelectionStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        this.cleanupListeners = [];
    }
    
    render() {
        const industries = this.assessment.config.industries || [];
        const selectedIndustry = this.assessment.state.selectedIndustry;
        
        let html = `
            <div class="step-container">
                <h2>Select Your Industry</h2>
                <p>This helps us tailor the assessment to your specific industry context.</p>
                <div class="industry-options">
        `;
        
        industries.forEach(industry => {
            const isSelected = selectedIndustry === industry.id;
            html += `
                <div class="industry-option ${isSelected ? 'selected' : ''}" data-industry-id="${industry.id}">
                    <h3>${industry.name}</h3>
                    <p>${industry.description}</p>
                    <div class="industry-benchmark">
                        <span>Industry Avg: ${industry.avgReadiness}%</span>
                        <span>Top Quartile: ${industry.topQuartile}%</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="step-navigation">
                    <button id="industry-next" class="btn btn-primary" ${!selectedIndustry ? 'disabled' : ''}>Next</button>
                </div>
            </div>
        `;
        
        return html;
    }
    
    setupEventListeners(container) {
        const industryOptions = container.querySelectorAll('.industry-option');
        const nextButton = container.querySelector('#industry-next');
        
        // Add click listeners to industry options
        industryOptions.forEach(option => {
            const listener = this.handleIndustrySelection.bind(this);
            option.addEventListener('click', listener);
            this.cleanupListeners.push(() => option.removeEventListener('click', listener));
        });
        
        // Add click listener to next button
        const nextListener = this.handleNext.bind(this);
        nextButton.addEventListener('click', nextListener);
        this.cleanupListeners.push(() => nextButton.removeEventListener('click', nextListener));
    }
    
    handleIndustrySelection(event) {
        const industryId = event.currentTarget.dataset.industryId;
        
        // Update state
        this.assessment.state.selectedIndustry = industryId;
        
        // Update UI
        document.querySelectorAll('.industry-option').forEach(el => {
            el.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        
        // Enable next button
        document.getElementById('industry-next').disabled = false;
    }
    
    handleNext() {
        if (this.validate()) {
            this.assessment.stateManager.saveState();
            this.assessment.navigationController.nextStep();
        }
    }
    
    validate() {
        return !!this.assessment.state.selectedIndustry;
    }
    
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
}
```

#### Activity Selection Step

```javascript
// /assessments/inhouse/steps/activity-selection-step.js
import { StepBase } from '../../../core/step-base.js';

export class ActivitySelectionStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        this.cleanupListeners = [];
        this.minimumActivities = 1;
        this.maximumActivities = 5;
    }
    
    render() {
        const activities = this.assessment.config.activities || [];
        const selectedActivities = this.assessment.state.selectedActivities || [];
        
        let html = `
            <div class="step-container">
                <h2>Select Your Marketing Activities</h2>
                <p>Select the ${this.minimumActivities}-${this.maximumActivities} primary marketing activities your team focuses on.</p>
                <div class="activities-container">
        `;
        
        activities.forEach(activity => {
            const isSelected = selectedActivities.includes(activity.id);
            html += `
                <div class="activity-option ${isSelected ? 'selected' : ''}" data-activity-id="${activity.id}">
                    <h3>${activity.name}</h3>
                    <p>${activity.description}</p>
                    <div class="activity-impact">
                        <span>AI Impact: ${activity.aiImpact}</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="selection-counter">
                    <span id="selection-count">${selectedActivities.length}</span>/${this.maximumActivities} activities selected
                </div>
                <div class="step-navigation">
                    <button id="activity-back" class="btn btn-secondary">Back</button>
                    <button id="activity-next" class="btn btn-primary" ${selectedActivities.length < this.minimumActivities ? 'disabled' : ''}>Next</button>
                </div>
            </div>
        `;
        
        return html;
    }
    
    setupEventListeners(container) {
        const activityOptions = container.querySelectorAll('.activity-option');
        const nextButton = container.querySelector('#activity-next');
        const backButton = container.querySelector('#activity-back');
        
        // Add click listeners to activity options
        activityOptions.forEach(option => {
            const listener = this.handleActivitySelection.bind(this);
            option.addEventListener('click', listener);
            this.cleanupListeners.push(() => option.removeEventListener('click', listener));
        });
        
        // Add click listener to next button
        const nextListener = this.handleNext.bind(this);
        nextButton.addEventListener('click', nextListener);
        this.cleanupListeners.push(() => nextButton.removeEventListener('click', nextListener));
        
        // Add click listener to back button
        const backListener = this.handleBack.bind(this);
        backButton.addEventListener('click', backListener);
        this.cleanupListeners.push(() => backButton.removeEventListener('click', backListener));
    }
    
    handleActivitySelection(event) {
        const activityId = event.currentTarget.dataset.activityId;
        let selectedActivities = [...this.assessment.state.selectedActivities] || [];
        
        // Toggle selection
        if (selectedActivities.includes(activityId)) {
            // Remove activity
            selectedActivities = selectedActivities.filter(id => id !== activityId);
            event.currentTarget.classList.remove('selected');
        } else {
            // Check if max selections reached
            if (selectedActivities.length >= this.maximumActivities) {
                alert(`You can only select up to ${this.maximumActivities} activities.`);
                return;
            }
            
            // Add activity
            selectedActivities.push(activityId);
            event.currentTarget.classList.add('selected');
        }
        
        // Update state
        this.assessment.state.selectedActivities = selectedActivities;
        
        // Update counter
        const countElement = document.getElementById('selection-count');
        if (countElement) {
            countElement.textContent = selectedActivities.length;
        }
        
        // Update next button state
        const nextButton = document.getElementById('activity-next');
        if (nextButton) {
            nextButton.disabled = selectedActivities.length < this.minimumActivities;
        }
    }
    
    handleNext() {
        if (this.validate()) {
            this.assessment.stateManager.saveState();
            this.assessment.navigationController.nextStep();
        }
    }
    
    handleBack() {
        this.assessment.navigationController.previousStep();
    }
    
    validate() {
        const selectedActivities = this.assessment.state.selectedActivities || [];
        return selectedActivities.length >= this.minimumActivities;
    }
    
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
}
```

#### Generic Questions Step (Base for Core, Industry, and Activity Questions)

```javascript
// /assessments/inhouse/steps/generic-questions-step.js
import { StepBase } from '../../../core/step-base.js';

export class GenericQuestionsStep extends StepBase {
    constructor(assessment, questionType = 'core') {
        super(assessment);
        this.questionType = questionType; // 'core', 'industry', or 'activity'
        this.cleanupListeners = [];
    }
    
    // Override in subclasses to get the appropriate questions
    getQuestions() {
        return [];
    }
    
    filterQuestions() {
        const questions = this.getQuestions();
        // Store filtered questions in state
        this.assessment.state.filteredQuestions = questions.map(q => q.id);
        return questions;
    }
    
    render() {
        // Reset question index when entering this step
        if (this.assessment.state.currentQuestionIndex === undefined) {
            this.assessment.state.currentQuestionIndex = 0;
        }
        
        // Filter questions based on selections
        const filteredQuestions = this.filterQuestions();
        const currentIndex = this.assessment.state.currentQuestionIndex || 0;
        const currentQuestion = filteredQuestions[currentIndex];
        
        if (!currentQuestion) {
            return `<div class="error-message">No questions available.</div>`;
        }
        
        const progress = Math.round(((currentIndex + 1) / filteredQuestions.length) * 100);
        const answer = this.assessment.state.answers[currentQuestion.id];
        
        let html = `
            <div class="step-container">
                <div class="question-progress">
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: ${progress}%"></div>
                    </div>
                    <div class="progress-text">Question ${currentIndex + 1} of ${filteredQuestions.length}</div>
                </div>
                
                <div class="question-container">
                    <h2>${currentQuestion.question}</h2>
                    
                    <div class="options-container">
        `;
        
        // Render options based on question type
        if (currentQuestion.options && Array.isArray(currentQuestion.options)) {
            currentQuestion.options.forEach((option, optionIndex) => {
                const optionText = typeof option === 'object' ? option.text : option;
                const optionValue = typeof option === 'object' ? option.score : optionIndex;
                const isSelected = answer === optionValue;
                
                html += `
                    <div class="option ${isSelected ? 'selected' : ''}" data-value="${optionValue}">
                        <div class="option-text">${optionText}</div>
                    </div>
                `;
            });
        }
        
        html += `
                    </div>
                </div>
                
                <div class="step-navigation">
                    <button id="question-back" class="btn btn-secondary">${currentIndex > 0 ? 'Previous Question' : 'Back'}</button>
                    <button id="question-next" class="btn btn-primary" ${answer === undefined ? 'disabled' : ''}>${currentIndex < filteredQuestions.length - 1 ? 'Next Question' : 'Next'}</button>
                </div>
            </div>
        `;
        
        return html;
    }
    
    setupEventListeners(container) {
        const options = container.querySelectorAll('.option');
        const nextButton = container.querySelector('#question-next');
        const backButton = container.querySelector('#question-back');
        
        // Add click listeners to options
        options.forEach(option => {
            const listener = this.handleOptionSelection.bind(this);
            option.addEventListener('click', listener);
            this.cleanupListeners.push(() => option.removeEventListener('click', listener));
        });
        
        // Add click listener to next button
        const nextListener = this.handleNext.bind(this);
        nextButton.addEventListener('click', nextListener);
        this.cleanupListeners.push(() => nextButton.removeEventListener('click', nextListener));
        
        // Add click listener to back button
        const backListener = this.handleBack.bind(this);
        backButton.addEventListener('click', backListener);
        this.cleanupListeners.push(() => backButton.removeEventListener('click', backListener));
    }
    
    handleOptionSelection(event) {
        const value = parseInt(event.currentTarget.dataset.value);
        const filteredQuestions = this.filterQuestions();
        const currentIndex = this.assessment.state.currentQuestionIndex || 0;
        const currentQuestion = filteredQuestions[currentIndex];
        
        // Update answers in state
        this.assessment.state.answers[currentQuestion.id] = value;
        
        // Update UI
        document.querySelectorAll('.option').forEach(el => {
            el.classList.remove('selected');
        });
        event.currentTarget.classList.add('selected');
        
        // Enable next button
        document.getElementById('question-next').disabled = false;
    }
    
    handleNext() {
        const filteredQuestions = this.filterQuestions();
        const currentIndex = this.assessment.state.currentQuestionIndex || 0;
        
        // Save state after each answer
        this.assessment.stateManager.saveState();
        
        // If this is the last question, go to next step
        if (currentIndex >= filteredQuestions.length - 1) {
            this.assessment.navigationController.nextStep();
            return;
        }
        
        // Otherwise, go to next question
        this.assessment.state.currentQuestionIndex = currentIndex + 1;
        this.assessment.renderCurrentStep();
    }
    
    handleBack() {
        const currentIndex = this.assessment.state.currentQuestionIndex || 0;
        
        // If this is the first question, go to previous step
        if (currentIndex === 0) {
            this.assessment.navigationController.previousStep();
            return;
        }
        
        // Otherwise, go to previous question
        this.assessment.state.currentQuestionIndex = currentIndex - 1;
        this.assessment.renderCurrentStep();
    }
    
    validate() {
        const filteredQuestions = this.filterQuestions();
        const currentIndex = this.assessment.state.currentQuestionIndex || 0;
        const currentQuestion = filteredQuestions[currentIndex];
        
        return this.assessment.state.answers[currentQuestion.id] !== undefined;
    }
    
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
}
```

#### Concrete Question Step Implementations

```javascript
// /assessments/inhouse/steps/core-questions-step.js
import { GenericQuestionsStep } from './generic-questions-step.js';

export class CoreQuestionsStep extends GenericQuestionsStep {
    constructor(assessment) {
        super(assessment, 'core');
    }
    
    getQuestions() {
        const config = this.assessment.config;
        const coreQuestions = [];
        
        // Get all core dimension questions
        for (const dimension in config.coreQuestions) {
            if (config.coreQuestions[dimension] && Array.isArray(config.coreQuestions[dimension])) {
                coreQuestions.push(...config.coreQuestions[dimension]);
            }
        }
        
        return coreQuestions;
    }
}

// /assessments/inhouse/steps/industry-questions-step.js
import { GenericQuestionsStep } from './generic-questions-step.js';

export class IndustryQuestionsStep extends GenericQuestionsStep {
    constructor(assessment) {
        super(assessment, 'industry');
    }
    
    getQuestions() {
        const config = this.assessment.config;
        const selectedIndustry = this.assessment.state.selectedIndustry;
        
        if (!selectedIndustry || !config.industryQuestions) {
            return [];
        }
        
        return config.industryQuestions[selectedIndustry] || [];
    }
}

// /assessments/inhouse/steps/activity-questions-step.js
import { GenericQuestionsStep } from './generic-questions-step.js';

export class ActivityQuestionsStep extends GenericQuestionsStep {
    constructor(assessment) {
        super(assessment, 'activity');
    }
    
    getQuestions() {
        const config = this.assessment.config;
        const selectedActivities = this.assessment.state.selectedActivities || [];
        
        if (!selectedActivities.length || !config.activityQuestions) {
            return [];
        }
        
        // Get questions for all selected activities
        let activityQuestions = [];
        selectedActivities.forEach(activityId => {
            if (config.activityQuestions[activityId]) {
                activityQuestions.push(...config.activityQuestions[activityId]);
            }
        });
        
        return activityQuestions;
    }
}
```

### 3. Scoring Engine Implementation

Adapt the existing `InHouseMarketingScoring` class to fit the framework's architecture:

```javascript
// /assessments/inhouse/scoring/inhouse-scoring-engine.js
import { ScoringEngineBase } from '../../../core/scoring-base.js';

export class InhouseMarketingScoring extends ScoringEngineBase {
    constructor(config) {
        super(config);
        
        // Initialize from configuration in inhouse_scoring.js
        this.dimensionWeights = {
            people_skills: 0.35,
            process_infrastructure: 0.35, 
            strategy_leadership: 0.30
        };
        
        this.industryWeightAdjustments = config.scoringConfig.weights.industryAdjustments || {};
        this.activityImpactWeights = config.scoringConfig.activityImpactWeights || {};
        this.industryBenchmarks = config.scoringConfig.industryBenchmarks || {};
    }
    
    calculateScores(state) {
        try {
            console.log('[InhouseScoring] Calculating scores');
            
            const { selectedIndustry, selectedActivities, answers, companySize } = state;
            
            // Calculate dimension scores
            const dimensionScores = this.calculateDimensionScores(answers);
            
            // Calculate activity scores
            const activityScores = this.calculateActivityScores(answers, selectedActivities);
            
            // Calculate industry-adjusted overall score
            const overallScore = this.calculateOverallScore(dimensionScores, activityScores, selectedIndustry);
            
            return {
                overall: overallScore,
                dimensions: dimensionScores,
                activities: activityScores,
                industry: {
                    id: selectedIndustry,
                    benchmarks: this.industryBenchmarks[selectedIndustry] || {}
                }
            };
        } catch (error) {
            console.error('[InhouseScoring] Error calculating scores:', error);
            return {
                overall: 0,
                dimensions: {
                    people_skills: 0,
                    process_infrastructure: 0,
                    strategy_leadership: 0
                },
                activities: {}
            };
        }
    }
    
    // Other scoring methods from InHouseMarketingScoring
    // (calculateDimensionScores, calculateActivityScores, calculateOverallScore, etc.)
}
```

### 4. Recommendations Engine Implementation

```javascript
// /assessments/inhouse/recommendations/inhouse-recommendations-engine.js
export class InhouseRecommendationsEngine {
    constructor(config) {
        this.config = config;
        this.recommendationsConfig = config.recommendationsConfig || {};
    }
    
    generateRecommendations(results) {
        try {
            console.log('[InhouseRecommendations] Generating recommendations');
            
            const { scores, industry, activities } = results;
            
            // Generate dimension-specific recommendations
            const dimensionRecommendations = this.generateDimensionRecommendations(scores.dimensions);
            
            // Generate activity-specific recommendations
            const activityRecommendations = this.generateActivityRecommendations(scores.activities);
            
            // Generate industry-specific recommendations
            const industryRecommendations = this.generateIndustryRecommendations(scores, industry.id);
            
            return {
                dimensionRecommendations,
                activityRecommendations,
                industryRecommendations,
                prioritizedRecommendations: this.prioritizeRecommendations([
                    ...dimensionRecommendations,
                    ...activityRecommendations,
                    ...industryRecommendations
                ])
            };
        } catch (error) {
            console.error('[InhouseRecommendations] Error generating recommendations:', error);
            return {
                dimensionRecommendations: [],
                activityRecommendations: [],
                industryRecommendations: [],
                prioritizedRecommendations: []
            };
        }
    }
    
    // Other recommendation generation methods
}
```

### 5. Dashboard Implementation

```javascript
// /assessments/inhouse/reporting/inhouse-marketing-dashboard.js
export class InhouseMarketingDashboard {
    constructor(config) {
        this.config = config;
    }
    
    render(results) {
        try {
            console.log('[InhouseDashboard] Rendering dashboard');
            
            if (!results) {
                return '<div class="dashboard-error">No results available</div>';
            }
            
            return `
                <div class="inhouse-dashboard">
                    <div class="dashboard-header">
                        <h2>In-House Marketing AI Readiness Dashboard</h2>
                    </div>
                    
                    ${this.renderScoreSummary(results)}
                    ${this.renderIndustryComparison(results)}
                    ${this.renderDimensionScores(results)}
                    ${this.renderActivityScores(results)}
                    ${this.renderRecommendations(results)}
                </div>
            `;
        } catch (error) {
            console.error('[InhouseDashboard] Error rendering dashboard:', error);
            return '<div class="dashboard-error">Error rendering dashboard</div>';
        }
    }
    
    // Dashboard section rendering methods
}
```

## Implementation Priorities

1. **Phase 1: Core Assessment Structure**
   - Implement `InhouseAssessment` class
   - Register with the assessment factory
   - Basic step implementation

2. **Phase 2: Step Implementation**
   - Industry and Activity selection steps
   - Generic question step framework
   - Specific question step implementations

3. **Phase 3: Scoring and Recommendations**
   - Scoring engine implementation
   - Recommendations engine implementation

4. **Phase 4: Reporting Dashboard**
   - Dashboard visualization
   - Results export functionality

5. **Phase 5: Testing and Integration**
   - End-to-end testing
   - UI polish and refinement

## Key Differences from Agency Assessment

The In-House Marketing Assessment differs from the Agency Assessment in several ways:

1. **Selection Steps**: Industry and activity selection instead of agency type and services
2. **Question Structure**: Three distinct question sets (core, industry, activity)
3. **Scoring System**: Industry-adjusted weights and activity impact factors
4. **Recommendation Focus**: Internal capability building vs client-facing strategies
5. **Reporting Dashboard**: Comparison to industry benchmarks and activity-specific insights

## Leverage Points

The implementation will leverage these aspects of the existing framework:

1. **Base Classes**: Extending `AssessmentBase`, `StepBase`, and `ScoringEngineBase`
2. **State Management**: Using the existing state persistence mechanisms
3. **Navigation System**: Leveraging the existing navigation controller
4. **UI Components**: Reusing UI patterns and component structures
5. **Event Handling**: Using the common event management utilities

## Testing Strategy

1. **Unit Testing**: Test individual components (steps, scoring, recommendations)
2. **Integration Testing**: Test the complete assessment flow
3. **UI Testing**: Verify responsive design and interaction patterns
4. **Cross-browser Testing**: Ensure compatibility with major browsers
