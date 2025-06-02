# Assessment Framework Module Structure

## Overview

The Assessment Framework uses a hybrid approach to JavaScript modules, combining ES6 module structure internally with browser globals for compatibility. This approach allows for gradual modernization while maintaining backward compatibility with browser environments where module bundlers are not available.

## Module Pattern

### Internal Structure

Files are structured internally using ES6 class and module patterns:

```javascript
// Example pattern for component files
class MyComponent {
    constructor(options) {
        this.options = options;
        // Component initialization
    }
    
    // Component methods
    method1() { /* ... */ }
    method2() { /* ... */ }
}

// Make the class available as a browser global for backward compatibility
if (typeof window !== 'undefined') {
    window.MyComponent = MyComponent;
    console.log('[MyComponent] Class registered as global');
}

// Export as ES6 module (optional - for future bundling)
// export { MyComponent };
```

### Loading Strategy

All scripts are loaded as regular browser scripts (not as ES6 modules) in the index.html file:

```html
<script src="path/to/component.js"></script>
```

This approach prevents import/export errors in browsers while still allowing for structured code.

## Dependency Management

Dependencies between components are managed through global registration and careful script loading order in the HTML file:

1. Utility functions are loaded first
2. Core framework components are loaded next
3. Shared components are loaded after core
4. Assessment-specific components are loaded last

## Configuration Files

Configuration files use plain JavaScript objects assigned to global variables:

```javascript
const MyConfig = {
    // Configuration options
};

// Make available as global
window.MyConfig = MyConfig;
```

## Shared Components

The framework uses shared components to reduce code duplication:

1. **BaseQuestionsStep** - Provides base functionality for rendering and handling questions
2. **BaseEmailStep** - Standardizes email collection and validation
3. **ProgressBar** - Renders a progress indicator for multi-step assessments
4. **ServicesSelector** - Handles service selection and revenue allocation

## Core Architecture

The framework uses a modular inheritance pattern:

- **StepBase** → BaseQuestionsStep/BaseEmailStep → Specific assessment step implementations
- **AssessmentBase** → AgencyAssessment/InhouseAssessment
- **ScoringEngineBase** → Specific scoring implementations

## Future Improvements

For future development, consider:

1. **Bundling**: Implement a module bundler (Webpack, Rollup, or Parcel) to allow true ES6 module imports/exports
2. **Package Management**: Add npm and package.json to manage dependencies
3. **Progressive Enhancement**: Gradually convert more components to use ES6 modules while maintaining the hybrid approach

## File Organization

The framework follows this overall organization:

- `/core/` - Core framework classes
- `/shared/` - Shared utilities and components
- `/assessments/` - Assessment-specific implementations
  - `/agency/` - Agency assessment
  - `/inhouse/` - In-house assessment
- `/scripts/` - Additional utility scripts
- `/styles/` - CSS styles
