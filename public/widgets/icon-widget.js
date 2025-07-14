// Icon Widget - FontAwesome Icons with Animations
// Part of KingsBuilder Phase 2.2: Icon System

class IconWidget {
    constructor() {
        this.type = 'icon';
        this.title = 'Icon';
        this.icon = 'eicon-favorite';
        this.category = 'elements';
    }
    
    getDefaultSettings() {
        return {
            selected_icon: {
                value: 'fas fa-star',
                library: 'fa-solid'
            },
            view: 'default',
            shape: 'circle',
            link: {
                url: '',
                is_external: false,
                nofollow: false
            },
            size: 'medium',
            custom_size: {
                size: 50,
                unit: 'px'
            },
            icon_color: '#6ec1e4',
            icon_color_hover: '#54595f',
            background_color: '',
            background_color_hover: '',
            border_color: '',
            border_color_hover: '',
            border_width: {
                size: 3,
                unit: 'px'
            },
            border_radius: {
                size: 50,
                unit: '%'
            },
            padding: {
                size: 0.5,
                unit: 'em'
            },
            rotate: {
                size: 0,
                unit: 'deg'
            },
            hover_animation: 'none',
            entrance_animation: 'none'
        };
    }
    
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-favorite"></i>
                    Icon Settings
                </div>
                
                <!-- Icon Selector -->
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
                                    <div class="elementor-icon-picker-panel">
                                        ${this.getIconLibraryTabs()}
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
                
                <!-- Shape -->
                <div class="elementor-control elementor-control-type-choose" data-condition="view:stacked,framed">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Shape</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="shape" value="circle" id="shape_circle" checked>
                                    <label for="shape_circle" title="Circle">
                                        <i class="eicon-circle"></i>
                                    </label>
                                    
                                    <input type="radio" name="shape" value="square" id="shape_square">
                                    <label for="shape_square" title="Square">
                                        <i class="eicon-square"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Size -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Size</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="size" value="small" id="size_small">
                                    <label for="size_small" title="Small">S</label>
                                    
                                    <input type="radio" name="size" value="medium" id="size_medium" checked>
                                    <label for="size_medium" title="Medium">M</label>
                                    
                                    <input type="radio" name="size" value="large" id="size_large">
                                    <label for="size_large" title="Large">L</label>
                                    
                                    <input type="radio" name="size" value="xl" id="size_xl">
                                    <label for="size_xl" title="Extra Large">XL</label>
                                    
                                    <input type="radio" name="size" value="custom" id="size_custom">
                                    <label for="size_custom" title="Custom">
                                        <i class="eicon-gear"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Custom Size -->
                <div class="elementor-control elementor-control-type-slider" data-condition="size:custom">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Custom Size</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="custom_size" min="6" max="300" value="50" class="elementor-slider-input">
                                    <span class="elementor-slider-value">50px</span>
                                </div>
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
                
                <!-- Hover Animation -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Hover Animation</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="hover_animation" class="elementor-control-input">
                                    <option value="none">None</option>
                                    <option value="grow">Grow</option>
                                    <option value="shrink">Shrink</option>
                                    <option value="pulse">Pulse</option>
                                    <option value="pulse-grow">Pulse Grow</option>
                                    <option value="pulse-shrink">Pulse Shrink</option>
                                    <option value="push">Push</option>
                                    <option value="pop">Pop</option>
                                    <option value="bounce-in">Bounce In</option>
                                    <option value="bounce-out">Bounce Out</option>
                                    <option value="rotate">Rotate</option>
                                    <option value="grow-rotate">Grow Rotate</option>
                                    <option value="float">Float</option>
                                    <option value="sink">Sink</option>
                                    <option value="bob">Bob</option>
                                    <option value="hang">Hang</option>
                                    <option value="skew">Skew</option>
                                    <option value="skew-forward">Skew Forward</option>
                                    <option value="skew-backward">Skew Backward</option>
                                    <option value="wobble-horizontal">Wobble Horizontal</option>
                                    <option value="wobble-vertical">Wobble Vertical</option>
                                    <option value="wobble-to-bottom-right">Wobble To Bottom Right</option>
                                    <option value="wobble-to-top-right">Wobble To Top Right</option>
                                    <option value="wobble-top">Wobble Top</option>
                                    <option value="wobble-bottom">Wobble Bottom</option>
                                    <option value="wobble-skew">Wobble Skew</option>
                                    <option value="buzz">Buzz</option>
                                    <option value="buzz-out">Buzz Out</option>
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
                    Style
                </div>
                
                <!-- Primary Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Primary Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="icon_color" data-default="#6ec1e4">
                                    <button type="button" class="pcr-button" style="color: #6ec1e4;" aria-label="Toggle color picker dialog"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Secondary Color -->
                <div class="elementor-control elementor-control-type-color" data-condition="view:stacked,framed">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Secondary Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="background_color" data-default="">
                                    <button type="button" class="pcr-button" style="color: transparent;" aria-label="Toggle color picker dialog"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Border Width -->
                <div class="elementor-control elementor-control-type-slider" data-condition="view:framed">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Border Width</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="border_width" min="1" max="10" value="3" class="elementor-slider-input">
                                    <span class="elementor-slider-value">3px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Border Radius -->
                <div class="elementor-control elementor-control-type-slider" data-condition="view:stacked,framed">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Border Radius</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="border_radius" min="0" max="50" value="50" class="elementor-slider-input">
                                    <span class="elementor-slider-value">50%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Padding -->
                <div class="elementor-control elementor-control-type-slider" data-condition="view:stacked,framed">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Padding</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="padding" min="0" max="3" step="0.1" value="0.5" class="elementor-slider-input">
                                    <span class="elementor-slider-value">0.5em</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Rotate -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Rotate</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="rotate" min="0" max="360" value="0" class="elementor-slider-input">
                                    <span class="elementor-slider-value">0°</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getIconLibraryTabs() {
        return `
            <div class="elementor-icon-library">
                <div class="elementor-icon-library-tabs">
                    <div class="elementor-icon-library-tab active" data-library="fa-solid">
                        <i class="fab fa-font-awesome"></i>
                        Solid
                    </div>
                    <div class="elementor-icon-library-tab" data-library="fa-regular">
                        <i class="far fa-circle"></i>
                        Regular
                    </div>
                    <div class="elementor-icon-library-tab" data-library="fa-brands">
                        <i class="fab fa-font-awesome-flag"></i>
                        Brands
                    </div>
                </div>
                <div class="elementor-icon-search">
                    <input type="text" placeholder="Search icons..." class="elementor-icon-search-input">
                </div>
                <div class="elementor-icon-library-content">
                    ${this.getIconGrid('fa-solid')}
                </div>
            </div>
        `;
    }
    
    getIconGrid(library) {
        const icons = this.getIconsByLibrary(library);
        
        return `
            <div class="elementor-icon-grid" data-library="${library}">
                ${icons.map(icon => `
                    <div class="elementor-icon-grid-item" data-icon="${icon}" title="${this.getIconTitle(icon)}">
                        <i class="${icon}"></i>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    getIconsByLibrary(library) {
        const iconSets = {
            'fa-solid': [
                'fas fa-star', 'fas fa-heart', 'fas fa-home', 'fas fa-user', 'fas fa-envelope',
                'fas fa-phone', 'fas fa-shopping-cart', 'fas fa-search', 'fas fa-cog', 'fas fa-bell',
                'fas fa-calendar', 'fas fa-clock', 'fas fa-map-marker-alt', 'fas fa-camera', 'fas fa-video',
                'fas fa-music', 'fas fa-headphones', 'fas fa-download', 'fas fa-upload', 'fas fa-share',
                'fas fa-thumbs-up', 'fas fa-thumbs-down', 'fas fa-comment', 'fas fa-eye', 'fas fa-edit',
                'fas fa-trash', 'fas fa-plus', 'fas fa-minus', 'fas fa-check', 'fas fa-times',
                'fas fa-arrow-left', 'fas fa-arrow-right', 'fas fa-arrow-up', 'fas fa-arrow-down',
                'fas fa-chevron-left', 'fas fa-chevron-right', 'fas fa-chevron-up', 'fas fa-chevron-down',
                'fas fa-play', 'fas fa-pause', 'fas fa-stop', 'fas fa-volume-up', 'fas fa-volume-down',
                'fas fa-wifi', 'fas fa-battery-full', 'fas fa-signal', 'fas fa-globe', 'fas fa-shield-alt'
            ],
            'fa-regular': [
                'far fa-star', 'far fa-heart', 'far fa-user', 'far fa-envelope', 'far fa-bell',
                'far fa-calendar', 'far fa-clock', 'far fa-eye', 'far fa-edit', 'far fa-trash-alt',
                'far fa-thumbs-up', 'far fa-thumbs-down', 'far fa-comment', 'far fa-bookmark',
                'far fa-flag', 'far fa-copy', 'far fa-save', 'far fa-folder', 'far fa-file',
                'far fa-circle', 'far fa-square', 'far fa-play-circle', 'far fa-pause-circle'
            ],
            'fa-brands': [
                'fab fa-facebook', 'fab fa-twitter', 'fab fa-instagram', 'fab fa-linkedin',
                'fab fa-youtube', 'fab fa-tiktok', 'fab fa-pinterest', 'fab fa-snapchat',
                'fab fa-whatsapp', 'fab fa-telegram', 'fab fa-discord', 'fab fa-slack',
                'fab fa-google', 'fab fa-apple', 'fab fa-microsoft', 'fab fa-amazon',
                'fab fa-spotify', 'fab fa-soundcloud', 'fab fa-vimeo', 'fab fa-dribbble',
                'fab fa-behance', 'fab fa-github', 'fab fa-gitlab', 'fab fa-stackoverflow'
            ]
        };
        
        return iconSets[library] || [];
    }
    
    getIconTitle(iconClass) {
        return iconClass.replace('fas fa-', '').replace('far fa-', '').replace('fab fa-', '')
            .split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }
    
    render(elementData) {
        const settings = { ...this.getDefaultSettings(), ...elementData.settings };
        const iconClass = settings.selected_icon?.value || 'fas fa-star';
        const size = this.getIconSize(settings);
        const wrapperClass = this.getWrapperClass(settings);
        
        const iconElement = `<i class="${iconClass} elementor-icon" aria-hidden="true"></i>`;
        
        const content = settings.link?.url ? 
            `<a href="${settings.link.url}" class="elementor-icon-link" ${settings.link.is_external ? 'target="_blank"' : ''} ${settings.link.nofollow ? 'rel="nofollow"' : ''}>${iconElement}</a>` :
            iconElement;
        
        return `
            <div class="elementor-widget-icon ${wrapperClass}" data-id="${elementData.id}">
                <div class="elementor-icon-wrapper">
                    ${content}
                </div>
            </div>
        `;
    }
    
    getIconSize(settings) {
        const sizes = {
            'small': '20px',
            'medium': '30px',
            'large': '40px',
            'xl': '60px',
            'custom': `${settings.custom_size?.size || 50}px`
        };
        
        return sizes[settings.size] || sizes['medium'];
    }
    
    getWrapperClass(settings) {
        const classes = [];
        
        classes.push(`elementor-view-${settings.view}`);
        
        if (settings.view !== 'default') {
            classes.push(`elementor-shape-${settings.shape}`);
        }
        
        if (settings.hover_animation !== 'none') {
            classes.push(`elementor-animation-${settings.hover_animation}`);
        }
        
        return classes.join(' ');
    }
    
    generateCSS(settings, elementId) {
        const iconSize = this.getIconSize(settings);
        const padding = settings.view !== 'default' ? `${settings.padding?.size || 0.5}em` : '0';
        const borderWidth = settings.view === 'framed' ? `${settings.border_width?.size || 3}px` : '0';
        const borderRadius = settings.view !== 'default' ? 
            (settings.shape === 'circle' ? '50%' : `${settings.border_radius?.size || 0}%`) : '0';
        
        return `
            .elementor-element-${elementId} .elementor-icon-wrapper {
                text-align: center;
            }
            
            .elementor-element-${elementId} .elementor-icon {
                font-size: ${iconSize};
                color: ${settings.icon_color || '#6ec1e4'};
                padding: ${padding};
                border: ${borderWidth} solid ${settings.border_color || settings.icon_color || '#6ec1e4'};
                border-radius: ${borderRadius};
                background-color: ${settings.background_color || 'transparent'};
                transform: rotate(${settings.rotate?.size || 0}deg);
                transition: all 0.3s ease;
                display: inline-flex;
                align-items: center;
                justify-content: center;
                text-decoration: none;
            }
            
            .elementor-element-${elementId} .elementor-icon-link {
                color: inherit;
                text-decoration: none;
            }
            
            .elementor-element-${elementId} .elementor-icon:hover {
                color: ${settings.icon_color_hover || settings.icon_color || '#54595f'};
                background-color: ${settings.background_color_hover || settings.background_color || 'transparent'};
                border-color: ${settings.border_color_hover || settings.border_color || settings.icon_color || '#6ec1e4'};
            }
            
            /* View Specific Styles */
            .elementor-element-${elementId}.elementor-view-stacked .elementor-icon {
                background-color: ${settings.icon_color || '#6ec1e4'};
                color: #fff;
            }
            
            .elementor-element-${elementId}.elementor-view-stacked .elementor-icon:hover {
                background-color: ${settings.icon_color_hover || '#54595f'};
            }
            
            .elementor-element-${elementId}.elementor-view-framed .elementor-icon {
                border-color: ${settings.icon_color || '#6ec1e4'};
                color: ${settings.icon_color || '#6ec1e4'};
            }
            
            .elementor-element-${elementId}.elementor-view-framed .elementor-icon:hover {
                background-color: ${settings.icon_color || '#6ec1e4'};
                color: #fff;
            }
            
            /* Size Classes */
            .elementor-element-${elementId}.elementor-size-small .elementor-icon {
                font-size: 20px;
            }
            
            .elementor-element-${elementId}.elementor-size-medium .elementor-icon {
                font-size: 30px;
            }
            
            .elementor-element-${elementId}.elementor-size-large .elementor-icon {
                font-size: 40px;
            }
            
            .elementor-element-${elementId}.elementor-size-xl .elementor-icon {
                font-size: 60px;
            }
        `;
    }
    
    initInteractions(element, elementData) {
        // Initialize icon picker
        const iconPicker = element.querySelector('.elementor-icon-picker');
        if (iconPicker) {
            this.initIconPicker(iconPicker);
        }
        
        // Handle conditional controls
        this.handleConditionalControls(element);
    }
    
    initIconPicker(iconPicker) {
        const trigger = iconPicker.querySelector('.elementor-icon-picker-trigger');
        const panel = iconPicker.querySelector('.elementor-icon-picker-panel');
        const tabs = iconPicker.querySelectorAll('.elementor-icon-library-tab');
        const searchInput = iconPicker.querySelector('.elementor-icon-search-input');
        
        // Toggle panel
        trigger.addEventListener('click', () => {
            panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
        });
        
        // Handle tab switching
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                const library = tab.getAttribute('data-library');
                const content = panel.querySelector('.elementor-icon-library-content');
                content.innerHTML = this.getIconGrid(library);
                
                this.bindIconSelection(content);
            });
        });
        
        // Search functionality
        searchInput.addEventListener('input', (e) => {
            this.filterIcons(e.target.value, panel);
        });
        
        // Bind initial icon selection
        this.bindIconSelection(panel);
        
        // Close panel when clicking outside
        document.addEventListener('click', (e) => {
            if (!iconPicker.contains(e.target)) {
                panel.style.display = 'none';
            }
        });
    }
    
    bindIconSelection(container) {
        const iconItems = container.querySelectorAll('.elementor-icon-grid-item');
        
        iconItems.forEach(item => {
            item.addEventListener('click', () => {
                const iconClass = item.getAttribute('data-icon');
                const trigger = container.closest('.elementor-icon-picker').querySelector('.elementor-icon-picker-trigger i');
                
                trigger.className = iconClass;
                
                // Update the actual widget
                this.updateIconInWidget(iconClass);
                
                // Close panel
                container.closest('.elementor-icon-picker-panel').style.display = 'none';
            });
        });
    }
    
    filterIcons(searchTerm, panel) {
        const activeTab = panel.querySelector('.elementor-icon-library-tab.active');
        const library = activeTab.getAttribute('data-library');
        const allIcons = this.getIconsByLibrary(library);
        
        const filteredIcons = allIcons.filter(icon => 
            icon.toLowerCase().includes(searchTerm.toLowerCase())
        );
        
        const content = panel.querySelector('.elementor-icon-library-content');
        content.innerHTML = `
            <div class="elementor-icon-grid" data-library="${library}">
                ${filteredIcons.map(icon => `
                    <div class="elementor-icon-grid-item" data-icon="${icon}" title="${this.getIconTitle(icon)}">
                        <i class="${icon}"></i>
                    </div>
                `).join('')}
            </div>
        `;
        
        this.bindIconSelection(content);
    }
    
    updateIconInWidget(iconClass) {
        // This would typically update the element data and re-render
        console.log('Updating icon to:', iconClass);
    }
    
    handleConditionalControls(element) {
        const viewInputs = element.querySelectorAll('input[name="view"]');
        const sizeInputs = element.querySelectorAll('input[name="size"]');
        
        const updateConditionalControls = () => {
            const view = element.querySelector('input[name="view"]:checked')?.value || 'default';
            const size = element.querySelector('input[name="size"]:checked')?.value || 'medium';
            
            // Show/hide controls based on view
            const viewConditions = element.querySelectorAll('[data-condition*="view:"]');
            viewConditions.forEach(control => {
                const condition = control.getAttribute('data-condition');
                const allowedViews = condition.replace('view:', '').split(',');
                
                if (allowedViews.includes(view)) {
                    control.classList.add('condition-met');
                } else {
                    control.classList.remove('condition-met');
                }
            });
            
            // Show/hide controls based on size
            const sizeConditions = element.querySelectorAll('[data-condition*="size:"]');
            sizeConditions.forEach(control => {
                const condition = control.getAttribute('data-condition');
                const allowedSizes = condition.replace('size:', '').split(',');
                
                if (allowedSizes.includes(size)) {
                    control.classList.add('condition-met');
                } else {
                    control.classList.remove('condition-met');
                }
            });
        };
        
        viewInputs.forEach(input => {
            input.addEventListener('change', updateConditionalControls);
        });
        
        sizeInputs.forEach(input => {
            input.addEventListener('change', updateConditionalControls);
        });
        
        // Initial update
        updateConditionalControls();
    }
}

window.IconWidget = IconWidget;