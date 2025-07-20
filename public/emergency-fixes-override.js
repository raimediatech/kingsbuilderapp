// 🚨 EMERGENCY FIXES OVERRIDE
// This script overrides the problematic emergency-fixes.js to prevent UI breaking

console.log('🚨 EMERGENCY FIXES OVERRIDE: Preventing problematic fixes...');

// Disable the problematic addDragDropFallbacks function
if (window.addDragDropFallbacks) {
    console.log('🚫 Overriding addDragDropFallbacks to prevent placeholder widgets');
    window.addDragDropFallbacks = function() {
        console.log('✅ addDragDropFallbacks disabled - using proper widget system instead');
    };
}

// Override any other problematic functions
window.addEventListener('load', function() {
    // Disable any emergency fixes that might create placeholder content
    if (window.EmergencyFix) {
        console.log('🚫 Disabling EmergencyFix class');
        window.EmergencyFix = function() {
            console.log('✅ EmergencyFix disabled');
        };
    }
    
    // Clean up any existing placeholder widgets
    setTimeout(() => {
        const placeholderWidgets = document.querySelectorAll('.elementor-widget:not(.kb-element)');
        placeholderWidgets.forEach(widget => {
            if (widget.textContent.includes('This is a') && widget.textContent.includes('widget. Click to edit.')) {
                console.log('🧹 Removing placeholder widget:', widget);
                widget.remove();
            }
        });
    }, 2000);
});

console.log('✅ EMERGENCY FIXES OVERRIDE: Applied successfully');