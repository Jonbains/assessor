import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/components.module.css';

export const Navigation = ({ onNext, onBack, canProgress = true, nextLabel = 'Continue', backLabel = 'Back', showSkip = false, onSkip }) => {
    const navigate = useNavigate();

    return (
        <div className={styles.navigation}>
            <button 
                className={styles.navButton} 
                onClick={onBack}
            >
                ← {backLabel}
            </button>
            
            {showSkip && (
                <button 
                    className={`${styles.navButton} ${styles.skip}`}
                    onClick={onSkip}
                >
                    Skip
                </button>
            )}
            
            <button 
                className={`${styles.navButton} ${styles.primary}`}
                disabled={!canProgress}
                onClick={onNext}
            >
                {nextLabel}
            </button>
        </div>
    );
};

export default Navigation;
