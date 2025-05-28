/**
 * Service-Specific AI Recommendations Configuration
 * 
 * This file provides detailed, actionable recommendations for each service line
 * based on AI readiness scores, with consideration for agency type variations.
 */

const ServiceRecommendations = {
  // Metadata for the recommendations system
  meta: {
    version: "1.0",
    lastUpdated: "2024-12",
    complexityLevels: {
      low: "Can be implemented by existing team with minimal training",
      medium: "Requires dedicated time, training, or external help",
      high: "Significant investment in time, money, and organizational change"
    },
    roiTimeframes: {
      immediate: "0-3 months",
      shortTerm: "3-6 months",
      longTerm: "6-12 months"
    }
  },

  // Service-specific recommendations
  services: {
    "creative": {
      serviceName: "Creative Services",
      riskLevel: "High",
      disruptionTimeline: "2025-2028",
      
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "Start with Free AI Image Generation",
            description: "Begin experimenting with Midjourney, DALL-E, or Bing Image Creator for mood boards and concepts",
            complexity: "low",
            tools: [
              { name: "Bing Image Creator", cost: "Free", bestFor: "Quick concepts" },
              { name: "Midjourney", cost: "$10-60/month", bestFor: "High-quality visuals" },
              { name: "DALL-E 3", cost: "$20/month", bestFor: "Integrated with ChatGPT" }
            ],
            expectedROI: "20-30% reduction in mood board creation time",
            roiTimeframe: "immediate",
            agencyTypeVariations: {
              "creative": "Focus on maintaining brand consistency while exploring",
              "digital": "Test for social media content creation first",
              "specialized": "Start with industry-specific visual styles"
            }
          },
          {
            title: "Create AI Usage Guidelines",
            description: "Develop clear policies on when and how to use AI in creative work",
            complexity: "low",
            tools: [],
            expectedROI: "Reduced risk and clearer client communication",
            roiTimeframe: "immediate",
            resources: ["Template AI usage policy document", "Client disclosure examples"]
          },
          {
            title: "Weekly AI Tool Demos",
            description: "Run 30-minute weekly sessions where team members share AI discoveries",
            complexity: "low",
            expectedROI: "Accelerated team adoption and knowledge sharing",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "Implement Adobe Firefly Integration",
            description: "Leverage AI within existing Creative Cloud workflows",
            complexity: "medium",
            tools: [
              { name: "Adobe Firefly", cost: "Included in Creative Cloud", bestFor: "Seamless integration" }
            ],
            expectedROI: "40-50% faster asset variations and iterations",
            roiTimeframe: "shortTerm",
            training: "2-3 hours per designer"
          },
          {
            title: "Build Prompt Libraries",
            description: "Create and organize effective prompts for common creative tasks",
            complexity: "medium",
            expectedROI: "Consistent quality and 30% faster AI asset generation",
            roiTimeframe: "shortTerm",
            deliverables: ["Brand-specific prompt templates", "Style guide integration"]
          },
          {
            title: "Pilot Value-Based Pricing",
            description: "Test outcome-based pricing with 2-3 trusted clients",
            complexity: "medium",
            expectedROI: "15-25% margin improvement on pilot projects",
            roiTimeframe: "shortTerm",
            agencyTypeVariations: {
              "creative": "Focus on campaign performance metrics",
              "digital": "Tie to engagement and conversion metrics"
            }
          }
        ],
        strategic: [
          {
            title: "Reposition from Production to Strategy",
            description: "Shift focus from creating assets to creative strategy and art direction",
            complexity: "high",
            expectedROI: "Protect revenue as production commoditizes",
            roiTimeframe: "longTerm",
            steps: [
              "Audit current service mix",
              "Identify high-value strategic services",
              "Develop new service offerings",
              "Retrain team on strategic thinking"
            ]
          },
          {
            title: "Develop AI-Enhanced Creative Process",
            description: "Create a proprietary methodology that combines AI efficiency with human creativity",
            complexity: "high",
            expectedROI: "2-3x project capacity with same team size",
            roiTimeframe: "longTerm",
            investment: "$10-20k in process development and training"
          }
        ]
      },
      
      midScore: { // 40-70 points
        immediate: [
          {
            title: "Expand to Advanced AI Tools",
            description: "Move beyond basic tools to professional-grade AI platforms",
            complexity: "medium",
            tools: [
              { name: "Runway ML", cost: "$15-95/month", bestFor: "Video and motion" },
              { name: "Stable Diffusion (local)", cost: "Free + hardware", bestFor: "Unlimited generation" },
              { name: "Leonardo.ai", cost: "$12-60/month", bestFor: "Game and product design" }
            ],
            expectedROI: "60-70% reduction in production time",
            roiTimeframe: "immediate"
          },
          {
            title: "AI-Human Collaboration Workflows",
            description: "Formalize processes for AI generation + human refinement",
            complexity: "medium",
            expectedROI: "Consistent quality at 3x speed",
            roiTimeframe: "immediate",
            metrics: ["Time per asset", "Revision rounds", "Client satisfaction"]
          }
        ],
        shortTerm: [
          {
            title: "Custom Model Training",
            description: "Train LoRAs or fine-tune models on client brand assets",
            complexity: "high",
            tools: [
              { name: "Kohya_ss", cost: "Free + compute", bestFor: "LoRA training" },
              { name: "Replicate", cost: "Pay per use", bestFor: "Cloud training" }
            ],
            expectedROI: "Unique capability commanding premium pricing",
            roiTimeframe: "shortTerm",
            investment: "$5-10k per major client"
          },
          {
            title: "Launch AI Creative Services",
            description: "Package AI-enhanced services as premium offerings",
            complexity: "medium",
            expectedROI: "20-30% revenue growth from new services",
            roiTimeframe: "shortTerm",
            services: [
              "AI Brand Guardian (consistency at scale)",
              "Infinite Variations (unlimited asset versions)",
              "Concept Acceleration (10x more initial concepts)"
            ]
          }
        ],
        strategic: [
          {
            title: "Build IP Around AI Creative",
            description: "Develop proprietary methodologies and tools",
            complexity: "high",
            expectedROI: "Defensible market position and M&A value",
            roiTimeframe: "longTerm",
            areas: ["Custom style transfer", "Brand DNA encoding", "Automated quality scoring"]
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "Optimize Profit Margins",
            description: "Use AI efficiency gains to improve margins, not just capacity",
            complexity: "low",
            expectedROI: "30-40% EBITDA improvement",
            roiTimeframe: "immediate",
            tactics: ["Fixed pricing for AI-accelerated work", "Reduce freelancer dependence"]
          }
        ],
        shortTerm: [
          {
            title: "White-Label AI Solutions",
            description: "License your AI creative capabilities to other agencies",
            complexity: "high",
            expectedROI: "New B2B revenue stream",
            roiTimeframe: "shortTerm",
            requirements: ["API development", "Partner program", "Support infrastructure"]
          }
        ],
        strategic: [
          {
            title: "Acquire AI-Weak Competitors",
            description: "Consolidate market share by acquiring agencies struggling with AI",
            complexity: "high",
            expectedROI: "2-3x revenue growth through consolidation",
            roiTimeframe: "longTerm"
          }
        ]
      }
    },

    "content": {
      serviceName: "Content Development",
      riskLevel: "Very High",
      disruptionTimeline: "2024-2026",
      
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "Emergency AI Adoption",
            description: "This service line faces immediate existential threat - act now",
            complexity: "low",
            urgency: "CRITICAL",
            tools: [
              { name: "ChatGPT", cost: "$20/month/user", bestFor: "General content" },
              { name: "Claude", cost: "$20/month", bestFor: "Long-form, nuanced content" },
              { name: "Jasper", cost: "$49-125/month", bestFor: "Marketing copy" }
            ],
            expectedROI: "Survival - competitors already 5-10x more efficient",
            roiTimeframe: "immediate"
          },
          {
            title: "Implement AI-First Workflow Today",
            description: "Every piece of content should start with AI draft",
            complexity: "low",
            expectedROI: "3-5x content output immediately",
            roiTimeframe: "immediate",
            process: [
              "Brief → AI draft (5 min)",
              "Human edit for voice (15 min)",
              "Fact-check and approve (10 min)",
              "Previously 2-4 hours, now 30 min total"
            ]
          },
          {
            title: "Emergency Pricing Model Shift",
            description: "Stop charging per word immediately - shift to value pricing",
            complexity: "medium",
            expectedROI: "Maintain revenue as efficiency increases",
            roiTimeframe: "immediate",
            agencyTypeVariations: {
              "content": "Package as content programs, not pieces",
              "pr": "Focus on strategic narrative value",
              "digital": "Tie to performance metrics"
            }
          }
        ],
        shortTerm: [
          {
            title: "Build AI Content Factory",
            description: "Systematic process for producing content at scale",
            complexity: "medium",
            expectedROI: "50-100 pieces/week with small team",
            roiTimeframe: "shortTerm",
            components: [
              "Content brief templates",
              "AI prompt engineering",
              "Quality assurance workflow",
              "SEO optimization layer"
            ],
            tools: [
              { name: "Surfer SEO", cost: "$89-199/month", bestFor: "SEO optimization" },
              { name: "Grammarly Business", cost: "$15/user/month", bestFor: "Quality control" }
            ]
          },
          {
            title: "Develop Content Intelligence Services",
            description: "Move up-value from creation to strategy",
            complexity: "medium",
            expectedROI: "Higher margins on strategic work",
            roiTimeframe: "shortTerm",
            newServices: [
              "Content audit and strategy",
              "AI implementation consulting",
              "Performance optimization",
              "Content governance frameworks"
            ]
          }
        ],
        strategic: [
          {
            title: "Complete Business Model Transformation",
            description: "Content creation is commoditizing - must reinvent",
            complexity: "high",
            expectedROI: "Business survival and growth",
            roiTimeframe: "longTerm",
            transformation: [
              "From: Content creation agency",
              "To: Content strategy and AI consultancy",
              "Revenue mix: 20% creation, 80% strategy/consulting"
            ]
          }
        ]
      },
      
      midScore: { // 40-70 points
        immediate: [
          {
            title: "Scale AI Content Operations",
            description: "Move from testing to full production",
            complexity: "medium",
            tools: [
              { name: "Copy.ai", cost: "$49-119/month", bestFor: "Marketing automation" },
              { name: "Writesonic", cost: "$19-99/month", bestFor: "Bulk generation" },
              { name: "ContentShake (Semrush)", cost: "$60/month", bestFor: "SEO content" }
            ],
            expectedROI: "5-10x content volume at same cost",
            roiTimeframe: "immediate"
          },
          {
            title: "Implement Multi-Stage AI Workflow",
            description: "Use different AI tools for different stages",
            complexity: "medium",
            expectedROI: "Premium quality at scale",
            roiTimeframe: "immediate",
            workflow: [
              "Research: Perplexity AI",
              "Outline: ChatGPT",
              "Draft: Claude",
              "Optimize: Surfer SEO",
              "Polish: Human expert"
            ]
          }
        ],
        shortTerm: [
          {
            title: "Launch AI Content-as-a-Service",
            description: "Productize your AI content capabilities",
            complexity: "medium",
            expectedROI: "Predictable recurring revenue",
            roiTimeframe: "shortTerm",
            packages: [
              "Starter: 50 pieces/month - $5k",
              "Growth: 200 pieces/month - $15k",
              "Enterprise: 500+ pieces/month - $30k+"
            ]
          },
          {
            title: "Build Vertical Expertise",
            description: "Specialize in AI content for specific industries",
            complexity: "medium",
            expectedROI: "Premium pricing for specialized knowledge",
            roiTimeframe: "shortTerm",
            approach: "Train AI on industry-specific content and terminology"
          }
        ],
        strategic: [
          {
            title: "Develop Proprietary AI Tools",
            description: "Build competitive advantage through custom tools",
            complexity: "high",
            expectedROI: "Unique market position",
            roiTimeframe: "longTerm",
            options: [
              "Fine-tuned language models",
              "Industry-specific AI writers",
              "Automated content optimization"
            ]
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "Maximize Efficiency Gains",
            description: "Push AI utilization to limits while maintaining quality",
            complexity: "low",
            expectedROI: "50%+ margin improvement",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "License Your AI Content System",
            description: "Package your expertise for other agencies or enterprises",
            complexity: "high",
            expectedROI: "New SaaS revenue stream",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Acquire Content Agencies",
            description: "Consolidate agencies struggling with AI transition",
            complexity: "high",
            expectedROI: "3-5x growth through acquisition",
            roiTimeframe: "longTerm"
          }
        ]
      }
    },

    "digital": {
      serviceName: "Digital Marketing",
      riskLevel: "High",
      disruptionTimeline: "2024-2026",
      
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "Activate Platform AI Features",
            description: "Start using native AI tools in Google, Meta, etc.",
            complexity: "low",
            tools: [
              { name: "Performance Max", cost: "Built into Google Ads", bestFor: "Automated campaigns" },
              { name: "Advantage+ Shopping", cost: "Built into Meta", bestFor: "E-commerce" },
              { name: "Microsoft Advertising AI", cost: "Built-in", bestFor: "Search automation" }
            ],
            expectedROI: "20-30% performance improvement",
            roiTimeframe: "immediate",
            warning: "Platforms want you dependent on their AI - maintain strategic control"
          },
          {
            title: "AI-Powered Reporting",
            description: "Automate report generation and insights",
            complexity: "low",
            tools: [
              { name: "Supermetrics", cost: "$79-199/month", bestFor: "Data aggregation" },
              { name: "AgencyAnalytics", cost: "$199-399/month", bestFor: "Client reporting" }
            ],
            expectedROI: "Save 10-15 hours/week on reporting",
            roiTimeframe: "immediate"
          },
          {
            title: "Test AI Ad Creative",
            description: "Use AI for ad copy and image generation",
            complexity: "low",
            tools: [
              { name: "AdCreative.ai", cost: "$29-149/month", bestFor: "Display ads" },
              { name: "Pencil", cost: "$119+/month", bestFor: "Video ads" }
            ],
            expectedROI: "2-3x more creative variations tested",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "Build AI-Driven Campaign Architecture",
            description: "Restructure campaigns around AI optimization",
            complexity: "medium",
            expectedROI: "30-50% performance improvement",
            roiTimeframe: "shortTerm",
            approach: [
              "Broader targeting for AI to optimize",
              "Simplified account structures",
              "Focus on creative and strategy"
            ]
          },
          {
            title: "Implement Cross-Channel AI",
            description: "Use AI to orchestrate across platforms",
            complexity: "medium",
            tools: [
              { name: "Albert AI", cost: "Enterprise pricing", bestFor: "Autonomous campaigns" },
              { name: "Smartly.io", cost: "$2k+/month", bestFor: "Social automation" }
            ],
            expectedROI: "Unified optimization across channels",
            roiTimeframe: "shortTerm"
          },
          {
            title: "Shift to Strategic Services",
            description: "Move from execution to strategy as AI handles operations",
            complexity: "medium",
            expectedROI: "Higher value services and margins",
            roiTimeframe: "shortTerm",
            newServices: [
              "AI implementation consulting",
              "Marketing technology architecture",
              "Performance optimization strategy"
            ]
          }
        ],
        strategic: [
          {
            title: "Develop Platform Independence",
            description: "Build capabilities beyond platform-dependent tools",
            complexity: "high",
            expectedROI: "Sustainable competitive advantage",
            roiTimeframe: "longTerm",
            initiatives: [
              "First-party data strategies",
              "Custom attribution models",
              "Proprietary optimization tools"
            ]
          }
        ]
      },
      
      midScore: { // 40-70 points
        immediate: [
          {
            title: "Advanced AI Campaign Management",
            description: "Move beyond basic platform AI to advanced tools",
            complexity: "medium",
            tools: [
              { name: "Optmyzr", cost: "$208-499/month", bestFor: "PPC optimization" },
              { name: "Adzooma", cost: "$99-299/month", bestFor: "Multi-platform management" }
            ],
            expectedROI: "50-70% efficiency improvement",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "Build Predictive Analytics Capability",
            description: "Use AI to predict campaign performance",
            complexity: "high",
            expectedROI: "Proactive optimization and budget allocation",
            roiTimeframe: "shortTerm",
            components: [
              "Historical data analysis",
              "Predictive modeling",
              "Automated recommendations"
            ]
          },
          {
            title: "Launch AI-as-a-Service",
            description: "Package your AI expertise for clients",
            complexity: "medium",
            expectedROI: "New revenue streams",
            roiTimeframe: "shortTerm",
            services: [
              "AI audit and implementation",
              "Automated campaign management",
              "Performance prediction services"
            ]
          }
        ],
        strategic: [
          {
            title: "Create Proprietary AI Platform",
            description: "Build your own optimization technology",
            complexity: "high",
            expectedROI: "Unique market position and IP value",
            roiTimeframe: "longTerm",
            investment: "$50-100k initial development"
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "Optimize for Maximum Margin",
            description: "Use AI efficiency to improve profitability",
            complexity: "low",
            expectedROI: "40-50% margin improvement",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "White-Label Your AI Platform",
            description: "License your tools to other agencies",
            complexity: "high",
            expectedROI: "Scalable SaaS revenue",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Strategic Acquisitions",
            description: "Acquire agencies or AI technology",
            complexity: "high",
            expectedROI: "Market consolidation opportunity",
            roiTimeframe: "longTerm"
          }
        ]
      }
    },

    "media": {
      serviceName: "Media Services",
      riskLevel: "Critical",
      disruptionTimeline: "Already happening",
      
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "EMERGENCY: Implement Programmatic Now",
            description: "Manual media buying is already obsolete - immediate action required",
            complexity: "high",
            urgency: "BUSINESS CRITICAL",
            tools: [
              { name: "The Trade Desk", cost: "% of spend", bestFor: "Premium programmatic" },
              { name: "Amazon DSP", cost: "% of spend", bestFor: "Retail media" },
              { name: "Google DV360", cost: "% of spend", bestFor: "Google ecosystem" }
            ],
            expectedROI: "Survival - manual buying is ending",
            roiTimeframe: "immediate",
            warning: "Agencies without programmatic capability are losing clients NOW"
          },
          {
            title: "Partner or Perish",
            description: "If you can't build programmatic capability fast, partner immediately",
            complexity: "medium",
            expectedROI: "Maintain client relationships",
            roiTimeframe: "immediate",
            options: [
              "White-label programmatic partner",
              "Merge with programmatic agency",
              "Outsource to trading desk"
            ]
          },
          {
            title: "Radical Pricing Model Change",
            description: "Commission model is dead - shift immediately",
            complexity: "medium",
            expectedROI: "Protect revenue as margins compress",
            roiTimeframe: "immediate",
            newModels: [
              "Performance-based fees",
              "Flat retainer + performance bonus",
              "Consulting + tech fees"
            ],
            agencyTypeVariations: {
              "media": "Focus on strategic value, not buying",
              "digital": "Bundle with other services"
            }
          }
        ],
        shortTerm: [
          {
            title: "Pivot to Strategy and Analytics",
            description: "Reposition from buyer to strategist",
            complexity: "high",
            expectedROI: "New value proposition as buying commoditizes",
            roiTimeframe: "shortTerm",
            transformation: [
              "From: Media buying",
              "To: Media strategy and optimization",
              "Skills: Data science, attribution, strategy"
            ]
          },
          {
            title: "Build Data and Attribution Expertise",
            description: "Become the intelligence layer above AI buying",
            complexity: "high",
            tools: [
              { name: "Google Analytics 4", cost: "Free/$150k+", bestFor: "Web analytics" },
              { name: "AppsFlyer", cost: "$0.08/conversion", bestFor: "Mobile attribution" },
              { name: "Triple Whale", cost: "$129+/month", bestFor: "E-commerce analytics" }
            ],
            expectedROI: "Premium fees for strategic insights",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Complete Business Model Reinvention",
            description: "Media buying as we know it is ending",
            complexity: "high",
            expectedROI: "Business survival",
            roiTimeframe: "longTerm",
            options: [
              "Become a consulting firm",
              "Build/buy technology platform",
              "Merge with complementary agency",
              "Exit the business"
            ]
          }
        ]
      },
      
      midScore: { // 40-70 points
        immediate: [
          {
            title: "Maximize Programmatic Efficiency",
            description: "Push programmatic percentage to 80%+",
            complexity: "medium",
            expectedROI: "30-40% efficiency gain",
            roiTimeframe: "immediate",
            tactics: [
              "Automated creative optimization",
              "AI bid management",
              "Cross-channel orchestration"
            ]
          },
          {
            title: "Advanced Attribution Modeling",
            description: "Prove value beyond last-click",
            complexity: "medium",
            tools: [
              { name: "Rockerbox", cost: "$2k+/month", bestFor: "Marketing analytics" },
              { name: "Attribution", cost: "Custom pricing", bestFor: "Multi-touch attribution" }
            ],
            expectedROI: "Justify higher fees with proven ROI",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "Build Proprietary Technology",
            description: "Create unique capabilities beyond platforms",
            complexity: "high",
            expectedROI: "Competitive differentiation",
            roiTimeframe: "shortTerm",
            areas: [
              "Custom bidding algorithms",
              "Proprietary data sources",
              "Advanced forecasting models"
            ]
          },
          {
            title: "Develop Consultative Services",
            description: "High-value strategy beyond execution",
            complexity: "medium",
            expectedROI: "Higher margins on strategic work",
            roiTimeframe: "shortTerm",
            services: [
              "Media mix modeling",
              "Attribution strategy",
              "MarTech architecture",
              "In-housing consultation"
            ]
          }
        ],
        strategic: [
          {
            title: "Acquire or Build Tech Platform",
            description: "Own the technology layer",
            complexity: "high",
            expectedROI: "Platform economics and valuation",
            roiTimeframe: "longTerm",
            paths: [
              "Build proprietary platform",
              "Acquire existing technology",
              "Joint venture with tech company"
            ]
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "Optimize Platform Economics",
            description: "Maximize margin on automated operations",
            complexity: "low",
            expectedROI: "50%+ EBITDA margins possible",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "License Your Technology",
            description: "Monetize your platform capabilities",
            complexity: "high",
            expectedROI: "SaaS multiples on valuation",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Roll-Up Strategy",
            description: "Acquire struggling media agencies",
            complexity: "high",
            expectedROI: "3-5x growth through consolidation",
            roiTimeframe: "longTerm"
          }
        ]
      }
    },

    "pr": {
      serviceName: "PR & Communications",
      riskLevel: "Moderate",
      disruptionTimeline: "2026-2028",
      
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "Implement AI Media Monitoring",
            description: "Upgrade from manual Google alerts immediately",
            complexity: "low",
            tools: [
              { name: "Mention", cost: "$41-149/month", bestFor: "Small teams" },
              { name: "Brand24", cost: "$79-399/month", bestFor: "Social listening" },
              { name: "Meltwater", cost: "$5k+/year", bestFor: "Enterprise" }
            ],
            expectedROI: "2-3x faster issue identification",
            roiTimeframe: "immediate"
          },
          {
            title: "AI-Assisted Writing",
            description: "Use AI for first drafts of releases and pitches",
            complexity: "low",
            tools: [
              { name: "ChatGPT/Claude", cost: "$20/month", bestFor: "General writing" },
              { name: "Prezly", cost: "$50+/month", bestFor: "PR-specific features" }
            ],
            expectedROI: "50% reduction in writing time",
            roiTimeframe: "immediate",
            process: "AI draft → Human relationship angle → Fact check → Personalize"
          },
          {
            title: "Automate Media List Building",
            description: "Stop manual journalist research",
            complexity: "low",
            tools: [
              { name: "Cision", cost: "Enterprise pricing", bestFor: "Comprehensive database" },
              { name: "Muck Rack", cost: "$5k+/year", bestFor: "Journalist engagement" },
              { name: "Prowly", cost: "$99+/month", bestFor: "Smaller agencies" }
            ],
            expectedROI: "10x faster media list creation",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "Build 24/7 Monitoring Capability",
            description: "AI alerts for crisis prevention",
            complexity: "medium",
            expectedROI: "Prevent one crisis = massive value",
            roiTimeframe: "shortTerm",
            setup: [
              "AI monitoring tools",
              "Escalation protocols",
              "Response templates",
              "On-call system"
            ]
          },
          {
            title: "Develop Data-Driven PR",
            description: "Move beyond impressions to business impact",
            complexity: "medium",
            expectedROI: "Justify higher fees with proven ROI",
            roiTimeframe: "shortTerm",
            metrics: [
              "Share of voice analysis",
              "Sentiment impact on sales",
              "Message penetration",
              "Earned media value"
            ]
          },
          {
            title: "AI-Enhanced Crisis Simulation",
            description: "Use AI to predict and prepare for crises",
            complexity: "medium",
            expectedROI: "Premium crisis prevention services",
            roiTimeframe: "shortTerm",
            agencyTypeVariations: {
              "pr": "Core differentiator service",
              "digital": "Add to reputation management"
            }
          }
        ],
        strategic: [
          {
            title: "Position as AI-Enhanced Relationship Experts",
            description: "Emphasize human+AI advantage",
            complexity: "medium",
            expectedROI: "Defend against pure AI competitors",
            roiTimeframe: "longTerm",
            messaging: "We use AI to be more human, not less"
          },
          {
            title: "Develop Predictive PR Services",
            description: "Anticipate issues before they happen",
            complexity: "high",
            expectedROI: "Command premium fees",
            roiTimeframe: "longTerm",
            capabilities: [
              "Issue prediction models",
              "Stakeholder sentiment tracking",
              "Narrative trajectory analysis"
            ]
          }
        ]
      },
      
      midScore: { // 40-70 points
        immediate: [
          {
            title: "Advanced Sentiment Analysis",
            description: "Real-time emotional intelligence at scale",
            complexity: "medium",
            tools: [
              { name: "Lexalytics", cost: "Enterprise", bestFor: "Deep sentiment" },
              { name: "MonkeyLearn", cost: "$299+/month", bestFor: "Custom models" }
            ],
            expectedROI: "Nuanced insights commanding higher fees",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "Launch Predictive Analytics Services",
            description: "Forecast PR outcomes and risks",
            complexity: "high",
            expectedROI: "New high-margin service line",
            roiTimeframe: "shortTerm",
            offerings: [
              "Campaign outcome prediction",
              "Crisis probability scoring",
              "Optimal timing analysis"
            ]
          },
          {
            title: "Build AI PR Command Center",
            description: "Impressive client-facing capability",
            complexity: "medium",
            expectedROI: "Win larger clients and retainers",
            roiTimeframe: "shortTerm",
            features: [
              "Real-time monitoring walls",
              "Predictive analytics dashboards",
              "Automated reporting"
            ]
          }
        ],
        strategic: [
          {
            title: "Develop Industry-Specific AI Models",
            description: "Deep expertise + AI for your verticals",
            complexity: "high",
            expectedROI: "Premium positioning in specialty",
            roiTimeframe: "longTerm"
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "Optimize Human-AI Balance",
            description: "Perfect the augmentation model",
            complexity: "low",
            expectedROI: "Best of both worlds positioning",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "License PR Tech Stack",
            description: "Package your tools for others",
            complexity: "high",
            expectedROI: "SaaS revenue stream",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Acquire Traditional PR Firms",
            description: "Consolidate as others struggle with AI",
            complexity: "high",
            expectedROI: "3x growth opportunity",
            roiTimeframe: "longTerm"
          }
        ]
      }
    },

    "strategy": {
      serviceName: "Strategy & Consulting",
      riskLevel: "Low-Moderate",
      disruptionTimeline: "2027-2030",
      
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "AI-Powered Research",
            description: "Dramatically accelerate insight gathering",
            complexity: "low",
            tools: [
              { name: "Perplexity Pro", cost: "$20/month", bestFor: "Research with sources" },
              { name: "AlphaSense", cost: "$1.8k+/year", bestFor: "Market intelligence" },
              { name: "CB Insights", cost: "$7k+/year", bestFor: "Company data" }
            ],
            expectedROI: "10x faster research phase",
            roiTimeframe: "immediate"
          },
          {
            title: "Automated Data Analysis",
            description: "Let AI find patterns in complex data",
            complexity: "low",
            tools: [
              { name: "Tableau + AI", cost: "$75/user/month", bestFor: "Visual analytics" },
              { name: "DataRobot", cost: "Enterprise", bestFor: "AutoML" }
            ],
            expectedROI: "Find insights humans miss",
            roiTimeframe: "immediate"
          },
          {
            title: "AI Workshop Facilitation",
            description: "Use AI to enhance strategy sessions",
            complexity: "low",
            expectedROI: "More productive client workshops",
            roiTimeframe: "immediate",
            applications: [
              "Real-time transcription and themes",
              "Instant competitive analysis",
              "Scenario generation"
            ]
          }
        ],
        shortTerm: [
          {
            title: "Build AI Strategy Expertise",
            description: "Become the go-to for AI transformation",
            complexity: "medium",
            expectedROI: "Premium fees for hot topic",
            roiTimeframe: "shortTerm",
            capabilities: [
              "AI readiness assessments",
              "AI strategy roadmaps",
              "Change management for AI",
              "AI governance frameworks"
            ],
            agencyTypeVariations: {
              "strategy": "Natural service extension",
              "specialized": "Industry-specific AI strategy"
            }
          },
          {
            title: "Develop Simulation Capabilities",
            description: "Use AI to model business scenarios",
            complexity: "high",
            tools: [
              { name: "AnyLogic", cost: "$2.3k+/year", bestFor: "Business simulation" },
              { name: "Custom Python models", cost: "Development time", bestFor: "Flexibility" }
            ],
            expectedROI: "Unique capability for complex strategy",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Position as AI-Human Synthesis",
            description: "Emphasize irreplaceable human judgment",
            complexity: "medium",
            expectedROI: "Defend premium positioning",
            roiTimeframe: "longTerm",
            messaging: "AI analyzes, humans synthesize, leaders decide"
          },
          {
            title: "Build IP Around AI Strategy",
            description: "Develop proprietary frameworks",
            complexity: "high",
            expectedROI: "Defensible market position",
            roiTimeframe: "longTerm",
            areas: [
              "AI transformation methodology",
              "AI-human collaboration models",
              "Industry-specific AI playbooks"
            ]
          }
        ]
      },
      
      midScore: { // 40-70 points
        immediate: [
          {
            title: "Advanced Predictive Analytics",
            description: "Forecast business outcomes with AI",
            complexity: "medium",
            expectedROI: "Higher confidence in recommendations",
            roiTimeframe: "immediate",
            applications: [
              "Market entry success prediction",
              "M&A outcome modeling",
              "Strategic option valuation"
            ]
          }
        ],
        shortTerm: [
          {
            title: "Launch AI Strategy Practice",
            description: "Dedicated team and services",
            complexity: "medium",
            expectedROI: "30-50% of new business",
            roiTimeframe: "shortTerm",
            team: [
              "AI strategy lead",
              "Data scientists",
              "Change management experts",
              "Industry specialists"
            ]
          },
          {
            title: "Develop Digital Twins",
            description: "Model entire businesses in AI",
            complexity: "high",
            expectedROI: "Revolutionary strategy testing",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Partner with AI Technology Firms",
            description: "Combine strategy + implementation",
            complexity: "medium",
            expectedROI: "End-to-end transformation capability",
            roiTimeframe: "longTerm"
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "Optimize Knowledge Management",
            description: "AI-powered insight repository",
            complexity: "medium",
            expectedROI: "Compound value of all projects",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "White-Label Strategy AI",
            description: "License your tools and methods",
            complexity: "high",
            expectedROI: "Scalable IP monetization",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Acquire Boutique Consultancies",
            description: "Add specialized expertise",
            complexity: "high",
            expectedROI: "Expanded capabilities and clients",
            roiTimeframe: "longTerm"
          }
        ]
      }
    },

    "data": {
      serviceName: "Data & Analytics",
      riskLevel: "Moderate-High",
      disruptionTimeline: "2024-2025",
      
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "Implement AutoML Immediately",
            description: "Democratize machine learning across team",
            complexity: "medium",
            tools: [
              { name: "Google AutoML", cost: "Pay per use", bestFor: "Google ecosystem" },
              { name: "H2O.ai", cost: "Free/Enterprise", bestFor: "Open source option" },
              { name: "DataRobot", cost: "$75k+/year", bestFor: "Enterprise" }
            ],
            expectedROI: "5-10x faster model development",
            roiTimeframe: "immediate"
          },
          {
            title: "Natural Language Analytics",
            description: "Let clients talk to their data",
            complexity: "low",
            tools: [
              { name: "ThoughtSpot", cost: "$1,250+/month", bestFor: "Search analytics" },
              { name: "Tableau Ask Data", cost: "Included", bestFor: "Existing Tableau users" }
            ],
            expectedROI: "Dramatic improvement in client self-service",
            roiTimeframe: "immediate"
          },
          {
            title: "Automated Data Quality",
            description: "AI-powered data cleaning and validation",
            complexity: "medium",
            tools: [
              { name: "Trifacta", cost: "Enterprise", bestFor: "Data wrangling" },
              { name: "Talend", cost: "$1,170+/month", bestFor: "Data integration" }
            ],
            expectedROI: "50% reduction in data prep time",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "Build Real-Time Analytics",
            description: "Move from batch to streaming",
            complexity: "high",
            expectedROI: "Premium service offering",
            roiTimeframe: "shortTerm",
            stack: [
              "Apache Kafka for streaming",
              "Real-time ML models",
              "Live dashboards",
              "Automated alerts"
            ]
          },
          {
            title: "Develop Predictive Products",
            description: "Package predictions as products",
            complexity: "medium",
            expectedROI: "Recurring revenue streams",
            roiTimeframe: "shortTerm",
            products: [
              "Churn prediction service",
              "Demand forecasting",
              "Customer lifetime value",
              "Next best action"
            ]
          }
        ],
        strategic: [
          {
            title: "Transition to AI-First Analytics",
            description: "Fundamental business model shift",
            complexity: "high",
            expectedROI: "Stay relevant as analytics commoditizes",
            roiTimeframe: "longTerm",
            transformation: [
              "From: Traditional BI and reporting",
              "To: AI-powered predictive insights",
              "Value: Answers, not dashboards"
            ]
          }
        ]
      },
      
      midScore: { // 40-70 points
        immediate: [
          {
            title: "Enhance Predictive Accuracy",
            description: "Push ML models to next level",
            complexity: "medium",
            expectedROI: "Justify premium pricing with accuracy",
            roiTimeframe: "immediate",
            techniques: [
              "Ensemble methods",
              "Deep learning where appropriate",
              "Feature engineering automation"
            ]
          }
        ],
        shortTerm: [
          {
            title: "Launch Analytics-as-a-Service",
            description: "Productize your capabilities",
            complexity: "medium",
            expectedROI: "Scalable recurring revenue",
            roiTimeframe: "shortTerm",
            tiers: [
              "Basic: Automated reporting",
              "Pro: Predictive analytics",
              "Enterprise: Custom AI models"
            ]
          },
          {
            title: "Build Vertical Solutions",
            description: "Industry-specific analytics products",
            complexity: "high",
            expectedROI: "Premium pricing for specialization",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Develop Proprietary Algorithms",
            description: "Create defensible IP",
            complexity: "high",
            expectedROI: "Unique market position",
            roiTimeframe: "longTerm"
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "Maximize Automation ROI",
            description: "Push efficiency to limits",
            complexity: "low",
            expectedROI: "60%+ margins achievable",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "License Analytics Platform",
            description: "White-label your capabilities",
            complexity: "high",
            expectedROI: "Platform valuation multiples",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Strategic Acquisitions",
            description: "Buy complementary capabilities or clients",
            complexity: "high",
            expectedROI: "Accelerated growth",
            roiTimeframe: "longTerm"
          }
        ]
      }
    },

    "tech": {
      serviceName: "Technical Development",
      riskLevel: "Moderate",
      disruptionTimeline: "2025-2027",
      
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "Deploy AI Coding Assistants",
            description: "Every developer needs AI augmentation now",
            complexity: "low",
            tools: [
              { name: "GitHub Copilot", cost: "$10/user/month", bestFor: "General development" },
              { name: "Cursor", cost: "$20/month", bestFor: "AI-first IDE" },
              { name: "Amazon CodeWhisperer", cost: "Free/$19/month", bestFor: "AWS development" }
            ],
            expectedROI: "30-50% productivity improvement",
            roiTimeframe: "immediate"
          },
          {
            title: "Implement AI Code Review",
            description: "Catch bugs before humans do",
            complexity: "low",
            tools: [
              { name: "DeepCode/Snyk", cost: "Free/$98+/month", bestFor: "Security focus" },
              { name: "CodeGuru", cost: "$0.50/100 lines", bestFor: "AWS integration" }
            ],
            expectedROI: "50% reduction in bugs reaching production",
            roiTimeframe: "immediate"
          },
          {
            title: "AI-Powered Testing",
            description: "Automate test generation and execution",
            complexity: "medium",
            tools: [
              { name: "Testim", cost: "$450+/month", bestFor: "E2E testing" },
              { name: "Applitools", cost: "Custom pricing", bestFor: "Visual testing" }
            ],
            expectedROI: "80% reduction in manual testing",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "Adopt Low-Code for Appropriate Projects",
            description: "Use AI-powered platforms where they fit",
            complexity: "medium",
            tools: [
              { name: "OutSystems", cost: "Enterprise", bestFor: "Enterprise apps" },
              { name: "Bubble", cost: "$25-475/month", bestFor: "Web apps" },
              { name: "FlutterFlow", cost: "$30-70/month", bestFor: "Mobile apps" }
            ],
            expectedROI: "5-10x faster for suitable projects",
            roiTimeframe: "shortTerm",
            agencyTypeVariations: {
              "tech": "Expand service range",
              "digital": "Rapid prototyping capability"
            }
          },
          {
            title: "Build AI Implementation Services",
            description: "Help clients integrate AI into their products",
            complexity: "medium",
            expectedROI: "High-margin consulting revenue",
            roiTimeframe: "shortTerm",
            services: [
              "AI/ML integration",
              "LLM implementation",
              "Computer vision solutions",
              "Recommendation engines"
            ]
          },
          {
            title: "Shift to Architecture and Strategy",
            description: "Move up-stack as coding commoditizes",
            complexity: "high",
            expectedROI: "Maintain relevance and margins",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Develop AI-First Development Process",
            description: "Reimagine how software is built",
            complexity: "high",
            expectedROI: "3-5x productivity improvement",
            roiTimeframe: "longTerm",
            components: [
              "AI-driven architecture design",
              "Automated code generation",
              "Continuous AI optimization",
              "Self-healing systems"
            ]
          }
        ]
      },
      
      midScore: { // 40-70 points
        immediate: [
          {
            title: "Advanced AI Development Stack",
            description: "Go beyond basic assistants",
            complexity: "medium",
            tools: [
              { name: "Tabnine", cost: "$12-39/user/month", bestFor: "Team AI coding" },
              { name: "Codeium", cost: "Free/$10+/month", bestFor: "Fast completions" }
            ],
            expectedROI: "2x developer velocity",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "Launch AI Product Development",
            description: "Build AI-powered products for clients",
            complexity: "high",
            expectedROI: "Premium project fees",
            roiTimeframe: "shortTerm",
            capabilities: [
              "Custom LLM applications",
              "AI-powered SaaS products",
              "Intelligent automation"
            ]
          },
          {
            title: "Create Development Accelerators",
            description: "AI-powered templates and frameworks",
            complexity: "medium",
            expectedROI: "Win more projects with speed advantage",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Build AI Development Platform",
            description: "Proprietary tools for competitive advantage",
            complexity: "high",
            expectedROI: "Unique market position",
            roiTimeframe: "longTerm"
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "Optimize Development Economics",
            description: "Maximum efficiency from AI",
            complexity: "low",
            expectedROI: "70%+ gross margins",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "License Development Tools",
            description: "Monetize your AI dev platform",
            complexity: "high",
            expectedROI: "SaaS revenue stream",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Acquire Development Shops",
            description: "Consolidate as others struggle",
            complexity: "high",
            expectedROI: "Scale advantages",
            roiTimeframe: "longTerm"
          }
        ]
      }
    },

    "commerce": {
      serviceName: "Commerce/eCommerce",
      riskLevel: "Moderate-High",
      disruptionTimeline: "2025-2027",
      
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "Implement AI Personalization",
            description: "Table stakes for modern commerce",
            complexity: "medium",
            tools: [
              { name: "Dynamic Yield", cost: "1-2% of revenue", bestFor: "Enterprise" },
              { name: "Nosto", cost: "$500+/month", bestFor: "Mid-market" },
              { name: "Clerk.io", cost: "$399+/month", bestFor: "SMB" }
            ],
            expectedROI: "15-30% conversion improvement",
            roiTimeframe: "immediate"
          },
          {
            title: "AI-Powered Search",
            description: "Help customers find products naturally",
            complexity: "low",
            tools: [
              { name: "Algolia", cost: "$0-2k+/month", bestFor: "Developer-friendly" },
              { name: "Klevu", cost: "$600+/month", bestFor: "Plug-and-play" }
            ],
            expectedROI: "20-40% improvement in search conversions",
            roiTimeframe: "immediate"
          },
          {
            title: "Automated Pricing Optimization",
            description: "Dynamic pricing based on demand",
            complexity: "medium",
            tools: [
              { name: "Prisync", cost: "$99+/month", bestFor: "Competitive pricing" },
              { name: "Intelligence Node", cost: "Enterprise", bestFor: "Advanced optimization" }
            ],
            expectedROI: "5-15% margin improvement",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "Build Predictive Commerce",
            description: "Anticipate customer needs",
            complexity: "high",
            expectedROI: "30-50% increase in customer lifetime value",
            roiTimeframe: "shortTerm",
            capabilities: [
              "Demand forecasting",
              "Inventory optimization",
              "Churn prediction",
              "Next purchase prediction"
            ]
          },
          {
            title: "Implement Conversational Commerce",
            description: "AI-powered shopping assistants",
            complexity: "medium",
            tools: [
              { name: "Gorgias", cost: "$60+/month", bestFor: "Customer service" },
              { name: "Rep AI", cost: "$39+/month", bestFor: "Sales assistant" }
            ],
            expectedROI: "24/7 sales capability",
            roiTimeframe: "shortTerm"
          },
          {
            title: "Launch AI Commerce Consulting",
            description: "Help others transform their commerce",
            complexity: "medium",
            expectedROI: "New high-margin revenue stream",
            roiTimeframe: "shortTerm",
            services: [
              "AI readiness assessment",
              "Personalization strategy",
              "MarTech architecture",
              "Performance optimization"
            ]
          }
        ],
        strategic: [
          {
            title: "Develop Commerce Intelligence Platform",
            description: "Unified AI across entire commerce stack",
            complexity: "high",
            expectedROI: "Category-defining position",
            roiTimeframe: "longTerm",
            vision: "AI orchestrating all commerce decisions"
          }
        ]
      },
      
      midScore: { // 40-70 points
        immediate: [
          {
            title: "Advanced Personalization",
            description: "1:1 experiences at scale",
            complexity: "medium",
            expectedROI: "2-3x conversion rates",
            roiTimeframe: "immediate",
            levels: [
              "Product recommendations",
              "Dynamic content",
              "Personalized pricing",
              "Custom experiences"
            ]
          }
        ],
        shortTerm: [
          {
            title: "Omnichannel AI Orchestration",
            description: "Unified experience across touchpoints",
            complexity: "high",
            expectedROI: "40-60% increase in customer value",
            roiTimeframe: "shortTerm",
            integration: [
              "Online + offline data",
              "Cross-channel inventory",
              "Unified customer profiles",
              "Consistent AI decisions"
            ]
          },
          {
            title: "Build Vertical Commerce Solutions",
            description: "Industry-specific AI commerce",
            complexity: "high",
            expectedROI: "Premium positioning",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Create Commerce AI Suite",
            description: "Full-stack AI commerce platform",
            complexity: "high",
            expectedROI: "Platform valuation potential",
            roiTimeframe: "longTerm"
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "Maximize AI ROI",
            description: "Extract full value from AI investments",
            complexity: "low",
            expectedROI: "Industry-leading metrics",
            roiTimeframe: "immediate"
          }
        ],
        shortTerm: [
          {
            title: "License Commerce Tech",
            description: "White-label your AI capabilities",
            complexity: "high",
            expectedROI: "Scalable SaaS revenue",
            roiTimeframe: "shortTerm"
          }
        ],
        strategic: [
          {
            title: "Commerce Roll-Up",
            description: "Acquire struggling commerce agencies",
            complexity: "high",
            expectedROI: "Market consolidation play",
            roiTimeframe: "longTerm"
          }
        ]
      }
    }
  },

  // Cross-service synergies and combined recommendations
  multiService: {
    description: "Additional recommendations for agencies offering multiple services",
    
    synergies: [
      {
        services: ["creative", "content"],
        recommendation: "Build integrated AI content factory",
        description: "Combine visual and written AI for complete content solutions",
        expectedROI: "40-50% higher project values"
      },
      {
        services: ["digital", "media"],
        recommendation: "Unified AI campaign optimization",
        description: "Single AI brain optimizing across paid and owned channels",
        expectedROI: "30-40% better overall performance"
      },
      {
        services: ["strategy", "data"],
        recommendation: "AI-powered strategic insights",
        description: "Combine strategic thinking with deep data analysis",
        expectedROI: "Premium positioning as data-driven strategists"
      },
      {
        services: ["tech", "commerce"],
        recommendation: "End-to-end AI commerce solutions",
        description: "Build and optimize complete commerce ecosystems",
        expectedROI: "Full-stack value capture"
      }
    ],
    
    warnings: [
      {
        condition: "Multiple high-risk services without AI adoption",
        severity: "critical",
        message: "Your service mix faces severe disruption. Prioritize AI adoption in highest-risk areas immediately."
      },
      {
        condition: "Mixing AI-advanced and AI-naive services",
        severity: "high",
        message: "Inconsistent AI maturity across services will confuse clients and limit growth."
      }
    ]
  },

  // General operational and financial recommendations
  universal: {
    operational: {
      allAgencies: [
        {
          title: "Create AI Governance Framework",
          description: "Establish clear policies for AI use, quality control, and ethics",
          complexity: "medium",
          importance: "critical",
          components: [
            "AI usage guidelines",
            "Quality assurance processes",
            "Client disclosure policies",
            "Data privacy protocols",
            "Intellectual property rules"
          ]
        },
        {
          title: "Implement AI Training Program",
          description: "Systematic upskilling across all teams",
          complexity: "medium",
          importance: "high",
          phases: [
            "Phase 1: AI literacy for all staff",
            "Phase 2: Tool-specific training by role",
            "Phase 3: Advanced AI skills development",
            "Phase 4: Continuous learning program"
          ]
        },
        {
          title: "Establish Innovation Time",
          description: "Dedicated time for AI experimentation",
          complexity: "low",
          importance: "medium",
          structure: "20% time for AI exploration, shared learnings, innovation rewards"
        }
      ]
    },
    
    financial: {
      allAgencies: [
        {
          title: "Redesign Pricing Models",
          description: "Move away from time-based billing",
          complexity: "high",
          importance: "critical",
          options: [
            "Value-based pricing",
            "Outcome-based fees",
            "Subscription models",
            "Performance bonuses",
            "Hybrid approaches"
          ]
        },
        {
          title: "Measure AI ROI",
          description: "Track and optimize AI investments",
          complexity: "medium",
          importance: "high",
          metrics: [
            "Productivity improvements",
            "Quality enhancements",
            "Client satisfaction",
            "Revenue per employee",
            "Margin expansion"
          ]
        },
        {
          title: "Budget for AI Transformation",
          description: "Allocate sufficient resources",
          complexity: "medium",
          importance: "high",
          guidelines: [
            "5-10% of revenue for AI tools",
            "10-15% of time for training",
            "Innovation budget for experiments"
          ]
        }
      ]
    }
  }
};

// Export as ES6 module
export default ServiceRecommendations;

// Also make available as a named export
export { ServiceRecommendations };