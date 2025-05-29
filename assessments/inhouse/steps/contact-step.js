/**
 * In-House Marketing Assessment - Contact Step
 * 
 * Collects user contact information before showing results
 * Extends the EmailStep from the agency assessment with in-house specific customizations
 */

// EmailStep will be accessed as a browser global

class ContactStep extends EmailStep {
    constructor(assessment) {
        super(assessment);
    }
    
    /**
     * Actions to perform when entering this step
     */
    onEnter() {
        // If we don't have results yet, calculate them
        if (!this.assessment.state.results) {
            const results = this.assessment.calculateResults();
            this.assessment.state.results = results;
        }
        
        // Call parent onEnter if it exists
        if (super.onEnter) {
            super.onEnter();
        }
    }
    
    /**
     * Override render to add in-house specific messaging
     * @return {String} - HTML content for the step
     */
    render() {
        // Get base HTML from parent EmailStep
        const baseHtml = super.render();
        
        // Add in-house specific messaging
        return baseHtml.replace(
            '<h2>Get Your Assessment Results</h2>',
            '<h2>Get Your Personalized AI Readiness Report</h2>\n<p>Receive detailed recommendations tailored to your industry and marketing activities.</p>'
        );
    }
    
    /**
     * Override parent's onNext to ensure results are calculated before advancing
     * @return {Boolean} - True if navigation should proceed
     */
    onNext() {
        // Calculate assessment results before proceeding to results step
        if (!this.assessment.state.results) {
            console.log('[ContactStep] Calculating assessment results');
            this.assessment.state.results = this.assessment.calculateResults();
        }
        
        // Call parent onNext
        return super.onNext();
    }
    
    /**
     * Render a preview of the assessment results
     * This will be included via innerHTML in the parent EmailStep template
     */
    renderResultsPreview() {
        // Show a teaser of the results to encourage form completion
        const results = this.assessment.state.results;
        
        if (!results) {
            return `<p>Complete the form to generate your assessment results.</p>`;
        }
        
        const overallScore = results.scores?.overall || 0;
        const selectedIndustry = this.assessment.state.selectedIndustry;
        const industry = this.assessment.config.industries.find(i => i.id === selectedIndustry);
        const industryAvg = industry?.avgReadiness || 60;
        
        return `
            <div class="results-preview">
                <div class="score-preview">
                    <div class="score-circle">
                        <span class="score-value">${Math.round(overallScore)}</span>
                        <span class="score-label">Your Score</span>
                    </div>
                    <div class="industry-comparison">
                        <span class="industry-score">${industryAvg}</span>
                        <span class="industry-label">Industry Avg</span>
                    </div>
                </div>
                <p class="preview-message">Complete the form to see your full results including strengths, areas for improvement, and personalized recommendations.</p>
            </div>
        `;
    }
}

// Make the class available as a browser global
window.ContactStep = ContactStep;
