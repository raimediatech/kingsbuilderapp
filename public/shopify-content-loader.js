// Shopify Content Loader - Load saved page content from Shopify
console.log('📄 Loading Shopify Content Loader...');

class ShopifyContentLoader {
    constructor() {
        this.currentPageId = null;
        this.currentShop = null;
        this.isLoading = false;
        this.retryCount = 3;
    }

    // Get URL parameters
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            shop: urlParams.get('shop') || 'kingsbuilder.myshopify.com',
            page: urlParams.get('page') || urlParams.get('pageId'),
            template: urlParams.get('template')
        };
    }

    // Enhanced fetch with retry logic
    async fetchWithRetry(url, options = {}, retries = this.retryCount) {
        try {
            console.log(`📡 Shopify API: Fetching ${url} (attempt ${this.retryCount - retries + 1})`);
            
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Shopify API: Fetch successful');
            return data;

        } catch (error) {
            console.error(`❌ Shopify API: Fetch failed (${this.retryCount - retries + 1}/${this.retryCount}):`, error);
            
            if (retries > 0) {
                console.log(`🔄 Shopify API: Retrying in 1000ms...`);
                await new Promise(resolve => setTimeout(resolve, 1000));
                return this.fetchWithRetry(url, options, retries - 1);
            }
            
            throw error;
        }
    }

    // Load page content from Shopify
    async loadPageContent(pageId, shop) {
        if (this.isLoading) {
            console.log('⏳ Already loading page content...');
            return;
        }

        this.isLoading = true;
        this.currentPageId = pageId;
        this.currentShop = shop;

        try {
            console.log(`📄 Loading Shopify page content: ID=${pageId}, Shop=${shop}`);
            
            // Show loading indicator
            this.showLoadingIndicator();
            
            // Fetch page content from API
            const url = `/api/pages/${pageId}?shop=${encodeURIComponent(shop)}`;
            const response = await this.fetchWithRetry(url);
            
            if (response.success && response.page) {
                console.log(`✅ Shopify page content loaded: ${response.page.title}`);
                
                // Load content into canvas
                await this.injectContentIntoCanvas(response.page);
                
                // Update page title
                this.updatePageTitle(response.page.title);
                
                // Hide loading indicator
                this.hideLoadingIndicator();
                
                return response.page;
            } else {
                throw new Error(response.error || 'Failed to load page content from Shopify');
            }
            
        } catch (error) {
            console.error('❌ Failed to load Shopify page content:', error);
            this.showErrorMessage(`Failed to load page: ${error.message}`);
            this.hideLoadingIndicator();
            return null;
        } finally {
            this.isLoading = false;
        }
    }

    // Inject Shopify content into canvas
    async injectContentIntoCanvas(page) {
        try {
            console.log('🔧 Injecting Shopify content into canvas...');
            
            // Wait for canvas to be ready
            await this.waitForCanvas();
            
            // Get the canvas drop zone
            const dropZone = document.getElementById('main-drop-zone') || 
                            document.querySelector('.canvas-drop-zone') ||
                            document.querySelector('#canvas-content');
            
            if (!dropZone) {
                console.error('❌ Canvas drop zone not found');
                return;
            }
            
            // If page has HTML content, convert it to canvas elements
            if (page.body_html && page.body_html.trim()) {
                console.log('📝 Converting Shopify HTML to canvas elements...');
                
                // Clear existing content
                const existingElements = dropZone.querySelectorAll('.canvas-element');
                existingElements.forEach(el => el.remove());
                
                // Parse and convert HTML content
                await this.convertHtmlToCanvasElements(page.body_html, dropZone);
                
                // Mark canvas as having content
                dropZone.classList.add('has-elements');
                
                console.log('✅ Shopify content injected into canvas');
                
            } else {
                console.log('📝 No Shopify content found, canvas remains empty');
            }
            
        } catch (error) {
            console.error('❌ Failed to inject Shopify content:', error);
        }
    }

    // Wait for canvas to be ready
    async waitForCanvas(maxWait = 10000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWait) {
            const dropZone = document.getElementById('main-drop-zone') || 
                            document.querySelector('.canvas-drop-zone');
            
            if (dropZone) {
                console.log('✅ Canvas is ready');
                return dropZone;
            }
            
            console.log('⏳ Waiting for canvas...');
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        throw new Error('Canvas not ready after waiting');
    }

    // Convert HTML content to canvas elements
    async convertHtmlToCanvasElements(htmlContent, dropZone) {
        try {
            // Create a temporary container to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            
            // Process each child element
            const children = Array.from(tempDiv.children);
            
            for (let i = 0; i < children.length; i++) {
                const child = children[i];
                await this.createCanvasElementFromHtml(child, dropZone);
            }
            
            // If no block elements, treat as single content block
            if (children.length === 0 && htmlContent.trim()) {
                await this.createCanvasElementFromHtml(tempDiv, dropZone, 'paragraph');
            }
            
        } catch (error) {
            console.error('❌ Failed to convert HTML to canvas elements:', error);
        }
    }

    // Create canvas element from HTML element
    async createCanvasElementFromHtml(htmlElement, dropZone, forceType = null) {
        const elementId = 'element_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        
        // Determine element type
        let elementType = forceType;
        if (!elementType) {
            const tagName = htmlElement.tagName.toLowerCase();
            
            switch (tagName) {
                case 'h1':
                case 'h2':
                case 'h3':
                case 'h4':
                case 'h5':
                case 'h6':
                    elementType = 'heading';
                    break;
                case 'p':
                    elementType = 'paragraph';
                    break;
                case 'img':
                    elementType = 'image';
                    break;
                case 'button':
                case 'a':
                    elementType = 'button';
                    break;
                case 'ul':
                case 'ol':
                    elementType = 'list';
                    break;
                case 'hr':
                    elementType = 'divider';
                    break;
                case 'div':
                case 'section':
                    elementType = 'container';
                    break;
                default:
                    elementType = 'container';
            }
        }
        
        // Get content
        let content = htmlElement.innerHTML || htmlElement.textContent || '';
        
        // Create canvas element wrapper
        const elementWrapper = document.createElement('div');
        elementWrapper.className = 'canvas-element shopify-imported';
        elementWrapper.id = elementId;
        
        // Create element controls
        const controls = `
            <div class="element-controls">
                <button class="element-control-btn" onclick="window.CanvasFix.moveElementUp('${elementId}')" title="Move Up">↑</button>
                <button class="element-control-btn" onclick="window.CanvasFix.moveElementDown('${elementId}')" title="Move Down">↓</button>
                <button class="element-control-btn" onclick="window.CanvasFix.duplicateElement('${elementId}')" title="Duplicate">📋</button>
                <button class="element-control-btn" onclick="window.CanvasFix.deleteElement('${elementId}')" title="Delete">🗑️</button>
            </div>
        `;
        
        // Create element content based on type
        let elementContent = '';
        
        switch (elementType) {
            case 'heading':
                const headingTag = htmlElement.tagName.toLowerCase() || 'h2';
                elementContent = `<${headingTag} contenteditable="true" class="editable-heading">${content}</${headingTag}>`;
                break;
                
            case 'paragraph':
                elementContent = `<p contenteditable="true" class="editable-text">${content}</p>`;
                break;
                
            case 'image':
                const src = htmlElement.src || '';
                const alt = htmlElement.alt || '';
                if (src) {
                    elementContent = `<img src="${src}" alt="${alt}" style="max-width: 100%; height: auto;">`;
                } else {
                    elementContent = `<div class="image-placeholder">
                                        <div class="image-icon">🖼️</div>
                                        <p>Image placeholder</p>
                                      </div>`;
                }
                break;
                
            case 'button':
                const buttonText = htmlElement.textContent || 'Button';
                const href = htmlElement.href || '#';
                elementContent = `<a href="${href}" class="editable-button" contenteditable="true">${buttonText}</a>`;
                break;
                
            case 'list':
                elementContent = `<${htmlElement.tagName.toLowerCase()} contenteditable="true" class="editable-list">${content}</${htmlElement.tagName.toLowerCase()}>`;
                break;
                
            case 'divider':
                elementContent = `<hr class="divider-element" style="border: 1px solid #e1e5e9; margin: 20px 0;">`;
                break;
                
            case 'container':
            default:
                elementContent = `<div class="container-element" contenteditable="true">${content}</div>`;
                break;
        }
        
        // Combine controls and content
        elementWrapper.innerHTML = controls + elementContent;
        
        // Add click handler for selection
        elementWrapper.addEventListener('click', (e) => {
            e.stopPropagation();
            if (window.CanvasFix && window.CanvasFix.selectElement) {
                // Use CanvasFix selectElement if available
                const canvasFix = window.CanvasFix;
                if (canvasFix.selectElement) {
                    canvasFix.selectElement(elementWrapper);
                }
            } else {
                // Fallback selection
                document.querySelectorAll('.canvas-element.selected').forEach(el => {
                    el.classList.remove('selected');
                });
                elementWrapper.classList.add('selected');
            }
        });
        
        // Add to canvas
        dropZone.appendChild(elementWrapper);
        
        console.log(`✅ Created ${elementType} element from Shopify content`);
        
        // Small delay between elements
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Update page title
    updatePageTitle(title) {
        // Update browser title
        document.title = `${title} - KingsBuilder`;
        
        // Update any title displays in the builder
        const titleElements = document.querySelectorAll('.page-title, .current-page-title, .canvas-title span');
        titleElements.forEach(el => {
            if (el.textContent.includes('Page Canvas')) {
                el.textContent = `📄 ${title}`;
            } else {
                el.textContent = title;
            }
        });
        
        console.log(`📝 Updated page title: ${title}`);
    }

    // Show loading indicator
    showLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'shopify-loading-indicator';
        indicator.innerHTML = `
            <div class="shopify-loading-overlay">
                <div class="shopify-loading-content">
                    <div class="shopify-loading-spinner">🔄</div>
                    <h3>Loading Shopify Page Content</h3>
                    <p>Fetching your saved page content from Shopify...</p>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .shopify-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .shopify-loading-content {
                text-align: center;
                padding: 40px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0,0,0,0.1);
                max-width: 400px;
            }
            .shopify-loading-spinner {
                font-size: 32px;
                animation: spin 1s linear infinite;
                margin-bottom: 20px;
            }
            .shopify-loading-content h3 {
                color: #333;
                margin-bottom: 10px;
            }
            .shopify-loading-content p {
                color: #666;
                margin: 0;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(indicator);
    }

    // Hide loading indicator
    hideLoadingIndicator() {
        const indicator = document.getElementById('shopify-loading-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Show error message
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'shopify-error-message';
        errorDiv.innerHTML = `
            <div class="shopify-error-content">
                <h3>⚠️ Failed to Load Shopify Content</h3>
                <p>${message}</p>
                <div class="error-actions">
                    <button onclick="window.ShopifyContentLoader.retry()" class="retry-btn">
                        🔄 Retry
                    </button>
                    <button onclick="this.closest('.shopify-error-message').remove()" class="dismiss-btn">
                        ✕ Dismiss
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .shopify-error-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff;
                border: 1px solid #e74c3c;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                z-index: 10001;
                max-width: 350px;
            }
            .shopify-error-content h3 {
                margin: 0 0 10px 0;
                color: #e74c3c;
                font-size: 16px;
            }
            .shopify-error-content p {
                margin: 0 0 15px 0;
                color: #666;
                font-size: 14px;
            }
            .error-actions {
                display: flex;
                gap: 8px;
            }
            .retry-btn, .dismiss-btn {
                padding: 6px 12px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
            .retry-btn {
                background: #007cba;
                color: white;
            }
            .dismiss-btn {
                background: #6c757d;
                color: white;
            }
            .retry-btn:hover {
                background: #005a87;
            }
            .dismiss-btn:hover {
                background: #545b62;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(errorDiv);
    }

    // Retry loading
    async retry() {
        // Remove error message
        const errorMsg = document.querySelector('.shopify-error-message');
        if (errorMsg) errorMsg.remove();
        
        // Retry loading
        if (this.currentPageId && this.currentShop) {
            await this.loadPageContent(this.currentPageId, this.currentShop);
        }
    }

    // Initialize the content loader
    initialize() {
        console.log('🚀 Initializing Shopify Content Loader...');
        
        // Get URL parameters
        const params = this.getUrlParams();
        console.log('📋 URL Parameters:', params);
        
        // If we have a page ID, load it after canvas is ready
        if (params.page && params.shop) {
            console.log(`📄 Will load Shopify page: ${params.page} from shop: ${params.shop}`);
            
            // Wait for canvas to be ready, then load content
            setTimeout(async () => {
                try {
                    await this.waitForCanvas();
                    await this.loadPageContent(params.page, params.shop);
                } catch (error) {
                    console.error('❌ Failed to load Shopify content on initialization:', error);
                }
            }, 3000); // Wait for canvas and other systems to initialize
        } else {
            console.log('ℹ️ No page ID provided, starting with empty canvas');
        }
        
        console.log('✅ Shopify Content Loader initialized');
    }
}

// Create global instance
const shopifyContentLoader = new ShopifyContentLoader();

// Export for global access
window.ShopifyContentLoader = {
    initialize: () => shopifyContentLoader.initialize(),
    loadPage: (pageId, shop) => shopifyContentLoader.loadPageContent(pageId, shop),
    retry: () => shopifyContentLoader.retry()
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        shopifyContentLoader.initialize();
    });
} else {
    shopifyContentLoader.initialize();
}

console.log('✅ Shopify Content Loader loaded');