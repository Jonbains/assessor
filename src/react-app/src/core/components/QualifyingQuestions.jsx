import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import Navigation from './Navigation';
import ProgressBar from './ProgressBar';
import styles from '../styles/components.module.css';

const QualifyingQuestions = () => {
  const navigate = useNavigate();
  const { type } = useParams();
  const { 
    assessmentData, 
    updateAssessmentData, 
    saveProgress,
    getAssessmentConfig 
  } = useAssessment();
  
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadQuestions();
  }, [type]);

  const loadQuestions = async () => {
    try {
      setIsLoading(true);
      // Load qualifying questions for this assessment type
      const config = await getAssessmentConfig(type);
      const qualifyingData = await import(`../../assessments/${type}/qualifying.json`);
      
      setQuestions(qualifyingData.questions || []);
      
      // Load any previously saved answers
      if (assessmentData.qualifying) {
        setAnswers(assessmentData.qualifying);
      }
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error loading qualifying questions:', err);
      setError('Failed to load questions. Please try again.');
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    // Auto-advance to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }, 300);
  };

  const handleNext = async () => {
    // Validate all required questions are answered
    const requiredQuestions = questions.filter(q => q.required !== false);
    const missingRequired = requiredQuestions.some(q => !answers[q.id]);
    
    if (missingRequired) {
      alert('Please answer all required questions');
      return;
    }
    
    // Save answers to assessment data
    await updateAssessmentData({
      qualifying: answers,
      companySize: answers.agency_size || answers.company_size,
      revenue: answers.annual_revenue,
      budget: answers.budget,
      aiExperience: answers.ai_experience
    });
    
    await saveProgress('qualifying');
    
    // Navigate to next stage
    navigate(`/assessment/${type}/services`);
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      navigate(`/assessment/${type}/sector`);
    }
  };

  const calculateProgress = () => {
    const answeredCount = Object.keys(answers).length;
    const totalRequired = questions.filter(q => q.required !== false).length;
    return (answeredCount / totalRequired) * 100;
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner} />
        <p>Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={loadQuestions}>Try Again</button>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const progress = calculateProgress();

  return (
    <div className={styles.qualifyingContainer}>
      <ProgressBar progress={progress} stage="qualifying" />
      
      <div className={styles.questionContainer}>
        <div className={styles.questionHeader}>
          <h2>Tell us about your organization</h2>
          <p className={styles.questionNumber}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </p>
        </div>

        {currentQuestion && (
          <div className={styles.questionContent}>
            <h3 className={styles.questionText}>
              {currentQuestion.question}
              {currentQuestion.required !== false && <span className={styles.required}>*</span>}
            </h3>
            
            {currentQuestion.type === 'single-select' && (
              <div className={styles.optionsGrid}>
                {currentQuestion.options.map((option) => (
                  <button
                    key={option.value}
                    className={`${styles.optionButton} ${
                      answers[currentQuestion.id] === option.value ? styles.selected : ''
                    }`}
                    onClick={() => handleAnswer(currentQuestion.id, option.value)}
                  >
                    <span className={styles.optionLabel}>{option.label}</span>
                  </button>
                ))}
              </div>
            )}
            
            {currentQuestion.type === 'multi-select' && (
              <div className={styles.optionsGrid}>
                {currentQuestion.options.map((option) => {
                  const currentAnswers = answers[currentQuestion.id] || [];
                  const isSelected = currentAnswers.includes(option.value);
                  
                  return (
                    <button
                      key={option.value}
                      className={`${styles.optionButton} ${isSelected ? styles.selected : ''}`}
                      onClick={() => {
                        const newAnswers = isSelected
                          ? currentAnswers.filter(v => v !== option.value)
                          : [...currentAnswers, option.value];
                        handleAnswer(currentQuestion.id, newAnswers);
                      }}
                    >
                      <span className={styles.optionLabel}>{option.label}</span>
                    </button>
                  );
                })}
              </div>
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
              } ${answers[questions[index].id] ? styles.answered : ''}`}
              onClick={() => setCurrentQuestionIndex(index)}
              aria-label={`Go to question ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <Navigation
        onBack={handleBack}
        onNext={isLastQuestion ? handleNext : null}
        onSkip={currentQuestion?.required === false ? () => {
          if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
          } else {
            handleNext();
          }
        } : null}
        nextLabel={isLastQuestion ? "Continue" : null}
        showNext={isLastQuestion && Object.keys(answers).length > 0}
      />
    </div>
  );
};

export default QualifyingQuestions;