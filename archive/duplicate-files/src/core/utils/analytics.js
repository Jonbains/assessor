// Analytics utility for tracking user behavior
export const analytics = {
    trackEvent: (category, action, label, value) => {
        // Google Analytics 4 implementation
        if (typeof window.gtag !== 'undefined') {
            window.gtag('event', action, {
                event_category: category,
                event_label: label,
                value: value
            });
        }
        
        // Console logging for development
        if (process.env.NODE_ENV === 'development') {
            console.log('Analytics Event:', { category, action, label, value });
        }
    },
    
    trackAssessmentStart: (assessmentType) => {
        analytics.trackEvent('Assessment', 'start', assessmentType);
    },
    
    trackAssessmentComplete: (assessmentType, score) => {
        analytics.trackEvent('Assessment', 'complete', assessmentType, score);
    },
    
    trackStageComplete: (assessmentType, stage) => {
        analytics.trackEvent('Assessment', 'stage_complete', `${assessmentType}:${stage}`);
    },
    
    trackQuestionAnswer: (questionId, value) => {
        analytics.trackEvent('Assessment', 'question_answered', questionId, value);
    },
    
    trackEmailSubmit: (assessmentType) => {
        analytics.trackEvent('Conversion', 'email_submit', assessmentType);
    },
    
    trackCTAClick: (ctaType, location) => {
        analytics.trackEvent('Conversion', 'cta_click', `${ctaType}:${location}`);
    },
    
    trackError: (errorType, errorMessage) => {
        analytics.trackEvent('Error', errorType, errorMessage);
    }
};

export default analytics;
