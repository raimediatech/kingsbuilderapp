/**
 * KingsBuilder Container System
 * =====================================================
 * Implements Elementor-style container and column system
 * Auto-creates containers when widgets are dropped
 */

console.log('🚀 Loading container-system.js...');

class ContainerSystem {
    constructor() {
        this.initialized = false;
        this.containerTypes = {
            FLEX: 'flex',
            GRID: 'grid'
        };
        
        console.log('📦 Container System initialized');
    }

    async init() {
        if (this.initialized) return;
        
        // Initialize container widgets if not already done
        if (typeof BaseWidget !== 'undefined' && !ContainerWidget) {
            initializeContainerWidgets();
        }
        
        this.initialized = true;
        console.log('✅ Container System ready');
    }

    /**
     * Generate unique ID
     */
    generateId() {
        return 'kb-' + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Create a new container element
     */
    createContainer(type = this.containerTypes.FLEX, settings = {}) {
        const container = document.createElement('div');
        container.className = 'kb-container';
        container.dataset.kbType = 'container';
        container.dataset.containerType = type;
        container.dataset.id = this.generateId();
        container.id = container.dataset.id;
        
        // Add container-specific classes
        container.classList.add(`kb-container-${type}`);
        
        // Set default settings
        const defaultSettings = this.getDefaultContainerSettings(type);
        const finalSettings = { ...defaultSettings, ...settings };
        
        // Apply settings to container
        this.applyContainerSettings(container, finalSettings);
        
        // Store settings
        container._kbSettings = finalSettings;
        
        // Add widget reference if available
        if (window.ContainerWidget) {
            container._kbWidget = new window.ContainerWidget(type);
        }
        
        // Add container toolbar
        this.addContainerToolbar(container);
        
        // Don't add empty state immediately - will be added when needed
        
        return container;
    }

    /**
     * Add toolbar to container
     */
    addContainerToolbar(container) {
        const toolbar = document.createElement('div');
        toolbar.className = 'kb-container-toolbar';
        
        toolbar.innerHTML = `
            <button class="kb-container-toolbar-btn" data-action="direction" data-value="row" title="Horizontal Layout">
                <i class="fas fa-arrows-alt-h"></i>
            </button>
            <button class="kb-container-toolbar-btn" data-action="direction" data-value="column" title="Vertical Layout">
                <i class="fas fa-arrows-alt-v"></i>
            </button>
            <div class="kb-container-toolbar-separator"></div>
            <button class="kb-container-toolbar-btn" data-action="justify" data-value="flex-start" title="Align Left">
                <i class="fas fa-align-left"></i>
            </button>
            <button class="kb-container-toolbar-btn" data-action="justify" data-value="center" title="Align Center">
                <i class="fas fa-align-center"></i>
            </button>
            <button class="kb-container-toolbar-btn" data-action="justify" data-value="flex-end" title="Align Right">
                <i class="fas fa-align-right"></i>
            </button>
            <div class="kb-container-toolbar-separator"></div>
            <button class="kb-container-toolbar-btn" data-action="gap" data-value="10" title="Add Gap">
                <i class="fas fa-expand-arrows-alt"></i>
            </button>
        `;
        
        // Add event listeners
        toolbar.addEventListener('click', (e) => {
            console.log('🔧 Toolbar clicked:', e.target);
            let button = e.target;
            
            // If clicked on icon, get the parent button
            if (button.tagName === 'I') {
                button = button.parentElement;
            }
            
            console.log('🔧 Button element:', button, 'Has class:', button.classList.contains('kb-container-toolbar-btn'));
            
            if (button.classList.contains('kb-container-toolbar-btn')) {
                console.log('🔧 Toolbar button clicked:', button.dataset.action, button.dataset.value);
                this.handleToolbarAction(container, button);
            }
        });
        
        // Set default active states
        const horizontalBtn = toolbar.querySelector('[data-action="direction"][data-value="row"]');
        const leftAlignBtn = toolbar.querySelector('[data-action="justify"][data-value="flex-start"]');
        
        if (horizontalBtn) horizontalBtn.classList.add('active');
        if (leftAlignBtn) leftAlignBtn.classList.add('active');
        
        container.appendChild(toolbar);
        console.log('🔧 Toolbar created and added to container:', toolbar);
    }

    /**
     * Handle toolbar button actions
     */
    handleToolbarAction(container, button) {
        const action = button.dataset.action;
        const value = button.dataset.value;
        
        console.log(`🔧 Handling toolbar action: ${action} = ${value}`);
        
        // Ensure container has flex display
        if (!container.style.display || container.style.display !== 'flex') {
            container.style.display = 'flex';
            console.log('📦 Set container display to flex');
        }
        
        // Remove active class from siblings
        const siblings = button.parentElement.querySelectorAll(`[data-action="${action}"]`);
        siblings.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Apply the action
        switch (action) {
            case 'direction':
                container.style.flexDirection = value;
                container.dataset.direction = value;
                console.log(`📦 Container flex-direction set to: ${value}`);
                break;
            case 'justify':
                container.style.justifyContent = value;
                container.dataset.justify = value;
                console.log(`📦 Container justify-content set to: ${value}`);
                break;
            case 'gap':
                container.style.gap = value + 'px';
                container.dataset.gap = value;
                console.log(`📦 Container gap set to: ${value}px`);
                break;
            default:
                console.warn(`⚠️ Unknown toolbar action: ${action}`);
        }
        
        // Log final container styles
        console.log('📦 Final container styles:', {
            display: container.style.display,
            flexDirection: container.style.flexDirection,
            justifyContent: container.style.justifyContent,
            gap: container.style.gap
        });
    }

    /**
     * Create a new column element
     */
    createColumn(width = '100%', settings = {}) {
        const column = document.createElement('div');
        column.className = 'kb-column';
        column.dataset.kbType = 'column';
        column.dataset.id = this.generateId();
        column.id = column.dataset.id;
        
        // Set default settings
        const defaultSettings = this.getDefaultColumnSettings();
        const finalSettings = { ...defaultSettings, width, ...settings };
        
        // Apply settings to column
        this.applyColumnSettings(column, finalSettings);
        
        // Store settings
        column._kbSettings = finalSettings;
        
        // Add widget reference if available
        if (ColumnWidget) {
            column._kbWidget = new ColumnWidget();
        }
        
        // Don't add empty state immediately - will be added when needed
        
        return column;
    }

    /**
     * Get default container settings
     */
    getDefaultContainerSettings(type) {
        const baseSettings = {
            direction: type === this.containerTypes.FLEX ? 'row' : 'column',
            justify_content: 'flex-start',
            align_items: 'stretch',
            gap: '20',
            padding: '20',
            margin: '0',
            background_color: 'transparent',
            border_radius: '0',
            min_height: 'auto'
        };

        if (type === this.containerTypes.GRID) {
            return {
                ...baseSettings,
                grid_columns: '1fr',
                grid_rows: 'auto',
                grid_gap: '20'
            };
        }

        return baseSettings;
    }

    /**
     * Get default column settings
     */
    getDefaultColumnSettings() {
        return {
            width: '100%',
            padding: '15',
            margin: '0',
            background_color: 'transparent',
            border_radius: '0',
            align_self: 'stretch'
        };
    }

    /**
     * Apply container settings
     */
    applyContainerSettings(container, settings) {
        const styles = [];
        
        // Always apply display type based on container type
        if (container.dataset.containerType === this.containerTypes.FLEX) {
            styles.push(`display: flex`);
            styles.push(`flex-direction: ${settings.direction || 'row'}`);
            styles.push(`justify-content: ${settings.justify_content || 'flex-start'}`);
            styles.push(`align-items: ${settings.align_items || 'stretch'}`);
            styles.push(`gap: ${settings.gap || 20}px`);
            
            const direction = settings.direction || 'row';
            if (direction.includes('row')) {
                styles.push(`flex-wrap: wrap`);
            }
        } else if (container.dataset.containerType === this.containerTypes.GRID) {
            styles.push(`display: grid`);
            styles.push(`grid-template-columns: ${settings.grid_columns || '1fr'}`);
            styles.push(`grid-template-rows: ${settings.grid_rows || 'auto'}`);
            styles.push(`gap: ${settings.grid_gap || settings.gap || 20}px`);
        }
        
        // Common styles
        if (settings.padding) {
            styles.push(`padding: ${settings.padding}px`);
        }
        if (settings.margin) {
            styles.push(`margin: ${settings.margin}px`);
        }
        if (settings.background_color && settings.background_color !== 'transparent') {
            styles.push(`background-color: ${settings.background_color}`);
        }
        if (settings.border_radius) {
            styles.push(`border-radius: ${settings.border_radius}px`);
        }
        if (settings.min_height && settings.min_height !== 'auto') {
            styles.push(`min-height: ${settings.min_height}px`);
        }
        
        // Apply styles
        container.style.cssText = styles.join('; ');
        
        console.log('🎨 Applied container styles:', styles.join('; '));
        
        // Add responsive classes
        container.classList.add('kb-responsive-element');
    }

    /**
     * Apply column settings
     */
    applyColumnSettings(column, settings) {
        const styles = [];
        
        // Width
        if (settings.width) {
            styles.push(`width: ${settings.width}`);
            if (settings.width.includes('%')) {
                styles.push(`flex: 0 0 ${settings.width}`);
            }
        }
        
        // Common styles
        if (settings.padding) {
            styles.push(`padding: ${settings.padding}px`);
        }
        if (settings.margin) {
            styles.push(`margin: ${settings.margin}px`);
        }
        if (settings.background_color && settings.background_color !== 'transparent') {
            styles.push(`background-color: ${settings.background_color}`);
        }
        if (settings.border_radius) {
            styles.push(`border-radius: ${settings.border_radius}px`);
        }
        if (settings.align_self) {
            styles.push(`align-self: ${settings.align_self}`);
        }
        
        // Apply styles
        column.style.cssText = styles.join('; ');
        
        console.log('🎨 Applied column styles:', styles.join('; '));
        
        // Add responsive classes
        column.classList.add('kb-responsive-element');
    }

    /**
     * Update empty state for container/column
     */
    updateEmptyState(element) {
        const existingEmptyState = element.querySelector('.kb-empty-state');
        const hasContent = Array.from(element.children).some(child => 
            (child.classList.contains('kb-element') || child.classList.contains('kb-widget')) && 
            !child.classList.contains('kb-empty-state')
        );
        
        if (hasContent && existingEmptyState) {
            // Remove empty state if content exists
            console.log('🗑️ Removing empty state - content found');
            existingEmptyState.remove();
        } else if (!hasContent && !existingEmptyState) {
            // Add empty state if no content
            console.log('➕ Adding empty state - no content found');
            const emptyState = document.createElement('div');
            emptyState.className = 'kb-empty-state';
            emptyState.innerHTML = `
                <div class="kb-empty-content">
                    <i class="fas fa-plus-circle"></i>
                    <p>Drop widgets here</p>
                </div>
            `;
            element.appendChild(emptyState);
        }
    }

    /**
     * Add empty state to container/column (deprecated - use updateEmptyState)
     */
    addEmptyState(element) {
        this.updateEmptyState(element);
    }

    /**
     * Auto-create container when widget is dropped on canvas
     */
    autoCreateContainer(widget, dropTarget, position) {
        console.log('🎯 Auto-creating container for widget:', widget, 'on target:', dropTarget.className);
        
        // If dropping on canvas root, create container
        if (dropTarget.classList.contains('kb-canvas')) {
            console.log('📦 Creating new container on canvas');
            try {
                const container = this.createContainer();
                const column = this.createColumn();
                
                if (!container || !column) {
                    console.error('❌ Failed to create container or column');
                    return null;
                }
                
                // Add column to container
                container.appendChild(column);
                
                // Add widget to column
                column.appendChild(widget);
                
                // Insert container at position
                if (position && position.nextSibling) {
                    dropTarget.insertBefore(container, position.nextSibling);
                } else {
                    dropTarget.appendChild(container);
                }
                
                // Update empty states
                this.updateEmptyState(column);
                this.updateEmptyState(container);
                
                console.log('✅ Container created successfully');
                return container;
            } catch (error) {
                console.error('❌ Error creating container:', error);
                return null;
            }
        }
        
        // If dropping on container, add to appropriate column
        if (dropTarget.classList.contains('kb-container')) {
            let targetColumn = this.findBestColumn(dropTarget, position);
            
            if (!targetColumn) {
                // Create new column if none exists
                targetColumn = this.createColumn();
                dropTarget.appendChild(targetColumn);
            }
            
            // Add widget to column
            if (position.nextSibling) {
                targetColumn.insertBefore(widget, position.nextSibling);
            } else {
                targetColumn.appendChild(widget);
            }
            
            // Update empty state
            this.updateEmptyState(targetColumn);
            
            return targetColumn;
        }
        
        // If dropping on column, add directly
        if (dropTarget.classList.contains('kb-column')) {
            if (position.nextSibling) {
                dropTarget.insertBefore(widget, position.nextSibling);
            } else {
                dropTarget.appendChild(widget);
            }
            
            // Update empty state
            this.updateEmptyState(dropTarget);
            
            return dropTarget;
        }
        
        return null;
    }

    /**
     * Find the best column to drop widget into
     */
    findBestColumn(container, position) {
        const columns = container.querySelectorAll('.kb-column');
        
        if (columns.length === 0) {
            return null;
        }
        
        // For now, return the first column
        // In a more advanced implementation, we could calculate
        // the best column based on mouse position
        return columns[0];
    }

    /**
     * Remove empty state from element (deprecated - use updateEmptyState)
     */
    removeEmptyState(element) {
        this.updateEmptyState(element);
    }

    /**
     * Create column structure (like Elementor's section presets)
     */
    createColumnStructure(container, preset) {
        // Clear existing columns
        const existingColumns = container.querySelectorAll('.kb-column');
        existingColumns.forEach(col => col.remove());
        
        // Column presets
        const presets = {
            '1': ['100%'],
            '2': ['50%', '50%'],
            '2-1': ['33.33%', '66.67%'],
            '1-2': ['66.67%', '33.33%'],
            '3': ['33.33%', '33.33%', '33.33%'],
            '4': ['25%', '25%', '25%', '25%'],
            '1-1-1-1': ['25%', '25%', '25%', '25%'],
            '1-2-1': ['25%', '50%', '25%']
        };
        
        const widths = presets[preset] || presets['1'];
        
        // Create columns
        widths.forEach(width => {
            const column = this.createColumn(width);
            container.appendChild(column);
        });
        
        return container;
    }

    /**
     * Handle container resizing
     */
    handleContainerResize(container, newSettings) {
        // Update settings
        container._kbSettings = { ...container._kbSettings, ...newSettings };
        
        // Re-apply settings
        this.applyContainerSettings(container, container._kbSettings);
        
        // Trigger update event
        window.kingsBuilder?.trigger('container:resized', { container, settings: container._kbSettings });
    }

    /**
     * Handle column resizing
     */
    handleColumnResize(column, newWidth) {
        // Update settings
        column._kbSettings = { ...column._kbSettings, width: newWidth };
        
        // Re-apply settings
        this.applyColumnSettings(column, column._kbSettings);
        
        // Trigger update event
        window.kingsBuilder?.trigger('column:resized', { column, width: newWidth });
    }

    /**
     * Get container structure info
     */
    getContainerInfo(container) {
        const columns = container.querySelectorAll('.kb-column');
        const widgets = container.querySelectorAll('.kb-element:not(.kb-container):not(.kb-column)');
        
        return {
            type: container.dataset.containerType,
            columnCount: columns.length,
            widgetCount: widgets.length,
            settings: container._kbSettings || {}
        };
    }

    /**
     * Clone container with all its contents
     */
    cloneContainer(container) {
        const clone = container.cloneNode(true);
        
        // Re-initialize empty states and observers
        const columns = clone.querySelectorAll('.kb-column');
        columns.forEach(column => {
            const emptyState = column.querySelector('.kb-empty-state');
            if (emptyState) {
                this.addEmptyState(column);
                emptyState.remove();
            }
        });
        
        return clone;
    }

    /**
     * Convert container type (flex to grid or vice versa)
     */
    convertContainerType(container, newType) {
        const oldType = container.dataset.containerType;
        
        if (oldType === newType) return;
        
        // Update dataset
        container.dataset.containerType = newType;
        
        // Update classes
        container.classList.remove(`kb-container-${oldType}`);
        container.classList.add(`kb-container-${newType}`);
        
        // Update settings
        const newSettings = this.getDefaultContainerSettings(newType);
        container._kbSettings = { ...container._kbSettings, ...newSettings };
        
        // Re-apply settings
        this.applyContainerSettings(container, container._kbSettings);
        
        console.log(`📦 Container converted from ${oldType} to ${newType}`);
    }
}

// Widget classes will be defined after BaseWidget is available
window.ContainerWidget = null;
window.ColumnWidget = null;

function initializeContainerWidgets() {
    if (typeof BaseWidget === 'undefined') {
        console.warn('BaseWidget not available, container widgets will be created later');
        return;
    }

    /**
     * Container Widget Class
     */
    window.ContainerWidget = class extends BaseWidget {
        constructor(containerType = 'flex') {
            super();
            this.title = 'Container';
            this.icon = 'fas fa-square';
            this.category = 'layout';
            this.keywords = ['container', 'layout', 'flex', 'grid'];
            this.containerType = containerType;
        }

        getDefaultSettings() {
            return window.kingsBuilder?.containerSystem?.getDefaultContainerSettings(this.containerType) || {};
        }

        getControls() {
            const baseControls = [
                {
                    name: 'layout',
                    label: 'Layout',
                    tab: 'content',
                    controls: [
                        {
                            name: 'container_type',
                            label: 'Container Type',
                            type: 'select',
                            options: {
                                'flex': 'Flexbox',
                                'grid': 'CSS Grid'
                            },
                            default: this.containerType
                        },
                        {
                            name: 'direction',
                            label: 'Direction',
                            type: 'choose',
                            options: {
                                'row': { title: 'Row', icon: 'fas fa-arrows-alt-h' },
                                'column': { title: 'Column', icon: 'fas fa-arrows-alt-v' },
                                'row-reverse': { title: 'Row Reverse', icon: 'fas fa-exchange-alt' },
                                'column-reverse': { title: 'Column Reverse', icon: 'fas fa-exchange-alt' }
                            },
                            default: 'row',
                            condition: {
                                container_type: 'flex'
                            }
                        },
                        {
                            name: 'justify_content',
                            label: 'Justify Content',
                            type: 'select',
                            options: {
                                'flex-start': 'Start',
                                'center': 'Center',
                                'flex-end': 'End',
                                'space-between': 'Space Between',
                                'space-around': 'Space Around',
                                'space-evenly': 'Space Evenly'
                            },
                            default: 'flex-start',
                            condition: {
                                container_type: 'flex'
                            }
                        },
                        {
                            name: 'align_items',
                            label: 'Align Items',
                            type: 'select',
                            options: {
                                'stretch': 'Stretch',
                                'flex-start': 'Start',
                                'center': 'Center',
                                'flex-end': 'End',
                                'baseline': 'Baseline'
                            },
                            default: 'stretch',
                            condition: {
                                container_type: 'flex'
                            }
                        },
                        {
                            name: 'gap',
                            label: 'Gap (px)',
                            type: 'slider',
                            range: { min: 0, max: 100 },
                            default: 20
                        }
                    ]
                }
            ];

            // Add grid-specific controls
            if (this.containerType === 'grid') {
                baseControls[0].controls.push(
                    {
                        name: 'grid_columns',
                        label: 'Grid Columns',
                        type: 'text',
                        default: '1fr',
                        condition: {
                            container_type: 'grid'
                        }
                    },
                    {
                        name: 'grid_rows',
                        label: 'Grid Rows',
                        type: 'text',
                        default: 'auto',
                        condition: {
                            container_type: 'grid'
                        }
                    }
                );
            }

            // Add style controls
            baseControls.push({
                name: 'style',
                label: 'Style',
                tab: 'style',
                controls: [
                    {
                        name: 'background_color',
                        label: 'Background Color',
                        type: 'color',
                        default: 'transparent'
                    },
                    {
                        name: 'padding',
                        label: 'Padding (px)',
                        type: 'slider',
                        range: { min: 0, max: 100 },
                        default: 20
                    },
                    {
                        name: 'margin',
                        label: 'Margin (px)',
                        type: 'slider',
                        range: { min: 0, max: 100 },
                        default: 0
                    },
                    {
                        name: 'border_radius',
                        label: 'Border Radius (px)',
                        type: 'slider',
                        range: { min: 0, max: 50 },
                        default: 0
                    },
                    {
                        name: 'min_height',
                        label: 'Min Height (px)',
                        type: 'text',
                        default: 'auto'
                    }
                ]
            });

            return baseControls;
        }

        render(settings = {}) {
            // Containers are rendered by the container system
            return '';
        }
    };

    /**
     * Column Widget Class
     */
    window.ColumnWidget = class extends BaseWidget {
        constructor() {
            super();
            this.title = 'Column';
            this.icon = 'fas fa-columns';
            this.category = 'layout';
            this.keywords = ['column', 'layout'];
        }

        getDefaultSettings() {
            return window.kingsBuilder?.containerSystem?.getDefaultColumnSettings() || {};
        }

        getControls() {
            return [
                {
                    name: 'layout',
                    label: 'Layout',
                    tab: 'content',
                    controls: [
                        {
                            name: 'width',
                            label: 'Width',
                            type: 'text',
                            default: '100%'
                        },
                        {
                            name: 'align_self',
                            label: 'Align Self',
                            type: 'select',
                            options: {
                                'auto': 'Auto',
                                'stretch': 'Stretch',
                                'flex-start': 'Start',
                                'center': 'Center',
                                'flex-end': 'End',
                                'baseline': 'Baseline'
                            },
                            default: 'stretch'
                        }
                    ]
                },
                {
                    name: 'style',
                    label: 'Style',
                    tab: 'style',
                    controls: [
                        {
                            name: 'background_color',
                            label: 'Background Color',
                            type: 'color',
                            default: 'transparent'
                        },
                        {
                            name: 'padding',
                            label: 'Padding (px)',
                            type: 'slider',
                            range: { min: 0, max: 100 },
                            default: 15
                        },
                        {
                            name: 'margin',
                            label: 'Margin (px)',
                            type: 'slider',
                            range: { min: 0, max: 100 },
                            default: 0
                        },
                        {
                            name: 'border_radius',
                            label: 'Border Radius (px)',
                            type: 'slider',
                            range: { min: 0, max: 50 },
                            default: 0
                        }
                    ]
                }
            ];
        }

        render(settings = {}) {
            // Columns are rendered by the container system
            return '';
        }
    };

    console.log('📦 Container widget classes initialized');
}

// Try to initialize immediately, or wait for BaseWidget
if (typeof BaseWidget !== 'undefined') {
    initializeContainerWidgets();
} else {
    // Wait for BaseWidget to be available
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initializeContainerWidgets, 100);
    });
}

// Export for global use
try {
    window.ContainerSystem = ContainerSystem;
    console.log('✅ ContainerSystem exported successfully');
} catch (error) {
    console.error('❌ Failed to export ContainerSystem:', error);
}

// Export widget classes (will be null initially until BaseWidget is available)
window.ContainerWidget = ContainerWidget;
window.ColumnWidget = ColumnWidget;

// Also export the initialization function
window.initializeContainerWidgets = initializeContainerWidgets;