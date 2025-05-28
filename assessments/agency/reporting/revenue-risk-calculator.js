/**
 * Revenue Risk Calculator Component
 * 
 * Displays a visualization of revenue at risk based on service vulnerability scores.
 * Adapted to ES6 module format from the original implementation
 */

export class RevenueRiskCalculator {
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
      potentialLoss2026: potentialLoss2026
    };
  }
  
  /**
   * Format currency amount
   * @param {number} amount - Amount to format
   * @returns {string} Formatted currency string
   */
  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  /**
   * Format percentage value
   * @param {number} value - Percentage value
   * @returns {string} Formatted percentage string
   */
  formatPercentage(value) {
    return value.toFixed(1) + '%';
  }
  
  /**
   * Render the revenue risk calculator visualization
   */
  render() {
    // Create section container
    const sectionContainer = document.createElement('div');
    sectionContainer.className = 'revenue-risk-section';
    sectionContainer.style.marginBottom = '30px';
    
    // Create section header
    const sectionHeader = document.createElement('h2');
    sectionHeader.textContent = 'Revenue at Risk Analysis';
    sectionHeader.style.fontSize = '22px';
    sectionHeader.style.fontWeight = 'bold';
    sectionHeader.style.marginBottom = '15px';
    sectionHeader.style.color = '#ffff66'; // Yellow primary color
    sectionContainer.appendChild(sectionHeader);
    
    // Create calculator container
    const calculatorContainer = document.createElement('div');
    calculatorContainer.className = 'revenue-risk-calculator';
    calculatorContainer.style.display = 'flex';
    calculatorContainer.style.flexWrap = 'wrap';
    calculatorContainer.style.gap = '20px';
    
    // Create visualization container
    const visualizationContainer = document.createElement('div');
    visualizationContainer.className = 'revenue-risk-visualization';
    visualizationContainer.style.flex = '1';
    visualizationContainer.style.minWidth = '300px';
    visualizationContainer.style.backgroundColor = '#222';
    visualizationContainer.style.padding = '20px';
    visualizationContainer.style.borderRadius = '8px';
    calculatorContainer.appendChild(visualizationContainer);
    
    // Create gauge chart container
    const gaugeContainer = document.createElement('div');
    gaugeContainer.className = 'revenue-risk-gauge';
    gaugeContainer.style.marginBottom = '20px';
    gaugeContainer.style.textAlign = 'center';
    visualizationContainer.appendChild(gaugeContainer);
    
    // Create gauge visualization
    const gaugeValue = document.createElement('div');
    gaugeValue.className = 'gauge-value';
    gaugeValue.textContent = this.formatPercentage(this.riskData.totalAtRiskPercentage);
    gaugeValue.style.fontSize = '36px';
    gaugeValue.style.fontWeight = 'bold';
    gaugeValue.style.color = '#ffff66'; // Yellow primary color
    gaugeContainer.appendChild(gaugeValue);
    
    const gaugeLabel = document.createElement('div');
    gaugeLabel.textContent = 'OF REVENUE AT RISK';
    gaugeLabel.style.fontSize = '14px';
    gaugeLabel.style.color = '#ccc';
    gaugeLabel.style.marginTop = '5px';
    gaugeContainer.appendChild(gaugeLabel);
    
    // Create risk breakdown
    const breakdownContainer = document.createElement('div');
    breakdownContainer.className = 'revenue-risk-breakdown';
    visualizationContainer.appendChild(breakdownContainer);
    
    // High risk category
    if (this.riskData.categories.high.length > 0) {
      const highRiskHeader = document.createElement('h3');
      highRiskHeader.textContent = 'High Risk Services';
      highRiskHeader.style.fontSize = '16px';
      highRiskHeader.style.marginTop = '15px';
      highRiskHeader.style.marginBottom = '10px';
      breakdownContainer.appendChild(highRiskHeader);
      
      this.riskData.categories.high.forEach(service => {
        const serviceItem = this.createServiceItem(
          service.name,
          service.revenuePercentage,
          service.revenueAmount,
          'high'
        );
        breakdownContainer.appendChild(serviceItem);
      });
    }
    
    // Medium risk category
    if (this.riskData.categories.medium.length > 0) {
      const mediumRiskHeader = document.createElement('h3');
      mediumRiskHeader.textContent = 'Vulnerable Services';
      mediumRiskHeader.style.fontSize = '16px';
      mediumRiskHeader.style.marginTop = '15px';
      mediumRiskHeader.style.marginBottom = '10px';
      breakdownContainer.appendChild(mediumRiskHeader);
      
      this.riskData.categories.medium.forEach(service => {
        const serviceItem = this.createServiceItem(
          service.name,
          service.revenuePercentage,
          service.revenueAmount,
          'medium'
        );
        breakdownContainer.appendChild(serviceItem);
      });
    }
    
    // Low risk category
    if (this.riskData.categories.low.length > 0) {
      const lowRiskHeader = document.createElement('h3');
      lowRiskHeader.textContent = 'Protected Services';
      lowRiskHeader.style.fontSize = '16px';
      lowRiskHeader.style.marginTop = '15px';
      lowRiskHeader.style.marginBottom = '10px';
      breakdownContainer.appendChild(lowRiskHeader);
      
      this.riskData.categories.low.forEach(service => {
        const serviceItem = this.createServiceItem(
          service.name,
          service.revenuePercentage,
          service.revenueAmount,
          'low'
        );
        breakdownContainer.appendChild(serviceItem);
      });
    }
    
    // Create summary container
    const summaryContainer = document.createElement('div');
    summaryContainer.className = 'revenue-risk-summary';
    summaryContainer.style.flex = '1';
    summaryContainer.style.minWidth = '300px';
    summaryContainer.style.backgroundColor = '#222';
    summaryContainer.style.padding = '20px';
    summaryContainer.style.borderRadius = '8px';
    
    // Summary header
    const summaryHeader = document.createElement('h3');
    summaryHeader.textContent = 'Revenue Risk Summary';
    summaryHeader.style.fontSize = '18px';
    summaryHeader.style.marginBottom = '15px';
    summaryContainer.appendChild(summaryHeader);
    
    // Key findings
    const keyFindings = document.createElement('div');
    keyFindings.style.marginBottom = '20px';
    summaryContainer.appendChild(keyFindings);
    
    // Potential loss by 2026
    const potentialLoss = document.createElement('div');
    potentialLoss.style.marginBottom = '15px';
    potentialLoss.innerHTML = '<strong>Potential Revenue Loss by 2026:</strong> ' + 
      this.formatCurrency(this.riskData.potentialLoss2026);
    potentialLoss.style.fontSize = '16px';
    keyFindings.appendChild(potentialLoss);
    
    // Immediate risk
    const immediateRiskElem = document.createElement('div');
    immediateRiskElem.style.marginBottom = '10px';
    immediateRiskElem.innerHTML = '<strong>Immediate Risk:</strong> ' + 
      this.formatCurrency(this.riskData.immediateRisk) + 
      ' (' + this.formatPercentage(this.riskData.immediateRiskPercentage) + ' of revenue)';
    keyFindings.appendChild(immediateRiskElem);
    
    // Vulnerable revenue
    const vulnerableElem = document.createElement('div');
    vulnerableElem.style.marginBottom = '10px';
    vulnerableElem.innerHTML = '<strong>Vulnerable:</strong> ' + 
      this.formatCurrency(this.riskData.vulnerableRevenue) + 
      ' (' + this.formatPercentage(this.riskData.vulnerablePercentage) + ' of revenue)';
    keyFindings.appendChild(vulnerableElem);
    
    // Protected revenue
    const protectedElem = document.createElement('div');
    protectedElem.style.marginBottom = '20px';
    protectedElem.innerHTML = '<strong>Protected:</strong> ' + 
      this.formatCurrency(this.riskData.protectedRevenue) + 
      ' (' + this.formatPercentage(this.riskData.protectedPercentage) + ' of revenue)';
    keyFindings.appendChild(protectedElem);
    
    // Recommendations (summary)
    const recommendations = document.createElement('div');
    recommendations.style.marginBottom = '20px';
    recommendations.style.padding = '15px';
    recommendations.style.backgroundColor = '#333';
    recommendations.style.borderRadius = '4px';
    
    recommendations.innerHTML = '<strong>Recommended Action:</strong> ' + 
      'Develop a revenue protection plan focused on services with high vulnerability scores. ' + 
      'Consider diversifying your service mix and accelerating AI adoption in high-risk service areas.';
    
    summaryContainer.appendChild(recommendations);
    
    // CTA button
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

// Export default for compatibility with existing code
export default RevenueRiskCalculator;
