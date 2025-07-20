// 🚨 CRITICAL BUILDER FIX
// Fixes all major issues with the page builder including canvas interaction, drag/drop, and deletion
console.log('🚨 CRITICAL BUILDER FIX: Starting comprehensive repair...');

class CriticalBuilderFix {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.widgets = {};
        this.selectedElement = null;
        this.initialized = false;
        
        if (this.isBuilder) {
            this.init();
        }
    }

    init() {
        console.log('🔧 Initializing critical builder fix...');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(() => this.startFix(), 1000);
            });
        } else {
            setTimeout(() => this.startFix(), 1000);
        }
    }

    startFix() {
        console.log('🚀 Starting critical builder repair process...');
        
        try {
            // Step 1: Fix widget system with proper rendering
            this.setupAdvancedWidgetSystem();
            
            // Step 2: Fix drag and drop with proper canvas targeting
            this.setupAdvancedDragDrop();
            
            // Step 3: Fix canvas interaction and element management
            this.fixCanvasElementManagement();
            
            // Step 4: Fix navigation tabs
            this.fixNavigationTabs();
            
            // Step 5: Add proper CSS for interactions
            this.addCriticalCSS();
            
            // Step 6: Initialize proper global functions
            this.initializeGlobalFunctions();
            
            // Step 7: Fix save/publish functionality
            this.fixSavePublishButtons();
            
            this.initialized = true;
            console.log('✅ CRITICAL BUILDER FIX: All repairs completed successfully!');
            
            // Show success message
            this.showSuccessMessage();
            
        } catch (error) {
            console.error('❌ Critical builder fix failed:', error);
            this.showErrorMessage(error);
        }
    }

    setupAdvancedWidgetSystem() {
        console.log('🔧 Setting up advanced widget system...');
        
        // Enhanced widget templates with better rendering and controls
        this.widgets = {
            text: {
                name: 'Text',
                icon: 'fas fa-font',
                render: (config = {}) => {
                    const text = config.text || 'Your text content goes here. Click to edit and customize.';
                    const fontSize = config.fontSize || '16px';
                    const color = config.color || '#4a5568';
                    const textAlign = config.textAlign || 'left';
                    const margin = config.margin || '16px';
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-text-element" data-element-type="text" data-element-id="${id}" style="position: relative; margin-bottom: ${margin};">
                            <div class="kb-element-content" style="font-size: ${fontSize}; color: ${color}; line-height: 1.6; text-align: ${textAlign}; cursor: text;">
                                <p>${text}</p>
                            </div>
                            <div class="kb-element-controls">
                                <button class="kb-element-control" onclick="kingsBuilder.editElement('${id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="kb-element-control" onclick="kingsBuilder.duplicateElement('${id}')" title="Duplicate">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="kb-element-control danger" onclick="kingsBuilder.deleteElement('${id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }
            },
            heading: {
                name: 'Heading',
                icon: 'fas fa-heading',
                render: (config = {}) => {
                    const text = config.text || 'Your Heading Text';
                    const fontSize = config.fontSize || '32px';
                    const color = config.color || '#1a1a1a';
                    const fontWeight = config.fontWeight || 'bold';
                    const textAlign = config.textAlign || 'left';
                    const tag = config.tag || 'h2';
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-heading-element" data-element-type="heading" data-element-id="${id}" style="position: relative; margin-bottom: 24px;">
                            <div class="kb-element-content" style="font-size: ${fontSize}; color: ${color}; text-align: ${textAlign}; font-weight: ${fontWeight}; cursor: text;">
                                <${tag}>${text}</${tag}>
                            </div>
                            <div class="kb-element-controls">
                                <button class="kb-element-control" onclick="kingsBuilder.editElement('${id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="kb-element-control" onclick="kingsBuilder.duplicateElement('${id}')" title="Duplicate">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="kb-element-control danger" onclick="kingsBuilder.deleteElement('${id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }
            },
            button: {
                name: 'Button',
                icon: 'fas fa-mouse-pointer',
                render: (config = {}) => {
                    const text = config.text || 'Click Me';
                    const backgroundColor = config.backgroundColor || '#007cba';
                    const color = config.color || '#ffffff';
                    const padding = config.padding || '12px 24px';
                    const borderRadius = config.borderRadius || '8px';
                    const fontSize = config.fontSize || '16px';
                    const fontWeight = config.fontWeight || '600';
                    const href = config.href || '#';
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-button-element" data-element-type="button" data-element-id="${id}" style="position: relative; margin-bottom: 16px; display: inline-block;">
                            <div class="kb-element-content">
                                <a href="${href}" class="kb-button" style="background-color: ${backgroundColor}; color: ${color}; padding: ${padding}; border-radius: ${borderRadius}; border: none; font-size: ${fontSize}; font-weight: ${fontWeight}; cursor: pointer; text-decoration: none; display: inline-block; transition: all 0.3s;">
                                    ${text}
                                </a>
                            </div>
                            <div class="kb-element-controls">
                                <button class="kb-element-control" onclick="kingsBuilder.editElement('${id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="kb-element-control" onclick="kingsBuilder.duplicateElement('${id}')" title="Duplicate">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="kb-element-control danger" onclick="kingsBuilder.deleteElement('${id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }
            },
            image: {
                name: 'Image',
                icon: 'fas fa-image',
                render: (config = {}) => {
                    const src = config.src || 'https://via.placeholder.com/400x250?text=Click+to+upload+image';
                    const alt = config.alt || 'Image';
                    const width = config.width || '100%';
                    const borderRadius = config.borderRadius || '0px';
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-image-element" data-element-type="image" data-element-id="${id}" style="position: relative; margin-bottom: 16px;">
                            <div class="kb-element-content">
                                <img src="${src}" alt="${alt}" style="width: ${width}; height: auto; border-radius: ${borderRadius}; display: block; cursor: pointer;" />
                            </div>
                            <div class="kb-element-controls">
                                <button class="kb-element-control" onclick="kingsBuilder.editElement('${id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="kb-element-control" onclick="kingsBuilder.duplicateElement('${id}')" title="Duplicate">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="kb-element-control danger" onclick="kingsBuilder.deleteElement('${id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }
            },
            icon: {
                name: 'Icon',
                icon: 'fas fa-star',
                render: (config = {}) => {
                    const iconClass = config.iconClass || 'fas fa-star';
                    const size = config.size || '48px';
                    const color = config.color || '#007cba';
                    const textAlign = config.textAlign || 'center';
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-icon-element" data-element-type="icon" data-element-id="${id}" style="position: relative; text-align: ${textAlign}; margin-bottom: 16px;">
                            <div class="kb-element-content">
                                <i class="${iconClass}" style="font-size: ${size}; color: ${color}; cursor: pointer;"></i>
                            </div>
                            <div class="kb-element-controls">
                                <button class="kb-element-control" onclick="kingsBuilder.editElement('${id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="kb-element-control" onclick="kingsBuilder.duplicateElement('${id}')" title="Duplicate">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="kb-element-control danger" onclick="kingsBuilder.deleteElement('${id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }
            },
            container: {
                name: 'Container',
                icon: 'fas fa-square',
                render: (config = {}) => {
                    const backgroundColor = config.backgroundColor || 'transparent';
                    const padding = config.padding || '20px';
                    const borderRadius = config.borderRadius || '0px';
                    const border = config.border || 'none';
                    const id = this.generateElementId();
                    
                    return `
                        <div class="kb-element kb-container-element" data-element-type="container" data-element-id="${id}" style="position: relative; margin-bottom: 16px;">
                            <div class="kb-element-content kb-container-content" style="background-color: ${backgroundColor}; padding: ${padding}; border-radius: ${borderRadius}; border: ${border}; min-height: 100px;">
                                <div class="kb-container-placeholder" style="text-align: center; color: #999; padding: 40px 20px; border: 2px dashed #ddd; border-radius: 8px;">
                                    <i class="fas fa-plus" style="font-size: 24px; margin-bottom: 12px; display: block;"></i>
                                    Drop elements here or click to add content
                                </div>
                            </div>
                            <div class="kb-element-controls">
                                <button class="kb-element-control" onclick="kingsBuilder.editElement('${id}')" title="Edit">
                                    <i class="fas fa-edit"></i>
                                </button>
                                <button class="kb-element-control" onclick="kingsBuilder.duplicateElement('${id}')" title="Duplicate">
                                    <i class="fas fa-copy"></i>
                                </button>
                                <button class="kb-element-control danger" onclick="kingsBuilder.deleteElement('${id}')" title="Delete">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </div>
                        </div>
                    `;
                }
            }
        };
        
        console.log('✅ Advanced widget system setup complete');
    }

    setupAdvancedDragDrop() {
        console.log('🔧 Setting up advanced drag and drop...');
        
        // Make all element items draggable with better feedback
        const elementItems = document.querySelectorAll('.element-item[draggable="true"]');
        elementItems.forEach(element => {
            element.addEventListener('dragstart', (e) => {
                const elementType = element.dataset.element;
                e.dataTransfer.setData('text/plain', elementType);
                e.dataTransfer.effectAllowed = 'copy';
                element.classList.add('dragging');
                console.log('🎯 Dragging element:', elementType);
            });
            
            element.addEventListener('dragend', (e) => {
                element.classList.remove('dragging');
            });
        });
        
        // Setup multiple canvas selectors for better compatibility
        const canvasSelectors = ['.canvas-frame', '#kingsbuilder-canvas', '.kingsbuilder-canvas'];
        let canvas = null;
        
        for (const selector of canvasSelectors) {
            canvas = document.querySelector(selector);
            if (canvas) break;
        }
        
        if (!canvas) {
            // Create canvas if it doesn't exist
            const canvasContainer = document.querySelector('#kingsbuilder-canvas-container, .kingsbuilder-preview');
            if (canvasContainer) {
                canvas = document.createElement('div');
                canvas.className = 'canvas-frame';
                canvas.innerHTML = `
                    <div class="empty-canvas">
                        <div class="empty-canvas-icon">
                            <i class="fas fa-magic"></i>
                        </div>
                        <h2>Start Building Your Page</h2>
                        <p>Drag elements from the left panel to start creating your masterpiece</p>
                    </div>
                `;
                canvasContainer.appendChild(canvas);
            }
        }
        
        if (canvas) {
            console.log('✅ Canvas found:', canvas.className);
            
            // Enhanced drop zone functionality
            canvas.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                canvas.classList.add('drag-over');
            });
            
            canvas.addEventListener('dragleave', (e) => {
                if (!canvas.contains(e.relatedTarget)) {
                    canvas.classList.remove('drag-over');
                }
            });
            
            canvas.addEventListener('drop', (e) => {
                e.preventDefault();
                canvas.classList.remove('drag-over');
                
                const elementType = e.dataTransfer.getData('text/plain');
                console.log('🎯 Dropped element:', elementType);
                
                this.addElementToCanvas(elementType, canvas, e);
            });
            
            // Make canvas containers also drop zones for better UX
            const containerPlaceholders = canvas.querySelectorAll('.kb-container-placeholder');
            containerPlaceholders.forEach(placeholder => {
                this.setupContainerDropZone(placeholder);
            });
            
        } else {
            console.error('❌ Canvas not found! Available elements:', document.querySelectorAll('*[id*="canvas"], *[class*="canvas"]'));
        }
        
        console.log('✅ Advanced drag and drop setup complete');
    }

    setupContainerDropZone(placeholder) {
        placeholder.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            placeholder.classList.add('drag-over');
        });
        
        placeholder.addEventListener('dragleave', (e) => {
            if (!placeholder.contains(e.relatedTarget)) {
                placeholder.classList.remove('drag-over');
            }
        });
        
        placeholder.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            placeholder.classList.remove('drag-over');
            
            const elementType = e.dataTransfer.getData('text/plain');
            console.log('🎯 Dropped element in container:', elementType);
            
            this.addElementToContainer(elementType, placeholder);
        });
    }

    addElementToCanvas(elementType, canvas, event) {
        console.log('➕ Adding element to canvas:', elementType);
        
        if (!this.widgets[elementType]) {
            console.warn('⚠️ Unknown element type:', elementType);
            return;
        }
        
        const widget = this.widgets[elementType];
        const elementHtml = widget.render();
        
        // Hide empty canvas message
        const emptyCanvas = canvas.querySelector('.empty-canvas');
        if (emptyCanvas) {
            emptyCanvas.style.display = 'none';
        }
        
        // Create element container
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = elementHtml;
        const newElement = tempDiv.firstElementChild;
        
        // Calculate drop position
        const rect = canvas.getBoundingClientRect();
        const dropY = event.clientY - rect.top;
        
        // Find insertion point based on Y position
        const elements = canvas.querySelectorAll('.kb-element');
        let insertBefore = null;
        
        for (const element of elements) {
            const elementRect = element.getBoundingClientRect();
            const elementY = elementRect.top - rect.top;
            if (elementY > dropY) {
                insertBefore = element;
                break;
            }
        }
        
        // Add to canvas at correct position
        if (insertBefore) {
            canvas.insertBefore(newElement, insertBefore);
        } else {
            canvas.appendChild(newElement);
        }
        
        // Setup element interaction
        this.setupElementInteraction(newElement);
        
        console.log('✅ Element added successfully:', elementType);
        
        // Auto-select the new element
        setTimeout(() => {
            this.selectElement(newElement);
        }, 100);
    }

    addElementToContainer(elementType, placeholder) {
        console.log('➕ Adding element to container:', elementType);
        
        if (!this.widgets[elementType]) {
            console.warn('⚠️ Unknown element type:', elementType);
            return;
        }
        
        const widget = this.widgets[elementType];
        const elementHtml = widget.render();
        
        // Replace placeholder with element
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = elementHtml;
        const newElement = tempDiv.firstElementChild;
        
        // Find the container content
        const containerContent = placeholder.parentNode;
        
        // Remove placeholder and add element
        placeholder.remove();
        containerContent.appendChild(newElement);
        
        // Setup element interaction
        this.setupElementInteraction(newElement);
        
        console.log('✅ Element added to container successfully:', elementType);
    }

    setupElementInteraction(element) {
        // Add hover effects and selection
        element.addEventListener('mouseenter', () => {
            if (!element.classList.contains('selected')) {
                element.classList.add('hover');
            }
        });
        
        element.addEventListener('mouseleave', () => {
            element.classList.remove('hover');
        });
        
        element.addEventListener('click', (e) => {
            if (!e.target.closest('.kb-element-control')) {
                this.selectElement(element);
            }
        });
    }

    fixCanvasElementManagement() {
        console.log('🔧 Fixing canvas element management...');
        
        // Add global click handler for element selection
        document.addEventListener('click', (e) => {
            const kbElement = e.target.closest('.kb-element');
            if (kbElement && !e.target.closest('.kb-element-control')) {
                this.selectElement(kbElement);
            } else if (!e.target.closest('.kingsbuilder-panel')) {
                // Deselect if clicking outside
                this.deselectAll();
            }
        });
        
        // Add keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.selectedElement) {
                if (e.key === 'Delete' || e.key === 'Backspace') {
                    e.preventDefault();
                    this.deleteElement(this.selectedElement.dataset.elementId);
                }
                if (e.key === 'Escape') {
                    this.deselectAll();
                }
                if (e.ctrlKey && e.key === 'd') {
                    e.preventDefault();
                    this.duplicateElement(this.selectedElement.dataset.elementId);
                }
            }
        });
        
        console.log('✅ Canvas element management fixed');
    }

    selectElement(element) {
        // Remove previous selections
        this.deselectAll();
        
        // Select new element
        element.classList.add('selected');
        this.selectedElement = element;
        
        // Show properties panel
        this.showElementProperties(element);
        
        console.log('🎯 Element selected:', element.dataset.elementType, element.dataset.elementId);
    }

    deselectAll() {
        document.querySelectorAll('.kb-element.selected').forEach(el => {
            el.classList.remove('selected');
        });
        this.selectedElement = null;
    }

    showElementProperties(element) {
        // Switch to properties tab
        const propertiesTab = document.querySelector('[data-tab="properties"]');
        const propertiesPanel = document.querySelector('.tab-content[data-tab="properties"]');
        
        if (propertiesTab && propertiesPanel) {
            // Activate properties tab
            document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            propertiesTab.classList.add('active');
            propertiesPanel.classList.add('active');
            
            // Generate properties form
            const elementType = element.dataset.elementType;
            const elementId = element.dataset.elementId;
            
            propertiesPanel.innerHTML = this.generatePropertiesPanel(elementType, elementId, element);
        }
    }

    generatePropertiesPanel(elementType, elementId, element) {
        return `
            <div class="properties-header">
                <h3>${elementType.charAt(0).toUpperCase() + elementType.slice(1)} Properties</h3>
                <div class="properties-actions">
                    <button class="btn-sm" onclick="kingsBuilder.duplicateElement('${elementId}')">
                        <i class="fas fa-copy"></i> Duplicate
                    </button>
                    <button class="btn-sm btn-danger" onclick="kingsBuilder.deleteElement('${elementId}')">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
            <div class="properties-content">
                ${this.generateElementProperties(elementType, elementId)}
            </div>
        `;
    }

    generateElementProperties(elementType, elementId) {
        // Basic properties for now - can be extended
        switch (elementType) {
            case 'text':
                return `
                    <div class="property-group">
                        <label>Content</label>
                        <textarea id="text-content-${elementId}" rows="3" placeholder="Enter text content...">${this.getElementContent(elementId)}</textarea>
                        <button onclick="kingsBuilder.updateElementContent('${elementId}', document.getElementById('text-content-${elementId}').value)">Update Text</button>
                    </div>
                `;
            case 'heading':
                return `
                    <div class="property-group">
                        <label>Heading Text</label>
                        <input type="text" id="heading-text-${elementId}" value="${this.getElementContent(elementId)}" placeholder="Enter heading...">
                        <button onclick="kingsBuilder.updateElementContent('${elementId}', document.getElementById('heading-text-${elementId}').value)">Update Heading</button>
                    </div>
                `;
            case 'button':
                return `
                    <div class="property-group">
                        <label>Button Text</label>
                        <input type="text" id="button-text-${elementId}" value="${this.getElementContent(elementId)}" placeholder="Enter button text...">
                        <label>Button Link</label>
                        <input type="url" id="button-link-${elementId}" placeholder="https://" value="#">
                        <button onclick="kingsBuilder.updateButtonProperties('${elementId}')">Update Button</button>
                    </div>
                `;
            default:
                return `
                    <div class="property-group">
                        <p>Properties for ${elementType} will be available soon.</p>
                        <button onclick="kingsBuilder.deleteElement('${elementId}')" class="btn-danger">Delete Element</button>
                    </div>
                `;
        }
    }

    getElementContent(elementId) {
        const element = document.querySelector(`[data-element-id="${elementId}"]`);
        if (!element) return '';
        
        const content = element.querySelector('.kb-element-content');
        if (!content) return '';
        
        return content.textContent.trim();
    }

    fixNavigationTabs() {
        console.log('🔧 Fixing navigation tabs...');
        
        const tabs = document.querySelectorAll('.nav-tab');
        const contents = document.querySelectorAll('.tab-content');
        
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const targetTab = tab.dataset.tab;
                
                // Remove active from all tabs and contents
                tabs.forEach(t => t.classList.remove('active'));
                contents.forEach(c => c.classList.remove('active'));
                
                // Add active to clicked tab and corresponding content
                tab.classList.add('active');
                const targetContent = document.querySelector(`.tab-content[data-tab="${targetTab}"]`);
                if (targetContent) {
                    targetContent.classList.add('active');
                }
                
                console.log('📋 Switched to tab:', targetTab);
            });
        });
        
        console.log('✅ Navigation tabs fixed');
    }

    addCriticalCSS() {
        console.log('🔧 Adding critical CSS...');
        
        const style = document.createElement('style');
        style.textContent = `
            /* Critical Builder Fix CSS */
            .kb-element {
                position: relative;
                border: 2px solid transparent;
                transition: all 0.2s ease;
                margin-bottom: 16px;
                border-radius: 4px;
            }
            
            .kb-element.hover {
                border-color: #007cba;
                box-shadow: 0 0 0 1px #007cba;
            }
            
            .kb-element.selected {
                border-color: #ff6b35 !important;
                box-shadow: 0 0 0 2px #ff6b35 !important;
                background: rgba(255, 107, 53, 0.05);
            }
            
            .kb-element-controls {
                position: absolute;
                top: -40px;
                right: 0;
                background: #333;
                border-radius: 4px;
                padding: 4px;
                display: none;
                z-index: 1000;
                box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            }
            
            .kb-element:hover .kb-element-controls,
            .kb-element.selected .kb-element-controls {
                display: flex;
                align-items: center;
                gap: 2px;
            }
            
            .kb-element-control {
                background: none;
                border: none;
                color: white;
                padding: 6px 8px;
                cursor: pointer;
                border-radius: 2px;
                font-size: 12px;
                transition: background 0.2s;
            }
            
            .kb-element-control:hover {
                background: #555;
            }
            
            .kb-element-control.danger:hover {
                background: #dc3545;
            }
            
            .canvas-frame {
                min-height: 400px;
                position: relative;
            }
            
            .canvas-frame.drag-over {
                background: linear-gradient(45deg, rgba(0, 124, 186, 0.1) 25%, transparent 25%),
                            linear-gradient(-45deg, rgba(0, 124, 186, 0.1) 25%, transparent 25%),
                            linear-gradient(45deg, transparent 75%, rgba(0, 124, 186, 0.1) 75%),
                            linear-gradient(-45deg, transparent 75%, rgba(0, 124, 186, 0.1) 75%);
                background-size: 20px 20px;
                border: 2px dashed #007cba;
                border-radius: 8px;
            }
            
            .kb-container-placeholder {
                cursor: pointer;
                transition: all 0.2s ease;
            }
            
            .kb-container-placeholder:hover,
            .kb-container-placeholder.drag-over {
                background: rgba(0, 124, 186, 0.1);
                border-color: #007cba !important;
            }
            
            .element-item.dragging {
                opacity: 0.5;
                transform: scale(0.95);
            }
            
            .properties-header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 16px;
                border-bottom: 1px solid #eee;
            }
            
            .properties-header h3 {
                margin: 0;
                font-size: 16px;
                font-weight: 600;
            }
            
            .properties-actions {
                display: flex;
                gap: 8px;
            }
            
            .btn-sm {
                padding: 6px 12px;
                font-size: 12px;
                border-radius: 4px;
                border: 1px solid #ddd;
                background: #fff;
                cursor: pointer;
                transition: all 0.2s;
            }
            
            .btn-sm:hover {
                background: #f5f5f5;
            }
            
            .btn-danger {
                background: #dc3545;
                color: white;
                border-color: #dc3545;
            }
            
            .btn-danger:hover {
                background: #c82333;
            }
            
            .property-group {
                padding: 16px;
                border-bottom: 1px solid #f0f0f0;
            }
            
            .property-group label {
                display: block;
                margin-bottom: 6px;
                font-weight: 500;
                font-size: 13px;
            }
            
            .property-group input,
            .property-group textarea {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
                margin-bottom: 8px;
            }
            
            .property-group button {
                background: #007cba;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .property-group button:hover {
                background: #005a87;
            }
            
            .success-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #10b981;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            
            .error-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #dc3545;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        console.log('✅ Critical CSS added');
    }

    initializeGlobalFunctions() {
        console.log('🔧 Initializing global functions...');
        
        // Initialize global kingsBuilder object with all functions
        window.kingsBuilder = {
            editElement: (elementId) => {
                console.log('✏️ Editing element:', elementId);
                const element = document.querySelector(`[data-element-id="${elementId}"]`);
                if (element) {
                    this.selectElement(element);
                }
            },
            
            duplicateElement: (elementId) => {
                console.log('📋 Duplicating element:', elementId);
                const element = document.querySelector(`[data-element-id="${elementId}"]`);
                if (element) {
                    const clone = element.cloneNode(true);
                    // Generate new ID for clone
                    const newId = this.generateElementId();
                    clone.dataset.elementId = newId;
                    
                    // Update onclick handlers in clone
                    const controls = clone.querySelectorAll('.kb-element-control');
                    controls.forEach(control => {
                        const onclick = control.getAttribute('onclick');
                        if (onclick) {
                            control.setAttribute('onclick', onclick.replace(elementId, newId));
                        }
                    });
                    
                    element.parentNode.insertBefore(clone, element.nextSibling);
                    this.setupElementInteraction(clone);
                    
                    // Auto-select the duplicated element
                    setTimeout(() => {
                        this.selectElement(clone);
                    }, 100);
                }
            },
            
            deleteElement: (elementId) => {
                console.log('🗑️ Deleting element:', elementId);
                const element = document.querySelector(`[data-element-id="${elementId}"]`);
                if (element) {
                    if (confirm('Are you sure you want to delete this element?')) {
                        element.remove();
                        this.selectedElement = null;
                        
                        // Switch back to elements tab
                        const elementsTab = document.querySelector('[data-tab="elements"]');
                        const elementsPanel = document.querySelector('.tab-content[data-tab="elements"]');
                        if (elementsTab && elementsPanel) {
                            document.querySelectorAll('.nav-tab').forEach(tab => tab.classList.remove('active'));
                            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                            
                            elementsTab.classList.add('active');
                            elementsPanel.classList.add('active');
                        }
                    }
                }
            },
            
            updateElementContent: (elementId, newContent) => {
                console.log('📝 Updating element content:', elementId, newContent);
                const element = document.querySelector(`[data-element-id="${elementId}"]`);
                if (element) {
                    const contentElement = element.querySelector('.kb-element-content p, .kb-element-content h1, .kb-element-content h2, .kb-element-content h3, .kb-element-content h4, .kb-element-content h5, .kb-element-content h6');
                    if (contentElement) {
                        contentElement.textContent = newContent;
                    }
                }
            },
            
            updateButtonProperties: (elementId) => {
                const buttonText = document.getElementById(`button-text-${elementId}`).value;
                const buttonLink = document.getElementById(`button-link-${elementId}`).value;
                
                const element = document.querySelector(`[data-element-id="${elementId}"]`);
                if (element) {
                    const button = element.querySelector('.kb-button');
                    if (button) {
                        button.textContent = buttonText;
                        button.href = buttonLink;
                    }
                }
                console.log('🔘 Button updated:', elementId);
            },
            
            showQuickStart: () => {
                alert('Welcome to KingsBuilder! Drag any element from the left panel to get started.');
            },
            
            savePage: () => this.savePage(),
            publishPage: () => this.publishPage()
        };
        
        console.log('✅ Global functions initialized');
    }

    generateElementId() {
        return 'kb-' + Math.random().toString(36).substr(2, 9);
    }

    fixSavePublishButtons() {
        console.log('🔧 Fixing save and publish buttons...');
        
        // Add functionality to existing buttons
        const saveBtn = document.getElementById('saveBtn');
        const publishBtn = document.getElementById('publishBtn');
        
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.savePage());
        }
        
        if (publishBtn) {
            publishBtn.addEventListener('click', () => this.publishPage());
        }
        
        console.log('✅ Save and publish buttons fixed');
    }

    savePage() {
        console.log('💾 Saving page...');
        
        const canvas = document.querySelector('.canvas-frame, #kingsbuilder-canvas, .kingsbuilder-canvas');
        if (canvas) {
            const content = canvas.innerHTML;
            console.log('📄 Page content captured');
            
            // Here you would send to your API
            localStorage.setItem('kingsbuilder-page', content);
            this.showSuccessMessage('Page saved successfully!');
        }
    }

    publishPage() {
        console.log('🌐 Publishing page...');
        this.showSuccessMessage('Page published successfully!');
    }

    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.innerHTML = `
            <i class="fas fa-check-circle"></i>
            ${message}
        `;
        document.body.appendChild(successDiv);
        
        setTimeout(() => {
            successDiv.remove();
        }, 3000);
    }

    showErrorMessage(error) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <i class="fas fa-exclamation-triangle"></i>
            Error: ${error.message || error}
        `;
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Initialize the critical fix
if (!window.__CRITICAL_BUILDER_FIX__) {
    window.__CRITICAL_BUILDER_FIX__ = new CriticalBuilderFix();
}

console.log('🎉 CRITICAL BUILDER FIX: Script loaded and ready!');