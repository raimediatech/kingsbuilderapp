// 🎨 ELEMENTOR-STYLE WIDGET OPTIONS - Complete widget options system like Elementor
console.log('🎨 ELEMENTOR-STYLE WIDGET OPTIONS: Loading...');

class ElementorStyleWidgetOptions {
    constructor() {
        this.currentElement = null;
        this.currentTab = 'content';
        this.init();
    }

    init() {
        console.log('🔧 Initializing Elementor-style widget options...');
        
        // Wait for page to load
        setTimeout(() => {
            this.createOptionsPanel();
            this.setupEventListeners();
            this.setupRightClickMenu();
            console.log('✅ ELEMENTOR-STYLE WIDGET OPTIONS: Loaded!');
        }, 2000);
    }

    createOptionsPanel() {
        // Remove existing options panel
        const existing = document.getElementById('elementor-widget-options');
        if (existing) existing.remove();

        const optionsPanel = document.createElement('div');
        optionsPanel.id = 'elementor-widget-options';
        optionsPanel.innerHTML = `
            <div class="elementor-panel">
                <div class="elementor-panel-header">
                    <div class="elementor-panel-header-title">
                        <span id="widget-title">Select an Element</span>
                    </div>
                    <div class="elementor-panel-header-close">
                        <i class="fas fa-times"></i>
                    </div>
                </div>
                
                <div class="elementor-panel-navigation">
                    <div class="elementor-panel-navigation-tab active" data-tab="content">
                        <i class="fas fa-edit"></i>
                        <span>Content</span>
                    </div>
                    <div class="elementor-panel-navigation-tab" data-tab="style">
                        <i class="fas fa-paint-brush"></i>
                        <span>Style</span>
                    </div>
                    <div class="elementor-panel-navigation-tab" data-tab="advanced">
                        <i class="fas fa-cogs"></i>
                        <span>Advanced</span>
                    </div>
                </div>
                
                <div class="elementor-panel-content">
                    <div class="elementor-tab-content active" data-tab="content">
                        <div id="content-controls"></div>
                    </div>
                    <div class="elementor-tab-content" data-tab="style">
                        <div id="style-controls"></div>
                    </div>
                    <div class="elementor-tab-content" data-tab="advanced">
                        <div id="advanced-controls"></div>
                    </div>
                </div>
            </div>
        `;

        // Add styles
        const styles = document.createElement('style');
        styles.textContent = `
            #elementor-widget-options {
                position: fixed;
                top: 0;
                right: -400px;
                width: 400px;
                height: 100vh;
                background: #ffffff;
                box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                z-index: 15000;
                transition: right 0.3s ease;
                font-family: 'Inter', sans-serif;
                border-left: 1px solid #e5e5e5;
            }
            
            #elementor-widget-options.active {
                right: 0;
            }
            
            .elementor-panel {
                height: 100%;
                display: flex;
                flex-direction: column;
            }
            
            .elementor-panel-header {
                padding: 20px;
                border-bottom: 1px solid #e5e5e5;
                background: #f8f9fa;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .elementor-panel-header-title {
                font-weight: 600;
                font-size: 16px;
                color: #1f2937;
            }
            
            .elementor-panel-header-close {
                cursor: pointer;
                padding: 8px;
                border-radius: 4px;
                transition: background 0.2s;
            }
            
            .elementor-panel-header-close:hover {
                background: rgba(0,0,0,0.1);
            }
            
            .elementor-panel-navigation {
                display: flex;
                border-bottom: 1px solid #e5e5e5;
                background: #ffffff;
            }
            
            .elementor-panel-navigation-tab {
                flex: 1;
                padding: 15px 10px;
                text-align: center;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.2s;
                font-size: 12px;
                color: #6b7280;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 5px;
            }
            
            .elementor-panel-navigation-tab:hover {
                background: #f8f9fa;
                color: #374151;
            }
            
            .elementor-panel-navigation-tab.active {
                color: #3b82f6;
                border-bottom-color: #3b82f6;
                background: #f8f9fa;
            }
            
            .elementor-panel-navigation-tab i {
                font-size: 16px;
            }
            
            .elementor-panel-content {
                flex: 1;
                overflow-y: auto;
                padding: 0;
            }
            
            .elementor-tab-content {
                display: none;
                padding: 20px;
            }
            
            .elementor-tab-content.active {
                display: block;
            }
            
            .elementor-control-section {
                margin-bottom: 25px;
            }
            
            .elementor-control-section-title {
                font-weight: 600;
                font-size: 14px;
                color: #1f2937;
                margin-bottom: 15px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e5e5e5;
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .elementor-control {
                margin-bottom: 15px;
            }
            
            .elementor-control-label {
                font-size: 12px;
                font-weight: 500;
                color: #374151;
                margin-bottom: 6px;
                display: block;
            }
            
            .elementor-control-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                font-size: 13px;
                transition: border-color 0.2s;
            }
            
            .elementor-control-input:focus {
                outline: none;
                border-color: #3b82f6;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
            }
            
            .elementor-control-textarea {
                min-height: 80px;
                resize: vertical;
            }
            
            .elementor-control-select {
                background: white;
                cursor: pointer;
            }
            
            .elementor-control-color {
                height: 40px;
                padding: 4px;
                cursor: pointer;
            }
            
            .elementor-control-slider {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .elementor-control-slider input[type="range"] {
                flex: 1;
            }
            
            .elementor-control-slider-value {
                min-width: 50px;
                text-align: center;
                font-size: 12px;
                background: #f3f4f6;
                padding: 4px 8px;
                border-radius: 4px;
            }
            
            .elementor-control-dimensions {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
            }
            
            .elementor-control-dimensions-4 {
                grid-template-columns: 1fr 1fr 1fr 1fr;
            }
            
            .elementor-control-toggle {
                display: flex;
                align-items: center;
                gap: 10px;
            }
            
            .elementor-control-switch {
                position: relative;
                width: 44px;
                height: 24px;
                background: #d1d5db;
                border-radius: 12px;
                cursor: pointer;
                transition: background 0.2s;
            }
            
            .elementor-control-switch.active {
                background: #3b82f6;
            }
            
            .elementor-control-switch::after {
                content: '';
                position: absolute;
                top: 2px;
                left: 2px;
                width: 20px;
                height: 20px;
                background: white;
                border-radius: 50%;
                transition: transform 0.2s;
            }
            
            .elementor-control-switch.active::after {
                transform: translateX(20px);
            }
            
            /* Element Selection Styles */
            .elementor-selected {
                position: relative;
                outline: 2px solid #3b82f6 !important;
                outline-offset: -2px;
            }
            
            .elementor-selected::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: rgba(59, 130, 246, 0.1);
                pointer-events: none;
                z-index: 1000;
            }
            
            .elementor-selected::after {
                content: attr(data-element-type);
                position: absolute;
                top: -25px;
                left: -2px;
                background: #3b82f6;
                color: white;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: 500;
                border-radius: 3px;
                white-space: nowrap;
                z-index: 1001;
                font-family: 'Inter', sans-serif;
            }
            
            .elementor-control-button-group {
                display: flex;
                border: 1px solid #d1d5db;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .elementor-control-button-group button {
                flex: 1;
                padding: 8px 12px;
                border: none;
                background: white;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.2s;
                border-right: 1px solid #d1d5db;
            }
            
            .elementor-control-button-group button:last-child {
                border-right: none;
            }
            
            .elementor-control-button-group button:hover {
                background: #f3f4f6;
            }
            
            .elementor-control-button-group button.active {
                background: #3b82f6;
                color: white;
            }
            
            .elementor-right-click-menu {
                position: fixed;
                background: white;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                z-index: 20000;
                min-width: 180px;
                padding: 8px 0;
                font-family: 'Inter', sans-serif;
                display: none;
            }
            
            .elementor-right-click-menu-item {
                padding: 10px 16px;
                cursor: pointer;
                font-size: 13px;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: background 0.2s;
            }
            
            .elementor-right-click-menu-item:hover {
                background: #f3f4f6;
            }
            
            .elementor-right-click-menu-item.danger:hover {
                background: #fef2f2;
                color: #dc2626;
            }
            
            .elementor-right-click-menu-separator {
                height: 1px;
                background: #e5e5e5;
                margin: 4px 0;
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(optionsPanel);
        
        // Setup close button
        optionsPanel.querySelector('.elementor-panel-header-close').onclick = () => {
            this.hideOptionsPanel();
        };
        
        // Setup tab navigation
        optionsPanel.querySelectorAll('.elementor-panel-navigation-tab').forEach(tab => {
            tab.onclick = () => this.switchTab(tab.dataset.tab);
        });
    }

    setupEventListeners() {
        // Listen for element selection
        document.addEventListener('click', (e) => {
            const element = e.target.closest('.kb-element, [data-element-type], .widget');
            if (element && !e.target.closest('#elementor-widget-options')) {
                e.preventDefault();
                this.selectElement(element);
            }
        });
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('#elementor-widget-options') && 
                !e.target.closest('.kb-element') && 
                !e.target.closest('[data-element-type]') && 
                !e.target.closest('.widget')) {
                this.hideOptionsPanel();
            }
        });
    }

    setupRightClickMenu() {
        // Create right-click menu
        const menu = document.createElement('div');
        menu.className = 'elementor-right-click-menu';
        menu.innerHTML = `
            <div class="elementor-right-click-menu-item" data-action="edit">
                <i class="fas fa-edit"></i>
                <span>Edit Element</span>
            </div>
            <div class="elementor-right-click-menu-item" data-action="duplicate">
                <i class="fas fa-clone"></i>
                <span>Duplicate</span>
            </div>
            <div class="elementor-right-click-menu-item" data-action="copy">
                <i class="fas fa-copy"></i>
                <span>Copy</span>
            </div>
            <div class="elementor-right-click-menu-item" data-action="paste">
                <i class="fas fa-paste"></i>
                <span>Paste</span>
            </div>
            <div class="elementor-right-click-menu-separator"></div>
            <div class="elementor-right-click-menu-item" data-action="move-up">
                <i class="fas fa-arrow-up"></i>
                <span>Move Up</span>
            </div>
            <div class="elementor-right-click-menu-item" data-action="move-down">
                <i class="fas fa-arrow-down"></i>
                <span>Move Down</span>
            </div>
            <div class="elementor-right-click-menu-separator"></div>
            <div class="elementor-right-click-menu-item" data-action="save-template">
                <i class="fas fa-save"></i>
                <span>Save as Template</span>
            </div>
            <div class="elementor-right-click-menu-separator"></div>
            <div class="elementor-right-click-menu-item danger" data-action="delete">
                <i class="fas fa-trash"></i>
                <span>Delete</span>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Right-click event listener
        document.addEventListener('contextmenu', (e) => {
            const element = e.target.closest('.kb-element, [data-element-type], .widget');
            if (element) {
                e.preventDefault();
                this.showRightClickMenu(e, element);
            }
        });
        
        // Menu item clicks
        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.elementor-right-click-menu-item');
            if (item) {
                this.handleRightClickAction(item.dataset.action);
                this.hideRightClickMenu();
            }
        });
        
        // Hide menu on click outside
        document.addEventListener('click', () => {
            this.hideRightClickMenu();
        });
    }

    selectElement(element) {
        console.log('🎯 Element selected:', element);
        
        // Remove previous selection
        document.querySelectorAll('.elementor-selected').forEach(el => {
            el.classList.remove('elementor-selected');
        });
        
        // Add selection to current element
        element.classList.add('elementor-selected');
        
        this.currentElement = element;
        this.showOptionsPanel();
        this.loadElementOptions();
    }

    showOptionsPanel() {
        const panel = document.getElementById('elementor-widget-options');
        panel.classList.add('active');
    }

    hideOptionsPanel() {
        const panel = document.getElementById('elementor-widget-options');
        panel.classList.remove('active');
        
        // Remove selection
        document.querySelectorAll('.elementor-selected').forEach(el => {
            el.classList.remove('elementor-selected');
        });
        
        this.currentElement = null;
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update navigation
        document.querySelectorAll('.elementor-panel-navigation-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Update content
        document.querySelectorAll('.elementor-tab-content').forEach(content => {
            content.classList.toggle('active', content.dataset.tab === tabName);
        });
        
        // Load tab content
        this.loadTabContent(tabName);
    }

    loadElementOptions() {
        if (!this.currentElement) return;
        
        const elementType = this.getElementType(this.currentElement);
        const elementTitle = this.getElementTitle(elementType);
        
        document.getElementById('widget-title').textContent = elementTitle;
        
        // Load current tab content
        this.loadTabContent(this.currentTab);
    }

    loadTabContent(tabName) {
        if (!this.currentElement) return;
        
        const elementType = this.getElementType(this.currentElement);
        const container = document.getElementById(`${tabName}-controls`);
        
        switch (tabName) {
            case 'content':
                container.innerHTML = this.getContentControls(elementType);
                break;
            case 'style':
                container.innerHTML = this.getStyleControls(elementType);
                break;
            case 'advanced':
                container.innerHTML = this.getAdvancedControls(elementType);
                break;
        }
        
        // Setup control event listeners
        this.setupControlListeners(container);
    }

    getElementType(element) {
        return element.dataset.elementType || 
               element.className.match(/widget-(\w+)/)?.[1] || 
               element.tagName.toLowerCase();
    }

    getElementTitle(elementType) {
        const titles = {
            'text': 'Text Editor',
            'heading': 'Heading',
            'button': 'Button',
            'image': 'Image',
            'video': 'Video',
            'spacer': 'Spacer',
            'divider': 'Divider',
            'container': 'Container',
            'section': 'Section'
        };
        
        return titles[elementType] || elementType.charAt(0).toUpperCase() + elementType.slice(1);
    }

    getContentControls(elementType) {
        const controls = {
            'text': `
                <div class="elementor-control-section">
                    <div class="elementor-control-section-title">
                        <i class="fas fa-font"></i>
                        Text Content
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Text</label>
                        <textarea class="elementor-control-input elementor-control-textarea" data-setting="content" placeholder="Enter your text here..."></textarea>
                    </div>
                </div>
            `,
            'heading': `
                <div class="elementor-control-section">
                    <div class="elementor-control-section-title">
                        <i class="fas fa-heading"></i>
                        Heading Content
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Title</label>
                        <input type="text" class="elementor-control-input" data-setting="title" placeholder="Enter your heading...">
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">HTML Tag</label>
                        <select class="elementor-control-input elementor-control-select" data-setting="tag">
                            <option value="h1">H1</option>
                            <option value="h2" selected>H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                            <option value="h5">H5</option>
                            <option value="h6">H6</option>
                        </select>
                    </div>
                </div>
            `,
            'button': `
                <div class="elementor-control-section">
                    <div class="elementor-control-section-title">
                        <i class="fas fa-mouse-pointer"></i>
                        Button Content
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Text</label>
                        <input type="text" class="elementor-control-input" data-setting="text" placeholder="Click me">
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Link</label>
                        <input type="url" class="elementor-control-input" data-setting="link" placeholder="https://example.com">
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Link Target</label>
                        <select class="elementor-control-input elementor-control-select" data-setting="target">
                            <option value="_self">Same Window</option>
                            <option value="_blank">New Window</option>
                        </select>
                    </div>
                </div>
            `,
            'image': `
                <div class="elementor-control-section">
                    <div class="elementor-control-section-title">
                        <i class="fas fa-image"></i>
                        Image Content
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Image URL</label>
                        <input type="url" class="elementor-control-input" data-setting="src" placeholder="https://example.com/image.jpg">
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Alt Text</label>
                        <input type="text" class="elementor-control-input" data-setting="alt" placeholder="Image description">
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Link</label>
                        <input type="url" class="elementor-control-input" data-setting="link" placeholder="https://example.com">
                    </div>
                </div>
            `
        };
        
        return controls[elementType] || `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-cog"></i>
                    Content Settings
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Content</label>
                    <textarea class="elementor-control-input elementor-control-textarea" data-setting="content" placeholder="Enter content..."></textarea>
                </div>
            </div>
        `;
    }

    getStyleControls(elementType) {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-palette"></i>
                    Typography
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Font Family</label>
                    <select class="elementor-control-input elementor-control-select" data-setting="font-family">
                        <option value="inherit">Default</option>
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Times New Roman">Times New Roman</option>
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Font Size</label>
                    <div class="elementor-control-slider">
                        <input type="range" min="8" max="100" value="16" data-setting="font-size">
                        <span class="elementor-control-slider-value">16px</span>
                    </div>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Font Weight</label>
                    <div class="elementor-control-button-group" data-setting="font-weight">
                        <button data-value="300">Light</button>
                        <button data-value="400" class="active">Normal</button>
                        <button data-value="600">Semi Bold</button>
                        <button data-value="700">Bold</button>
                    </div>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Text Color</label>
                    <input type="color" class="elementor-control-input elementor-control-color" data-setting="color" value="#000000">
                </div>
            </div>
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-fill-drip"></i>
                    Background
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Background Type</label>
                    <div class="elementor-control-button-group" data-setting="background-type">
                        <button data-value="none" class="active">None</button>
                        <button data-value="color">Color</button>
                        <button data-value="gradient">Gradient</button>
                    </div>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Background Color</label>
                    <input type="color" class="elementor-control-input elementor-control-color" data-setting="background-color" value="#ffffff">
                </div>
            </div>
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-border-style"></i>
                    Border
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Border Type</label>
                    <select class="elementor-control-input elementor-control-select" data-setting="border-style">
                        <option value="none">None</option>
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Border Width</label>
                    <div class="elementor-control-dimensions elementor-control-dimensions-4">
                        <input type="number" placeholder="Top" data-setting="border-top-width">
                        <input type="number" placeholder="Right" data-setting="border-right-width">
                        <input type="number" placeholder="Bottom" data-setting="border-bottom-width">
                        <input type="number" placeholder="Left" data-setting="border-left-width">
                    </div>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Border Color</label>
                    <input type="color" class="elementor-control-input elementor-control-color" data-setting="border-color" value="#000000">
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Border Radius</label>
                    <div class="elementor-control-slider">
                        <input type="range" min="0" max="50" value="0" data-setting="border-radius">
                        <span class="elementor-control-slider-value">0px</span>
                    </div>
                </div>
            </div>
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-expand-arrows-alt"></i>
                    Spacing
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Margin</label>
                    <div class="elementor-control-dimensions elementor-control-dimensions-4">
                        <input type="number" placeholder="Top" data-setting="margin-top">
                        <input type="number" placeholder="Right" data-setting="margin-right">
                        <input type="number" placeholder="Bottom" data-setting="margin-bottom">
                        <input type="number" placeholder="Left" data-setting="margin-left">
                    </div>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Padding</label>
                    <div class="elementor-control-dimensions elementor-control-dimensions-4">
                        <input type="number" placeholder="Top" data-setting="padding-top">
                        <input type="number" placeholder="Right" data-setting="padding-right">
                        <input type="number" placeholder="Bottom" data-setting="padding-bottom">
                        <input type="number" placeholder="Left" data-setting="padding-left">
                    </div>
                </div>
            </div>
        `;
    }

    getAdvancedControls(elementType) {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-layer-group"></i>
                    Layout
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Element Name</label>
                    <input type="text" class="elementor-control-input" data-setting="element-name" placeholder="Element name for navigator">
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Width</label>
                    <select class="elementor-control-input elementor-control-select" data-setting="width">
                        <option value="default">Default</option>
                        <option value="100%">Full Width (100%)</option>
                        <option value="auto">Inline (auto)</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Alignment</label>
                    <div class="elementor-control-button-group" data-setting="text-align">
                        <button data-value="left"><i class="fas fa-align-left"></i></button>
                        <button data-value="center"><i class="fas fa-align-center"></i></button>
                        <button data-value="right"><i class="fas fa-align-right"></i></button>
                        <button data-value="justify"><i class="fas fa-align-justify"></i></button>
                    </div>
                </div>
            </div>
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-magic"></i>
                    Motion Effects
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Entrance Animation</label>
                    <select class="elementor-control-input elementor-control-select" data-setting="animation">
                        <option value="none">None</option>
                        <option value="fadeIn">Fade In</option>
                        <option value="fadeInUp">Fade In Up</option>
                        <option value="fadeInDown">Fade In Down</option>
                        <option value="fadeInLeft">Fade In Left</option>
                        <option value="fadeInRight">Fade In Right</option>
                        <option value="slideInUp">Slide In Up</option>
                        <option value="slideInDown">Slide In Down</option>
                        <option value="zoomIn">Zoom In</option>
                        <option value="bounceIn">Bounce In</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Animation Duration</label>
                    <div class="elementor-control-slider">
                        <input type="range" min="100" max="3000" value="600" data-setting="animation-duration">
                        <span class="elementor-control-slider-value">600ms</span>
                    </div>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Animation Delay</label>
                    <div class="elementor-control-slider">
                        <input type="range" min="0" max="2000" value="0" data-setting="animation-delay">
                        <span class="elementor-control-slider-value">0ms</span>
                    </div>
                </div>
            </div>
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-eye"></i>
                    Visibility
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Hide On Desktop</label>
                    <div class="elementor-control-toggle">
                        <div class="elementor-control-switch" data-setting="hide-desktop"></div>
                        <span>Hide on desktop devices</span>
                    </div>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Hide On Tablet</label>
                    <div class="elementor-control-toggle">
                        <div class="elementor-control-switch" data-setting="hide-tablet"></div>
                        <span>Hide on tablet devices</span>
                    </div>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Hide On Mobile</label>
                    <div class="elementor-control-toggle">
                        <div class="elementor-control-switch" data-setting="hide-mobile"></div>
                        <span>Hide on mobile devices</span>
                    </div>
                </div>
            </div>
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-code"></i>
                    Attributes
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">CSS ID</label>
                    <input type="text" class="elementor-control-input" data-setting="css-id" placeholder="my-element-id">
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">CSS Classes</label>
                    <input type="text" class="elementor-control-input" data-setting="css-classes" placeholder="my-class another-class">
                </div>
            </div>
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-paint-brush"></i>
                    Custom CSS
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Custom CSS</label>
                    <textarea class="elementor-control-input elementor-control-textarea" data-setting="custom-css" placeholder="selector { 
    property: value;
}" style="min-height: 120px; font-family: monospace;"></textarea>
                </div>
            </div>
        `;
    }

    setupControlListeners(container) {
        // Input controls
        container.querySelectorAll('input, textarea, select').forEach(control => {
            control.addEventListener('input', (e) => {
                this.updateElementStyle(e.target.dataset.setting, e.target.value);
            });
            
            control.addEventListener('change', (e) => {
                this.updateElementStyle(e.target.dataset.setting, e.target.value);
            });
        });
        
        // Slider controls
        container.querySelectorAll('input[type="range"]').forEach(slider => {
            slider.addEventListener('input', (e) => {
                const valueDisplay = e.target.parentElement.querySelector('.elementor-control-slider-value');
                const unit = e.target.dataset.unit || 'px';
                const value = e.target.value + unit;
                valueDisplay.textContent = value;
                this.updateElementStyle(e.target.dataset.setting, e.target.value + unit);
            });
        });
        
        // Button group controls
        container.querySelectorAll('.elementor-control-button-group').forEach(group => {
            group.querySelectorAll('button').forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    // Update active state
                    group.querySelectorAll('button').forEach(b => b.classList.remove('active'));
                    button.classList.add('active');
                    
                    // Update style
                    this.updateElementStyle(group.dataset.setting, button.dataset.value);
                });
            });
        });
        
        // Switch controls
        container.querySelectorAll('.elementor-control-switch').forEach(switchEl => {
            switchEl.addEventListener('click', () => {
                switchEl.classList.toggle('active');
                const value = switchEl.classList.contains('active');
                this.updateElementStyle(switchEl.dataset.setting, value);
            });
        });
    }

    updateElementStyle(setting, value) {
        if (!this.currentElement || !setting) return;
        
        console.log(`🎨 Updating ${setting}: ${value}`);
        
        // Apply style to element
        const cssProperty = this.settingToCssProperty(setting);
        if (cssProperty) {
            this.currentElement.style[cssProperty] = value;
        }
        
        // Handle special cases
        this.handleSpecialSettings(setting, value);
    }

    settingToCssProperty(setting) {
        const mappings = {
            'font-size': 'fontSize',
            'font-family': 'fontFamily',
            'font-weight': 'fontWeight',
            'color': 'color',
            'background-color': 'backgroundColor',
            'border-color': 'borderColor',
            'border-radius': 'borderRadius',
            'border-style': 'borderStyle',
            'text-align': 'textAlign',
            'margin-top': 'marginTop',
            'margin-right': 'marginRight',
            'margin-bottom': 'marginBottom',
            'margin-left': 'marginLeft',
            'padding-top': 'paddingTop',
            'padding-right': 'paddingRight',
            'padding-bottom': 'paddingBottom',
            'padding-left': 'paddingLeft',
            'border-top-width': 'borderTopWidth',
            'border-right-width': 'borderRightWidth',
            'border-bottom-width': 'borderBottomWidth',
            'border-left-width': 'borderLeftWidth'
        };
        
        return mappings[setting];
    }

    handleSpecialSettings(setting, value) {
        switch (setting) {
            case 'content':
                if (this.currentElement.tagName === 'TEXTAREA' || 
                    this.currentElement.contentEditable === 'true') {
                    this.currentElement.textContent = value;
                } else {
                    this.currentElement.innerHTML = value;
                }
                break;
                
            case 'title':
                this.currentElement.textContent = value;
                break;
                
            case 'text':
                if (this.currentElement.querySelector('a')) {
                    this.currentElement.querySelector('a').textContent = value;
                } else {
                    this.currentElement.textContent = value;
                }
                break;
                
            case 'link':
                const link = this.currentElement.querySelector('a') || this.currentElement;
                if (link.tagName === 'A') {
                    link.href = value;
                }
                break;
                
            case 'src':
                if (this.currentElement.tagName === 'IMG') {
                    this.currentElement.src = value;
                }
                break;
                
            case 'alt':
                if (this.currentElement.tagName === 'IMG') {
                    this.currentElement.alt = value;
                }
                break;
                
            case 'css-id':
                this.currentElement.id = value;
                break;
                
            case 'css-classes':
                // Preserve existing builder classes
                const builderClasses = Array.from(this.currentElement.classList)
                    .filter(cls => cls.startsWith('kb-') || cls.startsWith('elementor-'));
                this.currentElement.className = [...builderClasses, ...value.split(' ')].join(' ');
                break;
        }
    }

    showRightClickMenu(event, element) {
        const menu = document.querySelector('.elementor-right-click-menu');
        menu.style.display = 'block';
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';
        
        this.rightClickElement = element;
    }

    hideRightClickMenu() {
        const menu = document.querySelector('.elementor-right-click-menu');
        menu.style.display = 'none';
    }

    handleRightClickAction(action) {
        if (!this.rightClickElement) return;
        
        console.log(`🎯 Right-click action: ${action}`);
        
        switch (action) {
            case 'edit':
                this.selectElement(this.rightClickElement);
                break;
                
            case 'duplicate':
                this.duplicateElement(this.rightClickElement);
                break;
                
            case 'copy':
                this.copyElement(this.rightClickElement);
                break;
                
            case 'paste':
                this.pasteElement(this.rightClickElement);
                break;
                
            case 'move-up':
                this.moveElementUp(this.rightClickElement);
                break;
                
            case 'move-down':
                this.moveElementDown(this.rightClickElement);
                break;
                
            case 'delete':
                this.deleteElement(this.rightClickElement);
                break;
                
            case 'save-template':
                this.saveAsTemplate(this.rightClickElement);
                break;
        }
    }

    duplicateElement(element) {
        const clone = element.cloneNode(true);
        clone.id = ''; // Remove ID to avoid duplicates
        element.parentNode.insertBefore(clone, element.nextSibling);
        console.log('✅ Element duplicated');
    }

    copyElement(element) {
        this.copiedElement = element.cloneNode(true);
        console.log('✅ Element copied');
    }

    pasteElement(targetElement) {
        if (this.copiedElement) {
            const clone = this.copiedElement.cloneNode(true);
            clone.id = ''; // Remove ID to avoid duplicates
            targetElement.parentNode.insertBefore(clone, targetElement.nextSibling);
            console.log('✅ Element pasted');
        }
    }

    moveElementUp(element) {
        const prev = element.previousElementSibling;
        if (prev) {
            element.parentNode.insertBefore(element, prev);
            console.log('✅ Element moved up');
        }
    }

    moveElementDown(element) {
        const next = element.nextElementSibling;
        if (next) {
            element.parentNode.insertBefore(next, element);
            console.log('✅ Element moved down');
        }
    }

    deleteElement(element) {
        if (confirm('Are you sure you want to delete this element?')) {
            element.remove();
            this.hideOptionsPanel();
            console.log('✅ Element deleted');
        }
    }

    saveAsTemplate(element) {
        const template = {
            type: this.getElementType(element),
            html: element.outerHTML,
            timestamp: new Date().toISOString()
        };
        
        // Save to localStorage for now
        const templates = JSON.parse(localStorage.getItem('kingsbuilder-templates') || '[]');
        templates.push(template);
        localStorage.setItem('kingsbuilder-templates', JSON.stringify(templates));
        
        console.log('✅ Element saved as template');
    }
}

// Initialize the Elementor-style widget options
console.log('🎨 ELEMENTOR-STYLE WIDGET OPTIONS: Initializing...');
window.elementorStyleWidgetOptions = new ElementorStyleWidgetOptions();

console.log('✅ ELEMENTOR-STYLE WIDGET OPTIONS: Complete system loaded!');