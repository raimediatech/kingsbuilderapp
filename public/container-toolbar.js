/**
 * KingsBuilder Container Toolbar
 * =====================================================
 * Provides UI controls for container and column management
 */

class ContainerToolbar {
    constructor() {
        this.initialized = false;
        this.containerSystem = null;
        
        console.log('🔧 Container Toolbar initialized');
    }

    async init(containerSystem) {
        if (this.initialized) return;
        
        this.containerSystem = containerSystem;
        this.createToolbar();
        this.bindEvents();
        
        this.initialized = true;
        console.log('✅ Container Toolbar ready');
    }

    /**
     * Create the container toolbar UI
     */
    createToolbar() {
        const leftPanel = document.querySelector('.kb-left-panel');
        if (!leftPanel) return;

        // Create container section
        const containerSection = document.createElement('div');
        containerSection.className = 'kb-panel-section kb-container-section';
        containerSection.innerHTML = `
            <div class="kb-section-header">
                <h3><i class="fas fa-layer-group"></i> Layout</h3>
            </div>
            <div class="kb-section-content">
                <!-- Container Types -->
                <div class="kb-container-types">
                    <h4>Containers</h4>
                    <div class="kb-container-type-grid">
                        <div class="kb-container-type" data-type="flex" draggable="true">
                            <div class="kb-container-icon">
                                <i class="fas fa-square"></i>
                            </div>
                            <span>Flex Container</span>
                        </div>
                        <div class="kb-container-type" data-type="grid" draggable="true">
                            <div class="kb-container-icon">
                                <i class="fas fa-th-large"></i>
                            </div>
                            <span>Grid Container</span>
                        </div>
                    </div>
                </div>

                <!-- Column Presets -->
                <div class="kb-column-presets-section">
                    <h4>Column Layouts</h4>
                    <div class="kb-column-presets-grid">
                        <div class="kb-column-preset" data-preset="1" title="1 Column">
                            <div class="kb-preset-visual">
                                <div class="kb-preset-bar" style="width: 100%"></div>
                            </div>
                            <span>1</span>
                        </div>
                        <div class="kb-column-preset" data-preset="2" title="2 Columns (50/50)">
                            <div class="kb-preset-visual">
                                <div class="kb-preset-bar" style="width: 48%"></div>
                                <div class="kb-preset-bar" style="width: 48%"></div>
                            </div>
                            <span>1/2</span>
                        </div>
                        <div class="kb-column-preset" data-preset="2-1" title="2 Columns (33/67)">
                            <div class="kb-preset-visual">
                                <div class="kb-preset-bar" style="width: 32%"></div>
                                <div class="kb-preset-bar" style="width: 64%"></div>
                            </div>
                            <span>1/3 + 2/3</span>
                        </div>
                        <div class="kb-column-preset" data-preset="1-2" title="2 Columns (67/33)">
                            <div class="kb-preset-visual">
                                <div class="kb-preset-bar" style="width: 64%"></div>
                                <div class="kb-preset-bar" style="width: 32%"></div>
                            </div>
                            <span>2/3 + 1/3</span>
                        </div>
                        <div class="kb-column-preset" data-preset="3" title="3 Columns">
                            <div class="kb-preset-visual">
                                <div class="kb-preset-bar" style="width: 31%"></div>
                                <div class="kb-preset-bar" style="width: 31%"></div>
                                <div class="kb-preset-bar" style="width: 31%"></div>
                            </div>
                            <span>1/3</span>
                        </div>
                        <div class="kb-column-preset" data-preset="4" title="4 Columns">
                            <div class="kb-preset-visual">
                                <div class="kb-preset-bar" style="width: 22%"></div>
                                <div class="kb-preset-bar" style="width: 22%"></div>
                                <div class="kb-preset-bar" style="width: 22%"></div>
                                <div class="kb-preset-bar" style="width: 22%"></div>
                            </div>
                            <span>1/4</span>
                        </div>
                        <div class="kb-column-preset" data-preset="1-2-1" title="3 Columns (25/50/25)">
                            <div class="kb-preset-visual">
                                <div class="kb-preset-bar" style="width: 22%"></div>
                                <div class="kb-preset-bar" style="width: 48%"></div>
                                <div class="kb-preset-bar" style="width: 22%"></div>
                            </div>
                            <span>1/4 + 1/2 + 1/4</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="kb-container-actions">
                    <h4>Quick Actions</h4>
                    <div class="kb-action-buttons">
                        <button class="kb-action-btn" data-action="add-container">
                            <i class="fas fa-plus"></i> Add Container
                        </button>
                        <button class="kb-action-btn" data-action="add-section">
                            <i class="fas fa-layer-group"></i> Add Section
                        </button>
                    </div>
                </div>
            </div>
        `;

        // Insert at the beginning of the left panel
        const firstSection = leftPanel.querySelector('.kb-panel-section');
        if (firstSection) {
            leftPanel.insertBefore(containerSection, firstSection);
        } else {
            leftPanel.appendChild(containerSection);
        }

        // Add styles
        this.addToolbarStyles();
    }

    /**
     * Bind toolbar events
     */
    bindEvents() {
        const toolbar = document.querySelector('.kb-container-section');
        if (!toolbar) return;

        // Container type drag start
        toolbar.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('kb-container-type')) {
                const containerType = e.target.dataset.type;
                e.dataTransfer.setData('text/plain', `container-${containerType}`);
                e.dataTransfer.effectAllowed = 'copy';
            }
        });

        // Column preset clicks
        toolbar.addEventListener('click', (e) => {
            if (e.target.closest('.kb-column-preset')) {
                const preset = e.target.closest('.kb-column-preset').dataset.preset;
                this.handleColumnPresetClick(preset);
            }

            if (e.target.closest('.kb-action-btn')) {
                const action = e.target.closest('.kb-action-btn').dataset.action;
                this.handleActionClick(action);
            }
        });
    }

    /**
     * Handle column preset click
     */
    handleColumnPresetClick(preset) {
        const selectedContainer = document.querySelector('.kb-container.kb-selected');
        
        if (selectedContainer) {
            // Apply preset to selected container
            this.containerSystem.createColumnStructure(selectedContainer, preset);
            window.kingsBuilder?.showNotification(`Applied ${preset} column layout`, 'success');
        } else {
            // Create new container with preset
            const canvas = document.getElementById('kb-canvas');
            const container = this.containerSystem.createContainer('flex');
            this.containerSystem.createColumnStructure(container, preset);
            canvas.appendChild(container);
            window.kingsBuilder?.showNotification(`Created container with ${preset} columns`, 'success');
        }

        // Save state
        window.kingsBuilder?.historyManager?.saveState();
    }

    /**
     * Handle action button clicks
     */
    handleActionClick(action) {
        const canvas = document.getElementById('kb-canvas');
        
        switch (action) {
            case 'add-container':
                const container = this.containerSystem.createContainer('flex');
                const column = this.containerSystem.createColumn();
                container.appendChild(column);
                canvas.appendChild(container);
                // Add empty state to the new column
                this.containerSystem.updateEmptyState(column);
                window.kingsBuilder?.showNotification('Container added', 'success');
                break;
                
            case 'add-section':
                const section = this.containerSystem.createContainer('flex');
                this.containerSystem.createColumnStructure(section, '1');
                canvas.appendChild(section);
                // Add empty states to all columns in the section
                section.querySelectorAll('.kb-column').forEach(col => {
                    this.containerSystem.updateEmptyState(col);
                });
                window.kingsBuilder?.showNotification('Section added', 'success');
                break;
        }

        // Save state
        window.kingsBuilder?.historyManager?.saveState();
    }

    /**
     * Add toolbar-specific styles
     */
    addToolbarStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .kb-container-section {
                border-bottom: 1px solid #e0e0e0;
                margin-bottom: 20px;
            }

            .kb-container-section h4 {
                font-size: 13px;
                font-weight: 600;
                color: #333;
                margin: 15px 0 10px 0;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }

            .kb-container-type-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 10px;
                margin-bottom: 20px;
            }

            .kb-container-type {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 15px 10px;
                background: #f8f9fa;
                border: 2px solid #e9ecef;
                border-radius: 8px;
                cursor: grab;
                transition: all 0.3s ease;
                text-align: center;
            }

            .kb-container-type:hover {
                border-color: #007cba;
                background: #f0f8ff;
                transform: translateY(-2px);
            }

            .kb-container-type:active {
                cursor: grabbing;
            }

            .kb-container-icon {
                font-size: 24px;
                color: #007cba;
                margin-bottom: 8px;
            }

            .kb-container-type span {
                font-size: 12px;
                font-weight: 500;
                color: #333;
            }

            .kb-column-presets-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 8px;
                margin-bottom: 20px;
            }

            .kb-column-preset {
                display: flex;
                flex-direction: column;
                align-items: center;
                padding: 12px 8px;
                background: white;
                border: 1px solid #ddd;
                border-radius: 6px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .kb-column-preset:hover {
                border-color: #007cba;
                background: #f0f8ff;
                transform: translateY(-1px);
            }

            .kb-preset-visual {
                display: flex;
                gap: 2px;
                width: 100%;
                height: 12px;
                margin-bottom: 6px;
            }

            .kb-preset-bar {
                background: #007cba;
                border-radius: 2px;
                opacity: 0.7;
            }

            .kb-column-preset span {
                font-size: 10px;
                color: #666;
                font-weight: 500;
            }

            .kb-action-buttons {
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .kb-action-btn {
                display: flex;
                align-items: center;
                gap: 8px;
                padding: 10px 15px;
                background: #007cba;
                color: white;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .kb-action-btn:hover {
                background: #005a87;
                transform: translateY(-1px);
            }

            .kb-action-btn i {
                font-size: 14px;
            }
        `;
        document.head.appendChild(style);
    }

    /**
     * Update toolbar state based on selection
     */
    updateToolbarState(selectedElement) {
        const presets = document.querySelectorAll('.kb-column-preset');
        presets.forEach(preset => preset.classList.remove('active'));

        if (selectedElement && selectedElement.classList.contains('kb-container')) {
            const columns = selectedElement.querySelectorAll('.kb-column');
            const columnCount = columns.length;

            // Highlight matching preset
            let matchingPreset = null;
            if (columnCount === 1) matchingPreset = '1';
            else if (columnCount === 2) matchingPreset = '2';
            else if (columnCount === 3) matchingPreset = '3';
            else if (columnCount === 4) matchingPreset = '4';

            if (matchingPreset) {
                const preset = document.querySelector(`[data-preset="${matchingPreset}"]`);
                if (preset) preset.classList.add('active');
            }
        }
    }

    /**
     * Show container context menu
     */
    showContainerContextMenu(container, x, y) {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'kb-container-context-menu';
        contextMenu.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 180px;
        `;

        const containerInfo = this.containerSystem.getContainerInfo(container);
        
        contextMenu.innerHTML = `
            <div class="kb-context-menu-header">
                <strong>${containerInfo.type.toUpperCase()} Container</strong>
                <small>${containerInfo.columnCount} columns, ${containerInfo.widgetCount} widgets</small>
            </div>
            <div class="kb-context-menu-item" data-action="edit">
                <i class="fas fa-edit"></i> Edit Container
            </div>
            <div class="kb-context-menu-item" data-action="duplicate">
                <i class="fas fa-copy"></i> Duplicate
            </div>
            <div class="kb-context-menu-item" data-action="convert">
                <i class="fas fa-exchange-alt"></i> Convert to ${containerInfo.type === 'flex' ? 'Grid' : 'Flex'}
            </div>
            <div class="kb-context-menu-divider"></div>
            <div class="kb-context-menu-item" data-action="delete" style="color: #dc3545;">
                <i class="fas fa-trash"></i> Delete Container
            </div>
        `;

        document.body.appendChild(contextMenu);

        // Handle menu clicks
        contextMenu.addEventListener('click', (e) => {
            const action = e.target.closest('.kb-context-menu-item')?.dataset.action;
            if (action) {
                this.handleContainerContextAction(container, action);
                contextMenu.remove();
            }
        });

        // Remove menu on outside click
        setTimeout(() => {
            document.addEventListener('click', () => contextMenu.remove(), { once: true });
        }, 100);
    }

    /**
     * Handle container context menu actions
     */
    handleContainerContextAction(container, action) {
        switch (action) {
            case 'edit':
                window.kingsBuilder?.selectElement(container);
                break;
                
            case 'duplicate':
                const clone = this.containerSystem.cloneContainer(container);
                container.parentNode.insertBefore(clone, container.nextSibling);
                window.kingsBuilder?.showNotification('Container duplicated', 'success');
                break;
                
            case 'convert':
                const currentType = container.dataset.containerType;
                const newType = currentType === 'flex' ? 'grid' : 'flex';
                this.containerSystem.convertContainerType(container, newType);
                window.kingsBuilder?.showNotification(`Container converted to ${newType}`, 'success');
                break;
                
            case 'delete':
                if (confirm('Delete this container and all its contents?')) {
                    container.remove();
                    window.kingsBuilder?.showNotification('Container deleted', 'success');
                }
                break;
        }

        // Save state
        window.kingsBuilder?.historyManager?.saveState();
    }
}

// Export for global use
window.ContainerToolbar = ContainerToolbar;