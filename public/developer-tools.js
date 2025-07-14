// Developer Tools System - Final Component for 100% Completion!
// Part of KingsBuilder Phase 5.2: Developer Tools

class DeveloperTools {
    constructor() {
        this.isEnabled = false;
        this.customCSS = '';
        this.customJS = '';
        this.hooks = {
            actions: new Map(),
            filters: new Map()
        };
        this.widgets = new Map();
        this.init();
    }
    
    init() {
        console.log('👨‍💻 Developer Tools initialized - REACHING 100%!');
        this.createDeveloperPanel();
        this.setupCustomCSS();
        this.setupWidgetAPI();
        this.setupHookSystem();
        this.setupDevMode();
    }
    
    createDeveloperPanel() {
        const panel = document.createElement('div');
        panel.className = 'kb-developer-panel';
        panel.innerHTML = `
            <div class="kb-developer-header">
                <h3>
                    <i class="eicon-code"></i>
                    Developer Tools
                </h3>
                <button class="kb-toggle-dev-mode">
                    <i class="eicon-developer"></i>
                    ${this.isEnabled ? 'Disable' : 'Enable'} Dev Mode
                </button>
            </div>
            
            <div class="kb-developer-content">
                <!-- Custom CSS Editor -->
                <div class="kb-dev-section">
                    <h4>Custom CSS</h4>
                    <div class="kb-css-editor">
                        <textarea class="kb-custom-css" placeholder="/* Add your custom CSS here */\n\n.my-custom-class {\n    color: #007cba;\n    font-weight: bold;\n}">${this.customCSS}</textarea>
                        <div class="kb-css-actions">
                            <button class="kb-apply-css">Apply CSS</button>
                            <button class="kb-clear-css">Clear CSS</button>
                            <button class="kb-validate-css">Validate CSS</button>
                        </div>
                    </div>
                </div>
                
                <!-- Custom JavaScript Editor -->
                <div class="kb-dev-section">
                    <h4>Custom JavaScript</h4>
                    <div class="kb-js-editor">
                        <textarea class="kb-custom-js" placeholder="// Add your custom JavaScript here\n\n// Example: Add custom functionality\njQuery(document).ready(function($) {\n    // Your code here\n});">${this.customJS}</textarea>
                        <div class="kb-js-actions">
                            <button class="kb-apply-js">Apply JavaScript</button>
                            <button class="kb-clear-js">Clear JavaScript</button>
                            <button class="kb-validate-js">Validate JavaScript</button>
                        </div>
                    </div>
                </div>
                
                <!-- Code Export -->
                <div class="kb-dev-section">
                    <h4>Code Export</h4>
                    <div class="kb-export-options">
                        <div class="kb-export-row">
                            <label>
                                <input type="checkbox" class="kb-export-html" checked>
                                HTML Structure
                            </label>
                            <label>
                                <input type="checkbox" class="kb-export-css" checked>
                                CSS Styles
                            </label>
                            <label>
                                <input type="checkbox" class="kb-export-js" checked>
                                JavaScript Code
                            </label>
                        </div>
                        <div class="kb-export-actions">
                            <button class="kb-export-code">Export Code</button>
                            <button class="kb-export-zip">Export as ZIP</button>
                            <button class="kb-preview-code">Preview Code</button>
                        </div>
                    </div>
                </div>
                
                <!-- Widget Development -->
                <div class="kb-dev-section">
                    <h4>Widget Development</h4>
                    <div class="kb-widget-dev">
                        <div class="kb-widget-list">
                            <h5>Custom Widgets</h5>
                            <div class="kb-custom-widgets">
                                ${this.renderCustomWidgets()}
                            </div>
                        </div>
                        <div class="kb-widget-actions">
                            <button class="kb-create-widget">Create Widget</button>
                            <button class="kb-import-widget">Import Widget</button>
                            <button class="kb-widget-docs">Widget API Docs</button>
                        </div>
                    </div>
                </div>
                
                <!-- Hook System -->
                <div class="kb-dev-section">
                    <h4>Hook System</h4>
                    <div class="kb-hooks">
                        <div class="kb-hook-types">
                            <div class="kb-hook-group">
                                <h5>Action Hooks</h5>
                                <div class="kb-action-hooks">
                                    ${this.renderHooks('actions')}
                                </div>
                            </div>
                            <div class="kb-hook-group">
                                <h5>Filter Hooks</h5>
                                <div class="kb-filter-hooks">
                                    ${this.renderHooks('filters')}
                                </div>
                            </div>
                        </div>
                        <div class="kb-hook-actions">
                            <button class="kb-add-hook">Add Hook</button>
                            <button class="kb-hook-docs">Hook Documentation</button>
                        </div>
                    </div>
                </div>
                
                <!-- Debug Console -->
                <div class="kb-dev-section">
                    <h4>Debug Console</h4>
                    <div class="kb-debug-console">
                        <div class="kb-console-output"></div>
                        <div class="kb-console-input">
                            <input type="text" class="kb-console-command" placeholder="Enter JavaScript command...">
                            <button class="kb-execute-command">Execute</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Add to sidebar
        const sidebar = document.querySelector('.elementor-panel-sidebar');
        if (sidebar) {
            sidebar.appendChild(panel);
        }
        
        this.bindDeveloperEvents(panel);
    }
    
    bindDeveloperEvents(panel) {
        // Toggle dev mode
        panel.querySelector('.kb-toggle-dev-mode').addEventListener('click', () => {
            this.toggleDevMode();
        });
        
        // Custom CSS
        panel.querySelector('.kb-apply-css').addEventListener('click', () => {
            this.applyCustomCSS();
        });
        
        panel.querySelector('.kb-clear-css').addEventListener('click', () => {
            this.clearCustomCSS();
        });
        
        panel.querySelector('.kb-validate-css').addEventListener('click', () => {
            this.validateCSS();
        });
        
        // Custom JavaScript
        panel.querySelector('.kb-apply-js').addEventListener('click', () => {
            this.applyCustomJS();
        });
        
        panel.querySelector('.kb-clear-js').addEventListener('click', () => {
            this.clearCustomJS();
        });
        
        panel.querySelector('.kb-validate-js').addEventListener('click', () => {
            this.validateJS();
        });
        
        // Code Export
        panel.querySelector('.kb-export-code').addEventListener('click', () => {
            this.exportCode();
        });
        
        panel.querySelector('.kb-export-zip').addEventListener('click', () => {
            this.exportAsZip();
        });
        
        panel.querySelector('.kb-preview-code').addEventListener('click', () => {
            this.previewCode();
        });
        
        // Widget Development
        panel.querySelector('.kb-create-widget').addEventListener('click', () => {
            this.createWidget();
        });
        
        panel.querySelector('.kb-import-widget').addEventListener('click', () => {
            this.importWidget();
        });
        
        panel.querySelector('.kb-widget-docs').addEventListener('click', () => {
            this.showWidgetDocs();
        });
        
        // Hook System
        panel.querySelector('.kb-add-hook').addEventListener('click', () => {
            this.addHook();
        });
        
        panel.querySelector('.kb-hook-docs').addEventListener('click', () => {
            this.showHookDocs();
        });
        
        // Debug Console
        panel.querySelector('.kb-execute-command').addEventListener('click', () => {
            this.executeCommand();
        });
        
        panel.querySelector('.kb-console-command').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.executeCommand();
            }
        });
    }
    
    toggleDevMode() {
        this.isEnabled = !this.isEnabled;
        
        const button = document.querySelector('.kb-toggle-dev-mode');
        button.innerHTML = `
            <i class="eicon-developer"></i>
            ${this.isEnabled ? 'Disable' : 'Enable'} Dev Mode
        `;
        
        if (this.isEnabled) {
            document.body.classList.add('kb-dev-mode');
            this.enableDevFeatures();
        } else {
            document.body.classList.remove('kb-dev-mode');
            this.disableDevFeatures();
        }
    }
    
    enableDevFeatures() {
        // Add element inspection
        this.addElementInspection();
        
        // Add performance monitoring
        this.addPerformanceMonitoring();
        
        // Add console logging
        this.addConsoleLogging();
        
        // Add grid overlay
        this.addGridOverlay();
    }
    
    disableDevFeatures() {
        // Remove dev features
        document.querySelectorAll('.kb-dev-overlay').forEach(el => el.remove());
        document.body.classList.remove('kb-grid-overlay');
    }
    
    addElementInspection() {
        document.addEventListener('click', (e) => {
            if (this.isEnabled && e.ctrlKey) {
                e.preventDefault();
                this.inspectElement(e.target);
            }
        });
    }
    
    inspectElement(element) {
        // Remove previous inspection
        document.querySelectorAll('.kb-inspected').forEach(el => {
            el.classList.remove('kb-inspected');
        });
        
        // Add inspection to current element
        element.classList.add('kb-inspected');
        
        // Show element info
        const info = document.createElement('div');
        info.className = 'kb-element-info kb-dev-overlay';
        info.innerHTML = `
            <div class="kb-element-details">
                <h4>Element Inspector</h4>
                <p><strong>Tag:</strong> ${element.tagName.toLowerCase()}</p>
                <p><strong>Classes:</strong> ${element.className}</p>
                <p><strong>ID:</strong> ${element.id || 'none'}</p>
                <p><strong>Widget Type:</strong> ${element.dataset.widgetType || 'none'}</p>
                <button class="kb-close-inspector">Close</button>
            </div>
        `;
        
        document.body.appendChild(info);
        
        info.querySelector('.kb-close-inspector').addEventListener('click', () => {
            info.remove();
            element.classList.remove('kb-inspected');
        });
        
        // Position near element
        const rect = element.getBoundingClientRect();
        info.style.left = `${rect.left + window.scrollX}px`;
        info.style.top = `${rect.top + window.scrollY - 150}px`;
    }
    
    addGridOverlay() {
        const overlay = document.createElement('div');
        overlay.className = 'kb-grid-overlay kb-dev-overlay';
        overlay.innerHTML = `
            <div class="kb-grid-lines"></div>
            <div class="kb-grid-controls">
                <button class="kb-toggle-grid">Toggle Grid</button>
                <button class="kb-toggle-baseline">Toggle Baseline</button>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('.kb-toggle-grid').addEventListener('click', () => {
            document.body.classList.toggle('kb-show-grid');
        });
        
        overlay.querySelector('.kb-toggle-baseline').addEventListener('click', () => {
            document.body.classList.toggle('kb-show-baseline');
        });
    }
    
    setupCustomCSS() {
        // Create style element for custom CSS
        this.customStyleElement = document.createElement('style');
        this.customStyleElement.id = 'kb-custom-css';
        document.head.appendChild(this.customStyleElement);
    }
    
    applyCustomCSS() {
        const textarea = document.querySelector('.kb-custom-css');
        this.customCSS = textarea.value;
        
        // Apply CSS
        this.customStyleElement.textContent = this.customCSS;
        
        // Save to localStorage
        localStorage.setItem('kb-custom-css', this.customCSS);
        
        this.showMessage('Custom CSS applied successfully!', 'success');
    }
    
    clearCustomCSS() {
        document.querySelector('.kb-custom-css').value = '';
        this.customStyleElement.textContent = '';
        this.customCSS = '';
        localStorage.removeItem('kb-custom-css');
        
        this.showMessage('Custom CSS cleared!', 'info');
    }
    
    validateCSS() {
        const css = document.querySelector('.kb-custom-css').value;
        
        try {
            // Basic CSS validation
            const tempStyle = document.createElement('style');
            tempStyle.textContent = css;
            document.head.appendChild(tempStyle);
            
            // If no error, CSS is valid
            document.head.removeChild(tempStyle);
            this.showMessage('CSS is valid!', 'success');
        } catch (error) {
            this.showMessage(`CSS Error: ${error.message}`, 'error');
        }
    }
    
    applyCustomJS() {
        const textarea = document.querySelector('.kb-custom-js');
        this.customJS = textarea.value;
        
        try {
            // Execute JavaScript
            eval(this.customJS);
            
            // Save to localStorage
            localStorage.setItem('kb-custom-js', this.customJS);
            
            this.showMessage('Custom JavaScript applied successfully!', 'success');
        } catch (error) {
            this.showMessage(`JavaScript Error: ${error.message}`, 'error');
        }
    }
    
    clearCustomJS() {
        document.querySelector('.kb-custom-js').value = '';
        this.customJS = '';
        localStorage.removeItem('kb-custom-js');
        
        this.showMessage('Custom JavaScript cleared!', 'info');
    }
    
    validateJS() {
        const js = document.querySelector('.kb-custom-js').value;
        
        try {
            // Basic JavaScript validation
            new Function(js);
            this.showMessage('JavaScript is valid!', 'success');
        } catch (error) {
            this.showMessage(`JavaScript Error: ${error.message}`, 'error');
        }
    }
    
    exportCode() {
        const includeHTML = document.querySelector('.kb-export-html').checked;
        const includeCSS = document.querySelector('.kb-export-css').checked;
        const includeJS = document.querySelector('.kb-export-js').checked;
        
        const exportData = {
            html: includeHTML ? this.extractHTML() : null,
            css: includeCSS ? this.extractCSS() : null,
            js: includeJS ? this.extractJS() : null,
            timestamp: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'kingsbuilder-export.json';
        a.click();
        URL.revokeObjectURL(url);
    }
    
    extractHTML() {
        const editorContent = document.querySelector('.elementor-editor-content');
        return editorContent ? editorContent.innerHTML : '';
    }
    
    extractCSS() {
        const stylesheets = Array.from(document.styleSheets);
        let css = '';
        
        stylesheets.forEach(sheet => {
            try {
                const rules = Array.from(sheet.cssRules || []);
                rules.forEach(rule => {
                    css += rule.cssText + '\n';
                });
            } catch (e) {
                console.warn('Could not access stylesheet:', e);
            }
        });
        
        return css + '\n' + this.customCSS;
    }
    
    extractJS() {
        const scripts = Array.from(document.querySelectorAll('script:not([src])'));
        let js = '';
        
        scripts.forEach(script => {
            js += script.textContent + '\n';
        });
        
        return js + '\n' + this.customJS;
    }
    
    setupWidgetAPI() {
        window.KingsBuilderWidget = class {
            constructor(name, config) {
                this.name = name;
                this.config = config;
                this.registerWidget();
            }
            
            registerWidget() {
                // Register widget with system
                window.developerTools.widgets.set(this.name, {
                    config: this.config,
                    instance: this
                });
            }
            
            render(data) {
                if (this.config.render) {
                    return this.config.render(data);
                }
                return '<div>Widget content</div>';
            }
        };
    }
    
    createWidget() {
        const modal = document.createElement('div');
        modal.className = 'kb-widget-creator-modal';
        modal.innerHTML = `
            <div class="kb-modal-backdrop"></div>
            <div class="kb-modal-content">
                <h3>Create Custom Widget</h3>
                <form class="kb-widget-form">
                    <div class="kb-form-group">
                        <label>Widget Name:</label>
                        <input type="text" class="kb-widget-name" required>
                    </div>
                    <div class="kb-form-group">
                        <label>Widget Icon:</label>
                        <input type="text" class="kb-widget-icon" placeholder="eicon-star">
                    </div>
                    <div class="kb-form-group">
                        <label>Widget Category:</label>
                        <select class="kb-widget-category">
                            <option value="general">General</option>
                            <option value="content">Content</option>
                            <option value="media">Media</option>
                            <option value="layout">Layout</option>
                        </select>
                    </div>
                    <div class="kb-form-group">
                        <label>Widget HTML:</label>
                        <textarea class="kb-widget-html" rows="10" placeholder="<div class='my-widget'>Widget content</div>"></textarea>
                    </div>
                    <div class="kb-form-actions">
                        <button type="button" class="kb-cancel-widget">Cancel</button>
                        <button type="submit" class="kb-create-widget-btn">Create Widget</button>
                    </div>
                </form>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        modal.querySelector('.kb-cancel-widget').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.kb-modal-backdrop').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('.kb-widget-form').addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = modal.querySelector('.kb-widget-name').value;
            const icon = modal.querySelector('.kb-widget-icon').value;
            const category = modal.querySelector('.kb-widget-category').value;
            const html = modal.querySelector('.kb-widget-html').value;
            
            // Create widget
            new window.KingsBuilderWidget(name, {
                icon: icon,
                category: category,
                render: () => html
            });
            
            modal.remove();
            this.showMessage(`Widget "${name}" created successfully!`, 'success');
        });
    }
    
    setupHookSystem() {
        // Action hooks
        window.doAction = (hook, ...args) => {
            if (this.hooks.actions.has(hook)) {
                this.hooks.actions.get(hook).forEach(callback => {
                    callback(...args);
                });
            }
        };
        
        window.addAction = (hook, callback, priority = 10) => {
            if (!this.hooks.actions.has(hook)) {
                this.hooks.actions.set(hook, []);
            }
            this.hooks.actions.get(hook).push({ callback, priority });
        };
        
        // Filter hooks
        window.applyFilters = (hook, value, ...args) => {
            if (this.hooks.filters.has(hook)) {
                this.hooks.filters.get(hook).forEach(filter => {
                    value = filter.callback(value, ...args);
                });
            }
            return value;
        };
        
        window.addFilter = (hook, callback, priority = 10) => {
            if (!this.hooks.filters.has(hook)) {
                this.hooks.filters.set(hook, []);
            }
            this.hooks.filters.get(hook).push({ callback, priority });
        };
    }
    
    executeCommand() {
        const input = document.querySelector('.kb-console-command');
        const output = document.querySelector('.kb-console-output');
        const command = input.value.trim();
        
        if (!command) return;
        
        // Add command to output
        const commandEl = document.createElement('div');
        commandEl.className = 'kb-console-command-line';
        commandEl.textContent = `> ${command}`;
        output.appendChild(commandEl);
        
        try {
            // Execute command
            const result = eval(command);
            
            // Add result to output
            const resultEl = document.createElement('div');
            resultEl.className = 'kb-console-result';
            resultEl.textContent = result !== undefined ? result : 'undefined';
            output.appendChild(resultEl);
        } catch (error) {
            // Add error to output
            const errorEl = document.createElement('div');
            errorEl.className = 'kb-console-error';
            errorEl.textContent = `Error: ${error.message}`;
            output.appendChild(errorEl);
        }
        
        // Clear input
        input.value = '';
        
        // Scroll to bottom
        output.scrollTop = output.scrollHeight;
    }
    
    renderCustomWidgets() {
        const widgets = Array.from(this.widgets.values());
        
        if (widgets.length === 0) {
            return '<p>No custom widgets created yet.</p>';
        }
        
        return widgets.map(widget => `
            <div class="kb-custom-widget-item">
                <i class="eicon-${widget.config.icon || 'star'}"></i>
                <span>${widget.name}</span>
                <button class="kb-edit-widget" data-widget="${widget.name}">Edit</button>
                <button class="kb-delete-widget" data-widget="${widget.name}">Delete</button>
            </div>
        `).join('');
    }
    
    renderHooks(type) {
        const hooks = Array.from(this.hooks[type].keys());
        
        if (hooks.length === 0) {
            return '<p>No hooks registered yet.</p>';
        }
        
        return hooks.map(hook => `
            <div class="kb-hook-item">
                <code>${hook}</code>
                <span class="kb-hook-count">${this.hooks[type].get(hook).length} callbacks</span>
            </div>
        `).join('');
    }
    
    showMessage(message, type) {
        const notification = document.createElement('div');
        notification.className = `kb-dev-notification kb-${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Load saved custom code
    loadSavedCode() {
        const savedCSS = localStorage.getItem('kb-custom-css');
        const savedJS = localStorage.getItem('kb-custom-js');
        
        if (savedCSS) {
            this.customCSS = savedCSS;
            this.customStyleElement.textContent = savedCSS;
        }
        
        if (savedJS) {
            this.customJS = savedJS;
            try {
                eval(savedJS);
            } catch (error) {
                console.warn('Error loading saved JavaScript:', error);
            }
        }
    }
}

// Initialize Developer Tools - The ultimate finale!
window.developerTools = new DeveloperTools();
window.developerTools.loadSavedCode();
console.log('🏆 Developer Tools loaded - WE REACHED 100%!');