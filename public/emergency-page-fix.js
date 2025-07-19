// 🚨 EMERGENCY PAGE FIX - Handle 404 errors gracefully
// This script ensures the builder works even when pages don't exist

console.log('🚨 EMERGENCY PAGE FIX: Loading...');

class EmergencyPageFixer {
    constructor() {
        this.init();
    }
    
    init() {
        // Override the loadPageData method to handle 404s gracefully
        this.overrideLoadPageData();
        
        // Prevent builder from breaking on errors
        this.setupErrorHandling();
        
        // Ensure canvas has content even if page doesn't exist
        this.ensureCanvasContent();
        
        console.log('✅ EMERGENCY PAGE FIX: Ready!');
    }
    
    overrideLoadPageData() {
        // Wait for KingsBuilder to be available
        const checkBuilder = () => {
            if (window.KingsBuilder && window.KingsBuilder.prototype.loadPageData) {
                const originalLoadPageData = window.KingsBuilder.prototype.loadPageData;
                
                window.KingsBuilder.prototype.loadPageData = async function() {
                    try {
                        console.log('🔧 EMERGENCY FIX: Attempting to load page data...');
                        await originalLoadPageData.call(this);
                    } catch (error) {
                        console.log('🚨 EMERGENCY FIX: Page load failed, using fallback content');
                        this.handlePageNotFound();
                    }
                };
                
                // Add the fallback method
                window.KingsBuilder.prototype.handlePageNotFound = function() {
                    console.log('📝 EMERGENCY FIX: Creating fallback page content');
                    
                    // Get URL parameters
                    const urlParams = new URLSearchParams(window.location.search);
                    const pageTitle = urlParams.get('title') || 'New Page';
                    
                    // Set default title
                    const titleInput = document.getElementById('pageTitle');
                    if (titleInput) {
                        titleInput.value = decodeURIComponent(pageTitle);
                    }
                    
                    // Create default canvas content
                    const canvas = document.getElementById('kingsbuilder-canvas');
                    if (canvas) {
                        canvas.innerHTML = `
                            <div class="elementor-section" data-id="section1" data-element="section">
                                <div class="elementor-container">
                                    <div class="elementor-column" data-id="column1" data-element="column">
                                        <div class="elementor-widget elementor-widget-heading" data-id="heading1" data-element="heading">
                                            <div class="elementor-widget-container">
                                                <h2 class="elementor-heading-title">${decodeURIComponent(pageTitle)}</h2>
                                            </div>
                                        </div>
                                        <div class="elementor-widget elementor-widget-text-editor" data-id="text1" data-element="text">
                                            <div class="elementor-widget-container">
                                                <p>Welcome to KingsBuilder! This page is ready for editing. Start by dragging elements from the left panel to build your content.</p>
                                            </div>
                                        </div>
                                        <div class="elementor-widget elementor-widget-button" data-id="button1" data-element="button">
                                            <div class="elementor-widget-container">
                                                <a href="#" class="elementor-button elementor-size-sm">
                                                    <span class="elementor-button-text">Get Started</span>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        console.log('✅ EMERGENCY FIX: Default content created');
                        
                        // Parse the content back into elements
                        if (this.parseLoadedContent) {
                            this.parseLoadedContent();
                        }
                        
                        // Save the initial state
                        if (this.saveState) {
                            this.saveState();
                        }
                    }
                };
                
                console.log('✅ EMERGENCY FIX: LoadPageData override applied');
            } else {
                // Try again in 100ms
                setTimeout(checkBuilder, 100);
            }
        };
        
        checkBuilder();
    }
    
    setupErrorHandling() {
        // Catch and handle promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.log('🚨 EMERGENCY FIX: Caught promise rejection:', event.reason);
            
            // If it's a fetch error for pages API, prevent it from breaking the app
            if (event.reason && event.reason.message && event.reason.message.includes('pages')) {
                event.preventDefault();
                console.log('✅ EMERGENCY FIX: Page fetch error handled gracefully');
            }
        });
        
        // Catch JavaScript errors
        window.addEventListener('error', (event) => {
            console.log('🚨 EMERGENCY FIX: Caught JavaScript error:', event.error);
            
            // If it's related to page loading, handle it
            if (event.error && event.error.message && 
                (event.error.message.includes('404') || 
                 event.error.message.includes('Failed to load') ||
                 event.error.message.includes('pages'))) {
                event.preventDefault();
                console.log('✅ EMERGENCY FIX: Page loading error handled gracefully');
            }
        });
    }
    
    ensureCanvasContent() {
        // Check canvas content periodically and fix if empty
        const checkCanvas = () => {
            const canvas = document.getElementById('kingsbuilder-canvas');
            if (canvas && canvas.innerHTML.trim() === '') {
                console.log('🚨 EMERGENCY FIX: Canvas is empty, adding default content');
                
                const urlParams = new URLSearchParams(window.location.search);
                const pageTitle = urlParams.get('title') || 'Welcome';
                
                canvas.innerHTML = `
                    <div class="elementor-section" data-id="emergency-section" data-element="section">
                        <div class="elementor-container">
                            <div class="elementor-column" data-id="emergency-column" data-element="column">
                                <div class="elementor-widget elementor-widget-heading" data-id="emergency-heading" data-element="heading">
                                    <div class="elementor-widget-container">
                                        <h2 class="elementor-heading-title">${decodeURIComponent(pageTitle)}</h2>
                                    </div>
                                </div>
                                <div class="elementor-widget elementor-widget-text-editor" data-id="emergency-text" data-element="text">
                                    <div class="elementor-widget-container">
                                        <p>Your page is ready! Start building by dragging elements from the sidebar.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                
                console.log('✅ EMERGENCY FIX: Default canvas content added');
            }
        };
        
        // Check immediately and then every 2 seconds
        setTimeout(checkCanvas, 1000);
        setInterval(checkCanvas, 2000);
    }
}

// Initialize the emergency fix
window.emergencyPageFixer = new EmergencyPageFixer();

console.log('🚨 EMERGENCY PAGE FIX: Initialized!');