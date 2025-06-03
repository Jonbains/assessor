import React, { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import Navigation from './Navigation';
import styles from '../styles/components.module.css';

// Debug helper function
const debugLog = (message, data) => {
    console.log(`DEBUG - ${message}:`, data);
};

// Debug helper function
const debugLog = (message, data) => {
    console.log(`DEBUG - ${message}:`, data);
};

const DynamicQuestions = ({ 
    assessmentType, 
    saveResponse, 
    getResponse, 
    getContext, 
    setContext, // Add setContext for completeness
    onComplete,
    onBack,
    progress
}) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuestions();
    }, [assessmentType]);

    const loadQuestions = async () => {
        try {
            setLoading(true);
            console.log('Loading questions for assessment type:', assessmentType);
            
            // Load core questions based on assessment type
            const module = await import(`../../assessments/${assessmentType}/questions.json`);
            const data = module.default || module;
            
            // Extract and flatten core questions array from the loaded data
            let coreQuestions = [];
            if (data.questions) {
                // Direct questions array format
                coreQuestions = data.questions;
            } else if (data.coreQuestions) {
                // Nested questions by category format
                Object.values(data.coreQuestions).forEach(questionSet => {
                    if (Array.isArray(questionSet)) {
                        coreQuestions = [...coreQuestions, ...questionSet];
                    }
                });
            }
            console.log(`Loaded ${coreQuestions.length} core questions`);
            
            // If we have selected services, load service-specific questions
            let serviceQuestions = [];
            
            // Get selected services from context or responses with detailed logging
            let selectedServices;
            console.log('DEBUG - Trying to get selectedServices...');
            
            try {
                // First try context if available
                if (typeof getContext === 'function') {
                    console.log('DEBUG - getContext function is available');
                    selectedServices = getContext('selectedServices');
                    console.log('DEBUG - selectedServices from context:', selectedServices);
                } else {
                    console.log('DEBUG - getContext is not a function');
                }
                
                // If not found in context, fall back to response
                if (!selectedServices && typeof getResponse === 'function') {
                    console.log('DEBUG - Trying getResponse for selectedServices');
                    selectedServices = getResponse('selectedServices');
                    console.log('DEBUG - selectedServices from responses:', selectedServices);
                }
                
                // Log the selected services format
                if (selectedServices) {
                    console.log('DEBUG - selectedServices type:', typeof selectedServices);
                    console.log('DEBUG - selectedServices keys:', Object.keys(selectedServices));
                    console.log('DEBUG - selectedServices values:', Object.values(selectedServices));
                } else {
                    console.log('DEBUG - selectedServices is null or undefined');
                }
            } catch (err) {
                console.error('Error getting selectedServices:', err);
            }
            
            console.log('DEBUG - Type of selectedServices:', typeof selectedServices);
            
            if (selectedServices && Object.keys(selectedServices).length > 0) {
                try {
                    // Load service-specific questions
                    console.log(`DEBUG - Loading service questions from: ../../assessments/${assessmentType}/service-questions.json`);
                    const serviceModule = await import(`../../assessments/${assessmentType}/service-questions.json`);
                    const serviceData = serviceModule.default || serviceModule;
                    
                    console.log('DEBUG - Service data structure found. Top-level keys:', Object.keys(serviceData));
                    
                    // LOWER THRESHOLD - Use 0.05 (5%) instead of 0.1 (10%)
                    const ALLOCATION_THRESHOLD = 0.05;
                    
                    // Process selected services and load their questions
                    Object.keys(selectedServices).forEach(serviceId => {
                        const allocation = selectedServices[serviceId];
                        console.log(`DEBUG - Processing service ${serviceId} with allocation ${allocation}`);
                        
                        // Only include questions for services with allocation above threshold
                        if (allocation >= ALLOCATION_THRESHOLD) {
                            let serviceQuestionSet = [];
                            
                            // First try standard format: serviceQuestions[serviceId].questions
                            if (serviceData.serviceQuestions && 
                                serviceData.serviceQuestions[serviceId] && 
                                Array.isArray(serviceData.serviceQuestions[serviceId].questions)) {
                                
                                serviceQuestionSet = serviceData.serviceQuestions[serviceId].questions;
                                console.log(`Found ${serviceQuestionSet.length} questions for service ${serviceId} in standard format`);
                            }
                            // Try alternate format: direct mapping of serviceId to questions array
                            else if (serviceData[serviceId] && Array.isArray(serviceData[serviceId])) {
                                serviceQuestionSet = serviceData[serviceId];
                                console.log(`Found ${serviceQuestionSet.length} questions for service ${serviceId} in alternate format 1`);
                            }
                            // Try another alternate format: serviceId.questions
                            else if (serviceData[serviceId] && Array.isArray(serviceData[serviceId].questions)) {
                                serviceQuestionSet = serviceData[serviceId].questions;
                                console.log(`Found ${serviceQuestionSet.length} questions for service ${serviceId} in alternate format 2`);
                            }
                            // If service ID contains underscores, try splitting and matching partial keys
                            else if (serviceId.includes('_')) {
                                const baseServiceId = serviceId.split('_')[0];
                                console.log(`Trying partial match with base service ID: ${baseServiceId}`);
                                
                                if (serviceData.serviceQuestions && serviceData.serviceQuestions[baseServiceId]) {
                                    serviceQuestionSet = serviceData.serviceQuestions[baseServiceId].questions || [];
                                    console.log(`Found ${serviceQuestionSet.length} questions using partial service ID match`);
                                }
                            }
                            // If still no match, look for any keys that include this service ID as a substring
                            else {
                                console.log(`No direct match for ${serviceId}, looking for partial matches in keys`);
                                
                                if (serviceData.serviceQuestions) {
                                    // Try to find a partial match in serviceQuestions keys
                                    const possibleMatches = Object.keys(serviceData.serviceQuestions)
                                        .filter(key => key.includes(serviceId) || serviceId.includes(key));
                                    
                                    if (possibleMatches.length > 0) {
                                        const matchedKey = possibleMatches[0];
                                        console.log(`Found potential match: ${matchedKey}`);
                                        serviceQuestionSet = serviceData.serviceQuestions[matchedKey].questions || [];
                                    }
                                }
                            }
                            
                            if (serviceQuestionSet.length > 0) {
                                console.log(`Adding ${serviceQuestionSet.length} questions for service ${serviceId} (allocation: ${Math.round(allocation * 100)}%)`);
                                serviceQuestions = [...serviceQuestions, ...serviceQuestionSet];
                            } else {
                                console.warn(`No questions found for service ${serviceId} despite searching all possible formats`);
                            }
                        } else {
                            console.log(`Skipping questions for service ${serviceId} - allocation too low (${Math.round(allocation * 100)}% < ${ALLOCATION_THRESHOLD * 100}%)`);
                        }
                    });
                } catch (err) {
                    console.error('Error loading service questions:', err);
                    console.error('Error details:', err.message, err.stack);
                }
            } else {
                console.warn('No services selected or invalid selectedServices format:', selectedServices);
            }
            
            console.log(`Found ${serviceQuestions.length} total service-specific questions`);
            
            // Remove any potential duplicate questions by ID
            const uniqueQuestions = [];
            const questionIds = new Set();
            
            // First add core questions
            coreQuestions.forEach(q => {
                if (!questionIds.has(q.id)) {
                    questionIds.add(q.id);
                    uniqueQuestions.push(q);
                }
            });
            
            // Then add service questions, avoiding duplicates
            serviceQuestions.forEach(q => {
                if (!questionIds.has(q.id)) {
                    questionIds.add(q.id);
                    uniqueQuestions.push(q);
                }
            });
            
            console.log(`Total unique questions to display: ${uniqueQuestions.length}`);
            console.log('Question IDs:', Array.from(questionIds));
            
            setQuestions(uniqueQuestions);
        } catch (error) {
            console.error('Failed to load questions:', error);
        } finally {
            setLoading(false);
        }
    };

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleAnswer = (questionId, value) => {
        // Save the answer
        saveResponse(questionId, value);
        
        // Auto-advance to next question after a short delay
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }, 300);
    };

        
        // Remove any potential duplicate questions by ID
        const uniqueQuestions = [];
        const questionIds = new Set();
        
        // First add core questions
        coreQuestions.forEach(q => {
            if (!questionIds.has(q.id)) {
                questionIds.add(q.id);
                uniqueQuestions.push(q);
            }
        });
        
        // Then add service questions, avoiding duplicates
        serviceQuestions.forEach(q => {
            if (!questionIds.has(q.id)) {
                questionIds.add(q.id);
                uniqueQuestions.push(q);
            }
        });
        
        console.log(`Total unique questions to display: ${uniqueQuestions.length}`);
        console.log('Question IDs:', Array.from(questionIds));
        
        setQuestions(uniqueQuestions);
    } catch (error) {
        console.error('Failed to load questions:', error);
    } finally {
        setLoading(false);
    }
};

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleAnswer = (questionId, value) => {
        // Save the answer
        saveResponse(questionId, value);
        
        // Auto-advance to next question after a short delay
        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
            }
        }, 300);
    };

    const handleNext = () => {
        // Validate if the current question is answered
        const currentQ = questions[currentQuestionIndex];
        if (currentQ && currentQ.required !== false && !getResponse(currentQ.id)) {
            alert('Please answer this question before continuing');
            return;
        }
        
        if (isLastQuestion) {
            // Before completing, ensure selectedServices is stored in both context and responses
            if (typeof getContext === 'function') {
                const selectedServices = getContext('selectedServices');
                if (selectedServices && typeof saveResponse === 'function') {
                    // Save as a response to ensure it's available in both places
                    saveResponse('selectedServices', selectedServices);
                    debugLog('Saved selectedServices to responses as backup', selectedServices);
                }
            }
            
            // Move to the next stage using onComplete callback
            if (onComplete) {
                onComplete();
            }
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            // Go back to the previous stage in the assessment flow
            onBack();
        }
    };

    const handleSkip = () => {
        handleNext();
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
                <p>Loading questions...</p>
            </div>
        );
    }

    if (!currentQuestion) {
        return (
            <div className={styles.errorContainer}>
                <p>No questions available for this assessment.</p>
                <button onClick={onBack}>Go Back</button>
            </div>
        );
    }

    const selectedValue = getResponse(currentQuestion.id);

    return (
        <div className={styles.qualifyingContainer}>
            <ProgressBar progress={progress || 65} stage="assessment" />
            
            <div className={styles.questionContainer}>
                <div className={styles.questionHeader}>
                    <h2>Your Organization Assessment</h2>
                    <p className={styles.questionNumber}>
                        Question {currentQuestionIndex + 1} of {questions.length}
                    </p>
                </div>

                {currentQuestion && (
                    <div className={styles.questionContent}>
                        <h3 className={styles.questionText}>
                            {currentQuestion.question || currentQuestion.text}
                            {currentQuestion.required !== false && <span className={styles.required}>*</span>}
                        </h3>
                        
                        <div className={styles.optionsGrid}>
                            {currentQuestion.options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`${styles.optionButton} ${
                                        selectedValue === (option.value || option.score || index) ? styles.selected : ''
                                    }`}
                                    onClick={() => handleAnswer(currentQuestion.id, option.value || option.score || index)}
                                >
                                    <span className={styles.optionLabel}>{option.label || option.text}</span>
                                </button>
                            ))}
                        </div>
                        
                        {currentQuestion.insight && (
                            <p className={styles.questionInsight}>{currentQuestion.insight}</p>
                        )}
                        
                        {currentQuestion.benchmark && (
                            <p className={styles.questionBenchmark}>{currentQuestion.benchmark}</p>
                        )}
                    </div>
                )}

                {/* Question navigation dots */}
                <div className={styles.questionDots}>
                    {questions.map((_, index) => (
                        <button
                            key={index}
                            className={`${styles.dot} ${
                                index === currentQuestionIndex ? styles.active : ''
                            } ${getResponse(questions[index].id) ? styles.answered : ''}`}
                            onClick={() => setCurrentQuestionIndex(index)}
                            aria-label={`Go to question ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            <Navigation
                onBack={handlePrevious}
                onNext={handleNext}
                onSkip={currentQuestion?.required === false ? handleSkip : null}
                nextLabel={isLastQuestion ? "Complete" : "Continue"}
                showNext={true}
            />
        </div>
    );
};

export default DynamicQuestions;