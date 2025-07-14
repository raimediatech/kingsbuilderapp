// Enhanced Image Widget - Advanced Image with Lightbox and Effects
// Part of KingsBuilder Phase 2.1: Media Widgets

class EnhancedImageWidget {
    constructor() {
        this.type = 'enhanced-image';
        this.title = 'Enhanced Image';
        this.icon = 'eicon-image';
        this.category = 'media';
    }
    
    getDefaultSettings() {
        return {
            image: {
                url: 'https://via.placeholder.com/400x300',
                alt: 'Placeholder Image'
            },
            image_size: 'full',
            align: 'center',
            caption_source: 'none',
            caption: '',
            link_to: 'none',
            link: {
                url: '',
                is_external: false,
                nofollow: false
            },
            open_lightbox: 'default',
            lightbox_caption: '',
            hover_animation: 'none',
            css_filters: {
                blur: 0,
                brightness: 100,
                contrast: 100,
                saturation: 100,
                hue: 0
            },
            overlay: {
                type: 'none',
                color: 'rgba(0,0,0,0.5)',
                blend_mode: 'normal',
                opacity: 0.7
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
            },
            lazy_load: true,
            srcset: true
        };
    }
    
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-image"></i>
                    Image Settings
                </div>
                
                <!-- Image Upload -->
                <div class="elementor-control elementor-control-type-media">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Choose Image</label>
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
                
                <!-- Image Size -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Image Size</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="image_size" class="elementor-control-input">
                                    <option value="thumbnail">Thumbnail (150x150)</option>
                                    <option value="medium">Medium (300x300)</option>
                                    <option value="medium_large">Medium Large (768x768)</option>
                                    <option value="large">Large (1024x1024)</option>
                                    <option value="full" selected>Full Size</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Alignment -->
                <div class="elementor-control elementor-control-type-choose">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Alignment</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-choices">
                                    <input type="radio" name="align" value="left" id="align_left">
                                    <label for="align_left" title="Left">
                                        <i class="eicon-text-align-left"></i>
                                    </label>
                                    
                                    <input type="radio" name="align" value="center" id="align_center" checked>
                                    <label for="align_center" title="Center">
                                        <i class="eicon-text-align-center"></i>
                                    </label>
                                    
                                    <input type="radio" name="align" value="right" id="align_right">
                                    <label for="align_right" title="Right">
                                        <i class="eicon-text-align-right"></i>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Caption -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Caption</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="caption_source" class="elementor-control-input">
                                    <option value="none">None</option>
                                    <option value="attachment">Attachment Caption</option>
                                    <option value="custom">Custom Caption</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Custom Caption -->
                <div class="elementor-control elementor-control-type-text" data-condition="caption_source:custom">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Custom Caption</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="text" name="caption" class="elementor-control-input" placeholder="Enter caption...">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Link -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Link</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="link_to" class="elementor-control-input">
                                    <option value="none">None</option>
                                    <option value="file">Media File</option>
                                    <option value="custom">Custom URL</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Custom Link -->
                <div class="elementor-control elementor-control-type-url" data-condition="link_to:custom">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Link URL</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="url" name="link_url" class="elementor-control-input" placeholder="https://...">
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Lightbox -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Lightbox</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="open_lightbox" class="elementor-control-input">
                                    <option value="default">Default</option>
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Effects Section -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-animation"></i>
                    Image Effects
                </div>
                
                <!-- Hover Animation -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Hover Animation</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="hover_animation" class="elementor-control-input">
                                    <option value="none">None</option>
                                    <option value="zoom">Zoom</option>
                                    <option value="zoom-out">Zoom Out</option>
                                    <option value="scale">Scale</option>
                                    <option value="rotate">Rotate</option>
                                    <option value="blur">Blur</option>
                                    <option value="grayscale">Grayscale</option>
                                    <option value="sepia">Sepia</option>
                                    <option value="brightness">Brightness</option>
                                    <option value="slide">Slide</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- CSS Filters -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Blur</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="blur" min="0" max="10" step="0.1" value="0" class="elementor-slider-input">
                                    <span class="elementor-slider-value">0px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Brightness</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="brightness" min="0" max="200" value="100" class="elementor-slider-input">
                                    <span class="elementor-slider-value">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Contrast</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="contrast" min="0" max="200" value="100" class="elementor-slider-input">
                                    <span class="elementor-slider-value">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Saturation</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="saturation" min="0" max="200" value="100" class="elementor-slider-input">
                                    <span class="elementor-slider-value">100%</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Overlay -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Overlay</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="overlay_type" class="elementor-control-input">
                                    <option value="none">None</option>
                                    <option value="color">Color</option>
                                    <option value="gradient">Gradient</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Overlay Color -->
                <div class="elementor-control elementor-control-type-color" data-condition="overlay_type:color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Overlay Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="overlay_color" data-default="rgba(0,0,0,0.5)">
                                    <button type="button" class="pcr-button" style="color: rgba(0,0,0,0.5);" aria-label="Toggle color picker dialog"></button>
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
        
        if (!settings.image?.url) {
            return this.renderPlaceholder();
        }
        
        const imageElement = this.renderImageElement(settings);
        const captionElement = this.renderCaption(settings);
        const wrapperClass = this.getWrapperClass(settings);
        
        return `
            <div class="elementor-widget-enhanced-image ${wrapperClass}" data-id="${elementData.id}">
                <div class="elementor-image-wrapper">
                    ${this.shouldWrapWithLink(settings) ? this.wrapWithLink(imageElement, settings) : imageElement}
                    ${settings.overlay.type !== 'none' ? this.renderOverlay(settings) : ''}
                </div>
                ${captionElement}
            </div>
        `;
    }
    
    renderImageElement(settings) {
        const srcsetAttr = settings.srcset ? this.generateSrcset(settings.image.url) : '';
        const sizesAttr = settings.srcset ? 'sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"' : '';
        
        return `
            <img 
                src="${settings.image.url}"
                alt="${settings.image.alt || ''}"
                ${srcsetAttr ? `srcset="${srcsetAttr}"` : ''}
                ${sizesAttr}
                class="elementor-enhanced-image"
                ${settings.lazy_load ? 'loading="lazy"' : ''}
                data-hover-animation="${settings.hover_animation}"
            >
        `;
    }
    
    renderCaption(settings) {
        let caption = '';
        
        if (settings.caption_source === 'custom' && settings.caption) {
            caption = settings.caption;
        } else if (settings.caption_source === 'attachment' && settings.image.caption) {
            caption = settings.image.caption;
        }
        
        return caption ? `<figcaption class="elementor-image-caption">${caption}</figcaption>` : '';
    }
    
    renderOverlay(settings) {
        const overlayStyle = this.getOverlayStyle(settings);
        
        return `
            <div class="elementor-image-overlay" style="${overlayStyle}"></div>
        `;
    }
    
    shouldWrapWithLink(settings) {
        return settings.link_to !== 'none';
    }
    
    wrapWithLink(content, settings) {
        let href = '';
        let target = '';
        let rel = '';
        
        if (settings.link_to === 'file') {
            href = settings.image.url;
            if (settings.open_lightbox === 'yes' || settings.open_lightbox === 'default') {
                return `<a href="${href}" class="elementor-lightbox" data-elementor-lightbox="${settings.lightbox_caption || settings.image.alt}">${content}</a>`;
            }
        } else if (settings.link_to === 'custom' && settings.link?.url) {
            href = settings.link.url;
            target = settings.link.is_external ? 'target="_blank"' : '';
            rel = settings.link.nofollow ? 'rel="nofollow"' : '';
        }
        
        return `<a href="${href}" ${target} ${rel}>${content}</a>`;
    }
    
    getWrapperClass(settings) {
        const classes = [];
        
        classes.push(`elementor-align-${settings.align}`);
        
        if (settings.hover_animation !== 'none') {
            classes.push(`elementor-animation-${settings.hover_animation}`);
        }
        
        return classes.join(' ');
    }
    
    getOverlayStyle(settings) {
        const styles = [];
        
        if (settings.overlay.type === 'color') {
            styles.push(`background-color: ${settings.overlay.color}`);
        } else if (settings.overlay.type === 'gradient') {
            styles.push(`background: ${settings.overlay.gradient}`);
        }
        
        styles.push(`opacity: ${settings.overlay.opacity}`);
        styles.push(`mix-blend-mode: ${settings.overlay.blend_mode}`);
        
        return styles.join('; ');
    }
    
    generateSrcset(baseUrl) {
        // Generate responsive image srcset
        const sizes = [300, 600, 900, 1200, 1800];
        const srcset = sizes.map(size => {
            // This would typically be handled by your image optimization service
            const responsiveUrl = baseUrl.replace(/\.(jpg|jpeg|png|webp)$/i, `_${size}w.$1`);
            return `${responsiveUrl} ${size}w`;
        });
        
        return srcset.join(', ');
    }
    
    renderPlaceholder() {
        return `
            <div class="elementor-widget-enhanced-image elementor-image-placeholder">
                <div class="elementor-placeholder">
                    <i class="eicon-image"></i>
                    <div class="elementor-placeholder-title">Enhanced Image Widget</div>
                    <div class="elementor-placeholder-description">Choose an image to display with advanced effects</div>
                </div>
            </div>
        `;
    }
    
    generateCSS(settings, elementId) {
        const blur = settings.css_filters?.blur || 0;
        const brightness = settings.css_filters?.brightness || 100;
        const contrast = settings.css_filters?.contrast || 100;
        const saturation = settings.css_filters?.saturation || 100;
        const hue = settings.css_filters?.hue || 0;
        
        return `
            .elementor-element-${elementId} {
                text-align: ${settings.align};
            }
            
            .elementor-element-${elementId} .elementor-image-wrapper {
                position: relative;
                display: inline-block;
                overflow: hidden;
                border-radius: ${settings.border_radius?.top || 0}px ${settings.border_radius?.right || 0}px ${settings.border_radius?.bottom || 0}px ${settings.border_radius?.left || 0}px;
                box-shadow: ${settings.box_shadow?.horizontal || 0}px ${settings.box_shadow?.vertical || 0}px ${settings.box_shadow?.blur || 0}px ${settings.box_shadow?.spread || 0}px ${settings.box_shadow?.color || 'transparent'};
            }
            
            .elementor-element-${elementId} .elementor-enhanced-image {
                max-width: 100%;
                height: auto;
                display: block;
                filter: blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg);
                transition: all 0.3s ease;
            }
            
            .elementor-element-${elementId} .elementor-image-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                pointer-events: none;
                transition: all 0.3s ease;
            }
            
            .elementor-element-${elementId} .elementor-image-caption {
                margin-top: 8px;
                font-size: 14px;
                color: #666;
                text-align: center;
            }
            
            /* Hover Animations */
            .elementor-element-${elementId}.elementor-animation-zoom:hover .elementor-enhanced-image {
                transform: scale(1.1);
            }
            
            .elementor-element-${elementId}.elementor-animation-zoom-out:hover .elementor-enhanced-image {
                transform: scale(0.9);
            }
            
            .elementor-element-${elementId}.elementor-animation-scale:hover .elementor-enhanced-image {
                transform: scale(1.05);
            }
            
            .elementor-element-${elementId}.elementor-animation-rotate:hover .elementor-enhanced-image {
                transform: rotate(5deg);
            }
            
            .elementor-element-${elementId}.elementor-animation-blur:hover .elementor-enhanced-image {
                filter: blur(${blur + 2}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg);
            }
            
            .elementor-element-${elementId}.elementor-animation-grayscale:hover .elementor-enhanced-image {
                filter: blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(0%) hue-rotate(${hue}deg);
            }
            
            .elementor-element-${elementId}.elementor-animation-sepia:hover .elementor-enhanced-image {
                filter: blur(${blur}px) brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg) sepia(100%);
            }
            
            .elementor-element-${elementId}.elementor-animation-brightness:hover .elementor-enhanced-image {
                filter: blur(${blur}px) brightness(120%) contrast(${contrast}%) saturate(${saturation}%) hue-rotate(${hue}deg);
            }
            
            .elementor-element-${elementId}.elementor-animation-slide:hover .elementor-enhanced-image {
                transform: translateX(5px);
            }
            
            /* Responsive */
            @media (max-width: 768px) {
                .elementor-element-${elementId} .elementor-image-wrapper {
                    border-radius: ${Math.max((settings.border_radius?.top || 0) - 4, 0)}px;
                }
            }
        `;
    }
    
    initInteractions(element, elementData) {
        // Handle lightbox functionality
        const lightboxLinks = element.querySelectorAll('.elementor-lightbox');
        lightboxLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const imageUrl = link.getAttribute('href');
                const caption = link.getAttribute('data-elementor-lightbox');
                this.openLightbox(imageUrl, caption);
            });
        });
    }
    
    openLightbox(imageUrl, caption) {
        const lightbox = document.createElement('div');
        lightbox.className = 'elementor-image-lightbox-modal';
        lightbox.innerHTML = `
            <div class="elementor-lightbox-content">
                <button class="elementor-lightbox-close">&times;</button>
                <img src="${imageUrl}" alt="${caption || ''}" class="elementor-lightbox-image">
                ${caption ? `<div class="elementor-lightbox-caption">${caption}</div>` : ''}
            </div>
        `;
        
        lightbox.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.9);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease;
        `;
        
        const content = lightbox.querySelector('.elementor-lightbox-content');
        content.style.cssText = `
            position: relative;
            max-width: 90%;
            max-height: 90%;
            text-align: center;
        `;
        
        const closeBtn = lightbox.querySelector('.elementor-lightbox-close');
        closeBtn.style.cssText = `
            position: absolute;
            top: -40px;
            right: 0;
            background: none;
            border: none;
            color: white;
            font-size: 30px;
            cursor: pointer;
            z-index: 1;
        `;
        
        const img = lightbox.querySelector('.elementor-lightbox-image');
        img.style.cssText = `
            max-width: 100%;
            max-height: 100%;
            border-radius: 8px;
        `;
        
        const captionEl = lightbox.querySelector('.elementor-lightbox-caption');
        if (captionEl) {
            captionEl.style.cssText = `
                color: white;
                margin-top: 16px;
                font-size: 16px;
            `;
        }
        
        // Close handlers
        closeBtn.addEventListener('click', () => document.body.removeChild(lightbox));
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) document.body.removeChild(lightbox);
        });
        
        // Add fade-in animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(lightbox);
    }
}

window.EnhancedImageWidget = EnhancedImageWidget;