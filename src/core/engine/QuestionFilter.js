export class QuestionFilter {
    static filter(questions, selectedServices, qualifyingAnswers) {
        return questions.filter(question => {
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

    static filterByCategory(questions, category) {
        return questions.filter(q => q.category === category);
    }

    static filterByDimension(questions, dimension) {
        return questions.filter(q => q.dimension === dimension);
    }

    static sortByWeight(questions) {
        return [...questions].sort((a, b) => (b.weight || 1) - (a.weight || 1));
    }

    static limitQuestions(questions, limit) {
        return questions.slice(0, limit);
    }

    static getRelevantQuestions(config, context) {
        const { questions, maxQuestions = 20 } = config;
        const { selectedServices, qualifyingAnswers } = context;
        
        let filtered = this.filter(questions, selectedServices, qualifyingAnswers);
        filtered = this.sortByWeight(filtered);
        filtered = this.limitQuestions(filtered, maxQuestions);
        
        return filtered;
    }
}

export default QuestionFilter;
