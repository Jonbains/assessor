# Assessment Framework Documentation

## Table of Contents
1. [Introduction](#introduction)
2. [Core Architecture](#core-architecture)
3. [File Structure](#file-structure)
4. [Data Flow](#data-flow)
5. [State Management](#state-management)
6. [Assessment Types](#assessment-types)
7. [Step Implementation](#step-implementation)
8. [Scoring System](#scoring-system)
9. [Recommendations Engine](#recommendations-engine)
10. [Reporting and Dashboards](#reporting-and-dashboards)
11. [Component Hierarchy](#component-hierarchy)
12. [User Experience Considerations](#user-experience-considerations)
13. [Practical Implementation Examples](#practical-implementation-examples)
14. [Error Handling and Debugging](#error-handling-and-debugging)
15. [Testing Framework](#testing-framework)
16. [Technical Limitations](#technical-limitations)
17. [Integration Capabilities](#integration-capabilities)
18. [Deployment and Versioning](#deployment-and-versioning)

## Introduction

### Overview

The Assessment Framework is a modular, extensible JavaScript system designed to create and manage different types of assessments for marketing and agency businesses. It currently supports agency and in-house assessments, with a primary focus on AI readiness evaluation and M&A valuation metrics.

The framework uses a step-based approach where users progress through a series of screens, providing information that is analyzed to generate scores, recommendations, and valuation metrics. This structured approach ensures a consistent user experience while allowing for significant customization of assessment content and logic.

### Key Features

- **Modular Architecture**: Core components can be extended and customized
- **Multiple Assessment Types**: Support for different business models (agency, in-house)
- **Configurable Steps**: Flexible step sequence that can be tailored per assessment
- **Dimension-Based Scoring**: Scores calculated across multiple business dimensions
- **Dynamic Recommendations**: AI-powered, context-aware recommendations
- **Valuation Metrics**: Financial impact and valuation calculations
- **State Persistence**: Progress saving via localStorage (transitioning to Firebase)
- **Mobile Responsive**: Works across devices with adaptive UI

### Business Context

The Assessment Framework was created to help marketing businesses evaluate their AI readiness and understand their potential valuation in the rapidly evolving digital landscape. Key business objectives include:

1. **AI Readiness Assessment**: Evaluating how prepared an organization is to adopt and leverage AI technologies
2. **Valuation Calculation**: Providing businesses with insights into their potential market value
3. **Strategic Recommendations**: Delivering actionable recommendations to improve business performance
4. **Benchmarking**: Allowing businesses to compare their performance against industry standards

### Technical Foundation

The framework is built with modern JavaScript (ES6+) and uses a component-based architecture without external dependencies on frameworks like React or Vue. This lightweight approach ensures fast loading and execution while maintaining flexibility.

The system employs:
- ES6 modules for code organization
- Object-oriented programming principles
- Event-driven communication between components
- HTML templating for UI rendering
- CSS for styling with a dark theme and yellow accent colors

## Core Architecture

The framework follows an object-oriented architecture with clear separation of concerns, enabling the creation of various assessment types through extension and customization rather than modification of core components.

### Key Components

1. **Assessment Base**: The foundation class that all assessment types extend.
2. **Step Base**: The foundation for all steps within an assessment.
3. **Scoring Base**: Provides core scoring functionality.
4. **State Manager**: Handles state persistence and updates.
5. **Navigation Controller**: Manages navigation between steps.
6. **Assessment Factory**: Creates assessment instances based on type.

### Design Principles

- **Modularity**: Each component has a single responsibility
- **Extensibility**: Base classes can be extended for specialized functionality
- **State-driven**: UI updates based on state changes
- **Event-based**: Components communicate through events

### Framework Extension Points

The assessment framework is designed to be extended at specific points to create custom assessment types with unique behaviors:

#### Base Class Inheritance

The core functionality is provided through abstract base classes that define the interfaces and common behavior. New assessment types should extend these classes:

```
╒════════════════╕
│ AssessmentBase │
╘═══════╤════════╛
        │
        │ extends
        ▼
╒════════════════╕     ╒════════════════╕
│ AgencyAssessment│     │ InHouseAssessment │ ... Other Assessment Types
╘════════════════╛     ╘════════════════╛
```

```
╒═════════════╕
│  StepBase  │
╘═════╤═════╛
      │
      │ extends
      ▼
╒════════════════╕ ╒═════════════╕ ╒════════════════╕
│ ServicesStep  │ │ EmailStep  │ │ ResultsStep  │ ... Other Step Types
╘════════════════╛ ╘═════════════╛ ╘════════════════╛
```

```
╒══════════════════════╕
│ ScoringEngineBase  │
╘═════════════╤══════╛
             │
             │ extends
             ▼
╒═══════════════════════════╕ ╒═══════════════════════════════╕
│ AgencyScoringEngine     │ │ InHouseScoringEngine      │ ... Other Engines
╘═══════════════════════════╛ ╘═══════════════════════════════╛
```

#### Core Component Interfaces

Each core component implements a consistent interface that defines its required methods:

##### 1. Assessment Interface

```javascript
// Abstract assessment interface
class AssessmentBase {
    constructor(config, container) {
        // Core initialization
    }
    
    // Required methods that all assessment types must implement
    initializeState() { /* Abstract method */ }
    validateCurrentStep() { /* Abstract method */ }
    renderCurrentStep() { /* Abstract method */ }
    calculateResults() { /* Abstract method */ }
    
    // Shared functionality
    start() { /* Shared implementation */ }
    reset() { /* Shared implementation */ }
}
```

##### 2. Step Interface

```javascript
// Abstract step interface
class StepBase {
    constructor(assessment) {
        this.assessment = assessment;
    }
    
    // Required methods that all steps must implement
    render() { /* Abstract method */ }
    validate() { /* Abstract method */ }
    
    // Optional lifecycle hooks
    onEnter() { /* Optional override */ }
    onExit() { /* Optional override */ }
    setupEventListeners(container) { /* Optional override */ }
    cleanupEventListeners() { /* Optional override */ }
}
```

##### 3. Scoring Engine Interface

```javascript
// Abstract scoring engine interface
class ScoringEngineBase {
    constructor(config) {
        this.config = config;
    }
    
    // Required methods that all scoring engines must implement
    calculateScores(state) { /* Abstract method */ }
    
    // Utility methods that can be overridden
    getMaxPoints(question) { /* Default implementation */ }
    getAnswerPoints(answer, question) { /* Default implementation */ }
}
```

### Creating Custom Assessment Types

To create a new assessment type beyond the existing Agency and In-House assessments, extend the appropriate base classes:

```javascript
// 1. Create custom assessment class
export class CustomAssessment extends AssessmentBase {
    constructor(config, container) {
        super(config, container);
        
        // Register custom steps
        this.steps = {
            'custom-step-1': new CustomStep1(this),
            'custom-step-2': new CustomStep2(this),
            // Add more steps as needed
        };
        
        // Initialize custom components
        this.scoringEngine = new CustomScoringEngine(this.config);
        this.recommendationsEngine = new CustomRecommendationsEngine();
    }
    
    // Implement required methods
    initializeState() {
        return {
            currentStep: this.config.steps[0],
            // Custom state properties
            customData: {},
            // Common properties
            answers: {}
        };
    }
    
    // Other required method implementations...
}

// 2. Create custom step classes
export class CustomStep extends StepBase {
    constructor(assessment) {
        super(assessment);
    }
    
    render() {
        return `
            <div class="step-container">
                <h2>Custom Step</h2>
                <!-- Custom UI elements -->
            </div>
        `;
    }
    
    validate() {
        // Custom validation logic
        return true;
    }
    
    // Other method implementations...
}

// 3. Register with the factory
AssessmentFactory.registerAssessmentType('custom', CustomAssessment);
```

### Configuration-Based Customization

Beyond creating new classes, the framework supports extensive configuration-based customization:

```javascript
// Custom assessment configuration
const customConfig = {
    // Step sequence
    steps: ['intro', 'custom-step-1', 'custom-step-2', 'results'],
    
    // Assessment parameters
    parameters: {
        requireEmailCapture: true,
        showProgressBar: true,
        allowSkipSteps: false,
        stateExpirationDays: 7
    },
    
    // Data model configuration
    dataModel: {
        categories: [
            { id: 'category1', name: 'Category 1', weight: 0.6 },
            { id: 'category2', name: 'Category 2', weight: 0.4 }
        ],
        questions: [
            {
                id: 'q1',
                text: 'Question 1',
                type: 'scale',
                category: 'category1',
                options: [1, 2, 3, 4, 5]
            },
            // More questions...
        ]
    },
    
    // UI customization
    ui: {
        theme: 'dark',
        primaryColor: '#FFD700',
        fonts: {
            heading: 'Montserrat, sans-serif',
            body: 'Open Sans, sans-serif'
        }
    }
};
```

### Plugin Architecture

The framework supports a plugin architecture for adding functionality without modifying core components:

```javascript
// Analytics plugin example
const analyticsPlugin = {
    name: 'analytics',
    init(assessment) {
        // Setup plugin
    },
    hooks: {
        onStepEnter: (stepId) => {
            // Track step entry
            trackEvent('step_view', { stepId });
        },
        onAnswerSubmit: (questionId, answer) => {
            // Track answer submission
            trackEvent('answer_submit', { questionId, answer });
        },
        onAssessmentComplete: (results) => {
            // Track assessment completion
            trackEvent('assessment_complete', { 
                overallScore: results.scores.overall 
            });
        }
    }
};

// Register plugin with assessment
assessment.registerPlugin(analyticsPlugin);
```

### Integration Capabilities

The assessment framework is designed to integrate with various external systems:

```javascript
// Integration with CRM systems
class CrmIntegratedAssessment extends CustomAssessment {
    constructor(config, container, crmClient) {
        super(config, container);
        this.crmClient = crmClient;
    }
    
    async saveResults() {
        // Get user data from state
        const { email, name, results } = this.state;
        
        // Map assessment data to CRM lead format
        const leadData = {
            email: email,
            name: name,
            score: results.scores.overall,
            assessmentType: this.type,
            completedDate: new Date().toISOString()
        };
        
        // Send data to CRM
        try {
            await this.crmClient.createLead(leadData);
            console.log('[CrmIntegration] Lead created successfully');
        } catch (error) {
            console.error('[CrmIntegration] Error creating lead:', error);
        }
    }
}
```

These extension points allow for the creation of a wide variety of assessment types beyond the current agency and in-house implementations, while maintaining a consistent structure and leveraging the core framework functionality.

## File Structure

### Directory Organization

The Assessment Framework follows a modular, domain-driven directory structure that organizes code by function and assessment type:

```
assessor/
├── assessment-factory.js          # Factory for creating assessment instances
├── core/                          # Core framework components
│   ├── assessment-base.js         # Base assessment class
│   ├── step-base.js               # Base step class
│   ├── state-manager.js           # State management
│   ├── navigation-controller.js    # Navigation between steps
│   └── scoring-base.js            # Base scoring functionality
├── assessments/                    # Assessment type implementations
│   ├── agency/                    # Agency assessment implementation
│   │   ├── agency-assessment.js   # Agency-specific assessment class
│   │   ├── steps/                 # Agency-specific step implementations
│   │   │   ├── agency-type-step.js # Step for selecting agency type
│   │   │   ├── services-step.js    # Step for selecting services and revenue
│   │   │   ├── questions-step.js   # Step for answering assessment questions
│   │   │   ├── email-step.js       # Step for collecting contact information
│   │   │   └── results-step.js     # Step for displaying assessment results
│   │   ├── scoring/               # Agency-specific scoring
│   │   │   └── scoring-engine.js   # Agency scoring implementation
│   │   ├── recommendations/       # Recommendation generation
│   │   │   ├── recommendations-engine.js    # Recommendations logic
│   │   │   └── service-recommendations.js   # Service-specific recommendation data
│   │   └── reporting/             # Results visualization
│   │       └── valuation-dashboard.js # Dashboard for results display
│   └── inhouse/                   # In-house assessment implementation
│       ├── inhouse-assessment.js   # In-house assessment class
│       ├── steps/                  # In-house specific steps
│       ├── scoring/                # In-house specific scoring
│       └── reporting/              # In-house results visualization
├── shared/                        # Shared components and utilities
│   ├── components/                # Reusable UI components
│   │   ├── progress-bar.js        # Assessment progress indicator
│   │   ├── services-selector.js    # Service selection component
│   │   └── form-elements.js       # Common form elements
│   └── utils/                     # Utility functions
│       ├── event-manager.js        # Event handling utilities
│       ├── validation.js           # Input validation utilities
│       └── formatting.js           # Text and number formatting
├── resources/                      # Static resources
│   ├── css/                      # Stylesheet files
│   │   ├── assessment.css         # Core assessment styles
│   │   └── dashboard.css         # Dashboard-specific styles
│   └── images/                   # Image assets
└── index.html                     # Main entry point HTML
```

### Key Files and Their Purpose

#### Core Framework Files

- **assessment-factory.js**: Factory pattern implementation for creating assessment instances
  - Registers available assessment types
  - Creates assessment instances with appropriate configuration
  - Provides methods to check available assessment types

- **core/assessment-base.js**: Base class for all assessment types
  - Defines the common assessment interface
  - Manages state and navigation
  - Provides lifecycle hooks for assessment steps

- **core/step-base.js**: Base class for all assessment steps
  - Defines the step interface (render, validate, etc.)
  - Provides common step functionality
  - Handles event setup and cleanup

- **core/state-manager.js**: Manages assessment state persistence
  - Handles saving and loading state to localStorage
  - Provides methods to update specific state properties
  - Manages state versioning and validation

- **core/navigation-controller.js**: Controls navigation between steps
  - Manages forward and backward navigation
  - Validates steps before navigation
  - Handles step transitions

- **core/scoring-base.js**: Base scoring functionality
  - Defines interface for score calculation
  - Provides helper methods for dimension and question scoring
  - Handles weight management for dimensions and questions

#### Assessment-Specific Files

- **assessments/agency/agency-assessment.js**: Agency assessment implementation
  - Extends AssessmentBase with agency-specific functionality
  - Initializes agency-specific steps
  - Implements agency-specific calculations

- **assessments/agency/steps/**: Agency-specific step implementations
  - **agency-type-step.js**: Agency type selection
  - **services-step.js**: Service selection and revenue allocation
  - **questions-step.js**: Question presentation and answer collection
  - **email-step.js**: Contact information collection
  - **results-step.js**: Results display and export

- **assessments/agency/scoring/scoring-engine.js**: Agency scoring implementation
  - Calculates overall scores, dimension scores, and service-specific scores
  - Applies agency-specific scoring rules
  - Generates metrics for valuation calculations

- **assessments/agency/recommendations/**: Recommendation generation
  - **recommendations-engine.js**: Generates recommendations based on scores
  - **service-recommendations.js**: Contains recommendation content database

- **assessments/agency/reporting/valuation-dashboard.js**: Results visualization
  - Renders score visualizations
  - Displays service recommendations
  - Shows financial impact and valuation metrics

#### Shared Components and Utilities

- **shared/components/**: Reusable UI components
  - **progress-bar.js**: Visual progress indicator for assessment steps
  - **services-selector.js**: Component for selecting and allocating services

- **shared/utils/**: Utility functions
  - **event-manager.js**: Centralized event handling
  - **validation.js**: Input validation utilities
  - **formatting.js**: Text and number formatting utilities

### File Organization Principles

The file structure follows these key principles:

1. **Core/Extension Separation**: Core framework code is separated from assessment-specific extensions
2. **Domain-Driven Design**: Files are organized by functional domain (steps, scoring, recommendations)
3. **Vertical Slicing**: Each assessment type has a complete vertical slice of functionality
4. **Shared Components**: Common functionality is extracted into shared components and utilities
5. **Consistent Naming**: Files follow a consistent naming convention for easy identification

### Adding New Files

When extending the framework with new files:

1. **Assessment Extensions**: Place in the appropriate assessment subdirectory
2. **New Assessment Types**: Create a new directory under `assessments/`
3. **Common Components**: Add to `shared/components/` if used by multiple assessment types
4. **Utility Functions**: Place in `shared/utils/` with appropriate categorization

## Data Flow

The assessment framework employs a structured data flow pattern that ensures consistent and reliable processing of user inputs to generate meaningful results and recommendations.

### Core Data Flow Sequence

The assessment data flows through the system in the following sequence:

1. **User Input Collection**: Gathered through interactive step components
2. **State Management**: Validated and stored in the assessment state
3. **Navigation Processing**: Managed by the navigation controller
4. **Answer Processing**: Processed and normalized by the question manager
5. **Score Calculation**: Analyzed and scored by the scoring engine
6. **Recommendations Generation**: Created by the recommendations engine based on scores
7. **Results Rendering**: Formatted and displayed through the results components

### Data Flow Diagram

```
┌────────────┐      ┌────────────┐      ┌────────────┐
│            │      │            │      │            │
│ User Input ├─────►│ State      ├─────►│ Validation │
│            │      │ Management │      │            │
└────────────┘      └────────────┘      └─────┬──────┘
                                              │
┌────────────┐      ┌────────────┐      ┌─────▼──────┐
│            │      │            │      │            │
│ Reporting  │◄─────┤ Scoring    │◄─────┤ Navigation │
│            │      │            │      │            │
└────────────┘      └────────────┘      └────────────┘
```

### Detailed Data Flow Examples

#### 1. Agency Type Selection Flow

```javascript
// 1. User selects agency type in AgencyTypeStep
const agencyTypeRadio = document.querySelector('input[name="agency-type"]:checked');
const selectedAgencyType = agencyTypeRadio.value; // e.g., 'creative'

// 2. Step validation occurs
validate() {
    const selectedAgencyType = document.querySelector('input[name="agency-type"]:checked');
    if (!selectedAgencyType) {
        document.getElementById('agency-type-error').style.display = 'block';
        return false;
    }
    return true;
}

// 3. Data is saved to assessment state
this.assessment.state.selectedAgencyType = selectedAgencyType;

// 4. StateManager persists the update
this.assessment.stateManager.updateState('selectedAgencyType', selectedAgencyType);
this.assessment.stateManager.saveState();

// 5. Navigation to next step occurs
this.assessment.nextStep();
```

#### 2. Services Selection and Revenue Allocation Flow

```javascript
// 1. User selects services and allocates revenue
const serviceAllocations = {};
const serviceSliders = document.querySelectorAll('.service-slider');

serviceSliders.forEach(slider => {
    const serviceId = slider.dataset.service;
    const allocationValue = parseFloat(slider.value);
    serviceAllocations[serviceId] = allocationValue;
});

// 2. User enters total revenue
const revenue = parseFloat(document.getElementById('revenue-input').value);

// 3. Data is processed and saved to state
const selectedServices = Object.keys(serviceAllocations).filter(
    serviceId => serviceAllocations[serviceId] > 0
);

this.assessment.state.selectedServices = selectedServices;
this.assessment.state.serviceRevenue = serviceAllocations;
this.assessment.state.revenue = revenue;

// 4. StateManager persists updates
this.assessment.stateManager.saveState();
```

#### 3. Score Calculation Flow

The scoring process is a critical component that transforms user answers into meaningful metrics:

```javascript
// In ScoringEngine.calculateScores()
export class AgencyScoringEngine extends ScoringEngineBase {
    calculateScores(state) {
        console.log('[ScoringEngine] Calculating scores with state:', state);
        
        // Initialize scores structure
        const scores = {
            overall: 0,
            dimensions: {
                ai_readiness: 0,
                operational: 0,
                financial: 0
            },
            services: {}
        };
        
        // Initialize service-specific scores
        (state.selectedServices || []).forEach(serviceId => {
            scores.services[serviceId] = { ai: 0 };
        });
        
        // Calculate dimension scores
        this.calculateDimensionScores(state, scores);
        
        // Calculate service-specific scores
        this.calculateServiceScores(state, scores);
        
        // Calculate overall score (weighted average of dimensions)
        scores.overall = this.calculateOverallScore(scores.dimensions);
        
        console.log('[ScoringEngine] Final scores:', scores);
        return scores;
    }
    
    calculateDimensionScores(state, scores) {
        const { answers, filteredQuestions } = state;
        const dimensionScores = { ai_readiness: 0, operational: 0, financial: 0 };
        const dimensionPoints = { ai_readiness: 0, operational: 0, financial: 0 };
        const dimensionMaxPoints = { ai_readiness: 0, operational: 0, financial: 0 };
        
        // Process each question
        (filteredQuestions || []).forEach(questionId => {
            const question = this.getQuestionById(questionId);
            if (!question) return;
            
            const dimension = question.dimension || 'ai_readiness';
            const answer = answers[questionId];
            
            // Skip unanswered questions
            if (answer === undefined) return;
            
            // Get points for this answer
            const points = this.getAnswerPoints(answer, question);
            const maxPoints = this.getMaxPoints(question);
            
            // Add to dimension totals
            dimensionPoints[dimension] += points;
            dimensionMaxPoints[dimension] += maxPoints;
        });
        
        // Calculate percentage scores for each dimension
        Object.keys(dimensionScores).forEach(dimension => {
            if (dimensionMaxPoints[dimension] > 0) {
                dimensionScores[dimension] = 
                    (dimensionPoints[dimension] / dimensionMaxPoints[dimension]) * 100;
            }
        });
        
        // Update scores object
        scores.dimensions = dimensionScores;
    }
    
    calculateOverallScore(dimensions) {
        // Weights for each dimension
        const weights = {
            ai_readiness: 0.5,
            operational: 0.3,
            financial: 0.2
        };
        
        // Calculate weighted average
        let weightedSum = 0;
        let totalWeight = 0;
        
        Object.entries(dimensions).forEach(([dimension, score]) => {
            const weight = weights[dimension] || 0;
            weightedSum += score * weight;
            totalWeight += weight;
        });
        
        return totalWeight > 0 ? weightedSum / totalWeight : 0;
    }
}
```

#### 4. Recommendations Generation Flow

The recommendations engine uses scores to generate actionable insights:

```javascript
export class AgencyRecommendationsEngine {
    generateRecommendations(assessmentData) {
        const { state, scores } = assessmentData;
        const recommendations = {
            serviceRecommendations: [],
            operationalRecommendations: [],
            financialRecommendations: []
        };
        
        // Generate service-specific recommendations
        this.generateServiceRecommendations(state, scores, recommendations);
        
        // Generate operational recommendations
        this.generateOperationalRecommendations(state, scores, recommendations);
        
        // Generate financial recommendations
        this.generateFinancialRecommendations(state, scores, recommendations);
        
        return recommendations;
    }
    
    generateServiceRecommendations(state, scores, recommendations) {
        // For each selected service
        (state.selectedServices || []).forEach(serviceId => {
            // Get service AI score
            const serviceScore = scores.services[serviceId]?.ai || 0;
            
            // Determine score bracket
            let scoreBracket;
            if (serviceScore < 40) {
                scoreBracket = 'lowScore';
            } else if (serviceScore < 70) {
                scoreBracket = 'midScore';
            } else {
                scoreBracket = 'highScore';
            }
            
            // Get service recommendations data
            const serviceRecommendations = ServiceRecommendations.services[serviceId];
            if (!serviceRecommendations) return;
            
            // Get recommendations for this score bracket
            const bracketRecommendations = serviceRecommendations[scoreBracket];
            if (!bracketRecommendations) return;
            
            // Add recommendations from each timeframe
            ['immediate', 'shortTerm', 'strategic'].forEach(timeframe => {
                if (bracketRecommendations[timeframe]) {
                    bracketRecommendations[timeframe].forEach(rec => {
                        recommendations.serviceRecommendations.push({
                            ...rec,
                            service: serviceId,
                            serviceName: serviceRecommendations.serviceName,
                            timeframe: timeframe
                        });
                    });
                }
            });
        });
    }
}
```

#### 5. Results Display Flow

The results step processes and displays the assessment outcome:

```javascript
// In ResultsStep.render()
render() {
    // 1. Calculate results if not already done
    if (!this.assessment.state.results) {
        // Get scores from scoring engine
        const scores = this.assessment.scoringEngine.calculateScores(this.assessment.state);
        
        // Generate recommendations based on scores
        const recommendations = this.assessment.recommendationsEngine.generateRecommendations({
            state: this.assessment.state,
            scores: scores
        });
        
        // Calculate financial impact
        const financialImpact = this.calculateFinancialImpact(scores);
        
        // Store complete results in state
        this.assessment.state.results = {
            scores,
            recommendations,
            financialImpact
        };
        
        // Save final state
        this.assessment.stateManager.saveState();
    }
    
    // 2. Access the results for display
    const { scores, recommendations, financialImpact } = this.assessment.state.results;
    
    // 3. Render results dashboard
    return `
        <div class="results-container">
            <h2>Assessment Results</h2>
            <div class="scores-summary">
                <div class="overall-score">
                    <h3>Overall AI Readiness</h3>
                    <div class="score-value">${Math.round(scores.overall)}%</div>
                </div>
                <div class="dimension-scores">
                    ${Object.entries(scores.dimensions).map(([dimension, score]) => `
                        <div class="dimension-score">
                            <span class="dimension-name">${this.formatDimension(dimension)}</span>
                            <span class="score-value">${Math.round(score)}%</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <div class="recommendations-section">
                <h3>Recommended Actions</h3>
                ${this.renderRecommendations(recommendations)}
            </div>
            
            <div class="financial-impact">
                <h3>Financial Impact</h3>
                ${this.renderFinancialImpact(financialImpact)}
            </div>
        </div>
    `;
}
```

### Critical Data Structures

#### 1. Results Object

The results object structure is critical for correctly displaying assessment outcomes:

```javascript
// Standard results structure
const results = {
    scores: {
        overall: 72,                  // Overall assessment score (0-100)
        dimensions: {
            ai_readiness: 65,         // AI readiness dimension score
            operational: 75,          // Operational dimension score
            financial: 80             // Financial dimension score
        },
        services: {                   // Service-specific scores
            creative: { ai: 60 },     // Creative service AI score
            content: { ai: 70 }       // Content service AI score
        }
    },
    recommendations: {
        serviceRecommendations: [],    // Service-specific recommendations
        operationalRecommendations: [], // Operational recommendations
        financialRecommendations: []   // Financial recommendations
    },
    financialImpact: {
        valuationMultiple: 2.5,        // Current valuation multiple
        valuationEstimate: 3750000,    // Estimated valuation
        potentialValuationMultiple: 3.2, // Potential multiple with AI
        potentialValuationGain: 1050000 // Potential valuation gain
    }
};
```

### Common Data Flow Issues and Solutions

#### 1. Score Calculation and Display Mismatch

A critical issue can occur when the scoring engine returns data in a structure that doesn't match what the display components expect:

**Problem:**
```javascript
// Scoring engine may return:
const scores = {
    overall: 72,
    dimensions: { ai_readiness: 65, operational: 75 }
};

// But display component might expect:
const scores = {
    overallScore: 72,  // Different property name
    dimensionScores: { ai_readiness: 65, operational: 75 } // Different structure
};
```

**Solution:**
Implement defensive coding in components that access the scores:

```javascript
// In the display component:
renderScores(scores) {
    // Use optional chaining and nullish coalescing for safety
    const overall = scores?.overall ?? 0;
    const dimensions = scores?.dimensions ?? {};
    
    // Render with verified data
    return `
        <div class="scores-container">
            <div class="overall-score">${Math.round(overall)}%</div>
            <div class="dimension-scores">
                ${Object.entries(dimensions).map(([dimension, score]) => `
                    <div class="dimension-score">
                        <span class="dimension-name">${this.formatDimension(dimension)}</span>
                        <span class="score-value">${Math.round(score)}%</span>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}
```

#### 2. Service Revenue Allocation Validation

Ensuring service revenue is properly allocated and validated:

```javascript
// Validate revenue allocation
validateServiceRevenue() {
    const { selectedServices, serviceRevenue } = this.assessment.state;
    
    // Check for missing revenue allocations
    const missingRevenue = selectedServices.filter(service => 
        serviceRevenue[service] === undefined
    );
    
    if (missingRevenue.length > 0) {
        this.showError('Please allocate revenue for all selected services');
        return false;
    }
    
    // Validate total is 100%
    const total = Object.values(serviceRevenue).reduce((sum, val) => sum + val, 0);
    if (Math.abs(total - 100) > 0.01) {
        this.showError(`Revenue allocation must total 100%. Current total: ${total.toFixed(2)}%`);
        return false;
    }
    
    return true;
}
```

#### 3. Comprehensive Logging for Debugging

Implement detailed logging to track data flow through the system:

```javascript
// In ScoringEngine.calculateScores()
calculateScores(state) {
    console.log('[ScoringEngine] Starting score calculation with state:', {
        selectedServices: state.selectedServices,
        answerCount: Object.keys(state.answers || {}).length,
        agencyType: state.selectedAgencyType
    });
    
    // Score calculation logic...
    
    // Log intermediate values
    console.log('[ScoringEngine] Dimension points:', dimensionPoints);
    console.log('[ScoringEngine] Dimension max points:', dimensionMaxPoints);
    console.log('[ScoringEngine] Raw dimension scores:', dimensionScores);
    
    // Final result logging
    console.log('[ScoringEngine] Final calculated scores:', scores);
    return scores;
}
```

### Data Flow Optimization

1. **Selective State Updates**: Only update and save the specific parts of state that have changed
2. **Lazy Calculation**: Calculate scores and recommendations only when needed
3. **Cached Results**: Store and reuse calculation results when input data hasn't changed
4. **Structured Events**: Use a consistent event system for data updates and propagation
5. **Validation Checkpoints**: Validate data at critical points in the flow
   - Example: `{question1: 5, question2: 'yes', question3: 'option2'}`

3. **Answers → Dimension Scores**
   - Answer data is processed into dimension scores
   - Example: `{ai_readiness: 85, operational: 72, financial: 63}`

4. **Scores → Recommendations**
   - Score data is analyzed to generate targeted recommendations
   - Example: Scores of 40-70 in AI readiness trigger mid-level recommendations

5. **Assessment Data → Financial Projections**
   - Revenue, services, and scores are used to calculate financial impact
   - Example: Valuation multiples, potential value increase

### Data Flow Controls

The assessment framework implements several controls to maintain data integrity:

1. **Validation Gates**: Each step validates data before proceeding
2. **Type Checking**: Data type validation for critical values
3. **Default Values**: Fallbacks when expected data is missing
4. **State Persistence**: Regular saving to prevent data loss
5. **Error Handling**: Try-catch blocks around critical data operations

## State Management

The `StateManager` class is responsible for maintaining the assessment state throughout the user journey, providing persistent storage and a standardized interface for state operations.

### State Manager Implementation

The StateManager class implements the following key functionality:

```javascript
export class StateManager {
    /**
     * Constructor for state manager
     * @param {Object} assessment - The parent assessment
     */
    constructor(assessment) {
        this.assessment = assessment;
        this.localStorageKey = `assessment_${this.assessment.type}_state`;
    }
    
    /**
     * Initialize state from localStorage or create new state
     * @param {Object} initialState - Default initial state if no saved state exists
     * @return {Object} - The initialized state
     */
    initializeState(initialState) {
        try {
            // Check if there's a saved state in localStorage
            const savedStateJSON = localStorage.getItem(this.localStorageKey);
            
            if (savedStateJSON) {
                // Parse saved state
                const savedState = JSON.parse(savedStateJSON);
                console.log('[StateManager] Loaded saved state', savedState);
                
                // Check if state is too old (optional expiration check)
                const stateAge = this.getStateAge(savedState);
                if (stateAge > this.assessment.config.stateExpirationDays * 24 * 60 * 60 * 1000) {
                    console.log('[StateManager] Saved state expired, creating new state');
                    this.clearState();
                    return initialState;
                }
                
                return savedState;
            }
        } catch (error) {
            console.error('[StateManager] Error loading saved state:', error);
            this.clearState();
        }
        
        // No valid saved state, return initial state
        return initialState;
    }
    
    /**
     * Calculate age of saved state in milliseconds
     * @param {Object} state - Assessment state
     * @return {Number} - Age in milliseconds
     */
    getStateAge(state) {
        if (!state.savedAt) return Infinity;
        return new Date().getTime() - state.savedAt;
    }
    
    /**
     * Save current assessment state to localStorage
     */
    saveState() {
        try {
            const stateToSave = { 
                ...this.assessment.state,
                savedAt: new Date().getTime()
            };
            localStorage.setItem(this.localStorageKey, JSON.stringify(stateToSave));
            console.log('[StateManager] State saved successfully');
        } catch (error) {
            console.error('[StateManager] Error saving state:', error);
        }
    }
    
    /**
     * Update a specific property in the state
     * @param {String} property - Property name to update
     * @param {*} value - New value for the property
     */
    updateState(property, value) {
        if (this.assessment.state.hasOwnProperty(property)) {
            this.assessment.state[property] = value;
            console.log(`[StateManager] Updated state property: ${property}`);
        } else {
            console.warn(`[StateManager] Attempted to update unknown property: ${property}`);
        }
    }
    
    /**
     * Clear saved state from localStorage
     */
    clearState() {
        localStorage.removeItem(this.localStorageKey);
        console.log('[StateManager] State cleared');
    }
}
```

### Key Features

- **Persistent Storage**: Uses localStorage to save and retrieve progress
- **State Initialization**: Creates initial state structure or loads from storage
- **State Updates**: Provides methods to update state properties
- **State Retrieval**: Gets complete or partial state
- **State Clearing**: Removes saved state when needed
- **Age Management**: Tracks state age and handles expiration

### State Structure

The core state structure includes properties specific to the assessment type. For the agency assessment, the state includes:

```javascript
{
  // Navigation state
  currentStep: 'step-id',        // Current active step
  
  // User input data
  answers: {                     // User's answers to questions
    'question1': 5,              // Scale question example (1-5)
    'question2': 'yes',          // Boolean question example
    'question3': 'option2'       // Multiple choice question example
  },
  selectedAgencyType: 'creative', // Selected agency type (for agency assessment)
  selectedServices: ['creative', 'content'], // Selected services
  serviceRevenue: {              // Revenue allocation per service
    'creative': 60,              // 60% of revenue from creative
    'content': 40                // 40% of revenue from content
  },
  revenue: 1500000,              // Total revenue ($1.5M)
  email: 'user@example.com',     // User's email
  name: 'John Smith',            // User's name
  
  // Step-specific state
  currentQuestionIndex: 0,       // Current question index (for questions step)
  filteredQuestions: [],         // Questions filtered by selected services
  
  // Results state
  results: {                    // Assessment results
    scores: {                   // Assessment scores
      overall: 72,              // Overall score
      dimensions: {             // Dimension scores
        ai_readiness: 65,       // AI readiness score
        operational: 75,        // Operational score
        financial: 80           // Financial score
      },
      services: {               // Service-specific scores
        creative: { ai: 60 },   // Creative service AI score
        content: { ai: 70 }     // Content service AI score
      }
    },
    recommendations: {          // Generated recommendations
      serviceRecommendations: [],// Service-specific recommendations
      operationalRecommendations: [], // Operational recommendations
      financialRecommendations: [] // Financial recommendations
    },
    financialImpact: {          // Financial impact calculations
      valuationMultiple: 2.5,    // Current valuation multiple
      valuationEstimate: 3750000 // Estimated valuation
    }
  },
  
  // Metadata
  savedAt: 1622548800000        // Timestamp when state was last saved
}
```

### State Interactions

The StateManager interacts with other components in several key ways:

#### 1. Assessment Initialization

During assessment initialization, the state is loaded or created:

```javascript
export class AgencyAssessment extends AssessmentBase {
    constructor(config, container) {
        super(config, container);
        
        // Initialize state manager
        this.stateManager = new StateManager(this);
        
        // Load or initialize state
        this.state = this.stateManager.initializeState(this.initializeState());
        
        // Other initialization...
    }
    
    initializeState() {
        return {
            currentStep: this.config.steps[0],
            answers: {},
            selectedAgencyType: null,
            // Other initial state properties...
        };
    }
}
```

#### 2. Step Validation and Navigation

When validating user input and navigating between steps, state is updated and saved:

```javascript
validate() {
    // Validate user input
    const input = document.getElementById('email-input').value;
    
    if (!input || !input.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        document.getElementById('email-error').style.display = 'block';
        return false;
    }
    
    // Update state with validated input
    this.assessment.state.email = input;
    
    // Save state to localStorage
    this.assessment.stateManager.saveState();
    
    return true;
}
```

#### 3. Dynamic State Updates

When user makes selections or changes, state is updated incrementally:

```javascript
handleServiceSelection(event) {
    const serviceId = event.target.value;
    const isChecked = event.target.checked;
    
    // Update selected services array
    if (isChecked) {
        // Add service if not already selected
        if (!this.assessment.state.selectedServices.includes(serviceId)) {
            this.assessment.state.selectedServices.push(serviceId);
        }
    } else {
        // Remove service if selected
        this.assessment.state.selectedServices = 
            this.assessment.state.selectedServices.filter(id => id !== serviceId);
    }
    
    // Update state immediately
    this.assessment.stateManager.updateState(
        'selectedServices', 
        this.assessment.state.selectedServices
    );
    
    // Save complete state
    this.assessment.stateManager.saveState();
}
```

### State Persistence

State is saved to localStorage after each significant update, allowing users to resume their assessment later:

1. **Automatic Saving**: State is automatically saved after each step navigation
2. **Incremental Updates**: Key user actions trigger state updates and saves
3. **Timestamping**: Each save includes a timestamp for age management
4. **Expiration Management**: Saved state can expire after a configurable period

### State Recovery

When a user returns to the assessment, the previous state is recovered:

```javascript
// In the main initialization code
document.addEventListener('DOMContentLoaded', function() {
    const container = document.getElementById('assessment-container');
    const config = { /* assessment configuration */ };
    
    // Create assessment - state will be loaded from localStorage if available
    const assessment = AssessmentFactory.createAssessment('agency', config, container);
    
    // State recovery is handled automatically by the StateManager
    assessment.start();
});
```

### Best Practices for State Management

1. **Single Source of Truth**: All components should access and modify state through the StateManager
2. **Immutable Updates**: Treat state as immutable and create new objects when updating
3. **Validation Before Persistence**: Always validate state before saving
4. **Error Handling**: Implement robust error handling for localStorage operations
5. **Clear on Completion**: Provide option to clear state when assessment is completed
6. **State Versioning**: Include version information in saved state for future compatibility

## Assessment Types

The framework currently supports multiple assessment types, each extending the base assessment class:

### Agency Assessment

Focused on digital agencies, this assessment evaluates agency readiness for AI integration and M&A valuation. It includes:

- Agency type selection
- Service offering selection
- Revenue allocation
- Dimension-based questionnaire
- AI readiness scoring
- Valuation metrics
- Service-specific recommendations

#### Agency Assessment Implementation

The `AgencyAssessment` class implements the agency-specific assessment:

```javascript
export class AgencyAssessment extends AssessmentBase {
    constructor(config, container) {
        super(config, container);
        this.type = 'agency';
        this.scoringEngine = new AgencyScoringEngine(config);
        this.valuationDashboard = new ValuationDashboard(config);
        
        // Create step instances
        this.steps = {
            'agency-type': new AgencyTypeStep(this),
            'services': new ServicesStep(this),
            'questions': new QuestionsStep(this),
            'email': new EmailStep(this),
            'results': new ResultsStep(this)
        };
    }
    
    initializeState() {
        return {
            currentStep: this.config.steps[0],
            answers: {},
            selectedAgencyType: null,
            selectedServices: [],
            serviceRevenue: {}, // revenue allocation per service
            revenue: 0,
            email: '',
            name: '',
            currentQuestionIndex: 0,
            filteredQuestions: [],
            results: null
        };
    }
    
    calculateResults() {
        // Agency-specific results calculation
        try {
            const assessmentData = this.getAssessmentData();
            const questions = this.getQuestionsForSelectedServices();
            
            // Calculate scores
            const scores = this.scoringEngine.calculateScores(assessmentData.answers, questions);
            
            // Calculate financial impact
            const financialImpact = this.calculateFinancialImpact(
                scores.overall, 
                scores.dimensions
            );
            
            // Generate recommendations
            const recommendations = this.valuationDashboard.generateRecommendations({
                scores,
                services: assessmentData.selectedServices,
                revenue: assessmentData.revenue,
                agencyType: assessmentData.selectedAgencyType
            });
            
            return {
                scores,
                financialImpact,
                recommendations,
                assessmentData
            };
        } catch (error) {
            console.error('[AgencyAssessment] Error calculating results:', error);
            return this.getFallbackResults();
        }
    }
}
```

#### Agency Assessment Configuration

The agency assessment is configured with:

- **Steps**: Defines the sequence of steps (`agency-type`, `services`, `questions`, etc.)
- **Agency Types**: Different types of agencies with specific attributes
- **Services**: Available services that agencies can offer
- **Questions**: Assessment questions grouped by dimension
- **Scoring**: Weight configurations for dimensions and questions

```javascript
const agencyAssessmentConfig = {
    type: 'agency',
    steps: ['agency-type', 'services', 'questions', 'email', 'results'],
    agencyTypes: [
        { id: 'creative', name: 'Creative Agency', description: '...' },
        { id: 'digital', name: 'Digital Agency', description: '...' },
        // More agency types...
    ],
    services: [
        { id: 'creative', name: 'Creative Services', description: '...' },
        { id: 'content', name: 'Content Development', description: '...' },
        // More services...
    ],
    questions: [
        {
            id: 'ai_knowledge',
            text: 'How would you rate your team\'s knowledge of AI tools?',
            dimension: 'ai_readiness',
            type: 'scale',
            options: [
                { value: 1, label: 'Very Low' },
                { value: 3, label: 'Average' },
                { value: 5, label: 'Very High' }
            ]
        },
        // More questions...
    ],
    scoring: {
        dimensions: {
            ai_readiness: 3,
            operational: 2,
            financial: 2
        }
    }
};

### Question Types

The assessment framework supports multiple question types:

#### Scale Questions

```javascript
// Scale question configuration
{
    id: 'q1',
    text: 'How mature is your AI strategy?',
    type: 'scale',
    dimension: 'ai_readiness',
    min: 1,
    max: 5,
    labels: {
        1: 'Not started',
        3: 'In progress',
        5: 'Advanced'
    },
    // No service requirements - shown to all users
    requiredServices: []
}
```

#### Multiple Choice Questions

```javascript
// Multiple choice question
{
    id: 'q2',
    text: 'Which AI technologies are you currently using?',
    type: 'multiple-choice',
    dimension: 'operational',
    options: [
        { value: 'generative', label: 'Generative AI' },
        { value: 'predictive', label: 'Predictive Analytics' },
        { value: 'nlp', label: 'Natural Language Processing' },
        { value: 'none', label: 'None of the above' }
    ],
    multiSelect: true,
    // Only shown to users who selected creative or content services
    requiredServices: ['creative', 'content']
}
```

#### Boolean Questions

```javascript
// Boolean question
{
    id: 'q3',
    text: 'Do you have a dedicated AI budget?',
    type: 'boolean',
    dimension: 'financial',
    // Only shown to users who selected paid-media service
    requiredServices: ['paid-media']
}
```

### Question Filtering Mechanism

The assessment framework dynamically filters questions based on the services selected by the user, ensuring that each user only sees questions relevant to their specific business context.

#### How Question Filtering Works

1. **Service Selection**: User selects services in the Services Step
2. **Question Filtering**: When entering the Questions Step, questions are filtered based on selected services
3. **Filtered List Storage**: The IDs of applicable questions are stored in `state.filteredQuestions`
4. **Navigation**: User navigates only through the filtered question set

```javascript
// QuestionsStep.onEnter() - Called when entering the Questions Step
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

#### Using Filtered Questions

Filtered questions are used throughout the assessment workflow:

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

// In score calculation, only filtered questions are considered
calculateDimensionScores(state, scores) {
    const { answers, filteredQuestions } = state;
    
    // Process each question that was shown to the user
    (filteredQuestions || []).forEach(questionId => {
        const question = this.getQuestionById(questionId);
        // Scoring logic...
    });
}
```

#### Benefits of Question Filtering

- **Personalized Experience**: Users only see questions relevant to their business
- **Reduced Assessment Time**: Fewer questions lead to higher completion rates
- **More Accurate Results**: Targeted questions produce more meaningful data
- **Scalable Assessment**: New services can be added without creating multiple assessments

### In-house Assessment
{{ ... }}

Designed for in-house marketing teams, this assessment evaluates organizational readiness for AI adoption. It includes:

- Team structure assessment
- Capability evaluation
- Operational maturity assessment
- Integration recommendations

#### In-house Assessment Implementation

The `InhouseAssessment` class follows a similar pattern to the agency assessment but with different steps and scoring focused on internal team evaluation:

```javascript
export class InhouseAssessment extends AssessmentBase {
    constructor(config, container) {
        super(config, container);
        this.type = 'inhouse';
        this.scoringEngine = new InhouseScoringEngine(config);
        
        // Create step instances for in-house assessment
        this.steps = {
            'team-structure': new TeamStructureStep(this),
            'capabilities': new CapabilitiesStep(this),
            'tools': new ToolsStep(this),
            'questions': new QuestionsStep(this),
            'results': new ResultsStep(this)
        };
    }
    
    initializeState() {
        return {
            currentStep: this.config.steps[0],
            answers: {},
            teamSize: 0,
            capabilities: [],
            tools: [],
            budget: 0,
            currentQuestionIndex: 0,
            results: null
        };
    }
    
    // In-house specific methods...
}
```

### Extending with New Assessment Types

To add a new assessment type, follow these detailed steps:

#### 1. Create Assessment Class

Create a new class that extends `AssessmentBase`:

```javascript
export class NewAssessmentType extends AssessmentBase {
    constructor(config, container) {
        super(config, container);
        this.type = 'new-type';
        this.scoringEngine = new CustomScoringEngine(config);
        
        // Register steps
        this.steps = {
            'step-one': new StepOneImplementation(this),
            'step-two': new StepTwoImplementation(this),
            // Additional steps...
            'results': new ResultsStep(this)
        };
    }
    
    initializeState() {
        return {
            currentStep: this.config.steps[0],
            answers: {},
            // Type-specific state properties
            customProperty: null,
            results: null
        };
    }
    
    calculateResults() {
        // Custom results calculation
        try {
            const answers = this.state.answers;
            const scores = this.scoringEngine.calculateScores(answers);
            
            return {
                scores,
                // Additional result properties
            };
        } catch (error) {
            console.error('[NewAssessment] Error calculating results:', error);
            return { scores: { overall: 0 } };
        }
    }
    
    // Additional methods specific to this assessment type
}
```

#### 2. Create Step Implementations

Implement each step for the new assessment type:

```javascript
export class StepOneImplementation extends StepBase {
    constructor(assessment) {
        super(assessment);
        this.validationRules = {
            // Define validation rules
        };
    }
    
    render() {
        // Return HTML for this step
    }
    
    validate() {
        // Validate user input
    }
    
    // Additional step methods
}
```

#### 3. Create Scoring Logic

Implement custom scoring for the new assessment type:

```javascript
export class CustomScoringEngine extends ScoringBase {
    calculateOverallScore(dimensionScores) {
        // Custom overall score calculation
    }
    
    calculateDimensionScore(answers, questions) {
        // Custom dimension score calculation
    }
}
```

#### 4. Register with Assessment Factory

Add the new assessment type to the `AssessmentFactory`:

```javascript
// Import the new assessment type
import { NewAssessmentType } from './assessments/new-type/new-assessment.js';

// Add to the assessment types registry
AssessmentFactory.assessmentTypes['new-type'] = NewAssessmentType;

// Alternatively, use the registration method
AssessmentFactory.registerAssessmentType('new-type', NewAssessmentType);
```

#### 5. Create Configuration

Define the configuration for the new assessment type:

```javascript
const newAssessmentConfig = {
    type: 'new-type',
    steps: ['step-one', 'step-two', 'results'],
    // Additional configuration properties
    customProperty: 'value',
    questions: [
        // Assessment questions
    ],
    scoring: {
        // Scoring configuration
    }
};

// Initialize the new assessment
const newAssessment = AssessmentFactory.createAssessment(
    'new-type', 
    newAssessmentConfig, 
    document.getElementById('assessment-container')
);
```

## Step Implementation

Steps are the building blocks of the assessment flow, with each step focusing on collecting specific information and guiding the user through the assessment process.

### Step Lifecycle

Each step in the assessment follows a consistent lifecycle:

1. **Initialization**: Step is instantiated with a reference to its parent assessment
2. **Rendering**: Step generates its HTML content when the assessment requests it
3. **Event Setup**: After rendering, event listeners are set up for user interactions
4. **Validation**: User input is validated when attempting to navigate away
5. **Navigation**: Lifecycle hooks (onNext/onPrevious) are called during navigation
6. **Cleanup**: Event listeners are removed when leaving the step

### Common Step Structure

All steps extend the `StepBase` class and implement these core methods:

```javascript
export class StepBase {
    constructor(assessment) {
        this.assessment = assessment;
        this.validationRules = {};
    }
    
    render() { 
        // Generate and return HTML for the step
        throw new Error('Must implement render'); 
    }
    
    validate() { 
        // Validate user input, return true if valid
        throw new Error('Must implement validate'); 
    }
    
    setupEventListeners(container) {
        // Set up event listeners for user interactions
    }
    
    cleanupEventListeners() {
        // Remove event listeners when leaving the step
    }
    
    onNext() { 
        // Actions to perform before moving to the next step
        return true; 
    }
    
    onPrevious() { 
        // Actions to perform before moving to the previous step
        return true; 
    }
}
```

### Concrete Step Implementation Example

Here's an example of a concrete step implementation (simplified version of the AgencyTypeStep):

```javascript
export class AgencyTypeStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        
        // Define validation rules
        this.validationRules = {
            selectedAgencyType: [
                { type: 'required', message: 'Please select an agency type' }
            ]
        };
        
        this.cleanupListeners = [];
    }
    
    render() {
        const { selectedAgencyType } = this.assessment.state;
        const agencyTypes = this.assessment.config.agencyTypes || [];
        
        return `
            <div class="assessment-step agency-type-step">
                <h2>Select Your Agency Type</h2>
                <p>Choose the option that best describes your agency:</p>
                
                <div class="agency-types">
                    ${agencyTypes.map(type => `
                        <div class="agency-type-option">
                            <input type="radio" 
                                id="agency-type-${type.id}" 
                                name="agency-type" 
                                value="${type.id}" 
                                ${selectedAgencyType === type.id ? 'checked' : ''}
                            />
                            <label for="agency-type-${type.id}">
                                <div class="agency-type-name">${type.name}</div>
                                <div class="agency-type-description">${type.description}</div>
                            </label>
                        </div>
                    `).join('')}
                </div>
                
                <div id="agency-type-error" class="error-message" style="display: none;">
                    Please select an agency type to continue
                </div>
                
                <div class="step-navigation">
                    <button id="next-button" class="btn btn-primary btn-next">Next</button>
                </div>
            </div>
        `;
    }
    
    setupEventListeners(container) {
        const nextButton = container.querySelector('#next-button');
        
        const handleNext = (e) => {
            e.preventDefault();
            if (this.validate()) {
                this.onNext();
                this.assessment.nextStep();
            }
        };
        
        nextButton.addEventListener('click', handleNext);
        
        // Store cleanup function
        this.cleanupListeners.push(() => {
            nextButton.removeEventListener('click', handleNext);
        });
    }
    
    validate() {
        const selectedAgencyType = document.querySelector('input[name="agency-type"]:checked');
        const errorElement = document.getElementById('agency-type-error');
        
        // Clear previous error
        if (errorElement) {
            errorElement.style.display = 'none';
        }
        
        // Check if an agency type is selected
        if (!selectedAgencyType) {
            if (errorElement) {
                errorElement.style.display = 'block';
            }
            return false;
        }
        
        // Save selected agency type to assessment state
        this.assessment.state.selectedAgencyType = selectedAgencyType.value;
        this.assessment.stateManager.saveState();
        
        return true;
    }
    
    cleanupEventListeners() {
        // Execute all cleanup functions
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
    
    onNext() {
        console.log('[AgencyTypeStep] Moving to next step');
        this.cleanupEventListeners();
        return true;
    }
    
    onPrevious() {
        console.log('[AgencyTypeStep] Moving to previous step');
        this.cleanupEventListeners();
        return true;
    }
}
```

### Agency Assessment Steps

The agency assessment includes the following steps, each with specific responsibilities:

1. **Agency Type Step**: 
   - Collects the type of agency (creative, digital, integrated, etc.)
   - Updates assessment state with selected agency type
   - Simple radio button selection interface

2. **Services Step**: 
   - Gathers services offered by the agency
   - Collects revenue allocation across services using sliders
   - Captures total agency revenue
   - Uses custom ServicesSelector component

3. **Questions Step**: 
   - Presents questions based on selected services
   - Dynamically filters questions relevant to selected services
   - Supports multiple question types (scale, multiple-choice, boolean)
   - Tracks progress through question set

4. **Email Step**: 
   - Collects user contact information
   - Validates email format
   - Optionally collects name and consent for marketing
   - Prepares data for external integrations (future HubSpot connection)

5. **Results Step**: 
   - Displays assessment results and recommendations
   - Initializes valuation dashboard
   - Provides export options
   - Shows targeted next steps

### Step Navigation

The `NavigationController` manages movement between steps with validation and state management:

```javascript
export class NavigationController {
    constructor(assessment) {
        this.assessment = assessment;
    }
    
    nextStep() {
        // Validate current step before proceeding
        if (!this.assessment.validateCurrentStep()) {
            return false;
        }
        
        const currentStepIndex = this.assessment.config.steps.indexOf(
            this.assessment.state.currentStep
        );
        
        if (currentStepIndex < this.assessment.config.steps.length - 1) {
            // Get the next step ID from the config
            const nextStep = this.assessment.config.steps[currentStepIndex + 1];
            
            // Update state with new step
            this.assessment.state.currentStep = nextStep;
            
            // Render the new step
            this.assessment.renderCurrentStep();
            return true;
        }
        
        return false;
    }
    
    previousStep() {
        const currentStepIndex = this.assessment.config.steps.indexOf(
            this.assessment.state.currentStep
        );
        
        if (currentStepIndex > 0) {
            // Get the previous step ID from the config
            const prevStep = this.assessment.config.steps[currentStepIndex - 1];
            
            // Get the step instance
            const stepInstance = this.assessment.steps[this.assessment.state.currentStep];
            
            // Call onPrevious lifecycle hook if implemented
            if (stepInstance && typeof stepInstance.onPrevious === 'function') {
                if (!stepInstance.onPrevious()) {
                    return false;
                }
            }
            
            // Update state with new step
            this.assessment.state.currentStep = prevStep;
            
            // Render the new step
            this.assessment.renderCurrentStep();
            return true;
        }
        
        return false;
    }
    
    goToStep(stepId) {
        // Validate current step before jumping
        if (!this.assessment.validateCurrentStep()) {
            return false;
        }
        
        if (this.assessment.config.steps.includes(stepId)) {
            // Update state with new step
            this.assessment.state.currentStep = stepId;
            
            // Render the new step
            this.assessment.renderCurrentStep();
            return true;
        }
        
        return false;
    }
}
```

### Step Customization Techniques

#### Adding Custom Validation Rules

```javascript
constructor(assessment) {
    super(assessment);
    
    this.validationRules = {
        email: [
            { type: 'required', message: 'Email is required' },
            { 
                type: 'pattern', 
                pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                message: 'Please enter a valid email address' 
            }
        ],
        name: [
            { type: 'minLength', length: 2, message: 'Name must be at least 2 characters' }
        ]
    };
}
```

#### Creating Dynamic Step Content

Steps can dynamically adjust their content based on assessment state:

```javascript
render() {
    // Get relevant state
    const { selectedAgencyType, selectedServices } = this.assessment.state;
    
    // Customize content based on state
    let customContent = '';
    
    if (selectedAgencyType === 'creative') {
        customContent = '<div class="creative-specific-content">...</div>';
    } else if (selectedAgencyType === 'digital') {
        customContent = '<div class="digital-specific-content">...</div>';
    }
    
    // Render step with conditional content
    return `
        <div class="assessment-step custom-step">
            <h2>Custom Step for ${this.assessment.getAgencyTypeName()}</h2>
            
            ${customContent}
            
            <div class="selected-services">
                <h3>Your Selected Services:</h3>
                <ul>
                    ${selectedServices.map(service => `
                        <li>${this.getServiceName(service)}</li>
                    `).join('')}
                </ul>
            </div>
            
            ${this.renderNavigation()}
        </div>
    `;
}
```

#### Creating Reusable Step Components

For complex UI elements used across multiple steps, create reusable components:

```javascript
renderServiceSelector(services, selectedServices, serviceRevenue) {
    return `
        <div class="service-selector">
            ${services.map(service => `
                <div class="service-option ${selectedServices.includes(service.id) ? 'selected' : ''}">
                    <div class="service-header">
                        <input type="checkbox" 
                            id="service-${service.id}" 
                            value="${service.id}" 
                            ${selectedServices.includes(service.id) ? 'checked' : ''}
                        />
                        <label for="service-${service.id}">${service.name}</label>
                    </div>
                    
                    <div class="service-allocation">
                        <input type="range" 
                            class="service-slider" 
                            data-service="${service.id}" 
                            min="0" max="100" step="1" 
                            value="${serviceRevenue[service.id] || 0}"
                        />
                        <div class="allocation-value">
                            <span class="value">${serviceRevenue[service.id] || 0}</span>%
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}
```

## Scoring System

The scoring system evaluates assessment responses to generate meaningful metrics that drive recommendations and valuation calculations.

### Scoring Structure

- **Overall Score**: Aggregate assessment score (0-100)
- **Dimension Scores**: Scores for specific dimensions (e.g., AI readiness, operations, finance)
- **Service Scores**: Service-specific scores (for agency assessment)

### Core Scoring Components

The scoring system is built around these key classes:

1. **ScoringBase**: Abstract base class with core scoring functionality
2. **AgencyScoringEngine**: Agency-specific implementation for agency valuation
3. **InhouseScoringEngine**: In-house team implementation focusing on AI readiness

### Scoring Base Implementation

The `ScoringBase` class provides the foundation for all scoring calculations:

```javascript
export class ScoringBase {
    constructor(config) {
        this.config = config;
        this.weights = this.config.weights || {};
    }
    
    // Abstract methods that must be implemented by child classes
    calculateOverallScore(dimensionScores) { 
        throw new Error('Must implement calculateOverallScore');
    }
    
    calculateDimensionScore(answers, questions) { 
        throw new Error('Must implement calculateDimensionScore');
    }
    
    // Common method to calculate all dimension scores
    calculateDimensionScores(answers, questions) {
        const dimensionScores = {};
        
        // Group questions by dimension
        const questionsByDimension = this.groupQuestionsByDimension(questions);
        
        // Calculate score for each dimension
        Object.keys(questionsByDimension).forEach(dimension => {
            dimensionScores[dimension] = this.calculateDimensionScore(
                answers, 
                questionsByDimension[dimension]
            );
        });
        
        return dimensionScores;
    }
    
    // Helper method to group questions by dimension
    groupQuestionsByDimension(questions) {
        const questionsByDimension = {};
        
        questions.forEach(question => {
            const dimension = question.dimension;
            
            if (!questionsByDimension[dimension]) {
                questionsByDimension[dimension] = [];
            }
            
            questionsByDimension[dimension].push(question);
        });
        
        return questionsByDimension;
    }
    
    // Get the weight for a dimension
    getDimensionWeight(dimension) {
        if (this.weights.dimensions && this.weights.dimensions[dimension] !== undefined) {
            return this.weights.dimensions[dimension];
        }
        return 1; // Default weight
    }
    
    // Get the weight for a question
    getQuestionWeight(question) {
        if (question.weight !== undefined) {
            return question.weight;
        }
        return 1; // Default weight
    }
}
```

### Agency Scoring Implementation

The `AgencyScoringEngine` extends the base class with agency-specific scoring logic:

```javascript
export class AgencyScoringEngine extends ScoringBase {
    // Calculate scores across all dimensions
    calculateScores(answers, questions) {
        // Calculate dimension scores
        const dimensionScores = this.calculateDimensionScores(answers, questions);
        
        // Calculate overall score based on dimension scores
        const overallScore = this.calculateOverallScore(dimensionScores);
        
        // Calculate service-specific scores if applicable
        const serviceScores = this.calculateServiceScores(answers, questions);
        
        return {
            overall: overallScore,
            dimensions: dimensionScores,
            services: serviceScores
        };
    }
    
    // Calculate overall score using weighted average of dimensions
    calculateOverallScore(dimensionScores) {
        let totalWeight = 0;
        let weightedSum = 0;
        
        // Calculate weighted sum of dimension scores
        Object.keys(dimensionScores).forEach(dimension => {
            const weight = this.getDimensionWeight(dimension);
            totalWeight += weight;
            weightedSum += dimensionScores[dimension] * weight;
        });
        
        // Return weighted average, rounded to 1 decimal place
        return totalWeight > 0 ? 
            Math.round((weightedSum / totalWeight) * 10) / 10 : 0;
    }
    
    // Calculate score for a specific dimension
    calculateDimensionScore(answers, questions) {
        if (!questions || !questions.length) return 0;
        
        let totalPoints = 0;
        let totalPossiblePoints = 0;
        
        // Calculate points for each question in the dimension
        questions.forEach(question => {
            const answer = answers[question.id];
            if (answer !== undefined) {
                const weight = this.getQuestionWeight(question);
                const points = this.getAnswerPoints(answer, question);
                const maxPoints = this.getMaxPoints(question);
                
                totalPoints += points * weight;
                totalPossiblePoints += maxPoints * weight;
            }
        });
        
        // Convert to percentage (0-100)
        return totalPossiblePoints > 0 ? 
            Math.round((totalPoints / totalPossiblePoints) * 100) : 0;
    }
    
    // Calculate service-specific scores
    calculateServiceScores(answers, questions) {
        // Group questions by service
        const serviceScores = {};
        const serviceQuestions = this.groupQuestionsByService(questions);
        
        // Calculate AI readiness score for each service
        Object.keys(serviceQuestions).forEach(service => {
            const serviceQs = serviceQuestions[service];
            const aiQuestions = serviceQs.filter(q => q.dimension === 'ai_readiness');
            
            if (aiQuestions.length > 0) {
                // Calculate AI readiness score for this service
                const aiScore = this.calculateDimensionScore(answers, aiQuestions);
                
                if (!serviceScores[service]) {
                    serviceScores[service] = {};
                }
                
                serviceScores[service].ai = aiScore;
            }
        });
        
        return serviceScores;
    }
    
    // Helper to group questions by service
    groupQuestionsByService(questions) {
        const serviceQuestions = {};
        
        questions.forEach(question => {
            if (question.services && question.services.length) {
                question.services.forEach(service => {
                    if (!serviceQuestions[service]) {
                        serviceQuestions[service] = [];
                    }
                    serviceQuestions[service].push(question);
                });
            }
        });
        
        return serviceQuestions;
    }
    
    // Get points for an answer based on question type
    getAnswerPoints(answer, question) {
        switch (question.type) {
            case 'scale':
                // For scale questions, the answer is the score (1-5)
                return parseInt(answer) || 0;
                
            case 'multiple-choice':
                // For multiple choice, find the selected option's score
                const option = question.options.find(opt => opt.value === answer);
                return option ? (option.score || 0) : 0;
                
            case 'boolean':
                // For yes/no questions
                return answer === true || answer === 'yes' ? 1 : 0;
                
            default:
                return 0;
        }
    }
    
    // Get maximum possible points for a question
    getMaxPoints(question) {
        switch (question.type) {
            case 'scale':
                // Maximum value from options
                return Math.max(...question.options.map(opt => opt.value));
                
            case 'multiple-choice':
                // Maximum score from any option
                return Math.max(...question.options.map(opt => opt.score || 0));
                
            case 'boolean':
                return 1;
                
            default:
                return 0;
        }
    }
}
```

### Scoring Configuration

Scoring weights are configured in the assessment configuration:

```javascript
const scoringConfig = {
    weights: {
        dimensions: {
            ai_readiness: 3,    // AI readiness is weighted 3x
            operational: 2,     // Operational dimension is weighted 2x
            financial: 2,       // Financial dimension is weighted 2x
            governance: 1       // Governance dimension has standard weight
        }
    },
    thresholds: {
        // Score thresholds for recommendations
        lowScore: 40,   // 0-40 points
        midScore: 70    // 41-70 points (>70 is highScore)
    }
};
```

### Scoring Process Flow

1. **Question Grouping**: Questions are grouped by dimension using `groupQuestionsByDimension()`
2. **Answer Evaluation**: Each answer is evaluated based on question type using `getAnswerPoints()`
3. **Dimension Calculation**: Scores for each dimension are calculated with `calculateDimensionScore()`
4. **Weighting Application**: Dimension weights are applied using `getDimensionWeight()`
5. **Overall Calculation**: Overall score is calculated with `calculateOverallScore()`
6. **Service Scoring**: Service-specific scores are calculated with `calculateServiceScores()`

### Extending the Scoring System

To implement custom scoring logic:

1. Create a class that extends `ScoringBase`:

```javascript
export class CustomScoringEngine extends ScoringBase {
    // Override calculation methods with custom logic
    calculateOverallScore(dimensionScores) {
        // Custom calculation logic
    }
    
    calculateDimensionScore(answers, questions) {
        // Custom dimension scoring logic
    }
    
    // Add custom methods as needed
    calculateCustomMetric(answers, questions) {
        // Custom metric calculation
    }
}
```

2. Configure custom weights in your assessment configuration
3. Initialize your custom scoring engine in your assessment class

```javascript
constructor(config, container) {
    super(config, container);
    this.scoringEngine = new CustomScoringEngine(config);
}
```

## Recommendations Engine

The recommendations engine generates actionable insights based on assessment results:

### Recommendation Types

- **Service Recommendations**: Specific to selected services
- **Operational Recommendations**: Organizational and process improvements
- **Financial Recommendations**: Business model and financial structure changes

### Recommendation Generation

1. Assessment data is analyzed for scores and selected services
2. Service-specific recommendations are generated based on scores
3. Recommendations are categorized by timeframe (immediate, short-term, strategic)
4. Each recommendation includes title, description, complexity, and expected ROI

### Recommendation Configuration

The `service-recommendations.js` file contains detailed recommendation content:

- Organized by service type
- Separated by score ranges (low, mid, high)
- Categorized by implementation timeframe
- Includes agency-type variations where applicable

### Service Recommendations Implementation

The service recommendations system is the critical component that provides actionable, AI-focused insights based on the agency's service mix and assessment scores. It's implemented through two key files:

1. **service-recommendations.js**: Contains the recommendation content database
2. **recommendations-engine.js**: Processes assessment data to generate targeted recommendations

#### Recommendation Data Structure

The `ServiceRecommendations` object in `service-recommendations.js` follows a hierarchical structure:

```javascript
const ServiceRecommendations = {
  meta: { /* metadata about recommendations */ },
  services: {
    "service-id": {
      serviceName: "Human-Readable Service Name",
      riskLevel: "High/Medium/Low",
      disruptionTimeline: "YYYY-YYYY",
      
      lowScore: { // 0-40 points
        immediate: [{ /* recommendation objects */ }],
        shortTerm: [{ /* recommendation objects */ }],
        strategic: [{ /* recommendation objects */ }]
      },
      
      midScore: { /* similar structure for 40-70 points */ },
      highScore: { /* similar structure for 70-100 points */ }
    },
    // Additional services...
  },
  crossServiceOpportunities: [{ /* multi-service recommendations */ }],
  universal: { /* general recommendations for all agencies */ }
};
```

#### Recommendation Objects

Each recommendation object contains the following properties:

```javascript
{
  title: "Actionable recommendation title",
  description: "Detailed explanation of the recommendation",
  complexity: "low/medium/high",  // Implementation difficulty
  expectedROI: "Description of expected return",
  roiTimeframe: "immediate/shortTerm/longTerm",
  tools: [  // Optional array of recommended tools
    { name: "Tool Name", cost: "Cost info", bestFor: "Use case" }
  ],
  agencyTypeVariations: {  // Optional customizations by agency type
    "agency-type-id": "Custom advice for this agency type"
  },
  // Additional optional properties based on recommendation type
  training: "Training requirements",
  investment: "Required investment",
  metrics: ["Metrics to track"],
  resources: ["Helpful resources"]
}
```

#### Recommendation Engine Implementation

The `AgencyRecommendationsEngine` class in `recommendations-engine.js` handles the logic for matching the right recommendations to the agency based on their assessment data:

```javascript
generateServiceRecommendations(services, scores) {
  const recommendations = [];
  
  // Process each selected service
  services.forEach(service => {
    const serviceId = typeof service === 'object' ? service.id : service;
    const serviceConfig = this.recommendations.services[serviceId];
    
    if (serviceConfig) {
      // Get service score or use overall AI score as fallback
      const serviceScore = scores.services?.[serviceId]?.ai || 
                          scores.dimensions?.ai || 50;
      
      // Determine score category (low, mid, high)
      let scoreCategory = 'lowScore';
      if (serviceScore > 70) {
        scoreCategory = 'highScore';
      } else if (serviceScore > 40) {
        scoreCategory = 'midScore';
      }
      
      // Get recommendations for the score category
      const categoryRecommendations = serviceConfig[scoreCategory] || {};
      
      // Add recommendations for each timeframe
      ['immediate', 'shortTerm', 'strategic'].forEach(timeframe => {
        const timeframeRecs = categoryRecommendations[timeframe] || [];
        
        // Add each recommendation with metadata
        timeframeRecs.forEach(rec => {
          recommendations.push({
            service: serviceId,
            serviceName: serviceConfig.serviceName,
            timeframe,
            riskLevel: serviceConfig.riskLevel,
            disruptionTimeline: serviceConfig.disruptionTimeline,
            ...rec
          });
        });
      });
    }
  });
  
  return recommendations;
}
```

#### Integrating Recommendations in the Dashboard

The `ValuationDashboard` class renders these recommendations in the dashboard UI:

```javascript
renderServiceRecommendations(serviceRecommendations) {
  if (!serviceRecommendations || serviceRecommendations.length === 0) {
    return '<div class="no-recommendations">No service recommendations available.</div>';
  }
  
  // Group recommendations by timeframe
  const groupedRecommendations = {
    immediate: [],
    shortTerm: [],
    strategic: []
  };
  
  serviceRecommendations.forEach(rec => {
    const timeframe = rec.timeframe || 'immediate';
    if (groupedRecommendations[timeframe]) {
      groupedRecommendations[timeframe].push(rec);
    }
  });
  
  // Render recommendations by timeframe
  return Object.keys(groupedRecommendations).map(timeframe => {
    const recommendations = groupedRecommendations[timeframe];
    if (!recommendations.length) return '';
    
    return `
      <div class="recommendations-section">
        <h3 class="timeframe-heading">${this.formatTimeframe(timeframe)}</h3>
        <div class="recommendation-cards">
          ${recommendations.map(rec => this.renderRecommendationCard(rec)).join('')}
        </div>
      </div>
    `;
  }).join('');
}
```

#### Customizing and Extending Recommendations

To add or modify service recommendations:

1. **Add New Service Recommendations**:
   ```javascript
   ServiceRecommendations.services['new_service'] = {
     serviceName: "New Service Name",
     riskLevel: "Medium",
     disruptionTimeline: "2024-2027",
     lowScore: { /* recommendations for low scores */ },
     midScore: { /* recommendations for mid scores */ },
     highScore: { /* recommendations for high scores */ }
   };
   ```

2. **Modify Existing Recommendations**:
   ```javascript
   // Add a new recommendation to an existing service
   ServiceRecommendations.services['creative'].midScore.immediate.push({
     title: "New Recommendation",
     description: "Description of the recommendation",
     complexity: "medium",
     expectedROI: "Expected ROI description",
     roiTimeframe: "immediate"
   });
   ```

3. **Add Cross-Service Recommendations**:
   ```javascript
   ServiceRecommendations.crossServiceOpportunities.push({
     services: ["service1", "service2"],
     recommendation: "Combined recommendation title",
     description: "How these services can work together",
     expectedROI: "Combined ROI description"
   });
   ```

## Reporting and Dashboards

The assessment results are visualized through reporting dashboards that present scores, recommendations, and valuation metrics in an intuitive, actionable format.

### Valuation Dashboard

The agency assessment includes a valuation dashboard that presents:

- Overall valuation metrics
- Dimension-based scores with visualizations
- Service-specific recommendations
- Operational improvement opportunities
- Financial impact projections

### Valuation Calculation Formula

The assessment uses a specific formula to calculate agency valuation based on revenue, agency type, and AI readiness:

```javascript
// In ResultsStep.calculateFinancialImpact() method
calculateFinancialImpact(scores) {
    // Get revenue from state
    const revenue = this.assessment.state.revenue || 0;
    
    // Calculate base valuation multiple based on agency type and size
    const agencyType = this.assessment.state.selectedAgencyType;
    
    // Base multiples by agency type (industry standards)
    const baseMultiples = {
        'creative': 2.5,
        'digital': 2.7,
        'full-service': 2.3,
        'specialized': 2.8
    };
    
    // Get the base multiple for the selected agency type
    const baseMultiple = baseMultiples[agencyType] || 2.5; // Default to 2.5x
    
    // Calculate potential valuation multiple with AI improvements
    // The AI readiness score impacts the potential gain
    const aiReadinessScore = scores.dimensions.ai_readiness || 0;
    let aiMultipleBoost = 0;
    
    if (aiReadinessScore < 30) {
        // Low scores have highest potential for improvement: 0.5-0.7x boost
        aiMultipleBoost = 0.7;
    } else if (aiReadinessScore < 60) {
        // Medium scores: 0.3-0.5x boost
        aiMultipleBoost = 0.5;
    } else {
        // High scores: up to 0.3x boost
        aiMultipleBoost = 0.3;
    }
    
    // Calculate valuation metrics
    const valuationMultiple = baseMultiple;
    const potentialValuationMultiple = baseMultiple + aiMultipleBoost;
    
    const valuationEstimate = revenue * valuationMultiple;
    const potentialValuationEstimate = revenue * potentialValuationMultiple;
    const potentialValuationGain = potentialValuationEstimate - valuationEstimate;
    
    return {
        valuationMultiple,
        valuationEstimate,
        potentialValuationMultiple,
        potentialValuationEstimate,
        potentialValuationGain
    };
}
```

##### Valuation Formula Breakdown

1. **Base Valuation Multiple** (industry standard):
   - Creative Agencies: 2.5x revenue
   - Digital Agencies: 2.7x revenue
   - Full-Service Agencies: 2.3x revenue
   - Specialized Agencies: 2.8x revenue

2. **AI Impact on Valuation**:
   - Low AI readiness (0-30%): Up to 0.7x multiple increase potential
   - Medium AI readiness (30-60%): Up to 0.5x multiple increase potential
   - High AI readiness (60-100%): Up to 0.3x multiple increase potential

3. **Calculation Sequence**:
   - Current Valuation = Revenue × Base Multiple
   - Potential Valuation = Revenue × (Base Multiple + AI Multiple Boost)
   - Potential Gain = Potential Valuation - Current Valuation

The ValuationDashboard class handles the presentation of assessment results:

```javascript
export class ValuationDashboard {
    constructor(config) {
        this.config = config;
        this.recommendationsEngine = new AgencyRecommendationsEngine(config);
    }
    
    /**
     * Generate the dashboard HTML
     * @param {Object} results - Assessment results
     * @return {String} - Dashboard HTML
     */
    render(results) {
        if (!results) {
            return '<div class="dashboard-error">No results available</div>';
        }
        
        try {
            return `
                <div class="valuation-dashboard">
                    <div class="dashboard-header">
                        <h2>Agency Valuation Dashboard</h2>
                    </div>
                    
                    <div class="dashboard-summary">
                        ${this.renderSummary(results)}
                    </div>
                    
                    <div class="dashboard-metrics">
                        ${this.renderMetrics(results)}
                    </div>
                    
                    <div class="dashboard-scores">
                        <h3>Dimension Scores</h3>
                        ${this.renderScoreBreakdown(results.scores)}
                    </div>
                    
                    <div class="dashboard-recommendations">
                        <h3>Service Recommendations</h3>
                        ${this.renderServiceRecommendations(results.recommendations.serviceRecommendations)}
                    </div>
                    
                    <div class="dashboard-financial">
                        <h3>Financial Impact</h3>
                        ${this.renderFinancialImpact(results.financialImpact)}
                    </div>
                </div>
            `;
        } catch (error) {
            console.error('[ValuationDashboard] Error rendering dashboard:', error);
            return `
                <div class="dashboard-error">
                    <h3>Error Rendering Dashboard</h3>
                    <p>There was a problem generating your dashboard. Please try again.</p>
                </div>
            `;
        }
    }
    
    /**
     * Generate recommendations based on assessment data
     * @param {Object} assessmentData - Assessment data including scores and services
     * @return {Object} - Generated recommendations
     */
    generateRecommendations(assessmentData) {
        return this.recommendationsEngine.generateRecommendations(assessmentData);
    }
    
    // Additional rendering methods...
}
```

### Key Dashboard Components

#### Score Visualization

Scores are visualized using circular progress indicators and bar charts:

```javascript
renderScoreBreakdown(scores) {
    if (!scores || !scores.dimensions) {
        return '<div class="no-scores">No dimension scores available</div>';
    }
    
    const dimensionScores = scores.dimensions;
    
    return `
        <div class="score-breakdown">
            <div class="overall-score">
                <div class="score-circle">
                    <svg viewBox="0 0 36 36">
                        <path class="circle-bg"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        <path class="circle"
                            stroke-dasharray="${Math.round(scores.overall)}, 100"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        <text x="18" y="20.35" class="percentage">${Math.round(scores.overall)}%</text>
                    </svg>
                    <div class="score-label">Overall Score</div>
                </div>
            </div>
            
            <div class="dimension-scores">
                ${Object.keys(dimensionScores).map(dimension => {
                    const score = dimensionScores[dimension];
                    return `
                        <div class="dimension-score">
                            <div class="dimension-name">${this.formatDimensionName(dimension)}</div>
                            <div class="score-bar-container">
                                <div class="score-bar" style="width: ${score}%"></div>
                                <div class="score-value">${Math.round(score)}%</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}
```

#### Recommendation Cards

Recommendations are presented as visual cards organized by timeframe:

```javascript
renderRecommendationCard(recommendation) {
    const complexityClass = `complexity-${recommendation.complexity || 'medium'}`;
    
    return `
        <div class="recommendation-card ${complexityClass}">
            <div class="recommendation-service">
                ${recommendation.serviceName}
                <span class="risk-level ${recommendation.riskLevel?.toLowerCase()}-risk">
                    ${recommendation.riskLevel} Risk
                </span>
            </div>
            
            <h4 class="recommendation-title">${recommendation.title}</h4>
            
            <div class="recommendation-description">
                ${recommendation.description}
            </div>
            
            <div class="recommendation-meta">
                <div class="complexity">
                    <span class="label">Complexity:</span>
                    <span class="value">${this.formatComplexity(recommendation.complexity)}</span>
                </div>
                
                <div class="roi">
                    <span class="label">Expected ROI:</span>
                    <span class="value">${recommendation.expectedROI}</span>
                </div>
            </div>
            
            ${recommendation.tools ? this.renderRecommendationTools(recommendation.tools) : ''}
        </div>
    `;
}

renderRecommendationTools(tools) {
    if (!tools || !tools.length) return '';
    
    return `
        <div class="recommendation-tools">
            <h5>Recommended Tools</h5>
            <ul>
                ${tools.map(tool => `
                    <li>
                        <strong>${tool.name}</strong>
                        ${tool.cost ? `<span class="tool-cost">${tool.cost}</span>` : ''}
                        ${tool.bestFor ? `<div class="tool-best-for">Best for: ${tool.bestFor}</div>` : ''}
                    </li>
                `).join('')}
            </ul>
        </div>
    `;
}
```

#### Financial Metrics

Financial impact and valuation metrics are displayed with clear explanations:

```javascript
renderFinancialImpact(financialImpact) {
    if (!financialImpact) {
        return '<div class="no-financial-impact">No financial impact data available</div>';
    }
    
    const {
        valuationMultiple,
        annualRevenue,
        valuationEstimate,
        potentialValueIncrease,
        aiReadinessImpact
    } = financialImpact;
    
    return `
        <div class="financial-impact">
            <div class="valuation-metrics">
                <div class="metric">
                    <div class="metric-label">Current Valuation Multiple</div>
                    <div class="metric-value">${valuationMultiple.toFixed(1)}x</div>
                </div>
                
                <div class="metric">
                    <div class="metric-label">Annual Revenue</div>
                    <div class="metric-value">$${this.formatNumber(annualRevenue)}</div>
                </div>
                
                <div class="metric highlight">
                    <div class="metric-label">Estimated Valuation</div>
                    <div class="metric-value">$${this.formatNumber(valuationEstimate)}</div>
                </div>
            </div>
            
            <div class="impact-projections">
                <h4>AI Readiness Impact</h4>
                <p>
                    Improving your AI readiness could increase your valuation multiple by 
                    <strong>${aiReadinessImpact.multipleIncrease.toFixed(1)}x</strong>, 
                    potentially adding 
                    <strong>$${this.formatNumber(potentialValueIncrease)}</strong> 
                    to your valuation.
                </p>
                
                <div class="impact-chart">
                    <!-- Chart visualization -->
                </div>
            </div>
        </div>
    `;
}

formatNumber(number) {
    // Format large numbers with commas
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
```

### Dashboard Customization

The dashboard can be customized in several ways:

1. **Theme Customization**: Modify CSS variables to change colors and styling
2. **Component Addition/Removal**: Add or remove dashboard sections
3. **Alternative Visualizations**: Swap in different chart libraries
4. **Custom Metrics**: Add new metrics or modify existing calculations

```javascript
// Example: Adding a custom dashboard section
render(results) {
    // ... existing code
    
    return `
        <div class="valuation-dashboard custom-theme">
            <!-- Existing sections -->
            
            <!-- Custom section -->
            <div class="dashboard-custom-section">
                <h3>Custom Metrics</h3>
                ${this.renderCustomMetrics(results)}
            </div>
        </div>
    `;
}

renderCustomMetrics(results) {
    // Custom metrics implementation
    return `
        <div class="custom-metrics">
            <!-- Custom visualization -->
        </div>
    `;
}
```

### Export Options

The dashboard provides several ways to export and share assessment results:

1. **JSON Download**: Complete assessment data as JSON
2. **PDF Export**: Formatted dashboard as PDF (planned feature)
3. **Email Sharing**: Send results via email (planned feature)
4. **Direct Link**: Shareable URL to results (planned with Firebase integration)

```javascript
downloadResults(results) {
    // Create a downloadable JSON file
    const dataStr = JSON.stringify(results, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    
    const fileName = `agency-assessment-results.json`;
    
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute('href', dataUri);
    downloadLink.setAttribute('download', fileName);
    downloadLink.style.display = 'none';
    
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
```

### Mobile Responsiveness

The dashboard is designed to be responsive across device sizes:

- **Fluid Layouts**: Using percentage-based widths and flex layouts
- **Breakpoints**: CSS media queries to adapt to different screen sizes
- **Component Stacking**: Elements stack vertically on smaller screens
- **Touch-Friendly**: Larger tap targets for mobile users

## Component Hierarchy

The framework uses a component-based architecture with clear relationships and dependencies between components:

```
AssessmentFactory
└── AssessmentBase
    ├── StateManager
    ├── NavigationController
    ├── ScoringBase
    │   ├── AgencyScoringEngine
    │   └── InhouseScoringEngine
    ├── Steps
    │   ├── StepBase
    │   │   ├── AgencyTypeStep
    │   │   ├── ServicesStep
    │   │   ├── QuestionsStep
    │   │   ├── EmailStep
    │   │   └── ResultsStep
    │   └── InhouseSteps
    │       ├── TeamStructureStep
    │       ├── CapabilitiesStep
    │       └── ToolsStep
    └── Reporting
        ├── ValuationDashboard
        └── RecommendationsEngine
```

### Component Relationships

#### Core Relationships

1. **AssessmentFactory → AssessmentBase**
   - Factory creates and configures assessment instances
   - Manages assessment type registration
   - Provides access to available assessment types

2. **AssessmentBase → StateManager**
   - Assessment owns the state manager
   - Delegates state persistence operations
   - Accesses saved state through the manager

3. **AssessmentBase → NavigationController**
   - Assessment owns the navigation controller
   - Delegates step navigation operations
   - Navigation controller validates steps before navigation

4. **AssessmentBase → Steps**
   - Assessment creates and maintains step instances
   - Delegates rendering to active step
   - Passes state updates between steps

5. **AssessmentBase → ScoringEngine**
   - Assessment creates the appropriate scoring engine
   - Delegates score calculation during results generation
   - Provides assessment data to scoring engine

### Component Interactions

The components interact through well-defined patterns:

#### Initialization Flow

```
Client Code → AssessmentFactory.createAssessment()
    ↓
AssessmentBase.constructor()
    ↓
StateManager.constructor()
NavigationController.constructor()
ScoringEngine.constructor()
    ↓
Step instances created
    ↓
Assessment.renderCurrentStep()
```

#### Navigation Flow

```
User action → Step.handleNext()
    ↓
Step.validate()
    ↓
Assessment.nextStep()
    ↓
NavigationController.nextStep()
    ↓
Assessment.renderCurrentStep()
```

#### State Update Flow

```
User input → Step.handleInput()
    ↓
Assessment.state updated
    ↓
StateManager.updateState()
    ↓
StateManager.saveState()
```

#### Results Calculation Flow

```
ResultsStep.render() → Assessment.calculateResults()
    ↓
Assessment.getAssessmentData()
    ↓
ScoringEngine.calculateScores()
    ↓
RecommendationsEngine.generateRecommendations()
    ↓
Results displayed in dashboard
```

### Component Communication

Components communicate through these primary mechanisms:

1. **Direct Method Calls**: Parent components call methods on child components
2. **State Updates**: Components read from and write to the shared assessment state
3. **Event System**: Components can emit and listen for events using the event manager
4. **Callbacks**: Step lifecycle methods (onNext, onPrevious) handle transitions

### Component Responsibilities

#### AssessmentFactory
- Create assessment instances
- Register new assessment types
- Provide access to available assessment types

#### AssessmentBase
- Initialize and manage assessment state
- Create and coordinate child components
- Handle step navigation through the navigation controller
- Calculate assessment results

#### StateManager
- Save and load assessment state
- Handle state persistence in localStorage
- Provide methods to update specific state properties

#### NavigationController
- Manage step navigation (next, previous, jump to step)
- Validate current step before navigation
- Update current step in assessment state

#### StepBase
- Render step content
- Validate user input
- Set up and clean up event listeners
- Handle step-specific logic

#### ScoringEngine
- Calculate overall and dimension scores
- Apply scoring rules and weights
- Generate service-specific scores

#### RecommendationsEngine
- Generate service recommendations based on scores
- Create operational and financial recommendations
- Apply agency type variations to recommendations

## Best Practices

### Architecture and Design Patterns

#### Follow Component Hierarchy

Maintain the established component hierarchy to ensure proper separation of concerns:

```javascript
// GOOD: Extending the base class
export class CustomStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        // Custom initialization
    }
    
    // Override base methods
    render() { /* ... */ }
    validate() { /* ... */ }
}

// BAD: Creating standalone components without extending base classes
export class CustomStep {
    constructor(assessment) {
        this.assessment = assessment;
        // Missing important base functionality
    }
    
    // Missing required lifecycle methods
}
```

#### Use Consistent Event Handling

Implement event handling using the centralized event management system:

```javascript
// GOOD: Using the event manager
import { addEvent } from '../../../shared/utils/event-manager.js';

setupEventListeners(container) {
    const button = container.querySelector('#action-button');
    
    this.cleanupListeners = [
        addEvent(button, 'click', this.handleClick.bind(this))
    ];
}

cleanupEventListeners() {
    this.cleanupListeners.forEach(cleanup => cleanup());
    this.cleanupListeners = [];
}

// BAD: Direct event binding without cleanup
setupEventListeners(container) {
    const button = container.querySelector('#action-button');
    button.addEventListener('click', this.handleClick.bind(this));
    // No cleanup tracking, potential memory leaks
}
```

#### Implement State Validation

Always validate state before saving or using it:

```javascript
// GOOD: Validate before saving
validate() {
    const email = document.getElementById('email-input').value;
    
    // Validate format
    if (!email || !email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        this.showError('Please enter a valid email address');
        return false;
    }
    
    // Save validated data
    this.assessment.state.email = email.trim();
    return true;
}

// BAD: Saving without validation
handleInput() {
    // Directly saving unvalidated input
    this.assessment.state.email = document.getElementById('email-input').value;
    this.assessment.stateManager.saveState();
}
```

### Adding New Features

#### Extending with New Steps

When adding new steps to an assessment:

1. Create a new step class that extends `StepBase`
2. Register the step in the assessment constructor
3. Update the steps array in the assessment configuration
4. Implement navigation to/from the new step

```javascript
// 1. Create the step class
export class NewFeatureStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        // Step initialization
    }
    
    // Implement required methods
    render() { /* ... */ }
    validate() { /* ... */ }
}

// 2. Register in the assessment constructor
constructor(config, container) {
    super(config, container);
    
    // Register the new step
    this.steps = {
        // Existing steps...
        'new-feature': new NewFeatureStep(this)
    };
}

// 3. Update the config steps array
const config = {
    steps: ['agency-type', 'services', 'new-feature', 'questions', 'email', 'results']
    // Other config...
};
```

#### Adding New Question Types

When adding new question types:

1. Update the question rendering in `QuestionsStep`
2. Add validation logic for the new question type
3. Implement scoring logic in the scoring engine

```javascript
// In QuestionsStep.renderQuestion()
renderQuestion(question) {
    switch (question.type) {
        // Existing question types...
        
        case 'rating':
            return this.renderRatingQuestion(question);
            
        default:
            console.warn(`Unknown question type: ${question.type}`);
            return '';
    }
}

// Add rendering method for the new type
renderRatingQuestion(question) {
    return `
        <div class="question rating-question">
            <h3>${question.text}</h3>
            <div class="rating-options">
                ${[1, 2, 3, 4, 5].map(value => `
                    <label class="rating-option">
                        <input type="radio" name="${question.id}" value="${value}" />
                        <span class="rating-value">${value}</span>
                    </label>
                `).join('')}
            </div>
        </div>
    `;
}

// In ScoringEngine.getAnswerPoints()
getAnswerPoints(answer, question) {
    switch (question.type) {
        // Existing question types...
        
        case 'rating':
            return parseInt(answer) || 0;
            
        default:
            return 0;
    }
}
```

### Debugging and Troubleshooting

#### Common Issues and Solutions

1. **State Not Persisting**

   Problem: User progress isn't saved between sessions.
   
   Solution: Check localStorage access and save calls:
   
   ```javascript
   // Add explicit error checking
   saveState() {
       try {
           const stateJSON = JSON.stringify(this.assessment.state);
           localStorage.setItem(this.localStorageKey, stateJSON);
           
           // Verify save worked
           const savedJSON = localStorage.getItem(this.localStorageKey);
           if (!savedJSON) {
               console.error('[StateManager] Failed to save state - cannot retrieve saved data');
           }
       } catch (error) {
           console.error('[StateManager] Error saving state:', error);
           
           // Check for quota exceeded error
           if (error.name === 'QuotaExceededError') {
               console.error('[StateManager] Storage quota exceeded - try clearing old data');
           }
       }
   }
   ```

2. **Data Structure Mismatches**

   Problem: Scoring or recommendations don't display correctly due to data structure changes.
   
   Solution: Ensure consistent data structures and add robust fallbacks:
   
   ```javascript
   // Add defensive access with defaults
   renderScores(scores) {
       // Use optional chaining and nullish coalescing for safety
       const overall = scores?.overall ?? 0;
       const dimensions = scores?.dimensions ?? {};
       
       return `
           <div class="scores-container">
               <div class="overall-score">${Math.round(overall)}%</div>
               <div class="dimension-scores">
                   ${Object.entries(dimensions).map(([dimension, score]) => `
                       <div class="dimension-score">
                           <span class="dimension-name">${this.formatDimension(dimension)}</span>
                           <span class="score-value">${Math.round(score)}%</span>
                       </div>
                   `).join('')}
               </div>
           </div>
       `;
   }
   ```

3. **Component Loading Issues**

   Problem: Components like `ServicesSelector.js` fail to load or register properly.
   
   Solution: Ensure proper script loading and add error detection:
   
   ```html
   <!-- Ensure components are loaded before use -->
   <script src="/shared/components/services-selector.js"></script>
   
   <script>
     // Check if component loaded properly
     document.addEventListener('DOMContentLoaded', function() {
       if (!window.ServicesSelector) {
         console.error('ServicesSelector component failed to load!');
         document.getElementById('error-container').textContent = 
           'Failed to load required components. Please refresh the page.';
       }
     });
   </script>
   ```

### Service Recommendations Best Practices

The service recommendations system is a critical component that provides tailored, actionable recommendations based on assessment data.

#### Data Structure Integrity

Maintain the nested structure in `service-recommendations.js`:

```javascript
// GOOD: Following the established structure
ServiceRecommendations.services['new-service'] = {
    serviceName: "New Service",
    riskLevel: "Medium",
    disruptionTimeline: "2024-2026",
    
    lowScore: {
        immediate: [{
            title: "Quick Win",
            description: "Easy implementation recommendation",
            complexity: "low",
            expectedROI: "15-20% efficiency improvement",
            roiTimeframe: "immediate"
        }],
        shortTerm: [/* ... */],
        strategic: [/* ... */]
    },
    midScore: {/* ... */},
    highScore: {/* ... */}
};

// BAD: Breaking the structure
ServiceRecommendations.services['new-service'] = {
    // Missing required properties like serviceName, riskLevel
    recommendations: [{  // Wrong structure
        title: "Quick Win",
        // Missing required properties like complexity, expectedROI
    }]
};
```

#### Recommendation Properties

Ensure all recommendations include the required properties:

- `title`: Clear, action-oriented title
- `description`: Detailed explanation
- `complexity`: Implementation difficulty (low/medium/high)
- `expectedROI`: Clear value proposition
- `roiTimeframe`: When to expect results

Optional but valuable properties:

- `tools`: Recommended tools with costs and benefits
- `agencyTypeVariations`: Type-specific advice
- `metrics`: Metrics to track for success

#### Testing Recommendations

Test recommendations with different score combinations:

```javascript
// Test function for recommendations
function testRecommendations() {
    const testCases = [
        { services: ['creative'], scores: { dimensions: { ai_readiness: 30 } } },
        { services: ['creative'], scores: { dimensions: { ai_readiness: 60 } } },
        { services: ['creative'], scores: { dimensions: { ai_readiness: 80 } } },
        // Test multiple services
        { services: ['creative', 'content'], scores: { dimensions: { ai_readiness: 50 } } }
    ];
    
    const engine = new AgencyRecommendationsEngine();
    
    testCases.forEach((testCase, index) => {
        console.log(`Test Case ${index + 1}:`, testCase);
        const recommendations = engine.generateRecommendations(testCase);
        console.log(`Generated ${recommendations.serviceRecommendations.length} recommendations`);
    });
}
```

### Dashboard Optimization

When working with the valuation dashboard:

#### Performance Considerations

```javascript
// GOOD: Efficient rendering with fragment
renderRecommendations(recommendations) {
    // Create document fragment to minimize DOM operations
    const fragment = document.createDocumentFragment();
    const container = document.createElement('div');
    container.className = 'recommendations-container';
    
    // Limit number of recommendations to avoid performance issues
    const limitedRecs = recommendations.slice(0, 10);
    
    limitedRecs.forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = this.formatRecommendation(rec);
        container.appendChild(card);
    });
    
    fragment.appendChild(container);
    return fragment;
}

// BAD: Inefficient string concatenation
renderRecommendations(recommendations) {
    let html = '<div class="recommendations-container">';
    
    // No limit on recommendations
    recommendations.forEach(rec => {
        html += `<div class="recommendation-card">${this.formatRecommendation(rec)}</div>`;
    });
    
    html += '</div>';
    return html;
}
```

#### Responsive Design

Ensure the dashboard is responsive across device sizes:

```css
/* Mobile-first approach */
.dashboard-container {
    display: flex;
    flex-direction: column;
    width: 100%;
}

.metric-card {
    width: 100%;
    margin-bottom: 1rem;
}

/* Tablet breakpoint */
@media (min-width: 768px) {
    .dashboard-metrics {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
    }
}

/* Desktop breakpoint */
@media (min-width: 1024px) {
    .dashboard-metrics {
        grid-template-columns: repeat(3, 1fr);
    }
    
    .recommendation-cards {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem;
    }
}
```

### Version Management and Updates

#### Code Changes

When making changes to the framework:

1. **Document Changes**: Add clear comments explaining changes
2. **Update Version**: Increment version numbers appropriately
3. **Track Dependencies**: Document any new dependencies
4. **Migration Path**: Provide migration guidance for breaking changes

```javascript
/**
 * @version 2.1.0
 * @change Added support for rating questions
 * @change Fixed service recommendations data structure
 * @breaking Changed scoring calculation for scale questions
 */
```

#### Data Migration

For state structure changes, implement migration logic:

```javascript
const STATE_VERSION = '2.0';

initializeState(initialState) {
    try {
        const savedStateJSON = localStorage.getItem(this.localStorageKey);
        if (savedStateJSON) {
            const savedState = JSON.parse(savedStateJSON);
            
            // Check for version mismatch
            if (savedState.version !== STATE_VERSION) {
                console.log('[StateManager] Migrating state from', 
                    savedState.version, 'to', STATE_VERSION);
                
                // Apply migrations based on version
                const migratedState = this.migrateState(savedState);
                return migratedState;
            }
            
            return savedState;
        }
    } catch (error) {
        console.error('[StateManager] Error loading state:', error);
    }
    
    // Return initial state with version
    return {
        ...initialState,
        version: STATE_VERSION
    };
}

migrateState(oldState) {
    // Apply migrations based on version
    if (oldState.version === '1.0') {
        // Migrate from 1.0 to 1.5
        if (!oldState.serviceRevenue) {
            oldState.serviceRevenue = {};
            // Initialize service revenue from selected services
            (oldState.selectedServices || []).forEach(service => {
                oldState.serviceRevenue[service] = 0;
            });
        }
        oldState.version = '1.5';
    }
    
    if (oldState.version === '1.5') {
        // Migrate from 1.5 to 2.0
        // Update results structure
        if (oldState.results && !oldState.results.scores) {
            oldState.results = {
                scores: oldState.results,
                recommendations: {
                    serviceRecommendations: [],
                    operationalRecommendations: [],
                    financialRecommendations: []
                }
            };
        }
        oldState.version = '2.0';
    }
    
    return oldState;
}
```

---

This documentation provides a comprehensive overview of the assessment framework's architecture, data flow, and implementation details. Use it as a reference when maintaining, extending, or troubleshooting the system.

## User Experience Considerations

### Current UX Implementation

The assessment framework incorporates several UX features to create an engaging and intuitive user experience:

- **Progress Indicator**: Visual feedback showing assessment completion status
- **Step Navigation**: Clear next/previous navigation controls
- **Validation Feedback**: Immediate feedback on user input errors
- **Responsive Design**: Basic responsiveness across device sizes
- **Dark Theme**: Dark-themed UI with yellow accent colors for readability and brand consistency

### UX Improvement Areas

The following areas are currently being addressed or planned for improvement:

1. **Mobile Responsiveness**: Enhancing the mobile experience, particularly for complex components like the services allocation sliders
2. **Input Validation**: Improving real-time validation with clearer error messages
3. **Loading States**: Adding loading indicators during calculations and transitions
4. **Results Visualization**: Enhancing data visualization for better understanding of results
5. **Accessibility**: Implementing proper ARIA attributes and keyboard navigation

### UX Design Principles

When extending or modifying the assessment UI, adhere to these principles:

- **Consistency**: Maintain consistent styling, spacing, and interaction patterns
- **Feedback**: Provide immediate feedback for all user actions
- **Progressive Disclosure**: Reveal information progressively to avoid overwhelming users
- **Error Prevention**: Design interfaces that prevent errors rather than just reporting them
- **User Testing**: Test changes with real users before finalizing

## Practical Implementation Examples

### Adding a New Step to an Assessment

```javascript
// 1. Create a new step class
export class NewCustomStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        
        // Define validation rules
        this.validationRules = {
            customField: [
                { type: 'required', message: 'This field is required' }
            ]
        };
    }
    
    render() {
        return `
            <div class="assessment-step custom-step">
                <h2>Custom Step</h2>
                <div class="form-group">
                    <label for="custom-input">Enter information:</label>
                    <input type="text" id="custom-input" class="form-control" />
                </div>
                ${this.renderNavigation()}
            </div>
        `;
    }
    
    setupEventListeners(container) {
        // Set up event listeners for this step
        const nextButton = container.querySelector('.btn-next');
        const prevButton = container.querySelector('.btn-prev');
        
        this.cleanupListeners = [
            addEvent(nextButton, 'click', this.handleNext.bind(this)),
            addEvent(prevButton, 'click', this.handlePrev.bind(this))
        ];
    }
    
    validate() {
        const customInput = document.getElementById('custom-input');
        if (!customInput.value.trim()) {
            return false;
        }
        
        // Save value to assessment state
        this.assessment.state.customValue = customInput.value.trim();
        return true;
    }
}

// 2. Register the step in the assessment
constructor(config, container) {
    super(config, container);
    // ... existing code ...
    
    // Add the new step
    this.steps['custom-step'] = new NewCustomStep(this);
    
    // Update the steps array in the config if necessary
    if (!this.config.steps.includes('custom-step')) {
        // Insert at appropriate position
        this.config.steps.splice(2, 0, 'custom-step');
    }
}
```

### Creating a Custom Scoring Rule

```javascript
export class CustomScoringEngine extends ScoringBase {
    calculateDimensionScore(answers, questions) {
        let totalScore = 0;
        let totalWeight = 0;
        
        questions.forEach(question => {
            const answer = answers[question.id];
            if (answer !== undefined) {
                // Custom scoring logic
                let questionScore = 0;
                
                if (question.type === 'multiple-choice') {
                    // Get score value from the selected option
                    const selectedOption = question.options.find(opt => opt.value === answer);
                    questionScore = selectedOption ? selectedOption.score : 0;
                } else if (question.type === 'slider') {
                    // Convert slider value to score (0-100)
                    questionScore = (answer / question.max) * 100;
                }
                
                // Apply question weight
                const weight = this.getQuestionWeight(question);
                totalScore += questionScore * weight;
                totalWeight += weight;
            }
        });
        
        // Return weighted average score
        return totalWeight > 0 ? totalScore / totalWeight : 0;
    }
}
```

### Implementing a Custom Dashboard Component

```javascript
function renderCustomMetric(container, score, label) {
    const percentValue = Math.round(score);
    
    const html = `
        <div class="metric-card">
            <h3 class="metric-label">${label}</h3>
            <div class="metric-value-container">
                <div class="metric-chart">
                    <svg viewBox="0 0 36 36">
                        <path class="circle-bg"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        <path class="circle"
                            stroke-dasharray="${percentValue}, 100"
                            d="M18 2.0845
                            a 15.9155 15.9155 0 0 1 0 31.831
                            a 15.9155 15.9155 0 0 1 0 -31.831"/>
                        <text x="18" y="20.35" class="percentage">${percentValue}%</text>
                    </svg>
                </div>
                <div class="metric-description">
                    <p>Description of what this metric means and how it's calculated.</p>
                </div>
            </div>
        </div>
    `;
    
    container.innerHTML += html;
}
```

## Error Handling and Debugging

### Error Handling Strategy

The assessment framework implements error handling at multiple levels:

1. **Try-Catch Blocks**: Critical functions use try-catch to prevent fatal errors
2. **Validation**: Input validation prevents invalid data from entering the system
3. **Fallbacks**: Default values and fallback logic when expected data is missing
4. **Error Reporting**: Console errors with descriptive messages (to be replaced with proper logging before production)

### Logging Strategy

The current implementation uses console logging for development with prefixed messages to identify the source:

```javascript
console.log('[AgencyAssessment] Initializing with config steps:', config.steps);
```

**Note**: Before deployment, these console logs will need to be removed or replaced with a production-appropriate logging solution that doesn't expose sensitive information.

### Common Issues and Solutions

| Issue | Possible Cause | Solution |
|-------|---------------|----------|
| Step navigation fails | Missing step implementation | Check step registration and config.steps array |
| Scoring calculation error | Missing answers or invalid format | Validate input data before calculation |
| Service recommendations not showing | Empty services array | Ensure services are properly selected and saved in state |
| Dashboard rendering issues | Missing or malformatted results data | Check scoring engine output format |

## Testing Framework

### Testing Strategy

A comprehensive testing strategy should be implemented to ensure reliability:

1. **Unit Testing**: Test individual components in isolation
2. **Integration Testing**: Test interactions between components
3. **End-to-End Testing**: Test complete user flows
4. **User Acceptance Testing**: Validate with real users

### Testing Tools and Approaches

- **Unit Tests**: Jest or Mocha for testing individual functions
- **Component Tests**: Testing Library for testing UI components
- **E2E Tests**: Cypress or Playwright for complete flow testing
- **Manual Testing Checklist**: For critical user journeys

### Key Test Cases

- Assessment creation and initialization
- Step navigation (forward, backward, validation)
- State persistence and retrieval
- Scoring calculations with various inputs
- Recommendation generation logic
- Dashboard rendering with different data scenarios

### Test Data

- Sample configurations for different assessment types
- Mock answer sets representing different user profiles
- Edge cases (empty selections, minimum/maximum values)

## Technical Limitations

### Browser Compatibility

The assessment framework is designed to work on modern browsers with the following minimum versions:

- Chrome: 60+
- Firefox: 60+
- Safari: 12+
- Edge: 79+ (Chromium-based)

### Performance Considerations

- **Large Question Sets**: Performance may degrade with extremely large question sets (100+ questions)
- **Complex Visualizations**: Dashboard performance may be affected by complex visualizations
- **Mobile Devices**: Complex calculations may be slower on low-end mobile devices

## Integration Capabilities

### Current Integration Points

The assessment framework is designed with integration points for external systems:

- **Data Export**: JSON export of assessment results
- **Custom Event System**: Events that external systems can listen for

### Future Integrations

### Firebase Migration Timeline

The assessment framework is transitioning from localStorage to Firebase for improved data persistence, sharing capabilities, and analytics. This section outlines the detailed migration plan and implementation timeline.

#### Current State vs. Future State

| Feature | Current Implementation | Firebase Implementation |
|---------|------------------------|-------------------------|
| Data Storage | localStorage | Firestore Database |
| Authentication | None | Firebase Authentication |
| Results Sharing | Email only | Shareable links |
| Analytics | None | Firebase Analytics |
| Offline Support | Full | Partial (with sync) |

#### Phase 1: Firebase SDK Integration (Q3 2025)

- Add Firebase SDK to project
- Create Firebase project and configure environments
- Implement basic read/write operations alongside localStorage
- Develop data models and security rules

```javascript
// Example Firebase initialization
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "...",
    authDomain: "assessor-app.firebaseapp.com",
    projectId: "assessor-app",
    storageBucket: "assessor-app.appspot.com"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
```

#### Phase 2: Data Migration Layer (Q4 2025)

- Implement StateManager that can work with both localStorage and Firebase
- Add data migration utilities
- Test backward compatibility

```javascript
// Enhanced StateManager with Firebase support
export class StateManager {
    constructor(assessment, options = {}) {
        this.assessment = assessment;
        this.localStorageKey = `assessment_${this.assessment.type}_state`;
        this.useFirebase = options.useFirebase || false;
        this.db = options.db;
    }
    
    async saveState() {
        const stateToSave = { 
            ...this.assessment.state,
            savedAt: new Date().getTime(),
            version: '2.0'
        };
        
        // Always save to localStorage for backwards compatibility
        try {
            localStorage.setItem(
                this.localStorageKey, 
                JSON.stringify(stateToSave)
            );
        } catch (error) {
            console.error('[StateManager] Error saving to localStorage:', error);
        }
        
        // If Firebase is enabled, also save there
        if (this.useFirebase && this.db) {
            try {
                const assessmentId = this.assessment.state.assessmentId || 
                                    this.generateAssessmentId();
                                    
                // Ensure state has an ID
                if (!this.assessment.state.assessmentId) {
                    this.assessment.state.assessmentId = assessmentId;
                }
                
                await setDoc(doc(this.db, 'assessments', assessmentId), stateToSave);
                console.log('[StateManager] State saved to Firebase');
                
                return assessmentId; // Return ID for sharing
            } catch (firebaseError) {
                console.error('[StateManager] Error saving to Firebase:', firebaseError);
            }
        }
    }
}
```

#### Phase 3: Authentication and Sharing (Q1 2026)

- Implement user authentication
- Add result sharing via links
- Develop admin dashboard for result viewing

#### Phase 4: Full Firebase Transition (Q2 2026)

- Complete transition to Firebase as primary storage
- Keep localStorage as offline fallback
- Add real-time updates for collaborative assessments

#### Data Migration Considerations

- **Backward Compatibility**: Maintain support for existing localStorage data
- **Data Security**: Implement proper security rules for Firestore
- **Error Handling**: Graceful fallback to localStorage if Firebase operations fail
- **Data Structure**: Ensure Firebase schema supports all existing assessment data

**Additional Planned Integrations**

- **HubSpot**: For email capture and marketing automation
- **Analytics**: For tracking user behavior and assessment completion
- **Payment Gateway**: For premium assessment features

## Deployment and Versioning

### Current Deployment

The assessment framework is currently managed in GitHub at `Jonbains/assessor`.

### Future Deployment Plan

1. **Hosting**: The application will be deployed as `assessor.obsolete.com`
2. **CDN**: Cloudflare will be used for content delivery and security
3. **Backend**: Firebase will provide backend services

### Version Management

- **Semantic Versioning**: Following semver pattern (MAJOR.MINOR.PATCH)
- **Change Logging**: Documenting changes between versions
- **Migration Path**: Providing upgrade guidance for major versions

## Security Considerations

### Data Security

1. **Local Storage**: Currently using localStorage for state persistence (temporary solution)
2. **Future Data Storage**: Will transition to Firebase with proper security rules
3. **Sensitive Data**: Email and financial information need special handling

### Privacy Considerations

1. **User Consent**: Email collection requires explicit consent
2. **Data Usage**: Clear communication about how assessment data will be used
3. **Data Retention**: Policies for how long data is kept

### Security To-Dos Before Production

1. **Remove Console Logging**: All console logs must be removed to prevent data exposure
2. **Implement Proper Authentication**: For accessing results
3. **Secure API Endpoints**: For any server communication
4. **Data Validation**: Server-side validation of all submitted data

## Localization Support

### Current Localization Status

The assessment framework is currently implemented in English only, with a focus on the UK and US markets.

### Localization Considerations

1. **Currency Differences**: Handling $ vs £ in financial calculations
2. **Valuation Methods**: Different methods may apply in different markets
3. **Spelling Variations**: UK vs US English spelling differences
4. **Disruption Timelines**: AI disruption happens at different speeds in different territories

### Future Localization Plan

1. **Externalize Strings**: Move text content to separate files for translation
2. **Locale-specific Configurations**: Allow different scoring and recommendations by region
3. **Date and Number Formatting**: Respect local conventions
4. **Right-to-Left Support**: For potential future markets
