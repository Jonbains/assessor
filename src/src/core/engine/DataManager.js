
export class DataManager {
    constructor() {
        this.responses = {};
        this.context = {};
        this.metadata = {
            startTime: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
    }

    saveResponse(questionId, value) {
        this.responses[questionId] = value;
        this.metadata.lastUpdated = new Date().toISOString();
    }

    getResponse(questionId) {
        return this.responses[questionId];
    }

    getResponses() {
        return { ...this.responses };
    }

    setResponses(responses) {
        this.responses = { ...responses };
    }

    setContext(key, value) {
        this.context[key] = value;
    }

    getContext(key) {
        if (key) {
            return this.context[key];
        }
        return { ...this.context };
    }

    addToContext(updates) {
        this.context = { ...this.context, ...updates };
    }

    getMetadata() {
        return { ...this.metadata };
    }

    calculateCompletionTime() {
        const start = new Date(this.metadata.startTime);
        const end = new Date();
        const diffMs = end - start;
        const diffMins = Math.round(diffMs / 60000);
        return diffMins;
    }

    reset() {
        this.responses = {};
        this.context = {};
        this.metadata = {
            startTime: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };
    }

    export() {
        return {
            responses: this.getResponses(),
            context: this.getContext(),
            metadata: this.getMetadata()
        };
    }

    import(data) {
        if (data.responses) this.responses = data.responses;
        if (data.context) this.context = data.context;
        if (data.metadata) this.metadata = data.metadata;
    }
}

export default DataManager;