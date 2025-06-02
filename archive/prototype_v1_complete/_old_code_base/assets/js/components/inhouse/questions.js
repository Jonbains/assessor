/**
 * In-House Marketing AI Readiness Assessment - Questions Configuration
 * Version 1.0 - Comprehensive 155+ Question Framework
 * 
 * This configuration provides detailed assessment questions across core dimensions,
 * industry-specific contexts, and marketing activity specializations.
 */

const InHouseMarketingQuestionsConfig = {
  id: "inhouse-marketing-assessment",
  title: "In-House Marketing AI Readiness Assessment",
  description: "Comprehensive evaluation of your internal marketing team's AI capabilities, processes, and strategic positioning",
  assessmentType: "inhouse-marketing",
  
  // Assessment flow configuration
  steps: ["industry-selection", "activity-selection", "core-questions", "industry-questions", "activity-questions", "contact", "results"],
  
  // Industry options for selection
  industries: [
    { 
      id: "b2b_saas", 
      name: "B2B SaaS", 
      description: "Software-as-a-Service companies serving business customers",
      avgReadiness: 75,
      topQuartile: 90
    },
    { 
      id: "manufacturing", 
      name: "Manufacturing", 
      description: "Industrial and manufacturing companies",
      avgReadiness: 50,
      topQuartile: 70
    },
    { 
      id: "healthcare", 
      name: "Healthcare", 
      description: "Healthcare providers, medical devices, pharmaceuticals",
      avgReadiness: 55,
      topQuartile: 72
    },
    { 
      id: "financial_services", 
      name: "Financial Services", 
      description: "Banks, insurance, fintech, investment services",
      avgReadiness: 65,
      topQuartile: 85
    },
    { 
      id: "ecommerce_retail", 
      name: "E-commerce/Retail", 
      description: "Online retail, consumer goods, marketplace sellers",
      avgReadiness: 70,
      topQuartile: 88
    }
  ],
  
  // Marketing activities for selection
  activities: [
    { 
      id: "content_marketing", 
      name: "Content Marketing", 
      description: "Blog posts, whitepapers, case studies, thought leadership",
      aiImpact: "Very High"
    },
    { 
      id: "social_media", 
      name: "Social Media Management", 
      description: "Social posting, community management, social advertising",
      aiImpact: "High"
    },
    { 
      id: "seo_sem", 
      name: "SEO/SEM", 
      description: "Search engine optimization and search engine marketing",
      aiImpact: "High"
    },
    { 
      id: "email_marketing", 
      name: "Email Marketing", 
      description: "Email campaigns, automation, nurture sequences",
      aiImpact: "High"
    },
    { 
      id: "analytics_data", 
      name: "Analytics & Data", 
      description: "Marketing analytics, reporting, data analysis",
      aiImpact: "Very High"
    },
    { 
      id: "paid_advertising", 
      name: "Paid Advertising", 
      description: "PPC, display, social ads, programmatic",
      aiImpact: "High"
    },
    { 
      id: "creative_design", 
      name: "Creative & Design", 
      description: "Graphic design, video, creative assets",
      aiImpact: "Very High"
    },
    { 
      id: "marketing_automation", 
      name: "Marketing Automation", 
      description: "Lead scoring, workflow automation, CRM integration",
      aiImpact: "High"
    },
    { 
      id: "pr_communications", 
      name: "PR & Communications", 
      description: "Public relations, media outreach, crisis communications",
      aiImpact: "Moderate"
    },
    { 
      id: "events_webinars", 
      name: "Events & Webinars", 
      description: "Event marketing, webinars, virtual events",
      aiImpact: "Moderate"
    }
  ],
  
  // Company size options
  companySizes: [
    { id: "startup", name: "Startup (1-49 employees)", adjustment: "startup" },
    { id: "sme", name: "SME (50-500 employees)", adjustment: "sme" },
    { id: "enterprise", name: "Enterprise (500+ employees)", adjustment: "enterprise" }
  ],
  
  // Core dimension questions (30 total - 10 each)
  coreQuestions: {
    people_skills: [
      {
        id: "ps_1",
        dimension: "people_skills",
        weight: 3,
        question: "What percentage of your marketing team has received formal training in AI tools and techniques?",
        options: [
          { text: "None or almost none (0-10%) – No formal AI training program in place", score: 0 },
          { text: "Small group (10-25%) – A few self-motivated individuals have learned on their own", score: 1 },
          { text: "About quarter (25-40%) – Some internal training or vendor-led sessions completed", score: 2 },
          { text: "About half (40-60%) – Structured training program covering most common AI tools", score: 3 },
          { text: "Most of team (60-80%) – Comprehensive AI training with role-specific specialization", score: 4 },
          { text: "Entire team (80%+) – Continuous AI upskilling programs across all marketing roles", score: 5 }
        ],
        industryNotes: {
          b2b_saas: "Tech companies often expect higher baseline AI literacy",
          manufacturing: "May rely more on vendor training due to limited internal resources",
          healthcare: "Training must include compliance and ethical AI considerations"
        }
      },
      {
        id: "ps_2",
        dimension: "people_skills",
        weight: 2.5,
        question: "Does your organization have a clear talent strategy to acquire or develop the AI skills needed in marketing?",
        options: [
          { text: "No talent plan – skills gaps are unaddressed, hiring/training for AI is ad hoc", score: 0 },
          { text: "Aware of gaps – discussing AI skills needs but no formal plan yet", score: 1 },
          { text: "Basic planning – identified key AI skills needed, some budget allocated", score: 2 },
          { text: "Partial strategy – some efforts to hire or train for AI roles, but not comprehensive", score: 3 },
          { text: "Solid strategy – defined AI roles, training paths, and hiring criteria established", score: 4 },
          { text: "Robust strategy – comprehensive AI talent development with career progression paths", score: 5 }
        ]
      },
      {
        id: "ps_3",
        dimension: "people_skills",
        weight: 3,
        question: "To what extent do team members use AI tools to augment daily marketing tasks?",
        options: [
          { text: "Not at all – marketing tasks are done manually with no AI assistance (0% of tasks)", score: 0 },
          { text: "Minimal use – occasional AI assistance for simple tasks (~10% of tasks)", score: 1 },
          { text: "Light use – AI assists in some routine tasks (~25% of tasks)", score: 2 },
          { text: "Moderate use – AI integrated into regular workflows (~50% of tasks)", score: 3 },
          { text: "Heavy use – AI is primary tool for most marketing activities (~75% of tasks)", score: 4 },
          { text: "Extensive use – AI embedded in nearly all workflows with human oversight (90%+)", score: 5 }
        ]
      },
      {
        id: "ps_4",
        dimension: "people_skills",
        weight: 2.5,
        question: "How fluent are marketing team members in interpreting AI-driven insights and analytics?",
        options: [
          { text: "Not fluent – team struggles to understand AI outputs without analyst help", score: 0 },
          { text: "Basic understanding – can read simple AI reports but need help with complex insights", score: 1 },
          { text: "Developing fluency – comfortable with standard AI analytics dashboards", score: 2 },
          { text: "Somewhat fluent – key team leads can interpret AI analytics and make decisions", score: 3 },
          { text: "Quite fluent – most marketers comfortable working with AI insights independently", score: 4 },
          { text: "Highly fluent – team treats AI insights as natural extension of marketing expertise", score: 5 }
        ]
      },
      {
        id: "ps_5",
        dimension: "people_skills",
        weight: 2,
        question: "Do you have dedicated roles or champions focused on AI in marketing?",
        options: [
          { text: "No dedicated AI roles – any AI work is ad-hoc and handled by general staff", score: 0 },
          { text: "Informal interest – one person is enthusiastic about AI but no formal role", score: 1 },
          { text: "Part-time focus – someone spends portion of time on AI initiatives", score: 2 },
          { text: "Partial – informal point person or part-time specialist supports AI efforts", score: 3 },
          { text: "Formal champion – designated AI marketing lead with defined responsibilities", score: 4 },
          { text: "Dedicated roles – AI specialists, data scientists, or center of excellence for marketing AI", score: 5 }
        ]
      },
      {
        id: "ps_6",
        dimension: "people_skills",
        weight: 2,
        question: "How effectively does your team balance AI efficiency with human creativity and judgment?",
        options: [
          { text: "Poor balance – either avoiding AI entirely or over-relying without human oversight", score: 0 },
          { text: "Learning balance – experimenting but sometimes AI dominates or is ignored", score: 1 },
          { text: "Basic balance – clear rules about when to use AI vs human judgment", score: 2 },
          { text: "Good balance – AI handles routine tasks, humans focus on strategy and creativity", score: 3 },
          { text: "Strong balance – seamless integration where AI amplifies human capabilities", score: 4 },
          { text: "Optimal balance – AI and humans collaborate perfectly, each doing what they do best", score: 5 }
        ]
      },
      {
        id: "ps_7",
        dimension: "people_skills",
        weight: 2,
        question: "What is the skill level of your team in prompt engineering and AI tool optimization?",
        options: [
          { text: "No prompt engineering skills – using AI tools with basic, default prompts", score: 0 },
          { text: "Basic prompting – can write simple prompts but results are inconsistent", score: 1 },
          { text: "Developing skills – learning prompt techniques through trial and error", score: 2 },
          { text: "Intermediate skills – can craft effective prompts for most common use cases", score: 3 },
          { text: "Advanced skills – optimizing prompts for consistent, high-quality outputs", score: 4 },
          { text: "Expert level – creating sophisticated prompt libraries and training others", score: 5 }
        ]
      },
      {
        id: "ps_8",
        dimension: "people_skills",
        weight: 2,
        question: "How well does your team adapt to new AI tools and technologies?",
        options: [
          { text: "Resistant to change – team prefers traditional methods, slow to adopt new tools", score: 0 },
          { text: "Cautious adoption – willing to try new tools but very slowly and with hesitation", score: 1 },
          { text: "Selective adoption – adopts new AI tools when clear benefit is demonstrated", score: 2 },
          { text: "Open to adoption – generally enthusiastic about trying new AI capabilities", score: 3 },
          { text: "Quick adoption – rapidly tests and implements new AI tools when available", score: 4 },
          { text: "Innovation leaders – actively seeks out cutting-edge AI tools and beta tests new features", score: 5 }
        ]
      },
      {
        id: "ps_9",
        dimension: "people_skills",
        weight: 1.5,
        question: "How well does your team understand the ethical implications and limitations of AI in marketing?",
        options: [
          { text: "No awareness – team doesn't consider ethical implications of AI use", score: 0 },
          { text: "Basic awareness – knows AI has limitations but doesn't actively address them", score: 1 },
          { text: "Growing awareness – starting to discuss AI ethics and bias issues", score: 2 },
          { text: "Good understanding – actively considers ethics and limitations in AI decisions", score: 3 },
          { text: "Strong understanding – has frameworks for ethical AI use and bias detection", score: 4 },
          { text: "Expert level – leads industry discussions on ethical AI in marketing", score: 5 }
        ]
      },
      {
        id: "ps_10",
        dimension: "people_skills",
        weight: 2,
        question: "How effectively does your team collaborate on AI-enhanced projects?",
        options: [
          { text: "Poor collaboration – team works in silos, no sharing of AI knowledge or tools", score: 0 },
          { text: "Limited collaboration – occasional sharing but mostly individual AI efforts", score: 1 },
          { text: "Basic collaboration – some cross-functional AI projects and knowledge sharing", score: 2 },
          { text: "Good collaboration – regular teamwork on AI initiatives with shared learnings", score: 3 },
          { text: "Strong collaboration – integrated AI workflows across marketing functions", score: 4 },
          { text: "Exceptional collaboration – seamless AI-enhanced teamwork with continuous knowledge transfer", score: 5 }
        ]
      }
    ],
    
    process_infrastructure: [
      {
        id: "pi_1",
        dimension: "process_infrastructure",
        weight: 3,
        question: "Is your marketing data centralized and accessible for AI analysis and tools?",
        options: [
          { text: "Highly siloed data – data exists in disconnected systems, not ready for AI", score: 0 },
          { text: "Some integration – basic data connections but many gaps and manual processes", score: 1 },
          { text: "Partial integration – key data sources connected but still some silos", score: 2 },
          { text: "Mostly integrated – majority of data accessible with some remaining gaps", score: 3 },
          { text: "Well integrated – comprehensive data platform with AI-ready structure", score: 4 },
          { text: "Fully centralized – unified data architecture optimized for AI analysis", score: 5 }
        ]
      },
      {
        id: "pi_2",
        dimension: "process_infrastructure",
        weight: 2.5,
        question: "Have you automated repetitive marketing processes using AI or other automation?",
        options: [
          { text: "No automation – all processes are manual and time-consuming", score: 0 },
          { text: "Minimal automation – one or two basic automated processes", score: 1 },
          { text: "Some automation – several routine tasks automated but many remain manual", score: 2 },
          { text: "Moderate automation – significant processes automated with AI assistance", score: 3 },
          { text: "High automation – most routine tasks automated, team focuses on strategy", score: 4 },
          { text: "Extensive automation – AI handles most operational tasks with human oversight", score: 5 }
        ]
      },
      {
        id: "pi_3",
        dimension: "process_infrastructure",
        weight: 2.5,
        question: "Do you measure and track the impact of AI-enabled initiatives on marketing performance?",
        options: [
          { text: "No measurement – AI impact is not tracked or isolated", score: 0 },
          { text: "Ad hoc tracking – occasional analysis of specific AI pilot results", score: 1 },
          { text: "Basic tracking – some KPIs in place but inconsistent measurement", score: 2 },
          { text: "Regular tracking – systematic measurement of AI contributions to key metrics", score: 3 },
          { text: "Comprehensive tracking – detailed ROI analysis and performance attribution", score: 4 },
          { text: "Advanced tracking – real-time AI performance dashboards driving decisions", score: 5 }
        ]
      },
      {
        id: "pi_4",
        dimension: "process_infrastructure",
        weight: 2.5,
        question: "How well are your AI tools integrated with your existing marketing technology stack?",
        options: [
          { text: "Not integrated – AI tools are standalone with manual data transfers", score: 0 },
          { text: "Basic integration – some manual connections between AI tools and main platforms", score: 1 },
          { text: "Limited integration – a few API connections but mostly manual processes", score: 2 },
          { text: "Partial integration – several AI tools connected with some automation", score: 3 },
          { text: "Good integration – most AI tools connected with automated data flows", score: 4 },
          { text: "Fully integrated – seamless AI integration across entire marketing stack", score: 5 }
        ]
      },
      {
        id: "pi_5",
        dimension: "process_infrastructure",
        weight: 2,
        question: "Are there governance policies in place for AI use in marketing?",
        options: [
          { text: "No governance – AI use is unregulated, handled case-by-case", score: 0 },
          { text: "Informal guidelines – basic awareness of AI risks but no formal policies", score: 1 },
          { text: "Basic policies – some written guidelines for AI usage and data handling", score: 2 },
          { text: "Established policies – documented AI governance covering key risk areas", score: 3 },
          { text: "Comprehensive policies – detailed AI governance with regular audits", score: 4 },
          { text: "Advanced governance – sophisticated AI oversight with compliance monitoring", score: 5 }
        ]
      },
      {
        id: "pi_6",
        dimension: "process_infrastructure",
        weight: 2,
        question: "How quickly can your marketing team implement changes or launch campaigns using AI?",
        options: [
          { text: "Very slowly – AI hasn't improved speed, may have made processes slower", score: 0 },
          { text: "Slightly faster – minimal speed improvement from AI tools", score: 1 },
          { text: "Moderately faster – 20-30% improvement in campaign development speed", score: 2 },
          { text: "Significantly faster – 50% faster campaign creation and optimization", score: 3 },
          { text: "Much faster – 2x speed improvement in marketing execution", score: 4 },
          { text: "Dramatically faster – 3x+ speed with AI-powered rapid deployment", score: 5 }
        ]
      },
      {
        id: "pi_7",
        dimension: "process_infrastructure",
        weight: 2,
        question: "What quality control processes do you have for AI-generated marketing content?",
        options: [
          { text: "No quality control – AI content published without systematic review", score: 0 },
          { text: "Basic review – someone quickly checks AI content before publication", score: 1 },
          { text: "Standard review – consistent human review process for all AI content", score: 2 },
          { text: "Structured review – multi-step quality assurance with clear criteria", score: 3 },
          { text: "Comprehensive QA – detailed quality framework with brand compliance checks", score: 4 },
          { text: "Advanced QA – AI-assisted quality control with human oversight and continuous improvement", score: 5 }
        ]
      },
      {
        id: "pi_8",
        dimension: "process_infrastructure",
        weight: 2,
        question: "How well do you manage version control and documentation for AI-enhanced processes?",
        options: [
          { text: "No documentation – AI processes exist only in individual team members' heads", score: 0 },
          { text: "Minimal documentation – basic notes on AI tools and processes", score: 1 },
          { text: "Some documentation – key AI processes documented but not comprehensive", score: 2 },
          { text: "Good documentation – most AI processes well-documented and accessible", score: 3 },
          { text: "Comprehensive documentation – detailed process documentation with version control", score: 4 },
          { text: "Advanced documentation – AI process knowledge base with continuous updates", score: 5 }
        ]
      },
      {
        id: "pi_9",
        dimension: "process_infrastructure",
        weight: 2,
        question: "How effectively do you backup and protect AI-generated assets and data?",
        options: [
          { text: "No backup strategy – AI assets stored locally or in unsecured systems", score: 0 },
          { text: "Basic backup – some AI assets backed up but not systematically", score: 1 },
          { text: "Regular backup – AI assets included in standard backup procedures", score: 2 },
          { text: "Comprehensive backup – dedicated AI asset management with version control", score: 3 },
          { text: "Advanced protection – AI assets secured with enterprise-grade backup and access controls", score: 4 },
          { text: "Enterprise-level protection – AI data governance with compliance and security frameworks", score: 5 }
        ]
      },
      {
        id: "pi_10",
        dimension: "process_infrastructure",
        weight: 2,
        question: "How well do your AI processes scale with increased marketing demands?",
        options: [
          { text: "Cannot scale – AI processes break down under increased volume", score: 0 },
          { text: "Limited scaling – can handle small increases but struggles with growth", score: 1 },
          { text: "Basic scaling – processes handle moderate growth with some manual intervention", score: 2 },
          { text: "Good scaling – AI processes adapt well to increased marketing demands", score: 3 },
          { text: "Excellent scaling – automated scaling handles significant volume increases", score: 4 },
          { text: "Enterprise scaling – AI infrastructure scales seamlessly with business growth", score: 5 }
        ]
      }
    ],
    
    strategy_leadership: [
      {
        id: "sl_1",
        dimension: "strategy_leadership",
        weight: 3,
        question: "Is there a defined AI strategy or roadmap for marketing aligned with business goals?",
        options: [
          { text: "No AI strategy – marketing AI efforts are ad-hoc and unplanned", score: 0 },
          { text: "Informal planning – some AI goals discussed but not documented", score: 1 },
          { text: "Basic strategy – high-level AI goals identified but limited detail", score: 2 },
          { text: "Documented strategy – clear AI roadmap with specific objectives and timelines", score: 3 },
          { text: "Comprehensive strategy – detailed AI strategy integrated with business planning", score: 4 },
          { text: "Advanced strategy – sophisticated AI strategy with continuous evolution and measurement", score: 5 }
        ]
      },
      {
        id: "sl_2",
        dimension: "strategy_leadership",
        weight: 2.5,
        question: "How strong is leadership support for AI in marketing?",
        options: [
          { text: "No support – leaders express skepticism or allocate minimal budget", score: 0 },
          { text: "Minimal support – leadership acknowledges AI but provides little backing", score: 1 },
          { text: "Basic support – some budget allocated but AI is low priority", score: 2 },
          { text: "Good support – leadership interested and provides adequate resources", score: 3 },
          { text: "Strong support – executives actively champion AI with significant investment", score: 4 },
          { text: "Full commitment – C-suite treats AI as strategic priority with dedicated resources", score: 5 }
        ]
      },
      {
        id: "sl_3",
        dimension: "strategy_leadership",
        weight: 2.5,
        question: "Do you regularly run experiments or pilot projects with new AI approaches?",
        options: [
          { text: "Never experiment – stick to traditional methods, no AI testing", score: 0 },
          { text: "Rare experiments – occasional ad-hoc AI trials without systematic approach", score: 1 },
          { text: "Some experiments – periodic AI pilots but not consistently", score: 2 },
          { text: "Regular experiments – quarterly or semi-annual AI pilot projects", score: 3 },
          { text: "Frequent experiments – continuous AI experimentation with systematic learning", score: 4 },
          { text: "Innovation culture – experimentation is core to how marketing operates", score: 5 }
        ]
      },
      {
        id: "sl_4",
        dimension: "strategy_leadership",
        weight: 2.5,
        question: "How personalized and targeted are your marketing campaigns using AI?",
        options: [
          { text: "No personalization – broad, one-size-fits-all messaging", score: 0 },
          { text: "Basic segmentation – simple demographic or behavioral groupings", score: 1 },
          { text: "Some personalization – AI-driven segments with tailored messaging", score: 2 },
          { text: "Good personalization – dynamic content based on AI insights", score: 3 },
          { text: "Advanced personalization – real-time AI personalization across channels", score: 4 },
          { text: "Hyper-personalization – AI delivers individualized experiences at scale", score: 5 }
        ]
      },
      {
        id: "sl_5",
        dimension: "strategy_leadership",
        weight: 2,
        question: "Do you have benchmarks to compare your marketing AI capabilities against industry peers?",
        options: [
          { text: "No benchmarking – unaware of competitive AI positioning", score: 0 },
          { text: "Informal benchmarking – occasional industry report reading", score: 1 },
          { text: "Basic benchmarking – some comparison via industry surveys or networks", score: 2 },
          { text: "Regular benchmarking – systematic competitive analysis of AI capabilities", score: 3 },
          { text: "Comprehensive benchmarking – detailed maturity assessments and peer comparison", score: 4 },
          { text: "Advanced benchmarking – continuous competitive intelligence with strategic response", score: 5 }
        ]
      },
      {
        id: "sl_6",
        dimension: "strategy_leadership",
        weight: 2.5,
        question: "What is your approach to deciding which marketing functions to keep in-house vs outsource?",
        options: [
          { text: "No strategy – decisions are historical or ad-hoc", score: 0 },
          { text: "Basic evaluation – occasional review of vendor vs internal capabilities", score: 1 },
          { text: "Some strategic thinking – considering AI impact on make-vs-buy decisions", score: 2 },
          { text: "Strategic framework – clear criteria for insourcing vs outsourcing with AI", score: 3 },
          { text: "Dynamic strategy – regularly optimize internal vs external based on AI capabilities", score: 4 },
          { text: "Advanced optimization – sophisticated analysis of AI-enabled insourcing opportunities", score: 5 }
        ]
      },
      {
        id: "sl_7",
        dimension: "strategy_leadership",
        weight: 2,
        question: "How does your marketing team manage risks associated with AI?",
        options: [
          { text: "No risk management – rely on chance, don't formally address AI risks", score: 0 },
          { text: "Basic awareness – know risks exist but no formal mitigation", score: 1 },
          { text: "Some risk controls – basic guidelines and manual review processes", score: 2 },
          { text: "Structured risk management – documented risk assessment and mitigation plans", score: 3 },
          { text: "Comprehensive risk management – formal risk framework with monitoring", score: 4 },
          { text: "Advanced risk management – sophisticated AI risk governance with continuous monitoring", score: 5 }
        ]
      },
      {
        id: "sl_8",
        dimension: "strategy_leadership",
        weight: 2,
        question: "Do you have a timeline with milestones for AI adoption in marketing?",
        options: [
          { text: "No timeline – AI adoption is not planned out", score: 0 },
          { text: "Vague timeline – general sense of AI direction but no specific milestones", score: 1 },
          { text: "Basic timeline – short-term AI goals identified", score: 2 },
          { text: "Structured timeline – quarterly milestones for AI implementation", score: 3 },
          { text: "Detailed roadmap – comprehensive multi-year AI adoption plan", score: 4 },
          { text: "Dynamic roadmap – continuously updated AI strategy with adaptive milestones", score: 5 }
        ]
      },
      {
        id: "sl_9",
        dimension: "strategy_leadership",
        weight: 2,
        question: "How well do you communicate AI successes and learnings across the organization?",
        options: [
          { text: "No communication – AI efforts stay within marketing team", score: 0 },
          { text: "Minimal sharing – occasional informal updates on AI projects", score: 1 },
          { text: "Some sharing – periodic reports on AI initiatives and results", score: 2 },
          { text: "Regular communication – systematic sharing of AI wins and lessons learned", score: 3 },
          { text: "Proactive communication – marketing AI becomes example for other departments", score: 4 },
          { text: "Thought leadership – organization becomes known for AI marketing innovation", score: 5 }
        ]
      },
      {
        id: "sl_10",
        dimension: "strategy_leadership",
        weight: 2,
        question: "How do you ensure AI initiatives align with overall brand strategy and values?",
        options: [
          { text: "No alignment – AI used without considering brand implications", score: 0 },
          { text: "Basic awareness – some consideration of brand fit but not systematic", score: 1 },
          { text: "Some alignment – AI initiatives reviewed for brand consistency", score: 2 },
          { text: "Good alignment – clear guidelines for AI use that support brand strategy", score: 3 },
          { text: "Strong alignment – AI strategy directly supports and enhances brand positioning", score: 4 },
          { text: "Perfect alignment – AI becomes integral to brand differentiation and value proposition", score: 5 }
        ]
      }
    ]
  },
  
  // Industry-specific questions (5 per industry)
  industryQuestions: {
    b2b_saas: [
      {
        id: "b2b_1",
        industry: "b2b_saas",
        weight: 2,
        question: "How effectively do you use AI for product-led growth marketing and user onboarding optimization?",
        options: [
          { text: "No PLG focus – traditional sales-led approach with minimal onboarding automation", score: 0 },
          { text: "Basic onboarding – simple email sequences but no AI optimization", score: 1 },
          { text: "Some AI optimization – using AI for email timing and basic personalization", score: 2 },
          { text: "Good AI integration – AI-driven onboarding flows based on user behavior", score: 3 },
          { text: "Advanced PLG – AI predicts user success and optimizes entire onboarding experience", score: 4 },
          { text: "AI-first PLG – sophisticated AI models drive product adoption and expansion", score: 5 }
        ]
      },
      {
        id: "b2b_2",
        industry: "b2b_saas",
        weight: 2,
        question: "To what extent do you leverage AI for account-based marketing and sales alignment?",
        options: [
          { text: "No ABM – broad-based marketing without account focus", score: 0 },
          { text: "Basic ABM – manual account identification and generic outreach", score: 1 },
          { text: "Some AI assistance – AI helps identify target accounts but outreach is manual", score: 2 },
          { text: "AI-enhanced ABM – AI personalizes content and timing for target accounts", score: 3 },
          { text: "Advanced ABM – AI orchestrates multi-touch campaigns across account stakeholders", score: 4 },
          { text: "AI-powered ABM – fully automated account intelligence and engagement optimization", score: 5 }
        ]
      },
      {
        id: "b2b_3",
        industry: "b2b_saas",
        weight: 2,
        question: "How well do you use AI to analyze and optimize customer lifecycle stages and expansion opportunities?",
        options: [
          { text: "No lifecycle analysis – treating all customers the same regardless of stage", score: 0 },
          { text: "Basic segmentation – simple new/existing customer categories", score: 1 },
          { text: "Manual lifecycle tracking – identifying stages but without AI insights", score: 2 },
          { text: "AI-assisted analysis – using AI to identify expansion opportunities and churn risks", score: 3 },
          { text: "Predictive lifecycle marketing – AI predicts optimal timing for upsell/cross-sell", score: 4 },
          { text: "AI-driven growth – sophisticated models optimize entire customer value journey", score: 5 }
        ]
      },
      {
        id: "b2b_4",
        industry: "b2b_saas",
        weight: 2,
        question: "How effectively do you integrate product usage data with AI-driven marketing campaigns?",
        options: [
          { text: "No integration – marketing and product data remain separate", score: 0 },
          { text: "Basic integration – manual reporting on product usage for marketing insights", score: 1 },
          { text: "Some automation – product data feeds into email segmentation", score: 2 },
          { text: "Good integration – AI uses product behavior to trigger marketing campaigns", score: 3 },
          { text: "Advanced integration – real-time AI personalization based on product engagement", score: 4 },
          { text: "Seamless integration – AI creates unified customer experience across product and marketing", score: 5 }
        ]
      },
      {
        id: "b2b_5",
        industry: "b2b_saas",
        weight: 2,
        question: "How sophisticated is your AI-driven competitive intelligence and positioning?",
        options: [
          { text: "No competitive intelligence – limited awareness of competitor marketing", score: 0 },
          { text: "Manual monitoring – occasional review of competitor websites and materials", score: 1 },
          { text: "Basic AI tools – using AI for competitor content monitoring and alerts", score: 2 },
          { text: "Advanced monitoring – AI tracks competitor campaigns, pricing, and messaging", score: 3 },
          { text: "Predictive intelligence – AI predicts competitor moves and suggests responses", score: 4 },
          { text: "Strategic AI advantage – AI-driven competitive positioning creates market differentiation", score: 5 }
        ]
      }
    ],
    
    manufacturing: [
      {
        id: "mfg_1",
        industry: "manufacturing",
        weight: 2,
        question: "How effectively do you use AI to translate technical product specifications into marketing content?",
        options: [
          { text: "Manual translation – engineers write specs, marketers manually convert to content", score: 0 },
          { text: "Basic templates – using standard templates but still mostly manual process", score: 1 },
          { text: "Some AI assistance – AI helps generate initial drafts from technical specifications", score: 2 },
          { text: "Good AI integration – AI consistently converts technical data to marketing copy", score: 3 },
          { text: "Advanced AI translation – AI creates compelling marketing content from complex technical data", score: 4 },
          { text: "Seamless AI bridge – AI automatically generates marketing materials from engineering updates", score: 5 }
        ]
      },
      {
        id: "mfg_2",
        industry: "manufacturing",
        weight: 2,
        question: "To what extent do you leverage AI for dealer/distributor marketing support and channel optimization?",
        options: [
          { text: "No channel support – dealers/distributors handle their own marketing independently", score: 0 },
          { text: "Basic materials – providing generic marketing materials without customization", score: 1 },
          { text: "Some customization – manually customizing materials for key channel partners", score: 2 },
          { text: "AI-assisted customization – using AI to personalize materials for different channels", score: 3 },
          { text: "Advanced channel AI – AI optimizes marketing support based on channel performance", score: 4 },
          { text: "AI channel ecosystem – fully integrated AI supporting entire partner marketing network", score: 5 }
        ]
      },
      {
        id: "mfg_3",
        industry: "manufacturing",
        weight: 2,
        question: "How well do you use AI to optimize marketing for long B2B sales cycles and complex decision-making units?",
        options: [
          { text: "No cycle optimization – treating all prospects the same regardless of sales stage", score: 0 },
          { text: "Basic nurturing – simple email sequences for long sales cycles", score: 1 },
          { text: "Manual optimization – account managers manually guide marketing for complex deals", score: 2 },
          { text: "AI-assisted nurturing – AI personalizes content based on sales stage and stakeholder", score: 3 },
          { text: "Advanced AI orchestration – AI manages complex multi-stakeholder marketing campaigns", score: 4 },
          { text: "Predictive AI sales support – AI predicts optimal marketing interventions throughout sales cycle", score: 5 }
        ]
      },
      {
        id: "mfg_4",
        industry: "manufacturing",
        weight: 2,
        question: "How effectively do you integrate AI with trade show and industry event marketing?",
        options: [
          { text: "No AI integration – traditional trade show approach with manual follow-up", score: 0 },
          { text: "Basic digital capture – using digital tools for lead capture but no AI analysis", score: 1 },
          { text: "Some AI analysis – using AI to prioritize and score trade show leads", score: 2 },
          { text: "AI-enhanced events – AI optimizes pre-event targeting and post-event follow-up", score: 3 },
          { text: "Advanced event AI – AI predicts best prospects and personalizes entire event experience", score: 4 },
          { text: "AI-powered event strategy – AI drives comprehensive event marketing from planning to ROI analysis", score: 5 }
        ]
      },
      {
        id: "mfg_5",
        industry: "manufacturing",
        weight: 2,
        question: "How well do you use AI to create and optimize technical documentation and case studies?",
        options: [
          { text: "Manual creation – all technical marketing content created manually by subject matter experts", score: 0 },
          { text: "Basic templates – using templates but still requiring significant manual work", score: 1 },
          { text: "Some AI assistance – AI helps with formatting and basic content generation", score: 2 },
          { text: "AI-enhanced creation – AI generates first drafts of technical content and case studies", score: 3 },
          { text: "Advanced AI authoring – AI creates compelling technical stories from project data", score: 4 },
          { text: "Automated AI documentation – AI continuously generates marketing content from operational data", score: 5 }
        ]
      }
    ],
    
    healthcare: [
      {
        id: "hc_1",
        industry: "healthcare",
        weight: 2,
        question: "How effectively do you use AI for patient/provider marketing while maintaining HIPAA compliance?",
        options: [
          { text: "No AI use – avoiding AI due to compliance concerns", score: 0 },
          { text: "Minimal AI – very limited AI use with manual compliance checks", score: 1 },
          { text: "Cautious AI use – some AI tools with extensive compliance review", score: 2 },
          { text: "Compliant AI integration – established processes for HIPAA-compliant AI marketing", score: 3 },
          { text: "Advanced compliant AI – sophisticated AI capabilities with robust compliance framework", score: 4 },
          { text: "AI compliance leadership – industry-leading approach to AI marketing in healthcare", score: 5 }
        ]
      },
      {
        id: "hc_2",
        industry: "healthcare",
        weight: 2,
        question: "To what extent do you leverage AI for personalized patient education and health communication?",
        options: [
          { text: "Generic communication – one-size-fits-all patient education materials", score: 0 },
          { text: "Basic segmentation – simple demographic-based health communication", score: 1 },
          { text: "Some personalization – AI helps customize educational content for different conditions", score: 2 },
          { text: "Good personalization – AI creates tailored health education based on patient profiles", score: 3 },
          { text: "Advanced personalization – AI delivers individualized health information and recommendations", score: 4 },
          { text: "AI health advisor – sophisticated AI providing personalized health guidance at scale", score: 5 }
        ]
      },
      {
        id: "hc_3",
        industry: "healthcare",
        weight: 2,
        question: "How well do you use AI to optimize provider outreach and professional education programs?",
        options: [
          { text: "Manual outreach – traditional sales rep approach with generic materials", score: 0 },
          { text: "Basic digital outreach – email campaigns to provider segments", score: 1 },
          { text: "Some AI personalization – AI customizes content for different provider types", score: 2 },
          { text: "AI-enhanced programs – AI optimizes timing and content for provider education", score: 3 },
          { text: "Advanced AI outreach – AI predicts provider needs and delivers targeted education", score: 4 },
          { text: "AI medical education platform – comprehensive AI-driven provider engagement system", score: 5 }
        ]
      },
      {
        id: "hc_4",
        industry: "healthcare",
        weight: 2,
        question: "How effectively do you integrate AI with clinical outcomes data for marketing purposes?",
        options: [
          { text: "No integration – marketing and clinical data remain completely separate", score: 0 },
          { text: "Limited integration – occasional use of outcomes data in marketing materials", score: 1 },
          { text: "Some AI analysis – using AI to analyze clinical data for marketing insights", score: 2 },
          { text: "Good integration – AI regularly converts clinical outcomes into marketing messages", score: 3 },
          { text: "Advanced integration – AI creates compelling marketing narratives from clinical evidence", score: 4 },
          { text: "Seamless clinical marketing – AI continuously optimizes marketing based on clinical performance", score: 5 }
        ]
      },
      {
        id: "hc_5",
        industry: "healthcare",
        weight: 2,
        question: "How sophisticated is your AI-driven approach to healthcare reputation management and crisis communication?",
        options: [
          { text: "No AI monitoring – manual monitoring of reputation and reactive crisis response", score: 0 },
          { text: "Basic monitoring – using basic tools to track mentions but manual response", score: 1 },
          { text: "AI-assisted monitoring – AI flags potential issues but human-driven response", score: 2 },
          { text: "AI-enhanced response – AI helps craft appropriate responses to reputation issues", score: 3 },
          { text: "Predictive AI monitoring – AI predicts potential reputation risks and suggests prevention", score: 4 },
          { text: "AI reputation management – comprehensive AI system managing healthcare reputation proactively", score: 5 }
        ]
      }
    ],
    
    financial_services: [
      {
        id: "fs_1",
        industry: "financial_services",
        weight: 2,
        question: "How effectively do you use AI for personalized financial product recommendations while ensuring regulatory compliance?",
        options: [
          { text: "No personalization – generic product marketing due to compliance concerns", score: 0 },
          { text: "Basic segmentation – simple demographic-based product recommendations", score: 1 },
          { text: "Compliant personalization – AI recommendations with extensive compliance review", score: 2 },
          { text: "Advanced compliant AI – sophisticated personalization with built-in compliance checks", score: 3 },
          { text: "AI-driven advisory – AI provides personalized financial guidance while maintaining compliance", score: 4 },
          { text: "Regulatory AI leadership – industry-leading approach to compliant AI personalization", score: 5 }
        ]
      },
      {
        id: "fs_2",
        industry: "financial_services",
        weight: 2,
        question: "To what extent do you leverage AI for fraud detection and prevention in marketing campaigns?",
        options: [
          { text: "No AI fraud prevention – relying on traditional security measures only", score: 0 },
          { text: "Basic AI tools – using simple AI for obvious fraud pattern detection", score: 1 },
          { text: "Some AI integration – AI assists with fraud detection in marketing activities", score: 2 },
          { text: "Advanced AI security – comprehensive AI fraud prevention across marketing channels", score: 3 },
          { text: "Predictive AI protection – AI predicts and prevents fraud before it occurs", score: 4 },
          { text: "AI security ecosystem – sophisticated AI protecting entire marketing and customer ecosystem", score: 5 }
        ]
      },
      {
        id: "fs_3",
        industry: "financial_services",
        weight: 2,
        question: "How well do you use AI to optimize customer lifecycle value and retention in financial services?",
        options: [
          { text: "No lifecycle optimization – treating all customers equally regardless of value", score: 0 },
          { text: "Basic segmentation – simple high/medium/low value customer categories", score: 1 },
          { text: "Some AI analysis – using AI to identify high-value customers and churn risks", score: 2 },
          { text: "AI-driven retention – AI predicts churn and triggers retention campaigns", score: 3 },
          { text: "Advanced lifecycle AI – AI optimizes entire customer journey for maximum lifetime value", score: 4 },
          { text: "Predictive value optimization – AI continuously maximizes customer relationships and profitability", score: 5 }
        ]
      },
      {
        id: "fs_4",
        industry: "financial_services",
        weight: 2,
        question: "How effectively do you integrate AI with market conditions and economic data for marketing timing?",
        options: [
          { text: "No market integration – marketing campaigns run regardless of market conditions", score: 0 },
          { text: "Manual market awareness – humans adjust campaigns based on obvious market changes", score: 1 },
          { text: "Some AI market analysis – using AI to analyze market trends for marketing insights", score: 2 },
          { text: "AI-informed timing – AI optimizes campaign timing based on market conditions", score: 3 },
          { text: "Advanced market AI – AI continuously adjusts marketing based on real-time economic data", score: 4 },
          { text: "Predictive market marketing – AI predicts optimal marketing strategies based on economic forecasts", score: 5 }
        ]
      },
      {
        id: "fs_5",
        industry: "financial_services",
        weight: 2,
        question: "How sophisticated is your AI approach to financial education and content marketing?",
        options: [
          { text: "Generic content – one-size-fits-all financial education materials", score: 0 },
          { text: "Basic personalization – simple demographic-based financial content", score: 1 },
          { text: "AI-assisted content – using AI to customize financial education for different audiences", score: 2 },
          { text: "Intelligent content delivery – AI determines optimal financial education content and timing", score: 3 },
          { text: "Adaptive financial education – AI creates personalized learning paths for financial literacy", score: 4 },
          { text: "AI financial advisor content – sophisticated AI delivering personalized financial guidance at scale", score: 5 }
        ]
      }
    ],
    
    ecommerce_retail: [
      {
        id: "ec_1",
        industry: "ecommerce_retail",
        weight: 2,
        question: "How effectively do you use AI for product recommendations and personalized shopping experiences?",
        options: [
          { text: "No personalization – same product displays and recommendations for all customers", score: 0 },
          { text: "Basic recommendations – simple 'customers also bought' or category-based suggestions", score: 1 },
          { text: "Some AI personalization – AI-driven product recommendations based on browsing history", score: 2 },
          { text: "Advanced personalization – AI creates individualized shopping experiences across channels", score: 3 },
          { text: "Real-time AI optimization – AI continuously optimizes product recommendations and site experience", score: 4 },
          { text: "Predictive shopping AI – AI anticipates customer needs and proactively suggests products", score: 5 }
        ]
      },
      {
        id: "ec_2",
        industry: "ecommerce_retail",
        weight: 2,
        question: "To what extent do you leverage AI for dynamic pricing and promotional optimization?",
        options: [
          { text: "Static pricing – fixed prices with occasional manual promotions", score: 0 },
          { text: "Basic price rules – simple automatic discounts based on inventory or time", score: 1 },
          { text: "Some AI pricing – using AI for competitive price monitoring and basic adjustments", score: 2 },
          { text: "Dynamic AI pricing – AI optimizes prices based on demand, competition, and inventory", score: 3 },
          { text: "Advanced pricing AI – AI creates sophisticated pricing strategies across product lines", score: 4 },
          { text: "Predictive pricing optimization – AI predicts optimal pricing for maximum profit and sales", score: 5 }
        ]
      },
      {
        id: "ec_3",
        industry: "ecommerce_retail",
        weight: 2,
        question: "How well do you use AI to optimize inventory management and marketing coordination?",
        options: [
          { text: "No coordination – marketing and inventory management operate independently", score: 0 },
          { text: "Basic coordination – manual adjustments to marketing based on inventory levels", score: 1 },
          { text: "Some AI integration – using AI to promote high-inventory items", score: 2 },
          { text: "AI-coordinated optimization – AI balances marketing spend with inventory levels", score: 3 },
          { text: "Advanced inventory marketing – AI optimizes entire supply chain and marketing integration", score: 4 },
          { text: "Predictive inventory marketing – AI predicts demand and coordinates marketing and inventory proactively", score: 5 }
        ]
      },
      {
        id: "ec_4",
        industry: "ecommerce_retail",
        weight: 2,
        question: "How effectively do you integrate AI across online and offline marketing channels?",
        options: [
          { text: "Siloed channels – online and offline marketing operate completely separately", score: 0 },
          { text: "Basic integration – some shared customer data between online and offline", score: 1 },
          { text: "Some AI coordination – using AI to coordinate messaging across channels", score: 2 },
          { text: "Good omnichannel AI – AI creates consistent customer experience across all touchpoints", score: 3 },
          { text: "Advanced omnichannel optimization – AI optimizes entire customer journey across channels", score: 4 },
          { text: "Seamless AI orchestration – AI delivers unified, personalized experience regardless of channel", score: 5 }
        ]
      },
      {
        id: "ec_5",
        industry: "ecommerce_retail",
        weight: 2,
        question: "How sophisticated is your AI-driven approach to customer acquisition and retention?",
        options: [
          { text: "Basic acquisition – traditional advertising with manual customer retention efforts", score: 0 },
          { text: "Some AI acquisition – using AI for ad targeting but manual retention", score: 1 },
          { text: "AI-assisted programs – AI helps with both acquisition targeting and retention campaigns", score: 2 },
          { text: "Advanced AI optimization – AI optimizes entire customer acquisition and retention funnel", score: 3 },
          { text: "Predictive customer management – AI predicts optimal acquisition strategies and retention interventions", score: 4 },
          { text: "AI customer lifecycle mastery – sophisticated AI maximizing customer value from acquisition through advocacy", score: 5 }
        ]
      }
    ]
  },
  
  // Activity-specific questions (10 per activity - 100 total)
  activityQuestions: {
    content_marketing: [
      {
        id: "cm_1",
        activity: "content_marketing",
        weight: 3,
        question: "What percentage of your content is created with AI assistance (drafts, ideas, optimization)?",
        options: [
          { text: "0% – All content created manually without AI help", score: 0 },
          { text: "1-15% – Occasional AI assistance for simple tasks", score: 1 },
          { text: "16-35% – Regular AI use for content ideation and basic drafts", score: 2 },
          { text: "36-60% – AI generates majority of first drafts with human editing", score: 3 },
          { text: "61-80% – AI integral to content creation with strategic human oversight", score: 4 },
          { text: "81-100% – AI handles most content creation with minimal human intervention", score: 5 }
        ]
      },
      {
        id: "cm_2",
        activity: "content_marketing",
        weight: 2.5,
        question: "How effectively do you use AI for content strategy and editorial calendar planning?",
        options: [
          { text: "No AI planning – editorial calendar created manually based on intuition", score: 0 },
          { text: "Basic AI research – using AI for topic research but manual planning", score: 1 },
          { text: "Some AI insights – AI provides content suggestions and trend analysis", score: 2 },
          { text: "AI-informed strategy – AI analyzes performance and suggests content strategy", score: 3 },
          { text: "AI-driven planning – AI creates optimized editorial calendars based on data", score: 4 },
          { text: "Predictive content strategy – AI predicts content performance and optimizes entire strategy", score: 5 }
        ]
      },
      {
        id: "cm_3",
        activity: "content_marketing",
        weight: 2.5,
        question: "How well do you maintain brand voice and consistency across AI-generated content?",
        options: [
          { text: "No consistency controls – AI content often doesn't match brand voice", score: 0 },
          { text: "Basic guidelines – some brand voice instructions but inconsistent results", score: 1 },
          { text: "Manual review process – human editors ensure brand voice consistency", score: 2 },
          { text: "AI brand training – AI trained on brand guidelines with good consistency", score: 3 },
          { text: "Advanced brand AI – AI automatically maintains brand voice across all content", score: 4 },
          { text: "Brand voice mastery – AI perfectly replicates and enhances brand voice consistently", score: 5 }
        ]
      },
      {
        id: "cm_4",
        activity: "content_marketing",
        weight: 2,
        question: "To what extent do you use AI for content optimization and SEO enhancement?",
        options: [
          { text: "No AI optimization – content published without AI-driven SEO analysis", score: 0 },
          { text: "Basic AI SEO – using AI for keyword suggestions", score: 1 },
          { text: "Some optimization – AI helps optimize titles, meta descriptions, and basic SEO", score: 2 },
          { text: "Good AI SEO integration – AI optimizes content structure and keyword placement", score: 3 },
          { text: "Advanced content AI – AI optimizes for search intent and user experience", score: 4 },
          { text: "Predictive SEO AI – AI predicts content performance and optimizes for maximum visibility", score: 5 }
        ]
      },
      {
        id: "cm_5",
        activity: "content_marketing",
        weight: 2,
        question: "How effectively do you use AI for content performance analysis and improvement?",
        options: [
          { text: "No AI analysis – manual review of basic metrics like views and engagement", score: 0 },
          { text: "Basic AI insights – AI provides simple performance summaries", score: 1 },
          { text: "Some AI analysis – AI identifies top-performing content and basic patterns", score: 2 },
          { text: "Good AI analytics – AI provides detailed insights on content performance factors", score: 3 },
          { text: "Advanced AI optimization – AI suggests specific improvements based on performance data", score: 4 },
          { text: "Predictive content AI – AI predicts content success and continuously optimizes strategy", score: 5 }
        ]
      },
      {
        id: "cm_6",
        activity: "content_marketing",
        weight: 2,
        question: "How well do you use AI for content repurposing and multi-format optimization?",
        options: [
          { text: "No repurposing – each content piece created separately for each channel", score: 0 },
          { text: "Manual repurposing – humans adapt content for different formats", score: 1 },
          { text: "Some AI assistance – AI helps reformat content for different channels", score: 2 },
          { text: "Good AI repurposing – AI effectively adapts content across multiple formats", score: 3 },
          { text: "Advanced content AI – AI optimizes content for each specific channel and audience", score: 4 },
          { text: "Seamless AI adaptation – AI automatically creates optimal versions for all relevant channels", score: 5 }
        ]
      },
      {
        id: "cm_7",
        activity: "content_marketing",
        weight: 2,
        question: "To what extent do you use AI for visual content creation and enhancement?",
        options: [
          { text: "No AI visuals – all graphics, images, and videos created manually or sourced traditionally", score: 0 },
          { text: "Basic AI graphics – occasional use of AI for simple images or graphics", score: 1 },
          { text: "Some AI visual content – regular use of AI for blog images and social graphics", score: 2 },
          { text: "Good AI visual integration – AI creates most visual content with human curation", score: 3 },
          { text: "Advanced visual AI – AI generates sophisticated visuals optimized for each content piece", score: 4 },
          { text: "Comprehensive visual AI – AI handles all visual content creation with brand consistency", score: 5 }
        ]
      },
      {
        id: "cm_8",
        activity: "content_marketing",
        weight: 2,
        question: "How effectively do you use AI for content personalization based on audience segments?",
        options: [
          { text: "No personalization – same content delivered to all audiences", score: 0 },
          { text: "Basic segmentation – different content for broad audience categories", score: 1 },
          { text: "Some AI personalization – AI customizes content for key audience segments", score: 2 },
          { text: "Good personalization – AI creates targeted content variations for different personas", score: 3 },
          { text: "Advanced AI personalization – AI delivers individualized content experiences", score: 4 },
          { text: "Dynamic personalization – AI real-time personalizes content for each visitor", score: 5 }
        ]
      },
      {
        id: "cm_9",
        activity: "content_marketing",
        weight: 1.5,
        question: "How well do you use AI for content workflow and collaboration optimization?",
        options: [
          { text: "Manual workflows – all content workflow managed manually with basic project tools", score: 0 },
          { text: "Some automation – basic workflow automation but no AI optimization", score: 1 },
          { text: "AI-assisted workflow – AI helps with content assignment and status tracking", score: 2 },
          { text: "Optimized AI workflow – AI streamlines content creation and approval processes", score: 3 },
          { text: "Advanced workflow AI – AI predicts bottlenecks and optimizes team collaboration", score: 4 },
          { text: "Seamless AI orchestration – AI manages entire content workflow from ideation to publication", score: 5 }
        ]
      },
      {
        id: "cm_10",
        activity: "content_marketing",
        weight: 2,
        question: "To what extent do you use AI for competitive content analysis and differentiation?",
        options: [
          { text: "No competitive analysis – content created without considering competitor content", score: 0 },
          { text: "Manual competitor review – occasional manual checking of competitor content", score: 1 },
          { text: "Some AI monitoring – AI tracks competitor content but limited analysis", score: 2 },
          { text: "Good AI competitive intelligence – AI analyzes competitor content strategies", score: 3 },
          { text: "Advanced competitive AI – AI identifies content gaps and opportunities", score: 4 },
          { text: "Strategic content AI – AI creates differentiated content strategy based on competitive analysis", score: 5 }
        ]
      }
    ],
    
    social_media: [
      {
        id: "sm_1",
        activity: "social_media",
        weight: 2.5,
        question: "How extensively do you use AI for social media content creation and curation?",
        options: [
          { text: "No AI content – all social posts created manually", score: 0 },
          { text: "Basic AI assistance – occasional AI help with post ideas", score: 1 },
          { text: "Regular AI use – AI generates many post drafts with human editing", score: 2 },
          { text: "AI-driven creation – AI creates most social content with strategic oversight", score: 3 },
          { text: "Advanced AI content – AI generates optimized content for each platform automatically", score: 4 },
          { text: "Intelligent content AI – AI creates personalized social content based on audience analysis", score: 5 }
        ]
      },
      {
        id: "sm_2",
        activity: "social_media",
        weight: 2.5,
        question: "To what extent do you use AI for social media scheduling and posting optimization?",
        options: [
          { text: "Manual posting – posting social content manually at arbitrary times", score: 0 },
          { text: "Basic scheduling – using simple scheduling tools without AI optimization", score: 1 },
          { text: "Some AI timing – AI suggests optimal posting times based on audience activity", score: 2 },
          { text: "AI-optimized scheduling – AI automatically schedules posts for maximum engagement", score: 3 },
          { text: "Advanced scheduling AI – AI optimizes posting frequency, timing, and content mix", score: 4 },
          { text: "Predictive social AI – AI predicts optimal content and timing for each audience segment", score: 5 }
        ]
      },
      {
        id: "sm_3",
        activity: "social_media",
        weight: 2,
        question: "How effectively do you use AI for social media listening and sentiment analysis?",
        options: [
          { text: "No social listening – unaware of brand mentions and social conversations", score: 0 },
          { text: "Manual monitoring – occasionally checking mentions and hashtags manually", score: 1 },
          { text: "Basic AI monitoring – AI tracks mentions but limited sentiment analysis", score: 2 },
          { text: "Good AI listening – AI monitors brand sentiment and identifies trending topics", score: 3 },
          { text: "Advanced social AI – AI provides detailed sentiment insights and conversation analysis", score: 4 },
          { text: "Predictive social intelligence – AI predicts social trends and recommends proactive strategies", score: 5 }
        ]
      },
      {
        id: "sm_4",
        activity: "social_media",
        weight: 2,
        question: "How well do you use AI for social media community management and engagement?",
        options: [
          { text: "Manual engagement – all social interactions handled manually", score: 0 },
          { text: "Basic automation – simple auto-responses for common questions", score: 1 },
          { text: "Some AI assistance – AI helps prioritize and draft responses", score: 2 },
          { text: "AI-enhanced engagement – AI handles routine interactions with human oversight", score: 3 },
          { text: "Advanced community AI – AI manages most community interactions intelligently", score: 4 },
          { text: "Intelligent community management – AI provides personalized, context-aware social engagement", score: 5 }
        ]
      },
      {
        id: "sm_5",
        activity: "social_media",
        weight: 2,
        question: "To what extent do you use AI for social media advertising optimization?",
        options: [
          { text: "Manual ad management – all social advertising managed manually", score: 0 },
          { text: "Basic platform automation – using platform auto-bidding but manual creative and targeting", score: 1 },
          { text: "Some AI optimization – AI assists with bid management and basic targeting", score: 2 },
          { text: "AI-enhanced advertising – AI optimizes targeting, bidding, and creative rotation", score: 3 },
          { text: "Advanced ad AI – AI continuously optimizes all aspects of social advertising", score: 4 },
          { text: "Predictive social advertising – AI predicts optimal ad strategies and automatically adjusts campaigns", score: 5 }
        ]
      },
      {
        id: "sm_6",
        activity: "social_media",
        weight: 2,
        question: "How effectively do you use AI for social media visual content creation?",
        options: [
          { text: "No AI visuals – all social media graphics created manually or sourced separately", score: 0 },
          { text: "Basic AI graphics – occasional use of AI for simple social media images", score: 1 },
          { text: "Regular AI visuals – AI creates many social media graphics with human curation", score: 2 },
          { text: "AI-driven visual content – AI generates most social visuals optimized for each platform", score: 3 },
          { text: "Advanced visual AI – AI creates sophisticated social media visuals with brand consistency", score: 4 },
          { text: "Intelligent visual creation – AI automatically generates platform-optimized visuals for each post", score: 5 }
        ]
      },
      {
        id: "sm_7",
        activity: "social_media",
        weight: 2,
        question: "How well do you use AI for hashtag research and optimization?",
        options: [
          { text: "No hashtag strategy – using hashtags randomly or not at all", score: 0 },
          { text: "Manual hashtag research – researching hashtags manually for each post", score: 1 },
          { text: "Some AI assistance – AI suggests hashtags but requires manual selection", score: 2 },
          { text: "AI hashtag optimization – AI selects optimal hashtags for each post automatically", score: 3 },
          { text: "Advanced hashtag AI – AI creates strategic hashtag campaigns for maximum reach", score: 4 },
          { text: "Predictive hashtag strategy – AI predicts trending hashtags and optimizes hashtag strategy dynamically", score: 5 }
        ]
      },
      {
        id: "sm_8",
        activity: "social_media",
        weight: 2,
        question: "To what extent do you use AI for social media performance analysis and reporting?",
        options: [
          { text: "Manual analysis – basic metrics reviewed manually without AI insights", score: 0 },
          { text: "Basic AI reporting – AI provides simple performance summaries", score: 1 },
          { text: "Some AI insights – AI identifies top-performing content and basic trends", score: 2 },
          { text: "Good AI analytics – AI provides detailed insights on social media performance", score: 3 },
          { text: "Advanced social AI – AI suggests specific optimizations based on performance data", score: 4 },
          { text: "Predictive social analytics – AI predicts social media performance and optimizes strategy continuously", score: 5 }
        ]
      },
      {
        id: "sm_9",
        activity: "social_media",
        weight: 1.5,
        question: "How effectively do you use AI for influencer identification and relationship management?",
        options: [
          { text: "No influencer strategy – not working with influencers or doing so manually", score: 0 },
          { text: "Manual influencer research – finding and managing influencers manually", score: 1 },
          { text: "Some AI assistance – AI helps identify potential influencers", score: 2 },
          { text: "AI influencer matching – AI matches brand with relevant influencers based on audience data", score: 3 },
          { text: "Advanced influencer AI – AI manages influencer campaigns and measures performance", score: 4 },
          { text: "Intelligent influencer ecosystem – AI optimizes entire influencer strategy and relationships", score: 5 }
        ]
      },
      {
        id: "sm_10",
        activity: "social_media",
        weight: 2,
        question: "How well do you use AI for cross-platform social media strategy coordination?",
        options: [
          { text: "Platform silos – each social platform managed independently without coordination", score: 0 },
          { text: "Basic coordination – manually ensuring consistent messaging across platforms", score: 1 },
          { text: "Some AI coordination – AI helps adapt content for different platforms", score: 2 },
          { text: "Good platform AI – AI coordinates messaging and timing across platforms", score: 3 },
          { text: "Advanced cross-platform AI – AI optimizes entire social strategy across all platforms", score: 4 },
          { text: "Unified social AI – AI creates seamless, coordinated social experience across all platforms", score: 5 }
        ]
      }
    ],
    
    seo_sem: [
      {
        id: "seo_1",
        activity: "seo_sem",
        weight: 3,
        question: "How extensively do you use AI for keyword research and content optimization?",
        options: [
          { text: "Manual keyword research – using traditional tools without AI enhancement", score: 0 },
          { text: "Basic AI assistance – AI provides keyword suggestions but manual analysis", score: 1 },
          { text: "AI-enhanced research – AI analyzes keyword opportunities and search intent", score: 2 },
          { text: "Advanced keyword AI – AI identifies comprehensive keyword strategies and content gaps", score: 3 },
          { text: "Predictive keyword AI – AI predicts keyword trends and optimizes content proactively", score: 4 },
          { text: "Intelligent SEO AI – AI continuously optimizes content for evolving search algorithms", score: 5 }
        ]
      },
      {
        id: "seo_2",
        activity: "seo_sem",
        weight: 2.5,
        question: "To what extent do you use AI for technical SEO analysis and optimization?",
        options: [
          { text: "Manual technical SEO – checking technical issues manually with basic tools", score: 0 },
          { text: "Some AI tools – using AI-enhanced tools for basic technical SEO audits", score: 1 },
          { text: "AI-assisted optimization – AI identifies technical SEO issues and suggests fixes", score: 2 },
          { text: "Advanced technical AI – AI continuously monitors and optimizes technical SEO factors", score: 3 },
          { text: "Predictive technical SEO – AI predicts technical issues and prevents SEO problems", score: 4 },
          { text: "Autonomous technical optimization – AI automatically fixes technical SEO issues", score: 5 }
        ]
      },
      {
        id: "seo_3",
        activity: "seo_sem",
        weight: 2.5,
        question: "How effectively do you use AI for search engine marketing (SEM) campaign optimization?",
        options: [
          { text: "Manual SEM management – all paid search campaigns managed manually", score: 0 },
          { text: "Basic platform automation – using platform auto-bidding but manual keyword and ad management", score: 1 },
          { text: "Some AI optimization – AI assists with bid management and basic campaign optimization", score: 2 },
          { text: "AI-enhanced SEM – AI optimizes bids, keywords, and ad copy automatically", score: 3 },
          { text: "Advanced SEM AI – AI continuously optimizes all aspects of paid search campaigns", score: 4 },
          { text: "Predictive SEM optimization – AI predicts search trends and optimizes campaigns proactively", score: 5 }
        ]
      },
      {
        id: "seo_4",
        activity: "seo_sem",
        weight: 2,
        question: "How well do you use AI for competitive SEO analysis and strategy development?",
        options: [
          { text: "No competitive SEO analysis – focusing only on own website optimization", score: 0 },
          { text: "Manual competitor analysis – occasionally checking competitor rankings and keywords", score: 1 },
          { text: "Some AI competitive tools – using AI tools for basic competitor keyword analysis", score: 2 },
          { text: "Good competitive AI – AI provides comprehensive competitor SEO analysis and insights", score: 3 },
          { text: "Advanced competitive intelligence – AI identifies competitor strategies and optimization opportunities", score: 4 },
          { text: "Strategic competitive AI – AI creates differentiated SEO strategies based on competitive landscape", score: 5 }
        ]
      },
      {
        id: "seo_5",
        activity: "seo_sem",
        weight: 2,
        question: "To what extent do you use AI for local SEO and location-based optimization?",
        options: [
          { text: "No local SEO focus – not optimizing for local search or doing so manually", score: 0 },
          { text: "Basic local optimization – manual Google My Business management and basic local citations", score: 1 },
          { text: "Some AI local tools – using AI tools for local keyword research and citation management", score: 2 },
          { text: "AI-enhanced local SEO – AI optimizes local search presence and manages online reviews", score: 3 },
          { text: "Advanced local AI – AI coordinates comprehensive local SEO strategy across all locations", score: 4 },
          { text: "Intelligent local optimization – AI personalizes local search strategy for each market and location", score: 5 }
        ]
      },
      {
        id: "seo_6",
        activity: "seo_sem",
        weight: 2,
        question: "How effectively do you use AI for content gap analysis and search opportunity identification?",
        options: [
          { text: "No gap analysis – creating content without analyzing search opportunities", score: 0 },
          { text: "Manual content planning – identifying content topics based on intuition and basic research", score: 1 },
          { text: "Some AI content insights – AI suggests content topics based on keyword research", score: 2 },
          { text: "AI-driven content strategy – AI identifies content gaps and high-opportunity topics", score: 3 },
          { text: "Advanced content AI – AI creates comprehensive content strategies based on search data", score: 4 },
          { text: "Predictive content optimization – AI predicts content success and optimizes content strategy continuously", score: 5 }
        ]
      },
      {
        id: "seo_7",
        activity: "seo_sem",
        weight: 2,
        question: "How well do you use AI for search performance tracking and reporting?",
        options: [
          { text: "Manual tracking – checking rankings and traffic manually with basic tools", score: 0 },
          { text: "Basic AI reporting – AI provides simple SEO performance summaries", score: 1 },
          { text: "Some AI analytics – AI identifies SEO trends and performance patterns", score: 2 },
          { text: "Good SEO AI analytics – AI provides detailed insights on search performance factors", score: 3 },
          { text: "Advanced SEO intelligence – AI correlates SEO performance with business metrics", score: 4 },
          { text: "Predictive SEO analytics – AI predicts SEO performance and optimizes strategy proactively", score: 5 }
        ]
      },
      {
        id: "seo_8",
        activity: "seo_sem",
        weight: 2,
        question: "To what extent do you use AI for voice search and conversational SEO optimization?",
        options: [
          { text: "No voice search optimization – focusing only on traditional text-based search", score: 0 },
          { text: "Basic voice awareness – some consideration of voice search in content creation", score: 1 },
          { text: "Some voice optimization – AI helps identify conversational keywords and phrases", score: 2 },
          { text: "Good voice SEO – AI optimizes content for voice search and featured snippets", score: 3 },
          { text: "Advanced conversational AI – AI creates content optimized for natural language queries", score: 4 },
          { text: "Predictive voice optimization – AI anticipates voice search trends and optimizes proactively", score: 5 }
        ]
      },
      {
        id: "seo_9",
        activity: "seo_sem",
        weight: 1.5,
        question: "How effectively do you use AI for link building and authority development?",
        options: [
          { text: "Manual link building – traditional outreach and relationship building without AI", score: 0 },
          { text: "Some AI tools – using AI for prospect identification but manual outreach", score: 1 },
          { text: "AI-assisted outreach – AI helps personalize link building emails and track responses", score: 2 },
          { text: "Good link building AI – AI identifies high-quality link opportunities and optimizes outreach", score: 3 },
          { text: "Advanced authority AI – AI creates comprehensive authority building strategies", score: 4 },
          { text: "Intelligent link ecosystem – AI builds and maintains authority through automated relationship building", score: 5 }
        ]
      },
      {
        id: "seo_10",
        activity: "seo_sem",
        weight: 2,
        question: "How well do you integrate AI SEO insights with overall marketing strategy?",
        options: [
          { text: "SEO isolation – SEO operates independently from other marketing activities", score: 0 },
          { text: "Basic integration – some sharing of SEO insights with other marketing teams", score: 1 },
          { text: "Some AI coordination – AI SEO insights inform other marketing channels occasionally", score: 2 },
          { text: "Good marketing integration – AI SEO insights regularly inform overall marketing strategy", score: 3 },
          { text: "Advanced integration – AI creates unified marketing strategy incorporating SEO insights", score: 4 },
          { text: "Seamless marketing AI – AI optimizes entire marketing strategy with SEO as integrated component", score: 5 }
        ]
      }
    ],
    
    email_marketing: [
      {
        id: "em_1",
        activity: "email_marketing",
        weight: 3,
        question: "How extensively do you use AI for email content creation and personalization?",
        options: [
          { text: "No AI email content – all emails written manually with basic segmentation", score: 0 },
          { text: "Basic AI assistance – AI helps with subject lines or simple content suggestions", score: 1 },
          { text: "Some AI personalization – AI customizes email content for different segments", score: 2 },
          { text: "Advanced email AI – AI creates personalized email content for individual recipients", score: 3 },
          { text: "Dynamic AI emails – AI generates real-time personalized content based on recipient behavior", score: 4 },
          { text: "Intelligent email AI – AI creates hyper-personalized emails optimized for each recipient", score: 5 }
        ]
      },
      {
        id: "em_2",
        activity: "email_marketing",
        weight: 2.5,
        question: "To what extent do you use AI for email send time and frequency optimization?",
        options: [
          { text: "Fixed scheduling – sending emails at the same time for all recipients", score: 0 },
          { text: "Basic segmentation – different send times for broad audience segments", score: 1 },
          { text: "Some AI timing – AI suggests optimal send times based on engagement data", score: 2 },
          { text: "AI-optimized scheduling – AI automatically schedules emails for optimal engagement", score: 3 },
          { text: "Advanced timing AI – AI optimizes send times individually for each recipient", score: 4 },
          { text: "Predictive timing optimization – AI predicts optimal communication frequency and timing for maximum lifetime value", score: 5 }
        ]
      },
      {
        id: "em_3",
        activity: "email_marketing",
        weight: 2.5,
        question: "How effectively do you use AI for email automation and workflow optimization?",
        options: [
          { text: "Manual email campaigns – sending individual emails without automation sequences", score: 0 },
          { text: "Basic automation – simple autoresponder sequences without AI optimization", score: 1 },
          { text: "Some AI workflows – AI helps optimize basic email automation sequences", score: 2 },
          { text: "Advanced automation AI – AI creates and optimizes complex email workflows", score: 3 },
          { text: "Intelligent workflow optimization – AI continuously optimizes email sequences based on performance", score: 4 },
          { text: "Predictive email automation – AI predicts optimal email journeys and creates dynamic workflows", score: 5 }
        ]
      },
      {
        id: "em_4",
        activity: "email_marketing",
        weight: 2,
        question: "How well do you use AI for email list segmentation and audience analysis?",
        options: [
          { text: "No segmentation – sending same emails to entire list", score: 0 },
          { text: "Basic manual segmentation – simple demographic or behavioral categories", score: 1 },
          { text: "Some AI segmentation – AI helps identify audience segments based on engagement patterns", score: 2 },
          { text: "Advanced AI segmentation – AI creates sophisticated audience segments for targeted campaigns", score: 3 },
          { text: "Dynamic AI audience analysis – AI continuously updates segments based on behavior changes", score: 4 },
          { text: "Predictive audience intelligence – AI predicts audience behavior and creates proactive segmentation strategies", score: 5 }
        ]
      },
      {
        id: "em_5",
        activity: "email_marketing",
        weight: 2,
        question: "To what extent do you use AI for email deliverability optimization?",
        options: [
          { text: "No deliverability optimization – sending emails without monitoring delivery rates", score: 0 },
          { text: "Basic monitoring – checking delivery rates but no AI optimization", score: 1 },
          { text: "Some AI tools – using AI tools for spam score checking and basic deliverability analysis", score: 2 },
          { text: "Good deliverability AI – AI optimizes email content and timing for better deliverability", score: 3 },
          { text: "Advanced delivery optimization – AI manages sender reputation and optimizes all deliverability factors", score: 4 },
          { text: "Intelligent deliverability management – AI predicts and prevents deliverability issues proactively", score: 5 }
        ]
      },
      {
        id: "em_6",
        activity: "email_marketing",
        weight: 2,
        question: "How effectively do you use AI for email A/B testing and optimization?",
        options: [
          { text: "No A/B testing – sending emails without testing different versions", score: 0 },
          { text: "Manual A/B testing – testing different versions manually without AI analysis", score: 1 },
          { text: "Some AI testing insights – AI helps analyze A/B test results", score: 2 },
          { text: "AI-enhanced testing – AI suggests test variations and analyzes results automatically", score: 3 },
          { text: "Advanced testing AI – AI runs continuous multivariate tests and optimizes automatically", score: 4 },
          { text: "Predictive testing optimization – AI predicts test outcomes and optimizes without manual testing", score: 5 }
        ]
      },
      {
        id: "em_7",
        activity: "email_marketing",
        weight: 2,
        question: "How well do you use AI for email performance analytics and reporting?",
        options: [
          { text: "Basic metrics only – tracking opens and clicks manually without AI insights", score: 0 },
          { text: "Some AI reporting – AI provides basic performance summaries", score: 1 },
          { text: "AI-enhanced analytics – AI identifies trends and patterns in email performance", score: 2 },
          { text: "Advanced email AI analytics – AI provides detailed insights on email effectiveness factors", score: 3 },
          { text: "Predictive email analytics – AI predicts email performance and suggests optimizations", score: 4 },
          { text: "Intelligent email intelligence – AI provides strategic insights linking email performance to business outcomes", score: 5 }
        ]
      },
      {
        id: "em_8",
        activity: "email_marketing",
        weight: 2,
        question: "To what extent do you use AI for email list growth and lead nurturing optimization?",
        options: [
          { text: "Manual list building – growing email list through traditional methods without AI", score: 0 },
          { text: "Basic lead magnets – using simple opt-in forms and lead magnets", score: 1 },
          { text: "Some AI optimization – AI helps optimize opt-in forms and lead magnet performance", score: 2 },
          { text: "AI-enhanced lead generation – AI optimizes entire lead capture and nurturing process", score: 3 },
          { text: "Advanced lead AI – AI predicts optimal lead nurturing strategies for different prospects", score: 4 },
          { text: "Intelligent lead ecosystem – AI creates comprehensive lead generation and nurturing system", score: 5 }
        ]
      },
      {
        id: "em_9",
        activity: "email_marketing",
        weight: 1.5,
        question: "How effectively do you use AI for email design and visual optimization?",
        options: [
          { text: "Manual email design – creating all email templates and designs manually", score: 0 },
          { text: "Basic templates – using standard email templates without AI optimization", score: 1 },
          { text: "Some AI design tools – using AI for basic email design elements", score: 2 },
          { text: "AI-enhanced design – AI optimizes email layouts and visual elements for engagement", score: 3 },
          { text: "Advanced design AI – AI creates personalized email designs for different segments", score: 4 },
          { text: "Intelligent visual optimization – AI continuously optimizes email design for maximum impact", score: 5 }
        ]
      },
      {
        id: "em_10",
        activity: "email_marketing",
        weight: 2,
        question: "How well do you integrate AI email insights with overall customer journey optimization?",
        options: [
          { text: "Email isolation – email marketing operates independently from other customer touchpoints", score: 0 },
          { text: "Basic integration – some coordination between email and other marketing channels", score: 1 },
          { text: "Some AI coordination – AI email insights occasionally inform other marketing activities", score: 2 },
          { text: "Good integration – AI email data regularly contributes to overall customer journey optimization", score: 3 },
          { text: "Advanced customer AI – AI creates unified customer journey incorporating email insights", score: 4 },
          { text: "Seamless journey optimization – AI optimizes entire customer experience with email as integrated component", score: 5 }
        ]
      }
    ],
    
    analytics_data: [
      {
        id: "ad_1",
        activity: "analytics_data",
        weight: 3,
        question: "How extensively do you use AI for data collection, integration, and preparation?",
        options: [
          { text: "Manual data handling – collecting and preparing data manually without AI assistance", score: 0 },
          { text: "Basic automation – some automated data collection but manual preparation", score: 1 },
          { text: "Some AI integration – AI helps with data cleaning and basic preparation tasks", score: 2 },
          { text: "AI-enhanced data pipeline – AI automates most data collection and preparation processes", score: 3 },
          { text: "Advanced data AI – AI creates sophisticated data pipelines with quality monitoring", score: 4 },
          { text: "Intelligent data ecosystem – AI automatically manages all aspects of data lifecycle", score: 5 }
        ]
      },
      {
        id: "ad_2",
        activity: "analytics_data",
        weight: 3,
        question: "To what extent do you use AI for predictive analytics and forecasting?",
        options: [
          { text: "No predictive analytics – using historical data analysis only", score: 0 },
          { text: "Basic forecasting – simple trend analysis without AI", score: 1 },
          { text: "Some AI predictions – using AI for basic forecasting and trend identification", score: 2 },
          { text: "Advanced predictive AI – AI creates sophisticated forecasts for key business metrics", score: 3 },
          { text: "Comprehensive predictive analytics – AI predicts customer behavior, market trends, and business outcomes", score: 4 },
          { text: "Intelligent forecasting system – AI provides real-time predictive insights driving strategic decisions", score: 5 }
        ]
      },
      {
        id: "ad_3",
        activity: "analytics_data",
        weight: 2.5,
        question: "How effectively do you use AI for automated insights generation and anomaly detection?",
        options: [
          { text: "Manual analysis – reviewing data manually to identify trends and anomalies", score: 0 },
          { text: "Basic alerts – simple threshold alerts without AI analysis", score: 1 },
          { text: "Some AI insights – AI identifies basic patterns and unusual data points", score: 2 },
          { text: "Advanced AI analytics – AI automatically generates insights and flags important anomalies", score: 3 },
          { text: "Intelligent anomaly detection – AI predicts and explains unusual patterns with context", score: 4 },
          { text: "Proactive AI intelligence – AI anticipates issues and provides predictive insights automatically", score: 5 }
        ]
      },
      {
        id: "ad_4",
        activity: "analytics_data",
        weight: 2.5,
        question: "How well do you use AI for customer segmentation and behavioral analysis?",
        options: [
          { text: "Basic segmentation – simple demographic or purchase-based customer groups", score: 0 },
          { text: "Manual behavioral analysis – analyzing customer behavior patterns manually", score: 1 },
          { text: "Some AI segmentation – AI helps identify customer segments based on behavior data", score: 2 },
          { text: "Advanced customer AI – AI creates sophisticated behavioral segments and predicts customer actions", score: 3 },
          { text: "Predictive customer intelligence – AI predicts customer lifetime value and optimal engagement strategies", score: 4 },
          { text: "Intelligent customer ecosystem – AI provides comprehensive customer intelligence driving personalization", score: 5 }
        ]
      },
      {
        id: "ad_5",
        activity: "analytics_data",
        weight: 2,
        question: "To what extent do you use AI for marketing attribution and ROI analysis?",
        options: [
          { text: "Basic attribution – using last-click or simple first-click attribution models", score: 0 },
          { text: "Manual ROI calculation – calculating marketing ROI manually without AI insights", score: 1 },
          { text: "Some AI attribution – using AI tools for multi-touch attribution analysis", score: 2 },
          { text: "Advanced attribution AI – AI creates sophisticated attribution models accounting for all touchpoints", score: 3 },
          { text: "Predictive ROI modeling – AI predicts marketing ROI and optimizes budget allocation", score: 4 },
          { text: "Intelligent attribution ecosystem – AI provides comprehensive attribution insights driving strategic decisions", score: 5 }
        ]
      },
      {
        id: "ad_6",
        activity: "analytics_data",
        weight: 2,
        question: "How effectively do you use AI for competitive analysis and market intelligence?",
        options: [
          { text: "No competitive analysis – focusing only on internal data without market context", score: 0 },
          { text: "Manual competitive research – occasionally researching competitors manually", score: 1 },
          { text: "Some AI competitive tools – using AI tools for basic competitor monitoring", score: 2 },
          { text: "Advanced competitive AI – AI provides comprehensive competitor analysis and market insights", score: 3 },
          { text: "Predictive market intelligence – AI predicts competitor moves and market trends", score: 4 },
          { text: "Strategic competitive AI – AI creates differentiated strategies based on comprehensive market intelligence", score: 5 }
        ]
      },
      {
        id: "ad_7",
        activity: "analytics_data",
        weight: 2,
        question: "How well do you use AI for data visualization and dashboard automation?",
        options: [
          { text: "Manual reporting – creating charts and reports manually without AI assistance", score: 0 },
          { text: "Basic dashboard tools – using standard dashboard tools without AI enhancement", score: 1 },
          { text: "Some AI visualization – AI helps create basic charts and automated reports", score: 2 },
          { text: "AI-enhanced dashboards – AI creates intelligent dashboards with automated insights", score: 3 },
          { text: "Advanced visualization AI – AI generates contextual visualizations and interactive insights", score: 4 },
          { text: "Intelligent reporting system – AI automatically creates comprehensive reports with strategic recommendations", score: 5 }
        ]
      },
      {
        id: "ad_8",
        activity: "analytics_data",
        weight: 2,
        question: "To what extent do you use AI for real-time analytics and decision support?",
        options: [
          { text: "Batch reporting only – analyzing data in weekly or monthly batches", score: 0 },
          { text: "Basic real-time dashboards – showing current metrics without AI analysis", score: 1 },
          { text: "Some real-time AI – AI provides basic real-time insights and alerts", score: 2 },
          { text: "Advanced real-time analytics – AI analyzes streaming data and provides immediate insights", score: 3 },
          { text: "Predictive real-time AI – AI predicts trends and recommends immediate actions", score: 4 },
          { text: "Intelligent decision support – AI provides real-time strategic recommendations driving immediate decisions", score: 5 }
        ]
      },
      {
        id: "ad_9",
        activity: "analytics_data",
        weight: 2,
        question: "How effectively do you use AI for data quality management and governance?",
        options: [
          { text: "No data quality management – using data without systematic quality checks", score: 0 },
          { text: "Manual quality checks – reviewing data quality manually on ad-hoc basis", score: 1 },
          { text: "Some AI quality tools – using AI for basic data validation and cleaning", score: 2 },
          { text: "Advanced data quality AI – AI continuously monitors and improves data quality", score: 3 },
          { text: "Intelligent data governance – AI manages comprehensive data governance framework", score: 4 },
          { text: "Autonomous data management – AI automatically maintains optimal data quality and governance", score: 5 }
        ]
      },
      {
        id: "ad_10",
        activity: "analytics_data",
        weight: 2.5,
        question: "How well do you integrate AI analytics insights with business strategy and decision-making?",
        options: [
          { text: "Analytics isolation – data analysis operates independently from business strategy", score: 0 },
          { text: "Occasional insights sharing – sometimes sharing analytics insights with leadership", score: 1 },
          { text: "Regular reporting – providing regular analytics reports to inform business decisions", score: 2 },
          { text: "Strategic analytics integration – AI insights regularly inform business strategy development", score: 3 },
          { text: "Advanced decision support – AI analytics drive strategic business decisions proactively", score: 4 },
          { text: "Intelligent business optimization – AI analytics automatically optimize business strategy and operations", score: 5 }
        ]
      }
    ],
    
    paid_advertising: [
      {
        id: "pa_1",
        activity: "paid_advertising",
        weight: 3,
        question: "How extensively do you use AI for campaign setup, targeting, and optimization?",
        options: [
          { text: "Manual campaign management – setting up and managing all campaigns manually", score: 0 },
          { text: "Basic platform automation – using platform auto-bidding but manual targeting and creative", score: 1 },
          { text: "Some AI optimization – AI assists with bid management and basic targeting optimization", score: 2 },
          { text: "Advanced AI campaigns – AI optimizes targeting, bidding, and creative rotation automatically", score: 3 },
          { text: "Comprehensive campaign AI – AI manages all aspects of campaign optimization with strategic oversight", score: 4 },
          { text: "Intelligent advertising ecosystem – AI creates and optimizes entire advertising strategy autonomously", score: 5 }
        ]
      },
      {
        id: "pa_2",
        activity: "paid_advertising",
        weight: 2.5,
        question: "To what extent do you use AI for creative generation and ad copy optimization?",
        options: [
          { text: "Manual creative development – creating all ad copy and creative assets manually", score: 0 },
          { text: "Basic creative tools – using simple tools for ad creation without AI enhancement", score: 1 },
          { text: "Some AI creative assistance – AI helps generate ad copy variations and basic creative elements", score: 2 },
          { text: "Advanced creative AI – AI generates optimized ad copy and creative assets for different audiences", score: 3 },
          { text: "Dynamic creative optimization – AI creates and tests unlimited creative variations automatically", score: 4 },
          { text: "Intelligent creative ecosystem – AI generates personalized creative assets optimized for individual users", score: 5 }
        ]
      },
      {
        id: "pa_3",
        activity: "paid_advertising",
        weight: 2.5,
        question: "How effectively do you use AI for audience targeting and lookalike modeling?",
        options: [
          { text: "Basic demographic targeting – using simple demographic and interest-based targeting", score: 0 },
          { text: "Manual audience creation – creating custom audiences manually without AI insights", score: 1 },
          { text: "Some AI audience tools – using platform AI for basic lookalike audiences", score: 2 },
          { text: "Advanced audience AI – AI creates sophisticated audience segments based on behavior and intent", score: 3 },
          { text: "Predictive audience modeling – AI predicts optimal audiences and continuously refines targeting", score: 4 },
          { text: "Intelligent audience ecosystem – AI creates dynamic, personalized targeting for maximum conversion", score: 5 }
        ]
      },
      {
        id: "pa_4",
        activity: "paid_advertising",
        weight: 2,
        question: "How well do you use AI for bid management and budget optimization?",
        options: [
          { text: "Manual bidding – setting and adjusting bids manually based on intuition", score: 0 },
          { text: "Basic automated bidding – using simple platform bidding strategies", score: 1 },
          { text: "Some AI bid optimization – using AI tools for enhanced bid management", score: 2 },
          { text: "Advanced bidding AI – AI optimizes bids and budgets across campaigns and platforms", score: 3 },
          { text: "Predictive bid optimization – AI predicts optimal bidding strategies and adjusts proactively", score: 4 },
          { text: "Intelligent budget ecosystem – AI manages entire advertising budget allocation for maximum ROI", score: 5 }
        ]
      },
      {
        id: "pa_5",
        activity: "paid_advertising",
        weight: 2,
        question: "To what extent do you use AI for cross-platform campaign coordination?",
        options: [
          { text: "Platform silos – managing each advertising platform independently", score: 0 },
          { text: "Manual coordination – manually ensuring consistent messaging across platforms", score: 1 },
          { text: "Some cross-platform tools – using tools that connect multiple platforms with basic AI", score: 2 },
          { text: "Good platform integration – AI coordinates campaigns across multiple platforms effectively", score: 3 },
          { text: "Advanced cross-platform AI – AI optimizes entire advertising strategy across all platforms", score: 4 },
          { text: "Unified advertising AI – AI creates seamless, coordinated advertising experience across all platforms", score: 5 }
        ]
      },
      {
        id: "pa_6",
        activity: "paid_advertising",
        weight: 2,
        question: "How effectively do you use AI for landing page optimization and conversion tracking?",
        options: [
          { text: "Static landing pages – using the same landing pages for all campaigns", score: 0 },
          { text: "Basic A/B testing – manually testing different landing page versions", score: 1 },
          { text: "Some AI optimization – using AI tools for basic landing page testing and optimization", score: 2 },
          { text: "Advanced landing page AI – AI creates and optimizes landing pages for different campaigns and audiences", score: 3 },
          { text: "Dynamic page optimization – AI continuously optimizes landing pages based on visitor behavior", score: 4 },
          { text: "Intelligent conversion ecosystem – AI creates personalized landing experiences for maximum conversion", score: 5 }
        ]
      },
      {
        id: "pa_7",
        activity: "paid_advertising",
        weight: 2,
        question: "How well do you use AI for advertising performance analysis and reporting?",
        options: [
          { text: "Manual reporting – reviewing campaign metrics manually without AI insights", score: 0 },
          { text: "Basic automated reports – using platform reporting tools without AI enhancement", score: 1 },
          { text: "Some AI analytics – AI provides basic insights on campaign performance", score: 2 },
          { text: "Advanced advertising analytics – AI provides detailed insights on performance factors and optimization opportunities", score: 3 },
          { text: "Predictive advertising intelligence – AI predicts campaign performance and suggests strategic improvements", score: 4 },
          { text: "Intelligent advertising optimization – AI provides comprehensive strategic insights driving advertising decisions", score: 5 }
        ]
      },
      {
        id: "pa_8",
        activity: "paid_advertising",
        weight: 2,
        question: "To what extent do you use AI for fraud detection and ad quality management?",
        options: [
          { text: "No fraud detection – relying only on platform fraud prevention", score: 0 },
          { text: "Basic monitoring – occasionally checking for obvious fraudulent activity", score: 1 },
          { text: "Some AI fraud tools – using third-party AI tools for fraud detection", score: 2 },
          { text: "Advanced fraud AI – AI continuously monitors and prevents advertising fraud", score: 3 },
          { text: "Predictive fraud prevention – AI predicts and prevents fraud before it occurs", score: 4 },
          { text: "Intelligent ad quality system – AI ensures comprehensive ad quality and fraud protection", score: 5 }
        ]
      },
      {
        id: "pa_9",
        activity: "paid_advertising",
        weight: 2,
        question: "How effectively do you use AI for competitive advertising analysis?",
        options: [
          { text: "No competitive analysis – focusing only on own advertising performance", score: 0 },
          { text: "Manual competitor monitoring – occasionally checking competitor ads", score: 1 },
          { text: "Some AI competitive tools – using AI tools for basic competitor ad monitoring", score: 2 },
          { text: "Advanced competitive intelligence – AI provides comprehensive competitor advertising analysis", score: 3 },
          { text: "Predictive competitive AI – AI predicts competitor advertising strategies and suggests responses", score: 4 },
          { text: "Strategic competitive advantage – AI creates differentiated advertising strategies based on competitive intelligence", score: 5 }
        ]
      },
      {
        id: "pa_10",
        activity: "paid_advertising",
        weight: 2,
        question: "How well do you integrate AI advertising insights with overall marketing attribution?",
        options: [
          { text: "Advertising isolation – paid advertising data not integrated with other marketing channels", score: 0 },
          { text: "Basic integration – some sharing of advertising data with other marketing teams", score: 1 },
          { text: "Some attribution integration – advertising data included in basic attribution models", score: 2 },
          { text: "Good attribution AI – AI integrates advertising data into comprehensive attribution analysis", score: 3 },
          { text: "Advanced marketing attribution – AI creates unified attribution including all advertising touchpoints", score: 4 },
          { text: "Intelligent marketing ecosystem – AI optimizes entire marketing strategy with advertising as integrated component", score: 5 }
        ]
      }
    ],
    
    creative_design: [
      {
        id: "cd_1",
        activity: "creative_design",
        weight: 3,
        question: "How extensively do you use AI for graphic design and visual content creation?",
        options: [
          { text: "No AI design tools – all graphics and visuals created manually or sourced traditionally", score: 0 },
          { text: "Basic AI assistance – occasional use of AI for simple graphics or image enhancement", score: 1 },
          { text: "Regular AI design use – AI creates many graphics and visuals with human curation", score: 2 },
          { text: "Advanced design AI – AI generates most visual content with sophisticated editing and optimization", score: 3 },
          { text: "Comprehensive creative AI – AI handles complex design projects with brand consistency", score: 4 },
          { text: "Intelligent design ecosystem – AI creates sophisticated, brand-aligned visuals autonomously", score: 5 }
        ]
      },
      {
        id: "cd_2",
        activity: "creative_design",
        weight: 2.5,
        question: "To what extent do you use AI for brand consistency and style guide enforcement?",
        options: [
          { text: "Manual brand compliance – checking brand consistency manually across all materials", score: 0 },
          { text: "Basic brand guidelines – using standard brand guidelines without AI enforcement", score: 1 },
          { text: "Some AI brand tools – using AI tools for basic brand compliance checking", score: 2 },
          { text: "Advanced brand AI – AI automatically ensures brand consistency across all creative materials", score: 3 },
          { text: "Intelligent brand management – AI optimizes brand expression while maintaining consistency", score: 4 },
          { text: "Autonomous brand system – AI creates and maintains perfect brand consistency across all creative outputs", score: 5 }
        ]
      },
      {
        id: "cd_3",
        activity: "creative_design",
        weight: 2.5,
        question: "How effectively do you use AI for video creation and editing?",
        options: [
          { text: "No AI video tools – all video content created and edited manually", score: 0 },
          { text: "Basic video AI – using simple AI tools for basic video editing tasks", score: 1 },
          { text: "Some AI video creation – AI assists with video generation and basic editing", score: 2 },
          { text: "Advanced video AI – AI creates and edits videos with sophisticated capabilities", score: 3 },
          { text: "Comprehensive video automation – AI handles complex video projects from script to final edit", score: 4 },
          { text: "Intelligent video ecosystem – AI creates personalized, optimized video content automatically", score: 5 }
        ]
      },
      {
        id: "cd_4",
        activity: "creative_design",
        weight: 2,
        question: "How well do you use AI for creative ideation and concept development?",
        options: [
          { text: "Traditional brainstorming – relying solely on human creativity for concept development", score: 0 },
          { text: "Basic AI inspiration – occasionally using AI for creative inspiration or references", score: 1 },
          { text: "AI-assisted ideation – AI helps generate creative concepts and ideas", score: 2 },
          { text: "Advanced creative AI – AI provides sophisticated creative concepts and strategic direction", score: 3 },
          { text: "Collaborative creative intelligence – AI and humans work together seamlessly on creative development", score: 4 },
          { text: "Intelligent creative system – AI generates innovative creative concepts that humans refine and execute", score: 5 }
        ]
      },
      {
        id: "cd_5",
        activity: "creative_design",
        weight: 2,
        question: "To what extent do you use AI for image editing and photo manipulation?",
        options: [
          { text: "Manual photo editing – all image editing done manually with traditional tools", score: 0 },
          { text: "Basic AI photo tools – using simple AI features in standard editing software", score: 1 },
          { text: "Some AI enhancement – regular use of AI for photo enhancement and basic editing", score: 2 },
          { text: "Advanced photo AI – AI handles complex photo editing and manipulation tasks", score: 3 },
          { text: "Sophisticated image AI – AI creates complex photo compositions and artistic effects", score: 4 },
          { text: "Intelligent photo ecosystem – AI automatically optimizes and enhances all visual content", score: 5 }
        ]
      },
      {
        id: "cd_6",
        activity: "creative_design",
        weight: 2,
        question: "How effectively do you use AI for layout design and composition optimization?",
        options: [
          { text: "Manual layout design – all layouts created manually based on design principles", score: 0 },
          { text: "Template-based design – using standard templates without AI optimization", score: 1 },
          { text: "Some AI layout assistance – AI helps with basic layout suggestions and optimization", score: 2 },
          { text: "Advanced layout AI – AI creates optimized layouts for different formats and purposes", score: 3 },
          { text: "Intelligent composition system – AI generates sophisticated layouts optimized for engagement", score: 4 },
          { text: "Autonomous design optimization – AI creates perfect layouts automatically for any content type", score: 5 }
        ]
      },
      {
        id: "cd_7",
        activity: "creative_design",
        weight: 2,
        question: "How well do you use AI for color palette selection and design optimization?",
        options: [
          { text: "Manual color selection – choosing colors based on intuition and basic color theory", score: 0 },
          { text: "Basic color tools – using standard color palette tools without AI", score: 1 },
          { text: "Some AI color assistance – AI suggests color palettes for designs", score: 2 },
          { text: "Advanced color AI – AI optimizes color choices for brand consistency and psychological impact", score: 3 },
          { text: "Intelligent color system – AI creates sophisticated color strategies for maximum effectiveness", score: 4 },
          { text: "Autonomous color optimization – AI automatically selects perfect colors for any design context", score: 5 }
        ]
      },
      {
        id: "cd_8",
        activity: "creative_design",
        weight: 2,
        question: "To what extent do you use AI for typography and font optimization?",
        options: [
          { text: "Manual font selection – choosing fonts based on personal preference and basic guidelines", score: 0 },
          { text: "Standard font libraries – using traditional font libraries without AI guidance", score: 1 },
          { text: "Some AI typography tools – AI suggests fonts and typography improvements", score: 2 },
          { text: "Advanced typography AI – AI optimizes font choices for readability and brand alignment", score: 3 },
          { text: "Intelligent typography system – AI creates sophisticated typography strategies for maximum impact", score: 4 },
          { text: "Autonomous typography optimization – AI automatically selects and optimizes typography for any design", score: 5 }
        ]
      },
      {
        id: "cd_9",
        activity: "creative_design",
        weight: 2,
        question: "How effectively do you use AI for creative performance analysis and optimization?",
        options: [
          { text: "No creative analytics – creating designs without analyzing performance", score: 0 },
          { text: "Basic performance tracking – manually reviewing which designs perform better", score: 1 },
          { text: "Some AI creative analytics – AI provides basic insights on creative performance", score: 2 },
          { text: "Advanced creative intelligence – AI analyzes creative elements and provides optimization insights", score: 3 },
          { text: "Predictive creative AI – AI predicts creative performance and suggests improvements", score: 4 },
          { text: "Intelligent creative optimization – AI continuously optimizes creative strategy based on performance data", score: 5 }
        ]
      },
      {
        id: "cd_10",
        activity: "creative_design",
        weight: 2,
        question: "How well do you integrate AI creative tools with your overall marketing workflow?",
        options: [
          { text: "Creative isolation – creative tools operate independently from marketing workflow", score: 0 },
          { text: "Basic integration – some sharing of creative assets with marketing teams", score: 1 },
          { text: "Some workflow integration – AI creative tools connected to basic marketing processes", score: 2 },
          { text: "Good marketing integration – AI creative tools integrate well with marketing campaigns", score: 3 },
          { text: "Advanced creative workflow – AI optimizes creative production for entire marketing strategy", score: 4 },
          { text: "Seamless creative ecosystem – AI creative tools automatically optimize for marketing objectives", score: 5 }
        ]
      }
    ],
    
    marketing_automation: [
      {
        id: "ma_1",
        activity: "marketing_automation",
        weight: 3,
        question: "How extensively do you use AI for lead scoring and qualification?",
        options: [
          { text: "Manual lead scoring – evaluating leads manually based on basic criteria", score: 0 },
          { text: "Simple rule-based scoring – using basic point systems without AI", score: 1 },
          { text: "Some AI lead scoring – AI assists with lead scoring based on behavior patterns", score: 2 },
          { text: "Advanced AI scoring – AI creates sophisticated lead scoring models with multiple data points", score: 3 },
          { text: "Predictive lead intelligence – AI predicts lead conversion probability and optimal engagement timing", score: 4 },
          { text: "Intelligent lead ecosystem – AI automatically qualifies, scores, and routes leads for maximum conversion", score: 5 }
        ]
      },
      {
        id: "ma_2",
        activity: "marketing_automation",
        weight: 2.5,
        question: "To what extent do you use AI for workflow automation and optimization?",
        options: [
          { text: "Manual workflows – managing all marketing processes manually", score: 0 },
          { text: "Basic automation – simple if/then rules for basic workflow automation", score: 1 },
          { text: "Some AI workflow optimization – AI helps optimize existing marketing workflows", score: 2 },
          { text: "Advanced workflow AI – AI creates and manages complex marketing workflows automatically", score: 3 },
          { text: "Intelligent workflow optimization – AI continuously optimizes workflows based on performance data", score: 4 },
          { text: "Autonomous workflow management – AI creates and manages all marketing workflows independently", score: 5 }
        ]
      },
      {
        id: "ma_3",
        activity: "marketing_automation",
        weight: 2.5,
        question: "How effectively do you use AI for customer journey mapping and optimization?",
        options: [
          { text: "Manual journey mapping – creating customer journeys based on assumptions and basic data", score: 0 },
          { text: "Basic journey tracking – simple customer journey analysis without AI insights", score: 1 },
          { text: "Some AI journey analysis – AI helps identify customer journey patterns and bottlenecks", score: 2 },
          { text: "Advanced journey AI – AI creates detailed customer journey maps with optimization recommendations", score: 3 },
          { text: "Predictive journey optimization – AI predicts optimal customer journeys and adjusts automatically", score: 4 },
          { text: "Intelligent journey orchestration – AI creates personalized customer journeys in real-time", score: 5 }
        ]
      },
      {
        id: "ma_4",
        activity: "marketing_automation",
        weight: 2,
        question: "How well do you use AI for personalization at scale across marketing touchpoints?",
        options: [
          { text: "No personalization – same marketing messages for all customers", score: 0 },
          { text: "Basic segmentation – simple demographic or behavioral groupings", score: 1 },
          { text: "Some AI personalization – AI customizes content for different customer segments", score: 2 },
          { text: "Advanced personalization – AI creates individualized experiences across multiple touchpoints", score: 3 },
          { text: "Real-time personalization – AI personalizes every customer interaction in real-time", score: 4 },
          { text: "Intelligent personalization ecosystem – AI creates hyper-personalized experiences across all customer touchpoints", score: 5 }
        ]
      },
      {
        id: "ma_5",
        activity: "marketing_automation",
        weight: 2,
        question: "To what extent do you use AI for campaign trigger optimization and timing?",
        options: [
          { text: "Manual campaign timing – launching campaigns based on calendar or intuition", score: 0 },
          { text: "Basic scheduling – simple time-based or event-based campaign triggers", score: 1 },
          { text: "Some AI timing optimization – AI suggests optimal timing for campaign launches", score: 2 },
          { text: "Advanced trigger AI – AI optimizes campaign triggers based on customer behavior and engagement patterns", score: 3 },
          { text: "Predictive timing optimization – AI predicts optimal campaign timing for maximum impact", score: 4 },
          { text: "Intelligent campaign orchestration – AI automatically triggers and optimizes campaigns in real-time", score: 5 }
        ]
      },
      {
        id: "ma_6",
        activity: "marketing_automation",
        weight: 2,
        question: "How effectively do you use AI for cross-channel marketing coordination?",
        options: [
          { text: "Channel silos – each marketing channel operates independently", score: 0 },
          { text: "Manual coordination – manually ensuring consistent messaging across channels", score: 1 },
          { text: "Some AI coordination – AI helps coordinate messaging and timing across channels", score: 2 },
          { text: "Good cross-channel AI – AI optimizes campaigns across multiple channels effectively", score: 3 },
          { text: "Advanced omnichannel AI – AI creates seamless customer experiences across all channels", score: 4 },
          { text: "Intelligent channel orchestration – AI automatically optimizes entire cross-channel marketing strategy", score: 5 }
        ]
      },
      {
        id: "ma_7",
        activity: "marketing_automation",
        weight: 2,
        question: "How well do you use AI for marketing performance measurement and attribution?",
        options: [
          { text: "Basic metrics tracking – tracking simple metrics without AI-driven attribution", score: 0 },
          { text: "Manual attribution analysis – analyzing campaign attribution manually", score: 1 },
          { text: "Some AI attribution – AI helps with multi-touch attribution analysis", score: 2 },
          { text: "Advanced attribution AI – AI creates sophisticated attribution models for all marketing activities", score: 3 },
          { text: "Predictive performance measurement – AI predicts marketing performance and optimizes for better results", score: 4 },
          { text: "Intelligent performance ecosystem – AI provides comprehensive performance insights driving strategic decisions", score: 5 }
        ]
      },
      {
        id: "ma_8",
        activity: "marketing_automation",
        weight: 2,
        question: "To what extent do you use AI for dynamic content creation and optimization?",
        options: [
          { text: "Static content – using the same content for all marketing automation campaigns", score: 0 },
          { text: "Manual content variants – creating different content versions manually", score: 1 },
          { text: "Some AI content optimization – AI helps optimize content for different segments", score: 2 },
          { text: "Advanced dynamic content – AI creates and optimizes content automatically for different audiences", score: 3 },
          { text: "Real-time content optimization – AI generates and optimizes content in real-time based on customer behavior", score: 4 },
          { text: "Intelligent content ecosystem – AI creates personalized content for every customer interaction automatically", score: 5 }
        ]
      },
      {
        id: "ma_9",
        activity: "marketing_automation",
        weight: 2,
        question: "How effectively do you use AI for CRM integration and data synchronization?",
        options: [
          { text: "Manual data management – managing customer data manually without automation", score: 0 },
          { text: "Basic CRM integration – simple data sync between marketing automation and CRM", score: 1 },
          { text: "Some AI data enhancement – AI helps clean and enhance customer data", score: 2 },
          { text: "Advanced AI integration – AI optimizes data flow and customer records between systems", score: 3 },
          { text: "Intelligent customer data management – AI creates comprehensive customer profiles automatically", score: 4 },
          { text: "Autonomous data ecosystem – AI manages all customer data integration and optimization automatically", score: 5 }
        ]
      },
      {
        id: "ma_10",
        activity: "marketing_automation",
        weight: 2,
        question: "How well do you use AI for predictive customer behavior analysis and proactive marketing?",
        options: [
          { text: "Reactive marketing – responding to customer actions after they occur", score: 0 },
          { text: "Basic behavior tracking – monitoring customer behavior without predictive insights", score: 1 },
          { text: "Some predictive analysis – AI provides basic predictions about customer behavior", score: 2 },
          { text: "Advanced behavioral AI – AI predicts customer actions and triggers proactive marketing", score: 3 },
          { text: "Predictive customer intelligence – AI anticipates customer needs and optimizes marketing accordingly", score: 4 },
          { text: "Intelligent behavioral ecosystem – AI predicts and influences customer behavior proactively across all touchpoints", score: 5 }
        ]
      }
    ],
    
    pr_communications: [
      {
        id: "pr_1",
        activity: "pr_communications",
        weight: 2.5,
        question: "How extensively do you use AI for media monitoring and sentiment analysis?",
        options: [
          { text: "Manual monitoring – checking news and mentions manually with basic Google alerts", score: 0 },
          { text: "Basic monitoring tools – using simple monitoring tools without AI sentiment analysis", score: 1 },
          { text: "Some AI monitoring – AI tracks mentions and provides basic sentiment analysis", score: 2 },
          { text: "Advanced AI monitoring – AI provides comprehensive media monitoring with detailed sentiment insights", score: 3 },
          { text: "Predictive monitoring – AI predicts potential PR issues and sentiment trends", score: 4 },
          { text: "Intelligent PR intelligence – AI provides comprehensive PR insights and proactive reputation management", score: 5 }
        ]
      },
      {
        id: "pr_2",
        activity: "pr_communications",
        weight: 2.5,
        question: "To what extent do you use AI for press release creation and distribution optimization?",
        options: [
          { text: "Manual press releases – writing and distributing press releases manually", score: 0 },
          { text: "Basic distribution – using standard distribution services without AI optimization", score: 1 },
          { text: "Some AI writing assistance – AI helps with press release drafting and basic optimization", score: 2 },
          { text: "Advanced PR AI – AI optimizes press release content and distribution for maximum impact", score: 3 },
          { text: "Intelligent press optimization – AI creates and distributes press releases for optimal media pickup", score: 4 },
          { text: "Autonomous PR system – AI manages entire press release creation and distribution process", score: 5 }
        ]
      },
      {
        id: "pr_3",
        activity: "pr_communications",
        weight: 2,
        question: "How effectively do you use AI for crisis communication and reputation management?",
        options: [
          { text: "Reactive crisis response – addressing crises manually after they escalate", score: 0 },
          { text: "Basic crisis planning – having crisis communication plans without AI support", score: 1 },
          { text: "Some AI crisis monitoring – AI helps identify potential crisis situations early", score: 2 },
          { text: "Advanced crisis AI – AI provides real-time crisis management recommendations and response strategies", score: 3 },
          { text: "Predictive crisis management – AI predicts potential crises and provides prevention strategies", score: 4 },
          { text: "Intelligent reputation protection – AI automatically manages reputation and prevents crises proactively", score: 5 }
        ]
      },
      {
        id: "pr_4",
        activity: "pr_communications",
        weight: 2,
        question: "How well do you use AI for media list building and journalist relationship management?",
        options: [
          { text: "Manual media outreach – building media lists and managing relationships manually", score: 0 },
          { text: "Basic media databases – using standard media databases without AI enhancement", score: 1 },
          { text: "Some AI media tools – AI helps identify relevant journalists and media contacts", score: 2 },
          { text: "Advanced media AI – AI builds targeted media lists and optimizes outreach timing", score: 3 },
          { text: "Intelligent relationship management – AI manages journalist relationships and predicts story interests", score: 4 },
          { text: "Autonomous media ecosystem – AI manages all aspects of media relationships and outreach", score: 5 }
        ]
      },
      {
        id: "pr_5",
        activity: "pr_communications",
        weight: 2,
        question: "To what extent do you use AI for content creation and thought leadership positioning?",
        options: [
          { text: "Manual content creation – creating all PR content manually without AI assistance", score: 0 },
          { text: "Basic content tools – using standard content creation tools without AI", score: 1 },
          { text: "Some AI content assistance – AI helps with PR content ideation and drafting", score: 2 },
          { text: "Advanced content AI – AI creates optimized PR content and thought leadership materials", score: 3 },
          { text: "Strategic content intelligence – AI develops comprehensive thought leadership strategies", score: 4 },
          { text: "Intelligent content ecosystem – AI creates and optimizes all PR content for maximum thought leadership impact", score: 5 }
        ]
      },
{
  id: "pr_6",
  activity: "pr_communications",
  weight: 2,
  question: "How effectively do you use AI for event planning and virtual event optimization?",
  options: [
    { text: "Manual event planning – planning all events manually without AI assistance", score: 0 },
    { text: "Basic event tools – using standard event planning tools without AI", score: 1 },
    { text: "Some AI event assistance – AI helps with basic event planning and logistics", score: 2 },
    { text: "Advanced event AI – AI optimizes event planning, promotion, and attendee engagement", score: 3 },
    { text: "Intelligent event management – AI manages comprehensive event strategy and execution", score: 4 },
    { text: "Autonomous event ecosystem – AI handles all aspects of event planning and optimization", score: 5 }
  ]
},

// Complete remaining PR & Communications questions (pr_7 through pr_10)
{
  id: "pr_7",
  activity: "pr_communications",
  weight: 2,
  question: "How well do you use AI for PR performance measurement and ROI analysis?",
  options: [
    { text: "No PR measurement – not tracking PR performance or ROI", score: 0 },
    { text: "Basic metrics tracking – manually tracking coverage and impressions", score: 1 },
    { text: "Some AI analytics – AI provides basic PR performance insights", score: 2 },
    { text: "Advanced PR analytics – AI measures comprehensive PR impact and ROI", score: 3 },
    { text: "Predictive PR intelligence – AI predicts PR campaign success and optimizes strategy", score: 4 },
    { text: "Intelligent PR ecosystem – AI provides comprehensive PR ROI analysis and strategic optimization", score: 5 }
  ]
},
{
  id: "pr_8",
  activity: "pr_communications",
  weight: 1.5,
  question: "To what extent do you use AI for influencer identification and relationship management?",
  options: [
    { text: "No influencer strategy – not working with influencers systematically", score: 0 },
    { text: "Manual influencer research – identifying and managing influencers manually", score: 1 },
    { text: "Some AI influencer tools – using AI to identify potential influencers and track mentions", score: 2 },
    { text: "Advanced influencer AI – AI manages comprehensive influencer identification and relationship building", score: 3 },
    { text: "Predictive influencer intelligence – AI predicts influencer effectiveness and optimizes partnerships", score: 4 },
    { text: "Intelligent influencer ecosystem – AI manages entire influencer strategy and relationship optimization", score: 5 }
  ]
},
{
  id: "pr_9",
  activity: "pr_communications",
  weight: 2,
  question: "How effectively do you use AI for stakeholder communication and internal communications?",
  options: [
    { text: "Manual internal communications – creating all internal communications manually", score: 0 },
    { text: "Basic communication tools – using standard tools without AI enhancement", score: 1 },
    { text: "Some AI communication assistance – AI helps with internal communication content creation", score: 2 },
    { text: "Advanced communication AI – AI optimizes stakeholder communications for maximum engagement", score: 3 },
    { text: "Intelligent communication strategy – AI creates comprehensive stakeholder communication strategies", score: 4 },
    { text: "Autonomous communication system – AI manages all stakeholder communications automatically", score: 5 }
  ]
},
{
  id: "pr_10",
  activity: "pr_communications",
  weight: 2,
  question: "How well do you integrate AI PR insights with overall marketing and business strategy?",
  options: [
    { text: "PR isolation – PR operates independently from other business functions", score: 0 },
    { text: "Basic integration – some sharing of PR insights with marketing and leadership", score: 1 },
    { text: "Some strategic integration – PR insights occasionally inform business decisions", score: 2 },
    { text: "Good integration – AI PR insights regularly contribute to marketing and business strategy", score: 3 },
    { text: "Advanced strategic integration – AI creates unified strategy incorporating PR intelligence", score: 4 },
    { text: "Seamless business integration – AI optimizes entire business strategy with PR as integrated component", score: 5 }
  ]
}

// Complete Events & Webinars activity section (10 questions)
events_webinars: [
  {
    id: "ew_1",
    activity: "events_webinars",
    weight: 2.5,
    question: "How extensively do you use AI for event planning and logistics optimization?",
    options: [
      { text: "Manual event planning – all event planning done manually without AI assistance", score: 0 },
      { text: "Basic planning tools – using standard event planning software without AI", score: 1 },
      { text: "Some AI planning assistance – AI helps with scheduling, venue selection, or basic logistics", score: 2 },
      { text: "Advanced planning AI – AI optimizes event logistics, timing, and resource allocation", score: 3 },
      { text: "Comprehensive event AI – AI manages complex event planning with predictive optimization", score: 4 },
      { text: "Intelligent event ecosystem – AI handles all aspects of event planning and execution autonomously", score: 5 }
    ]
  },
  {
    id: "ew_2",
    activity: "events_webinars",
    weight: 2.5,
    question: "To what extent do you use AI for attendee targeting and registration optimization?",
    options: [
      { text: "Manual targeting – using basic demographic targeting without AI insights", score: 0 },
      { text: "Basic segmentation – simple audience categories for event promotion", score: 1 },
      { text: "Some AI targeting – AI helps identify potential attendees and optimize outreach", score: 2 },
      { text: "Advanced audience AI – AI creates sophisticated attendee profiles and targeting strategies", score: 3 },
      { text: "Predictive attendance modeling – AI predicts attendance likelihood and optimizes registration funnels", score: 4 },
      { text: "Intelligent attendee ecosystem – AI maximizes event attendance through comprehensive targeting optimization", score: 5 }
    ]
  },
  {
    id: "ew_3",
    activity: "events_webinars",
    weight: 2,
    question: "How effectively do you use AI for content creation and presentation optimization?",
    options: [
      { text: "Manual content creation – all event content created manually without AI assistance", score: 0 },
      { text: "Basic presentation tools – using standard tools without AI enhancement", score: 1 },
      { text: "Some AI content assistance – AI helps with presentation creation and content optimization", score: 2 },
      { text: "Advanced content AI – AI creates optimized event content and presentation materials", score: 3 },
      { text: "Dynamic content optimization – AI personalizes content for different audience segments", score: 4 },
      { text: "Intelligent content ecosystem – AI creates and optimizes all event content automatically", score: 5 }
    ]
  },
  {
    id: "ew_4",
    activity: "events_webinars",
    weight: 2,
    question: "How well do you use AI for real-time engagement and interaction optimization?",
    options: [
      { text: "No real-time optimization – managing engagement manually during events", score: 0 },
      { text: "Basic engagement tools – using standard polling or Q&A without AI", score: 1 },
      { text: "Some AI engagement features – AI helps with basic audience interaction and engagement", score: 2 },
      { text: "Advanced engagement AI – AI optimizes real-time interaction and keeps audiences engaged", score: 3 },
      { text: "Predictive engagement optimization – AI predicts audience attention and adjusts content dynamically", score: 4 },
      { text: "Intelligent interaction ecosystem – AI manages all aspects of audience engagement automatically", score: 5 }
    ]
  },
  {
    id: "ew_5",
    activity: "events_webinars",
    weight: 2,
    question: "To what extent do you use AI for post-event follow-up and lead nurturing?",
    options: [
      { text: "Manual follow-up – sending basic thank you emails manually after events", score: 0 },
      { text: "Basic automated emails – simple post-event email sequences", score: 1 },
      { text: "Some AI personalization – AI customizes follow-up based on attendee behavior", score: 2 },
      { text: "Advanced follow-up AI – AI creates sophisticated post-event nurturing campaigns", score: 3 },
      { text: "Predictive nurturing – AI predicts optimal follow-up strategies based on engagement data", score: 4 },
      { text: "Intelligent lead ecosystem – AI manages comprehensive post-event lead development automatically", score: 5 }
    ]
  },
  {
    id: "ew_6",
    activity: "events_webinars",
    weight: 2,
    question: "How effectively do you use AI for virtual event platform optimization?",
    options: [
      { text: "Basic virtual platforms – using standard virtual event platforms without AI optimization", score: 0 },
      { text: "Platform features – utilizing basic AI features built into virtual event platforms", score: 1 },
      { text: "Some AI enhancement – adding AI tools to improve virtual event experience", score: 2 },
      { text: "Advanced virtual AI – AI optimizes entire virtual event experience and platform usage", score: 3 },
      { text: "Intelligent virtual optimization – AI creates engaging virtual experiences with predictive features", score: 4 },
      { text: "Autonomous virtual ecosystem – AI manages all aspects of virtual event delivery and optimization", score: 5 }
    ]
  },
  {
    id: "ew_7",
    activity: "events_webinars",
    weight: 2,
    question: "How well do you use AI for event performance analysis and ROI measurement?",
    options: [
      { text: "Basic metrics tracking – manually tracking attendance and basic engagement metrics", score: 0 },
      { text: "Standard analytics – using platform analytics without AI insights", score: 1 },
      { text: "Some AI analytics – AI provides enhanced event performance analysis", score: 2 },
      { text: "Advanced event intelligence – AI measures comprehensive event success and ROI", score: 3 },
      { text: "Predictive event analytics – AI predicts event success and optimizes future events", score: 4 },
      { text: "Intelligent performance ecosystem – AI provides comprehensive event ROI analysis and strategic optimization", score: 5 }
    ]
  },
  {
    id: "ew_8",
    activity: "events_webinars",
    weight: 2,
    question: "To what extent do you use AI for speaker selection and content curation?",
    options: [
      { text: "Manual speaker selection – choosing speakers based on personal networks and basic research", score: 0 },
      { text: "Basic research tools – using standard tools to research potential speakers", score: 1 },
      { text: "Some AI speaker tools – AI helps identify potential speakers and analyze their expertise", score: 2 },
      { text: "Advanced speaker AI – AI optimizes speaker selection based on audience interests and engagement potential", score: 3 },
      { text: "Predictive speaker optimization – AI predicts speaker effectiveness and audience response", score: 4 },
      { text: "Intelligent curation ecosystem – AI manages all aspects of speaker selection and content curation", score: 5 }
    ]
  },
  {
    id: "ew_9",
    activity: "events_webinars",
    weight: 1.5,
    question: "How effectively do you use AI for event promotion and marketing optimization?",
    options: [
      { text: "Manual promotion – promoting events through traditional marketing channels manually", score: 0 },
      { text: "Basic digital promotion – using standard digital marketing without AI optimization", score: 1 },
      { text: "Some AI promotion tools – AI helps optimize event marketing campaigns", score: 2 },
      { text: "Advanced promotion AI – AI creates comprehensive event marketing strategies", score: 3 },
      { text: "Predictive promotion optimization – AI predicts optimal promotion strategies and channels", score: 4 },
      { text: "Intelligent marketing ecosystem – AI manages all aspects of event promotion and marketing optimization", score: 5 }
    ]
  },
  {
    id: "ew_10",
    activity: "events_webinars",
    weight: 2,
    question: "How well do you integrate AI event insights with overall marketing strategy?",
    options: [
      { text: "Event isolation – events operate independently from other marketing activities", score: 0 },
      { text: "Basic integration – some sharing of event data with marketing teams", score: 1 },
      { text: "Some strategic integration – event insights occasionally inform marketing strategy", score: 2 },
      { text: "Good integration – AI event insights regularly contribute to overall marketing strategy", score: 3 },
      { text: "Advanced strategic integration – AI creates unified strategy incorporating event intelligence", score: 4 },
      { text: "Seamless marketing integration – AI optimizes entire marketing strategy with events as integrated component", score: 5 }
    ]
  }
]

// Scoring configuration
const scoringConfig = {
  dimensions: ["people_skills", "process_infrastructure", "strategy_leadership"],
  
  weights: {
    // Overall assessment weights
    overall: {
      people_skills: 0.35,
      process_infrastructure: 0.35,
      strategy_leadership: 0.30
    },
    
    // Industry-specific weight adjustments
    industryAdjustments: {
      b2b_saas: {
        people_skills: 0.30,
        process_infrastructure: 0.40,
        strategy_leadership: 0.30
      },
      manufacturing: {
        people_skills: 0.40,
        process_infrastructure: 0.30,
        strategy_leadership: 0.30
      },
      healthcare: {
        people_skills: 0.30,
        process_infrastructure: 0.40,
        strategy_leadership: 0.30
      },
      financial_services: {
        people_skills: 0.30,
        process_infrastructure: 0.40,
        strategy_leadership: 0.30
      },
      ecommerce_retail: {
        people_skills: 0.35,
        process_infrastructure: 0.35,
        strategy_leadership: 0.30
      }
    }
  },
  
  // Activity impact scores
  activityImpactWeights: {
    content_marketing: 0.15,
    social_media: 0.10,
    seo_sem: 0.12,
    email_marketing: 0.10,
    analytics_data: 0.15,
    paid_advertising: 0.12,
    creative_design: 0.10,
    marketing_automation: 0.08,
    pr_communications: 0.05,
    events_webinars: 0.03
  }
};

// Export the completed configuration
window.InHouseMarketingQuestionsConfig = {
  ...window.InHouseMarketingQuestionsConfig,
  scoringConfig: scoringConfig
};