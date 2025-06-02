/**
 * Agency Assessment Framework for WordPress/Divi
 * A JavaScript implementation compatible with WordPress and Divi
 * This matches the functionality of the original React implementation
 */

(function($) {
    'use strict';
    
    // Main Assessment Class
    window.AgencyAssessment = function(config, container) {
        this.config = config;
        this.container = container;
        this.state = {
            currentStep: config.steps[0],
            answers: {},
            selectedAgencyType: null,
            selectedServices: [],
            revenue: 0,
            email: '',
            name: '',
            currentQuestionIndex: 0,
            filteredQuestions: [],
            results: null
        };
        
        // Initialize the assessment
        this.init();
    };
    
    // Prototype methods
    AgencyAssessment.prototype = {
        init: function() {
            this.renderCurrentStep();
            this.setupEventListeners();
        },
        
        // Render the current step
        renderCurrentStep: function() {
            var stepContent = '';
            
            // If this is the questions step, make sure we've populated the filtered questions first
            if (this.state.currentStep === 'questions' && this.state.filteredQuestions.length === 0) {
                // Get and store questions
                this.state.filteredQuestions = this.getQuestionsForSelectedServices();
                console.log('[Assessment] Loaded ' + this.state.filteredQuestions.length + ' questions');
            }
            
            switch (this.state.currentStep) {
                case 'agency-type':
                    stepContent = this.renderAgencyTypeStep();
                    break;
                case 'services':
                    stepContent = this.renderServicesStep();
                    break;
                // revenue-allocation step removed - integrated into services step
                case 'revenue':
                    stepContent = this.renderRevenueStep();
                    break;
                case 'questions':
                    stepContent = this.renderQuestionsStep();
                    break;
                case 'email':
                    stepContent = this.renderEmailStep();
                    break;
                case 'results':
                    stepContent = this.renderResultsStep();
                    break;
                default:
                    stepContent = '<p>Unknown step</p>';
            }
            
            // Create the complete HTML
            var html = this.renderProgressBar();
            html += '<div class="assessment-step-content">' + stepContent + '</div>';
            
            // Update the container
            $(this.container).html(html);
            
            // Initialize charts if on results page and Chart.js is available
            if (this.state.currentStep === 'results' && typeof Chart !== 'undefined') {
                this.initializeCharts();
            }
        },
        
        // Initialize charts for results visualization
        initializeCharts: function() {
            if (!this.state.results) return;
            
            try {
                this.initializeRadarChart();
                this.initializeServiceVulnerabilityChart();
            } catch (error) {
                console.error('[Assessment] Error initializing charts:', error);
                // Don't let chart errors break the whole app
            }
        },
        
        // Initialize radar chart for results visualization
        initializeRadarChart: function() {
            if (!this.state.results) return;
            
            var ctx = document.getElementById('radarChart');
            if (!ctx) {
                console.log('[Assessment] Radar chart canvas not found, creating one');
                // Create canvas if it doesn't exist
                var container = document.querySelector('.radar-chart-container');
                if (container) {
                    ctx = document.createElement('canvas');
                    ctx.id = 'radarChart';
                    ctx.width = 400;
                    ctx.height = 400;
                    container.appendChild(ctx);
                } else {
                    console.error('[Assessment] Radar chart container not found');
                    return;
                }
            }
            
            // Check if there's an existing chart and destroy it first
            if (window.radarChart && typeof window.radarChart.destroy === 'function') {
                console.log('[Assessment] Destroying existing radar chart');
                window.radarChart.destroy();
                window.radarChart = null;
            } else if (window.radarChart) {
                console.log('[Assessment] Existing radar chart found but destroy method not available, resetting');
                window.radarChart = null;
            }
            
            // Prepare data for radar chart
            var scores = this.state.results.scores;
            var dimensionLabels = [];
            var dimensionScores = [];
            
            // Extract dimension names and scores (excluding overall)
            for (var dimension in scores) {
                if (dimension !== 'overall') {
                    dimensionLabels.push(this.formatDimensionName(dimension));
                    dimensionScores.push(scores[dimension]);
                }
            }
            
            // Create and render radar chart
            window.radarChart = new Chart(ctx, {
                type: 'radar',
                data: {
                    labels: dimensionLabels,
                    datasets: [{
                        label: 'Dimension Scores',
                        data: dimensionScores,
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                        pointRadius: 4
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            beginAtZero: true,
                            max: 100,
                            ticks: {
                                stepSize: 20
                            }
                        }
                    }
                }
            });
            
            console.log('[Assessment] Radar chart initialized');
        },
        
        // Render progress bar
        renderProgressBar: function() {
            var steps = this.config.steps;
            var currentIndex = steps.indexOf(this.state.currentStep);
            var progress = ((currentIndex + 1) / steps.length) * 100;
            
            var html = '<div class="assessment-progress-wrapper">';
            html += '<div class="assessment-progress-bar">';
            html += '<div class="assessment-progress-fill" style="width: ' + progress + '%"></div>';
            html += '</div>';
            html += '<div class="assessment-progress-text">Step ' + (currentIndex + 1) + ' of ' + steps.length + '</div>';
            html += '</div>';
            
            return html;
        },
        
        // Render agency type selection step
        renderAgencyTypeStep: function() {
            var html = '<h2 class="assessment-step-title">Select Your Agency Type</h2>';
            html += '<p class="assessment-step-description">Choose the option that best describes your agency\'s primary focus:</p>';
            
            html += '<div class="assessment-options">';
            
            var self = this;
            $.each(this.config.agencyTypes, function(index, agencyType) {
                var isSelected = self.state.selectedAgencyType === agencyType.id;
                html += '<div class="assessment-option ' + (isSelected ? 'assessment-option-selected' : '') + '" data-agency-type="' + agencyType.id + '">';
                html += '<input type="radio" name="agency-type" value="' + agencyType.id + '" id="agency-type-' + agencyType.id + '" ' + (isSelected ? 'checked' : '') + '>';
                html += '<div class="assessment-option-content">';
                html += '<label class="assessment-option-label" for="agency-type-' + agencyType.id + '">' + agencyType.name + '</label>';
                if (agencyType.description) {
                    html += '<p class="assessment-option-description">' + agencyType.description + '</p>';
                }
                html += '</div>';
                html += '</div>';
            });
            
            html += '</div>';
            
            // Navigation
            html += this.renderNavigation(false, true);
            
            return html;
        },
        
        // Render services selection step with integrated revenue allocation
        renderServicesStep: function() {
            var html = '<div class="assessment-section service-selection-section">';
            html += '<h2 class="assessment-step-title">Select Your Services & Allocate Revenue</h2>';
            html += '<div class="revenue-allocation-note">Drag sliders to allocate your agency revenue percentage across services</div>';
            
            html += '<div class="revenue-total-display">';
            html += '<div class="revenue-total-inner"><span>Total: </span><span id="revenue-total-value">0%</span></div>';
            html += '</div>';
            
            html += '<div class="assessment-options">';
            
            var self = this;
            $.each(this.config.services, function(index, service) {
                var isSelected = self.state.selectedServices.indexOf(service.id) !== -1;
                var serviceRevenuePercentage = self.state.serviceRevenue && self.state.serviceRevenue[service.id] ? self.state.serviceRevenue[service.id] : 0;
                
                html += '<div class="assessment-option ' + (isSelected ? 'selected' : '') + '" data-service-id="' + service.id + '">';
                html += '<div class="assessment-option-header">';
                html += '<input type="checkbox" id="service-' + service.id + '" value="' + service.id + '" ' + (isSelected ? 'checked' : '') + ' class="service-checkbox">';
                html += '<label class="assessment-option-label" for="service-' + service.id + '">' + service.name + '</label>';
                if (service.description) {
                    html += '<p class="assessment-option-description">' + service.description + '</p>';
                }
                html += '</div>';
                
                // Add revenue slider directly within each service option - always visible
                html += '<div class="service-revenue-slider">';
                html += '<div class="slider-controls">';
                html += '<button class="slider-button slider-decrease" data-service="' + service.id + '">-</button>';
                html += '<input type="range" min="0" max="100" value="' + serviceRevenuePercentage + '" class="revenue-slider" data-service="' + service.id + '">';
                html += '<button class="slider-button slider-increase" data-service="' + service.id + '">+</button>';
                html += '<span class="slider-value">' + serviceRevenuePercentage + '</span>';
                html += '</div>';
                html += '</div>';
                
                html += '</div>';
            });
            
            html += '</div>';
            html += '</div>';
            
            // Navigation
            html += this.renderNavigation(true, true);
            
            // Add JavaScript to handle service selection and revenue sliders
            var self = this;
            setTimeout(function() {
                // Initialize service revenue object if not already set
                if (!self.state.serviceRevenue) {
                    self.state.serviceRevenue = {};
                }
                
                // Handle service checkbox changes
                $('.service-checkbox').on('change', function() {
                    var serviceId = $(this).val();
                    var isChecked = $(this).is(':checked');
                    var $option = $(this).closest('.assessment-option');
                    var $slider = $option.find('.revenue-slider');
                    
                    // Update UI based on checkbox state
                    if (isChecked) {
                        $option.addClass('selected');
                        
                        // Set slider to middle position if service is selected
                        if (!self.state.serviceRevenue[serviceId] || self.state.serviceRevenue[serviceId] === 0) {
                            // Move slider to a default value (50% of the way)
                            $slider.val(50);
                            self.state.serviceRevenue[serviceId] = 50;
                        }
                    } else {
                        $option.removeClass('selected');
                        
                        // Set slider to zero if service is deselected
                        $slider.val(0);
                        self.state.serviceRevenue[serviceId] = 0;
                    }
                    
                    // Update selected services array
                    var selectedServices = [];
                    $('.service-checkbox:checked').each(function() {
                        selectedServices.push($(this).val());
                    });
                    self.state.selectedServices = selectedServices;
                    
                    // Refresh the value display (hidden but keeping updated)
                    $slider.closest('.slider-controls').find('.slider-value').text($slider.val());
                    
                    console.log('[Assessment] Updated selected services:', selectedServices);
                });
                
                // Handle slider changes - allow any values without auto-balancing
                $('.revenue-slider').on('input', function() {
                    var serviceId = $(this).data('service');
                    var value = parseInt($(this).val());
                    var $checkbox = $('#service-' + serviceId);
                    
                    // Auto-select or deselect service based on slider value
                    if (value > 0 && !$checkbox.is(':checked')) {
                        // If slider is moved to non-zero value, select the service
                        $checkbox.prop('checked', true);
                        $checkbox.closest('.assessment-option').addClass('selected');
                        
                        // Add to selected services array if not already there
                        if (self.state.selectedServices.indexOf(serviceId) === -1) {
                            self.state.selectedServices.push(serviceId);
                        }
                    } else if (value === 0 && $checkbox.is(':checked')) {
                        // If slider is zero, deselect the service
                        $checkbox.prop('checked', false);
                        $checkbox.closest('.assessment-option').removeClass('selected');
                        
                        // Remove from selected services array
                        var index = self.state.selectedServices.indexOf(serviceId);
                        if (index !== -1) {
                            self.state.selectedServices.splice(index, 1);
                        }
                    }
                    
                    // Update displayed value (hidden but still keeping it updated)
                    $(this).closest('.slider-controls').find('.slider-value').text(value);
                    
                    // Update state
                    self.state.serviceRevenue[serviceId] = value;
                    
                    // Show total percentage (may not be 100%)
                    self.showTotalRevenue();
                });
                
                // Handle increment/decrement buttons
                $('.slider-button').on('click', function() {
                    var serviceId = $(this).data('service');
                    var $slider = $(this).closest('.slider-controls').find('.revenue-slider');
                    var currentValue = parseInt($slider.val());
                    var newValue;
                    
                    if ($(this).hasClass('slider-decrease')) {
                        newValue = Math.max(0, currentValue - 5);
                    } else {
                        newValue = Math.min(100, currentValue + 5);
                    }
                    
                    // Update slider value
                    $slider.val(newValue).trigger('input');
                });
                
                // Initialize total revenue display
                self.showTotalRevenue();
                
                // Ensure any sliders with values > 0 have their services selected
                $('.revenue-slider').each(function() {
                    var value = parseInt($(this).val());
                    if (value > 0) {
                        var serviceId = $(this).data('service');
                        var $checkbox = $('#service-' + serviceId);
                        
                        // Check the box if not already checked
                        if (!$checkbox.is(':checked')) {
                            $checkbox.prop('checked', true);
                            $checkbox.closest('.assessment-option').addClass('selected');
                            
                            // Add to selected services if not already there
                            if (self.state.selectedServices.indexOf(serviceId) === -1) {
                                self.state.selectedServices.push(serviceId);
                            }
                        }
                    }
                });
            }, 100);
            
            return html;
        },
        
        // Redistribute revenue percentages across selected services
        redistributeRevenue: function() {
            var selectedServices = this.state.selectedServices;
            var serviceRevenue = this.state.serviceRevenue || {};
            
            // If no services selected, clear revenue
            if (selectedServices.length === 0) {
                this.state.serviceRevenue = {};
                return;
            }
            
            // Calculate total allocated percentage
            var totalAllocated = 0;
            $.each(serviceRevenue, function(serviceId, percentage) {
                totalAllocated += percentage;
            });
            
            // If no revenue allocated yet or total is 0, distribute evenly
            if (totalAllocated === 0) {
                var evenPercentage = Math.floor(100 / selectedServices.length);
                var remainder = 100 - (evenPercentage * selectedServices.length);
                
                // Distribute evenly with remainder going to first service
                for (var i = 0; i < selectedServices.length; i++) {
                    var serviceId = selectedServices[i];
                    serviceRevenue[serviceId] = evenPercentage;
                    
                    // Add remainder to first service
                    if (i === 0) {
                        serviceRevenue[serviceId] += remainder;
                    }
                }
            }
            
            // Update the sliders with new values
            var self = this;
            $('.revenue-slider').each(function() {
                var serviceId = $(this).data('service');
                var value = serviceRevenue[serviceId] || 0;
                $(this).val(value);
                $(this).closest('.slider-controls').find('.slider-value').text(value);
            });
            
            console.log('[Assessment] Redistributed revenue:', serviceRevenue);
        },
        
        // Balance sliders to ensure total is 100%
        balanceSliders: function(changedServiceId, newValue) {
            var selectedServices = this.state.selectedServices;
            var serviceRevenue = this.state.serviceRevenue;
            
            // Skip if only one service is selected
            if (selectedServices.length <= 1) {
                return;
            }
            
            // Calculate total across all services
            var total = 0;
            $.each(serviceRevenue, function(serviceId, percentage) {
                total += percentage;
            });
            
            // If total is 100%, no need to adjust
            if (total === 100) {
                return;
            }
            
            // Calculate how much we need to adjust other sliders
            var diff = total - 100;
            var servicesToAdjust = selectedServices.length - 1; // Exclude the changed service
            var adjustmentPerService = Math.floor(diff / servicesToAdjust);
            
            // Adjust other sliders proportionally
            var remainingDiff = diff;
            for (var i = 0; i < selectedServices.length; i++) {
                var serviceId = selectedServices[i];
                
                // Skip the service that was just changed
                if (serviceId === changedServiceId) {
                    continue;
                }
                
                // Calculate adjustment for this service
                var currentValue = serviceRevenue[serviceId] || 0;
                var adjustment = (i === selectedServices.length - 1) ? remainingDiff : adjustmentPerService;
                var newServiceValue = Math.max(0, currentValue - adjustment);
                
                // Update service revenue
                serviceRevenue[serviceId] = newServiceValue;
                remainingDiff -= (currentValue - newServiceValue);
                
                // Update slider UI
                $('.revenue-slider[data-service="' + serviceId + '"]')
                    .val(newServiceValue)
                    .closest('.slider-controls')
                    .find('.slider-value')
                    .text(newServiceValue);
            }
            
            console.log('[Assessment] Balanced sliders, total:', this.calculateTotalRevenue());
        },
        
        // Calculate total revenue percentage
        calculateTotalRevenue: function() {
            var serviceRevenue = this.state.serviceRevenue || {};
            var total = 0;
            
            $.each(serviceRevenue, function(serviceId, percentage) {
                total += percentage;
            });
            
            return total;
        },
        
        // Show the total revenue percentage in the UI
        showTotalRevenue: function() {
            var total = this.calculateTotalRevenue();
            var $totalDisplay = $('#revenue-total-value');
            
            if ($totalDisplay.length) {
                // Update the display with the current total
                $totalDisplay.text(total + '%');
                
                // Change color based on whether total is 100%
                if (total === 100) {
                    $totalDisplay.removeClass('warning').addClass('success');
                } else {
                    $totalDisplay.removeClass('success').addClass('warning');
                }
            }
        },
        
        // Normalize revenue values to sum to 100%
        normalizeRevenueValues: function() {
            var selectedServices = this.state.selectedServices;
            var serviceRevenue = this.state.serviceRevenue || {};
            
            // If no services selected, return
            if (selectedServices.length === 0) {
                return;
            }
            
            // Calculate current total
            var total = this.calculateTotalRevenue();
            
            // If total is already 100%, no need to normalize
            if (total === 100) {
                return;
            }
            
            // If total is 0, distribute evenly
            if (total === 0) {
                var evenPercentage = Math.floor(100 / selectedServices.length);
                var remainder = 100 - (evenPercentage * selectedServices.length);
                
                for (var i = 0; i < selectedServices.length; i++) {
                    var serviceId = selectedServices[i];
                    serviceRevenue[serviceId] = evenPercentage;
                    
                    // Add remainder to first service
                    if (i === 0) {
                        serviceRevenue[serviceId] += remainder;
                    }
                }
            } else {
                // Scale all values proportionally to sum to 100%
                var scaleFactor = 100 / total;
                
                $.each(serviceRevenue, function(serviceId, percentage) {
                    serviceRevenue[serviceId] = Math.round(percentage * scaleFactor);
                });
                
                // Handle rounding errors to ensure exact 100% total
                var newTotal = 0;
                $.each(serviceRevenue, function(serviceId, percentage) {
                    newTotal += percentage;
                });
                
                // Adjust first service to compensate for rounding
                if (newTotal !== 100 && selectedServices.length > 0) {
                    var firstServiceId = selectedServices[0];
                    serviceRevenue[firstServiceId] += (100 - newTotal);
                }
            }
            
            // Update the UI
            $.each(serviceRevenue, function(serviceId, percentage) {
                $('.revenue-slider[data-service="' + serviceId + '"]').val(percentage);
                $('.revenue-slider[data-service="' + serviceId + '"]')
                    .closest('.slider-controls')
                    .find('.slider-value')
                    .text(percentage);
            });
            
            this.showTotalRevenue();
        },
        
        // Revenue allocation functionality is now integrated into the services step
        
        // Render revenue input step
        renderRevenueStep: function() {
            var html = '<h2 class="assessment-step-title">Annual Revenue</h2>';
            html += '<p class="assessment-step-description">Please indicate your agency\'s approximate annual revenue:</p>';
            
            html += '<div class="assessment-range-container">';
            html += '<div class="assessment-range-value">$' + this.formatNumber(this.state.revenue) + '</div>';
            html += '<input type="range" min="0" max="10000000" step="100000" value="' + this.state.revenue + '" class="assessment-range" id="revenue-slider">';
            html += '<div class="assessment-range-labels">';
            html += '<span class="assessment-range-label">$0</span>';
            html += '<span class="assessment-range-label">$5M</span>';
            html += '<span class="assessment-range-label">$10M+</span>';
            html += '</div>';
            html += '</div>';
            
            // Navigation
            html += this.renderNavigation(true, true);
            
            return html;
        },
        
        // Render questions step
        renderQuestionsStep: function() {
            // Load questions if needed
            var questions = this.getQuestionsForSelectedServices();
            this.state.filteredQuestions = questions;
            
            var html = '<h2 class="assessment-step-title">Assessment Questions</h2>';
            html += '<p class="assessment-step-description">Please answer the following questions about your agency:</p>';
            
            if (!questions || questions.length === 0) {
                html += '<p>No questions available for the selected services. Please go back and select at least one service.</p>';
                html += this.renderNavigation(true, false);
                return html;
            }
            
            // Make sure current question index is valid
            if (this.state.currentQuestionIndex >= questions.length) {
                this.state.currentQuestionIndex = 0;
            }
            
            // Get current question
            var currentQuestion = questions[this.state.currentQuestionIndex];
            
            // Handle case where currentQuestion might be undefined
            if (!currentQuestion) {
                console.error('[Assessment] Current question is undefined. Index:', this.state.currentQuestionIndex, 'Total questions:', questions.length);
                this.state.currentQuestionIndex = 0;
                currentQuestion = questions[0];
                
                // If still no valid question, show error
                if (!currentQuestion) {
                    html += '<p>Error loading questions. Please try again.</p>';
                    html += this.renderNavigation(true, false);
                    return html;
                }
            }
            
            var totalQuestions = questions.length;
            var questionNumber = this.state.currentQuestionIndex + 1;
            
            // Get dimension name (with safeguard)
            var dimensionName = currentQuestion.dimension ? this.formatDimensionName(currentQuestion.dimension) : 'General';
            
            html += '<div class="assessment-questions">';
            
            // Add question content
            html += '<div class="assessment-question-progress">Question ' + questionNumber + ' of ' + totalQuestions + '</div>';
            html += '<div class="assessment-question-dimension">' + dimensionName + '</div>';
            
            html += '<div class="assessment-single-question">';
            html += '<div class="assessment-question-text">' + (currentQuestion.question || currentQuestion.text || 'No question text available') + '</div>';
            html += '<div class="assessment-question-options">';
            
            var self = this;
            var isAnswered = currentQuestion.id && self.state.answers[currentQuestion.id] !== undefined;
            
            // Make sure options exist
            if (currentQuestion.options && Array.isArray(currentQuestion.options)) {
                currentQuestion.options.forEach(function(option) {
                    if (!option) return; // Skip invalid options
                    
                    var isSelected = currentQuestion.id && self.state.answers[currentQuestion.id] === option.score;
                    html += '<div class="assessment-option ' + (isSelected ? 'assessment-option-selected' : '') + '" data-question-id="' + currentQuestion.id + '" data-option-value="' + option.score + '">';
                    html += '<div class="assessment-option-radio"><div class="assessment-option-radio-inner ' + (isSelected ? 'selected' : '') + '"></div></div>';
                    html += '<div class="assessment-option-text">' + (option.text || 'No option text') + '</div>';
                    html += '</div>';
                });
            } else {
                // Fallback if no options are available
                html += '<div class="assessment-option">No options available for this question</div>';
            }
            
            html += '</div>'; // End options
            html += '</div>'; // End single question
            
            // Show navigation - we only show next/prev if needed
            var showPrev = this.state.currentQuestionIndex > 0;
            var showNext = isAnswered;
            
            // If this is the last question, next button text should be "Continue"
            var nextText = this.state.currentQuestionIndex === questions.length - 1 ? 'Continue to Email' : 'Next Question';
            
            html += this.renderNavigation(showPrev, showNext, nextText);
            
            return html;
        },
        
        // Render email collection step
        renderEmailStep: function() {
            var html = '<h2 class="assessment-step-title">Contact Information</h2>';
            html += '<p class="assessment-step-description">Please provide your contact information to receive your assessment results:</p>';
            
            html += '<div class="assessment-form">';
            
            html += '<div class="assessment-form-group">';
            html += '<label class="assessment-form-label" for="name">Your Name</label>';
            html += '<input type="text" id="name" class="assessment-form-input" value="' + this.state.name + '" placeholder="Jane Doe">';
            html += '</div>';
            
            html += '<div class="assessment-form-group">';
            html += '<label class="assessment-form-label" for="email">Email Address <span class="required">*</span></label>';
            html += '<input type="email" id="email" class="assessment-form-input" value="' + this.state.email + '" placeholder="jane@example.com">';
            html += '<div class="assessment-form-error" id="email-error" style="display: none;">Please enter a valid email address.</div>';
            html += '</div>';
            
            html += '</div>';
            
            // Navigation
            html += this.renderNavigation(true, true, 'View Results');
            
            return html;
        },
        
        // Render results step
        renderResultsStep: function() {
            // Calculate results if not already done
            if (!this.state.results) {
                this.state.results = this.calculateResults();
            }
            
            var results = this.state.results;
            var html = '<div class="assessment-results">';
            
            // Header with enhanced styling
            html += '<div class="assessment-results-header">';
            html += '<h2 class="assessment-results-title">Your Assessment Results</h2>';
            
            // Get agency type name
            var agencyTypeName = '';
            if (this.state.selectedAgencyType && this.config.agencyTypes) {
                for (var i = 0; i < this.config.agencyTypes.length; i++) {
                    if (this.config.agencyTypes[i].id === this.state.selectedAgencyType) {
                        agencyTypeName = this.config.agencyTypes[i].name;
                        break;
                    }
                }
            }
            
            if (agencyTypeName) {
                html += '<div class="assessment-results-agency-type">Agency Type: ' + agencyTypeName + '</div>';
            }
            
            html += '</div>';
            
            // Overall score section
            html += '<div class="assessment-results-summary">';
            html += '<div class="assessment-results-overall">';
            html += '<div class="assessment-results-overall-label">Overall Score</div>';
            html += '<div class="assessment-results-overall-score">' + Math.round(results.scores.overall) + '/100</div>';
            html += '</div>';
            
            // Risk category
            if (results.scoreCategory) {
                var riskClass = '';
                switch (results.scoreCategory) {
                    case 'LOW RISK':
                        riskClass = 'low-risk';
                        break;
                    case 'MODERATE RISK':
                        riskClass = 'moderate-risk';
                        break;
                    case 'HIGH RISK':
                        riskClass = 'high-risk';
                        break;
                }
                
                html += '<div class="assessment-results-risk ' + riskClass + '">';
                html += '<div class="assessment-results-risk-label">Risk Category</div>';
                html += '<div class="assessment-results-risk-level">' + results.scoreCategory + '</div>';
                html += '</div>';
            }
            
            // Valuation range
            if (results.valuationRange) {
                html += '<div class="assessment-results-valuation">';
                html += '<div class="assessment-results-valuation-label">EBITDA Valuation Range</div>';
                html += '<div class="assessment-results-valuation-range">' + results.valuationRange + '</div>';
                html += '</div>';
            }
            
            html += '</div>'; // End assessment-results-summary
            // Add Valuation Dashboard if available (new M&A focused dashboard)
            if (typeof ValuationDashboard !== 'undefined') {
                try {
                    console.log('[Assessment] Generating valuation dashboard...');
                    var dashboardData = ValuationDashboard.generateDashboard(results, this.config);
                    html += dashboardData.html;
                } catch (error) {
                    console.error('[Assessment] Error generating valuation dashboard:', error);
                }
            }
            // Fallback to older valuation report if dashboard not available
            else if (typeof ValuationReport !== 'undefined') {
                try {
                    var reportData = ValuationReport.generateReport(results, this.config);
                    html += reportData.html;
                    html += reportData.driversHTML;
                } catch (error) {
                    console.error('[Assessment] Error generating valuation report:', error);
                }
            }
            
            // Key Insights with improved styling
            if (results.insights && results.insights.length > 0) {
                html += '<div class="key-insights-section">';
                html += '<h3 class="assessment-results-section-title"><span class="diamond-icon">◆</span> KEY INSIGHTS</h3>';
                html += '<ul class="assessment-results-insights">';
                
                for (var i = 0; i < results.insights.length; i++) {
                    html += '<li class="assessment-results-insight"><strong>' + results.insights[i] + '</strong></li>';
                }
                
                html += '</ul>';
                html += '</div>';
                
                // Add CSS styles directly for the insights section
                html += '<style>';
                html += '.key-insights-section { margin: 30px 0; padding: 20px; background-color: #141414; border: 1px solid #333; border-radius: 8px; }';
                html += '.key-insights-section .assessment-results-section-title { color: #ffff66; font-size: 22px; font-weight: bold; margin-bottom: 20px; letter-spacing: 1px; }';
                html += '.diamond-icon { color: #ffff66; margin-right: 10px; }';
                html += '.assessment-results-insights { list-style-type: none; padding: 0; }';
                html += '.assessment-results-insight { margin-bottom: 12px; color: #f0f0f0; font-size: 16px; padding-left: 15px; position: relative; }';
                html += '.assessment-results-insight:before { content: "•"; color: #ffff66; position: absolute; left: 0; }';
                html += '</style>';
            }
            
            // Assessment Breakdown section (removed radar chart as requested)
            html += '<div class="assessment-breakdown">';
            html += '<h3 class="assessment-results-section-title"><span class="diamond-icon">◆</span> ASSESSMENT BREAKDOWN</h3>';
            
            // Assessment dimensions in a clean modern format
            html += '<div class="assessment-dimension-cards">';
            
            // Operational dimension
            html += '<div class="assessment-dimension-card">';
            html += '<div class="dimension-header operational-header">Operational</div>';
            html += '<div class="dimension-score-large">' + Math.round(results.scores.operational) + '</div>';
            html += '<div class="dimension-max">/100</div>';
            html += '</div>';
            
            // Financial dimension
            html += '<div class="assessment-dimension-card">';
            html += '<div class="dimension-header financial-header">Financial</div>';
            html += '<div class="dimension-score-large">' + Math.round(results.scores.financial) + '</div>';
            html += '<div class="dimension-max">/100</div>';
            html += '</div>';
            
            // AI Readiness dimension
            html += '<div class="assessment-dimension-card">';
            html += '<div class="dimension-header ai-header">AI Readiness</div>';
            html += '<div class="dimension-score-large">' + Math.round(results.scores.aiReadiness) + '</div>';
            html += '<div class="dimension-max">/100</div>';
            html += '</div>';
            
            html += '</div>'; // Close assessment-dimension-cards
            
            // Add CSS styles for the assessment breakdown
            html += '<style>';
            html += '.assessment-breakdown { margin: 30px 0; padding: 20px; background-color: #141414; border: 1px solid #333; border-radius: 8px; }';
            html += '.assessment-breakdown .assessment-results-section-title { color: #ffff66; font-size: 22px; font-weight: bold; margin-bottom: 20px; letter-spacing: 1px; }';
            html += '.assessment-dimension-cards { display: flex; justify-content: space-between; gap: 20px; margin-top: 20px; }';
            html += '.assessment-dimension-card { flex: 1; background-color: #1a1a1a; border-radius: 8px; padding: 20px; text-align: center; }';
            html += '.dimension-header { font-size: 18px; font-weight: bold; margin-bottom: 15px; }';
            html += '.operational-header { color: #5ac8fa; }';
            html += '.financial-header { color: #4cd964; }';
            html += '.ai-header { color: #ff9500; }';
            html += '.dimension-score-large { font-size: 48px; font-weight: bold; color: #ffffff; }';
            html += '.dimension-max { color: #999999; font-size: 16px; margin-top: 5px; }';
            html += '</style>';
            
            html += '</div>'; // Close assessment-breakdown
            
            // Actions
            html += '<div class="assessment-results-actions">';
            html += '<button class="assessment-button assessment-button-secondary" id="print-results">Print Results</button>';
            html += '<button class="assessment-button assessment-button-secondary" id="download-results">Download Results</button>';
            html += '<button class="assessment-button assessment-button-secondary" id="save-to-notion">Save to Database</button>';
            html += '<button class="assessment-button assessment-button-primary" id="restart-assessment">Start New Assessment</button>';
            html += '</div>';
            
            html += '</div>'; // Close assessment-results div
            
            // After a slight delay, initialize the charts and calculations
            var self = this;
            setTimeout(function() {
                try {
                    // First initialize charts
                    self.initializeCharts();
                    
                    // Then initialize Revenue Risk Calculator
                    if (window.AssessmentFramework && 
                        window.AssessmentFramework.Components && 
                        window.AssessmentFramework.Components.Results && 
                        window.AssessmentFramework.Components.Results.RevenueRiskCalculator) {
                        
                        var container = document.getElementById('revenue-risk-container');
                        if (container) {
                            console.log('[Assessment] Initializing Revenue Risk Calculator');
                            
                            // Get services from the config
                            var services = self.config.services || [];
                            
                            // Create the calculator instance safely
                            try {
                                new window.AssessmentFramework.Components.Results.RevenueRiskCalculator(
                                    container,
                                    services,
                                    self.state.results.serviceScores,
                                    self.state.serviceRevenue,
                                    self.state.revenue
                                );
                            } catch (calculatorError) {
                                console.error('[Assessment] Error initializing Revenue Risk Calculator:', calculatorError);
                                // Don't let calculator errors break the whole app
                            }
                        }
                    }
                } catch (error) {
                    console.error('[Assessment] Error during results initialization:', error);
                    // Ensure errors are caught and logged rather than breaking the UI
                }
            }, 100);
            
            return html;
        },
        
        // Render navigation buttons
        renderNavigation: function(showPrev, showNext, nextText) {
            var html = '<div class="assessment-navigation">';
            
            if (showPrev) {
                html += '<button class="assessment-button assessment-button-secondary" id="prev-step">Previous</button>';
            } else {
                html += '<div></div>'; // Empty div for spacing
            }
            
            if (showNext) {
                html += '<button class="assessment-button assessment-button-primary" id="next-step">' + (nextText || 'Next') + '</button>';
            }
            
            html += '</div>';
            
            return html;
        },
        
        // Set up event listeners
        setupEventListeners: function() {
            var self = this;
            var $container = $(this.container);
            
            // Agency type selection
            $container.on('click', '.assessment-option[data-agency-type]', function() {
                var agencyType = $(this).data('agency-type');
                self.state.selectedAgencyType = agencyType;
                
                // Update UI
                $container.find('.assessment-option[data-agency-type]').removeClass('assessment-option-selected');
                $(this).addClass('assessment-option-selected');
                $(this).find('input').prop('checked', true);
            });
            
            // Service selection
            $container.on('click', '.assessment-option[data-service]', function() {
                var service = $(this).data('service');
                var index = self.state.selectedServices.indexOf(service);
                
                if (index === -1) {
                    self.state.selectedServices.push(service);
                    $(this).addClass('assessment-option-selected');
                    $(this).find('input').prop('checked', true);
                } else {
                    self.state.selectedServices.splice(index, 1);
                    $(this).removeClass('assessment-option-selected');
                    $(this).find('input').prop('checked', false);
                }
            });
            
            // Revenue slider
            $container.on('input', '#revenue-slider', function() {
                var value = parseInt($(this).val());
                self.state.revenue = value;
                $container.find('.assessment-range-value').text('$' + self.formatNumber(value));
            });
            
            // Question answers - with auto-advancement
            $container.on('click', '.assessment-option[data-question-id]', function() {
                var questionId = $(this).data('question-id');
                var value = $(this).data('option-value');
                
                console.log('[Assessment] Question answered:', questionId, 'with value:', value);
                self.state.answers[questionId] = value;
                
                // Update UI
                $container.find('.assessment-option[data-question-id="' + questionId + '"]').removeClass('assessment-option-selected');
                $(this).addClass('assessment-option-selected');
                $(this).find('input').prop('checked', true);
                
                // Auto-advance to next question after a short delay
                if (self.state.currentStep === 'questions') {
                    setTimeout(function() {
                        console.log('[Assessment] Checking for next question:', 
                            self.state.currentQuestionIndex, 'of', self.state.filteredQuestions.length - 1);
                        
                        // Only advance if we have filteredQuestions and are not at the end
                        if (self.state.filteredQuestions && 
                            self.state.filteredQuestions.length > 0 && 
                            self.state.currentQuestionIndex < self.state.filteredQuestions.length - 1) {
                            
                            self.state.currentQuestionIndex++;
                            console.log('[Assessment] Moving to next question:', self.state.currentQuestionIndex);
                            self.renderCurrentStep();
                        } else if (self.state.filteredQuestions && 
                                  self.state.currentQuestionIndex >= self.state.filteredQuestions.length - 1) {
                            // Only move to next step if we've answered all questions
                            console.log('[Assessment] All questions answered, moving to next step');
                            self.nextStep();
                        }
                    }, 500); // 500ms delay for visual feedback
                }
            });
            
            // Name and email inputs
            $container.on('change', '#name', function() {
                self.state.name = $(this).val();
            });
            
            $container.on('change', '#email', function() {
                self.state.email = $(this).val();
                
                // Hide error when changing email
                $('#email-error').hide();
            });
            
            // Navigation buttons
            $container.on('click', '#prev-step', function() {
                self.previousStep();
            });
            
            $container.on('click', '#next-step', function() {
                // If we're on the services step, normalize revenue values before proceeding
                if (self.state.currentStep === 'services' && self.state.selectedServices.length > 0) {
                    self.normalizeRevenueValues();
                }
                self.nextStep();
            });
            
            // Results actions
            $container.on('click', '#print-results', function() {
                window.print();
            });
            
            $container.on('click', '#download-results', function() {
                self.downloadResults();
            });
            
            $container.on('click', '#save-to-notion', function() {
                self.sendResultsToNotion();
            });
            
            $container.on('click', '#restart-assessment', function() {
                self.resetAssessment();
            });
        },
        
        // Navigate to the previous step
        previousStep: function() {
            // If we're on the questions step and not at the first question, go to previous question
            if (this.state.currentStep === 'questions' && this.state.currentQuestionIndex > 0) {
                this.state.currentQuestionIndex--;
                this.renderCurrentStep();
                return;
            }
            
            // Otherwise, go to previous step
            var currentIndex = this.config.steps.indexOf(this.state.currentStep);
            if (currentIndex > 0) {
                this.state.currentStep = this.config.steps[currentIndex - 1];
                this.renderCurrentStep();
            }
        },
        
        // Navigate to the next step
        nextStep: function() {
            // Validate the current step
            if (!this.validateCurrentStep()) {
                return;
            }
            
            // If we're on the questions step and not at the last question, go to next question
            if (this.state.currentStep === 'questions' && this.state.currentQuestionIndex < this.state.filteredQuestions.length - 1) {
                this.state.currentQuestionIndex++;
                this.renderCurrentStep();
                return;
            }
            
            // If we're moving to results, calculate results
            var currentIndex = this.config.steps.indexOf(this.state.currentStep);
            var nextStep = this.config.steps[currentIndex + 1];
            
            if (nextStep === 'results') {
                this.state.results = this.calculateResults();
                console.log('[Assessment] Final results:', this.state.results);
            }
            
            // Move to the next step
            if (currentIndex < this.config.steps.length - 1) {
                this.state.currentStep = nextStep;
                this.renderCurrentStep();
                
                // Scroll to top on step change
                window.scrollTo(0, 0);
            }
        },
        
        // Validate the current step
        validateCurrentStep: function() {
            switch (this.state.currentStep) {
                case 'agency-type':
                    if (!this.state.selectedAgencyType) {
                        alert('Please select an agency type.');
                        return false;
                    }
                    break;
                    
                case 'services':
                    // Check if any services are selected (either via checkbox or slider)
                    var hasSelectedServices = false;
                    
                    // First check the selected services array
                    if (this.state.selectedServices.length > 0) {
                        hasSelectedServices = true;
                    } else {
                        // Also check if any services have a slider value > 0
                        var self = this;
                        if (this.state.serviceRevenue) {
                            $.each(this.state.serviceRevenue, function(serviceId, value) {
                                if (value > 0) {
                                    // Add this service to selected services if it has a slider value
                                    if (self.state.selectedServices.indexOf(serviceId) === -1) {
                                        self.state.selectedServices.push(serviceId);
                                    }
                                    hasSelectedServices = true;
                                }
                            });
                        }
                    }
                    
                    if (!hasSelectedServices) {
                        alert('Please select at least one service.');
                        return false;
                    }
                    break;
                    
                case 'email':
                    if (!this.validateEmail(this.state.email)) {
                        $('#email-error').show();
                        return false;
                    }
                    break;
            }
            
            return true;
        },
        
        // Reset the assessment
        resetAssessment: function() {
            this.state = {
                currentStep: this.config.steps[0],
                answers: {},
                selectedAgencyType: null,
                selectedServices: [],
                revenue: 0,
                email: '',
                name: '',
                results: null
            };
            
            this.renderCurrentStep();
        },
        
        // Get questions for selected services
        getQuestionsForSelectedServices: function() {
            var questions = [];
            console.log('[Assessment] Config:', this.config);
            
            try {
                // Add core questions
                if (this.config.questions && this.config.questions.core) {
                    console.log('[Assessment] Adding core questions:', this.config.questions.core.length);
                    questions = questions.concat(this.config.questions.core);
                } else {
                    console.warn('[Assessment] No core questions found in config');
                }
                
                // Add service-specific questions for selected services
                if (this.config.questions && this.config.questions.serviceSpecific) {
                    var self = this;
                    this.state.selectedServices.forEach(function(serviceId) {
                        if (self.config.questions.serviceSpecific[serviceId]) {
                            console.log('[Assessment] Adding questions for service:', serviceId, self.config.questions.serviceSpecific[serviceId].length);
                            questions = questions.concat(self.config.questions.serviceSpecific[serviceId]);
                        } else {
                            console.warn('[Assessment] No questions found for service:', serviceId);
                        }
                    });
                }
                
                // Validate question format
                questions = questions.map(function(q) {
                    // Ensure question has text property (for backward compatibility)
                    if (!q.text && q.question) {
                        q.text = q.question;
                    }
                    // Ensure question has question property (for forward compatibility)
                    if (!q.question && q.text) {
                        q.question = q.text;
                    }
                    return q;
                });
                
                console.log('[Assessment] Total questions loaded:', questions.length);
                return questions;
            } catch (e) {
                console.error('[Assessment] Error loading questions:', e);
                return [];
            }
        },
        
        // Calculate results using the EnhancedWeightedScoring system
        calculateResults: function() {
            console.log('[Assessment] Calculating results...');
            
            try {
                // Check if EnhancedWeightedScoring is available
                if (typeof EnhancedWeightedScoring === 'undefined') {
                    console.error('[Assessment] EnhancedWeightedScoring not found');
                    return this.getFallbackResults();
                }
                
                // Create assessment data object for scoring system
                var assessmentData = {
                    answers: this.state.answers,
                    selectedServices: this.state.selectedServices,
                    revenue: this.state.revenue,
                    email: this.state.email,
                    name: this.state.name
                };
                
                // Initialize scoring system
                var scoringSystem = new EnhancedWeightedScoring(this.config, 'agency');
                
                // Calculate results using scoring system
                var scoringResults = scoringSystem.calculateResults(assessmentData, this.state.selectedAgencyType);
                
                console.log('[Assessment] Raw scoring results:', scoringResults);
                
                // Calculate financial impact based on scores and revenue
                var financialImpact = this.calculateFinancialImpact(scoringResults.scores.overall, scoringResults.scores);
                
                // Transform results to expected format for rendering
                var formattedResults = {
                    scores: scoringResults.scores,
                    recommendations: scoringResults.recommendations || [],
                    insights: scoringResults.insights || [],
                    actionPlan: scoringResults.actionPlan || [],
                    vulnerabilityLevel: scoringResults.vulnerabilityLevel || 'Moderate Vulnerability',
                    selectedServices: this.state.selectedServices,
                    selectedAgencyType: this.state.selectedAgencyType,
                    email: this.state.email,
                    name: this.state.name,
                    revenue: this.state.revenue,
                    answers: this.state.answers,
                    timestamp: new Date().toISOString(),
                    financialImpact: financialImpact
                };
                
                console.log('[Assessment] Formatted results:', formattedResults);
                return formattedResults;
                
            } catch (error) {
                console.error('[Assessment] Error calculating results:', error);
                return this.getFallbackResults();
            }
        },
        
        // Fallback results when calculation fails
        getFallbackResults: function() {
            return {
                scores: {
                    overall: 50,
                    operational: 50,
                    financial: 50,
                    ai: 50,
                    strategic: 50
                },
                recommendations: [{
                    title: "Assessment Error",
                    text: "There was an error processing your assessment. Please try again."
                }],
                insights: ["Assessment calculation error - please try again"],
                actionPlan: [],
                vulnerabilityLevel: "Assessment Error",
                selectedServices: this.state.selectedServices,
                selectedAgencyType: this.state.selectedAgencyType
            };
        },
        
        // Calculate financial impact based on assessment scores
        calculateFinancialImpact: function(overallScore, dimensionScores) {
            var revenue = parseFloat(this.state.revenue) || 1000000; // Default to $1M if not provided
            
            // Calculate potential EBIT impact
            // The lower the score, the higher the potential improvement (up to 30%)
            var potentialImprovement = Math.max(0, 100 - overallScore) / 100;
            var ebitImpactPercentage = potentialImprovement * 0.3; // Max 30% improvement
            
            // Assume 15% base EBIT margin for calculation purposes
            var baseEbitMargin = 0.15;
            var currentEbit = revenue * baseEbitMargin;
            var potentialEbit = currentEbit * (1 + ebitImpactPercentage);
            var ebitImpact = Math.round(potentialEbit - currentEbit);
            
            // Calculate valuation impact (using 5x EBIT multiple)
            var ebitMultiple = 5;
            var currentValuation = currentEbit * ebitMultiple;
            var potentialValuation = potentialEbit * ebitMultiple;
            var valuationImpact = Math.round(potentialValuation - currentValuation);
            
            return {
                ebitImpact: ebitImpact,
                ebitImpactPercentage: Math.round(ebitImpactPercentage * 100),
                valuationImpact: valuationImpact,
                valuationImpactPercentage: Math.round(ebitImpactPercentage * 100)
            };
        },
        
        // Download results as JSON file
        downloadResults: function() {
            if (!this.state.results) {
                return;
            }
            
            var dataStr = JSON.stringify(this.state.results, null, 2);
            var dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
            
            var downloadLink = document.createElement('a');
            downloadLink.setAttribute('href', dataUri);
            downloadLink.setAttribute('download', 'assessment-results.json');
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        },
        
        // Send results to Notion database
        sendResultsToNotion: function() {
            if (!this.state.results) {
                return;
            }
            
            console.log('[Assessment] Sending results to Notion...');
            
            // Prepare data for Notion
            var notionData = {
                assessmentId: this.generateUniqueId(),
                timestamp: new Date().toISOString(),
                agencyType: this.getAgencyTypeName() || 'Unknown',
                services: this.state.selectedServices.join(', ') || 'None',
                overallScore: this.state.results.scores.overall,
                operationalScore: this.state.results.scores.operational,
                financialScore: this.state.results.scores.financial,
                aiScore: this.state.results.scores.ai,
                strategicScore: this.state.results.scores.strategic,
                email: this.state.email || 'Not provided',
                name: this.state.name || 'Anonymous',
                revenue: this.state.revenue || 0,
                vulnerabilityLevel: this.state.results.vulnerabilityLevel || 'Moderate',
                recommendations: JSON.stringify(this.state.results.recommendations),
                actionPlan: JSON.stringify(this.state.results.actionPlan),
                insights: JSON.stringify(this.state.results.insights),
                answers: JSON.stringify(this.state.answers)
            };
            
            console.log('[Assessment] Notion data:', notionData);
            
            // Check if we're in demo mode (localhost, file://, or missing WordPress)
            var isDemoMode = window.location.hostname === 'localhost' || 
                            window.location.hostname === '127.0.0.1' || 
                            window.location.protocol === 'file:' ||
                            window.location.pathname.indexOf('demo.html') !== -1;
            
            if (isDemoMode) {
                // Simulate success for demo environment
                console.log('[Assessment] Using demo mode for Notion save');
                setTimeout(function() {
                    console.log('[Assessment] Simulated Notion save success');
                    alert('Results saved to database successfully!\n\nNote: This is a demo environment, so results are not actually saved to Notion.');
                }, 1000);
                return;
            }
            
            // For production WordPress environment
            $.ajax({
                url: '/wp-json/agency-assessment/v1/notion-save',
                method: 'POST',
                data: JSON.stringify(notionData),
                contentType: 'application/json',
                success: function(response) {
                    console.log('[Assessment] Notion save success:', response);
                    alert('Results saved to Notion successfully!');
                },
                error: function(error) {
                    console.error('[Assessment] Notion save error:', error);
                    alert('Error saving to Notion. Using demo mode fallback.');
                    
                    // Fallback to demo mode on error
                    setTimeout(function() {
                        alert('Results saved to database successfully!\n\nNote: This is using the demo fallback mode.');
                    }, 1000);
                }
            });
        },
        
        // Generate a unique ID for assessment records
        generateUniqueId: function() {
            return 'assessment-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now();
        },
        
        // Helper methods
        formatNumber: function(num) {
            return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        },
        
        // Initialize charts and EBIT calculations after rendering results
        initializeCharts: function() {
            console.log('[Assessment] Initializing charts and calculations...');
            
            // Check for required dependencies
            if (!this.state.results || typeof Chart === 'undefined') {
                console.error('[Assessment] Charts not initialized - missing results or Chart.js');
                return;
            }
            
            try {
                // Get the canvas element
                const radarCanvas = document.getElementById('radarChart');
                if (!radarCanvas) {
                    console.error('[Assessment] Radar chart canvas not found');
                    return;
                }
                
                // Check for existing chart and destroy it
                if (window.radarChartInstance) {
                    window.radarChartInstance.destroy();
                }
                
                // Get the scores
                const scores = this.state.results.scores;
                
                // Prepare data for radar chart
                const radarData = {
                    labels: ['Operational', 'Financial', 'AI Readiness'],
                    datasets: [{
                        label: 'Your Agency',
                        data: [
                            scores.operational || 0,
                            scores.financial || 0,
                            scores.aiReadiness || 0
                        ],
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }]
                };
                
                // Enhanced radar chart options
                const radarOptions = {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                },
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: {
                                size: 16,
                                weight: 'bold'
                            },
                            bodyFont: {
                                size: 14
                            },
                            padding: 12,
                            cornerRadius: 6
                        }
                    },
                    scales: {
                        r: {
                            angleLines: {
                                color: 'rgba(150, 150, 150, 0.3)',
                                lineWidth: 1
                            },
                            grid: {
                                color: 'rgba(150, 150, 150, 0.2)',
                            },
                            pointLabels: {
                                font: {
                                    size: 14,
                                    weight: 'bold'
                                },
                                color: '#333'
                            },
                            ticks: {
                                beginAtZero: true,
                                max: 100,
                                stepSize: 20,
                                backdropColor: 'transparent',
                                color: '#666',
                                font: {
                                    size: 10
                                }
                            },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    }
                };
                
                // Create the radar chart
                window.radarChartInstance = new Chart(radarCanvas, {
                    type: 'radar',
                    data: radarData,
                    options: radarOptions
                });
                
                // Calculate EBIT impact if ValuationInsights is available
                if (typeof ValuationInsights !== 'undefined') {
                    console.log('[Assessment] Calculating EBIT impact...');
                    
                    try {
                        const valuationData = {
                            revenue: this.state.revenue,
                            scores: scores
                        };
                        
                        const insights = ValuationInsights.calculateInsights(valuationData);
                        
                        // Display EBIT impact
                        $('#ebit-impact-value').text(insights.ebitImpact + '%');
                        $('#valuation-impact-value').text('$' + this.formatNumber(insights.valuationImpact));
                        
                        // Show EBIT section
                        $('.assessment-results-ebit').show();
                    } catch (error) {
                        console.error('[Assessment] Error calculating valuation insights:', error);
                    }
                }
            } catch (error) {
                console.error('[Assessment] Error initializing charts:', error);
            }
        },
        
        // Get the display name of the selected agency type
        getAgencyTypeName: function() {
            if (!this.state.selectedAgencyType || !this.config.agencyTypes) {
                return '';
            }
            
            for (var i = 0; i < this.config.agencyTypes.length; i++) {
                if (this.config.agencyTypes[i].id === this.state.selectedAgencyType) {
                    return this.config.agencyTypes[i].name;
                }
            }
            
            return '';
        },
        
        formatDimensionName: function(dimension) {
            if (!dimension) return '';
            
            // Check if dimension is in config
            if (this.config.scoring && this.config.scoring.dimensions) {
                for (var i = 0; i < this.config.scoring.dimensions.length; i++) {
                    if (this.config.scoring.dimensions[i].id === dimension) {
                        return this.config.scoring.dimensions[i].name;
                    }
                }
            }
            
            // Default formatting
            return dimension.charAt(0).toUpperCase() + dimension.slice(1).replace(/_/g, ' ');
        },
        
        // Format currency values for display
        formatCurrency: function(value) {
            if (value === undefined || value === null) {
                return '$0';
            }
            
            // Convert to number if it's a string
            var amount = typeof value === 'string' ? parseFloat(value) : value;
            
            // Format with $ and commas
            return '$' + amount.toLocaleString('en-US', {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            });
        },
        
        validateEmail: function(email) {
            var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        }
    };
    
    // Initialize the assessment when DOM is ready
    $(document).ready(function() {
        // Check if the config is available
        if (typeof AgencyAssessmentConfig !== 'undefined') {
            // Find all assessment containers
            $('.agency-assessment-wrapper').each(function() {
                var config = JSON.parse(AgencyAssessmentConfig.config);
                new AgencyAssessment(config, this);
            });
        }
    });
    
})(jQuery);
