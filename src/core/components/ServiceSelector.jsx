import React, { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';
import styles from '../styles/components.module.css';

// Import JSON data directly for webpack to bundle correctly
import agencyServices from '../../assessments/agency-vulnerability/services.json';
import inhouseActivities from '../../assessments/inhouse-marketing/activities.json';

const ServiceSelector = ({ assessmentType, onSelect, onBack }) => {
    console.log('==== LOADED VERSION: /src/core/components/ServiceSelector.jsx ====');
    const [services, setServices] = useState([]);
    const [allocations, setAllocations] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    console.log(`ServiceSelector rendered, assessment type: ${assessmentType}`);

    // Load services data based on assessment type
    const loadServices = () => {
        try {
            setLoading(true);
            console.log(`Loading services for ${assessmentType}`);
            
            // Use the statically imported JSON data based on assessment type
            let servicesData;
            if (assessmentType === 'agency-vulnerability') {
                console.log('Using agency services data');
                servicesData = agencyServices;
            } else if (assessmentType === 'inhouse-marketing') {
                console.log('Using inhouse activities data');
                servicesData = inhouseActivities;
            } else {
                throw new Error(`Unknown assessment type: ${assessmentType}`);
            }
            
            // Extract the correct data array
            const serviceArray = assessmentType === 'agency-vulnerability'
                ? (servicesData.services || [])
                : (servicesData.activities || []);
                
            console.log('Services data loaded:', serviceArray);
            
            if (serviceArray.length > 0) {
                setServices(serviceArray);
                
                // Initialize allocations with 0 for each service
                const initialAllocations = {};
                serviceArray.forEach(service => {
                    initialAllocations[service.id] = 0;
                });
                setAllocations(initialAllocations);
                
                setError(null);
            } else {
                console.error('Service data is empty:', servicesData);
                setError('No services found for this assessment type.');
            }
        } catch (error) {
            console.error('Failed to load services:', error);
            setError(`Failed to load services: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => {
        loadServices();
    }, [assessmentType]);

    // Handle slider value change - just update the slider value
    const handleSliderChange = (serviceId, value) => {
        // Parse the value to ensure it's a number
        const newValue = parseInt(value, 10) || 0;
        console.log(`Slider changed for service ${serviceId}: ${newValue}`);
        
        // Update the allocations 
        setAllocations(prev => ({
            ...prev,
            [serviceId]: newValue
        }));
        
        // Log for debugging
        setTimeout(() => {
            console.log('Current allocations after update:', allocations);
        }, 0);
    };

    // Handle continue button click
    const handleContinue = () => {
        // Get all services with non-zero allocation
        const selectedServices = {};
        let totalAllocation = 0;
        
        console.log('Raw allocations before normalization:', allocations);
        
        // Count total allocation for normalization
        Object.entries(allocations).forEach(([serviceId, value]) => {
            if (value > 0) {
                totalAllocation += value;
            }
        });
        
        console.log('Total allocation value:', totalAllocation);
        
        // Normalize allocations to get proportions
        if (totalAllocation > 0) {
            Object.entries(allocations).forEach(([serviceId, value]) => {
                if (value > 0) {
                    selectedServices[serviceId] = value / totalAllocation;
                    console.log(`Service ${serviceId} normalized to ${value / totalAllocation}`);
                }
            });
        }
        
        console.log('Final selectedServices object being passed:', selectedServices);
        
        // Check if any services were selected
        if (Object.keys(selectedServices).length === 0) {
            alert('Please select at least one service by moving the sliders');
            return;
        }
        
        // Pass the normalized services directly to the parent component
        onSelect(selectedServices);
    };

    // Reset all allocations
    const resetAllocations = () => {
        const resetValues = {};
        services.forEach(service => {
            resetValues[service.id] = 0;
        });
        setAllocations(resetValues);
    };

    // Even distribution button - simply set all sliders to the same value (50)
    const distributeEvenly = () => {
        // If there are no services, don't do anything
        if (services.length === 0) return;
        
        // Set all sliders to 50 (middle value)
        const newAllocations = {};
        services.forEach(service => {
            newAllocations[service.id] = 50;
        });
        
        setAllocations(newAllocations);
    };

    if (loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner}></div>
                <p>Loading services...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.errorContainer}>
                <h3>Error</h3>
                <p>{error}</p>
                <button onClick={loadServices} className={styles.button}>Retry</button>
                <button onClick={onBack} className={styles.buttonSecondary}>Go Back</button>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h2>{assessmentType === 'agency-vulnerability' ? 'Select Your Services' : 'Select Your Activities'}</h2>
            <p>Please move the sliders to show the rough proportions of how your resources are distributed:</p>
            
            <div className={styles.allocationControls}>
                <button onClick={resetAllocations} className={styles.buttonSmall}>Reset All</button>
                <button onClick={distributeEvenly} className={styles.buttonSmall}>Distribute Evenly</button>
            </div>
            
            <div className={styles.serviceList}>
                {services.map(service => {
                    const currentAllocation = allocations[service.id] || 0;
                    
                    return (
                        <div key={service.id} className={styles.serviceItem}>
                            <div className={styles.serviceHeader}>
                                <span className={styles.serviceName}>{service.name}</span>
                            </div>
                            
                            {service.description && (
                                <p className={styles.serviceDescription}>{service.description}</p>
                            )}
                            
                            <div className={styles.sliderContainer}>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={currentAllocation}
                                    onChange={(e) => handleSliderChange(service.id, e.target.value)}
                                    className={styles.slider}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>
            
            <div className={styles.navigationButtons}>
                <button onClick={onBack} className={styles.buttonSecondary}>
                    Back
                </button>
                <button 
                    onClick={handleContinue} 
                    className={styles.button}
                >
                    Continue
                </button>
            </div>
            
            <ProgressBar currentStep={2} totalSteps={5} />
        </div>
    );
};

export default ServiceSelector;
