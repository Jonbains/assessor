import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import QuestionCard from './QuestionCard';
import Navigation from './Navigation';
import styles from '../styles/components.module.css';

const DEBUG_MODE = process.env.NODE_ENV === 'development';

const DynamicQuestions = ({
    assessmentType,
    saveResponse,
    getResponse,
    getContext,
    onComplete,
    onBack,
    progress = 50
}) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [allAnswers, setAllAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Helper function for debugging - only logs in development mode
    const debugLog = (...args) => {
        if (DEBUG_MODE) {
            console.log(...args);
        }
    };

    // Load questions from appropriate JSON files based on assessment type
    const loadQuestions = async () => {
        try {
            setLoading(true);
            console.log(`🔍 [${assessmentType}] LOADING QUESTIONS - DEBUGGING ISSUE`);
            
            // Load core questions
            let coreQuestions = [];
            let categoryQuestionCounts = {};
            
            // Enhanced function to recursively extract questions from any nested structure
            const extractQuestionsFromNestedObject = (obj, path = '') => {
                let extractedQuestions = [];
                
                // Base case: If it's an array, verify each item looks like a question (has id and options)
                if (Array.isArray(obj)) {
                    const validQuestions = obj.filter(item => {
                        return item && typeof item === 'object' && item.id && 
                               item.options && Array.isArray(item.options) && item.options.length > 0;
                    });
                    
                    if (validQuestions.length > 0) {
                        console.log(`🔢 Found ${validQuestions.length} valid questions at path: ${path}`);
                        // Count questions per category for debugging
                        if (path) {
                            categoryQuestionCounts[path] = validQuestions.length;
                        }
                        return validQuestions;
                    }
                    return [];
                }
                
                // If it's an object, traverse its properties
                if (obj && typeof obj === 'object') {
                    // First check if this object itself is a question
                    if (obj.id && obj.options && Array.isArray(obj.options) && obj.options.length > 0) {
                        console.log(`🔢 Found individual question with ID: ${obj.id}`);
                        return [obj];
                    }
                    
                    // Otherwise check all properties
                    for (const key in obj) {
                        const newPath = path ? `${path}.${key}` : key;
                        
                        if (Array.isArray(obj[key])) {
                            // Check if this array contains question objects
                            const questions = obj[key].filter(item => {
                                return item && typeof item === 'object' && item.id && 
                                      item.options && Array.isArray(item.options) && item.options.length > 0;
                            });
                            
                            if (questions.length > 0) {
                                console.log(`🔢 Found ${questions.length} valid questions in ${newPath}`);
                                categoryQuestionCounts[newPath] = questions.length;
                                extractedQuestions = extractedQuestions.concat(questions);
                            }
                        } else if (obj[key] && typeof obj[key] === 'object') {
                            // Found a nested object, recursively extract questions from it
                            const nestedQuestions = extractQuestionsFromNestedObject(obj[key], newPath);
                            if (nestedQuestions.length > 0) {
                                console.log(`➕ Adding ${nestedQuestions.length} questions from ${newPath}`);
                                extractedQuestions = extractedQuestions.concat(nestedQuestions);
                            }
                        }
                    }
                }
                
                return extractedQuestions;
            };
            
            // LOAD CORE QUESTIONS
            try {
                const coreModule = await import(`../../assessments/${assessmentType}/questions.json`);
                const coreData = coreModule.default || coreModule;
                
                console.log(`📁 [${assessmentType}] Core questions data structure:`, Object.keys(coreData));
                
                // Handle different possible structures - with extra debugging
                console.log(`🔍 EXTRACTING ALL QUESTIONS - Detailed debugging`);
                
                // First dump the full structure to debug
                console.log(`📊 Top-level structure keys:`, Object.keys(coreData));
                
                // Always attempt full recursive extraction to get ALL questions
                let allExtractedQuestions = extractQuestionsFromNestedObject(coreData, 'root');
                console.log(`📊 Full recursive extraction found ${allExtractedQuestions.length} questions`);
                
                // Fallback to individual structure handling if recursive extraction fails
                if (allExtractedQuestions.length < 5) { // Likely something went wrong
                    console.log(`⚠️ Few questions found in recursive search, trying specific structures...`);
                    
                    if (Array.isArray(coreData)) {
                        // Direct array structure
                        coreQuestions = coreData;
                        console.log(`📊 Loaded ${coreQuestions.length} core questions (direct array)`);
                    } else if (coreData.coreQuestions) {
                        // Structure with coreQuestions property
                        if (Array.isArray(coreData.coreQuestions)) {
                            // coreQuestions is a direct array
                            coreQuestions = coreData.coreQuestions;
                            console.log(`📊 Loaded ${coreQuestions.length} core questions from coreQuestions array`);
                        } else {
                            // coreQuestions is an object with nested question arrays
                            console.log(`🔍 Examining nested coreQuestions object with categories:`, Object.keys(coreData.coreQuestions));
                            
                            // Direct category processing (no recursion, just get all question arrays)
                            let categoryQuestions = [];
                            for (const category in coreData.coreQuestions) {
                                if (Array.isArray(coreData.coreQuestions[category])) {
                                    console.log(`📊 Category ${category} has ${coreData.coreQuestions[category].length} direct questions`);
                                    categoryQuestions = [...categoryQuestions, ...coreData.coreQuestions[category]];
                                } else if (typeof coreData.coreQuestions[category] === 'object') {
                                    console.log(`🔍 Category ${category} has subcategories:`, Object.keys(coreData.coreQuestions[category]));
                                    
                                    // Process subcategories
                                    for (const subCategory in coreData.coreQuestions[category]) {
                                        if (Array.isArray(coreData.coreQuestions[category][subCategory])) {
                                            console.log(`📊 SubCategory ${category}.${subCategory} has ${coreData.coreQuestions[category][subCategory].length} direct questions`);
                                            categoryQuestions = [...categoryQuestions, ...coreData.coreQuestions[category][subCategory]];
                                        }
                                    }
                                }
                            }
                            
                            if (categoryQuestions.length > allExtractedQuestions.length) {
                                coreQuestions = categoryQuestions;
                                console.log(`📊 Using direct category processing: ${coreQuestions.length} questions`);
                            } else {
                                coreQuestions = allExtractedQuestions;
                                console.log(`📊 Using recursive extraction: ${coreQuestions.length} questions`);
                            }
                        }
                    } else {
                        // No recognizable structure, keep the recursively extracted questions
                        coreQuestions = allExtractedQuestions;
                        console.log(`📊 Using recursively extracted questions: ${coreQuestions.length}`);
                    }
                } else {
                    // Recursive extraction worked well, use its results
                    coreQuestions = allExtractedQuestions;
                    console.log(`📊 Using recursive extraction results: ${coreQuestions.length} questions`);
                }
                
                // Verify by listing all question IDs
                const coreQuestionIds = coreQuestions.map(q => q.id);
                console.log(`🆔 Core question IDs (first 10):`, coreQuestionIds.slice(0, 10));
                
                if (coreQuestions.length === 0) {
                    console.error(`❌ Could not find questions array in core data structure:`, Object.keys(coreData));
                }
            } catch (error) {
                console.error(`❌ Error loading core questions for ${assessmentType}:`, error);
            }
            
            console.log(`📊 Loaded ${coreQuestions.length} core questions`);
            
            // LOAD SERVICE QUESTIONS
            let serviceQuestions = [];
            const selectedServices = getContext('selectedServices');
            console.log('🏛 Selected services', selectedServices);
            
            try {
                // First try to load from service-questions.json
                let serviceModule;
                try {
                    serviceModule = await import(`../../assessments/${assessmentType}/service-questions.json`);
                    console.log(`✅ Loaded service-questions.json for ${assessmentType}`);
                } catch (error) {
                    console.log(`❌ No service-questions.json found for ${assessmentType}, trying activity-questions.json`);
                    // Fallback to activity-questions.json if service-questions.json doesn't exist
                    try {
                        serviceModule = await import(`../../assessments/${assessmentType}/activity-questions.json`);
                        console.log(`✅ Loaded activity-questions.json as fallback`);
                    } catch (fallbackError) {
                        console.error(`❌ Could not load any service questions:`, fallbackError);
                        serviceModule = { default: { serviceQuestions: {} } };
                    }
                }
                
                const serviceData = serviceModule.default || serviceModule;
                const serviceQuestionsData = serviceData.serviceQuestions || {};
                console.log('📁 Service questions data structure', Object.keys(serviceData));
                
                // Handle service ID mappings (for matching with different naming conventions)
                const serviceIdMappings = {
                    'social': ['social', 'social-media', 'socialMedia'],
                    'paid-search': ['paid-search', 'paidSearch', 'sem', 'ppc'],
                    'content': ['content', 'content-marketing', 'contentMarketing'],
                    'seo': ['seo', 'search-engine-optimization'],
                    'content_creation': ['content', 'content-creation', 'contentCreation'],
                    'creative_design': ['creative', 'design', 'creative-design'],
                    'digital_marketing': ['digital', 'digital-marketing', 'digitalMarketing'],
                    'seo_sem': ['seo', 'sem', 'search', 'seo-sem'],
                    'pr_comms': ['pr', 'communications', 'pr-comms'],
                    'strategy_consulting': ['strategy', 'consulting', 'strategy-consulting'],
                    'email': ['email', 'email-marketing', 'emailMarketing'],
                    'web': ['web', 'website', 'web-development'],
                    'data': ['data', 'analytics', 'data-analytics'],
                    'crm': ['crm', 'customer-relationship-management'],
                    'automation': ['automation', 'marketing-automation'],
                    'strategy': ['strategy', 'marketing-strategy']
                };
                
                // IMPORTANT: Load ALL service questions regardless of allocation or selection
                // Just iterate through all available service questions and include them all
                console.log('🔎 LOADING ALL SERVICE QUESTIONS (no allocation threshold)');
                
                // First get a direct list of all services in the JSON
                const allServiceCategories = Object.keys(serviceQuestionsData);
                console.log('📋 Available service categories:', allServiceCategories);
                
                // Process ALL service categories - no filtering by allocation
                allServiceCategories.forEach(serviceKey => {
                    const serviceObj = serviceQuestionsData[serviceKey];
                    console.log(`⚙️ Processing service category: ${serviceKey}`);
                    
                    // Handle both structures: nested 'questions' array or direct array
                    if (serviceObj.questions && Array.isArray(serviceObj.questions)) {
                        serviceQuestions = [...serviceQuestions, ...serviceObj.questions];
                        console.log(`✅ Added ${serviceObj.questions.length} questions from service: ${serviceKey}`);
                    } else if (Array.isArray(serviceObj)) {
                        serviceQuestions = [...serviceQuestions, ...serviceObj];
                        console.log(`✅ Added ${serviceObj.length} questions from service: ${serviceKey}`);
                    }
                });
                
                // Log if no service questions found at all
                if (serviceQuestions.length === 0) {
                    console.warn('⚠️ No service questions found in any category');
                }
                
                console.log('🔑 Processing service questions complete');
                
                // Log all service questions we found
                console.log(`📊 Found ${serviceQuestions.length} total service-specific questions`);
                
                // Verify by listing all service question IDs for debugging
                if (serviceQuestions.length > 0) {
                    const serviceQuestionIds = serviceQuestions.map(q => q.id);
                    console.log(`🆔 Service question IDs:`, serviceQuestionIds);
                }
            } catch (error) {
                console.error('❌ Error loading service questions:', error);
            }
            
            console.log(`📊 Found ${serviceQuestions.length} service-specific questions`);
            
            // REMOVE DUPLICATES AND VALIDATE QUESTIONS
            const uniqueQuestions = [];
            const questionIds = new Set();
            
            // Process core questions first
            coreQuestions.forEach(q => {
                if (q && q.id && !questionIds.has(q.id)) {
                    // Ensure question has all required properties
                    if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
                        console.log(`⚠️ Skipping invalid question without options:`, q.id);
                        return;
                    }
                    
                    questionIds.add(q.id);
                    uniqueQuestions.push(q);
                }
            });
            
            // Then add service questions, avoiding duplicates
            serviceQuestions.forEach(q => {
                if (q && q.id && !questionIds.has(q.id)) {
                    // Ensure question has all required properties
                    if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
                        console.log(`⚠️ Skipping invalid service question without options:`, q.id);
                        return;
                    }
                    
                    questionIds.add(q.id);
                    uniqueQuestions.push(q);
                }
            });
            
            console.log(`📊 FINAL COUNT: Total unique questions to display: ${uniqueQuestions.length}`);
            console.log('🆔 Question IDs:', Array.from(questionIds));
            
            // Double-check for any issues with question structure
            uniqueQuestions.forEach((q, index) => {
                if (!q.id) console.log(`⚠️ Question at index ${index} has no ID!`, q);
                if (!q.options || !Array.isArray(q.options) || q.options.length === 0) {
                    console.log(`⚠️ Question ${q.id} has invalid options!`, q.options);
                }
            });
            
            // Force log each category's question count again to make it clear
            console.log('📊 FINAL CATEGORY QUESTION COUNTS:', categoryQuestionCounts);
            console.log(`🔍 TOTAL CORE QUESTIONS: ${coreQuestions.length}`);
            console.log(`🔍 TOTAL SERVICE QUESTIONS: ${serviceQuestions.length}`);
            console.log(`🔍 TOTAL AFTER DEDUPLICATION: ${uniqueQuestions.length}`);
            
            if (uniqueQuestions.length < 50) {
                console.log('⚠️ WARNING: Expected more than 50 questions but only found', uniqueQuestions.length);
            }
            
            setQuestions(uniqueQuestions);
        } catch (error) {
            console.error('❌ Failed to load questions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Load initial questions and answers
    useEffect(() => {
        const loadInitialData = async () => {
            // Get previously saved answers if available
            const savedAnswers = getResponse('answers') || {};
            debugLog('Loaded saved answers', savedAnswers);
            setAllAnswers(savedAnswers);
            
            // Load questions from JSON file
            await loadQuestions();
        };
        
        loadInitialData();
    }, [assessmentType, getResponse]);

    // Handle answer changes and auto-advance to next question
    const handleAnswerChange = (questionId, answer, optionObj = null) => {
        console.log(`Saving answer for question ${questionId}:`, answer, optionObj);
        const updatedAnswers = {
            ...allAnswers,
            [questionId]: answer
        };
        
        setAllAnswers(updatedAnswers);
        saveResponse('answers', updatedAnswers);
        debugLog(`Answer updated for question ${questionId}:`, answer);
        
        // Auto-advance to next question after a short delay
        setTimeout(() => {
            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                window.scrollTo(0, 0);
            } else if (onComplete) {
                // If this was the last question, complete the assessment
                saveResponse('answers', updatedAnswers);
                onComplete();
            }
        }, 500); // Half-second delay for user to see their selection before advancing
    };

    // Navigation functions
    const handleNext = () => {
        if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            window.scrollTo(0, 0);
        } else {
            // Save final answers and complete
            saveResponse('answers', allAnswers);
            
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
        }
    };

    const handleBack = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion(currentQuestion - 1);
            window.scrollTo(0, 0);
        } else {
            // Go back to previous component
            if (onBack) {
                onBack();
            }
        }
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <h3 className={styles.loadingText}>
                    Loading questions...
                </h3>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className={styles.errorContainer}>
                <h3 className={styles.errorHeading}>
                    Error: No questions found for this assessment
                </h3>
                <button 
                    onClick={onBack} 
                    className={styles.errorButton}
                >
                    Go Back
                </button>
            </div>
        );
    }

    const currentQuestionData = questions[currentQuestion];
    
    return (
        <div className={styles.questionsContainer}>
            <div className={styles.questionHeader}>
                <h2 className={styles.assessmentTitle}>
                    {assessmentType === 'agency-vulnerability' 
                        ? 'Agency AI Vulnerability Assessment' 
                        : 'Marketing Assessment'}
                </h2>
                <p className={styles.questionCounter}>
                    Question {currentQuestion + 1} of {questions.length}
                </p>
            </div>
            
            {currentQuestionData && (
                <QuestionCard
                    question={currentQuestionData}
                    questionNumber={currentQuestion + 1}
                    totalQuestions={questions.length}
                    selectedValue={allAnswers[currentQuestionData.id] || ''}
                    onSelect={(value, option) => {
                        // Explicitly console log to verify parameters
                        console.log('Option selected:', value, option);
                        handleAnswerChange(currentQuestionData.id, value, option);
                    }}
                    key={currentQuestionData.id} // Add key to force re-render when question changes
                />
            )}
            
            <Navigation 
                currentStep={currentQuestion + 1}
                totalSteps={questions.length}
                onNext={handleNext}
                onBack={handleBack}
                nextDisabled={!allAnswers[currentQuestionData?.id]}
                progress={progress}
            />
        </div>
    );
};

export default DynamicQuestions;
