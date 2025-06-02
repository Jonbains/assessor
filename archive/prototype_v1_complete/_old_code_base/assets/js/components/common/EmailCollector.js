/**
 * Email Collector Component
 * 
 * Collects user email and name before showing assessment results.
 * Used by both agency and inhouse assessment types.
 */

class EmailCollector {
  /**
   * Create an email collector component
   * @param {Object} options - Component options
   * @param {HTMLElement} options.container - Container element
   * @param {Object} options.eventBus - Event bus for communication
   * @param {Object} options.engine - Assessment engine
   * @param {Object} options.state - Current assessment state
   * @param {Object} options.config - Assessment configuration
   */
  constructor(options) {
    this.container = options.container;
    this.eventBus = options.eventBus;
    this.engine = options.engine;
    this.state = options.state || {};
    this.config = options.config || {};
    
    // Ensure userData exists
    this.state.userData = this.state.userData || { email: '', name: '' };
    
    // Bind methods
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.validateEmail = this.validateEmail.bind(this);
  }
  
  /**
   * Handle email input change
   * @param {Event} event - Input event
   */
  handleEmailChange(event) {
    const email = event.target.value;
    
    // Update state
    const userData = { ...this.state.userData, email };
    this.eventBus.emit('data:update', { userData });
    
    // Update validation display
    this.updateEmailValidation(email);
  }
  
  /**
   * Handle name input change
   * @param {Event} event - Input event
   */
  handleNameChange(event) {
    const name = event.target.value;
    
    // Update state
    const userData = { ...this.state.userData, name };
    this.eventBus.emit('data:update', { userData });
  }
  
  /**
   * Update email validation display
   * @param {string} email - Email address to validate
   */
  updateEmailValidation(email) {
    const emailInput = this.container.querySelector('#assessment-email');
    const emailError = this.container.querySelector('.email-error');
    
    if (!emailInput || !emailError) return;
    
    if (email && !this.validateEmail(email)) {
      emailInput.classList.add('invalid');
      emailError.style.display = 'block';
    } else {
      emailInput.classList.remove('invalid');
      emailError.style.display = 'none';
    }
  }
  
  /**
   * Validate email format
   * @param {string} email - Email address to validate
   * @returns {boolean} - Whether the email is valid
   */
  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }
  
  /**
   * Validate the component
   * @returns {boolean} - Whether the component is valid
   */
  validate() {
    const email = this.state.userData?.email || '';
    return email && this.validateEmail(email);
  }
  
  /**
   * Render the component
   */
  render() {
    // Clear container
    this.container.innerHTML = '';
    
    // Create title
    const title = document.createElement('h2');
    title.className = 'assessment-step-title';
    title.textContent = 'Almost Done!';
    this.container.appendChild(title);
    
    // Create description
    const description = document.createElement('p');
    description.className = 'assessment-step-description';
    description.textContent = 'Enter your details to receive your assessment results:';
    this.container.appendChild(description);
    
    // Create form
    const form = document.createElement('div');
    form.className = 'email-form';
    form.style.maxWidth = '500px';
    form.style.margin = '30px auto';
    form.style.padding = '20px';
    form.style.backgroundColor = '#f9f9f9';
    form.style.borderRadius = '8px';
    form.style.boxShadow = '0 2px 10px rgba(0,0,0,0.05)';
    
    // Create name field
    const nameGroup = document.createElement('div');
    nameGroup.className = 'form-group';
    nameGroup.style.marginBottom = '20px';
    
    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = 'assessment-name';
    nameLabel.textContent = 'Your Name';
    nameLabel.style.display = 'block';
    nameLabel.style.marginBottom = '5px';
    nameLabel.style.fontWeight = 'bold';
    nameGroup.appendChild(nameLabel);
    
    const nameInput = document.createElement('input');
    nameInput.type = 'text';
    nameInput.id = 'assessment-name';
    nameInput.className = 'assessment-name';
    nameInput.placeholder = 'Enter your name';
    nameInput.value = this.state.userData?.name || '';
    nameInput.style.width = '100%';
    nameInput.style.padding = '10px';
    nameInput.style.borderRadius = '4px';
    nameInput.style.border = '1px solid #ddd';
    nameInput.style.fontSize = '16px';
    nameInput.addEventListener('input', this.handleNameChange);
    nameGroup.appendChild(nameInput);
    
    form.appendChild(nameGroup);
    
    // Create email field
    const emailGroup = document.createElement('div');
    emailGroup.className = 'form-group';
    emailGroup.style.marginBottom = '10px';
    
    const emailLabel = document.createElement('label');
    emailLabel.htmlFor = 'assessment-email';
    emailLabel.textContent = 'Your Email';
    emailLabel.style.display = 'block';
    emailLabel.style.marginBottom = '5px';
    emailLabel.style.fontWeight = 'bold';
    emailGroup.appendChild(emailLabel);
    
    const emailInput = document.createElement('input');
    emailInput.type = 'email';
    emailInput.id = 'assessment-email';
    emailInput.className = 'assessment-email';
    emailInput.placeholder = 'Enter your email address';
    emailInput.value = this.state.userData?.email || '';
    emailInput.style.width = '100%';
    emailInput.style.padding = '10px';
    emailInput.style.borderRadius = '4px';
    emailInput.style.border = '1px solid #ddd';
    emailInput.style.fontSize = '16px';
    emailInput.addEventListener('input', this.handleEmailChange);
    emailGroup.appendChild(emailInput);
    
    const emailError = document.createElement('div');
    emailError.className = 'email-error';
    emailError.textContent = 'Please enter a valid email address';
    emailError.style.color = '#e53935';
    emailError.style.fontSize = '14px';
    emailError.style.marginTop = '5px';
    emailError.style.display = 'none';
    emailGroup.appendChild(emailError);
    
    form.appendChild(emailGroup);
    
    // Create privacy notice
    const privacyNotice = document.createElement('div');
    privacyNotice.className = 'privacy-notice';
    privacyNotice.innerHTML = `
      <p style="font-size: 14px; color: #666; margin-top: 20px;">
        Your email will be used to send you your assessment results and occasional 
        updates about AI trends. We respect your privacy and will never share 
        your information with third parties. You can unsubscribe at any time.
      </p>
    `;
    form.appendChild(privacyNotice);
    
    this.container.appendChild(form);
    
    // Initial validation check
    if (this.state.userData?.email) {
      this.updateEmailValidation(this.state.userData.email);
    }
  }
}

// Register component in the global namespace
(function() {
  // Initialize namespace
  window.AssessmentFramework = window.AssessmentFramework || {};
  window.AssessmentFramework.Components = window.AssessmentFramework.Components || {};
  window.AssessmentFramework.Components.common = window.AssessmentFramework.Components.common || {};
  
  // Register component
  window.AssessmentFramework.Components.common.EmailCollector = EmailCollector;
  
  console.log('[EmailCollector] Component registered successfully');
})();
