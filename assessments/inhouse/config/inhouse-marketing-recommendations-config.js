/**
 * In-House Marketing AI Readiness Assessment - Recommendations Configuration
 * Version 1.0 - Comprehensive Recommendations with ROI Data
 * 
 * This configuration provides detailed, actionable recommendations based on 
 * assessment scores, industry context, and marketing activity focus.
 */

const InHouseMarketingRecommendationsConfig = {
  // Tool database with ROI metrics and implementation data
  toolDatabase: {
    content_generation: {
      tools: [
        {
          name: "ChatGPT/Claude Pro",
          cost: "$20-60/month per user",
          bestFor: "Long-form content, strategic content, complex topics",
          roiMetric: "2-5x faster content creation",
          complexity: "Low",
          implementationTime: "1-2 weeks"
        },
        {
          name: "Jasper AI",
          cost: "$49-125/month",
          bestFor: "Marketing copy, social posts, ad copy",
          roiMetric: "3x content output with 25% time savings",
          complexity: "Medium",
          implementationTime: "2-4 weeks"
        },
        {
          name: "Copy.ai",
          cost: "$49-119/month", 
          bestFor: "Bulk content generation, team collaboration",
          roiMetric: "5-10x content volume increase",
          complexity: "Low",
          implementationTime: "1 week"
        }
      ],
      avgROI: "300-500% productivity improvement",
      paybackPeriod: "1-2 months"
    },
    
    analytics_insights: {
      tools: [
        {
          name: "Google Analytics Intelligence",
          cost: "Free with GA4",
          bestFor: "Website analytics insights, automated reporting",
          roiMetric: "10-20% improvement in decision-making speed",
          complexity: "Low",
          implementationTime: "1 week"
        },
        {
          name: "HubSpot AI Analytics",
          cost: "$890+/month",
          bestFor: "Marketing attribution, lead intelligence",
          roiMetric: "15-25% improvement in lead conversion",
          complexity: "Medium",
          implementationTime: "4-6 weeks"
        },
        {
          name: "Tableau with Einstein Analytics",
          cost: "$75/user/month",
          bestFor: "Advanced data visualization, predictive analytics",
          roiMetric: "10-20% sales ROI improvement",
          complexity: "High",
          implementationTime: "8-12 weeks"
        }
      ],
      avgROI: "10-20% sales ROI improvement",
      paybackPeriod: "3-6 months"
    },
    
    personalization_engagement: {
      tools: [
        {
          name: "Dynamic Yield",
          cost: "1-2% of revenue",
          bestFor: "E-commerce personalization, A/B testing",
          roiMetric: "15-30% conversion improvement",
          complexity: "High",
          implementationTime: "6-8 weeks"
        },
        {
          name: "Optimizely",
          cost: "$50k+/year",
          bestFor: "Experimentation platform, personalization",
          roiMetric: "20-40% lift in key metrics",
          complexity: "High", 
          implementationTime: "8-12 weeks"
        },
        {
          name: "Mailchimp AI",
          cost: "$299+/month",
          bestFor: "Email personalization, send time optimization",
          roiMetric: "$38:1 email ROI (industry average)",
          complexity: "Low",
          implementationTime: "2-3 weeks"
        }
      ],
      avgROI: "15-30% conversion improvement",
      paybackPeriod: "2-4 months"
    },
    
    advertising_media: {
      tools: [
        {
          name: "Google Performance Max",
          cost: "% of ad spend",
          bestFor: "Automated Google campaign optimization",
          roiMetric: "20% improvement in ROAS",
          complexity: "Medium",
          implementationTime: "2-3 weeks"
        },
        {
          name: "Facebook Advantage+",
          cost: "% of ad spend", 
          bestFor: "Meta platform campaign automation",
          roiMetric: "15-25% improvement in cost per acquisition",
          complexity: "Medium",
          implementationTime: "1-2 weeks"
        },
        {
          name: "The Trade Desk AI",
          cost: "% of media spend",
          bestFor: "Programmatic advertising across channels",
          roiMetric: "30-40% efficiency improvement",
          complexity: "High",
          implementationTime: "4-6 weeks"
        }
      ],
      avgROI: "20% improvement in ROAS",
      paybackPeriod: "1-3 months"
    },
    
    customer_service: {
      tools: [
        {
          name: "Intercom AI",
          cost: "$39-199/month",
          bestFor: "Customer support chatbots, lead qualification",
          roiMetric: "24/7 availability, 40% reduction in support tickets",
          complexity: "Medium",
          implementationTime: "3-4 weeks"
        },
        {
          name: "Zendesk Answer Bot",
          cost: "$89+/month",
          bestFor: "Automated customer support, ticket routing",
          roiMetric: "35% reduction in support costs",
          complexity: "Medium",
          implementationTime: "2-4 weeks"
        }
      ],
      avgROI: "30-40% support cost reduction",
      paybackPeriod: "2-3 months"
    },
    
    workflow_automation: {
      tools: [
        {
          name: "Zapier AI",
          cost: "$20-599/month",
          bestFor: "Workflow automation between apps",
          roiMetric: "25% time savings on routine tasks",
          complexity: "Low",
          implementationTime: "1-2 weeks"
        },
        {
          name: "Monday.com AI",
          cost: "$8-24/user/month",
          bestFor: "Project management, task automation",
          roiMetric: "20% improvement in project delivery speed",
          complexity: "Low", 
          implementationTime: "2-3 weeks"
        }
      ],
      avgROI: "20-25% efficiency improvement",
      paybackPeriod: "1-2 months"
    }
  },
  
  // Core dimension recommendations
  coreRecommendations: {
    people_skills: {
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "Implement AI Literacy Training Program",
            description: "Start with foundational AI training for entire marketing team",
            priority: "CRITICAL",
            investment: "$2,000-5,000",
            expectedROI: "Foundation for all other AI initiatives",
            timeline: "2-4 weeks",
            resources: [
              "AI for Marketers online course",
              "Weekly AI tool demonstrations", 
              "Internal AI champions program"
            ]
          },
          {
            title: "Designate AI Marketing Champions",
            description: "Identify and train 2-3 team members as AI specialists",
            priority: "HIGH",
            investment: "$1,000-3,000 per person",
            expectedROI: "Accelerated team adoption and expertise",
            timeline: "4-6 weeks"
          }
        ],
        shortTerm: [
          {
            title: "Hire AI-Skilled Marketing Talent",
            description: "Recruit marketers with AI experience or train existing team",
            priority: "HIGH",
            investment: "$60,000-120,000 salary premium",
            expectedROI: "10x faster AI implementation",
            timeline: "3-6 months"
          },
          {
            title: "Partner with AI Marketing Agency",
            description: "Work with AI-specialized agency during transition period",
            priority: "MEDIUM",
            investment: "$5,000-15,000/month",
            expectedROI: "Faster learning curve, reduced risk",
            timeline: "6-12 months"
          }
        ],
        strategic: [
          {
            title: "Build Internal AI Center of Excellence",
            description: "Create dedicated team for AI implementation and governance",
            priority: "MEDIUM",
            investment: "$200,000-500,000/year",
            expectedROI: "Sustainable AI capability and competitive advantage",
            timeline: "12-18 months"
          }
        ]
      },
      
      midScore: { // 40-70 points
        immediate: [
          {
            title: "Advanced AI Skills Development",
            description: "Move beyond basic AI to specialized skills (prompt engineering, AI strategy)",
            priority: "HIGH",
            investment: "$3,000-8,000",
            expectedROI: "2x improvement in AI output quality",
            timeline: "4-8 weeks"
          }
        ],
        shortTerm: [
          {
            title: "Cross-Functional AI Training",
            description: "Extend AI training to sales, customer service, and other departments",
            priority: "MEDIUM",
            investment: "$10,000-25,000",
            expectedROI: "Organization-wide AI efficiency",
            timeline: "3-6 months"
          }
        ],
        strategic: [
          {
            title: "Become AI Talent Magnet",
            description: "Position company as leading AI-forward organization",
            priority: "MEDIUM",
            investment: "$50,000-100,000/year",
            expectedROI: "Attract top AI talent, reduce recruitment costs",
            timeline: "12-24 months"
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "AI Innovation Labs",
            description: "Experiment with cutting-edge AI tools and techniques",
            priority: "MEDIUM",
            investment: "$15,000-30,000",
            expectedROI: "First-mover advantage in new AI capabilities",
            timeline: "Ongoing"
          }
        ],
        shortTerm: [
          {
            title: "AI Thought Leadership",
            description: "Share AI expertise through speaking, writing, consulting",
            priority: "LOW",
            investment: "$10,000-20,000",
            expectedROI: "Brand differentiation, talent attraction",
            timeline: "6-12 months"
          }
        ],
        strategic: [
          {
            title: "Acquire AI Talent/Companies",
            description: "Strategic acquisitions to accelerate AI capabilities",
            priority: "LOW",
            investment: "$500,000-2,000,000",
            expectedROI: "Rapid capability expansion",
            timeline: "12-24 months"
          }
        ]
      }
    },
    
    process_infrastructure: {
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "Centralize Marketing Data",
            description: "Implement unified data platform for AI-ready analytics",
            priority: "CRITICAL",
            investment: "$10,000-50,000",
            expectedROI: "Foundation for all AI initiatives",
            timeline: "4-8 weeks",
            tools: ["HubSpot CRM", "Salesforce Marketing Cloud", "Google Analytics 4"]
          },
          {
            title: "Implement Basic AI Governance",
            description: "Create policies for AI usage, data privacy, and quality control",
            priority: "HIGH",
            investment: "$2,000-5,000",
            expectedROI: "Risk mitigation, compliance assurance",
            timeline: "2-4 weeks"
          }
        ],
        shortTerm: [
          {
            title: "Automate Routine Marketing Tasks", 
            description: "Identify and automate 3-5 repetitive marketing processes",
            priority: "HIGH",
            investment: "$5,000-15,000",
            expectedROI: "25-40% time savings on routine tasks",
            timeline: "6-12 weeks"
          },
          {
            title: "Build AI-Enhanced Marketing Stack",
            description: "Integrate AI tools with existing marketing technology",
            priority: "HIGH",
            investment: "$15,000-40,000",
            expectedROI: "50-100% improvement in marketing efficiency",
            timeline: "3-6 months"
          }
        ],
        strategic: [
          {
            title: "Develop Custom AI Solutions",
            description: "Build proprietary AI tools for competitive advantage",
            priority: "MEDIUM",
            investment: "$100,000-300,000",
            expectedROI: "Unique capabilities and IP value",
            timeline: "12-18 months"
          }
        ]
      },
      
      midScore: { // 40-70 points  
        immediate: [
          {
            title: "Optimize Existing AI Workflows",
            description: "Improve efficiency of current AI processes",
            priority: "HIGH",
            investment: "$5,000-15,000",
            expectedROI: "30-50% improvement in AI ROI",
            timeline: "4-6 weeks"
          }
        ],
        shortTerm: [
          {
            title: "Advanced Analytics Implementation",
            description: "Deploy predictive analytics and customer intelligence",
            priority: "HIGH",
            investment: "$25,000-75,000",
            expectedROI: "15-25% improvement in campaign performance",
            timeline: "3-6 months"
          }
        ],
        strategic: [
          {
            title: "AI-First Architecture Redesign",
            description: "Rebuild marketing infrastructure around AI capabilities",
            priority: "MEDIUM",
            investment: "$200,000-500,000",
            expectedROI: "2-3x marketing effectiveness",
            timeline: "12-24 months"
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "Continuous Optimization Program",
            description: "Implement ongoing AI performance monitoring and improvement",
            priority: "MEDIUM",
            investment: "$10,000-25,000",
            expectedROI: "Sustained competitive advantage",
            timeline: "Ongoing"
          }
        ],
        shortTerm: [
          {
            title: "White-Label AI Solutions",
            description: "License AI capabilities to partners or other companies",
            priority: "LOW",
            investment: "$50,000-150,000",
            expectedROI: "New revenue stream",
            timeline: "6-12 months"
          }
        ],
        strategic: [
          {
            title: "AI Platform Development",
            description: "Build comprehensive AI marketing platform",
            priority: "LOW",
            investment: "$1,000,000+",
            expectedROI: "Platform economics and market leadership",
            timeline: "24+ months"
          }
        ]
      }
    },
    
    strategy_leadership: {
      lowScore: { // 0-40 points
        immediate: [
          {
            title: "Develop AI Marketing Strategy",
            description: "Create comprehensive AI roadmap aligned with business goals",
            priority: "CRITICAL",
            investment: "$5,000-15,000",
            expectedROI: "Foundation for coordinated AI investment",
            timeline: "4-6 weeks"
          },
          {
            title: "Secure Executive Buy-in",
            description: "Present AI business case to leadership with ROI projections",
            priority: "CRITICAL",
            investment: "$2,000-5,000",
            expectedROI: "Budget approval and organizational support",
            timeline: "2-4 weeks"
          }
        ],
        shortTerm: [
          {
            title: "Launch AI Pilot Programs",
            description: "Implement 2-3 AI initiatives with measurable outcomes",
            priority: "HIGH",
            investment: "$10,000-30,000",
            expectedROI: "Proven ROI for larger AI investments",
            timeline: "3-6 months"
          },
          {
            title: "Establish AI Metrics and KPIs",
            description: "Define success metrics for AI initiatives",
            priority: "HIGH",
            investment: "$3,000-8,000",
            expectedROI: "Objective measurement of AI impact",
            timeline: "4-8 weeks"
          }
        ],
        strategic: [
          {
            title: "Transform to AI-First Organization",
            description: "Fundamental shift to AI-powered marketing approach",
            priority: "HIGH",
            investment: "$100,000-300,000",
            expectedROI: "Market leadership and competitive advantage",
            timeline: "18-24 months"
          }
        ]
      },
      
      midScore: { // 40-70 points
        immediate: [
          {
            title: "Accelerate AI Implementation",
            description: "Scale successful AI pilots across organization",
            priority: "HIGH", 
            investment: "$25,000-75,000",
            expectedROI: "Organization-wide AI benefits",
            timeline: "6-12 weeks"
          }
        ],
        shortTerm: [
          {
            title: "Build AI Competitive Intelligence",
            description: "Monitor and analyze competitor AI strategies",
            priority: "MEDIUM",
            investment: "$10,000-25,000",
            expectedROI: "Strategic advantage through market intelligence",
            timeline: "3-6 months"
          }
        ],
        strategic: [
          {
            title: "AI Innovation Partnerships",
            description: "Partner with AI companies, universities, or research institutions",
            priority: "MEDIUM",
            investment: "$50,000-200,000",
            expectedROI: "Access to cutting-edge AI capabilities",
            timeline: "12-18 months"
          }
        ]
      },
      
      highScore: { // 70-100 points
        immediate: [
          {
            title: "AI Strategy Optimization",
            description: "Refine and optimize existing AI strategy based on results",
            priority: "MEDIUM",
            investment: "$10,000-30,000",
            expectedROI: "Maximized AI investment returns",
            timeline: "4-8 weeks"
          }
        ],
        shortTerm: [
          {
            title: "Industry AI Leadership",
            description: "Position as thought leader in AI marketing",
            priority: "LOW",
            investment: "$15,000-40,000",
            expectedROI: "Brand differentiation and talent attraction",
            timeline: "6-12 months"
          }
        ],
        strategic: [
          {
            title: "AI Ecosystem Development",
            description: "Build network of AI partners, vendors, and collaborators",
            priority: "LOW",
            investment: "$100,000-300,000",
            expectedROI: "Sustained innovation and market influence",
            timeline: "18-36 months"
          }
        ]
      }
    }
  },
  
  // Industry-specific recommendations
  industryRecommendations: {
    b2b_saas: {
      context: {
        avgReadiness: 75,
        topQuartile: 90,
        keyOpportunities: [
          "Product-led growth optimization with AI",
          "Customer lifecycle prediction and optimization", 
          "Account-based marketing automation",
          "Competitive intelligence and positioning"
        ]
      },
      
      lowScore: [
        {
          title: "Implement AI-Powered Product Analytics",
          description: "Use AI to analyze product usage data for marketing insights",
          industry: "b2b_saas",
          investment: "$15,000-40,000",
          expectedROI: "25-40% improvement in user onboarding conversion",
          tools: ["Mixpanel", "Amplitude with AI", "Pendo AI"],
          timeline: "6-8 weeks"
        },
        {
          title: "AI-Enhanced Account-Based Marketing",
          description: "Implement AI tools for ABM targeting and personalization",
          industry: "b2b_saas", 
          investment: "$20,000-60,000",
          expectedROI: "30-50% improvement in qualified lead generation",
          tools: ["6sense", "Demandbase", "Terminus AI"],
          timeline: "8-12 weeks"
        }
      ],
      
      midScore: [
        {
          title: "Predictive Customer Success Integration",
          description: "Use AI to predict churn and optimize retention campaigns", 
          industry: "b2b_saas",
          investment: "$30,000-80,000",
          expectedROI: "20-30% reduction in customer churn",
          tools: ["ChurnZero", "Gainsight AI", "CustomerGauge"],
          timeline: "3-6 months"
        },
        {
          title: "AI-Driven Competitive Intelligence",
          description: "Implement AI monitoring of competitor features, pricing, and marketing",
          industry: "b2b_saas",
          investment: "$10,000-25,000",
          expectedROI: "Faster response to market changes",
          tools: ["Klenty", "Crayon", "Kompyte"],
          timeline: "4-6 weeks"
        }
      ],
      
      highScore: [
        {
          title: "Advanced Product-Market Fit Analysis",
          description: "Use AI to analyze user behavior and optimize product-market fit",
          industry: "b2b_saas",
          investment: "$50,000-150,000",
          expectedROI: "Strategic product and marketing alignment",
          timeline: "6-12 months"
        },
        {
          title: "AI-Powered Revenue Operations",
          description: "Integrate AI across entire revenue funnel from marketing to customer success", 
          industry: "b2b_saas",
          investment: "$100,000-300,000",
          expectedROI: "15-25% improvement in overall revenue efficiency",
          timeline: "12-18 months"
        }
      ]
    },
    
    manufacturing: {
      context: {
        avgReadiness: 50,
        topQuartile: 70,
        keyOpportunities: [
          "Technical content generation and translation",
          "Dealer/distributor marketing support",
          "Long sales cycle optimization",
          "Trade show and event optimization"
        ]
      },
      
      lowScore: [
        {
          title: "AI Technical Content Translation",
          description: "Use AI to convert engineering specs into marketing content",
          industry: "manufacturing",
          investment: "$5,000-15,000",
          expectedROI: "5x faster technical content creation",
          tools: ["ChatGPT Enterprise", "Claude", "Jasper AI"],
          timeline: "2-4 weeks"
        },
        {
          title: "Dealer Marketing Support System",
          description: "AI-powered marketing materials for channel partners",
          industry: "manufacturing",
          investment: "$15,000-40,000",
          expectedROI: "30-50% improvement in channel marketing effectiveness",
          timeline: "6-10 weeks"
        }
      ],
      
      midScore: [
        {
          title: "AI-Enhanced Trade Show Optimization",
          description: "Use AI for pre-show targeting and post-show follow-up",
          industry: "manufacturing",
          investment: "$10,000-30,000",
          expectedROI: "40-60% improvement in trade show ROI",
          tools: ["Salesforce AI", "HubSpot AI", "EventMobi"],
          timeline: "8-12 weeks"
        },
        {
          title: "Long Sales Cycle Automation",
          description: "AI-powered nurturing for complex B2B sales cycles",
          industry: "manufacturing",
          investment: "$20,000-50,000",
          expectedROI: "25-35% improvement in sales cycle efficiency",
          timeline: "3-6 months"
        }
      ],
      
      highScore: [
        {
          title: "Industrial IoT Marketing Integration",
          description: "Connect IoT data with marketing for predictive maintenance campaigns",
          industry: "manufacturing",
          investment: "$100,000-250,000",
          expectedROI: "New service revenue streams",
          timeline: "12-18 months"
        }
      ]
    },
    
    healthcare: {
      context: {
        avgReadiness: 55,
        topQuartile: 72,
        keyOpportunities: [
          "HIPAA-compliant AI implementation",
          "Patient education and engagement",
          "Provider outreach optimization",
          "Clinical outcomes marketing"
        ]
      },
      
      lowScore: [
        {
          title: "HIPAA-Compliant AI Foundation",
          description: "Implement AI tools with proper healthcare compliance",
          industry: "healthcare",
          investment: "$20,000-60,000",
          expectedROI: "Risk mitigation and efficiency gains",
          compliance: "HIPAA, FDA guidelines",
          timeline: "8-12 weeks"
        },
        {
          title: "AI Patient Education Platform",
          description: "Personalized patient education content with AI",
          industry: "healthcare",
          investment: "$15,000-40,000",
          expectedROI: "Better patient outcomes and engagement",
          timeline: "6-10 weeks"
        }
      ],
      
      midScore: [
        {
          title: "Provider AI Outreach Optimization",
          description: "AI-enhanced medical professional education and outreach",
          industry: "healthcare",
          investment: "$25,000-70,000",
          expectedROI: "30-50% improvement in provider engagement",
          timeline: "3-6 months"
        },
        {
          title: "Clinical Outcomes Marketing",
          description: "Use AI to create compelling stories from clinical data",
          industry: "healthcare", 
          investment: "$30,000-80,000",
          expectedROI: "Evidence-based marketing effectiveness",
          timeline: "4-8 months"
        }
      ],
      
      highScore: [
        {
          title: "AI-Powered Population Health Marketing",
          description: "Large-scale health communication optimization",
          industry: "healthcare",
          investment: "$100,000-300,000",
          expectedROI: "Public health impact and brand positioning",
          timeline: "12-24 months"
        }
      ]
    },
    
    financial_services: {
      context: {
        avgReadiness: 65,
        topQuartile: 85,
        keyOpportunities: [
          "Compliant personalization at scale",
          "Fraud prevention and security",
          "Customer lifecycle optimization",
          "Market-responsive marketing"
        ]
      },
      
      lowScore: [
        {
          title: "Regulatory-Compliant AI Personalization",
          description: "Implement AI personalization within financial regulations",
          industry: "financial_services",
          investment: "$30,000-80,000",
          expectedROI: "15-25% improvement in customer engagement",
          compliance: "SOX, PCI DSS, GDPR",
          timeline: "8-16 weeks"
        },
        {
          title: "AI Fraud Prevention Integration",
          description: "AI-powered fraud detection for marketing campaigns",
          industry: "financial_services",
          investment: "$25,000-60,000",
          expectedROI: "Risk reduction and compliance assurance",
          timeline: "6-12 weeks"
        }
      ],
      
      midScore: [
        {
          title: "Customer Lifecycle Value Optimization",
          description: "AI prediction and optimization of customer financial journeys",
          industry: "financial_services",
          investment: "$50,000-150,000",
          expectedROI: "20-40% improvement in customer lifetime value",
          timeline: "4-8 months"
        },
        {
          title: "Market-Responsive Campaign Automation",
          description: "AI campaigns that respond to economic and market conditions",
          industry: "financial_services",
          investment: "$40,000-100,000",
          expectedROI: "Better timing and messaging effectiveness",
          timeline: "3-6 months"
        }
      ],
      
      highScore: [
        {
          title: "AI Financial Advisory Marketing",
          description: "Sophisticated AI providing personalized financial guidance at scale",
          industry: "financial_services",
          investment: "$200,000-500,000",
          expectedROI: "Premium service differentiation",
          timeline: "12-24 months"
        }
      ]
    },
    
    ecommerce_retail: {
      context: {
        avgReadiness: 70,
        topQuartile: 88,
        keyOpportunities: [
          "Advanced personalization and recommendations",
          "Dynamic pricing optimization",
          "Inventory-marketing coordination",
          "Omnichannel experience optimization"
        ]
      },
      
      lowScore: [
        {
          title: "AI Product Recommendation Engine",
          description: "Implement basic AI-powered product recommendations",
          industry: "ecommerce_retail",
          investment: "$10,000-30,000",
          expectedROI: "15-30% increase in average order value",
          tools: ["Dynamic Yield", "Nosto", "Clerk.io"],
          timeline: "4-6 weeks"
        },
        {
          title: "Dynamic Pricing Implementation",
          description: "AI-driven pricing optimization based on demand and competition",
          industry: "ecommerce_retail",
          investment: "$15,000-40,000",
          expectedROI: "5-15% margin improvement",
          timeline: "6-8 weeks"
        }
      ],
      
      midScore: [
        {
          title: "Advanced Omnichannel Personalization",
          description: "AI-powered personalization across online and offline channels",
          industry: "ecommerce_retail",
          investment: "$50,000-150,000",
          expectedROI: "25-40% improvement in customer lifetime value",
          timeline: "3-6 months"
        },
        {
          title: "Inventory-Marketing Integration",
          description: "AI coordination between inventory levels and marketing campaigns",
          industry: "ecommerce_retail",
          investment: "$30,000-80,000",
          expectedROI: "20-30% improvement in inventory turnover",
          timeline: "4-8 months"
        }
      ],
      
      highScore: [
        {
          title: "Predictive Commerce Platform",
          description: "AI that anticipates customer needs and automates the entire shopping experience",
          industry: "ecommerce_retail",
          investment: "$200,000-600,000",
          expectedROI: "Revolutionary customer experience and loyalty",
          timeline: "12-24 months"
        }
      ]
    }
  },
  
  // Activity-specific recommendations
  activityRecommendations: {
    content_marketing: {
      lowScore: [
        {
          title: "Content Creation AI Stack",
          description: "Implement basic AI tools for content generation",
          investment: "$100-500/month",
          expectedROI: "3-5x content output increase",
          tools: ["ChatGPT", "Jasper", "Copy.ai"],
          timeline: "1-2 weeks"
        },
        {
          title: "AI Content Quality Framework",
          description: "Establish processes to maintain brand voice with AI content",
          investment: "$2,000-5,000",
          expectedROI: "Consistent brand representation",
          timeline: "2-4 weeks"
        }
      ],
      
      midScore: [
        {
          title: "Advanced Content Intelligence",
          description: "AI-powered content strategy and performance optimization",
          investment: "$5,000-15,000",
          expectedROI: "40-60% improvement in content effectiveness",
          timeline: "6-10 weeks"
        },
        {
          title: "Multi-Format Content Automation",
          description: "AI repurposing of content across multiple formats and channels",
          investment: "$3,000-10,000",
          expectedROI: "5x content distribution efficiency",
          timeline: "4-8 weeks"
        }
      ],
      
      highScore: [
        {
          title: "Predictive Content Strategy",
          description: "AI that predicts content performance and optimizes strategy",
          investment: "$20,000-50,000",
          expectedROI: "Strategic competitive advantage in content",
          timeline: "3-6 months"
        }
      ]
    },
    
    // Additional activity recommendations would continue here...
    // For brevity, showing structure for remaining activities
    
    social_media: {
      lowScore: [
        {
          title: "Social Media AI Automation",
          description: "Basic AI scheduling and content creation for social",
          investment: "$200-800/month",
          expectedROI: "3x social content output",
          timeline: "1-3 weeks"
        }
      ],
      midScore: [
        {
          title: "AI Social Listening and Engagement", 
          description: "Advanced AI monitoring and automated engagement",
          investment: "$2,000-8,000",
          expectedROI: "50% improvement in social engagement metrics",
          timeline: "4-8 weeks"
        }
      ],
      highScore: [
        {
          title: "Predictive Social Strategy",
          description: "AI-powered social media strategy optimization",
          investment: "$15,000-40,000",
          expectedROI: "Social media ROI leadership",
          timeline: "3-6 months"
        }
      ]
    }
    
    // Continue pattern for: seo_sem, email_marketing, analytics_data, 
    // paid_advertising, creative_design, marketing_automation, 
    // pr_communications, events_webinars
  },
  
  // Insourcing opportunity analysis
  insourcingAnalysis: {
    readinessFactors: [
      "Current AI skill level in team",
      "Volume of marketing activities",
      "Budget available for tools and training",
      "Regulatory/compliance requirements",
      "Strategic importance of marketing control"
    ],
    
    functionsToEvaluate: {
      content_creation: {
        insourcingReadiness: 85,
        avgCostSavings: "60-80%",
        keyTools: ["ChatGPT", "Claude", "Jasper"],
        timeline: "2-4 weeks",
        prerequisites: ["AI training", "brand guidelines", "quality processes"]
      },
      
      social_media_management: {
        insourcingReadiness: 78,
        avgCostSavings: "40-60%",
        keyTools: ["Hootsuite AI", "Buffer AI", "Sprout Social"],
        timeline: "3-6 weeks",
        prerequisites: ["Community management training", "crisis protocols"]
      },
      
      basic_design: {
        insourcingReadiness: 70,
        avgCostSavings: "50-70%", 
        keyTools: ["Canva AI", "Adobe Firefly", "DALL-E"],
        timeline: "4-8 weeks",
        prerequisites: ["Design training", "brand compliance systems"]
      },
      
      seo_content: {
        insourcingReadiness: 75,
        avgCostSavings: "45-65%",
        keyTools: ["Surfer SEO", "Clearscope", "MarketMuse"],
        timeline: "6-10 weeks",
        prerequisites: ["SEO knowledge", "keyword research skills"]
      },
      
      email_marketing: {
        insourcingReadiness: 88,
        avgCostSavings: "35-55%",
        keyTools: ["Mailchimp AI", "ConvertKit", "ActiveCampaign"],
        timeline: "2-4 weeks",
        prerequisites: ["Email marketing basics", "automation setup"]
      },
      
      paid_advertising: {
        insourcingReadiness: 60,
        avgCostSavings: "20-40%",
        keyTools: ["Google AI", "Meta AI", "Microsoft AI"],
        timeline: "8-16 weeks",
        prerequisites: ["Advanced PPC training", "substantial ad spend"]
      }
    },
    
    costBenefitModel: {
      calculationFactors: [
        "Current agency/contractor costs",
        "Internal resource costs (salary, tools, training)",
        "Productivity gains from AI tools",
        "Quality improvements/maintenance costs",
        "Time to competency"
      ],
      
      breakEvenTimeline: {
        content_creation: "1-2 months",
        social_media: "2-3 months", 
        basic_design: "3-4 months",
        email_marketing: "1-2 months",
        paid_advertising: "6-12 months"
      }
    }
  },
  
  // Implementation timelines and milestones
  implementationTimelines: {
    quickWins: { // 0-3 months
      description: "Immediate impact initiatives with high ROI",
      initiatives: [
        "Deploy basic AI content creation tools",
        "Implement AI email optimization",
        "Set up social media AI scheduling",
        "Basic AI analytics and reporting",
        "AI-powered customer service chatbots"
      ],
      expectedROI: "200-400% productivity improvement",
      investment: "$5,000-20,000"
    },
    
    foundationBuilding: { // 3-12 months
      description: "Core infrastructure and capability development",
      initiatives: [
        "Advanced AI tool integration",
        "Team training and skill development", 
        "Process automation and optimization",
        "Data integration and analytics platform",
        "AI governance and quality systems"
      ],
      expectedROI: "15-30% overall marketing effectiveness improvement",
      investment: "$25,000-100,000"
    },
    
    transformation: { // 12+ months
      description: "Advanced AI capabilities and strategic differentiation",
      initiatives: [
        "Predictive analytics and customer intelligence",
        "Custom AI model development",
        "Cross-functional AI integration",
        "AI-powered innovation labs",
        "Market leadership positioning"
      ],
      expectedROI: "Strategic competitive advantage and market leadership",
      investment: "$100,000-500,000+"
    }
  },
  
  // Success metrics and KPIs
  successMetrics: {
    efficiency: [
      "Content creation time reduction (%)",
      "Campaign setup and launch speed",
      "Customer service response time",
      "Lead qualification accuracy",
      "Report generation automation"
    ],
    
    effectiveness: [
      "Conversion rate improvements (%)",
      "Customer engagement metrics",
      "Lead quality and scoring accuracy",
      "Customer lifetime value increase",
      "Marketing attribution accuracy"
    ],
    
    strategic: [
      "Time to market for campaigns",
      "Competitive response speed",
      "Innovation pipeline strength",
      "Customer satisfaction scores",
      "Market share growth"
    ]
  }
};

// Make the configuration available as a browser global
window.InHouseMarketingRecommendationsConfig = InHouseMarketingRecommendationsConfig;

// Using browser globals instead of Node.js module exports