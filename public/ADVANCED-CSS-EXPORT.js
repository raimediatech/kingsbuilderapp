// 💻 ADVANCED CSS SYSTEM & CODE EXPORT - Professional Development Tools
// Completes Phase 5: Developer Features - Custom CSS System & Code Export
console.log('💻 ADVANCED CSS & EXPORT: Loading professional development tools...');

class AdvancedCSSExport {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.customCSS = '';
        this.customJS = '';
        this.exportSettings = {
            includeCSS: true,
            includeJS: true,
            minify: false,
            responsive: true,
            framework: 'vanilla'
        };
        
        if (this.isBuilder) {
            this.init();
        }
    }

    init() {
        console.log('🔧 Initializing Advanced CSS System & Code Export...');
        
        setTimeout(() => {
            this.setupCSSEditor();
            this.setupCodeExport();
            this.addDeveloperTab();
            this.initializeCodeEditor();
            console.log('✅ ADVANCED CSS & EXPORT: Professional development tools active!');
        }, 3500);
    }

    addDeveloperTab() {
        const navTabs = document.querySelector('.nav-tabs, .builder-nav, .sidebar-nav');
        if (!navTabs) return;
        
        // Check if developer tab already exists
        if (document.querySelector('[data-tab="developer"]')) return;
        
        const devTab = document.createElement('div');
        devTab.className = 'nav-tab';
        devTab.setAttribute('data-tab', 'developer');
        devTab.innerHTML = `
            <i class="fas fa-code"></i>
            <span>Code</span>
        `;
        
        devTab.style.cssText = `
            padding: 12px 16px;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.3s;
            display: flex;
            align-items: center;
            gap: 8px;
            color: #6b7280;
            font-weight: 500;
        `;
        
        devTab.addEventListener('click', () => this.showDeveloperPanel());
        navTabs.appendChild(devTab);
    }

    setupCSSEditor() {
        console.log('🎨 Setting up advanced CSS editor...');
        
        this.createDeveloperPanel();
    }

    createDeveloperPanel() {
        const sidebar = document.querySelector('.sidebar, .left-panel, .builder-sidebar');
        if (!sidebar) return;
        
        const devPanel = document.createElement('div');
        devPanel.id = 'developer-panel';
        devPanel.className = 'panel-content';
        devPanel.style.display = 'none';
        
        devPanel.innerHTML = `
            <div class="developer-panel-content" style="padding: 20px; height: 100%; overflow-y: auto; font-family: 'Inter', sans-serif;">
                
                <!-- CSS Editor Section -->
                <div class="css-editor-section" style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-palette"></i>
                        Custom CSS Editor
                    </h3>
                    
                    <div class="css-editor-tabs" style="display: flex; gap: 5px; margin-bottom: 15px;">
                        <button onclick="advancedCSSExport.switchCSSTab('custom')" 
                                class="css-tab active" data-tab="custom"
                                style="padding: 8px 16px; background: #3b82f6; color: white; border: none; border-radius: 6px 6px 0 0; font-size: 12px; cursor: pointer; transition: all 0.3s;">
                            Custom CSS
                        </button>
                        <button onclick="advancedCSSExport.switchCSSTab('generated')" 
                                class="css-tab" data-tab="generated"
                                style="padding: 8px 16px; background: #f3f4f6; color: #6b7280; border: none; border-radius: 6px 6px 0 0; font-size: 12px; cursor: pointer; transition: all 0.3s;">
                            Generated CSS
                        </button>
                        <button onclick="advancedCSSExport.switchCSSTab('variables')" 
                                class="css-tab" data-tab="variables"
                                style="padding: 8px 16px; background: #f3f4f6; color: #6b7280; border: none; border-radius: 6px 6px 0 0; font-size: 12px; cursor: pointer; transition: all 0.3s;">
                            CSS Variables
                        </button>
                    </div>
                    
                    <div class="css-editor-container" style="position: relative;">
                        <textarea id="css-editor" placeholder="/* Add your custom CSS here */
.my-custom-class {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    border-radius: 12px;
    color: white;
}

/* Responsive styles */
@media (max-width: 768px) {
    .my-custom-class {
        padding: 15px;
    }
}"
                                  style="width: 100%; height: 200px; padding: 15px; border: 2px solid #e5e7eb; border-radius: 0 8px 8px 8px; font-family: 'Monaco', 'Menlo', monospace; font-size: 12px; line-height: 1.5; resize: vertical; background: #1e1e1e; color: #d4d4d4; outline: none;"></textarea>
                        
                        <div class="css-editor-actions" style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
                            <button onclick="advancedCSSExport.formatCSS()" title="Format CSS"
                                    style="background: rgba(59,130,246,0.1); color: #3b82f6; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                                <i class="fas fa-magic"></i>
                            </button>
                            <button onclick="advancedCSSExport.validateCSS()" title="Validate CSS"
                                    style="background: rgba(16,185,129,0.1); color: #10b981; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                                <i class="fas fa-check"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="css-actions" style="display: flex; gap: 10px; margin-top: 15px;">
                        <button onclick="advancedCSSExport.applyCustomCSS()" 
                                style="flex: 1; background: #3b82f6; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-play"></i> Apply CSS
                        </button>
                        <button onclick="advancedCSSExport.resetCSS()" 
                                style="background: #6b7280; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-undo"></i>
                        </button>
                    </div>
                </div>
                
                <!-- JavaScript Editor Section -->
                <div class="js-editor-section" style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-code"></i>
                        Custom JavaScript
                    </h3>
                    
                    <div class="js-editor-container" style="position: relative;">
                        <textarea id="js-editor" placeholder="// Add your custom JavaScript here
document.addEventListener('DOMContentLoaded', function() {
    // Your custom code here
    console.log('Custom JavaScript loaded!');
    
    // Example: Add click handlers
    document.querySelectorAll('.my-button').forEach(button => {
        button.addEventListener('click', function() {
            alert('Button clicked!');
        });
    });
});"
                                  style="width: 100%; height: 150px; padding: 15px; border: 2px solid #e5e7eb; border-radius: 8px; font-family: 'Monaco', 'Menlo', monospace; font-size: 12px; line-height: 1.5; resize: vertical; background: #1e1e1e; color: #d4d4d4; outline: none;"></textarea>
                        
                        <div class="js-editor-actions" style="position: absolute; top: 10px; right: 10px; display: flex; gap: 5px;">
                            <button onclick="advancedCSSExport.formatJS()" title="Format JavaScript"
                                    style="background: rgba(245,158,11,0.1); color: #f59e0b; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                                <i class="fas fa-magic"></i>
                            </button>
                            <button onclick="advancedCSSExport.validateJS()" title="Validate JavaScript"
                                    style="background: rgba(16,185,129,0.1); color: #10b981; border: none; width: 24px; height: 24px; border-radius: 4px; cursor: pointer; font-size: 10px;">
                                <i class="fas fa-check"></i>
                            </button>
                        </div>
                    </div>
                    
                    <div class="js-actions" style="display: flex; gap: 10px; margin-top: 15px;">
                        <button onclick="advancedCSSExport.applyCustomJS()" 
                                style="flex: 1; background: #f59e0b; color: white; border: none; padding: 10px; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-play"></i> Apply JavaScript
                        </button>
                        <button onclick="advancedCSSExport.resetJS()" 
                                style="background: #6b7280; color: white; border: none; padding: 10px 15px; border-radius: 6px; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-undo"></i>
                        </button>
                    </div>
                </div>
                
                <!-- Code Export Section -->
                <div class="export-section" style="margin-bottom: 30px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-download"></i>
                        Code Export
                    </h3>
                    
                    <div class="export-options" style="background: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 15px;">
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #374151;">
                                <input type="checkbox" checked onchange="advancedCSSExport.updateExportSetting('includeCSS', this.checked)" 
                                       style="accent-color: #3b82f6;">
                                Include CSS
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #374151;">
                                <input type="checkbox" checked onchange="advancedCSSExport.updateExportSetting('includeJS', this.checked)" 
                                       style="accent-color: #3b82f6;">
                                Include JavaScript
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #374151;">
                                <input type="checkbox" onchange="advancedCSSExport.updateExportSetting('minify', this.checked)" 
                                       style="accent-color: #3b82f6;">
                                Minify Code
                            </label>
                            <label style="display: flex; align-items: center; gap: 8px; font-size: 14px; color: #374151;">
                                <input type="checkbox" checked onchange="advancedCSSExport.updateExportSetting('responsive', this.checked)" 
                                       style="accent-color: #3b82f6;">
                                Responsive
                            </label>
                        </div>
                        
                        <div style="margin-bottom: 15px;">
                            <label style="display: block; margin-bottom: 5px; font-size: 12px; font-weight: 500; color: #374151;">Framework:</label>
                            <select onchange="advancedCSSExport.updateExportSetting('framework', this.value)" 
                                    style="width: 100%; padding: 8px; border: 1px solid #d1d5db; border-radius: 6px; font-size: 14px;">
                                <option value="vanilla">Vanilla HTML/CSS/JS</option>
                                <option value="bootstrap">Bootstrap 5</option>
                                <option value="tailwind">Tailwind CSS</option>
                                <option value="react">React Component</option>
                                <option value="vue">Vue Component</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="export-actions" style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        <button onclick="advancedCSSExport.exportHTML()" 
                                style="background: #10b981; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-file-code"></i> Export HTML
                        </button>
                        <button onclick="advancedCSSExport.exportCSS()" 
                                style="background: #3b82f6; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-file-alt"></i> Export CSS
                        </button>
                        <button onclick="advancedCSSExport.exportJS()" 
                                style="background: #f59e0b; color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-file-code"></i> Export JS
                        </button>
                        <button onclick="advancedCSSExport.exportComplete()" 
                                style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; padding: 12px; border-radius: 6px; font-weight: 500; cursor: pointer; transition: all 0.3s;">
                            <i class="fas fa-archive"></i> Export All
                        </button>
                    </div>
                </div>
                
                <!-- Code Snippets Section -->
                <div class="snippets-section">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; font-weight: 600; color: #1f2937; display: flex; align-items: center; gap: 8px;">
                        <i class="fas fa-puzzle-piece"></i>
                        Code Snippets
                    </h3>
                    
                    <div class="snippets-grid" style="display: grid; grid-template-columns: 1fr; gap: 10px;">
                        ${this.renderCodeSnippets()}
                    </div>
                </div>
            </div>
        `;
        
        sidebar.appendChild(devPanel);
    }

    renderCodeSnippets() {
        const snippets = [
            {
                name: 'Smooth Scroll',
                description: 'Add smooth scrolling to anchor links',
                code: `html { scroll-behavior: smooth; }`
            },
            {
                name: 'Hover Effects',
                description: 'Professional hover animations',
                code: `.hover-effect { transition: all 0.3s ease; }
.hover-effect:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0,0,0,0.15); }`
            },
            {
                name: 'Responsive Grid',
                description: 'Auto-responsive grid layout',
                code: `.responsive-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; }`
            },
            {
                name: 'Loading Animation',
                description: 'CSS loading spinner',
                code: `.spinner { border: 3px solid #f3f3f3; border-top: 3px solid #3b82f6; border-radius: 50%; width: 30px; height: 30px; animation: spin 1s linear infinite; }
@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`
            }
        ];
        
        return snippets.map(snippet => `
            <div class="code-snippet" 
                 onclick="advancedCSSExport.insertSnippet('${snippet.code.replace(/'/g, "\\'").replace(/\n/g, '\\n')}')"
                 style="background: white; border: 2px solid #e5e7eb; border-radius: 8px; padding: 12px; cursor: pointer; transition: all 0.3s;"
                 onmouseover="this.style.borderColor='#3b82f6'; this.style.transform='translateY(-1px)'"
                 onmouseout="this.style.borderColor='#e5e7eb'; this.style.transform='translateY(0)'">
                <h5 style="margin: 0 0 5px 0; font-size: 14px; font-weight: 600; color: #1f2937;">${snippet.name}</h5>
                <p style="margin: 0; font-size: 12px; color: #6b7280; line-height: 1.4;">${snippet.description}</p>
            </div>
        `).join('');
    }

    showDeveloperPanel() {
        // Hide all other panels
        document.querySelectorAll('.panel-content').forEach(panel => {
            panel.style.display = 'none';
        });
        
        // Show developer panel
        const devPanel = document.getElementById('developer-panel');
        if (devPanel) {
            devPanel.style.display = 'block';
        }
        
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.background = 'transparent';
            tab.style.color = '#6b7280';
        });
        
        const devTab = document.querySelector('[data-tab="developer"]');
        if (devTab) {
            devTab.classList.add('active');
            devTab.style.background = '#3b82f6';
            devTab.style.color = 'white';
        }
    }

    switchCSSTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.css-tab').forEach(tab => {
            tab.classList.remove('active');
            tab.style.background = '#f3f4f6';
            tab.style.color = '#6b7280';
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.style.background = '#3b82f6';
            activeTab.style.color = 'white';
        }
        
        // Update editor content
        const editor = document.getElementById('css-editor');
        if (editor) {
            switch (tabName) {
                case 'custom':
                    editor.value = this.customCSS;
                    editor.placeholder = '/* Add your custom CSS here */';
                    editor.readOnly = false;
                    break;
                case 'generated':
                    editor.value = this.generateCurrentCSS();
                    editor.placeholder = '/* Generated CSS from your design */';
                    editor.readOnly = true;
                    break;
                case 'variables':
                    editor.value = this.generateCSSVariables();
                    editor.placeholder = '/* CSS Custom Properties */';
                    editor.readOnly = true;
                    break;
            }
        }
    }

    generateCurrentCSS() {
        let css = `/* Generated CSS from KingsBuilder */\n\n`;
        
        // Add global styles
        css += `:root {
    --primary-color: #3b82f6;
    --secondary-color: #8b5cf6;
    --accent-color: #10b981;
    --text-color: #1f2937;
    --background-color: #ffffff;
    --border-radius: 8px;
    --box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Global Styles */
* {
    box-sizing: border-box;
}

body {
    font-family: 'Inter', system-ui, sans-serif;
    line-height: 1.6;
    color: var(--text-color);
    background: var(--background-color);
    margin: 0;
    padding: 0;
}

/* Container Styles */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
}

/* Button Styles */
.btn {
    display: inline-block;
    padding: 12px 24px;
    background: var(--primary-color);
    color: white;
    text-decoration: none;
    border: none;
    border-radius: var(--border-radius);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn:hover {
    transform: translateY(-2px);
    box-shadow: var(--box-shadow);
}

/* Element Styles */
.kb-element {
    margin-bottom: 20px;
    position: relative;
}

.kb-element:hover {
    outline: 2px solid var(--primary-color);
    outline-offset: 2px;
}

/* Responsive Styles */
@media (max-width: 768px) {
    .container {
        padding: 0 15px;
    }
    
    .kb-element {
        margin-bottom: 15px;
    }
}

`;
        
        // Add element-specific styles
        document.querySelectorAll('.kb-element').forEach(element => {
            const elementType = element.getAttribute('data-element-type');
            const elementId = element.getAttribute('data-element-id');
            
            if (elementType && elementId) {
                css += `/* ${elementType} element styles */\n`;
                css += `[data-element-id="${elementId}"] {\n`;
                
                const computedStyle = window.getComputedStyle(element);
                const importantStyles = ['background', 'color', 'font-size', 'padding', 'margin', 'border-radius'];
                
                importantStyles.forEach(prop => {
                    const value = computedStyle.getPropertyValue(prop);
                    if (value && value !== 'initial' && value !== 'normal') {
                        css += `    ${prop}: ${value};\n`;
                    }
                });
                
                css += `}\n\n`;
            }
        });
        
        return css;
    }

    generateCSSVariables() {
        return `:root {
    /* Colors */
    --primary-color: #3b82f6;
    --primary-hover: #2563eb;
    --secondary-color: #8b5cf6;
    --secondary-hover: #7c3aed;
    --accent-color: #10b981;
    --accent-hover: #059669;
    
    /* Text Colors */
    --text-primary: #1f2937;
    --text-secondary: #6b7280;
    --text-muted: #9ca3af;
    
    /* Background Colors */
    --bg-primary: #ffffff;
    --bg-secondary: #f9fafb;
    --bg-tertiary: #f3f4f6;
    
    /* Border Colors */
    --border-light: #e5e7eb;
    --border-medium: #d1d5db;
    --border-dark: #9ca3af;
    
    /* Spacing */
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 16px;
    --spacing-lg: 24px;
    --spacing-xl: 32px;
    --spacing-2xl: 48px;
    
    /* Typography */
    --font-family-sans: 'Inter', system-ui, sans-serif;
    --font-family-serif: 'Georgia', serif;
    --font-family-mono: 'Monaco', 'Menlo', monospace;
    
    --font-size-xs: 12px;
    --font-size-sm: 14px;
    --font-size-base: 16px;
    --font-size-lg: 18px;
    --font-size-xl: 20px;
    --font-size-2xl: 24px;
    --font-size-3xl: 30px;
    --font-size-4xl: 36px;
    
    --font-weight-light: 300;
    --font-weight-normal: 400;
    --font-weight-medium: 500;
    --font-weight-semibold: 600;
    --font-weight-bold: 700;
    
    --line-height-tight: 1.25;
    --line-height-normal: 1.5;
    --line-height-relaxed: 1.75;
    
    /* Borders & Radius */
    --border-radius-sm: 4px;
    --border-radius-md: 8px;
    --border-radius-lg: 12px;
    --border-radius-xl: 16px;
    --border-radius-full: 9999px;
    
    /* Shadows */
    --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
    --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
    --shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.1);
    --shadow-xl: 0 20px 25px rgba(0, 0, 0, 0.1);
    
    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-normal: 0.3s ease;
    --transition-slow: 0.5s ease;
    
    /* Z-Index */
    --z-dropdown: 1000;
    --z-sticky: 1020;
    --z-fixed: 1030;
    --z-modal: 1040;
    --z-popover: 1050;
    --z-tooltip: 1060;
}

/* Dark mode variables */
@media (prefers-color-scheme: dark) {
    :root {
        --text-primary: #f9fafb;
        --text-secondary: #d1d5db;
        --text-muted: #9ca3af;
        
        --bg-primary: #111827;
        --bg-secondary: #1f2937;
        --bg-tertiary: #374151;
        
        --border-light: #374151;
        --border-medium: #4b5563;
        --border-dark: #6b7280;
    }
}`;
    }

    applyCustomCSS() {
        const editor = document.getElementById('css-editor');
        if (!editor) return;
        
        this.customCSS = editor.value;
        
        // Remove existing custom styles
        const existingStyle = document.getElementById('custom-css-styles');
        if (existingStyle) {
            existingStyle.remove();
        }
        
        // Add new custom styles
        const style = document.createElement('style');
        style.id = 'custom-css-styles';
        style.textContent = this.customCSS;
        document.head.appendChild(style);
        
        this.showSuccessMessage('Custom CSS applied successfully!');
    }

    applyCustomJS() {
        const editor = document.getElementById('js-editor');
        if (!editor) return;
        
        this.customJS = editor.value;
        
        // Remove existing custom scripts
        const existingScript = document.getElementById('custom-js-script');
        if (existingScript) {
            existingScript.remove();
        }
        
        // Add new custom script
        try {
            const script = document.createElement('script');
            script.id = 'custom-js-script';
            script.textContent = this.customJS;
            document.head.appendChild(script);
            
            this.showSuccessMessage('Custom JavaScript applied successfully!');
        } catch (error) {
            this.showErrorMessage('JavaScript error: ' + error.message);
        }
    }

    formatCSS() {
        const editor = document.getElementById('css-editor');
        if (!editor) return;
        
        try {
            // Simple CSS formatting
            let css = editor.value;
            css = css.replace(/\s*{\s*/g, ' {\n    ');
            css = css.replace(/;\s*/g, ';\n    ');
            css = css.replace(/\s*}\s*/g, '\n}\n\n');
            css = css.replace(/,\s*/g, ',\n');
            
            editor.value = css;
            this.showSuccessMessage('CSS formatted successfully!');
        } catch (error) {
            this.showErrorMessage('CSS formatting failed: ' + error.message);
        }
    }

    formatJS() {
        const editor = document.getElementById('js-editor');
        if (!editor) return;
        
        try {
            // Simple JS formatting
            let js = editor.value;
            js = js.replace(/\s*{\s*/g, ' {\n    ');
            js = js.replace(/;\s*/g, ';\n    ');
            js = js.replace(/\s*}\s*/g, '\n}\n\n');
            
            editor.value = js;
            this.showSuccessMessage('JavaScript formatted successfully!');
        } catch (error) {
            this.showErrorMessage('JavaScript formatting failed: ' + error.message);
        }
    }

    validateCSS() {
        const editor = document.getElementById('css-editor');
        if (!editor) return;
        
        const css = editor.value;
        
        // Basic CSS validation
        const openBraces = (css.match(/{/g) || []).length;
        const closeBraces = (css.match(/}/g) || []).length;
        
        if (openBraces !== closeBraces) {
            this.showErrorMessage('CSS validation failed: Mismatched braces');
            return;
        }
        
        // Check for common CSS errors
        const lines = css.split('\n');
        let errors = [];
        
        lines.forEach((line, index) => {
            if (line.includes(':') && !line.includes(';') && !line.includes('{') && !line.includes('}') && line.trim() !== '') {
                errors.push(`Line ${index + 1}: Missing semicolon`);
            }
        });
        
        if (errors.length > 0) {
            this.showErrorMessage('CSS validation failed:\n' + errors.join('\n'));
        } else {
            this.showSuccessMessage('CSS validation passed!');
        }
    }

    validateJS() {
        const editor = document.getElementById('js-editor');
        if (!editor) return;
        
        const js = editor.value;
        
        try {
            // Basic syntax check
            new Function(js);
            this.showSuccessMessage('JavaScript validation passed!');
        } catch (error) {
            this.showErrorMessage('JavaScript validation failed: ' + error.message);
        }
    }

    resetCSS() {
        const editor = document.getElementById('css-editor');
        if (editor && confirm('Are you sure you want to reset the CSS editor?')) {
            editor.value = '';
            this.customCSS = '';
            
            const existingStyle = document.getElementById('custom-css-styles');
            if (existingStyle) {
                existingStyle.remove();
            }
            
            this.showSuccessMessage('CSS editor reset!');
        }
    }

    resetJS() {
        const editor = document.getElementById('js-editor');
        if (editor && confirm('Are you sure you want to reset the JavaScript editor?')) {
            editor.value = '';
            this.customJS = '';
            
            const existingScript = document.getElementById('custom-js-script');
            if (existingScript) {
                existingScript.remove();
            }
            
            this.showSuccessMessage('JavaScript editor reset!');
        }
    }

    insertSnippet(code) {
        const editor = document.getElementById('css-editor');
        if (!editor) return;
        
        const currentValue = editor.value;
        const newValue = currentValue + (currentValue ? '\n\n' : '') + code.replace(/\\n/g, '\n').replace(/\\'/g, "'");
        editor.value = newValue;
        
        this.showSuccessMessage('Code snippet inserted!');
    }

    updateExportSetting(setting, value) {
        this.exportSettings[setting] = value;
        console.log(`Export setting updated: ${setting} = ${value}`);
    }

    setupCodeExport() {
        console.log('📦 Setting up code export system...');
    }

    exportHTML() {
        console.log('📄 Exporting HTML...');
        
        const canvas = document.querySelector('.canvas, .builder-canvas, #canvas');
        if (!canvas) {
            this.showErrorMessage('No content to export');
            return;
        }
        
        let html = this.generateCompleteHTML();
        
        if (this.exportSettings.minify) {
            html = this.minifyHTML(html);
        }
        
        this.downloadFile('index.html', html, 'text/html');
        this.showSuccessMessage('HTML exported successfully!');
    }

    exportCSS() {
        console.log('🎨 Exporting CSS...');
        
        let css = this.generateCurrentCSS();
        
        if (this.customCSS) {
            css += '\n\n/* Custom CSS */\n' + this.customCSS;
        }
        
        if (this.exportSettings.minify) {
            css = this.minifyCSS(css);
        }
        
        this.downloadFile('styles.css', css, 'text/css');
        this.showSuccessMessage('CSS exported successfully!');
    }

    exportJS() {
        console.log('⚡ Exporting JavaScript...');
        
        let js = this.generateJavaScript();
        
        if (this.customJS) {
            js += '\n\n// Custom JavaScript\n' + this.customJS;
        }
        
        if (this.exportSettings.minify) {
            js = this.minifyJS(js);
        }
        
        this.downloadFile('script.js', js, 'text/javascript');
        this.showSuccessMessage('JavaScript exported successfully!');
    }

    exportComplete() {
        console.log('📦 Exporting complete project...');
        
        const files = {
            'index.html': this.generateCompleteHTML(),
            'styles.css': this.generateCurrentCSS() + (this.customCSS ? '\n\n/* Custom CSS */\n' + this.customCSS : ''),
            'script.js': this.generateJavaScript() + (this.customJS ? '\n\n// Custom JavaScript\n' + this.customJS : ''),
            'README.md': this.generateReadme()
        };
        
        // Create and download ZIP file (simplified version)
        this.downloadMultipleFiles(files);
        this.showSuccessMessage('Complete project exported successfully!');
    }

    generateCompleteHTML() {
        const canvas = document.querySelector('.canvas, .builder-canvas, #canvas');
        const canvasContent = canvas ? canvas.innerHTML : '<p>No content available</p>';
        
        // Clean up the content (remove builder-specific elements)
        let cleanContent = canvasContent;
        cleanContent = cleanContent.replace(/<div class="kb-element-controls".*?<\/div>/gs, '');
        cleanContent = cleanContent.replace(/data-element-id="[^"]*"/g, '');
        cleanContent = cleanContent.replace(/class="kb-element[^"]*"/g, '');
        
        const framework = this.exportSettings.framework;
        
        let html = '';
        
        switch (framework) {
            case 'bootstrap':
                html = this.generateBootstrapHTML(cleanContent);
                break;
            case 'tailwind':
                html = this.generateTailwindHTML(cleanContent);
                break;
            case 'react':
                html = this.generateReactComponent(cleanContent);
                break;
            case 'vue':
                html = this.generateVueComponent(cleanContent);
                break;
            default:
                html = this.generateVanillaHTML(cleanContent);
        }
        
        return html;
    }

    generateVanillaHTML(content) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KingsBuilder Export</title>
    <meta name="description" content="Created with KingsBuilder - Professional Page Builder">
    
    <!-- Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    ${this.exportSettings.includeCSS ? '<link rel="stylesheet" href="styles.css">' : ''}
    
    <style>
        /* Critical CSS */
        * { box-sizing: border-box; }
        body { margin: 0; font-family: 'Inter', sans-serif; line-height: 1.6; }
        .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    </style>
</head>
<body>
    <main>
        ${content}
    </main>
    
    ${this.exportSettings.includeJS ? '<script src="script.js"></script>' : ''}
    
    <!-- KingsBuilder Export -->
    <script>
        console.log('🚀 Powered by KingsBuilder - Professional Page Builder');
    </script>
</body>
</html>`;
    }

    generateBootstrapHTML(content) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KingsBuilder Export - Bootstrap</title>
    
    <!-- Bootstrap CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    ${this.exportSettings.includeCSS ? '<link rel="stylesheet" href="styles.css">' : ''}
</head>
<body>
    <main class="container-fluid">
        ${content}
    </main>
    
    <!-- Bootstrap JS -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    ${this.exportSettings.includeJS ? '<script src="script.js"></script>' : ''}
</body>
</html>`;
    }

    generateTailwindHTML(content) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KingsBuilder Export - Tailwind</title>
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    ${this.exportSettings.includeCSS ? '<link rel="stylesheet" href="styles.css">' : ''}
</head>
<body class="font-sans">
    <main class="container mx-auto px-4">
        ${content}
    </main>
    
    ${this.exportSettings.includeJS ? '<script src="script.js"></script>' : ''}
</body>
</html>`;
    }

    generateReactComponent(content) {
        return `import React from 'react';
import './styles.css';

const KingsBuilderComponent = () => {
    return (
        <div className="kingsbuilder-component">
            ${content.replace(/class=/g, 'className=')}
        </div>
    );
};

export default KingsBuilderComponent;`;
    }

    generateVueComponent(content) {
        return `<template>
    <div class="kingsbuilder-component">
        ${content}
    </div>
</template>

<script>
export default {
    name: 'KingsBuilderComponent',
    data() {
        return {
            // Component data
        };
    },
    methods: {
        // Component methods
    }
};
</script>

<style scoped>
/* Component styles */
</style>`;
    }

    generateJavaScript() {
        return `// KingsBuilder Generated JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 KingsBuilder page loaded');
    
    // Initialize interactive elements
    initializeInteractiveElements();
    
    // Initialize smooth scrolling
    initializeSmoothScrolling();
    
    // Initialize animations
    initializeAnimations();
});

function initializeInteractiveElements() {
    // Button interactions
    document.querySelectorAll('button, .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Add click animation
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 150);
        });
    });
    
    // Modal functionality
    document.querySelectorAll('[data-modal-trigger]').forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal-trigger');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.style.display = 'block';
            }
        });
    });
    
    // Close modals
    document.querySelectorAll('[data-modal-close]').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        });
    });
}

function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

function initializeAnimations() {
    // Intersection Observer for scroll animations
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = \`notification notification-\${type}\`;
    notification.textContent = message;
    notification.style.cssText = \`
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: \${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    \`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}`;
    }

    generateReadme() {
        return `# KingsBuilder Export

This project was created with **KingsBuilder** - Professional Page Builder.

## Files Included

- \`index.html\` - Main HTML file
- \`styles.css\` - Stylesheet with all design elements
- \`script.js\` - JavaScript for interactive functionality

## Features

- ✅ Responsive design
- ✅ Modern CSS with custom properties
- ✅ Interactive JavaScript elements
- ✅ Professional animations and transitions
- ✅ Cross-browser compatibility

## Usage

1. Open \`index.html\` in your web browser
2. Upload files to your web server
3. Customize styles in \`styles.css\`
4. Add custom functionality in \`script.js\`

## Framework

Framework: ${this.exportSettings.framework}
Responsive: ${this.exportSettings.responsive ? 'Yes' : 'No'}
Minified: ${this.exportSettings.minify ? 'Yes' : 'No'}

## Support

Created with KingsBuilder - Professional Page Builder
Visit: https://kingsbuilder.com

---

*Generated on ${new Date().toLocaleDateString()}*`;
    }

    minifyHTML(html) {
        return html
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .trim();
    }

    minifyCSS(css) {
        return css
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .replace(/\s*{\s*/g, '{')
            .replace(/;\s*/g, ';')
            .trim();
    }

    minifyJS(js) {
        return js
            .replace(/\s+/g, ' ')
            .replace(/;\s*}/g, '}')
            .replace(/\s*{\s*/g, '{')
            .trim();
    }

    downloadFile(filename, content, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.click();
        URL.revokeObjectURL(url);
    }

    downloadMultipleFiles(files) {
        // Simple implementation - download files individually
        Object.entries(files).forEach(([filename, content]) => {
            setTimeout(() => {
                this.downloadFile(filename, content, 'text/plain');
            }, 100);
        });
    }

    initializeCodeEditor() {
        console.log('🔧 Initializing code editor features...');
        
        // Add syntax highlighting styles
        const editorCSS = document.createElement('style');
        editorCSS.id = 'code-editor-styles';
        editorCSS.textContent = `
            #css-editor, #js-editor {
                font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace !important;
                tab-size: 2;
                -moz-tab-size: 2;
            }
            
            .code-snippet:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .css-tab:hover, .export-actions button:hover {
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            }
            
            .developer-panel-content {
                scrollbar-width: thin;
                scrollbar-color: #d1d5db #f9fafb;
            }
            
            .developer-panel-content::-webkit-scrollbar {
                width: 6px;
            }
            
            .developer-panel-content::-webkit-scrollbar-track {
                background: #f9fafb;
            }
            
            .developer-panel-content::-webkit-scrollbar-thumb {
                background: #d1d5db;
                border-radius: 3px;
            }
        `;
        
        document.head.appendChild(editorCSS);
    }

    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #10b981; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-check-circle"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    showErrorMessage(message) {
        const notification = document.createElement('div');
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #ef4444; color: white; padding: 15px 20px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 10000; display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-circle"></i>
                ${message}
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }
}

// Initialize Advanced CSS & Export System
console.log('💻 ADVANCED CSS & EXPORT: Initializing...');
window.advancedCSSExport = new AdvancedCSSExport();

console.log('✅ ADVANCED CSS & EXPORT: Professional development tools loaded!');