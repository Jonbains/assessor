/**
 * Agency Transformation Recommendations Engine
 * 
 * Generates personalized recommendations based on assessment scores
 * Focuses on practical transformation steps with valuation impact
 */

export class AgencyRecommendationsEngine {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Generate comprehensive recommendations based on assessment results
   * @param {Object} assessmentData - Complete assessment data including scores
   * @returns {Object} Categorized recommendations with valuation impact
   */
  generateRecommendations(assessmentData) {
    const { scores, answers, selectedServices, agencySize, revenue } = assessmentData;
    
    // Calculate recommendation priority based on scores
    const priority = this.calculatePriority(scores);
    
    return {
      immediate: this.getImmediateActions(scores, priority, selectedServices, agencySize),
      shortTerm: this.getShortTermActions(scores, priority, selectedServices, revenue),
      strategic: this.getStrategicActions(scores, priority, selectedServices),
      valuationImpact: this.getValuationImpactSummary(scores, selectedServices),
      quickWins: this.getQuickWins(scores, selectedServices, agencySize),
      transformationRoadmap: this.getTransformationRoadmap(scores, priority)
    };
  }

  /**
   * Calculate priority areas based on scores
   */
  calculatePriority(scores) {
    const priorities = [];
    
    // Check transformation readiness gaps
    if (scores.dimensions.transformation < 40) {
      priorities.push('ai_capability_building');
    }
    if (scores.dimensions.resources < 40) {
      priorities.push('resource_optimization');
    }
    if (scores.dimensions.leadership < 40) {
      priorities.push('leadership_alignment');
    }
    if (scores.dimensions.change < 40) {
      priorities.push('change_readiness');
    }
    
    // Check valuation factors
    if (scores.valuationDimensions.financial < 40) {
      priorities.push('financial_stability');
    }
    if (scores.serviceVulnerability > 70) {
      priorities.push('service_transformation');
    }
    
    return priorities;
  }

  /**
   * Get immediate actions (next 30 days)
   */
  getImmediateActions(scores, priority, selectedServices, agencySize) {
    const actions = [];
    
    // Universal immediate actions based on readiness score
    if (scores.overall < 40) {
      // Low readiness - emergency actions
      actions.push({
        title: "AI Literacy Bootcamp",
        description: "Get your entire team on ChatGPT or Claude this week. Schedule a 2-hour hands-on session where everyone creates something relevant to their role. No theory, just practice.",
        effort: "2 hours",
        impact: "Foundation for all AI adoption",
        category: "capability",
        difficulty: "easy"
      });
      
      actions.push({
        title: "Identify Your AI Champions",
        description: "Find the 2-3 people already experimenting with AI tools. Give them 4 hours/week to test tools and share findings. They'll lead your transformation.",
        effort: "30 minutes to identify, 4 hours/week ongoing",
        impact: "Accelerates adoption by 3x",
        category: "team",
        difficulty: "easy"
      });
    } else if (scores.overall < 70) {
      // Medium readiness - optimization actions
      actions.push({
        title: "AI Tool Audit",
        description: "List every repetitive task your team does. Test AI tools for the top 5 time-wasters. Document what works. Start with content creation, research, or data analysis.",
        effort: "1 day",
        impact: "Identifies 10-20 hours/week savings",
        category: "efficiency",
        difficulty: "medium"
      });
      
      actions.push({
        title: "Client AI Conversation",
        description: "Talk to your top 3 clients about AI. Ask what they're seeing, what concerns them, what excites them. Position as research, not sales.",
        effort: "3 one-hour calls",
        impact: "Shapes service evolution",
        category: "strategy",
        difficulty: "easy"
      });
    } else {
      // High readiness - leadership actions
      actions.push({
        title: "AI Service Packaging",
        description: "Create an 'AI-Enhanced' tier for your top service. Price it 30% higher, deliver 2x faster. Test with one client who values speed.",
        effort: "2 days to design",
        impact: "+30% revenue per project",
        category: "revenue",
        difficulty: "medium"
      });
      
      actions.push({
        title: "Thought Leadership Sprint",
        description: "Share your AI journey publicly. Write 3 LinkedIn posts about what's working, lessons learned, results achieved. Attract AI-forward clients.",
        effort: "3 hours",
        impact: "Positions you as innovator",
        category: "marketing",
        difficulty: "easy"
      });
    }
    
    // Service-specific immediate actions
    if (selectedServices.includes('content_creation') && scores.serviceScores?.content_creation?.vulnerability > 70) {
      actions.push({
        title: "Content AI Pilot",
        description: "This week: Use Claude or ChatGPT to draft your next 5 blog posts. Time the process. Edit for brand voice. Calculate time saved. Share results with team.",
        effort: "5 hours",
        impact: "40-60% time savings proven",
        category: "service",
        difficulty: "easy",
        service: "content_creation"
      });
    }
    
    if (selectedServices.includes('creative_design') && scores.serviceScores?.creative_design?.vulnerability > 60) {
      actions.push({
        title: "AI Concept Generation Test",
        description: "Next pitch: Generate 20 concepts with Midjourney in 1 hour vs 3 concepts manually in 3 hours. Show clients the range. Track their reaction.",
        effort: "1 hour",
        impact: "10x concept options",
        category: "service",
        difficulty: "medium",
        service: "creative_design"
      });
    }
    
    // Financial stability immediate actions
    if (scores.valuationDimensions.financial < 40) {
      actions.push({
        title: "Revenue Concentration Fix",
        description: "Your biggest client is over 30% of revenue. This week: List 10 similar companies. Reach out to 3 with a specific offer based on work you've done for Big Client.",
        effort: "1 day",
        impact: "Reduces critical risk",
        category: "financial",
        difficulty: "medium",
        valuationImpact: "+0.5-1.0x EBITDA multiple"
      });
    }
    
    return actions.slice(0, 5); // Return top 5 most relevant
  }

  /**
   * Get short-term actions (30-90 days)
   */
  getShortTermActions(scores, priority, selectedServices, revenue) {
    const actions = [];
    
    // Capability building for different readiness levels
    if (scores.dimensions.transformation < 60) {
      actions.push({
        title: "AI Workflow Documentation",
        description: "Document your new AI-enhanced processes. Create simple 1-page guides for each AI tool. Include prompts that work, time saved, quality checks needed.",
        effort: "2 days total",
        impact: "Scales AI adoption across team",
        timeline: "Next 60 days",
        category: "operations"
      });
      
      actions.push({
        title: "Team Upskilling Program",
        description: "Dedicate 2 hours every Friday to AI skills. Week 1: Prompting basics. Week 2: Tool comparison. Week 3: Integration with current workflow. Week 4: Measuring impact.",
        effort: "2 hours/week",
        impact: "Builds sustainable capability",
        timeline: "Next 4 weeks",
        category: "team"
      });
    }
    
    // Revenue optimization
    if (revenue && revenue < 2500000) {
      actions.push({
        title: "Retainer Conversion Campaign",
        description: "Convert project clients to retainers. Offer 10% discount for 6-month commitments. Target: 40% recurring revenue. Start with clients who come back quarterly.",
        effort: "1 week to plan, 2 weeks to execute",
        impact: "+20% predictable revenue",
        timeline: "Next 30 days",
        category: "financial",
        valuationImpact: "+0.5x EBITDA multiple"
      });
    }
    
    // Service transformation
    selectedServices.forEach(service => {
      const serviceScore = scores.serviceScores?.[service];
      if (serviceScore?.vulnerability > 60) {
        actions.push({
          title: `Transform ${this.getServiceName(service)}`,
          description: this.getServiceTransformationPlan(service, serviceScore),
          effort: "30-60 days",
          impact: "Maintain competitiveness",
          timeline: "Start within 30 days",
          category: "service",
          service: service
        });
      }
    });
    
    // Operational excellence
    if (scores.valuationDimensions.operational < 60) {
      actions.push({
        title: "Process Standardization Sprint",
        description: "Pick your top 3 revenue-generating services. Create templates, checklists, and workflows. Test with next 3 projects. Refine based on results.",
        effort: "1 week intensive",
        impact: "30% efficiency gain",
        timeline: "Next 45 days",
        category: "operations",
        valuationImpact: "+0.3x EBITDA multiple"
      });
    }
    
    // Leadership alignment
    if (scores.dimensions.leadership < 50) {
      actions.push({
        title: "Leadership AI Immersion",
        description: "Get leadership team hands-on with AI. Half-day session: try tools, see results from pilots, discuss implications. End with commitment to 3 initiatives.",
        effort: "Half day",
        impact: "Unlocks resources and support",
        timeline: "Within 30 days",
        category: "leadership"
      });
    }
    
    return actions.slice(0, 4); // Return top 4
  }

  /**
   * Get strategic actions (3-12 months)
   */
  getStrategicActions(scores, priority, selectedServices) {
    const actions = [];
    
    // Strategic positioning based on readiness
    if (scores.overall > 70) {
      actions.push({
        title: "AI-First Service Revolution",
        description: "Redesign all services with AI at the core. Not 'AI-enhanced' but 'AI-native'. Deliver 10x value at premium prices. Become THE AI agency in your niche.",
        timeline: "6-month transformation",
        impact: "Market leadership position",
        complexity: "high",
        category: "strategy"
      });
      
      actions.push({
        title: "Productize Your AI Expertise",
        description: "Package your AI workflows into a SaaS product. License to other agencies or direct to enterprises. Transform from service to product business.",
        timeline: "9-12 months",
        impact: "New revenue stream, higher valuation",
        complexity: "high",
        category: "innovation",
        valuationImpact: "+2-3x valuation multiple"
      });
    } else if (scores.overall > 40) {
      actions.push({
        title: "Selective AI Excellence",
        description: "Pick 2 services where AI gives biggest advantage. Become best-in-class. Let competitors keep the rest. Deep expertise beats broad mediocrity.",
        timeline: "6 months",
        impact: "Clear market differentiation",
        complexity: "medium",
        category: "strategy"
      });
      
      actions.push({
        title: "Strategic Partnerships",
        description: "Partner with AI-native agencies or tech companies. You bring clients and industry expertise, they bring AI capabilities. Win together.",
        timeline: "3-6 months",
        impact: "Accelerated transformation",
        complexity: "medium",
        category: "growth"
      });
    } else {
      actions.push({
        title: "Survival Transformation",
        description: "This is existential. Consider: Merge with AI-capable agency, pivot to AI-proof niches, or radical upskilling. Status quo means obsolescence.",
        timeline: "Make decision in 3 months",
        impact: "Business continuity",
        complexity: "high",
        category: "survival"
      });
    }
    
    // Valuation optimization strategies
    if (priority.includes('financial_stability') || priority.includes('service_transformation')) {
      actions.push({
        title: "Exit-Ready Transformation",
        description: "Build agency for acquisition. Document everything, diversify revenue, showcase AI capabilities. Target: 6-8x EBITDA multiple vs current 3-4x.",
        timeline: "12-month program",
        impact: "2x valuation increase",
        complexity: "high",
        category: "financial",
        valuationImpact: "+3-4x EBITDA multiple"
      });
    }
    
    return actions.slice(0, 3); // Return top 3
  }

  /**
   * Get quick wins for immediate momentum
   */
  getQuickWins(scores, selectedServices, agencySize) {
    const wins = [];
    const sizeNum = parseInt(agencySize.split('-')[0]) || 1;
    
    // Universal quick wins
    wins.push({
      title: "Email Writing Speed-Up",
      action: "Use Claude/ChatGPT for all client emails tomorrow",
      time: "Save 30 mins/day",
      difficulty: "trivial"
    });
    
    wins.push({
      title: "Meeting Notes Automation",
      action: "Record calls, use AI for summary and action items",
      time: "Save 2 hours/week",
      difficulty: "easy"
    });
    
    // Size-specific wins
    if (sizeNum <= 15) {
      wins.push({
        title: "Proposal Template Magic",
        action: "Feed winning proposals to AI, generate new ones in minutes",
        time: "Cut proposal time by 70%",
        difficulty: "easy"
      });
    } else {
      wins.push({
        title: "Internal Knowledge Base",
        action: "Feed all docs to Claude, create instant Q&A for team",
        time: "Save 5 hours/week on questions",
        difficulty: "medium"
      });
    }
    
    // Service-specific wins
    if (selectedServices.includes('content_creation')) {
      wins.push({
        title: "Blog Post Outlining",
        action: "AI creates outlines from keywords in 30 seconds",
        time: "Save 45 mins per post",
        difficulty: "trivial",
        service: "content"
      });
    }
    
    if (selectedServices.includes('digital_marketing')) {
      wins.push({
        title: "Ad Copy Variations",
        action: "Generate 20 ad variations in 5 minutes vs 1 hour",
        time: "Save 55 mins per campaign",
        difficulty: "easy",
        service: "digital"
      });
    }
    
    if (selectedServices.includes('creative_design')) {
      wins.push({
        title: "Mood Board Creation",
        action: "AI generates mood boards from brief in minutes",
        time: "Save 2 hours per project",
        difficulty: "easy",
        service: "creative"
      });
    }
    
    return wins.slice(0, 5); // Top 5 quick wins
  }

  /**
   * Get transformation roadmap
   */
  getTransformationRoadmap(scores, priority) {
    const phase1Duration = scores.overall < 40 ? "30 days" : "60 days";
    const phase2Duration = scores.overall < 40 ? "60 days" : "90 days";
    const phase3Duration = "6 months";
    
    return {
      phase1: {
        title: "Foundation Building",
        duration: phase1Duration,
        focus: this.getPhase1Focus(scores),
        milestones: [
          "All team members using at least one AI tool",
          "3 processes documented with AI integration",
          "First client success story"
        ]
      },
      phase2: {
        title: "Capability Expansion",
        duration: phase2Duration,
        focus: this.getPhase2Focus(scores, priority),
        milestones: [
          "50% time reduction in one service area",
          "AI-enhanced service tier launched",
          "Team confidence in AI tools > 7/10"
        ]
      },
      phase3: {
        title: "Transformation Leadership",
        duration: phase3Duration,
        focus: this.getPhase3Focus(scores),
        milestones: [
          "AI integrated across all services",
          "New AI-native service launched",
          "Recognition as AI-forward agency"
        ]
      }
    };
  }

  /**
   * Get valuation impact summary
   */
  getValuationImpactSummary(scores, selectedServices) {
    const currentMultiple = this.estimateCurrentMultiple(scores);
    const potentialMultiple = this.estimatePotentialMultiple(scores);
    const multipleDelta = potentialMultiple - currentMultiple;
    
    // Calculate specific improvements
    const improvements = [];
    
    if (scores.valuationDimensions.financial < 60) {
      improvements.push({
        action: "Improve revenue predictability",
        impact: "+0.5-1.0x multiple",
        howTo: "Convert to 40%+ recurring revenue"
      });
    }
    
    if (scores.clientConcentration > 30) {
      improvements.push({
        action: "Reduce client concentration",
        impact: "+0.5x multiple",
        howTo: "No client over 20% of revenue"
      });
    }
    
    if (scores.dimensions.transformation > 70) {
      improvements.push({
        action: "Showcase AI leadership",
        impact: "+1.0-1.5x multiple",
        howTo: "Document AI capabilities and results"
      });
    }
    
    const highVulnerabilityServices = selectedServices.filter(service => {
      const serviceScore = scores.serviceScores?.[service];
      return serviceScore?.vulnerability > 70;
    });
    
    if (highVulnerabilityServices.length > 0) {
      improvements.push({
        action: "Transform vulnerable services",
        impact: "+0.5-1.0x multiple",
        howTo: `AI-enable ${highVulnerabilityServices.join(', ')}`
      });
    }
    
    return {
      currentEstimate: `${currentMultiple.toFixed(1)}x EBITDA`,
      potentialEstimate: `${potentialMultiple.toFixed(1)}x EBITDA`,
      totalUplift: `+${multipleDelta.toFixed(1)}x`,
      improvements: improvements,
      timeframe: "12-18 months with focused execution"
    };
  }

  // Helper methods
  
  estimateCurrentMultiple(scores) {
    let baseMultiple = 3.5; // Industry average for agencies
    
    // Adjust based on financial health
    if (scores.valuationDimensions.financial > 70) {
      baseMultiple += 1.0;
    } else if (scores.valuationDimensions.financial < 40) {
      baseMultiple -= 1.0;
    }
    
    // Adjust for operational excellence
    if (scores.valuationDimensions.operational > 70) {
      baseMultiple += 0.5;
    } else if (scores.valuationDimensions.operational < 40) {
      baseMultiple -= 0.5;
    }
    
    // Adjust for AI readiness
    if (scores.dimensions.transformation > 70) {
      baseMultiple += 0.5;
    }
    
    // Penalty for service vulnerability
    if (scores.serviceVulnerability > 70) {
      baseMultiple -= 0.5;
    }
    
    return Math.max(1.5, Math.min(6.0, baseMultiple));
  }
  
  estimatePotentialMultiple(scores) {
    let potentialMultiple = this.estimateCurrentMultiple(scores);
    
    // Add potential improvements
    if (scores.valuationDimensions.financial < 60) {
      potentialMultiple += 0.75; // Financial improvement potential
    }
    
    if (scores.dimensions.transformation < 60) {
      potentialMultiple += 1.0; // AI transformation potential
    }
    
    if (scores.serviceVulnerability > 60) {
      potentialMultiple += 0.75; // Service modernization potential
    }
    
    // Cap at realistic maximum
    return Math.min(8.0, potentialMultiple);
  }
  
  getServiceName(serviceId) {
    const serviceNames = {
      content_creation: "Content Creation",
      creative_design: "Creative & Design",
      digital_marketing: "Digital Marketing",
      seo_sem: "SEO/SEM",
      pr_comms: "PR & Communications",
      strategy_consulting: "Strategy & Consulting"
    };
    return serviceNames[serviceId] || serviceId;
  }
  
  getServiceTransformationPlan(service, serviceScore) {
    const plans = {
      content_creation: "Implement AI writing workflow: Research → AI Draft → Human Edit → AI Optimize. Target: 3x output, same team. Test with next 10 pieces.",
      creative_design: "AI for ideation and variations: Brief → AI Concepts → Human Curation → AI Production. Deliver 10x options in half the time.",
      digital_marketing: "Automate optimization: AI for copy testing, bid management, audience discovery. Focus humans on strategy and client relations.",
      seo_sem: "AI-powered SEO at scale: Automated audits, content optimization, competitive tracking. Deliver enterprise-level insights to SMBs.",
      pr_comms: "AI for media intelligence: Monitor everything, predict pickup, personalize pitches. Humans focus on relationships and narrative.",
      strategy_consulting: "AI-enhanced insights: Use AI for research, analysis, and scenario modeling. Position as 'data-driven strategy' premium service."
    };
    
    return plans[service] || "Develop AI integration plan for this service";
  }
  
  getPhase1Focus(scores) {
    if (scores.overall < 40) {
      return "Emergency upskilling and quick wins";
    } else if (scores.overall < 70) {
      return "Build foundation and prove value";
    } else {
      return "Optimize and scale what's working";
    }
  }
  
  getPhase2Focus(scores, priority) {
    if (priority.includes('financial_stability')) {
      return "Revenue diversification and predictability";
    } else if (priority.includes('service_transformation')) {
      return "Service line modernization";
    } else {
      return "Capability building and integration";
    }
  }
  
  getPhase3Focus(scores) {
    if (scores.overall > 70) {
      return "Market leadership and innovation";
    } else {
      return "Competitive parity and stability";
    }
  }
}

// Export for use in assessment system
export default AgencyRecommendationsEngine;