import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import { ProgressBar } from './ProgressBar';
import styles from '../styles/components.module.css';

const ServiceSelector = () => {
    const navigate = useNavigate();
    const { type } = useParams();
    const { updateAssessmentData, saveProgress } = useAssessment();
    
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                // Use dynamic import instead of fetch
                const module = await import(`../../assessments/${type}/${type === 'agency-vulnerability' ? 'services' : 'activities'}.json`);
                const data = module.default || module;
                setServices(data.services || data.activities || []);
            } catch (error) {
                console.error('Failed to load services:', error);
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, [type]);

    const handleSliderChange = (serviceId, value) => {
        setSelectedServices(prev => ({
            ...prev,
            [serviceId]: parseInt(value)
        }));
    };

    const handleContinue = async () => {
        const selected = Object.entries(selectedServices)
            .filter(([_, value]) => value > 0)
            .map(([key]) => key);
        
        if (selected.length > 0) {
            await updateAssessmentData({ services: selected });
            await saveProgress('services');
            console.log(`Navigating to /assessment/${type}/questions`);
            navigate(`/assessment/${type}/questions`);
        }
    };

    const hasSelections = Object.values(selectedServices).some(v => v > 0);
    const isAgency = type === 'agency-vulnerability';
    
    const title = isAgency ? 
        "What services do you provide?" : 
        "Which marketing activities do you do?";
    
    const description = isAgency ?
        "Drag the sliders to show relative importance. Don't worry about exact percentages—we'll figure that out." :
        "Select all that apply - we'll ask about each one.";

    return (
        <div className={styles.screen}>
            <div className={styles.header}>
                <div className={styles.logo}>obsolete<span>.</span></div>
                <ProgressBar progress={45} label="Step 4 of 7" />
            </div>
            
            <h2>{title}</h2>
            <p>{description}</p>
            
            {loading ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>Loading services...</p>
            ) : (
                <div className={styles.servicesGrid}>
                    {services.map((service) => (
                        <div key={service.id} className={styles.serviceItem}>
                            <div className={styles.serviceRow}>
                                <div className={styles.serviceIcon}>{service.icon}</div>
                                <div className={styles.serviceContent}>
                                    <div className={styles.serviceName}>{service.name}</div>
                                    <div className={styles.serviceDescription}>{service.description}</div>
                                </div>
                            </div>
                            {isAgency ? (
                                <div className={styles.sliderContainer}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={selectedServices[service.id] || 0}
                                        onChange={(e) => handleSliderChange(service.id, e.target.value)}
                                        className={styles.rangeSlider}
                                    />
                                    <span className={styles.sliderValue}>
                                        {selectedServices[service.id] || 0}%
                                    </span>
                                </div>
                            ) : (
                                <div className={styles.checkboxContainer}>
                                    <input
                                        type="checkbox"
                                        id={service.id}
                                        checked={!!selectedServices[service.id]}
                                        onChange={(e) => handleSliderChange(service.id, e.target.checked ? 1 : 0)}
                                        className={styles.checkbox}
                                    />
                                    <label htmlFor={service.id} className={styles.checkboxLabel}></label>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            <div className={styles.coCreationHighlight}>
                <p>Why we ask: Knowing your core {isAgency ? 'services' : 'activities'} helps us pinpoint where AI can have the biggest impact on your efficiency and {isAgency ? 'client value' : 'results'}.</p>
            </div>
            
            <div className={styles.navigation}>
                <button className={styles.navButton} onClick={() => navigate(`/assessment/${type}/qualify`)}>← Back</button>
                <button 
                    className={`${styles.navButton} ${styles.primary}`}
                    disabled={!hasSelections}
                    onClick={handleContinue}
                >
                    Continue
                </button>
            </div>
        </div>
    );
};

export default ServiceSelector;
