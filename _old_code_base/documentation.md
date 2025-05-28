# Assessment Framework Documentation

*Last Updated: May 21, 2025*

## Table of Contents
1. [Overview](#overview)
2. [Core Architecture](#core-architecture)
3. [File Structure](#file-structure-and-descriptions)
4. [Key Data Objects](#key-data-objects)
5. [Scoring Algorithm](#scoring-algorithm)
6. [Configuration File Format](#configuration-file-format)
7. [Sector-Specific Assessment Configuration](#sector-specific-assessment-configuration)
8. [Initialization Sequence](#initialization-sequence)
9. [Error Handling Strategy](#error-handling-strategy)
10. [Component Initialization Requirements](#component-initialization-requirements)
11. [Critical User Flows](#critical-user-flows)
12. [Visualization Components](#visualization-components)
13. [Debugging Procedures](#debugging-procedures)
14. [Recently Fixed Issues](#recently-fixed-issues)
15. [Dependency Management](#dependency-management)
16. [Cross-Browser Compatibility](#cross-browser-compatibility)
17. [Performance Considerations](#performance-considerations)
18. [Security Considerations](#security-considerations)
19. [Deployment Workflow](#deployment-workflow)
20. [Version Control Strategy](#version-control-strategy)
21. [WordPress Integration](#wordpress-integration)
22. [Event Loop Considerations](#event-loop-considerations)
23. [Accessibility Compliance](#accessibility-compliance)
24. [Error Codes and Logging](#error-codes-and-logging)
25. [Testing Strategy](#testing-strategy)
26. [API Rate Limiting](#api-rate-limiting)
27. [Mobile Responsiveness](#mobile-responsiveness)
28. [Custom Extensions](#custom-extensions)
29. [Internationalization](#internationalization)
30. [Notes on Dark Mode](#notes-on-dark-mode)

## Overview
The Assessment Framework is a web-based tool that guides users through a multi-step assessment process to evaluate their organization's AI readiness and provides actionable insights about potential risks and opportunities. It follows a step-by-step wizard approach, collecting information about the organization type, services offered, revenue allocation, and specific business practices before generating a comprehensive report.

## Core Architecture

### Main Components
1. **Engine** (`core/engine.js`): The central controller that manages state, step navigation, event handling, and assessment data.
2. **Renderer** (`core/renderer.js`): Handles all UI rendering, creates components, and displays different assessment steps based on the engine's state.
3. **Components**: Modular UI elements that handle specific parts of the assessment experience.
4. **Config** (`configs/agency-assessment-config.js`): Contains all configuration data including services, organization types, questions, scoring criteria, and disruption timelines.

### Data Flow
1. User progresses through steps defined in the config
2. Engine maintains state (selected services, answers, etc.)
3. Renderer displays appropriate UI for each step
4. On completion, results are calculated and displayed in a rich report

### Integration Points
- WordPress/Divi theme integration via `wordpress-integration.html`
- Standalone testing via `test-obsolete-theme.html`

## Engine API

### Core Methods
- `init()`: Initialize the assessment
- `nextStep()`: Progress to next step, returns false if validation fails
- `prevStep()`: Return to previous step
- `setAnswer(questionId, value)`: Set an answer for a specific question
- `setServices(services)`: Set the selected services
- `setServiceRevenue(serviceRevenue)`: Set revenue allocation for services
- `setOrganizationType(type)`: Set organization type (formerly agencyType)
- `setUserDetails(details)`: Set user contact information
- `getResults()`: Calculate assessment results

### Implementation Status
The Engine has been updated to use the new utility modules:

```javascript
// Engine constructor now uses StorageManager and DataModels for validation
constructor(config) {
  // Validate config using DataModels
  if (window.AssessmentFramework?.Utils?.DataModels) {
    window.AssessmentFramework.Utils.DataModels.validateConfig(config);
  }
  
  // Initialize storage manager with assessment type
  this.assessmentType = config.assessmentType || 'agency';
  this.storage = new window.AssessmentFramework.Utils.StorageManager(this.assessmentType);
  
  // Initialize state with default values and dataVersion
  this.state = {
    // ... state properties ...
    organizationType: null,  // renamed from agencyType for flexibility
    dataVersion: 2  // Current data version for migration management
  };
  
  // Load stored state if available
  this.loadStoredState();
}

// Methods now use storage manager and data models
setServiceRevenue(serviceRevenue) {
  if (window.AssessmentFramework?.Utils?.DataModels) {
    this.state.serviceRevenue = window.AssessmentFramework.Utils.DataModels.normalizeServiceRevenue(serviceRevenue);
  }
  this.saveState(); // Persists state using StorageManager
}

getResults() {
  // Try to use modular ScoringSystem first
  if (window.AssessmentFramework?.Utils?.ScoringSystem) {
    const scoringSystem = new window.AssessmentFramework.Utils.ScoringSystem(
      this.config, this.assessmentType
    );
    return scoringSystem.calculateResults(this.state);
  }
  // Fallback to legacy scoring
}
```

### Renderer API

#### Core Methods
- `init()`: Initialize the renderer
- `renderStep(data)`: Render a specific step
- `initializeStepComponents(stepType)`: Initialize components for a step
- `validateCurrentStep()`: Validate the current step
- `renderResults(results)`: Render assessment results

#### Implementation Status
The Renderer has been updated to validate components against their interfaces:

```javascript
// In renderer.js - initializeStepComponents method
initializeStepComponents(stepType) {
  // Check if component interfaces are available for validation
  const hasComponentInterfaces = window.AssessmentFramework?.Utils?.ComponentInterfaces;
  
  try {
    // Create and validate components based on step type
    switch (stepType) {
      case 'services':
        const serviceSelector = new window.AssessmentFramework.Components.ServiceSelector(/* ... */);
        
        // Validate component against interface if available
        if (hasComponentInterfaces) {
          window.AssessmentFramework.Utils.ComponentInterfaces.validateComponent(
            serviceSelector,
            window.AssessmentFramework.Utils.ComponentInterfaces.ServiceSelector,
            'ServiceSelector'
          );
        }
        break;
        
      // Similar validation for other component types...
    }
  } catch (error) {
    // Graceful error handling with user-friendly messages
    console.error(`[Renderer] Error initializing components for step '${stepType}':`, error);
    
    // Display error message in the UI
    const errorMessage = document.createElement('div');
    errorMessage.className = 'component-error';
    errorMessage.innerHTML = `
      <h3>Component Error</h3>
      <p>There was an error initializing components for this step.</p>
      <p class="error-details">${error.message}</p>
    `;
    
    if (this.currentStepElement) {
      this.currentStepElement.appendChild(errorMessage);
    }
  }
}
```

## File Structure and Descriptions

### Core Files
- **`core/engine.js`**: Assessment engine that manages state, navigation, and events. Maintains the current step, user selections, answers, and other assessment data.
- **`core/renderer.js`**: Handles UI rendering for all steps. Contains methods to initialize UI components and display the results report with various visualizations.
- **`initializer.js`**: Entry point script that creates engine and renderer instances and initializes the assessment framework.

### Utility Files
- **`utils/data-models.js`**: Defines standard data structures and validation for consistency across components.
- **`utils/component-interfaces.js`**: Defines standard interfaces that all components must implement.
- **`utils/scoring-system.js`**: Provides a modular scoring system adaptable for different assessment types.
- **`utils/storage-manager.js`**: Manages persistent storage with namespacing for different assessment types.

### Configuration
- **`configs/reference-assessment-config.js`**: The canonical reference implementation that serves as a template for all assessment types. Thoroughly documented with examples for each section.
- **`configs/agency-assessment-config.js`**: Organization assessment configuration containing:
  - Assessment steps and flow
  - Available services with metadata
  - Questions for various assessment dimensions (including serviceSpecific questions)
  - Scoring criteria and calculations
  - Disruption data for timeline and vulnerability analysis
  - Organization types and associated metadata (formerly called agency types)
- **`configs/base-config.js`**: Optional shared configuration elements that can be extended by specific assessment types.

### Components
- **Step Components**
  - **`components/agency-type-selector.js`**: Renders organization type selection options (component name maintained for backward compatibility)
  - **`components/service-selector.js`**: Displays service selection checkboxes
  - **`components/revenue-allocator.js`**: Provides sliders for revenue allocation across services
  - **`components/question-manager.js`**: Handles question display and answer collection
  - **`components/email-collector.js`**: Collects user contact information and handles form submission

- **Results Components**
  - **`components/results/score-card.js`**: Displays overall score and radar chart of dimension scores
  - **`components/results/vulnerability-map.js`**: Shows services plotted on risk vs. opportunity matrix
  - **`components/results/assessment-report.js`**: Creates a comprehensive report with all visualizations in a logical flow, including agency name and date
  - **`components/results/action-matrix.js`**: Prioritized action matrix based on impact and effort
  - **`components/results/results-controller.js`**: Coordinates the rendering of all result components with robust error handling
  - **`components/results/timeline.js`**: Displays AI disruption timeline for selected services
  - **`components/results/risk-table.js`**: Lists services with their risk scores and revenue percentages
  - **`components/results/recommendations.js`**: Provides tailored recommendations based on scores
  - **`components/results/action-plan.js`**: Shows specific action steps based on overall score
  - **`components/results/service-strategy-table.js`**: Provides strategic guidance based on vulnerability map quadrants

### Utilities
- **`utils/scoring.js`**: Contains algorithms to calculate scores from assessment answers
- **`utils/validation.js`**: Provides form validation helpers
- **`utils/data-processing.js`**: Contains helper functions for data transformations

### Styles
- **`styles/assessment-styles.css`**: Contains styling for the assessment framework
- **`styles/core.css`**: Core style foundations and variables

## Key Data Objects

### Standard Data Models
The framework uses standardized data models defined in `utils/data-models.js` to ensure consistency across components:

#### Service Object
```javascript
{
  id: "service1",              // Unique identifier
  name: "Service Name",        // Display name
  description: "Description",  // Display description
  category: "category1"        // Optional category for grouping
}
```

#### Service Score Object
```javascript
{
  id: "service1",              // Service identifier
  score: 75,                   // Overall score (0-100)
  vulnerability: 65,           // Vulnerability score (0-100)
  opportunity: 80              // Opportunity score (0-100)
}
```

## Customizing Reports for Different Assessment Types

The framework supports creating different report types based on the assessment type through a dynamic component registry system that allows for customized results pages.

### Component Registry

The renderer uses a component registry that maps assessment types to their required result components:

```javascript
const componentRegistry = {
  // Default components shown for all assessment types
  'default': ['ScoreCard'],
  
  // Organization assessment specific components (formerly called agency assessment)
  'agency': ['ScoreCard', 'VulnerabilityMap', 'Timeline', 'RiskTable', 'Recommendations', 'ActionPlan'],
  
  // In-house marketing assessment components
  'inhouse': ['ScoreCard', 'VulnerabilityMap', 'Timeline', 'ActionPlan'],
  
  // Simple assessment with minimal visualization
  'simple': ['ScoreCard', 'Recommendations']
};
```

### Configuration Override

You can override the components used for a specific assessment instance by adding a `resultComponents` array to your configuration:

```javascript
const config = {
  assessmentType: "agency",
  // ... other config properties
  
  // Override the default components for this assessment
  resultComponents: ['ScoreCard', 'Timeline', 'ActionPlan'] 
};
```

### Creating Custom Result Components

To create a custom result component:

1. Create a new component in `/components/results/`
2. Implement the interface for result components
3. Register your component in the `AssessmentFramework.Components.Results` namespace

```javascript
// Example: Custom Executive Summary component
class ExecutiveSummary {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    
    this.render();
  }
  
  render() {
    // Access data from the componentData object
    const { scores, organizationType, recommendations } = this.data;
    
    // Render component
    this.container.innerHTML = `
      <div class="executive-summary">
        <h2>Executive Summary</h2>
        <p>Overall score: ${scores.overall}</p>
        <!-- Additional content -->
      </div>
    `;
  }
}

// Register component
window.AssessmentFramework = window.AssessmentFramework || {};
window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
window.AssessmentFramework.Components.Results = window.AssessmentFramework.Components.Results || {};
window.AssessmentFramework.Components.Results.ExecutiveSummary = ExecutiveSummary;
```

### Component Data Contract

All result components receive a standardized `componentData` object with the following structure:

```javascript
const componentData = {
  // Common data from results
  scores: {                 // Scores from the scoring system
    overall: 72,            // Overall assessment score (0-100)
    operational: 65,        // Operational dimension score
    financial: 80,          // Financial dimension score
    ai: 75,                 // AI readiness score
    adjustedAi: 60,         // AI score adjusted for service vulnerability
    serviceVulnerability: 58 // Service vulnerability score
  },
  scoreCategory: 'MODERATE RISK',    // Text category based on overall score
  valuationRange: '$1.5M - $2.0M',   // Valuation range based on scores
  serviceScores: {},        // Service-specific scores
  keyInsights: [],          // Key insights generated from the assessment
  actionPlanItems: [],      // Action plan items based on scores
  
  // State data from engine
  selectedServices: ['creative', 'digital', 'strategy'], // Selected services
  serviceRevenue: {         // Revenue allocation percentages
    creative: 40,
    digital: 35,
    strategy: 25
  },
  organizationType: 'full-service',  // Organization type selected by user
  userDetails: {            // User contact information
    name: 'Jane Smith',
    email: 'jane@example.com'
  },
  
  // Configuration data
  disruptionData: [],       // Service disruption timeline data
  recommendations: {},      // Recommendations by organization type
  actionPlans: {}           // Action plans configuration
};
```

Components should handle missing or incomplete data gracefully with appropriate fallbacks.

### Component Interface

All result components should implement the following interface:

```javascript
// Result Component Interface
class ResultComponentInterface {
  // Required constructor signature
  constructor(container, ...args) {
    if (!container) {
      throw new Error('Container element is required');
    }
    
    this.container = container;
    this.initialize(...args);
  }
  
  // Initialize the component with data
  initialize(...args) {
    throw new Error('Not implemented');
  }
  
  // Render the component UI
  render() {
    throw new Error('Not implemented');
  }
  
  // Handle any cleanup when component is destroyed
  destroy() {
    // Default implementation
    this.container.innerHTML = '';
  }
  
  // Optional method for component validation
  static validateComponent(component) {
    return (
      component &&
      typeof component.render === 'function' &&
      typeof component.initialize === 'function'
    );
  }
}
```

Each specific result component will receive the appropriate subset of the `componentData` object as arguments in its constructor:

```javascript
// ScoreCard receives scores, category, and valuation
new ScoreCard(
  container,
  componentData.scores,
  componentData.scoreCategory,
  componentData.valuationRange
);

// VulnerabilityMap receives service scores, revenue, and disruption data
new VulnerabilityMap(
  container,
  componentData.serviceScores,
  componentData.serviceRevenue,
  componentData.disruptionData
);
```

#### Service Revenue Object
```javascript
{
  "service1": 40,              // Percentage of revenue (will be normalized to 100%)
  "service2": 35,
  "service3": 25
}
```

### Engine State
The central state object maintained by the engine includes:
- `currentStep`: Current step index
- `selectedServices`: Array of service IDs chosen by the user
- `serviceRevenue`: Object mapping service IDs to revenue percentages
- `organizationType`: Selected organization type (formerly agencyType) 
- `answers`: Object with question answers (format: `{questionId: answerId}`)
- `userDetails`: User contact information
- `dataVersion`: Version number for state migration purposes

#### Local Storage Persistence
The engine state is persisted in localStorage using the `StorageManager` with namespace prefixing to prevent conflicts between different assessment types:

```javascript
// Creating a storage manager for a specific assessment type
const storage = new window.AssessmentFramework.Utils.StorageManager('agency');

// Saving data with namespaced keys
storage.save('state', engineState);
// Results in localStorage key: 'assessment_agency_state'

// Loading data
const state = storage.load('state', defaultState);

// Clearing all data for this assessment type only
storage.clearAll();
```

Namespaced keys used by the storage manager:
- `assessment_{type}_state`: Complete engine state JSON
- `assessment_{type}_userDetails`: User's contact information
- `assessment_{type}_serviceRevenue`: Revenue allocation data
- `assessment_{type}_selectedServices`: Selected services array

The storage manager also handles data migration between versions:

```javascript
// Migrate state data from version 1 to version 2
const migratedState = storage.migrateState('state', 2);
```

### Results Object
Generated upon assessment completion, contains:
- `scores`: Object with dimension scores (operational, financial, ai) and overall score
- `scoreCategory`: Text category based on score (Low Risk, Moderate Risk, etc.)
- `valuationRange`: Agency valuation estimate based on scores
- `serviceScores`: Per-service risk scores and vulnerabilities
- `selectedServices`: Array of services selected by the user
- `serviceRevenue`: Revenue allocation for services
- `userDetails`: User's contact information

## Scoring Algorithm

### Original Scoring Implementation

The framework's primary scoring system implements the exact methodology from the original enhanced assessment tool to ensure consistent results. This is available in `utils/original-scoring.js` and is used as the preferred scoring method.

```javascript
// In engine.js, we prioritize using the original scoring method
if (window.AssessmentFramework?.Utils?.OriginalScoring) {
  const results = window.AssessmentFramework.Utils.OriginalScoring.calculateResults(
    this.config,
    this.state
  );
}
```

#### Core Formulas

1. **Dimension Scores** - Operational, Financial, and AI scores are calculated by normalizing question responses to a 0-100 scale.

2. **Service Vulnerability** - Each service's vulnerability score is weighted by its revenue percentage:
   ```javascript
   // Revenue-weighted vulnerability calculation
   Object.keys(serviceScores).forEach(service => {
     const revenuePct = serviceRevenue[service] || 0;
     const vulnerability = serviceScores[service].vulnerability || 0.5;
     const vulnerabilityScore = Math.round(vulnerability * 100);
     
     totalVulnerability += vulnerabilityScore * revenuePct;
     totalRevenue += revenuePct;
   });
   return Math.round(totalVulnerability / totalRevenue);
   ```

3. **Adjusted AI Score** - Combines the AI capability with service vulnerability:
   ```javascript
   // Formula: (AI Score × 0.6) - (Service Vulnerability × 0.4)
   const adjustedAiScore = Math.max(0, Math.min(100, Math.round(
     (aiScore * 0.6) - (serviceVulnerability * 0.4)
   )));
   ```

4. **Overall Score** - Weighted combination of the three dimensions:
   ```javascript
   // Formula: (Operational × 0.2) + (Financial × 0.3) + (Adjusted AI × 0.5)
   const overallScore = Math.round(
     (operationalScore * 0.2) + 
     (financialScore * 0.3) + 
     (adjustedAiScore * 0.5)
   );
   ```

5. **EBITDA Valuation Range** - Business valuation based on assessment score and agency type.

#### Cross-Assessment Type Compatibility

The original scoring implementation includes adaptations for different assessment types:

- **Agency Assessment** (original focus): Full EBITDA valuation range calculation
- **In-house Teams**: Productivity improvement potential estimates
- **Nonprofit Organizations**: Mission impact multiplier estimates
- **Other Types**: Generic value assessment categorization

#### Error Handling and Fallback Mechanisms

The original scoring implementation includes comprehensive error handling to ensure the assessment doesn't break even if data is missing:

```javascript
// Graceful fallback if calculation fails
try {
  // Calculation logic...
} catch (error) {
  console.error('[OriginalScoring] Error calculating results:', error);
  return this.getFallbackResults(state);
}

// Fallback results method provides sensible defaults
OriginalScoring.getFallbackResults = function(state) {
  // Extract whatever information we can
  const userDetails = state && state.userDetails ? state.userDetails : {};
  const selectedServices = state && state.selectedServices ? state.selectedServices : [];
  
  // Create minimal results to prevent UI breaks
  return {
    scores: {
      overall: 60,
      operational: 65,
      financial: 55,
      // Additional fallback values...
    },
    // Other fallback data...
  };
};
```

#### Service ID Format Conventions

Service identifiers use a capitalized format for improved readability while maintaining compactness:

```javascript
// In configuration
services: [
  { name: "Creative Services", id: "Creative" },
  { name: "Content Development", id: "Content" },
  { name: "Digital Marketing", id: "Digital" },
  // ...
]
```

This convention makes the code more intuitive while avoiding spaces in object keys. The scoring system handles both capitalized IDs and legacy lowercase IDs for backward compatibility.

### Modular Scoring System
The framework uses a modular scoring system implemented in `utils/scoring-system.js` that can be customized for different assessment types. The system provides different scoring modules for each assessment type, with fallbacks to default implementations.

```javascript
// Creating a scoring system for a specific assessment type
const scoringSystem = new window.AssessmentFramework.Utils.ScoringSystem(config, 'agency');

// Calculate results using the appropriate scoring module
const results = scoringSystem.calculateResults(state);
```

### Scoring Modules
Each assessment type can have its own scoring module with specialized implementations:

```javascript
scoringSystems = {
  // Agency assessment scoring module
  agency: {
    calculateDimensionScore: function(answers, questions, dimension) { /* ... */ },
    calculateServiceScores: function(answers, services, questions, disruption) { /* ... */ },
    calculateOverallScore: function(dimensionScores, serviceScores) { /* ... */ },
    determineScoreCategory: function(overallScore) { /* ... */ },
    calculateValuationRange: function(overallScore, dimensionScores, serviceScores, revenue) { /* ... */ }
  },
  
  // In-house marketing scoring module with different logic
  inhouse: {
    // Custom implementations for in-house marketing
  }
};
```

### Default Dimension Scoring
Each question has a weight property that determines its impact on the dimension score. The formula is:

```javascript
// Dimension scoring calculation
let totalScore = 0;
let totalWeight = 0;

questions.forEach(question => {
  const answer = answers[question.id];
  if (answer) {
    const answerObject = question.answers.find(a => a.id === answer);
    if (answerObject && typeof answerObject.value === 'number') {
      totalScore += answerObject.value * question.weight;
      totalWeight += question.weight;
    }
  }
});

// Prevent division by zero
if (totalWeight === 0) {
  return 0;
}

// Normalize to 0-100 scale (assuming answer values are 0-4)
return Math.round((totalScore / totalWeight) * 25);
```

### Service Scoring
Service scores are calculated based on service-specific questions and disruption data. The system creates standardized service score objects:

```javascript
serviceScores[serviceId] = {
  id: serviceId,
  score: 75,         // Overall score
  vulnerability: 65, // Risk level
  opportunity: 80    // Opportunity level
};
```

### Assessment Type-Specific Adjustments
Different assessment types can apply specific adjustments to the scoring algorithm:

- **Agency Assessment**: May apply additional weight to creative services vulnerability
- **In-house Marketing**: May calculate value creation potential rather than valuation

### Critical Improvements
- Modular design allows different scoring logic for different assessment types
- Type-safe data models ensure consistent score objects
- Comprehensive error handling with fallbacks for calculation failures
- Service-specific questions (from `config.questions.serviceSpecific`) are properly scoped to relevant services

## Configuration File Format

### agency-assessment-config.js Structure (Organization Assessment Configuration)
The configuration file is the central source of truth for app settings and contains the following key sections:

```javascript
const config = {
  // Basic app information
  title: "Agency AI Readiness Assessment",
  description: "Evaluate your agency's ability to adapt to AI disruption",
  assessmentType: "agency", // Type of assessment (new field for identifying assessment type)
  
  // Assessment steps and flow control
  steps: [
    { id: "organization-type", label: "Organization Type" }, // Renamed from agency-type for flexibility
    { id: "services", label: "Services" },
    { id: "revenue", label: "Revenue" },
    { id: "questions", label: "Assessment" },
    { id: "email", label: "Your Details" },
    { id: "results", label: "Results" }
  ],
  
  // Available services with metadata
  services: [
    { id: "creative", name: "Creative Services", description: "..." },
    // ...
  ],
  
  // Organization types available for selection
  organizationTypes: [
    { id: "full-service", name: "Full Service", description: "..." },
    // ...
  ],
  
  // Questions organized by dimension
  questions: {
    operational: [ /* questions for operational dimension */ ],
    financial: [ /* questions for financial dimension */ ],
    ai: [ /* questions for AI readiness dimension */ ],
    // IMPORTANT: serviceSpecific must use service IDs that match the services array
    serviceSpecific: {
      "service1": [ /* questions specific to service1 */ ],
      "service2": [ /* questions specific to service2 */ ]
    }
  },
  
  // Disruption data for timeline and vulnerability analysis
  disruptionData: [
    { service: "creative", timeline: [{ year: 2023, description: "..." }, /*...*/] },
    // ...
  ],
  
  // Action plans based on score ranges
  actionPlans: [
    { scoreRange: [0, 30], title: "Urgent Action Required", steps: [/*...*/] },
    // ...
  ],
  
  // Recommendations by organization type
  recommendations: {
    organization_types: [
      { type: "full-service", recommendations: [/* recommendations */] },
      // ...
    ]
  }
};
```

### Question Format
Questions must follow this structure:
```javascript
{
  id: "q1",
  text: "How does your organization approach project management?",
  dimension: "operational",
  weight: 2, // Higher weight = more impact on score
  answers: [
    { id: "a1", text: "We use formal methodologies", value: 4 },
    { id: "a2", text: "We have some processes in place", value: 2 },
    { id: "a3", text: "We handle projects ad hoc", value: 0 }
  ]
}
```

## Sector-Specific Assessment Configuration

### Creating New Assessment Types

The framework is designed to support multiple assessment types for different sectors (Agency Assessment, In-house Marketing Assessment, etc.) by creating specific configuration files:

```
assessment-framework/
├── configs/
│   ├── agency-assessment-config.js   # Organization assessment configuration (name maintained for backward compatibility)
│   ├── inhouse-marketing-config.js   # In-house marketing assessment
│   └── base-config.js                # Shared configuration elements
```

### Configuration Structure for New Sectors

When creating a new sector-specific assessment (e.g., In-house Marketing):

1. **Create a new config file**:
   ```javascript
   // inhouse-marketing-config.js
   const InhouseMarketingConfig = {
     title: "In-house Marketing AI Readiness Assessment",
     description: "Evaluate your marketing team's ability to adapt to AI disruption",
     
     // Steps can be customized or use the same structure
     steps: [ /* same structure as agency assessment */ ],
     
     // Custom services specific to in-house marketing
     services: [
       { id: "content", name: "Content Marketing", description: "..." },
       { id: "social", name: "Social Media", description: "..." },
       { id: "seo", name: "Search Engine Optimization", description: "..." },
       // More in-house marketing services
     ],
     
     // Replace organization types with department types
     departmentTypes: [
       { id: "small-team", name: "Small Team (<5)", description: "..." },
       { id: "mid-size", name: "Mid-size Team (5-15)", description: "..." },
       { id: "enterprise", name: "Enterprise Team (15+)", description: "..." },
     ],
     
     // Sector-specific questions
     questions: {
       operational: [ /* questions tailored to in-house marketing operations */ ],
       financial: [ /* questions about marketing budgets and ROI */ ],
       ai: [ /* AI adoption questions for marketing teams */ ],
       serviceSpecific: [ /* service-specific questions for marketing services */ ]
     },
     
     // Customized disruption data for marketing services
     disruptionData: [ /* marketing-specific AI disruption timeline */ ],
     
     // Tailored action plans for marketing teams
     actionPlans: [ /* marketing-focused action plans */ ],
     
     // Marketing-specific recommendations
     recommendations: {
       "small-team": [ /* recommendations for small marketing teams */ ],
       "mid-size": [ /* recommendations for mid-size marketing teams */ ],
       "enterprise": [ /* recommendations for enterprise marketing teams */ ]
     }
   };
   
   // Export to global namespace
   window.InhouseMarketingConfig = InhouseMarketingConfig;
   ```

2. **Service Mapping**:
   Create clear mapping between service IDs and names to ensure consistent data flow:
   ```javascript
   const serviceIdToNameMap = {
     'content': 'Content Marketing',
     'social': 'Social Media',
     'seo': 'Search Engine Optimization',
     // Additional mappings
   };
   ```

3. **Question Adaptation**:
   - Operational questions should focus on marketing workflows and processes
   - Financial questions should address marketing budgets and ROI metrics
   - AI questions should be tailored to marketing technologies and capabilities

### Implementing the Sector Switch

1. **HTML Configuration**:
   ```html
   <!-- For organization assessment (formerly called agency assessment) -->
   <script src="configs/agency-assessment-config.js"></script>
   <script>
     const assessmentConfig = window.AgencyAssessmentConfig;
   </script>
   
   <!-- For in-house marketing assessment -->
   <script src="configs/inhouse-marketing-config.js"></script>
   <script>
     const assessmentConfig = window.InhouseMarketingConfig;
   </script>
   ```

2. **Dynamic Configuration Loading**:
   ```javascript
   // Load configuration based on assessment type
   function loadConfiguration(assessmentType) {
     const script = document.createElement('script');
     script.src = `configs/${assessmentType}-config.js`;
     script.onload = () => {
       // Initialize with the correct configuration
       const config = window[`${toCamelCase(assessmentType)}Config`];
       initializeAssessment(config);
     };
     document.head.appendChild(script);
   }
   
   // Usage
   loadConfiguration('inhouse-marketing');
   ```

### Sharing Common Elements

To avoid duplication, use a base configuration with shared elements:

```javascript
// base-config.js
const BaseConfig = {
  // Common step structure
  steps: [ /* standard steps */ ],
  
  // Shared scoring formulas and utilities
  scoringUtils: {
    calculateOverallScore: function(dimensions) { /* ... */ },
    calculateRiskCategory: function(score) { /* ... */ }
  },
  
  // Common UI elements
  ui: {
    progressBar: true,
    darkModeSupport: true
  }
};

// Use in specific configs
// inhouse-marketing-config.js
const InhouseMarketingConfig = Object.assign({}, BaseConfig, {
  // Sector-specific overrides and additions
  title: "In-house Marketing Assessment",
  services: [ /* marketing-specific services */ ]
});
```

### Testing Sector-Specific Implementations

1. **Create Test HTML Files**:
   ```
   test-agency-assessment.html
   test-inhouse-marketing.html
   ```

2. **Validation Points**:
   - Verify service-specific scoring works correctly
   - Ensure recommendations are appropriate for the sector
   - Test visualization components with sector data
   - Confirm report terminology matches the sector

3. **Data Migration**:
   Document any data migration needed when moving between assessment types:
   ```javascript
   function convertAgencyToInhouseData(agencyData) {
     // Map agency services to equivalent in-house services
     const serviceMapping = {
       'digital': 'content',
       'design': 'creative',
       // Other mappings
     };
     
     // Transform service selections
     const transformedServices = agencyData.selectedServices.map(service => 
       serviceMapping[service] || service
     );
     
     return {
       ...agencyData,
       selectedServices: transformedServices,
       // Other transformations
     };
   }
   ```

## Initialization Sequence

### Load Order
1. HTML loads with core dependencies (Chart.js, etc.)
2. Core files loaded in this order:
   - `engine.js` - Core state management
   - `renderer.js` - UI rendering system
3. Utility scripts loaded:
   - `validation.js`
   - `scoring.js` 
   - `data-processing.js`
4. Component scripts loaded:
   - Step components (organization-type-selector.js, service-selector.js, etc.)
   - Results components (score-card.js, vulnerability-map.js, etc.)
5. `initializer.js` executed last to bootstrap the application

### Bootstrapping Process
```javascript
// From initializer.js
document.addEventListener('DOMContentLoaded', () => {
  // Load configuration
  const config = window.AgencyAssessmentConfig;
  
  // Create engine instance
  const engine = new window.AssessmentFramework.Core.Engine(config);
  
  // Create renderer instance
  const renderer = new window.AssessmentFramework.Core.Renderer(
    document.getElementById('assessment-container'),
    config,
    engine
  );
  
  // Store references globally
  window.assessmentEngine = engine;
  window.assessmentRenderer = renderer;
  
  // Start assessment
  engine.start();
});
```

## Error Handling Strategy

### Client-Side Error Handling
The framework uses a defensive coding approach with multiple layers of error handling:

1. **Try/Catch Blocks**: Critical operations are wrapped in try/catch:
   ```javascript
   try {
     // Critical operation
   } catch (error) {
     console.error('[ComponentName] Operation failed:', error);
     // Fallback behavior
   }
   ```

2. **Null Checking**: Defensive checks against null/undefined:
   ```javascript
   if (!data || !data.property) {
     console.warn('[ComponentName] Invalid data structure');
     return fallbackValue;
   }
   ```

3. **User Feedback**: Errors are communicated to users when appropriate:
   ```javascript
   // In renderer.js error handling
   this.contentElement.innerHTML = `
     <div class="error-container">
       <h2>Error Displaying Results</h2>
       <p>${userFriendlyMessage}</p>
     </div>
   `;
   ```

4. **Fallback Content**: When components fail to load, fallback content is provided:
   ```javascript
   if (!results) {
     results = {
       // Default values to prevent UI breaks
       scores: { overall: 0, operational: 0, financial: 0, ai: 0 },
       serviceScores: [],
       scoreCategory: 'ERROR',
       valuationRange: 'N/A'
     };
   }
   ```

5. **Component Interface Validation**: Components are validated against their interfaces during initialization:
   ```javascript
   // In renderer.js
   initializeStepComponents() {
     try {
       // Get current step components
       const stepComponents = this.getStepComponents(this.currentStep);
       
       // Initialize each component
       for (const component of stepComponents) {
         // Validate component against interface
         if (window.AssessmentFramework?.Interfaces) {
           const interfaceName = component.interfaceType || 'BaseComponent';
           const interfaceDef = window.AssessmentFramework.Interfaces[interfaceName];
           
           if (interfaceDef && typeof interfaceDef.validateComponent === 'function') {
             const isValid = interfaceDef.validateComponent(component);
             if (!isValid) {
               console.error(`Component failed interface validation: ${component.id}`);
               // Use fallback or show error message
               continue;
             }
           }
         }
         
         // Initialize component
         component.initialize(this.engine, this.contentElement);
       }
     } catch (error) {
       console.error('Failed to initialize components:', error);
       this.showErrorMessage('Component initialization failed');
     }
   }
   ```

### Critical Error Paths

1. **Email to Results Navigation**
   - Multiple fallback methods to ensure navigation works
   - Direct renderer.renderResults() call before event triggering
   - HTML manipulation as last resort to show results container

2. **Scoring Calculation Failures**
   - Fallback to default scores if calculation fails
   - Validation to prevent division by zero
   - Comprehensive error logging

3. **Component Initialization**
   - Optional component loading to prevent fatal errors
   - Availability checks before instantiation

## Component Interface System

The framework uses a standardized component interface system defined in `utils/component-interfaces.js` to ensure all components implement the required methods and properties.

### Base Component Interface
All components must implement the base component interface:

```javascript
// Required properties
- container {HTMLElement}: The container element for the component
- engine {Object}: Reference to the assessment engine

// Required methods
- init(): Initialize component
- render(): Render component UI
- attachEventListeners(): Attach event listeners
- validate(): Validate component state (for input components)
- destroy(): Clean up component resources
```



### Component Validation
Components can be validated against their interface:

```javascript
// Validate that a component implements the required interface
window.AssessmentFramework.Utils.ComponentInterfaces.validateComponent(
  component,
  window.AssessmentFramework.Utils.ComponentInterfaces.ScoreCard,
  'ScoreCard'
);
```

### Step Component Interfaces

#### ServiceSelector Component
- **Interface**: `ComponentInterfaces.ServiceSelector`
- **Required Methods**: `getSelectedServices()`, `setSelectedServices(services)`
- **Input**: `config.services`
- **Output**: Array of selected service IDs

#### RevenueAllocator Component
- **Interface**: `ComponentInterfaces.RevenueAllocator`
- **Required Methods**: `getServiceRevenue()`, `setServiceRevenue(revenue)`, `normalizeRevenue()`
- **Input**: Array of selected service IDs
- **Output**: Object mapping service IDs to revenue percentages

#### QuestionManager Component
- **Interface**: `ComponentInterfaces.QuestionManager`
- **Required Methods**: `getAnswers()`, `setAnswers(answers)`, `areAllQuestionsAnswered()`
- **Input**: `config.questions`
- **Output**: Object mapping question IDs to answer IDs

#### EmailCollector Component
- **Interface**: `ComponentInterfaces.EmailCollector`
- **Required Methods**: `getUserDetails()`, `setUserDetails(details)`, `submitForm()`, `validateForm()`
- **Input**: Form input from user
- **Output**: User contact details object

### Results Component Interfaces

#### ScoreCard Component
- **Interface**: `ComponentInterfaces.ScoreCard`
- **Required Methods**: `createDimensions()`, `printResults()`, `downloadPdf()`
- **Input**: `results.scores`, `results.scoreCategory`, `results.valuationRange`
- **Purpose**: Displays overall score, radar chart, and dimension scores

### Implementation Notes
The Renderer has been updated to validate components against their interfaces:

```javascript
// In renderer.js - initializeStepComponents method
initializeStepComponents(stepType) {
  // Check if component interfaces are available for validation
  const hasComponentInterfaces = window.AssessmentFramework?.Utils?.ComponentInterfaces;
  
  try {
    switch (stepType) {
      case 'services':
        // Create service selector component
        const serviceSelector = new window.AssessmentFramework.Components.ServiceSelector(/* ... */);
        
        // Validate component against interface if available
        if (hasComponentInterfaces) {
          window.AssessmentFramework.Utils.ComponentInterfaces.validateComponent(
            serviceSelector,
            window.AssessmentFramework.Utils.ComponentInterfaces.ServiceSelector,
            'ServiceSelector'
          );
        }
        break;
        
      // Similar validation for other component types...
    }
  } catch (error) {
    // Error handling with user-friendly error messages
    console.error(`[Renderer] Error initializing components for step '${stepType}':`, error);
    
    // Create error message in the step container
    const errorMessage = document.createElement('div');
    errorMessage.className = 'component-error';
    errorMessage.innerHTML = `
      <h3>Component Error</h3>
      <p>There was an error initializing one or more components for this step.</p>
      <p class="error-details">${error.message}</p>
    `;
    
    if (this.currentStepElement) {
      this.currentStepElement.appendChild(errorMessage);
    }
  }
}
```

#### VulnerabilityMap Component
- **Interface**: `ComponentInterfaces.VulnerabilityMap`
- **Required Methods**: `createScatterPlot()`, `getQuadrant(vulnerability, opportunity)`, `updateServicePositions(serviceScores)`
- **Input**: `results.serviceScores`, `results.serviceRevenue`, `config.disruptionData`
- **Purpose**: Visualizes service vulnerability vs. opportunity on a scatter plot

#### Timeline Component
- **Interface**: `ComponentInterfaces.Timeline`
- **Required Methods**: `createTimeline()`, `filterByYearRange(startYear, endYear)`
- **Input**: `state.selectedServices`, `config.disruptionData`
- **Purpose**: Shows timeline of AI disruption for selected services

#### RiskTable Component
- **Interface**: `ComponentInterfaces.RiskTable`
- **Required Methods**: `createTableRows()`, `sortTable(column, ascending)`
- **Input**: `state.selectedServices`, `results.serviceScores`, `results.serviceRevenue`, `config.disruptionData`
- **Purpose**: Lists services with risk scores and revenue allocation

#### ServiceStrategyTable Component
- **Interface**: `ComponentInterfaces.ServiceStrategyTable`
- **Required Methods**: `createStrategies()`, `getServiceStrategy(serviceId)`
- **Input**: `results.serviceScores`, `results.serviceRevenue`
- **Purpose**: Provides strategic recommendations based on vulnerability map quadrants

## Data Flow

The assessment framework follows a structured data flow pattern to maintain consistency and reliability across different assessment types. A detailed data flow diagram and sequence description is available at:

- [Data Flow Diagram](./documentation-resources/data-flow.md)

The diagram illustrates how data moves through the system, from configuration loading through user input collection, state persistence, results calculation, and finally results rendering.

### Key Data Transformations

```
// Service selection to revenue allocation
ServiceSelector → Engine → RevenueAllocator
[service1, service2] → state.selectedServices → {service1: 60, service2: 40}

// User answers to dimension scores
QuestionManager → Engine → ScoringSystem
{q1: a2, q2: a1} → state.answers → {operational: 65, financial: 70, ai: 55}

// Complete results flow
Engine.getResults() → ScoringSystem.calculateResults() → Results → Renderer.renderResults() → UI
```

## Implementation Status

### Completed Implementations

1. **Storage Manager Integration (core/engine.js)**
   - ✅ Engine constructor updated to use StorageManager
   - ✅ Engine methods updated to use storage.save() and storage.load()
   - ✅ Data version tracking added for migration support
   - ❌ Legacy localStorage calls still exist and need migration

2. **Component Interface Validation (core/renderer.js)**
   - ✅ Component validation in initializeStepComponents method
   - ✅ Error handling for component initialization failures
   - ✅ Documentation added for result component interfaces
   - ❌ Result components not yet updated for interface validation

3. **Modular Scoring System Integration (core/engine.js)**
   - ✅ getResults() now tries to use ScoringSystem first
   - ✅ Falls back to legacy scoring when modular system unavailable
   - ✅ scoring.js updated to use modular system

4. **Dynamic Report Customization (core/renderer.js)**
   - ✅ Component registry system documented for different assessment types
   - ✅ Configuration override option for custom component selection
   - ✅ Standardized component data contract for result components
   - ✅ Implementation of dynamic component loading in renderer.js

### Pending Implementations

1. **Data Models Full Integration**
   - 🔄 Data model validation partially implemented
   - 📝 Normalize service and question data consistently
   - 📝 Implement proper data migration logic

2. **Component Interface Implementation**
   - 📝 Update actual component implementations to properly implement interfaces
   - 📝 Ensure ServiceSelector, RevenueAllocator and other components follow interface contracts
   - 📝 Implement comprehensive error handling in all components

3. **Complete Engine-Storage Integration**
   - 📝 Remove all direct localStorage calls and replace with StorageManager
   - 📝 Implement proper state migration for existing users
   - 📝 Add upgrade path from version 1 to version 2

### Known Issues to Address

1. **Service-specific Questions**  
   The 'serviceSpecific' questions block must be present in all assessment configuration files. This block is essential for the scoring logic which depends on `config.questions.serviceSpecific`.
   
   **IMPORTANT**: The serviceSpecific questions must be structured as follows:
   ```javascript
   questions: {
     // Other question blocks...
     serviceSpecific: {
       "serviceId1": [ /* questions for this service */ ],
       "serviceId2": [ /* questions for this service */ ]
     }
   }
   ```
   
   The service IDs used as keys MUST match exactly with the service IDs defined in the services array of the configuration. Using full service names or mismatched IDs will cause scoring errors.

2. **Revenue Calculations**  
   Revenue percentage calculations should be standardized through the data models to ensure consistency between services selection, revenue allocation, and results display.

3. **Results Component Data Dependencies**  
   Results components have specific data dependencies that must be respected:
   - ScoreCard: needs `results.scores`, `results.scoreCategory`, `results.valuationRange`
   - VulnerabilityMap: needs `results.serviceScores`, `results.serviceRevenue`, `config.disruptionData`
   - Timeline: needs `state.selectedServices`, `config.disruptionData`
   - RiskTable: needs `state.selectedServices`, `results.serviceScores`, `results.serviceRevenue`, `config.disruptionData`

## Backward Compatibility Considerations

The framework maintains backward compatibility with previous versions through several mechanisms:

### 1. Terminology Changes: Agency-Type to Organization-Type

Recent updates changed terminology from "agency-type" to "organization-type" for greater flexibility. The code supports both versions:

```javascript
// In renderer.js
switch (step) {
  // ...
  case 'organization-type':
  case 'agency-type': // Support for backward compatibility
    this.renderAgencyTypeSelection(stepElement);
    break;
  // ...
}
```

### 2. State Data Structure 

The engine maintains backward compatibility by supporting both new and legacy property names:

```javascript
// In engine.js
function getState() {
  return {
    currentStep: this.currentStep,
    selectedServices: this.selectedServices,
    serviceRevenue: this.serviceRevenue,
    organizationType: this.organizationType, // New property name
    agencyType: this.organizationType,      // Legacy property name for compatibility
    answers: this.answers,
    userDetails: this.userDetails
  };
}
```

### 3. Configuration Properties

The framework supports both old and new property names in configuration files:

```javascript
// In renderer.js
const typeOptions = this.config.organizationTypes || this.config.agencyTypes;
```

### 4. Validation Safety Checks

The validation system has been enhanced with safety checks to prevent errors with older data formats:

```javascript
// In validateCurrentStep method
case 'questions':
  // Make sure answers object exists before checking it
  if (!state.answers) {
    alert('Please answer all questions before proceeding');
    return false;
  }
  const unansweredQuestions = questions.filter(q => state.answers[q.id] === undefined);
  // ...
```

## Critical User Flows

### Assessment Completion Flow
1. User selects organization type
2. User selects services offered
3. User allocates revenue percentages to services
4. User answers assessment questions
5. User enters contact information
6. System calculates scores and generates report
7. User views comprehensive report with visualizations and recommendations

### Email to Results Navigation
The navigation from email collection to results display is a critical path:
1. Email form validated in `email-collector.js` 
2. User details saved to engine state
3. Results calculated via engine's `getResults()` method
4. Renderer's `renderResults()` method called directly
5. Engine triggers 'complete' event with results data
6. Results page displayed with all visualization components

## Common Issues and Solutions

### Email to Results Navigation
- **Issue**: Users sometimes get stuck on email page without proceeding to results
- **Solution**: Direct call to renderer.renderResults() before event triggering

### Form Validation Bypass
- **Issue**: Users could bypass validation on email collection form
- **Solution**: Enhanced validation in email-collector.js and engine.js

### Revenue Percentages
- **Issue**: Revenue percentages sometimes not accurately reflected in risk table
- **Solution**: Direct calculation from raw slider values

### Initialization Errors
- **Issue**: Some components fail to initialize due to missing dependencies
- **Solution**: Added checks for optional components and better error handling

## Custom Component Events

### Engine Events
- `step-change`: Triggered when moving between steps
- `complete`: Triggered when assessment is completed with results data
- `service-selected`: Triggered when services are selected
- `service-revenue-updated`: Triggered when revenue is allocated 
- `answer-updated`: Triggered when a question is answered

## Visualization Components

### Comprehensive Assessment Report

The assessment framework now includes a comprehensive report that integrates all visualizations in a logical flow, with the agency's name and today's date at the top. This is implemented in `components/results/assessment-report.js` and provides:

1. **Professional Layout**: Clean, organized presentation with consistent styling
2. **Visual Hierarchy**: Important information stands out through careful typography and spacing
3. **Comprehensive Analysis**: All key visualizations with explanatory text
4. **Actionable Insights**: Clear next steps and recommendations
5. **Dual View Options**: Interactive dashboard or comprehensive report views

The report includes the following sections:

```javascript
createReportSections() {
    // 1. Radar Chart Section - Agency Resilience Profile
    this.createRadarChartSection();
    
    // 2. Valuation Projection Section - Future Valuation Scenarios
    this.createValuationProjectionSection();
    
    // 3. Vulnerability Map Section - Service Vulnerability Analysis
    this.createVulnerabilityMapSection();
    
    // 4. Action Matrix Section - Recommended Actions
    this.createActionMatrixSection();
    
    // 5. Add Additional Resources Section
    this.createAdditionalResourcesSection();
}
```

### Action Priority Matrix

The action matrix component provides a prioritized action matrix based on impact and effort. It's implemented in `components/results/action-matrix.js` and uses Chart.js to create a 2x2 grid visualization with these quadrants:

- **DO FIRST**: High impact, low effort (top priority)
- **PLAN**: High impact, high effort (strategic importance)
- **DELEGATE**: Low impact, low effort (can be delegated)
- **ELIMINATE**: Low impact, high effort (consider dropping)

Actions are dynamically generated based on assessment scores:

```javascript
generateActions(results) {
    const overallScore = results.scores.overall;
    const aiScore = results.scores.ai;
    const operationalScore = results.scores.operational;
    const financialScore = results.scores.financial;
    const serviceVulnerability = results.scores.serviceVulnerability;
    
    // Base set of actions...
    
    // Conditional actions based on scores
    if (aiScore < 40) {
        actions.push({
            title: 'Establish AI learning program',
            impact: 0.9,
            effort: 0.6,
            quadrant: 'plan',
            priority: 2
        });
    }
    
    // More conditional actions...
}
```

### Results Controller

The results controller coordinates the rendering of all visualization components with robust error handling. It's implemented in `components/results/results-controller.js` and ensures safe initialization of all chart components, with proper data preparation and error handling.

### Chart.js Implementation

The assessment tool uses Chart.js for several critical visualizations:

1. **Radar Chart** (score-card.js)
   ```javascript
   const radarConfig = {
     type: 'radar',
     data: {
       labels: dimensions.map(d => d.label),
       datasets: [
         {
           label: 'Your Agency',
           data: dimensions.map(d => d.value),
           backgroundColor: 'rgba(74, 144, 226, 0.2)',
           borderColor: 'rgba(74, 144, 226, 1)',
           pointBackgroundColor: 'rgba(74, 144, 226, 1)'
         },
         {
           label: 'Industry Benchmark',
           data: dimensions.map(d => d.benchmark || 50),
           backgroundColor: 'rgba(200, 200, 200, 0.2)',
           borderColor: 'rgba(200, 200, 200, 0.8)',
           pointBackgroundColor: 'rgba(200, 200, 200, 1)'
         }
       ]
     },
     options: {...}
   };
   ```

2. **Scatter Plot** (vulnerability-map.js)
   ```javascript
   const scatterConfig = {
     type: 'scatter',
     data: {
       datasets: [{
         data: dataPoints,
         backgroundColor: colors,
         radius: bubbleSizes
       }]
     },
     options: {
       scales: {
         x: {
           title: { display: true, text: 'Risk' },
           min: 0,
           max: 100
         },
         y: {
           title: { display: true, text: 'Opportunity' },
           min: 0,
           max: 100
         }
       }
     }
   };
   ```

### Error Retry Mechanism
For Chart.js components, we've implemented a retry mechanism to handle race conditions in rendering:

```javascript
function createChartWithRetry(ctx, config, attempts = 0) {
  try {
    return new Chart(ctx, config);
  } catch (error) {
    if (attempts < 3) {
      console.warn(`Chart creation failed, retrying (${attempts + 1}/3)...`, error);
      setTimeout(() => {
        createChartWithRetry(ctx, config, attempts + 1);
      }, 200);
    } else {
      console.error('Chart creation failed after multiple attempts:', error);
      // Fallback UI
    }
  }
}
```

## Debugging Procedures

### Common Issues and Troubleshooting

1. **Email Form to Results Navigation Failure**
   - Check browser console for errors in email-collector.js
   - Verify that the 'complete' event is being triggered (should see console log)
   - Confirm the renderer.renderResults() method is being called
   - Check that results data object contains all required properties

2. **Revenue Percentages Not Showing**
   - Look for data mapping issues between service names in different components
   - Verify the revenue allocator is properly normalizing percentages to 100%
   - Check that the data is being passed correctly to the risk table component

3. **Missing Chart.js Visualizations**
   - Verify Chart.js library is properly loaded
   - Check for DOM element availability before chart initialization
   - Look for CSS sizing issues (container must have height/width)

4. **Scoring Calculation Issues**
   - Verify config.questions.serviceSpecific exists and is properly formatted
   - Check that answers are being stored correctly in engine state
   - Trace through scoring.js calculation logic for formula errors

### Console Log Standards
To aid debugging, all components use a consistent logging format:
```javascript
console.log('[ComponentName] Descriptive message:', data);
console.error('[ComponentName] Error description:', error);
```

## Recently Fixed Issues

### 1. Fatal Error in Results Rendering
**Issue**: Fatal reference error when rendering results: "Can't find variable: componentData".

**Solution**:
- Created a new `ResultsController` component that safely manages all result components
- Added proper data preparation that ensures all required properties exist before use
- Implemented comprehensive error handling and fallbacks for all data fields
- Added component existence checks before initialization
- Fixed the navigation between interactive dashboard and comprehensive report views

### 2. Service-Specific Questions Not Appearing
**Issue**: When selecting services, the corresponding service-specific questions weren't showing up.

**Solution**:
- Enhanced the engine's service matching algorithm in the `getQuestions()` method
- Implemented mapping between service IDs and display names
- Added support for direct matches, display name matches, and case-insensitive matches
- Improved logging to provide better visibility into the question loading process
- Ensured that all selected services properly pull in their specific questions

### 3. Email Form Bypass and Navigation
**Issue**: Users could bypass form validation and wouldn't be properly directed to results.

**Fix**: 
- Enhanced form validation with proper error display
- Added focus on first invalid field
- Changed navigation flow to trigger 'complete' event directly
- Added direct call to renderer.renderResults() before event triggering

### 2. Revenue Percentages Display
**Issue**: Revenue percentages weren't showing correctly in the risk table.

**Fix**:
- Implemented direct calculation from raw slider values
- Created standardized service name mapping between components
- Added code to ensure percentages always add up to exactly 100%

### 3. Scoring Algorithm
**Issue**: Bad answers didn't properly lower scores.

**Fix**: 
- Rewrote algorithm with proper weighting
- Added validation to prevent division by zero
- Fixed handling of unanswered questions

### 4. Action Buttons Duplication
**Issue**: Error in score-card.js due to duplicate action buttons implementation.

**Fix**:
- Removed duplicate code for adding action buttons
- Ensured proper initialization of print and download functionality

### 5. Service Strategy Table
**Issue**: New component for strategy recommendations was causing initialization errors.

**Fix**:
- Made component optional in validation checks
- Added error handling for initialization
- Used consistent color system with the rest of the UI

## Latest Framework Update (May 2025)

After a comprehensive review of the assessment framework codebase, several critical issues were identified and fixed:

### 1. Fixed Component Registry Implementation
- Successfully implemented the dynamic component loading system in renderer.js
- Ensured proper error handling and fallbacks for component initialization
- Fixed the passing of disruptionData to the RiskTable component (addressing the issue with Risk Table not displaying services)

### 2. Terminology Consistency Updates
- Fixed the AgencyTypeSelector component to use setOrganizationType() instead of setAgencyType()
- Updated all references in the component from "agency type" to "organization type"
- Maintained backward compatibility in all critical areas

### 3. Verified Critical Configuration Presence
- Confirmed the serviceSpecific questions block is present in the agency-assessment-config.js file
- The block contains proper question definitions for various services, addressing the previously missing block issue

### 4. Documentation Improvements
- Added comprehensive backward compatibility documentation
- Updated terminology throughout the documentation
- Added details about the component data contract and interfaces

### 5. Additional Robustness Improvements
- Added null checking in the validateCurrentStep method
- Added empty string fallbacks for organizationType to prevent undefined errors
- Added support for both step IDs throughout the codebase

### Resolved Outstanding Concerns

The following issues have been addressed as part of the May 2025 update:

#### 1. Revenue Allocator Component 
- Fixed issue with duplicate service entries in the revenue allocator
- Added secondary validation to ensure percentages always add up to exactly 100%
- Implemented smart adjustment that modifies the largest value to compensate for rounding errors
- Improved standardization of service keys for consistent data across components

#### 2. Dark Mode Compatibility 
- Implemented a dark mode observer that preserves navigation state when toggling themes
- Created a specialized `_updateDarkModeStyles()` method that selectively updates styles without re-rendering the UI
- Added special handling for tables and chart.js visualizations in dark mode
- Fixed issue where dark mode toggle would reset the user's current step

#### 3. Chart Visualizations 
- Enhanced radar chart creation with better dimension handling
- Added automatic canvas dimension correction for zero-width/height issues
- Implemented retry mechanism for Chart.js initialization failures
- Improved error reporting and fallback display for chart rendering problems

#### 4. API Consistency Improvements
- Fixed validateCurrentStep method to correctly use the engine's documented API
- Ensured proper step validation using the engine's getState() method
- Improved renderer compatibility with the engine's state management
- Added logging to help with troubleshooting step transitions

These improvements ensure a functional, robust system that handles different assessment types dynamically, properly manages terminology changes with backward compatibility, and correctly loads and displays all result components based on assessment type.

## Notes on Dark Mode
The assessment tool supports both light and dark themes with consistent visual identity:
- Yellow accents against dark backgrounds in the "obsolete" theme
- Both themes maintain consistent color schemes for visualizations
- Progress indication is handled by the yellow underline beneath category tabs
- Table styling includes proper zebra striping with good contrast for readability

## Dependency Management

### External Dependencies

| Library | Version | Purpose | CDN Path |
|---------|---------|---------|----------|
| Chart.js | 3.9.1 | Data visualizations | https://cdn.jsdelivr.net/npm/chart.js@3.9.1/dist/chart.min.js |
| Chart.js Annotation | 2.1.0 | Quadrant annotations on vulnerability map | https://cdn.jsdelivr.net/npm/chartjs-plugin-annotation@2.1.0/dist/chartjs-plugin-annotation.min.js |

### Plugin Registration
The assessment tool requires proper registration of Chart.js plugins:

```javascript
// Fix for Chart annotation plugin - required to prevent initialization errors
window.ChartAnnotation = window._annotationPlugin;
if (window.Chart && window.ChartAnnotation) {
  Chart.register(window.ChartAnnotation);
}
```

### Version Compatibility

- **Chart.js**: Must use version 3.x for compatibility with annotation plugin 2.x
- **Browser minimum**: ES6 support required (IE11 not supported)
- **Local storage**: Requires 5MB minimum for storing assessment state

### Internal Dependencies
Component load order dependencies:

```
engine.js → renderer.js → components
```

Critical path: The `engine` must be created and available before any component initialization.

## Cross-Browser Compatibility

### Tested Browsers

| Browser | Version | Status | Known Issues |
|---------|---------|--------|---------------|
| Chrome | 90+ | ✅ Full support | None |
| Firefox | 88+ | ✅ Full support | None |
| Safari | 14+ | ⚠️ Partial support | Chart rendering delays, requires retry mechanism |
| Edge | 88+ | ✅ Full support | None |
| IE | Any | ❌ Not supported | Numerous ES6 compatibility issues |

### Browser-Specific Workarounds

#### Safari Chart Rendering
The retry mechanism for chart rendering is specifically designed to address Safari's delayed canvas context availability:

```javascript
// Safari-specific check for chart rendering
if (/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
  // Increase retry delay for Safari
  retryDelay = 500; // ms
}
```

### Testing Protocol
Before deploying updates, test on:
1. Chrome (Windows/Mac)
2. Firefox (Windows/Mac)
3. Safari (Mac/iOS)
4. Edge (Windows)

Focus testing on the following areas when testing cross-browser:
1. Chart.js rendering in all visualization components
2. Form validation behavior
3. LocalStorage persistence
4. CSS transitions and animations
5. Email-to-results navigation

## Performance Considerations

### Memory Management

#### Large Dataset Handling
When handling many services (>15), the application employs these optimizations:

```javascript
// For vulnerability map with many services
if (services.length > 15) {
  // Reduce animation duration to prevent performance issues
  chartOptions.animation.duration = 200;
  
  // Reduce point radius for better visualization
  chartOptions.elements.point.radius = Math.max(3, 10 - (services.length / 3));
  
  // Use more efficient label rendering
  chartOptions.plugins.tooltip.enabled = false;
  chartOptions.plugins.legend.display = false;
}
```

#### Canvas Optimization
Render optimizations for Chart.js:

```javascript
// Performance optimization for Chart.js
chartOptions.responsive = true;
chartOptions.maintainAspectRatio = false;
chartOptions.animation = {
  duration: window.innerWidth < 768 ? 200 : 800
};
```

### Lazy Loading
Components are lazy-loaded based on the current step to reduce initial load time:

```javascript
// Only load results components when needed
if (step === 'results') {
  // Dynamically import results components
  const scriptElement = document.createElement('script');
  scriptElement.src = `components/results/${componentName}.js`;
  document.head.appendChild(scriptElement);
}
```

### Resource Caching
Local caching strategies:
- Assessment state is cached in localStorage after each step
- User selections are cached to prevent data loss on refresh
- Config data is cached after first load to speed up subsequent assessments

## Security Considerations

### Input Validation

All user inputs are validated on both client and server side:

```javascript
// Client-side validation for email inputs
function validateEmail(email) {
  // Basic validation
  if (!email || email.trim() === '') return false;
  
  // Use strict regex pattern to prevent XSS
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
  
  // Secondary validation uses HTML5 input type="email"
}
```

### XSS Prevention
Measures to prevent cross-site scripting:

1. All user inputs are sanitized before display:
   ```javascript
   function sanitizeHTML(text) {
     const element = document.createElement('div');
     element.textContent = text;
     return element.innerHTML;
   }
   ```

2. Content Security Policy implementation:
   ```html
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline'">
   ```

### LocalStorage Security
Secure handling of localStorage data:

1. No sensitive data stored in localStorage (only assessment answers, no PII)
2. All stored data is validated before use:
   ```javascript
   try {
     const storedData = JSON.parse(localStorage.getItem('key'));
     if (!isValidStructure(storedData)) {
       throw new Error('Invalid data structure');
     }
     return storedData;
   } catch (e) {
     // Handle error, use fallback
     return defaultValue;
   }
   ```

### Third-Party Libraries
Security considerations for dependencies:
- Chart.js and plugins are loaded from trusted CDNs with integrity checks
- Version pinning used to prevent automatic updates with potential vulnerabilities

## Deployment Workflow

### Build Process

1. **Development Environment**
   - Files served directly via Python HTTP server for testing
   - No build step required for development

2. **Staging Deployment**
   - Manual file copy to staging server
   - Test suite run against staging environment
   - Integration testing with WordPress if applicable

3. **Production Deployment**
   - Deployment checklist verification
   - Files copied to production server
   - Cache headers configured for optimal performance
   - Post-deployment smoke tests

### Deployment Checklist

- [ ] All JavaScript files minified
- [ ] Chart.js version compatibility verified
- [ ] localStorage compatibility tested
- [ ] Cross-browser testing completed
- [ ] Email-to-results navigation verified
- [ ] All console errors resolved
- [ ] Performance tested with 20+ services

### Rollback Procedure

In case of critical issues post-deployment:

1. Immediately restore previous version from backup
2. Notify users of maintenance via status page
3. Diagnose issue in staging environment
4. Release hotfix through standard deployment process

## Version Control Strategy

### Branching Model

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/XXX` - Individual feature branches
- `hotfix/XXX` - Emergency fixes for production

### Commit Standards

Commit messages follow the format:
```
[component] Short description

Detailed explanation if needed
```

Example:
```
[email-collector] Fix validation bypass issue

Updated form submission to properly validate all fields
and prevent users from proceeding with invalid inputs
```

### Release Tagging

Releases follow semantic versioning (MAJOR.MINOR.PATCH):
- `MAJOR`: Breaking changes
- `MINOR`: New features, backward compatible
- `PATCH`: Bug fixes, backward compatible

Tag example: `v1.2.3`

## WordPress Integration

### Implementation Details

The assessment framework integrates with WordPress/Divi via:

1. **Shortcode Integration**
   ```php
   [agency_assessment id="default" theme="obsolete"]
   ```

2. **Script Loading**
   The `wordpress-integration.html` template contains placeholders that are replaced with actual paths during WordPress integration:
   ```html
   <script src="[THEME_PATH]/core/engine.js"></script>
   ```

### Path Configuration

Paths must be correctly configured in the WordPress environment:

```javascript
// WordPress path configuration
const THEME_PATH = '/wp-content/themes/divi-child/assessment-framework';
const SCRIPTS_PATH = THEME_PATH + '/scripts';

// Replace all path placeholders
document.querySelectorAll('script[src*="[THEME_PATH]"]').forEach(script => {
  script.src = script.src.replace('[THEME_PATH]', THEME_PATH);
});
```

### WordPress-Specific Considerations

1. **Isolation from Theme JS**
   - The assessment framework uses namespaced functions and variables
   - All components are initialized only within assessment container

2. **CSS Conflict Prevention**
   - All styles use specific prefixes (`.assessment-*`)
   - Specificity increased to override theme styles

3. **Compatibility Mode**
   - Detection code for older WordPress versions
   - Fallbacks for jQuery dependencies if needed

## Event Loop Considerations

### Race Conditions

The application uses several techniques to prevent JavaScript event loop race conditions:

1. **Deferred Initialization**
   ```javascript
   // Wait for DOM to be fully ready
   document.addEventListener('DOMContentLoaded', () => {
     // Further defer component initialization
     setTimeout(() => {
       initializeComponent();
     }, 0);
   });
   ```

2. **Event Debouncing**
   ```javascript
   // Prevent multiple rapid executions
   let debounceTimer;
   element.addEventListener('input', (e) => {
     clearTimeout(debounceTimer);
     debounceTimer = setTimeout(() => {
       processInput(e.target.value);
     }, 300);
   });
   ```

3. **State Change Synchronization**
   ```javascript
   // Ensure state updates complete before rendering
   this.engine.on('state-updated', () => {
     // Use promise to ensure state is fully updated
     Promise.resolve().then(() => {
       this.render();
     });
   });
   ```

### Microtask Handling

Careful management of the event loop and microtasks:

```javascript
// Proper microtask sequencing
Promise.resolve().then(() => {
  // Update state first
  updateState();
}).then(() => {
  // Then trigger events
  triggerEvents();
}).then(() => {
  // Finally update UI
  updateUI();
});
```

## Accessibility Compliance

### WCAG Compliance Level

The assessment tool aims for **WCAG 2.1 Level AA** compliance.

### Implemented Accessibility Features

1. **Keyboard Navigation**
   - All interactive elements are focusable
   - Logical tab order maintained
   - Skip-to-content functionality
   - Custom keyboard shortcuts documented

2. **Screen Reader Support**
   - Proper ARIA labels for interactive elements
   - Meaningful alt text for images
   - Chart data available in alternative text format
   - Live regions for dynamic content

3. **Visual Considerations**
   - Color is never the sole means of conveying information
   - Contrast ratios meet WCAG AA standards
   - Text resizing supported up to 200%
   - Animation can be disabled via prefers-reduced-motion

### Accessibility Implementation

```javascript
// Example of accessible chart implementation
chartElement.setAttribute('role', 'img');
chartElement.setAttribute('aria-label', 'Radar chart showing scores for operational, financial, and AI readiness dimensions');

// Create text alternative
const textSummary = document.createElement('div');
textSummary.className = 'sr-only';
textSummary.textContent = `Your scores: Operational: ${scores.operational}%, Financial: ${scores.financial}%, AI Readiness: ${scores.ai}%`;
chartContainer.appendChild(textSummary);
```

## Error Codes and Logging

### Error Code System

| Code | Category | Description | Resolution |
|------|----------|-------------|------------|
| E001 | Initialization | Engine failed to initialize | Check config object structure |
| E002 | Data Loading | Failed to load saved state | Clear localStorage and retry |
| E003 | Component | Component failed to render | Check DOM element availability |
| E004 | Chart | Chart.js failed to render | Verify canvas context and retry |
| E005 | Navigation | Failed to navigate to step | Check step ID validity |
| E006 | Validation | Form validation failed | Check error details for field |
| E007 | Calculation | Score calculation error | Verify answer data structure |
| E008 | Storage | LocalStorage write failed | Check browser storage permissions |

### Structured Logging

```javascript
// Structured error logging
function logError(code, component, message, data) {
  console.error({
    timestamp: new Date().toISOString(),
    code: code,
    component: component,
    message: message,
    data: data
  });
  
  // Also log to monitoring service in production
  if (environment === 'production' && window.errorMonitor) {
    window.errorMonitor.captureError(code, message, data);
  }
}

// Usage
logError('E004', 'ScoreCard', 'Chart rendering failed', { canvasId: 'radarChart' });
```

## Testing Strategy

### Unit Testing

Unit tests focus on critical calculation and utility functions:

```javascript
// Example unit test for scoring algorithm
describe('Scoring Algorithm', () => {
  test('calculates dimension score correctly', () => {
    const answers = { 'q1': 'a2', 'q2': 'a1' };
    const questions = [
      { id: 'q1', weight: 2, answers: [{id: 'a1', value: 4}, {id: 'a2', value: 2}] },
      { id: 'q2', weight: 1, answers: [{id: 'a1', value: 3}, {id: 'a2', value: 1}] }
    ];
    
    const score = calculateDimensionScore(answers, questions, 'operational');
    expect(score).toBe(70); // (2*2 + 3*1) / (2+1) * 100 = 70
  });
});
```

### Integration Testing

Integration tests focus on component interactions and critical user flows:

1. **Email to Results Flow Test**
   - Submit email form with valid data
   - Verify navigation to results page
   - Check all visualization components render

2. **State Persistence Test**
   - Complete partial assessment
   - Refresh page
   - Verify state is properly restored

### Automated Test Suite

Key automated test scenarios:

- Form validation logic for all input types
- Navigation between all assessment steps
- Scoring calculation accuracy for various answer combinations
- Revenue allocation normalization
- Chart rendering with various dataset sizes
- Results generation with complete and partial data

## API Rate Limiting

### Local Processing

The assessment tool primarily operates client-side to avoid API rate limits:

- Scoring calculations performed in-browser
- Results stored in localStorage
- No external API dependencies for core functionality

### WordPress API Considerations

If using WordPress REST API for storing results:

```javascript
// Implement exponential backoff for WordPress API requests
async function submitToWordPress(data, retries = 3) {
  try {
    const response = await fetch('/wp-json/assessment/v1/results', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
    });
    
    if (response.status === 429) { // Too Many Requests
      if (retries > 0) {
        const backoffTime = Math.pow(2, 4-retries) * 1000;
        await new Promise(resolve => setTimeout(resolve, backoffTime));
        return submitToWordPress(data, retries - 1);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error('API submission failed', error);
    // Store locally as fallback
    localStorage.setItem('pendingSubmission', JSON.stringify(data));
  }
}
```

### Batch Processing

For bulk operations, implement batch processing to respect rate limits:

```javascript
// Process items in batches to respect rate limits
async function processBatch(items, batchSize = 10, delayMs = 1000) {
  const results = [];
  
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processItem));
    results.push(...batchResults);
    
    if (i + batchSize < items.length) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return results;
}
```

## Mobile Responsiveness

### Responsive Design Strategy

The assessment tool uses a mobile-first responsive design approach:

```css
/* Base styling for mobile */
.assessment-container {
  width: 100%;
  padding: 1rem;
}

/* Tablet breakpoint */
@media (min-width: 768px) {
  .assessment-container {
    padding: 2rem;
  }
}

/* Desktop breakpoint */
@media (min-width: 1024px) {
  .assessment-container {
    max-width: 1200px;
    margin: 0 auto;
  }
}
```

### Mobile-Specific Components

Components adapt for mobile contexts:

```javascript
// Detect mobile context
const isMobile = window.innerWidth < 768;

// Adjust chart sizing for mobile
if (isMobile) {
  chartOptions.aspectRatio = 1;
  chartOptions.legend.position = 'bottom';
  chartOptions.legend.labels.boxWidth = 10;
  chartOptions.legend.labels.padding = 10;
}

// Simplified tooltips for touch interaction
chartOptions.plugins.tooltip = {
  enabled: true,
  displayColors: !isMobile,
  callbacks: {
    label: function(context) {
      // Simpler label for mobile
      if (isMobile) {
        return `${context.dataset.label}: ${context.parsed.y}`;
      }
      // Full label for desktop
      return `${context.dataset.label}: ${context.parsed.y} (${additionalInfo})`;
    }
  }
};
```

### Touch Interaction

Specialized handling for touch devices:

```javascript
// Enhanced touch targets
if ('ontouchstart' in window) {
  // Increase clickable area size
  const buttons = document.querySelectorAll('.nav-button, .form-checkbox');
  buttons.forEach(button => {
    button.style.minHeight = '44px';
    button.style.minWidth = '44px';
  });
  
  // Add touch-specific event handlers
  document.addEventListener('touchstart', handleTouchStart);
}
```

## Custom Extensions

### Plugin Architecture

The assessment framework supports custom extensions via a plugin system:

```javascript
// Plugin registration system
window.AssessmentFramework.plugins = window.AssessmentFramework.plugins || {};

// Register a custom plugin
window.AssessmentFramework.registerPlugin = function(name, options) {
  this.plugins[name] = options;
  
  // Hook into lifecycle events if provided
  if (options.onInit && this.engine) {
    options.onInit(this.engine);
  }
};

// Example custom plugin
window.AssessmentFramework.registerPlugin('customReporting', {
  name: 'Custom Reporting Extension',
  version: '1.0.0',
  onInit: function(engine) {
    // Hook into engine events
    engine.on('complete', generateCustomReport);
  },
  generateCustomReport: function(results) {
    // Custom reporting logic
  }
});
```

### Extension Points

The framework provides these extension points:

1. **Engine Events**
   - Hook into any engine event to extend functionality

2. **Custom Result Processors**
   - Register additional processors for assessment results

3. **UI Component Extensions**
   - Add custom UI components to any assessment step

4. **Custom Scoring Logic**
   - Override or extend the default scoring algorithm

### Custom Component Creation

Template for creating custom components:

```javascript
class CustomComponent {
  constructor(container, engine) {
    this.container = container;
    this.engine = engine;
    this.init();
  }
  
  init() {
    // Initialize your component
    this.render();
    this.attachEventListeners();
  }
  
  render() {
    // Render your component's UI
  }
  
  attachEventListeners() {
    // Add event listeners
  }
}

// Register component globally
window.AssessmentFramework.Components.CustomComponent = CustomComponent;
```

## Internationalization

### Language Support

The framework uses a simple translation system:

```javascript
// Translation system
window.AssessmentFramework.i18n = {
  locale: 'en',
  translations: {
    'en': {
      'NEXT': 'Next',
      'PREVIOUS': 'Previous',
      'SUBMIT': 'Submit',
      // Other translations
    },
    'fr': {
      'NEXT': 'Suivant',
      'PREVIOUS': 'Précédent',
      'SUBMIT': 'Soumettre',
      // Other translations
    }
    // Other languages
  },
  
  // Get translated string
  t: function(key) {
    const locale = this.locale;
    if (this.translations[locale] && this.translations[locale][key]) {
      return this.translations[locale][key];
    }
    return this.translations['en'][key] || key;
  },
  
  // Set locale
  setLocale: function(locale) {
    if (this.translations[locale]) {
      this.locale = locale;
      // Trigger re-render
      if (window.assessmentEngine) {
        window.assessmentEngine.rerender();
      }
    }
  }
};

// Usage
const submitButton = document.createElement('button');
submitButton.textContent = window.AssessmentFramework.i18n.t('SUBMIT');
```

### RTL Support

Right-to-left language support:

```css
/* RTL support */
[dir="rtl"] .assessment-container {
  /* RTL-specific styling */
  text-align: right;
}

[dir="rtl"] .nav-button.previous::before {
  transform: rotate(180deg);
}

[dir="rtl"] .service-item {
  padding-right: 2rem;
  padding-left: 0;
}
```

### Date and Number Formatting

Localized formatting for dates and numbers:

```javascript
// Format number based on locale
function formatNumber(num, locale = 'en-US') {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0
  }).format(num);
}

// Format date based on locale
function formatDate(date, locale = 'en-US') {
  return new Intl.DateTimeFormat(locale).format(date);
}
```
