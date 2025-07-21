// 🎯 ELEMENTOR EXACT INTERFACE - Complete Elementor-like interface
console.log('🎯 ELEMENTOR EXACT INTERFACE: Loading...');

class ElementorExactInterface {
    constructor() {
        this.selectedElement = null;
        this.copiedElement = null;
        this.draggedWidget = null;
        this.currentPanel = 'elements'; // elements, settings, history
        
        this.widgets = this.getWidgetDefinitions();
        this.init();
    }

    init() {
        setTimeout(() => {
            this.removeConflicts();
            this.createElementorInterface();
            this.setupEvents();
            console.log('✅ ELEMENTOR EXACT INTERFACE: Complete!');
        }, 2000);
    }

    removeConflicts() {
        // Remove all existing panels and systems
        document.querySelectorAll('#elementor-panel, #elementor-widget-options, .elementor-properties-panel, #final-elementor-interface').forEach(el => el.remove());
        document.querySelectorAll('#completion-indicator, .completion-indicator').forEach(el => el.remove());
        document.querySelectorAll('.elementor-context-menu, .elementor-right-click-menu').forEach(el => el.remove());
        
        // Disable other systems
        if (window.finalElementorSystem) window.finalElementorSystem = null;
        if (window.elementorStyleWidgetOptions) window.elementorStyleWidgetOptions = null;
        if (window.completeElementorSystem) window.completeElementorSystem = null;
    }

    createElementorInterface() {
        // Create main Elementor interface
        const interface = document.createElement('div');
        interface.id = 'elementor-editor-wrapper';
        interface.innerHTML = `
            <!-- TOP NAVIGATION BAR -->
            <div id="elementor-top-bar">
                <div class="elementor-top-bar-left">
                    <div class="elementor-logo">
                        <i class="fas fa-crown"></i>
                        <span>KingsBuilder</span>
                    </div>
                    <div class="elementor-document-title">
                        <span>Edit Page</span>
                    </div>
                </div>
                
                <div class="elementor-top-bar-center">
                    <div class="elementor-mode-switcher">
                        <button class="elementor-mode-btn active" data-mode="desktop">
                            <i class="fas fa-desktop"></i>
                        </button>
                        <button class="elementor-mode-btn" data-mode="tablet">
                            <i class="fas fa-tablet-alt"></i>
                        </button>
                        <button class="elementor-mode-btn" data-mode="mobile">
                            <i class="fas fa-mobile-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="elementor-top-bar-right">
                    <button class="elementor-top-btn" id="elementor-save-btn">
                        <i class="fas fa-save"></i>
                        <span>Update</span>
                    </button>
                    <button class="elementor-top-btn" id="elementor-preview-btn">
                        <i class="fas fa-eye"></i>
                        <span>Preview</span>
                    </button>
                    <button class="elementor-top-btn elementor-top-btn-secondary" id="elementor-exit-btn">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- LEFT PANEL -->
            <div id="elementor-panel">
                <!-- Panel Header -->
                <div class="elementor-panel-header">
                    <div class="elementor-panel-tabs">
                        <button class="elementor-panel-tab active" data-tab="elements">
                            <i class="fas fa-plus"></i>
                            <span>Elements</span>
                        </button>
                        <button class="elementor-panel-tab" data-tab="settings">
                            <i class="fas fa-cog"></i>
                            <span>Settings</span>
                        </button>
                        <button class="elementor-panel-tab" data-tab="history">
                            <i class="fas fa-history"></i>
                            <span>History</span>
                        </button>
                    </div>
                </div>

                <!-- Panel Content -->
                <div class="elementor-panel-content">
                    <!-- ELEMENTS TAB -->
                    <div class="elementor-panel-tab-content active" data-tab="elements">
                        <div class="elementor-panel-search">
                            <input type="text" placeholder="Search Widget..." class="elementor-search-input">
                            <i class="fas fa-search"></i>
                        </div>
                        
                        <div class="elementor-panel-categories">
                            <div class="elementor-panel-category active" data-category="basic">
                                <div class="elementor-panel-category-title">
                                    <i class="fas fa-th-large"></i>
                                    <span>Basic</span>
                                </div>
                                <div class="elementor-panel-category-items">
                                    ${this.generateWidgetsList()}
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- SETTINGS TAB (shows when element selected) -->
                    <div class="elementor-panel-tab-content" data-tab="settings">
                        <div class="elementor-panel-settings-header">
                            <h3 id="elementor-selected-element-title">Element Settings</h3>
                            <button class="elementor-panel-close-btn" onclick="elementorExactInterface.deselectElement()">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                        
                        <div class="elementor-controls-tabs">
                            <div class="elementor-control-tab active" data-tab="content">
                                <i class="fas fa-edit"></i>
                                <span>Content</span>
                            </div>
                            <div class="elementor-control-tab" data-tab="style">
                                <i class="fas fa-paint-brush"></i>
                                <span>Style</span>
                            </div>
                            <div class="elementor-control-tab" data-tab="advanced">
                                <i class="fas fa-cogs"></i>
                                <span>Advanced</span>
                            </div>
                        </div>
                        
                        <div class="elementor-controls-content">
                            <div class="elementor-control-tab-pane active" data-tab="content">
                                <div id="elementor-content-controls"></div>
                            </div>
                            <div class="elementor-control-tab-pane" data-tab="style">
                                <div id="elementor-style-controls"></div>
                            </div>
                            <div class="elementor-control-tab-pane" data-tab="advanced">
                                <div id="elementor-advanced-controls"></div>
                            </div>
                        </div>
                    </div>

                    <!-- HISTORY TAB -->
                    <div class="elementor-panel-tab-content" data-tab="history">
                        <div class="elementor-panel-history">
                            <div class="elementor-history-item">
                                <i class="fas fa-plus"></i>
                                <span>Added Section</span>
                                <small>2 minutes ago</small>
                            </div>
                            <div class="elementor-history-item">
                                <i class="fas fa-edit"></i>
                                <span>Edited Heading</span>
                                <small>5 minutes ago</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- CANVAS AREA -->
            <div id="elementor-preview">
                <div id="elementor-preview-iframe-wrapper">
                    <!-- Canvas content will be here -->
                </div>
            </div>

            <!-- RIGHT CLICK MENU -->
            <div id="elementor-context-menu" class="elementor-context-menu">
                <div class="elementor-context-item" data-action="edit">
                    <i class="fas fa-edit"></i>
                    <span>Edit</span>
                </div>
                <div class="elementor-context-item" data-action="duplicate">
                    <i class="fas fa-clone"></i>
                    <span>Duplicate</span>
                </div>
                <div class="elementor-context-item" data-action="copy">
                    <i class="fas fa-copy"></i>
                    <span>Copy</span>
                </div>
                <div class="elementor-context-item" data-action="paste">
                    <i class="fas fa-paste"></i>
                    <span>Paste</span>
                </div>
                <div class="elementor-context-separator"></div>
                <div class="elementor-context-item" data-action="delete">
                    <i class="fas fa-trash"></i>
                    <span>Delete</span>
                </div>
            </div>
        `;

        // Add comprehensive Elementor-like styles
        const styles = document.createElement('style');
        styles.textContent = `
            /* ELEMENTOR EXACT INTERFACE STYLES */
            #elementor-editor-wrapper {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                z-index: 15000;
                display: flex;
                flex-direction: column;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
                background: #f1f3f4;
            }

            /* TOP NAVIGATION BAR */
            #elementor-top-bar {
                height: 60px;
                background: #ffffff;
                border-bottom: 1px solid #e6e9ec;
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 0 20px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                z-index: 16000;
            }

            .elementor-top-bar-left {
                display: flex;
                align-items: center;
                gap: 20px;
            }

            .elementor-logo {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                font-size: 16px;
                color: #000000;
            }

            .elementor-logo i {
                color: #000000;
                font-size: 18px;
            }

            .elementor-document-title span {
                color: #6b7280;
                font-size: 14px;
            }

            .elementor-top-bar-center {
                display: flex;
                align-items: center;
            }

            .elementor-mode-switcher {
                display: flex;
                background: #f8f9fa;
                border-radius: 6px;
                padding: 4px;
                gap: 2px;
            }

            .elementor-mode-btn {
                padding: 8px 12px;
                border: none;
                background: transparent;
                border-radius: 4px;
                cursor: pointer;
                color: #6b7280;
                transition: all 0.2s;
            }

            .elementor-mode-btn.active {
                background: #000000;
                color: white;
            }

            .elementor-top-bar-right {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .elementor-top-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 16px;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.2s;
                background: #000000;
                color: white;
            }

            .elementor-top-btn:hover {
                background: #333333;
            }

            .elementor-top-btn-secondary {
                background: #f8f9fa;
                color: #6b7280;
                border: 1px solid #e6e9ec;
            }

            .elementor-top-btn-secondary:hover {
                background: #e6e9ec;
                color: #374151;
            }

            /* LEFT PANEL */
            #elementor-panel {
                width: 320px;
                height: calc(100vh - 60px);
                background: #ffffff;
                border-right: 1px solid #e6e9ec;
                display: flex;
                flex-direction: column;
                box-shadow: 2px 0 10px rgba(0,0,0,0.1);
            }

            .elementor-panel-header {
                padding: 0;
                border-bottom: 1px solid #e6e9ec;
                background: #f8f9fa;
            }

            .elementor-panel-tabs {
                display: flex;
            }

            .elementor-panel-tab {
                flex: 1;
                padding: 16px 12px;
                border: none;
                background: transparent;
                cursor: pointer;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px;
                font-size: 11px;
                color: #6b7280;
                transition: all 0.2s;
                border-bottom: 3px solid transparent;
            }

            .elementor-panel-tab:hover {
                background: rgba(0,0,0,0.05);
                color: #374151;
            }

            .elementor-panel-tab.active {
                color: #000000;
                border-bottom-color: #000000;
                background: rgba(0,0,0,0.05);
            }

            .elementor-panel-tab i {
                font-size: 16px;
            }

            .elementor-panel-content {
                flex: 1;
                overflow-y: auto;
            }

            .elementor-panel-tab-content {
                display: none;
                height: 100%;
            }

            .elementor-panel-tab-content.active {
                display: block;
            }

            /* ELEMENTS TAB */
            .elementor-panel-search {
                padding: 20px;
                border-bottom: 1px solid #e6e9ec;
                position: relative;
            }

            .elementor-search-input {
                width: 100%;
                padding: 10px 40px 10px 12px;
                border: 1px solid #e6e9ec;
                border-radius: 6px;
                font-size: 13px;
                background: #f8f9fa;
            }

            .elementor-search-input:focus {
                outline: none;
                border-color: #000000;
                background: white;
            }

            .elementor-panel-search i {
                position: absolute;
                right: 32px;
                top: 50%;
                transform: translateY(-50%);
                color: #6b7280;
            }

            .elementor-panel-categories {
                padding: 20px;
            }

            .elementor-panel-category-title {
                display: flex;
                align-items: center;
                gap: 8px;
                font-weight: 600;
                font-size: 13px;
                color: #374151;
                margin-bottom: 16px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e6e9ec;
            }

            .elementor-panel-category-items {
                display: grid;
                grid-template-columns: repeat(2, 1fr);
                gap: 12px;
            }

            .elementor-widget-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 16px 12px;
                background: #ffffff;
                border: 1px solid #e6e9ec;
                border-radius: 8px;
                cursor: grab;
                transition: all 0.2s;
                text-align: center;
                user-select: none;
            }

            .elementor-widget-item:hover {
                background: #f8f9fa;
                border-color: #000000;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }

            .elementor-widget-item:active {
                cursor: grabbing;
            }

            .elementor-widget-item i {
                font-size: 20px;
                color: #000000;
                margin-bottom: 8px;
            }

            .elementor-widget-item span {
                font-size: 11px;
                font-weight: 500;
                color: #374151;
            }

            /* SETTINGS TAB */
            .elementor-panel-settings-header {
                padding: 20px;
                border-bottom: 1px solid #e6e9ec;
                display: flex;
                justify-content: space-between;
                align-items: center;
                background: #f8f9fa;
            }

            .elementor-panel-settings-header h3 {
                margin: 0;
                font-size: 14px;
                font-weight: 600;
                color: #1f2937;
            }

            .elementor-panel-close-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 6px;
                border-radius: 4px;
                color: #6b7280;
                transition: all 0.2s;
            }

            .elementor-panel-close-btn:hover {
                background: rgba(0,0,0,0.1);
                color: #000000;
            }

            .elementor-controls-tabs {
                display: flex;
                border-bottom: 1px solid #e6e9ec;
                background: #ffffff;
            }

            .elementor-control-tab {
                flex: 1;
                padding: 14px 8px;
                text-align: center;
                cursor: pointer;
                border-bottom: 3px solid transparent;
                transition: all 0.2s;
                font-size: 11px;
                color: #6b7280;
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 4px;
                border: none;
                background: transparent;
            }

            .elementor-control-tab:hover {
                background: #f8f9fa;
                color: #374151;
            }

            .elementor-control-tab.active {
                color: #000000;
                border-bottom-color: #000000;
                background: #f8f9fa;
            }

            .elementor-controls-content {
                flex: 1;
                overflow-y: auto;
            }

            .elementor-control-tab-pane {
                display: none;
                padding: 20px;
            }

            .elementor-control-tab-pane.active {
                display: block;
            }

            /* CONTROLS */
            .elementor-control-section {
                margin-bottom: 24px;
            }

            .elementor-control-section-title {
                font-weight: 600;
                font-size: 13px;
                color: #1f2937;
                margin-bottom: 16px;
                padding-bottom: 8px;
                border-bottom: 1px solid #e6e9ec;
                display: flex;
                align-items: center;
                gap: 8px;
            }

            .elementor-control {
                margin-bottom: 16px;
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
                border: 1px solid #e6e9ec;
                border-radius: 6px;
                font-size: 13px;
                transition: border-color 0.2s;
                background: #ffffff;
            }

            .elementor-control-input:focus {
                outline: none;
                border-color: #000000;
                box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
            }

            /* CANVAS AREA */
            #elementor-preview {
                flex: 1;
                height: calc(100vh - 60px);
                background: #f1f3f4;
                position: relative;
                overflow: auto;
            }

            #elementor-preview-iframe-wrapper {
                width: 100%;
                height: 100%;
                padding: 20px;
            }

            /* ELEMENT SELECTION */
            .elementor-selected {
                position: relative;
                outline: 2px solid #000000 !important;
                outline-offset: -2px;
            }

            .elementor-selected::before {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: rgba(0, 0, 0, 0.1);
                pointer-events: none;
                z-index: 1000;
            }

            .elementor-selected::after {
                content: attr(data-element-type);
                position: absolute;
                top: -28px;
                left: -2px;
                background: #000000;
                color: white;
                padding: 4px 8px;
                font-size: 11px;
                font-weight: 500;
                border-radius: 4px;
                white-space: nowrap;
                z-index: 1001;
                font-family: 'Inter', sans-serif;
                text-transform: capitalize;
            }

            /* CONTEXT MENU */
            .elementor-context-menu {
                position: fixed;
                background: white;
                border: 1px solid #e6e9ec;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                z-index: 25000;
                min-width: 180px;
                padding: 8px 0;
                display: none;
            }

            .elementor-context-item {
                padding: 10px 16px;
                cursor: pointer;
                font-size: 13px;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: background 0.2s;
            }

            .elementor-context-item:hover {
                background: #f3f4f6;
            }

            .elementor-context-item[data-action="delete"]:hover {
                background: #fef2f2;
                color: #dc2626;
            }

            .elementor-context-separator {
                height: 1px;
                background: #e6e9ec;
                margin: 4px 0;
            }

            /* HISTORY TAB */
            .elementor-panel-history {
                padding: 20px;
            }

            .elementor-history-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 12px;
                border-radius: 6px;
                margin-bottom: 8px;
                transition: background 0.2s;
                cursor: pointer;
            }

            .elementor-history-item:hover {
                background: #f8f9fa;
            }

            .elementor-history-item i {
                color: #6b7280;
                width: 16px;
            }

            .elementor-history-item span {
                flex: 1;
                font-size: 13px;
                color: #374151;
            }

            .elementor-history-item small {
                font-size: 11px;
                color: #9ca3af;
            }

            /* DRAG HELPER */
            .elementor-drag-helper {
                position: fixed;
                background: #000000;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 12px;
                pointer-events: none;
                z-index: 30000;
                transform: translate(-50%, -50%);
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            }

            /* FORCE BLACK BUTTONS */
            button, .btn, .btn-primary, .btn-secondary {
                background: #000000 !important;
                color: white !important;
                border: 1px solid #000000 !important;
            }

            button:hover, .btn:hover, .btn-primary:hover, .btn-secondary:hover {
                background: #333333 !important;
                border-color: #333333 !important;
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(interface);

        // Move existing canvas content
        this.moveCanvasContent();
    }

    moveCanvasContent() {
        const existingCanvas = document.querySelector('.canvas, .builder-canvas, #canvas, .canvas-frame');
        const previewWrapper = document.getElementById('elementor-preview-iframe-wrapper');
        
        if (existingCanvas && previewWrapper) {
            // Move canvas to preview area
            previewWrapper.appendChild(existingCanvas);
            existingCanvas.style.width = '100%';
            existingCanvas.style.height = '100%';
            existingCanvas.style.background = 'white';
            existingCanvas.style.borderRadius = '8px';
            existingCanvas.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    }

    getWidgetDefinitions() {
        return {
            'section': {
                title: 'Section',
                icon: 'fas fa-columns',
                html: '<div class="elementor-section" data-element-type="section"><div class="elementor-container"><div class="elementor-row"><div class="elementor-column" data-element-type="column" style="width: 100%; min-height: 50px; border: 1px dashed #ccc; padding: 20px;"></div></div></div></div>'
            },
            'heading': {
                title: 'Heading',
                icon: 'fas fa-heading',
                html: '<h2 data-element-type="heading" style="margin: 0; padding: 10px;">Add Your Heading Text Here</h2>'
            },
            'text': {
                title: 'Text Editor',
                icon: 'fas fa-font',
                html: '<div data-element-type="text" style="padding: 10px;"><p>Add Your Text Here. You can edit this text by clicking on it.</p></div>'
            },
            'button': {
                title: 'Button',
                icon: 'fas fa-mouse-pointer',
                html: '<div data-element-type="button" style="padding: 10px; text-align: center;"><a href="#" style="display: inline-block; background: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Click Me</a></div>'
            },
            'image': {
                title: 'Image',
                icon: 'fas fa-image',
                html: '<div data-element-type="image" style="padding: 10px; text-align: center;"><img src="https://via.placeholder.com/400x250/000000/FFFFFF?text=Your+Image" alt="Image" style="max-width: 100%; height: auto;"></div>'
            },
            'video': {
                title: 'Video',
                icon: 'fas fa-play',
                html: '<div data-element-type="video" style="padding: 10px;"><div style="background: #f3f4f6; padding: 40px; text-align: center; border-radius: 4px;"><i class="fas fa-play" style="font-size: 24px; color: #6b7280;"></i><p style="margin: 10px 0 0 0; color: #6b7280;">Add Video URL</p></div></div>'
            },
            'spacer': {
                title: 'Spacer',
                icon: 'fas fa-arrows-alt-v',
                html: '<div data-element-type="spacer" style="height: 50px; background: transparent;"></div>'
            },
            'divider': {
                title: 'Divider',
                icon: 'fas fa-minus',
                html: '<div data-element-type="divider" style="padding: 20px 10px;"><hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;"></div>'
            }
        };
    }

    generateWidgetsList() {
        return Object.keys(this.widgets).map(key => {
            const widget = this.widgets[key];
            return `
                <div class="elementor-widget-item" draggable="true" data-widget="${key}">
                    <i class="${widget.icon}"></i>
                    <span>${widget.title}</span>
                </div>
            `;
        }).join('');
    }

    setupEvents() {
        // Panel tab switching
        document.querySelectorAll('.elementor-panel-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchPanelTab(tab.dataset.tab);
            });
        });

        // Control tab switching
        document.querySelectorAll('.elementor-control-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                this.switchControlTab(tab.dataset.tab);
            });
        });

        // Drag and drop
        this.setupDragAndDrop();
        
        // Canvas events
        this.setupCanvasEvents();
        
        // Context menu
        this.setupContextMenu();
        
        // Top bar buttons
        this.setupTopBarEvents();
    }

    switchPanelTab(tabName) {
        // Update tab states
        document.querySelectorAll('.elementor-panel-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.elementor-panel-tab-content').forEach(p => p.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.querySelector(`.elementor-panel-tab-content[data-tab="${tabName}"]`).classList.add('active');
        
        this.currentPanel = tabName;
    }

    switchControlTab(tabName) {
        // Update control tab states
        document.querySelectorAll('.elementor-control-tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.elementor-control-tab-pane').forEach(p => p.classList.remove('active'));
        
        document.querySelector(`.elementor-control-tab[data-tab="${tabName}"]`).classList.add('active');
        document.querySelector(`.elementor-control-tab-pane[data-tab="${tabName}"]`).classList.add('active');
        
        // Load content for the tab
        this.loadControlContent(tabName);
    }

    setupDragAndDrop() {
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('elementor-widget-item')) {
                this.draggedWidget = e.target.dataset.widget;
                
                // Create drag helper
                const helper = document.createElement('div');
                helper.className = 'elementor-drag-helper';
                helper.textContent = this.widgets[this.draggedWidget].title;
                document.body.appendChild(helper);
                
                const updateHelper = (event) => {
                    helper.style.left = event.clientX + 'px';
                    helper.style.top = event.clientY + 'px';
                };
                
                document.addEventListener('dragover', updateHelper);
                document.addEventListener('dragend', () => {
                    helper.remove();
                    document.removeEventListener('dragover', updateHelper);
                }, { once: true });
            }
        });

        // Canvas drop
        const canvas = document.querySelector('.canvas, .builder-canvas, #canvas, .canvas-frame');
        if (canvas) {
            canvas.addEventListener('dragover', (e) => {
                if (this.draggedWidget) {
                    e.preventDefault();
                    e.dataTransfer.dropEffect = 'copy';
                }
            });

            canvas.addEventListener('drop', (e) => {
                e.preventDefault();
                if (this.draggedWidget) {
                    this.addWidgetToCanvas(e.target, this.draggedWidget);
                    this.draggedWidget = null;
                }
            });
        }
    }

    addWidgetToCanvas(target, widgetKey) {
        const widget = this.widgets[widgetKey];
        if (!widget) return;

        console.log(`🎯 Adding ${widgetKey} to canvas`);

        // Create element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = widget.html;
        const newElement = tempDiv.firstElementChild;

        // Add unique ID and classes
        const uniqueId = 'kb-' + Math.random().toString(36).substr(2, 9);
        newElement.id = uniqueId;
        newElement.classList.add('kb-element');

        // Find appropriate container
        const canvas = document.querySelector('.canvas, .builder-canvas, #canvas, .canvas-frame');
        const container = target.closest('.elementor-container, .elementor-column') || canvas;

        if (container) {
            container.appendChild(newElement);
            
            // Auto-select and switch to settings
            setTimeout(() => {
                this.selectElement(newElement);
            }, 100);
            
            console.log(`✅ ${widgetKey} added successfully`);
        }
    }

    setupCanvasEvents() {
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[data-element-type], .kb-element');
            if (element && !e.target.closest('#elementor-editor-wrapper')) {
                e.preventDefault();
                e.stopPropagation();
                this.selectElement(element);
            }
        });

        // Deselect when clicking empty space
        document.addEventListener('click', (e) => {
            if (!e.target.closest('[data-element-type], .kb-element, #elementor-editor-wrapper')) {
                this.deselectElement();
            }
        });
    }

    selectElement(element) {
        console.log('🎯 Selecting element:', element);

        // Remove previous selection
        document.querySelectorAll('.elementor-selected').forEach(el => {
            el.classList.remove('elementor-selected');
        });

        // Select new element
        element.classList.add('elementor-selected');
        this.selectedElement = element;

        // Switch to settings tab
        this.switchPanelTab('settings');
        
        // Update element title
        const elementType = element.dataset.elementType || 'element';
        const elementTitle = this.widgets[elementType]?.title || elementType.charAt(0).toUpperCase() + elementType.slice(1);
        document.getElementById('elementor-selected-element-title').textContent = elementTitle;

        // Load current control content
        const activeTab = document.querySelector('.elementor-control-tab.active').dataset.tab;
        this.loadControlContent(activeTab);
    }

    deselectElement() {
        document.querySelectorAll('.elementor-selected').forEach(el => {
            el.classList.remove('elementor-selected');
        });
        this.selectedElement = null;
        
        // Switch back to elements tab
        this.switchPanelTab('elements');
    }

    loadControlContent(tabName) {
        if (!this.selectedElement) return;

        const elementType = this.selectedElement.dataset.elementType || 'element';
        const container = document.getElementById(`elementor-${tabName}-controls`);

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

        this.setupControlEvents();
    }

    getContentControls(elementType) {
        const controls = {
            'heading': `
                <div class="elementor-control-section">
                    <div class="elementor-control-section-title">
                        <i class="fas fa-heading"></i>
                        Title
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Title</label>
                        <textarea class="elementor-control-input" data-setting="title" rows="3" placeholder="Enter your title">${this.selectedElement.textContent}</textarea>
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">HTML Tag</label>
                        <select class="elementor-control-input" data-setting="tag">
                            <option value="h1">H1</option>
                            <option value="h2" selected>H2</option>
                            <option value="h3">H3</option>
                            <option value="h4">H4</option>
                            <option value="h5">H5</option>
                            <option value="h6">H6</option>
                        </select>
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Link</label>
                        <input type="url" class="elementor-control-input" data-setting="link" placeholder="https://example.com">
                    </div>
                </div>
            `,
            'text': `
                <div class="elementor-control-section">
                    <div class="elementor-control-section-title">
                        <i class="fas fa-font"></i>
                        Content
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Text</label>
                        <textarea class="elementor-control-input" data-setting="content" rows="6" placeholder="Enter your text here...">${this.selectedElement.innerHTML}</textarea>
                    </div>
                </div>
            `,
            'button': `
                <div class="elementor-control-section">
                    <div class="elementor-control-section-title">
                        <i class="fas fa-mouse-pointer"></i>
                        Button
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Text</label>
                        <input type="text" class="elementor-control-input" data-setting="text" placeholder="Click me" value="${this.selectedElement.querySelector('a')?.textContent || ''}">
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Link</label>
                        <input type="url" class="elementor-control-input" data-setting="link" placeholder="https://example.com" value="${this.selectedElement.querySelector('a')?.href || ''}">
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Open in</label>
                        <select class="elementor-control-input" data-setting="target">
                            <option value="_self">Same Window</option>
                            <option value="_blank">New Window</option>
                        </select>
                    </div>
                </div>
            `
        };

        return controls[elementType] || `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-cog"></i>
                    Content
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Content</label>
                    <textarea class="elementor-control-input" data-setting="content" rows="4" placeholder="Enter content...">${this.selectedElement.innerHTML}</textarea>
                </div>
            </div>
        `;
    }

    getStyleControls(elementType) {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-font"></i>
                    Typography
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Font Family</label>
                    <select class="elementor-control-input" data-setting="font-family">
                        <option value="">Default</option>
                        <option value="Arial, sans-serif">Arial</option>
                        <option value="Helvetica, sans-serif">Helvetica</option>
                        <option value="'Inter', sans-serif">Inter</option>
                        <option value="'Roboto', sans-serif">Roboto</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Font Size (px)</label>
                    <input type="number" class="elementor-control-input" data-setting="font-size" placeholder="16" min="8" max="100">
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Font Weight</label>
                    <select class="elementor-control-input" data-setting="font-weight">
                        <option value="300">Light (300)</option>
                        <option value="400">Normal (400)</option>
                        <option value="500">Medium (500)</option>
                        <option value="600">Semi Bold (600)</option>
                        <option value="700">Bold (700)</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Text Color</label>
                    <input type="color" class="elementor-control-input" data-setting="color" value="#000000">
                </div>
            </div>
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-fill-drip"></i>
                    Background
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Background Color</label>
                    <input type="color" class="elementor-control-input" data-setting="background-color" value="#ffffff">
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
                    <label class="elementor-control-label">Width</label>
                    <select class="elementor-control-input" data-setting="width">
                        <option value="">Default</option>
                        <option value="100%">Full Width (100%)</option>
                        <option value="auto">Auto</option>
                        <option value="50%">Half (50%)</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">CSS ID</label>
                    <input type="text" class="elementor-control-input" data-setting="css-id" placeholder="my-element-id" value="${this.selectedElement.id}">
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">CSS Classes</label>
                    <input type="text" class="elementor-control-input" data-setting="css-classes" placeholder="my-class another-class">
                </div>
            </div>
        `;
    }

    setupControlEvents() {
        document.querySelectorAll('.elementor-control-input').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateElementProperty(e.target.dataset.setting, e.target.value);
            });
            
            input.addEventListener('change', (e) => {
                this.updateElementProperty(e.target.dataset.setting, e.target.value);
            });
        });
    }

    updateElementProperty(setting, value) {
        if (!this.selectedElement || !setting) return;

        console.log(`🎨 Updating ${setting}: ${value}`);

        switch (setting) {
            case 'title':
            case 'content':
                this.selectedElement.innerHTML = value;
                break;
            case 'text':
                const link = this.selectedElement.querySelector('a');
                if (link) link.textContent = value;
                else this.selectedElement.textContent = value;
                break;
            case 'link':
                const linkEl = this.selectedElement.querySelector('a');
                if (linkEl) linkEl.href = value;
                break;
            case 'font-family':
                this.selectedElement.style.fontFamily = value;
                break;
            case 'font-size':
                this.selectedElement.style.fontSize = value + 'px';
                break;
            case 'font-weight':
                this.selectedElement.style.fontWeight = value;
                break;
            case 'color':
                this.selectedElement.style.color = value;
                break;
            case 'background-color':
                this.selectedElement.style.backgroundColor = value;
                break;
            case 'width':
                this.selectedElement.style.width = value;
                break;
            case 'css-id':
                this.selectedElement.id = value;
                break;
            case 'css-classes':
                this.selectedElement.className = 'kb-element ' + value;
                break;
        }
    }

    setupContextMenu() {
        const menu = document.getElementById('elementor-context-menu');

        // Right-click event
        document.addEventListener('contextmenu', (e) => {
            const element = e.target.closest('[data-element-type], .kb-element');
            if (element && !e.target.closest('#elementor-editor-wrapper')) {
                e.preventDefault();
                this.showContextMenu(e, element);
            }
        });

        // Menu actions
        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.elementor-context-item');
            if (item) {
                this.handleContextAction(item.dataset.action);
                this.hideContextMenu();
            }
        });

        // Hide menu
        document.addEventListener('click', () => this.hideContextMenu());
    }

    showContextMenu(event, element) {
        const menu = document.getElementById('elementor-context-menu');
        menu.style.display = 'block';
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';
        this.contextElement = element;
    }

    hideContextMenu() {
        const menu = document.getElementById('elementor-context-menu');
        menu.style.display = 'none';
    }

    handleContextAction(action) {
        if (!this.contextElement) return;

        switch (action) {
            case 'edit':
                this.selectElement(this.contextElement);
                break;
            case 'duplicate':
                const clone = this.contextElement.cloneNode(true);
                clone.id = 'kb-' + Math.random().toString(36).substr(2, 9);
                this.contextElement.parentNode.insertBefore(clone, this.contextElement.nextSibling);
                console.log('✅ Element duplicated');
                break;
            case 'copy':
                this.copiedElement = this.contextElement.cloneNode(true);
                console.log('✅ Element copied');
                break;
            case 'paste':
                if (this.copiedElement) {
                    const clone = this.copiedElement.cloneNode(true);
                    clone.id = 'kb-' + Math.random().toString(36).substr(2, 9);
                    this.contextElement.parentNode.insertBefore(clone, this.contextElement.nextSibling);
                    console.log('✅ Element pasted');
                }
                break;
            case 'delete':
                if (confirm('Are you sure you want to delete this element?')) {
                    this.contextElement.remove();
                    this.deselectElement();
                    console.log('✅ Element deleted');
                }
                break;
        }
    }

    setupTopBarEvents() {
        // Save button
        document.getElementById('elementor-save-btn').addEventListener('click', () => {
            console.log('💾 Saving...');
            // Implement save functionality
        });

        // Preview button
        document.getElementById('elementor-preview-btn').addEventListener('click', () => {
            console.log('👁️ Preview...');
            // Implement preview functionality
        });

        // Exit button
        document.getElementById('elementor-exit-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to exit? Any unsaved changes will be lost.')) {
                window.location.href = '/dashboard';
            }
        });

        // Mode switcher
        document.querySelectorAll('.elementor-mode-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.elementor-mode-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                console.log(`📱 Switched to ${btn.dataset.mode} mode`);
            });
        });
    }
}

// Initialize Elementor Exact Interface
console.log('🎯 ELEMENTOR EXACT INTERFACE: Initializing...');
window.elementorExactInterface = new ElementorExactInterface();

console.log('✅ ELEMENTOR EXACT INTERFACE: Complete!');