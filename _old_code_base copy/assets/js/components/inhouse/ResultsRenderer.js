/**
 * Results Renderer Component for Inhouse Assessment
 * 
 * Displays assessment results including scores, recommendations, and visualizations.
 * Tailored for inhouse teams with appropriate terminology and visualizations.
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
    
    // Bind methods
    this.downloadResults = this.downloadResults.bind(this);
    this.initializeCharts = this.initializeCharts.bind(this);
  }
  
  /**
   * Download results as JSON
   */
  downloadResults() {
    if (!this.state.results) return;
    
    try {
      // Create JSON data
      const resultsData = {
        assessmentType: 'inhouse',
        timestamp: new Date().toISOString(),
        departmentType: this.state.selectedType,
        areas: this.state.selectedServices,
        scores: this.state.results.scores,
        recommendations: this.state.results.recommendations
      };
      
      // Create blob and download link
      const dataStr = JSON.stringify(resultsData, null, 2);
      const blob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = 'inhouse-assessment-results.json';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('[ResultsRenderer] Error downloading results:', error);
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
      const areasCanvas = this.container.querySelector('#areasChart');
      
      if (!radarCanvas || !areasCanvas) {
        console.warn('[ResultsRenderer] Chart canvas elements not found');
        return;
      }
      
      // Initialize charts
      this.initializeRadarChart(radarCanvas);
      this.initializeAreasChart(areasCanvas);
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
        'AI Readiness',
        'Strategic Positioning'
      ],
      datasets: [{
        label: 'Your Scores',
        data: [
          scores.operational,
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
            title: (items) => items[0].label,
            label: (item) => `Score: ${item.raw}/100`
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
   * Initialize areas chart for area-specific scores
   * @param {HTMLCanvasElement} canvas - Canvas element
   */
  initializeAreasChart(canvas) {
    const areaScores = this.state.results.areaScores || {};
    const areasList = Object.keys(areaScores);
    
    if (areasList.length === 0) {
      console.warn('[ResultsRenderer] No area scores available for chart');
      return;
    }
    
    // Get area names
    const areaNames = areasList.map(areaId => {
      const area = this.config.areas.find(a => a.id === areaId);
      return area ? area.name : areaId;
    });
    
    // Prepare data
    const areasData = {
      labels: areaNames,
      datasets: [{
        label: 'AI Readiness',
        data: areasList.map(areaId => areaScores[areaId] || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }]
    };
    
    // Chart options
    const areasOptions = {
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
          title: {
            display: true,
            text: 'AI Readiness Score'
          }
        }
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: (item) => `AI Readiness: ${item.raw}%`
          }
        }
      }
    };
    
    // Create chart
    if (window.areasChartInstance) {
      window.areasChartInstance.destroy();
    }
    
    window.areasChartInstance = new Chart(canvas, {
      type: 'bar',
      data: areasData,
      options: areasOptions
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
    if (!this.state.results) {
      console.error('[ResultsRenderer] No results available to render');
      this.renderError();
      return;
    }
    
    // Clear container
    this.container.innerHTML = '';
    
    // Create results wrapper
    const resultsWrapper = document.createElement('div');
    resultsWrapper.className = 'assessment-results-wrapper';
    
    // Create header section
    this.renderHeader(resultsWrapper);
    
    // Create scores section
    this.renderScoresSection(resultsWrapper);
    
    // Create charts section
    this.renderChartsSection(resultsWrapper);
    
    // Create recommendations section
    this.renderRecommendationsSection(resultsWrapper);
    
    // Create next steps section
    this.renderNextStepsSection(resultsWrapper);
    
    // Add to container
    this.container.appendChild(resultsWrapper);
    
    // Initialize charts after rendering
    setTimeout(() => {
      this.initializeCharts();
    }, 100);
  }
  
  /**
   * Render error message
   */
  renderError() {
    this.container.innerHTML = `
      <div class="assessment-error">
        <h2>Error Loading Results</h2>
        <p>There was a problem generating your assessment results. Please try again or contact support.</p>
        <button class="restart-button">Restart Assessment</button>
      </div>
    `;
    
    // Add restart handler
    const restartButton = this.container.querySelector('.restart-button');
    if (restartButton) {
      restartButton.addEventListener('click', () => {
        this.eventBus.emit('navigation:reset');
      });
    }
  }
  
  /**
   * Render header section
   * @param {HTMLElement} wrapper - Wrapper element
   */
  renderHeader(wrapper) {
    const header = document.createElement('div');
    header.className = 'assessment-results-header';
    header.innerHTML = `
      <h2>Your Team's AI Readiness Assessment Results</h2>
      <div class="assessment-results-overview">
        <div class="overall-score-container">
          <div class="overall-score">${this.state.results.scores.overall}</div>
          <div class="overall-score-label">Overall Score</div>
        </div>
        <div class="assessment-details">
          <div class="assessment-category">${this.state.results.category || 'AI Readiness Assessment'}</div>
          <div class="department-type">${this.getDepartmentName()}</div>
        </div>
      </div>
      <div class="download-results">
        <button class="download-button">Download Results</button>
      </div>
    `;
    
    wrapper.appendChild(header);
    
    // Add download handler
    const downloadButton = header.querySelector('.download-button');
    if (downloadButton) {
      downloadButton.addEventListener('click', this.downloadResults);
    }
  }
  
  /**
   * Render scores section
   * @param {HTMLElement} wrapper - Wrapper element
   */
  renderScoresSection(wrapper) {
    const scores = this.state.results.scores;
    
    const scoresSection = document.createElement('div');
    scoresSection.className = 'assessment-results-scores';
    scoresSection.innerHTML = `
      <h3>Dimension Scores</h3>
      <div class="dimension-scores-container">
        <div class="dimension-score">
          <div class="dimension-score-value">${scores.operational}</div>
          <div class="dimension-score-label">Operational Maturity</div>
        </div>
        <div class="dimension-score">
          <div class="dimension-score-value">${scores.ai}</div>
          <div class="dimension-score-label">AI Readiness</div>
        </div>
        <div class="dimension-score">
          <div class="dimension-score-value">${scores.strategic}</div>
          <div class="dimension-score-label">Strategic Positioning</div>
        </div>
      </div>
    `;
    
    wrapper.appendChild(scoresSection);
  }
  
  /**
   * Render charts section
   * @param {HTMLElement} wrapper - Wrapper element
   */
  renderChartsSection(wrapper) {
    const chartsSection = document.createElement('div');
    chartsSection.className = 'assessment-results-charts';
    chartsSection.innerHTML = `
      <div class="charts-container">
        <div class="chart-box">
          <h3>Dimension Analysis</h3>
          <div class="chart-container radar-chart-container">
            <canvas id="radarChart"></canvas>
          </div>
        </div>
        <div class="chart-box">
          <h3>Functional Areas Analysis</h3>
          <div class="chart-container areas-chart-container">
            <canvas id="areasChart"></canvas>
          </div>
        </div>
      </div>
    `;
    
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
    recommendations.forEach((recommendation, index) => {
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
   * Render next steps section
   * @param {HTMLElement} wrapper - Wrapper element
   */
  renderNextStepsSection(wrapper) {
    // Get insights based on score level
    const insightsKey = this.getScoreLevel();
    const insights = this.config.resultsConfig?.insights?.[insightsKey] || [];
    
    if (insights.length === 0) {
      return;
    }
    
    const nextStepsSection = document.createElement('div');
    nextStepsSection.className = 'assessment-results-next-steps';
    
    // Create header
    const header = document.createElement('h3');
    header.textContent = 'Next Steps';
    nextStepsSection.appendChild(header);
    
    // Create insights list
    const insightsList = document.createElement('ul');
    insightsList.className = 'insights-list';
    
    // Add insights
    insights.forEach((insight) => {
      const insightItem = document.createElement('li');
      insightItem.textContent = insight;
      insightsList.appendChild(insightItem);
    });
    
    nextStepsSection.appendChild(insightsList);
    
    // Add action button
    const actionButton = document.createElement('button');
    actionButton.className = 'create-roadmap-button';
    actionButton.textContent = 'Create AI Implementation Roadmap';
    actionButton.addEventListener('click', () => {
      alert('AI Implementation Roadmap feature coming soon!');
    });
    
    nextStepsSection.appendChild(actionButton);
    wrapper.appendChild(nextStepsSection);
  }
  
  /**
   * Get the name of the selected department
   * @returns {string} - Department name
   */
  getDepartmentName() {
    if (!this.state.selectedType || !this.config.departments) {
      return 'Team';
    }
    
    const department = this.config.departments.find(type => type.id === this.state.selectedType);
    return department ? department.name : 'Team';
  }
  
  /**
   * Get score level (low, mid, high) based on overall score
   * @returns {string} - Score level key
   */
  getScoreLevel() {
    const overallScore = this.state.results.scores.overall;
    
    if (overallScore < 40) {
      return 'lowScore';
    } else if (overallScore < 70) {
      return 'midScore';
    } else {
      return 'highScore';
    }
  }
}

// Register component in the global namespace
(function() {
  // Initialize namespace
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
  window.AssessmentFramework.Components.inhouse = window.AssessmentFramework.Components.inhouse || {};
  
  // Register component
  window.AssessmentFramework.Components.inhouse.ResultsRenderer = ResultsRenderer;
  
  console.log('[ResultsRenderer] Component registered successfully');
})();
