
export class FlowController {
    constructor(config) {
        this.config = config;
        this.stages = [
            'sector',
            'qualifying',
            'services',
            'questions',
            'email',
            'results'
        ];
        this.currentStageIndex = 0;
    }

    start() {
        this.currentStageIndex = 0;
    }

    getCurrentStage() {
        return this.stages[this.currentStageIndex];
    }

    advance() {
        if (this.shouldSkipStage()) {
            this.currentStageIndex++;
            return this.advance();
        }

        if (this.currentStageIndex < this.stages.length - 1) {
            this.currentStageIndex++;
        }

        return this.getCurrentStage();
    }

    goBack() {
        if (this.currentStageIndex > 0) {
            this.currentStageIndex--;
            
            // Skip backwards through skipped stages
            if (this.shouldSkipStage()) {
                return this.goBack();
            }
        }
        return this.getCurrentStage();
    }

    setStage(stageName) {
        const index = this.stages.indexOf(stageName);
        if (index !== -1) {
            this.currentStageIndex = index;
        }
    }

    shouldSkipStage() {
        const currentStage = this.getCurrentStage();
        
        // Add skip logic based on assessment type and previous answers
        // For example, skip sector selection if already specified in URL
        if (currentStage === 'sector' && this.config.skipSector) {
            return true;
        }
        
        return false;
    }

    getRelevantQuestions(dataManager) {
        const selectedServices = dataManager.getContext('selectedServices') || [];
        const qualifyingAnswers = dataManager.getContext('qualifying') || {};
        
        // Filter questions based on selections
        const allQuestions = this.config.questions || [];
        
        return allQuestions.filter(question => {
            // Check service relevance
            if (question.services && question.services.length > 0) {
                const hasRelevantService = question.services.some(service => 
                    selectedServices.includes(service)
                );
                if (!hasRelevantService) return false;
            }
            
            // Check qualifying conditions
            if (question.conditions) {
                const meetsConditions = Object.entries(question.conditions).every(
                    ([key, allowedValues]) => {
                        const actualValue = qualifyingAnswers[key];
                        return allowedValues.includes(actualValue);
                    }
                );
                if (!meetsConditions) return false;
            }
            
            return true;
        });
    }

    getProgress() {
        const totalStages = this.stages.length;
        const completedStages = this.currentStageIndex;
        return {
            current: completedStages + 1,
            total: totalStages,
            percentage: Math.round((completedStages / (totalStages - 1)) * 100),
            stageName: this.getCurrentStage()
        };
    }

    isComplete() {
        return this.currentStageIndex === this.stages.length - 1;
    }

    reset() {
        this.currentStageIndex = 0;
    }
}

export default FlowController;