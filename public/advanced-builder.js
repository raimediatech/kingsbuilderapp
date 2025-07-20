// advanced-builder.js stub
// Provided by AI fix to satisfy script reference
window.KingsBuilder = window.KingsBuilder || {};
console.log('advanced-builder.js stub loaded - KingsBuilder global created');


// ===== KingsBuilder Patch: legacy global bridge =====
(function(){
    if (window.completeBuilder) {
        window.kingsBuilder = window.kingsBuilder || {};
        ['editElement','duplicateElement','deleteElement','selectElement','addElement','savePage','publishPage'].forEach(function(fn){
            if (typeof window.completeBuilder[fn] === 'function') {
                window.kingsBuilder[fn] = function(){ return window.completeBuilder[fn].apply(window.completeBuilder, arguments); };
            }
        });
        console.log('✅ kingsBuilder global bridge ready');
    }
})();
// ===== End Patch =====