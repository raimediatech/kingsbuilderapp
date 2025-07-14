// Icon List Widget - Custom Icon Lists with Links
// Part of KingsBuilder Phase 2.2: Icon System

class IconListWidget {
    constructor() {
        this.type = 'icon-list';
        this.title = 'Icon List';
        this.icon = 'eicon-bullet-list';
        this.category = 'elements';
    }
    
    getDefaultSettings() {
        return {
            icon_list: [
                {
                    text: 'List Item #1',
                    selected_icon: {
                        value: 'fas fa-check',
                        library: 'fa-solid'
                    },
                    link: { url: '', is_external: false, nofollow: false }
                },
                {
                    text: 'List Item #2',
                    selected_icon: {
                        value: 'fas fa-check',
                        library: 'fa-solid'
                    },
                    link: { url: '', is_external: false, nofollow: false }
                },
                {
                    text: 'List Item #3',
                    selected_icon: {
                        value: 'fas fa-check',
                        library: 'fa-solid'
                    },
                    link: { url: '', is_external: false, nofollow: false }
                }
            ],
            view: 'traditional',
            space_between: {
                size: 10,
                unit: 'px'
            },
            icon_align: 'left',
            icon_indent: {
                size: 0,
                unit: 'px'
            },
            text_indent: {
                size: 10,
                unit: 'px'
            },
            icon_size: {
                size: 14,
                unit: 'px'
            },
            icon_color: '#6ec1e4',
            icon_color_hover: '#54595f',
            text_color: '#54595f',
            text_color_hover: '#6ec1e4',
            divider: false,
            divider_style: 'solid',
            divider_weight: {
                size: 1,
                unit: 'px'
            },
            divider_color: '#ddd'
        };
    }
    
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-bullet-list"></i>
                    Icon List Settings
                </div>
                
                <!-- List Items -->
                <div class="elementor-control elementor-control-type-repeater">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">List Items</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-repeater">
                                    <div class="elementor-repeater-fields">
                                        ${this.getRepeaterItemTemplate()}
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
                
                <!-- View -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">View</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="view" value="traditional" id="view_traditional" checked>
                                    <label for="view_traditional" title="Traditional">
                                        <i class="eicon-editor-list-ul"></i>
                                    </label>
                                    
                                    <input type="radio" name="view" value="inline" id="view_inline">
                                    <label for="view_inline" title="Inline">
                                        <i class="eicon-ellipsis-h"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Space Between -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Space Between</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="space_between" min="0" max="50" value="10" class="elementor-slider-input">
                                    <span class="elementor-slider-value">10px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Icon Alignment -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Icon Alignment</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="icon_align" value="left" id="icon_align_left" checked>
                                    <label for="icon_align_left" title="Left">
                                        <i class="eicon-h-align-left"></i>
                                    </label>
                                    
                                    <input type="radio" name="icon_align" value="center" id="icon_align_center">
                                    <label for="icon_align_center" title="Center">
                                        <i class="eicon-h-align-center"></i>
                                    </label>
                                    
                                    <input type="radio" name="icon_align" value="right" id="icon_align_right">
                                    <label for="icon_align_right" title="Right">
                                        <i class="eicon-h-align-right"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Text Indent -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Text Indent</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="text_indent" min="0" max="50" value="10" class="elementor-slider-input">
                                    <span class="elementor-slider-value">10px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Divider -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Divider</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="divider" class="elementor-switch-input">
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Style Section -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-paint-brush"></i>
                    List Style
                </div>
                
                <!-- Icon Size -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Icon Size</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="icon_size" min="6" max="100" value="14" class="elementor-slider-input">
                                    <span class="elementor-slider-value">14px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Icon Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Icon Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="icon_color" data-default="#6ec1e4">
                                    <button type="button" class="pcr-button" style="color: #6ec1e4;"></button>
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
                                <div class="pickr-color-picker" data-property="text_color" data-default="#54595f">
                                    <button type="button" class="pcr-button" style="color: #54595f;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Divider Style -->
                <div class="elementor-control elementor-control-type-select" data-condition="divider:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Divider Style</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="divider_style" class="elementor-control-input">
                                    <option value="solid">Solid</option>
                                    <option value="dashed">Dashed</option>
                                    <option value="dotted">Dotted</option>
                                    <option value="double">Double</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Divider Color -->
                <div class="elementor-control elementor-control-type-color" data-condition="divider:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Divider Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="divider_color" data-default="#ddd">
                                    <button type="button" class="pcr-button" style="color: #ddd;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getRepeaterItemTemplate() {
        return `
            <div class="elementor-repeater-row">
                <div class="elementor-repeater-row-tools">
                    <i class="elementor-repeater-tool-drag eicon-ellipsis-v"></i>
                    <i class="elementor-repeater-tool-remove eicon-close"></i>
                </div>
                <div class="elementor-repeater-row-controls">
                    <!-- Item Text -->
                    <div class="elementor-control elementor-control-type-text">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Text</label>
                                <div class="elementor-control-input-wrapper">
                                    <input type="text" name="text" class="elementor-control-input" value="List Item">
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
                                        <i class="fas fa-check"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Item Link -->
                    <div class="elementor-control elementor-control-type-url">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Link</label>
                                <div class="elementor-control-input-wrapper">
                                    <input type="url" name="link" class="elementor-control-input" placeholder="https://...">
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
        const wrapperClass = this.getWrapperClass(settings);
        
        return `
            <div class="elementor-widget-icon-list ${wrapperClass}" data-id="${elementData.id}">
                <ul class="elementor-icon-list-items">
                    ${settings.icon_list.map((item, index) => this.renderListItem(item, index, settings)).join('')}
                </ul>
            </div>
        `;
    }
    
    renderListItem(item, index, settings) {
        const iconClass = item.selected_icon?.value || 'fas fa-check';
        const text = item.text || `List Item #${index + 1}`;
        const hasLink = item.link?.url;
        
        const iconElement = `
            <span class="elementor-icon-list-icon">
                <i class="${iconClass}" aria-hidden="true"></i>
            </span>
        `;
        
        const textElement = `
            <span class="elementor-icon-list-text">${text}</span>
        `;
        
        const content = iconElement + textElement;
        
        return `
            <li class="elementor-icon-list-item ${settings.divider ? 'elementor-icon-list-item-divider' : ''}">
                ${hasLink ? 
                    `<a href="${item.link.url}" class="elementor-icon-list-link" ${item.link.is_external ? 'target="_blank"' : ''} ${item.link.nofollow ? 'rel="nofollow"' : ''}>${content}</a>` :
                    content
                }
            </li>
        `;
    }
    
    getWrapperClass(settings) {
        const classes = [];
        
        classes.push(`elementor-icon-list-${settings.view}`);
        classes.push(`elementor-list-item-link-${settings.link ? 'full_width' : 'inline'}`);
        
        return classes.join(' ');
    }
    
    generateCSS(settings, elementId) {
        const spaceBetween = `${settings.space_between?.size || 10}px`;
        const textIndent = `${settings.text_indent?.size || 10}px`;
        const iconSize = `${settings.icon_size?.size || 14}px`;
        const dividerWeight = `${settings.divider_weight?.size || 1}px`;
        
        return `
            .elementor-element-${elementId} .elementor-icon-list-items {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .elementor-element-${elementId} .elementor-icon-list-item {
                display: flex;
                align-items: center;
                margin-bottom: ${spaceBetween};
                position: relative;
            }
            
            .elementor-element-${elementId} .elementor-icon-list-item:last-child {
                margin-bottom: 0;
            }
            
            .elementor-element-${elementId}.elementor-icon-list-inline .elementor-icon-list-items {
                display: flex;
                flex-wrap: wrap;
                gap: ${spaceBetween};
            }
            
            .elementor-element-${elementId}.elementor-icon-list-inline .elementor-icon-list-item {
                margin-bottom: 0;
            }
            
            .elementor-element-${elementId} .elementor-icon-list-icon {
                flex-shrink: 0;
                margin-right: ${textIndent};
                color: ${settings.icon_color || '#6ec1e4'};
                font-size: ${iconSize};
                line-height: 1;
                text-align: ${settings.icon_align || 'left'};
                transition: color 0.3s ease;
            }
            
            .elementor-element-${elementId} .elementor-icon-list-text {
                color: ${settings.text_color || '#54595f'};
                font-size: 16px;
                line-height: 1.6;
                transition: color 0.3s ease;
            }
            
            .elementor-element-${elementId} .elementor-icon-list-link {
                color: inherit;
                text-decoration: none;
                display: flex;
                align-items: center;
                width: 100%;
            }
            
            .elementor-element-${elementId} .elementor-icon-list-link:hover .elementor-icon-list-icon {
                color: ${settings.icon_color_hover || settings.icon_color || '#54595f'};
            }
            
            .elementor-element-${elementId} .elementor-icon-list-link:hover .elementor-icon-list-text {
                color: ${settings.text_color_hover || settings.text_color || '#6ec1e4'};
            }
            
            /* Dividers */
            .elementor-element-${elementId} .elementor-icon-list-item-divider:not(:last-child):after {
                content: '';
                position: absolute;
                bottom: -${parseInt(spaceBetween) / 2}px;
                left: 0;
                right: 0;
                height: ${dividerWeight};
                background-color: ${settings.divider_color || '#ddd'};
                border-style: ${settings.divider_style || 'solid'};
            }
            
            /* Icon Alignment */
            .elementor-element-${elementId}.elementor-icon-align-center .elementor-icon-list-item {
                justify-content: center;
                text-align: center;
            }
            
            .elementor-element-${elementId}.elementor-icon-align-right .elementor-icon-list-item {
                justify-content: flex-end;
                text-align: right;
                flex-direction: row-reverse;
            }
            
            .elementor-element-${elementId}.elementor-icon-align-right .elementor-icon-list-icon {
                margin-right: 0;
                margin-left: ${textIndent};
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .elementor-element-${elementId}.elementor-icon-list-inline .elementor-icon-list-items {
                    flex-direction: column;
                }
                
                .elementor-element-${elementId} .elementor-icon-list-text {
                    font-size: 14px;
                }
            }
        `;
    }
    
    initInteractions(element, elementData) {
        // Initialize repeater functionality
        const repeater = element.querySelector('.elementor-repeater');
        if (repeater) {
            this.initRepeater(repeater);
        }
        
        // Handle conditional controls
        this.handleConditionalControls(element);
    }
    
    initRepeater(repeater) {
        const addButton = repeater.querySelector('.elementor-repeater-add-button');
        const fieldsContainer = repeater.querySelector('.elementor-repeater-fields');
        
        // Add new item
        addButton.addEventListener('click', () => {
            const newItem = document.createElement('div');
            newItem.innerHTML = this.getRepeaterItemTemplate();
            fieldsContainer.appendChild(newItem.firstElementChild);
            
            // Bind remove functionality
            this.bindRemoveItem(newItem.firstElementChild);
        });
        
        // Bind remove for existing items
        const existingItems = fieldsContainer.querySelectorAll('.elementor-repeater-row');
        existingItems.forEach(item => this.bindRemoveItem(item));
    }
    
    bindRemoveItem(item) {
        const removeButton = item.querySelector('.elementor-repeater-tool-remove');
        removeButton.addEventListener('click', () => {
            item.remove();
        });
    }
    
    handleConditionalControls(element) {
        const dividerCheckbox = element.querySelector('input[name="divider"]');
        
        const updateConditionalControls = () => {
            const dividerEnabled = dividerCheckbox?.checked || false;
            
            const dividerConditions = element.querySelectorAll('[data-condition*="divider:true"]');
            dividerConditions.forEach(control => {
                if (dividerEnabled) {
                    control.classList.add('condition-met');
                } else {
                    control.classList.remove('condition-met');
                }
            });
        };
        
        if (dividerCheckbox) {
            dividerCheckbox.addEventListener('change', updateConditionalControls);
        }
        
        updateConditionalControls();
    }
}

window.IconListWidget = IconListWidget;