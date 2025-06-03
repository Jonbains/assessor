import React, { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import './ServiceSelector.css'; // Using direct CSS import instead of CSS modules

// Simple, focused ServiceSelector component
const ServiceSelector = ({ assessmentType, onSelect, onBack }) => {
    // Basic state management
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log(`ServiceSelector loading for ${assessmentType}`);
        
        const loadServices = async () => {
            console.log(`Loading services for ${assessmentType}`);
            try {
                // Dynamic import with more robust path handling
                let data;
                if (assessmentType === 'agency-vulnerability') {
                    try {
                        // Try relative to src folder first
                        const module = await import('../../../assessments/agency-vulnerability/services.json');
                        data = module.default;
                    } catch (e) {
                        console.log('First import path failed, trying alternate path');
                        // Fall back to public folder if that fails
                        const response = await fetch('/assessments/agency-vulnerability/services.json');
                        data = await response.json();
                    }
                } else {
                    try {
                        const module = await import('../../../assessments/inhouse-marketing/activities.json');
                        data = module.default;
                    } catch (e) {
                        console.log('First import path failed, trying alternate path');
                        const response = await fetch('/assessments/inhouse-marketing/activities.json');
                        data = await response.json();
                    }
                }
                
                // Properly extract services from the data structure
                let serviceArray = [];
                
                if (data) {
                    // Handle different possible data structures
                    if (Array.isArray(data)) {
                        serviceArray = data;
                    } else if (data.services && Array.isArray(data.services)) {
                        serviceArray = data.services;
                    } else if (data.activities && Array.isArray(data.activities)) {
                        serviceArray = data.activities;
                    } else {
                        // Try to extract as object values if it's an object with service entries
                        serviceArray = Object.values(data).filter(item => 
                            item && typeof item === 'object' && item.id && item.name
                        );
                    }
                }
                
                console.log('Services loaded successfully:', serviceArray);
                if (serviceArray.length === 0) {
                    console.error('Services array is empty, check data structure:', data);
                }
                
                setServices(serviceArray);
            } catch (error) {
                console.error('Failed to load services:', error);
            } finally {
                setLoading(false);
            }
        };

        loadServices();
    }, [assessmentType]);

    const handleSliderChange = (serviceId, value) => {
        setSelectedServices(prev => ({
            ...prev,
            [serviceId]: parseInt(value)
        }));
    };

    const handleContinue = () => {
        // Debug the selection before continuing
        console.log('Submitting service selections:', selectedServices);
        
        // Format selected services for context
        const formattedServices = Object.keys(selectedServices)
            .filter(id => selectedServices[id] > 0)
            .map(id => {
                const serviceInfo = services.find(s => s.id === id);
                return {
                    id,
                    value: selectedServices[id],
                    name: serviceInfo?.name || id // Fallback to ID if name not found
                };
            });
        
        console.log('Formatted services for submission:', formattedServices);
        onSelect(formattedServices);
    };

    const hasSelections = Object.values(selectedServices).some(v => v > 0);
    const isAgency = assessmentType === 'agency-vulnerability';
    
    const title = isAgency ? 
        "What services do you provide?" : 
        "Which marketing activities do you do?";
    
    const description = isAgency ?
        "Drag the sliders to show relative importance. Don't worry about exact percentages—we'll figure that out." :
        "Select all that apply - we'll ask about each one.";

    // Comprehensive debug logging with full object inspection
    console.log('ServiceSelector render state:', {
        servicesLoaded: services.length > 0,
        servicesCount: services.length,
        servicesData: JSON.stringify(services).substring(0, 100) + '...', // Safer logging
        firstService: services[0] ? JSON.stringify(services[0]) : 'none',
        isLoading: loading,
        assessmentType,
        selectedServicesCount: Object.keys(selectedServices).length,
        hasSelections,
        // Check if the service data has the expected structure
        serviceStructureOK: services.every(s => s && typeof s === 'object' && s.id && s.name)
    });
    
    // DOM-based debugging - this will show if CSS is actually loading
    console.log('CSS Modules loaded:', {
        screenClass: styles.screen ? 'yes' : 'no',
        servicesGridClass: styles['services-grid'] ? 'yes' : 'no',
        serviceItemClass: styles['service-item'] ? 'yes' : 'no'
    });
    
    return (
        <div className={`${styles.screen} ${styles.active}`}>
            <div className={styles.header}>
                <div className={styles.logo}>obsolete<span>.</span></div>
                <ProgressBar progress={45} label="Step 4 of 7" />
            </div>
            
            <h2>{title}</h2>
            <p>{description}</p>
            
            {loading ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>Loading services...</p>
            ) : services.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '20px' }}>
                    <p>No services found. Please try refreshing the page.</p>
                    <button 
                        onClick={() => window.location.reload()}
                        style={{ padding: '8px 16px', marginTop: '10px' }}
                    >
                        Refresh
                    </button>
                </div>
            ) : (
                <>
                    {/* Debug info */}
                    <div style={{border: '2px solid yellow', padding: '10px', margin: '10px 0', color: 'white'}}>
                        <p>Debug: {services.length} services loaded</p>
                        {services.length > 0 && (
                            <p>First service: {services[0].name} ({services[0].id})</p>
                        )}
                    </div>
                    <div className={styles['services-grid']} style={{border: '1px solid red', padding: '10px'}}>
                        {services.map((service) => (
                        <div key={service.id} className={styles['service-item']}>
                            <div className={styles['service-row']}>
                                <div className={styles['service-icon']}>{service.icon}</div>
                                <div className={styles['service-content']}>
                                    <div className={styles['service-name']}>{service.name}</div>
                                    <div className={styles['service-description']}>{service.description}</div>
                                </div>
                            </div>
                            {isAgency ? (
                                <div className={styles['slider-container']}>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={selectedServices[service.id] || 0}
                                        onChange={(e) => handleSliderChange(service.id, e.target.value)}
                                    />
                                    <span className={styles['slider-value']}>
                                        {selectedServices[service.id] || 0}%
                                    </span>
                                </div>
                            ) : (
                                <div className={styles['checkbox-container']}>
                                    <input
                                        type="checkbox"
                                        id={service.id}
                                        checked={!!selectedServices[service.id]}
                                        onChange={(e) => handleSliderChange(service.id, e.target.checked ? 1 : 0)}
                                    />
                                    <label htmlFor={service.id}></label>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
            
            <div className={styles['co-creation-highlight']}>
                <p>Why we ask: Knowing your core {isAgency ? 'services' : 'activities'} helps us pinpoint where AI can have the biggest impact on your efficiency and {isAgency ? 'client value' : 'results'}.</p>
            </div>
            
            <div className={styles['navigation']}>
                <button className={`${styles.btn} ${styles['btn-secondary']}`} onClick={onBack}>← Back</button>
                <button 
                    className={`${styles.btn} ${styles['btn-primary']}`}
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
