// Contact Form Widget - Advanced Form Builder
// Part of KingsBuilder Phase 2.3: Form Widgets

class ContactFormWidget {
    constructor() {
        this.type = 'contact-form';
        this.title = 'Contact Form';
        this.icon = 'eicon-form-horizontal';
        this.category = 'general';
    }
    
    getDefaultSettings() {
        return {
            form_fields: [
                {
                    custom_id: 'name',
                    field_type: 'text',
                    field_label: 'Name',
                    placeholder: 'Your Name',
                    required: true,
                    width: '100'
                },
                {
                    custom_id: 'email',
                    field_type: 'email',
                    field_label: 'Email',
                    placeholder: 'your@email.com',
                    required: true,
                    width: '100'
                },
                {
                    custom_id: 'message',
                    field_type: 'textarea',
                    field_label: 'Message',
                    placeholder: 'Your message here...',
                    required: true,
                    rows: 4,
                    width: '100'
                }
            ],
            button_text: 'Send Message',
            button_size: 'md',
            button_align: 'left',
            success_message: 'Thank you! Your message has been sent.',
            error_message: 'Sorry, there was an error sending your message. Please try again.',
            email_to: '',
            email_subject: 'New Contact Form Submission',
            form_name: 'Contact Form',
            custom_messages: false,
            redirect_to: '',
            hide_form_after_success: false,
            label_space: {
                size: 0,
                unit: 'px'
            },
            row_gap: {
                size: 20,
                unit: 'px'
            },
            input_size: 'default',
            show_labels: true,
            mark_required: true,
            form_style: 'default',
            field_background_color: '#ffffff',
            field_text_color: '#333333',
            field_border_color: '#dddddd',
            field_border_width: {
                size: 1,
                unit: 'px'
            },
            field_border_radius: {
                size: 3,
                unit: 'px'
            },
            button_background_color: '#007cba',
            button_text_color: '#ffffff',
            button_border_radius: {
                size: 3,
                unit: 'px'
            }
        };
    }
    
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-form-horizontal"></i>
                    Form Fields
                </div>
                
                <!-- Form Fields Repeater -->
                <div class="elementor-control elementor-control-type-repeater">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Form Fields</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-repeater form-fields-repeater">
                                    <div class="elementor-repeater-fields">
                                        ${this.getFormFieldTemplate()}
                                    </div>
                                    <div class="elementor-repeater-add">
                                        <button type="button" class="elementor-repeater-add-button">
                                            <i class="eicon-plus"></i>
                                            Add Field
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Button Section -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-button"></i>
                    Submit Button
                </div>
                
                <!-- Button Text -->
                <div class="elementor-control elementor-control-type-text">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Text</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="text" name="button_text" class="elementor-control-input" value="Send Message">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Button Size -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Size</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="button_size" value="xs" id="button_xs">
                                    <label for="button_xs" title="Extra Small">XS</label>
                                    
                                    <input type="radio" name="button_size" value="sm" id="button_sm">
                                    <label for="button_sm" title="Small">SM</label>
                                    
                                    <input type="radio" name="button_size" value="md" id="button_md" checked>
                                    <label for="button_md" title="Medium">MD</label>
                                    
                                    <input type="radio" name="button_size" value="lg" id="button_lg">
                                    <label for="button_lg" title="Large">LG</label>
                                    
                                    <input type="radio" name="button_size" value="xl" id="button_xl">
                                    <label for="button_xl" title="Extra Large">XL</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Button Alignment -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Alignment</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="button_align" value="left" id="button_left" checked>
                                    <label for="button_left" title="Left">
                                        <i class="eicon-text-align-left"></i>
                                    </label>
                                    
                                    <input type="radio" name="button_align" value="center" id="button_center">
                                    <label for="button_center" title="Center">
                                        <i class="eicon-text-align-center"></i>
                                    </label>
                                    
                                    <input type="radio" name="button_align" value="right" id="button_right">
                                    <label for="button_right" title="Right">
                                        <i class="eicon-text-align-right"></i>
                                    </label>
                                    
                                    <input type="radio" name="button_align" value="justify" id="button_justify">
                                    <label for="button_justify" title="Justify">
                                        <i class="eicon-text-align-justify"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Additional Options -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-cogs"></i>
                    Additional Options
                </div>
                
                <!-- Success Message -->
                <div class="elementor-control elementor-control-type-textarea">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Success Message</label>
                            <div class="elementor-control-input-wrapper">
                                <textarea name="success_message" class="elementor-control-input" rows="3">Thank you! Your message has been sent.</textarea>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Error Message -->
                <div class="elementor-control elementor-control-type-textarea">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Error Message</label>
                            <div class="elementor-control-input-wrapper">
                                <textarea name="error_message" class="elementor-control-input" rows="3">Sorry, there was an error sending your message. Please try again.</textarea>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Email Settings -->
                <div class="elementor-control elementor-control-type-text">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Send To Email</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="email" name="email_to" class="elementor-control-input" placeholder="admin@yoursite.com">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Show Labels -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Show Labels</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="show_labels" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Mark Required -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Mark Required</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="mark_required" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Style Section -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-paint-brush"></i>
                    Form Style
                </div>
                
                <!-- Row Gap -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Rows Gap</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="row_gap" min="0" max="60" value="20" class="elementor-slider-input">
                                    <span class="elementor-slider-value">20px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Field Background -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Field Background</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="field_background_color" data-default="#ffffff">
                                    <button type="button" class="pcr-button" style="color: #ffffff;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Field Text Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Field Text Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="field_text_color" data-default="#333333">
                                    <button type="button" class="pcr-button" style="color: #333333;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Button Background -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Button Background</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="button_background_color" data-default="#007cba">
                                    <button type="button" class="pcr-button" style="color: #007cba;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Button Text Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Button Text Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="button_text_color" data-default="#ffffff">
                                    <button type="button" class="pcr-button" style="color: #ffffff;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getFormFieldTemplate() {
        return `
            <div class="elementor-repeater-row">
                <div class="elementor-repeater-row-tools">
                    <i class="elementor-repeater-tool-drag eicon-ellipsis-v"></i>
                    <i class="elementor-repeater-tool-remove eicon-close"></i>
                </div>
                <div class="elementor-repeater-row-controls">
                    <!-- Field Type -->
                    <div class="elementor-control elementor-control-type-select">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Type</label>
                                <div class="elementor-control-input-wrapper">
                                    <select name="field_type" class="elementor-control-input">
                                        <option value="text">Text</option>
                                        <option value="email">Email</option>
                                        <option value="tel">Tel</option>
                                        <option value="url">URL</option>
                                        <option value="number">Number</option>
                                        <option value="textarea">Textarea</option>
                                        <option value="select">Select</option>
                                        <option value="radio">Radio</option>
                                        <option value="checkbox">Checkbox</option>
                                        <option value="acceptance">Acceptance</option>
                                        <option value="date">Date</option>
                                        <option value="time">Time</option>
                                        <option value="file">File Upload</option>
                                        <option value="hidden">Hidden</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Field Label -->
                    <div class="elementor-control elementor-control-type-text">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Label</label>
                                <div class="elementor-control-input-wrapper">
                                    <input type="text" name="field_label" class="elementor-control-input" value="Field Label">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Placeholder -->
                    <div class="elementor-control elementor-control-type-text">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Placeholder</label>
                                <div class="elementor-control-input-wrapper">
                                    <input type="text" name="placeholder" class="elementor-control-input" value="">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Required -->
                    <div class="elementor-control elementor-control-type-switcher">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Required</label>
                                <div class="elementor-control-input-wrapper">
                                    <label class="elementor-switch">
                                        <input type="checkbox" name="required" class="elementor-switch-input">
                                        <span class="elementor-switch-slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Width -->
                    <div class="elementor-control elementor-control-type-select">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Width</label>
                                <div class="elementor-control-input-wrapper">
                                    <select name="width" class="elementor-control-input">
                                        <option value="100">100%</option>
                                        <option value="80">80%</option>
                                        <option value="75">75%</option>
                                        <option value="66">66%</option>
                                        <option value="60">60%</option>
                                        <option value="50">50%</option>
                                        <option value="40">40%</option>
                                        <option value="33">33%</option>
                                        <option value="25">25%</option>
                                        <option value="20">20%</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Custom ID -->
                    <div class="elementor-control elementor-control-type-text">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">ID</label>
                                <div class="elementor-control-input-wrapper">
                                    <input type="text" name="custom_id" class="elementor-control-input" value="">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    render(elementData) {
        const settings = { ...this.getDefaultSettings(), ...elementData.settings };
        const formId = `form_${elementData.id}`;
        
        return `
            <div class="elementor-widget-contact-form" data-id="${elementData.id}">
                <form class="elementor-form" id="${formId}" method="post" name="${settings.form_name || 'Contact Form'}">
                    <div class="elementor-form-fields-wrapper">
                        ${this.renderFormFields(settings)}
                    </div>
                    
                    <div class="elementor-field-group elementor-column elementor-field-type-submit elementor-col-100 elementor-button-align-${settings.button_align}">
                        <button type="submit" class="elementor-button elementor-size-${settings.button_size}" id="submit_${elementData.id}">
                            <span class="elementor-button-content-wrapper">
                                <span class="elementor-button-text">${settings.button_text || 'Send Message'}</span>
                            </span>
                        </button>
                    </div>
                    
                    <div class="elementor-message elementor-message-success" style="display: none;">
                        ${settings.success_message || 'Thank you! Your message has been sent.'}
                    </div>
                    
                    <div class="elementor-message elementor-message-error" style="display: none;">
                        ${settings.error_message || 'Sorry, there was an error sending your message. Please try again.'}
                    </div>
                </form>
            </div>
        `;
    }
    
    renderFormFields(settings) {
        if (!settings.form_fields || settings.form_fields.length === 0) {
            return '<div class="elementor-field-group elementor-column elementor-col-100"><p>No form fields configured.</p></div>';
        }
        
        return settings.form_fields.map((field, index) => this.renderFormField(field, index, settings)).join('');
    }
    
    renderFormField(field, index, globalSettings) {
        const fieldId = field.custom_id || `field_${index}`;
        const required = field.required ? 'required' : '';
        const requiredMark = field.required && globalSettings.mark_required ? ' *' : '';
        const width = field.width || '100';
        
        let fieldHtml = '';
        
        switch (field.field_type) {
            case 'textarea':
                fieldHtml = `
                    <textarea 
                        name="${fieldId}" 
                        id="${fieldId}" 
                        class="elementor-field elementor-field-textual elementor-size-${globalSettings.input_size || 'sm'}" 
                        placeholder="${field.placeholder || ''}" 
                        rows="${field.rows || 4}"
                        ${required}
                    ></textarea>
                `;
                break;
                
            case 'select':
                const options = field.field_options ? field.field_options.split('\n') : ['Option 1', 'Option 2', 'Option 3'];
                fieldHtml = `
                    <select 
                        name="${fieldId}" 
                        id="${fieldId}" 
                        class="elementor-field elementor-field-textual elementor-size-${globalSettings.input_size || 'sm'}"
                        ${required}
                    >
                        <option value="">${field.placeholder || 'Choose...'}</option>
                        ${options.map(option => `<option value="${option.trim()}">${option.trim()}</option>`).join('')}
                    </select>
                `;
                break;
                
            case 'radio':
                const radioOptions = field.field_options ? field.field_options.split('\n') : ['Option 1', 'Option 2'];
                fieldHtml = `
                    <div class="elementor-field-subgroup">
                        ${radioOptions.map((option, i) => `
                            <span class="elementor-field-option">
                                <input type="radio" name="${fieldId}" id="${fieldId}_${i}" value="${option.trim()}" ${required}>
                                <label for="${fieldId}_${i}">${option.trim()}</label>
                            </span>
                        `).join('')}
                    </div>
                `;
                break;
                
            case 'checkbox':
                const checkboxOptions = field.field_options ? field.field_options.split('\n') : ['Option 1', 'Option 2'];
                fieldHtml = `
                    <div class="elementor-field-subgroup">
                        ${checkboxOptions.map((option, i) => `
                            <span class="elementor-field-option">
                                <input type="checkbox" name="${fieldId}[]" id="${fieldId}_${i}" value="${option.trim()}">
                                <label for="${fieldId}_${i}">${option.trim()}</label>
                            </span>
                        `).join('')}
                    </div>
                `;
                break;
                
            case 'acceptance':
                fieldHtml = `
                    <div class="elementor-field-subgroup">
                        <span class="elementor-field-option">
                            <input type="checkbox" name="${fieldId}" id="${fieldId}" value="1" ${required}>
                            <label for="${fieldId}">${field.acceptance_text || 'I accept the terms and conditions'}</label>
                        </span>
                    </div>
                `;
                break;
                
            case 'file':
                fieldHtml = `
                    <input 
                        type="file" 
                        name="${fieldId}" 
                        id="${fieldId}" 
                        class="elementor-field elementor-field-textual elementor-size-${globalSettings.input_size || 'sm'}"
                        ${field.file_types ? `accept="${field.file_types}"` : ''}
                        ${field.multiple ? 'multiple' : ''}
                        ${required}
                    >
                `;
                break;
                
            case 'hidden':
                fieldHtml = `
                    <input 
                        type="hidden" 
                        name="${fieldId}" 
                        id="${fieldId}" 
                        value="${field.field_value || ''}"
                    >
                `;
                break;
                
            default:
                fieldHtml = `
                    <input 
                        type="${field.field_type || 'text'}" 
                        name="${fieldId}" 
                        id="${fieldId}" 
                        class="elementor-field elementor-field-textual elementor-size-${globalSettings.input_size || 'sm'}" 
                        placeholder="${field.placeholder || ''}" 
                        ${required}
                    >
                `;
        }
        
        const labelHtml = globalSettings.show_labels && field.field_type !== 'hidden' ? 
            `<label for="${fieldId}" class="elementor-field-label">${field.field_label || 'Field Label'}${requiredMark}</label>` : '';
        
        return `
            <div class="elementor-field-group elementor-column elementor-field-type-${field.field_type} elementor-col-${width} ${field.required ? 'elementor-field-required' : ''}">
                ${labelHtml}
                ${fieldHtml}
            </div>
        `;
    }
    
    generateCSS(settings, elementId) {
        const rowGap = `${settings.row_gap?.size || 20}px`;
        const borderWidth = `${settings.field_border_width?.size || 1}px`;
        const borderRadius = `${settings.field_border_radius?.size || 3}px`;
        const buttonBorderRadius = `${settings.button_border_radius?.size || 3}px`;
        
        return `
            .elementor-element-${elementId} .elementor-form-fields-wrapper {
                display: flex;
                flex-wrap: wrap;
                gap: ${rowGap};
            }
            
            .elementor-element-${elementId} .elementor-field-group {
                margin: 0;
                padding: 0;
            }
            
            .elementor-element-${elementId} .elementor-field-label {
                display: block;
                margin-bottom: 5px;
                font-weight: 500;
                color: ${settings.field_text_color || '#333333'};
            }
            
            .elementor-element-${elementId} .elementor-field {
                width: 100%;
                padding: 12px;
                border: ${borderWidth} solid ${settings.field_border_color || '#dddddd'};
                border-radius: ${borderRadius};
                background-color: ${settings.field_background_color || '#ffffff'};
                color: ${settings.field_text_color || '#333333'};
                font-size: 14px;
                line-height: 1.4;
                transition: border-color 0.3s ease;
                box-sizing: border-box;
            }
            
            .elementor-element-${elementId} .elementor-field:focus {
                outline: none;
                border-color: ${settings.button_background_color || '#007cba'};
                box-shadow: 0 0 0 2px ${settings.button_background_color || '#007cba'}33;
            }
            
            .elementor-element-${elementId} .elementor-field::placeholder {
                color: #999999;
                opacity: 1;
            }
            
            .elementor-element-${elementId} .elementor-button {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                padding: 12px 24px;
                background-color: ${settings.button_background_color || '#007cba'};
                color: ${settings.button_text_color || '#ffffff'};
                border: none;
                border-radius: ${buttonBorderRadius};
                font-size: 16px;
                font-weight: 500;
                text-decoration: none;
                cursor: pointer;
                transition: all 0.3s ease;
                box-sizing: border-box;
            }
            
            .elementor-element-${elementId} .elementor-button:hover {
                background-color: ${this.darkenColor(settings.button_background_color || '#007cba', 10)};
                transform: translateY(-1px);
            }
            
            .elementor-element-${elementId} .elementor-button:active {
                transform: translateY(0);
            }
            
            /* Button Sizes */
            .elementor-element-${elementId} .elementor-size-xs {
                padding: 8px 16px;
                font-size: 12px;
            }
            
            .elementor-element-${elementId} .elementor-size-sm {
                padding: 10px 20px;
                font-size: 14px;
            }
            
            .elementor-element-${elementId} .elementor-size-md {
                padding: 12px 24px;
                font-size: 16px;
            }
            
            .elementor-element-${elementId} .elementor-size-lg {
                padding: 15px 30px;
                font-size: 18px;
            }
            
            .elementor-element-${elementId} .elementor-size-xl {
                padding: 18px 36px;
                font-size: 20px;
            }
            
            /* Button Alignment */
            .elementor-element-${elementId} .elementor-button-align-left {
                text-align: left;
            }
            
            .elementor-element-${elementId} .elementor-button-align-center {
                text-align: center;
            }
            
            .elementor-element-${elementId} .elementor-button-align-right {
                text-align: right;
            }
            
            .elementor-element-${elementId} .elementor-button-align-justify .elementor-button {
                width: 100%;
            }
            
            /* Field Subgroups (Radio/Checkbox) */
            .elementor-element-${elementId} .elementor-field-subgroup {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }
            
            .elementor-element-${elementId} .elementor-field-option {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .elementor-element-${elementId} .elementor-field-option input[type="radio"],
            .elementor-element-${elementId} .elementor-field-option input[type="checkbox"] {
                width: auto;
                margin: 0;
            }
            
            /* Messages */
            .elementor-element-${elementId} .elementor-message {
                padding: 12px;
                margin-top: 20px;
                border-radius: ${borderRadius};
                font-size: 14px;
            }
            
            .elementor-element-${elementId} .elementor-message-success {
                background-color: #d4edda;
                color: #155724;
                border: 1px solid #c3e6cb;
            }
            
            .elementor-element-${elementId} .elementor-message-error {
                background-color: #f8d7da;
                color: #721c24;
                border: 1px solid #f5c6cb;
            }
            
            /* Column Widths */
            .elementor-element-${elementId} .elementor-col-100 { width: 100%; }
            .elementor-element-${elementId} .elementor-col-80 { width: 80%; }
            .elementor-element-${elementId} .elementor-col-75 { width: 75%; }
            .elementor-element-${elementId} .elementor-col-66 { width: 66.66%; }
            .elementor-element-${elementId} .elementor-col-60 { width: 60%; }
            .elementor-element-${elementId} .elementor-col-50 { width: 50%; }
            .elementor-element-${elementId} .elementor-col-40 { width: 40%; }
            .elementor-element-${elementId} .elementor-col-33 { width: 33.33%; }
            .elementor-element-${elementId} .elementor-col-25 { width: 25%; }
            .elementor-element-${elementId} .elementor-col-20 { width: 20%; }
            
            /* Responsive */
            @media (max-width: 768px) {
                .elementor-element-${elementId} .elementor-col-66,
                .elementor-element-${elementId} .elementor-col-50,
                .elementor-element-${elementId} .elementor-col-33 {
                    width: 100%;
                }
                
                .elementor-element-${elementId} .elementor-button {
                    padding: 12px 20px;
                    font-size: 14px;
                }
            }
        `;
    }
    
    darkenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) - amt;
        const G = (num >> 8 & 0x00FF) - amt;
        const B = (num & 0x0000FF) - amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    initInteractions(element, elementData) {
        // Initialize form submission
        const form = element.querySelector('.elementor-form');
        if (form) {
            this.initFormSubmission(form, elementData);
        }
        
        // Initialize repeater
        const repeater = element.querySelector('.form-fields-repeater');
        if (repeater) {
            this.initRepeater(repeater);
        }
    }
    
    initFormSubmission(form, elementData) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const submitButton = form.querySelector('.elementor-button');
            const successMessage = form.querySelector('.elementor-message-success');
            const errorMessage = form.querySelector('.elementor-message-error');
            
            // Show loading state
            submitButton.disabled = true;
            submitButton.querySelector('.elementor-button-text').textContent = 'Sending...';
            
            try {
                // Here you would implement actual form submission
                // For demo purposes, we'll simulate a successful submission
                await this.simulateFormSubmission(formData);
                
                // Show success message
                successMessage.style.display = 'block';
                errorMessage.style.display = 'none';
                
                // Reset form
                form.reset();
                
            } catch (error) {
                console.error('Form submission error:', error);
                
                // Show error message
                errorMessage.style.display = 'block';
                successMessage.style.display = 'none';
            } finally {
                // Reset button
                submitButton.disabled = false;
                submitButton.querySelector('.elementor-button-text').textContent = elementData.settings?.button_text || 'Send Message';
            }
        });
    }
    
    async simulateFormSubmission(formData) {
        // Simulate API call delay
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('Form submitted with data:', Object.fromEntries(formData));
                resolve();
            }, 1000);
        });
    }
    
    initRepeater(repeater) {
        const addButton = repeater.querySelector('.elementor-repeater-add-button');
        const fieldsContainer = repeater.querySelector('.elementor-repeater-fields');
        
        addButton.addEventListener('click', () => {
            const newField = document.createElement('div');
            newField.innerHTML = this.getFormFieldTemplate();
            fieldsContainer.appendChild(newField.firstElementChild);
            
            this.bindFieldRemoval(newField.firstElementChild);
        });
        
        // Bind removal for existing fields
        const existingFields = fieldsContainer.querySelectorAll('.elementor-repeater-row');
        existingFields.forEach(field => this.bindFieldRemoval(field));
    }
    
    bindFieldRemoval(fieldRow) {
        const removeButton = fieldRow.querySelector('.elementor-repeater-tool-remove');
        removeButton.addEventListener('click', () => {
            fieldRow.remove();
        });
    }
}

window.ContactFormWidget = ContactFormWidget;