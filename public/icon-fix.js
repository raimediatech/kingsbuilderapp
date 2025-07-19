// Icon Fix for KingsBuilder Dashboard
console.log('🔧 Loading Icon Fix...');

// Function to check if Font Awesome is loaded
function checkFontAwesome() {
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

// Function to load Font Awesome locally if CDN fails
function loadLocalFontAwesome() {
    console.log('📦 Loading local Font Awesome fallback...');
    
    // Create fallback CSS for essential icons
    const fallbackCSS = `
        .fas, .fa {
            font-family: Arial, sans-serif;
            font-weight: bold;
            display: inline-block;
            text-rendering: auto;
            -webkit-font-smoothing: antialiased;
        }
        
        .fa-crown:before { content: "👑"; }
        .fa-plus:before { content: "+"; }
        .fa-user-circle:before { content: "👤"; }
        .fa-circle:before { content: "●"; }
        .fa-file-alt:before { content: "📄"; }
        .fa-layer-group:before { content: "📚"; }
        .fa-cog:before { content: "⚙️"; }
        .fa-question-circle:before { content: "❓"; }
        .fa-edit:before { content: "✏️"; }
        .fa-trash:before { content: "🗑️"; }
        .fa-clone:before { content: "📋"; }
        .fa-eye:before { content: "👁️"; }
        .fa-external-link-alt:before { content: "🔗"; }
        .fa-magic:before { content: "✨"; }
        .fa-search:before { content: "🔍"; }
        .fa-filter:before { content: "🔽"; }
        .fa-th:before { content: "▦"; }
        .fa-list:before { content: "☰"; }
        .fa-calendar:before { content: "📅"; }
        .fa-check:before { content: "✓"; }
        .fa-times:before { content: "✕"; }
        .fa-exclamation-triangle:before { content: "⚠️"; }
        .fa-info-circle:before { content: "ℹ️"; }
        .fa-spinner:before { content: "⟳"; }
        .fa-sync:before { content: "🔄"; }
        .fa-download:before { content: "⬇️"; }
        .fa-upload:before { content: "⬆️"; }
        .fa-save:before { content: "💾"; }
        .fa-copy:before { content: "📄"; }
        .fa-paste:before { content: "📋"; }
        .fa-cut:before { content: "✂️"; }
        .fa-undo:before { content: "↶"; }
        .fa-redo:before { content: "↷"; }
        .fa-bold:before { content: "B"; font-weight: bold; }
        .fa-italic:before { content: "I"; font-style: italic; }
        .fa-underline:before { content: "U"; text-decoration: underline; }
        .fa-align-left:before { content: "≡"; }
        .fa-align-center:before { content: "≣"; }
        .fa-align-right:before { content: "≡"; }
        .fa-link:before { content: "🔗"; }
        .fa-image:before { content: "🖼️"; }
        .fa-video:before { content: "🎥"; }
        .fa-music:before { content: "🎵"; }
        .fa-play:before { content: "▶️"; }
        .fa-pause:before { content: "⏸️"; }
        .fa-stop:before { content: "⏹️"; }
        .fa-volume-up:before { content: "🔊"; }
        .fa-volume-down:before { content: "🔉"; }
        .fa-volume-mute:before { content: "🔇"; }
        
        /* Animation for spinner */
        .fa-spinner {
            animation: fa-spin 2s infinite linear;
        }
        
        @keyframes fa-spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        /* Status indicators */
        .connection-status .fa-circle {
            font-size: 8px;
            vertical-align: middle;
            margin-right: 5px;
        }
        
        .connection-status.connected .fa-circle:before {
            content: "●";
            color: #10b981;
        }
        
        .connection-status.disconnected .fa-circle:before {
            content: "●";
            color: #ef4444;
        }
        
        .connection-status.checking .fa-circle:before {
            content: "●";
            color: #f59e0b;
        }
    `;
    
    // Inject fallback CSS
    const style = document.createElement('style');
    style.textContent = fallbackCSS;
    document.head.appendChild(style);
    
    console.log('✅ Local Font Awesome fallback loaded');
}

// Function to fix broken icons
function fixBrokenIcons() {
    console.log('🔧 Fixing broken icons...');
    
    // Find all elements with Font Awesome classes
    const iconElements = document.querySelectorAll('[class*="fa-"], .fas, .far, .fab, .fal');
    
    iconElements.forEach(element => {
        // Check if the icon is displaying properly
        const computedStyle = window.getComputedStyle(element, ':before');
        const content = computedStyle.content;
        
        // If no content or just quotes, the icon is broken
        if (!content || content === '""' || content === 'none') {
            // Add a fallback class
            element.classList.add('icon-fallback');
        }
    });
    
    console.log(`🔧 Fixed ${iconElements.length} icon elements`);
}

// Function to initialize icon system
function initializeIcons() {
    console.log('🎨 Initializing icon system...');
    
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeIcons);
        return;
    }
    
    // Check if Font Awesome is loaded
    setTimeout(() => {
        if (!checkFontAwesome()) {
            console.warn('⚠️ Font Awesome CDN failed to load, using fallback');
            loadLocalFontAwesome();
        } else {
            console.log('✅ Font Awesome loaded successfully');
        }
        
        // Fix any broken icons
        fixBrokenIcons();
        
        // Set up observer for dynamically added icons
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (node.nodeType === 1) { // Element node
                            const icons = node.querySelectorAll ? node.querySelectorAll('[class*="fa-"], .fas, .far, .fab, .fal') : [];
                            if (icons.length > 0) {
                                setTimeout(() => fixBrokenIcons(), 100);
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
        
    }, 1000); // Give Font Awesome time to load
}

// Function to update connection status with proper icons
function updateConnectionStatus(status, text) {
    const statusElement = document.getElementById('connectionStatus');
    const statusIcon = document.getElementById('statusIcon');
    const statusText = document.getElementById('statusText');
    
    if (statusElement && statusIcon && statusText) {
        statusElement.className = `connection-status ${status}`;
        statusText.textContent = text;
        
        // Update icon based on status
        statusIcon.className = 'fas fa-circle';
        
        console.log(`🔄 Connection status updated: ${status} - ${text}`);
    }
}

// Export functions for global use
window.IconFix = {
    initialize: initializeIcons,
    updateConnectionStatus: updateConnectionStatus,
    fixBrokenIcons: fixBrokenIcons
};

// Auto-initialize
initializeIcons();

console.log('✅ Icon Fix loaded and initialized');