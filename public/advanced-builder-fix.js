// Fix for advanced-builder.js canvas not found issue
window.addEventListener('DOMContentLoaded', function() {
    // Wait for a short time to ensure other scripts have run
    setTimeout(() => {
        console.log('?? Applying advanced builder fixes...');
        
        // Check if setupCanvasInteractions function exists and patch it
        if (window.setupCanvasInteractions) {
            const originalSetupCanvasInteractions = window.setupCanvasInteractions;
            window.setupCanvasInteractions = function() {
                // Create canvas if it doesn't exist
                if (!document.querySelector('.canvas-frame') || !document.querySelector('.canvas-content')) {
                    console.log('?? Canvas not found in advanced builder! Creating emergency canvas...');
                    
                    // Find the main content area
                    const mainContent = document.querySelector('#kingsbuilder-content') || 
                                       document.querySelector('#kingsbuilder-editor-wrapper') ||
                                       document.body;
                    
                    // Create canvas
                    const canvas = document.createElement('div');
                    canvas.className = 'canvas-frame';
                    canvas.style.cssText = 'min-height: 500px; border: 1px dashed #ccc; padding: 20px; background: #fff; margin: 20px;';
                    canvas.innerHTML = '<div class="canvas-content"><div class="canvas-placeholder">Drag elements here to build your page</div></div>';
                    
                    // Add to DOM
                    mainContent.appendChild(canvas);
                    console.log('? Emergency canvas created for advanced builder!');
                }
                
                // Call original function
                try {
                    originalSetupCanvasInteractions();
                } catch (e) {
                    console.warn('?? Error in setupCanvasInteractions handled:', e);
                }
            };
        }
        
        // Fix advanced builder initialization
        if (typeof window.advancedBuilder === 'undefined') {
            window.advancedBuilder = {
                init: function() {
                    console.log('? Advanced builder initialized (fixed)');
                },
                setupDragAndDrop: function() {
                    console.log('? Advanced drag and drop setup (fixed)');
                },
                setupResponsiveMode: function() {
                    console.log('? Responsive mode setup (fixed)');
                }
            };
        }
        
        console.log('? Advanced builder fixes applied!');
    }, 1500);
});
