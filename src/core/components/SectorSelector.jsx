import React, { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import styles from '../styles/components.module.css';

const SectorSelector = ({ assessmentType, onSelect, onBack }) => {
    const [sectors, setSectors] = useState([]);
    const [selectedSector, setSelectedSector] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadSectors = async () => {
            try {
                // Use dynamic import instead of fetch
                const module = await import(`../../assessments/${assessmentType}/sectors.json`);
                const data = module.default || module;
                console.log('Loaded sectors data:', data);
                setSectors(data.sectors || []);
            } catch (error) {
                console.error('Failed to load sectors:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSectors();
    }, [assessmentType]);

    const handleSelect = (sector) => {
        // Update local state for visual feedback
        setSelectedSector(sector);
        
        // Brief delay to show selection before proceeding
        setTimeout(() => {
            // Auto-advance using the onSelect prop
            onSelect(sector);
        }, 300);
    };

    // Manual continue button handler (as fallback)
    const handleContinue = () => {
        if (selectedSector) {
            onSelect(selectedSector);
        }
    };

    const title = assessmentType === 'agency-vulnerability' ? 
        "What type of agency are you?" : 
        "What industry is your company in?";
    
    const description = assessmentType === 'agency-vulnerability' ?
        "We'll tailor your assessment to the unique challenges of your sector." :
        "This helps us provide relevant benchmarks and recommendations.";

    return (
        <div className={styles.screen}>
            <div className={styles.header}>
                <div className={styles.logo}>obsolete<span>.</span></div>
                <ProgressBar progress={15} label="Step 2 of 7" />
            </div>
            
            <h2>{title}</h2>
            <p>{description}</p>
            
            {loading ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>Loading sectors...</p>
            ) : (
                <div className={styles.assessmentGrid}>
                    {sectors.map((sector) => (
                        <div 
                            key={sector.id || sector.value}
                            className={`${styles.assessmentCard} ${selectedSector?.id === sector.id ? styles.selected : ''}`}
                            onClick={() => handleSelect(sector)}
                        >
                            <div className={styles.cardIcon}>{sector.icon}</div>
                            <div className={styles.cardContent}>
                                <h3 className={styles.cardTitle}>{sector.name || sector.label}</h3>
                                <p className={styles.cardDescription}>{sector.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            <div className={styles.navigation}>
                <button className={styles.navButton} onClick={onBack}>← Back</button>
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
