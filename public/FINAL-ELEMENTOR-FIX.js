// 🎯 FINAL ELEMENTOR FIX - Complete clean implementation
console.log('🎯 FINAL ELEMENTOR FIX: Loading...');

// DISABLE ALL OTHER SYSTEMS FIRST
window.addEventListener('load', () => {
    // Remove completion indicator
    const completionIndicator = document.getElementById('completion-indicator');
    if (completionIndicator) {
        completionIndicator.remove();
        console.log('✅ Removed completion indicator');
    }
    
    // Remove any existing panels
    document.querySelectorAll('#elementor-panel, #elementor-widget-options, .elementor-properties-panel').forEach(el => el.remove());
    
    // Disable other systems
    if (window.elementorStyleWidgetOptions) {
        window.elementorStyleWidgetOptions = null;
    }
    if (window.completeElementorSystem) {
        window.completeElementorSystem = null;
    }
});

class FinalElementorSystem {
    constructor() {
        this.selectedElement = null;
        this.copiedElement = null;
        this.draggedWidget = null;
        this.contextElement = null;
        
        this.widgets = this.getWidgetDefinitions();
        this.init();
    }

    init() {
        setTimeout(() => {
            this.removeConflicts();
            this.createInterface();
            this.setupEvents();
            this.fixButtonColors();
            console.log('✅ FINAL ELEMENTOR FIX: Complete!');
        }, 2000);
    }

    removeConflicts() {
        // Remove completion indicator
        document.querySelectorAll('#completion-indicator, .completion-indicator').forEach(el => el.remove());
        
        // Remove existing panels
        document.querySelectorAll('#elementor-panel, #elementor-widget-options, .elementor-properties-panel').forEach(el => el.remove());
        
        // Remove existing context menus
        document.querySelectorAll('.elementor-context-menu, .elementor-right-click-menu').forEach(el => el.remove());
    }

    createInterface() {
        // Create main interface
        const interface = document.createElement('div');
        interface.id = 'final-elementor-interface';
        interface.innerHTML = `
            <!-- LEFT SIDEBAR - WIDGETS -->
            <div id="elementor-widgets-panel" class="elementor-panel-left">
                <div class="elementor-panel-header">
                    <h3>Elements</h3>
                </div>
                <div class="elementor-widgets-list">
                    ${this.generateWidgetsList()}
                </div>
            </div>

            <!-- LEFT SIDEBAR - PROPERTIES (shows when element selected) -->
            <div id="elementor-properties-panel" class="elementor-panel-left elementor-properties-hidden">
                <div class="elementor-panel-header">
                    <h3 id="selected-element-title">Element Settings</h3>
                    <button class="elementor-close-btn" onclick="finalElementorSystem.closeProperties()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="elementor-tabs">
                    <div class="elementor-tab active" data-tab="content">
                        <i class="fas fa-edit"></i>
                        <span>Content</span>
                    </div>
                    <div class="elementor-tab" data-tab="style">
                        <i class="fas fa-paint-brush"></i>
                        <span>Style</span>
                    </div>
                    <div class="elementor-tab" data-tab="advanced">
                        <i class="fas fa-cogs"></i>
                        <span>Advanced</span>
                    </div>
                </div>
                
                <div class="elementor-tab-content">
                    <div class="elementor-tab-pane active" data-tab="content">
                        <div id="content-controls"></div>
                    </div>
                    <div class="elementor-tab-pane" data-tab="style">
                        <div id="style-controls"></div>
                    </div>
                    <div class="elementor-tab-pane" data-tab="advanced">
                        <div id="advanced-controls"></div>
                    </div>
                </div>
            </div>

            <!-- RIGHT CLICK MENU -->
            <div id="elementor-context-menu" class="elementor-context-menu">
                <div class="context-item" data-action="edit">
                    <i class="fas fa-edit"></i>
                    <span>Edit Element</span>
                </div>
                <div class="context-item" data-action="duplicate">
                    <i class="fas fa-clone"></i>
                    <span>Duplicate</span>
                </div>
                <div class="context-item" data-action="copy">
                    <i class="fas fa-copy"></i>
                    <span>Copy</span>
                </div>
                <div class="context-item" data-action="paste">
                    <i class="fas fa-paste"></i>
                    <span>Paste</span>
                </div>
                <div class="context-separator"></div>
                <div class="context-item" data-action="move-up">
                    <i class="fas fa-arrow-up"></i>
                    <span>Move Up</span>
                </div>
                <div class="context-item" data-action="move-down">
                    <i class="fas fa-arrow-down"></i>
                    <span>Move Down</span>
                </div>
                <div class="context-separator"></div>
                <div class="context-item danger" data-action="delete">
                    <i class="fas fa-trash"></i>
                    <span>Delete</span>
                </div>
            </div>
        `;

        // Add comprehensive styles
        const styles = document.createElement('style');
        styles.textContent = `
            /* FINAL ELEMENTOR SYSTEM STYLES */
            #final-elementor-interface {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                z-index: 15000;
                pointer-events: none;
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            }

            /* LEFT PANELS */
            .elementor-panel-left {
                position: fixed;
                top: 0;
                left: 0;
                width: 320px;
                height: 100vh;
                background: #ffffff;
                border-right: 1px solid #e5e5e5;
                box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                pointer-events: auto;
                display: flex;
                flex-direction: column;
                transition: transform 0.3s ease;
            }

            .elementor-properties-hidden {
                transform: translateX(-100%);
            }

            .elementor-panel-header {
                padding: 20px;
                border-bottom: 1px solid #e5e5e5;
                background: #f8f9fa;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .elementor-panel-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #1f2937;
            }

            .elementor-close-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                border-radius: 4px;
                color: #6b7280;
                transition: all 0.2s;
            }

            .elementor-close-btn:hover {
                background: rgba(0,0,0,0.1);
                color: #000000;
            }

            /* WIDGETS LIST */
            .elementor-widgets-list {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }

            .elementor-widget-item {
                display: flex;
                align-items: center;
                padding: 12px 15px;
                margin-bottom: 8px;
                background: #ffffff;
                border: 1px solid #e5e5e5;
                border-radius: 6px;
                cursor: grab;
                transition: all 0.2s;
                user-select: none;
            }

            .elementor-widget-item:hover {
                background: #f8f9fa;
                border-color: #000000;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }

            .elementor-widget-item:active {
                cursor: grabbing;
            }

            .elementor-widget-item i {
                font-size: 18px;
                color: #000000;
                margin-right: 12px;
                width: 20px;
                text-align: center;
            }

            .elementor-widget-item span {
                font-size: 13px;
                font-weight: 500;
                color: #374151;
            }

            /* TABS */
            .elementor-tabs {
                display: flex;
                border-bottom: 1px solid #e5e5e5;
                background: #ffffff;
            }

            .elementor-tab {
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

            .elementor-tab:hover {
                background: #f8f9fa;
                color: #374151;
            }

            .elementor-tab.active {
                color: #000000;
                border-bottom-color: #000000;
                background: #f8f9fa;
            }

            /* TAB CONTENT */
            .elementor-tab-content {
                flex: 1;
                overflow-y: auto;
            }

            .elementor-tab-pane {
                display: none;
                padding: 20px;
            }

            .elementor-tab-pane.active {
                display: block;
            }

            /* CONTROLS */
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
                background: #ffffff;
            }

            .elementor-control-input:focus {
                outline: none;
                border-color: #000000;
                box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
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
                top: -25px;
                left: -2px;
                background: #000000;
                color: white;
                padding: 2px 8px;
                font-size: 11px;
                font-weight: 500;
                border-radius: 3px;
                white-space: nowrap;
                z-index: 1001;
                font-family: 'Inter', sans-serif;
            }

            /* CONTEXT MENU */
            .elementor-context-menu {
                position: fixed;
                background: white;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                z-index: 25000;
                min-width: 200px;
                padding: 8px 0;
                display: none;
            }

            .context-item {
                padding: 12px 16px;
                cursor: pointer;
                font-size: 13px;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: background 0.2s;
            }

            .context-item:hover {
                background: #f3f4f6;
            }

            .context-item.danger:hover {
                background: #fef2f2;
                color: #dc2626;
            }

            .context-separator {
                height: 1px;
                background: #e5e5e5;
                margin: 4px 0;
            }

            /* BLACK BUTTONS OVERRIDE */
            button, .btn, input[type="button"], input[type="submit"], .elementor-button {
                background: #000000 !important;
                color: white !important;
                border: 1px solid #000000 !important;
            }

            button:hover, .btn:hover, input[type="button"]:hover, input[type="submit"]:hover {
                background: #333333 !important;
                border-color: #333333 !important;
            }

            /* HIDE COMPLETION INDICATOR */
            #completion-indicator, .completion-indicator {
                display: none !important;
            }

            /* DRAG HELPER */
            .elementor-drag-helper {
                position: fixed;
                background: #000000;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                pointer-events: none;
                z-index: 30000;
                transform: translate(-50%, -50%);
            }
        `;

        document.head.appendChild(styles);
        document.body.appendChild(interface);
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
        // Drag and drop
        this.setupDragAndDrop();
        
        // Canvas clicks
        this.setupCanvasEvents();
        
        // Right-click menu
        this.setupContextMenu();
        
        // Tab switching
        this.setupTabs();
        
        // Control events
        this.setupControlEvents();
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
            
            // Auto-select
            setTimeout(() => {
                this.selectElement(newElement);
            }, 100);
            
            console.log(`✅ ${widgetKey} added successfully`);
        }
    }

    setupCanvasEvents() {
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[data-element-type], .kb-element');
            if (element && !e.target.closest('#final-elementor-interface')) {
                e.preventDefault();
                e.stopPropagation();
                this.selectElement(element);
            }
        });

        // Deselect when clicking empty space
        document.addEventListener('click', (e) => {
            if (!e.target.closest('[data-element-type], .kb-element, #final-elementor-interface')) {
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

        // Show properties panel
        this.showPropertiesPanel();
        this.loadElementProperties();
    }

    deselectElement() {
        document.querySelectorAll('.elementor-selected').forEach(el => {
            el.classList.remove('elementor-selected');
        });
        this.selectedElement = null;
        this.hidePropertiesPanel();
    }

    showPropertiesPanel() {
        // Hide widgets panel
        document.getElementById('elementor-widgets-panel').style.transform = 'translateX(-100%)';
        
        // Show properties panel
        const panel = document.getElementById('elementor-properties-panel');
        panel.classList.remove('elementor-properties-hidden');
    }

    hidePropertiesPanel() {
        // Show widgets panel
        document.getElementById('elementor-widgets-panel').style.transform = 'translateX(0)';
        
        // Hide properties panel
        const panel = document.getElementById('elementor-properties-panel');
        panel.classList.add('elementor-properties-hidden');
    }

    loadElementProperties() {
        if (!this.selectedElement) return;

        const elementType = this.selectedElement.dataset.elementType || 'element';
        const elementTitle = this.widgets[elementType]?.title || elementType.charAt(0).toUpperCase() + elementType.slice(1);

        document.getElementById('selected-element-title').textContent = elementTitle;

        // Load current tab content
        const activeTab = document.querySelector('.elementor-tab.active').dataset.tab;
        this.loadTabContent(activeTab);
    }

    loadTabContent(tabName) {
        if (!this.selectedElement) return;

        const elementType = this.selectedElement.dataset.elementType || 'element';
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
            `,
            'image': `
                <div class="elementor-control-section">
                    <div class="elementor-control-section-title">
                        <i class="fas fa-image"></i>
                        Image
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Image URL</label>
                        <input type="url" class="elementor-control-input" data-setting="src" placeholder="https://example.com/image.jpg" value="${this.selectedElement.querySelector('img')?.src || ''}">
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Alt Text</label>
                        <input type="text" class="elementor-control-input" data-setting="alt" placeholder="Image description" value="${this.selectedElement.querySelector('img')?.alt || ''}">
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Link</label>
                        <input type="url" class="elementor-control-input" data-setting="image-link" placeholder="https://example.com">
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
                        <option value="Georgia, serif">Georgia</option>
                        <option value="'Times New Roman', serif">Times New Roman</option>
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
                        <option value="800">Extra Bold (800)</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Text Color</label>
                    <input type="color" class="elementor-control-input" data-setting="color" value="#000000">
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Text Align</label>
                    <select class="elementor-control-input" data-setting="text-align">
                        <option value="">Default</option>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                        <option value="justify">Justify</option>
                    </select>
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
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-border-style"></i>
                    Border
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Border Style</label>
                    <select class="elementor-control-input" data-setting="border-style">
                        <option value="none">None</option>
                        <option value="solid">Solid</option>
                        <option value="dashed">Dashed</option>
                        <option value="dotted">Dotted</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Border Width (px)</label>
                    <input type="number" class="elementor-control-input" data-setting="border-width" placeholder="1" min="0" max="20">
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Border Color</label>
                    <input type="color" class="elementor-control-input" data-setting="border-color" value="#000000">
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Border Radius (px)</label>
                    <input type="number" class="elementor-control-input" data-setting="border-radius" placeholder="0" min="0" max="50">
                </div>
            </div>
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-expand-arrows-alt"></i>
                    Spacing
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Margin (px)</label>
                    <input type="number" class="elementor-control-input" data-setting="margin" placeholder="0">
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Padding (px)</label>
                    <input type="number" class="elementor-control-input" data-setting="padding" placeholder="10">
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
                        <option value="33.33%">One Third (33%)</option>
                        <option value="25%">Quarter (25%)</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Height</label>
                    <select class="elementor-control-input" data-setting="height">
                        <option value="">Default</option>
                        <option value="auto">Auto</option>
                        <option value="100vh">Full Height</option>
                        <option value="50vh">Half Height</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Z-Index</label>
                    <input type="number" class="elementor-control-input" data-setting="z-index" placeholder="Auto">
                </div>
            </div>
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-code"></i>
                    Attributes
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
            
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="fas fa-eye"></i>
                    Visibility
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Hide On Desktop</label>
                    <select class="elementor-control-input" data-setting="hide-desktop">
                        <option value="">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Hide On Tablet</label>
                    <select class="elementor-control-input" data-setting="hide-tablet">
                        <option value="">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Hide On Mobile</label>
                    <select class="elementor-control-input" data-setting="hide-mobile">
                        <option value="">No</option>
                        <option value="yes">Yes</option>
                    </select>
                </div>
            </div>
        `;
    }

    setupTabs() {
        document.querySelectorAll('.elementor-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                // Update tab states
                document.querySelectorAll('.elementor-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.elementor-tab-pane').forEach(p => p.classList.remove('active'));
                
                tab.classList.add('active');
                document.querySelector(`[data-tab="${tab.dataset.tab}"]`).classList.add('active');
                
                // Load content
                this.loadTabContent(tab.dataset.tab);
            });
        });
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
            case 'src':
                const img = this.selectedElement.querySelector('img');
                if (img) img.src = value;
                break;
            case 'alt':
                const imgAlt = this.selectedElement.querySelector('img');
                if (imgAlt) imgAlt.alt = value;
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
            case 'text-align':
                this.selectedElement.style.textAlign = value;
                break;
            case 'background-color':
                this.selectedElement.style.backgroundColor = value;
                break;
            case 'border-style':
                this.selectedElement.style.borderStyle = value;
                break;
            case 'border-width':
                this.selectedElement.style.borderWidth = value + 'px';
                break;
            case 'border-color':
                this.selectedElement.style.borderColor = value;
                break;
            case 'border-radius':
                this.selectedElement.style.borderRadius = value + 'px';
                break;
            case 'margin':
                this.selectedElement.style.margin = value + 'px';
                break;
            case 'padding':
                this.selectedElement.style.padding = value + 'px';
                break;
            case 'width':
                this.selectedElement.style.width = value;
                break;
            case 'height':
                this.selectedElement.style.height = value;
                break;
            case 'z-index':
                this.selectedElement.style.zIndex = value;
                break;
            case 'css-id':
                this.selectedElement.id = value;
                break;
            case 'css-classes':
                // Preserve kb-element class
                this.selectedElement.className = 'kb-element ' + value;
                break;
        }
    }

    setupContextMenu() {
        const menu = document.getElementById('elementor-context-menu');

        // Right-click event
        document.addEventListener('contextmenu', (e) => {
            const element = e.target.closest('[data-element-type], .kb-element');
            if (element && !e.target.closest('#final-elementor-interface')) {
                e.preventDefault();
                this.showContextMenu(e, element);
            }
        });

        // Menu actions
        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.context-item');
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
                this.duplicateElement(this.contextElement);
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
            case 'move-up':
                const prev = this.contextElement.previousElementSibling;
                if (prev) {
                    this.contextElement.parentNode.insertBefore(this.contextElement, prev);
                    console.log('✅ Element moved up');
                }
                break;
            case 'move-down':
                const next = this.contextElement.nextElementSibling;
                if (next) {
                    this.contextElement.parentNode.insertBefore(next, this.contextElement);
                    console.log('✅ Element moved down');
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

    duplicateElement(element) {
        const clone = element.cloneNode(true);
        clone.id = 'kb-' + Math.random().toString(36).substr(2, 9);
        element.parentNode.insertBefore(clone, element.nextSibling);
        console.log('✅ Element duplicated');
    }

    closeProperties() {
        this.deselectElement();
    }

    fixButtonColors() {
        // Force all buttons to be black
        const style = document.createElement('style');
        style.textContent = `
            /* FORCE BLACK BUTTONS */
            button, .btn, input[type="button"], input[type="submit"], .elementor-button,
            .publish-btn, #publish-btn, .save-btn, #save-btn {
                background: #000000 !important;
                color: white !important;
                border: 1px solid #000000 !important;
            }
            
            button:hover, .btn:hover, input[type="button"]:hover, input[type="submit"]:hover {
                background: #333333 !important;
                border-color: #333333 !important;
            }
            
            /* Remove blue colors */
            .bg-blue-500, .bg-blue-600, .text-blue-500, .text-blue-600 {
                background: #000000 !important;
                color: white !important;
            }
            
            /* Remove gray colors */
            .bg-gray-500, .bg-gray-600, .text-gray-500, .text-gray-600 {
                background: #000000 !important;
                color: white !important;
            }
        `;
        document.head.appendChild(style);

        // Apply directly to existing buttons
        setTimeout(() => {
            document.querySelectorAll('button, .btn, input[type="button"], input[type="submit"]').forEach(btn => {
                btn.style.background = '#000000';
                btn.style.color = 'white';
                btn.style.border = '1px solid #000000';
            });
        }, 1000);
    }
}

// Initialize Final Elementor System
console.log('🎯 FINAL ELEMENTOR FIX: Initializing...');
window.finalElementorSystem = new FinalElementorSystem();

console.log('✅ FINAL ELEMENTOR FIX: Complete!');