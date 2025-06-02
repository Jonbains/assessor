// URL parameter and routing utilities
export const routing = {
    getQueryParams: () => {
        const params = new URLSearchParams(window.location.search);
        const result = {};
        
        for (const [key, value] of params) {
            result[key] = value;
        }
        
        return result;
    },
    
    getAssessmentType: () => {
        const params = routing.getQueryParams();
        return params.assessment || null;
    },
    
    getUtmParams: () => {
        const params = routing.getQueryParams();
        const utmParams = {};
        
        ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
            if (params[param]) {
                utmParams[param] = params[param];
            }
        });
        
        return utmParams;
    },
    
    buildAssessmentUrl: (type, stage) => {
        return `/assessment/${type}/${stage}`;
    },
    
    buildResultsUrl: (type, sessionId) => {
        return `/assessment/${type}/results${sessionId ? `?session=${sessionId}` : ''}`;
    },
    
    navigateTo: (url) => {
        if (window.history && window.history.pushState) {
            window.history.pushState(null, '', url);
            window.dispatchEvent(new PopStateEvent('popstate'));
        } else {
            window.location.href = url;
        }
    }
};

export default routing;
