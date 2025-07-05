// KingsBuilder - Visual Page Builder JavaScript
// Created by Kingsmen Marketing Agency

class KingsBuilder {
    constructor() {
        this.currentDevice = 'desktop';
        this.selectedElement = null;
        this.elements = [];
        this.history = [];
        this.historyIndex = -1;
        this.zoomLevel = 1;
        this.isLoading = false;
        this.clipboard = null;
        this.isDragging = false;
        this.navigatorVisible = false;
        this.navigatorDocked = false;
        this.panelMinimized = false;
        
        this.init();
    }
    
    init() {
        console.log('👑 KingsBuilder - Visual Page Builder Initializing...');
        console.log('🏢 Created by Kingsmen Marketing Agency');
        
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeBuilder());
        } else {
            this.initializeBuilder();
        }
    }
    
    initializeBuilder() {
        // Get shop and page parameters from URL
        const urlParams = new URLSearchParams(window.location.search);
        this.shop = urlParams.get('shop');
        this.pageId = urlParams.get('pageId');
        this.embedded = urlParams.get('embedded') === '1';
        
        console.log('🔧 Builder Context:', {
            shop: this.shop,
            pageId: this.pageId,
            embedded: this.embedded
        });
        
        // Validate shop parameter
        if (!this.shop || this.shop === 'unknown.myshopify.com') {
            console.error('❌ Invalid shop parameter in builder');
            this.showError('Shop information not available. Please return to dashboard and try again.');
            return;
        }
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize drag and drop
        this.initDragAndDrop();
        
        // Initialize context menu
        this.initContextMenu();
        
        // Initialize navigator
        this.initNavigator();
        
        // Initialize keyboard shortcuts
        this.initKeyboardShortcuts();
        
        // Load page data if editing existing page
        this.loadPageData();
        
        // Save initial state
        this.saveState();
        
        // Initialize Shopify image upload
        this.initShopifyImageUpload();
        
        console.log('✅ KingsBuilder Ready!');
    }
    
    // Initialize Shopify image upload functionality
    initShopifyImageUpload() {
        // Add upload button to image elements
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('upload-shopify-image')) {
                this.openShopifyImagePicker(e.target);
            }
        });
    }
    
    // Open Shopify image picker
    async openShopifyImagePicker(button) {
        try {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (e) => {
                const file = e.target.files[0];
                if (file) {
                    await this.uploadToShopify(file, button);
                }
            };
            input.click();
        } catch (error) {
            console.error('Error opening image picker:', error);
        }
    }
    
    // Upload image to Shopify
    async uploadToShopify(file, button) {
        try {
            const formData = new FormData();
            formData.append('image', file);
            formData.append('shop', this.context.shop);
            
            console.log('📤 Uploading image to Shopify:', file.name);
            
            const response = await fetch('/api/upload-image', {
                method: 'POST',
                body: formData,
                credentials: 'include'
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Update the image element with the Shopify URL
                const imageElement = button.closest('.kingsbuilder-element').querySelector('img');
                if (imageElement) {
                    imageElement.src = result.imageUrl;
                    imageElement.alt = result.alt || 'Shopify Image';
                }
                console.log('✅ Image uploaded to Shopify:', result.imageUrl);
                this.showNotification('Image uploaded successfully!', 'success');
            } else {
                console.error('❌ Upload failed:', result.error);
                this.showNotification('Failed to upload image: ' + result.error, 'error');
            }
        } catch (error) {
            console.error('Error uploading to Shopify:', error);
            this.showNotification('Error uploading image', 'error');
        }
    }
    
    initEventListeners() {
        // Panel navigation tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.closest('.nav-tab').getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
        
        // Toolbar buttons
        this.bindToolbarEvents();
        
        // Device switcher
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const device = e.target.closest('.device-btn').getAttribute('data-device');
                this.switchDevice(device);
            });
        });
        
        // Panel controls
        this.bindPanelControls();
        
        // Category toggles
        document.querySelectorAll('.category-header').forEach(header => {
            header.addEventListener('click', () => {
                const category = header.closest('.category');
                category.classList.toggle('active');
            });
        });
        
        // Back to elements button
        const backBtn = document.getElementById('backToElements');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.switchTab('elements');
            });
        }
        
        // Canvas click handler
        const canvas = document.getElementById('kingsbuilder-canvas');
        if (canvas) {
            canvas.addEventListener('click', (e) => {
                if (e.target === canvas || e.target.classList.contains('canvas-frame')) {
                    this.deselectElement();
                }
            });
        }
        
        // Search functionality
        const searchInput = document.getElementById('elementsSearch');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.filterElements(e.target.value);
            });
        }
    }
    
    bindToolbarEvents() {
        const toolbar = document.getElementById('kingsbuilder-toolbar');
        if (!toolbar) return;
        
        // Add element button
        const addElementBtn = document.getElementById('addElementBtn');
        if (addElementBtn) {
            addElementBtn.addEventListener('click', () => {
                if (this.panelMinimized) {
                    this.togglePanel();
                }
                this.switchTab('elements');
            });
        }
        
        // Preview button
        const previewBtn = document.getElementById('previewBtn');
        if (previewBtn) {
            previewBtn.addEventListener('click', () => this.preview());
        }
        
        // Publish button
        const publishBtn = document.getElementById('publishBtn');
        if (publishBtn) {
            publishBtn.addEventListener('click', () => this.publish());
        }
        
        // Exit button
        const exitBtn = document.getElementById('exitBtn');
        if (exitBtn) {
            exitBtn.addEventListener('click', () => this.exit());
        }
        
        // Zoom controls
        const zoomInBtn = document.getElementById('zoomIn');
        const zoomOutBtn = document.getElementById('zoomOut');
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
    }
    
    bindPanelControls() {
        // Panel minimize
        const minimizeBtn = document.getElementById('panelMinimize');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => this.togglePanel());
        }
        
        // Footer tools
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        const navigatorBtn = document.getElementById('navigatorBtn');
        
        if (undoBtn) undoBtn.addEventListener('click', () => this.undo());
        if (redoBtn) redoBtn.addEventListener('click', () => this.redo());
        if (navigatorBtn) navigatorBtn.addEventListener('click', () => this.toggleNavigator());
    }
    
    switchTab(tabName) {
        // Update nav tabs
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.querySelector(`.tab-content[data-tab="${tabName}"]`).classList.add('active');
        
        console.log(`🔄 Switched to ${tabName} tab`);
    }
    
    switchDevice(device) {
        // Update device buttons
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-device="${device}"]`).classList.add('active');
        
        // Update canvas
        const canvas = document.getElementById('kingsbuilder-canvas');
        canvas.className = `kingsbuilder-canvas ${device}`;
        
        this.currentDevice = device;
        console.log(`📱 Switched to ${device} view`);
    }
    
    togglePanel() {
        const panel = document.getElementById('kingsbuilder-panel');
        panel.classList.toggle('minimized');
        this.panelMinimized = !this.panelMinimized;
        
        const minimizeBtn = document.getElementById('panelMinimize');
        const icon = minimizeBtn.querySelector('i');
        icon.className = this.panelMinimized ? 'fas fa-plus' : 'fas fa-minus';
        
        console.log(`📋 Panel ${this.panelMinimized ? 'minimized' : 'expanded'}`);
    }
    
    initDragAndDrop() {
        console.log('🎯 Initializing enhanced drag and drop...');
        
        // Element items drag start
        document.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('element-item')) {
                const elementType = e.target.getAttribute('data-element');
                console.log('🎪 Drag started for element:', elementType);
                
                e.dataTransfer.setData('text/plain', elementType);
                e.dataTransfer.effectAllowed = 'copy';
                e.target.classList.add('dragging');
                this.isDragging = true;
            }
        });
        
        document.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('element-item')) {
                e.target.classList.remove('dragging');
                this.isDragging = false;
            }
        });
        
        // Canvas drop zone
        this.setupCanvasDropZone();
    }
    
    setupCanvasDropZone() {
        const canvasFrame = document.querySelector('.canvas-frame');
        if (!canvasFrame) {
            console.warn('⚠️ Canvas frame not found, retrying in 500ms...');
            setTimeout(() => this.setupCanvasDropZone(), 500);
            return;
        }
        
        console.log('🎯 Setting up enhanced canvas drop zone');
        
        canvasFrame.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.stopPropagation();
            e.dataTransfer.dropEffect = 'copy';
            
            if (!canvasFrame.classList.contains('drag-over')) {
                canvasFrame.classList.add('drag-over');
                console.log('📥 Drag over canvas');
            }
        });
        
        canvasFrame.addEventListener('dragleave', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const rect = canvasFrame.getBoundingClientRect();
            const x = e.clientX;
            const y = e.clientY;
            
            if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
                canvasFrame.classList.remove('drag-over');
                console.log('📤 Drag leave canvas');
            }
        });
        
        canvasFrame.addEventListener('drop', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            console.log('🎯 Drop event triggered');
            canvasFrame.classList.remove('drag-over');
            
            const elementType = e.dataTransfer.getData('text/plain');
            if (!elementType) {
                console.warn('⚠️ No element type found in drop data');
                return;
            }
            
            const rect = canvasFrame.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            console.log(`🎪 Dropping element "${elementType}" at position (${x}, ${y})`);
            this.addElement(elementType, { x, y });
        });
    }
    
    addElement(type, position = {}) {
        console.log(`➕ Adding element: ${type}`, position);
        
        const element = this.createElement(type, position);
        if (element) {
            this.elements.push(element);
            this.renderElement(element);
            this.saveState();
            
            // Remove empty state if it exists
            const emptyState = document.querySelector('.empty-canvas');
            if (emptyState) {
                emptyState.style.display = 'none';
            }
            
            // Select the new element
            this.selectElement(element);
            
            // Auto switch to properties tab
            this.switchTab('properties');
        }
    }
    
    createElement(type, position) {
        const elementId = `kb_element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const elements = {
            heading: {
                id: elementId,
                type: 'heading',
                content: 'Your Heading Here',
                tag: 'h2',
                styles: {
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    textAlign: 'left',
                    marginBottom: '16px',
                    lineHeight: '1.2'
                },
                position: position
            },
            text: {
                id: elementId,
                type: 'text',
                content: 'Your text content goes here. Click to edit and customize.',
                styles: {
                    fontSize: '16px',
                    color: '#4a5568',
                    lineHeight: '1.6',
                    textAlign: 'left',
                    marginBottom: '16px'
                },
                position: position
            },
            image: {
                id: elementId,
                type: 'image',
                content: 'https://via.placeholder.com/400x300/f0f0f0/666666?text=Your+Image',
                alt: 'Placeholder image',
                styles: {
                    width: '100%',
                    maxWidth: '400px',
                    height: 'auto',
                    borderRadius: '8px',
                    marginBottom: '16px'
                },
                position: position
            },
            button: {
                id: elementId,
                type: 'button',
                content: 'Click Me',
                href: '#',
                styles: {
                    backgroundColor: '#000000',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block',
                    marginBottom: '16px',
                    transition: 'all 0.2s ease'
                },
                position: position
            },
            section: {
                id: elementId,
                type: 'section',
                content: '',
                styles: {
                    backgroundColor: '#ffffff',
                    padding: '40px 20px',
                    marginBottom: '0',
                    minHeight: '200px',
                    border: '2px dashed #e5e7eb'
                },
                position: position
            },
            divider: {
                id: elementId,
                type: 'divider',
                content: '',
                styles: {
                    height: '1px',
                    backgroundColor: '#e5e7eb',
                    border: 'none',
                    margin: '20px 0',
                    width: '100%'
                },
                position: position
            },
            spacer: {
                id: elementId,
                type: 'spacer',
                content: '',
                styles: {
                    height: '40px',
                    backgroundColor: 'transparent',
                    margin: '0',
                    width: '100%'
                },
                position: position
            }
        };
        
        return elements[type] || null;
    }
    
    renderElement(element) {
        const canvasFrame = document.querySelector('.canvas-frame');
        const elementDiv = document.createElement('div');
        elementDiv.className = 'kb-element';
        elementDiv.setAttribute('data-element-id', element.id);
        elementDiv.setAttribute('data-element-type', element.type);
        elementDiv.innerHTML = this.getElementHTML(element);
        
        // Apply styles
        this.applyStyles(elementDiv, element.styles);
        
        // Add event listeners
        elementDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(element);
        });
        
        // Add context menu
        elementDiv.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.showContextMenu(e, element);
        });
        
        canvasFrame.appendChild(elementDiv);
        console.log(`✨ Rendered element: ${element.type}`);
    }
    
    getElementHTML(element) {
        const controlsHTML = `
            <div class="kb-element-controls">
                <button class="kb-element-control" onclick="kingsBuilder.editElement('${element.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="kb-element-control" onclick="kingsBuilder.duplicateElement('${element.id}')" title="Duplicate">
                    <i class="fas fa-clone"></i>
                </button>
                <button class="kb-element-control danger" onclick="kingsBuilder.deleteElement('${element.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        switch (element.type) {
            case 'heading':
                return `<${element.tag || 'h2'}>${element.content}</${element.tag || 'h2'}>${controlsHTML}`;
            case 'text':
                return `<p>${element.content}</p>${controlsHTML}`;
            case 'image':
                return `<img src="${element.content}" alt="${element.alt || ''}" style="max-width: 100%;">${controlsHTML}`;
            case 'button':
                return `<a href="${element.href || '#'}" class="kb-button">${element.content}</a>${controlsHTML}`;
            case 'section':
                return `<div class="kb-section">Drop elements here</div>${controlsHTML}`;
            case 'divider':
                return `<hr>${controlsHTML}`;
            case 'spacer':
                return `<div class="kb-spacer"></div>${controlsHTML}`;
            default:
                return `<div>Unknown element type: ${element.type}</div>${controlsHTML}`;
        }
    }
    
    applyStyles(elementDiv, styles) {
        if (styles) {
            Object.assign(elementDiv.style, styles);
        }
    }
    
    selectElement(element) {
        // Deselect previous element
        this.deselectElement();
        
        // Select new element
        const elementDiv = document.querySelector(`[data-element-id="${element.id}"]`);
        if (elementDiv) {
            elementDiv.classList.add('selected');
            this.selectedElement = element;
            this.showProperties(element);
            this.updateNavigator();
        }
    }
    
    deselectElement() {
        document.querySelectorAll('.kb-element.selected').forEach(el => {
            el.classList.remove('selected');
        });
        this.selectedElement = null;
        this.hideProperties();
    }
    
    showProperties(element) {
        // Switch to properties tab
        this.switchTab('properties');
        
        const propertiesContent = document.getElementById('propertiesContent');
        if (!propertiesContent) return;
        
        const form = this.createPropertiesForm(element);
        propertiesContent.innerHTML = form;
        
        // Add event listeners to form inputs
        propertiesContent.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateElementProperty(element.id, e.target.name, e.target.value);
            });
        });
    }
    
    createPropertiesForm(element) {
        let form = `
            <div class="properties-header">
                <h3>Edit ${element.type.charAt(0).toUpperCase() + element.type.slice(1)}</h3>
            </div>
            <div class="properties-sections">
        `;
        
        // Content section
        form += `<div class="property-section">
            <h4>Content</h4>`;
        
        switch (element.type) {
            case 'heading':
                form += `
                    <div class="form-group">
                        <label>Heading Text</label>
                        <input type="text" name="content" value="${element.content}">
                    </div>
                    <div class="form-group">
                        <label>Heading Tag</label>
                        <select name="tag">
                            <option value="h1" ${element.tag === 'h1' ? 'selected' : ''}>H1</option>
                            <option value="h2" ${element.tag === 'h2' ? 'selected' : ''}>H2</option>
                            <option value="h3" ${element.tag === 'h3' ? 'selected' : ''}>H3</option>
                            <option value="h4" ${element.tag === 'h4' ? 'selected' : ''}>H4</option>
                            <option value="h5" ${element.tag === 'h5' ? 'selected' : ''}>H5</option>
                            <option value="h6" ${element.tag === 'h6' ? 'selected' : ''}>H6</option>
                        </select>
                    </div>
                `;
                break;
            case 'text':
                form += `
                    <div class="form-group">
                        <label>Text Content</label>
                        <textarea name="content" rows="4">${element.content}</textarea>
                    </div>
                `;
                break;
            case 'image':
                form += `
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" name="content" value="${element.content}">
                    </div>
                    <div class="form-group">
                        <label>Alt Text</label>
                        <input type="text" name="alt" value="${element.alt || ''}">
                    </div>
                `;
                break;
            case 'button':
                form += `
                    <div class="form-group">
                        <label>Button Text</label>
                        <input type="text" name="content" value="${element.content}">
                    </div>
                    <div class="form-group">
                        <label>Link URL</label>
                        <input type="url" name="href" value="${element.href || ''}">
                    </div>
                `;
                break;
        }
        
        form += `</div>`;
        
        // Style section
        if (element.type !== 'spacer') {
            form += `<div class="property-section">
                <h4>Style</h4>
                <div class="form-group">
                    <label>Font Size</label>
                    <input type="text" name="fontSize" value="${element.styles.fontSize || '16px'}">
                </div>
                <div class="form-group">
                    <label>Color</label>
                    <input type="color" name="color" value="${this.hexFromRgb(element.styles.color)}">
                </div>
                <div class="form-group">
                    <label>Text Align</label>
                    <select name="textAlign">
                        <option value="left" ${element.styles.textAlign === 'left' ? 'selected' : ''}>Left</option>
                        <option value="center" ${element.styles.textAlign === 'center' ? 'selected' : ''}>Center</option>
                        <option value="right" ${element.styles.textAlign === 'right' ? 'selected' : ''}>Right</option>
                        <option value="justify" ${element.styles.textAlign === 'justify' ? 'selected' : ''}>Justify</option>
                    </select>
                </div>
            </div>`;
        }
        
        form += `</div>`;
        
        return form;
    }
    
    updateElementProperty(elementId, property, value) {
        const element = this.elements.find(e => e.id === elementId);
        if (!element) return;
        
        if (property === 'content' || property === 'href' || property === 'alt' || property === 'tag') {
            element[property] = value;
        } else {
            element.styles[property] = value;
        }
        
        // Re-render the element
        const elementDiv = document.querySelector(`[data-element-id="${elementId}"]`);
        if (elementDiv) {
            elementDiv.innerHTML = this.getElementHTML(element);
            this.applyStyles(elementDiv, element.styles);
        }
        
        this.saveState();
    }
    
    hideProperties() {
        const propertiesContent = document.getElementById('propertiesContent');
        if (propertiesContent) {
            propertiesContent.innerHTML = `
                <div class="no-selection">
                    <div class="no-selection-icon">
                        <i class="fas fa-mouse-pointer"></i>
                    </div>
                    <h3>No Element Selected</h3>
                    <p>Select an element to edit its properties</p>
                </div>
            `;
        }
    }
    
    editElement(elementId) {
        const element = this.elements.find(e => e.id === elementId);
        if (element) {
            this.selectElement(element);
        }
    }
    
    duplicateElement(elementId) {
        const element = this.elements.find(e => e.id === elementId);
        if (element) {
            const newElement = JSON.parse(JSON.stringify(element));
            newElement.id = `kb_element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            newElement.position = { x: (element.position.x || 0) + 20, y: (element.position.y || 0) + 20 };
            
            this.elements.push(newElement);
            this.renderElement(newElement);
            this.saveState();
            this.selectElement(newElement);
        }
    }
    
    deleteElement(elementId) {
        if (confirm('Are you sure you want to delete this element?')) {
            this.elements = this.elements.filter(e => e.id !== elementId);
            const elementDiv = document.querySelector(`[data-element-id="${elementId}"]`);
            if (elementDiv) {
                elementDiv.remove();
            }
            this.deselectElement();
            this.saveState();
            this.updateNavigator();
            
            // Show empty state if no elements
            if (this.elements.length === 0) {
                const emptyState = document.querySelector('.empty-canvas');
                if (emptyState) {
                    emptyState.style.display = 'block';
                }
            }
        }
    }
    
    initContextMenu() {
        const contextMenu = document.getElementById('contextMenu');
        
        // Hide context menu on click elsewhere
        document.addEventListener('click', () => {
            contextMenu.classList.remove('show');
        });
        
        // Context menu actions
        contextMenu.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.target.closest('.context-menu-item')?.getAttribute('data-action');
            if (action && this.selectedElement) {
                this.handleContextAction(action, this.selectedElement);
            }
            contextMenu.classList.remove('show');
        });
    }
    
    showContextMenu(e, element) {
        const contextMenu = document.getElementById('contextMenu');
        contextMenu.style.left = `${e.pageX}px`;
        contextMenu.style.top = `${e.pageY}px`;
        contextMenu.classList.add('show');
        
        // Update menu items based on element
        this.updateContextMenu(element);
    }
    
    updateContextMenu(element) {
        // Enable/disable menu items based on context
        const pasteItem = document.querySelector('[data-action="paste"]');
        if (pasteItem) {
            pasteItem.style.opacity = this.clipboard ? '1' : '0.5';
        }
    }
    
    handleContextAction(action, element) {
        switch (action) {
            case 'copy':
                this.copyElement(element);
                break;
            case 'paste':
                this.pasteElement();
                break;
            case 'duplicate':
                this.duplicateElement(element.id);
                break;
            case 'edit':
                this.selectElement(element);
                break;
            case 'reset-style':
                this.resetElementStyle(element);
                break;
            case 'navigator':
                this.showInNavigator(element);
                break;
            case 'delete':
                this.deleteElement(element.id);
                break;
        }
    }
    
    copyElement(element) {
        this.clipboard = JSON.parse(JSON.stringify(element));
        console.log('📋 Element copied to clipboard');
    }
    
    pasteElement() {
        if (this.clipboard) {
            const newElement = JSON.parse(JSON.stringify(this.clipboard));
            newElement.id = `kb_element_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            newElement.position = { x: (this.clipboard.position.x || 0) + 20, y: (this.clipboard.position.y || 0) + 20 };
            
            this.elements.push(newElement);
            this.renderElement(newElement);
            this.saveState();
            this.selectElement(newElement);
            console.log('📋 Element pasted from clipboard');
        }
    }
    
    resetElementStyle(element) {
        // Reset to default styles based on element type
        const defaultElement = this.createElement(element.type, element.position);
        if (defaultElement) {
            element.styles = defaultElement.styles;
            
            const elementDiv = document.querySelector(`[data-element-id="${element.id}"]`);
            if (elementDiv) {
                this.applyStyles(elementDiv, element.styles);
            }
            
            this.saveState();
            this.showProperties(element);
        }
    }
    
    initNavigator() {
        const navigator = document.getElementById('kingsbuilder-navigator');
        const navigatorHeader = document.getElementById('navigatorHeader');
        
        // Make navigator draggable
        this.makeDraggable(navigator, navigatorHeader);
        
        // Navigator controls
        const toggleBtn = document.getElementById('toggleNavigator');
        const dockBtn = document.getElementById('dockNavigator');
        const closeBtn = document.getElementById('closeNavigator');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleAllElements());
        }
        
        if (dockBtn) {
            dockBtn.addEventListener('click', () => this.toggleNavigatorDock());
        }
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.toggleNavigator());
        }
    }
    
    toggleNavigator() {
        const navigator = document.getElementById('kingsbuilder-navigator');
        navigator.classList.toggle('show');
        this.navigatorVisible = !this.navigatorVisible;
        
        if (this.navigatorVisible) {
            this.updateNavigator();
        }
        
        console.log(`🧭 Navigator ${this.navigatorVisible ? 'shown' : 'hidden'}`);
    }
    
    toggleNavigatorDock() {
        const navigator = document.getElementById('kingsbuilder-navigator');
        navigator.classList.toggle('docked');
        this.navigatorDocked = !this.navigatorDocked;
        
        const dockBtn = document.getElementById('dockNavigator');
        const icon = dockBtn.querySelector('i');
        icon.className = this.navigatorDocked ? 'fas fa-expand-arrows-alt' : 'fas fa-anchor';
        
        console.log(`🧭 Navigator ${this.navigatorDocked ? 'docked' : 'floating'}`);
    }
    
    updateNavigator() {
        const navigatorContent = document.getElementById('navigatorContent');
        if (!navigatorContent) return;
        
        if (this.elements.length === 0) {
            navigatorContent.innerHTML = `
                <div class="navigator-empty">
                    <div class="navigator-empty-icon">
                        <i class="fas fa-sitemap"></i>
                    </div>
                    <p>No elements yet</p>
                </div>
            `;
            return;
        }
        
        const elementsHTML = this.elements.map((element, index) => `
            <div class="navigator-item ${this.selectedElement?.id === element.id ? 'selected' : ''}" 
                 data-element-id="${element.id}" data-index="${index}"
                 draggable="true"
                 onclick="kingsBuilder.selectElementById('${element.id}')">
                <div class="navigator-item-drag-handle">
                    <i class="fas fa-grip-vertical"></i>
                </div>
                <div class="navigator-item-icon">
                    <i class="${this.getElementIcon(element.type)}"></i>
                </div>
                <div class="navigator-item-content">
                    <div class="navigator-item-title">${element.type.charAt(0).toUpperCase() + element.type.slice(1)}</div>
                    <div class="navigator-item-subtitle">${this.getElementPreview(element)}</div>
                </div>
                <div class="navigator-item-actions">
                    <button onclick="event.stopPropagation(); kingsBuilder.toggleElementVisibility('${element.id}')" title="Toggle Visibility">
                        <i class="fas fa-eye${element.visible === false ? '-slash' : ''}"></i>
                    </button>
                </div>
            </div>
        `).join('');
        
        navigatorContent.innerHTML = elementsHTML;
        
        // Initialize drag and drop for navigator items
        this.initNavigatorDragDrop();
    }
    
    getElementIcon(type) {
        const icons = {
            heading: 'fas fa-heading',
            text: 'fas fa-paragraph',
            image: 'fas fa-image',
            button: 'fas fa-mouse-pointer',
            section: 'fas fa-layer-group',
            divider: 'fas fa-minus',
            spacer: 'fas fa-arrows-alt-v'
        };
        return icons[type] || 'fas fa-cube';
    }
    
    getElementPreview(element) {
        switch (element.type) {
            case 'heading':
            case 'text':
            case 'button':
                return element.content.length > 30 ? element.content.substring(0, 30) + '...' : element.content;
            case 'image':
                return element.alt || 'Image';
            default:
                return element.type;
        }
    }
    
    selectElementById(elementId) {
        const element = this.elements.find(e => e.id === elementId);
        if (element) {
            this.selectElement(element);
        }
    }
    
    initNavigatorDragDrop() {
        const navigatorContent = document.getElementById('navigatorContent');
        if (!navigatorContent) return;
        
        let draggedItem = null;
        
        navigatorContent.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('navigator-item')) {
                draggedItem = e.target;
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                console.log('🎯 Navigator drag started:', draggedItem.dataset.elementId);
            }
        });
        
        navigatorContent.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('navigator-item')) {
                e.target.classList.remove('dragging');
                draggedItem = null;
            }
        });
        
        navigatorContent.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const afterElement = this.getDragAfterElement(navigatorContent, e.clientY);
            if (afterElement == null) {
                navigatorContent.appendChild(draggedItem);
            } else {
                navigatorContent.insertBefore(draggedItem, afterElement);
            }
        });
        
        navigatorContent.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedItem) {
                const draggedElementId = draggedItem.dataset.elementId;
                const newIndex = [...navigatorContent.children].indexOf(draggedItem);
                
                console.log('🎯 Reordering element:', draggedElementId, 'to index:', newIndex);
                this.reorderElement(draggedElementId, newIndex);
            }
        });
    }
    
    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.navigator-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
    
    reorderElement(elementId, newIndex) {
        const element = this.elements.find(el => el.id === elementId);
        if (!element) return;
        
        const oldIndex = this.elements.indexOf(element);
        if (oldIndex === newIndex) return;
        
        // Remove from old position
        this.elements.splice(oldIndex, 1);
        // Insert at new position
        this.elements.splice(newIndex, 0, element);
        
        // Update the canvas
        this.renderCanvas();
        this.updateNavigator();
        
        console.log('✅ Element reordered:', element.type, 'from', oldIndex, 'to', newIndex);
    }
    
    toggleElementVisibility(elementId) {
        const element = this.elements.find(el => el.id === elementId);
        if (element) {
            element.visible = element.visible !== false ? false : true;
            this.renderCanvas();
            this.updateNavigator();
            console.log('👁️ Element visibility toggled:', element.type, element.visible);
        }
    }
    
    async publish() {
        if (!this.shop || this.shop === 'unknown.myshopify.com') {
            console.error('❌ Cannot publish - shop not available');
            alert('Error: Shop information not available. Please return to dashboard and try again.');
            return;
        }
        
        console.log('🚀 Publishing page...', { shop: this.shop, pageId: this.pageId });
        
        try {
            // Show loading state
            this.showLoading();
            
            // Generate HTML from elements
            const html = this.generateHTML();
            const css = this.generateCSS();
            
            // Publish to Shopify
            const response = await fetch(`/api/pages/${this.pageId}/publish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shop: this.shop,
                    html: html,
                    css: css,
                    elements: this.elements
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Page published successfully:', result);
                
                // Show success message
                this.showSuccess('Page published successfully!');
                
                // Update publish button state
                const publishBtn = document.getElementById('publishBtn');
                if (publishBtn) {
                    publishBtn.textContent = 'Published';
                    publishBtn.classList.add('published');
                    setTimeout(() => {
                        publishBtn.textContent = 'Publish';
                        publishBtn.classList.remove('published');
                    }, 2000);
                }
                
            } else {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
        } catch (error) {
            console.error('❌ Failed to publish page:', error);
            this.showError('Failed to publish page: ' + error.message);
        } finally {
            this.hideLoading();
        }
    }
    
    generateHTML() {
        // Generate HTML from elements
        let html = '<div class="kingsbuilder-page">';
        
        this.elements.forEach(element => {
            if (element.visible !== false) {
                html += this.elementToHTML(element);
            }
        });
        
        html += '</div>';
        return html;
    }
    
    generateCSS() {
        // Generate CSS from elements
        let css = '.kingsbuilder-page { margin: 0; padding: 20px; }';
        
        this.elements.forEach(element => {
            if (element.styles) {
                css += `#${element.id} { `;
                for (const [property, value] of Object.entries(element.styles)) {
                    css += `${property}: ${value}; `;
                }
                css += '} ';
            }
        });
        
        return css;
    }
    
    elementToHTML(element) {
        switch (element.type) {
            case 'heading':
                return `<h${element.level || 1} id="${element.id}">${element.content || 'Heading'}</h${element.level || 1}>`;
            case 'text':
                return `<p id="${element.id}">${element.content || 'Text'}</p>`;
            case 'image':
                return `<img id="${element.id}" src="${element.src || ''}" alt="${element.alt || ''}">`;
            case 'button':
                return `<button id="${element.id}" onclick="${element.onclick || ''}">${element.content || 'Button'}</button>`;
            default:
                return `<div id="${element.id}">${element.content || ''}</div>`;
        }
    }
    
    showSuccess(message) {
        // Show success notification
        const notification = document.createElement('div');
        notification.className = 'notification success';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    showError(message) {
        // Show error notification
        const notification = document.createElement('div');
        notification.className = 'notification error';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
    
    showLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'flex';
        }
    }
    
    hideLoading() {
        const loadingOverlay = document.getElementById('loadingOverlay');
        if (loadingOverlay) {
            loadingOverlay.style.display = 'none';
        }
    }
    
    showInNavigator(element) {
        if (!this.navigatorVisible) {
            this.toggleNavigator();
        }
        this.updateNavigator();
        
        // Highlight element in navigator
        setTimeout(() => {
            const navigatorItem = document.querySelector(`.navigator-item[onclick*="${element.id}"]`);
            if (navigatorItem) {
                navigatorItem.classList.add('highlight');
                setTimeout(() => navigatorItem.classList.remove('highlight'), 2000);
            }
        }, 100);
    }
    
    makeDraggable(element, handle) {
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;
        
        handle.addEventListener('mousedown', (e) => {
            if (element.classList.contains('docked')) return;
            
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === handle || handle.contains(e.target)) {
                isDragging = true;
                element.style.cursor = 'move';
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                
                xOffset = currentX;
                yOffset = currentY;
                
                element.style.transform = `translate(${currentX}px, ${currentY}px)`;
            }
        });
        
        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                element.style.cursor = '';
            }
        });
    }
    
    initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        e.shiftKey ? this.redo() : this.undo();
                        break;
                    case 'c':
                        e.preventDefault();
                        if (this.selectedElement) {
                            this.copyElement(this.selectedElement);
                        }
                        break;
                    case 'v':
                        e.preventDefault();
                        this.pasteElement();
                        break;
                    case 'd':
                        e.preventDefault();
                        if (this.selectedElement) {
                            this.duplicateElement(this.selectedElement.id);
                        }
                        break;
                    case 's':
                        e.preventDefault();
                        this.savePage();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.preview();
                        break;
                }
            }
            
            if (e.key === 'Delete' && this.selectedElement) {
                e.preventDefault();
                this.deleteElement(this.selectedElement.id);
            }
            
            if (e.key === 'Escape') {
                this.deselectElement();
                document.getElementById('contextMenu').classList.remove('show');
            }
        });
    }
    
    filterElements(searchTerm) {
        const elements = document.querySelectorAll('.element-item');
        elements.forEach(element => {
            const title = element.querySelector('.element-title').textContent.toLowerCase();
            const matches = title.includes(searchTerm.toLowerCase());
            element.style.display = matches ? 'flex' : 'none';
        });
    }
    
    zoomIn() {
        this.zoomLevel = Math.min(this.zoomLevel + 0.1, 2);
        this.updateZoom();
    }
    
    zoomOut() {
        this.zoomLevel = Math.max(this.zoomLevel - 0.1, 0.5);
        this.updateZoom();
    }
    
    updateZoom() {
        const canvas = document.getElementById('kingsbuilder-canvas');
        canvas.style.transform = `scale(${this.zoomLevel})`;
        canvas.style.transformOrigin = 'top center';
        
        document.getElementById('zoomLevel').textContent = `${Math.round(this.zoomLevel * 100)}%`;
    }
    
    saveState() {
        const state = {
            elements: JSON.parse(JSON.stringify(this.elements)),
            timestamp: Date.now()
        };
        
        this.history = this.history.slice(0, this.historyIndex + 1);
        this.history.push(state);
        this.historyIndex++;
        
        // Limit history size
        if (this.history.length > 50) {
            this.history.shift();
            this.historyIndex--;
        }
        
        console.log('💾 State saved', { elements: this.elements.length, historyIndex: this.historyIndex });
    }
    
    undo() {
        if (this.historyIndex > 0) {
            this.historyIndex--;
            const state = this.history[this.historyIndex];
            this.loadState(state);
            console.log('↶ Undo', this.historyIndex);
        }
    }
    
    redo() {
        if (this.historyIndex < this.history.length - 1) {
            this.historyIndex++;
            const state = this.history[this.historyIndex];
            this.loadState(state);
            console.log('↷ Redo', this.historyIndex);
        }
    }
    
    loadState(state) {
        this.elements = JSON.parse(JSON.stringify(state.elements));
        this.renderAllElements();
        this.deselectElement();
        this.updateNavigator();
    }
    
    renderAllElements() {
        const canvasFrame = document.querySelector('.canvas-frame');
        
        // Clear existing elements
        canvasFrame.querySelectorAll('.kb-element').forEach(el => el.remove());
        
        // Check if no elements
        if (this.elements.length === 0) {
            const emptyState = document.querySelector('.empty-canvas');
            if (emptyState) {
                emptyState.style.display = 'block';
            }
            return;
        }
        
        // Hide empty state
        const emptyState = document.querySelector('.empty-canvas');
        if (emptyState) {
            emptyState.style.display = 'none';
        }
        
        // Render all elements
        this.elements.forEach(element => {
            this.renderElement(element);
        });
    }
    
    async preview() {
        console.log('👁️  Preview mode');
        const html = this.generateHTML();
        
        // Open preview in new window
        const previewWindow = window.open('', '_blank', 'width=1200,height=800');
        previewWindow.document.write(html);
        previewWindow.document.close();
    }
    
    async publish() {
        console.log('🚀 Publishing page...');
        this.showLoading();
        
        try {
            const html = this.generateHTML();
            const css = this.generateCSS();
            
            // Get page settings from the correct field IDs
            const pageTitle = document.getElementById('pageTitle')?.value || 'KingsBuilder Page';
            const pageUrl = document.getElementById('pageUrl')?.value || 'kingsbuilder-page';
            const pageStatus = document.getElementById('pageStatus')?.value || 'draft';
            
            // Send to server
            const response = await fetch('/api/pages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({
                    id: this.context.pageId, // Include pageId for existing pages
                    pageId: this.context.pageId, // Also include as pageId
                    title: pageTitle,
                    url: pageUrl,
                    status: pageStatus,
                    html: html,
                    css: css,
                    elements: this.elements,
                    shop: this.getShopOrigin()
                })
            });
            
            if (response.ok) {
                alert('🎉 Page published successfully!');
            } else {
                throw new Error('Failed to publish page');
            }
        } catch (error) {
            console.error('❌ Publish error:', error);
            alert('Failed to publish page. Please try again.');
        } finally {
            this.hideLoading();
        }
    }
    
    generateHTML() {
        let html = `
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${this.getPageTitle()}</title>
                <style>${this.generateCSS()}</style>
            </head>
            <body>
                <div class="kingsbuilder-page">
        `;
        
        this.elements.forEach(element => {
            html += this.getElementPublishHTML(element);
        });
        
        html += `
                </div>
                <div class="kingsbuilder-footer">
                    <p>Created with <strong>KingsBuilder</strong> by <a href="#" target="_blank">Kingsmen Marketing Agency</a></p>
                </div>
            </body>
            </html>
        `;
        
        return html;
    }
    
    getElementPublishHTML(element) {
        const styles = this.stylesToString(element.styles);
        
        switch (element.type) {
            case 'heading':
                return `<${element.tag || 'h2'} style="${styles}">${element.content}</${element.tag || 'h2'}>`;
            case 'text':
                return `<p style="${styles}">${element.content}</p>`;
            case 'image':
                return `<img src="${element.content}" alt="${element.alt || ''}" style="${styles}">`;
            case 'button':
                return `<a href="${element.href || '#'}" style="${styles}">${element.content}</a>`;
            case 'section':
                return `<section style="${styles}">${element.content}</section>`;
            case 'divider':
                return `<hr style="${styles}">`;
            case 'spacer':
                return `<div style="${styles}"></div>`;
            default:
                return '';
        }
    }
    
    generateCSS() {
        return `
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                margin: 0;
                padding: 0;
                line-height: 1.6;
                color: #1a1a1a;
            }
            
            .kingsbuilder-page {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
            }
            
            .kingsbuilder-footer {
                text-align: center;
                padding: 20px;
                margin-top: 40px;
                border-top: 1px solid #e5e7eb;
                font-size: 14px;
                color: #6b7280;
            }
            
            .kingsbuilder-footer a {
                color: #000000;
                text-decoration: none;
                font-weight: 600;
            }
            
            .kingsbuilder-footer a:hover {
                text-decoration: underline;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .kingsbuilder-page {
                    padding: 10px;
                }
            }
        `;
    }
    
    stylesToString(styles) {
        return Object.entries(styles)
            .map(([key, value]) => `${this.camelToKebab(key)}: ${value}`)
            .join('; ');
    }
    
    camelToKebab(str) {
        return str.replace(/([A-Z])/g, '-$1').toLowerCase();
    }
    
    getPageTitle() {
        const titleInput = document.getElementById('pageTitle');
        return titleInput?.value || 'KingsBuilder Page';
    }
    
    getShopOrigin() {
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');
        
        if (shop) {
            return shop.includes('.') ? shop : `${shop}.myshopify.com`;
        }
        
        try {
            return window.parent.location.hostname;
        } catch (e) {
            return 'unknown.myshopify.com';
        }
    }
    
    async savePage() {
        console.log('💾 Auto-saving page...');
        // Implement auto-save functionality
    }
    
    async loadPageData() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageId = urlParams.get('pageId');
        const pageTitle = urlParams.get('title');
        const shop = urlParams.get('shop');
        
        if (pageId && pageId !== 'new') {
            console.log('📂 Loading page data for ID:', pageId);
            
            try {
                // Set page title in the properties panel
                if (pageTitle) {
                    const titleInput = document.getElementById('pageTitle');
                    if (titleInput) {
                        titleInput.value = decodeURIComponent(pageTitle);
                    }
                }
                
                // Load page content from Shopify
                const response = await fetch(`/api/shopify/pages/${pageId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include'
                });
                
                if (response.ok) {
                    const data = await response.json();
                    const page = data.page;
                    
                    console.log('✅ Loaded page data:', page);
                    
                    // Set the page title and content
                    if (page.title) {
                        const titleInput = document.getElementById('pageTitle');
                        if (titleInput) {
                            titleInput.value = page.title;
                        }
                    }
                    
                    // Set page content
                    if (page.body_html) {
                        const canvas = document.getElementById('kingsbuilder-canvas');
                        if (canvas) {
                            canvas.innerHTML = page.body_html;
                        }
                    }
                    
                    // Set page handle
                    if (page.handle) {
                        const handleInput = document.getElementById('pageUrl');
                        if (handleInput) {
                            handleInput.value = page.handle;
                        }
                    }
                    
                    // Set page status
                    if (page.published_at) {
                        const statusSelect = document.getElementById('pageStatus');
                        if (statusSelect) {
                            statusSelect.value = page.published_at ? 'published' : 'draft';
                        }
                    }
                    
                    console.log('📄 Page loaded successfully');
                } else {
                    console.error('❌ Failed to load page data:', response.status);
                }
            } catch (error) {
                console.error('❌ Error loading page data:', error);
            }
        } else {
            console.log('📝 Creating new page');
            // For new pages, just set default values
            const titleInput = document.getElementById('pageTitle');
            if (titleInput && pageTitle) {
                titleInput.value = decodeURIComponent(pageTitle);
            }
        }
        
        // Save initial state
        this.saveState();
    }
    
    exit() {
        if (confirm('Are you sure you want to exit? Any unsaved changes will be lost.')) {
            window.location.href = '/dashboard';
        }
    }
    
    showLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.classList.add('active');
        }
        this.isLoading = true;
    }
    
    hideLoading() {
        const loading = document.getElementById('loadingOverlay');
        if (loading) {
            loading.classList.remove('active');
        }
        this.isLoading = false;
    }
    
    hexFromRgb(rgb) {
        if (!rgb || rgb.startsWith('#')) return rgb || '#000000';
        
        const match = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (!match) return '#000000';
        
        const [, r, g, b] = match;
        return '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    }
    
    showQuickStart() {
        // Show a quick start tutorial or guide
        alert('Welcome to KingsBuilder! Drag elements from the left panel to start building your page.');
    }
}

// Initialize KingsBuilder when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing KingsBuilder - Visual Page Builder...');
    console.log('🏢 Created by Kingsmen Marketing Agency');
    window.kingsBuilder = new KingsBuilder();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KingsBuilder;
}