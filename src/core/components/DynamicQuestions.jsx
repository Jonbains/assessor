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
            
            // Load core questions
            let coreQuestions = [];
            try {
                const coreModule = await import(`../../assessments/${assessmentType}/questions.json`);
                const coreData = coreModule.default || coreModule;
                
                debugLog(`Core questions data structure:`, Object.keys(coreData));
                
                // Check for proper structure - either direct array or nested in coreQuestions property
                if (coreData && Array.isArray(coreData)) {
                    // Direct array structure
                    coreQuestions = coreData;
                    debugLog(`Loaded core questions (direct array):`, coreQuestions.length);
                } else if (coreData && coreData.coreQuestions && Array.isArray(coreData.coreQuestions)) {
                    // Nested structure with coreQuestions property as array
                    coreQuestions = coreData.coreQuestions;
                    debugLog(`Loaded core questions from coreQuestions property:`, coreQuestions.length);
                } else if (coreData && coreData.coreQuestions && typeof coreData.coreQuestions === 'object') {
                    // Handle nested structure with coreQuestions as object containing category arrays
                    // Combine all question arrays from different categories
                    coreQuestions = [];
                    for (const category in coreData.coreQuestions) {
                        if (Array.isArray(coreData.coreQuestions[category])) {
                            coreQuestions = coreQuestions.concat(coreData.coreQuestions[category]);
                            debugLog(`Added questions from category ${category}:`, coreData.coreQuestions[category].length);
                        }
                    }
                    debugLog(`Combined questions from all categories:`, coreQuestions.length);
                } else if (coreData && typeof coreData === 'object') {
                    // Check for any array property that might contain questions
                    for (const key in coreData) {
                        if (Array.isArray(coreData[key])) {
                            coreQuestions = coreData[key];
                            debugLog(`Loaded core questions from ${key} property:`, coreQuestions.length);
                            break;
                        }
                    }
                }
                
                if (coreQuestions.length === 0) {
                    debugLog(`Could not find questions array in core data structure:`, Object.keys(coreData));
                }
            } catch (error) {
                console.error(`Error loading core questions for ${assessmentType}:`, error);
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
                    // Load service-specific questions - handle different file names based on assessment type
                    let serviceData;
                    
                    try {
                        // First try to load from service-questions.json (agency-vulnerability)
                        debugLog(`Trying to load service questions from`, `../../assessments/${assessmentType}/service-questions.json`);
                        const serviceModule = await import(`../../assessments/${assessmentType}/service-questions.json`);
                        serviceData = serviceModule.default || serviceModule;
                        debugLog('Loaded service questions from service-questions.json', Object.keys(serviceData));
                    } catch (error) {
                        // If that fails, try activity-questions.json (inhouse-marketing)
                        debugLog(`First attempt failed, trying activity-questions.json`, error.message);
                        try {
                            debugLog(`Loading activity questions from`, `../../assessments/${assessmentType}/activity-questions.json`);
                            const activityModule = await import(`../../assessments/${assessmentType}/activity-questions.json`);
                            serviceData = activityModule.default || activityModule;
                            debugLog('Loaded service questions from activity-questions.json', Object.keys(serviceData));
                        } catch (activityError) {
                            debugLog('Failed to load both service-questions.json and activity-questions.json', activityError.message);
                            throw new Error(`Could not load questions for ${assessmentType}: ${activityError.message}`);
                        }
                    }
                    
                    // Check if the service data has the proper structure
                    if (serviceData) {
                        debugLog('Service questions data structure', Object.keys(serviceData));
                        
                        // Check if we have the expected nested structure with serviceQuestions or activityQuestions
                        const serviceQuestionsData = serviceData.serviceQuestions || serviceData.activityQuestions || {};
                        debugLog('Service/activity questions nested structure', Object.keys(serviceQuestionsData));
                        
                        // Threshold to determine if a service allocation is high enough to include questions
                        // Lower threshold to 5% (0.05) to be more inclusive
                        const ALLOCATION_THRESHOLD = 0.05;
                        
                        // Define mappings from selected service IDs to question categories
                        // This helps match services that may have different naming
                        const serviceIdMappings = {
                            // Agency mappings
                            'content_creation': ['content_creation', 'content_marketing'],
                            'creative_design': ['content_creation', 'creative_design'],
                            'digital_marketing': ['content_creation', 'digital_marketing'], 
                            'seo_sem': ['content_creation', 'seo_sem'],
                            'pr_comms': ['content_creation', 'strategy_consulting', 'pr_comms'],
                            'web_development': ['strategy_consulting', 'web_development'],
                            'social_media': ['content_creation', 'social_media'],
                            
                            // Inhouse mappings - direct matches to activity names
                            'content_marketing': ['content_marketing'],
                            'email_marketing': ['email_marketing'],
                            'paid_advertising': ['paid_advertising'],
                            'analytics_data': ['analytics_data'],
                            'marketing_automation': ['marketing_automation']
                        };
                        
                        debugLog('Service ID mappings available', serviceIdMappings);
                        debugLog('Assessment type for question loading', assessmentType);
                        
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
                                        // Handle both structures: service-questions has a nested 'questions' array,
                                        // while activity-questions has direct arrays
                                        if (serviceObj.questions && Array.isArray(serviceObj.questions)) {
                                            // Handle service-questions.json structure
                                            debugLog(`Found ${serviceObj.questions.length} questions for service ID ${mappedId} (nested structure)`, serviceObj);
                                            serviceQuestions = [...serviceQuestions, ...serviceObj.questions];
                                            foundQuestionsForService = true;
                                        } else if (Array.isArray(serviceObj)) {
                                            // Handle activity-questions.json structure where the questions are directly in an array
                                            debugLog(`Found ${serviceObj.length} questions for service ID ${mappedId} (direct array)`, serviceObj);
                                            serviceQuestions = [...serviceQuestions, ...serviceObj];
                                            foundQuestionsForService = true;
                                        } else {
                                            debugLog(`Service ${mappedId} exists but has no questions array or is not an array itself`, serviceObj);
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
                                                // Handle both structures: service-questions has a nested 'questions' array,
                                                // while activity-questions has direct arrays
                                                if (serviceObj.questions && Array.isArray(serviceObj.questions)) {
                                                    // Handle service-questions.json structure
                                                    debugLog(`Found ${serviceObj.questions.length} questions for similar key ${key} matching ${mappedId} (nested structure)`, '');
                                                    serviceQuestions = [...serviceQuestions, ...serviceObj.questions];
                                                    foundQuestionsForService = true;
                                                } else if (Array.isArray(serviceObj)) {
                                                    // Handle activity-questions.json structure
                                                    debugLog(`Found ${serviceObj.length} questions for similar key ${key} matching ${mappedId} (direct array)`, '');
                                                    serviceQuestions = [...serviceQuestions, ...serviceObj];
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
        
        // Log the answer being saved for debugging
        debugLog(`Saving answer for question ${questionId}:`, value);
        
        // Try to retrieve all saved answers
        if (typeof getResponse === 'function') {
            const allAnswers = {};
            questions.forEach(q => {
                const answer = getResponse(q.id);
                if (answer !== undefined) {
                    allAnswers[q.id] = answer;
                }
            });
            debugLog('Current saved answers:', allAnswers);
        }
        
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
            // Collect and log all answers for debugging
            const allAnswers = {};
            questions.forEach(q => {
                const answer = getResponse(q.id);
                if (answer !== undefined) {
                    allAnswers[q.id] = answer;
                }
            });
            debugLog('FINAL ANSWERS being submitted:', allAnswers);
            debugLog('Number of answered questions:', Object.keys(allAnswers).length);
            debugLog('Total questions:', questions.length);
            
            // Before completing, ensure selectedServices is stored in both context and responses
            if (typeof getContext === 'function') {
                const selectedServices = getContext('selectedServices');
                if (selectedServices && typeof saveResponse === 'function') {
                    // Save as a response to ensure it's available in both places
                    saveResponse('selectedServices', selectedServices);
                    debugLog('Saved selectedServices to responses as backup', selectedServices);
                }
            }
            
            // Set a global flag to indicate this component has completed with answers
            if (typeof window !== 'undefined') {
                window.dynamicQuestionsCompleted = true;
                window.dynamicQuestionsAnswerCount = Object.keys(allAnswers).length;
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
