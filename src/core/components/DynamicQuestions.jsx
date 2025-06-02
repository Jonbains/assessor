import React, { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import Navigation from './Navigation';
import styles from '../styles/components.module.css';

// Debug helper function
const debugLog = (message, data) => {
    console.log(`DEBUG - ${message}:`, data);
};

const DynamicQuestions = ({ 
    assessmentType, 
    saveResponse, 
    getResponse, 
    getContext,
    setContext, 
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
            debugLog('Loading questions for assessment type', assessmentType);
            
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
            debugLog(`Loaded core questions`, coreQuestions.length);
            
            // If we have selected services, load service-specific questions
            let serviceQuestions = [];
            
            // Get selected services from context or responses with detailed logging
            let selectedServices;
            debugLog('Trying to get selectedServices', '');
            try {
                selectedServices = getContext('selectedServices');
                debugLog('Retrieved selectedServices from context', selectedServices);
                
                // If not in context, try to get from responses
                if (!selectedServices || Object.keys(selectedServices).length === 0) {
                    const servicesResponse = getResponse('selectedServices');
                    if (servicesResponse) {
                        selectedServices = servicesResponse;
                        debugLog('Retrieved selectedServices from responses', selectedServices);
                    }
                }
            } catch (err) {
                console.error('Error getting selectedServices:', err);
            }
            
            if (selectedServices && Object.keys(selectedServices).length > 0) {
                try {
                    // Load service-specific questions
                    debugLog(`Loading service questions from path`, `../../assessments/${assessmentType}/service-questions.json`);
                    
                    const serviceModule = await import(`../../assessments/${assessmentType}/service-questions.json`);
                    const serviceData = serviceModule.default || serviceModule;
                    
                    // Check if the service data has the proper structure
                    if (serviceData) {
                        debugLog('Service questions data structure', Object.keys(serviceData));
                        
                        // Check if we have the expected nested structure with serviceQuestions
                        const serviceQuestionsData = serviceData.serviceQuestions || {};
                        debugLog('Service questions nested structure', Object.keys(serviceQuestionsData));
                        
                        // Threshold to determine if a service allocation is high enough to include questions
                        // Lower threshold to 5% (0.05) to be more inclusive
                        const ALLOCATION_THRESHOLD = 0.05;
                        
                        // Define mappings from selected service IDs to question categories
                        // This helps match services that may have different naming
                        const serviceIdMappings = {
                            'content_creation': ['content_creation'],
                            'creative_design': ['content_creation'],  // Map creative to content questions
                            'digital_marketing': ['content_creation'], // Map marketing to content
                            'seo_sem': ['content_creation'],          // Map SEO to content 
                            'pr_comms': ['content_creation', 'strategy_consulting'], // PR maps to both
                            'web_development': ['strategy_consulting'], // Web dev to strategy
                            'social_media': ['content_creation'],     // Social to content
                        };
                        
                        debugLog('Service ID mappings available', serviceIdMappings);
                        
                        // Add service questions based on selected services
                        Object.keys(selectedServices).forEach(serviceId => {
                            const allocation = selectedServices[serviceId];
                            
                            if (allocation >= ALLOCATION_THRESHOLD) {
                                debugLog(`Service ${serviceId} allocation ${allocation} exceeds threshold ${ALLOCATION_THRESHOLD}`, '');
                                
                                // Get the mapped question categories for this service ID
                                const mappedCategories = serviceIdMappings[serviceId] || [serviceId];
                                debugLog(`Service ${serviceId} maps to categories`, mappedCategories);
                                
                                // Process each mapped category
                                let foundQuestionsForService = false;
                                
                                mappedCategories.forEach(mappedId => {
                                    // Direct matching in the serviceQuestions object
                                    if (serviceQuestionsData[mappedId]) {
                                        const serviceObj = serviceQuestionsData[mappedId];
                                        if (serviceObj.questions && Array.isArray(serviceObj.questions)) {
                                            debugLog(`Found ${serviceObj.questions.length} questions for service ID ${mappedId}`, serviceObj);
                                            serviceQuestions = [...serviceQuestions, ...serviceObj.questions];
                                            foundQuestionsForService = true;
                                        } else {
                                            debugLog(`Service ${mappedId} exists but has no questions array`, serviceObj);
                                        }
                                    } else {
                                        // Try matching by partial service name in keys
                                        Object.keys(serviceQuestionsData).forEach(key => {
                                            // Check if the key contains or matches the service ID
                                            if (
                                                key.toLowerCase().includes(mappedId.toLowerCase()) || 
                                                mappedId.toLowerCase().includes(key.toLowerCase())
                                            ) {
                                                const serviceObj = serviceQuestionsData[key];
                                                if (serviceObj.questions && Array.isArray(serviceObj.questions)) {
                                                    debugLog(`Found ${serviceObj.questions.length} questions for similar service key ${key} matching ${mappedId}`, '');
                                                    serviceQuestions = [...serviceQuestions, ...serviceObj.questions];
                                                    foundQuestionsForService = true;
                                                }
                                            }
                                        });
                                    }
                                });
                                
                                if (!foundQuestionsForService) {
                                    debugLog(`Could not find any questions for service ${serviceId}`, '');
                                }
                            } else {
                                debugLog(`Service ${serviceId} allocation ${allocation} below threshold ${ALLOCATION_THRESHOLD}`, '');
                            }
                        });
                        
                        // Additional debugging info
                        debugLog('Services in question data', Object.keys(serviceQuestionsData));
                        debugLog('Selected services', Object.keys(selectedServices));
                    } else {
                        debugLog('Service data is empty or invalid', serviceData);
                    }
                } catch (error) {
                    console.error('Error loading service questions:', error);
                }
            } else {
                console.warn('No services selected or invalid selectedServices format:', selectedServices);
            }
            
            debugLog(`Found service-specific questions`, serviceQuestions.length);
            
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
            
            debugLog(`Total unique questions to display`, uniqueQuestions.length);
            debugLog('Question IDs', Array.from(questionIds));
            
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
