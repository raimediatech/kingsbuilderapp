// FINAL WORKING FIX - Actually loads content and fixes icons
console.log('🎯 FINAL WORKING FIX - Starting...');

class FinalWorkingFix {
    constructor() {
        this.isBuilder = window.location.pathname.includes('builder');
        this.pageData = null;
        this.isLoaded = false;
    }

    // Fix icons immediately
    fixIcons() {
        console.log('🎨 Fixing icons...');
        
        // Remove any existing icon fix styles
        const existingStyles = document.querySelectorAll('#icon-fix-style, #simple-icon-fix-css');
        existingStyles.forEach(style => style.remove());
        
        // Add comprehensive icon fix
        const style = document.createElement('style');
        style.id = 'final-icon-fix';
        style.textContent = `
            /* FORCE ALL ICONS TO BE BLACK */
            i, .fa, .fas, .far, .fab, .fal, .fad, .fass, .fasr, .fasl,
            [class*="fa-"], [class^="fa-"], .icon, .material-icons,
            .sidebar i, .toolbar i, .menu i, .nav i, .btn i,
            .tab-btn i, .control-btn i, .action-btn i {
                color: #000000 !important;
                fill: #000000 !important;
            }
            
            /* Keep white icons on colored backgrounds */
            .btn-primary i, .btn-success i, .btn-info i, .btn-warning i, .btn-danger i,
            .bg-primary i, .bg-success i, .bg-info i, .bg-warning i, .bg-danger i,
            [style*="background-color: #007cba"] i,
            [style*="background: #007cba"] i {
                color: #ffffff !important;
                fill: #ffffff !important;
            }
            
            /* Fix specific icon containers */
            .sidebar-icon, .menu-icon, .toolbar-icon, .nav-icon {
                color: #000000 !important;
            }
            
            /* Ensure visibility */
            i:not([style*="display: none"]) {
                display: inline-block !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
        console.log('✅ Icons fixed');
    }

    // Get URL parameters
    getUrlParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return {
            shop: urlParams.get('shop') || 'kingsbuilder.myshopify.com',
            page: urlParams.get('page') || urlParams.get('pageId')
        };
    }

    // Load page content with better error handling
    async loadPageContent() {
        const params = this.getUrlParams();
        
        if (!params.page || !params.shop) {
            console.log('❌ No page ID or shop found in URL');
            this.showMessage('No page ID found in URL', 'error');
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

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            console.log('🔥 RAW API RESPONSE:', JSON.stringify(data, null, 2));
            
            // Handle different response structures
            let pageData = null;
            
            if (data.success && data.page) {
                pageData = data.page;
                console.log('✅ Found data.page');
            } else if (data.page) {
                pageData = data.page;
                console.log('✅ Found direct page data');
            } else if (data.data && data.data.page) {
                pageData = data.data.page;
                console.log('✅ Found nested page data');
            } else if (data.body_html || data.title) {
                pageData = data;
                console.log('✅ Using direct response as page data');
            } else {
                console.log('⚠️ No recognizable page structure');
                console.log('🔍 Available keys:', Object.keys(data));
                
                // Try to find any content in the response
                const possibleContent = this.findContentInResponse(data);
                if (possibleContent) {
                    pageData = possibleContent;
                    console.log('✅ Found content in response');
                } else {
                    throw new Error('No page content found in API response');
                }
            }
            
            this.pageData = pageData;
            console.log('📄 Final page data:', pageData);
            
            // Check for content
            if (pageData.body_html && pageData.body_html.trim()) {
                console.log('🎯 CONTENT FOUND:', pageData.body_html.substring(0, 200) + '...');
                this.displayContent();
                return pageData;
            } else {
                console.log('⚠️ No body_html content found');
                console.log('🔍 Page data keys:', Object.keys(pageData));
                
                // Try to create content from other fields
                const alternativeContent = this.createAlternativeContent(pageData);
                if (alternativeContent) {
                    this.displayAlternativeContent(alternativeContent);
                    return pageData;
                } else {
                    this.showEmptyPageEditor();
                    return pageData;
                }
            }
            
        } catch (error) {
            console.error('❌ FAILED TO LOAD PAGE CONTENT:', error);
            this.showError(error.message);
            return null;
        }
    }

    // Find content in API response
    findContentInResponse(data) {
        // Look for content in various possible locations
        const possiblePaths = [
            'page.body_html',
            'data.page.body_html',
            'result.page.body_html',
            'body_html',
            'content',
            'html',
            'page_content'
        ];
        
        for (const path of possiblePaths) {
            const value = this.getNestedValue(data, path);
            if (value && typeof value === 'string' && value.trim()) {
                return { body_html: value, title: data.title || 'Untitled Page' };
            }
        }
        
        return null;
    }

    // Get nested value from object
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => current && current[key], obj);
    }

    // Create alternative content from page data
    createAlternativeContent(pageData) {
        let content = '';
        
        if (pageData.title) {
            content += `<h1>${pageData.title}</h1>\n`;
        }
        
        if (pageData.summary_html) {
            content += pageData.summary_html + '\n';
        }
        
        if (pageData.excerpt) {
            content += `<p>${pageData.excerpt}</p>\n`;
        }
        
        if (content.trim()) {
            return content;
        }
        
        return null;
    }

    // Display content in canvas
    displayContent() {
        console.log('🎨 DISPLAYING CONTENT...');
        
        const canvas = this.findCanvas();
        if (!canvas) {
            console.error('❌ No canvas found');
            return;
        }

        // Clear canvas
        canvas.innerHTML = '';
        
        // Create content editor
        const editor = document.createElement('div');
        editor.className = 'content-editor';
        editor.innerHTML = `
            <div class="editor-header">
                <h3>📄 Page Content Editor</h3>
                <div class="editor-controls">
                    <button onclick="window.FinalWorkingFix.saveContent()" class="save-btn">💾 Save</button>
                    <button onclick="window.FinalWorkingFix.addElement()" class="add-btn">➕ Add Element</button>
                </div>
            </div>
            <div class="editor-content" id="editor-content"></div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            .content-editor {
                background: white;
                border-radius: 8px;
                margin: 10px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                overflow: hidden;
            }
            
            .editor-header {
                background: #007cba;
                color: white;
                padding: 15px 20px;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .editor-header h3 {
                margin: 0;
                font-size: 18px;
            }
            
            .editor-controls {
                display: flex;
                gap: 10px;
            }
            
            .save-btn, .add-btn {
                background: rgba(255,255,255,0.2);
                color: white;
                border: 1px solid rgba(255,255,255,0.3);
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
            }
            
            .save-btn:hover, .add-btn:hover {
                background: rgba(255,255,255,0.3);
            }
            
            .editor-content {
                padding: 20px;
            }
            
            .editable-element {
                margin: 15px 0;
                padding: 15px;
                border: 2px dashed #e1e5e9;
                border-radius: 6px;
                position: relative;
                transition: all 0.3s ease;
            }
            
            .editable-element:hover {
                border-color: #007cba;
                background: #f8f9ff;
            }
            
            .element-content {
                outline: none;
                min-height: 30px;
                line-height: 1.5;
            }
            
            .element-content:focus {
                background: white;
            }
            
            .element-controls {
                position: absolute;
                top: -35px;
                right: 0;
                display: none;
                gap: 5px;
            }
            
            .editable-element:hover .element-controls {
                display: flex;
            }
            
            .control-btn {
                background: #007cba;
                color: white;
                border: none;
                width: 28px;
                height: 28px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
            }
        `;
        document.head.appendChild(style);
        
        canvas.appendChild(editor);
        
        // Parse and add content
        this.parseAndAddContent();
        
        console.log('✅ Content editor displayed');
    }

    // Parse and add content to editor
    parseAndAddContent() {
        const editorContent = document.getElementById('editor-content');
        if (!editorContent) return;
        
        const htmlContent = this.pageData.body_html;
        
        // Parse HTML
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = htmlContent;
        
        const elements = Array.from(tempDiv.children);
        
        if (elements.length === 0) {
            // Single content block
            this.addEditableElement(editorContent, 'text', htmlContent);
        } else {
            // Multiple elements
            elements.forEach((element, index) => {
                this.addEditableElement(editorContent, element.tagName.toLowerCase(), element.outerHTML, index);
            });
        }
    }

    // Add editable element
    addEditableElement(container, type, content, index = 0) {
        const elementId = `element_${Date.now()}_${index}`;
        
        const element = document.createElement('div');
        element.className = 'editable-element';
        element.id = elementId;
        
        element.innerHTML = `
            <div class="element-controls">
                <button class="control-btn" onclick="window.FinalWorkingFix.moveUp('${elementId}')" title="Move Up">↑</button>
                <button class="control-btn" onclick="window.FinalWorkingFix.moveDown('${elementId}')" title="Move Down">↓</button>
                <button class="control-btn" onclick="window.FinalWorkingFix.deleteElement('${elementId}')" title="Delete">🗑️</button>
            </div>
            <div class="element-content" contenteditable="true">${content}</div>
        `;
        
        // Add auto-save
        const contentDiv = element.querySelector('.element-content');
        contentDiv.addEventListener('input', () => {
            this.autoSave();
        });
        
        container.appendChild(element);
    }

    // Display alternative content
    displayAlternativeContent(content) {
        const canvas = this.findCanvas();
        if (!canvas) return;
        
        canvas.innerHTML = `
            <div class="content-editor">
                <div class="editor-header">
                    <h3>📄 Page Content (Generated)</h3>
                    <button onclick="window.FinalWorkingFix.saveContent()" class="save-btn">💾 Save</button>
                </div>
                <div class="editor-content">
                    <div class="editable-element">
                        <div class="element-content" contenteditable="true">${content}</div>
                    </div>
                </div>
            </div>
        `;
    }

    // Show empty page editor
    showEmptyPageEditor() {
        const canvas = this.findCanvas();
        if (!canvas) return;
        
        canvas.innerHTML = `
            <div class="content-editor">
                <div class="editor-header">
                    <h3>📄 Empty Page Editor</h3>
                    <button onclick="window.FinalWorkingFix.saveContent()" class="save-btn">💾 Save</button>
                </div>
                <div class="editor-content">
                    <div class="editable-element">
                        <div class="element-content" contenteditable="true" placeholder="Start typing here...">
                            <p>Click here to start writing your page content...</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Find canvas
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
                console.log(`✅ Found canvas: ${selector}`);
                return element;
            }
        }
        
        console.log('❌ No canvas found');
        return null;
    }

    // Show error
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
                <button onclick="window.FinalWorkingFix.retry()" style="
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

    // Show message
    showMessage(message, type = 'info') {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 12px 20px;
            border-radius: 6px;
            color: white;
            z-index: 10000;
            background: ${type === 'error' ? '#ef4444' : type === 'success' ? '#10b981' : '#3b82f6'};
        `;
        
        document.body.appendChild(messageDiv);
        setTimeout(() => messageDiv.remove(), 3000);
    }

    // Element management
    moveUp(elementId) {
        const element = document.getElementById(elementId);
        const prev = element.previousElementSibling;
        if (prev && prev.classList.contains('editable-element')) {
            element.parentNode.insertBefore(element, prev);
            this.autoSave();
        }
    }

    moveDown(elementId) {
        const element = document.getElementById(elementId);
        const next = element.nextElementSibling;
        if (next && next.classList.contains('editable-element')) {
            element.parentNode.insertBefore(next, element);
            this.autoSave();
        }
    }

    deleteElement(elementId) {
        if (confirm('Delete this element?')) {
            document.getElementById(elementId).remove();
            this.autoSave();
        }
    }

    addElement() {
        const editorContent = document.getElementById('editor-content');
        if (editorContent) {
            this.addEditableElement(editorContent, 'text', '<p>New element - click to edit</p>', Date.now());
        }
    }

    // Auto-save
    autoSave() {
        clearTimeout(this.autoSaveTimeout);
        this.autoSaveTimeout = setTimeout(() => {
            this.saveContent();
        }, 3000);
    }

    // Save content
    async saveContent() {
        const params = this.getUrlParams();
        if (!params.page || !params.shop) {
            this.showMessage('No page ID to save', 'error');
            return;
        }

        try {
            const elements = document.querySelectorAll('.editable-element .element-content');
            let htmlContent = '';
            
            elements.forEach(element => {
                htmlContent += element.innerHTML + '\n';
            });
            
            if (!htmlContent.trim()) {
                this.showMessage('No content to save', 'error');
                return;
            }
            
            console.log('💾 Saving content...');
            
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
                console.log('✅ Content saved');
                this.showMessage('Content saved successfully!', 'success');
            } else {
                throw new Error(`Save failed: ${response.status}`);
            }
            
        } catch (error) {
            console.error('❌ Save failed:', error);
            this.showMessage(`Save failed: ${error.message}`, 'error');
        }
    }

    // Retry loading
    async retry() {
        console.log('🔄 Retrying...');
        const canvas = this.findCanvas();
        if (canvas) {
            canvas.innerHTML = `
                <div style="text-align: center; padding: 60px 20px;">
                    <div style="font-size: 32px; animation: spin 1s linear infinite;">⟳</div>
                    <p>Retrying...</p>
                </div>
                <style>@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }</style>
            `;
        }
        await this.loadPageContent();
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
        }, 1000);
    }

    // Initialize
    async initialize() {
        console.log('🚀 Initializing FINAL WORKING FIX...');
        
        // Fix icons immediately
        this.fixIcons();
        
        if (!this.isBuilder) {
            console.log('ℹ️ Not on builder page');
            return;
        }
        
        if (this.isLoaded) {
            console.log('ℹ️ Already loaded');
            return;
        }
        
        // Fix sidebar tabs
        this.fixSidebarTabs();
        
        // Load content after delay
        setTimeout(async () => {
            try {
                await this.loadPageContent();
                this.isLoaded = true;
            } catch (error) {
                console.error('❌ Initialization failed:', error);
            }
        }, 2000);
        
        console.log('✅ FINAL WORKING FIX initialized');
    }
}

// Create instance
const finalWorkingFix = new FinalWorkingFix();

// Export for global access
window.FinalWorkingFix = {
    initialize: () => finalWorkingFix.initialize(),
    loadContent: () => finalWorkingFix.loadPageContent(),
    retry: () => finalWorkingFix.retry(),
    saveContent: () => finalWorkingFix.saveContent(),
    addElement: () => finalWorkingFix.addElement(),
    moveUp: (id) => finalWorkingFix.moveUp(id),
    moveDown: (id) => finalWorkingFix.moveDown(id),
    deleteElement: (id) => finalWorkingFix.deleteElement(id)
};

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        finalWorkingFix.initialize();
    });
} else {
    finalWorkingFix.initialize();
}

console.log('✅ FINAL WORKING FIX loaded');