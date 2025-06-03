/**
 * ResultsAdapter for inhouse-marketing assessment
 * Transforms raw scoring engine output into a consistent format for the results view
 */

class InhouseMarketingResultsAdapter {
  /**
   * Adapts raw results from the scoring engine into the format needed by the view component
   * @param {Object} rawResults - Raw results object from the scoring engine
   * @param {Function} getResponse - Function to retrieve saved responses
   * @returns {Object} - Formatted results object
   */
  adaptResults(rawResults, getResponse) {
    if (!rawResults) {
      console.error('InhouseMarketingResultsAdapter: Received null/undefined rawResults');
      return null;
    }

    console.log('InhouseMarketingResultsAdapter: Processing raw results', Object.keys(rawResults || {}));
    
    // =========================================================================
    // STEP 1: Extract and validate core data points with fallbacks
    // =========================================================================
    
    // Direct extraction from raw results with fallbacks
    const overallScore = typeof rawResults.overall === 'number' ? rawResults.overall : 35;
    const dimensionScores = rawResults.dimensions || {};
    const categoryScores = rawResults.categoryScores || {};
    const activityScores = rawResults.activityScores || {};
    
    // Extract insights and priorities
    const insights = Array.isArray(rawResults.insights) ? rawResults.insights : [];
    const priorities = Array.isArray(rawResults.priorities) ? rawResults.priorities : [];
    
    // Get context data from responses
    const companySize = getResponse('companySize') || 'small';
    const sector = getResponse('sector') || {};
    const selectedActivities = Array.isArray(getResponse('selectedActivities')) 
      ? getResponse('selectedActivities') 
      : ['content_marketing', 'email_marketing', 'social_media'];
    
    console.log('InhouseMarketingResultsAdapter: Company context', { companySize, sector, selectedActivities });
    
    // =========================================================================
    // STEP 2: Create derived data objects
    // =========================================================================
    
    // Helper function to determine maturity level label
    function getMaturityLabel(score) {
      if (score < 30) return 'Initial';
      if (score < 50) return 'Developing';
      if (score < 70) return 'Defined';
      if (score < 85) return 'Managed';
      return 'Optimized';
    }
    
    // Extract strengths and weaknesses from insights
    const strengthsList = insights
      .filter(insight => insight.type === 'strength')
      .map(insight => insight.text);
    
    const weaknessesList = insights
      .filter(insight => insight.type === 'weakness')
      .map(insight => insight.text);
    
    // Ensure we have at least one strength and weakness
    if (strengthsList.length === 0) {
      strengthsList.push('Your team shows potential for growth with the right strategy');
    }
    
    if (weaknessesList.length === 0) {
      weaknessesList.push('Your marketing processes need more structure and automation');
    }
    
    // Create competitive analysis
    const competitiveAnalysis = {
      ahead: [
        'Early adoption of some automation tools',
        'Focus on key marketing channels'
      ],
      behind: [
        'Limited cross-channel integration',
        'Manual processes that could be automated'
      ]
    };
    
    // =========================================================================
    // STEP 3: Collect all user responses for reporting
    // =========================================================================
    
    // Gather all user responses from the assessment
    const collectUserResponses = () => {
      const responses = {};
      
      // Core context questions
      responses.companySize = getResponse('companySize');
      responses.sector = getResponse('sector');
      responses.selectedActivities = getResponse('selectedActivities');
      
      // Marketing capability questions
      const questions = [
        'marketing_goals', 'existing_tech', 'content_frequency', 'analytics_usage',
        'email_marketing_setup', 'social_media_presence', 'campaign_planning',
        'team_structure', 'marketing_budget', 'reporting_frequency',
        'content_creation_process', 'content_distribution', 'channel_integration',
        'automation_level', 'testing_approach', 'customer_journey'
      ];
      
      // Add all question responses
      questions.forEach(questionId => {
        const response = getResponse(questionId);
        if (response !== undefined) {
          responses[questionId] = response;
        }
      });
      
      console.log('InhouseMarketingResultsAdapter: Collected user responses', Object.keys(responses));
      return responses;
    };
    
    // Get all user responses
    const userResponses = collectUserResponses();
    
    // =========================================================================
    // STEP 4: Build the structured results object with all required sections
    // =========================================================================
    
    // Create executive summary
    const executiveSummary = {
      headline: overallScore < 40 ? 'Urgent Action Required' : 
                overallScore < 60 ? 'Improvements Needed' : 
                overallScore < 80 ? 'Good Progress' : 'Excellent Position',
      subheadline: `Your organization scored ${overallScore} out of 100 on marketing readiness.`,
      summary: `Based on your assessment responses, we've analyzed your organization's readiness for in-house marketing transformation across key dimensions. Your overall score of ${overallScore} indicates ${overallScore < 50 ? 'significant opportunities for improvement' : 'a solid foundation with room for optimization'}.`,
      strengths: strengthsList,
      weaknesses: weaknessesList
    };
    
    // Create market position
    const marketPosition = {
      position: getMaturityLabel(overallScore),
      description: `Your organization is in the ${getMaturityLabel(overallScore).toLowerCase()} stage of marketing maturity.`,
      competitiveAnalysis: competitiveAnalysis,
      industryBenchmark: {
        score: companySize === 'small' ? 30 : companySize === 'medium' ? 45 : 60,
        comparison: overallScore < 40 ? 'behind' : overallScore < 60 ? 'on par' : 'ahead'
      }
    };
    
    // Create quick wins based on selected activities
    const quickWins = [];
    
    if (selectedActivities.includes('content_marketing')) {
      quickWins.push({
        title: 'Implement Content Calendar',
        description: 'Organize your content production pipeline with a structured calendar',
        impact: 'High',
        effort: 'Low',
        implementation: [
          'Audit existing content',
          'Define content themes',
          'Create 90-day calendar'
        ]
      });
    }
    
    if (selectedActivities.includes('email_marketing')) {
      quickWins.push({
        title: 'Set Up Welcome Sequence',
        description: 'Create an automated onboarding email series for new subscribers',
        impact: 'High',
        effort: 'Medium',
        implementation: [
          'Map customer journey',
          'Draft 5-email sequence',
          'Implement automation triggers'
        ]
      });
    }
    
    if (selectedActivities.includes('social_media')) {
      quickWins.push({
        title: 'Create Content Batching Process',
        description: 'Implement efficient process for creating social posts in batches',
        impact: 'Medium',
        effort: 'Low',
        implementation: [
          'Set up content templates',
          'Schedule monthly batching sessions',
          'Use scheduling tools'
        ]
      });
    }
    
    // Ensure at least one quick win
    if (quickWins.length === 0) {
      quickWins.push({
        title: 'Audit Current Marketing Activities',
        description: 'Review existing processes to identify improvement opportunities',
        impact: 'Medium',
        effort: 'Low',
        implementation: [
          'Document current workflows',
          'Identify manual processes',
          'Prioritize automation opportunities'
        ]
      });
    }
    
    // Create strategic roadmap
    const strategicRoadmap = {
      overview: 'A 9-month phased approach to transform your marketing capabilities',
      phase1: {
        title: 'Foundation Building',
        timeframe: '0-3 months',
        focus: 'Establish fundamental processes and quick wins',
        actions: quickWins.map(win => win.title),
        expectedOutcome: 'Baseline processes established with initial efficiency gains'
      },
      phase2: {
        title: 'Capability Expansion',
        timeframe: '3-6 months',
        focus: 'Scale successful initiatives and add complexity',
        actions: [
          'Develop content repurposing workflow',
          'Segment email list based on behavior',
          'Develop cross-platform content strategy'
        ],
        expectedOutcome: 'Improved cross-channel effectiveness with better measurement'
      },
      phase3: {
        title: 'Advanced Optimization',
        timeframe: '6-9 months',
        focus: 'Refine and optimize for maximum impact',
        actions: [
          'Implement AI-assisted content creation',
          'Implement predictive send-time optimization',
          'Implement social listening and response system'
        ],
        expectedOutcome: 'Highly optimized, data-driven marketing operation'
      },
      investmentGuide: 'Estimated investment of $20,000-50,000 with 3-5x ROI potential within 12 months'
    };
    
    // Create expected outcomes
    const expectedOutcomes = [
      {
        area: 'Marketing Efficiency',
        keyMetric: 'Time Spent on Routine Tasks',
        baseline: '60% of marketing time',
        target: '30% of marketing time',
        timeframe: '6 months'
      },
      {
        area: 'Lead Generation',
        keyMetric: 'Marketing Qualified Leads',
        baseline: 'Current baseline',
        target: '35% increase',
        timeframe: '6 months'
      },
      {
        area: 'Marketing ROI',
        keyMetric: 'Return on Marketing Investment',
        baseline: 'Current baseline',
        target: '40% improvement',
        timeframe: '12 months'
      }
    ];
    
    // Add activity-specific outcomes
    if (selectedActivities.includes('content_marketing')) {
      expectedOutcomes.push({
        area: 'Content Effectiveness',
        keyMetric: 'Content Engagement Rate',
        baseline: 'Current baseline',
        target: '45% increase',
        timeframe: '6 months'
      });
    }
    
    if (selectedActivities.includes('email_marketing')) {
      expectedOutcomes.push({
        area: 'Email Performance',
        keyMetric: 'Email Conversion Rate',
        baseline: 'Current baseline',
        target: '30% increase',
        timeframe: '3 months'
      });
    }
    
    if (selectedActivities.includes('social_media')) {
      expectedOutcomes.push({
        area: 'Social Engagement',
        keyMetric: 'Social Media Conversion',
        baseline: 'Current baseline',
        target: '40% increase',
        timeframe: '6 months'
      });
    }
    
    // Create next steps
    const nextSteps = {
      primaryCTA: {
        title: 'Schedule Your Strategy Session',
        description: 'Get personalized guidance on implementing your marketing transformation plan',
        buttonText: 'Book Your QuickMap Session',
        link: 'https://calendly.com/your-booking-link'
      },
      alternatives: [
        {
          text: 'Download Full Report',
          description: 'Get a detailed PDF version of this assessment',
          link: '#download-report'
        },
        {
          text: 'Share With Your Team',
          description: 'Email these results to key stakeholders',
          link: '#share-results'
        }
      ]
    };
    
    // Get descriptions for each dimension based on insights or provide defaults
    const dimensionDescriptions = {
      strategy: 'How well your marketing initiatives align with business goals',
      execution: 'Your ability to consistently deliver marketing initiatives',
      technology: 'How effectively you leverage marketing technology',
      analytics: 'Your capability to measure and optimize marketing performance',
      process: 'Effectiveness of your marketing processes and workflows'
    };
    
    // Create maturity levels dynamically from dimension scores
    const maturityLevels = Object.entries(dimensionScores).map(([area, score]) => {
      // Find a matching insight if available
      const insight = insights.find(i => i.dimension === area);
      
      return {
        area,
        score: score || 0, // Ensure we have a valid number
        level: getMaturityLabel(score || 0),
        description: insight && insight.insight ? 
          // Use insight text if available
          typeof insight.insight === 'string' ? insight.insight : '' 
          // Otherwise use default description or empty string
          : (dimensionDescriptions[area] || '')
      };
    });
    
    // Add overall maturity
    maturityLevels.push({
      area: 'Overall Maturity',
      score: overallScore,
      level: getMaturityLabel(overallScore),
      description: 'Your overall marketing maturity across all dimensions'
    });
    
    // =========================================================================
    // STEP 5: Return the fully structured results object
    // =========================================================================
    
    // Create the final results object
    return {
      executiveSummary,
      marketPosition,
      quickWins,
      strategicRoadmap,
      expectedOutcomes,
      nextSteps,
      maturityLevels,
      
      // Additional context for reference
      assessmentType: 'inhouse-marketing',
      timestamp: new Date().toISOString(),
      
      // All user responses for reporting
      responses: userResponses,
      
      // Core context information
      context: {
        companySize,
        sector,
        selectedActivities
      },
      
      // Include the raw results for reference
      results: {
        overall: overallScore,
        dimensions: dimensionScores,
        categoryScores,
        activityScores,
        insights,
        priorities,
        readinessLevel: getMaturityLabel(overallScore),
        marketPosition: { position: getMaturityLabel(overallScore) },
        savingsPotential: {
          annualSavings: '$20,000-$40,000',
          timeReduction: '25-30%',
          roi: '150-200%'
        }
      },
      
      // Include raw data and engine data for completeness
      engineData: {
        allResponses: userResponses,
        context: {
          companySize,
          sector,
          selectedActivities
        },
        progressData: {
          current: 5,
          total: 6,
          percentage: 80,
          stageName: 'results'
        },
        completionStatus: true
      },
      _rawData: rawResults
    };
  }
}

export default InhouseMarketingResultsAdapter;
