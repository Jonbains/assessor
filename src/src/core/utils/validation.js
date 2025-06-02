// Form validation utilities
export const validation = {
    isEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    isPhone: (phone) => {
        const re = /^[\d\s\-\+\(\)]+$/;
        return re.test(phone);
    },
    
    isRequired: (value) => {
        return value !== null && value !== undefined && value !== '';
    },
    
    validateEmailForm: (formData) => {
        const errors = {};
        
        if (!validation.isRequired(formData.email)) {
            errors.email = 'Email is required';
        } else if (!validation.isEmail(formData.email)) {
            errors.email = 'Please enter a valid email';
        }
        
        if (formData.phone && !validation.isPhone(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }
        
        return {
            isValid: Object.keys(errors).length === 0,
            errors
        };
    },
    
    validateServiceSelection: (services) => {
        const selected = Object.entries(services)
            .filter(([_, value]) => value > 0)
            .map(([key]) => key);
        
        return {
            isValid: selected.length > 0,
            error: selected.length === 0 ? 'Please select at least one service' : null,
            selected
        };
    }
};

export default validation;
