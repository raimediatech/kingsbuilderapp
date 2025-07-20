// 🚀 PUBLISH FIX - Fix the publish function to actually save content to Shopify
console.log('🚀 PUBLISH FIX: Loading actual publish functionality...');

class PublishFix {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        
        if (this.isBuilder) {
            this.init();
        }
    }

    init() {
        console.log('🔧 Initializing publish fix...');
        
        // Wait for page to load then fix publish functions
        setTimeout(() => {
            this.fixPublishFunctions();
            console.log('✅ PUBLISH FIX: Actual publish functionality loaded!');
        }, 2000);
    }

    fixPublishFunctions() {
        console.log('🔧 Fixing publish functions...');
        
        // Override all existing publish functions with the real one
        window.publishPage = () => this.publishPage();
        
        // Fix CRITICAL-BUILDER-FIX publish function
        if (window.__CRITICAL_BUILDER_FIX__) {
            window.__CRITICAL_BUILDER_FIX__.publishPage = () => this.publishPage();
        }
        
        // Fix any other publish functions
        if (window.kingsBuilder) {
            window.kingsBuilder.publishPage = () => this.publishPage();
        }
        
        // Fix publish buttons
        document.querySelectorAll('[onclick*="publishPage"], .publish-btn, #publish-btn').forEach(btn => {
            btn.onclick = () => this.publishPage();
        });
        
        console.log('✅ All publish functions fixed to use real API calls');
    }

    async publishPage() {
        console.log('🚀 PUBLISH FIX: Actually publishing page to Shopify...');
        
        try {
            // Get page information from URL
            const urlParams = new URLSearchParams(window.location.search);
            const pageId = urlParams.get('pageId');
            const shop = urlParams.get('shop') || this.getShopFromContext();
            
            if (!pageId) {
                throw new Error('No page ID found. Cannot publish page.');
            }
            
            if (!shop) {
                throw new Error('No shop found. Cannot publish page.');
            }
            
            console.log(`📄 Publishing page ${pageId} for shop: ${shop}`);
            
            // Get current page content from canvas
            const content = this.getCurrentPageContent();
            
            if (!content) {
                throw new Error('No content found to publish.');
            }
            
            console.log(`📝 Content length: ${content.length} characters`);
            
            // Show loading state
            this.showLoadingMessage('Publishing page to Shopify...');
            
            // Make API call to update page
            const response = await fetch(`/api/pages/${pageId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    shop: shop,
                    content: content,
                    // Optional: include title if it was changed
                    // title: this.getCurrentPageTitle()
                })
            });
            
            const result = await response.json();
            
            if (result.success) {
                console.log('✅ Page published successfully!');
                this.hideLoadingMessage();
                this.showSuccessMessage('🚀 Page published successfully! Your changes are now live on your store.');
                
                // Optional: Refresh page data
                this.refreshPageData();
                
            } else {
                throw new Error(result.error || 'Failed to publish page');
            }
            
        } catch (error) {
            console.error('❌ Publish failed:', error);
            this.hideLoadingMessage();
            this.showErrorMessage(`Failed to publish page: ${error.message}`);
        }
    }

    getCurrentPageContent() {
        // Get content from canvas
        const canvas = document.querySelector('.canvas, .builder-canvas, #canvas, .canvas-frame');
        
        if (!canvas) {
            console.warn('⚠️ No canvas found');
            return null;
        }
        
        // Clone canvas to clean it up
        const canvasClone = canvas.cloneNode(true);
        
        // Remove builder-specific elements
        canvasClone.querySelectorAll('.kb-element-controls, .element-controls, .builder-controls').forEach(el => el.remove());
        canvasClone.querySelectorAll('.drop-zone, .drop-indicator').forEach(el => el.remove());
        canvasClone.querySelectorAll('.empty-canvas').forEach(el => el.remove());
        
        // Remove builder-specific attributes
        canvasClone.querySelectorAll('*').forEach(el => {
            el.removeAttribute('data-drop-zone');
            el.removeAttribute('data-drop-zone-setup');
            el.removeAttribute('draggable');
            el.removeAttribute('contenteditable');
            
            // Remove builder-specific classes
            if (el.className) {
                el.className = el.className
                    .replace(/\bdrop-zone\b/g, '')
                    .replace(/\bbuilder-\w+\b/g, '')
                    .replace(/\bkb-\w+\b/g, '')
                    .replace(/\s+/g, ' ')
                    .trim();
            }
        });
        
        const content = canvasClone.innerHTML;
        console.log('📄 Extracted content for publishing:', content.substring(0, 200) + '...');
        
        return content;
    }

    getCurrentPageTitle() {
        // Try to get title from page title input or h1
        const titleInput = document.querySelector('input[name="title"], #page-title');
        if (titleInput && titleInput.value) {
            return titleInput.value;
        }
        
        const h1 = document.querySelector('h1');
        if (h1 && h1.textContent) {
            return h1.textContent.trim();
        }
        
        return null;
    }

    getShopFromContext() {
        // Try multiple methods to get shop
        
        // Method 1: From URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        let shop = urlParams.get('shop');
        if (shop) return shop;
        
        // Method 2: From cookies
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === 'shopOrigin' || name === 'shop') {
                return value;
            }
        }
        
        // Method 3: From global variables
        if (window.shopOrigin) return window.shopOrigin;
        if (window.shop) return window.shop;
        
        // Method 4: From context (if available)
        if (window.kingsBuilderContext && window.kingsBuilderContext.shop) {
            return window.kingsBuilderContext.shop;
        }
        
        console.warn('⚠️ Could not determine shop from context');
        return null;
    }

    showLoadingMessage(message) {
        // Remove existing loading message
        this.hideLoadingMessage();
        
        const loading = document.createElement('div');
        loading.id = 'publish-loading';
        loading.innerHTML = `
            <div style="
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 25000;
                font-family: 'Inter', sans-serif;
            ">
                <div style="
                    background: white;
                    padding: 40px;
                    border-radius: 12px;
                    text-align: center;
                    max-width: 400px;
                    width: 90%;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.3);
                ">
                    <div style="
                        width: 50px;
                        height: 50px;
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #3b82f6;
                        border-radius: 50%;
                        animation: spin 1s linear infinite;
                        margin: 0 auto 20px;
                    "></div>
                    <h3 style="margin: 0 0 10px 0; color: #1f2937; font-size: 18px;">${message}</h3>
                    <p style="margin: 0; color: #6b7280; font-size: 14px;">Please wait while we save your changes...</p>
                </div>
            </div>
            
            <style>
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        `;
        
        document.body.appendChild(loading);
    }

    hideLoadingMessage() {
        const loading = document.getElementById('publish-loading');
        if (loading) {
            loading.remove();
        }
    }

    showSuccessMessage(message) {
        const success = document.createElement('div');
        success.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #10b981 0%, #059669 100%);
                color: white;
                padding: 20px 25px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(16, 185, 129, 0.3);
                z-index: 30000;
                font-family: 'Inter', sans-serif;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            ">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="
                        width: 24px;
                        height: 24px;
                        background: rgba(255,255,255,0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <i class="fas fa-check" style="font-size: 12px;"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; margin-bottom: 4px;">Success!</div>
                        <div style="font-size: 14px; opacity: 0.9;">${message}</div>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes slideInRight {
                    0% { transform: translateX(100%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(success);
        
        setTimeout(() => {
            success.remove();
        }, 5000);
    }

    showErrorMessage(message) {
        const error = document.createElement('div');
        error.innerHTML = `
            <div style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
                color: white;
                padding: 20px 25px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(239, 68, 68, 0.3);
                z-index: 30000;
                font-family: 'Inter', sans-serif;
                max-width: 400px;
                animation: slideInRight 0.3s ease;
            ">
                <div style="display: flex; align-items: center; gap: 12px;">
                    <div style="
                        width: 24px;
                        height: 24px;
                        background: rgba(255,255,255,0.2);
                        border-radius: 50%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                    ">
                        <i class="fas fa-exclamation-triangle" style="font-size: 12px;"></i>
                    </div>
                    <div>
                        <div style="font-weight: 600; margin-bottom: 4px;">Error</div>
                        <div style="font-size: 14px; opacity: 0.9;">${message}</div>
                    </div>
                </div>
            </div>
            
            <style>
                @keyframes slideInRight {
                    0% { transform: translateX(100%); opacity: 0; }
                    100% { transform: translateX(0); opacity: 1; }
                }
            </style>
        `;
        
        document.body.appendChild(error);
        
        setTimeout(() => {
            error.remove();
        }, 7000);
    }

    refreshPageData() {
        // Optional: Refresh page data after successful publish
        console.log('🔄 Refreshing page data...');
        
        // You could add logic here to refresh the page list or update timestamps
        // For now, just log that the page was published
        const timestamp = new Date().toLocaleString();
        console.log(`✅ Page published at: ${timestamp}`);
    }
}

// Initialize the publish fix
console.log('🚀 PUBLISH FIX: Initializing...');
window.publishFix = new PublishFix();

console.log('✅ PUBLISH FIX: Real publish functionality loaded!');