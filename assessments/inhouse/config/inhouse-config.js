/**
 * In-House Marketing Assessment - Configuration
 * 
 * Central configuration file for the in-house marketing assessment.
 * Includes industry definitions, activity options, and questions.
 */

// Import questions configuration
import { InHouseMarketingQuestionsConfig } from './inhouse_questions.js';

/**
 * Main configuration for the In-House Marketing Assessment
 */
const InhouseMarketingConfig = {
    // Assessment type identifier
    type: 'inhouse-marketing',
    
    // Assessment title
    title: 'In-House Marketing AI Readiness Assessment',
    
    // Assessment description
    description: 'Evaluate your in-house marketing team\'s AI readiness across people, process, and strategy dimensions.',
    
    // Step sequence
    stepSequence: ['setup', 'questions', 'contact', 'results'],
    
    // Industry options - Inherit from questions config
    industries: InHouseMarketingQuestionsConfig.industries,
    
    // Activity options - Inherit from questions config
    activities: InHouseMarketingQuestionsConfig.activities,
    
    // Question categories
    coreQuestions: {
        // People & Skills dimension
        people_skills: InHouseMarketingQuestionsConfig.questions.filter(q => 
            q.dimension === 'people_skills' && q.type === 'core'
        ),
        
        // Process & Infrastructure dimension
        process_infrastructure: InHouseMarketingQuestionsConfig.questions.filter(q => 
            q.dimension === 'process_infrastructure' && q.type === 'core'
        ),
        
        // Strategy & Leadership dimension
        strategy_leadership: InHouseMarketingQuestionsConfig.questions.filter(q => 
            q.dimension === 'strategy_leadership' && q.type === 'core'
        )
    },
    
    // Industry-specific questions - Organize by industry
    industryQuestions: (() => {
        const industryQuestions = {};
        
        // Create an entry for each industry
        InHouseMarketingQuestionsConfig.industries.forEach(industry => {
            industryQuestions[industry.id] = InHouseMarketingQuestionsConfig.questions.filter(q => 
                q.type === 'industry' && q.industry === industry.id
            );
        });
        
        return industryQuestions;
    })(),
    
    // Activity-specific questions - Organize by activity
    activityQuestions: (() => {
        const activityQuestions = {};
        
        // Create an entry for each activity
        InHouseMarketingQuestionsConfig.activities.forEach(activity => {
            activityQuestions[activity.id] = InHouseMarketingQuestionsConfig.questions.filter(q => 
                q.type === 'activity' && q.activity === activity.id
            );
        });
        
        return activityQuestions;
    })(),
    
    // Default state
    defaultState: {
        currentStep: 'setup',
        answers: {},
        selectedIndustry: null,
        selectedActivities: [],
        companySize: null,
        companyName: '',
        currentQuestionIndex: 0,
        currentQuestionType: 'core'
    },
    
    // Storage key for persisting state
    storageKey: 'inhouse-marketing-assessment-state'
};

export default InhouseMarketingConfig;
export { InhouseMarketingConfig };
