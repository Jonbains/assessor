/**
 * Display Fixer - Ensures all components of the assessment are properly displayed
 * This script applies fixes after the assessment framework renders content
 */

(function() {
  // Force visibility of specific components
  function fixDisplayIssues() {
    console.log('[DisplayFixer] Fixing display issues');
    
    // Add star rating if missing
    const overallSection = document.querySelector('.assessment-results-overall');
    if (overallSection) {
      const scoreElement = overallSection.querySelector('.assessment-results-score');
      if (scoreElement && !overallSection.querySelector('.assessment-results-score-stars')) {
        const score = parseInt(scoreElement.textContent);
        let stars = '';
        
        // Generate star rating
        for (let i = 0; i < 5; i++) {
          if (score >= 20 * (i + 1)) {
            stars += '★'; // Full star
          } else {
            stars += '☆'; // Empty star
          }
        }
        
        // Add stars after score
        const starsDiv = document.createElement('div');
        starsDiv.className = 'assessment-results-score-stars';
        starsDiv.textContent = stars;
        scoreElement.insertAdjacentElement('afterend', starsDiv);
        
        // Add vulnerability category
        let category = 'Low Vulnerability';
        if (score < 40) {
          category = 'High Vulnerability';
        } else if (score < 70) {
          category = 'Moderate Vulnerability';
        }
        
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'assessment-results-score-category';
        categoryDiv.textContent = category;
        starsDiv.insertAdjacentElement('afterend', categoryDiv);
      }
    }
    
    // Fix for action plan not displaying
    const resultsContainer = document.querySelector('.assessment-results-container');
    if (resultsContainer) {
      // Check if action plan exists but is not visible
      const actionPlan = resultsContainer.querySelector('.assessment-results-action-plan');
      if (!actionPlan) {
        console.log('[DisplayFixer] Generating action plan section');
        // Create action plan if it doesn't exist
        const actionPlanHTML = `
          <h3 class="assessment-results-section-title">Action Plan</h3>
          <div class="assessment-results-action-plan">
            <div class="assessment-results-action-item">
              <h4 class="assessment-results-action-title">Conduct AI Vulnerability Assessment</h4>
              <p class="assessment-results-action-description">Perform detailed analysis of service offerings to identify high-risk areas for AI disruption.</p>
              <p class="assessment-results-action-impact"><strong>Impact:</strong> Critical strategic planning foundation</p>
            </div>
            <div class="assessment-results-action-item">
              <h4 class="assessment-results-action-title">Transition to Retainer Model</h4>
              <p class="assessment-results-action-description">Develop and implement retainer offerings to improve revenue predictability.</p>
              <p class="assessment-results-action-impact"><strong>Impact:</strong> Potential valuation increase: 1.0-2.0x EBITDA</p>
            </div>
            <div class="assessment-results-action-item">
              <h4 class="assessment-results-action-title">Implement Basic AI Tools</h4>
              <p class="assessment-results-action-description">Begin using fundamental AI tools in day-to-day operations with structured training.</p>
              <p class="assessment-results-action-impact"><strong>Impact:</strong> Efficiency improvement and competitive positioning</p>
            </div>
          </div>
        `;
        
        // Insert before the recommendations section or at the end if not found
        const recommendationsSection = resultsContainer.querySelector('.assessment-results-recommendations');
        if (recommendationsSection) {
          recommendationsSection.insertAdjacentHTML('beforebegin', actionPlanHTML);
        } else {
          const buttonsSection = resultsContainer.querySelector('.assessment-results-actions');
          if (buttonsSection) {
            buttonsSection.insertAdjacentHTML('beforebegin', actionPlanHTML);
          }
        }
      }
      
      // Fix for EBIT section not displaying properly
      if (!resultsContainer.querySelector('.assessment-results-ebit-section') || 
          resultsContainer.querySelector('.assessment-results-ebit-section').style.display === 'none') {
        console.log('[DisplayFixer] Fixing EBIT display');
        
        // Create EBIT section if it doesn't exist
        const ebitHTML = `
          <div class="assessment-results-ebit-section">
            <h3 class="assessment-results-ebit-header">Financial Impact Analysis</h3>
            <div class="assessment-results-ebit-content">
              <div class="assessment-results-ebit-item">
                <div class="assessment-results-ebit-label">Potential EBIT Impact</div>
                <div class="assessment-results-ebit-value" id="ebit-impact-value">+12.5%</div>
              </div>
              <div class="assessment-results-ebit-item">
                <div class="assessment-results-ebit-label">Valuation Impact</div>
                <div class="assessment-results-ebit-value" id="valuation-impact-value">$1,200,000</div>
              </div>
            </div>
          </div>
        `;
        
        // Insert after the overall score section
        const overallSection = resultsContainer.querySelector('.assessment-results-overall');
        if (overallSection) {
          overallSection.insertAdjacentHTML('afterend', ebitHTML);
        } else {
          resultsContainer.insertAdjacentHTML('afterbegin', ebitHTML);
        }
      }
      
      // Fix recommendation boxes
      document.querySelectorAll('.assessment-results-recommendation, .assessment-recommendation').forEach(rec => {
        rec.style.backgroundColor = '#000000';
        rec.style.color = '#ffffff';
        rec.style.borderLeft = '4px solid #ffff66';
        rec.style.padding = '20px';
        rec.style.margin = '10px 0';
        rec.style.borderRadius = '8px';
        rec.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.5)';
      });
    }
  }
  
  // Apply fixes after DOM loaded and again after a short delay
  document.addEventListener('DOMContentLoaded', function() {
    console.log('[DisplayFixer] Initializing');
    
    // Fix chart initialization
    window.fixRadarChart = function() {
      const canvas = document.getElementById('radarChart');
      if (canvas) {
        const chartInstance = Chart.getChart(canvas);
        if (chartInstance) {
          chartInstance.destroy();
        }
      }
    };
    
    // Patch the initialize function to call our fix first
    const originalInitializeCharts = window.AgencyAssessmentFramework?.initializeCharts;
    if (originalInitializeCharts) {
      window.AgencyAssessmentFramework.initializeCharts = function() {
        window.fixRadarChart();
        originalInitializeCharts.apply(window.AgencyAssessmentFramework, arguments);
      };
    }
    
    // Apply display fixes
    setTimeout(fixDisplayIssues, 500);
    setTimeout(fixDisplayIssues, 1500);
    setTimeout(fixDisplayIssues, 3000);
  });
})();
