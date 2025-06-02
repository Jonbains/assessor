/**
 * Obsolete Theme
 * 
 * Dark theme with yellow accent for Obsolete Agency Assessor
 * Comprehensive theme for easy reskinning of the assessment framework
 */
const obsoleteTheme = {
  /**
   * Force apply the obsolete theme to all elements
   */
  forceApply: function() {
    console.log('[ObsoleteTheme] Applying theme to all elements');
    
    // Add the obsolete-theme class to body
    document.body.classList.add('obsolete-theme');
    
    // Add obsolete-theme class to ALL possible containers
    const containers = [
      document.getElementById('agency-assessment-container'),
      document.getElementById('assessment-container'),
      document.querySelector('.assessment-container'),
      document.querySelector('.container'),
      document.querySelector('.assessment-fullscreen-container')
    ];
    
    containers.forEach(container => {
      if (container) {
        container.classList.add('obsolete-theme');
        
        // Ensure container is visible and styled correctly
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
        
        // Apply basic styling directly
        container.style.backgroundColor = '#121212';
        container.style.color = '#FFFFFF';
      }
    });
    
    // Add obsolete-theme class to all relevant elements
    const allElements = [
      '.assessment-component', 
      '.question-option',
      '.assessment-section',
      '.assessment-step-title',
      '.assessment-option',
      '.assessment-option-title',
      '.assessment-option-description',
      '.question-text',
      '.question-options',
      '.question-container',
      '.prev-button', 
      '.next-button',
      '.submit-button',
      '.service-revenue-slider',
      '.slider-controls',
      '.revenue-slider',
      '.assessment-navigation',
      '.agency-type-section',
      '.service-selection-section',
      '.questions-section',
      '.email-section',
      '.results-section'
    ];
    
    allElements.forEach(selector => {
      const elements = document.querySelectorAll(selector);
      elements.forEach(element => {
        element.classList.add('obsolete-theme');
      });
    });
    
    // Apply specific styling directly to common elements
    this.applyDirectStyles();
    
    // Log when theme is applied
    console.log('[ObsoleteTheme] Theme applied successfully');
  },
  
  /**
   * Apply direct CSS styles to ensure elements are properly styled
   * This serves as a fallback when class-based styling fails
   */
  applyDirectStyles: function() {
    // Style assessment options (agency types, services)
    const assessmentOptions = document.querySelectorAll('.assessment-option');
    assessmentOptions.forEach(option => {
      option.style.backgroundColor = '#1E1E1E';
      option.style.border = '1px solid #333333';
      option.style.borderRadius = '8px';
      option.style.padding = '20px';
      option.style.margin = '10px 0';
      option.style.cursor = 'pointer';
      option.style.transition = 'all 0.3s ease';
    });
    
    // Style buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach(button => {
      button.style.backgroundColor = '#F8D700'; // Yellow accent
      button.style.color = '#121212';
      button.style.border = 'none';
      button.style.borderRadius = '4px';
      button.style.padding = '10px 20px';
      button.style.cursor = 'pointer';
      button.style.fontWeight = 'bold';
      button.style.transition = 'all 0.3s ease';
    });
    
    // Style headings
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
    headings.forEach(heading => {
      heading.style.color = '#FFFFFF';
      heading.style.fontFamily = "'Inter', sans-serif";
    });
    
    // Style text
    const paragraphs = document.querySelectorAll('p');
    paragraphs.forEach(p => {
      p.style.color = '#CCCCCC';
      p.style.fontFamily = "'Inter', sans-serif";
    });
    
    // Ensure question options have proper styling
    const questionOptions = document.querySelectorAll('.question-option');
    questionOptions.forEach(option => {
      option.style.backgroundColor = '#1E1E1E';
      option.style.border = '1px solid #333333';
      option.style.borderRadius = '4px';
      option.style.padding = '15px';
      option.style.margin = '8px 0';
      option.style.cursor = 'pointer';
    });
  },
  
  /**
   * Initialize the obsolete theme
   */
  init: function() {
    console.log('[ObsoleteTheme] Initializing');
    
    // Apply theme immediately
    this.forceApply();
    
    // Apply again after a short delay to ensure DOM is fully available
    setTimeout(() => {
      this.forceApply();
    }, 100);
    
    // Apply again after page has fully loaded
    window.addEventListener('load', () => {
      console.log('[ObsoleteTheme] Window load event - applying theme');
      this.forceApply();
      
      // And again after a short delay to catch any late rendering
      setTimeout(() => {
        this.forceApply();
      }, 500);
    });
    
    // Apply theme when DOM content is loaded
    document.addEventListener('DOMContentLoaded', () => {
      console.log('[ObsoleteTheme] DOMContentLoaded event - applying theme');
      this.forceApply();
    });
    
    // Set up a mutation observer to detect any DOM changes
    const targetNode = document.body;
    const config = { childList: true, subtree: true, attributes: true };
    
    // Create an observer instance
    const observer = new MutationObserver((mutations) => {
      // Apply theme whenever any DOM changes occur
      this.forceApply();
    });
    
    // Start observing with throttling to prevent performance issues
    let timeout = null;
    const throttledObserver = new MutationObserver((mutations) => {
      if (!timeout) {
        timeout = setTimeout(() => {
          this.forceApply();
          timeout = null;
        }, 200);
      }
    });
    
    throttledObserver.observe(targetNode, config);
    
    console.log('[ObsoleteTheme] Initialization complete');
    return this;
  }
};

// Auto-initialize the theme
obsoleteTheme.init();

// Ensure the theme is applied after all scripts have loaded
window.addEventListener('load', function() {
  setTimeout(function() {
    obsoleteTheme.forceApply();
    
    // Make all containers visible
    const containers = document.querySelectorAll('.assessment-fullscreen-container, #agency-assessment-container');
    containers.forEach(container => {
      if (container) {
        container.style.display = 'block';
        container.style.visibility = 'visible';
        container.style.opacity = '1';
      }
    });
  }, 300);
});

console.log('[ObsoleteTheme] Module loaded');
