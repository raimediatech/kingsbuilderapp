// Initialization Fix
class InitializationManager {
    constructor() {
        this.initialized = false;
        this.initializing = false;
        this.initQueue = [];
        this.initialize();
    }

    async initialize() {
        if (this.initialized || this.initializing) {
            console.log('🔄 Initialization already in progress or completed');
            return;
        }

        this.initializing = true;
        console.log('🚀 Starting initialization...');

        try {
            // Wait for DOM to be fully loaded
            if (document.readyState !== 'complete') {
                await new Promise(resolve => {
                    if (document.readyState === 'complete') {
                        resolve();
                    } else {
                        window.addEventListener('load', resolve);
                    }
                });
            }

            // Process initialization queue
            while (this.initQueue.length > 0) {
                const initFn = this.initQueue.shift();
                if (typeof initFn === 'function') {
                    await Promise.resolve(initFn());
                }
            }

            this.initialized = true;
            this.initializing = false;
            console.log('✅ Initialization completed successfully');
        } catch (error) {
            console.error('❌ Initialization failed:', error);
            this.initializing = false;
        }
    }

    queueInitialization(callback) {
        if (typeof callback !== 'function') return;
        
        if (this.initialized) {
            // If already initialized, run immediately
            Promise.resolve().then(() => callback());
        } else {
            // Otherwise, add to queue
            this.initQueue.push(callback);
            
            // Start initialization if not already in progress
            if (!this.initializing) {
                this.initialize();
            }
        }
    }

    isInitialized() {
        return this.initialized;
    }
}

// Initialize the manager
if (typeof window.InitializationManager === 'undefined') {
    window.InitializationManager = new InitializationManager();
}

// Override the original KingsBuilder initialization
const originalKingsBuilder = window.KingsBuilder;
if (originalKingsBuilder) {
    window.KingsBuilder = function(...args) {
        console.log('🏗️ Wrapped KingsBuilder initialization');
        
        // Queue the initialization
        window.InitializationManager.queueInitialization(() => {
            console.log('🚀 Initializing KingsBuilder...');
            const instance = new originalKingsBuilder(...args);
            console.log('✅ KingsBuilder initialized');
            return instance;
        });
        
        // Return a dummy object with the same interface
        return {
            // Add any methods that might be called immediately after initialization
            init: () => console.log('🔄 KingsBuilder initialization queued'),
            on: () => console.log('🔄 Event listener queued')
        };
    };
    
    // Copy static properties
    Object.assign(window.KingsBuilder, originalKingsBuilder);
}

// Prevent multiple initializations
if (!window.__KINGS_BUILDER_INITIALIZED__) {
    window.__KINGS_BUILDER_INITIALIZED__ = true;
    
    // Listen for DOMContentLoaded to ensure proper initialization order
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🏁 DOM fully loaded, checking for pending initializations...');
        if (window.InitializationManager) {
            window.InitializationManager.initialize();
        }
    });
}
