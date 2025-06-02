import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/components.module.css';

const AssessmentSelector = () => {
    const navigate = useNavigate();

    const selectAssessment = (type) => {
        navigate(`/assessment/${type}/sector`);
    };

    return (
        <div className={styles.screen}>
            <div className={styles.header}>
                <div className={styles.logo}>obsolete<span>.</span></div>
            </div>
            
            <h1>Which best describes your organisation?</h1>
            <p>Choose your assessment to discover how AI could transform your business—without the hype or jargon.</p>
            
            <div className={styles.assessmentGrid}>
                <div className={styles.assessmentCard} onClick={() => selectAssessment('agency-vulnerability')}>
                    <div className={styles.cardIcon}>🎯</div>
                    <h2 className={styles.cardTitle}>Agency</h2>
                    <p className={styles.cardDescription}>Creative, digital, PR, or marketing agencies wondering if AI will eat your lunch—or help you serve a better one.</p>
                    <div className={styles.cardMeta}>
                        <span className={styles.time}>⏱ 8 mins</span>
                        <span className={styles.badge}>Most Popular</span>
                    </div>
                </div>
                
                <div className={styles.assessmentCard} onClick={() => selectAssessment('inhouse-marketing')}>
                    <div className={styles.cardIcon}>📈</div>
                    <h2 className={styles.cardTitle}>In-House Marketing</h2>
                    <p className={styles.cardDescription}>Marketing teams trying to do more with less, while their boss asks "have you tried ChatGPT?"</p>
                    <div className={styles.cardMeta}>
                        <span className={styles.time}>⏱ 5 mins</span>
                        <span className={styles.badge}>Quick Wins</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessmentSelector;
