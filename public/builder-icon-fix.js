// Builder Icon Fix for KingsBuilder Page Editor
console.log('🔧 Loading Builder Icon Fix...');

// Builder-specific icon mappings
const BUILDER_ICON_MAP = {
    // Header icons
    'fa-crown': '👑',
    'fa-arrow-left': '←',
    'fa-minus': '−',
    'fa-ellipsis-v': '⋮',
    
    // Navigation icons
    'fa-plus': '+',
    'fa-cog': '⚙️',
    'fa-file-alt': '📄',
    'fa-search': '🔍',
    'fa-layer-group': '📚',
    'fa-chevron-down': '▼',
    'fa-chevron-up': '▲',
    'fa-chevron-right': '▶',
    'fa-chevron-left': '◀',
    
    // Basic elements
    'fa-square': '⬜',
    'fa-heading': 'H',
    'fa-paragraph': '¶',
    'fa-image': '🖼️',
    'fa-mouse-pointer': '👆',
    'fa-arrows-alt-v': '↕️',
    'fa-star': '⭐',
    'fa-cube': '📦',
    'fa-list': '☰',
    'fa-table': '⊞',
    'fa-video': '🎥',
    'fa-music': '🎵',
    'fa-code': '</>', 
    'fa-map': '🗺️',
    'fa-calendar': '📅',
    'fa-clock': '🕐',
    'fa-envelope': '✉️',
    'fa-phone': '📞',
    'fa-share': '📤',
    'fa-thumbs-up': '👍',
    'fa-heart': '❤️',
    'fa-comment': '💬',
    
    // Advanced elements
    'fa-sliders-h': '🎛️',
    'fa-palette': '🎨',
    'fa-magic': '✨',
    'fa-expand': '⤢',
    'fa-compress': '⤡',
    'fa-eye': '👁️',
    'fa-eye-slash': '🙈',
    'fa-lock': '🔒',
    'fa-unlock': '🔓',
    'fa-copy': '📋',
    'fa-paste': '📄',
    'fa-cut': '✂️',
    'fa-undo': '↶',
    'fa-redo': '↷',
    'fa-trash': '🗑️',
    'fa-edit': '✏️',
    'fa-save': '💾',
    'fa-download': '⬇️',
    'fa-upload': '⬆️',
    'fa-external-link-alt': '🔗',
    
    // Shopify specific
    'fa-shopping-cart': '🛒',
    'fa-credit-card': '💳',
    'fa-tag': '🏷️',
    'fa-tags': '🏷️',
    'fa-dollar-sign': '$',
    'fa-percent': '%',
    'fa-gift': '🎁',
    'fa-truck': '🚚',
    'fa-store': '🏪',
    
    // Social icons
    'fa-facebook': 'f',
    'fa-twitter': 't',
    'fa-instagram': 'i',
    'fa-linkedin': 'in',
    'fa-youtube': 'yt',
    'fa-tiktok': 'tt',
    
    // Layout icons
    'fa-columns': '⫸',
    'fa-grip-horizontal': '☰',
    'fa-grip-vertical': '⋮',
    'fa-align-left': '≡',
    'fa-align-center': '≣',
    'fa-align-right': '≡',
    'fa-align-justify': '≣',
    
    // Typography
    'fa-bold': 'B',
    'fa-italic': 'I',
    'fa-underline': 'U',
    'fa-strikethrough': 'S',
    'fa-font': 'Aa',
    'fa-text-height': 'Tt',
    'fa-text-width': 'Tt',
    
    // Common actions
    'fa-check': '✓',
    'fa-times': '✕',
    'fa-question': '?',
    'fa-info': 'i',
    'fa-exclamation': '!',
    'fa-warning': '⚠️',
    'fa-bell': '🔔',
    'fa-home': '🏠',
    'fa-user': '👤',
    'fa-users': '👥',
    'fa-cogs': '⚙️',
    'fa-wrench': '🔧',
    'fa-hammer': '🔨',
    'fa-paint-brush': '🖌️'
};

class BuilderIconFix {
    constructor() {
        this.isInitialized = false;
        this.observer = null;
        this.fixedIcons = new Set();
    }

    // Check if Font Awesome is loaded
    checkFontAwesome() {
        const testElement = document.createElement('i');
        testElement.className = 'fas fa-home';
        testElement.style.position = 'absolute';
        testElement.style.left = '-9999px';
        document.body.appendChild(testElement);
        
        const computedStyle = window.getComputedStyle(testElement, ':before');
        const isLoaded = computedStyle.fontFamily && computedStyle.fontFamily.includes('Font Awesome');
        
        document.body.removeChild(testElement);
        return isLoaded;
    }

    // Apply fallback CSS
    applyFallbackCSS() {
        const css = `
            /* Builder Icon Fallbacks */
            .icon-fallback,
            .fas:not([data-icon-fixed]):before,
            .far:not([data-icon-fixed]):before,
            .fab:not([data-icon-fixed]):before {
                font-family: Arial, sans-serif !important;
                font-weight: bold;
                display: inline-block;
                text-rendering: auto;
                -webkit-font-smoothing: antialiased;
            }
            
            /* Specific builder icon fallbacks */
            ${Object.entries(BUILDER_ICON_MAP).map(([iconClass, emoji]) => `
                .fas.${iconClass}:before,
                .far.${iconClass}:before,
                .fab.${iconClass}:before {
                    content: "${emoji}" !important;
                    font-family: Arial, sans-serif !important;
                }
            `).join('\n')}
            
            /* Ensure icons are visible in builder */
            .element-icon i,
            .nav-tab i,
            .header-button i,
            .category-header i,
            .toggle-icon {
                display: inline-block !important;
                font-size: inherit !important;
                width: auto !important;
                height: auto !important;
                text-align: center !important;
                line-height: 1 !important;
            }
            
            /* Builder specific icon sizing */
            .kingsbuilder-logo i {
                font-size: 20px !important;
                margin-right: 8px !important;
                color: #ffd700 !important;
            }
            
            .header-button i {
                font-size: 14px !important;
            }
            
            .nav-tab i {
                font-size: 16px !important;
                margin-right: 6px !important;
            }
            
            .element-icon i {
                font-size: 18px !important;
                color: #666 !important;
            }
            
            .category-header i {
                font-size: 14px !important;
                margin-right: 8px !important;
            }
            
            .toggle-icon {
                font-size: 12px !important;
                margin-left: auto !important;
                transition: transform 0.2s ease !important;
            }
            
            .category.active .toggle-icon {
                transform: rotate(180deg) !important;
            }
        `;
        
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
        
        console.log('✅ Builder icon fallback CSS applied');
    }

    // Fix individual icon element
    fixIconElement(element) {
        if (this.fixedIcons.has(element)) return;
        
        const classList = Array.from(element.classList);
        const iconClass = classList.find(cls => cls.startsWith('fa-'));
        
        if (iconClass && BUILDER_ICON_MAP[iconClass]) {
            // Check if icon is displaying properly
            const computedStyle = window.getComputedStyle(element, ':before');
            const content = computedStyle.content;
            
            // If no content or just quotes, the icon is broken
            if (!content || content === '""' || content === 'none') {
                element.setAttribute('data-icon-fixed', 'true');
                element.setAttribute('data-original-icon', iconClass);
                this.fixedIcons.add(element);
                
                console.log(`🔧 Fixed icon: ${iconClass} → ${BUILDER_ICON_MAP[iconClass]}`);
            }
        }
    }

    // Fix all icons on the page
    fixAllIcons() {
        const iconElements = document.querySelectorAll('.fas, .far, .fab, [class*="fa-"]');
        let fixedCount = 0;
        
        iconElements.forEach(element => {
            this.fixIconElement(element);
            fixedCount++;
        });
        
        console.log(`🔧 Processed ${fixedCount} icon elements`);
    }

    // Set up mutation observer for dynamically added icons
    setupObserver() {
        if (this.observer) return;
        
        this.observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            // Check if the node itself is an icon
                            if (node.classList && (node.classList.contains('fas') || 
                                node.classList.contains('far') || 
                                node.classList.contains('fab'))) {
                                this.fixIconElement(node);
                            }
                            
                            // Check for icon children
                            const icons = node.querySelectorAll ? 
                                node.querySelectorAll('.fas, .far, .fab, [class*="fa-"]') : [];
                            icons.forEach(icon => this.fixIconElement(icon));
                        }
                    });
                }
            });
        });
        
        this.observer.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('👀 Icon observer set up for dynamic content');
    }

    // Initialize the icon fix system
    initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing Builder Icon Fix...');
        
        // Apply fallback CSS immediately
        this.applyFallbackCSS();
        
        // Check Font Awesome status
        setTimeout(() => {
            const fontAwesomeLoaded = this.checkFontAwesome();
            
            if (!fontAwesomeLoaded) {
                console.warn('⚠️ Font Awesome not loaded, using fallback icons');
            } else {
                console.log('✅ Font Awesome loaded successfully');
            }
            
            // Fix existing icons
            this.fixAllIcons();
            
            // Set up observer for dynamic content
            this.setupObserver();
            
            this.isInitialized = true;
            console.log('✅ Builder Icon Fix initialized successfully');
            
        }, 1000); // Give Font Awesome time to load
    }

    // Manual fix trigger
    fixNow() {
        this.fixAllIcons();
    }

    // Get fix status
    getStatus() {
        return {
            initialized: this.isInitialized,
            fontAwesomeLoaded: this.checkFontAwesome(),
            fixedIconsCount: this.fixedIcons.size,
            observerActive: !!this.observer
        };
    }
}

// Create global instance
const builderIconFix = new BuilderIconFix();

// Export for global access
window.BuilderIconFix = {
    initialize: () => builderIconFix.initialize(),
    fixNow: () => builderIconFix.fixNow(),
    getStatus: () => builderIconFix.getStatus()
};

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        builderIconFix.initialize();
    });
} else {
    builderIconFix.initialize();
}

console.log('✅ Builder Icon Fix loaded');