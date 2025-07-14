// Grid Container - Modern CSS Grid Layout System
// Part of KingsBuilder Phase 1.2: Modern Container System

class GridContainer {
    constructor() {
        this.type = 'grid-container';
        this.title = 'Grid Container';
        this.icon = 'eicon-container-grid';
        this.category = 'layout';
    }
    
    // Get default settings for grid container
    getDefaultSettings() {
        return {
            container_type: 'grid',
            grid_template_columns: 'repeat(auto-fit, minmax(250px, 1fr))',
            grid_template_rows: 'auto',
            grid_gap: {
                size: 20,
                unit: 'px'
            },
            grid_auto_flow: 'row',
            justify_items: 'stretch',
            align_items: 'stretch',
            justify_content: 'start',
            align_content: 'start',
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
                unit: 'px'
            },
            min_height: {
                size: '',
                unit: 'px'
            },
            background_type: 'classic',
            background_color: '',
            border_radius: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                unit: 'px'
            }
        };
    }
    
    // Get grid control panel
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-container-grid"></i>
                    Grid Settings
                </div>
                
                <!-- Grid Template Columns -->
                <div class="elementor-control elementor-control-type-text">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Grid Template Columns</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="text" name="grid_template_columns" 
                                       class="elementor-control-input" 
                                       value="repeat(auto-fit, minmax(250px, 1fr))"
                                       placeholder="e.g., 1fr 1fr 1fr">
                            </div>
                            <div class="elementor-control-description">
                                Use CSS Grid syntax: 1fr 2fr, repeat(3, 1fr), minmax(200px, 1fr)
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Grid Template Rows -->
                <div class="elementor-control elementor-control-type-text">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Grid Template Rows</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="text" name="grid_template_rows" 
                                       class="elementor-control-input" 
                                       value="auto"
                                       placeholder="e.g., auto 200px auto">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Quick Grid Presets -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Quick Presets</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices grid-presets">
                                    <button type="button" data-preset="1fr" title="1 Column">
                                        <i class="eicon-column"></i>
                                    </button>
                                    <button type="button" data-preset="1fr 1fr" title="2 Columns">
                                        <i class="eicon-columns"></i>
                                    </button>
                                    <button type="button" data-preset="1fr 1fr 1fr" title="3 Columns">
                                        <i class="eicon-columns"></i>
                                    </button>
                                    <button type="button" data-preset="1fr 1fr 1fr 1fr" title="4 Columns">
                                        <i class="eicon-columns"></i>
                                    </button>
                                    <button type="button" data-preset="repeat(auto-fit, minmax(250px, 1fr))" title="Auto Fit">
                                        <i class="eicon-frame-expand"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Grid Gap -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Grid Gap</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="grid_gap" min="0" max="100" value="20" class="elementor-slider-input">
                                    <span class="elementor-slider-value">20px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Grid Auto Flow -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Auto Flow</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="grid_auto_flow" class="elementor-control-input">
                                    <option value="row">Row</option>
                                    <option value="column">Column</option>
                                    <option value="row dense">Row Dense</option>
                                    <option value="column dense">Column Dense</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Justify Items -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Justify Items</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="justify_items" value="start" id="justify_items_start">
                                    <label for="justify_items_start" title="Start">
                                        <i class="eicon-flex-align-left"></i>
                                    </label>
                                    
                                    <input type="radio" name="justify_items" value="center" id="justify_items_center">
                                    <label for="justify_items_center" title="Center">
                                        <i class="eicon-flex-align-center"></i>
                                    </label>
                                    
                                    <input type="radio" name="justify_items" value="end" id="justify_items_end">
                                    <label for="justify_items_end" title="End">
                                        <i class="eicon-flex-align-right"></i>
                                    </label>
                                    
                                    <input type="radio" name="justify_items" value="stretch" id="justify_items_stretch" checked>
                                    <label for="justify_items_stretch" title="Stretch">
                                        <i class="eicon-flex-align-stretch"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Align Items -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Align Items</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="align_items" value="start" id="align_items_start">
                                    <label for="align_items_start" title="Start">
                                        <i class="eicon-flex-align-top"></i>
                                    </label>
                                    
                                    <input type="radio" name="align_items" value="center" id="align_items_center">
                                    <label for="align_items_center" title="Center">
                                        <i class="eicon-flex-align-middle"></i>
                                    </label>
                                    
                                    <input type="radio" name="align_items" value="end" id="align_items_end">
                                    <label for="align_items_end" title="End">
                                        <i class="eicon-flex-align-bottom"></i>
                                    </label>
                                    
                                    <input type="radio" name="align_items" value="stretch" id="align_items_stretch" checked>
                                    <label for="align_items_stretch" title="Stretch">
                                        <i class="eicon-flex-align-stretch"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Generate CSS for grid container
    generateCSS(settings, elementId) {
        const gap = settings.grid_gap?.size || 20;
        const minHeight = settings.min_height?.size || 0;
        
        return `
            .elementor-element.elementor-element-${elementId} {
                display: grid;
                grid-template-columns: ${settings.grid_template_columns || 'repeat(auto-fit, minmax(250px, 1fr))'};
                grid-template-rows: ${settings.grid_template_rows || 'auto'};
                grid-gap: ${gap}px;
                grid-auto-flow: ${settings.grid_auto_flow || 'row'};
                justify-items: ${settings.justify_items || 'stretch'};
                align-items: ${settings.align_items || 'stretch'};
                justify-content: ${settings.justify_content || 'start'};
                align-content: ${settings.align_content || 'start'};
                min-height: ${minHeight}px;
                padding: ${settings.padding?.top || 20}px ${settings.padding?.right || 20}px ${settings.padding?.bottom || 20}px ${settings.padding?.left || 20}px;
                background-color: ${settings.background_color || 'transparent'};
                border-radius: ${settings.border_radius?.top || 0}px ${settings.border_radius?.right || 0}px ${settings.border_radius?.bottom || 0}px ${settings.border_radius?.left || 0}px;
            }
            
            .elementor-element.elementor-element-${elementId} > .elementor-container {
                display: contents;
            }
            
            .elementor-element.elementor-element-${elementId} > .elementor-container > .elementor-element {
                /* Grid items can have individual placement */
            }
            
            /* Responsive adjustments */
            @media (max-width: 1024px) {
                .elementor-element.elementor-element-${elementId} {
                    grid-template-columns: 1fr;
                }
            }
            
            @media (max-width: 768px) {
                .elementor-element.elementor-element-${elementId} {
                    grid-template-columns: 1fr;
                    grid-gap: ${Math.max(gap - 10, 10)}px;
                }
            }
        `;
    }
    
    // Render the grid container
    render(elementData) {
        const settings = elementData.settings || this.getDefaultSettings();
        
        return `
            <div class="elementor-element elementor-element-${elementData.id} elementor-container-grid" 
                 data-id="${elementData.id}" 
                 data-element_type="container"
                 data-container-type="grid">
                
                <!-- Element Overlay -->
                <div class="elementor-element-overlay">
                    <div class="elementor-editor-element-settings">
                        <div class="elementor-editor-element-edit" title="Edit Grid Container">
                            <i class="eicon-edit"></i>
                        </div>
                        Grid Container
                        <div class="elementor-editor-element-duplicate" title="Duplicate">
                            <i class="eicon-clone"></i>
                        </div>
                        <div class="elementor-editor-element-remove" title="Delete">
                            <i class="eicon-close"></i>
                        </div>
                    </div>
                </div>
                
                <!-- Container Content -->
                <div class="elementor-container">
                    ${elementData.children ? elementData.children.map(child => this.renderChild(child)).join('') : ''}
                </div>
                
                <!-- Drop Zone for Empty Container -->
                ${!elementData.children || elementData.children.length === 0 ? `
                    <div class="elementor-empty-view">
                        <div class="elementor-empty-view-icon">
                            <i class="eicon-container-grid"></i>
                        </div>
                        <div class="elementor-empty-view-title">
                            Drag widgets into grid
                        </div>
                        <div class="elementor-empty-view-description">
                            Elements will automatically arrange in grid layout
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    }
    
    // Render child elements
    renderChild(childData) {
        // This will be handled by the main builder
        return `<div class="elementor-element-placeholder" data-child-id="${childData.id}"></div>`;
    }
    
    // Handle grid-specific interactions
    initInteractions(element, elementData) {
        // Add preset button handlers
        const presetButtons = element.querySelectorAll('[data-preset]');
        presetButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const preset = e.target.closest('[data-preset]').getAttribute('data-preset');
                const columnsInput = element.querySelector('input[name="grid_template_columns"]');
                if (columnsInput) {
                    columnsInput.value = preset;
                    // Trigger change event to update grid
                    columnsInput.dispatchEvent(new Event('change'));
                }
            });
        });
        
        // Enable drop on grid container
        const container = element.querySelector('.elementor-container');
        
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            container.classList.add('grid-drop-active');
        });
        
        container.addEventListener('dragleave', (e) => {
            if (!container.contains(e.relatedTarget)) {
                container.classList.remove('grid-drop-active');
            }
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('grid-drop-active');
            
            const elementType = e.dataTransfer.getData('text/plain');
            if (elementType) {
                this.addElementToGrid(elementType, elementData.id);
            }
        });
    }
    
    // Add element to grid container
    addElementToGrid(elementType, containerId) {
        // This will be implemented in the main builder
        console.log('Adding element to grid:', elementType, containerId);
    }
}

// Export for use in main builder
window.GridContainer = GridContainer;