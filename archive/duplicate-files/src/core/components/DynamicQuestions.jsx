import React, { useState, useEffect } from 'react';
import { QuestionCard } from './QuestionCard';
import { ProgressBar } from './ProgressBar';

const DynamicQuestions = ({ 
    assessmentType, 
    saveResponse, 
    getResponse, 
    onComplete, 
    onBack,
    progress 
}) => {
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadQuestions = async () => {
            try {
                // Load questions based on assessment type
                // This would be filtered based on selected services/activities
                const response = await fetch(`/assessments/${assessmentType}/questions.json`);
                const data = await response.json();
                
                // Combine all question types
                const allQuestions = [
                    ...(data.coreQuestions || []),
                    // Service questions would be loaded based on selections
                ];
                
                setQuestions(allQuestions);
            } catch (error) {
                console.error('Failed to load questions:', error);
            } finally {
                setLoading(false);
            }
        };

        loadQuestions();
    }, [assessmentType]);

    const currentQuestion = questions[currentQuestionIndex];
    const isLastQuestion = currentQuestionIndex === questions.length - 1;

    const handleAnswer = (value, option) => {
        if (currentQuestion) {
            saveResponse(currentQuestion.id, value);
        }
    };

    const handleNext = () => {
        if (isLastQuestion) {
            onComplete();
        } else {
            setCurrentQuestionIndex(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(prev => prev - 1);
        } else {
            onBack();
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
        <div className="screen active">
            <div className="header">
                <div className="logo">obsolete<span>.</span></div>
                <ProgressBar progress={progress || 60} label="Step 5 of 7" />
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
            
            <div className="navigation">
                <button className="btn btn-secondary" onClick={handlePrevious}>
                    ← Back
                </button>
                <button className="btn btn-skip" onClick={handleSkip}>
                    Skip
                </button>
                <button 
                    className="btn btn-primary"
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