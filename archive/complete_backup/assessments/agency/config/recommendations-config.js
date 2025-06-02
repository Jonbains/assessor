/**
 * Agency Assessment - Recommendations Configuration
 *
 * This provides a stub for the recommendations configuration that was referenced in the HTML.
 * Replace this with actual configuration when available.
 */

// Define the configuration object for export
const RecommendationsConfig = {
  // Core recommendations for all agencies
  core: {
    financial: [
      {
        id: "fin_1",
        title: "Implement Financial Dashboard",
        description: "Create a real-time financial dashboard to track key metrics including utilization, project profitability, and cash flow.",
        importance: "high",
        timeline: "1-3 months",
        impact: "medium"
      },
      {
        id: "fin_2",
        title: "Review Pricing Strategy",
        description: "Conduct a comprehensive review of your pricing strategy to ensure services are priced competitively while maintaining healthy margins.",
        importance: "high",
        timeline: "1-2 months",
        impact: "high"
      }
    ],
    business: [
      {
        id: "bus_1",
        title: "Client Diversification Strategy",
        description: "Develop a strategic plan to diversify your client portfolio and reduce concentration risk.",
        importance: "high",
        timeline: "3-6 months",
        impact: "high"
      },
      {
        id: "bus_2",
        title: "Implement Account Growth Program",
        description: "Create a structured program to identify and capitalize on opportunities to expand services with existing clients.",
        importance: "medium",
        timeline: "2-4 months",
        impact: "medium"
      }
    ]
  },
  
  // Service-specific recommendations
  services: {
    digital_marketing: [
      {
        id: "dm_1",
        title: "Digital Marketing Service Expansion",
        description: "Expand your digital marketing service offering to include emerging channels and technologies.",
        importance: "medium",
        timeline: "3-6 months",
        impact: "medium"
      }
    ],
    creative_design: [
      {
        id: "cd_1",
        title: "Portfolio Enhancement",
        description: "Refresh your creative portfolio to showcase your best and most recent work.",
        importance: "medium",
        timeline: "1-2 months",
        impact: "medium"
      }
    ]
  },
  
  // Agency type specific recommendations
  agencyTypes: {
    digital: [
      {
        id: "dig_1",
        title: "Technology Stack Assessment",
        description: "Evaluate your current technology stack to identify opportunities for efficiency improvements.",
        importance: "medium",
        timeline: "2-3 months",
        impact: "medium"
      }
    ],
    creative: [
      {
        id: "cre_1",
        title: "Creative Team Structure Review",
        description: "Assess your creative team structure to ensure it supports efficient delivery and creative excellence.",
        importance: "medium",
        timeline: "1-2 months",
        impact: "medium"
      }
    ]
  }
};

// Export the configuration using ES6 module syntax
export { RecommendationsConfig };

console.log('[RecommendationsConfig] Config exported as ES6 module');
