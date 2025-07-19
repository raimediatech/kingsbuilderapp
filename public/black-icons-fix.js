// Black Icons Fix - Make all icons black like before
console.log('⚫ Loading Black Icons Fix...');

class BlackIconsFix {
    constructor() {
        this.isInitialized = false;
    }

    // Apply black icon styles
    applyBlackIconStyles() {
        const css = `
            /* FORCE ALL ICONS TO BE BLACK */
            .fas, .far, .fab, .fa,
            .fas:before, .far:before, .fab:before, .fa:before,
            i.fas, i.far, i.fab, i.fa,
            i.fas:before, i.far:before, i.fab:before, i.fa:before,
            .icon, .icon:before,
            [class*="fa-"], [class*="fa-"]:before {
                color: #000000 !important;
                fill: #000000 !important;
            }
            
            /* Dashboard specific black icons */
            .kingsbuilder-logo i,
            .header-button i,
            .nav-tab i,
            .element-icon i,
            .category-header i,
            .toggle-icon,
            .page-card i,
            .btn i,
            .connection-status i,
            .search-box i {
                color: #000000 !important;
                fill: #000000 !important;
            }
            
            /* Builder specific black icons */
            .kingsbuilder-panel i,
            .kingsbuilder-panel-header i,
            .kingsbuilder-panel-nav i,
            .element-item i,
            .elements-search i,
            .elements-categories i {
                color: #000000 !important;
                fill: #000000 !important;
            }
            
            /* Override any colored icons */
            .fas.fa-crown,
            .fas.fa-crown:before {
                color: #000000 !important;
                fill: #000000 !important;
            }
            
            /* Status icons - keep some color for functionality but make darker */
            .connection-status.connected i {
                color: #059669 !important; /* Dark green */
            }
            
            .connection-status.disconnected i {
                color: #dc2626 !important; /* Dark red */
            }
            
            .connection-status.checking i {
                color: #d97706 !important; /* Dark orange */
            }
            
            /* Button icons should be white on colored backgrounds */
            .btn-primary i,
            .btn-success i,
            .btn-info i,
            .canvas-btn i,
            .element-control-btn i {
                color: #ffffff !important;
                fill: #ffffff !important;
            }
            
            /* Hover states */
            .header-button:hover i,
            .nav-tab:hover i,
            .element-item:hover i {
                color: #000000 !important;
                fill: #000000 !important;
            }
            
            /* Active states */
            .nav-tab.active i,
            .category.active > .category-header i {
                color: #000000 !important;
                fill: #000000 !important;
            }
            
            /* Ensure fallback icons are also black */
            .icon-fallback,
            .icon-fallback:before {
                color: #000000 !important;
            }
            
            /* SVG icons */
            svg, svg path, svg g {
                fill: #000000 !important;
                color: #000000 !important;
            }
            
            /* Button SVG icons should be white */
            .btn svg, .btn svg path,
            .canvas-btn svg, .canvas-btn svg path,
            .element-control-btn svg, .element-control-btn svg path {
                fill: #ffffff !important;
                color: #ffffff !important;
            }
        `;
        
        const style = document.createElement('style');
        style.id = 'black-icons-fix';
        style.textContent = css;
        document.head.appendChild(style);
        
        console.log('⚫ Black icon styles applied');
    }

    // Fix specific icon elements
    fixIconElements() {
        const iconElements = document.querySelectorAll('.fas, .far, .fab, .fa, [class*="fa-"], .icon, i');
        let fixedCount = 0;
        
        iconElements.forEach(element => {
            // Skip if it's inside a colored button
            const isInButton = element.closest('.btn-primary, .btn-success, .btn-info, .canvas-btn, .element-control-btn');
            
            if (!isInButton) {
                element.style.color = '#000000';
                element.style.fill = '#000000';
                fixedCount++;
            }
        });
        
        console.log(`⚫ Fixed ${fixedCount} icon elements to black`);
    }

    // Set up observer for dynamic icons
    setupObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Check if the node itself is an icon
                            if (node.classList && (
                                node.classList.contains('fas') || 
                                node.classList.contains('far') || 
                                node.classList.contains('fab') ||
                                node.classList.contains('fa') ||
                                Array.from(node.classList).some(cls => cls.startsWith('fa-'))
                            )) {
                                const isInButton = node.closest('.btn-primary, .btn-success, .btn-info, .canvas-btn, .element-control-btn');
                                if (!isInButton) {
                                    node.style.color = '#000000';
                                    node.style.fill = '#000000';
                                }
                            }
                            
                            // Check for icon children
                            const icons = node.querySelectorAll ? 
                                node.querySelectorAll('.fas, .far, .fab, .fa, [class*="fa-"], .icon, i') : [];
                            icons.forEach(icon => {
                                const isInButton = icon.closest('.btn-primary, .btn-success, .btn-info, .canvas-btn, .element-control-btn');
                                if (!isInButton) {
                                    icon.style.color = '#000000';
                                    icon.style.fill = '#000000';
                                }
                            });
                        }
                    });
                }
            });
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👀 Black icons observer set up for dynamic content');
    }

    // Initialize the black icons fix
    initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing Black Icons Fix...');
        
        // Apply CSS immediately
        this.applyBlackIconStyles();
        
        // Fix existing icons after a short delay
        setTimeout(() => {
            this.fixIconElements();
            
            // Set up observer for dynamic content
            this.setupObserver();
            
            this.isInitialized = true;
            console.log('✅ Black Icons Fix initialized successfully');
        }, 500);
        
        // Re-apply fixes periodically to catch any missed icons
        setInterval(() => {
            this.fixIconElements();
        }, 5000);
    }

    // Manual fix trigger
    fixNow() {
        this.fixIconElements();
        console.log('⚫ Manual black icons fix applied');
    }
}

// Create global instance
const blackIconsFix = new BlackIconsFix();

// Export for global access
window.BlackIconsFix = {
    initialize: () => blackIconsFix.initialize(),
    fixNow: () => blackIconsFix.fixNow()
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        blackIconsFix.initialize();
    });
} else {
    blackIconsFix.initialize();
}

console.log('✅ Black Icons Fix loaded');