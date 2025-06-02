import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

const PROGRESS_KEY = 'assessment_progress';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const AUTOSAVE_INTERVAL = 30000; // Auto-save every 30 seconds

const useProgress = (assessmentType) => {
  const navigate = useNavigate();
  const [progress, setProgress] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showSaveIndicator, setShowSaveIndicator] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const autosaveInterval = useRef(null);
  
  // Initialize progress
  useEffect(() => {
    loadProgress();
    
    // Set up autosave
    autosaveInterval.current = setInterval(() => {
      if (progress && progress.hasChanges) {
        saveProgress();
      }
    }, AUTOSAVE_INTERVAL);
    
    return () => {
      if (autosaveInterval.current) {
        clearInterval(autosaveInterval.current);
      }
    };
  }, [assessmentType]);

  // Load progress from localStorage and/or Firebase
  const loadProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      
      // First check localStorage for quick loading
      const localData = localStorage.getItem(`${PROGRESS_KEY}_${assessmentType}`);
      if (localData) {
        const parsed = JSON.parse(localData);
        const savedTime = new Date(parsed.timestamp).getTime();
        const now = new Date().getTime();
        
        // Check if session is still valid
        if (now - savedTime < SESSION_DURATION) {
          setProgress(parsed.data);
          setLastSaved(parsed.timestamp);
          
          // If we have a session ID, also check Firebase for newer data
          if (parsed.data.sessionId) {
            const firebaseData = await loadFromFirebase(parsed.data.sessionId);
            if (firebaseData && new Date(firebaseData.updatedAt) > new Date(parsed.timestamp)) {
              setProgress(firebaseData);
              setLastSaved(firebaseData.updatedAt);
              // Update localStorage with newer data
              saveToLocalStorage(firebaseData);
            }
          }
        } else {
          // Session expired, clear local data
          localStorage.removeItem(`${PROGRESS_KEY}_${assessmentType}`);
        }
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error loading progress:', error);
      setIsLoading(false);
    }
  }, [assessmentType]);

  // Save progress to localStorage and Firebase
  const saveProgress = useCallback(async (data = progress) => {
    if (!data) return;
    
    try {
      setIsSaving(true);
      
      // Generate session ID if not exists
      if (!data.sessionId) {
        data.sessionId = generateSessionId();
      }
      
      // Mark that changes have been saved
      data.hasChanges = false;
      
      // Save to localStorage first (immediate)
      saveToLocalStorage(data);
      
      // Then save to Firebase (async)
      await saveToFirebase(data);
      
      setLastSaved(new Date().toISOString());
      setProgress(data);
      
      // Show save indicator
      triggerSaveIndicator();
      
      setIsSaving(false);
    } catch (error) {
      console.error('Error saving progress:', error);
      setIsSaving(false);
    }
  }, [progress]);

  // Save to localStorage
  const saveToLocalStorage = (data) => {
    const saveData = {
      data: data,
      timestamp: new Date().toISOString()
    };
    localStorage.setItem(`${PROGRESS_KEY}_${assessmentType}`, JSON.stringify(saveData));
  };

  // Save to Firebase
  const saveToFirebase = async (data) => {
    if (!data.sessionId) return;
    
    try {
      const progressDoc = doc(db, 'assessmentProgress', data.sessionId);
      const saveData = {
        ...data,
        assessmentType,
        updatedAt: serverTimestamp(),
        expiresAt: new Date(Date.now() + SESSION_DURATION)
      };
      
      await setDoc(progressDoc, saveData, { merge: true });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
      // Don't throw - localStorage save is enough
    }
  };

  // Load from Firebase
  const loadFromFirebase = async (sessionId) => {
    try {
      const progressDoc = doc(db, 'assessmentProgress', sessionId);
      const docSnap = await getDoc(progressDoc);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Check if expired
        if (data.expiresAt && new Date(data.expiresAt.toDate()) > new Date()) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('Error loading from Firebase:', error);
      return null;
    }
  };

  // Update specific progress data
  const updateProgress = useCallback((updates) => {
    setProgress(prev => {
      const newProgress = {
        ...prev,
        ...updates,
        hasChanges: true,
        lastModified: new Date().toISOString()
      };
      return newProgress;
    });
  }, []);

  // Clear all progress
  const clearProgress = useCallback(async () => {
    try {
      // Clear localStorage
      localStorage.removeItem(`${PROGRESS_KEY}_${assessmentType}`);
      
      // Clear Firebase if we have a session
      if (progress?.sessionId) {
        const progressDoc = doc(db, 'assessmentProgress', progress.sessionId);
        await updateDoc(progressDoc, {
          cleared: true,
          clearedAt: serverTimestamp()
        });
      }
      
      // Reset state
      setProgress(null);
      setLastSaved(null);
      
      console.log('Progress cleared');
    } catch (error) {
      console.error('Error clearing progress:', error);
    }
  }, [assessmentType, progress]);

  // Show save indicator
  const triggerSaveIndicator = () => {
    setShowSaveIndicator(true);
    setTimeout(() => {
      setShowSaveIndicator(false);
    }, 2000);
  };

  // Get current stage from progress
  const getCurrentStage = useCallback(() => {
    if (!progress) return null;
    return progress.currentStage || 'start';
  }, [progress]);

  // Set current stage
  const setCurrentStage = useCallback((stage) => {
    updateProgress({
      currentStage: stage,
      stages: {
        ...progress?.stages,
        [stage]: {
          completed: false,
          startedAt: new Date().toISOString()
        }
      }
    });
  }, [progress, updateProgress]);

  // Mark stage as complete
  const completeStage = useCallback((stage) => {
    updateProgress({
      stages: {
        ...progress?.stages,
        [stage]: {
          ...progress?.stages?.[stage],
          completed: true,
          completedAt: new Date().toISOString()
        }
      }
    });
  }, [progress, updateProgress]);

  // Save question answer
  const saveAnswer = useCallback((questionId, answer) => {
    updateProgress({
      answers: {
        ...progress?.answers,
        [questionId]: {
          value: answer,
          timestamp: new Date().toISOString()
        }
      }
    });
  }, [progress, updateProgress]);

  // Save qualifying data
  const saveQualifying = useCallback((qualifyingData) => {
    updateProgress({
      qualifying: qualifyingData,
      companySize: qualifyingData.agency_size || qualifyingData.company_size,
      revenue: qualifyingData.annual_revenue,
      budget: qualifyingData.budget
    });
  }, [updateProgress]);

  // Save selected services/activities
  const saveServices = useCallback((services) => {
    updateProgress({
      selectedServices: services
    });
  }, [updateProgress]);

  // Save email
  const saveEmail = useCallback((emailData) => {
    updateProgress({
      email: emailData.email,
      emailData: emailData,
      emailCapturedAt: new Date().toISOString()
    });
  }, [updateProgress]);

  // Calculate completion percentage
  const getCompletionPercentage = useCallback(() => {
    if (!progress) return 0;
    
    const stages = ['sector', 'qualifying', 'services', 'questions', 'email'];
    const completed = stages.filter(stage => 
      progress.stages?.[stage]?.completed
    ).length;
    
    return Math.round((completed / stages.length) * 100);
  }, [progress]);

  // Check if can resume
  const canResume = useCallback(() => {
    if (!progress) return false;
    
    const savedTime = new Date(progress.lastModified || progress.timestamp).getTime();
    const now = new Date().getTime();
    
    return now - savedTime < SESSION_DURATION;
  }, [progress]);

  // Resume assessment
  const resumeAssessment = useCallback(() => {
    if (!progress || !canResume()) return;
    
    const stage = progress.currentStage || 'sector';
    navigate(`/assessment/${assessmentType}/${stage}`);
  }, [progress, assessmentType, navigate, canResume]);

  // Generate session ID
  const generateSessionId = () => {
    return `${assessmentType}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  };

  return {
    progress,
    isLoading,
    isSaving,
    showSaveIndicator,
    lastSaved,
    saveProgress,
    updateProgress,
    clearProgress,
    getCurrentStage,
    setCurrentStage,
    completeStage,
    saveAnswer,
    saveQualifying,
    saveServices,
    saveEmail,
    getCompletionPercentage,
    canResume,
    resumeAssessment,
    // Expose raw functions for specific needs
    saveToLocalStorage,
    saveToFirebase,
    loadFromFirebase
  };
};

export default useProgress;