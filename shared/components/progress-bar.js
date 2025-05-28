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
        
        // Create minimal, professional progress bar container
        let html = `<div class="${this.containerClass}" style="padding: 0; margin: 0 0 30px 0;">`;
        
        // Create dots-style progress indicator
        html += `<div class="progress-dots" style="display: flex; justify-content: center; align-items: center; gap: 8px;">`;
        
        // Only show the essential steps - filter out email and similar utility steps
        const displayableSteps = this.steps.filter(step => 
            !['email', 'confirmation'].includes(step.id));
        
        displayableSteps.forEach((step, index) => {
            const isActive = this.steps.indexOf(step) === currentIndex;
            const isCompleted = this.steps.indexOf(step) < currentIndex;
            
            // Set styles based on status
            const backgroundColor = isActive ? '#ffff66' : isCompleted ? '#444' : '#222';
            const size = isActive ? '14px' : '10px';
            const border = isActive ? '2px solid #ffff66' : isCompleted ? '2px solid #444' : '2px solid #222';
            
            // Create dot indicator
            html += `<div class="progress-dot ${isActive ? 'active' : ''}" 
                       style="width: ${size}; height: ${size}; border-radius: 50%; 
                              background-color: ${backgroundColor}; border: ${border};"></div>`;
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
