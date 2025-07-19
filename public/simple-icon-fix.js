// Simple Icon Fix - Make icons black without breaking anything
console.log('🎨 Simple Icon Fix - Loading...');

class SimpleIconFix {
    constructor() {
        this.isInitialized = false;
    }

    // Apply simple icon fix
    fixIcons() {
        // Add CSS to make icons black
        if (!document.getElementById('simple-icon-fix-css')) {
            const style = document.createElement('style');
            style.id = 'simple-icon-fix-css';
            style.textContent = `
                /* Make all FontAwesome icons black */
                .fas, .far, .fab, .fa,
                i.fas, i.far, i.fab, i.fa,
                [class*="fa-"] {
                    color: #000000 !important;
                }
                
                /* Keep white icons on colored buttons */
                .btn-primary i, .btn-primary .fas, .btn-primary .far, .btn-primary .fab, .btn-primary .fa,
                .btn-success i, .btn-success .fas, .btn-success .far, .btn-success .fab, .btn-success .fa,
                .btn-info i, .btn-info .fas, .btn-info .far, .btn-info .fab, .btn-info .fa,
                .btn-warning i, .btn-warning .fas, .btn-warning .far, .btn-warning .fab, .btn-warning .fa,
                .btn-danger i, .btn-danger .fas, .btn-danger .far, .btn-danger .fab, .btn-danger .fa {
                    color: #ffffff !important;
                }
                
                /* Status icons can keep some color */
                .text-success, .text-success i, .text-success .fas {
                    color: #28a745 !important;
                }
                
                .text-danger, .text-danger i, .text-danger .fas {
                    color: #dc3545 !important;
                }
                
                .text-warning, .text-warning i, .text-warning .fas {
                    color: #ffc107 !important;
                }
            `;
            document.head.appendChild(style);
            console.log('✅ Icon fix CSS applied');
        }
    }

    // Initialize
    initialize() {
        if (this.isInitialized) return;
        
        console.log('🚀 Initializing Simple Icon Fix...');
        
        // Apply fix immediately
        this.fixIcons();
        
        // Re-apply after a delay to catch dynamic content
        setTimeout(() => {
            this.fixIcons();
        }, 2000);
        
        this.isInitialized = true;
        console.log('✅ Simple Icon Fix initialized');
    }
}

// Create instance
const simpleIconFix = new SimpleIconFix();

// Export for global access
window.SimpleIconFix = {
    initialize: () => simpleIconFix.initialize(),
    fixNow: () => simpleIconFix.fixIcons()
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        simpleIconFix.initialize();
    });
} else {
    simpleIconFix.initialize();
}

console.log('✅ Simple Icon Fix loaded');