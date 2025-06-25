// KingsBuilder Page Builder JavaScript

class KingsBuilder {
    constructor() {
        this.currentDevice = 'desktop';
        this.selectedElement = null;
        this.widgets = [];
        this.history = [];
        this.historyIndex = -1;
        this.zoomLevel = 1;
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        console.log('🎯 KingsBuilder Page Builder Initializing...');
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Initialize drag and drop
        this.initDragAndDrop();
        
        // Initialize Shopify App Bridge if available
        this.initShopifyBridge();
        
        // Load page data if editing existing page
        this.loadPageData();
        
        console.log('✅ KingsBuilder Page Builder Ready!');
    }
    
    initEventListeners() {
        // Device selector
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const device = e.target.getAttribute('data-device');
                this.switchDevice(device);
            });
        });
        
        // Toolbar buttons
        const undoBtn = document.getElementById('undoBtn');
        const redoBtn = document.getElementById('redoBtn');
        const zoomInBtn = document.getElementById('zoomInBtn');
        const zoomOutBtn = document.getElementById('zoomOutBtn');
        const previewBtn = document.getElementById('previewBtn');
        const publishBtn = document.getElementById('publishBtn');
        const exitBtn = document.getElementById('exitBtn');
        
        if (undoBtn) undoBtn.addEventListener('click', () => this.undo());
        if (redoBtn) redoBtn.addEventListener('click', () => this.redo());
        if (zoomInBtn) zoomInBtn.addEventListener('click', () => this.zoomIn());
        if (zoomOutBtn) zoomOutBtn.addEventListener('click', () => this.zoomOut());
        if (previewBtn) previewBtn.addEventListener('click', () => this.preview());
        if (publishBtn) publishBtn.addEventListener('click', () => this.publish());
        if (exitBtn) exitBtn.addEventListener('click', () => this.exit());
        
        // Canvas click handler
        const canvas = document.getElementById('canvas');
        if (canvas) {
            canvas.addEventListener('click', (e) => {
                if (e.target === canvas || e.target.classList.contains('canvas-frame')) {
                    this.deselectElement();
                }
            });
        }
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey || e.metaKey) {
                switch (e.key) {
                    case 'z':
                        e.preventDefault();
                        e.shiftKey ? this.redo() : this.undo();
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
                this.deleteSelectedElement();
            }
        });
    }
    
    initDragAndDrop() {
        // Widget items drag start
        document.querySelectorAll('.widget-item').forEach(item => {
            item.addEventListener('dragstart', (e) => {
                const widgetType = e.target.getAttribute('data-widget');
                e.dataTransfer.setData('text/plain', widgetType);
                e.dataTransfer.effectAllowed = 'copy';
            });
        });
        
        // Canvas drop zones
        const canvasFrame = document.querySelector('.canvas-frame');
        if (canvasFrame) {
            canvasFrame.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
                canvasFrame.classList.add('drag-over');
            });
            
            canvasFrame.addEventListener('dragleave', (e) => {
                if (!canvasFrame.contains(e.relatedTarget)) {
                    canvasFrame.classList.remove('drag-over');
                }
            });
            
            canvasFrame.addEventListener('drop', (e) => {
                e.preventDefault();
                canvasFrame.classList.remove('drag-over');
                
                const widgetType = e.dataTransfer.getData('text/plain');
                const rect = canvasFrame.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                this.addWidget(widgetType, { x, y });
            });
        }
    }
    
    initShopifyBridge() {
        try {
            // Check if we're inside Shopify admin
            if (window.parent !== window) {
                console.log('📱 Running inside Shopify Admin');
                
                // Initialize App Bridge if available
                if (window.ShopifyAppBridge) {
                    const app = window.ShopifyAppBridge.createApp({
                        apiKey: '128d69fb5441ba3eda3ae4694c71b175',
                        shopOrigin: this.getShopOrigin(),
                    });
                    
                    console.log('🌉 Shopify App Bridge initialized');
                    this.app = app;
                }
            }
        } catch (error) {
            console.log('⚠️  Shopify App Bridge not available:', error.message);
        }
    }
    
    getShopOrigin() {
        // Try to get shop from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');
        
        if (shop) {
            return shop.includes('.') ? shop : `${shop}.myshopify.com`;
        }
        
        // Try to get from parent window
        try {
            return window.parent.location.hostname;
        } catch (e) {
            return 'unknown.myshopify.com';
        }
    }
    
    switchDevice(device) {
        // Update active device button
        document.querySelectorAll('.device-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-device="${device}"]`).classList.add('active');
        
        // Update canvas frame class
        const canvasFrame = document.querySelector('.canvas-frame');
        canvasFrame.className = `canvas-frame ${device}`;
        
        this.currentDevice = device;
        console.log(`📱 Switched to ${device} view`);
    }
    
    addWidget(type, position = {}) {
        console.log(`➕ Adding widget: ${type}`, position);
        
        const widget = this.createWidget(type, position);
        if (widget) {
            this.widgets.push(widget);
            this.renderWidget(widget);
            this.saveState();
            
            // Remove empty state if it exists
            const emptyState = document.querySelector('.empty-state');
            if (emptyState) {
                emptyState.remove();
            }
            
            // Select the new widget
            this.selectElement(widget);
        }
    }
    
    createWidget(type, position) {
        const widgetId = `widget_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const widgets = {
            heading: {
                id: widgetId,
                type: 'heading',
                content: 'Your Heading Here',
                styles: {
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#1a1a1a',
                    textAlign: 'left',
                    marginBottom: '16px'
                },
                position: position
            },
            text: {
                id: widgetId,
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
                id: widgetId,
                type: 'image',
                content: 'https://via.placeholder.com/400x300',
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
                id: widgetId,
                type: 'button',
                content: 'Click Me',
                href: '#',
                styles: {
                    backgroundColor: '#667eea',
                    color: '#ffffff',
                    padding: '12px 24px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    display: 'inline-block',
                    marginBottom: '16px'
                },
                position: position
            },
            section: {
                id: widgetId,
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
            }
        };
        
        return widgets[type] || null;
    }
    
    renderWidget(widget) {
        const canvasFrame = document.querySelector('.canvas-frame');
        const element = document.createElement('div');
        element.className = 'widget-element';
        element.setAttribute('data-widget-id', widget.id);
        element.setAttribute('data-widget-type', widget.type);
        element.innerHTML = this.getWidgetHTML(widget);
        
        // Apply styles
        this.applyStyles(element, widget.styles);
        
        // Add event listeners
        element.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectElement(widget);
        });
        
        canvasFrame.appendChild(element);
    }
    
    getWidgetHTML(widget) {
        const controlsHTML = `
            <div class="widget-controls">
                <button class="widget-control-btn" onclick="builder.editWidget('${widget.id}')" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="widget-control-btn" onclick="builder.deleteWidget('${widget.id}')" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        
        switch (widget.type) {
            case 'heading':
                return `<h2>${widget.content}</h2>${controlsHTML}`;
            case 'text':
                return `<p>${widget.content}</p>${controlsHTML}`;
            case 'image':
                return `<img src="${widget.content}" alt="${widget.alt || ''}" style="max-width: 100%;">${controlsHTML}`;
            case 'button':
                return `<a href="${widget.href || '#'}" class="widget-button">${widget.content}</a>${controlsHTML}`;
            case 'section':
                return `<div class="widget-section">Drop widgets here</div>${controlsHTML}`;
            default:
                return `<div>Unknown widget type: ${widget.type}</div>${controlsHTML}`;
        }
    }
    
    applyStyles(element, styles) {
        if (styles) {
            Object.assign(element.style, styles);
        }
    }
    
    selectElement(widget) {
        // Deselect previous element
        this.deselectElement();
        
        // Select new element
        const element = document.querySelector(`[data-widget-id="${widget.id}"]`);
        if (element) {
            element.classList.add('selected');
            this.selectedElement = widget;
            this.showProperties(widget);
        }
    }
    
    deselectElement() {
        document.querySelectorAll('.widget-element.selected').forEach(el => {
            el.classList.remove('selected');
        });
        this.selectedElement = null;
        this.hideProperties();
    }
    
    showProperties(widget) {
        const propertiesContent = document.getElementById('propertiesContent');
        if (!propertiesContent) return;
        
        const form = this.createPropertiesForm(widget);
        propertiesContent.innerHTML = form;
        
        // Add event listeners to form inputs
        propertiesContent.querySelectorAll('input, textarea, select').forEach(input => {
            input.addEventListener('input', (e) => {
                this.updateWidgetProperty(widget.id, e.target.name, e.target.value);
            });
        });
    }
    
    createPropertiesForm(widget) {
        let form = `<h4>Edit ${widget.type.charAt(0).toUpperCase() + widget.type.slice(1)}</h4>`;
        
        switch (widget.type) {
            case 'heading':
            case 'text':
                form += `
                    <div class="form-group">
                        <label>Content</label>
                        <textarea name="content" rows="3">${widget.content}</textarea>
                    </div>
                    <div class="form-group">
                        <label>Font Size</label>
                        <input type="text" name="fontSize" value="${widget.styles.fontSize || '16px'}">
                    </div>
                    <div class="form-group">
                        <label>Color</label>
                        <div class="color-picker">
                            <input type="color" name="color" value="${this.hexFromRgb(widget.styles.color)}">
                            <input type="text" name="colorText" value="${widget.styles.color}">
                        </div>
                    </div>
                `;
                break;
            case 'image':
                form += `
                    <div class="form-group">
                        <label>Image URL</label>
                        <input type="url" name="content" value="${widget.content}">
                    </div>
                    <div class="form-group">
                        <label>Alt Text</label>
                        <input type="text" name="alt" value="${widget.alt || ''}">
                    </div>
                `;
                break;
            case 'button':
                form += `
                    <div class="form-group">
                        <label>Button Text</label>
                        <input type="text" name="content" value="${widget.content}">
                    </div>
                    <div class="form-group">
                        <label>Link URL</label>
                        <input type="url" name="href" value="${widget.href || ''}">
                    </div>
                    <div class="form-group">
                        <label>Background Color</label>
                        <div class="color-picker">
                            <input type="color" name="backgroundColor" value="${this.hexFromRgb(widget.styles.backgroundColor)}">
                        </div>
                    </div>
                `;
                break;
        }
        
        return form;
    }
    
    updateWidgetProperty(widgetId, property, value) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (!widget) return;
        
        if (property === 'content' || property === 'href' || property === 'alt') {
            widget[property] = value;
        } else {
            widget.styles[property] = value;
        }
        
        // Re-render the widget
        const element = document.querySelector(`[data-widget-id="${widgetId}"]`);
        if (element) {
            element.innerHTML = this.getWidgetHTML(widget);
            this.applyStyles(element, widget.styles);
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
                    <p>Select an element to edit its properties</p>
                </div>
            `;
        }
    }
    
    editWidget(widgetId) {
        const widget = this.widgets.find(w => w.id === widgetId);
        if (widget) {
            this.selectElement(widget);
        }
    }
    
    deleteWidget(widgetId) {
        if (confirm('Are you sure you want to delete this widget?')) {
            this.widgets = this.widgets.filter(w => w.id !== widgetId);
            const element = document.querySelector(`[data-widget-id="${widgetId}"]`);
            if (element) {
                element.remove();
            }
            this.deselectElement();
            this.saveState();
        }
    }
    
    deleteSelectedElement() {
        if (this.selectedElement) {
            this.deleteWidget(this.selectedElement.id);
        }
    }
    
    saveState() {
        const state = {
            widgets: JSON.parse(JSON.stringify(this.widgets)),
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
        
        console.log('💾 State saved', { widgets: this.widgets.length, historyIndex: this.historyIndex });
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
        this.widgets = JSON.parse(JSON.stringify(state.widgets));
        this.renderAllWidgets();
        this.deselectElement();
    }
    
    renderAllWidgets() {
        const canvasFrame = document.querySelector('.canvas-frame');
        
        // Clear existing widgets
        canvasFrame.querySelectorAll('.widget-element').forEach(el => el.remove());
        
        // Check if no widgets
        if (this.widgets.length === 0) {
            canvasFrame.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-magic"></i>
                    </div>
                    <h3>Start Building Your Page</h3>
                    <p>Drag elements from the sidebar to start creating your page</p>
                </div>
            `;
            return;
        }
        
        // Render all widgets
        this.widgets.forEach(widget => {
            this.renderWidget(widget);
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
        const canvasFrame = document.querySelector('.canvas-frame');
        canvasFrame.style.transform = `scale(${this.zoomLevel})`;
        canvasFrame.style.transformOrigin = 'top center';
        
        document.getElementById('zoomLevel').textContent = `${Math.round(this.zoomLevel * 100)}%`;
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
            
            // Send to server
            const response = await fetch('/api/pages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: this.getPageTitle(),
                    html: html,
                    css: css,
                    widgets: this.widgets,
                    shop: this.getShopOrigin()
                })
            });
            
            if (response.ok) {
                alert('Page published successfully!');
            } else {
                throw new Error('Failed to publish page');
            }
        } catch (error) {
            console.error('Publish error:', error);
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
                <div class="page-content">
        `;
        
        this.widgets.forEach(widget => {
            html += this.getWidgetPublishHTML(widget);
        });
        
        html += `
                </div>
            </body>
            </html>
        `;
        
        return html;
    }
    
    getWidgetPublishHTML(widget) {
        switch (widget.type) {
            case 'heading':
                return `<h2 style="${this.stylesToString(widget.styles)}">${widget.content}</h2>`;
            case 'text':
                return `<p style="${this.stylesToString(widget.styles)}">${widget.content}</p>`;
            case 'image':
                return `<img src="${widget.content}" alt="${widget.alt || ''}" style="${this.stylesToString(widget.styles)}">`;
            case 'button':
                return `<a href="${widget.href || '#'}" style="${this.stylesToString(widget.styles)}">${widget.content}</a>`;
            case 'section':
                return `<div style="${this.stylesToString(widget.styles)}">${widget.content}</div>`;
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
            }
            .page-content {
                max-width: 1200px;
                margin: 0 auto;
                padding: 20px;
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
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('title') || 'KingsBuilder Page';
    }
    
    async savePage() {
        console.log('💾 Saving page...');
        // Implement auto-save functionality
    }
    
    async loadPageData() {
        const urlParams = new URLSearchParams(window.location.search);
        const pageId = urlParams.get('pageId');
        
        if (pageId && pageId !== 'new') {
            console.log('📂 Loading page data for ID:', pageId);
            // Implement loading existing page data
        } else {
            // Initialize with empty state
            this.saveState();
        }
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
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Initialize builder when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing KingsBuilder Page Builder...');
    window.builder = new KingsBuilder();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KingsBuilder;
}