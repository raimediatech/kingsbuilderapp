// Image Carousel Widget - Professional Image Slider
// Part of KingsBuilder Phase 2.4: Interactive Widgets

class ImageCarouselWidget {
    constructor() {
        this.type = 'image-carousel';
        this.title = 'Image Carousel';
        this.icon = 'eicon-media-carousel';
        this.category = 'general';
        this.currentSlide = 0;
        this.autoplayInterval = null;
    }
    
    getDefaultSettings() {
        return {
            carousel_images: [
                {
                    image: {
                        url: 'https://via.placeholder.com/800x600/6ec1e4/ffffff?text=Slide+1',
                        alt: 'Slide 1'
                    },
                    caption: 'Slide 1 Caption',
                    link: { url: '', is_external: false, nofollow: false }
                },
                {
                    image: {
                        url: 'https://via.placeholder.com/800x600/f39c12/ffffff?text=Slide+2',
                        alt: 'Slide 2'
                    },
                    caption: 'Slide 2 Caption',
                    link: { url: '', is_external: false, nofollow: false }
                },
                {
                    image: {
                        url: 'https://via.placeholder.com/800x600/e74c3c/ffffff?text=Slide+3',
                        alt: 'Slide 3'
                    },
                    caption: 'Slide 3 Caption',
                    link: { url: '', is_external: false, nofollow: false }
                }
            ],
            slides_to_show: 1,
            slides_to_scroll: 1,
            autoplay: true,
            autoplay_speed: 3000,
            infinite: true,
            show_arrows: true,
            show_dots: true,
            pause_on_hover: true,
            pause_on_focus: true,
            transition_speed: 500,
            transition_type: 'slide',
            image_size: 'large',
            image_fit: 'cover',
            show_captions: true,
            caption_position: 'bottom',
            // Style Settings
            arrow_color: '#ffffff',
            arrow_background_color: 'rgba(0,0,0,0.5)',
            arrow_hover_color: '#ffffff',
            arrow_hover_background_color: 'rgba(0,0,0,0.8)',
            arrow_size: {
                size: 20,
                unit: 'px'
            },
            arrow_border_radius: {
                size: 50,
                unit: '%'
            },
            dots_color: 'rgba(255,255,255,0.5)',
            dots_active_color: '#ffffff',
            dots_size: {
                size: 8,
                unit: 'px'
            },
            dots_spacing: {
                size: 5,
                unit: 'px'
            },
            caption_background_color: 'rgba(0,0,0,0.7)',
            caption_color: '#ffffff',
            caption_typography: {
                font_size: {
                    size: 16,
                    unit: 'px'
                },
                font_weight: '400',
                line_height: 1.4
            },
            carousel_border_radius: {
                size: 10,
                unit: 'px'
            },
            carousel_height: {
                size: 400,
                unit: 'px'
            }
        };
    }
    
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-media-carousel"></i>
                    Carousel Images
                </div>
                
                <!-- Images Repeater -->
                <div class="elementor-control elementor-control-type-repeater">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Images</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-repeater carousel-images-repeater">
                                    <div class="elementor-repeater-fields">
                                        ${this.getImageTemplate()}
                                    </div>
                                    <div class="elementor-repeater-add">
                                        <button type="button" class="elementor-repeater-add-button">
                                            <i class="eicon-plus"></i>
                                            Add Image
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Carousel Settings -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-settings"></i>
                    Carousel Settings
                </div>
                
                <!-- Slides to Show -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Slides to Show</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="slides_to_show" min="1" max="6" value="1" class="elementor-slider-input">
                                    <span class="elementor-slider-value">1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Slides to Scroll -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Slides to Scroll</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="slides_to_scroll" min="1" max="6" value="1" class="elementor-slider-input">
                                    <span class="elementor-slider-value">1</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Autoplay -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Autoplay</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="autoplay" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Autoplay Speed -->
                <div class="elementor-control elementor-control-type-slider" data-condition="autoplay:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Autoplay Speed</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="autoplay_speed" min="1000" max="10000" step="500" value="3000" class="elementor-slider-input">
                                    <span class="elementor-slider-value">3000ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Infinite Loop -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Infinite Loop</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="infinite" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Transition Speed -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Transition Speed</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="transition_speed" min="100" max="2000" step="100" value="500" class="elementor-slider-input">
                                    <span class="elementor-slider-value">500ms</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Transition Type -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Transition</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="transition_type" class="elementor-control-input">
                                    <option value="slide" selected>Slide</option>
                                    <option value="fade">Fade</option>
                                    <option value="scale">Scale</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Image Size -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Image Size</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="image_size" class="elementor-control-input">
                                    <option value="thumbnail">Thumbnail</option>
                                    <option value="medium">Medium</option>
                                    <option value="large" selected>Large</option>
                                    <option value="full">Full Size</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Image Fit -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Image Fit</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="image_fit" class="elementor-control-input">
                                    <option value="cover" selected>Cover</option>
                                    <option value="contain">Contain</option>
                                    <option value="fill">Fill</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Carousel Height -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Height</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="carousel_height" min="200" max="800" step="10" value="400" class="elementor-slider-input">
                                    <span class="elementor-slider-value">400px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Navigation -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-navigation-horizontal"></i>
                    Navigation
                </div>
                
                <!-- Show Arrows -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Show Arrows</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="show_arrows" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Show Dots -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Show Dots</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="show_dots" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Pause on Hover -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Pause on Hover</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="pause_on_hover" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Show Captions -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Show Captions</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="show_captions" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Caption Position -->
                <div class="elementor-control elementor-control-type-select" data-condition="show_captions:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Caption Position</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="caption_position" class="elementor-control-input">
                                    <option value="top">Top</option>
                                    <option value="bottom" selected>Bottom</option>
                                    <option value="center">Center</option>
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
                
                <!-- Arrow Color -->
                <div class="elementor-control elementor-control-type-color" data-condition="show_arrows:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Arrow Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="arrow_color" data-default="#ffffff">
                                    <button type="button" class="pcr-button" style="color: #ffffff;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Arrow Background -->
                <div class="elementor-control elementor-control-type-color" data-condition="show_arrows:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Arrow Background</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="arrow_background_color" data-default="rgba(0,0,0,0.5)">
                                    <button type="button" class="pcr-button" style="color: rgba(0,0,0,0.5);"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Dots Color -->
                <div class="elementor-control elementor-control-type-color" data-condition="show_dots:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Dots Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="dots_color" data-default="rgba(255,255,255,0.5)">
                                    <button type="button" class="pcr-button" style="color: rgba(255,255,255,0.5);"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Active Dots Color -->
                <div class="elementor-control elementor-control-type-color" data-condition="show_dots:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Active Dots Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="dots_active_color" data-default="#ffffff">
                                    <button type="button" class="pcr-button" style="color: #ffffff;"></button>
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
                                    <input type="range" name="carousel_border_radius" min="0" max="50" value="10" class="elementor-slider-input">
                                    <span class="elementor-slider-value">10px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    getImageTemplate() {
        return `
            <div class="elementor-repeater-row">
                <div class="elementor-repeater-row-tools">
                    <i class="elementor-repeater-tool-drag eicon-ellipsis-v"></i>
                    <i class="elementor-repeater-tool-remove eicon-close"></i>
                </div>
                <div class="elementor-repeater-row-controls">
                    <!-- Image -->
                    <div class="elementor-control elementor-control-type-media">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Image</label>
                                <div class="elementor-control-input-wrapper">
                                    <div class="elementor-control-media">
                                        <div class="elementor-control-media-area">
                                            <div class="elementor-control-media-upload-button">
                                                <i class="eicon-plus-circle"></i>
                                                <span>Add Image</span>
                                            </div>
                                        </div>
                                        <input type="hidden" name="image_url" value="">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Caption -->
                    <div class="elementor-control elementor-control-type-text">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Caption</label>
                                <div class="elementor-control-input-wrapper">
                                    <input type="text" name="caption" class="elementor-control-input" value="Image Caption">
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
        
        return `
            <div class="elementor-widget-image-carousel" data-id="${elementData.id}">
                <div class="elementor-image-carousel">
                    <div class="elementor-carousel-wrapper">
                        <div class="elementor-carousel-container">
                            ${this.renderCarouselSlides(settings)}
                        </div>
                        
                        ${settings.show_arrows ? this.renderArrows() : ''}
                    </div>
                    
                    ${settings.show_dots ? this.renderDots(settings) : ''}
                </div>
            </div>
        `;
    }
    
    renderCarouselSlides(settings) {
        if (!settings.carousel_images || settings.carousel_images.length === 0) {
            return '<div class="elementor-carousel-slide"><div class="elementor-image-placeholder">No images configured</div></div>';
        }
        
        return settings.carousel_images.map((image, index) => this.renderCarouselSlide(image, index, settings)).join('');
    }
    
    renderCarouselSlide(image, index, settings) {
        const imageUrl = image.image?.url || 'https://via.placeholder.com/800x600/cccccc/ffffff?text=No+Image';
        const imageAlt = image.image?.alt || `Slide ${index + 1}`;
        const caption = image.caption || '';
        const hasLink = image.link?.url;
        
        const imageElement = `
            <div class="elementor-carousel-image">
                <img src="${imageUrl}" alt="${imageAlt}" loading="lazy">
                ${settings.show_captions && caption ? `
                    <div class="elementor-image-caption elementor-caption-${settings.caption_position}">
                        ${caption}
                    </div>
                ` : ''}
            </div>
        `;
        
        return `
            <div class="elementor-carousel-slide ${index === 0 ? 'elementor-active' : ''}" data-slide="${index}">
                ${hasLink ? 
                    `<a href="${image.link.url}" class="elementor-carousel-link" ${image.link.is_external ? 'target="_blank"' : ''} ${image.link.nofollow ? 'rel="nofollow"' : ''}>${imageElement}</a>` :
                    imageElement
                }
            </div>
        `;
    }
    
    renderArrows() {
        return `
            <div class="elementor-carousel-arrows">
                <button type="button" class="elementor-carousel-arrow elementor-carousel-arrow-prev" aria-label="Previous slide">
                    <i class="eicon-chevron-left" aria-hidden="true"></i>
                </button>
                <button type="button" class="elementor-carousel-arrow elementor-carousel-arrow-next" aria-label="Next slide">
                    <i class="eicon-chevron-right" aria-hidden="true"></i>
                </button>
            </div>
        `;
    }
    
    renderDots(settings) {
        const dotsCount = settings.carousel_images?.length || 0;
        
        return `
            <div class="elementor-carousel-dots">
                ${Array.from({ length: dotsCount }, (_, i) => 
                    `<button type="button" class="elementor-carousel-dot ${i === 0 ? 'elementor-active' : ''}" data-slide="${i}" aria-label="Go to slide ${i + 1}"></button>`
                ).join('')}
            </div>
        `;
    }
    
    generateCSS(settings, elementId) {
        const carouselHeight = `${settings.carousel_height?.size || 400}px`;
        const borderRadius = `${settings.carousel_border_radius?.size || 10}px`;
        const arrowSize = `${settings.arrow_size?.size || 20}px`;
        const arrowBorderRadius = `${settings.arrow_border_radius?.size || 50}%`;
        const dotsSize = `${settings.dots_size?.size || 8}px`;
        const dotsSpacing = `${settings.dots_spacing?.size || 5}px`;
        const transitionSpeed = `${settings.transition_speed || 500}ms`;
        
        return `
            .elementor-element-${elementId} .elementor-image-carousel {
                position: relative;
                overflow: hidden;
                border-radius: ${borderRadius};
                height: ${carouselHeight};
            }
            
            .elementor-element-${elementId} .elementor-carousel-wrapper {
                position: relative;
                width: 100%;
                height: 100%;
            }
            
            .elementor-element-${elementId} .elementor-carousel-container {
                display: flex;
                width: 100%;
                height: 100%;
                transition: transform ${transitionSpeed} ease;
            }
            
            .elementor-element-${elementId} .elementor-carousel-slide {
                flex: 0 0 ${100 / (settings.slides_to_show || 1)}%;
                height: 100%;
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            
            .elementor-element-${elementId} .elementor-carousel-image {
                position: relative;
                width: 100%;
                height: 100%;
                overflow: hidden;
            }
            
            .elementor-element-${elementId} .elementor-carousel-image img {
                width: 100%;
                height: 100%;
                object-fit: ${settings.image_fit || 'cover'};
                object-position: center;
                transition: transform ${transitionSpeed} ease;
            }
            
            .elementor-element-${elementId} .elementor-carousel-link {
                display: block;
                width: 100%;
                height: 100%;
                color: inherit;
                text-decoration: none;
            }
            
            .elementor-element-${elementId} .elementor-carousel-link:hover img {
                transform: scale(1.05);
            }
            
            /* Captions */
            .elementor-element-${elementId} .elementor-image-caption {
                position: absolute;
                left: 0;
                right: 0;
                padding: 15px 20px;
                background-color: ${settings.caption_background_color || 'rgba(0,0,0,0.7)'};
                color: ${settings.caption_color || '#ffffff'};
                font-size: ${settings.caption_typography?.font_size?.size || 16}px;
                font-weight: ${settings.caption_typography?.font_weight || '400'};
                line-height: ${settings.caption_typography?.line_height || 1.4};
                text-align: center;
                transition: opacity ${transitionSpeed} ease;
            }
            
            .elementor-element-${elementId} .elementor-caption-top {
                top: 0;
            }
            
            .elementor-element-${elementId} .elementor-caption-bottom {
                bottom: 0;
            }
            
            .elementor-element-${elementId} .elementor-caption-center {
                top: 50%;
                transform: translateY(-50%);
            }
            
            /* Arrows */
            .elementor-element-${elementId} .elementor-carousel-arrows {
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                transform: translateY(-50%);
                display: flex;
                justify-content: space-between;
                pointer-events: none;
                z-index: 10;
            }
            
            .elementor-element-${elementId} .elementor-carousel-arrow {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 40px;
                height: 40px;
                background-color: ${settings.arrow_background_color || 'rgba(0,0,0,0.5)'};
                color: ${settings.arrow_color || '#ffffff'};
                border: none;
                border-radius: ${arrowBorderRadius};
                cursor: pointer;
                transition: all 0.3s ease;
                pointer-events: auto;
                margin: 0 15px;
            }
            
            .elementor-element-${elementId} .elementor-carousel-arrow:hover {
                background-color: ${settings.arrow_hover_background_color || 'rgba(0,0,0,0.8)'};
                color: ${settings.arrow_hover_color || '#ffffff'};
                transform: scale(1.1);
            }
            
            .elementor-element-${elementId} .elementor-carousel-arrow i {
                font-size: ${arrowSize};
            }
            
            .elementor-element-${elementId} .elementor-carousel-arrow:disabled {
                opacity: 0.3;
                cursor: not-allowed;
                transform: none;
            }
            
            /* Dots */
            .elementor-element-${elementId} .elementor-carousel-dots {
                position: absolute;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                gap: ${dotsSpacing};
                z-index: 10;
            }
            
            .elementor-element-${elementId} .elementor-carousel-dot {
                width: ${dotsSize};
                height: ${dotsSize};
                border-radius: 50%;
                border: none;
                background-color: ${settings.dots_color || 'rgba(255,255,255,0.5)'};
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .elementor-element-${elementId} .elementor-carousel-dot.elementor-active,
            .elementor-element-${elementId} .elementor-carousel-dot:hover {
                background-color: ${settings.dots_active_color || '#ffffff'};
                transform: scale(1.2);
            }
            
            /* Fade Transition */
            .elementor-element-${elementId}[data-transition="fade"] .elementor-carousel-container {
                position: relative;
            }
            
            .elementor-element-${elementId}[data-transition="fade"] .elementor-carousel-slide {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                opacity: 0;
                transition: opacity ${transitionSpeed} ease;
            }
            
            .elementor-element-${elementId}[data-transition="fade"] .elementor-carousel-slide.elementor-active {
                opacity: 1;
            }
            
            /* Scale Transition */
            .elementor-element-${elementId}[data-transition="scale"] .elementor-carousel-slide {
                transform: scale(0.8);
                opacity: 0;
                transition: all ${transitionSpeed} ease;
            }
            
            .elementor-element-${elementId}[data-transition="scale"] .elementor-carousel-slide.elementor-active {
                transform: scale(1);
                opacity: 1;
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .elementor-element-${elementId} .elementor-carousel-arrow {
                    width: 35px;
                    height: 35px;
                    margin: 0 10px;
                }
                
                .elementor-element-${elementId} .elementor-carousel-arrow i {
                    font-size: 16px;
                }
                
                .elementor-element-${elementId} .elementor-image-caption {
                    padding: 10px 15px;
                    font-size: 14px;
                }
                
                .elementor-element-${elementId} .elementor-carousel-dots {
                    bottom: 15px;
                }
            }
        `;
    }
    
    initInteractions(element, elementData) {
        const settings = { ...this.getDefaultSettings(), ...elementData.settings };
        
        // Set transition type
        element.setAttribute('data-transition', settings.transition_type || 'slide');
        
        // Initialize carousel functionality
        this.initCarousel(element, settings);
        
        // Initialize repeater
        const repeater = element.querySelector('.carousel-images-repeater');
        if (repeater) {
            this.initRepeater(repeater);
        }
        
        // Handle conditional controls
        this.handleConditionalControls(element);
    }
    
    initCarousel(element, settings) {
        const container = element.querySelector('.elementor-carousel-container');
        const slides = element.querySelectorAll('.elementor-carousel-slide');
        const prevButton = element.querySelector('.elementor-carousel-arrow-prev');
        const nextButton = element.querySelector('.elementor-carousel-arrow-next');
        const dots = element.querySelectorAll('.elementor-carousel-dot');
        
        if (!container || slides.length === 0) return;
        
        this.currentSlide = 0;
        this.totalSlides = slides.length;
        this.settings = settings;
        
        // Arrow navigation
        if (prevButton && nextButton) {
            prevButton.addEventListener('click', () => this.goToPrevSlide(element));
            nextButton.addEventListener('click', () => this.goToNextSlide(element));
        }
        
        // Dot navigation
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(element, index));
        });
        
        // Keyboard navigation
        element.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.goToPrevSlide(element);
            if (e.key === 'ArrowRight') this.goToNextSlide(element);
        });
        
        // Touch/swipe support
        this.initTouchSupport(element);
        
        // Autoplay
        if (settings.autoplay) {
            this.startAutoplay(element);
            
            if (settings.pause_on_hover) {
                element.addEventListener('mouseenter', () => this.pauseAutoplay());
                element.addEventListener('mouseleave', () => this.startAutoplay(element));
            }
        }
        
        // Update navigation state
        this.updateNavigation(element);
    }
    
    goToSlide(element, slideIndex) {
        const container = element.querySelector('.elementor-carousel-container');
        const slides = element.querySelectorAll('.elementor-carousel-slide');
        const dots = element.querySelectorAll('.elementor-carousel-dot');
        
        if (!container || !slides.length) return;
        
        // Update current slide
        this.currentSlide = slideIndex;
        
        // Update active states
        slides.forEach((slide, index) => {
            slide.classList.toggle('elementor-active', index === slideIndex);
        });
        
        dots.forEach((dot, index) => {
            dot.classList.toggle('elementor-active', index === slideIndex);
        });
        
        // Apply transition
        if (this.settings.transition_type === 'slide') {
            const translateX = -(slideIndex * (100 / (this.settings.slides_to_show || 1)));
            container.style.transform = `translateX(${translateX}%)`;
        }
        
        this.updateNavigation(element);
    }
    
    goToNextSlide(element) {
        let nextSlide = this.currentSlide + (this.settings.slides_to_scroll || 1);
        
        if (nextSlide >= this.totalSlides) {
            nextSlide = this.settings.infinite ? 0 : this.totalSlides - 1;
        }
        
        this.goToSlide(element, nextSlide);
    }
    
    goToPrevSlide(element) {
        let prevSlide = this.currentSlide - (this.settings.slides_to_scroll || 1);
        
        if (prevSlide < 0) {
            prevSlide = this.settings.infinite ? this.totalSlides - 1 : 0;
        }
        
        this.goToSlide(element, prevSlide);
    }
    
    updateNavigation(element) {
        const prevButton = element.querySelector('.elementor-carousel-arrow-prev');
        const nextButton = element.querySelector('.elementor-carousel-arrow-next');
        
        if (!this.settings.infinite) {
            if (prevButton) prevButton.disabled = this.currentSlide === 0;
            if (nextButton) nextButton.disabled = this.currentSlide >= this.totalSlides - 1;
        }
    }
    
    startAutoplay(element) {
        this.pauseAutoplay();
        
        this.autoplayInterval = setInterval(() => {
            this.goToNextSlide(element);
        }, this.settings.autoplay_speed || 3000);
    }
    
    pauseAutoplay() {
        if (this.autoplayInterval) {
            clearInterval(this.autoplayInterval);
            this.autoplayInterval = null;
        }
    }
    
    initTouchSupport(element) {
        let startX = 0;
        let startY = 0;
        let isDragging = false;
        
        element.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
            isDragging = true;
        });
        
        element.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
        });
        
        element.addEventListener('touchend', (e) => {
            if (!isDragging) return;
            
            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            const deltaX = endX - startX;
            const deltaY = endY - startY;
            
            // Only swipe if horizontal movement is greater than vertical
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
                if (deltaX > 0) {
                    this.goToPrevSlide(element);
                } else {
                    this.goToNextSlide(element);
                }
            }
            
            isDragging = false;
        });
    }
    
    initRepeater(repeater) {
        const addButton = repeater.querySelector('.elementor-repeater-add-button');
        const fieldsContainer = repeater.querySelector('.elementor-repeater-fields');
        
        addButton.addEventListener('click', () => {
            const newImage = document.createElement('div');
            newImage.innerHTML = this.getImageTemplate();
            fieldsContainer.appendChild(newImage.firstElementChild);
            
            this.bindImageRemoval(newImage.firstElementChild);
        });
        
        // Bind removal for existing images
        const existingImages = fieldsContainer.querySelectorAll('.elementor-repeater-row');
        existingImages.forEach(image => this.bindImageRemoval(image));
    }
    
    bindImageRemoval(imageRow) {
        const removeButton = imageRow.querySelector('.elementor-repeater-tool-remove');
        removeButton.addEventListener('click', () => {
            imageRow.remove();
        });
    }
    
    handleConditionalControls(element) {
        const autoplayCheckbox = element.querySelector('input[name="autoplay"]');
        const showArrowsCheckbox = element.querySelector('input[name="show_arrows"]');
        const showDotsCheckbox = element.querySelector('input[name="show_dots"]');
        const showCaptionsCheckbox = element.querySelector('input[name="show_captions"]');
        
        const updateConditionalControls = () => {
            const autoplay = autoplayCheckbox?.checked || false;
            const showArrows = showArrowsCheckbox?.checked || false;
            const showDots = showDotsCheckbox?.checked || false;
            const showCaptions = showCaptionsCheckbox?.checked || false;
            
            // Autoplay conditions
            const autoplayConditions = element.querySelectorAll('[data-condition*="autoplay:true"]');
            autoplayConditions.forEach(control => {
                control.classList.toggle('condition-met', autoplay);
            });
            
            // Arrow conditions
            const arrowConditions = element.querySelectorAll('[data-condition*="show_arrows:true"]');
            arrowConditions.forEach(control => {
                control.classList.toggle('condition-met', showArrows);
            });
            
            // Dot conditions
            const dotConditions = element.querySelectorAll('[data-condition*="show_dots:true"]');
            dotConditions.forEach(control => {
                control.classList.toggle('condition-met', showDots);
            });
            
            // Caption conditions
            const captionConditions = element.querySelectorAll('[data-condition*="show_captions:true"]');
            captionConditions.forEach(control => {
                control.classList.toggle('condition-met', showCaptions);
            });
        };
        
        [autoplayCheckbox, showArrowsCheckbox, showDotsCheckbox, showCaptionsCheckbox].forEach(checkbox => {
            if (checkbox) {
                checkbox.addEventListener('change', updateConditionalControls);
            }
        });
        
        updateConditionalControls();
    }
}

window.ImageCarouselWidget = ImageCarouselWidget;