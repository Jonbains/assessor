import React, { useState } from 'react';
import styles from '../styles/components.module.css';

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
                
                <button className={styles.ctaButton} type="submit">Get My Results</button>
                <p className={styles.privacyNote}>
                    We respect your privacy. Your data is secure and will never be shared. 
                    By submitting, you agree to our Terms and Privacy Policy.
                </p>
            </form>
        </div>
    );
};

export default EmailGate;
