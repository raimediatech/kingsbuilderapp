// KingsBuilder Dashboard JavaScript

class KingsDashboard {
    constructor() {
        this.currentTab = 'pages';
        this.pages = [];
        this.templates = [];
        this.isLoading = false;
        this.viewMode = 'grid'; // 'grid' or 'list'
        
        this.init();
    }
    
    init() {
        console.log('🎯 KingsBuilder Dashboard Initializing...');
        
        // Check if we're in embedded context
        this.checkEmbeddedContext();
        
        // Initialize event listeners
        this.initEventListeners();
        
        // Load initial data
        this.loadPages();
        
        // Initialize Shopify App Bridge if available
        this.initShopifyBridge();
        
        // Update connection status in header
        this.updateConnectionStatus();
        
        console.log('✅ KingsBuilder Dashboard Ready!');
        
        // Initialize view mode
        this.setViewMode('grid');
    }
    
    checkEmbeddedContext() {
        const urlParams = new URLSearchParams(window.location.search);
        const embedded = urlParams.get('embedded');
        const shop = urlParams.get('shop');
        
        console.log('🔍 Context check:', { 
            embedded, 
            shop, 
            isIframe: window.parent !== window,
            userAgent: navigator.userAgent.includes('Shopify'),
            currentUrl: window.location.href,
            parentUrl: this.getParentUrl()
        });
        
        // Get real shop name from multiple sources
        let realShop = shop;
        
        // CRITICAL FIX: Try to extract shop from parent URL when embedded
        if (window.parent !== window && (!realShop || realShop === 'unknown.myshopify.com')) {
            realShop = this.extractShopFromParentUrl();
        }
        
        // If shop is not in URL params, try to get it from parent window
        if (!realShop || realShop === 'unknown.myshopify.com') {
            realShop = this.getShopFromParent();
        }
        
        // If still no shop, try referrer
        if (!realShop || realShop === 'unknown.myshopify.com') {
            realShop = this.getShopFromReferrer();
        }
        
        // Set context for use throughout the app
        this.context = {
            embedded: embedded || '0',
            shop: realShop || 'unknown.myshopify.com',
            isIframe: window.parent !== window
        };
        
        console.log('📝 Context set:', this.context);
        
        // If we still don't have a real shop, show error
        if (this.context.shop === 'unknown.myshopify.com') {
            console.error('❌ Unable to determine shop - this will cause API calls to fail');
            // Don't show permission error immediately - give user a chance to see the issue
        }
    }
    
    setViewMode(mode) {
        this.viewMode = mode;
        
        // Update button states
        const gridBtn = document.getElementById('gridViewBtn');
        const listBtn = document.getElementById('listViewBtn');
        
        if (gridBtn && listBtn) {
            gridBtn.classList.toggle('active', mode === 'grid');
            listBtn.classList.toggle('active', mode === 'list');
        }
        
        // Update container class
        const pagesContainer = document.getElementById('pagesGrid');
        if (pagesContainer) {
            const newClassName = mode === 'grid' ? 'pages-grid' : 'pages-list';
            pagesContainer.className = newClassName;
            console.log(`📋 Updated container class to: ${newClassName}`);
        } else {
            console.error('❌ pagesGrid container not found!');
        }
        
        // Re-render pages if they exist
        if (this.pages.length > 0) {
            this.renderPages();
            console.log(`📋 Re-rendered ${this.pages.length} pages in ${mode} mode`);
        }
        
        console.log(`📋 View mode changed to: ${mode}`);
    }
    
    initEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
        
        // Create page buttons (there are two - one in header, one in pages area)
        const createPageBtn = document.getElementById('createPageBtn');
        const createPageBtn2 = document.getElementById('createPageBtn2');
        
        if (createPageBtn) {
            createPageBtn.addEventListener('click', () => this.showCreatePageModal());
        }
        if (createPageBtn2) {
            createPageBtn2.addEventListener('click', () => this.showCreatePageModal());
        }
        
        // Install & Connect button
        const installConnectBtn = document.getElementById('installConnectBtn');
        if (installConnectBtn) {
            installConnectBtn.addEventListener('click', () => this.forceReauth());
        }
        
        // View toggle buttons
        const gridViewBtn = document.getElementById('gridViewBtn');
        const listViewBtn = document.getElementById('listViewBtn');
        
        if (gridViewBtn) {
            gridViewBtn.addEventListener('click', () => this.setViewMode('grid'));
        }
        if (listViewBtn) {
            listViewBtn.addEventListener('click', () => this.setViewMode('list'));
        }
        
        // Modal controls - static elements only
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');
        
        if (modalClose) modalClose.addEventListener('click', () => this.hideModal());
        if (modalOverlay) modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) this.hideModal();
        });
        // Note: cancelBtn and createBtn are added dynamically in showCreatePageModal()
        
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
    
    getParentUrl() {
        try {
            return window.parent.location.href;
        } catch (e) {
            return 'Cannot access parent URL';
        }
    }
    
    extractShopFromParentUrl() {
        try {
            // Try to get shop from parent window location
            const parentUrl = window.parent.location.href;
            console.log('🔍 Parent URL:', parentUrl);
            
            // Extract shop from Shopify admin URL patterns
            // e.g., https://admin.shopify.com/store/SHOPNAME/apps/...
            // e.g., https://SHOPNAME.myshopify.com/admin/apps/...
            
            if (parentUrl.includes('admin.shopify.com/store/')) {
                const shopMatch = parentUrl.match(/admin\.shopify\.com\/store\/([^\/]+)/);
                if (shopMatch) {
                    const shopName = shopMatch[1];
                    console.log('✅ Extracted shop from admin URL:', shopName);
                    return shopName + '.myshopify.com';
                }
            }
            
            if (parentUrl.includes('.myshopify.com')) {
                const shopMatch = parentUrl.match(/https?:\/\/([^\/]+)\.myshopify\.com/);
                if (shopMatch) {
                    const shopName = shopMatch[1];
                    console.log('✅ Extracted shop from myshopify URL:', shopName);
                    return shopName + '.myshopify.com';
                }
            }
            
        } catch (e) {
            console.warn('Cannot extract shop from parent URL:', e.message);
        }
        return null;
    }
    
    getShopFromParent() {
        try {
            const parentHostname = window.parent.location.hostname;
            if (parentHostname && parentHostname.includes('.myshopify.com')) {
                console.log('✅ Shop found from parent window:', parentHostname);
                return parentHostname;
            }
        } catch (e) {
            console.warn('Cannot access parent window hostname');
        }
        return null;
    }
    
    getShopFromReferrer() {
        try {
            if (document.referrer) {
                const referrerUrl = new URL(document.referrer);
                if (referrerUrl.hostname.includes('.myshopify.com')) {
                    console.log('✅ Shop found from referrer:', referrerUrl.hostname);
                    return referrerUrl.hostname;
                }
            }
        } catch (e) {
            console.warn('Cannot parse referrer URL');
        }
        return null;
    }
    
    getShopOrigin() {
        // Try to get shop from URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const shop = urlParams.get('shop');
        
        if (shop) {
            return shop.includes('.') ? shop : `${shop}.myshopify.com`;
        }
        
        // Try other methods
        return this.getShopFromParent() || this.getShopFromReferrer() || 'unknown.myshopify.com';
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
                    this.showInstallButton();
                    this.startEmbeddedOAuth();
                    return;
                }
                if (response.status === 403) {
                    console.log('🚫 Permission denied - need content scopes');
                    this.showInstallButton();
                    this.showPermissionError();
                    return;
                }
                throw new Error(`Shopify API Error: ${response.status}`);
            }
            
            const data = await response.json();
            
            // Check if we got demo pages due to missing permissions
            if (data.demoMode && data.needsPermissions) {
                console.log('🎭 Demo mode activated - showing demo pages');
                this.showDemoPages(data.pages, data.message);
                return;
            }
            
            console.log(`✅ Loaded ${data.pages.length} real Shopify pages`);
            
            // Clear any existing demo notice since we have real pages
            this.clearDemoNotice();
            
            // Update URL to show installed=1 for future loads
            const url = new URL(window.location);
            url.searchParams.set('installed', '1');
            window.history.replaceState({}, '', url.toString());
            
            this.pages = data.pages.map(page => {
                const shopName = this.context.shop || this.getShopOrigin();
                const shopDomain = shopName.includes('.') ? shopName : shopName + '.myshopify.com';
                const frontendUrl = `https://${shopDomain}/pages/${page.handle}`;
                
                console.log(`📄 Page: ${page.title}`);
                console.log(`🔗 Shop: ${shopName}`);
                console.log(`🌐 Frontend URL: ${frontendUrl}`);
                
                const dateValue = page.updated_at || page.created_at;
                console.log(`📅 Page "${page.title}" date value:`, dateValue);
                
                return {
                    id: page.id,
                    title: page.title,
                    status: page.published_at ? 'published' : 'draft',
                    lastModified: this.formatDate(dateValue),
                    views: 0, // TODO: Integrate with Google Analytics or Shopify Analytics
                    conversions: 0, // TODO: Integrate with conversion tracking
                    handle: page.handle,
                    shopifyUrl: `https://${shopName}/admin/pages/${page.id}`,
                    frontendUrl: frontendUrl,
                    isShopifyPage: true
                };
            });
            
            // Skip loading KingsBuilder pages - all pages are now loaded from Shopify
            // await this.loadKingsBuilderPages();
            
            this.renderPages();
            
        } catch (error) {
            console.error('❌ Failed to load Shopify pages:', error.message);
            
            // Check if shop is unknown - don't show permission error
            const shop = this.context.shop || this.getShopOrigin();
            if (shop === 'unknown.myshopify.com') {
                console.error('❌ Shop origin not available - cannot load pages');
                this.showError('Shop information not available. Please check if you are accessing the app from within Shopify Admin.');
                return;
            }
            
            // Only show permission error for legitimate auth issues
            if (error.message.includes('403') || error.message.includes('401') || error.message.includes('Unauthorized')) {
                this.showPermissionError();
            } else {
                this.showError('Failed to load pages. Please try again.');
            }
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
        const demoPages = [
            {
                id: 'demo-1',
                title: '🛍️ [DEMO] Homepage Hero Section',
                status: 'published',
                created_at: '2024-01-15T10:00:00Z',
                updated_at: '2024-01-15T10:00:00Z',
                views: 1234,
                conversions: 45,
                isDemo: true
            },
            {
                id: 'demo-2', 
                title: '🛍️ [DEMO] Product Landing Page',
                status: 'draft',
                created_at: '2024-01-14T10:00:00Z',
                updated_at: '2024-01-14T10:00:00Z',
                views: 892,
                conversions: 23,
                isDemo: true
            },
            {
                id: 'demo-3',
                title: '🛍️ [DEMO] About Us Page', 
                status: 'published',
                created_at: '2024-01-13T10:00:00Z',
                updated_at: '2024-01-13T10:00:00Z',
                views: 567,
                conversions: 12,
                isDemo: true
            }
        ];
        
        // Process dates properly 
        this.pages = demoPages.map(page => {
            const dateValue = page.updated_at || page.created_at;
            console.log(`📅 Demo page "${page.title}" date value:`, dateValue);
            return {
                ...page,
                lastModified: this.formatDate(dateValue)
            };
        });
        
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
                this.clearDemoNotice(); // Clear any Install & Connect buttons
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
            if (!dateString) {
                return 'Never';
            }
            
            const date = new Date(dateString);
            
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Never';
            }
            
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch (e) {
            console.warn('Date formatting error:', e);
            return 'Never';
        }
    }

    // TODO: Integrate real analytics data
    async loadAnalyticsData() {
        // Future integration with:
        // - Google Analytics 4
        // - Shopify Analytics  
        // - Custom tracking pixels
        // - Conversion tracking
        console.log('📊 Analytics integration coming soon...');
        return { views: 0, conversions: 0 };
    }

    // Test function to verify URL generation
    testPageUrl(pageId) {
        const page = this.pages.find(p => p.id === pageId);
        if (page) {
            console.log('🔧 URL Test for page:', page.title);
            console.log('🌐 Frontend URL:', page.frontendUrl);
            console.log('🛍️ Shopify URL:', page.shopifyUrl);
            console.log('🎯 Testing URL...');
            
            // Test the URL by opening it
            if (page.frontendUrl && page.frontendUrl !== 'https://undefined/pages/undefined') {
                window.open(page.frontendUrl, '_blank');
            } else {
                console.error('❌ Invalid URL generated!');
                alert('Error: Invalid URL generated. Check console for details.');
            }
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
            const typeColor = page.isShopifyPage ? '#000000' : page.isKingsBuilderPage ? '#667eea' : '#f59e0b';
            
            // Different layout for list view
            if (this.viewMode === 'list') {
                return `
                    <div class="page-card page-card-list ${pageType}" onclick="dashboard.editPage('${page.id}')">
                        <div class="page-preview">
                            <i class="${typeIcon}" style="color: ${typeColor}; font-size: 24px;"></i>
                        </div>
                        <div class="page-info">
                            <div class="page-details">
                                <div class="page-title">${page.title}</div>
                                <div class="page-meta">
                                    <span class="page-status status-${page.status}">${page.status}</span>
                                    <span class="page-date">${page.lastModified}</span>
                                    <span class="page-stats">${page.views || 0} views • ${page.conversions || 0} conversions</span>
                                </div>
                            </div>
                        </div>
                        <div class="page-type-badge" style="background: ${typeColor}; color: white;">
                            ${typeLabel}
                        </div>
                        <div class="page-actions">
                            ${page.isShopifyPage ? `
                                <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); window.open('${page.shopifyUrl}', '_blank')" title="Open in Shopify Admin">
                                    <i class="fas fa-external-link-alt"></i>
                                </button>
                                <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); window.open('${page.frontendUrl}', '_blank')" title="View Page">
                                    <i class="fas fa-eye"></i>
                                </button>
                            ` : ''}
                            ${page.isKingsBuilderPage || page.isDemo ? `
                                <button class="btn btn-sm btn-secondary" onclick="event.stopPropagation(); dashboard.duplicatePage('${page.id}')" title="Duplicate">
                                    <i class="fas fa-copy"></i>
                                </button>
                            ` : ''}
                            <button class="btn btn-sm btn-primary" onclick="event.stopPropagation(); dashboard.editPage('${page.id}')" title="Edit with KingsBuilder">
                                <i class="fas fa-edit"></i>
                                Edit with KB
                            </button>
                        </div>
                    </div>
                `;
            } else {
                // Grid view (original layout)
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
            }
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
        console.log('🚀 Creating new page...');
        
        const titleInput = document.getElementById('pageTitle');
        const typeSelect = document.getElementById('pageType');
        
        console.log('Title input:', titleInput);
        console.log('Type select:', typeSelect);
        
        if (!titleInput || !typeSelect) {
            console.error('❌ Modal form elements not found');
            alert('Error: Form elements not found');
            return;
        }
        
        const title = titleInput.value.trim();
        const type = typeSelect.value;
        
        console.log('Page title:', title);
        console.log('Page type:', type);
        
        if (!title) {
            alert('Please enter a page title');
            return;
        }
        
        this.showLoading();
        
        try {
            const shop = this.context.shop || this.getShopOrigin();
            
            if (shop === 'unknown.myshopify.com') {
                console.error('❌ Cannot create page - shop not available');
                alert('Error: Shop information not available. Please refresh the page and try again.');
                return;
            }
            
            console.log('🚀 Creating page with shop:', shop);
            
            // Create real Shopify page
            const response = await fetch('/api/pages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Include cookies for authentication
                body: JSON.stringify({
                    title: title,
                    url: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                    status: 'draft',
                    html: '<div class="page-content"><h1>' + title + '</h1><p>Start building your page...</p></div>',
                    css: '',
                    elements: [],
                    shop: shop
                })
            });
            
            if (response.ok) {
                const result = await response.json();
                console.log('✅ Created new Shopify page:', result);
                
                // Don't add to local array - it will be loaded from Shopify
                this.hideModal();
                
                // Redirect to builder with proper parameters
                const builderUrl = `/builder?pageId=${result.page.id}&title=${encodeURIComponent(title)}&shop=${this.context.shop}&embedded=1`;
                console.log('🔧 Redirecting to builder:', builderUrl);
                window.location.href = builderUrl;
                
            } else {
                const error = await response.json();
                throw new Error(error.message || 'Failed to create page');
            }
            
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
            const shop = this.context.shop || this.getShopOrigin();
            
            if (shop === 'unknown.myshopify.com') {
                console.error('❌ Shop origin not available - cannot edit page');
                alert('Error: Shop information not available. Please refresh the page and try again.');
                return;
            }
            
            const builderUrl = `/builder?pageId=${pageId}&title=${encodeURIComponent(page.title)}&shop=${shop}&embedded=1`;
            
            console.log('🔧 Opening page editor:', builderUrl);
            console.log('🔧 Shop:', shop);
            console.log('🔧 Page ID:', pageId);
            
            // For embedded apps, navigate within the current window
            if (this.context.embedded === '1') {
                window.location.href = builderUrl;
            } else {
                window.open(builderUrl, '_blank');
            }
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
    
    showDemoPages(demoPages, message) {
        console.log('🎭 Showing demo pages:', demoPages);
        
        // Store demo pages
        this.pages = demoPages.map(page => {
            console.log(`📅 Demo page "${page.title}" date value:`, page.lastModified);
            return {
                id: page.id,
                title: page.title,
                status: page.status,
                lastModified: this.formatDate(page.lastModified),
                views: page.views,
                conversions: page.conversions,
                handle: page.handle,
                shopifyUrl: page.shopifyUrl,
                frontendUrl: page.frontendUrl,
                isShopifyPage: true,
                isDemoPage: true
            };
        });
        
        // Show demo notice
        this.showDemoNotice(message);
        
        // Render the demo pages
        this.renderPages();
    }
    
    clearDemoNotice() {
        const existingNotice = document.querySelector('.demo-notice');
        if (existingNotice) {
            existingNotice.remove();
            console.log('🧹 Cleared demo notice - app is now properly connected');
        }
        
        // Also hide the Install & Connect button
        const installBtn = document.getElementById('installConnectBtn');
        if (installBtn) {
            installBtn.style.display = 'none';
            console.log('🧹 Hid Install & Connect button - app is connected');
        }
    }
    
    showInstallButton() {
        const installBtn = document.getElementById('installConnectBtn');
        if (installBtn) {
            installBtn.style.display = 'inline-block';
            console.log('🔧 Showing Install & Connect button - connection needed');
        }
    }
    
    showDemoNotice(message) {
        // Add demo notice at the top of the page
        const existingNotice = document.querySelector('.demo-notice');
        if (existingNotice) {
            existingNotice.remove();
        }
        
        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            const notice = document.createElement('div');
            notice.className = 'demo-notice';
            notice.innerHTML = `
                <div class="alert alert-info">
                    <div class="alert-content">
                        <i class="fas fa-info-circle"></i>
                        <div>
                            <strong>Demo Mode:</strong> ${message}
                            <div class="demo-actions">
                                <button class="btn btn-primary btn-sm" onclick="window.dashboard.forceReinstall()">
                                    <i class="fas fa-sync-alt"></i>
                                    Install & Connect
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            mainContent.insertBefore(notice, mainContent.firstChild);
        }
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
                    <button class="btn btn-primary" onclick="window.dashboard.forceReinstall()">
                        <i class="fas fa-sync-alt"></i>
                        Clear Cache & Reinstall
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
    
    forceReinstall() {
        console.log('🧹 Force clearing cache and reinstalling...');
        
        // Clear all cookies
        document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
        });
        
        // Clear localStorage
        localStorage.clear();
        
        // Clear sessionStorage
        sessionStorage.clear();
        
        // Get shop from URL
        const shop = this.getShopOrigin();
        if (!shop) {
            alert('Could not detect shop domain. Please try again from your Shopify admin.');
            return;
        }
        
        // Add timestamp to force fresh install
        const timestamp = Date.now();
        const reinstallUrl = `/?shop=${shop}&force_reauth=true&clear_cache=${timestamp}`;
        console.log('🚀 Redirecting to clean install:', reinstallUrl);
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