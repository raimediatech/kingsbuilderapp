// 🎯 COMPLETE ELEMENTOR SYSTEM - Full Elementor-like functionality
console.log('🎯 COMPLETE ELEMENTOR SYSTEM: Loading...');

class CompleteElementorSystem {
    constructor() {
        this.selectedElement = null;
        this.copiedElement = null;
        this.draggedElement = null;
        this.isInitialized = false;
        this.widgets = {};
        this.containers = [];
        
        this.init();
    }

    init() {
        console.log('🔧 Initializing Complete Elementor System...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.setup());
        } else {
            this.setup();
        }
    }

    setup() {
        setTimeout(() => {
            this.createElementorInterface();
            this.setupWidgetDefinitions();
            this.setupDragAndDrop();
            this.setupCanvasEvents();
            this.setupRightClickMenu();
            this.fixExistingElements();
            this.makeButtonsBlack();
            this.isInitialized = true;
            console.log('✅ COMPLETE ELEMENTOR SYSTEM: Fully loaded!');
        }, 1000);
    }

    createElementorInterface() {
        // Remove existing panels
        document.querySelectorAll('#elementor-panel, #elementor-widget-options').forEach(el => el.remove());

        const panel = document.createElement('div');
        panel.id = 'elementor-panel';
        panel.innerHTML = `
            <div class="elementor-panel-wrapper">
                <!-- Left Sidebar - Elements -->
                <div class="elementor-elements-panel">
                    <div class="elementor-panel-header">
                        <h3>Elements</h3>
                    </div>
                    <div class="elementor-elements-categories">
                        <div class="elementor-category active" data-category="basic">
                            <i class="fas fa-cube"></i>
                            <span>Basic</span>
                        </div>
                        <div class="elementor-category" data-category="general">
                            <i class="fas fa-th-large"></i>
                            <span>General</span>
                        </div>
                    </div>
                    <div class="elementor-elements-list" id="elementor-elements-list">
                        <!-- Elements will be populated here -->
                    </div>
                </div>

                <!-- Right Sidebar - Properties -->
                <div class="elementor-properties-panel" id="elementor-properties-panel">
                    <div class="elementor-panel-header">
                        <h3 id="element-title">Select an Element</h3>
                        <button class="elementor-panel-close" onclick="this.closePanel()">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    
                    <div class="elementor-panel-tabs">
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
            </div>
        `;

        // Add comprehensive styles
        const styles = document.createElement('style');
        styles.textContent = `
            /* COMPLETE ELEMENTOR SYSTEM STYLES */
            #elementor-panel {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100vh;
                z-index: 10000;
                pointer-events: none;
                font-family: 'Inter', sans-serif;
            }
            
            .elementor-panel-wrapper {
                display: flex;
                height: 100%;
                pointer-events: none;
            }
            
            /* LEFT SIDEBAR - ELEMENTS */
            .elementor-elements-panel {
                width: 300px;
                background: #ffffff;
                border-right: 1px solid #e5e5e5;
                box-shadow: 2px 0 10px rgba(0,0,0,0.1);
                pointer-events: auto;
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
            
            .elementor-panel-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
                color: #1f2937;
            }
            
            .elementor-elements-categories {
                display: flex;
                border-bottom: 1px solid #e5e5e5;
                background: #ffffff;
            }
            
            .elementor-category {
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
            
            .elementor-category:hover {
                background: #f8f9fa;
                color: #374151;
            }
            
            .elementor-category.active {
                color: #000000;
                border-bottom-color: #000000;
                background: #f8f9fa;
            }
            
            .elementor-elements-list {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }
            
            .elementor-element-item {
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
            
            .elementor-element-item:hover {
                background: #f8f9fa;
                border-color: #000000;
                transform: translateY(-1px);
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            }
            
            .elementor-element-item:active {
                cursor: grabbing;
            }
            
            .elementor-element-item i {
                font-size: 18px;
                color: #000000;
                margin-right: 12px;
                width: 20px;
                text-align: center;
            }
            
            .elementor-element-item span {
                font-size: 13px;
                font-weight: 500;
                color: #374151;
            }
            
            /* RIGHT SIDEBAR - PROPERTIES */
            .elementor-properties-panel {
                width: 400px;
                background: #ffffff;
                border-left: 1px solid #e5e5e5;
                box-shadow: -2px 0 10px rgba(0,0,0,0.1);
                margin-left: auto;
                pointer-events: auto;
                display: flex;
                flex-direction: column;
                transform: translateX(100%);
                transition: transform 0.3s ease;
            }
            
            .elementor-properties-panel.active {
                transform: translateX(0);
            }
            
            .elementor-panel-close {
                background: none;
                border: none;
                cursor: pointer;
                padding: 8px;
                border-radius: 4px;
                color: #6b7280;
                transition: all 0.2s;
            }
            
            .elementor-panel-close:hover {
                background: rgba(0,0,0,0.1);
                color: #000000;
            }
            
            .elementor-panel-tabs {
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
            
            .elementor-panel-content {
                flex: 1;
                overflow-y: auto;
            }
            
            .elementor-tab-content {
                display: none;
                padding: 20px;
            }
            
            .elementor-tab-content.active {
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
            
            /* CANVAS STYLES */
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
            
            /* CONTAINER STYLES */
            .elementor-container {
                min-height: 50px;
                border: 2px dashed #e5e5e5;
                border-radius: 4px;
                margin: 10px 0;
                position: relative;
                transition: all 0.2s;
            }
            
            .elementor-container:hover {
                border-color: #000000;
            }
            
            .elementor-container.elementor-selected {
                border-color: #000000;
                border-style: solid;
            }
            
            .elementor-container-empty::before {
                content: 'Drop elements here';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: #9ca3af;
                font-size: 14px;
                pointer-events: none;
            }
            
            /* COLUMN STYLES */
            .elementor-column {
                min-height: 50px;
                border: 1px dashed #e5e5e5;
                border-radius: 4px;
                margin: 5px;
                position: relative;
                flex: 1;
                transition: all 0.2s;
            }
            
            .elementor-column:hover {
                border-color: #000000;
            }
            
            .elementor-column.elementor-selected {
                border-color: #000000;
                border-style: solid;
            }
            
            /* RIGHT CLICK MENU */
            .elementor-context-menu {
                position: fixed;
                background: white;
                border: 1px solid #e5e5e5;
                border-radius: 8px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.15);
                z-index: 20000;
                min-width: 200px;
                padding: 8px 0;
                display: none;
            }
            
            .elementor-context-menu-item {
                padding: 12px 16px;
                cursor: pointer;
                font-size: 13px;
                color: #374151;
                display: flex;
                align-items: center;
                gap: 12px;
                transition: background 0.2s;
            }
            
            .elementor-context-menu-item:hover {
                background: #f3f4f6;
            }
            
            .elementor-context-menu-item.danger:hover {
                background: #fef2f2;
                color: #dc2626;
            }
            
            .elementor-context-menu-separator {
                height: 1px;
                background: #e5e5e5;
                margin: 4px 0;
            }
            
            /* DRAG AND DROP */
            .elementor-drag-helper {
                position: fixed;
                background: #000000;
                color: white;
                padding: 8px 12px;
                border-radius: 4px;
                font-size: 12px;
                pointer-events: none;
                z-index: 25000;
                transform: translate(-50%, -50%);
            }
            
            .elementor-drop-zone {
                min-height: 40px;
                border: 2px dashed #000000;
                border-radius: 4px;
                margin: 5px 0;
                display: flex;
                align-items: center;
                justify-content: center;
                color: #000000;
                font-size: 12px;
                transition: all 0.2s;
            }
            
            .elementor-drop-zone.active {
                background: rgba(0, 0, 0, 0.1);
                border-style: solid;
            }
            
            /* BLACK BUTTONS */
            .elementor-button, 
            button, 
            .btn, 
            input[type="button"], 
            input[type="submit"] {
                background: #000000 !important;
                color: white !important;
                border: 1px solid #000000 !important;
            }
            
            .elementor-button:hover, 
            button:hover, 
            .btn:hover {
                background: #333333 !important;
                border-color: #333333 !important;
            }
        `;
        
        document.head.appendChild(styles);
        document.body.appendChild(panel);
        
        this.setupPanelEvents();
    }

    setupWidgetDefinitions() {
        this.widgets = {
            // BASIC WIDGETS
            'section': {
                title: 'Section',
                icon: 'fas fa-columns',
                category: 'basic',
                html: '<div class="elementor-container elementor-container-empty" data-element-type="section"><div class="elementor-row"><div class="elementor-column" data-element-type="column"></div></div></div>'
            },
            'container': {
                title: 'Container',
                icon: 'fas fa-square',
                category: 'basic',
                html: '<div class="elementor-container elementor-container-empty" data-element-type="container"></div>'
            },
            'heading': {
                title: 'Heading',
                icon: 'fas fa-heading',
                category: 'basic',
                html: '<h2 data-element-type="heading" style="margin: 0; padding: 10px;">Your Heading Text</h2>'
            },
            'text': {
                title: 'Text Editor',
                icon: 'fas fa-font',
                category: 'basic',
                html: '<div data-element-type="text" style="padding: 10px;"><p>Add Your Text Here. You can edit this text by clicking on it.</p></div>'
            },
            'button': {
                title: 'Button',
                icon: 'fas fa-mouse-pointer',
                category: 'basic',
                html: '<div data-element-type="button" style="padding: 10px; text-align: center;"><a href="#" style="display: inline-block; background: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Click Me</a></div>'
            },
            'image': {
                title: 'Image',
                icon: 'fas fa-image',
                category: 'basic',
                html: '<div data-element-type="image" style="padding: 10px; text-align: center;"><img src="https://via.placeholder.com/400x250/000000/FFFFFF?text=Your+Image" alt="Image" style="max-width: 100%; height: auto;"></div>'
            },
            'video': {
                title: 'Video',
                icon: 'fas fa-play',
                category: 'basic',
                html: '<div data-element-type="video" style="padding: 10px;"><div style="background: #f3f4f6; padding: 40px; text-align: center; border-radius: 4px;"><i class="fas fa-play" style="font-size: 24px; color: #6b7280;"></i><p style="margin: 10px 0 0 0; color: #6b7280;">Add Video URL</p></div></div>'
            },
            'spacer': {
                title: 'Spacer',
                icon: 'fas fa-arrows-alt-v',
                category: 'basic',
                html: '<div data-element-type="spacer" style="height: 50px; background: transparent;"></div>'
            },
            'divider': {
                title: 'Divider',
                icon: 'fas fa-minus',
                category: 'basic',
                html: '<div data-element-type="divider" style="padding: 20px 10px;"><hr style="border: none; border-top: 1px solid #e5e5e5; margin: 0;"></div>'
            }
        };
        
        this.populateElementsList();
    }

    populateElementsList() {
        const elementsList = document.getElementById('elementor-elements-list');
        if (!elementsList) return;
        
        elementsList.innerHTML = '';
        
        Object.keys(this.widgets).forEach(widgetKey => {
            const widget = this.widgets[widgetKey];
            const elementItem = document.createElement('div');
            elementItem.className = 'elementor-element-item';
            elementItem.draggable = true;
            elementItem.dataset.widget = widgetKey;
            elementItem.innerHTML = `
                <i class="${widget.icon}"></i>
                <span>${widget.title}</span>
            `;
            
            elementsList.appendChild(elementItem);
        });
    }

    setupDragAndDrop() {
        // Drag start
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('elementor-element-item')) {
                this.draggedElement = e.target.dataset.widget;
                e.dataTransfer.effectAllowed = 'copy';
                
                // Create drag helper
                const helper = document.createElement('div');
                helper.className = 'elementor-drag-helper';
                helper.textContent = this.widgets[this.draggedElement].title;
                document.body.appendChild(helper);
                
                // Update helper position
                const updateHelper = (event) => {
                    helper.style.left = event.clientX + 'px';
                    helper.style.top = event.clientY + 'px';
                };
                
                document.addEventListener('dragover', updateHelper);
                
                // Clean up on drag end
                document.addEventListener('dragend', () => {
                    helper.remove();
                    document.removeEventListener('dragover', updateHelper);
                }, { once: true });
            }
        });
        
        // Setup drop zones
        this.setupDropZones();
    }

    setupDropZones() {
        // Canvas drop
        const canvas = document.querySelector('.canvas, .builder-canvas, #canvas, .canvas-frame');
        if (canvas) {
            this.makeDroppable(canvas);
        }
        
        // Container drops
        document.addEventListener('dragover', (e) => {
            const container = e.target.closest('.elementor-container, .elementor-column');
            if (container && this.draggedElement) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                container.classList.add('elementor-drop-active');
            }
        });
        
        document.addEventListener('dragleave', (e) => {
            const container = e.target.closest('.elementor-container, .elementor-column');
            if (container) {
                container.classList.remove('elementor-drop-active');
            }
        });
        
        document.addEventListener('drop', (e) => {
            e.preventDefault();
            const container = e.target.closest('.elementor-container, .elementor-column, .canvas, .builder-canvas, #canvas, .canvas-frame');
            if (container && this.draggedElement) {
                this.addElementToContainer(container, this.draggedElement);
                container.classList.remove('elementor-drop-active');
                this.draggedElement = null;
            }
        });
    }

    makeDroppable(element) {
        element.addEventListener('dragover', (e) => {
            if (this.draggedElement) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            }
        });
        
        element.addEventListener('drop', (e) => {
            e.preventDefault();
            if (this.draggedElement) {
                this.addElementToContainer(element, this.draggedElement);
                this.draggedElement = null;
            }
        });
    }

    addElementToContainer(container, widgetKey) {
        const widget = this.widgets[widgetKey];
        if (!widget) return;
        
        console.log(`🎯 Adding ${widgetKey} to container`);
        
        // Create element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = widget.html;
        const newElement = tempDiv.firstElementChild;
        
        // Add unique ID
        const uniqueId = 'kb-' + Math.random().toString(36).substr(2, 9);
        newElement.id = uniqueId;
        newElement.classList.add('kb-element');
        
        // Add to container
        if (container.classList.contains('elementor-container-empty')) {
            container.classList.remove('elementor-container-empty');
        }
        
        container.appendChild(newElement);
        
        // Auto-select the new element
        setTimeout(() => {
            this.selectElement(newElement);
        }, 100);
        
        console.log(`✅ Element ${widgetKey} added successfully`);
    }

    setupCanvasEvents() {
        // Click to select
        document.addEventListener('click', (e) => {
            const element = e.target.closest('[data-element-type], .kb-element');
            if (element && !e.target.closest('#elementor-panel')) {
                e.preventDefault();
                e.stopPropagation();
                this.selectElement(element);
            }
        });
        
        // Deselect when clicking empty space
        document.addEventListener('click', (e) => {
            if (!e.target.closest('[data-element-type], .kb-element, #elementor-panel')) {
                this.deselectElement();
            }
        });
    }

    setupRightClickMenu() {
        const menu = document.createElement('div');
        menu.className = 'elementor-context-menu';
        menu.innerHTML = `
            <div class="elementor-context-menu-item" data-action="edit">
                <i class="fas fa-edit"></i>
                <span>Edit Element</span>
            </div>
            <div class="elementor-context-menu-item" data-action="duplicate">
                <i class="fas fa-clone"></i>
                <span>Duplicate</span>
            </div>
            <div class="elementor-context-menu-item" data-action="copy">
                <i class="fas fa-copy"></i>
                <span>Copy</span>
            </div>
            <div class="elementor-context-menu-item" data-action="paste">
                <i class="fas fa-paste"></i>
                <span>Paste</span>
            </div>
            <div class="elementor-context-menu-separator"></div>
            <div class="elementor-context-menu-item" data-action="move-up">
                <i class="fas fa-arrow-up"></i>
                <span>Move Up</span>
            </div>
            <div class="elementor-context-menu-item" data-action="move-down">
                <i class="fas fa-arrow-down"></i>
                <span>Move Down</span>
            </div>
            <div class="elementor-context-menu-separator"></div>
            <div class="elementor-context-menu-item" data-action="save-template">
                <i class="fas fa-save"></i>
                <span>Save as Template</span>
            </div>
            <div class="elementor-context-menu-separator"></div>
            <div class="elementor-context-menu-item danger" data-action="delete">
                <i class="fas fa-trash"></i>
                <span>Delete</span>
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Right-click event
        document.addEventListener('contextmenu', (e) => {
            const element = e.target.closest('[data-element-type], .kb-element');
            if (element && !e.target.closest('#elementor-panel')) {
                e.preventDefault();
                this.showContextMenu(e, element);
            }
        });
        
        // Menu actions
        menu.addEventListener('click', (e) => {
            const item = e.target.closest('.elementor-context-menu-item');
            if (item) {
                this.handleContextAction(item.dataset.action);
                this.hideContextMenu();
            }
        });
        
        // Hide menu
        document.addEventListener('click', () => this.hideContextMenu());
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
        const panel = document.getElementById('elementor-properties-panel');
        if (panel) {
            panel.classList.add('active');
        }
    }

    hidePropertiesPanel() {
        const panel = document.getElementById('elementor-properties-panel');
        if (panel) {
            panel.classList.remove('active');
        }
    }

    loadElementProperties() {
        if (!this.selectedElement) return;
        
        const elementType = this.selectedElement.dataset.elementType || 'element';
        const elementTitle = this.widgets[elementType]?.title || elementType.charAt(0).toUpperCase() + elementType.slice(1);
        
        document.getElementById('element-title').textContent = elementTitle;
        
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
        
        this.setupControlEvents(container);
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
                        <input type="text" class="elementor-control-input" data-setting="text" placeholder="Enter your heading...">
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
                        <textarea class="elementor-control-input" data-setting="content" rows="5" placeholder="Enter your text here..."></textarea>
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
                        <input type="text" class="elementor-control-input" data-setting="text" placeholder="Click me">
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Link</label>
                        <input type="url" class="elementor-control-input" data-setting="link" placeholder="https://example.com">
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
                        <input type="url" class="elementor-control-input" data-setting="src" placeholder="https://example.com/image.jpg">
                    </div>
                    <div class="elementor-control">
                        <label class="elementor-control-label">Alt Text</label>
                        <input type="text" class="elementor-control-input" data-setting="alt" placeholder="Image description">
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
                    <textarea class="elementor-control-input" data-setting="content" rows="3" placeholder="Enter content..."></textarea>
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
                        <option value="Arial">Arial</option>
                        <option value="Helvetica">Helvetica</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Inter">Inter</option>
                        <option value="Roboto">Roboto</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Font Size (px)</label>
                    <input type="number" class="elementor-control-input" data-setting="font-size" placeholder="16">
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Font Weight</label>
                    <select class="elementor-control-input" data-setting="font-weight">
                        <option value="300">Light</option>
                        <option value="400">Normal</option>
                        <option value="600">Semi Bold</option>
                        <option value="700">Bold</option>
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
                        <option value="100%">Full Width</option>
                        <option value="auto">Auto</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>
                <div class="elementor-control">
                    <label class="elementor-control-label">Text Align</label>
                    <select class="elementor-control-input" data-setting="text-align">
                        <option value="">Default</option>
                        <option value="left">Left</option>
                        <option value="center">Center</option>
                        <option value="right">Right</option>
                    </select>
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
                    <input type="text" class="elementor-control-input" data-setting="css-classes" placeholder="my-class">
                </div>
            </div>
        `;
    }

    setupControlEvents(container) {
        container.querySelectorAll('.elementor-control-input').forEach(input => {
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
            case 'text':
                this.selectedElement.textContent = value;
                break;
            case 'content':
                this.selectedElement.innerHTML = value;
                break;
            case 'src':
                const img = this.selectedElement.querySelector('img');
                if (img) img.src = value;
                break;
            case 'alt':
                const imgAlt = this.selectedElement.querySelector('img');
                if (imgAlt) imgAlt.alt = value;
                break;
            case 'link':
                const link = this.selectedElement.querySelector('a');
                if (link) link.href = value;
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
            case 'margin':
                this.selectedElement.style.margin = value + 'px';
                break;
            case 'padding':
                this.selectedElement.style.padding = value + 'px';
                break;
            case 'width':
                this.selectedElement.style.width = value;
                break;
            case 'text-align':
                this.selectedElement.style.textAlign = value;
                break;
            case 'css-id':
                this.selectedElement.id = value;
                break;
            case 'css-classes':
                this.selectedElement.className = this.selectedElement.className.replace(/(?:^|\s)(?!kb-|elementor-)\S+/g, '') + ' ' + value;
                break;
        }
    }

    setupPanelEvents() {
        // Tab switching
        document.querySelectorAll('.elementor-tab').forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.elementor-tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.elementor-tab-content').forEach(c => c.classList.remove('active'));
                
                tab.classList.add('active');
                document.querySelector(`[data-tab="${tab.dataset.tab}"]`).classList.add('active');
                
                this.loadTabContent(tab.dataset.tab);
            });
        });
        
        // Close panel
        document.querySelector('.elementor-panel-close').addEventListener('click', () => {
            this.deselectElement();
        });
    }

    showContextMenu(event, element) {
        const menu = document.querySelector('.elementor-context-menu');
        menu.style.display = 'block';
        menu.style.left = event.pageX + 'px';
        menu.style.top = event.pageY + 'px';
        this.contextElement = element;
    }

    hideContextMenu() {
        const menu = document.querySelector('.elementor-context-menu');
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
                break;
            case 'paste':
                if (this.copiedElement) {
                    const clone = this.copiedElement.cloneNode(true);
                    clone.id = 'kb-' + Math.random().toString(36).substr(2, 9);
                    this.contextElement.parentNode.insertBefore(clone, this.contextElement.nextSibling);
                }
                break;
            case 'move-up':
                const prev = this.contextElement.previousElementSibling;
                if (prev) {
                    this.contextElement.parentNode.insertBefore(this.contextElement, prev);
                }
                break;
            case 'move-down':
                const next = this.contextElement.nextElementSibling;
                if (next) {
                    this.contextElement.parentNode.insertBefore(next, this.contextElement);
                }
                break;
            case 'delete':
                if (confirm('Are you sure you want to delete this element?')) {
                    this.contextElement.remove();
                    this.deselectElement();
                }
                break;
        }
    }

    duplicateElement(element) {
        const clone = element.cloneNode(true);
        clone.id = 'kb-' + Math.random().toString(36).substr(2, 9);
        element.parentNode.insertBefore(clone, element.nextSibling);
    }

    fixExistingElements() {
        // Add data-element-type to existing elements
        document.querySelectorAll('.kb-element').forEach(element => {
            if (!element.dataset.elementType) {
                const tagName = element.tagName.toLowerCase();
                if (tagName.startsWith('h')) {
                    element.dataset.elementType = 'heading';
                } else if (element.querySelector('img')) {
                    element.dataset.elementType = 'image';
                } else if (element.querySelector('a')) {
                    element.dataset.elementType = 'button';
                } else {
                    element.dataset.elementType = 'text';
                }
            }
        });
        
        // Auto-wrap elements in containers
        this.autoWrapInContainers();
    }

    autoWrapInContainers() {
        const canvas = document.querySelector('.canvas, .builder-canvas, #canvas, .canvas-frame');
        if (!canvas) return;
        
        const elements = canvas.querySelectorAll('.kb-element:not(.elementor-container)');
        if (elements.length === 0) return;
        
        // Create a container for loose elements
        const container = document.createElement('div');
        container.className = 'elementor-container';
        container.dataset.elementType = 'container';
        container.id = 'kb-' + Math.random().toString(36).substr(2, 9);
        
        // Move elements into container
        elements.forEach(element => {
            container.appendChild(element);
        });
        
        canvas.appendChild(container);
    }

    makeButtonsBlack() {
        // Add CSS to make all buttons black
        const style = document.createElement('style');
        style.textContent = `
            /* FORCE ALL BUTTONS TO BE BLACK */
            button, 
            .btn, 
            input[type="button"], 
            input[type="submit"], 
            .elementor-button,
            .publish-btn,
            #publish-btn,
            .save-btn,
            #save-btn {
                background: #000000 !important;
                color: white !important;
                border: 1px solid #000000 !important;
            }
            
            button:hover, 
            .btn:hover, 
            input[type="button"]:hover, 
            input[type="submit"]:hover, 
            .elementor-button:hover,
            .publish-btn:hover,
            #publish-btn:hover,
            .save-btn:hover,
            #save-btn:hover {
                background: #333333 !important;
                border-color: #333333 !important;
                color: white !important;
            }
            
            /* Fix specific builder buttons */
            .toolbar button,
            .sidebar button,
            .panel button {
                background: #000000 !important;
                color: white !important;
                border: 1px solid #000000 !important;
            }
        `;
        document.head.appendChild(style);
        
        // Also apply directly to existing buttons
        setTimeout(() => {
            document.querySelectorAll('button, .btn, input[type="button"], input[type="submit"]').forEach(btn => {
                btn.style.background = '#000000';
                btn.style.color = 'white';
                btn.style.border = '1px solid #000000';
            });
        }, 500);
    }

    closePanel() {
        this.deselectElement();
    }
}

// Initialize the Complete Elementor System
console.log('🎯 COMPLETE ELEMENTOR SYSTEM: Initializing...');
window.completeElementorSystem = new CompleteElementorSystem();

console.log('✅ COMPLETE ELEMENTOR SYSTEM: Loaded!');