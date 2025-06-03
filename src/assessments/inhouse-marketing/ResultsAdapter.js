/**
 * InhouseMarketingResultsAdapter
 * Transforms raw scoring engine output into format for results view
 * Matching the clean structure of AgencyVulnerabilityResultsAdapter
 */

class InhouseMarketingResultsAdapter {
  adaptResults(rawResults, getResponse) {
    if (!rawResults) {
      console.error('InhouseMarketingResultsAdapter: No raw results provided');
      return null;
    }

    // Extract core data
    const overallScore = rawResults.overall || 0;
    const dimensions = rawResults.dimensions || {};
    const activityScores = rawResults.activityScores || {};
    const insights = rawResults.insights || [];
    
    // Get context from responses
    const companySize = getResponse('companySize') || 'small';
    const selectedActivities = getResponse('selectedActivities') || [];
    const revenue = getResponse('revenue');
    
    // Calculate market position
    const marketAverage = this.getMarketAverage(companySize);
    const position = overallScore > marketAverage ? 'ahead' : 'behind';
    const gap = Math.abs(overallScore - marketAverage);
    
    return {
      // Executive Summary
      executive: {
        headline: this.getHeadline(overallScore, position),
        subheadline: this.getSubheadline(overallScore, companySize),
        keyMetrics: {
          transformationScore: {
            value: overallScore,
            label: 'AI Readiness Score',
            interpretation: this.getScoreInterpretation(overallScore)
          },
          timeToSave: {
            value: `${Math.round(overallScore * 0.4)} hrs/week`,
            label: 'Potential Time Savings',
            interpretation: 'With AI implementation'
          },
          marketPosition: {
            value: position === 'ahead' ? `+${gap}%` : `-${gap}%`,
            label: 'vs Market Average',
            interpretation: `${position === 'ahead' ? 'Leading' : 'Trailing'} similar companies`
          }
        },
        narrative: this.generateNarrative(overallScore, companySize, position)
      },

      // Readiness Analysis
      readiness: {
        dimensions: [
          {
            name: 'Human Readiness',
            score: Math.round(dimensions.humanReadiness || 0),
            description: this.getDimensionDescription('humanReadiness', dimensions.humanReadiness)
          },
          {
            name: 'Technical Readiness',
            score: Math.round(dimensions.technicalReadiness || 0),
            description: this.getDimensionDescription('technicalReadiness', dimensions.technicalReadiness)
          },
          {
            name: 'Process Maturity',
            score: Math.round(dimensions.processMaturity || 0),
            description: this.getDimensionDescription('processMaturity', dimensions.processMaturity)
          }
        ],
        narrative: `Your marketing team shows ${this.getReadinessLevel(overallScore)} readiness for AI transformation. Focus on the dimensions below to accelerate your journey.`,
        activityReadiness: this.formatActivityReadiness(activityScores, selectedActivities)
      },

      // Transformation Opportunities
      opportunities: {
        immediate: {
          title: "This Week's Quick Wins",
          subtitle: "Start here for immediate impact",
          items: this.getQuickWins(overallScore, selectedActivities, dimensions)
        },
        shortTerm: {
          title: "30-90 Day Opportunities",
          subtitle: "Building momentum and capability",
          items: this.getShortTermActions(overallScore, selectedActivities, companySize)
        },
        strategic: {
          title: "Strategic Initiatives",
          subtitle: "Transform your marketing function",
          items: this.getStrategicActions(overallScore, companySize)
        }
      },

      // Transformation Roadmap
      roadmap: {
        overview: {
          title: "Your 90-Day AI Marketing Journey",
          approach: "Practical steps tailored to your team's size and capabilities"
        },
        phases: [
          {
            title: "Foundation (Days 1-30)",
            duration: "30 days",
            actions: [
              "Identify your AI champion",
              "Implement 2-3 quick wins",
              "Document current processes",
              "Start measuring baseline metrics"
            ],
            expectedOutcome: "Team buy-in and initial time savings"
          },
          {
            title: "Acceleration (Days 31-60)",
            duration: "30 days",
            actions: [
              "Roll out AI tools to full team",
              "Establish quality guidelines",
              "Connect AI tools to workflow",
              "Track and share early wins"
            ],
            expectedOutcome: "40-50% efficiency gain in key areas"
          },
          {
            title: "Optimization (Days 61-90)",
            duration: "30 days",
            actions: [
              "Refine and optimize processes",
              "Expand to new use cases",
              "Document best practices",
              "Plan next phase expansion"
            ],
            expectedOutcome: "Sustainable AI-powered marketing operation"
          }
        ]
      },

      // Impact Analysis
      impact: {
        title: "Expected Business Impact",
        subtitle: "What AI transformation means for your marketing",
        // Current state card
        current: {
          title: "Current State",
          description: "Where your marketing stands today",
          items: [
            {
              title: "Efficiency",
              value: `${100 - overallScore}% manual processes`,
              color: "warning"
            },
            {
              title: "Capacity",
              value: "Limited by team size",
              color: "warning"
            },
            {
              title: "Reach",
              value: "Constrained by resources",
              color: "warning"
            }
          ]
        },
        // Future state card
        future: {
          title: "Future State",
          description: "With AI implementation",
          items: [
            {
              title: "Efficiency",
              value: `${Math.round(overallScore * 0.7)}% automated`,
              color: "success"
            },
            {
              title: "Capacity",
              value: "2-3x current output",
              color: "success"
            },
            {
              title: "Reach",
              value: "Unlimited scaling potential",
              color: "success"
            }
          ],
          achievable: "Achievable in 6-12 months"
        },
        // Improvement metrics cards
        improvements: [
          {
            title: "Content Production",
            description: "Increase your content output",
            before: "10 pieces/month",
            after: "40+ pieces/month",
            improvement: "+300%",
            color: "success"
          },
          {
            title: "Campaign Optimization",
            description: "Improve campaign performance",
            before: "Weekly reviews",
            after: "Real-time optimization",
            improvement: "Always-on",
            color: "success"
          },
          {
            title: "Personalization",
            description: "Target your audience better",
            before: "Basic segmentation",
            after: "1:1 personalization",
            improvement: "Hyper-targeted",
            color: "success"
          }
        ]
      },

      // Next Steps
      nextSteps: {
        urgency: this.getUrgencyMessage(overallScore, position),
        primaryCTA: {
          headline: "Ready to Transform Your Marketing?",
          subheadline: "Get your personalized AI implementation roadmap",
          buttonText: "Book Your QuickMap Session"
        },
        options: [
          {
            title: "QuickMap.ai Consultation",
            price: "£500",
            description: "90-minute deep dive into your AI marketing transformation",
            value: [
              "Personalized implementation roadmap",
              "Tool recommendations for your stack",
              "ROI projections and success metrics",
              "Team enablement plan"
            ],
            idealFor: "Marketing teams ready to take action"
          },
          {
            title: "AI Marketing Bootcamp",
            price: "£2,500",
            description: "Hands-on training for your entire marketing team",
            value: [
              "2-day intensive workshop",
              "Custom AI playbooks",
              "Tool setup and configuration",
              "30-day follow-up support"
            ],
            idealFor: "Teams wanting rapid transformation"
          },
          {
            title: "Free Resources",
            price: "Free",
            description: "Start exploring on your own",
            value: [
              "AI marketing toolkit",
              "Implementation templates",
              "Weekly tips newsletter",
              "Community access"
            ],
            idealFor: "Self-starters and explorers"
          }
        ],
        testimonial: this.getRelevantTestimonial(overallScore, companySize)
      }
    };
  }

  // Helper methods
  getMarketAverage(size) {
    const averages = { solo: 35, small: 45, medium: 55, large: 65 };
    return averages[size] || 45;
  }

  getHeadline(score, position) {
    if (score >= 70) return "You're Ahead of the Curve";
    if (score >= 50) return "Building Strong Foundations";
    if (score >= 30) return "Time to Accelerate";
    return "Urgent Transformation Needed";
  }

  getSubheadline(score, size) {
    const sizeLabel = size.charAt(0).toUpperCase() + size.slice(1);
    return `Your ${sizeLabel} marketing team is ${this.getReadinessLevel(score)} for AI-powered transformation`;
  }

  getScoreInterpretation(score) {
    if (score >= 80) return "Exceptional readiness";
    if (score >= 60) return "Well-positioned";
    if (score >= 40) return "Developing capability";
    if (score >= 20) return "Early stage";
    return "Just beginning";
  }

  getReadinessLevel(score) {
    if (score >= 70) return "highly prepared";
    if (score >= 50) return "moderately prepared";
    if (score >= 30) return "somewhat prepared";
    return "not yet prepared";
  }

  generateNarrative(score, size, position) {
    const marketContext = position === 'ahead' 
      ? "ahead of most competitors" 
      : "behind the market leaders";
      
    return `As a ${size} marketing team, you're ${marketContext} in AI adoption. ` +
           `Your readiness score of ${score}% indicates ${this.getNarrativeInsight(score)}. ` +
           `With focused effort, you could ${this.getPotentialOutcome(score, size)}.`;
  }

  getNarrativeInsight(score) {
    if (score >= 70) return "strong foundations with room to excel";
    if (score >= 50) return "solid progress with clear opportunities";
    if (score >= 30) return "early momentum that needs acceleration";
    return "significant untapped potential";
  }

  getPotentialOutcome(score, size) {
    if (size === 'solo') return "compete with teams 5x your size";
    if (size === 'small') return "double your marketing output without hiring";
    if (size === 'medium') return "become the AI benchmark in your industry";
    return "transform your marketing capabilities";
  }

  getDimensionDescription(dimension, score) {
    const descriptions = {
      humanReadiness: {
        high: "Your team embraces change and has identified AI champions",
        medium: "Growing interest in AI with some resistance to overcome",
        low: "Limited AI awareness and change readiness"
      },
      technicalReadiness: {
        high: "Strong technical foundation and tool adoption",
        medium: "Basic tools in place with integration gaps",
        low: "Manual processes dominate your workflow"
      },
      processMaturity: {
        high: "Well-documented processes ready for automation",
        medium: "Some processes defined but inconsistently followed",
        low: "Ad-hoc approaches limiting scalability"
      }
    };

    const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
    return descriptions[dimension]?.[level] || '';
  }

  formatActivityReadiness(activityScores, selectedActivities) {
    return selectedActivities.map(activity => {
      const score = activityScores[activity] || 0;
      return {
        name: this.formatActivityName(activity),
        score: Math.round(score),
        interpretation: this.getActivityInterpretation(activity, score),
        aiOpportunity: this.getAIOpportunity(activity)
      };
    });
  }

  formatActivityName(activity) {
    const names = {
      content_marketing: "Content Marketing",
      email_marketing: "Email Marketing",
      social_media: "Social Media",
      seo_sem: "SEO & SEM",
      analytics_data: "Analytics & Reporting",
      paid_advertising: "Paid Advertising"
    };
    return names[activity] || activity;
  }

  getActivityInterpretation(activity, score) {
    if (score >= 70) return "Well-optimized for AI enhancement";
    if (score >= 40) return "Good foundation for AI adoption";
    return "High potential for AI transformation";
  }

  getAIOpportunity(activity) {
    const opportunities = {
      content_marketing: "3.5x content output with AI writing tools",
      email_marketing: "41% higher engagement with AI personalization",
      social_media: "60% time savings with AI scheduling",
      analytics_data: "85% faster reporting with AI insights",
      seo_sem: "2x keyword coverage with AI optimization",
      paid_advertising: "30% better ROAS with AI bidding"
    };
    return opportunities[activity] || "Significant efficiency gains possible";
  }

  getQuickWins(score, activities, dimensions) {
    const wins = [];

    // Universal quick win
    wins.push({
      title: "AI Assessment Briefing",
      description: "Schedule a 30-minute team briefing on your assessment results",
      impact: "high",
      effort: "low"
    });

    // Add activity-specific quick wins based on score and selected activities
    if (activities.includes('content_marketing')) {
      wins.push({
        title: "Content AI Setup",
        description: "Install a browser-based AI writing assistant",
        impact: "high",
        effort: "low"
      });
    }

    if (activities.includes('analytics_data')) {
      wins.push({
        title: "AI Reporting Template",
        description: "Create an AI-powered analytics dashboard",
        impact: "medium",
        effort: "medium"
      });
    }

    return wins;
  }

  getShortTermActions(score, activities, companySize) {
    const actions = [];
    
    // Base actions for all companies
    actions.push({
      title: "Team Skills Assessment",
      description: "Evaluate your team's AI readiness and identify training needs",
      impact: "medium",
      effort: "medium"
    });

    // Size-specific recommendations
    if (companySize === 'small') {
      actions.push({
        title: "AI Tool Selection",
        description: "Research and select 2-3 AI tools that align with your priorities",
        impact: "high",
        effort: "medium"
      });
    } else {
      actions.push({
        title: "AI Integration Plan",
        description: "Develop a plan to integrate AI into your existing tech stack",
        impact: "high",
        effort: "high"
      });
    }

    // Activity-specific recommendations
    if (activities.includes('email_marketing')) {
      actions.push({
        title: "Email Personalization Pilot",
        description: "Set up an AI-driven email personalization campaign",
        impact: "high",
        effort: "medium"
      });
    }

    if (activities.includes('social_media')) {
      actions.push({
        title: "Social Media Automation",
        description: "Implement AI tools for content scheduling and analytics",
        impact: "medium",
        effort: "low"
      });
    }

    return actions;
  }

  getStrategicActions(score, companySize) {
    const actions = [];
    
    // Universal strategic initiatives
    actions.push({
      title: "AI Marketing Roadmap",
      description: "Develop a comprehensive 12-month AI transformation plan",
      impact: "high",
      effort: "high"
    });

    // Score-based recommendations
    if (score < 40) {
      actions.push({
        title: "AI Foundations Program",
        description: "Establish the technical and skills foundation for AI adoption",
        impact: "high",
        effort: "high"
      });
    } else if (score < 70) {
      actions.push({
        title: "AI Center of Excellence",
        description: "Create an internal team to drive AI adoption and best practices",
        impact: "high",
        effort: "medium"
      });
    } else {
      actions.push({
        title: "Marketing AI Innovation Lab",
        description: "Establish a dedicated team for exploring cutting-edge AI applications",
        impact: "very high",
        effort: "high"
      });
    }

    // Size-specific strategic initiatives
    if (companySize === 'small') {
      actions.push({
        title: "Managed AI Services",
        description: "Partner with specialized providers for advanced AI capabilities",
        impact: "medium",
        effort: "medium"
      });
    } else if (companySize === 'medium') {
      actions.push({
        title: "Marketing Automation Overhaul",
        description: "Upgrade your marketing stack with AI-native platforms",
        impact: "high",
        effort: "high"
      });
    } else { // large
      actions.push({
        title: "Enterprise AI Integration",
        description: "Develop custom AI solutions integrated with your enterprise systems",
        impact: "very high",
        effort: "very high"
      });
    }

    return actions;
  }
  
  getUrgencyMessage(score, position) {
    if (score < 30) {
      return {
        level: 'critical',
        message: 'Your marketing function is at high risk of disruption by AI-equipped competitors'
      };
    } else if (score < 50) {
      return {
        level: 'high',
        message: 'Your competitors are pulling ahead daily with AI-powered marketing'
      };
    } else if (position === 'behind') {
      return {
        level: 'medium',
        message: 'The gap is widening - act now to catch up'
      };
    } else {
      return {
        level: 'opportunity',
        message: 'Perfect timing to extend your competitive advantage'
      };
    }
  }

  getRelevantTestimonial(score, size) {
    const testimonials = {
      low: {
        quote: "We went from overwhelmed to organized in 90 days. AI transformed how we work.",
        author: "Emma Chen",
        role: "Marketing Manager, TechStart (5 person team)",
        result: "3x content output, 50% time savings"
      },
      medium: {
        quote: "The QuickMap session showed us exactly where to start. Game-changing clarity.",
        author: "David Kumar", 
        role: "Head of Marketing, GrowthCo (15 person team)",
        result: "Doubled leads in 6 months"
      },
      high: {
        quote: "We're now competing with companies 10x our size thanks to AI automation.",
        author: "Sarah Williams",
        role: "CMO, InnovateTech (25 person team)",
        result: "Industry-leading metrics"
      }
    };

    const level = score < 40 ? 'low' : score < 70 ? 'medium' : 'high';
    return testimonials[level];
  }
}

export default InhouseMarketingResultsAdapter;