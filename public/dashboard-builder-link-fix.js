// Dashboard Builder Link Fix - Make Edit buttons work properly
console.log('🔗 Loading Dashboard Builder Link Fix...');

class DashboardBuilderLinkFix {
    constructor() {
        this.currentShop = null;
        this.isInitialized = false;
    }

    // Get current shop
    getCurrentShop() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('shop') || 'kingsbuilder.myshopify.com';
    }

    // Fix all edit buttons
    fixEditButtons() {
        console.log('🔧 Fixing edit buttons...');
        
        // Find all edit buttons
        const editButtons = document.querySelectorAll('.edit-btn, .btn-edit, [onclick*="editPage"], .page-card .btn');
        
        let fixedCount = 0;
        
        editButtons.forEach(button => {
            // Get page ID from various sources
            let pageId = null;
            
            // Try to get from data attributes
            pageId = button.dataset.pageId || 
                    button.dataset.id ||
                    button.closest('.page-card')?.dataset.pageId ||
                    button.closest('.page-card')?.dataset.id;
            
            // Try to get from onclick attribute
            if (!pageId) {
                const onclick = button.getAttribute('onclick');
                if (onclick) {
                    const match = onclick.match(/editPage\((\d+)\)|(\d+)/);
                    if (match) {
                        pageId = match[1] || match[2];
                    }
                }
            }
            
            // Try to get from parent elements
            if (!pageId) {
                const pageCard = button.closest('.page-card, .page-item, [data-page-id], [data-id]');
                if (pageCard) {
                    pageId = pageCard.dataset.pageId || 
                            pageCard.dataset.id ||
                            pageCard.querySelector('[data-page-id]')?.dataset.pageId;
                }
            }
            
            if (pageId) {
                console.log(`🔧 Fixing edit button for page ${pageId}`);
                
                // Remove existing onclick
                button.removeAttribute('onclick');
                
                // Add new click handler
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openBuilder(pageId);
                });
                
                // Update button text/icon if needed
                if (button.textContent.trim() === '' || button.textContent.includes('Edit')) {
                    button.innerHTML = '✏️ Edit';
                }
                
                // Add visual feedback
                button.style.cursor = 'pointer';
                button.title = `Edit page ${pageId}`;
                
                fixedCount++;
            }
        });
        
        console.log(`✅ Fixed ${fixedCount} edit buttons`);
    }

    // Open builder with page data
    openBuilder(pageId) {
        const shop = this.getCurrentShop();
        
        console.log(`🚀 Opening builder for page ${pageId} from shop ${shop}`);
        
        // Construct builder URL
        const builderUrl = `/builder?shop=${encodeURIComponent(shop)}&page=${pageId}`;
        
        console.log(`🔗 Builder URL: ${builderUrl}`);
        
        // Open in same window
        window.location.href = builderUrl;
    }

    // Create edit buttons for pages that don't have them
    createMissingEditButtons() {
        console.log('➕ Creating missing edit buttons...');
        
        // Find page cards without edit buttons
        const pageCards = document.querySelectorAll('.page-card, .page-item');
        
        pageCards.forEach(card => {
            // Check if it already has an edit button
            const existingEdit = card.querySelector('.edit-btn, .btn-edit, [onclick*="editPage"]');
            
            if (!existingEdit) {
                // Get page ID
                const pageId = card.dataset.pageId || 
                             card.dataset.id ||
                             card.querySelector('[data-page-id]')?.dataset.pageId;
                
                if (pageId) {
                    console.log(`➕ Creating edit button for page ${pageId}`);
                    
                    // Create edit button
                    const editButton = document.createElement('button');
                    editButton.className = 'btn btn-edit edit-btn';
                    editButton.innerHTML = '✏️ Edit';
                    editButton.title = `Edit page ${pageId}`;
                    editButton.style.cssText = `
                        background: #007cba;
                        color: white;
                        border: none;
                        padding: 6px 12px;
                        border-radius: 4px;
                        cursor: pointer;
                        font-size: 12px;
                        margin: 5px;
                    `;
                    
                    // Add click handler
                    editButton.addEventListener('click', (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        this.openBuilder(pageId);
                    });
                    
                    // Add to card
                    const actionsArea = card.querySelector('.page-actions, .card-actions, .actions') ||
                                       card.querySelector('.page-card-footer') ||
                                       card;
                    
                    actionsArea.appendChild(editButton);
                }
            }
        });
    }

    // Fix page cards to show proper data
    fixPageCards() {
        console.log('🎴 Fixing page cards...');
        
        const pageCards = document.querySelectorAll('.page-card, .page-item');
        
        pageCards.forEach(card => {
            // Ensure page ID is accessible
            const pageId = card.dataset.pageId || card.dataset.id;
            
            if (pageId) {
                // Add page ID to card if not present
                if (!card.dataset.pageId) {
                    card.dataset.pageId = pageId;
                }
                
                // Add visual indicator
                card.style.position = 'relative';
                
                // Add page ID badge
                let badge = card.querySelector('.page-id-badge');
                if (!badge) {
                    badge = document.createElement('div');
                    badge.className = 'page-id-badge';
                    badge.textContent = `ID: ${pageId}`;
                    badge.style.cssText = `
                        position: absolute;
                        top: 5px;
                        right: 5px;
                        background: rgba(0,0,0,0.7);
                        color: white;
                        padding: 2px 6px;
                        border-radius: 3px;
                        font-size: 10px;
                        z-index: 10;
                    `;
                    card.appendChild(badge);
                }
            }
        });
    }

    // Set up observer for dynamic content
    setupObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Check if new page cards were added
                            const newPageCards = node.querySelectorAll ? 
                                node.querySelectorAll('.page-card, .page-item') : [];
                            
                            if (newPageCards.length > 0) {
                                console.log(`🔄 New page cards detected: ${newPageCards.length}`);
                                setTimeout(() => {
                                    this.fixEditButtons();
                                    this.createMissingEditButtons();
                                    this.fixPageCards();
                                }, 500);
                            }
                            
                            // Check if the node itself is a page card
                            if (node.classList && (node.classList.contains('page-card') || node.classList.contains('page-item'))) {
                                setTimeout(() => {
                                    this.fixEditButtons();
                                    this.createMissingEditButtons();
                                    this.fixPageCards();
                                }, 500);
                            }
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👀 Observer set up for dynamic page cards');
    }

    // Initialize
    initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing Dashboard Builder Link Fix...');
        
        this.currentShop = this.getCurrentShop();
        console.log(`🏪 Current shop: ${this.currentShop}`);
        
        // Initial fix
        setTimeout(() => {
            this.fixEditButtons();
            this.createMissingEditButtons();
            this.fixPageCards();
        }, 2000);
        
        // Set up observer for dynamic content
        this.setupObserver();
        
        // Re-fix periodically to catch any missed buttons
        setInterval(() => {
            this.fixEditButtons();
            this.createMissingEditButtons();
        }, 10000);
        
        this.isInitialized = true;
        console.log('✅ Dashboard Builder Link Fix initialized');
    }

    // Manual fix trigger
    fixNow() {
        this.fixEditButtons();
        this.createMissingEditButtons();
        this.fixPageCards();
        console.log('🔧 Manual fix applied');
    }
}

// Create global instance
const dashboardBuilderLinkFix = new DashboardBuilderLinkFix();

// Export for global access
window.DashboardBuilderLinkFix = {
    initialize: () => dashboardBuilderLinkFix.initialize(),
    fixNow: () => dashboardBuilderLinkFix.fixNow(),
    openBuilder: (pageId) => dashboardBuilderLinkFix.openBuilder(pageId)
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        dashboardBuilderLinkFix.initialize();
    });
} else {
    dashboardBuilderLinkFix.initialize();
}

console.log('✅ Dashboard Builder Link Fix loaded');