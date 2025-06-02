/**
 * Agency Transformation Report Template
 * 
 * Generates comprehensive report with transformation focus
 * that naturally reveals valuation opportunities
 */

export class AgencyTransformationReport {
  constructor(config = {}) {
    this.config = config;
  }

  /**
   * Generate complete report
   * @param {Object} scores - All calculated scores
   * @param {Object} recommendations - Generated recommendations
   * @param {Object} metadata - Agency information
   * @returns {Object} Report sections and data
   */
  generateReport(scores, recommendations, metadata) {
    return {
      executive: this.generateExecutiveSummary(scores, recommendations, metadata),
      readiness: this.generateReadinessSection(scores),
      opportunities: this.generateOpportunitiesSection(scores, recommendations),
      roadmap: this.generateRoadmapSection(recommendations),
      valuation: this.generateValuationSection(scores, metadata),
      nextSteps: this.generateNextSteps(scores, recommendations)
    };
  }

  /**
   * Executive Summary - The Hook
   */
  generateExecutiveSummary(scores, recommendations, metadata) {
    const { agencySize, revenue, agencyType } = metadata;
    const readinessLevel = scores.categories.readiness.label;
    const topOpportunity = recommendations.immediate[0];
    const quickWinHours = this.calculateQuickWinHours(recommendations.quickWins);
    
    // Dynamic headline based on score
    let headline, subheadline, tone;
    
    if (scores.transformation >= 70) {
      headline = `You're Ahead of the Curve`;
      subheadline = `Your agency is in the top 20% for AI readiness. Here's how to extend your lead.`;
      tone = 'leadership';
    } else if (scores.transformation >= 40) {
      headline = `You're Closer Than You Think`;
      subheadline = `With some focused effort, your agency can leap ahead of competitors still figuring out AI.`;
      tone = 'opportunity';
    } else {
      headline = `Your Transformation Starts Now`;
      subheadline = `While others hesitate, you can move quickly to gain competitive advantage.`;
      tone = 'urgency';
    }
    
    return {
      headline,
      subheadline,
      tone,
      
      keyMetrics: {
        transformationScore: {
          value: scores.transformation,
          label: 'Transformation Readiness',
          interpretation: this.getScoreInterpretation(scores.transformation)
        },
        timeToSave: {
          value: quickWinHours,
          label: 'Hours/Week You Could Save',
          interpretation: 'With quick wins alone'
        },
        valuationPotential: {
          value: scores.categories.valuation.multiple,
          label: 'Current Valuation Range',
          interpretation: 'Could increase by 2-3x'
        }
      },
      
      snapshot: {
        strengths: this.identifyStrengths(scores),
        gaps: this.identifyGaps(scores),
        quickestWin: topOpportunity ? {
          action: topOpportunity.title,
          impact: topOpportunity.impact,
          effort: topOpportunity.effort
        } : null
      },
      
      narrative: this.generateNarrative(scores, metadata, tone)
    };
  }

  /**
   * Readiness Deep Dive
   */
  generateReadinessSection(scores) {
    const dimensions = [
      {
        name: 'AI Readiness',
        score: scores.dimensions.transformation,
        icon: '🤖',
        description: this.getDimensionDescription('transformation', scores.dimensions.transformation),
        insights: this.getDimensionInsights('transformation', scores.dimensions.transformation)
      },
      {
        name: 'Resource Availability',
        score: scores.dimensions.resources,
        icon: '💰',
        description: this.getDimensionDescription('resources', scores.dimensions.resources),
        insights: this.getDimensionInsights('resources', scores.dimensions.resources)
      },
      {
        name: 'Leadership Alignment',
        score: scores.dimensions.leadership,
        icon: '🎯',
        description: this.getDimensionDescription('leadership', scores.dimensions.leadership),
        insights: this.getDimensionInsights('leadership', scores.dimensions.leadership)
      },
      {
        name: 'Change Capability',
        score: scores.dimensions.change,
        icon: '🚀',
        description: this.getDimensionDescription('change', scores.dimensions.change),
        insights: this.getDimensionInsights('change', scores.dimensions.change)
      }
    ];
    
    // Service readiness breakdown
    const serviceReadiness = Object.entries(scores.serviceScores || {}).map(([service, score]) => ({
      service: this.formatServiceName(service),
      readiness: score.readiness,
      score: score.score,
      aiOpportunity: score.aiOpportunity,
      vulnerability: score.vulnerability,
      interpretation: this.getServiceInterpretation(service, score)
    }));
    
    return {
      overall: {
        score: scores.transformation,
        category: scores.categories.readiness,
        percentile: this.calculatePercentile(scores.transformation),
        comparison: `You're more ready than ${this.calculatePercentile(scores.transformation)}% of agencies your size`
      },
      dimensions,
      serviceReadiness,
      champions: this.identifyChampions(scores),
      barriers: this.identifyBarriers(scores)
    };
  }

  /**
   * Opportunities Section
   */
  generateOpportunitiesSection(scores, recommendations) {
    return {
      immediate: {
        title: "This Week's Quick Wins",
        subtitle: "Start here for immediate impact",
        items: recommendations.quickWins.map(win => ({
          ...win,
          roi: this.calculateQuickWinROI(win),
          implementation: this.getImplementationGuide(win)
        }))
      },
      
      shortTerm: {
        title: "30-90 Day Opportunities",
        subtitle: "Building momentum",
        items: recommendations.shortTerm.map(action => ({
          ...action,
          readinessScore: this.assessActionReadiness(action, scores),
          dependencies: this.identifyDependencies(action)
        }))
      },
      
      transformational: {
        title: "Game-Changing Moves",
        subtitle: "For agencies ready to lead",
        items: recommendations.strategic.filter(action => 
          scores.transformation > 60 || action.category === 'survival'
        )
      },
      
      byService: this.groupOpportunitiesByService(recommendations, scores.serviceScores)
    };
  }

  /**
   * Transformation Roadmap
   */
  generateRoadmapSection(recommendations) {
    const roadmap = recommendations.transformationRoadmap;
    
    return {
      overview: {
        title: "Your 6-Month Transformation Journey",
        totalDuration: "6 months to AI leadership",
        approach: this.determineApproach(recommendations)
      },
      
      phases: [
        {
          ...roadmap.phase1,
          weeks: this.calculateWeeks(roadmap.phase1.duration),
          criticalSuccess: this.getPhaseSuccess(1),
          resources: this.getPhaseResources(1)
        },
        {
          ...roadmap.phase2,
          weeks: this.calculateWeeks(roadmap.phase2.duration),
          criticalSuccess: this.getPhaseSuccess(2),
          resources: this.getPhaseResources(2)
        },
        {
          ...roadmap.phase3,
          weeks: this.calculateWeeks(roadmap.phase3.duration),
          criticalSuccess: this.getPhaseSuccess(3),
          resources: this.getPhaseResources(3)
        }
      ],
      
      milestones: this.generateMilestones(roadmap),
      investmentGuide: this.generateInvestmentGuide(roadmap)
    };
  }

  /**
   * Valuation Impact Section (Revealed naturally)
   */
  generateValuationSection(scores, metadata) {
    const currentMultiple = this.estimateCurrentMultiple(scores);
    const potentialMultiple = this.estimatePotentialMultiple(scores);
    const valuationLift = ((potentialMultiple / currentMultiple - 1) * 100).toFixed(0);
    
    return {
      title: "The Hidden Value in Your Transformation",
      subtitle: "How AI readiness translates to agency value",
      
      current: {
        multiple: `${currentMultiple.toFixed(1)}x EBITDA`,
        category: scores.categories.valuation.label,
        factors: this.getCurrentValueFactors(scores)
      },
      
      potential: {
        multiple: `${potentialMultiple.toFixed(1)}x EBITDA`,
        increase: `+${valuationLift}%`,
        achievableIn: "12-18 months",
        requirements: this.getValueRequirements(scores)
      },
      
      drivers: [
        {
          driver: "Recurring Revenue",
          currentImpact: this.getRecurringRevenueImpact(scores),
          potentialImpact: "+0.5-1.0x",
          action: "Convert project clients to retainers"
        },
        {
          driver: "AI Capabilities",
          currentImpact: this.getAICapabilityImpact(scores),
          potentialImpact: "+1.0-2.0x",
          action: "Demonstrate AI-enhanced services"
        },
        {
          driver: "Client Diversification",
          currentImpact: this.getClientDiversificationImpact(scores),
          potentialImpact: "+0.5x",
          action: "No client over 20% of revenue"
        },
        {
          driver: "Operational Excellence",
          currentImpact: this.getOperationalImpact(scores),
          potentialImpact: "+0.5-1.0x",
          action: "Document processes and workflows"
        }
      ],
      
      marketContext: {
        averageMultiple: "3.5-4.5x",
        topPerformers: "7-10x",
        yourPosition: this.getMarketPosition(currentMultiple),
        trend: "AI-ready agencies commanding premium valuations"
      },
      
      risks: scores.riskFactors.map(risk => ({
        ...risk,
        mitigation: this.getRiskMitigation(risk)
      }))
    };
  }

  /**
   * Next Steps CTA
   */
  generateNextSteps(scores, recommendations) {
    const urgency = this.determineUrgency(scores);
    const primaryCTA = this.getPrimaryCTA(scores);
    
    return {
      urgency,
      primaryCTA,
      
      options: [
        {
          title: "QuickMap.ai Consultation",
          description: "Get your personalized 90-day AI transformation roadmap",
          price: "£500",
          value: [
            "Detailed action plan with timelines",
            "Tool recommendations for your stack",
            "ROI projections for each initiative",
            "Team training roadmap"
          ],
          ideal: scores.transformation >= 40 ? 
            "Perfect for agencies ready to move fast" : 
            "Ideal for building strong foundations"
        },
        {
          title: "Transformation Program",
          description: "Full support to implement your AI transformation",
          price: "From £5,000",
          value: [
            "Weekly implementation support",
            "Team training and upskilling",
            "Custom AI workflow development",
            "Success metrics and optimization"
          ],
          ideal: "For agencies serious about leading their market"
        },
        {
          title: "Free Resources",
          description: "Start your journey today",
          price: "Free",
          value: [
            "AI tool comparison guide",
            "Prompt engineering templates",
            "Case studies from agencies like yours",
            "Weekly AI insights newsletter"
          ],
          ideal: "Great for exploring possibilities"
        }
      ],
      
      testimonial: this.getRelevantTestimonial(scores, metadata),
      
      booking: {
        headline: primaryCTA.headline,
        subheadline: primaryCTA.subheadline,
        buttonText: primaryCTA.buttonText,
        urgencyMessage: urgency.message
      }
    };
  }

  // Helper methods

  calculateQuickWinHours(quickWins) {
    return quickWins.reduce((total, win) => {
      const match = win.time.match(/(\d+)\s*(hours?|mins?)/i);
      if (match) {
        const value = parseInt(match[1]);
        const unit = match[2].toLowerCase();
        if (unit.includes('hour')) return total + value;
        if (unit.includes('min')) return total + (value / 60);
      }
      return total;
    }, 0).toFixed(1);
  }

  getScoreInterpretation(score) {
    if (score >= 80) return "Exceptional - you're leading the pack";
    if (score >= 70) return "Strong - well positioned for growth";
    if (score >= 60) return "Good - solid foundation to build on";
    if (score >= 50) return "Moderate - clear path forward";
    if (score >= 40) return "Developing - significant opportunity";
    if (score >= 30) return "Early stage - quick wins available";
    return "Urgent - immediate action needed";
  }

  identifyStrengths(scores) {
    const strengths = [];
    
    Object.entries(scores.dimensions).forEach(([dimension, score]) => {
      if (score >= 70) {
        strengths.push(this.getDimensionStrength(dimension));
      }
    });
    
    if (scores.serviceScores) {
      const readyServices = Object.entries(scores.serviceScores)
        .filter(([_, s]) => s.readiness === 'high')
        .length;
      if (readyServices > 0) {
        strengths.push(`${readyServices} services ready for AI enhancement`);
      }
    }
    
    return strengths.slice(0, 3);
  }

  identifyGaps(scores) {
    const gaps = [];
    
    Object.entries(scores.dimensions).forEach(([dimension, score]) => {
      if (score < 40) {
        gaps.push(this.getDimensionGap(dimension));
      }
    });
    
    if (scores.riskFactors) {
      const criticalRisks = scores.riskFactors.filter(r => r.severity === 'high');
      if (criticalRisks.length > 0) {
        gaps.push(criticalRisks[0].factor);
      }
    }
    
    return gaps.slice(0, 3);
  }

  generateNarrative(scores, metadata, tone) {
    const agencySize = parseInt(metadata.agencySize.split('-')[0]) || 10;
    
    let narrative = '';
    
    if (tone === 'leadership') {
      narrative = `As a ${metadata.agencyType} agency with ${metadata.agencySize} people, you're already ahead of most competitors in AI adoption. `;
      narrative += `Your transformation readiness score of ${scores.transformation}% puts you in the top tier. `;
      narrative += `The opportunity now is to extend your lead and capture the premium valuations that AI-forward agencies command. `;
      narrative += `With focused execution on the recommendations below, you could increase your agency's valuation by ${this.estimateValuationIncrease(scores)}% over the next 12-18 months.`;
    } else if (tone === 'opportunity') {
      narrative = `Your ${metadata.agencyType} agency shows strong potential for AI transformation. `;
      narrative += `With ${metadata.agencySize} talented people and a readiness score of ${scores.transformation}%, you're well-positioned to leap ahead. `;
      narrative += `The key is moving quickly while competitors hesitate. `;
      narrative += `Agencies that act now on AI transformation are seeing 30-40% efficiency gains and commanding premium valuations. You're just a few strategic moves away from joining them.`;
    } else {
      narrative = `The good news? You're taking action while many agencies are still in denial about AI's impact. `;
      narrative += `With ${metadata.agencySize} people to transform, you can move faster than larger agencies. `;
      narrative += `Your current readiness score of ${scores.transformation}% shows room for dramatic improvement. `;
      narrative += `Agencies that start where you are and follow a structured transformation plan typically see 50%+ efficiency gains within 6 months. The key is starting immediately with quick wins that build momentum.`;
    }
    
    return narrative;
  }

  getDimensionDescription(dimension, score) {
    const descriptions = {
      transformation: {
        high: "Your team is actively embracing AI tools and seeing results",
        medium: "Some AI experimentation happening but not systematic",
        low: "Limited AI awareness or adoption across the team"
      },
      resources: {
        high: "Strong financial position and time available for transformation",
        medium: "Some constraints but manageable with smart prioritization",
        low: "Tight resources require very focused approach"
      },
      leadership: {
        high: "Leadership fully bought into AI transformation",
        medium: "Leadership interested but needs more evidence",
        low: "Leadership skepticism is a barrier to progress"
      },
      change: {
        high: "Your agency has proven ability to adapt and transform",
        medium: "Mixed track record but capability exists",
        low: "Change is challenging for your organization"
      }
    };
    
    const level = score >= 70 ? 'high' : score >= 40 ? 'medium' : 'low';
    return descriptions[dimension][level];
  }

  formatServiceName(service) {
    const names = {
      content_creation: "Content Creation",
      creative_design: "Creative & Design",
      digital_marketing: "Digital Marketing",
      seo_sem: "SEO/SEM",
      pr_comms: "PR & Communications",
      strategy_consulting: "Strategy & Consulting"
    };
    return names[service] || service;
  }

  calculatePercentile(score) {
    // Simplified percentile calculation
    if (score >= 80) return 95;
    if (score >= 70) return 85;
    if (score >= 60) return 70;
    if (score >= 50) return 50;
    if (score >= 40) return 30;
    if (score >= 30) return 15;
    return 5;
  }

  estimateCurrentMultiple(scores) {
    let base = 3.5;
    
    if (scores.valuationDimensions.financial > 70) base += 1.0;
    else if (scores.valuationDimensions.financial < 40) base -= 1.0;
    
    if (scores.valuationDimensions.operational > 70) base += 0.5;
    else if (scores.valuationDimensions.operational < 40) base -= 0.5;
    
    if (scores.transformation > 70) base += 0.5;
    
    if (scores.serviceVulnerability > 70) base -= 0.5;
    
    return Math.max(1.5, Math.min(6.0, base));
  }

  estimatePotentialMultiple(scores) {
    let potential = this.estimateCurrentMultiple(scores);
    
    if (scores.valuationDimensions.financial < 60) potential += 0.75;
    if (scores.transformation < 60) potential += 1.0;
    if (scores.serviceVulnerability > 60) potential += 0.75;
    
    return Math.min(8.0, potential);
  }

  estimateValuationIncrease(scores) {
    const current = this.estimateCurrentMultiple(scores);
    const potential = this.estimatePotentialMultiple(scores);
    return Math.round(((potential / current) - 1) * 100);
  }

  determineUrgency(scores) {
    if (scores.serviceVulnerability > 75) {
      return {
        level: 'high',
        message: 'Your core services face immediate AI disruption',
        color: '#FF4444'
      };
    }
    if (scores.transformation < 30) {
      return {
        level: 'high',
        message: 'Competitors are pulling ahead with AI',
        color: '#FF8800'
      };
    }
    if (scores.transformation > 70) {
      return {
        level: 'opportunity',
        message: 'Perfect timing to extend your lead',
        color: '#00AA00'
      };
    }
    return {
      level: 'moderate',
      message: 'Good window to gain competitive advantage',
      color: '#FFAA00'
    };
  }

  getPrimaryCTA(scores) {
    if (scores.transformation >= 70) {
      return {
        headline: "Ready to Dominate Your Market?",
        subheadline: "Let's build your AI leadership strategy",
        buttonText: "Book Strategic Consultation"
      };
    }
    if (scores.transformation >= 40) {
      return {
        headline: "Ready to Transform Your Agency?",
        subheadline: "Get your personalized 90-day roadmap",
        buttonText: "Get Your QuickMap.ai"
      };
    }
    return {
      headline: "Ready to Future-Proof Your Agency?",
      subheadline: "Start with quick wins that prove ROI",
      buttonText: "Book Free Discovery Call"
    };
  }

  getRelevantTestimonial(scores, metadata) {
    // Return testimonial based on agency type and score
    const testimonials = {
      high: {
        quote: "Obsolete helped us go from AI-curious to AI-leaders in 6 months. We're now winning pitches we couldn't even compete for before.",
        author: "Sarah Chen",
        role: "CEO, Digital Agency (25 people)",
        result: "3x efficiency, 40% revenue growth"
      },
      medium: {
        quote: "The QuickMap.ai session was a game-changer. We went from overwhelmed to having a clear plan we could actually execute.",
        author: "Mark Thompson",
        role: "Founder, Creative Agency (15 people)",
        result: "Saving 20 hours/week within 60 days"
      },
      low: {
        quote: "We thought we were too small and too behind. Obsolete showed us exactly where to start and held our hand through the scariest parts.",
        author: "Jessica Williams",
        role: "MD, PR Agency (8 people)",
        result: "From zero to AI-powered in 90 days"
      }
    };
    
    const level = scores.transformation >= 70 ? 'high' : 
                  scores.transformation >= 40 ? 'medium' : 'low';
    
    return testimonials[level];
  }
}

// Export for use in assessment system
export default AgencyTransformationReport;