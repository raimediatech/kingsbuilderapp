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
    container: {
        name: 'Container',
        html: '<div class="kb-container" style="min-height:80px; border:2px dashed #ccc; padding:20px; text-align:center;">Drag elements here</div>',
        properties: {
            backgroundColor: '#ffffff',
            padding: '20px',
            border: 'none',
            borderRadius: '0px'
        }
    },
    heading: {
        name: 'Heading',
        html: '<h2 class="kb-heading" style="margin:0; padding:10px; font-size:24px; color:#000; font-weight:bold;">Your Heading</h2>',
        properties: {
            text: 'Your Heading',
            fontSize: '24px',
            color: '#000000',
            fontWeight: 'bold',
            textAlign: 'left',
            tag: 'h2'
        }
    },
    text: {
        name: 'Text',
        html: '<p class="kb-text" style="margin:0; padding:10px; font-size:16px; color:#333;">Your text content here...</p>',
        properties: {
            text: 'Your text content here...',
            fontSize: '16px',
            color: '#333333',
            fontWeight: 'normal',
            textAlign: 'left'
        }
    },
    image: {
        name: 'Image',
        html: '<img src="https://placehold.co/600x400?text=Image" alt="Image" style="width:100%; height:auto;">',
        properties: {
            src: '',
            alt: '',
            width: '100%',
            height: 'auto',
            borderRadius: '0px'
        }
    },
    button: {
        name: 'Button',
        html: '<a href="#" class="kb-button" style="display:inline-block; background:#007cba; color:#fff; padding:12px 24px; border-radius:4px; font-size:16px; text-decoration:none;">Click Me</a>',
        properties: {
            text: 'Click Me',
            backgroundColor: '#007cba',
            color: '#ffffff',
            padding: '12px 24px',
            borderRadius: '4px',
            fontSize: '16px',
            href: '#'
        }
    }
};