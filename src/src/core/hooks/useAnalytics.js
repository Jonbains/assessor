import { useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { analytics } from '../utils/firebase';
import { logEvent } from 'firebase/analytics';

const useAnalytics = () => {
  const location = useLocation();

  // Track page views
  useEffect(() => {
    // Firebase Analytics page view
    if (analytics) {
      logEvent(analytics, 'page_view', {
        page_path: location.pathname,
        page_location: window.location.href,
        page_title: document.title
      });
    }

    // Google Analytics 4 page view (if implemented)
    if (window.gtag) {
      window.gtag('event', 'page_view', {
        page_path: location.pathname,
        page_location: window.location.href,
        page_title: document.title
      });
    }

    // Google Tag Manager dataLayer push (if implemented)
    if (window.dataLayer) {
      window.dataLayer.push({
        event: 'pageview',
        page: {
          path: location.pathname,
          title: document.title,
          url: window.location.href
        }
      });
    }
  }, [location]);

  // Track custom events
  const trackEvent = useCallback((eventName, parameters = {}) => {
    try {
      // Firebase Analytics
      if (analytics) {
        logEvent(analytics, eventName, parameters);
      }

      // Google Analytics 4
      if (window.gtag) {
        window.gtag('event', eventName, parameters);
      }

      // Google Tag Manager
      if (window.dataLayer) {
        window.dataLayer.push({
          event: eventName,
          ...parameters
        });
      }

      // Console log in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Analytics Event:', eventName, parameters);
      }
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  }, []);

  // Assessment-specific tracking methods
  const trackAssessmentStart = useCallback((assessmentType, metadata = {}) => {
    trackEvent('assessment_started', {
      assessment_type: assessmentType,
      timestamp: new Date().toISOString(),
      ...metadata
    });
  }, [trackEvent]);

  const trackAssessmentProgress = useCallback((assessmentType, stage, progress) => {
    trackEvent('assessment_progress', {
      assessment_type: assessmentType,
      stage: stage,
      progress_percentage: progress,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackAssessmentComplete = useCallback((assessmentType, results) => {
    trackEvent('assessment_completed', {
      assessment_type: assessmentType,
      overall_score: results.overall,
      readiness_level: results.readinessLevel,
      company_size: results.companySize,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackQuestionAnswered = useCallback((assessmentType, questionId, answer, timeSpent) => {
    trackEvent('question_answered', {
      assessment_type: assessmentType,
      question_id: questionId,
      answer_value: typeof answer === 'object' ? JSON.stringify(answer) : answer,
      time_spent_seconds: timeSpent,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackEmailCapture = useCallback((assessmentType, email, score) => {
    trackEvent('email_captured', {
      assessment_type: assessmentType,
      score_at_capture: score,
      timestamp: new Date().toISOString()
    });
    
    // Also track as a conversion
    trackEvent('generate_lead', {
      currency: 'GBP',
      value: score > 70 ? 500 : score > 40 ? 250 : 100, // Estimated lead value
      assessment_type: assessmentType
    });
  }, [trackEvent]);

  const trackConsultationClick = useCallback((assessmentType, score, source) => {
    trackEvent('consultation_clicked', {
      assessment_type: assessmentType,
      score: score,
      click_source: source, // 'results_page', 'email', 'quick_win', etc.
      timestamp: new Date().toISOString()
    });
    
    // Track as conversion
    trackEvent('begin_checkout', {
      currency: 'GBP',
      value: 500, // QuickMap.ai consultation value
      items: [{
        item_name: 'QuickMap.ai Consultation',
        item_category: assessmentType,
        price: 500,
        quantity: 1
      }]
    });
  }, [trackEvent]);

  const trackReportDownload = useCallback((assessmentType, score, format = 'pdf') => {
    trackEvent('report_downloaded', {
      assessment_type: assessmentType,
      score: score,
      format: format,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackQuickWinView = useCallback((assessmentType, quickWinId) => {
    trackEvent('quick_win_viewed', {
      assessment_type: assessmentType,
      quick_win_id: quickWinId,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  const trackError = useCallback((errorType, errorMessage, context = {}) => {
    trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      page_path: location.pathname,
      ...context,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent, location]);

  const trackTiming = useCallback((category, variable, value, label) => {
    trackEvent('timing_complete', {
      timing_category: category,
      timing_variable: variable,
      timing_value: value, // in milliseconds
      timing_label: label
    });
    
    // Also send to Google Analytics if available
    if (window.gtag) {
      window.gtag('event', 'timing_complete', {
        name: variable,
        value: value,
        event_category: category,
        event_label: label
      });
    }
  }, [trackEvent]);

  // Track user properties (for user segmentation)
  const setUserProperties = useCallback((properties) => {
    try {
      // Firebase Analytics
      if (analytics && window.firebase) {
        Object.entries(properties).forEach(([key, value]) => {
          window.firebase.analytics().setUserProperties({ [key]: value });
        });
      }

      // Google Analytics 4
      if (window.gtag) {
        window.gtag('set', 'user_properties', properties);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('User Properties Set:', properties);
      }
    } catch (error) {
      console.error('Error setting user properties:', error);
    }
  }, []);

  // Ecommerce tracking for consultation booking
  const trackPurchase = useCallback((transactionData) => {
    trackEvent('purchase', {
      transaction_id: transactionData.id,
      value: transactionData.value,
      currency: transactionData.currency || 'GBP',
      items: transactionData.items,
      timestamp: new Date().toISOString()
    });
  }, [trackEvent]);

  return {
    trackEvent,
    trackAssessmentStart,
    trackAssessmentProgress,
    trackAssessmentComplete,
    trackQuestionAnswered,
    trackEmailCapture,
    trackConsultationClick,
    trackReportDownload,
    trackQuickWinView,
    trackError,
    trackTiming,
    setUserProperties,
    trackPurchase
  };
};

export default useAnalytics;