import React from 'react';
import styles from '../styles/components.module.css';

export const ProgressBar = ({ progress, label }) => {
    return (
        <>
            <div className={styles.progressBar}>
                <div 
                    className={styles.progressBarFill} 
                    style={{ width: `${progress}%` }}
                />
            </div>
            {label && (
                <div className={styles.progressText}>{label}</div>
            )}
        </>
    );
};

export default ProgressBar;
