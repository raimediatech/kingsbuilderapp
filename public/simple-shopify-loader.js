// Simple Shopify Content Loader - Just load and display the content
console.log('📄 Simple Shopify Loader - Starting...');

class SimpleShopifyLoader {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.pageData = null;
    }

    // Get URL parameters
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            shop: urlParams.get('shop') || 'kingsbuilder.myshopify.com',
            page: urlParams.get('page') || urlParams.get('pageId')
        };
    }

    // Load and display content
    async loadContent() {
        if (!this.isBuilder) {
            console.log('Not on builder page, skipping');
            return;
        }

        const params = this.getUrlParams();
        
        if (!params.page || !params.shop) {
            console.log('No page ID or shop found');
            return;
        }

        try {
            console.log(`🔄 Loading page ${params.page} from ${params.shop}`);
            
            const response = await fetch(`/api/pages/${params.page}?shop=${encodeURIComponent(params.shop)}`);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            console.log('📡 API Response:', data);
            
            if (data.success && data.page && data.page.body_html) {
                console.log('✅ Found page content');
                this.displayContent(data.page.body_html);
            } else {
                console.log('⚠️ No content found in response');
                this.showNoContent();
            }
            
        } catch (error) {
            console.error('❌ Failed to load content:', error);
            this.showError(error.message);
        }
    }

    // Display content in the canvas
    displayContent(htmlContent) {
        const canvas = this.findCanvas();
        if (!canvas) {
            console.log('No canvas found');
            return;
        }

        console.log('📝 Displaying content in canvas');
        
        // Clear canvas
        canvas.innerHTML = '';
        
        // Create content container
        const container = document.createElement('div');
        container.className = 'shopify-content';
        container.style.cssText = `
            padding: 20px;
            background: white;
            border-radius: 8px;
            margin: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            min-height: 400px;
        `;
        
        // Add content
        container.innerHTML = `
            <div style="background: #007cba; color: white; padding: 10px 15px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0;">
                <h3 style="margin: 0; font-size: 16px;">📄 Shopify Page Content</h3>
            </div>
            <div class="content-area" style="line-height: 1.6;">
                ${htmlContent}
            </div>
        `;
        
        canvas.appendChild(container);
        console.log('✅ Content displayed');
    }

    // Show no content message
    showNoContent() {
        const canvas = this.findCanvas();
        if (!canvas) return;
        
        canvas.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">📄</div>
                <h3>No Content Found</h3>
                <p>This Shopify page doesn't have any content yet.</p>
                <button onclick="window.SimpleShopifyLoader.retry()" style="
                    background: #007cba; 
                    color: white; 
                    border: none; 
                    padding: 10px 20px; 
                    border-radius: 5px; 
                    cursor: pointer;
                    margin-top: 15px;
                ">
                    🔄 Retry
                </button>
            </div>
        `;
    }

    // Show error message
    showError(message) {
        const canvas = this.findCanvas();
        if (!canvas) return;
        
        canvas.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                <h3 style="color: #d32f2f;">Loading Error</h3>
                <p>Failed to load page content:</p>
                <p style="color: #d32f2f; font-family: monospace; background: #fff3f3; padding: 10px; border-radius: 4px; margin: 15px 0;">
                    ${message}
                </p>
                <button onclick="window.SimpleShopifyLoader.retry()" style="
                    background: #007cba; 
                    color: white; 
                    border: none; 
                    padding: 10px 20px; 
                    border-radius: 5px; 
                    cursor: pointer;
                    margin-top: 15px;
                ">
                    🔄 Retry
                </button>
            </div>
        `;
    }

    // Find canvas area
    findCanvas() {
        const selectors = [
            '#kingsbuilder-preview',
            '#main-drop-zone',
            '.kingsbuilder-preview',
            '.canvas-drop-zone',
            '#canvas-content',
            '.canvas-area',
            '.drop-zone',
            '.builder-canvas',
            '.preview-area',
            'main'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`✅ Found canvas: ${selector}`);
                return element;
            }
        }
        
        console.log('❌ No canvas found');
        return null;
    }

    // Retry loading
    async retry() {
        console.log('🔄 Retrying...');
        const canvas = this.findCanvas();
        if (canvas) {
            canvas.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 32px; animation: spin 1s linear infinite;">⟳</div>
                    <p>Loading...</p>
                </div>
                <style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>
            `;
        }
        await this.loadContent();
    }

    // Initialize
    async initialize() {
        console.log('🚀 Initializing Simple Shopify Loader...');
        
        if (!this.isBuilder) {
            console.log('Not on builder page');
            return;
        }
        
        // Wait for page to be ready
        setTimeout(async () => {
            await this.loadContent();
        }, 3000);
        
        console.log('✅ Simple Shopify Loader initialized');
    }
}

// Create instance
const simpleShopifyLoader = new SimpleShopifyLoader();

// Export for global access
window.SimpleShopifyLoader = {
    initialize: () => simpleShopifyLoader.initialize(),
    loadContent: () => simpleShopifyLoader.loadContent(),
    retry: () => simpleShopifyLoader.retry()
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        simpleShopifyLoader.initialize();
    });
} else {
    simpleShopifyLoader.initialize();
}

console.log('✅ Simple Shopify Loader loaded');