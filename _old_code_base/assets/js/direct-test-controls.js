/**
 * Direct Test Controls
 * 
 * Simple, standalone button handlers that don't depend on jQuery or other libraries.
 * This uses direct DOM manipulation to ensure reliable button functionality.
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('[DirectTestControls] Setting up button handlers...');
  
  // Get button elements
  const agencyButton = document.getElementById('toggle-agency');
  const inhouseButton = document.getElementById('toggle-inhouse');
  const resetButton = document.getElementById('reset-tests');
  const clearButton = document.getElementById('clear-console');
  
  // Get container elements
  const agencyContainer = document.getElementById('agency-container');
  const inhouseContainer = document.getElementById('inhouse-container');
  const consoleOutput = document.getElementById('console-output');
  
  // Function to toggle container visibility
  function toggleContainer(container, button) {
    if (!container) {
      console.error('[DirectTestControls] Container not found');
      return;
    }
    
    // Get current display state
    const isVisible = container.style.display !== 'none';
    
    // Toggle visibility
    container.style.display = isVisible ? 'none' : 'block';
    
    // Update button text
    if (button) {
      const actionText = isVisible ? 'Show' : 'Hide';
      const assessmentType = button.id.includes('agency') ? 'Agency' : 'Inhouse';
      button.textContent = `${actionText} ${assessmentType} Assessment`;
    }
    
    console.log(`[DirectTestControls] Container ${container.id} is now ${isVisible ? 'hidden' : 'visible'}`);
    
    // Initialize assessment if being shown
    if (!isVisible && container.style.display === 'block') {
      if (window.AssessmentFramework && window.AssessmentFramework.initialize) {
        // Force initialization of assessment in this container
        const assessmentContainer = container.querySelector('.agency-assessment-wrapper, .assessment-framework-container');
        if (assessmentContainer) {
          console.log(`[DirectTestControls] Initializing assessment in ${container.id}`);
          window.AssessmentFramework.initialize(assessmentContainer);
        }
      }
    }
  }
  
  // Set up Agency button
  if (agencyButton && agencyContainer) {
    agencyButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('[DirectTestControls] Agency button clicked');
      toggleContainer(agencyContainer, agencyButton);
    });
  }
  
  // Set up Inhouse button
  if (inhouseButton && inhouseContainer) {
    inhouseButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('[DirectTestControls] Inhouse button clicked');
      toggleContainer(inhouseContainer, inhouseButton);
    });
  }
  
  // Set up Reset button
  if (resetButton) {
    resetButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('[DirectTestControls] Reset button clicked');
      
      if (confirm('This will reset the assessments. Continue?')) {
        console.log('[DirectTestControls] Reloading page...');
        window.location.reload();
      }
    });
  }
  
  // Set up Clear Console button
  if (clearButton && consoleOutput) {
    clearButton.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('[DirectTestControls] Clear console button clicked');
      consoleOutput.innerHTML = '';
    });
  }
  
  console.log('[DirectTestControls] Button handlers set up successfully');
});
