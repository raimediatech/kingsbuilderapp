// Image Gallery Widget - Professional Image Gallery System
// Part of KingsBuilder Phase 2.4: Interactive Widgets

class ImageGalleryWidget {
    constructor() {
        this.type = 'image-gallery';
        this.title = 'Image Gallery';
        this.icon = 'eicon-gallery-grid';
        this.category = 'general';
        this.currentLightboxImage = 0;
        this.lightboxOpen = false;
    }
    
    getDefaultSettings() {
        return {
            gallery_images: [
                {
                    image: {
                        url: 'https://via.placeholder.com/400x400/6ec1e4/ffffff?text=Image+1',
                        alt: 'Gallery Image 1'
                    },
                    title: 'Gallery Image 1',
                    description: 'Description for gallery image 1',
                    category: 'nature',
                    link: { url: '', is_external: false, nofollow: false }
                },
                {
                    image: {
                        url: 'https://via.placeholder.com/400x400/f39c12/ffffff?text=Image+2',
                        alt: 'Gallery Image 2'
                    },
                    title: 'Gallery Image 2',
                    description: 'Description for gallery image 2',
                    category: 'architecture',
                    link: { url: '', is_external: false, nofollow: false }
                },
                {
                    image: {
                        url: 'https://via.placeholder.com/400x400/e74c3c/ffffff?text=Image+3',
                        alt: 'Gallery Image 3'
                    },
                    title: 'Gallery Image 3',
                    description: 'Description for gallery image 3',
                    category: 'nature',
                    link: { url: '', is_external: false, nofollow: false }
                },
                {
                    image: {
                        url: 'https://via.placeholder.com/400x400/2ecc71/ffffff?text=Image+4',
                        alt: 'Gallery Image 4'
                    },
                    title: 'Gallery Image 4',
                    description: 'Description for gallery image 4',
                    category: 'people',
                    link: { url: '', is_external: false, nofollow: false }
                },
                {
                    image: {
                        url: 'https://via.placeholder.com/400x400/9b59b6/ffffff?text=Image+5',
                        alt: 'Gallery Image 5'
                    },
                    title: 'Gallery Image 5',
                    description: 'Description for gallery image 5',
                    category: 'architecture',
                    link: { url: '', is_external: false, nofollow: false }
                },
                {
                    image: {
                        url: 'https://via.placeholder.com/400x400/34495e/ffffff?text=Image+6',
                        alt: 'Gallery Image 6'
                    },
                    title: 'Gallery Image 6',
                    description: 'Description for gallery image 6',
                    category: 'people',
                    link: { url: '', is_external: false, nofollow: false }
                }
            ],
            gallery_layout: 'grid',
            columns: 3,
            columns_tablet: 2,
            columns_mobile: 1,
            image_size: 'medium',
            image_ratio: '1:1',
            image_fit: 'cover',
            show_title: true,
            show_description: false,
            show_categories: true,
            enable_lightbox: true,
            enable_filtering: true,
            filter_all_text: 'All',
            masonry_layout: false,
            image_spacing: {
                size: 15,
                unit: 'px'
            },
            image_border_radius: {
                size: 5,
                unit: 'px'
            },
            hover_effect: 'zoom',
            overlay_background: 'rgba(0,0,0,0.7)',
            overlay_color: '#ffffff',
            title_typography: {
                font_size: {
                    size: 16,
                    unit: 'px'
                },
                font_weight: '600',
                line_height: 1.3
            },
            description_typography: {
                font_size: {
                    size: 14,
                    unit: 'px'
                },
                font_weight: '400',
                line_height: 1.4
            },
            filter_background_color: '#f8f9fa',
            filter_color: '#333333',
            filter_active_background_color: '#6ec1e4',
            filter_active_color: '#ffffff',
            filter_border_radius: {
                size: 25,
                unit: 'px'
            },
            lightbox_background: 'rgba(0,0,0,0.9)',
            lightbox_arrow_color: '#ffffff',
            lightbox_close_color: '#ffffff'
        };
    }
    
    getControls() {
        return `
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-gallery-grid"></i>
                    Gallery Images
                </div>
                
                <!-- Images Repeater -->
                <div class="elementor-control elementor-control-type-repeater">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Images</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-repeater gallery-images-repeater">
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
            
            <!-- Gallery Settings -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-settings"></i>
                    Gallery Settings
                </div>
                
                <!-- Gallery Layout -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Layout</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="gallery_layout" class="elementor-control-input">
                                    <option value="grid" selected>Grid</option>
                                    <option value="masonry">Masonry</option>
                                    <option value="justified">Justified</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Columns -->
                <div class="elementor-control elementor-control-type-responsive-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Columns</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-responsive-controls">
                                    <div class="elementor-responsive-control">
                                        <label>Desktop</label>
                                        <input type="range" name="columns" min="1" max="8" value="3" class="elementor-slider-input">
                                        <span class="elementor-slider-value">3</span>
                                    </div>
                                    <div class="elementor-responsive-control">
                                        <label>Tablet</label>
                                        <input type="range" name="columns_tablet" min="1" max="6" value="2" class="elementor-slider-input">
                                        <span class="elementor-slider-value">2</span>
                                    </div>
                                    <div class="elementor-responsive-control">
                                        <label>Mobile</label>
                                        <input type="range" name="columns_mobile" min="1" max="3" value="1" class="elementor-slider-input">
                                        <span class="elementor-slider-value">1</span>
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
                                    <option value="thumbnail">Thumbnail</option>
                                    <option value="medium" selected>Medium</option>
                                    <option value="large">Large</option>
                                    <option value="full">Full Size</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Image Ratio -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Image Ratio</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="image_ratio" class="elementor-control-input">
                                    <option value="1:1" selected>1:1</option>
                                    <option value="3:2">3:2</option>
                                    <option value="4:3">4:3</option>
                                    <option value="16:9">16:9</option>
                                    <option value="21:9">21:9</option>
                                    <option value="auto">Auto</option>
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
                
                <!-- Image Spacing -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Image Spacing</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="image_spacing" min="0" max="50" value="15" class="elementor-slider-input">
                                    <span class="elementor-slider-value">15px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Hover Effect -->
                <div class="elementor-control elementor-control-type-select">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Hover Effect</label>
                            <div class="elementor-control-input-wrapper">
                                <select name="hover_effect" class="elementor-control-input">
                                    <option value="none">None</option>
                                    <option value="zoom" selected>Zoom</option>
                                    <option value="zoom-out">Zoom Out</option>
                                    <option value="move">Move</option>
                                    <option value="blur">Blur</option>
                                    <option value="grayscale">Grayscale</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Display Options -->
            <div class="elementor-control-section">
                <div class="elementor-control-section-title">
                    <i class="eicon-eye"></i>
                    Display Options
                </div>
                
                <!-- Show Title -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Show Title</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="show_title" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Show Description -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Show Description</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="show_description" class="elementor-switch-input">
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Show Categories -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Show Categories</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="show_categories" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Enable Lightbox -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Enable Lightbox</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="enable_lightbox" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Enable Filtering -->
                <div class="elementor-control elementor-control-type-switcher">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Enable Filtering</label>
                            <div class="elementor-control-input-wrapper">
                                <label class="elementor-switch">
                                    <input type="checkbox" name="enable_filtering" class="elementor-switch-input" checked>
                                    <span class="elementor-switch-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Filter All Text -->
                <div class="elementor-control elementor-control-type-text" data-condition="enable_filtering:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">"All" Filter Text</label>
                            <div class="elementor-control-input-wrapper">
                                <input type="text" name="filter_all_text" class="elementor-control-input" value="All">
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
                
                <!-- Border Radius -->
                <div class="elementor-control elementor-control-type-slider">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Border Radius</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="elementor-slider">
                                    <input type="range" name="image_border_radius" min="0" max="50" value="5" class="elementor-slider-input">
                                    <span class="elementor-slider-value">5px</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Overlay Background -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Overlay Background</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="overlay_background" data-default="rgba(0,0,0,0.7)">
                                    <button type="button" class="pcr-button" style="color: rgba(0,0,0,0.7);"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Overlay Text Color -->
                <div class="elementor-control elementor-control-type-color">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Overlay Text Color</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="overlay_color" data-default="#ffffff">
                                    <button type="button" class="pcr-button" style="color: #ffffff;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Filter Background -->
                <div class="elementor-control elementor-control-type-color" data-condition="enable_filtering:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Filter Background</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="filter_background_color" data-default="#f8f9fa">
                                    <button type="button" class="pcr-button" style="color: #f8f9fa;"></button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <!-- Filter Active Background -->
                <div class="elementor-control elementor-control-type-color" data-condition="enable_filtering:true">
                    <div class="elementor-control-content">
                        <div class="elementor-control-field">
                            <label class="elementor-control-title">Filter Active Background</label>
                            <div class="elementor-control-input-wrapper">
                                <div class="pickr-color-picker" data-property="filter_active_background_color" data-default="#6ec1e4">
                                    <button type="button" class="pcr-button" style="color: #6ec1e4;"></button>
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
                    
                    <!-- Title -->
                    <div class="elementor-control elementor-control-type-text">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Title</label>
                                <div class="elementor-control-input-wrapper">
                                    <input type="text" name="title" class="elementor-control-input" value="Gallery Image">
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
                                    <textarea name="description" class="elementor-control-input" rows="2">Image description...</textarea>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Category -->
                    <div class="elementor-control elementor-control-type-text">
                        <div class="elementor-control-content">
                            <div class="elementor-control-field">
                                <label class="elementor-control-title">Category</label>
                                <div class="elementor-control-input-wrapper">
                                    <input type="text" name="category" class="elementor-control-input" value="general">
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
            <div class="elementor-widget-image-gallery elementor-gallery-${settings.gallery_layout} elementor-hover-${settings.hover_effect}" data-id="${elementData.id}">
                ${settings.enable_filtering ? this.renderFilters(settings) : ''}
                <div class="elementor-gallery-container">
                    ${this.renderGalleryItems(settings)}
                </div>
                ${settings.enable_lightbox ? this.renderLightbox(settings) : ''}
            </div>
        `;
    }
    
    renderFilters(settings) {
        const categories = this.getUniqueCategories(settings.gallery_images);
        
        return `
            <div class="elementor-gallery-filters">
                <button type="button" class="elementor-gallery-filter elementor-active" data-filter="*">
                    ${settings.filter_all_text || 'All'}
                </button>
                ${categories.map(category => 
                    `<button type="button" class="elementor-gallery-filter" data-filter="${category}">
                        ${category}
                    </button>`
                ).join('')}
            </div>
        `;
    }
    
    getUniqueCategories(images) {
        if (!images || images.length === 0) return [];
        
        const categories = images.map(img => img.category || 'general');
        return [...new Set(categories)].filter(cat => cat && cat.trim() !== '');
    }
    
    renderGalleryItems(settings) {
        if (!settings.gallery_images || settings.gallery_images.length === 0) {
            return '<div class="elementor-gallery-item"><div class="elementor-gallery-placeholder">No images configured</div></div>';
        }
        
        return settings.gallery_images.map((image, index) => this.renderGalleryItem(image, index, settings)).join('');
    }
    
    renderGalleryItem(image, index, settings) {
        const imageUrl = image.image?.url || 'https://via.placeholder.com/400x400/cccccc/ffffff?text=No+Image';
        const imageAlt = image.image?.alt || image.title || `Gallery Image ${index + 1}`;
        const title = image.title || '';
        const description = image.description || '';
        const category = image.category || 'general';
        const hasLink = image.link?.url;
        
        const overlayContent = `
            <div class="elementor-gallery-item-overlay">
                <div class="elementor-gallery-item-content">
                    ${settings.show_title && title ? `<h3 class="elementor-gallery-item-title">${title}</h3>` : ''}
                    ${settings.show_description && description ? `<p class="elementor-gallery-item-description">${description}</p>` : ''}
                    ${settings.show_categories && category ? `<span class="elementor-gallery-item-category">${category}</span>` : ''}
                </div>
                ${settings.enable_lightbox ? '<div class="elementor-gallery-item-lightbox-button"><i class="eicon-zoom-in-bold"></i></div>' : ''}
            </div>
        `;
        
        const imageElement = `
            <div class="elementor-gallery-item-image">
                <img src="${imageUrl}" alt="${imageAlt}" loading="lazy">
                ${overlayContent}
            </div>
        `;
        
        return `
            <div class="elementor-gallery-item" data-category="${category}" data-index="${index}">
                ${hasLink && !settings.enable_lightbox ? 
                    `<a href="${image.link.url}" class="elementor-gallery-item-link" ${image.link.is_external ? 'target="_blank"' : ''} ${image.link.nofollow ? 'rel="nofollow"' : ''}>${imageElement}</a>` :
                    imageElement
                }
            </div>
        `;
    }
    
    renderLightbox(settings) {
        return `
            <div class="elementor-gallery-lightbox" style="display: none;">
                <div class="elementor-lightbox-backdrop"></div>
                <div class="elementor-lightbox-container">
                    <div class="elementor-lightbox-content">
                        <button type="button" class="elementor-lightbox-close" aria-label="Close">
                            <i class="eicon-close"></i>
                        </button>
                        <button type="button" class="elementor-lightbox-arrow elementor-lightbox-arrow-prev" aria-label="Previous">
                            <i class="eicon-chevron-left"></i>
                        </button>
                        <button type="button" class="elementor-lightbox-arrow elementor-lightbox-arrow-next" aria-label="Next">
                            <i class="eicon-chevron-right"></i>
                        </button>
                        <div class="elementor-lightbox-image">
                            <img src="" alt="">
                        </div>
                        <div class="elementor-lightbox-content-text">
                            <h3 class="elementor-lightbox-title"></h3>
                            <p class="elementor-lightbox-description"></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    generateCSS(settings, elementId) {
        const columns = settings.columns || 3;
        const columnsTablet = settings.columns_tablet || 2;
        const columnsMobile = settings.columns_mobile || 1;
        const imageSpacing = `${settings.image_spacing?.size || 15}px`;
        const borderRadius = `${settings.image_border_radius?.size || 5}px`;
        const filterBorderRadius = `${settings.filter_border_radius?.size || 25}px`;
        
        // Calculate aspect ratio
        const aspectRatio = this.calculateAspectRatio(settings.image_ratio);
        
        return `
            .elementor-element-${elementId} .elementor-gallery-filters {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 10px;
                margin-bottom: 30px;
            }
            
            .elementor-element-${elementId} .elementor-gallery-filter {
                padding: 8px 20px;
                background-color: ${settings.filter_background_color || '#f8f9fa'};
                color: ${settings.filter_color || '#333333'};
                border: none;
                border-radius: ${filterBorderRadius};
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 14px;
                font-weight: 500;
            }
            
            .elementor-element-${elementId} .elementor-gallery-filter:hover,
            .elementor-element-${elementId} .elementor-gallery-filter.elementor-active {
                background-color: ${settings.filter_active_background_color || '#6ec1e4'};
                color: ${settings.filter_active_color || '#ffffff'};
                transform: translateY(-2px);
            }
            
            .elementor-element-${elementId} .elementor-gallery-container {
                display: grid;
                grid-template-columns: repeat(${columns}, 1fr);
                gap: ${imageSpacing};
                ${settings.gallery_layout === 'masonry' ? 'grid-auto-rows: auto;' : ''}
            }
            
            .elementor-element-${elementId} .elementor-gallery-item {
                position: relative;
                overflow: hidden;
                border-radius: ${borderRadius};
                transition: all 0.3s ease;
                ${settings.gallery_layout === 'masonry' ? 'break-inside: avoid;' : ''}
            }
            
            .elementor-element-${elementId} .elementor-gallery-item.elementor-filtered {
                display: none;
            }
            
            .elementor-element-${elementId} .elementor-gallery-item-image {
                position: relative;
                width: 100%;
                ${aspectRatio && settings.image_ratio !== 'auto' ? `aspect-ratio: ${aspectRatio};` : ''}
                overflow: hidden;
                cursor: ${settings.enable_lightbox ? 'pointer' : 'default'};
            }
            
            .elementor-element-${elementId} .elementor-gallery-item-image img {
                width: 100%;
                height: 100%;
                object-fit: ${settings.image_fit || 'cover'};
                object-position: center;
                transition: transform 0.3s ease;
            }
            
            .elementor-element-${elementId} .elementor-gallery-item-link {
                display: block;
                color: inherit;
                text-decoration: none;
            }
            
            /* Hover Effects */
            .elementor-element-${elementId}.elementor-hover-zoom .elementor-gallery-item:hover img {
                transform: scale(1.1);
            }
            
            .elementor-element-${elementId}.elementor-hover-zoom-out .elementor-gallery-item:hover img {
                transform: scale(0.9);
            }
            
            .elementor-element-${elementId}.elementor-hover-move .elementor-gallery-item:hover img {
                transform: translateX(10px) translateY(-10px);
            }
            
            .elementor-element-${elementId}.elementor-hover-blur .elementor-gallery-item:hover img {
                filter: blur(3px);
            }
            
            .elementor-element-${elementId}.elementor-hover-grayscale .elementor-gallery-item:hover img {
                filter: grayscale(100%);
            }
            
            /* Overlay */
            .elementor-element-${elementId} .elementor-gallery-item-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${settings.overlay_background || 'rgba(0,0,0,0.7)'};
                color: ${settings.overlay_color || '#ffffff'};
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: opacity 0.3s ease;
                padding: 20px;
                text-align: center;
            }
            
            .elementor-element-${elementId} .elementor-gallery-item:hover .elementor-gallery-item-overlay {
                opacity: 1;
            }
            
            .elementor-element-${elementId} .elementor-gallery-item-content {
                flex: 1;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }
            
            .elementor-element-${elementId} .elementor-gallery-item-title {
                margin: 0 0 8px 0;
                font-size: ${settings.title_typography?.font_size?.size || 16}px;
                font-weight: ${settings.title_typography?.font_weight || '600'};
                line-height: ${settings.title_typography?.line_height || 1.3};
            }
            
            .elementor-element-${elementId} .elementor-gallery-item-description {
                margin: 0 0 8px 0;
                font-size: ${settings.description_typography?.font_size?.size || 14}px;
                font-weight: ${settings.description_typography?.font_weight || '400'};
                line-height: ${settings.description_typography?.line_height || 1.4};
            }
            
            .elementor-element-${elementId} .elementor-gallery-item-category {
                font-size: 12px;
                opacity: 0.8;
                text-transform: uppercase;
                letter-spacing: 0.5px;
            }
            
            .elementor-element-${elementId} .elementor-gallery-item-lightbox-button {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 40px;
                height: 40px;
                background-color: rgba(255,255,255,0.9);
                color: #333333;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: all 0.3s ease;
                font-size: 18px;
            }
            
            .elementor-element-${elementId} .elementor-gallery-item-lightbox-button:hover {
                background-color: #ffffff;
                transform: scale(1.1);
            }
            
            /* Lightbox */
            .elementor-element-${elementId} .elementor-gallery-lightbox {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background-color: ${settings.lightbox_background || 'rgba(0,0,0,0.9)'};
                z-index: 9999;
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }
            
            .elementor-element-${elementId} .elementor-gallery-lightbox.elementor-active {
                opacity: 1;
                visibility: visible;
            }
            
            .elementor-element-${elementId} .elementor-lightbox-backdrop {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                cursor: pointer;
            }
            
            .elementor-element-${elementId} .elementor-lightbox-container {
                position: relative;
                max-width: 90%;
                max-height: 90%;
                background-color: #ffffff;
                border-radius: 8px;
                overflow: hidden;
                box-shadow: 0 20px 40px rgba(0,0,0,0.3);
            }
            
            .elementor-element-${elementId} .elementor-lightbox-content {
                position: relative;
                display: flex;
                flex-direction: column;
            }
            
            .elementor-element-${elementId} .elementor-lightbox-image {
                position: relative;
                max-height: 70vh;
                overflow: hidden;
            }
            
            .elementor-element-${elementId} .elementor-lightbox-image img {
                width: 100%;
                height: 100%;
                object-fit: contain;
            }
            
            .elementor-element-${elementId} .elementor-lightbox-content-text {
                padding: 20px;
                background-color: #ffffff;
                color: #333333;
            }
            
            .elementor-element-${elementId} .elementor-lightbox-title {
                margin: 0 0 10px 0;
                font-size: 18px;
                font-weight: 600;
            }
            
            .elementor-element-${elementId} .elementor-lightbox-description {
                margin: 0;
                font-size: 14px;
                color: #666666;
                line-height: 1.5;
            }
            
            .elementor-element-${elementId} .elementor-lightbox-close {
                position: absolute;
                top: 15px;
                right: 15px;
                width: 40px;
                height: 40px;
                background-color: rgba(0,0,0,0.5);
                color: ${settings.lightbox_close_color || '#ffffff'};
                border: none;
                border-radius: 50%;
                cursor: pointer;
                z-index: 10;
                transition: all 0.3s ease;
                font-size: 18px;
            }
            
            .elementor-element-${elementId} .elementor-lightbox-close:hover {
                background-color: rgba(0,0,0,0.8);
                transform: scale(1.1);
            }
            
            .elementor-element-${elementId} .elementor-lightbox-arrow {
                position: absolute;
                top: 50%;
                transform: translateY(-50%);
                width: 50px;
                height: 50px;
                background-color: rgba(0,0,0,0.5);
                color: ${settings.lightbox_arrow_color || '#ffffff'};
                border: none;
                border-radius: 50%;
                cursor: pointer;
                z-index: 10;
                transition: all 0.3s ease;
                font-size: 20px;
            }
            
            .elementor-element-${elementId} .elementor-lightbox-arrow:hover {
                background-color: rgba(0,0,0,0.8);
                transform: translateY(-50%) scale(1.1);
            }
            
            .elementor-element-${elementId} .elementor-lightbox-arrow-prev {
                left: 20px;
            }
            
            .elementor-element-${elementId} .elementor-lightbox-arrow-next {
                right: 20px;
            }
            
            /* Responsive */
            @media (max-width: 1024px) {
                .elementor-element-${elementId} .elementor-gallery-container {
                    grid-template-columns: repeat(${columnsTablet}, 1fr);
                }
            }
            
            @media (max-width: 768px) {
                .elementor-element-${elementId} .elementor-gallery-container {
                    grid-template-columns: repeat(${columnsMobile}, 1fr);
                }
                
                .elementor-element-${elementId} .elementor-gallery-item-overlay {
                    padding: 15px;
                }
                
                .elementor-element-${elementId} .elementor-gallery-item-title {
                    font-size: 14px;
                }
                
                .elementor-element-${elementId} .elementor-gallery-item-description {
                    font-size: 12px;
                }
                
                .elementor-element-${elementId} .elementor-lightbox-container {
                    max-width: 95%;
                    max-height: 95%;
                }
                
                .elementor-element-${elementId} .elementor-lightbox-arrow {
                    width: 40px;
                    height: 40px;
                    font-size: 16px;
                }
                
                .elementor-element-${elementId} .elementor-lightbox-arrow-prev {
                    left: 10px;
                }
                
                .elementor-element-${elementId} .elementor-lightbox-arrow-next {
                    right: 10px;
                }
            }
        `;
    }
    
    calculateAspectRatio(ratio) {
        const ratios = {
            '1:1': '1/1',
            '3:2': '3/2',
            '4:3': '4/3',
            '16:9': '16/9',
            '21:9': '21/9'
        };
        
        return ratios[ratio] || null;
    }
    
    initInteractions(element, elementData) {
        const settings = { ...this.getDefaultSettings(), ...elementData.settings };
        
        // Initialize gallery functionality
        this.initGallery(element, settings);
        
        // Initialize repeater
        const repeater = element.querySelector('.gallery-images-repeater');
        if (repeater) {
            this.initRepeater(repeater);
        }
        
        // Handle conditional controls
        this.handleConditionalControls(element);
    }
    
    initGallery(element, settings) {
        // Initialize filtering
        if (settings.enable_filtering) {
            this.initFiltering(element);
        }
        
        // Initialize lightbox
        if (settings.enable_lightbox) {
            this.initLightbox(element, settings);
        }
        
        // Initialize masonry layout
        if (settings.gallery_layout === 'masonry') {
            this.initMasonry(element);
        }
    }
    
    initFiltering(element) {
        const filters = element.querySelectorAll('.elementor-gallery-filter');
        const items = element.querySelectorAll('.elementor-gallery-item');
        
        filters.forEach(filter => {
            filter.addEventListener('click', () => {
                const filterValue = filter.getAttribute('data-filter');
                
                // Update active filter
                filters.forEach(f => f.classList.remove('elementor-active'));
                filter.classList.add('elementor-active');
                
                // Filter items
                items.forEach(item => {
                    const itemCategory = item.getAttribute('data-category');
                    
                    if (filterValue === '*' || filterValue === itemCategory) {
                        item.classList.remove('elementor-filtered');
                        item.style.display = 'block';
                    } else {
                        item.classList.add('elementor-filtered');
                        item.style.display = 'none';
                    }
                });
            });
        });
    }
    
    initLightbox(element, settings) {
        const lightbox = element.querySelector('.elementor-gallery-lightbox');
        const items = element.querySelectorAll('.elementor-gallery-item');
        const closeBtn = lightbox.querySelector('.elementor-lightbox-close');
        const backdrop = lightbox.querySelector('.elementor-lightbox-backdrop');
        const prevBtn = lightbox.querySelector('.elementor-lightbox-arrow-prev');
        const nextBtn = lightbox.querySelector('.elementor-lightbox-arrow-next');
        
        // Open lightbox
        items.forEach((item, index) => {
            const lightboxBtn = item.querySelector('.elementor-gallery-item-lightbox-button');
            if (lightboxBtn) {
                lightboxBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.openLightbox(element, index, settings);
                });
            }
        });
        
        // Close lightbox
        [closeBtn, backdrop].forEach(el => {
            if (el) {
                el.addEventListener('click', () => this.closeLightbox(element));
            }
        });
        
        // Navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prevLightboxImage(element, settings));
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.nextLightboxImage(element, settings));
        }
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightboxOpen) {
                if (e.key === 'Escape') this.closeLightbox(element);
                if (e.key === 'ArrowLeft') this.prevLightboxImage(element, settings);
                if (e.key === 'ArrowRight') this.nextLightboxImage(element, settings);
            }
        });
    }
    
    openLightbox(element, index, settings) {
        const lightbox = element.querySelector('.elementor-gallery-lightbox');
        const lightboxImage = lightbox.querySelector('.elementor-lightbox-image img');
        const lightboxTitle = lightbox.querySelector('.elementor-lightbox-title');
        const lightboxDescription = lightbox.querySelector('.elementor-lightbox-description');
        
        this.currentLightboxImage = index;
        this.lightboxOpen = true;
        
        const images = settings.gallery_images || [];
        const currentImage = images[index];
        
        if (currentImage) {
            lightboxImage.src = currentImage.image?.url || '';
            lightboxImage.alt = currentImage.image?.alt || currentImage.title || '';
            lightboxTitle.textContent = currentImage.title || '';
            lightboxDescription.textContent = currentImage.description || '';
        }
        
        lightbox.classList.add('elementor-active');
        document.body.style.overflow = 'hidden';
    }
    
    closeLightbox(element) {
        const lightbox = element.querySelector('.elementor-gallery-lightbox');
        
        lightbox.classList.remove('elementor-active');
        document.body.style.overflow = '';
        this.lightboxOpen = false;
    }
    
    prevLightboxImage(element, settings) {
        const images = settings.gallery_images || [];
        this.currentLightboxImage = this.currentLightboxImage > 0 ? this.currentLightboxImage - 1 : images.length - 1;
        this.openLightbox(element, this.currentLightboxImage, settings);
    }
    
    nextLightboxImage(element, settings) {
        const images = settings.gallery_images || [];
        this.currentLightboxImage = this.currentLightboxImage < images.length - 1 ? this.currentLightboxImage + 1 : 0;
        this.openLightbox(element, this.currentLightboxImage, settings);
    }
    
    initMasonry(element) {
        // Simple masonry implementation
        const container = element.querySelector('.elementor-gallery-container');
        if (container) {
            container.style.columns = 'auto';
            container.style.columnGap = '15px';
        }
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
        const enableFilteringCheckbox = element.querySelector('input[name="enable_filtering"]');
        
        const updateConditionalControls = () => {
            const enableFiltering = enableFilteringCheckbox?.checked || false;
            
            const filteringConditions = element.querySelectorAll('[data-condition*="enable_filtering:true"]');
            filteringConditions.forEach(control => {
                control.classList.toggle('condition-met', enableFiltering);
            });
        };
        
        if (enableFilteringCheckbox) {
            enableFilteringCheckbox.addEventListener('change', updateConditionalControls);
        }
        
        updateConditionalControls();
    }
}

window.ImageGalleryWidget = ImageGalleryWidget;