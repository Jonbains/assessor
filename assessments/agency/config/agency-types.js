/**
 * Assessment Framework - Agency Types Configuration
 * 
 * Directly extracted from resources/assessments/agency/agency-assessment-enhanced.js
 */

/**
 * Available agency types with metadata
 */
export const agencyTypes = [
    { id: "creative", name: "Creative Agency", description: "Focuses on design, branding, and content creation", value: "Creative Agencies", label: "Creative Agency (design, branding, content)" },
    { id: "media", name: "Media Agency", description: "Focuses on media planning and buying", value: "Media Agencies", label: "Media Agency (media planning and buying)" },
    { id: "pr", name: "PR & Communications Agency", description: "Focuses on public relations", value: "PR & Communications Agencies", label: "PR & Communications Agency" },
    { id: "digital", name: "Digital Full-Service Agency", description: "Offers comprehensive digital services", value: "Digital Full-Service Agencies", label: "Digital Full-Service Agency" },
    { id: "specialized", name: "Industry-Specialist Agency", description: "Focuses on a specific industry sector", value: "Industry-Specialist Agencies", label: "Industry-Specialist Agency (focus on specific sector)" }
];

/**
 * Organization types (for forward compatibility)
 */
export const organizationTypes = [
    { value: "Creative Agencies", label: "Creative Agency (design, branding, content)" },
    { value: "Media Agencies", label: "Media Agency (media planning and buying)" },
    { value: "PR & Communications Agencies", label: "PR & Communications Agency" },
    { value: "Digital Full-Service Agencies", label: "Digital Full-Service Agency" },
    { value: "Industry-Specialist Agencies", label: "Industry-Specialist Agency (focus on specific sector)" }
];

/**
 * Default service selections by agency type
 */
export const defaultServices = {
    "creative": ["creative", "content", "strategy"],
    "media": ["media", "digital", "data"],
    "pr": ["pr", "content", "strategy"],
    "digital": ["digital", "content", "creative", "tech", "data", "commerce"],
    "specialized": ["strategy", "creative", "pr"]
};

/**
 * Agency type recommendations - key insights for each agency type
 * Directly extracted from agencyTypeInsights in agency-assessment-enhanced.js
 */
export const agencyTypeInsights = [
    {
        "type": "Creative Agencies",
        "current_vulnerability": "High",
        "key_message": "Your core product is changing fast - embrace AI as a creative partner",
        "top_priorities": [
            "Implement AI image generation tools immediately",
            "Train team on prompt engineering",
            "Shift to value-based pricing",
            "Position as AI-enhanced creative strategists"
        ]
    },
    {
        "type": "Media Agencies",
        "current_vulnerability": "Very High",
        "key_message": "Manual media buying is ending - pivot to strategy and technology now",
        "top_priorities": [
            "Implement programmatic platforms urgently",
            "Retrain buyers as strategists",
            "Shift from commission to performance pricing",
            "Build data and attribution capabilities"
        ]
    },
    {
        "type": "PR & Communications Agencies",
        "current_vulnerability": "Moderate",
        "key_message": "AI enhances but doesn't replace human relationships - find the balance",
        "top_priorities": [
            "Adopt AI monitoring and writing tools",
            "Maintain focus on strategic counsel",
            "Develop 24/7 AI-assisted capabilities",
            "Create transparent AI usage policies"
        ]
    },
    {
        "type": "Digital Full-Service Agencies",
        "current_vulnerability": "High",
        "key_message": "Every service line needs AI integration - comprehensive transformation required",
        "top_priorities": [
            "Assess AI impact across all services",
            "Implement AI tools systematically",
            "Launch AI consulting services",
            "Create innovation culture"
        ]
    },
    {
        "type": "Industry-Specialist Agencies",
        "current_vulnerability": "Moderate to High",
        "key_message": "Leverage domain expertise with AI to maintain specialized advantage",
        "top_priorities": [
            "Develop industry-specific AI applications",
            "Position as safe AI innovators for your sector",
            "Build custom AI models for your vertical",
            "Lead AI education in your industry"
        ]
    }
];

export default {
    agencyTypes,
    organizationTypes,
    defaultServices,
    agencyTypeInsights
};
