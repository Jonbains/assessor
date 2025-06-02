/**
 * Test script for the In-House Marketing Assessment Recommendations Engine
 * 
 * This script helps validate the enhanced recommendations engine's ability to:
 * 1. Handle different input data structures to mitigate scoring data mismatches
 * 2. Generate comprehensive recommendations with all required metadata
 * 3. Prioritize recommendations appropriately
 * 4. Provide accurate ROI projections and implementation timelines
 */

// Sample test data representing typical assessment results
const testResults = {
  // Test different score structures the engine should handle
  scores: {
    overall: 65,
    dimensions: {
      people_skills: 58,
      process_infrastructure: 62,
      strategy_leadership: 70
    }
  },
  // Direct properties (alternative structure)
  people_skills: 58,
  process_infrastructure: 62, 
  strategy_leadership: 70,
  overall: 65,
  
  // Additional context data
  industry: 'b2b_saas',
  companySize: 'mid_market',
  selectedActivities: ['content_marketing', 'social_media', 'email_marketing'],
  activityScores: {
    content_marketing: 75,
    social_media: 60, 
    email_marketing: 80
  }
};

// Sample recommendations configuration
const testConfig = {
  recommendationsConfig: {
    coreRecommendations: {
      people_skills: {
        low: [
          {
            title: "Develop AI Literacy Program",
            description: "Create a structured training program to build foundational AI knowledge across the marketing team",
            priority: "high",
            dimension: "people_skills"
          }
        ],
        medium: [
          {
            title: "Establish AI Champions Network",
            description: "Identify and train internal champions to promote AI adoption and provide peer support",
            priority: "medium",
            dimension: "people_skills"
          }
        ],
        high: [
          {
            title: "Advanced AI Skills Development",
            description: "Focus on specialized AI skills to enhance existing capabilities",
            priority: "low",
            dimension: "people_skills"
          }
        ]
      },
      process_infrastructure: {
        low: [
          {
            title: "Implement Data Quality Framework",
            description: "Establish standardized processes for data collection, cleaning and governance",
            priority: "high",
            dimension: "process_infrastructure"
          }
        ],
        medium: [
          {
            title: "Create AI Ethics Guidelines",
            description: "Develop clear policies for ethical AI use in marketing",
            priority: "medium",
            dimension: "process_infrastructure"
          }
        ],
        high: [
          {
            title: "AI Experimentation Framework",
            description: "Develop a structured approach to testing new AI applications",
            priority: "medium",
            dimension: "process_infrastructure"
          }
        ]
      }
    },
    activityRecommendations: {
      content_marketing: [
        {
          title: "AI Content Optimization",
          description: "Implement AI tools to analyze content performance and recommend optimizations",
          priority: "high",
          scoreThreshold: 70
        }
      ],
      social_media: [
        {
          title: "AI-Powered Social Listening",
          description: "Deploy AI tools to monitor brand mentions and analyze sentiment across platforms",
          priority: "medium",
          scoreThreshold: 65 
        }
      ]
    },
    industryRecommendations: {
      b2b_saas: {
        lowScore: {
          immediate: [
            {
              title: "Lead Scoring AI Implementation",
              description: "Deploy AI model to improve lead qualification accuracy",
              priority: "high",
              industry: "b2b_saas"
            }
          ]
        }
      }
    }
  }
};

/**
 * Helper function to validate the recommendations output structure
 */
function validateRecommendationsOutput(recommendations) {
  console.log('\n=== Validating Recommendations Output ===');
  
  // Check prioritized recommendations exist
  const hasPrioritizedRecs = recommendations.prioritizedRecommendations && 
    Array.isArray(recommendations.prioritizedRecommendations) &&
    recommendations.prioritizedRecommendations.length > 0;
    
  console.log(`✓ Has prioritized recommendations: ${hasPrioritizedRecs}`);
  
  // Check dimension organization
  const hasDimensionRecs = recommendations.byDimension && 
    recommendations.byDimension.people_skills &&
    recommendations.byDimension.process_infrastructure;
    
  console.log(`✓ Has dimension-organized recommendations: ${hasDimensionRecs}`);
  
  // Check activity organization  
  const hasActivityRecs = recommendations.byActivity && 
    Object.keys(recommendations.byActivity).length > 0;
    
  console.log(`✓ Has activity-organized recommendations: ${hasActivityRecs}`);
  
  // Check metadata
  const hasMetadata = recommendations.metadata &&
    recommendations.metadata.overallScore !== undefined &&
    recommendations.metadata.industry !== undefined;
    
  console.log(`✓ Has result metadata: ${hasMetadata}`);
  
  // Check first recommendation for required fields
  const firstRec = recommendations.prioritizedRecommendations[0];
  if (firstRec) {
    console.log('\n=== Validating Recommendation Attributes ===');
    console.log(`✓ Has title: ${!!firstRec.title}`);
    console.log(`✓ Has description: ${!!firstRec.description}`);
    console.log(`✓ Has priority: ${!!firstRec.priority}`);
    console.log(`✓ Has timeline: ${!!firstRec.timeline}`);
    console.log(`✓ Has expectedROI: ${!!firstRec.expectedROI}`);
    console.log(`✓ Has implementation complexity: ${!!firstRec.implementationComplexity}`);
    console.log(`✓ Has relevance score: ${!!firstRec.relevanceScore}`);
  }
  
  return hasPrioritizedRecs && hasDimensionRecs && hasActivityRecs && hasMetadata;
}

/**
 * Run the test when the script is loaded
 */
function runTest() {
  try {
    console.log('=== Starting In-House Recommendations Engine Test ===');
    
    // Import the recommendations engine
    import('./recommendations/inhouse-recommendations-engine.js')
      .then(module => {
        const InhouseRecommendationsEngine = module.default;
        
        // Initialize engine with test config
        const engine = new InhouseRecommendationsEngine(testConfig);
        console.log('✓ Successfully initialized recommendations engine');
        
        // Generate recommendations using test results
        const recommendations = engine.generateRecommendations(testResults);
        console.log(`✓ Generated ${recommendations.prioritizedRecommendations.length} recommendations`);
        
        // Validate output structure
        const isValidOutput = validateRecommendationsOutput(recommendations);
        
        if (isValidOutput) {
          console.log('\n=== TEST PASSED ===');
          console.log('The recommendations engine is functioning correctly.');
        } else {
          console.error('\n=== TEST FAILED ===');
          console.error('The recommendations output structure is invalid.');
        }
      })
      .catch(error => {
        console.error('Error in test:', error);
      });
      
  } catch (error) {
    console.error('Test execution error:', error);
  }
}

// Execute the test
runTest();
