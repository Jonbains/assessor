import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import { ProgressBar } from './ProgressBar';
import styles from '../styles/components.module.css';

const SectorSelector = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    const { updateAssessmentData, saveProgress } = useAssessment();
    const [sectors, setSectors] = useState([]);
    const [selectedSector, setSelectedSector] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSectors = async () => {
            try {
                // Use dynamic import instead of fetch
                const module = await import(`../../assessments/${type}/sectors.json`);
                const data = module.default || module;
                setSectors(data.sectors || []);
            } catch (error) {
                console.error('Failed to load sectors:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSectors();
    }, [type]);

    const handleSelect = (sector) => {
        setSelectedSector(sector);
    };

    const handleContinue = async () => {
        if (selectedSector) {
            // Save selected sector to assessment data
            await updateAssessmentData({
                sector: selectedSector
            });
            
            await saveProgress('sector');
            
            // Navigate to qualifying questions
            navigate(`/assessment/${type}/qualify`);
        }
    };

    const title = type === 'agency-vulnerability' ? 
        "What type of agency are you?" : 
        "What industry is your company in?";
    
    const description = type === 'agency-vulnerability' ?
        "We'll tailor your assessment to the unique challenges of your sector." :
        "This helps us provide relevant benchmarks and recommendations.";

    return (
        <div className="screen active">
            <div className="header">
                <div className="logo">obsolete<span>.</span></div>
                <ProgressBar progress={15} label="Step 2 of 7" />
            </div>
            
            <h2>{title}</h2>
            <p>{description}</p>
            
            {loading ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>Loading sectors...</p>
            ) : (
                <div className="options">
                    {sectors.map((sector) => (
                        <div 
                            key={sector.id || sector.value}
                            className={`option ${selectedSector?.id === sector.id ? 'selected' : ''}`}
                            onClick={() => handleSelect(sector)}
                        >
                            <div className="option-icon">{sector.icon}</div>
                            <div className="option-content">
                                <div className="option-title">{sector.name || sector.label}</div>
                                {sector.description && (
                                    <div className="option-description">{sector.description}</div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className="navigation">
                <button className="btn btn-secondary" onClick={() => navigate('/')}>← Back</button>
                <button 
                    className="btn btn-primary" 
                    disabled={!selectedSector}
                    onClick={handleContinue}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default SectorSelector;
