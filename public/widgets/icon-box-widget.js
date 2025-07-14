// Icon Box Widget - Icon + Title + Description Combo
// Part of KingsBuilder Phase 2.2: Icon System

class IconBoxWidget {
    constructor() {
        this.type = 'icon-box';
        this.title = 'Icon Box';
        this.icon = 'eicon-icon-box';
        this.category = 'elements';
    }
    
    getDefaultSettings() {
        return {
            selected_icon: {
                value: 'fas fa-star',
                library: 'fa-solid'
            },
            view: 'default',
            position: 'top',
            title_text: 'This is the heading',
            description_text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.',
            link: {
                url: '',
                is_external: false,
                nofollow: false
            },
            title_size: 'default',
            icon_space: {
                size: 15,
                unit: 'px'
            },
            icon_size: 'medium',
            icon_padding: {
                size: 1,
                unit: 'em'
            },
            icon_color: '#6ec1e4',
            icon_color_hover: '#54595f',
            icon_background_color: '',
            icon_background_hover_color: '',
            title_color: '#54595f',
            title_color_hover: '',
            description_color: '#7a7a7a',
            border_radius: {
                size: 50,
                unit: '%'
            },
            content_vertical_alignment: 'top',
            hover_animation: 'none'
        };
    }
    
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-icon-box"></i>
                    Icon Box Settings
                </div>
                
                <!-- Icon -->
                <div class="elementor-control elementor-control-type-icons">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Icon</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-icon-picker">
                                    <div class="elementor-icon-picker-trigger">
                                        <i class="fas fa-star"></i>
                                        <span>Choose Icon</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- View -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">View</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="view" value="default" id="view_default" checked>
                                    <label for="view_default" title="Default">
                                        <i class="eicon-star"></i>
                                    </label>
                                    
                                    <input type="radio" name="view" value="stacked" id="view_stacked">
                                    <label for="view_stacked" title="Stacked">
                                        <i class="eicon-star-o"></i>
                                    </label>
                                    
                                    <input type="radio" name="view" value="framed" id="view_framed">
                                    <label for="view_framed" title="Framed">
                                        <i class="eicon-frame-expand"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Position -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Position</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="position" value="top" id="position_top" checked>
                                    <label for="position_top" title="Top">
                                        <i class="eicon-v-align-top"></i>
                                    </label>
                                    
                                    <input type="radio" name="position" value="left" id="position_left">
                                    <label for="position_left" title="Left">
                                        <i class="eicon-h-align-left"></i>
                                    </label>
                                    
                                    <input type="radio" name="position" value="right" id="position_right">
                                    <label for="position_right" title="Right">
                                        <i class="eicon-h-align-right"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Title -->
                <div class="elementor-control elementor-control-type-text">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Title</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="text" name="title_text" class="elementor-control-input" value="This is the heading">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Description -->
                <div class="elementor-control elementor-control-type-textarea">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Description</label>
                            <div class="elementor-control-input-wrapper">
                                <textarea name="description_text" class="elementor-control-input" rows="4">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis.</textarea>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Link -->
                <div class="elementor-control elementor-control-type-url">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Link</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="url" name="link_url" class="elementor-control-input" placeholder="https://...">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Title Size -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Title HTML Tag</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="title_size" class="elementor-control-input">
                                    <option value="h1">H1</option>
                                    <option value="h2">H2</option>
                                    <option value="h3" selected>H3</option>
                                    <option value="h4">H4</option>
                                    <option value="h5">H5</option>
                                    <option value="h6">H6</option>
                                    <option value="div">div</option>
                                    <option value="span">span</option>
                                    <option value="p">p</option>
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
                    Icon Style
                </div>
                
                <!-- Icon Size -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Size</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="icon_size" min="6" max="300" value="50" class="elementor-slider-input">
                                    <span class="elementor-slider-value">50px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Icon Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Primary Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="icon_color" data-default="#6ec1e4">
                                    <button type="button" class="pcr-button" style="color: #6ec1e4;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Icon Background -->
                <div class="elementor-control elementor-control-type-color" data-condition="view:stacked,framed">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Secondary Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="icon_background_color" data-default="">
                                    <button type="button" class="pcr-button" style="color: transparent;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Icon Spacing -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Spacing</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="icon_space" min="0" max="100" value="15" class="elementor-slider-input">
                                    <span class="elementor-slider-value">15px</span>
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
                
                <!-- Title Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Title Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="title_color" data-default="#54595f">
                                    <button type="button" class="pcr-button" style="color: #54595f;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Description Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Description Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="description_color" data-default="#7a7a7a">
                                    <button type="button" class="pcr-button" style="color: #7a7a7a;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Vertical Alignment -->
                <div class="elementor-control elementor-control-type-choose" data-condition="position:left,right">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Vertical Alignment</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="content_vertical_alignment" value="top" id="align_top" checked>
                                    <label for="align_top" title="Top">
                                        <i class="eicon-v-align-top"></i>
                                    </label>
                                    
                                    <input type="radio" name="content_vertical_alignment" value="middle" id="align_middle">
                                    <label for="align_middle" title="Middle">
                                        <i class="eicon-v-align-middle"></i>
                                    </label>
                                    
                                    <input type="radio" name="content_vertical_alignment" value="bottom" id="align_bottom">
                                    <label for="align_bottom" title="Bottom">
                                        <i class="eicon-v-align-bottom"></i>
                                    </label>
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
        const iconClass = settings.selected_icon?.value || 'fas fa-star';
        const titleTag = settings.title_size || 'h3';
        const wrapperClass = this.getWrapperClass(settings);
        
        const iconElement = `
            <div class="elementor-icon-box-icon">
                <span class="elementor-icon elementor-animation-${settings.hover_animation || 'none'}">
                    <i class="${iconClass}" aria-hidden="true"></i>
                </span>
            </div>
        `;
        
        const contentElement = `
            <div class="elementor-icon-box-content">
                <${titleTag} class="elementor-icon-box-title">
                    <span>${settings.title_text || 'This is the heading'}</span>
                </${titleTag}>
                <p class="elementor-icon-box-description">
                    ${settings.description_text || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.'}
                </p>
            </div>
        `;
        
        const innerContent = `
            <div class="elementor-icon-box-wrapper">
                ${iconElement}
                ${contentElement}
            </div>
        `;
        
        return `
            <div class="elementor-widget-icon-box ${wrapperClass}" data-id="${elementData.id}">
                ${settings.link?.url ? 
                    `<a href="${settings.link.url}" class="elementor-icon-box-link" ${settings.link.is_external ? 'target="_blank"' : ''} ${settings.link.nofollow ? 'rel="nofollow"' : ''}>${innerContent}</a>` :
                    innerContent
                }
            </div>
        `;
    }
    
    getWrapperClass(settings) {
        const classes = [];
        
        classes.push(`elementor-position-${settings.position}`);
        classes.push(`elementor-view-${settings.view}`);
        
        if (settings.position === 'left' || settings.position === 'right') {
            classes.push(`elementor-vertical-align-${settings.content_vertical_alignment}`);
        }
        
        return classes.join(' ');
    }
    
    generateCSS(settings, elementId) {
        const iconSize = `${settings.icon_size || 50}px`;
        const iconSpace = `${settings.icon_space?.size || 15}px`;
        const iconPadding = `${settings.icon_padding?.size || 1}em`;
        
        return `
            .elementor-element-${elementId} .elementor-icon-box-wrapper {
                display: flex;
                flex-direction: ${settings.position === 'top' ? 'column' : 'row'};
                align-items: ${settings.position === 'top' ? 'center' : (settings.content_vertical_alignment || 'top')};
                text-align: ${settings.position === 'top' ? 'center' : 'left'};
            }
            
            .elementor-element-${elementId} .elementor-icon-box-icon {
                margin-${settings.position === 'top' ? 'bottom' : (settings.position === 'left' ? 'right' : 'left')}: ${iconSpace};
                flex-shrink: 0;
            }
            
            .elementor-element-${elementId} .elementor-icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                font-size: ${iconSize};
                color: ${settings.icon_color || '#6ec1e4'};
                transition: all 0.3s ease;
            }
            
            .elementor-element-${elementId}.elementor-view-stacked .elementor-icon {
                background-color: ${settings.icon_color || '#6ec1e4'};
                color: #fff;
                padding: ${iconPadding};
                border-radius: ${settings.border_radius?.size || 50}${settings.border_radius?.unit || '%'};
            }
            
            .elementor-element-${elementId}.elementor-view-framed .elementor-icon {
                border: 3px solid ${settings.icon_color || '#6ec1e4'};
                color: ${settings.icon_color || '#6ec1e4'};
                padding: ${iconPadding};
                border-radius: ${settings.border_radius?.size || 50}${settings.border_radius?.unit || '%'};
            }
            
            .elementor-element-${elementId} .elementor-icon-box-content {
                flex: 1;
            }
            
            .elementor-element-${elementId} .elementor-icon-box-title {
                margin: 0 0 10px 0;
                color: ${settings.title_color || '#54595f'};
                font-size: 24px;
                font-weight: 600;
                line-height: 1.2;
            }
            
            .elementor-element-${elementId} .elementor-icon-box-description {
                margin: 0;
                color: ${settings.description_color || '#7a7a7a'};
                line-height: 1.6;
            }
            
            .elementor-element-${elementId} .elementor-icon-box-link {
                color: inherit;
                text-decoration: none;
                display: block;
            }
            
            /* Hover Effects */
            .elementor-element-${elementId}:hover .elementor-icon {
                color: ${settings.icon_color_hover || settings.icon_color || '#54595f'};
            }
            
            .elementor-element-${elementId}.elementor-view-stacked:hover .elementor-icon {
                background-color: ${settings.icon_background_hover_color || settings.icon_color_hover || '#54595f'};
            }
            
            .elementor-element-${elementId}.elementor-view-framed:hover .elementor-icon {
                background-color: ${settings.icon_color || '#6ec1e4'};
                color: #fff;
            }
            
            .elementor-element-${elementId}:hover .elementor-icon-box-title {
                color: ${settings.title_color_hover || settings.title_color || '#54595f'};
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .elementor-element-${elementId}.elementor-position-left .elementor-icon-box-wrapper,
                .elementor-element-${elementId}.elementor-position-right .elementor-icon-box-wrapper {
                    flex-direction: column;
                    text-align: center;
                    align-items: center;
                }
                
                .elementor-element-${elementId}.elementor-position-left .elementor-icon-box-icon,
                .elementor-element-${elementId}.elementor-position-right .elementor-icon-box-icon {
                    margin-bottom: ${iconSpace};
                    margin-left: 0;
                    margin-right: 0;
                }
            }
        `;
    }
}

window.IconBoxWidget = IconBoxWidget;