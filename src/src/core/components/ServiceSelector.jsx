import React, { useState, useEffect } from 'react';
import { ProgressBar } from './ProgressBar';

const ServiceSelector = ({ assessmentType, onSelect, onBack }) => {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadServices = async () => {
            try {
                const endpoint = assessmentType === 'agency-vulnerability' ? 
                    '/assessments/agency-vulnerability/services.json' : 
                    '/assessments/inhouse-marketing/activities.json';
                
                const response = await fetch(endpoint);
                const data = await response.json();
                setServices(data.services || data.activities || []);
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
        const selected = Object.entries(selectedServices)
            .filter(([_, value]) => value > 0)
            .map(([key]) => key);
        
        if (selected.length > 0) {
            onSelect(selected);
        }
    };

    const hasSelections = Object.values(selectedServices).some(v => v > 0);
    const isAgency = assessmentType === 'agency-vulnerability';
    
    const title = isAgency ? 
        "What services do you provide?" : 
        "Which marketing activities do you do?";
    
    const description = isAgency ?
        "Drag the sliders to show relative importance. Don't worry about exact percentages—we'll figure that out." :
        "Select all that apply - we'll ask about each one.";

    return (
        <div className="screen active">
            <div className="header">
                <div className="logo">obsolete<span>.</span></div>
                <ProgressBar progress={45} label="Step 4 of 7" />
            </div>
            
            <h2>{title}</h2>
            <p>{description}</p>
            
            {loading ? (
                <p style={{ color: '#aaa', fontStyle: 'italic' }}>Loading services...</p>
            ) : (
                <div className="services-grid">
                    {services.map((service) => (
                        <div key={service.id} className="service-item">
                            <div className="service-row">
                                <div className="service-icon">{service.icon}</div>
                                <div className="service-content">
                                    <div className="service-name">{service.name}</div>
                                    <div className="service-description">{service.description}</div>
                                </div>
                            </div>
                            {isAgency ? (
                                <div className="slider-container">
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        value={selectedServices[service.id] || 0}
                                        onChange={(e) => handleSliderChange(service.id, e.target.value)}
                                    />
                                    <span className="slider-value">
                                        {selectedServices[service.id] || 0}%
                                    </span>
                                </div>
                            ) : (
                                <div className="checkbox-container">
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
            
            <div className="co-creation-highlight">
                <p>Why we ask: Knowing your core {isAgency ? 'services' : 'activities'} helps us pinpoint where AI can have the biggest impact on your efficiency and {isAgency ? 'client value' : 'results'}.</p>
            </div>
            
            <div className="navigation">
                <button className="btn btn-secondary" onClick={onBack}>← Back</button>
                <button 
                    className="btn btn-primary"
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
