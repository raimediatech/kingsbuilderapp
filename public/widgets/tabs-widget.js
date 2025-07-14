// Tabs Widget - Interactive Tab System
// Part of KingsBuilder Phase 2.4: Interactive Widgets

class TabsWidget {
    constructor() {
        this.type = 'tabs';
        this.title = 'Tabs';
        this.icon = 'eicon-tabs';
        this.category = 'general';
    }
    
    getDefaultSettings() {
        return {
            tabs: [
                {
                    tab_title: 'Tab #1',
                    tab_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
                    tab_icon: {
                        value: '',
                        library: 'fa-solid'
                    }
                },
                {
                    tab_title: 'Tab #2',
                    tab_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
                    tab_icon: {
                        value: '',
                        library: 'fa-solid'
                    }
                },
                {
                    tab_title: 'Tab #3',
                    tab_content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
                    tab_icon: {
                        value: '',
                        library: 'fa-solid'
                    }
                }
            ],
            type: 'horizontal',
            tabs_justify_horizontal: 'left',
            tabs_justify_vertical: 'top',
            active_tab: 1,
            tab_activation: 'click',
            animation_type: 'none',
            animation_duration: 300,
            responsive_breakpoint: 'mobile',
            mobile_layout: 'accordion',
            tabs_background_color: '#f1f3f4',
            tabs_color: '#54595f',
            tabs_active_color: '#ffffff',
            tabs_active_background_color: '#6ec1e4',
            tabs_border_width: {
                size: 1,
                unit: 'px'
            },
            tabs_border_color: '#e4e6ea',
            tabs_border_radius: {
                size: 3,
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
            icon_position: 'left',
            icon_spacing: {
                size: 5,
                unit: 'px'
            },
            tab_title_typography: {
                font_family: '',
                font_size: {
                    size: 14,
                    unit: 'px'
                },
                font_weight: '500'
            }
        };
    }
    
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-tabs"></i>
                    Tabs Settings
                </div>
                
                <!-- Tabs Repeater -->
                <div class="elementor-control elementor-control-type-repeater">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Tabs</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-repeater tabs-repeater">
                                    <div class="elementor-repeater-fields">
                                        ${this.getTabTemplate()}
                                    </div>
                                    <div class="elementor-repeater-add">
                                        <button type="button" class="elementor-repeater-add-button">
                                            <i class="eicon-plus"></i>
                                            Add Tab
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tab Type -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Type</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="type" value="horizontal" id="type_horizontal" checked>
                                    <label for="type_horizontal" title="Horizontal">
                                        <i class="eicon-navigation-horizontal"></i>
                                    </label>
                                    
                                    <input type="radio" name="type" value="vertical" id="type_vertical">
                                    <label for="type_vertical" title="Vertical">
                                        <i class="eicon-navigation-vertical"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Horizontal Alignment -->
                <div class="elementor-control elementor-control-type-choose" data-condition="type:horizontal">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Justify</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="tabs_justify_horizontal" value="left" id="justify_left" checked>
                                    <label for="justify_left" title="Left">
                                        <i class="eicon-h-align-left"></i>
                                    </label>
                                    
                                    <input type="radio" name="tabs_justify_horizontal" value="center" id="justify_center">
                                    <label for="justify_center" title="Center">
                                        <i class="eicon-h-align-center"></i>
                                    </label>
                                    
                                    <input type="radio" name="tabs_justify_horizontal" value="right" id="justify_right">
                                    <label for="justify_right" title="Right">
                                        <i class="eicon-h-align-right"></i>
                                    </label>
                                    
                                    <input type="radio" name="tabs_justify_horizontal" value="stretch" id="justify_stretch">
                                    <label for="justify_stretch" title="Stretch">
                                        <i class="eicon-h-align-stretch"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tab Activation -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Tab Activation</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="tab_activation" class="elementor-control-input">
                                    <option value="click" selected>On Click</option>
                                    <option value="hover">On Hover</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Animation Type -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Animation</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="animation_type" class="elementor-control-input">
                                    <option value="none">None</option>
                                    <option value="fade">Fade</option>
                                    <option value="slide">Slide</option>
                                    <option value="scale">Scale</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Mobile Layout -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Mobile Layout</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="mobile_layout" class="elementor-control-input">
                                    <option value="tabs">Tabs</option>
                                    <option value="accordion" selected>Accordion</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Tab Style -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-paint-brush"></i>
                    Tab Style
                </div>
                
                <!-- Normal State -->
                <h4 class="elementor-control-section-sub-title">Normal</h4>
                
                <!-- Tab Background -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Background Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="tabs_background_color" data-default="#f1f3f4">
                                    <button type="button" class="pcr-button" style="color: #f1f3f4;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Tab Text Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Text Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="tabs_color" data-default="#54595f">
                                    <button type="button" class="pcr-button" style="color: #54595f;"></button>
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
                                <div class="pickr-color-picker" data-property="tabs_active_background_color" data-default="#6ec1e4">
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
                                <div class="pickr-color-picker" data-property="tabs_active_color" data-default="#ffffff">
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
                                    <input type="range" name="tabs_border_width" min="0" max="10" value="1" class="elementor-slider-input">
                                    <span class="elementor-slider-value">1px</span>
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
                                    <input type="range" name="tabs_border_radius" min="0" max="50" value="3" class="elementor-slider-input">
                                    <span class="elementor-slider-value">3px</span>
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
    
    getTabTemplate() {
        return `
            <div class="elementor-repeater-row">
                <div class="elementor-repeater-row-tools">
                    <i class="elementor-repeater-tool-drag eicon-ellipsis-v"></i>
                    <i class="elementor-repeater-tool-remove eicon-close"></i>
                </div>
                <div class="elementor-repeater-row-controls">
                    <!-- Tab Title -->
                    <div class="elementor-control elementor-control-type-text">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Tab Title</label>
                                <div class="elementor-control-input-wrapper">
                                    <input type="text" name="tab_title" class="elementor-control-input" value="Tab Title">
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tab Icon -->
                    <div class="elementor-control elementor-control-type-icons">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Icon</label>
                                <div class="elementor-control-input-wrapper">
                                    <div class="elementor-icon-picker-small">
                                        <i class="fas fa-star"></i>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Tab Content -->
                    <div class="elementor-control elementor-control-type-textarea">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Content</label>
                                <div class="elementor-control-input-wrapper">
                                    <textarea name="tab_content" class="elementor-control-input" rows="4">Tab content goes here...</textarea>
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
            <div class="elementor-widget-tabs ${wrapperClass}" data-id="${elementData.id}">
                <div class="elementor-tabs">
                    ${this.renderTabsNavigation(settings)}
                    ${this.renderTabsContent(settings)}
                </div>
            </div>
        `;
    }
    
    renderTabsNavigation(settings) {
        if (!settings.tabs || settings.tabs.length === 0) {
            return '<div class="elementor-tabs-wrapper"><div class="elementor-tab-title">No tabs configured</div></div>';
        }
        
        return `
            <div class="elementor-tabs-wrapper" role="tablist">
                ${settings.tabs.map((tab, index) => this.renderTabTitle(tab, index, settings)).join('')}
            </div>
        `;
    }
    
    renderTabTitle(tab, index, settings) {
        const isActive = (index + 1) === (settings.active_tab || 1);
        const iconHtml = tab.tab_icon?.value ? `<i class="${tab.tab_icon.value}" aria-hidden="true"></i>` : '';
        
        return `
            <div class="elementor-tab-title ${isActive ? 'elementor-active' : ''}" 
                 data-tab="${index + 1}" 
                 role="tab" 
                 aria-controls="elementor-tab-content-${index + 1}" 
                 aria-selected="${isActive}">
                <a href="#" class="elementor-tab-title-text">
                    ${iconHtml}
                    <span>${tab.tab_title || `Tab #${index + 1}`}</span>
                </a>
            </div>
        `;
    }
    
    renderTabsContent(settings) {
        if (!settings.tabs || settings.tabs.length === 0) {
            return '<div class="elementor-tabs-content-wrapper"><div class="elementor-tab-content">No tabs configured</div></div>';
        }
        
        return `
            <div class="elementor-tabs-content-wrapper">
                ${settings.tabs.map((tab, index) => this.renderTabContent(tab, index, settings)).join('')}
            </div>
        `;
    }
    
    renderTabContent(tab, index, settings) {
        const isActive = (index + 1) === (settings.active_tab || 1);
        
        return `
            <div class="elementor-tab-content elementor-clearfix ${isActive ? 'elementor-active' : ''}" 
                 data-tab="${index + 1}" 
                 role="tabpanel" 
                 aria-labelledby="elementor-tab-title-${index + 1}">
                <p>${tab.tab_content || 'Tab content goes here...'}</p>
            </div>
        `;
    }
    
    getWrapperClass(settings) {
        const classes = [];
        
        classes.push(`elementor-tabs-view-${settings.type}`);
        
        if (settings.type === 'horizontal') {
            classes.push(`elementor-tabs-alignment-${settings.tabs_justify_horizontal}`);
        }
        
        if (settings.animation_type !== 'none') {
            classes.push(`elementor-tabs-animation-${settings.animation_type}`);
        }
        
        return classes.join(' ');
    }
    
    generateCSS(settings, elementId) {
        const borderWidth = `${settings.tabs_border_width?.size || 1}px`;
        const borderRadius = `${settings.tabs_border_radius?.size || 3}px`;
        const contentPadding = `${settings.content_padding?.top || 20}px ${settings.content_padding?.right || 20}px ${settings.content_padding?.bottom || 20}px ${settings.content_padding?.left || 20}px`;
        const iconSpacing = `${settings.icon_spacing?.size || 5}px`;
        
        return `
            .elementor-element-${elementId} .elementor-tabs {
                display: flex;
                flex-direction: ${settings.type === 'vertical' ? 'row' : 'column'};
                border: ${borderWidth} solid ${settings.tabs_border_color || '#e4e6ea'};
                border-radius: ${borderRadius};
                overflow: hidden;
            }
            
            .elementor-element-${elementId} .elementor-tabs-wrapper {
                display: flex;
                flex-direction: ${settings.type === 'vertical' ? 'column' : 'row'};
                background-color: ${settings.tabs_background_color || '#f1f3f4'};
                ${settings.type === 'horizontal' && settings.tabs_justify_horizontal === 'center' ? 'justify-content: center;' : ''}
                ${settings.type === 'horizontal' && settings.tabs_justify_horizontal === 'right' ? 'justify-content: flex-end;' : ''}
                ${settings.type === 'horizontal' && settings.tabs_justify_horizontal === 'stretch' ? 'width: 100%;' : ''}
                ${settings.type === 'vertical' ? 'min-width: 200px;' : ''}
            }
            
            .elementor-element-${elementId} .elementor-tab-title {
                padding: 15px 20px;
                cursor: pointer;
                color: ${settings.tabs_color || '#54595f'};
                background-color: ${settings.tabs_background_color || '#f1f3f4'};
                border: none;
                transition: all 0.3s ease;
                position: relative;
                ${settings.type === 'horizontal' && settings.tabs_justify_horizontal === 'stretch' ? 'flex: 1;' : ''}
                ${settings.type === 'vertical' ? 'border-bottom: 1px solid ' + (settings.tabs_border_color || '#e4e6ea') + ';' : ''}
                ${settings.type === 'horizontal' ? 'border-right: 1px solid ' + (settings.tabs_border_color || '#e4e6ea') + ';' : ''}
            }
            
            .elementor-element-${elementId} .elementor-tab-title:last-child {
                ${settings.type === 'vertical' ? 'border-bottom: none;' : ''}
                ${settings.type === 'horizontal' ? 'border-right: none;' : ''}
            }
            
            .elementor-element-${elementId} .elementor-tab-title.elementor-active {
                background-color: ${settings.tabs_active_background_color || '#6ec1e4'};
                color: ${settings.tabs_active_color || '#ffffff'};
                z-index: 1;
            }
            
            .elementor-element-${elementId} .elementor-tab-title:hover {
                background-color: ${this.lightenColor(settings.tabs_active_background_color || '#6ec1e4', 20)};
                color: ${settings.tabs_active_color || '#ffffff'};
            }
            
            .elementor-element-${elementId} .elementor-tab-title-text {
                color: inherit;
                text-decoration: none;
                display: flex;
                align-items: center;
                font-size: ${settings.tab_title_typography?.font_size?.size || 14}px;
                font-weight: ${settings.tab_title_typography?.font_weight || '500'};
            }
            
            .elementor-element-${elementId} .elementor-tab-title-text i {
                margin-right: ${iconSpacing};
                font-size: 1em;
            }
            
            .elementor-element-${elementId} .elementor-tabs-content-wrapper {
                flex: 1;
                background-color: ${settings.content_background_color || '#ffffff'};
                position: relative;
                overflow: hidden;
            }
            
            .elementor-element-${elementId} .elementor-tab-content {
                padding: ${contentPadding};
                color: ${settings.content_color || '#7a7a7a'};
                line-height: 1.6;
                display: none;
                opacity: 0;
                transition: opacity ${settings.animation_duration || 300}ms ease;
            }
            
            .elementor-element-${elementId} .elementor-tab-content.elementor-active {
                display: block;
                opacity: 1;
            }
            
            /* Animation Types */
            .elementor-element-${elementId}.elementor-tabs-animation-fade .elementor-tab-content {
                transition: opacity ${settings.animation_duration || 300}ms ease;
            }
            
            .elementor-element-${elementId}.elementor-tabs-animation-slide .elementor-tab-content {
                transform: translateX(20px);
                transition: all ${settings.animation_duration || 300}ms ease;
            }
            
            .elementor-element-${elementId}.elementor-tabs-animation-slide .elementor-tab-content.elementor-active {
                transform: translateX(0);
            }
            
            .elementor-element-${elementId}.elementor-tabs-animation-scale .elementor-tab-content {
                transform: scale(0.95);
                transition: all ${settings.animation_duration || 300}ms ease;
            }
            
            .elementor-element-${elementId}.elementor-tabs-animation-scale .elementor-tab-content.elementor-active {
                transform: scale(1);
            }
            
            /* Mobile Layout - Accordion */
            @media (max-width: 768px) {
                .elementor-element-${elementId}[data-mobile-layout="accordion"] .elementor-tabs {
                    flex-direction: column;
                }
                
                .elementor-element-${elementId}[data-mobile-layout="accordion"] .elementor-tabs-wrapper {
                    flex-direction: column;
                    order: -1;
                }
                
                .elementor-element-${elementId}[data-mobile-layout="accordion"] .elementor-tab-title {
                    border-right: none;
                    border-bottom: 1px solid ${settings.tabs_border_color || '#e4e6ea'};
                }
                
                .elementor-element-${elementId}[data-mobile-layout="accordion"] .elementor-tab-content {
                    border-bottom: 1px solid ${settings.tabs_border_color || '#e4e6ea'};
                }
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .elementor-element-${elementId}.elementor-tabs-view-horizontal .elementor-tabs-wrapper {
                    flex-wrap: wrap;
                }
                
                .elementor-element-${elementId} .elementor-tab-title {
                    padding: 12px 16px;
                    font-size: 14px;
                }
                
                .elementor-element-${elementId} .elementor-tab-content {
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
        
        // Initialize tab functionality
        const tabTitles = element.querySelectorAll('.elementor-tab-title');
        const tabContents = element.querySelectorAll('.elementor-tab-content');
        
        tabTitles.forEach(tabTitle => {
            const event = settings.tab_activation === 'hover' ? 'mouseenter' : 'click';
            
            tabTitle.addEventListener(event, (e) => {
                e.preventDefault();
                
                const tabNumber = tabTitle.getAttribute('data-tab');
                this.activateTab(tabNumber, element, settings);
            });
        });
        
        // Initialize repeater
        const repeater = element.querySelector('.tabs-repeater');
        if (repeater) {
            this.initRepeater(repeater);
        }
        
        // Set mobile layout attribute
        element.setAttribute('data-mobile-layout', settings.mobile_layout || 'accordion');
    }
    
    activateTab(tabNumber, element, settings) {
        const tabTitles = element.querySelectorAll('.elementor-tab-title');
        const tabContents = element.querySelectorAll('.elementor-tab-content');
        
        // Remove active class from all tabs
        tabTitles.forEach(title => {
            title.classList.remove('elementor-active');
            title.setAttribute('aria-selected', 'false');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('elementor-active');
        });
        
        // Add active class to selected tab
        const activeTitle = element.querySelector(`[data-tab="${tabNumber}"]`);
        const activeContent = element.querySelector(`.elementor-tab-content[data-tab="${tabNumber}"]`);
        
        if (activeTitle && activeContent) {
            activeTitle.classList.add('elementor-active');
            activeTitle.setAttribute('aria-selected', 'true');
            
            // Handle animation
            if (settings.animation_type === 'none') {
                activeContent.classList.add('elementor-active');
            } else {
                setTimeout(() => {
                    activeContent.classList.add('elementor-active');
                }, 50);
            }
        }
    }
    
    initRepeater(repeater) {
        const addButton = repeater.querySelector('.elementor-repeater-add-button');
        const fieldsContainer = repeater.querySelector('.elementor-repeater-fields');
        
        addButton.addEventListener('click', () => {
            const newTab = document.createElement('div');
            newTab.innerHTML = this.getTabTemplate();
            fieldsContainer.appendChild(newTab.firstElementChild);
            
            this.bindTabRemoval(newTab.firstElementChild);
        });
        
        // Bind removal for existing tabs
        const existingTabs = fieldsContainer.querySelectorAll('.elementor-repeater-row');
        existingTabs.forEach(tab => this.bindTabRemoval(tab));
    }
    
    bindTabRemoval(tabRow) {
        const removeButton = tabRow.querySelector('.elementor-repeater-tool-remove');
        removeButton.addEventListener('click', () => {
            tabRow.remove();
        });
    }
}

window.TabsWidget = TabsWidget;