import React, { useState } from 'react';
import { ProgressBar } from './ProgressBar';
import styles from '../styles/components.module.css';

export const EmailGate = (props) => {
    // Extract props with safe fallbacks for both API versions
    const {
        assessmentType,
        saveResponse = () => console.log('saveResponse not provided'),
        getResponse = () => null, // Safe fallback if not provided
        onComplete = () => console.log('onComplete not provided'),
        onBack = () => console.log('onBack not provided'),
        progress = 80,
        setContext = null,
        onSubmit = null // For react-app version compatibility
    } = props;
    
    // Safely try to get initial values
    const safeGetResponse = (key) => {
        try {
            return typeof getResponse === 'function' ? getResponse(key) : null;
        } catch (err) {
            console.log(`Error getting response for ${key}:`, err);
            return null;
        }
    };
    
    // Initialize form data with safe defaults
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
        
        // Handle both API versions
        if (typeof onSubmit === 'function') {
            // react-app version
            console.log('Using onSubmit API with formData:', formData);
            onSubmit(formData);
        } else {
            // core version
            try {
                // Try to save individual responses if saveResponse is available
                if (typeof saveResponse === 'function') {
                    Object.entries(formData).forEach(([key, value]) => {
                        saveResponse(key, value);
                    });
                }
                
                // Try to set context if available
                if (typeof setContext === 'function') {
                    console.log('Setting contact info in context:', formData);
                    setContext('contact', formData);
                }
                
                // Call onComplete if available
                if (typeof onComplete === 'function') {
                    onComplete();
                }
            } catch (err) {
                console.error('Error submitting form:', err);
                alert('There was an error submitting the form. Please try again.');
            }
        }
    };
    
    const handleBackClick = () => {
        try {
            // Try to save responses if available
            if (typeof saveResponse === 'function') {
                Object.entries(formData).forEach(([key, value]) => {
                    saveResponse(key, value);
                });
            }
            
            // Go back if handler available
            if (typeof onBack === 'function') {
                onBack();
            }
        } catch (err) {
            console.error('Error going back:', err);
        }
    };

    return (
        <div className={styles.screen}>
            <div className={styles.header}>
                <div className={styles.logo}>obsolete<span>.</span></div>
                <ProgressBar progress={progress || 80} label="Step 6 of 7" />
            </div>
            
            <div className={styles.emailGate}>
                <div className={styles.emailHeader}>
                    <h2>Almost there!</h2>
                    <p>Get your personalized AI readiness report and transformation roadmap.</p>
                </div>
                
                <form className={styles.emailForm} onSubmit={handleSubmit}>
                    <div className={styles.formGroup}>
                        <input 
                            className={styles.formInput} 
                            id="email" 
                            name="email" 
                            type="email"
                            placeholder=" "
                            required
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <label className={styles.formLabel} htmlFor="email">Work Email*</label>
                    </div>
                    
                    <div className={styles.formRow}>
                        <div className={styles.formGroup}>
                            <input 
                                className={styles.formInput} 
                                id="firstName" 
                                name="firstName" 
                                type="text"
                                placeholder=" "
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                            <label className={styles.formLabel} htmlFor="firstName">First Name</label>
                        </div>
                        <div className={styles.formGroup}>
                            <input 
                                className={styles.formInput} 
                                id="lastName" 
                                name="lastName" 
                                type="text"
                                placeholder=" "
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                            <label className={styles.formLabel} htmlFor="lastName">Last Name</label>
                        </div>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <input 
                            className={styles.formInput} 
                            id="company" 
                            name="company" 
                            type="text"
                            placeholder=" "
                            value={formData.company}
                            onChange={handleChange}
                        />
                        <label className={styles.formLabel} htmlFor="company">Company</label>
                    </div>
                    
                    <div className={styles.formGroup}>
                        <input 
                            className={styles.formInput} 
                            id="phone" 
                            name="phone" 
                            type="tel"
                            placeholder=" "
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <label className={styles.formLabel} htmlFor="phone">Phone (optional)</label>
                    </div>
                    
                    <div className={styles.consentGroup}>
                        <label className={styles.checkboxLabel}>
                            <input 
                                id="marketing-consent" 
                                name="marketingConsent" 
                                type="checkbox"
                                checked={formData.marketingConsent}
                                onChange={handleChange}
                            />
                            <span className={styles.checkboxCustom}></span>
                            <span className={styles.consentText}>
                                I'd like to receive AI transformation insights and tips from Obsolete.
                            </span>
                        </label>
                    </div>
                    
                    <div className={styles.formActions}>
                        <button type="button" className={styles.backButton} onClick={handleBackClick}>Back</button>
                        <button className={styles.ctaButton} type="submit">Get My Results</button>
                    </div>
                    
                    <p className={styles.privacyNote}>
                        We respect your privacy. Your data is secure and will never be shared. 
                        By submitting, you agree to our Terms and Privacy Policy.
                    </p>
                </form>
            </div>
        </div>
    );
};

export default EmailGate;
