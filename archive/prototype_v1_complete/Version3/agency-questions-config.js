/**
 * Agency Transformation Assessment - Questions Configuration
 * 
 * Positive framing that captures both readiness and valuation data
 * 20 core questions + 5 per service line
 */

export const AgencyQuestionsConfig = {
  // Assessment metadata
  metadata: {
    version: "2.0",
    type: "agency-transformation",
    title: "Agency AI Transformation Readiness Assessment",
    description: "Discover your agency's readiness for AI transformation and unlock hidden valuation potential",
    estimatedTime: "8-10 minutes",
    questionCount: {
      core: 20,
      perService: 5
    }
  },

  // Qualifying Questions (not counted in core 20)
  qualifying: [
    {
      id: "agency_type",
      question: "Which best describes your agency?",
      type: "single-select",
      required: true,
      options: [
        { value: "creative", label: "Creative/Design Agency", icon: "🎨" },
        { value: "digital", label: "Digital Marketing Agency", icon: "💻" },
        { value: "pr", label: "PR/Communications Agency", icon: "📢" },
        { value: "content", label: "Content/Social Agency", icon: "✍️" },
        { value: "integrated", label: "Full-Service Agency", icon: "🎯" },
        { value: "specialist", label: "Specialist Agency", icon: "🔧" }
      ]
    },
    {
      id: "agency_size",
      question: "How many people work at your agency?",
      type: "single-select",
      required: true,
      options: [
        { value: "1-5", label: "1-5 (Boutique)", score: 1 },
        { value: "6-15", label: "6-15 (Small)", score: 2 },
        { value: "16-30", label: "16-30 (Mid-size)", score: 3 },
        { value: "31-50", label: "31-50 (Growing)", score: 4 },
        { value: "50+", label: "50+ (Established)", score: 5 }
      ]
    },
    {
      id: "annual_revenue",
      question: "What's your approximate annual revenue?",
      type: "single-select",
      required: true,
      valuationWeight: 2.0,
      options: [
        { value: "under-500k", label: "Under £500K", score: 1 },
        { value: "500k-1m", label: "£500K - £1M", score: 2 },
        { value: "1m-2.5m", label: "£1M - £2.5M", score: 3 },
        { value: "2.5m-5m", label: "£2.5M - £5M", score: 4 },
        { value: "5m-10m", label: "£5M - £10M", score: 5 },
        { value: "10m+", label: "Over £10M", score: 5 }
      ]
    }
  ],

  // Core Questions - 20 total
  coreQuestions: {
    // Team & Champions (5 questions)
    teamChampions: [
      {
        id: "tc_1",
        question: "Who in your team gets most excited about trying new tools and tech?",
        dimension: "transformation",
        weight: 1.2,
        valuationCategory: "operational",
        options: [
          { text: "No one really - we're all pretty traditional", score: 1 },
          { text: "One or two people dabble sometimes", score: 2 },
          { text: "A few early adopters in different teams", score: 3 },
          { text: "Most teams have someone keen to innovate", score: 4 },
          { text: "Innovation is part of our culture across the board", score: 5 }
        ]
      },
      {
        id: "tc_2",
        question: "When someone discovers a better way to do something, what typically happens?",
        dimension: "transformation",
        weight: 1.3,
        valuationCategory: "operational",
        options: [
          { text: "They keep it to themselves or their immediate team", score: 1 },
          { text: "They might mention it but it rarely spreads", score: 2 },
          { text: "They share it but adoption is inconsistent", score: 3 },
          { text: "We have ways to share and most people try it", score: 4 },
          { text: "New methods spread quickly and become standard", score: 5 }
        ]
      },
      {
        id: "tc_3",
        question: "If you were to roll out AI tools tomorrow, who would naturally lead the charge?",
        dimension: "transformation",
        weight: 1.5,
        valuationCategory: "operational",
        options: [
          { text: "Honestly, no obvious candidates", score: 1 },
          { text: "Maybe one person but they're already swamped", score: 2 },
          { text: "A couple of people could do it with support", score: 3 },
          { text: "Several strong candidates across teams", score: 4 },
          { text: "Multiple champions already pushing for this", score: 5 }
        ]
      },
      {
        id: "tc_4",
        question: "How do different departments/teams share knowledge and collaborate?",
        dimension: "transformation",
        weight: 1.0,
        valuationCategory: "operational",
        options: [
          { text: "They don't - everyone works in silos", score: 1 },
          { text: "Occasional meetings but limited sharing", score: 2 },
          { text: "Regular meetings and some collaboration", score: 3 },
          { text: "Good collaboration on most projects", score: 4 },
          { text: "Seamless collaboration is our standard", score: 5 }
        ]
      },
      {
        id: "tc_5",
        question: "What's the typical reaction when someone suggests trying a new approach?",
        dimension: "transformation",
        weight: 1.1,
        valuationCategory: "strategic",
        options: [
          { text: "\"We've always done it this way\"", score: 1 },
          { text: "Skepticism and reluctance to change", score: 2 },
          { text: "Cautious interest if there's clear benefit", score: 3 },
          { text: "Generally open to testing new ideas", score: 4 },
          { text: "Excitement and eagerness to experiment", score: 5 }
        ]
      }
    ],

    // Resources & Constraints (4 questions)
    resourcesConstraints: [
      {
        id: "rc_1",
        question: "How much could you realistically invest in AI tools and training monthly?",
        dimension: "resources",
        weight: 1.2,
        valuationCategory: "financial",
        options: [
          { text: "Nothing - we're barely breaking even", score: 1 },
          { text: "£100-500 if it really proved ROI quickly", score: 2 },
          { text: "£500-1500 for the right solutions", score: 3 },
          { text: "£1500-3000 for transformation", score: 4 },
          { text: "£3000+ - we're ready to invest seriously", score: 5 }
        ]
      },
      {
        id: "rc_2",
        question: "How many hours per week could your team dedicate to learning and implementing AI?",
        dimension: "resources",
        weight: 1.0,
        valuationCategory: "operational",
        options: [
          { text: "Zero - we're completely maxed out", score: 1 },
          { text: "1-2 hours if we really squeeze", score: 2 },
          { text: "3-5 hours by adjusting priorities", score: 3 },
          { text: "5-10 hours - we can make time", score: 4 },
          { text: "10+ hours - this is a priority", score: 5 }
        ]
      },
      {
        id: "rc_3",
        question: "What's your biggest constraint to adopting new technology?",
        dimension: "resources",
        weight: 1.3,
        valuationCategory: "operational",
        options: [
          { text: "Cash flow - can't afford anything extra", score: 1 },
          { text: "Time - too busy with client work", score: 2 },
          { text: "Skills - team struggles with new tech", score: 3 },
          { text: "Minor constraints we can work around", score: 4 },
          { text: "No major constraints - ready to go", score: 5 }
        ]
      },
      {
        id: "rc_4",
        question: "How predictable is your revenue over the next 3 months?",
        dimension: "resources",
        weight: 1.5,
        valuationCategory: "financial",
        valuationImpact: "critical",
        options: [
          { text: "Totally unpredictable - feast or famine", score: 1 },
          { text: "Some visibility but lots of uncertainty", score: 2 },
          { text: "Reasonably predictable with some gaps", score: 3 },
          { text: "Pretty solid - 70%+ confirmed", score: 4 },
          { text: "Very predictable - mostly recurring revenue", score: 5 }
        ]
      }
    ],

    // Leadership & Culture (5 questions)
    leadershipCulture: [
      {
        id: "lc_1",
        question: "How does leadership view AI and automation in creative/marketing work?",
        dimension: "leadership",
        weight: 1.5,
        valuationCategory: "strategic",
        options: [
          { text: "Threat to our craft and quality", score: 1 },
          { text: "Necessary evil we'll eventually face", score: 2 },
          { text: "Interesting but not sure how it fits", score: 3 },
          { text: "Opportunity to enhance our work", score: 4 },
          { text: "Critical to our future success", score: 5 }
        ]
      },
      {
        id: "lc_2",
        question: "How do important decisions about new services or approaches get made?",
        dimension: "leadership",
        weight: 1.0,
        valuationCategory: "operational",
        options: [
          { text: "Founder/owner decides everything", score: 1 },
          { text: "Senior leadership with little input", score: 2 },
          { text: "Leadership team discusses and decides", score: 3 },
          { text: "Input from teams then leadership decides", score: 4 },
          { text: "Collaborative with strong team involvement", score: 5 }
        ]
      },
      {
        id: "lc_3",
        question: "When it comes to trying new approaches with client work, your agency is:",
        dimension: "leadership",
        weight: 1.2,
        valuationCategory: "strategic",
        options: [
          { text: "Very conservative - stick to what works", score: 1 },
          { text: "Cautious - need client approval for everything", score: 2 },
          { text: "Balanced - innovate within boundaries", score: 3 },
          { text: "Progressive - often suggest new approaches", score: 4 },
          { text: "Innovative - clients expect cutting-edge", score: 5 }
        ]
      },
      {
        id: "lc_4",
        question: "What metrics matter most to your leadership?",
        dimension: "leadership",
        weight: 1.1,
        valuationCategory: "financial",
        options: [
          { text: "Just staying afloat and paying bills", score: 1 },
          { text: "Revenue and basic profitability", score: 2 },
          { text: "Profit margins and utilization rates", score: 3 },
          { text: "Growth, margins, and client satisfaction", score: 4 },
          { text: "Innovation metrics alongside financial KPIs", score: 5 }
        ]
      },
      {
        id: "lc_5",
        question: "If budget allowed, would leadership prefer to hire specialists or train existing team?",
        dimension: "leadership",
        weight: 1.0,
        valuationCategory: "strategic",
        options: [
          { text: "Always hire - don't trust team to learn", score: 1 },
          { text: "Usually hire - training takes too long", score: 2 },
          { text: "Depends on the situation", score: 3 },
          { text: "Prefer training - team knows our clients", score: 4 },
          { text: "Always train - investment in our people", score: 5 }
        ]
      }
    ],

    // Change Readiness (6 questions)
    changeReadiness: [
      {
        id: "cr_1",
        question: "Think about your last major change (new service, system, process) - how did it go?",
        dimension: "change",
        weight: 1.3,
        valuationCategory: "operational",
        options: [
          { text: "Disaster - we still talk about how bad it was", score: 1 },
          { text: "Rocky - lots of resistance and issues", score: 2 },
          { text: "Eventually worked but took longer than expected", score: 3 },
          { text: "Pretty smooth with minor hiccups", score: 4 },
          { text: "Great success - now core to our business", score: 5 }
        ]
      },
      {
        id: "cr_2",
        question: "How many of your team are currently experimenting with AI tools (officially or unofficially)?",
        dimension: "change",
        weight: 1.5,
        valuationCategory: "ai",
        options: [
          { text: "None that I know of", score: 1 },
          { text: "One or two people quietly testing", score: 2 },
          { text: "Several people trying different tools", score: 3 },
          { text: "Many experimenting, some sharing results", score: 4 },
          { text: "Widespread experimentation and sharing", score: 5 }
        ]
      },
      {
        id: "cr_3",
        question: "What happens when a new initiative doesn't deliver expected results?",
        dimension: "change",
        weight: 1.1,
        valuationCategory: "strategic",
        options: [
          { text: "Blame and \"I told you so\" attitudes", score: 1 },
          { text: "Disappointment and reluctance to try again", score: 2 },
          { text: "Review what went wrong and move on", score: 3 },
          { text: "Learn from it and adjust approach", score: 4 },
          { text: "Celebrate the learning and iterate quickly", score: 5 }
        ]
      },
      {
        id: "cr_4",
        question: "How well documented are your current processes and ways of working?",
        dimension: "change",
        weight: 1.2,
        valuationCategory: "operational",
        valuationImpact: "high",
        options: [
          { text: "Nothing written - all in people's heads", score: 1 },
          { text: "Some notes but mostly tribal knowledge", score: 2 },
          { text: "Key processes documented but outdated", score: 3 },
          { text: "Good documentation, mostly current", score: 4 },
          { text: "Excellent living documentation", score: 5 }
        ]
      },
      {
        id: "cr_5",
        question: "How did your agency adapt during COVID/remote working?",
        dimension: "change",
        weight: 1.0,
        valuationCategory: "operational",
        options: [
          { text: "Barely survived - still recovering", score: 1 },
          { text: "Struggled but made it through", score: 2 },
          { text: "Adapted reasonably well after initial shock", score: 3 },
          { text: "Quickly pivoted and found new opportunities", score: 4 },
          { text: "Thrived and came out stronger", score: 5 }
        ]
      },
      {
        id: "cr_6",
        question: "What percentage of revenue comes from your largest client?",
        dimension: "change",
        weight: 1.5,
        valuationCategory: "financial",
        valuationImpact: "critical",
        options: [
          { text: "Over 50% - they're everything to us", score: 1 },
          { text: "30-50% - would hurt badly to lose them", score: 2 },
          { text: "20-30% - significant but manageable", score: 3 },
          { text: "10-20% - important but not critical", score: 4 },
          { text: "Under 10% - well diversified", score: 5 }
        ]
      }
    ]
  },

  // Service-Specific Questions (5 per service)
  serviceQuestions: {
    content_creation: {
      serviceName: "Content Creation",
      aiVulnerability: 85,
      questions: [
        {
          id: "content_1",
          question: "What's the biggest pain point in your content creation process?",
          dimension: "service_pain",
          weight: 1.3,
          options: [
            { text: "Everything takes forever to write", score: 1 },
            { text: "Research and ideation eat up hours", score: 2 },
            { text: "Maintaining consistent quality at scale", score: 3 },
            { text: "Fine-tuning voice and tone", score: 4 },
            { text: "Distribution and performance tracking", score: 5 }
          ]
        },
        {
          id: "content_2",
          question: "How long does it typically take to create a 1000-word blog post?",
          dimension: "service_efficiency",
          weight: 1.2,
          options: [
            { text: "4-6 hours or more", score: 1 },
            { text: "3-4 hours usually", score: 2 },
            { text: "2-3 hours on average", score: 3 },
            { text: "1-2 hours with our process", score: 4 },
            { text: "Under an hour with tools/templates", score: 5 }
          ]
        },
        {
          id: "content_3",
          question: "How do you balance content quality vs quantity demands from clients?",
          dimension: "service_quality",
          weight: 1.0,
          options: [
            { text: "We can't - always sacrificing one for the other", score: 1 },
            { text: "Struggle constantly with this trade-off", score: 2 },
            { text: "Manage it but it's challenging", score: 3 },
            { text: "Found a good balance that works", score: 4 },
            { text: "Deliver both through efficient systems", score: 5 }
          ]
        },
        {
          id: "content_4",
          question: "What tools does your content team currently use?",
          dimension: "service_tools",
          weight: 1.0,
          options: [
            { text: "Just Google Docs and basic research", score: 1 },
            { text: "Some SEO tools for keyword research", score: 2 },
            { text: "Content planning tools and templates", score: 3 },
            { text: "Advanced SEO and content optimization tools", score: 4 },
            { text: "Already using some AI writing assistants", score: 5 }
          ]
        },
        {
          id: "content_5",
          question: "If AI could help with one aspect of content, what would be most valuable?",
          dimension: "service_ai_opportunity",
          weight: 1.5,
          options: [
            { text: "Just getting first drafts done faster", score: 3 },
            { text: "Research and fact-checking", score: 3 },
            { text: "SEO optimization and keywords", score: 4 },
            { text: "Scaling personalized content", score: 5 },
            { text: "Predictive content performance", score: 5 }
          ]
        }
      ]
    },

    creative_design: {
      serviceName: "Creative & Design",
      aiVulnerability: 65,
      questions: [
        {
          id: "creative_1",
          question: "What takes the most time in your creative process?",
          dimension: "service_pain",
          weight: 1.3,
          options: [
            { text: "Coming up with initial concepts", score: 2 },
            { text: "Endless client revisions", score: 1 },
            { text: "Creating multiple variations", score: 2 },
            { text: "Production and final files", score: 3 },
            { text: "Strategy and creative briefs", score: 5 }
          ]
        },
        {
          id: "creative_2",
          question: "How many concept options do you typically present to clients?",
          dimension: "service_efficiency",
          weight: 1.0,
          options: [
            { text: "1-2 and hope they like them", score: 1 },
            { text: "3 options is our standard", score: 2 },
            { text: "3-5 depending on the project", score: 3 },
            { text: "5-10 to show range", score: 4 },
            { text: "As many as needed - we iterate fast", score: 5 }
          ]
        },
        {
          id: "creative_3",
          question: "How do you handle requests for 'quick variations' or resize?",
          dimension: "service_quality",
          weight: 1.2,
          options: [
            { text: "They're never quick - always painful", score: 1 },
            { text: "Disrupt our workflow but we manage", score: 2 },
            { text: "Built into our process but time-consuming", score: 3 },
            { text: "Pretty efficient with templates/systems", score: 4 },
            { text: "Automated or near-instant", score: 5 }
          ]
        },
        {
          id: "creative_4",
          question: "What's your current design toolkit?",
          dimension: "service_tools",
          weight: 1.0,
          options: [
            { text: "Basic Adobe Creative Suite", score: 1 },
            { text: "Full Adobe plus some plugins", score: 2 },
            { text: "Adobe, Figma, and collaboration tools", score: 3 },
            { text: "Modern stack with automation features", score: 4 },
            { text: "Already integrating AI design tools", score: 5 }
          ]
        },
        {
          id: "creative_5",
          question: "Where could AI add most value to your creative process?",
          dimension: "service_ai_opportunity",
          weight: 1.5,
          options: [
            { text: "Removing tedious production work", score: 3 },
            { text: "Generating initial concepts faster", score: 4 },
            { text: "Creating variations automatically", score: 4 },
            { text: "Predicting client preferences", score: 5 },
            { text: "Enhancing creative strategy", score: 5 }
          ]
        }
      ]
    },

    digital_marketing: {
      serviceName: "Digital Marketing",
      aiVulnerability: 75,
      questions: [
        {
          id: "digital_1",
          question: "What's your biggest challenge in managing digital campaigns?",
          dimension: "service_pain",
          weight: 1.3,
          options: [
            { text: "Too many platforms to manage effectively", score: 1 },
            { text: "Can't optimize fast enough", score: 2 },
            { text: "Proving ROI to clients", score: 3 },
            { text: "Scaling successful campaigns", score: 4 },
            { text: "Staying ahead of platform changes", score: 4 }
          ]
        },
        {
          id: "digital_2",
          question: "How much time does campaign optimization take weekly per client?",
          dimension: "service_efficiency",
          weight: 1.2,
          options: [
            { text: "10+ hours - it's overwhelming", score: 1 },
            { text: "5-10 hours of manual work", score: 2 },
            { text: "3-5 hours with our process", score: 3 },
            { text: "1-3 hours with good tools", score: 4 },
            { text: "Mostly automated monitoring", score: 5 }
          ]
        },
        {
          id: "digital_3",
          question: "How do you currently handle campaign reporting?",
          dimension: "service_quality",
          weight: 1.0,
          options: [
            { text: "Manual spreadsheets - takes forever", score: 1 },
            { text: "Platform exports with manual formatting", score: 2 },
            { text: "Reporting templates we update", score: 3 },
            { text: "Automated dashboards with some manual work", score: 4 },
            { text: "Fully automated with insights", score: 5 }
          ]
        },
        {
          id: "digital_4",
          question: "What tools are you using for campaign management?",
          dimension: "service_tools",
          weight: 1.0,
          options: [
            { text: "Just the native platform interfaces", score: 1 },
            { text: "Native platforms plus spreadsheets", score: 2 },
            { text: "Some third-party management tools", score: 3 },
            { text: "Comprehensive marketing platform", score: 4 },
            { text: "Advanced stack with AI features", score: 5 }
          ]
        },
        {
          id: "digital_5",
          question: "Where would AI help most in your digital marketing?",
          dimension: "service_ai_opportunity",
          weight: 1.5,
          options: [
            { text: "Writing ad copy variations", score: 3 },
            { text: "Audience targeting and segmentation", score: 4 },
            { text: "Bid optimization and budget allocation", score: 4 },
            { text: "Predictive performance modeling", score: 5 },
            { text: "Full campaign automation", score: 5 }
          ]
        }
      ]
    },

    seo_sem: {
      serviceName: "SEO/SEM",
      aiVulnerability: 80,
      questions: [
        {
          id: "seo_1",
          question: "What's the most time-consuming part of SEO work?",
          dimension: "service_pain",
          weight: 1.3,
          options: [
            { text: "Keyword research takes days", score: 1 },
            { text: "Technical audits are brutal", score: 2 },
            { text: "Content optimization never ends", score: 2 },
            { text: "Reporting and proving value", score: 3 },
            { text: "Keeping up with algorithm changes", score: 4 }
          ]
        },
        {
          id: "seo_2",
          question: "How long does a comprehensive SEO audit typically take?",
          dimension: "service_efficiency",
          weight: 1.2,
          options: [
            { text: "2-3 days of solid work", score: 1 },
            { text: "1-2 days with our process", score: 2 },
            { text: "1 day with good tools", score: 3 },
            { text: "Half day with automation", score: 4 },
            { text: "2-3 hours with our systems", score: 5 }
          ]
        },
        {
          id: "seo_3",
          question: "How do you demonstrate SEO value to clients?",
          dimension: "service_quality",
          weight: 1.0,
          options: [
            { text: "Struggle to show clear ROI", score: 1 },
            { text: "Basic ranking reports", score: 2 },
            { text: "Traffic and ranking improvements", score: 3 },
            { text: "Tied to conversions and revenue", score: 4 },
            { text: "Predictive value modeling", score: 5 }
          ]
        },
        {
          id: "seo_4",
          question: "What's your current SEO toolkit?",
          dimension: "service_tools",
          weight: 1.0,
          options: [
            { text: "Free tools and Google Search Console", score: 1 },
            { text: "One main paid tool (SEMrush/Ahrefs)", score: 2 },
            { text: "Multiple specialized tools", score: 3 },
            { text: "Enterprise SEO platform", score: 4 },
            { text: "AI-enhanced SEO suite", score: 5 }
          ]
        },
        {
          id: "seo_5",
          question: "Where would AI transform your SEO service?",
          dimension: "service_ai_opportunity",
          weight: 1.5,
          options: [
            { text: "Faster keyword research", score: 3 },
            { text: "Automated content optimization", score: 4 },
            { text: "Predictive ranking algorithms", score: 4 },
            { text: "Competitive intelligence at scale", score: 5 },
            { text: "Self-optimizing SEO strategies", score: 5 }
          ]
        }
      ]
    },

    pr_comms: {
      serviceName: "PR & Communications",
      aiVulnerability: 60,
      questions: [
        {
          id: "pr_1",
          question: "What's your biggest challenge in PR work?",
          dimension: "service_pain",
          weight: 1.3,
          options: [
            { text: "Finding relevant media contacts", score: 2 },
            { text: "Writing endless press releases", score: 1 },
            { text: "Tracking coverage and sentiment", score: 3 },
            { text: "Proving PR impact to clients", score: 3 },
            { text: "Strategic narrative development", score: 5 }
          ]
        },
        {
          id: "pr_2",
          question: "How long to draft and distribute a press release?",
          dimension: "service_efficiency",
          weight: 1.2,
          options: [
            { text: "Full day or more", score: 1 },
            { text: "4-6 hours typically", score: 2 },
            { text: "2-4 hours with templates", score: 3 },
            { text: "1-2 hours streamlined", score: 4 },
            { text: "Under an hour with our system", score: 5 }
          ]
        },
        {
          id: "pr_3",
          question: "How do you track and report PR coverage?",
          dimension: "service_quality",
          weight: 1.0,
          options: [
            { text: "Manual Google searches and spreadsheets", score: 1 },
            { text: "Basic monitoring tools", score: 2 },
            { text: "Professional monitoring platform", score: 3 },
            { text: "Automated tracking with analytics", score: 4 },
            { text: "AI-powered sentiment and impact analysis", score: 5 }
          ]
        },
        {
          id: "pr_4",
          question: "What tools support your PR efforts?",
          dimension: "service_tools",
          weight: 1.0,
          options: [
            { text: "Email and spreadsheets mostly", score: 1 },
            { text: "Basic media database", score: 2 },
            { text: "PR platform (Cision/Meltwater)", score: 3 },
            { text: "Integrated PR and analytics suite", score: 4 },
            { text: "AI-enhanced PR platform", score: 5 }
          ]
        },
        {
          id: "pr_5",
          question: "Where could AI add most value to PR?",
          dimension: "service_ai_opportunity",
          weight: 1.5,
          options: [
            { text: "Writing press releases faster", score: 3 },
            { text: "Finding the right journalists", score: 4 },
            { text: "Predicting story pickup", score: 4 },
            { text: "Real-time crisis monitoring", score: 5 },
            { text: "Strategic narrative optimization", score: 5 }
          ]
        }
      ]
    },

    strategy_consulting: {
      serviceName: "Strategy & Consulting",
      aiVulnerability: 35,
      questions: [
        {
          id: "strategy_1",
          question: "What's most challenging about strategy work?",
          dimension: "service_pain",
          weight: 1.3,
          options: [
            { text: "Getting enough data for insights", score: 2 },
            { text: "Analysis takes too long", score: 2 },
            { text: "Translating strategy to tactics", score: 3 },
            { text: "Keeping strategies current", score: 4 },
            { text: "Differentiating our approach", score: 5 }
          ]
        },
        {
          id: "strategy_2",
          question: "How long does a typical strategy project take?",
          dimension: "service_efficiency",
          weight: 1.2,
          options: [
            { text: "Months - very thorough process", score: 1 },
            { text: "4-6 weeks standard", score: 2 },
            { text: "2-4 weeks with our framework", score: 3 },
            { text: "1-2 weeks intensive sprint", score: 4 },
            { text: "Days with our rapid process", score: 5 }
          ]
        },
        {
          id: "strategy_3",
          question: "How do you gather market insights?",
          dimension: "service_quality",
          weight: 1.0,
          options: [
            { text: "Manual research and gut feel", score: 1 },
            { text: "Basic desk research", score: 2 },
            { text: "Mix of research and data tools", score: 3 },
            { text: "Comprehensive data platforms", score: 4 },
            { text: "AI-powered insight generation", score: 5 }
          ]
        },
        {
          id: "strategy_4",
          question: "What tools support your strategy work?",
          dimension: "service_tools",
          weight: 1.0,
          options: [
            { text: "PowerPoint and Excel", score: 1 },
            { text: "Plus some research tools", score: 2 },
            { text: "Strategy frameworks and templates", score: 3 },
            { text: "Advanced analytics platforms", score: 4 },
            { text: "AI-powered strategy tools", score: 5 }
          ]
        },
        {
          id: "strategy_5",
          question: "Where would AI help most in strategy?",
          dimension: "service_ai_opportunity",
          weight: 1.5,
          options: [
            { text: "Faster market research", score: 3 },
            { text: "Competitive analysis at scale", score: 4 },
            { text: "Trend prediction and forecasting", score: 4 },
            { text: "Scenario modeling and simulation", score: 5 },
            { text: "Dynamic strategy optimization", score: 5 }
          ]
        }
      ]
    }
  },

  // Scoring configuration
  scoring: {
    dimensions: {
      transformation: { weight: 0.25, displayName: "AI Readiness" },
      resources: { weight: 0.20, displayName: "Resource Availability" },
      leadership: { weight: 0.20, displayName: "Leadership Alignment" },
      change: { weight: 0.35, displayName: "Change Capability" }
    },
    
    valuationDimensions: {
      financial: { weight: 0.35, displayName: "Financial Health" },
      operational: { weight: 0.30, displayName: "Operational Excellence" },
      strategic: { weight: 0.20, displayName: "Strategic Position" },
      ai: { weight: 0.15, displayName: "AI Capability" }
    },

    serviceVulnerabilityWeights: {
      content_creation: 0.85,
      seo_sem: 0.80,
      digital_marketing: 0.75,
      creative_design: 0.65,
      pr_comms: 0.60,
      video_production: 0.55,
      strategy_consulting: 0.35
    }
  }
};

export default AgencyQuestionsConfig;