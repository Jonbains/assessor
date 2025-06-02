/**
 * Agency Assessment - Questions Configuration
 *
 * This provides a stub for the questions configuration that was referenced in the HTML.
 * Replace this with actual configuration when available.
 */

// Define the configuration object for export
const AgencyQuestionsConfig = {
  steps: ['agency-type', 'services', 'questions', 'email', 'results'],
  // Agency types
  agencyTypes: [
    { id: "digital", name: "Digital Agency", description: "Focused on digital marketing services" },
    { id: "creative", name: "Creative Agency", description: "Focused on creative and design services" },
    { id: "integrated", name: "Integrated Agency", description: "Full-service marketing and communications" },
    { id: "specialty", name: "Specialty Agency", description: "Focused on a specific industry or service" }
  ],
  
  // Agency services
  services: [
    { id: "digital_marketing", name: "Digital Marketing", description: "Search, social, email marketing" },
    { id: "creative_design", name: "Creative & Design", description: "Brand design, creative assets" },
    { id: "content_production", name: "Content Production", description: "Content creation and management" },
    { id: "strategy_consulting", name: "Strategy & Consulting", description: "Strategic planning and consulting" }
  ],
  
  // Core questions
  questions: {
    core: [
      {
        id: "core_1",
        question: "How would you rate your agency's overall financial health?",
        dimension: "financial",
        options: [
          { text: "Very poor - Struggling to meet obligations", score: 1 },
          { text: "Poor - Facing significant challenges", score: 2 },
          { text: "Average - Meeting basic needs", score: 3 },
          { text: "Good - Stable and growing", score: 4 },
          { text: "Excellent - Thriving with strong margins", score: 5 }
        ]
      },
      {
        id: "core_2",
        question: "How diversified is your client portfolio?",
        dimension: "business",
        options: [
          { text: "Highly concentrated (1-2 clients make up >50% of revenue)", score: 1 },
          { text: "Somewhat concentrated (3-5 clients make up >50% of revenue)", score: 2 },
          { text: "Moderately diversified (Top 5 clients make up 30-50% of revenue)", score: 3 },
          { text: "Well diversified (Top 5 clients make up 20-30% of revenue)", score: 4 },
          { text: "Extremely diversified (No client represents >10% of revenue)", score: 5 }
        ]
      }
    ],
    
    // Service-specific questions (simplified for stub)
    serviceSpecific: {
      digital_marketing: [
        {
          id: "dm_1",
          question: "How mature is your digital marketing service offering?",
          dimension: "service",
          options: [
            { text: "Basic - Limited capabilities", score: 1 },
            { text: "Developing - Growing capabilities", score: 2 },
            { text: "Established - Solid capabilities", score: 3 },
            { text: "Advanced - Comprehensive capabilities", score: 4 },
            { text: "Industry-leading - Cutting-edge capabilities", score: 5 }
          ]
        }
      ],
      creative_design: [
        {
          id: "cd_1",
          question: "How would you rate your creative team's capabilities?",
          dimension: "service",
          options: [
            { text: "Basic - Limited capabilities", score: 1 },
            { text: "Developing - Growing capabilities", score: 2 },
            { text: "Established - Solid capabilities", score: 3 },
            { text: "Advanced - Comprehensive capabilities", score: 4 },
            { text: "Industry-leading - Award-winning capabilities", score: 5 }
          ]
        }
      ]
    }
  }
};

// Export the configuration using ES6 module syntax
export { AgencyQuestionsConfig };

console.log('[AgencyQuestionsConfig] Config exported as ES6 module');
