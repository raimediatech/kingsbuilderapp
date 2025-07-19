// Canvas and Drag-Drop Fix for KingsBuilder
console.log('🎯 Loading Canvas & Drag-Drop Fix...');

class CanvasDragDropFix {
    constructor() {
        this.canvas = null;
        this.isInitialized = false;
        this.draggedElement = null;
        this.dropZones = [];
    }

    // Find or create the canvas area
    initializeCanvas() {
        console.log('🎨 Initializing canvas area...');
        
        // Try to find existing canvas/preview area
        let canvas = document.getElementById('kingsbuilder-preview') ||
                    document.getElementById('canvas') ||
                    document.querySelector('.kingsbuilder-preview') ||
                    document.querySelector('.canvas-area') ||
                    document.querySelector('.preview-area') ||
                    document.querySelector('#preview-frame');
        
        if (!canvas) {
            console.log('🔧 Canvas not found, creating new canvas area...');
            
            // Find the main editor wrapper
            const editorWrapper = document.getElementById('kingsbuilder-editor-wrapper') ||
                                 document.querySelector('.kingsbuilder-editor-wrapper') ||
                                 document.body;
            
            // Create canvas area
            canvas = document.createElement('div');
            canvas.id = 'kingsbuilder-preview';
            canvas.className = 'kingsbuilder-preview canvas-area';
            
            // Add canvas HTML structure
            canvas.innerHTML = `
                <div class="canvas-header">
                    <div class="canvas-title">
                        <span>📄 Page Canvas</span>
                        <div class="canvas-actions">
                            <button class="canvas-btn" onclick="window.CanvasFix.clearCanvas()" title="Clear Canvas">
                                🗑️ Clear
                            </button>
                            <button class="canvas-btn" onclick="window.CanvasFix.saveCanvas()" title="Save Page">
                                💾 Save
                            </button>
                        </div>
                    </div>
                </div>
                <div class="canvas-content" id="canvas-content">
                    <div class="canvas-drop-zone" id="main-drop-zone">
                        <div class="empty-canvas-message">
                            <div class="empty-icon">📄</div>
                            <h3>Start Building Your Page</h3>
                            <p>Drag elements from the left panel to start building your page</p>
                            <div class="canvas-guide">
                                <div class="guide-item">
                                    <span>1️⃣</span> Choose an element from the left panel
                                </div>
                                <div class="guide-item">
                                    <span>2️⃣</span> Drag it to this canvas area
                                </div>
                                <div class="guide-item">
                                    <span>3️⃣</span> Click to edit and customize
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            
            // Add canvas to the right side of the editor
            if (editorWrapper.id === 'kingsbuilder-editor-wrapper') {
                editorWrapper.appendChild(canvas);
            } else {
                // Create proper structure
                const newWrapper = document.createElement('div');
                newWrapper.id = 'kingsbuilder-editor-wrapper';
                newWrapper.className = 'kingsbuilder-editor-wrapper';
                
                // Move existing content to wrapper
                while (editorWrapper.firstChild) {
                    newWrapper.appendChild(editorWrapper.firstChild);
                }
                
                // Add canvas
                newWrapper.appendChild(canvas);
                editorWrapper.appendChild(newWrapper);
            }
        }
        
        this.canvas = canvas;
        this.setupCanvasStyles();
        console.log('✅ Canvas area initialized');
        return canvas;
    }

    // Add canvas styles
    setupCanvasStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* Canvas Area Styles */
            .kingsbuilder-preview {
                position: fixed;
                top: 0;
                right: 0;
                width: calc(100% - 320px);
                height: 100vh;
                background: #f8f9fa;
                border-left: 1px solid #e1e5e9;
                z-index: 100;
                display: flex;
                flex-direction: column;
            }
            
            .canvas-header {
                background: white;
                border-bottom: 1px solid #e1e5e9;
                padding: 12px 20px;
                display: flex;
                align-items: center;
                justify-content: space-between;
                min-height: 50px;
            }
            
            .canvas-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                font-weight: 600;
                color: #1a1a1a;
            }
            
            .canvas-actions {
                display: flex;
                gap: 8px;
            }
            
            .canvas-btn {
                background: #007cba;
                color: white;
                border: none;
                padding: 6px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: background 0.2s;
            }
            
            .canvas-btn:hover {
                background: #005a87;
            }
            
            .canvas-content {
                flex: 1;
                overflow-y: auto;
                padding: 20px;
            }
            
            .canvas-drop-zone {
                min-height: calc(100vh - 120px);
                border: 2px dashed #d1d5db;
                border-radius: 8px;
                position: relative;
                background: white;
                transition: all 0.3s ease;
            }
            
            .canvas-drop-zone.drag-over {
                border-color: #007cba;
                background: #f0f8ff;
                border-style: solid;
            }
            
            .empty-canvas-message {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                text-align: center;
                color: #6b7280;
                max-width: 400px;
                width: 100%;
            }
            
            .empty-icon {
                font-size: 48px;
                margin-bottom: 16px;
            }
            
            .empty-canvas-message h3 {
                color: #374151;
                margin-bottom: 8px;
                font-size: 20px;
            }
            
            .empty-canvas-message p {
                margin-bottom: 24px;
                font-size: 16px;
            }
            
            .canvas-guide {
                display: flex;
                flex-direction: column;
                gap: 12px;
                text-align: left;
            }
            
            .guide-item {
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 8px 12px;
                background: #f9fafb;
                border-radius: 6px;
                font-size: 14px;
            }
            
            .guide-item span {
                font-size: 16px;
            }
            
            /* Dropped Elements */
            .canvas-element {
                margin: 10px 0;
                padding: 15px;
                border: 1px solid #e1e5e9;
                border-radius: 6px;
                background: white;
                cursor: pointer;
                transition: all 0.2s ease;
                position: relative;
            }
            
            .canvas-element:hover {
                border-color: #007cba;
                box-shadow: 0 2px 8px rgba(0, 124, 186, 0.1);
            }
            
            .canvas-element.selected {
                border-color: #007cba;
                box-shadow: 0 0 0 2px rgba(0, 124, 186, 0.2);
            }
            
            .canvas-element .element-controls {
                position: absolute;
                top: -30px;
                right: 0;
                display: none;
                gap: 4px;
            }
            
            .canvas-element:hover .element-controls {
                display: flex;
            }
            
            .element-control-btn {
                background: #007cba;
                color: white;
                border: none;
                width: 24px;
                height: 24px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .element-control-btn:hover {
                background: #005a87;
            }
            
            /* Mobile Responsive */
            @media (max-width: 1024px) {
                .kingsbuilder-preview {
                    width: 100%;
                    left: 0;
                    top: 60px;
                    height: calc(100vh - 60px);
                }
            }
            
            /* Hide empty message when canvas has content */
            .canvas-drop-zone:not(:empty) .empty-canvas-message {
                display: none;
            }
            
            .canvas-drop-zone.has-elements .empty-canvas-message {
                display: none;
            }
        `;
        
        document.head.appendChild(style);
        console.log('✅ Canvas styles applied');
    }

    // Setup drag and drop functionality
    setupDragDrop() {
        console.log('🔄 Setting up drag and drop...');
        
        // Find all draggable elements
        const draggableElements = document.querySelectorAll('[draggable="true"], .element-item');
        
        draggableElements.forEach(element => {
            // Remove existing listeners to avoid duplicates
            element.removeEventListener('dragstart', this.handleDragStart);
            element.removeEventListener('dragend', this.handleDragEnd);
            
            // Add drag event listeners
            element.addEventListener('dragstart', this.handleDragStart.bind(this));
            element.addEventListener('dragend', this.handleDragEnd.bind(this));
            
            // Ensure element is draggable
            element.draggable = true;
            element.style.cursor = 'grab';
        });
        
        // Setup drop zones
        const dropZone = document.getElementById('main-drop-zone') || 
                        document.querySelector('.canvas-drop-zone');
        
        if (dropZone) {
            dropZone.addEventListener('dragover', this.handleDragOver.bind(this));
            dropZone.addEventListener('drop', this.handleDrop.bind(this));
            dropZone.addEventListener('dragenter', this.handleDragEnter.bind(this));
            dropZone.addEventListener('dragleave', this.handleDragLeave.bind(this));
        }
        
        console.log(`✅ Drag-drop setup complete for ${draggableElements.length} elements`);
    }

    // Drag event handlers
    handleDragStart(e) {
        console.log('🎯 Drag started:', e.target);
        
        this.draggedElement = e.target;
        e.target.style.opacity = '0.5';
        e.target.style.cursor = 'grabbing';
        
        // Get element type
        const elementType = e.target.dataset.element || 
                           e.target.querySelector('.element-title')?.textContent?.toLowerCase() ||
                           'unknown';
        
        e.dataTransfer.setData('text/plain', elementType);
        e.dataTransfer.effectAllowed = 'copy';
        
        console.log(`📦 Dragging element type: ${elementType}`);
    }

    handleDragEnd(e) {
        console.log('🎯 Drag ended');
        e.target.style.opacity = '1';
        e.target.style.cursor = 'grab';
        this.draggedElement = null;
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    }

    handleDragEnter(e) {
        e.preventDefault();
        e.target.classList.add('drag-over');
    }

    handleDragLeave(e) {
        e.target.classList.remove('drag-over');
    }

    handleDrop(e) {
        e.preventDefault();
        e.target.classList.remove('drag-over');
        
        const elementType = e.dataTransfer.getData('text/plain');
        console.log(`🎯 Dropped element: ${elementType}`);
        
        this.createElement(elementType, e.target);
    }

    // Create element on canvas
    createElement(elementType, dropZone) {
        console.log(`🔧 Creating element: ${elementType}`);
        
        const elementId = 'element_' + Date.now();
        let elementHTML = '';
        
        // Define element templates
        const elementTemplates = {
            'heading': `<h2 contenteditable="true" class="editable-heading">Your Heading Here</h2>`,
            'paragraph': `<p contenteditable="true" class="editable-text">Your paragraph text here. Click to edit this content.</p>`,
            'button': `<button class="editable-button" contenteditable="true">Click Me</button>`,
            'image': `<div class="image-placeholder">
                        <div class="image-icon">🖼️</div>
                        <p>Click to add image</p>
                        <input type="file" accept="image/*" style="display:none;" onchange="window.CanvasFix.handleImageUpload(this)">
                      </div>`,
            'container': `<div class="container-element" style="padding: 20px; border: 1px dashed #ccc;">
                           <p contenteditable="true">Container - Add content here</p>
                         </div>`,
            'spacer': `<div class="spacer-element" style="height: 40px; background: repeating-linear-gradient(90deg, transparent, transparent 10px, #f0f0f0 10px, #f0f0f0 20px);"></div>`,
            'divider': `<hr class="divider-element" style="border: 1px solid #e1e5e9; margin: 20px 0;">`,
            'list': `<ul contenteditable="true" class="editable-list">
                       <li>List item 1</li>
                       <li>List item 2</li>
                       <li>List item 3</li>
                     </ul>`,
            'unknown': `<div contenteditable="true" class="generic-element">
                         <p>New Element - Click to edit</p>
                       </div>`
        };
        
        elementHTML = elementTemplates[elementType] || elementTemplates['unknown'];
        
        // Create element wrapper
        const elementWrapper = document.createElement('div');
        elementWrapper.className = 'canvas-element';
        elementWrapper.id = elementId;
        elementWrapper.innerHTML = `
            <div class="element-controls">
                <button class="element-control-btn" onclick="window.CanvasFix.moveElementUp('${elementId}')" title="Move Up">↑</button>
                <button class="element-control-btn" onclick="window.CanvasFix.moveElementDown('${elementId}')" title="Move Down">↓</button>
                <button class="element-control-btn" onclick="window.CanvasFix.duplicateElement('${elementId}')" title="Duplicate">📋</button>
                <button class="element-control-btn" onclick="window.CanvasFix.deleteElement('${elementId}')" title="Delete">🗑️</button>
            </div>
            ${elementHTML}
        `;
        
        // Add click handler for selection
        elementWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(elementWrapper);
        });
        
        // Add to canvas
        dropZone.appendChild(elementWrapper);
        dropZone.classList.add('has-elements');
        
        // Select the new element
        this.selectElement(elementWrapper);
        
        console.log(`✅ Created ${elementType} element with ID: ${elementId}`);
        
        // Auto-save
        setTimeout(() => this.autoSave(), 1000);
    }

    // Element management functions
    selectElement(element) {
        // Remove previous selection
        document.querySelectorAll('.canvas-element.selected').forEach(el => {
            el.classList.remove('selected');
        });
        
        // Select current element
        element.classList.add('selected');
        
        console.log('🎯 Selected element:', element.id);
        
        // Show properties panel if available
        if (window.showElementProperties) {
            window.showElementProperties(element);
        }
    }

    moveElementUp(elementId) {
        const element = document.getElementById(elementId);
        const prev = element.previousElementSibling;
        if (prev && prev.classList.contains('canvas-element')) {
            element.parentNode.insertBefore(element, prev);
            this.autoSave();
        }
    }

    moveElementDown(elementId) {
        const element = document.getElementById(elementId);
        const next = element.nextElementSibling;
        if (next && next.classList.contains('canvas-element')) {
            element.parentNode.insertBefore(next, element);
            this.autoSave();
        }
    }

    duplicateElement(elementId) {
        const element = document.getElementById(elementId);
        const clone = element.cloneNode(true);
        clone.id = 'element_' + Date.now();
        
        // Update control buttons in clone
        const controls = clone.querySelector('.element-controls');
        if (controls) {
            controls.innerHTML = controls.innerHTML.replace(new RegExp(elementId, 'g'), clone.id);
        }
        
        element.parentNode.insertBefore(clone, element.nextSibling);
        this.autoSave();
    }

    deleteElement(elementId) {
        const element = document.getElementById(elementId);
        if (confirm('Delete this element?')) {
            element.remove();
            
            // Check if canvas is empty
            const dropZone = document.getElementById('main-drop-zone');
            const elements = dropZone.querySelectorAll('.canvas-element');
            if (elements.length === 0) {
                dropZone.classList.remove('has-elements');
            }
            
            this.autoSave();
        }
    }

    // Canvas management
    clearCanvas() {
        if (confirm('Clear all content from canvas?')) {
            const dropZone = document.getElementById('main-drop-zone');
            const elements = dropZone.querySelectorAll('.canvas-element');
            elements.forEach(el => el.remove());
            dropZone.classList.remove('has-elements');
            console.log('🗑️ Canvas cleared');
        }
    }

    saveCanvas() {
        const dropZone = document.getElementById('main-drop-zone');
        const content = dropZone.innerHTML;
        
        console.log('💾 Saving canvas content...');
        
        // Save to localStorage as backup
        localStorage.setItem('kingsbuilder_canvas_backup', content);
        
        // Save to server if possible
        if (window.BuilderContentFix && window.BuilderContentFix.savePage) {
            window.BuilderContentFix.savePage();
        }
        
        // Show success message
        this.showMessage('✅ Canvas saved successfully!', 'success');
    }

    autoSave() {
        // Auto-save every change
        setTimeout(() => {
            const dropZone = document.getElementById('main-drop-zone');
            if (dropZone) {
                const content = dropZone.innerHTML;
                localStorage.setItem('kingsbuilder_canvas_autosave', content);
                console.log('💾 Auto-saved canvas content');
            }
        }, 500);
    }

    // Load saved content
    loadSavedContent() {
        console.log('📄 Loading saved content...');
        
        // Try to load from localStorage first
        const savedContent = localStorage.getItem('kingsbuilder_canvas_autosave') ||
                            localStorage.getItem('kingsbuilder_canvas_backup');
        
        if (savedContent) {
            const dropZone = document.getElementById('main-drop-zone');
            if (dropZone) {
                dropZone.innerHTML = savedContent;
                dropZone.classList.add('has-elements');
                
                // Re-attach event listeners
                this.reattachEventListeners();
                
                console.log('✅ Loaded saved content from localStorage');
                return true;
            }
        }
        
        return false;
    }

    // Re-attach event listeners to loaded elements
    reattachEventListeners() {
        const elements = document.querySelectorAll('.canvas-element');
        elements.forEach(element => {
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectElement(element);
            });
        });
    }

    // Show message
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `canvas-message canvas-message-${type}`;
        messageDiv.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            .canvas-message {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                color: white;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            .canvas-message-success { background: #10b981; }
            .canvas-message-error { background: #ef4444; }
            .canvas-message-info { background: #3b82f6; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(messageDiv);
        
        setTimeout(() => messageDiv.remove(), 3000);
    }

    // Handle image upload
    handleImageUpload(input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                
                const placeholder = input.closest('.image-placeholder');
                placeholder.replaceWith(img);
                
                this.autoSave();
            };
            reader.readAsDataURL(file);
        }
    }

    // Initialize everything
    initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing Canvas & Drag-Drop Fix...');
        
        // Initialize canvas
        this.initializeCanvas();
        
        // Setup drag and drop
        setTimeout(() => {
            this.setupDragDrop();
            
            // Load saved content
            this.loadSavedContent();
            
            this.isInitialized = true;
            console.log('✅ Canvas & Drag-Drop Fix initialized successfully');
        }, 1000);
    }
}

// Create global instance
const canvasFix = new CanvasDragDropFix();

// Export for global access
window.CanvasFix = {
    initialize: () => canvasFix.initialize(),
    clearCanvas: () => canvasFix.clearCanvas(),
    saveCanvas: () => canvasFix.saveCanvas(),
    moveElementUp: (id) => canvasFix.moveElementUp(id),
    moveElementDown: (id) => canvasFix.moveElementDown(id),
    duplicateElement: (id) => canvasFix.duplicateElement(id),
    deleteElement: (id) => canvasFix.deleteElement(id),
    handleImageUpload: (input) => canvasFix.handleImageUpload(input)
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        canvasFix.initialize();
    });
} else {
    canvasFix.initialize();
}

console.log('✅ Canvas & Drag-Drop Fix loaded');