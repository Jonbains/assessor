/**
 * Test Controls - Simple handlers for the test page
 * 
 * This is a standalone script that provides simple controls for the test page
 * without depending on the assessment framework.
 */

(function() {
  // Wait for DOM to be fully loaded
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[TestControls] Initializing test page controls...');
    
    // Get button references
    const showAgencyBtn = document.getElementById('toggle-agency');
    const showInhouseBtn = document.getElementById('toggle-inhouse');
    const resetAllBtn = document.getElementById('reset-tests');
    const clearConsoleBtn = document.getElementById('clear-console');
    
    // Get container references
    const agencyContainer = document.getElementById('agency-container');
    const inhouseContainer = document.getElementById('inhouse-container');
    const consoleOutput = document.getElementById('console-output');
    
    // Initially hide the containers
    if (agencyContainer) agencyContainer.style.display = 'none';
    if (inhouseContainer) inhouseContainer.style.display = 'none';
    
    // Show Agency Assessment button
    if (showAgencyBtn) {
      showAgencyBtn.onclick = function(e) {
        e.preventDefault();
        console.log('[TestControls] Toggle Agency Assessment clicked');
        
        if (agencyContainer) {
          const isVisible = agencyContainer.style.display !== 'none';
          agencyContainer.style.display = isVisible ? 'none' : 'block';
          console.log('[TestControls] Agency container is now ' + (isVisible ? 'hidden' : 'visible'));
        } else {
          console.error('[TestControls] Agency container not found');
        }
        
        return false;
      };
    }
    
    // Show Inhouse Assessment button
    if (showInhouseBtn) {
      showInhouseBtn.onclick = function(e) {
        e.preventDefault();
        console.log('[TestControls] Toggle Inhouse Assessment clicked');
        
        if (inhouseContainer) {
          const isVisible = inhouseContainer.style.display !== 'none';
          inhouseContainer.style.display = isVisible ? 'none' : 'block';
          console.log('[TestControls] Inhouse container is now ' + (isVisible ? 'hidden' : 'visible'));
        } else {
          console.error('[TestControls] Inhouse container not found');
        }
        
        return false;
      };
    }
    
    // Reset All button
    if (resetAllBtn) {
      resetAllBtn.onclick = function(e) {
        e.preventDefault();
        console.log('[TestControls] Reset All clicked');
        
        if (confirm('This will reset both assessments. Continue?')) {
          // Try to reset agency assessment
          const agencyWrapper = document.querySelector('.agency-assessment-wrapper');
          if (agencyWrapper && agencyWrapper.dataset && agencyWrapper.dataset.assessmentEngine) {
            const engine = agencyWrapper.dataset.assessmentEngine;
            if (engine && typeof engine.resetAssessment === 'function') {
              engine.resetAssessment();
              console.log('[TestControls] Agency assessment reset');
            }
          }
          
          // Try to reset inhouse assessment
          const inhouseWrapper = document.querySelector('.assessment-framework-container');
          if (inhouseWrapper && inhouseWrapper.dataset && inhouseWrapper.dataset.assessmentEngine) {
            const engine = inhouseWrapper.dataset.assessmentEngine;
            if (engine && typeof engine.resetAssessment === 'function') {
              engine.resetAssessment();
              console.log('[TestControls] Inhouse assessment reset');
            }
          }
          
          // Force page reload as fallback
          console.log('[TestControls] Reloading page to reset state');
          window.location.reload();
        }
        
        return false;
      };
    }
    
    // Clear Console button
    if (clearConsoleBtn && consoleOutput) {
      clearConsoleBtn.onclick = function(e) {
        e.preventDefault();
        console.log('[TestControls] Clear Console clicked');
        consoleOutput.innerHTML = '';
        return false;
      };
    }
    
    console.log('[TestControls] Test controls initialized successfully');
  });
})();
