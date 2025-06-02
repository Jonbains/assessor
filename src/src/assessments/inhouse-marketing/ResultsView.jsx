import React from 'react';

const InhouseResultsView = ({ results }) => {
    const { executiveSummary, marketPosition, quickWins, strategicRoadmap, expectedOutcomes, nextSteps } = results;
    
    return (
        <>
            {/* Executive Summary */}
            <div className="report-section executive-summary">
                <h2>Executive Summary</h2>
                <div className="headline-section">
                    <h1>{executiveSummary.headline}</h1>
                    <p className="subheadline">{executiveSummary.marketContext}</p>
                </div>
                
                <div className="narrative">
                    <p><strong>{executiveSummary.criticalInsight}</strong></p>
                    <p>{executiveSummary.bottomLine}</p>
                </div>
            </div>

            {/* Market Position */}
            <div className="report-section market-position">
                <h2>Your Market Position</h2>
                <div className="position-indicator">
                    <h3>{marketPosition.quartile} - {marketPosition.message}</h3>
                    <p>{marketPosition.implication}</p>
                    <p className="competitor-note">{marketPosition.competitorActions}</p>
                    <p className="urgency">{marketPosition.timeToAct}</p>
                </div>
            </div>

            {/* Quick Wins */}
            <div className="report-section quick-wins">
                <h2>Quick Wins to Start This Week</h2>
                {quickWins.map((win, idx) => (
                    <div key={idx} className="recommendation-item">
                        <div className="title">{win.title}</div>
                        <div className="description">
                            <p><strong>Why:</strong> {win.why}</p>
                            <p><strong>How:</strong> {win.how}</p>
                            <p><strong>Action:</strong> {win.specificAction}</p>
                            <p><strong>Result:</strong> {win.expectedResult}</p>
                        </div>
                        <div className="details">
                            <span className="market-context">{win.marketContext}</span>
                            <span className="investment">{win.investment}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Strategic Roadmap */}
            <div className="report-section roadmap">
                <h2>{strategicRoadmap.overview}</h2>
                
                <div className="roadmap-phase">
                    <div className="phase-title">{strategicRoadmap.phase1.name}</div>
                    <p>{strategicRoadmap.phase1.focus}</p>
                    <ul>
                        {strategicRoadmap.phase1.actions.map((action, idx) => (
                            <li key={idx}>{action}</li>
                        ))}
                    </ul>
                    <p className="expected-outcome">{strategicRoadmap.phase1.expectedOutcome}</p>
                </div>
                
                <div className="roadmap-phase">
                    <div className="phase-title">{strategicRoadmap.phase2.name}</div>
                    <p>{strategicRoadmap.phase2.focus}</p>
                    <ul>
                        {strategicRoadmap.phase2.actions.map((action, idx) => (
                            <li key={idx}>{action}</li>
                        ))}
                    </ul>
                    <p className="expected-outcome">{strategicRoadmap.phase2.expectedOutcome}</p>
                </div>
                
                <div className="roadmap-phase">
                    <div className="phase-title">{strategicRoadmap.phase3.name}</div>
                    <p>{strategicRoadmap.phase3.focus}</p>
                    <ul>
                        {strategicRoadmap.phase3.actions.map((action, idx) => (
                            <li key={idx}>{action}</li>
                        ))}
                    </ul>
                    <p className="expected-outcome">{strategicRoadmap.phase3.expectedOutcome}</p>
                </div>
                
                <p className="investment-guide">
                    <strong>Investment Required:</strong> {strategicRoadmap.investmentGuide}
                </p>
            </div>

            {/* Expected Outcomes}
        });
        
        return activityScores;
    }

    calculateActivityAutomation(activityScores) {
        const scores = Object.values(activityScores).map(a => a.score);
        if (scores.length === 0) return 50;
        
        return scores.reduce((sum, score) => sum + score, 0) / scores.length;
    }

    calculateOverallScore(dimensionScores) {
        let weightedSum = 0;
        let totalWeight = 0;
        
        Object.entries(this.weights).forEach(([dimension, weight]) => {
            if (dimensionScores[dimension] !== undefined) {
                weightedSum += dimensionScores[dimension] * weight;
                totalWeight += weight;
            }
        });
        
        return totalWeight > 0 ? weightedSum / totalWeight : 50;
    }
}

export default InhouseMarketingScoring;
