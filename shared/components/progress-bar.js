/**
 * Assessment Framework - Progress Bar Component
 * 
 * Renders a progress bar for multi-step assessments
 */

export class ProgressBar {
    /**
     * Constructor for the progress bar component
     * @param {Object} options - Configuration options
     * @param {Array} options.steps - Array of step objects with id and label properties
     * @param {String} options.currentStepId - ID of the current step
     * @param {String} options.containerClass - CSS class for the container (optional)
     */
    constructor(options) {
        this.steps = options.steps || [];
        this.currentStepId = options.currentStepId || '';
        this.containerClass = options.containerClass || 'assessment-progress-bar';
    }
    
    /**
     * Get the index of the current step
     * @return {Number} - Zero-based index of current step
     */
    getCurrentStepIndex() {
        for (let i = 0; i < this.steps.length; i++) {
            if (this.steps[i].id === this.currentStepId) {
                return i;
            }
        }
        return 0;
    }
    
    /**
     * Calculate the percentage complete
     * @return {Number} - Percentage from 0 to 100
     */
    getPercentComplete() {
        if (this.steps.length <= 1) return 100;
        
        const currentIndex = this.getCurrentStepIndex();
        return Math.round((currentIndex / (this.steps.length - 1)) * 100);
    }
    
    /**
     * Render the progress bar HTML
     * @return {String} - HTML for the progress bar
     */
    render() {
        const percentComplete = this.getPercentComplete();
        const currentIndex = this.getCurrentStepIndex();
        
        let html = `<div class="${this.containerClass}">`;
        html += `<div class="progress-track">`;
        html += `<div class="progress-fill" style="width: ${percentComplete}%"></div>`;
        
        // Add step indicators
        this.steps.forEach((step, index) => {
            const stepClass = index < currentIndex ? 'completed' : 
                             index === currentIndex ? 'active' : '';
            
            html += `<div class="step-indicator ${stepClass}" style="left: ${index * (100 / (this.steps.length - 1))}%">
                        <div class="indicator-circle"></div>
                        <div class="indicator-label">${step.label || ''}</div>
                    </div>`;
        });
        
        html += `</div>`;
        html += `</div>`;
        
        return html;
    }
    
    /**
     * Update the progress bar to a new current step
     * @param {String} stepId - The ID of the new current step
     * @param {Element} container - The container element to update (optional)
     */
    updateCurrentStep(stepId, container) {
        this.currentStepId = stepId;
        
        // If a container is provided, update the DOM
        if (container) {
            container.innerHTML = this.render();
        }
    }
}
