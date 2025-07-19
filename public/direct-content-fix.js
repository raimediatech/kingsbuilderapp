// DIRECT CONTENT FIX - Load Shopify page content immediately
console.log('🎯 DIRECT CONTENT FIX - Loading...');

class DirectContentFix {
    constructor() {
        this.pageData = null;
        this.isBuilder = window.location.pathname.includes('builder');
        this.isDashboard = window.location.pathname.includes('dashboard');
    }

    // Get URL parameters
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            shop: urlParams.get('shop') || 'kingsbuilder.myshopify.com',
            page: urlParams.get('page') || urlParams.get('pageId'),
            embedded: urlParams.get('embedded'),
            host: urlParams.get('host')
        };
    }

    // DIRECT API call to get page content
    async getPageContent(pageId, shop) {
        try {
            console.log(`🔥 DIRECT API CALL: /api/pages/${pageId}?shop=${shop}`);
            
            const response = await fetch(`/api/pages/${pageId}?shop=${encodeURIComponent(shop)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log(`📡 API Response Status: ${response.status}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ API Response Data:', data);
            
            return data;
            
        } catch (error) {
            console.error('❌ DIRECT API ERROR:', error);
            throw error;
        }
    }

    // Create working canvas area
    createWorkingCanvas() {
        console.log('🎨 Creating working canvas...');
        
        // Remove any existing canvas
        const existingCanvas = document.querySelector('.working-canvas');
        if (existingCanvas) {
            existingCanvas.remove();
        }
        
        // Create new canvas
        const canvas = document.createElement('div');
        canvas.className = 'working-canvas';
        canvas.innerHTML = `
            <div class="canvas-header">
                <h3>📄 Page Editor</h3>
                <div class="canvas-controls">
                    <button onclick="window.DirectContentFix.saveContent()" class="save-btn">💾 Save</button>
                    <button onclick="window.DirectContentFix.clearContent()" class="clear-btn">🗑️ Clear</button>
                </div>
            </div>
            <div class="canvas-content" id="working-canvas-content">
                <div class="loading-message">
                    <div class="spinner">⟳</div>
                    <p>Loading page content...</p>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .working-canvas {
                position: fixed;
                top: 0;
                right: 0;
                width: 60%;
                height: 100vh;
                background: white;
                border-left: 2px solid #007cba;
                z-index: 1000;
                display: flex;
                flex-direction: column;
            }
            
            .canvas-header {
                background: #007cba;
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .canvas-header h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .canvas-controls {
                display: flex;
                gap: 10px;
            }
            
            .save-btn, .clear-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: 1px solid rgba(255,255,255,0.3);
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .save-btn:hover, .clear-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            
            .canvas-content {
                flex: 1;
                padding: 20px;
                overflow-y: auto;
                background: #f8f9fa;
            }
            
            .loading-message {
                text-align: center;
                padding: 60px 20px;
                color: #666;
            }
            
            .spinner {
                font-size: 32px;
                animation: spin 1s linear infinite;
                margin-bottom: 15px;
            }
            
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            
            .page-element {
                background: white;
                margin: 10px 0;
                padding: 15px;
                border-radius: 6px;
                border: 1px solid #e1e5e9;
                position: relative;
            }
            
            .page-element:hover {
                border-color: #007cba;
                box-shadow: 0 2px 8px rgba(0,124,186,0.1);
            }
            
            .element-controls {
                position: absolute;
                top: -35px;
                right: 0;
                display: none;
                gap: 5px;
            }
            
            .page-element:hover .element-controls {
                display: flex;
            }
            
            .control-btn {
                background: #007cba;
                color: white;
                border: none;
                width: 28px;
                height: 28px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            
            .control-btn:hover {
                background: #005a87;
            }
            
            .editable-content {
                min-height: 20px;
                outline: none;
                border: 1px dashed transparent;
                padding: 5px;
                border-radius: 3px;
            }
            
            .editable-content:focus {
                border-color: #007cba;
                background: #f0f8ff;
            }
            
            .empty-canvas {
                text-align: center;
                padding: 80px 20px;
                color: #999;
            }
            
            .empty-canvas h3 {
                color: #666;
                margin-bottom: 10px;
            }
            
            @media (max-width: 1024px) {
                .working-canvas {
                    width: 100%;
                    top: 60px;
                    height: calc(100vh - 60px);
                }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(canvas);
        
        console.log('✅ Working canvas created');
        return canvas;
    }

    // Load content into canvas
    async loadContentIntoCanvas(pageData) {
        console.log('📄 Loading content into canvas...', pageData);
        
        const canvasContent = document.getElementById('working-canvas-content');
        if (!canvasContent) {
            console.error('❌ Canvas content area not found');
            return;
        }
        
        // Clear loading message
        canvasContent.innerHTML = '';
        
        if (pageData && pageData.page && pageData.page.body_html) {
            const content = pageData.page.body_html;
            console.log('📝 Page content found:', content.substring(0, 200) + '...');
            
            // Parse HTML content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = content;
            
            // Convert to editable elements
            const elements = Array.from(tempDiv.children);
            
            if (elements.length === 0) {
                // If no block elements, treat as single paragraph
                this.createEditableElement('paragraph', content, canvasContent);
            } else {
                // Convert each element
                elements.forEach((element, index) => {
                    this.createEditableElement(this.getElementType(element), element.outerHTML, canvasContent, index);
                });
            }
            
            console.log(`✅ Loaded ${elements.length || 1} elements into canvas`);
            
        } else {
            console.log('📝 No content found, showing empty state');
            canvasContent.innerHTML = `
                <div class="empty-canvas">
                    <h3>📄 Empty Page</h3>
                    <p>This page doesn't have any content yet.</p>
                    <p>Start typing below to add content:</p>
                    <div class="editable-content" contenteditable="true" placeholder="Start typing here...">
                        Click here to start writing...
                    </div>
                </div>
            `;
        }
    }

    // Get element type from HTML element
    getElementType(element) {
        const tagName = element.tagName.toLowerCase();
        
        switch (tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                return 'heading';
            case 'p':
                return 'paragraph';
            case 'img':
                return 'image';
            case 'ul':
            case 'ol':
                return 'list';
            case 'blockquote':
                return 'quote';
            case 'hr':
                return 'divider';
            default:
                return 'content';
        }
    }

    // Create editable element
    createEditableElement(type, content, container, index = 0) {
        const elementId = `element_${Date.now()}_${index}`;
        
        const elementDiv = document.createElement('div');
        elementDiv.className = 'page-element';
        elementDiv.id = elementId;
        
        // Create controls
        const controls = document.createElement('div');
        controls.className = 'element-controls';
        controls.innerHTML = `
            <button class="control-btn" onclick="window.DirectContentFix.moveUp('${elementId}')" title="Move Up">↑</button>
            <button class="control-btn" onclick="window.DirectContentFix.moveDown('${elementId}')" title="Move Down">↓</button>
            <button class="control-btn" onclick="window.DirectContentFix.duplicate('${elementId}')" title="Duplicate">📋</button>
            <button class="control-btn" onclick="window.DirectContentFix.deleteElement('${elementId}')" title="Delete">🗑️</button>
        `;
        
        // Create content area
        const contentDiv = document.createElement('div');
        contentDiv.className = 'editable-content';
        contentDiv.contentEditable = true;
        contentDiv.innerHTML = content;
        
        // Add auto-save on edit
        contentDiv.addEventListener('input', () => {
            this.autoSave();
        });
        
        elementDiv.appendChild(controls);
        elementDiv.appendChild(contentDiv);
        container.appendChild(elementDiv);
    }

    // Element management functions
    moveUp(elementId) {
        const element = document.getElementById(elementId);
        const prev = element.previousElementSibling;
        if (prev && prev.classList.contains('page-element')) {
            element.parentNode.insertBefore(element, prev);
            this.autoSave();
        }
    }

    moveDown(elementId) {
        const element = document.getElementById(elementId);
        const next = element.nextElementSibling;
        if (next && next.classList.contains('page-element')) {
            element.parentNode.insertBefore(next, element);
            this.autoSave();
        }
    }

    duplicate(elementId) {
        const element = document.getElementById(elementId);
        const clone = element.cloneNode(true);
        clone.id = `element_${Date.now()}_dup`;
        
        // Update control buttons
        const controls = clone.querySelector('.element-controls');
        controls.innerHTML = controls.innerHTML.replace(new RegExp(elementId, 'g'), clone.id);
        
        element.parentNode.insertBefore(clone, element.nextSibling);
        this.autoSave();
    }

    deleteElement(elementId) {
        if (confirm('Delete this element?')) {
            const element = document.getElementById(elementId);
            element.remove();
            this.autoSave();
        }
    }

    // Save content
    async saveContent() {
        const params = this.getUrlParams();
        if (!params.page || !params.shop) {
            alert('No page ID found to save');
            return;
        }

        try {
            console.log('💾 Saving content...');
            
            // Get all content
            const canvasContent = document.getElementById('working-canvas-content');
            const elements = canvasContent.querySelectorAll('.page-element .editable-content');
            
            let htmlContent = '';
            elements.forEach(element => {
                htmlContent += element.innerHTML + '\n';
            });
            
            // If no elements, get the empty canvas content
            if (elements.length === 0) {
                const emptyContent = canvasContent.querySelector('.editable-content');
                if (emptyContent) {
                    htmlContent = `<p>${emptyContent.innerHTML}</p>`;
                }
            }
            
            console.log('📝 Saving HTML content:', htmlContent);
            
            // Save to API
            const response = await fetch(`/api/pages/${params.page}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    shop: params.shop,
                    content: htmlContent
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Content saved successfully:', result);
                
                // Show success message
                this.showMessage('✅ Content saved successfully!', 'success');
            } else {
                throw new Error(`Save failed: ${response.status}`);
            }
            
        } catch (error) {
            console.error('❌ Save error:', error);
            this.showMessage(`❌ Save failed: ${error.message}`, 'error');
        }
    }

    // Clear content
    clearContent() {
        if (confirm('Clear all content?')) {
            const canvasContent = document.getElementById('working-canvas-content');
            canvasContent.innerHTML = `
                <div class="empty-canvas">
                    <h3>📄 Empty Page</h3>
                    <p>Start typing below to add content:</p>
                    <div class="editable-content" contenteditable="true">
                        Click here to start writing...
                    </div>
                </div>
            `;
        }
    }

    // Auto-save
    autoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            console.log('💾 Auto-saving...');
            this.saveContent();
        }, 3000);
    }

    // Show message
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        
        const style = document.createElement('style');
        style.textContent = `
            .message {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 20px;
                border-radius: 6px;
                color: white;
                z-index: 10000;
                animation: slideIn 0.3s ease;
            }
            .message-success { background: #10b981; }
            .message-error { background: #ef4444; }
            .message-info { background: #3b82f6; }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(messageDiv);
        
        setTimeout(() => messageDiv.remove(), 3000);
    }

    // Initialize for builder
    async initializeBuilder() {
        console.log('🎯 Initializing DIRECT CONTENT FIX for builder...');
        
        const params = this.getUrlParams();
        console.log('📋 Builder URL params:', params);
        
        // Create working canvas
        this.createWorkingCanvas();
        
        // If we have page ID, load content
        if (params.page && params.shop) {
            try {
                console.log(`🔥 Loading page ${params.page} from shop ${params.shop}`);
                
                const pageData = await this.getPageContent(params.page, params.shop);
                await this.loadContentIntoCanvas(pageData);
                
            } catch (error) {
                console.error('❌ Failed to load page content:', error);
                
                // Show error and empty canvas
                const canvasContent = document.getElementById('working-canvas-content');
                canvasContent.innerHTML = `
                    <div class="empty-canvas">
                        <h3>⚠️ Failed to Load Page</h3>
                        <p>Error: ${error.message}</p>
                        <p>Start typing below to create new content:</p>
                        <div class="editable-content" contenteditable="true">
                            Click here to start writing...
                        </div>
                        <button onclick="window.DirectContentFix.retryLoad()" style="margin-top: 15px; padding: 8px 16px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer;">
                            🔄 Retry Loading
                        </button>
                    </div>
                `;
            }
        } else {
            console.log('ℹ️ No page ID, showing empty canvas');
            await this.loadContentIntoCanvas(null);
        }
        
        console.log('✅ DIRECT CONTENT FIX initialized for builder');
    }

    // Retry loading
    async retryLoad() {
        const params = this.getUrlParams();
        if (params.page && params.shop) {
            const canvasContent = document.getElementById('working-canvas-content');
            canvasContent.innerHTML = `
                <div class="loading-message">
                    <div class="spinner">⟳</div>
                    <p>Retrying to load page content...</p>
                </div>
            `;
            
            try {
                const pageData = await this.getPageContent(params.page, params.shop);
                await this.loadContentIntoCanvas(pageData);
            } catch (error) {
                console.error('❌ Retry failed:', error);
                this.showMessage(`❌ Retry failed: ${error.message}`, 'error');
            }
        }
    }

    // Initialize
    initialize() {
        console.log('🚀 DIRECT CONTENT FIX - Starting initialization...');
        
        if (this.isBuilder) {
            // Wait a bit for page to load, then initialize builder
            setTimeout(() => {
                this.initializeBuilder();
            }, 1000);
        } else {
            console.log('ℹ️ Not on builder page, skipping initialization');
        }
    }
}

// Create global instance
const directContentFix = new DirectContentFix();

// Export for global access
window.DirectContentFix = {
    initialize: () => directContentFix.initialize(),
    saveContent: () => directContentFix.saveContent(),
    clearContent: () => directContentFix.clearContent(),
    moveUp: (id) => directContentFix.moveUp(id),
    moveDown: (id) => directContentFix.moveDown(id),
    duplicate: (id) => directContentFix.duplicate(id),
    deleteElement: (id) => directContentFix.deleteElement(id),
    retryLoad: () => directContentFix.retryLoad()
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        directContentFix.initialize();
    });
} else {
    directContentFix.initialize();
}

console.log('✅ DIRECT CONTENT FIX loaded');