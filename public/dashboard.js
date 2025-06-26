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
        
        // Update connection status in header
        this.updateConnectionStatus();
        
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
            console.log('📄 Loading real Shopify pages...');
            
            // Get shop from URL or detect it
            const shop = this.getShopOrigin();
            
            // Fetch real pages from Shopify API
            const accessToken = localStorage.getItem('shopify_access_token');
            const response = await fetch(`/api/shopify/pages?shop=${shop}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': accessToken,
                    'X-Shopify-Shop-Domain': shop
                },
                credentials: 'include' // Include cookies for auth
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    // No authentication - load demo data instead
                    console.log('🎯 No authentication, loading demo data');
                    throw new Error('No authentication - loading demo data');
                }
                throw new Error(`API Error: ${response.status}`);
            }
            
            const data = await response.json();
            console.log(`✅ Loaded ${data.pages.length} real Shopify pages`);
            
            this.pages = data.pages.map(page => ({
                id: page.id,
                title: page.title,
                status: page.status,
                lastModified: this.formatDate(page.lastModified),
                views: page.views,
                conversions: page.conversions,
                handle: page.handle,
                shopifyUrl: page.shopifyUrl,
                frontendUrl: page.frontendUrl,
                isShopifyPage: true
            }));
            
            // Also load KingsBuilder created pages
            await this.loadKingsBuilderPages();
            
            this.renderPages();
            
        } catch (error) {
            console.log('⚠️ Could not connect to Shopify, loading demo data:', error.message);
            
            // Show empty state - no demo pages
            this.pages = [];
            this.renderPages();
        } finally {
            this.hideLoading();
        }
    }
    
    async loadKingsBuilderPages() {
        try {
            // Load pages created with KingsBuilder (from our database)
            console.log('📋 Loading KingsBuilder created pages...');
            
            const response = await fetch('/api/pages', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                const kingsBuilderPages = data.pages || [];
                
                // Add to pages array with different styling
                kingsBuilderPages.forEach(page => {
                    this.pages.push({
                        ...page,
                        isKingsBuilderPage: true,
                        status: page.published ? 'published' : 'draft'
                    });
                });
                
                console.log(`✅ Loaded ${kingsBuilderPages.length} KingsBuilder pages`);
            }
        } catch (error) {
            console.log('⚠️ Could not load KingsBuilder pages:', error.message);
        }
    }
    
    loadDemoPages() {
        console.log('📋 Loading demo pages...');
        this.pages = [
            {
                id: 'demo-1',
                title: '🛍️ [DEMO] Homepage Hero Section',
                status: 'published',
                lastModified: '2024-01-15',
                views: 1234,
                conversions: 45,
                isDemo: true
            },
            {
                id: 'demo-2', 
                title: '🛍️ [DEMO] Product Landing Page',
                status: 'draft',
                lastModified: '2024-01-14',
                views: 892,
                conversions: 23,
                isDemo: true
            },
            {
                id: 'demo-3',
                title: '🛍️ [DEMO] About Us Page', 
                status: 'published',
                lastModified: '2024-01-13',
                views: 567,
                conversions: 12,
                isDemo: true
            }
        ];
        
        this.renderPages();
    }
    
    // Connect to Shopify function - use App Bridge for permission
    connectShopify() {
        console.log('🔗 User requested Shopify connection');
        
        // Auto-detect shop domain from URL parameters or Shopify context
        const shopDomain = this.getShopOrigin();
        
        if (!shopDomain) {
            console.log('❌ Could not auto-detect shop domain');
            alert('Could not detect your Shopify store. Please make sure you are accessing this app from your Shopify admin.');
            return;
        }
        
        console.log('🚀 Auto-detected shop:', shopDomain);
        
        // Show loading state
        const connectBtn = document.querySelector('.empty-state .btn') || document.querySelector('.connection-banner .btn');
        if (connectBtn) {
            connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            connectBtn.disabled = true;
        }
        
        // Request access token from user for real API access
        this.requestShopifyCredentials(shopDomain);
    }
    
    requestShopifyCredentials(shopDomain) {
        // Show a modal asking for Shopify access token
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background: rgba(0,0,0,0.7); z-index: 10000; display: flex; 
            align-items: center; justify-content: center;
        `;
        
        modal.innerHTML = `
            <div style="background: white; padding: 30px; border-radius: 8px; max-width: 500px; width: 90%;">
                <h3>🔐 Connect to Your Shopify Store</h3>
                <p>To fetch your real Shopify pages, I need your store's access token.</p>
                <p><strong>Store:</strong> ${shopDomain}</p>
                
                <div style="margin: 20px 0;">
                    <label style="display: block; margin-bottom: 8px; font-weight: bold;">
                        Shopify Access Token:
                    </label>
                    <input type="password" id="accessTokenInput" placeholder="Enter your Shopify private app access token" 
                           style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px; box-sizing: border-box;">
                </div>
                
                <div style="margin-top: 20px;">
                    <p style="font-size: 12px; color: #666;">
                        <strong>How to get your access token:</strong><br>
                        1. Go to your Shopify admin → Settings → Apps and sales channels<br>
                        2. Click "Develop apps" → Create a private app<br>
                        3. Add "read_content" permission and get the access token
                    </p>
                </div>
                
                <div style="margin-top: 20px; text-align: right;">
                    <button onclick="this.closeModal()" style="margin-right: 10px; padding: 10px 20px; background: #f1f1f1; border: none; border-radius: 4px; cursor: pointer;">
                        Cancel
                    </button>
                    <button onclick="this.saveCredentials()" style="padding: 10px 20px; background: #007cba; color: white; border: none; border-radius: 4px; cursor: pointer;">
                        Connect Store
                    </button>
                </div>
            </div>
        `;
        
        // Add modal functions
        modal.closeModal = () => {
            document.body.removeChild(modal);
            const connectBtn = document.querySelector('.empty-state .btn');
            if (connectBtn) {
                connectBtn.innerHTML = '<i class="fas fa-link"></i> Grant Permission';
                connectBtn.disabled = false;
            }
        };
        
        modal.saveCredentials = () => {
            const accessToken = document.getElementById('accessTokenInput').value.trim();
            if (!accessToken) {
                alert('Please enter your access token');
                return;
            }
            
            // Store credentials
            localStorage.setItem('kingsbuilder_shop_domain', shopDomain);
            localStorage.setItem('shopify_access_token', accessToken);
            localStorage.setItem('connection_status', 'connected');
            
            console.log('✅ Credentials saved for:', shopDomain);
            
            // Close modal
            document.body.removeChild(modal);
            
            // Show success and reload pages
            const connectBtn = document.querySelector('.empty-state .btn');
            if (connectBtn) {
                connectBtn.innerHTML = '<i class="fas fa-check"></i> Connected!';
                connectBtn.style.background = '#28a745';
                connectBtn.disabled = true;
            }
            
            setTimeout(() => {
                this.loadPages();
                this.updateConnectionStatus();
            }, 1000);
        };
        
        document.body.appendChild(modal);
        
        // Focus on input
        setTimeout(() => {
            document.getElementById('accessTokenInput').focus();
        }, 100);
    }
    
    updateConnectionStatus() {
        const statusElement = document.getElementById('connectionStatus');
        const iconElement = document.getElementById('statusIcon');
        const textElement = document.getElementById('statusText');
        
        if (!statusElement) return;
        
        const isConnected = localStorage.getItem('shopify_access_token');
        const shopDomain = localStorage.getItem('kingsbuilder_shop_domain');
        
        if (isConnected && shopDomain) {
            statusElement.className = 'connection-status connected';
            iconElement.className = 'fas fa-circle';
            textElement.textContent = `Connected to ${shopDomain}`;
        } else {
            statusElement.className = 'connection-status disconnected';
            iconElement.className = 'fas fa-circle';
            textElement.textContent = 'Not Connected';
        }
    }
    
    generateRandomState() {
        return Math.random().toString(36).substring(2, 15) + 
               Math.random().toString(36).substring(2, 15);
    }
    
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString();
        } catch (e) {
            return dateString;
        }
    }
    
    renderPages() {
        const pagesGrid = document.getElementById('pagesGrid');
        if (!pagesGrid) return;
        
        // Check if we're showing demo data and add connection banner
        const hasShopifyConnection = localStorage.getItem('shopify_access_token');
        const hasDemoPages = this.pages.some(p => p.isDemo);
        const showConnectionBanner = !hasShopifyConnection && hasDemoPages;
        
        if (this.pages.length === 0) {
            const isConnected = localStorage.getItem('shopify_access_token');
            
            if (isConnected) {
                // Connected but no pages found
                pagesGrid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fas fa-file-plus"></i>
                        </div>
                        <h3>No Pages Found</h3>
                        <p>Your Shopify store is connected! Create your first page with KingsBuilder or check if you have existing pages.</p>
                        <button class="btn btn-primary" onclick="dashboard.showCreatePageModal()">
                            <i class="fas fa-plus"></i>
                            Create New Page
                        </button>
                    </div>
                `;
            } else {
                // Not connected
                pagesGrid.innerHTML = `
                    <div class="empty-state">
                        <div class="empty-icon">
                            <i class="fab fa-shopify"></i>
                        </div>
                        <h3>Connect Your Shopify Store</h3>
                        <p>Grant KingsBuilder permission to access your store pages. We'll automatically detect your store - no setup required.</p>
                        <button class="btn btn-primary" onclick="dashboard.connectShopify()">
                            <i class="fas fa-link"></i>
                            Grant Permission
                        </button>
                    </div>
                `;
            }
            return;
        }
        
        // Connection banner HTML
        const connectionBanner = showConnectionBanner ? `
            <div class="connection-banner">
                <div class="banner-content">
                    <div class="banner-icon">
                        <i class="fab fa-shopify"></i>
                    </div>
                    <div class="banner-text">
                        <h4>📋 You're viewing demo pages</h4>
                        <p>Connect your Shopify store to manage your real pages and unlock all features.</p>
                    </div>
                    <button class="btn btn-primary" onclick="dashboard.connectShopify()">
                        <i class="fas fa-link"></i>
                        Connect Shopify Store
                    </button>
                </div>
            </div>
        ` : '';
        
        const pagesHTML = this.pages.map(page => {
            const pageType = page.isShopifyPage ? 'shopify' : page.isKingsBuilderPage ? 'kingsbuilder' : 'demo';
            const typeIcon = page.isShopifyPage ? 'fab fa-shopify' : page.isKingsBuilderPage ? 'fas fa-crown' : 'fas fa-flask';
            const typeLabel = page.isShopifyPage ? 'Shopify Page' : page.isKingsBuilderPage ? 'KingsBuilder Page' : 'Demo Page';
            const typeColor = page.isShopifyPage ? '#95c93d' : page.isKingsBuilderPage ? '#667eea' : '#f59e0b';
            
            return `
                <div class="page-card ${pageType}" onclick="dashboard.editPage('${page.id}')">
                    <div class="page-preview">
                        <i class="${typeIcon}" style="color: ${typeColor}"></i>
                    </div>
                    <div class="page-type-badge" style="background: ${typeColor}">
                        ${typeLabel}
                    </div>
                    <h3>${page.title}</h3>
                    <div class="page-meta">
                        <span class="page-status ${page.status}">${page.status}</span>
                        <span class="page-date">${page.lastModified}</span>
                    </div>
                    <p>${page.views || 0} views • ${page.conversions || 0} conversions</p>
                    <div class="page-actions">
                        ${page.isShopifyPage ? `
                            <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); window.open('${page.shopifyUrl}', '_blank')">
                                <i class="fas fa-external-link-alt"></i>
                                Shopify
                            </button>
                            <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); window.open('${page.frontendUrl}', '_blank')">
                                <i class="fas fa-eye"></i>
                                View
                            </button>
                        ` : ''}
                        ${page.isKingsBuilderPage || page.isDemo ? `
                            <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); dashboard.duplicatePage('${page.id}')">
                                <i class="fas fa-copy"></i>
                                Duplicate
                            </button>
                        ` : ''}
                        <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); dashboard.editPage('${page.id}')">
                            <i class="fas fa-edit"></i>
                            ${page.isShopifyPage ? 'Edit with KB' : 'Edit'}
                        </button>
                    </div>
                </div>
            `;
        }).join('');
        
        pagesGrid.innerHTML = connectionBanner + pagesHTML;
        
        // Add summary stats
        this.updatePageStats();
    }
    
    updatePageStats() {
        const shopifyPages = this.pages.filter(p => p.isShopifyPage).length;
        const kingsBuilderPages = this.pages.filter(p => p.isKingsBuilderPage).length;
        const totalPages = this.pages.length;
        
        console.log(`📊 Page Stats - Shopify: ${shopifyPages}, KingsBuilder: ${kingsBuilderPages}, Total: ${totalPages}`);
        
        // Update header stats if exists
        const statsContainer = document.getElementById('pageStats');
        if (statsContainer) {
            statsContainer.innerHTML = `
                <span class="stat-item">
                    <i class="fab fa-shopify"></i>
                    ${shopifyPages} Shopify Pages
                </span>
                <span class="stat-item">
                    <i class="fas fa-crown"></i>
                    ${kingsBuilderPages} KingsBuilder Pages
                </span>
                <span class="stat-item">
                    <i class="fas fa-chart-line"></i>
                    ${totalPages} Total Pages
                </span>
            `;
        }
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
        // Don't show alerts to users - just log for debugging
        // Could add a toast notification here instead
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