import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ProgressBar';
import styles from '../styles/components.module.css';

const DynamicQuestions = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    const { 
        saveResponse, 
        getResponse, 
        assessmentData,
        updateAssessmentData,
        saveProgress,
        progress: assessmentProgress 
    } = useAssessment();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                setLoading(true);
                // Load questions based on assessment type
                const module = await import(`../../assessments/${type}/questions.json`);
                const data = module.default || module;
                
                // Flatten the coreQuestions object into an array
                const coreQuestions = Object.values(data.coreQuestions || {}).flat();
                
                // If we have selected services, load service-specific questions
                let serviceQuestions = [];
                if (assessmentData?.services?.length > 0) {
                    try {
                        const serviceModule = await import(`../../assessments/${type}/service-questions.json`);
                        const serviceData = serviceModule.default || serviceModule;
                        
                        // Filter questions based on selected services
                        assessmentData.services.forEach(serviceId => {
                            if (serviceData[serviceId]) {
                                serviceQuestions = [...serviceQuestions, ...serviceData[serviceId]];
                            }
                        });
                    } catch (err) {
                        console.error('Error loading service questions:', err);
                    }
                }
                
                // Combine all question types
                const allQuestions = [
                    ...coreQuestions,
                    ...serviceQuestions
                ];
                
                setQuestions(allQuestions);
            } catch (error) {
                console.error('Failed to load questions:', error);
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, [type, assessmentData?.services]);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleAnswer = (value, option) => {
        if (currentQuestion) {
            saveResponse(currentQuestion.id, value);
        }
    };

    const handleNext = async () => {
        if (isLastQuestion) {
            // Save progress before moving to email gate
            await saveProgress('questions');
            navigate(`/assessment/${type}/email`);
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            navigate(`/assessment/${type}/services`);
        }
    };

    const handleSkip = () => {
        handleNext();
    };

    if (loading) {
        return <div>Loading questions...</div>;
    }

    if (!currentQuestion) {
        return <div>No questions available</div>;
    }

    const selectedValue = getResponse(currentQuestion.id);

    return (
        <div className={styles.screen}>
            <div className={styles.header}>
                <div className={styles.logo}>obsolete<span>.</span></div>
                <ProgressBar progress={assessmentProgress || 65} label="Step 5 of 7" />
            </div>
            
            <QuestionCard
                question={currentQuestion}
                questionNumber={currentQuestionIndex + 1}
                totalQuestions={questions.length}
                selectedValue={selectedValue}
                onSelect={handleAnswer}
                insight={currentQuestion.insight}
                benchmark={currentQuestion.benchmark}
            />
            
            <div className={styles.navigation}>
                <button className={styles.navButton} onClick={handlePrevious}>
                    ← Back
                </button>
                <button className={`${styles.navButton} ${styles.skip}`} onClick={handleSkip}>
                    Skip
                </button>
                <button 
                    className={`${styles.navButton} ${styles.primary}`}
                    disabled={!selectedValue}
                    onClick={handleNext}
                >
                    {isLastQuestion ? 'Complete' : 'Continue'}
                </button>
            </div>
        </div>
    );
};

export default DynamicQuestions;