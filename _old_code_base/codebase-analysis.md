# Clause's Assessment Framework Refactoring Plan

## Current Status

The assessment framework is 90% of the way to a modular architecture. It's currently crashing because of component registry initialization issues.

## The Fix: Safe, Parallel Implementation

### 1. Create "Clause-refactored-broken" directory

This keeps the existing system intact while we work on fixes:

```bash
# Create separate test directory structure
mkdir -p Clause-refactored-broken/assets

# Copy (don't move) existing files
cp -r assets/* Clause-refactored-broken/assets/
```

### 2. Fix the Component Registry

The root cause is the initialization sequence causing circular dependencies. The solution is two-phase initialization:

```javascript
// Clause-refactored-broken/assets/js/core/component-registry.js
class ComponentRegistry {
  constructor() {
    this.components = {};
    this.instances = {};
    this.initializationQueue = [];
    this.initialized = false;
  }
  
  // PHASE 1: Just register, don't initialize
  register(name, component) {
    this.components[name] = component;
    console.log(`Registered component: ${name}`);
    return true;
  }
  
  // PHASE 2: Now initialize everything
  completeInitialization() {
    console.log('ComponentRegistry: Completing initialization');
    this.initialized = true;
    
    // Process any pending initializations
    while (this.initializationQueue.length > 0) {
      const { name, args } = this.initializationQueue.shift();
      this._initializeComponent(name, args);
    }
    
    return true;
  }
  
  // Handle component requests
  get(name, ...args) {
    if (!this.components[name]) {
      console.error(`Component not found: ${name}`);
      return null;
    }
    
    // If not initialized yet, queue it
    if (!this.initialized) {
      console.log(`Queuing initialization of: ${name}`);
      this.initializationQueue.push({ name, args });
      return null;
    }
    
    // Initialize if needed
    if (!this.instances[name]) {
      this._initializeComponent(name, args);
    }
    
    return this.instances[name];
  }
  
  // Private method for initialization
  _initializeComponent(name, args) {
    if (!this.components[name]) return null;
    
    try {
      console.log(`Initializing component: ${name}`);
      this.instances[name] = new this.components[name](...args);
      return this.instances[name];
    } catch (err) {
      console.error(`Failed to initialize ${name}:`, err);
      return null;
    }
  }
}

// Global reference for debugging
window.AssessmentComponentRegistry = ComponentRegistry;
```

### 3. Create a Report Accuracy Test

Create a test for checking if reports are accurate (a real business need):

```html
<!-- Clause-refactored-broken/report-accuracy-test.html -->
<!DOCTYPE html>
<html>
<head>
  <title>Report Accuracy Test</title>
  <link rel="stylesheet" href="assets/css/assessment-framework.css">
  <link rel="stylesheet" href="assets/css/obsolete-theme.css">
  
  <script src="assets/agency-assessment-enhanced.js"></script>
  <script src="assets/agency-recommendations-config.js"></script>
  <script src="assets/js/enhanced-weighted-scoring.js"></script>
  <script src="assets/js/results-renderer.js"></script>
  
  <script>
    // Test data with known inputs
    const TEST_DATA = {
      agencyType: 'full-service',
      services: ['web-design', 'seo', 'content-marketing'],
      answers: {
        1: 2, // Question 1, option 3
        2: 1, // Question 2, option 2
        // Add more answers as needed
      }
    };
    
    function testReportAccuracy() {
      // Use the actual scoring system
      const scoringSystem = new window.EnhancedWeightedScoring();
      const scores = scoringSystem.calculateScores(TEST_DATA.answers);
      
      // Use the actual recommendation engine
      const recommendations = window.ServiceRecommendations.getRecommendations(
        TEST_DATA.agencyType,
        TEST_DATA.services,
        scores
      );
      
      // Show results for manual verification
      document.getElementById('result').innerHTML = `
        <h2>Test Results</h2>
        <h3>Scores</h3>
        <pre>${JSON.stringify(scores, null, 2)}</pre>
        <h3>Recommendations</h3>
        <pre>${JSON.stringify(recommendations, null, 2)}</pre>
      `;
    }
    
    window.addEventListener('DOMContentLoaded', testReportAccuracy);
  </script>
</head>
<body>
  <h1>Report Accuracy Test</h1>
  <div id="result"></div>
</body>
</html>
```

## Implementation Steps

1. Create "Clause-refactored-broken" directory with copies of all existing files
2. Implement the two-phase component registry
3. Update the assessment engine to use the new registry pattern
4. Create the report accuracy test to verify scoring/recommendations
5. Test everything thoroughly before integrating back into main codebase

const AgencyQuestions = {
  // Core questions asked to all users (35 questions total)
  core: [  
    // Paste the entire core questions array here
  ],
  // Paste the rest of the questions structure here
};

// Export for module system
export default AgencyQuestions;

// Also add to global namespace for backward compatibility
window.AgencyQuestions = AgencyQuestions;
```

**Step 3:** Update references in AgencyAssessmentFramework.js (line ~190)
```javascript
// Old code in AgencyAssessmentFramework.js
this.state.filteredQuestions = this.getQuestionsForSelectedServices();

// New code with import
import AgencyQuestions from '../config/questions.js';

// Then update the getQuestionsForSelectedServices function to use the imported questions
getQuestionsForSelectedServices() {
  // Use AgencyQuestions instead of directly accessing config
  const questions = [];
  
  // Add core questions
  if (AgencyQuestions.core) {
    questions.push(...AgencyQuestions.core);
  }
  
  // Rest of the function unchanged
}
```

### 1.2 Testing

**Create test file:** `/tests/questions-test.html`
```html
<!DOCTYPE html>
<html>
<head>
  <title>Questions Component Test</title>
  <script src="../assets/js/components/agency/config/questions.js"></script>
  <script>
    // Test function to verify questions loaded correctly
    function testQuestions() {
      if (window.AgencyQuestions) {
        console.log('✅ Questions loaded successfully');
        console.log(`Found ${AgencyQuestions.core.length} core questions`);
        // Check if service-specific questions exist
        if (AgencyQuestions.serviceSpecific) {
          console.log('✅ Service-specific questions found');
        }
      } else {
        console.error('❌ Questions failed to load');
      }
    }
    window.onload = testQuestions;
  </script>
</head>
<body>
  <h1>Questions Component Test</h1>
  <p>Check console for test results</p>
</body>
</html>
```

**Validation:** Open the test HTML file in a browser. You should see confirmation that questions loaded successfully with the correct number of core questions.

## 2. Agency Recommendations Component

### 2.1 Integration Process

**Source:** `/assets/agency-recommendations-config.js` (1790+ lines)
**Target:** Already exists at `/assets/js/components/agency/config/agency-recommendations-config.js`

**Step 1:** Verify content matches between source and target
```bash
# Run this command to compare files
diff /assets/agency-recommendations-config.js /assets/js/components/agency/config/agency-recommendations-config.js
```

**Step 2:** Update ResultsRenderer.js to use the modular version (line ~800)
```javascript
// Old code in ResultsRenderer.js
const recommendations = window.ServiceRecommendations.services[serviceId][level];

// New code with import
import { ServiceRecommendations } from '../config/agency-recommendations-config.js';

// Then update the reference
const recommendations = ServiceRecommendations.services[serviceId][level];
```

**Step 3:** Update any hardcoded references in the monolithic framework
```javascript
// Search for this pattern in assessment-framework.js
if (typeof ServiceRecommendations !== 'undefined') {
  // Replace with modular import
}
```

### 2.2 Testing

**Create test file:** `/tests/recommendations-test.html`
```html
<!DOCTYPE html>
<html>
<head>
  <title>Recommendations Component Test</title>
  <script src="../assets/js/components/agency/config/agency-recommendations-config.js"></script>
  <script>
    // Test function to verify recommendations loaded
    function testRecommendations() {
      if (window.ServiceRecommendations) {
        console.log('✅ Recommendations loaded successfully');
        
        // Test with a sample service and score level
        const testService = 'creative';
        const testLevel = 'lowScore';
        
        if (ServiceRecommendations.services && 
            ServiceRecommendations.services[testService] &&
            ServiceRecommendations.services[testService][testLevel]) {
          
          console.log('✅ Successfully retrieved recommendations for creative service');
          console.log(`Found ${ServiceRecommendations.services[testService][testLevel].length} recommendations`);
        } else {
          console.error('❌ Failed to retrieve service recommendations');
        }
      } else {
        console.error('❌ Recommendations failed to load');
      }
    }
    window.onload = testRecommendations;
  </script>
</head>
<body>
  <h1>Recommendations Component Test</h1>
  <p>Check console for test results</p>
</body>
</html>
```

**Validation:** Open the test HTML file in a browser. You should see confirmation that recommendations loaded with the correct number for the test service.

## 3. ValuationDashboard Component

### 3.1 Integration Process

**Source:** `/assets/js/valuation-dashboard.js` (1149 lines)
**Target:** `/assets/js/components/agency/utils/ValuationDashboard.js`

**Step 1:** Compare files to identify missing functionality
```bash
# Run this command to compare files
diff /assets/js/valuation-dashboard.js /assets/js/components/agency/utils/ValuationDashboard.js > valuation-diff.txt
```

**Step 2:** Update the modular version with any missing functionality
```javascript
// Old format in valuation-dashboard.js
var ValuationDashboard = {
  generateDashboard: function(assessmentData, config) {
    // Implementation
  }
  // Other methods
};

// New format in components/agency/utils/ValuationDashboard.js
class ValuationDashboard {
  constructor(eventBus) {
    this.eventBus = eventBus;
    
    // Subscribe to assessment completion events
    if (this.eventBus) {
      this.eventBus.on('results:calculated', this.handleResultsCalculated.bind(this));
    }
  }
  
  handleResultsCalculated(results) {
    this.generateDashboard(results);
  }
  
  generateDashboard(assessmentData, config) {
    // Copy implementation from original, updating DOM references
  }
  
  // Copy other methods from original, converting to class methods
}

// Export for module system
export default ValuationDashboard;

// Also add to global namespace for backward compatibility
window.ValuationDashboard = ValuationDashboard;
```

**Step 3:** Update ResultsRenderer.js to use the modular version (line ~40)
```javascript
// Old code in ResultsRenderer.js
this.valuationDashboard = window.ValuationDashboard;

// New code with import
import ValuationDashboard from '../utils/ValuationDashboard.js';

// Then update the constructor
constructor(options) {
  this.container = options.container;
  this.eventBus = options.eventBus;
  this.valuationDashboard = new ValuationDashboard(this.eventBus);
  // Rest of constructor
}
```

### 3.2 Testing

**Create test file:** `/tests/valuation-dashboard-test.html`
```html
<!DOCTYPE html>
<html>
<head>
  <title>ValuationDashboard Component Test</title>
  <link rel="stylesheet" href="../assets/css/valuation-dashboard.css">
  <script src="../assets/js/components/agency/utils/ValuationDashboard.js"></script>
  <script>
    // Sample assessment data for testing
    const sampleData = {
      selectedAgencyType: 'creative',
      selectedServices: ['creative', 'content'],
      revenue: 1000000,
      results: {
        overall: 65,
        dimensions: {
          operational: 70,
          financial: 60,
          ai: 55,
          strategic: 75
        }
      }
    };
    
    function testValuationDashboard() {
      if (window.ValuationDashboard) {
        console.log('✅ ValuationDashboard loaded successfully');
        
        // Create container for the dashboard
        const container = document.getElementById('dashboard-container');
        
        // Create instance and generate dashboard
        const dashboard = new ValuationDashboard();
        dashboard.generateDashboard(sampleData);
        
        console.log('✅ Dashboard generated - check UI below');
      } else {
        console.error('❌ ValuationDashboard failed to load');
      }
    }
    window.onload = testValuationDashboard;
  </script>
</head>
<body>
  <h1>ValuationDashboard Component Test</h1>
  <div id="dashboard-container"></div>
</body>
</html>
```

**Validation:** Open the test HTML file in a browser. You should see the dashboard rendered correctly with the sample data.

## 4. Styling System Integration

### 4.1 Directory Setup

**Source Files:**
- `/assets/css/assessment-framework.css` (293 lines) - Main styling import file
- `/assets/css/obsolete-theme.css` (956 lines) - Dark theme with yellow accent
- `/assets/css/valuation-dashboard.css` (multiple sections) - Dashboard styling

**Step 1:** Create the modular CSS structure
```bash
# Create directories for modular CSS
mkdir -p /assets/css/core
mkdir -p /assets/css/themes
mkdir -p /assets/css/components
```

**Step 2:** Extract theme variables (lines 6-63 of obsolete-theme.css)
```css
/* File: /assets/css/themes/agency-theme.css */
/**
 * Agency Assessment Theme Variables
 * Dark theme with yellow accent
 */

:root {
  /* Core brand colors */
  --color-background: #141414;
  --color-background-light: #222222;
  --color-background-medium: #2a2a2a;
  --color-background-card: #1c1c1c;
  
  /* Copy the rest of the variables from obsolete-theme.css lines 6-63 */
}
```

**Step 3:** Create core CSS file with base styles
```css
/* File: /assets/css/core/assessment-base.css */
/**
 * Assessment Framework Core Styles
 * Base styles used by all assessment types
 */

/* Import from assessment-framework.css lines 17-51 (container, steps, navigation) */
.assessment-framework-container,
.agency-assessment-wrapper {
  font-family: Arial, Helvetica, sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  box-sizing: border-box;
}

/* Copy the other core styles */
```

**Step 4:** Create component-specific CSS files
```css
/* File: /assets/css/components/questions.css */
/* Copy from assessment-framework.css lines 90-130 */

/* File: /assets/css/components/results.css */
/* Copy from assessment-framework.css lines 131-213 */

/* File: /assets/css/components/valuation.css */
/* Copy from valuation-dashboard.css, focusing on dashboard-specific styles */
```

**Step 5:** Create theme loader JavaScript
```javascript
// File: /assets/js/core/theme-loader.js
/**
 * Theme Loader - Dynamically loads CSS based on assessment type
 */
class ThemeLoader {
  constructor() {
    this.loadedStylesheets = new Set();
  }
  
  loadTheme(assessmentType = 'agency') {
    // Load core styles
    this.loadStylesheet('/assets/css/core/assessment-base.css');
    
    // Load theme styles
    this.loadStylesheet(`/assets/css/themes/${assessmentType}-theme.css`);
    
    console.log(`\u2705 Loaded ${assessmentType} theme`);
  }
  
  loadComponentStyles(componentName) {
    // Load component-specific styles
    this.loadStylesheet(`/assets/css/components/${componentName}.css`);
  }
  
  loadStylesheet(path) {
    // Don't load the same stylesheet twice
    if (this.loadedStylesheets.has(path)) return;
    
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = path;
    document.head.appendChild(link);
    
    this.loadedStylesheets.add(path);
  }
}

// Export for module system
export default ThemeLoader;

// Also add to global namespace for backward compatibility
window.ThemeLoader = ThemeLoader;
```

### 4.2 Testing

**Create test file:** `/tests/styling-test.html`
```html
<!DOCTYPE html>
<html>
<head>
  <title>Styling System Test</title>
  <script src="../assets/js/core/theme-loader.js"></script>
  <script>
    function testThemeLoader() {
      if (window.ThemeLoader) {
        console.log('\u2705 ThemeLoader loaded successfully');
        
        // Create ThemeLoader instance
        const themeLoader = new ThemeLoader();
        
        // Load agency theme
        themeLoader.loadTheme('agency');
        
        // Load component styles
        themeLoader.loadComponentStyles('questions');
        themeLoader.loadComponentStyles('results');
        
        console.log('\u2705 Theme and component styles loaded - check appearance below');
      } else {
        console.error('\u274c ThemeLoader failed to load');
      }
    }
    window.onload = testThemeLoader;
  </script>
</head>
<body>
  <h1>Styling System Test</h1>
  
  <div class="assessment-framework-container">
    <div class="assessment-step-title">Test Step Title</div>
    <div class="assessment-step-description">This is a test step description.</div>
    
    <div class="assessment-question">
      <div class="assessment-question-text">Test question text?</div>
      <div class="assessment-options">
        <div class="assessment-option">Option 1</div>
        <div class="assessment-option">Option 2</div>
      </div>
    </div>
    
    <div class="assessment-results-wrapper">
      <div class="overall-score">
        <div class="score-value">75</div>
        <div class="score-label">Overall Score</div>
      </div>
    </div>
  </div>
</body>
</html>
```

**Validation:** Open the test HTML file in a browser. You should see the components styled correctly with the agency theme.

## 5. Scoring System Integration

### 5.1 Integration Process

**Source:** `/assets/js/enhanced-weighted-scoring.js`
**Target:** `/assets/js/components/agency/scoring.js`

**Step 1:** Compare files to identify differences
```bash
# Run this command to compare files
diff /assets/js/enhanced-weighted-scoring.js /assets/js/components/agency/scoring.js > scoring-diff.txt
```

**Step 2:** Update the modular version with any missing functionality
```javascript
// Convert from old format
var EnhancedWeightedScoring = function(config) {
  // Implementation
};

// To class-based implementation
class AgencyScoringSystem {
  constructor(config) {
    this.config = config;
    // Initialize other properties
  }
  
  calculateResults(assessmentData) {
    // Copy implementation from original
    // Make sure to use the modular questions and recommendations
  }
  
  // Convert other methods to class methods
}

// Export for module system
export default AgencyScoringSystem;

// Also add to global namespace for backward compatibility
window.AgencyScoringSystem = AgencyScoringSystem;
```

**Step 3:** Update references in AgencyAssessmentFramework.js
```javascript
// Old code
if (typeof AgencyScoringSystem !== 'undefined') {
  this.state.results = AgencyScoringSystem.calculateResults(this.state);
}

// New code with import
import AgencyScoringSystem from '../scoring.js';

// Then update the calculateResults method
calculateResults() {
  const scoringSystem = new AgencyScoringSystem(this.config);
  this.state.results = scoringSystem.calculateResults(this.state);
  
  // Emit results calculated event
  this.eventBus.emit('results:calculated', {
    results: this.state.results
  });
}
```

### 5.2 Testing

**Create test file:** `/tests/scoring-test.html`
```html
<!DOCTYPE html>
<html>
<head>
  <title>Scoring System Test</title>
  <script src="../assets/js/components/agency/config/questions.js"></script>
  <script src="../assets/js/components/agency/scoring.js"></script>
  <script>
    // Sample assessment data for testing
    const sampleData = {
      selectedAgencyType: 'creative',
      selectedServices: ['creative', 'content'],
      answers: {
        '1': { dimension: 'operational', score: 4 },
        '2': { dimension: 'operational', score: 3 },
        '3': { dimension: 'financial', score: 5 },
        '4': { dimension: 'financial', score: 2 },
        '5': { dimension: 'ai', score: 3 }
      }
    };
    
    function testScoringSystem() {
      if (window.AgencyScoringSystem) {
        console.log('\u2705 ScoringSystem loaded successfully');
        
        // Create scoring system instance
        const scoringSystem = new AgencyScoringSystem();
        
        // Calculate results
        const results = scoringSystem.calculateResults(sampleData);
        
        console.log('\u2705 Results calculated:', results);
        console.log(`Overall score: ${results.overall}`);
        console.log('Dimension scores:', results.dimensions);
      } else {
        console.error('\u274c ScoringSystem failed to load');
      }
    }
    window.onload = testScoringSystem;
  </script>
</head>
<body>
  <h1>Scoring System Test</h1>
  <p>Check console for test results</p>
</body>
</html>
```

**Validation:** Open the test HTML file in a browser. You should see results calculated with appropriate scores for the sample data.

## 6. Component Registry Implementation

**IMPORTANT: Only implement this AFTER all components above have been properly extracted and tested individually.**

### 6.1 Implementation Process

**Target:** `/assets/js/core/component-registry.js`

**Step 1:** Create the component registry implementation
```javascript
/**
 * Component Registry - Core Module
 * 
 * This module manages the registration, initialization, and loading of components
 * in the assessment framework. It specifically addresses circular dependency issues
 * and initialization sequencing that caused previous browser crashes.
 */

class ComponentRegistry {
  constructor(options = {}) {
    // Component definitions indexed by name
    this.components = {};
    
    // Track initialization status to prevent circular dependencies
    this.initializationStatus = {};
    
    // Dependency graph for ordered initialization
    this.dependencyGraph = {};
    
    // Optional event bus for notifications
    this.eventBus = options.eventBus || null;
    
    // Registration queue for deferred registrations
    this.registrationQueue = [];
    
    // Whether initialization is complete
    this.initialized = false;
    
    // Debug mode
    this.debug = options.debug || false;
    
    console.log('[ComponentRegistry] Created');
  }
  
  /**
   * Register a component in the registry
   * @param {string} name - Unique component name
   * @param {Object} componentDefinition - Component definition object
   * @param {Array<string>} dependencies - Names of components this component depends on
   * @returns {boolean} - Success status
   */
  register(name, componentDefinition, dependencies = []) {
    if (this.debug) {
      console.log(`[ComponentRegistry] Registering component: ${name}`);
    }
    
    // Validation
    if (!name || typeof name !== 'string') {
      console.error('[ComponentRegistry] Invalid component name');
      return false;
    }
    
    if (!componentDefinition) {
      console.error(`[ComponentRegistry] Invalid component definition for ${name}`);
      return false;
    }
    
    // If we're in initialization, queue registrations for later to prevent circular deps
    if (!this.initialized) {
      this.registrationQueue.push({
        name,
        componentDefinition,
        dependencies
      });
      
      if (this.debug) {
        console.log(`[ComponentRegistry] Queued registration for ${name}`);
      }
      
      return true;
    }
    
    // Store component with its metadata
    this.components[name] = {
      definition: componentDefinition,
      dependencies: dependencies || [],
      instance: null,
      initialized: false
    };
    
    // Update dependency graph
    this._updateDependencyGraph(name, dependencies);
    
    // Notify via event bus if available
    if (this.eventBus) {
      this.eventBus.emit('component:registered', { name });
    }
    
    return true;
  }
  
  /**
   * Get a component instance, initializing it if needed
   * @param {string} name - Component name
   * @returns {Object|null} - Component instance or null if not found
   */
  get(name) {
    if (!name || !this.components[name]) {
      console.warn(`[ComponentRegistry] Component not found: ${name}`);
      return null;
    }
    
    const component = this.components[name];
    
    // Return existing instance if already initialized
    if (component.initialized && component.instance) {
      return component.instance;
    }
    
    // Initialize the component if not already done
    return this._initializeComponent(name);
  }
  
  /**
   * Complete initialization by processing the registration queue
   */
  completeInitialization() {
    console.log('[ComponentRegistry] Completing initialization');
    
    // Process registration queue
    if (this.registrationQueue.length > 0) {
      console.log(`[ComponentRegistry] Processing ${this.registrationQueue.length} queued registrations`);
      
      // Register all queued components
      this.registrationQueue.forEach(item => {
        this.register(item.name, item.definition, item.dependencies);
      });
      
      // Clear the queue
      this.registrationQueue = [];
    }
    
    // Mark as initialized
    this.initialized = true;
    
    // Notify via event bus if available
    if (this.eventBus) {
      this.eventBus.emit('registry:initialized', { 
        componentCount: Object.keys(this.components).length 
      });
    }
    
    return true;
  }
  
  /**
   * Initialize all registered components in dependency order
   * @returns {boolean} - Success status
   */
  initializeAll() {
    if (!this.initialized) {
      this.completeInitialization();
    }
    
    console.log('[ComponentRegistry] Initializing all components');
    
    // Get sorted component names based on dependency order
    const initOrder = this._getInitializationOrder();
    
    if (this.debug) {
      console.log(`[ComponentRegistry] Initialization order: ${initOrder.join(', ')}`);
    }
    
    // Initialize each component in order
    initOrder.forEach(name => {
      this._initializeComponent(name);
    });
    
    return true;
  }
  
  // Private methods for dependency tracking and initialization
  // ... Add implementation details here ...
}

// Export for module system
export default ComponentRegistry;

// Also add to global namespace for backward compatibility
window.AssessmentFramework = window.AssessmentFramework || {};
window.AssessmentFramework.Core = window.AssessmentFramework.Core || {};
window.AssessmentFramework.Core.ComponentRegistry = ComponentRegistry;

console.log('[ComponentRegistry] Module loaded');
```

**Step 2:** Update assessment-engine.js to use the registry
```javascript
// In assessment-engine.js constructor
constructor(options) {
  this.container = options.container;
  this.eventBus = options.eventBus;
  this.pluginSystem = options.pluginSystem;
  
  // Add component registry
  this.componentRegistry = options.componentRegistry || 
    new window.AssessmentFramework.Core.ComponentRegistry({
      eventBus: this.eventBus,
      debug: true
    });
  
  // Rest of constructor
}

// Then update the _loadAndRenderComponent method
_loadAndRenderComponent(componentName) {
  // Try to get from registry first
  const Component = this.componentRegistry.get(componentName);
  
  if (Component) {
    // Use the component from registry
    // ...
  } else {
    // Fallback to legacy loading
    // ...
  }
}
```

### 6.2 Component Registration

**Create test file:** `/tests/component-registry-test.html`
```html
<!DOCTYPE html>
<html>
<head>
  <title>Component Registry Test</title>
  <script src="../assets/js/core/event-bus.js"></script>
  <script src="../assets/js/core/component-registry.js"></script>
  <script src="../assets/js/components/agency/config/questions.js"></script>
  <script src="../assets/js/components/agency/scoring.js"></script>
  <script>
    // Test components
    class TestComponent1 {
      constructor() {
        console.log('TestComponent1 initialized');
        this.name = 'TestComponent1';
      }
    }
    
    class TestComponent2 {
      constructor(dep1) {
        console.log('TestComponent2 initialized with dependency:', dep1.name);
        this.name = 'TestComponent2';
        this.dep1 = dep1;
      }
    }
    
    function testComponentRegistry() {
      if (window.AssessmentFramework.Core.ComponentRegistry) {
        console.log('\u2705 ComponentRegistry loaded successfully');
        
        // Create event bus for testing
        const eventBus = new window.AssessmentFramework.Core.EventBus();
        
        // Create registry
        const registry = new window.AssessmentFramework.Core.ComponentRegistry({
          eventBus: eventBus,
          debug: true
        });
        
        // Register components with dependencies
        registry.register('component1', TestComponent1);
        registry.register('component2', TestComponent2, ['component1']);
        registry.register('questions', window.AgencyQuestions);
        registry.register('scoring', window.AgencyScoringSystem, ['questions']);
        
        // Complete initialization and initialize all
        registry.completeInitialization();
        registry.initializeAll();
        
        // Try to get components
        const comp1 = registry.get('component1');
        const comp2 = registry.get('component2');
        const questions = registry.get('questions');
        const scoring = registry.get('scoring');
        
        console.log('Components initialized:', 
                   comp1 ? '\u2705' : '\u274c', 
                   comp2 ? '\u2705' : '\u274c',
                   questions ? '\u2705' : '\u274c',
                   scoring ? '\u2705' : '\u274c');
      } else {
        console.error('\u274c ComponentRegistry failed to load');
      }
    }
    window.onload = testComponentRegistry;
  </script>
</head>
<body>
  <h1>Component Registry Test</h1>
  <p>Check console for test results</p>
</body>
</html>
```

**Validation:** Open the test HTML file in a browser. You should see confirmation that components were registered and initialized in the correct dependency order without circular reference errors.

## 7. Final Integration

### 7.1 Create Full Assessment Test

**Create a complete integration test file:** `/tests/full-agency-assessment-test.html`

```html
<!DOCTYPE html>
<html>
<head>
  <title>Full Agency Assessment Test</title>
  <!-- Core components -->
  <script src="../assets/js/core/event-bus.js"></script>
  <script src="../assets/js/core/plugin-system.js"></script>
  <script src="../assets/js/core/config-loader.js"></script>
  <script src="../assets/js/core/component-registry.js"></script>
  <script src="../assets/js/core/assessment-engine.js"></script>
  <script src="../assets/js/core/theme-loader.js"></script>
  
  <!-- Agency components -->
  <script src="../assets/js/components/agency/config/questions.js"></script>
  <script src="../assets/js/components/agency/config/agency-recommendations-config.js"></script>
  <script src="../assets/js/components/agency/scoring.js"></script>
  <script src="../assets/js/components/agency/AgencyTypeSelector.js"></script>
  <script src="../assets/js/components/agency/ServicesSelector.js"></script>
  <script src="../assets/js/components/agency/QuestionsRenderer.js"></script>
  <script src="../assets/js/components/agency/ResultsRenderer.js"></script>
  <script src="../assets/js/components/agency/utils/ValuationDashboard.js"></script>
  <script src="../assets/js/components/agency/AgencyAssessmentFramework.js"></script>
  
  <script>
    function initializeAssessment() {
      // Create event bus
      const eventBus = new window.AssessmentFramework.Core.EventBus();
      
      // Create component registry
      const registry = new window.AssessmentFramework.Core.ComponentRegistry({
        eventBus: eventBus,
        debug: true
      });
      
      // Create plugin system and config loader
      const pluginSystem = new window.AssessmentFramework.Core.PluginSystem();
      const configLoader = new window.AssessmentFramework.Core.ConfigLoader();
      
      // Create theme loader and load agency theme
      const themeLoader = new window.ThemeLoader();
      themeLoader.loadTheme('agency');
      themeLoader.loadComponentStyles('questions');
      themeLoader.loadComponentStyles('results');
      
      // Register components
      registry.register('questions', window.AgencyQuestions);
      registry.register('recommendations', window.ServiceRecommendations);
      registry.register('scoring', window.AgencyScoringSystem, ['questions']);
      registry.register('agency-type-selector', window.AssessmentFramework.AgencyTypeSelector);
      registry.register('services-selector', window.AssessmentFramework.ServicesSelector);
      registry.register('questions-renderer', window.AssessmentFramework.QuestionsRenderer, ['questions']);
      registry.register('results-renderer', window.AssessmentFramework.ResultsRenderer, ['recommendations']);
      registry.register('valuation-dashboard', window.ValuationDashboard);
      
      // Complete registry initialization
      registry.completeInitialization();
      
      // Initialize all components
      registry.initializeAll();
      
      // Get container element
      const container = document.getElementById('assessment-container');
      
      // Create assessment engine
      const engine = new window.AssessmentFramework.Core.AssessmentEngine({
        container: container,
        eventBus: eventBus,
        pluginSystem: pluginSystem,
        configLoader: configLoader,
        componentRegistry: registry
      });
      
      // Initialize engine
      engine.initialize({
        assessmentType: 'agency',
        currentStep: 'agency-type'
      });
      
      console.log('\u2705 Assessment initialized successfully');
    }
    
    window.onload = initializeAssessment;
  </script>
</head>
<body>
  <h1>Full Agency Assessment Test</h1>
  <div id="assessment-container"></div>
</body>
</html>
```

**Validation:** Open the test HTML file in a browser. You should see the assessment initialized with all components loaded in the correct order. Test that you can navigate through the assessment steps without errors.

### 7.2 Fallback Mechanism

Implement a fallback mechanism to handle any initialization failures:

```javascript
// File: /assets/js/assessment-framework-init.js

/**
 * Assessment Framework Initializer with Fallback
 */
function initializeAssessmentFramework(container) {
  console.log('[AssessmentFramework] Initializing modular framework...');
  
  try {
    // Try to initialize modular framework first
    if (window.AssessmentFramework.Core.EventBus && 
        window.AssessmentFramework.Core.ComponentRegistry) {
      
      // Initialize modular components
      // ... Initialization code similar to the test file above ...
      
      console.log('[AssessmentFramework] Modular framework initialized successfully');
      return true;
    } else {
      throw new Error('Core components not available');
    }
  } catch (error) {
    console.error('[AssessmentFramework] Error initializing modular framework:', error);
    console.log('[AssessmentFramework] Falling back to monolithic framework...');
    
    // Fall back to monolithic framework
    if (typeof AgencyAssessmentConfig !== 'undefined') {
      const config = AgencyAssessmentConfig;
      new window.AgencyAssessment(config, container);
      console.log('[AssessmentFramework] Monolithic framework initialized as fallback');
      return true;
    } else {
      console.error('[AssessmentFramework] Failed to initialize framework');
      return false;
    }
  }
}

// Add to global namespace
window.initializeAssessmentFramework = initializeAssessmentFramework;
```

## Final Integration Checklist

✅ **Before going to production:**

1. Verify all components have been extracted and modularized
2. Run all individual component tests successfully
3. Run the full integration test successfully
4. Test the fallback mechanism works correctly
5. Implement graceful error handling and logging
6. Create visual comparison tests between modular and monolithic versions
7. Deploy to staging environment for final validation

## Implementation Plan

### Phase 1: Component Extraction and Validation

Instead of starting with the registry, we'll first properly extract and validate each component:

- Questions System: Extract configuration data and create modular implementation
- Recommendation Engine: Extract expert-driven logic and create modular implementation
- Scoring System: Extract scoring algorithm and create modular implementation
- Reporting/Visualization: Extract financial projections and ROI calculations and integrate into modular implementation
- Styling System: Ensure consistent application across all components

### Phase 2: Registry Implementation

After extracting and validating components, we'll implement the registry:

- Create a singleton instance of the registry to prevent multiple registries
- Implement deferred registration pattern to prevent stack overflow
- Implement lazy resolution to prevent circular dependencies
- Implement dependency-aware initialization to prevent ordering issues
- Implement async initialization pattern to prevent blocking

## Detailed Implementation Steps

### 1. Agency Assessment Components

**Step 1.1: Agency Questions Component**
- **Source**: `/assets/agency-assessment-enhanced.js` (lines 135-1856) contains all questions in a nested structure
- **Target**: `/assets/js/components/agency/config/questions.js` (create new file)
- **Extraction Process**: 
  - Copy the entire `questions` object (contains core, service-specific, and agency-type-specific questions)
  - Format as a proper ES6 module with export
  - Ensure configuration structure is preserved exactly as-is
- **Integration**: Update `AgencyAssessmentFramework.js` to import from this new location
- **Validation**: Create a test HTML that loads only this component and the QuestionsRenderer to verify questions load correctly

**Step 1.2: Agency Recommendations Component**
- **Source**: `/assets/agency-recommendations-config.js` (entire file, 1790+ lines) 
- **Target**: Already in `/assets/js/components/agency/config/agency-recommendations-config.js` but needs proper integration
- **Integration Process**:
  - Remove any hard-coded references to this file in the monolithic framework
  - Update imports in ResultsRenderer.js to use the modular version
  - Ensure the recommendations are properly displayed in the results view
- **Validation**: Test with several score combinations to verify correct recommendations appear

**Step 1.3: Agency ValuationDashboard Integration**
- **Source**: `/assets/js/valuation-dashboard.js` (entire file, 1149 lines)
- **Target**: `/assets/js/components/agency/utils/ValuationDashboard.js` (exists but needs updates)
- **Integration Process**:
  - Compare both files to identify any missing functionality in the modular version
  - Update the modular version to include all functionality from the original
  - Add event listeners for the assessment engine events
  - Remove any direct jQuery DOM manipulation in favor of proper component initialization
- **Validation**: Create a test with sample assessment results data to verify dashboard renders correctly

**Step 1.4: Agency Scoring System**
- **Source**: `/assets/js/enhanced-weighted-scoring.js` 
- **Target**: `/assets/js/components/agency/scoring.js` (exists but needs updates)
- **Integration Process**:
  - Ensure the modular version contains all scoring logic from the original
  - Modify to use the new modular question and recommendation structures
  - Add proper exports and documentation
- **Validation**: Compare scores generated by both implementations with identical input data

**Step 1.5: MODULAR STYLING SYSTEM** ⚠️ CRITICAL ⚠️
- **Existing Source Files**: 
  - `/assets/css/assessment-framework.css` - Main CSS that imports other CSS files
  - `/assets/css/obsolete-theme.css` - Dark theme with yellow accent (956 lines)
  - `/assets/css/service-revenue.css` - Service selection and revenue sliders
  - `/assets/css/valuation-dashboard.css` - Financial dashboard visualization 
  - `/assets/css/valuation-insights.css` - Insights visualization
  - `/assets/css/valuation-report.css` - Report styling
  - `/assets/css/direct-fixes.css` - Emergency fixes and overrides
  - `/assets/css/enhanced-assessment.css` - Enhanced assessment features
  - `/assets/css/ebit-display.css` - EBIT display components

- **Modular Structure to Create**:
  - `/assets/css/core/` - Core framework styles (assessment steps, navigation, etc.)
  - `/assets/css/themes/` - Theme files for different assessment types
     - `/assets/css/themes/agency-theme.css` - Extract from obsolete-theme.css
     - `/assets/css/themes/inhouse-theme.css` - Create based on agency theme
  - `/assets/css/components/` - Component-specific styles
     - `/assets/css/components/questions.css` - Extract from assessment-framework.css
     - `/assets/css/components/results.css` - Extract from assessment-framework.css
     - `/assets/css/components/services.css` - Extract from service-revenue.css
     - `/assets/css/components/valuation.css` - Extract from valuation-*.css files

- **Implementation Process**:
  1. **CSS Extraction and Reorganization**:
     - Analyze CSS in assessment-framework.css (lines 0-293) to separate core vs. component styles
     - Separate theme variables in obsolete-theme.css (lines 6-63) into agency-specific theme
     - Identify and extract component-specific styles from all CSS files

  2. **Create Theme Loaders**:
     - Create `/assets/js/core/theme-loader.js` that dynamically loads theme based on assessment type
     - Extract theme variables from obsolete-theme.css to create proper CSS variables
     - Preserve all existing color schemes and styling exactly as-is
  
  3. **Component Style Integration**:
     - Update each component to load core styles plus its own specific styles
     - Example: ResultsRenderer loads core styles + themes/agency-theme.css + components/results.css
     - Add data-assessment-type attributes to container elements for theme targeting
  
  4. **Legacy Support**:
     - Maintain backward compatibility by keeping original CSS files as fallbacks
     - Create style version detector to use either modular or legacy styling
     - Add graceful degradation if a component-specific style is missing

- **Validation**: 
  - Create side-by-side comparison of original vs. modular styling
  - Verify no visual regressions in any assessment type
  - Test with both dark and light themes to ensure theme variables work

### 2. Inhouse Assessment Components

**Step 2.1: Inhouse Assessment - Missing Reporting**
- **Source**: Agency's `/assets/js/components/agency/utils/ValuationDashboard.js` as reference
- **Target**: Create `/assets/js/components/inhouse/utils/ReportingDashboard.js`
- **Implementation Process**:
  - Create a modified version of the agency dashboard tailored for inhouse metrics
  - Remove agency-specific terminology and visualizations
  - Add inhouse-specific reporting elements (department comparisons, etc.)
- **Validation**: Test with sample inhouse assessment data

**Step 2.2: Inhouse Assessment - Styling**
- **Source**: Existing CSS in `/assets/css/`
- **Target**: Apply to inhouse components
- **Implementation Process**: 
  - Ensure all inhouse components reference the common theme
  - Add inhouse-specific styling classes where needed
- **Validation**: Visual inspection across all inhouse components

### 3. Core Infrastructure

**Step 3.1: Event Bus Enhancements**
- **Source**: Existing `/assets/js/core/event-bus.js`
- **Target**: Same file, enhanced functionality
- **Implementation Process**:
  - Add namespacing support for events (agency: vs. inhouse: prefixes)
  - Add event debugging tools
  - Ensure proper event propagation between components
- **Validation**: Test with various component communications

**Step 3.2: Component Registry Implementation**
- **Source**: Empty `/assets/js/core/component-registry.js`
- **Target**: Same file, fully implemented
- **Implementation Process**:
  - **CRITICAL**: Implement AFTER all components are properly extracted and working
  - Create registry with deferred registration capability
  - Add dependency tracking to prevent circular references
  - Implement initialization sequencing based on dependencies
  - Add debug visualization for component dependencies
- **Validation**: Create test that loads multiple components with interdependencies

### 4. Integration Testing

**Step 4.1: Agency Assessment Integration**
- **Source**: Existing monolithic implementation in `/assets/js/assessment-framework.js`
- **Target**: Fully modular implementation
- **Implementation Process**:
  - Create fallback mechanism that tries modular first, falls back to monolithic
  - Add detailed console logging for debugging
  - Implement graceful error handling
- **Validation**: Compare results between monolithic and modular implementations

**Step 4.2: Inhouse Assessment Integration**
- **Source**: Existing partial implementation
- **Target**: Complete modular implementation
- **Implementation Process**:
  - Integrate newly created reporting component
  - Ensure all components work together
- **Validation**: End-to-end test of complete inhouse assessment

## Business Value Protection Strategy

To ensure we protect the high-value business logic during refactoring:

### Data Structure and API

```javascript
// component-registry.js
class ComponentRegistry {
  constructor() {
    this._components = new Map();
    this._initializationStatus = new Map();
    this._initializationQueue = [];
    this._isReady = false;
    this._readyCallbacks = [];
  }

  // CRITICAL: Use deferred registration pattern to prevent stack overflow
  register(name, component, dependencies = []) {
    if (this._components.has(name)) {
      console.warn(`Component ${name} already registered, overwriting`);
    }
    
    // Store with initialization status
    this._components.set(name, component);
    this._initializationStatus.set(name, {
      initialized: false,
      dependencies
    });
    
    // Add to initialization queue based on dependencies
    this._addToInitializationQueue(name, dependencies);
    
    return this;
  }

  // CRITICAL: Implement lazy resolution to prevent circular dependencies
  get(name) {
    if (!this._isReady) {
      console.warn(`Component registry not fully initialized, component ${name} may not be available`);
    }
    
    if (!this._components.has(name)) {
      console.error(`Component ${name} not found in registry`);
      return null;
    }
    
    return this._components.get(name);
  }
  
  // CRITICAL: Dependency-aware initialization to prevent ordering issues
  _addToInitializationQueue(name, dependencies) {
    // Sort initialization queue based on dependency graph
    // Components with no dependencies initialize first
    const entry = { name, dependencies };
    
    if (dependencies.length === 0) {
      this._initializationQueue.unshift(entry);
    } else {
      this._initializationQueue.push(entry);
    }
    
    // Re-sort queue based on dependencies
    this._sortInitializationQueue();
  }
  
  _sortInitializationQueue() {
    // Topological sort of components based on dependency graph
    // This ensures components initialize in correct order
    // Implementation details here...
  }
  
  // CRITICAL: Async initialization pattern prevents blocking
  initialize() {
    return new Promise((resolve) => {
      // Process initialization queue in dependency order
      const initializeNext = () => {
        if (this._initializationQueue.length === 0) {
          this._isReady = true;
          this._readyCallbacks.forEach(cb => cb());
          resolve(this);
          return;
        }
        
        const entry = this._initializationQueue.shift();
        const { name } = entry;
        const component = this._components.get(name);
        
        // Initialize component if it has an init method
        if (component && typeof component.init === 'function') {
          Promise.resolve(component.init(this))
            .then(() => {
              this._initializationStatus.get(name).initialized = true;
              // Continue with next component
              setTimeout(initializeNext, 0); // Use setTimeout to prevent stack buildup
            })
            .catch(err => {
              console.error(`Error initializing component ${name}:`, err);
              // Continue with next component despite error
              setTimeout(initializeNext, 0);
            });
        } else {
          this._initializationStatus.get(name).initialized = true;
          // Continue with next component
          setTimeout(initializeNext, 0);
        }
      };
      
      // Start initialization process
      initializeNext();
    });
  }
  
  // CRITICAL: Allow components to wait for registry readiness
  onReady(callback) {
    if (this._isReady) {
      callback();
    } else {
      this._readyCallbacks.push(callback);
    }
  }
  
  // Utility methods for debugging and status checking
  getStatus() {
    return {
      ready: this._isReady,
      registeredComponents: Array.from(this._components.keys()),
      pendingInitialization: this._initializationQueue.map(entry => entry.name),
      initializationStatus: Object.fromEntries(this._initializationStatus)
    };
  }
}

// Export singleton instance to prevent multiple registries
const registry = new ComponentRegistry();
export default registry;
```

### Component Integration Pattern

Components MUST follow this pattern to avoid circular dependencies:

```javascript
// Example component implementation
import registry from '../core/component-registry';

class MyComponent {
  constructor(options = {}) {
    this.options = options;
    this.initialized = false;
    
    // CRITICAL: Register self with dependency list
    registry.register('myComponent', this, ['eventBus', 'configLoader']);
  }
  
  // CRITICAL: Async initialization with lazy dependency resolution
  async init(registry) {
    // Get dependencies only during initialization, not constructor
    this.eventBus = registry.get('eventBus');
    this.configLoader = registry.get('configLoader');
    
    // Setup event listeners
    if (this.eventBus) {
      this.eventBus.on('someEvent', this.handleEvent.bind(this));
    }
    
    this.initialized = true;
    return this;
  }
  
  // Methods that use dependencies should check initialization
  doSomething() {
    if (!this.initialized) {
      console.warn('Component used before initialization');
      return;
    }
    
    // Now safe to use dependencies
    this.eventBus.emit('componentAction', { /* data */ });
  }
}

export default new MyComponent();
```

## Initialization Sequence Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Load Core      │     │ Register Core   │     │ Initialize Core │
│  Infrastructure │────▶│ Components      │────▶│ Components      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Load Agency    │     │ Register Agency │     │ Initialize      │
│  Components     │────▶│ Components      │────▶│ Agency          │
└─────────────────┘     └─────────────────┘     │ Components      │
         │                       │               └─────────────────┘
         ▼                       ▼                       │
┌─────────────────┐     ┌─────────────────┐             │
│  Load Inhouse   │     │ Register Inhouse│             │
│  Components     │────▶│ Components      │─────────────┘
└─────────────────┘     └─────────────────┘
```

## Core Component Dependency Graph

```
┌─────────────────┐
│ ComponentRegistry│
└─────────────────┘
         ▲
         │
┌─────────────────┐
│    EventBus     │
└─────────────────┘
         ▲
         │
┌─────────────────┐
│  ConfigLoader   │
└─────────────────┘
         ▲
         │
┌─────────────────┐
│  PluginSystem   │
└─────────────────┘
         ▲
         │
┌─────────────────┐
│ AssessmentEngine│
└─────────────────┘
```

## File Structure and Organization

### Core Infrastructure Components

1. **`/assets/js/core/event-bus.js`** - ACTIVE
   - Provides a pub/sub event system for inter-component communication
   - Allows components to communicate without direct coupling
   - Core infrastructure used by the modular architecture
   - Properly implemented and functioning in the new regime

2. **`/assets/js/core/plugin-system.js`** - ACTIVE
   - Manages dynamic loading and registration of components
   - Supports component discovery through namespaces
   - Enables extending the framework without core modifications
   - Fully functional in the new modular architecture

3. **`/assets/js/core/config-loader.js`** - ACTIVE
   - Responsible for loading and managing configuration files
   - Supports dynamic loading of configs at runtime
   - Provides fallback configurations when loading fails
   - Critical infrastructure component for modular configuration

4. **`/assets/js/core/assessment-engine.js`** - ACTIVE
   - Central component handling assessment flow and state management
   - Coordinates component interactions and lifecycle
   - Leverages the event bus, plugin system, and config loader
   - Core of the new modular architecture

5. **`/assets/js/core/component-registry.js`** - EMPTY/INCOMPLETE
   - Empty file suggesting incomplete implementation
   - Mentioned in memories as having initialization issues
   - Critical part of the architecture that is not yet implemented
   - Main blocker for the modular architecture working properly

### Agency-Specific Components

1. **`/assets/js/components/agency/AgencyTypeSelector.js`** - ACTIVE
   - Component for selecting agency type in the assessment flow
   - Properly modularized with clear separation of concerns
   - Registers itself in the global component namespace
   - Ready for use in the new modular architecture

2. **`/assets/js/components/agency/ServicesSelector.js`** - ACTIVE
   - Combined component for service selection and revenue allocation
   - Implements advanced revenue distribution algorithms
   - Improves UX by combining steps as mentioned in the memories
   - Optimized component that integrates two previously separate steps

3. **`/assets/js/components/agency/QuestionsRenderer.js`** - ACTIVE
   - Renders assessment questions and captures answers
   - Supports different question types and dimensions
   - Properly integrated with the event system
   - Specialized component for the agency assessment flow

4. **`/assets/js/components/agency/ResultsRenderer.js`** - ACTIVE
   - Renders assessment results with visualizations
   - Complex component handling multiple result types
   - Integrates with the recommendation system
   - Visualization and results presentation component

5. **`/assets/js/components/agency/AgencyAssessmentFramework.js`** - ACTIVE
   - Specialized agency implementation of the assessment framework
   - Extends the core assessment engine for agency-specific functionality
   - Integration point between core and agency-specific components

6. **`/assets/js/components/agency/scoring.js`** - ACTIVE
   - Agency-specific scoring implementation
   - Duplicate of enhanced-weighted-scoring.js in a modular location
   - Should be consolidated as part of further modularization

### Common Components
The common components directory exists but appears to be incomplete, with references to common components like:
- TypeSelector.js - Referenced but not fully examined
- EmailCollector.js - Referenced but not fully examined

### Configuration Files

1. **`/assets/agency-assessment-enhanced.js`** - ACTIVE
   - Core assessment configuration without recommendations
   - Contains question framework, services, and assessment flow
   - Over 2000 lines suggesting it might need further splitting
   - Used by both the monolithic and modular implementations

2. **`/assets/agency-recommendations-config.js`** - ACTIVE
   - Service-specific recommendations configuration
   - Modular approach separating core config from recommendations
   - Aligns with the reengineering plan in the memories
   - Successfully modularized from the main configuration

3. **`/assets/js/components/agency/config/agency-assessment-config.js`** - ACTIVE
   - Agency-specific configuration in modular location
   - Similar to agency-assessment-enhanced.js but properly placed
   - Part of the modular architecture's configuration approach

4. **`/assets/js/components/agency/config/agency-assessment-enhanced.js`** - ACTIVE
   - Duplicate configuration in modular location
   - Suggests configuration synchronization issues
   - Should be consolidated to avoid divergence

5. **`/assets/js/components/agency/config/agency-recommendations-config.js`** - ACTIVE
   - Modular location for recommendations configuration
   - Duplicate of root recommendations config
   - Another example of potential synchronization issues

### Main Framework Files

1. **`/assets/js/assessment-framework.js`** - ACTIVE
   - Original monolithic implementation
   - Still in use as fallback for compatibility
   - Over 1600 lines showing why modularization was needed
   - Currently used in production due to modular architecture issues

2. **`/assets/js/assessment-framework-init.js`** - ACTIVE
   - Initialization code for the monolithic framework
   - Separate from main implementation for better organization
   - Not fully examined but referenced in HTML files

3. **`/assets/js/config-loader.js`** - ACTIVE
   - Front-end loader for configurations
   - Simpler than the core version, focuses on global variables
   - Provides unified interface for accessing configurations
   - Bridge between old and new architecture

4. **`/assets/js/enhanced-weighted-scoring.js`** - ACTIVE
   - Complex scoring system for assessment results
   - Not fully modularized but works with the modular system
   - Used by both monolithic and modular implementations
   - Should eventually be moved to the core or components directory

### Theme and Styling

1. **`/assets/js/obsolete-theme.js`** - ACTIVE
   - Provides dark theme with yellow accent colors
   - Enhanced with direct styling application to ensure consistency
   - Multiple timeouts to ensure theme is consistently applied
   - Key part of the user interface mentioned in memories

2. **`/assets/css/obsolete-theme.css`** - ACTIVE
   - CSS implementation of the theme
   - Over 21KB suggesting comprehensive styling
   - Paired with JS implementation for robust theming
   - Main styling for the current implementation

3. **`/assets/css/service-revenue.css`** - ACTIVE
   - Specific styling for the service revenue component
   - Supports the combined service selection and revenue allocation
   - Clean, focused styling for a specific component
   - Example of properly modularized CSS

4. **`/assets/css/assessment.css`** - ACTIVE
   - Base styling for the assessment framework
   - Used by both monolithic and modular implementations
   - Core styles independent of theme

5. **`/assets/css/question-manager.css`** - ACTIVE
   - Styling specific to the question management interface
   - Used by QuestionsRenderer.js component
   - Properly modularized CSS

6. **`/assets/css/results-visualizer.css`** - ACTIVE
   - Styling for results visualizations
   - Used by ResultsRenderer.js component
   - Support for charts and data visualization

7. **`/assets/css/enhanced-assessment.css`** - ACTIVE
   - Enhanced styling for the assessment framework
   - Supplements base styling with additional features
   - Used by the enhanced implementation

8. **`/assets/css/direct-fixes.css`** - ACTIVE
   - CSS fixes for direct implementation issues
   - Suggests ongoing development and troubleshooting
   - Used to patch styling issues in the direct implementation

9. **`/assets/css/valuation-insights.css`**, **`/assets/css/valuation-report.css`**, **`/assets/css/valuation-dashboard.css`** - ACTIVE
   - Specialized styling for valuation features
   - Support for enhanced reporting and visualization
   - Part of the advanced features set

### HTML Entry Points

1. **`/demo.html`** - ACTIVE
   - Working version pre-refactoring
   - Reference for "good" functionality and styling
   - Uses the modular config files but monolithic framework
   - Current stable implementation

2. **`/agency-assessment.html`** - ACTIVE
   - Self-contained implementation of agency assessment
   - Not using the modular architecture
   - Serves as a functional fallback
   - Contains inline implementation for compatibility

3. **`/direct-agency-assessment.html`** - ACTIVE
   - Attempts to use the modular architecture directly
   - References core modules and specialized components
   - Shows the intended modular architecture in use
   - Currently not fully functional due to component registry issues

4. **`/simple-assessment.html`**, **`/working-direct.html`**, **`/working-assessment.html`** - EMPTY
   - Empty files that appear to be placeholders
   - Part of the modularization effort but not implemented
   - Suggests ongoing development work
   - Likely intended as simplified implementations or working prototypes

### Utility and Support Files

1. **`/assets/js/valuation-insights.js`**, **`/assets/js/valuation-report.js`**, **`/assets/js/valuation-dashboard.js`** - ACTIVE
   - Advanced features for valuation analysis and reporting
   - Used by the results component for enhanced insights
   - Not fully examined but referenced in main files

2. **`/assets/js/display-fixer.js`** - ACTIVE
   - Utility to fix display issues
   - Suggests workarounds for rendering problems
   - Part of the compatibility layer

3. **`/assets/js/theme-enforcer.js`** - ACTIVE
   - Ensures theme is consistently applied
   - Works with obsolete-theme.js to maintain styling
   - Helps address theme application timing issues

4. **`/assets/js/patch.js`**, **`/assets/js/patch_fixed.js`** - ACTIVE
   - Patch files suggesting emergency fixes
   - Multiple versions indicate iterative problem-solving
   - Outside the modular architecture but necessary for stability

## Current State of Modularization

The codebase shows a modular architecture with several key components in place:

1. **Core Infrastructure**: Event bus, plugin system, and config loader are implemented and working

2. **Component System**: Agency-specific components are developed but the component registry is missing

3. **Configuration**: Split into separate files for core config and recommendations

4. **Integration Issues**: As mentioned in memories, component registry initialization issues are evident

5. **Fallback Mechanism**: The monolithic framework is retained for compatibility

## Key Issues Identified

1. **Empty component-registry.js**: This critical component is not implemented, breaking the modular architecture

2. **Empty HTML files**: Several HTML entry points are empty, suggesting incomplete implementation

3. **Integration Challenges**: The system uses both monolithic and modular approaches simultaneously

4. **Multiple Configurations**: Config files exist in multiple locations with potential synchronization issues

5. **Duplication**: Several files appear in multiple locations with potential divergence

## Implementation Plan

### Phase 1: Core Infrastructure (Week 1)

1. **Implement Component Registry** - 2 days
   - Create `/assets/js/core/component-registry.js` using the specification above
   - Implement deferred registration pattern to prevent stack overflow
   - Add dependency tracking and topological sorting for initialization order
   - Create comprehensive unit tests specifically for circular dependency scenarios
   - Add debug logging for initialization sequence monitoring

2. **Update Core Component Initialization** - 1 day
   - Modify each core component to follow the new registry pattern:
     - `/assets/js/core/event-bus.js` - No dependencies, initialize first
     - `/assets/js/core/config-loader.js` - Depends on event-bus
     - `/assets/js/core/plugin-system.js` - Depends on event-bus and config-loader
     - `/assets/js/core/assessment-engine.js` - Depends on all other core components
   - Implement the async init pattern in each component
   - Add explicit dependency declarations

3. **Create Core Integration Test Page** - 1 day
   - Create `/integration-test.html` to test core components in isolation
   - Implement console logging of initialization sequence
   - Add visual indicators for component loading status
   - Test initialization with simulated network delays
   - Include stack trace monitoring

4. **Implement Core Bootstrap Module** - 1 day
   - Create `/assets/js/core/bootstrap.js` to manage initialization sequence
   - Implement phased loading strategy
   - Add error recovery mechanisms
   - Expose initialization progress events
   - Add timeout handling for component initialization

### Phase 2: Agency Components (Week 2)

1. **Update Agency Component Structure** - 2 days
   - Modify each agency component to use the registry pattern:
     - `/assets/js/components/agency/AgencyTypeSelector.js` - No agency dependencies
     - `/assets/js/components/agency/ServicesSelector.js` - Depends on AgencyTypeSelector
     - `/assets/js/components/agency/QuestionsRenderer.js` - Depends on ServicesSelector
     - `/assets/js/components/agency/ResultsRenderer.js` - Depends on QuestionsRenderer
     - `/assets/js/components/agency/AgencyAssessmentFramework.js` - Depends on all other agency components
   - Implement proper dependency declarations
   - Add initialization status checks before component operations

2. **Consolidate Configuration Files** - 1 day
   - Move all configuration to `/assets/js/config/`
   - Create single source of truth for each config type
   - Implement config versioning for backward compatibility
   - Use event system to propagate config changes
   - Add validation for configuration integrity

3. **Implement Enhanced Scoring System** - 1 day
   - Move enhanced-weighted-scoring.js to `/assets/js/components/agency/scoring.js`
   - Register as a component with the registry
   - Add dependencies on required components
   - Remove direct references to other components
   - Implement event-based communication

4. **Create Agency Integration Test Page** - 1 day
   - Create `/agency-integration-test.html`
   - Test full agency component initialization flow
   - Monitor for circular dependencies and initialization issues
   - Add detailed performance metrics
   - Implement initialization timeout detection

### Phase 3: Integration and Completion (Week 3)

1. **Create Working Direct Implementation** - 2 days
   - Implement `/working-direct.html` using the modular architecture
   - Use bootstrap sequence for proper initialization
   - Implement fallback detection if modular system fails
   - Add comprehensive error logging
   - Implement performance monitoring

2. **Consolidate Styling** - 1 day
   - Create unified theme system in `/assets/css/theme/`
   - Implement component-specific styling in component directories
   - Create style loading mechanism tied to component loading
   - Remove duplicate CSS rules
   - Implement responsive design fixes

3. **Implement Complete Assessment Page** - 1 day
   - Create `/working-assessment.html` with full assessment flow
   - Integrate all components
   - Implement state persistence
   - Add navigation and user flow management
   - Ensure visual consistency across all steps

4. **Comprehensive Testing and Fallback Removal** - 1 day
   - Test across multiple browsers
   - Verify performance metrics
   - Confirm all components initialize correctly
   - Remove fallback to monolithic implementation
   - Document final architecture

### Rollback Contingency

In case of critical issues during implementation:

1. **Emergency Rollback Mechanism**
   - Implement feature flag system for modular architecture
   - Add automatic fallback detection
   - Create logging for rollback events
   - Ensure user experience is not interrupted

2. **Incremental Deployment Strategy**
   - Deploy changes in small, testable increments
   - Maintain compatibility with monolithic version
   - Use A/B testing for gradual rollout
   - Monitor error rates in real-time

3. **Debugging Toolkit**
   - Create browser console debugging tools
   - Implement initialization visualization
   - Add component dependency graph viewer
   - Create performance profiling tools

## Comparison with Pre-Refactoring Version

An analysis of the pre-refactoring codebase ("clean-version - before refactor copy") reveals significant differences that help explain the current transition state:

1. **Monolithic Structure**: The original codebase was entirely monolithic with a single `assessment-framework.js` file (77KB) containing all core functionality.

2. **Limited Component Separation**: Only two components existed in the components directory:
   - `revenue-allocator.js`
   - `revenue-risk-calculator.js`

3. **No Core Infrastructure**: The pre-refactoring version lacked all the core infrastructure components:
   - No event-bus.js
   - No plugin-system.js
   - No assessment-engine.js
   - No component-registry.js

4. **No Specialized Components**: There were no agency-specific or inhouse-specific component directories.

5. **Functional Stability**: Despite its monolithic nature, the pre-refactoring version was fully functional and stable.

### Previous Implementation Attempts

Previous attempts to implement the component registry and complete the modular architecture resulted in severe stability issues:

1. **Browser Crashes**: The component registry implementation caused stack overflow errors that crashed the browser.

2. **Initialization Timing Issues**: Components attempted to register themselves or access other components before the registry was fully initialized.

3. **Integration Failures**: Even with core files created, the proper integration between them failed, particularly the initialization sequence.

4. **Forced Fallback**: These critical issues necessitated reverting to the original monolithic framework with enhanced styling as a temporary solution.

The history of implementation attempts provides important context for why the modularization effort remains incomplete despite significant structural progress.

## Original Design from Documentation

After reviewing the `documentation.md` file, it's clear that the assessment framework was originally designed with a modular architecture in mind. The documentation outlines a comprehensive system with these key architectural components:

1. **Engine** (`core/engine.js`): The central controller managing state, navigation, events, and assessment data
2. **Renderer** (`core/renderer.js`): Handles UI rendering, creates components, and displays assessment steps
3. **Components**: Modular UI elements for specific parts of the assessment experience
4. **Config** (`configs/agency-assessment-config.js`): Contains all business logic configuration

The documentation explicitly mentions a **Component Registry** that maps assessment types to their required components:

```javascript
const componentRegistry = {
  // Default components shown for all assessment types
  'default': ['ScoreCard'],
  
  // Organization assessment specific components
  'agency': ['ScoreCard', 'VulnerabilityMap', 'RecommendationEngine', 'ActionPlanGenerator']
};
```

This explains why the missing component registry is such a critical blocker - it was designed as the core integration point for the modular system, connecting assessment types with their specialized components.

The documentation also describes how the system was designed to support multiple assessment types (agency, inhouse) with shared core functionality and specialized components for each type - exactly matching the current directory structure we've observed.

### The Originally Planned Architecture

According to the documentation, the framework was designed to use these patterns:

1. **Event-Based Communication**: Components communicate through an event bus rather than direct references
2. **Component Interfaces**: All components implement standard interfaces defined in `utils/component-interfaces.js`
3. **Deferred Initialization**: Components initialize asynchronously and in dependency order
4. **Storage Management**: State persistence is handled by a dedicated storage manager
5. **Modular Configuration**: Configuration is split into logical modules for better maintainability

The documentation also mentions specific validation for components against their interfaces and handling for initialization errors - directly addressing the issues that have caused browser crashes in previous implementation attempts.

### Critical Business Functions

The documentation emphasizes several business-critical aspects that must be preserved during modularization:

1. **Assessment Flow**: The multi-step wizard approach gathering information about organization type, services, and business practices
2. **Comprehensive Reporting**: Rich visualization and reporting of assessment results
3. **WordPress/Divi Integration**: Integration with WordPress themes as a key deployment target
4. **Multiple Assessment Types**: Support for both agency and in-house assessments
5. **Service-Specific Recommendations**: Detailed actionable guidance based on assessment scores

## In-Depth Analysis of Business Value Components

### 1. Styling System and Theme Components

The styling system is far more than mere aesthetics - it's a critical business component providing brand consistency and user experience coherence:

#### Key Files and Components

- **`/assets/js/obsolete-theme.js`**: Not just visual styling, but a sophisticated system with timing controls to ensure theme application survives DOM updates and dynamic content changes
- **`/assets/js/theme-enforcer.js`**: Creates multiple enforcement layers to maintain visual consistency throughout the application lifecycle
- **`/assets/css/obsolete-theme.css`**: The 21KB size indicates a comprehensive styling system with careful attention to visual hierarchy and interactive elements

#### Business Impact

The dark theme with yellow accents isn't just an aesthetic choice - it represents a specific brand identity that must remain consistent across all components. Previous implementation attempts broke this consistency, indicating its critical importance to stakeholders.

The theme system also contains specialized styling for visualizations, critical for ensuring the assessment results are presented in a clear, professional manner that maintains credibility with business users.

### 2. Question Framework and Assessment Engine

The question system represents the core data collection mechanism and is significantly more complex than a simple form system:

#### Key Files and Components

- **`/assets/agency-assessment-enhanced.js`**: Contains over 2,000 lines of detailed question structures, organized by dimension (operational, financial, AI readiness) with sophisticated weighting systems
- **`/assets/js/components/agency/QuestionsRenderer.js`**: Dynamic question rendering with branching logic based on previous answers
- **`/assets/js/components/inhouse/QuestionsRenderer.js`**: Specialized version for in-house assessments with different UX patterns

#### Business Impact

The questions are meticulously crafted with industry-specific terminology and weighted scoring that directly correlates to business outcomes. The weighting system in particular has been carefully calibrated to produce accurate vulnerability scores that drive recommendations.

The agency and in-house question sets are fundamentally different in content, scope, and presentation - maintaining both within a unified framework while allowing for specialization is a critical business requirement.

### 3. Recommendation Engine

The recommendation system is perhaps the most valuable business component, providing actionable insights customized to each organization's specific circumstances:

#### Key Files and Components

- **`/assets/agency-recommendations-config.js`**: A 65KB file containing detailed, service-specific recommendations based on score thresholds
- **`/assets/js/components/agency/ResultsRenderer.js`**: Renders recommendations with proper formatting and visual hierarchy
- **Recommendation Segmentation**: Sophisticated segmentation by score level (low/mid/high), timeframe (immediate/short-term/strategic), and organization type

#### Business Impact

The system provides up to 15 different recommendation sets per service, each containing 5-10 detailed action items with complexity ratings, expected ROI, and implementation timeframes. This represents hundreds of hours of expert analysis and content creation.

The business value of the recommendations cannot be overstated - they transform raw assessment scores into concrete action plans that directly guide business transformation.

### 4. Financial Reporting and Valuation

The valuation and financial impact reporting system is the ultimate differentiator, connecting assessment results to concrete business outcomes:

#### Key Files and Components

- **`/assets/js/valuation-dashboard.js`**: A sophisticated 51KB component generating financial projections, valuation impacts, and acquisition readiness scores
- **`/assets/js/components/agency/utils/ValuationDashboard.js`**: Specialized version with agency-specific financial models
- **Financial Calculator**: Interactive tool allowing users to model different scenarios and improvement paths

#### Business Impact

The financial projections create a direct link between assessment scores and business value, showing specifically how improvements in AI readiness translate to EBITDA improvements and valuation multiples.

The sophistication of the financial models, including sector-specific multipliers and tiered valuation impacts, represents significant intellectual property and business logic that must be preserved in any refactoring.

### 5. Service-Specific Components

The specialized service components represent deep industry knowledge applied to specific business functions:

#### Key Files and Components

- **`/assets/js/components/agency/ServicesSelector.js`**: Combined service selection and revenue allocation component (recently improved per UX enhancement)
- **Service Categories**: Sophisticated categorization system grouping services into functional areas with risk profiles
- **Revenue Distribution**: Weighted allocation system with impact analysis on overall assessment scores

#### Business Impact

The service selection and revenue allocation system allows for precise calibration of results based on the organization's actual service mix and revenue exposure. The UX improvement combining these steps demonstrates the ongoing refinement of the business logic.

The service-specific question sets and recommendations represent hundreds of hours of industry expert analysis, making them among the most valuable IP assets in the entire system.

### 6. The Agency vs. In-house Dichotomy

The support for both agency and in-house assessment types represents a fundamental business decision to serve different market segments:

#### Key Files and Components

- **Agency-specific Components**: Full set of specialized components in `/assets/js/components/agency/`
- **In-house Components**: Parallel specialized components in `/assets/js/components/inhouse/`
- **Common Components**: Shared components in `/assets/js/components/common/`

#### Business Impact

The ability to support both external agencies and internal teams represents a strategic business decision to expand the market reach of the assessment tool. Each assessment type has fundamentally different questions, recommendations, and reporting needs.

The modular architecture's most important business feature is precisely this ability to swap specialized components while maintaining a consistent core engine and user experience - making the component registry's proper implementation critical to the business strategy.

### Phased Rollout Strategy

**Phase 1: Development & Testing (1 week)**
- Complete component extraction and validation
- Build test harnesses for each component
- Conduct unit testing

**Phase 2: Agency Assessment Modularization (1 week)**
- Switch agency assessment to fully modular implementation
- Maintain monolithic version as fallback
- Monitor for errors

**Phase 3: Inhouse Assessment Modularization (1 week)**
- Complete inhouse assessment components
- Switch inhouse assessment to modular implementation
- Validate all integrations

**Phase 4: Registry Integration (3 days)**
- Implement component registry
- Migrate to registry-based component resolution
- Add diagnostic tools for dependency visualization

**Phase 5: Production Deployment (2 days)**
- Deploy to staging environment
- Conduct UAT testing
- Gradual rollout to production

## Success Criteria

1. Zero browser crashes during initialization
2. All business components functioning correctly
3. Both assessment types operating from shared core
4. Performance at least equal to monolithic version
5. All advanced visualization and reporting working

## Conclusion

The assessment framework is in a transition state between monolithic and modular architectures. The modular components are well-designed but not fully integrated due to initialization issues with the component registry. The system currently falls back to using the monolithic framework with enhanced styling, as described in the memories.

The framework has been significantly improved through the modularization effort, with clearer separation of concerns, better organization, and enhanced maintainability. However, the critical component registry implementation is missing, preventing the full realization of the modular architecture vision.

The combined approach for service selection and revenue allocation mentioned in the memories has been successfully implemented, showing progress in the UX improvements. The splitting of monolithic configuration into modular files has also been largely accomplished, aligning with the reengineering plan in the memories.

What's most striking is how closely the current codebase structure aligns with the original design described in the documentation. The files and directories are organized exactly as planned, but the critical integration points (particularly the component registry) are not properly implemented, leading to the browser crashes and forcing a fallback to the monolithic approach.

Overall, the modularization effort is well-designed and mostly implemented, with only a few critical pieces missing to complete the transition. The solution will need to carefully implement the component registry with proper initialization sequencing, respecting the event-based communication patterns and component interfaces described in the original documentation.
