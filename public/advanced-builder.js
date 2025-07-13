// KingsBuilder - Advanced Visual Page Builder JavaScript
// Enhanced with Elementor-inspired features
// Created by Kingsmen Marketing Agency

class KingsBuilderAdvanced extends KingsBuilder {
    constructor() {
        super();
        
        // Advanced features
        this.containers = [];
        this.activeTab = 'content';
        this.sortableEnabled = false;
        this.deviceModes = ['desktop', 'tablet', 'mobile'];
        this.currentBreakpoint = 'desktop';
        this.responsiveStyles = {};
        this.animations = [];
        this.globalColors = {};
        this.globalFonts = {};
        
        this.initAdvancedFeatures();
    }
    
    initAdvancedFeatures() {
        console.log('🚀 Initializing Advanced KingsBuilder Features...');
        
        // Initialize sortable elements
        this.initSortableElements();
        
        // Initialize responsive editing
        this.initResponsiveMode();
        
        // Initialize container system
        this.initContainerSystem();
        
        // Initialize advanced controls
        this.initAdvancedControls();
        
        // Initialize animation system
        this.initAnimationSystem();
        
        console.log('✅ Advanced Features Initialized!');
    }
    
    // Enhanced element creation with container support
    createElement(type, position = {}, parentContainer = null) {
        const elementId = `kb_element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const advancedElements = {
            container: {
                id: elementId,
                type: 'container',
                content: '',
                children: [],
                settings: {
                    content: {
                        flexDirection: 'column',
                        gap: '20px',
                        padding: '20px'
                    },
                    style: {
                        backgroundColor: '#ffffff',
                        borderRadius: '0px',
                        boxShadow: 'none',
                        border: 'none'
                    },
                    advanced: {
                        margin: '0px',
                        zIndex: 'auto',
                        cssId: '',
                        cssClasses: '',
                        customCSS: ''
                    }
                },
                position: position,
                responsive: {
                    desktop: {},
                    tablet: {},
                    mobile: {}
                },
                animations: {
                    entrance: null,
                    hover: null,
                    exit: null
                }
            },
            heading: {
                id: elementId,
                type: 'heading',
                content: 'Your Heading Here',
                settings: {
                    content: {
                        tag: 'h2',
                        size: 'default',
                        link: {
                            url: '',
                            target: '_self',
                            nofollow: false
                        }
                    },
                    style: {
                        typography: {
                            fontFamily: 'Default',
                            fontSize: '32px',
                            fontWeight: '700',
                            lineHeight: '1.2',
                            letterSpacing: '0px'
                        },
                        textColor: '#1a1a1a',
                        textShadow: 'none',
                        textStroke: 'none',
                        alignment: 'left'
                    },
                    advanced: {
                        margin: '0 0 16px 0',
                        padding: '0px',
                        zIndex: 'auto',
                        cssId: '',
                        cssClasses: '',
                        customCSS: ''
                    }
                },
                position: position,
                parentContainer: parentContainer,
                responsive: {
                    desktop: {},
                    tablet: {},
                    mobile: {}
                },
                animations: {
                    entrance: null,
                    hover: null,
                    exit: null
                }
            },
            text: {
                id: elementId,
                type: 'text',
                content: 'Your text content goes here. Click to edit and customize.',
                settings: {
                    content: {
                        htmlTag: 'p',
                        dropCap: false
                    },
                    style: {
                        typography: {
                            fontFamily: 'Default',
                            fontSize: '16px',
                            fontWeight: '400',
                            lineHeight: '1.6',
                            letterSpacing: '0px'
                        },
                        textColor: '#4a5568',
                        textShadow: 'none',
                        alignment: 'left',
                        columnCount: 1,
                        columnGap: '20px'
                    },
                    advanced: {
                        margin: '0 0 16px 0',
                        padding: '0px',
                        zIndex: 'auto',
                        cssId: '',
                        cssClasses: '',
                        customCSS: ''
                    }
                },
                position: position,
                parentContainer: parentContainer,
                responsive: {
                    desktop: {},
                    tablet: {},
                    mobile: {}
                },
                animations: {
                    entrance: null,
                    hover: null,
                    exit: null
                }
            },
            image: {
                id: elementId,
                type: 'image',
                content: 'https://via.placeholder.com/400x300/f0f0f0/666666?text=Your+Image',
                alt: 'Placeholder image',
                settings: {
                    content: {
                        imageSize: 'full',
                        imageResolution: 'auto',
                        link: {
                            url: '',
                            target: '_self',
                            nofollow: false
                        },
                        caption: ''
                    },
                    style: {
                        width: '100%',
                        maxWidth: '400px',
                        height: 'auto',
                        objectFit: 'cover',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: 'none',
                        opacity: 1,
                        filter: 'none',
                        hoverEffects: {
                            scale: 1,
                            rotate: 0,
                            opacity: 1,
                            filter: 'none'
                        }
                    },
                    advanced: {
                        margin: '0 0 16px 0',
                        padding: '0px',
                        zIndex: 'auto',
                        cssId: '',
                        cssClasses: '',
                        customCSS: ''
                    }
                },
                position: position,
                parentContainer: parentContainer,
                responsive: {
                    desktop: {},
                    tablet: {},
                    mobile: {}
                },
                animations: {
                    entrance: null,
                    hover: null,
                    exit: null
                }
            },
            button: {
                id: elementId,
                type: 'button',
                content: 'Click Me',
                settings: {
                    content: {
                        text: 'Click Me',
                        link: {
                            url: '#',
                            target: '_self',
                            nofollow: false
                        },
                        size: 'medium',
                        icon: {
                            name: '',
                            position: 'before',
                            spacing: '5px'
                        }
                    },
                    style: {
                        typography: {
                            fontFamily: 'Default',
                            fontSize: '16px',
                            fontWeight: '600',
                            letterSpacing: '0px'
                        },
                        normal: {
                            textColor: '#ffffff',
                            backgroundColor: '#000000',
                            borderColor: '#000000',
                            borderWidth: '1px',
                            borderStyle: 'solid',
                            borderRadius: '8px',
                            boxShadow: 'none'
                        },
                        hover: {
                            textColor: '#ffffff',
                            backgroundColor: '#333333',
                            borderColor: '#333333',
                            boxShadow: 'none',
                            transition: '0.3s'
                        },
                        padding: '12px 24px',
                        alignment: 'left'
                    },
                    advanced: {
                        margin: '0 0 16px 0',
                        padding: '0px',
                        zIndex: 'auto',
                        cssId: '',
                        cssClasses: '',
                        customCSS: ''
                    }
                },
                position: position,
                parentContainer: parentContainer,
                responsive: {
                    desktop: {},
                    tablet: {},
                    mobile: {}
                },
                animations: {
                    entrance: null,
                    hover: null,
                    exit: null
                }
            },
            spacer: {
                id: elementId,
                type: 'spacer',
                content: '',
                settings: {
                    content: {
                        height: '50px'
                    },
                    style: {
                        backgroundColor: 'transparent'
                    },
                    advanced: {
                        margin: '0px',
                        padding: '0px',
                        zIndex: 'auto',
                        cssId: '',
                        cssClasses: '',
                        customCSS: ''
                    }
                },
                position: position,
                parentContainer: parentContainer,
                responsive: {
                    desktop: {},
                    tablet: { height: '40px' },
                    mobile: { height: '30px' }
                },
                animations: {
                    entrance: null,
                    hover: null,
                    exit: null
                }
            },
            divider: {
                id: elementId,
                type: 'divider',
                content: '',
                settings: {
                    content: {
                        style: 'solid',
                        width: '100%',
                        alignment: 'center'
                    },
                    style: {
                        color: '#e5e7eb',
                        weight: '1px',
                        gap: '15px'
                    },
                    advanced: {
                        margin: '20px 0',
                        padding: '0px',
                        zIndex: 'auto',
                        cssId: '',
                        cssClasses: '',
                        customCSS: ''
                    }
                },
                position: position,
                parentContainer: parentContainer,
                responsive: {
                    desktop: {},
                    tablet: {},
                    mobile: {}
                },
                animations: {
                    entrance: null,
                    hover: null,
                    exit: null
                }
            }
        };
        
        return advancedElements[type] || super.createElement(type, position);
    }
    
    // Initialize sortable elements for drag & drop reordering
    initSortableElements() {
        console.log('🔄 Initializing sortable elements...');
        
        // Wait for the canvas to be ready
        const initSortable = () => {
            const canvas = document.querySelector('.canvas-frame');
            if (!canvas) {
                setTimeout(initSortable, 100);
                return;
            }
            
            // Check if Sortable library exists (we'll need to include it)
            if (typeof Sortable !== 'undefined') {
                this.sortable = Sortable.create(canvas, {
                    group: 'elements',
                    animation: 150,
                    ghostClass: 'kb-element-ghost',
                    chosenClass: 'kb-element-chosen',
                    dragClass: 'kb-element-drag',
                    onStart: (evt) => {
                        console.log('🎯 Started dragging element');
                        evt.item.classList.add('dragging');
                    },
                    onEnd: (evt) => {
                        console.log('🎯 Finished dragging element');
                        evt.item.classList.remove('dragging');
                        this.handleElementReorder(evt.oldIndex, evt.newIndex);
                    }
                });
                
                this.sortableEnabled = true;
                console.log('✅ Sortable elements initialized');
            } else {
                console.warn('⚠️ Sortable library not found, loading...');
                this.loadSortableLibrary();
            }
        };
        
        initSortable();
    }
    
    // Load SortableJS library
    loadSortableLibrary() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/sortablejs@1.15.0/Sortable.min.js';
        script.onload = () => {
            console.log('✅ SortableJS library loaded');
            this.initSortableElements();
        };
        document.head.appendChild(script);
    }
    
    // Handle element reordering
    handleElementReorder(oldIndex, newIndex) {
        if (oldIndex === newIndex) return;
        
        const element = this.elements[oldIndex];
        this.elements.splice(oldIndex, 1);
        this.elements.splice(newIndex, 0, element);
        
        // Update positions
        this.elements.forEach((el, index) => {
            el.position = index;
        });
        
        this.saveState();
        this.updateNavigator();
        
        console.log(`🔄 Element reordered from ${oldIndex} to ${newIndex}`);
    }
    
    // Initialize responsive editing mode
    initResponsiveMode() {
        console.log('📱 Initializing responsive mode...');
        
        // Enhanced device switcher with responsive previews
        const deviceButtons = document.querySelectorAll('.device-btn');
        deviceButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const device = e.target.getAttribute('data-device');
                this.switchResponsiveMode(device);
            });
        });
    }
    
    // Switch responsive editing mode
    switchResponsiveMode(device) {
        this.currentBreakpoint = device;
        
        // Update device buttons
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-device="${device}"]`).classList.add('active');
        
        // Update canvas size
        const canvas = document.getElementById('kingsbuilder-canvas');
        canvas.className = `kingsbuilder-canvas ${device}`;
        
        // Update responsive editing indicator
        this.updateResponsiveIndicator(device);
        
        // Refresh properties panel if element is selected
        if (this.selectedElement) {
            this.showAdvancedProperties(this.selectedElement);
        }
        
        console.log(`📱 Switched to ${device} editing mode`);
    }
    
    // Update responsive editing indicator
    updateResponsiveIndicator(device) {
        const indicator = document.querySelector('.responsive-indicator');
        if (indicator) {
            indicator.textContent = `Editing: ${device.charAt(0).toUpperCase() + device.slice(1)}`;
            indicator.className = `responsive-indicator ${device}`;
        }
    }
    
    // Initialize container system
    initContainerSystem() {
        console.log('📦 Initializing container system...');
        
        // Add container to available elements
        this.addContainerToElementsList();
        
        // Set up container drop zones
        this.setupContainerDropZones();
    }
    
    // Add container to elements list
    addContainerToElementsList() {
        const elementsContainer = document.querySelector('#basicElements .elements-grid');
        if (elementsContainer && !document.querySelector('[data-element="container"]')) {
            const containerElement = document.createElement('div');
            containerElement.className = 'element-item';
            containerElement.setAttribute('data-element', 'container');
            containerElement.draggable = true;
            containerElement.innerHTML = `
                <div class="element-icon">
                    <i class="fas fa-square"></i>
                </div>
                <div class="element-label">Container</div>
            `;
            
            // Insert at the beginning
            elementsContainer.insertBefore(containerElement, elementsContainer.firstChild);
        }
    }
    
    // Setup container drop zones
    setupContainerDropZones() {
        // This will be called whenever containers are rendered
        document.addEventListener('click', (e) => {
            if (e.target.closest('.kb-container')) {
                const container = e.target.closest('.kb-container');
                this.setupContainerDropZone(container);
            }
        });
    }
    
    // Setup individual container drop zone
    setupContainerDropZone(container) {
        if (container.hasAttribute('data-drop-zone-setup')) return;
        
        container.setAttribute('data-drop-zone-setup', 'true');
        
        container.addEventListener('dragover', (e) => {
            if (e.target === container || container.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
                container.classList.add('container-drop-active');
            }
        });
        
        container.addEventListener('dragleave', (e) => {
            if (!container.contains(e.relatedTarget)) {
                container.classList.remove('container-drop-active');
            }
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const elementType = e.dataTransfer.getData('text/plain');
            if (elementType && elementType !== 'container') {
                const containerId = container.getAttribute('data-element-id');
                this.addElementToContainer(elementType, containerId);
            }
            
            container.classList.remove('container-drop-active');
        });
    }
    
    // Add element to container
    addElementToContainer(elementType, containerId) {
        const containerElement = this.elements.find(el => el.id === containerId);
        if (!containerElement) return;
        
        const newElement = this.createElement(elementType, {}, containerId);
        if (newElement) {
            newElement.parentContainer = containerId;
            this.elements.push(newElement);
            
            // Add to container's children
            if (!containerElement.children) {
                containerElement.children = [];
            }
            containerElement.children.push(newElement.id);
            
            this.renderElement(newElement);
            this.saveState();
            
            console.log(`✅ Added ${elementType} to container ${containerId}`);
        }
    }
    
    // Initialize advanced controls
    initAdvancedControls() {
        console.log('🎛️ Initializing advanced controls...');
        
        // Color picker initialization
        this.initColorPickers();
        
        // Typography controls
        this.initTypographyControls();
        
        // Spacing controls
        this.initSpacingControls();
        
        // Animation controls
        this.initAnimationControls();
    }
    
    // Initialize color pickers
    initColorPickers() {
        // We'll enhance this when we create the advanced properties panel
        console.log('🎨 Color pickers ready');
    }
    
    // Initialize typography controls
    initTypographyControls() {
        // Enhanced typography system
        this.googleFonts = [
            'Open Sans', 'Roboto', 'Lato', 'Montserrat', 'Oswald', 
            'Source Sans Pro', 'Raleway', 'PT Sans', 'Ubuntu', 'Merriweather'
        ];
        console.log('📝 Typography controls ready');
    }
    
    // Initialize spacing controls
    initSpacingControls() {
        // Advanced spacing system with linked/unlinked values
        console.log('📏 Spacing controls ready');
    }
    
    // Initialize animation controls
    initAnimationControls() {
        this.animations = [
            'fadeIn', 'fadeInUp', 'fadeInDown', 'fadeInLeft', 'fadeInRight',
            'slideInUp', 'slideInDown', 'slideInLeft', 'slideInRight',
            'zoomIn', 'zoomInUp', 'zoomInDown', 'zoomInLeft', 'zoomInRight',
            'bounceIn', 'bounceInUp', 'bounceInDown', 'bounceInLeft', 'bounceInRight',
            'rotateIn', 'flipInX', 'flipInY'
        ];
        console.log('🎬 Animation system ready');
    }
    
    // Initialize animation system
    initAnimationSystem() {
        // Load Animate.css for animations
        if (!document.querySelector('link[href*="animate.css"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css';
            document.head.appendChild(link);
        }
    }
    
    // Enhanced element selection with advanced properties
    selectElement(element) {
        // Call parent method first
        super.selectElement(element);
        
        if (element && element.id && element.type) {
            // Show advanced properties instead of basic ones
            this.showAdvancedProperties(element);
        }
    }
    
    // Show advanced properties panel with tabs
    showAdvancedProperties(element) {
        // Switch to properties tab
        this.switchTab('properties');
        
        const propertiesContent = document.getElementById('propertiesContent');
        if (!propertiesContent) return;
        
        const advancedForm = this.createAdvancedPropertiesForm(element);
        propertiesContent.innerHTML = advancedForm;
        
        // Initialize advanced controls
        this.initAdvancedPropertyControls(element);
        
        console.log(`🎛️ Showing advanced properties for ${element.type}`);
    }
    
    // Create advanced properties form with tabs
    createAdvancedPropertiesForm(element) {
        if (!element || !element.type) {
            return '<div class="properties-error">Unable to load element properties</div>';
        }
        
        return `
            <div class="advanced-properties">
                <div class="properties-header">
                    <h3>Edit ${element.type.charAt(0).toUpperCase() + element.type.slice(1)}</h3>
                    <div class="responsive-indicator ${this.currentBreakpoint}">
                        Editing: ${this.currentBreakpoint.charAt(0).toUpperCase() + this.currentBreakpoint.slice(1)}
                    </div>
                </div>
                
                <div class="properties-tabs">
                    <button class="properties-tab active" data-tab="content">
                        <i class="fas fa-edit"></i> Content
                    </button>
                    <button class="properties-tab" data-tab="style">
                        <i class="fas fa-paint-brush"></i> Style
                    </button>
                    <button class="properties-tab" data-tab="advanced">
                        <i class="fas fa-cog"></i> Advanced
                    </button>
                </div>
                
                <div class="properties-content">
                    <div class="properties-tab-content active" data-tab-content="content">
                        ${this.createContentControls(element)}
                    </div>
                    <div class="properties-tab-content" data-tab-content="style">
                        ${this.createStyleControls(element)}
                    </div>
                    <div class="properties-tab-content" data-tab-content="advanced">
                        ${this.createAdvancedControls(element)}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Create content controls
    createContentControls(element) {
        const settings = element.settings?.content || {};
        
        switch (element.type) {
            case 'heading':
                return `
                    <div class="control-group">
                        <label>Title</label>
                        <textarea class="form-control" name="content" rows="2">${element.content}</textarea>
                    </div>
                    <div class="control-group">
                        <label>HTML Tag</label>
                        <select class="form-control" name="tag">
                            <option value="h1" ${settings.tag === 'h1' ? 'selected' : ''}>H1</option>
                            <option value="h2" ${settings.tag === 'h2' ? 'selected' : ''}>H2</option>
                            <option value="h3" ${settings.tag === 'h3' ? 'selected' : ''}>H3</option>
                            <option value="h4" ${settings.tag === 'h4' ? 'selected' : ''}>H4</option>
                            <option value="h5" ${settings.tag === 'h5' ? 'selected' : ''}>H5</option>
                            <option value="h6" ${settings.tag === 'h6' ? 'selected' : ''}>H6</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Size</label>
                        <select class="form-control" name="size">
                            <option value="small">Small</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                            <option value="xl">Extra Large</option>
                            <option value="xxl">XXL</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Link</label>
                        <input type="url" class="form-control" name="link_url" placeholder="https://" value="${settings.link?.url || ''}">
                        <div class="link-options">
                            <label class="checkbox">
                                <input type="checkbox" name="link_target" ${settings.link?.target === '_blank' ? 'checked' : ''}>
                                Open in new window
                            </label>
                            <label class="checkbox">
                                <input type="checkbox" name="link_nofollow" ${settings.link?.nofollow ? 'checked' : ''}>
                                Add nofollow
                            </label>
                        </div>
                    </div>
                `;
                
            case 'text':
                return `
                    <div class="control-group">
                        <label>Text Content</label>
                        <div class="rich-text-editor">
                            <div class="editor-toolbar">
                                <button type="button" class="editor-btn" data-command="bold"><i class="fas fa-bold"></i></button>
                                <button type="button" class="editor-btn" data-command="italic"><i class="fas fa-italic"></i></button>
                                <button type="button" class="editor-btn" data-command="underline"><i class="fas fa-underline"></i></button>
                                <button type="button" class="editor-btn" data-command="createLink"><i class="fas fa-link"></i></button>
                            </div>
                            <div class="editor-content" contenteditable="true" name="content">${element.content}</div>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>HTML Tag</label>
                        <select class="form-control" name="htmlTag">
                            <option value="p" ${settings.htmlTag === 'p' ? 'selected' : ''}>Paragraph</option>
                            <option value="div" ${settings.htmlTag === 'div' ? 'selected' : ''}>Div</option>
                            <option value="span" ${settings.htmlTag === 'span' ? 'selected' : ''}>Span</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label class="checkbox">
                            <input type="checkbox" name="dropCap" ${settings.dropCap ? 'checked' : ''}>
                            Drop Cap
                        </label>
                    </div>
                `;
                
            case 'image':
                return `
                    <div class="control-group">
                        <label>Image</label>
                        <div class="image-upload">
                            <img src="${element.content}" alt="${element.alt}" class="preview-image">
                            <div class="upload-buttons">
                                <button type="button" class="btn btn-primary" onclick="kingsBuilder.openImagePicker('${element.id}')">
                                    Choose Image
                                </button>
                                <button type="button" class="btn upload-shopify-image">
                                    Upload to Shopify
                                </button>
                            </div>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>Alt Text</label>
                        <input type="text" class="form-control" name="alt" value="${element.alt || ''}" placeholder="Describe the image">
                    </div>
                    <div class="control-group">
                        <label>Image Size</label>
                        <select class="form-control" name="imageSize">
                            <option value="thumbnail">Thumbnail</option>
                            <option value="medium">Medium</option>
                            <option value="large">Large</option>
                            <option value="full" selected>Full Size</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Link</label>
                        <input type="url" class="form-control" name="link_url" placeholder="https://" value="${settings.content?.link?.url || ''}">
                    </div>
                    <div class="control-group">
                        <label>Caption</label>
                        <input type="text" class="form-control" name="caption" value="${settings.content?.caption || ''}" placeholder="Image caption">
                    </div>
                `;
                
            case 'button':
                return `
                    <div class="control-group">
                        <label>Text</label>
                        <input type="text" class="form-control" name="content" value="${element.content}">
                    </div>
                    <div class="control-group">
                        <label>Link</label>
                        <input type="url" class="form-control" name="link_url" placeholder="https://" value="${settings.content?.link?.url || ''}">
                        <div class="link-options">
                            <label class="checkbox">
                                <input type="checkbox" name="link_target" ${settings.content?.link?.target === '_blank' ? 'checked' : ''}>
                                Open in new window
                            </label>
                            <label class="checkbox">
                                <input type="checkbox" name="link_nofollow" ${settings.content?.link?.nofollow ? 'checked' : ''}>
                                Add nofollow
                            </label>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>Size</label>
                        <select class="form-control" name="size">
                            <option value="xs">Extra Small</option>
                            <option value="sm">Small</option>
                            <option value="md" ${settings.content?.size === 'medium' ? 'selected' : ''}>Medium</option>
                            <option value="lg">Large</option>
                            <option value="xl">Extra Large</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Icon</label>
                        <div class="icon-selector">
                            <input type="text" class="form-control" name="icon" value="${settings.content?.icon?.name || ''}" placeholder="fa-icon-name">
                            <select class="form-control" name="icon_position">
                                <option value="before" ${settings.content?.icon?.position === 'before' ? 'selected' : ''}>Before Text</option>
                                <option value="after" ${settings.content?.icon?.position === 'after' ? 'selected' : ''}>After Text</option>
                            </select>
                        </div>
                    </div>
                `;
                
            case 'container':
                return `
                    <div class="control-group">
                        <label>Content Width</label>
                        <select class="form-control" name="contentWidth">
                            <option value="boxed">Boxed</option>
                            <option value="full">Full Width</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Flex Direction</label>
                        <div class="button-group">
                            <button type="button" class="btn ${settings.flexDirection === 'row' ? 'active' : ''}" data-value="row">
                                <i class="fas fa-arrows-alt-h"></i> Row
                            </button>
                            <button type="button" class="btn ${settings.flexDirection === 'column' ? 'active' : ''}" data-value="column">
                                <i class="fas fa-arrows-alt-v"></i> Column
                            </button>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>Gap Between Items</label>
                        <div class="slider-control">
                            <input type="range" name="gap" min="0" max="100" value="${parseInt(settings.gap) || 20}" class="slider">
                            <span class="slider-value">${parseInt(settings.gap) || 20}px</span>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>Minimum Height</label>
                        <div class="input-with-unit">
                            <input type="number" class="form-control" name="minHeight" value="200">
                            <select name="minHeightUnit">
                                <option value="px">px</option>
                                <option value="vh">vh</option>
                                <option value="rem">rem</option>
                            </select>
                        </div>
                    </div>
                `;
                
            case 'spacer':
                return `
                    <div class="control-group">
                        <label>Height</label>
                        <div class="responsive-control">
                            <div class="device-tabs">
                                <button class="device-tab active" data-device="desktop"><i class="fas fa-desktop"></i></button>
                                <button class="device-tab" data-device="tablet"><i class="fas fa-tablet-alt"></i></button>
                                <button class="device-tab" data-device="mobile"><i class="fas fa-mobile-alt"></i></button>
                            </div>
                            <div class="slider-control">
                                <input type="range" name="height" min="10" max="200" value="${parseInt(settings.content?.height) || 50}" class="slider">
                                <span class="slider-value">${parseInt(settings.content?.height) || 50}px</span>
                            </div>
                        </div>
                    </div>
                `;
                
            case 'divider':
                return `
                    <div class="control-group">
                        <label>Style</label>
                        <select class="form-control" name="style">
                            <option value="solid" ${settings.content?.style === 'solid' ? 'selected' : ''}>Solid</option>
                            <option value="dashed" ${settings.content?.style === 'dashed' ? 'selected' : ''}>Dashed</option>
                            <option value="dotted" ${settings.content?.style === 'dotted' ? 'selected' : ''}>Dotted</option>
                            <option value="double" ${settings.content?.style === 'double' ? 'selected' : ''}>Double</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Width</label>
                        <div class="input-with-unit">
                            <input type="number" class="form-control" name="width" value="${parseInt(settings.content?.width) || 100}">
                            <select name="widthUnit">
                                <option value="%" selected>%</option>
                                <option value="px">px</option>
                            </select>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>Alignment</label>
                        <div class="button-group">
                            <button type="button" class="btn ${settings.content?.alignment === 'left' ? 'active' : ''}" data-value="left">
                                <i class="fas fa-align-left"></i>
                            </button>
                            <button type="button" class="btn ${settings.content?.alignment === 'center' ? 'active' : ''}" data-value="center">
                                <i class="fas fa-align-center"></i>
                            </button>
                            <button type="button" class="btn ${settings.content?.alignment === 'right' ? 'active' : ''}" data-value="right">
                                <i class="fas fa-align-right"></i>
                            </button>
                        </div>
                    </div>
                `;
                
            default:
                return '<div class="control-group"><p>Content controls for this element type are not yet implemented.</p></div>';
        }
    }
    
    // Create style controls 
    createStyleControls(element) {
        const settings = element.settings?.style || {};
        
        return `
            <div class="style-controls">
                ${this.createTypographyControls(element)}
                ${this.createColorControls(element)}
                ${this.createBackgroundControls(element)}
                ${this.createBorderControls(element)}
                ${this.createSpacingControls(element)}
                ${this.createShadowControls(element)}
                ${this.createTransformControls(element)}
            </div>
        `;
    }
    
    // Create typography controls
    createTypographyControls(element) {
        if (!['heading', 'text', 'button'].includes(element.type)) return '';
        
        const typography = element.settings?.style?.typography || {};
        
        return `
            <div class="control-section">
                <h4 class="section-title">
                    <i class="fas fa-font"></i> Typography
                    <button class="section-toggle" data-target="typography-controls">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </h4>
                <div class="section-content" id="typography-controls">
                    <div class="control-group">
                        <label>Font Family</label>
                        <select class="form-control" name="fontFamily">
                            <option value="Default">Default</option>
                            <option value="Arial" ${typography.fontFamily === 'Arial' ? 'selected' : ''}>Arial</option>
                            <option value="Helvetica" ${typography.fontFamily === 'Helvetica' ? 'selected' : ''}>Helvetica</option>
                            <option value="Georgia" ${typography.fontFamily === 'Georgia' ? 'selected' : ''}>Georgia</option>
                            <option value="'Times New Roman'" ${typography.fontFamily === "'Times New Roman'" ? 'selected' : ''}>Times New Roman</option>
                            <optgroup label="Google Fonts">
                                ${this.googleFonts.map(font => 
                                    `<option value="'${font}'" ${typography.fontFamily === `'${font}'` ? 'selected' : ''}>${font}</option>`
                                ).join('')}
                            </optgroup>
                        </select>
                    </div>
                    <div class="control-row">
                        <div class="control-group">
                            <label>Size</label>
                            <div class="input-with-unit">
                                <input type="number" class="form-control" name="fontSize" value="${parseInt(typography.fontSize) || 16}">
                                <select name="fontSizeUnit">
                                    <option value="px">px</option>
                                    <option value="em">em</option>
                                    <option value="rem">rem</option>
                                    <option value="%">%</option>
                                </select>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Weight</label>
                            <select class="form-control" name="fontWeight">
                                <option value="100">100 - Thin</option>
                                <option value="200">200 - Extra Light</option>
                                <option value="300">300 - Light</option>
                                <option value="400" ${typography.fontWeight === '400' ? 'selected' : ''}>400 - Normal</option>
                                <option value="500">500 - Medium</option>
                                <option value="600">600 - Semi Bold</option>
                                <option value="700" ${typography.fontWeight === '700' ? 'selected' : ''}>700 - Bold</option>
                                <option value="800">800 - Extra Bold</option>
                                <option value="900">900 - Black</option>
                            </select>
                        </div>
                    </div>
                    <div class="control-row">
                        <div class="control-group">
                            <label>Line Height</label>
                            <div class="input-with-unit">
                                <input type="number" class="form-control" name="lineHeight" value="${parseFloat(typography.lineHeight) || 1.4}" step="0.1">
                                <select name="lineHeightUnit">
                                    <option value="">Default</option>
                                    <option value="px">px</option>
                                    <option value="em">em</option>
                                </select>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Letter Spacing</label>
                            <div class="input-with-unit">
                                <input type="number" class="form-control" name="letterSpacing" value="${parseInt(typography.letterSpacing) || 0}" step="0.1">
                                <select name="letterSpacingUnit">
                                    <option value="px">px</option>
                                    <option value="em">em</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    <div class="control-group">
                        <label>Transform</label>
                        <select class="form-control" name="textTransform">
                            <option value="none">None</option>
                            <option value="uppercase">UPPERCASE</option>
                            <option value="lowercase">lowercase</option>
                            <option value="capitalize">Capitalize</option>
                        </select>
                    </div>
                    <div class="control-group">
                        <label>Decoration</label>
                        <div class="button-group">
                            <button type="button" class="btn" data-style="textDecoration" data-value="none">
                                <i class="fas fa-ban"></i>
                            </button>
                            <button type="button" class="btn" data-style="textDecoration" data-value="underline">
                                <i class="fas fa-underline"></i>
                            </button>
                            <button type="button" class="btn" data-style="textDecoration" data-value="line-through">
                                <i class="fas fa-strikethrough"></i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Create color controls
    createColorControls(element) {
        const settings = element.settings?.style || {};
        
        return `
            <div class="control-section">
                <h4 class="section-title">
                    <i class="fas fa-palette"></i> Colors
                    <button class="section-toggle" data-target="color-controls">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </h4>
                <div class="section-content" id="color-controls">
                    ${element.type !== 'spacer' && element.type !== 'divider' ? `
                        <div class="control-group">
                            <label>Text Color</label>
                            <div class="color-picker-wrapper">
                                <input type="color" class="color-picker" name="textColor" value="${settings.textColor || '#000000'}">
                                <input type="text" class="color-input" name="textColorHex" value="${settings.textColor || '#000000'}">
                                <button class="color-clear" type="button">Clear</button>
                            </div>
                        </div>
                    ` : ''}
                    <div class="control-group">
                        <label>Background Color</label>
                        <div class="color-picker-wrapper">
                            <input type="color" class="color-picker" name="backgroundColor" value="${settings.backgroundColor || '#ffffff'}">
                            <input type="text" class="color-input" name="backgroundColorHex" value="${settings.backgroundColor || '#ffffff'}">
                            <button class="color-clear" type="button">Clear</button>
                        </div>
                    </div>
                    ${element.type === 'button' ? `
                        <div class="control-group">
                            <label>Hover Background</label>
                            <div class="color-picker-wrapper">
                                <input type="color" class="color-picker" name="hoverBackgroundColor" value="${settings.hover?.backgroundColor || '#333333'}">
                                <input type="text" class="color-input" name="hoverBackgroundColorHex" value="${settings.hover?.backgroundColor || '#333333'}">
                                <button class="color-clear" type="button">Clear</button>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Hover Text Color</label>
                            <div class="color-picker-wrapper">
                                <input type="color" class="color-picker" name="hoverTextColor" value="${settings.hover?.textColor || '#ffffff'}">
                                <input type="text" class="color-input" name="hoverTextColorHex" value="${settings.hover?.textColor || '#ffffff'}">
                                <button class="color-clear" type="button">Clear</button>
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;
    }
    
    // Create background controls
    createBackgroundControls(element) {
        const settings = element.settings?.style || {};
        
        return `
            <div class="control-section">
                <h4 class="section-title">
                    <i class="fas fa-fill-drip"></i> Background
                    <button class="section-toggle" data-target="background-controls">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </h4>
                <div class="section-content" id="background-controls">
                    <div class="control-group">
                        <label>Background Type</label>
                        <div class="button-group">
                            <button type="button" class="btn active" data-bg-type="classic">Classic</button>
                            <button type="button" class="btn" data-bg-type="gradient">Gradient</button>
                            <button type="button" class="btn" data-bg-type="image">Image</button>
                        </div>
                    </div>
                    <div class="bg-classic-controls">
                        <div class="control-group">
                            <label>Color</label>
                            <div class="color-picker-wrapper">
                                <input type="color" class="color-picker" name="bgColor" value="${settings.backgroundColor || '#ffffff'}">
                                <input type="text" class="color-input" name="bgColorHex" value="${settings.backgroundColor || '#ffffff'}">
                                <button class="color-clear" type="button">Clear</button>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gradient-controls" style="display: none;">
                        <div class="control-group">
                            <label>Gradient Type</label>
                            <select class="form-control" name="gradientType">
                                <option value="linear">Linear</option>
                                <option value="radial">Radial</option>
                            </select>
                        </div>
                        <div class="control-group">
                            <label>Start Color</label>
                            <div class="color-picker-wrapper">
                                <input type="color" class="color-picker" name="gradientStart" value="#ffffff">
                                <input type="text" class="color-input" name="gradientStartHex" value="#ffffff">
                            </div>
                        </div>
                        <div class="control-group">
                            <label>End Color</label>
                            <div class="color-picker-wrapper">
                                <input type="color" class="color-picker" name="gradientEnd" value="#000000">
                                <input type="text" class="color-input" name="gradientEndHex" value="#000000">
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Angle</label>
                            <div class="slider-control">
                                <input type="range" name="gradientAngle" min="0" max="360" value="45" class="slider">
                                <span class="slider-value">45°</span>
                            </div>
                        </div>
                    </div>
                    <div class="bg-image-controls" style="display: none;">
                        <div class="control-group">
                            <label>Background Image</label>
                            <div class="image-upload">
                                <div class="upload-area">
                                    <i class="fas fa-cloud-upload-alt"></i>
                                    <p>Click to upload or enter URL</p>
                                </div>
                                <input type="url" class="form-control" name="bgImageUrl" placeholder="Image URL">
                            </div>
                        </div>
                        <div class="control-row">
                            <div class="control-group">
                                <label>Position</label>
                                <select class="form-control" name="bgPosition">
                                    <option value="center center">Center Center</option>
                                    <option value="top left">Top Left</option>
                                    <option value="top center">Top Center</option>
                                    <option value="top right">Top Right</option>
                                    <option value="center left">Center Left</option>
                                    <option value="center right">Center Right</option>
                                    <option value="bottom left">Bottom Left</option>
                                    <option value="bottom center">Bottom Center</option>
                                    <option value="bottom right">Bottom Right</option>
                                </select>
                            </div>
                            <div class="control-group">
                                <label>Repeat</label>
                                <select class="form-control" name="bgRepeat">
                                    <option value="no-repeat">No Repeat</option>
                                    <option value="repeat">Repeat</option>
                                    <option value="repeat-x">Repeat X</option>
                                    <option value="repeat-y">Repeat Y</option>
                                </select>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Size</label>
                            <select class="form-control" name="bgSize">
                                <option value="auto">Auto</option>
                                <option value="cover">Cover</option>
                                <option value="contain">Contain</option>
                                <option value="100% 100%">Stretch</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Create border controls
    createBorderControls(element) {
        const settings = element.settings?.style || {};
        
        return `
            <div class="control-section">
                <h4 class="section-title">
                    <i class="fas fa-border-style"></i> Border
                    <button class="section-toggle" data-target="border-controls">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </h4>
                <div class="section-content" id="border-controls">
                    <div class="control-group">
                        <label>Border Type</label>
                        <select class="form-control" name="borderStyle">
                            <option value="none">None</option>
                            <option value="solid">Solid</option>
                            <option value="dashed">Dashed</option>
                            <option value="dotted">Dotted</option>
                            <option value="double">Double</option>
                        </select>
                    </div>
                    <div class="border-controls-group">
                        <div class="control-group">
                            <label>Width</label>
                            <div class="linked-control">
                                <button class="link-toggle" data-linked="true">
                                    <i class="fas fa-link"></i>
                                </button>
                                <div class="linked-inputs">
                                    <input type="number" name="borderTopWidth" value="1" min="0" placeholder="Top">
                                    <input type="number" name="borderRightWidth" value="1" min="0" placeholder="Right">
                                    <input type="number" name="borderBottomWidth" value="1" min="0" placeholder="Bottom">
                                    <input type="number" name="borderLeftWidth" value="1" min="0" placeholder="Left">
                                </div>
                                <span class="unit">px</span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Color</label>
                            <div class="color-picker-wrapper">
                                <input type="color" class="color-picker" name="borderColor" value="#e5e7eb">
                                <input type="text" class="color-input" name="borderColorHex" value="#e5e7eb">
                                <button class="color-clear" type="button">Clear</button>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Radius</label>
                            <div class="linked-control">
                                <button class="link-toggle" data-linked="true">
                                    <i class="fas fa-link"></i>
                                </button>
                                <div class="linked-inputs">
                                    <input type="number" name="borderTopLeftRadius" value="0" min="0" placeholder="TL">
                                    <input type="number" name="borderTopRightRadius" value="0" min="0" placeholder="TR">
                                    <input type="number" name="borderBottomRightRadius" value="0" min="0" placeholder="BR">
                                    <input type="number" name="borderBottomLeftRadius" value="0" min="0" placeholder="BL">
                                </div>
                                <span class="unit">px</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Create spacing controls
    createSpacingControls(element) {
        const settings = element.settings?.advanced || {};
        
        return `
            <div class="control-section">
                <h4 class="section-title">
                    <i class="fas fa-expand-arrows-alt"></i> Spacing
                    <button class="section-toggle" data-target="spacing-controls">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </h4>
                <div class="section-content" id="spacing-controls">
                    <div class="spacing-visual">
                        <div class="spacing-diagram">
                            <div class="margin-area">
                                <span class="label">Margin</span>
                                <input type="number" class="spacing-input margin-top" name="marginTop" value="0" placeholder="0">
                                <input type="number" class="spacing-input margin-right" name="marginRight" value="0" placeholder="0">
                                <input type="number" class="spacing-input margin-bottom" name="marginBottom" value="0" placeholder="0">
                                <input type="number" class="spacing-input margin-left" name="marginLeft" value="0" placeholder="0">
                                <div class="padding-area">
                                    <span class="label">Padding</span>
                                    <input type="number" class="spacing-input padding-top" name="paddingTop" value="0" placeholder="0">
                                    <input type="number" class="spacing-input padding-right" name="paddingRight" value="0" placeholder="0">
                                    <input type="number" class="spacing-input padding-bottom" name="paddingBottom" value="0" placeholder="0">
                                    <input type="number" class="spacing-input padding-left" name="paddingLeft" value="0" placeholder="0">
                                    <div class="content-area">Content</div>
                                </div>
                            </div>
                        </div>
                        <div class="spacing-controls">
                            <div class="control-group">
                                <label>Margin</label>
                                <div class="linked-control">
                                    <button class="link-toggle" data-linked="true">
                                        <i class="fas fa-link"></i>
                                    </button>
                                    <div class="unit-selector">
                                        <select name="marginUnit">
                                            <option value="px">px</option>
                                            <option value="em">em</option>
                                            <option value="rem">rem</option>
                                            <option value="%">%</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="control-group">
                                <label>Padding</label>
                                <div class="linked-control">
                                    <button class="link-toggle" data-linked="true">
                                        <i class="fas fa-link"></i>
                                    </button>
                                    <div class="unit-selector">
                                        <select name="paddingUnit">
                                            <option value="px">px</option>
                                            <option value="em">em</option>
                                            <option value="rem">rem</option>
                                            <option value="%">%</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Create shadow controls
    createShadowControls(element) {
        return `
            <div class="control-section">
                <h4 class="section-title">
                    <i class="fas fa-square"></i> Shadow
                    <button class="section-toggle" data-target="shadow-controls">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </h4>
                <div class="section-content" id="shadow-controls">
                    <div class="control-group">
                        <label>Box Shadow</label>
                        <div class="shadow-preset">
                            <button type="button" class="btn shadow-preset-btn" data-shadow="none">None</button>
                            <button type="button" class="btn shadow-preset-btn" data-shadow="small">Small</button>
                            <button type="button" class="btn shadow-preset-btn" data-shadow="medium">Medium</button>
                            <button type="button" class="btn shadow-preset-btn" data-shadow="large">Large</button>
                        </div>
                    </div>
                    <div class="shadow-custom">
                        <div class="control-row">
                            <div class="control-group">
                                <label>Horizontal</label>
                                <input type="range" name="shadowX" min="-50" max="50" value="0" class="slider">
                                <span class="slider-value">0px</span>
                            </div>
                            <div class="control-group">
                                <label>Vertical</label>
                                <input type="range" name="shadowY" min="-50" max="50" value="0" class="slider">
                                <span class="slider-value">0px</span>
                            </div>
                        </div>
                        <div class="control-row">
                            <div class="control-group">
                                <label>Blur</label>
                                <input type="range" name="shadowBlur" min="0" max="100" value="0" class="slider">
                                <span class="slider-value">0px</span>
                            </div>
                            <div class="control-group">
                                <label>Spread</label>
                                <input type="range" name="shadowSpread" min="-50" max="50" value="0" class="slider">
                                <span class="slider-value">0px</span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Color</label>
                            <div class="color-picker-wrapper">
                                <input type="color" class="color-picker" name="shadowColor" value="#000000">
                                <input type="text" class="color-input" name="shadowColorHex" value="#000000">
                                <div class="opacity-control">
                                    <label>Opacity</label>
                                    <input type="range" name="shadowOpacity" min="0" max="1" step="0.01" value="0.1" class="slider">
                                    <span class="slider-value">10%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Create transform controls
    createTransformControls(element) {
        return `
            <div class="control-section">
                <h4 class="section-title">
                    <i class="fas fa-sync-alt"></i> Transform
                    <button class="section-toggle" data-target="transform-controls">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </h4>
                <div class="section-content" id="transform-controls">
                    <div class="control-row">
                        <div class="control-group">
                            <label>Rotate</label>
                            <div class="slider-control">
                                <input type="range" name="rotate" min="-180" max="180" value="0" class="slider">
                                <span class="slider-value">0°</span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Scale</label>
                            <div class="slider-control">
                                <input type="range" name="scale" min="0.1" max="3" step="0.1" value="1" class="slider">
                                <span class="slider-value">1</span>
                            </div>
                        </div>
                    </div>
                    <div class="control-row">
                        <div class="control-group">
                            <label>Skew X</label>
                            <div class="slider-control">
                                <input type="range" name="skewX" min="-45" max="45" value="0" class="slider">
                                <span class="slider-value">0°</span>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Skew Y</label>
                            <div class="slider-control">
                                <input type="range" name="skewY" min="-45" max="45" value="0" class="slider">
                                <span class="slider-value">0°</span>
                            </div>
                        </div>
                    </div>
                    <div class="control-row">
                        <div class="control-group">
                            <label>Translate X</label>
                            <div class="input-with-unit">
                                <input type="number" class="form-control" name="translateX" value="0">
                                <select name="translateXUnit">
                                    <option value="px">px</option>
                                    <option value="%">%</option>
                                    <option value="em">em</option>
                                </select>
                            </div>
                        </div>
                        <div class="control-group">
                            <label>Translate Y</label>
                            <div class="input-with-unit">
                                <input type="number" class="form-control" name="translateY" value="0">
                                <select name="translateYUnit">
                                    <option value="px">px</option>
                                    <option value="%">%</option>
                                    <option value="em">em</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Create advanced controls
    createAdvancedControls(element) {
        const settings = element.settings?.advanced || {};
        
        return `
            <div class="advanced-controls">
                <div class="control-section">
                    <h4 class="section-title">
                        <i class="fas fa-layer-group"></i> Layout
                        <button class="section-toggle" data-target="layout-controls">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </h4>
                    <div class="section-content" id="layout-controls">
                        <div class="control-group">
                            <label>Z-Index</label>
                            <input type="number" class="form-control" name="zIndex" value="${settings.zIndex || 'auto'}" placeholder="auto">
                        </div>
                        <div class="control-group">
                            <label>CSS ID</label>
                            <input type="text" class="form-control" name="cssId" value="${settings.cssId || ''}" placeholder="unique-id">
                        </div>
                        <div class="control-group">
                            <label>CSS Classes</label>
                            <input type="text" class="form-control" name="cssClasses" value="${settings.cssClasses || ''}" placeholder="class1 class2">
                        </div>
                    </div>
                </div>
                
                <div class="control-section">
                    <h4 class="section-title">
                        <i class="fas fa-eye"></i> Visibility
                        <button class="section-toggle" data-target="visibility-controls">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </h4>
                    <div class="section-content" id="visibility-controls">
                        <div class="control-group">
                            <label>Hide On</label>
                            <div class="visibility-options">
                                <label class="checkbox">
                                    <input type="checkbox" name="hideOnDesktop">
                                    <i class="fas fa-desktop"></i> Desktop
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="hideOnTablet">
                                    <i class="fas fa-tablet-alt"></i> Tablet
                                </label>
                                <label class="checkbox">
                                    <input type="checkbox" name="hideOnMobile">
                                    <i class="fas fa-mobile-alt"></i> Mobile
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="control-section">
                    <h4 class="section-title">
                        <i class="fas fa-magic"></i> Entrance Animation
                        <button class="section-toggle" data-target="animation-controls">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </h4>
                    <div class="section-content" id="animation-controls">
                        <div class="control-group">
                            <label>Animation</label>
                            <select class="form-control" name="entranceAnimation">
                                <option value="">None</option>
                                <optgroup label="Fade">
                                    ${this.animations.filter(anim => anim.includes('fade')).map(anim => 
                                        `<option value="${anim}">${anim.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</option>`
                                    ).join('')}
                                </optgroup>
                                <optgroup label="Slide">
                                    ${this.animations.filter(anim => anim.includes('slide')).map(anim => 
                                        `<option value="${anim}">${anim.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</option>`
                                    ).join('')}
                                </optgroup>
                                <optgroup label="Zoom">
                                    ${this.animations.filter(anim => anim.includes('zoom')).map(anim => 
                                        `<option value="${anim}">${anim.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</option>`
                                    ).join('')}
                                </optgroup>
                                <optgroup label="Bounce">
                                    ${this.animations.filter(anim => anim.includes('bounce')).map(anim => 
                                        `<option value="${anim}">${anim.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</option>`
                                    ).join('')}
                                </optgroup>
                                <optgroup label="Special">
                                    ${this.animations.filter(anim => !anim.includes('fade') && !anim.includes('slide') && !anim.includes('zoom') && !anim.includes('bounce')).map(anim => 
                                        `<option value="${anim}">${anim.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</option>`
                                    ).join('')}
                                </optgroup>
                            </select>
                        </div>
                        <div class="animation-settings">
                            <div class="control-row">
                                <div class="control-group">
                                    <label>Duration</label>
                                    <div class="input-with-unit">
                                        <input type="number" class="form-control" name="animationDuration" value="1" step="0.1" min="0.1">
                                        <span class="unit">s</span>
                                    </div>
                                </div>
                                <div class="control-group">
                                    <label>Delay</label>
                                    <div class="input-with-unit">
                                        <input type="number" class="form-control" name="animationDelay" value="0" step="0.1" min="0">
                                        <span class="unit">s</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="control-section">
                    <h4 class="section-title">
                        <i class="fas fa-code"></i> Custom CSS
                        <button class="section-toggle" data-target="css-controls">
                            <i class="fas fa-chevron-down"></i>
                        </button>
                    </h4>
                    <div class="section-content" id="css-controls">
                        <div class="control-group">
                            <label>Custom CSS</label>
                            <textarea class="form-control code-editor" name="customCSS" rows="8" placeholder="selector {
    property: value;
}">${settings.customCSS || ''}</textarea>
                            <small class="help-text">Use "selector" to target this element</small>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Initialize advanced property controls
    initAdvancedPropertyControls(element) {
        const propertiesContent = document.getElementById('propertiesContent');
        if (!propertiesContent) return;
        
        // Initialize property tabs
        this.initPropertyTabs();
        
        // Initialize color pickers
        this.initAdvancedColorPickers();
        
        // Initialize sliders
        this.initAdvancedSliders();
        
        // Initialize linked controls
        this.initLinkedControls();
        
        // Initialize section toggles
        this.initSectionToggles();
        
        // Initialize input change handlers
        this.initAdvancedInputHandlers(element);
    }
    
    // Initialize property tabs
    initPropertyTabs() {
        const tabs = document.querySelectorAll('.properties-tab');
        const contents = document.querySelectorAll('.properties-tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.getAttribute('data-tab');
                
                // Update active tab
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                // Update active content
                contents.forEach(content => {
                    content.classList.remove('active');
                    if (content.getAttribute('data-tab-content') === tabName) {
                        content.classList.add('active');
                    }
                });
                
                this.activeTab = tabName;
            });
        });
    }
    
    // Initialize advanced color pickers
    initAdvancedColorPickers() {
        const colorPickers = document.querySelectorAll('.color-picker');
        colorPickers.forEach(picker => {
            const wrapper = picker.closest('.color-picker-wrapper');
            const textInput = wrapper.querySelector('.color-input');
            const clearBtn = wrapper.querySelector('.color-clear');
            
            // Sync color picker with text input
            picker.addEventListener('change', () => {
                textInput.value = picker.value;
                this.updateElementStyle(picker.name, picker.value);
            });
            
            textInput.addEventListener('input', () => {
                if (this.isValidColor(textInput.value)) {
                    picker.value = textInput.value;
                    this.updateElementStyle(picker.name, textInput.value);
                }
            });
            
            // Clear color
            if (clearBtn) {
                clearBtn.addEventListener('click', () => {
                    picker.value = '#ffffff';
                    textInput.value = '';
                    this.updateElementStyle(picker.name, '');
                });
            }
        });
    }
    
    // Check if color value is valid
    isValidColor(color) {
        const s = new Option().style;
        s.color = color;
        return s.color !== '';
    }
    
    // Initialize advanced sliders
    initAdvancedSliders() {
        const sliders = document.querySelectorAll('.slider');
        sliders.forEach(slider => {
            const valueDisplay = slider.nextElementSibling;
            
            slider.addEventListener('input', () => {
                let value = slider.value;
                let unit = '';
                
                // Determine unit based on slider name
                if (slider.name.includes('opacity')) {
                    value = Math.round(value * 100);
                    unit = '%';
                } else if (slider.name.includes('angle') || slider.name.includes('rotate') || slider.name.includes('skew')) {
                    unit = '°';
                } else if (!slider.name.includes('scale')) {
                    unit = 'px';
                }
                
                if (valueDisplay) {
                    valueDisplay.textContent = value + unit;
                }
                
                this.updateElementStyle(slider.name, slider.value);
            });
        });
    }
    
    // Initialize linked controls
    initLinkedControls() {
        const linkToggles = document.querySelectorAll('.link-toggle');
        linkToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const isLinked = toggle.getAttribute('data-linked') === 'true';
                const newState = !isLinked;
                
                toggle.setAttribute('data-linked', newState);
                toggle.innerHTML = newState ? '<i class="fas fa-link"></i>' : '<i class="fas fa-unlink"></i>';
                
                const inputs = toggle.nextElementSibling.querySelectorAll('input');
                if (newState) {
                    // Link inputs - sync values
                    const firstValue = inputs[0].value;
                    inputs.forEach(input => {
                        input.value = firstValue;
                        input.addEventListener('input', this.syncLinkedInputs.bind(this));
                    });
                } else {
                    // Unlink inputs
                    inputs.forEach(input => {
                        input.removeEventListener('input', this.syncLinkedInputs.bind(this));
                    });
                }
            });
        });
    }
    
    // Sync linked inputs
    syncLinkedInputs(event) {
        const input = event.target;
        const linkedInputs = input.closest('.linked-inputs');
        if (linkedInputs) {
            const allInputs = linkedInputs.querySelectorAll('input');
            allInputs.forEach(inp => {
                if (inp !== input) {
                    inp.value = input.value;
                }
            });
        }
    }
    
    // Initialize section toggles
    initSectionToggles() {
        const toggles = document.querySelectorAll('.section-toggle');
        toggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                const targetId = toggle.getAttribute('data-target');
                const target = document.getElementById(targetId);
                const icon = toggle.querySelector('i');
                
                if (target) {
                    target.classList.toggle('collapsed');
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                }
            });
        });
    }
    
    // Initialize advanced input handlers
    initAdvancedInputHandlers(element) {
        const inputs = document.querySelectorAll('#propertiesContent input, #propertiesContent select, #propertiesContent textarea');
        
        inputs.forEach(input => {
            input.addEventListener('input', () => {
                this.updateAdvancedElementProperty(element.id, input.name, input.value, input.type);
            });
        });
    }
    
    // Update advanced element property
    updateAdvancedElementProperty(elementId, property, value, inputType = 'text') {
        const element = this.elements.find(e => e.id === elementId);
        if (!element) return;
        
        // Handle checkbox inputs
        if (inputType === 'checkbox') {
            value = document.querySelector(`[name="${property}"]`).checked;
        }
        
        // Update element settings based on property path
        this.setNestedProperty(element, property, value);
        
        // Re-render element
        this.rerenderElement(element);
        
        // Save state
        this.saveState();
        
        console.log(`🔄 Updated ${property} to ${value} for element ${elementId}`);
    }
    
    // Set nested property in object
    setNestedProperty(obj, path, value) {
        // Convert property names to nested paths
        const propertyMap = {
            'content': 'content',
            'tag': 'settings.content.tag',
            'fontFamily': 'settings.style.typography.fontFamily',
            'fontSize': 'settings.style.typography.fontSize',
            'fontWeight': 'settings.style.typography.fontWeight',
            'lineHeight': 'settings.style.typography.lineHeight',
            'letterSpacing': 'settings.style.typography.letterSpacing',
            'textColor': 'settings.style.textColor',
            'backgroundColor': 'settings.style.backgroundColor',
            'borderRadius': 'settings.style.borderRadius',
            'margin': 'settings.advanced.margin',
            'padding': 'settings.advanced.padding',
            'zIndex': 'settings.advanced.zIndex',
            'cssId': 'settings.advanced.cssId',
            'cssClasses': 'settings.advanced.cssClasses',
            'customCSS': 'settings.advanced.customCSS'
        };
        
        const fullPath = propertyMap[path] || path;
        const keys = fullPath.split('.');
        let current = obj;
        
        // Navigate to the parent object
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
                current[keys[i]] = {};
            }
            current = current[keys[i]];
        }
        
        // Set the final value
        current[keys[keys.length - 1]] = value;
    }
    
    // Re-render element with updated settings
    rerenderElement(element) {
        const elementDiv = document.querySelector(`[data-element-id="${element.id}"]`);
        if (elementDiv) {
            elementDiv.innerHTML = this.getElementHTML(element);
            this.applyAdvancedStyles(elementDiv, element);
        }
    }
    
    // Apply advanced styles to element
    applyAdvancedStyles(elementDiv, element) {
        const settings = element.settings || {};
        const style = settings.style || {};
        const advanced = settings.advanced || {};
        
        // Apply typography
        if (style.typography) {
            const typo = style.typography;
            if (typo.fontFamily && typo.fontFamily !== 'Default') {
                elementDiv.style.fontFamily = typo.fontFamily;
            }
            if (typo.fontSize) elementDiv.style.fontSize = typo.fontSize;
            if (typo.fontWeight) elementDiv.style.fontWeight = typo.fontWeight;
            if (typo.lineHeight) elementDiv.style.lineHeight = typo.lineHeight;
            if (typo.letterSpacing) elementDiv.style.letterSpacing = typo.letterSpacing;
        }
        
        // Apply colors
        if (style.textColor) elementDiv.style.color = style.textColor;
        if (style.backgroundColor) elementDiv.style.backgroundColor = style.backgroundColor;
        
        // Apply advanced styles
        if (advanced.margin) elementDiv.style.margin = advanced.margin;
        if (advanced.padding) elementDiv.style.padding = advanced.padding;
        if (advanced.zIndex && advanced.zIndex !== 'auto') elementDiv.style.zIndex = advanced.zIndex;
        if (advanced.cssId) elementDiv.id = advanced.cssId;
        if (advanced.cssClasses) elementDiv.className += ' ' + advanced.cssClasses;
        
        // Apply custom CSS
        if (advanced.customCSS) {
            this.applyCustomCSS(elementDiv, advanced.customCSS, element.id);
        }
        
        // Apply responsive styles
        this.applyResponsiveStyles(elementDiv, element);
    }
    
    // Apply custom CSS
    applyCustomCSS(elementDiv, customCSS, elementId) {
        let styleElement = document.getElementById(`custom-css-${elementId}`);
        if (!styleElement) {
            styleElement = document.createElement('style');
            styleElement.id = `custom-css-${elementId}`;
            document.head.appendChild(styleElement);
        }
        
        // Replace 'selector' with actual element selector
        const processedCSS = customCSS.replace(/selector/g, `[data-element-id="${elementId}"]`);
        styleElement.textContent = processedCSS;
    }
    
    // Apply responsive styles
    applyResponsiveStyles(elementDiv, element) {
        const responsive = element.responsive || {};
        const currentStyles = responsive[this.currentBreakpoint] || {};
        
        // Apply current breakpoint styles
        Object.keys(currentStyles).forEach(property => {
            elementDiv.style[property] = currentStyles[property];
        });
    }
    
    // Update element style (used by various controls)
    updateElementStyle(property, value) {
        if (!this.selectedElement) return;
        
        this.updateAdvancedElementProperty(this.selectedElement.id, property, value);
    }
}

// Initialize the enhanced builder
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Enhanced KingsBuilder...');
    window.kingsBuilder = new KingsBuilderAdvanced();
});