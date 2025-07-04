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
        
        // Install & Connect button
        const installConnectBtn = document.getElementById('installConnectBtn');
        if (installConnectBtn) {
            installConnectBtn.addEventListener('click', () => this.forceReauth());
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
            
            // Fetch real pages from Shopify API (server handles authentication via cookies)
            const response = await fetch(`/api/shopify/pages?shop=${shop}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include' // Include cookies with access token
            });
            
            if (!response.ok) {
                if (response.status === 401) {
                    console.log('🔐 Authentication required - starting OAuth flow');
                    this.startEmbeddedOAuth();
                    return;
                }
                if (response.status === 403) {
                    console.log('🚫 Permission denied - need content scopes');
                    this.showPermissionError();
                    return;
                }
                throw new Error(`Shopify API Error: ${response.status}`);
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
            console.error('❌ Failed to load Shopify pages:', error.message);
            
            // Show permission error instead of generic error
            this.showPermissionError();
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
    
    // Connect to Shopify function - automatic OAuth flow
    connectShopify() {
        console.log('🔗 User requested Shopify connection');
        
        // Auto-detect shop domain from URL parameters or Shopify context
        const shopDomain = this.getShopOrigin();
        
        if (!shopDomain) {
            console.log('❌ Could not auto-detect shop domain');
            alert('Could not detect your Shopify store. Please make sure you are accessing this app from your Shopify admin.');
            return;
        }
        
        console.log('🚀 Starting OAuth flow for shop:', shopDomain);
        
        // Show loading state
        const connectBtn = document.querySelector('.empty-state .btn') || document.querySelector('.connection-banner .btn');
        if (connectBtn) {
            connectBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            connectBtn.disabled = true;
        }
        
        // Redirect to OAuth install flow (like all other Shopify apps)
        const origin = window.location.protocol + '//' + window.location.host;
const hostParam = new URLSearchParams(window.location.search).get('host');
const installUrl = `${origin}/install?shop=${shopDomain}` + (hostParam ? `&host=${hostParam}` : '');
window.top.location.href = installUrl;
    }
    

    
    async updateConnectionStatus() {
        const statusElement = document.getElementById('connectionStatus');
        const iconElement = document.getElementById('statusIcon');
        const textElement = document.getElementById('statusText');
        
        if (!statusElement) return;
        
        try {
            const shopParam = new URLSearchParams(window.location.search).get('shop');
            const installedParam = new URLSearchParams(window.location.search).get('installed');
            
            // If we have shop parameter and installed=1, we're connected!
            if (shopParam && installedParam === '1') {
                statusElement.className = 'connection-status connected';
                iconElement.className = 'fas fa-circle';
                textElement.textContent = `Connected to ${shopParam}`;
                console.log('✅ App is connected to:', shopParam);
                return;
            }
            
            // Check if shop parameter exists (means we're in embedded mode)
            if (shopParam) {
                statusElement.className = 'connection-status connected';
                iconElement.className = 'fas fa-circle';
                textElement.textContent = `Connected to ${shopParam}`;
                console.log('✅ App is connected to:', shopParam);
            } else {
                statusElement.className = 'connection-status disconnected';
                iconElement.className = 'fas fa-circle';
                textElement.textContent = 'Not Connected';
            }
        } catch (error) {
            console.error('Connection status error:', error);
            statusElement.className = 'connection-status disconnected';
            iconElement.className = 'fas fa-circle';
            textElement.textContent = 'Connection Error';
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
            // Always show connection screen for empty state
            pagesGrid.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">
                        <i class="fab fa-shopify"></i>
                    </div>
                    <h3>Connect Your Shopify Store</h3>
                    <p>Click to authorize KingsBuilder to access your store pages. This works just like any other Shopify app - simple and automatic!</p>
                    <button class="btn btn-primary" onclick="dashboard.connectShopify()">
                        <i class="fas fa-link"></i>
                        Install & Connect
                    </button>
                </div>
            `;
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
    
    showPermissionError() {
        console.log('🚫 Permission error - showing reinstall prompt');
        
        // Replace the pages grid with permission error message
        const pagesGrid = document.getElementById('pagesGrid');
        if (pagesGrid) {
            pagesGrid.innerHTML = `
                <div class="permission-error-state">
                    <div class="error-icon">
                        <i class="fas fa-shield-alt"></i>
                    </div>
                    <h3>🔒 Permission Required</h3>
                    <p>Your app needs permission to access Shopify pages. Please reinstall the app to grant the necessary permissions.</p>
                    <div class="error-details">
                        <p><strong>Required permissions:</strong></p>
                        <ul>
                            <li>✅ Read and write products</li>
                            <li>🔒 <strong>Read and write content (pages)</strong> - Missing</li>
                        </ul>
                    </div>
                    <button class="btn btn-primary" onclick="window.dashboard.reinstallApp()">
                        <i class="fas fa-sync-alt"></i>
                        Reinstall App with Permissions
                    </button>
                    <button class="btn btn-secondary" onclick="window.dashboard.loadDemoPages()">
                        <i class="fas fa-eye"></i>
                        View Demo Instead
                    </button>
                </div>
            `;
        }
    }
    
    reinstallApp() {
        console.log('🔄 Starting app reinstall process');
        
        // Get shop from URL
        const shop = this.getShopOrigin();
        if (!shop) {
            alert('Could not detect shop domain. Please try again from your Shopify admin.');
            return;
        }
        
        // Force reauth with new scopes
        const reinstallUrl = `/?shop=${shop}&force_reauth=true`;
        console.log('Redirecting to:', reinstallUrl);
        window.top.location.href = reinstallUrl;
    }
    
    forceReauth() {
        console.log('🔄 Force reauth requested');
        this.startEmbeddedOAuth();
    }
    
    startEmbeddedOAuth() {
        console.log('🔐 Starting embedded OAuth flow');
        
        // Get shop from URL
        const shop = this.getShopOrigin();
        if (!shop) {
            alert('Could not detect shop domain. Please try again from your Shopify admin.');
            return;
        }
        
        // Show loading state
        const installBtn = document.getElementById('installConnectBtn');
        if (installBtn) {
            installBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Connecting...';
            installBtn.disabled = true;
        }
        
        // Clear existing cookies first
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        document.cookie = 'shopOrigin=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        
        // Use App Bridge for embedded OAuth if available
        if (this.app && window.AppBridge) {
            console.log('🌉 Using App Bridge for OAuth');
            
            try {
                const authenticatedFetch = window.AppBridge.authenticatedFetch(this.app);
                
                // Make a test request to trigger OAuth if needed
                authenticatedFetch('/api/shopify/pages?shop=' + shop)
                    .then(response => {
                        if (response.ok) {
                            console.log('✅ Authentication successful');
                            this.loadPages();
                        } else {
                            console.log('❌ Authentication failed, falling back to redirect');
                            this.fallbackOAuth(shop);
                        }
                    })
                    .catch(error => {
                        console.log('❌ App Bridge auth failed:', error);
                        this.fallbackOAuth(shop);
                    });
                    
            } catch (error) {
                console.log('❌ App Bridge not working:', error);
                this.fallbackOAuth(shop);
            }
        } else {
            console.log('🚀 No App Bridge - using direct OAuth');
            this.fallbackOAuth(shop);
        }
    }
    
    async fallbackOAuth(shop) {
        try {
            console.log('🔄 Requesting reauth from server');
            
            // Call server endpoint to get proper OAuth URL
            const response = await fetch('/api/force-reauth', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ shop: shop }),
                credentials: 'include'
            });
            
            if (response.ok) {
                const data = await response.json();
                console.log('✅ Got OAuth URL from server:', data.authUrl);
                
                // Redirect to OAuth
                setTimeout(() => {
                    window.top.location.href = data.authUrl;
                }, 1000);
            } else {
                throw new Error('Failed to get OAuth URL from server');
            }
            
        } catch (error) {
            console.error('❌ Server reauth failed:', error);
            
            // Fallback to direct OAuth
            const apiKey = '128d69fb5441ba3eda3ae4694c71b175';
            const scopes = 'read_products,write_products,read_customers,write_customers,read_orders,write_orders,read_content,write_content';
            const redirectUri = window.location.origin + '/auth/callback';
            
            const params = new URLSearchParams({
                client_id: apiKey,
                scope: scopes,
                redirect_uri: redirectUri,
                state: shop
            });
            
            const authUrl = `https://${shop}/admin/oauth/authorize?${params.toString()}`;
            
            console.log('🚀 Fallback - Redirecting to OAuth with full scopes:', authUrl);
            
            // Redirect to OAuth
            setTimeout(() => {
                window.top.location.href = authUrl;
            }, 1000);
        }
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