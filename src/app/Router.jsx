import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AssessmentSelector from '../core/components/AssessmentSelector';
import SectorSelector from '../core/components/SectorSelector';
import QualifyingQuestions from '../core/components/QualifyingQuestions';
import ServiceSelector from '../core/components/ServiceSelector';
import DynamicQuestions from '../core/components/DynamicQuestions';
import EmailGate from '../core/components/EmailGate';
import ResultsDashboard from '../core/components/ResultsDashboard';

// Example: dynamic import for assessment-specific ResultsView
import AgencyResultsView from '../assessments/agency-vulnerability/ResultsView';
import InhouseResultsView from '../assessments/inhouse-marketing/ResultsView';

const RouterComponent = () => (
  <Router>
    <Routes>
      <Route path="/" element={<AssessmentSelector />} />
      <Route path="/assessment/:type/sector" element={<SectorSelector />} />
      <Route path="/assessment/:type/qualify" element={<QualifyingQuestions />} />
      <Route path="/assessment/:type/services" element={<ServiceSelector />} />
      <Route path="/assessment/:type/questions" element={<DynamicQuestions />} />
      <Route path="/assessment/:type/email" element={<EmailGate />} />
      <Route
        path="/assessment/agency-vulnerability/results"
        element={<ResultsDashboard ResultsView={AgencyResultsView} />}
      />
      <Route
        path="/assessment/inhouse-marketing/results"
        element={<ResultsDashboard ResultsView={InhouseResultsView} />}
      />
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
);

export default RouterComponent;
