// Advanced KingsBuilder Initialization Override
// This ensures the advanced builder properly replaces the basic one

// Override the basic builder initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 Overriding basic KingsBuilder with Advanced version...');
    
    // Wait for basic builder to initialize first
    setTimeout(() => {
        if (window.kingsBuilder && !(window.kingsBuilder instanceof KingsBuilderAdvanced)) {
            console.log('📈 Upgrading to KingsBuilderAdvanced...');
            
            // Backup existing data
            const existingData = {
                elements: window.kingsBuilder.elements || [],
                history: window.kingsBuilder.history || [],
                historyIndex: window.kingsBuilder.historyIndex || -1,
                selectedElement: window.kingsBuilder.selectedElement || null,
                shop: window.kingsBuilder.shop,
                pageId: window.kingsBuilder.pageId
            };
            
            // Create new advanced builder
            const newBuilder = new KingsBuilderAdvanced();
            
            // Transfer data
            newBuilder.elements = existingData.elements;
            newBuilder.history = existingData.history;
            newBuilder.historyIndex = existingData.historyIndex;
            newBuilder.selectedElement = existingData.selectedElement;
            newBuilder.shop = existingData.shop;
            newBuilder.pageId = existingData.pageId;
            
            // Replace the builder
            window.kingsBuilder = newBuilder;
            
            console.log('✅ Successfully upgraded to KingsBuilderAdvanced!');
            
            // If there was a selected element, reselect it with advanced properties
            if (existingData.selectedElement) {
                setTimeout(() => {
                    newBuilder.selectElement(existingData.selectedElement);
                }, 100);
            }
        }
    }, 300);
});