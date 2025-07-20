// PROPER FIX - Only fix icons and load content WITHOUT breaking toolbar
console.log('🔧 PROPER FIX - Starting...');

class ProperFix {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.pageData = null;
    }

    // Fix icons ONLY
    fixIcons() {
        console.log('🎨 Fixing icons...');
        
        // Remove existing icon styles
        const existingStyles = document.querySelectorAll('#icon-fix-style, #simple-icon-fix-css, #final-icon-fix, #builder-icon-fix');
        existingStyles.forEach(style => style.remove());
        
        // Add simple icon fix
        const style = document.createElement('style');
        style.id = 'proper-icon-fix';
        style.textContent = `
            /* FORCE ALL ICONS TO BE BLACK AND VISIBLE */
            i, .fa, .fas, .far, .fab, .fal, .fad, .fass, .fasr, .fasl,
            [class*="fa-"], [class^="fa-"], .icon, .material-icons {
                color: #000000 !important;
                fill: #000000 !important;
                display: inline-block !important;
                visibility: visible !important;
                opacity: 1 !important;
                font-family: "Font Awesome 6 Free" !important;
                font-weight: 900 !important;
                font-style: normal !important;
            }
            
            /* Keep white icons on colored backgrounds */
            .btn-primary i, .primary i, .toolbar-btn.primary i,
            [style*="background-color: #007cba"] i,
            [style*="background: #007cba"] i,
            .active i, .selected i {
                color: #ffffff !important;
                fill: #ffffff !important;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Icons fixed');
    }

    // Load Shopify content into the CORRECT canvas area
    async loadShopifyContent() {
        if (!this.isBuilder) return;
        
        const params = this.getUrlParams();
        if (!params.page || !params.shop) {
            console.log('No page ID or shop found');
            return;
        }
        
        try {
            console.log(`📄 Loading Shopify content for page ${params.page}`);
            
            const response = await fetch(`/api/pages/${params.page}?shop=${encodeURIComponent(params.shop)}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.success && data.page && data.page.body_html) {
                console.log('✅ Shopify content loaded, displaying in canvas');
                this.displayInCanvas(data.page.body_html);
            } else {
                console.log('⚠️ No Shopify content found');
                this.showEmptyCanvas();
            }
            
        } catch (error) {
            console.error('❌ Failed to load Shopify content:', error);
            this.showEmptyCanvas();
        }
    }

    // Display content in the CORRECT canvas area (not replacing toolbar)
    displayInCanvas(htmlContent) {
        // Find the correct canvas content area
        const canvasFrame = document.querySelector('.canvas-frame');
        
        if (!canvasFrame) {
            console.log('❌ Canvas frame not found');
            return;
        }
        
        console.log('📝 Displaying content in canvas frame');
        
        // FORCE REMOVE ALL EMPTY CANVAS ELEMENTS
        const emptyCanvasElements = document.querySelectorAll('.empty-canvas');
        emptyCanvasElements.forEach(element => {
            console.log('🗑️ Removing empty canvas element');
            element.remove();
        });
        
        // Clear the entire canvas frame
        canvasFrame.innerHTML = '';
        
        // Create content container that fills the canvas
        const contentContainer = document.createElement('div');
        contentContainer.className = 'shopify-content-container';
        contentContainer.style.cssText = `
            width: 100%;
            height: 100%;
            padding: 20px;
            background: white;
            min-height: 600px;
            position: relative;
            z-index: 10;
        `;
        
        // Add the Shopify content directly
        contentContainer.innerHTML = htmlContent;
        
        // Make content editable
        this.makeContentEditable(contentContainer);
        
        // Add to canvas frame
        canvasFrame.appendChild(contentContainer);
        
        // Force show the content
        contentContainer.style.display = 'block';
        contentContainer.style.visibility = 'visible';
        contentContainer.style.opacity = '1';
        
        console.log('✅ Content displayed and empty canvas removed');
    }

    // Show empty canvas if no content
    showEmptyCanvas() {
        const canvasFrame = document.querySelector('.canvas-frame');
        if (!canvasFrame) return;
        
        // Don't replace if empty canvas already exists
        if (document.querySelector('.empty-canvas')) {
            console.log('Empty canvas already exists');
            return;
        }
        
        const emptyDiv = document.createElement('div');
        emptyDiv.className = 'empty-canvas';
        emptyDiv.innerHTML = `
            <div class="empty-canvas-icon">
                <i class="fas fa-magic"></i>
            </div>
            <h2>No Content Found</h2>
            <p>This Shopify page doesn't have content yet. Start building!</p>
        `;
        
        canvasFrame.appendChild(emptyDiv);
    }

    // Make content editable
    makeContentEditable(container) {
        const editableElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span, li, td, th');
        
        editableElements.forEach(element => {
            // Skip if already has contenteditable
            if (element.hasAttribute('contenteditable')) return;
            
            element.contentEditable = true;
            element.style.outline = 'none';
            
            element.addEventListener('focus', () => {
                element.style.backgroundColor = '#fff3cd';
                element.style.border = '1px dashed #007cba';
                element.style.padding = '5px';
            });
            
            element.addEventListener('blur', () => {
                element.style.backgroundColor = 'transparent';
                element.style.border = 'none';
                element.style.padding = '0';
            });
        });
        
        console.log(`✅ Made ${editableElements.length} elements editable`);
    }

    // Get URL parameters
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            shop: urlParams.get('shop') || 'kingsbuilder.myshopify.com',
            page: urlParams.get('page') || urlParams.get('pageId')
        };
    }

    // Force remove empty canvas
    forceRemoveEmptyCanvas() {
        console.log('🗑️ Force removing empty canvas...');
        
        const emptyCanvasElements = document.querySelectorAll('.empty-canvas');
        emptyCanvasElements.forEach(element => {
            console.log('🗑️ Removing empty canvas element');
            element.style.display = 'none';
            element.remove();
        });
        
        // Also remove any hidden empty canvas
        const hiddenElements = document.querySelectorAll('[style*="display: none"]');
        hiddenElements.forEach(element => {
            if (element.classList.contains('empty-canvas')) {
                element.remove();
            }
        });
        
        console.log('✅ Empty canvas elements removed');
    }

    // Initialize
    async initialize() {
        if (!this.isBuilder) {
            console.log('Not on builder page');
            return;
        }
        
        console.log('🚀 Initializing Proper Fix...');
        
        // Fix icons immediately
        this.fixIcons();
        
        // Force remove empty canvas immediately
        this.forceRemoveEmptyCanvas();
        
        // Wait for DOM to be ready, then load content
        setTimeout(async () => {
            // Remove empty canvas again before loading content
            this.forceRemoveEmptyCanvas();
            await this.loadShopifyContent();
        }, 1000);
        
        // Remove empty canvas one more time after content loads
        setTimeout(() => {
            this.forceRemoveEmptyCanvas();
        }, 5000);
        
        console.log('✅ Proper Fix initialized');
    }
}

// Create instance
const properFix = new ProperFix();

// Export for global access
window.ProperFix = {
    initialize: () => properFix.initialize(),
    fixIcons: () => properFix.fixIcons(),
    loadContent: () => properFix.loadShopifyContent(),
    removeEmptyCanvas: () => properFix.forceRemoveEmptyCanvas()
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        properFix.initialize();
    });
} else {
    properFix.initialize();
}

console.log('✅ PROPER FIX loaded');