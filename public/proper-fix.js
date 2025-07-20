// PROPER FIX - Only fix icons and load content WITHOUT breaking toolbar
console.log('🔧 PROPER FIX - Starting...');

class ProperFix {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.pageData = null;
    }

    // AGGRESSIVE ICON FIX - FORCE ALL ICONS TO WORK
    fixIcons() {
        console.log('🎨 AGGRESSIVE icon fixing...');
        
        // Remove existing icon styles
        const existingStyles = document.querySelectorAll('#icon-fix-style, #simple-icon-fix-css, #final-icon-fix, #builder-icon-fix, #proper-icon-fix');
        existingStyles.forEach(style => style.remove());
        
        // Add AGGRESSIVE icon fix
        const style = document.createElement('style');
        style.id = 'aggressive-icon-fix';
        style.textContent = `
            /* FORCE ALL ICONS TO BE BLACK AND VISIBLE - AGGRESSIVE */
            * i, * .fa, * .fas, * .far, * .fab, * .fal, * .fad, * .fass, * .fasr, * .fasl,
            * [class*="fa-"], * [class^="fa-"], * .icon, * .material-icons,
            i, .fa, .fas, .far, .fab, .fal, .fad, .fass, .fasr, .fasl,
            [class*="fa-"], [class^="fa-"], .icon, .material-icons,
            .sidebar i, .toolbar i, .menu i, .nav i, .btn i, .button i,
            .tab-btn i, .control-btn i, .action-btn i, .toolbar-btn i,
            .sidebar-icon, .menu-icon, .toolbar-icon, .nav-icon {
                color: #000000 !important;
                fill: #000000 !important;
                display: inline-block !important;
                visibility: visible !important;
                opacity: 1 !important;
                font-family: "Font Awesome 6 Free", "Font Awesome 6 Pro", "FontAwesome", "Font Awesome 5 Free", "Font Awesome 5 Pro" !important;
                font-weight: 900 !important;
                font-style: normal !important;
                text-rendering: auto !important;
                -webkit-font-smoothing: antialiased !important;
                -moz-osx-font-smoothing: grayscale !important;
                width: auto !important;
                height: auto !important;
                line-height: 1 !important;
                vertical-align: baseline !important;
                font-size: inherit !important;
                text-decoration: none !important;
                text-transform: none !important;
                letter-spacing: normal !important;
                word-wrap: normal !important;
                white-space: nowrap !important;
                direction: ltr !important;
                -webkit-font-feature-settings: normal !important;
                font-feature-settings: normal !important;
                font-variant: normal !important;
                text-indent: 0 !important;
                position: relative !important;
                z-index: 1 !important;
            }
            
            /* Force specific icon content */
            .fa-plus::before, .fas.fa-plus::before { content: "\\f067" !important; }
            .fa-edit::before, .fas.fa-edit::before { content: "\\f044" !important; }
            .fa-trash::before, .fas.fa-trash::before { content: "\\f1f8" !important; }
            .fa-save::before, .fas.fa-save::before { content: "\\f0c7" !important; }
            .fa-cog::before, .fas.fa-cog::before { content: "\\f013" !important; }
            .fa-gear::before, .fas.fa-gear::before { content: "\\f013" !important; }
            .fa-settings::before, .fas.fa-settings::before { content: "\\f013" !important; }
            .fa-bars::before, .fas.fa-bars::before { content: "\\f0c9" !important; }
            .fa-times::before, .fas.fa-times::before { content: "\\f00d" !important; }
            .fa-close::before, .fas.fa-close::before { content: "\\f00d" !important; }
            .fa-home::before, .fas.fa-home::before { content: "\\f015" !important; }
            .fa-user::before, .fas.fa-user::before { content: "\\f007" !important; }
            .fa-file::before, .fas.fa-file::before { content: "\\f15b" !important; }
            .fa-folder::before, .fas.fa-folder::before { content: "\\f07b" !important; }
            .fa-image::before, .fas.fa-image::before { content: "\\f03e" !important; }
            .fa-desktop::before, .fas.fa-desktop::before { content: "\\f108" !important; }
            .fa-tablet-alt::before, .fas.fa-tablet-alt::before { content: "\\f3fa" !important; }
            .fa-mobile-alt::before, .fas.fa-mobile-alt::before { content: "\\f3cd" !important; }
            .fa-search-minus::before, .fas.fa-search-minus::before { content: "\\f010" !important; }
            .fa-search-plus::before, .fas.fa-search-plus::before { content: "\\f00e" !important; }
            .fa-eye::before, .fas.fa-eye::before { content: "\\f06e" !important; }
            .fa-rocket::before, .fas.fa-rocket::before { content: "\\f135" !important; }
            .fa-magic::before, .fas.fa-magic::before { content: "\\f0d0" !important; }
            .fa-expand-alt::before, .fas.fa-expand-alt::before { content: "\\f424" !important; }
            .fa-anchor::before, .fas.fa-anchor::before { content: "\\f13d" !important; }
            .fa-arrow-left::before, .fas.fa-arrow-left::before { content: "\\f060" !important; }
            .fa-mouse-pointer::before, .fas.fa-mouse-pointer::before { content: "\\f245" !important; }
            .fa-text::before, .fas.fa-text::before { content: "\\f031" !important; }
            .fa-heading::before, .fas.fa-heading::before { content: "\\f1dc" !important; }
            .fa-paragraph::before, .fas.fa-paragraph::before { content: "\\f1dd" !important; }
            .fa-list::before, .fas.fa-list::before { content: "\\f03a" !important; }
            .fa-table::before, .fas.fa-table::before { content: "\\f0ce" !important; }
            .fa-video::before, .fas.fa-video::before { content: "\\f03d" !important; }
            .fa-wpforms::before, .fas.fa-wpforms::before { content: "\\f298" !important; }
            .fa-hand-pointer::before, .fas.fa-hand-pointer::before { content: "\\f25a" !important; }
            
            /* Keep white icons on colored backgrounds */
            .btn-primary i, .primary i, .toolbar-btn.primary i,
            [style*="background-color: #007cba"] i,
            [style*="background: #007cba"] i,
            .active i, .selected i,
            .toolbar-btn.primary i {
                color: #ffffff !important;
                fill: #ffffff !important;
            }
            
            /* Force Font Awesome to load */
            @import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css');
        `;
        document.head.appendChild(style);
        
        // Also force reload Font Awesome
        this.forceLoadFontAwesome();
        
        console.log('✅ AGGRESSIVE icon fix applied');
    }
    
    // Force load Font Awesome
    forceLoadFontAwesome() {
        console.log('🔄 Force loading Font Awesome...');
        
        // Remove existing Font Awesome links
        const existingFA = document.querySelectorAll('link[href*="font-awesome"]');
        existingFA.forEach(link => link.remove());
        
        // Add Font Awesome 6
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
        faLink.crossOrigin = 'anonymous';
        document.head.appendChild(faLink);
        
        console.log('✅ Font Awesome force loaded');
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

    // Display content ONLY if canvas is empty (no duplicate frames)
    displayInCanvas(htmlContent) {
        // Find the correct canvas content area
        const canvasFrame = document.querySelector('.canvas-frame');
        
        if (!canvasFrame) {
            console.log('❌ Canvas frame not found');
            return;
        }
        
        // CHECK IF CANVAS ALREADY HAS CONTENT (not just empty canvas)
        const hasRealContent = canvasFrame.children.length > 0 && 
                              !canvasFrame.querySelector('.empty-canvas') &&
                              canvasFrame.innerHTML.trim().length > 100;
        
        if (hasRealContent) {
            console.log('✅ Canvas already has content, not replacing');
            console.log('📄 Existing content length:', canvasFrame.innerHTML.length);
            
            // Just make existing content editable
            this.makeContentEditable(canvasFrame);
            return;
        }
        
        console.log('📝 Canvas is empty, adding Shopify content');
        
        // ONLY REMOVE EMPTY CANVAS ELEMENTS
        const emptyCanvasElements = document.querySelectorAll('.empty-canvas');
        emptyCanvasElements.forEach(element => {
            console.log('🗑️ Removing empty canvas element');
            element.remove();
        });
        
        // Only add content if canvas is truly empty
        if (canvasFrame.innerHTML.trim().length < 100) {
            // Put Shopify content DIRECTLY in canvas frame
            canvasFrame.innerHTML = htmlContent;
            
            // Style the canvas frame itself
            canvasFrame.style.cssText = `
                padding: 20px;
                background: white;
                min-height: 600px;
                width: 100%;
                height: auto;
                overflow: auto;
            `;
            
            console.log('✅ Shopify content added to empty canvas');
        }
        
        // Make content editable
        this.makeContentEditable(canvasFrame);
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