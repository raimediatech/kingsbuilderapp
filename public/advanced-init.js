// Advanced KingsBuilder FORCE Initialization
// This COMPLETELY replaces the basic builder

console.log('🚀 FORCING Advanced KingsBuilder initialization...');

// IMMEDIATELY override the basic KingsBuilder class
const OriginalKingsBuilder = window.KingsBuilder || KingsBuilder;

// Prevent basic KingsBuilder from initializing
document.addEventListener('DOMContentLoaded', function() {
    // Kill any existing builder
    if (window.kingsBuilder) {
        console.log('🔥 Destroying existing basic builder...');
        window.kingsBuilder = null;
    }
    
    // Wait for DOM and scripts to load
    setTimeout(() => {
        console.log('🚀 Creating ADVANCED KingsBuilder...');
        
        // Force create the advanced builder
        window.kingsBuilder = new KingsBuilderAdvanced();
        
        // Force initialization
        if (window.kingsBuilder.initializeBuilder) {
            window.kingsBuilder.initializeBuilder();
        }
        
        console.log('✅ ADVANCED KingsBuilder FORCED initialization complete!');
        
        // Add debugging
        window.kingsBuilder.debug = true;
        
        // Force element interaction setup
        setTimeout(() => {
            console.log('🔧 Setting up element interactions...');
            window.kingsBuilder.setupElementInteractions();
        }, 500);
        
    }, 100);
});

// Also try immediate initialization if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!window.kingsBuilder || !(window.kingsBuilder instanceof KingsBuilderAdvanced)) {
            console.log('🚀 DOM already loaded, forcing advanced builder...');
            window.kingsBuilder = new KingsBuilderAdvanced();
        }
    }, 50);
}