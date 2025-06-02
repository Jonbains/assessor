/**
 * Revenue Risk Calculator Component
 * 
 * Displays a visualization of revenue at risk based on service vulnerability scores.
 */

class RevenueRiskCalculator {
  /**
   * @param {HTMLElement} container - Container element
   * @param {Array} services - Array of service objects
   * @param {Object} serviceScores - Service vulnerability scores
   * @param {Object} serviceRevenue - Revenue percentage by service
   * @param {number} totalRevenue - Total annual revenue (default: $3,000,000)
   */
  constructor(container, services, serviceScores, serviceRevenue, totalRevenue) {
    this.container = container;
    this.services = services || [];
    this.serviceScores = serviceScores || {};
    this.serviceRevenue = serviceRevenue || {};
    this.totalRevenue = totalRevenue || 3000000; // Default $3M if not specified
    
    // Check if we have the necessary data
    const hasRequiredData = 
      this.services.length > 0 && 
      Object.keys(this.serviceScores).length > 0 && 
      Object.keys(this.serviceRevenue).length > 0;
    
    if (!hasRequiredData) {
      console.warn('[RevenueRiskCalculator] Missing required data for calculations');
    }
    
    // Calculate revenue at risk
    this.riskData = this.calculateRevenueAtRisk();
    
    // Render the component
    this.render();
  }
  
  /**
   * Calculate revenue at risk based on service scores and revenue allocation
   * @returns {Object} Risk data categorized by risk level
   */
  calculateRevenueAtRisk() {
    // Initialize risk categories
    const riskCategories = {
      high: [],    // Red - immediate risk (vulnerability > 70)
      medium: [],  // Yellow - vulnerable (vulnerability 40-70)
      low: []      // Green - protected (vulnerability < 40)
    };
    
    // Track financial impact
    let totalAtRisk = 0;
    let immediateRisk = 0;
    let vulnerableRevenue = 0;
    let protectedRevenue = 0;
    
    // Process each service
    this.services.forEach(service => {
      // Get service ID and name
      const serviceId = typeof service === 'object' ? service.id : service;
      const serviceName = typeof service === 'object' ? service.name : service;
      
      // Get vulnerability score and revenue percentage
      const vulnerability = this.serviceScores[serviceId] ? 
        (this.serviceScores[serviceId].vulnerability || 50) : 50;
      
      const revenuePercentage = this.serviceRevenue[serviceId] || 0;
      const revenueAmount = (revenuePercentage / 100) * this.totalRevenue;
      
      // Calculate risk amount based on vulnerability score
      const riskAmount = (vulnerability / 100) * revenueAmount;
      
      // Categorize based on vulnerability score
      const serviceData = {
        id: serviceId,
        name: serviceName,
        vulnerability: vulnerability,
        revenuePercentage: revenuePercentage,
        revenueAmount: revenueAmount,
        riskAmount: riskAmount
      };
      
      // Add to appropriate category
      if (vulnerability > 70) {
        riskCategories.high.push(serviceData);
        immediateRisk += revenueAmount;
      } else if (vulnerability > 40) {
        riskCategories.medium.push(serviceData);
        vulnerableRevenue += revenueAmount;
      } else {
        riskCategories.low.push(serviceData);
        protectedRevenue += revenueAmount;
      }
      
      // Add to total at risk (weighted by vulnerability)
      totalAtRisk += riskAmount;
    });
    
    // Calculate percentages
    const atRiskPercentage = (totalAtRisk / this.totalRevenue) * 100;
    const immediateRiskPercentage = (immediateRisk / this.totalRevenue) * 100;
    const vulnerablePercentage = (vulnerableRevenue / this.totalRevenue) * 100;
    const protectedPercentage = (protectedRevenue / this.totalRevenue) * 100;
    
    // Calculate potential loss by 2026 (2 years from now)
    const potentialLoss2026 = immediateRisk * 0.75 + vulnerableRevenue * 0.3;
    
    return {
      categories: riskCategories,
      totalAtRisk: totalAtRisk,
      totalAtRiskPercentage: atRiskPercentage,
      immediateRisk: immediateRisk,
      immediateRiskPercentage: immediateRiskPercentage,
      vulnerableRevenue: vulnerableRevenue,
      vulnerablePercentage: vulnerablePercentage,
      protectedRevenue: protectedRevenue,
      protectedPercentage: protectedPercentage,
      potentialLoss2026: potentialLoss2026,
      potentialLossPercentage: (potentialLoss2026 / this.totalRevenue) * 100
    };
  }
  
  /**
   * Format currency amount
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount) {
    return '$' + amount.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    });
  }
  
  /**
   * Format percentage value
   * @param {number} value - Percentage value
   * @returns {string} Formatted percentage string
   */
  formatPercentage(value) {
    return Math.round(value) + '%';
  }
  
  /**
   * Render the revenue risk calculator visualization
   */
  render() {
    // Create section container
    const sectionContainer = document.createElement('div');
    sectionContainer.className = 'revenue-risk-section';
    sectionContainer.style.marginBottom = '40px';
    
    // Add section title
    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'section-title';
    sectionTitle.textContent = 'REVENUE IMPACT ANALYSIS';
    sectionContainer.appendChild(sectionTitle);
    
    // Create calculator container
    const calculatorContainer = document.createElement('div');
    calculatorContainer.className = 'revenue-risk-calculator';
    calculatorContainer.style.backgroundColor = '#f9f9f9';
    calculatorContainer.style.borderRadius = '8px';
    calculatorContainer.style.padding = '20px';
    calculatorContainer.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    
    // Add introduction text
    const introText = document.createElement('p');
    introText.className = 'revenue-risk-intro';
    introText.textContent = 'Your Current Service Mix:';
    introText.style.fontWeight = 'bold';
    introText.style.marginBottom = '15px';
    calculatorContainer.appendChild(introText);
    
    // Create service list container
    const serviceList = document.createElement('div');
    serviceList.className = 'revenue-service-list';
    serviceList.style.marginBottom = '25px';
    
    // Add high risk services
    this.riskData.categories.high.forEach(service => {
      const serviceItem = this.createServiceItem(
        service.name, 
        service.revenuePercentage,
        service.revenueAmount,
        'high'
      );
      serviceList.appendChild(serviceItem);
    });
    
    // Add medium risk services
    this.riskData.categories.medium.forEach(service => {
      const serviceItem = this.createServiceItem(
        service.name, 
        service.revenuePercentage,
        service.revenueAmount,
        'medium'
      );
      serviceList.appendChild(serviceItem);
    });
    
    // Add low risk services
    this.riskData.categories.low.forEach(service => {
      const serviceItem = this.createServiceItem(
        service.name, 
        service.revenuePercentage,
        service.revenueAmount,
        'low'
      );
      serviceList.appendChild(serviceItem);
    });
    
    calculatorContainer.appendChild(serviceList);
    
    // Add summary stats
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'revenue-risk-summary';
    summaryContainer.style.borderTop = '1px solid #e0e0e0';
    summaryContainer.style.paddingTop = '15px';
    
    // Total revenue at risk
    const totalRiskItem = document.createElement('div');
    totalRiskItem.className = 'revenue-summary-item';
    totalRiskItem.style.marginBottom = '10px';
    totalRiskItem.innerHTML = `<strong>Total Annual Revenue at Risk:</strong> ${this.formatCurrency(this.riskData.totalAtRisk)} (${this.formatPercentage(this.riskData.totalAtRiskPercentage)})`;
    summaryContainer.appendChild(totalRiskItem);
    
    // Potential loss by 2026
    const potentialLossItem = document.createElement('div');
    potentialLossItem.className = 'revenue-summary-item';
    potentialLossItem.style.marginBottom = '20px';
    potentialLossItem.innerHTML = `<strong>Potential Revenue Loss by 2026:</strong> ${this.formatCurrency(this.riskData.potentialLoss2026)}`;
    summaryContainer.appendChild(potentialLossItem);
    
    // Add call to action button
    const ctaButton = document.createElement('button');
    ctaButton.className = 'revenue-risk-cta';
    ctaButton.textContent = 'Calculate My Protection Plan →';
    ctaButton.style.backgroundColor = '#1976d2';
    ctaButton.style.color = '#fff';
    ctaButton.style.border = 'none';
    ctaButton.style.borderRadius = '4px';
    ctaButton.style.padding = '10px 15px';
    ctaButton.style.fontWeight = 'bold';
    ctaButton.style.cursor = 'pointer';
    ctaButton.style.width = '100%';
    
    // Add button event listener
    ctaButton.addEventListener('click', () => {
      // Scroll to recommendations section or trigger download
      const recommendationsSection = document.querySelector('.recommendations-section');
      if (recommendationsSection) {
        recommendationsSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
    
    summaryContainer.appendChild(ctaButton);
    calculatorContainer.appendChild(summaryContainer);
    
    // Add calculator to section container
    sectionContainer.appendChild(calculatorContainer);
    
    // Add the section to the main container
    this.container.appendChild(sectionContainer);
  }
  
  /**
   * Create a service item for the list
   * @param {string} name - Service name
   * @param {number} percentage - Revenue percentage
   * @param {number} amount - Revenue amount
   * @param {string} riskLevel - Risk level (high, medium, low)
   * @returns {HTMLElement} Service item element
   */
  createServiceItem(name, percentage, amount, riskLevel) {
    const serviceItem = document.createElement('div');
    serviceItem.className = 'revenue-service-item';
    serviceItem.style.display = 'flex';
    serviceItem.style.justifyContent = 'space-between';
    serviceItem.style.alignItems = 'center';
    serviceItem.style.marginBottom = '10px';
    
    // Service name and percentage
    const serviceInfo = document.createElement('div');
    serviceInfo.style.flex = '1';
    serviceInfo.innerHTML = `${name} (${percentage}% of revenue)`;
    serviceItem.appendChild(serviceInfo);
    
    // Risk indicator
    const riskIndicator = document.createElement('div');
    riskIndicator.className = `risk-indicator ${riskLevel}-risk`;
    riskIndicator.style.borderRadius = '50%';
    riskIndicator.style.width = '12px';
    riskIndicator.style.height = '12px';
    riskIndicator.style.display = 'inline-block';
    riskIndicator.style.marginRight = '8px';
    
    // Set color based on risk level
    if (riskLevel === 'high') {
      riskIndicator.style.backgroundColor = '#f44336'; // Red
    } else if (riskLevel === 'medium') {
      riskIndicator.style.backgroundColor = '#ffc107'; // Yellow
    } else {
      riskIndicator.style.backgroundColor = '#4caf50'; // Green
    }
    
    // Revenue amount
    const revenueAmount = document.createElement('div');
    revenueAmount.style.fontWeight = 'bold';
    revenueAmount.style.display = 'flex';
    revenueAmount.style.alignItems = 'center';
    
    revenueAmount.appendChild(riskIndicator);
    revenueAmount.appendChild(document.createTextNode(this.formatCurrency(amount) + ' ' + this.getRiskLabel(riskLevel)));
    
    serviceItem.appendChild(revenueAmount);
    
    return serviceItem;
  }
  
  /**
   * Get risk label text
   * @param {string} riskLevel - Risk level
   * @returns {string} Risk label text
   */
  getRiskLabel(riskLevel) {
    switch (riskLevel) {
      case 'high':
        return 'at risk';
      case 'medium':
        return 'vulnerable';
      case 'low':
        return 'protected';
      default:
        return '';
    }
  }
}

// Register component in the global namespace
(function() {
  // Initialize namespace
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
  window.AssessmentFramework.Components.Results = window.AssessmentFramework.Components.Results || {};
  
  // Register component
  window.AssessmentFramework.Components.Results.RevenueRiskCalculator = RevenueRiskCalculator;
  
  console.log('[RevenueRiskCalculator] Component registered successfully');
})();
