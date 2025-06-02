/**
 * Results Renderer Component for Agency Assessment
 * 
 * Displays assessment results including scores, recommendations, and visualizations.
 * Uses Chart.js for data visualization.
 * Integrates with ValuationDashboard for financial analysis and detailed reporting.
 */

class ResultsRenderer {
  /**
   * Create a results renderer component
   * @param {Object} options - Component options
   */
  constructor(options) {
    this.container = options.container;
    this.eventBus = options.eventBus;
    this.engine = options.engine;
    this.state = options.state || {};
    this.config = options.config || {};
    
    // Reference to the ValuationDashboard utility
    this.valuationDashboard = null;
    
    // Dashboard data storage
    this.dashboardData = null;
    
    // Bind methods
    this.downloadResults = this.downloadResults.bind(this);
    this.initializeCharts = this.initializeCharts.bind(this);
    this.calculateValuationMetrics = this.calculateValuationMetrics.bind(this);
    
    // Load ValuationDashboard dependency
    this.loadValuationDashboard();
  }
  
  /**
   * Load ValuationDashboard dependency
   */
  loadValuationDashboard() {
    // Check if ValuationDashboard is already loaded globally
    if (window.ValuationDashboard) {
      this.valuationDashboard = window.ValuationDashboard;
      console.log('[ResultsRenderer] Using global ValuationDashboard');
      return;
    }
    
    // Try to load from the components folder
    const script = document.createElement('script');
    script.src = 'assets/js/components/agency/utils/ValuationDashboard.js';
    script.async = false;
    
    script.onload = () => {
      this.valuationDashboard = window.ValuationDashboard;
      console.log('[ResultsRenderer] ValuationDashboard loaded successfully');
    };
    
    script.onerror = (error) => {
      console.error('[ResultsRenderer] Error loading ValuationDashboard:', error);
      // Fallback to original location
      const fallbackScript = document.createElement('script');
      fallbackScript.src = 'assets/js/valuation-dashboard.js';
      fallbackScript.async = false;
      
      fallbackScript.onload = () => {
        this.valuationDashboard = window.ValuationDashboard;
        console.log('[ResultsRenderer] ValuationDashboard loaded from fallback location');
      };
      
      document.head.appendChild(fallbackScript);
    };
    
    document.head.appendChild(script);
  }
  
  /**
   * Download results as JSON
   */
  downloadResults() {
    if (!this.state.results) return;
    
    try {
      // Create JSON data
      const resultsData = {
        assessmentType: 'agency',
        timestamp: new Date().toISOString(),
        agencyType: this.state.selectedType,
        services: this.state.selectedServices,
        scores: this.state.results.scores,
        recommendations: this.state.results.recommendations
      };
      
      // Add valuation metrics if available
      if (this.dashboardData && this.dashboardData.metrics) {
        resultsData.valuationMetrics = this.dashboardData.metrics;
      }
      
      // Create blob and download link
      const dataStr = JSON.stringify(resultsData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'agency-assessment-results.json';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('[ResultsRenderer] Error downloading results:', error);
    }
  }
  
  /**
   * Calculate valuation metrics using ValuationDashboard
   * @returns {Object|null} - Dashboard data or null if calculation failed
   */
  calculateValuationMetrics() {
    if (!this.valuationDashboard) {
      console.warn('[ResultsRenderer] ValuationDashboard not available');
      return null;
    }
    
    try {
      // Prepare data for ValuationDashboard
      const assessmentData = {
        scores: this.state.results.scores,
        serviceScores: this.state.results.serviceScores || {},
        selectedServices: this.state.selectedServices || [],
        agencyType: this.state.selectedType,
        revenue: this.state.revenue || {},
        answers: this.state.answers || {}
      };
      
      // Use ValuationDashboard to generate results
      const dashboardData = this.valuationDashboard.generateDashboard(assessmentData, this.config);
      
      // Store dashboard data
      this.dashboardData = dashboardData;
      
      return dashboardData;
    } catch (error) {
      console.error('[ResultsRenderer] Error calculating valuation metrics:', error);
      return null;
    }
  }
  
  /**
   * Initialize charts for results visualization
   */
  initializeCharts() {
    if (!this.state.results || typeof Chart === 'undefined') {
      console.warn('[ResultsRenderer] Cannot initialize charts - missing results or Chart.js');
      return;
    }
    
    try {
      // Get chart canvas elements
      const radarCanvas = this.container.querySelector('#radarChart');
      const vulnerabilityCanvas = this.container.querySelector('#vulnerabilityChart');
      
      if (radarCanvas) {
        this.initializeRadarChart(radarCanvas);
      }
      
      if (vulnerabilityCanvas) {
        this.initializeVulnerabilityChart(vulnerabilityCanvas);
      }
      
      // Initialize calculator if using ValuationDashboard
      if (this.dashboardData && this.valuationDashboard && this.valuationDashboard.initializeCalculator) {
        setTimeout(() => {
          try {
            this.valuationDashboard.initializeCalculator(this.dashboardData.metrics);
          } catch (err) {
            console.error('[ResultsRenderer] Error initializing calculator:', err);
          }
        }, 200);
      }
    } catch (error) {
      console.error('[ResultsRenderer] Error initializing charts:', error);
    }
  }
  
  /**
   * Initialize radar chart for dimension scores
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  initializeRadarChart(canvas) {
    const scores = this.state.results.scores;
    
    // Prepare data
    const radarData = {
      labels: [
        'Operational Maturity',
        'Financial Resilience',
        'AI Readiness',
        'Strategic Positioning'
      ],
      datasets: [{
        label: 'Your Scores',
        data: [
          scores.operational,
          scores.financial,
          scores.ai,
          scores.strategic
        ],
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(54, 162, 235, 1)'
      }]
    };
    
    // Chart options
    const radarOptions = {
      scales: {
        r: {
          angleLines: { color: 'rgba(0, 0, 0, 0.1)' },
          grid: { color: 'rgba(0, 0, 0, 0.1)' },
          pointLabels: { color: '#333', font: { size: 14 } },
          ticks: { display: false, maxTicksLimit: 5 },
          suggestedMin: 0,
          suggestedMax: 100
        }
      },
      plugins: {
        legend: { position: 'top' },
        tooltip: { 
          callbacks: {
            title: function(items) { return items[0].label; },
            label: function(item) { return `Score: ${item.raw}/100`; }
          }
        }
      }
    };
    
    // Create chart
    if (window.radarChartInstance) {
      window.radarChartInstance.destroy();
    }
    
    window.radarChartInstance = new Chart(canvas, {
      type: 'radar',
      data: radarData,
      options: radarOptions
    });
  }
  
  /**
   * Initialize vulnerability chart for service scores
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  initializeVulnerabilityChart(canvas) {
    const serviceScores = this.state.results.serviceScores || {};
    const servicesList = Object.keys(serviceScores);
    
    if (servicesList.length === 0) {
      console.warn('[ResultsRenderer] No service scores available for chart');
      return;
    }
    
    // Get service names
    const serviceNames = servicesList.map(serviceId => {
      const service = this.config.services.find(s => s.id === serviceId);
      return service ? service.name : serviceId;
    });
    
    // Prepare data
    const vulnerabilityData = {
      labels: serviceNames,
      datasets: [{
        label: 'Service Vulnerability',
        data: servicesList.map(serviceId => 100 - (serviceScores[serviceId] || 0)),
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    };
    
    // Chart options
    const vulnerabilityOptions = {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'Vulnerability Score'
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function(item) {
              return `Vulnerability: ${item.raw}%`;
            }
          }
        }
      }
    };
    
    // Create chart
    if (window.vulnerabilityChartInstance) {
      window.vulnerabilityChartInstance.destroy();
    }
    
    window.vulnerabilityChartInstance = new Chart(canvas, {
      type: 'bar',
      data: vulnerabilityData,
      options: vulnerabilityOptions
    });
  }
  
  /**
   * Format number with commas
   * @param {number} num - Number to format
   * @returns {string} - Formatted number
   */
  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  
  /**
   * Validate the component
   * @returns {boolean} - Whether the component is valid
   */
  validate() {
    return true; // Results page doesn't need validation
  }
  
  /**
   * Render the component
   */
  render() {
    // Clear container
    this.container.innerHTML = '';
    
    // If no results, show error
    if (!this.state.results) {
      this.renderError();
      return;
    }
    
    // Try to calculate valuation metrics
    const dashboardData = this.calculateValuationMetrics();
    
    // Render with ValuationDashboard if available, otherwise use basic rendering
    if (dashboardData && dashboardData.html) {
      this.renderWithValuationDashboard(dashboardData);
    } else {
      this.renderBasicResults();
    }
  }
  
  /**
   * Render using ValuationDashboard output
   * @param {Object} dashboardData - Dashboard data
   */
  renderWithValuationDashboard(dashboardData) {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'assessment-results-wrapper';
    
    // Add header
    this.renderHeader(wrapper);
    
    // Create dashboard container
    const dashboardContainer = document.createElement('div');
    dashboardContainer.className = 'valuation-dashboard-container';
    dashboardContainer.innerHTML = dashboardData.html;
    wrapper.appendChild(dashboardContainer);
    
    // Add download button
    const downloadContainer = document.createElement('div');
    downloadContainer.className = 'assessment-download-container';
    downloadContainer.style.textAlign = 'center';
    downloadContainer.style.margin = '30px 0';
    
    const downloadButton = document.createElement('button');
    downloadButton.className = 'assessment-download-button';
    downloadButton.textContent = 'Download Results';
    downloadButton.style.padding = '10px 20px';
    downloadButton.style.backgroundColor = '#1e88e5';
    downloadButton.style.color = 'white';
    downloadButton.style.border = 'none';
    downloadButton.style.borderRadius = '4px';
    downloadButton.style.cursor = 'pointer';
    downloadButton.style.fontSize = '16px';
    downloadButton.addEventListener('click', this.downloadResults);
    
    downloadContainer.appendChild(downloadButton);
    wrapper.appendChild(downloadContainer);
    
    // Add to container
    this.container.appendChild(wrapper);
    
    // Initialize charts after rendering
    setTimeout(this.initializeCharts, 100);
  }
  
  /**
   * Render basic results without ValuationDashboard
   */
  renderBasicResults() {
    // Create wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'assessment-results-wrapper';
    
    // Render all sections
    this.renderHeader(wrapper);
    this.renderScoresSection(wrapper);
    this.renderChartsSection(wrapper);
    this.renderRecommendationsSection(wrapper);
    this.renderActionPlanSection(wrapper);
    this.renderFinancialImpactSection(wrapper);
    
    // Add to container
    this.container.appendChild(wrapper);
    
    // Initialize charts after rendering
    setTimeout(this.initializeCharts, 100);
  }
  
  /**
   * Render error message
   */
  renderError() {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'assessment-error';
    errorDiv.innerHTML = `
      <h3>Results Not Available</h3>
      <p>There was an error generating your assessment results. Please try again or contact support.</p>
      <button class="assessment-reset-button">Restart Assessment</button>
    `;
    
    // Add reset button handler
    const resetButton = errorDiv.querySelector('.assessment-reset-button');
    if (resetButton) {
      resetButton.addEventListener('click', () => {
        if (this.engine && this.engine.resetAssessment) {
          this.engine.resetAssessment();
        }
      });
    }
    
    this.container.appendChild(errorDiv);
  }
  
  /**
   * Render header section
   * @param {HTMLElement} wrapper - Wrapper element
   */
  renderHeader(wrapper) {
    const agencyType = this.getAgencyTypeName();
    
    const header = document.createElement('div');
    header.className = 'assessment-results-header';
    
    const title = document.createElement('h2');
    title.className = 'assessment-results-title';
    title.textContent = `${agencyType} AI Vulnerability Assessment Results`;
    
    const subtitle = document.createElement('p');
    subtitle.className = 'assessment-results-subtitle';
    subtitle.textContent = 'Based on your responses, we\'ve analyzed your agency\'s AI readiness and identified areas for improvement.';
    
    header.appendChild(title);
    header.appendChild(subtitle);
    wrapper.appendChild(header);
  }
  
  /**
   * Render scores section
   * @param {HTMLElement} wrapper - Wrapper element
   */
  renderScoresSection(wrapper) {
    const scores = this.state.results.scores;
    
    const scoresSection = document.createElement('div');
    scoresSection.className = 'assessment-results-scores';
    
    // Create overall score
    const overallScoreDiv = document.createElement('div');
    overallScoreDiv.className = 'overall-score';
    overallScoreDiv.innerHTML = `
      <div class="score-value">${Math.round(scores.overall)}</div>
      <div class="score-label">Overall Score</div>
    `;
    
    // Create dimension scores
    const dimensionScoresDiv = document.createElement('div');
    dimensionScoresDiv.className = 'dimension-scores';
    
    // Add each dimension score
    const dimensions = [
      { id: 'operational', name: 'Operational Maturity' },
      { id: 'financial', name: 'Financial Resilience' },
      { id: 'ai', name: 'AI Readiness' },
      { id: 'strategic', name: 'Strategic Positioning' }
    ];
    
    dimensions.forEach(dimension => {
      const scoreValue = Math.round(scores[dimension.id] || 0);
      
      const dimensionDiv = document.createElement('div');
      dimensionDiv.className = 'dimension-score';
      dimensionDiv.innerHTML = `
        <div class="score-value">${scoreValue}</div>
        <div class="score-label">${dimension.name}</div>
      `;
      
      dimensionScoresDiv.appendChild(dimensionDiv);
    });
    
    scoresSection.appendChild(overallScoreDiv);
    scoresSection.appendChild(dimensionScoresDiv);
    wrapper.appendChild(scoresSection);
  }
  
  /**
   * Render charts section
   * @param {HTMLElement} wrapper - Wrapper element
   */
  renderChartsSection(wrapper) {
    const chartsSection = document.createElement('div');
    chartsSection.className = 'assessment-results-charts';
    
    // Create chart containers
    const radarChartContainer = document.createElement('div');
    radarChartContainer.className = 'chart-container';
    radarChartContainer.innerHTML = `
      <h3>Dimension Scores</h3>
      <canvas id="radarChart" width="400" height="300"></canvas>
    `;
    
    const vulnerabilityChartContainer = document.createElement('div');
    vulnerabilityChartContainer.className = 'chart-container';
    vulnerabilityChartContainer.innerHTML = `
      <h3>Service Vulnerability</h3>
      <canvas id="vulnerabilityChart" width="400" height="300"></canvas>
    `;
    
    chartsSection.appendChild(radarChartContainer);
    chartsSection.appendChild(vulnerabilityChartContainer);
    wrapper.appendChild(chartsSection);
  }
  
  /**
   * Render recommendations section
   * @param {HTMLElement} wrapper - Wrapper element
   */
  renderRecommendationsSection(wrapper) {
    const recommendations = this.state.results.recommendations || [];
    
    if (recommendations.length === 0) {
      return;
    }
    
    const recommendationsSection = document.createElement('div');
    recommendationsSection.className = 'assessment-results-recommendations';
    
    // Create header
    const header = document.createElement('h3');
    header.textContent = 'Key Recommendations';
    recommendationsSection.appendChild(header);
    
    // Create recommendations list
    const recommendationsList = document.createElement('div');
    recommendationsList.className = 'recommendations-list';
    
    // Add recommendations
    recommendations.forEach(recommendation => {
      const recommendationItem = document.createElement('div');
      recommendationItem.className = 'recommendation-item';
      
      const recommendationTitle = document.createElement('h4');
      recommendationTitle.textContent = recommendation.title;
      recommendationItem.appendChild(recommendationTitle);
      
      const recommendationText = document.createElement('p');
      recommendationText.textContent = recommendation.text;
      recommendationItem.appendChild(recommendationText);
      
      recommendationsList.appendChild(recommendationItem);
    });
    
    recommendationsSection.appendChild(recommendationsList);
    wrapper.appendChild(recommendationsSection);
  }
  
  /**
   * Render action plan section
   * @param {HTMLElement} wrapper - Wrapper element
   */
  renderActionPlanSection(wrapper) {
    const actionPlan = this.state.results.actionPlan || [];
    
    if (actionPlan.length === 0) {
      return;
    }
    
    const actionPlanSection = document.createElement('div');
    actionPlanSection.className = 'assessment-results-action-plan';
    
    // Create header
    const header = document.createElement('h3');
    header.textContent = 'Your Action Plan';
    actionPlanSection.appendChild(header);
    
    // Create action plan list
    const actionPlanList = document.createElement('div');
    actionPlanList.className = 'action-plan-list';
    
    // Add action items
    actionPlan.forEach((action, index) => {
      const actionItem = document.createElement('div');
      actionItem.className = 'action-item';
      
      const actionTitle = document.createElement('h4');
      actionTitle.textContent = action.title;
      actionItem.appendChild(actionTitle);
      
      const actionDescription = document.createElement('p');
      actionDescription.textContent = action.description;
      actionItem.appendChild(actionDescription);
      
      if (action.impact) {
        const actionImpact = document.createElement('div');
        actionImpact.className = 'action-impact';
        actionImpact.innerHTML = `<strong>Impact:</strong> ${action.impact}`;
        actionItem.appendChild(actionImpact);
      }
      
      actionPlanList.appendChild(actionItem);
    });
    
    actionPlanSection.appendChild(actionPlanList);
    wrapper.appendChild(actionPlanSection);
  }
  
  /**
   * Render financial impact section
   * @param {HTMLElement} wrapper - Wrapper element
   */
  renderFinancialImpactSection(wrapper) {
    // This is a simplified version used as fallback when ValuationDashboard is not available
    const financialSection = document.createElement('div');
    financialSection.className = 'assessment-results-ebit';
    financialSection.style.display = 'none'; // Hidden by default until calculated
    financialSection.innerHTML = `
      <h3>Financial Impact Analysis</h3>
      <div class="financial-impact-container">
        <div class="impact-item">
          <div class="impact-value" id="ebit-impact-value">-</div>
          <div class="impact-label">EBIT Improvement Potential</div>
        </div>
        <div class="impact-item">
          <div class="impact-value" id="valuation-impact-value">-</div>
          <div class="impact-label">Valuation Impact Potential</div>
        </div>
      </div>
      <div class="impact-note">
        <p>Based on your assessment scores and industry benchmarks. Results may vary based on implementation quality and market conditions.</p>
      </div>
    `;
    
    wrapper.appendChild(financialSection);
    
    // Try to initialize using ValuationDashboard data if available
    if (this.dashboardData && this.dashboardData.metrics) {
      const metrics = this.dashboardData.metrics;
      const ebitImpactEl = financialSection.querySelector('#ebit-impact-value');
      const valuationImpactEl = financialSection.querySelector('#valuation-impact-value');
      
      if (ebitImpactEl && metrics.ebitImprovement) {
        ebitImpactEl.textContent = `+${this.formatNumber(metrics.ebitImprovement)}%`;
      }
      
      if (valuationImpactEl && metrics.valuationMultipleImprovement) {
        valuationImpactEl.textContent = `+${metrics.valuationMultipleImprovement}x`;
      }
      
      // Show the section
      financialSection.style.display = 'block';
    }
  }
  
  /**
   * Get the name of the selected agency type
   * @returns {string} - Agency type name
   */
  getAgencyTypeName() {
    if (!this.state.selectedType || !this.config.agencyTypes) {
      return 'Agency';
    }
    
    const agencyType = this.config.agencyTypes.find(type => type.id === this.state.selectedType);
    return agencyType ? agencyType.name : 'Agency';
  }
}

// Register component in the global namespace
(function() {
  // Initialize namespace
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
  window.AssessmentFramework.Components.agency = window.AssessmentFramework.Components.agency || {};
  
  // Register component
  window.AssessmentFramework.Components.agency.ResultsRenderer = ResultsRenderer;
  
  console.log('[ResultsRenderer] Component registered successfully');
})();
