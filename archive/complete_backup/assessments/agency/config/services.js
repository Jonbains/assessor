/**
 * Assessment Framework - Agency Services Configuration
 * 
 * Directly extracted from resources/assessments/agency/agency-assessment-enhanced.js
 */

/**
 * Available services with enhanced metadata
 */
export const services = [
    { 
      name: "Creative Services", 
      id: "creative", 
      category: "Content & Creative",
      riskLevel: "High",
      disruptionTimeline: "2025-2028",
      recommendationsAvailable: true
    },
    { 
      name: "Content Development", 
      id: "content", 
      category: "Content & Creative",
      riskLevel: "Very High",
      disruptionTimeline: "2024-2026",
      recommendationsAvailable: true
    },
    { 
      name: "Digital Marketing", 
      id: "digital", 
      category: "Marketing Services",
      riskLevel: "High",
      disruptionTimeline: "2024-2026",
      recommendationsAvailable: true
    },
    { 
      name: "Media Services", 
      id: "media", 
      category: "Media Services",
      riskLevel: "Critical",
      disruptionTimeline: "Already happening",
      recommendationsAvailable: true
    },
    { 
      name: "PR & Communications", 
      id: "pr", 
      category: "Communications Services",
      riskLevel: "Moderate",
      disruptionTimeline: "2026-2028",
      recommendationsAvailable: true
    },
    { 
      name: "Strategy & Consulting", 
      id: "strategy", 
      category: "Advisory Services",
      riskLevel: "Low-Moderate",
      disruptionTimeline: "2027-2030",
      recommendationsAvailable: true
    },
    { 
      name: "Data & Analytics", 
      id: "data", 
      category: "Analytical Services",
      riskLevel: "Moderate-High",
      disruptionTimeline: "2024-2025",
      recommendationsAvailable: true
    },
    { 
      name: "Technical Services", 
      id: "tech", 
      category: "Technical Services",
      riskLevel: "Moderate",
      disruptionTimeline: "2025-2028",
      recommendationsAvailable: true
    },
    { 
      name: "Commerce/eCommerce", 
      id: "commerce", 
      category: "Technical Services",
      riskLevel: "Moderate-High",
      disruptionTimeline: "2025-2027",
      recommendationsAvailable: true
    }
];

/**
 * Service category grouping
 */
export const serviceCategories = [
    "Content & Creative",
    "Marketing Services",
    "Media Services",
    "Communications Services",
    "Advisory Services",
    "Analytical Services",
    "Technical Services"
];

/**
 * Note: The detailed service recommendations are now stored in agency-recommendations-config.js
 * This is a simplified version for quick reference, but the full implementation should
 * import from the recommendations config file as specified in the refactoring guide.
 */
export const serviceRecommendations = {
    // This is a simplified version - for complete recommendations,
    // import from agency-recommendations-config.js
    creative: {
        lowScore: [
            "Implement AI image generation tools immediately",
            "Train team on prompt engineering",
            "Shift to value-based pricing",
            "Position as AI-enhanced creative strategists"
        ],
        midScore: [
            "Build AI expertise into creative workflows",
            "Develop hybrid human-AI creative processes",
            "Focus on creative direction and strategy"
        ],
        highScore: [
            "Lead AI creative innovation in your niche",
            "Create custom models for key clients",
            "Develop proprietary AI enhancement tools"
        ]
    },
    content: {
        lowScore: [
            "Implement AI text generation immediately",
            "Develop human editing/oversight processes",
            "Build content strategy expertise"
        ],
        midScore: [
            "Develop hybrid writing workflows",
            "Create AI fact-checking processes",
            "Focus on content strategy and editorial direction"
        ],
        highScore: [
            "Develop proprietary AI content models",
            "Create strategic frameworks for AI content",
            "Shift to advisory/oversight model"
        ]
    },
    // Other services follow similar pattern
};

/**
 * Integration note:
 * For complete recommendations, use code like:
 * 
 * import { ServiceRecommendations } from '../../../resources/assessments/agency/agency-recommendations-config.js';
 * 
 * // Get recommendations for a service based on score
 * const getServiceRecommendations = (serviceId, score) => {
 *   const level = score < 40 ? 'lowScore' : score < 70 ? 'midScore' : 'highScore';
 *   return ServiceRecommendations.services[serviceId][level];
 * };
 */

export default {
    services,
    serviceCategories,
    serviceRecommendations
};
