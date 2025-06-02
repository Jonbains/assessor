/**
 * Assessment Framework - Form Components
 * 
 * Reusable form elements for assessment interfaces
 */

/**
 * Render a text input field
 * @param {Object} options - Configuration options
 * @param {String} options.id - Input ID
 * @param {String} options.name - Input name
 * @param {String} options.label - Input label
 * @param {String} options.value - Current value
 * @param {String} options.placeholder - Placeholder text
 * @param {Boolean} options.required - Whether the field is required
 * @param {String} options.error - Error message to display
 * @param {Function} options.onChange - Change event handler
 * @return {String} - HTML for the text input
 */
export function renderTextInput(options) {
    const {
        id = '',
        name = id,
        label = '',
        value = '',
        placeholder = '',
        required = false,
        error = '',
        className = '',
        type = 'text'
    } = options;
    
    const errorClass = error ? 'has-error' : '';
    
    return `
        <div class="form-group ${errorClass} ${className}">
            ${label ? `<label for="${id}">${label}${required ? ' *' : ''}</label>` : ''}
            <input 
                type="${type}" 
                id="${id}" 
                name="${name}" 
                class="form-control" 
                value="${value}" 
                placeholder="${placeholder}"
                ${required ? 'required' : ''}
            >
            ${error ? `<div class="error-message">${error}</div>` : ''}
        </div>
    `;
}

/**
 * Render a number input field
 * @param {Object} options - Configuration options with same properties as textInput
 * @param {Number} options.min - Minimum value
 * @param {Number} options.max - Maximum value
 * @param {Number} options.step - Step increment
 * @return {String} - HTML for the number input
 */
export function renderNumberInput(options) {
    const {
        id = '',
        name = id,
        label = '',
        value = '',
        min = '',
        max = '',
        step = '1',
        required = false,
        error = '',
        className = ''
    } = options;
    
    const errorClass = error ? 'has-error' : '';
    
    return `
        <div class="form-group ${errorClass} ${className}">
            ${label ? `<label for="${id}">${label}${required ? ' *' : ''}</label>` : ''}
            <input 
                type="number" 
                id="${id}" 
                name="${name}" 
                class="form-control" 
                value="${value}"
                ${min !== '' ? `min="${min}"` : ''}
                ${max !== '' ? `max="${max}"` : ''}
                step="${step}"
                ${required ? 'required' : ''}
            >
            ${error ? `<div class="error-message">${error}</div>` : ''}
        </div>
    `;
}

/**
 * Render a textarea field
 * @param {Object} options - Configuration options similar to textInput
 * @param {Number} options.rows - Number of rows
 * @return {String} - HTML for the textarea
 */
export function renderTextarea(options) {
    const {
        id = '',
        name = id,
        label = '',
        value = '',
        placeholder = '',
        rows = 4,
        required = false,
        error = '',
        className = ''
    } = options;
    
    const errorClass = error ? 'has-error' : '';
    
    return `
        <div class="form-group ${errorClass} ${className}">
            ${label ? `<label for="${id}">${label}${required ? ' *' : ''}</label>` : ''}
            <textarea 
                id="${id}" 
                name="${name}" 
                class="form-control" 
                rows="${rows}" 
                placeholder="${placeholder}"
                ${required ? 'required' : ''}
            >${value}</textarea>
            ${error ? `<div class="error-message">${error}</div>` : ''}
        </div>
    `;
}

/**
 * Render a select dropdown
 * @param {Object} options - Configuration options
 * @param {String} options.id - Select ID
 * @param {String} options.name - Select name
 * @param {String} options.label - Select label
 * @param {String} options.value - Current selected value
 * @param {Array} options.options - Array of {value, text} objects
 * @param {Boolean} options.required - Whether the field is required
 * @param {String} options.error - Error message to display
 * @return {String} - HTML for the select dropdown
 */
export function renderSelect(options) {
    const {
        id = '',
        name = id,
        label = '',
        value = '',
        options: selectOptions = [],
        required = false,
        error = '',
        className = ''
    } = options;
    
    const errorClass = error ? 'has-error' : '';
    
    let optionsHtml = '';
    selectOptions.forEach(option => {
        const selected = option.value === value ? 'selected' : '';
        optionsHtml += `<option value="${option.value}" ${selected}>${option.text}</option>`;
    });
    
    return `
        <div class="form-group ${errorClass} ${className}">
            ${label ? `<label for="${id}">${label}${required ? ' *' : ''}</label>` : ''}
            <select 
                id="${id}" 
                name="${name}" 
                class="form-control"
                ${required ? 'required' : ''}
            >
                ${optionsHtml}
            </select>
            ${error ? `<div class="error-message">${error}</div>` : ''}
        </div>
    `;
}

/**
 * Render a radio button group
 * @param {Object} options - Configuration options
 * @param {String} options.name - Radio group name
 * @param {String} options.label - Group label
 * @param {String} options.value - Current selected value
 * @param {Array} options.options - Array of {value, text} objects
 * @param {Boolean} options.required - Whether selection is required
 * @param {String} options.error - Error message to display
 * @return {String} - HTML for the radio button group
 */
export function renderRadioGroup(options) {
    const {
        name = '',
        label = '',
        value = '',
        options: radioOptions = [],
        required = false,
        error = '',
        className = ''
    } = options;
    
    const errorClass = error ? 'has-error' : '';
    
    let radioHtml = '';
    radioOptions.forEach((option, index) => {
        const checked = option.value === value ? 'checked' : '';
        const id = `${name}_${index}`;
        
        radioHtml += `
            <div class="radio-item">
                <input 
                    type="radio" 
                    id="${id}" 
                    name="${name}" 
                    value="${option.value}" 
                    ${checked}
                    ${required ? 'required' : ''}
                >
                <label for="${id}">${option.text}</label>
            </div>
        `;
    });
    
    return `
        <div class="form-group radio-group ${errorClass} ${className}">
            ${label ? `<div class="group-label">${label}${required ? ' *' : ''}</div>` : ''}
            <div class="radio-options">
                ${radioHtml}
            </div>
            ${error ? `<div class="error-message">${error}</div>` : ''}
        </div>
    `;
}

/**
 * Render a checkbox
 * @param {Object} options - Configuration options
 * @param {String} options.id - Checkbox ID
 * @param {String} options.name - Checkbox name
 * @param {String} options.label - Checkbox label
 * @param {Boolean} options.checked - Whether the checkbox is checked
 * @return {String} - HTML for the checkbox
 */
export function renderCheckbox(options) {
    const {
        id = '',
        name = id,
        label = '',
        checked = false,
        value = 'true',
        className = ''
    } = options;
    
    return `
        <div class="form-group checkbox-group ${className}">
            <div class="checkbox">
                <input 
                    type="checkbox" 
                    id="${id}" 
                    name="${name}" 
                    value="${value}"
                    ${checked ? 'checked' : ''}
                >
                <label for="${id}">${label}</label>
            </div>
        </div>
    `;
}

/**
 * Render a slider input
 * @param {Object} options - Configuration options
 * @param {String} options.id - Slider ID
 * @param {String} options.name - Slider name
 * @param {String} options.label - Slider label
 * @param {Number} options.value - Current value
 * @param {Number} options.min - Minimum value
 * @param {Number} options.max - Maximum value
 * @param {Number} options.step - Step increment
 * @return {String} - HTML for the slider
 */
export function renderSlider(options) {
    const {
        id = '',
        name = id,
        label = '',
        value = 50,
        min = 0,
        max = 100,
        step = 1,
        showValue = true,
        className = ''
    } = options;
    
    return `
        <div class="form-group slider-group ${className}">
            <div class="slider-header">
                ${label ? `<label for="${id}">${label}</label>` : ''}
                ${showValue ? `<div class="slider-value" id="${id}-value">${value}</div>` : ''}
            </div>
            <input 
                type="range" 
                id="${id}" 
                name="${name}" 
                class="form-control-range" 
                value="${value}" 
                min="${min}" 
                max="${max}" 
                step="${step}"
            >
        </div>
    `;
}
