/**
 * KingsBuilder Controls Manager
 * =====================================================
 * Manages element settings controls and property panels
 */

class ControlsManager {
    constructor() {
        this.currentElement = null;
        this.currentTab = 'content';
        this.initialized = false;
        
        console.log('🎛️ Controls Manager initialized');
    }

    async init() {
        if (this.initialized) return;
        
        this.bindEvents();
        this.initialized = true;
        
        console.log('✅ Controls Manager ready');
        
        // Add global debug method
        window.showWidgetSettings = (element) => {
            console.log('🎛️ Manually showing widget settings for:', element);
            this.loadElementSettings(element);
        };
    }

    /**
     * Bind control events
     */
    bindEvents() {
        // Settings tab switching
        document.addEventListener('click', (e) => {
            const settingsTab = e.target.closest('.kb-settings-tab');
            if (settingsTab) {
                this.switchSettingsTab(settingsTab.dataset.tab);
            }
        });

        // Control input changes
        document.addEventListener('input', (e) => {
            if (e.target.classList.contains('kb-control-input')) {
                this.handleControlChange(e);
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.classList.contains('kb-control-input')) {
                this.handleControlChange(e);
            }
        });
    }

    /**
     * Load element settings
     */
    loadElementSettings(element) {
        this.currentElement = element;
        
        console.log('🎛️ Loading element settings:', element);
        console.log('🎛️ Element widget:', element._kbWidget);
        console.log('🎛️ Element settings:', element._kbSettings);
        
        if (!element._kbWidget) {
            console.warn('Element has no widget reference');
            return;
        }

        // Update settings title
        const settingsTitle = document.getElementById('kb-settings-title');
        if (settingsTitle) {
            settingsTitle.textContent = `Edit ${element._kbWidget.getTitle()}`;
        }

        // Render current tab
        this.renderSettingsTab(this.currentTab);
    }

    /**
     * Switch settings tab
     */
    switchSettingsTab(tabName) {
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.kb-settings-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Render tab content
        this.renderSettingsTab(tabName);
    }

    /**
     * Render settings tab content
     */
    renderSettingsTab(tabName) {
        console.log('🎛️ Rendering settings tab:', tabName);
        const settingsContent = document.getElementById('kb-settings-content');
        if (!settingsContent || !this.currentElement) {
            console.log('❌ Missing settingsContent or currentElement');
            return;
        }

        const widget = this.currentElement._kbWidget;
        if (!widget) {
            console.log('❌ Missing widget');
            return;
        }

        const controls = widget.getControls();
        console.log('🎛️ Widget controls:', controls);
        const tabControls = controls.find(group => group.name === tabName);
        console.log('🎛️ Tab controls for', tabName, ':', tabControls);
        
        if (!tabControls) {
            console.log('⚠️ No tab controls found, showing fallback');
            // Show fallback controls for basic editing
            if (tabName === 'content') {
                settingsContent.innerHTML = this.generateFallbackContentControls();
            } else {
                settingsContent.innerHTML = `
                    <div class="kb-no-controls">
                        <i class="fas fa-cog"></i>
                        <p>No ${tabName} controls available</p>
                    </div>
                `;
            }
            return;
        }

        const elementSettings = this.currentElement._kbSettings || {};
        let html = '<div class="kb-controls-container">';
        
        try {
            tabControls.controls.forEach(control => {
                console.log('🎛️ Rendering control:', control.name, control.type, 'value:', elementSettings[control.name]);
                html += this.renderControl(control);
            });
        } catch (error) {
            console.error('❌ Error rendering controls:', error);
            html += `<div class="kb-error">Error rendering controls: ${error.message}</div>`;
        }
        
        html += '</div>';
        console.log('🎛️ Final HTML:', html.substring(0, 200) + '...');
        settingsContent.innerHTML = html;

        // Initialize control values
        this.initializeControlValues();
    }

    /**
     * Render individual control
     */
    renderControl(control) {
        const elementSettings = this.currentElement._kbSettings || {};
        let value = elementSettings[control.name] || control.default || '';
        
        // Handle object values safely
        if (typeof value === 'object' && value !== null) {
            // For complex controls, keep the object
            if (['dimensions', 'typography', 'text_shadow', 'media'].includes(control.type)) {
                // Keep as object for complex controls
            } else {
                // Convert to string for simple controls and escape quotes
                value = JSON.stringify(value).replace(/"/g, '&quot;');
            }
        }
        
        let html = `
            <div class="kb-control-group" data-control="${control.name}">
                <label class="kb-control-label">${control.label}</label>
        `;

        switch (control.type) {
            case 'text':
                const textValue = typeof value === 'string' ? value : '';
                html += `<input type="text" class="kb-control-input" data-control="${control.name}" value="${textValue}" placeholder="${control.placeholder || ''}">`;
                break;
                
            case 'textarea':
                html += `<textarea class="kb-control-input" data-control="${control.name}" placeholder="${control.placeholder || ''}" rows="4">${value}</textarea>`;
                break;
                
            case 'select':
                html += `<select class="kb-control-input" data-control="${control.name}">`;
                Object.entries(control.options || {}).forEach(([key, label]) => {
                    const selected = value === key ? 'selected' : '';
                    html += `<option value="${key}" ${selected}>${label}</option>`;
                });
                html += `</select>`;
                break;
                
            case 'color':
                const colorValue = typeof value === 'string' ? value : '#000000';
                html += `
                    <div class="kb-color-control">
                        <input type="color" class="kb-control-input kb-color-picker" data-control="${control.name}" value="${colorValue}">
                        <input type="text" class="kb-control-input kb-color-text" data-control="${control.name}" value="${colorValue}" placeholder="#000000">
                    </div>
                `;
                break;
                
            case 'slider':
                const min = control.range?.min || 0;
                const max = control.range?.max || 100;
                html += `
                    <div class="kb-slider-control">
                        <input type="range" class="kb-control-input kb-slider" data-control="${control.name}" 
                               value="${value}" min="${min}" max="${max}">
                        <input type="number" class="kb-control-input kb-slider-number" data-control="${control.name}" 
                               value="${value}" min="${min}" max="${max}">
                    </div>
                `;
                break;
                
            case 'choose':
                html += `<div class="kb-choose-control">`;
                Object.entries(control.options || {}).forEach(([key, option]) => {
                    const active = value === key ? 'active' : '';
                    html += `
                        <button type="button" class="kb-choose-option ${active}" data-control="${control.name}" data-value="${key}" title="${option.title}">
                            <i class="${option.icon}"></i>
                        </button>
                    `;
                });
                html += `</div>`;
                break;
                
            case 'url':
                html += `
                    <div class="kb-url-control">
                        <input type="url" class="kb-control-input" data-control="${control.name}" value="${value}" placeholder="https://">
                        <button type="button" class="kb-url-button" title="Link Options">
                            <i class="fas fa-external-link-alt"></i>
                        </button>
                    </div>
                `;
                break;
                
            case 'media':
                const imageUrl = typeof value === 'object' && value ? value.url : (typeof value === 'string' ? value : '');
                const imageValue = typeof value === 'object' ? JSON.stringify(value) : (value || '');
                html += `
                    <div class="kb-media-control">
                        <div class="kb-media-preview" ${imageUrl ? `style="background-image: url(${imageUrl})"` : ''}>
                            ${!imageUrl ? '<i class="fas fa-image"></i>' : ''}
                        </div>
                        <div class="kb-media-buttons">
                            <button type="button" class="kb-media-select" data-control="${control.name}">
                                <i class="fas fa-upload"></i>
                                Choose Image
                            </button>
                            <button type="button" class="kb-media-remove" data-control="${control.name}" ${!imageUrl ? 'style="display: none;"' : ''}>
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                        <input type="hidden" class="kb-control-input" data-control="${control.name}" value="${imageValue.replace(/"/g, '&quot;')}">
                    </div>
                `;
                break;
                
            case 'typography':
                const typography = typeof value === 'object' ? value : {};
                html += `
                    <div class="kb-typography-control">
                        <div class="kb-typography-row">
                            <label>Font Family</label>
                            <select class="kb-control-input" data-control="${control.name}" data-property="family">
                                <option value="inherit" ${typography.family === 'inherit' ? 'selected' : ''}>Default</option>
                                <option value="Arial, sans-serif" ${typography.family === 'Arial, sans-serif' ? 'selected' : ''}>Arial</option>
                                <option value="Georgia, serif" ${typography.family === 'Georgia, serif' ? 'selected' : ''}>Georgia</option>
                                <option value="'Times New Roman', serif" ${typography.family === "'Times New Roman', serif" ? 'selected' : ''}>Times New Roman</option>
                                <option value="Helvetica, sans-serif" ${typography.family === 'Helvetica, sans-serif' ? 'selected' : ''}>Helvetica</option>
                            </select>
                        </div>
                        <div class="kb-typography-row">
                            <label>Size (px)</label>
                            <input type="number" class="kb-control-input" data-control="${control.name}" data-property="size" 
                                   value="${typography.size || ''}" placeholder="16">
                        </div>
                        <div class="kb-typography-row">
                            <label>Weight</label>
                            <select class="kb-control-input" data-control="${control.name}" data-property="weight">
                                <option value="normal" ${typography.weight === 'normal' ? 'selected' : ''}>Normal</option>
                                <option value="bold" ${typography.weight === 'bold' ? 'selected' : ''}>Bold</option>
                                <option value="100" ${typography.weight === '100' ? 'selected' : ''}>100</option>
                                <option value="300" ${typography.weight === '300' ? 'selected' : ''}>300</option>
                                <option value="400" ${typography.weight === '400' ? 'selected' : ''}>400</option>
                                <option value="500" ${typography.weight === '500' ? 'selected' : ''}>500</option>
                                <option value="600" ${typography.weight === '600' ? 'selected' : ''}>600</option>
                                <option value="700" ${typography.weight === '700' ? 'selected' : ''}>700</option>
                                <option value="800" ${typography.weight === '800' ? 'selected' : ''}>800</option>
                                <option value="900" ${typography.weight === '900' ? 'selected' : ''}>900</option>
                            </select>
                        </div>
                        <div class="kb-typography-row">
                            <label>Style</label>
                            <select class="kb-control-input" data-control="${control.name}" data-property="style">
                                <option value="normal" ${typography.style === 'normal' ? 'selected' : ''}>Normal</option>
                                <option value="italic" ${typography.style === 'italic' ? 'selected' : ''}>Italic</option>
                            </select>
                        </div>
                    </div>
                `;
                break;
                
            case 'wysiwyg':
                html += `
                    <div class="kb-wysiwyg-control">
                        <div class="kb-wysiwyg-toolbar">
                            <button type="button" data-command="bold" title="Bold"><i class="fas fa-bold"></i></button>
                            <button type="button" data-command="italic" title="Italic"><i class="fas fa-italic"></i></button>
                            <button type="button" data-command="underline" title="Underline"><i class="fas fa-underline"></i></button>
                            <div class="kb-toolbar-separator"></div>
                            <button type="button" data-command="justifyLeft" title="Align Left"><i class="fas fa-align-left"></i></button>
                            <button type="button" data-command="justifyCenter" title="Align Center"><i class="fas fa-align-center"></i></button>
                            <button type="button" data-command="justifyRight" title="Align Right"><i class="fas fa-align-right"></i></button>
                        </div>
                        <div class="kb-wysiwyg-editor" contenteditable="true" data-control="${control.name}">${value}</div>
                    </div>
                `;
                break;
                
            case 'switcher':
                const isOn = value === 'yes' || value === true;
                html += `
                    <label class="kb-switcher-control">
                        <input type="checkbox" data-control="${control.name}" ${isOn ? 'checked' : ''}>
                        <span class="kb-switcher-slider"></span>
                        <span class="kb-switcher-labels">
                            <span class="kb-switcher-off">${control.label_off || 'Off'}</span>
                            <span class="kb-switcher-on">${control.label_on || 'On'}</span>
                        </span>
                    </label>
                `;
                break;
                
            case 'dimensions':
                const dimensions = typeof value === 'object' ? value : {};
                html += `
                    <div class="kb-dimensions-control">
                        <div class="kb-dimensions-inputs">
                            <input type="number" placeholder="Top" data-control="${control.name}" data-dimension="top" value="${dimensions.top || ''}">
                            <input type="number" placeholder="Right" data-control="${control.name}" data-dimension="right" value="${dimensions.right || ''}">
                            <input type="number" placeholder="Bottom" data-control="${control.name}" data-dimension="bottom" value="${dimensions.bottom || ''}">
                            <input type="number" placeholder="Left" data-control="${control.name}" data-dimension="left" value="${dimensions.left || ''}">
                        </div>
                        <select class="kb-dimensions-unit" data-control="${control.name}" data-dimension="unit">
                            <option value="px" ${dimensions.unit === 'px' ? 'selected' : ''}>px</option>
                            <option value="%" ${dimensions.unit === '%' ? 'selected' : ''}>%</option>
                            <option value="em" ${dimensions.unit === 'em' ? 'selected' : ''}>em</option>
                        </select>
                    </div>
                `;
                break;
                
            case 'text_shadow':
                const shadow = typeof value === 'object' ? value : {};
                html += `
                    <div class="kb-text-shadow-control">
                        <div class="kb-shadow-row">
                            <label>Horizontal</label>
                            <input type="number" data-control="${control.name}" data-property="horizontal" value="${shadow.horizontal || 0}">
                        </div>
                        <div class="kb-shadow-row">
                            <label>Vertical</label>
                            <input type="number" data-control="${control.name}" data-property="vertical" value="${shadow.vertical || 0}">
                        </div>
                        <div class="kb-shadow-row">
                            <label>Blur</label>
                            <input type="number" data-control="${control.name}" data-property="blur" value="${shadow.blur || 0}">
                        </div>
                        <div class="kb-shadow-row">
                            <label>Color</label>
                            <input type="color" data-control="${control.name}" data-property="color" value="${shadow.color || '#000000'}">
                        </div>
                    </div>
                `;
                break;
                
            default:
                html += `<input type="text" class="kb-control-input" data-control="${control.name}" value="${value}">`;
        }

        html += '</div>';
        return html;
    }

    /**
     * Initialize control values
     */
    initializeControlValues() {
        // Bind choose control events
        document.querySelectorAll('.kb-choose-option').forEach(option => {
            option.addEventListener('click', (e) => {
                const controlName = e.target.dataset.control;
                const value = e.target.dataset.value;
                
                // Update active state
                const parent = e.target.parentElement;
                parent.querySelectorAll('.kb-choose-option').forEach(opt => opt.classList.remove('active'));
                e.target.classList.add('active');
                
                // Update element
                this.updateElementSetting(controlName, value);
            });
        });

        // Bind slider sync
        document.querySelectorAll('.kb-slider').forEach(slider => {
            const numberInput = slider.parentElement.querySelector('.kb-slider-number');
            
            slider.addEventListener('input', (e) => {
                numberInput.value = e.target.value;
            });
            
            numberInput.addEventListener('input', (e) => {
                slider.value = e.target.value;
            });
        });

        // Bind color picker sync
        document.querySelectorAll('.kb-color-picker').forEach(picker => {
            const textInput = picker.parentElement.querySelector('.kb-color-text');
            
            picker.addEventListener('input', (e) => {
                textInput.value = e.target.value;
            });
            
            textInput.addEventListener('input', (e) => {
                if (e.target.value.match(/^#[0-9A-F]{6}$/i)) {
                    picker.value = e.target.value;
                }
            });
        });

        // Bind media controls
        document.querySelectorAll('.kb-media-select').forEach(button => {
            button.addEventListener('click', (e) => {
                this.openMediaLibrary(e.target.dataset.control);
            });
        });

        document.querySelectorAll('.kb-media-remove').forEach(button => {
            button.addEventListener('click', (e) => {
                this.removeMedia(e.target.dataset.control);
            });
        });

        // Bind typography controls
        document.querySelectorAll('.kb-typography-control .kb-control-input').forEach(input => {
            input.addEventListener('change', (e) => {
                this.handleTypographyChange(e);
            });
        });
    }

    /**
     * Handle control changes
     */
    handleControlChange(e) {
        const controlName = e.target.dataset.control;
        const value = e.target.value;
        
        if (controlName) {
            this.updateElementSetting(controlName, value);
        }
    }

    /**
     * Handle typography control changes
     */
    handleTypographyChange(e) {
        const controlName = e.target.dataset.control;
        const property = e.target.dataset.property;
        const value = e.target.value;
        
        if (!controlName || !property) return;
        
        const currentSettings = this.currentElement._kbSettings || {};
        const typography = currentSettings[controlName] || {};
        
        typography[property] = value;
        this.updateElementSetting(controlName, typography);
    }

    /**
     * Update element setting
     */
    updateElementSetting(controlName, value) {
        if (!this.currentElement) return;
        
        // Save state for undo
        window.kingsBuilder?.saveState();
        
        // Update element settings
        this.currentElement._kbSettings = this.currentElement._kbSettings || {};
        this.currentElement._kbSettings[controlName] = value;
        
        // Re-render widget
        if (window.kingsBuilder?.widgetManager && this.currentElement._kbWidget) {
            window.kingsBuilder.widgetManager.updateWidget(this.currentElement, this.currentElement._kbSettings);
        } else {
            console.warn('Cannot update widget - missing widget reference or manager');
        }
        
        console.log(`🎛️ Updated ${controlName}:`, value);
    }

    /**
     * Open media library
     */
    openMediaLibrary(controlName) {
        // Simple file input for now - in production, use proper media library
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const imageData = {
                        url: e.target.result,
                        alt: file.name
                    };
                    
                    this.updateElementSetting(controlName, imageData);
                    this.updateMediaPreview(controlName, imageData.url);
                };
                reader.readAsDataURL(file);
            }
        };
        
        input.click();
    }

    /**
     * Remove media
     */
    removeMedia(controlName) {
        this.updateElementSetting(controlName, { url: '', alt: '' });
        this.updateMediaPreview(controlName, '');
    }

    /**
     * Update media preview
     */
    updateMediaPreview(controlName, imageUrl) {
        const mediaControl = document.querySelector(`[data-control="${controlName}"]`).closest('.kb-media-control');
        if (!mediaControl) return;
        
        const preview = mediaControl.querySelector('.kb-media-preview');
        const removeBtn = mediaControl.querySelector('.kb-media-remove');
        const hiddenInput = mediaControl.querySelector('input[type="hidden"]');
        
        if (imageUrl) {
            preview.style.backgroundImage = `url(${imageUrl})`;
            preview.innerHTML = '';
            removeBtn.style.display = 'inline-block';
        } else {
            preview.style.backgroundImage = '';
            preview.innerHTML = '<i class="fas fa-image"></i>';
            removeBtn.style.display = 'none';
        }
        
        hiddenInput.value = imageUrl;
    }

    /**
     * Get element settings
     */
    getElementSettings(element) {
        return element._kbSettings || {};
    }

    /**
     * Set element settings
     */
    setElementSettings(element, settings) {
        element._kbSettings = { ...element._kbSettings, ...settings };
        
        // Re-render widget
        if (window.kingsBuilder?.widgetManager) {
            window.kingsBuilder.widgetManager.updateWidget(element, element._kbSettings);
        }
    }

    /**
     * Reset element settings to defaults
     */
    resetElementSettings(element) {
        if (!element._kbWidget) return;
        
        const defaultSettings = element._kbWidget.getDefaultSettings();
        this.setElementSettings(element, defaultSettings);
        
        // Reload settings panel if this element is selected
        if (this.currentElement === element) {
            this.loadElementSettings(element);
        }
    }

    /**
     * Copy element settings
     */
    copyElementSettings(element) {
        return JSON.parse(JSON.stringify(element._kbSettings || {}));
    }

    /**
     * Paste element settings
     */
    pasteElementSettings(element, settings) {
        this.setElementSettings(element, settings);
        
        // Reload settings panel if this element is selected
        if (this.currentElement === element) {
            this.loadElementSettings(element);
        }
    }

    /**
     * Generate fallback content controls
     */
    generateFallbackContentControls() {
        const element = this.currentElement;
        const widgetType = element.dataset.widget || 'unknown';
        
        let html = '<div class="kb-controls-container">';
        
        // Basic text control for most widgets
        if (widgetType === 'text' || widgetType === 'heading') {
            const textElement = element.querySelector('.kb-text-content, .kb-heading-content, h1, h2, h3, h4, h5, h6');
            const currentText = textElement ? textElement.textContent : 'Sample text';
            
            html += `
                <div class="kb-control-group">
                    <label class="kb-control-label">Text Content</label>
                    <textarea class="kb-control-input" data-control="text" rows="4" placeholder="Enter your text here...">${currentText}</textarea>
                </div>
            `;
        }
        
        // Basic button controls
        if (widgetType === 'button') {
            const buttonElement = element.querySelector('.kb-button, a, button');
            const currentText = buttonElement ? buttonElement.textContent : 'Click Me';
            const currentUrl = buttonElement ? (buttonElement.href || '#') : '#';
            
            html += `
                <div class="kb-control-group">
                    <label class="kb-control-label">Button Text</label>
                    <input type="text" class="kb-control-input" data-control="text" value="${currentText}" placeholder="Button text">
                </div>
                <div class="kb-control-group">
                    <label class="kb-control-label">Button URL</label>
                    <input type="url" class="kb-control-input" data-control="url" value="${currentUrl}" placeholder="https://example.com">
                </div>
            `;
        }
        
        html += '</div>';
        
        // Bind events for fallback controls
        setTimeout(() => {
            this.bindFallbackControlEvents();
        }, 100);
        
        return html;
    }

    /**
     * Bind events for fallback controls
     */
    bindFallbackControlEvents() {
        const settingsContent = document.getElementById('kb-settings-content');
        if (!settingsContent) return;
        
        settingsContent.querySelectorAll('.kb-control-input').forEach(input => {
            input.addEventListener('input', (e) => {
                const control = e.target.dataset.control;
                const value = e.target.value;
                
                console.log('🎛️ Fallback control changed:', control, value);
                
                if (control === 'text') {
                    const textElement = this.currentElement.querySelector('.kb-text-content, .kb-heading-content, h1, h2, h3, h4, h5, h6, .kb-button');
                    if (textElement) {
                        textElement.textContent = value;
                    }
                } else if (control === 'url') {
                    const linkElement = this.currentElement.querySelector('.kb-button, a');
                    if (linkElement) {
                        linkElement.href = value;
                    }
                }
                
                // Save state
                window.kingsBuilder?.historyManager?.saveState();
            });        });
    }

    /**
     * Load page settings
     */
    loadPageSettings() {
        console.log('?? Loading page settings');
        
        // Update settings title
        const settingsTitle = document.getElementById('kb-settings-title');
        if (settingsTitle) {
            settingsTitle.textContent = 'Page Settings';
        }

        // Get or create page settings
        if (!window.kingsBuilder.pageSettings) {
            window.kingsBuilder.pageSettings = {
                title: document.title || 'Untitled Page',
                description: '',
                keywords: '',
                favicon: '',
                customCSS: '',
                customJS: '',
                bodyClass: '',
                backgroundColor: '#ffffff',
                backgroundImage: '',
                maxWidth: '1200px'
            };
        }

        // Render page settings
        this.renderPageSettings();
    }

    /**
     * Render page settings panel
     */
    renderPageSettings() {
        const settingsContent = document.getElementById('kb-settings-content');
        if (!settingsContent) return;

        const settings = window.kingsBuilder.pageSettings;

        settingsContent.innerHTML = `
            <div class="kb-controls-container">
                <div class="kb-control-group">
                    <label class="kb-control-label">Page Title</label>
                    <input type="text" class="kb-control-input" data-setting="title" value="${settings.title}" placeholder="Enter page title">
                </div>
                
                <div class="kb-control-group">
                    <label class="kb-control-label">Meta Description</label>
                    <textarea class="kb-control-textarea" data-setting="description" placeholder="Enter page description">${settings.description}</textarea>
                </div>
                
                <div class="kb-control-group">
                    <label class="kb-control-label">Keywords</label>
                    <input type="text" class="kb-control-input" data-setting="keywords" value="${settings.keywords}" placeholder="keyword1, keyword2, keyword3">
                </div>
                
                <div class="kb-control-group">
                    <label class="kb-control-label">Background Color</label>
                    <input type="color" class="kb-control-color" data-setting="backgroundColor" value="${settings.backgroundColor}">
                </div>
                
                <div class="kb-control-group">
                    <label class="kb-control-label">Background Image URL</label>
                    <input type="url" class="kb-control-input" data-setting="backgroundImage" value="${settings.backgroundImage}" placeholder="https://example.com/image.jpg">
                </div>
                
                <div class="kb-control-group">
                    <label class="kb-control-label">Max Width</label>
                    <input type="text" class="kb-control-input" data-setting="maxWidth" value="${settings.maxWidth}" placeholder="1200px">
                </div>
                
                <div class="kb-control-group">
                    <label class="kb-control-label">Body CSS Class</label>
                    <input type="text" class="kb-control-input" data-setting="bodyClass" value="${settings.bodyClass}" placeholder="custom-class">
                </div>
                
                <div class="kb-control-group">
                    <label class="kb-control-label">Custom CSS</label>
                    <textarea class="kb-control-textarea" data-setting="customCSS" placeholder="/* Custom CSS */" rows="6">${settings.customCSS}</textarea>
                </div>
                
                <div class="kb-control-group">
                    <label class="kb-control-label">Custom JavaScript</label>
                    <textarea class="kb-control-textarea" data-setting="customJS" placeholder="/* Custom JavaScript */" rows="4">${settings.customJS}</textarea>
                </div>
            </div>
        `;

        // Bind page settings events
        this.bindPageSettingsEvents();
    }

    /**
     * Bind page settings events
     */
    bindPageSettingsEvents() {
        const settingsContent = document.getElementById('kb-settings-content');
        if (!settingsContent) return;

        // Handle input changes
        settingsContent.addEventListener('input', (e) => {
            const setting = e.target.dataset.setting;
            const value = e.target.value;
            
            if (setting && window.kingsBuilder.pageSettings) {
                window.kingsBuilder.pageSettings[setting] = value;
                this.applyPageSetting(setting, value);
                console.log(`?? Updated page setting: ${setting} = ${value}`);
            }
        });
    }

    /**
     * Apply page setting to the page
     */
    applyPageSetting(setting, value) {
        switch (setting) {
            case 'title':
                document.title = value;
                break;
            case 'backgroundColor':
                document.body.style.backgroundColor = value;
                break;
            case 'backgroundImage':
                if (value) {
                    document.body.style.backgroundImage = `url(${value})`;
                } else {
                    document.body.style.backgroundImage = '';
                }
                break;
            case 'bodyClass':
                // Remove old custom classes and add new one
                document.body.className = document.body.className.replace(/kb-custom-\S+/g, '');
                if (value) {
                    document.body.classList.add(`kb-custom-${value}`);
                }
                break;
            case 'customCSS':
                // Update or create custom CSS style tag
                let customStyle = document.getElementById('kb-custom-css');
                if (!customStyle) {
                    customStyle = document.createElement('style');
                    customStyle.id = 'kb-custom-css';
                    document.head.appendChild(customStyle);
                }
                customStyle.textContent = value;
                break;
            case 'maxWidth':
                const canvas = document.getElementById('kb-canvas');
                if (canvas) {
                    canvas.style.maxWidth = value;
                }
                break;
        }
    }
}

// Export for global use
window.ControlsManager = ControlsManager;

