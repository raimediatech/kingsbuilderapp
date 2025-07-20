// RESTORE BUILDER - Fix icons and restore drag & drop functionality
console.log('🔧 RESTORE BUILDER - Starting...');

class BuilderRestorer {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.pageData = null;
    }

    // Fix all icons immediately
    fixIcons() {
        console.log('🎨 Fixing all icons...');
        
        // Remove existing icon styles
        const existingStyles = document.querySelectorAll('#icon-fix-style, #simple-icon-fix-css, #final-icon-fix');
        existingStyles.forEach(style => style.remove());
        
        // Add comprehensive icon fix
        const style = document.createElement('style');
        style.id = 'builder-icon-fix';
        style.textContent = `
            /* FORCE ALL ICONS TO BE VISIBLE AND BLACK */
            i, .fa, .fas, .far, .fab, .fal, .fad, .fass, .fasr, .fasl,
            [class*="fa-"], [class^="fa-"], .icon, .material-icons,
            .sidebar i, .toolbar i, .menu i, .nav i, .btn i,
            .tab-btn i, .control-btn i, .action-btn i,
            .sidebar-icon, .menu-icon, .toolbar-icon, .nav-icon {
                color: #000000 !important;
                fill: #000000 !important;
                display: inline-block !important;
                visibility: visible !important;
                opacity: 1 !important;
                font-family: "Font Awesome 6 Free", "Font Awesome 6 Pro", "FontAwesome" !important;
                font-weight: 900 !important;
                font-style: normal !important;
                text-rendering: auto !important;
                -webkit-font-smoothing: antialiased !important;
            }
            
            /* Keep white icons on colored backgrounds */
            .btn-primary i, .btn-success i, .btn-info i, .btn-warning i, .btn-danger i,
            .bg-primary i, .bg-success i, .bg-info i, .bg-warning i, .bg-danger i,
            [style*="background-color: #007cba"] i,
            [style*="background: #007cba"] i,
            .active i, .selected i {
                color: #ffffff !important;
                fill: #ffffff !important;
            }
            
            /* Fix specific broken icons */
            .fa-plus::before { content: "\\f067" !important; }
            .fa-edit::before { content: "\\f044" !important; }
            .fa-trash::before { content: "\\f1f8" !important; }
            .fa-save::before { content: "\\f0c7" !important; }
            .fa-cog::before { content: "\\f013" !important; }
            .fa-settings::before { content: "\\f013" !important; }
            .fa-gear::before { content: "\\f013" !important; }
            .fa-bars::before { content: "\\f0c9" !important; }
            .fa-times::before { content: "\\f00d" !important; }
            .fa-close::before { content: "\\f00d" !important; }
            .fa-home::before { content: "\\f015" !important; }
            .fa-user::before { content: "\\f007" !important; }
            .fa-file::before { content: "\\f15b" !important; }
            .fa-folder::before { content: "\\f07b" !important; }
            .fa-image::before { content: "\\f03e" !important; }
            .fa-text::before { content: "\\f031" !important; }
            .fa-heading::before { content: "\\f1dc" !important; }
            .fa-paragraph::before { content: "\\f1dd" !important; }
            .fa-list::before { content: "\\f03a" !important; }
            .fa-table::before { content: "\\f0ce" !important; }
            .fa-link::before { content: "\\f0c1" !important; }
            .fa-button::before { content: "\\f192" !important; }
            .fa-video::before { content: "\\f03d" !important; }
            .fa-play::before { content: "\\f04b" !important; }
            .fa-pause::before { content: "\\f04c" !important; }
            .fa-stop::before { content: "\\f04d" !important; }
            .fa-upload::before { content: "\\f093" !important; }
            .fa-download::before { content: "\\f019" !important; }
            .fa-search::before { content: "\\f002" !important; }
            .fa-filter::before { content: "\\f0b0" !important; }
            .fa-sort::before { content: "\\f0dc" !important; }
            .fa-copy::before { content: "\\f0c5" !important; }
            .fa-cut::before { content: "\\f0c4" !important; }
            .fa-paste::before { content: "\\f0ea" !important; }
            .fa-undo::before { content: "\\f0e2" !important; }
            .fa-redo::before { content: "\\f01e" !important; }
            .fa-bold::before { content: "\\f032" !important; }
            .fa-italic::before { content: "\\f033" !important; }
            .fa-underline::before { content: "\\f0cd" !important; }
            .fa-align-left::before { content: "\\f036" !important; }
            .fa-align-center::before { content: "\\f037" !important; }
            .fa-align-right::before { content: "\\f038" !important; }
            .fa-align-justify::before { content: "\\f039" !important; }
            .fa-indent::before { content: "\\f03c" !important; }
            .fa-outdent::before { content: "\\f03b" !important; }
            .fa-quote::before { content: "\\f10d" !important; }
            .fa-code::before { content: "\\f121" !important; }
            .fa-paint-brush::before { content: "\\f1fc" !important; }
            .fa-palette::before { content: "\\f53f" !important; }
            .fa-eye::before { content: "\\f06e" !important; }
            .fa-eye-slash::before { content: "\\f070" !important; }
            .fa-lock::before { content: "\\f023" !important; }
            .fa-unlock::before { content: "\\f09c" !important; }
            .fa-star::before { content: "\\f005" !important; }
            .fa-heart::before { content: "\\f004" !important; }
            .fa-thumbs-up::before { content: "\\f164" !important; }
            .fa-thumbs-down::before { content: "\\f165" !important; }
            .fa-share::before { content: "\\f064" !important; }
            .fa-comment::before { content: "\\f075" !important; }
            .fa-envelope::before { content: "\\f0e0" !important; }
            .fa-phone::before { content: "\\f095" !important; }
            .fa-calendar::before { content: "\\f073" !important; }
            .fa-clock::before { content: "\\f017" !important; }
            .fa-map::before { content: "\\f279" !important; }
            .fa-location::before { content: "\\f3c5" !important; }
            .fa-globe::before { content: "\\f0ac" !important; }
            .fa-wifi::before { content: "\\f1eb" !important; }
            .fa-signal::before { content: "\\f012" !important; }
            .fa-battery::before { content: "\\f240" !important; }
            .fa-power::before { content: "\\f011" !important; }
            .fa-refresh::before { content: "\\f021" !important; }
            .fa-sync::before { content: "\\f021" !important; }
            .fa-spinner::before { content: "\\f110" !important; }
            .fa-loading::before { content: "\\f110" !important; }
            .fa-check::before { content: "\\f00c" !important; }
            .fa-checkmark::before { content: "\\f00c" !important; }
            .fa-cross::before { content: "\\f00d" !important; }
            .fa-x::before { content: "\\f00d" !important; }
            .fa-warning::before { content: "\\f071" !important; }
            .fa-exclamation::before { content: "\\f12a" !important; }
            .fa-info::before { content: "\\f129" !important; }
            .fa-question::before { content: "\\f128" !important; }
            .fa-help::before { content: "\\f128" !important; }
            .fa-support::before { content: "\\f1cd" !important; }
            .fa-bug::before { content: "\\f188" !important; }
            .fa-wrench::before { content: "\\f0ad" !important; }
            .fa-tools::before { content: "\\f7d9" !important; }
            .fa-hammer::before { content: "\\f6e3" !important; }
            .fa-screwdriver::before { content: "\\f54a" !important; }
            .fa-magic::before { content: "\\f0d0" !important; }
            .fa-wand::before { content: "\\f0d0" !important; }
            .fa-sparkles::before { content: "\\f890" !important; }
            .fa-fire::before { content: "\\f06d" !important; }
            .fa-flame::before { content: "\\f06d" !important; }
            .fa-lightning::before { content: "\\f0e7" !important; }
            .fa-bolt::before { content: "\\f0e7" !important; }
            .fa-zap::before { content: "\\f0e7" !important; }
            .fa-rocket::before { content: "\\f135" !important; }
            .fa-plane::before { content: "\\f072" !important; }
            .fa-car::before { content: "\\f1b9" !important; }
            .fa-truck::before { content: "\\f0d1" !important; }
            .fa-ship::before { content: "\\f21a" !important; }
            .fa-train::before { content: "\\f238" !important; }
            .fa-bicycle::before { content: "\\f206" !important; }
            .fa-motorcycle::before { content: "\\f21c" !important; }
            .fa-bus::before { content: "\\f207" !important; }
            .fa-taxi::before { content: "\\f1ba" !important; }
            .fa-subway::before { content: "\\f239" !important; }
            .fa-walk::before { content: "\\f554" !important; }
            .fa-run::before { content: "\\f70c" !important; }
            .fa-jump::before { content: "\\f24d" !important; }
            .fa-dance::before { content: "\\f4dd" !important; }
            .fa-music::before { content: "\\f001" !important; }
            .fa-note::before { content: "\\f1c9" !important; }
            .fa-sound::before { content: "\\f028" !important; }
            .fa-volume::before { content: "\\f028" !important; }
            .fa-speaker::before { content: "\\f028" !important; }
            .fa-headphones::before { content: "\\f025" !important; }
            .fa-microphone::before { content: "\\f130" !important; }
            .fa-mic::before { content: "\\f130" !important; }
            .fa-camera::before { content: "\\f030" !important; }
            .fa-photo::before { content: "\\f03e" !important; }
            .fa-picture::before { content: "\\f03e" !important; }
            .fa-gallery::before { content: "\\f03e" !important; }
            .fa-album::before { content: "\\f03e" !important; }
            .fa-slideshow::before { content: "\\f1e3" !important; }
            .fa-presentation::before { content: "\\f1c4" !important; }
            .fa-chart::before { content: "\\f080" !important; }
            .fa-graph::before { content: "\\f080" !important; }
            .fa-analytics::before { content: "\\f080" !important; }
            .fa-statistics::before { content: "\\f080" !important; }
            .fa-data::before { content: "\\f1c0" !important; }
            .fa-database::before { content: "\\f1c0" !important; }
            .fa-server::before { content: "\\f233" !important; }
            .fa-cloud::before { content: "\\f0c2" !important; }
            .fa-storage::before { content: "\\f1c0" !important; }
            .fa-backup::before { content: "\\f1c6" !important; }
            .fa-restore::before { content: "\\f1da" !important; }
            .fa-archive::before { content: "\\f187" !important; }
            .fa-compress::before { content: "\\f066" !important; }
            .fa-expand::before { content: "\\f065" !important; }
            .fa-fullscreen::before { content: "\\f065" !important; }
            .fa-minimize::before { content: "\\f2d1" !important; }
            .fa-maximize::before { content: "\\f31e" !important; }
            .fa-resize::before { content: "\\f065" !important; }
            .fa-move::before { content: "\\f047" !important; }
            .fa-drag::before { content: "\\f047" !important; }
            .fa-drop::before { content: "\\f043" !important; }
            .fa-cursor::before { content: "\\f246" !important; }
            .fa-pointer::before { content: "\\f25a" !important; }
            .fa-hand::before { content: "\\f256" !important; }
            .fa-finger::before { content: "\\f25a" !important; }
            .fa-touch::before { content: "\\f25a" !important; }
            .fa-tap::before { content: "\\f25a" !important; }
            .fa-click::before { content: "\\f25a" !important; }
            .fa-select::before { content: "\\f25a" !important; }
            .fa-choose::before { content: "\\f25a" !important; }
            .fa-pick::before { content: "\\f25a" !important; }
            .fa-grab::before { content: "\\f255" !important; }
            .fa-hold::before { content: "\\f255" !important; }
            .fa-grip::before { content: "\\f58d" !important; }
            .fa-handle::before { content: "\\f58d" !important; }
        `;
        document.head.appendChild(style);
        console.log('✅ Icons fixed with comprehensive CSS');
    }

    // Restore drag & drop functionality
    restoreDragDrop() {
        console.log('🔄 Restoring drag & drop functionality...');
        
        // Wait for DOM to be ready
        setTimeout(() => {
            // Find the canvas
            const canvas = document.querySelector('#kingsbuilder-preview, #main-drop-zone, .kingsbuilder-preview, .canvas-drop-zone, .drop-zone, main');
            
            if (canvas) {
                console.log('✅ Found canvas, enabling drag & drop');
                
                // Make canvas droppable
                canvas.style.minHeight = '500px';
                canvas.style.border = '2px dashed #e1e5e9';
                canvas.style.borderRadius = '8px';
                canvas.style.padding = '20px';
                canvas.style.position = 'relative';
                
                // Add drop zone styling
                canvas.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    canvas.style.borderColor = '#007cba';
                    canvas.style.backgroundColor = '#f8f9ff';
                });
                
                canvas.addEventListener('dragleave', (e) => {
                    e.preventDefault();
                    canvas.style.borderColor = '#e1e5e9';
                    canvas.style.backgroundColor = 'transparent';
                });
                
                canvas.addEventListener('drop', (e) => {
                    e.preventDefault();
                    canvas.style.borderColor = '#e1e5e9';
                    canvas.style.backgroundColor = 'transparent';
                    
                    // Handle drop
                    const elementType = e.dataTransfer.getData('text/plain');
                    if (elementType) {
                        this.addElementToCanvas(canvas, elementType, e.clientX, e.clientY);
                    }
                });
                
                console.log('✅ Drag & drop enabled on canvas');
            } else {
                console.log('❌ Canvas not found for drag & drop');
            }
            
            // Enable draggable elements in sidebar
            this.enableSidebarDragging();
            
        }, 1000);
    }

    // Enable sidebar dragging
    enableSidebarDragging() {
        console.log('🔄 Enabling sidebar dragging...');
        
        // Find all draggable elements
        const draggableSelectors = [
            '.component-item',
            '.widget-item',
            '.element-item',
            '.tool-item',
            '[draggable="true"]',
            '.draggable'
        ];
        
        draggableSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(element => {
                element.draggable = true;
                element.addEventListener('dragstart', (e) => {
                    const elementType = element.dataset.type || element.textContent.trim() || 'text';
                    e.dataTransfer.setData('text/plain', elementType);
                    console.log(`🔄 Dragging: ${elementType}`);
                });
            });
        });
        
        // If no draggable elements found, create them
        const sidebar = document.querySelector('.sidebar, .components-panel, .tools-panel, .widget-panel');
        if (sidebar && !document.querySelector('.component-item')) {
            this.createDraggableElements(sidebar);
        }
        
        console.log('✅ Sidebar dragging enabled');
    }

    // Create draggable elements if they don't exist
    createDraggableElements(sidebar) {
        console.log('🔧 Creating draggable elements...');
        
        const elements = [
            { type: 'heading', icon: 'fa-heading', label: 'Heading' },
            { type: 'text', icon: 'fa-paragraph', label: 'Text' },
            { type: 'image', icon: 'fa-image', label: 'Image' },
            { type: 'button', icon: 'fa-hand-pointer', label: 'Button' },
            { type: 'list', icon: 'fa-list', label: 'List' },
            { type: 'table', icon: 'fa-table', label: 'Table' },
            { type: 'video', icon: 'fa-video', label: 'Video' },
            { type: 'form', icon: 'fa-wpforms', label: 'Form' }
        ];
        
        const elementsContainer = document.createElement('div');
        elementsContainer.className = 'draggable-elements';
        elementsContainer.innerHTML = `
            <h4 style="margin: 0 0 15px 0; padding: 10px; background: #f5f5f5; border-radius: 4px;">
                <i class="fa fa-plus"></i> Drag Elements
            </h4>
        `;
        
        elements.forEach(element => {
            const elementDiv = document.createElement('div');
            elementDiv.className = 'component-item';
            elementDiv.draggable = true;
            elementDiv.dataset.type = element.type;
            elementDiv.style.cssText = `
                padding: 10px;
                margin: 5px 0;
                background: white;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: grab;
                display: flex;
                align-items: center;
                gap: 10px;
                transition: all 0.2s;
            `;
            
            elementDiv.innerHTML = `
                <i class="fa ${element.icon}" style="color: #007cba;"></i>
                <span>${element.label}</span>
            `;
            
            elementDiv.addEventListener('mouseenter', () => {
                elementDiv.style.backgroundColor = '#f0f8ff';
                elementDiv.style.borderColor = '#007cba';
            });
            
            elementDiv.addEventListener('mouseleave', () => {
                elementDiv.style.backgroundColor = 'white';
                elementDiv.style.borderColor = '#ddd';
            });
            
            elementDiv.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', element.type);
                console.log(`🔄 Dragging: ${element.type}`);
            });
            
            elementsContainer.appendChild(elementDiv);
        });
        
        sidebar.appendChild(elementsContainer);
        console.log('✅ Created draggable elements');
    }

    // Add element to canvas
    addElementToCanvas(canvas, elementType, x, y) {
        console.log(`➕ Adding ${elementType} to canvas`);
        
        const elementTemplates = {
            heading: '<h2 contenteditable="true" style="margin: 10px 0;">New Heading</h2>',
            text: '<p contenteditable="true" style="margin: 10px 0;">Click here to edit text...</p>',
            image: '<img src="https://via.placeholder.com/300x200" alt="Image" style="max-width: 100%; height: auto; margin: 10px 0;">',
            button: '<button style="background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer; margin: 10px 0;">Click Me</button>',
            list: '<ul contenteditable="true" style="margin: 10px 0;"><li>List item 1</li><li>List item 2</li><li>List item 3</li></ul>',
            table: '<table style="border-collapse: collapse; width: 100%; margin: 10px 0;"><tr><th style="border: 1px solid #ddd; padding: 8px;">Header 1</th><th style="border: 1px solid #ddd; padding: 8px;">Header 2</th></tr><tr><td contenteditable="true" style="border: 1px solid #ddd; padding: 8px;">Cell 1</td><td contenteditable="true" style="border: 1px solid #ddd; padding: 8px;">Cell 2</td></tr></table>',
            video: '<div style="margin: 10px 0;"><iframe width="300" height="200" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe></div>',
            form: '<form style="margin: 10px 0;"><input type="text" placeholder="Name" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;"><input type="email" placeholder="Email" style="width: 100%; padding: 8px; margin: 5px 0; border: 1px solid #ddd; border-radius: 4px;"><button type="submit" style="background: #007cba; color: white; padding: 10px 20px; border: none; border-radius: 4px; cursor: pointer;">Submit</button></form>'
        };
        
        const template = elementTemplates[elementType] || elementTemplates.text;
        
        // Create element wrapper
        const wrapper = document.createElement('div');
        wrapper.className = 'canvas-element';
        wrapper.style.cssText = `
            position: relative;
            margin: 10px 0;
            padding: 10px;
            border: 2px dashed transparent;
            border-radius: 4px;
            transition: all 0.2s;
        `;
        
        wrapper.innerHTML = template;
        
        // Add hover effects
        wrapper.addEventListener('mouseenter', () => {
            wrapper.style.borderColor = '#007cba';
            wrapper.style.backgroundColor = '#f8f9ff';
        });
        
        wrapper.addEventListener('mouseleave', () => {
            wrapper.style.borderColor = 'transparent';
            wrapper.style.backgroundColor = 'transparent';
        });
        
        // Add to canvas
        canvas.appendChild(wrapper);
        
        console.log(`✅ Added ${elementType} to canvas`);
    }

    // Load Shopify content and make it editable
    async loadShopifyContent() {
        if (!this.isBuilder) return;
        
        const params = this.getUrlParams();
        if (!params.page || !params.shop) return;
        
        try {
            console.log(`📄 Loading Shopify content for page ${params.page}`);
            
            const response = await fetch(`/api/pages/${params.page}?shop=${encodeURIComponent(params.shop)}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const data = await response.json();
            
            if (data.success && data.page && data.page.body_html) {
                console.log('✅ Shopify content loaded');
                this.displayShopifyContent(data.page.body_html);
            } else {
                console.log('⚠️ No Shopify content found');
            }
            
        } catch (error) {
            console.error('❌ Failed to load Shopify content:', error);
        }
    }

    // Display Shopify content in canvas
    displayShopifyContent(htmlContent) {
        const canvas = document.querySelector('#kingsbuilder-preview, #main-drop-zone, .kingsbuilder-preview, .canvas-drop-zone, .drop-zone, main');
        if (!canvas) return;
        
        console.log('📝 Displaying Shopify content in canvas');
        
        // Clear canvas
        canvas.innerHTML = '';
        
        // Add content header
        const header = document.createElement('div');
        header.style.cssText = `
            background: #007cba;
            color: white;
            padding: 10px 15px;
            margin: -20px -20px 20px -20px;
            border-radius: 8px 8px 0 0;
            font-size: 14px;
            font-weight: bold;
        `;
        header.innerHTML = '📄 Shopify Page Content (Drag elements from sidebar to add more)';
        canvas.appendChild(header);
        
        // Create content wrapper
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'shopify-content-wrapper';
        contentWrapper.style.cssText = `
            position: relative;
            padding: 10px;
            border: 2px dashed #e1e5e9;
            border-radius: 4px;
            min-height: 200px;
        `;
        
        contentWrapper.innerHTML = htmlContent;
        
        // Make content editable
        this.makeContentEditable(contentWrapper);
        
        canvas.appendChild(contentWrapper);
        
        console.log('✅ Shopify content displayed and made editable');
    }

    // Make content editable
    makeContentEditable(container) {
        const editableElements = container.querySelectorAll('p, h1, h2, h3, h4, h5, h6, div, span, li, td, th');
        
        editableElements.forEach(element => {
            element.contentEditable = true;
            element.style.outline = 'none';
            
            element.addEventListener('focus', () => {
                element.style.backgroundColor = '#fff3cd';
                element.style.border = '1px dashed #007cba';
                element.style.padding = '5px';
            });
            
            element.addEventListener('blur', () => {
                element.style.backgroundColor = 'transparent';
                element.style.border = 'none';
                element.style.padding = '0';
            });
        });
        
        console.log(`✅ Made ${editableElements.length} elements editable`);
    }

    // Get URL parameters
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            shop: urlParams.get('shop') || 'kingsbuilder.myshopify.com',
            page: urlParams.get('page') || urlParams.get('pageId')
        };
    }

    // Fix sidebar tabs
    fixSidebarTabs() {
        console.log('🔧 Fixing sidebar tabs...');
        
        setTimeout(() => {
            const tabButtons = document.querySelectorAll('.tab-btn, [data-tab]');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    
                    const tabTarget = button.dataset.tab || button.getAttribute('data-tab');
                    
                    if (tabTarget) {
                        // Hide all panels
                        document.querySelectorAll('.tab-content, .tab-panel').forEach(panel => {
                            panel.style.display = 'none';
                        });
                        
                        // Show target panel
                        const targetPanel = document.querySelector(`[data-tab-content="${tabTarget}"], #${tabTarget}`);
                        if (targetPanel) {
                            targetPanel.style.display = 'block';
                        }
                        
                        // Update active states
                        tabButtons.forEach(btn => btn.classList.remove('active'));
                        button.classList.add('active');
                        
                        console.log(`✅ Switched to tab: ${tabTarget}`);
                    }
                });
            });
            
            console.log(`✅ Fixed ${tabButtons.length} sidebar tabs`);
        }, 1500);
    }

    // Initialize everything
    async initialize() {
        if (!this.isBuilder) {
            console.log('Not on builder page');
            return;
        }
        
        console.log('🚀 Initializing Builder Restorer...');
        
        // Fix icons immediately
        this.fixIcons();
        
        // Wait for DOM to be ready, then restore functionality
        setTimeout(async () => {
            this.restoreDragDrop();
            this.fixSidebarTabs();
            await this.loadShopifyContent();
        }, 2000);
        
        console.log('✅ Builder Restorer initialized');
    }
}

// Create instance
const builderRestorer = new BuilderRestorer();

// Export for global access
window.BuilderRestorer = {
    initialize: () => builderRestorer.initialize(),
    fixIcons: () => builderRestorer.fixIcons(),
    restoreDragDrop: () => builderRestorer.restoreDragDrop()
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        builderRestorer.initialize();
    });
} else {
    builderRestorer.initialize();
}

console.log('✅ RESTORE BUILDER loaded');