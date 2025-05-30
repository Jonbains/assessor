# CSS Modularization Implementation Plan

This implementation plan outlines a comprehensive strategy for reorganizing the CSS architecture to align with our modular JavaScript structure, allowing for easy extension to new assessment types.

## 1. Current State Analysis

Current CSS is distributed across:
- External files (`main.css`, `assessment.css`, `inhouse-assessment.css`)
- Inline styles in HTML (index.html)
- JavaScript-generated styles (dashboard components)
- Component-specific files (13 files in styles/components/)

Key issues:
- Redundant style definitions
- No consistent component styling pattern
- Lack of style encapsulation
- No design system (colors/spacing/typography scattered everywhere)
- Inline style bloat in components

## 2. Proposed Architecture

```
/styles
  /core
    _variables.css     # CSS variables for theming
    _reset.css         # Basic browser resets
    _typography.css    # Font definitions
    _layout.css        # Grid/layout helpers
    
  /components
    _buttons.css       # Button components
    _forms.css         # Form controls
    _navigation.css    # Navigation elements
    _progress.css      # Progress indicators
    _content-blocks.css # Reusable content block components
    
  /assessments
    _common.css        # Shared assessment styles
    /inhouse
      _base.css        # Inhouse-specific base styles
      _dashboard.css   # Dashboard components
      _steps.css       # Step-specific styles
    /agency
      _base.css        # Agency-specific base styles
      _valuation.css   # Valuation components
      
  main.css             # Main entry point that imports core styles
  assessment-registry.js # JS for dynamic style loading
```

## 3. Implementation Steps

### Phase 1: Foundation (Days 1-3)

1. **Create Core Variables**
   ```css
   /* styles/core/_variables.css */
   :root {
     --color-primary: #3498db;
     --color-secondary: #2ecc71;
     --color-accent: #f1c40f;
     --color-dark: #2c3e50;
     --color-light: #f7f9fc;
     --color-text: #333333;
     --color-text-light: #ffffff;
     --color-border: #dddddd;
     
     --font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
     --spacing-sm: 8px;
     --spacing-md: 16px;
     --spacing-lg: 24px;
     --spacing-xl: 32px;
     
     --border-radius-sm: 4px;
     --border-radius-md: 8px;
     
     --shadow-sm: 0 2px 4px rgba(0,0,0,0.1);
     --shadow-md: 0 4px 8px rgba(0,0,0,0.12);
   }
   ```

2. **Create Assessment Registry**
   ```javascript
   // styles/assessment-registry.js
   const AssessmentStyleRegistry = {
     registeredTypes: {},
     
     register(type, stylesheets) {
       this.registeredTypes[type] = stylesheets;
     },
     
     loadStyles(type) {
       const sheets = this.registeredTypes[type] || [];
       sheets.forEach(sheet => {
         const link = document.createElement('link');
         link.rel = 'stylesheet';
         link.href = sheet;
         document.head.appendChild(link);
       });
     }
   };

   window.AssessmentStyleRegistry = AssessmentStyleRegistry;
   ```

3. **Reset & Base Styles**
   ```css
   /* styles/core/_reset.css */
   *,
   *::before,
   *::after {
     box-sizing: border-box;
   }

   body, h1, h2, h3, h4, p, ul, ol {
     margin: 0;
     padding: 0;
   }

   body {
     font-family: var(--font-family);
     font-size: 16px;
     line-height: 1.6;
     color: var(--color-text);
     background-color: var(--color-light);
   }
   ```

### Phase 2: Component Extraction (Days 4-7)

1. **Extract Common Components**
   - Standardize buttons, forms, tables across assessments
   - Create content block components for dashboard elements

2. **Content Block System**
   ```css
   /* styles/components/_content-blocks.css */
   .content-block {
     margin-bottom: var(--spacing-lg);
     border-radius: var(--border-radius-md);
     overflow: hidden;
   }

   .content-block__header {
     padding: var(--spacing-md);
     background-color: var(--color-light);
     border-bottom: 1px solid var(--color-border);
   }

   .content-block__body {
     padding: var(--spacing-md);
   }

   /* Component-specific blocks */
   .dashboard-metric-block {
     display: flex;
     flex-direction: column;
     padding: var(--spacing-lg);
     background-color: white;
     border-radius: var(--border-radius-md);
     box-shadow: var(--shadow-sm);
   }

   .question-block {
     padding: var(--spacing-lg);
     border-radius: var(--border-radius-md);
     background-color: white;
     margin-bottom: var(--spacing-lg);
     box-shadow: var(--shadow-sm);
   }
   ```

### Phase 3: Assessment-Specific Styles (Days 8-10)

1. **Extract Inhouse Assessment Styles**
   - Move inline styles from dashboard.js to external CSS
   - Extract styles from all step components
   - Create inhouse-specific themes

2. **Extract Agency Assessment Styles**
   - Extract valuation dashboard styles
   - Extract service revenue selector styles
   - Create agency-specific themes

3. **Create Assessment Extension Template**
   ```css
   /* styles/assessments/_template.css */
   /*
    * Assessment Template
    * Copy this file to create a new assessment type stylesheet
    */
   .assessment-{TYPE} {
     --assessment-primary-color: var(--color-primary);
     --assessment-secondary-color: var(--color-secondary);
   }
   ```

### Phase 4: Integration (Days 11-12)

1. **Main Stylesheet**
   ```css
   /* styles/main.css */
   @import 'core/_variables.css';
   @import 'core/_reset.css';
   @import 'core/_typography.css';
   @import 'core/_layout.css';

   /* Components - always loaded */
   @import 'components/_buttons.css';
   @import 'components/_forms.css';
   @import 'components/_content-blocks.css';

   /* Assessment Common */
   @import 'assessments/_common.css';
   ```

2. **Register Existing Assessment Types**
   ```javascript
   // Register inhouse assessment
   AssessmentStyleRegistry.register('inhouse-marketing', [
     'styles/assessments/inhouse/base.css',
     'styles/assessments/inhouse/dashboard.css',
     'styles/assessments/inhouse/steps.css'
   ]);

   // Register agency assessment
   AssessmentStyleRegistry.register('agency', [
     'styles/assessments/agency/base.css',
     'styles/assessments/agency/valuation.css',
     'styles/assessments/agency/service-revenue.css'
   ]);
   ```

3. **Update Assessment Base Class**
   ```javascript
   // In assessment-base.js
   initializeStyles() {
     document.body.classList.add(`assessment-${this.type}`);
     
     if (window.AssessmentStyleRegistry) {
       window.AssessmentStyleRegistry.loadStyles(this.type);
     }
   }
   ```

### Phase 5: Migration & Cleanup (Days 13-14)

1. **Update HTML**
   - Remove inline styles
   - Update to new structure
   - Remove redundant CSS links

2. **Update Components**
   - Remove inline style generation
   - Use the new content block classes

3. **Clean Legacy CSS**
   - Identify and remove unused styles
   - Consolidate duplicate definitions

### Phase 6: New Assessment Type Example (Day 15)

Example of adding a completely new assessment type:

1. **Create Assessment-Specific Styles**
   ```css
   /* styles/assessments/sustainability/_base.css */
   .assessment-sustainability {
     --assessment-primary-color: #2ecc71;
     --assessment-secondary-color: #27ae60;
   }

   .sustainability-dashboard {
     /* Dashboard styling */
   }
   ```

2. **Register New Assessment**
   ```javascript
   AssessmentStyleRegistry.register('sustainability', [
     'styles/assessments/sustainability/base.css',
     'styles/assessments/sustainability/dashboard.css',
     'styles/assessments/sustainability/steps.css'
   ]);
   ```

3. **Create Assessment Class**
   ```javascript
   class SustainabilityAssessment extends AssessmentBase {
     constructor(config) {
       super(config);
       this.type = 'sustainability';
       this.initializeStyles();
     }
   }
   ```

## 4. Benefits of This Approach

1. **Modular & Extensible**: Clear path for adding new assessment types
2. **Consistency**: Unified theming through CSS variables
3. **Performance**: Only load styles needed for current assessment
4. **Maintainability**: Organized structure with clear separation of concerns
5. **Reusability**: Component system encourages code sharing between assessments

## 5. Implementation Timeline

| Phase | Task | Timeline | Priority |
|-------|------|----------|----------|
| 1 | Foundation | Days 1-3 | High |
| 2 | Component Extraction | Days 4-7 | High |
| 3 | Assessment-Specific Styles | Days 8-10 | Medium |
| 4 | Integration | Days 11-12 | Medium |
| 5 | Migration & Cleanup | Days 13-14 | Medium |
| 6 | New Assessment Example | Day 15 | Low |

## 6. Future Enhancements

1. **Component Library**: Create a visual reference of all available components
2. **CSS Optimization**: Add minification and bundling for production
3. **Theme System**: Allow runtime theme switching
4. **Documentation**: Expand documentation for new assessment creation
