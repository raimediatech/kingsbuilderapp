// KingsBuilder Fixes - Main File
(function() {
    console.log('🔧 Loading KingsBuilder fixes...');

    // Load CSS fixes
    function loadCSS(href) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = href;
            link.onload = resolve;
            link.onerror = reject;
            document.head.appendChild(link);
        });
    }

    // Load JS fixes
    function loadScript(src, isModule = false) {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            if (isModule) script.type = 'module';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    // Apply all fixes
    async function applyFixes() {
        try {
            console.log('🛠️ Applying KingsBuilder fixes...');
            
            // 1. Load CSS fixes
            await loadCSS('/css-fix.css');
            
            // 2. Load JS fixes in order
            await loadScript('/initialization-fix.js');
            await loadScript('/developer-tools-fix.js');
            await loadScript('/canvas-fix.js');
            
            console.log('✅ All fixes applied successfully!');
            
            // Notify that fixes are done
            const event = new CustomEvent('kingsbuilder-fixes-applied');
            document.dispatchEvent(event);
            
        } catch (error) {
            console.error('❌ Error applying fixes:', error);
        }
    }

    // Start applying fixes when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', applyFixes);
    } else {
        applyFixes();
    }

    // Export for debugging
    window.KingsBuilderFixes = {
        version: '1.0.0',
        applyFixes
    };
})();
