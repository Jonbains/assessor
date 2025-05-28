/**
 * Theme Enforcer
 * Ensures the dark theme styling is consistently applied throughout the assessment
 * Especially for dynamically generated elements
 */

(function() {
  function enforceTheme() {
    console.log('[ThemeEnforcer] Enforcing theme styles');
    // Add obsolete-theme class to dynamically created elements
    const themeTargets = [
      '.assessment-recommendation',
      '.assessment-results-section',
      '.assessment-results',
      '.assessment-results-dimensions',
      '.assessment-action-plan-item',
      '.assessment-dimension-radar-container',
      '.assessment-vulnerability-container',
      '.assessment-service-table-container',
      '.assessment-recommendations-container',
      '.assessment-results-overall'
    ];
    
    themeTargets.forEach(selector => {
      document.querySelectorAll(selector).forEach(element => {
        if (!element.classList.contains('obsolete-theme')) {
          element.classList.add('obsolete-theme');
        }
      });
    });
    
    // Ensure recommendation boxes have the correct styling
    document.querySelectorAll('.assessment-recommendation, .assessment-results-recommendation').forEach(rec => {
      rec.style.backgroundColor = '#000000';
      rec.style.color = '#ffffff';
      rec.style.borderLeft = '4px solid var(--color-accent)';
      rec.style.padding = '20px';
      rec.style.margin = '10px 0';
      rec.style.borderRadius = '8px';
      rec.style.boxShadow = 'var(--shadow-standard)';
    });
    
    // Fix recommendation titles
    document.querySelectorAll('.assessment-results-recommendation-title, .assessment-recommendation h4').forEach(title => {
      title.style.color = 'var(--color-accent)';
      title.style.marginBottom = '10px';
      title.style.fontSize = '18px';
      title.style.fontWeight = 'bold';
    });
    
    // Fix action plan items
    document.querySelectorAll('.assessment-results-action-item, .assessment-action-plan-item').forEach(item => {
      item.style.backgroundColor = '#000000';
      item.style.color = '#ffffff';
      item.style.borderLeft = '4px solid var(--color-accent)';
      item.style.padding = '20px';
      item.style.margin = '15px 0';
      item.style.borderRadius = '8px';
      item.style.boxShadow = 'var(--shadow-standard)';
      item.style.position = 'relative';
    });
    
    // Fix action plan titles
    document.querySelectorAll('.assessment-results-action-title, .assessment-action-plan-title').forEach(title => {
      title.style.color = 'var(--color-accent)';
      title.style.marginBottom = '10px';
      title.style.fontSize = '18px';
      title.style.fontWeight = 'bold';
    });
    
    // Fix charts styling
    const chartCanvases = document.querySelectorAll('canvas');
    chartCanvases.forEach(canvas => {
      canvas.style.filter = 'drop-shadow(0 4px 12px rgba(0, 0, 0, 0.5))';
    });
  }
  
  // Run on page load
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[ThemeEnforcer] Initializing');
    
    // Apply immediately
    enforceTheme();
    
    // Apply again after a short delay (to catch late-rendered elements)
    setTimeout(enforceTheme, 1000);
    
    // Also set up a mutation observer to catch dynamically added elements
    const observer = new MutationObserver(function(mutations) {
      mutations.forEach(function(mutation) {
        if (mutation.addedNodes.length) {
          enforceTheme();
        }
      });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
    
    console.log('[ThemeEnforcer] Initialized successfully');
  });
})();
