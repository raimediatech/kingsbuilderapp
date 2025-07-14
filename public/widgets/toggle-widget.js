// Toggle Widget - Show/Hide Content Toggle
// Part of KingsBuilder Phase 2.4: Interactive Widgets

class ToggleWidget {
    constructor() {
        this.type = 'toggle';
        this.title = 'Toggle';
        this.icon = 'eicon-toggle';
        this.category = 'general';
    }
    
    getDefaultSettings() {
        return {
            toggle_title: 'Toggle Title',
            toggle_content: 'Toggle content goes here. Click edit button to change this text. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
            toggle_icon: {
                value: 'fas fa-caret-right',
                library: 'fa-solid'
            },
            toggle_icon_active: {
                value: 'fas fa-caret-down', 
                library: 'fa-solid'
            },
            show_icon: true,
            icon_position: 'left',
            default_state: 'closed',
            toggle_speed: 300,
            title_html_tag: 'h4',
            toggle_align: 'left',
            icon_spacing: {
                size: 10,
                unit: 'px'
            },
            // Style Settings
            toggle_background_color: '#f8f9fa',
            toggle_color: '#333333',
            toggle_active_background_color: '#6ec1e4',
            toggle_active_color: '#ffffff',
            toggle_border_width: {
                size: 1,
                unit: 'px'
            },
            toggle_border_color: '#e4e6ea',
            toggle_border_radius: {
                size: 5,
                unit: 'px'
            },
            toggle_padding: {
                top: 15,
                right: 20,
                bottom: 15,
                left: 20,
                unit: 'px'
            },
            content_background_color: '#ffffff',
            content_color: '#7a7a7a',
            content_border_width: {
                size: 1,
                unit: 'px'
            },
            content_border_color: '#e4e6ea',
            content_padding: {
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
                unit: 'px'
            },
            icon_color: '#333333',
            icon_active_color: '#ffffff',
            icon_size: {
                size: 16,
                unit: 'px'
            },
            title_typography: {
                font_size: {
                    size: 18,
                    unit: 'px'
                },
                font_weight: '600',
                line_height: 1.4
            },
            content_typography: {
                font_size: {
                    size: 16,
                    unit: 'px'
                },
                font_weight: '400',
                line_height: 1.6
            }
        };
    }
    
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-toggle"></i>
                    Toggle Settings
                </div>
                
                <!-- Toggle Title -->
                <div class="elementor-control elementor-control-type-text">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Title</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="text" name="toggle_title" class="elementor-control-input" value="Toggle Title">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Toggle Content -->
                <div class="elementor-control elementor-control-type-textarea">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Content</label>
                            <div class="elementor-control-input-wrapper">
                                <textarea name="toggle_content" class="elementor-control-input" rows="5">Toggle content goes here. Click edit button to change this text.</textarea>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Show Icon -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Show Icon</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="show_icon" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Icon Position -->
                <div class="elementor-control elementor-control-type-choose" data-condition="show_icon:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Icon Position</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="icon_position" value="left" id="icon_pos_left" checked>
                                    <label for="icon_pos_left" title="Left">
                                        <i class="eicon-h-align-left"></i>
                                    </label>
                                    
                                    <input type="radio" name="icon_position" value="right" id="icon_pos_right">
                                    <label for="icon_pos_right" title="Right">
                                        <i class="eicon-h-align-right"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Closed Icon -->
                <div class="elementor-control elementor-control-type-icons" data-condition="show_icon:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Closed Icon</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-icon-picker-small">
                                    <i class="fas fa-caret-right"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Open Icon -->
                <div class="elementor-control elementor-control-type-icons" data-condition="show_icon:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Open Icon</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-icon-picker-small">
                                    <i class="fas fa-caret-down"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Default State -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Default State</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="default_state" class="elementor-control-input">
                                    <option value="closed" selected>Closed</option>
                                    <option value="open">Open</option>
                                </select>
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
                                    <option value="h4" selected>H4</option>
                                    <option value="h5">H5</option>
                                    <option value="h6">H6</option>
                                    <option value="div">DIV</option>
                                    <option value="span">SPAN</option>
                                    <option value="p">P</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Toggle Alignment -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Alignment</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="toggle_align" value="left" id="align_left" checked>
                                    <label for="align_left" title="Left">
                                        <i class="eicon-text-align-left"></i>
                                    </label>
                                    
                                    <input type="radio" name="toggle_align" value="center" id="align_center">
                                    <label for="align_center" title="Center">
                                        <i class="eicon-text-align-center"></i>
                                    </label>
                                    
                                    <input type="radio" name="toggle_align" value="right" id="align_right">
                                    <label for="align_right" title="Right">
                                        <i class="eicon-text-align-right"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Toggle Style -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-paint-brush"></i>
                    Toggle Style
                </div>
                
                <!-- Normal State -->
                <h4 class="elementor-control-section-sub-title">Normal</h4>
                
                <!-- Background Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Background Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="toggle_background_color" data-default="#f8f9fa">
                                    <button type="button" class="pcr-button" style="color: #f8f9fa;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Text Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Text Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="toggle_color" data-default="#333333">
                                    <button type="button" class="pcr-button" style="color: #333333;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Active State -->
                <h4 class="elementor-control-section-sub-title">Active</h4>
                
                <!-- Active Background -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Background Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="toggle_active_background_color" data-default="#6ec1e4">
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
                                <div class="pickr-color-picker" data-property="toggle_active_color" data-default="#ffffff">
                                    <button type="button" class="pcr-button" style="color: #ffffff;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Border -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Border Width</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="toggle_border_width" min="0" max="10" value="1" class="elementor-slider-input">
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
                                <div class="pickr-color-picker" data-property="toggle_border_color" data-default="#e4e6ea">
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
                                    <input type="range" name="toggle_border_radius" min="0" max="50" value="5" class="elementor-slider-input">
                                    <span class="elementor-slider-value">5px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Padding -->
                <div class="elementor-control elementor-control-type-dimensions">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Padding</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-control-dimensions">
                                    <input type="number" name="toggle_padding_top" value="15" placeholder="Top">
                                    <input type="number" name="toggle_padding_right" value="20" placeholder="Right">
                                    <input type="number" name="toggle_padding_bottom" value="15" placeholder="Bottom">
                                    <input type="number" name="toggle_padding_left" value="20" placeholder="Left">
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
                
                <!-- Content Text Color -->
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
        `;
    }
    
    render(elementData) {
        const settings = { ...this.getDefaultSettings(), ...elementData.settings };
        const isOpen = settings.default_state === 'open';
        const titleTag = settings.title_html_tag || 'h4';
        
        const iconHtml = settings.show_icon ? this.renderIcon(settings, isOpen) : '';
        
        return `
            <div class="elementor-widget-toggle elementor-toggle-align-${settings.toggle_align}" data-id="${elementData.id}">
                <div class="elementor-toggle">
                    <${titleTag} class="elementor-toggle-title ${isOpen ? 'elementor-active' : ''}" 
                        role="button" 
                        aria-expanded="${isOpen}"
                        tabindex="0">
                        <a href="#" class="elementor-toggle-title-text">
                            ${settings.icon_position === 'left' ? iconHtml : ''}
                            <span class="elementor-toggle-title-content">${settings.toggle_title || 'Toggle Title'}</span>
                            ${settings.icon_position === 'right' ? iconHtml : ''}
                        </a>
                    </${titleTag}>
                    
                    <div class="elementor-toggle-content ${isOpen ? 'elementor-active' : ''}" 
                         role="region" 
                         aria-labelledby="elementor-toggle-title"
                         style="display: ${isOpen ? 'block' : 'none'};">
                        <p>${settings.toggle_content || 'Toggle content goes here.'}</p>
                    </div>
                </div>
            </div>
        `;
    }
    
    renderIcon(settings, isOpen) {
        const closedIcon = settings.toggle_icon?.value || 'fas fa-caret-right';
        const openIcon = settings.toggle_icon_active?.value || 'fas fa-caret-down';
        
        return `
            <span class="elementor-toggle-icon elementor-toggle-icon-${settings.icon_position}">
                <span class="elementor-toggle-icon-closed ${isOpen ? 'elementor-hidden' : ''}">
                    <i class="${closedIcon}" aria-hidden="true"></i>
                </span>
                <span class="elementor-toggle-icon-opened ${!isOpen ? 'elementor-hidden' : ''}">
                    <i class="${openIcon}" aria-hidden="true"></i>
                </span>
            </span>
        `;
    }
    
    generateCSS(settings, elementId) {
        const toggleBorderWidth = `${settings.toggle_border_width?.size || 1}px`;
        const toggleBorderRadius = `${settings.toggle_border_radius?.size || 5}px`;
        const togglePadding = `${settings.toggle_padding?.top || 15}px ${settings.toggle_padding?.right || 20}px ${settings.toggle_padding?.bottom || 15}px ${settings.toggle_padding?.left || 20}px`;
        const contentPadding = `${settings.content_padding?.top || 20}px ${settings.content_padding?.right || 20}px ${settings.content_padding?.bottom || 20}px ${settings.content_padding?.left || 20}px`;
        const contentBorderWidth = `${settings.content_border_width?.size || 1}px`;
        const iconSpacing = `${settings.icon_spacing?.size || 10}px`;
        const iconSize = `${settings.icon_size?.size || 16}px`;
        const toggleSpeed = `${settings.toggle_speed || 300}ms`;
        
        return `
            .elementor-element-${elementId} .elementor-toggle {
                border: ${toggleBorderWidth} solid ${settings.toggle_border_color || '#e4e6ea'};
                border-radius: ${toggleBorderRadius};
                overflow: hidden;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            
            .elementor-element-${elementId} .elementor-toggle-title {
                cursor: pointer;
                padding: 0;
                margin: 0;
                background-color: ${settings.toggle_background_color || '#f8f9fa'};
                color: ${settings.toggle_color || '#333333'};
                transition: all ${toggleSpeed} ease;
                border: none;
                outline: none;
                font-size: ${settings.title_typography?.font_size?.size || 18}px;
                font-weight: ${settings.title_typography?.font_weight || '600'};
                line-height: ${settings.title_typography?.line_height || 1.4};
            }
            
            .elementor-element-${elementId} .elementor-toggle-title.elementor-active {
                background-color: ${settings.toggle_active_background_color || '#6ec1e4'};
                color: ${settings.toggle_active_color || '#ffffff'};
            }
            
            .elementor-element-${elementId} .elementor-toggle-title:hover {
                background-color: ${this.lightenColor(settings.toggle_active_background_color || '#6ec1e4', 10)};
                color: ${settings.toggle_active_color || '#ffffff'};
            }
            
            .elementor-element-${elementId} .elementor-toggle-title-text {
                display: flex;
                align-items: center;
                padding: ${togglePadding};
                color: inherit;
                text-decoration: none;
                width: 100%;
                transition: all ${toggleSpeed} ease;
            }
            
            .elementor-element-${elementId} .elementor-toggle-title-content {
                flex: 1;
            }
            
            .elementor-element-${elementId} .elementor-toggle-icon {
                flex-shrink: 0;
                transition: transform ${toggleSpeed} ease;
                color: ${settings.icon_color || '#333333'};
                font-size: ${iconSize};
                line-height: 1;
            }
            
            .elementor-element-${elementId} .elementor-toggle-title.elementor-active .elementor-toggle-icon {
                color: ${settings.icon_active_color || '#ffffff'};
            }
            
            .elementor-element-${elementId} .elementor-toggle-icon-left {
                margin-right: ${iconSpacing};
                order: -1;
            }
            
            .elementor-element-${elementId} .elementor-toggle-icon-right {
                margin-left: ${iconSpacing};
                order: 1;
            }
            
            .elementor-element-${elementId} .elementor-toggle-icon-closed,
            .elementor-element-${elementId} .elementor-toggle-icon-opened {
                transition: opacity ${toggleSpeed} ease;
            }
            
            .elementor-element-${elementId} .elementor-toggle-icon-closed.elementor-hidden,
            .elementor-element-${elementId} .elementor-toggle-icon-opened.elementor-hidden {
                opacity: 0;
                position: absolute;
                pointer-events: none;
            }
            
            .elementor-element-${elementId} .elementor-toggle-content {
                padding: ${contentPadding};
                background-color: ${settings.content_background_color || '#ffffff'};
                color: ${settings.content_color || '#7a7a7a'};
                border-top: ${contentBorderWidth} solid ${settings.content_border_color || '#e4e6ea'};
                font-size: ${settings.content_typography?.font_size?.size || 16}px;
                font-weight: ${settings.content_typography?.font_weight || '400'};
                line-height: ${settings.content_typography?.line_height || 1.6};
                overflow: hidden;
                transition: all ${toggleSpeed} ease;
                max-height: 0;
                opacity: 0;
                padding-top: 0;
                padding-bottom: 0;
            }
            
            .elementor-element-${elementId} .elementor-toggle-content.elementor-active {
                max-height: 2000px;
                opacity: 1;
                padding: ${contentPadding};
            }
            
            .elementor-element-${elementId} .elementor-toggle-content p {
                margin: 0 0 15px 0;
            }
            
            .elementor-element-${elementId} .elementor-toggle-content p:last-child {
                margin-bottom: 0;
            }
            
            /* Alignment */
            .elementor-element-${elementId}.elementor-toggle-align-center .elementor-toggle-title-text {
                justify-content: center;
                text-align: center;
            }
            
            .elementor-element-${elementId}.elementor-toggle-align-right .elementor-toggle-title-text {
                justify-content: flex-end;
                text-align: right;
            }
            
            .elementor-element-${elementId}.elementor-toggle-align-center .elementor-toggle-content,
            .elementor-element-${elementId}.elementor-toggle-align-right .elementor-toggle-content {
                text-align: inherit;
            }
            
            /* Hover Effects */
            .elementor-element-${elementId} .elementor-toggle-title:focus {
                outline: 2px solid ${settings.toggle_active_background_color || '#6ec1e4'};
                outline-offset: 2px;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .elementor-element-${elementId} .elementor-toggle-title-text {
                    padding: 12px 15px;
                    font-size: 16px;
                }
                
                .elementor-element-${elementId} .elementor-toggle-content {
                    padding: 15px;
                }
                
                .elementor-element-${elementId} .elementor-toggle-content.elementor-active {
                    padding: 15px;
                }
                
                .elementor-element-${elementId} .elementor-toggle-icon {
                    font-size: 14px;
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
        
        // Initialize toggle functionality
        const toggleTitle = element.querySelector('.elementor-toggle-title');
        const toggleContent = element.querySelector('.elementor-toggle-content');
        
        if (toggleTitle && toggleContent) {
            // Handle click events
            toggleTitle.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleContent(toggleTitle, toggleContent, settings);
            });
            
            // Handle keyboard events
            toggleTitle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleContent(toggleTitle, toggleContent, settings);
                }
            });
        }
        
        // Handle conditional controls
        this.handleConditionalControls(element);
    }
    
    toggleContent(toggleTitle, toggleContent, settings) {
        const isCurrentlyOpen = toggleTitle.classList.contains('elementor-active');
        const closedIcon = toggleTitle.querySelector('.elementor-toggle-icon-closed');
        const openIcon = toggleTitle.querySelector('.elementor-toggle-icon-opened');
        
        if (isCurrentlyOpen) {
            // Close the toggle
            toggleTitle.classList.remove('elementor-active');
            toggleTitle.setAttribute('aria-expanded', 'false');
            toggleContent.classList.remove('elementor-active');
            
            if (closedIcon && openIcon) {
                closedIcon.classList.remove('elementor-hidden');
                openIcon.classList.add('elementor-hidden');
            }
            
            // Hide content after animation
            setTimeout(() => {
                if (!toggleContent.classList.contains('elementor-active')) {
                    toggleContent.style.display = 'none';
                }
            }, settings.toggle_speed || 300);
            
        } else {
            // Open the toggle
            toggleContent.style.display = 'block';
            toggleTitle.classList.add('elementor-active');
            toggleTitle.setAttribute('aria-expanded', 'true');
            
            // Small delay to ensure display is set before animation
            setTimeout(() => {
                toggleContent.classList.add('elementor-active');
            }, 10);
            
            if (closedIcon && openIcon) {
                closedIcon.classList.add('elementor-hidden');
                openIcon.classList.remove('elementor-hidden');
            }
        }
    }
    
    handleConditionalControls(element) {
        const showIconCheckbox = element.querySelector('input[name="show_icon"]');
        
        const updateConditionalControls = () => {
            const showIcon = showIconCheckbox?.checked || false;
            
            const iconConditions = element.querySelectorAll('[data-condition*="show_icon:true"]');
            iconConditions.forEach(control => {
                if (showIcon) {
                    control.classList.add('condition-met');
                } else {
                    control.classList.remove('condition-met');
                }
            });
        };
        
        if (showIconCheckbox) {
            showIconCheckbox.addEventListener('change', updateConditionalControls);
        }
        
        updateConditionalControls();
    }
}

window.ToggleWidget = ToggleWidget;