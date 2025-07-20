import IconListWidget from './widgets/IconListWidget';
import SpacerWidget from './widgets/SpacerWidget';
import HeadingWidget from './widgets/HeadingWidget';
// COMPLETE WIDGET SYSTEM FIX
class WidgetSystemFix {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.widgets = {

container: {
    name: 'Container',
    preview: '<div style="min-height:60px;border:2px dashed #888;padding:20px;text-align:center;">Drop elements here</div>',
    properties: {
        padding: '20px',
        backgroundColor: 'transparent',
        borderColor: '#888888',
        borderStyle: 'dashed',
        borderWidth: '2px'
    }
},
};
        this.selectedWidget = null;
        this.init();
    }

    init() {
        if (!this.isBuilder) return;
        
        console.log('🔧 WIDGET SYSTEM FIX: Initializing...');
        
        // Fix widget system
        this.setupWidgetSystem();
        this.fixWidgetProperties();
        this.fixCanvasUI();
        this.setupWidgetPreviews();
        
        console.log('✅ WIDGET SYSTEM FIX: Complete');
    }

    // Setup proper widget system
    setupWidgetSystem() {
        console.log('🔧 Setting up widget system...');
        
        // Define proper widgets with real content
        this.widgets = {
            text: {
                name: 'Text',
                icon: 'fas fa-font',
                preview: '<p style="margin: 0; padding: 10px; font-size: 16px; color: #333;">Sample text content. Click to edit this text.</p>',
                properties: {
                    text: 'Sample text content',
                    fontSize: '16px',
                    color: '#333333',
                    fontWeight: 'normal',
                    textAlign: 'left'
                }
            },
            heading: {
                name: 'Heading',
                icon: 'fas fa-heading',
                preview: '<h2 style="margin: 0; padding: 10px; font-size: 24px; color: #000; font-weight: bold;">Sample Heading</h2>',
                properties: {
                    text: 'Sample Heading',
                    fontSize: '24px',
                    color: '#000000',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    tag: 'h2'
                }
            },
            button: {
                name: 'Button',
                icon: 'fas fa-mouse-pointer',
                preview: '<button style="background: #007cba; color: white; padding: 12px 24px; border: none; border-radius: 4px; cursor: pointer; font-size: 16px;">Click Me</button>',
                properties: {
                    text: 'Click Me',
                    backgroundColor: '#007cba',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '4px',
                    fontSize: '16px',
                    href: '#'
                }
            },
            image: {
                name: 'Image',
                icon: 'fas fa-image',
                preview: '<div style="background: #f0f0f0; padding: 20px; text-align: center; border: 2px dashed #ccc;"><i class="fas fa-image" style="font-size: 48px; color: #999;"></i><p style="margin: 10px 0 0 0; color: #666;">Click to upload image</p></div>',
                properties: {
                    src: '',
                    alt: 'Image',
                    width: '100%',
                    height: 'auto',
                    borderRadius: '0px'
                }
            },
            video: {
                name: 'Video',
                icon: 'fas fa-video',
                preview: '<div style="background: #000; padding: 40px; text-align: center; border-radius: 4px;"><i class="fas fa-play" style="font-size: 48px; color: white;"></i><p style="margin: 10px 0 0 0; color: white;">Video Player</p></div>',
                properties: {
                    src: '',
                    width: '100%',
                    height: '300px',
                    controls: true,
                    autoplay: false
                }
            },
            list: {
                name: 'List',
                icon: 'fas fa-list',
                preview: '<ul style="margin: 0; padding: 10px 10px 10px 30px;"><li style="margin-bottom: 8px;">First list item</li><li style="margin-bottom: 8px;">Second list item</li><li style="margin-bottom: 8px;">Third list item</li></ul>',
                properties: {
                    items: ['First list item', 'Second list item', 'Third list item'],
                    listType: 'ul',
                    fontSize: '16px',
                    color: '#333333'
                }
            }
        };

        // Override the broken widget system
        window.kingsBuilder = window.kingsBuilder || {};
        window.kingsBuilder.addElement = (type) => this.addWidget(type);
        window.kingsBuilder.selectElement = (id) => this.selectWidget(id);
        window.kingsBuilder.editElement = (id) => this.editWidget(id);
        window.kingsBuilder.deleteElement = (id) => this.deleteWidget(id);
        
        console.log('✅ Widget system setup complete');
    }

    // Add widget to canvas
    addWidget(type) {
        console.log(`🔧 Adding widget: ${type}`);
        
        const widget = this.widgets[type];
        if (!widget) {
            console.error(`❌ Widget type ${type} not found`);
            return;
        }

        const canvasFrame = document.querySelector('.canvas-frame');
        if (!canvasFrame) {
            console.error('❌ Canvas frame not found');
            return;
        }

        // Generate unique ID
        const widgetId = `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

        // Create widget element
        const widgetElement = document.createElement('div');
        widgetElement.className = 'kb-widget';
        widgetElement.setAttribute('data-widget-id', widgetId);
        widgetElement.setAttribute('data-widget-type', type);
        widgetElement.style.cssText = `
            position: relative;
            margin: 10px 0;
            cursor: pointer;
            border: 2px solid transparent;
            transition: border-color 0.2s;
        `;

        // Add widget content
        widgetElement.innerHTML = `
            ${widget.preview}
            <div class="widget-controls" style="
                position: absolute;
                top: -30px;
                right: 0;
                background: #000;
                border-radius: 4px;
                padding: 4px;
                display: none;
            ">
                <button onclick="window.widgetSystemFix.editWidget('${widgetId}')" style="
                    background: none;
                    border: none;
                    color: white;
                    padding: 4px 8px;
                    cursor: pointer;
                    font-size: 12px;
                ">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button onclick="window.widgetSystemFix.deleteWidget('${widgetId}')" style="
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

        // Add click handler
        widgetElement.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectWidget(widgetId);
        });

        // Show controls on hover
        widgetElement.addEventListener('mouseenter', () => {
            const controls = widgetElement.querySelector('.widget-controls');
            if (controls) controls.style.display = 'block';
        });

        widgetElement.addEventListener('mouseleave', () => {
            const controls = widgetElement.querySelector('.widget-controls');
            if (controls) controls.style.display = 'none';
        });

        // Add to canvas
        canvasFrame.appendChild(widgetElement);

        // Store widget data
        this.widgets[widgetId] = {
            ...widget,
            id: widgetId,
            element: widgetElement
        };

        // Select the new widget
        this.selectWidget(widgetId);

        console.log(`✅ Widget ${type} added with ID: ${widgetId}`);
    }

    // Select widget and show properties
    selectWidget(widgetId) {
        console.log(`🔧 Selecting widget: ${widgetId}`);

        // Remove previous selection
        document.querySelectorAll('.kb-widget').forEach(el => {
            el.style.border = '2px solid transparent';
        });

        // Select current widget
        const widgetElement = document.querySelector(`[data-widget-id="${widgetId}"]`);
        if (widgetElement) {
            widgetElement.style.border = '2px solid #007cba';
            this.selectedWidget = widgetId;
            this.showWidgetProperties(widgetId);
        }
    }

    // Show widget properties panel
    showWidgetProperties(widgetId) {
        console.log(`🔧 Showing properties for: ${widgetId}`);

        const widget = this.widgets[widgetId];
        if (!widget) return;

        // Find or create properties panel
        let propertiesPanel = document.querySelector('.widget-properties-panel');
        if (!propertiesPanel) {
            propertiesPanel = document.createElement('div');
            propertiesPanel.className = 'widget-properties-panel';
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
                <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${widget.name} Properties</h3>
                <button onclick="this.parentElement.parentElement.style.display='none'" style="
                    background: none;
                    border: none;
                    font-size: 18px;
                    cursor: pointer;
                    color: #999;
                ">×</button>
            </div>
        `;

        // Add property inputs based on widget type
        Object.entries(widget.properties).forEach(([key, value]) => {
            propertiesHTML += `
                <div style="margin-bottom: 15px;">
                    <label style="display: block; margin-bottom: 5px; font-weight: 500; text-transform: capitalize;">
                        ${key.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    ${this.createPropertyInput(key, value, widgetId)}
                </div>
            `;
        });

        propertiesHTML += `
            <button onclick="window.widgetSystemFix.applyProperties('${widgetId}')" style="
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

    // Create property input based on type
    createPropertyInput(key, value, widgetId) {
        const inputId = `prop_${widgetId}_${key}`;
        
        if (key === 'color' || key === 'backgroundColor') {
            return `<input type="color" id="${inputId}" value="${value}" style="width: 100%; height: 40px; border: 1px solid #ddd; border-radius: 4px;">`;
        } else if (key === 'fontSize') {
            return `<input type="text" id="${inputId}" value="${value}" placeholder="16px" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">`;
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
        } else {
            return `<input type="text" id="${inputId}" value="${value}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">`;
        }
    }

    // Apply property changes
    applyProperties(widgetId) {
        console.log(`🔧 Applying properties for: ${widgetId}`);

        const widget = this.widgets[widgetId];
        if (!widget) return;

        const widgetElement = document.querySelector(`[data-widget-id="${widgetId}"]`);
        if (!widgetElement) return;

        // Get updated properties
        const updatedProperties = {};
        Object.keys(widget.properties).forEach(key => {
            const input = document.querySelector(`#prop_${widgetId}_${key}`);
            if (input) {
                updatedProperties[key] = input.value;
            }
        });

        // Update widget properties
        this.widgets[widgetId].properties = { ...widget.properties, ...updatedProperties };

        // Re-render widget with new properties
        this.renderWidget(widgetId);

        console.log(`✅ Properties applied for: ${widgetId}`);
    }

    // Render widget with current properties
    renderWidget(widgetId) {
        const widget = this.widgets[widgetId];
        if (!widget) return;

        const widgetElement = document.querySelector(`[data-widget-id="${widgetId}"]`);
        if (!widgetElement) return;

        const type = widgetElement.getAttribute('data-widget-type');
        const props = widget.properties;

        let content = '';

        switch (type) {
            case 'text':
                content = `<p style="margin: 0; padding: 10px; font-size: ${props.fontSize}; color: ${props.color}; font-weight: ${props.fontWeight}; text-align: ${props.textAlign};">${props.text}</p>`;
                break;
            case 'heading':
                content = `<${props.tag} style="margin: 0; padding: 10px; font-size: ${props.fontSize}; color: ${props.color}; font-weight: ${props.fontWeight}; text-align: ${props.textAlign};">${props.text}</${props.tag}>`;
                break;
            case 'button':
                content = `<button style="background: ${props.backgroundColor}; color: ${props.color}; padding: ${props.padding}; border: none; border-radius: ${props.borderRadius}; cursor: pointer; font-size: ${props.fontSize};">${props.text}</button>`;
                break;
            default:
                content = widget.preview;
        }

        // Update content while preserving controls
        const controls = widgetElement.querySelector('.widget-controls');
        widgetElement.innerHTML = content;
        if (controls) {
            widgetElement.appendChild(controls);
        }
    }

    // Edit widget
    editWidget(widgetId) {
        this.selectWidget(widgetId);
    }

    // Delete widget
    deleteWidget(widgetId) {
        console.log(`🔧 Deleting widget: ${widgetId}`);

        const widgetElement = document.querySelector(`[data-widget-id="${widgetId}"]`);
        if (widgetElement) {
            widgetElement.remove();
        }

        delete this.widgets[widgetId];

        // Hide properties panel if this widget was selected
        if (this.selectedWidget === widgetId) {
            const propertiesPanel = document.querySelector('.widget-properties-panel');
            if (propertiesPanel) {
                propertiesPanel.style.display = 'none';
            }
            this.selectedWidget = null;
        }

        console.log(`✅ Widget deleted: ${widgetId}`);
    }

    // Fix widget properties panel
    fixWidgetProperties() {
        console.log('🔧 Fixing widget properties...');
        
        // Override broken property system
        document.addEventListener('click', (e) => {
            if (e.target.closest('.kb-widget')) {
                const widget = e.target.closest('.kb-widget');
                const widgetId = widget.getAttribute('data-widget-id');
                if (widgetId) {
                    this.selectWidget(widgetId);
                }
            }
        });

        console.log('✅ Widget properties fixed');
    }

    // Fix canvas UI
    fixCanvasUI() {
        console.log('🔧 Fixing canvas UI...');

        const style = document.createElement('style');
        style.id = 'canvas-ui-fix';
        style.textContent = `
            .canvas-frame {
                background: #ffffff !important;
                min-height: 600px !important;
                padding: 20px !important;
                border: 1px solid #e0e0e0 !important;
                border-radius: 8px !important;
            }

            .kb-widget {
                position: relative !important;
                margin: 10px 0 !important;
                cursor: pointer !important;
                border: 2px solid transparent !important;
                transition: border-color 0.2s !important;
            }

            .kb-widget:hover {
                border-color: #007cba !important;
            }

            .widget-controls {
                position: absolute !important;
                top: -30px !important;
                right: 0 !important;
                background: #000 !important;
                border-radius: 4px !important;
                padding: 4px !important;
                display: none !important;
                z-index: 10 !important;
            }

            .kb-widget:hover .widget-controls {
                display: block !important;
            }
        `;
        document.head.appendChild(style);

        console.log('✅ Canvas UI fixed');
    }

    // Setup widget previews in sidebar
    setupWidgetPreviews() {
        console.log('🔧 Setting up widget previews...');

        // Fix sidebar widget items
        setTimeout(() => {
            const elementItems = document.querySelectorAll('.element-item');
            elementItems.forEach(item => {
                const widgetType = item.getAttribute('data-element-type') || 
                                 item.getAttribute('onclick')?.match(/addElement\('(\w+)'\)/)?.[1];
                
                if (widgetType && this.widgets[widgetType]) {
                    const widget = this.widgets[widgetType];
                    
                    // Update icon
                    const icon = item.querySelector('i');
                    if (icon) {
                        icon.className = widget.icon;
                    }
                    
                    // Update text
                    const text = item.querySelector('.element-name') || item;
                    if (text) {
                        text.textContent = widget.name;
                    }
                    
                    // Fix click handler
                    item.onclick = () => this.addWidget(widgetType);
                }
            });
        }, 1000);

        console.log('✅ Widget previews setup complete');
    }
}

// Initialize widget system fix

// Expose widgets globally so CompleteBuilderSystem can read them

// Initialize and expose widgetSystemFix globally
const widgetSystemFix = new WidgetSystemFix();
window.widgetSystemFix = widgetSystemFix;
window.widgets = Object.entries(widgetSystemFix.widgets).map(([type, data]) => ({ type, ...data }));

console.log('✅ WIDGET SYSTEM FIX: Loaded');