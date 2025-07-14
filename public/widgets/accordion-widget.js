// Accordion Widget - Collapsible Content Panels
// Part of KingsBuilder Phase 2.4: Interactive Widgets

class AccordionWidget {
    constructor() {
        this.type = 'accordion';
        this.title = 'Accordion';
        this.icon = 'eicon-accordion';
        this.category = 'general';
    }
    
    getDefaultSettings() {
        return {
            accordion_items: [
                {
                    item_title: 'Accordion Item #1',
                    item_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
                    item_icon: {
                        value: 'fas fa-plus',
                        library: 'fa-solid'
                    },
                    item_icon_active: {
                        value: 'fas fa-minus',
                        library: 'fa-solid'
                    }
                },
                {
                    item_title: 'Accordion Item #2',
                    item_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
                    item_icon: {
                        value: 'fas fa-plus',
                        library: 'fa-solid'
                    },
                    item_icon_active: {
                        value: 'fas fa-minus',
                        library: 'fa-solid'
                    }
                },
                {
                    item_title: 'Accordion Item #3',
                    item_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
                    item_icon: {
                        value: 'fas fa-plus',
                        library: 'fa-solid'
                    },
                    item_icon_active: {
                        value: 'fas fa-minus',
                        library: 'fa-solid'
                    }
                }
            ],
            active_item: 1,
            multiple_open: false,
            collapse_inactive: true,
            icon_align: 'right',
            toggle_speed: 300,
            title_html_tag: 'div',
            accordion_border_width: {
                size: 1,
                unit: 'px'
            },
            accordion_border_color: '#e4e6ea',
            accordion_border_radius: {
                size: 0,
                unit: 'px'
            },
            title_background_color: '#ffffff',
            title_color: '#333333',
            title_active_background_color: '#6ec1e4',
            title_active_color: '#ffffff',
            title_padding: {
                top: 15,
                right: 20,
                bottom: 15,
                left: 20,
                unit: 'px'
            },
            content_background_color: '#ffffff',
            content_color: '#7a7a7a',
            content_padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
                unit: 'px'
            },
            icon_color: '#333333',
            icon_active_color: '#ffffff',
            icon_space: {
                size: 15,
                unit: 'px'
            },
            title_typography: {
                font_size: {
                    size: 16,
                    unit: 'px'
                },
                font_weight: '600'
            }
        };
    }
    
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-accordion"></i>
                    Accordion Settings
                </div>
                
                <!-- Accordion Items Repeater -->
                <div class="elementor-control elementor-control-type-repeater">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Accordion Items</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-repeater accordion-repeater">
                                    <div class="elementor-repeater-fields">
                                        ${this.getAccordionItemTemplate()}
                                    </div>
                                    <div class="elementor-repeater-add">
                                        <button type="button" class="elementor-repeater-add-button">
                                            <i class="eicon-plus"></i>
                                            Add Item
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Multiple Open -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Allow Multiple Open</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="multiple_open" class="elementor-switch-input">
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Icon Alignment -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Icon Position</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="icon_align" value="left" id="icon_left">
                                    <label for="icon_left" title="Left">
                                        <i class="eicon-h-align-left"></i>
                                    </label>
                                    
                                    <input type="radio" name="icon_align" value="right" id="icon_right" checked>
                                    <label for="icon_right" title="Right">
                                        <i class="eicon-h-align-right"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Toggle Speed -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Toggle Speed</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="toggle_speed" min="100" max="1000" step="50" value="300" class="elementor-slider-input">
                                    <span class="elementor-slider-value">300ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Title HTML Tag -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Title HTML Tag</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="title_html_tag" class="elementor-control-input">
                                    <option value="h1">H1</option>
                                    <option value="h2">H2</option>
                                    <option value="h3">H3</option>
                                    <option value="h4">H4</option>
                                    <option value="h5">H5</option>
                                    <option value="h6">H6</option>
                                    <option value="div" selected>DIV</option>
                                    <option value="span">SPAN</option>
                                    <option value="p">P</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Style Section -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-paint-brush"></i>
                    Title Style
                </div>
                
                <!-- Title Background -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Background Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="title_background_color" data-default="#ffffff">
                                    <button type="button" class="pcr-button" style="color: #ffffff;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Title Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Text Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="title_color" data-default="#333333">
                                    <button type="button" class="pcr-button" style="color: #333333;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Active State -->
                <h4 class="elementor-control-section-sub-title">Active State</h4>
                
                <!-- Active Background -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Background Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="title_active_background_color" data-default="#6ec1e4">
                                    <button type="button" class="pcr-button" style="color: #6ec1e4;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Active Text Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Text Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="title_active_color" data-default="#ffffff">
                                    <button type="button" class="pcr-button" style="color: #ffffff;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Title Padding -->
                <div class="elementor-control elementor-control-type-dimensions">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Padding</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-control-dimensions">
                                    <input type="number" name="title_padding_top" value="15" placeholder="Top">
                                    <input type="number" name="title_padding_right" value="20" placeholder="Right">
                                    <input type="number" name="title_padding_bottom" value="15" placeholder="Bottom">
                                    <input type="number" name="title_padding_left" value="20" placeholder="Left">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Content Style -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-text"></i>
                    Content Style
                </div>
                
                <!-- Content Background -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Background Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="content_background_color" data-default="#ffffff">
                                    <button type="button" class="pcr-button" style="color: #ffffff;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Content Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Text Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="content_color" data-default="#7a7a7a">
                                    <button type="button" class="pcr-button" style="color: #7a7a7a;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Content Padding -->
                <div class="elementor-control elementor-control-type-dimensions">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Padding</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-control-dimensions">
                                    <input type="number" name="content_padding_top" value="20" placeholder="Top">
                                    <input type="number" name="content_padding_right" value="20" placeholder="Right">
                                    <input type="number" name="content_padding_bottom" value="20" placeholder="Bottom">
                                    <input type="number" name="content_padding_left" value="20" placeholder="Left">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Border Style -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-frame"></i>
                    Border Style
                </div>
                
                <!-- Border Width -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Border Width</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="accordion_border_width" min="0" max="10" value="1" class="elementor-slider-input">
                                    <span class="elementor-slider-value">1px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Border Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Border Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="accordion_border_color" data-default="#e4e6ea">
                                    <button type="button" class="pcr-button" style="color: #e4e6ea;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Border Radius -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Border Radius</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="accordion_border_radius" min="0" max="50" value="0" class="elementor-slider-input">
                                    <span class="elementor-slider-value">0px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getAccordionItemTemplate() {
        return `
            <div class="elementor-repeater-row">
                <div class="elementor-repeater-row-tools">
                    <i class="elementor-repeater-tool-drag eicon-ellipsis-v"></i>
                    <i class="elementor-repeater-tool-remove eicon-close"></i>
                </div>
                <div class="elementor-repeater-row-controls">
                    <!-- Item Title -->
                    <div class="elementor-control elementor-control-type-text">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Title</label>
                                <div class="elementor-control-input-wrapper">
                                    <input type="text" name="item_title" class="elementor-control-input" value="Accordion Item Title">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Item Content -->
                    <div class="elementor-control elementor-control-type-textarea">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Content</label>
                                <div class="elementor-control-input-wrapper">
                                    <textarea name="item_content" class="elementor-control-input" rows="4">Accordion item content goes here...</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Item Icon -->
                    <div class="elementor-control elementor-control-type-icons">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Icon</label>
                                <div class="elementor-control-input-wrapper">
                                    <div class="elementor-icon-picker-small">
                                        <i class="fas fa-plus"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Active Icon -->
                    <div class="elementor-control elementor-control-type-icons">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Active Icon</label>
                                <div class="elementor-control-input-wrapper">
                                    <div class="elementor-icon-picker-small">
                                        <i class="fas fa-minus"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    render(elementData) {
        const settings = { ...this.getDefaultSettings(), ...elementData.settings };
        
        return `
            <div class="elementor-widget-accordion" data-id="${elementData.id}">
                <div class="elementor-accordion" role="tablist">
                    ${this.renderAccordionItems(settings)}
                </div>
            </div>
        `;
    }
    
    renderAccordionItems(settings) {
        if (!settings.accordion_items || settings.accordion_items.length === 0) {
            return '<div class="elementor-accordion-item"><div class="elementor-tab-title">No accordion items configured</div></div>';
        }
        
        return settings.accordion_items.map((item, index) => this.renderAccordionItem(item, index, settings)).join('');
    }
    
    renderAccordionItem(item, index, settings) {
        const isActive = (index + 1) === (settings.active_item || 1);
        const titleTag = settings.title_html_tag || 'div';
        const iconClass = item.item_icon?.value || 'fas fa-plus';
        const activeIconClass = item.item_icon_active?.value || 'fas fa-minus';
        
        const iconHtml = settings.icon_align === 'left' ? 
            `<span class="elementor-accordion-icon elementor-accordion-icon-${settings.icon_align}">
                <span class="elementor-accordion-icon-closed"><i class="${iconClass}" aria-hidden="true"></i></span>
                <span class="elementor-accordion-icon-opened"><i class="${activeIconClass}" aria-hidden="true"></i></span>
            </span>` : '';
        
        const iconRightHtml = settings.icon_align === 'right' ? 
            `<span class="elementor-accordion-icon elementor-accordion-icon-${settings.icon_align}">
                <span class="elementor-accordion-icon-closed"><i class="${iconClass}" aria-hidden="true"></i></span>
                <span class="elementor-accordion-icon-opened"><i class="${activeIconClass}" aria-hidden="true"></i></span>
            </span>` : '';
        
        return `
            <div class="elementor-accordion-item">
                <${titleTag} class="elementor-tab-title ${isActive ? 'elementor-active' : ''}" 
                    data-tab="${index + 1}" 
                    role="tab" 
                    aria-controls="elementor-tab-content-${index + 1}" 
                    aria-expanded="${isActive}">
                    <a href="#" class="elementor-accordion-title">
                        ${iconHtml}
                        <span class="elementor-accordion-title-text">${item.item_title || `Accordion Item #${index + 1}`}</span>
                        ${iconRightHtml}
                    </a>
                </${titleTag}>
                <div class="elementor-tab-content ${isActive ? 'elementor-active' : ''}" 
                     data-tab="${index + 1}" 
                     role="tabpanel" 
                     aria-labelledby="elementor-tab-title-${index + 1}">
                    <p>${item.item_content || 'Accordion item content goes here...'}</p>
                </div>
            </div>
        `;
    }
    
    generateCSS(settings, elementId) {
        const borderWidth = `${settings.accordion_border_width?.size || 1}px`;
        const borderRadius = `${settings.accordion_border_radius?.size || 0}px`;
        const titlePadding = `${settings.title_padding?.top || 15}px ${settings.title_padding?.right || 20}px ${settings.title_padding?.bottom || 15}px ${settings.title_padding?.left || 20}px`;
        const contentPadding = `${settings.content_padding?.top || 20}px ${settings.content_padding?.right || 20}px ${settings.content_padding?.bottom || 20}px ${settings.content_padding?.left || 20}px`;
        const iconSpacing = `${settings.icon_space?.size || 15}px`;
        const toggleSpeed = `${settings.toggle_speed || 300}ms`;
        
        return `
            .elementor-element-${elementId} .elementor-accordion {
                border: ${borderWidth} solid ${settings.accordion_border_color || '#e4e6ea'};
                border-radius: ${borderRadius};
                overflow: hidden;
            }
            
            .elementor-element-${elementId} .elementor-accordion-item {
                border-bottom: ${borderWidth} solid ${settings.accordion_border_color || '#e4e6ea'};
            }
            
            .elementor-element-${elementId} .elementor-accordion-item:last-child {
                border-bottom: none;
            }
            
            .elementor-element-${elementId} .elementor-tab-title {
                cursor: pointer;
                padding: 0;
                margin: 0;
                background-color: ${settings.title_background_color || '#ffffff'};
                color: ${settings.title_color || '#333333'};
                transition: all ${toggleSpeed} ease;
                border: none;
                outline: none;
                position: relative;
            }
            
            .elementor-element-${elementId} .elementor-tab-title.elementor-active {
                background-color: ${settings.title_active_background_color || '#6ec1e4'};
                color: ${settings.title_active_color || '#ffffff'};
            }
            
            .elementor-element-${elementId} .elementor-tab-title:hover {
                background-color: ${this.lightenColor(settings.title_active_background_color || '#6ec1e4', 10)};
                color: ${settings.title_active_color || '#ffffff'};
            }
            
            .elementor-element-${elementId} .elementor-accordion-title {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: ${titlePadding};
                color: inherit;
                text-decoration: none;
                font-size: ${settings.title_typography?.font_size?.size || 16}px;
                font-weight: ${settings.title_typography?.font_weight || '600'};
                width: 100%;
            }
            
            .elementor-element-${elementId} .elementor-accordion-title-text {
                flex: 1;
            }
            
            .elementor-element-${elementId} .elementor-accordion-icon {
                flex-shrink: 0;
                transition: transform ${toggleSpeed} ease;
                color: ${settings.icon_color || '#333333'};
                font-size: 1em;
            }
            
            .elementor-element-${elementId} .elementor-tab-title.elementor-active .elementor-accordion-icon {
                color: ${settings.icon_active_color || '#ffffff'};
            }
            
            .elementor-element-${elementId} .elementor-accordion-icon-left {
                margin-right: ${iconSpacing};
                order: -1;
            }
            
            .elementor-element-${elementId} .elementor-accordion-icon-right {
                margin-left: ${iconSpacing};
                order: 1;
            }
            
            .elementor-element-${elementId} .elementor-accordion-icon-opened {
                display: none;
            }
            
            .elementor-element-${elementId} .elementor-tab-title.elementor-active .elementor-accordion-icon-closed {
                display: none;
            }
            
            .elementor-element-${elementId} .elementor-tab-title.elementor-active .elementor-accordion-icon-opened {
                display: inline;
            }
            
            .elementor-element-${elementId} .elementor-tab-content {
                padding: ${contentPadding};
                background-color: ${settings.content_background_color || '#ffffff'};
                color: ${settings.content_color || '#7a7a7a'};
                line-height: 1.6;
                display: none;
                overflow: hidden;
                transition: all ${toggleSpeed} ease;
            }
            
            .elementor-element-${elementId} .elementor-tab-content.elementor-active {
                display: block;
            }
            
            .elementor-element-${elementId} .elementor-tab-content p {
                margin: 0 0 15px 0;
            }
            
            .elementor-element-${elementId} .elementor-tab-content p:last-child {
                margin-bottom: 0;
            }
            
            /* Animation Classes */
            .elementor-element-${elementId} .elementor-tab-content {
                max-height: 0;
                opacity: 0;
                display: block;
                transition: max-height ${toggleSpeed} ease, opacity ${toggleSpeed} ease, padding ${toggleSpeed} ease;
                padding-top: 0;
                padding-bottom: 0;
            }
            
            .elementor-element-${elementId} .elementor-tab-content.elementor-active {
                max-height: 2000px;
                opacity: 1;
                padding: ${contentPadding};
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .elementor-element-${elementId} .elementor-accordion-title {
                    padding: 12px 15px;
                    font-size: 14px;
                }
                
                .elementor-element-${elementId} .elementor-tab-content {
                    padding: 15px;
                }
                
                .elementor-element-${elementId} .elementor-tab-content.elementor-active {
                    padding: 15px;
                }
            }
        `;
    }
    
    lightenColor(color, percent) {
        const num = parseInt(color.replace("#", ""), 16);
        const amt = Math.round(2.55 * percent);
        const R = (num >> 16) + amt;
        const G = (num >> 8 & 0x00FF) + amt;
        const B = (num & 0x0000FF) + amt;
        return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
            (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
            (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
    }
    
    initInteractions(element, elementData) {
        const settings = { ...this.getDefaultSettings(), ...elementData.settings };
        
        // Initialize accordion functionality
        const accordionTitles = element.querySelectorAll('.elementor-tab-title');
        
        accordionTitles.forEach(title => {
            title.addEventListener('click', (e) => {
                e.preventDefault();
                
                const tabNumber = title.getAttribute('data-tab');
                this.toggleAccordionItem(tabNumber, element, settings);
            });
        });
        
        // Initialize repeater
        const repeater = element.querySelector('.accordion-repeater');
        if (repeater) {
            this.initRepeater(repeater);
        }
    }
    
    toggleAccordionItem(tabNumber, element, settings) {
        const clickedTitle = element.querySelector(`[data-tab="${tabNumber}"]`);
        const clickedContent = element.querySelector(`.elementor-tab-content[data-tab="${tabNumber}"]`);
        
        if (!clickedTitle || !clickedContent) return;
        
        const isCurrentlyActive = clickedTitle.classList.contains('elementor-active');
        
        // If multiple open is not allowed, close all other items
        if (!settings.multiple_open) {
            const allTitles = element.querySelectorAll('.elementor-tab-title');
            const allContents = element.querySelectorAll('.elementor-tab-content');
            
            allTitles.forEach(title => {
                title.classList.remove('elementor-active');
                title.setAttribute('aria-expanded', 'false');
            });
            
            allContents.forEach(content => {
                content.classList.remove('elementor-active');
            });
        }
        
        // Toggle the clicked item
        if (!isCurrentlyActive) {
            clickedTitle.classList.add('elementor-active');
            clickedTitle.setAttribute('aria-expanded', 'true');
            clickedContent.classList.add('elementor-active');
        } else if (settings.multiple_open || settings.collapse_inactive !== false) {
            clickedTitle.classList.remove('elementor-active');
            clickedTitle.setAttribute('aria-expanded', 'false');
            clickedContent.classList.remove('elementor-active');
        }
    }
    
    initRepeater(repeater) {
        const addButton = repeater.querySelector('.elementor-repeater-add-button');
        const fieldsContainer = repeater.querySelector('.elementor-repeater-fields');
        
        addButton.addEventListener('click', () => {
            const newItem = document.createElement('div');
            newItem.innerHTML = this.getAccordionItemTemplate();
            fieldsContainer.appendChild(newItem.firstElementChild);
            
            this.bindItemRemoval(newItem.firstElementChild);
        });
        
        // Bind removal for existing items
        const existingItems = fieldsContainer.querySelectorAll('.elementor-repeater-row');
        existingItems.forEach(item => this.bindItemRemoval(item));
    }
    
    bindItemRemoval(itemRow) {
        const removeButton = itemRow.querySelector('.elementor-repeater-tool-remove');
        removeButton.addEventListener('click', () => {
            itemRow.remove();
        });
    }
}

window.AccordionWidget = AccordionWidget;