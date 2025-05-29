/**
 * Agency Assessment - Valuation Configuration
 *
 * This provides a stub for the valuation configuration that was referenced in the HTML.
 * Replace this with actual configuration when available.
 */

// Create a global configuration object
window.AgencyValuationConfig = {
  // Base valuation multiples by agency type
  baseMultiples: {
    digital: 8,
    creative: 7,
    integrated: 7.5,
    specialty: 8.5
  },
  
  // Adjustment factors
  adjustmentFactors: {
    // Client diversification impact
    clientDiversification: {
      high: 1.2,    // No client > 10% of revenue
      medium: 1.0,  // No client > 20% of revenue
      low: 0.8      // Has clients > 20% of revenue
    },
    
    // Revenue growth impact
    revenueGrowth: {
      high: 1.2,    // >20% annual growth
      medium: 1.0,  // 10-20% annual growth
      low: 0.8      // <10% annual growth
    },
    
    // Profit margin impact
    profitMargin: {
      high: 1.3,    // >20% EBITDA margin
      medium: 1.0,  // 10-20% EBITDA margin
      low: 0.7      // <10% EBITDA margin
    },
    
    // Service mix impact
    serviceMix: {
      strategic: 1.2,       // Strategy, consulting
      creative: 1.0,        // Creative, design
      production: 0.9,      // Production, execution
      commoditized: 0.8     // Commoditized services
    }
  },
  
  // Valuation formulas
  formulas: {
    // Basic EBITDA multiple
    basicMultiple: "baseMultiple * clientDiversificationFactor * revenueGrowthFactor * profitMarginFactor",
    
    // Adjusted EBITDA
    adjustedEBITDA: "reportedEBITDA * adjustmentFactor",
    
    // Enterprise value
    enterpriseValue: "adjustedEBITDA * finalMultiple"
  },
  
  // Impact scoring
  impactScoring: {
    financial: 0.4,    // 40% weight for financial factors
    business: 0.3,     // 30% weight for business factors
    service: 0.2,      // 20% weight for service factors
    market: 0.1        // 10% weight for market factors
  }
};
