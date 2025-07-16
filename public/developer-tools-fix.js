// Developer Tools Fix
class DeveloperTools {
    constructor() {
        this.isInitialized = false;
        this.init();
    }

    init() {
        if (this.isInitialized) return;
        
        console.log('🔧 Initializing Developer Tools...');
        
        // Add setupDevMode method if it doesn't exist
        if (typeof this.setupDevMode !== 'function') {
            this.setupDevMode = function() {
                console.log('🛠️ Dev Mode initialized');
                // Add any dev mode initialization code here
            };
        }
        
        // Call setupDevMode
        try {
            this.setupDevMode();
            console.log('✅ Developer Tools initialized successfully');
            this.isInitialized = true;
        } catch (error) {
            console.error('❌ Error initializing Developer Tools:', error);
        }
    }
}

// Initialize Developer Tools
if (typeof window.DeveloperTools === 'undefined') {
    window.DeveloperTools = new DeveloperTools();
}
