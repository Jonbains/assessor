/**
 * In-House Marketing Assessment - Setup Step
 * 
 * Combined step that handles:
 * 1. Industry selection
 * 2. Activity selection
 * 3. Company information collection
 */

// StepBase will be accessed as a browser global

class SetupStep extends StepBase {
    constructor(assessment) {
        super(assessment);
        this.cleanupListeners = [];
        this.currentSection = 'industry'; // 'industry', 'activity', or 'company'
        this.minimumActivities = 1;
        this.maximumActivities = 5;
    }
    
    onEnter() {
        // When entering this step, determine which section to show
        // based on what data is already filled
        if (this.assessment.state.selectedIndustry && 
            this.assessment.state.selectedActivities.length >= this.minimumActivities) {
            this.currentSection = 'company';
        } else if (this.assessment.state.selectedIndustry) {
            this.currentSection = 'activity';
        } else {
            this.currentSection = 'industry';
        }
    }
    
    render() {
        switch(this.currentSection) {
            case 'industry':
                return this.renderIndustrySection();
            case 'activity':
                return this.renderActivitySection();
            case 'company':
                return this.renderCompanySection();
            default:
                return this.renderIndustrySection();
        }
    }
    
    renderIndustrySection() {
        const industries = this.assessment.config.industries || [];
        const selectedIndustry = this.assessment.state.selectedIndustry;
        
        let html = `
            <div class="assessment-step industry-step" style="background-color: #1e1e1e; color: #fff; padding: 30px; border-radius: 8px;">
                <div class="setup-progress" style="margin-bottom: 30px;">
                    <div class="progress-steps" style="display: flex; justify-content: space-between;">
                        <div class="progress-step active" style="font-weight: bold; color: #ffff66;">Industry</div>
                        <div class="progress-step" style="color: #999;">Activities</div>
                        <div class="progress-step" style="color: #999;">Company Info</div>
                    </div>
                    <div class="progress-bar" style="height: 4px; background-color: #333; margin-top: 10px;">
                        <div class="progress-fill" style="width: 33%; height: 100%; background-color: #ffff66;"></div>
                    </div>
                </div>
                
                <h2 style="color: #fff; margin-bottom: 20px;">Select Your Industry</h2>
                <p style="color: #ccc; margin-bottom: 30px;">This helps us tailor the assessment to your specific industry context.</p>
                
                <div class="industries-container" style="display: flex; flex-direction: column; gap: 15px;">
        `;
        
        industries.forEach(industry => {
            const isSelected = selectedIndustry === industry.id;
            html += `
                <div class="industry-option ${isSelected ? 'selected' : ''}" data-industry-id="${industry.id}" style="background-color: #333; padding: 15px; border-radius: 8px; cursor: pointer; ${isSelected ? 'border: 2px solid #ffff66;' : ''}">
                    <h3 style="color: #fff; margin-bottom: 10px;">${industry.name}</h3>
                    <p style="color: #ccc;">${industry.description}</p>
                    <div class="industry-benchmark" style="display: flex; justify-content: space-between; margin-top: 10px;">
                        <span style="color: #999;">Industry Avg: ${industry.avgReadiness}%</span>
                        <span style="color: #999;">Top Quartile: ${industry.topQuartile}%</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="step-navigation" style="margin-top: 25px; display: flex; justify-content: flex-end;">
                    <button id="industry-next" class="btn btn-primary" style="background-color: #ffff66; color: #222; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; ${!selectedIndustry ? 'opacity: 0.5; cursor: not-allowed;' : ''}" ${!selectedIndustry ? 'disabled' : ''}>NEXT</button>
                </div>
            </div>
        `;
        
        return html;
    }
    
    renderActivitySection() {
        const activities = this.assessment.config.activities || [];
        const selectedActivities = this.assessment.state.selectedActivities || [];
        
        let html = `
            <div class="assessment-step activities-step" style="background-color: #1e1e1e; color: #fff; padding: 30px; border-radius: 8px;">
                <div class="setup-progress" style="margin-bottom: 30px;">
                    <div class="progress-steps" style="display: flex; justify-content: space-between;">
                        <div class="progress-step completed" style="color: #999;">Industry</div>
                        <div class="progress-step active" style="font-weight: bold; color: #ffff66;">Activities</div>
                        <div class="progress-step" style="color: #999;">Company Info</div>
                    </div>
                    <div class="progress-bar" style="height: 4px; background-color: #333; margin-top: 10px;">
                        <div class="progress-fill" style="width: 66%; height: 100%; background-color: #ffff66;"></div>
                    </div>
                </div>
                
                <h2 style="color: #fff; margin-bottom: 20px;">Select Your Marketing Activities</h2>
                <p style="color: #ccc; margin-bottom: 30px;">Select the ${this.minimumActivities}-${this.maximumActivities} primary marketing activities your team focuses on.</p>
                
                <div class="activities-container" style="display: flex; flex-wrap: wrap; gap: 15px; margin-bottom: 20px;">
        `;
        
        activities.forEach(activity => {
            const isSelected = selectedActivities.includes(activity.id);
            html += `
                <div class="activity-option ${isSelected ? 'selected' : ''}" data-activity-id="${activity.id}" style="background-color: #333; padding: 15px; border-radius: 8px; cursor: pointer; flex: 1 0 45%; min-width: 250px; ${isSelected ? 'border: 2px solid #ffff66;' : ''}">
                    <h3 style="color: #fff; margin-bottom: 10px;">${activity.name}</h3>
                    <p style="color: #ccc; margin-bottom: 15px;">${activity.description}</p>
                    <div class="activity-impact" style="margin-top: auto;">
                        <span class="impact-badge" style="display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 12px; background-color: ${activity.aiImpact === 'High' ? '#ff6666' : activity.aiImpact === 'Low' ? '#66cc66' : '#ffcc66'}; color: #222;">${activity.aiImpact || 'Moderate'} AI Impact</span>
                    </div>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="selection-counter" style="margin-bottom: 20px; color: #ffff66; font-weight: bold;">
                    <span id="selection-count">${selectedActivities.length}</span>/${this.maximumActivities} activities selected
                </div>
                <div class="step-navigation" style="display: flex; justify-content: space-between; margin-top: 25px;">
                    <button id="activity-back" class="btn btn-secondary" style="background-color: #444; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">BACK</button>
                    <button id="activity-next" class="btn btn-primary" style="background-color: #ffff66; color: #222; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; ${selectedActivities.length < this.minimumActivities ? 'opacity: 0.5; cursor: not-allowed;' : ''}" ${selectedActivities.length < this.minimumActivities ? 'disabled' : ''}>NEXT</button>
                </div>
            </div>
        `;
        
        return html;
    }
    
    renderCompanySection() {
        const companySizes = this.assessment.config.companySizes || [];
        const selectedSize = this.assessment.state.companySize;
        const companyName = this.assessment.state.companyName || '';
        
        let html = `
            <div class="assessment-step company-step" style="background-color: #1e1e1e; color: #fff; padding: 30px; border-radius: 8px;">
                <div class="setup-progress" style="margin-bottom: 30px;">
                    <div class="progress-steps" style="display: flex; justify-content: space-between;">
                        <div class="progress-step completed" style="color: #999;">Industry</div>
                        <div class="progress-step completed" style="color: #999;">Activities</div>
                        <div class="progress-step active" style="font-weight: bold; color: #ffff66;">Company Info</div>
                    </div>
                    <div class="progress-bar" style="height: 4px; background-color: #333; margin-top: 10px;">
                        <div class="progress-fill" style="width: 100%; height: 100%; background-color: #ffff66;"></div>
                    </div>
                </div>
                
                <h2 style="color: #fff; margin-bottom: 20px;">Company Information</h2>
                <p style="color: #ccc; margin-bottom: 30px;">This helps us provide size-appropriate recommendations.</p>
                
                <div class="form-group" style="margin-bottom: 25px;">
                    <label for="company-name" style="display: block; margin-bottom: 8px; color: #ddd;">Company Name (Optional)</label>
                    <input type="text" id="company-name" class="form-control" value="${companyName}" placeholder="Your Company Name" style="width: 100%; padding: 12px; background-color: #333; border: 1px solid #444; color: #fff; border-radius: 4px;">
                </div>
                
                <div class="company-sizes" style="margin-bottom: 25px;">
                    <label style="display: block; margin-bottom: 10px; color: #ddd;">Company Size</label>
        `;
        
        companySizes.forEach(size => {
            const isSelected = selectedSize === size.id;
            html += `
                <div class="size-option ${isSelected ? 'selected' : ''}" data-size-id="${size.id}" style="background-color: #333; padding: 12px 15px; margin-bottom: 10px; border-radius: 8px; cursor: pointer; ${isSelected ? 'border: 2px solid #ffff66;' : 'border: 1px solid #444;'}">
                    <span style="color: #fff;">${size.name}</span>
                </div>
            `;
        });
        
        html += `
                </div>
                <div class="step-navigation" style="display: flex; justify-content: space-between; margin-top: 30px;">
                    <button id="company-back" class="btn btn-secondary" style="background-color: #444; color: #fff; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">BACK</button>
                    <button id="company-next" class="btn btn-primary" style="background-color: #ffff66; color: #222; border: none; padding: 10px 20px; border-radius: 4px; font-weight: bold; cursor: pointer; ${!selectedSize ? 'opacity: 0.5; cursor: not-allowed;' : ''}" ${!selectedSize ? 'disabled' : ''}>START ASSESSMENT</button>
                </div>
            </div>
        `;
        
        return html;
    }
    
    setupEventListeners(container) {
        // Clear previous listeners
        this.cleanupEventListeners();
        
        switch(this.currentSection) {
            case 'industry':
                this.setupIndustryListeners(container);
                break;
            case 'activity':
                this.setupActivityListeners(container);
                break;
            case 'company':
                this.setupCompanyListeners(container);
                break;
        }
    }
    
    setupIndustryListeners(container) {
        const industryOptions = container.querySelectorAll('.industry-option');
        const nextButton = container.querySelector('#industry-next');
        
        // Add transition effects to all options and buttons
        industryOptions.forEach(opt => opt.style.transition = 'all 0.2s ease');
        if (nextButton) nextButton.style.transition = 'all 0.2s ease';
        
        industryOptions.forEach(option => {
            // Add hover effects
            const hoverInListener = () => {
                if (!option.classList.contains('selected')) {
                    option.style.backgroundColor = '#444';
                }
            };
            
            const hoverOutListener = () => {
                if (!option.classList.contains('selected')) {
                    option.style.backgroundColor = '#333';
                }
            };
            
            // Add active state effects (when pressing)
            const mouseDownListener = () => {
                option.style.transform = 'scale(0.98)';
            };
            
            const mouseUpListener = () => {
                option.style.transform = 'scale(1)';
            };
            
            // Main click listener with enhanced visual feedback
            const clickListener = (e) => {
                if (!e || !e.currentTarget) return;
                
                const industryId = e.currentTarget.dataset.industryId;
                this.assessment.state.selectedIndustry = industryId;
                
                // Update UI with enhanced visual feedback
                const options = container.querySelectorAll('.industry-option');
                if (options) {
                    options.forEach(el => {
                        if (el) {
                            el.classList.remove('selected');
                            if (el.style) {
                                el.style.border = '1px solid #444';
                                el.style.backgroundColor = '#333';
                            }
                        }
                    });
                }
                
                if (e.currentTarget) {
                    e.currentTarget.classList.add('selected');
                    if (e.currentTarget.style) {
                        e.currentTarget.style.border = '2px solid #ffff66';
                        e.currentTarget.style.backgroundColor = '#444';
                        
                        // Flash effect for feedback - using a safer approach
                        try {
                            e.currentTarget.style.backgroundColor = '#555';
                            setTimeout(() => {
                                if (e.currentTarget && e.currentTarget.style) {
                                    e.currentTarget.style.backgroundColor = '#444';
                                }
                            }, 150);
                        } catch (err) {
                            console.log('[SetupStep] Error applying style:', err);
                        }
                    }
                }
                
                // Enable next button with visual feedback
                if (nextButton) {
                    nextButton.disabled = false;
                    if (nextButton.style) {
                        nextButton.style.opacity = '1';
                        nextButton.style.cursor = 'pointer';
                    }
                }
            };
            
            // Add all listeners
            option.addEventListener('mouseover', hoverInListener);
            option.addEventListener('mouseout', hoverOutListener);
            option.addEventListener('mousedown', mouseDownListener);
            option.addEventListener('mouseup', mouseUpListener);
            option.addEventListener('click', clickListener);
            
            // Clean up all listeners
            this.cleanupListeners.push(() => {
                option.removeEventListener('mouseover', hoverInListener);
                option.removeEventListener('mouseout', hoverOutListener);
                option.removeEventListener('mousedown', mouseDownListener);
                option.removeEventListener('mouseup', mouseUpListener);
                option.removeEventListener('click', clickListener);
            });
        });
        
        // Add hover and active effects to next button
        if (nextButton) {
            const buttonHoverIn = () => {
                if (!nextButton.disabled) {
                    nextButton.style.backgroundColor = '#ffffaa';
                }
            };
            
            const buttonHoverOut = () => {
                if (!nextButton.disabled) {
                    nextButton.style.backgroundColor = '#ffff66';
                }
            };
            
            const buttonDown = () => {
                if (!nextButton.disabled) {
                    nextButton.style.transform = 'scale(0.98)';
                }
            };
            
            const buttonUp = () => {
                if (!nextButton.disabled) {
                    nextButton.style.transform = 'scale(1)';
                }
            };
            
            const nextListener = () => {
                if (this.assessment.state.selectedIndustry) {
                    // Flash effect for feedback
                    nextButton.style.backgroundColor = '#ffffff';
                    setTimeout(() => {
                        this.currentSection = 'activity';
                        this.assessment.stateManager.saveState();
                        this.assessment.renderCurrentStep();
                    }, 150);
                }
            };
            
            nextButton.addEventListener('mouseover', buttonHoverIn);
            nextButton.addEventListener('mouseout', buttonHoverOut);
            nextButton.addEventListener('mousedown', buttonDown);
            nextButton.addEventListener('mouseup', buttonUp);
            nextButton.addEventListener('click', nextListener);
            
            this.cleanupListeners.push(() => {
                nextButton.removeEventListener('mouseover', buttonHoverIn);
                nextButton.removeEventListener('mouseout', buttonHoverOut);
                nextButton.removeEventListener('mousedown', buttonDown);
                nextButton.removeEventListener('mouseup', buttonUp);
                nextButton.removeEventListener('click', nextListener);
            });
        }
    }
    
    setupActivityListeners(container) {
        const activityOptions = container.querySelectorAll('.activity-option');
        const nextButton = container.querySelector('#activity-next');
        const backButton = container.querySelector('#activity-back');
        
        // Add transition effects to all elements
        activityOptions.forEach(opt => opt.style.transition = 'all 0.2s ease');
        if (nextButton) nextButton.style.transition = 'all 0.2s ease';
        if (backButton) backButton.style.transition = 'all 0.2s ease';
        
        activityOptions.forEach(option => {
            // Add hover effects
            const hoverInListener = () => {
                if (!option.classList.contains('selected')) {
                    option.style.backgroundColor = '#444';
                }
            };
            
            const hoverOutListener = () => {
                if (!option.classList.contains('selected')) {
                    option.style.backgroundColor = '#333';
                }
            };
            
            // Add active state effects (when pressing)
            const mouseDownListener = () => {
                option.style.transform = 'scale(0.98)';
            };
            
            const mouseUpListener = () => {
                option.style.transform = 'scale(1)';
            };
            
            // Main click listener with enhanced visual feedback
            const clickListener = (e) => {
                if (!e || !e.currentTarget) return;
                
                const activityId = e.currentTarget.dataset.activityId;
                let selectedActivities = [...this.assessment.state.selectedActivities] || [];
                
                // Toggle selection with visual feedback
                if (selectedActivities.includes(activityId)) {
                    // Remove activity
                    selectedActivities = selectedActivities.filter(id => id !== activityId);
                    
                    // Visual feedback for deselection
                    if (e.currentTarget) {
                        e.currentTarget.classList.remove('selected');
                        if (e.currentTarget.style) {
                            e.currentTarget.style.border = '1px solid #444';
                            e.currentTarget.style.backgroundColor = '#333';
                            
                            // Flash effect for feedback - safely
                            try {
                                e.currentTarget.style.backgroundColor = '#222';
                                setTimeout(() => {
                                    if (e.currentTarget && e.currentTarget.style) {
                                        e.currentTarget.style.backgroundColor = '#333';
                                    }
                                }, 150);
                            } catch (err) {
                                console.log('[SetupStep] Error applying style:', err);
                            }
                        }
                    }
                } else {
                    // Check if max selections reached
                    if (selectedActivities.length >= this.maximumActivities) {
                        // Visual error feedback - safely
                        if (e.currentTarget && e.currentTarget.style) {
                            try {
                                const originalBg = e.currentTarget.style.backgroundColor || '#333';
                                e.currentTarget.style.backgroundColor = '#ff6666';
                                setTimeout(() => {
                                    if (e.currentTarget && e.currentTarget.style) {
                                        e.currentTarget.style.backgroundColor = originalBg;
                                    }
                                    alert(`You can only select up to ${this.maximumActivities} activities.`);
                                }, 150);
                            } catch (err) {
                                console.log('[SetupStep] Error applying error style:', err);
                                alert(`You can only select up to ${this.maximumActivities} activities.`);
                            }
                        } else {
                            alert(`You can only select up to ${this.maximumActivities} activities.`);
                        }
                        return;
                    }
                    
                    // Add activity with visual feedback
                    selectedActivities.push(activityId);
                    if (e.currentTarget) {
                        e.currentTarget.classList.add('selected');
                        if (e.currentTarget.style) {
                            e.currentTarget.style.border = '2px solid #ffff66';
                            e.currentTarget.style.backgroundColor = '#444';
                            
                            // Flash effect for feedback - safely
                            try {
                                e.currentTarget.style.backgroundColor = '#555';
                                setTimeout(() => {
                                    if (e.currentTarget && e.currentTarget.style) {
                                        e.currentTarget.style.backgroundColor = '#444';
                                    }
                                }, 150);
                            } catch (err) {
                                console.log('[SetupStep] Error applying style:', err);
                            }
                        }
                    }
                }
                
                // Update state
                this.assessment.state.selectedActivities = selectedActivities;
                
                // Update counter with animation - safely
                const countElement = container.querySelector('#selection-count');
                if (countElement) {
                    countElement.textContent = selectedActivities.length;
                    
                    // Animate the counter - safely
                    if (countElement.style) {
                        try {
                            countElement.style.transition = 'transform 0.2s ease';
                            countElement.style.transform = 'scale(1.2)';
                            
                            setTimeout(() => {
                                if (countElement && countElement.style) {
                                    countElement.style.transform = 'scale(1)';
                                }
                            }, 200);
                        } catch (err) {
                            console.log('[SetupStep] Error animating counter:', err);
                        }
                    }
                }
                
                // Update next button state with visual feedback - safely
                if (nextButton) {
                    const canProceed = selectedActivities.length >= this.minimumActivities;
                    nextButton.disabled = !canProceed;
                    
                    if (nextButton.style) {
                        try {
                            nextButton.style.opacity = canProceed ? '1' : '0.5';
                            nextButton.style.cursor = canProceed ? 'pointer' : 'not-allowed';
                        } catch (err) {
                            console.log('[SetupStep] Error updating button style:', err);
                        }
                    }
                }
            };
            
            // Add all listeners
            option.addEventListener('mouseover', hoverInListener);
            option.addEventListener('mouseout', hoverOutListener);
            option.addEventListener('mousedown', mouseDownListener);
            option.addEventListener('mouseup', mouseUpListener);
            option.addEventListener('click', clickListener);
            
            // Clean up all listeners
            this.cleanupListeners.push(() => {
                option.removeEventListener('mouseover', hoverInListener);
                option.removeEventListener('mouseout', hoverOutListener);
                option.removeEventListener('mousedown', mouseDownListener);
                option.removeEventListener('mouseup', mouseUpListener);
                option.removeEventListener('click', clickListener);
            });
        });
        
        // Add button effects for back button
        if (backButton) {
            const backHoverIn = () => backButton.style.backgroundColor = '#555';
            const backHoverOut = () => backButton.style.backgroundColor = '#444';
            const backDown = () => backButton.style.transform = 'scale(0.98)';
            const backUp = () => backButton.style.transform = 'scale(1)';
            
            const backListener = () => {
                // Flash effect for feedback
                backButton.style.backgroundColor = '#666';
                setTimeout(() => {
                    this.currentSection = 'industry';
                    this.assessment.renderCurrentStep();
                }, 150);
            };
            
            backButton.addEventListener('mouseover', backHoverIn);
            backButton.addEventListener('mouseout', backHoverOut);
            backButton.addEventListener('mousedown', backDown);
            backButton.addEventListener('mouseup', backUp);
            backButton.addEventListener('click', backListener);
            
            this.cleanupListeners.push(() => {
                backButton.removeEventListener('mouseover', backHoverIn);
                backButton.removeEventListener('mouseout', backHoverOut);
                backButton.removeEventListener('mousedown', backDown);
                backButton.removeEventListener('mouseup', backUp);
                backButton.removeEventListener('click', backListener);
            });
        }
        
        // Add button effects for next button
        if (nextButton) {
            const nextHoverIn = () => {
                if (!nextButton.disabled) nextButton.style.backgroundColor = '#ffffaa';
            };
            
            const nextHoverOut = () => {
                if (!nextButton.disabled) nextButton.style.backgroundColor = '#ffff66';
            };
            
            const nextDown = () => {
                if (!nextButton.disabled) nextButton.style.transform = 'scale(0.98)';
            };
            
            const nextUp = () => {
                if (!nextButton.disabled) nextButton.style.transform = 'scale(1)';
            };
            
            const nextListener = () => {
                if (this.assessment.state.selectedActivities.length >= this.minimumActivities) {
                    // Flash effect for feedback
                    if (nextButton.style) {
                        nextButton.style.backgroundColor = '#ffffff';
                    }
                    setTimeout(() => {
                        // Use the proper navigation to go to company-info step
                        this.assessment.navigationController.nextStep();
                    }, 150);
                } else {
                    // Error shake animation if trying to proceed without selections
                    nextButton.style.transform = 'translateX(5px)';
                    setTimeout(() => {
                        nextButton.style.transform = 'translateX(-5px)';
                        setTimeout(() => {
                            nextButton.style.transform = 'translateX(0)';
                        }, 100);
                    }, 100);
                }
            };
            
            nextButton.addEventListener('mouseover', nextHoverIn);
            nextButton.addEventListener('mouseout', nextHoverOut);
            nextButton.addEventListener('mousedown', nextDown);
            nextButton.addEventListener('mouseup', nextUp);
            nextButton.addEventListener('click', nextListener);
            
            this.cleanupListeners.push(() => {
                nextButton.removeEventListener('mouseover', nextHoverIn);
                nextButton.removeEventListener('mouseout', nextHoverOut);
                nextButton.removeEventListener('mousedown', nextDown);
                nextButton.removeEventListener('mouseup', nextUp);
                nextButton.removeEventListener('click', nextListener);
            });
        }
    }
    
    setupCompanyListeners(container) {
        const companyNameInput = container.querySelector('#company-name');
        const sizeOptions = container.querySelectorAll('.size-option');
        const nextButton = container.querySelector('#company-next');
        const backButton = container.querySelector('#company-back');
        
        // Add transition effects to all elements
        sizeOptions.forEach(opt => opt.style.transition = 'all 0.2s ease');
        if (nextButton) nextButton.style.transition = 'all 0.2s ease';
        if (backButton) backButton.style.transition = 'all 0.2s ease';
        if (companyNameInput) companyNameInput.style.transition = 'all 0.2s ease';
        
        // Company name input with focus effects
        const inputFocusListener = () => {
            companyNameInput.style.borderColor = '#ffff66';
            companyNameInput.style.boxShadow = '0 0 0 2px rgba(255,255,102,0.3)';
        };
        
        const inputBlurListener = () => {
            companyNameInput.style.borderColor = '#444';
            companyNameInput.style.boxShadow = 'none';
        };
        
        const inputListener = (e) => {
            this.assessment.state.companyName = e.target.value;
        };
        
        companyNameInput.addEventListener('focus', inputFocusListener);
        companyNameInput.addEventListener('blur', inputBlurListener);
        companyNameInput.addEventListener('input', inputListener);
        
        this.cleanupListeners.push(() => {
            companyNameInput.removeEventListener('focus', inputFocusListener);
            companyNameInput.removeEventListener('blur', inputBlurListener);
            companyNameInput.removeEventListener('input', inputListener);
        });
        
        // Size options with visual feedback
        sizeOptions.forEach(option => {
            // Add hover effects
            const hoverInListener = () => {
                if (!option.classList.contains('selected')) {
                    option.style.backgroundColor = '#444';
                }
            };
            
            const hoverOutListener = () => {
                if (!option.classList.contains('selected')) {
                    option.style.backgroundColor = '#333';
                }
            };
            
            // Add active state effects (when pressing)
            const mouseDownListener = () => {
                option.style.transform = 'scale(0.98)';
            };
            
            const mouseUpListener = () => {
                option.style.transform = 'scale(1)';
            };
            
            // Main click listener with enhanced visual feedback
            const clickListener = (e) => {
                if (!e || !e.currentTarget) return;
                
                const sizeId = e.currentTarget.dataset.sizeId;
                this.assessment.state.companySize = sizeId;
                
                // Update UI with enhanced visual feedback - safely
                const options = container.querySelectorAll('.size-option');
                if (options) {
                    options.forEach(el => {
                        if (el) {
                            el.classList.remove('selected');
                            if (el.style) {
                                el.style.border = '1px solid #444';
                                el.style.backgroundColor = '#333';
                            }
                        }
                    });
                }
                
                // Update selected item - safely
                if (e.currentTarget) {
                    e.currentTarget.classList.add('selected');
                    if (e.currentTarget.style) {
                        e.currentTarget.style.border = '2px solid #ffff66';
                        e.currentTarget.style.backgroundColor = '#444';
                        
                        // Flash effect for feedback - safely
                        try {
                            e.currentTarget.style.backgroundColor = '#555';
                            setTimeout(() => {
                                if (e.currentTarget && e.currentTarget.style) {
                                    e.currentTarget.style.backgroundColor = '#444';
                                }
                            }, 150);
                        } catch (err) {
                            console.log('[SetupStep] Error applying style:', err);
                        }
                    }
                }
                
                // Enable next button with visual feedback - safely
                if (nextButton) {
                    nextButton.disabled = false;
                    if (nextButton.style) {
                        try {
                            nextButton.style.opacity = '1';
                            nextButton.style.cursor = 'pointer';
                        } catch (err) {
                            console.log('[SetupStep] Error updating button style:', err);
                        }
                    }
                }
            };
            
            // Add all listeners
            option.addEventListener('mouseover', hoverInListener);
            option.addEventListener('mouseout', hoverOutListener);
            option.addEventListener('mousedown', mouseDownListener);
            option.addEventListener('mouseup', mouseUpListener);
            option.addEventListener('click', clickListener);
            
            // Clean up all listeners
            this.cleanupListeners.push(() => {
                option.removeEventListener('mouseover', hoverInListener);
                option.removeEventListener('mouseout', hoverOutListener);
                option.removeEventListener('mousedown', mouseDownListener);
                option.removeEventListener('mouseup', mouseUpListener);
                option.removeEventListener('click', clickListener);
            });
        });
        
        // Add button effects for back button
        if (backButton) {
            const backHoverIn = () => backButton.style.backgroundColor = '#555';
            const backHoverOut = () => backButton.style.backgroundColor = '#444';
            const backDown = () => backButton.style.transform = 'scale(0.98)';
            const backUp = () => backButton.style.transform = 'scale(1)';
            
            const backListener = () => {
                // Flash effect for feedback
                backButton.style.backgroundColor = '#666';
                setTimeout(() => {
                    this.currentSection = 'activity';
                    this.assessment.renderCurrentStep();
                }, 150);
            };
            
            backButton.addEventListener('mouseover', backHoverIn);
            backButton.addEventListener('mouseout', backHoverOut);
            backButton.addEventListener('mousedown', backDown);
            backButton.addEventListener('mouseup', backUp);
            backButton.addEventListener('click', backListener);
            
            this.cleanupListeners.push(() => {
                backButton.removeEventListener('mouseover', backHoverIn);
                backButton.removeEventListener('mouseout', backHoverOut);
                backButton.removeEventListener('mousedown', backDown);
                backButton.removeEventListener('mouseup', backUp);
                backButton.removeEventListener('click', backListener);
            });
        }
        
        // Add button effects for next button
        if (nextButton) {
            const nextHoverIn = () => {
                if (!nextButton.disabled) nextButton.style.backgroundColor = '#ffffaa';
            };
            
            const nextHoverOut = () => {
                if (!nextButton.disabled) nextButton.style.backgroundColor = '#ffff66';
            };
            
            const nextDown = () => {
                if (!nextButton.disabled) nextButton.style.transform = 'scale(0.98)';
            };
            
            const nextUp = () => {
                if (!nextButton.disabled) nextButton.style.transform = 'scale(1)';
            };
            
            const nextListener = () => {
                console.log('[SetupStep] Company info next button clicked');
                
                if (this.assessment.state.companySize) {
                    console.log('[SetupStep] Company size selected:', this.assessment.state.companySize);
                    
                    // Flash effect for feedback - safely
                    if (nextButton.style) {
                        try {
                            nextButton.style.backgroundColor = '#ffffff';
                        } catch (err) {
                            console.log('[SetupStep] Error applying button style:', err);
                        }
                    }
                    
                    setTimeout(() => {
                        // Save state then navigate to the next step using the controller
                        console.log('[SetupStep] Saving state and navigating to core-questions');
                        
                        // Make sure we're setting the proper state for the next step
                        this.assessment.state.currentStep = 'company-info'; // Ensure current step is set correctly
                        
                        // Initialize the question state if needed
                        if (!this.assessment.state.currentQuestionType) {
                            console.log('[SetupStep] Initializing question state');
                            this.assessment.state.currentQuestionType = 'core';
                            this.assessment.state.currentQuestionIndex = 0;
                            
                            // Initialize answers object if not present
                            if (!this.assessment.state.answers) {
                                this.assessment.state.answers = {};
                            }
                        }
                        
                        this.assessment.stateManager.saveState();
                        
                        // Log navigation steps
                        console.log('[SetupStep] Current steps in config:', this.assessment.config.steps);
                        console.log('[SetupStep] Next step should be core-questions');
                        
                        // Use the navigation controller to advance to the next step
                        this.assessment.navigationController.nextStep();
                    }, 150);
                } else {
                    // Error shake animation if trying to proceed without selection
                    nextButton.style.transform = 'translateX(5px)';
                    setTimeout(() => {
                        nextButton.style.transform = 'translateX(-5px)';
                        setTimeout(() => {
                            nextButton.style.transform = 'translateX(0)';
                        }, 100);
                    }, 100);
                }
            };
            
            nextButton.addEventListener('mouseover', nextHoverIn);
            nextButton.addEventListener('mouseout', nextHoverOut);
            nextButton.addEventListener('mousedown', nextDown);
            nextButton.addEventListener('mouseup', nextUp);
            nextButton.addEventListener('click', nextListener);
            
            this.cleanupListeners.push(() => {
                nextButton.removeEventListener('mouseover', nextHoverIn);
                nextButton.removeEventListener('mouseout', nextHoverOut);
                nextButton.removeEventListener('mousedown', nextDown);
                nextButton.removeEventListener('mouseup', nextUp);
                nextButton.removeEventListener('click', nextListener);
            });
        }
    }
    
    cleanupEventListeners() {
        this.cleanupListeners.forEach(cleanup => cleanup());
        this.cleanupListeners = [];
    }
    
    validate() {
        switch (this.currentSection) {
            case 'industry':
                return !!this.assessment.state.selectedIndustry;
            case 'activity':
                return this.assessment.state.selectedActivities.length >= this.minimumActivities;
            case 'company':
                return !!this.assessment.state.companySize;
            default:
                return false;
        }
    }
}

// Make the class available as a browser global
window.SetupStep = SetupStep;
