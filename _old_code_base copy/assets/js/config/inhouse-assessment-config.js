/**
 * Inhouse Assessment Configuration
 * 
 * Comprehensive configuration for the inhouse assessment module of the framework.
 * Structured to match the modular assessment framework requirements.
 */

const InhouseAssessmentConfig = {
  id: "inhouse-assessment",
  title: "In-house Team AI Readiness Assessment",
  description: "This assessment tool evaluates how ready your in-house marketing team is for AI, measuring your operational maturity, strategic readiness, and AI capabilities.",
  assessmentType: "inhouse",
  resultEmail: "assessment@obsolete.com",
  
  // Recommendations configuration
  recommendationsConfig: {
    enabled: true,
    externalFile: 'inhouse-recommendations-config.js',
    useServiceSpecific: true,
    useGeneralRecommendations: true,
    scoringThresholds: {
      low: { min: 0, max: 40 },
      mid: { min: 40, max: 70 },
      high: { min: 70, max: 100 }
    }
  },
  
  // Assessment flow steps
  steps: ["department", "areas", "questions", "email", "results"],
  
  // Available department types
  departments: [
    { id: "marketing", name: "Marketing Department", description: "Focused on brand management, campaigns, and demand generation" },
    { id: "creative", name: "Creative Department", description: "Focused on design, production, and content creation" },
    { id: "digital", name: "Digital Marketing Team", description: "Focused on digital channels, social media, and web presence" },
    { id: "product", name: "Product Marketing", description: "Focused on product positioning, messaging, and go-to-market" },
    { id: "integrated", name: "Integrated Marketing Team", description: "Combines multiple marketing functions in one team" }
  ],
  
  // Default area selections by department
  defaultAreas: {
    "marketing": ["campaigns", "branding", "strategy"],
    "creative": ["content", "design", "production"],
    "digital": ["social", "web", "email", "analytics"],
    "product": ["content", "strategy", "campaigns"],
    "integrated": ["campaigns", "content", "social", "branding"]
  },
  
  // Available functional areas with metadata
  areas: [
    { 
      name: "Content Creation", 
      id: "content", 
      category: "Creative",
      aiImpact: "Very High",
      transformationTimeline: "2024-2025",
      recommendationsAvailable: true
    },
    { 
      name: "Design & Visual", 
      id: "design", 
      category: "Creative",
      aiImpact: "High",
      transformationTimeline: "2024-2026",
      recommendationsAvailable: true
    },
    { 
      name: "Campaign Management", 
      id: "campaigns", 
      category: "Strategic",
      aiImpact: "High",
      transformationTimeline: "2024-2026",
      recommendationsAvailable: true
    },
    { 
      name: "Social Media", 
      id: "social", 
      category: "Digital",
      aiImpact: "Very High",
      transformationTimeline: "Already happening",
      recommendationsAvailable: true
    },
    { 
      name: "Brand Management", 
      id: "branding", 
      category: "Strategic",
      aiImpact: "Moderate",
      transformationTimeline: "2025-2027",
      recommendationsAvailable: true
    },
    { 
      name: "Analytics & Reporting", 
      id: "analytics", 
      category: "Data",
      aiImpact: "Very High",
      transformationTimeline: "2024-2025",
      recommendationsAvailable: true
    },
    { 
      name: "Web Management", 
      id: "web", 
      category: "Digital",
      aiImpact: "High",
      transformationTimeline: "2024-2026",
      recommendationsAvailable: true
    },
    { 
      name: "Email Marketing", 
      id: "email", 
      category: "Digital",
      aiImpact: "High",
      transformationTimeline: "2024-2025",
      recommendationsAvailable: true
    },
    { 
      name: "Marketing Strategy", 
      id: "strategy", 
      category: "Strategic",
      aiImpact: "Moderate",
      transformationTimeline: "2025-2027",
      recommendationsAvailable: true
    },
    { 
      name: "Production", 
      id: "production", 
      category: "Creative",
      aiImpact: "High",
      transformationTimeline: "2024-2026",
      recommendationsAvailable: true
    }
  ],
  
  // Questions framework - using the existing inhouse questions.js content
  questions: {
    // Core questions asked to all users
    core: [
      // Operational Maturity Questions
      {
        id: 1,
        dimension: "operational",
        title: "Operational Maturity",
        question: "How would you describe your team's process documentation?",
        weight: 2,
        options: [
          { text: "Minimal or non-existent documentation", score: 0 },
          { text: "Some key processes are documented", score: 1 },
          { text: "Most processes have basic documentation", score: 2 },
          { text: "Comprehensive documentation for all processes", score: 4 },
          { text: "Well-maintained, regularly updated documentation with clear ownership", score: 5 }
        ]
      },
      {
        id: 2,
        dimension: "operational",
        question: "How frequently does your team review and update its processes?",
        weight: 2,
        options: [
          { text: "Rarely or never", score: 0 },
          { text: "Only when major problems occur", score: 1 },
          { text: "Annually", score: 2 },
          { text: "Quarterly", score: 4 },
          { text: "Continuously through formal improvement processes", score: 5 }
        ]
      },
      {
        id: 3,
        dimension: "operational",
        question: "How would you rate your team's ability to handle unexpected changes in priorities or workload?",
        weight: 3,
        options: [
          { text: "We struggle significantly with changes", score: 0 },
          { text: "We adapt but with considerable stress", score: 1 },
          { text: "We manage adequately with some disruption", score: 2 },
          { text: "We adapt relatively smoothly", score: 4 },
          { text: "We have systems designed for agility and rapid adaptation", score: 5 }
        ]
      },
      // AI Readiness Questions
      {
        id: 10,
        dimension: "ai",
        title: "AI Readiness",
        question: "What best describes your team's current use of AI tools?",
        weight: 3,
        options: [
          { text: "We don't use any AI tools", score: 0 },
          { text: "A few team members experiment with basic AI tools", score: 1 },
          { text: "We use some AI tools but not systematically", score: 2 },
          { text: "We have integrated AI tools into several workflows", score: 4 },
          { text: "AI tools are central to our operations with formal governance", score: 5 }
        ]
      },
      {
        id: 11,
        dimension: "ai",
        question: "How would you describe your team's AI skills and knowledge?",
        weight: 3,
        options: [
          { text: "Very limited understanding of AI", score: 0 },
          { text: "Basic awareness but little practical knowledge", score: 1 },
          { text: "Some team members have good AI knowledge", score: 2 },
          { text: "Most team members can effectively use AI tools", score: 4 },
          { text: "Deep expertise including prompt engineering and AI integration", score: 5 }
        ]
      },
      {
        id: 12,
        dimension: "ai",
        question: "How does your organization handle data for AI implementation?",
        weight: 3,
        options: [
          { text: "Our data is disorganized and difficult to access", score: 0 },
          { text: "We have basic data storage but limited organization", score: 1 },
          { text: "Our data is reasonably organized but siloed", score: 2 },
          { text: "We have well-structured data with good accessibility", score: 4 },
          { text: "Comprehensive data infrastructure designed for AI applications", score: 5 }
        ]
      },
      // Strategic Positioning Questions
      {
        id: 20,
        dimension: "strategic",
        title: "Strategic Positioning",
        question: "Does your team have a clear AI transformation strategy?",
        weight: 3,
        options: [
          { text: "No AI strategy exists", score: 0 },
          { text: "Informal discussions but no concrete plans", score: 1 },
          { text: "Basic strategy exists but limited implementation", score: 2 },
          { text: "Comprehensive strategy with implementation timeline", score: 4 },
          { text: "Fully integrated AI strategy with KPIs and executive support", score: 5 }
        ]
      },
      {
        id: 21,
        dimension: "strategic",
        question: "How would you describe leadership support for AI adoption?",
        weight: 3,
        options: [
          { text: "Little to no support from leadership", score: 0 },
          { text: "Verbal support but limited resources allocated", score: 1 },
          { text: "Moderate support with some resource allocation", score: 2 },
          { text: "Strong support with dedicated resources", score: 4 },
          { text: "Full commitment with substantial investment and advocacy", score: 5 }
        ]
      }
    ],
    
    // Area-specific questions
    areaSpecific: {
      "content": [
        {
          id: 101,
          dimension: "ai",
          question: "Which AI content creation tools does your team currently use?",
          weight: 2,
          options: [
            { text: "We don't use any AI content tools", score: 0 },
            { text: "Basic tools like grammar checkers only", score: 1 },
            { text: "Simple AI writing assistants occasionally", score: 2 },
            { text: "Regular use of several AI content platforms", score: 4 },
            { text: "Advanced AI content creation integrated into workflow", score: 5 }
          ]
        },
        {
          id: 102,
          dimension: "operational",
          question: "How has your content creation process evolved with AI?",
          weight: 2,
          options: [
            { text: "No changes to our traditional process", score: 0 },
            { text: "Minor adjustments to include basic AI tools", score: 1 },
            { text: "Moderate process changes to accommodate AI", score: 2 },
            { text: "Significant redesign incorporating AI efficiencies", score: 4 },
            { text: "Complete transformation based around AI capabilities", score: 5 }
          ]
        }
      ],
      "design": [
        {
          id: 201,
          dimension: "ai",
          question: "How is your team using AI for visual design work?",
          weight: 2,
          options: [
            { text: "Not using AI for design", score: 0 },
            { text: "Experimenting with basic image generation", score: 1 },
            { text: "Using AI for simple design elements", score: 2 },
            { text: "Regularly using AI for multiple design tasks", score: 4 },
            { text: "AI is central to our design workflow", score: 5 }
          ]
        }
      ],
      "campaigns": [
        {
          id: 301,
          dimension: "ai",
          question: "How does your team use AI for campaign optimization?",
          weight: 2,
          options: [
            { text: "No AI use in campaign management", score: 0 },
            { text: "Basic A/B testing with minimal AI", score: 1 },
            { text: "Some automated optimization tools", score: 2 },
            { text: "AI-driven campaign adjustments across channels", score: 4 },
            { text: "Fully autonomous campaign optimization", score: 5 }
          ]
        }
      ]
    },
    
    // Department-specific questions
    departmentSpecific: {
      "marketing": [
        {
          id: 401,
          dimension: "strategic",
          question: "How are you measuring the impact of AI on marketing performance?",
          weight: 2,
          options: [
            { text: "No measurement of AI impact", score: 0 },
            { text: "Anecdotal observations only", score: 1 },
            { text: "Basic before/after comparisons", score: 2 },
            { text: "Defined metrics for AI contribution", score: 4 },
            { text: "Comprehensive AI ROI framework", score: 5 }
          ]
        }
      ],
      "creative": [
        {
          id: 501,
          dimension: "ai",
          question: "How has AI affected your creative team's composition?",
          weight: 2,
          options: [
            { text: "No changes to team structure", score: 0 },
            { text: "Minor role adjustments", score: 1 },
            { text: "Some new AI-focused roles", score: 2 },
            { text: "Significant role evolution", score: 4 },
            { text: "Complete redesign of team around AI capabilities", score: 5 }
          ]
        }
      ]
    }
  },
  
  // Results display configuration
  resultsConfig: {
    displayOptions: {
      showOverallScore: true,
      showDimensionScores: true,
      showAreaScores: true,
      showAreaRecommendations: true,
      showTransformationGuidance: true
    },
    
    insights: {
      lowScore: [
        "Your team has significant opportunities to improve AI readiness",
        "Focus on building foundational AI knowledge and skills",
        "Start with simple AI tools that provide immediate efficiency gains"
      ],
      midScore: [
        "Your team has made good initial progress with AI adoption",
        "Focus on systematizing your AI implementation",
        "Develop more comprehensive AI training for all team members"
      ],
      highScore: [
        "Your team demonstrates advanced AI readiness",
        "Focus on pushing boundaries with cutting-edge AI applications",
        "Consider developing your own custom AI solutions"
      ]
    }
  }
};

// Export to global namespace for framework compatibility
window.InhouseAssessmentConfig = InhouseAssessmentConfig;

// Also expose in the new modular namespace structure
window.AssessmentFramework = window.AssessmentFramework || {};
window.AssessmentFramework.Config = window.AssessmentFramework.Config || {};
window.AssessmentFramework.Config.Inhouse = InhouseAssessmentConfig;
