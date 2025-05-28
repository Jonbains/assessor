/**
 * Comprehensive Agency AI Assessment Configuration
 * Version 2.0 - Integrated with Service-Specific Recommendations
 * 
 * This configuration provides a detailed assessment framework with 10 questions per service line,
 * weighted scoring system, and comprehensive disruption analysis.
 */

const ComprehensiveAgencyAssessmentConfig = {
  id: "agency-assessment",
  title: "Agency AI Vulnerability Assessment",
  description: "This assessment tool evaluates how ready your agency is for AI, measuring your operational strength, financial health, and AI capabilities.",
  assessmentType: "agency",
  resultEmail: "assessment@obsolete.com",
  
  // Recommendations configuration
  recommendationsConfig: {
    enabled: true,
    externalFile: 'agency-recommendations-config.js',
    useServiceSpecific: true,
    useGeneralRecommendations: true,
    scoringThresholds: {
      low: { min: 0, max: 40 },
      mid: { min: 40, max: 70 },
      high: { min: 70, max: 100 }
    }
  },
  
  // Assessment flow steps
  steps: ["agency-type", "services", "revenue", "questions", "email", "results"],
  
  // Available agency types
  agencyTypes: [
    { id: "creative", name: "Creative Agency", description: "Focuses on design, branding, and content creation", value: "Creative Agencies", label: "Creative Agency (design, branding, content)" },
    { id: "media", name: "Media Agency", description: "Focuses on media planning and buying", value: "Media Agencies", label: "Media Agency (media planning and buying)" },
    { id: "pr", name: "PR & Communications Agency", description: "Focuses on public relations", value: "PR & Communications Agencies", label: "PR & Communications Agency" },
    { id: "digital", name: "Digital Full-Service Agency", description: "Offers comprehensive digital services", value: "Digital Full-Service Agencies", label: "Digital Full-Service Agency" },
    { id: "specialized", name: "Industry-Specialist Agency", description: "Focuses on a specific industry sector", value: "Industry-Specialist Agencies", label: "Industry-Specialist Agency (focus on specific sector)" }
  ],
  
  // Organization types (for forward compatibility)
  organizationTypes: [
    { value: "Creative Agencies", label: "Creative Agency (design, branding, content)" },
    { value: "Media Agencies", label: "Media Agency (media planning and buying)" },
    { value: "PR & Communications Agencies", label: "PR & Communications Agency" },
    { value: "Digital Full-Service Agencies", label: "Digital Full-Service Agency" },
    { value: "Industry-Specialist Agencies", label: "Industry-Specialist Agency (focus on specific sector)" }
  ],
  
  // Default service selections by agency type
  defaultServices: {
    "creative": ["creative", "content", "strategy"],
    "media": ["media", "digital", "data"],
    "pr": ["pr", "content", "strategy"],
    "digital": ["digital", "content", "creative", "tech", "data", "commerce"],
    "specialized": ["strategy", "creative", "pr"]
  },
  
  // Available services with enhanced metadata
  services: [
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
      name: "Technical Development", 
      id: "tech", 
      category: "Technical Services",
      riskLevel: "Moderate",
      disruptionTimeline: "2025-2027",
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
  ],
  
  // Comprehensive question framework
  questions: {
    // Core questions asked to all users (35 questions total)
    core: [
      // Operational Maturity Questions (10 questions)
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
        question: "When was the last time someone actually looked at your process documentation?",
        weight: 1.5,
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
          { text: "Complete disaster - clients would leave, projects would fail", score: 0 },
          { text: "Major disruption and some damaged client relationships", score: 1 },
          { text: "Rough few weeks but we'd manage the essentials", score: 3 },
          { text: "Mostly business as usual - we have backup plans and cross-training", score: 5 }
        ]
      },
      {
        id: 4,
        dimension: "operational",
        question: "How many people in your agency are truly irreplaceable?",
        weight: 2.5,
        options: [
          { text: "Several key people, including me", score: 0 },
          { text: "Maybe 2-3 critical people", score: 2 },
          { text: "One person (usually me, the founder)", score: 3 },
          { text: "No one - we've deliberately built resilience", score: 5 }
        ]
      },
      {
        id: 5,
        dimension: "operational",
        question: "How would you rate your agency's ability to work effectively as a distributed team?",
        weight: 2,
        options: [
          { text: "We're chaotic in person, and worse remotely", score: 0 },
          { text: "We manage, but it's not our preference", score: 2 },
          { text: "We've got solid systems that work regardless of location", score: 4 },
          { text: "We're actually more effective as a hybrid/remote team", score: 5 }
        ]
      },
      {
        id: 6,
        dimension: "operational",
        question: "How aligned is your leadership team on the agency's direction?",
        weight: 2.5,
        options: [
          { text: "We're basically never on the same page", score: 0 },
          { text: "Aligned on big picture, often disagree on execution", score: 2 },
          { text: "Generally aligned with healthy debate", score: 3 },
          { text: "Deeply aligned on vision, values, and execution", score: 5 }
        ]
      },
      {
        id: 7,
        dimension: "operational",
        question: "When was the last truly honest conversation about the agency's future?",
        weight: 2,
        options: [
          { text: "We avoid those uncomfortable topics", score: 0 },
          { text: "It's been a while - probably should revisit", score: 1 },
          { text: "We have them quarterly in our planning sessions", score: 3 },
          { text: "We have open, candid discussions regularly", score: 5 }
        ]
      },
      {
        id: 8,
        dimension: "operational",
        question: "How does your agency handle quality control?",
        weight: 2,
        options: [
          { text: "Ad hoc reviews, often rushed before deadlines", score: 0 },
          { text: "Basic review process but inconsistently applied", score: 2 },
          { text: "Established quality standards with regular reviews", score: 3 },
          { text: "Comprehensive QA process with clear accountability", score: 5 }
        ]
      },
      {
        id: 9,
        dimension: "operational",
        question: "How would you describe your project management approach?",
        weight: 2,
        options: [
          { text: "Reactive and often chaotic", score: 0 },
          { text: "Basic project tracking but frequent fire-fighting", score: 1 },
          { text: "Standardized processes with occasional exceptions", score: 3 },
          { text: "Mature methodology consistently applied", score: 5 }
        ]
      },
      {
        id: 10,
        dimension: "operational",
        question: "How do you track time and utilization?",
        weight: 1.5,
        options: [
          { text: "We don't track time systematically", score: 0 },
          { text: "Basic time tracking but limited analysis", score: 1 },
          { text: "Regular utilization reporting and management", score: 3 },
          { text: "Sophisticated utilization analysis driving decisions", score: 5 }
        ]
      },
      
      // Financial Resilience Questions (15 questions)
      {
        id: 11,
        dimension: "financial",
        title: "Financial Resilience",
        question: "On the first day of each month, roughly what percentage of that month's revenue do you already have locked in?",
        weight: 3,
        options: [
          { text: "Less than 20% - we're always hustling for new projects", score: 0 },
          { text: "About 30-40% - a mix of ongoing work and new business", score: 2 },
          { text: "Around 50-60% - we have some retainers but still need projects", score: 3 },
          { text: "Over 70% - mostly retainers and long-term commitments", score: 5 }
        ]
      },
      {
        id: 12,
        dimension: "financial",
        question: "When was the last time you had a genuine revenue panic?",
        weight: 2.5,
        options: [
          { text: "I'm in one right now", score: 0 },
          { text: "Within the last 3 months", score: 1 },
          { text: "Maybe 6-12 months ago", score: 3 },
          { text: "Can't remember the last time - years ago", score: 5 }
        ]
      },
      {
        id: 13,
        dimension: "financial",
        question: "If your biggest client called tomorrow and fired you, how would it affect your business?",
        weight: 3,
        options: [
          { text: "Existential crisis - we'd need to make immediate cuts", score: 0 },
          { text: "Very painful - significant restructuring needed", score: 1 },
          { text: "Uncomfortable but manageable - tighten belts for a few months", score: 3 },
          { text: "We'd be fine - no client accounts for more than 15% of revenue", score: 5 }
        ]
      },
      {
        id: 14,
        dimension: "financial",
        question: "How do you typically price your work?",
        weight: 2.5,
        options: [
          { text: "Hourly rates or day rates exclusively", score: 0 },
          { text: "Fixed project fees based on estimated time", score: 2 },
          { text: "Value-based pricing for some services, time for others", score: 3 },
          { text: "Primarily value-based, with recurring revenue models", score: 5 }
        ]
      },
      {
        id: 15,
        dimension: "financial",
        question: "When a project takes less time than expected because you worked smarter or used AI tools...",
        weight: 2.5,
        options: [
          { text: "We charge less since we bill by the hour", score: 0 },
          { text: "We still charge the agreed project fee but feel a bit guilty", score: 2 },
          { text: "We charge the full fee proudly - efficiency is our advantage", score: 4 },
          { text: "We've moved beyond time-based thinking entirely", score: 5 }
        ]
      },
      {
        id: 16,
        dimension: "financial",
        question: "What's your typical gross margin on client work?",
        weight: 2,
        options: [
          { text: "Less than 30%", score: 0 },
          { text: "30-40%", score: 2 },
          { text: "40-50%", score: 3 },
          { text: "Over 50%", score: 5 }
        ]
      },
      {
        id: 17,
        dimension: "financial",
        question: "How do you handle scope creep on projects?",
        weight: 2,
        options: [
          { text: "We typically absorb the extra work to keep clients happy", score: 0 },
          { text: "We try to push back but often end up doing extra work", score: 1 },
          { text: "We have change request processes but apply them inconsistently", score: 3 },
          { text: "We have clear boundaries and value-based change orders", score: 5 }
        ]
      },
      {
        id: 18,
        dimension: "financial",
        question: "How often do you review and adjust your pricing?",
        weight: 1.5,
        options: [
          { text: "Rarely or never - our rates have been stable for years", score: 0 },
          { text: "Occasionally when pressed by rising costs", score: 1 },
          { text: "Annual review with incremental adjustments", score: 3 },
          { text: "Regular strategic review based on value and market position", score: 5 }
        ]
      },
      {
        id: 19,
        dimension: "financial",
        question: "What percentage of revenue comes from recurring services?",
        weight: 2.5,
        options: [
          { text: "Less than 20%", score: 0 },
          { text: "20-40%", score: 2 },
          { text: "40-60%", score: 3 },
          { text: "More than 60%", score: 5 }
        ]
      },
      {
        id: 20,
        dimension: "financial",
        question: "How do you manage cash flow?",
        weight: 2,
        options: [
          { text: "Reactively, often with tight periods", score: 0 },
          { text: "Basic forecasting but limited reserves", score: 1 },
          { text: "Regular forecasting with reasonable reserves", score: 3 },
          { text: "Strategic approach with strong cash position", score: 5 }
        ]
      },
      {
        id: 21,
        dimension: "financial",
        question: "How would you describe your agency's revenue trend over the past 3 years?",
        weight: 2,
        options: [
          { text: "Significant decline (more than 10% down year-over-year)", score: 0 },
          { text: "Modest decline (0-10% down year-over-year)", score: 1 },
          { text: "Relatively flat (0-5% growth year-over-year)", score: 2 },
          { text: "Steady growth (5-15% growth year-over-year)", score: 3 },
          { text: "Strong growth (15-30% growth year-over-year)", score: 4 },
          { text: "Exceptional growth (more than 30% growth year-over-year)", score: 5 }
        ]
      },
      {
        id: 22,
        dimension: "financial",
        question: "How has your agency's profitability (EBITDA margin) changed over the past 3 years?",
        weight: 2.5,
        options: [
          { text: "Consistently unprofitable", score: 0 },
          { text: "Declining margins year-over-year", score: 1 },
          { text: "Fluctuating margins with no clear trend", score: 2 },
          { text: "Stable margins (within 2-3% range year-over-year)", score: 3 },
          { text: "Gradually improving margins", score: 4 },
          { text: "Significantly improving margins", score: 5 }
        ]
      },
      {
        id: 23,
        dimension: "financial",
        question: "How predictable is your agency's revenue from quarter to quarter?",
        weight: 2,
        options: [
          { text: "Highly unpredictable with significant swings", score: 0 },
          { text: "Somewhat unpredictable with occasional significant gaps", score: 1 },
          { text: "Moderately predictable with some project-based fluctuations", score: 3 },
          { text: "Mostly predictable with a good mix of retainers and projects", score: 4 },
          { text: "Very predictable with predominantly retainer-based revenue", score: 5 }
        ]
      },
      {
        id: 24,
        dimension: "financial",
        question: "Which markets generate the majority of your agency's revenue?",
        weight: 1.5,
        options: [
          { text: "Primarily local/regional clients", score: 1 },
          { text: "Mix of local and national clients", score: 2 },
          { text: "Primarily national clients", score: 3 },
          { text: "Mix of national and international clients", score: 4 },
          { text: "Global client base", score: 5 }
        ]
      },
      {
        id: 25,
        dimension: "financial",
        question: "How has your competitive position in your core market changed over the past 3 years?",
        weight: 2,
        options: [
          { text: "Losing significant market share to competitors", score: 0 },
          { text: "Gradually declining position", score: 1 },
          { text: "Maintaining position but not gaining", score: 2 },
          { text: "Gradually strengthening position", score: 4 },
          { text: "Significantly growing market share", score: 5 }
        ]
      },
      
      // AI Capability & Adaptability Questions (10 questions)
      {
        id: 26,
        dimension: "ai",
        title: "AI Capability & Adaptability",
        question: "How's your team actually using AI day-to-day in your operations?",
        weight: 3,
        options: [
          { text: "We're not - it's still sci-fi to us", score: 0 },
          { text: "A few enthusiasts using ChatGPT, but not systematically", score: 1 },
          { text: "We've integrated some tools, but it's not transformative yet", score: 3 },
          { text: "We've rebuilt many processes around AI capabilities", score: 5 }
        ]
      },
      {
        id: 27,
        dimension: "ai",
        question: "Which statement best matches your personal AI usage?",
        weight: 2,
        options: [
          { text: "I've heard of ChatGPT but haven't really tried it", score: 0 },
          { text: "I've played with it but don't use it regularly", score: 1 },
          { text: "I use it weekly for specific tasks", score: 3 },
          { text: "I use AI tools daily as an extension of my capabilities", score: 5 }
        ]
      },
      {
        id: 28,
        dimension: "ai",
        question: "How are you incorporating AI into the work you deliver to clients?",
        weight: 3,
        options: [
          { text: "We don't mention it - they might think we're cheating", score: 0 },
          { text: "We use it behind the scenes but don't talk about it", score: 1 },
          { text: "We're transparent about using it to enhance our work", score: 3 },
          { text: "We've developed AI-specific service offerings", score: 4 },
          { text: "Our entire service model has been reimagined around AI", score: 5 }
        ]
      },
      {
        id: 29,
        dimension: "ai",
        question: "When AI helps you do something in 20 minutes that used to take 4 hours, how does that translate to your bottom line?",
        weight: 3,
        options: [
          { text: "We bill less hours, so we actually make less money", score: 0 },
          { text: "We save on costs but haven't figured out how to make more", score: 1 },
          { text: "We deliver faster so can take more projects at the same fees", score: 3 },
          { text: "We charge premium rates for AI-enhanced work", score: 4 },
          { text: "We've created scalable AI-powered products/services", score: 5 }
        ]
      },
      {
        id: 30,
        dimension: "ai",
        question: "Have you had the AI pricing conversation with your team yet?",
        weight: 2,
        options: [
          { text: "No, we're avoiding that awkward topic", score: 0 },
          { text: "We've mentioned it but haven't resolved anything", score: 1 },
          { text: "We're actively experimenting with different approaches", score: 3 },
          { text: "Yes, we've completely overhauled our pricing strategy", score: 5 }
        ]
      },
      {
        id: 31,
        dimension: "ai",
        question: "How do you talk about AI with potential clients compared to your competitors?",
        weight: 2.5,
        options: [
          { text: "We don't mention it unless they ask", score: 0 },
          { text: "We've added some AI buzzwords to our credentials", score: 1 },
          { text: "We demonstrate specific AI applications in our sector", score: 3 },
          { text: "We're known as the AI-forward option in our space", score: 4 },
          { text: "We've completely rebranded around AI-enabled capabilities", score: 5 }
        ]
      },
      {
        id: 32,
        dimension: "ai",
        question: "What's your plan for services that AI might make obsolete or drastically change?",
        weight: 3,
        options: [
          { text: "Hope it doesn't happen to us", score: 0 },
          { text: "We're watching developments but not changing yet", score: 1 },
          { text: "We're actively evolving vulnerable service lines", score: 3 },
          { text: "We've already pivoted to higher-value services AI can't replace", score: 4 },
          { text: "We've rebuilt our business model anticipating these changes", score: 5 }
        ]
      },
      {
        id: 33,
        dimension: "ai",
        question: "What's your gut feeling about AI's impact on your agency in 2 years?",
        weight: 2,
        options: [
          { text: "Terrified - our core services might become commodities", score: 0 },
          { text: "Concerned - we'll need to make significant changes", score: 2 },
          { text: "Cautiously optimistic - it'll help more than hurt us", score: 3 },
          { text: "Excited - we're positioned to benefit enormously", score: 5 }
        ]
      },
      {
        id: 34,
        dimension: "ai",
        question: "What AI governance policies do you have in place?",
        weight: 2,
        options: [
          { text: "None at all", score: 0 },
          { text: "Informal guidelines but nothing documented", score: 1 },
          { text: "Basic documented policies", score: 3 },
          { text: "Comprehensive governance framework", score: 5 }
        ]
      },
      {
        id: 35,
        dimension: "ai",
        question: "How do you handle AI ethics and copyright concerns?",
        weight: 2,
        options: [
          { text: "We have no formal process", score: 0 },
          { text: "We discuss it as issues arise", score: 1 },
          { text: "We have documented guidelines and review them regularly", score: 3 },
          { text: "We have a comprehensive ethics framework and legal counsel review", score: 5 }
        ]
      }
    ],
    
    // Service-specific questions (10 questions per service = 90 total)
    serviceSpecific: {
      "creative": [
        {
          id: "creative_1",
          dimension: "ai",
          weight: 2.5,
          question: "To what extent has your creative team integrated AI image generation tools (Midjourney, DALL-E, Adobe Firefly) into regular workflows?",
          options: [
            { text: "We haven't touched AI image tools - still using traditional stock photos and manual design", score: 0 },
            { text: "A few designers experiment with Midjourney on personal time, but it's not in our workflow", score: 1 },
            { text: "We use AI for mood boards and concepts, but final assets are still created traditionally", score: 2 },
            { text: "AI generates 30-50% of our visual assets, with established quality review processes", score: 3 },
            { text: "AI is integral to our creative process - we have prompt libraries and brand training", score: 4 },
            { text: "We've built custom models on client brand assets and offer AI visual strategy as a service", score: 5 }
          ]
        },
        {
          id: "creative_2",
          dimension: "ai",
          weight: 2,
          question: "How much have AI tools reduced your concept visualization and mood board creation time?",
          options: [
            { text: "No time savings - we don't use AI for conceptualization", score: 0 },
            { text: "10-20% faster - AI occasionally helps with inspiration but mostly manual", score: 1 },
            { text: "30-40% faster - AI generates initial concepts that we refine", score: 2 },
            { text: "50-60% faster - AI rapidly produces multiple directions we can explore", score: 3 },
            { text: "70-80% faster - AI handles most visualization, we focus on strategy", score: 4 },
            { text: "90%+ faster - instant concepts, allowing 10x more iterations", score: 5 }
          ]
        },
        {
          id: "creative_3",
          dimension: "financial",
          weight: 2.5,
          question: "How far has your agency progressed in shifting from hourly billing to value-based pricing for AI-enhanced creative work?",
          options: [
            { text: "Still billing hourly - passing AI savings to clients as reduced hours", score: 0 },
            { text: "Considering changes but still time-based - uncomfortable with the ethics", score: 1 },
            { text: "Testing value pricing on small projects while maintaining hourly for most", score: 2 },
            { text: "50/50 split - value pricing for concepts, hourly for production", score: 3 },
            { text: "Mostly value-based with clear deliverables regardless of time spent", score: 4 },
            { text: "100% value-based - pricing based on business impact, not hours", score: 5 }
          ]
        },
        {
          id: "creative_4",
          dimension: "operational",
          weight: 2,
          question: "How robust are your processes for reviewing and ensuring brand consistency in AI-generated creative assets?",
          options: [
            { text: "No specific process - we review AI work like any other creative", score: 0 },
            { text: "Basic checklist but inconsistently applied across projects", score: 1 },
            { text: "Documented guidelines that most team members follow", score: 2 },
            { text: "Multi-stage review with brand guardians and quality gates", score: 3 },
            { text: "Automated brand compliance checks plus human creative direction", score: 4 },
            { text: "AI-powered brand consistency scoring integrated into our workflow", score: 5 }
          ]
        },
        {
          id: "creative_5",
          dimension: "ai",
          weight: 2,
          question: "What percentage of your creative team is proficient in prompt engineering and AI tool optimization?",
          options: [
            { text: "0% - No one has formal AI training", score: 0 },
            { text: "10-20% - A couple early adopters figuring it out themselves", score: 1 },
            { text: "30-40% - Growing group with basic prompt skills", score: 2 },
            { text: "50-60% - Half the team comfortable with AI tools", score: 3 },
            { text: "70-80% - Most creatives are AI-proficient", score: 4 },
            { text: "90-100% - AI proficiency is a job requirement", score: 5 }
          ]
        },
        {
          id: "creative_6",
          dimension: "ai",
          weight: 2,
          question: "How clearly do you communicate AI usage in creative processes to clients?",
          options: [
            { text: "We don't mention it - worried about client perception", score: 0 },
            { text: "Only if directly asked - prefer not to bring it up", score: 1 },
            { text: "Mentioned in contracts but not discussed in presentations", score: 2 },
            { text: "Transparent about AI use but focus on human oversight", score: 3 },
            { text: "AI integration is a key selling point in our pitches", score: 4 },
            { text: "We educate clients on AI and co-create AI strategies with them", score: 5 }
          ]
        },
        {
          id: "creative_7",
          dimension: "ai",
          weight: 2.5,
          question: "How well does your agency maintain the balance between AI efficiency and human creative direction?",
          options: [
            { text: "No balance needed - we avoid AI to preserve human creativity", score: 0 },
            { text: "Struggling - AI output often feels generic despite our efforts", score: 1 },
            { text: "Getting there - clear roles but still working out the process", score: 2 },
            { text: "Good balance - AI for production, humans for concepts", score: 3 },
            { text: "Strong integration - AI amplifies human creativity seamlessly", score: 4 },
            { text: "Perfect synergy - AI and humans collaborate at every stage", score: 5 }
          ]
        },
        {
          id: "creative_8",
          dimension: "ai",
          weight: 1.5,
          question: "To what degree have you developed proprietary AI models trained on client-specific brand assets?",
          options: [
            { text: "Not at all - we only use publicly available AI tools", score: 0 },
            { text: "Explored the idea but haven't implemented anything", score: 1 },
            { text: "Basic style references saved for consistent prompting", score: 2 },
            { text: "Custom LoRAs or fine-tuning for 1-2 major clients", score: 3 },
            { text: "Proprietary models for most retainer clients", score: 4 },
            { text: "Full AI brand guardian system with custom models per client", score: 5 }
          ]
        },
        {
          id: "creative_9",
          dimension: "financial",
          weight: 2,
          question: "How extensively have you developed AI-specific service offerings (AI training, prompt engineering services)?",
          options: [
            { text: "None - we keep AI as an internal efficiency tool only", score: 0 },
            { text: "Considering it but haven't launched any AI services yet", score: 1 },
            { text: "Basic AI consultation added to existing services", score: 2 },
            { text: "Dedicated AI creative services generating 10-20% of revenue", score: 3 },
            { text: "Full AI service line including training and implementation", score: 4 },
            { text: "AI services are our primary growth driver and differentiator", score: 5 }
          ]
        },
        {
          id: "creative_10",
          dimension: "ai",
          weight: 2,
          question: "How effectively have you positioned your agency as an AI-enhanced creative partner vs. traditional agency?",
          options: [
            { text: "We position as traditional craft-focused to differentiate from AI", score: 0 },
            { text: "Downplay AI to avoid seeming less creative or authentic", score: 1 },
            { text: "Mention AI capabilities but emphasize human creativity more", score: 2 },
            { text: "Equal emphasis on AI innovation and human expertise", score: 3 },
            { text: "Lead with AI capabilities as our competitive advantage", score: 4 },
            { text: "Known in market as the go-to AI-first creative agency", score: 5 }
          ]
        }
      ],
      
      "content": [
        {
          id: "content_1",
          dimension: "ai",
          weight: 2.5,
          question: "How comprehensively have you integrated AI writing assistants (ChatGPT, Claude, Jasper) into content workflows?",
          options: [
            { text: "Not at all - writers still work traditionally from blank page", score: 0 },
            { text: "Writers use AI personally but no official process or tools", score: 1 },
            { text: "AI for research and ideation only, all writing still manual", score: 2 },
            { text: "AI creates first drafts that writers extensively edit", score: 3 },
            { text: "Sophisticated AI workflow from brief to final content", score: 4 },
            { text: "End-to-end AI pipeline with human strategy and quality control", score: 5 }
          ]
        },
        {
          id: "content_2",
          dimension: "operational",
          weight: 2,
          question: "To what extent can you meet increased content demands (50+ pieces weekly) using AI augmentation?",
          options: [
            { text: "Can't scale - still producing 5-10 pieces per week per writer", score: 0 },
            { text: "Slight increase to 10-15 pieces but quality concerns", score: 1 },
            { text: "20-30 pieces per week with AI assistance", score: 2 },
            { text: "40-50 pieces maintaining quality through AI+human review", score: 3 },
            { text: "50-100 pieces per week with consistent quality", score: 4 },
            { text: "100+ pieces per week, scalable on demand", score: 5 }
          ]
        },
        {
          id: "content_3",
          dimension: "operational",
          weight: 2.5,
          question: "How robust are your processes for fact-checking and brand voice consistency in AI-generated content?",
          options: [
            { text: "No specific process - rely on writers to catch issues", score: 0 },
            { text: "Basic review but AI hallucinations slip through sometimes", score: 1 },
            { text: "Manual fact-checking checklist and brand guidelines", score: 2 },
            { text: "Two-stage review: facts and voice checked separately", score: 3 },
            { text: "Automated fact-checking tools plus human verification", score: 4 },
            { text: "AI-powered brand voice scoring and automated fact verification", score: 5 }
          ]
        },
        {
          id: "content_4",
          dimension: "financial",
          weight: 2.5,
          question: "How far have you transitioned from per-word pricing to value-based or deliverable-based models?",
          options: [
            { text: "Still charging per word - typically $0.10-0.50/word", score: 0 },
            { text: "Moved to per-piece pricing but still based on length", score: 1 },
            { text: "Package pricing for content bundles regardless of length", score: 2 },
            { text: "Performance-based pricing tied to engagement metrics", score: 3 },
            { text: "Strategic content programs priced on business value", score: 4 },
            { text: "Outcome-based pricing tied to client KPIs", score: 5 }
          ]
        },
        {
          id: "content_5",
          dimension: "ai",
          weight: 2,
          question: "How effectively do you use AI for content optimization and performance prediction?",
          options: [
            { text: "Don't use AI for optimization - rely on instinct and experience", score: 0 },
            { text: "Basic AI tools for SEO keywords only", score: 1 },
            { text: "AI assists with headlines and meta descriptions", score: 2 },
            { text: "AI predicts performance and suggests improvements", score: 3 },
            { text: "Full AI optimization suite integrated into workflow", score: 4 },
            { text: "Proprietary AI models trained on client performance data", score: 5 }
          ]
        },
        {
          id: "content_6",
          dimension: "ai",
          weight: 2,
          question: "What percentage of your content team has received formal training in AI content tools and best practices?",
          options: [
            { text: "0% - No formal training program exists", score: 0 },
            { text: "10-20% - A few self-taught pioneers", score: 1 },
            { text: "30-40% - Optional training available", score: 2 },
            { text: "50-60% - Required for new hires", score: 3 },
            { text: "70-80% - Comprehensive training program", score: 4 },
            { text: "100% - Mandatory certification program", score: 5 }
          ]
        },
        {
          id: "content_7",
          dimension: "ai",
          weight: 2,
          question: "How well do you educate clients about AI capabilities, limitations, and ethical considerations in content?",
          options: [
            { text: "We don't discuss AI use with clients at all", score: 0 },
            { text: "Mention it briefly if asked but avoid details", score: 1 },
            { text: "Include AI disclosure in contracts only", score: 2 },
            { text: "Proactive transparency about AI use and human oversight", score: 3 },
            { text: "Educational materials and workshops for clients", score: 4 },
            { text: "Thought leadership on AI content ethics and best practices", score: 5 }
          ]
        },
        {
          id: "content_8",
          dimension: "ai",
          weight: 2.5,
          question: "How capable are you at determining when human expertise is essential (YMYL content, technical writing)?",
          options: [
            { text: "No clear guidelines - use AI for everything to save costs", score: 0 },
            { text: "Vague understanding but inconsistent application", score: 1 },
            { text: "Basic rules about sensitive topics requiring human writers", score: 2 },
            { text: "Clear matrix of content types and AI vs human requirements", score: 3 },
            { text: "Sophisticated triage system with expert human review", score: 4 },
            { text: "Industry-leading framework balancing AI efficiency and human expertise", score: 5 }
          ]
        },
        {
          id: "content_9",
          dimension: "operational",
          weight: 2,
          question: "To what degree have you automated research, outlining, and initial draft creation?",
          options: [
            { text: "No automation - traditional research and writing process", score: 0 },
            { text: "AI helps with research but outlining and drafting are manual", score: 1 },
            { text: "AI creates outlines from briefs, humans write drafts", score: 2 },
            { text: "AI handles research through first draft, humans refine", score: 3 },
            { text: "Automated pipeline from brief to near-final content", score: 4 },
            { text: "Full automation with AI agents handling entire workflow", score: 5 }
          ]
        },
        {
          id: "content_10",
          dimension: "ai",
          weight: 2.5,
          question: "How much have you shifted focus from content creation to content strategy and AI consulting?",
          options: [
            { text: "Still 100% focused on content creation deliverables", score: 0 },
            { text: "95% creation, 5% strategy - mostly tactical work", score: 1 },
            { text: "80% creation, 20% strategy - growing advisory role", score: 2 },
            { text: "60% creation, 40% strategy - balanced offering", score: 3 },
            { text: "40% creation, 60% strategy - strategic partner role", score: 4 },
            { text: "90%+ strategy and AI consulting - creation is commodity", score: 5 }
          ]
        }
      ],
      
      // Digital Marketing questions
      "digital": [
        {
          id: "digital_1",
          dimension: "ai",
          weight: 2.5,
          question: "How extensively do you use native AI tools (Performance Max, Advantage+, etc.) across advertising platforms?",
          options: [
            { text: "Don't use them - prefer manual control over campaigns", score: 0 },
            { text: "Testing on 10-20% of spend but skeptical of black box", score: 1 },
            { text: "Use for 30-40% of campaigns where it makes sense", score: 2 },
            { text: "50-60% of spend through AI-native campaign types", score: 3 },
            { text: "70-80% AI-driven with manual only for special cases", score: 4 },
            { text: "95%+ on AI tools, seen as competitive advantage", score: 5 }
          ]
        },
        {
          id: "digital_2",
          dimension: "operational",
          weight: 2,
          question: "To what degree have you automated campaign setup, optimization, and reporting processes?",
          options: [
            { text: "Fully manual - we build and optimize everything by hand", score: 0 },
            { text: "Basic automation for reporting only", score: 1 },
            { text: "Templates for campaign setup, manual optimization", score: 2 },
            { text: "Automated setup and basic bid optimizations", score: 3 },
            { text: "Full automation suite with custom scripts and APIs", score: 4 },
            { text: "Proprietary automation platform managing entire lifecycle", score: 5 }
          ]
        },
        {
          id: "digital_3",
          dimension: "ai",
          weight: 2.5,
          question: "How well do you leverage AI for campaign performance prediction and budget allocation?",
          options: [
            { text: "Don't predict - allocate budget based on past performance", score: 0 },
            { text: "Basic forecasting in spreadsheets, manual allocation", score: 1 },
            { text: "Platform AI for predictions, human budget decisions", score: 2 },
            { text: "AI recommendations that humans review and approve", score: 3 },
            { text: "AI automatically shifts budgets within set parameters", score: 4 },
            { text: "Full AI autonomy with predictive optimization", score: 5 }
          ]
        },
        {
          id: "digital_4",
          dimension: "ai",
          weight: 2.5,
          question: "How capable are your systems of making real-time, AI-driven campaign adjustments?",
          options: [
            { text: "No real-time capability - daily manual reviews at best", score: 0 },
            { text: "Platform automation only (basic bid adjustments)", score: 1 },
            { text: "Rule-based automation for common scenarios", score: 2 },
            { text: "AI monitoring with human approval for changes", score: 3 },
            { text: "AI makes autonomous adjustments within guidelines", score: 4 },
            { text: "Advanced AI orchestrating all elements in real-time", score: 5 }
          ]
        },
        {
          id: "digital_5",
          dimension: "ai",
          weight: 2,
          question: "How effectively do you use AI to orchestrate campaigns across multiple digital channels?",
          options: [
            { text: "Manage each channel separately with different teams", score: 0 },
            { text: "Manual coordination through weekly meetings", score: 1 },
            { text: "Shared dashboards but separate optimization", score: 2 },
            { text: "Some cross-channel rules and automation", score: 3 },
            { text: "AI coordinates messaging and budgets across channels", score: 4 },
            { text: "Unified AI brain optimizing entire digital ecosystem", score: 5 }
          ]
        },
        {
          id: "digital_6",
          dimension: "ai",
          weight: 2,
          question: "To what extent can you deliver individualized experiences across large audience segments?",
          options: [
            { text: "One-size-fits-all messaging for all audiences", score: 0 },
            { text: "2-3 broad segments with basic personalization", score: 1 },
            { text: "5-10 segments with tailored creative", score: 2 },
            { text: "20+ segments with dynamic creative optimization", score: 3 },
            { text: "Hundreds of micro-segments with AI personalization", score: 4 },
            { text: "True 1:1 personalization at scale", score: 5 }
          ]
        },
        {
          id: "digital_7",
          dimension: "ai",
          weight: 2,
          question: "What percentage of your team is certified in platform-specific AI features?",
          options: [
            { text: "0% - No one has platform AI certifications", score: 0 },
            { text: "10-20% - One or two specialists", score: 1 },
            { text: "30-40% - Growing but not prioritized", score: 2 },
            { text: "50-60% - Required for senior roles", score: 3 },
            { text: "70-80% - Most team members certified", score: 4 },
            { text: "100% - Mandatory with ongoing education", score: 5 }
          ]
        },
        {
          id: "digital_8",
          dimension: "ai",
          weight: 2.5,
          question: "How sophisticated are your AI-enhanced attribution and ROI measurement capabilities?",
          options: [
            { text: "Last-click attribution in platform reports only", score: 0 },
            { text: "Basic multi-touch attribution models", score: 1 },
            { text: "GA4 or similar with custom attribution", score: 2 },
            { text: "Advanced attribution with incrementality testing", score: 3 },
            { text: "AI-powered attribution with predictive value modeling", score: 4 },
            { text: "Proprietary AI attribution proving true business impact", score: 5 }
          ]
        },
        {
          id: "digital_9",
          dimension: "operational",
          weight: 2,
          question: "How automated and insightful are your AI-powered client dashboards and reports?",
          options: [
            { text: "Manual Excel/PowerPoint reports created weekly/monthly", score: 0 },
            { text: "Basic automated data pulls but manual analysis", score: 1 },
            { text: "Real-time dashboards showing performance metrics", score: 2 },
            { text: "AI-generated insights and recommendations", score: 3 },
            { text: "Predictive analytics and automated action items", score: 4 },
            { text: "AI analyst providing strategic consultation via dashboard", score: 5 }
          ]
        },
        {
          id: "digital_10",
          dimension: "ai",
          weight: 2,
          question: "How quickly do you test and implement new AI features as platforms release them?",
          options: [
            { text: "Wait 6-12 months for others to prove they work", score: 0 },
            { text: "Test after 3-6 months once best practices emerge", score: 1 },
            { text: "Try within 1-2 months on small budgets", score: 2 },
            { text: "Beta test programs with major platforms", score: 3 },
            { text: "Day-one adoption with dedicated innovation budget", score: 4 },
            { text: "Alpha access and co-development with platforms", score: 5 }
          ]
        }
      ],
      
      // Media Services questions  
      "media": [
        {
          id: "media_1",
          dimension: "ai",
          weight: 3,
          question: "What percentage of your media buying is fully automated through AI-powered programmatic platforms?",
          options: [
            { text: "0% - We still negotiate and place all media buys manually", score: 0 },
            { text: "Under 20% - Mostly manual with some basic programmatic display", score: 1 },
            { text: "20-40% - Programmatic for standard digital, manual for premium", score: 2 },
            { text: "40-60% - Majority programmatic, manual only for special deals", score: 3 },
            { text: "60-80% - Nearly all digital programmatic, exploring AI for traditional", score: 4 },
            { text: "80%+ - Full AI stack including TV, audio, and outdoor", score: 5 }
          ]
        },
        {
          id: "media_2",
          dimension: "operational",
          weight: 2.5,
          question: "How advanced is your data pipeline for supporting AI-driven media decisions?",
          options: [
            { text: "Spreadsheets and platform reports - no unified data", score: 0 },
            { text: "Basic data warehouse pulling from main platforms", score: 1 },
            { text: "Unified reporting but limited real-time capability", score: 2 },
            { text: "Real-time data feeds enabling quick decisions", score: 3 },
            { text: "Advanced CDP with AI-ready data architecture", score: 4 },
            { text: "Proprietary data platform with predictive modeling", score: 5 }
          ]
        },
        {
          id: "media_3",
          dimension: "ai",
          weight: 2.5,
          question: "How well can your AI tools optimize budget allocation across channels in real-time?",
          options: [
            { text: "Manual reallocation based on weekly/monthly reviews", score: 0 },
            { text: "Platform-specific optimization within channel silos", score: 1 },
            { text: "Daily manual reviews with some automation", score: 2 },
            { text: "Cross-channel optimization with human oversight", score: 3 },
            { text: "AI reallocates budgets hourly based on performance", score: 4 },
            { text: "Millisecond-level optimization across all media", score: 5 }
          ]
        },
        {
          id: "media_4",
          dimension: "ai",
          weight: 2.5,
          question: "To what extent do you use AI for media mix modeling and scenario planning?",
          options: [
            { text: "No modeling - allocate based on last year's performance", score: 0 },
            { text: "Basic Excel models updated quarterly", score: 1 },
            { text: "Third-party MMM studies done annually", score: 2 },
            { text: "In-house modeling with some AI components", score: 3 },
            { text: "Real-time AI MMM adjusting recommendations", score: 4 },
            { text: "Predictive AI simulating thousands of scenarios", score: 5 }
          ]
        },
        {
          id: "media_5",
          dimension: "ai",
          weight: 2,
          question: "How clearly can you explain AI-driven media decisions and optimizations to clients?",
          options: [
            { text: "Can't explain - AI is a black box even to us", score: 0 },
            { text: "Vague explanations about 'machine learning'", score: 1 },
            { text: "Show performance improvements but not the 'why'", score: 2 },
            { text: "Clear frameworks explaining AI logic", score: 3 },
            { text: "Interactive dashboards showing AI decision factors", score: 4 },
            { text: "Full transparency with AI decision documentation", score: 5 }
          ]
        },
        {
          id: "media_6",
          dimension: "operational",
          weight: 2.5,
          question: "How well have you reorganized teams around AI-augmented workflows vs. traditional roles?",
          options: [
            { text: "Same structure as 10 years ago - buyers, planners, analysts", score: 0 },
            { text: "Added 'digital' roles but traditional hierarchy", score: 1 },
            { text: "Some consolidation but still channel-focused", score: 2 },
            { text: "Cross-functional pods with AI tools", score: 3 },
            { text: "AI-centric teams with humans as strategists", score: 4 },
            { text: "Fully reimagined AI-human collaborative structure", score: 5 }
          ]
        },
        {
          id: "media_7",
          dimension: "ai",
          weight: 2,
          question: "To what degree have you developed proprietary AI models for media optimization?",
          options: [
            { text: "None - rely entirely on platform tools", score: 0 },
            { text: "Some custom scripts but no real AI models", score: 1 },
            { text: "Basic models for specific use cases", score: 2 },
            { text: "Several proprietary models enhancing platform AI", score: 3 },
            { text: "Comprehensive AI suite across all media functions", score: 4 },
            { text: "Industry-leading AI IP as core differentiator", score: 5 }
          ]
        },
        {
          id: "media_8",
          dimension: "financial",
          weight: 3,
          question: "How far have you shifted from commission-based to performance-based pricing models?",
          options: [
            { text: "Still 100% media commission based (typically 10-15%)", score: 0 },
            { text: "Mostly commission with some fixed fees", score: 1 },
            { text: "50/50 commission and retainer model", score: 2 },
            { text: "Primarily retainer with some performance bonuses", score: 3 },
            { text: "Significant portion tied to KPI achievement", score: 4 },
            { text: "100% performance-based pricing", score: 5 }
          ]
        },
        {
          id: "media_9",
          dimension: "ai",
          weight: 2,
          question: "How strong are your partnerships with AI platform vendors and data providers?",
          options: [
            { text: "Standard advertiser accounts with no special access", score: 0 },
            { text: "Good relationships but no formal partnerships", score: 1 },
            { text: "Preferred partner status with main platforms", score: 2 },
            { text: "Beta access and quarterly business reviews", score: 3 },
            { text: "Strategic partnerships with product input", score: 4 },
            { text: "Co-innovation partnerships developing new AI features", score: 5 }
          ]
        },
        {
          id: "media_10",
          dimension: "ai",
          weight: 2.5,
          question: "How differentiated are your AI-powered media capabilities compared to competitors?",
          options: [
            { text: "Behind the curve - competitors more advanced", score: 0 },
            { text: "Playing catch-up but closing the gap", score: 1 },
            { text: "On par with most competitors", score: 2 },
            { text: "Ahead in 1-2 specific areas", score: 3 },
            { text: "Clear leader with proven advantages", score: 4 },
            { text: "Redefined the category with AI innovation", score: 5 }
          ]
        }
      ],
      
      // PR & Communications questions
      "pr": [
        {
          id: "pr_1",
          dimension: "ai",
          weight: 2.5,
          question: "How comprehensive is your AI-powered media monitoring and sentiment analysis capability?",
          options: [
            { text: "Manual Google alerts and basic media clipping services", score: 0 },
            { text: "Traditional monitoring tools with keyword searches", score: 1 },
            { text: "Some AI features in monitoring but mostly manual analysis", score: 2 },
            { text: "AI sentiment analysis with human verification", score: 3 },
            { text: "Advanced AI tracking context, emotion, and influence", score: 4 },
            { text: "Predictive AI identifying issues before they trend", score: 5 }
          ]
        },
        {
          id: "pr_2",
          dimension: "ai",
          weight: 2.5,
          question: "To what extent can you use AI to predict and prevent potential PR crises?",
          options: [
            { text: "React to crises after they happen", score: 0 },
            { text: "Monitor for obvious risk keywords", score: 1 },
            { text: "Quarterly risk assessments with some data analysis", score: 2 },
            { text: "AI flags potential issues for human review", score: 3 },
            { text: "Predictive models with crisis probability scores", score: 4 },
            { text: "AI simulates scenarios and prescribes prevention strategies", score: 5 }
          ]
        },
        {
          id: "pr_3",
          dimension: "ai",
          weight: 2,
          question: "How effectively do you use AI for initial drafts of press releases and social content?",
          options: [
            { text: "All content written from scratch by humans", score: 0 },
            { text: "AI for inspiration but not actual drafting", score: 1 },
            { text: "AI creates rough drafts that need major rewrites", score: 2 },
            { text: "AI drafts require moderate editing - saves 50% time", score: 3 },
            { text: "AI creates near-final drafts needing light polish", score: 4 },
            { text: "AI generates publication-ready content with brand voice", score: 5 }
          ]
        },
        {
          id: "pr_4",
          dimension: "ai",
          weight: 2,
          question: "How sophisticated are your AI tools for identifying and targeting relevant media contacts?",
          options: [
            { text: "Static media lists updated manually quarterly", score: 0 },
            { text: "Basic database with manual research for each campaign", score: 1 },
            { text: "Searchable database with some automation", score: 2 },
            { text: "AI suggests contacts based on beat and past coverage", score: 3 },
            { text: "AI predicts journalist interest and optimal timing", score: 4 },
            { text: "AI personalizes pitches based on journalist preferences", score: 5 }
          ]
        },
        {
          id: "pr_5",
          dimension: "operational",
          weight: 2.5,
          question: "How capable are you of providing 24/7 AI-assisted monitoring and initial response?",
          options: [
            { text: "Business hours only - check alerts in the morning", score: 0 },
            { text: "On-call system for major clients only", score: 1 },
            { text: "Offshore team provides overnight coverage", score: 2 },
            { text: "AI alerts key personnel to urgent issues 24/7", score: 3 },
            { text: "AI drafts initial responses for human approval anytime", score: 4 },
            { text: "Full AI-human hybrid system with instant response", score: 5 }
          ]
        },
        {
          id: "pr_6",
          dimension: "ai",
          weight: 2.5,
          question: "How advanced are your AI-powered PR measurement and ROI demonstration capabilities?",
          options: [
            { text: "Count clips and estimate reach/impressions", score: 0 },
            { text: "Basic metrics plus share of voice calculations", score: 1 },
            { text: "Some sentiment analysis and message penetration", score: 2 },
            { text: "AI correlates coverage to business metrics", score: 3 },
            { text: "Predictive models showing PR impact on sales", score: 4 },
            { text: "Real-time AI attribution of business outcomes to PR", score: 5 }
          ]
        },
        {
          id: "pr_7",
          dimension: "ai",
          weight: 2,
          question: "What percentage of your PR team is trained in AI tools while maintaining relationship skills?",
          options: [
            { text: "0% - Traditional PR skills only", score: 0 },
            { text: "10-20% - A few tech-savvy team members", score: 1 },
            { text: "30-40% - Growing but not systematic", score: 2 },
            { text: "50-60% - Formal training programs in place", score: 3 },
            { text: "70-80% - Most combine AI and relationship skills", score: 4 },
            { text: "100% - Hybrid AI-human skills are mandatory", score: 5 }
          ]
        },
        {
          id: "pr_8",
          dimension: "ai",
          weight: 2,
          question: "How robust are your policies for transparent AI use in PR activities?",
          options: [
            { text: "No policies - use AI secretly to maintain authenticity", score: 0 },
            { text: "Informal guidelines about being 'careful'", score: 1 },
            { text: "Written policy but inconsistently applied", score: 2 },
            { text: "Clear guidelines with client disclosure", score: 3 },
            { text: "Industry-leading transparency standards", score: 4 },
            { text: "Published thought leadership on ethical AI in PR", score: 5 }
          ]
        },
        {
          id: "pr_9",
          dimension: "financial",
          weight: 2,
          question: "To what extent have you developed new AI-enabled PR services (predictive analytics, automated reporting)?",
          options: [
            { text: "Same services as always - AI is just internal efficiency", score: 0 },
            { text: "Mentioned AI in proposals but no new services", score: 1 },
            { text: "Enhanced existing services with AI features", score: 2 },
            { text: "2-3 new AI-specific services launched", score: 3 },
            { text: "Full suite of AI-powered PR offerings", score: 4 },
            { text: "AI services drive majority of new business", score: 5 }
          ]
        },
        {
          id: "pr_10",
          dimension: "ai",
          weight: 2.5,
          question: "How well do you maintain human relationship management while leveraging AI efficiency?",
          options: [
            { text: "Relationships suffering as we focus on AI efficiency", score: 0 },
            { text: "Struggling to balance tech and human touch", score: 1 },
            { text: "Clear separation - AI for tasks, humans for relationships", score: 2 },
            { text: "AI enhances human relationships with better insights", score: 3 },
            { text: "Seamless integration amplifying human connections", score: 4 },
            { text: "AI enables deeper relationships than ever before", score: 5 }
          ]
        }
      ],
      
      // Strategy & Consulting questions
      "strategy": [
        {
          id: "strategy_1",
          dimension: "ai",
          weight: 2.5,
          question: "How extensively do you use AI for market research, competitive intelligence, and consumer insights?",
          options: [
            { text: "Traditional research methods - surveys, focus groups, desk research", score: 0 },
            { text: "Some online tools but mostly manual analysis", score: 1 },
            { text: "AI tools for data gathering, human analysis", score: 2 },
            { text: "AI processes data and suggests insights", score: 3 },
            { text: "Advanced AI uncovering non-obvious patterns", score: 4 },
            { text: "Proprietary AI delivering unique strategic insights", score: 5 }
          ]
        },
        {
          id: "strategy_2",
          dimension: "ai",
          weight: 2.5,
          question: "To what degree can you leverage AI for complex business scenario planning and simulation?",
          options: [
            { text: "PowerPoint scenarios based on experience and intuition", score: 0 },
            { text: "Excel models with basic sensitivity analysis", score: 1 },
            { text: "Some predictive modeling for specific metrics", score: 2 },
            { text: "AI simulates multiple scenarios with probabilities", score: 3 },
            { text: "Dynamic AI models updating with real-time data", score: 4 },
            { text: "AI war-gaming complex competitive dynamics", score: 5 }
          ]
        },
        {
          id: "strategy_3",
          dimension: "ai",
          weight: 2.5,
          question: "How advanced are your capabilities in using AI to process and synthesize vast amounts of strategic data?",
          options: [
            { text: "Manually review reports and synthesize findings", score: 0 },
            { text: "Use search tools but manual synthesis", score: 1 },
            { text: "AI helps organize data, humans draw conclusions", score: 2 },
            { text: "AI identifies patterns and suggests strategic themes", score: 3 },
            { text: "AI synthesizes insights from millions of data points", score: 4 },
            { text: "AI generates novel strategic hypotheses from data", score: 5 }
          ]
        },
        {
          id: "strategy_4",
          dimension: "ai",
          weight: 3,
          question: "How capable are you at developing comprehensive AI transformation strategies for clients?",
          options: [
            { text: "Don't offer AI strategy - refer to tech consultants", score: 0 },
            { text: "Basic AI opportunity assessments only", score: 1 },
            { text: "Can identify AI use cases but not implementation", score: 2 },
            { text: "Full AI strategy with roadmap and partners", score: 3 },
            { text: "End-to-end AI transformation expertise", score: 4 },
            { text: "Recognized leader in AI strategy consulting", score: 5 }
          ]
        },
        {
          id: "strategy_5",
          dimension: "financial",
          weight: 2.5,
          question: "How far have you progressed toward outcome-based pricing models for AI-enhanced consulting?",
          options: [
            { text: "Still charging time and materials for all projects", score: 0 },
            { text: "Fixed project fees based on estimated effort", score: 1 },
            { text: "Some success fees but mostly fixed pricing", score: 2 },
            { text: "30-40% of fees tied to outcomes", score: 3 },
            { text: "Majority of revenue from performance-based fees", score: 4 },
            { text: "Pure outcome-based model with shared risk/reward", score: 5 }
          ]
        },
        {
          id: "strategy_6",
          dimension: "operational",
          weight: 2,
          question: "What percentage of your strategy team includes AI specialists or data scientists?",
          options: [
            { text: "0% - Traditional consultants only", score: 0 },
            { text: "5-10% - One or two data analysts", score: 1 },
            { text: "15-25% - Growing technical capability", score: 2 },
            { text: "30-40% - Significant AI expertise", score: 3 },
            { text: "50-60% - Balanced traditional and AI skills", score: 4 },
            { text: "70%+ - AI-first strategy team", score: 5 }
          ]
        },
        {
          id: "strategy_7",
          dimension: "ai",
          weight: 2,
          question: "To what extent have you developed custom AI tools for strategic analysis?",
          options: [
            { text: "No custom tools - use off-the-shelf software only", score: 0 },
            { text: "Some Excel macros and basic automation", score: 1 },
            { text: "Custom dashboards pulling from various sources", score: 2 },
            { text: "Proprietary analysis tools with AI components", score: 3 },
            { text: "Full suite of custom AI strategy tools", score: 4 },
            { text: "AI platform that's a differentiator in pitches", score: 5 }
          ]
        },
        {
          id: "strategy_8",
          dimension: "ai",
          weight: 2.5,
          question: "How effective are you at leading clients through AI-driven organizational transformation?",
          options: [
            { text: "Focus on strategy only - don't do implementation", score: 0 },
            { text: "High-level roadmaps but limited change management", score: 1 },
            { text: "Partner with others for implementation", score: 2 },
            { text: "Guide implementation with proven frameworks", score: 3 },
            { text: "Full transformation expertise including culture change", score: 4 },
            { text: "Transformed multiple Fortune 500s with AI", score: 5 }
          ]
        },
        {
          id: "strategy_9",
          dimension: "ai",
          weight: 2,
          question: "How established is your agency as a thought leader in AI strategy and implementation?",
          options: [
            { text: "No thought leadership - still learning ourselves", score: 0 },
            { text: "Occasional blog posts about AI trends", score: 1 },
            { text: "Regular content but not seen as expert", score: 2 },
            { text: "Speaking at conferences and publishing research", score: 3 },
            { text: "Go-to source for AI strategy insights", score: 4 },
            { text: "Defining the conversation on AI transformation", score: 5 }
          ]
        },
        {
          id: "strategy_10",
          dimension: "ai",
          weight: 2,
          question: "How robust is your network of AI technology partners and academic collaborations?",
          options: [
            { text: "No formal partnerships - work alone", score: 0 },
            { text: "Vendor relationships but no real partnerships", score: 1 },
            { text: "2-3 key technology partnerships", score: 2 },
            { text: "Ecosystem of 5-10 active partnerships", score: 3 },
            { text: "Deep relationships with major AI players", score: 4 },
            { text: "Central node in AI innovation ecosystem", score: 5 }
          ]
        }
      ],
      
      // Data & Analytics questions
      "data": [
        {
          id: "data_1",
          dimension: "ai",
          weight: 2.5,
          question: "How comprehensively have you implemented AutoML platforms for streamlined model development?",
          options: [
            { text: "Still building models manually in Python/R", score: 0 },
            { text: "Aware of AutoML but haven't implemented", score: 1 },
            { text: "Testing AutoML for simple use cases", score: 2 },
            { text: "AutoML for 30-50% of modeling work", score: 3 },
            { text: "AutoML as primary approach, custom for complex only", score: 4 },
            { text: "End-to-end AutoML pipeline with human oversight", score: 5 }
          ]
        },
        {
          id: "data_2",
          dimension: "ai",
          weight: 2,
          question: "To what extent can clients interact with data through conversational interfaces?",
          options: [
            { text: "Static reports and dashboards only", score: 0 },
            { text: "Interactive dashboards but no natural language", score: 1 },
            { text: "Basic chatbot for simple queries", score: 2 },
            { text: "AI understands complex data questions", score: 3 },
            { text: "Conversational analytics with visual responses", score: 4 },
            { text: "AI data analyst having strategic conversations", score: 5 }
          ]
        },
        {
          id: "data_3",
          dimension: "operational",
          weight: 2.5,
          question: "How capable are your systems of processing and analyzing data in real-time with AI?",
          options: [
            { text: "Batch processing only - daily/weekly reports", score: 0 },
            { text: "Some near-real-time dashboards", score: 1 },
            { text: "Streaming data but limited real-time analysis", score: 2 },
            { text: "Real-time processing for key metrics", score: 3 },
            { text: "Full real-time AI analysis and alerts", score: 4 },
            { text: "Predictive real-time optimization", score: 5 }
          ]
        },
        {
          id: "data_4",
          dimension: "ai",
          weight: 2.5,
          question: "How much have AI tools improved your predictive analytics accuracy?",
          options: [
            { text: "No predictive analytics - just historical reporting", score: 0 },
            { text: "Basic trending but often wrong", score: 1 },
            { text: "10-20% more accurate than traditional methods", score: 2 },
            { text: "30-50% improvement in prediction accuracy", score: 3 },
            { text: "2-3x better predictions enabling new services", score: 4 },
            { text: "Industry-leading accuracy creating competitive advantage", score: 5 }
          ]
        },
        {
          id: "data_5",
          dimension: "operational",
          weight: 2.5,
          question: "How robust are your AI data quality, privacy, and governance frameworks?",
          options: [
            { text: "No formal frameworks - handle issues as they arise", score: 0 },
            { text: "Basic data quality checks and GDPR compliance", score: 1 },
            { text: "Documented policies but manual enforcement", score: 2 },
            { text: "Automated quality checks and privacy controls", score: 3 },
            { text: "AI-powered governance monitoring and enforcement", score: 4 },
            { text: "Industry-leading ethical AI framework", score: 5 }
          ]
        },
        {
          id: "data_6",
          dimension: "operational",
          weight: 2,
          question: "What percentage of your team combines traditional analytics skills with AI/ML expertise?",
          options: [
            { text: "0% - Separate traditional and AI teams", score: 0 },
            { text: "10-20% - Few cross-skilled individuals", score: 1 },
            { text: "30-40% - Growing hybrid skillset", score: 2 },
            { text: "50-60% - Majority have both skills", score: 3 },
            { text: "70-80% - Standard expectation", score: 4 },
            { text: "100% - All analysts are AI-enabled", score: 5 }
          ]
        },
        {
          id: "data_7",
          dimension: "ai",
          weight: 2,
          question: "To what degree do you build custom AI models vs. using off-the-shelf solutions?",
          options: [
            { text: "100% off-the-shelf - no custom development", score: 0 },
            { text: "90% packaged solutions with minor customization", score: 1 },
            { text: "70% off-the-shelf, 30% custom for specific needs", score: 2 },
            { text: "50/50 mix based on use case", score: 3 },
            { text: "Mostly custom models with some vendor tools", score: 4 },
            { text: "Proprietary AI models as core IP", score: 5 }
          ]
        },
        {
          id: "data_8",
          dimension: "operational",
          weight: 2,
          question: "How advanced are your AI-powered self-service analytics platforms for clients?",
          options: [
            { text: "No self-service - we run all reports for clients", score: 0 },
            { text: "Basic dashboards with filters", score: 1 },
            { text: "Drag-and-drop visualization tools", score: 2 },
            { text: "AI-guided exploration and insights", score: 3 },
            { text: "Automated insight generation and alerts", score: 4 },
            { text: "AI analyst available 24/7 for any question", score: 5 }
          ]
        },
        {
          id: "data_9",
          dimension: "ai",
          weight: 2,
          question: "How effectively do you evaluate and integrate new AI analytics technologies?",
          options: [
            { text: "Stick with proven tools - avoid new technology", score: 0 },
            { text: "Annual review of new tools", score: 1 },
            { text: "Quarterly evaluation process", score: 2 },
            { text: "Continuous testing with innovation budget", score: 3 },
            { text: "Rapid prototyping and deployment process", score: 4 },
            { text: "Co-developing next-gen AI analytics tools", score: 5 }
          ]
        },
        {
          id: "data_10",
          dimension: "financial",
          weight: 2.5,
          question: "How clearly can you demonstrate ROI and business value from AI analytics initiatives?",
          options: [
            { text: "Can't quantify value - clients must trust us", score: 0 },
            { text: "Anecdotal evidence and case studies", score: 1 },
            { text: "Basic before/after metrics", score: 2 },
            { text: "Clear ROI calculations for most projects", score: 3 },
            { text: "Sophisticated value measurement frameworks", score: 4 },
            { text: "Guaranteed ROI with performance-based pricing", score: 5 }
          ]
        }
      ],
      
      // Technical Development questions
      "tech": [
        {
          id: "tech_1",
          dimension: "ai",
          weight: 2.5,
          question: "What percentage of your developers actively use AI coding assistants (Copilot, Cursor)?",
          options: [
            { text: "0% - We code everything manually", score: 0 },
            { text: "10-20% - A few early adopters trying it out", score: 1 },
            { text: "30-40% - Growing adoption but not mandatory", score: 2 },
            { text: "50-60% - Encouraged but not required", score: 3 },
            { text: "70-80% - Standard tool in our stack", score: 4 },
            { text: "100% - Required with team licenses", score: 5 }
          ]
        },
        {
          id: "tech_2",
          dimension: "operational",
          weight: 2.5,
          question: "How much have AI tools improved your development speed while maintaining code quality?",
          options: [
            { text: "No improvement - skeptical of AI-generated code quality", score: 0 },
            { text: "10-20% faster but requires heavy review", score: 1 },
            { text: "30-40% faster with acceptable quality", score: 2 },
            { text: "50-60% faster with improved consistency", score: 3 },
            { text: "2x faster with better documentation", score: 4 },
            { text: "3x+ faster enabling new service models", score: 5 }
          ]
        },
        {
          id: "tech_3",
          dimension: "operational",
          weight: 2,
          question: "To what extent have you automated testing processes with AI-driven tools?",
          options: [
            { text: "Manual testing only - developers write all tests", score: 0 },
            { text: "Basic unit test automation", score: 1 },
            { text: "CI/CD with standard test suites", score: 2 },
            { text: "AI generates test cases for edge scenarios", score: 3 },
            { text: "AI-driven testing finds bugs humans miss", score: 4 },
            { text: "Fully autonomous testing and quality assurance", score: 5 }
          ]
        },
        {
          id: "tech_4",
          dimension: "operational",
          weight: 2.5,
          question: "How robust are your processes for reviewing and validating AI-generated code?",
          options: [
            { text: "No process - trust AI output or don't use it", score: 0 },
            { text: "Quick manual review like any code", score: 1 },
            { text: "Extra scrutiny for AI code but no formal process", score: 2 },
            { text: "Documented review checklist for AI code", score: 3 },
            { text: "Multi-stage review with security scanning", score: 4 },
            { text: "Automated validation plus expert review", score: 5 }
          ]
        },
        {
          id: "tech_5",
          dimension: "operational",
          weight: 2.5,
          question: "How well do you maintain human oversight for critical architecture and security decisions?",
          options: [
            { text: "Let AI make all decisions to maximize speed", score: 0 },
            { text: "Mostly AI-driven with occasional human checks", score: 1 },
            { text: "Humans review major decisions only", score: 2 },
            { text: "Clear boundaries on what AI can decide", score: 3 },
            { text: "Human architects guide all critical decisions", score: 4 },
            { text: "Perfect balance with AI enhancing human judgment", score: 5 }
          ]
        },
        {
          id: "tech_6",
          dimension: "ai",
          weight: 2,
          question: "How effectively do you leverage AI-enhanced low-code/no-code platforms?",
          options: [
            { text: "Avoid them - prefer traditional coding", score: 0 },
            { text: "Used for simple prototypes only", score: 1 },
            { text: "Some internal tools built with low-code", score: 2 },
            { text: "Client projects using low-code where appropriate", score: 3 },
            { text: "Significant portion of delivery via low-code", score: 4 },
            { text: "Low-code first approach with custom only when needed", score: 5 }
          ]
        },
        {
          id: "tech_7",
          dimension: "ai",
          weight: 2,
          question: "What percentage of developers are trained in prompt engineering and AI tool optimization?",
          options: [
            { text: "0% - Not seen as relevant skill", score: 0 },
            { text: "10-20% - Individual interest only", score: 1 },
            { text: "30-40% - Some informal knowledge sharing", score: 2 },
            { text: "50-60% - Regular training sessions", score: 3 },
            { text: "70-80% - Part of onboarding", score: 4 },
            { text: "100% - Core competency with certification", score: 5 }
          ]
        },
        {
          id: "tech_8",
          dimension: "financial",
          weight: 2.5,
          question: "How far have you shifted from hourly billing to value-based pricing for development work?",
          options: [
            { text: "Still 100% hourly/daily rates", score: 0 },
            { text: "Fixed price projects based on hour estimates", score: 1 },
            { text: "Some milestone-based pricing", score: 2 },
            { text: "Sprint-based pricing with defined outcomes", score: 3 },
            { text: "Value pricing for feature delivery", score: 4 },
            { text: "Pure outcome-based pricing models", score: 5 }
          ]
        },
        {
          id: "tech_9",
          dimension: "operational",
          weight: 2,
          question: "How sophisticated are your metrics for measuring AI impact on code quality and technical debt?",
          options: [
            { text: "No metrics - assume AI helps", score: 0 },
            { text: "Track velocity but not quality impact", score: 1 },
            { text: "Basic code quality metrics", score: 2 },
            { text: "Comprehensive quality and debt tracking", score: 3 },
            { text: "AI analyzes its own impact on codebase", score: 4 },
            { text: "Predictive models for technical debt", score: 5 }
          ]
        },
        {
          id: "tech_10",
          dimension: "ai",
          weight: 2.5,
          question: "To what extent do you offer AI implementation and strategy consulting to clients?",
          options: [
            { text: "Pure development shop - no consulting", score: 0 },
            { text: "Basic technical recommendations only", score: 1 },
            { text: "AI implementation advice when asked", score: 2 },
            { text: "Formal AI consulting as add-on service", score: 3 },
            { text: "Equal mix of AI consulting and development", score: 4 },
            { text: "AI strategy consulting is primary revenue driver", score: 5 }
          ]
        }
      ],
      
      // Commerce/eCommerce questions
      "commerce": [
        {
          id: "commerce_1",
          dimension: "ai",
          weight: 2.5,
          question: "How advanced are your AI-powered personalization capabilities across the commerce journey?",
          options: [
            { text: "Basic segmentation with manual rules", score: 0 },
            { text: "Some product recommendations based on history", score: 1 },
            { text: "AI recommendations but limited to product pages", score: 2 },
            { text: "Personalization across multiple touchpoints", score: 3 },
            { text: "Real-time 1:1 personalization at scale", score: 4 },
            { text: "Predictive personalization anticipating needs", score: 5 }
          ]
        },
        {
          id: "commerce_2",
          dimension: "ai",
          weight: 2.5,
          question: "To what extent do you use AI for marketplace SEO and advertising optimization?",
          options: [
            { text: "Manual keyword research and bid management", score: 0 },
            { text: "Basic automation within platform tools", score: 1 },
            { text: "Some AI tools for Amazon/Google Shopping", score: 2 },
            { text: "AI optimizing across multiple marketplaces", score: 3 },
            { text: "Proprietary AI for marketplace dominance", score: 4 },
            { text: "AI predicts and captures emerging search trends", score: 5 }
          ]
        },
        {
          id: "commerce_3",
          dimension: "ai",
          weight: 2.5,
          question: "How sophisticated are your AI-driven pricing and inventory optimization capabilities?",
          options: [
            { text: "Fixed pricing with manual inventory management", score: 0 },
            { text: "Rule-based pricing with basic stock alerts", score: 1 },
            { text: "Some dynamic pricing for key products", score: 2 },
            { text: "AI pricing optimization with demand forecasting", score: 3 },
            { text: "Real-time pricing responding to competition", score: 4 },
            { text: "Predictive AI maximizing margin and inventory turns", score: 5 }
          ]
        },
        {
          id: "commerce_4",
          dimension: "ai",
          weight: 2,
          question: "How well-integrated are AI chatbots and voice commerce in your solutions?",
          options: [
            { text: "No chatbots - prefer human customer service", score: 0 },
            { text: "Basic FAQ chatbot with limited functionality", score: 1 },
            { text: "AI chatbot handling simple inquiries", score: 2 },
            { text: "Conversational AI for full customer journey", score: 3 },
            { text: "Omnichannel AI including voice assistants", score: 4 },
            { text: "AI agents completing complex transactions", score: 5 }
          ]
        },
        {
          id: "commerce_5",
          dimension: "ai",
          weight: 2.5,
          question: "How effectively do you use AI for demand forecasting and customer behavior prediction?",
          options: [
            { text: "Historical sales data in spreadsheets", score: 0 },
            { text: "Basic trend analysis and seasonality", score: 1 },
            { text: "Some predictive models for top products", score: 2 },
            { text: "AI forecasting across product catalog", score: 3 },
            { text: "Multi-factor AI including external data", score: 4 },
            { text: "AI predicts individual customer lifetime value", score: 5 }
          ]
        },
        {
          id: "commerce_6",
          dimension: "ai",
          weight: 2,
          question: "How proficient is your team with AI features in major commerce platforms?",
          options: [
            { text: "Unaware of platform AI capabilities", score: 0 },
            { text: "Know they exist but don't use them", score: 1 },
            { text: "Use basic AI features occasionally", score: 2 },
            { text: "Leverage most available AI tools", score: 3 },
            { text: "Advanced users pushing platform limits", score: 4 },
            { text: "Beta testing and co-developing new AI features", score: 5 }
          ]
        },
        {
          id: "commerce_7",
          dimension: "ai",
          weight: 2,
          question: "To what degree have you integrated AI into social commerce strategies?",
          options: [
            { text: "No social commerce presence", score: 0 },
            { text: "Manual posting and community management", score: 1 },
            { text: "Some automated posting and responses", score: 2 },
            { text: "AI-driven content and influencer matching", score: 3 },
            { text: "Full AI social commerce optimization", score: 4 },
            { text: "AI creates shoppable experiences in real-time", score: 5 }
          ]
        },
        {
          id: "commerce_8",
          dimension: "ai",
          weight: 2.5,
          question: "How advanced are your AI-powered commerce attribution and ROI measurement capabilities?",
          options: [
            { text: "Last-click attribution in Google Analytics", score: 0 },
            { text: "Basic multi-touch attribution models", score: 1 },
            { text: "Platform-specific attribution tools", score: 2 },
            { text: "Cross-channel AI attribution modeling", score: 3 },
            { text: "AI predicts incremental revenue impact", score: 4 },
            { text: "Real-time ROI optimization across all activities", score: 5 }
          ]
        },
        {
          id: "commerce_9",
          dimension: "operational",
          weight: 2,
          question: "How well can you orchestrate AI-driven experiences across online and offline channels?",
          options: [
            { text: "Separate online and offline operations", score: 0 },
            { text: "Basic inventory visibility across channels", score: 1 },
            { text: "Some omnichannel features like BOPIS", score: 2 },
            { text: "AI coordinates consistent experiences", score: 3 },
            { text: "Unified AI brain across all touchpoints", score: 4 },
            { text: "Predictive AI seamlessly blends channels", score: 5 }
          ]
        },
        {
          id: "commerce_10",
          dimension: "ai",
          weight: 2,
          question: "How quickly do you implement new AI commerce technologies and capabilities?",
          options: [
            { text: "Wait years for proven ROI before adopting", score: 0 },
            { text: "Adopt after competitors prove it works", score: 1 },
            { text: "Test new tech within 6-12 months", score: 2 },
            { text: "Early adopter with pilot programs", score: 3 },
            { text: "Beta test with major platforms", score: 4 },
            { text: "Co-innovate and launch first", score: 5 }
          ]
        }
      ]
    }
  },
  
  // Enhanced scoring configuration with weighted system
  scoring: {
    dimensions: ["operational", "financial", "ai"],
    weights: {
      overall: {
        operational: 0.2,
        financial: 0.3,
        ai: 0.5
      },
      // Service-specific weights for calculating adjusted scores
      serviceSpecific: {
        operational: 0.25,
        financial: 0.35,
        ai: 0.4
      }
    },
    categories: [
      { min: 85, label: "Premium Acquisition Target", valuation: "8-12x EBITDA" },
      { min: 70, label: "Strong Acquisition Candidate", valuation: "6-8x EBITDA" },
      { min: 55, label: "Viable with Enhancements", valuation: "4-6x EBITDA" },
      { min: 40, label: "Significant Work Required", valuation: "2-4x EBITDA" },
      { min: 0, label: "Currently Unsuitable", valuation: "1-2x EBITDA" }
    ]
  },
  
  // Comprehensive AI disruption data
  disruption: [
    {
      "service": "Creative Services",
      "category_group": "Content & Creative",
      "disruption_likelihood": 8,
      "timeline": {
        "initial_impact_year": 2022,
        "significant_disruption_year": 2025,
        "mainstream_adoption_year": 2028
      },
      "value_impact": -1,
      "human_ai_model": "Predominantly augmentation. AI handles repetitive production tasks (resizing ads, generating concept art), allowing human creatives to focus on high-level art direction, storytelling, and refining AI outputs.",
      "ai_resilient_activities": "Ideation, creative strategy, emotional resonance, strategic branding, original concept development"
    },
    {
      "service": "Content Development",
      "category_group": "Content & Creative", 
      "disruption_likelihood": 9,
      "timeline": {
        "initial_impact_year": 2022,
        "significant_disruption_year": 2024,
        "mainstream_adoption_year": 2026
      },
      "value_impact": -3,
      "human_ai_model": "Human editor + AI writer is emerging as the model. AI generates first drafts of articles, ads, or scripts in seconds; human writers then refine tone, ensure brand alignment, fact-check and inject creativity or strategic angle.",
      "ai_resilient_activities": "Content strategy, brand storytelling, opinion pieces, creative campaigns requiring deep human insight"
    },
    {
      "service": "Digital Marketing",
      "category_group": "Marketing Services",
      "disruption_likelihood": 8,
      "timeline": {
        "initial_impact_year": 2021,
        "significant_disruption_year": 2024,
        "mainstream_adoption_year": 2026
      },
      "value_impact": -1,
      "human_ai_model": "AI as autopilot, human as strategist/overseer. Campaign managers configure AI-driven platforms (setting goals, budget, creative inputs) and then let the algorithms optimize in real time.",
      "ai_resilient_activities": "Strategic guidance, creative campaign concepts, cross-platform planning, brand safety monitoring"
    },
    {
      "service": "Media Services",
      "category_group": "Media Services",
      "disruption_likelihood": 10,
      "timeline": {
        "initial_impact_year": 2018,
        "significant_disruption_year": 2023,
        "mainstream_adoption_year": 2025
      },
      "value_impact": -4,
      "human_ai_model": "This is a case where AI is moving from co-pilot to autopilot. AI handles the execution – optimizing bids, placements, and targeting in real-time, far outperforming what teams of humans did manually.",
      "ai_resilient_activities": "Media strategy, brand safety oversight, innovative sponsorships, experiential media, analytics interpretation"
    },
    {
      "service": "PR & Communications", 
      "category_group": "Communications Services",
      "disruption_likelihood": 5,
      "timeline": {
        "initial_impact_year": 2024,
        "significant_disruption_year": 2026,
        "mainstream_adoption_year": 2028
      },
      "value_impact": 0,
      "human_ai_model": "AI as an assistant, human as the strategist and relationship manager. AI serves as a research and drafting aide: it can compile briefing books on journalists, suggest the best angles, or draft content for the team to refine.",
      "ai_resilient_activities": "Media relationships, crisis management, strategic counsel, narrative crafting, reputation management"
    },
    {
      "service": "Strategy & Consulting",
      "category_group": "Advisory Services",
      "disruption_likelihood": 3,
      "timeline": {
        "initial_impact_year": 2024,
        "significant_disruption_year": 2027,
        "mainstream_adoption_year": 2030
      },
      "value_impact": 3,
      "human_ai_model": "AI as an analyst, human as the advisor. This paradigm sees AI performing labor-intensive analytical tasks – data gathering, quantitative analysis, even drafting initial strategy options – and humans focusing on sense-making, client interaction, and creative problem-solving.",
      "ai_resilient_activities": "Strategic thinking, client relationship management, creative problem-solving, stakeholder management, leadership inspiration"
    },
    {
      "service": "Data & Analytics",
      "category_group": "Analytical Services",
      "disruption_likelihood": 7,
      "timeline": {
        "initial_impact_year": 2020,
        "significant_disruption_year": 2024,
        "mainstream_adoption_year": 2025
      },
      "value_impact": 4,
      "human_ai_model": "AI as the data analyst, human as the data interpreter/strategist. AI handles data processing – cleaning data, running statistical analyses, producing visualizations and initial insights.",
      "ai_resilient_activities": "Insights generation, strategic data interpretation, identifying causal relationships, translating data to business implications"
    },
    {
      "service": "Technical Development",
      "category_group": "Technical Services",
      "disruption_likelihood": 6,
      "timeline": {
        "initial_impact_year": 2022,
        "significant_disruption_year": 2025,
        "mainstream_adoption_year": 2027
      },
      "value_impact": 2,
      "human_ai_model": "AI as the junior developer, human as the lead engineer. AI can generate code snippets, suggest fixes, translate requirements into outline code, and even identify bugs/security issues.",
      "ai_resilient_activities": "System architecture, complex integration, security oversight, UX design, novel solution development"
    },
    {
      "service": "Commerce/eCommerce",
      "category_group": "Technical Services",
      "disruption_likelihood": 7,
      "timeline": {
        "initial_impact_year": 2023,
        "significant_disruption_year": 2025,
        "mainstream_adoption_year": 2027
      },
      "value_impact": 1,
      "human_ai_model": "AI as optimization engine, human as strategic architect. AI handles personalization, pricing optimization, and predictive analytics while humans focus on customer experience strategy and business model innovation.",
      "ai_resilient_activities": "Customer journey design, brand experience strategy, complex integration planning, business model innovation"
    }
  ],
  
  // Simplified recommendations pointing to external detailed recommendations
  recommendations: {
    // Service-specific recommendations are now in external file
    serviceSpecific: {
      enabled: true,
      source: 'agency-recommendations-config.js',
      getMessage: function(serviceId, score) {
        const level = score < 40 ? 'lowScore' : score < 70 ? 'midScore' : 'highScore';
        return `See detailed ${level} recommendations for ${serviceId} in recommendations guide`;
      }
    },
    
    // High-level agency type recommendations remain here
    agency_types: [
      {
        "type": "Creative Agencies",
        "current_vulnerability": "High",
        "key_message": "AI is transforming creative production - embrace it while maintaining human creativity",
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
    ]
  },
  
  // Simplified action plans - detailed ones in recommendations file
  actionPlans: {
    description: "For detailed, service-specific action plans with tools, timelines, and ROI projections, refer to the comprehensive recommendations guide based on your individual service scores.",
    
    generalGuidance: {
      highScore: "Focus on optimization, market leadership, and potentially acquiring struggling competitors",
      midScore: "Accelerate AI adoption, develop new service offerings, and build competitive differentiation",
      lowScore: "Urgent action required - implement basic AI tools, restructure pricing, and transform service delivery"
    }
  },
  
  // Results display configuration
  resultsConfig: {
    displayOptions: {
      showOverallScore: true,
      showDimensionScores: true,
      showServiceScores: true,
      showServiceRecommendations: true,
      showDisruptionWarnings: true,
      recommendationsSource: 'ServiceRecommendations'
    },
    
    integrationInstructions: {
      recommendationsFile: {
        required: true,
        path: './agency-recommendations-config.js',
        usage: `
          // Example integration:
          import { ServiceRecommendations } from './agency-recommendations-config.js';
          
          // Get recommendations for a service based on score
          const getServiceRecommendations = (serviceId, score) => {
            const level = score < 40 ? 'lowScore' : score < 70 ? 'midScore' : 'highScore';
            return ServiceRecommendations.services[serviceId][level];
          };
        `
      }
    }
  }
};

// Export to global namespace for framework compatibility
window.AssessmentConfig = ComprehensiveAgencyAssessmentConfig;
window.AgencyAssessmentConfig = ComprehensiveAgencyAssessmentConfig; // Backward compatibility

// Note: The detailed recommendations previously in 'recommendations' and 'actionPlans' 
// sections are now in the separate agency-recommendations-config.js file for better 
// maintainability and more comprehensive guidance.