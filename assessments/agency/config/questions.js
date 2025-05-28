/**
 * Assessment Framework - Agency Questions Configuration
 * 
 * Defines the assessment questions for agency assessment
 */

/**
 * Agency assessment questions
 */
export const agencyQuestions = {
    /**
     * Core questions asked to all users
     */
    core: [
        // Operational Maturity Questions
        {
            id: 1,
            dimension: "operational",
            title: "Operational Maturity",
            question: "If a new team member joined tomorrow, how would they figure out how you do things?",
            weight: 2,
            options: [
                { text: "They'd shadow someone and pick it up as they go", score: 0 },
                { text: "We've got some basic guides, but they're probably outdated", score: 1 },
                { text: "We have documentation for the main stuff, and update it yearly", score: 3 },
                { text: "Everything's documented in our wiki/knowledge base that we actually maintain", score: 5 }
            ]
        },
        {
            id: 2,
            dimension: "operational",
            question: "When was the last time you looked at your project management documentation?",
            weight: 1,
            options: [
                { text: "What documentation?", score: 0 },
                { text: "During our last crisis", score: 1 },
                { text: "We reference it occasionally", score: 3 },
                { text: "Last week - we use it regularly", score: 5 }
            ]
        },
        {
            id: 3,
            dimension: "operational",
            question: "If you (or your most critical team member) disappeared for a month with no warning or contact, what would happen?",
            weight: 3,
            options: [
                { text: "Complete disaster - the business might not survive", score: 0 },
                { text: "Major disruption but we'd survive", score: 1 },
                { text: "Some knowledge gaps but we'd manage", score: 3 },
                { text: "We have systems and documentation in place for this scenario", score: 5 }
            ]
        },
        {
            id: 4,
            dimension: "operational",
            question: "Who in your agency has critical knowledge that isn't documented or shared?",
            weight: 2,
            options: [
                { text: "Most of our team", score: 0 },
                { text: "Several key people", score: 1 },
                { text: "Maybe 2-3 critical people", score: 2 },
                { text: "One person (usually me, the founder)", score: 3 },
                { text: "No one - we've deliberately built resilience", score: 5 }
            ]
        },
        
        // Financial Resilience Questions
        {
            id: 11,
            dimension: "financial",
            title: "Financial Resilience",
            question: "On the first day of each month, roughly what percentage of that month's revenue do you already have locked in?",
            weight: 3,
            options: [
                { text: "0-20% - We start most months from scratch", score: 0 },
                { text: "20-50% - Some retainers but lots of project work", score: 1 },
                { text: "50-80% - Mostly retainers with some project work", score: 3 },
                { text: "80%+ - Almost entirely retainer-based", score: 5 }
            ]
        },
        {
            id: 12,
            dimension: "financial",
            question: "When was the last time a key client surprised you by leaving or significantly reducing spend?",
            weight: 2,
            options: [
                { text: "Within the last 3 months", score: 1 },
                { text: "Maybe 6-12 months ago", score: 3 },
                { text: "Can't remember the last time - years ago", score: 5 }
            ]
        },
        {
            id: 13,
            dimension: "financial",
            question: "How have your profit margins changed over the past 2 years?",
            weight: 3,
            options: [
                { text: "Decreased significantly", score: 0 },
                { text: "Decreased slightly", score: 1 },
                { text: "Stayed about the same", score: 2 },
                { text: "Increased slightly", score: 4 },
                { text: "Increased significantly", score: 5 }
            ]
        },
        
        // AI Readiness Questions
        {
            id: 21,
            dimension: "ai",
            title: "AI Readiness",
            question: "How would you describe your agency's overall approach to AI adoption?",
            weight: 3,
            options: [
                { text: "We're avoiding it - it's not relevant to us", score: 0 },
                { text: "We're watching from a distance", score: 1 },
                { text: "Some team members experiment on their own", score: 2 },
                { text: "We're actively testing and implementing AI tools", score: 4 },
                { text: "We've integrated AI across most of our operations", score: 5 }
            ]
        },
        {
            id: 22,
            dimension: "ai",
            question: "What percentage of your team is proficient with AI tools in their role?",
            weight: 2,
            options: [
                { text: "0-10% - Almost no one", score: 0 },
                { text: "10-25% - Just a few early adopters", score: 1 },
                { text: "25-50% - Getting there but not majority", score: 2 },
                { text: "50-75% - Most of the team", score: 4 },
                { text: "75%+ - Nearly everyone", score: 5 }
            ]
        },
        {
            id: 23,
            dimension: "ai",
            question: "Does your agency have a formal AI policy or strategy?",
            weight: 2,
            options: [
                { text: "No - we haven't addressed it", score: 0 },
                { text: "Not yet, but we're planning to create one", score: 2 },
                { text: "We have basic guidelines but nothing formal", score: 3 },
                { text: "Yes, we have a comprehensive AI strategy", score: 5 }
            ]
        },
        {
            id: 24,
            dimension: "ai",
            question: "How do you communicate your AI usage to clients?",
            weight: 2,
            options: [
                { text: "We don't use AI/don't tell clients", score: 0 },
                { text: "We don't actively disclose it", score: 1 },
                { text: "We disclose if specifically asked", score: 2 },
                { text: "We're open about our AI usage", score: 4 },
                { text: "We actively promote our AI capabilities", score: 5 }
            ]
        },
        
        // Strategic Position Questions
        {
            id: 31,
            dimension: "strategic",
            title: "Strategic Position",
            question: "How do you think AI will impact your agency's competitive position in the next 2 years?",
            weight: 3,
            options: [
                { text: "Significant negative impact", score: 0 },
                { text: "Moderate negative impact", score: 1 },
                { text: "No significant impact", score: 2 },
                { text: "Moderate positive impact", score: 4 },
                { text: "Significant positive impact", score: 5 }
            ]
        },
        {
            id: 32,
            dimension: "strategic",
            question: "What percentage of your revenue comes from services that could be partially automated by AI?",
            weight: 3,
            options: [
                { text: "75%+ - Most of what we do", score: 0 },
                { text: "50-75% - A majority of services", score: 1 },
                { text: "25-50% - Some key services", score: 2 },
                { text: "10-25% - A small portion", score: 4 },
                { text: "0-10% - Very little", score: 5 }
            ]
        },
        {
            id: 33,
            dimension: "strategic",
            question: "How are you adapting your pricing model in response to AI?",
            weight: 2,
            options: [
                { text: "We're not - still using same model", score: 0 },
                { text: "Slightly lowering rates due to efficiency", score: 1 },
                { text: "Moving toward project-based pricing", score: 3 },
                { text: "Shifting to value-based pricing", score: 5 }
            ]
        }
    ],
    
    /**
     * Service-specific questions
     */
    serviceSpecific: {
        creative: [
            {
                id: "creative_1",
                dimension: "ai",
                weight: 2.5,
                question: "To what extent has your creative team integrated AI image generation tools?",
                options: [
                    { text: "We haven't touched AI image tools", score: 0 },
                    { text: "A few designers experiment with Midjourney on personal time", score: 1 },
                    { text: "We use AI for mood boards and concepts", score: 2 },
                    { text: "AI generates 30-50% of our visual assets", score: 3 },
                    { text: "AI is integral to our creative process", score: 4 },
                    { text: "We've built custom models on client brand assets", score: 5 }
                ]
            },
            {
                id: "creative_2",
                dimension: "operational",
                weight: 2,
                question: "How has AI integration affected your creative team structure?",
                options: [
                    { text: "N/A - We're not using AI", score: 0 },
                    { text: "We've downsized our creative team", score: 1 },
                    { text: "Same structure, just more efficient", score: 2 },
                    { text: "Added AI specialists to the creative team", score: 4 },
                    { text: "Completely redesigned team around AI capabilities", score: 5 }
                ]
            }
        ],
        content: [
            {
                id: "content_1",
                dimension: "ai",
                weight: 2.5,
                question: "How does your content team currently use AI writing tools?",
                options: [
                    { text: "We don't use any AI writing tools", score: 0 },
                    { text: "Occasionally for headlines or basic edits", score: 1 },
                    { text: "For research and outlines", score: 2 },
                    { text: "First drafts with human editing", score: 3 },
                    { text: "End-to-end content creation with oversight", score: 4 },
                    { text: "Custom AI models for client voice/style", score: 5 }
                ]
            },
            {
                id: "content_2",
                dimension: "strategic",
                weight: 2,
                question: "How has AI affected your content pricing strategy?",
                options: [
                    { text: "We've had to lower our rates", score: 0 },
                    { text: "No change - same hourly/word pricing", score: 2 },
                    { text: "Shifted to value-based or package pricing", score: 4 },
                    { text: "Premium pricing for AI-enhanced strategy", score: 5 }
                ]
            }
        ],
        digital: [
            {
                id: "digital_1",
                dimension: "ai",
                weight: 2,
                question: "Which AI tools have you integrated into your digital marketing services?",
                options: [
                    { text: "None yet", score: 0 },
                    { text: "Basic analytics and reporting automation", score: 1 },
                    { text: "AI-assisted campaign optimization", score: 3 },
                    { text: "Comprehensive AI tools across all digital services", score: 5 }
                ]
            },
            {
                id: "digital_2",
                dimension: "strategic",
                weight: 2,
                question: "How are you positioning your digital services against AI-only alternatives?",
                options: [
                    { text: "We're competing mainly on price", score: 0 },
                    { text: "We emphasize human oversight", score: 2 },
                    { text: "We offer hybrid AI-human solutions", score: 3 },
                    { text: "We've developed proprietary AI tech", score: 5 }
                ]
            }
        ],
        media: [
            {
                id: "media_1",
                dimension: "ai",
                weight: 3,
                question: "How automated is your media buying process?",
                options: [
                    { text: "Mostly manual with basic tools", score: 0 },
                    { text: "Using standard programmatic platforms", score: 2 },
                    { text: "Advanced programmatic with some AI optimization", score: 3 },
                    { text: "Fully automated with AI campaign management", score: 5 }
                ]
            },
            {
                id: "media_2",
                dimension: "financial",
                weight: 3,
                question: "How has your media commission/fee structure evolved with automation?",
                options: [
                    { text: "Traditional % of media spend", score: 0 },
                    { text: "Lower % due to automation", score: 1 },
                    { text: "Hybrid fee + performance model", score: 3 },
                    { text: "Primarily performance-based compensation", score: 5 }
                ]
            }
        ]
    }
};

// Export with proper defaults
export default {
    questions: agencyQuestions,
    dimensions: [
        { id: "operational", name: "Operational Maturity" },
        { id: "financial", name: "Financial Resilience" },
        { id: "ai", name: "AI Readiness" },
        { id: "strategic", name: "Strategic Position" }
    ]
};
