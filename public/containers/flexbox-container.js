// Flexbox Container - Modern Layout System
// Part of KingsBuilder Phase 1.2: Modern Container System

class FlexboxContainer {
    constructor() {
        this.type = 'flexbox-container';
        this.title = 'Flexbox Container';
        this.icon = 'eicon-flex-container';
        this.category = 'layout';
    }
    
    // Get default settings for flexbox container
    getDefaultSettings() {
        return {
            container_type: 'flex',
            flex_direction: 'row',
            flex_wrap: 'nowrap',
            justify_content: 'flex-start',
            align_items: 'stretch',
            align_content: 'stretch',
            gap: {
                size: 20,
                unit: 'px'
            },
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
    
    // Get flexbox control panel
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-flex-container"></i>
                    Flexbox Settings
                </div>
                
                <!-- Direction Control -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Direction</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="flex_direction" class="elementor-control-input">
                                    <option value="row">Row →</option>
                                    <option value="row-reverse">Row Reverse ←</option>
                                    <option value="column">Column ↓</option>
                                    <option value="column-reverse">Column Reverse ↑</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Wrap Control -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Wrap</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="flex_wrap" class="elementor-control-input">
                                    <option value="nowrap">No Wrap</option>
                                    <option value="wrap">Wrap</option>
                                    <option value="wrap-reverse">Wrap Reverse</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Justify Content Control -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Justify Content</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="justify_content" value="flex-start" id="justify_start">
                                    <label for="justify_start" title="Start">
                                        <i class="eicon-flex-align-left"></i>
                                    </label>
                                    
                                    <input type="radio" name="justify_content" value="center" id="justify_center">
                                    <label for="justify_center" title="Center">
                                        <i class="eicon-flex-align-center"></i>
                                    </label>
                                    
                                    <input type="radio" name="justify_content" value="flex-end" id="justify_end">
                                    <label for="justify_end" title="End">
                                        <i class="eicon-flex-align-right"></i>
                                    </label>
                                    
                                    <input type="radio" name="justify_content" value="space-between" id="justify_between">
                                    <label for="justify_between" title="Space Between">
                                        <i class="eicon-flex-space-between"></i>
                                    </label>
                                    
                                    <input type="radio" name="justify_content" value="space-around" id="justify_around">
                                    <label for="justify_around" title="Space Around">
                                        <i class="eicon-flex-space-around"></i>
                                    </label>
                                    
                                    <input type="radio" name="justify_content" value="space-evenly" id="justify_evenly">
                                    <label for="justify_evenly" title="Space Evenly">
                                        <i class="eicon-flex-space-evenly"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Align Items Control -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Align Items</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="align_items" value="flex-start" id="align_start">
                                    <label for="align_start" title="Start">
                                        <i class="eicon-flex-align-top"></i>
                                    </label>
                                    
                                    <input type="radio" name="align_items" value="center" id="align_center">
                                    <label for="align_center" title="Center">
                                        <i class="eicon-flex-align-middle"></i>
                                    </label>
                                    
                                    <input type="radio" name="align_items" value="flex-end" id="align_end">
                                    <label for="align_end" title="End">
                                        <i class="eicon-flex-align-bottom"></i>
                                    </label>
                                    
                                    <input type="radio" name="align_items" value="stretch" id="align_stretch" checked>
                                    <label for="align_stretch" title="Stretch">
                                        <i class="eicon-flex-align-stretch"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Gap Control -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Gap</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="gap" min="0" max="100" value="20" class="elementor-slider-input">
                                    <span class="elementor-slider-value">20px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Min Height Control -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Min Height</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="min_height" min="0" max="1000" value="0" class="elementor-slider-input">
                                    <span class="elementor-slider-value">0px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Generate CSS for flexbox container
    generateCSS(settings, elementId) {
        const gap = settings.gap?.size || 20;
        const minHeight = settings.min_height?.size || 0;
        
        return `
            .elementor-element.elementor-element-${elementId} {
                display: flex;
                flex-direction: ${settings.flex_direction || 'row'};
                flex-wrap: ${settings.flex_wrap || 'nowrap'};
                justify-content: ${settings.justify_content || 'flex-start'};
                align-items: ${settings.align_items || 'stretch'};
                align-content: ${settings.align_content || 'stretch'};
                gap: ${gap}px;
                min-height: ${minHeight}px;
                padding: ${settings.padding?.top || 20}px ${settings.padding?.right || 20}px ${settings.padding?.bottom || 20}px ${settings.padding?.left || 20}px;
                background-color: ${settings.background_color || 'transparent'};
                border-radius: ${settings.border_radius?.top || 0}px ${settings.border_radius?.right || 0}px ${settings.border_radius?.bottom || 0}px ${settings.border_radius?.left || 0}px;
            }
            
            .elementor-element.elementor-element-${elementId} > .elementor-container {
                display: contents;
            }
            
            .elementor-element.elementor-element-${elementId} > .elementor-container > .elementor-element {
                flex: 0 0 auto;
            }
            
            /* Responsive adjustments */
            @media (max-width: 1024px) {
                .elementor-element.elementor-element-${elementId} {
                    flex-direction: ${settings.flex_direction === 'row' ? 'column' : settings.flex_direction};
                }
            }
        `;
    }
    
    // Render the flexbox container
    render(elementData) {
        const settings = elementData.settings || this.getDefaultSettings();
        
        return `
            <div class="elementor-element elementor-element-${elementData.id} elementor-container-flexbox" 
                 data-id="${elementData.id}" 
                 data-element_type="container"
                 data-container-type="flexbox">
                
                <!-- Element Overlay -->
                <div class="elementor-element-overlay">
                    <div class="elementor-editor-element-settings">
                        <div class="elementor-editor-element-edit" title="Edit Flexbox Container">
                            <i class="eicon-edit"></i>
                        </div>
                        Flexbox Container
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
                            <i class="eicon-plus"></i>
                        </div>
                        <div class="elementor-empty-view-title">
                            Choose your widget
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
    
    // Handle flexbox-specific interactions
    initInteractions(element, elementData) {
        // Add specific flexbox interaction handlers
        const container = element.querySelector('.elementor-container');
        
        // Enable drop on flexbox container
        container.addEventListener('dragover', (e) => {
            e.preventDefault();
            container.classList.add('flexbox-drop-active');
        });
        
        container.addEventListener('dragleave', (e) => {
            if (!container.contains(e.relatedTarget)) {
                container.classList.remove('flexbox-drop-active');
            }
        });
        
        container.addEventListener('drop', (e) => {
            e.preventDefault();
            container.classList.remove('flexbox-drop-active');
            
            const elementType = e.dataTransfer.getData('text/plain');
            if (elementType) {
                this.addElementToFlexbox(elementType, elementData.id);
            }
        });
    }
    
    // Add element to flexbox container
    addElementToFlexbox(elementType, containerId) {
        // This will be implemented in the main builder
        console.log('Adding element to flexbox:', elementType, containerId);
    }
}

// Export for use in main builder
window.FlexboxContainer = FlexboxContainer;