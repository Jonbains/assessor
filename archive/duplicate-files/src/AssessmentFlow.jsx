import React, { useEffect } from 'react';
import { useParams, useNavigate, Routes, Route } from 'react-router-dom';
import { useAssessment } from '../core/hooks/useAssessment';
import SectorSelection from '../core/components/SectorSelector';
import QualifyingQuestions from '../core/components/QualifyingQuestions';
import ServiceSelector from '../core/components/ServiceSelector';
import DynamicQuestions from '../core/components/DynamicQuestions';
import EmailGate from '../core/components/EmailGate';
import ResultsDashboard from '../core/components/ResultsDashboard';
import LoadingSpinner from '../core/components/LoadingSpinner';
import ErrorMessage from '../core/components/ErrorMessage';

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
            <Route path="sector" element={
                <SectorSelection 
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
                />
            } />
        </Routes>
    );
}

export default AssessmentFlow;