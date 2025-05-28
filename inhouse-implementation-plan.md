# In-House Marketing Assessment Implementation Plan v2

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

```javascript
// /assessments/inhouse/inhouse-assessment.js
import { AssessmentBase } from '../../core/assessment-base.js';
import { StateManager } from '../../core/state-manager.js';
import { NavigationController } from '../../core/navigation-controller.js';

// Import configuration files
import { InHouseMarketingQuestionsConfig } from './config/inhouse_questions.js';
import { InHouseMarketingRecommendationsConfig } from './config/inhouse-marketing-recommendations-config.js';

// Import steps
import { SetupStep } from './steps/setup-step.js';
import { QuestionsStep } from './steps/questions-step.js';
import { ContactStep } from './steps/contact-step.js';
import { ResultsStep } from './steps/results-step.js';

// Import scoring and recommendations
import { InhouseMarketingScoring } from './scoring/inhouse-scoring-engine.js';
import { InhouseRecommendationsEngine } from './recommendations/inhouse-recommendations-engine.js';
import { InhouseMarketingDashboard } from './reporting/inhouse-marketing-dashboard.js';

export class InhouseAssessment extends AssessmentBase {
    constructor(config, container) {
        // Merge external config with loaded configurations
        const enhancedConfig = {
            ...InHouseMarketingQuestionsConfig,
            recommendationsConfig: InHouseMarketingRecommendationsConfig,
            ...config
        };
        
        super(enhancedConfig, container);
        this.type = 'inhouse-marketing';
        
        // Initialize engines
        this.scoringEngine = new InhouseMarketingScoring(enhancedConfig);
        this.recommendationsEngine = new InhouseRecommendationsEngine(enhancedConfig);
        this.dashboard = new InhouseMarketingDashboard(enhancedConfig);
        
        // Register steps (streamlined to 5 steps)
        this.steps = {
            'setup': new SetupStep(this),              // Industry + Activity + Company Size
            'questions': new QuestionsStep(this),      // Adaptive questions (core + industry + activity)
            'contact': new ContactStep(this),          // Reuse from base framework
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
            currentQuestionType: null, // 'core', 'industry', or 'activity'
            questionProgress: {
                core: { answered: 0, total: 30 },
                industry: { answered: 0, total: 0 },
                activity: { answered: 0, total: 0 },
                overall: { answered: 0, total: 0, percentage: 0 }
            },
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
    
    getOverallProgress() {
        const coreCount = this.getQuestionsCount('core');
        const industryCount = this.getQuestionsCount('industry');
        const activityCount = this.getQuestionsCount('activity');
        
        const totalQuestions = coreCount + industryCount + activityCount;
        const answeredQuestions = Object.keys(this.state.answers).length;
        
        return {
            answered: answeredQuestions,
            total: totalQuestions,
            percentage: Math.round((answeredQuestions / totalQuestions) * 100),
            byType: {
                core: this.getTypeProgress('core'),
                industry: this.getTypeProgress('industry'),
                activity: this.getTypeProgress('activity')
            }
        };
    }
    
    getQuestionsCount(type) {
        switch(type) {
            case 'core':
                return Object.values(this.config.coreQuestions || {})
                    .flat()
                    .length;
            case 'industry':
                return (this.config.industryQuestions[this.state.selectedIndustry] || []).length;
            case 'activity':
                return this.state.selectedActivities
                    .map(id => (this.config.activityQuestions[id] || []).length)
                    .reduce((sum, count) => sum + count, 0);
            default:
                return 0;
        }
    }
    
    getTypeProgress(type) {
        const questions = this.getQuestionsByType(type);
        const answered = questions.filter(q => this.state.answers[q.id] !== undefined).length;
        
        return {
            answered,
            total: questions.length,
            percentage: questions.length > 0 ? Math.round((answered / questions.length) * 100) : 0
        };
    }
    
    getQuestionsByType(type) {
        switch(type) {
            case 'core':
                return Object.values(this.config.coreQuestions || {}).flat();
            case 'industry':
                return this.config.industryQuestions[this.state.selectedIndustry] || [];
            case 'activity':
                return this.state.selectedActivities
                    .map(id => this.config.activityQuestions[id] || [])
                    .flat();
            default:
                return [];
        }
    }
}
```

### 2. Step Implementation

#### Combined Setup Step (Industry + Activity + Company Info)

```javascript
// /assessments/inhouse/steps/setup-step.js
import { StepBase } from '../../../core/step-base.js';

export class SetupStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        this.cleanupListeners = [];
        this.currentSection = 'industry'; // 'industry', 'activity', or 'company'
        this.minimumActivities = 1;
        this.maximumActivities = 5;
    }
    
    render() {
        switch(this.currentSection) {
            case 'industry':
                return this.renderIndustrySection();
            case 'activity':
                return this.renderActivitySection();
            case 'company':
                return this.renderCompanySection();
            default:
                return this.renderIndustrySection();
        }
    }
    
    renderIndustrySection() {
        const industries = this.assessment.config.industries || [];
        const selectedIndustry = this.assessment.state.selectedIndustry;
        
        let html = `
            <div class="step-container">
                <div class="setup-progress">
                    <div class="progress-steps">
                        <div class="progress-step active">Industry</div>
                        <div class="progress-step">Activities</div>
                        <div class="progress-step">Company Info</div>
                    </div>
                </div>
                
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
    
    renderActivitySection() {
        const activities = this.assessment.config.activities || [];
        const selectedActivities = this.assessment.state.selectedActivities || [];
        
        let html = `
            <div class="step-container">
                <div class="setup-progress">
                    <div class="progress-steps">
                        <div class="progress-step completed">Industry</div>
                        <div class="progress-step active">Activities</div>
                        <div class="progress-step">Company Info</div>
                    </div>
                </div>
                
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
                        <span class="impact-badge ${activity.aiImpact.toLowerCase().replace(' ', '-')}">${activity.aiImpact} AI Impact</span>
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
    
    renderCompanySection() {
        const companySizes = this.assessment.config.companySizes || [];
        const selectedSize = this.assessment.state.companySize;
        const companyName = this.assessment.state.companyName || '';
        
        let html = `
            <div class="step-container">
                <div class="setup-progress">
                    <div class="progress-steps">
                        <div class="progress-step completed">Industry</div>
                        <div class="progress-step completed">Activities</div>
                        <div class="progress-step active">Company Info</div>
                    </div>
                </div>
                
                <h2>Company Information</h2>
                <p>This helps us provide size-appropriate recommendations.</p>
                
                <div class="form-group">
                    <label for="company-name">Company Name (Optional)</label>
                    <input type="text" id="company-name" class="form-control" value="${companyName}" placeholder="Your Company Name">
                </div>
                
                <div class="company-sizes">
                    <label>Company Size</label>
        `;
        
        companySizes.forEach(size => {
            const isSelected = selectedSize === size.id;
            html += `
                <div class="size-option ${isSelected ? 'selected' : ''}" data-size-id="${size.id}">
                    <span>${size.name}</span>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="step-navigation">
                    <button id="company-back" class="btn btn-secondary">Back</button>
                    <button id="company-next" class="btn btn-primary" ${!selectedSize ? 'disabled' : ''}>Start Assessment</button>
                </div>
            </div>
        `;
        
        return html;
    }
    
    setupEventListeners(container) {
        // Clear previous listeners
        this.cleanupEventListeners();
        
        switch(this.currentSection) {
            case 'industry':
                this.setupIndustryListeners(container);
                break;
            case 'activity':
                this.setupActivityListeners(container);
                break;
            case 'company':
                this.setupCompanyListeners(container);
                break;
        }
    }
    
    setupIndustryListeners(container) {
        const industryOptions = container.querySelectorAll('.industry-option');
        const nextButton = container.querySelector('#industry-next');
        
        industryOptions.forEach(option => {
            const listener = (e) => {
                const industryId = e.currentTarget.dataset.industryId;
                this.assessment.state.selectedIndustry = industryId;
                
                // Update UI
                container.querySelectorAll('.industry-option').forEach(el => el.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                
                // Enable next button
                container.querySelector('#industry-next').disabled = false;
            };
            
            option.addEventListener('click', listener);
            this.cleanupListeners.push(() => option.removeEventListener('click', listener));
        });
        
        const nextListener = () => {
            if (this.assessment.state.selectedIndustry) {
                this.currentSection = 'activity';
                this.assessment.renderCurrentStep();
            }
        };
        
        nextButton.addEventListener('click', nextListener);
        this.cleanupListeners.push(() => nextButton.removeEventListener('click', nextListener));
    }
    
    setupActivityListeners(container) {
        const activityOptions = container.querySelectorAll('.activity-option');
        const nextButton = container.querySelector('#activity-next');
        const backButton = container.querySelector('#activity-back');
        
        activityOptions.forEach(option => {
            const listener = (e) => {
                const activityId = e.currentTarget.dataset.activityId;
                let selectedActivities = [...(this.assessment.state.selectedActivities || [])];
                
                if (selectedActivities.includes(activityId)) {
                    selectedActivities = selectedActivities.filter(id => id !== activityId);
                    e.currentTarget.classList.remove('selected');
                } else {
                    if (selectedActivities.length >= this.maximumActivities) {
                        alert(`You can only select up to ${this.maximumActivities} activities.`);
                        return;
                    }
                    selectedActivities.push(activityId);
                    e.currentTarget.classList.add('selected');
                }
                
                this.assessment.state.selectedActivities = selectedActivities;
                
                // Update counter and button state
                container.querySelector('#selection-count').textContent = selectedActivities.length;
                container.querySelector('#activity-next').disabled = selectedActivities.length < this.minimumActivities;
            };
            
            option.addEventListener('click', listener);
            this.cleanupListeners.push(() => option.removeEventListener('click', listener));
        });
        
        const nextListener = () => {
            if (this.assessment.state.selectedActivities.length >= this.minimumActivities) {
                this.currentSection = 'company';
                this.assessment.renderCurrentStep();
            }
        };
        
        const backListener = () => {
            this.currentSection = 'industry';
            this.assessment.renderCurrentStep();
        };
        
        nextButton.addEventListener('click', nextListener);
        backButton.addEventListener('click', backListener);
        this.cleanupListeners.push(() => {
            nextButton.removeEventListener('click', nextListener);
            backButton.removeEventListener('click', backListener);
        });
    }
    
    setupCompanyListeners(container) {
        const sizeOptions = container.querySelectorAll('.size-option');
        const companyNameInput = container.querySelector('#company-name');
        const nextButton = container.querySelector('#company-next');
        const backButton = container.querySelector('#company-back');
        
        sizeOptions.forEach(option => {
            const listener = (e) => {
                const sizeId = e.currentTarget.dataset.sizeId;
                this.assessment.state.companySize = sizeId;
                
                // Update UI
                container.querySelectorAll('.size-option').forEach(el => el.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                
                // Enable next button
                container.querySelector('#company-next').disabled = false;
            };
            
            option.addEventListener('click', listener);
            this.cleanupListeners.push(() => option.removeEventListener('click', listener));
        });
        
        const nameListener = (e) => {
            this.assessment.state.companyName = e.target.value;
        };
        
        companyNameInput.addEventListener('input', nameListener);
        this.cleanupListeners.push(() => companyNameInput.removeEventListener('input', nameListener));
        
        const nextListener = () => {
            if (this.validate()) {
                this.assessment.stateManager.saveState();
                
                // Update question counts based on selections
                this.updateQuestionCounts();
                
                this.assessment.navigationController.nextStep();
            }
        };
        
        const backListener = () => {
            this.currentSection = 'activity';
            this.assessment.renderCurrentStep();
        };
        
        nextButton.addEventListener('click', nextListener);
        backButton.addEventListener('click', backListener);
        this.cleanupListeners.push(() => {
            nextButton.removeEventListener('click', nextListener);
            backButton.removeEventListener('click', backListener);
        });
    }
    
    updateQuestionCounts() {
        const progress = this.assessment.state.questionProgress;
        
        // Update industry question count
        progress.industry.total = this.assessment.getQuestionsCount('industry');
        
        // Update activity question count
        progress.activity.total = this.assessment.getQuestionsCount('activity');
        
        // Update overall
        progress.overall.total = progress.core.total + progress.industry.total + progress.activity.total;
    }
    
    validate() {
        return this.assessment.state.selectedIndustry && 
               this.assessment.state.selectedActivities.length >= this.minimumActivities &&
               this.assessment.state.companySize;
    }
    
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
}
```

#### Adaptive Questions Step (Combines Core, Industry, and Activity Questions)

```javascript
// /assessments/inhouse/steps/questions-step.js
import { StepBase } from '../../../core/step-base.js';

export class QuestionsStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        this.cleanupListeners = [];
        this.allQuestions = [];
        this.currentIndex = 0;
    }
    
    onEnter() {
        // Build the complete question list
        this.buildQuestionList();
        
        // Reset or restore question index
        this.currentIndex = this.assessment.state.currentQuestionIndex || 0;
    }
    
    buildQuestionList() {
        this.allQuestions = [];
        
        // Add core questions
        const coreQuestions = this.assessment.getQuestionsByType('core');
        this.allQuestions.push(...coreQuestions.map(q => ({ ...q, type: 'core' })));
        
        // Add industry questions
        const industryQuestions = this.assessment.getQuestionsByType('industry');
        this.allQuestions.push(...industryQuestions.map(q => ({ ...q, type: 'industry' })));
        
        // Add activity questions
        const activityQuestions = this.assessment.getQuestionsByType('activity');
        this.allQuestions.push(...activityQuestions.map(q => ({ ...q, type: 'activity' })));
        
        // Store the filtered questions in state
        this.assessment.state.filteredQuestions = this.allQuestions.map(q => q.id);
    }
    
    render() {
        if (!this.allQuestions.length) {
            this.buildQuestionList();
        }
        
        const currentQuestion = this.allQuestions[this.currentIndex];
        if (!currentQuestion) {
            return '<div class="error-message">No questions available.</div>';
        }
        
        const progress = this.assessment.getOverallProgress();
        const answer = this.assessment.state.answers[currentQuestion.id];
        
        // Get section name
        const sectionName = this.getSectionName(currentQuestion.type);
        const questionNumber = this.currentIndex + 1;
        
        let html = `
            <div class="step-container">
                <div class="question-header">
                    <div class="question-progress">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: ${progress.percentage}%"></div>
                        </div>
                        <div class="progress-text">
                            Question ${questionNumber} of ${this.allQuestions.length}
                            <span class="section-indicator">${sectionName}</span>
                        </div>
                    </div>
                    
                    <div class="progress-breakdown">
                        <span class="progress-item ${currentQuestion.type === 'core' ? 'active' : ''}">
                            Core: ${progress.byType.core.answered}/${progress.byType.core.total}
                        </span>
                        <span class="progress-item ${currentQuestion.type === 'industry' ? 'active' : ''}">
                            Industry: ${progress.byType.industry.answered}/${progress.byType.industry.total}
                        </span>
                        <span class="progress-item ${currentQuestion.type === 'activity' ? 'active' : ''}">
                            Activities: ${progress.byType.activity.answered}/${progress.byType.activity.total}
                        </span>
                    </div>
                </div>
                
                <div class="question-container">
                    <h2>${currentQuestion.question || currentQuestion.text}</h2>
                    
                    <div class="options-container">
        `;
        
        // Render options
        if (currentQuestion.options && Array.isArray(currentQuestion.options)) {
            currentQuestion.options.forEach((option, optionIndex) => {
                const optionText = typeof option === 'object' ? option.text : option;
                const optionValue = typeof option === 'object' ? option.score : optionIndex;
                const isSelected = answer === optionValue;
                
                html += `
                    <div class="option ${isSelected ? 'selected' : ''}" data-value="${optionValue}">
                        <div class="option-number">${optionValue}</div>
                        <div class="option-text">${optionText}</div>
                    </div>
                `;
            });
        }
        
        html += `
                    </div>
                </div>
                
                <div class="step-navigation">
                    <button id="question-back" class="btn btn-secondary">
                        ${this.currentIndex > 0 ? 'Previous Question' : 'Back to Setup'}
                    </button>
                    <button id="question-next" class="btn btn-primary" ${answer === undefined ? 'disabled' : ''}>
                        ${this.currentIndex < this.allQuestions.length - 1 ? 'Next Question' : 'Continue'}
                    </button>
                </div>
            </div>
        `;
        
        return html;
    }
    
    setupEventListeners(container) {
        const options = container.querySelectorAll('.option');
        const nextButton = container.querySelector('#question-next');
        const backButton = container.querySelector('#question-back');
        
        options.forEach(option => {
            const listener = (e) => {
                const value = parseInt(e.currentTarget.dataset.value);
                const currentQuestion = this.allQuestions[this.currentIndex];
                
                // Update answer
                this.assessment.state.answers[currentQuestion.id] = value;
                
                // Update progress
                this.updateProgress();
                
                // Update UI
                container.querySelectorAll('.option').forEach(el => el.classList.remove('selected'));
                e.currentTarget.classList.add('selected');
                
                // Enable next button
                container.querySelector('#question-next').disabled = false;
                
                // Save state
                this.assessment.stateManager.saveState();
            };
            
            option.addEventListener('click', listener);
            this.cleanupListeners.push(() => option.removeEventListener('click', listener));
        });
        
        const nextListener = () => this.handleNext();
        const backListener = () => this.handleBack();
        
        nextButton.addEventListener('click', nextListener);
        backButton.addEventListener('click', backListener);
        
        this.cleanupListeners.push(() => {
            nextButton.removeEventListener('click', nextListener);
            backButton.removeEventListener('click', backListener);
        });
    }
    
    handleNext() {
        // Save current index
        this.assessment.state.currentQuestionIndex = this.currentIndex;
        this.assessment.stateManager.saveState();
        
        if (this.currentIndex >= this.allQuestions.length - 1) {
            // Go to next step
            this.assessment.navigationController.nextStep();
        } else {
            // Go to next question
            this.currentIndex++;
            this.assessment.state.currentQuestionIndex = this.currentIndex;
            this.assessment.renderCurrentStep();
        }
    }
    
    handleBack() {
        if (this.currentIndex === 0) {
            // Go to previous step
            this.assessment.navigationController.previousStep();
        } else {
            // Go to previous question
            this.currentIndex--;
            this.assessment.state.currentQuestionIndex = this.currentIndex;
            this.assessment.renderCurrentStep();
        }
    }
    
    updateProgress() {
        // Update progress tracking
        const progress = this.assessment.getOverallProgress();
        this.assessment.state.questionProgress = {
            ...this.assessment.state.questionProgress,
            overall: progress
        };
    }
    
    getSectionName(type) {
        switch(type) {
            case 'core':
                return 'Core Assessment';
            case 'industry':
                const industry = this.assessment.config.industries.find(
                    i => i.id === this.assessment.state.selectedIndustry
                );
                return industry ? `${industry.name} Specific` : 'Industry Specific';
            case 'activity':
                return 'Activity Specific';
            default:
                return '';
        }
    }
    
    validate() {
        const currentQuestion = this.allQuestions[this.currentIndex];
        return this.assessment.state.answers[currentQuestion.id] !== undefined;
    }
    
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
}
```

#### Results Step

```javascript
// /assessments/inhouse/steps/results-step.js
import { StepBase } from '../../../core/step-base.js';

export class ResultsStep extends StepBase {
    constructor(assessment) {
        super(assessment);
    }
    
    render() {
        // Calculate results if not already done
        if (!this.assessment.state.results) {
            console.log('[ResultsStep] Calculating results...');
            this.assessment.state.results = this.assessment.calculateResults();
            this.assessment.stateManager.saveState();
        }
        
        const { results } = this.assessment.state;
        
        if (!results) {
            return '<div class="error-message">Unable to calculate results. Please try again.</div>';
        }
        
        return `
            <div class="results-container">
                <div class="results-header">
                    <h1>Your AI Readiness Assessment Results</h1>
                    <p class="readiness-category ${results.readinessCategory.toLowerCase().replace(/\s+/g, '-')}">
                        ${results.readinessCategory}
                    </p>
                </div>
                
                ${this.renderScoreSummary(results)}
                ${this.renderIndustryComparison(results)}
                ${this.renderInsourcingOpportunities(results)}
                ${this.renderROIProjections(results)}
                
                <div class="dashboard-container">
                    ${this.assessment.dashboard.render(results)}
                </div>
                
                ${this.renderNextSteps(results)}
            </div>
        `;
    }
    
    renderScoreSummary(results) {
        const { scores } = results;
        
        return `
            <div class="score-summary card">
                <h2>Overall AI Readiness Score</h2>
                <div class="overall-score-display">
                    <div class="score-circle">
                        <svg viewBox="0 0 36 36">
                            <path class="circle-bg"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <path class="circle"
                                stroke-dasharray="${scores.overall}, 100"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"/>
                            <text x="18" y="20.35" class="percentage">${Math.round(scores.overall)}%</text>
                        </svg>
                    </div>
                    <div class="score-dimensions">
                        <div class="dimension">
                            <span class="label">People & Skills</span>
                            <span class="value">${Math.round(scores.people_skills)}%</span>
                        </div>
                        <div class="dimension">
                            <span class="label">Process & Infrastructure</span>
                            <span class="value">${Math.round(scores.process_infrastructure)}%</span>
                        </div>
                        <div class="dimension">
                            <span class="label">Strategy & Leadership</span>
                            <span class="value">${Math.round(scores.strategy_leadership)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderIndustryComparison(results) {
        const { industryComparison } = results;
        
        return `
            <div class="industry-comparison card">
                <h2>Industry Comparison</h2>
                <div class="comparison-visual">
                    <div class="comparison-bar">
                        <div class="marker your-score" style="left: ${results.scores.overall}%">
                            <span>Your Score: ${Math.round(results.scores.overall)}%</span>
                        </div>
                        <div class="marker industry-avg" style="left: ${industryComparison.industryAverage}%">
                            <span>Industry Avg: ${industryComparison.industryAverage}%</span>
                        </div>
                        <div class="marker top-quartile" style="left: ${industryComparison.topQuartile}%">
                            <span>Top 25%: ${industryComparison.topQuartile}%</span>
                        </div>
                    </div>
                </div>
                <p class="comparison-text">
                    You are <strong>${industryComparison.comparison}</strong> in your industry
                </p>
            </div>
        `;
    }
    
    renderInsourcingOpportunities(results) {
        const { readinessCategory, scores } = results;
        const insourcingData = results.readinessMetrics?.insourcingReadiness || {};
        
        const readyFunctions = Object.entries(insourcingData)
            .filter(([_, data]) => data.ready)
            .map(([func, data]) => ({
                name: func.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
                readiness: data.currentReadiness
            }));
        
        if (readyFunctions.length === 0) {
            return '';
        }
        
        return `
            <div class="insourcing-opportunities card">
                <h2>Ready to Insource</h2>
                <p>Based on your assessment, these marketing functions can be brought in-house:</p>
                <div class="ready-functions">
                    ${readyFunctions.map(func => `
                        <div class="function-card">
                            <h3>${func.name}</h3>
                            <div class="readiness-meter">
                                <div class="readiness-fill" style="width: ${func.readiness}%"></div>
                            </div>
                            <span class="readiness-score">${Math.round(func.readiness)}% Ready</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }
    
    renderROIProjections(results) {
        const { roiProjections } = results;
        
        if (!roiProjections) return '';
        
        return `
            <div class="roi-projections card">
                <h2>ROI Projections</h2>
                <div class="roi-metrics">
                    <div class="metric">
                        <span class="label">Efficiency Gain</span>
                        <span class="value">${roiProjections.efficiencyGainPercent}%</span>
                    </div>
                    <div class="metric">
                        <span class="label">Annual Labor Savings</span>
                        <span class="value">$${roiProjections.annualLaborSavings.toLocaleString()}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Revenue Impact</span>
                        <span class="value">$${roiProjections.annualRevenueImpact.toLocaleString()}</span>
                    </div>
                    <div class="metric">
                        <span class="label">Payback Period</span>
                        <span class="value">${roiProjections.paybackPeriod}</span>
                    </div>
                </div>
                <p class="confidence">
                    Confidence Level: <strong>${roiProjections.confidenceLevel}</strong>
                </p>
            </div>
        `;
    }
    
    renderNextSteps(results) {
        // Get top 3 prioritized recommendations
        const topRecommendations = results.recommendations?.prioritizedRecommendations?.slice(0, 3) || [];
        
        return `
            <div class="next-steps card">
                <h2>Your Next Steps</h2>
                <div class="quick-wins">
                    ${topRecommendations.map((rec, index) => `
                        <div class="recommendation-item">
                            <span class="number">${index + 1}</span>
                            <div class="content">
                                <h3>${rec.title}</h3>
                                <p>${rec.description}</p>
                                <div class="meta">
                                    <span class="timeline">${rec.timeline}</span>
                                    <span class="roi">${rec.expectedROI}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="actions">
                    <button class="btn btn-primary" onclick="window.print()">Download Results</button>
                    <button class="btn btn-secondary" onclick="location.href='mailto:?subject=AI Readiness Assessment Results'">Share Results</button>
                </div>
            </div>
        `;
    }
    
    validate() {
        return true; // Results step doesn't need validation
    }
}
```

### 3. Contact Step

```javascript
// /assessments/inhouse/steps/contact-step.js
// Reuse the EmailStep from the base framework with minor modifications
import { EmailStep } from '../../../assessments/agency/steps/email-step.js';

export class ContactStep extends EmailStep {
    constructor(assessment) {
        super(assessment);
    }
    
    render() {
        // Override to add company-specific messaging
        const baseHtml = super.render();
        
        // Add in-house specific messaging
        return baseHtml.replace(
            '<h2>Get Your Results</h2>',
            '<h2>Get Your Personalized AI Readiness Report</h2>\n<p>Receive detailed recommendations tailored to your industry and marketing activities.</p>'
        );
    }
}
```

## Implementation Priorities

1. **Phase 1: Core Structure (Days 1-2)**
   - Implement `InhouseAssessment` class
   - Register with assessment factory
   - Basic navigation flow

2. **Phase 2: Step Implementation (Days 3-5)**
   - SetupStep with three sections
   - Adaptive QuestionsStep
   - ContactStep adaptation
   - ResultsStep with all sections

3. **Phase 3: Scoring Integration (Days 6-7)**
   - Adapt existing scoring engine
   - Connect to assessment flow
   - Test calculations

4. **Phase 4: Recommendations & Dashboard (Days 8-10)**
   - Recommendations engine
   - Dashboard implementation
   - Results visualization

5. **Phase 5: Testing & Polish (Days 11-12)**
   - End-to-end testing
   - UI refinements
   - Mobile optimization

## Key Improvements in v2

1. **Streamlined User Flow**: Reduced from 7 to 4 main steps
2. **Combined Setup Step**: Industry, activities, and company info in one progressive step
3. **Adaptive Questions**: All questions in one smart step with progress tracking
4. **Enhanced Progress Tracking**: Overall and per-section progress indicators
5. **Company Size Integration**: Properly integrated into the flow
6. **Rich Results Display**: Comprehensive results with multiple visualization sections

## Testing Checklist

- [ ] Setup step transitions smoothly between sections
- [ ] Activity selection respects min/max limits
- [ ] Question progress accurately tracks all question types
- [ ] Results calculate correctly with all data
- [ ] State persistence works across sessions
- [ ] Mobile experience is smooth
- [ ] All navigation paths work correctly
- [ ] Error states are handled gracefully