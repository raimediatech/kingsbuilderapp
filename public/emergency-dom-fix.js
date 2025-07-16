// EMERGENCY DOM FIX - Force create visible interface
console.log('🚨 EMERGENCY DOM FIX - Creating visible interface...');

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(function() {
        console.log('🔧 Applying emergency DOM fixes...');
        
        // Force show main wrapper
        const wrapper = document.getElementById('kingsbuilder-editor-wrapper');
        if (wrapper) {
            wrapper.style.display = 'flex';
            wrapper.style.position = 'fixed';
            wrapper.style.top = '0';
            wrapper.style.left = '0';
            wrapper.style.width = '100%';
            wrapper.style.height = '100%';
            wrapper.style.zIndex = '9999';
            wrapper.style.background = '#f5f5f5';
            wrapper.style.visibility = 'visible';
            wrapper.style.opacity = '1';
            console.log('✅ Main wrapper fixed');
        }
        
        // Force show left panel
        const panel = document.getElementById('kingsbuilder-panel');
        if (panel) {
            panel.style.display = 'flex';
            panel.style.flexDirection = 'column';
            panel.style.width = '300px';
            panel.style.height = '100%';
            panel.style.background = '#fff';
            panel.style.borderRight = '1px solid #e0e0e0';
            panel.style.visibility = 'visible';
            panel.style.opacity = '1';
            console.log('✅ Left panel fixed');
        }
        
        // Force show canvas
        const canvas = document.getElementById('kingsbuilder-canvas') || document.getElementById('kingsbuilder-preview');
        if (canvas) {
            canvas.style.display = 'flex';
            canvas.style.flex = '1';
            canvas.style.flexDirection = 'column';
            canvas.style.visibility = 'visible';
            canvas.style.opacity = '1';
            console.log('✅ Canvas fixed');
        }
        
        // Force show properties panel
        const properties = document.getElementById('kingsbuilder-properties');
        if (properties) {
            properties.style.display = 'flex';
            properties.style.flexDirection = 'column';
            properties.style.width = '300px';
            properties.style.height = '100%';
            properties.style.background = '#fff';
            properties.style.borderLeft = '1px solid #e0e0e0';
            properties.style.visibility = 'visible';
            properties.style.opacity = '1';
            console.log('✅ Properties panel fixed');
        }
        
        // Force show widget library
        const widgets = document.querySelectorAll('.widget-item, .widget-library');
        widgets.forEach(widget => {
            widget.style.display = 'block';
            widget.style.visibility = 'visible';
            widget.style.opacity = '1';
        });
        
        // Force show canvas placeholder
        const placeholder = document.querySelector('.canvas-placeholder');
        if (placeholder) {
            placeholder.style.display = 'block';
            placeholder.style.visibility = 'visible';
            placeholder.style.opacity = '1';
            placeholder.style.minHeight = '400px';
            placeholder.style.background = '#fff';
            placeholder.style.border = '2px dashed #ccc';
        }
        
        // Emergency text display
        const body = document.body;
        const emergencyDiv = document.createElement('div');
        emergencyDiv.id = 'emergency-status';
        emergencyDiv.innerHTML = `
            <div style="position: fixed; top: 10px; right: 10px; background: #4CAF50; color: white; padding: 10px; border-radius: 5px; z-index: 99999;">
                ✅ KingsBuilder Loading... (Emergency Mode)
            </div>
        `;
        body.appendChild(emergencyDiv);
        
        console.log('✅ Emergency DOM fixes applied!');
        
        // Remove emergency status after 3 seconds
        setTimeout(function() {
            const emergency = document.getElementById('emergency-status');
            if (emergency) {
                emergency.remove();
            }
        }, 3000);
        
    }, 100);
});

// Also apply immediately if DOM is already loaded
if (document.readyState === 'loading') {
    // DOM is still loading
} else {
    // DOM is already loaded
    setTimeout(function() {
        console.log('🔧 DOM already loaded, applying emergency fixes...');
        const wrapper = document.getElementById('kingsbuilder-editor-wrapper');
        if (wrapper) {
            wrapper.style.display = 'flex';
            wrapper.style.visibility = 'visible';
            wrapper.style.opacity = '1';
        }
    }, 100);
}