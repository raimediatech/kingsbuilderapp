// Page Content Fix for KingsBuilder Dashboard
console.log('📄 Loading Page Content Fix...');

// Enhanced API helper with better error handling
class PageContentAPI {
    constructor() {
        this.baseURL = window.location.origin;
        this.retryCount = 3;
        this.retryDelay = 1000;
    }

    // Get shop from URL parameters or context
    getShop() {
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop') || 
                    window.shopOrigin || 
                    'kingsbuilder.myshopify.com'; // Fallback
        
        console.log('🏪 Using shop:', shop);
        return shop;
    }

    // Enhanced fetch with retry logic
    async fetchWithRetry(url, options = {}, retries = this.retryCount) {
        try {
            console.log(`📡 Fetching: ${url} (${this.retryCount - retries + 1}/${this.retryCount})`);
            
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
            console.log('✅ Fetch successful:', url);
            return data;

        } catch (error) {
            console.error(`❌ Fetch failed (${this.retryCount - retries + 1}/${this.retryCount}):`, error);
            
            if (retries > 0) {
                console.log(`🔄 Retrying in ${this.retryDelay}ms...`);
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                return this.fetchWithRetry(url, options, retries - 1);
            }
            
            throw error;
        }
    }

    // Get all pages with enhanced error handling
    async getPages() {
        const shop = this.getShop();
        const url = `${this.baseURL}/api/pages?shop=${encodeURIComponent(shop)}`;
        
        try {
            const data = await this.fetchWithRetry(url);
            
            if (data.success && Array.isArray(data.pages)) {
                console.log(`✅ Loaded ${data.pages.length} pages`);
                return data.pages;
            } else {
                console.warn('⚠️ Invalid pages response format:', data);
                return [];
            }
        } catch (error) {
            console.error('❌ Failed to load pages:', error);
            return [];
        }
    }

    // Get specific page content
    async getPageContent(pageId) {
        const shop = this.getShop();
        const url = `${this.baseURL}/api/pages/${pageId}?shop=${encodeURIComponent(shop)}`;
        
        try {
            const data = await this.fetchWithRetry(url);
            
            if (data.success && data.page) {
                console.log(`✅ Loaded page content for ID: ${pageId}`);
                return data.page;
            } else {
                console.warn('⚠️ Invalid page content response:', data);
                return null;
            }
        } catch (error) {
            console.error(`❌ Failed to load page content for ID ${pageId}:`, error);
            return null;
        }
    }

    // Save page content with enhanced error handling
    async savePageContent(pageId, content) {
        const shop = this.getShop();
        const url = `${this.baseURL}/api/pages/${pageId}`;
        
        try {
            const data = await this.fetchWithRetry(url, {
                method: 'PUT',
                body: JSON.stringify({
                    shop: shop,
                    content: content
                })
            });
            
            if (data.success) {
                console.log(`✅ Saved page content for ID: ${pageId}`);
                return true;
            } else {
                console.warn('⚠️ Save failed:', data);
                return false;
            }
        } catch (error) {
            console.error(`❌ Failed to save page content for ID ${pageId}:`, error);
            return false;
        }
    }

    // Create new page
    async createPage(title, content = '') {
        const shop = this.getShop();
        const url = `${this.baseURL}/api/pages`;
        
        try {
            const data = await this.fetchWithRetry(url, {
                method: 'POST',
                body: JSON.stringify({
                    shop: shop,
                    title: title,
                    content: content
                })
            });
            
            if (data.success && data.page) {
                console.log(`✅ Created new page: ${title}`);
                return data.page;
            } else {
                console.warn('⚠️ Page creation failed:', data);
                return null;
            }
        } catch (error) {
            console.error(`❌ Failed to create page "${title}":`, error);
            return null;
        }
    }

    // Delete page
    async deletePage(pageId) {
        const shop = this.getShop();
        const url = `${this.baseURL}/api/pages/${pageId}?shop=${encodeURIComponent(shop)}`;
        
        try {
            const data = await this.fetchWithRetry(url, {
                method: 'DELETE'
            });
            
            if (data.success) {
                console.log(`✅ Deleted page ID: ${pageId}`);
                return true;
            } else {
                console.warn('⚠️ Page deletion failed:', data);
                return false;
            }
        } catch (error) {
            console.error(`❌ Failed to delete page ID ${pageId}:`, error);
            return false;
        }
    }
}

// Enhanced Dashboard class with better error handling
class EnhancedDashboard {
    constructor() {
        this.api = new PageContentAPI();
        this.pages = [];
        this.isLoading = false;
        this.loadingIndicators = new Set();
    }

    // Show loading indicator
    showLoading(element, message = 'Loading...') {
        if (typeof element === 'string') {
            element = document.getElementById(element) || document.querySelector(element);
        }
        
        if (element) {
            const loadingId = Math.random().toString(36).substr(2, 9);
            this.loadingIndicators.add(loadingId);
            
            element.innerHTML = `
                <div class="loading-state" data-loading-id="${loadingId}">
                    <div class="loading-spinner">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <p>${message}</p>
                </div>
            `;
            
            return loadingId;
        }
    }

    // Hide loading indicator
    hideLoading(element, loadingId = null) {
        if (typeof element === 'string') {
            element = document.getElementById(element) || document.querySelector(element);
        }
        
        if (element) {
            if (loadingId) {
                const loadingElement = element.querySelector(`[data-loading-id="${loadingId}"]`);
                if (loadingElement) {
                    loadingElement.remove();
                    this.loadingIndicators.delete(loadingId);
                }
            } else {
                // Remove all loading indicators
                const loadingElements = element.querySelectorAll('.loading-state');
                loadingElements.forEach(el => {
                    const id = el.getAttribute('data-loading-id');
                    if (id) this.loadingIndicators.delete(id);
                    el.remove();
                });
            }
        }
    }

    // Show error message
    showError(element, message, actionButton = null) {
        if (typeof element === 'string') {
            element = document.getElementById(element) || document.querySelector(element);
        }
        
        if (element) {
            const errorHTML = `
                <div class="error-state">
                    <div class="error-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h3>Oops! Something went wrong</h3>
                    <p>${message}</p>
                    ${actionButton ? `<button class="btn btn-primary" onclick="${actionButton.action}">${actionButton.text}</button>` : ''}
                </div>
            `;
            
            element.innerHTML = errorHTML;
        }
    }

    // Load pages with enhanced error handling
    async loadPages() {
        console.log('📄 Loading pages...');
        
        const container = document.getElementById('pagesContainer') || document.querySelector('.pages-container');
        if (!container) {
            console.error('❌ Pages container not found');
            return;
        }

        const loadingId = this.showLoading(container, 'Loading your pages...');
        this.isLoading = true;

        try {
            this.pages = await this.api.getPages();
            
            if (this.pages.length === 0) {
                this.showEmptyState(container);
            } else {
                this.renderPages(container);
            }
            
        } catch (error) {
            console.error('❌ Failed to load pages:', error);
            this.showError(container, 
                'Failed to load your pages. Please check your connection and try again.',
                {
                    text: 'Retry',
                    action: 'window.PageContentFix.loadPages()'
                }
            );
        } finally {
            this.hideLoading(container, loadingId);
            this.isLoading = false;
        }
    }

    // Show empty state
    showEmptyState(container) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h3>No pages found</h3>
                <p>Create your first page to get started with KingsBuilder</p>
                <button class="btn btn-primary" onclick="window.PageContentFix.createNewPage()">
                    <i class="fas fa-plus"></i>
                    Create Your First Page
                </button>
            </div>
        `;
    }

    // Render pages
    renderPages(container) {
        const pagesHTML = this.pages.map(page => this.renderPageCard(page)).join('');
        container.innerHTML = `<div class="pages-grid">${pagesHTML}</div>`;
    }

    // Render individual page card
    renderPageCard(page) {
        const lastModified = page.updated_at ? new Date(page.updated_at).toLocaleDateString() : 'Unknown';
        const hasContent = page.body_html && page.body_html.trim().length > 0;
        
        return `
            <div class="page-card" data-page-id="${page.id}">
                <div class="page-card-header">
                    <h3 class="page-title">${page.title || 'Untitled Page'}</h3>
                    <div class="page-status ${hasContent ? 'has-content' : 'empty'}">
                        <i class="fas fa-circle"></i>
                        ${hasContent ? 'Has Content' : 'Empty'}
                    </div>
                </div>
                
                <div class="page-card-body">
                    <p class="page-handle">Handle: ${page.handle || 'N/A'}</p>
                    <p class="page-modified">Modified: ${lastModified}</p>
                    ${hasContent ? `<p class="page-preview">${this.getContentPreview(page.body_html)}</p>` : ''}
                </div>
                
                <div class="page-card-actions">
                    <button class="btn btn-primary" onclick="window.PageContentFix.editPage(${page.id})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="btn btn-secondary" onclick="window.PageContentFix.viewPage(${page.id})">
                        <i class="fas fa-eye"></i>
                        View
                    </button>
                    <button class="btn btn-danger" onclick="window.PageContentFix.deletePage(${page.id})">
                        <i class="fas fa-trash"></i>
                        Delete
                    </button>
                </div>
            </div>
        `;
    }

    // Get content preview
    getContentPreview(content) {
        if (!content) return 'No content';
        
        // Strip HTML tags and get first 100 characters
        const textContent = content.replace(/<[^>]*>/g, '').trim();
        return textContent.length > 100 ? textContent.substring(0, 100) + '...' : textContent;
    }

    // Edit page
    async editPage(pageId) {
        console.log(`✏️ Editing page ID: ${pageId}`);
        
        // Redirect to builder with page ID
        const shop = this.api.getShop();
        const builderUrl = `/builder?shop=${encodeURIComponent(shop)}&page=${pageId}`;
        window.location.href = builderUrl;
    }

    // View page
    async viewPage(pageId) {
        console.log(`👁️ Viewing page ID: ${pageId}`);
        
        const page = this.pages.find(p => p.id == pageId);
        if (page && page.handle) {
            const shop = this.api.getShop();
            const pageUrl = `https://${shop}/pages/${page.handle}`;
            window.open(pageUrl, '_blank');
        } else {
            alert('Page URL not available');
        }
    }

    // Delete page
    async deletePage(pageId) {
        if (!confirm('Are you sure you want to delete this page? This action cannot be undone.')) {
            return;
        }

        console.log(`🗑️ Deleting page ID: ${pageId}`);
        
        const success = await this.api.deletePage(pageId);
        if (success) {
            // Remove from local array and re-render
            this.pages = this.pages.filter(p => p.id != pageId);
            this.loadPages(); // Reload to ensure consistency
        } else {
            alert('Failed to delete page. Please try again.');
        }
    }

    // Create new page
    async createNewPage() {
        const title = prompt('Enter page title:');
        if (!title) return;

        console.log(`➕ Creating new page: ${title}`);
        
        const page = await this.api.createPage(title);
        if (page) {
            // Redirect to edit the new page
            this.editPage(page.id);
        } else {
            alert('Failed to create page. Please try again.');
        }
    }
}

// Initialize enhanced dashboard
const enhancedDashboard = new EnhancedDashboard();

// Export for global use
window.PageContentFix = {
    loadPages: () => enhancedDashboard.loadPages(),
    editPage: (id) => enhancedDashboard.editPage(id),
    viewPage: (id) => enhancedDashboard.viewPage(id),
    deletePage: (id) => enhancedDashboard.deletePage(id),
    createNewPage: () => enhancedDashboard.createNewPage(),
    api: enhancedDashboard.api
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => enhancedDashboard.loadPages(), 500);
    });
} else {
    setTimeout(() => enhancedDashboard.loadPages(), 500);
}

console.log('✅ Page Content Fix loaded and initialized');