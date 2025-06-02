import React from 'react';
import { useNavigate } from 'react-router-dom';

const AssessmentSelector = () => {
    const navigate = useNavigate();

    const selectAssessment = (type) => {
        navigate(`/assessment/${type}/sector`);
    };

    return (
        <div className="screen active">
            <div className="header">
                <div className="logo">obsolete<span>.</span></div>
            </div>
            
            <h1>Which best describes your organisation?</h1>
            <p>Choose your assessment to discover how AI could transform your business—without the hype or jargon.</p>
            
            <div className="assessment-grid">
                <div className="assessment-card" onClick={() => selectAssessment('agency-vulnerability')}>
                    <div className="card-icon">🎯</div>
                    <h2 className="card-title">Agency</h2>
                    <p className="card-description">Creative, digital, PR, or marketing agencies wondering if AI will eat your lunch—or help you serve a better one.</p>
                    <div className="card-meta">
                        <span className="time">⏱ 8 mins</span>
                        <span className="badge">Most Popular</span>
                    </div>
                </div>
                
                <div className="assessment-card" onClick={() => selectAssessment('inhouse-marketing')}>
                    <div className="card-icon">📈</div>
                    <h2 className="card-title">In-House Marketing</h2>
                    <p className="card-description">Marketing teams trying to do more with less, while their boss asks "have you tried ChatGPT?"</p>
                    <div className="card-meta">
                        <span className="time">⏱ 7 mins</span>
                        <span className="badge">Quick Wins</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AssessmentSelector;
