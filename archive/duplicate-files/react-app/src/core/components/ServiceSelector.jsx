import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAssessment } from '../hooks/useAssessment';
import Navigation from './Navigation';
import ProgressBar from './ProgressBar';
import styles from '../styles/components.module.css';

// Import the JSON data directly using the correct paths
import agencyServicesData from '../../assessments/agency-vulnerability/services.json';
import inhouseActivitiesData from '../../assessments/inhouse-marketing/activities.json';

const ServiceSelector = () => {
    console.log('==== LOADED VERSION: /src/react-app/src/core/components/ServiceSelector.jsx ====');
    const navigate = useNavigate();
    const { type } = useParams();
    const { 
        assessmentData, 
        updateAssessmentData, 
        saveProgress 
    } = useAssessment();
    
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState({});
    const [loading, setLoading] = useState(true);
    
    console.log('ServiceSelector rendered, assessment type:', type);
    console.log('Current assessment data:', assessmentData);

    useEffect(() => {
        // No async needed since we're using static imports
        if (!type) {
            console.error('No assessment type provided');
            setLoading(false);
            return;
        }

        console.log(`Loading services for ${type}`);
        
        let serviceData = [];
        
        // Use the imported data based on type
        if (type === 'agency-vulnerability') {
            serviceData = agencyServicesData.services || [];
            console.log('Agency services loaded:', serviceData);
        } else if (type === 'inhouse-marketing') {
            serviceData = inhouseActivitiesData.activities || [];
            console.log('Inhouse activities loaded:', serviceData);
        } else {
            console.error(`Unknown assessment type: ${type}`);
        }
        
        console.log('Service data loaded successfully:', serviceData);
        setServices(serviceData);
        
        // Load any previously saved selections
        if (assessmentData.selectedServices) {
            const savedSelections = {};
            assessmentData.selectedServices.forEach(serviceId => {
                savedSelections[serviceId] = 50; // Default to 50% for agencies
            });
            setSelectedServices(savedSelections);
        }
        
        setLoading(false);
    }, [type, assessmentData.selectedServices]);

    const handleSliderChange = (serviceId, value) => {
        setSelectedServices(prev => ({
            ...prev,
            [serviceId]: parseInt(value)
        }));
    };

    const handleNext = async () => {
        const selected = Object.entries(selectedServices)
            .filter(([_, value]) => value > 0)
            .map(([key]) => key);
        
        if (selected.length === 0) {
            alert('Please select at least one service');
            return;
        }
        
        try {
            // Save selected services to assessment data
            await updateAssessmentData({
                selectedServices: selected,
                serviceWeights: selectedServices
            });
            
            await saveProgress('services');
            
            // Navigate to questions
            navigate(`/assessment/${type}/questions`);
        } catch (error) {
            console.error('Error saving services:', error);
            alert('Failed to save your selections. Please try again.');
        }
    };

    const handleBack = () => {
        navigate(`/assessment/${type}/qualifying`);
    };

    const hasSelections = Object.values(selectedServices).some(v => v > 0);
    const isAgency = type === 'agency-vulnerability';
    
    const title = isAgency ? 
        "What services do you provide?" : 
        "Which marketing activities do you do?";
    
    const description = isAgency ?
        "Drag the sliders to show relative importance. Don't worry about exact percentages—we'll figure that out." :
        "Select all that apply - we'll ask about each one.";

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading services...</p>
            </div>
        );
    }

    if (!type) {
        return (
            <div className={styles.errorContainer}>
                <p>Assessment type not found</p>
                <button onClick={() => navigate('/')}>Start Over</button>
            </div>
        );
    }

    return (
        <div className={styles.serviceContainer}>
            <ProgressBar progress={45} stage="services" />
            
            <div className={styles.questionContainer}>
                <h2>{title}</h2>
                <p className={styles.description}>{description}</p>
                
                {services.length === 0 ? (
                    <div className={styles.errorContainer}>
                        <p>No services found. Please try refreshing the page.</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className={styles.navButton}
                        >
                            Refresh
                        </button>
                    </div>
                ) : (
                    <div className={styles.servicesGrid}>
                        {services.map((service) => (
                            <div 
                                key={service.id} 
                                className={`${styles.serviceCard} ${
                                    selectedServices[service.id] > 0 ? styles.selected : ''
                                }`}
                            >
                                <div className={styles.serviceHeader}>
                                    <span className={styles.serviceIcon}>{service.icon}</span>
                                    <div className={styles.serviceInfo}>
                                        <h3>{service.name}</h3>
                                        <p>{service.description}</p>
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
                                            className={styles.slider}
                                        />
                                        <span className={styles.sliderValue}>
                                            {selectedServices[service.id] || 0}%
                                        </span>
                                    </div>
                                ) : (
                                    <label className={styles.checkboxContainer}>
                                        <input
                                            type="checkbox"
                                            checked={!!selectedServices[service.id]}
                                            onChange={(e) => handleSliderChange(
                                                service.id, 
                                                e.target.checked ? 1 : 0
                                            )}
                                        />
                                        <span className={styles.checkmark}></span>
                                    </label>
                                )}
                            </div>
                        ))}
                    </div>
                )}
                
                <div className={styles.hint}>
                    <p>
                        Why we ask: Knowing your core {isAgency ? 'services' : 'activities'} 
                        helps us pinpoint where AI can have the biggest impact on your 
                        efficiency and {isAgency ? 'client value' : 'results'}.
                    </p>
                </div>
            </div>

            <Navigation
                onBack={handleBack}
                onNext={handleNext}
                showNext={hasSelections}
                nextLabel="Continue to Questions"
            />
        </div>
    );
};

export default ServiceSelector;