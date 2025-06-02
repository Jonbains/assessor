import React, { useState } from 'react';

// More resilient implementation that can handle different prop patterns
export const EmailGate = (props) => {
    // Support both API styles
    const {
        onSubmit = null,
        saveResponse = null,
        getResponse = null,
        setContext = null,
        onComplete = null,
        assessmentType = null
    } = props;
    
    // Safely try to get initial values
    const safeGetResponse = (key) => {
        try {
            if (typeof getResponse === 'function') {
                return getResponse(key);
            }
            return null;
        } catch (err) {
            console.log(`Error getting response for ${key}:`, err);
            return null;
        }
    };

    // Initialize form data safely
    const [formData, setFormData] = useState({
        email: safeGetResponse('email') || '',
        firstName: safeGetResponse('firstName') || '',
        lastName: safeGetResponse('lastName') || '',
        company: safeGetResponse('company') || '',
        phone: safeGetResponse('phone') || '',
        marketingConsent: safeGetResponse('marketingConsent') || false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        try {
            // Handle multiple possible API patterns
            if (typeof onSubmit === 'function') {
                // Standard API with onSubmit callback
                console.log('Calling onSubmit with form data:', formData);
                onSubmit(formData);
            } else if (typeof saveResponse === 'function') {
                // Alternative API with saveResponse
                console.log('Saving individual responses with saveResponse');
                Object.entries(formData).forEach(([key, value]) => {
                    saveResponse(key, value);
                });
                
                // Also set in context if available
                if (typeof setContext === 'function') {
                    console.log('Setting contact info in context');
                    setContext('contact', formData);
                }
                
                // Complete if handler available
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            } else {
                // Fallback if no save method provided
                console.error('No submit handler provided to EmailGate!');
                alert('Form submission is not properly configured.');
            }
        } catch (err) {
            console.error('Error submitting form:', err);
            alert('There was an error submitting the form. Please try again.');
        }
    };

    return (
        <div className="email-gate">
            <div className="email-header">
                <h2>Almost there!</h2>
                <p>Get your personalized AI readiness report and transformation roadmap.</p>
            </div>
            
            <form className="email-form" onSubmit={handleSubmit}>
                <div className="form-group">
                    <input 
                        className="form-input" 
                        id="email" 
                        name="email" 
                        type="email"
                        placeholder=" "
                        required
                        value={formData.email}
                        onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="email">Work Email*</label>
                </div>
                
                <div className="form-row">
                    <div className="form-group">
                        <input 
                            className="form-input" 
                            id="firstName" 
                            name="firstName" 
                            type="text"
                            placeholder=" "
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <label className="form-label" htmlFor="firstName">First Name</label>
                    </div>
                    <div className="form-group">
                        <input 
                            className="form-input" 
                            id="lastName" 
                            name="lastName" 
                            type="text"
                            placeholder=" "
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        <label className="form-label" htmlFor="lastName">Last Name</label>
                    </div>
                </div>
                
                <div className="form-group">
                    <input 
                        className="form-input" 
                        id="company" 
                        name="company" 
                        type="text"
                        placeholder=" "
                        value={formData.company}
                        onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="company">Company</label>
                </div>
                
                <div className="form-group">
                    <input 
                        className="form-input" 
                        id="phone" 
                        name="phone" 
                        type="tel"
                        placeholder=" "
                        value={formData.phone}
                        onChange={handleChange}
                    />
                    <label className="form-label" htmlFor="phone">Phone (optional)</label>
                </div>
                
                <div className="consent-group">
                    <label className="checkbox-label">
                        <input 
                            id="marketing-consent" 
                            name="marketingConsent" 
                            type="checkbox"
                            checked={formData.marketingConsent}
                            onChange={handleChange}
                        />
                        <span className="checkbox-custom"></span>
                        <span className="consent-text">
                            I'd like to receive AI transformation insights and tips from Obsolete.
                        </span>
                    </label>
                </div>
                
                <button className="cta-button" type="submit">Get My Results</button>
                <p className="privacy-note">
                    We respect your privacy. Your data is secure and will never be shared. 
                    By submitting, you agree to our Terms and Privacy Policy.
                </p>
            </form>
        </div>
    );
};

export default EmailGate;
