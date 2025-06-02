
import React from 'react';
import styles from '../styles/components.module.css';

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
        <div className={styles.questionCard}>
            <div className={styles.questionNumber}>
                Question {questionNumber} of {totalQuestions}
            </div>
            <h3 className={styles.questionTitle}>{question.question || question.text}</h3>
            
            <div className={styles.questionOptions}>
                {question.options.map((option, index) => (
                    <div 
                        key={index}
                        className={`${styles.optionButton} ${selectedValue === (option.value || index) ? styles.selected : ''}`}
                        onClick={() => onSelect(option.value || index, option)}
                    >
                        <div className={styles.optionCheck}>
                            {selectedValue === (option.value || index) ? '✓' : ''}
                        </div>
                        <div className={styles.optionContent}>
                            <div className={styles.optionText}>
                                {option.label || option.text}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {insight && (
                <p className={styles.questionInsight}>{insight}</p>
            )}
            
            {benchmark && (
                <p className={styles.questionBenchmark}>{benchmark}</p>
            )}
        </div>
    );
};

export default QuestionCard;