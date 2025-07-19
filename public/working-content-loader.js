// WORKING Content Loader - Actually loads and displays Shopify page content
console.log('🔥 WORKING Content Loader - Starting...');

class WorkingContentLoader {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.pageData = null;
        this.isLoaded = false;
    }

    // Get URL parameters
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            shop: urlParams.get('shop') || 'kingsbuilder.myshopify.com',
            page: urlParams.get('page') || urlParams.get('pageId')
        };
    }

    // Load page content with detailed logging
    async loadPageContent() {
        const params = this.getUrlParams();
        
        if (!params.page || !params.shop) {
            console.log('❌ No page ID or shop found in URL');
            return null;
        }

        try {
            console.log(`🔥 LOADING PAGE: ${params.page} from SHOP: ${params.shop}`);
            
            const apiUrl = `/api/pages/${params.page}?shop=${encodeURIComponent(params.shop)}`;
            console.log(`📡 API URL: ${apiUrl}`);
            
            const response = await fetch(apiUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log(`📡 Response Status: ${response.status}`);
            console.log(`📡 Response Headers:`, response.headers);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('🔥 RAW API RESPONSE:', data);
            
            // Check different possible data structures
            if (data.page) {
                console.log('✅ Found data.page:', data.page);
                this.pageData = data.page;
            } else if (data.data && data.data.page) {
                console.log('✅ Found data.data.page:', data.data.page);
                this.pageData = data.data.page;
            } else if (data.body_html) {
                console.log('✅ Found direct body_html:', data.body_html);
                this.pageData = data;
            } else {
                console.log('⚠️ No recognizable page data structure');
                console.log('🔍 Available keys:', Object.keys(data));
                this.pageData = data;
            }
            
            if (this.pageData && this.pageData.body_html) {
                console.log('🎯 PAGE CONTENT FOUND:', this.pageData.body_html.substring(0, 200) + '...');
                this.displayContent();
                return this.pageData;
            } else {
                console.log('❌ No body_html found in page data');
                console.log('🔍 Page data structure:', this.pageData);
                this.showNoContent();
                return null;
            }
            
        } catch (error) {
            console.error('❌ FAILED TO LOAD PAGE CONTENT:', error);
            this.showError(error.message);
            return null;
        }
    }

    // Display content in the canvas
    displayContent() {
        console.log('🎨 DISPLAYING CONTENT...');
        
        // Find the canvas area
        const canvas = this.findCanvas();
        if (!canvas) {
            console.error('❌ No canvas found to display content');
            return;
        }

        console.log('✅ Canvas found:', canvas);
        
        // Clear existing content
        canvas.innerHTML = '';
        
        // Create content container
        const contentContainer = document.createElement('div');
        contentContainer.className = 'loaded-content-container';
        contentContainer.style.cssText = `
            padding: 20px;
            background: white;
            border-radius: 8px;
            margin: 10px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        `;
        
        // Add header
        const header = document.createElement('div');
        header.className = 'content-header';
        header.innerHTML = `
            <h3 style="margin: 0 0 15px 0; color: #007cba; font-size: 18px;">
                📄 Loaded Page Content
            </h3>
            <p style="margin: 0 0 20px 0; color: #666; font-size: 14px;">
                Content loaded from Shopify page. Click to edit any section.
            </p>
        `;
        contentContainer.appendChild(header);
        
        // Parse and display HTML content
        const htmlContent = this.pageData.body_html;
        
        if (htmlContent && htmlContent.trim()) {
            console.log('📝 Parsing HTML content...');
            
            // Create temporary container to parse HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = htmlContent;
            
            // Get all child elements
            const elements = Array.from(tempDiv.children);
            
            if (elements.length === 0) {
                // Single text content
                this.createEditableSection(contentContainer, 'text', htmlContent);
            } else {
                // Multiple elements
                elements.forEach((element, index) => {
                    this.createEditableSection(contentContainer, element.tagName.toLowerCase(), element.outerHTML, index);
                });
            }
            
            console.log(`✅ Created ${elements.length || 1} editable sections`);
        } else {
            console.log('⚠️ No HTML content to display');
            this.createEditableSection(contentContainer, 'text', '<p>This page appears to be empty. Click here to start editing.</p>');
        }
        
        canvas.appendChild(contentContainer);
        console.log('✅ Content displayed in canvas');
    }

    // Create editable section
    createEditableSection(container, type, content, index = 0) {
        const section = document.createElement('div');
        section.className = 'editable-section';
        section.style.cssText = `
            margin: 15px 0;
            padding: 15px;
            border: 2px dashed #e1e5e9;
            border-radius: 6px;
            position: relative;
            cursor: text;
            transition: all 0.3s ease;
        `;
        
        // Add hover effects
        section.addEventListener('mouseenter', () => {
            section.style.borderColor = '#007cba';
            section.style.backgroundColor = '#f8f9ff';
        });
        
        section.addEventListener('mouseleave', () => {
            section.style.borderColor = '#e1e5e9';
            section.style.backgroundColor = 'transparent';
        });
        
        // Create content area
        const contentArea = document.createElement('div');
        contentArea.className = 'section-content';
        contentArea.contentEditable = true;
        contentArea.innerHTML = content;
        contentArea.style.cssText = `
            outline: none;
            min-height: 30px;
            line-height: 1.5;
        `;
        
        // Add focus effects
        contentArea.addEventListener('focus', () => {
            section.style.borderStyle = 'solid';
            section.style.borderColor = '#007cba';
            section.style.backgroundColor = '#ffffff';
        });
        
        contentArea.addEventListener('blur', () => {
            section.style.borderStyle = 'dashed';
            section.style.borderColor = '#e1e5e9';
            section.style.backgroundColor = 'transparent';
        });
        
        // Auto-save on edit
        contentArea.addEventListener('input', () => {
            this.autoSave();
        });
        
        // Add type label
        const typeLabel = document.createElement('div');
        typeLabel.className = 'section-type';
        typeLabel.textContent = type.toUpperCase();
        typeLabel.style.cssText = `
            position: absolute;
            top: -10px;
            left: 10px;
            background: #007cba;
            color: white;
            padding: 2px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
        `;
        
        section.appendChild(typeLabel);
        section.appendChild(contentArea);
        container.appendChild(section);
    }

    // Find canvas area
    findCanvas() {
        const selectors = [
            '#kingsbuilder-preview',
            '#main-drop-zone',
            '.kingsbuilder-preview',
            '.canvas-drop-zone',
            '#canvas-content',
            '.canvas-area',
            '.drop-zone',
            '.builder-canvas',
            '.preview-area',
            'main'
        ];
        
        for (const selector of selectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`✅ Found canvas with selector: ${selector}`);
                return element;
            }
        }
        
        console.log('❌ No canvas found with any selector');
        return null;
    }

    // Show no content message
    showNoContent() {
        const canvas = this.findCanvas();
        if (!canvas) return;
        
        canvas.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">📄</div>
                <h3 style="color: #333; margin-bottom: 10px;">No Content Found</h3>
                <p>This Shopify page doesn't have any content yet.</p>
                <p>The API returned data but no body_html content.</p>
                <button onclick="window.WorkingContentLoader.retry()" style="
                    background: #007cba; 
                    color: white; 
                    border: none; 
                    padding: 10px 20px; 
                    border-radius: 5px; 
                    cursor: pointer;
                    margin-top: 15px;
                ">
                    🔄 Retry Loading
                </button>
            </div>
        `;
    }

    // Show error message
    showError(message) {
        const canvas = this.findCanvas();
        if (!canvas) return;
        
        canvas.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: #666;">
                <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
                <h3 style="color: #d32f2f; margin-bottom: 10px;">Loading Error</h3>
                <p>Failed to load page content:</p>
                <p style="color: #d32f2f; font-family: monospace; background: #fff3f3; padding: 10px; border-radius: 4px; margin: 15px 0;">
                    ${message}
                </p>
                <button onclick="window.WorkingContentLoader.retry()" style="
                    background: #007cba; 
                    color: white; 
                    border: none; 
                    padding: 10px 20px; 
                    border-radius: 5px; 
                    cursor: pointer;
                    margin-top: 15px;
                ">
                    🔄 Retry Loading
                </button>
            </div>
        `;
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
            const sections = document.querySelectorAll('.editable-section .section-content');
            let htmlContent = '';
            
            sections.forEach(section => {
                htmlContent += section.innerHTML + '\n';
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
                this.showSaveMessage('✅ Auto-saved');
            }
            
        } catch (error) {
            console.error('❌ Auto-save failed:', error);
            this.showSaveMessage('❌ Save failed');
        }
    }

    // Show save message
    showSaveMessage(message) {
        const existing = document.querySelector('.save-message');
        if (existing) existing.remove();
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'save-message';
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #007cba;
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 10000;
            font-size: 14px;
        `;
        
        document.body.appendChild(messageDiv);
        
        setTimeout(() => messageDiv.remove(), 2000);
    }

    // Retry loading
    async retry() {
        console.log('🔄 Retrying content load...');
        const canvas = this.findCanvas();
        if (canvas) {
            canvas.innerHTML = `
                <div style="text-align: center; padding: 60px 20px; color: #666;">
                    <div style="font-size: 32px; animation: spin 1s linear infinite; margin-bottom: 20px;">⟳</div>
                    <p>Retrying to load page content...</p>
                </div>
                <style>
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                </style>
            `;
        }
        
        await this.loadPageContent();
    }

    // Fix sidebar tabs
    fixSidebarTabs() {
        console.log('🔧 Fixing sidebar tabs...');
        
        // Find tab buttons
        const tabButtons = document.querySelectorAll('.tab-btn, [data-tab], .sidebar-tab');
        
        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                
                // Get tab target
                const tabTarget = button.dataset.tab || button.getAttribute('data-tab');
                
                if (tabTarget) {
                    // Hide all tab contents
                    document.querySelectorAll('.tab-content, .tab-panel').forEach(panel => {
                        panel.style.display = 'none';
                    });
                    
                    // Show target tab
                    const targetPanel = document.querySelector(`[data-tab-content="${tabTarget}"], #${tabTarget}, .${tabTarget}`);
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
        
        console.log(`✅ Fixed ${tabButtons.length} tab buttons`);
    }

    // Initialize
    async initialize() {
        if (!this.isBuilder) {
            console.log('ℹ️ Not on builder page, skipping content loader');
            return;
        }
        
        if (this.isLoaded) {
            console.log('ℹ️ Already loaded, skipping');
            return;
        }
        
        console.log('🚀 Initializing WORKING Content Loader...');
        
        // Fix sidebar tabs first
        setTimeout(() => {
            this.fixSidebarTabs();
        }, 1000);
        
        // Wait for page to be ready, then load content
        setTimeout(async () => {
            try {
                await this.loadPageContent();
                this.isLoaded = true;
            } catch (error) {
                console.error('❌ Initialization failed:', error);
            }
        }, 2000);
        
        console.log('✅ WORKING Content Loader initialized');
    }
}

// Create instance
const workingContentLoader = new WorkingContentLoader();

// Export for global access
window.WorkingContentLoader = {
    initialize: () => workingContentLoader.initialize(),
    loadContent: () => workingContentLoader.loadPageContent(),
    retry: () => workingContentLoader.retry(),
    save: () => workingContentLoader.saveContent()
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        workingContentLoader.initialize();
    });
} else {
    workingContentLoader.initialize();
}

console.log('✅ WORKING Content Loader loaded');