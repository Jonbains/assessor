import React from 'react';

export const ProgressBar = ({ progress, label }) => {
    return (
        <>
            <div className="progress-bar">
                <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                />
            </div>
            {label && (
                <div className="progress-text">{label}</div>
            )}
        </>
    );
};

export default ProgressBar;
