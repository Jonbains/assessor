import React, { useEffect } from 'react';
import { useParams, useNavigate, Routes, Route, Navigate } from 'react-router-dom';
import { useAssessment } from '../core/hooks/useAssessment';
import SectorSelector from '../core/components/SectorSelector';
import QualifyingQuestions from '../core/components/QualifyingQuestions';
import ServiceSelector from '../core/components/ServiceSelector';
import DynamicQuestions from '../core/components/DynamicQuestions';
import EmailGate from '../core/components/EmailGate';
import ResultsDashboard from '../core/components/ResultsDashboard';
import LoadingSpinner from '../core/components/LoadingSpinner';
import ErrorMessage from '../core/components/ErrorMessage';

// Lazy-load assessment-specific ResultsView components
const getResultsView = (assessmentType) => {
  console.log(`Attempting to load ResultsView for assessment type: ${assessmentType}`);
  
  try {
    // Validate assessment type to prevent errors
    if (!assessmentType) {
      console.error('Cannot load ResultsView: assessmentType is undefined');
      return null;
    }
    
    // Special case for agency-vulnerability - use the enhanced toggleable view
    if (assessmentType === 'agency-vulnerability') {
      console.log('Loading ToggleableResultsView for agency-vulnerability assessment');
      try {
        const ToggleableViewModule = require('../assessments/agency-vulnerability/ToggleableResultsView.jsx');
        if (ToggleableViewModule && ToggleableViewModule.default) {
          console.log('Enhanced ToggleableResultsView successfully loaded');
          return ToggleableViewModule.default;
        }
      } catch (enhancedError) {
        console.error('Failed to load enhanced view, falling back to standard view:', enhancedError);
        // Continue to standard loading if enhanced view fails
      }
    }
    
    // Standard path for all other assessment types
    const viewPath = `../assessments/${assessmentType}/ResultsView.jsx`;
    console.log(`Attempting to require: ${viewPath}`);
    
    // This assumes each assessment type has a corresponding ResultsView.jsx
    const ResultsViewModule = require(`../assessments/${assessmentType}/ResultsView.jsx`);
    console.log('ResultsView module loaded:', ResultsViewModule);
    
    if (!ResultsViewModule || !ResultsViewModule.default) {
      console.error(`ResultsView for ${assessmentType} was loaded but no default export found:`, ResultsViewModule);
      return null;
    }
    
    // Get the default export which should be the component
    const ResultsView = ResultsViewModule.default;
    console.log('ResultsView component successfully loaded:', ResultsView ? 'Component Found' : 'Component Not Found');
    
    return ResultsView;
  } catch (error) {
    console.error(`Failed to load ResultsView for ${assessmentType}:`, error);
    return null;
  }
};

function AssessmentFlow() {
    const { type } = useParams();
    const navigate = useNavigate();
    const {
        loading,
        error,
        currentStage,
        progress,
        nextStage,
        previousStage,
        saveResponse,
        getResponse,
        setContext,
        getContext, // Added missing getContext from hook
        calculateResults,
        reset
    } = useAssessment(type);

    useEffect(() => {
        // Handle stage navigation
        if (currentStage) {
            navigate(currentStage);
        }
    }, [currentStage, navigate]);

    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <Routes>
            {/* Default route - redirect to sector selection when just /assessment/:type is accessed */}
            <Route index element={<Navigate to="sector" replace />} />
            <Route path="sector" element={
                <SectorSelector 
                    assessmentType={type}
                    onSelect={(sector) => {
                        setContext('sector', sector);
                        nextStage();
                    }}
                    onBack={previousStage}
                />
            } />
            
            <Route path="qualifying" element={
                <QualifyingQuestions 
                    assessmentType={type}
                    saveResponse={saveResponse}
                    getResponse={getResponse}
                    onComplete={nextStage}
                    onBack={previousStage}
                />
            } />
            
            <Route path="services" element={
                <ServiceSelector 
                    assessmentType={type}
                    onSelect={(services) => {
                        setContext('selectedServices', services);
                        nextStage();
                    }}
                    onBack={previousStage}
                />
            } />
            
            <Route path="questions" element={
                <DynamicQuestions 
                    assessmentType={type}
                    saveResponse={saveResponse}
                    getResponse={getResponse}
                    getContext={getContext} 
                    onComplete={nextStage}
                    onBack={previousStage}
                    progress={progress}
                />
            } />
            
            <Route path="email" element={
                <EmailGate 
                    onSubmit={(formData) => {
                        setContext('contact', formData);
                        nextStage();
                    }}
                />
            } />
            
            <Route path="results" element={
                <ResultsDashboard 
                    assessmentType={type}
                    calculateResults={calculateResults}
                    onRestart={reset}
                    getResponse={getResponse}
                    getContext={getContext}
                    ResultsView={getResultsView(type)} // Pass the ResultsView component
                />
            } />
        </Routes>
    );
}

export default AssessmentFlow;