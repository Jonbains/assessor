import React, { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import styles from '../styles/components.module.css';

const ServiceSelector = ({ assessmentType, onSelect, onBack }) => {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadServices = async () => {
            try {
                // Dynamic import for services based on assessment type
                const servicesModule = await import(`../../assessments/${assessmentType}/services.json`);
                setServices(servicesModule.default || []);
            } catch (error) {
                console.error('Failed to load services:', error);
                setError('Failed to load services. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, [assessmentType]);

    const toggleService = (serviceId) => {
        setSelectedServices(prev => {
            const newSelections = { ...prev };
            if (newSelections[serviceId]) {
                delete newSelections[serviceId];
            } else {
                newSelections[serviceId] = 1;
            }
            return newSelections;
        });
    };

    const handleContinue = () => {
        const selected = Object.keys(selectedServices);
        
        if (selected.length === 0) {
            alert('Please select at least one service to continue');
            return;
        }
        
        onSelect(selected);
    };

    const hasSelections = Object.keys(selectedServices).length > 0;

    if (loading) {
        return <div className={styles.loading}>Loading services...</div>;
    }

    if (error) {
        return (
            <div className={styles.error}>
                <p>{error}</p>
                <button onClick={() => loadServices()}>Try Again</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2>Select Services</h2>
                <ProgressBar progress={40} />
            </div>
            
            <p>Which services does your agency provide? Select all that apply.</p>
            
            <div className={styles.serviceGrid}>
                {services.map(service => (
                    <div 
                        key={service.id}
                        className={`${styles.serviceCard} ${selectedServices[service.id] ? styles.selected : ''}`}
                        onClick={() => toggleService(service.id)}
                    >
                        <div className={styles.serviceIcon}>{service.icon}</div>
                        <h3>{service.name}</h3>
                        <p>{service.description}</p>
                        {selectedServices[service.id] && <div className={styles.checkmark}>✓</div>}
                    </div>
                ))}
            </div>
            
            <div className={styles.buttonContainer}>
                <button 
                    className={styles.backButton} 
                    onClick={onBack}
                >
                    Back
                </button>
                <button 
                    className={styles.continueButton}
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
