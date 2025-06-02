/**
 * Assessment Framework - Main Entry Point
 * 
 * This module serves as the main entry point for the assessment framework.
 * It imports the necessary components and initializes the application.
 */

// Import core modules
import { assessmentFactory } from './core/assessment-factory.js';
import { AgencyAssessment } from './assessments/agency/agency-assessment.js';
import { InhouseAssessment } from './assessments/inhouse/inhouse-assessment.js';

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const selectionScreen = document.getElementById('selection-screen');
    const assessmentContainer = document.getElementById('assessment-container');
    const assessmentContent = document.getElementById('assessment-content');
    const assessmentButtons = document.querySelectorAll('.btn[data-type]');
    const backButton = document.getElementById('back-to-selection');
    
    console.log('Assessment factory available:', assessmentFactory);
    console.log('Available assessment types:', assessmentFactory.getAvailableTypes());
    
    // Create assessment instance
    let currentAssessment = null;
    
    // Handle assessment button clicks
    assessmentButtons.forEach(button => {
        button.addEventListener('click', function() {
            const assessmentType = this.getAttribute('data-type');
            
            try {
                // Create appropriate config
                let config = {};
                
                if (assessmentType === 'agency') {
                    config = {
                        type: 'agency',
                        steps: ['agency-type', 'services', 'questions', 'email', 'results'],
                        title: 'Agency Assessment'
                    };
                } else if (assessmentType === 'inhouse') {
                    config = {
                        type: 'inhouse-marketing',
                        steps: ['setup', 'questions', 'contact', 'results'],
                        title: 'In-House Marketing Assessment'
                    };
                }
                
                // Create assessment instance
                currentAssessment = assessmentFactory.createAssessment(assessmentType, config, assessmentContent);
                
                if (currentAssessment) {
                    // Hide selection screen, show assessment
                    selectionScreen.style.display = 'none';
                    assessmentContainer.style.display = 'block';
                    
                    // Initialize assessment
                    currentAssessment.init();
                } else {
                    console.error(`Could not create assessment of type: ${assessmentType}`);
                }
            } catch (e) {
                console.error('Error creating assessment:', e);
            }
        });
    });
    
    // Handle back button
    if (backButton) {
        backButton.addEventListener('click', function() {
            // Reset and hide assessment
            if (currentAssessment) {
                currentAssessment.reset();
                currentAssessment = null;
            }
            
            assessmentContainer.style.display = 'none';
            selectionScreen.style.display = 'block';
        });
    }
});

console.log('Main module loaded');
