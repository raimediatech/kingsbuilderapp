// 🎯 SINGLE CLEAN ELEMENTOR - NO CONFLICTS, CLEAN IMPLEMENTATION
console.log('🎯 SINGLE CLEAN ELEMENTOR: Starting...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎯 DOM Ready, initializing...');
    
    // Remove ALL existing conflicting elements
    setTimeout(() => {
        console.log('🧹 Cleaning up conflicts...');
        
        // Remove all existing panels and popups
        document.querySelectorAll(`
            #elementor-panel,
            #elementor-widget-options,
            .elementor-properties-panel,
            #final-elementor-interface,
            #completion-indicator,
            .completion-indicator,
            .elementor-context-menu,
            .elementor-right-click-menu,
            #elementor-editor-wrapper
        `).forEach(el => {
            console.log('🗑️ Removing:', el.id || el.className);
            el.remove();
        });
        
        // Disable all other systems
        window.finalElementorSystem = null;
        window.elementorStyleWidgetOptions = null;
        window.completeElementorSystem = null;
        window.elementorExactInterface = null;
        
        console.log('✅ Cleanup complete, creating interface...');
        createCleanElementorInterface();
        
    }, 1000);
});

function createCleanElementorInterface() {
    console.log('🎯 Creating clean Elementor interface...');
    
    // Create the main interface
    const interface = document.createElement('div');
    interface.id = 'clean-elementor-interface';
    interface.innerHTML = `
        <!-- TOP NAVIGATION -->
        <div class="elementor-top-bar">
            <div class="elementor-top-left">
                <div class="elementor-logo">
                    <i class="fas fa-crown"></i>
                    <span>KingsBuilder</span>
                </div>
                <span class="elementor-doc-title">Edit Page</span>
            </div>
            
            <div class="elementor-top-center">
                <div class="elementor-device-modes">
                    <button class="device-btn active" data-device="desktop">
                        <i class="fas fa-desktop"></i>
                    </button>
                    <button class="device-btn" data-device="tablet">
                        <i class="fas fa-tablet-alt"></i>
                    </button>
                    <button class="device-btn" data-device="mobile">
                        <i class="fas fa-mobile-alt"></i>
                    </button>
                </div>
            </div>
            
            <div class="elementor-top-right">
                <button class="top-btn save-btn">
                    <i class="fas fa-save"></i>
                    Update
                </button>
                <button class="top-btn preview-btn">
                    <i class="fas fa-eye"></i>
                    Preview
                </button>
                <button class="top-btn exit-btn">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        </div>

        <!-- LEFT SIDEBAR -->
        <div class="elementor-left-panel">
            <!-- Panel Tabs -->
            <div class="panel-tabs">
                <button class="panel-tab active" data-tab="elements">
                    <i class="fas fa-plus"></i>
                    <span>Elements</span>
                </button>
                <button class="panel-tab" data-tab="settings">
                    <i class="fas fa-cog"></i>
                    <span>Settings</span>
                </button>
            </div>

            <!-- Elements Tab -->
            <div class="panel-content elements-content active">
                <div class="widget-search">
                    <input type="text" placeholder="Search Widget..." class="search-input">
                    <i class="fas fa-search"></i>
                </div>
                
                <div class="widgets-grid">
                    <div class="widget-item" data-widget="heading">
                        <i class="fas fa-heading"></i>
                        <span>Heading</span>
                    </div>
                    <div class="widget-item" data-widget="text">
                        <i class="fas fa-font"></i>
                        <span>Text</span>
                    </div>
                    <div class="widget-item" data-widget="button">
                        <i class="fas fa-mouse-pointer"></i>
                        <span>Button</span>
                    </div>
                    <div class="widget-item" data-widget="image">
                        <i class="fas fa-image"></i>
                        <span>Image</span>
                    </div>
                    <div class="widget-item" data-widget="section">
                        <i class="fas fa-columns"></i>
                        <span>Section</span>
                    </div>
                    <div class="widget-item" data-widget="spacer">
                        <i class="fas fa-arrows-alt-v"></i>
                        <span>Spacer</span>
                    </div>
                </div>
            </div>

            <!-- Settings Tab -->
            <div class="panel-content settings-content">
                <div class="settings-header">
                    <h3 id="selected-element-title">Select an element</h3>
                    <button class="close-settings">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="settings-tabs">
                    <button class="settings-tab active" data-tab="content">
                        <i class="fas fa-edit"></i>
                        Content
                    </button>
                    <button class="settings-tab" data-tab="style">
                        <i class="fas fa-paint-brush"></i>
                        Style
                    </button>
                    <button class="settings-tab" data-tab="advanced">
                        <i class="fas fa-cogs"></i>
                        Advanced
                    </button>
                </div>
                
                <div class="settings-panels">
                    <div class="settings-panel active" data-panel="content">
                        <div id="content-controls">Select an element to edit</div>
                    </div>
                    <div class="settings-panel" data-panel="style">
                        <div id="style-controls">Select an element to style</div>
                    </div>
                    <div class="settings-panel" data-panel="advanced">
                        <div id="advanced-controls">Select an element for advanced options</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- CANVAS AREA -->
        <div class="elementor-canvas-area">
            <div class="canvas-wrapper">
                <!-- Canvas content will be moved here -->
            </div>
        </div>

        <!-- CONTEXT MENU -->
        <div class="context-menu" id="context-menu">
            <div class="context-item" data-action="edit">
                <i class="fas fa-edit"></i>
                Edit
            </div>
            <div class="context-item" data-action="duplicate">
                <i class="fas fa-clone"></i>
                Duplicate
            </div>
            <div class="context-item" data-action="delete">
                <i class="fas fa-trash"></i>
                Delete
            </div>
        </div>
    `;

    // Add comprehensive styles
    const styles = document.createElement('style');
    styles.textContent = `
        /* CLEAN ELEMENTOR INTERFACE STYLES */
        #clean-elementor-interface {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100vh;
            z-index: 20000;
            display: flex;
            flex-direction: column;
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: #f1f3f4;
        }

        /* TOP NAVIGATION */
        .elementor-top-bar {
            height: 60px;
            background: #ffffff;
            border-bottom: 1px solid #e6e9ec;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 21000;
        }

        .elementor-top-left {
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

        .elementor-doc-title {
            color: #6b7280;
            font-size: 14px;
        }

        .elementor-top-center {
            display: flex;
            align-items: center;
        }

        .elementor-device-modes {
            display: flex;
            background: #f8f9fa;
            border-radius: 6px;
            padding: 4px;
            gap: 2px;
        }

        .device-btn {
            padding: 8px 12px;
            border: none;
            background: transparent;
            border-radius: 4px;
            cursor: pointer;
            color: #6b7280;
            transition: all 0.2s;
        }

        .device-btn.active {
            background: #000000;
            color: white;
        }

        .elementor-top-right {
            display: flex;
            align-items: center;
            gap: 12px;
        }

        .top-btn {
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

        .top-btn:hover {
            background: #333333;
        }

        .exit-btn {
            background: #f8f9fa;
            color: #6b7280;
            border: 1px solid #e6e9ec;
        }

        .exit-btn:hover {
            background: #e6e9ec;
            color: #374151;
        }

        /* LEFT PANEL */
        .elementor-left-panel {
            width: 320px;
            height: calc(100vh - 60px);
            background: #ffffff;
            border-right: 1px solid #e6e9ec;
            display: flex;
            flex-direction: column;
            box-shadow: 2px 0 10px rgba(0,0,0,0.1);
        }

        .panel-tabs {
            display: flex;
            border-bottom: 1px solid #e6e9ec;
            background: #f8f9fa;
        }

        .panel-tab {
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

        .panel-tab:hover {
            background: rgba(0,0,0,0.05);
            color: #374151;
        }

        .panel-tab.active {
            color: #000000;
            border-bottom-color: #000000;
            background: rgba(0,0,0,0.05);
        }

        .panel-tab i {
            font-size: 16px;
        }

        .panel-content {
            flex: 1;
            overflow-y: auto;
            display: none;
        }

        .panel-content.active {
            display: block;
        }

        /* ELEMENTS TAB */
        .widget-search {
            padding: 20px;
            border-bottom: 1px solid #e6e9ec;
            position: relative;
        }

        .search-input {
            width: 100%;
            padding: 10px 40px 10px 12px;
            border: 1px solid #e6e9ec;
            border-radius: 6px;
            font-size: 13px;
            background: #f8f9fa;
        }

        .search-input:focus {
            outline: none;
            border-color: #000000;
            background: white;
        }

        .widget-search i {
            position: absolute;
            right: 32px;
            top: 50%;
            transform: translateY(-50%);
            color: #6b7280;
        }

        .widgets-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
            padding: 20px;
        }

        .widget-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 16px 12px;
            background: #ffffff;
            border: 1px solid #e6e9ec;
            border-radius: 8px;
            cursor: pointer;
            transition: all 0.2s;
            text-align: center;
            user-select: none;
        }

        .widget-item:hover {
            background: #f8f9fa;
            border-color: #000000;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .widget-item i {
            font-size: 20px;
            color: #000000;
            margin-bottom: 8px;
        }

        .widget-item span {
            font-size: 11px;
            font-weight: 500;
            color: #374151;
        }

        /* SETTINGS TAB */
        .settings-header {
            padding: 20px;
            border-bottom: 1px solid #e6e9ec;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #f8f9fa;
        }

        .settings-header h3 {
            margin: 0;
            font-size: 14px;
            font-weight: 600;
            color: #1f2937;
        }

        .close-settings {
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            border-radius: 4px;
            color: #6b7280;
            transition: all 0.2s;
        }

        .close-settings:hover {
            background: rgba(0,0,0,0.1);
            color: #000000;
        }

        .settings-tabs {
            display: flex;
            border-bottom: 1px solid #e6e9ec;
            background: #ffffff;
        }

        .settings-tab {
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

        .settings-tab:hover {
            background: #f8f9fa;
            color: #374151;
        }

        .settings-tab.active {
            color: #000000;
            border-bottom-color: #000000;
            background: #f8f9fa;
        }

        .settings-panels {
            flex: 1;
            overflow-y: auto;
        }

        .settings-panel {
            display: none;
            padding: 20px;
        }

        .settings-panel.active {
            display: block;
        }

        /* CANVAS AREA */
        .elementor-canvas-area {
            flex: 1;
            height: calc(100vh - 60px);
            background: #f1f3f4;
            position: relative;
            overflow: auto;
        }

        .canvas-wrapper {
            width: 100%;
            height: 100%;
            padding: 20px;
        }

        /* ELEMENT SELECTION */
        .kb-selected {
            outline: 2px solid #000000 !important;
            outline-offset: -2px;
            position: relative;
        }

        .kb-selected::after {
            content: attr(data-widget-type);
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
        .context-menu {
            position: fixed;
            background: white;
            border: 1px solid #e6e9ec;
            border-radius: 8px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.15);
            z-index: 25000;
            min-width: 150px;
            padding: 8px 0;
            display: none;
        }

        .context-item {
            padding: 10px 16px;
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

        .context-item[data-action="delete"]:hover {
            background: #fef2f2;
            color: #dc2626;
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

        /* CONTROL STYLES */
        .control-group {
            margin-bottom: 20px;
        }

        .control-label {
            display: block;
            font-size: 12px;
            font-weight: 500;
            color: #374151;
            margin-bottom: 6px;
        }

        .control-input {
            width: 100%;
            padding: 8px 12px;
            border: 1px solid #e6e9ec;
            border-radius: 6px;
            font-size: 13px;
            transition: border-color 0.2s;
            background: #ffffff;
        }

        .control-input:focus {
            outline: none;
            border-color: #000000;
            box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1);
        }
    `;

    document.head.appendChild(styles);
    document.body.appendChild(interface);

    // Move existing canvas
    moveCanvasToInterface();
    
    // Setup all events
    setupInterfaceEvents();
    
    console.log('✅ Clean Elementor interface created!');
}

function moveCanvasToInterface() {
    const existingCanvas = document.querySelector('.canvas, .builder-canvas, #canvas, .canvas-frame');
    const canvasWrapper = document.querySelector('.canvas-wrapper');
    
    if (existingCanvas && canvasWrapper) {
        console.log('📦 Moving canvas to interface...');
        canvasWrapper.appendChild(existingCanvas);
        existingCanvas.style.width = '100%';
        existingCanvas.style.height = '100%';
        existingCanvas.style.background = 'white';
        existingCanvas.style.borderRadius = '8px';
        existingCanvas.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        console.log('✅ Canvas moved successfully');
    }
}

function setupInterfaceEvents() {
    console.log('🔧 Setting up events...');
    
    // Panel tab switching
    document.querySelectorAll('.panel-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchPanelTab(tab.dataset.tab);
        });
    });

    // Settings tab switching
    document.querySelectorAll('.settings-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            switchSettingsTab(tab.dataset.tab);
        });
    });

    // Widget clicks
    document.querySelectorAll('.widget-item').forEach(widget => {
        widget.addEventListener('click', () => {
            addWidgetToCanvas(widget.dataset.widget);
        });
    });

    // Canvas element selection
    document.addEventListener('click', (e) => {
        const element = e.target.closest('[data-widget-type], .kb-element');
        if (element && !e.target.closest('#clean-elementor-interface')) {
            e.preventDefault();
            e.stopPropagation();
            selectElement(element);
        }
    });

    // Context menu
    document.addEventListener('contextmenu', (e) => {
        const element = e.target.closest('[data-widget-type], .kb-element');
        if (element && !e.target.closest('#clean-elementor-interface')) {
            e.preventDefault();
            showContextMenu(e, element);
        }
    });

    // Hide context menu
    document.addEventListener('click', () => {
        document.getElementById('context-menu').style.display = 'none';
    });

    // Context menu actions
    document.querySelectorAll('.context-item').forEach(item => {
        item.addEventListener('click', () => {
            handleContextAction(item.dataset.action);
        });
    });

    // Close settings
    document.querySelector('.close-settings').addEventListener('click', () => {
        switchPanelTab('elements');
    });

    console.log('✅ Events setup complete');
}

function switchPanelTab(tabName) {
    // Update tab states
    document.querySelectorAll('.panel-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.panel-content').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    document.querySelector(`.${tabName}-content`).classList.add('active');
    
    console.log(`📋 Switched to ${tabName} tab`);
}

function switchSettingsTab(tabName) {
    // Update settings tab states
    document.querySelectorAll('.settings-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.settings-panel').forEach(p => p.classList.remove('active'));
    
    document.querySelector(`.settings-tab[data-tab="${tabName}"]`).classList.add('active');
    document.querySelector(`[data-panel="${tabName}"]`).classList.add('active');
    
    console.log(`⚙️ Switched to ${tabName} settings`);
}

let selectedElement = null;
let contextElement = null;

const widgets = {
    'heading': '<h2 data-widget-type="heading" class="kb-element" style="margin: 0; padding: 10px;">Your Heading Text</h2>',
    'text': '<div data-widget-type="text" class="kb-element" style="padding: 10px;"><p>Your text content here. Click to edit.</p></div>',
    'button': '<div data-widget-type="button" class="kb-element" style="padding: 10px; text-align: center;"><a href="#" style="display: inline-block; background: #000000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px;">Click Me</a></div>',
    'image': '<div data-widget-type="image" class="kb-element" style="padding: 10px; text-align: center;"><img src="https://via.placeholder.com/400x250/000000/FFFFFF?text=Your+Image" alt="Image" style="max-width: 100%; height: auto;"></div>',
    'section': '<div data-widget-type="section" class="kb-element" style="min-height: 100px; border: 2px dashed #ccc; padding: 20px; margin: 10px 0; background: #f9f9f9;"><p style="text-align: center; color: #666; margin: 0;">Drop widgets here</p></div>',
    'spacer': '<div data-widget-type="spacer" class="kb-element" style="height: 50px; background: transparent; border: 1px dashed #ddd; margin: 10px 0;"></div>'
};

function addWidgetToCanvas(widgetType) {
    console.log(`➕ Adding ${widgetType} widget`);
    
    const canvas = document.querySelector('.canvas, .builder-canvas, #canvas, .canvas-frame');
    if (!canvas) {
        console.error('❌ Canvas not found');
        return;
    }

    const widgetHtml = widgets[widgetType];
    if (!widgetHtml) {
        console.error('❌ Widget type not found:', widgetType);
        return;
    }

    // Create element
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = widgetHtml;
    const newElement = tempDiv.firstElementChild;

    // Add unique ID
    newElement.id = 'kb-' + Math.random().toString(36).substr(2, 9);

    // Add to canvas
    canvas.appendChild(newElement);
    
    // Auto-select
    setTimeout(() => {
        selectElement(newElement);
    }, 100);
    
    console.log(`✅ ${widgetType} widget added`);
}

function selectElement(element) {
    console.log('🎯 Selecting element:', element);

    // Remove previous selection
    document.querySelectorAll('.kb-selected').forEach(el => {
        el.classList.remove('kb-selected');
    });

    // Select new element
    element.classList.add('kb-selected');
    selectedElement = element;

    // Switch to settings tab
    switchPanelTab('settings');
    
    // Update element title
    const elementType = element.dataset.widgetType || 'element';
    document.getElementById('selected-element-title').textContent = elementType.charAt(0).toUpperCase() + elementType.slice(1);

    // Load controls
    loadElementControls(elementType);
}

function loadElementControls(elementType) {
    const contentControls = document.getElementById('content-controls');
    const styleControls = document.getElementById('style-controls');
    const advancedControls = document.getElementById('advanced-controls');

    // Content controls
    if (elementType === 'heading') {
        contentControls.innerHTML = `
            <div class="control-group">
                <label class="control-label">Title</label>
                <textarea class="control-input" data-setting="text" rows="3">${selectedElement.textContent}</textarea>
            </div>
            <div class="control-group">
                <label class="control-label">HTML Tag</label>
                <select class="control-input" data-setting="tag">
                    <option value="h1">H1</option>
                    <option value="h2" selected>H2</option>
                    <option value="h3">H3</option>
                    <option value="h4">H4</option>
                </select>
            </div>
        `;
    } else if (elementType === 'text') {
        contentControls.innerHTML = `
            <div class="control-group">
                <label class="control-label">Content</label>
                <textarea class="control-input" data-setting="content" rows="6">${selectedElement.innerHTML}</textarea>
            </div>
        `;
    } else if (elementType === 'button') {
        const link = selectedElement.querySelector('a');
        contentControls.innerHTML = `
            <div class="control-group">
                <label class="control-label">Button Text</label>
                <input type="text" class="control-input" data-setting="text" value="${link ? link.textContent : ''}">
            </div>
            <div class="control-group">
                <label class="control-label">Link URL</label>
                <input type="url" class="control-input" data-setting="link" value="${link ? link.href : ''}">
            </div>
        `;
    } else {
        contentControls.innerHTML = `
            <div class="control-group">
                <label class="control-label">Content</label>
                <textarea class="control-input" data-setting="content" rows="4">${selectedElement.innerHTML}</textarea>
            </div>
        `;
    }

    // Style controls
    styleControls.innerHTML = `
        <div class="control-group">
            <label class="control-label">Font Size (px)</label>
            <input type="number" class="control-input" data-setting="font-size" min="8" max="100" value="16">
        </div>
        <div class="control-group">
            <label class="control-label">Text Color</label>
            <input type="color" class="control-input" data-setting="color" value="#000000">
        </div>
        <div class="control-group">
            <label class="control-label">Background Color</label>
            <input type="color" class="control-input" data-setting="background-color" value="#ffffff">
        </div>
    `;

    // Advanced controls
    advancedControls.innerHTML = `
        <div class="control-group">
            <label class="control-label">CSS ID</label>
            <input type="text" class="control-input" data-setting="css-id" value="${selectedElement.id}">
        </div>
        <div class="control-group">
            <label class="control-label">CSS Classes</label>
            <input type="text" class="control-input" data-setting="css-classes" placeholder="my-class">
        </div>
    `;

    // Setup control events
    document.querySelectorAll('.control-input').forEach(input => {
        input.addEventListener('input', (e) => {
            updateElementProperty(e.target.dataset.setting, e.target.value);
        });
    });
}

function updateElementProperty(setting, value) {
    if (!selectedElement) return;

    console.log(`🎨 Updating ${setting}: ${value}`);

    switch (setting) {
        case 'text':
        case 'content':
            selectedElement.innerHTML = value;
            break;
        case 'font-size':
            selectedElement.style.fontSize = value + 'px';
            break;
        case 'color':
            selectedElement.style.color = value;
            break;
        case 'background-color':
            selectedElement.style.backgroundColor = value;
            break;
        case 'css-id':
            selectedElement.id = value;
            break;
        case 'css-classes':
            selectedElement.className = 'kb-element ' + value;
            break;
    }
}

function showContextMenu(event, element) {
    const menu = document.getElementById('context-menu');
    menu.style.display = 'block';
    menu.style.left = event.pageX + 'px';
    menu.style.top = event.pageY + 'px';
    contextElement = element;
}

function handleContextAction(action) {
    if (!contextElement) return;

    switch (action) {
        case 'edit':
            selectElement(contextElement);
            break;
        case 'duplicate':
            const clone = contextElement.cloneNode(true);
            clone.id = 'kb-' + Math.random().toString(36).substr(2, 9);
            contextElement.parentNode.insertBefore(clone, contextElement.nextSibling);
            console.log('✅ Element duplicated');
            break;
        case 'delete':
            if (confirm('Delete this element?')) {
                contextElement.remove();
                if (selectedElement === contextElement) {
                    selectedElement = null;
                    switchPanelTab('elements');
                }
                console.log('✅ Element deleted');
            }
            break;
    }
    
    document.getElementById('context-menu').style.display = 'none';
}

console.log('✅ SINGLE CLEAN ELEMENTOR: Ready!');