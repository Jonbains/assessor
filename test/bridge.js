// Assessment Tester Bridge Script
// This script exposes React components and adapters to the tester environment

(function() {
    console.log('Bridge script initializing...');
    
    // Create a global namespace for our adapters and views
    window.AssessorComponents = window.AssessorComponents || {};
    
    try {
        // Manually define the InhouseMarketingResultsAdapter class
        window.InhouseMarketingResultsAdapter = function() {
            this.adaptResults = function(rawResults, getResponse) {
                const overallScore = rawResults.overallScore || 0;
                const dimensions = rawResults.dimensions || {};
                const selectedActivities = rawResults.selectedActivities || [];
                const metadata = rawResults.metadata || {};
                const companySize = metadata.companySize || 'small';
                const position = metadata.marketPosition || 'equal';
                
                return {
                    assessmentType: 'inhouse-marketing',
                    overallScore: overallScore,
                    dimensions: dimensions,
                    timestamp: new Date().toISOString(),
                    metadata: metadata,
                    impact: this.getImpactData(overallScore),
                    opportunities: {
                        immediate: {
                            title: 'Quick Wins',
                            items: this.getQuickWins(overallScore, selectedActivities, dimensions)
                        },
                        shortTerm: {
                            title: 'Short Term Actions (30-90 days)',
                            items: this.getShortTermActions(overallScore, selectedActivities, companySize)
                        },
                        strategic: {
                            title: 'Strategic Initiatives',
                            items: this.getStrategicActions(overallScore, companySize)
                        }
                    },
                    nextSteps: {
                        urgency: this.getUrgencyMessage(overallScore, position),
                        cta: {
                            title: 'Schedule Your AI Strategy Session',
                            description: 'Book a 45-minute consultation to review your assessment and create an actionable implementation plan.',
                            buttonText: 'Book Strategy Session'
                        }
                    }
                };
            };
            
            this.getImpactData = function(score) {
                return {
                    currentState: {
                        title: "Current State",
                        items: [
                            {
                                title: "Marketing Efficiency",
                                description: "Your current marketing operations efficiency",
                                value: `${Math.max(10, Math.round(score * 0.5))}%`,
                                status: "warning"
                            },
                            {
                                title: "Team Capacity",
                                description: "Your team's available bandwidth for strategic work",
                                value: `${Math.max(15, Math.round(score * 0.45))}%`,
                                status: "warning"
                            },
                            {
                                title: "Market Reach",
                                description: "Your ability to target and engage your audience",
                                value: `${Math.max(20, Math.round(score * 0.6))}%`,
                                status: "warning"
                            }
                        ]
                    },
                    futureState: {
                        title: "AI-Enhanced Future State",
                        items: [
                            {
                                title: "Marketing Efficiency",
                                description: "Projected operations efficiency with AI",
                                value: `${Math.min(95, Math.round(score * 0.5 + 40))}%`,
                                status: "success"
                            },
                            {
                                title: "Team Capacity",
                                description: "Projected strategic bandwidth with AI",
                                value: `${Math.min(90, Math.round(score * 0.45 + 35))}%`,
                                status: "success"
                            },
                            {
                                title: "Market Reach",
                                description: "Projected audience engagement with AI",
                                value: `${Math.min(85, Math.round(score * 0.6 + 30))}%`,
                                status: "success"
                            }
                        ]
                    },
                    improvements: {
                        title: "Expected Improvements",
                        items: [
                            {
                                title: "Efficiency Gain",
                                description: "Increase in operational efficiency",
                                before: `${Math.max(10, Math.round(score * 0.5))}%`,
                                after: `${Math.min(95, Math.round(score * 0.5 + 40))}%`,
                                improvement: `${Math.round(40 + score * 0.3)}%`
                            },
                            {
                                title: "Capacity Increase",
                                description: "Growth in available team bandwidth",
                                before: `${Math.max(15, Math.round(score * 0.45))}%`,
                                after: `${Math.min(90, Math.round(score * 0.45 + 35))}%`,
                                improvement: `${Math.round(35 + score * 0.25)}%`
                            },
                            {
                                title: "Reach Expansion",
                                description: "Growth in audience targeting capability",
                                before: `${Math.max(20, Math.round(score * 0.6))}%`,
                                after: `${Math.min(85, Math.round(score * 0.6 + 30))}%`,
                                improvement: `${Math.round(30 + score * 0.2)}%`
                            }
                        ]
                    }
                };
            };
            
            this.getQuickWins = function(score, activities, dimensions) {
                const wins = [];
                
                // Basic quick wins for everyone
                wins.push({
                    title: "AI Assessment Briefing",
                    description: "Schedule a 30-minute team briefing on your assessment results",
                    impact: "high",
                    effort: "low"
                });
                
                wins.push({
                    title: "AI Tools Inventory",
                    description: "Catalog current tools with AI capabilities and identify gaps",
                    impact: "medium",
                    effort: "low"
                });
                
                // Add score-based quick wins
                if (score < 50) {
                    wins.push({
                        title: "Basic AI Training",
                        description: "Arrange intro-level AI marketing training for your team",
                        impact: "high",
                        effort: "medium"
                    });
                } else {
                    wins.push({
                        title: "AI Prompting Workshop",
                        description: "Conduct an advanced AI prompting session for content creation",
                        impact: "high",
                        effort: "medium"
                    });
                }
                
                return wins;
            };
            
            this.getShortTermActions = function(score, activities, companySize) {
                const actions = [];
                
                actions.push({
                    title: "Content Automation Plan",
                    description: "Develop a roadmap for automating repetitive content creation tasks",
                    impact: "high",
                    effort: "medium"
                });
                
                actions.push({
                    title: "AI Skills Assessment",
                    description: "Evaluate team members' AI proficiency and identify training needs",
                    impact: "medium",
                    effort: "medium"
                });
                
                // Add score-based short term actions
                if (score < 40) {
                    actions.push({
                        title: "Pilot Project",
                        description: "Launch a simple AI marketing automation pilot project",
                        impact: "medium",
                        effort: "medium"
                    });
                } else if (score < 70) {
                    actions.push({
                        title: "Workflow Redesign",
                        description: "Redesign one key marketing workflow to incorporate AI",
                        impact: "high",
                        effort: "medium"
                    });
                } else {
                    actions.push({
                        title: "Advanced Integration",
                        description: "Connect AI tools to your existing martech stack",
                        impact: "high",
                        effort: "high"
                    });
                }
                
                return actions;
            };
            
            this.getStrategicActions = function(score, companySize) {
                const actions = [];
                
                actions.push({
                    title: "AI Marketing Roadmap",
                    description: "Develop a 12-month strategic plan for AI transformation",
                    impact: "high",
                    effort: "high"
                });
                
                if (score < 50) {
                    actions.push({
                        title: "Foundation Building",
                        description: "Establish the data and technology foundation for AI marketing",
                        impact: "high",
                        effort: "high"
                    });
                } else {
                    actions.push({
                        title: "Advanced AI Strategy",
                        description: "Develop predictive modeling and generative AI content strategy",
                        impact: "high",
                        effort: "high"
                    });
                }
                
                return actions;
            };
            
            this.getUrgencyMessage = function(score, position) {
                // Urgency message based on score and position
                let urgency = {
                    level: "medium",
                    message: "Your organization should begin implementing AI marketing tools in the next 3-6 months to maintain competitive parity."
                };
                
                if (score < 30) {
                    urgency = {
                        level: "critical",
                        message: "Your organization is at significant risk of falling behind. Immediate action is required to begin AI adoption in your marketing operations."
                    };
                } else if (score < 50) {
                    urgency = {
                        level: "high",
                        message: "Your organization needs to accelerate AI adoption within the next 1-3 months to avoid competitive disadvantage."
                    };
                } else if (position === "behind") {
                    urgency = {
                        level: "medium",
                        message: "While you've made good progress, your competitors are moving faster. Focus on strategic AI implementation in the next quarter."
                    };
                } else if (score > 75) {
                    urgency = {
                        level: "opportunity",
                        message: "Your organization is well-positioned to leverage advanced AI marketing capabilities for competitive advantage."
                    };
                }
                
                return urgency;
            };
        };
        
        // Manually define the AgencyVulnerabilityResultsAdapter class
        window.AgencyVulnerabilityResultsAdapter = function() {
            this.adaptResults = function(rawResults, getResponse) {
                const overallScore = rawResults.overallScore || 0;
                const dimensions = rawResults.dimensions || {};
                const metadata = rawResults.metadata || {};
                
                return {
                    assessmentType: 'agency-vulnerability',
                    overallScore: overallScore,
                    dimensions: dimensions,
                    timestamp: new Date().toISOString(),
                    metadata: metadata,
                    actions: {
                        title: 'Recommended Actions',
                        items: this.getActions(overallScore)
                    }
                };
            };
            
            this.getActions = function(score) {
                const actions = [];
                
                // Basic actions for all scores
                actions.push({
                    title: "Client Diversification Strategy",
                    description: "Develop a plan to reduce revenue concentration and diversify your client portfolio",
                    impact: "high",
                    effort: "medium"
                });
                
                actions.push({
                    title: "Value-Based Pricing Model",
                    description: "Transition from hourly billing to outcome-based pricing for key services",
                    impact: "high",
                    effort: "medium"
                });
                
                // Score-based actions
                if (score < 40) {
                    actions.push({
                        title: "Emergency Cash Flow Plan",
                        description: "Create a 90-day cash conservation and revenue acceleration plan",
                        impact: "high",
                        effort: "low"
                    });
                    
                    actions.push({
                        title: "Client Contract Review",
                        description: "Audit all client contracts to identify at-risk revenue and upsell opportunities",
                        impact: "high",
                        effort: "medium"
                    });
                } else if (score < 70) {
                    actions.push({
                        title: "Productized Service Launch",
                        description: "Convert one high-demand service into a standardized product with fixed pricing",
                        impact: "medium",
                        effort: "medium"
                    });
                    
                    actions.push({
                        title: "Strategic Partnership Program",
                        description: "Establish 2-3 strategic partnerships to expand service offerings without adding overhead",
                        impact: "medium",
                        effort: "high"
                    });
                } else {
                    actions.push({
                        title: "Recurring Revenue Acceleration",
                        description: "Increase MRR component of your business by 25% through retainer optimization",
                        impact: "high",
                        effort: "medium"
                    });
                    
                    actions.push({
                        title: "AI Service Transformation",
                        description: "Develop AI-enhanced service offerings to increase margins and differentiate from competitors",
                        impact: "high",
                        effort: "high"
                    });
                }
                
                return actions;
            };
        };
        
        console.log('Bridge script initialized - adapter classes exported to window');
    } catch (error) {
        console.error('Bridge script initialization error:', error);
    }
})();

// Expose components to the global scope
(function() {
  try {
    // Store original React components in the window object
    if (typeof InhouseMarketingResultsAdapter !== 'undefined') {
      window.InhouseMarketingResultsAdapter = InhouseMarketingResultsAdapter;
    }
    
    if (typeof AgencyVulnerabilityResultsAdapter !== 'undefined') {
      window.AgencyVulnerabilityResultsAdapter = AgencyVulnerabilityResultsAdapter;
    }
    
    if (typeof InhouseResultsView !== 'undefined') {
      window.InhouseResultsView = InhouseResultsView;
    }
    
    if (typeof AgencyResultsView !== 'undefined') {
      window.AgencyResultsView = AgencyResultsView;
    }
    
    if (typeof ReportGenerator !== 'undefined') {
      window.ReportGenerator = ReportGenerator;
    }
    
    if (typeof ResultsAdapterFactory !== 'undefined') {
      window.ResultsAdapterFactory = ResultsAdapterFactory;
    }
    
    console.log('Bridge script executed successfully, components exposed to window object');
  } catch (error) {
    console.error('Error in bridge script:', error);
  }
})();
