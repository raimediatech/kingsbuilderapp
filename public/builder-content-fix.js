// Builder Content Fix for KingsBuilder Page Editor
console.log('📄 Loading Builder Content Fix...');

class BuilderContentFix {
    constructor() {
        this.currentPageId = null;
        this.currentShop = null;
        this.isLoading = false;
        this.retryCount = 3;
        this.retryDelay = 1000;
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
            console.log(`📡 Builder API: Fetching ${url} (attempt ${this.retryCount - retries + 1})`);
            
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
            console.log('✅ Builder API: Fetch successful');
            return data;

        } catch (error) {
            console.error(`❌ Builder API: Fetch failed (${this.retryCount - retries + 1}/${this.retryCount}):`, error);
            
            if (retries > 0) {
                console.log(`🔄 Builder API: Retrying in ${this.retryDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.fetchWithRetry(url, options, retries - 1);
            }
            
            throw error;
        }
    }

    // Load page content into builder
    async loadPageContent(pageId, shop) {
        if (this.isLoading) {
            console.log('⏳ Already loading page content...');
            return;
        }

        this.isLoading = true;
        this.currentPageId = pageId;
        this.currentShop = shop;

        try {
            console.log(`📄 Loading page content: ID=${pageId}, Shop=${shop}`);
            
            // Show loading indicator
            this.showLoadingIndicator();
            
            // Fetch page content from API
            const url = `/api/pages/${pageId}?shop=${encodeURIComponent(shop)}`;
            const response = await this.fetchWithRetry(url);
            
            if (response.success && response.page) {
                console.log(`✅ Page content loaded: ${response.page.title}`);
                
                // Load content into builder
                await this.injectContentIntoBuilder(response.page);
                
                // Update page title in builder
                this.updateBuilderTitle(response.page.title);
                
                // Hide loading indicator
                this.hideLoadingIndicator();
                
                return response.page;
            } else {
                throw new Error(response.error || 'Failed to load page content');
            }
            
        } catch (error) {
            console.error('❌ Failed to load page content:', error);
            this.showErrorMessage(error.message);
            this.hideLoadingIndicator();
            return null;
        } finally {
            this.isLoading = false;
        }
    }

    // Inject content into the builder
    async injectContentIntoBuilder(page) {
        try {
            console.log('🔧 Injecting content into builder...');
            
            // Get the builder preview area
            const previewArea = document.getElementById('kingsbuilder-preview') || 
                               document.querySelector('.kingsbuilder-preview') ||
                               document.querySelector('#preview-frame') ||
                               document.querySelector('.preview-content');
            
            if (!previewArea) {
                console.error('❌ Builder preview area not found');
                return;
            }
            
            // If page has HTML content, inject it
            if (page.body_html && page.body_html.trim()) {
                console.log('📝 Injecting HTML content...');
                
                // Create a container for the content
                const contentContainer = document.createElement('div');
                contentContainer.className = 'shopify-page-content';
                contentContainer.innerHTML = page.body_html;
                
                // Clear existing content and add new content
                previewArea.innerHTML = '';
                previewArea.appendChild(contentContainer);
                
                // Make content editable if needed
                this.makeContentEditable(contentContainer);
                
            } else {
                console.log('📝 No content found, showing empty state');
                this.showEmptyState(previewArea);
            }
            
            // Update builder state
            if (window.KingsBuilder && window.KingsBuilder.setCurrentPage) {
                window.KingsBuilder.setCurrentPage(page);
            }
            
            console.log('✅ Content injected successfully');
            
        } catch (error) {
            console.error('❌ Failed to inject content:', error);
        }
    }

    // Make content editable in builder
    makeContentEditable(container) {
        const editableElements = container.querySelectorAll('h1, h2, h3, h4, h5, h6, p, div, span');
        
        editableElements.forEach(element => {
            element.setAttribute('contenteditable', 'true');
            element.classList.add('kb-editable');
            
            // Add click handler for editing
            element.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectElement(element);
            });
        });
        
        console.log(`✅ Made ${editableElements.length} elements editable`);
    }

    // Select element in builder
    selectElement(element) {
        // Remove previous selection
        document.querySelectorAll('.kb-selected').forEach(el => {
            el.classList.remove('kb-selected');
        });
        
        // Add selection to current element
        element.classList.add('kb-selected');
        
        // Show properties panel if available
        if (window.KingsBuilder && window.KingsBuilder.showProperties) {
            window.KingsBuilder.showProperties(element);
        }
        
        console.log('🎯 Element selected:', element.tagName);
    }

    // Show loading indicator
    showLoadingIndicator() {
        const indicator = document.createElement('div');
        indicator.id = 'kb-loading-indicator';
        indicator.innerHTML = `
            <div class="kb-loading-overlay">
                <div class="kb-loading-content">
                    <div class="kb-loading-spinner">⟳</div>
                    <p>Loading page content...</p>
                </div>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .kb-loading-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
            }
            .kb-loading-content {
                text-align: center;
                padding: 20px;
            }
            .kb-loading-spinner {
                font-size: 24px;
                animation: spin 1s linear infinite;
                margin-bottom: 10px;
            }
            @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
            .kb-selected {
                outline: 2px solid #007cba !important;
                outline-offset: 2px !important;
            }
            .kb-editable:hover {
                background: rgba(0, 124, 186, 0.1) !important;
                cursor: text !important;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(indicator);
    }

    // Hide loading indicator
    hideLoadingIndicator() {
        const indicator = document.getElementById('kb-loading-indicator');
        if (indicator) {
            indicator.remove();
        }
    }

    // Show error message
    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'kb-error-message';
        errorDiv.innerHTML = `
            <div class="kb-error-content">
                <h3>⚠️ Failed to Load Page</h3>
                <p>${message}</p>
                <button onclick="window.BuilderContentFix.retry()" class="kb-retry-btn">
                    🔄 Retry
                </button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .kb-error-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #fff;
                border: 1px solid #e74c3c;
                border-radius: 8px;
                padding: 20px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                z-index: 10001;
                max-width: 300px;
            }
            .kb-error-content h3 {
                margin: 0 0 10px 0;
                color: #e74c3c;
                font-size: 16px;
            }
            .kb-error-content p {
                margin: 0 0 15px 0;
                color: #666;
                font-size: 14px;
            }
            .kb-retry-btn {
                background: #007cba;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            .kb-retry-btn:hover {
                background: #005a87;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(errorDiv);
        
        // Auto-remove after 10 seconds
        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.remove();
            }
        }, 10000);
    }

    // Show empty state
    showEmptyState(container) {
        container.innerHTML = `
            <div class="kb-empty-state">
                <div class="kb-empty-icon">📄</div>
                <h3>Empty Page</h3>
                <p>This page doesn't have any content yet. Start building by adding elements from the left panel.</p>
                <button onclick="window.BuilderContentFix.addFirstElement()" class="kb-add-element-btn">
                    ➕ Add Your First Element
                </button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .kb-empty-state {
                text-align: center;
                padding: 60px 20px;
                color: #666;
            }
            .kb-empty-icon {
                font-size: 48px;
                margin-bottom: 20px;
            }
            .kb-empty-state h3 {
                margin: 0 0 10px 0;
                color: #333;
            }
            .kb-empty-state p {
                margin: 0 0 20px 0;
                max-width: 400px;
                margin-left: auto;
                margin-right: auto;
            }
            .kb-add-element-btn {
                background: #007cba;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 6px;
                cursor: pointer;
                font-size: 16px;
            }
            .kb-add-element-btn:hover {
                background: #005a87;
            }
        `;
        
        document.head.appendChild(style);
    }

    // Update builder title
    updateBuilderTitle(title) {
        // Update page title
        document.title = `${title} - KingsBuilder`;
        
        // Update any title displays in the builder
        const titleElements = document.querySelectorAll('.page-title, .current-page-title');
        titleElements.forEach(el => {
            el.textContent = title;
        });
        
        console.log(`📝 Updated builder title: ${title}`);
    }

    // Save current page content
    async savePageContent() {
        if (!this.currentPageId || !this.currentShop) {
            console.error('❌ No page loaded to save');
            return false;
        }

        try {
            console.log('💾 Saving page content...');
            
            // Get content from builder
            const previewArea = document.getElementById('kingsbuilder-preview') || 
                               document.querySelector('.kingsbuilder-preview');
            
            if (!previewArea) {
                throw new Error('Preview area not found');
            }
            
            const content = previewArea.innerHTML;
            
            // Save to API
            const url = `/api/pages/${this.currentPageId}`;
            const response = await this.fetchWithRetry(url, {
                method: 'PUT',
                body: JSON.stringify({
                    shop: this.currentShop,
                    content: content
                })
            });
            
            if (response.success) {
                console.log('✅ Page content saved successfully');
                this.showSuccessMessage('Page saved successfully!');
                return true;
            } else {
                throw new Error(response.error || 'Failed to save page');
            }
            
        } catch (error) {
            console.error('❌ Failed to save page content:', error);
            this.showErrorMessage(`Failed to save: ${error.message}`);
            return false;
        }
    }

    // Show success message
    showSuccessMessage(message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'kb-success-message';
        successDiv.innerHTML = `
            <div class="kb-success-content">
                <span>✅ ${message}</span>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .kb-success-message {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #2ecc71;
                color: white;
                padding: 12px 20px;
                border-radius: 6px;
                z-index: 10001;
                animation: slideIn 0.3s ease;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(successDiv);
        
        // Auto-remove after 3 seconds
        setTimeout(() => {
            if (successDiv.parentNode) {
                successDiv.remove();
            }
        }, 3000);
    }

    // Retry loading
    async retry() {
        // Remove error message
        const errorMsg = document.querySelector('.kb-error-message');
        if (errorMsg) errorMsg.remove();
        
        // Retry loading
        if (this.currentPageId && this.currentShop) {
            await this.loadPageContent(this.currentPageId, this.currentShop);
        }
    }

    // Add first element helper
    addFirstElement() {
        // Trigger add element action
        const addBtn = document.querySelector('[data-element="heading"]') || 
                      document.querySelector('.element-item');
        
        if (addBtn) {
            addBtn.click();
        } else {
            console.log('💡 Click on an element in the left panel to add it to your page');
        }
    }

    // Initialize the content fix
    initialize() {
        console.log('🚀 Initializing Builder Content Fix...');
        
        // Get URL parameters
        const params = this.getUrlParams();
        console.log('📋 URL Parameters:', params);
        
        // If we have a page ID, load it
        if (params.page && params.shop) {
            setTimeout(() => {
                this.loadPageContent(params.page, params.shop);
            }, 2000); // Wait for builder to initialize
        } else {
            console.log('ℹ️ No page ID provided, starting with empty page');
        }
        
        // Set up auto-save (every 30 seconds)
        setInterval(() => {
            if (this.currentPageId && this.currentShop) {
                this.savePageContent();
            }
        }, 30000);
        
        console.log('✅ Builder Content Fix initialized');
    }
}

// Create global instance
const builderContentFix = new BuilderContentFix();

// Export for global access
window.BuilderContentFix = {
    initialize: () => builderContentFix.initialize(),
    loadPage: (pageId, shop) => builderContentFix.loadPageContent(pageId, shop),
    savePage: () => builderContentFix.savePageContent(),
    retry: () => builderContentFix.retry(),
    addFirstElement: () => builderContentFix.addFirstElement()
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        builderContentFix.initialize();
    });
} else {
    builderContentFix.initialize();
}

console.log('✅ Builder Content Fix loaded');