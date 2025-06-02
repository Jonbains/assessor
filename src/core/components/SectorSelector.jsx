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
            console.log(`Navigating to /assessment/${type}/qualify`);
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
        <div className={styles.screen}>
            <div className={styles.header}>
                <div className={styles.logo}>obsolete<span>.</span></div>
                <ProgressBar progress={25} label="Step 2 of 7" />
            </div>
            
            <h2>{title}</h2>
            <p>{description}</p>
            
            {loading ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>Loading sectors...</p>
            ) : (
                <div className={styles.sectorGrid}>
                    {sectors.map((sector) => (
                        <div 
                            key={sector.id} 
                            className={`${styles.sectorCard} ${selectedSector?.id === sector.id ? styles.selected : ''}`}
                            onClick={() => handleSelect(sector)}
                        >
                            <div className={styles.sectorIcon}>{sector.icon}</div>
                            <div className={styles.sectorContent}>
                                <h3 className={styles.sectorName}>{sector.name}</h3>
                                <p className={styles.sectorDescription}>{sector.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className={styles.navigation}>
                <button className={styles.navButton} onClick={() => navigate('/')}>← Back</button>
                <button 
                    className={`${styles.navButton} ${styles.primary}`} 
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
