/**
 * KingsBuilder Container Controls
 * =====================================================
 * Provides hover controls for containers and columns
 */

class ContainerControls {
    constructor() {
        this.initialized = false;
        this.activeControls = null;
        this.containerSystem = null;
        
        console.log('🎛️ Container Controls initialized');
    }

    async init(containerSystem) {
        if (this.initialized) return;
        
        this.containerSystem = containerSystem;
        this.bindEvents();
        this.addControlStyles();
        
        this.initialized = true;
        console.log('✅ Container Controls ready');
    }

    /**
     * Bind container control events
     */
    bindEvents() {
        const canvas = document.getElementById('kb-canvas');
        if (!canvas) return;

        // Container hover events
        canvas.addEventListener('mouseover', (e) => {
            const container = e.target.closest('.kb-container');
            const column = e.target.closest('.kb-column');
            
            if (container && !column) {
                this.showContainerControls(container, e);
            } else if (column) {
                this.showColumnControls(column, e);
            }
        });

        // Global event delegation for control buttons (backup)
        canvas.addEventListener('click', (e) => {
            const controlBtn = e.target.closest('.kb-control-btn');
            if (controlBtn) {
                e.stopPropagation();
                console.log('🎛️ Global control button clicked:', controlBtn);
                
                const action = controlBtn.dataset.action;
                const container = controlBtn.closest('.kb-container-controls')?.parentElement?.closest('.kb-container');
                const column = controlBtn.closest('.kb-column-controls')?.parentElement?.closest('.kb-column');
                
                console.log('🎛️ Action:', action, 'Container:', container, 'Column:', column);
                
                if (action && container) {
                    this.handleContainerAction(container, action);
                } else if (action && column) {
                    this.handleColumnAction(column, action);
                }
            }
        });

        canvas.addEventListener('mouseout', (e) => {
            const container = e.target.closest('.kb-container');
            const column = e.target.closest('.kb-column');
            
            if (container || column) {
                // Only hide if not moving to a child element
                if (!e.relatedTarget || (!container?.contains(e.relatedTarget) && !column?.contains(e.relatedTarget))) {
                    this.hideControls();
                }
            }
        });

        // Right-click context menu
        canvas.addEventListener('contextmenu', (e) => {
            const container = e.target.closest('.kb-container');
            const column = e.target.closest('.kb-column');
            
            if (container && !column) {
                e.preventDefault();
                this.showContainerContextMenu(container, e.clientX, e.clientY);
            } else if (column) {
                e.preventDefault();
                this.showColumnContextMenu(column, e.clientX, e.clientY);
            }
        });
    }

    /**
     * Show container controls
     */
    showContainerControls(container, e) {
        this.hideControls();

        const controls = document.createElement('div');
        controls.className = 'kb-container-controls';
        
        const containerInfo = this.containerSystem.getContainerInfo(container);
        
        controls.innerHTML = `
            <div class="kb-control-group">
                <button class="kb-control-btn" data-action="edit" title="Edit Container">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="kb-control-btn" data-action="add-column" title="Add Column">
                    <i class="fas fa-plus"></i>
                </button>
                <button class="kb-control-btn" data-action="duplicate" title="Duplicate">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="kb-control-btn" data-action="move-up" title="Move Up">
                    <i class="fas fa-arrow-up"></i>
                </button>
                <button class="kb-control-btn" data-action="move-down" title="Move Down">
                    <i class="fas fa-arrow-down"></i>
                </button>
                <button class="kb-control-btn kb-control-danger" data-action="delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="kb-control-info">
                <span>${containerInfo.type.toUpperCase()} • ${containerInfo.columnCount} cols</span>
            </div>
        `;

        container.appendChild(controls);
        this.activeControls = controls;

        // Bind control actions
        controls.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log('🎛️ Control clicked:', e.target);
            console.log('🎛️ Event target classes:', e.target.className);
            console.log('🎛️ Event target tagName:', e.target.tagName);
            
            let button = e.target;
            
            // If clicked on icon, get the parent button
            if (button.tagName === 'I') {
                button = button.parentElement;
                console.log('🎛️ Clicked on icon, using parent button:', button);
            }
            
            // Find the closest button
            if (!button.classList.contains('kb-control-btn')) {
                button = button.closest('.kb-control-btn');
            }
            
            console.log('🎛️ Final button found:', button);
            console.log('🎛️ Button dataset:', button?.dataset);
            
            const action = button?.dataset.action;
            console.log('🎛️ Action:', action);
            
            if (action && button) {
                console.log('🎛️ Executing action:', action, 'on container:', container);
                this.handleContainerAction(container, action);
            } else {
                console.warn('🚨 No action found or button not found');
            }
        });
    }

    /**
     * Show column controls
     */
    showColumnControls(column, e) {
        this.hideControls();

        const controls = document.createElement('div');
        controls.className = 'kb-column-controls';
        
        const columnWidth = column._kbSettings?.width || '100%';
        
        controls.innerHTML = `
            <div class="kb-control-group">
                <button class="kb-control-btn" data-action="edit" title="Edit Column">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="kb-control-btn" data-action="resize" title="Resize">
                    <i class="fas fa-expand-arrows-alt"></i>
                </button>
                <button class="kb-control-btn" data-action="duplicate" title="Duplicate">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="kb-control-btn kb-control-danger" data-action="delete" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
            <div class="kb-control-info">
                <span>Column • ${columnWidth}</span>
            </div>
        `;

        column.appendChild(controls);
        this.activeControls = controls;

        // Bind control actions
        controls.addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.target.closest('.kb-control-btn')?.dataset.action;
            if (action) {
                this.handleColumnAction(column, action);
            }
        });
    }

    /**
     * Hide all controls
     */
    hideControls() {
        if (this.activeControls) {
            this.activeControls.remove();
            this.activeControls = null;
        }
    }

    /**
     * Handle container actions
     */
    handleContainerAction(container, action) {
        console.log('🎛️ Handling container action:', action, 'for container:', container);
        
        try {
            switch (action) {
                case 'edit':
                    console.log('🎛️ Selecting element for editing');
                    if (window.kingsBuilder && window.kingsBuilder.selectElement) {
                        window.kingsBuilder.selectElement(container);
                        console.log('✅ Element selected');
                    } else {
                        console.error('🚨 kingsBuilder.selectElement not available');
                    }
                    break;
                    
                case 'add-column':
                    console.log('🎛️ Adding column');
                    if (this.containerSystem && this.containerSystem.createColumn) {
                        const newColumn = this.containerSystem.createColumn();
                        container.appendChild(newColumn);
                        console.log('✅ Column added');
                        window.kingsBuilder?.showNotification?.('Column added', 'success');
                    } else {
                        console.error('🚨 containerSystem.createColumn not available');
                    }
                    break;
                    
                case 'duplicate':
                    console.log('🎛️ Duplicating container');
                    if (this.containerSystem && this.containerSystem.cloneContainer) {
                        const clone = this.containerSystem.cloneContainer(container);
                        container.parentNode.insertBefore(clone, container.nextSibling);
                        console.log('✅ Container duplicated');
                        window.kingsBuilder?.showNotification?.('Container duplicated', 'success');
                    } else {
                        console.error('🚨 containerSystem.cloneContainer not available');
                    }
                    break;
                    
                case 'move-up':
                    console.log('🎛️ Moving container up');
                    if (container.previousElementSibling) {
                        container.parentNode.insertBefore(container, container.previousElementSibling);
                        console.log('✅ Container moved up');
                        window.kingsBuilder?.showNotification?.('Container moved up', 'success');
                    } else {
                        console.log('⚠️ No previous sibling to move up');
                    }
                    break;
                    
                case 'move-down':
                    console.log('🎛️ Moving container down');
                    if (container.nextElementSibling) {
                        container.parentNode.insertBefore(container.nextElementSibling, container);
                        console.log('✅ Container moved down');
                        window.kingsBuilder?.showNotification?.('Container moved down', 'success');
                    } else {
                        console.log('⚠️ No next sibling to move down');
                    }
                    break;
                    
                case 'delete':
                    console.log('🎛️ Deleting container');
                    if (confirm('Delete this container and all its contents?')) {
                        container.remove();
                        console.log('✅ Container deleted');
                        window.kingsBuilder?.showNotification?.('Container deleted', 'success');
                    }
                    break;
                    
                default:
                    console.warn('🚨 Unknown action:', action);
            }
        } catch (error) {
            console.error('🚨 Error handling container action:', error);
        }

        // Save state
        window.kingsBuilder?.historyManager?.saveState();
        this.hideControls();
    }

    /**
     * Handle column actions
     */
    handleColumnAction(column, action) {
        switch (action) {
            case 'edit':
                window.kingsBuilder?.selectElement(column);
                break;
                
            case 'resize':
                this.showColumnResizer(column);
                break;
                
            case 'duplicate':
                const clone = column.cloneNode(true);
                column.parentNode.insertBefore(clone, column.nextSibling);
                window.kingsBuilder?.showNotification('Column duplicated', 'success');
                break;
                
            case 'delete':
                const container = column.closest('.kb-container');
                const columns = container.querySelectorAll('.kb-column');
                
                if (columns.length > 1) {
                    if (confirm('Delete this column and all its contents?')) {
                        column.remove();
                        window.kingsBuilder?.showNotification('Column deleted', 'success');
                    }
                } else {
                    window.kingsBuilder?.showNotification('Cannot delete the last column', 'error');
                }
                break;
        }

        // Save state
        window.kingsBuilder?.historyManager?.saveState();
        this.hideControls();
    }

    /**
     * Show column resizer
     */
    showColumnResizer(column) {
        const resizer = document.createElement('div');
        resizer.className = 'kb-column-resizer';
        
        const currentWidth = column._kbSettings?.width || '100%';
        
        resizer.innerHTML = `
            <div class="kb-resizer-content">
                <h4>Resize Column</h4>
                <div class="kb-resizer-presets">
                    <button class="kb-preset-btn" data-width="25%">25%</button>
                    <button class="kb-preset-btn" data-width="33.33%">33%</button>
                    <button class="kb-preset-btn" data-width="50%">50%</button>
                    <button class="kb-preset-btn" data-width="66.67%">67%</button>
                    <button class="kb-preset-btn" data-width="75%">75%</button>
                    <button class="kb-preset-btn" data-width="100%">100%</button>
                </div>
                <div class="kb-resizer-custom">
                    <label>Custom Width:</label>
                    <input type="text" class="kb-width-input" value="${currentWidth}" placeholder="e.g., 300px, 50%, auto">
                </div>
                <div class="kb-resizer-actions">
                    <button class="kb-btn kb-btn-primary" data-action="apply">Apply</button>
                    <button class="kb-btn kb-btn-secondary" data-action="cancel">Cancel</button>
                </div>
            </div>
        `;

        document.body.appendChild(resizer);

        // Position resizer
        const rect = column.getBoundingClientRect();
        resizer.style.cssText = `
            position: fixed;
            top: ${rect.top + rect.height / 2 - 100}px;
            left: ${rect.left + rect.width / 2 - 150}px;
            z-index: 10000;
        `;

        // Handle resizer actions
        resizer.addEventListener('click', (e) => {
            const action = e.target.dataset.action;
            const width = e.target.dataset.width;
            
            if (width) {
                resizer.querySelector('.kb-width-input').value = width;
            } else if (action === 'apply') {
                const newWidth = resizer.querySelector('.kb-width-input').value;
                this.containerSystem.handleColumnResize(column, newWidth);
                window.kingsBuilder?.showNotification(`Column resized to ${newWidth}`, 'success');
                resizer.remove();
            } else if (action === 'cancel') {
                resizer.remove();
            }
        });

        // Close on outside click
        setTimeout(() => {
            document.addEventListener('click', (e) => {
                if (!resizer.contains(e.target)) {
                    resizer.remove();
                }
            }, { once: true });
        }, 100);
    }

    /**
     * Show container context menu
     */
    showContainerContextMenu(container, x, y) {
        window.kingsBuilder?.containerToolbar?.showContainerContextMenu(container, x, y);
    }

    /**
     * Show column context menu
     */
    showColumnContextMenu(column, x, y) {
        const contextMenu = document.createElement('div');
        contextMenu.className = 'kb-context-menu';
        contextMenu.style.cssText = `
            position: fixed;
            top: ${y}px;
            left: ${x}px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            min-width: 160px;
        `;

        const columnWidth = column._kbSettings?.width || '100%';
        
        contextMenu.innerHTML = `
            <div class="kb-context-menu-header">
                <strong>Column</strong>
                <small>Width: ${columnWidth}</small>
            </div>
            <div class="kb-context-menu-item" data-action="edit">
                <i class="fas fa-edit"></i> Edit Column
            </div>
            <div class="kb-context-menu-item" data-action="resize">
                <i class="fas fa-expand-arrows-alt"></i> Resize
            </div>
            <div class="kb-context-menu-item" data-action="duplicate">
                <i class="fas fa-copy"></i> Duplicate
            </div>
            <div class="kb-context-menu-divider"></div>
            <div class="kb-context-menu-item" data-action="delete" style="color: #dc3545;">
                <i class="fas fa-trash"></i> Delete Column
            </div>
        `;

        document.body.appendChild(contextMenu);

        // Handle menu clicks
        contextMenu.addEventListener('click', (e) => {
            const action = e.target.closest('.kb-context-menu-item')?.dataset.action;
            if (action) {
                this.handleColumnAction(column, action);
                contextMenu.remove();
            }
        });

        // Remove menu on outside click
        setTimeout(() => {
            document.addEventListener('click', () => contextMenu.remove(), { once: true });
        }, 100);
    }

    /**
     * Add control styles
     */
    addControlStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .kb-container-controls,
            .kb-column-controls {
                position: absolute;
                top: -40px;
                left: 0;
                display: flex;
                align-items: center;
                gap: 5px;
                background: rgba(0, 124, 186, 0.95);
                padding: 5px 10px;
                border-radius: 6px;
                z-index: 1000;
                opacity: 0;
                animation: fadeInControls 0.3s ease forwards;
            }

            @keyframes fadeInControls {
                to { opacity: 1; }
            }

            .kb-control-group {
                display: flex;
                gap: 3px;
            }

            .kb-control-btn {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                color: white;
                padding: 6px 8px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                transition: all 0.3s ease;
            }

            .kb-control-btn:hover {
                background: rgba(255, 255, 255, 0.3);
                transform: scale(1.1);
            }

            .kb-control-btn.kb-control-danger:hover {
                background: #dc3545;
            }

            .kb-control-info {
                margin-left: 10px;
                padding-left: 10px;
                border-left: 1px solid rgba(255, 255, 255, 0.3);
                font-size: 11px;
                color: rgba(255, 255, 255, 0.9);
                white-space: nowrap;
            }

            .kb-column-resizer {
                position: fixed;
                background: white;
                border: 1px solid #ddd;
                border-radius: 8px;
                box-shadow: 0 8px 24px rgba(0,0,0,0.15);
                padding: 20px;
                min-width: 300px;
            }

            .kb-resizer-content h4 {
                margin: 0 0 15px 0;
                color: #333;
                font-size: 16px;
            }

            .kb-resizer-presets {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                margin-bottom: 15px;
            }

            .kb-preset-btn {
                padding: 8px 12px;
                background: #f8f9fa;
                border: 1px solid #ddd;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                transition: all 0.3s ease;
            }

            .kb-preset-btn:hover {
                border-color: #007cba;
                background: #f0f8ff;
            }

            .kb-resizer-custom {
                margin-bottom: 15px;
            }

            .kb-resizer-custom label {
                display: block;
                margin-bottom: 5px;
                font-size: 13px;
                font-weight: 500;
                color: #333;
            }

            .kb-width-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid #ddd;
                border-radius: 4px;
                font-size: 13px;
            }

            .kb-resizer-actions {
                display: flex;
                gap: 10px;
                justify-content: flex-end;
            }

            .kb-btn {
                padding: 8px 16px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 13px;
                font-weight: 500;
                transition: all 0.3s ease;
            }

            .kb-btn-primary {
                background: #007cba;
                color: white;
            }

            .kb-btn-primary:hover {
                background: #005a87;
            }

            .kb-btn-secondary {
                background: #f8f9fa;
                color: #333;
                border: 1px solid #ddd;
            }

            .kb-btn-secondary:hover {
                background: #e9ecef;
            }

            .kb-context-menu {
                font-size: 13px;
            }

            .kb-context-menu-header {
                padding: 10px 15px;
                border-bottom: 1px solid #eee;
                background: #f8f9fa;
            }

            .kb-context-menu-header strong {
                display: block;
                color: #333;
            }

            .kb-context-menu-header small {
                color: #666;
                font-size: 11px;
            }

            .kb-context-menu-item {
                display: flex;
                align-items: center;
                gap: 10px;
                padding: 10px 15px;
                cursor: pointer;
                transition: background 0.3s ease;
            }

            .kb-context-menu-item:hover {
                background: #f8f9fa;
            }

            .kb-context-menu-item i {
                width: 16px;
                text-align: center;
            }

            .kb-context-menu-divider {
                height: 1px;
                background: #eee;
                margin: 5px 0;
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for global use
window.ContainerControls = ContainerControls;