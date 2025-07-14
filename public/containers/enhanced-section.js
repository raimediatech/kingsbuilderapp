// Enhanced Section - Improved Legacy Section System
// Part of KingsBuilder Phase 1.2: Modern Container System

class EnhancedSection {
    constructor() {
        this.type = 'enhanced-section';
        this.title = 'Section';
        this.icon = 'eicon-columns';
        this.category = 'layout';
    }
    
    // Get default settings for enhanced section
    getDefaultSettings() {
        return {
            stretch_section: 'section-stretched',
            gap: 'default',
            structure: '100',
            content_width: 'boxed',
            content_position: 'middle',
            columns_gap: 'default',
            height: 'default',
            custom_height: {
                size: '',
                unit: 'px'
            },
            background_type: 'classic',
            background_color: '',
            background_image: '',
            background_position: 'center center',
            background_attachment: 'scroll',
            background_repeat: 'no-repeat',
            background_size: 'cover',
            background_overlay_color: '',
            background_overlay_opacity: 0.5,
            padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
                unit: 'px'
            },
            margin: {
                top: 0,
                right: 0,
                bottom: 20,
                left: 0,
                unit: 'px'
            },
            border_radius: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0,
                unit: 'px'
            },
            box_shadow: {
                horizontal: 0,
                vertical: 0,
                blur: 10,
                spread: 0,
                color: 'rgba(0,0,0,0.5)'
            }
        };
    }
    
    // Get enhanced section control panel
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-columns"></i>
                    Layout Settings
                </div>
                
                <!-- Content Width -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Content Width</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="content_width" class="elementor-control-input">
                                    <option value="boxed">Boxed</option>
                                    <option value="full_width">Full Width</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Section Height -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Height</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="height" class="elementor-control-input">
                                    <option value="default">Default</option>
                                    <option value="min-height">Min Height</option>
                                    <option value="fit-to-screen">Fit To Screen</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Custom Height -->
                <div class="elementor-control elementor-control-type-slider" data-condition="height:min-height">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Custom Height</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="custom_height" min="100" max="1000" value="400" class="elementor-slider-input">
                                    <span class="elementor-slider-value">400px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Columns Gap -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Columns Gap</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="columns_gap" class="elementor-control-input">
                                    <option value="no">No Gap</option>
                                    <option value="narrow">Narrow</option>
                                    <option value="default" selected>Default</option>
                                    <option value="extended">Extended</option>
                                    <option value="wide">Wide</option>
                                    <option value="wider">Wider</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Structure Presets -->
                <div class="elementor-control elementor-control-type-structure">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Structure</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-structure-presets">
                                    <button type="button" data-structure="100" title="100%">
                                        <i class="eicon-column"></i>
                                    </button>
                                    <button type="button" data-structure="50,50" title="50% | 50%">
                                        <i class="eicon-columns"></i>
                                    </button>
                                    <button type="button" data-structure="33,33,33" title="33% | 33% | 33%">
                                        <i class="eicon-columns"></i>
                                    </button>
                                    <button type="button" data-structure="25,25,25,25" title="25% | 25% | 25% | 25%">
                                        <i class="eicon-columns"></i>
                                    </button>
                                    <button type="button" data-structure="66,33" title="66% | 33%">
                                        <i class="eicon-columns"></i>
                                    </button>
                                    <button type="button" data-structure="33,66" title="33% | 66%">
                                        <i class="eicon-columns"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Background Section -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-paint-brush"></i>
                    Background
                </div>
                
                <!-- Background Type -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Background Type</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="background_type" value="classic" id="bg_classic" checked>
                                    <label for="bg_classic" title="Classic">
                                        <i class="eicon-paint-brush"></i>
                                    </label>
                                    
                                    <input type="radio" name="background_type" value="gradient" id="bg_gradient">
                                    <label for="bg_gradient" title="Gradient">
                                        <i class="eicon-barcode"></i>
                                    </label>
                                    
                                    <input type="radio" name="background_type" value="video" id="bg_video">
                                    <label for="bg_video" title="Video">
                                        <i class="eicon-video-camera"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Background Color -->
                <div class="elementor-control elementor-control-type-color" data-condition="background_type:classic">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="background_color" data-default="">
                                    <button type="button" class="pcr-button" style="color: transparent;" aria-label="Toggle color picker dialog"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Background Image -->
                <div class="elementor-control elementor-control-type-media" data-condition="background_type:classic">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Image</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-control-media">
                                    <div class="elementor-control-media-area">
                                        <div class="elementor-control-media-upload-button">
                                            <i class="eicon-plus-circle"></i>
                                            Choose Image
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Background Overlay -->
                <div class="elementor-control elementor-control-type-color" data-condition="background_type:classic">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Overlay Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="background_overlay_color" data-default="">
                                    <button type="button" class="pcr-button" style="color: transparent;" aria-label="Toggle color picker dialog"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    // Generate CSS for enhanced section
    generateCSS(settings, elementId) {
        const customHeight = settings.custom_height?.size || 400;
        const gapSizes = {
            'no': 0,
            'narrow': 10,
            'default': 20,
            'extended': 30,
            'wide': 40,
            'wider': 50
        };
        const gap = gapSizes[settings.columns_gap] || 20;
        
        let heightCSS = '';
        if (settings.height === 'min-height') {
            heightCSS = `min-height: ${customHeight}px;`;
        } else if (settings.height === 'fit-to-screen') {
            heightCSS = `min-height: 100vh;`;
        }
        
        let backgroundCSS = '';
        if (settings.background_type === 'classic') {
            if (settings.background_color) {
                backgroundCSS += `background-color: ${settings.background_color};`;
            }
            if (settings.background_image) {
                backgroundCSS += `
                    background-image: url('${settings.background_image}');
                    background-position: ${settings.background_position || 'center center'};
                    background-attachment: ${settings.background_attachment || 'scroll'};
                    background-repeat: ${settings.background_repeat || 'no-repeat'};
                    background-size: ${settings.background_size || 'cover'};
                `;
            }
        }
        
        return `
            .elementor-element.elementor-element-${elementId} {
                ${heightCSS}
                ${backgroundCSS}
                padding: ${settings.padding?.top || 20}px ${settings.padding?.right || 20}px ${settings.padding?.bottom || 20}px ${settings.padding?.left || 20}px;
                margin: ${settings.margin?.top || 0}px ${settings.margin?.right || 0}px ${settings.margin?.bottom || 20}px ${settings.margin?.left || 0}px;
                border-radius: ${settings.border_radius?.top || 0}px ${settings.border_radius?.right || 0}px ${settings.border_radius?.bottom || 0}px ${settings.border_radius?.left || 0}px;
                position: relative;
                overflow: hidden;
            }
            
            .elementor-element.elementor-element-${elementId}::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${settings.background_overlay_color || 'transparent'};
                opacity: ${settings.background_overlay_opacity || 0};
                pointer-events: none;
            }
            
            .elementor-element.elementor-element-${elementId} > .elementor-container {
                display: flex;
                gap: ${gap}px;
                max-width: ${settings.content_width === 'boxed' ? '1200px' : '100%'};
                margin: 0 auto;
                position: relative;
                z-index: 1;
            }
            
            .elementor-element.elementor-element-${elementId} > .elementor-container > .elementor-column {
                flex: 1;
            }
            
            /* Responsive adjustments */
            @media (max-width: 1024px) {
                .elementor-element.elementor-element-${elementId} > .elementor-container {
                    flex-direction: column;
                    gap: ${Math.max(gap - 10, 10)}px;
                }
            }
        `;
    }
    
    // Render the enhanced section
    render(elementData) {
        const settings = elementData.settings || this.getDefaultSettings();
        const structure = this.parseStructure(settings.structure || '100');
        
        return `
            <section class="elementor-section elementor-element elementor-element-${elementData.id}" 
                     data-id="${elementData.id}" 
                     data-element_type="section">
                
                <!-- Element Overlay -->
                <div class="elementor-element-overlay">
                    <div class="elementor-editor-element-settings">
                        <div class="elementor-editor-element-edit" title="Edit Section">
                            <i class="eicon-edit"></i>
                        </div>
                        Section
                        <div class="elementor-editor-element-add-section" title="Add Section">
                            <i class="eicon-plus"></i>
                        </div>
                        <div class="elementor-editor-element-duplicate" title="Duplicate">
                            <i class="eicon-clone"></i>
                        </div>
                        <div class="elementor-editor-element-remove" title="Delete">
                            <i class="eicon-close"></i>
                        </div>
                    </div>
                </div>
                
                <!-- Section Content -->
                <div class="elementor-container">
                    ${structure.map((columnWidth, index) => this.renderColumn(columnWidth, index, elementData)).join('')}
                </div>
                
                <!-- Shape Dividers (Future) -->
                <div class="elementor-shape elementor-shape-top"></div>
                <div class="elementor-shape elementor-shape-bottom"></div>
            </section>
        `;
    }
    
    // Parse structure string (e.g., "50,50" or "33,33,33")
    parseStructure(structure) {
        if (structure === '100') return [100];
        return structure.split(',').map(width => parseInt(width.trim()));
    }
    
    // Render individual column
    renderColumn(width, index, sectionData) {
        const columnId = `${sectionData.id}_col_${index}`;
        const columnData = sectionData.children?.[index] || { id: columnId, type: 'column', children: [] };
        
        return `
            <div class="elementor-column elementor-col-${width} elementor-element elementor-element-${columnId}" 
                 data-id="${columnId}" 
                 data-element_type="column"
                 style="width: ${width}%;">
                
                <!-- Column Overlay -->
                <div class="elementor-element-overlay">
                    <div class="elementor-editor-element-settings">
                        <div class="elementor-editor-element-edit" title="Edit Column">
                            <i class="eicon-edit"></i>
                        </div>
                        Column ${width}%
                        <div class="elementor-editor-element-duplicate" title="Duplicate">
                            <i class="eicon-clone"></i>
                        </div>
                        <div class="elementor-editor-element-remove" title="Delete">
                            <i class="eicon-close"></i>
                        </div>
                    </div>
                </div>
                
                <!-- Column Content -->
                <div class="elementor-column-wrap">
                    <div class="elementor-widget-wrap">
                        ${columnData.children ? columnData.children.map(child => this.renderWidget(child)).join('') : ''}
                        
                        <!-- Empty Column Message -->
                        ${!columnData.children || columnData.children.length === 0 ? `
                            <div class="elementor-empty-view">
                                <div class="elementor-empty-view-icon">
                                    <i class="eicon-plus"></i>
                                </div>
                                <div class="elementor-empty-view-title">
                                    Add Widget
                                </div>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    }
    
    // Render widget placeholder
    renderWidget(widgetData) {
        return `<div class="elementor-element-placeholder" data-widget-id="${widgetData.id}"></div>`;
    }
    
    // Handle enhanced section interactions
    initInteractions(element, elementData) {
        // Structure preset handlers
        const structureButtons = element.querySelectorAll('[data-structure]');
        structureButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const structure = e.target.closest('[data-structure]').getAttribute('data-structure');
                this.changeStructure(elementData, structure);
            });
        });
        
        // Column drop zones
        const columns = element.querySelectorAll('.elementor-column');
        columns.forEach(column => {
            this.setupColumnDropZone(column);
        });
    }
    
    // Setup column drop zone
    setupColumnDropZone(column) {
        const widgetWrap = column.querySelector('.elementor-widget-wrap');
        
        widgetWrap.addEventListener('dragover', (e) => {
            e.preventDefault();
            widgetWrap.classList.add('column-drop-active');
        });
        
        widgetWrap.addEventListener('dragleave', (e) => {
            if (!widgetWrap.contains(e.relatedTarget)) {
                widgetWrap.classList.remove('column-drop-active');
            }
        });
        
        widgetWrap.addEventListener('drop', (e) => {
            e.preventDefault();
            widgetWrap.classList.remove('column-drop-active');
            
            const elementType = e.dataTransfer.getData('text/plain');
            if (elementType) {
                const columnId = column.getAttribute('data-id');
                this.addWidgetToColumn(elementType, columnId);
            }
        });
    }
    
    // Change section structure
    changeStructure(elementData, structure) {
        console.log('Changing section structure to:', structure);
        // This will be implemented in the main builder
    }
    
    // Add widget to column
    addWidgetToColumn(elementType, columnId) {
        console.log('Adding widget to column:', elementType, columnId);
        // This will be implemented in the main builder
    }
}

// Export for use in main builder
window.EnhancedSection = EnhancedSection;