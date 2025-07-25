/**
 * KingsBuilder Panel Manager
 * =====================================================
 * Manages the left panel, tabs, and panel interactions
 */

class PanelManager {
    constructor() {
        this.currentTab = 'elements';
        this.initialized = false;
        
        console.log('📋 Panel Manager initialized');
    }

    async init() {
        if (this.initialized) return;
        
        this.bindEvents();
        this.initialized = true;
        
        console.log('✅ Panel Manager ready');
    }

    /**
     * Bind panel events
     */
    bindEvents() {
        // Panel tab switching
        document.addEventListener('click', (e) => {
            const tab = e.target.closest('.kb-panel-tab');
            if (tab) {
                this.switchTab(tab.dataset.tab);
            }
        });

        // Settings tab switching
        document.addEventListener('click', (e) => {
            const settingsTab = e.target.closest('.kb-settings-tab');
            if (settingsTab) {
                this.switchSettingsTab(settingsTab.dataset.tab);
            }
        });

        // Panel resize handle
        this.setupPanelResize();
    }

    /**
     * Switch main panel tab
     */
    switchTab(tabName) {
        if (this.currentTab === tabName) return;
        
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.kb-panel-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Update tab content
        document.querySelectorAll('.kb-tab-content').forEach(content => {
            content.classList.toggle('active', content.dataset.tab === tabName);
        });
        
        // Trigger tab change event
        window.kingsBuilder?.trigger('panel:tab-changed', { tab: tabName });
        
        console.log(`📋 Switched to ${tabName} tab`);
    }

    /**
     * Switch settings tab
     */
    switchSettingsTab(tabName) {
        // Update settings tab buttons
        document.querySelectorAll('.kb-settings-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });
        
        // Update settings content
        const settingsContent = document.getElementById('kb-settings-content');
        if (settingsContent && window.kingsBuilder?.selectedElement) {
            window.kingsBuilder.controlsManager.renderSettingsTab(tabName);
        }
        
        console.log(`⚙️ Switched to ${tabName} settings tab`);
    }

    /**
     * Setup panel resizing
     */
    setupPanelResize() {
        const panel = document.getElementById('kb-panel');
        if (!panel) return;

        let isResizing = false;
        let startX = 0;
        let startWidth = 0;

        // Create resize handle
        const resizeHandle = document.createElement('div');
        resizeHandle.className = 'kb-panel-resize-handle';
        resizeHandle.style.cssText = `
            position: absolute;
            top: 0;
            right: -3px;
            width: 6px;
            height: 100%;
            cursor: ew-resize;
            background: transparent;
            z-index: 1000;
        `;

        panel.appendChild(resizeHandle);

        // Mouse events for resizing
        resizeHandle.addEventListener('mousedown', (e) => {
            isResizing = true;
            startX = e.clientX;
            startWidth = parseInt(document.defaultView.getComputedStyle(panel).width, 10);
            
            document.body.style.cursor = 'ew-resize';
            document.body.style.userSelect = 'none';
            
            e.preventDefault();
        });

        document.addEventListener('mousemove', (e) => {
            if (!isResizing) return;
            
            const width = startWidth + e.clientX - startX;
            const minWidth = 250;
            const maxWidth = 500;
            
            if (width >= minWidth && width <= maxWidth) {
                panel.style.width = width + 'px';
                
                // Update canvas margin
                const canvasArea = document.getElementById('kb-canvas-area');
                if (canvasArea) {
                    canvasArea.style.marginLeft = width + 'px';
                }
            }
        });

        document.addEventListener('mouseup', () => {
            if (isResizing) {
                isResizing = false;
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
            }
        });
    }

    /**
     * Show panel
     */
    show() {
        const panel = document.getElementById('kb-panel');
        if (panel) {
            panel.style.display = 'block';
        }
    }

    /**
     * Hide panel
     */
    hide() {
        const panel = document.getElementById('kb-panel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    /**
     * Toggle panel visibility
     */
    toggle() {
        const panel = document.getElementById('kb-panel');
        if (panel) {
            const isVisible = panel.style.display !== 'none';
            if (isVisible) {
                this.hide();
            } else {
                this.show();
            }
        }
    }

    /**
     * Update navigator with current canvas state
     */
    updateNavigator() {
        if (window.kingsBuilder?.canvasManager) {
            window.kingsBuilder.canvasManager.updateNavigator();
        }
    }

    /**
     * Show element settings
     */
    showElementSettings(element) {
        // Switch to settings tab
        this.switchTab('settings');
        
        // Update settings title
        const settingsTitle = document.getElementById('kb-settings-title');
        if (settingsTitle && element._kbWidget) {
            settingsTitle.textContent = `Edit ${element._kbWidget.getTitle()}`;
        }
        
        // Load element controls
        if (window.kingsBuilder?.controlsManager) {
            window.kingsBuilder.controlsManager.loadElementSettings(element);
        }
    }

    /**
     * Hide element settings
     */
    hideElementSettings() {
        const settingsTitle = document.getElementById('kb-settings-title');
        if (settingsTitle) {
            settingsTitle.textContent = 'Select an element';
        }
        
        const settingsContent = document.getElementById('kb-settings-content');
        if (settingsContent) {
            settingsContent.innerHTML = `
                <div class="kb-no-selection">
                    <i class="fas fa-mouse-pointer"></i>
                    <p>Select an element to edit its properties</p>
                </div>
            `;
        }
    }

    /**
     * Add custom panel content
     */
    addCustomTab(tabName, tabTitle, tabIcon, content) {
        // Add tab button
        const tabsContainer = document.querySelector('.kb-panel-tabs');
        if (tabsContainer) {
            const tabButton = document.createElement('button');
            tabButton.className = 'kb-panel-tab';
            tabButton.dataset.tab = tabName;
            tabButton.innerHTML = `
                <i class="${tabIcon}"></i>
                <span>${tabTitle}</span>
            `;
            tabsContainer.appendChild(tabButton);
        }
        
        // Add tab content
        const contentContainer = document.querySelector('.kb-panel-content');
        if (contentContainer) {
            const tabContent = document.createElement('div');
            tabContent.className = 'kb-tab-content';
            tabContent.dataset.tab = tabName;
            tabContent.innerHTML = content;
            contentContainer.appendChild(tabContent);
        }
        
        console.log(`📋 Added custom tab: ${tabName}`);
    }

    /**
     * Remove custom tab
     */
    removeCustomTab(tabName) {
        // Remove tab button
        const tabButton = document.querySelector(`.kb-panel-tab[data-tab="${tabName}"]`);
        if (tabButton) {
            tabButton.remove();
        }
        
        // Remove tab content
        const tabContent = document.querySelector(`.kb-tab-content[data-tab="${tabName}"]`);
        if (tabContent) {
            tabContent.remove();
        }
        
        // Switch to elements tab if current tab was removed
        if (this.currentTab === tabName) {
            this.switchTab('elements');
        }
        
        console.log(`📋 Removed custom tab: ${tabName}`);
    }

    /**
     * Get current tab
     */
    getCurrentTab() {
        return this.currentTab;
    }

    /**
     * Set panel width
     */
    setPanelWidth(width) {
        const panel = document.getElementById('kb-panel');
        const canvasArea = document.getElementById('kb-canvas-area');
        
        if (panel && canvasArea) {
            panel.style.width = width + 'px';
            canvasArea.style.marginLeft = width + 'px';
        }
    }

    /**
     * Get panel width
     */
    getPanelWidth() {
        const panel = document.getElementById('kb-panel');
        if (panel) {
            return parseInt(document.defaultView.getComputedStyle(panel).width, 10);
        }
        return 300; // default width
    }

    /**
     * Collapse panel
     */
    collapse() {
        const panel = document.getElementById('kb-panel');
        const canvasArea = document.getElementById('kb-canvas-area');
        
        if (panel && canvasArea) {
            panel.classList.add('kb-panel-collapsed');
            panel.style.width = '60px';
            canvasArea.style.marginLeft = '60px';
            
            // Hide panel content
            const panelContent = panel.querySelector('.kb-panel-content');
            if (panelContent) {
                panelContent.style.display = 'none';
            }
            
            // Show collapse indicator
            const collapseBtn = panel.querySelector('.kb-panel-collapse-btn');
            if (collapseBtn) {
                collapseBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            }
        }
    }

    /**
     * Expand panel
     */
    expand() {
        const panel = document.getElementById('kb-panel');
        const canvasArea = document.getElementById('kb-canvas-area');
        
        if (panel && canvasArea) {
            panel.classList.remove('kb-panel-collapsed');
            panel.style.width = '300px';
            canvasArea.style.marginLeft = '300px';
            
            // Show panel content
            const panelContent = panel.querySelector('.kb-panel-content');
            if (panelContent) {
                panelContent.style.display = 'block';
            }
            
            // Update collapse indicator
            const collapseBtn = panel.querySelector('.kb-panel-collapse-btn');
            if (collapseBtn) {
                collapseBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            }
        }
    }

    /**
     * Toggle panel collapse
     */
    toggleCollapse() {
        const panel = document.getElementById('kb-panel');
        if (panel && panel.classList.contains('kb-panel-collapsed')) {
            this.expand();
        } else {
            this.collapse();
        }
    }
}

// Export for global use
window.PanelManager = PanelManager;