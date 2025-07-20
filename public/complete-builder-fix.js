// COMPLETE BUILDER SYSTEM - MAKE IT ACTUALLY WORK
class CompleteBuilderSystem {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.elements = {};
        this.selectedElement = null;
        this.pageData = null;
        this.isDirty = false;
        
        if (this.isBuilder) {
            this.init();
        }
    }

    init() {
        console.log('🚀 COMPLETE BUILDER SYSTEM: Initializing...');
        
        // Initialize all systems
        this.setupCanvas();
        this.setupSidebar();
        this.setupToolbar();
        this.setupWidgets();
        this.setupSaveSystem();
        this.setupPreviewSystem();
        this.setupPublishSystem();
        this.loadPageData();
        
        console.log('✅ COMPLETE BUILDER SYSTEM: Ready!');
    }

    // Setup canvas area
    setupCanvas() {
        console.log('🎨 Setting up canvas...');
        
        const canvasFrame = document.querySelector('.canvas-frame');
        if (!canvasFrame) {
            console.error('❌ Canvas frame not found');
            return;
        }

        // Style the canvas
        canvasFrame.style.cssText = `
            background: #ffffff;
            min-height: 600px;
            padding: 20px;
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            position: relative;
            overflow: auto;
        `;

        // Add drop zone functionality
        canvasFrame.addEventListener('dragover', (e) => {
            e.preventDefault();
            canvasFrame.style.background = '#f0f8ff';
        });

        canvasFrame.addEventListener('dragleave', (e) => {
            e.preventDefault();
            canvasFrame.style.background = '#ffffff';
        });

        canvasFrame.addEventListener('drop', (e) => {
            e.preventDefault();
            canvasFrame.style.background = '#ffffff';
            
            const elementType = e.dataTransfer.getData('text/plain');
            if (elementType) {
                this.addElement(elementType, e.clientX, e.clientY);
            }
        });

        // Click to deselect
        canvasFrame.addEventListener('click', (e) => {
            if (e.target === canvasFrame) {
                this.deselectAll();
            }
        });

        console.log('✅ Canvas setup complete');
    }

    // Setup sidebar with working widgets
    setupSidebar() {
        console.log('🔧 Setting up sidebar...');
        
        // Find existing element items and make them work
        const elementItems = document.querySelectorAll('.element-item');
        if (elementItems.length === 0) {
            console.error('❌ No element items found');
            return;
        }

        console.log(`✅ Found ${elementItems.length} element items`);

        // Add click handlers to existing elements
        elementItems.forEach(item => {
            const elementType = item.getAttribute('data-element');
            if (elementType) {
                // Add click handler
                item.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`🔧 Adding element: ${elementType}`);
                    this.addElement(elementType);
                });

                // Add drag functionality
                item.addEventListener('dragstart', (e) => {
                    e.dataTransfer.setData('text/plain', elementType);
                });

                // Add hover effect
                item.addEventListener('mouseenter', () => {
                    item.style.background = '#000';
                    item.style.color = '#fff';
                });

                item.addEventListener('mouseleave', () => {
                    item.style.background = '';
                    item.style.color = '';
                });
            }
        });

        // Create widgets section
        let widgetsHTML = '<div class="widgets-section"><h3>Elements</h3>';
        
        widgets.forEach(widget => {
            widgetsHTML += `
                <div class="widget-item" draggable="true" data-widget-type="${widget.type}">
                    <i class="${widget.icon}"></i>
                    <span>${widget.name}</span>
                </div>
            `;
        });
        
        widgetsHTML += '</div>';

        // Add to sidebar
        sidebar.innerHTML = widgetsHTML;

        // Add drag functionality
        sidebar.querySelectorAll('.widget-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                const widgetType = item.getAttribute('data-widget-type');
                e.dataTransfer.setData('text/plain', widgetType);
            });

            item.addEventListener('click', () => {
                const widgetType = item.getAttribute('data-widget-type');
                this.addElement(widgetType);
            });
        });

        // Style sidebar
        const sidebarStyle = document.createElement('style');
        sidebarStyle.textContent = `
            .widgets-section {
                padding: 20px;
            }
            
            .widgets-section h3 {
                margin: 0 0 15px 0;
                font-size: 16px;
                font-weight: bold;
                color: #333;
            }
            
            .widget-item {
                display: flex;
                align-items: center;
                padding: 12px;
                margin-bottom: 8px;
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .widget-item:hover {
                background: #000;
                color: #fff;
                transform: translateX(5px);
            }
            
            .widget-item i {
                margin-right: 10px;
                width: 16px;
                text-align: center;
                color: inherit;
            }
            
            .widget-item span {
                font-size: 14px;
                font-weight: 500;
            }
        `;
        document.head.appendChild(sidebarStyle);

        console.log('✅ Sidebar setup complete');
    }

    // Setup toolbar with working buttons
    setupToolbar() {
        console.log('🔧 Setting up toolbar...');
        
        // Find existing toolbar buttons and make them work
        const saveBtn = document.getElementById('saveBtn');
        const previewBtn = document.getElementById('previewBtn');
        const publishBtn = document.getElementById('publishBtn');
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');

        if (!saveBtn || !previewBtn || !publishBtn) {
            console.error('❌ Toolbar buttons not found');
            return;
        }

        console.log('✅ Found toolbar buttons');

        // Add event listeners to existing buttons
        saveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('💾 Save button clicked');
            this.savePage();
        });

        previewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('👁️ Preview button clicked');
            this.previewPage();
        });

        publishBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('🚀 Publish button clicked');
            this.publishPage();
        });

        if (undoBtn) {
            undoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.undo();
            });
        }

        if (redoBtn) {
            redoBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.redo();
            });
        }

        // Device view buttons
        const deviceButtons = document.querySelectorAll('.device-btn');
        deviceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const device = btn.getAttribute('data-device');
                this.setDeviceView(device);
            });
        });

        // Style toolbar
        const toolbarStyle = document.createElement('style');
        toolbarStyle.textContent = `
            .toolbar {
                display: flex;
                align-items: center;
                gap: 20px;
                padding: 10px 20px;
                background: #fff;
                border-bottom: 1px solid #e0e0e0;
            }
            
            .toolbar-group {
                display: flex;
                align-items: center;
                gap: 8px;
            }
            
            .toolbar-btn {
                display: flex;
                align-items: center;
                gap: 6px;
                padding: 8px 12px;
                background: #f8f9fa;
                border: 1px solid #e9ecef;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                color: #495057;
                transition: all 0.2s;
            }
            
            .toolbar-btn:hover {
                background: #000;
                color: #fff;
                border-color: #000;
            }
            
            .toolbar-btn.primary {
                background: #007cba;
                color: #fff;
                border-color: #007cba;
            }
            
            .toolbar-btn.primary:hover {
                background: #0056b3;
                border-color: #0056b3;
            }
            
            .toolbar-btn.active {
                background: #000;
                color: #fff;
                border-color: #000;
            }
            
            .toolbar-btn i {
                margin: 0;
                font-size: 14px;
            }
        `;
        document.head.appendChild(toolbarStyle);

        console.log('✅ Toolbar setup complete');
    }

    // Setup widget system
    setupWidgets() {
        console.log('🔧 Setting up widgets...');
        
        this.widgetTemplates = {
            text: {
                name: 'Text',
                html: '<p class="kb-text">Your text content goes here. Click to edit.</p>',
                properties: {
                    text: 'Your text content goes here. Click to edit.',
                    fontSize: '16px',
                    color: '#333333',
                    fontWeight: 'normal',
                    textAlign: 'left'
                }
            },
            heading: {
                name: 'Heading',
                html: '<h2 class="kb-heading">Your Heading Here</h2>',
                properties: {
                    text: 'Your Heading Here',
                    fontSize: '32px',
                    color: '#000000',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    tag: 'h2'
                }
            },
            'enhanced-heading': {
                name: 'Enhanced Heading',
                html: '<h2 class="kb-heading enhanced">Enhanced Heading</h2>',
                properties: {
                    text: 'Enhanced Heading',
                    fontSize: '32px',
                    color: '#000000',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    tag: 'h2'
                }
            },
            button: {
                name: 'Button',
                html: '<button class="kb-button">Click Me</button>',
                properties: {
                    text: 'Click Me',
                    backgroundColor: '#007cba',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    fontSize: '16px',
                    href: '#'
                }
            },
            image: {
                name: 'Image',
                html: '<div class="kb-image-placeholder"><i class="fas fa-image"></i><p>Click to upload image</p></div>',
                properties: {
                    src: '',
                    alt: 'Image',
                    width: '100%',
                    height: 'auto'
                }
            },
            video: {
                name: 'Video',
                html: '<div class="kb-video-placeholder"><i class="fas fa-video"></i><p>Click to add video</p></div>',
                properties: {
                    src: '',
                    width: '100%',
                    height: '300px'
                }
            },
            list: {
                name: 'List',
                html: '<ul class="kb-list"><li>First item</li><li>Second item</li><li>Third item</li></ul>',
                properties: {
                    items: ['First item', 'Second item', 'Third item'],
                    listType: 'ul'
                }
            },
            divider: {
                name: 'Divider',
                html: '<hr class="kb-divider">',
                properties: {
                    color: '#e0e0e0',
                    thickness: '1px',
                    style: 'solid'
                }
            },
            spacer: {
                name: 'Spacer',
                html: '<div class="kb-spacer"></div>',
                properties: {
                    height: '40px'
                }
            },
            // Add more templates for existing elements
            'enhanced-text': {
                name: 'Enhanced Text',
                html: '<p class="kb-text enhanced">Enhanced text with more styling options.</p>',
                properties: {
                    text: 'Enhanced text with more styling options.',
                    fontSize: '16px',
                    color: '#333333'
                }
            },
            'enhanced-button': {
                name: 'Enhanced Button',
                html: '<button class="kb-button enhanced">Enhanced Button</button>',
                properties: {
                    text: 'Enhanced Button',
                    backgroundColor: '#007cba',
                    color: '#ffffff'
                }
            },
            'enhanced-image': {
                name: 'Enhanced Image',
                html: '<div class="kb-image-placeholder enhanced"><i class="fas fa-image"></i><p>Enhanced Image</p></div>',
                properties: {
                    src: '',
                    alt: 'Enhanced Image'
                }
            }
        };

        console.log('✅ Widgets setup complete');
    }

    // Add element to canvas
    addElement(type, x = null, y = null) {
        console.log(`🔧 Adding element: ${type}`);
        
        const template = this.widgetTemplates[type];
        if (!template) {
            console.error(`❌ Widget template not found: ${type}`);
            return;
        }

        const canvasFrame = document.querySelector('.canvas-frame');
        if (!canvasFrame) {
            console.error('❌ Canvas frame not found');
            return;
        }

        // Generate unique ID
        const elementId = `kb_element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create element wrapper
        const elementWrapper = document.createElement('div');
        elementWrapper.className = 'kb-element';
        elementWrapper.setAttribute('data-element-id', elementId);
        elementWrapper.setAttribute('data-element-type', type);
        elementWrapper.style.cssText = `
            position: relative;
            margin: 10px 0;
            padding: 10px;
            border: 2px solid transparent;
            border-radius: 4px;
            cursor: pointer;
            transition: border-color 0.2s;
        `;

        // Add element content
        elementWrapper.innerHTML = `
            ${template.html}
            <div class="element-controls" style="
                position: absolute;
                top: -35px;
                right: 0;
                background: #000;
                border-radius: 4px;
                padding: 4px;
                display: none;
                z-index: 100;
            ">
                <button onclick="window.completeBuilder.editElement('${elementId}')" style="
                    background: none;
                    border: none;
                    color: white;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 12px;
                ">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="window.completeBuilder.duplicateElement('${elementId}')" style="
                    background: none;
                    border: none;
                    color: white;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 12px;
                ">
                    <i class="fas fa-copy"></i>
                </button>
                <button onclick="window.completeBuilder.deleteElement('${elementId}')" style="
                    background: none;
                    border: none;
                    color: #ff4444;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 12px;
                ">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;

        // Add event listeners
        elementWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(elementId);
        });

        elementWrapper.addEventListener('mouseenter', () => {
            const controls = elementWrapper.querySelector('.element-controls');
            if (controls) controls.style.display = 'flex';
        });

        elementWrapper.addEventListener('mouseleave', () => {
            const controls = elementWrapper.querySelector('.element-controls');
            if (controls) controls.style.display = 'none';
        });

        // Add to canvas
        canvasFrame.appendChild(elementWrapper);

        // Store element data
        this.elements[elementId] = {
            id: elementId,
            type: type,
            properties: { ...template.properties },
            element: elementWrapper
        };

        // Select the new element
        this.selectElement(elementId);
        this.markDirty();

        console.log(`✅ Element added: ${elementId}`);
        return elementId;
    }

    // Select element
    selectElement(elementId) {
        console.log(`🔧 Selecting element: ${elementId}`);

        // Deselect all elements
        this.deselectAll();

        // Select current element
        const element = document.querySelector(`[data-element-id="${elementId}"]`);
        if (element) {
            element.style.border = '2px solid #007cba';
            this.selectedElement = elementId;
            this.showProperties(elementId);
        }
    }

    // Deselect all elements
    deselectAll() {
        document.querySelectorAll('.kb-element').forEach(el => {
            el.style.border = '2px solid transparent';
        });
        this.selectedElement = null;
        this.hideProperties();
    }

    // Show properties panel
    showProperties(elementId) {
        const element = this.elements[elementId];
        if (!element) return;

        // Create or update properties panel
        let propertiesPanel = document.querySelector('.properties-panel');
        if (!propertiesPanel) {
            propertiesPanel = document.createElement('div');
            propertiesPanel.className = 'properties-panel';
            propertiesPanel.style.cssText = `
                position: fixed;
                top: 80px;
                right: 20px;
                width: 300px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                max-height: 70vh;
                overflow-y: auto;
            `;
            document.body.appendChild(propertiesPanel);
        }

        // Build properties form
        let propertiesHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${element.type} Properties</h3>
                <button onclick="this.parentElement.parentElement.style.display='none'" style="
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #999;
                ">×</button>
            </div>
        `;

        // Add property inputs
        Object.entries(element.properties).forEach(([key, value]) => {
            propertiesHTML += `
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; text-transform: capitalize;">
                        ${key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    ${this.createPropertyInput(key, value, elementId)}
                </div>
            `;
        });

        propertiesHTML += `
            <button onclick="window.completeBuilder.applyProperties('${elementId}')" style="
                background: #007cba;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 4px;
                cursor: pointer;
                width: 100%;
                font-weight: bold;
            ">Apply Changes</button>
        `;

        propertiesPanel.innerHTML = propertiesHTML;
        propertiesPanel.style.display = 'block';
    }

    // Hide properties panel
    hideProperties() {
        const propertiesPanel = document.querySelector('.properties-panel');
        if (propertiesPanel) {
            propertiesPanel.style.display = 'none';
        }
    }

    // Create property input
    createPropertyInput(key, value, elementId) {
        const inputId = `prop_${elementId}_${key}`;
        
        if (key === 'color' || key === 'backgroundColor') {
            return `<input type="color" id="${inputId}" value="${value}" style="width: 100%; height: 40px; border: 1px solid #ddd; border-radius: 4px;">`;
        } else if (key === 'fontSize' || key === 'height' || key === 'width') {
            return `<input type="text" id="${inputId}" value="${value}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">`;
        } else if (key === 'textAlign') {
            return `
                <select id="${inputId}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="left" ${value === 'left' ? 'selected' : ''}>Left</option>
                    <option value="center" ${value === 'center' ? 'selected' : ''}>Center</option>
                    <option value="right" ${value === 'right' ? 'selected' : ''}>Right</option>
                </select>
            `;
        } else if (key === 'fontWeight') {
            return `
                <select id="${inputId}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                    <option value="normal" ${value === 'normal' ? 'selected' : ''}>Normal</option>
                    <option value="bold" ${value === 'bold' ? 'selected' : ''}>Bold</option>
                </select>
            `;
        } else if (key === 'text') {
            return `<textarea id="${inputId}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px; min-height: 60px;">${value}</textarea>`;
        } else {
            return `<input type="text" id="${inputId}" value="${value}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">`;
        }
    }

    // Apply properties
    applyProperties(elementId) {
        const element = this.elements[elementId];
        if (!element) return;

        // Get updated properties
        const updatedProperties = {};
        Object.keys(element.properties).forEach(key => {
            const input = document.querySelector(`#prop_${elementId}_${key}`);
            if (input) {
                updatedProperties[key] = input.value;
            }
        });

        // Update element properties
        this.elements[elementId].properties = { ...element.properties, ...updatedProperties };

        // Re-render element
        this.renderElement(elementId);
        this.markDirty();

        console.log(`✅ Properties applied for: ${elementId}`);
    }

    // Render element with current properties
    renderElement(elementId) {
        const element = this.elements[elementId];
        if (!element) return;

        const elementWrapper = element.element;
        const props = element.properties;
        const type = element.type;

        let content = '';

        switch (type) {
            case 'text':
                content = `<p class="kb-text" style="font-size: ${props.fontSize}; color: ${props.color}; font-weight: ${props.fontWeight}; text-align: ${props.textAlign}; margin: 0;">${props.text}</p>`;
                break;
            case 'heading':
                content = `<${props.tag} class="kb-heading" style="font-size: ${props.fontSize}; color: ${props.color}; font-weight: ${props.fontWeight}; text-align: ${props.textAlign}; margin: 0;">${props.text}</${props.tag}>`;
                break;
            case 'button':
                content = `<button class="kb-button" style="background: ${props.backgroundColor}; color: ${props.color}; padding: ${props.padding}; border: none; border-radius: ${props.borderRadius}; cursor: pointer; font-size: ${props.fontSize};">${props.text}</button>`;
                break;
            case 'spacer':
                content = `<div class="kb-spacer" style="height: ${props.height}; background: transparent;"></div>`;
                break;
            default:
                content = this.widgetTemplates[type].html;
        }

        // Update content while preserving controls
        const controls = elementWrapper.querySelector('.element-controls');
        const firstChild = elementWrapper.firstElementChild;
        if (firstChild && !firstChild.classList.contains('element-controls')) {
            firstChild.outerHTML = content;
        }
    }

    // Edit element
    editElement(elementId) {
        this.selectElement(elementId);
    }

    // Duplicate element
    duplicateElement(elementId) {
        const element = this.elements[elementId];
        if (!element) return;

        const newElementId = this.addElement(element.type);
        if (newElementId) {
            this.elements[newElementId].properties = { ...element.properties };
            this.renderElement(newElementId);
        }
    }

    // Delete element
    deleteElement(elementId) {
        const element = this.elements[elementId];
        if (!element) return;

        element.element.remove();
        delete this.elements[elementId];

        if (this.selectedElement === elementId) {
            this.selectedElement = null;
            this.hideProperties();
        }

        this.markDirty();
        console.log(`✅ Element deleted: ${elementId}`);
    }

    // Setup save system
    setupSaveSystem() {
        console.log('💾 Setting up save system...');
        
        // Auto-save every 30 seconds
        setInterval(() => {
            if (this.isDirty) {
                this.savePage(true); // Auto-save
            }
        }, 30000);

        console.log('✅ Save system setup complete');
    }

    // Save page
    async savePage(isAutoSave = false) {
        console.log(`💾 ${isAutoSave ? 'Auto-saving' : 'Saving'} page...`);

        try {
            const pageData = this.getPageData();
            
            // Get page ID from URL
            const urlParams = new URLSearchParams(window.location.search);
            const pageId = urlParams.get('page') || urlParams.get('pageId');

            if (!pageId) {
                throw new Error('No page ID found');
            }

            // Save to API
            const response = await fetch(`/api/pages/${pageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: pageData.html,
                    elements: pageData.elements,
                    lastModified: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`Save failed: ${response.statusText}`);
            }

            this.isDirty = false;
            
            if (!isAutoSave) {
                this.showNotification('✅ Page saved successfully!', 'success');
            }

            console.log(`✅ Page ${isAutoSave ? 'auto-saved' : 'saved'} successfully`);
        } catch (error) {
            console.error('❌ Save failed:', error);
            this.showNotification('❌ Save failed: ' + error.message, 'error');
        }
    }

    // Setup preview system
    setupPreviewSystem() {
        console.log('👁️ Setting up preview system...');
        console.log('✅ Preview system setup complete');
    }

    // Preview page
    previewPage() {
        console.log('👁️ Opening preview...');
        
        const pageData = this.getPageData();
        
        // Open preview in new window
        const previewWindow = window.open('', '_blank');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Preview - KingsBuilder</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <style>
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                    .preview-header { background: #000; color: white; padding: 10px 20px; margin: -20px -20px 20px -20px; }
                </style>
            </head>
            <body>
                <div class="preview-header">
                    <h3 style="margin: 0;">Preview Mode</h3>
                </div>
                ${pageData.html}
            </body>
            </html>
        `);
        
        this.showNotification('👁️ Preview opened in new window', 'info');
    }

    // Setup publish system
    setupPublishSystem() {
        console.log('🚀 Setting up publish system...');
        console.log('✅ Publish system setup complete');
    }

    // Publish page
    async publishPage() {
        console.log('🚀 Publishing page...');

        try {
            // First save the page
            await this.savePage();

            // Get page ID
            const urlParams = new URLSearchParams(window.location.search);
            const pageId = urlParams.get('page') || urlParams.get('pageId');

            if (!pageId) {
                throw new Error('No page ID found');
            }

            // Publish to Shopify
            const response = await fetch(`/api/pages/${pageId}/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                throw new Error(`Publish failed: ${response.statusText}`);
            }

            const result = await response.json();
            
            this.showNotification('🚀 Page published successfully!', 'success');
            console.log('✅ Page published successfully');

            // Show publish success modal
            this.showPublishSuccess(result.url);

        } catch (error) {
            console.error('❌ Publish failed:', error);
            this.showNotification('❌ Publish failed: ' + error.message, 'error');
        }
    }

    // Show publish success modal
    showPublishSuccess(url) {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        modal.innerHTML = `
            <div style="
                background: white;
                padding: 30px;
                border-radius: 8px;
                text-align: center;
                max-width: 400px;
                width: 90%;
            ">
                <h2 style="color: #28a745; margin-bottom: 20px;">🚀 Published Successfully!</h2>
                <p style="margin-bottom: 20px;">Your page is now live on your Shopify store.</p>
                <div style="display: flex; gap: 10px; justify-content: center;">
                    <a href="${url}" target="_blank" style="
                        background: #007cba;
                        color: white;
                        padding: 10px 20px;
                        text-decoration: none;
                        border-radius: 4px;
                        font-weight: bold;
                    ">View Live Page</a>
                    <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
                        background: #6c757d;
                        color: white;
                        padding: 10px 20px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        font-weight: bold;
                    ">Close</button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    }

    // Get page data
    getPageData() {
        const canvasFrame = document.querySelector('.canvas-frame');
        const html = canvasFrame ? canvasFrame.innerHTML : '';
        
        return {
            html: html,
            elements: this.elements,
            timestamp: new Date().toISOString()
        };
    }

    // Load page data
    async loadPageData() {
        console.log('📄 Loading page data...');

        try {
            const urlParams = new URLSearchParams(window.location.search);
            const pageId = urlParams.get('page') || urlParams.get('pageId');

            if (!pageId) {
                console.log('No page ID found, starting with empty page');
                return;
            }

            const response = await fetch(`/api/pages/${pageId}`);
            if (!response.ok) {
                throw new Error(`Load failed: ${response.statusText}`);
            }

            const pageData = await response.json();
            
            if (pageData.content) {
                const canvasFrame = document.querySelector('.canvas-frame');
                if (canvasFrame) {
                    canvasFrame.innerHTML = pageData.content;
                }
            }

            if (pageData.elements) {
                this.elements = pageData.elements;
            }

            console.log('✅ Page data loaded successfully');
        } catch (error) {
            console.error('❌ Load failed:', error);
            console.log('Starting with empty page');
        }
    }

    // Mark as dirty (needs saving)
    markDirty() {
        this.isDirty = true;
        
        // Update save button
        const saveBtn = document.getElementById('save-btn');
        if (saveBtn) {
            saveBtn.style.background = '#ffc107';
            saveBtn.style.color = '#000';
        }
    }

    // Set device view
    setDeviceView(device) {
        console.log(`📱 Setting device view: ${device}`);
        
        const canvasFrame = document.querySelector('.canvas-frame');
        if (!canvasFrame) return;

        // Remove active class from all device buttons
        document.querySelectorAll('#desktop-view, #tablet-view, #mobile-view').forEach(btn => {
            btn.classList.remove('active');
        });

        // Add active class to current device button
        document.getElementById(`${device}-view`).classList.add('active');

        // Set canvas width based on device
        switch (device) {
            case 'desktop':
                canvasFrame.style.maxWidth = '100%';
                break;
            case 'tablet':
                canvasFrame.style.maxWidth = '768px';
                break;
            case 'mobile':
                canvasFrame.style.maxWidth = '375px';
                break;
        }

        canvasFrame.style.margin = '0 auto';
    }

    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            border-radius: 6px;
            color: white;
            font-weight: bold;
            z-index: 10000;
            animation: slideIn 0.3s ease;
            background: ${type === 'success' ? '#28a745' : type === 'error' ? '#dc3545' : '#007cba'};
        `;

        notification.textContent = message;
        document.body.appendChild(notification);

        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Undo functionality
    undo() {
        console.log('↶ Undo');
        this.showNotification('↶ Undo functionality coming soon', 'info');
    }

    // Redo functionality
    redo() {
        console.log('↷ Redo');
        this.showNotification('↷ Redo functionality coming soon', 'info');
    }
}

// Initialize complete builder system
const completeBuilder = new CompleteBuilderSystem();
window.completeBuilder = completeBuilder;

// Override any existing broken systems
window.kingsBuilder = completeBuilder;

console.log('✅ COMPLETE BUILDER SYSTEM: Loaded and ready!');

// ===== KingsBuilder Patch: savePage / publishPage implementations =====
if (window.CompleteBuilderSystem && !window.CompleteBuilderSystem.prototype.savePage) {
    window.CompleteBuilderSystem.prototype.savePage = function(){
        var self = this;
        if (!this.currentPageId) {
            alert('No page loaded!');
            return;
        }
        var htmlContent = document.querySelector('#canvas') ? document.querySelector('#canvas').innerHTML : document.body.innerHTML;
        // remove editor-only controls
        htmlContent = htmlContent.replace(/<div class="(?:kb-)?element-controls"[\s\S]*?<\/div>/g, '');
        var payload = {
            shop: this.shop || (window.context && window.context.shop),
            content: htmlContent,
            title: this.currentPageTitle || ''
        };
        console.log('💾 Saving page...', payload);
        fetch('/api/pages/' + this.currentPageId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            credentials: 'include'
        }).then(function(res){
            if (!res.ok) { throw new Error('Save failed'); }
            return res.json();
        }).then(function(json){
            console.log('✅ Page saved', json);
            alert('Page saved successfully!');
        }).catch(function(err){
            console.error('❌ Save error', err);
            alert('Save failed: ' + err.message);
        });
    };
}
if (window.CompleteBuilderSystem && !window.CompleteBuilderSystem.prototype.publishPage) {
    window.CompleteBuilderSystem.prototype.publishPage = function(){
        this.savePage();
        alert('Page published successfully!');
    };
}
// ===== End Patch =====