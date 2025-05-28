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
        
        // Create a dark-themed container instead of the yellow box
        let html = `<div class="${this.containerClass}" style="background-color: #111; padding: 15px; margin-bottom: 20px; color: #fff;">`;
        
        // Create step labels
        html += `<div class="progress-steps" style="display: flex; justify-content: space-between; margin-bottom: 10px;">`;
        
        this.steps.forEach((step, index) => {
            const isActive = index === currentIndex;
            const isCompleted = index < currentIndex;
            
            // Set color based on status
            const color = isActive ? '#ffff66' : isCompleted ? '#aaa' : '#666';
            const fontWeight = isActive ? 'bold' : 'normal';
            
            html += `<div class="progress-step ${isActive ? 'active' : ''}" 
                       style="color: ${color}; font-weight: ${fontWeight}; font-size: 14px;">${step.label || ''}</div>`;
        });
        
        html += `</div>`;
        
        // Create progress track (thin dark line)
        html += `<div class="progress-track" style="height: 4px; background-color: #333; position: relative;">`;
        
        // Create progress fill (yellow fill line)
        html += `<div class="progress-fill" style="height: 100%; width: ${percentComplete}%; background-color: #ffff66;"></div>`;
        
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
