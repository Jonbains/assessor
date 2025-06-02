
import React from 'react';

export const QuestionCard = ({ 
    question, 
    questionNumber, 
    totalQuestions, 
    selectedValue, 
    onSelect,
    insight,
    benchmark 
}) => {
    return (
        <div className="question-card">
            <div className="question-number">
                Question {questionNumber} of {totalQuestions}
            </div>
            <h3 className="question-title">{question.question || question.text}</h3>
            
            <div className="question-options">
                {question.options.map((option, index) => (
                    <div 
                        key={index}
                        className={`option ${selectedValue === (option.value || index) ? 'selected' : ''}`}
                        onClick={() => onSelect(option.value || index, option)}
                    >
                        <div className="option-check">
                            {selectedValue === (option.value || index) ? '✓' : ''}
                        </div>
                        <div className="option-content">
                            <div className="option-text">
                                {option.label || option.text}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {insight && (
                <p className="question-insight">{insight}</p>
            )}
            
            {benchmark && (
                <p className="question-benchmark">{benchmark}</p>
            )}
        </div>
    );
};

export default QuestionCard;