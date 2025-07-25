/**
 * KingsBuilder Core System
 * =====================================================
 * Professional page builder based on Elementor architecture
 * Clean, maintainable, and feature-complete implementation
 * 
 * @version 2.0.0
 * @author KingsBuilder Team
 */

class KingsBuilderCore {
    constructor() {
        this.version = '2.0.0';
        this.initialized = false;
        this.currentDevice = 'desktop';
        this.selectedElement = null;
        this.clipboard = null;
        this.history = [];
        this.historyIndex = -1;
        this.maxHistoryStates = 50;
        
        // Core managers (will be initialized in init method)
        this.widgetManager = null;
        this.canvasManager = null;
        this.panelManager = null;
        this.controlsManager = null;
        this.historyManager = null;
        this.containerToolbar = null;
        this.containerControls = null;
        
        console.log(`🎯 KingsBuilder Core v${this.version} initialized`);
    }

    /**
     * Initialize the builder system
     */
    async init() {
        if (this.initialized) {
            console.warn('KingsBuilder already initialized');
            return;
        }

        try {
            // Wait for DOM to be ready
            if (document.readyState === 'loading') {
                await new Promise(resolve => {
                    document.addEventListener('DOMContentLoaded', resolve);
                });
            }

            // Clean up any existing systems
            this.cleanup();

            // Initialize core components
            await this.initializeInterface();
            await this.initializeManagers();
            await this.bindEvents();
            
            this.initialized = true;
            console.log('✅ KingsBuilder Core fully initialized');
            
            // Trigger initialization complete event
            this.trigger('core:initialized');
            
        } catch (error) {
            console.error('❌ KingsBuilder initialization failed:', error);
            throw error;
        }
    }

    /**
     * Clean up existing systems and emergency fixes
     */
    cleanup() {
        console.log('🧹 Cleaning up existing systems...');
        
        // Remove all emergency fix elements
        const emergencySelectors = [
            '#elementor-panel',
            '#elementor-widget-options', 
            '.elementor-properties-panel',
            '#final-elementor-interface',
            '#completion-indicator',
            '.completion-indicator',
            '.elementor-context-menu',
            '.elementor-right-click-menu',
            '#elementor-editor-wrapper',
            '#clean-elementor-interface',
            '.emergency-fix',
            '.temp-fix',
            '.critical-fix'
        ];

        emergencySelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(el => {
                console.log(`🗑️ Removing: ${selector}`);
                el.remove();
            });
        });

        // Clear global emergency variables
        window.finalElementorSystem = null;
        window.elementorStyleWidgetOptions = null;
        window.completeElementorSystem = null;
        window.elementorExactInterface = null;
        window.emergencyFixes = null;
        
        console.log('✅ Cleanup complete');
    }

    /**
     * Initialize the main interface
     */
    async initializeInterface() {
        console.log('🎨 Initializing interface...');
        
        // Create main wrapper
        const wrapper = document.createElement('div');
        wrapper.id = 'kingsbuilder-editor';
        wrapper.className = 'kingsbuilder-editor';
        
        wrapper.innerHTML = `
            <!-- Top Bar -->
            <div class="kb-top-bar">
                <div class="kb-top-left">
                    <div class="kb-logo">
                        <i class="fas fa-crown"></i>
                        <span>KingsBuilder</span>
                    </div>
                    <div class="kb-document-title">Edit Page</div>
                </div>
                
                <div class="kb-top-center">
                    <div class="kb-device-switcher">
                        <button class="kb-device-btn active" data-device="desktop" title="Desktop">
                            <i class="fas fa-desktop"></i>
                        </button>
                        <button class="kb-device-btn" data-device="tablet" title="Tablet">
                            <i class="fas fa-tablet-alt"></i>
                        </button>
                        <button class="kb-device-btn" data-device="mobile" title="Mobile">
                            <i class="fas fa-mobile-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="kb-top-right">
                    <button class="kb-btn kb-btn-secondary" id="kb-undo" title="Undo (Ctrl+Z)">
                        <i class="fas fa-undo"></i>
                    </button>
                    <button class="kb-btn kb-btn-secondary" id="kb-redo" title="Redo (Ctrl+Y)">
                        <i class="fas fa-redo"></i>
                    </button>
                    <button class="kb-btn kb-btn-primary" id="kb-save" title="Save (Ctrl+S)">
                        <i class="fas fa-save"></i>
                        Update
                    </button>
                    <button class="kb-btn kb-btn-secondary" id="kb-preview" title="Preview">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="kb-btn kb-btn-secondary" id="kb-exit" title="Exit">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            </div>

            <!-- Main Content -->
            <div class="kb-main-content">
                <!-- Left Panel -->
                <div class="kb-panel" id="kb-panel">
                    <div class="kb-panel-header">
                        <div class="kb-panel-tabs">
                            <button class="kb-panel-tab active" data-tab="elements">
                                <i class="fas fa-plus"></i>
                                <span>Elements</span>
                            </button>
                            <button class="kb-panel-tab" data-tab="settings">
                                <i class="fas fa-cog"></i>
                                <span>Settings</span>
                            </button>
                            <button class="kb-panel-tab" data-tab="navigator">
                                <i class="fas fa-sitemap"></i>
                                <span>Navigator</span>
                            </button>
                        </div>
                    </div>
                    
                    <div class="kb-panel-content">
                        <!-- Elements Tab -->
                        <div class="kb-tab-content active" data-tab="elements">
                            <div class="kb-search-box">
                                <input type="text" placeholder="Search widgets..." id="kb-widget-search">
                                <i class="fas fa-search"></i>
                            </div>
                            <div class="kb-widget-categories" id="kb-widget-categories">
                                <!-- Widget categories will be populated here -->
                            </div>
                        </div>
                        
                        <!-- Settings Tab -->
                        <div class="kb-tab-content" data-tab="settings">
                            <div class="kb-settings-header">
                                <h3 id="kb-settings-title">Select an element</h3>
                            </div>
                            <div class="kb-settings-tabs">
                                <button class="kb-settings-tab active" data-tab="content">
                                    <i class="fas fa-edit"></i>
                                    Content
                                </button>
                                <button class="kb-settings-tab" data-tab="style">
                                    <i class="fas fa-paint-brush"></i>
                                    Style
                                </button>
                                <button class="kb-settings-tab" data-tab="advanced">
                                    <i class="fas fa-cogs"></i>
                                    Advanced
                                </button>
                            </div>
                            <div class="kb-settings-content" id="kb-settings-content">
                                <div class="kb-no-selection">
                                    <i class="fas fa-mouse-pointer"></i>
                                    <p>Select an element to edit its properties</p>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Navigator Tab -->
                        <div class="kb-tab-content" data-tab="navigator">
                            <div class="kb-navigator-header">
                                <h3>Structure</h3>
                                <button class="kb-btn-icon" id="kb-expand-all" title="Expand All">
                                    <i class="fas fa-expand-arrows-alt"></i>
                                </button>
                            </div>
                            <div class="kb-navigator-tree" id="kb-navigator-tree">
                                <!-- Element tree will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Canvas Area -->
                <div class="kb-canvas-area" id="kb-canvas-area">
                    <div class="kb-canvas-wrapper">
                        <div class="kb-canvas" id="kb-canvas">
                            <div class="kb-canvas-empty">
                                <div class="kb-empty-icon">
                                    <i class="fas fa-plus-circle"></i>
                                </div>
                                <h3>Start Building Your Page</h3>
                                <p>Drag widgets from the left panel to begin</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Context Menu -->
            <div class="kb-context-menu" id="kb-context-menu">
                <div class="kb-context-item" data-action="edit">
                    <i class="fas fa-edit"></i>
                    Edit
                </div>
                <div class="kb-context-item" data-action="duplicate">
                    <i class="fas fa-clone"></i>
                    Duplicate
                </div>
                <div class="kb-context-item" data-action="copy">
                    <i class="fas fa-copy"></i>
                    Copy
                </div>
                <div class="kb-context-item" data-action="paste">
                    <i class="fas fa-paste"></i>
                    Paste
                </div>
                <div class="kb-context-divider"></div>
                <div class="kb-context-item" data-action="move-up">
                    <i class="fas fa-arrow-up"></i>
                    Move Up
                </div>
                <div class="kb-context-item" data-action="move-down">
                    <i class="fas fa-arrow-down"></i>
                    Move Down
                </div>
                <div class="kb-context-divider"></div>
                <div class="kb-context-item danger" data-action="delete">
                    <i class="fas fa-trash"></i>
                    Delete
                </div>
            </div>

            <!-- Element Controls -->
            <div class="kb-element-controls" id="kb-element-controls">
                <button class="kb-control-btn" data-action="edit" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="kb-control-btn" data-action="duplicate" title="Duplicate">
                    <i class="fas fa-clone"></i>
                </button>
                <button class="kb-control-btn danger" data-action="delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>

            <!-- Notifications -->
            <div class="kb-notifications" id="kb-notifications"></div>
        `;

        // Insert into DOM
        document.body.appendChild(wrapper);
        
        console.log('✅ Interface created');
    }

    /**
     * Initialize all managers
     */
    async initializeManagers() {
        console.log('🔧 Initializing managers...');
        
        // Create manager instances
        this.widgetManager = new WidgetManager();
        this.canvasManager = new CanvasManager();
        this.panelManager = new PanelManager();
        this.controlsManager = new ControlsManager();
        this.historyManager = new HistoryManager();
        this.containerToolbar = new ContainerToolbar();
        this.containerControls = new ContainerControls();
        
        // Initialize managers
        await this.widgetManager.init();
        await this.canvasManager.init();
        await this.panelManager.init();
        await this.controlsManager.init();
        await this.historyManager.init();
        
        // Initialize container toolbar after canvas manager (needs container system)
        try {
            if (this.canvasManager.containerSystem && this.canvasManager.containerSystem.initialized) {
                await this.containerToolbar.init(this.canvasManager.containerSystem);
                await this.containerControls.init(this.canvasManager.containerSystem);
            } else {
                console.warn('Container system not available, skipping container toolbar initialization');
            }
        } catch (error) {
            console.warn('Container toolbar initialization failed:', error);
        }
        
        console.log('✅ All managers initialized');
    }

    /**
     * Bind global events
     */
    bindEvents() {
        console.log('🔗 Binding events...');
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeyboard.bind(this));
        
        // Device switcher
        document.querySelectorAll('.kb-device-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchDevice(e.target.dataset.device);
            });
        });

        // Top bar actions
        document.getElementById('kb-undo')?.addEventListener('click', () => this.undo());
        document.getElementById('kb-redo')?.addEventListener('click', () => this.redo());
        document.getElementById('kb-save')?.addEventListener('click', () => this.save());
        document.getElementById('kb-preview')?.addEventListener('click', () => this.preview());
        document.getElementById('kb-exit')?.addEventListener('click', () => this.exit());

        // Panel tabs
        document.querySelectorAll('.kb-panel-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchPanelTab(e.target.dataset.tab);
            });
        });

        console.log('✅ Events bound');
    }

    /**
     * Handle keyboard shortcuts
     */
    handleKeyboard(e) {
        // Ctrl+Z - Undo
        if (e.ctrlKey && e.key === 'z' && !e.shiftKey) {
            e.preventDefault();
            this.undo();
        }
        
        // Ctrl+Y or Ctrl+Shift+Z - Redo
        if ((e.ctrlKey && e.key === 'y') || (e.ctrlKey && e.shiftKey && e.key === 'z')) {
            e.preventDefault();
            this.redo();
        }
        
        // Ctrl+S - Save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            this.save();
        }
        
        // Delete - Delete selected element
        if (e.key === 'Delete' && this.selectedElement) {
            e.preventDefault();
            this.deleteElement(this.selectedElement);
        }
        
        // Ctrl+C - Copy
        if (e.ctrlKey && e.key === 'c' && this.selectedElement) {
            e.preventDefault();
            this.copyElement(this.selectedElement);
        }
        
        // Ctrl+V - Paste
        if (e.ctrlKey && e.key === 'v' && this.clipboard) {
            e.preventDefault();
            this.pasteElement();
        }
        
        // Escape - Deselect
        if (e.key === 'Escape') {
            this.deselectElement();
        }
    }

    /**
     * Switch device preview
     */
    switchDevice(device) {
        if (this.currentDevice === device) return;
        
        this.currentDevice = device;
        
        // Update active button
        document.querySelectorAll('.kb-device-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.device === device);
        });
        
        // Update canvas
        const canvas = document.getElementById('kb-canvas');
        canvas.className = `kb-canvas kb-device-${device}`;
        
        this.trigger('device:changed', { device });
        this.showNotification(`Switched to ${device} view`, 'info');
    }

    /**
     * Switch panel tab
     */
    switchPanelTab(tab) {
        // Update active tab
        document.querySelectorAll('.kb-panel-tab').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tab);
        });
        
        // Update active content
        document.querySelectorAll('.kb-tab-content').forEach(content => {
            content.classList.toggle('active', content.dataset.tab === tab);
        });
        
        this.trigger('panel:tab-changed', { tab });
    }

    /**
     * History management
     */
    saveState() {
        const state = this.canvasManager.getState();
        this.historyManager.saveState(state);
    }

    undo() {
        const state = this.historyManager.undo();
        if (state) {
            this.canvasManager.restoreState(state);
            this.showNotification('Undone', 'success');
        }
    }

    redo() {
        const state = this.historyManager.redo();
        if (state) {
            this.canvasManager.restoreState(state);
            this.showNotification('Redone', 'success');
        }
    }

    /**
     * Top bar actions
     */
    save() {
        console.log('💾 Saving page...');
        const state = this.canvasManager.getState();
        
        // Here you would typically send the state to your backend
        localStorage.setItem('kingsbuilder_page_data', JSON.stringify(state));
        
        this.showNotification('Page saved successfully!', 'success');
        console.log('💾 Page saved to localStorage');
    }

    preview() {
        console.log('👁️ Opening preview...');
        const state = this.canvasManager.getState();
        
        // Create preview window
        const previewWindow = window.open('', '_blank', 'width=1200,height=800');
        previewWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Preview - KingsBuilder</title>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <style>
                    body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
                    .preview-header { background: #f0f0f0; padding: 10px; margin-bottom: 20px; border-radius: 4px; }
                </style>
            </head>
            <body>
                <div class="preview-header">
                    <strong>Preview Mode</strong> - This is how your page will look to visitors
                </div>
                <div id="preview-content">${state.html || '<p>No content to preview</p>'}</div>
            </body>
            </html>
        `);
        
        this.showNotification('Preview opened in new window', 'info');
    }

    exit() {
        console.log('🚪 Exiting builder...');
        
        if (confirm('Are you sure you want to exit? Any unsaved changes will be lost.')) {
            // You can redirect to your admin panel or close the window
            window.location.href = '/admin'; // Adjust this URL as needed
        }
    }

    /**
     * Element operations
     */
    selectElement(element) {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('kb-selected');
        }
        
        this.selectedElement = element;
        element.classList.add('kb-selected');
        
        // Show element controls
        this.showElementControls(element);
        
        // Switch to settings tab
        this.switchPanelTab('settings');
        
        // Load element settings
        this.controlsManager.loadElementSettings(element);
        
        this.trigger('element:selected', { element });
    }

    deselectElement() {
        if (this.selectedElement) {
            this.selectedElement.classList.remove('kb-selected');
            this.hideElementControls();
            this.selectedElement = null;
        }
        
        this.trigger('element:deselected');
    }

    deleteElement(element) {
        if (!element) return;
        
        this.saveState();
        element.remove();
        
        if (this.selectedElement === element) {
            this.deselectElement();
        }
        
        this.canvasManager.updateNavigator();
        this.showNotification('Element deleted', 'success');
        this.trigger('element:deleted', { element });
    }

    copyElement(element) {
        this.clipboard = element.cloneNode(true);
        this.showNotification('Element copied', 'success');
    }

    pasteElement() {
        if (!this.clipboard) return;
        
        this.saveState();
        const newElement = this.clipboard.cloneNode(true);
        
        // Insert after selected element or at end
        const canvas = document.getElementById('kb-canvas');
        if (this.selectedElement) {
            this.selectedElement.parentNode.insertBefore(newElement, this.selectedElement.nextSibling);
        } else {
            canvas.appendChild(newElement);
        }
        
        this.canvasManager.updateNavigator();
        this.showNotification('Element pasted', 'success');
        this.trigger('element:pasted', { element: newElement });
    }

    /**
     * Show element controls
     */
    showElementControls(element) {
        const controls = document.getElementById('kb-element-controls');
        const rect = element.getBoundingClientRect();
        
        controls.style.display = 'flex';
        controls.style.top = `${rect.top - 40}px`;
        controls.style.left = `${rect.left}px`;
    }

    hideElementControls() {
        const controls = document.getElementById('kb-element-controls');
        controls.style.display = 'none';
    }

    /**
     * Actions
     */
    save() {
        const data = this.canvasManager.getState();
        // TODO: Implement save to server
        this.showNotification('Page saved', 'success');
        this.trigger('page:saved', { data });
    }

    preview() {
        // TODO: Implement preview
        this.showNotification('Preview opened', 'info');
        this.trigger('page:preview');
    }

    exit() {
        if (confirm('Are you sure you want to exit? Any unsaved changes will be lost.')) {
            window.location.href = '/dashboard';
        }
    }

    /**
     * Show notification
     */
    showNotification(message, type = 'info') {
        const notifications = document.getElementById('kb-notifications');
        const notification = document.createElement('div');
        notification.className = `kb-notification kb-notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation-triangle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        notifications.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    /**
     * Event system
     */
    trigger(event, data = {}) {
        document.dispatchEvent(new CustomEvent(`kingsbuilder:${event}`, { detail: data }));
    }

    on(event, callback) {
        document.addEventListener(`kingsbuilder:${event}`, callback);
    }
}

// Export for global use
window.KingsBuilderCore = KingsBuilderCore;




