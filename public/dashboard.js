// KingsBuilder Dashboard JavaScript

class KingsDashboard {
    constructor() {
        this.currentTab = 'pages';
        this.pages = [];
        this.templates = [];
        this.isLoading = false;
        
        this.init();
    }
    
    init() {
        console.log('🎯 KingsBuilder Dashboard Initializing...');
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Load initial data
        this.loadPages();
        
        // Initialize Shopify App Bridge if available
        this.initShopifyBridge();
        
        console.log('✅ KingsBuilder Dashboard Ready!');
    }
    
    initEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
        
        // Create page button
        const createPageBtn = document.getElementById('createPageBtn');
        if (createPageBtn) {
            createPageBtn.addEventListener('click', () => this.showCreatePageModal());
        }
        
        // Modal controls
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');
        const cancelBtn = document.getElementById('cancelBtn');
        const createBtn = document.getElementById('createBtn');
        
        if (modalClose) modalClose.addEventListener('click', () => this.hideModal());
        if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) this.hideModal();
        });
        if (cancelBtn) cancelBtn.addEventListener('click', () => this.hideModal());
        if (createBtn) createBtn.addEventListener('click', () => this.createNewPage());
        
        // Search functionality
        const searchPages = document.getElementById('searchPages');
        if (searchPages) {
            searchPages.addEventListener('input', (e) => {
                this.filterPages(e.target.value);
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
    
    switchTab(tabName) {
        // Update active tab
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        
        // Show corresponding content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}Tab`).classList.add('active');
        
        this.currentTab = tabName;
        
        // Load tab-specific data
        switch (tabName) {
            case 'pages':
                this.loadPages();
                break;
            case 'templates':
                this.loadTemplates();
                break;
            case 'analytics':
                this.loadAnalytics();
                break;
        }
    }
    
    async loadPages() {
        this.showLoading();
        
        try {
            // Mock data for now - replace with API call
            await this.delay(500);
            
            this.pages = [
                {
                    id: 1,
                    title: 'Homepage Hero Section',
                    status: 'published',
                    lastModified: '2024-01-15',
                    views: 1234,
                    conversions: 45
                },
                {
                    id: 2,
                    title: 'Product Landing Page',
                    status: 'draft',
                    lastModified: '2024-01-14',
                    views: 892,
                    conversions: 23
                },
                {
                    id: 3,
                    title: 'About Us Page',
                    status: 'published',
                    lastModified: '2024-01-13',
                    views: 567,
                    conversions: 12
                }
            ];
            
            this.renderPages();
        } catch (error) {
            console.error('Error loading pages:', error);
            this.showError('Failed to load pages');
        } finally {
            this.hideLoading();
        }
    }
    
    renderPages() {
        const pagesGrid = document.getElementById('pagesGrid');
        if (!pagesGrid) return;
        
        if (this.pages.length === 0) {
            pagesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fas fa-file-plus"></i>
                    </div>
                    <h3>No Pages Yet</h3>
                    <p>Create your first page to get started</p>
                    <button class="btn btn-primary" onclick="dashboard.showCreatePageModal()">
                        <i class="fas fa-plus"></i>
                        Create Your First Page
                    </button>
                </div>
            `;
            return;
        }
        
        const pagesHTML = this.pages.map(page => `
            <div class="page-card" onclick="dashboard.editPage(${page.id})">
                <div class="page-preview">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h3>${page.title}</h3>
                <div class="page-meta">
                    <span class="page-status ${page.status}">${page.status}</span>
                    <span class="page-date">${page.lastModified}</span>
                </div>
                <p>${page.views} views • ${page.conversions} conversions</p>
                <div class="page-actions">
                    <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); dashboard.duplicatePage(${page.id})">
                        <i class="fas fa-copy"></i>
                        Duplicate
                    </button>
                    <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); dashboard.editPage(${page.id})">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                </div>
            </div>
        `).join('');
        
        pagesGrid.innerHTML = pagesHTML;
    }
    
    async loadTemplates() {
        // Mock template data
        this.templates = [
            {
                id: 1,
                name: 'Landing Page',
                description: 'Perfect for product launches',
                icon: 'fas fa-store',
                category: 'marketing'
            },
            {
                id: 2,
                name: 'Product Page',
                description: 'Showcase your products',
                icon: 'fas fa-shopping-cart',
                category: 'ecommerce'
            },
            {
                id: 3,
                name: 'About Page',
                description: 'Tell your brand story',
                icon: 'fas fa-info-circle',
                category: 'content'
            }
        ];
    }
    
    async loadAnalytics() {
        // Mock analytics data
        console.log('Loading analytics...');
    }
    
    showCreatePageModal() {
        const modal = document.getElementById('modalOverlay');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');
        
        modalTitle.textContent = 'Create New Page';
        modalBody.innerHTML = `
            <div class="form-group">
                <label>Page Title</label>
                <input type="text" id="pageTitle" placeholder="Enter page title...">
            </div>
            <div class="form-group">
                <label>Page Type</label>
                <select id="pageType">
                    <option value="landing">Landing Page</option>
                    <option value="product">Product Page</option>
                    <option value="about">About Page</option>
                    <option value="custom">Custom Page</option>
                </select>
            </div>
            <div class="modal-actions">
                <button class="btn btn-secondary" id="cancelBtn">Cancel</button>
                <button class="btn btn-primary" id="createBtn">Create Page</button>
            </div>
        `;
        
        // Re-attach event listeners for new elements
        document.getElementById('cancelBtn').addEventListener('click', () => this.hideModal());
        document.getElementById('createBtn').addEventListener('click', () => this.createNewPage());
        
        modal.classList.add('active');
    }
    
    hideModal() {
        const modal = document.getElementById('modalOverlay');
        modal.classList.remove('active');
    }
    
    async createNewPage() {
        const title = document.getElementById('pageTitle').value.trim();
        const type = document.getElementById('pageType').value;
        
        if (!title) {
            alert('Please enter a page title');
            return;
        }
        
        this.showLoading();
        
        try {
            // Simulate API call
            await this.delay(1000);
            
            // Add new page to list
            const newPage = {
                id: Date.now(),
                title: title,
                status: 'draft',
                lastModified: new Date().toISOString().split('T')[0],
                views: 0,
                conversions: 0,
                type: type
            };
            
            this.pages.unshift(newPage);
            this.renderPages();
            this.hideModal();
            
            // Redirect to builder
            window.location.href = `/builder?pageId=${newPage.id}&title=${encodeURIComponent(title)}`;
            
        } catch (error) {
            console.error('Error creating page:', error);
            this.showError('Failed to create page');
        } finally {
            this.hideLoading();
        }
    }
    
    editPage(pageId) {
        const page = this.pages.find(p => p.id === pageId);
        if (page) {
            window.location.href = `/builder?pageId=${pageId}&title=${encodeURIComponent(page.title)}`;
        }
    }
    
    duplicatePage(pageId) {
        const page = this.pages.find(p => p.id === pageId);
        if (page) {
            const duplicatedPage = {
                ...page,
                id: Date.now(),
                title: `${page.title} (Copy)`,
                status: 'draft',
                lastModified: new Date().toISOString().split('T')[0],
                views: 0,
                conversions: 0
            };
            
            this.pages.unshift(duplicatedPage);
            this.renderPages();
        }
    }
    
    filterPages(searchTerm) {
        const filteredPages = this.pages.filter(page => 
            page.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        // Re-render with filtered pages
        const originalPages = this.pages;
        this.pages = filteredPages;
        this.renderPages();
        this.pages = originalPages; // Restore original array
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
    
    showError(message) {
        console.error('Dashboard Error:', message);
        // You could show a toast notification here
        alert(message);
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Global function to create new page (called from empty state)
function createNewPage() {
    if (window.dashboard) {
        window.dashboard.showCreatePageModal();
    }
}

// Initialize dashboard when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing KingsBuilder Dashboard...');
    window.dashboard = new KingsDashboard();
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = KingsDashboard;
}