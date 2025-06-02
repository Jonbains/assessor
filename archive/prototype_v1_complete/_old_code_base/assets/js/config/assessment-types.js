/**
 * Assessment Types Configuration
 * 
 * Defines the types of assessments available in the framework.
 * Each assessment type has its own configuration, components, and scoring system.
 */

const AssessmentTypesConfig = {
  // Available assessment types
  types: [
    {
      id: 'agency',
      name: 'Agency Assessment',
      description: 'Evaluate your agency\'s AI readiness, vulnerability, and opportunities',
      icon: 'building',
      configFile: 'assets/js/config/agency-assessment-config.js',
      recommendationsFile: 'assets/js/config/agency-recommendations-config.js',
      components: [
        'agency/AgencyTypeSelector',
        'agency/ServicesSelector',
        'agency/QuestionsRenderer',
        'agency/ResultsRenderer'
      ]
    },
    {
      id: 'inhouse',
      name: 'In-house Team Assessment',
      description: 'Evaluate your in-house marketing team\'s AI readiness and capabilities',
      icon: 'users',
      configFile: 'assets/js/config/inhouse-assessment-config.js',
      recommendationsFile: 'assets/js/config/inhouse-recommendations-config.js',
      components: [
        'inhouse/DepartmentSelector',
        'inhouse/AreasSelector',
        'inhouse/QuestionsRenderer',
        'inhouse/ResultsRenderer'
      ]
    }
  ],
  
  // Default assessment type
  defaultType: 'agency',
  
  // Assessment type capabilities
  capabilities: {
    agency: {
      services: true,
      revenue: true,
      recommendations: true,
      insights: true,
      financialImpact: true
    },
    inhouse: {
      departments: true,
      areas: true,
      budget: true,
      recommendations: true,
      roadmap: true
    }
  },
  
  // Component mappings for assessment types
  componentMappings: {
    agency: {
      'agency-type': 'AgencyTypeSelector',
      'services': 'ServicesSelector',
      'questions': 'QuestionsRenderer',
      'results': 'ResultsRenderer'
    },
    inhouse: {
      'department': 'DepartmentSelector',
      'areas': 'AreasSelector',
      'questions': 'QuestionsRenderer',
      'results': 'ResultsRenderer'
    }
  },
  
  // Step mappings for assessment types
  stepMappings: {
    agency: [
      'agency-type',
      'services',
      'questions',
      'email',
      'results'
    ],
    inhouse: [
      'department',
      'areas',
      'questions',
      'email',
      'results'
    ]
  }
};

// Export to global namespace for framework compatibility
window.AssessmentTypesConfig = AssessmentTypesConfig;
