import React, { useState } from 'react';

export const EmailGate = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        company: '',
        phone: '',
        marketingConsent: false
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
        onSubmit(formData);
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
