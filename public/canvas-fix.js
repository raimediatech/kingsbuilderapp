// Canvas Fix
class CanvasFix {
    constructor() {
        this.maxRetries = 5;
        this.retryCount = 0;
        this.retryDelay = 500; // ms
        this.initialize();
    }

    initialize() {
        console.log('🎨 Initializing Canvas Fix...');
        this.setupCanvas();
    }

    setupCanvas() {
        const canvas = document.getElementById('kingsbuilder-canvas');
        const canvasContent = document.getElementById('canvasContent');

        if (!canvas) {
            console.error('❌ Canvas element not found');
            this.retryInitialization();
            return;
        }

        // Create canvas content if it doesn't exist
        if (!canvasContent) {
            console.log('🔄 Creating canvas content element...');
            const newCanvasContent = document.createElement('div');
            newCanvasContent.id = 'canvasContent';
            newCanvasContent.className = 'canvas-content';
            canvas.appendChild(newCanvasContent);
            console.log('✅ Canvas content created');
        }

        // Set up drag and drop
        this.setupDragAndDrop();
    }

    setupDragAndDrop() {
        const canvas = document.getElementById('kingsbuilder-canvas');
        if (!canvas) return;

        // Prevent default drag behaviors
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            canvas.addEventListener(eventName, this.preventDefaults, false);
        });

        // Highlight drop area when item is dragged over it
        ['dragenter', 'dragover'].forEach(eventName => {
            canvas.addEventListener(eventName, this.highlight, false);
        });

        // Remove highlight when item leaves drop area
        ['dragleave', 'drop'].forEach(eventName => {
            canvas.addEventListener(eventName, this.unhighlight, false);
        });

        // Handle drop
        canvas.addEventListener('drop', this.handleDrop, false);

        console.log('✅ Drag and drop initialized');
    }

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    highlight(e) {
        const canvas = document.getElementById('kingsbuilder-canvas');
        if (canvas) canvas.classList.add('drag-over');
    }

    unhighlight(e) {
        const canvas = document.getElementById('kingsbuilder-canvas');
        if (canvas) canvas.classList.remove('drag-over');
    }

    handleDrop(e) {
        const dt = e.dataTransfer;
        const elementType = dt.getData('text/plain');
        
        if (elementType) {
            console.log(`🎯 Dropped element: ${elementType}`);
            // Add your element creation logic here
            const element = this.createElement(elementType);
            if (element) {
                const canvasContent = document.getElementById('canvasContent') || 
                                    document.getElementById('kingsbuilder-canvas');
                if (canvasContent) {
                    canvasContent.appendChild(element);
                    console.log(`✅ Added ${elementType} to canvas`);
                }
            }
        }
    }

    createElement(type) {
        const element = document.createElement('div');
        element.className = `element ${type}`;
        element.draggable = true;
        element.textContent = type.charAt(0).toUpperCase() + type.slice(1);
        
        // Add basic styling
        element.style.padding = '20px';
        element.style.margin = '10px';
        element.style.border = '1px dashed #ccc';
        element.style.borderRadius = '4px';
        
        return element;
    }

    retryInitialization() {
        if (this.retryCount < this.maxRetries) {
            this.retryCount++;
            console.log(`🔄 Retrying canvas initialization (${this.retryCount}/${this.maxRetries})...`);
            setTimeout(() => this.setupCanvas(), this.retryDelay);
        } else {
            console.error('❌ Max retries reached. Canvas initialization failed.');
        }
    }
}

// Initialize Canvas Fix
if (typeof window.CanvasFix === 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.CanvasFix = new CanvasFix();
    });
}
