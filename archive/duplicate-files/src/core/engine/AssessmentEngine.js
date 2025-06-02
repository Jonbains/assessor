
export class AssessmentEngine {
    constructor(assessmentType) {
        this.assessmentType = assessmentType;
        this.config = null;
        this.flow = null;
        this.data = null;
        this.scoring = null;
    }

    async initialize() {
        // Load assessment module configuration
        this.config = await this.loadAssessmentModule(this.assessmentType);
        
        // Initialize sub-components
        const { FlowController } = await import('./FlowController.js');
        const { DataManager } = await import('./DataManager.js');
        const { ScoringEngine } = await import('./ScoringEngine.js');
        
        this.flow = new FlowController(this.config);
        this.data = new DataManager();
        this.scoring = new ScoringEngine(this.config.scoring);
        
        // Start the flow
        this.flow.start();
    }

    async loadAssessmentModule(type) {
        // Dynamically load assessment configuration
        const configPath = `/assessments/${type}/config.json`;
        const response = await fetch(configPath);
        return await response.json();
    }

    async nextStage() {
        const currentStage = this.flow.getCurrentStage();
        await this.saveProgress();
        return this.flow.advance();
    }

    async previousStage() {
        return this.flow.goBack();
    }

    async saveProgress() {
        const progress = {
            assessmentType: this.assessmentType,
            currentStage: this.flow.getCurrentStage(),
            responses: this.data.getResponses(),
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage for now, Firebase later
        localStorage.setItem('assessment_progress', JSON.stringify(progress));
    }

    async loadProgress() {
        const saved = localStorage.getItem('assessment_progress');
        if (saved) {
            const progress = JSON.parse(saved);
            this.data.setResponses(progress.responses);
            this.flow.setStage(progress.currentStage);
            return progress;
        }
        return null;
    }

    calculateResults() {
        const responses = this.data.getResponses();
        const context = this.data.getContext();
        return this.scoring.calculate(responses, context);
    }

    getRelevantQuestions() {
        return this.flow.getRelevantQuestions(this.data);
    }

    saveResponse(questionId, value) {
        this.data.saveResponse(questionId, value);
    }

    getResponse(questionId) {
        return this.data.getResponse(questionId);
    }

    getAllResponses() {
        return this.data.getResponses();
    }

    getContext() {
        return this.data.getContext();
    }

    setContext(key, value) {
        this.data.setContext(key, value);
    }

    getProgress() {
        return this.flow.getProgress();
    }

    isComplete() {
        return this.flow.isComplete();
    }

    reset() {
        this.data.reset();
        this.flow.reset();
        localStorage.removeItem('assessment_progress');
    }
}

export default AssessmentEngine;