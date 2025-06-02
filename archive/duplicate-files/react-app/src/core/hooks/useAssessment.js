import { useState, useEffect, useCallback } from 'react';
import { AssessmentEngine } from '../engine/AssessmentEngine';

export const useAssessment = (assessmentType) => {
    const [engine, setEngine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentStage, setCurrentStage] = useState(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const initializeAssessment = async () => {
            try {
                setLoading(true);
                const assessmentEngine = new AssessmentEngine(assessmentType);
                await assessmentEngine.initialize();
                setEngine(assessmentEngine);
                setCurrentStage(assessmentEngine.flow.getCurrentStage());
                updateProgress(assessmentEngine);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (assessmentType) {
            initializeAssessment();
        }
    }, [assessmentType]);

    const updateProgress = useCallback((assessmentEngine) => {
        const progressData = assessmentEngine.getProgress();
        setProgress(progressData.percentage);
    }, []);

    const nextStage = useCallback(async () => {
        if (!engine) return;
        
        try {
            const nextStage = await engine.nextStage();
            setCurrentStage(nextStage);
            updateProgress(engine);
        } catch (err) {
            setError(err.message);
        }
    }, [engine, updateProgress]);

    const previousStage = useCallback(async () => {
        if (!engine) return;
        
        try {
            const prevStage = await engine.previousStage();
            setCurrentStage(prevStage);
            updateProgress(engine);
        } catch (err) {
            setError(err.message);
        }
    }, [engine, updateProgress]);

    const saveResponse = useCallback((questionId, value) => {
        if (!engine) return;
        engine.saveResponse(questionId, value);
    }, [engine]);

    const getResponse = useCallback((questionId) => {
        if (!engine) return null;
        return engine.getResponse(questionId);
    }, [engine]);

    const setContext = useCallback((key, value) => {
        if (!engine) return;
        engine.setContext(key, value);
    }, [engine]);

    const getContext = useCallback((key) => {
        if (!engine) return null;
        const context = engine.getContext();
        // If key is provided, return the specific value
        return key ? context[key] : context;
    }, [engine]);

    const calculateResults = useCallback(() => {
        if (!engine) return null;
        return engine.calculateResults();
    }, [engine]);

    const reset = useCallback(() => {
        if (!engine) return;
        engine.reset();
        setCurrentStage(engine.flow.getCurrentStage());
        setProgress(0);
    }, [engine]);

    return {
        loading,
        error,
        currentStage,
        progress,
        nextStage,
        previousStage,
        saveResponse,
        getResponse,
        setContext,
        getContext,
        calculateResults,
        reset
    };
};

export default useAssessment;
