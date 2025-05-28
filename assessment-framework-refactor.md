# Assessment Framework Refactoring Guide

## Overview

This guide outlines the architectural approach for refactoring the current monolithic assessment framework into a modular, scalable system that supports multiple assessment types (Agency, In-House, Consultant, etc.) while maintaining shared infrastructure and consistent user experience.

## Core Architecture Principles

### 1. **Assessment-Type Organization**
- Each assessment type has its own dedicated folder with complete business logic
- Shared components and utilities are centralized for reuse
- Clear separation between framework infrastructure and assessment-specific logic

### 2. **Inheritance and Composition**
- Base classes provide common functionality
- Assessment-specific classes extend base functionality
- Composition over inheritance where appropriate

### 3. **Configuration-Driven**
- Each assessment type has its own configuration
- Dynamic loading of assessment-specific components
- Factory pattern for assessment instantiation

## File Structure

```
assessment-framework/
├── styles/                        # CSS organization
│   ├── core/
│   │   ├── variables.css          # Design system variables
│   │   ├── base.css              # Base styles and resets
│   │   └── typography.css        # Typography system
│   ├── components/
│   │   ├── buttons.css           # Button components
│   │   ├── forms.css             # Form components
│   │   ├── charts.css            # Chart styling
│   │   ├── progress.css          # Progress indicators
│   │   └── tables.css            # Table components
│   ├── themes/
│   │   ├── obsolete-theme.css    # Current dark theme
│   │   └── light-theme.css       # Future light theme option
│   └── assessments/
│       ├── agency/
│       │   ├── agency-components.css # Agency-specific components
│       │   └── valuation-dashboard.css # M&A valuation components
│       ├── inhouse/
│       │   ├── inhouse-components.css # In-house specific components
│       │   └── maturity-dashboard.css # Maturity visualization
│       └── consultant/
│           └── consultant-components.css
├── core/                          # Shared framework components
│   ├── assessment-base.js         # Base assessment class
│   ├── step-base.js              # Base step component
│   ├── navigation-controller.js   # Generic navigation logic
│   ├── state-manager.js          # Generic state management
│   └── scoring-base.js           # Base scoring engine
├── shared/                        # Shared utilities across all assessments
│   ├── utils/
│   │   ├── validation-utils.js    # Form validation, email validation
│   │   ├── formatting-utils.js    # Number, currency, date formatting
│   │   ├── event-manager.js       # Event handling utilities
│   │   └── storage-utils.js       # Local storage, session management
│   ├── components/
│   │   ├── progress-bar.js        # Generic progress indicator
│   │   ├── form-components.js     # Reusable form elements
│   │   ├── chart-base.js         # Base charting functionality
│   │   └── ui-components.js      # Common UI elements
│   └── integrations/
│       ├── export-manager.js      # PDF, JSON export functionality
│       ├── notion-integration.js  # Notion database integration
│       ├── email-service.js      # Email sending functionality
│       └── analytics-tracker.js   # Usage analytics
├── assessments/
│   ├── agency/                    # Agency-specific assessment
│   │   ├── config/
│   │   │   ├── questions.js       # Agency assessment questions
│   │   │   ├── services.js        # Agency service definitions
│   │   │   ├── agency-types.js    # Agency type configurations
│   │   │   └── disruption-data.js # AI disruption timelines
│   │   ├── scoring/
│   │   │   ├── scoring-engine.js  # Agency scoring algorithms
│   │   │   ├── weights.js         # Dimension and question weights
│   │   │   ├── categories.js      # Risk categorization logic
│   │   │   └── valuation.js       # EBITDA multiple calculations
│   │   ├── recommendations/
│   │   │   ├── recommendations-engine.js # Recommendation logic
│   │   │   ├── service-recommendations.js # Service-specific advice
│   │   │   ├── action-plans.js    # Implementation roadmaps
│   │   │   └── tools-database.js  # Recommended tools and costs
│   │   ├── reporting/
│   │   │   ├── results-renderer.js # Results page generation
│   │   │   ├── charts.js          # Agency-specific visualizations
│   │   │   ├── insights.js        # Key insight generation
│   │   │   ├── financial-impact.js # ROI and valuation calculations
│   │   │   └── templates/
│   │   │       ├── results.html   # Results page template
│   │   │       ├── email-report.html # Email report template
│   │   │       └── pdf-report.html # PDF export template
│   │   ├── steps/                 # Agency-specific step overrides
│   │   │   ├── agency-type-step.js # Agency type selection
│   │   │   ├── services-step.js   # Service selection with revenue allocation
│   │   │   ├── revenue-step.js    # Annual revenue input
│   │   │   └── results-step.js    # Agency-specific results display
│   │   └── agency-assessment.js   # Main agency assessment class
│   ├── inhouse/                   # In-house team assessment
│   │   ├── config/
│   │   │   ├── questions.js       # In-house focused questions
│   │   │   ├── departments.js     # Department types (Marketing, Sales, etc.)
│   │   │   ├── company-types.js   # Company size/industry classifications
│   │   │   └── benchmarks.js      # Industry benchmarking data
│   │   ├── scoring/
│   │   │   ├── scoring-engine.js  # Maturity-based scoring
│   │   │   ├── weights.js         # Different weights for in-house context
│   │   │   ├── maturity-levels.js # AI maturity level definitions
│   │   │   └── benchmarking.js    # Peer comparison algorithms
│   │   ├── recommendations/
│   │   │   ├── recommendations-engine.js # In-house specific recommendations
│   │   │   ├── skill-recommendations.js # Training and hiring advice
│   │   │   ├── technology-recommendations.js # Tool and platform advice
│   │   │   └── insourcing-analysis.js # Build vs buy recommendations
│   │   ├── reporting/
│   │   │   ├── results-renderer.js # In-house results display
│   │   │   ├── benchmark-charts.js # Industry comparison charts
│   │   │   ├── maturity-roadmap.js # Progress roadmap generation
│   │   │   └── templates/
│   │   │       ├── maturity-report.html # Maturity assessment results
│   │   │       └── benchmark-report.html # Peer comparison report
│   │   ├── steps/
│   │   │   ├── company-type-step.js # Company classification
│   │   │   ├── departments-step.js # Department selection
│   │   │   ├── team-size-step.js  # Team size and structure
│   │   │   └── benchmark-step.js  # Benchmark selection
│   │   └── inhouse-assessment.js  # Main in-house assessment class
│   └── consultant/                # Future: Consultant assessment
│       ├── config/
│       ├── scoring/
│       ├── recommendations/
│       ├── reporting/
│       ├── steps/
│       └── consultant-assessment.js
├── assessment-factory.js          # Factory for creating assessment instances
└── index.js                      # Main entry point
```

## Implementation Guide

### Step 1: Create Base Classes

#### Core Base Classes
```javascript
// core/assessment-base.js
export class AssessmentBase {
    constructor(config, container) {
        this.config = config;
        this.container = container;
        this.state = this.initializeState();
        this.navigationController = new NavigationController(this);
        this.stateManager = new StateManager(this);
    }
    
    // Abstract methods to be implemented by specific assessments
    initializeState() { throw new Error('Must implement initializeState'); }
    calculateResults() { throw new Error('Must implement calculateResults'); }
    getQuestionsForStep(step) { throw new Error('Must implement getQuestionsForStep'); }
}

// core/step-base.js
export class StepBase {
    constructor(assessment) {
        this.assessment = assessment;
        this.validationRules = {};
    }
    
    render() { throw new Error('Must implement render'); }
    validate() { throw new Error('Must implement validate'); }
    onNext() { return true; }
    onPrevious() { return true; }
}

// core/scoring-base.js
export class ScoringBase {
    constructor(config) {
        this.config = config;
        this.weights = this.config.weights || {};
    }
    
    calculateOverallScore(dimensionScores) { throw new Error('Must implement calculateOverallScore'); }
    calculateDimensionScore(answers, questions) { throw new Error('Must implement calculateDimensionScore'); }
}
```

### Step 2: Create Assessment Factory

```javascript
// assessment-factory.js
import { AgencyAssessment } from './assessments/agency/agency-assessment.js';
import { InhouseAssessment } from './assessments/inhouse/inhouse-assessment.js';

export class AssessmentFactory {
    static assessmentTypes = {
        'agency': AgencyAssessment,
        'inhouse': InhouseAssessment,
        // Add more as needed
    };
    
    static create(type, config, container) {
        const AssessmentClass = this.assessmentTypes[type];
        if (!AssessmentClass) {
            throw new Error(`Unknown assessment type: ${type}`);
        }
        return new AssessmentClass(config, container);
    }
    
    static register(type, assessmentClass) {
        this.assessmentTypes[type] = assessmentClass;
    }
}
```

### Step 3: Implement Agency-Specific Components

#### Agency Assessment Main Class
```javascript
// assessments/agency/agency-assessment.js
import { AssessmentBase } from '../../core/assessment-base.js';
import { EnhancedWeightedScoring } from './scoring/enhanced-weighted-scoring.js';
import { AgencyRecommendationsEngine } from './recommendations/recommendations-engine.js';
import { ValuationDashboard } from './reporting/valuation-dashboard.js';

export class AgencyAssessment extends AssessmentBase {
    constructor(config, container) {
        super(config, container);
        this.scoringEngine = new EnhancedWeightedScoring(config, 'agency');
        this.valuationDashboard = new ValuationDashboard(config);
    }
    
    calculateResults() {
        // Use the sophisticated scoring system
        return this.scoringEngine.calculateResults(this.getAssessmentData(), this.state.selectedAgencyType);
    }
    
    getAssessmentData() {
        return {
            answers: this.state.answers,
            selectedServices: this.state.selectedServices,
            revenue: this.state.revenue,
            email: this.state.email,
            name: this.state.name
        };
    }
}
```

#### Agency-Specific Scoring Engine
```javascript
// assessments/agency/scoring/agency-scoring-engine.js  
import { EnhancedWeightedScoring } from './enhanced-weighted-scoring.js';

export class AgencyScoringEngine extends EnhancedWeightedScoring {
    constructor(config) {
        super(config, 'agency');
        // Agency-specific scoring weights and methods
        this.agencyWeights = {
            operational: 0.2,
            financial: 0.3,
            ai: 0.4,
            strategic: 0.1
        };
    }
    
    // Agency-specific M&A focused scoring
    calculateValuationImpact(scores) {
        // Calculate EBITDA multiples, acquisition readiness, etc.
    }
}
```

### Step 4: Create Configuration Files

#### Agency Questions Configuration
```javascript
// assessments/agency/config/questions.js
export const agencyQuestions = {
    core: [
        {
            id: 1,
            dimension: "operational",
            question: "If a new team member joined tomorrow, how would they figure out how you do things?",
            weight: 2,
            options: [
                { text: "They'd shadow someone and pick it up as they go", score: 0 },
                { text: "We've got some basic guides, but they're probably outdated", score: 1 },
                { text: "We have documentation for the main stuff, and update it yearly", score: 3 },
                { text: "Everything's documented in our wiki/knowledge base that we actually maintain", score: 5 }
            ]
        },
        // ... more core questions
    ],
    
    serviceSpecific: {
        creative: [
            {
                id: "creative_1",
                dimension: "ai",
                weight: 2.5,
                question: "To what extent has your creative team integrated AI image generation tools?",
                options: [
                    { text: "We haven't touched AI image tools", score: 0 },
                    { text: "A few designers experiment with Midjourney on personal time", score: 1 },
                    { text: "We use AI for mood boards and concepts", score: 2 },
                    { text: "AI generates 30-50% of our visual assets", score: 3 },
                    { text: "AI is integral to our creative process", score: 4 },
                    { text: "We've built custom models on client brand assets", score: 5 }
                ]
            },
            // ... more creative questions
        ],
        // ... other service questions
    }
};
```

#### In-House Questions Configuration
```javascript
// assessments/inhouse/config/questions.js
export const inhouseQuestions = {
    core: [
        {
            id: 1,
            dimension: "skills",
            question: "What percentage of your marketing team has received formal training in AI tools?",
            weight: 2,
            options: [
                { text: "None or almost none (0-10%)", score: 0 },
                { text: "About half of team trained (40-60%)", score: 3 },
                { text: "Majority trained (80%+) with continuous AI upskilling", score: 5 }
            ]
        },
        // ... more in-house focused questions
    ],
    
    departmentSpecific: {
        marketing: [
            {
                id: "marketing_1",
                dimension: "process",
                question: "How much of your marketing content is created or assisted by AI?",
                options: [
                    { text: "0% - All content is human-produced", score: 0 },
                    { text: "30-50% uses AI assistance", score: 3 },
                    { text: "75%+ involves AI with human oversight", score: 5 }
                ]
            },
            // ... more marketing questions
        ],
        // ... other department questions
    }
};
```

### Step 5: CSS Architecture Strategy

#### Current CSS Analysis
Your existing CSS shows excellent organization with:
- **Design System Variables** - Consistent color palette, spacing, typography
- **Component-Based Approach** - Specific styling for UI components
- **Assessment-Specific Styling** - Valuation dashboard components
- **Professional Aesthetic** - Dark theme with yellow accents perfect for M&A context

#### Recommended CSS Organization

```css
/* styles/core/variables.css - Design system foundation */
:root {
  /* Brand colors */
  --color-background: #141414;
  --color-accent: #ffff66;
  
  /* Component tokens */
  --component-button-bg: var(--color-accent);
  --component-card-bg: var(--color-background-card);
  
  /* Assessment-specific tokens */
  --assessment-agency-primary: var(--color-accent);
  --assessment-inhouse-primary: #4caf50; /* Different color for in-house */
}

/* styles/assessments/agency/agency-components.css */
.agency-assessment {
  --assessment-primary: var(--assessment-agency-primary);
}

.agency-valuation-dashboard {
  /* M&A specific styling */
  background-color: var(--color-background-dark);
}

/* styles/assessments/inhouse/inhouse-components.css */
.inhouse-assessment {
  --assessment-primary: var(--assessment-inhouse-primary);
}

.inhouse-maturity-dashboard {
  /* Maturity-specific styling */
  background-color: var(--color-background-dark);
}
```

#### CSS Loading Strategy
```javascript
// Dynamic CSS loading per assessment type
class StyleManager {
    static loadAssessmentStyles(assessmentType) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `styles/assessments/${assessmentType}/${assessmentType}-components.css`;
        document.head.appendChild(link);
    }
}
```

### Step 6: Migration Strategy

#### Phase 1: Infrastructure Setup
1. Create base classes and shared utilities
2. Set up assessment factory
3. **Reorganize CSS architecture** - Split current CSS into modular structure
4. Create basic agency assessment structure
5. Migrate one step component (e.g., agency type selection)

#### Phase 2: Agency Assessment Migration
1. Migrate agency-specific configurations
2. Implement agency scoring engine  
3. Migrate agency recommendations
4. **Migrate valuation dashboard CSS** - Move to agency-specific folder
5. Implement agency results rendering
6. Test complete agency assessment flow

#### Phase 3: In-House Assessment Creation
1. Create in-house assessment structure
2. Implement in-house specific questions and config
3. Develop in-house scoring algorithms
4. **Create in-house specific CSS** - Maturity-focused components
5. Create in-house reporting templates
6. Test in-house assessment flow

#### Phase 4: Optimization and Enhancement
1. Performance optimization
2. Enhanced error handling
3. Additional assessment types
4. Advanced features (A/B testing, analytics, etc.)

## Usage Examples

### Creating an Agency Assessment
```javascript
// For agency assessment
const agencyConfig = {
    type: 'agency',
    steps: ['agency-type', 'services', 'revenue', 'questions', 'email', 'results'],
    scoringEngine: 'AgencyScoringEngine',
    questions: agencyQuestions,
    services: agencyServices,
    agencyTypes: agencyTypes
};

const assessment = AssessmentFactory.create('agency', agencyConfig, containerElement);
```

### Creating an In-House Assessment
```javascript
// For in-house assessment
const inhouseConfig = {
    type: 'inhouse',
    steps: ['company-type', 'departments', 'team-size', 'questions', 'email', 'results'],
    scoringEngine: 'InhouseScoringEngine',
    questions: inhouseQuestions,
    departments: departmentTypes,
    companyTypes: companyTypes
};

const assessment = AssessmentFactory.create('inhouse', inhouseConfig, containerElement);
```

## Benefits of This Architecture

### 1. **Scalability**
- Easy to add new assessment types without affecting existing ones
- Each assessment can have completely different business logic
- Shared infrastructure reduces development time for new assessments

### 2. **Maintainability**
- Clear separation of concerns
- Changes to one assessment don't affect others
- Easier debugging and testing

### 3. **Flexibility**
- Different scoring algorithms per assessment type
- Different question sets and flows
- Customizable reporting for each assessment type

### 4. **Team Development**
- Multiple teams can work on different assessments simultaneously
- Clear ownership boundaries
- Easier code reviews and testing

### 5. **Performance**
- Lazy loading of assessment-specific code
- Smaller bundle sizes per assessment
- Better caching strategies

This architecture provides a solid foundation for scaling the assessment platform while maintaining code quality and developer productivity.

## Enhanced Weighted Scoring System Analysis

### **enhanced-weighted-scoring.js** ✅ **SOPHISTICATED SCORING ENGINE**

This is a **mature, production-ready scoring system** that demonstrates excellent architectural patterns:

#### **Key Architecture Patterns:**
1. **Modular Scoring Modules** - Different scoring logic per assessment type
2. **Weighted Methodology** - Sophisticated weighting throughout all calculations  
3. **Service Analysis Engine** - Vulnerability, adaptability, and revenue-weighted scoring
4. **External Config Integration** - Works with ServiceRecommendations configuration
5. **Comprehensive Output** - Generates scores, recommendations, insights, action plans

#### **Scoring Module Pattern:**
```javascript
this.scoringModules = {
  default: {
    calculateDimensionScore: this.weightedCalculateDimensionScore.bind(this),
    calculateServiceScores: this.weightedCalculateServiceScores.bind(this),
    calculateOverallScore: this.weightedCalculateOverallScore.bind(this)
  },
  agency: {
    // Agency-specific implementations
    calculateServiceScores: this.agencyWeightedCalculateServiceScores.bind(this)
  }
};
```

#### **Refactoring Strategy:**
- **Move to**: `assessments/agency/scoring/enhanced-weighted-scoring.js`  
- **Extract base class**: `core/scoring-base.js` with common patterns
- **Create assessment-specific extensions**: `AgencyScoringEngine extends ScoringBase`

#### **Configuration Dependencies:**
- Requires questions with `dimension` and `weight` properties
- Integrates with `ServiceRecommendations` external config
- Uses disruption data for service vulnerability calculations
- Supports agency-type specific recommendation variations

#### **Key Methods to Preserve:**
- `calculateRevenueWeightedVulnerability()` - Revenue-based risk analysis
- `calculateServiceAdaptabilityScore()` - AI adaptability scoring  
- `generateRecommendations()` - Sophisticated recommendation engine
- `generateKeyInsights()` - Insight generation logic

This scoring system is **production-ready** and should be preserved largely as-is, just moved into the modular structure.

### Assessment-Specific Business Logic Files

#### **valuation-dashboard.js** ✅ **PRIMARY M&A IMPLEMENTATION**
- **Status**: Production-ready, comprehensive M&A valuation dashboard
- **Features**: Executive summary, EBITDA multiples, acquisition readiness checklist, financial calculator
- **Quality**: Sophisticated calculations, error handling, interactive components
- **Integration**: Used as primary fallback in `assessment-framework.js`
- **Refactor Destination**: `assessments/agency/reporting/valuation-dashboard.js`

```javascript
// Current integration in assessment-framework.js
if (typeof ValuationDashboard !== 'undefined') {
    var dashboardData = ValuationDashboard.generateDashboard(results, this.config);
    html += dashboardData.html;
}
```

#### **valuation-insights.js** 🔄 **HAS USEFUL UTILITIES**
- **Status**: Contains valuable calculation logic that should be extracted
- **Useful Code**: EBIT impact calculations, driver scoring functions, valuation multiplier logic
- **Refactor Strategy**: Extract utilities to `assessments/agency/scoring/valuation-calculations.js`
- **Integration Destination**: Import specific functions into valuation-dashboard.js

```javascript
// Example of useful code to extract:
calculateEbitImpact: function(scores) {
    var baseImpact = 0;
    if (scores.overall >= 80) baseImpact = 25;
    // ... rest of logic
}
```

#### **valuation-report.js** ❌ **OBSOLETE**
- **Status**: Legacy implementation superseded by valuation-dashboard.js
- **Issues**: Hardcoded values, less sophisticated than dashboard version
- **Action**: Remove from codebase - no longer needed
- **Current Role**: Fallback only, but dashboard is the primary implementation

### Active Components (Currently In Use)

#### **revenue-risk-calculator.js** ✅ **ACTIVE**
- **Purpose**: Results visualization showing revenue at risk by service
- **Integration**: Used in `assessment-framework.js` results step
- **Architecture**: Well-structured component with proper namespace registration
- **Refactor Destination**: `assessments/agency/reporting/revenue-risk-calculator.js`

```javascript
// Currently used in assessment-framework.js
new window.AssessmentFramework.Components.Results.RevenueRiskCalculator(
    container, services, serviceScores, serviceRevenue, revenue
);
```

#### **revenue-allocator.js** ❓ **UNCLEAR STATUS**
- **Purpose**: UI component for allocating revenue percentages across services
- **Integration**: Not clearly referenced in main assessment framework
- **Potential Redundancy**: Main framework already has revenue allocation in services step
- **Architecture**: Good component structure with localStorage persistence

### Component Architecture Observations

Both components demonstrate **excellent patterns** that align with the modular refactoring:

1. **Namespace Registration**: `window.AssessmentFramework.Components.*`
2. **Self-Contained**: Complete functionality with error handling
3. **Reusable**: Constructor-based with dependency injection
4. **Storage Integration**: localStorage for persistence
5. **Event Management**: Proper event binding and cleanup

### Integration Strategy

#### **Keep and Migrate**:
- `revenue-risk-calculator.js` → `assessments/agency/reporting/revenue-risk-calculator.js`
- Update namespace to use modular loading instead of global registration

#### **Evaluate**:
- `revenue-allocator.js` - Determine if it's redundant with built-in services step functionality
- If needed, migrate to `shared/components/revenue-allocator.js` for reuse across assessments

#### **Component Loading Pattern**:
```javascript
// Instead of global namespace registration
export class RevenueRiskCalculator {
  // Component implementation
}

// In agency assessment
import { RevenueRiskCalculator } from './reporting/revenue-risk-calculator.js';
```

This analysis shows your component architecture is already quite mature and aligns well with the proposed modular structure.