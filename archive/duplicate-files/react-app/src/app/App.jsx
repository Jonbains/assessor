import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from '../core/components/Layout';
import AssessmentSelector from '../core/components/AssessmentSelector';
import AssessmentFlow from './AssessmentFlow';

function App() {
    return (
        <Router>
            <Layout>
                <Routes>
                    <Route path="/" element={<AssessmentSelector />} />
                    <Route path="/assessment/:type/*" element={<AssessmentFlow />} />
                </Routes>
            </Layout>
        </Router>
    );
}

export default App;
