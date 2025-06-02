/**
 * Enhanced In-House Marketing Questions
 * Version 3.0 - Co-Creation & Transformation Focus
 * 
 * Structure:
 * - 20 Core organisational/human/co-creation questions
 * - 5 Questions per marketing activity
 * - Proper weightings for transformation readiness
 * - Market benchmarking data integrated
 */

const InHouseMarketingAssessment = {
  id: "inhouse-marketing-v3",
  title: "AI Marketing Readiness Assessment",
  description: "Discover how prepared your marketing team is for AI transformation",
  
  // Market benchmarking data (from research)
  marketBenchmarks: {
    aiAdoption: {
      2023: { small: 23, medium: 55, large: 78 },
      2024: { small: 40, medium: 71, large: 86 }
    },
    timesSaved: {
      content: { avg: 70, top: 85 },
      email: { avg: 50, top: 75 },
      social: { avg: 60, top: 80 },
      analytics: { avg: 40, top: 65 }
    },
    toolAdoption: {
      contentAI: 56,
      emailAI: 35,
      analyticsAI: 42,
      creativeAI: 52
    }
  },
  
  // Core Questions - 20 total focusing on human/organisational readiness
  coreQuestions: [
    // Champions & Culture (5 questions)
    {
      id: "champion_identification",
      category: "champions",
      question: "Is there someone on your team who gets excited about trying new marketing tools?",
      weight: 4,
      options: [
        { value: 0, label: "No one really - we stick to what we know" },
        { value: 2, label: "Maybe one person, but they keep it to themselves" },
        { value: 3, label: "Yes, and they occasionally share discoveries" },
        { value: 4, label: "Yes, they're always showing us new things" },
        { value: 5, label: "Multiple people compete to find cool new tools" }
      ],
      insight: "Having an AI champion is the #1 predictor of successful transformation"
    },
    {
      id: "knowledge_sharing",
      category: "champions",
      question: "When someone learns something new, what typically happens?",
      weight: 3,
      options: [
        { value: 0, label: "They use it quietly on their own" },
        { value: 2, label: "They might mention it in passing" },
        { value: 3, label: "They share with their immediate teammates" },
        { value: 4, label: "We have informal knowledge sharing sessions" },
        { value: 5, label: "We document and train everyone systematically" }
      ]
    },
    {
      id: "experimentation_culture",
      category: "champions",
      question: "What happens when someone tries a new approach and it doesn't work perfectly?",
      weight: 3.5,
      options: [
        { value: 0, label: "They get criticized - we can't afford mistakes" },
        { value: 1, label: "Nothing said, but you can feel the disappointment" },
        { value: 3, label: "It's okay as long as it doesn't happen often" },
        { value: 4, label: "We discuss what we learned from it" },
        { value: 5, label: "It's celebrated as learning - fail fast, learn faster" }
      ]
    },
    {
      id: "tool_discovery",
      category: "champions",
      question: "How does your team typically find out about new marketing tools?",
      weight: 2,
      options: [
        { value: 1, label: "Usually when a vendor contacts us" },
        { value: 2, label: "When competitors start using something" },
        { value: 3, label: "Through industry newsletters or events" },
        { value: 4, label: "Team members actively research and share" },
        { value: 5, label: "We have a process for continuous tool discovery" }
      ]
    },
    {
      id: "change_adoption",
      category: "champions",
      question: "Think about the last time you introduced a new tool or process. How did it go?",
      weight: 3,
      options: [
        { value: 0, label: "Poorly - people resisted and we gave up" },
        { value: 1, label: "Very slowly with lots of grumbling" },
        { value: 2, label: "Eventually adopted but took months" },
        { value: 3, label: "Reasonable adoption with some training" },
        { value: 4, label: "Smooth - people were eager to learn" },
        { value: 5, label: "Fast adoption - we're good at change" }
      ]
    },
    
    // Resources & Reality (5 questions)
    {
      id: "time_availability",
      category: "resources",
      question: "If we said 'spend 2 hours this week learning AI tools', what would happen?",
      weight: 3.5,
      options: [
        { value: 0, label: "Impossible - we're drowning in work" },
        { value: 1, label: "Maybe one person could find time" },
        { value: 2, label: "We'd have to drop something else" },
        { value: 3, label: "We could make it work with planning" },
        { value: 4, label: "No problem - we protect time for learning" },
        { value: 5, label: "We already dedicate time to skill development" }
      ]
    },
    {
      id: "budget_flexibility",
      category: "resources",
      question: "If an AI tool could save 10 hours/week but cost £200/month, what would happen?",
      weight: 3,
      options: [
        { value: 0, label: "No chance - zero budget flexibility" },
        { value: 1, label: "Would need months of approval process" },
        { value: 2, label: "Could maybe squeeze £50/month" },
        { value: 3, label: "Would need to prove ROI first in free trial" },
        { value: 4, label: "Could do it if we showed clear time savings" },
        { value: 5, label: "Easy decision - we invest in efficiency" }
      ],
      benchmark: "62% of similar teams now allocate £200-500/month for AI tools"
    },
    {
      id: "current_pain",
      category: "resources",
      question: "What's your team's biggest frustration right now?",
      weight: 2.5,
      options: [
        { value: 3, label: "Too much work, not enough people" },
        { value: 3, label: "Repetitive tasks eating creative time" },
        { value: 4, label: "Can't produce content fast enough" },
        { value: 4, label: "Drowning in data but no insights" },
        { value: 2, label: "Everything takes too many approvals" },
        { value: 3, label: "Quality inconsistency across outputs" }
      ]
    },
    {
      id: "tech_complexity",
      category: "resources",
      question: "How many different marketing tools does your team use regularly?",
      weight: 2,
      options: [
        { value: 4, label: "Just basics - email, docs, maybe one other" },
        { value: 3, label: "5-10 tools - manageable set" },
        { value: 2, label: "10-20 tools - bit overwhelming" },
        { value: 1, label: "20+ tools - total chaos" },
        { value: 0, label: "So many we've lost count" }
      ],
      insight: "Teams with 5-15 tools adopt AI fastest"
    },
    {
      id: "capacity_reality",
      category: "resources",
      question: "Honestly, how much of your week is reactive vs. planned work?",
      weight: 2.5,
      options: [
        { value: 0, label: "90%+ reactive - always fighting fires" },
        { value: 1, label: "70% reactive - some planning" },
        { value: 2, label: "50/50 - balanced but stretched" },
        { value: 3, label: "30% reactive - mostly planned" },
        { value: 4, label: "10% reactive - well organised" },
        { value: 5, label: "Proactive - we control our time" }
      ]
    },
    
    // Leadership & Decision Making (5 questions)
    {
      id: "leadership_ai_attitude",
      category: "leadership",
      question: "What's your leadership's real attitude toward AI?",
      weight: 4,
      options: [
        { value: 0, label: "Skeptical - 'just another tech fad'" },
        { value: 1, label: "Nervous - worried about risks" },
        { value: 2, label: "Curious but cautious" },
        { value: 3, label: "Supportive if we show ROI" },
        { value: 4, label: "Actively pushing us to use AI" },
        { value: 5, label: "Leading by example with AI" }
      ],
      benchmark: "73% of leaders now actively encourage AI adoption"
    },
    {
      id: "decision_speed",
      category: "leadership",
      question: "How long would it take to get approval for a new AI tool?",
      weight: 3,
      options: [
        { value: 0, label: "Months of committees and papers" },
        { value: 1, label: "6-8 weeks typical" },
        { value: 2, label: "2-4 weeks with good case" },
        { value: 3, label: "1-2 weeks for small investments" },
        { value: 4, label: "Days if it makes sense" },
        { value: 5, label: "Team empowered to decide" }
      ]
    },
    {
      id: "success_metrics",
      category: "leadership",
      question: "What metrics actually matter to your leadership?",
      weight: 3,
      options: [
        { value: 2, label: "Just don't overspend budget" },
        { value: 3, label: "Volume - more content, more campaigns" },
        { value: 4, label: "Quality - better engagement rates" },
        { value: 4, label: "Efficiency - doing more with less" },
        { value: 5, label: "Revenue impact and ROI" },
        { value: 5, label: "Innovation and competitive edge" }
      ]
    },
    {
      id: "transformation_ownership",
      category: "leadership",
      question: "If you implemented AI across marketing, who would own it?",
      weight: 3.5,
      options: [
        { value: 0, label: "No one - it would be chaos" },
        { value: 1, label: "Probably dumped on IT" },
        { value: 2, label: "Whoever suggested it (reluctantly)" },
        { value: 3, label: "Marketing ops or similar role" },
        { value: 4, label: "Clear owner who wants it" },
        { value: 5, label: "Shared ownership with executive sponsor" }
      ]
    },
    {
      id: "risk_tolerance",
      category: "leadership",
      question: "What's the real attitude toward trying new things that might fail?",
      weight: 3,
      options: [
        { value: 0, label: "Failure is not an option here" },
        { value: 1, label: "Okay if no one notices" },
        { value: 2, label: "Small failures tolerated quietly" },
        { value: 3, label: "Calculated risks are fine" },
        { value: 4, label: "Fail fast, learn faster mentality" },
        { value: 5, label: "Innovation requires experimentation" }
      ]
    },
    
    // Practical Readiness (5 questions)
    {
      id: "current_ai_usage",
      category: "readiness",
      question: "Be honest - is anyone already using AI tools like ChatGPT for work?",
      weight: 3,
      options: [
        { value: 1, label: "No, and we've told people not to" },
        { value: 2, label: "Don't think so, but haven't asked" },
        { value: 3, label: "Probably - people do their own thing" },
        { value: 4, label: "Yes, some are experimenting" },
        { value: 5, label: "Yes, with guidelines in place" },
        { value: 5, label: "Yes, it's encouraged and supported" }
      ],
      benchmark: "87% of marketing teams have at least one person using AI tools"
    },
    {
      id: "process_documentation",
      category: "readiness",
      question: "How well documented are your current marketing processes?",
      weight: 2.5,
      options: [
        { value: 0, label: "What documentation?" },
        { value: 1, label: "It's all in people's heads" },
        { value: 2, label: "Some key things written down" },
        { value: 3, label: "Most processes documented somewhere" },
        { value: 4, label: "Well documented and maintained" },
        { value: 5, label: "Living playbooks everyone uses" }
      ],
      insight: "Well-documented teams adopt AI 3x faster"
    },
    {
      id: "data_organization",
      category: "readiness",
      question: "How organized is your marketing data and content?",
      weight: 2.5,
      options: [
        { value: 0, label: "Complete chaos across drives and tools" },
        { value: 1, label: "I know where MY stuff is" },
        { value: 2, label: "Sort of organized by person" },
        { value: 3, label: "Decent folder structure exists" },
        { value: 4, label: "Well organized and searchable" },
        { value: 5, label: "Tagged, indexed, and accessible" }
      ]
    },
    {
      id: "quality_control",
      category: "readiness",
      question: "How do you ensure quality and brand consistency now?",
      weight: 3,
      options: [
        { value: 1, label: "Hope for the best" },
        { value: 2, label: "Manager reviews everything" },
        { value: 3, label: "Peer reviews when time allows" },
        { value: 4, label: "Clear process with checklists" },
        { value: 5, label: "Templates, guides, and reviews" },
        { value: 5, label: "Systematic QA process" }
      ]
    },
    {
      id: "measurement_culture",
      category: "readiness",
      question: "How do you measure if something worked?",
      weight: 2,
      options: [
        { value: 0, label: "We don't really measure" },
        { value: 1, label: "Basic metrics when asked" },
        { value: 2, label: "Regular reports on activity" },
        { value: 3, label: "Track engagement and conversions" },
        { value: 4, label: "Detailed analytics and insights" },
        { value: 5, label: "Continuous optimization culture" }
      ]
    }
  ],
  
  // Activity-Specific Questions (5 per activity)
  activityQuestions: {
    content_marketing: [
      {
        id: "content_volume_struggle",
        question: "How do you feel about your content output volume?",
        weight: 2.5,
        options: [
          { value: 0, label: "We're way behind - can't keep up with demand" },
          { value: 2, label: "Always playing catch-up" },
          { value: 3, label: "Managing but it's stressful" },
          { value: 4, label: "Good volume but quality varies" },
          { value: 5, label: "Happy with volume and quality" }
        ],
        benchmark: "Teams using AI produce 3.5x more content"
      },
      {
        id: "content_time_breakdown",
        question: "Where does most time go in content creation?",
        weight: 2,
        options: [
          { value: 1, label: "Research and figuring out what to write" },
          { value: 2, label: "Writing the first draft" },
          { value: 2, label: "Endless editing rounds" },
          { value: 3, label: "Getting approvals" },
          { value: 4, label: "Formatting and publishing" }
        ]
      },
      {
        id: "content_repurposing",
        question: "How much do you repurpose content across channels?",
        weight: 2,
        options: [
          { value: 0, label: "Never - everything created fresh" },
          { value: 1, label: "Occasionally when we remember" },
          { value: 2, label: "Try to but it's manual work" },
          { value: 3, label: "Regular repurposing process" },
          { value: 4, label: "Systematic multi-channel approach" }
        ]
      },
      {
        id: "content_ideation",
        question: "How do you come up with content ideas?",
        weight: 1.5,
        options: [
          { value: 1, label: "Struggle every month for ideas" },
          { value: 2, label: "Reactive to requests and trends" },
          { value: 3, label: "Basic content calendar planning" },
          { value: 4, label: "Data-driven topic selection" },
          { value: 5, label: "Strategic content pipeline" }
        ]
      },
      {
        id: "content_ai_openness",
        question: "How do you feel about AI writing assistance?",
        weight: 3,
        options: [
          { value: 0, label: "Worried it will replace writers" },
          { value: 1, label: "Skeptical about quality" },
          { value: 3, label: "Curious but unsure how to start" },
          { value: 4, label: "Excited about the possibilities" },
          { value: 5, label: "Already experimenting with it" }
        ]
      }
    ],
    
    social_media: [
      {
        id: "social_overwhelm",
        question: "How manageable is your social media workload?",
        weight: 2.5,
        options: [
          { value: 0, label: "Drowning - can't keep up with all platforms" },
          { value: 1, label: "Constantly stressed about posting" },
          { value: 2, label: "Managing but no time for engagement" },
          { value: 3, label: "Okay but wish we could do more" },
          { value: 4, label: "Comfortable with current approach" }
        ]
      },
      {
        id: "social_time_spent",
        question: "How much time does social media take weekly?",
        weight: 2,
        options: [
          { value: 1, label: "20+ hours - it's a full-time job" },
          { value: 2, label: "15-20 hours - major time sink" },
          { value: 3, label: "10-15 hours - significant chunk" },
          { value: 4, label: "5-10 hours - manageable" },
          { value: 5, label: "Under 5 hours - well optimized" }
        ],
        benchmark: "AI users spend 60% less time on social media management"
      },
      {
        id: "social_content_creation",
        question: "How do you create social media visuals?",
        weight: 2,
        options: [
          { value: 0, label: "Struggle with every post" },
          { value: 1, label: "Basic templates when we can" },
          { value: 2, label: "Designer creates when available" },
          { value: 3, label: "Mix of templates and custom" },
          { value: 4, label: "Efficient design process" }
        ]
      },
      {
        id: "social_scheduling",
        question: "How do you handle posting schedules?",
        weight: 1.5,
        options: [
          { value: 0, label: "Manual posting when we remember" },
          { value: 1, label: "Basic scheduling tool" },
          { value: 2, label: "Schedule week by week" },
          { value: 3, label: "Month planned in advance" },
          { value: 4, label: "Automated with optimization" }
        ]
      },
      {
        id: "social_performance",
        question: "How well can you track what works on social?",
        weight: 2,
        options: [
          { value: 0, label: "No idea what resonates" },
          { value: 1, label: "Basic likes and comments" },
          { value: 2, label: "Platform analytics only" },
          { value: 3, label: "Track engagement patterns" },
          { value: 4, label: "Detailed performance insights" }
        ]
      }
    ],
    
    email_marketing: [
      {
        id: "email_personalization",
        question: "How personalized are your email campaigns?",
        weight: 2.5,
        options: [
          { value: 0, label: "Same message to everyone" },
          { value: 1, label: "Basic name personalization" },
          { value: 2, label: "Some segmentation by list" },
          { value: 3, label: "Behavior-based segments" },
          { value: 4, label: "Dynamic content per recipient" }
        ],
        benchmark: "AI-powered emails see 41% higher click rates"
      },
      {
        id: "email_writing_time",
        question: "How long does it take to write a marketing email?",
        weight: 2,
        options: [
          { value: 0, label: "Hours - agonize over every word" },
          { value: 1, label: "2-3 hours typically" },
          { value: 2, label: "1-2 hours with templates" },
          { value: 3, label: "30-60 minutes" },
          { value: 4, label: "Under 30 minutes" }
        ]
      },
      {
        id: "email_subject_lines",
        question: "How do you create subject lines?",
        weight: 2,
        options: [
          { value: 0, label: "Last-minute guess" },
          { value: 1, label: "One option and hope" },
          { value: 2, label: "Try 2-3 variants" },
          { value: 3, label: "A/B test regularly" },
          { value: 4, label: "Data-driven optimization" }
        ]
      },
      {
        id: "email_automation",
        question: "How automated are your email workflows?",
        weight: 2,
        options: [
          { value: 0, label: "Everything manual" },
          { value: 1, label: "Basic welcome email" },
          { value: 2, label: "Few simple automations" },
          { value: 3, label: "Key journeys automated" },
          { value: 4, label: "Sophisticated automation" }
        ]
      },
      {
        id: "email_performance_analysis",
        question: "How do you improve email performance?",
        weight: 1.5,
        options: [
          { value: 0, label: "We don't really analyze" },
          { value: 1, label: "Check opens sometimes" },
          { value: 2, label: "Review basic metrics" },
          { value: 3, label: "Test and iterate" },
          { value: 4, label: "Continuous optimization" }
        ]
      }
    ],
    
    seo_sem: [
      {
        id: "seo_keyword_research",
        question: "How do you approach keyword research?",
        weight: 2.5,
        options: [
          { value: 0, label: "Guess what people search" },
          { value: 1, label: "Basic Google searches" },
          { value: 2, label: "Free tools occasionally" },
          { value: 3, label: "Regular keyword analysis" },
          { value: 4, label: "Sophisticated SEO strategy" }
        ]
      },
      {
        id: "seo_content_optimization",
        question: "How do you optimize content for search?",
        weight: 2,
        options: [
          { value: 0, label: "Hope Google finds it" },
          { value: 1, label: "Add keywords when remember" },
          { value: 2, label: "Basic on-page SEO" },
          { value: 3, label: "Follow SEO checklist" },
          { value: 4, label: "Comprehensive optimization" }
        ]
      },
      {
        id: "ppc_management",
        question: "If you run paid search, how manageable is it?",
        weight: 2,
        options: [
          { value: 0, label: "Set and forget" },
          { value: 1, label: "Check occasionally" },
          { value: 2, label: "Weekly adjustments" },
          { value: 3, label: "Regular optimization" },
          { value: 4, label: "Continuous management" },
          { value: -1, label: "We don't run paid search" }
        ]
      },
      {
        id: "search_competition",
        question: "How well do you track competitor search strategies?",
        weight: 1.5,
        options: [
          { value: 0, label: "Don't track at all" },
          { value: 1, label: "Notice if we see their ads" },
          { value: 2, label: "Occasional checks" },
          { value: 3, label: "Regular monitoring" },
          { value: 4, label: "Detailed competitive analysis" }
        ]
      },
      {
        id: "search_performance",
        question: "How clear is your search ROI?",
        weight: 2,
        options: [
          { value: 0, label: "No idea if it works" },
          { value: 1, label: "Track traffic only" },
          { value: 2, label: "Basic conversion tracking" },
          { value: 3, label: "Clear ROI metrics" },
          { value: 4, label: "Advanced attribution" }
        ]
      }
    ],
    
    analytics_data: [
      {
        id: "data_collection",
        question: "How organized is your marketing data?",
        weight: 2.5,
        options: [
          { value: 0, label: "Scattered across platforms" },
          { value: 1, label: "Each tool has its own data" },
          { value: 2, label: "Some central spreadsheets" },
          { value: 3, label: "Dashboard pulls key metrics" },
          { value: 4, label: "Unified data system" }
        ]
      },
      {
        id: "reporting_time",
        question: "How long does monthly reporting take?",
        weight: 2.5,
        options: [
          { value: 0, label: "Days of painful spreadsheet work" },
          { value: 1, label: "Full day minimum" },
          { value: 2, label: "Half day with templates" },
          { value: 3, label: "Few hours" },
          { value: 4, label: "Under an hour - automated" }
        ],
        benchmark: "AI-powered reporting saves 85% of time"
      },
      {
        id: "insight_generation",
        question: "How often do you find actionable insights in your data?",
        weight: 2,
        options: [
          { value: 0, label: "Data dump with no insights" },
          { value: 1, label: "Rarely spot patterns" },
          { value: 2, label: "Sometimes find useful things" },
          { value: 3, label: "Regular insights emerge" },
          { value: 4, label: "Data drives all decisions" }
        ]
      },
      {
        id: "predictive_capability",
        question: "Can you predict what will work before launching?",
        weight: 2,
        options: [
          { value: 0, label: "Pure guesswork" },
          { value: 1, label: "Gut feeling based on experience" },
          { value: 2, label: "Some historical patterns help" },
          { value: 3, label: "Good success prediction" },
          { value: 4, label: "Data models guide decisions" }
        ]
      },
      {
        id: "dashboard_usefulness",
        question: "How useful are your current dashboards?",
        weight: 1.5,
        options: [
          { value: 0, label: "What dashboards?" },
          { value: 1, label: "Exist but rarely used" },
          { value: 2, label: "Check them sometimes" },
          { value: 3, label: "Regular reference point" },
          { value: 4, label: "Drive daily decisions" }
        ]
      }
    ],
    
    paid_advertising: [
      {
        id: "ad_creative_production",
        question: "How do you create ad variations?",
        weight: 2.5,
        options: [
          { value: 0, label: "One ad and pray" },
          { value: 1, label: "Few variations manually" },
          { value: 2, label: "Designer creates options" },
          { value: 3, label: "Test multiple variants" },
          { value: 4, label: "Dynamic creative optimization" }
        ]
      },
      {
        id: "campaign_optimization",
        question: "How do you optimize campaigns?",
        weight: 2.5,
        options: [
          { value: 0, label: "Set and forget" },
          { value: 1, label: "Check when remember" },
          { value: 2, label: "Weekly reviews" },
          { value: 3, label: "Regular optimization" },
          { value: 4, label: "AI-powered optimization" }
        ]
      },
      {
        id: "audience_targeting",
        question: "How sophisticated is your targeting?",
        weight: 2,
        options: [
          { value: 0, label: "Basic demographics only" },
          { value: 1, label: "Some interest targeting" },
          { value: 2, label: "Detailed audience segments" },
          { value: 3, label: "Behavioral targeting" },
          { value: 4, label: "AI-powered audiences" }
        ]
      },
      {
        id: "creative_testing",
        question: "How do you test what works?",
        weight: 2,
        options: [
          { value: 0, label: "Don't really test" },
          { value: 1, label: "Change things randomly" },
          { value: 2, label: "Basic A/B tests" },
          { value: 3, label: "Systematic testing" },
          { value: 4, label: "Multivariate with AI" }
        ]
      },
      {
        id: "cross_platform",
        question: "How well do you manage across ad platforms?",
        weight: 1.5,
        options: [
          { value: 0, label: "Each platform is separate chaos" },
          { value: 1, label: "Manually check each one" },
          { value: 2, label: "Some coordination" },
          { value: 3, label: "Unified strategy" },
          { value: 4, label: "Integrated optimization" }
        ]
      }
    ],
    
    creative_design: [
      {
        id: "design_bottleneck",
        question: "How often is design a bottleneck?",
        weight: 2.5,
        options: [
          { value: 0, label: "Always - everything waits for design" },
          { value: 1, label: "Frequently causes delays" },
          { value: 2, label: "Sometimes slows things down" },
          { value: 3, label: "Rarely an issue" },
          { value: 4, label: "Never - very efficient" }
        ]
      },
      {
        id: "design_requests",
        question: "How do you handle design requests?",
        weight: 2,
        options: [
          { value: 0, label: "Chaos - no system" },
          { value: 1, label: "Email and hope" },
          { value: 2, label: "Basic request process" },
          { value: 3, label: "Organized queue system" },
          { value: 4, label: "Self-service templates" }
        ]
      },
      {
        id: "visual_consistency",
        question: "How consistent is your visual brand?",
        weight: 2,
        options: [
          { value: 0, label: "All over the place" },
          { value: 1, label: "Try but often varies" },
          { value: 2, label: "Mostly consistent" },
          { value: 3, label: "Strong guidelines followed" },
          { value: 4, label: "Perfect brand consistency" }
        ]
      },
      {
        id: "design_tools",
        question: "What design tools does your team use?",
        weight: 1.5,
        options: [
          { value: 0, label: "PowerPoint and prayers" },
          { value: 1, label: "Basic free tools" },
          { value: 2, label: "Mix of tools" },
          { value: 3, label: "Professional tools" },
          { value: 4, label: "Advanced design stack" }
        ]
      },
      {
        id: "design_ai_interest",
        question: "How interested are you in AI design tools?",
        weight: 3,
        options: [
          { value: 0, label: "Worried about quality" },
          { value: 1, label: "Skeptical but curious" },
          { value: 3, label: "Very interested" },
          { value: 4, label: "Already experimenting" },
          { value: 5, label: "Using AI design daily" }
        ]
      }
    ],
    
    marketing_automation: [
      {
        id: "automation_maturity",
        question: "How automated are your marketing workflows?",
        weight: 3,
        options: [
          { value: 0, label: "Everything is manual" },
          { value: 1, label: "Very basic automation" },
          { value: 2, label: "Key workflows automated" },
          { value: 3, label: "Most processes automated" },
          { value: 4, label: "Sophisticated automation" }
        ]
      },
      {
        id: "lead_nurturing",
        question: "How do you nurture leads?",
        weight: 2.5,
        options: [
          { value: 0, label: "We don't really" },
          { value: 1, label: "Occasional manual emails" },
          { value: 2, label: "Basic drip campaign" },
          { value: 3, label: "Segmented nurture flows" },
          { value: 4, label: "AI-powered nurturing" }
        ]
      },
      {
        id: "personalization_level",
        question: "How personalized are your automated messages?",
        weight: 2,
        options: [
          { value: 0, label: "Same for everyone" },
          { value: 1, label: "Name only" },
          { value: 2, label: "Basic segments" },
          { value: 3, label: "Behavior-based" },
          { value: 4, label: "Individual level" }
        ]
      },
      {
        id: "workflow_complexity",
        question: "How complex can your workflows get?",
        weight: 1.5,
        options: [
          { value: 0, label: "Linear only" },
          { value: 1, label: "Simple branches" },
          { value: 2, label: "Multiple paths" },
          { value: 3, label: "Complex logic" },
          { value: 4, label: "AI-driven flows" }
        ]
      },
      {
        id: "automation_roi",
        question: "Can you measure automation impact?",
        weight: 2,
        options: [
          { value: 0, label: "No idea" },
          { value: 1, label: "Assume it helps" },
          { value: 2, label: "Some metrics" },
          { value: 3, label: "Clear ROI" },
          { value: 4, label: "Detailed attribution" }
        ]
      }
    ]
  },
  
  // Scoring weights for dimensions
  scoringDimensions: {
    humanReadiness: {
      weight: 0.4,
      categories: ["champions", "leadership", "resources"]
    },
    technicalReadiness: {
      weight: 0.3,
      categories: ["readiness"]
    },
    activityAutomation: {
      weight: 0.3,
      activities: "selected" // Uses activities they actually do
    }
  },
  
  // Company size modifiers
  sizeModifiers: {
    solo: {
      timeValue: 50, // £/hour value of time
      focusAreas: ["efficiency", "quick_wins"],
      budgetRange: "0-100"
    },
    small: {
      timeValue: 150, // Team of 3 at £50/hour
      focusAreas: ["collaboration", "scalability"],
      budgetRange: "100-500"
    },
    medium: {
      timeValue: 400, // Team of 8 at £50/hour
      focusAreas: ["transformation", "competitive_advantage"],
      budgetRange: "500-2000"
    }
  }
};