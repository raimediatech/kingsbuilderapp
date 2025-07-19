// Simple Content Fix - Only fix content loading without breaking anything
console.log('🔧 Simple Content Fix - Loading...');

class SimpleContentFix {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.pageData = null;
    }

    // Get URL parameters
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            shop: urlParams.get('shop') || 'kingsbuilder.myshopify.com',
            page: urlParams.get('page') || urlParams.get('pageId')
        };
    }

    // Load page content from API
    async loadPageContent() {
        const params = this.getUrlParams();
        
        if (!params.page || !params.shop) {
            console.log('ℹ️ No page ID or shop found');
            return;
        }

        try {
            console.log(`📡 Loading page ${params.page} from shop ${params.shop}`);
            
            const response = await fetch(`/api/pages/${params.page}?shop=${encodeURIComponent(params.shop)}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('✅ Page data loaded:', data);
            
            if (data.success && data.page) {
                this.pageData = data.page;
                this.injectContentIntoExistingCanvas();
                return data.page;
            } else {
                throw new Error(data.error || 'Failed to load page');
            }
            
        } catch (error) {
            console.error('❌ Failed to load page content:', error);
            return null;
        }
    }

    // Inject content into existing canvas areas
    injectContentIntoExistingCanvas() {
        if (!this.pageData || !this.pageData.body_html) {
            console.log('📝 No content to inject');
            return;
        }

        console.log('📄 Injecting content into existing canvas...');
        
        // Find existing canvas areas
        const canvasAreas = [
            document.getElementById('main-drop-zone'),
            document.querySelector('.canvas-drop-zone'),
            document.querySelector('#canvas-content'),
            document.querySelector('.canvas-area'),
            document.querySelector('.drop-zone'),
            document.querySelector('.builder-canvas')
        ].filter(el => el !== null);

        if (canvasAreas.length === 0) {
            console.log('⚠️ No canvas areas found');
            return;
        }

        canvasAreas.forEach(canvas => {
            this.populateCanvas(canvas);
        });
    }

    // Populate canvas with content
    populateCanvas(canvas) {
        try {
            console.log('📝 Populating canvas with content...');
            
            // Clear existing content
            canvas.innerHTML = '';
            
            // Parse HTML content
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = this.pageData.body_html;
            
            // Convert to editable elements
            const children = Array.from(tempDiv.children);
            
            if (children.length === 0 && this.pageData.body_html.trim()) {
                // Single content block
                this.createEditableElement(canvas, 'paragraph', this.pageData.body_html);
            } else {
                // Multiple elements
                children.forEach((child, index) => {
                    const elementType = this.getElementType(child);
                    this.createEditableElement(canvas, elementType, child.outerHTML, index);
                });
            }
            
            console.log(`✅ Canvas populated with ${children.length || 1} elements`);
            
        } catch (error) {
            console.error('❌ Failed to populate canvas:', error);
        }
    }

    // Get element type
    getElementType(element) {
        const tagName = element.tagName.toLowerCase();
        
        switch (tagName) {
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
            case 'h6':
                return 'heading';
            case 'p':
                return 'paragraph';
            case 'img':
                return 'image';
            case 'ul':
            case 'ol':
                return 'list';
            case 'blockquote':
                return 'quote';
            case 'hr':
                return 'divider';
            default:
                return 'content';
        }
    }

    // Create editable element
    createEditableElement(canvas, type, content, index = 0) {
        const elementId = `element_${Date.now()}_${index}`;
        
        const wrapper = document.createElement('div');
        wrapper.className = 'canvas-element editable-element';
        wrapper.id = elementId;
        wrapper.style.cssText = `
            margin: 10px 0;
            padding: 15px;
            border: 1px solid #e1e5e9;
            border-radius: 6px;
            background: white;
            position: relative;
            cursor: pointer;
        `;
        
        // Create content
        const contentDiv = document.createElement('div');
        contentDiv.className = 'element-content';
        contentDiv.contentEditable = true;
        contentDiv.innerHTML = content;
        contentDiv.style.cssText = `
            outline: none;
            min-height: 20px;
        `;
        
        // Add focus styles
        contentDiv.addEventListener('focus', () => {
            wrapper.style.borderColor = '#007cba';
            wrapper.style.boxShadow = '0 0 0 2px rgba(0,124,186,0.1)';
        });
        
        contentDiv.addEventListener('blur', () => {
            wrapper.style.borderColor = '#e1e5e9';
            wrapper.style.boxShadow = 'none';
        });
        
        // Auto-save on edit
        contentDiv.addEventListener('input', () => {
            this.autoSave();
        });
        
        wrapper.appendChild(contentDiv);
        canvas.appendChild(wrapper);
    }

    // Auto-save functionality
    autoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveContent();
        }, 3000);
    }

    // Save content
    async saveContent() {
        const params = this.getUrlParams();
        if (!params.page || !params.shop) return;

        try {
            // Collect all content
            const elements = document.querySelectorAll('.editable-element .element-content');
            let htmlContent = '';
            
            elements.forEach(element => {
                htmlContent += element.innerHTML + '\n';
            });
            
            if (!htmlContent.trim()) return;
            
            console.log('💾 Auto-saving content...');
            
            const response = await fetch(`/api/pages/${params.page}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    shop: params.shop,
                    content: htmlContent
                })
            });
            
            if (response.ok) {
                console.log('✅ Content auto-saved');
            }
            
        } catch (error) {
            console.error('❌ Auto-save failed:', error);
        }
    }

    // Wait for canvas to be ready
    async waitForCanvas(maxWait = 10000) {
        const startTime = Date.now();
        
        while (Date.now() - startTime < maxWait) {
            const canvas = document.getElementById('main-drop-zone') || 
                          document.querySelector('.canvas-drop-zone') ||
                          document.querySelector('#canvas-content');
            
            if (canvas) {
                return canvas;
            }
            
            await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        return null;
    }

    // Initialize for builder only
    async initialize() {
        if (!this.isBuilder) {
            console.log('ℹ️ Not on builder page, skipping');
            return;
        }
        
        console.log('🚀 Initializing Simple Content Fix for builder...');
        
        // Wait for canvas to be ready
        setTimeout(async () => {
            try {
                await this.waitForCanvas();
                await this.loadPageContent();
            } catch (error) {
                console.error('❌ Initialization failed:', error);
            }
        }, 3000);
        
        console.log('✅ Simple Content Fix initialized');
    }
}

// Create instance
const simpleContentFix = new SimpleContentFix();

// Export for global access
window.SimpleContentFix = {
    initialize: () => simpleContentFix.initialize(),
    loadContent: () => simpleContentFix.loadPageContent()
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        simpleContentFix.initialize();
    });
} else {
    simpleContentFix.initialize();
}

console.log('✅ Simple Content Fix loaded');